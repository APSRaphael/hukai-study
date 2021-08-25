import { renderHooks } from './hooks';
import { updateNode } from './utils';
import { reconcileChildren } from './ReactChildFiber';

export function updateFunctionComponent(wip) {
	renderHooks(wip);
	const { type, props } = wip;
	const children = type(props);
	reconcileChildren(wip, children);
}
export function updateHostComponent(wip) {
	if (!wip.stateNode) {
		wip.stateNode = document.createElement(wip.type);
		// 更新属性
		updateNode(wip.stateNode, {}, wip.props);
	}

	reconcileChildren(wip, wip.props.children);
}

export function updateFragmentComponent(wip) {
	reconcileChildren(wip, wip.props.children);
}
