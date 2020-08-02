import Cookies from 'js-cookie'
import Constant from '../constants/App'

const TokenKey = Constant.APP_COOKIE_NAME

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
