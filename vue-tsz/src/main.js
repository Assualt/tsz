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
Vue.config.productionTip = false

import axios from 'axios'
import VueAxios from 'vue-axios'
import md5 from 'js-md5';
import sha1 from 'js-sha1'
import app from './constants/App'
import VueCookies from 'vue-cookies'
import echarts from 'echarts'
import VueRouter from 'vue-router'

Vue.use(VueCookies)
Vue.use(VueAxios,axios)


Vue.prototype.$md5 = md5;
Vue.prototype.$app = app;
Vue.prototype.$sha1 = sha1;
Vue.prototype.$echars = echarts;
/* eslint-disable */

//define the axios function
Vue.prototype.axios_get=async function(url,params){
  try {
    const retData = await this.axios.get(url, params);
    return retData;
  } catch (error) {
    console.log("Request " + url + " Failed " + error);
    return {};
  }
};
Vue.prototype.axios_post=async function(url, params) {
  try {
    const retData = await this.axios.post(url, params);
    return retData;
  } catch (error) {
    console.log("Request " + url + " Failed " + error);
    return {};
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
