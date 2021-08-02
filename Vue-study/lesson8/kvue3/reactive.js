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
      delete target[key];
    }
  });
}
const effectStack = [];
const targetMap = new WeakMap();

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

function track(target, key) {
  const eff = effectStack[effectStack.length - 1];
  if (eff) {
    let depMap = targetMap.get(target);
    if (!depMap) {
      depMap = new Map();
      targetMap.set(target, depMap);
    }
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
  console.log(`depMap`, depMap);
  if (depMap) {
    console.log(`key`, key);
    const deps = depMap.get(key);
    console.log(`deps1`, deps);

    if (deps) {
      console.log(`deps2`, deps);
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
