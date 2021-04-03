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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
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
        component: () => import('@/views/hospital/index'),
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
    meta: { title: 'Account', icon: 'account', roles: ['editor', 'admin'] }
    // children: [
    //   {
    //     path: 'list',
    //     component: () => import('@/views/account/list/index'),
    //     name: 'AccountList',
    //     meta: { title: 'Account List', icon: 'list', roles: ['admin'] }
    //   },
    //   {
    //     path: 'profile',
    //     component: () => import('@/views/account/profile/index'),
    //     name: 'AccountProfile',
    //     meta: { title: 'Account Profile', icon: 'profile', roles: ['editor', 'admin'] }
    //   }
    // ]
  },
  {
    path: '/department',
    component: Layout,
    redirect: '/department/index',
    children: [
      {
        path: 'index',
        name: 'Department',
        component: () => import('@/views/department/index'),
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
        component: () => import('@/views/doctor/index'),
        meta: { title: 'Doctor', icon: 'doctor' }
      }
    ]
  }
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
