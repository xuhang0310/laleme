import { defineStore } from 'pinia'
import { userAPI } from '@/services/api'
import { config } from '@/services/config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    openid: null,
    userInfo: null,
    isInitializing: true  // 初始化检查中
  }),
  actions: {
    // 检查登录状态
    async checkLoginStatus() {
      // 检查本地是否有 token 和 openid
      const token = uni.getStorageSync(config.TOKEN_KEY)
      const openid = uni.getStorageSync('openid')

      if (token && openid) {
        this.openid = openid
        this.isLoggedIn = true
        // 获取用户信息
        await this.fetchUserInfo()
      }
      this.isInitializing = false
    },

    // 微信登录
    async wxLogin() {
      return new Promise((resolve, reject) => {
        // 1. 微信登录获取 code
        uni.login({
          provider: 'weixin',
          success: async (loginRes) => {
            try {
              const { code } = loginRes

              // 2. 调用 HTTP API 登录/注册
              const result = await userAPI.login(code)

              if (result.success) {
                // 保存 JWT Token
                if (result.token) {
                  uni.setStorageSync(config.TOKEN_KEY, result.token)
                }
                // 保存 openid 和用户信息
                this.openid = result.openid
                this.userInfo = result.userInfo
                this.isLoggedIn = true
                uni.setStorageSync('openid', result.openid)

                // 同步用户数据到本地 store
                await this.fetchUserInfo()

                resolve(result)
              } else {
                reject(new Error(result.msg || '登录失败'))
              }
            } catch (error) {
              reject(error)
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },

    // 获取用户信息
    async fetchUserInfo() {
      try {
        const res = await userAPI.getUserInfo()
        if (res.success) {
          this.userInfo = res.data
          return res
        }
        return res
      } catch (error) {
        console.error('获取用户信息失败:', error)
        return { success: false, error }
      }
    },

    // 退出登录
    logout() {
      this.$reset()
      uni.removeStorageSync(config.TOKEN_KEY)
      uni.removeStorageSync('openid')
    }
  },
  unistorage: {
    key: 'auth_state_pinia',
    paths: ['openid', 'isLoggedIn']
  }
})
