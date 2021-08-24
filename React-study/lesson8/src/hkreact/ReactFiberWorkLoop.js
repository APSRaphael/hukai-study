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
	fiber.alternate= {...fiber}
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
	commitWorker(wipRoot.child);
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

	const { flags, stateNode } = fiber;

	let parentNode = getParentNode(fiber);
	// 插入
	if (flags & Placement && stateNode) {
		parentNode.appendChild(stateNode);
	}
	// 更新
	if (flags & Update && stateNode) {
		updateNode(stateNode, fiber.alternate.props, fiber.props);
	}
	// 提交自己
	// 提交孩子
	commitWorker(fiber.child);
	// 提交下一个兄弟

	commitWorker(fiber.sibling);
}
