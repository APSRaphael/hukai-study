const path = require('path');
const htmlwebpackplugin = require('html-webpack-plugin');

// const dev = NODE_DEV;
// console.log('dev :>> ', dev); // hk-log

console.log('process.env :>> ', process.env); // hk-log
module.exports = {
	// entry: './src/index.js',
	entry: {
		main: './src/index.js',
		other: './src/other.js',
		login: './src/login.js',
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		// filename: 'index.js',
		filename: '[name].js',
	},
	mode: 'development',
	plugins: [
		new htmlwebpackplugin({
			template: './src/index.html',
			filename: 'main.html',
			chunks: ['main', 'other'],
		}),
		new htmlwebpackplugin({
			template: './src/index.html',
			filename: 'other.html',
			chunks: ['other'],
		}),
		new htmlwebpackplugin({
			template: './src/index.html',
			filename: 'login.html',
			chunks: ['login'],
		}),
	],
};
