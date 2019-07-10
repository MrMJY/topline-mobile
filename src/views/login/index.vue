<!-- login 组件 -->
<template>
  <div class='login-wrap'>
    <van-nav-bar class="login-title"
                 title="登录" />
    <form>
      <van-cell-group>
        <van-field v-model="user.mobile"
                   left-icon="contact"
                   placeholder="请输入手机号" />

        <van-field v-model="user.code"
                   class="code"
                   left-icon="eye-o"
                   placeholder="请输入短信验证码">
          <van-button slot="button"
                      size="small"
                      type="default">发送验证码</van-button>
        </van-field>
      </van-cell-group>
    </form>
    <div class="login">
      <van-button type="info"
                  size="normal"
                  :loading="loading"
                  loading-text="登录"
                  @click.prevent="handleLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '17866637565',
        code: '123456'
      },
      loading: false
    }
  },
  methods: {
    async handleLogin () {
      this.loading = true
      const res = await axios({
        method: 'POST',
        url: 'http://toutiao.course.itcast.cn/app/v1_0/authorizations',
        data: this.user
      })
      try {
        this.loading = false
        window.sessionStorage.setItem('user-info', JSON.stringify(res.data.data))
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.login-wrap {
  background-color: #f5f7f9;
  form {
    background-color: #fff;
    padding: 0 15px;
    .van-field {
      padding-left: 0;
      padding-right: 0;
    }
    .van-hairline--top-bottom::after {
      border: 0;
    }
    .van-cell:not(:last-child)::after {
      left: 0;
      border-bottom-color: #eee;
    }
    .van-button--default {
      border-radius: 23px;
    }
  }
}
.code /deep/ .van-field__control {
  border-right: 1px solid #eee;
}
.login {
  background-color: #fff;
  padding: 0 16px;
  .van-button {
    width: 100%;
    border-radius: 5px;
  }
}
</style>
