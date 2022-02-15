const bar = require('./bar');

console.log(111, 'bar :>> ', JSON.stringify(bar, null, 2)); // hk-log
module.exports = () => {
	bar();
};
