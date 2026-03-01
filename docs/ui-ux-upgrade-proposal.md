# 宠物陪伴排便系统 - UniApp 小程序高端 UI 升级方案

> **重要约束**：微信小程序环境
> - ❌ 不支持内联 SVG（需改用图片/字体图标）
> - ❌ 不支持 backdrop-filter（毛玻璃需降级）
> - ❌ 主包限制 2MB（资源需压缩/分包）
> - ✅ 支持 CSS3 动画（transform/opacity）
> - ✅ 支持 base64 图片
> - ✅ 支持 uni.createSelectorQuery() 动画

---

## 一、现状问题与改进方向

### 当前核心问题

| 问题 | 具体表现 | 改进方向 |
|------|----------|----------|
| **图标混乱** | emoji + 本地图片混用，风格不统一 | 统一使用 uni-icons 字体图标 |
| **颜色生硬** | 高饱和绿色 #00E676，缺乏层次 | 低饱和莫兰迪色系 |
| **间距随意** | 12rpx/20rpx/30rpx 混用 | 统一 8rpx 倍数系统 |
| **卡片平庸** | 白色方块 + 简单阴影 | 大圆角 + 柔和阴影 + 层次 |
| **交互单一** | 只有 toast 反馈 | 增加微动画 + 震动 |
| **宠物割裂** | 图片与 UI 风格不搭 | 统一治愈系画风 |

---

## 二、设计系统（小程序适配版）

### 2.1 颜色系统

**文件**: `src/uni.scss`

```scss
// 主色 - 低饱和豆沙绿（高端感核心）
$color-primary: #8FB3A0;
$color-primary-light: #A8C9B8;
$color-primary-dark: #6B9180;
$color-primary-bg: rgba(143, 179, 160, 0.08);

// 辅助色 - 温暖中性色
$color-secondary: #D4A59A;     // 干枯玫瑰粉
$color-secondary-bg: rgba(212, 165, 154, 0.08);

// 功能色
$color-success: #7CB393;       // 成功绿
$color-warning: #E8B878;       // 提醒黄
$color-error: #D98888;         // 错误红（低饱和）

// 背景色
$bg-page: #F9F7F4;            // 暖白页面背景
$bg-card: #FFFFFF;            // 纯白卡片
$bg-section: #F2EFE9;         // 浅米色区块

// 文字色
$text-primary: #4A4A4A;       // 标题深灰
$text-secondary: #7A7A7A;     // 正文中灰
$text-muted: #A8A8A8;         // 辅助浅灰
$text-disabled: #D0D0D0;      // 禁用更浅
$text-inverse: #FFFFFF;       // 反色白
```

### 2.2 间距系统（8rpx 基准）

```scss
$spacing-1: 8rpx;   // 1x
$spacing-2: 16rpx;  // 2x
$spacing-3: 24rpx;  // 3x
$spacing-4: 32rpx;  // 4x
$spacing-5: 40rpx;  // 5x
$spacing-6: 48rpx;  // 6x
$spacing-8: 64rpx;  // 8x
```

### 2.3 圆角系统

```scss
$radius-sm: 12rpx;   // 标签、小按钮
$radius-md: 20rpx;   // 普通按钮
$radius-lg: 32rpx;   // 卡片
$radius-xl: 48rpx;   // 大卡片、弹窗
$radius-round: 9999rpx; // 胶囊型
```

### 2.4 阴影系统（柔和化）

```scss
$shadow-sm: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
$shadow-md: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
$shadow-lg: 0 12rpx 40rpx rgba(0, 0, 0, 0.08);
$shadow-float: 0 16rpx 48rpx rgba(0, 0, 0, 0.10);
```

### 2.5 图标方案（关键！）

**问题**：微信小程序不支持内联 SVG

**解决方案**：使用 **uni-icons 字体图标**

```vue
<uni-icons type="checkmarkempty" size="20" color="#8FB3A0"></uni-icons>
<uni-icons type="heart" size="20" color="#D4A59A"></uni-icons>
<uni-icons type="notification" size="20" color="#7A7A7A"></uni-icons>
<uni-icons type="home" size="24" color="#4A4A4A"></uni-icons>
<uni-icons type="calendar" size="24" color="#4A4A4A"></uni-icons>
<uni-icons type="person" size="24" color="#4A4A4A"></uni-icons>
```

---

## 三、核心页面改造

### 3.1 首页 (`src/pages/index/index.vue`)

**改造目标**：从"信息罗列"变为"宠物小家"

**关键改动**：
- 顶部大问候语，增强情感连接
- 宠物卡片场景化（带对话气泡）
- 状态卡片横向滚动
- 快捷操作区

### 3.2 报告页 (`src/pages/poop/report.vue`)

**改造目标**：从"医疗报告"变为"健康周报"

**关键改动**：
- 宠物评语卡片（渐变背景）
- 核心数据三列网格
- 简化版柱状图（纯色块）
- 记录列表用 uni-icons 标记状态

### 3.3 记录页 (`src/pages/poop/add.vue`)

**改造目标**：从"表单填写"变为"轻松选择"

**关键改动**：
- 类型切换用大卡片（非单选框）
- 性状选择用 Chips 标签
- 感受选择用表情网格
- 提交按钮固定在底部

---

## 四、通用组件

### 4.1 底部导航

保持现有实现，调整颜色为莫兰迪色系。

### 4.2 空状态组件

```vue
<template>
  <view class="empty-state">
    <view class="empty-icon">
      <uni-icons type="info" size="80" color="#D0D0D0" />
    </view>
    <text class="empty-title">{{ title }}</text>
    <text class="empty-desc" v-if="desc">{{ desc }}</text>
    <slot name="action"></slot>
  </view>
</template>
```

---

## 五、实施清单

### 阶段一：设计系统建立（P0）
- [ ] 更新 `src/uni.scss` - 莫兰迪色系
- [ ] 更新 `src/App.vue` - 全局公共样式
- [ ] 引入 uni-icons 组件

### 阶段二：核心页面改造（P0）
- [ ] 首页 (`src/pages/index/index.vue`)
- [ ] 报告页 (`src/pages/poop/report.vue`)
- [ ] 记录页 (`src/pages/poop/add.vue`)

### 阶段三：组件优化（P1）
- [ ] FloatingTabBar 颜色调整
- [ ] EmptyState 组件
- [ ] 统一图标风格

### 阶段四：细节打磨（P2）
- [ ] 宠物互动动画优化
- [ ] 成功反馈加强（toast + 震动）
- [ ] 加载状态优化

---

## 六、资源准备清单

### 宠物图片（建议尺寸）
```
/static/pet/
  ├── pet-normal.png      (400x400px @3x)
  ├── pet-happy.png       (400x400px)
  ├── pet-sad.png         (400x400px)
  └── pet-eating.png      (400x400px)
```

### 功能图标
使用 uni-icons，无需额外准备。

---

## 七、注意事项

1. **图片压缩**：所有 PNG 使用 TinyPNG 压缩
2. **base64 小图标**：< 4KB 的图标可转 base64 减少请求
3. **分包加载**：如包体积超限，考虑将报告页等放入子包
4. **动画性能**：仅对 transform/opacity 做动画，避免触发重排

---

## 八、效果预期

改造后应达到：
- ✅ 视觉统一，有高端感
- ✅ 交互流畅，60fps
- ✅ 主包 < 2MB
- ✅ 用户反馈"舒服"、"好看"、"不像工具像玩具"
