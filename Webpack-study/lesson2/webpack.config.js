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
			// {
			// 	test: /\.less$/,
			// 	use: ['hk-style-loader', 'hk-css-loader', 'hk-less-loader'],
			// },
			{
				test: /\.(png|jpg|gif|webp|jpeg)$/,
				use: [
					{
						loader: 'url-loader', // file-loader 加强版，依赖 file-loader
						options: {
							// name: 'images/[name].[ext]', // 不推介
							name: '[name].[ext]',
							outputPath: 'images', //推介  资源存储位置
							publicPath: '../images', // 资源的使用位置 publicPath + name = css 中图片的使用路径
							limit: 4 * 1024,
						},
					},
					// { loader: 'image-webpack-loader,' }, //  压缩图片。有坑，安装这个 loader 必须切到 taobao 源， npm config set registry = https://registry.npm.taobao.org
				],
			},
			{
				test: /.(eot|woff|woff2|svg|ttf)$/,
				use: {
					// loader:'url-loader',
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'font',
						publicPath: '../font',
					},
				},
			},
			// {
			// 	test: /\.(png|jpe?g|gif|webp)$/,
			// 	use: {
			// 		loader: 'file-loader',
			// 		options: {
			// 			// name: 'images/[name].[ext]', // 不推介
			// 			name: '[name].[ext]',
			// 			outputPath: 'images', //推介  资源存储位置
			// 			publicPath:'../images'// 资源的使用位置 publicPath + name = css 中图片的使用路径
			// 		},
			// 	},
			// },
			{
				test: /\.less$/,
				use: [
					// 'style-loader',  生成的 css 样式是内联的
					minicss.loader,  // 替代 style-loader 单独生成样式文件
					{
						loader: 'css-loader',
						options: {
							// modules: true,
							// sourceMap: true,
							// localIdentName: '[path][name]__[local]--[hash:base64:5]',
						},
					},
					'postcss-loader',
					'less-loader',
				],
			},
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
		new minicss({   // 自带一个 minicss.loader, 替代 style-loader， 需要在  module-rules 中配置
			filename: 'style/index.css',
		}),
		new CleanWebpackPlugin(), // 自动清理打包生成的文件，确保每次打包生成的都是新文件
	],
};
