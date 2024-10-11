import { api } from './index'
import dayjs from 'dayjs'

export function login(userName: string, password: string) {
  return api.post('/user/login', {
    userName: userName,
    password: password,
    timestamp: dayjs()
  })
}

export function logout(userName: string) {
  return api.post('/user/logout', {
    userName: userName,
    timestamp: dayjs()
  })
}

export function register(userName: string, password: string, verifyCode: string) {
  return api.post('/user/register', {
    userName: userName,
    password: password,
    timestamp: dayjs(),
    verifyCode: verifyCode
  })
}

export function getVerifyCode(userName: string) {
  return api.post('/user/getVerifyCode', {
    userName: userName,
    timestamp: dayjs()
  })
}

export function getUserPassagers(userId: string) {
  return api.post('/user/getPassagers', {
    userId: userId,
    timestamp: dayjs()
  })
}

export function getPassagerInfo(userName: string) {
  return api.post('/user/getPassagerInfo', {
    userName: userName,
    timestamp: dayjs()
  })
}
