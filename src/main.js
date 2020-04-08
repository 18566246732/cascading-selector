import Vue from 'vue';
import App from './App.vue';

// 引入element ui 样式
import 'element-ui/lib/theme-chalk/index.css';

// 挂载全局方法
import helper from "./helper";
Vue.prototype.$helper = helper;

Vue.config.productionTip = false;

// 根据设备宽度判断是否移动端视图
const deviceWidth = document.documentElement.clientWidth;
const isMobile = deviceWidth < 750;

// 挂载全局数据
window.__INITIAL_DATA__ = {
  isMobile
};

new Vue({
  render: h => h(App),
}).$mount('#app');
