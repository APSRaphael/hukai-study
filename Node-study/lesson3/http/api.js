const http = require('http');
const fs = require('fs');

http
	.createServer((req, res) => {
		const { method, url } = req;
		console.log('url :>> ', url); // hk-log
		console.log('method :>> ', method); // hk-log
		console.log('cookie :>> ', req.headers.cookie); // hk-log
		if (method === 'GET' && url === '/') {
			fs.readFile('./index.html', (err, data) => {
				res.setHeader('Content-Type', 'text/html');
				res.end(data);
			});
		} else if (method === 'GET' && url === '/api/users') {
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Access-Control-Allow-origin', 'http://localhost:3000');
			res.setHeader('Access-Control-Allow-Credentials', 'true');
			res.setHeader('Set-Cookie', 'cookie=123');
			res.end(JSON.stringify([{ name: 'tom', age: 20 }]));
			console.log(' end....:>> '); // hk-log
		} else if (method === 'OPTIONS') {
			console.log('method :>> ', method); // hk-log
			res.setHeader('Access-Control-Allow-Credentials', 'true');
			res.writeHead(200, {
				'Access-Control-Allow-Origin': 'http://localhost:3000',
				'Access-Control-Allow-Headers': 'X-Token,Content-Type',
				'Access-Control-Allow-Methods': 'PUT',
			});
			res.end();
		} else if (method === 'POST' && url === '/api/save') {
			const reqData = [];
			req.on('data', (data) => {
				reqData.push(data);
			});
			req.on('end', () => {
				const data = Buffer.concat(reqData);
				console.log('data :>> ', data.toString()); // hk-log
				res.end(`formData:${data.toString()}`);
			});
		}
	})
	.listen(4000, () => {
		console.log('api listen at ' + 4000);
	});
