// 插件的基本结构
// 是个类
// 必须内置一个apply函数
// 插件配置
// hook

class KkbWebpackPlugin {
  constructor(options) {
    console.log(options);
  }
  apply(compiler) {
    // compiler 实例化的webpack对象 包含配置等信息
    // hook
    // 同步钩子用tap 注册
    // 异步钩子用tapAsync 注册
    // 事件名称可以为任意值，但是建议和我们的插件名称保持一直，或者有语义
    compiler.hooks.emit.tapAsync("xxx", (compilation, cb) => {
      // compilation ?
      const content = `hello 这是一段测试的文本`;
      compilation.assets["kkb.txt"] = {
        source: function () {
          return content;
        },
        size: function () {
          return content.length;
        },
      };
      cb();
    });
  }
}

module.exports = KkbWebpackPlugin;
