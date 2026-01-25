<template>
  <view class="container">
    <!-- 顶部背景装饰 -->
    <view class="bg-decoration"></view>

    <view class="header">
      <view class="title-area">
        <text class="title">早安，</text>
        <text class="subtitle">今天也要关注肠道健康哦</text>
      </view>
      <view class="report-btn" @click="goToReport">
        <text class="icon">📊</text>
        <text>健康报告</text>
      </view>
    </view>
    
    <view class="content-area">
      <view class="filter-section">
        <scroll-view scroll-x class="filter-scroll" :show-scrollbar="false">
          <view class="filter-list">
            <view 
              class="filter-item" 
              v-for="(item, index) in familyMembers" 
              :key="index"
              :class="{ active: currentFilter === item.name }"
              @click="currentFilter = item.name"
            >
              <view class="filter-avatar-placeholder">{{ item.name[0] }}</view>
              <text>{{ item.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="section-header" v-if="filteredRecords.length > 0">
        <text class="section-title">最近记录</text>
      </view>

      <view class="record-list">
        <view v-if="filteredRecords.length === 0" class="empty-state">
          <image class="empty-img" src="https://img.yzcdn.cn/vant/empty-image-default.png" mode="widthFix"></image>
          <text class="empty-text">还没有记录哦，快去记一笔吧</text>
        </view>
        
        <view v-else class="record-item" v-for="(item, index) in filteredRecords" :key="index">
          <view 
            class="item-content" 
            :class="{ 'swiped': currentSwipedId === item.timestamp }"
            @touchstart="touchStart($event, item.timestamp)"
            @touchend="touchEnd($event, item.timestamp)"
          >
            <view class="item-main">
              <view class="time-col">
                <text class="date-text">{{ formatDate(item.date) }}</text>
                <text class="time-text">{{ item.time }}</text>
              </view>
              
              <view class="info-col">
                <view class="tags-row">
                  <view class="relation-tag" :class="getRelationClass(item.relation)">{{ item.relation || '本人' }}</view>
                  <view class="status-tag" :class="getStatusClass(item.color)">{{ item.shape }} · {{ item.color }}</view>
                </view>
                
                <view class="feeling-row" v-if="item.feeling">
                  <text class="feeling-text">
                    <text class="feeling-emoji">{{ getFeelingEmoji(item.feeling) }}</text> {{ item.feeling }}
                  </text>
                  <text class="duration-text" v-if="item.duration"> · {{ item.duration }}</text>
                </view>

                <text class="note-text" v-if="item.note">{{ item.note }}</text>
              </view>
            </view>
          </view>
          <view class="delete-btn" @click.stop="deleteRecord(item)">
            <text>删除</text>
          </view>
        </view>
      </view>
    </view>

    <CustomTabBar />
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import CustomTabBar from '@/components/CustomTabBar.vue'

const records = ref([])
const familyMembers = ref([])
const currentFilter = ref('本人')
const currentSwipedId = ref(null)
const startX = ref(0)
const startY = ref(0)

const filteredRecords = computed(() => {
  if (!currentFilter.value) return records.value
  return records.value.filter(item => (item.relation || '本人') === currentFilter.value)
})

const touchStart = (e, id) => {
  // close other swiped items
  if (currentSwipedId.value !== null && currentSwipedId.value !== id) {
    currentSwipedId.value = null
  }
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
}

const touchEnd = (e, id) => {
  const endX = e.changedTouches[0].clientX
  const endY = e.changedTouches[0].clientY
  const diffX = endX - startX.value
  const diffY = endY - startY.value

  // Horizontal swipe detection (more horizontal than vertical)
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Swipe left (show delete)
    if (diffX < -50) {
      currentSwipedId.value = id
    } 
    // Swipe right (hide delete)
    else if (diffX > 50) {
      if (currentSwipedId.value === id) {
        currentSwipedId.value = null
      }
    }
  } else if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
    // Tap on the open item to close it
    if (currentSwipedId.value === id) {
      currentSwipedId.value = null
    }
  }
}

const deleteRecord = (item) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条记录吗？',
    success: (res) => {
      if (res.confirm) {
        const index = records.value.findIndex(r => r.timestamp === item.timestamp)
        if (index > -1) {
          records.value.splice(index, 1)
          uni.setStorageSync('poop_records', records.value)
          uni.showToast({
            title: '已删除',
            icon: 'none'
          })
          currentSwipedId.value = null
        }
      }
    }
  })
}

const goToReport = () => {
  uni.navigateTo({
    url: '/pages/poop/report'
  })
}

const loadRecords = () => {
  const savedRecords = uni.getStorageSync('poop_records') || []
  records.value = savedRecords.reverse()
  loadFamilyMembers()
}

const loadFamilyMembers = () => {
  const storedMembers = uni.getStorageSync('family_members') || []
  const defaultMember = { name: '本人' }
  // Only add stored members if they are not "本人" (though "本人" shouldn't be in storedMembers usually)
  familyMembers.value = [defaultMember, ...storedMembers]
}

