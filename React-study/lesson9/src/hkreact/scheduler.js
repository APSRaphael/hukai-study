const taskQueue = [];
const timerQueue = [];

let deadline = 0;

const threshold = 5;

export function scheduledCallback(callback) {
	const newTask = { callback };
	taskQueue.push(newTask);
	schedule(flushWork);
}

function schedule(callback) {
	// 如果 scheduleCallback 被多次同时调用就会有多个 callback 添加到 timerQueue
	// 多个setState的处理会异步批量执行，就会使得 timerQueue里面有多个
	timerQueue.push(callback);
	postMessage();
}

const postMessage = () => {
	const { port1, port2 } = new MessageChannel();
	port1.onmessage = () => {
		let tem = timerQueue.splice(0, timerQueue.length);
		tem.forEach((c) => c());
	};

	port2.postMessage(null);
};

function flushWork() {
	deadline = getCurrentTime() + threshold;

	let currentTask = taskQueue[0];
	// 任务会有一个小顶堆排序，每次出堆优先级数字最小的那个

	while (currentTask && !shouldYield()) {
		const { callback } = currentTask;
		callback();
		taskQueue.shift();
		currentTask = taskQueue[0];
	}
}

export function shouldYield() {
	return getCurrentTime() >= deadline;
}

export function getCurrentTime() {
	return performance.now();
}
