import { createFiber } from './fiber';
import { isStr, updateNode } from './utils';

export function updateFunctionComponent(wip) {
	const { type, props } = wip;
	const children = type(props);
	// console.log('type :>> ', type); // hk-log

	reconcileChildren(wip, children);
}
export function updateHostComponent(wip) {
	if (!wip.stateNode) {
		wip.stateNode = document.createElement(wip.type);
		// 更新属性
		updateNode(wip.stateNode, wip.props);
	}

	reconcileChildren(wip, wip.props.children);
	console.log('wip :>> ', wip); // hk-log
}

export function updateFragmentComponent(wip) {
	reconcileChildren(wip, wip.props.children);
}

function reconcileChildren(returnFiber, children) {
	if (isStr(children)) {
		return;
	}
	const newChildren = Array.isArray(children) ? children : [children];

	let previousNewFiber = null;
	console.log('newChildren :>> ', newChildren); // hk-log
	for (let i = 0; i < newChildren.length; i++) {
		const newChild = newChildren[i];
		console.log('newChild :>> ', newChild); // hk-log
		const newFiber = createFiber(newChild, returnFiber);

		if (i === 0) {
			returnFiber.child = newFiber;
		} else {
			previousNewFiber.sibling = newFiber;
		}
		previousNewFiber = newFiber;
	}
}
