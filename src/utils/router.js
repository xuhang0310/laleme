/**
 * 页面跳转工具封装
 * 统一小程序页面跳转动画体验
 */

/**
 * 推入新页面（从右侧滑入 - 标准导航）
 * 适用于：首页→详情页、列表页→详情页
 * @param {string} url - 页面路径
 * @param {object} params - 传递参数
 */
export const push = (url, params = {}) => {
  const query = Object.keys(params).length > 0
    ? '?' + Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    : ''
  uni.navigateTo({ url: url + query })
}

/**
 * 返回上一页
 * @param {number} delta - 返回的页面数，默认 1
 */
export const pop = (delta = 1) => {
  uni.navigateBack({ delta })
}

/**
 * 模态呈现（从底部滑入）
 * 适用于：弹窗页面、表单页面
 * @param {string} url - 页面路径
 * @param {object} params - 传递参数
 */
export const present = (url, params = {}) => {
  const query = Object.keys(params).length > 0
    ? '?' + Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    : ''
  uni.navigateTo({ url: url + query })
}

/**
 * 替换当前页（无动画）
 * 适用于：登录页→首页、引导页→首页
 * @param {string} url - 页面路径
 */
export const replace = (url) => {
  uni.redirectTo({ url })
}

/**
 * 关闭所有页面，打开到应用内的某个页面（无动画）
 * 适用于：返回首页
 * @param {string} url - 页面路径
 */
export const relaunch = (url) => {
  uni.reLaunch({ url })
}

/**
 * 跳转到 tabBar 页面（无动画）
 * @param {string} url - tabBar 页面路径
 */
export const switchTab = (url) => {
  uni.switchTab({ url })
}

/**
 * 关闭当前页面，跳转到应用内的某个页面
 * @param {string} url - 页面路径
 */
export const replaceCurrent = (url) => {
  // 微信小程序特有
  // #ifdef MP-WEIXIN
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const route = currentPage.route

  uni.navigateBack({
    delta: pages.length - 1,
    success: () => {
      uni.redirectTo({ url })
    }
  })
  // #endif

  // #ifndef MP-WEIXIN
  uni.redirectTo({ url })
  // #endif
}

// 预设常用跳转
export const goTo = {
  home: () => relaunch('/pages/index/index'),
  report: () => push('/pages/poop/report'),
  add: () => present('/pages/poop/add'),
  user: () => push('/pages/user/index'),
  chat: () => push('/pages/chat/index')
}
