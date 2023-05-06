// const Koa = require('koa');
// const Router = require('koa-router');
// const static = require('koa-static');
// const app = new Koa();
// const router = new Router();

// router.get('/index', (ctx) => {
// 	console.log('ctx :>> ', ctx); // hk-log
//     ctx.body = 'hello world'
// });

// app.use(router.routes());
// app.listen(4000);

const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const { koaBody } = require('koa-body');

const router = new Router();
const app = new Koa();
app.use(koaBody());

app.use(static(__dirname + '/'));
router.get('/', (ctx) => {
	console.log('ctx :>> ', ctx); // hk-log
	ctx.body = 'hello world';
});

router.get('/get', (ctx) => {
    console.log('ctx.params :>> ', ctx.query); // hk-log
	console.log('get请求过来');
	ctx.body = {
		info: 'get返还数据',
	};
});

app.use(router.routes());
app.listen(3000);
