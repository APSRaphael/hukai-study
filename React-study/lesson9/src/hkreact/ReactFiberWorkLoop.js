import {
	updateFragmentComponent,
	updateFunctionComponent,
	updateHostComponent,
} from './ReactFiberReconciler';
import { scheduledCallback } from './scheduler';
import { isFn, isStringOrNumber, Placement, Update, updateNode } from './utils';

// work in progress
let wipRoot = null;

let nextUnitOfWork = null;

// 处理更新
export function scheduleUpdateOnFiber(fiber) {
	fiber.alternate = { ...fiber };
	wipRoot = fiber;
	wipRoot.sibling = null;

	nextUnitOfWork = wipRoot;

	scheduledCallback(workLoop);
}

// 协调

function performUnitOfWork(wip) {
	// 更新自己
	const { type } = wip;

	if (isFn(type)) {
		updateFunctionComponent(wip);
	} else if (isStringOrNumber(type)) {
		updateHostComponent(wip);
	} else {
		updateFragmentComponent(wip);
	}

	if (wip.child) {
		return wip.child;
	}

	let next = wip;
	while (next) {
		if (next.sibling) {
			return next.sibling;
		}
		next = next.return;
	}

	return null;
}

function workLoop() {
	while (nextUnitOfWork) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
	}
	if (!nextUnitOfWork && wipRoot) {
		commitRoot();
	}
}

// requestIdleCallback(workLoop);
// 提交

function commitRoot() {
	isFn(wipRoot.type) ? commitWorker(wipRoot) : commitWorker(wipRoot.child);
}

function invokeHooks(wip) {
	const { updateQueueOfLayout, updateQueueOfEffect } = wip;
	for (let i = 0; i < updateQueueOfLayout.length; i++) {
		const effect = updateQueueOfLayout[i];
		effect.create();
	}

	for (let i = 0; i < updateQueueOfEffect.length; i++) {
		const effect = updateQueueOfEffect[i];
		scheduledCallback(() => {
			effect.create();
		});
	}
}

// 找父 dom 节点
function getParentNode(fiber) {
	let next = fiber.return;
	while (!next.stateNode) {
		next = next.return;
	}
	return next.stateNode;
}

function commitWorker(fiber) {
	if (!fiber) {
		return;
	}

	const { type, flags, stateNode } = fiber;

	if (isFn(type)) {
		invokeHooks(fiber);
	}
	// 提交自己

	let parentNode = getParentNode(fiber);
	// 插入
	if (flags & Placement && stateNode) {
		// parentNode.appendChild(stateNode);
		// 有下一个节点就插到前面
		let hasSiblingNode = foundSiblingNode(fiber, parentNode);
		if (hasSiblingNode) {
			parentNode.insertBefore(stateNode, hasSiblingNode);
		} else {
			parentNode.appendChild(stateNode);
		}
	}
	// 更新
	if (flags & Update && stateNode) {
		updateNode(stateNode, fiber.alternate.props, fiber.props);
	}

	// 删除
	if (fiber.deletions) {
		commitDeletions(fiber.deletions, fiber.stateNode || parentNode);
	}
	// 提交孩子
	commitWorker(fiber.child);
	// 提交下一个兄弟

	commitWorker(fiber.sibling);
}

function foundSiblingNode(fiber, parentNode) {
	let siblingHasNode = fiber.sibling;
	let node = null;
	while (siblingHasNode) {
		node = siblingHasNode.stateNode;
		if (node && parentNode.contains(node)) {
			return node;
		}
		siblingHasNode = siblingHasNode.sibling;
	}

	return null;
}

function commitDeletions(deletions, parentNode) {
	for (let i = 0; i < deletions.length; i++) {
		const del = deletions[i];
		parentNode.removeChild(getStateNode(del));
	}
}

// 找 fiber 的子Dom 节点
function getStateNode(fiber) {
	let tem = fiber;
	while (!tem.stateNode) {
		tem = tem.child;
	}

	return tem.stateNode;
}
