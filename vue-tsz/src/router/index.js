import Vue from 'vue'
import Router from 'vue-router'
import Index from '../pages/Index'
import Login from '../pages/Login'
import Cart from '../pages/Cart'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name:'Index',
      component:Index
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    }
  ]
})
