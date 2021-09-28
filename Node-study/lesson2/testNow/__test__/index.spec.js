const fs = require('fs');
test('集成测试， 测试生成测试代码文件', () => {
	fs.rmdirSync(__dirname + '/data/__test__', {
		recursive: true,
	});

	const src = new (require('../index'))();
	src.genJestSource(__dirname + '/data');
});

// test('测试代码生成1', () => {
// 	const src = new (require('../index'))();
// 	const ret = src.getTestSource('fun', 'class', false);
// 	expect(ret).toBe(`
// test('TEST fun', ()=>{
// 		const fun = require('../class');
// 		const ret = fun();
// 		// expect(ret)
// 		// .toBe('test return')
// })`);
// });

// test('測試文件名生成', () => {
// 	const src = new (require('../index.js'))();
// 	const ret = src.getTestFileName('/hukai/abc/class.js');
// 	expect(ret).toBe('/hukai/abc/__test__/class.spec.js');
// });
