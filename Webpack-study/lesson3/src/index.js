import pic from './images/logo.png';
console.log('hello loader :>> '); // hk-log

const img = new Image();

img.src = pic;


const tag = document.getElementById('app')
console.log('tag :>> ', tag); // hk-log
tag.after(img)
// tag.before(img)
