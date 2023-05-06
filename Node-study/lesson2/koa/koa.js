const koaServerHttpProxy = require('koa-server-http-proxy');
const static = require('koa-static');
const Koa = require('koa');


let app = new Koa();

app.use(
	koaServerHttpProxy('/api', {
		target: 'http://localhost:7001',
		pathRewrite: { '^/api': '' },
	})
);



app.listen(4000, () => {
	console.log('监听 4000 端口 :>> '); // hk-log
});
