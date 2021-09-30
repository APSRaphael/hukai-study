const { promisify } = require('util');
const figlet = promisify(require('figlet'));
const clear = require('clear');
const chalk = require('chalk');
const { clone } = require('./download');

const log = (content) => console.log(chalk.green(content)); // hk-log

module.exports = async (name) => {
	clear();
	const data = await figlet('HK Welcome');
	log(data);

	log('🚀创建项目:' + name);
	await clone('github:APSRaphael/yearly-goal', name);

    // 自动安装依赖
};
