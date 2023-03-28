const fs = require("fs");
const zlib = require("zlib");

// const rs = fs.createReadStream(__dirname + "/logo-hover.png");
// const ws = fs.createWriteStream(__dirname + "/logo.png");
// // const rs = fs.createReadStream(__dirname + "/生意参谋.xlsx");
// // const ws = fs.createWriteStream(__dirname + "/logo.xlsx.gz");

// // rs.on("data", (chunk) => {
// // 	// console.log("chunk :>> ", chunk); // hk-log
// // 	console.log('chunk :>> ', chunk.toString("utf8")); // hk-log
// // 	ws.write(chunk);

// // });
// ws.on('finish',()=>{
// 	console.log('finish :>> '); // hk-log
// })
// rs.on('end',()=>{
// 	console.log('结束 :>> '); // hk-log
// })

// rs.pipe(ws)
// rs.pipe(zlib.createGzip()).pipe(ws)

fs.open(__dirname + "/生意参谋.xlsx", "r+", (err, data) => {
	if (err) {
		console.log("err :>> ", err);
	} // hk-log
	console.log("data :>> ", data); // hk-log
});

console.log(' :>> /supplier.jso' ); // hk-log
fs.stat(__dirname + "/生意参谋.xlsx",  (err, stats) => {
	if (err) {
		console.log("err :>> ", err);
	} // hk-log
	console.log("data :>> ", stats); // hk-log
});
