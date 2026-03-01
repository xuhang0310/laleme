<template>
  <view class="page" :style="{ '--safe-area-top': safeAreaTop + 'rpx' }">
    <!-- 顶部问候区 -->
    <view class="header-section">
      <view class="greeting">
        <text class="greeting-sub">{{ timeGreeting }}</text>
        <text class="greeting-main">今天也是健康的一天</text>
      </view>
    </view>

    <!-- 宠物互动区 -->
    <view class="pet-area">
      <view class="pet-card">
        <PetInteraction />
      </view>
    </view>

    <!-- 快捷操作区 -->
    <view class="quick-actions">
      <view class="action-btn" @click="goToRecord">
        <view class="action-icon icon-record">
          <uni-icons type="compose" size="24" color="#8FB3A0" />
        </view>
        <text>记录</text>
      </view>
      <view class="action-btn" @click="goToReport">
        <view class="action-icon icon-report">
          <uni-icons type="bar" size="24" color="#8FB3A0" />
        </view>
        <text>报告</text>
      </view>
      <view class="action-btn" @click="goToPet">
        <view class="action-icon icon-pet">
          <uni-icons type="heart" size="24" color="#8FB3A0" />
        </view>
        <text>宠物</text>
      </view>
    </view>

    <!-- 最近记录卡片 -->
    <view class="snapshot-card" @click="goToReport">
      <view class="snapshot-left">
        <view class="snapshot-icon">
          <uni-icons :type="lastRecord ? 'checkmarkempty' : 'list'" size="24" color="#fff"></uni-icons>
        </view>
        <view class="snapshot-info">
          <text class="snapshot-label">{{ snapshotLabel }}</text>
          <text class="snapshot-value" :class="{ 'long-text': isLongText }">{{ lastRecordText }}</text>
        </view>
      </view>
      <uni-icons type="right" size="16" color="#A8A8A8"></uni-icons>
    </view>

    <!-- 状态卡片 - 横向滚动 -->
    <scroll-view class="status-scroll" scroll-x :show-scrollbar="false">
      <view class="status-cards">
        <view class="status-card">
          <view class="status-icon happy">
            <uni-icons type="star" size="28" color="#FFD6A5" />
          </view>
          <text class="status-label">快乐值</text>
          <text class="status-value">92</text>
          <view class="mini-progress">
            <view class="progress-fill" style="width: 92%"></view>
          </view>
        </view>
        <view class="status-card">
          <view class="status-icon hunger">
            <uni-icons type="shop" size="28" color="#E8B878" />
          </view>
          <text class="status-label">饱食度</text>
          <text class="status-value">65%</text>
          <view class="mini-progress">
            <view class="progress-fill" style="width: 65%"></view>
          </view>
        </view>
        <view class="status-card">
          <view class="status-icon health">
            <uni-icons type="heart" size="28" color="#7CB393" />
          </view>
          <text class="status-label">健康指数</text>
          <text class="status-value">A+</text>
        </view>
      </view>
    </scroll-view>

    <!-- 每日贴士 -->
    <view class="tips-card">
      <view class="tips-icon">
        <uni-icons type="lightbulb" size="24" color="#D4A59A" />
      </view>
      <view class="tips-content">
        <text class="tips-title">每日贴士</text>
        <text class="tips-desc">主人，保持良好的习惯，记得多喝水哦！</text>
      </view>
    </view>

    <!-- 底部导航占位 -->
    <FloatingTabBar :current="0" />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import FloatingTabBar from '@/components/FloatingTabBar.vue'
import PetInteraction from '@/components/PetInteraction.vue'
import { getStatusBarHeight, getNavBarHeight } from '@/utils/system'

const lastRecord = ref(null)
const snapshotLabel = ref('最近记录')
const isLongText = ref(false)
const statusBarHeight = ref(0)
const safeAreaTop = ref(100)

onShow(() => {
  loadLastRecord()
  // 初始化安全区域高度
  // #ifdef MP-WEIXIN
  statusBarHeight.value = getStatusBarHeight()
  safeAreaTop.value = getNavBarHeight()
  // #endif
  // #ifndef MP-WEIXIN
  statusBarHeight.value = 0
  safeAreaTop.value = 60
  // #endif
})

const timeGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return '早上好'
  if (hour >= 12 && hour < 14) return '中午好'
  if (hour >= 14 && hour < 18) return '下午好'
  return '晚上好'
})

const loadLastRecord = () => {
  const records = uni.getStorageSync('poop_records') || []
  if (records.length > 0) {
    const sorted = [...records].sort((a, b) => b.timestamp - a.timestamp)
    lastRecord.value = sorted[0]
  } else {
    lastRecord.value = null
  }
}

