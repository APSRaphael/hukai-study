const fs = require('fs');
const handlebars = require('handlebars')
const chalk = require('chalk');



module.exports = async () => {
	// 获取列表
	const list = fs
		.readdirSync('./src/views')
		.filter((v) => v !== 'Home.vue')
		.map((v) => ({ name: v.replace('.vue', '').toLowerCase(), file: v }));

	console.log('list :>> ', list); // hk-log

	// 生成路由定义
	compile({ list }, './src/router.js', './template/router.js.hbs');

	// 菜单
	compile({ list }, './src/App.vue', './template/App.vue.hbs');

	/**
	 * @description:
	 * @param {type} {*}
	 * @return {*}
	 * @param {*} meta 数据
	 * @param {*} filePath 目标文件
	 * @param {*} templatePath 模板
	 */
	function compile(meta, filePath, templatePath) {
		if (fs.existsSync(templatePath)) {
			const content = fs.readFileSync(templatePath).toString();
			const result = handlebars.compile(content)(meta);
			fs.writeFileSync(filePath, result);
			console.log(chalk.green(`🚀${filePath} 创建成功`));
		}
	}
};
