<template>
  <view class="page" :style="{ '--safe-area-top': safeAreaTop + 'rpx' }">
    <!-- Page Header -->
    <view class="page-header">
      <view class="back-btn" @click="goBack">
        <uni-icons type="back" size="24" color="#4A4A4A"></uni-icons>
      </view>
      <text class="header-title">本周健康报告</text>
      <view class="header-right">
        <uni-icons type="calendar" size="24" color="#4A4A4A"></uni-icons>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false" @scrolltolower="loadMore">

      <!-- Alert Banner -->
      <view class="alert-banner" v-if="alertInfo.show">
        <view class="alert-icon">
          <uni-icons type="info-filled" size="20" color="#D98888"></uni-icons>
        </view>
        <text class="alert-text">{{ alertInfo.message }}</text>
        <view class="alert-close" @click="alertInfo.show = false">
          <uni-icons type="closeempty" size="16" color="#D98888"></uni-icons>
        </view>
      </view>

      <!-- 宠物评语卡片 -->
      <view class="pet-comment-card">
        <view class="comment-content">
          <image :src="petImage" class="pet-avatar-sm" mode="aspectFill" />
          <view class="comment-text">
            <text>{{ petMessage }}</text>
          </view>
        </view>
      </view>

      <!-- 核心数据网格 -->
      <view class="stats-grid">
        <view class="stat-card">
          <text class="stat-label">排便次数</text>
          <text class="stat-value">{{ totalCount }}</text>
          <text class="stat-unit">次</text>
        </view>
        <view class="stat-card">
          <text class="stat-label">成功率</text>
          <text class="stat-value" :class="{ 'success': successRate >= 80 }">{{ successRate }}</text>
          <text class="stat-unit">%</text>
        </view>
        <view class="stat-card">
          <text class="stat-label">顺畅度</text>
          <text class="stat-value" :class="{ 'good': painlessRate >= 80 }">{{ painlessRate }}</text>
          <text class="stat-unit">%</text>
        </view>
      </view>

      <!-- 周视图卡片 -->
      <view class="week-card">
        <text class="card-title">本周记录</text>
        <view class="week-chart">
          <view class="day-column" v-for="(item, index) in weekData" :key="index">
            <view class="bar-wrapper">
              <view
                class="bar-fill"
                :class="{ 'bar-active': item.total > 0 }"
                :style="{ height: (item.total / maxCount * 100) + '%' }"
              ></view>
            </view>
            <text class="day-label">{{ item.day }}</text>
          </view>
        </view>
      </view>

      <!-- 本周洞察 -->
      <view class="insight-card-new">
        <view class="insight-header">
          <uni-icons type="lightbulb" size="20" color="#D4A59A"></uni-icons>
          <text class="insight-title">本周洞察</text>
        </view>
        <view class="insight-content">
          <view class="insight-row">
            <view class="insight-dot" style="background: #8FB3A0;"></view>
            <text class="insight-text">主导形状：{{ dominantShape || '暂无数据' }}</text>
          </view>
          <view class="insight-row" v-if="symptomSummary && symptomSummary !== '无明显异常'">
            <view class="insight-dot" style="background: #D98888;"></view>
            <text class="insight-text">{{ symptomSummary }}</text>
          </view>
          <view class="insight-tip">
            <text>{{ smartTip }}</text>
          </view>
        </view>
      </view>

      <!-- 记录列表 -->
      <view class="record-section">
        <text class="section-title">近期记录</text>
        <view class="record-list">
          <view class="record-item" v-for="(item, index) in displayRecords" :key="index">
            <view class="record-icon" :style="{ background: getIconBg(item) }">
              <uni-icons :type="getIconType(item)" size="20" color="#fff"></uni-icons>
            </view>
            <view class="record-info">
              <text class="record-time">{{ formatTime(item.timestamp) }}</text>
              <text class="record-desc">{{ item.type === 'poop' ? item.shape : '未排便' }}</text>
            </view>
            <view class="record-right">
              <uni-icons
                v-if="item.type === 'poop' && item.symptoms && item.symptoms.length === 0"
                type="checkmarkempty"
                size="20"
                color="#7CB393"
              ></uni-icons>
            </view>
          </view>
        </view>
        <view class="loading-state" v-if="hasMore">
          <text>上拉加载更多</text>
        </view>
        <view class="loading-state" v-else-if="displayRecords.length === 0">
          <text>暂无记录，快去添加吧！</text>
        </view>
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
import { getNavBarHeight } from '@/utils/system'

