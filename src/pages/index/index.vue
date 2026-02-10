<template>
  <view class="container">
    <!-- Header -->
    <view class="header">
      <view class="greeting">
        <text class="sub-text">早上好</text>
        <text class="main-text">欢迎回来，主人！</text>
      </view>
      <view class="notification-btn">
       <image src="/static/ring.png" style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFit" />
      </view>
    </view>

    <!-- Pet Section -->
    <view class="pet-wrapper">
      <PetInteraction />
    </view>

    <!-- Action Buttons -->
    <view class="action-buttons">
      <view class="action-btn">
        <image src="/static/hand.png" style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFit" />
        <text>抚摸</text>
      </view>
      <view class="action-btn">
          <image src="/static/bg-chat.png" style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFit" />
        <text>聊天</text>
      </view>
    </view>

    <!-- Main Button -->
    <view class="main-btn">
       <text>记录如厕</text>
    </view>

    <!-- Stats -->
    <view class="stat-card">
      <view class="stat-header">
        <view class="stat-label-wrap">
          <image src="/static/smile.png" style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFit" />
          <text class="stat-title">快乐值</text>
        </view>
        <text class="stat-value">92%</text>
      </view>
      <view class="progress-bg">
        <view class="progress-fill pink" style="width: 92%;"></view>
      </view>
    </view>

    <view class="stat-card">
      <view class="stat-header">
        <view class="stat-label-wrap">
          <image src="/static/daocha.png" style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFit" />
          <text class="stat-title">饥饿度</text>
        </view>
        <text class="stat-value">65%</text>
      </view>
      <view class="progress-bg">
        <view class="progress-fill orange" style="width: 65%;"></view>
      </view>
    </view>

    <!-- Daily Tips -->
    <view class="tips-card">
       <view class="bulb-icon-wrap">
         <image src="/static/tip.png" style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFit" />
       </view>
       <view class="tips-content">
          <text class="tips-title">每日贴士</text>
          <text class="tips-desc">主人，你看起来有点不舒服，记得多喝水哦！</text>
       </view>
    </view>
    
    <!-- Spacer -->
    <FloatingTabBar :current="0" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import FloatingTabBar from '@/components/FloatingTabBar.vue'
import PetInteraction from '@/components/PetInteraction.vue'

const title = ref('Home')

const handleRecord = () => {
  uni.navigateTo({
    url: '/pages/poop/add'
  })
}

const handleAction = (action) => {
  uni.showToast({
    title: action + '功能开发中',
    icon: 'none'
  })
}
</script>

<style>
page {
  background-color: #F8F9FA;
}
</style>

<style>
.container {
  padding: 40rpx;
  padding-top: 100rpx; /* Adjust for status bar */
  background-color: #F8F9FA;
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60rpx;
}

.greeting {
  display: flex;
  flex-direction: column;
}

.sub-text {
  font-size: 28rpx;
  color: #00E676;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.main-text {
  font-size: 40rpx;
  color: #333;
  font-weight: bold;
}

.notification-btn {
  width: 80rpx;
  height: 80rpx;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
}

.pet-wrapper {
  margin-bottom: 40rpx;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  margin-bottom: 40rpx;
}

.action-btn {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 20rpx 48rpx;
  border-radius: 50rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.main-btn {
  background-color: #00E676;
  height: 100rpx;
  border-radius: 50rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 230, 118, 0.3);
}

.main-btn text {
  color: #fff;
  font-size: 34rpx;
  font-weight: bold;
}

.stat-card {
  background-color: #fff;
  border-radius: 30rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.02);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.stat-label-wrap {
  display: flex;
  align-items: center;
}

.stat-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.stat-value {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.progress-bg {
  height: 16rpx;
  background-color: #F0F0F0;
  border-radius: 8rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 8rpx;
}

.pink {
  background-color: #F06292;
}

.orange {
  background-color: #FF9800;
}

.tips-card {
  background-color: #E8F5E9;
  border-radius: 30rpx;
  padding: 30rpx;
  display: flex;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.bulb-icon-wrap {
  background-color: #fff;
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.tips-content {
  flex: 1;
}

.tips-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.tips-desc {
  font-size: 26rpx;
  color: #555;
  line-height: 1.4;
}

/* Bottom Nav styles removed as they are now in FloatingTabBar.vue */
</style>