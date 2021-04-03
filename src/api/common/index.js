import request from '@/utils/request'

export default {
  login: data => request({
    url: '/admin/login',
    method: 'post',
    data
  }),
  getInfo: params => request({
    url: '/admin/info',
    method: 'get',
    params
  }),
  logout: () => request({
    url: '/admin/logout',
    method: 'post'
  })
}
