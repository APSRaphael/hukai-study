function getDefaultAdapter() {
	var adapter;
	if (typeof XMLHttpRequest !== 'undefined') {
		adapter = (config) => {
			return xhrAdapter(config);
		};
	}

	return adapter;
}

function xhrAdapter(config) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		if (config.cancelToken) {
			config.cancelToken.promise.then(function onCanceled(cancel) {
				if (!xhr) return;
				xhr.abort();
				reject('请求已取消');
				xhr = null;
			});
		}
		xhr.open(config.method, config.url, true);
		xhr.send();
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status >= 200 && xhr.status < 300) {
					resolve({
						data: {},
						status: xhr.status,
						statusText: xhr.statusText,
						xhr: xhr,
					});
				} else {
					reject({ status: xhr.status });
				}
			}
		};
	});
}

export default getDefaultAdapter;
