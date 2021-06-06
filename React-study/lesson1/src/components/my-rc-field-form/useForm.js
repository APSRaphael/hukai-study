import React, { useRef } from 'react';
class FormStore {
	constructor() {
		this.store = {};

		this.fieldEntities = [];
	}

	setFieldEntities = (entity) => {
		this.fieldEntities.push(entity);

		return () => {
			this.fieldEntities.filter((item) => item !== entity);
			delete this.store[entity.props.name];
		};
	};

	getFieldsValue = () => {
		return { ...this.store };
	};

	getFieldValue = (name) => {
		return this.store[name];
	};

	setFieldsValue = (newStore) => {
		this.store = {
			...this.store,
			...newStore,
		};
		this.fieldEntities.forEach((entity) =>
			Object.keys(newStore).forEach((key) => {
				if (key === entity.props.name) {
					console.log('entity :>> ', entity);
					entity.onStoreChange();
				}
			})
		);
	};

	setFieldValue = (name, newValue) => {
		this.store[name] = newValue;
	};

	getForm = () => {
		return {
			getFieldValue: this.getFieldValue,
			getFieldsValue: this.getFieldsValue,
			setFieldsValue: this.setFieldsValue,
			setFieldValue: this.setFieldValue,
			setFieldEntities: this.setFieldEntities,
		};
	};
}

export default function useForm(form) {
	const formRef = useRef();
	if (!formRef.current) {
		if (form) {
			formRef.current = form;
		} else {
			const formStore = new FormStore();
			formRef.current = formStore.getForm();
		}
	}
	return [formRef.current];
}
