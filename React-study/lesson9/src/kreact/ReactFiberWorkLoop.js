import {
	updateClassComponent,
	updateFragmentComponent,
	updateFunctionComponent,
	updateHostComponent,
} from './ReactFiberReconciler';
import { scheduleCallback, shouldYield } from './scheduler';
import {
	Deletion,
	isFn,
	isStringOrNumber,
	Placement,
	Update,
	updateNode,
} from './utils';

// work in progress  wip
let wipRoot = null;
let nextUnitOfWork = null;

// 处理更新
export function scheduleUpdateOnFiber(fiber) {
	fiber.alternate = { ...fiber };
	wipRoot = fiber;
	wipRoot.sibling = null;

	nextUnitOfWork = wipRoot;

	scheduleCallback(workLoop);
}

// 协调

function performUnitOfWork(wip) {
	// 1.更新自己

	const { type } = wip;

	if (isFn(type)) {
		// 函数组件 类组件
		type.prototype.isReactComponent
			? updateClassComponent(wip)
			: updateFunctionComponent(wip);
	} else if (isStringOrNumber(type)) {
		// 原生标签
		updateHostComponent(wip);
	} else {
		// fragment
		updateFragmentComponent(wip);
	}

	// 2.返回下一个要更新的 fiber

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
	while (nextUnitOfWork && !shouldYield()) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
	}
	// 不存在下一个要更新的节点
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
		scheduleCallback(() => {
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
	// 提交自己
	const { type, flags, stateNode } = fiber;

	if (isFn(type) && !type.prototype.isReactComponent) {
		invokeHooks(fiber);
	}

	// let parentNode = fiber.return.stateNode;
	// 有的 fiber父级没有 dom, 需要循环向上查找
	let parentNode = getParentNode(fiber);
	// 插入
	if (flags & Placement && stateNode) {
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
	// 提交兄弟
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
		const deletion = deletions[i];
		parentNode.removeChild(getStateNode(deletion));
	}
}

function getStateNode(fiber) {
	let tem = fiber;
	while (!tem.stateNode) {
		tem = tem.child;
	}
	return tem.stateNode;
}
