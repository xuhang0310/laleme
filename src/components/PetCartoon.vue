<template>
  <view 
    class="pet-cartoon-container" 
    @touchstart="handleTouchStart" 
    @touchend="handleTouchEnd" 
    @touchcancel="handleTouchEnd"
  >
    <!-- 卡通小狗形象 -->
    <image 
      class="pet-image" 
      :class="{ 
        'breathing': !isInteracting && status !== 'eating', 
        'squeezed': isPressed,
        'eating-anim': status === 'eating'
      }"
      :src="petImageSrc" 
      mode="aspectFit"
    ></image>
  </view>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'normal' // normal, eating, happy, sad/hungry
  }
})

const isPressed = ref(false)
const isInteracting = ref(false)

// 动态计算图片路径
const petImageSrc = computed(() => {
  // 简单映射
  if (props.status === 'sad' || props.status === 'hungry') {
    return '/static/puppy_hugry.png'
  }
  // eating 状态暂时也用 katong，配合动画，或者如果有专门的 eating 图可以换
  // happy 状态也用 katong
  return '/static/puppy_katong.png'
})

// 监听状态变化，触发特殊动画
watch(() => props.status, (newVal) => {
  if (newVal === 'eating') {
    isInteracting.value = true
    // 进食动画持续时间
    setTimeout(() => {
      // 父组件负责切回 normal
    }, 2000)
  }
})

const handleTouchStart = () => {
  isPressed.value = true
  isInteracting.value = true
  
  // 触觉反馈
  uni.vibrateShort({
    success: () => console.log('vibrate success')
  })
  
  // 向父组件抛出事件
  emit('interact')
}

const handleTouchEnd = () => {
  isPressed.value = false
  
  // 延迟恢复呼吸
  setTimeout(() => {
    isInteracting.value = false
  }, 500)
}

const emit = defineEmits(['interact'])
</script>

<style scoped>
.pet-cartoon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 280rpx; /* 缩小尺寸：400rpx -> 320rpx */
  height: 280rpx;
}

.pet-image {
  width: 100%;
  height: 100%;
  /* 优化变换性能 */
  will-change: transform; 
  transition: transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 呼吸动画 (针对卡通形象微调，幅度稍大一点更可爱) */
@keyframes breathe {
  0% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.05) translateY(-8rpx);
  }
  100% {
    transform: scale(1) translateY(0);
  }
}

.breathing {
  animation: breathe 3s ease-in-out infinite;
}

/* 进食动画：快速咀嚼/弹跳 */
@keyframes eating {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.05) rotate(-2deg); }
  50% { transform: scale(1) rotate(0deg); }
  75% { transform: scale(1.05) rotate(2deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.eating-anim {
  animation: eating 0.3s ease-in-out infinite;
}

/* 按压效果 */
.squeezed {
  transform: scale(0.9) !important;
}
</style>
