module.exports = (content) => content;

module.exports.pitch = function(previousLoaders) {
  return `
    import cssInfos from "!!${previousLoaders}";
    const { sourceContent, map } = cssInfos
    // 注入 style
    const style = document.createElement('style');
    style.innerHTML = sourceContent;
    document.head.appendChild(style);

    // 导出 className 映射
    export default map;
  `;
};
