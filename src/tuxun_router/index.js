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
    path: '/',
    component: () => import('@/views/tuxun/TXNewHome'),
    meta: { title: '首页'},
    hidden: true
  },
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
  {
    path: '/maps',
    component: () => import('@/views/tuxun/maps'),
    meta: { title: '重定向'},
    hidden: true
  },
  {
    path: '/solo_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻邀请PK',
    meta: { title: '图寻邀请PK'},
    hidden: true
  },
  {
    path: '/team_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻邀请PK',
    meta: { title: '图寻邀请PK'},
    hidden: true
  },
  {
    path: '/random',
    component: () => import('@/views/tuxun/RandomStreetView'),
    name: '图寻首页',
    meta: { title: '图寻首页'},
    hidden: true
  },
  {
    path: '/daily_challenge',
    component: () => import('@/views/tuxun/DailyChallenge'),
    name: '图寻每日挑战',
    meta: { title: '图寻每日挑战'},
    hidden: true
  },
  {
    path: '/challenge',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻挑战',
    meta: { title: '图寻挑战'},
    hidden: true
  },
  {
    path: '/guoqing',
    component: () => import('@/views/tuxun/TuxunGuoQing'),
    name: '图寻国庆活动',
    meta: { title: '图寻国庆活动'},
    hidden: true
  },
  {
    path: '/guoqing_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻国庆活动',
    meta: { title: '图寻国庆活动'},
    hidden: true
  },  {
    path: '/streak_game',
    component: () => import('@/views/tuxun/TXInvitor'),
    name: '图寻连胜',
    meta: { title: '图寻连胜'},
    hidden: true
  },
  {
    path: '/main_game',
    component: () => import('@/views/tuxun/TXHome'),
    name: '图寻',
    meta: { title: '图寻'},
    hidden: true
  },
  {
    path: '/rank',
    component: () => import('@/views/tuxun/rank'),
    name: 'rank',
    meta: { title: 'rank'},
    hidden: true
  },
  {
    path: '/streak',
    component: () => import('@/views/tuxun/TXStreak'),
    name: '图寻首页',
    meta: { title: '图寻首页'},
    hidden: true
  },
  {
    path: '/publicity',
    component: () => import('@/views/tuxun/publicity'),
    name: '外宣',
    meta: { title: '直播/视频/教程'},
    hidden: true
  },
  {
    path: '/user/:id',
    component: () => import('@/views/tuxun/profile'),
    name: 'tuxunProfile',
    meta: { title: '',keepAlive: true,},
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
