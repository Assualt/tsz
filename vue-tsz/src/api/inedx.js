import axios from 'axios'
import store from '../store/index'


const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})


// request interceptor

service.interceptors.request.use(
  config=>{
    

  }
)