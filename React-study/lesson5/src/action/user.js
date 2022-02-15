import LoginService from '../service/login';
import { LOGIN_FAILURE, LOGIN_SAGA, LOGIN_SUCCESS, REQUEST } from './const';
// export const login = (userInfo) => ({ type: LOGIN_SUCCESS, payload: userInfo });

// 方案一 redux-thunk
// export const login = (userInfo) => (dispatch) => {
// 	dispatch({ type: REQUEST });
// 	LoginService.login(userInfo).then(
// 		(res) => {
// 			// dispatch({ type: LOGIN_SUCCESS, payload: res });
// 			getMoreUserInfo(dispatch, res);
// 		},
// 		(err) => {
// 			dispatch({ type: LOGIN_FAILURE, payload: err });
// 		}
// 	);
// };

// export const   = (dispatch, userInfo) => {
// 	LoginService.getMoreUserInfo(userInfo).then(
// 		(res) => {
// 			dispatch({ type: LOGIN_SUCCESS, payload: res });
// 		},
// 		(err) => {
// 			dispatch({ type: LOGIN_FAILURE, payload: err });
// 		}
// 	);
// };

// 方案二 async await
// export function login(userInfo){
// 	return async function(dispatch){
// 		dispatch({type:REQUEST})

// 		let res1 = await loginPromise(dispatch, userInfo)

// 		if(res1){
// 			getMoreUserInfo(dispatch, res1)
// 		}
// 	}
// }

// 方案三 redux-saga

export const login = (userInfo) => ({ type: LOGIN_SAGA, payload: userInfo });
