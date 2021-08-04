const path = require('path');
const minicss = require('mini-css-extract-plugin');
const htmlwebpackplugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const hkPlugin = require('./myPlugins/hk-plugin');

const glob = require('glob');
const setMpa = () => {
	const entry = {};
	const htmlwebpackplugins = [];

	const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
	// console.log('entryFiles :>> ', entryFiles); // hk-log
	entryFiles.forEach((item) => {
		const pageName = item.match(/src\/(.*)\/index.js$/)[1];
		entry[pageName] = item;

		htmlwebpackplugins.push(
			new htmlwebpackplugin({
				template: `./src/${pageName}/index.html`,
				filename: `${pageName}.html`,
				chunks: [pageName],
			})
		);
	});

	return {
		entry,
		htmlwebpackplugins,
	};
};

const { entry, htmlwebpackplugins } = setMpa();

module.exports = {
	entry,
	output: {
		path: path.resolve(__dirname, './mpa'),
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
					// { loader: 'image-webpack-loader,' },
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
			// 	test: /\.(png|jpg|gif|webp|jpeg)$/,
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
					minicss.loader,
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
		// new htmlwebpackplugin({
		// 	template: './src/index.html',
		// 	filename: 'index.html',
		// }),
		...htmlwebpackplugins,
		new hkPlugin({ name: 'vue' }),
		new minicss({
			filename: 'style/index.css',
		}),
		new CleanWebpackPlugin(),
	],
};
