let Vue;
class Store {
	constructor(options) {
		this._mutations = options.mutations;
		this._actions = options.actions;
		this._wrappedGetters = options.getters;

		// Vue.util.defineReactive()
		// this.state = new Vue({
		//     data: options.state,
		// });

		const computed = {};
		this.getters = {};
		const store = this;
		Object.keys(store._wrappedGetters).forEach((key) => {
			const fn = store._wrappedGetters[key];
			computed[key] = function() {
				return fn(store.state);
			};

			Object.defineProperty(store.getters, key, {
				get: () => store._vm[key],
			});
		});

		this._vm = new Vue({
			data: {
				$$state: options.state,
			},
			computed,
		});
		this.commit = this.commit.bind(this);
		this.dispatch = this.dispatch.bind(this);
	}

	get state() {
		// return this._vm.$data.$$state
		return this._vm._data.$$state;
	}

	set state(val) {
		console.err('请使用 replaceState重置状态');
	}
	commit(type, payload) {
		const mutation = this._mutations[type];
		if (!mutation) {
			console.error('mutation 不存在');
			return;
		}
		mutation(this.state, payload);
	}
	dispatch(type, payload) {
		const actions = this._actions[type];
		if (!actions) {
			console.error('actions 不存在');
			return;
		}
		actions(this, payload);
	}
}

function install(_Vue) {
	Vue = _Vue;
	Vue.mixin({
		beforeCreate() {
			if (this.$options.store) {
				Vue.prototype.$store = this.$options.store;
			}
		},
	});
}

export default { Store, install };
