<template>
  <view class="mask" v-if="visible" @click="close" @touchmove.stop.prevent>
    <view class="panel" @click.stop>
      <view class="header">
        <text class="title">今日收成</text>
        <view class="close-btn" @click="close">×</view>
      </view>
      
      <!-- 核心数字展示区 -->
      <view class="yield-section">
        <view class="yield-box">
          <text class="plus">+</text>
          <text class="num">{{ state.daily.food }}</text>
          <text class="unit">g</text>
        </view>
        <text class="yield-desc">今日记录{{ state.daily.dailyRecordCount }}次，待领取收益</text>
      </view>

      <!-- 仓库进度条 -->
      <view class="storage-section">
        <view class="storage-label">
          <text>粮仓余额</text>
          <text class="storage-val">{{ state.wallet }}<text class="storage-max">/{{ state.maxWallet }}g</text></text>
        </view>
        <view class="progress-bg">
          <view class="progress-bar" :style="{ width: progressPercent + '%' }"></view>
        </view>
        <text class="storage-tip" v-if="isFull">粮仓已满，请先喂食小狗哦！</text>
      </view>

      <!-- 操作按钮 -->
      <button 
        class="btn-claim" 
        :class="{ 'disabled': state.daily.food <= 0 || isFull }"
        @click="handleClaim"
      >
        {{ btnText }}
      </button>

      <!-- 调试按钮 (仅开发环境) -->
      <!-- <view class="debug-area" style="margin-top: 20rpx; text-align: center;">
        <text style="font-size: 24rpx; color: #999; text-decoration: underline;" @click="handleReset">重置数据(测试用)</text>
      </view> -->
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useFoodSystem } from '@/composables/useFoodSystem'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'claim-success'])

const { state, claimFood, debugReset, reload } = useFoodSystem()

const progressPercent = computed(() => {
  return Math.min((state.value.wallet / state.value.maxWallet) * 100, 100)
})

const isFull = computed(() => {
  return state.value.wallet >= state.value.maxWallet
})

const btnText = computed(() => {
  if (state.value.daily.food <= 0) return '今日已领完'
  if (isFull.value) return '粮仓已满'
  return '全部领取'
})

// 监听 visible 变化，每次打开时刷新数据
import { watch } from 'vue'
watch(() => props.visible, (val) => {
  if (val) {
    reload()
  }
})


const close = () => {
  emit('update:visible', false)
}

const handleClaim = () => {
  const res = claimFood()
  if (res.success) {
    uni.showToast({
      title: res.msg,
      icon: 'none' // 使用自定义图标或none
    })
    emit('claim-success', res.amount)
    
    // 稍微延迟一下关闭，让用户看到数字变化
    setTimeout(() => {
      // close() // 可选：领取后是否自动关闭？通常保留让用户看一眼余额比较好
    }, 500)
  } else {
    uni.showToast({
      title: res.msg,
      icon: 'none'
    })
  }
}

const handleReset = () => {
  debugReset()
  uni.showToast({ title: '已重置', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.3s ease;
}

.panel {
  width: 100%;
  background-color: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 40rpx 32rpx 60rpx; // 底部留白适配 iPhone X
  box-sizing: border-box;
  animation: slideUp 0.3s ease;
  padding-bottom: calc(60rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(60rpx + env(safe-area-inset-bottom));
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  
  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  
  .close-btn {
    font-size: 48rpx;
    color: #999;
    line-height: 1;
    padding: 10rpx;
  }
}

.yield-section {
  text-align: center;
  margin-bottom: 50rpx;
  
  .yield-box {
    display: flex;
    align-items: baseline;
    justify-content: center;
    color: #FF9500; // 橙色
    margin-bottom: 16rpx;
    
    .plus {
      font-size: 40rpx;
      font-weight: bold;
      margin-right: 4rpx;
    }
    
    .num {
      font-size: 80rpx;
      font-weight: 800;
      line-height: 1;
    }
    
    .unit {
      font-size: 32rpx;
      font-weight: bold;
      margin-left: 8rpx;
    }
  }
  
  .yield-desc {
    font-size: 28rpx;
    color: #666;
  }
}

.storage-section {
  background-color: #F8F8F8;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 50rpx;
  
  .storage-label {
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 20rpx;
    
    .storage-val {
      font-weight: bold;
    }
    .storage-max {
      color: #999;
      font-weight: normal;
    }
  }
  
  .progress-bg {
    width: 100%;
    height: 16rpx;
    background-color: #E0E0E0;
    border-radius: 10rpx;
    overflow: hidden;
  }
  
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #FFD000 0%, #FF9500 100%);
    border-radius: 10rpx;
    transition: width 0.3s ease;
  }

  .storage-tip {
    display: block;
    margin-top: 16rpx;
    font-size: 24rpx;
    color: #FF5500;
  }
}

.btn-claim {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: linear-gradient(90deg, #FFD000 0%, #FF9500 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 48rpx;
  border: none;
  
  &.disabled {
    background: #E0E0E0;
    color: #999;
  }
  
  &:active {
    opacity: 0.9;
  }
  
  &::after {
    border: none;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
