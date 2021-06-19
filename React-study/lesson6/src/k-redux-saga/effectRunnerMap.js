import effectTypes from './effectTypes';
import proc from './proc';
import { promise, iterator } from './is';

function runTakeEffect(env, { channel = env.channel, pattern }, cb) {
	const matcher = (input) => input.type === pattern;
	channel.take(cb, matcher);
}

function runPutEffect(env, { action }, cb) {
	const { dispatch } = env;
	const result = dispatch(action);
	cb(result);
}

function runCallEffect(env, { fn, args }, cb) {
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
	}
	cb(result);
}

function runForkEffect(env, { fn, args }, cb) {
	const taskInterator = fn.apply(null, args);
	proc(env, taskInterator);
	cb();
}
function runAllEffect(env, effects, cb) {
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
