import Vue from 'vue'
import Vuex from 'vuex'
import * as user from '@/utils/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 初始化的时候从本地存储获取数据，防止刷新丢失 token
    user: user.getUser()
  },
  mutations: {
    // 登录成功，调用 mutation 更新容器中的 user 的状态
    setUser (state, data) {
      // 更新 store.user
      state.user = data
      // 更新本地存储
      user.saveUser(data)
    }
  },
  actions: {

  }
})
