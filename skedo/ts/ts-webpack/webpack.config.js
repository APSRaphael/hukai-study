const path = require("path");

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
	entry: { index: "./src/index.ts" },
	mode: "development",
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: ["/node-modules"],
				// exclude: /node-modules/,
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
};
