let routes = [];
if(process.env.NODE_ENV != 'production'&&process.env.VUE_APP_BASE_WEB){
  routes = [
    {
      path: '/webview/contact',
      component: () => import('@/views/chaofun-webview/contact'),
      name: 'contact',
      meta: { title: '联系我们&意见反馈'},
      hidden: true
    },
    {
      path: '/webview/buttonGame',
      component: () => import('@/views/chaofun-webview/buttonGame'),
      name: 'buttonGame',
      meta: { title: 'buttonGame'},
      hidden: true
    },
    {
      path: '/webview/forum/seting',
      component: () => import('@/views/chaofun-webview/forum/seting'),
      name: 'forumseting',
      meta: { title: 'forumseting'},
      hidden: true
    },
    {
      path: '/webview/activity/index',
      component: () => import('@/views/chaofun-webview/activity/index'),
      name: 'activityindex',
      meta: { title: 'activityindex'},
      hidden: true
    },
    {
      path: '/webview/buttonGame/rank',
      component: () => import('@/views/chaofun-webview/buttonGame/rank'),
      name: 'rank',
      meta: { title: 'rank'},
      hidden: true
    },
    {
      path: '/webview/secret',
      component: () => import('@/views/chaofun-webview/secret/index'),
      name: 'webViewSecret',
      meta: { title: 'secret'},
      hidden: true
    },
    {
      path: '/webview/userRank',
      component: () => import('@/views/chaofun-webview/activity/userRank'),
      name: 'webViewUserRank',
      meta: { title: '用户排名'},
      hidden: true
    },
    {
      path: '/webview/forumRank',
      component: () => import('@/views/chaofun-webview/activity/forumRank'),
      name: 'webViewForumRank',
      meta: { title: '板块排名'},
      hidden: true
    },
  ]
}

export default  routes;
