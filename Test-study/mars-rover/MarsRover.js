const { turnLeft, turnRight } = require('./DirectionMap');
module.exports = class MarsRover {
	constructor(position, direction) {
		this.position = position;
		this.direction = direction;
	}

	getState = () => {
		return {
			position: { x: this.position.x, y: this.position.y },
			direction: this.direction,
		};
	};

	turnLeft = () => {
		this.direction = turnLeft(this.direction);
	};
	turnRight = () => {
		this.direction = turnRight(this.direction);
	};
};
