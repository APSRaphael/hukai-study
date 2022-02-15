import React, { Component } from "react";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import { bindActionCreators, connect } from "../kReactRedux";

@connect(
  // mapStateToProps function
  // ({ count }, aaa) => ({count, aaa}),
  ({ count }) => ({ count }),
  // mapDispatchToProps object | function
  // {
  //   add: () => ({
  //     type: "ADD",
  //   }),
  // }
  // { add: () => ({ type: "ADD" }) },
  (dispatch) => {
    // const add = () => dispatch({ type: "ADD" });
    // const minus = () => dispatch({ type: "MINUS" });

    // 可以不用每次写 dispatch
    let creators = {
      add: (a) => ({ type: "ADD" }),
      minus: () => ({ type: "MINUS" }),
    };

    creators = bindActionCreators(creators, dispatch);
    // return { dispatch, add, minus };
    return { dispatch, ...creators };
  },
  (stateProps, dispatchProps, ownProps) => {
    // return { ...stateProps, omg: "omg" };
    console.log('77777 :>> ', 8888); // hk-log
    return { ...stateProps, ...dispatchProps, ...ownProps, omg: "omg" };
  }
)
class ReactReduxPage extends Component {
  add = () => {
    this.props.dispatch({ type: "ADD", payload: 100 });
  };
  render() {
    console.log('88886666 :>> ', 8888); // hk-log
    const { count, add, minus, dispatch } = this.props;
    return (
      <div>
        <h3>ReactReduxPage</h3>
        <div>{count}</div>
        {/* <button onClick={this.add}>add</button> */}
        <button onClick={add}>add</button>
      </div>
    );
  }
}

export default ReactReduxPage;
