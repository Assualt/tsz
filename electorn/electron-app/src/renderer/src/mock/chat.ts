import { api } from '../api/index'
import Mock from 'mockjs'

const getChatList = () => {
  return Mock.mock({
    'chatList|20': [
      {
        'id|+1': 1,
        title: '@ctitle(5, 10)',
        time: '@datetime("yyyy-MM-dd HH:mm:ss")',
        content: '@cparagraph(1, 3)',
        avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=@integer(0, 100)&size=64',
        muted: '@boolean',
        'unread|0-10': 0
      }
    ]
  })
}

const getChatHistory = () => {
  const mockData = Mock.mock({
    'histList|2': [
      {
        'id|+1': 1,
        name: '@cname()',
        nickName: '@cname()',
        avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=@integer(0, 100)&size=64',
        content: '@cparagraph(1, 3)',
        time: '@datetime("yyyy-MM-dd HH:mm:ss")',
        'msgType|0-6': 0,
        isSelf: '@boolean'
      }
    ]
  })

  mockData.histList = mockData.histList.concat(userChatList)
  return mockData
}

let userChatList = []

const sendChatMessage = (params) => {
  const { userId, chatId, content } = params
  if (!userId || !chatId || !content) {
    return {}
  }
  console.log(params)
  userChatList.push({
    id: userId,
    name: 'test',
    nickName: 'test',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=@integer(0, 100)&size=64',
    content: content,
    time: new Date(),
    msgType: 0,
    isSelf: true
  })
  return {}
}

export const chatMock = [
  {
    url: '/api/chat/getChatList',
    type: 'post',
    response: () => {
      return api.result(200, 'OK', getChatList())
    }
  },
  {
    url: '/api/chat/getChatHistory',
    type: 'post',
    response: () => {
      return api.result(200, 'OK', getChatHistory())
    }
  },
  {
    url: '/api/chat/sendChatMessage',
    type: 'post',
    response: (params: any) => {
      return api.result(200, 'OK', sendChatMessage(params))
    }
  }
]
