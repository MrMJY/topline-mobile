// *************** 加载依赖**********************
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载 vant 组件库相关依赖
import Vant, {
  Lazyload
} from 'vant'
import Vddl from 'vddl'
import 'vant/lib/index.css'

// 加载表单验证插件
import 'amfe-flexible'
import zhCN from 'vee-validate/dist/locale/zh_CN'
import VeeValidate, {
  Validator
} from 'vee-validate'

// 加载时间格式化的相关依赖
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
import 'mobile-drag-drop/default.css'

// 加载自定义的全局样式
import './styles/index.less'

// *************  配置  *********************
// 配置 vant
Vue.use(Vant)
// 配置图片懒加载
Vue.use(Lazyload)
// 配置表单验证
Vue.use(VeeValidate, {
  // 配置改变的时候去触发校验，默认是 input
  // 配置文档：https://baianat.github.io/vee-validate/guide/events.html#changing-default-events
  events: ''
})
Validator.localize('zh_CN', zhCN)
// 配置拖拽插件
Vue.use(Vddl)
// options are optional
mobilePolyfill({
  // use this to make use of the scroll behaviour
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
})
// dragenter listener
window.addEventListener('touchmove', function () {})

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

// Promise 是一个包装异步操作的容器
Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, time)
  })
}

// 登录状态的判断
Vue.prototype.$isLogin = () => {
  const user = store.state.user
  if (!user) {
    return false
  }
  return true
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
