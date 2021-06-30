import { Placement } from './utils';

export function createFiber(vnode, returnFiber) {
	const fiber = {
		type: vnode.type,
		key: vnode.key,
		props: vnode.props,
		stateNode: null, // 原生标签的时候指 dom 节点，类组件的时候指的是实列
		child: null, // 第一个子 fiber
		sibling: null, // 下一个兄弟 fiber
		return: returnFiber, // 父fiber
		// 标记节点类型
		flags: Placement,
		// 老节点
		alternate: null,
		deletions: null, // 要删除子节点
		index: null, // 当前层级下标 从 0 开始
	};

	return fiber;
}
