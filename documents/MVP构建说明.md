# MVP 构建说明

## 已完成范围（对照 PRD Phase 1）

### 后端 API（`packages/server`）

| 模块 | 端点 | 说明 |
|------|------|------|
| 健康检查 | `GET /api/v1/health` | 服务状态 |
| 认证 | `POST /auth/dev/login` | 开发登录（无微信配置时） |
| 认证 | `POST /auth/wechat/login` | 微信 code 登录 |
| 认证 | `GET/PATCH /auth/profile` | 资料、角色、关怀模式 |
| 课程 | `GET /courses` | 已发布课程列表 |
| 课程 | `GET /courses/:id` | 详情 + 可选进度 |
| 课程 | `PATCH /courses/units/:id/progress` | 学习进度 |
| 问卷 | `GET/POST /surveys/*` | 列表、提交、离线批量同步 |
| 故事 | `GET /stories` | 故事墙 |
| 统计 | `GET /stats` | 成果 KPI |
| 队员 | `POST /team/invite/verify` | 邀请码 |
| 管理端 | `POST /admin/auth/login` | 后台登录 |
| 管理端 | `GET /admin/*` | 仪表盘、课程、问卷导出、用户 |

技术实践：NestJS 模块化、JWT + RBAC、`class-validator`、统一 `{code,data,message}` 响应、Prisma、Swagger `/api/docs`。

### 管理后台（`apps/admin`）

- 登录页（默认 `admin` / `yubing2026`，seed 写入）
- 仪表盘（用户、问卷、KPI）
- 课程管理（列表、新建、上下架）
- 问卷数据（列表、JSON 导出）
- 用户管理

### 小程序（`apps/miniprogram`）

- 4 Tab + 分包 `packageTeam`
- 页面：首页、学习/详情、服务（乡村/社区/文博）、关怀模式、问卷、我的、故事详情、队员调研
- 离线问卷草稿 + 联网同步
- 关怀模式主题
- API 层 `services/request`、`auth`、`sync`

### 共享包（`packages/shared`）

- 角色枚举、API 路径、DTO 类型、品牌常量

## 本地启动（一步一步）

```bash
# 1. 依赖
pnpm install

# 2. 环境变量
cp .env.example .env

# 3. 数据库
pnpm docker:up
pnpm db:generate
pnpm db:migrate
pnpm --filter @yubing/server exec prisma db seed

# 4. 启动（三个终端或并行）
pnpm dev:server    # :3000
pnpm dev:admin     # :5173
pnpm dev:mp        # 微信开发者工具打开仓库根目录
```

## 种子数据

- 管理员：`admin` / `yubing2026`
- 队员邀请码：`YUBING2026`
- 3 套课程、2 份问卷、2 条故事、站点 KPI

## 待 Phase 2

- 微信正式登录（配置 `WECHAT_APPID` / `WECHAT_SECRET`）
- COS 视频上传、订阅消息
- 学情前后测报表图表
- NutUI 组件库接入
