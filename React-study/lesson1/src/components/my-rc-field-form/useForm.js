import { useRef } from 'react';

// 状态管理库
class FormStore {
	constructor() {
		this.store = {};

		this.fieldEntities = [];

		this.callbacks = {};
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

	setCallbacks = (newCallbacks) => {
		this.callbacks = {
			...this.callbacks,
			...newCallbacks,
		};
	};

	validate = () => {
		let err = [];
		this.fieldEntities.forEach((field) => {
			const { name, rules } = field.props;
			let rule = rules && rules[0];

			let value = this.getFieldValue(name);
			if (rule && rule.required && (value === undefined || value === '')) {
				err.push({
					[name]: rule.message,
					value,
				});
			}
		});
		return err;
	};

	submit = () => {
		let err = this.validate();
		const { onFinishFailed, onFinish } = this.callbacks;
		console.log('err :>> ', err);
		if (err.length > 0) {
			onFinishFailed(err, this.getFieldsValue());
			console.log('失败 :>> ', '失败');
		} else {
			onFinish(this.getFieldsValue());
		}
	};

	getForm = () => {
		return {
			getFieldValue: this.getFieldValue,
			getFieldsValue: this.getFieldsValue,
			setFieldsValue: this.setFieldsValue,
			setFieldValue: this.setFieldValue,
			setFieldEntities: this.setFieldEntities,
			setCallbacks: this.setCallbacks,
			submit: this.submit,
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

