import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop';

// 正在工作的 fiber
let currentlyRenderingFiber = null;

let workInProgressHook = null;

export function renderHooks(fiber) {
	currentlyRenderingFiber = fiber;
	currentlyRenderingFiber.memoizedState = null; // hook0
	workInProgressHook = null;
}

function updateWorkInProgressHook() {
	let hook = null;

	let current = currentlyRenderingFiber.alternate;

	if (current) {
		// 更新
		currentlyRenderingFiber.memoizedState = current.memoizedState;
		if (workInProgressHook) {
			hook = workInProgressHook = workInProgressHook.next;
		} else {
			// 第 0 个 hook
			hook = workInProgressHook = current.memoizedState;
			// console.log('workInProgressHook :>> ', workInProgressHook);
		}
	} else {
		// 初次渲染
		hook = { memoizedState: null, next: null };

		if (workInProgressHook) {
			// 不是第 0 个 hook
			workInProgressHook = workInProgressHook.next = hook;
		} else {
			// 第 0 个 hook
			workInProgressHook = currentlyRenderingFiber.memoizedState = hook;
		}
	}

	return hook;
}

export function useState(initialState) {
	return useReducer(null, initialState);
}

export function useReducer(reducer, initialState) {
	const hook = updateWorkInProgressHook();
	if (!currentlyRenderingFiber.alternate) {
		hook.memoizedState = initialState;
	}
	const dispatch = (action) => {
		hook.memoizedState = reducer ? reducer(hook.memoizedState, action) : action;
		scheduleUpdateOnFiber(currentlyRenderingFiber);
	};
	return [hook.memoizedState, dispatch];
}
