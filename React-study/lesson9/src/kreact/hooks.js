import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop';
import {
	areHookInputsEqual,
	Passive as HookPassive,
	Layout as HookLayout,
} from './utils';

// 正在工作的 fiber
let currentlyRenderingFiber = null;

let workInProgressHook = null;

let currentHook = null;

export function renderHooks(fiber) {
	currentlyRenderingFiber = fiber;
	currentlyRenderingFiber.memoizedState = null; // hook0
	currentlyRenderingFiber.updateQueueOfEffect = [];
	currentlyRenderingFiber.updateQueueOfLayout = [];
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
			currentHook = currentHook.next;
		} else {
			// 第 0 个 hook
			hook = workInProgressHook = current.memoizedState;
			currentHook = current.memoizedState;
		}
	} else {
		// 初次渲染
		hook = { memoizedState: null, next: null };
		currentHook = null;

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

export function useEffect(create, deps) {
	return updateEffectIml(HookPassive, create, deps);
}

export function useLayoutEffect(create, deps) {
	return updateEffectIml(HookLayout, create, deps);
}

export function updateEffectIml(hookFlag, create, deps) {
	let hook = updateWorkInProgressHook();

	const effect = { create, deps };

	if (currentHook) {
		const prevEffect = currentHook.memoizedState;
		if (deps) {
			const prevDeps = prevEffect.deps;
			if (areHookInputsEqual(deps, prevDeps)) {
				return;
			}
		}
	}

	hook.memoizedState = effect;
	if (hookFlag & HookPassive) {
		currentlyRenderingFiber.updateQueueOfEffect.push(effect);
	} else if (hookFlag & HookLayout) {
		currentlyRenderingFiber.updateQueueOfLayout.push(effect);
	}
}
