import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, {
  Lazyload
} from 'vant'
import Vddl from 'vddl'
import 'amfe-flexible'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 支持移动端拖拽的插件
import {
  polyfill as mobilePolyfill
} from 'mobile-drag-drop'
// optional import of scroll behaviour
import {
  scrollBehaviourDragImageTranslateOverride
} from 'mobile-drag-drop/scroll-behaviour'
import 'vant/lib/index.css'
import './styles/index.less'
import 'mobile-drag-drop/default.css'

import zhCN from 'vee-validate/dist/locale/zh_CN'
import VeeValidate, {
  Validator
} from 'vee-validate'
Vue.use(Vant)
Vue.use(Lazyload)
Vue.use(VeeValidate, {
  // 配置改变的时候去触发校验，默认是 input
  // 配置文档：https://baianat.github.io/vee-validate/guide/events.html#changing-default-events
  events: ''
})
Vue.use(Vddl)

Validator.localize('zh_CN', zhCN)

// 时间格式化配置
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
// 创建一个全局的时间格式化过滤器
Vue.filter('dateFormat', function (value) {
  if (!value) {
    return ''
  }
  return dayjs().from(value)
})

Vue.config.productionTip = false

// options are optional
mobilePolyfill({
  // use this to make use of the scroll behaviour
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
})
// dragenter listener
window.addEventListener('touchmove', function () {})

// Promise 是一个包装异步操作的容器
Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
