import React, { useCallback } from "react";

// import { useDispatch, useSelector } from "react-redux";
import { useDispatch, useSelector } from "../kReactRedux";

export default function ReactReduxHookPage(props) {
  const count = useSelector(({ count }) => count);
  // const count = useSelector((state) => state.count);
  console.log("count :>> ", count);
  const dispatch = useDispatch();

  const add = useCallback(() => {
    console.log('111 :>> ', 111);
    dispatch({ type: "ADD" });
  }, []);

  return (
    <div>
      <h3>ReactReduxHookPage</h3>
      <p>{count}</p>
      <button onClick={add}>add</button>
    </div>
  );
}
