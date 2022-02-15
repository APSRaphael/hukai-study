const MarsRover = require('./MarsRover');
const Position = require('./Position');
const Direction = require('./Direction');

describe('marsRover', () => {
	test('should return position and direction', () => {
		const marsRover = new MarsRover(new Position(0, 0), Direction.N);

		expect(marsRover.getState()).toEqual({
			position: { x: 0, y: 0 },
			direction: Direction.N,
		});
	});
});

describe('true Left', () => {
	it('should N -> W', () => {
		const marsRover = new MarsRover(new Position(0, 0), Direction.N);

		marsRover.turnLeft();

		expect(marsRover.getState()).toEqual({
			position: { x: 0, y: 0 },
			direction: Direction.W,
		});
	});
	it('should W -> S', () => {
		const marsRover = new MarsRover(new Position(0, 0), Direction.W);

		marsRover.turnLeft();

		expect(marsRover.getState()).toEqual({
			position: { x: 0, y: 0 },
			direction: Direction.S,
		});
	});
	it('should S -> E', () => {
		const marsRover = new MarsRover(new Position(0, 0), Direction.S);

		marsRover.turnLeft();

		expect(marsRover.getState()).toEqual({
			position: { x: 0, y: 0 },
			direction: Direction.E,
		});
	});
	it('should E -> N', () => {
		const marsRover = new MarsRover(new Position(0, 0), Direction.E);

		marsRover.turnLeft();

		expect(marsRover.getState()).toEqual({
			position: { x: 0, y: 0 },
			direction: Direction.N,
		});
	});
});

describe('turn Right', () => {
	it('should N -> E', () => {
		const marsRover = new MarsRover(new Position(0, 0), Direction.N);

		marsRover.turnRight();

		expect(marsRover.getState()).toEqual({
			position: { x: 0, y: 0 },
			direction: Direction.E,
		});
	});
	it('should E -> S', () => {
		const marsRover = new MarsRover(new Position(0, 0), Direction.E);

		marsRover.turnRight();

		expect(marsRover.getState()).toEqual({
			position: { x: 0, y: 0 },
			direction: Direction.S,
		});
	});
	it('should S -> W', () => {
		const marsRover = new MarsRover(new Position(0, 0), Direction.S);

		marsRover.turnRight();

		expect(marsRover.getState()).toEqual({
			position: { x: 0, y: 0 },
			direction: Direction.W,
		});
	});
	it('should W -> N', () => {
		const marsRover = new MarsRover(new Position(0, 0), Direction.W);

		marsRover.turnRight();

		expect(marsRover.getState()).toEqual({
			position: { x: 0, y: 0 },
			direction: Direction.N,
		});
	});
});
