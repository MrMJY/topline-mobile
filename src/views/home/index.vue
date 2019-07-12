<!-- home 组件 -->
<template>
  <div class='home-wrap'>
    <van-nav-bar fixed>
      <van-search slot="title"
                  placeholder="搜索"
                  background="#3296fa"
                  input-align="center"
                  v-model="value" />
    </van-nav-bar>
    <van-tabs v-model="activeIndex">
      <van-tab v-for="item in channels"
               :key="item.id"
               :title="item.name">
        <van-pull-refresh v-model="activeChannel.slideDownLoading"
                          @refresh="onRefresh">
          <van-list v-model="activeChannel.sildeUpLoading"
                    :finished="activeChannel.finished"
                    finished-text="没有更多了"
                    @load="onLoad">
            <van-cell v-for="article in activeChannel.articles"
                      :key="article.title"
                      :title="article.title" />
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getChannels, getVisitorArticles } from '@/api/articles'
export default {
  name: 'Home',
  data () {
    return {
      value: '',
      activeIndex: 0,
      channels: []
    }
  },
  created () {
    this.loadChannels()
  },
  computed: {
    activeChannel () {
      return this.channels[this.activeIndex]
    }
  },
  methods: {
    async onLoad () {
      await this.$sleep(800)
      const data = await getVisitorArticles({
        channelId: this.activeChannel.id,
        timestamp: this.activeChannel.timestamp,
        withTop: 1
      })
      this.activeChannel.timestamp = data.pre_timestamp
      if (!data.results.length) {
        this.onLoad()
      } else {
        this.activeChannel.articles.push(...data.results)
        this.activeChannel.sildeUpLoading = false
      }
    },

    onRefresh () {
      console.log('refrsh called')
    },

    async requestChannels () {
      const data = await getChannels()
      data.channels.forEach(item => {
        item.slideDownLoading = false // 下拉加载
        item.slideUpLoading = false // 上拉加载
        item.finished = false // 是否加载完成
        item.articles = [] // 当前频道的文章内容
        item.timestamp = Date.now()
      })
      this.channels = data.channels
    },

    async loadChannels () {
      const user = this.$store.state.user
      if (user) {
        // 如果是登录状态，发送请求请求用户的频道列表
        await this.requestChannels()
      } else {
        // 如果未登录则读取本地的频道列表
        // 不着急 JSON.parse 因为如果没有转换会报错
        const localChannels = window.localStorage.getItem('local-channels')
        if (localChannels) {
          this.channels = JSON.parse(localChannels)
        } else {
          // 如果本地没有则请求，并把结果存储到本地
          await this.requestChannels()
          console.log(this.channels)
          window.localStorage.setItem('local-channels', JSON.stringify(this.channels))
        }
      }
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
}
.van-tabs /deep/ .van-tabs__content {
  margin-top: 44px;
}
</style>
