const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
	entry: { index: "./src/ReactHello.tsx" },
	mode: "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-typescript",
							"@babel/preset-react",
							"@babel/preset-env",
						],
					},
				},
				exclude: /node-modules/,
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
	],
};
