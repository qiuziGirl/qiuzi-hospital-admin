import request from '@/utils/request'

export default {
  getDepartmentList: params => request({
    url: '/department',
    method: 'get',
    params
  }),
  updateDepartment: (id, data) => request({
    url: `/department/${id}`,
    method: 'put',
    data
  }),
  addDepartment: data => request({
    url: '/department',
    method: 'post',
    data
  }),
  deleteDepartment: id => request({
    url: `/department/${id}`,
    method: 'delete'
  })
}
