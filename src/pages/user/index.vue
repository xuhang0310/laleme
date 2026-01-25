<template>
  <view class="container">
    <view class="user-card">
      <view class="avatar-area">
        <view class="avatar"></view>
      </view>
      <view class="info-area">
        <text class="username">微信用户</text>
        <text class="user-id">ID: 888888</text>
      </view>
      <view class="edit-btn">
        <text>编辑</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="handleMenuClick('appointments')">
        <view class="left">
          <text class="icon">📅</text>
          <text class="label">我的预约</text>
        </view>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="handleMenuClick('report')">
        <view class="left">
          <text class="icon">📊</text>
          <text class="label">健康周报</text>
        </view>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="handleMenuClick('settings')">
        <view class="left">
          <text class="icon">⚙️</text>
          <text class="label">设置</text>
        </view>
        <text class="arrow">></text>
      </view>
    </view>
    
    <CustomTabBar />
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import CustomTabBar from '@/components/CustomTabBar.vue'

onShow(() => {
  uni.hideTabBar()
})

const handleMenuClick = (type) => {
  if (type === 'report') {
    uni.navigateTo({
      url: '/pages/poop/report'
    })
  } else {
    uni.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F5F7FA;
  padding: 20px;
}

.user-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  
  .avatar-area {
    margin-right: 16px;
    .avatar {
      width: 64px;
      height: 64px;
      background: #F3F4F6;
      border-radius: 32px;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  }
  
  .info-area {
    flex: 1;
    .username {
      font-size: 18px;
      font-weight: 700;
      color: #1A1D26;
      display: block;
      margin-bottom: 4px;
    }
    .user-id {
      font-size: 12px;
      color: #9CA3AF;
    }
  }
  
  .edit-btn {
    font-size: 12px;
    color: #6B7280;
    padding: 4px 12px;
    background: #F9FAFB;
    border-radius: 12px;
  }
}

.menu-section {
  background: white;
  border-radius: 16px;
  padding: 8px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #F3F4F6;
    
    &:last-child {
      border-bottom: none;
    }
    
    .left {
      display: flex;
      align-items: center;
      .icon {
        font-size: 18px;
        margin-right: 12px;
        width: 24px;
        text-align: center;
      }
      .label {
        font-size: 15px;
        color: #1A1D26;
        font-weight: 500;
      }
    }
    
    .arrow {
      color: #D1D5DB;
      font-size: 14px;
    }
    
    &:active {
      background: #F9FAFB;
    }
  }
}
</style>
