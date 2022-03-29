// 入口文件，通过用户传参判断需要使用的是什么版本的代码，自动匹配
if (process.env.NODE_ENV == 'production') {
	module.exports = require('./umd/add-number.min.js');
} else {
	module.exports = require('./umd/add-number.js');
}
