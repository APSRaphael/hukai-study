// loader的结构 函数 不可以是箭头函数
// loader必须有返回值
// 如何获取options
// 如何处理异步逻辑 this.async this.callback
// 多个loader如何配合
// 处理自定义loader的路径问题
module.exports = function (source) {
  console.log(this.query);
  //   return source.replace("loader", this.query.name);
  const callback = this.async(); //
  setTimeout(() => {
    const result = source.replace("loader", this.query.name);
    callback(null, result);
  }, 3000);
  //   this.callback(null, result);
};
