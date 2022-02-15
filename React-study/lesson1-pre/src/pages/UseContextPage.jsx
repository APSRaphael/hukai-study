import React from 'react';
import Context from '../Context.js';

export default function UseContextPage(props) {
	const theme = React.useContext(Context);
	return <div>{theme}</div>;
}
