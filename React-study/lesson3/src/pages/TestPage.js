import React, { useState, useMemo, memo } from "react";

const Child = memo(({ userInfo }) => {
  console.log("child render");

  console.log("props.userInfo :>> ", userInfo); // hk-log
  return <div>this is child</div>;
});

function Father() {
  console.log("father render");
  const [count, setCount] = useState(0);

  // const userInfo = { age: 20 };
  const userInfo = useMemo(() => ({ aaa: "1 " }), []);
  return (
    <div>
      this. is father
      <p>
        <button onClick={() => setCount(count + 1)}>add</button>
      </p>
      <Child userInfo={userInfo} />
    </div>
  );
}

export default Father;
