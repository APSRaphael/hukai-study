const path = require('path');
const htmlwebpackplugin = require('html-webpack-plugin');

// const dev = NODE_DEV;
// console.log('dev :>> ', dev); // hk-log

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'index.js',
	},
	mode: 'development',
	plugins: [
		new htmlwebpackplugin({
			template: './src/index.html',
			filename: 'main.html',
			chunks: ['main'],
		}),
	],
};
