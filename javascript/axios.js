function Axios(config) {
  this.defaults = config;
  this.interceptors = {
    request: {},
    response: {},
  };
}

Axios.prototype.request = function (config) {
  console.log('发送Ajax 请求 type: ' + config.method);
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(
    interceptors
  ) {
    chain.unshift(interceptors.fulfilled, interceptors.rejected);
  });

  this.interceptors.response.forEach(function (interceptors) {
    chain.push(interceptors.fulfilled, interceptor.rejected);
  });

  while (chian.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
  return promise;
};

Axios.prototype.get = function () {
  return this.request({ method: 'GET' });
};

Axios.prototype.post = function () {
  return this.request({ method: 'POST' });
};

function createInstance() {
  const instance = Axios.prototype.request;
  instance.get = Axios.prototype.get;
  instance.post = Axios.prototype.post;
  return instance;
}

let axios = createInstance();

function createInstance(config) {
  var context = new Axios(config);
  var instance = Axios.prototype.request.bind(context);
  Object.keys(Axios.prototype).forEach((key) => {
    instance[key] = Axios.prototype[key].bind(context);
  });

  Object.keys(context).forEach((key) => {
    instance[key] = context[key];
  });
  return instance;
}
