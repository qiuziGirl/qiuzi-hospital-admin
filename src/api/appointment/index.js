import request from '@/utils/request'

export default {
  getAppointmentList: params => request({
    url: '/appointment',
    method: 'get',
    params
  })
}
