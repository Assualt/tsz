import { Navigate, createHashRouter, useHref } from 'react-router-dom'
import Home from '@renderer/pages/home/Home'
import PageNotFound from '@renderer/pages/common/404'
import RouterBefore from './router'
import Login from '@renderer/pages/login/index'

// 定义路由配置
const routes = [
  {
    path: '/',
    element: <RouterBefore />,
    children: [
      {
        path: '',
        element: <Navigate to="/login" replace />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'home',
        element: <Home href="/home" />
      },
      {
        path: 'order',
        element: <Home href="/order" />
      },
      {
        path: 'orderlist',
        element: <Home href="/order/list" />
      },
      {
        path: 'userInfo',
        element: <Home href="/userInfo" />
      },
      {
        path: 'passagerMgr',
        element: <Home href="/passager/mgr" />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />
  },
  {
    path: '404',
    element: <PageNotFound />
  }
]

// 使用 HashRouter 以支持 electron 环境
const router = createHashRouter(routes)

export default router