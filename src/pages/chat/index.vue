<template>
  <view class="manor-container">
    <!-- 沉浸式背景 -->
    <view class="background-layer">
      <image class="bg-image" src="/static/bg.png" mode="aspectFill"></image>
    </view>

    <!-- 自定义导航栏 -->
    <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content" @click="handleBack">
         <image src="../../static/back-white.png" style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFit" />
        <text class="nav-title">巴迪乐园</text>
      </view>
    </view>

    <!-- 状态指示器 (新增) -->
    <view class="status-panel" :style="{ top: (statusBarHeight + 50) + 'px' }">
      <view class="status-row">
        <text class="status-emoji">🍖</text>
        <view class="progress-track">
          <view class="progress-fill hunger" :style="{ width: petStore.hunger + '%' }"></view>
        </view>
      </view>
      <view class="status-row">
        <text class="status-emoji">❤️</text>
        <view class="progress-track">
          <!-- 假设每级100经验 -->
          <view class="progress-fill love" :style="{ width: (petStore.exp % 100) + '%' }"></view>
        </view>
        <text class="level-tag">Lv.{{ petStore.level }}</text>
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
      <PetCartoon :status="petStore.status" @interact="handlePetTouch" />
    </view>

    <!-- 领狗粮弹窗 -->
    <FoodActionSheet 
      v-model:visible="showFoodSheet" 
      @claim-success="handleClaimSuccess"
    />

    <!-- 投喂动画元素 -->
    <view v-if="isFlying" class="flying-food">
      <image src="/static/gouliang.png" mode="aspectFit" class="fly-img" />
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <!-- 左侧：领狗粮 -->
      <view class="tool-item" @click="handleGetFood">
        <image src="/static/gouliang.png" class="tool-icon" mode="aspectFit" />
 
      </view>

      <!-- 中间：喂食 (大按钮) -->
      <view class="tool-item" @click="handleFeed">
         <image src="/static/chifan.png" class="tool-icon large" mode="aspectFit" />
      </view>

      <!-- 右侧：聊天 -->
      <view class="tool-item" @click="handleChat">
           <image src="/static/play.png" class="tool-icon" mode="aspectFit" />

      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import PetCartoon from '@/components/PetCartoon.vue'
import FoodActionSheet from '@/components/FoodActionSheet.vue'
import { usePetStore } from '@/stores/pet'
import { useUserStore } from '@/stores/user'

const petStore = usePetStore()
const userStore = useUserStore()

// 状态栏高度适配
const statusBarHeight = ref(20)

// 状态
const showBubble = ref(true)
const showFoodSheet = ref(false)
const isFlying = ref(false) // 投喂动画开关
const currentMessage = ref('主人，你终于来看我啦！')

onShow(() => {
  petStore.checkHunger()
  userStore.checkDailyReset()
})

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
  showFoodSheet.value = true
}

const handleClaimSuccess = (amount) => {
  // 可以播放音效或做一些额外的动画
  // 暂时不需要额外的逻辑，因为 toast 和数据更新已经在组件内完成了
  // 如果想让小狗说句话：
  currentMessage.value = `哇！又有 ${amount}g 饭饭啦！`
  showBubble.value = true
}

