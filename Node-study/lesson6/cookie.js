const http = require('http');

http
	.createServer((req, res) => {
		const { headers } = req;
		console.log('headers.cookie :>> ', headers.cookie); // hk-log
		res.setHeader('Set-Cookie', 'abc=567');
		res.end('hellow cookie');
	})
	.listen(3000, () => {
		console.log('server at 3000 :>> '); // hk-log
	});
