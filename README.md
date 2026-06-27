# 语冰 AI 普惠（YuBing Insight）

武汉大学 E乡情·语冰实践队公益小程序 Monorepo：**小程序 + 管理后台 + API**。

## 技术栈

| 包 | 路径 | 技术 |
|----|------|------|
| 小程序 | `apps/miniprogram` | Taro 3 + React + TypeScript |
| 管理后台 | `apps/admin` | Vue 3 + Vite + Element Plus |
| API | `packages/server` | NestJS + Prisma + PostgreSQL |
| 共享 | `packages/shared` | TypeScript 类型与常量 |

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动数据库（可选）

```bash
pnpm docker:up
cp .env.example .env
```

### 3. 初始化数据库

> 需先 **启动 Docker Desktop**。若报错见 [本地环境排错.md](./documents/本地环境排错.md)。

```bash
pnpm docker:up
pnpm db:generate
pnpm db:push      # 首次建表（或 db:migrate）
pnpm db:seed
```

### 4. 开发

```bash
# API（http://localhost:3000，Swagger: /api/docs）
pnpm dev:server

# 管理后台（http://localhost:5173）
pnpm dev:admin

# 小程序（先构建出 dist，再用微信开发者工具打开仓库根目录）
pnpm dev:mp
```

**微信开发者工具：** 打开本仓库**根目录**（读取根 `project.config.json`，指向 `apps/miniprogram/dist`）。先执行 `pnpm dev:mp` 生成 `dist`。

## 文档

- [项目理解与技术栈说明](./documents/项目理解与技术栈说明.md)
- [技术栈确认](./documents/技术栈确认.md)
- [MVP 构建说明](./documents/MVP构建说明.md)（功能清单与启动步骤）
- [项目完成情况](./documents/项目完成情况.md)（完成度、缺口与路线图）
- [本地环境排错](./documents/本地环境排错.md)（Docker / Prisma / bcrypt 常见问题）

## 遗留代码

原微信云开发 QuickStart 已移至 `legacy/` 目录，不再作为主开发路径。
