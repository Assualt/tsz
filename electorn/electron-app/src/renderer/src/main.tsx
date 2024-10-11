import './assets/main.css'
import ReactDOM from 'react-dom/client'

import { i18n } from 'element-react'
import locale from 'element-react/src/locale/lang/zh-CN'
import { RouterProvider } from 'react-router-dom'
i18n.use(locale)

import 'element-theme-default' // 引入默认样式

import { XHR } from './mock/index'
XHR()

import router from './router/index'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router}></RouterProvider>
)
