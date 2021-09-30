const http = require('http');
const fs = require('fs');

const server = http.createServer((request, response) => {
	// console.log('res :>> ', getPrototypeChain(response)); // hk-log
	// console.log('req :>> ', getPrototypeChain(request)); // hk-lo

	const { url, method, headers } = request;

	console.log('url :>> ', url); // hk-log
	console.log('method :>> ', method); // hk-log

	// response.end('hello world');

	if (url === '/' && method === 'GET') {
		fs.readFile('index.html', (err, data) => {
			console.log('err :>> ', err); // hk-log
			if (err) {
				response.writeHead(500, {
					'Content-Type': 'text/plain; charset=utf-8',
				});
				response.end('500， 服务器错误');
				return;
			}

			response.statusCode = 200;
			response.setHeader('Content-Type', 'text/html');
			response.end(data);
		});
	} else if (url === '/user' && method === 'GET') {
		response.writeHead(200, { 'Conternt-Type': 'application/json' });
		response.end(JSON.stringify({ name: 'tom' }));
	} else if (method === 'GET' && headers.accept.indexOf('image/*') !== -1) {
		// 统一描述所有图片请求 不使用 fs.readFile 方法，该方法会把图片先缓存到内存中会占用很大空间
		fs.createReadStream('.' + url).pipe(response);
	} else {
		response.statusCode = 404;
		response.setHeader('Content-Type', 'text/plain; charset=utf-8');
		response.end('404 页面没招待');
	}
});

server.listen(3000, () => {
	console.log('server at 3000 :>> '); // hk-log
});

function getPrototypeChain(obj) {
	var protoChain = [];
	while ((obj = Object.getPrototypeOf(obj))) {
		protoChain.push(obj);
	}

	return protoChain;
}
