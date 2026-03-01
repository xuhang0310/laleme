# 后台服务引入计划

## 一、项目现状分析

### 当前架构
- **前端框架**: uni-app (Vue 3 + Vite)
- **目标平台**: 微信小程序 (主)、H5 (次)
- **状态管理**: Pinia + pinia-plugin-unistorage (localStorage 持久化)
- **数据存储**: 完全本地化 (uni.getStorageSync/setStorageSync)

### 当前数据实体
1. **用户数据** (`user.js` store)
   - `food`: 狗粮余额
   - `pendingFood`: 待领取狗粮
   - `dailyRecordCount`: 今日记录次数
   - `lastRecordDate`: 上次记录日期

2. **宠物数据** (`pet.js` store)
   - `hunger`: 饱食度
   - `exp`: 经验值
   - `level`: 等级
   - `status`: 状态
   - `lastHungerUpdateTime`: 上次饥饿度更新时间

3. **排便记录** (直接存储在 localStorage)
   - `poop_records`: 记录数组

### 现有业务逻辑
- 每日健康记录 (排便记录)
- 狗粮奖励系统 (每日递减：40g → 10g → 5g)
- 宠物养成 (饱食度衰减、等级系统)
- 家人管理 (有添加家人页面)

---

## 二、后端技术选型建议

### 方案 A：云开发 (推荐 - 适合小程序)
**腾讯云开发 (TCB) / 阿里云云开发**

优势:
- 与微信小程序深度集成
- 免运维、自动扩缩容
- 提供现成的数据库、存储、云函数
- 支持免鉴权配置 (小程序天然鉴权)
- 成本低 (初期免费额度足够)

架构:
```
小程序 → 云函数 (业务逻辑) → 云数据库 (MongoDB 兼容)
         ↓
      云存储 (图片/文件)
```

### 方案 B：传统后端 + 数据库
**Node.js + Express/Koa + MySQL/MongoDB**

优势:
- 更灵活的控制
- 可迁移性强
- 技术栈成熟

架构:
```
小程序 → HTTPS API → Node.js Server → MySQL/MongoDB
```

### 方案 C：BaaS 服务 (折中方案)
**LeanCloud / 即构 / Supabase**

优势:
- 快速搭建
- 提供 SDK
- 按需付费

---

## 三、推荐方案：腾讯云开发

基于以下原因:
1. **小程序原生支持** - 微信官方出品，集成度高
2. **零运维** - 无需搭建服务器
3. **成本低** - 免费版足够早期使用
4. **开发快** - 云函数直接写业务逻辑

---

## 四、数据库设计

### 4.1 用户集合 (users)
```json
{
  "_id": "user_openid_xxx",
  "openid": "微信 openid",
  "unionId": "微信 unionId (可选)",
  "avatarUrl": "头像 URL",
  "nickname": "昵称",
  "createdAt": "ISODate",
  "lastLoginAt": "ISODate",

  // 资源数据
  "food": 100,
  "pendingFood": 20,

  // 每日统计
  "dailyRecordCount": 0,
  "lastRecordDate": "2026-03-01",

  // 家人关系
  "familyMembers": [
    {
      "_id": "member_xxx",
      "name": "爸爸",
      "relation": "father",
      "createdAt": "ISODate"
    }
  ]
}
```

### 4.2 宠物集合 (pets)
```json
{
  "_id": "pet_xxx",
  "userId": "user_openid_xxx",
  "name": "巴迪",
  "type": "dog",
  "image": "/static/puppy_hugry.png",

  // 状态数据
  "hunger": 60,
  "exp": 150,
  "level": 3,
  "status": "normal",
  "lastHungerUpdateTime": "ISODate",

  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### 4.3 健康记录集合 (health_records)
```json
{
  "_id": "record_xxx",
  "userId": "user_openid_xxx",
  "memberId": "member_xxx (可选，默认为本人)",

  // 记录内容
  "type": "poop",           // poop | no_poop
  "shape": "香蕉状",
  "color": "棕色",
  "amount": "适中",
  "feeling": "顺畅",
  "duration": "5 分钟",
  "symptoms": ["粘液"],
  "note": "备注",

  // 时间
  "recordDate": "2026-03-01",
  "recordTime": "10:30",
  "timestamp": 1740876600000,

  // 奖励
  "rewardFood": 40,
  "isClaimed": false,

  "createdAt": "ISODate"
}
```

### 4.4 领取记录集合 (claim_records)
```json
{
  "_id": "claim_xxx",
  "userId": "user_openid_xxx",
  "amount": 55,
  "fromPendingFood": 55,
  "timestamp": "ISODate"
}
```

---

## 五、云函数/API 设计

### 5.1 用户相关
| 函数名 | 功能 | 输入 | 输出 |
|--------|------|------|------|
| `login` | 用户登录/注册 | - | userInfo |
| `getUserInfo` | 获取用户数据 | - | userData |
| `updateUserProfile` | 更新用户资料 | {nickname, avatar} | success |

### 5.2 宠物相关
| 函数名 | 功能 | 输入 | 输出 |
|--------|------|------|------|
| `getPet` | 获取宠物信息 | - | petData |
| `feedPet` | 喂食 | {foodAmount} | {success, newHunger} |
| `updatePetStatus` | 更新状态 | {status} | success |
| `syncPetData` | 同步数据 (定时) | - | {hunger, exp} |

### 5.3 健康记录相关
| 函数名 | 功能 | 输入 | 输出 |
|--------|------|------|------|
| `addRecord` | 添加记录 | recordData | {success, reward} |
| `getRecords` | 获取记录列表 | {date, limit} | records[] |
| `getReport` | 获取统计报告 | {startDate, endDate} | reportData |
| `deleteRecord` | 删除记录 | {recordId} | success |

### 5.4 狗粮相关
| 函数名 | 功能 | 输入 | 输出 |
|--------|------|------|------|
| `claimFood` | 领取狗粮 | - | {amount, newBalance} |
| `getFoodBalance` | 获取余额 | - | {food, pendingFood} |

---

## 六、前端改造点

### 6.1 新增服务层
创建 `src/services/api.js`:
```javascript
// API 请求封装
const API_BASE = '' // 云开发环境 ID

