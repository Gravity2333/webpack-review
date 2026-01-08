const path = require("path");
const { DefinePlugin, DllPlugin } = require("webpack");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  /** 运行模式 */
  mode: "production",
  /** 打包结果运行环境 */
  target: "web",
  /** 设置路径上下文为项目根目录 */
  context: path.resolve(__dirname),
  /** 设置入口 */
  entry: {
    lodash: "lodash", // 多个入口生成多个chunk
    jquery: "jquery",
  },
  output: {
    path: path.resolve(__dirname, "dll"), // 配置输出目录地址
    filename: "lib/[name].js", // 配置输出文件名称
    clean: true, // 每次输出之前清空输出目录
    libraryTarget: "umd",
    library: "[name]",
  },
  plugins: [
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      PI: 3.1415926,
    }),
    new TerserWebpackPlugin({
      terserOptions: {
        compress: {
          arrows: true,
          arguments: true,
          dead_code: true, // 去掉死区
        },
        mangle: {
          // 混淆 替换变量
          toplevel: true,
        },
      },
      extractComments: true,
      parallel: true,
    }),
    new DllPlugin({
      name: "[name]", // 暴露的变量名
      path: path.resolve(__dirname, "dll/manifest/[name]-manifest.json"),
    }),
  ],
  optimization: {
    minimize: true,
    usedExports: true,
    chunkIds: "deterministic",
    moduleIds: "deterministic",
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
