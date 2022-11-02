import {createServer, Socket} from 'net'
import dgram from 'dgram'

// dataGram -- data 最小单位

// import http from "http";

// http
// 	.createServer((req, res) => {
// 		res.writeHead(200);
// 		res.end("hello world!\n");
// 	})
// 	.listen(3000);




const server = createServer((socket)=>{
    socket.write('HTTP/1.1 20 OK\n')
    socket.write('Content-Type: text/html')
})

server.on('message', (msg, rinfo)=>{
    server.send()
})



const client = new Socket()
client.connetc(3000, '127.0.0.0', ()=>{
    client.write('hello\n')
})

// node-fetch