export async function cloudCall(functionName, data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: functionName,
      data,
      success: res => resolve(res.result),
      fail: reject
    })
  })
}

// 用户 API
export const userAPI = {
  login: () => cloudCall('login'),
  getUserInfo: () => cloudCall('getUserInfo'),
  // ...
}

// 宠物 API
export const petAPI = {
  getPet: () => cloudCall('getPet'),
  feedPet: (data) => cloudCall('feedPet', data),
  // ...
}

// 记录 API
export const recordAPI = {
  addRecord: (data) => cloudCall('addRecord', data),
  getRecords: (data) => cloudCall('getRecords', data),
  // ...
}
```

### 6.2 改造 Store - 增加云端同步
改造 `src/stores/user.js`:
```javascript
export const useUserStore = defineStore('user', {
  state: () => ({
    food: 0,
    pendingFood: 0,
    // ...
    _syncedAt: null  // 新增同步时间戳
  }),
  actions: {
    // 从云端加载
    async syncFromCloud() {
      const res = await userAPI.getUserInfo()
      this.$patch(res.data)
      this._syncedAt = Date.now()
    },

    // 同步到云端
    async syncToCloud() {
      await userAPI.updateUserInfo({
        food: this.food,
        pendingFood: this.pendingFood,
        // ...
      })
    },

    // 领取时先本地后云端
    async claimFood() {
      const res = await userAPI.claimFood()
      if (res.success) {
        this.food = res.newBalance
        this.pendingFood -= res.amount
      }
      return res
    },

    // ... 其他方法改为异步
  }
})
```

### 6.3 改造数据持久化策略
```javascript
// 策略：本地缓存 + 云端备份 + 增量同步

// 1. 应用启动时
onLaunch(async () => {
  await checkAndUpdateUserData()  // 比对本地和云端，合并数据
})

