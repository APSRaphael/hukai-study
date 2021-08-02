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
				type: 'asset', // asset(同过配置实现后两者) asset/resource(一定打包出独立文件) asset/inline(一定转换成base64)
				parser: {
					dataUrlCondition: {
						maxSize: 9 * 1024,
					},
				},
				generator: {
					filename: 'images/[name][ext]',
				},
			},
			// {
			// 	test: /\.(png|jpg|gif|webp|jpeg)$/,
			// 	type: 'asset/resource', // asset asset/resource asset/inline(base64)
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
