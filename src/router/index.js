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
    path: '/',
    component: Layout,
    redirect: '/hospital',
    children: [
      {
        path: 'hospital',
        name: 'Hospital',
        component: () => import('@/views/hospital'),
        meta: { title: 'Hospital', icon: 'hospital' }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/account',
    component: Layout,
    redirect: '/account/list',
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
    path: '/',
    component: Layout,
    redirect: '/department',
    children: [
      {
        path: 'department',
        name: 'Department',
        component: () => import('@/views/department'),
        meta: { title: 'Department', icon: 'department' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/doctor',
    children: [
      {
        path: 'doctor',
        name: 'Doctor',
        component: () => import('@/views/doctor'),
        meta: { title: 'Doctor', icon: 'doctor' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/patient',
    children: [
      {
        path: 'patient',
        name: 'Patient',
        component: () => import('@/views/patient'),
        meta: { title: 'Patient', icon: 'patient' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/workPlan',
    children: [
      {
        path: 'workPlan',
        name: 'WorkPlan',
        component: () => import('@/views/workPlan'),
        meta: { title: 'WorkPlan', icon: 'work-plan' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/appointment',
    children: [
      {
        path: 'appointment',
        name: 'Appointment',
        component: () => import('@/views/appointment'),
        meta: { title: 'Appointment', icon: 'appointment' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/record',
    children: [
      {
        path: 'record',
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
