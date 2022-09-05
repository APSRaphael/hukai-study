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
				loader: "babel-loader",
				options: {
					presets: [
						"@babel/preset-typescript",
						"@babel/preset-env",
						"babel-preset-typescript-vue3",
					],
				},
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
