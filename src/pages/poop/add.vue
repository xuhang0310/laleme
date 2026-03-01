<template>
  <view class="page" :style="{ '--safe-area-top': safeAreaTop + 'rpx' }">
    <!-- Page Header -->
    <view class="page-header">
      <view class="back-btn" @click="goBack">
        <uni-icons type="back" size="24" color="#4A4A4A"></uni-icons>
      </view>
      <text class="header-title">记录一下</text>
      <view class="header-right"></view>
    </view>

    <scroll-view scroll-y class="content-scroll" :show-scrollbar="false">

      <!-- 页面副标题 -->
      <text class="page-subtitle">今天感觉怎么样？</text>

      <!-- 0. Record Type -->
      <view class="section-card">
        <text class="section-label">类型</text>
        <view class="type-toggle">
          <view
            class="type-option"
            :class="{ active: recordType === 'poop' }"
            @click="recordType = 'poop'"
          >
            <view class="option-icon-wrapper" :style="{ background: recordType === 'poop' ? 'rgba(143, 179, 160, 0.3)' : '' }">
              <uni-icons type="checkmarkempty" size="32" :color="recordType === 'poop' ? '#6B9180' : '#A8A8A8'"></uni-icons>
            </view>
            <text class="option-label" :style="{ color: recordType === 'poop' ? '#6B9180' : '' }">顺利排便</text>
          </view>
          <view
            class="type-option"
            :class="{ active: recordType === 'no_poop' }"
            @click="recordType = 'no_poop'"
          >
            <view class="option-icon-wrapper" :style="{ background: recordType === 'no_poop' ? 'rgba(232, 184, 120, 0.3)' : '' }">
              <uni-icons type="closeempty" size="32" :color="recordType === 'no_poop' ? '#B8945F' : '#A8A8A8'"></uni-icons>
            </view>
            <text class="option-label" :style="{ color: recordType === 'no_poop' ? '#B8945F' : '' }">没拉出来</text>
          </view>
        </view>
      </view>

      <template v-if="recordType === 'poop'">
        <!-- 1. Shape Selection -->
        <view class="section-card">
          <text class="section-label">性状</text>
          <scroll-view scroll-x class="chips-scroll" :show-scrollbar="false">
            <view class="chips-row">
              <view
                class="chip"
                v-for="(item, index) in shapes"
                :key="index"
                :class="{ active: shapeIndex === index }"
                @click="shapeIndex = index"
              >
                {{ item }}
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 2. Color Selection -->
        <view class="section-card">
          <text class="section-label">颜色</text>
          <scroll-view scroll-x class="chips-scroll" :show-scrollbar="false">
            <view class="chips-row">
              <view
                class="chip color-chip"
                v-for="(item, index) in colors"
                :key="index"
                :class="{ active: colorIndex === index }"
                @click="colorIndex = index"
              >
                <view class="color-dot" :style="{ backgroundColor: getColorCode(item) }"></view>
                <text>{{ item }}</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 3. Amount Selection -->
        <view class="section-card">
          <text class="section-label">分量</text>
          <view class="amount-selector">
            <view
              class="amount-btn"
              v-for="(item, index) in amounts"
              :key="index"
              :class="{ active: amountIndex === index }"
              @click="amountIndex = index"
            >
              <view class="amount-icon-wrapper" :style="{ transform: `scale(${0.8 + index * 0.15})` }">
                <uni-icons type="drop" size="28" :color="amountIndex === index ? '#6B9180' : '#A8A8A8'"></uni-icons>
              </view>
              <text :style="{ color: amountIndex === index ? '#6B9180' : '' }">{{ item }}</text>
            </view>
          </view>
        </view>
      </template>

      <!-- 4. Feeling Selection -->
      <view class="section-card">
        <text class="section-label">排便感受</text>
        <view class="feeling-grid">
          <view
            class="feeling-box"
            v-for="(item, index) in feelings"
            :key="index"
            :class="{ active: feelingIndex === index }"
            @click="selectFeeling(index)"
          >
            <view class="feeling-emoji">{{ item.emoji }}</view>
            <text class="feeling-title">{{ item.title }}</text>

            <!-- Custom Input for last item -->
            <input
              v-if="index === 4 && feelingIndex === 4"
              class="custom-input"
              type="number"
              v-model="customDuration"
              placeholder="分钟"
              @click.stop
            />
          </view>
        </view>
      </view>

      <!-- 5. Time Picker -->
      <view class="section-card">
        <picker mode="time" :value="time" @change="bindTimeChange" class="time-picker-row">
          <text class="time-label">时间</text>
          <view class="time-value">
            <text>{{ time }}</text>
            <uni-icons type="right" size="14" color="#A8A8A8"></uni-icons>
          </view>
        </picker>
      </view>

      <!-- 6. Symptoms -->
      <view class="section-card">
        <text class="section-label">异常标记（多选）</text>
        <view class="tags-container">
          <view
            class="tag-item"
            v-for="(item, index) in symptoms"
            :key="index"
            :class="{ active: selectedSymptoms.includes(item) }"
            @click="toggleSymptom(item)"
          >
            {{ item }}
          </view>
        </view>
      </view>

      <!-- 7. Notes -->
      <view class="section-card">
        <text class="section-label">备注</text>
        <view class="note-box">
          <textarea
            class="note-input"
            v-model="note"
            placeholder="记录一些特殊的观察..."
            placeholder-style="color:#A8A8A8"
            auto-height
          />
        </view>
      </view>

      <!-- Spacer for submit button -->
      <view style="height: 180rpx;"></view>
    </scroll-view>

    <!-- Submit Button -->
    <view class="submit-area">
      <button class="submit-btn" @click="saveRecord">
        <text>完成记录</text>
        <uni-icons type="arrowright" size="20" color="white"></uni-icons>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { getNavBarHeight } from '@/utils/system'

