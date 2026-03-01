/**
 * API 服务层 - HTTP 请求封装
 * 保持与旧版相同的导出接口，内部实现改为 HTTP 请求
 */

import http from '@/services/http'
import { config } from '@/services/config'

// ==================== 辅助方法 ====================

/**
 * 统一响应处理，适配后端返回格式
 * 后端返回格式：{ success: boolean, data?: any, msg?: string, ... }
 * 前端期望格式：{ success: boolean, data?: any, msg?: string }
 */
function handleResponse(response, options = {}) {
  const { dataFormat = 'default' } = options

  // 如果响应已经包含 success 字段，直接返回
  if (response && typeof response.success === 'boolean') {
    return response
  }

  // 根据 HTTP 状态码判断成功
  if (dataFormat === 'raw') {
    return { success: true, data: response }
  }

  // 默认格式：后端 RESTful API 返回
  return {
    success: true,
    data: response,
    msg: response?.msg || '操作成功'
  }
}

function handleError(error, defaultMessage = '操作失败') {
  console.error('API 调用失败:', error)
  return {
    success: false,
    msg: error.message || defaultMessage,
    error
  }
}

// ==================== 用户 API ====================
export const userAPI = {
  // 微信登录/注册 - 注意：这个方法实际上在 authAPI 中，这里为了兼容保留
  login: async (code) => {
    try {
      const response = await http.post(config.endpoints.auth.login, { code })
      return handleResponse(response)
    } catch (error) {
      return handleError(error, '登录失败')
    }
  },

  // 获取用户信息
  getUserInfo: async () => {
    try {
      const response = await http.get(config.endpoints.user.info)
      return handleResponse(response)
    } catch (error) {
      return handleError(error, '获取用户信息失败')
    }
  },

  // 更新用户信息
  updateUserInfo: async (data) => {
    try {
      const response = await http.put(config.endpoints.user.info, data)
      return handleResponse(response)
    } catch (error) {
      return handleError(error, '更新用户信息失败')
    }
  },

  // 领取狗粮
  claimFood: async () => {
    try {
      const response = await http.post(config.endpoints.yields.claim)
      return handleResponse(response)
    } catch (error) {
      return handleError(error, '领取狗粮失败')
    }
  }
}

// ==================== 宠物 API ====================
export const petAPI = {
  // 获取宠物信息
  getPet: async () => {
    try {
      const response = await http.get(config.endpoints.pet.state)
      return handleResponse(response)
    } catch (error) {
      return handleError(error, '获取宠物信息失败')
    }
  },

  // 喂食
  feedPet: async (data) => {
    try {
      const response = await http.post(config.endpoints.pet.feed, data)
      return handleResponse(response)
    } catch (error) {
      return handleError(error, '喂食失败')
    }
  },

  // 同步宠物数据 - 移除，改为前端直接调用 feedPet
  syncPetData: async (data) => {
    console.warn('syncPetData 已废弃，请直接使用 feedPet')
    return { success: false, msg: '该方法已废弃' }
  }
}

// ==================== 记录 API ====================
export const recordAPI = {
  // 添加记录
  addRecord: async (data) => {
    try {
      const response = await http.post(config.endpoints.records.create, data)
      return handleResponse(response)
    } catch (error) {
      return handleError(error, '保存记录失败')
    }
  },

  // 获取记录列表
  getRecords: async (data) => {
    try {
      const response = await http.get(config.endpoints.records.list, data)
      return handleResponse(response)
    } catch (error) {
      return handleError(error, '获取记录列表失败')
    }
  }
}

// 导出 HTTP 实例供高级用法使用
export { http }
