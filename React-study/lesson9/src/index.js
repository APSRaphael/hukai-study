// import React, {Component} from "react";
import ReactDOM from 'react-dom';
// import { useReducer } from 'react';
import { useMemo, useReducer, useState, useEffect, useLayoutEffect,Fragment } from 'react';
// import { useReducer, useState, useEffect, useLayoutEffect } from './hkreact';
// import ReactDOM from './hkreact/react-dom';
// import Component from "./kreact/Component";
import './index.css';

// class ClassComponent extends Component {
//   render() {
//     return (
//       <div className="border">
//         <p>{this.props.name}</p>
//       </div>
//     );
//   }
// }

function FunctionComponent(props) {
	const [count0, setCount0] = useState(6);
	const [count, setCount] = useState(11);
	const [count2, setCount2] = useReducer((x) => x + 2, 0);

	useEffect(() => {
		console.log('useEffect :>> ', count0); // hk-log
	}, [count0]);

	useLayoutEffect(() => {
		console.log('useLayoutEffect :>> ', count2); // hk-log
	}, [count2]);

	return (
		<>
			<div className='border'>
				<p>{props.name}</p>
				<p>{count0}</p>
				<button onClick={() => setCount0(count0 + 11)}>click</button>
				<p>{count}</p>
				<button onClick={() => setCount((prev) => prev + 11)}>click</button>
				<p>{count2}</p>
				<button
					onClick={() => {
						setCount2(count2 + 1);
					}}>
					click
				</button>
				{/* {count0 % 2 ? <div>123</div> : <span>456</span>} */}
				<ul>
					<li key='0'>0</li>
					<li key='1'>1</li>
					{count0 % 2 ? <li key='2'>2</li> : null}
					<li key='3'>3</li>
					<li key='4'>4</li>
				</ul>
			</div>
		</>
	);
}

// function FF() {
// 	return (
// 		<>
// 			<li>0</li>
// 			<li>1</li>
// 		</>
// 	);
// }



const Admin = () => {

	const [, setRandom] = useState(0); //{1}
  
	function getState() {  //{2}
  
	  console.log("getState run"); //{3}
  
	  let temp = 0;
	  for (let index = 0; index < 1000; index++) {
		temp += index;
	  }
  
	  return temp;
	}

	const memoizedValue = useMemo(getState, []) // {7}
  
	const computeValue = memoizedValue; //{4}
	console.log("computeValue", computeValue)//{5}
  
	return (
	  <Fragment>
		Admin
		<button type="ghost" onClick={() => setRandom(Math.floor(Math.random() * 10 + 1))}>setRandom</button>  {/* {6} */}
	  </Fragment>
	)
  
  }

const jsx = (
	<div className='border'>
		<h1>全栈</h1>
		<a href='https://www.kaikeba.com/'>kkb</a>
		<FunctionComponent name='嘉恒' />
		<Admin />
		{/* <ClassComponent name="class" /> */}
		{/* <ul>
			<FF />
			<>
				<li>0</li>
				<li>1</li>
			</>
		</ul> */}
	</div>
);



ReactDOM.render(jsx, document.getElementById('root'));

// console.log("React", React.version); //sy-log

//原生标签
// 文本
// 函数组件
