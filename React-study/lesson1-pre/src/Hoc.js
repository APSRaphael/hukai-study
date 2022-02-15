import React from 'react';

const Child = (props) => {
	console.log(' :>> '); // hk-log
};

const foo = (Com) => (props) => {
	return <Com {...props} />;
};
