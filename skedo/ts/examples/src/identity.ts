// function identity(arg: number): number {
// 	return arg;
// }

// function identity(arg: number) { // 这里不写函数的返回值类型也可以，ts会自动推导出是 number
// 	return arg;
// }

// 为了让 identity 可以支持更多类型，可以声明它是 any
// function identity(arg: any): any {
// 	return arg;
// }

// 但是 any 会丢失掉后续的所有检查，因此可以考虑使用泛型
function identity<Type>(arg: Type): Type {
	return arg;
}

let output = identity<string>("113");

// 不显示指定<>中的类型
let output2 = identity("number");

// class GenericNumber<Type> {
// 	zeroValue: Type;
// 	add: (x: Type, y: Type) => Type;
// }

// 声明和定义
class GenericNumber<T> {
	zeroValue: T;
	constructor(v: T) {
		this.zeroValue = v;
	}
	add(x: T, y: T) {
		return x as any + y as any;
	}
}

let myGenericNumber = new GenericNumber<number>(22);

// myGenericNumber.zeroValue = '123' // ERROR
myGenericNumber.zeroValue = 1234;

myGenericNumber.add = (x, y) => {
	return x + y;
};

let stringNumber = new GenericNumber<string>("34");
stringNumber.zeroValue = "124";
stringNumber.add = (x, y) => x + y;

myGenericNumber.add(1, 2);
stringNumber.add("1", "2");

console.log(" myGenericNumber.add(1, 2):>> ", myGenericNumber.add(1, 2)); // hk-log
console.log(" stringNumber.add(1, 2):>> ", stringNumber.add("1", "2")); // hk-log

// function loggingIdentity<Type>(arg: Type): Type {
//     // 由于不确定泛型会传什么类型，这里获取 length 的 操作会在编译的时候就报错
// 	// 类型“Type”上不存在属性“length”。
// 	// console.log('arg.length :>> ', arg.length); // hk-log
// 	return arg;
// }

interface Lengthwise {
	length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
	console.log("arg.length :>> ", arg.length); // hk-log
	return arg;
}

// type 类型的别名
type Point = { x: number; y: number };

// Point 是 {x:number,y:number} 的类型别名

type P = keyof Point;
// P = 'x' | 'y';  把 Point 的 key 取出来

// Type {
//     a:number,
//     b:number,
//     c:number,
//     d:number,
// }

function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
	return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");

// Key 'a' | 'b' | 'c' | 'd'
// getProperty(x, "m");  // 类型“"m"”的参数不能赋给类型“"a" | "b" | "c" | "d"”的参数。

function isSet<T>(x: any): x is Set<T> {
	return x instanceof Set;
}

function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add<T>(a: Set<T>, b: Set<t>): Set<T>;

function add<T>(a: T, b: T): T {
	if (isSet<T>(a) && isSet<T>(b)) {
		return new Set([...a, ...b]) as any;
	}
	return (a as any) + (b as any);
}
