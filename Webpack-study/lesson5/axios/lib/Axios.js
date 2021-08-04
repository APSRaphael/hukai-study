import getDefaultAdapter from './adapter';
import InterceptorManager from './InterceptorManage';

function Axios(config) {
	this.interceptors = {
		request: new InterceptorManager(),
		response: new InterceptorManager(),
	};
}

Axios.prototype.request = function (config) {
	const adapter = getDefaultAdapter(config);
	var promise = Promise.resolve(config);
	var chain = [adapter, undefined];

	this.interceptors.request.handlers.forEach((item) => {
		// chain.unshift(item.rejected);
		// chain.unshift(item.fulfilled);
		chain.unshift(item.fulfilled, item.rejected);

	});

	this.interceptors.response.handlers.forEach((item) => {
		chain.push(item.fulfilled);
		chain.push(item.rejected);
	});

	console.dir(chain);

	while (chain.length) {
		promise = promise.then(chain.shift(), chain.shift());
	}

	return promise;
};

Axios.prototype.get = function (url, config = {}) {
	return this.request({ url: url, method: 'GET', ...config });
};

Axios.prototype.post = function (url, data, config = {}) {
	return this.request({ url: url, method: 'POST', data, ...config });
};

export default Axios;
