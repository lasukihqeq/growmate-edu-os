#!/bin/bash
# ================================================================
# 荒野科学测评 - Vercel部署脚本
# 用于海外通道静态网站托管
# ================================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
PROJECT_NAME="wilder-assessment"
DIST_DIR="./dist"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  荒野科学测评 - Vercel 部署脚本${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# 检查Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 未检测到 Vercel CLI，正在安装...${NC}"
    npm install -g vercel
fi

# 检查是否已登录
echo -e "${BLUE}🔐 检查 Vercel 登录状态...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}请先登录 Vercel...${NC}"
    vercel login
fi

# 构建项目
echo -e "${BLUE}🏗️  构建项目...${NC}"
npm run build

# 检查构建产物
if [ ! -d "$DIST_DIR" ]; then
    echo -e "${RED}❌ 构建失败：未找到 dist 目录${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 构建完成${NC}"

# 部署选项
DEPLOY_TYPE=${1:-"preview"}

if [ "$DEPLOY_TYPE" = "prod" ] || [ "$DEPLOY_TYPE" = "production" ]; then
    echo -e "${BLUE}🚀 部署到生产环境...${NC}"
    DEPLOY_OUTPUT=$(vercel --prod --yes --json 2>/dev/null || vercel --prod --yes 2>&1)
else
    echo -e "${BLUE}🚀 部署到预览环境...${NC}"
    DEPLOY_OUTPUT=$(vercel --yes --json 2>/dev/null || vercel --yes 2>&1)
fi

# Extract URL: prefer --json output, fall back to grep
if echo "$DEPLOY_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('url',''))" 2>/dev/null | grep -q "vercel.app"; then
    DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('url',''))")
else
    DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -E "https://.*\.vercel\.app" | tail -1)
fi

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  ✅ 部署完成！${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

if [ -n "$DEPLOY_URL" ]; then
    echo -e "${BLUE}🌐 部署地址: ${DEPLOY_URL}${NC}"
fi

# 验证部署
echo ""
echo -e "${BLUE}🔍 验证部署状态...${NC}"
sleep 3  # 等待部署生效

if command -v curl &> /dev/null; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${DEPLOY_URL}" 2>/dev/null || echo "000")
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ 部署验证成功 (HTTP $HTTP_STATUS)${NC}"
    else
        echo -e "${YELLOW}⚠️ 部署验证返回 HTTP $HTTP_STATUS，请手动检查${NC}"
    fi
fi

echo ""
echo -e "${BLUE}📋 后续操作:${NC}"
echo "   1. 访问部署地址验证功能"
echo "   2. 检查 Vercel 控制台查看部署日志"
echo "   3. 配置自定义域名（如需要）"
echo ""
echo -e "${BLUE}🔗 常用命令:${NC}"
echo "   vercel list        # 查看所有部署"
echo "   vercel logs        # 查看日志"
echo "   vercel domains     # 管理域名"
echo "   vercel env         # 管理环境变量"
