const buffer = Buffer.alloc(10).fill(10);

console.log('buffer :>> ', buffer); // hk-log

const buf2 = Buffer.from('a');
console.log('buf2 :>> ', buf2); // hk-log

const buf3 = Buffer.from('中');
console.log('buf3 :>> ', buf3); // hk-log

const buf4 = Buffer.concat([buf3, buf2]);
console.log('buf4 :>> ', buf4.toString()); // hk-log
 