import Vue from 'vue';
// import Vue from '../../lesson5/dist/vue.js';
import App from './App.vue';

// import router from './router'
import router from './krouter';

// import store from './store'
import store from './kstore';

Vue.config.productionTip = false;

console.log('1111 :>> ', 1111); // hk-log
new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app');
