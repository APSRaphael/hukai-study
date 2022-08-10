export default {
	render(h) {
		console.log('111122 :>> ', 111122); // hk-log
		// 标记当前 router-view 深度
		this.$vnode.data.routeView = true;
		let depth = 0;
		let parent = this.$parent;
		while (parent) {
			// console.log('parent :>> ', parent); // hk-log
			const vnodeData = parent.$vnode && parent.$vnode.data;
			// console.log('vnodeData :>> ', vnodeData); // hk-log
			if (vnodeData) {
				if (vnodeData.routeView) {
					depth++;
				}
			}
			parent = parent.$parent;
		}
		let component = null;
		console.log('depth :>> ', depth); // hk-log/
		// console.log('this.$router.matched :>> ', this.$router.matched); // hk-log
		const route = this.$router.matched[depth];
		console.log('route :>> ', route); // hk-log
		if (route) {
			component = route.component;
		}
		return h(component);
		// let component = null;
		// const { current, options } = this.$router;
		// const route = options.routes.find((route) => route.path === current);
		// if (route) {
		// 	component = route.component;
		// }
		// return h(component);
	},
};
