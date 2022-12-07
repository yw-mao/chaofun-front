import Vue from 'vue'
import Router from 'vue-router'

// import store from '../store'
// console.log('storestorestore',store)
import * as api from '../api/api'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/wxPay',
    component: () => import('@/views/tuxun/pay'),
    meta: { title: '支付'},
    hidden: true
  },
  {
    path: '/wxRedirect',
    component: () => import('@/views/tuxun/WXRedirect'),
    meta: { title: '重定向'},
    hidden: true
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
// export const asyncRoutes = [
const asyncRoutesTest = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
export const asyncRoutes = [

]
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes],
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
