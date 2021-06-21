import React, { Component } from "react";
import store from "../store";
class ReduxPage extends Component {
  unSubscribe;
  componentDidMount() {
    this.unSubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unSubscribe();
  }
  add = () => {
    store.dispatch({ type: "ADD", payload: 100 });
  };
  add2 = () => {
    store.dispatch({ type: "ADD2", payload: 1000 });
  };

  asyAdd = () => {
    // setTimeout(() => {
    // 	store.dispatch({ type: 'ADD' });
    // }, 1000);
    store.dispatch((dispatch, getState) => {
      setTimeout(() => {
        dispatch({ type: "ADD", payload: 100 });
      }, 1000);
    });
  };

  asyPromise = () => {
    store.dispatch(Promise.resolve({ type: "ADD", payload: 100 }));
  };
  render() {
    return (
      <div>
        <h3>ReduxPage</h3>
        <div>{store.getState().count}</div>
        <button onClick={this.add}>add</button>
        <button onClick={this.asyAdd}>aysAdd</button>
        <button onClick={this.asyPromise}>promise</button>
        <div>{store.getState().count2.num}</div>
        <button onClick={this.add2}>add</button>
      </div>
    );
  }
}

export default ReduxPage;
