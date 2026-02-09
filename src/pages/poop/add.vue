<template>
  <view class="container">
    <!-- Header Area -->
    <view class="header-section">
      <view class="nav-row">
        <view class="back-btn" @click="goBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="#1A1D26" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
        <view class="date-tag">
          <picker mode="time" :value="time" @change="bindTimeChange">
            <text>{{ time }}</text>
          </picker>
        </view>
      </view>
      <view class="title-row">
        <text class="sub-text">今天感觉如何？</text>
        <text class="main-text">记录便便</text>
      </view>
    </view>

    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      
      <!-- 1. Who (Relation) -->
      <view class="section-card">
        <text class="section-label">记录对象</text>
        <scroll-view scroll-x class="avatar-scroll" :show-scrollbar="false">
          <view class="avatar-wrapper">
            <view 
              class="avatar-item" 
              v-for="(item, index) in familyMembers" 
              :key="index"
              :class="{ active: relation === item.name }"
              @click="selectRelation(item)"
            >
              <view class="avatar-circle">
                <text>{{ item.name[0] }}</text>
                <view class="active-badge" v-if="relation === item.name">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="white"/>
                   </svg>
                </view>
              </view>
              <text class="avatar-name">{{ item.name }}</text>
            </view>
            
            <view class="avatar-item" @click="navigateToAddFamily">
              <view class="avatar-circle add">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#9CA3AF"/>
                </svg>
              </view>
              <text class="avatar-name">添加</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 2. Feeling (Grid Layout) -->
      <view class="section-card">
        <text class="section-label">排便感受</text>
        <view class="feeling-grid">
          <view 
            class="feeling-box" 
            v-for="(item, index) in feelings" 
            :key="index"
            :class="{ active: feelingIndex === index, custom: index === 4 }"
            @click="selectFeeling(index)"
          >
            <text class="emoji">{{ item.emoji }}</text>
            <text class="title">{{ item.title }}</text>
            <text class="desc">{{ item.desc }}</text>
            
            <!-- Custom Input for last item -->
            <input 
              v-if="index === 4 && feelingIndex === 4" 
              class="custom-input" 
              type="number" 
              v-model="customDuration" 
              placeholder="分钟"
              @click.stop
            />
          </view>
        </view>
      </view>

      <!-- 3. Shape & Color (Chips) -->
      <view class="section-card">
        <text class="section-label">形状与颜色</text>
        
        <view class="chips-group">
          <scroll-view scroll-x class="chips-scroll" :show-scrollbar="false">
            <view class="chips-row">
              <view 
                class="chip" 
                v-for="(item, index) in shapes" 
                :key="index"
                :class="{ active: shapeIndex === index }"
                @click="shapeIndex = index"
              >
                {{ item }}
              </view>
            </view>
          </scroll-view>
          
          <view style="height: 20rpx;"></view>
          
          <scroll-view scroll-x class="chips-scroll" :show-scrollbar="false">
             <view class="chips-row">
              <view 
                class="chip color-chip" 
                v-for="(item, index) in colors" 
                :key="index"
                :class="{ active: colorIndex === index }"
                @click="colorIndex = index"
              >
                <view class="color-dot" :style="{ backgroundColor: getColorCode(item) }"></view>
                <text>{{ item }}</text>
              </view>
             </view>
          </scroll-view>
        </view>
      </view>

      <!-- 4. Notes -->
      <view class="section-card">
        <text class="section-label">备注</text>
        <view class="note-box">
          <textarea 
            class="note-input" 
            v-model="note" 
            placeholder="记录一些特殊的观察..." 
            placeholder-style="color:#9CA3AF" 
            auto-height
          />
        </view>
      </view>

      <!-- Spacer -->
      <view style="height: 220rpx;"></view>
    </scroll-view>

    <!-- Floating Action Button -->
    <view class="fab-container">
      <view class="fab-btn" @click="saveRecord">
        <text class="fab-text">完成记录</text>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 5L19 12L12 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const familyMembers = ref([])

onShow(() => {
  loadFamilyMembers()
})

