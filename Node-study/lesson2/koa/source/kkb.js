const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');
class KKB {
	constructor() {
		this.middlewares = [];
	}
	listen(...args) {
		const server = http.createServer(async (req, res) => {
			// this.callback(req, res);
			const ctx = this.createContext(req, res);

			// 合成函数
			// this.callback(ctx);
			const fn = this.compose(this.middlewares);

			await fn(ctx);
			// 响应
			res.end(ctx.body);
		});
		server.listen(...args);
	}
	// use(callback) {
	// 	this.callback = callback;
	// }
	use(middleware) {
		console.log('middleware :>> ', middleware); // hk-log
		this.middlewares.push(middleware);
	}
	// 创建上下文
	createContext(req, res) {
		const ctx = Object.create(context);
		ctx.request = Object.create(request);
		ctx.response = Object.create(response);
		ctx.req = ctx.request.req = req;
		ctx.res = ctx.response.res = res;

		return ctx;
	}

	// 合成函数
	// compose(middlewares) {
	// 	return function (ctx) {
	// 		return dispatch(0);
	// 		function dispatch(i) {
	// 			let fn = middlewares[i];
	// 			if (!fn) {
	// 				return Promise.resolve();
	// 			}
	// 			return Promise.resolve(
	// 				fn(ctx, function next() {
	// 					return dispatch(i + 1);
	// 				})
	// 			);
	// 		}
	// 	};
	// }

	compose = (middlewares) => (ctx) => {
		const dispatch = (i) => {
			let fn = middlewares[i];
			if (!fn) {
				return Promise.resolve();
			}
			return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
		};
		return dispatch(0);
	};
}

module.exports = KKB;
