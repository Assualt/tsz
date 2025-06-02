import './assets/main.css'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { XHR } from './mock/index'
XHR()

import router from './router/index'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router}></RouterProvider>
)
