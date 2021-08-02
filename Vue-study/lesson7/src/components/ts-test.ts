function Log(fn: any) {
  console.log('fn :>> ', fn); // hk-log
  return function (target: Function) {
    console.log('target :>> ', target); // hk-log
    target.prototype.log = function () {
      fn(this.bar);
    };
  };
}

function rec(target: any, name: string, descriptor: any) {
  console.log('target :>> ', target); // hk-log
  console.log('descriptor :>> ', descriptor); // hk-log
  const baz = descriptor.value;
  descriptor.value = function (val: string) {
    console.log('name :>> ', name); // hk-log
    baz.call(this, val);
  };
}

@Log(window.alert)
class Foo {
  bar = 'bar';

  @rec
  setBar(val: string) {
    this.bar = val;
  }
}

export const foo = new Foo();

// foo.log();
