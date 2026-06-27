# 语冰 Insight — 阿里云服务器端 AI 运维手册

> **读者**：在阿里云 ECS 上通过 SSH / Remote 协助开发的 AI 助手或运维人员。  
> **目标**：在服务器上稳定运行 API + 数据库 +（可选）管理后台；小程序编译与微信开发者工具留在开发者本机。

---

## 1. 部署架构（必读）

```text
┌─────────────────────────────────────────────────────────────┐
│  阿里云 ECS（公网示例：8.130.52.140）                        │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ Docker      │  │ NestJS API   │  │ Vue Admin (可选)    │ │
│  │ Postgres    │──│ :3000        │  │ :5173 → 代理 /api   │ │
│  │ Redis:6380  │  │ /api/v1      │  │                     │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
└───────────────────────────▲─────────────────────────────────┘
                            │ HTTP :3000（安全组放行）
┌───────────────────────────┴─────────────────────────────────┐
│  开发者本机（Windows）                                        │
│  Taro 编译 pnpm dev:mp + 微信开发者工具（打开仓库根目录）     │
│  YUBING_API_BASE=http://<公网IP>:3000                       │
└─────────────────────────────────────────────────────────────┘
```

**分工原则**

| 在服务器做 | 在本机做 |
|------------|----------|
| `pnpm docker:up`（Postgres） | `pnpm dev:mp`（Taro  watch） |
| `pnpm dev:server` 或生产构建 | 微信开发者工具预览 / 上传 |
| `pnpm dev:admin`（可选） | 日常改代码后 `git push` |
| `git pull`、`pnpm install`、数据库迁移/seed | 设置 `YUBING_API_BASE` 联调远程 API |

**不要在服务器上运行** `pnpm dev:mp`：Taro + 微信构建占内存，4 GiB 实例易 OOM。

**不要在服务器上运行** 微信开发者工具：仅支持 Windows/macOS 桌面版，无 Linux 服务端版本。

---

## 2. 服务器实例信息（当前环境）

| 项 | 值 |
|----|-----|
| 实例名 | Docker-lekb |
| 公网 IP | `8.130.52.140` |
| 私网 IP | `172.19.40.47` |
| 规格 | 2 vCPU / 4 GiB / 50 GiB ESSD |
| 预装 | Docker 26.1.3 |
| 系统 | 阿里云 Linux（以实际 `uname -a` 为准） |

公网 IP 若变更，需同步通知本机开发者更新 `YUBING_API_BASE`，**不要把 IP 硬编码进 Git 仓库**。

---

## 3. 仓库与 Monorepo 结构

```text
YuBingInsight/                 # 仓库根（pnpm workspace）
├── .env                       # 仅本机/服务器本地存在，不提交 Git
├── .env.example               # 模板，可提交
├── docker/docker-compose.yml  # Postgres + Redis
├── package.json               # 根脚本：dev:server、docker:up、db:* 等
├── apps/
│   ├── admin/                 # Vue3 管理后台 → 本手册：可选在服务器 dev
│   └── miniprogram/           # Taro 小程序 → 仅本机开发
├── packages/
│   ├── server/                # NestJS API（Prisma、JWT）
│   └── shared/                # 共享类型与 API 路径常量
└── documents/                 # 项目文档（含本手册）
```

**技术栈**：Node ≥ 20、pnpm、NestJS 11、Prisma 6、PostgreSQL 16、Vue 3 + Vite。

---

## 4. AI 操作约束（安全与惯例）

1. **禁止**将 `.env`、密钥、`JWT_SECRET`、数据库密码提交到 Git。
2. **禁止**在安全组公网开放 `5432`（Postgres）；`DATABASE_URL` 使用 `127.0.0.1:5432`。
3. **禁止**对生产数据执行无确认的 `docker compose down -v`（会删库）。
4. **禁止**修改 `git config`、禁止 `git push --force` 到 main，除非用户明确要求。
5. **优先**使用根目录 `package.json` 中的脚本（已配置 `dotenv-cli` 加载根 `.env`）：
   - ✅ `pnpm db:push`、`pnpm db:seed`、`pnpm dev:server`
   - ❌ 裸跑 `prisma migrate` 在 `packages/server` 下且不加载 `.env`
6. Prisma 相关命令前若报 `DATABASE_URL not found`，先确认根目录 `.env` 存在，再用 `pnpm db:*` 脚本。
7. 密码哈希使用 **bcryptjs**（纯 JS），不要用原生 **bcrypt**。
8. `AdminModule` 依赖 `AuthModule` 导出的 `JwtService`；若启动报 `JwtService` 无法注入，检查 `admin.module.ts` 是否 `imports: [AuthModule, ...]`。

---

## 5. 安全组与防火墙

在阿里云控制台 → 实例 → 安全组，建议放行：

