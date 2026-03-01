<template>
  <button
    class="btn"
    :class="[
      `btn-${variant}`,
      `btn-size-${size}`,
      `btn-shape-${shape}`,
      {
        'btn-loading': loading,
        'btn-disabled': disabled,
        'btn-block': block,
        'btn-icon': icon
      }
    ]"
    :disabled="disabled || loading"
    :loading="loading"
    @click="handleClick"
  >
    <view class="btn-content">
      <slot name="icon" v-if="icon"></slot>
      <text class="btn-text" v-if="$slots.default"><slot /></text>
    </view>
  </button>
</template>

<script setup>
defineProps({
  // 按钮变体
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(value)
  },
  // 按钮尺寸
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  // 按钮形状
  shape: {
    type: String,
    default: 'rounded',
    validator: (value) => ['square', 'rounded', 'pill'].includes(value)
  },
  // 是否加载中
  loading: {
    type: Boolean,
    default: false
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否块级按钮
  block: {
    type: Boolean,
    default: false
  },
  // 是否图标按钮
  icon: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (e) => {
  if (!disabled && !loading) {
    emit('click', e)
  }
}
</script>

<style lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  font-family: inherit;
  transition: all 0.2s ease;
  position: relative;
  background: none;
  padding: 0;

  &::after {
    display: none;
  }
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

/* 按钮尺寸 */
.btn-size-sm {
  height: 56rpx;
  min-width: 120rpx;
  padding: 0 24rpx;
  font-size: 24rpx;
}

.btn-size-md {
  height: 72rpx;
  min-width: 160rpx;
  padding: 0 32rpx;
  font-size: 28rpx;
}

.btn-size-lg {
  height: 96rpx;
  min-width: 240rpx;
  padding: 0 48rpx;
  font-size: 32rpx;
}

/* 按钮形状 */
.btn-shape-square {
  border-radius: 0;
}

.btn-shape-rounded {
  border-radius: 12rpx;
}

.btn-shape-pill {
  border-radius: 9999rpx;
}

/* 按钮变体 */
.btn-primary {
  background: linear-gradient(135deg, #00E676 0%, #10B981 100%);
  color: #FFFFFF;
  box-shadow: 0 4rpx 16rpx rgba(0, 230, 118, 0.3);
}

.btn-primary:active:not(.btn-disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 2rpx 8rpx rgba(0, 230, 118, 0.2);
}

.btn-secondary {
  background-color: #F3F4F6;
  color: #1A1D26;
}

.btn-secondary:active:not(.btn-disabled) {
  background-color: #E5E7EB;
}

.btn-outline {
  background-color: transparent;
  border: 2rpx solid #00E676;
  color: #00E676;
}

.btn-outline:active:not(.btn-disabled) {
  background-color: rgba(0, 230, 118, 0.1);
}

.btn-ghost {
  background-color: transparent;
  color: #1A1D26;
}

.btn-ghost:active:not(.btn-disabled) {
  background-color: #F3F4F6;
}

.btn-danger {
  background-color: #FEF2F2;
  color: #EF4444;
  border: 2rpx solid #FECACA;
}

.btn-danger:active:not(.btn-disabled) {
  background-color: #FEE2E2;
}

/* 块级按钮 */
.btn-block {
  width: 100%;
}

/* 加载中状态 */
.btn-loading {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 禁用状态 */
.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 图标按钮 */
.btn-icon {
  width: 72rpx;
  height: 72rpx;
  padding: 0;
  border-radius: 50%;
}

.btn-icon.btn-size-sm {
  width: 56rpx;
  height: 56rpx;
}

.btn-icon.btn-size-lg {
  width: 96rpx;
  height: 96rpx;
}
</style>
