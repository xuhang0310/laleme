/**
 * API 统一导出
 */

export { authAPI } from './auth'
export { userAPI } from './user'
export { petAPI } from './pet'
export { recordAPI } from './record'
export { yieldAPI } from './yield'

// 兼容旧的导出方式
import { userAPI as _userAPI } from './user'
import { petAPI as _petAPI } from './pet'
import { recordAPI as _recordAPI } from './record'

export const userAPI = _userAPI
export const petAPI = _petAPI
export const recordAPI = _recordAPI

export default {
  userAPI: _userAPI,
  petAPI: _petAPI,
  recordAPI: _recordAPI
}
