/**
 * 健康记录 API
 */

import http from '@/services/http'
import { config } from '@/services/config'

export const recordAPI = {
  /**
   * 获取记录列表
   * @param {Object} params - 查询参数 { page, pageSize, startDate, endDate }
   * @returns {Promise}
   */
  getRecords: (params = {}) => {
    return http.get(config.endpoints.records.list, params)
  },

  /**
   * 创建记录
   * @param {Object} data - 记录数据
   * @returns {Promise}
   */
  addRecord: (data) => {
    return http.post(config.endpoints.records.create, data)
  },

  /**
   * 获取单条记录
   * @param {string|number} id - 记录 ID
   * @returns {Promise}
   */
  getRecord: (id) => {
    return http.get(config.endpoints.records.detail(id))
  },

  /**
   * 更新记录
   * @param {string|number} id - 记录 ID
   * @param {Object} data - 更新数据
   * @returns {Promise}
   */
  updateRecord: (id, data) => {
    return http.put(config.endpoints.records.update(id), data)
  },

  /**
   * 删除记录
   * @param {string|number} id - 记录 ID
   * @returns {Promise}
   */
  deleteRecord: (id) => {
    return http.delete(config.endpoints.records.delete(id))
  },

  /**
   * 获取周报
   * @returns {Promise}
   */
  getWeeklyReport: () => {
    return http.get(config.endpoints.records.weeklyReport)
  }
}

export default recordAPI
