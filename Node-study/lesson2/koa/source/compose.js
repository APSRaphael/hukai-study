const add = (x, y) => x + y;
const square = (z) => z * z;
const fn = (x, y) => square(add(x, y));

// const compose =
// 	(fn1, fn2) =>
// 	(...args) =>
// 		fn2(fn1(...args));

// const compose =
// 	(...[first, ...other]) =>
// 	(...args) => {
// 		let ret = first(...args);
// 		other.forEach((fn) => {
// 			ret = fn(ret);
// 		});
// 		return ret;
// 	};

function compose(middlewares) {
	return function () {
		return dispatch[0];
		function dispatch(i) {
			let fn = middlewares[i];
			if (!fn) {
				return Promise.resolve();
			}
			return Promise.resolve(
				fn(function next() {
					return dispatch(i + 1);
				})
			);
		}
	};
}



console.log(' :>> ', compose(add, square, square)(1, 2)); // hk-log
