import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const usePetStore = defineStore('pet', {
  state: () => ({
    hunger: 60,
    exp: 0,
    level: 1,
    status: 'normal', // normal, eating, sad
    lastHungerUpdateTime: Date.now()
  }),
  actions: {
    // 检查饱食度衰减 (Passive Decay)
    checkHunger() {
      const now = Date.now()
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
    updateStatus() {
      if (this.status === 'eating') return // 进食中不打断
      
      if (this.hunger < 30) {
        this.status = 'sad'
      } else {
        this.status = 'normal'
      }
    },

    // 喂食操作
    feed() {
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
      
      // 4. 状态变更交由 UI 处理动画 (UI 会设置 status = 'eating')
      // 这里只负责数据
      
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
