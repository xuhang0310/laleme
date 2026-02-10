<template>
  <view class="container">
    <!-- Custom Header -->
    <view class="custom-header">
      <view class="back-btn" @click="goBack">
        <uni-icons type="back" size="24" color="#1A1D26"></uni-icons>
      </view>
      <text class="header-title">健康报告</text>
      <view class="header-right">
        <uni-icons type="calendar" size="24" color="#1A1D26"></uni-icons>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      <!-- Frequency Card -->
      <view class="card frequency-card">
        <text class="card-label">如厕频率</text>
        <view class="freq-header">
          <view class="freq-count">
            <text class="count-num">{{ totalCount }}</text>
            <text class="count-unit">次</text>
          </view>
          <view class="trend-badge">
            <text>本周</text>
          </view>
        </view>
        
        <view class="bar-chart">
          <view class="bar-item" v-for="(item, index) in weekData" :key="index">
            <view class="bar-track">
              <view class="bar-fill" :style="{ height: item.percent + '%' }"></view>
            </view>
            <text class="bar-day">{{ item.day }}</text>
          </view>
        </view>
      </view>

      <!-- Middle Row -->
      <view class="middle-row">
        <!-- Feeling Card -->
        <view class="card feeling-card">
          <view class="donut-chart">
            <view class="progress-ring" :style="{ '--percent': goodFeelingPercent }">
              <view class="progress-mask"></view>
            </view>
            <text class="donut-text">{{ goodFeelingPercent }}%</text>
          </view>
          <text class="feeling-title">感觉良好</text>
          <text class="feeling-subtitle">保持下去!</text>
        </view>

        <!-- Insight Card -->
        <view class="card insight-card">
          <text class="card-label">洞察</text>
          <view class="insight-list">
            <view class="insight-item" v-for="(item, index) in insights" :key="index">
              <view :class="['dot', item.type]"></view>
              <text class="insight-text">{{ item.text }} ({{ item.count }})</text>
            </view>
          </view>
          <view class="insight-footer">
            <text>今天的早间记录快了 20%.</text>
          </view>
        </view>
      </view>

      <!-- Milestone Card -->
      <view class="card milestone-card">
        <view class="milestone-content">
          <image class="puppy-avatar" src="../../static/puppy_katong.png" mode="aspectFill"></image>
          <view class="milestone-info">
            <text class="milestone-desc">主人，您的健康就是我的快乐！保持良好的习惯哦！</text>
            <view class="progress-container">
              <view class="progress-bar">
                <view class="progress-fill" style="width: 80%"></view>
              </view>
              <view class="progress-labels">
                <text>0 级</text>
                <text>1 级</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- <view class="milestone-footer">
          <view class="footer-left">
            <uni-icons type="paperplane-filled" size="20" color="#00E676"></uni-icons>
            <text class="next-level">下一级: 黄金精灵</text>
          </view>
          <view class="detail-btn">
            <text>详情</text>
          </view>
        </view> -->
      </view>

      <!-- Bottom Spacer -->
      <view style="height: 120rpx;"></view>
    </scroll-view>

    <FloatingTabBar :current="1" />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import FloatingTabBar from '@/components/FloatingTabBar.vue'

const weekData = ref([])
const totalCount = ref(0)
const goodFeelingPercent = ref(0)
const insights = ref([])

// Map English/Index keys to Chinese for display if needed, 
// but data seems to be stored as Chinese strings already based on user input.

onShow(() => {
  loadData()
})

const loadData = () => {
  const records = uni.getStorageSync('poop_records') || []
  processWeekData(records)
  processFeelingStats(records)
  processInsights(records)
}

const processWeekData = (records) => {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const counts = [0, 0, 0, 0, 0, 0, 0]
  
  const now = new Date()
  const oneDayTime = 24 * 60 * 60 * 1000
  // Get Monday of current week
  const dayOfWeek = now.getDay() || 7 // 1-7
  const mondayTime = now.getTime() - (dayOfWeek - 1) * oneDayTime
  const mondayDate = new Date(mondayTime)
  mondayDate.setHours(0, 0, 0, 0)
  
  // Filter records for this week
  const weekRecords = records.filter(r => {
    return r.timestamp >= mondayDate.getTime()
  })
  
  totalCount.value = weekRecords.length
  
  weekRecords.forEach(r => {
    const date = new Date(r.timestamp)
    let day = date.getDay()
    if (day === 0) day = 7
    counts[day - 1]++
  })
  
  const max = Math.max(...counts, 1) // Avoid divide by zero
  
  weekData.value = days.map((day, index) => ({
    day,
    percent: (counts[index] / max) * 100,
    count: counts[index] // Optional: store actual count if needed
  }))
}

const processFeelingStats = (records) => {
  if (records.length === 0) {
    goodFeelingPercent.value = 0
    return
  }
  
  // Assuming '顺畅', '正常', '迅速' are good feelings
  const goodFeelings = ['顺畅', '正常', '迅速', 'Smooth', 'Normal', 'Fast'] 
  const goodCount = records.filter(r => goodFeelings.includes(r.feeling)).length
  // Ensure we don't divide by zero if records.length is somehow 0 (though checked above)
  const total = records.length || 1
  goodFeelingPercent.value = Math.round((goodCount / total) * 100)
}

