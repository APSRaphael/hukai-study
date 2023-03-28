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

const router = new Router();
const app = new Koa();

router.get('/index',(ctx)=>{
    console.log('ctx :>> ', ctx); // hk-log
    ctx.body = 'hello world'
})

app.use(router.routes);
app.listen(3000);
