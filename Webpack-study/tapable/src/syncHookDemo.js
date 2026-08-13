const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
} = require('tapable');
// const SyncHook = require('../my/SyncHook');

const syncHook = new SyncHook(['author', 'age']);

syncHook.tap('监听器1', (name, age) => {
  console.log(`监听器1 :>> `, name, age); // hk-log
});

syncHook.tap('监听器2', (name) => {
  console.log(`监听器2 :>> `, name); // hk-log
});

syncHook.tap('监听器3', (name) => {
  console.log(`监听器3 :>> `, name); // hk-log
});

syncHook.call('不要', '99');

// SyncBailHook 是一个同步的、保险类型的 Hook，意思是只要其中一个有返回了，后面的就不执行了。
const hook = new SyncBailHook(['author', 'age']);

hook.tap('测试1', (param1, param2) => {
  console.log(`测试1 param1,param2 :>> `, param1, param2); // hk-log
});

hook.tap('测试2', (param1, param2) => {
  console.log(`测试2 param1,param2 :>> `, param1, param2); // hk-log
  return '123';
});

// 测试2返回了值，下面的不执行
hook.tap('测试3', (param1, param2) => {
  console.log(`测试3 param1,param2 :>> `, param1, param2); // hk-log
});

hook.call('不行', '88');

const waterHook = new SyncWaterfallHook(['author', 'age']);

waterHook.tap('测试1', (param1, param2) => {
  console.log(`测试1 param1,param2 :>> `, param1, param2); // hk-log
});

waterHook.tap('测试2', (param1, param2) => {
  console.log(`测试2 param1,param2 :>> `, param1, param2); // hk-log
  return '123';
});

// 测试2返回了值，下面的不执行
waterHook.tap('测试3', (param1, param2) => {
  console.log(`测试3 param1,param2 :>> `, param1, param2); // hk-log
});

waterHook.call('不行', '88');

const loopHook = new SyncLoopHook([]);

let count = 5;

loopHook.tap('测试1', () => {
  console.log(`测试1count :>> `, count); // hk-log
  if ([1, 2, 3].includes(count)) {
    return undefined;
  } else {
    count--;
    return '123';
  }
});

loopHook.tap('测试2', (param) => {
  console.log('测试2里面的count:', count, param);
  if ([1, 2].includes(count)) {
    return undefined;
  } else {
    count--;
    return '234';
  }
});

loopHook.tap('测试3', (param) => {
  console.log('测试3里面的count:', count, param);
  if ([1].includes(count)) {
    return undefined;
  } else {
    count--;
    return '345';
  }
});

loopHook.call();
