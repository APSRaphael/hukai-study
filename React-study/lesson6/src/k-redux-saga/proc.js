import effectRunnerMap from './effectRunnerMap';
import { IO } from './symbols';

export default function proc(env, iterator, cb) {
	function runEffect(effect, currCb) {
		console.log('effect :>> ', effect); // hk-log
		console.log('IO :>> ', IO); // hk-log
		if (effect && effect[IO]) {
			const effectRunner = effectRunnerMap[effect.type];
console.log('env :>> ', env); // hk-log
console.log('effect.payload :>> ', effect.payload); // hk-log
			effectRunner(env, effect.payload, currCb);
		} else {
			currCb();
		}
	}

	function digestEffect(effect, cb) {
		let effectSettled;
		function currCb(res, isErr) {
			if (effectSettled) {
				return;
			}
			effectSettled = true;
			cb(res, isErr);
		}

		runEffect(effect, currCb);
	}

	function next(arg, isErr) {
		let result;
		if (isErr) {
			result = iterator.throw(arg);
		} else {
			result = iterator.next(arg);
			console.log('result :>> ', result); // hk-log
		}
		if (!result.done) {
			digestEffect(result.value, next);
		} else {
			if (typeof cb === 'function') {
				cb(result.value);
			}
		}
		// result {value:value, done: false/true}
	}

	next();
}
