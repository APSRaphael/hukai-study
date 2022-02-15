const { add } = require('./add');

test('should 1 + 1 = 2', () => {
	const a = 1;
	const b = 1;
	const c = add(a, b);
	expect(c).toBe(2);
});
