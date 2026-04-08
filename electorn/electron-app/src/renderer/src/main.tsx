import './assets/main.css'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

// 禁用 mock 数据，使用真实后端服务
// import { XHR } from './mock/index'
// XHR()

import router from './router/index'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router}></RouterProvider>
)
