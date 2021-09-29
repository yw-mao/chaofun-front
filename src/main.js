import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import { 
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Cascader,
  Checkbox,
  CheckboxGroup,
  Col,
  ColorPicker,
  Dialog
  as
  ElDialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Form,
  FormItem,
  Icon,
  Input,Menu,
  Loading,
  Option,
  Pagination,
  Progress,
  Popover,
  Radio,
  RadioGroup,
  Row,
  Select,
  Submenu,
  Switch,
  Table,
  Tabs,
  TabPane,
  Tag,
  TableColumn,
  Upload
} from 'element-ui';
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'



Vue.prototype.$EventBus = new Vue();

if (process.env.NODE_ENV === 'development') {
  const VConsole = require('vconsole');
  new VConsole();
}

import Viewer from 'v-viewer'
import './assets/css/viewer.css'
Vue.use(Viewer)
Viewer.setDefaults({
  zIndexInline: 9999,
  // 'inline': false,
  // 'button': true, //右上角按钮
  // "navbar": true, //底部缩略图
  // "title": false, //当前图片标题
  // "toolbar": true, //底部工具栏
  // "tooltip": true, //显示缩放百分比
  // "movable": true, //是否可以移动
  // "zoomable": true, //是否可以缩放
  // "rotatable": true, //是否可旋转
  // "scalable": false, //是否可翻转
  // "transition": true, //使用 CSS3 过度
  // "fullscreen": false, //播放时是否全屏
  // "keyboard": true, //是否支持键盘
  "url": "data-source",
})

import VueScroller from 'vue-scroller'
Vue.use(VueScroller)

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import * as filters from './filters' // global filters
import i18n from './lang'
// const {version} = require('./utils/version')


// Vue.prototype.$close = close

import mixins from './mixins/mixins';
Vue.mixin(mixins);

import jquery from 'jquery'
Vue.prototype.$ = jquery

import {
  Toast,Dialog,Cell,NumberKeyboard,Field,Popup
} from 'vant';
import 'vant/lib/index.css';
Vue.use(Toast).use(Dialog).use(Cell).use(NumberKeyboard).use(Field).use(Popup);

if (process.env.NODE_ENV === 'production') {
}

// Moment.js 设置默认中文
import moment from 'moment';
moment.locale('zh-cn');

// Element 按需加载
Vue.prototype.$ELEMENT = {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
};
Vue.use(Badge);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Button);
Vue.use(Cascader);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Col);
Vue.use(ColorPicker);
Vue.use(ElDialog);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Icon);
Vue.use(Input,Menu);
Vue.use(Option);
Vue.use(Pagination);
Vue.use(Progress);
Vue.use(Popover);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Row);
Vue.use(Select);
Vue.use(Submenu);
Vue.use(Switch);
Vue.use(Tabs);
Vue.use(Table);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(TableColumn);
Vue.use(Upload);
Vue.use(Loading.directive);
// Vue.use(Element, {
//   size: Cookies.get('size') || 'medium', // set element-ui default size
//   i18n: (key, value) => i18n.t(key, value)
// })

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 版本检查
// version()

Vue.config.productionTip = false

// 加入百度统计
router.beforeEach((to, from, next) => {
  
  if (to.path) {
    if (window._hmt) {
      window._hmt.push(['_trackPageview', to.fullPath])
    }
  }
  console.log('路由切换')
  if(to.path!='/lists'){
    // console.log('aaa')
    store.state.settings.leftNav = 'normal';
    // console.log('aaa',store.state.settings.leftNav)
  }
  // if(to.meta.keepAlive&&!from.path.includes('/p/')){
  //   to.meta.keepAlive = false;
  // }else if(from.path.includes('/p/')&&(to.path.includes('/f/')||to.path.includes('/all')||to.path.includes('/f/'))){

  // }
  next()
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
