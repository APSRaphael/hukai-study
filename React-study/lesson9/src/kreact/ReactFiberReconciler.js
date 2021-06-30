import { renderHooks } from './hooks';
import { updateNode } from './utils';
import { reconcileChildren } from './ReactChildFiber';

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

