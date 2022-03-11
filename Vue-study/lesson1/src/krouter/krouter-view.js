export default {
	render(h) {
		// 标记当前 router-view 深度
		this.$vnode.data.routeView = true;
		let depth = 0;
		let parent = this.$parent;
		while (parent) {
			const vnodeData = parent.$vnode && parent.$vnode.data;
			if (vnodeData) {
				if (vnodeData.routeView) {
					depth++;
				}
			}
			parent = parent.$parent;
		}
		let component = null;
		const route = this.$router.matched[depth];
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
