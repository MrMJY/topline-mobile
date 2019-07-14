<!-- home-channels -->
<template>
  <div class='home-channels'>
    <van-popup :value="value"
               @input="$emit('input', $event)"
               position="bottom"
               :round="true"
               :style="{ height: '95%' }">
      <van-grid :column-num="4">
        <div class="my-channles">
          <span>我的频道</span>
          <van-button size="mini"
                      @click="isEdit = !isEdit">
            {{ isEdit ? '完成' : '编辑'}}
          </van-button>
        </div>
        <vddl-list class="panel__body--list"
                   :list="userChannels"
                   :allowed-types="['itemType']"
                   :horizontal="true">
          <vddl-draggable class="panel__body--item"
                          v-for="(item, index) in userChannels"
                          :key="item.id"
                          :draggable="item"
                          :index="index"
                          :type="'itemType'"
                          :wrapper="userChannels"
                          effect-allowed="copy">
            <span class="drag-text"
                  :class="{ red:activeItem === index && !isEdit }">
              {{ item.name }}
              <van-icon v-show="isEdit && item.id !== 0"
                        name="close" />
            </span>
          </vddl-draggable>
          <vddl-placeholder> </vddl-placeholder>
        </vddl-list>
        <!-- <van-grid-item v-for="(item, index) in userChannels"
                       :key="item.id"
                       @click="handleDeleteChannels(item, index)">
          <span class="text"
                :class="{ red:activeItem === index && !isEdit }">
            {{ item.name }}
            <van-icon v-show="isEdit && item.id !== 0"
                      name="close" />
          </span>
        </van-grid-item> -->
        <div class="all-channles">
          <span>频道推荐</span>
        </div>
        <van-grid-item v-for="item in filterChannels"
                       :key="item.id"
                       @click="handleAddChannels(item)">
          <span class="text">{{ item.name }}</span>
        </van-grid-item>
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
import { getAllChannels, resetAllChannels } from '@/api/channels'

export default {
  name: 'HomeChannels',
  data () {
    return {
      allChannels: [],
      isEdit: false,
      user: this.$store.state.user,
      lists: [
        {
          id: 1,
          label: 'Item A1'
        },
        {
          id: 2,
          label: 'Item A2'
        },
        {
          id: 3,
          label: 'Item A3'
        },
        {
          id: 4,
          label: 'Item A4'
        },
        {
          id: 5,
          label: 'Item A5'
        },
        {
          id: 6,
          label: 'Item A6'
        }
      ]
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userChannels: {
      type: Array,
      default: () => []
    },
    activeItem: {
      type: Number,
      default: 0
    }
  },
  computed: {
    filterChannels () {
      const userChannelsId = this.userChannels.map(item => item.id)
      return this.allChannels.filter(item => !userChannelsId.includes(item.id))
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    },

    handleDeleteChannels (item, index) {
      if (this.isEdit) {
        // 删除指定的频道
        if (item.id !== 0) {
          this.userChannels.splice(index, 1)
        }
        // 登录状态
        if (this.user) {
          const data = this.userChannels.map((item, index) => {
            return {
              id: item.id,
              seq: index
            }
          })
          console.log(data)
          resetAllChannels(data)
          return 1
        }
        window.localStorage.setItem('local-channels', JSON.stringify(this.userChannels))
      }
      this.$emit('update:activeItem', index)
    },

    handleAddChannels (item) {
      // 保持相同的数据结构
      item.slideDownLoading = false // 下拉加载
      item.slideUpLoading = false // 上拉加载
      item.finished = false // 是否加载完成
      item.articles = [] // 当前频道的文章内容
      item.timestamp = Date.now()
      // 添加频道
      this.userChannels.push(item)
      this.$emit('update:userChannels', this.userChannels)

      // 登录状态
      if (this.user) {
        console.log('login call')
        const data = this.userChannels.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        console.log(data)
        resetAllChannels(data)
        return 1
      }
      window.localStorage.setItem('local-channels', JSON.stringify(this.userChannels))
    }
  }
}
</script>
<style lang="less" scoped>
.my-channles,
.all-channles {
  width: 100%;
  padding: 6px 10px;
  font-size: 16px;
  .van-button--mini {
    font-size: 12px;
    line-height: 16px;
    min-width: 46px;
    border-radius: 11px;
    border: 1px solid #f96e6e;
    color: #f96e6e;
    float: right;
    margin-top: 2px;
  }
}
.van-icon {
  position: absolute;
  background-color: transparent;
  top: -8px;
}
.van-grid-item {
  padding: 11px 10px;
}
.van-grid-item /deep/ .van-grid-item__content {
  padding: 6px 5px;
  border-radius: 5px;
  background-color: #eee;
}
.van-grid-item /deep/ .van-grid-item__content::after {
  border: 0;
}
.text {
  font-size: 12px;
}
.drag-text {
  display: block;
  font-size: 12px;
  height: 100%;
  text-align: center;
  line-height: 27px;
  background-color: #eee;
  border-radius: 5px;
}
.red {
  color: #f96e6e;
}
.vddl-list,
.vddl-draggable {
  position: relative;
}
.vddl-list {
  min-height: 44px;
  width: 100%;
}
.vddl-dragging {
  opacity: 0.7;
}
.vddl-dragging-source {
  display: none;
}
.panel__body--item {
  display: inline-block;
  height: 31px;
  line-height: 31px;
  box-sizing: border-box;
  width: 25%;
  padding: 2px 9px;
}
</style>
