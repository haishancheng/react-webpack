const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.config.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin"); // 显示每个loader和plugin执行时长

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(
  merge(common, {
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    output: {
      filename: "js/[name].[hash:8].bundle.js",
    },
    devServer: {
      contentBase: path.resolve(__dirname, "../dist"),
      open: true,
      port: 9000,
      compress: true,
      hot: true,
      progress: true,
    },
    module: {
      rules: [],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "public/index.html",
        inject: "body",
        hash: false,
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  })
);
