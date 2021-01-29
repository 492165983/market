import Promise from 'promise-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import router from './router/index'
import 'babel-polyfill'
// 引入axios
import axios from 'axios'
//rem适配
import './utils/rem'
// 样式重置
import './utils/reset.css' 


if (!window.Promise) {
  window.Promise = Promise;
}
Vue.use(VueRouter);

Vue.config.productionTip = false

Vue.prototype.$http = axios



new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
