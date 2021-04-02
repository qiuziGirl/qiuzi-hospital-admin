import request from '@/utils/request'

export default {
  getDoctorList: params => request({
    url: '/doctor',
    method: 'get',
    params
  }),
  updateDoctor: (id, data) => request({
    url: `/doctor/${id}`,
    method: 'put',
    data
  }),
  addDoctor: data => request({
    url: '/doctor',
    method: 'post',
    data
  }),
  deleteDoctor: id => request({
    url: `/doctor/${id}`,
    method: 'delete'
  })
}