const userStore = useUserStore()
const safeAreaTop = ref(88)

const goBack = () => {
  uni.navigateBack()
}

// 初始化安全区域高度
// #ifdef MP-WEIXIN
safeAreaTop.value = getNavBarHeight()
// #endif
// #ifndef MP-WEIXIN
safeAreaTop.value = 88
// #endif

const now = new Date()
const time = ref(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`)

const recordType = ref('poop')

const shapes = ['香蕉状', '羊粪球', '糊状', '水状', '硬条状']
const shapeIndex = ref(0)

const colors = ['棕色', '黄色', '绿色', '黑色', '红色']
const colorIndex = ref(0)

const amounts = ['少', '适中', '多']
const amountIndex = ref(1)

const symptoms = ['带血', '粘液', '未消化', '恶臭', '排便不尽', '腹痛']
const selectedSymptoms = ref([])

const toggleSymptom = (item) => {
  if (selectedSymptoms.value.includes(item)) {
    selectedSymptoms.value = selectedSymptoms.value.filter(i => i !== item)
  } else {
    selectedSymptoms.value.push(item)
  }
}

const getColorCode = (name) => {
  const map = {
    '棕色': '#8D6E63',
    '黄色': '#FBC02D',
    '绿色': '#66BB6A',
    '黑色': '#424242',
    '红色': '#EF5350'
  }
  return map[name.split('(')[0]] || '#999'
}

const feelings = [
  { emoji: '⚡️', title: '迅速' },
  { emoji: '😌', title: '顺畅' },
  { emoji: '😓', title: '费力' },
  { emoji: '😖', title: '困难' },
  { emoji: '⏱', title: '自定义' }
]
const feelingIndex = ref(1)
const customDuration = ref('')

const selectFeeling = (index) => {
  feelingIndex.value = index
  if (index !== 4) {
    customDuration.value = ''
  }
}

const note = ref('')

const bindTimeChange = (e) => {
  time.value = e.detail.value
}

const saveRecord = () => {
  const selectedFeeling = feelings[feelingIndex.value]
  let duration = selectedFeeling.title

  if (feelingIndex.value === 4) {
    if (!customDuration.value) {
      uni.showToast({
        title: '请输入时长',
        icon: 'none'
      })
      return
    }
    duration = customDuration.value + '分钟'
  }

  const record = {
    date: new Date().toLocaleDateString(),
    time: time.value,
    relation: '本人',
    type: recordType.value,
    shape: recordType.value === 'poop' ? shapes[shapeIndex.value] : '无',
    color: recordType.value === 'poop' ? colors[colorIndex.value] : '无',
    amount: recordType.value === 'poop' ? amounts[amountIndex.value] : '无',
    symptoms: selectedSymptoms.value,
    feeling: selectedFeeling.title,
    duration: duration,
    note: note.value,
    timestamp: new Date().getTime()
  }

  const records = uni.getStorageSync('poop_records') || []

  // Dog Food Reward Logic
  userStore.checkDailyReset()

  const currentCount = userStore.dailyRecordCount

  let reward = 0
  if (currentCount === 0) reward = 40
  else if (currentCount === 1) reward = 10
  else if (currentCount === 2) reward = 5

  if (reward > 0) {
    userStore.addPendingFood(reward)
  } else {
    userStore.addPendingFood(0)
  }

  records.push(record)

  try {
    uni.setStorageSync('poop_records', records)

    let toastTitle = '已记录'

    if (reward > 0) {
      toastTitle = `已产出 ${reward}g 狗粮`
    } else if (currentCount >= 3) {
      toastTitle = '已记录 (今日奖励已领完)'
    }

    uni.showToast({
      title: toastTitle,
      icon: 'success',
      duration: 1500
    })

    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    }, 1500)
  } catch (e) {
    uni.showToast({
      title: '存储失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss">
/* 设计令牌 */
$color-primary: #8FB3A0;
$color-primary-light: #A8C9B8;
$color-primary-dark: #6B9180;
$color-primary-bg: rgba(143, 179, 160, 0.08);
$color-primary-bg-strong: rgba(143, 179, 160, 0.3);
$color-secondary: #D4A59A;
$color-warning: #E8B878;
$color-warning-bg: rgba(232, 184, 120, 0.08);

$bg-page: #F9F7F4;
$bg-card: #FFFFFF;
$bg-section: #F2EFE9;

$text-primary: #4A4A4A;
$text-secondary: #7A7A7A;
$text-muted: #A8A8A8;
$text-disabled: #D0D0D0;

$radius-sm: 12rpx;
$radius-md: 20rpx;
$radius-lg: 32rpx;
$radius-xl: 48rpx;
$radius-round: 9999rpx;

$shadow-sm: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
$shadow-md: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);

page {
  background-color: $bg-page;
}

.page {
  min-height: 100vh;
  background-color: $bg-page;
  display: flex;
  flex-direction: column;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  padding-top: var(--safe-area-top, 88rpx);
}

.page-header {
  padding: 16rpx 30rpx;
  padding-top: max(16rpx, calc(var(--status-bar-height, 0px) + 8rpx));
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 100;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.header-title {
  font-size: 40rpx;
  font-weight: 700;
  color: $text-primary;
  flex: 1;
  text-align: center;
  padding: 0 60rpx;
}

.header-right {
  min-width: 80rpx;
  flex-shrink: 0;
}

.page-subtitle {
  display: block;
  padding: 0 30rpx;
  margin-bottom: 24rpx;
  font-size: 28rpx;
  color: $text-muted;
}

.content-scroll {
  flex: 1;
  padding: 0 30rpx;
  box-sizing: border-box;
}

/* Section Cards */
.section-card {
  background: $bg-card;
  border-radius: $radius-xl;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $shadow-sm;

  .section-label {
    display: block;
    font-size: 26rpx;
    font-weight: 600;
    color: $text-muted;
    margin-bottom: 20rpx;
  }
}

/* Type Toggle */
.type-toggle {
  display: flex;
  gap: 20rpx;
}

.type-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 24rpx;
  background: $bg-section;
  border-radius: $radius-lg;
  border: 3rpx solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;

  .option-icon-wrapper {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16rpx;
    background: $bg-card;
    transition: all 0.2s ease;
  }

  .option-label {
    font-size: 26rpx;
    color: $text-secondary;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  &.active {
    border-color: $color-primary;
    background: $color-primary-bg;

    .option-label {
      color: $color-primary-dark;
      font-weight: 600;
    }
  }
}

/* Chips Row */
.chips-scroll {
  width: 100%;
}

.chips-row {
  display: flex;
  gap: 16rpx;
  padding-bottom: 8rpx;
}

.chip {
  padding: 16rpx 32rpx;
  background: $bg-section;
  border-radius: $radius-round;
  font-size: 26rpx;
  color: $text-secondary;
  font-weight: 500;
  border: 2rpx solid transparent;
  white-space: nowrap;
  transition: all 0.2s ease;

  &.active {
    background: $color-primary;
    color: #FFFFFF;
    border-color: $color-primary;
    transform: translateY(-2rpx);
    box-shadow: 0 4rpx 12rpx rgba(143, 179, 160, 0.4);
  }

  &.color-chip {
    display: flex;
    align-items: center;
    gap: 12rpx;

    .color-dot {
      width: 24rpx;
      height: 24rpx;
      border-radius: 50%;
      border: 2rpx solid rgba(0, 0, 0, 0.1);
    }
  }
}

/* Amount Selector */
.amount-selector {
  display: flex;
  justify-content: space-around;
  gap: 20rpx;
}

.amount-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28rpx 20rpx;
  background: $bg-section;
  border-radius: $radius-lg;
  border: 3rpx solid transparent;
  transition: all 0.2s ease;

  .amount-icon-wrapper {
    width: 70rpx;
    height: 70rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12rpx;
    transition: transform 0.2s ease;
  }

  text {
    font-size: 26rpx;
    color: $text-secondary;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  &.active {
    background: $color-primary-bg;
    border-color: $color-primary;
  }
}

/* Feeling Grid */
.feeling-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.feeling-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx 24rpx;
  background: $bg-section;
  border-radius: $radius-lg;
  border: 3rpx solid transparent;
  transition: all 0.2s ease;
  position: relative;

  &.active {
    background: $color-primary-bg;
    border-color: $color-primary;

    .feeling-title {
      color: $color-primary-dark;
      font-weight: 600;
    }
  }

  .feeling-emoji {
    font-size: 56rpx;
    margin-bottom: 12rpx;
  }

  .feeling-title {
    font-size: 26rpx;
    color: $text-secondary;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  /* Custom input for 5th item */
  &:nth-child(5) {
    grid-column: span 2;
    flex-direction: row;
    align-items: center;
    padding: 24rpx 32rpx;

    .feeling-emoji {
      margin-bottom: 0;
      margin-right: 20rpx;
    }

    .feeling-title {
      margin-bottom: 0;
      margin-right: 20rpx;
    }

    .custom-input {
      flex: 1;
      height: 56rpx;
      background: $bg-card;
      border-radius: $radius-sm;
      padding: 0 20rpx;
      font-size: 28rpx;
      color: $text-primary;
      border: 2rpx solid #E5E7EB;
    }
  }
}

/* Time Picker */
.time-picker-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;

  .time-label {
    font-size: 28rpx;
    font-weight: 600;
    color: $text-primary;
  }

  .time-value {
    display: flex;
    align-items: center;
    gap: 12rpx;

    text {
      font-size: 32rpx;
      font-weight: 700;
      color: $color-primary;
    }
  }
}

/* Tags Container */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tag-item {
  padding: 14rpx 28rpx;
  background: $bg-section;
  border-radius: $radius-round;
  font-size: 26rpx;
  color: $text-secondary;
  font-weight: 500;
  border: 2rpx solid transparent;
  transition: all 0.2s ease;

  &.active {
    background: rgba(217, 136, 136, 0.1);
    color: $color-error;
    border-color: rgba(217, 136, 136, 0.3);
    font-weight: 600;
  }
}

/* Note Box */
.note-box {
  background: $bg-section;
  border-radius: $radius-lg;
  padding: 24rpx;

  .note-input {
    width: 100%;
    min-height: 100rpx;
    font-size: 28rpx;
    color: $text-primary;
    line-height: 1.5;
    background: transparent;
  }
}

/* Submit Area */
.submit-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 30rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: $bg-card;
  box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.04);
  z-index: 100;
}

.submit-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  border-radius: $radius-round;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(143, 179, 160, 0.4);
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.98);
  }

  &::after {
    display: none;
  }

  text {
    font-size: 32rpx;
    color: #FFFFFF;
    font-weight: 600;
  }
}
</style>
