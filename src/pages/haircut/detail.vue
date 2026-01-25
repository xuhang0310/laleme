<template>
  <view class="container">
    <view class="header-banner">
      <view class="overlay"></view>
      <view class="header-content">
        <view class="avatar-wrapper">
           <view class="avatar-placeholder"></view>
        </view>
        <view class="info-text">
          <text class="name">{{ name }}</text>
          <text class="desc">专业理发师，为您打造专属造型</text>
          <view class="meta-row">
            <text class="meta-item">从业10年</text>
            <text class="divider">|</text>
            <text class="meta-item">好评率 99%</text>
          </view>
        </view>
      </view>
    </view>

    <view class="body-content">
      <view class="section">
        <view class="section-header">
           <text class="section-title">服务项目</text>
        </view>
        <view class="service-list">
          <view class="service-item" v-for="item in services" :key="item.id">
            <view class="item-left">
              <text class="service-name">{{ item.name }}</text>
              <text class="service-desc">{{ item.desc }}</text>
            </view>
            <view class="item-right">
              <text class="price">¥{{ item.price }}</text>
              <view class="select-btn">选择</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-bar">
      <button class="book-btn" @click="handleBook">立即预约</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const name = ref('')
const services = ref([
  { id: 1, name: '精致剪发', desc: '设计剪发，含洗吹', price: 68 },
  { id: 2, name: '时尚染发', desc: '基础染发，不含漂', price: 268 },
  { id: 3, name: '质感烫发', desc: '冷烫/热烫，不伤发', price: 368 }
])

onLoad((options) => {
  if (options.name) {
    name.value = options.name
  }
})

const handleBook = () => {
  uni.showModal({
    title: '预约确认',
    content: '确定要预约 ' + name.value + ' 吗？',
    confirmColor: '#1A1D26',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '预约成功',
          icon: 'success'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F5F7FA;
  padding-bottom: 80px;
}

.header-banner {
  height: 240px;
  background-color: #374151; // 占位背景色
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 0 24px 40px;
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
  }
  
  .header-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    width: 100%;
    
    .avatar-wrapper {
      margin-right: 16px;
      .avatar-placeholder {
        width: 72px;
        height: 72px;
        background: #E5E7EB;
        border-radius: 50%;
        border: 3px solid rgba(255,255,255,0.2);
      }
    }
    
    .info-text {
      flex: 1;
      color: white;
      .name {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 4px;
        display: block;
      }
      .desc {
        font-size: 13px;
        opacity: 0.8;
        margin-bottom: 8px;
        display: block;
      }
      .meta-row {
        display: flex;
        align-items: center;
        font-size: 12px;
        opacity: 0.6;
        .divider {
          margin: 0 8px;
        }
      }
    }
  }
}

.body-content {
  padding: 20px;
  margin-top: -20px;
  position: relative;
  z-index: 2;
}

.section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  
  .section-header {
    margin-bottom: 16px;
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #1A1D26;
    }
  }
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #F3F4F6;
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .item-left {
    .service-name {
      font-size: 15px;
      font-weight: 600;
      color: #1A1D26;
      display: block;
      margin-bottom: 4px;
    }
    .service-desc {
      font-size: 12px;
      color: #9CA3AF;
    }
  }
  
  .item-right {
    text-align: right;
    .price {
      font-size: 16px;
      font-weight: 700;
      color: #1A1D26;
      display: block;
      margin-bottom: 4px;
    }
    .select-btn {
      font-size: 11px;
      background: #F3F4F6;
      color: #4B5563;
      padding: 2px 8px;
      border-radius: 4px;
      display: inline-block;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px 20px 30px;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
  z-index: 10;
  
  .book-btn {
    background: #1A1D26;
    color: white;
    height: 48px;
    line-height: 48px;
    border-radius: 24px;
    font-weight: 600;
    font-size: 16px;
    
    &:active {
      opacity: 0.9;
    }
  }
}
</style>
