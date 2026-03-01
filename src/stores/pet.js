import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useAuthStore } from './auth'
import { petAPI } from '@/services/api'

export const usePetStore = defineStore('pet', {
  state: () => ({
    hunger: 60,
    exp: 0,
    level: 1,
    status: 'normal', // normal, eating, sad
    lastHungerUpdateTime: Date.now(),
    _syncedAt: null     // 云端同步时间戳
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
        const res = await petAPI.getPet()
        if (res.success && res.data) {
          this.$patch(res.data)
          this._syncedAt = Date.now()
          console.log('宠物数据已从云端同步')
        }
      } catch (error) {
        console.error('从云端同步宠物数据失败:', error)
      }
    },

    // 同步到云端
    async syncToCloud() {
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn) {
        console.log('未登录，跳过云端同步')
        return
      }

      // 注意：宠物数据通过 feedPet API 实时同步，不需要单独同步
      // 此方法保留用于兼容性，实际同步在 feed 方法中完成
      this._syncedAt = Date.now()
      console.log('宠物数据同步状态已更新')
    },

    // 检查饱食度衰减 (Passive Decay)
    checkHunger() {
      const now = Date.now()

      // 自动修复卡在 eating 状态的问题 (如果超过 10 秒还在吃，强制重置)
      if (this.status === 'eating' && (now - this.lastHungerUpdateTime > 10000)) {
         this.updateStatus(true)
      }

      if (!this.lastHungerUpdateTime) {
        this.lastHungerUpdateTime = now
        return
      }

      const diff = now - this.lastHungerUpdateTime
      const hoursPassed = diff / (1000 * 60 * 60)
      const decay = Math.floor(hoursPassed * 2) // 每小时 -2

      if (decay > 0) {
        this.hunger = Math.max(0, this.hunger - decay)
        this.lastHungerUpdateTime = now
        this.updateStatus()
      }
    },

    // 更新状态 (根据饱食度)
    updateStatus(force = false) {
      if (!force && this.status === 'eating') return // 进食中不打断

      if (this.hunger < 30) {
        this.status = 'sad'
      } else {
        this.status = 'normal'
      }
    },

    // 喂食操作 (支持云端同步)
    async feed() {
      const authStore = useAuthStore()
      const userStore = useUserStore()

      // 0. 检查饱食度
      if (this.hunger >= 100) {
        return {
          success: false,
          code: 'FULL',
          msg: '小狗已经很饱了，不用再喂啦！'
        }
      }

      const COST = 10
      const HUNGER_GAIN = 10

      // 1. 检查并扣除余额
      if (!userStore.consumeFood(COST)) {
         return {
          success: false,
          code: 'INSUFFICIENT_FUNDS',
          msg: '粮仓空了，快去赚狗粮吧！'
        }
      }

      // 已登录时调用云端 API
      if (authStore.isLoggedIn) {
        try {
          const res = await petAPI.feedPet({ foodAmount: COST })
          if (res.success) {
            this.hunger = res.newHunger
            this.lastHungerUpdateTime = Date.now()
            this._syncedAt = Date.now()
          }
          return res
        } catch (error) {
          console.error('云端喂食失败:', error)
          // 云端失败不回滚本地，返回错误
          return {
            success: false,
            code: 'NETWORK_ERROR',
            msg: '网络错误，请稍后重试'
          }
        }
      }

      // 未登录时只更新本地
      // 2. 增加饱食度
      const space = 100 - this.hunger
      let actualGain = 0

      if (space >= HUNGER_GAIN) {
        this.hunger += HUNGER_GAIN
        actualGain = HUNGER_GAIN
      } else {
        this.hunger = 100
        actualGain = space
      }

      // 3. 更新时间戳 (喂食后重新开始计算衰减)
      this.lastHungerUpdateTime = Date.now()

      return {
        success: true,
        msg: '投喂成功！',
        hungerDelta: actualGain,
        currentHunger: this.hunger
      }
    },

    // 设置状态 (给 UI 用，比如设置 eating)
    setStatus(s) {
      this.status = s
    }
  },
  unistorage: {
    key: 'pet_state_pinia',
    paths: ['hunger', 'exp', 'level', 'status', 'lastHungerUpdateTime']
  }
})
