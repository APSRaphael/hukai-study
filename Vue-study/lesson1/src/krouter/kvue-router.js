import Link from './krouter-link';
import View from './krouter-view';

let Vue;

class VueRouter {
	constructor(options) {
		this.options = options;
		// Vue.util.defineReactive(
		// 	this,
		// 	'current',
		// 	window.location.hash.slice(1) || '/'
		// );

		this.current = window.location.hash.slice(1) || '/';
		Vue.util.defineReactive(this, 'matched', []);
		this.match()


		window.addEventListener('hashchange', this.onHashChange.bind(this));
		window.addEventListener('load', this.onHashChange.bind(this));
		// this.routeMap = {};
		// options.routes.forEach((route) => {
		// 	this.routeMap[route.path] = route;
		// });
	}

	onHashChange() {
		this.current = window.location.hash.slice(1);
		this.matched= []
		this.match()
	}

	match(r) {
		const routes = r || this.options.routes;
		for (const route of routes) {
			if (route.path === '/' && this.current === '/') {
				this.matched.push(route);
				return;
			}
			if (route.path !== '/' && this.current.indexOf(route.path) !== -1) {
				this.matched.push(route);
				if (route.children) {
					this.match(route.children);
				}
				return;
			}
		}
	}
}

VueRouter.install = function(_Vue) {
	Vue = _Vue;
	Vue.mixin({
		beforeCreate() {
			if (this.$options.router) {
				Vue.prototype.$router = this.$options.router;
			}
		},
	});
	Vue.component('router-view', View);
	Vue.component('router-link', Link);
};

export default VueRouter;
