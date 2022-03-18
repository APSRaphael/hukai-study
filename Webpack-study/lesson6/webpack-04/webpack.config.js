const path = require("path");
const minicss = require("mini-css-extract-plugin");
const htmlwebpackplugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  mode: "development",
  resolveLoader: {
    modules: ["node_modules", "./myLoaders"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: [
          minicss.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/, //jpg jpeg webp png gif
        use: [
          //导出一个资源，返回路径
          {
            loader: "url-loader", //url-loader是file-loader pro版本
            options: {
              name: "[name].[ext]", //[ext]
              outputPath: "images", //images/xxx.png 资源的存储位置
              publicPath: "../images", //资源的使用位置 publicPath+name = css中图片的使用路径
              limit: 3 * 1024, //10kb
            },
          },
          {
            loader: "image-webpack-loader",
          },
        ],
      },
      {
        test: /.(eot|woff|woff2|svg|ttf)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "font",
            publicPath: "../font",
          },
        },
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  devServer: {
    port: 8081,
    open: true,
  },
  plugins: [
    // 资源文件输出到dist目录之前
    new htmlwebpackplugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new CleanWebpackPlugin(), //打包前清理dist目录
    new minicss({
      filename: "style/index.css",
    }),
  ],
};
