<!-- tabbar组件 -->
<template>
  <div class='home-tabbar'>
    <keep-alive>
      <router-view />
    </keep-alive>
    <footer>
      <van-tabbar route>
        <van-tabbar-item icon="home"
                         to="/">
          <span>首页</span>
          <i slot="icon"
             class="iconfont icon-home f20"></i>
        </van-tabbar-item>
        <van-tabbar-item icon="search"
                         to="qa">
          <span>问答</span>
          <i slot="icon"
             class="iconfont icon-i-message f20"></i>
        </van-tabbar-item>
        <van-tabbar-item icon="friends-o"
                         to="video">
          <span>视频</span>
          <i slot="icon"
             class="iconfont icon-video f20"></i>
        </van-tabbar-item>
        <van-tabbar-item icon="setting-o"
                         to="my">
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
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
footer {
  height: 50px;
}
</style>
