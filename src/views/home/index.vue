<!-- home 组件 -->
<template>
  <div class='home-wrap'>
    <header>
      <van-search placeholder="搜索"
                  background="#5babfb"
                  input-align="center"
                  v-model="value" />
    </header>
    <footer>
      <van-tabbar v-model="active">
        <van-tabbar-item icon="home">
          <span>首页</span>
          <i slot="icon"
             class="iconfont icon-home f20"></i>
        </van-tabbar-item>
        <van-tabbar-item icon="search">
          <span>问答</span>
          <i slot="icon"
             class="iconfont icon-i-message f20"></i>
        </van-tabbar-item>
        <van-tabbar-item icon="friends-o">
          <span>视频</span>
          <i slot="icon"
             class="iconfont icon-video f20"></i>
        </van-tabbar-item>
        <van-tabbar-item icon="setting-o">
          <span>我的</span>
          <i slot="icon"
             class="iconfont icon-Account f20"></i>
        </van-tabbar-item>
      </van-tabbar>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      value: '',
      active: 0
    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
header {
  background-color: #3296fa;
  .van-search {
    padding: 6px 42px;
  }
}
.van-search__content {
  border-radius: 17px;
}
</style>
