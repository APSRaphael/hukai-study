// import { put, call,take, takeEvery, fork } from 'redux-saga/effects';
import { put, call, fork, take } from '../k-redux-saga/effects';
import LoginService from '../service/login';
import { LOGIN_FAILURE, LOGIN_SAGA, LOGIN_SUCCESS, REQUEST } from './const';

// worker saga
function* loginHandle(action) {
	yield put({ type: REQUEST });
	try {
		let res1 = yield call(LoginService.login, action.payload);
		let res2 = yield call(LoginService.getMoreUserInfo, res1);
		yield put({ type: LOGIN_SUCCESS, payload: res2 });
	} catch (error) {
		yield put({ type: LOGIN_FAILURE, payload: error });
	}
}

// watcher saga

function* loginSaga() {
	// yield takeEvery(LOGIN_SAGA, loginHandle);
	while (true) {
		// call 是阻塞
		// fork 是非阻塞
		const action = yield take(LOGIN_SAGA);
		yield call(loginHandle, action);
		// yield fork(loginHandle, action);
		console.log('actio11111n :>> ', 111111);
	}
}

// const takeEvery = (pattern, saga, ...args) =>
// 	fork(function* () {
// 		while (true) {
// 			const action = yield take(pattern);
// 			yield fork(saga, ...args.concat(action));
// 		}
// 	});

export default loginSaga;
