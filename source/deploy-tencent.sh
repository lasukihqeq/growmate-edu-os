#!/bin/bash
# ================================================================
# 荒野科学测评 - 腾讯云部署脚本
# 方式: rsync over SSH -> BT Panel Nginx
# Web root: /www/wwwroot/assessment.hykx.com.cn
#
# Required environment variables:
#   DEPLOY_HOST  - Target server IP or hostname (e.g. 81.69.231.105)
#   DEPLOY_USER  - SSH user for deployment (default: root)
# ================================================================

set -e

# ===== 配置区域 =====
SERVER_IP="${DEPLOY_HOST:-localhost}"
SERVER_USER="${DEPLOY_USER:-root}"
SERVER_PATH="/www/wwwroot/assessment.hykx.com.cn"
SSH_KEY="$HOME/.ssh/growmate_deploy"
DIST_DIR="./dist"
# ===================

echo "========================================"
echo "  荒野科学测评 - 腾讯云生产环境部署"
echo "  目标: ${SERVER_IP}"
echo "  域名: assessment.hykx.com.cn"
echo "  路径: ${SERVER_PATH}"
echo "========================================"
echo ""

# 1. 检查 SSH 密钥
if [ ! -f "$SSH_KEY" ]; then
    echo "错误: SSH 密钥不存在: $SSH_KEY"
    echo "请确保 growmate_deploy 密钥已放置在 ~/.ssh/ 目录下"
    exit 1
fi

# 2. 构建
if [ "$1" != "--skip-build" ]; then
    echo "[1/4] 构建项目..."
    npm run build
    echo ""
else
    echo "[1/4] 跳过构建 (--skip-build)"
    echo ""
fi

# 3. 检查 dist
if [ ! -d "$DIST_DIR" ] || [ ! -f "$DIST_DIR/index.html" ]; then
    echo "错误: dist 目录不存在或缺少 index.html"
    exit 1
fi

FILE_COUNT=$(find "$DIST_DIR" -type f | wc -l | tr -d ' ')
echo "[2/4] dist 目录就绪 ($FILE_COUNT 个文件)"
echo ""

# 4. 部署
echo "[3/4] 上传到服务器..."
rsync -avz --delete \
    -e "ssh -i $SSH_KEY" \
    "$DIST_DIR/" \
    "${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/"

# 5. 验证
echo ""
echo "[4/4] 验证部署..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://assessment.hykx.com.cn/" 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
    echo "验证通过 (HTTP $HTTP_STATUS)"
else
    echo "警告: HTTP 状态码 $HTTP_STATUS，请手动检查"
fi

echo ""
echo "========================================"
echo "  部署完成!"
echo "  https://assessment.hykx.com.cn"
echo "========================================"
