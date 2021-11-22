const { promisify } = require('util');
const figlet = promisify(require('figlet'));
const clear = require('clear');
const chalk = require('chalk');
const { clone } = require('./download');
const open = require('open');

const log = (content) => console.log(chalk.green(content)); // hk-log

const spawn = async (...args) => {
	const { spawn } = require('child_process');
	return new Promise((resolve) => {
		const proc = spawn(...args);

		proc.stdout.pipe(process.stdout);
		proc.stderr.pipe(process.stderr);
		proc.on('close', () => {
			resolve();
		});
	});
};

module.exports = async (name) => {
	clear();
	const data = await figlet('HK Welcome');
	log(data);

	log('🚀创建项目:' + name);
	// await clone('github:su37josephxia/vue-template', name);

	// 自动安装依赖
	// log('安装依赖');
	// await spawn('npm', ['install'], { cwd: `./${name}` });
	log(
		chalk.green(`
	安装完成
	To go Start:
	============================
		cd ${name}
		npm run serve
	============================
	`)
	);

	// 启动项目
	open('http://localhost:8080');
	await spawn('npm', ['run', 'serve'], { cwd: `./${name}` });
	// await spawn('yarn', ['serve'], { cwd: `./${name}` });
};
