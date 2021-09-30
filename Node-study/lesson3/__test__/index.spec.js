const { promise, generator, asyncAwait, event } = require('..');

// test('promise', (done) => {
// 	promise();
// 	setTimeout(done, 1000);
// });

// test('Generator', (done) => {
// 	generator();
// 	setTimeout(done, 1000);
// });

// test('Async/Await', (done) => {
// 	asyncAwait();
// 	setTimeout(done, 1000);
// });


test('event', (done) => {
	event()
	setTimeout(done, 1000);
});

