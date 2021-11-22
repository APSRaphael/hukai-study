module.exports.compose = (middlewares) => () => {
	const dispatch = (i) => {
		// ##BEGIN##
		const fn = middlewares[i];
		if (!fn) {
			return Promise.resolve();
		}

		return Promise.resolve(
			fn(() => {
				return dispatch(i + 1);
			})
		);
		// ##END##
	};
	return dispatch(0);
};
