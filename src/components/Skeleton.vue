<template>
  <view class="skeleton" :class="{ 'skeleton-animated': animated }">
    <!-- 头像/圆形骨架 -->
    <view
      v-if="type === 'avatar'"
      class="skeleton-avatar"
      :style="{
        width: `${avatarSize}rpx`,
        height: `${avatarSize}rpx`,
        borderRadius: avatarShape === 'circle' ? '50%' : `${radiusMap[avatarShape]}`
      }"
    />

    <!-- 文本骨架 -->
    <view v-else-if="type === 'text'" class="skeleton-text-wrapper">
      <view
        v-for="n in rows"
        :key="n"
        class="skeleton-text"
        :style="{
          width: n === rows && lastRowWidth !== '100%' ? lastRowWidth : '100%',
          height: `${textHeight}rpx`,
          borderRadius: `${radiusMap[textShape]}rpx`
        }"
      />
    </view>

    <!-- 卡片骨架 -->
    <view v-else-if="type === 'card'" class="skeleton-card">
      <view
        class="skeleton-image"
        :style="{
          height: `${cardImageHeight}rpx`,
          borderRadius: `${radiusMap[cardShape]}rpx`
        }"
      />
      <view class="skeleton-card-content">
        <view
          class="skeleton-title"
          :style="{
            height: `${textHeight}rpx`,
            borderRadius: `${radiusMap[textShape]}rpx`
          }"
        />
        <view
          v-for="n in rows"
          :key="n"
          class="skeleton-paragraph"
          :style="{
            width: n === rows && lastRowWidth !== '100%' ? lastRowWidth : '100%',
            height: `${textHeight}rpx`,
            borderRadius: `${radiusMap[textShape]}rpx`
          }"
        />
      </view>
    </view>

    <!-- 列表项骨架 -->
    <view v-else-if="type === 'list-item'" class="skeleton-list-item">
      <view
        v-if="avatarSize"
        class="skeleton-list-avatar"
        :style="{
          width: `${avatarSize}rpx`,
          height: `${avatarSize}rpx`,
          borderRadius: avatarShape === 'circle' ? '50%' : `${radiusMap[avatarShape]}`
        }"
      />
      <view class="skeleton-list-content">
        <view
          class="skeleton-list-title"
          :style="{
            width: titleWidth,
            height: `${textHeight}rpx`,
            borderRadius: `${radiusMap[textShape]}rpx`
          }"
        />
        <view
          class="skeleton-list-desc"
          :style="{
            width: descWidth,
            height: `${textHeight * 0.8}rpx`,
            borderRadius: `${radiusMap[textShape]}rpx`
          }"
        />
      </view>
    </view>

    <!-- 自定义内容插槽 -->
    <slot v-else></slot>
  </view>
</template>

<script setup>
defineProps({
  // 骨架类型
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'avatar', 'card', 'list-item', 'custom'].includes(value)
  },
  // 是否动画
  animated: {
    type: Boolean,
    default: true
  },
  // 文本行数
  rows: {
    type: Number,
    default: 3
  },
  // 最后一行宽度
  lastRowWidth: {
    type: String,
    default: '60%'
  },
  // 头像尺寸
  avatarSize: {
    type: Number,
    default: 80
  },
  // 头像形状
  avatarShape: {
    type: String,
    default: 'circle',
    validator: (value) => ['circle', 'square', 'rounded'].includes(value)
  },
  // 文本高度
  textHeight: {
    type: Number,
    default: 28
  },
  // 文本形状
  textShape: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  // 卡片图片高度
  cardImageHeight: {
    type: Number,
    default: 240
  },
  // 卡片图片形状
  cardShape: {
    type: String,
    default: 'lg',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  // 列表标题宽度
  titleWidth: {
    type: String,
    default: '70%'
  },
  // 列表描述宽度
  descWidth: {
    type: String,
    default: '90%'
  }
})

// 圆角映射
const radiusMap = {
  sm: '8rpx',
  md: '12rpx',
  lg: '16rpx',
  square: '0',
  circle: '50%',
  rounded: '12rpx'
}
</script>

<style lang="scss">
.skeleton {
  background-color: #F3F4F6;
  position: relative;
  overflow: hidden;
}

.skeleton.skeleton-animated::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 头像骨架 */
.skeleton-avatar {
  background-color: #E5E7EB;
}

/* 文本骨架 */
.skeleton-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.skeleton-text {
  background-color: #E5E7EB;
}

/* 卡片骨架 */
.skeleton-card {
  background-color: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
}

.skeleton-image {
  background-color: #E5E7EB;
  width: 100%;
}

.skeleton-card-content {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.skeleton-title {
  background-color: #E5E7EB;
  width: 60%;
}

.skeleton-paragraph {
  background-color: #F3F4F6;
}

/* 列表项骨架 */
.skeleton-list-item {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  padding: 24rpx;
  background-color: #FFFFFF;
  border-radius: 24rpx;
}

.skeleton-list-avatar {
  background-color: #E5E7EB;
  flex-shrink: 0;
}

.skeleton-list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.skeleton-list-title {
  background-color: #E5E7EB;
}

.skeleton-list-desc {
  background-color: #F3F4F6;
}
</style>
