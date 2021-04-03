import request from '@/utils/request'

export default {
  getHospitalList: params => request({
    url: '/hospital',
    method: 'get',
    params
  }),
  updateHospital: (id, data) => request({
    url: `/hospital/${id}`,
    method: 'put',
    data
  }),
  addHospital: data => request({
    url: '/hospital',
    method: 'post',
    data
  }),
  deleteHospital: id => request({
    url: `/hospital/${id}`,
    method: 'delete'
  })
}
