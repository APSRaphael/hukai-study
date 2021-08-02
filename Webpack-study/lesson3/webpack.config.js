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
	resolveLoader: {
		modules: ['node_modules', './myLoaders'],
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.less$/,
				use: ['hk-style-loader', 'hk-css-loader', 'hk-less-loader'],
			},
			// {
			// 	test: /\.less$/,
			// 	use: [
			// 		minicss.loader,
			// 		{
			// 			loader: 'css-loader',
			// 			options: {
			// 				// modules: true,
			// 				// sourceMap: true,
			// 				// localIdentName: '[path][name]__[local]--[hash:base64:5]',
			// 			},
			// 		},
			// 		'postcss-loader',
			// 		'less-loader',
			// 	],
			// },
			// {
			// 	test: /\.js$/,
			// 	use: [
			// 		'hk-loaders',
			// 		{
			// 			loader: path.resolve(__dirname, './myLoaders/hk-loaders-async.js'),
			// 			options: {
			// 				name: 'hhb',
			// 			},
			// 		},
			// 	],
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
