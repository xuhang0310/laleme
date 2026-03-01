# 小程序页面切换动画方案

## 一、互联网大厂动画设计原则

### 1. 核心原则
- **自然流畅**：动画曲线符合物理规律（使用 ease-out/ease-in-out）
- **快速高效**：动画时长控制在 200-300ms，避免拖沓
- **层次分明**：不同操作使用不同的动画类型
- **一致性**：全局动画风格统一

### 2. 动画时长参考
| 场景 | 时长 | 说明 |
|------|------|------|
| 页面推入（push） | 200-250ms | 新页面从右侧滑入 |
| 页面弹出（pop） | 200ms | 返回上一页 |
| 模态弹窗 | 250-300ms | 从底部滑入，稍慢以示郑重 |
| 淡入淡出 | 150-200ms | 轻量级过渡 |

---

## 二、uni-app 动画类型详解

### 1. 内置动画类型
| 动画类型 | 效果 | 适用场景 |
|---------|------|---------|
| `slide-in-right` | 从右侧滑入 | 导航跳转、详情页 |
| `slide-in-left` | 从左侧滑入 | 返回上一页 |
| `slide-in-top` | 从顶部滑入 | 下拉刷新页面 |
| `slide-in-bottom` | 从底部滑入 | 模态页面、弹窗 |
| `fade-in` | 淡入 | 轻量级页面、首页 |
| `zoom-in` | 放大淡入 | 卡片展开详情 |
| `zoom-out` | 缩小淡出 | 详情收起 |
| `pop-in` | 弹入效果 | 轻弹窗 |

### 2. 推荐组合
```json
{
  "push": {
    "animationType": "slide-in-right",
    "animationDuration": 200
  },
  "present": {
    "animationType": "slide-in-bottom",
    "animationDuration": 250
  },
  "presentSheet": {
    "animationType": "slide-in-bottom",
    "animationDuration": 300
  }
}
```

---

## 三、大厂动画实践参考

### 1. 微信
- **公众号文章**：`slide-in-right` (250ms)
- **小程序返回**：手势滑动 + `slide-in-left`
- **支付页面**：`slide-in-bottom` (300ms)

### 2. 支付宝
- **服务跳转**：`fade-in` (200ms)
- **账单详情**：`slide-in-right` (220ms)
- **扫码页**：`slide-in-bottom` (250ms)

### 3. 美团/大众点评
- **商家详情**：`slide-in-right` (200ms)
- **订单页**：`slide-in-right` (200ms)
- **筛选弹窗**：`slide-in-bottom` (250ms)

### 4. 淘宝/京东
- **商品详情**：`slide-in-right` (220ms)
- **购物车**：`slide-in-bottom` (280ms)
- **登录页**：`slide-in-right` (200ms)

---

## 四、本项目动画配置

### 1. pages.json 配置
```json
{
  "globalStyle": {
    "animationType": "fade-in",
    "animationDuration": 200
  },
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationStyle": "custom",
        "animationType": "fade-in",
        "animationDuration": 200
      }
    },
    {
      "path": "pages/poop/report",
      "style": {
        "navigationStyle": "custom",
        "animationType": "slide-in-right",
        "animationDuration": 200
      }
    },
    {
      "path": "pages/poop/add",
      "style": {
        "navigationStyle": "custom",
        "animationType": "slide-in-bottom",
        "animationDuration": 250
      }
    }
  ]
}
```

### 2. 页面跳转封装
在 `src/utils/router.js` 中封装页面跳转，统一动画体验：

```javascript
/**
 * 页面跳转封装（带统一动画）
 */

/**
 * 推入新页面（从右侧滑入）
 * @param {string} url - 页面路径
 */
export const push = (url) => {
  uni.navigateTo({ url })
}

/**
 * 返回上一页
 */
export const pop = () => {
  uni.navigateBack()
}

/**
 * 模态呈现（从底部滑入）
 * @param {string} url - 页面路径
 */
export const present = (url) => {
  uni.navigateTo({ url })
}

/**
 * 替换当前页（无动画）
 * @param {string} url - 页面路径
 */
export const replace = (url) => {
  uni.redirectTo({ url })
}

/**
 * 返回首页（无动画）
 */
export const backToHome = () => {
  uni.reLaunch({ url: '/pages/index/index' })
}
```

---

## 五、进阶动画方案

### 1. CSS 动画
对于更复杂的动画效果，可以使用 CSS 动画：

```scss
// 页面进入动画
.page-enter-active {
  animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

// 页面离开动画
.page-leave-active {
  animation: slideOutLeft 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### 2. 过渡动画组件
创建全局过渡动画组件：

```vue
<!-- src/components/PageTransition.vue -->
<template>
  <view class="page-transition" :class="transitionClass">
    <slot />
  </view>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'slide-right' // slide-right, fade, bottom
  }
})

const transitionClass = computed(() => {
  const map = {
    'slide-right': 'transition-slide-right',
    'fade': 'transition-fade',
    'bottom': 'transition-bottom'
  }
  return map[props.type]
})
</script>

<style lang="scss">
.transition-slide-right {
  animation: slideInRight 0.2s ease-out;
}

.transition-fade {
  animation: fadeIn 0.15s ease-out;
}

.transition-bottom {
  animation: slideInBottom 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInBottom {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
```

---

## 六、动画性能优化

### 1. 只动画 transform 和 opacity
```scss
// 好的做法
transform: translateX(100%);
opacity: 0;

// 避免
margin-left: 100%;
background-color: rgba();
```

### 2. 使用 will-change
```scss
.animated-element {
  will-change: transform;
}
```

### 3. 避免过度动画
- 不要同时动画多个元素
- 减少动画层级嵌套
- 避免在动画中执行复杂计算

---

## 七、测试与调试

### 1. 动画调试技巧
```javascript
// 在开发环境显示动画时长
if (process.env.NODE_ENV === 'development') {
  uni.navigateTo({
    url,
    animationType: 'slide-in-right',
    animationDuration: 200 // 可调整查看效果
  })
}
```

### 2. 性能检测
使用微信开发者工具的 Performance 面板：
- 查看 FPS（目标：60fps）
- 检测内存使用
- 分析渲染耗时

---

## 八、总结

| 页面类型 | 动画类型 | 时长 | 缓动函数 |
|---------|---------|------|---------|
| 首页 → 报告页 | slide-in-right | 200ms | ease-out |
| 首页 → 记录页 | slide-in-bottom | 250ms | cubic-bezier(0.16, 1, 0.3, 1) |
| 报告页 → 返回 | slide-in-left | 200ms | ease-in |
| 底部弹窗 | slide-in-bottom | 300ms | cubic-bezier |
| 首页加载 | fade-in | 150ms | ease-out |

**关键要点**：
1. 动画时长控制在 200-300ms
2. 使用缓动函数让动画更自然
3. 保持全局动画风格一致
4. 性能优先，避免过度动画
