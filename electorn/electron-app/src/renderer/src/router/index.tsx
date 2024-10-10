import App from '@renderer/App'
import Home from '@renderer/pages/home/Home'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import RouterBefore from './router'
import PageNotFound from '@renderer/pages/common/404'

export default createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <RouterBefore />,
        children: [
          {
            path: '/',
            element: <Navigate replace to="/index" />
          },
          {
            path: '/index',
            element: <App />
          },
          {
            path: '/login',
            element: <Home />
          }
        ]
      }
    ]
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/order',
    element: <Home />
  },
  {
    path: '/404',
    element: <PageNotFound />
  }
])
