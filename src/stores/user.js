import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { userAPI } from '@/services/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    food: 0,              // 仓库余额 (已入账)
    pendingFood: 0,       // 待领取 (挂账)
    dailyRecordCount: 0,  // 今日记录次数
    lastRecordDate: new Date().toLocaleDateString(), // 记录日期重置依据
    _syncedAt: null       // 云端同步时间戳
  }),
  actions: {
    // 从云端加载数据
    async syncFromCloud() {
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn) {
        console.log('未登录，跳过云端同步')
        return
      }

      try {
        const res = await userAPI.getUserInfo()
        if (res.success && res.data) {
          this.$patch(res.data)
          this._syncedAt = Date.now()
          console.log('用户数据已从云端同步')
        }
      } catch (error) {
        console.error('从云端同步用户数据失败:', error)
      }
    },

    // 同步到云端
    async syncToCloud() {
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn) {
        console.log('未登录，跳过云端同步')
        return
      }

      try {
        await userAPI.updateUserInfo({
          food: this.food,
          pendingFood: this.pendingFood,
          dailyRecordCount: this.dailyRecordCount,
          lastRecordDate: this.lastRecordDate
        })
        this._syncedAt = Date.now()
        console.log('用户数据已同步到云端')
      } catch (error) {
        console.error('同步用户数据到云端失败:', error)
      }
    },

    // 增加待领取狗粮 (从 add.vue 调用)
    addPendingFood(amount) {
      this.checkDailyReset()
      this.pendingFood += amount
      this.dailyRecordCount += 1
      // 已登录时同步到云端
      this.syncToCloud()
    },

    // 每日重置检查
    checkDailyReset() {
      const today = new Date().toLocaleDateString()
      if (this.lastRecordDate !== today) {
        this.dailyRecordCount = 0
        this.pendingFood = 0
        this.lastRecordDate = today
      }
    },

    // 领取狗粮 (支持云端同步)
    async claimFood() {
      const authStore = useAuthStore()

      // 未登录时只更新本地
      if (!authStore.isLoggedIn) {
        this.checkDailyReset()

        const yieldAmount = this.pendingFood
        if (yieldAmount <= 0) {
          return { success: false, msg: '没有可领取的狗粮哦' }
        }

        const maxWallet = 300
        if (this.food >= maxWallet) {
          return { success: false, msg: '粮仓已满，快去喂食消耗吧！' }
        }

        const spaceLeft = maxWallet - this.food
        const actualAdd = Math.min(yieldAmount, spaceLeft)

        this.food += actualAdd
        this.pendingFood -= actualAdd

        return {
          success: true,
          msg: `成功领取 ${actualAdd}g 狗粮！`,
          amount: actualAdd
        }
      }

      // 已登录时调用云端 API
      try {
        const res = await userAPI.claimFood()
        if (res.success) {
          // 更新本地状态
          this.food = res.newBalance
          this.pendingFood -= res.amount
          this._syncedAt = Date.now()
        }
        return res
      } catch (error) {
        console.error('领取狗粮失败:', error)
        return { success: false, msg: '网络错误，请稍后重试' }
      }
    },

    // 消耗狗粮 (给 pet store 调用)
    consumeFood(amount) {
      if (this.food < amount) return false
      this.food -= amount
      // 已登录时同步到云端
      this.syncToCloud()
      return true
    },

    // 调试重置
    debugReset() {
      this.food = 0
      this.pendingFood = 0
      this.dailyRecordCount = 0
    }
  },
  unistorage: {
    key: 'user_state_pinia',
    paths: ['food', 'pendingFood', 'dailyRecordCount', 'lastRecordDate']
  }
})
