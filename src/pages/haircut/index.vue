<template>
  <view class="container">
    <view class="header">
      <text class="title">剪了么</text>
      <text class="subtitle">发现身边的 Tony 老师</text>
    </view>

    <view class="barber-list">
      <view class="barber-item" v-for="item in barbers" :key="item.id" @click="goToDetail(item)">
        <view class="item-left">
          <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
        </view>
        <view class="item-right">
          <view class="info-row-1">
            <text class="name">{{ item.name }}</text>
            <view class="distance-badge">
              <text class="icon">📍</text>
              <text>{{ item.distance }}km</text>
            </view>
          </view>
          
          <text class="shop-name">{{ item.shop }}</text>
          
          <view class="tags-row">
            <view class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</view>
          </view>
          
          <view class="action-row">
            <view class="rating">
              <text class="star">★</text>
              <text class="score">4.9</text>
            </view>
            <button class="book-btn">预约</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const barbers = ref([
  {
    id: 1,
    name: 'Kevin 总监',
    shop: '顶尚造型 (三里屯店)',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    tags: ['擅长短发', '10年经验', '日系'],
    distance: 0.8
  },
  {
    id: 2,
    name: 'Tony 老师',
    shop: '名流发艺',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    tags: ['染发专家', '设计剪'],
    distance: 1.2
  },
  {
    id: 3,
    name: 'Lucy 造型',
    shop: '简约造型',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    tags: ['细心', '韩式烫发'],
    distance: 2.5
  }
])

const goToDetail = (item) => {
  uni.navigateTo({
    url: `/pages/haircut/detail?id=${item.id}&name=${item.name}`
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F5F7FA;
  padding: 20px;
}

.header {
  margin-top: 40px;
  margin-bottom: 24px;
  .title {
    font-size: 28px;
    font-weight: 800;
    color: #1A1D26;
    display: block;
    margin-bottom: 4px;
  }
  .subtitle {
    font-size: 14px;
    color: #6B7280;
  }
}

.barber-item {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: transform 0.1s;
  
  &:active {
    transform: scale(0.98);
  }
  
  .item-left {
    margin-right: 16px;
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 12px;
      background: #F3F4F6;
    }
  }
  
  .item-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .info-row-1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      
      .name {
        font-size: 16px;
        font-weight: 700;
        color: #1A1D26;
      }
      
      .distance-badge {
        display: flex;
        align-items: center;
        background: #F9FAFB;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        color: #6B7280;
        .icon {
          font-size: 10px;
          margin-right: 2px;
        }
      }
    }
    
    .shop-name {
      font-size: 12px;
      color: #9CA3AF;
      margin-bottom: 8px;
    }
    
    .tags-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
      
      .tag {
        font-size: 10px;
        padding: 2px 6px;
        background: #F3F4F6;
        color: #6B7280;
        border-radius: 4px;
      }
    }
    
    .action-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .rating {
        display: flex;
        align-items: center;
        gap: 2px;
        .star {
          color: #F59E0B;
          font-size: 12px;
        }
        .score {
          font-size: 13px;
          font-weight: 700;
          color: #1A1D26;
        }
      }
      
      .book-btn {
        margin: 0;
        background: #1A1D26;
        color: white;
        font-size: 12px;
        padding: 0 16px;
        height: 28px;
        line-height: 28px;
        border-radius: 14px;
        font-weight: 500;
      }
    }
  }
}
</style>
