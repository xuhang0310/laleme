<template>
  <view class="tab-bar">
    <view class="tab-bar-border"></view>
    
    <!-- Item 1: 拉了么 -->
    <view class="tab-item" @click="switchTab('/pages/poop/index')">
      <text class="icon" :class="{ active: currentPath === 'pages/poop/index' }">💩</text>
      <text class="text" :class="{ active: currentPath === 'pages/poop/index' }">拉了么</text>
    </view>

    <!-- Item 2: 记一笔 (Center Button) -->
    <view class="tab-item center-item-wrapper">
      <view class="center-item" @click="switchTab('/pages/poop/add')">
        <text class="center-text">记一笔</text>
      </view>
    </view>

    <!-- Item 3: 我的 -->
    <view class="tab-item" @click="switchTab('/pages/user/index')">
      <text class="icon" :class="{ active: currentPath === 'pages/user/index' }">👤</text>
      <text class="text" :class="{ active: currentPath === 'pages/user/index' }">我的</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: {
    type: String,
    default: ''
  }
})

const currentPath = computed(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  return page ? page.route : ''
})

const switchTab = (path) => {
  uni.switchTab({
    url: path
  })
}
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: white;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
}

.tab-bar-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: $uni-border-color;
  transform: scaleY(0.5);
}

.tab-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
}

.icon {
  font-size: 24px;
  margin-bottom: 2px;
  opacity: 0.5;
  filter: grayscale(100%);
  transition: all 0.2s;
  
  &.active {
    opacity: 1;
    filter: grayscale(0%);
    transform: scale(1.1);
  }
}

.text {
  font-size: 10px;
  color: $uni-text-color-grey;
  
  &.active {
    color: $uni-color-primary;
    font-weight: 600;
  }
}

/* Special styling for center button */
.center-item-wrapper {
  position: relative;
  z-index: 10;
}

.center-item {
  width: 64px;
  height: 64px;
  background: $uni-color-primary;
  border-radius: 50%;
  position: absolute;
  top: -24px; /* Move up to bulge out */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(130, 201, 160, 0.4);
  
  &:active {
    transform: translateX(-50%) scale(0.95);
  }
}

.center-text {
  font-size: 16px;
  font-weight: 800;
  color: #FFFFFF;
}
</style>
