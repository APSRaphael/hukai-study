const { ModuleFederationPlugin } = require('webpack').container;

const { resolve } = require('path');
module.exports = {
	entry: './src/index.js',
	output: {
		path: resolve(__dirname, './dist'),
		filename: '[name].js',
	},
	mode: 'development',

	plugins: [
		new ModuleFederationPlugin({
			name: '', //命名空间,
			filename: '', //文件名称
			library: {
				type: 'var',
			},
			//加载远程资源
			remotes: '${name}/${url}:port/${filename}',
			// 暴露 共享出去的组件，模块
			exposes: {
				lh: './src/index.js',
			}, // js模块 还是vue组件 还是react组件
			shared: ['vue', 'react', 'react-dom'],
		}),
	],
};
