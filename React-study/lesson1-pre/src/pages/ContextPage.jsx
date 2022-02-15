import React from 'react';
import Context from '../Context';
export default class ContextPage extends React.Component {
	static contextType = Context;
	render() {
		const { theme } = this.context;
		return <div>{theme}</div>;
	}
}
