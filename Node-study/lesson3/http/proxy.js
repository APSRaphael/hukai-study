const express = require('express');
const proxy = require('http-proxy-middleware');

console.log('proxy :>> ', proxy); // hk-log
const app = express();

app.use(express.static(__dirname + '/'));
app.use('/api', proxy.createProxyMiddleware({ target: 'http://localhost:4000' }));
app.listen(3000, () => {
	console.log('express at :>> ' + 3000); // hk-log
});
