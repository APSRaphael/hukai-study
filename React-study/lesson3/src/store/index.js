import { createStore, applyMiddleware, combineReducers } from "redux";
// import { createStore, applyMiddleware, combineReducers } from "../kredux/index";
// import thunk from "redux-thunk";
// import logger from "redux-logger";
// import promise from "redux-promise";
// import isPromise from "is-promise";
// import { isFSA } from "flux-standard-action";

export const counterReducer = (state = 0, { type, payload }) => {
  switch (type) {
    case "ADD":
      return state + (payload || 1);
    case "MINUS":
      return state - (payload || 1);
    default:
      return state;
  }
};
export const counterReducer2 = (state = 0, { type, payload }) => {
  switch (type) {
    case "ADD1":
      return state + (payload || 1);
    case "MINUS1":
      return state - (payload || 1);
    default:
      return state;
  }
};

const store = createStore(
  combineReducers({ count: counterReducer ,counterReducer2}),
);

export default store;
