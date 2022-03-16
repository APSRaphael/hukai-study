const less = require('less');

module.exports = function (source) {
	less.render(source, (error, output) => {
		const cssInfo = output.css;
		this.callback(error, cssInfo); // 正常的使用 callback 是同步使用
	});
	console.log('111 :>> ', 111); // hk-log
	// return source; 这里不需要返回，代码通过 callback 传递给下一个 loader
};
