import React, { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { message, Spin } from 'antd'
import type { IpcRendererEvent } from 'electron'

interface LoginData {
  token: string
  userInfo: string
}

interface RouteConfig {
  path: string | RegExp
  needLogin: boolean
  title?: string
  isMain?: boolean // 标记是否为主窗口路由
}

const syncLoginData = (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    let attempts = 0
    const maxAttempts = 3
    const attemptSync = (): void => {
      const timeoutId = setTimeout(() => {
        if (attempts < maxAttempts) {
          attempts++
          window.api.removeAllListeners('receive-login-state')
          attemptSync()
        } else {
          resolve(false)
        }
      }, 1000)

      const handleReceiveState = (_: IpcRendererEvent, loginData: LoginData): void => {
        clearTimeout(timeoutId)
        if (loginData?.token && loginData?.userInfo) {
          try {
            const userInfo = JSON.parse(loginData.userInfo)
            if (userInfo?.userName && userInfo?.userId) {
              localStorage.setItem('stoken', loginData.token)
              localStorage.setItem('userInfo', loginData.userInfo)
              resolve(true)
              return
            }
          } catch (e) {
            console.error('Invalid userInfo format:', e)
          }
        }

        if (attempts < maxAttempts) {
          attempts++
          window.api.removeAllListeners('receive-login-state')
          attemptSync()
        } else {
          resolve(false)
        }
      }

      window.api.onReceiveLoginState(handleReceiveState)
      window.api.getLoginState()
    }

    attemptSync()
  })
}

const checkLoginStatus = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('stoken')
    const userInfo = localStorage.getItem('userInfo')

    if (!token || !userInfo) {
      const synced = await syncLoginData()
      if (!synced) {
        return false
      }
      console.log('Login status synced')
      return checkLoginStatus() // 递归检查新同步的状态
    }

    try {
      const parsedUserInfo = JSON.parse(userInfo)
      if (!parsedUserInfo?.userName || !parsedUserInfo?.userId) {
        localStorage.removeItem('stoken')
        localStorage.removeItem('userInfo')
        return false
      }
      return true
    } catch (e) {
      localStorage.removeItem('stoken')
      localStorage.removeItem('userInfo')
      return false
    }
  } catch (error) {
    console.error('Login status check failed:', error)
    return false
  }
}

const RouterConfig: RouteConfig[] = [
  { path: '/', needLogin: false, title: '登录' },
  { path: '/login', needLogin: false, title: '登录' },
  { path: '/home', needLogin: true, title: '主页', isMain: true },
  { path: '/order', needLogin: true, title: '订单', isMain: true },
  { path: '/404', needLogin: false, title: '页面未找到' },
  { path: '/chat', needLogin: true, title: '聊天', isMain: true }
]

export default function RouterBefore(): React.FC {
  const location = useLocation()
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)
  const [loginData, setLoginData] = useState<LoginData | null>(null)

  // 处理登录状态同步
  useEffect(() => {
    const handleRequestLoginState = async (_, targetId: number): Promise<void> => {
      const data: LoginData = {
        token: localStorage.getItem('stoken') || '',
        userInfo: localStorage.getItem('userInfo') || ''
      }
      if (data.token && data.userInfo) {
        await window.api.sendLoginState(targetId, data)
      }
    }

    const handleReceiveLoginState = (_event: IpcRendererEvent, data: LoginData): void => {
      if (data?.token && data?.userInfo) {
        setLoginData(data)
      }
    }

    const cleanupRequest = window.api.onRequestLoginState(handleRequestLoginState)
    const cleanupReceive = window.api.onReceiveLoginState(handleReceiveLoginState)

    return (): void => {
      cleanupRequest?.()
      cleanupReceive?.()
    }
  }, [])

  const checkAuth = useCallback(async () => {
    setIsChecking(true)
    try {
      // 获取当前路由配置
      const curPath = RouterConfig.find((item) => {
        if (typeof item.path === 'string') {
          return item.path === location.pathname
        }
        return item.path instanceof RegExp && item.path.test(location.pathname)
      })

      // 处理根路径
      if (location.pathname === '/') {
        const isLoggedIn = await checkLoginStatus()
        navigate(isLoggedIn ? '/home' : '/login', { replace: true })
        return
      }

      // 如果当前在登录页面且不需要登录状态检查
      if (location.pathname === '/login' && !curPath?.needLogin) {
        return
      }

      // 需要登录的路由才检查登录状态
      if (curPath?.needLogin) {
        const isLoggedIn = await checkLoginStatus()
        if (!isLoggedIn) {
          message.warning('您未登录或登录已过期，请重新登录')
          navigate('/login', { replace: true })
          return
        }
        // 已登录但访问登录页时重定向到首页
        if (location.pathname === '/login') {
          navigate('/home', { replace: true })
          return
        }
      }

      // 更新页面标题
      if (curPath?.title) {
        document.title = `12306助手 - ${curPath.title}`
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // 错误处理：如果是需要登录的页面，跳转到登录页
      const curPath = RouterConfig.find((item) =>
        typeof item.path === 'string'
          ? item.path === location.pathname
          : item.path instanceof RegExp && item.path.test(location.pathname)
      )

      if (curPath?.needLogin) {
        message.error('登录状态验证失败，请重新登录')
        navigate('/login', { replace: true })
      } else {
        message.error('系统错误，请刷新重试')
      }
    } finally {
      setIsChecking(false)
    }
  }, [location.pathname, navigate])

  // 监听登录状态变化和路由变化
  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      setIsChecking(false)
    }, 500)

    const performCheck = async (): Promise<void> => {
      try {
        if (loginData?.token && loginData?.userInfo) {
          localStorage.setItem('stoken', loginData.token)
          localStorage.setItem('userInfo', loginData.userInfo)
        }

        await checkAuth()
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Auth check failed:', error)
          message.error('登录状态检查失败')
        }
      } finally {
        if (!controller.signal.aborted) {
          clearTimeout(timeoutId)
          setIsChecking(false)
        }
      }
    }

    performCheck()

    return (): void => {
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [loginData, checkAuth])

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }

  const LoadingSpinner = () => (
    <Spin spinning={true} size="large" fullscreen>
      <div style={loadingStyle}>
        <div>加载中...</div>
      </div>
    </Spin>
  )

  return isChecking ? <LoadingSpinner /> : <Outlet />
}
