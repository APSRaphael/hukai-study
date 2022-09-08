function doSomething(x: string | null) {
	console.log("Hello :>> ", x!.toUpperCase()); // hk-log
}

enum Direction {
	Up = 1,
	Down,
	Left,
	Right,
}

console.log("direction.Dwon :>> ", Direction.Down); // hk-log
console.log("direction[Direction.Down] :>> ", Direction[Direction.Down]); // hk-log

enum E {
	X,
	Y,
	Z,
}

function f(obj: { X: number }) {
	return obj.X;
}

f(E);
f({ X: 4 });
// f({ Y: 4 }); //ERROR
// f({ X: 4, Y: 4 }); //ERROR
// f({ X: 1, Y: 3, Z: 5 }); //ERROR

// interface

// inheritance

// generics

// interest point 关注点  关注点分离

// 泛型是一种抽象共性的编程手段，它允许将类型作为其他类型的参数，从而分离不同关注点的实现  （泛型的作用）

// Array<T> 分离的是数据可以被线性访问、存储的共性。
// Stream<T> 分离的是数据可以随着时间产生的共性。
// Promise<T>分离的是数据可以被异步计算的特性。
