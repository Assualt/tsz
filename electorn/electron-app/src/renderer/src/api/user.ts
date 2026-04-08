import { api } from './index'
import dayjs from 'dayjs'

interface UserInfo {
  token: string
  userInfo: any
}

/**
 * 登录接口
 * @param username 用户名
 * @param password 密码
 */
export const login = async (username: string, password: string): Promise<UserInfo> => {
  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)
  formData.append('grant_type', 'password')
  formData.append('client_id', 'web')
  formData.append('scope', '')
  formData.append('client_secret', '')
  formData.append('timestamp', dayjs().toString())
  return await api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 退出登录
 */
export const logout = async (username: string): Promise<void> => {
  try {
    await api.post('/auth/logout', {
      username,
      timestamp: dayjs()
    })
  } finally {
    localStorage.removeItem('stoken')
    localStorage.removeItem('userInfo')
  }
}

/**
 * 用户注册
 * @param username 用户名
 * @param password 密码
 * @param verifyCode 验证码
 */
export const register = (username: string, password: string, email: string, verifyCode: string) => {
  return api.post('/auth/register', {
    username: username,
    password: password,
    email: email,
    code: verifyCode,
    timestamp: dayjs()
  })
}

/**
 * 获取验证码
 * @param username 用户名
 */
export const getVerifyCode = (username: string) => {
  return api.post('/auth/code', {
    username,
    timestamp: dayjs()
  })
}

/***
 * 获取当前用户
 */
export const getCurrentUser = () => {
  return api.get('/users/me')
}

/**
 * 获取用户乘客列表
 * @param userId 用户ID
 */
export const getUserPassengers = (userId: string) => {
  return api.post('/user/getPassagers', {
    userId,
    timestamp: dayjs()
  })
}

export const getUserPassagers = (userId: string) => {
  return api.post('/user/getPassagers', {
    userId,
    timestamp: dayjs()
  })
}

/**
 * 获取乘客信息
 * @param username 用户名
 */
export const getPassengerInfo = (username: string) => {
  return api.post('/user/getPassagerInfo', {
    username,
    timestamp: dayjs()
  })
}

/**
 * 检查登录状态
 * @returns Promise<boolean>
 */
export const checkLoginStatus = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('stoken')
    const userInfo = localStorage.getItem('userInfo')

    if (!token || !userInfo) {
      return false
    }

    const response = await api.post('/users/me', { token })
    return response.code === 0
  } catch (error) {
    console.error('Check login status failed:', error)
    return false
  }
}

/**
 * 获取用户信息
 * @returns 用户信息对象或null
 */
export const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo')
  return userInfo ? JSON.parse(userInfo) : null
}
