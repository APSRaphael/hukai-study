const channel = new MessageChannel();
const { port1, port2 } = channel;

port1.onmessage = function (msgEvent) {
	console.log('port1 收到消息 :>> ', msgEvent.data);
	port1.postMessage('port2 请接收');
};

port2.onmessage = function (msgEvent) {
	console.log('port2 收到消息 :>> ', msgEvent.data);
};

port2.postMessage('port1 请接收');
