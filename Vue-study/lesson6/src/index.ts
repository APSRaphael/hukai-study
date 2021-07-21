/*
 * @Author: wb-hk750148@alibaba-inc.com
 * @Date: 2021-07-14 17:24:10
 * @LastEditTime: 2021-07-14 18:53:32
 * @LastEditors: wb-hk750148@alibaba-inc.com
 * @Description:  
 */
const msg = 'Type Script';

function sayHello(msg: string) {
	return 'Hello, ' + msg;
}
document.body.textContent = sayHello(msg);
