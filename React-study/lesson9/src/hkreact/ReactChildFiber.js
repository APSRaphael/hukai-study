import { createFiber } from './fiber';
import { Deletion, isStringOrNumber, Placement, Update } from './utils';

function deleteChild(returnFiber, childToDelete) {
	childToDelete.flags = Deletion;
	if (returnFiber.deletions) {
		returnFiber.deletions.push(childToDelete);
	} else {
		returnFiber.deletions = [childToDelete];
	}
}

function deleteRemainingChildren(returnFiber, currentFirstChild) {
	let childToDelete = currentFirstChild;
	while (childToDelete) {
		deleteChild(returnFiber, childToDelete);
		childToDelete = childToDelete.sibling;
	}
}

function placeChild(
	newFiber,
	lastPlacedIndex,
	newIndex,
	shouldTrackSideEffects
) {
	newFiber.index = newIndex;

	if (!shouldTrackSideEffects) {
		return lastPlacedIndex;
	}

	const current = newFiber.alternate;

	if (current) {
		const oldIndex = current.index;

		if (oldIndex < lastPlacedIndex) {
			// move
			newFiber.flags = Placement;
			return lastPlacedIndex;
		} else {
			return oldIndex;
		}
	} else {
		newFiber.flags = Placement;
		return lastPlacedIndex;
	}
}

function mapRemainingChildren(currentFirstChild) {
	const existingChildren = new Map();
	let existingChild = currentFirstChild;
	while (existingChild) {
		existingChildren.set(
			existingChild.key || existingChild.index,
			existingChild
		);
		existingChild = existingChild.sibling;
	}
	return existingChildren;
}

export function reconcileChildren(returnFiber, children) {
	if (isStringOrNumber(children)) {
		return;
	}

	const shouldTrackSideEffects = !!returnFiber.alternate;
	const newChildren = Array.isArray(children) ? children : [children];
	let previousNewFiber = null;

	let oldFiber = returnFiber.alternate && returnFiber.alternate.child;
	// 记录下一个 oldFiber
	let nextOldFiber = null;
	let newIndex = 0;
	// 记录上次插入位置
	let lastPlacedIndex = 0;
	// *1 找第一个能复用的节点，并往后，只要相对位置没有变化，继续往后复用，否则跳出循环
	for (; oldFiber && newIndex < newChildren.length; newIndex++) {
		const newChild = newChildren[newIndex];
		if (newChild === null) {
			continue;
		}
		if (oldFiber.index > newIndex) {
			nextOldFiber = oldFiber;
			oldFiber = null;
		} else {
			nextOldFiber = oldFiber.sibling;
		}

		const same = sameNode(newChild, oldFiber);

		if (!same) {
			if (oldFiber === null) {
				oldFiber = nextOldFiber;
			}
			break;
		}

		const newFiber = createFiber(newChild, returnFiber);
		Object.assign(newFiber, {
			alternate: oldFiber,
			stateNode: oldFiber.stateNode,
			flags: Update,
		});

		lastPlacedIndex = placeChild(
			newFiber,
			lastPlacedIndex,
			newIndex,
			shouldTrackSideEffects
		);

		if (previousNewFiber === null) {
			returnFiber.child = newFiber;
		} else {
			previousNewFiber.sibling = newFiber;
		}
		previousNewFiber = newFiber;
		oldFiber = nextOldFiber;
	}

	// *2
	// 1 2 3 4 5 old
	// 1 2 new
	if (newChildren.length <= newIndex) {
		deleteRemainingChildren(returnFiber, oldFiber);
		return;
	}
	// *3 oldFiber没了 但是 newChildren 还有
	// 1 2 old
	// 1 2 3 4 new
	if (!oldFiber) {
		for (; newIndex < newChildren.length; newIndex++) {
			const newChild = newChildren[newIndex];

			if (newChild === null) {
				continue;
			}
			const newFiber = createFiber(newChild, returnFiber);

			lastPlacedIndex = placeChild(
				newFiber,
				lastPlacedIndex,
				newIndex,
				shouldTrackSideEffects
			);

			if (previousNewFiber === null) {
				returnFiber.child = newFiber;
			} else {
				previousNewFiber.sibling = newFiber;
			}
			previousNewFiber = newFiber;
		}
		return;
	}

	// *4
	// 1234 old
	// 1538 new
	// 234 -> map

	const existingChildren = mapRemainingChildren(oldFiber);

	for (; newIndex < newChildren.length; newIndex++) {
		const newChild = newChildren[newIndex];
		if (newChild === null) {
			continue;
		}
		const newFiber = createFiber(newChild, returnFiber);
		lastPlacedIndex = placeChild(
			newFiber,
			lastPlacedIndex,
			newIndex,
			shouldTrackSideEffects
		);

		// 从老链表上找能复用的节点
		let matchedFiber = existingChildren.get(newFiber.key || newFiber.index);
		if (matchedFiber) {
			existingChildren.delete(newFiber.key || newFiber.index);

			Object.assign(newFiber, {
				alternate: matchedFiber,
				stateNode: matchedFiber.stateNode,
				flags: Update,
			});
		}

		if (previousNewFiber === null) {
			returnFiber.child = newFiber;
		} else {
			previousNewFiber.sibling = newFiber;
		}

		previousNewFiber = newFiber;
	}

	if (shouldTrackSideEffects) {
		existingChildren.forEach((child) => deleteChild(returnFiber, child));
	}
}

// 判断是否同一节点，只在同一层级下比较
function sameNode(a, b) {
	return !!(a && b && a.key === b.key && a.type === b.type);
}
