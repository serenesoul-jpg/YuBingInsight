# AI 助手说明

本仓库为 **语冰 Insight** Monorepo（小程序 + 管理后台 + NestJS API）。

## 在阿里云服务器上工作时

请先阅读并按此执行：

**[`documents/服务器端AI运维手册.md`](documents/服务器端AI运维手册.md)**

要点：

- 服务器跑：Docker（Postgres）、`pnpm dev:server`、可选 `pnpm dev:admin`
- **不要**在服务器跑 `pnpm dev:mp` 或微信开发者工具
- `.env` 不提交 Git；数据库用 `127.0.0.1:5432`
- 使用根目录 `pnpm db:*`、`pnpm docker:*` 脚本，勿裸跑 prisma
- 公网 API 示例：`http://8.130.52.140:3000`（IP 变更时更新手册）

## 其他文档

- `documents/MVP构建说明.md` — 功能与 API 列表
- `documents/本地环境排错.md` — Windows 本机排错
- `documents/项目理解与技术栈说明.md` — 业务与架构
