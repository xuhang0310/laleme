<template>
  <view class="splash-page">
    <!-- Logo 区 -->
    <view class="logo-section">
      <image class="pet-logo" src="/static/puppy_hugry.png" mode="aspectFit" />
      <text class="app-title">便签日记</text>
      <text class="app-slogan">今天也是健康的一天</text>
    </view>

    <!-- 加载指示器 -->
    <view class="loading-section">
      <view class="loading-dots">
        <view class="dot" v-for="i in 3" :key="i" :style="{ animationDelay: (i - 1) * 0.2 + 's' }"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 1.5 秒后跳转到主页
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/index/index'
    })
  }, 1500)
})
</script>

<style lang="scss">
.splash-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F9F7F4 0%, #FFFFFF 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fade-in-up 0.6s ease-out;
}

.pet-logo {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 48rpx;
  animation: breathe 3s ease-in-out infinite;
}

.app-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #8FB3A0;
  margin-bottom: 16rpx;
}

.app-slogan {
  font-size: 28rpx;
  color: #A8A8A8;
}

.loading-section {
  position: absolute;
  bottom: 120rpx;
}

.loading-dots {
  display: flex;
  gap: 12rpx;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #8FB3A0;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(40rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
