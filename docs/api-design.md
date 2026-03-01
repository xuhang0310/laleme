# API 接口设计文档

## 版本：v1.0（一期）
## 更新日期：2026-03-01

---

## 基础信息

- **Base URL**: `/api`
- **认证方式**: JWT Token（通过微信登录获取）
- **响应格式**: JSON

### 通用响应结构

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 错误码定义

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录/Token 失效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 1. 认证模块 (Auth)

### 1.1 微信登录

**请求：**
```
POST /api/auth/login
Content-Type: application/json

{
  "code": "wx_login_code"
}
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "openid": "xxx",
      "nickname": "用户昵称",
      "avatar_url": "头像 URL"
    }
  }
}
```

---

## 2. 健康记录模块 (Records)

### 2.1 获取记录列表

**请求：**
```
GET /api/records?start_date=2024-01-01&end_date=2024-01-31&page=1&limit=20
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "record_date": "2024-01-15",
        "record_time": "08:30:00",
        "record_type": "poop",
        "shape": "香蕉状",
        "color": "棕色",
        "amount": "适中",
        "symptoms": [],
        "feeling": "顺畅",
        "duration": "5 分钟",
        "note": "",
        "created_at": "2024-01-15 08:30:00"
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 20
  }
}
```

### 2.2 创建记录

**请求：**
```
POST /api/records
Content-Type: application/json

{
  "record_date": "2024-01-15",
  "record_time": "08:30",
  "record_type": "poop",
  "shape": "香蕉状",
  "color": "棕色",
  "amount": "适中",
  "symptoms": [],
  "feeling": "顺畅",
  "duration": "5 分钟",
  "note": ""
}
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "yield": {
      "reward": 40,
      "message": "获得 40g 狗粮奖励"
    }
  }
}
```

### 2.3 获取单条记录

**请求：**
```
GET /api/records/:id
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "user_id": 1,
    "record_date": "2024-01-15",
    "record_time": "08:30:00",
    "record_type": "poop",
    "shape": "香蕉状",
    "color": "棕色",
    "amount": "适中",
    "symptoms": [],
    "feeling": "顺畅",
    "duration": "5 分钟",
    "note": "",
    "created_at": "2024-01-15 08:30:00"
  }
}
```

### 2.4 更新记录

**请求：**
```
PUT /api/records/:id
Content-Type: application/json

{
  "shape": "羊粪球",
  "color": "黄色",
  "symptoms": ["未消化"]
}
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 2.5 删除记录

**请求：**
```
DELETE /api/records/:id
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 2.6 获取周报

**请求：**
```
GET /api/records/weekly-report?week_start=2024-01-15
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "week_start": "2024-01-15",
    "week_end": "2024-01-21",
    "stats": {
      "total_count": 7,
      "success_rate": 85,
      "painless_rate": 90,
      "dominant_shape": "香蕉状",
      "symptom_count": 2
    },
    "daily_data": [
      { "day": "周一", "date": "2024-01-15", "total": 1, "poop": 1, "no_poop": 0 },
      { "day": "周二", "date": "2024-01-16", "total": 0, "poop": 0, "no_poop": 0 },
      { "day": "周三", "date": "2024-01-17", "total": 2, "poop": 2, "no_poop": 0 },
      { "day": "周四", "date": "2024-01-18", "total": 1, "poop": 1, "no_poop": 0 },
      { "day": "周五", "date": "2024-01-19", "total": 1, "poop": 0, "no_poop": 1 },
      { "day": "周六", "date": "2024-01-20", "total": 1, "poop": 1, "no_poop": 0 },
      { "day": "周日", "date": "2024-01-21", "total": 1, "poop": 1, "no_poop": 0 }
    ],
    "alert": {
      "has_danger": false,
      "message": ""
    },
    "pet_message": {
      "image": "puppy_happy.png",
      "text": "哇！主人的肠胃棒棒的！"
    }
  }
}
```

---

## 3. 每日产出模块 (Yields)

### 3.1 获取今日产出

**请求：**
```
GET /api/yields/today
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "yield_date": "2024-01-15",
    "record_count": 2,
    "total_food": 50,
    "claimed_food": 0,
    "pending_food": 50
  }
}
```

### 3.2 领取狗粮

**请求：**
```
POST /api/yields/claim
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "claimed_amount": 50,
    "total_food": 50,
    "wallet_balance": 250
  }
}
```

**错误响应 - 粮仓已满：**
```json
{
  "code": 400,
  "message": "粮仓已满，快去喂食消耗吧！",
  "data": {
    "current_balance": 300,
    "max_capacity": 300
  }
}
```

