import { api } from '../api/index'
import Mock from 'mockjs'

export const userMock = [
  {
    url: '/api/user/login',
    type: 'post',
    response: (config: any) => {
      return api.result(200, 'OK', {
        s_token: '1234567890'
      })
    }
  },
  {
    url: '/api/user/logout',
    type: 'post',
    response: (request: any) => {
      const { type, body, query } = request
      return api.result(200, 'OK', { body })
    }
  },
  {
    url: '/api/user/register',
    type: 'post',
    response: (request: any) => {
      const { type, body, query } = request
      return api.result(200, 'OK', { body })
    }
  },
  {
    url: '/api/user/getVerifyCode',
    type: 'post',
    response: (request: any) => {
      const { type, body, query } = request
      return api.result(200, 'OK', {
        verifyCode: Mock.Random.integer(100000, 999999),
        name: body.userName
      })
    }
  }
]
