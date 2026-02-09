<template>
  <view class="bottom-nav-container">
    <!-- Spacer to prevent content from being hidden behind the floating nav -->
    <view class="nav-spacer"></view>
    
    <view class="bottom-nav">
       <view class="nav-item" :class="{ active: currentTab === 0 }" @click="handleNav(0)">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.09998L2 10.6V20.5C2 21.3 2.7 22 3.5 22H20.5C21.3 22 22 21.3 22 20.5V10.6L12 2.09998Z" :fill="currentTab === 0 ? '#00E676' : '#999999'"/>
         </svg>
       </view>
       <view class="nav-item" :class="{ active: currentTab === 1 }" @click="handleNav(1)">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 20H6C5.45 20 5 19.55 5 19V5C5 4.45 5.45 4 6 4H18C18.55 4 19 4.45 19 5V19C19 19.55 18.55 20 18 20ZM7 18H17V6H7V18ZM8 16H10V11H8V16ZM11 16H13V8H11V16ZM14 16H16V13H14V16Z" :fill="currentTab === 1 ? '#00E676' : '#999999'"/>
         </svg>
       </view>
       <view class="nav-item-center" @click="handleNav(2)">
         <view class="center-btn">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="white"/>
           </svg>
         </view>
       </view>
       <view class="nav-item" :class="{ active: currentTab === 3 }" @click="handleNav(3)">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" :fill="currentTab === 3 ? '#00E676' : '#999999'"/>
         </svg>
       </view>
       <view class="nav-item" :class="{ active: currentTab === 4 }" @click="handleNav(4)">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12C19.5 11.66 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.66 15.5 5.32 14.87 5.07L14.5 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.5 2.42L9.13 5.07C8.5 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.21 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.04 4.95 18.95L7.44 17.95C7.96 18.34 8.5 18.68 9.13 18.93L9.5 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.5 21.58L14.87 18.93C15.5 18.67 16.04 18.34 16.56 17.95L19.05 18.95C19.27 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98ZM12 15.5C10.07 15.5 8.5 13.93 8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12C15.5 13.93 13.93 15.5 12 15.5Z" :fill="currentTab === 4 ? '#00E676' : '#999999'"/>
         </svg>
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
  width: 80rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
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