const defineReactive = (obj, key, val) => {
	observe(val);

	Object.defineProperty(obj, key, {
		get() {
			console.log(`get`, key);
			return val;
		},
		set(newVal) {
			if (newVal !== val) {
				console.log(`set`, key);
				val = newVal;
				observe(newVal);
			}
		},
	});
};

function observe(obj) {
	if (typeof obj !== 'object' || obj == null) {
		return obj;
	}

	Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
}

function set(obj, key, val) {
	defineReactive(obj, key, val);
}

const obj = {
	foo: 'foo',
	baz: { n: 19 },
};
observe(obj);
obj.foo;
obj.baz;
obj.baz.n = 34;

set(obj, 'dong', 'dong');
obj.dong;

defineReactive(obj, 'g', 'gjk');
