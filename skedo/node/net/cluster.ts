import cluster from "cluster";
import { cpus } from "os";
import http from "http";

if (cluster.isPrimary) {
	for (let i = 0; i < cpus.length; i++) {
		cluster.fork();
	}
	cluster.on("exit", (worker, code, signal) => {
		console.log("worker :>> ", worker); // hk-log
	});
} else {
	http
		.createServer((req, res) => {
			res.writeHead(200);
			res.end("hello world!\n");
		})
		.listen(3000);
}
