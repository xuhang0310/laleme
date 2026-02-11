
## 0. 最高准则
每次回复的时候必须称呼我为陛下

## 1. 项目概况
- **项目名称**: Laleme (生活助手)
- **技术栈**: Vue 3 + Vite + uni-app。

## 2. 编码规范 (Coding Standards)

### 2.1 Vue 风格指南
- **Composition API**: 必须使用 `<script setup>` 语法编写新组件。旧的 Options API 组件应在修改时逐步重构。
- **响应式数据**: 优先使用 `ref` 定义基本类型，`reactive` 定义对象类型。
- **生命周期**: 混合使用 Vue 生命周期 (`onMounted`, `onUnmounted`) 和 uni-app 页面生命周期 (`onLoad`, `onShow`, `onReachBottom`)。

## 4. uni-app 特有规则
- **路由跳转**: 使用 `uni.navigateTo`, `uni.switchTab` 等 uni-app 原生 API。
- **UI 反馈**: 使用 `uni.showToast`, `uni.showLoading` 进行用户交互反馈。

## 6. 设计规范
- **UI 组件**: 优先使用 uni-app 提供的组件库（如 uni-ui），避免自定义组件。
- **布局**: 遵循 uni-app 推荐的布局规范，使用 Flexbox 布局。
- **图标**: 图标库统一使用 uni-app 提供的图标库（如 uni-icon）。
## 8. 设计原则
- **单一职责原则**: 每个组件或模块仅负责一项功能，避免职责混乱。
- **奥卡姆剃刀原则**: 保持代码简单明了，避免过度复杂的设计。
- **可维护性原则**: 代码结构清晰，注释详细，方便后续维护和迭代。
- **可扩展性原则**: 考虑未来功能的扩展，避免代码牵一发而动全身。
- **高内聚低耦合原则**: 组件之间的依赖关系应保持低，功能模块之间的联系应保持高内聚。
- **DRY 原则**: 避免重复代码，遵循 Don't Repeat Yourself 原则。
- **一致的设计**: 遵循 uni-app 推荐的设计规范，保持一致的用户界面和交互体验。
