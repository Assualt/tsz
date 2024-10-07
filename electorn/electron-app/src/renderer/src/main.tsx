import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Main from './pages/main/index'
import Index from './pages/index/Index'
import PageNotFound from './pages/common/404'

import { i18n } from 'element-react'
import locale from 'element-react/src/locale/lang/zh-CN'
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
i18n.use(locale)

import 'element-theme-default' // 引入默认样式

import { XHR } from './mock/index'
XHR()

const router = createBrowserRouter([
  {
    path: '/index',
    element: <Index />
  },
  {
    path: '/main',
    element: <Main />
  },
  {
    path: '*',
    element: <PageNotFound />
  },
  {
    path: '/',
    element: <App />
  },
  {
    path: '/login',
    element: <App />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
)