const loadFamilyMembers = () => {
  const storedMembers = uni.getStorageSync('family_members') || []
  const defaultMember = { name: '本人' }
  familyMembers.value = [defaultMember, ...storedMembers]
}

const goBack = () => {
  uni.navigateBack()
}

const selectRelation = (item) => {
  relation.value = item.name
}

const navigateToAddFamily = () => {
  uni.navigateTo({
    url: '/pages/family/add'
  })
}

const now = new Date()
const time = ref(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`)

const relation = ref('本人')

const shapes = ['香蕉状', '羊粪球', '糊状', '水状', '硬条状']
const shapeIndex = ref(0)

const colors = ['棕色', '黄色', '绿色', '黑色', '红色']
const colorIndex = ref(0)

const getColorCode = (name) => {
  const map = {
    '棕色': '#8D6E63',
    '黄色': '#FBC02D',
    '绿色': '#66BB6A',
    '黑色': '#424242',
    '红色': '#EF5350'
  }
  return map[name.split('(')[0]] || '#999'
}

const feelings = [
  { emoji: '⚡️', title: '迅速', desc: '<5 min' },
  { emoji: '😌', title: '顺畅', desc: '5-15 min' },
  { emoji: '😓', title: '费力', desc: '15-25 min' },
  { emoji: '😖', title: '困难', desc: '>25 min' },
  { emoji: '⏱', title: '自定义', desc: '点击输入' }
]
const feelingIndex = ref(1) 
const customDuration = ref('')

const selectFeeling = (index) => {
  feelingIndex.value = index
  if (index !== 4) {
    customDuration.value = ''
  }
}

const note = ref('')

const bindTimeChange = (e) => {
  time.value = e.detail.value
}

const saveRecord = () => {
  const selectedFeeling = feelings[feelingIndex.value]
  let duration = selectedFeeling.desc
  
  if (feelingIndex.value === 4) {
    if (!customDuration.value) {
      uni.showToast({
        title: '请输入时长',
        icon: 'none'
      })
      return
    }
    duration = customDuration.value + '分钟'
  }

  const record = {
    date: new Date().toLocaleDateString(),
    time: time.value,
    relation: relation.value,
    shape: shapes[shapeIndex.value],
    color: colors[colorIndex.value],
    feeling: selectedFeeling.title,
    duration: duration,
    note: note.value,
    timestamp: new Date().getTime()
  }

  const records = uni.getStorageSync('poop_records') || []
  records.push(record)
  
  try {
      uni.setStorageSync('poop_records', records)
      uni.showToast({
        title: '已记录',
        icon: 'success'
      })
    
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/index/index'
        })
      }, 1000)
  } catch (e) {
      uni.showToast({
          title: '存储空间不足',
          icon: 'none'
      })
  }
}
</script>

<style>
page {
  background-color: #F8F9FA;
}
</style>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F8F9FA;
  display: flex;
  flex-direction: column;
}

.header-section {
  padding: 100rpx 40rpx 40rpx;
  background: transparent;
  
  .nav-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;
    
    .back-btn {
      width: 80rpx;
      height: 80rpx;
      background: white;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
      
      &:active {
        transform: scale(0.95);
      }
    }
    
    .date-tag {
      background: white;
      padding: 12rpx 30rpx;
      border-radius: 40rpx;
      font-size: 28rpx;
      font-weight: 600;
      color: #1A1D26;
      box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    }
  }
  
  .title-row {
    display: flex;
    flex-direction: column;
    
    .sub-text {
      font-size: 28rpx;
      color: #00E676;
      font-weight: 500;
      margin-bottom: 8rpx;
    }
    
    .main-text {
      font-size: 56rpx;
      color: #1A1D26;
      font-weight: 800;
      letter-spacing: -1rpx;
    }
  }
}

.content-scroll {
  flex: 1;
  padding: 0 40rpx;
  box-sizing: border-box;
}

.section-card {
  margin-bottom: 50rpx;
  
  .section-label {
    font-size: 32rpx;
    font-weight: 700;
    color: #1A1D26;
    margin-bottom: 30rpx;
    display: block;
  }
}

.avatar-scroll {
  white-space: nowrap;
  width: 100%;
  
  .avatar-wrapper {
    display: flex;
    gap: 30rpx;
    padding: 10rpx 0;
  }
  
  .avatar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
    
    .avatar-circle {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 36rpx;
      font-weight: 600;
      color: #9CA3AF;
      box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.03);
      border: 4rpx solid transparent;
      transition: all 0.2s;
      position: relative;
      
      &.add {
        border: 4rpx dashed #E5E7EB;
        box-shadow: none;
      }
      
      .active-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 32rpx;
        height: 32rpx;
        background: #00E676;
        border-radius: 50%;
        border: 4rpx solid white;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    
    &.active .avatar-circle {
      border-color: #00E676;
      color: #1A1D26;
      transform: scale(1.05);
    }
    
    .avatar-name {
      font-size: 24rpx;
      color: #6B7280;
      font-weight: 500;
    }
    
    &.active .avatar-name {
      color: #1A1D26;
      font-weight: 600;
    }
  }
}

.feeling-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  
  .feeling-box {
    background: white;
    border-radius: 32rpx;
    padding: 30rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 4rpx solid transparent;
    transition: all 0.2s;
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.02);
    position: relative;
    
    &.custom {
      grid-column: span 2;
      flex-direction: row;
      align-items: center;
      
      .emoji { margin-bottom: 0; margin-right: 20rpx; }
      .title { margin-bottom: 0; margin-right: 20rpx; }
      .desc { display: none; }
    }
    
    &.active {
      border-color: #00E676;
      background: #F0FDF4;
      box-shadow: 0 8rpx 24rpx rgba(0, 230, 118, 0.15);
    }
    
    .emoji {
      font-size: 48rpx;
      margin-bottom: 16rpx;
    }
    
    .title {
      font-size: 30rpx;
      font-weight: 700;
      color: #1A1D26;
      margin-bottom: 8rpx;
    }
    
    .desc {
      font-size: 24rpx;
      color: #9CA3AF;
      font-weight: 500;
    }
    
    .custom-input {
      flex: 1;
      height: 60rpx;
      background: white;
      border-radius: 12rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      border: 2rpx solid #E5E7EB;
    }
  }
}

.chips-scroll {
  white-space: nowrap;
  width: 100%;
}

.chips-row {
  display: flex;
  gap: 20rpx;
}

.chip {
  padding: 20rpx 40rpx;
  background: white;
  border-radius: 50rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #6B7280;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.03);
  transition: all 0.2s;
  border: 2rpx solid transparent;
  
  &.active {
    background: #1A1D26;
    color: white;
    transform: translateY(-2rpx);
    box-shadow: 0 8rpx 20rpx rgba(26, 29, 38, 0.2);
  }
  
  &.color-chip {
    display: flex;
    align-items: center;
    gap: 12rpx;
    
    .color-dot {
      width: 24rpx;
      height: 24rpx;
      border-radius: 50%;
      border: 2rpx solid rgba(0,0,0,0.1);
    }
  }
}

.note-box {
  background: white;
  border-radius: 32rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.02);
  
  .note-input {
    width: 100%;
    min-height: 100rpx;
    font-size: 30rpx;
    color: #1A1D26;
    line-height: 1.5;
  }
}

.fab-container {
  position: fixed;
  bottom: 60rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 100;
  pointer-events: none; /* Let clicks pass through container */
  
  .fab-btn {
    pointer-events: auto;
    background: #1A1D26;
    padding: 32rpx 60rpx;
    border-radius: 100rpx;
    display: flex;
    align-items: center;
    gap: 20rpx;
    box-shadow: 0 16rpx 40rpx rgba(26, 29, 38, 0.3);
    transition: all 0.2s;
    
    &:active {
      transform: scale(0.95);
    }
    
    .fab-text {
      color: white;
      font-size: 32rpx;
      font-weight: 700;
    }
  }
}
</style>