const path = require('path');
const terserplugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: {
		'add-number': './src/index.js',
		'add-number.min': './src/index.js',
	},
	output: {
		path: path.resolve(__dirname, './build'),
		filename: '[name].js',
		//   指定库的名称
		library: 'kkb',
		//   指定打包规范
		libraryTarget: 'umd', // var this window global umd
		libraryExport: 'default',
	},
	mode: 'none',

	optimization: {
		minimize: true,
		//   plugins
		minimizer: [
			new terserplugin({
				test: /\.min\.js$/,
			}),
		],
	},
	plugins: [
		new CleanWebpackPlugin(), //打包前清理dist目录
	],
};
