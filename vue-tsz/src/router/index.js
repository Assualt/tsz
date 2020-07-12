import Vue from 'vue'
import Router from 'vue-router'
import Index from '../pages/Index'
import Login from '../pages/Login'
import Cart from '../pages/Cart'
import Trade from '../pages/Trade'
import store from '../store/index.js'
import Sold from '../pages/Sold'
import NotFound from '../pages/404'
//admin
import Admin from '../pages/Admin'
import DashBoard from '../pages/DashBoard'

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
        // requireAuth: true //判断路由是否需要登录权限
      }
    },
    {
      path: '/trade',
      name: 'Trade',
      component: Trade,
      meta:{
        // requireAuth: true
      }
    },
    {
      path: '/sold',
      name: 'Sold',
      component: Sold,
      meta:{
        requireAuth: false
      }
    },
    {
      path: '/admin',
      redirect: '/admin/login'
    },
    {
      path: '/admin/login',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/admin/dashboard',
      name: 'DashBoard',
      component: DashBoard,
      children:[
        {
          path:'tags',
          name:'tags',
          component: DashBoard
        },
        {
          path:'usermgr',
          name:'usermgr',
          component: DashBoard
        },
        {
          path:'ordermgr',
          name:'ordermgr',
          component: DashBoard
        },
        {
          path:'server',
          name:'server',
          component: DashBoard
        },
        {
          path:'charts',
          name:'charts',
          component: DashBoard
        },
        {
          path:'logsmgr',
          name:'logsmgr',
          component: DashBoard
        },
        {
          path:'loginout',
          name:'loginout',
          component: DashBoard
        }
      ]
    },
    {
      path:'*',
      name: 'notfound',
      component: NotFound

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