// 2. 关键操作后
async function saveRecord() {
  // 先本地保存 (保证响应速度)
  localSave(record)

  // 异步同步到云端
  syncToCloud(record).catch(err => {
    // 加入待同步队列，稍后重试
    addToSyncQueue(record)
  })
}
```

### 6.4 改造记录保存逻辑
原 `pages/poop/add.vue` 中的 `saveRecord`:
```javascript
const saveRecord = async () => {
  const record = { ... }

  // 计算奖励
  userStore.checkDailyReset()
  const currentCount = userStore.dailyRecordCount
  let reward = 0
  if (currentCount === 0) reward = 40
  else if (currentCount === 1) reward = 10
  else if (currentCount === 2) reward = 5

  // 调用云端 API
  const res = await recordAPI.addRecord({
    ...record,
    rewardFood: reward
  })

  if (res.success) {
    // 更新本地 store
    userStore.addPendingFood(reward)

    // 本地记录备份
    const records = uni.getStorageSync('poop_records') || []
    records.push({ ...record, _id: res.recordId })
    uni.setStorageSync('poop_records', records)

    uni.showToast({
      title: reward > 0 ? `已产出 ${reward}g 狗粮` : '已记录',
      icon: 'success'
    })

    setTimeout(() => {
      uni.reLaunch({ url: '/pages/index/index' })
    }, 1500)
  } else {
    uni.showToast({
      title: res.msg || '保存失败',
      icon: 'none'
    })
  }
}
```

---

## 七、实施步骤

### 阶段一：环境搭建 (1-2 天)
1. 注册并开通腾讯云开发
2. 创建云开发环境
3. 配置小程序云开发权限
4. 创建数据库集合 (users, pets, health_records)
5. 配置数据库索引

### 阶段二：云函数开发 (3-4 天)
1. 搭建云函数开发环境
2. 实现用户登录函数 (`login`)
3. 实现宠物 CRUD 函数
4. 实现健康记录 CRUD 函数
5. 实现狗粮奖励函数
6. 编写云函数单元测试

### 阶段三：前端改造 (3-4 天)
1. 集成云开发 SDK
2. 创建 API 服务层 (`src/services/api.js`)
3. 改造 Stores 支持云端同步
4. 修改记录保存逻辑
5. 添加离线队列支持
6. 添加加载状态和错误处理

### 阶段四：数据迁移 (1 天)
1. 编写数据迁移脚本
2. 将现有用户数据迁移到云端
3. 验证数据完整性

### 阶段五：测试与优化 (2-3 天)
1. 功能测试 (所有 API)
2. 边界测试 (弱网、离线)
3. 性能测试 (大数据量)
4. 安全测试 (权限验证)
5. Bug 修复

### 阶段六：灰度发布 (1 天)
1. 小范围灰度 (10% 用户)
2. 监控日志和错误
3. 全量发布

---

## 八、成本预估

### 腾讯云开发 (按量计费)
| 资源 | 免费额度 | 超出价格 | 预估月成本 |
|------|----------|----------|------------|
| 云函数 | 500 万次调用/月 | ¥0.0112/万次 | ¥0 (早期) |
| 云数据库 | 2GB 存储 + 4GB 流量 | ¥0.02/GB/月 | ¥0-10 |
| 云存储 | 5GB 存储 | ¥0.043/GB/月 | ¥0-5 |
| CD | 10GB/月 | ¥0.8/GB | ¥0-20 |

**早期预估**: ¥0-50/月 (1000 日活以下)
**成长期预估**: ¥100-300/月 (1 万日活)

---

## 九、风险与应对

| 风险 | 应对措施 |
|------|----------|
| 云函数超时 | 设置合理超时，复杂任务拆分 |
| 数据库读写慢 | 添加索引，使用缓存 |
| 离线场景 | 本地队列 + 自动重试 |
| 数据冲突 | 时间戳 + 版本控制 |
| 成本超支 | 设置告警，定期 review |

---

## 十、下一步行动

1. **决策技术栈** - 确认使用腾讯云开发
2. **开通环境** - 注册并创建云开发环境
3. **创建云函数** - 从 `login` 和 `addRecord` 开始
4. **前端接入** - 在 `add.vue` 中接入云端保存
5. **验证流程** - 完成一次完整的记录 - 奖励 - 领取流程

---

## 附录：云函数示例

### `login/index.js`
```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext

  const db = cloud.database()
  const _ = db.command

  let user = await db.collection('users').doc(OPENID).get()

  if (!user.data) {
    // 新用户
    await db.collection('users').add({
      data: {
        _id: OPENID,
        openid: OPENID,
        food: 0,
        pendingFood: 0,
        dailyRecordCount: 0,
        lastRecordDate: new Date().toLocaleDateString(),
        createdAt: db.serverDate()
      }
    })
    return { success: true, isNewUser: true }
  }

  // 更新最后登录时间
  await db.collection('users').doc(OPENID).update({
    data: { lastLoginAt: db.serverDate() }
  })

  return {
    success: true,
    isNewUser: false,
    data: user.data
  }
}
```

### `addRecord/index.js`
```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext
  const { record, rewardFood } = event

  const db = cloud.database()
  const _ = db.command

  try {
    // 事务操作
    const transaction = await db.startTransaction()

    // 1. 添加记录
    const recordData = {
      ...record,
      userId: OPENID,
      rewardFood,
      isClaimed: false,
      createdAt: db.serverDate()
    }
    await transaction.collection('health_records').add({ data: recordData })

    // 2. 更新用户数据
    const today = new Date().toLocaleDateString()
    const user = await transaction.collection('users').doc(OPENID).get()

    // 检查是否需要重置
    if (user.data.lastRecordDate !== today) {
      user.data.dailyRecordCount = 0
      user.data.pendingFood = 0
      user.data.lastRecordDate = today
    }

    // 更新计数和待领取
    await transaction.collection('users').doc(OPENID).update({
      data: {
        dailyRecordCount: _.inc(1),
        pendingFood: _.inc(rewardFood),
        lastRecordDate: today
      }
    })

    await transaction.commit()

    return {
      success: true,
      msg: '记录成功',
      reward: rewardFood,
      newPendingFood: user.data.pendingFood + rewardFood
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      msg: '保存失败，请重试'
    }
  }
}
```
