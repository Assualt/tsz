import axios from 'axios'

export const ApiUrl = 'http://localhost:8088/api/'

class ApiClient {
  private static instance: ApiClient
  private axiosInstance
  private constructor(baseUrl: string, timeOut: number = 1000) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: timeOut,
      headers: {
        'Content-Type': 'application/json',
      }
    })
    this.configAxios()
  }

  private configAxios() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (response.status === 200) {
          return response.data
        } else {
          return Promise.reject(new Error('request Error'))
        }
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(ApiUrl)
    }

    return ApiClient.instance
  }

  public get(url: string, params?: any) {
    return this.axiosInstance.get(url, params)
  }

  public post(url: string, data?: any) {
    return this.axiosInstance.post(url, data)
  }

  public result(code: Number, message: string, data?: any) {
    return {
      status: code,
      message: message,
      data: data
    }
  }
}

export const api = ApiClient.getInstance()
