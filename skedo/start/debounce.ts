export function debounce(fn: Function, delay: number = 300) {
	let I;
	return (...args: Array<any>) => {
		clearTimeout(I);
		I = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}

export function debounce(fn: Function, delay: number = 300) {
	let I;
	return (...args: any[]) => {
		clearTimeout(I);
		I = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}

export function debounce(fn: Function, delay: number = 300) {
	let I;
	return (...args: any[]) => {
		clearTimeout(I);
		I = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}
