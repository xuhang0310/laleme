<template>
  <view class="container">
    <!-- Custom Header -->
    <view class="custom-header">
      <view class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#1A1D26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
      <view class="header-title-area">
        <text class="header-title">巴迪</text>
        <text class="header-subtitle">在线</text>
      </view>
      <view class="info-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#1A1D26" stroke-width="2"/>
          <path d="M12 16V12" stroke="#1A1D26" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="8" r="1" fill="#1A1D26"/>
        </svg>
      </view>
    </view>

    <!-- Content -->
    <view class="content-area">
      <!-- Chat Bubble -->
      <view class="chat-bubble">
        <text class="bubble-text">汪！今天感觉棒极了。准备好去散步了吗？🦴</text>
        <view class="bubble-arrow"></view>
      </view>

      <!-- Pet Image Area -->
      <view class="pet-image-container">
        <view class="glow-bg"></view>
        <image class="pet-img" src="/static/puppy.png" mode="aspectFill"></image>
        
        <!-- Heart Button -->
        <view class="heart-btn" @click="toggleLike">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" :fill="isLiked ? '#FF5252' : '#00E676'" :stroke="isLiked ? '#FF5252' : '#00E676'" stroke-width="2"/>
          </svg>
        </view>
      </view>

      <!-- Suggested Actions -->
      <view class="actions-section">
        <text class="section-title">建议操作</text>
        <view class="action-buttons">
          <!-- Walk Button -->
          <view class="action-card walk" @click="handleAction('walk')">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="action-icon">
              <path d="M13.5 5.5C14.3284 5.5 15 4.82843 15 4C15 3.17157 14.3284 2.5 13.5 2.5C12.6716 2.5 12 3.17157 12 4C12 4.82843 12.6716 5.5 13.5 5.5Z" fill="#00E676"/>
              <path d="M10.5 9.5H12.5L14.5 20.5H12.5L11.5 14.5L9.5 20.5H7.5L9.5 9.5H10.5Z" fill="#00E676"/>
              <path d="M16 11.5L14.5 9.5H12.5L11 11.5V14.5H13V12.5L13.5 12L15 13.5L16 11.5Z" fill="#00E676"/>
              <path d="M6 6L9 9H11V11H9L6 8V6Z" fill="#00E676"/>
            </svg>
            <text class="action-text">去散步</text>
          </view>

          <!-- Feed Button -->
          <view class="action-card feed" @click="handleAction('feed')">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="action-icon">
              <path d="M11 9H9V2H11V9ZM7 9H5V2H7V9ZM15 9H13V2H15V9ZM16 11V22H4V11H16Z" fill="#FF9800"/>
            </svg>
            <text class="action-text">喂食</text>
          </view>
        </view>
      </view>
    </view>

    <FloatingTabBar :current="3" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import FloatingTabBar from '@/components/FloatingTabBar.vue'

const isLiked = ref(false)

const goBack = () => {
  uni.navigateBack()
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
}

const handleAction = (type) => {
  const msg = type === 'walk' ? '开始散步模式' : '准备喂食'
  uni.showToast({
    title: msg,
    icon: 'none'
  })
}
</script>

<style>
page {
  background-color: #fff;
}
</style>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #fff;
  padding-bottom: 200rpx;
  position: relative;
}

.custom-header {
  padding-top: 100rpx; /* Status bar spacing */
  padding-left: 40rpx;
  padding-right: 40rpx;
  padding-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn, .info-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 2rpx solid #F3F4F6;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-title-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #1A1D26;
}

.header-subtitle {
  font-size: 24rpx;
  color: #00E676;
  margin-top: 4rpx;
}

.content-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;
}

.chat-bubble {
  background-color: #F9FAFB;
  padding: 32rpx 48rpx;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
  margin-bottom: 60rpx;
  position: relative;
  max-width: 80%;
}

.bubble-text {
  font-size: 30rpx;
  color: #1A1D26;
  line-height: 1.5;
  text-align: center;
}

.bubble-arrow {
  position: absolute;
  bottom: -16rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 16rpx solid transparent;
  border-right: 16rpx solid transparent;
  border-top: 16rpx solid #F9FAFB;
}

.pet-image-container {
  position: relative;
  width: 500rpx;
  height: 500rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 60rpx;
}

.glow-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0,230,118,0.1) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
}

.pet-img {
  width: 400rpx;
  height: 400rpx;
  border-radius: 50%;
  z-index: 1;
}

.heart-btn {
  position: absolute;
  bottom: 40rpx;
  right: 40rpx;
  width: 100rpx;
  height: 100rpx;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.1);
  border: 4rpx solid #E8F5E9; /* Slight green border as seen in img */
  z-index: 2;
}

.actions-section {
  width: 100%;
}

.section-title {
  font-size: 28rpx;
  color: #6B7280;
  margin-bottom: 30rpx;
  display: block;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 30rpx;
}

.action-card {
  flex: 1;
  height: 160rpx;
  border-radius: 80rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2rpx solid transparent;
}

.action-card.walk {
  background-color: #F0FDF4; /* Light green bg */
  border-color: #DCFCE7;
}

.action-card.feed {
  background-color: #FFF7ED; /* Light orange bg */
  border-color: #FFEDD5;
}

.action-icon {
  margin-bottom: 12rpx;
}

.action-text {
  font-size: 28rpx;
  font-weight: 600;
}

.walk .action-text {
  color: #166534;
}

.feed .action-text {
  color: #9A3412;
}
</style>