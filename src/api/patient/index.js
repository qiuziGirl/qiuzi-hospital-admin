import request from '@/utils/request'

export default {
  getPatientList: params => request({
    url: '/patient',
    method: 'get',
    params
  }),
  updatePatient: (id, data) => request({
    url: `/patient/${id}`,
    method: 'put',
    data
  }),
  addPatient: data => request({
    url: '/patient',
    method: 'post',
    data
  }),
  deletePatient: id => request({
    url: `/patient/${id}`,
    method: 'delete'
  })
}
