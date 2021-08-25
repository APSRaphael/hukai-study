import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop';
import {
	areHookInputsEqual,
	isFn,
	Passive as HookPassive,
	Layout as HookLayout,
} from './utils';

let currentlyRenderingFiber = null;

let workInProcessHook = null;

let currentHook = null;

export function renderHooks(fiber) {
	currentlyRenderingFiber = fiber;
	currentlyRenderingFiber.memoizedState = null;
	currentlyRenderingFiber.updateQueueOfLayout = [];
	currentlyRenderingFiber.updateQueueOfEffect = [];
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
			currentHook = currentHook.next;
		} else {
			// 是第 0 个 hook
			hook = workInProcessHook = current.memoizedState;
			currentHook = current.memoizedState;
		}
	} else {
		// 初次渲染
		currentHook = null;
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

export function useEffect(create, deps) {
	return updateEffectIml(HookPassive, create, deps);
}

export function useLayoutEffect(create, deps) {
	return updateEffectIml(HookLayout, create, deps);
}
export function updateEffectIml(hookFlag, create, deps) {
	const hook = updateWorkInProcessHook();

	const effect = { hookFlag, create, deps };

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
