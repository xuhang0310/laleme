<template>
  <view class="container">
    <!-- Header Area -->
    <view class="custom-header">
      <view class="back-btn" @click="goBack">
        <uni-icons type="back" size="24" color="#1A1D26"></uni-icons>
      </view>
      <text class="header-title">记录便便</text>
      <view class="header-right"></view>
    </view>

    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">
      
      <!-- 0. Record Type & Time -->
      <view class="section-card first-card">
        <view class="type-switch">
             <view 
               class="type-btn" 
               :class="{ active: recordType === 'poop' }"
               @click="recordType = 'poop'"
             >
               💩 顺利排便
             </view>
             <view 
               class="type-btn" 
               :class="{ active: recordType === 'no_poop' }"
               @click="recordType = 'no_poop'"
             >
               😣 没拉出来
             </view>
        </view>
        
        <view class="divider"></view>
        
        <picker mode="time" :value="time" @change="bindTimeChange" class="time-picker-row">
            <text class="label">时间</text>
            <view class="time-value">
                <text>{{ time }}</text>
                <uni-icons type="right" size="14" color="#9CA3AF"></uni-icons>
            </view>
        </picker>
      </view>
      
      <template v-if="recordType === 'poop'">
        <!-- 1. Shape & Color -->
        <view class="section-card">
            <text class="section-label">性状与颜色</text>
            
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
            
            <view style="height: 24rpx;"></view>
            
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

        <!-- 2. Amount (New) -->
        <view class="section-card">
            <text class="section-label">分量</text>
            <view class="amount-selector">
                <view 
                    class="amount-btn" 
                    v-for="(item, index) in amounts" 
                    :key="index"
                    :class="{ active: amountIndex === index }"
                    @click="amountIndex = index"
                >
                    <text class="amount-icon" :style="{ transform: `scale(${0.8 + index * 0.2})` }">💩</text>
                    <text>{{ item }}</text>
                </view>
            </view>
        </view>
      </template>

      <!-- 3. Feeling -->
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

      <!-- 4. Symptoms (New) -->
      <view class="section-card">
        <text class="section-label">异常与症状 (多选)</text>
        <view class="tags-container">
            <view 
                class="tag-item"
                v-for="(item, index) in symptoms"
                :key="index"
                :class="{ active: selectedSymptoms.includes(item) }"
                @click="toggleSymptom(item)"
            >
                {{ item }}
            </view>
        </view>
      </view>

      <!-- 5. Notes -->
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
        <uni-icons type="arrowright" size="24" color="white"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const goBack = () => {
  uni.navigateBack()
}

