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
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

/** webpack 配置说明书 */
module.exports = {
  /** 运行模式 */
  mode: "development",
  // devtool: "eval-cheap-module-source-map",
  // devtool: "source-map",
  /** 打包结果运行环境 */
  target: "web",
  /**
   * 设置路径上下文为项目根目录
   * webpack内部配置的相对路径都是根据这个context计算的
   * 默认情况下 context值为 process.cwd() current work dirctort 当前工作目录
   *
   * 关键点 ⚠️ 这个配置只是webpack约定一个上下文的路径
   * 对于一些plugin 不会做强约束，某些插件可能会不使用这个属性!
   */
  context: path.resolve(__dirname),
  /** 设置入口 extry
   *  设置一个向对路径，这个路径会根据context上下文计算 有三种配置方式
   * 1. 一个路径 一个入口 一个chunk
   * 2. 一个数组 多个入口生成一个 chunk
   * 3. 一个对象 包含 { chunk名称: 入口路径 } 对应多入口 多chunk
   *
   * 前两种方式默认的chunk name为 main 第三种的chunk name通过对象配置
   * 
   * e.g. 
    entry: ["./src/index.js", "./src/hello.js"], // 多入口生成一个chunk
    entry: {
      index: "./src/index.js", // 多个入口生成多个chunk
      hello: "./src/hello.js",
    },
   */
  entry: "./src/index.jsx", // 生成一个chunk
  /** 出口配置
   *  包含
   *  1. 出口目录位置
   *  2. 输出文件名称的模板 [interpolateName]
   *  3. chunkFilename 配置不是通过 入口chunk生成的chunk 比如拆包 或者 移步引入被拆出去的chunk
   *  4. publicPath 表示资源前缀
   *  5. clean 输出之前清空目录
   *  6. libraryTarget 导出方式
   *  7. library 导出绑定的名称
   */
  output: {
    /** 输出目录路径
     * 一般使用绝对路径
     * 默认情况下为 path.resolve(__dirname, "dist") */
    path: path.resolve(__dirname, "dist"), // 配置输出目录地址
    /**
     * 配置入口chunk对应的输出文件的名称模板
     * 为什么要配置一个模板 因为入口chunk可能有多个 输出的文件可能有多个
     * 对于 对象形式的 entry 这里必须配置 [name] / [id] 等可以变动的部分 以保证输出文件不重名
     * 这里用不了 [ext] 只有有明确输入 输出文件 比如file-loader 才有 [ext]
     *
     * [name] 对于入口chunk 为entry定义的名称
     *        对于非入口chunk
     *               (1) 如果设置了 webpackChunkName 魔法标记 那么就是标记名称
     *               (2) 如果没设置 那么 id 和 name 一样，由chunkId决定，在chunkId named的情况下，为路径截断 src_page_util_tool_js
     * [id] 为 chunkId 由optimization.chunkId配置 包含 named | deterministic | natural
     *      生产模式默认为 deterministic 根据name生成的短hash 开发模式为 named 即和name一样
     */

    filename: "web-static/js/[name]_[id]_[chunkhash:8].js", // 配置输出文件名称
    /**
     * 配置非入口chunk生成的文件名称
     * 什么是非入口chunk 比如 splitChunks拆包 或者 异步引入 import() 的模块 会被单独拆分为chunk
     */
    chunkFilename: "web-static/js/chunk_[name]_[id]_[chunkhash:8].js", // 指定非入口生成chunk的名称
    /**
     * 内部使用 CleanWebpackPlugin 目前已经内置，之前版本的webpack 需要自己调用这个插件
     */
    clean: true, // 每次输出之前清空输出目录
    /**
     * 资源前缀 默认值为空
     * 这个配置会加入到所有资源路径前面，比如 html css(url) 都会去读这个publicpath
     * webpack会在模块的上下文注入 __webpack_public_path__ 这个全局变量，在loader实现的时候，经常用这个全局变量来拼接路径
     * e.g. file-loader中:  `export default \`\${__webpack_public_path__}${filename}\``
     *
     * 一般写绝对路径 不要写相对路径 会导致路径计算不准确
     */
    publicPath: "/manager/",
    /** 输出目标配置
     *  一般用在打包库代码的时候
     *  var window global commonjs amd umd this module (需要开启 experiments.outModule)
     */
    libraryTarget: "window",
    /** 输出绑定的名字
     *  注意 这个属性在 libraryTarget 为 module的情况下 不能使用
     */
    library: "hello",
  },
  /** 实验性特性配置 */
  experiments: {
    /** 允许输出module */
    outputModule: true, // 开启esmodule导出
  },
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
    process.env.NODE_ENV == "development"
      ? new ReactRefreshWebpackPlugin()
      : null,
  ],
  optimization: {
    minimize: false,
    usedExports: true,
    chunkIds: "deterministic",
    // moduleIds: "deterministic",
    // splitChunks: {
    //   chunks: "all",
    //   minSize: 200,
    //   // maxSize: 200000,
    //   minChunks: 1,
    //   maxInitialRequests: 30,
    //   maxAsyncRequests: 30,
    //   cacheGroups: {
    //     reactVendors: {
    //       test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/, // 匹配 react 和 react-dom 模块
    //       name: "react-vendors", // 自定义生成的 chunk 名称
    //       priority: 0, // 优先级高于 defaultVendors
    //       // enforce: true, // 强制拆分该缓存组
    //     },
    //     jqueryVersors: {
    //       test: /[\\/]node_modules[\\/](jquery)[\\/]/, // 匹配 react 和 react-dom 模块
    //       name: "jquery-vendors", // 自定义生成的 chunk 名称
    //       priority: 0, // 优先级高于 defaultVendors
    //       // enforce: true, // 强制拆分该缓存组
    //     },
    //     // 缓存组配置
    //     defaultVendors: {
    //       test: /[\\/]node_modules[\\/]/, // 匹配 node_modules 中的模块
    //       priority: -10, // 优先级
    //       reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则重用该模块
    //     },
    //     default: {
    //       minChunks: 2, // 被至少两个 chunks 共享的模块
    //       priority: -20, // 优先级低于 vendors
    //       reuseExistingChunk: true, // 重用已存在的 chunk
    //     },
    //   },
    // },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
