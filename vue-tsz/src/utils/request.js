import axios from 'axios'
import store from '@/store'
import {MessageBox, Message} from 'element-ui'
import App from '@/constants/App'

const service = axios.create({
  baseURL: App.SERVER_URL,
  timeout: 5000
})

// request interceptor
service.interceptors.request.use(
  config => {
    //do something before request sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = store.getters.token
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

const confirmObject = {
  text: 'You have been logged out, you can cancel to stay on this page, or log in again',
  title: 'Confirm loginout',
  confirmButtonText: 'Re-Login',
  cancelButtonText: 'Cancel'
}
const confirmText = 'You have been logged out, you can cancel to stay on this page, or log in again'

//response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // something api server defined return code
      if (res.code === 500001) { // Invalid token
        MessageBox.confirm(confirmObject.text, confirmObject.title, {
          confirmButtonText: confirmObject.confirmButtonText,
          cancelButtonText: confirmObject.cancelButtonText,
          type: 'Warning'
        }).then(() => {
          // reset token action
          location.reload()
        })
      }
      return new Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }

  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service