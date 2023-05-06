const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

app.use((ctx, next) => {
	// 可以把这下面这些代码统一写到这里，类似一个中间件，所有请请求都会经过
	// 允许客户端设置请求头
	ctx.set('Access-Control-Allow-Headers', '');
	// 设置跨域
	ctx.set('Access-Control-Allow-Origin', 'http://localhost:5500');
	next()b
});
// 如果客户端设置的请求头不是简单类型会走 options，先校验一下。只要 options 有返回就说明能通过校验。返回空内容也算
router.options('/*', (ctx) => {
	// 允许客户端设置请求头
	ctx.set('Access-Control-Allow-Headers', '');
	// 设置跨域
	ctx.set('Access-Control-Allow-Origin', 'http://localhost:5500');
	ctx.body = '';
});

router.get('/getAjax', (ctx, next) => {
	console.log('ctx :>> ', ctx); // hk-log
	ctx.set('Access-Control-Allow-Origin', 'http://localhost:5500');
	// ctx.set('Access-Control-Allow-Origin', '*');
	ctx.body = { info: 'i am at 3000' };
});

router.get('/', (ctx, next) => {
	ctx.body = 'hello';
});

app.use(router.routes());
app.listen(3000);
