const path = require("path");
const minicss = require("mini-css-extract-plugin");
const htmlwebpackplugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const glob = require("glob");
const setMpa = () => {
  const entry = {};
  const htmlwebpackplugins = [];

  const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js"));
  entryFiles.forEach((item) => {
    const pageName = item.match(/src\/(.*)\/index\.js$/)[1];
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
    path: path.resolve(__dirname, "./mpa"),
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
    ],
  },

  plugins: [
    ...htmlwebpackplugins,
    new CleanWebpackPlugin(),
    new minicss({
      filename: "style/index.css",
    }),
  ],
};
