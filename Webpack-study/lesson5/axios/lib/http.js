const express = require('express');
const bodyParse = require('body-parser');
const app = express();
const router = express.Router();

const fs = require('fs');
router.get('/getCount', (req, res) => {
	setTimeout(() => {
		res.json({
			success: true,
			code: 200,
			data: 100,
		});
	}, 1000);
});

router.get('/downFile', (req, res, next) => {
	var name = 'download.txt';
	var path = './' + name;
	var size = fs.statSync(path).size;
	var f = fs.createReadStream(path);
	res.writeHead(200, {
		'Content-Type': 'application/force-download',
		'Content-Disposition': 'attachment; filename=' + name,
		'Content-Length': size,
	});
	f.pipe(res);
});

app.all('*', function (request, response, next) {
	response.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
	response.header(
		'Access-Control-Allow-Headers',
		'Content-Type, Content-Length, Authorization,Accept,X-Requested-With'
	);
	response.header('Access-Allow-Expose-Headers', 'Content-Disposition');
	response.header('Access-Control-Allow-Credentials', 'true');
	response.header(
		'Content-Control-Allow-Methods',
		'PUT, POST, GET, DELETE,OPTIONS'
	);
	response.header('Content-Type', 'application/json;charset=utf-8');
	next();
});

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use('/api', router);
app.listen(8081, () => {
	console.log('服务器启动ƒ');
});
