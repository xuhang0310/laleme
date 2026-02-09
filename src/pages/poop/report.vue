<template>
  <view class="container">
    <!-- Custom Header -->
    <view class="custom-header">
      <view class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#1A1D26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
      <text class="header-title">健康报告</text>
      <view class="header-right">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#1A1D26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 2V6" stroke="#1A1D26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 2V6" stroke="#1A1D26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 10H21" stroke="#1A1D26" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      <!-- Frequency Card -->
      <view class="card frequency-card">
        <text class="card-label">如厕频率</text>
        <view class="freq-header">
          <view class="freq-count">
            <text class="count-num">24</text>
            <text class="count-unit">次</text>
          </view>
          <view class="trend-badge">
            <text>本周 +12%</text>
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
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path class="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path class="circle"
                stroke-dasharray="75, 100"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <text class="donut-text">75%</text>
          </view>
          <text class="feeling-title">感觉良好</text>
          <text class="feeling-subtitle">保持下去!</text>
        </view>

        <!-- Insight Card -->
        <view class="card insight-card">
          <text class="card-label">洞察</text>
          <view class="insight-list">
            <view class="insight-item">
              <view class="dot green"></view>
              <text class="insight-text">高纤维 (12)</text>
            </view>
            <view class="insight-item">
              <view class="dot teal"></view>
              <text class="insight-text">水分充足 (8)</text>
            </view>
            <view class="insight-item">
              <view class="dot gray"></view>
              <text class="insight-text">胀气 (4)</text>
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
          <image class="puppy-avatar" src="/static/puppy.png" mode="aspectFill"></image>
          <view class="milestone-info">
            <text class="card-label">成长里程碑</text>
            <text class="milestone-desc">你的小狗进化进度已达 80%!</text>
            
            <view class="progress-container">
              <view class="progress-bar">
                <view class="progress-fill" style="width: 80%"></view>
              </view>
              <view class="progress-labels">
                <text>8 级</text>
                <text>9 级</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="milestone-footer">
          <view class="footer-left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#00E676"/>
            </svg>
            <text class="next-level">下一级: 黄金精灵</text>
          </view>
          <view class="detail-btn">
            <text>详情</text>
          </view>
        </view>
      </view>

      <!-- Bottom Spacer -->
      <view style="height: 120rpx;"></view>
    </scroll-view>

    <FloatingTabBar :current="1" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import FloatingTabBar from '@/components/FloatingTabBar.vue'

const weekData = ref([
  { day: '周一', percent: 60 },
  { day: '周二', percent: 40 },
  { day: '周三', percent: 100 },
  { day: '周四', percent: 20 },
  { day: '周五', percent: 55 },
  { day: '周六', percent: 50 },
  { day: '周日', percent: 85 }
])

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

.donut-chart {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circular-chart {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg); /* Start from top */
}

.circle-bg {
  fill: none;
  stroke: #F3F4F6;
  stroke-width: 3.5;
}

.circle {
  fill: none;
  stroke: #00E676;
  stroke-width: 3.5;
  stroke-linecap: round;
}

.donut-text {
  position: absolute;
  font-size: 32rpx;
  font-weight: 700;
  color: #1A1D26;
}

.feeling-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D26;
  margin-bottom: 4rpx;
}

.feeling-subtitle {
  font-size: 22rpx;
  color: #9CA3AF;
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