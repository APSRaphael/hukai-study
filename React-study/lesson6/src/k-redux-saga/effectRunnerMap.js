import effectTypes from './effectTypes';
import proc from './proc';
import { promise, iterator } from './is';

function runTakeEffect(env, { channel = env.channel, pattern }, cb) {
	// 源码中支持外界直接传入 channel，没有传则使用默认
	const matcher = (input) => input.type === pattern;
	console.log('runTakeEffect :>> ', runTakeEffect); // hk-log
	channel.take(cb, matcher);
}

function runPutEffect(env, { action }, cb) {
	console.log('runPutEffect :>> ', runPutEffect); // hk-log
	const { dispatch } = env;
	const result = dispatch(action);
	cb(result);
}

function runCallEffect(env, { fn, args }, cb) {
	console.log('runCallEffect :>> ', runCallEffect); // hk-log
	const result = fn.apply(null, args);
	if (promise(result)) {
		result
			.then((data) => cb(data))
			.catch((err) => {
				cb(err, true);
			});
		return;
	}
	if (iterator(result)) {
		proc(env, result, cb);
		return;
	}
	cb(result);
}

function runForkEffect(env, { fn, args }, cb) {
	console.log('runForkEffect :>> ', runForkEffect); // hk-log
	const taskInterator = fn.apply(null, args);
	proc(env, taskInterator);
	cb();
}

function runAllEffect(env, effects, cb) {
	console.log('runAllEffect :>> ', runAllEffect); // hk-log
	const len = effects.length;
	for (let i = 0; i < len; i++) {
		proc(env, effects[i]);
	}
}

const effectRunnerMap = {
	[effectTypes.TAKE]: runTakeEffect,
	[effectTypes.PUT]: runPutEffect,
	[effectTypes.CALL]: runCallEffect,
	[effectTypes.FORK]: runForkEffect,
	[effectTypes.ALL]: runAllEffect,
};

export default effectRunnerMap;
