import React, { Component, useEffect } from "react";
import {
  BrowserRouter as Router,
  // HashRouter as Router,
  // MemoryRouter as Router,  // native 使用
  Route,
} from "react-router-dom";

class RouteComponentPage extends Component {
  state = { count: 0 };
  render() {
    const { count } = this.state;
    return (
      <div>
        <h3>RouterComponentPage</h3>
        <button
          onClick={() => {
            this.setState({ count: count + 1 });
          }}
        >
          click change count {count}
        </button>
        <Router>
          {/*  错误用法，会导致组件不断销毁重建 */}
          <Route component={Child}></Route>
          {/* <Route component={() => <Child count={count} />}></Route> */}
          {/* <Route component={() => <FunctionChild count={count} />}></Route> */}
          {/* child 跟 render 都是 function */}
          {/* 匿名函数组件正确用法 */}
          {/* <Route render={() => <Child count={count} />}></Route> */}
          {/* <Route render={() => <FunctionChild count={count} />}></Route> */}

          {/* children */}
          {/* <Route children={() => <Child count={count} />}></Route> */}
        </Router>
      </div>
    );
  }
}

class Child extends Component {
  componentDidMount() {
    console.log("componentDidMount :>> ");
  }

  componentWillUnmount() {
    console.log("componentWillUnmount :>> ");
  }

  render() {
    return <div>child-{this.props.count}</div>;
  }
}

export default RouteComponentPage;

function FunctionChild(props) {
  const { count } = props;

  useEffect(() => {
    return () => {
      console.log("willUnmount :>> ");
    };
  }, []);
  return <div>count-{count} </div>;
}
