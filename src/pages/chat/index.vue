<template>
  <view class="manor-container">
    <!-- 沉浸式背景 -->
    <view class="background-layer">
      <image class="bg-image" src="/static/bg.png" mode="aspectFill"></image>
    </view>

    <!-- 自定义导航栏 -->
    <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @click="handleBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
        <text class="nav-title">巴迪乐园</text>
        <view class="nav-placeholder"></view> <!-- 占位，保持标题居中 -->
      </view>
    </view>

    <!-- 顶部功能区 (模拟蚂蚁庄园右上角) - 暂时隐藏 -->
    <!-- <view class="top-actions">
      <view class="action-bubble" @click="handleMore">
        <view class="dots">
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
        </view>
        <text class="bubble-label">更多</text>
      </view>
    </view> -->

    <!-- 核心互动区 -->
    <view class="pet-wrapper">
      <!-- 对话气泡 -->
      <view class="chat-bubble" :class="{ 'show': showBubble }">
        <text>{{ currentMessage }}</text>
        <view class="bubble-arrow"></view>
      </view>

      <!-- 小狗组件 (卡通形象) -->
      <PetCartoon @interact="handlePetTouch" />
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <!-- 左侧：领狗粮 -->
      <view class="tool-item" @click="handleGetFood">
        <view class="icon-circle secondary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 17V11C20 7.13 16.42 4 12 4C7.58 4 4 7.13 4 11V17" stroke="#8D6E63" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 22C14.2091 22 16 20.2091 16 18H8C8 20.2091 9.79086 22 12 22Z" fill="#8D6E63"/>
            <path d="M8 18H16" stroke="#8D6E63" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </view>
        <text class="tool-label">领狗粮</text>
      </view>

      <!-- 中间：喂食 (大按钮) -->
      <view class="tool-item main-action" @click="handleFeed">
        <view class="icon-circle primary">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="white" fill-opacity="0.3"/>
            <path d="M17 13H15V11H17V9H15V7H13V9H11V7H9V9H7V11H9V13H7V15H9V17H11V15H13V17H15V15H17V13Z" fill="white"/>
          </svg>
        </view>
        <text class="tool-label">喂食</text>
      </view>

      <!-- 右侧：聊天 -->
      <view class="tool-item" @click="handleChat">
        <view class="icon-circle secondary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 18.25H21.5V12C21.5 6.2 17.25 2 12 2C6.75 2 2.5 6.2 2.5 12C2.5 17.8 6.75 22 12 22C13.25 22 14.5 21.75 15.5 21.25L17 22V18.25Z" stroke="#5D4037" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8.5 12H15.5" stroke="#5D4037" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
        <text class="tool-label">聊天</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PetCartoon from '@/components/PetCartoon.vue'

// 状态栏高度适配
const statusBarHeight = ref(20)

// 状态
const showBubble = ref(true)
const currentMessage = ref('主人，你终于来看我啦！')

onMounted(() => {
  // 获取系统信息用于导航栏适配
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 20
  
  // 启动定时器
  setInterval(refreshMessage, 8000)
})

const handleBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack({
      delta: 1
    })
  } else {
    // 如果没有上一页，则重定向到首页
    // 注意：如果首页是 tabBar 页面，请使用 uni.switchTab
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

// 随机语录库
const messages = [
  '今天天气真不错呀汪！',
  '我的肚子有点饿了...',
  '陪我玩球球好不好？',
  '刚刚看到一只蝴蝶飞过去！',
  '主人，工作辛苦啦！',
  '想吃好吃的肉骨头~'
]

// 切换语录
const refreshMessage = () => {
  showBubble.value = false
  setTimeout(() => {
    const index = Math.floor(Math.random() * messages.length)
    currentMessage.value = messages[index]
    showBubble.value = true
  }, 200)
}

// 触摸小狗交互
const handlePetTouch = () => {
  refreshMessage()
}

// 按钮功能
const handleGetFood = () => {
  uni.showToast({ title: '任务中心开发中...', icon: 'none' })
}

const handleFeed = () => {
  uni.showToast({ title: '投喂成功！+10 亲密度', icon: 'success' })
  // 这里未来可以触发进食动画
}

const handleChat = () => {
  // 这里可以跳转到纯文本聊天记录页，或者弹出一个全屏聊天窗
  uni.showToast({ title: '进入聊天模式', icon: 'none' })
}

/*
const handleMore = () => {
  uni.showActionSheet({
    itemList: ['更换装扮', '查看日记', '拍照分享'],
    success: (res) => {
      console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
    }
  });
}
*/

// 定时切换语录
// onMounted moved to top for organization
</script>

<style lang="scss" scoped>
.manor-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 背景层 */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  display: block;
}

/* 自定义导航栏 */
.custom-nav {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.nav-content {
  height: 44px; /* 标准导航栏高度 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* 增加点击区域 */
  padding: 10rpx; 
  margin-left: -10rpx;
}

.nav-title {
  font-size: 34rpx;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
}

.nav-placeholder {
  width: 60rpx;
}

/* 顶部操作区 */
.top-actions {
  position: absolute;
  top: 100rpx;
  right: 30rpx;
  z-index: 10;
}

.action-bubble {
  background: rgba(255, 255, 255, 0.9);
  padding: 12rpx 24rpx;
  border-radius: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  
  .dots {
    display: flex;
    gap: 4rpx;
    margin-bottom: 4rpx;
    
    .dot {
      width: 6rpx;
      height: 6rpx;
      background: #5D4037;
      border-radius: 50%;
    }
  }
  
  .bubble-label {
    font-size: 20rpx;
    color: #5D4037;
    font-weight: bold;
  }
}

/* 核心互动区 */
.pet-wrapper {
  position: absolute;
  /* 进一步下调，贴合地面 */
  bottom: 16%; 
  left: 50%;
  transform: translateX(-50%); /* 仅水平居中 */
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chat-bubble {
  background: #fff;
  padding: 20rpx 32rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  position: relative;
  max-width: 400rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);
  opacity: 0;
  transform: translateY(10rpx);
  transition: all 0.3s ease;
  
  &.show {
    opacity: 1;
    transform: translateY(0);
  }
  
  text {
    font-size: 28rpx;
    color: #333;
    line-height: 1.4;
  }
  
  .bubble-arrow {
    position: absolute;
    bottom: -12rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 12rpx solid transparent;
    border-right: 12rpx solid transparent;
    border-top: 12rpx solid #fff;
  }
}

/* 底部操作栏 */
.bottom-bar {
  position: absolute;
  bottom: 60rpx;
  left: 40rpx;
  right: 40rpx;
  z-index: 10;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .icon-circle {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.15);
    background: #fff;
    transition: transform 0.1s;
    
    &:active {
      transform: scale(0.95);
    }
    
    &.primary {
      background: linear-gradient(135deg, #FF7043 0%, #F4511E 100%);
      width: 130rpx;
      height: 130rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 8rpx 20rpx rgba(244, 81, 30, 0.4);
    }
  }
  
  .tool-label {
    font-size: 26rpx;
    color: #fff;
    text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
    font-weight: 600;
  }
}
</style>
