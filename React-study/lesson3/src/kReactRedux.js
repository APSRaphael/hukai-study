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

    // const [state, setState] = useState(0);
    console.log("7777 :>> ", 7777); // hk-log
    const forceUpdate = useForceUpdate();
    useLayoutEffect(() => {
      console.log("8888 :>> ", 8888); // hk-log
      // console.log("forceupdat :>> ", forceUpdate); // hk-log
      store.subscribe(() => {
        console.log("99999999999 :>> ", 99999999999); // hk-log
        forceUpdate();
        // console.log('state :>> ', state); // hk-log
        // setState(state + 1);
      });
    }, [store]);

    return <WrappedComponent {...props} {...stateProps} {...dispatchProps} />;
  };

function useForceUpdate() {
  console.log("22224444 :>> ", 22224444); // hk-log
  const [, setState] = useReducer((x) => x + 1, 0);
  // const [state, setState] = useState(0);

  const update = useCallback(() => {
    // console.log("state :>> ", state); // hk-log
    setState();
    // setState((prev) => {
    //   console.log("prev :>> ", prev); // hk-log
    //   return prev + 1;
    // });
  }, []);
  // const update = () => {
  //   console.log("state :>> ", state); // hk-log
  //   setState(state +1);

  //   // setState((prev) => {
  //   //   console.log("prev :>> ", prev); // hk-log
  //   //   return prev + 1;
  //   // });
  //   //     // setState();
  // };

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
      obj[key] = bindActionCreator(creators[key], dispatch);
    }
  }

  return obj;
}

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
