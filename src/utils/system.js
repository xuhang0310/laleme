/**
 * 系统信息工具类
 * 用于获取状态栏高度、胶囊按钮位置等安全区域信息
 */

let systemInfo = null
let capsuleInfo = null

/**
 * 获取系统信息（单例）
 */
export const getSystemInfo = () => {
  if (!systemInfo) {
    try {
      systemInfo = uni.getSystemInfoSync()
    } catch (e) {
      console.error('获取系统信息失败', e)
      systemInfo = {}
    }
  }
  return systemInfo
}

/**
 * 获取胶囊按钮信息（小程序环境）
 */
export const getCapsuleInfo = () => {
  if (!capsuleInfo) {
    try {
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      if (menuButtonInfo) {
        capsuleInfo = {
          top: menuButtonInfo.top,
          bottom: menuButtonInfo.bottom,
          height: menuButtonInfo.height,
          width: menuButtonInfo.width,
          right: menuButtonInfo.right,
          left: menuButtonInfo.left
        }
      }
    } catch (e) {
      // 非小程序环境或获取失败
      capsuleInfo = null
    }
  }
  return capsuleInfo
}

/**
 * 获取状态栏高度
 */
export const getStatusBarHeight = () => {
  const systemInfo = getSystemInfo()
  // 微信小程序状态栏高度一般为 20px (44px - 24px 导航栏高度)
  // 通过胶囊按钮位置反推更准确
  const capsuleInfo = getCapsuleInfo()
  if (capsuleInfo) {
    return capsuleInfo.top
  }
  // 备用：使用系统状态栏高度
  return systemInfo.statusBarHeight || 20
}

/**
 * 获取自定义导航栏高度（状态栏 + 胶囊区域）
 */
export const getNavBarHeight = () => {
  const capsuleInfo = getCapsuleInfo()
  if (capsuleInfo) {
    // 胶囊底部 + 底部安全间距
    return capsuleInfo.bottom + 8
  }
  // 默认：状态栏 20px + 导航栏 44px = 64px
  const statusBarHeight = getStatusBarHeight()
  return statusBarHeight + 44
}

/**
 * 获取右侧胶囊占用的宽度（用于避免内容被遮挡）
 */
export const getCapsuleRightWidth = () => {
  const capsuleInfo = getCapsuleInfo()
  if (capsuleInfo) {
    // 屏幕宽度 - 胶囊右侧位置 + 安全间距
    const systemInfo = getSystemInfo()
    return systemInfo.windowWidth - capsuleInfo.right + 16
  }
  return 100 // 默认预留 100px
}

/**
 * 初始化系统信息（在 App.vue 中调用）
 */
export const initSystemInfo = () => {
  // 预热获取系统信息
  getSystemInfo()
  getCapsuleInfo()
}

/**
 * 生成安全区域样式（用于 navigationStyle: custom 的页面）
 */
export const getSafeAreaStyle = () => {
  const statusBarHeight = getStatusBarHeight()
  const navBarHeight = getNavBarHeight()
  const capsuleRightWidth = getCapsuleRightWidth()

  return {
    paddingTop: statusBarHeight + 'px',
    safeAreaTop: navBarHeight + 'rpx',
    rightSafeWidth: capsuleRightWidth + 'px'
  }
}
