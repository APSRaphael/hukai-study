import React from "react";
import LifeCycle from "./LifeCycle";
import RouterContext from "./RouterContext";

function Prompt({ message, when = true }) {
  return (
    <RouterContext.Consumer>
      {(context) => {
        console.log('when :>> ', when); // hk-log
        if (!when) {
          return null;
        }
        let method = context.history.block;
console.log('22222 :>> ', 22222); // hk-log
        return (
          <LifeCycle
            onMount={(self) => {
              self.release = method(message);
            }}
            onUnmount={(self) => {
              self.release();
            }}
          />
        );
      }}
    </RouterContext.Consumer>
  );
}

export default Prompt;
