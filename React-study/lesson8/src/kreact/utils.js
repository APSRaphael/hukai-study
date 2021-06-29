export function isFn(fn) {
	return typeof fn === 'function';
}

export function isStr(s) {
	return typeof s === 'string';
}

export function isStringOrNumber(s) {
	return typeof s === 'string' || typeof s === 'number';
}

export function isArray(arr) {
	return Array.isArray(arr);
}

export function updateNode(node, prevVal, nextVal) {
	Object.keys(prevVal).forEach((k) => {
		if (k === 'children') {
			if (isStringOrNumber(prevVal[k])) {
				node.textContent = '';
			}
		} else if (k.slice(0, 2) === 'on') {
			const eventName = k.slice(2).toLocaleLowerCase();
			node.removeEventListener(eventName, prevVal[k]);
		} else {
			if (!(k in nextVal)) {
				node[k] = '';
			}
		}
	});

	Object.keys(nextVal).forEach((k) => {
		if (k === 'children') {
			if (isStringOrNumber(nextVal[k])) {
				node.textContent = nextVal[k] + '';
			}
		} else if (k.slice(0, 2) === 'on') {
			const eventName = k.slice(2).toLocaleLowerCase();
			node.addEventListener(eventName, nextVal[k]);
		} else {
			node[k] = nextVal[k];
		}
	});
}

export const NoFlags = /*                      */ 0b000000000000000000;
export const Placement = /*                    */ 0b000000000000000010; // 2
export const Update = /*                       */ 0b000000000000000100; // 4
export const Deletion = /*                     */ 0b000000000000001000; // 8
