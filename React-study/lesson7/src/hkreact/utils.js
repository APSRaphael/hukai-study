export function isFn(fn) {
	return typeof fn === 'function';
}
export function isStr(s) {
	return typeof s === 'string';
}
export function updateNode(node, nextValue) {
	Object.keys(nextValue).forEach((k) => {
		if (k === 'children') {
			if (isStr(nextValue.children)) {
				node.textContent = nextValue.children;
			}
		} else {
			node[k] = nextValue[k];
		}
	});
}
