const a = require('./a')
const  object = {
   name:'从构建产物洞悉模块化原理',
   author:'不要秃头啊'
}
console.log(`a2 :>> `, a.say()); // hk-log
console.log('我是 b 文件')
module.exports = function(){
    return object
}
