# GrowMate EDU:OS - 完整部署备份

**备份日期**: 2026-04-06  
**项目版本**: v2026-3-9.001  
**备份用途**: 跨设备传输 & 线上部署

---

## 目录结构

```
GrowMate-EDU_OS-v2026.04.06-full-deploy-backup/
├── source/                  # 完整项目源码
│   ├── src/                 # React + TypeScript 源代码
│   │   ├── components/      # UI 组件（含 admin/dashboard/ui）
│   │   ├── lib/             # 核心算法引擎 & 工具库
│   │   ├── hooks/           # React Hooks
│   │   ├── types/           # TypeScript 类型定义
│   │   └── tests/           # 测试文件
│   ├── public/              # 静态资源（图片等）
│   ├── dist/                # 预构建产物（可直接部署）
│   ├── package.json         # 依赖清单
│   ├── package-lock.json    # 依赖锁定（确保一致性）
│   ├── vite.config.ts       # Vite 构建配置
│   ├── tailwind.config.ts   # Tailwind CSS 配置
│   ├── tsconfig.json        # TypeScript 配置
│   ├── vercel.json          # Vercel 部署配置
│   ├── .env.example         # 环境变量模板
│   ├── deploy-tencent.sh    # 腾讯云部署脚本
│   └── deploy-vercel.sh     # Vercel 部署脚本
├── deploy/                  # 部署配置
│   ├── Dockerfile           # Docker 多阶段构建
│   ├── docker-compose.yml   # Docker Compose 编排
│   ├── nginx.conf           # Nginx SPA 配置
│   └── deploy.sh            # 统一部署入口脚本
├── .dockerignore            # Docker 忽略规则
└── BACKUP_README.md         # 本文件
```

## 快速开始

### 方式一：本地开发

```bash
cd source
npm ci                  # 安装依赖（使用 lock 文件确保一致）
npm run dev             # 启动开发服务器 → http://localhost:5173
```

### 方式二：构建并预览

```bash
cd source
npm ci
npm run build           # 构建到 dist/
npm run preview         # 预览构建产物
```

### 方式三：Docker 一键部署

```bash
# 构建镜像并启动
docker compose -f deploy/docker-compose.yml up -d

# 访问 http://localhost
```

### 方式四：使用部署脚本

```bash
# 静态文件构建
./deploy/deploy.sh --static

# Docker 部署
./deploy/deploy.sh --docker

# Vercel 部署
./deploy/deploy.sh --vercel

# 腾讯云部署
./deploy/deploy.sh --tencent
```

### 方式五：直接使用预构建产物

`source/dist/` 目录已包含最新构建产物，可直接：
- 上传到 Nginx / Apache 等 Web 服务器
- 上传到 CDN 或对象存储（腾讯云 COS / 阿里云 OSS）
- 部署到宝塔面板的站点目录

## 技术栈

| 技术 | 版本 |
|------|------|
| React | 19.2 |
| TypeScript | 5.9 |
| Vite | 7.3 |
| Tailwind CSS | 4.2 |
| Node.js (推荐) | >= 22.x |

## 环境变量

复制 `source/.env.example` 为 `source/.env.local` 并填入实际值：

| 变量 | 说明 | 必填 |
|------|------|------|
| VITE_ADMIN_TOKEN | 管理员令牌 | 否 |
| VITE_API_BASE | API 地址 | 否 |
| VITE_OPENAI_API_KEY | OpenAI API Key | 否 |
| VITE_MINIMAX_API_KEY | MiniMax API Key | 否 |

## 注意事项

1. **node_modules 未包含在备份中** — 请通过 `npm ci` 安装（package-lock.json 确保版本一致）
2. **dist/ 已包含预构建产物** — 如无需修改代码，可直接使用
3. **邀请码** — 系统固定邀请码为 `***REDACTED***`
4. **跨设备传输** — 使用配套的 .tar.gz 压缩包传输
