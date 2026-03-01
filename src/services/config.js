/**
 * API 配置文件
 * 集中管理 API 地址、超时、端点等配置
 */

// 获取环境变量的安全方式（兼容 H5 和小程序）
const getApiBaseUrl = () => {
  // H5 环境：使用 import.meta.env
  // #ifdef H5
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  }
  // #endif

  // 小程序环境：使用 globalData 或直接返回默认值
  // #ifdef MP-WEIXIN
  const app = getApp()
  if (app && app.globalData && app.globalData.apiBaseUrl) {
    return app.globalData.apiBaseUrl
  }
  // #endif

  // 默认值
  return 'http://localhost:3000'
}

const API_BASE_URL = getApiBaseUrl()

export const config = {
  // 后端 API 基础地址
  BASE_URL: API_BASE_URL,

  // 请求超时时间 (ms)
  TIMEOUT: 10000,

  // Token 存储键名
  TOKEN_KEY: 'jwt_token',

  // 端点配置
  endpoints: {
    // 认证
    auth: {
      login: '/api/auth/login'
    },
    // 用户
    user: {
      info: '/api/user/info',
      settings: '/api/settings'
    },
    // 宠物
    pet: {
      state: '/api/pet/state',
      feed: '/api/pet/feed'
    },
    // 健康记录
    records: {
      list: '/api/records',
      create: '/api/records',
      detail: (id) => `/api/records/${id}`,
      update: (id) => `/api/records/${id}`,
      delete: (id) => `/api/records/${id}`,
      weeklyReport: '/api/records/weekly-report'
    },
    // 每日产出
    yields: {
      today: '/api/yields/today',
      claim: '/api/yields/claim'
    },
    // 定时任务
    jobs: {
      petHungerDecay: '/api/jobs/pet-hunger-decay',
      lowFoodReminder: '/api/jobs/low-food-reminder'
    }
  }
}

export default config
