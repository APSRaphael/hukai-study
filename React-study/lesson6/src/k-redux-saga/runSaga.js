import proc from './proc';
export default function runSaga(
	{ channel, dispatch, getState },
	saga,
	...args
) {
	// 这里的 saga 就是 action/loginSaga.js, 目前的 loginSaga 并不接受任何参数，所以下面的...args 不传也可
	console.log('...runSaga :>> ', ...args); // hk-log
	const iterator = saga(...args);
	const env = { channel, dispatch, getState };
	proc(env, iterator);
}
