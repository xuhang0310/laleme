<template>
  <view class="container">
    <!-- Header -->
    <view class="header">
      <view class="greeting">
        <text class="sub-text">早上好</text>
        <text class="main-text">欢迎回来，主人！</text>
      </view>
      <view class="notification-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.45997 13.8599L4.29997 15.7899C3.58997 16.9699 4.07997 18.2699 5.37997 18.2699H18.66C19.96 18.2699 20.45 16.9699 19.74 15.7899L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z" fill="#555555"/>
          <path d="M13.87 3.20005C13.56 3.11005 13.24 3.04005 12.91 3.01005C12.95 2.65005 13.08 2.31005 13.31 2.05005C13.67 1.65005 14.18 1.50005 14.65 1.68005C15.93 2.16005 16.63 3.56005 16.19 4.86005C15.97 5.49005 15.53 5.99005 14.99 6.29005C14.77 5.16005 14.38 4.12005 13.87 3.20005Z" fill="#555555" fill-opacity="0.4"/>
          <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="#555555" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
    </view>

    <!-- Pet Section -->
    <view class="pet-section">
      <view class="pet-circle-bg"></view>
      <image class="pet-avatar" src="/static/puppy.png" mode="aspectFit"></image>
      <view class="status-pill">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 4px;">
          <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" fill="#00E676"/>
        </svg>
        <text class="status-text">开心</text>
      </view>
    </view>

    <!-- Action Buttons -->
    <view class="action-buttons">
      <view class="action-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
           <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#00E676" fill-opacity="0.2"/>
           <path d="M12.75 8.5C12.75 8.91 12.41 9.25 12 9.25C11.59 9.25 11.25 8.91 11.25 8.5V7C11.25 6.59 11.59 6.25 12 6.25C12.41 6.25 12.75 6.59 12.75 7V8.5Z" fill="#00E676"/>
           <path d="M15.75 9.5C15.75 9.91 15.41 10.25 15 10.25C14.59 10.25 14.25 9.91 14.25 9.5V7C14.25 6.59 14.59 6.25 15 6.25C15.41 6.25 15.75 6.59 15.75 7V9.5Z" fill="#00E676"/>
           <path d="M9.75 9.5C9.75 9.91 9.41 10.25 9 10.25C8.59 10.25 8.25 9.91 8.25 9.5V7C8.25 6.59 8.59 6.25 9 6.25C9.41 6.25 9.75 6.59 9.75 7V9.5Z" fill="#00E676"/>
           <path d="M6.75 11C6.75 11.41 6.41 11.75 6 11.75C5.59 11.75 5.25 11.41 5.25 11V8.5C5.25 8.09 5.59 7.75 6 7.75C6.41 7.75 6.75 8.09 6.75 8.5V11Z" fill="#00E676"/>
        </svg>
        <text>抚摸</text>
      </view>
      <view class="action-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
           <path d="M17 18.25H21.5V12C21.5 6.2 17.25 2 12 2C6.75 2 2.5 6.2 2.5 12C2.5 17.8 6.75 22 12 22C13.25 22 14.5 21.75 15.5 21.25L17 22V18.25Z" fill="#00E676" fill-opacity="0.2"/>
           <path d="M8.5 13.5C9.32843 13.5 10 12.8284 10 12C10 11.1716 9.32843 10.5 8.5 10.5C7.67157 10.5 7 11.1716 7 12C7 12.8284 7.67157 13.5 8.5 13.5Z" fill="#00E676"/>
           <path d="M15.5 13.5C16.3284 13.5 17 12.8284 17 12C17 11.1716 16.3284 10.5 15.5 10.5C14.6716 10.5 14 11.1716 14 12C14 12.8284 14.6716 13.5 15.5 13.5Z" fill="#00E676"/>
        </svg>
        <text>聊天</text>
      </view>
    </view>

    <!-- Main Button -->
    <view class="main-btn">
       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
         <path d="M19 10V12H21V10H19Z" fill="white"/>
         <path d="M17 8H19V6H17V8Z" fill="white"/>
         <path d="M19 14V16H17V14H19Z" fill="white"/>
         <path d="M15 12V10H17V12H15Z" fill="white"/>
         <path d="M8 18C10.2091 18 12 16.2091 12 14C12 11.7909 10.2091 10 8 10C5.79086 10 4 11.7909 4 14C4 16.2091 5.79086 18 8 18Z" fill="white" fill-opacity="0.2"/>
         <path d="M8 16C9.10457 16 10 15.1046 10 14C10 12.8954 9.10457 12 8 12C6.89543 12 6 12.8954 6 14C6 15.1046 6.89543 16 8 16Z" fill="white"/>
       </svg>
       <text>记录如厕</text>
    </view>

    <!-- Stats -->
    <view class="stat-card">
      <view class="stat-header">
        <view class="stat-label-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
             <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="#F06292"/>
             <path d="M15.5 11C16.3284 11 17 10.3284 17 9.5C17 8.67157 16.3284 8 15.5 8C14.6716 8 14 8.67157 14 9.5C14 10.3284 14.6716 11 15.5 11Z" fill="#F06292"/>
             <path d="M8.5 11C9.32843 11 10 10.3284 10 9.5C10 8.67157 9.32843 8 8.5 8C7.67157 8 7 8.67157 7 9.5C7 10.3284 7.67157 11 8.5 11Z" fill="#F06292"/>
             <path d="M12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z" fill="#F06292"/>
          </svg>
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
             <path d="M19.5 3H4.5C3.67 3 3 3.67 3 4.5V9C3 13.14 6.36 16.5 10.5 16.5V21H13.5V16.5C17.64 16.5 21 13.14 21 9V4.5C21 3.67 20.33 3 19.5 3ZM6 6H8V12H6V6ZM11 12H9V6H11V12ZM18 9C18 10.66 16.66 12 15 12H13V6H18V9Z" fill="#FF9800"/>
          </svg>
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 11C18 7.86 15.4 5.25 12.3 5.03C12.2 5.02 12.1 5.02 12 5.02C8.69 5.02 6 7.71 6 11C6 14 8 16.37 8 17H16C16 16.37 18 14 18 11ZM12 2C12.3 2 12.59 2.03 12.87 2.07C12.35 0.88 11.19 0.04 9.83 0.04C8.01 0.04 6.54 1.51 6.54 3.33C6.54 3.99 6.72 4.6 7.03 5.12C9.8 4.28 12 2 12 2Z" fill="#00E676"/>
          </svg>
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

.pet-section {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 400rpx;
  margin-bottom: 40rpx;
}

.pet-circle-bg {
  position: absolute;
  width: 400rpx;
  height: 400rpx;
  border-radius: 50%;
  border: 8rpx solid #E8F5E9; /* Light green ring */
  box-sizing: border-box;
}

.pet-avatar {
  width: 360rpx;
  height: 360rpx;
  border-radius: 50%;
  z-index: 1;
}

.status-pill {
  position: absolute;
  bottom: 20rpx;
  right: 120rpx;
  background-color: #fff;
  padding: 12rpx 32rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  border: 2rpx solid #00E676;
  z-index: 2;
}

.status-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
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