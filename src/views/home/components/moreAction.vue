<!-- MoreAction -->
<template>
  <div class='more-action'>
    <van-dialog :value="value"
                @input="handleHidden"
                :showConfirmButton="false"
                closeOnClickOverlay>
      <van-cell-group>
        <template v-if="!isShow">
          <van-cell title="不感兴趣"
                    @click="handleDislikeArticle" />
          <van-cell title="反馈垃圾内容"
                    is-link
                    @click="isShow = true" />
          <van-cell title="拉黑作者"
                    @click="handleAddBlackList" />
        </template>
        <template v-else>
          <van-cell>
            <van-icon slot="right-icon"
                      name="arrow-left"
                      @click="isShow = false"
                      style="line-height: inherit;" />
          </van-cell>
          <van-cell v-for="item in reportsType"
                    :key="item.value"
                    :title="item.label"
                    @click="handleReportArticle(item.value)" />
        </template>
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
import { dislikeArticles, reportArticles } from '@/api/articles'
import { addBlackList } from '@/api/user'
export default {
  name: 'MoreAction',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    currentArticle: {
      type: Object
    }
  },
  data () {
    return {
      isShow: false,
      reportsType: [
        {
          label: '标题夸张',
          value: 1
        },
        {
          label: '低俗色情',
          value: 2
        },
        {
          label: '错别字多',
          value: 3
        },
        {
          label: '旧闻重复',
          value: 4
        },
        {
          label: '广告软文',
          value: 5
        },
        {
          label: '内容不实',
          value: 6
        },
        {
          label: '涉嫌违法犯罪',
          value: 7
        },
        {
          label: '侵权',
          value: 8
        },
        {
          label: '其他问题',
          value: 0
        }
      ]
    }
  },
  methods: {
    handleHidden ($event) {
      this.$emit('input', $event)
      this.isShow = false
    },

    async handleDislikeArticle () {
      if (!this.$isLogin()) {
        this.$toast('登录后可操作')
        return
      }
      try {
        await dislikeArticles(this.currentArticle.art_id)
        this.$toast('操作成功')
      } catch (err) {
        console.log(err)
        this.$toast('操作失败')
      }
      this.handleHidden()
    },

    handleAddBlackList () {
      if (!this.$isLogin()) {
        this.$toast('登录后可操作')
        return
      }
      try {
        addBlackList(this.currentArticle.aut_id)
        this.$toast('拉黑成功')
      } catch (err) {
        console.log(err)
        this.$toast('操作失败')
      }
      this.handleHidden()
    },

    handleReportArticle (type) {
      if (!this.$isLogin()) {
        this.$toast('登录后可操作')
        return
      }
      if (type === 0) {
        this.$toast('此功能还未开发')
        return
      }
      try {
        reportArticles({
          target: this.currentArticle.art_id,
          type
        })
        this.$toast('举报成功')
      } catch (err) {
        console.log(err)
        this.$toast('举报失败')
      }
      this.handleHidden()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
