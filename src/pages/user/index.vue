<template>
  <view class="container">
    <!-- Custom Header -->
    <view class="custom-header">
      <text class="header-title" style="text-align: center;">设置</text>
      <view class="header-right"></view>
    </view>

    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      <!-- Profile Section -->
      <view class="profile-section">
        <view class="avatar-container">
          <view class="avatar-ring">
            <image class="avatar-img" src="../../static/puppy_katong.png" mode="aspectFill"></image>
          </view>
          <!-- <view class="edit-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </view> -->
        </view>
        <text class="pet-name">巴迪</text>
        <text class="pet-level">12 级如厕萌宠伴侣</text>
      </view>

      <!-- Settings Groups -->
      <view class="settings-list">
        
        <!-- Account -->
        <text class="section-label">账户</text>
        <view class="list-group">
          <view class="list-item" @click="handleItemClick('profile')">
            <view class="item-left">
              <!-- <view class="icon-box green-light">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </view> -->
              <view class="text-content">
                <text class="item-title">萌宠资料设置</text>
                <text class="item-subtitle">更新宠物名称和简介</text>
              </view>
            </view>
            <view class="item-right">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </view>
          </view>
        </view>

        <!-- Preferences -->
        <!-- <text class="section-label">偏好设置</text>
        <view class="list-group"> -->
          <!-- Notifications -->
          <!-- <view class="list-item border-bottom">
            <view class="item-left">
              <view class="icon-box green-light">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </view>
              <view class="text-content">
                <text class="item-title">通知</text>
                <text class="item-subtitle">“你的小狗饿了！”提醒</text>
              </view>
            </view>
            <view class="item-right">
              <switch :checked="notificationsEnabled" color="#00E676" style="transform:scale(0.8)" @change="toggleNotifications" />
            </view>
          </view> -->

          <!-- Theme -->
          <!-- <view class="list-item" @click="handleItemClick('theme')">
            <view class="item-left">
              <view class="icon-box green-light">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 8C12 8 12 8 12 8" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </view>
              <view class="text-content">
                <text class="item-title">主题自定义</text>
                <text class="item-subtitle">个性化颜色和小狗皮肤</text>
              </view>
            </view>
            <view class="item-right">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </view>
          </view>
        </view> -->

        <!-- Health & Data -->
        <!-- <text class="section-label">健康数据</text> -->
        <!-- <view class="list-group">
          <view class="list-item" @click="handleItemClick('health')">
            <view class="item-left">
              <view class="icon-box green-light">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 20V10" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 20V4" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 20V14" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </view>
              <view class="text-content">
                <text class="item-title">健康目标提醒</text>
                <text class="item-subtitle">每日饮水与纤维摄入提醒</text>
              </view>
            </view>
            <view class="item-right">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </view>
          </view> -->

          <!-- Export Health Data -->
          <!-- <view class="list-item" @click="handleItemClick('export')">
            <view class="item-left">
              <view class="icon-box green-light">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 2V8H20" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 18V12" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 15L12 12L15 15" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </view>
              <view class="text-content">
                <text class="item-title">导出健康数据</text>
                <text class="item-subtitle">下载排便日志 (CSV/PDF)</text>
              </view>
            </view>
            <view class="item-right">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </view>
          </view>
        </view> -->

        <!-- Support -->
        <!-- <text class="section-label">支持服务</text>
        <view class="list-group">
          <view class="list-item" @click="handleItemClick('about')">
            <view class="item-left">
              <view class="icon-box green-light">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17H12.01" stroke="#00E676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </view>
              <view class="text-content">
                <text class="item-title">关于与帮助</text>
                <text class="item-subtitle">使用教程与联系开发者</text>
              </view>
            </view>
            <view class="item-right">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </view>
          </view>
        </view> -->

       

        <!-- Extra spacing for navbar -->
        <view style="height: 120rpx;"></view>
      </view>
    </scroll-view>

    <FloatingTabBar :current="4" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import FloatingTabBar from '@/components/FloatingTabBar.vue'

const notificationsEnabled = ref(true)

const goBack = () => {
  uni.navigateBack()
}

const toggleNotifications = (e) => {
  notificationsEnabled.value = e.detail.value
}

const handleItemClick = (type) => {
  uni.showToast({
    title: '即将推出',
    icon: 'none'
  })
}
</script>

<style>
page {
  background-color: #F8F9FA;
}
</style>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #F8F9FA; /* Light gray bg */
  display: flex;
  flex-direction: column;
}

.custom-header {
  padding-top: 30rpx; /* Status bar spacing */
  padding-left: 30rpx;
  padding-right: 30rpx;
  padding-bottom: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #1A1D26;
}

.header-right {
  width: 60rpx;
}

.scroll-content {
  flex: 1;
  padding: 0 40rpx;
  box-sizing: border-box;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20rpx;
  margin-bottom: 60rpx;
}

.avatar-container {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 24rpx;
}

.avatar-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4rpx solid #E8F5E9; /* Light green ring */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}

.avatar-img {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
}

.edit-badge {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  width: 56rpx;
  height: 56rpx;
  background-color: #00E676;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 4rpx solid #fff;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.1);
}

.pet-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #1A1D26;
  margin-bottom: 8rpx;
}

.pet-level {
  font-size: 26rpx;
  color: #00E676;
  font-weight: 500;
}

.section-label {
  font-size: 24rpx;
  color: #9CA3AF;
  margin-bottom: 16rpx;
  display: block;
  font-weight: 500;
}

.list-group {
  background-color: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 40rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.02);
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
}

.list-item:active {
  background-color: #F9FAFB;
}

.border-bottom {
  border-bottom: 2rpx solid #F3F4F6;
}

.item-left {
  display: flex;
  align-items: center;
}

.icon-box {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 24rpx;
}

.green-light {
  background-color: #E8F5E9;
}

.text-content {
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1A1D26;
  margin-bottom: 4rpx;
}

.item-subtitle {
  font-size: 22rpx;
  color: #9CA3AF;
}

.item-right {
  display: flex;
  align-items: center;
}

/* Hide scrollbar within this component just in case global style misses */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

.footer-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40rpx;
  margin-bottom: 40rpx;
}

.logout-btn {
  width: 100%;
  height: 100rpx;
  background-color: #FFEBEE; /* Light pink */
  border-radius: 24rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32rpx;
}

.logout-btn:active {
  opacity: 0.8;
}

.logout-btn text {
  color: #FF5252;
  font-size: 32rpx;
  font-weight: 600;
  margin-left: 16rpx;
}

.version-text {
  font-size: 24rpx;
  color: #9CA3AF;
}
</style>