const weekData = ref([])
const totalCount = ref(0)
const successRate = ref(100)
const painlessRate = ref(0)
const alertInfo = ref({ show: false, message: '' })
const dominantShape = ref('')
const symptomSummary = ref('')
const smartTip = ref('')
const maxCount = ref(1)
const safeAreaTop = ref(88)

// Pet State
const petImage = ref('../../static/puppy_katong.png')
const petMessage = ref('主人，保持良好的习惯哦！')

// List State
const allRecords = ref([])
const displayRecords = ref([])
const pageSize = ref(5)
const hasMore = ref(true)

onShow(() => {
  // 初始化安全区域高度
  // #ifdef MP-WEIXIN
  safeAreaTop.value = getNavBarHeight()
  // #endif
  // #ifndef MP-WEIXIN
  safeAreaTop.value = 88
  // #endif

  loadData()
})

const loadData = () => {
  const records = uni.getStorageSync('poop_records') || []

  // 1. Process List Data
  allRecords.value = records.sort((a, b) => b.timestamp - a.timestamp)
  updateDisplayList()

  const weekRecords = filterThisWeek(records)

  processWeekData(weekRecords)
  processSuccessRate(weekRecords)
  processPainlessRate(weekRecords)
  processInsights(weekRecords)
  processAlerts(weekRecords)

  // Finally update pet status based on all analysis
  processPetStatus(weekRecords)
}

const updateDisplayList = () => {
  const currentLen = displayRecords.value.length
  const targetLen = pageSize.value

  if (targetLen >= allRecords.value.length) {
    displayRecords.value = allRecords.value
    hasMore.value = false
  } else {
    displayRecords.value = allRecords.value.slice(0, targetLen)
    hasMore.value = true
  }
}

const loadMore = () => {
  if (!hasMore.value) return
  pageSize.value += 5
  updateDisplayList()
}

// Helpers for List UI
const formatTime = (ts) => {
  const date = new Date(ts)
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  const h = date.getHours().toString().padStart(2, '0')
  const min = date.getMinutes().toString().padStart(2, '0')
  return `${m}-${d} ${h}:${min}`
}

const getIconBg = (item) => {
  if (item.type === 'no_poop') return '#A8A8A8'
  const colorMap = {
    '棕色': '#8FB3A0',
    '黄色': '#E8B878',
    '绿色': '#7CB393',
    '黑色': '#6B7280',
    '红色': '#D98888'
  }
  const key = item.color ? item.color.split('(')[0] : ''
  return colorMap[key] || '#8FB3A0'
}

const getIconType = (item) => {
  if (item.type === 'no_poop') return 'closeempty'
  if (item.shape.includes('香蕉')) return 'checkmarkempty'
  if (item.shape.includes('羊粪')) return 'loop'
  if (item.shape.includes('糊')) return 'drop'
  if (item.shape.includes('水')) return 'drop'
  if (item.shape.includes('硬')) return 'record'
  return 'checkmarkempty'
}

const filterThisWeek = (records) => {
  const now = new Date()
  const oneDayTime = 24 * 60 * 60 * 1000
  const dayOfWeek = now.getDay() || 7
  const mondayTime = now.getTime() - (dayOfWeek - 1) * oneDayTime
  const mondayDate = new Date(mondayTime)
  mondayDate.setHours(0, 0, 0, 0)

  return records.filter(r => r.timestamp >= mondayDate.getTime())
}

const processWeekData = (records) => {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const counts = Array(7).fill(0).map(() => ({ poop: 0, noPoop: 0 }))

  records.forEach(r => {
    const date = new Date(r.timestamp)
    let day = date.getDay()
    if (day === 0) day = 7

    if (r.type === 'no_poop') {
        counts[day - 1].noPoop++
    } else {
        counts[day - 1].poop++
    }
  })

  // Find max total for scaling
  const max = Math.max(...counts.map(c => c.poop + c.noPoop), 1)
  maxCount.value = max

  weekData.value = days.map((day, index) => {
      const total = counts[index].poop + counts[index].noPoop
      return {
        day,
        total
      }
  })

  totalCount.value = records.length
}

