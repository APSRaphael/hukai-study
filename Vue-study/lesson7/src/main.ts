/*
 * @Author: wb-hk750148@alibaba-inc.com
 * @Date: 2021-07-15 14:46:39
 * @LastEditTime: 2021-07-15 17:41:54
 * @LastEditors: wb-hk750148@alibaba-inc.com
 * @Description:
 */
import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
