/* eslint-disable */
import Vue from 'vue'
import mapsSearchEl from './mapsSearch.vue';

const NoticeConstructor = Vue.extend(mapsSearchEl)

const mapsSearch = (option = {}) => { // 对外调用的方法
  const Instance = new NoticeConstructor({
    data: { // 传入组件的data
    //   content: option.text,
    //   duration: option.time || 1500
      callBack: option.callBack
    }
  })
  // console.log('Instance:', Instance)
  Instance.vm = Instance.$mount() // 挂载
  // console.log('mounted', Instance.vm.$el)
  Instance.vm.show = true
  document.body.appendChild(Instance.vm.$el) // 插入到body
}
export default mapsSearch

// 直接挂到vue上
// export default {
//   install: (Vue) => {
//     Vue.prototype.$login = login
//   }
// }
