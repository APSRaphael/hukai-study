import { Component } from "react";
class LifeCycle extends Component {
  componentDidMount() {
    console.log('333 :>> ', 333); // hk-log
    if (this.props.onMount) {
      this.props.onMount.call(this, this);
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount :>> ', this);
    if (this.props.onUnmount) {
      this.props.onUnmount.call(this, this);
    }
  }

  render() {
    return null;
  }
}

export default LifeCycle;
