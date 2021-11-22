class Router {
	constructor() {
		this.stack = [];
	}

	register(path, methods, middleware) {
		let route = { path, methods, middleware };
		this.stack.push(route);
	}

	get(path, middleware) {
		this.register(path, 'get', middleware);
	}

	post(path, middleware) {
		this.register(path, 'post', middleware);
	}

	routes() {
		let stock = this.stack;
		return async (ctx, next) => {
            let currentPath = ctx.url;
            console.log('currentPath :>> ', currentPath); // hk-log
            console.log('ctx.methods :>> ', ctx.method); // hk-log
            // console.log('ctx :>> ', ctx); // hk-log
			let route;
			for (let i = 0; i < stock.length; i++) {
				const item = stock[i];
                console.log('item :>> ', item); // hk-log
				if (
					currentPath === item.path &&
					item.methods.indexOf(ctx.method) >= 0
				) {
					route = item.middleware;
					break;
				}
			}
			if (typeof route === 'function') {
				route(ctx, next);
				return;
            };
            await next()
        }
	}
}

module.exports = Router;