| 端口 | 用途 | 来源 |
|------|------|------|
| 22 | SSH | 开发者 IP 或办公网 |
| 3000 | NestJS API | 开发者 IP（微信联调） |
| 5173 | Admin 开发服（可选） | 开发者 IP |

**不要**公网开放 5432、6380。

服务器内若启用 `firewalld`/`ufw`，需与上述一致；Docker 已映射端口时，以安全组为准。

---

## 6. 首次部署（从零到 API 可用）

假设代码已通过 Git 克隆到例如 `/root/YuBingInsight` 或 `/home/<user>/YuBingInsight`。

### 6.1 安装 Node 与 pnpm（若未安装）

```bash
# 示例：Node 20 via nvm（按服务器实际情况调整）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
corepack enable
corepack prepare pnpm@latest --activate
node -v   # 应 >= 20
pnpm -v
```

### 6.2 环境变量

```bash
cd /path/to/YuBingInsight
cp .env.example .env
```

编辑 `.env`（**服务器专用，勿提交**）：

```env
DATABASE_URL="postgresql://yubing:yubing@127.0.0.1:5432/yubing_insight?schema=public"
PORT=3000
JWT_SECRET=<随机长字符串，生产务必更换>
WECHAT_APPID=""
WECHAT_SECRET=""
```

说明：`127.0.0.1` 表示 Postgres 与 API 同机；与 `docker-compose.yml` 中默认账号一致（`yubing` / `yubing`）。

### 6.3 依赖与数据库

```bash
# 4 GiB 内存建议限制 Node 堆，避免 install OOM
export NODE_OPTIONS=--max-old-space-size=2048

pnpm install
pnpm docker:up          # 启动 Postgres + Redis
pnpm db:generate
pnpm db:push            # MVP 使用 push；有迁移文件时用 db:migrate
pnpm db:seed            # 写入管理员、课程、问卷等种子数据
```

确认容器健康：

```bash
docker ps
# 应看到 yubing-postgres、yubing-redis（redis 映射主机 6380）
```

### 6.4 启动 API

```bash
pnpm dev:server
```

成功日志示例：`API running at http://localhost:3000/api/v1`

验证（在服务器或本机）：

```bash
curl -s http://8.130.52.140:3000/api/v1/health
# 或服务器上：curl -s http://127.0.0.1:3000/api/v1/health
```

Swagger：`http://<公网IP>:3000/api/docs`

### 6.5（可选）启动管理后台

```bash
pnpm dev:admin
```

浏览器：`http://<公网IP>:5173`  
默认账号（seed）：`admin` / `yubing2026`

Admin 的 Vite 将 `/api` 代理到 `http://localhost:3000`，因此 **admin 与 server 须在同一台机器** 开发模式联调。

---

## 7. 日常 Git 同步流程

**开发者本机**：改代码 → `git commit` → `git push`

**服务器**：

```bash
cd /path/to/YuBingInsight
git pull

# 若 package.json / lockfile 有变
export NODE_OPTIONS=--max-old-space-size=2048
pnpm install

# 若 prisma/schema 有变
pnpm db:generate
pnpm db:push    # 或协商后使用 migrate

# 重启 API（若用 dev:server，Ctrl+C 后重新执行）
pnpm dev:server
```

`.env` **不会**随 Git 更新；每台机器单独维护。

---

## 8. 与本机小程序联调（告知开发者）

小程序 **不在服务器编译**。开发者本机执行：

**PowerShell：**

```powershell
cd <本机仓库路径>
$env:YUBING_API_BASE="http://8.130.52.140:3000"
pnpm dev:mp
```

**bash：**

```bash
export YUBING_API_BASE=http://8.130.52.140:3000
pnpm dev:mp
```

微信开发者工具：

1. 打开仓库 **根目录**（存在根 `project.config.json`，`miniprogramRoot` 指向 `apps/miniprogram/dist/`）
2. 详情 → 本地设置 → **不校验合法域名**（开发阶段 API 为 HTTP + IP 时必须）
3. 小程序内开发登录：`POST /api/v1/auth/dev/login`（我的页入口）

---

## 9. 根目录脚本速查

| 命令 | 说明 |
|------|------|
| `pnpm docker:up` | 启动 Docker Compose（Postgres、Redis） |
| `pnpm docker:down` | 停止容器（不加 `-v` 不删数据卷） |
| `pnpm dev:server` | NestJS 开发模式 watch，端口 3000 |
| `pnpm dev:admin` | Vue Admin 开发服，端口 5173 |
| `pnpm build:server` | 编译 API → `packages/server/dist` |
| `pnpm db:generate` | Prisma Client 生成 |
| `pnpm db:push` |  schema 同步到数据库（无迁移文件时） |
| `pnpm db:migrate` | 迁移开发（需交互时慎用） |
| `pnpm db:seed` | 种子数据 |
| `pnpm db:studio` | Prisma Studio（勿长期公网暴露） |

