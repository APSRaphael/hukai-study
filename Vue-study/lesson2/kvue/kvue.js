export default class KVue {
	constructor(options) {
		this.$options = options;
		this.$data = options.data;

		observe(options.data);

		proxy(this);
		console.log('1111 :>> ', 1111);
		new Compiler(options.el, this);
	}
}

function observe(obj) {
	if (typeof obj !== 'object' || obj == null) {
		return obj;
	}
	new Observe(obj);
}

const originalProto = Array.prototype;

const arrayProto = Object.create(originalProto);
['push', 'pop', 'shift', 'unshift'].forEach((method) => {
	arrayProto[method] = function() {
		originalProto[method].apply(this, arguments);
		console.log(`更新了方法`, method);
	};
});

class Observe {
	constructor(obj) {
		this.obj = obj;
		console.log('obj :>> ', obj);
		if (Array.isArray(obj)) {
			obj.__proto__ = arrayProto;
			const keys = Object.keys(obj);
			for (let i = 0; i < keys.length; i++) {
				observe(obj[i]);
			}
		} else {
			this.walk(obj);
		}
	}

	walk(obj) {
		Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
	}
}

function defineReactive(obj, key, val) {
	observe(val);

	const dep = new Dep();
	console.log('777 :>> ', 777);
	Object.defineProperty(obj, key, {
		get() {
			console.log('888 :>> ', 888);
			console.log('Dep.target :>> ', Dep.target);
			Dep.target && dep.addDep(Dep.target);
			return val;
		},
		set(newVal) {
			if (val !== newVal) {
				val = newVal;
				observe(val);
				dep.notify();
			}
		},
	});
}

function proxy(vm) {
	Object.keys(vm.$data).forEach((key) => {
		Object.defineProperty(vm, key, {
			get() {
				return vm.$data[key];
			},
			set(newVal) {
				vm.$data[key] = newVal;
			},
		});
	});
}

class Compiler {
	constructor(el, vm) {
		this.$vm = vm;
		this.$el = document.querySelector(el);
		console.log(`this.$el`, this.$el);
		this.compile(this.$el);
	}
	compile(n) {
		const childNodes = n.childNodes;
		childNodes.forEach((node) => {
			if (this.isElement(node)) {
				this.elementCompiler(node);
				if (node.childNodes) {
					this.compile(node);
				}
			} else if (this.isInter(node)) {
				this.textCompiler(node);
			}
		});
	}

	isElement(node) {
		return node.nodeType === 1;
	}

	elementCompiler(n) {
		const attrs = n.attributes;
		[...attrs].forEach((attr) => {
			const attrName = attr.name;
			const exp = attr.value;
			if (this.isDir(attrName)) {
				const dir = attrName.substring(2);
				this[dir] && this[dir](n, exp);
			}
			if (this.isEvent(attrName)) {
				const dir = attrName.substring(1);
				this.eventHandler(n, exp, dir);
			}
		});
	}

	isInter(node) {
		return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
	}
	textCompiler(n) {
		this.update(n, RegExp.$1, 'text');
		// 不能通用，获取到的是p 标签里面的文本节点
		// this.update(n, RegExp.$1, 'html');
	}
	html(n, exp) {
		// 可以通用，获取到的都是 p 元素
		// this.update(n, exp, 'text');
		this.update(n, exp, 'html');
	}

	isDir(attrName) {
		return attrName.startsWith('k-');
	}

	text(n, exp) {
		this.update(n, exp, 'text');
	}

	model(n, exp) {
		this.update(n, exp, 'model');
		n.addEventListener('input', (e) => {
			this.$vm[exp] = e.target.value;
		});
	}

	isEvent(attrName) {
		return attrName.startsWith('@');
	}

	update(n, exp, dir) {
		console.log('dir :>> ', dir);
		const fn = this[dir + 'Updater'];
		console.log('fn :>> ', fn);
		console.log(555555, exp);
		fn && fn(n, this.$vm[exp]);
		new Watcher(this.$vm, exp, (val) => {
			fn && fn(n, val);
		});
	}

	textUpdater(n, val) {
		n.textContent = val;
	}
	htmlUpdater(n, val) {
		n.innerHTML = val;
	}
	modelUpdater(n, val) {
		n.value = val;
	}

	eventHandler(n, exp, dir) {
		const fn = this.$vm.$options.methods && this.$vm.$options.methods[exp];
		n.addEventListener(dir, fn.bind(this.$vm));
	}
}

class Watcher {
	constructor(vm, key, updater) {
		console.log(666666, key);
		this.vm = vm;
		this.key = key;
		this.updater = updater;

		Dep.target = this;
		this.vm[this.key];
		Dep.target = null;
	}

	update() {
		this.updater.call(this.vm, this.vm[this.key]);
	}
}

class Dep {
	constructor() {
		this.deps = [];
	}
	addDep(watch) {
		this.deps.push(watch);
	}

	notify() {
		this.deps.forEach((watch) => watch.update());
	}
}
