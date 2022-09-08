type Fish = { swim: () => void };
type Bird = { fly: () => void };

const fish: Fish = {
	swim: () => {
		console.log("swimming :>> "); // hk-log
	},
};

const bird: Bird = {
	fly: () => {
		console.log("flying :>> "); // hk-log
	},
};

function isFish(pet: Fish | Bird): pet is Fish {
	return (pet as Fish).swim !== undefined;
}

let pet = { fly: () => {} };

if (isFish(pet)) {
	console.log("22 :>> ", 22); // hk-log
	pet.swim();
} else {
	pet.fly();
	console.log("33 :>> ", 33); // hk-log
}

if (isFish(bird)) {
	bird.swim();
	console.log("123 :>> ", 123); // hk-log
}

interface Circle {
	kind: "circle";
	radius: number;
}

interface Square {
	kind: "square";
	sideLength: number;
}

interface Triangle {
    kind:'triangle';
    sideLength:number;
}

type Shape = Circle | Square | Triangle;

// function getArea(shape: Shape) {
// 	if (shape.kind === "circle") {
// 		return Math.PI * shape.radius ** 2;
// 	}
// }

function getArea(shape: Shape) {
	switch (shape.kind) {
		case "circle":
			return Math.PI * shape.radius ** 2;
		case "square":
			return shape.sideLength ** 2;
		default:
			const _exhaustiveCheck: never = shape;  // 如果有没有定义的类型就会导致这里报错 相当于一个 throw
		    return _exhaustiveCheck;
	}
}
