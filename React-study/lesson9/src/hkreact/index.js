export { useReducer, useState, useEffect, useLayoutEffect } from './hooks';



// import {createRef, Component} from 'react';

// class App extends Component {
//   parentRef;
//   childRef;
//   constructor(props) {
//     super(props);
//     this.parentRef = createRef();
//     this.childRef = createRef();
//   }
//   componentDidMount() {
//     console.log("React componentDidMount！");
//     this.parentRef.current?.addEventListener("click", () => {
//       console.log("原生事件：父元素 DOM 事件监听！");
//     });
//     this.childRef.current?.addEventListener("click", () => {
//       console.log("原生事件：子元素 DOM 事件监听！");
//     });
//     document.addEventListener("click", (e) => {
//       console.log("原生事件：document DOM 事件监听！");
//     });
//   }
//   parentClickFun = () => {
//     console.log("React 事件：父元素事件监听！");
//   };
//   childClickFun = () => {
//     console.log("React 事件：子元素事件监听！");
//   };
//   render() {
//     return (
//       <div ref={this.parentRef} onClick={this.parentClickFun}>
//         <div ref={this.childRef} onClick={this.childClickFun}>
//           分析事件执行顺序
//         </div>
//       </div>
//     );
//   }
// }
// export default App;
// 合成事件和原生事件执行顺序
// https://juejin.cn/post/7005129812981317668
