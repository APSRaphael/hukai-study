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
		alternate: null,
		deletions: null,
		index: null, // 当前层级下的下标
	};

	return fiber;
}
