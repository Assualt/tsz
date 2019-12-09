// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
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


import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
Vue.prototype.$md5 = md5;
Vue.use(VueAxios,axios)
/* eslint-disable */

let bus = new Vue()
Vue.prototype.bus = bus

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
