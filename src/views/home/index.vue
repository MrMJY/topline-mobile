<!-- home 组件 -->
<template>
  <div class='home-wrap'>
    <van-nav-bar fixed>
      <van-search slot="title"
                  placeholder="搜索"
                  background="#3296fa"
                  input-align="center"
                  disabled
                  @click="$router.push({name: 'search'})" />
    </van-nav-bar>
    <van-tabs v-model="activeIndex">
      <van-button class="nav-btn"
                  icon="wap-nav"
                  @click="isShow = true" />
      <van-tab v-for="item in channels"
               :key="item.id"
               :title="item.name">
        <van-pull-refresh v-model="activeChannel.slideDownLoading"
                          :success-text="successText"
                          @refresh="onRefresh">
          <van-list v-model="activeChannel.sildeUpLoading"
                    :finished="activeChannel.finished"
                    finished-text="没有更多了"
                    @load="onLoad">
            <van-cell v-for="article in activeChannel.articles"
                      :key="article.title">
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
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <home-channels v-model="isShow"
                   :userChannels.sync="channels"
                   :activeItem.sync="activeIndex" />
    <more-action v-model="isShowMoreAction"
                 :currentArticle="currentArticle" />
  </div>
</template>

<script>
import { getVisitorArticles } from '@/api/articles'
import { getChannels } from '@/api/channels'

export default {
  name: 'Home',
  components: {
    HomeChannels: () => import('./components/channels'),
    MoreAction: () => import('./components/moreAction')
  },
  data () {
    return {
      activeIndex: 0,
      channels: [],
      successText: '',
      isShow: false,
      isShowMoreAction: false,
      currentArticle: null
    }
  },

  watch: {
    // 监视 vuex 中的用户登录状态
    async '$store.state.user' () {
      // 重新加载频道列表
      await this.loadChannels()
      // 重新刷新加载
      this.activeChannel.slideUpLoading = true
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
      const { activeChannel } = this
      await this.$sleep(800)
      const data = await getVisitorArticles({
        channelId: activeChannel.id,
        timestamp: activeChannel.timestamp,
        withTop: 1
      })
      // 数据全部加载完毕 data.pre_timestamp 为 null 时
      if (!data.pre_timestamp) {
        activeChannel.finished = true
      }
      activeChannel.timestamp = data.pre_timestamp
      if (!data.results.length) {
        this.onLoad()
      } else {
        activeChannel.articles.push(...data.results)
        activeChannel.sildeUpLoading = false
      }
    },

    async onRefresh () {
      const { activeChannel } = this
      // 保存下一页的时间戳
      const tempTimestamp = activeChannel.timestamp
      // 设置本次请求的时间戳为当前时间
      activeChannel.timestamp = Date.now()
      await this.$sleep(800)
      const data = await getVisitorArticles({
        channelId: activeChannel.id,
        timestamp: activeChannel.timestamp,
        withTop: 1
      })
      // 如果有数据，覆盖当前频道的文章列表，并且把下一页的时间戳保存
      if (data.results.length) {
        activeChannel.articles = data.results
        activeChannel.timestamp = data.pre_timestamp
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 否则恢复原来下一页的时间戳
        activeChannel.timestamp = tempTimestamp
        this.successText = '已是最新'
      }
      // 取消下拉 loading
      activeChannel.slideDownLoading = false
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
        // 如果是登录状态，发送请求请求用户的频道列表 token 过期问题未解决
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
          window.localStorage.setItem('local-channels', JSON.stringify(this.channels))
        }
      }
    },

    handleShowMoreAction (article) {
      this.isShowMoreAction = true
      this.currentArticle = article
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
.nav-btn {
  height: 40px;
  width: 35px;
  position: fixed;
  top: 44px;
  right: -1px;
  z-index: 100;
  border: 0;
  padding: 0;
  font-size: 18px;
}
.p-m0 {
  margin: 0;
  span {
    font-size: 12px;
  }
}
.red {
  color: #e22829;
}
.gray {
  color: #b4b4b4;
}
.close {
  float: right;
  font-size: 16px;
  margin-top: 4px;
}
</style>
