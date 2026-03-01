# 下一步开发计划 (Development Roadmap)

基于 [issue12.md](issue12.md) 的分析与规划，我们制定了以下分阶段开发计划。

## 阶段一：地基加固 (Infrastructure & Pinia)
**目标**: 引入 Pinia 状态管理，替换临时的 `useFoodSystem`，为复杂逻辑做准备。

1.  **安装依赖**
    *   执行 `npm install pinia pinia-plugin-persistedstate-uni`。
2.  **Pinia 初始化**
    *   在 `main.js` 中注册 Pinia 实例。
    *   配置持久化插件 `pinia-plugin-persistedstate-uni`。
3.  **Store 拆分与迁移**
    *   创建 `src/stores/user.js`: 
        *   管理: `food` (余额), `pendingFood` (待领), `dailyRecordCount`。
        *   Action: `claimFood` (领狗粮)。
    *   创建 `src/stores/pet.js`: 
        *   管理: `hunger` (饱食), `exp` (亲密), `level`, `status`, `lastHungerUpdateTime`。
        *   Action: `feed` (喂食), `updateStatus` (状态计算)。
4.  **组件重构**
    *   `FoodActionSheet.vue` -> 对接 `UserStore`。
    *   `index.vue` (巴迪乐园) -> 对接 `PetStore` 和 `UserStore`。
    *   `add.vue` (记录页) -> 对接 `UserStore` (增加待领狗粮)。

## 阶段二：核心机制 (Core Mechanics)
**目标**: 让小狗"活"起来，实现随时间流逝的生理变化。

1.  **饱食度自然衰减 (Passive Decay)**
    *   **策略**: 惰性计算 (Lazy Calculation)。
    *   **实现**: 在 `PetStore` 中新增 `checkHunger()` 方法。
        *   计算 `(Now - lastHungerUpdateTime)` 的时间差。
        *   按 **-2点/小时** 扣除饱食度。
        *   若饱食度 < 30，自动切换 `status = 'sad'`。
    *   **触发点**: App `onShow` 及 巴迪乐园页面 `onShow`。
2.  **记录与产出联动**
    *   确保在 `add.vue` 记录便便时，正确调用 `UserStore.addPendingFood()`。
    *   实现递减奖励逻辑 (第1次+40, 第2次+10...)。

## 阶段三：视觉与交互 (UI/UX)
**目标**: 提升沉浸感，让数据可视化。

1.  **状态可视化**
    *   在巴迪乐园顶部或小狗脚下增加 **饱食度** 和 **亲密度** 进度条/图标。
    *   (可选) 点击小狗显示详细属性面板。
2.  **底部栏优化**
    *   彻底移除 `.icon-circle` 背景。
    *   调整图标尺寸至更大，优化点击区域。
3.  **聊天消耗**
    *   实现点击"聊天"或发送消息时，扣除 5g 狗粮。
    *   余额不足拦截。

---

## 执行顺序
建议按 **阶段一 -> 阶段二 -> 阶段三** 的顺序执行。
当前首要任务是完成 **阶段一 (Pinia 迁移)**，以保证后续逻辑写在正确的地方。
