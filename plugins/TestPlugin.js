module.exports = class TestPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("TestPlugin", (compliation) => {
      console.log("compliation创建完成:");
    });
    compiler.hooks.emit.tap("TestPlugin", (compliation) => {
      let assetsResults = "";
      Object.keys(compliation.assets).forEach((filename) => {
        const asset = compliation.assets[filename];
        assetsResults += "文件名:" + filename + "大小:" + asset.size() + "\n";
      });

      compliation.assets["资源列表.txt"] = {
        source: () => assetsResults,
        size: () => Buffer.byteLength(assetsResults),
      };

      console.log("准备输出:", assetsResults + new Date());
    });
  }
};
