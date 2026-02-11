# 研发评审记录 (Engineering Review)

> Generated based on technical review of `PLAN.md` and current project status.

## 🚨 P0: 阻断性问题 (Blockers)
- [ ] **依赖缺失 (Missing Dependency)**
    - **现状**: `package.json` 中缺少 `pinia`。
    - **风险**: Vue 3 生态的标准状态管理库缺失，导致 `usePetStore` 无法实现。
    - **行动**: 需运行 `npm install pinia pinia-plugin-persistedstate`。
- [ ] **资源命名错误 (Typo)**
    - **现状**: 代码中引用 `/static/puppy_hugry.png`，文件名拼写错误（应为 `hungry`）。
    - **风险**: 长期维护困难，容易导致 404 错误。
    - **行动**: 重命名文件并全局替换引用。

## ⚠️ P1: 核心风险 (Core Risks)
- [ ] **时间作弊 (Time Cheating)**
    - **问题**: 依赖 `Date.now()` 计算离线衰减，用户修改手机时间可刷“签到”或重置“饥饿”。
    - **建议**: 
        1. 简单防护：记录 `lastSaveTime`，如果 `current < lastSaveTime` 则判定为时间异常，不进行结算。
        2. 严格防护：请求服务器时间（需后端支持）。
- [ ] **数据丢失 (Data Loss)**
    - **问题**: 仅使用 `uni.setStorage`。
    - **风险**: 用户清理缓存或卸载重装后，所有养成进度（等级、亲密度）清零。
    - **建议**: 明确告知用户数据仅在本地，或规划云同步功能（PLAN 7.0）。

## 📝 P2: 待办任务 & 资产清单 (To-Do & Assets)
### 必需美术资产
- [ ] **Idle (正常)**: `puppy_idle.png` (呼吸)
- [ ] **Happy (开心)**: `puppy_happy.png` (抚摸/喂食反馈)
- [ ] **Hungry (饥饿)**: `puppy_hungry.png` (需包含肚子叫图标或委屈表情)
- [ ] **Starving (极饿)**: `puppy_starving.png` (趴下/灰度图)
- [ ] **Props (道具)**: `icon_food.png` (狗粮), `icon_poop.png` (便便)

### 逻辑完善
- [ ] **状态互斥**: 
    - 极饿状态下 (Hunger=0) 是否允许抚摸？建议：禁止抚摸，点击仅提示“它饿晕了，快喂食”。
- [ ] **防抖设计**: 
    - 喂食按钮需加防抖 (Debounce)，防止用户连点导致动画堆叠或资源扣除异常。

## 🧪 质量保证与可测试性 (QA & Testability)
> Added by Test Engineer Review

### 1. 调试工具 (DevTools)
*   **需求**: 为了验证 50小时 衰减逻辑，必须在开发环境 (`development`) 提供上帝模式。
*   **功能清单**:
    - [ ] **Time Machine**: 模拟“快进 1小时 / 1天”。
    - [ ] **State Editor**: 一键设置 饱食度=0 (Starving), 饱食度=100 (Full)。
    - [ ] **Asset Granter**: 一键获得 500g 狗粮 (验证上限逻辑)。

### 2. 边界交互文案 (Edge Case UX)
*   **收益递减提示**:
    - 第 4 次记录时 -> Toast: "今天奖励已领完，明天继续哦！" (不能静默失败)。
*   **仓储溢出提示**:
    - 狗粮 > 300g 时 -> Modal: "粮仓已满，快给小狗喂食吧！" (阻止领取)。
*   **极饿状态交互**:
    - 点击极饿小狗 -> Bubble: "饿得动不了了..." (替代常规动画)。

### 3. 关键测试用例 (Key Test Cases)
- [ ] **并发锁**: 快速点击“喂食” 10次，应只扣除 20g 并播放 1 次动画。
- [ ] **离线防刷**: 调整手机时间至未来 -> 再次打开 App -> 确保不结算异常衰减。
- [ ] **冷启动恢复**: 杀掉进程后重新打开，UI 应正确复原 Store 中的状态（如保持饥饿图，而不是先闪现正常图）。

## 💡 架构建议 (Architecture)
1. **Store 拆分**:
    - `usePetStore`: 负责属性计算（饱食度、亲密度）。
    - `useUserStore`: 负责资产管理（狗粮余额、记录次数）。
2. **Composable**:
    - 抽离 `useGameLoop`: 专门处理 `onShow` 时的离线时间结算逻辑。

## ✅ 已解决的风险 (Resolved Risks)
- [x] **恶性通胀 (Hyper-Inflation)**
    - **方案**: 在 `PLAN.md` 3.2 节引入了收益递减 (Diminishing Returns) 和 仓储上限 (Wallet Cap) 机制。
    - **效果**: 日盈余控制在 +17g (约0.3天口粮)，杜绝了刷分可能。