const lastRecordText = computed(() => {
  if (!lastRecord.value && !uni.getStorageSync('has_used_before')) {
    uni.setStorageSync('has_used_before', true)
    snapshotLabel.value = '你好，主人！'
    isLongText.value = true
    return '我是巴迪，今后你的大便健康由我来守护'
  }

  if (!lastRecord.value) {
    snapshotLabel.value = '开始记录'
    isLongText.value = false
    return '暂无数据，快去记录一笔吧'
  }

  const lastTime = new Date(lastRecord.value.timestamp).getTime()
  const nowTime = new Date().getTime()
  const daysDiff = (nowTime - lastTime) / (1000 * 3600 * 24)

  if (daysDiff > 3) {
    snapshotLabel.value = '好久不见'
    isLongText.value = true
    return '主人好久没来记录了，最近肠胃还好吗？记得多喝水哦~'
  }

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

const goToRecord = () => {
  uni.navigateTo({ url: '/pages/poop/add' })
}

const goToReport = () => {
  uni.navigateTo({ url: '/pages/poop/report' })
}

const goToPet = () => {
  uni.navigateTo({ url: '/pages/user/index' })
}
</script>

<style lang="scss">
/* 导入设计令牌 */
$color-primary: #8FB3A0;
$color-primary-light: #A8C9B8;
$color-primary-dark: #6B9180;
$color-primary-bg: rgba(143, 179, 160, 0.08);
$color-secondary: #D4A59A;
$color-success: #7CB393;
$color-warning: #E8B878;
$color-happy: #FFD6A5;

$bg-page: #F9F7F4;
$bg-card: #FFFFFF;
$bg-section: #F2EFE9;

$text-primary: #4A4A4A;
$text-secondary: #7A7A7A;
$text-muted: #A8A8A8;

$radius-sm: 12rpx;
$radius-md: 20rpx;
$radius-lg: 32rpx;
$radius-xl: 48rpx;
$radius-round: 9999rpx;

$shadow-sm: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
$shadow-md: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
$shadow-lg: 0 12rpx 40rpx rgba(0, 0, 0, 0.08);

/* 页面基础 */
.page {
  background-color: $bg-page;
  min-height: 100vh;
  padding: 30rpx;
  padding-top: 60rpx;
  padding-bottom: 40rpx;
  box-sizing: border-box;
  padding-top: calc(60rpx + var(--safe-area-top, 60rpx));
}

/* 顶部问候区 */
.header-section {
  margin-bottom: 32rpx;
  padding-top: 20rpx;
}

.greeting {
  display: flex;
  flex-direction: column;

  .greeting-sub {
    font-size: 26rpx;
    color: $color-primary;
    font-weight: 500;
    margin-bottom: 8rpx;
  }

  .greeting-main {
    font-size: 40rpx;
    color: $text-primary;
    font-weight: 700;
    line-height: 1.2;
  }
}

/* 宠物区域 */
.pet-area {
  margin-bottom: 32rpx;
}

.pet-card {
  background: $bg-card;
  border-radius: $radius-xl;
  padding: 40rpx;
  box-shadow: $shadow-md;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 快捷操作区 */
.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 24rpx;
  background: $bg-card;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  margin-bottom: 24rpx;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;

  .action-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: $color-primary-bg;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  text {
    font-size: 24rpx;
    color: $text-secondary;
  }
}

/* 最近记录卡片 */
.snapshot-card {
  background: $bg-card;
  border-radius: $radius-xl;
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  box-shadow: $shadow-sm;

  &:active {
    transform: scale(0.98);
  }
}

.snapshot-left {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
}

.snapshot-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.snapshot-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 20rpx;
}

.snapshot-label {
  font-size: 24rpx;
  color: $text-muted;
  margin-bottom: 8rpx;
}

.snapshot-value {
  font-size: 30rpx;
  color: $text-primary;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.snapshot-value.long-text {
  font-size: 26rpx;
  color: $text-secondary;
  white-space: normal;
  line-height: 1.5;
}

/* 状态卡片滚动区 */
.status-scroll {
  width: 100%;
  white-space: nowrap;
  margin-bottom: 24rpx;
}

.status-cards {
  display: inline-flex;
  gap: 20rpx;
}

.status-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 200rpx;
  padding: 32rpx 24rpx;
  background: $bg-card;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
}

.status-card .status-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.status-card .status-icon.happy { background: rgba(255, 214, 165, 0.3); }
.status-card .status-icon.hunger { background: rgba(232, 184, 120, 0.3); }
.status-card .status-icon.health { background: rgba(124, 179, 147, 0.3); }

.status-card .status-label {
  font-size: 24rpx;
  color: $text-muted;
  margin-bottom: 8rpx;
}

.status-card .status-value {
  font-size: 36rpx;
  color: $text-primary;
  font-weight: 700;
  margin-bottom: 12rpx;
}

.mini-progress {
  width: 100%;
  height: 8rpx;
  background: $bg-section;
  border-radius: 4rpx;
  overflow: hidden;
}

.mini-progress .progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $color-primary 0%, $color-primary-light 100%);
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

/* 每日贴士 */
.tips-card {
  background: linear-gradient(135deg, rgba(212, 165, 154, 0.1) 0%, rgba(255, 255, 255, 0.8) 100%);
  border-radius: $radius-xl;
  padding: 32rpx;
  display: flex;
  align-items: flex-start;
  border: 1px solid rgba(212, 165, 154, 0.15);
}

.tips-icon {
  width: 70rpx;
  height: 70rpx;
  background: $bg-card;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.tips-content {
  flex: 1;
}

.tips-content .tips-title {
  display: block;
  font-size: 30rpx;
  color: $text-primary;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.tips-content .tips-desc {
  display: block;
  font-size: 26rpx;
  color: $text-secondary;
  line-height: 1.5;
}
</style>
