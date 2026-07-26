# 12306 抢票助手 - 后端 API 文档

> 版本：v1.0.0  
> 基础路径：`http://localhost:8088/api/v1`  
> 响应格式：统一使用 `{ code, message, data }` 结构

---

## 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [认证机制](#认证机制)
- [API 接口](#api-接口)
  - [认证模块](#认证模块)
  - [用户模块](#用户模块)
  - [车票模块](#车票模块)
  - [订单模块](#订单模块)
  - [支付模块](#支付模块)
  - [城市管理](#城市管理)
  - [车站管理](#车站管理)
  - [乘客管理](#乘客管理)
  - [聊天模块](#聊天模块)
- [数据库设计](#数据库设计)
- [数据字典](#数据字典)
- [错误码](#错误码)

---

## 技术栈

| 分类 | 技术 | 说明 |
|------|------|------|
| **语言** | Java 21+ | 主开发语言 |
| **框架** | Spring Boot 3.x | Web 框架 |
| **ORM** | Spring Data JPA / MyBatis-Plus | 数据持久层 |
| **数据库** | MySQL 8.0+ | 关系型数据库 |
| **缓存** | Redis | 验证码、Token 缓存 |
| **安全** | Spring Security + JWT | 认证授权 |
| **API 文档** | SpringDoc OpenAPI (Swagger) | 在线文档 |
| **构建** | Gradle / Maven | 项目构建 |

---

## 项目结构

```
backend/
├── src/main/java/com/app/
│   ├── config/                 # 配置类
│   │   ├── SecurityConfig.java      # 安全配置
│   │   ├── CorsConfig.java          # 跨域配置
│   │   └── WebMvcConfig.java        # MVC 配置
│   ├── controller/             # 控制层（REST API）
│   │   ├── AuthController.java      # 认证接口
│   │   ├── UserController.java      # 用户接口
│   │   ├── TicketController.java    # 车票接口
│   │   ├── OrderController.java     # 订单接口
│   │   ├── PaymentController.java   # 支付接口
│   │   ├── CityController.java      # 城市管理
│   │   ├── StationController.java   # 车站管理
│   │   ├── PassengerController.java # 乘客管理
│   │   └── ChatController.java      # 聊天接口
│   ├── service/                # 业务逻辑层
│   │   ├── AuthService.java
│   │   ├── TicketService.java
│   │   ├── OrderService.java
│   │   └── ...
│   ├── repository/             # 数据访问层
│   │   ├── UserRepository.java
│   │   ├── OrderRepository.java
│   │   └── ...
│   ├── entity/                 # 数据库实体
│   │   ├── User.java
│   │   ├── Order.java
│   │   ├── City.java
│   │   └── ...
│   ├── dto/                    # 数据传输对象
│   │   ├── request/                 # 请求 DTO
│   │   └── response/                # 响应 DTO
│   ├── security/               # 安全相关
│   │   ├── JwtTokenProvider.java
│   │   └── JwtAuthenticationFilter.java
│   ├── exception/              # 异常处理
│   │   └── GlobalExceptionHandler.java
│   └── Application.java       # 启动类
├── src/main/resources/
│   ├── application.yml             # 应用配置
│   ├── application-dev.yml         # 开发环境配置
│   └── schema.sql                  # 初始化 DDL
└── build.gradle / pom.xml
```

---

## 快速开始

### 环境要求

- **JDK** >= 21
- **MySQL** >= 8.0
- **Redis** >= 6.0
- **Maven/Gradle** 构建工具

### 数据库初始化

```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE IF NOT EXISTS ticket_assistant
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

# 执行建表脚本
mysql -u root -p ticket_assistant < database/schema.sql
```

### 配置文件

`application-dev.yml`：

```yaml
server:
  port: 8088
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ticket_assistant?useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
  redis:
    host: localhost
    port: 6379
    password:
    database: 0

jwt:
  secret: your-jwt-secret-key-at-least-32-characters
  expiration: 7200000    # 2小时（毫秒）
  refresh-expiration: 604800000  # 7天
```

### 启动服务

```bash
# 开发模式
./gradlew bootRun
# 或
mvn spring-boot:run

# 打包构建
./gradlew build
# 或
mvn clean package

# 运行打包后的 Jar
java -jar build/libs/ticket-assistant-1.0.0.jar
```

启动后访问：
- API 根路径：`http://localhost:8088/api/v1`
- Swagger 文档：`http://localhost:8088/api/swagger-ui.html`
- API Docs JSON：`http://localhost:8088/api/v3/api-docs`

---

## 认证机制

### 登录流程

```
1. 前端获取验证码：POST /auth/code
2. 用户提交账号+密码+验证码：POST /auth/login
3. 后端验证成功，返回：
   {
     "code": 0,
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIs...",
       "userInfo": {
         "userName": "admin",
         "userId": 1,
         ...
       }
     }
   }
4. 前端保存 Token 和 userInfo 到 localStorage
5. 后续请求在 Header 中携带：Authorization: Bearer <token>
```

### Token 策略

- **类型**：JWT (JSON Web Token)
- **有效期**：2 小时
- **存储**：前端 localStorage
- **自动续期**：每次请求检查剩余时间，不足 30 分钟自动刷新
- **登出**：前端清除 Token，后端可将 Token 加入黑名单

### 权限校验

- 所有 `/api/v1/**` 下的接口（除 `/auth/**` 外）均需认证
- 请求头需携带：`Authorization: Bearer <token>`
- Token 无效或过期返回 `401 Unauthorized`
- 无权限访问返回 `403 Forbidden`

---

## API 接口

### 统一响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 状态码，0 表示成功，非 0 表示失败 |
| message | string | 提示信息 |
| data | object | 业务数据（可能为 null） |

### 分页响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [ ... ],
    "total": 100,
    "page": 1,
    "per_page": 10
  }
}
```

---

### 认证模块

#### 用户登录

- **URL**：`POST /api/v1/auth/login`
- **Content-Type**：`application/x-www-form-urlencoded`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名/邮箱 |
| password | string | 是 | 密码 |
| grant_type | string | 是 | 固定值：`password` |
| client_id | string | 是 | 客户端标识：`web` |
| timestamp | string | 否 | 时间戳 |

**成功响应**：

```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "userInfo": {
      "userName": "admin",
      "userId": 1,
      "userType": "admin",
      "email": "admin@example.com",
      "phone": "13800138000"
    }
  }
}
```

#### 用户注册

- **URL**：`POST /api/v1/auth/register`
- **Content-Type**：`application/json`

**请求体**：

```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "code": "string",
  "timestamp": "string"
}
```

#### 获取验证码

- **URL**：`POST /api/v1/auth/code`

**请求体**：

```json
{
  "username": "string",
  "timestamp": "string"
}
```

#### 用户登出

- **URL**：`POST /api/v1/auth/logout`
- **需要认证**：是

**请求体**：

```json
{
  "username": "string",
  "timestamp": "string"
}
```

---

### 用户模块

#### 获取当前用户信息

- **URL**：`GET /api/v1/users/me`
- **需要认证**：是

**成功响应**：

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "phone": "13800138000",
    "type": "admin",
    "status": "active",
    "created_at": "2025-01-01T00:00:00"
  }
}
```

---

### 车票模块

#### 查询车次列表

- **URL**：`GET /api/v1/tickets/query`
- **需要认证**：是

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| from | string | 是 | 出发站代码 |
| to | string | 是 | 到达站代码 |
| date | string | 是 | 出发日期（YYYY-MM-DD） |

**成功响应**：

```json
{
  "code": 0,
  "data": [
    {
      "train_num": "G1",
      "train_from": "北京南",
      "train_to": "上海虹桥",
      "train_start_time": "07:00",
      "train_end_time": "11:28",
      "duration": "4h28m",
      "tickets": [
        { "seatType": "商务座", "price": 1748, "left": 5 },
        { "seatType": "一等座", "price": 933, "left": 20 },
        { "seatType": "二等座", "price": 553, "left": 100 }
      ]
    }
  ]
}
```

#### 查询车站信息

- **URL**：`GET /api/v1/tickets/station`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| train_num | string | 是 | 车次号 |

#### 查询车次价格

- **URL**：`GET /api/v1/tickets/{trainNum}/prices`

#### 查询车次详情

- **URL**：`GET /api/v1/tickets/{trainNum}/detail`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| date | string | 是 | 出发日期 |

---

### 订单模块

#### 创建订单

- **URL**：`POST /api/v1/orders`
- **需要认证**：是

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
  "passengers": "[{\"name\":\"张三\",\"idCard\":\"110101199001011234\",\"seatType\":\"二等座\"},{\"name\":\"李四\",\"idCard\":\"310101199203034567\",\"seatType\":\"二等座\"}]",
  "price": 1106,
  "payment_method": "wechat"
}
```

**成功响应**：

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "order_no": "20250726000001",
    "status": "pending",
    "expires_at": "2025-07-26T15:00:00"
  }
}
```

#### 查询订单列表

- **URL**：`GET /api/v1/orders`
- **需要认证**：是

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| per_page | int | 否 | 每页数量，默认 10 |
| page | int | 否 | 页码，默认 1 |
| status | string | 否 | 订单状态筛选 |

**成功响应**：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "order_no": "20250726000001",
        "train_num": "G1",
        "train_date": "2025-07-26",
        "from_station": "北京南",
        "to_station": "上海虹桥",
        "seat_type": "二等座",
        "passenger_name": "张三",
        "passenger_count": 2,
        "price": 1106,
        "status": "pending",
        "created_at": "2025-07-26T10:00:00"
      }
    ],
    "total": 28,
    "page": 1,
    "per_page": 10
  }
}
```

#### 查询订单详情

- **URL**：`GET /api/v1/orders/{id}`
- **需要认证**：是

#### 取消订单

- **URL**：`PUT /api/v1/orders/{id}/cancel`
- **需要认证**：是

**成功响应**：

```json
{
  "code": 0,
  "message": "订单已取消"
}
```

#### 删除订单

- **URL**：`DELETE /api/v1/orders/{id}`
- **需要认证**：是

---

### 支付模块

#### 支付订单

- **URL**：`PUT /api/v1/orders/{id}/pay`
- **需要认证**：是

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
| cloudpay | 云闪付 |
| jdpay | 京东支付 |

**成功响应**：

```json
{
  "code": 0,
  "data": {
    "payment_url": "weixin://wxpay/bizpayurl?pr=...",
    "qr_code": "data:image/png;base64,...",
    "expires_at": "2025-07-26T15:00:00"
  }
}
```

#### 查询支付状态

- **URL**：`GET /api/v1/orders/{id}/payment-status`
- **需要认证**：是

**成功响应**：

```json
{
  "code": 0,
  "data": {
    "status": "paid",
    "paid_at": "2025-07-26T14:30:00"
  }
}
```

---

### 城市管理

#### 获取城市列表

- **URL**：`GET /api/v1/cities`
- **需要认证**：是（管理员）

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| per_page | int | 否 | 每页数量 |
| page | int | 否 | 页码 |

#### 新增城市

- **URL**：`POST /api/v1/cities`

**请求体**：

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

#### 更新城市

- **URL**：`PUT /api/v1/cities/{id}`

#### 删除城市

- **URL**：`DELETE /api/v1/cities/{id}`

#### 搜索城市

- **URL**：`GET /api/v1/cities/search`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词 |

---

### 车站管理

#### 获取车站列表

- **URL**：`GET /api/v1/stations`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| per_page | int | 否 | 每页数量 |
| page | int | 否 | 页码 |

#### 新增/更新车站

- **URL**：`POST /api/v1/stations`（新增）
- **URL**：`PUT /api/v1/stations/{id}`（更新）

**请求体**：

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

#### 删除车站

- **URL**：`DELETE /api/v1/stations/{id}`

---

### 乘客管理

#### 获取乘客列表

- **URL**：`GET /api/v1/passengers`
- **需要认证**：是（当前用户的乘客）

**成功响应**：

```json
{
  "code": 0,
  "data": [
    {
      "id": "1",
      "name": "张三",
      "id_card": "110101199001011234",
      "id_card_type": "身份证",
      "type": "成人",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "status": "active",
      "created_at": "2025-01-01T00:00:00",
      "updated_at": "2025-01-01T00:00:00"
    }
  ]
}
```

#### 新增乘客

- **URL**：`POST /api/v1/passengers`

**请求体**：

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

#### 更新乘客

- **URL**：`PUT /api/v1/passengers/{id}`

#### 删除乘客

- **URL**：`DELETE /api/v1/passengers/{id}`

---

### 聊天模块

#### 获取聊天列表

- **URL**：`POST /api/v1/chat/getChatList`

**请求体**：

```json
{
  "userId": "string"
}
```

#### 获取聊天历史

- **URL**：`POST /api/v1/chat/getChatHistory`

**请求体**：

```json
{
  "userId": "string",
  "chatId": "string"
}
```

#### 发送消息

- **URL**：`POST /api/v1/chat/sendChatMessage`

**请求体**：

```json
{
  "userId": "string",
  "chatId": "string",
  "content": "你好"
}
```

---

## 数据库设计

### ER 关系概览

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  users   │────<│  orders  │>────│  passengers  │
└──────────┘     └──────────┘     └──────────────┘
      │                │
      │                │ contains (JSON)
      │                ▼
      │         ┌──────────────┐
      │         │  passengers  │
      │         │  (JSON array)│
      │         └──────────────┘
      │
      │          ┌──────────┐     ┌──────────┐
      ├─────────<│  cities   │────<│ stations │
      │          └──────────┘     └──────────┘
      │
      └──────────┐     ┌──────────────┐
                 │     │  chat_msgs   │
                 └────<│              │
                       └──────────────┘
```

### 用户表 (users)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键自增 |
| username | VARCHAR(50) | 用户名（唯一） |
| password | VARCHAR(255) | 加密后的密码 |
| email | VARCHAR(100) | 邮箱 |
| phone | VARCHAR(20) | 手机号 |
| type | VARCHAR(20) | 用户类型：admin / user |
| status | VARCHAR(20) | 状态：active / disabled |
| last_login_at | DATETIME | 最后登录时间 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**索引**：`uk_username` (username), `idx_email` (email)

### 城市表 (cities)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键自增 |
| name | VARCHAR(100) | 城市名称 |
| code | VARCHAR(20) | 城市代码（唯一） |
| province | VARCHAR(100) | 所属省份 |
| level | VARCHAR(50) | 城市等级 |
| population | VARCHAR(50) | 人口 |
| area | VARCHAR(50) | 面积 |
| zip_code | VARCHAR(20) | 邮政编码 |
| description | TEXT | 描述 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 车站表 (stations)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键自增 |
| name | VARCHAR(100) | 车站名称 |
| code | VARCHAR(20) | 车站代码（唯一） |
| city_id | BIGINT UNSIGNED | 关联城市 ID |
| level | INT | 车站等级 |
| open_date | DATE | 启用日期 |
| address | VARCHAR(255) | 详细地址 |
| keyword | VARCHAR(100) | 搜索关键词 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**索引**：`idx_city_id` (city_id), `idx_name` (name)

### 乘客表 (passengers)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键自增 |
| user_id | BIGINT UNSIGNED | 所属用户 ID |
| name | VARCHAR(50) | 乘客姓名 |
| id_card | VARCHAR(30) | 身份证号 |
| id_card_type | VARCHAR(20) | 证件类型 |
| type | VARCHAR(20) | 类型：成人/儿童 |
| phone | VARCHAR(20) | 手机号 |
| email | VARCHAR(100) | 邮箱 |
| status | VARCHAR(20) | 状态：active / disabled |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**索引**：`idx_user_id` (user_id), `idx_id_card` (id_card)

### 订单表 (orders)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键自增 |
| order_no | VARCHAR(30) | 订单号（唯一） |
| user_id | BIGINT UNSIGNED | 用户 ID |
| train_num | VARCHAR(20) | 车次号 |
| train_date | DATE | 出发日期 |
| train_start_time | VARCHAR(10) | 出发时间 |
| train_end_time | VARCHAR(10) | 到达时间 |
| from_station | VARCHAR(100) | 出发站 |
| to_station | VARCHAR(100) | 到达站 |
| seat_type | VARCHAR(50) | 座位类型 |
| passenger_name | VARCHAR(50) | 第一位乘客姓名 |
| passenger_id_card | VARCHAR(30) | 第一位乘客身份证 |
| passenger_count | INT | 乘客总数 |
| passengers | JSON | 所有乘客信息 [{"name","idCard","seatType"}] |
| price | DECIMAL(10,2) | 订单总价 |
| status | VARCHAR(20) | 订单状态 |
| payment_method | VARCHAR(20) | 支付方式 |
| paid_at | DATETIME | 支付时间 |
| expires_at | DATETIME | 支付截止时间 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**订单状态流转**：

```
pending(待支付) → paid(已支付)
                → cancelled(已取消)
                → expired(已过期)
```

### 支付记录表 (payments)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键自增 |
| order_id | BIGINT UNSIGNED | 订单 ID |
| payment_method | VARCHAR(20) | 支付方式 |
| amount | DECIMAL(10,2) | 支付金额 |
| status | VARCHAR(20) | 支付状态 |
| transaction_no | VARCHAR(100) | 第三方交易号 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 聊天消息表 (chat_msgs)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键自增 |
| user_id | BIGINT UNSIGNED | 用户 ID |
| chat_id | VARCHAR(50) | 会话 ID |
| role | VARCHAR(20) | 角色：user / bot |
| content | TEXT | 消息内容 |
| msg_type | VARCHAR(20) | 消息类型：text / image / link |
| created_at | DATETIME | 创建时间 |

---

## 数据字典

### 座位类型 (seat_type)

| 值 | 说明 |
|----|------|
| 商务座 | Business Seat |
| 一等座 | First Class |
| 二等座 | Second Class |
| 软卧 | Soft Sleeper |
| 硬卧 | Hard Sleeper |
| 高级软卧 | Deluxe Soft Sleeper |
| 动卧 | EMU Sleeper |
| 无座 | No Seat |

### 订单状态 (status)

| 值 | 说明 |
|----|------|
| pending | 待支付 |
| paid | 已支付 |
| cancelled | 已取消 |
| expired | 已过期 |
| refunded | 已退款 |

### 支付方式 (payment_method)

| 值 | 说明 |
|----|------|
| wechat | 微信支付 |
| alipay | 支付宝 |
| unionpay | 银联 |
| cloudpay | 云闪付 |
| jdpay | 京东支付 |

### 用户类型 (type)

| 值 | 说明 |
|----|------|
| admin | 管理员 |
| user | 普通用户 |

### 乘客类型 (type)

| 值 | 说明 |
|----|------|
| 成人 | 成年人 |
| 儿童 | 儿童 |
| 学生 | 学生 |
| 军人 | 军人 |

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数校验失败 |
| 1002 | 数据不存在 |
| 2001 | 用户名或密码错误 |
| 2002 | 验证码错误 |
| 2003 | 验证码已过期 |
| 2004 | 用户名已存在 |
| 2005 | 邮箱已注册 |
| 3001 | Token 无效 |
| 3002 | Token 已过期 |
| 3003 | 无访问权限 |
| 4001 | 订单不存在 |
| 4002 | 订单已取消 |
| 4003 | 订单已过期 |
| 4004 | 订单已支付 |
| 5001 | 支付失败 |
| 5002 | 支付超时 |
| 9999 | 服务器内部错误 |

### 错误响应示例

```json
{
  "code": 2001,
  "message": "用户名或密码错误",
  "data": null
}
```

---

## 部署指南

### 开发环境

```bash
# 1. 初始化数据库
mysql -u root -p < database/schema.sql

# 2. 启动 Redis
redis-server

# 3. 启动后端服务
cd backend
./gradlew bootRun

# 4. 启动前端
cd electron-app
yarn dev
```

### 生产环境

```bash
# 1. 打包
./gradlew build -x test

# 2. 运行
java -jar build/libs/ticket-assistant-1.0.0.jar \
  --spring.profiles.active=prod

# 3. 使用 systemd 管理（Linux）
# /etc/systemd/system/ticket-assistant.service
[Unit]
Description=Ticket Assistant API
After=network.target

[Service]
User=app
Group=app
ExecStart=/usr/bin/java -jar /opt/app/ticket-assistant.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Nginx 配置（可选）

```nginx
server {
    listen 80;
    server_name api.example.com;

    location /api/ {
        proxy_pass http://localhost:8088/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 许可

© 2025 12306 抢票助手. All rights reserved.