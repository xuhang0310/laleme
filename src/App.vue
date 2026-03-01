<script>
import { usePetStore } from '@/stores/pet'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

export default {
  onLaunch: async function () {
    console.log('App Launch')

    // --- Data Migration (Legacy to Pinia) ---
    try {
      // 1. Migrate User Data
      const userStatePinia = uni.getStorageSync('user_state_pinia')
      if (!userStatePinia) {
        const legacyUser = uni.getStorageSync('user_state')
        if (legacyUser) {
          const newUserState = {
            food: legacyUser.food || 0,
            pendingFood: legacyUser.pendingFood || 0,
            dailyRecordCount: legacyUser.dailyRecordCount || 0,
            lastRecordDate: legacyUser.lastRecordDate || new Date().toLocaleDateString()
          }
          uni.setStorageSync('user_state_pinia', newUserState)
          console.log('Migrated user state to Pinia')
        }
      }

      // 2. Migrate Pet Data
      const petStatePinia = uni.getStorageSync('pet_state_pinia')
      if (!petStatePinia) {
        const legacyUser = uni.getStorageSync('user_state')
        if (legacyUser && legacyUser.pet) {
          const newPetState = {
            hunger: legacyUser.pet.hunger || 60,
            exp: legacyUser.pet.exp || 0,
            level: legacyUser.pet.level || 1,
            status: 'normal',
            lastHungerUpdateTime: Date.now()
          }
          uni.setStorageSync('pet_state_pinia', newPetState)
          console.log('Migrated pet state to Pinia')
        }
      }
    } catch (e) {
      console.error('Migration failed:', e)
    }

    // --- 检查登录状态并同步云端数据 ---
    try {
      const authStore = useAuthStore()
      await authStore.checkLoginStatus()

      // 如果已登录，同步云端数据
      if (authStore.isLoggedIn) {
        const userStore = useUserStore()
        const petStore = usePetStore()
        await Promise.all([
          userStore.syncFromCloud(),
          petStore.syncFromCloud()
        ])
        console.log('已登录用户数据同步完成')
      } else {
        console.log('用户未登录，使用本地数据')
      }
    } catch (e) {
      console.error('登录检查或数据同步失败:', e)
    }
  },
  onShow: function () {
    console.log('App Show')
    try {
      const petStore = usePetStore()
      petStore.checkHunger()
    } catch (e) {
      console.log('Pinia not ready or error checking hunger', e)
    }
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/* 每个页面公共 css */

/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

/* 页面背景 */
page {
  background-color: #F9F7F4;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 通用工具类 */

/* 文本截断 */
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Flex 布局 */
.flex {
  display: flex;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.flex-1 {
  flex: 1;
}

/* 文字颜色 */
.text-primary {
  color: #1A1D26;
}

.text-secondary {
  color: #4B5563;
}

.text-muted {
  color: #9CA3AF;
}

.text-white {
  color: #FFFFFF;
}

/* 字体大小 */
.text-sm {
  font-size: 24rpx;
}

.text-base {
  font-size: 28rpx;
}

.text-lg {
  font-size: 34rpx;
}

.text-xl {
  font-size: 40rpx;
}

/* 字体粗细 */
.font-normal {
  font-weight: 400;
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.font-bold {
  font-weight: 700;
}

/* 间距 */
.mt-2 {
  margin-top: 16rpx;
}

.mt-4 {
  margin-top: 32rpx;
}

.mb-2 {
  margin-bottom: 16rpx;
}

.mb-4 {
  margin-bottom: 32rpx;
}

/* 动画 */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* 动画类 */
.animate-fade-in {
  animation: fade-in 0.3s ease;
}

.animate-slide-up {
  animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-scale-in {
  animation: scale-in 0.2s ease;
}

/* 安全区域 */
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