const processSuccessRate = (records) => {
    if (records.length === 0) {
        successRate.value = 0
        return
    }
    const poopCount = records.filter(r => r.type !== 'no_poop').length
    successRate.value = Math.round((poopCount / records.length) * 100)
}

const processPainlessRate = (records) => {
  if (records.length === 0) {
    painlessRate.value = 0
    return
  }

  const painful = ['困难', '费力', 'Hard', 'Difficult']
  const painlessCount = records.filter(r => !painful.includes(r.feeling)).length

  painlessRate.value = Math.round((painlessCount / records.length) * 100)
}

const processInsights = (records) => {
  if (records.length === 0) {
    dominantShape.value = '暂无数据'
    smartTip.value = '记录第一笔数据来获取建议吧！'
    return
  }

  // 1. Dominant Shape
  const shapeCounts = {}
  records.filter(r => r.type !== 'no_poop').forEach(r => {
    if (r.shape) shapeCounts[r.shape] = (shapeCounts[r.shape] || 0) + 1
  })
  const topShape = Object.entries(shapeCounts).sort((a, b) => b[1] - a[1])[0]
  dominantShape.value = topShape ? topShape[0] : '无'

  // 2. Symptom Summary
  let badSymptoms = 0
  records.forEach(r => {
      if (r.symptoms && Array.isArray(r.symptoms)) {
          badSymptoms += r.symptoms.length
      }
  })
  symptomSummary.value = badSymptoms > 0 ? `发现 ${badSymptoms} 个异常标记` : '无明显异常'

  // 3. Generate Smart Tip
  const hasDanger = records.some(r =>
    ['红色', '黑色'].includes(r.color) ||
    (r.symptoms && (r.symptoms.includes('带血') || r.symptoms.includes('粘液')))
  )

  const noPoopCount = records.filter(r => r.type === 'no_poop').length
  const waterShapeCount = records.filter(r => ['水状', '糊状'].includes(r.shape)).length
  const dryShapeCount = records.filter(r => ['羊粪球', '硬条状'].includes(r.shape)).length

  if (hasDanger) {
      smartTip.value = '发现高危信号 (血/黑便)，请密切关注或就医！'
  } else if (noPoopCount > 3 || dryShapeCount > 3) {
      smartTip.value = '似乎有点便秘？多喝水，多吃蔬菜纤维哦。'
  } else if (waterShapeCount > 3) {
      smartTip.value = '腹泻预警，注意补充电解质，避免油腻。'
  } else {
      smartTip.value = '保持得不错！继续维持规律作息。'
  }
}

const processAlerts = (records) => {
    const dangers = records.filter(r =>
        ['红色', '黑色'].includes(r.color) ||
        (r.symptoms && (r.symptoms.includes('带血') || r.symptoms.includes('粘液')))
    )

    if (dangers.length > 0) {
        alertInfo.value = {
            show: true,
            message: `本周检测到 ${dangers.length} 次消化道预警信号，请注意！`
        }
    } else {
        alertInfo.value = { show: false, message: '' }
    }
}

const processPetStatus = (records) => {
    const hasDanger = alertInfo.value.show
    const hasNoPoop = records.some(r => r.type === 'no_poop')

    if (hasDanger) {
        petImage.value = '../../static/puppy_worry.png'
        petMessage.value = '主人是不是肚子不舒服？我好担心...'
    } else if (successRate.value > 80 && !hasNoPoop) {
        petImage.value = '../../static/puppy_happy.png'
        petMessage.value = '哇！主人的肠胃棒棒的！'
    } else if (hasNoPoop || successRate.value <= 80) {
        petImage.value = '../../static/puppy_cheer.png'
        petMessage.value = '有点不顺畅？多喝水，我会陪着你的！'
    } else {
        petImage.value = '../../static/puppy_katong.png'
        petMessage.value = '主人，您的健康就是我的快乐！'
    }
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss">
/* 设计令牌 */
$color-primary: #8FB3A0;
$color-primary-light: #A8C9B8;
$color-primary-dark: #6B9180;
$color-primary-bg: rgba(143, 179, 160, 0.08);
$color-secondary: #D4A59A;
$color-secondary-bg: rgba(212, 165, 154, 0.08);
$color-success: #7CB393;
$color-warning: #E8B878;
$color-error: #D98888;

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

$shadow-sm: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
$shadow-md: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);

