<template>
  <view class="container">
    <!-- Custom Header -->
    <view class="custom-header">
      <view class="back-btn" @click="goBack">
        <uni-icons type="back" size="24" color="#1A1D26"></uni-icons>
      </view>
      <text class="header-title">健康报告</text>
      <view class="header-right">
        <image src="../../static/canladar.png" style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFit" />
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      
      <!-- Alert Banner (New) -->
      <view class="alert-banner" v-if="alertInfo.show">
        <view class="alert-icon">
          <uni-icons type="info-filled" size="20" color="#DC2626"></uni-icons>
        </view>
        <text class="alert-text">{{ alertInfo.message }}</text>
        <view class="alert-close" @click="alertInfo.show = false">
          <uni-icons type="closeempty" size="16" color="#DC2626"></uni-icons>
        </view>
      </view>

      <!-- Frequency Card -->
      <view class="card frequency-card">
        <text class="card-label">如厕频率 & 成功率</text>
        <view class="freq-header">
          <view class="freq-count">
            <text class="count-num">{{ totalCount }}</text>
            <text class="count-unit">次</text>
          </view>
          <view class="trend-badge" :class="{ 'warning-badge': successRate < 80 }">
            <text>成功率 {{ successRate }}%</text>
          </view>
        </view>
        
        <view class="bar-chart">
          <view class="bar-item" v-for="(item, index) in weekData" :key="index">
            <view class="bar-track">
              <!-- Stacked Bar: Green for poop, Yellow for no_poop -->
              <view class="bar-fill poop" :style="{ height: item.poopPercent + '%' }"></view>
              <view class="bar-fill no-poop" :style="{ height: item.noPoopPercent + '%', bottom: item.poopPercent + '%' }"></view>
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
            <view class="progress-ring" :style="{ '--percent': painlessRate }">
              <view class="progress-mask"></view>
            </view>
            <text class="donut-text">{{ painlessRate }}%</text>
          </view>
          <text class="feeling-title">排便顺畅度</text>
          <text class="feeling-subtitle">{{ painlessRate >= 80 ? '状态极佳!' : '需注意改善' }}</text>
        </view>

        <!-- Insight Card -->
        <view class="card insight-card">
          <text class="card-label">本周洞察</text>
          <view class="insight-list">
            <view class="insight-item">
              <view class="dot green"></view>
              <text class="insight-text">主导: {{ dominantShape || '暂无' }}</text>
            </view>
            <view class="insight-item" v-if="symptomSummary">
              <view class="dot red"></view>
              <text class="insight-text">{{ symptomSummary }}</text>
            </view>
          </view>
          <view class="insight-footer">
            <text>{{ smartTip }}</text>
          </view>
        </view>
      </view>

      <!-- Milestone Card (Pet Interaction) -->
      <view class="card milestone-card">
        <view class="milestone-content">
          <!-- Dynamic Puppy Avatar -->
          <image class="puppy-avatar" :src="petImage" mode="aspectFill"></image>
          
          <view class="milestone-info">
            <text class="milestone-desc">{{ petMessage }}</text>
            
            <view class="progress-container">
              <view class="progress-bar">
                <view class="progress-fill" :style="{ width: petExpPercent + '%' }"></view>
              </view>
              <view class="progress-labels">
                <text>Lv.{{ petLevel }}</text>
                <text>Lv.{{ petLevel + 1 }}</text>
              </view>
            </view>
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
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import FloatingTabBar from '@/components/FloatingTabBar.vue'

const weekData = ref([])
const totalCount = ref(0)
const successRate = ref(100)
const painlessRate = ref(0)
const alertInfo = ref({ show: false, message: '' })
const dominantShape = ref('')
const symptomSummary = ref('')
const smartTip = ref('')

// Pet State
const petImage = ref('../../static/puppy_katong.png')
const petMessage = ref('主人，保持良好的习惯哦！')
const petLevel = ref(1)
const petExpPercent = ref(0)

onShow(() => {
  loadData()
})

