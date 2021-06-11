import React, {
  useState,
  useLayoutEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";

const Context = React.createContext();

export function Provider({ store, children }) {
  return <Context.Provider value={store}>{children}</Context.Provider>;
}

// export const connect =
//   (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => (props) => {
//     console.log("mapDispatchToProps :>> ", mapDispatchToProps);
//     const store = useContext(Context);

//     const stateProps = mapStateToProps(store.getState());

//     let dispatchProps = { dispatch: store.dispatch };

//     if (typeof mapDispatchToProps === "function") {
//       dispatchProps = mapDispatchToProps(store.dispatch);
//     } else if(typeof mapDispatchToProps === 'object'){
//       dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)
//     }

//     // const [state, setState] = useState(0);
//     // const [, forceUpdate] = useReducer((x) => x + 1, 0);

//     const forceUpdate = useForceUpdate();
//     useLayoutEffect(() => {
//       store.subscribe(() => {
//         forceUpdate();
//       });
//     }, [store]);

//     return <WrappedComponent {...props} {...stateProps} {...dispatchProps} />;
//   };

export const connect =
  (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => (props) => {
    const store = useContext(Context);
    const stateProps = mapStateToProps(store.getState());
    // 默认的 dispatch
    let dispatchProps = { dispatch: store.dispatch };
    if (typeof mapDispatchToProps === "function") {
      dispatchProps = mapDispatchToProps(store.dispatch);
    } else if (typeof mapDispatchToProps === "object") {
      dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch);
    }

    const forceUpdate = useForceUpdate();
    useLayoutEffect(() => {
      store.subscribe(() => {
        forceUpdate();
      });
    }, [store]);

    return <WrappedComponent {...props} {...stateProps} {...dispatchProps} />;
  };

function useForceUpdate() {
  const [, setState] = useReducer((x) => x + 1, 0);

  const update = useCallback(() => {
    setState();
  }, []);

  return update;
}

// function useForceUpdate() {
//   const [state, setState] = useState(0);

//   const update = useCallback(() => {
//     setState((prev) => prev + 1);
//   }, []);

//   return update;
// }

export function bindActionCreators(creators, dispatch) {
  let obj = {};
  for (const key in creators) {
    if (Object.hasOwnProperty.call(creators, key)) {
      console.log("creators[key] :>> ", creators[key]);
      obj[key] = bindActionCreator(creators[key], dispatch);
    }
  }

  return obj;
}

// function bindActionCreator(creator, dispatch) {
//   return (...args) => {
//     console.log('..args :>> ', ...args);
//     return dispatch(creator(...args))};
// }

function bindActionCreator(creator, dispatch) {
  return (...args) => dispatch(creator(...args));
}

export function useDispatch() {
  const store = useContext(Context);

  return store.dispatch;
}
export function useSelector(selector) {
  const store = useContext(Context);
  const selectedState = selector(store.getState());
  const forceUpdate = useForceUpdate();
  useLayoutEffect(() => {
    store.subscribe(() => {
      forceUpdate();
    });
  }, [store]);
  return selectedState;
}
