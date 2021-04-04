import request from '@/utils/request'

export default {
  getWorkPlanList: params => request({
    url: '/work-plan',
    method: 'get',
    params
  }),
  updateWorkPlan: (id, data) => request({
    url: `/work-plan/${id}`,
    method: 'put',
    data
  }),
  addWorkPlan: data => request({
    url: '/work-plan',
    method: 'post',
    data
  }),
  deleteWorkPlan: id => request({
    url: `/work-plan/${id}`,
    method: 'delete'
  })
}
