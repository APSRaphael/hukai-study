/*
 * @Author: wb-hk750148@alibaba-inc.com
 * @Date: 2021-07-15 17:27:56
 * @LastEditTime: 2021-07-15 17:45:10
 * @LastEditors: wb-hk750148@alibaba-inc.com
 * @Description:
 */

function Log(fn: any) {
  return function (target: Function) {
    target.prototype.log = function () {
      fn(this.bar);
    };
  };
}

function rec(target: any, name: string, descriptor: any) {
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
