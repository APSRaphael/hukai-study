import {
	updateFragmentComponent,
	updateFunctionComponent,
	updateHostComponent,
} from './ReactFiberReconciler';
import { isFn, isStr } from './utils';

// work in progress
let wipRoot = null;

let nextUnitOfWork = null;

// 处理更新
export function scheduleUpdateOnFiber(fiber) {
	wipRoot = fiber;
	wipRoot.sibling = null;
	nextUnitOfWork = wipRoot;
}

// 协调

function performUnitOfWork(wip) {
	// 更新自己
	const { type } = wip;
	if (isFn(type)) {
		console.log('type :>> ', type); // hk-log
		updateFunctionComponent(wip);
	} else if (isStr(type)) {
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

function workLoop(IdleDeadline) {
	// console.log('222222 :>> ', 222222); // hk-log
	while (nextUnitOfWork && IdleDeadline.timeRemaining() > 0) {
		// console.log('nextUnitOfWork :>> ', nextUnitOfWork); // hk-log
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
	}
	if (!nextUnitOfWork && wipRoot) {
		commitRoot();
	}
}

requestIdleCallback(workLoop);
// 提交

function commitRoot() {
	console.log('3333 :>> ', 3333); // hk-log
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

	const { stateNode } = fiber;

	let parentNode = getParentNode(fiber);

	if (stateNode) {
		parentNode.appendChild(stateNode);
	}

	// 提交自己
	// 提交孩子
	commitWorker(fiber.child);
	// 提交下一个兄弟

	commitWorker(fiber.sibling);
}
