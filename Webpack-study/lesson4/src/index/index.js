// import '../style/index.less';
// import '@babel/polyfill';
// import pic from './images/logo.png';
// console.log('hello loader :>> '); // hk-log

// const img = new Image();

// img.src = pic;

// const tag = document.getElementsByClassName('div1')
// console.log('tag :>> ', tag); // hk-log
// tag[0].after(img)
// tag.before(img)
// import  'core-js/stable';
// import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import ReactDom from 'react-dom';

function App() {
	return <div>hello JSX</div>;
}

ReactDom.render(<App />, document.getElementById('app'));

const arr = [new Promise(() => {})];

arr.map((item) => {
	console.log('item :>> ', item); // hk-log
});
