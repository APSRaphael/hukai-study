// import { all } from 'redux-saga/effects';
import { all } from '../k-redux-saga/effects';
import loginSaga from './loginSaga';
export default function* rootSaga() {
	yield all([loginSaga()]); // 数组，接收多个 saga
}
