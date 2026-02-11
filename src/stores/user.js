import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    food: 0,              // 仓库余额 (已入账)
    pendingFood: 0,       // 待领取 (挂账)
    dailyRecordCount: 0,  // 今日记录次数
    lastRecordDate: new Date().toLocaleDateString(), // 记录日期重置依据
  }),
  actions: {
    // 增加待领取狗粮 (从 add.vue 调用)
    addPendingFood(amount) {
      this.checkDailyReset()
      this.pendingFood += amount
      this.dailyRecordCount += 1
    },
    
    // 每日重置检查
    checkDailyReset() {
      const today = new Date().toLocaleDateString()
      if (this.lastRecordDate !== today) {
        this.dailyRecordCount = 0
        this.pendingFood = 0 // 新的一天，旧的挂账是否清零？PLAN.md 没明确说，但通常逻辑是每日产出每日领。
        // 根据 PLAN.md: "领取成功后，必须将今日产出数据中的 food 字段重置为 0"
        // 这里我们可以保留 pendingFood 只要没领就不清零？或者每日重置？
        // issue12.md 提到: "数据作废/重置：领取成功后...防止重复领取"。
        // 既然叫 "Daily Yield"，应该是每日产出。如果没领，第二天是否还在？
        // 简单起见，且为了促进活跃，建议每日重置。
        this.lastRecordDate = today
      }
    },

    // 领取狗粮
    claimFood() {
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
      this.pendingFood -= actualAdd // 扣除已领取的

      return {
        success: true,
        msg: `成功领取 ${actualAdd}g 狗粮！`,
        amount: actualAdd
      }
    },
    
    // 消耗狗粮 (给 pet store 调用)
    consumeFood(amount) {
      if (this.food < amount) return false
      this.food -= amount
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
    key: 'user_state_pinia', // 使用新 Key 避免冲突，或者手动迁移数据
    paths: ['food', 'pendingFood', 'dailyRecordCount', 'lastRecordDate']
  }
})
