<template>
  <view class="empty-state" :style="{ padding: `${verticalPadding}rpx ${horizontalPadding}rpx` }">
    <!-- 自定义图片或图标 -->
    <view class="empty-image" :style="{ width: `${imageSize}px`, height: `${imageSize}px` }">
      <image
        v-if="image"
        :src="image"
        mode="aspectFit"
        class="empty-img"
      />
      <svg
        v-else
        class="empty-svg"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9.34l-7-7L9 3zm0 2.83L14.17 11H10V5.83zM12 14a1 1 0 100 2 1 1 0 000-2zm-4 0a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z"
          fill="#E5E7EB"
        />
      </svg>
    </view>

    <!-- 标题 -->
    <text class="empty-title" v-if="title">{{ title }}</text>

    <!-- 描述 -->
    <text class="empty-description" v-if="description">{{ description }}</text>

    <!-- 操作按钮 -->
    <view class="empty-actions" v-if="$slots.actions">
      <slot name="actions" />
    </view>
  </view>
</template>

<script setup>
defineProps({
  // 图片 URL
  image: {
    type: String,
    default: ''
  },
  // 标题
  title: {
    type: String,
    default: '暂无数据'
  },
  // 描述文字
  description: {
    type: String,
    default: ''
  },
  // 图片尺寸（像素）
  imageSize: {
    type: Number,
    default: 160
  },
  // 垂直内边距
  verticalPadding: {
    type: Number,
    default: 80
  },
  // 水平内边距
  horizontalPadding: {
    type: Number,
    default: 40
  }
})
</script>

<style lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-image {
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
}

.empty-img {
  width: 100%;
  height: 100%;
}

.empty-svg {
  width: 100%;
  height: 100%;
}

.empty-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 16rpx;
}

.empty-description {
  font-size: 24rpx;
  color: #9CA3AF;
  line-height: 1.5;
  max-width: 480rpx;
}

.empty-actions {
  margin-top: 40rpx;
  display: flex;
  gap: 20rpx;
}
</style>
