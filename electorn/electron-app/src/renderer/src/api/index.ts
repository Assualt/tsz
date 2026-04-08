import axios from 'axios'

export const ApiUrl = '/api/v1'

class ApiClient {
  private static instance: ApiClient
  private axiosInstance
  private constructor(baseUrl: string, timeOut: number = 5000) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: timeOut,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.configAxios()
  }

  private configAxios(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('stoken')
        if (token) {
          config.headers = config.headers || {}
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (response.status === 200) {
          const resData = response
          // 处理登录响应
          if (response.config.url?.includes('/login')) {
            const data = resData.data.data
            console.log('Login response data:', data)

            // 检查token
            if (!data?.token && !data?.access_token) {
              return Promise.reject(new Error('登录失败：未获取到有效的登录信息'))
            }

            // 获取用户信息（支持user或userInfo字段）
            const userInfo = data.userInfo || data.user
            if (!userInfo) {
              return Promise.reject(new Error('登录失败：未获取到用户信息'))
            }

            // 验证用户信息完整性
            if (!userInfo.username || !userInfo.user_id) {
              console.error('Invalid user info structure:', userInfo)
              return Promise.reject(new Error('登录失败：用户信息不完整'))
            }

            // 保存登录状态
            try {
              localStorage.setItem('stoken', data.token || data.access_token)
              localStorage.setItem('userInfo', JSON.stringify(userInfo))
              console.log('Login state saved:', {
                token: data.token || data.access_token,
                userInfo: userInfo
              })
            } catch (error) {
              console.error('Failed to save login state:', error)
              return Promise.reject(new Error('登录失败：无法保存登录状态'))
            }
          }

          return resData.data
        } else {
          console.warn('Non-200 response:', response.status, response.data)
          return Promise.reject(new Error(response.data?.message || '请求错误'))
        }
      },
      (error) => {
        console.error('API Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        })

        // 处理 401 或 403 错误，跳转到登录页面
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('stoken')
          localStorage.removeItem('userInfo')
          // 跳转到登录页面
          window.location.href = '/login'
        }

        const errorMessage = error.response?.data?.message || error.message || '请求失败'
        return Promise.reject(new Error(errorMessage))
      }
    )
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(ApiUrl)
    }

    return ApiClient.instance
  }

  public get(url: string, params?: object) {
    return this.axiosInstance.get(url, params)
  }

  public post(url: string, data?: object, config?: object) {
    return this.axiosInstance.post(url, data, config)
  }

  public put(url: string, data?: object, config?: object) {
    return this.axiosInstance.put(url, data, config)
  }

  public delete(url: string, config?: object) {
    return this.axiosInstance.delete(url, config)
  }

  public result(code: number, message: string, data?: object) {
    return {
      status: code,
      message: message,
      data: data
    }
  }
}

export const api = ApiClient.getInstance()
