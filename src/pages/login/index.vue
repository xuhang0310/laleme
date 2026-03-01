<template>
  <view class="login-page">
    <view class="logo">
      <image src="/static/puppy_katong.png" class="logo-img" mode="aspectFit" />
    </view>
    <text class="title">登录以同步数据</text>
    <text class="subtitle">多设备访问你的萌宠数据</text>

    <button class="wx-login-btn" @click="handleWxLogin">
      <text>微信一键登录</text>
    </button>

    <text class="skip-btn" @click="handleSkip">暂不登录，继续使用</text>
  </view>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleWxLogin = async () => {
  uni.showLoading({ title: '登录中...' })
  try {
    await authStore.wxLogin()
    uni.hideLoading()
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/index/index' })
    }, 1500)
  } catch (e) {
    uni.hideLoading()
    console.error('登录失败:', e)
    uni.showToast({ title: '登录失败', icon: 'none' })
  }
}

const handleSkip = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F9F7F4 0%, #F0EBE3 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
}

.logo {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .logo-img {
    width: 100%;
    height: 100%;
  }
}

.title {
  font-size: 48rpx;
  font-weight: 700;
  color: #1A1D26;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #9CA3AF;
  margin-bottom: 80rpx;
}

.wx-login-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #07C160 0%, #05A850 100%);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(7, 193, 96, 0.3);
  margin-bottom: 40rpx;
}

.wx-login-btn::after {
  display: none;
}

.wx-login-btn text {
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: 600;
}

.skip-btn {
  font-size: 28rpx;
  color: #9CA3AF;
  text-decoration: underline;
}
</style>
