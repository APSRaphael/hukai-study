import { stdChannel } from './channel';
import runSaga from './runSaga';

export default function createSagaMiddleware() {
	let boundRunSage;
	let channel = stdChannel();
	function sagaMiddleware({ getState, dispatch }) {
		boundRunSage = runSaga.bind(null, { channel, getState, dispatch });
		return (next) => (action) => {
			let result = next(action);
			channel.put(action);
			return result;
		};
	}
	sagaMiddleware.run = (...args) => {
        return boundRunSage(...args)
    };
	return sagaMiddleware;
}
