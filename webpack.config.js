const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {
  DefinePlugin,
  BannerPlugin,
  ProvidePlugin,
  DllReferencePlugin,
} = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AssetEmitStatPlugin = require("./plugins/AssetEmitStatPlugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { glob } = require("glob");

/** Webpack 配置说明书 */
module.exports = {
  /** =========================================== 预设相关 =========================================== */
  /** 打包结果运行环境
   *  默认值为 web 也可以设置为 node
   *  默认打包代码的目标运行环境!
   *  如果配置node 则默认目标代码会运行在node中，那么就不会默认当前环境中有window
   *  如果配置web，那么不会把fs path等当成环境工具
   */
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
  /** =========================================== 出入口相关 =========================================== */
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
     *
     * 几种 hash
     * chunkhash 根据一个chunk所有的内容生成的hash值，一般chunk内的模块变化，hash就会变化
     * hash 整个项目的chunkhash值最后生成的hash 只要有模块变化，hash就变
     * contenthash chunk被输出到文件之前生成 输出的文件内容只要变化 就变化
     * (webpack 5 已经推荐使用contenthash)
     * css 这种和js无关的文件 也建议用contenthash
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
  /** =========================================== 路径解析配置相关 =========================================== */
  /**
   * node 模块解析
   * 1. 如果是绝对路径 / 相对路径
   *   查看当前路径是不是个文件 如果没有后缀 会先补 .js .json .node
   *   如果当前路径是个目录，查看有无packages.json 如果有 找main字段 如果没有 在当前目录下找 index.js index.json index.node
   *
   *  2. 如果引入的是一个模块
   *    如果是node内置模块，那么直接引入即可
   *    如果不是node内部模块，去node_modules中，找 看有无对应的文件 补 .js .json .node
   *    再找有无目录，如果有目录 按照目录解析 先找package.json 后找index.js index.json index.node
   *    还是没有 找上层的node_modules!
   */
  /** 模块解析配置
   *  这个模块解析配置就是模仿node的解析，但是变成了可配置的 有更强大的功能
   */
  resolve: {
    /** 如果是模块名称，默认查找的目录 默认node_modules */
    modules: ["node_modules"],
    /** 默认补充的后缀名 */
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    /** 默认文件名 默认index */
    mainFiles: ["index"],
    /** 在描述文件 (package.json)中，默认查找的入口字段名 默认为main */
    mainFields: ["main"],
    /** 描述文件名 默认为package.json */
    descriptionFiles: ["package.json"],
    /** 别名配置，建议使用绝对路径配置 */
    alias: {
      /** alias 建议用绝对路径 */
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  /** loader解析配置
   *  用来配置webpack如何查找loaders 配置字段和resolve类似
   */
  resolveLoader: {
    /** 优先查找./loader目录 */
    modules: ["./loaders", "node_modules"],
    extensions: [".js"],
    mainFiles: ["index"],
    mainFields: ["main"],
    descriptionFiles: ["package.json"],
  },
  /** =========================================== 开发环境搭建相关 =========================================== */
  /** 运行模式 */
  mode: process.env.NODE_ENV,
  /** devtool 用来配置source-map的生成策略，一般用在开发阶段!
   *  不同的sourcemap策略，会影响开发体验，尤其是hmr
   *
   *  source-map的策略一般包含
   *  eval-xxx 把sourcemap和执行代码放到eval函数内
   *  source-map 把源码地图单独生成文件
   *  inline-xxx 把源码地图通过sourceUrl的方式 注释到文件中
   *
   *  每一种存放位置都包含不同颗粒度的生成策略
   *  比如
   *  eval 即只对文件名生成source-map 其他的具体源代码不会映射 放到eval函数内
   *  eval-source-map 完整的源代码地图 精确到行列 放到eval函数中 精确 构建性能相对低
   *  eval-cheap-source-map 只精确到行的source-map
   *  eval-cheap-module-source-map 精确到行的 并且映射loader处理之前代码的源码地图
   *
   *  除此以外 还包括 inline-xx xx-source-map
   *
   *  其中，开发环境建议使用eval-xx 比如 eval-cheap-module-source-map 其构建性能最好 hmr的性能也最好
   * 为什么，因为把编译后的代码 和 source-map都放到eval函数内，可以做到模块粒度的热更新，某个模块变动之后，之需要更新
   * 这个模块对应的eval函数即可，而对于inline 或者完整的sourcemap 其更新单位都是整个文件，或者说是 一个chunk
   */
  devtool: "eval-cheap-module-source-map",
  /** 开发服务器搭建 */
  devServer: {
    /**
     * 区分 localhost 127.0.0.1 0.0.0.0 具体ip
     * localhost = 127.0.0.1 不走网卡 为环回地址，操作系统内短路处理，由于不listen网卡 所以只有本机可以访问
     * 0.0.0.0 监听所有网卡 任何设备可以访问
     * 具体ip 比如 10.0.0.9 在当前ip属于网卡的情况下，所有设备可以访问
     */
    host: "0.0.0.0",
    /** 监听端口 */
    port: 7664,
    /** 自动打开页面 */
    open: {
      // 自动跳转到 /manager
      target: ["/manager"],
    },
    /** 需要注意关闭 Compression-Webpack-Plugin 避免性能浪费 */
    compress: true,
    /**
     * 所有没匹配到的路径 都返回index.html 适合 browser router SPA
     * 我们知道 SPA的前端路由一般分两种 hashRouter 和 historyRouter
     * histroryRouter在用户真实刷新的时候 比如按回车的时候 会真的去服务器请求数据
     * 这个配置就是让服务器，只要静态资源没匹配上，就返回index.html
     */
    historyApiFallback: true,
    /** 配置代理服务器
     *  之前的配置方式是 { "/api" : { target: ""} }
     *  现在的配置方式是 传入个数组 内部的context代替key
     */
    proxy: [
      {
        context: ["/api"], // 匹配前缀
        target: "http://192.168.1.1", // 目的转发地址
        pathRewrite: { "/^api": "/" }, // 重写路径 /api -> /
        changeOrigin: true, // 把host 从 localhost 改成真正要访问的target对应的host
      },
    ],
    /**
     * 开发模式下的静态资源目录 默认情况下为 public目录 即如下配置
     * 约定 > 配置
     * 在生产模式中，你需要用Copy-webpack-plugin 把你需要的静态资源 拷贝到构建目录(dist)中
     *
     * 注意，在开发环境中， Copy-Webpack-Plugin 也没必要开启，只有在生产环境才启用 因为开了也是无用功 拖慢构建速度
     */
    static: [
      {
        /** 映射前缀 */
        publicPath: "/public",
        /** 绝对路径 真实的映射目录 */
        directory: path.resolve(__dirname, "public"),
      },
    ],
    /** webpack-dev-middleware配置 */
    devMiddleware: {
      /** HTTP访问 / 或者 publicPath根路径时默认返回的文件名 */
      index: "index.html",
      /** 资源路径 表示把构建结果放到 /manager路径下，这里一般需要配置的和output.publicPath一致 */
      publicPath: "/manager",
    },
    /** 开启remake替换 */
    hot: true, // HMR 需要使用 module.hot.accept 开启 / module.hot.dispose 处理副作用
    // 如果使用react 请使用 react-refresh-plugin 其会自己处理accept 你只需要自己dispose副作用
    // babel 需要配置   "react-refresh/babel" 因为需要借助babel注入 accept的代码
  },
  /** =========================================== 模块解析相关 =========================================== */
  /** 配置模块解析
   *  用来设置模块解析相关配置
   */
  module: {
    /**
     * noParse 是一种优化的手段
     * 对于一些已经完成打包的模块，不需要再反复的打包了，可以使用noParse跳过以提升构建速度
     * noParse传入 正则，webpack处理module的时候会把每个module的路径path使用这个正则进行匹配，如果匹配成功 则跳过对这个模块的编译
     *
     * ⚠️ 需要注意！ 不解析的模块必须满足两个要求
     * 1. 不能是用esmodule的方式导出，因为webpack可以原生支持cjs的导出，但是esmodule由于引入新的语法 所以不支持
     * 2. 不能包含导入，因为不解析代表webpack不去处理依赖关系，所以导入语句在noparse下不会生效
     */
    noParse: [/jquery/],
    /**
     * rules用来配置loader
     * 基本配置为
     * test 传入正则 匹配模块路径
     * use 使用的loader 可以传入 字符串数组，对象数组
     * 执行的顺序为 从下到上 从右到左
     *
     * loader的执行时机，在读取模块内容到解析成AST之间会执行loader 完成代码的转换
     * loader返回的代码字符串必须满足javascript语法规范
     *
     * loader 处理包含 pitch阶段
     * pitch阶段返回 非空字符串 会熔断，不会继续执行后续loader
     *
     * pitch方法会返回previousLoaders 使用!loader!loader2!loader3!target file的方式
     * 之需要 !!${previousLoaders} 即可
     *
     * 异步 loader 可以使用this.async() 获取callback
     * 在loader结束之后 调用callback
     * 
     *  webpack 编译过程中 会在模块注册变量
     * 变量	作用
      __webpack_public_path__	资源加载基路径
      __webpack_require__	模块加载函数
      __webpack_require__.p	publicPath（同上）
      __webpack_require__.c	module cache
      __webpack_require__.m	modules map
      __webpack_require__.e	异步 chunk 加载
      __webpack_hash__	compilation hash
      __webpack_nonce__	CSP nonce
      __webpack_base_uri__	base URI（Webpack 5）
     */
    rules: [
      {
        test: /\.jsx/,
        use: [
          /** 这是一个常见的优化组合
           * cache-loader 用来缓存loader处理结果，如果包含缓存，会在pitch阶段熔断
           * thread-loader 会开启多线程处理loader
           */
          "thread-loader", // 最前面
          "cache-loader", // 需要缓存的loader前面
          {
            // 使用babel-loader处理jsx/tsx
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          // 把cssloader的结果，通过style的方式插入到header
          // "style-loader",
          // 把cssloader的结果，作为.css文件输出到输出目录
          MiniCssExtractPlugin.loader,
          // 处理css文件 并且处理css模块化
          {
            loader: "css-loader",
            options: {
              modules: true, // 启用CSS Modules
              esModule: false, // 强制使用 ES6 模块导出
            },
          },
          // 处理less文件
          "less-loader",
        ],
      },
      // 以下为css相关loader的自己实现
      // {
      //   test: /\.css$/,
      //   use: [
      //     "my-style-loader",
      //     {
      //       loader: ".my-css-loader",
      //       options: {
      //         module: true,
      //       },
      //     },
      //   ],
      // },
      // {
      //   test: /\.css$/,
      //   use: [
      //     "/my-style-loader-pitch",
      //     {
      //       loader: "/my-css-loader-pitch",
      //       options: {
      //         module: true,
      //       },
      //     },
      //     // {
      //     //   loader: "/delay-loader",
      //     //   options: {
      //     //     delay: 10000,
      //     //   },
      //     // },
      //   ],
      // },

      /**
       * asset/xxx 系列 处理资源的导入 - 支持[ext]
       * type: asset/resource 会生成独立的文件到输出目录中，并且返回输出文件的地址 适用于大的文件
       * type: asset/inline 把图片转换成DataURL的形式输出 适合小文件
       * type: asset/source 把文件原封不动的按照字符串的方式输出，如果文件不是utf-8可能会乱码
       */
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
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/inline",
      },

      /** 这种适合txt文件 */
      {
        test: /\.txt$/i,
        type: "asset/source",
      },

      /** 区分rawloader
       * raw-loader 和 asset/source 不一样
       * rawLoader 会直接把node Buffer 的结果转换为JSON输出
       */
      // {
      //   test: /\.png|jpe?g|gif|svg/,
      //   use: [
      //     {
      //       loader: "my-raw-loader",
      //     },
      //   ],
      // },

      // {
      //   test: /\.png|jpe?g|gif|svg/,
      //   use: [
      //     {
      //       loader: "/my-file-loader",
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
      //       loader: "/my-raw-loader",
      //     },
      //   ],
      // },
    ],
  },
  /** 配置外部依赖 */
  /** 外部依赖导入方式 var */
  // externalsType: "var",
  // /** 配置 外部依赖 到 内部包名称的映射 */
  // externals: {
  //   jquery: "$",
  // },
  /** =========================================== 插件相关 =========================================== */
  /** 用来配置插件Plugin
   *  插件使用 tapable库 通过注册钩子函数的方式，让开发者接入编译流程
   *
   * 常见声明周期流程
   * initialize  run compile compilation make
   * buildModule succeedModule finishedModules optimize
   * aftercompile emit afterEmit doe failed
   */
  plugins: [
    /** 自动生成HTML文档 */
    new HtmlWebpackPlugin({
      template: "./template.ejs",
      inject: "body",
      cdn: {
        jquery: [
          /** backup cdn */
          // "https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.js",
          // "https://cdn.bootcdn.net/ajax/libs/react-dom/16.0.0-beta.1/cjs/react-dom-node-stream.production.min.js",
        ],
        // lodash: ["/manager/lib/lodash.js"],
      },
    }),
    /** 用来定义一些全局变量 */
    new DefinePlugin({
      // "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      PI: 3.1415926,
    }),
    /** shimming 垫片
     * 项目中需要用到 $ / _ 这些 webpack会自动将其和 jquery lodash等 绑定
     */
    new ProvidePlugin({
      // _: "lodash",
      $: "jquery",
    }),
    /** PurgeCssPlugin 用来处理未使用的 css [对cssmodule无效]
     * path 查找需要比对的文件
     * 用到glob库 返回src下所有的文件
     */
    // new PurgeCSSPlugin({
    //   /** 写绝对路径要检查哪些文件是否用过css */
    //   paths: (() => {
    //     return glob.sync(path.resolve(__dirname, "./src/**/*"), {
    //       nodir: true, // 不匹配目录
    //     });
    //   })(),
    // }),
    /** 把css生成独立的css文件 */
    new MiniCssExtractPlugin({
      filename: "web-static/css/[name]-[contenthash:8].css",
      chunkFilename: "web-static/[name]-[contenthash:8].css",
    }),
    /** 自定义的插件 用来输出构建结果信息 */
    new AssetEmitStatPlugin(),
    /** 用来输出License文件 */
    new BannerPlugin({
      banner: "liuze authorized",
    }),
    /**
     * 用来压缩打包后的文件
     * CompressionWebpackPlugin 不需要在开发模式中开启，
     * 因为devServer自己会开启压缩，引入这个插件完全就是无用功，拖慢构建速度
     *  */
    process.env.NODE_ENV === "production"
      ? new CompressionWebpackPlugin({
          test: /\.(js|css|less)$/,
          algorithm: "gzip", //压缩算法
          minRatio: 0.7, // 压缩倍率
        })
      : null,
    /** Copy-Webpack-Plugin 生产环境用
     *  把不需要编译的文件拷贝到输出目录中
     */
    process.env.NODE_ENV === "production"
      ? new CopyWebpackPlugin({
          patterns: [
            {
              from: "./dll/lib",
              to: "./lib",
            },
            {
              from: "./public",
              to: "./",
            },
          ],
        })
      : null,
    /** 用来自动处理react的hmr优化 */
    process.env.NODE_ENV == "development"
      ? new ReactRefreshWebpackPlugin()
      : null,
    /** 用来分析打包结果 */
    process.env.Analyze == 1 ? new BundleAnalyzerPlugin() : null,
    /** 手动分包引入manifest.json使用
     *  手动分包过程
     *  DllPlugin 对资源打包 生成manifest.json
     *  CopyWebpackPlugin 把静态资源引入输出目录
     *  HtmlWebpackPlugin配置引入资源
     *  DllReferencePlugin 引入manifest
     */
    // new DllReferencePlugin({
    //   manifest: path.resolve(__dirname, "./dll/manifest/lodash-manifest.json"),
    // }),
  ].filter((f) => f),
  /** =========================================== 优化相关 =========================================== */
  optimization: {
    /** chunk的id 包含 named 名称 | deterministic 名称短hash | natural 数字
     *  对于动态引入的模块，需要用魔法注释 WebpackChunkName 配置chunkName
     *  如果不配置 name 和 id 都由chunkId控制
     *  默认name为路径 _ 连接 比如 src_page_daynmic_jsx
     */
    chunkIds: "deterministic",
    /** moduleId 模块的id
     *  模块name默认为路径
     *  named会把id设置成一个可读的名称 一般为路径
     *  natural 为数字
     *  deterministic为根据名称生成的短hash
     */
    moduleIds: "named",
    /** minimizer 是存放 */
    minimize: true,
    minimizer: [
      /** 压缩 CSS */
      new CssMinimizerPlugin(),
      /** 压缩 混淆 JS
       * terser 一定要放在 minimizer 而不是 plugin
       * 对于CopyWebpackPlugin拷贝的内容 也进行压缩
       *
       * 对于没有副作用的函数调用 注意是调用
       * 需要使用 /*#__PURE__*\/ 标记 让terser可以删除dead_code
       *
       * 也可以在package.json中设置sideEffects: [] 标记哪些文件有副作用
       */
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
        // 提取注释信息
        extractComments: true,
        // 并行压缩
        parallel: true,
      }),
    ].filter((f) => f),
    /**
     * treeShaking 优化开关
     * 注意 必须是 ESModule 静态导入 对于cjs这样的动态导入无法优化，所以尽可能使用支持ESM的模块
     * treeShaking负责模块之间的未使用标记 注意 只是标记！
     * 一般为 unused harmony export (harmony export 为esmodule export 因为es6最初立项名字就是 harmony!)
     *
     * 最终会由 Terser 删除这些标记
     * 注意 /*#__PURE__ 一般为人工标记 webpack不会加这个标记!
     */
    usedExports: true,

    /** 自动拆包优化
     *  一般配合 Analyze模式使用
     * 什么时候不需要拆包
     * 1. 多个入口共同引用一个模块
     * 2. 体积大 不经常变动的模块
     */
    // splitChunks: {
    //   /** 优化的作用范围 默认为 async 即仅对动态导入模块进行优化
    //    *  注意，对动态模块的拆分是webpack的默认行为！
    //    *  initial 为 仅对同步模块进行拆分，不对异步引入模块进行拆分
    //    *  all 对同步 异步模块 一起进行拆分优化
    //    */
    //   chunks: "all",
    //   minSize: 200,
    //   // maxSize: 200000,
    //   // 最少引用次数，大于这个数才拆包
    //   minChunks: 1,
    //   // 最大同步请求
    //   maxInitialRequests: 30,
    //   // 最大异步请求
    //   maxAsyncRequests: 30,
    //   /** 缓存组 只有命中才会优化 */
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
    //     // 默认 缓存组配置
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
