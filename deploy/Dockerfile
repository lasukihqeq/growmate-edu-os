# ============================================
# GrowMate EDU:OS - Docker 多阶段构建
# 适用于：腾讯云/阿里云/自建服务器部署
# ============================================

# --- 阶段1: 构建 ---
FROM node:22-alpine AS builder

WORKDIR /app

# 先复制依赖文件，利用 Docker 缓存层
COPY source/package.json source/package-lock.json ./
RUN npm ci --no-audit --no-fund

# 复制源码并构建
COPY source/ ./
RUN npm run build

# --- 阶段2: 生产 Nginx ---
FROM nginx:1.27-alpine AS production

# 复制自定义 Nginx 配置
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
