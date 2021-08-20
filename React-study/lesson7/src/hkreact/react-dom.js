import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop';

function render(vnode, container) {
	console.log('vnode :>> ', vnode); // hk-log

	const fiberRoot = {
		type: container.nodeName.toLocaleLowerCase(),
		stateNode: container,
		props: { children: vnode },
	};
    console.log('fiberRoot :>> ', fiberRoot); // hk-log

    scheduleUpdateOnFiber(fiberRoot)
}

export default { render };