const handleFeed = () => {
  if (petStore.status === 'eating') return // 防止连点

  const result = petStore.feed()
  
  if (!result.success) {
    if (result.code === 'INSUFFICIENT_FUNDS') {
      petStore.setStatus('sad') // 切换到伤心/饥饿图
      currentMessage.value = '肚子好饿，可是没有粮了...'
      showBubble.value = true
      
      uni.showModal({
        title: '粮仓告急',
        content: result.msg,
        confirmText: '去领粮',
        success: (res) => {
          if (res.confirm) {
            handleGetFood()
          }
          // 延迟恢复正常
          setTimeout(() => { petStore.updateStatus() }, 2000)
        }
      })
    } else if (result.code === 'FULL') {
       currentMessage.value = '嗝~ 已经吃不下了汪！'
       showBubble.value = true
       uni.showToast({ title: result.msg, icon: 'none' })
    } else {
      uni.showToast({ title: result.msg, icon: 'none' })
    }
    return
  }
  
  // 成功
  // 1. 播放飞入动画
  isFlying.value = true
  
  // 2. 震动
  uni.vibrateShort()

  // 3. 动画结束后切换小狗状态
  setTimeout(() => {
    isFlying.value = false
    petStore.setStatus('eating')
    currentMessage.value = '好香好香！最爱主人了！'
    showBubble.value = true
    
    // 提示
    let tip = `投喂成功`
    if (result.expDelta > 0) {
      tip += `，亲密度+${result.expDelta}`
    } else {
      tip += `，饱食度+${result.hungerDelta}`
    }
    uni.showToast({ title: tip, icon: 'none' })
    
    // 恢复正常
    setTimeout(() => {
      petStore.updateStatus()
    }, 2000)
  }, 600) // 飞行时间 0.6s
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
  justify-content: flex-start; /* 左对齐 */
  padding: 0 24rpx; /* 调整左边距 */
}

.nav-title {
  color: #fff;
  font-size: 34rpx;
  font-weight: 500;
  margin-left: 4rpx; /* 标题与箭头的间距 */
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
    bottom: -16rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 16rpx solid transparent;
    border-right: 16rpx solid transparent;
    border-top: 16rpx solid #fff;
  }
}

/* 飞入动画 */
.flying-food {
  position: absolute;
  bottom: 150rpx; /* 起点：底部按钮附近 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  animation: flyToMouth 0.6s ease-in forwards;
  pointer-events: none;

  .fly-img {
    width: 60rpx;
    height: 60rpx;
  }
}

@keyframes flyToMouth {
  0% {
    bottom: 150rpx;
    opacity: 1;
    transform: translateX(-50%) scale(0.5);
  }
  100% {
    bottom: 50%; /* 终点：屏幕中间偏上 (嘴巴位置) */
    opacity: 0.8;
    transform: translateX(-50%) scale(1);
  }
}

/* 底部操作栏 */
.bottom-bar {
  position: absolute;
  bottom: 80rpx; /* 稍微抬高 */
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
  position: relative;
  
  .tool-icon {
    width: 150rpx;
    height: 150rpx;
    margin-bottom: -10rpx;
    filter: drop-shadow(0 4rpx 8rpx rgba(0,0,0,0.2));
    transition: transform 0.1s;
    
    &:active {
      transform: scale(0.9);
    }

    &.large {
      width: 190rpx;
      height: 190rpx;
    }
  }
  
  .tool-label {
    font-size: 32rpx; /* 字体加大 */
    color: #fff;
    font-weight: 900;
    z-index: 2;
    letter-spacing: 2rpx;
    /* 描边效果模拟 */
    text-shadow: 
      -3rpx -3rpx 0 #4E342E,  
       3rpx -3rpx 0 #4E342E,
      -3rpx  3rpx 0 #4E342E,
       3rpx  3rpx 0 #4E342E,
       0 4rpx 8rpx rgba(0,0,0,0.5);
  }
}

.status-panel {
  position: absolute;
  left: 30rpx;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.status-row {
  display: flex;
  align-items: center;
  background: rgba(0,0,0,0.3);
  padding: 8rpx 16rpx;
  border-radius: 30rpx;
  backdrop-filter: blur(4px);
}
.status-emoji {
  font-size: 28rpx;
  margin-right: 10rpx;
}
.progress-track {
  width: 160rpx;
  height: 12rpx;
  background: rgba(255,255,255,0.3);
  border-radius: 6rpx;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.5s ease;
  
  &.hunger { background: #FF9800; }
  &.love { background: #E91E63; }
}
.level-tag {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
  margin-left: 10rpx;
}
</style>
