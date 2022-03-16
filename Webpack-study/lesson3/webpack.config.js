const path = require('path');
const minicss = require('mini-css-extract-plugin');
const htmlwebpackplugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: {
		main: './src/index.js',
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name].js',
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.(png|jpg|gif|webp|jpeg)$/,
				type: 'asset', // asset(通过配置实现后两者) asset/resource(一定打包出独立文件) asset/inline(一定转换成base64)
				parser: {
					dataUrlCondition: {
						maxSize: 9 * 1024, // 设置图片大小限制，小于该设置转成 base64格式
					},
				},
				generator: {
					filename: 'images/[name][ext]', // ext前面不需要加.， 跟4.x版本的区别
				},
			},
			// {
			// 	test: /\.(png|gif|webp|jpe?g)$/,
			// 	type: 'asset/inline', // 模式不需要 generator, 固定转成内联模式，设置 parser 无效
			// },
			// {
			// 	test: /\.(png|gif|webp|jpe?g)$/,
			// 	type: 'asset/resource', // asset asset/resource asset/inline(base64)（inline模式不需要 generator
			// 	generator: {
			// 		filename: 'images/[name][ext]',
			// 	},
			// },
		],
	},
	plugins: [
		new htmlwebpackplugin({
			template: './src/index.html',
			filename: 'index.html',
		}),
		new minicss({
			filename: 'style/index.css',
		}),
		new CleanWebpackPlugin(),
	],
};
