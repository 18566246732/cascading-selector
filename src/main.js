import Vue from 'vue';
import App from './App.vue';

// 引入element ui 样式
import 'element-ui/lib/theme-chalk/index.css';

// 挂载全局方法
import helper from "./helper";
Vue.prototype.$helper = helper;

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
