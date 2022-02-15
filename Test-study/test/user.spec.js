const User = require('./User');

test('should setName ', () => {
	const user = new User('hei');

	user.setName('xiao');

	expect(user.name).toBe('xiao');
});
