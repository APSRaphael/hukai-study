// import ReactDOM from 'react-dom';
// import { useState, useReducer, Component } from 'react';

import ReactDOM from './kreact/react-dom';
import Component from './kreact/Component';
import { useReducer,useState } from './kreact/';

import './index.css';
function FunctionComponent({ name }) {
	// old fiber.memoizedState hook0 -> next(hook1) -> next(hook2)
	// workInProgressHook
	const [count, setCount] = useReducer((x) => x + 1, 2);
	const [count2, setCount2] = useState(0);
	return (
		<div className='border'>
			<p>{name}</p>
			<p>{count}</p>
			<button
				onClick={() => {
					setCount(count + 1);
				}}>
				CLICK reduce
			</button>
			<p>{count2}</p>
			<button
				onClick={() => {
					setCount2(count2 + 1);
				}}>
				CLICK state
			</button>
		</div>
	);
}

class ClassComponent extends Component {
	render() {
		return (
			<div className='border'>
				<p>{this.props.name}</p>
			</div>
		);
	}
}

function FF() {
	return (
		<>
			<li>1</li>
			<li>2</li>
		</>
	);
}

const jsx = (
	<div className='border'>
		<h1>全栈</h1>
		<a href='https://wwww.kaikeba.com'>KKB</a>
		<FunctionComponent name='function' />
		<ClassComponent name='class' />
		{/* <FF /> */}
	</div>
);

ReactDOM.render(jsx, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
