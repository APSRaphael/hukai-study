import { useRef, useEffect, useState, useMemo } from "react";

// export function throttle(fn: Function, interval: number = 300) {
// 	let lock = false;
// 	let I;
// 	let start: number;

// 	return (...args: Array<any>) => {
// 		if (start === undefined) {
// 			start = new Date().getTime();
// 		}
// 		if (lock) {
// 			return;
// 		}
// 		lock = true;
// 		fn(...args);

// 		const ellapsed = new Date().getTime() - start;

// 		I = setTimeout(() => {
// 			lock = false;
// 		}, interval - (ellapsed % interval));
// 	};
// }

export function throttle(fn: Function, interval: number = 300) {
	let lock = false;
	let I;
	let start: number;
	return (...args: any[]) => {
		if (start === undefined) {
			start = new Date().getTime();
		}
		if (lock) {
			return;
		}
		lock = true;
		fn(...args);
		const ellapsed = new Date().getTime() - start;
		I = setTimeout(() => {
			lock = false;
		}, interval - (ellapsed & interval));
	};
}

function useThrottledState<T>(
	initialState: T,
	interval = 16
): [T, (val: T | (() => T)) => void] {
	const state = useRef<T>(initialState);
	const [, setVer] = useState(0);

	const setState = useMemo(() => {
		const fn = (val: T | (() => T)) => {
			if (isFunction(val)) {
				val = val();
			}
			state.current = val;
			setVer((x) => x + 1);
		};
		return throttle(fn, interval);
	}, []);

	return [state.current, setState];
}

const useBuz = () => {
	const obj = useMemo(() => new SomeBuzObject(), []);

	const [, setV] = useState(0);

	useEffect(() => {
		obj.onListChanged(() => {
			setV((x) => x + 1);
		});
	}, []);

	return obj;
};

async function request(path, page) {
	const resp = await fetch(path + "?" + qs.stringify({ page }));
	const data = await resp.json();
	return data;
}

function usePaging(path) {
	const [page, setPage] = useState(0);
	const [list, setList] = useState([]);

	useEffect(() => {
		request(path, page).then((res) => {
			setList(res.data.list);
		});
	}, [page]);

	return {
		list,
		next: () => setPage((x) => x + 1),
		prev: () => setPage((x) => Math.max(0, x - 1)),
	};
}

const SomeComponent = () => {
	const { list, next, prev } = usePaging("path");
};
