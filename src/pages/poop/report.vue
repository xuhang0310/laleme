<template>
  <view class="container">
    <view class="bg-header"></view>
    
    <view class="content-wrapper">
      <!-- 顶部筛选区 -->
      <view class="filter-header">
        <view class="time-tabs">
          <view 
            class="tab-item" 
            :class="{ active: timeRange === 'week' }"
            @click="changeTimeRange('week')"
          >近一周</view>
          <view 
            class="tab-item" 
            :class="{ active: timeRange === 'month' }"
            @click="changeTimeRange('month')"
          >近一月</view>
        </view>
        
        <scroll-view scroll-x class="member-scroll" :show-scrollbar="false">
          <view class="member-list">
            <view 
              class="member-item" 
              v-for="(item, index) in familyMembers" 
              :key="index"
              :class="{ active: currentMember === item.name }"
              @click="changeMember(item.name)"
            >
              <view class="member-avatar-placeholder">{{ item.name[0] }}</view>
              <text>{{ item.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 健康评分卡片 -->
      <view class="report-card main-card">
        <view class="card-inner">
          <view class="score-ring" :class="getScoreClass(healthScore)">
            <text class="score-val">{{ healthScore }}</text>
            <text class="score-label">健康分</text>
          </view>
          <view class="score-summary">
            <text class="summary-title">{{ getScoreTitle(healthScore) }}</text>
            <text class="summary-desc">{{ getScoreDesc(healthScore) }}</text>
          </view>
        </view>
      </view>

      <!-- 异常预警 -->
      <view class="alert-section" v-if="alerts.length > 0">
        <view class="alert-card" v-for="(alert, index) in alerts" :key="index">
          <text class="alert-icon">⚠️</text>
          <view class="alert-content">
            <text class="alert-title">{{ alert.title }}</text>
            <text class="alert-desc">{{ alert.desc }}</text>
          </view>
        </view>
      </view>

      <!-- 个性化建议 -->
      <view class="chart-section" v-if="advices.length > 0">
        <view class="section-header">
          <text class="section-title">健康建议</text>
        </view>
        <view class="advice-list">
          <view class="advice-item" v-for="(advice, index) in advices" :key="index">
            <text class="advice-emoji">{{ advice.emoji }}</text>
            <view class="advice-content">
              <text class="advice-text">{{ advice.text }}</text>
              <text class="advice-link" v-if="advice.link" @click="showKnowledge(advice.link)">了解更多 ></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 频率趋势图 -->
      <view class="chart-section">
        <view class="section-header">
          <text class="section-title">排便频率趋势</text>
        </view>
        <view class="chart-card">
          <view class="bar-chart">
            <view class="chart-bar-group" v-for="(item, index) in trendData" :key="index">
              <view class="bar-column">
                <view class="bar-value" :style="{ height: getBarHeight(item.count) }"></view>
              </view>
              <text class="bar-label">{{ item.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="chart-section">
        <view class="section-header">
          <text class="section-title">形状分布</text>
        </view>
        <view class="tags-grid">
          <view class="grid-item" v-for="(count, shape) in shapeStats" :key="shape">
            <text class="grid-val">{{ count }}</text>
            <text class="grid-label">{{ shape }}</text>
          </view>
        </view>
      </view>
      
      <view class="chart-section">
        <view class="section-header">
          <text class="section-title">颜色分布</text>
        </view>
        <view class="tags-grid">
          <view class="grid-item" v-for="(count, color) in colorStats" :key="color">
            <text class="grid-val" :style="{ color: getColorStyle(color) }">{{ count }}</text>
            <text class="grid-label">{{ color }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const timeRange = ref('week') // 'week' | 'month'
const familyMembers = ref([])
const currentMember = ref('本人')

const healthScore = ref(100)
const alerts = ref([])
const advices = ref([])
const trendData = ref([])
const shapeStats = ref({})
const colorStats = ref({})

// Data storage
const allRecords = ref([])

const loadData = () => {
  // Load family members
  const storedMembers = uni.getStorageSync('family_members') || []
  familyMembers.value = [{ name: '本人' }, ...storedMembers]

  // Load records
  allRecords.value = uni.getStorageSync('poop_records') || []
  
  analyzeData()
}

const changeTimeRange = (range) => {
  timeRange.value = range
  analyzeData()
}

const changeMember = (name) => {
  currentMember.value = name
  analyzeData()
}

const analyzeData = () => {
  // 1. Filter data
  const now = new Date()
  const days = timeRange.value === 'week' ? 7 : 30
  const cutoffTime = now.getTime() - days * 24 * 60 * 60 * 1000
  
  const filtered = allRecords.value.filter(item => {
    const itemTime = item.timestamp || new Date(item.date).getTime()
    const isMember = (item.relation || '本人') === currentMember.value
    return itemTime > cutoffTime && isMember
  })
  
  // 2. Stats
  const sStats = {}
  const cStats = {}
  const dateMap = {}
  
  // Initialize date map for chart
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    dateMap[label] = 0
  }

  let totalScore = 0
  let validScoreCount = 0
  
  // Analysis vars for alerts
  let consecutiveSheep = 0
  let consecutiveGreen = 0
  const recentShapes = []
  
  filtered.forEach(item => {
    // Stats
    sStats[item.shape] = (sStats[item.shape] || 0) + 1
    cStats[item.color] = (cStats[item.color] || 0) + 1
    
    // Trend
    // Simple date formatting matching the map keys
    const d = new Date(item.timestamp || item.date) // Handle both formats if possible
    // Note: item.date might be locale string, better rely on timestamp if available
    // Fallback logic for date parsing if needed
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    if (dateMap[label] !== undefined) {
      dateMap[label]++
    }
    
    // Scoring
    let itemScore = 100
    // Shape deduction
    if (item.shape === '香蕉状' || item.shape === '硬条状') itemScore -= 0
    else if (item.shape === '羊粪球状') itemScore -= 15
    else if (item.shape === '水状') itemScore -= 20
    else if (item.shape === '糊状') itemScore -= 10
    
    // Color deduction
    if (item.color.includes('红')) itemScore -= 40
    else if (item.color.includes('黑')) itemScore -= 30
    else if (item.color.includes('绿')) itemScore -= 10
    
    // Feeling deduction
    if (item.feeling === '非常困难') itemScore -= 15
    else if (item.feeling === '有些费力') itemScore -= 5
    
    totalScore += Math.max(0, itemScore)
    validScoreCount++
    
    // Alert Logic (simplified: just checking counts for now, ideally strictly consecutive)
    if (item.shape === '羊粪球状') consecutiveSheep++
    if (item.color.includes('绿')) consecutiveGreen++
    recentShapes.push(item.shape)
  })
  
  // Final Score
  healthScore.value = validScoreCount > 0 ? Math.round(totalScore / validScoreCount) : 100
  
  shapeStats.value = sStats
  colorStats.value = cStats
  
  // Transform dateMap to array
  trendData.value = Object.keys(dateMap).map(key => ({
    label: key,
    count: dateMap[key]
  }))
  
  // 3. Generate Alerts & Advice
  generateInsights(filtered, consecutiveSheep, consecutiveGreen)
}

const generateInsights = (records, sheepCount, greenCount) => {
  alerts.value = []
  advices.value = []
  
  // Alerts
  if (sheepCount >= 3) {
    alerts.value.push({
      title: '便秘预警',
      desc: '近期多次出现羊粪球状便，建议立即增加饮水和膳食纤维。'
    })
  }
  if (greenCount >= 3) {
    alerts.value.push({
      title: '消化异常',
      desc: '连续出现绿色便，可能是消化不良或摄入过多深色蔬菜，请持续观察。'
    })
  }
  
  // Advices
  if (records.length === 0) {
    advices.value.push({ emoji: '💡', text: '暂无记录，保持记录习惯有助于发现健康问题哦。' })
    return
  }
  
  // Shape based advice
  const shapes = Object.keys(shapeStats.value)
  const maxShape = shapes.reduce((a, b) => shapeStats.value[a] > shapeStats.value[b] ? a : b, shapes[0])
  
  if (maxShape === '羊粪球状' || maxShape === '硬条状') {
    advices.value.push({
      emoji: '🥦',
      text: '近期排便偏干，建议增加膳食纤维摄入，如燕麦、西兰花、火龙果。',
      link: 'constipation'
    })
    advices.value.push({
      emoji: '💧',
      text: '每天早起一杯温水，促进肠道蠕动。'
    })
  } else if (maxShape === '水状' || maxShape === '糊状') {
    advices.value.push({
      emoji: '🥣',
      text: '近期大便不成形，注意腹部保暖，少吃生冷油腻食物。',
      link: 'diarrhea'
    })
  } else {
    advices.value.push({
      emoji: '🌟',
      text: '近期便便形状很完美，继续保持健康的饮食习惯！'
    })
  }
  
  // Color based advice
  if (colorStats.value['红色(请就医)']) {
     alerts.value.unshift({
       title: '严重警告',
       desc: '发现红色便便记录，如非食用红心火龙果等食物，请及时就医！'
     })
  }
}

const getBarHeight = (count) => {
  const max = Math.max(...trendData.value.map(i => i.count), 3) // Min scale 3
  return (count / max * 100) + '%'
}

const getScoreClass = (score) => {
  if (score >= 80) return 'score-high'
  if (score >= 60) return 'score-mid'
  return 'score-low'
}

const getScoreTitle = (score) => {
  if (score >= 90) return '肠道状况极佳'
  if (score >= 80) return '肠道状况良好'
  if (score >= 60) return '肠道状况一般'
  return '肠道需注意'
}

const getScoreDesc = (score) => {
  if (score >= 80) return '继续保持哦'
  if (score >= 60) return '有待改善，注意饮食'
  return '建议调整作息与饮食'
}

const getColorStyle = (colorName) => {
  if (colorName.includes('红')) return '#EF4444'
  if (colorName.includes('绿')) return '#10B981'
  if (colorName.includes('黄')) return '#F59E0B'
  if (colorName.includes('黑')) return '#1F2937'
  return '#1A1D26'
}

const showKnowledge = (type) => {
  const titles = {
    'constipation': '便秘科普',
    'diarrhea': '腹泻科普'
  }
  const contents = {
    'constipation': '便秘是指排便次数减少（每周少于3次）、粪便干硬、排便困难。建议：1. 多喝水；2. 多吃蔬菜水果粗粮；3. 养成定时排便习惯；4. 适当运动。',
    'diarrhea': '腹泻是指排便次数明显超过平日习惯，粪质稀薄，水分增加。建议：1. 防脱水，补充电解质；2. 清淡饮食，吃小米粥、面条；3. 避免乳制品和油腻食物。'
  }
  
  uni.showModal({
    title: titles[type] || '健康科普',
    content: contents[type] || '暂无详细内容',
    showCancel: false,
    confirmText: '知道了'
  })
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #FAFAFA;
  position: relative;
  padding-bottom: 50px;
}

.bg-header {
  height: 220px;
  background: linear-gradient(180deg, #A0D8EF 0%, #FAFAFA 100%);
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 20px;
  padding-top: 10px; // Adjust for header
}

/* Filter Styles */
.filter-header {
  margin-bottom: 20px;
  
  .time-tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    padding: 4px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    backdrop-filter: blur(10px);
    
    .tab-item {
      padding: 6px 20px;
      font-size: 14px;
      color: #78909C;
      border-radius: 16px;
      transition: all 0.2s;
      
      &.active {
        background: #82C9A0;
        color: white;
        font-weight: 600;
      }
    }
  }
  
  .member-scroll {
    width: 100%;
    white-space: nowrap;
    
    .member-list {
      display: flex;
      gap: 12px;
      padding: 0 4px;
      justify-content: center;
      
      .member-item {
        display: flex;
        align-items: center;
        padding: 6px 16px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 20px;
        font-size: 14px;
        color: #37474F;
        border: 1px solid transparent;
        transition: all 0.2s;
        
        &.active {
          background: #82C9A0;
          color: white;
          font-weight: 500;
          box-shadow: 0 4px 10px rgba(130, 201, 160, 0.3);
          
          .member-avatar-placeholder {
            background: rgba(255, 255, 255, 0.2);
            color: white;
          }
        }
        
        .member-avatar-placeholder {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-right: 6px;
          background: #A0D8EF;
          color: #37474F;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
      }
    }
  }
}

/* Score Card */
.main-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 25px -5px rgba(130, 201, 160, 0.2);
  
  .card-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .score-ring {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 8px solid #F5F5F5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    
    &.score-high { border-color: #82C9A0; color: #82C9A0; }
    &.score-mid { border-color: #FFE082; color: #FBC02D; } /* Darker yellow for text */
    &.score-low { border-color: #FFAB91; color: #FF7043; } /* Darker orange for text */
    
    .score-val {
      font-size: 32px;
      font-weight: 800;
      line-height: 1;
    }
    .score-label {
      font-size: 12px;
      color: #90A4AE;
      margin-top: 4px;
    }
  }
  
  .score-summary {
    flex: 1;
    margin-left: 24px;
    display: flex;
    flex-direction: column;
    
    .summary-title {
      font-size: 20px;
      font-weight: 700;
      color: #37474F;
      margin-bottom: 6px;
    }
    .summary-desc {
      font-size: 14px;
      color: #78909C;
    }
  }
}

/* Alert Section */
.alert-section {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .alert-card {
    background: #FFEBEE;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: flex-start;
    
    .alert-icon {
      font-size: 20px;
      margin-right: 12px;
      margin-top: 2px;
    }
    
    .alert-content {
      flex: 1;
      .alert-title {
        font-size: 15px;
        font-weight: 700;
        color: #991B1B;
        display: block;
        margin-bottom: 4px;
      }
      .alert-desc {
        font-size: 13px;
        color: #B91C1C;
        line-height: 1.4;
      }
    }
  }
}

/* Advice List */
.advice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .advice-item {
    background: white;
    padding: 16px;
    border-radius: 12px;
    display: flex;
    align-items: flex-start;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
    
    .advice-emoji {
      font-size: 24px;
      margin-right: 12px;
      background: #F3F4F6;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    
    .advice-content {
      flex: 1;
      .advice-text {
        font-size: 14px;
        color: #4B5563;
        line-height: 1.5;
        display: block;
        margin-bottom: 6px;
      }
      .advice-link {
        font-size: 12px;
        color: #4B6EF6;
        font-weight: 600;
      }
    }
  }
}

/* Charts */
.chart-section {
  margin-bottom: 24px;
  
  .section-header {
    margin-bottom: 12px;
    padding-left: 4px;
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #1A1D26;
    }
  }
}

.chart-card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  height: 200px;
  display: flex;
  align-items: flex-end;
}

.bar-chart {
  width: 100%;
  height: 160px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  
  .chart-bar-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    
    .bar-column {
      width: 8px;
      height: 120px;
      background: #F3F4F6;
      border-radius: 4px;
      display: flex;
      align-items: flex-end;
      position: relative;
      
      .bar-value {
        width: 100%;
        background: #4B6EF6;
        border-radius: 4px;
        min-height: 4px;
        transition: height 0.5s ease;
      }
    }
    
    .bar-label {
      font-size: 10px;
      color: #9CA3AF;
      transform: scale(0.9);
      white-space: nowrap;
    }
  }
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  
  .grid-item {
    background: white;
    padding: 16px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
    
    .grid-val {
      font-size: 20px;
      font-weight: 700;
      color: #1A1D26;
      margin-bottom: 4px;
    }
    
    .grid-label {
      font-size: 12px;
      color: #6B7280;
    }
  }
}
</style>
