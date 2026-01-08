module.exports = function(content){
    console.log(`export default "${content}"`)
    return `export default ${JSON.stringify(content)}`
}
module.exports.raw = true