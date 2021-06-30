import { createFiber } from './createFiber';
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

// 协调子节点 核心就是 diff
export function reconcileChildren(returnFiber, children) {
	if (isStringOrNumber(children)) {
		return;
	}

	const shouldTrackSideEffects = !!returnFiber.alternate;

	const newChildren = Array.isArray(children) ? children : [children];
	let previousNewFiber = null;

	let oldFiber = returnFiber.alternate && returnFiber.alternate.child;

	let nextOldFiber = null;

	let newIndex = 0;

	let lastPlacedIndex = 0;

	// 1 找到第一个能复用的节点，只要相对位置没有发生变化，就继续往后复用，否则跳出循环
	for (; oldFiber && newIndex < newChildren.length; newIndex++) {
		const newChild = newChildren[newIndex];
		if (newChild == null) {
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
	// 2

	if (newChildren.length <= newIndex) {
		deleteRemainingChildren(returnFiber, oldFiber);
		return;
	}

	// 3 oldFiber没了，但是 newChildren还有
	if (!oldFiber) {
		for (; newIndex < newChildren.length; newIndex++) {
			const newChild = newChildren[newIndex];
			if (newChild == null) {
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

	// 4
	const existingChildren = mapRemainingChildren(oldFiber);
	for (; newIndex < newChildren.length; newIndex++) {
		const newChild = newChildren[newIndex];
		if (newChild == null) {
			continue;
		}
		const newFiber = createFiber(newChild, returnFiber);

		lastPlacedIndex = placeChild(
			newFiber,
			lastPlacedIndex,
			newIndex,
			shouldTrackSideEffects
		);

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

	// for (let i = 0; i < newChildren.length; i++) {
	// 	const newChild = newChildren[i];
	// 	if (newChild == null) {
	// 		continue;
	// 	}
	// 	const newFiber = createFiber(newChild, returnFiber);

	// 	const same = sameNode(oldFiber, newFiber);

	// 	if (same) {
	// 		Object.assign(newFiber, {
	// 			alternate: oldFiber,
	// 			stateNode: oldFiber.stateNode,
	// 			flags: Update,
	// 		});
	// 	}

	// 	if (!same && oldFiber) {
	// 		deleteChild(returnFiber, oldFiber);
	// 	}

	// 	if (oldFiber) {
	// 		oldFiber = oldFiber.sibling;
	// 	}

	// 	if (previousNewFiber === null) {
	// 		returnFiber.child = newFiber;
	// 	} else {
	// 		previousNewFiber.sibling = newFiber;
	// 	}

	// 	previousNewFiber = newFiber;
	// }

	if (shouldTrackSideEffects) {
		existingChildren.forEach((child) => deleteChild(returnFiber, child));
	}
}

function sameNode(a, b) {
	return !!(a && b && a.key === b.key && a.type === b.type);
}
