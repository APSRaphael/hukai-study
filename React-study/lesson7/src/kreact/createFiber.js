export function createFiber(vnode, returnFiber) {
	const fiber = {
		type: vnode.type,
		key: vnode.key,
		props: vnode.props,
		stateNode: null,
		child: null,
		sibling: null,
		return: returnFiber,
		// flags:
	};

	return fiber;
}
