import { createFiber } from './createFiber';
import { renderHooks } from './hooks';
import { isStringOrNumber, Update, updateNode } from './utils';

export function updateHostComponent(wip) {
	if (!wip.stateNode) {
		wip.stateNode = document.createElement(wip.type);
		// 更新属性
		updateNode(wip.stateNode, {}, wip.props);
	}

	reconcileChildren(wip, wip.props.children);
}

export function updateFunctionComponent(wip) {
	renderHooks(wip);

	const { type, props } = wip;
	const child = type(props);

	reconcileChildren(wip, child);
}

export function updateClassComponent(wip) {
	const { type, props } = wip;
	const instance = new type(props);
	const child = instance.render();
	reconcileChildren(wip, child);
}

export function updateFragmentComponent(wip) {
	reconcileChildren(wip, wip.props.children);
}

// 协调子节点 核心就是 diff
function reconcileChildren(returnFiber, children) {
	if (isStringOrNumber(children)) {
		return;
	}
	const newChildren = Array.isArray(children) ? children : [children];
	let previousNewFiber = null;
	let oldFiber = returnFiber.alternate && returnFiber.alternate.child;

	for (let i = 0; i < newChildren.length; i++) {
		const newChild = newChildren[i];

		const newFiber = createFiber(newChild, returnFiber);

		const same = sameNode(oldFiber, newFiber);

		if (same) {
			Object.assign(newFiber, {
				alternate: oldFiber,
				stateNode: oldFiber.stateNode,
				flags: Update,
			});
		}
		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}
		if (previousNewFiber === null) {
			returnFiber.child = newFiber;
		} else {
			previousNewFiber.sibling = newFiber;
		}

		previousNewFiber = newFiber;
	}
}

function sameNode(a, b) {
	return !!(a && b && a.key === b.key && a.type === b.type);
}
