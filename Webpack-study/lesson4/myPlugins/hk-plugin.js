// 是个类
// 必须内置一个 apply 函数
// 插件配置
// hook

class HkPlugin {
	constructor(options) {
		console.log('options.name :>> ', options.name); // hk-log
	}
	apply(compiler) {
		// compiler 实列化的 webpack 对象
		// 同步钩子用 tap 注册
		// 异步钩子用 tapAsync 注册
		// 事件名称为任意值，建议跟插件名称保持一致，或者有语义
		// console.log('hello plugin :>> ', compiler); // hk-log
		// compliation可以获取到源码
		compiler.hooks.emit.tapAsync('hkCountFile', (compilation, cb) => {
			// console.log('compilation :>> ', compilation.assets); // hk-log
			let content = '';
			const fileList = Object.keys(compilation.assets);
			console.log('compilation.assets :>> ', compilation.assets['index.js']); // hk-log
			fileList.forEach((fileName) => {
				content += fileName + '\n';
			});
			content += `文件数量：${fileList.length}`;
			compilation.assets['hkList.txt'] = {
				source: function () {
					return content;
				},
				size: function () {
					return content.length;
				},
			};
			// 异步需要调用一下 cb 不然会阻塞
			cb();
		});
	}
}
module.exports = HkPlugin;
