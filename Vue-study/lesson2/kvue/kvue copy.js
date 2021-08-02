function defineReactive(obj, key, val) {
	observe(val);
	const dep = new Dep();
	Object.defineProperty(obj, key, {
		get() {
			console.log(`get`, key);
			Dep.target && dep.addDep(Dep.target);
			return val;
		},
		set(newVal) {
			if (newVal !== val) {
				val = newVal;
				observe(newVal);
				dep.notify();
			}
		},
	});
}

function observe(obj) {
	if (typeof obj !== 'object' || obj == null) {
		return obj;
	}
	new Observe(obj);
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
class Observe {
	constructor(obj) {
		if (Array.isArray(obj)) {
		} else {
			this.walk(obj);
		}
	}

	walk(obj) {
		Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
	}
}

class KVue {
	constructor(options) {
		this.$options = options;
		this.$data = options.data;

		observe(options.data);

		proxy(this);

		new Compile(options.el, this);
	}
}

class Compile {
	constructor(el, vm) {
		this.$vm = vm;
		this.$el = document.querySelector(el);
		if (this.$el) {
			this.compile(this.$el);
		}
	}

	compile(n) {
		const childNodes = n.childNodes;
		childNodes.forEach((node) => {
			if (this.isElement(node)) {
				this.compileElement(node);
				if (node.childNodes.length) {
					this.compile(node);
				}
			} else if (this.isInter(node)) {
				this.compileText(node);
			}
		});
	}

	isElement(n) {
		return n.nodeType === 1;
	}
	compileElement(n) {
		const attrs = n.attributes;
		Array.from(attrs).forEach((attr) => {
			const attrName = attr.name;
			const exp = attr.value;
			if (this.isDir(attrName)) {
				const dir = attrName.substring(2);
				this[dir] && this[dir](n, exp);
			} else if(this.isClick(attrName)){
				// const fn = this.$vm.$options.methods[exp]
			}
		});
	}

	isInter(n) {
		return n.nodeType === 3 && /\{\{(.*)\}\}/.test(n.textContent);
	}

	compileText(n) {
		this.update(n, RegExp.$1, 'text');
		// n.textContent = this.$vm[RegExp.$1];
	}

	update(node, exp, dir) {
		const fn = this[dir + 'Updater'];
		fn && fn(node, this.$vm[exp]);

		new Watcher(this.$vm, exp, (val) => {
			fn && fn(node, val);
		});
	}

	isDir(name) {
		return name.startsWith('k-');
	}

	isClick(name){
		return name.startsWith('@click')
	}

	text(node, exp) {
		this.update(node, exp, 'text');
		// node.textContent = this.$vm[exp];
	}

	textUpdater(node, val) {
		console.log(`node`, node);
		node.textContent = val;
	}

	html(node, exp) {
		this.update(node, exp, 'html');
	}
	htmlUpdater(node, val) {
		node.innerHTML = val;
	}

	clickEvent(node, val){

	}
}

class Watcher {
	constructor(vm, key, updater) {
		this.vm = vm;
		this.key = key;
		this.updater = updater;

		Dep.target = this;
		this.vm[this.key];
		Dep.target = null;
	}

	update() {
		console.log(`1111`, 1111);
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
