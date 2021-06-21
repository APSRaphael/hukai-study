// import { createStore, applyMiddleware, combineReducers } from "redux";
import { createStore, applyMiddleware, combineReducers } from "../kredux/index";
// import thunk from "redux-thunk";
// import logger from "redux-logger";
// import promise from "redux-promise";
import isPromise from "is-promise";
import { isFSA } from "flux-standard-action";

export const counterReducer = (state = 0, { type, payload }) => {
  switch (type) {
    case "ADD":
      return state + payload;
    case "MINUS":
      return state - payload || 1;
    default:
      return state;
  }
};
export const counterReducer2 = (state = { num: 1 }, action) => {
  switch (action.type) {
    case "ADD2":
      return { ...state, num: state.num + action.payload };
    default:
      return state;
  }
};

const store = createStore(
  combineReducers({ count: counterReducer, count2: counterReducer2 }),
  applyMiddleware(thunk, promise, logger)
);

export default store;

function thunk({ getState, dispatch }) {
  return (next) => (action) => {
    if (typeof action === "function") {
      return action(dispatch, getState);
    } else {
      return next(action);
    }
  };
}

function logger({ getState, dispatch }) {
  return (next) => (action) => {
    const res = next(action);

    return res;
  };
}

function promise({ dispatch }) {
  return (next) => (action) => {
    if (!isFSA(action)) {
      return isPromise(action) ? action.then(dispatch) : next(action);
    }
    return isPromise(action.payload)
      ? action.payload
          .then((result) => dispatch({ ...action, payload: result }))
          .catch((error) => {
            dispatch({ ...action, payload: error, error: true });
            return Promise.reject(error);
          })
      : next(action);
  };
}
