export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer) => {
    const store = createStore(reducer);
    let { getState, dispatch } = store;
    // to super dispatch

    const midApi = {
      getState,
      dispatch: (action, ...args) => dispatch(action, ...args),
    };

    debugger;
    // 这里 middleware 就都能访问 store
    const middlewaresChain = middlewares.map((middleware) =>
      middleware(midApi)
    );
    dispatch = compose(...middlewaresChain)(dispatch);
    return { ...store, dispatch };
  };
}

function compose(...funcs) {
  if (funcs.length === 0) return (arg) => arg;

  if (funcs.length === 1) return funcs[0];

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}

function compose(...funcs) {
  if (funcs.length === 0) return (arg) => arg;
  if (funcs.length === 1) return funcs[0];

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}
