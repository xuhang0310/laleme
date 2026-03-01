/**
 * 宠物 API
 */

import http from '@/services/http'
import { config } from '@/services/config'

export const petAPI = {
  /**
   * 获取宠物状态
   * @returns {Promise}
   */
  getPet: () => {
    return http.get(config.endpoints.pet.state)
  },

  /**
   * 喂食宠物
   * @param {Object} data - 喂食数据 { foodAmount: number }
   * @returns {Promise}
   */
  feedPet: (data) => {
    return http.post(config.endpoints.pet.feed, data)
  }
}

export default petAPI
