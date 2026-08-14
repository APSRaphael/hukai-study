# Agent Frontend

React 前端工程，对接 `agent-backend-project`。

## 技术栈

- React 19 + TypeScript + Vite
- pnpm
- Ant Design（UI）
- Zustand（状态，含鉴权持久化）
- React Router（路由）
- Axios（请求；401 自动 refresh 重试）
- Oxlint + Prettier（检查与格式化）

## 开始

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## 常用脚本

| 命令             | 说明                    |
| ---------------- | ----------------------- |
| `pnpm dev`       | 开发服务器（默认 5173） |
| `pnpm build`     | 类型检查 + 生产构建     |
| `pnpm preview`   | 预览构建产物            |
| `pnpm lint`      | Oxlint 检查             |
| `pnpm format`    | Prettier 格式化         |
| `pnpm typecheck` | 仅 TypeScript 检查      |
