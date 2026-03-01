/**
 * 用户 API
 */

import http from '@/services/http'
import { config } from '@/services/config'

export const userAPI = {
  /**
   * 获取用户信息
   * @returns {Promise}
   */
  getUserInfo: () => {
    return http.get(config.endpoints.user.info)
  },

  /**
   * 更新用户信息
   * @param {Object} data - 用户信息数据
   * @returns {Promise}
   */
  updateUserInfo: (data) => {
    return http.put(config.endpoints.user.info, data)
  },

  /**
   * 获取用户设置
   * @returns {Promise}
   */
  getSettings: () => {
    return http.get(config.endpoints.user.settings)
  },

  /**
   * 更新用户设置
   * @param {Object} data - 设置数据
   * @returns {Promise}
   */
  updateSettings: (data) => {
    return http.put(config.endpoints.user.settings, data)
  },

  /**
   * 发送测试邮件
   * @returns {Promise}
   */
  sendTestEmail: () => {
    return http.post(`${config.endpoints.user.settings}/test-email`)
  }
}

export default userAPI
