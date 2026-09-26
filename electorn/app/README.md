# 12306 抢票助手

一个基于 Electron + React + TypeScript 构建的桌面端火车票预订助手应用，提供车票查询、在线预订、订单管理、在线支付等完整业务流程，同时支持多窗口协作、数据管理和智能客服。

## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [开发指南](#开发指南)
- [API 接口](#api-接口)
- [数据库设计](#数据库设计)
- [构建打包](#构建打包)
- [代码规范](#代码规范)

---

## 功能特性

### 🎫 车票服务
- **车次查询**：按出发地、目的地、日期查询可用车次
- **余票展示**：实时展示各座位类型余票数量及价格
- **多乘客预订**：支持同时为多名乘客预订车票（最多 5 人）
- **车次详情**：查看途经站点、到发时间、各座位类型价格

### 📋 订单管理
- **订单列表**：分页查询所有订单，支持按状态筛选
- **订单详情**：查看完整订单信息，含乘客姓名、身份证、座位等
- **订单取消**：一键取消待支付订单
- **订单删除**：删除已取消的订单记录
- **乘客信息平铺**：多名乘客以「姓名 + 身份证号」格式平铺展示

### 💳 在线支付
- **多种支付方式**：微信支付、支付宝、银联、云闪付、京东支付
- **QR 码扫码支付**：自动生成支付二维码
- **支付倒计时**：15 分钟支付超时自动取消订单
- **支付结果轮询**：实时查询支付状态

### 👤 用户中心
- **安全登录**：账号密码 + 短信验证码双重验证
- **滑动验证**：防止机器人自动操作
- **登录状态同步**：多窗口间通过 IPC 同步登录态

### 🛠️ 数据管理
- **城市管理**：维护城市基本信息（名称、代码、省份、等级等）
- **车站管理**：维护全国铁路车站信息
- **乘客管理**：管理常用乘客信息
- **用户管理**：管理员可管理系统用户

### 💬 智能客服
- **实时聊天**：与 AI 客服智能对话
- **富文本消息**：支持图片、链接、Markdown 格式
- **快捷操作**：常用问题一键发送

### 🖥️ 多窗口协作
- **主窗口 + 子窗口**：支持多窗口独立运行
- **IPC 通信**：窗口间通过 Electron IPC 传递数据
- **登录态同步**：所有窗口共享登录状态

---

## 技术栈

| 分类 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **桌面框架** | Electron | 31.x | 跨平台桌面应用框架 |
| **构建工具** | electron-vite | 2.x | Electron + Vite 构建方案 |
| **前端框架** | React | 18.x | UI 组件库 |
| **开发语言** | TypeScript | 5.x | 类型安全的 JavaScript 超集 |
| **UI 组件库** | Ant Design | 5.x | 企业级 UI 设计语言 |
| **状态管理** | Redux | 5.x | 全局状态管理 |
| **路由** | React Router DOM | 6.x | SPA 路由 |
| **HTTP 客户端** | Axios | 1.x | HTTP 请求库 |
| **日期处理** | Moment.js / Day.js | 2.x | 日期时间处理 |
| **打包工具** | electron-builder | 24.x | 应用打包分发 |
| **代码规范** | ESLint + Prettier | - | 代码风格统一 |

---

## 项目结构

```
electron-app/
├── src/
│   ├── main/                    # Electron 主进程
│   │   └── index.ts             # 主进程入口（窗口管理、IPC）
│   ├── preload/                 # 预加载脚本
│   │   ├── index.ts             # API 桥接
│   │   └── index.d.ts           # 类型声明
│   └── renderer/                # 渲染进程（前端 SPA）
│       ├── index.html           # HTML 入口
│       └── src/
│           ├── api/             # API 请求封装
│           │   ├── index.ts     # Axios 实例、拦截器
│           │   ├── orders.ts    # 订单接口
│           │   ├── ticket.ts    # 车票接口
│           │   ├── user.ts      # 用户接口
│           │   ├── cities.ts    # 城市接口
│           │   ├── stations.ts  # 车站接口
│           │   ├── chat.ts      # 聊天接口
│           │   └── ipc.ts       # IPC 桥接
│           ├── components/      # 公共组件
│           │   └── Copyright.tsx
│           ├── hooks/           # 自定义 Hooks
│           │   └── useUserPolling.ts
│           ├── mock/            # Mock 数据
│           ├── pages/           # 页面组件
│           │   ├── login/       # 登录页
│           │   ├── home/       # 主页（侧边栏布局）
│           │   ├── ticket/      # 车票模块
│           │   │   ├── components/   # 子组件（搜索框、筛选器等）
│           │   │   ├── tabs/     # Tab 页面（查询、预订、支付、列表）
│           │   │   └── constants.ts  # 类型定义
│           │   ├── infomgr/     # 数据管理模块
│           │   ├── chat/        # 客服聊天模块
│           │   └── common/      # 公共页面（404等）
│           ├── router/          # 路由配置
│           │   ├── index.tsx
│           │   └── router.tsx   # 路由守卫
│           ├── store/           # Redux 状态
│           ├── App.tsx          # 应用根组件
│           └── main.tsx         # 渲染进程入口
├── database/
│   └── schema.sql               # 数据库表结构
├── build/                       # 构建资源（图标、配置）
├── resources/                  # 静态资源
├── electron-builder.yml         # 打包配置
├── electron.vite.config.ts      # Vite 配置
├── tsconfig.json                # TypeScript 配置
├── .eslintrc.cjs                # ESLint 配置
├── .prettierrc.yaml             # Prettier 配置
└── package.json                 # 项目依赖与脚本
```

---

## 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 或 **yarn** >= 1.22.0
- **操作系统**：macOS / Windows / Linux

### 安装与运行

```bash
# 克隆项目
git clone <repository-url>
cd electron-app

# 安装依赖
yarn
# 或 npm install

# 开发模式运行
yarn dev
# 或 npm run dev
```

开发模式下会自动启动 Electron 窗口，支持 HMR 热更新。

---

## 开发指南

### 常用脚本

| 命令 | 说明 |
|------|------|
| `yarn dev` | 启动开发服务器（Vite + Electron） |
| `yarn start` | 启动预览服务器（需先 build） |
| `yarn build` | 类型检查 + 生产构建 |
| `yarn lint` | ESLint 检查并自动修复 |
| `yarn format` | Prettier 格式化全部文件 |
| `yarn typecheck` | 运行 Node + Web 类型检查 |

### 路由结构

| 路径 | 页面 | 需要登录 |
|------|------|----------|
| `/` | 根路径（自动跳转） | 是 |
| `/login` | 登录页 | 否 |
| `/home` | 主页 | 是 |
| `/order` | 预订页 | 是 |
| `/orderlist` | 订单列表 | 是 |
| `/payment` | 支付页 | 是 |
| `/chat` | 智能客服 | 是 |
| `/404` | 页面未找到 | 否 |

### 状态管理

项目使用 Redux 管理全局状态，主要存储：
- **用户信息**：登录态、Token、用户资料
- **订单状态**：当前订单、订单列表缓存
- **全局 UI 状态**：主题、语言等

### IPC 通信

主进程与渲染进程通过 Electron IPC 通信，主要用于：
- **登录态同步**：`send-login-state` / `receive-login-state`
- **窗口管理**：`open-new-window` 打开子窗口
- **登出处理**：`logout` 广播登出事件

---

## API 接口

基础路径：`/api/v1`

### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/login` | 用户登录 |

### 车票

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/tickets/query` | 查询车次列表 |
| GET | `/tickets/station` | 查询车站信息 |
| GET | `/tickets/:trainNum/prices` | 查询车次价格 |
| GET | `/tickets/:trainNum/detail` | 查询车次详情 |

### 订单

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/orders` | 订单列表（分页） |
| GET | `/orders/:id` | 订单详情 |
| POST | `/orders` | 创建订单 |
| PUT | `/orders/:id/pay` | 支付订单 |
| PUT | `/orders/:id/cancel` | 取消订单 |
| DELETE | `/orders/:id` | 删除订单 |

### 数据管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/cities` | 获取城市列表 |
| GET | `/stations` | 获取车站列表 |

### 认证拦截

- 请求自动携带 `Authorization: Bearer <token>` 头
- 响应拦截器统一处理 401/403 错误，自动跳转登录页
- 登录成功后自动保存 Token 和用户信息到 localStorage

---

## 数据库设计

### 城市信息表 (`cities`)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT UNSIGNED | 主键自增 |
| name | VARCHAR(100) | 城市名称 |
| code | VARCHAR(20) | 城市代码（唯一） |
| province | VARCHAR(100) | 所属省份 |
| level | VARCHAR(50) | 城市等级 |
| population | VARCHAR(50) | 人口数量 |
| area | VARCHAR(50) | 面积 |
| zip_code | VARCHAR(20) | 邮政编码 |
| description | TEXT | 城市描述 |

### 订单相关

乘客信息以 JSON 数组形式存储在订单的 `passengers` 字段中，结构：

```json
[
  { "name": "张三", "idCard": "110101199001011234", "seatType": "二等座" },
  { "name": "李四", "idCard": "310101199203034567", "seatType": "一等座" }
]
```

---

## 构建打包

### 各平台构建

```bash
# Windows
yarn build:win

# macOS
yarn build:mac

# Linux
yarn build:linux
```

### 打包配置

构建配置在 `electron-builder.yml` 中定义：

- **应用 ID**：`com.electron.app`
- **应用名称**：`electron-app`
- **输出格式**：
  - Windows: `.exe` 安装程序
  - macOS: `.dmg` 镜像
  - Linux: AppImage / snap / deb

### macOS 权限声明

```xml
<key>NSCameraUsageDescription</key>
<string>Application requests access to the device's camera.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Application requests access to the device's microphone.</string>
<key>NSDocumentsFolderUsageDescription</key>
<string>Application requests access to the user's Documents folder.</string>
<key>NSDownloadsFolderUsageDescription</key>
<string>Application requests access to the user's Downloads folder.</string>
```

---

## 代码规范

### ESLint 配置

基于 `@electron-toolkit/eslint-config-ts` 和 `eslint-plugin-react`，主要规则：
- `@typescript-eslint/explicit-function-return-type`：函数需显式声明返回类型
- `@typescript-eslint/no-explicit-any`：禁止使用 `any` 类型
- `@typescript-eslint/no-unused-vars`：禁止未使用的变量

### Prettier 配置

```yaml
singleQuote: true
semi: false
tabWidth: 2
printWidth: 120
trailingComma: 'none'
```

### 代码风格

- **组件文件**：每个组件一个 `.tsx` 文件，文件名为组件名
- **类型定义**：统一存放在 `constants.ts` 或独立的类型文件中
- **Hooks**：以 `use` 开头，存放在 `hooks/` 或页面目录下
- **API 封装**：按业务模块拆分，每个文件导出接口函数
- **样式**：使用 CSS Modules 或独立 `.css` 文件

---

## 许可

© 2025 12306 抢票助手. All rights reserved.