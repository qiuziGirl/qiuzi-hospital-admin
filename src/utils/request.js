import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { Message, MessageBox } from 'element-ui'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true,
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = 'Bearer ' + getToken()
    }

    return config
  },
  error => {
    return Promise.reject(new Error(error))
  }
)

service.interceptors.response.use(
  response => {
    const result = response.data

    if (result.code !== 0) {
      Message({
        message: result.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      if (result.code === 50008 || result.code === 50012 || result.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(result.message || 'Error'))
    }

    return result.data
  },
  // TODO: 待优化
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

/**
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<any>}
 */
// const fetch = (url, options = {}) => {
//   const { suburl, ...params } = options
//   const requestHeaders = options.headers ?? { 'content-type': 'application/json' }

//   return new Promise((resolve, reject) => {
//     service({
//       ...params,
//       url: url + (suburl || ''),
//       method: 'post',
//       headers: requestHeaders
//     }).then(data => {
//       resolve(data)
//     }).catch(error => {
//       Message.error(error.message)
//       reject(new Error(error))
//     })
//   })
// }

/**
 * Get 请求方法
 * @param {string} url
 * @param {Object} params
 * @returns {Promise<any>}
 */
// export const get = (url, params) => fetch(url, { method: 'get', params })
