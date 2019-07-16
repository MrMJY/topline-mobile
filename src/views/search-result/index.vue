<!-- search-result -->
<template>
  <div class='search-result'>
    <van-nav-bar fixed
                 title="搜索结果">
      <van-icon name="arrow-left"
                slot="left"
                @click="$router.back()" />
    </van-nav-bar>
    <van-list class="result-list"
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad">
      <van-cell v-for="item in resultList"
                :key="item.art_id + ''"
                :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { searchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      resultList: [],
      loading: false,
      finished: false,
      page: 1
    }
  },

  async created () {
    const data = await searchResult({
      page: this.page++,
      q: this.$route.params.keyword
    })
    this.resultList = data.results
    this.loading = false
    if (!data.results.length) {
      this.finished = true
    }
  },

  // 失去激活时触发（可以重复执行）
  deactivated () {
    // 销毁组件，禁止缓存
    this.$destroy()
  },

  methods: {
    async onLoad () {
      await this.$sleep(800)
      const data = await searchResult({
        page: this.page++,
        q: this.$route.params.keyword
      })
      this.resultList.push(...data.results)
      this.loading = false
      if (!data.results.length) {
        this.finished = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
.van-icon {
  color: #fff;
}
.result-list {
  margin-top: 43px;
}
</style>
