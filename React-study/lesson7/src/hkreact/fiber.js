export function createFiber(vnode, returnFiber) {
	console.log('vnode :>> ', vnode); // hk-log
	const fiber = {
		type: vnode.type,
		key: vnode.key,
		props: vnode.props,
		stateNode: null,
		child: null,
		sibling: null,
		return: returnFiber,
	};

	return fiber;
}
