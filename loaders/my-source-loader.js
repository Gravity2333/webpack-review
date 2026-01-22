module.exports = function(content){
    return `export default ${JSON.stringify(content)}`
}
module.exports.raw = false