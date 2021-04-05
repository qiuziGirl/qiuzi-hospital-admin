import request from '@/utils/request'

export default {
  getAdminList: params => request({
    url: '/admin',
    method: 'get',
    params
  }),
  getAdmin: id => request({
    url: `admin/${id}`,
    method: 'get'
  }),
  updateAdmin: (id, data) => request({
    url: `/admin/${id}`,
    method: 'put',
    data
  }),
  addAdmin: data => request({
    url: '/admin',
    method: 'post',
    data
  }),
  deleteAdmin: id => request({
    url: `/admin/${id}`,
    method: 'delete'
  })
}
