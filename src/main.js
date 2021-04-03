import Vue from 'vue'
import App from './App.vue'
import '@/vendor' // 引入全局第三方插件库
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control
import '@/components' // globally import component

import '@/assets/style/index.scss' // global css

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
