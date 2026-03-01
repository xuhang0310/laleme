<template>
  <view
    class="card"
    :class="[
      `card-${variant}`,
      `card-padding-${padding}`,
      { 'card-clickable': clickable }
    ]"
    :style="customStyle"
    @click="handleClick"
  >
    <slot />
  </view>
</template>

<script setup>
defineProps({
  // 卡片变体
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'glass', 'highlight', 'bordered'].includes(value)
  },
  // 内边距大小
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'none'].includes(value)
  },
  // 是否可点击
  clickable: {
    type: Boolean,
    default: false
  },
  // 自定义样式
  customStyle: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (clickable) {
    emit('click')
  }
}
</script>

<style lang="scss">
.card {
  background-color: #FFFFFF;
  border-radius: 24rpx;
  transition: all 0.2s ease;
  overflow: hidden;
}

/* 变体样式 */
.card-default {
  background-color: #FFFFFF;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.card-glass {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-highlight {
  background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
  border: 1px solid rgba(0, 230, 118, 0.2);
}

.card-bordered {
  background-color: #FFFFFF;
  border: 2rpx solid #E5E7EB;
  box-shadow: none;
}

/* 内边距样式 */
.card-padding-sm {
  padding: 16rpx;
}

.card-padding-md {
  padding: 24rpx;
}

.card-padding-lg {
  padding: 32rpx;
}

.card-padding-none {
  padding: 0;
}

/* 可点击状态 */
.card-clickable {
  cursor: pointer;
}

.card-clickable:active {
  transform: scale(0.98);
}
</style>
