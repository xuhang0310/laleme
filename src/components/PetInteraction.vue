<template>
  <view 
    class="pet-container" 
    @touchstart="handleTouchStart" 
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd" 
    @touchcancel="handleTouchEnd"
  >
    <!-- 背景光环 (可选) -->
    <view v-if="showBackground" class="pet-circle-bg"></view>
    
    <!-- 移动层：负责位移跟随 -->
    <view class="pet-mover" :style="moverStyle">
      <!-- 动画层：负责呼吸和挤压 -->
      <image 
        class="pet-avatar" 
        :class="{ 'breathing': !isInteracting, 'squeezed': isPressed }"
        src="/static/puppy_hugry.png" 
        mode="aspectFit"
      ></image>
    </view>

    <!-- 状态气泡 (可选) -->
    <view v-if="showStatus" class="status-pill">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 4px;">
        <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" fill="#00E676"/>
      </svg>
      <text class="status-text">开心</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  showBackground: {
    type: Boolean,
    default: true
  },
  showStatus: {
    type: Boolean,
    default: true
  }
})

const isPressed = ref(false)
const isInteracting = ref(false)

// 触摸位置状态
const touchStartX = ref(0)
const touchStartY = ref(0)
const moveX = ref(0)
const moveY = ref(0)

const moverStyle = computed(() => {
  return {
    transform: `translate(${moveX.value}px, ${moveY.value}px)`
  }
})

// 抚摸开始
const handleTouchStart = (e) => {
  isPressed.value = true
  isInteracting.value = true
  
  if (e.touches.length > 0) {
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
  }
  
  // 触觉反馈
  uni.vibrateShort({
    success: () => console.log('vibrate success')
  })
}

// 手指移动 (视差跟随)
const handleTouchMove = (e) => {
  // 阻止页面滚动 (如果需要完全沉浸式体验，可以加上 .stop 修饰符，但这里主要是在组件内)
  // e.stopPropagation() 
  
  if (e.touches.length > 0) {
    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    
    // 计算偏移量
    const deltaX = currentX - touchStartX.value
    const deltaY = currentY - touchStartY.value
    
    // 限制移动范围 (+/- 20px) 并添加阻尼系数 (0.2)
    const damping = 0.2
    const maxMove = 20
    
    moveX.value = Math.max(Math.min(deltaX * damping, maxMove), -maxMove)
    moveY.value = Math.max(Math.min(deltaY * damping, maxMove), -maxMove)
  }
}

// 抚摸结束
const handleTouchEnd = () => {
  isPressed.value = false
  
  // 复位
  moveX.value = 0
  moveY.value = 0
  
  // 延迟恢复呼吸，避免动画突变
  setTimeout(() => {
    isInteracting.value = false
  }, 500)
}
</script>

<style scoped>
.pet-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 400rpx;
  width: 100%;
}

.pet-circle-bg {
  position: absolute;
  width: 400rpx;
  height: 400rpx;
  border-radius: 50%;
  border: 8rpx solid #E8F5E9;
  box-sizing: border-box;
}

.pet-mover {
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 平滑复位 */
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.pet-avatar {
  width: 360rpx;
  height: 360rpx;
  border-radius: 50%;
  /* 优化变换性能 */
  will-change: transform; 
  transition: transform 0.1s ease-out;
}

/* 呼吸动画 */
@keyframes breathe {
  0% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.03) translateY(-6rpx);
  }
  100% {
    transform: scale(1) translateY(0);
  }
}

.breathing {
  animation: breathe 3s ease-in-out infinite;
}

/* 按压效果 (Q弹) */
.squeezed {
  transform: scale(0.9) !important;
}

.status-pill {
  position: absolute;
  bottom: 20rpx;
  right: 120rpx;
  background-color: #fff;
  padding: 12rpx 32rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  border: 2rpx solid #00E676;
  z-index: 2;
}

.status-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}
</style>