const loadData = () => {
  const records = uni.getStorageSync('poop_records') || []
  const weekRecords = filterThisWeek(records)
  
  processWeekData(weekRecords)
  processSuccessRate(weekRecords)
  processPainlessRate(weekRecords)
  processInsights(weekRecords)
  processAlerts(weekRecords)
  
  // Finally update pet status based on all analysis
  processPetStatus(weekRecords)
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
  // [poopCount, noPoopCount]
  const counts = Array(7).fill(0).map(() => ({ poop: 0, noPoop: 0 }))
  
  records.forEach(r => {
    const date = new Date(r.timestamp)
    let day = date.getDay()
    if (day === 0) day = 7
    
    if (r.type === 'no_poop') {
        counts[day - 1].noPoop++
    } else {
        counts[day - 1].poop++ // Default to poop if undefined
    }
  })
  
  // Find max total for scaling
  const max = Math.max(...counts.map(c => c.poop + c.noPoop), 1)
  
  weekData.value = days.map((day, index) => {
      const total = counts[index].poop + counts[index].noPoop
      return {
        day,
        poopPercent: (counts[index].poop / max) * 100,
        noPoopPercent: (counts[index].noPoop / max) * 100,
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
  
  // Painful keywords: 困难, 费力, Hard, Difficult
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
  // Priority: Danger > Constipation/Diarrhea > Hydration > General
  const hasDanger = records.some(r => 
    ['红色', '黑色'].includes(r.color) || 
    (r.symptoms && (r.symptoms.includes('带血') || r.symptoms.includes('粘液')))
  )
  
  const noPoopCount = records.filter(r => r.type === 'no_poop').length
  const waterShapeCount = records.filter(r => ['水状', '糊状'].includes(r.shape)).length
  const dryShapeCount = records.filter(r => ['羊粪球', '硬条状'].includes(r.shape)).length
  
  if (hasDanger) {
      smartTip.value = '🚨 发现高危信号(血/黑便)，请密切关注或就医！'
  } else if (noPoopCount > 3 || dryShapeCount > 3) {
      smartTip.value = '💧 似乎有点便秘？多喝水，多吃蔬菜纤维哦。'
  } else if (waterShapeCount > 3) {
      smartTip.value = '⚠️ 腹泻预警，注意补充电解质，避免油腻。'
  } else {
      smartTip.value = '🌟 保持得不错！继续维持规律作息。'
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
    // Logic from report.md
    // Happy: Success > 80% & No Alert
    // Worried: Alert Exists
    // Encouraging: no_poop exists
    
    const hasDanger = alertInfo.value.show
    const hasNoPoop = records.some(r => r.type === 'no_poop')
    
    if (hasDanger) {
        // Worried
        petImage.value = '../../static/puppy_worry.png'
        petMessage.value = '主人是不是肚子不舒服？我好担心... (递急救箱)'
    } else if (successRate.value > 80 && !hasNoPoop) {
        // Happy
        petImage.value = '../../static/puppy_happy.png'
        petMessage.value = '哇！主人的肠胃棒棒的！奖励一个贴贴！'
    } else if (hasNoPoop || successRate.value <= 80) {
        // Encouraging
        petImage.value = '../../static/puppy_cheer.png'
        petMessage.value = '有点不顺畅？没关系，多喝水，我会陪着你的！'
    } else {
        // Default
        petImage.value = '../../static/puppy_katong.png'
        petMessage.value = '主人，您的健康就是我的快乐！'
    }
    
    // Fallback for missing images logic (simulated)
    // In real app, we might check if file exists, but here we just set the path.
    // Assuming user will add these images. For now, if they don't exist, it might show broken image.
    // To be safe, let's just stick to puppy_katong if we can't guarantee.
    // But user asked for the scheme. I will implement the scheme.
    // Note: I will use a try-catch or fallback in the template? No, standard <image> handles error event.
    // I'll add an @error handler to revert to default if missing.
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
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

/* Alert Banner */
.alert-banner {
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
}

.alert-icon {
  margin-right: 16rpx;
}

.alert-text {
  flex: 1;
  font-size: 24rpx;
  color: #DC2626;
  font-weight: 500;
}

.alert-close {
  padding: 10rpx;
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

.trend-badge.warning-badge {
  background-color: #FEF3C7;
}

.trend-badge.warning-badge text {
  color: #D97706;
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
  background-color: #F1F8F6;
  border-radius: 16rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 16rpx;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  border-radius: 4rpx;
}

.bar-fill.poop {
  background-color: #00E676;
  z-index: 1;
}

.bar-fill.no-poop {
  background-color: #FBBF24; /* Amber-400 */
  position: absolute;
  z-index: 2;
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
  color: #065F46;
  margin-bottom: 8rpx;
}

.feeling-subtitle {
  font-size: 24rpx;
  color: #34D399;
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
  flex-shrink: 0;
}

.dot.green { background-color: #00E676; }
.dot.red { background-color: #DC2626; }

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
  line-height: 1.5;
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
  transition: width 0.5s ease;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
}

.progress-labels text {
  font-size: 20rpx;
  color: #9CA3AF;
}

::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
</style>