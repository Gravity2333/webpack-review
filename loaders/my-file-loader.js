const { interpolateName } = require("loader-utils");
module.exports = function (content) {
  const { generator = {} } = this.getOptions();
  const filename = interpolateName(this, generator.filename, { content });
  // content 是 buffer
  this.emitFile(filename, content);
  return `export default \`\${__webpack_public_path__}${filename}\``;
};

module.exports.raw = true;
