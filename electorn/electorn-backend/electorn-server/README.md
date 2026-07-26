# Electorn Backend API

> 基于 FastAPI + SQLAlchemy + SQLite 构建的 12306 抢票助手后端服务

## 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [API 接口](#api-接口)
- [数据模型](#数据模型)
- [认证机制](#认证机制)
- [工具模块](#工具模块)
- [部署指南](#部署指南)

---

## 技术栈

| 分类 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **语言** | Python | 3.10+ | 主开发语言 |
| **Web 框架** | FastAPI | 0.x | 异步高性能 Web 框架 |
| **ORM** | SQLAlchemy | 2.x | 数据库 ORM |
| **数据库** | SQLite | 3.x | 轻量级关系型数据库 |
| **缓存** | Redis | 6.0+ | 验证码、登录态缓存 |
| **认证** | python-jose (JWT) + passlib (bcrypt) | - | Token 与密码加密 |
| **校验** | Pydantic | 2.x | 请求/响应数据校验 |
| **迁移** | Alembic | 1.x | 数据库迁移工具 |
| **ASGI 服务器** | Uvicorn | 0.x | 异步 ASGI 服务器 |

---

## 项目结构

```
electorn-server/
├── app/
│   ├── api/                        # API 层
│   │   └── api_v1/
│   │       ├── endpoints/          # 路由处理器
│   │       │   ├── auth.py             # 认证接口
│   │       │   ├── users.py            # 用户接口
│   │       │   ├── tickets.py          # 车票接口
│   │       │   ├── orders.py           # 订单接口
│   │       │   ├── cities.py           # 城市管理
│   │       │   ├── stations.py         # 车站管理
│   │       │   ├── passengers.py       # 乘客管理
│   │       │   └── static.py           # 静态资源
│   │       └── router.py          # 路由聚合
│   ├── core/                       # 核心配置
│   │   ├── config.py               # Settings (Pydantic BaseSettings)
│   │   ├── database.py             # 数据库引擎与会话
│   │   └── logging_config.py        # 日志配置 (loguru)
│   ├── dto/                        # 数据传输对象
│   │   ├── city.py
│   │   ├── ticket_search_result.py
│   │   └── train_stations_result.py
│   ├── models/                     # ORM 模型 (SQLAlchemy)
│   │   ├── user.py
│   │   ├── orders.py
│   │   ├── city.py
│   │   ├── stations.py
│   │   └── passengers.py
│   ├── schemas/                    # Pydantic 数据校验模型
│   │   ├── response.py              # 统一响应格式
│   │   ├── user.py
│   │   ├── orders.py
│   │   ├── stations.py
│   │   └── passengers.py
│   └── utils/                      # 工具模块
│       ├── security.py              # JWT + Bcrypt
│       ├── redis.py                 # Redis 客户端封装
│       ├── logging.py               # 请求日志中间件
│       ├── exception.py             # 全局异常处理
│       └── static_loader.py         # 静态资源加载
├── conf/
│   └── logging.ini                 # 日志配置
├── data/
│   └── static/                     # 静态文件
│       ├── about.json
│       ├── privacy_policy.md
│       └── user_agreement.md
├── logs/                           # 日志目录（运行时生成）
├── main.py                         # 应用入口
├── requirements.txt                # Python 依赖
├── .env                            # 环境变量配置
├── run.sh                          # 启动脚本
├── my.sql                          # 数据库初始化 SQL
├── electorn.db                     # SQLite 数据库文件
├── test_data.py                    # 测试数据生成
├── test_redis.py                   # Redis 连接测试
└── test_stations_data.py           # 车站数据测试
```

---

## 快速开始

### 1. 环境要求

- **Python** >= 3.10
- **Redis** >= 6.0（用于缓存验证码和登录态）
- **操作系统**：macOS / Linux / Windows

### 2. 创建虚拟环境并安装依赖

```bash
# 进入项目目录
cd electorn-server

# 创建虚拟环境
python3 -m venv .venv

# 激活虚拟环境
# macOS / Linux:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt
```

### 3. 配置环境变量

编辑 `.env` 文件：

```bash
# 数据库连接（默认 SQLite，开箱即用）
DATABASE_URL=sqlite:///./electorn.db

# JWT 密钥（生产环境务必修改）
SECRET_KEY=your-secret-key-here-change-in-production

# 项目名称
PROJECT_NAME=Electorn Backend

# API 前缀
API_V1_STR=/api/v1

# JWT 过期时间（分钟）
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 加密算法
ALGORITHM=HS256

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=123456
```

### 4. 初始化数据库

首次运行时，`main.py` 会自动创建表结构并迁移缺失列。

如需手动初始化：

```bash
# 使用 my.sql 初始化（含示例数据）
sqlite3 electorn.db < my.sql
```

### 5. 启动服务

```bash
# 开发模式（带热重载）
uvicorn main:app --reload

# 或使用启动脚本
./run.sh

# 指定端口
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

启动成功后：

- API 根路径：`http://localhost:8000/api/v1`
- 接口文档：`http://localhost:8000/docs`（Swagger UI）
- OpenAPI JSON：`http://localhost:8000/api/v1/openapi.json`
- 健康检查：`http://localhost:8000/health`

### 6. 测试连接

```bash
# 健康检查
curl http://localhost:8000/health

# 用户登录
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@admin.com","password":"admin"}'
```

默认管理员账号：
- 邮箱：`admin@admin.com`
- 密码：`admin`（bcrypt 加密后存储）

---

## 配置说明

### Redis 键命名规范

| 键前缀 | 格式 | 用途 | 过期时间 |
|--------|------|------|----------|
| `login:` | `login:{user_id}:{username}` | 用户登录态 | 1 小时 |
| `code:` | `code:{username}` | 验证码缓存 | 5 分钟 |
| `session:` | `session:{session_id}` | 会话信息 | 24 小时 |

### 日志配置

日志通过 `loguru` 实现，配置文件位于 `conf/logging.ini`，日志文件输出到 `logs/` 目录：

- `app_*.log`：应用业务日志
- `console_*.log`：控制台输出日志

日志同时输出到：
- 控制台（INFO 级别）
- 文件（DEBUG 级别，按日期滚动）

---

## API 接口

### 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "total": 100,
  "page_num": 10,
  "cur_page": 1
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 状态码，200 表示成功，4xx/5xx 表示错误 |
| message | string | 提示信息 |
| data | object | 业务数据 |
| total | int | 总条数（分页时返回） |
| page_num | int | 总页数（分页时返回） |
| cur_page | int | 当前页（分页时返回） |

### 错误响应格式

```json
{
  "detail": "Email already registered"
}
```

> FastAPI 原生 HTTPException 错误格式

---

### 认证模块 `/api/v1/auth`

#### 1. 用户注册

- **URL**：`POST /api/v1/auth/register`
- **Content-Type**：`application/json`

**请求体**：
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**成功响应**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@admin.com",
    "is_active": true
  }
}
```

#### 2. 用户登录

- **URL**：`POST /api/v1/auth/login`
- **Content-Type**：`application/json` 或 `application/x-www-form-urlencoded`

**JSON 请求体**：
```json
{
  "username": "admin@admin.com",
  "password": "admin"
}
```

**表单请求体**：
```
username=admin@admin.com&password=admin&grant_type=password&client_id=web
```

**成功响应**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "user_id": 1,
      "username": "admin",
      "email": "admin@admin.com"
    }
  }
}
```

#### 3. 获取验证码

- **URL**：`POST /api/v1/auth/code`

**请求体**：
```json
{
  "username": "admin@admin.com"
}
```

#### 4. 用户登出

- **URL**：`POST /api/v1/auth/logout`
- **需要认证**：是

**成功响应**：
```json
{
  "code": 200,
  "message": "Logout successful",
  "data": {
    "user_id": 1,
    "username": "admin",
    "email": "admin@admin.com",
    "logout_time": "2025-07-26T10:00:00Z"
  }
}
```

---

### 用户模块 `/api/v1/users`

#### 5. 获取当前用户信息

- **URL**：`GET /api/v1/users/me`
- **需要认证**：是

---

### 车票模块 `/api/v1/tickets`

#### 6. 查询车次列表

- **URL**：`GET /api/v1/tickets/query`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| from_station | string | 是 | 出发站 |
| to_station | string | 是 | 到达站 |
| date | datetime | 是 | 出发日期 |

**成功响应**：
```json
{
  "code": 200,
  "data": [
    {
      "train_num": "G1",
      "station_from": "北京南",
      "station_to": "上海虹桥",
      "begin_time": "2025-07-26T07:00:00",
      "end_time": "2025-07-26T11:28:00",
      "seatInfo": {
        "business": 100, "first": 20, "second": 10,
        "lying": 5, "soft_lying": 1, "hard_lying": 0,
        "soft_seat": 100, "hard_seat": 50, "no_seat": 20
      },
      "priceInfo": [
        { "seat_type": "business", "price": 100, "is_available": true }
      ],
      "isStart": true,
      "isEnd": true
    }
  ]
}
```

#### 7. 查询车站信息

- **URL**：`GET /api/v1/tickets/station`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| train_num | string | 是 | 车次号 |
| date | datetime | 否 | 出发日期 |

#### 8. 查询车次价格

- **URL**：`GET /api/v1/tickets/{train_num}/prices`

**成功响应**：
```json
{
  "code": 200,
  "data": {
    "train_num": "G1",
    "business": 100, "special": 50, "first": 20,
    "second": 10, "lying": 5, "super_soft_lying": 2,
    "soft_lying": 1, "hard_lying": 0,
    "soft_seat": 100, "hard_seat": 50, "no_seat": 20
  }
}
```

#### 9. 查询车次详情

- **URL**：`GET /api/v1/tickets/{train_num}/detail`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| date | string | 否 | 出发日期（YYYY_MM_DD 格式） |

**成功响应**：
```json
{
  "code": 200,
  "data": {
    "train_num": "G1",
    "train_date": "2025-07-26",
    "train_from": "北京南",
    "train_to": "上海虹桥",
    "train_start_time": "2025-07-26 08:00:00",
    "train_end_time": "2025-07-26 12:30:00",
    "ticket": [
      { "seatType": "business", "price": 1888, "left": 5 },
      { "seatType": "first", "price": 944, "left": 15 },
      { "seatType": "second", "price": 576, "left": 120 }
    ]
  }
}
```

---

### 订单模块 `/api/v1/orders`

#### 10. 创建订单

- **URL**：`POST /api/v1/orders`
- **Content-Type**：`application/json`

**请求体**：
```json
{
  "train_num": "G1",
  "train_date": "2025-07-26",
  "train_start_time": "07:00",
  "train_end_time": "11:28",
  "from_station": "北京南",
  "to_station": "上海虹桥",
  "seat_type": "二等座",
  "passenger_name": "张三",
  "passenger_id_card": "110101199001011234",
  "passenger_count": 2,
  "price": 576,
  "payment_method": "wechat"
}
```

**成功响应**：
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "order_no": "ORD20250726100000ABCDEF123456",
    "train_num": "G1",
    "train_date": "2025-07-26",
    "from_station": "北京南",
    "to_station": "上海虹桥",
    "seat_type": "二等座",
    "passenger_name": "张三",
    "passenger_id_card": "110101199001011234",
    "passenger_count": 2,
    "price": 576,
    "status": "pending",
    "payment_method": "wechat",
    "paid_at": null,
    "created_at": "2025-07-26T10:00:00"
  }
}
```

#### 11. 查询订单列表

- **URL**：`GET /api/v1/orders`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| per_page | int | 否 | 每页数量，默认 10 |
| page | int | 否 | 页码，默认 1 |

**成功响应**：
```json
{
  "code": 200,
  "message": "success",
  "total": 28,
  "page_num": 3,
  "cur_page": 1,
  "data": {
    "data": [ ... ],
    "total": 28
  }
}
```

#### 12. 查询订单详情

- **URL**：`GET /api/v1/orders/{order_id}`

#### 13. 支付订单

- **URL**：`PUT /api/v1/orders/{order_id}/pay`

**请求体**：
```json
{
  "payment_method": "wechat"
}
```

| payment_method 可选值 | 说明 |
|----------------------|------|
| wechat | 微信支付 |
| alipay | 支付宝 |
| unionpay | 银联 |
| balance | 余额支付 |

#### 14. 取消订单

- **URL**：`PUT /api/v1/orders/{order_id}/cancel`

> 允许取消的状态：`pending`（待支付）、`paid`（已支付）

#### 15. 删除订单

- **URL**：`DELETE /api/v1/orders/{order_id}`

---

### 城市管理 `/api/v1/cities`

#### 16. 获取城市列表

- **URL**：`GET /api/v1/cities`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| per_page | int | 否 | 每页数量 |
| page | int | 否 | 页码 |

#### 17. 新增城市

- **URL**：`POST /api/v1/cities`

```json
{
  "name": " string",
  "code": "BJ",
  "province": "北京市",
  "level": "直辖市",
  "population": "2189万",
  "area": "16410平方公里",
  "zip_code": "100000",
  "description": "中华人民共和国首都"
}
```

#### 18. 更新城市

- **URL**：`PUT /api/v1/cities/{id}`

#### 19. 删除城市

- **URL**：`DELETE /api/v1/cities/{id}`

#### 20. 搜索城市

- **URL**：`GET /api/v1/cities/search`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词 |

---

### 车站管理 `/api/v1/stations`

#### 21. 获取车站列表

- **URL**：`GET /api/v1/stations`

#### 22. 新增/更新车站

- **URL**：`POST /api/v1/stations`（新增）
- **URL**：`PUT /api/v1/stations/{id}`（更新）

```json
{
  "name": "北京南",
  "code": "VNP",
  "city_id": 1,
  "level": 1,
  "open_date": "2008-06-30",
  "address": "北京市丰台区永外大街车站路12号",
  "keyword": "北京南"
}
```

#### 23. 删除车站

- **URL**：`DELETE /api/v1/stations/{id}`

---

### 乘客管理 `/api/v1/passengers`

#### 24. 获取乘客列表

- **URL**：`GET /api/v1/passengers`
- **需要认证**：是

#### 25. 新增乘客

- **URL**：`POST /api/v1/passengers`

```json
{
  "name": "张三",
  "id_card": "110101199001011234",
  "id_card_type": "身份证",
  "type": "成人",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "remark": ""
}
```

#### 26. 更新乘客

- **URL**：`PUT /api/v1/passengers/{id}`

#### 27. 删除乘客

- **URL**：`DELETE /api/v1/passengers/{id}`

---

## 数据模型

### 表关系

```
users ──1:N──> passengers
  │
  │ (city_id)
  ▼
