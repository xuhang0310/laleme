<template>
  <view class="bottom-nav-container">
    <!-- Spacer to prevent content from being hidden behind the floating nav -->
    <view class="nav-spacer"></view>

    <view class="bottom-nav">
      <view
        class="nav-item"
        :class="{ active: currentTab === 0 }"
        @click="handleNav(0)"
        hover-class="nav-item-hover"
        :hover-start-time="50"
        :hover-stay-time="100"
      >
        <image class="nav-icon" :src="currentTab === 0 ? iconMap.homeActive : iconMap.home" mode="aspectFit"></image>
        <text class="nav-text" :class="{ 'nav-text-active': currentTab === 0 }">首页</text>
      </view>

      <view
        class="nav-item"
        :class="{ active: currentTab === 1 }"
        @click="handleNav(1)"
        hover-class="nav-item-hover"
        :hover-start-time="50"
        :hover-stay-time="100"
      >
        <image class="nav-icon" :src="currentTab === 1 ? iconMap.calendarActive : iconMap.calendar" mode="aspectFit"></image>
        <text class="nav-text" :class="{ 'nav-text-active': currentTab === 1 }">日报</text>
      </view>

      <view class="nav-item-center" @click="handleNav(2)">
        <view class="center-btn" hover-class="center-btn-hover" :hover-start-time="50" :hover-stay-time="100">
          <image class="center-icon" :src="iconMap.plus" mode="aspectFit"></image>
        </view>
      </view>

      <view
        class="nav-item"
        :class="{ active: currentTab === 3 }"
        @click="handleNav(3)"
        hover-class="nav-item-hover"
        :hover-start-time="50"
        :hover-stay-time="100"
      >
        <image class="nav-icon" :src="currentTab === 3 ? iconMap.chatActive : iconMap.chat" mode="aspectFit"></image>
        <text class="nav-text" :class="{ 'nav-text-active': currentTab === 3 }">玩耍</text>
      </view>

      <view
        class="nav-item"
        :class="{ active: currentTab === 4 }"
        @click="handleNav(4)"
        hover-class="nav-item-hover"
        :hover-start-time="50"
        :hover-stay-time="100"
      >
        <image class="nav-icon" :src="currentTab === 4 ? iconMap.userActive : iconMap.user" mode="aspectFit"></image>
        <text class="nav-text" :class="{ 'nav-text-active': currentTab === 4 }">萌宠</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: {
    type: Number,
    default: 0
  }
})

// Base64 图标映射
const iconMap = {
  home: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M10%2020v-6h4v6h5v-8h3L12%203%202%2012h3v8h5z%22%20fill%3D%22%23A8A8A8%22%2F%3E%3C%2Fsvg%3E',
  homeActive: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M10%2020v-6h4v6h5v-8h3L12%203%202%2012h3v8h5z%22%20fill%3D%22%238FB3A0%22%2F%3E%3C%2Fsvg%3E',
  calendar: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M19%203h-1V1h-2v2H8V1H6v2H5c-1.11%200-2%20.9-2%202v14c0%201.1.89%202%202%202h14c1.1%200%202-.9%202-2V5c0-1.1-.9-2-2-2zm0%2016H5V8h14v11z%22%20fill%3D%22%23A8A8A8%22%2F%3E%3C%2Fsvg%3E',
  calendarActive: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M17%2012h-5v5h5v-5zM16%201v2H8V1H6v2H5c-1.11%200-1.99.9-1.99%202L3%2019c0%201.1.89%202%202%202h14c1.1%200%202-.9%202-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3%2018H5V8h14v11z%22%20fill%3D%22%238FB3A0%22%2F%3E%3C%2Fsvg%3E',
  chat: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%202H4c-1.1%200-2%20.9-2%202v18l4-4h14c1.1%200%202-.9%202-2V4c0-1.1-.9-2-2-2z%22%20fill%3D%22%23A8A8A8%22%2F%3E%3C%2Fsvg%3E',
  chatActive: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%202H4c-1.1%200-2%20.9-2%202v18l4-4h14c1.1%200%202-.9%202-2V4c0-1.1-.9-2-2-2z%22%20fill%3D%22%238FB3A0%22%2F%3E%3C%2Fsvg%3E',
  user: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12%2012c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm0%202c-2.67%200-8%201.34-8%204v2h16v-2c0-2.66-5.33-4-8-4z%22%20fill%3D%22%23A8A8A8%22%2F%3E%3C%2Fsvg%3E',
  userActive: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12%2012c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm0%202c-2.67%200-8%201.34-8%204v2h16v-2c0-2.66-5.33-4-8-4z%22%20fill%3D%22%238FB3A0%22%2F%3E%3C%2Fsvg%3E',
  plus: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12%204v16m8-8H4%22%20stroke%3D%22white%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E'
}

