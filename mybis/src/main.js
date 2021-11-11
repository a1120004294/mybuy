// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import element
import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
import "./assets/css/global.css"
import "./assets/icocss/iconfont.css"
import axios from 'axios'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = axios
//配置请求根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
//配置请求拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
