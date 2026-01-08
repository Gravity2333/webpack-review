module.exports = function (content) {
  const callback = this.async();

  setTimeout(() => {
    this.emitFile('./test.txt',"已经延迟")
    callback(null, content);
  }, this.getOptions().delay || 100);
};
