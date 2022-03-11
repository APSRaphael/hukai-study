import { Placement } from './utils';

export function createFiber(vnode, returnFiber) {
	const fiber = {
		type: vnode.type,
		key: vnode.key,
		props: vnode.props,
		stateNode: null,
		child: null,
		sibling: null,
		return: returnFiber,
		flags: Placement,
		alternate: null, // 老节点
	};

	return fiber;
}
