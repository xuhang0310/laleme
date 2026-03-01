<template>
  <view class="safe-header" :style="{ height: statusBarHeight + 'px' }">
    <slot name="left">
      <view class="safe-header-left" @click="handleBack">
        <uni-icons v-if="showBack" type="back" :size="20" :color="backColor"></uni-icons>
      </view>
    </slot>

    <slot name="center">
      <view class="safe-header-center">
        <text class="safe-header-title">{{ title }}</text>
      </view>
    </slot>

    <slot name="right">
      <view class="safe-header-right" :style="{ width: capsuleRightWidth + 'px' }">
        <slot name="right-content"></slot>
      </view>
    </slot>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStatusBarHeight, getCapsuleRightWidth } from '@/utils/system'

defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  },
  backColor: {
    type: String,
    default: '#4A4A4A'
  }
})

const statusBarHeight = ref(44)
const capsuleRightWidth = ref(100)

onMounted(() => {
  // #ifdef MP-WEIXIN
  statusBarHeight.value = getStatusBarHeight()
  capsuleRightWidth.value = getCapsuleRightWidth()
  // #endif

  // #ifndef MP-WEIXIN
  statusBarHeight.value = 44
  capsuleRightWidth.value = 100
  // #endif
})

const handleBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss">
.safe-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  background-color: transparent;
}

.safe-header-left {
  width: 88rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 16rpx;
}

.safe-header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60rpx;
  max-width: 40%;
}

.safe-header-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #4A4A4A;
  white-space: nowrap;
}

.safe-header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 60rpx;
}
</style>
