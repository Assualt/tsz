import Mock from 'mockjs'
import { param2Obj } from './utils'

import { ticketMock, mockFunc } from './ticket'
import { userMock } from './user'
import { chatMock } from './chat'

export const mocks = [...ticketMock, ...userMock, ...chatMock]

export function XHR(): void {
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function (): void {
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
      if (!(respond instanceof Function)) {
        return Mock.mock(respond)
      }

      const { body, type, url } = options
      // https://expressjs.com/en/4x/api.html#req
      return Mock.mock(
        respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url),
          url: url
        })
      )
    }
  }

  mocks.forEach((item) => {
    Mock.mock(new RegExp(item.url), item.type || 'get', XHR2ExpressReqWrap(item.response))
  })

  mockFunc()
}
