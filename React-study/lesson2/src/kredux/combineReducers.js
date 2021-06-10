export default function combineReducers(reducers) {
  return function combination(state = {}, action) {
    console.log("action :>> ", action);
    let nextState = {};
    let hasChanged = false;

    for (const key in reducers) {
      if (Object.hasOwnProperty.call(reducers, key)) {
        const reducer = reducers[key];
        nextState[key] = reducer(state[key], action);
        hasChanged = hasChanged || nextState[key] !== state[key];
      }
    }
    hasChanged =
      hasChanged || Object.keys(nextState).length !== Object.keys(state);
    return hasChanged ? nextState : state;
  };
}
