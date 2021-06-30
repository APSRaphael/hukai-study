function render(vnode, container) {
	console.log('vnode :>> ', vnode);
	const node = createNode(vnode);

	container.appendChild(node);
	// 1. vnode => node
	// 2. node => container
}

function isString(s) {
	return typeof s === 'string';
}

function createNode(vnode) {
	let node;
	// 根据 vnode 生成 node

	const { type, props } = vnode;
	// vnode 如果是文件就不存在 type
	if (isString(type)) {
		node = document.createElement(type);
		reconcileChildren(node, props.children);
		updateNode(node, props);
	} else if (typeof type === 'function') {
        console.log('type11 :>> ', type);
		// 需要区分类组件和函数组件
		node = type.prototype.isReactComponent
			? updateClassComponent(vnode)
			: updateFunctionComponent(vnode);
	} else {
		// 直接生成文本
		node = document.createTextNode(vnode);
	}
	return node;
}

function updateClassComponent(vnode) {
	const { type, props } = vnode;
	const instance = new type(props);
	const child = instance.render();
	const node = createNode(child);
	return node;
}

function updateFunctionComponent(vnode) {
	const { type, props } = vnode;
	const child = type(props);
	const node = createNode(child);
	console.log('child :>> ', child);
	return node;
}

function updateNode(node, nextVal) {
	Object.keys(nextVal)
		.filter((k) => k !== 'children')
		.forEach((k) => {
			node[k] = nextVal[k];
		});
}

function reconcileChildren(parentNode, children) {
	const newChildren = Array.isArray(children) ? children : [children];
	for (let i = 0; i < newChildren.length; i++) {
		const child = newChildren[i];
		// child 可能是文本 createNode 接受到的 vnode就不存在 type
		render(child, parentNode);
	}
}

export default { render };

