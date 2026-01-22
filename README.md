# Webpack Review

这是一个用于复习和学习 Webpack 配置、用法和原理的项目。通过自定义 loader、plugin 和各种配置示例，帮助深入理解 Webpack 的工作机制。

## 功能特性

- **自定义 Loader**: 实现了多个自定义 loader，包括 CSS loader、文件 loader、URL loader 等
- **自定义 Plugin**: 包含 AssetEmitStatPlugin 等自定义插件
- **DLL 配置**: 支持动态链接库 (DLL) 打包优化
- **多页面应用**: 支持多个页面路由
- **开发和生产环境**: 分别配置开发和生产环境的构建
- **热重载**: 支持 React 组件的热重载
- **代码分析**: 集成 webpack-bundle-analyzer 进行打包分析

## 安装依赖

```bash
pnpm install
```

## 使用方法

### 开发环境

启动开发服务器：

```bash
pnpm run start
```

### 生产构建

构建生产版本：

```bash
pnpm run build
```

### 构建分析

分析打包结果：

```bash
pnpm run build:analyze
```

### DLL 构建

构建动态链接库：

```bash
pnpm run build:dll
```

### 监听模式

监听文件变化并自动构建：

```bash
pnpm run watch
```

## 项目结构

```
webpack-review/
├── dll/                          # DLL 相关文件
│   ├── lib/                      # DLL 库文件
│   │   ├── jquery.js
│   │   ├── lodash.js
│   │   └── ...
│   └── manifest/                 # DLL manifest 文件
├── loaders/                      # 自定义 loader
│   ├── delay-loader.js           # 延迟加载 loader
│   ├── my-css-loader.js          # 自定义 CSS loader
│   ├── my-file-loader.js         # 自定义文件 loader
│   ├── my-raw-loader.js          # 原始内容 loader
│   ├── my-source-loader.js       # 源码 loader
│   ├── my-style-loader.js        # 自定义样式 loader
│   ├── my-url-loader.js          # 自定义 URL loader
│   └── *-pitch.js                # 对应的 pitch 函数
├── plugins/                      # 自定义 plugin
│   └── AssetEmitStatPlugin.js    # 资源统计插件
├── public/                       # 公共资源
│   └── config.js                 # 配置文件
├── src/                          # 源代码
│   ├── assets/                   # 静态资源
│   ├── pages/                    # 页面组件
│   │   ├── Dynamic/              # 动态页面
│   │   ├── Dynamic2/             # 另一个动态页面
│   │   ├── Home/                 # 首页
│   │   └── Utils/                # 工具页面
│   ├── utils/                    # 工具函数
│   ├── app.jsx                   # 主应用组件
│   ├── global.less               # 全局样式
│   ├── index.jsx                 # 入口文件
│   └── test.txt                  # 测试文件
├── dll.config.js                 # DLL webpack 配置
├── package.json                  # 项目配置
├── pnpm-lock.yaml                # pnpm 锁文件
├── pnpm-workspace.yaml           # pnpm 工作区配置
├── template.ejs                  # HTML 模板
├── webpack.config.js             # 主 webpack 配置
└── README.md                     # 项目说明
```

## 自定义 Loader 说明

### CSS Loader
- `my-css-loader.js`: 处理 CSS 文件，添加自定义样式处理逻辑
- `my-css-loader-pitch.js`: CSS loader 的 pitch 函数

### 样式 Loader
- `my-style-loader.js`: 将 CSS 注入到 DOM 中
- `my-style-loader-pitch.js`: 样式 loader 的 pitch 函数

### 文件处理 Loader
- `my-file-loader.js`: 处理文件资源，返回文件路径
- `my-url-loader.js`: 处理小文件，返回 base64 编码

### 其他 Loader
- `my-raw-loader.js`: 返回文件原始内容
- `my-source-loader.js`: 处理源码文件
- `delay-loader.js`: 模拟延迟加载的 loader

## 自定义 Plugin 说明

### AssetEmitStatPlugin
统计并输出构建资源的详细信息，包括文件大小、数量等。

## 配置说明

### 主配置文件
`webpack.config.js` 包含了完整的 webpack 配置，包括：
- 入口和出口配置
- Loader 配置
- Plugin 配置
- 开发服务器配置
- 优化配置

### DLL 配置
`dll.config.js` 用于生成动态链接库，提高构建速度。

## 技术栈

- **Webpack 5**: 核心打包工具
- **React**: 前端框架
- **Babel**: JavaScript 转译器
- **Less**: CSS 预处理器
- **pnpm**: 包管理器

## 依赖包

主要依赖包括：
- `webpack` 和相关插件
- `react` 和 `react-dom`
- `babel-loader` 和相关 preset
- `css-loader`, `style-loader`, `less-loader`
- `html-webpack-plugin`
- `mini-css-extract-plugin`
- `webpack-bundle-analyzer`

## 许可证

ISC 