const fs = require('fs');

const data = fs.readFileSync('./config.json');
console.log('data :>> ', data); // hk-log

const data1 = fs.readFile('./config.json', (err, data) => {
	if (err) throw err;
	console.log('data1 :>> ', data.toString()); // hk-log
});


(async ()=>{
    const fs = require('fs')
    const {promisify} = require('util')
    const readFile = promisify(fs.readFile)

    const data3 = await readFile('./config.json')

    console.log('data3 :>> ', data3.toString()); // hk-log
})()
