/**
 * 产出 API
 */

import http from '@/services/http'
import { config } from '@/services/config'

export const yieldAPI = {
  /**
   * 获取今日产出
   * @returns {Promise}
   */
  getTodayYield: () => {
    return http.get(config.endpoints.yields.today)
  },

  /**
   * 领取狗粮
   * @returns {Promise}
   */
  claimFood: () => {
    return http.post(config.endpoints.yields.claim)
  }
}

export default yieldAPI
