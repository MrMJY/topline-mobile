<!-- MoreAction -->
<template>
  <div class='more-action'>
    <van-dialog :value="value"
                @input="handleHidden"
                :showConfirmButton="false"
                closeOnClickOverlay>
      <van-cell-group>
        <template v-if="!isShow">
          <van-cell title="不感兴趣" />
          <van-cell title="反馈垃圾内容"
                    is-link
                    @click="isShow = true" />
          <van-cell title="拉黑作者" />
        </template>
        <template v-else>
          <van-cell title="拉黑作者" />
          <van-cell title="拉黑作者" />
          <van-cell title="拉黑作者" />
          <van-cell title="拉黑作者" />
          <van-cell title="拉黑作者" />
          <van-cell title="拉黑作者" />
          <van-cell title="拉黑作者" />
          <van-cell title="拉黑作者" />
        </template>
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>

export default {
  name: 'MoreAction',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    handleHidden ($event) {
      this.$emit('input', $event)
      this.isShow = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>
