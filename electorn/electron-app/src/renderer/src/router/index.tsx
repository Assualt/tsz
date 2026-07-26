import { Navigate, createHashRouter } from 'react-router-dom'
import Home from '@renderer/pages/home'
import PageNotFound from '@renderer/pages/common/404'
import RouterBefore from './router'
import Login from '@renderer/pages/login/index'
import Payment from '@renderer/pages/ticket/tabs/Payment'

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
        element: <Home />
      },
      {
        path: 'order',
        element: <Home />
      },
      {
        path: 'orderlist',
        element: <Home />
      },
      {
        path: 'payment',
        element: <Payment />
      },
      {
        path: 'userInfo',
        element: <Home />
      },
      {
        path: 'passagerInfo',
        element: <Home />
      },
      {
        path: 'stationInfo',
        element: <Home />
      },
      {
        path: 'cityInfo',
        element: <Home />
      },
      {
        path: 'chat',
        element: <Home />
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

const router = createHashRouter(routes)

export default router
