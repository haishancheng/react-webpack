const merge = require("webpack-merge");
const common = require("./webpack.common.config.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // 压缩js
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 单独打包css
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // 压缩打包出的CSS文件
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin"); // 显示每个loader和plugin执行时长

const smp = new SpeedMeasurePlugin();
module.exports = smp.wrap(
  merge(common, {
    mode: "production",
    output: {
      // name就是模块名称，我们在entry中进行过配置，在这里重新设置会代替之前common中的设置
      // hash, chunkhash, contenthash区别见https://juejin.im/post/5d70aee4f265da03f12e7ab2
      filename: "js/[name].[chunkhash:8].bundle.js",
    },
    module: {
      rules: [],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html", // 生成的html文件
        template: "public/index.html", // 以自定义的html模板文件生成对应的html文件
        inject: "body", // 在body最底部引入js文件，如果是head，就是在head中引入js
        // 压缩html文件
        minify: {
          removeComments: true, // 去除注释
          collapseWhitespace: true, // 去除空格
        },
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["**/*"],
      }),
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash:8].css",
        chunkFilename: "css/[id].[contenthash:8].css",
      }),
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          // parallel: true,
        }),
        new OptimizeCssAssetsPlugin({
          assetNameRegExp: /\.css$/g, // 匹配需要优化或者压缩的资源名
          cssProcessor: require("cssnano"), // 用于压缩和优化CSS 的处理器，默认是 cssnano.
          cssProcessorPluginOptions: {
            // 传递给cssProcessor的插件选项
            preset: ["default", { discardComments: { removeAll: true } /* 去除注释 */ }],
          },
          canPrint: true, // 表示插件能够在console中打印信息，默认值是true
        }),
      ],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          // 将 node_mudules 文件夹中的模块打包进一个叫 vendors的bundle中
          vendors: {
            test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录下的文件
            priority: -10, // 优先级配置项
            name: "vender",
          },
          // 所有引用超过两次的模块分配到 default bundle 中 更可以通过 priority 来设置优先级
          default: {
            minChunks: 2,
            priority: -20, // 优先级配置项
            reuseExistingChunk: true,
            name: "default",
          },
        },
      },
    },
  })
);
