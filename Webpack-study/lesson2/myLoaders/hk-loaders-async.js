// 由于有上下文，所以这里不能使用箭头函数
module.exports = function (source) {
	// 异步方式 通过 async返回一个 callback
	const callback = this.async();
	console.log('111 :>> ', 111); // hk-log
	setTimeout(() => {
		const result = source.replace('hello', this.query.name);
		callback(null, result);
	}, 2000);
};
