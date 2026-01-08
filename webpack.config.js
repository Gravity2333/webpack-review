const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {
  DefinePlugin,
  BannerPlugin,
  ProvidePlugin,
  DllReferencePlugin,
} = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TestPlugin = require("./plugins/TestPlugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ReactRefreshWebpackPlugin =
  require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  /** 运行模式 */
  mode: "development",
  // devtool: "eval-cheap-module-source-map",
  // devtool: "source-map",
  /** 打包结果运行环境 */
  target: "web",
  /** 设置路径上下文为项目根目录 */
  context: path.resolve(__dirname),
  /** 设置入口 */
  entry: "./src/index.jsx", // 生成一个chunk
  // entry: ["./src/index.js", "./src/hello.js"], // 多入口生成一个chunk
  // entry: {
  //   index: "./src/index.js", // 多个入口生成多个chunk
  //   hello: "./src/hello.js",
  // },
  output: {
    path: path.resolve(__dirname, "dist"), // 配置输出目录地址
    filename: "web-static/js/[name]_[id]_[chunkhash:8].js", // 配置输出文件名称
    clean: true, // 每次输出之前清空输出目录
    chunkFilename: "web-static/js/chunk_[name]_[id]_[chunkhash:8].js", // 指定非入口生成chunk的名称
    publicPath: "/manager/",
    // libraryTarget: "commonjs",
    // library: "hello",
  },
  // experiments: {
  //   outputModule: true, // 开启esmodule导出
  // },
  /** 模块解析配置 */
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    mainFiles: ["index"],
    mainFields: ["main"],
    descriptionFiles: ["package.json"],
    alias: {
      "@hello": "./src/hello.js",
    },
  },

  devServer: {
    host: "0.0.0.0",
    port: 7664,
    open: {
      target: ["/manager"],
    },
    compress: true,
    // 所有没匹配到的路径 都返回index.html 适合 browser router SPA
    historyApiFallback: true,
    proxy: [
      {
        context: ["/api"],
        target: "http://192.168.1.1",
        pathRewrite: { "/^api": "/" },
        changeOrigin: true,
      },
    ],
    static: [
      {
        publicPath: "/public",
        directory: path.resolve(__dirname, "public"),
      },
    ],
    devMiddleware: {
      index: "index.html",
      publicPath: "/manager",
    },
    hot: true, // HMR
  },
  /** 配置模块解析 */
  module: {
    noParse: [/jquery/],
    rules: [
      {
        test: /\.jsx/,
        use: [
          "cache-loader",
          "thread-loader",
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          // "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true, // 启用CSS Modules
              esModule: false, // 强制使用 ES6 模块导出
            },
          },
          "less-loader",
        ],
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     "./loaders/my-style-loader",
      //     {
      //       loader: "./loaders/my-css-loader",
      //       options: {
      //         module: true,
      //       },
      //     },
      //   ],
      // },
      // {
      //   test: /\.css$/,
      //   use: [
      //     "./loaders/my-style-loader-pitch",
      //     {
      //       loader: "./loaders/my-css-loader-pitch",
      //       options: {
      //         module: true,
      //       },
      //     },
      //     // {
      //     //   loader: "./loaders/delay-loader",
      //     //   options: {
      //     //     delay: 10000,
      //     //   },
      //     // },
      //   ],
      // },
      // 配置 assets
      // {
      //   test: /\.png|jpe?g|gif|svg/,
      //   type: "asset/resource",
      //   generator: {
      //     filename: "assets/[name]-[contenthash:8][ext]",
      //   },
      // },
      // {
      //   test: /\.png|jpe?g|gif|svg/,
      //   type: "asset/source",

      // },
      // {
      //   test: /\.(png|jpe?g|gif|svg)$/i,
      //   type: "asset/inline",
      // },

      // {
      //   test: /\.png|jpe?g|gif|svg/,
      //   use: [
      //     {
      //       loader: "./loaders/my-file-loader",
      //       options: {
      //         generator: {
      //           filename: "assets/[name]-[hash:8][ext]",
      //         },
      //       },
      //     },
      //   ],
      // },
      // {
      //   test: /\.png|jpe?g|gif|svg/,
      //   use: [
      //     {
      //       loader: "./loaders/my-raw-loader",
      //     },
      //   ],
      // },
      {
        test: /\.png|jpe?g|gif|svg/,
        use: [
          {
            loader: "./loaders/my-url-loader",
          },
        ],
      },
    ],
  },
  /** 配置外部依赖 */
  // externalsType: "var",
  // externals: {
  //   jquery: "$",
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./template.ejs",
      inject: "body",
      // cdn: {
      //   jquery: [
      //     /** backup cdn */
      //     "https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js",
      //     "https://cdn.bootcdn.net/ajax/libs/react-dom/16.0.0-beta.1/cjs/react-dom-node-stream.production.min.js",
      //   ],
      //   lodash: ["/manager/lib/lodash.js"],
      // },
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: "./dll/lib",
    //       to: "./lib",
    //     },
    //   ],
    // }),
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      PI: 3.1415926,
    }),
    new MiniCssExtractPlugin({
      filename: "web-static/css/[name]-[contenthash:8].css",
      chunkFilename: "web-static/[name]-[contenthash:8].css",
    }),
    new TestPlugin(),
    new BannerPlugin({
      banner: "liuze authorized",
    }),
    new ProvidePlugin({
      _: "lodash",
    }),
    new CssMinimizerWebpackPlugin(),
    new CompressionWebpackPlugin({
      test: /\.(js|css|less)$/,
      algorithm: "gzip", //压缩算法
      minRatio: 0.7, // 压缩倍率
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
    // new DllReferencePlugin({
    //   manifest: path.resolve(__dirname, "./dll/manifest/lodash-manifest.json"),
    // }),
    process.env.Analyze == 1 ? new BundleAnalyzerPlugin() : null,
    process.env.NODE_ENV == 'development' ? new ReactRefreshWebpackPlugin(): null
  ],
  optimization: {
    minimize: false,
    usedExports: true,
    chunkIds: "named",
    moduleIds: "deterministic",
    splitChunks: {
      chunks: "all",
      minSize: 200,
      // maxSize: 200000,
      minChunks: 1,
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      cacheGroups: {
        reactVendors: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/, // 匹配 react 和 react-dom 模块
          name: "react-vendors", // 自定义生成的 chunk 名称
          priority: 0, // 优先级高于 defaultVendors
          // enforce: true, // 强制拆分该缓存组
        },
        jqueryVersors: {
          test: /[\\/]node_modules[\\/](jquery)[\\/]/, // 匹配 react 和 react-dom 模块
          name: "jquery-vendors", // 自定义生成的 chunk 名称
          priority: 0, // 优先级高于 defaultVendors
          // enforce: true, // 强制拆分该缓存组
        },
        // 缓存组配置
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/, // 匹配 node_modules 中的模块
          priority: -10, // 优先级
          reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则重用该模块
        },
        default: {
          minChunks: 2, // 被至少两个 chunks 共享的模块
          priority: -20, // 优先级低于 vendors
          reuseExistingChunk: true, // 重用已存在的 chunk
        },
      },
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