// Use prop or detect current page
const currentTab = computed(() => {
  if (props.current !== undefined) return props.current

  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  const route = page ? page.route : ''

  if (route.includes('pages/index/index')) return 0
  if (route.includes('pages/poop/report')) return 1
  if (route.includes('pages/poop/add')) return 2
  if (route.includes('pages/chat/index')) return 3
  if (route.includes('pages/user/index')) return 4

  return -1
})

const handleNav = (index) => {
  // Haptic feedback for center button
  if (index === 2) {
    uni.vibrateShort({ type: 'light' })
  }

  if (index === 0) {
    uni.reLaunch({ url: '/pages/index/index' })
  } else if (index === 1) {
    uni.redirectTo({ url: '/pages/poop/report' })
  } else if (index === 2) {
    uni.navigateTo({ url: '/pages/poop/add' })
  } else if (index === 3) {
    uni.redirectTo({ url: '/pages/chat/index' })
  } else if (index === 4) {
    uni.redirectTo({ url: '/pages/user/index' })
  }
}
</script>

<style lang="scss">
// Import design tokens from uni.scss (auto-imported in uni-app)

$color-primary: #8FB3A0;
$color-primary-dark: #6B9180;
$bg-card: #FFFFFF;
$text-muted: #A8A8A8;
$shadow-float: 0 16rpx 48rpx rgba(0, 0, 0, 0.10);

.nav-spacer {
  height: 180rpx;
}

.bottom-nav {
  position: fixed;
  bottom: 40rpx;
  left: 40rpx;
  right: 40rpx;
  width: calc(100% - 80rpx);
  background-color: $bg-card;
  height: 120rpx;
  border-radius: 60rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  box-shadow: $shadow-float;
  padding: 0 20rpx;
  z-index: 999;
  box-sizing: border-box;
}

.nav-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex: 1;
  padding: 12rpx 0;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.92);
  }

  &.active {
    .nav-text {
      color: $color-primary;
      font-weight: 600;
    }
  }
}

.nav-item-hover {
  transform: scale(0.92);
}

.nav-icon {
  width: 44rpx;
  height: 44rpx;
}

.nav-text {
  font-size: 22rpx;
  margin-top: 6rpx;
  color: $text-muted;
  font-weight: 500;
  transition: color 0.15s ease-in-out, font-weight 0.15s ease-in-out;
}

.nav-text-active {
  color: $color-primary;
  font-weight: 600;
}

.nav-item-center {
  width: 100rpx;
  height: 100rpx;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.center-btn {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -40rpx;
  box-shadow: 0 8rpx 24rpx rgba(143, 179, 160, 0.4);
  transition: transform 0.15s ease, box-shadow 0.2s ease;

  &:active {
    transform: scale(0.92);
    box-shadow: 0 4rpx 12rpx rgba(143, 179, 160, 0.3);
  }
}

.center-btn-hover {
  transform: scale(0.92);
}

.center-icon {
  width: 56rpx;
  height: 56rpx;
}
</style>
