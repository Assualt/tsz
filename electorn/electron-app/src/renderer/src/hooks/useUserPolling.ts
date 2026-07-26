import { useEffect, useRef, useCallback } from 'react'
import { getCurrentUser } from '@renderer/api/user'
import { message } from 'antd'

interface UseUserPollingOptions {
  interval?: number // 轮询间隔，默认60秒
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  enabled?: boolean // 是否启用轮询，默认true
}

/**
 * 用户轮询 Hook
 * 每60秒调用一次 /api/v1/users/me 接口获取当前用户信息
 */
export const useUserPolling = (options: UseUserPollingOptions = {}) => {
  const {
    interval = 60000, // 默认60秒
    onSuccess,
    onError,
    enabled = true
  } = options

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isFirstCall = useRef(true)

  // 获取用户信息的函数
  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await getCurrentUser()
      console.log('User polling - getCurrentUser response:', response)

      if (response?.code === 0 || response?.status === 200) {
        onSuccess?.(response.data)
      } else {
        console.warn('User polling - unexpected response:', response)
      }
    } catch (error: any) {
      console.error('User polling - fetch user info failed:', error)
      onError?.(error)

      // 如果是401或403错误，说明token已过期，需要重新登录
      if (error.response?.status === 401 || error.response?.status === 403) {
        message.error('登录已过期，请重新登录')
        // 清除登录信息
        localStorage.removeItem('stoken')
        localStorage.removeItem('userInfo')
        // 跳转到登录页面
        window.location.href = '/login'
      }
    }
  }, [onSuccess, onError])

  // 开始轮询
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // 立即执行一次
    fetchUserInfo()

    // 设置定时轮询
    intervalRef.current = setInterval(() => {
      fetchUserInfo()
    }, interval)
  }, [fetchUserInfo, interval])

  // 停止轮询
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // 手动刷新
  const refresh = useCallback(() => {
    fetchUserInfo()
  }, [fetchUserInfo])

  useEffect(() => {
    if (enabled) {
      startPolling()
    } else {
      stopPolling()
    }

    // 清理函数
    return () => {
      stopPolling()
    }
  }, [enabled, startPolling, stopPolling])

  return {
    startPolling,
    stopPolling,
    refresh
  }
}

export default useUserPolling
