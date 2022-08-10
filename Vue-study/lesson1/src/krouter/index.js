import Vue from "vue";
// import VueRouter from 'vue-router'
import VueRouter from "./kvue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},

	{
		path: "/three",
		name: "three",
		component: () =>
			import(/* webpackChunkName: "about" */ "../views/Three.vue"),
	},
	{
		path: "/about",
		name: "About",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () =>
			import(/* webpackChunkName: "about" */ "../views/About.vue"),
		children: [
			{
				path: "/about/info",
				component: () =>
					import(/* webpackChunkName: "about" */ "../views/About.vue"),
				children: [
					{
						path: "/about/info/detail",
						component: () =>
							import(/* webpackChunkName: "about" */ "../views/About.vue"),
						children: [
							{
								path: "/about/info/detail/two",
								component: {
									render(h) {
										return h("div", "info page1");
									},
								},
							},
						],
					},
				],
			},
			{
				path: "/about/two",
				component: {
					render(h) {
						return h("div", "info page2");
					},
				},
			},
			{
				path: "/about/three",
				component: {
					render(h) {
						return h("div", "info page3");
					},
				},
			},
			{
				path: "/about/four",
				component: {
					render(h) {
						return h("div", "info page4");
					},
				},
			},
		],
	},
];
const router = new VueRouter({
	routes,
});

export default router;
