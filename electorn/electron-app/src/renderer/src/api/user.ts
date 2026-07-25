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

export interface Passenger {
  id: string
  name: string
  id_card: string
  id_card_type: string
  type: string
  phone?: string
  email?: string
  status: string
  created_at: string
  updated_at: string
}

/**
 * 获取当前用户的乘客列表
 * GET /api/v1/passengers
 */
export const getPassengers = () => {
  return api.get('/passengers')
}

/**
 * 新增乘客
 * POST /api/v1/passengers
 * @param passenger 乘客信息
 */
export const addPassenger = (passenger: {
  name: string
  id_card: string
  id_card_type: string
  type: string
  phone?: string
  email?: string
  remark?: string
}) => {
  return api.post('/passengers', passenger)
}

/**
 * 更新乘客信息
 * PUT /api/v1/passengers/:id
 * @param id 乘客ID
 * @param passenger 乘客信息
 */
export const updatePassenger = (id: string, passenger: {
  name: string
  id_card: string
  id_card_type: string
  type: string
  phone?: string
  email?: string
  remark?: string
}) => {
  return api.put(`/passengers/${id}`, passenger)
}

/**
 * 删除乘客
 * DELETE /api/v1/passengers/:id
 * @param id 乘客ID
 */
export const deletePassenger = (id: string) => {
  return api.delete(`/passengers/${id}`)
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
