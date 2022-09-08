(() => {
	type SomeConstructor<T> = {
		new (num: number): T;
	};

	function fn<T>(ctor: SomeConstructor<T>, n: number) {
		return new ctor(n);
	}

	const arr = fn<Array<string>>(Array, 100);
	// console.log("arr :>> ", arr); // hk-log
})();

function firstElement<T>(arr: T[]): T {
	return arr[0];
}

firstElement(["234", 1234]);

function map<Input, Output>(
	arr: Input[],
	func: (arg: Input) => Output
): Output[] {
	return arr.map(func);
}

const parsed = map(["1", "2", "3"], (n) => parseInt(n));

function minimumLength<T extends { length: number }>(
	obj: T,
	minimum: number
): T {
	if (obj.length >= minimum) {
		return obj;
	} else {
        return obj.constructor(minimum)
		// return { length: minimum }; // 不是所有 length 属性的就是 T  比如 T = Array<string>  有 length, 但是{length:minimum}不是 Array<string>
	}
}


function minimumLength1<T extends { length: number }>(
	obj: T,
	minimum: number,
    typeClass:{
        new (n:number):T
    }
): T {
	if (obj.length >= minimum) {
		return obj;
	} else {
        return new typeClass(minimum)
	}
}

minimumLength1(new Array<string>(100), 1000, Array)
