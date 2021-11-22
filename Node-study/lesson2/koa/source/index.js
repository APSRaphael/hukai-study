// const http = require('http');
// const server = http.createServer((req, res) => {
// 	res.writeHead(200);
// 	res.end('hi kaikeba');
// });
// server.listen(3000, () => {
// 	console.log('server at 3000');
// });

const KKB = require('./kkb');
const Router = require('./router');
const router = new Router();
const app = new KKB();
// app.use((req, res) => {
// 	res.writeHead(200);
// 	res.end('hi kaikeba33');
// });

// const delay = () => new Promise((resolve) => setTimeout(() => resolve(), 2000));

// app.use(async (ctx, next) => {
// 	ctx.body = '1';
//     console.log('1111 :>> ', 1111); // hk-log
// 	await next();
// 	ctx.body += '5';
// });
// app.use(async (ctx, next) => {
// 	ctx.body += '2';
//     await delay()
// 	await next();
// 	ctx.body += '4';
// });
// app.use(async (ctx, next) => {
// 	ctx.body += '3';
// });

router.get('/index', async (ctx) => {
	ctx.body = 'index page';
});
router.get('/post', async (ctx) => {
	ctx.body = 'post page';
});
router.get('/list', async (ctx) => {
	ctx.body = ',list page';
});
router.post('/index', async (ctx) => {
	ctx.body = 'index ost page';
});

// 路由实列输出父中间件 router.routes()
app.use(router.routes());
// app.use((ctx) => {
// 	ctx.body = 'hehe';
// });
// app.use((ctx) => {
// 	ctx.body = 'haha';
// });

app.listen(3000, () => {
	console.log('server at 3000');
});