cities ──1:N──> stations

orders (独立表，不直接关联用户)
```

### users 用户表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 主键自增 |
| username | String(unique) | 用户名 |
| email | String(unique) | 邮箱 |
| hashed_password | String | bcrypt 加密密码 |
| is_active | Boolean | 是否激活 |
| is_superuser | Boolean | 是否超级管理员 |

### cities 城市表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 主键自增 |
| name | String(100) | 城市名称 |
| code | String(20, unique) | 城市代码 |
| province | String(100) | 所属省份 |
| level | String(50) | 城市等级 |
| population | String(50) | 人口 |
| area | String(50) | 面积 |
| zip_code | String(20) | 邮政编码 |
| description | Text | 描述 |
| is_active | Boolean | 是否激活 |
| created_at / updated_at | DateTime | 时间戳 |

### stations 车站表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 主键自增 |
| name | String(100) | 车站名称 |
| code | String(20, unique) | 车站代码 |
| city_id | Integer(FK→cities.id) | 所属城市 |
| address | String(255) | 详细地址 |
| level | Integer | 车站等级 |
| open_date | DateTime | 启用日期 |
| keyword | String(255) | 搜索关键词 |
| is_active | Boolean | 是否激活 |
| created_at / updated_at | DateTime | 时间戳 |

### passengers 乘客表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 主键自增 |
| user_id | Integer(FK→users.id) | 所属用户 |
| name | String(64) | 乘客姓名 |
| id_card | String(32) | 身份证号 |
| id_card_type | Integer | 证件类型 |
| type | Integer | 乘客类型 |
| phone | String(20) | 手机号 |
| email | String(128) | 邮箱 |
| status | String(32) | 状态 |
| created_at / updated_at | String | 时间戳 |

### orders 订单表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 主键自增 |
| order_no | String(64, unique) | 订单号 |
| train_num | String(32) | 车次号 |
| train_date | String(32) | 出发日期 |
| train_start_time | String(32) | 出发时间 |
| train_end_time | String(32) | 到达时间 |
| from_station | String(64) | 出发站 |
| to_station | String(64) | 到达站 |
| seat_type | String(32) | 座位类型 |
| passenger_name | String(64) | 乘客姓名 |
| passenger_id_card | String(32) | 身份证号 |
| passenger_count | Integer | 乘客数量 |
| price | Float | 订单价格 |
| status | Enum | 订单状态 |
| payment_method | String(32) | 支付方式 |
| paid_at | DateTime | 支付时间 |
| created_at / updated_at | DateTime | 时间戳 |

**订单状态流转**：

```
pending ──pay──> paid
   │
   ├──cancel──> cancelled
   └──expire──> cancelled (超时自动)
