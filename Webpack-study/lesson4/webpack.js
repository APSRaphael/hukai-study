const webpack = require('webpack');

const config = require('./webpack.config.js');

const compiler = webpack(config);

Object.keys(compiler.hooks).forEach((hookName) => {
	compiler.hooks[hookName].tap('xxx', (compilation) => {
		console.log('run :>> ', hookName); // hk-log
	});
});

compiler.run();
