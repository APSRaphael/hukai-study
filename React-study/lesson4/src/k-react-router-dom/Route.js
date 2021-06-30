import React, { Component } from "react";
import matchPath from "./matchPath";
import RouterContext from "./RouterContext";
class Route extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {(context) => {
          const { location } = context;
          const { path, children, component, render } = this.props;
          // const match = path === context.location.pathname;
          const match = path
            ? matchPath(location.pathname, this.props)
            : context.match;
          const props = {
            ...context,
            location,
            match,
          };
          // return match ? React.createElement(component) : null;

          //* match children => component => render => null
          // not Match children => null

          // return match
          //   ? children
          //     ? typeof children === "function"
          //       ? children(props)
          //       : children
          //     : component
          //     ? React.createElement(component, props)
          //     : render
          //     ? render(props)
          //     : null
          //   : typeof children === "function"
          //   ? children(props)
          //   : null;

          return (
            <RouterContext.Provider value={props}>
              {match
                ? children
                  ? typeof children === "function"
                    ? children(props)
                    : children
                  : component
                  ? React.createElement(component, props)
                  : render
                  ? typeof render === "function"
                    ? render(props)
                    : null
                  : null
                : typeof children === "function"
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