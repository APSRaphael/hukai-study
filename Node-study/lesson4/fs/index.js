const fs = require('fs');

function set(key, value) {
	fs.readFile('./db.json', (err, data) => {
		const json = data ? JSON.parse(data) : {};
		json[key] = value;
		fs.writeFile('./db.json', JSON.stringify(json), (err) => {
			if (err) {
				console.log('err :>> ', err); // hk-log
			}
			console.log('写入成功 :>> '); // hk-log
		});
	});
}

function get(key) {
	fs.readFile('./db.json', (err, data) => {
		const json = JSON.parse(data);
		console.log(json[key]);
	});
}

const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.on('line', (input) => {
	const [op, key, value] = input.split(' ');
	if (op === 'get') {
		get(key);
	} else if (op === 'set') {
		set(key, value);
	} else if (op === 'quit') {
		rl.close();
	} else {
		console.log(' 没有操作:>> '); // hk-log
	}
});

rl.on('close', () => {
	console.log('程序结束 :>> '); // hk-log
	process.exit(0);
});
