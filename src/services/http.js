/**
 * HTTP 请求封装
 * 基于 uni.request 封装，提供类似 axios 的拦截器能力
 */

import { config } from './config'

// 请求拦截器
const requestInterceptors = []
// 响应拦截器
const responseInterceptors = []

// 注册请求拦截器
export function addRequestInterceptor(interceptor) {
  requestInterceptors.push(interceptor)
}

// 注册响应拦截器
export function addResponseInterceptor(interceptor) {
  responseInterceptors.push(interceptor)
}

// HTTP 请求类
class HTTPRequest {
  constructor(baseConfig) {
    this.baseURL = baseConfig.BASE_URL
    this.timeout = baseConfig.TIMEOUT
  }

  /**
   * 发起请求
   * @param {Object} options - 请求配置
   * @returns {Promise}
   */
  async request(options) {
    const {
      url = '',
      method = 'GET',
      data = null,
      header = {},
      timeout = this.timeout
    } = options

    // 拼接完整 URL
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`

    // 执行请求拦截器
    let requestConfig = {
      url: fullUrl,
      method,
      data,
      header,
      timeout
    }

    for (const interceptor of requestInterceptors) {
      requestConfig = await interceptor(requestConfig)
    }

    // 发起请求
    return new Promise((resolve, reject) => {
      uni.request({
        ...requestConfig,
        success: (res) => {
          // 执行响应拦截器
          this.handleResponse(res, resolve, reject)
        },
        fail: (err) => {
          // 网络错误处理
          this.handleError(err, reject)
        }
      })
    })
  }

  /**
   * 处理响应
   */
  async handleResponse(res, resolve, reject) {
    let response = {
      statusCode: res.statusCode,
      data: res.data
    }

    // 执行响应拦截器
    for (const interceptor of responseInterceptors) {
      try {
        response = await interceptor(response)
      } catch (err) {
        reject(err)
        return
      }
    }

    // 检查 HTTP 状态码
    const { statusCode, data } = response

    if (statusCode >= 200 && statusCode < 300) {
      resolve(data)
    } else {
      reject(new Error(data?.msg || `HTTP Error: ${statusCode}`))
    }
  }

  /**
   * 处理错误
   */
  handleError(err, reject) {
    let errorMsg = '网络请求失败'

    if (err.errMsg) {
      if (err.errMsg.includes('timeout')) {
        errorMsg = '请求超时，请稍后重试'
      } else if (err.errMsg.includes('fail')) {
        errorMsg = '网络连接失败，请检查网络'
      }
    }

    reject(new Error(errorMsg))
  }

  // 便捷方法
  get(url, params = {}) {
    return this.request({ url, method: 'GET', data: params })
  }

  post(url, data = {}) {
    return this.request({ url, method: 'POST', data })
  }

  put(url, data = {}) {
    return this.request({ url, method: 'PUT', data })
  }

  delete(url, params = {}) {
    return this.request({ url, method: 'DELETE', data: params })
  }
}

// 创建默认实例
const http = new HTTPRequest(config)

// 默认请求拦截器：注入 JWT Token
addRequestInterceptor((config) => {
  const token = uni.getStorageSync(config.TOKEN_KEY || 'jwt_token')
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    }
  }
  // 设置内容类型
  config.header = {
    ...config.header,
    'Content-Type': 'application/json'
  }
  return config
})

// 默认响应拦截器：统一错误处理
addResponseInterceptor((response) => {
  const { statusCode, data } = response

  // HTTP 错误状态码处理
  if (statusCode === 401) {
    // Token 过期或无效，清除登录状态
    uni.removeStorageSync('jwt_token')
    uni.removeStorageSync('openid')
    // 可以在这里触发重新登录
    throw new Error('登录已过期，请重新登录')
  }

  if (statusCode === 403) {
    throw new Error('无权限访问')
  }

  if (statusCode === 404) {
    throw new Error('请求的资源不存在')
  }

  if (statusCode === 500) {
    throw new Error('服务器错误')
  }

  return response
})

export default http