const processInsights = (records) => {
  if (records.length === 0) {
    insights.value = [{ text: '暂无数据', type: 'gray', count: 0 }]
    return
  }
  
  const shapeCounts = {}
  const feelingCounts = {}
  
  records.forEach(r => {
    if (r.shape) shapeCounts[r.shape] = (shapeCounts[r.shape] || 0) + 1
    if (r.feeling) feelingCounts[r.feeling] = (feelingCounts[r.feeling] || 0) + 1
  })
  
  const result = []
  
  // Find top shape
  const topShape = Object.entries(shapeCounts).sort((a, b) => b[1] - a[1])[0]
  if (topShape) {
    result.push({ 
      text: topShape[0], 
      count: topShape[1], 
      type: 'green' 
    })
  }
  
  // Find top feeling (excluding good ones if we want to highlight issues, or just top one)
  const topFeeling = Object.entries(feelingCounts).sort((a, b) => b[1] - a[1])[0]
  if (topFeeling) {
    result.push({ 
      text: topFeeling[0], 
      count: topFeeling[1], 
      type: 'teal' 
    })
  }
  
  // Add a generic one if not enough
  if (result.length < 3) {
    result.push({ text: '记录中', count: records.length, type: 'gray' })
  }
  
  insights.value = result.slice(0, 3)
}

const goBack = () => {
  uni.navigateBack()
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
  background-color: #F8F9FA;
  display: flex;
  flex-direction: column;
}

.custom-header {
  padding-top: 100rpx;
  padding-left: 30rpx;
  padding-right: 30rpx;
  padding-bottom: 20rpx;
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
  display: flex;
  justify-content: center;
}

.scroll-content {
  flex: 1;
  padding: 0 30rpx;
  box-sizing: border-box;
}

.card {
  background: white;
  border-radius: 40rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.02);
}

.card-label {
  font-size: 24rpx;
  color: #9CA3AF;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}

/* Frequency Card */
.frequency-card {
  padding: 40rpx;
}

.freq-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40rpx;
}

.freq-count {
  display: flex;
  align-items: baseline;
}

.count-num {
  font-size: 60rpx;
  font-weight: 700;
  color: #1A1D26;
  line-height: 1;
}

.count-unit {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D26;
  margin-left: 8rpx;
}

.trend-badge {
  background-color: #E8F5E9;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.trend-badge text {
  color: #00E676;
  font-size: 24rpx;
  font-weight: 600;
}

.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 240rpx;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60rpx;
}

.bar-track {
  width: 32rpx;
  height: 160rpx;
  background-color: #F1F8F6; /* Very light green/gray */
  border-radius: 16rpx;
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-bottom: 16rpx;
}

.bar-fill {
  width: 100%;
  background-color: #00E676;
  border-radius: 16rpx;
  min-height: 16rpx;
}

.bar-day {
  font-size: 20rpx;
  color: #9CA3AF;
}

/* Middle Row */
.middle-row {
  display: flex;
  justify-content: space-between;
  gap: 30rpx;
}

.feeling-card, .insight-card {
  flex: 1;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
}

/* Feeling Card */
.feeling-card {
  justify-content: center;
}

/* Circular Chart Styles - Using CSS Conic Gradient for Mini Program compatibility */
.donut-chart {
  width: 160rpx;
  height: 160rpx;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24rpx;
}

.progress-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(#00E676 calc(var(--percent) * 1%), #F5F7FA 0);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.progress-mask {
  position: absolute;
  width: 82%;
  height: 82%;
  background-color: #fff;
  border-radius: 50%;
}

.donut-text {
  position: absolute;
  font-size: 36rpx;
  font-weight: 800;
  color: #1A1D26;
  z-index: 1;
}

.feeling-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #065F46; /* Emerald-800 */
  margin-bottom: 8rpx;
}

.feeling-subtitle {
  font-size: 24rpx;
  color: #34D399; /* Emerald-400 */
  font-weight: 500;
}

/* Insight Card */
.insight-card {
  align-items: flex-start;
}

.insight-list {
  margin-top: 10rpx;
  margin-bottom: 30rpx;
  width: 100%;
}

.insight-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  margin-right: 12rpx;
}

.dot.green { background-color: #00E676; }
.dot.teal { background-color: #A7F3D0; }
.dot.gray { background-color: #E5E7EB; }

.insight-text {
  font-size: 24rpx;
  color: #1A1D26;
  font-weight: 500;
}

.insight-footer {
  border-top: 2rpx solid #F3F4F6;
  width: 100%;
  padding-top: 20rpx;
}

.insight-footer text {
  font-size: 20rpx;
  color: #059669;
  font-weight: 500;
  line-height: 1.4;
}

/* Milestone Card */
.milestone-card {
  padding: 0;
  overflow: hidden;
}

.milestone-content {
  padding: 30rpx;
  display: flex;
  align-items: flex-start;
}

.puppy-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  margin-right: 24rpx;
  background-color: #E0F2F1;
}

.milestone-info {
  flex: 1;
}

.milestone-desc {
  font-size: 26rpx;
  color: #4B5563;
  margin-bottom: 20rpx;
  display: block;
}

.progress-container {
  width: 100%;
}

.progress-bar {
  height: 16rpx;
  background-color: #F3F4F6;
  border-radius: 8rpx;
  width: 100%;
  margin-bottom: 8rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #00E676;
  border-radius: 8rpx;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
}

.progress-labels text {
  font-size: 20rpx;
  color: #9CA3AF;
}

.milestone-footer {
  background-color: #E8F5E9;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  display: flex;
  align-items: center;
}

.next-level {
  font-size: 24rpx;
  color: #1A1D26;
  font-weight: 600;
  margin-left: 12rpx;
}

.detail-btn {
  background-color: #00E676;
  padding: 8rpx 32rpx;
  border-radius: 30rpx;
}

.detail-btn text {
  font-size: 24rpx;
  color: white;
  font-weight: 600;
}

/* Scrollbar Hide */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
</style>