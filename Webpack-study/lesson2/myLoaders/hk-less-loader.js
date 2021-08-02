const less = require('less');

module.exports = function (source) {
	less.render(source, (error, output) => {
		const cssInfo = output.css;
		this.callback(error, cssInfo);
	});
console.log('111 :>> ', 111); // hk-log
	return source;
};