```

---

## 认证机制

### 登录流程

```
1. 客户端发送 POST /api/v1/auth/login
   - Content-Type: application/json
   - Body: {"username": "admin@admin.com", "password": "admin"}

2. 服务端验证
   - 查找用户（通过邮箱或用户名）
   - 使用 bcrypt 验证密码
   - 生成 JWT Access Token
   - 将登录信息存入 Redis

3. 返回 Token
   {
     "access_token": "eyJ...",
     "token_type": "bearer",
     "user": { "user_id": 1, "username": "admin", "email": "..." }
   }

4. 后续请求携带 Token
   Authorization: Bearer eyJ...
```

### Token 策略

| 属性 | 值 |
|------|------|
| 类型 | JWT (HS256) |
| 有效期 | 30 分钟 |
| 载荷 | `{"sub": "user_id"}` |
| 存储 | 前端 localStorage + Redis 缓存 |
| 过期自动处理 | 前端拦截器检测 401，跳转登录页 |

### 密码加密

- 算法：**bcrypt**（passlib 库）
- 最大密码长度：72 字节（bcrypt 限制）
- 存储格式：`$2b$12$...`（bcrypt hash）

### FastAPI OAuth2

使用 FastAPI 内置的 `OAuth2PasswordBearer` 机制：

```python
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)

