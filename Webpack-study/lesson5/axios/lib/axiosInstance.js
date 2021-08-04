function createInstance(config) {
	const content = new Axios(config);
	var instance = Axios.prototype.request.bind(context);

	for (let k of Object.keys(Axios.prototype)) {
		instance[k] = Axios.prototype[k].bind(context);
	}

	for (let k of Object.keys(context)) {
		instance[k] = content[k];
	}

	return instance;
}

const axios = createInstance({});

axios.create = function (config) {
	return createInstance(config);
};

export default axios;
