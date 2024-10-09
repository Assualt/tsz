import { message } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const RouterConfig = [
  { path: '/home', needLogin: true },
  { path: '/index', needLogin: false}
]

export default function RouterBefore() {
  const location = useLocation()
  const navigate = useNavigate()

  const curPath = RouterConfig.find((item) => {
    if (typeof item.path === 'string') {
      return item.path === location.pathname
    }

    if (item.path instanceof RegExp) {
      return item.path.test(location.pathname)
    }

    return undefined
  })

  let token = localStorage.getItem('stoken')
  if (curPath && curPath.needLogin && !token) {
    message.info('请先登录, 3s后跳转登录页面' + JSON.stringify(curPath), 1)
    window.location.href = '/'
  } else {
    return (
      <>
        <Outlet/>
      </>
    )
  }
}
