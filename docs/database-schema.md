# 数据库表结构设计

## 版本：v1.0（一期）
## 更新日期：2026-03-01

---

## 1. users - 用户表

| 字段 | 类型 | 长度 | 必填 | 默认值 | 说明 |
|------|------|------|------|--------|------|
| id | BIGINT | 20 | YES | AUTO_INCREMENT | 用户 ID（主键） |
| openid | VARCHAR | 64 | YES | - | 微信 openid（唯一索引） |
| unionid | VARCHAR | 64 | NO | NULL | 微信 unionid（跨应用） |
| nickname | VARCHAR | 64 | NO | NULL | 昵称 |
| avatar_url | VARCHAR | 255 | NO | NULL | 头像 URL |
| email | VARCHAR | 128 | NO | NULL | 邮箱（用于提醒） |
| phone | VARCHAR | 20 | NO | NULL | 手机号 |
| created_at | DATETIME | - | YES | CURRENT_TIMESTAMP | 注册时间 |
| updated_at | DATETIME | - | YES | CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引：**
- PRIMARY KEY (id)
- UNIQUE KEY idx_openid (openid)
- KEY idx_unionid (unionid)

---

## 2. health_records - 健康记录表

| 字段 | 类型 | 长度 | 必填 | 默认值 | 说明 |
|------|------|------|------|--------|------|
| id | BIGINT | 20 | YES | AUTO_INCREMENT | 记录 ID（主键） |
| user_id | BIGINT | 20 | YES | - | 用户 ID（外键） |
| record_date | DATE | - | YES | - | 记录日期 |
| record_time | TIME | - | YES | - | 记录时间 |
| record_type | ENUM | - | YES | - | 'poop', 'no_poop' |
| shape | VARCHAR | 32 | NO | NULL | 形状：香蕉状/羊粪球/糊状/水状/硬条状 |
| color | VARCHAR | 32 | NO | NULL | 颜色：棕色/黄色/绿色/黑色/红色 |
| amount | VARCHAR | 16 | NO | NULL | 分量：少/适中/多 |
| symptoms | JSON | - | NO | NULL | 症状数组：["带血","粘液","未消化","恶臭","排便不尽","腹痛"] |
| feeling | VARCHAR | 32 | NO | NULL | 感受：迅速/顺畅/费力/困难/自定义 |
| duration | VARCHAR | 32 | NO | NULL | 时长（如 "5 分钟"） |
| note | TEXT | - | NO | NULL | 备注/观察 |
| created_at | DATETIME | - | YES | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (id)
- KEY idx_user_date (user_id, record_date)
- KEY idx_user_created (user_id, created_at)

---

## 3. daily_yields - 每日产出表（狗粮）

| 字段 | 类型 | 长度 | 必填 | 默认值 | 说明 |
|------|------|------|------|--------|------|
| id | BIGINT | 20 | YES | AUTO_INCREMENT | 记录 ID（主键） |
| user_id | BIGINT | 20 | YES | - | 用户 ID（外键） |
| yield_date | DATE | - | YES | - | 产出日期（唯一索引） |
| record_count | INT | 11 | YES | 0 | 今日记录次数 |
| total_food | INT | 11 | YES | 0 | 总产出狗粮（g） |
| claimed_food | INT | 11 | YES | 0 | 已领取狗粮（g） |
| pending_food | INT | 11 | YES | 0 | 待领取狗粮（g） |
| claimed_at | DATETIME | - | NO | NULL | 领取时间 |
| created_at | DATETIME | - | YES | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | - | YES | CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引：**
- PRIMARY KEY (id)
- UNIQUE KEY idx_user_date (user_id, yield_date)

---

## 4. pet_states - 宠物状态表

| 字段 | 类型 | 长度 | 必填 | 默认值 | 说明 |
|------|------|------|------|--------|------|
| id | BIGINT | 20 | YES | AUTO_INCREMENT | 记录 ID（主键） |
| user_id | BIGINT | 20 | YES | - | 用户 ID（外键/唯一） |
| hunger | INT | 11 | YES | 60 | 饱食度 (0-100) |
| exp | INT | 11 | YES | 0 | 经验值 |
| level | INT | 11 | YES | 1 | 等级 |
| status | ENUM | - | YES | 'normal' | 'normal', 'eating', 'sad' |
| last_feed_at | DATETIME | - | NO | NULL | 最后喂食时间 |
| created_at | DATETIME | - | YES | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | - | YES | CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引：**
- PRIMARY KEY (id)
- UNIQUE KEY idx_user_id (user_id)

