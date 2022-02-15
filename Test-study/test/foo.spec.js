const foo = require('./foo');
const bar = require('./bar');


jest.mock('./bar', () => {
	return jest.fn();
});

test('should call bar', () => {
	// when
	foo();

	// then
	// console.log('bar :>> ', bar); // hk-log
	expect(bar).toBeCalled();
});
