const isObject = v => typeof v === 'object' && v !== null;

function reactive(obj) {
  if (!isObject(obj)) {
    return obj;
  }
  return new Proxy(obj, {
    get(target, key) {
      console.log(`get`, key);
      const res = Reflect.get(target, key);
      track(target, key);
      return isObject(res) ? reactive(res) : res;
    },
    set(target, key, val) {
      console.log('set', key);
      console.log(`val`, val);
      const setRes = Reflect.set(target, key, val);
      trigger(target, key);
      return setRes;
    },
    deleteProperty(target, key) {
      console.log('delete', key);
      trigger(target, key);
      const res = Reflect.deleteProperty(target, key)
      delete res
    }
  });
}

// 创建响应式数据和副作用函数之间依赖关系

// 临时保存响应式函数
const effectStack = [];

// 存储依赖关系的map
const targetMap = new WeakMap();

// 添加副作用函数
function effect(fn) {
  const eff = function() {
    try {
      effectStack.push(eff);
      fn();
    } catch (error) {
      effectStack.pop();
    }
  };
  eff();
  return eff;
}

// 依赖收集
function track(target, key) {
  const eff = effectStack[effectStack.length - 1];
  if (eff) {
    // 获取 target 对应的 map
    let depMap = targetMap.get(target);
    if (!depMap) {
      // 1.首次访问不存在
      depMap = new Map();
      targetMap.set(target, depMap);
    }
    // 2.获取 key对应的 set
    let deps = depMap.get(key);
    if (!deps) {
      deps = new Set();
      depMap.set(key, deps);
    }

    deps.add(eff);
  }
}

function trigger(target, key) {
  const depMap = targetMap.get(target);
  if (depMap) {
    const deps = depMap.get(key);

    if (deps) {
      deps.forEach(dep => dep());
    }
  }
}

const state = reactive({ foo: 'foo', bar: { baz: 'jkjkj' } });
// state.foo = 'ssss'

effect(() => {
  console.log(`1111`, 1111);
  console.log(`state.foo`, state.foo);
});
// delete state.foo

// state.bar.baz
state.foo = 'adsfasdfs';
console.log(`3333`, 3333);
