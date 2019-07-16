<!-- search-result -->
<template>
  <div class='search-result'>
    <van-nav-bar fixed
                 title="搜索结果">
      <van-icon name="arrow-left"
                class="back"
                slot="left"
                @click="$router.back()" />
    </van-nav-bar>
    <van-list class="result-list"
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad">
      <van-cell v-for="article in resultList"
                :key="article.art_id + ''">
        <p class="p-m0">{{ article.title }}</p>
        <template v-if="article.cover.type">
          <van-grid :border="false"
                    :column-num="3">
            <van-grid-item v-for="(image, index) in article.cover.images"
                           :key="index">
              <van-image :src="image"
                         :fit="'cover'"
                         lazy-load />
            </van-grid-item>
          </van-grid>
        </template>
        <p class="p-m0">
          <span v-if="article.is_top"
                class="red">置顶&nbsp;</span>
          <span class="gray">{{ article.aut_name }}</span>&nbsp;
          <span class="gray">{{ article.comm_count }}评论</span>&nbsp;
          <span class="gray">{{ article.pubdate | dateFormat }}</span>
          <van-icon class="close"
                    name="close"
                    @click="handleShowMoreAction(article)" />
        </p>
        <van-grid :column-num="3"
                  :border="false">
          <van-grid-item class="f12"
                         slot="default">
            <van-icon class="f20"
                      name="comment-o" />
            评论
          </van-grid-item>
          <van-grid-item class="f12"
                         slot="default">
            <van-icon class="f20"
                      name="thumb-circle-o" />
            点赞
          </van-grid-item>
          <van-grid-item class="f12"
                         slot="default">
            <van-icon class="f20"
                      name="star-o" />
            收藏
          </van-grid-item>
        </van-grid>
      </van-cell>
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
.back {
  color: #fff;
}
.result-list {
  margin-top: 43px;
}
.p-m0 {
  margin: 0;
  span {
    font-size: 12px;
  }
}
.gray {
  color: #b4b4b4;
}
.red {
  color: #e22829;
}
.close {
  float: right;
  font-size: 16px;
  margin-top: 4px;
}
.f12 /deep/ .van-grid-item__content {
  padding: 0 10px;
}
.f12 {
  font-size: 12px;
}
.f20 {
  font-size: 20px;
}
</style>
