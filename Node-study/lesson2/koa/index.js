const Koa = require('koa');
const app = new Koa();

app
	.use((ctx, next) => {
		// console.log('ctx :>> ', JSON.stringify(ctx, null, 2)); // hk-log
		next();
		console.log('5678 :>> ', 5678); // hk-log
		const start = Date.now();
		console.log('start :>> ', start); // hk-log
		ctx.body = { name: 'jerry' };
		const end = Date.now();
		console.log('end :>> ', end); // hk-log
	})
	.use((ctx, next) => {
		console.log('1234 :>> ', 1234); // hk-log
	})
	.listen(3000, () => {
		console.log('server at 3000 :>> '); // hk-log
	});
