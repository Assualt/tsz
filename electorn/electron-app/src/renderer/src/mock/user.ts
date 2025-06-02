import { api } from '../api/index'
import Mock from 'mockjs'

function getPassagers() {
  let users = Mock.mock({
    'array|10': [
      {
        'id|+1': 1,
        name: '@cname()',
        type: '@pick(成人, 儿童)'
      }
    ]
  })

  return users.array
}

function getPassagerInfo(name: string) {
  let user = Mock.mock({
    idCard: '@id()',
    type: '@pick(成人, 儿童)',
    idCardType: '@pick(身份证, 护照, 港澳通行证, 台湾通行证)'
  })
  user['user'] = name
  return user
}

export const userMock = [
  {
    url: '/api/user/login',
    type: 'post',
    response: (config: any) => {
      return api.result(200, 'OK', {
        token: '1234567890',
        userInfo: {
          userName: 'admin',
          avatar: 'https://xxx.com/avatar.jpg',
          userId: 123
        }
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
  },
  {
    url: '/api/user/getPassagers',
    type: 'post',
    response: (request: any) => {
      return api.result(200, 'OK', getPassagers())
    }
  },
  {
    url: '/user/getPassagerInfo',
    type: 'post',
    response: (request: any) => {
      return api.result(200, 'OK', getPassagerInfo(request.body.name))
    }
  }
]
