const LoginService = {
	login(userInfo) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (userInfo.name === '小明') {
					resolve({ id: 123, name: '小明' });
				} else {
					reject({ err: { msg: '用户名或密码错误' } });
				}
			}, 1000);
		});
	},
	getMoreUserInfo(userInfo) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (userInfo.id === 123) {
					resolve({ ...userInfo, score: '100' });
				} else {
					reject({ msg: '获取详情信息错误' });
				}
			}, 1000);
		});
	},
};

export default LoginService
