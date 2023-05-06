const Koa = require('koa');
const static = require('koa-static');
const Router = require('koa-router');
const { koaBody } = require('koa-body');
let app = new Koa();
app.use(static(__dirname + ''));
app.use(koaBody({ multipart: true }));

const router = new Router();

router.get('/', (ctx, next) => {
	ctx.body = 'hello';
});

router.post('/upload', (ctx, next) => {
	console.log('ctx.request.body :>> ', ctx.request.body); // hk-log
	console.log('ctx.request.files :>> ', ctx.request.files); // hk-log
});

app.use(router.routes());

app.listen(5500, () => {
	console.log('3000 :>> ', 5500); // hk-log
});
