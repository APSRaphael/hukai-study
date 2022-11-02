import { stdChannel } from './channel';
import runSaga from './runSaga';

export default function createSagaMiddleware() {
	let boundRunSage;
	let channel = stdChannel();
	function sagaMiddleware({ getState, dispatch }) {
		console.log(222, 'sagaMiddleware.next :>> ', boundRunSage); // hk-log

		boundRunSage = runSaga.bind(null, { channel, getState, dispatch });
		return (next) => (action) => {
			let result = next(action);
			channel.put(action);
			return result;
		};
	}
	sagaMiddleware.run = (...args) => {
		console.log('...sagaMiddleware.run :>> ', ...args); // hk-log
		return boundRunSage(...args);
	};

	return sagaMiddleware;
}
