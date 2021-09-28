const path = require('path');
const fs = require('fs');
module.exports = class TestNow {
	genJestSource(sourcePath = path.resolve('./')) {
		const testPath = `${sourcePath}/__test__`;
		if (!fs.existsSync(testPath)) {
			fs.mkdirSync(testPath);
		}

		let list = fs.readdirSync(sourcePath);
		list
			// 添加完整路径
			.map((v) => `${sourcePath}/${v}`)
			//过滤文件
			.filter((v) => fs.statSync(v).isFile())
			// 排除测试代码
			.filter((v) => v.indexOf('.spec') === -1)
			.map((v) => this.genTestFile(v));

		console.log('list :>> ', list); // hk-log
	}

	genTestFile(filename) {
		console.log('filename :>> ', filename); // hk-log
		const testFileName = this.getTestFileName(filename);

		// 判断文件是否存在
		if (fs.existsSync(testFileName)) {
			console.log('该测试代码已存在 :>> ', testFileName); // hk-log
			return;
		}

		const mod = require(filename);
		let source;
		if (typeof mod === 'object') {
			source = Object.keys(mod)
				.map((v) => this.getTestSource(v, path.basename(filename), true))
				.join('\n');
			console.log('source :>> ', source); // hk-log
		} else if (typeof mod === 'function') {
			const basename = path.basename(filename);
			source = this.getTestSource(basename.replace('.js', ''), basename);
		}

		fs.writeFileSync(testFileName, source);
	}

	/**
	 * 生成测试代码
	 * @param {*} filename
	 * @returns
	 */
	getTestSource(methodName, classFile, isClass = false) {
		return `
test('${'TEST ' + methodName}', ()=>{
		const ${isClass ? '{ ' + methodName + ' }' : methodName} = require('${
			'../' + classFile
		}');
		const ret = ${methodName}();
		// expect(ret)
		// .toBe('test return')
})`;
	}

	/**
	 * 生成测试文件名
	 * @param {*} filename
	 * @returns
	 */
	getTestFileName(filename) {
		const dirName = path.dirname(filename);
		const baseName = path.basename(filename);
		const extName = path.extname(filename);
		const testName = baseName.replace(extName, `.spec${extName}`);
		return path.format({
			root: dirName + '/__test__/',
			base: testName,
		});
	}
};