page {
  background-color: $bg-page;
}

.page {
  min-height: 100vh;
  background-color: $bg-page;
  display: flex;
  flex-direction: column;
  padding-top: var(--safe-area-top, 88rpx);
}

.page-header {
  padding: 16rpx 30rpx;
  padding-top: max(16rpx, calc(var(--status-bar-height, 0px) + 8rpx));
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $bg-page;
  position: relative;
  z-index: 100;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.header-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
  flex: 1;
  text-align: center;
  padding: 0 60rpx;
}

.header-right {
  width: 80rpx;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.scroll-content {
  flex: 1;
  padding: 0 30rpx;
  box-sizing: border-box;
}

/* Alert Banner */
.alert-banner {
  background-color: rgba(217, 136, 136, 0.08);
  border: 1px solid rgba(217, 136, 136, 0.2);
  border-radius: $radius-md;
  padding: 20rpx;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
}

.alert-icon {
  margin-right: 16rpx;
}

.alert-text {
  flex: 1;
  font-size: 24rpx;
  color: $color-error;
  font-weight: 500;
}

.alert-close {
  padding: 10rpx;
}

/* 宠物评语卡片 */
.pet-comment-card {
  background: linear-gradient(135deg, $color-secondary-bg 0%, rgba(255, 255, 255, 0.8) 100%);
  border-radius: $radius-xl;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border: 1px solid rgba(212, 165, 154, 0.15);
}

.comment-content {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.pet-avatar-sm {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: $bg-section;
  flex-shrink: 0;
}

.comment-text {
  flex: 1;
  font-size: 28rpx;
  color: $text-secondary;
  line-height: 1.5;
}

/* 核心数据网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.stat-card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx 16rpx;
  text-align: center;
  box-shadow: $shadow-sm;
}

.stat-label {
  display: block;
  font-size: 22rpx;
  color: $text-muted;
  margin-bottom: 12rpx;
}

.stat-value {
  display: block;
  font-size: 40rpx;
  color: $text-primary;
  font-weight: 700;
}

.stat-value.success {
  color: $color-success;
}

.stat-value.good {
  color: $color-primary;
}

.stat-unit {
  font-size: 20rpx;
  color: $text-muted;
}

/* 周视图卡片 */
.week-card {
  background: $bg-card;
  border-radius: $radius-xl;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $shadow-sm;
}

.card-title {
  display: block;
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.week-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200rpx;
  padding: 0 8rpx;
}

.day-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-wrapper {
  width: 40rpx;
  height: 160rpx;
  background: $bg-section;
  border-radius: 8rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  background: $bg-section;
  border-radius: 8rpx 8rpx 0 0;
  transition: height 0.3s ease;
}

.bar-fill.bar-active {
  background: $color-primary;
}

.day-label {
  margin-top: 12rpx;
  font-size: 22rpx;
  color: $text-muted;
}

/* 本周洞察卡片 */
.insight-card-new {
  background: linear-gradient(135deg, rgba(212, 165, 154, 0.1) 0%, rgba(255, 255, 255, 0.8) 100%);
  border-radius: $radius-xl;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border: 1px solid rgba(212, 165, 154, 0.15);
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.insight-title {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 600;
}

.insight-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.insight-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.insight-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.insight-text {
  font-size: 26rpx;
  color: $text-secondary;
}

.insight-tip {
  margin-top: 8rpx;
  padding: 16rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: $radius-md;
  font-size: 24rpx;
  color: $text-secondary;
  line-height: 1.5;
}

/* 记录列表 */
.record-section {
  margin-top: 24rpx;
  margin-bottom: 24rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  color: $text-primary;
  font-weight: 700;
  margin-bottom: 20rpx;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.record-item {
  display: flex;
  align-items: center;
  background: $bg-card;
  border-radius: $radius-lg;
  padding: 24rpx;
  box-shadow: $shadow-sm;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.98);
  }
}

.record-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.record-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  margin-right: 16rpx;
}

.record-time {
  font-size: 24rpx;
  color: $text-muted;
}

.record-desc {
  font-size: 28rpx;
  color: $text-primary;
  font-weight: 600;
}

.record-right {
  display: flex;
  align-items: center;
}

.loading-state {
  text-align: center;
  padding: 30rpx 0;
}

.loading-state text {
  font-size: 24rpx;
  color: $text-muted;
}
</style>
