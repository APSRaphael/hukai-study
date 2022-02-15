import React, { useCallback, memo, useMemo } from "react";

// import { useDispatch, useSelector } from "react-redux";
import { useDispatch, useSelector } from "../kReactRedux";

export default function ReactReduxHookPage(props) {
  const count = useSelector(({ count }) => count);
  // const count = useSelector((state) => state.count);
  const dispatch = useDispatch();

  const add1 = () => dispatch({ type: "ADD" });

  const add = useCallback(() => {
    dispatch({ type: "ADD" });
  }, []);

  const userInfo = { aaa: 1 };

  const userInfo2 = useMemo(() => userInfo, []);
  return (
    <div>
      <h3>ReactReduxHookPage</h3>
      <p>{count}</p>
      <button onClick={add1}>add</button>;
      <Child add={add} />
      <Child2 userInfo={userInfo2} />
    </div>
  );
}

const Child = memo((props) => {
  console.log("1111 :>> ", 1111); // hk-log
  return <button onClick={props.add}>add</button>;
});
const Child2=memo((props)=> {
  console.log("props.userInfo :>> ", props.userInfo); // hk-log
  return <div>bbb</div>;
})
