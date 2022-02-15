const Direction = require('./Direction');

const map = {
	left: {
		[Direction.N]: Direction.W,
		[Direction.W]: Direction.S,
		[Direction.S]: Direction.E,
		[Direction.E]: Direction.N,
	},
	right: {
		[Direction.N]: Direction.E,
		[Direction.E]: Direction.S,
		[Direction.S]: Direction.W,
		[Direction.W]: Direction.N,
	},
};

exports.turnLeft = (direction) => {
	return map.left[direction];
};
exports.turnRight = (direction) => {
	return map.right[direction];
};
