import Vue from 'vue'
import VueRouter from 'vue-router'

/* Layout */
import Layout from '@/layout'

Vue.use(VueRouter)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/error404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/hospital',
    component: Layout,
    redirect: '/hospital/index',
    children: [
      {
        path: 'index',
        name: 'Hospital',
        component: () => import('@/views/hospital'),
        meta: { title: 'Hospital', icon: 'hospital' }
      }
    ]
  }
]

// TODO: adjust component import
export const asyncRoutes = [
  {
    path: '/account',
    component: Layout,
    redirect: '/account/profile',
    name: 'Account',
    meta: { title: 'Account', icon: 'account', roles: ['editor', 'admin'] },
    children: [
      {
        path: 'list',
        component: () => import('@/views/account/accountList'),
        name: 'AccountList',
        meta: { title: 'Account List', icon: 'list', roles: ['admin'] }
      },
      {
        path: 'profile',
        component: () => import('@/views/account/accountProfile'),
        name: 'AccountProfile',
        meta: { title: 'Account Profile', icon: 'profile', roles: ['editor', 'admin'] }
      }
    ]
  },
  {
    path: '/department',
    component: Layout,
    redirect: '/department/index',
    children: [
      {
        path: 'index',
        name: 'Department',
        component: () => import('@/views/department'),
        meta: { title: 'Department', icon: 'department' }
      }
    ]
  },
  {
    path: '/doctor',
    component: Layout,
    redirect: '/doctor/index',
    children: [
      {
        path: 'index',
        name: 'Doctor',
        component: () => import('@/views/doctor'),
        meta: { title: 'Doctor', icon: 'doctor' }
      }
    ]
  },
  {
    path: '/patient',
    component: Layout,
    redirect: '/patient/index',
    children: [
      {
        path: 'index',
        name: 'Patient',
        component: () => import('@/views/patient'),
        meta: { title: 'Patient', icon: 'patient' }
      }
    ]
  },
  {
    path: '/workPlan',
    component: Layout,
    redirect: '/workPlan/index',
    children: [
      {
        path: 'index',
        name: 'WorkPlan',
        component: () => import('@/views/workPlan'),
        meta: { title: 'WorkPlan', icon: 'work-plan' }
      }
    ]
  },
  {
    path: '/appointment',
    component: Layout,
    redirect: '/appointment/index',
    children: [
      {
        path: 'index',
        name: 'Appointment',
        component: () => import('@/views/appointment'),
        meta: { title: 'Appointment', icon: 'appointment' }
      }
    ]
  },
  {
    path: '/record',
    component: Layout,
    redirect: '/record/index',
    children: [
      {
        path: 'index',
        name: 'Record',
        component: () => import('@/views/record'),
        meta: { title: 'Record', icon: 'record' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export const resetRouter = () => {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
