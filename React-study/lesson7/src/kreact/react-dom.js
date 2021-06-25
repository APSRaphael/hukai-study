import { scheduleUpdateOnFiber } from './ReactWorkLoop';

function render(vnode, container) {
console.log('vnode :>> ', vnode);
	const fiberRoot = {
		type: container.nodeName.toLocaleLowerCase(),
		stateNode: container,
		props: { children: vnode },
	};

	scheduleUpdateOnFiber(fiberRoot);
}

export default { render };
