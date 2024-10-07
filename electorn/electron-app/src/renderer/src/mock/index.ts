// const Mock = require('mockjs')

import Mock from 'mockjs'
import { param2Obj } from './utils'

import { ticketMock, mockFunc } from './ticket'
import { userMock } from './user'


export const mocks = [...ticketMock, ...userMock]

export function XHR() {
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function () {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  const XHR2ExpressReqWrap = (respond) => {
    return (options) => {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url),
          url: url
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  mocks.forEach((item) => {
    console.log('add mock:' + item.url + ' type:' + item.type)
    Mock.mock(new RegExp(item.url), item.type || 'get', XHR2ExpressReqWrap(item.response))
  })

  mockFunc()
}