生产启动（示例，非 MVP 默认）：

```bash
pnpm build:server
cd packages/server && node dist/main.js
# 建议配合 pm2/systemd，并设置 NODE_ENV=production
```

---

## 10. Docker Compose 说明

文件：`docker/docker-compose.yml`

| 服务 | 容器名 | 主机端口 | 说明 |
|------|--------|----------|------|
| postgres:16 | yubing-postgres | 5432 | 库名 `yubing_insight`，用户/密码 `yubing` |
| redis:7 | yubing-redis | **6380**→6379 | MVP API **未使用** Redis；6379 冲突时已改 6380 |

Redis 启动失败时，若仅需 API 联调，可只保证 Postgres 健康后执行 `db:push`。

---

## 11. API 与种子数据摘要

- 全局前缀：`/api/v1`
- 健康检查：`GET /api/v1/health`
- 管理端登录：`POST /api/v1/admin/auth/login`
- 开发用户登录：`POST /api/v1/auth/dev/login`
- CORS：已 `enableCors({ origin: true })`，支持跨域联调

**Seed 默认值**（`pnpm db:seed` 后）：

| 用途 | 值 |
|------|-----|
| 管理后台 | `admin` / `yubing2026` |
| 队员邀请码 | `YUBING2026` |
| 内容 | 3 课程、2 问卷、2 故事、站点 KPI |

---

## 12. 常见问题（Linux 服务器）

### 12.1 `docker: command not found` 或无法连接

- 确认 Docker 服务：`systemctl status docker`
- 启动：`systemctl start docker`
- 当前用户加 docker 组：`sudo usermod -aG docker $USER` 后重新登录

### 12.2 `pnpm install` 内存不足 / Killed

```bash
export NODE_OPTIONS=--max-old-space-size=2048
pnpm install
```

必要时临时关闭其他进程；4 GiB 实例不要同时跑 `dev:server` + `dev:admin` + `install`。

### 12.3 `DATABASE_URL` not found

根目录创建 `.env`，使用 `pnpm db:*` 而非裸 `prisma` 命令。

### 12.4 API 本机 curl 通，外网不通

1. 阿里云安全组是否放行 3000
2. 服务器防火墙
3. Nest 默认监听 `0.0.0.0`，一般无需改 `main.ts`

### 12.5 `AdminAuthService` / `JwtService` 依赖错误

`packages/server/src/admin/admin.module.ts` 必须：

```typescript
imports: [AuthModule, StatsModule, CoursesModule, SurveysModule, StoriesModule],
```

`AuthModule` 需 `exports: [JwtModule]`。

### 12.6 数据库连接失败

```bash
docker ps | grep yubing-postgres
docker logs yubing-postgres --tail 50
```

确认 `.env` 中 host 为 `127.0.0.1` 而非公网 IP。

### 12.7 Git pull 后 API 行为异常

```bash
pnpm install
pnpm db:generate
pnpm db:push
# 重启 dev:server
```

---

## 13. 生产化差距（当前 MVP）

以下 **尚未** 作为生产标准配置，AI 勿假设已就绪：

- HTTPS / 域名 / Nginx 反向代理
- 微信 request 合法域名（需备案 HTTPS）
- `WECHAT_APPID` / `WECHAT_SECRET` 正式登录
- pm2 / systemd 守护进程
- 正式 Prisma migrate 流水线（当前多用 `db push`）
- Redis 业务使用
- 自动化测试与 CI

当前目标：**开发联调稳定**（API + 本机小程序）。

---

## 14. 相关文档索引

| 文档 | 内容 |
|------|------|
| `documents/MVP构建说明.md` | 功能范围、API 列表、本地三步启动 |
| `documents/本地环境排错.md` | Windows 本机排错（bcrypt、EPERM、Docker Desktop） |
| `documents/项目完成情况.md` | 完成度与待办 |
| `documents/项目理解与技术栈说明.md` | 业务与架构总览 |
| `.env.example` | 环境变量模板 |

---

## 15. AI 快速检查清单

部署或排错时按序执行：

```bash
# 1. 环境与目录
node -v && pnpm -v && docker -v
test -f .env && echo ".env OK" || echo "MISSING .env"

# 2. 容器
docker ps --filter name=yubing

# 3. API
curl -sf http://127.0.0.1:3000/api/v1/health && echo "API OK"

# 4. 进程（可选）
pgrep -af "nest start" || echo "dev:server not running"
```

全部通过后，通知本机开发者设置 `YUBING_API_BASE=http://8.130.52.140:3000` 并运行 `pnpm dev:mp`。

---

*文档版本：与仓库 MVP 同步；公网 IP 变更时请更新第 2、8、15 节中的示例地址。*
