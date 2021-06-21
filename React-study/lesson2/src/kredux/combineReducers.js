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

    // 可能存在动态 reducer 的情况，所以这里多一个判断 列如{a:1, b:2} {a:1}这个情况是判断不出来新的 reducer 多了 b:2 属性的
    hasChanged =
      hasChanged || Object.keys(nextState).length !== Object.keys(state);
    return hasChanged ? nextState : state;
  };
}
