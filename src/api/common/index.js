import request from '@/utils/request'

export default {
  login: params => request({
    url: '/admin/login',
    method: 'post',
    data: params
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
