let routes = [];
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
    component: () => import('@/views/chaofun-webview/forum/setting'),
    name: 'forumseting',
    meta: { title: 'forumseting'},
    hidden: true
  },
  {
    path: '/webview/forum/mod_manager',
    component: () => import('@/views/chaofun-webview/forum/ModManager'),
    name: 'mod_manager',
    meta: { title: '版主管理'},
    hidden: true
  },
  {
    path: '/webview/forum/analytics',
    component: () => import('@/views/chaofun-webview/forum/analytics'),
    name: 'forumanalytics',
    meta: { title: 'forumanalytics'},
    hidden: true
  },
  {
    path: '/webview/forum/tag',
    component: () => import('@/views/chaofun-webview/forum/tag'),
    name: 'forumtag',
    meta: { title: 'forumtag'},
    hidden: true
  },
  {
    path: '/webview/forum/userTag',
    component: () => import('@/views/chaofun-webview/forum/userTag'),
    name: 'forumUsertag',
    meta: { title: 'forumUsertag'},
    hidden: true
  },
  {
    path: '/webview/thx',
    component: () => import('@/views/chaofun-webview/thx/thx'),
    name: 'forumthx',
    meta: { title: 'forumthx'},
    hidden: true
  },
  {
    path: '/webview/forum/notify',
    component: () => import('@/views/chaofun-webview/forum/notify'),
    name: 'forumnotify',
    meta: { title: 'forumnotify'},
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
    path: '/webview/prediction/rank',
    component: () => import('@/views/chaofun-webview/prediction/rank'),
    name: 'prediction_rank',
    meta: { title: '竞猜活动'},
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
    path: '/webview/forumIntro',
    component: () => import('@/views/activity/help/forumIntro'),
    name: 'webViewForumIntro',
    meta: { title: '版主介绍'},
    hidden: true
  },
  {
    path: '/webview/agreement',
    component: () => import('@/views/chaofun-webview/agreement/agreement'),
    name: 'webViewForumIntro',
    meta: { title: '炒饭隐私政策'},
    hidden: true
  },
  {
    path: '/webview/useragree',
    component: () => import('@/views/chaofun-webview/agreement/useragree'),
    name: 'webViewForumIntro',
    meta: { title: '炒饭用户协议'},
    hidden: true
  },
]

export default  routes;