const now = new Date()
const time = ref(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`)

const recordType = ref('poop') // 'poop' or 'no_poop'
const relation = ref('本人')

const shapes = ['香蕉状', '羊粪球', '糊状', '水状', '硬条状']
const shapeIndex = ref(0)

const colors = ['棕色', '黄色', '绿色', '黑色', '红色']
const colorIndex = ref(0)

const amounts = ['少', '适中', '多']
const amountIndex = ref(1)

const symptoms = ['带血', '粘液', '未消化', '恶臭', '排便不尽', '腹痛']
const selectedSymptoms = ref([])

const toggleSymptom = (item) => {
    if (selectedSymptoms.value.includes(item)) {
        selectedSymptoms.value = selectedSymptoms.value.filter(i => i !== item)
    } else {
        selectedSymptoms.value.push(item)
    }
}

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
    type: recordType.value,
    // Only save shape/color/amount if recordType is poop
    shape: recordType.value === 'poop' ? shapes[shapeIndex.value] : '无',
    color: recordType.value === 'poop' ? colors[colorIndex.value] : '无',
    amount: recordType.value === 'poop' ? amounts[amountIndex.value] : '无',
    symptoms: selectedSymptoms.value,
    feeling: selectedFeeling.title,
    duration: duration,
    note: note.value,
    timestamp: new Date().getTime()
  }

  const records = uni.getStorageSync('poop_records') || []
  
  // --- Dog Food Reward Logic (Robust Version with Pinia) ---
  
  // 先检查每日重置，确保计数器是最新的
  userStore.checkDailyReset()
  
  const currentCount = userStore.dailyRecordCount
  
  let reward = 0
  if (currentCount === 0) reward = 40       // 1st record of the day
  else if (currentCount === 1) reward = 10  // 2nd record
  else if (currentCount === 2) reward = 5   // 3rd record
  
  // 将奖励存入 pendingFood
  if (reward > 0) {
      userStore.addPendingFood(reward)
  } else {
      // 即使没有奖励，也要增加记录次数（addPendingFood 内部已处理 dailyRecordCount += 1）
      // 但如果 reward = 0，调用 addPendingFood(0) 也会增加次数
      userStore.addPendingFood(0)
  }
  
  // Legacy sync (保持兼容性，虽然现在主力是 Pinia)
  // uni.setStorageSync('user_state', ...) // 不再需要手动写旧的 user_state
  
  // -----------------------------
 
   records.push(record)
   
   try {
       uni.setStorageSync('poop_records', records)
       
       let toastTitle = '已记录'
       
       if (reward > 0) {
           toastTitle = `已产出 ${reward}g 狗粮`
       } else if (currentCount >= 3) {
           toastTitle = '已记录 (今日奖励已领完)'
       }
       
       uni.showToast({
        title: toastTitle,
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

.custom-header {
  padding-top: 30rpx;
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
  min-width: 60rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.time-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #00E676;
  background: #E8F5E9;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.content-scroll {
  flex: 1;
  padding: 0 30rpx;
  box-sizing: border-box;
}

.section-card {
  background: white;
  border-radius: 40rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.02);
  
  &.first-card {
    margin-top: 10rpx;
  }

  .section-label {
    font-size: 24rpx;
    font-weight: 600;
    color: #9CA3AF;
    margin-bottom: 16rpx;
    display: block;
  }
}

.feeling-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  
  .feeling-box {
    background: #F9FAFB;
    border-radius: 24rpx;
    padding: 24rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 2rpx solid transparent;
    transition: all 0.2s;
    position: relative;
    
    &.custom {
      grid-column: span 2;
      flex-direction: row;
      align-items: center;
      
      .emoji { margin-bottom: 0; margin-right: 20rpx; }
      .title { margin-bottom: 0; margin-right: 20rpx; }
    }
    
    &.active {
      border-color: #00E676;
      background: #ECFDF5;
    }
    
    .emoji {
      font-size: 40rpx;
      margin-bottom: 12rpx;
    }
    
    .title {
      font-size: 28rpx;
      font-weight: 600;
      color: #1A1D26;
      margin-bottom: 6rpx;
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

.type-switch {
  display: flex;
  background: #F3F4F6;
  border-radius: 20rpx;
  padding: 8rpx;
  margin-bottom: 30rpx;
  
  .type-btn {
    flex: 1;
    text-align: center;
    padding: 16rpx 0;
    font-size: 28rpx;
    font-weight: 600;
    color: #6B7280;
    border-radius: 16rpx;
    transition: all 0.2s;
    
    &.active {
      background: white;
      color: #1A1D26;
      box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
    }
  }
}

.divider {
  height: 2rpx;
  background: #F3F4F6;
  margin: 0 -30rpx 30rpx -30rpx;
}

.time-picker-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 0;
  
  .label {
    font-size: 28rpx;
    font-weight: 600;
    color: #1A1D26;
  }
  
  .time-value {
    display: flex;
    align-items: center;
    gap: 10rpx;
    
    text {
      font-size: 32rpx;
      font-weight: 700;
      color: #00E676;
    }
  }
}

.amount-selector {
    display: flex;
    justify-content: space-between;
    gap: 20rpx;
    
    .amount-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30rpx;
        background: #F9FAFB;
        border-radius: 24rpx;
        border: 2rpx solid transparent;
        transition: all 0.2s;
        
        &.active {
            background: #ECFDF5;
            border-color: #00E676;
        }
        
        .amount-icon {
            font-size: 40rpx;
            margin-bottom: 16rpx;
            display: block;
        }
        
        text:last-child {
            font-size: 26rpx;
            font-weight: 600;
            color: #4B5563;
        }
    }
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    
    .tag-item {
        padding: 16rpx 32rpx;
        background: #F9FAFB;
        border-radius: 50rpx;
        font-size: 26rpx;
        color: #6B7280;
        font-weight: 500;
        border: 2rpx solid transparent;
        transition: all 0.2s;
        
        &.active {
            background: #FEF2F2;
            color: #EF4444;
            border-color: #FECACA;
            font-weight: 600;
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
  padding: 16rpx 32rpx;
  background: #F9FAFB;
  border-radius: 50rpx;
  font-size: 26rpx;
  font-weight: 500;
  color: #6B7280;
  transition: all 0.2s;
  border: 2rpx solid transparent;
  
  &.active {
    background: #1A1D26;
    color: white;
    transform: translateY(-2rpx);
    box-shadow: 0 4rpx 12rpx rgba(26, 29, 38, 0.2);
  }
  
  &.color-chip {
    display: flex;
    align-items: center;
    gap: 12rpx;
    
    .color-dot {
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      border: 2rpx solid rgba(0,0,0,0.1);
    }
  }
}

.note-box {
  background: #F9FAFB;
  border-radius: 24rpx;
  padding: 24rpx;
  
  .note-input {
    width: 100%;
    min-height: 100rpx;
    font-size: 28rpx;
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