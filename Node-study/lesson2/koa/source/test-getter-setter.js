// 假定属性不确定，但是结果固定

const kaikeba = {
	info: {
		name: '开课吧',
	},
	get name() {
		return this.info.name;
	},
	set name(val) {
		this.info.name = val;
	},
};

console.log('kaikeba.name :>> ', kaikeba.name); // hk-log
