import Cookies from 'js-cookie'

const TokenKey = 'qiuzi_hospital_admin_token'

export const getToken = () => {
  return Cookies.get(TokenKey)
}

export const setToken = token => {
  return Cookies.set(TokenKey, token, { secure: true, sameSite: 'Lax' })
}

export const removeToken = () => {
  return Cookies.remove(TokenKey)
}
