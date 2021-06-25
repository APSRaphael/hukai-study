// import ReactDOM from 'react-dom';
import ReactDOM from './kreact/react-dom';
import Component from './kreact/Component';
import './index.css';

function FunctionComponent({ name }) {
	return (
		<div className='border'>
			<p>{name}</p>
			<button
				onClick={() => {
					console.log('name :>> ', name);
				}}>
				CLICK
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
		<FF />
	</div>
);

ReactDOM.render(jsx, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
