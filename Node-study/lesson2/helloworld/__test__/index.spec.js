test('测试 Hello world', () => {
	const ret = require('../index');
	console.log('hellowworld :>> ', ret);
	expect(ret).toBe('hello world');
});
