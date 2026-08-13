console.log('我是 a 文件')
exports.say = function(){
	console.log(`getMes :>> `, getMes); // hk-log
	const message = getMes()
	console.log(message)
}
const getMes = require('./b')
