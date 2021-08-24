import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop';
import { isFn } from './utils';

let currentlyRenderingFiber = null;

let workInProcessHook = null;

export function renderHooks(fiber) {
	currentlyRenderingFiber = fiber;
	currentlyRenderingFiber.memoizedState = null;
	workInProcessHook = null;
}

function updateWorkInProcessHook() {
	let hook = null;
	let current = currentlyRenderingFiber.alternate;

	if (current) {
		// 更新阶段
		currentlyRenderingFiber.memoizedState = current.memoizedState;
		if (workInProcessHook) {
			// 不是第 0 个 hook
			hook = workInProcessHook = workInProcessHook.next;
		} else {
			// 是第 0 个 hook
			hook = workInProcessHook = current.memoizedState;
		}
	} else {
		// 初次渲染
		hook = {
			memoizedState: null,
			next: null, // 下一个hook
		};

		if (workInProcessHook) {
			// 不是第 0 个
			workInProcessHook = workInProcessHook.next = hook;
		} else {
			// 第 0 个 hook
			workInProcessHook = currentlyRenderingFiber.memoizedState = hook;
		}
	}
	return hook;
}

export function useReducer(reducer, initialState) {
	const hook = updateWorkInProcessHook();

	if (!currentlyRenderingFiber.alternate) {
		hook.memoizedState = initialState;
	}

	const dispatch = (action) => {
		// memoizedState
		hook.memoizedState = reducer
			? reducer(hook.memoizedState, action)
			: isFn(action)
			? action(hook.memoizedState)
			: action;
		scheduleUpdateOnFiber(currentlyRenderingFiber);
	};
	return [hook.memoizedState, dispatch];
}

export function useState(initialState) {
	return useReducer(null, initialState);
}
