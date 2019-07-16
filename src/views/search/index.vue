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
                    @cancel="$router.back()" />
      </form>
    </van-nav-bar>

    <!-- 联想列表 -->
    <van-cell-group class="suggestion-list">
      <van-cell v-for="title in suggestionList"
                :key="title"
                :title="title"
                icon="search" />
    </van-cell-group>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'Search',
  data () {
    return {
      keyword: '',
      suggestionList: []
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
    }, 800)
  },

  methods: {

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
</style>
