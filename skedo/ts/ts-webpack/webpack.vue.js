const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
// module.exports = {
// 	entry: {
// 		index: "./src/index.ts",
// 	},
// 	mode: "development",
// 	module: {
// 		rules: [{ test: /\.ts$/, use: "ts-loader", exclude: /node-modules/ }],
// 	},
// 	resolve: {
// 		extensions: [".tsx", ".ts", ".js"],
// 	},
// 	output: {
// 		filename: "bundle.[name].js",
// 		path: path.resolve(__dirname, "dist"),
// 	},
// };

module.exports = {
	entry: { index: "./src/main.ts" },
	mode: "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				// 以下写法是ts-loader不能处理.vue结尾的文件的时候，通过手动配置 options 给 vue 结尾的文件加上.ts结尾的后缀
				// loader: "ts-loader",
				// options: {
				// 	appendTsSuffixTo: [/\.vue$/],
				// },
				exclude: ["/node-modules"],
				// exclude: /node-modules/,
			},
			{
				test: /\.vue$/,
				use: "vue-loader",
				// loader: "vue-loader"
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		filename: "bundle.[name].js",
		path: path.resolve(__dirname, "dist"),
	},
	devServer: {
		static: {
			directory: path.resolve(__dirname, "dist"),
		},
		port: 3000,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "template.html"),
		}),
		new VueLoaderPlugin(),
	],
};
