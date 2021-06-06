import React, { Component } from 'react';
import FieldContext from './FieldContext';

class Field extends Component {
	static contextType = FieldContext;

	componentDidMount() {
		this.unregister = this.context.setFieldEntities(this);
	}

	componentWillUnmount() {
		if (this.unregister) {
			this.unregister();
		}
	}

	onStoreChange = () => {
		this.forceUpdate();
	};
	getControlled = () => {
		const { name } = this.props;
		const { getFieldValue, setFieldsValue, setFieldValue } = this.context;
		return {
			value: getFieldValue(name),
			onChange: (e) => {
				const newVal = e.target.value;
				setFieldsValue({ [name]: newVal });
				// setFieldValue(name, newVal);
			},
		};
	};
	render() {
		const { children } = this.props;
		console.log('children :>> ', children);
		const returnChildNode = React.cloneElement(children, this.getControlled());
		return returnChildNode;
	}
}

export default Field;
