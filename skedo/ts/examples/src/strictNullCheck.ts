function doSomething(x: string | null) {
	console.log("Hello :>> ", x!.toUpperCase()); // hk-log
}

enum Direction {
	Up = 1,
	Down,
	Left,
	Right,
}

console.log('direction.Dwon :>> ', Direction.Down); // hk-log
console.log('direction[Direction.Down] :>> ', Direction[Direction.Down]); // hk-log
