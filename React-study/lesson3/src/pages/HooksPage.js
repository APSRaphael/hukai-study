import { useReducer, useEffect, useLayoutEffect } from "react";
import { counterReducer } from "../store";

const init = (initArg) => initArg - 0;

function HooksPage(props) {
  const [count, dispatch] = useReducer(counterReducer, "0", init);
  const [count2, dispatch2] = useReducer(counterReducer, "0", init);

  // 类比类组件中 cdm， cdu， cwun

  useEffect(() => {
    // 这个函数会在组件渲染到屏幕之后延迟执行
    console.log("useEffect :>> ");
  }, [count]);

  // 函数签名
  useLayoutEffect(() => {
    // 这个函数会在 DOM 变更之后同步调用
    // 可能会阻塞屏幕渲染
    console.log("useLayoutEffect :>> ");
  }, []);
  return (
    <div>
      <h3>HooksPage</h3>
      <button onClick={() => dispatch({ type: "ADD" })}>{count}</button>
      <button onClick={() => dispatch2({ type: "ADD" })}>{count2}</button>
    </div>
  );
}

export default HooksPage;
