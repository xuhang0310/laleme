<template>
  <view class="container">
    <view class="form-card">
      <view class="section-title">基本信息</view>
      
      <view class="form-group">
        <text class="label">称呼</text>
        <view class="input-wrapper">
          <input class="input" v-model="name" placeholder="例如：宝宝、爷爷" placeholder-style="color:#C0C4CC" />
        </view>
      </view>

      <view class="form-group">
        <text class="label">性别</text>
        <view class="relation-selector">
          <view 
            class="relation-item" 
            v-for="(item, index) in genders" 
            :key="index"
            :class="{ active: gender === item }"
            @click="gender = item"
          >
            <text class="relation-text">{{ item }}</text>
            <view class="check-mark" v-if="gender === item">✓</view>
          </view>
        </view>
      </view>

      <view class="form-group no-border">
        <text class="label">出生年月</text>
        <picker mode="date" :value="birthday" @change="bindDateChange">
          <view class="time-display">
            <text class="time-val">{{ birthday || '请选择出生日期' }}</text>
            <text class="arrow">></text>
          </view>
        </picker>
      </view>
    </view>

    <view class="footer-action">
      <button class="save-btn" @click="saveMember">保存家人</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const gender = ref('男')
const genders = ['男', '女']
const birthday = ref('')

const bindDateChange = (e) => {
  birthday.value = e.detail.value
}

const saveMember = () => {
  if (!name.value) {
    uni.showToast({
      title: '请输入称呼',
      icon: 'none'
    })
    return
  }
  if (!birthday.value) {
    uni.showToast({
      title: '请选择出生日期',
      icon: 'none'
    })
    return
  }

  const member = {
    id: Date.now().toString(),
    name: name.value,
    gender: gender.value,
    birthday: birthday.value
  }

  const members = uni.getStorageSync('family_members') || []
  // Check for duplicate names? Let's allow duplicates for now or simple check
  // const exists = members.find(m => m.name === name.value)
  // if (exists) { ... }
  
  members.push(member)
  
  try {
    uni.setStorageSync('family_members', members)
    uni.showToast({
      title: '添加成功',
      icon: 'success'
    })
    
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    uni.showToast({
      title: '存储失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F5F7FA;
  padding: 20px 16px 100px;
}

.form-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  
  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #1A1D26;
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
    color: #6B7280;
    margin-bottom: 10px;
    display: block;
    font-weight: 500;
  }
}

.input-wrapper {
  background: #F9FAFB;
  padding: 12px 16px;
  border-radius: 10px;
  
  .input {
    font-size: 14px;
    width: 100%;
    color: #1A1D26;
  }
}

.relation-selector {
  display: flex;
  gap: 12px;
  
  .relation-item {
    flex: 1;
    height: 44px;
    background: #F3F4F6;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1px solid transparent;
    transition: all 0.2s;
    
    .relation-text {
      font-size: 14px;
      color: #4B5563;
      font-weight: 500;
    }
    
    &.active {
      background: #EFF6FF;
      border-color: #4B6EF6;
      .relation-text {
        color: #4B6EF6;
      }
    }
    
    .check-mark {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 16px;
      height: 16px;
      background: #4B6EF6;
      border-radius: 50%;
      color: white;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.time-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #F9FAFB;
  padding: 12px 16px;
  border-radius: 10px;
  
  .time-val {
    font-size: 16px;
    font-weight: 600;
    color: #1A1D26;
  }
  .arrow {
    color: #9CA3AF;
  }
}

.footer-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px 20px 30px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
  z-index: 10;
  
  .save-btn {
    background: linear-gradient(135deg, #4B6EF6 0%, #2563EB 100%);
    color: white;
    border-radius: 24px;
    font-weight: 600;
    font-size: 16px;
    height: 48px;
    line-height: 48px;
    border: none;
    
    &:active {
      opacity: 0.9;
    }
  }
}
</style>