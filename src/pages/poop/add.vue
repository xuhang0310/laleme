<template>
  <view class="container">
    <view class="form-card">
      <view class="section-title">基本信息</view>
      
      <view class="form-group">
        <text class="label">记录对象</text>
        <scroll-view scroll-x class="chips-scroll" :show-scrollbar="false">
          <view class="relation-selector">
            <view 
              class="relation-item" 
              v-for="(item, index) in familyMembers" 
              :key="index"
              :class="{ active: relation === item.name }"
              @click="selectRelation(item)"
            >
              <view class="member-avatar-placeholder">{{ item.name[0] }}</view>
              <text class="relation-text">{{ item.name }}</text>
              <view class="check-mark" v-if="relation === item.name">✓</view>
            </view>
            
            <view class="relation-item add-btn" @click="navigateToAddFamily">
              <text class="relation-text">+</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="form-group">
        <text class="label">记录时间</text>
        <picker mode="time" :value="time" @change="bindTimeChange">
          <view class="time-display">
            <text class="time-val">{{ time }}</text>
            <text class="arrow">></text>
          </view>
        </picker>
      </view>
    </view>

    <view class="form-card">
      <view class="section-title">便便详情</view>
      
      <view class="form-group">
        <text class="label">形状</text>
        <scroll-view scroll-x class="chips-scroll" :show-scrollbar="false">
          <view class="chips-wrapper">
            <view 
              class="chip" 
              v-for="(item, index) in shapes" 
              :key="index"
              :class="{ active: shapeIndex === index }"
              @click="shapeIndex = index"
            >
              <text>{{ item }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="form-group">
        <text class="label">颜色</text>
        <scroll-view scroll-x class="chips-scroll" :show-scrollbar="false">
           <view class="chips-wrapper">
            <view 
              class="chip" 
              v-for="(item, index) in colors" 
              :key="index"
              :class="{ active: colorIndex === index }"
              @click="colorIndex = index"
            >
              <text>{{ item }}</text>
            </view>
           </view>
        </scroll-view>
      </view>

      <view class="form-group">
        <text class="label">排便感受</text>
        <view class="feeling-list">
          <view 
            class="feeling-item" 
            v-for="(item, index) in feelings" 
            :key="index"
            :class="{ active: feelingIndex === index }"
            @click="selectFeeling(index)"
          >
            <text class="feeling-emoji">{{ item.emoji }}</text>
            <view class="feeling-content">
              <text class="feeling-title">{{ item.title }}</text>
              <text class="feeling-desc">{{ item.desc }}</text>
            </view>
            <view class="check-mark" v-if="feelingIndex === index">✓</view>
          </view>
        </view>
        
        <view class="duration-input" v-if="feelingIndex === 4">
          <text class="duration-label">具体时长(分钟)</text>
          <input 
            class="duration-field" 
            type="number" 
            v-model="customDuration" 
            placeholder="请输入"
          />
        </view>
      </view>
    </view>

    <view class="form-card">
      <view class="section-title">其他</view>
      
      <view class="form-group no-border">
        <text class="label">备注</text>
        <view class="input-wrapper">
          <input class="input" v-model="note" placeholder="写点什么..." placeholder-style="color:#C0C4CC" />
        </view>
      </view>
    </view>

    <view class="footer-action">
      <button class="save-btn" @click="saveRecord">保存记录</button>
    </view>
    
    <CustomTabBar />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import CustomTabBar from '@/components/CustomTabBar.vue'

const familyMembers = ref([])

onShow(() => {
  uni.hideTabBar()
  loadFamilyMembers()
})

const loadFamilyMembers = () => {
  const storedMembers = uni.getStorageSync('family_members') || []
  const defaultMember = { name: '本人' }
  familyMembers.value = [defaultMember, ...storedMembers]
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

const shapes = ['香蕉状', '羊粪球状', '糊状', '水状', '硬条状']
const shapeIndex = ref(0)

const colors = ['棕色', '黄色', '绿色', '黑色', '红色(请就医)']
const colorIndex = ref(0)

const feelings = [
  { emoji: '⚡️', title: '迅速解决', desc: '<5分钟，没看手机就结束了', duration: '<5' },
  { emoji: '😌', title: '轻松顺畅', desc: '5-15分钟，感觉良好', duration: '5-15' },
  { emoji: '😓', title: '有些费力', desc: '15-25分钟，花了些时间', duration: '15-25' },
  { emoji: '😖', title: '非常困难', desc: '>25分钟，耗时很长', duration: '>25' },
  { emoji: '⏱', title: '记录准确时长', desc: '点击输入具体分钟数', duration: 'custom' }
]
const feelingIndex = ref(1) // Default to '轻松顺畅'
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
  let duration = selectedFeeling.duration
  
  if (feelingIndex.value === 4) {
    if (!customDuration.value) {
      uni.showToast({
        title: '请输入具体时长',
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
        title: '记录成功',
        icon: 'success'
      })
    
      setTimeout(() => {
    uni.switchTab({
      url: '/pages/poop/index'
    })
  }, 1500)
  } catch (e) {
      uni.showToast({
          title: '存储空间不足',
          icon: 'none'
      })
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: $uni-bg-color;
  padding: 20px 16px 100px;
}

.form-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(130, 201, 160, 0.1);
  
  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: $uni-text-color;
    margin-bottom: 16px;
  }
}

.form-group {
  margin-bottom: 24px;
  
  &.no-border {
    margin-bottom: 0;
  }
  
  .label {
    font-size: 13px;
    color: $uni-text-color-grey;
    margin-bottom: 10px;
    display: block;
    font-weight: 500;
  }
}

.relation-selector {
  display: flex;
  gap: 12px;
  padding-right: 20px; /* Add padding for scroll end */
  
  .relation-item {
    min-width: 80px; /* Ensure minimum width */
    padding: 0 12px;
    height: 44px;
    background: $uni-bg-color;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1px solid $uni-border-color;
    transition: all 0.2s;
    flex-shrink: 0; /* Prevent shrinking */
    
    .member-avatar-placeholder {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-right: 6px;
      background: $uni-color-primary-light;
      color: $uni-text-color;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    
    .relation-text {
      font-size: 14px;
      color: $uni-text-color-grey;
      font-weight: 500;
    }
    
    &.active {
      background: $uni-color-primary;
      border-color: $uni-color-primary;
      .relation-text {
        color: white;
      }
      .member-avatar-placeholder {
        background: white;
        color: $uni-color-primary;
      }
    }
    
    &.add-btn {
      min-width: 44px;
      width: 44px;
      padding: 0;
      background: white;
      border: 1px dashed #B0BEC5;
      
      .relation-text {
        font-size: 20px;
        color: #B0BEC5;
        font-weight: 300;
      }
      
      &:active {
        background: $uni-bg-color-grey;
      }
    }
    
    .check-mark {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      color: $uni-color-primary;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  }
}

.time-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: $uni-bg-color;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid $uni-border-color;
  
  .time-val {
    font-size: 16px;
    font-weight: 600;
    color: $uni-text-color;
  }
  .arrow {
    color: #B0BEC5;
  }
}

.chips-scroll {
  white-space: nowrap;
  width: 100%;
}

.chips-wrapper {
  display: flex;
  gap: 10px;
  padding-bottom: 4px; // 避免滚动条影响
}

.chip {
  display: inline-block;
  padding: 8px 16px;
  background: $uni-bg-color;
  border: 1px solid $uni-border-color;
  border-radius: 20px;
  font-size: 13px;
  color: $uni-text-color-grey;
  transition: all 0.2s;
  
  &.active {
    background: $uni-color-primary;
    color: white;
    border-color: $uni-color-primary;
    font-weight: 500;
  }
}

.input-wrapper {
  background: $uni-bg-color;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid $uni-border-color;
  
  .input {
    font-size: 14px;
    width: 100%;
    color: $uni-text-color;
  }
}

.footer-action {
  position: fixed;
  bottom: calc(50px + env(safe-area-inset-bottom)); /* Sit above the custom tab bar */
  left: 0;
  right: 0;
  background: white;
  padding: 16px 20px;
  box-shadow: 0 -4px 12px rgba(130, 201, 160, 0.1);
  z-index: 10;
  
  .save-btn {
    background: $uni-color-primary;
    color: white;
    border-radius: 24px;
    font-weight: 600;
    font-size: 16px;
    height: 48px;
    line-height: 48px;
    border: none;
    box-shadow: 0 4px 12px rgba(130, 201, 160, 0.4);
    
    &:active {
      opacity: 0.9;
    }
  }
}

.feeling-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feeling-item {
  background: $uni-bg-color;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  border: 1px solid $uni-border-color;
  transition: all 0.2s;
  position: relative;
  
  &.active {
    background: #E8F5E9;
    border-color: $uni-color-primary;
    
    .feeling-emoji {
      transform: scale(1.1);
    }
  }
  
  .feeling-emoji {
    font-size: 24px;
    margin-right: 12px;
    transition: transform 0.2s;
  }
  
  .feeling-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .feeling-title {
      font-size: 14px;
      font-weight: 600;
      color: $uni-text-color;
      margin-bottom: 2px;
    }
    
    .feeling-desc {
      font-size: 12px;
      color: $uni-text-color-grey;
    }
  }
  
  
  .check-mark {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 18px;
    height: 18px;
    background: #4B6EF6;
    border-radius: 50%;
    color: white;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.duration-input {
  margin-top: 12px;
  background: #F9FAFB;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #E5E7EB;
  
  .duration-label {
    font-size: 14px;
    color: #4B5563;
  }
  
  .duration-field {
    text-align: right;
    font-size: 16px;
    color: #1A1D26;
    width: 100px;
  }
}
</style>
