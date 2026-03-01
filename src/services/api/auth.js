/**
 * 认证 API
 */

import http from '@/services/http'
import { config } from '@/services/config'

export const authAPI = {
  /**
   * 微信登录
   * @param {string} code - 微信登录 code
   * @returns {Promise}
   */
  login: (code) => {
    return http.post(config.endpoints.auth.login, { code })
  }
}

export default authAPI
