import {
	updateClassComponent,
	updateFragmentComponent,
	updateFunctionComponent,
	updateHostComponent,
} from './ReactFiberReconciler';
import { scheduleCallback, shouldYield } from './scheduler';
import { isFn, isStringOrNumber, Placement, Update, updateNode } from './utils';

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
		// console.log('nextUnitOfWork :>> ', JSON.stringify(nextUnitOfWork, null, 2));
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
	// 提交自己
	const { flags, stateNode } = fiber;

	// let parentNode = fiber.return.stateNode;
	// 有的 fiber父级没有 dom, 需要循环向上查找
	let parentNode = getParentNode(fiber);
	// 插入
	if (flags & Placement && stateNode) {
		parentNode.appendChild(stateNode);
	}
	// 更新
	if (flags & Update && stateNode) {
		updateNode(stateNode, fiber.alternate.props, fiber.props);
	}
	// 提交孩子
	commitWorker(fiber.child);
	// 提交兄弟
	commitWorker(fiber.sibling);
}
