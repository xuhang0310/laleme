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
    <view class="action-buttons" v-on:click="handleAction">
      <view class="action-btn">
        <image src="/static/hand.png" style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFit" />
        <text>抚摸</text>
      </view>
      <view class="action-btn">
          <image src="/static/bg-chat.png" style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFit" />
        <text>聊天</text>
      </view>
    </view>

    <!-- Snapshot Card -->
    <view class="snapshot-card" @click="goToReport">
       <view class="snapshot-left">
          <view class="snapshot-icon">
            <uni-icons :type="lastRecord ? 'checkmarkempty' : 'list'" size="24" color="#fff"></uni-icons>
          </view>
          <view class="snapshot-info">
             <text class="snapshot-label">最近记录</text>
             <text class="snapshot-value">{{ lastRecordText }}</text>
          </view>
       </view>
       <uni-icons type="right" size="16" color="#9CA3AF"></uni-icons>
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
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import FloatingTabBar from '@/components/FloatingTabBar.vue'
import PetInteraction from '@/components/PetInteraction.vue'

const title = ref('Home')
const lastRecord = ref(null)

onShow(() => {
  loadLastRecord()
})

const loadLastRecord = () => {
  const records = uni.getStorageSync('poop_records') || []
  if (records.length > 0) {
    // Sort by timestamp descending just in case, though usually appended
    const sorted = [...records].sort((a, b) => b.timestamp - a.timestamp)
    lastRecord.value = sorted[0]
  } else {
    lastRecord.value = null
  }
}

const snapshotLabel = ref('最近记录')
const isLongText = ref(false)

const lastRecordText = computed(() => {
  // 1. New User (No records at all)
  if (!lastRecord.value && !uni.getStorageSync('has_used_before')) {
    uni.setStorageSync('has_used_before', true) // Mark as used
    snapshotLabel.value = '你好，主人！'
    isLongText.value = true
    return '我是巴迪，今后你的大便健康由我来守护'
  }
  
  // 2. No record found (but used before - e.g. cleared data or just empty)
  if (!lastRecord.value) {
     snapshotLabel.value = '开始记录'
     isLongText.value = false
     return '暂无数据，快去记录一笔吧'
  }
  
  // 3. Returning User (Long time no see > 3 days)
  const lastTime = new Date(lastRecord.value.timestamp).getTime()
  const nowTime = new Date().getTime()
  const daysDiff = (nowTime - lastTime) / (1000 * 3600 * 24)
  
  if (daysDiff > 3) {
      snapshotLabel.value = '好久不见'
      isLongText.value = true
      return '主人好久没来记录了，最近肠胃还好吗？记得多喝水哦~'
  }
  
  // 4. Normal User (Standard record display)
  snapshotLabel.value = '最近记录'
  isLongText.value = false
  const date = new Date(lastRecord.value.timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  
  const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  const dayStr = isToday ? '今天' : `${date.getMonth() + 1}月${date.getDate()}日`
  
  const shapeStr = lastRecord.value.shape ? ` (${lastRecord.value.shape})` : ''
  return `${dayStr} ${timeStr}${shapeStr}`
})

const goToReport = () => {
  uni.navigateTo({
    url: '/pages/poop/report'
  })
}


const handleAction = (action) => {
  // Navigate to chat page
  // We can pass the action type as a query parameter if needed in the future
  // e.g. url: '/pages/chat/index?type=' + action
  uni.navigateTo({
    url: '/pages/chat/index'
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
  padding-top: 30rpx; /* Adjust for status bar */
  background-color: #F8F9FA;
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
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

.snapshot-card {
  background-color: #fff;
  border-radius: 30rpx;
  padding: 24rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.03);
}

.snapshot-left {
  display: flex;
  align-items: center;
  flex: 1; /* Allow left part to take available space */
  overflow: hidden; /* Ensure overflow works inside flex */
}

.snapshot-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: #00E676;
  border-radius: 24rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 24rpx;
  flex-shrink: 0; /* Prevent icon from shrinking */
}

.snapshot-info {
  display: flex;
  flex-direction: column;
  flex: 1; /* Allow text to take remaining space */
  margin-right: 20rpx; /* Space before arrow */
}

.snapshot-label {
  font-size: 24rpx;
  color: #9CA3AF;
  margin-bottom: 4rpx;
}

.snapshot-value {
  font-size: 30rpx;
  color: #1F2937;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.snapshot-value.long-text {
  font-size: 26rpx;
  color: #4B5563;
  white-space: normal;
  line-height: 1.4;
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