# 在需要认证的接口中
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> UserModel:
    # 解码 Token，查询用户
    ...
```

---

## 工具模块

### Security (`app/utils/security.py`)

| 函数 | 说明 |
|------|------|
| `verify_password(plain, hashed)` | 验证密码 |
| `get_password_hash(password)` | 加密密码 |
| `create_access_token(data, expires_delta)` | 创建 JWT |
| `decode_access_token(token)` | 解码 JWT |

### Redis Client (`app/utils/redis.py`)

| 方法 | 说明 |
|------|------|
| `get(key)` | 获取值 |
| `set(key, value, expire)` | 设置值（可选过期时间） |
| `delete(key)` | 删除键 |
| `exists(key)` | 检查键是否存在 |

### 中间件

- **日志中间件** (`log_request`)：记录每个 HTTP 请求的方法、路径、状态码、耗时
- **异常中间件** (`ExceptionMiddleware`)：捕获未处理异常，返回统一错误响应

---

## 部署指南

### 开发环境

```bash
# 1. 启动 Redis
redis-server

# 2. 启动后端
cd electorn-server
source .venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 生产环境

```bash
# 使用 Gunicorn + Uvicorn Workers
pip install gunicorn

# 启动（4 worker 进程）
gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile logs/access.log \
  --error-logfile logs/error.log
```

