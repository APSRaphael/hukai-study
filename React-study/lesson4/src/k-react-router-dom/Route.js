import React, { Component } from "react";
import matchPath from "./matchPath";
import RouterContext from "./RouterContext";
class Route extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {(context) => {
          const { location } = context;
          const { path, children, component, computedMatch, render } =
            this.props;
          const match = computedMatch  // <Switch> already computed the match for us
            ? computedMatch
            : path
            ? matchPath(location.pathname, this.props)
            : context.match;

          // const match = path === context.location.pathname;

          // const match = path
          // ? matchPath(location.pathname, this.props)
          // : context.match;
          console.log("match :>> ", match); // hk-log
          const props = {
            ...context,
            location,
            match,
          };
          // return match ? React.createElement(component) : null;

          //* match children => component => render => null
          // not Match children => null

          // return match
          //   ? children  // *if match
          //     ? typeof children === "function"
          //       ? children(props)
          //       : children
          //     : component
          //     ? React.createElement(component, props)
          //     : render
          //     ? render(props)
          //     : null
          //   : typeof children === "function" // *if not match 这就是 children 即时不匹配也会被渲染的原因， 前提是没有使用 switch，不然组件在 switch 中就已经被不匹配过滤了
          //   ? children(props)
          //   : null;

          return (
            <RouterContext.Provider value={props}>
              {match
                ? children // 匹配先判断 children
                  ? typeof children === "function"
                    ? children(props)
                    : children
                  : component // 再判断 component
                  ? React.createElement(component, props)
                  : render // 最后看 render
                  ? typeof render === "function"
                    ? render(props)
                    : null
                  : null
                : typeof children === "function" //不匹配直接判断 children
                ? children(props)
                : null}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Route;