---

## 5. user_settings - 用户设置表

| 字段 | 类型 | 长度 | 必填 | 默认值 | 说明 |
|------|------|------|------|--------|------|
| id | BIGINT | 20 | YES | AUTO_INCREMENT | 设置 ID（主键） |
| user_id | BIGINT | 20 | YES | - | 用户 ID（唯一索引） |
| email | VARCHAR | 128 | NO | NULL | 通知邮箱 |
| low_food_notify | TINYINT | 1 | YES | 1 | 低粮通知开关 (0/1) |
| low_food_threshold | INT | 11 | YES | 20 | 低粮阈值 (g) |
| last_notify_at | DATETIME | - | NO | NULL | 最后通知时间 |
| created_at | DATETIME | - | YES | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | - | YES | CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

**索引：**
- PRIMARY KEY (id)
- UNIQUE KEY idx_user_id (user_id)

---

## 6. notify_logs - 通知日志表

| 字段 | 类型 | 长度 | 必填 | 默认值 | 说明 |
|------|------|------|------|--------|------|
| id | BIGINT | 20 | YES | AUTO_INCREMENT | 日志 ID（主键） |
| user_id | BIGINT | 20 | YES | - | 用户 ID（外键） |
| notify_type | ENUM | - | YES | - | 'low_food', 'daily_reminder' |
| channel | ENUM | - | YES | - | 'email' |
| status | ENUM | - | YES | - | 'pending', 'sent', 'failed' |
| error_message | TEXT | - | NO | NULL | 失败原因 |
| sent_at | DATETIME | - | NO | NULL | 发送时间 |
| created_at | DATETIME | - | YES | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (id)
- KEY idx_user_id (user_id)
- KEY idx_status (status)
- KEY idx_type_created (notify_type, created_at)

---

## 二期预留表（暂不创建）

### family_members - 家庭成员表
> 二期功能，先预留设计

| 字段 | 类型 | 长度 | 必填 | 默认值 | 说明 |
|------|------|------|------|--------|------|
| id | BIGINT | 20 | YES | AUTO_INCREMENT | 成员 ID（主键） |
| user_id | BIGINT | 20 | YES | - | 用户 ID（外键） |
| name | VARCHAR | 32 | YES | - | 称呼（如：宝宝、爷爷） |
| gender | ENUM | - | YES | - | '男', '女' |
| birthday | DATE | - | YES | - | 出生年月 |
| created_at | DATETIME | - | YES | CURRENT_TIMESTAMP | 创建时间 |

---

## ER 关系图（一期）

```
┌─────────────┐       ┌──────────────────┐
│   users     │       │  health_records  │
├─────────────┤       ├──────────────────┤
│ id (PK)     │◄──────│ user_id (FK)     │
│ openid      │       │ id (PK)          │
│ email       │       │ record_date      │
│ created_at  │       │ record_time      │
│ updated_at  │       │ record_type      │
└─────────────┘       │ shape            │
         │            │ color            │
         │            │ amount           │
         │            │ symptoms (JSON)  │
         │            │ feeling          │
         │            │ duration         │
         │            │ note             │
         │            │ created_at       │
         │            └──────────────────┘
         │
         │            ┌───────────────┐
         │            │  daily_yields │
         ├───────────►│               │
         │            │ id (PK)       │
         │            │ user_id (FK)  │
         │            │ yield_date    │
         │            │ record_count  │
         │            │ total_food    │
         │            │ pending_food  │
         │            │ claimed_at    │
         │            └───────────────┘
         │
         │            ┌───────────────┐
         │            │  pet_states   │
         ├───────────►│               │
         │            │ id (PK)       │
         │            │ user_id (UK)  │
         │            │ hunger        │
         │            │ exp           │
         │            │ level         │
         │            │ status        │
         │            └───────────────┘
         │
         │            ┌───────────────────┐
         │            │  user_settings    │
         ├───────────►│                   │
         │            │ id (PK)           │
         │            │ user_id (UK)      │
         │            │ email             │
         │            │ low_food_notify   │
         │            │ low_food_threshold│
         │            └───────────────────┘
         │
         │            ┌───────────────────┐
         └───────────►│   notify_logs     │
                      │                   │
                      │ id (PK)           │
                      │ user_id (FK)      │
                      │ notify_type       │
                      │ channel           │
                      │ status            │
                      │ sent_at           │
                      └───────────────────┘
```
