// 同步方式
// 由于有上下文，所以这里不能使用箭头函数
// module.exports = function (source) {
// 	// 如果 loader有 options, webpack 的上下文中 query 会指向 options
// 	const result = source.replace('loader', this.query.name);
// 	this.callback(null, result);
// };

module.exports = function (source) {
	console.log('222 :>> ', 222); // hk-log
	const result = source.replace('loader', 'hahah');
	return result;
};
