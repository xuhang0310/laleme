# Issue 12: 研发方向规划与差异分析

## 1. 现状与计划对比 (Plan vs. Implementation)

### 差异点分析
| 功能模块 | 原计划 (PLAN.md) | 当前实现 (Current) | 差异说明 |
| :--- | :--- | :--- | :--- |
| **单次喂食消耗** | 20g 狗粮 | **10g** 狗粮 | 已根据最新指令调整，降低消耗门槛。 |
| **饱食度上限逻辑** | 饱食度 100 后继续喂食 -> 转化为亲密度 (XP) | **禁止喂食** | 策略变更：避免误操作消耗，改为提示“不用再喂了”。 |
| **小狗状态** | 包含 Happy/Hungry/Starving 等多状态自动机 | 基础实现 (Normal/Eating/Sad) | 尚未实现基于时间的自动衰减和复杂的动画状态机。 |
| **数据展示** | 计划在互动区显示详细数值 | 暂未在主界面直接显示 | 用户提议讨论是否需要显性展示。 |
| **技术栈** | Pinia | `useFoodSystem` Composable | 暂未使用 Pinia，采用轻量级 Composable + LocalStorage 方案。 |

## 2. 下一步研发方向 (Next Steps)

### 2.1 核心讨论点
*   **UI 数据可视化**: 是否在巴迪乐园主界面显示 **饱食度 (Hunger)** 和 **亲密度 (Intimacy)**？
    *   *Pros*: 用户能直观看到喂食的反馈，更有成就感。
    *   *Cons*: 界面元素过多可能破坏沉浸感。
    *   *方案建议*: 可以考虑以“进度条”或“心形/骨头图标”的形式，集成在顶部或小狗脚下，点击才显示具体数值。

### 2.2 待办事项 (TODO)
1.  **技术栈升级**: 引入 Pinia 进行状态管理 (见第4节)。
2.  **完善状态衰减机制**: 实现后台或定时器逻辑，让饱食度随时间自然下降 (如每小时 -2点)，否则用户永远无法再次喂食。
3.  **UI 优化**: 
    *   在界面上增加饱食度/亲密度的可视化指示。
    *   优化底部图标，去除背景圈，放大图标 (已部分完成，需确认效果)。
4.  **记录与产出联动**: 确保 `poop/add.vue` 的记录真实增加 `pendingFood`，并且每日产出逻辑准确 (递减奖励)。

## 3. 狗粮消耗功能实现思路 (Consumption Implementation Strategy)

根据 `PLAN.md` 中的设计，狗粮消耗分为**主动消耗**和**被动消耗**两部分。为了实现这一机制，建议采取以下技术方案：

### 3.1 被动消耗：时间流逝与饱食度衰减 (Passive Decay)
这是驱动用户持续互动的核心机制。

*   **业务规则**: 
    *   饱食度每小时自然衰减 **2点** (约50小时从满腹到饿死)。
    *   1点 饱食度 = 1g 狗粮 (通过喂食补充)。
*   **技术实现 (Lazy Calculation)**:
    *   **不使用后台定时器**: 避免 App 关闭后无法计算。
    *   **时间戳差值计算**:
        1.  在 `user_state` 中记录 `last_hunger_update_time` (上次更新饱食度的时间戳)。
        2.  每次打开 App 或进入巴迪乐园页面 (`onShow`) 时，触发计算：
            ```javascript
            const now = Date.now();
            const hoursPassed = (now - last_hunger_update_time) / (1000 * 60 * 60);
            const decay = Math.floor(hoursPassed * 2); // 每小时扣2点
            
            if (decay > 0) {
              currentHunger = Math.max(0, currentHunger - decay);
              last_hunger_update_time = now; // 更新时间戳
              saveState();
            }
            ```
    *   **状态联动**: 计算完后，如果 `currentHunger < 30`，自动切换小狗状态为 `Sad/Hungry`。

### 3.2 主动消耗：互动成本 (Active Sinks)
为了防止后期狗粮通胀，增加互动场景的消耗。

*   **喂食 (Feeding)**: 
    *   **现状**: 已实现，每次消耗 10g，增加 10点 饱食度。
    *   **限制**: 饱食度 >= 100 禁止喂食 (符合最新指令)。
*   **聊天/陪玩 (Chat/Play)**:
    *   **计划**: 每次对话消耗 **5g** 狗粮。
    *   **实现思路**: 在点击“聊天”按钮进入聊天模式时，或发送每一条消息时，检查余额并扣除。
    *   **提示**: 余额不足时提示“小狗累了，吃饱了才有力气聊天哦”。

## 4. Pinia 升级计划 (Upgrade Plan)

经确认，Pinia 完全兼容 uniapp 及微信小程序环境。为支撑日益复杂的“状态自动机”和“全局数据联动”，建议按以下步骤进行迁移：

### 4.1 为什么要升级？
*   **DevTools 支持**: 可以实时观察状态变化，调试更方便。
*   **模块化**: `useFoodSystem` 目前承担了太多职责（数据、UI逻辑、业务逻辑），拆分为 `UserStore` (资产) 和 `PetStore` (宠物状态) 更清晰。
*   **持久化插件**: `pinia-plugin-persistedstate` 可以自动处理 `uni.setStorage`，减少手动 watch 代码。

### 4.2 迁移步骤
1.  **安装依赖**:
    ```bash
    npm install pinia pinia-plugin-persistedstate-uni
    ```
2.  **配置主入口**:
    在 `main.js` 中注册 Pinia 实例。
3.  **重构 Store**:
    *   创建 `src/stores/user.js`: 管理 `food`, `pendingFood`, `dailyRecordCount`。
    *   创建 `src/stores/pet.js`: 管理 `hunger`, `exp`, `level`, `status`。
4.  **替换调用**:
    *   修改 `FoodActionSheet.vue` 和 `index.vue`，从 `useFoodSystem` 切换为 `useUserStore()` 和 `usePetStore()`。
5.  **清理遗留**:
    *   删除 `useFoodSystem.js`。

### 4.3 兼容性备注
*   uniapp 的 Vue 3 版本已内置对 Pinia 的支持。
*   微信小程序端需注意 `pinia-plugin-persistedstate` 需使用适配 uniapp 的版本 (如 `pinia-plugin-persistedstate-uni` 或手动配置 storage)。

## 5. 结论与行动
请在下方补充讨论意见，确定是否执行 2.1 中的 UI 变更。
