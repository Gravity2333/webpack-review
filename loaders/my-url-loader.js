const mime = require("mime-types");
module.exports = function (content) {
  const mimeType = mime.lookup(this.resourcePath) || "";
  const data = content.toString("base64"); // 注意 这里是 buffer 必须开启raw
  return `export default "data:${mimeType};base64,${data}"`;
};

module.exports.raw = true;
