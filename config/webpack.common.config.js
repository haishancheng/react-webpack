const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackBar = require("webpackbar"); // 添加打包进度条

const isDevMode = process.env.NODE_ENV !== "production";
module.exports = {
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "js/bundle.js",
    path: path.resolve(__dirname, "../dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
        // include: path.resolve(__dirname, "src"),// 精确指定要处理的目录
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[ext]", // 输出的文件名为 原来的文件名.后缀
            outputPath: "images/", // 输出到dist目录下的路径，即dist/images/...
            limit: 8192, // 超过这个（8kb）才会打包图片，否则转化成base64
          },
        },
      },
      {
        test: /\.(eot|ttf|svg|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "font/",
            // limit: 100000, //这里要足够大这样所有的字体图标都会打包到css中
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")], //配置 Autoprefixer 之前，需要先添加 Browserslist ：在项目根目录添加 .browserslistrc 文件；或者在package.json文件中添加 browserslist，并指定浏览器版本才能生效
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")],
            },
          },
          "less-loader",
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")],
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [new WebpackBar()],
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
};