---

## 4. 宠物模块 (Pet)

### 4.1 获取宠物状态

**请求：**
```
GET /api/pet/state
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "hunger": 60,
    "exp": 150,
    "level": 3,
    "status": "normal",
    "last_feed_at": "2024-01-15 09:00:00",
    "updated_at": "2024-01-15 14:30:00"
  }
}
```

### 4.2 喂食宠物

**请求：**
```
POST /api/pet/feed
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "hunger_before": 60,
    "hunger_after": 70,
    "food_cost": 10,
    "wallet_before": 200,
    "wallet_after": 190
  }
}
```

**错误响应 - 饱食度已满：**
```json
{
  "code": 400,
  "message": "小狗已经很饱了，不用再喂啦！",
  "data": {
    "current_hunger": 100
  }
}
```

**错误响应 - 狗粮不足：**
```json
{
  "code": 400,
  "message": "粮仓空了，快去赚狗粮吧！",
  "data": {
    "current_food": 0,
    "cost": 10
  }
}
```

---

## 5. 用户设置模块 (Settings)

### 5.1 获取我的设置

**请求：**
```
GET /api/settings
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "email": "user@example.com",
    "low_food_notify": true,
    "low_food_threshold": 20
  }
}
```

### 5.2 更新设置

**请求：**
```
PUT /api/settings
Content-Type: application/json

{
  "email": "user@example.com",
  "low_food_notify": true,
  "low_food_threshold": 20
}
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 5.3 测试邮件

**请求：**
```
POST /api/settings/test-email
```

**响应：**
```json
{
  "code": 200,
  "message": "测试邮件已发送，请查收"
}
```

---

## 6. 通知模块 (Notify)

### 6.1 低粮提醒（定时任务触发）

> 此接口由后端定时任务自动触发，非手动调用

**触发条件：**
- 用户开启了 `low_food_notify`
- 用户狗粮余额 < `low_food_threshold`
- 距离上次通知超过 24 小时

**邮件模板：**
```
主题：【巴迪健康】你的狗粮快吃完啦！

主人，你好呀！

我是巴迪，你的专属健康小助手。

你的狗粮余额只剩下 {balance}g 了，
快来记录一下便便，赚取更多狗粮吧！

便便 = 狗粮，健康 = 快乐！

—— 巴迪 敬上
```

### 6.2 通知日志查询（管理后台用）

**请求：**
```
GET /admin/notify-logs?notify_type=low_food&page=1&limit=50
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "user_id": 1,
        "notify_type": "low_food",
        "channel": "email",
        "status": "sent",
        "sent_at": "2024-01-15 10:00:00"
      }
    ],
    "total": 100
  }
}
```

---

## 奖励规则

| 记录次序 | 奖励狗粮 |
|----------|----------|
| 每日第 1 笔 | 40g |
| 每日第 2 笔 | 10g |
| 每日第 3 笔 | 5g |
| 第 4 笔及以后 | 0g |

**限制：**
- 粮仓上限：300g
- 每日最多 3 次有奖励的记录

---

## 后端定时任务

### 任务 1：低粮提醒（每日检查）

**执行时间：** 每天 09:00

**逻辑：**
1. 查询所有开启 `low_food_notify` 的用户
2. 检查用户狗粮余额是否低于阈值
3. 检查距离上次通知是否超过 24 小时
4. 发送邮件通知
5. 记录通知日志

### 任务 2：宠物饱食度衰减

**执行时间：** 每小时

**逻辑：**
1. 查询所有宠物
2. 根据 `last_feed_at` 计算饱食度衰减（-2/小时）
3. 更新宠物状态（饥饿时设为 `sad`）

---

## 前端对接说明

1. **请求拦截器**: 添加 `Authorization: Bearer {token}` 头
2. **响应拦截器**: 统一处理 401 错误，跳转登录
3. **本地缓存**: 宠物状态、用户信息可短暂缓存提升体验
4. **错误提示**: 使用 `uni.showToast` 展示错误信息

---

## 二期功能（暂不开发）

### 家庭成员模块
- `GET /api/members` - 获取成员列表
- `POST /api/members` - 添加成员
- `PUT /api/members/:id` - 更新成员
- `DELETE /api/members/:id` - 删除成员

### 理发师预约模块
- `GET /api/barbers` - 获取理发师列表
- `GET /api/barbers/:id` - 获取理发师详情
- `POST /api/appointments` - 创建预约
- `GET /api/appointments` - 获取我的预约
