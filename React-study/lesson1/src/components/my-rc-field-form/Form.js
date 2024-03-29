import React from 'react';
import FieldContext from './FieldContext';
import useForm from './useForm';

export default function Form(
	{ form, children, onFinish, onFinishFailed },
	ref
) {
	// 函数组件可以传递 form,类组件没有 form 传递下来所以需要使用 useForm。函数组件的 form 传给 useForm会被直接返回。
	const [formInstance] = useForm(form);
	// 子到父传递
	React.useImperativeHandle(ref, () => formInstance);

	formInstance.setCallbacks({ onFinish, onFinishFailed });
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				formInstance.submit();
			}}>
			<FieldContext.Provider value={formInstance}>
				{children}
			</FieldContext.Provider>
		</form>
	);
}
