// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import $ from 'jquery'
import 'bootstrap3/dist/css/bootstrap-theme.min.css'
import 'bootstrap3/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import '../static/styles/common.css'
import '../static/styles/hover-min.css'
import '../static/bootstrap/js/bootstrap.min'
import animated from 'animate.css'
import 'default-passive-events'

Vue.use(animated)
Vue.config.productionTip = false

import axios from 'axios'
import VueAxios from 'vue-axios'
import md5 from 'js-md5';
import sha1 from 'js-sha1'
import app from './constants/App'
import VueCookies from 'vue-cookies'
import echarts from 'echarts'
import VueRouter from 'vue-router'

//引入组件
import VueSweetalert2 from './plugins/vue-sweetalert2'

Vue.use(VueSweetalert2)
Vue.use(VueAxios, axios)

Vue.prototype.$cookies = VueCookies;
Vue.prototype.$md5 = md5;
Vue.prototype.$app = app;
Vue.prototype.$sha1 = sha1;
Vue.prototype.$echars = echarts;
/* eslint-disable */

/* 引入elements js/css */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//mock js
const { mockXHR } = require('../mock')
mockXHR()



//define the axios function
Vue.prototype.axios_get = async function (url, params) {
  try {
    var retData = await this.axios.get(url, { params });
    return retData;
  } catch (error) {
    console.log("Request " + url + " Failed " + error);
    return {};
  }
};
Vue.prototype.axios_post = async function (url, params) {
  try {
    const retData = await this.axios.post(url, params);
    return retData;
  } catch (error) {
    console.log("Request " + url + " Failed " + error);
    return false;
  }
}


let bus = new Vue()
Vue.prototype.bus = bus

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
