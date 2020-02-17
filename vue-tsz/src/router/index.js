import Vue from 'vue'
import Router from 'vue-router'
import Index from '../pages/Index'
import Login from '../pages/Login'
import Cart from '../pages/Cart'
import store from '../store/index.js'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name:'Index',
      component:Index,
      meta:{
        requireAuth:false
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta:{
        requireAuth:false
      }
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart,
      meta:{
        requireAuth: true //判断路由是否需要登录权限
      }
    }
  ]
})

router.beforeEach((to,from,next)=>{
  if(to.meta.requireAuth){
    //判断是否登录过
    //从sessionStorage里面 uid=cookie
    const uid = store.state.CurrentCookie;
    if(uid == "" || uid == undefined){
      alert("当前没有用户登录,正在跳转至登录界面");
      next({
        path:'/login'
      })
    }else{
      next()
    }
  }else{
    next();
  }
})
export default router