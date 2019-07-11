<!-- login 组件 -->
<template>
  <div class='login-wrap'>
    <van-nav-bar class="login-title"
                 title="登录" />
    <form>
      <van-cell-group>
        <van-field v-model="user.mobile"
                   left-icon="contact"
                   name="mobile"
                   clearable
                   v-validate="'required'"
                   :error-message="errors.first('mobile')"
                   placeholder="请输入手机号" />

        <van-field v-model="user.code"
                   class="code"
                   name="code"
                   clearable
                   v-validate="'required'"
                   :error-message="errors.first('code')"
                   left-icon="eye-o"
                   type="password"
                   placeholder="请输入短信验证码">
          <van-button slot="button"
                      size="small"
                      @click.prevent="handleSendCode"
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
import { login } from '@/api/user'
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

  created () {
    this.configCustomMessages()
  },

  methods: {
    async handleLogin () {
      this.loading = true
      try {
        const valid = await this.$validator.validate()
        // 如果表单验证失败，则什么都不做
        if (valid) {
          // 表单验证通过，提交表单
          const res = await login(this.user)
          this.$store.commit('setUser', res)
          this.$router.push({
            name: 'home'
          })
        }
      } catch (err) {
        console.log(err)
        this.$toast('登录失败')
      }
      this.loading = false
    },
    handleSendCode () {
      console.log('发送短信验证码啦')
    },
    configCustomMessages () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不能为空'
          },
          code: {
            required: () => '验证码不能为空'
          }
        }
      }
      this.$validator.localize('zh_CN', dict)
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