### Systemd 服务配置（Linux）

创建 `/etc/systemd/system/electorn-backend.service`：

```ini
[Unit]
Description=Electorn Backend API
After=network.target redis.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/opt/electorn-server
ExecStart=/opt/electorn-server/.venv/bin/gunicorn main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl start electorn-backend
sudo systemctl enable electorn-backend
```

### Nginx 反向代理

```nginx
server {
    listen 80;
    server_name api.example.com;

    # WebSocket 支持（如需）
    location /ws/ {
        proxy_pass http://127.0.0.1:8000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 请求超时
        proxy_read_timeout 30s;
        proxy_connect_timeout 5s;
    }

    # 静态文件
    location /static/ {
        alias /opt/electorn-server/data/static/;
    }
}
```

### Docker 部署（可选）

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "main:app", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000"]
```

---

## 数据字典

### 座位类型

| 代码 | 说明 |
|------|------|
| business | 商务座 |
| special | 特等座 |
| first | 一等座 |
| second | 二等座 |
| lying | 卧铺 |
| super_soft_lying | 高级软卧 |
| soft_lying | 软卧 |
| hard_lying | 硬卧 |
| soft_seat | 软座 |
| hard_seat | 硬座 |
| no_seat | 无座 |

### 订单状态

| 值 | 说明 |
|----|------|
| pending | 待支付 |
| paid | 已支付 |
| cancelled | 已取消 |
| completed | 已完成 |
| refunded | 已退款 |

### 支付方式

| 值 | 说明 |
|----|------|
| wechat | 微信支付 |
| alipay | 支付宝 |
| unionpay | 银联 |
| balance | 余额支付 |

---

## 许可

© 2025 Electorn Backend. All rights reserved.