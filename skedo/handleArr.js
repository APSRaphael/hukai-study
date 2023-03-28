const fs = require("fs");
const { Buffer } = require("node:buffer");

// console.log('process.pwd() :>> ','utf8', process.pwd()); // hk-log
// fs.readFile("./设计模式.ts", (err, data) => {
// 	// fs.readFile("./supplier.json", "utf8", (err, data) => {
// 	if (err) throw err;
// 	console.log(data.toString("utf8"));
// 	console.log("data :>> ", data); // hk-log
// 	// const arr = JSON.parse(data).items;
// 	// console.log("arr :>> ", arr); // hk-log
// 	// const map = arr.map((item) => ({ name: item.name, code: item.code }));
// 	// console.log("map :>> ", map); // hk-log
// 	// const arrayBuffer = new ArrayBuffer(data);
// 	// console.log("arrayBuffer :>> ", arrayBuffer); // hk-log
// 	// // const buffer = Buffer.from(arrayBuffer);
// 	// fs.writeFile(__dirname + "/sample.json", JSON.stringify(map), (err) => {
// 	// 	console.log("newData :>> ", err); // hk-log
// 	// });

// 	let ws = fs.createWriteStream(__dirname + "/sample.js");

// 	ws.on("open", () => {
// 		console.log("123 :>> ", 123); // hk-log
// 	});
// 	ws.write(data.toString("utf8"));
// 	// ws.on("close", () => {});
// });

let rs = fs.createReadStream(__dirname + "/sample.json", {
	autoClose: false,
	emitClose: true,
});
rs.on("open", () => {
	console.log("open :>> "); // hk-log
});

rs.on("close", function () {
	console.log("close :>> "); // hk-log
});

rs.on("data", function (data) {
	// data是buffer一个伪数组，data.length值为65536,表示该buffer实例占用内存空间的大小
	// 65536/1024 = 64字节，也就是每次读取64字节
	console.log(data.length);
	console.log(data);
});
