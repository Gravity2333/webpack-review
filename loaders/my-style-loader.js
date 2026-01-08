module.exports = (content) => {
  const extractSource = /(?<=__CSS_SOURCE__)((\S|\s)*?)(?=\*\/)/g;
  const extractClassNameMap = /(?<=__CSS_classKeyMap__)((\S|\s)*?)(?=\*\/)/g;
  const source = content.match(extractSource)[0];
  const classNameMap = content.match(extractClassNameMap)[0];

  return `
    const style = document.createElement('style');
    style.innerHTML = \`${source}\`;
    document.head.appendChild(style);
    export default ${classNameMap}`;
};
