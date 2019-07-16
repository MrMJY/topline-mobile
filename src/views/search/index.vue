<!-- 搜索页面 -->
<template>
  <div class='search-article'>
    <van-nav-bar fixed>
      <form slot="title"
            action="/">
        <van-search placeholder="搜索"
                    background="#3296fa"
                    input-align="center"
                    v-model="keyword"
                    show-action
                    @search="handleSearch(keyword)"
                    @cancel="$router.back()" />
      </form>
    </van-nav-bar>

    <!-- 联想列表 -->
    <van-cell-group class="suggestion-list">
      <van-cell v-for="title in suggestionList"
                :key="title"
                icon="search">
        <p slot="title"
           class="m0"
           v-html="highLight(title)"
           @click="handleSearch(title)">
        </p>
      </van-cell>
    </van-cell-group>

    <!-- 历史记录 -->
    <van-cell-group v-show="!suggestionList.length">
      <van-nav-bar left-text="历史记录"
                   class="history-list">
        <div slot="right">
          <template v-if="!isEdit">
            <van-icon name="delete"
                      @click="isEdit = true" />
          </template>
          <template v-else>
            <a @click="historyList = []">删除全部</a>&nbsp;
            <a @click="isEdit = false">完成</a>
          </template>
        </div>
      </van-nav-bar>
      <van-cell v-for="(history, index) in historyList"
                :key="history"
                :title="history"
                @click="handleSearch(history)">
        <van-icon name="cross"
                  v-show="isEdit"
                  @click="historyList.splice(index, 1)" />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getSuggestion, getUserHistory, deleteUserHistory } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'Search',
  data () {
    return {
      keyword: '',
      suggestionList: [],
      historyList: JSON.parse(window.localStorage.getItem('history')) || [],
      isEdit: false
    }
  },

  watch: {
    // 监视 keyword 的变化并做防抖处理
    keyword: debounce(async function (newText) {
      if (!newText) {
        this.suggestionList = []
        return
      }
      const data = await getSuggestion(newText)
      this.suggestionList = data.options
    }, 800),

    async historyList () {
      // 监视 history 的变化
      if (this.isLogin) {
        // 登录状态发请求
        if (this.historyList.length) {
          // 添加用户历史记录
        } else {
          // 清空用户历史记录
          const data = await deleteUserHistory()
          console.log(data)
        }
      } else {
        // 未登录修改本地历史
        window.localStorage.setItem('history', JSON.stringify(this.historyList))
      }
    }
  },

  computed: {
    isLogin () {
      return this.$isLogin()
    }
  },

  async created () {
    if (this.isLogin) {
      // 登录状态下，发送请求获取用户历史
      const data = await getUserHistory()
      this.historyList = data.keywords
    }
  },

  methods: {
    highLight (title) {
      return title.toLowerCase().split(this.keyword).join(`<span style="color:red">${this.keyword}</span>`)
    },

    // 默认值是搜索的关键字
    handleSearch (keyword = this.keyword) {
      this.suggestionList = []
      this.historyList.unshift(keyword)
      this.historyList = [...new Set(this.historyList)]
      this.$router.push({
        name: 'result',
        params: {
          keyword
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.van-search {
  padding: 4px 1px;
}
.van-search__content {
  border-radius: 17px;
}
.van-tabs /deep/ .van-tabs__wrap {
  top: 44px;
  position: fixed;
  margin-right: 20px;
}
.van-tabs /deep/ .van-tabs__content {
  margin-top: 44px;
}
.van-nav-bar__title {
  max-width: 100%;
  margin: 0;
  margin-left: 10px;
}
.van-search__action {
  color: #fff;
}
.van-search__action:active {
  background-color: transparent;
}
.van-cell {
  line-height: 20px;
}
.suggestion-list {
  margin-top: 43px;
}
.history-list {
  background-color: transparent;
  .van-nav-bar__text {
    color: #333;
  }
}
.m0 {
  margin: 0;
}
</style>
