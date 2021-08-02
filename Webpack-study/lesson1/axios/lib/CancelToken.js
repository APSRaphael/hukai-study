function CancelToken(executor) {
	if (typeof executor !== 'function') {
		throw new TypeError('executor must be a function');
	}

	var resolvePromise;
	this.promise = new Promise((resolve) => {
		resolvePromise = resolve;
	});

	executor(resolvePromise);
}

CancelToken.source = function () {
	var cancel;
	var token = new CancelToken((c) => {
		cancel = c;
	});
	return {
		token,
		cancel,
	};
};
export default CancelToken;
