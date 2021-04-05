import request from '@/utils/request'

export default {
  getRecordList: params => request({
    url: '/record',
    method: 'get',
    params
  })
}