const getFeelingEmoji = (feeling) => {
  const map = {
    '迅速解决': '⚡️',
    '轻松顺畅': '😌',
    '有些费力': '😓',
    '非常困难': '😖',
    '记录准确时长': '⏱'
  }
  return map[feeling] || ''
}

const formatDate = (dateStr) => {
  // 简单处理日期显示，如果是今天显示“今天”
  const today = new Date().toLocaleDateString()
  return dateStr === today ? '今天' : dateStr.slice(5) // 去掉年份
}

const getRelationClass = (relation) => {
    const map = {
        '本人': 'tag-me',
        '小孩': 'tag-child',
        '老人': 'tag-elder'
    }
    return map[relation] || 'tag-me'
}

const getStatusClass = (color) => {
  if (color.includes('红') || color.includes('黑')) return 'status-warning'
  if (color.includes('绿')) return 'status-info'
  return 'status-normal'
}

onMounted(() => {
  loadRecords()
})

onShow(() => {
  uni.hideTabBar()
  loadRecords()
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F5F7FA;
  position: relative;
  padding-bottom: 100px;
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 220px;
  background: linear-gradient(180deg, #E0EAFF 0%, #F5F7FA 100%);
  z-index: 0;
}

.header {
  position: relative;
  z-index: 1;
  padding: 60px 24px 20px; // 增加顶部 padding 适配刘海屏
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  
  .title-area {
    .title {
      font-size: 28px;
      font-weight: 800;
      color: #1A1D26;
      display: block;
      margin-bottom: 4px;
    }
    .subtitle {
      font-size: 14px;
      color: #6B7280;
    }
  }
  
  .report-btn {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);
    padding: 8px 16px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    font-size: 13px;
    font-weight: 600;
    color: #4B6EF6;
    
    .icon {
      font-size: 14px;
    }
  }
}

.filter-section {
  margin-bottom: 20px;
  
  .filter-scroll {
    width: 100%;
    white-space: nowrap;
  }
  
  .filter-list {
    display: flex;
    gap: 12px;
    padding-bottom: 4px;
  }
  
  .filter-item {
    display: flex;
    align-items: center;
    padding: 6px 16px;
    background: white;
    border-radius: 20px;
    font-size: 14px;
    color: #6B7280;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
    transition: all 0.2s;
    border: 1px solid transparent;
    
    &.active {
      background: #1A1D26;
      color: white;
      font-weight: 500;
      box-shadow: 0 4px 10px rgba(26, 29, 38, 0.2);
    }
    
    .filter-avatar-placeholder {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      margin-right: 6px;
      background: #E0E7FF;
      color: #4B6EF6;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
  }
}

.content-area {
  position: relative;
  z-index: 1;
  padding: 0 20px;
}

.section-header {
  margin-bottom: 16px;
  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: #1A1D26;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 60px;
  .empty-img {
    width: 160px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  .empty-text {
    font-size: 14px;
    color: #9CA3AF;
  }
}

.record-item {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);

  .item-content {
    background: #FFFFFF;
    padding: 16px;
    transition: transform 0.2s ease;
    position: relative;
    z-index: 2;
    
    &.swiped {
      transform: translateX(-70px);
    }
    
    &:active {
      background-color: #FAFAFA;
    }
  }

  .delete-btn {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 70px;
    background: #EF4444;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    font-size: 14px;
    font-weight: 500;
  }

  .item-main {
    display: flex;
    align-items: flex-start;
  }
  
  .time-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 16px;
    min-width: 45px;
    padding-top: 2px;
    
    .date-text {
      font-size: 12px;
      color: #9CA3AF;
      margin-bottom: 2px;
    }
    .time-text {
      font-size: 16px;
      font-weight: 700;
      color: #1A1D26;
    }
  }
  
  .info-col {
    flex: 1;
    margin-right: 10px;
    
    .tags-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
    }
    
    .relation-tag {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 600;
      
      &.tag-me { background: #EFF6FF; color: #4B6EF6; }
      &.tag-child { background: #FFF1F2; color: #F43F5E; }
      &.tag-elder { background: #F0FDF4; color: #22C55E; }
    }
    
    .status-tag {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 6px;
      background: #F3F4F6;
      color: #4B5563;
      
      &.status-warning { background: #FEF2F2; color: #EF4444; }
      &.status-info { background: #F0F9FF; color: #0EA5E9; }
    }
    
    .feeling-row {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      
      .feeling-text {
        font-size: 13px;
        color: #1A1D26;
        font-weight: 500;
        
        .feeling-emoji {
          margin-right: 4px;
        }
      }
      
      .duration-text {
        font-size: 13px;
        color: #6B7280;
        margin-left: 4px;
      }
    }
    
    .note-text {
      font-size: 13px;
      color: #6B7280;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
  
  .photo-col {
    /* Removed */
  }
}

.fab-btn {
  position: fixed;
  bottom: 32px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #4B6EF6 0%, #2563EB 100%);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
  z-index: 100;
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.9);
  }
  
  .plus-icon {
    font-size: 32px;
    color: white;
    font-weight: 300;
    margin-top: -4px;
  }
}
</style>
