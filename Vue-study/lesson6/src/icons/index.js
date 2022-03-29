import Vue from 'vue';
import SvgIcon from '@/components/SvgIcon.vue'; // 假定有一个这样的自定义组件
// 自动加载
// req 仅从./svg目录下加载 svg 文件
const req = require.context('./svg', false, /\.svg$/);
req.keys().map(req);


// 注册 svg-icons
Vue.component('svg-icon', SvgIcon)
