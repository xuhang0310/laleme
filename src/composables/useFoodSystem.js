import { reactive, watch, computed } from 'vue'

// 复用 add.vue 中的 Key，保持数据一致性
const STATE_KEY = 'user_state'

// 获取今日日期字符串 YYYY/MM/DD
const getTodayStr = () => {
  return new Date().toLocaleDateString()
}

// 默认初始状态 (与 add.vue 保持结构一致)
const defaultState = {
  food: 0,              // 仓库余额 (已入账)
  pendingFood: 0,       // 待领取 (挂账)
  dailyRecordCount: 0,
  lastRecordDate: getTodayStr(),
  pet: {
    hunger: 60,     // 初始饱食度
    exp: 0,         // 亲密度
    level: 1        // 等级
  }
}

// 响应式单例
const saved = uni.getStorageSync(STATE_KEY)
const rawState = saved || defaultState
// 确保 pendingFood 存在
if (rawState.pendingFood === undefined) rawState.pendingFood = 0
// 确保 pet 存在 (数据迁移)
if (!rawState.pet) {
  rawState.pet = { ...defaultState.pet }
}

const state = reactive(rawState)

// 自动持久化
watch(state, (newVal) => {
  uni.setStorageSync(STATE_KEY, newVal)
  // 同步 legacy key
  uni.setStorageSync('user_food', newVal.food)
}, { deep: true })

export function useFoodSystem() {
  
  // 重新加载数据 (用于在页面显示时同步 add.vue 的更改)
  const reload = () => {
    const latest = uni.getStorageSync(STATE_KEY)
    if (latest) {
      state.food = latest.food || 0
      state.pendingFood = latest.pendingFood || 0
      state.dailyRecordCount = latest.dailyRecordCount || 0
      state.lastRecordDate = latest.lastRecordDate || ''
    }
  }

  // 映射到 UI 所需的结构 (为了兼容之前的组件写法，这里做个转换，或者直接修改组件)
  // 之前的组件用的是 state.daily.food, state.wallet
  // 我们可以通过 computed 来适配，或者直接修改组件。
  // 建议：直接暴露 state，并在组件里适配。
  
  // 为了不修改 FoodActionSheet.vue 太多，我们构造一个 computed 代理对象
  const uiState = computed(() => {
    return {
      wallet: state.food,
      maxWallet: 300, // 常量
      daily: {
        food: state.pendingFood,
        dailyRecordCount: state.dailyRecordCount,
        lastRecordDate: state.lastRecordDate
      }
    }
  })

  // 领取狗粮核心逻辑
  const claimFood = () => {
    // 再次重载以确保数据最新
    reload()
    
    const yieldAmount = state.pendingFood
    
    if (yieldAmount <= 0) {
      return { success: false, msg: '没有可领取的狗粮哦' }
    }
    
    const maxWallet = 300
    // 检查仓库是否已满
    if (state.food >= maxWallet) {
      return { success: false, msg: '粮仓已满，快去喂食消耗吧！' }
    }

    // 计算实际可领取的数量
    const spaceLeft = maxWallet - state.food
    const actualAdd = Math.min(yieldAmount, spaceLeft)
    
    // 执行事务
    state.food += actualAdd
    state.pendingFood -= actualAdd 
    
    return { 
      success: true, 
      msg: `成功领取 ${actualAdd}g 狗粮！`,
      amount: actualAdd
    }
  }

  // 调试用
  const debugReset = () => {
    state.food = 0
    state.pendingFood = 0
    state.dailyRecordCount = 0
    state.lastRecordDate = ''
    uni.removeStorageSync(STATE_KEY)
    uni.removeStorageSync('user_food')
    uni.removeStorageSync('poop_records')
  }

  // 喂食逻辑
  const feedPet = () => {
    reload() // 确保余额最新
    
    const COST = 20
    const HUNGER_GAIN = 20
    const EXP_GAIN_OVERFLOW = 5
    
    // 1. 检查余额
    if (state.food < COST) {
      return { 
        success: false, 
        code: 'INSUFFICIENT_FUNDS',
        msg: '粮仓空了，快去赚狗粮吧！' 
      }
    }
    
    // 2. 扣除余额
    state.food -= COST
    
    // 3. 增加状态
    let actualHungerGain = 0
    let expGain = 0
    
    // 剩余空间
    const space = 100 - state.pet.hunger
    
    if (space >= HUNGER_GAIN) {
      // 正常进食
      state.pet.hunger += HUNGER_GAIN
      actualHungerGain = HUNGER_GAIN
    } else {
      // 溢出处理
      state.pet.hunger = 100
      actualHungerGain = space
      // 溢出部分转化为经验 (只要满了就给经验，或者只有完全溢出才给？)
      // 根据 PLAN: 当饱食度 = 100 时，继续喂食触发宠溺
      // 这里简化逻辑：只要达到或维持 100，就给额外奖励
      expGain = EXP_GAIN_OVERFLOW
      state.pet.exp += expGain
    }
    
    // 升级逻辑 (简化：每100经验升一级)
    if (state.pet.exp >= 100) {
      state.pet.level += 1
      state.pet.exp -= 100
      // 可以返回 levelUp: true
    }
    
    return {
      success: true,
      msg: '投喂成功！',
      hungerDelta: actualHungerGain,
      expDelta: expGain,
      currentHunger: state.pet.hunger
    }
  }

  return {
    // 暴露原始 state 方便调试，暴露 uiState 给组件用
    state: uiState, 
    rawState: state,
    claimFood,
    feedPet, // 导出新方法
    debugReset,
    reload
  }
}
