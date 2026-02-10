<template>
  <view class="bottom-nav-container">
    <!-- Spacer to prevent content from being hidden behind the floating nav -->
    <view class="nav-spacer"></view>
    
    <view class="bottom-nav">
       <view class="nav-item" :class="{ active: currentTab === 0 }" @click="handleNav(0)">
         <image :src="currentTab === 0 ? iconMap.homeActive : iconMap.home" class="nav-icon" mode="aspectFit" />
         <text class="nav-text">首页</text>
       </view>
       <view class="nav-item" :class="{ active: currentTab === 1 }" @click="handleNav(1)">
         <image :src="currentTab === 1 ? iconMap.calendarActive : iconMap.calendar" class="nav-icon" mode="aspectFit" />
         <text class="nav-text">日报</text>
       </view>
       <view class="nav-item-center" @click="handleNav(2)">
         <view class="center-btn">
           <view class="plus-icon"></view>
         </view>
       </view>
       <view class="nav-item" :class="{ active: currentTab === 3 }" @click="handleNav(3)">
         <image :src="currentTab === 3 ? iconMap.chatActive : iconMap.chat" class="nav-icon" mode="aspectFit" />
         <text class="nav-text">玩耍</text>
       </view>
       <view class="nav-item" :class="{ active: currentTab === 4 }" @click="handleNav(4)">
         <image :src="currentTab === 4 ? iconMap.userActive : iconMap.user" class="nav-icon" mode="aspectFit" />
         <text class="nav-text">我的</text>
       </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

// Base64 Icons to avoid dependencies
const iconMap = {
  home: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M10%2020v-6h4v6h5v-8h3L12%203%202%2012h3v8h5z%22%20fill%3D%22%23CCCCCC%22%2F%3E%3C%2Fsvg%3E',
  homeActive: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M10%2020v-6h4v6h5v-8h3L12%203%202%2012h3v8h5z%22%20fill%3D%22%2300E676%22%2F%3E%3C%2Fsvg%3E',
  calendar: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M19%203h-1V1h-2v2H8V1H6v2H5c-1.11%200-2%20.9-2%202v14c0%201.1.89%202%202%202h14c1.1%200%202-.9%202-2V5c0-1.1-.9-2-2-2zm0%2016H5V8h14v11z%22%20fill%3D%22%23CCCCCC%22%2F%3E%3C%2Fsvg%3E',
  calendarActive: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M17%2012h-5v5h5v-5zM16%201v2H8V1H6v2H5c-1.11%200-1.99.9-1.99%202L3%2019c0%201.1.89%202%202%202h14c1.1%200%202-.9%202-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3%2018H5V8h14v11z%22%20fill%3D%22%2300E676%22%2F%3E%3C%2Fsvg%3E',
  chat: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%202H4c-1.1%200-2%20.9-2%202v18l4-4h14c1.1%200%202-.9%202-2V4c0-1.1-.9-2-2-2z%22%20fill%3D%22%23CCCCCC%22%2F%3E%3C%2Fsvg%3E',
  chatActive: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%202H4c-1.1%200-2%20.9-2%202v18l4-4h14c1.1%200%202-.9%202-2V4c0-1.1-.9-2-2-2z%22%20fill%3D%22%2300E676%22%2F%3E%3C%2Fsvg%3E',
  user: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12%2012c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm0%202c-2.67%200-8%201.34-8%204v2h16v-2c0-2.66-5.33-4-8-4z%22%20fill%3D%22%23CCCCCC%22%2F%3E%3C%2Fsvg%3E',
  userActive: 'data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12%2012c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm0%202c-2.67%200-8%201.34-8%204v2h16v-2c0-2.66-5.33-4-8-4z%22%20fill%3D%22%2300E676%22%2F%3E%3C%2Fsvg%3E'
}

const props = defineProps({
  current: {
    type: Number,
    default: 0
  }
})

// Use prop or detect current page? 
// Detecting current page is safer for a global component
const currentTab = computed(() => {
  if (props.current !== undefined) return props.current
  
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  const route = page ? page.route : ''
  
  if (route.includes('pages/index/index')) return 0
  if (route.includes('pages/poop/report')) return 1
  if (route.includes('pages/poop/add')) return 2 // Middle button
  if (route.includes('pages/chat/index')) return 3
  if (route.includes('pages/user/index')) return 4
  
  return -1
})

const handleNav = (index) => {
  if (index === 0) {
    uni.reLaunch({
      url: '/pages/index/index'
    })
  } else if (index === 1) {
    uni.redirectTo({
      url: '/pages/poop/report'
    })
  } else if (index === 2) {
    uni.navigateTo({
      url: '/pages/poop/add'
    })
  } else if (index === 3) {
    uni.redirectTo({
      url: '/pages/chat/index'
    })
  } else if (index === 4) {
    uni.redirectTo({
      url: '/pages/user/index'
    })
  }
}
</script>

<style>
.nav-spacer {
  height: 180rpx;
}

.bottom-nav {
  position: fixed;
  bottom: 40rpx;
  left: 40rpx;
  right: 40rpx;
  width: calc(100% - 80rpx); /* Explicit width to prevent collapse */
  background-color: #fff;
  height: 120rpx;
  border-radius: 60rpx;
  display: flex;
  flex-direction: row; /* Explicit flex direction */
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 10rpx 40rpx rgba(0,0,0,0.08);
  padding: 0 20rpx;
  z-index: 999;
  box-sizing: border-box; /* Ensure padding doesn't break layout */
}

.nav-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex: 1;
}

.nav-text {
  font-size: 24rpx;
  margin-top: 6rpx;
  color: #CCCCCC;
  font-weight: 500;
}

.nav-item.active .nav-text {
  color: #00E676;
  font-weight: 600;
}

.nav-icon {
  width: 48rpx;
  height: 48rpx;
}

.nav-text-center {
  position: absolute;
  bottom: 0rpx;
  font-size: 20rpx;
  color: #CCCCCC;
  font-weight: 500;
  width: 100%;
  text-align: center;
}

.plus-icon {
  width: 40rpx;
  height: 40rpx;
  position: relative;
}

.plus-icon::before,
.plus-icon::after {
  content: '';
  position: absolute;
  background-color: #fff;
  border-radius: 4rpx;
}

.plus-icon::before {
  width: 4rpx;
  height: 40rpx;
  left: 18rpx;
  top: 0;
}

.plus-icon::after {
  width: 40rpx;
  height: 4rpx;
  top: 18rpx;
  left: 0;
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
  background-color: #00E676;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -40rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 230, 118, 0.4);
}
</style>