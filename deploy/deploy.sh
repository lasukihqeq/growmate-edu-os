#!/bin/bash
# ============================================
# GrowMate EDU:OS - 快速部署脚本
# 支持三种部署方式：Docker / 静态文件 / Vercel
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SOURCE_DIR="${ROOT_DIR}/source"
DIST_DIR="${SOURCE_DIR}/dist"

echo "╔══════════════════════════════════════════╗"
echo "║  GrowMate EDU:OS 部署工具                  ║"
echo "║  版本: v2026.04.06                         ║"
echo "╚══════════════════════════════════════════╝"
echo ""

show_help() {
    echo "用法: ./deploy.sh [选项]"
    echo ""
    echo "选项:"
    echo "  --docker        使用 Docker 构建并部署"
    echo "  --static        仅构建静态文件（输出到 source/dist）"
    echo "  --vercel        部署到 Vercel"
    echo "  --tencent       部署到腾讯云服务器"
    echo "  --skip-build    跳过构建步骤（使用现有 dist）"
    echo "  --help          显示帮助信息"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh --static              # 构建静态文件"
    echo "  ./deploy.sh --docker              # Docker 部署"
    echo "  ./deploy.sh --tencent --skip-build # 跳过构建直接上传"
}

# 安装依赖
install_deps() {
    echo "[Step] 检查并安装依赖..."
    cd "$SOURCE_DIR"
    if [ ! -d "node_modules" ]; then
        echo "  安装 npm 依赖..."
        npm ci --no-audit --no-fund
    else
        echo "  依赖已存在，跳过安装"
    fi
}

# 构建
build_project() {
    echo "[Step] 构建项目..."
    cd "$SOURCE_DIR"
    npm run build
    
    if [ ! -f "${DIST_DIR}/index.html" ]; then
        echo "错误: 构建失败，dist/index.html 不存在"
        exit 1
    fi
    
    FILE_COUNT=$(find "$DIST_DIR" -type f | wc -l | tr -d ' ')
    DIST_SIZE=$(du -sh "$DIST_DIR" | cut -f1)
    echo "  构建完成: ${FILE_COUNT} 个文件, 大小 ${DIST_SIZE}"
}

# Docker 部署
deploy_docker() {
    echo "[Step] Docker 构建..."
    cd "$ROOT_DIR"
    docker build -f deploy/Dockerfile -t growmate-edu-os:latest .
    echo ""
    echo "Docker 镜像构建完成！"
    echo "  启动: docker compose -f deploy/docker-compose.yml up -d"
    echo "  访问: http://localhost"
}

# 静态文件构建
deploy_static() {
    install_deps
    build_project
    echo ""
    echo "静态文件已生成！"
    echo "  路径: ${DIST_DIR}"
    echo "  可直接上传至任何静态托管服务（Nginx/CDN/对象存储）"
}

# Vercel 部署
deploy_vercel() {
    echo "[Step] 部署到 Vercel..."
    cd "$SOURCE_DIR"
    if ! command -v vercel &> /dev/null; then
        echo "  安装 Vercel CLI..."
        npm i -g vercel
    fi
    vercel --prod
}

# 腾讯云部署
deploy_tencent() {
    if [ -f "${SOURCE_DIR}/deploy-tencent.sh" ]; then
        cd "$SOURCE_DIR"
        bash deploy-tencent.sh "$@"
    else
        echo "错误: deploy-tencent.sh 不存在"
        exit 1
    fi
}

# 参数解析
SKIP_BUILD=false
DEPLOY_MODE=""

for arg in "$@"; do
    case $arg in
        --docker)   DEPLOY_MODE="docker" ;;
        --static)   DEPLOY_MODE="static" ;;
        --vercel)   DEPLOY_MODE="vercel" ;;
        --tencent)  DEPLOY_MODE="tencent" ;;
        --skip-build) SKIP_BUILD=true ;;
        --help)     show_help; exit 0 ;;
        *)          echo "未知参数: $arg"; show_help; exit 1 ;;
    esac
done

if [ -z "$DEPLOY_MODE" ]; then
    show_help
    exit 0
fi

case $DEPLOY_MODE in
    docker)
        if [ "$SKIP_BUILD" = true ]; then
            echo "跳过构建，使用现有 Docker 镜像"
            echo "  启动: docker compose -f deploy/docker-compose.yml up -d"
            echo "  访问: http://localhost:8080"
        else
            deploy_docker
        fi
        ;;
    static)
        if [ "$SKIP_BUILD" = false ]; then
            deploy_static
        else
            echo "跳过构建，使用现有 dist 目录"
        fi
        ;;
    vercel)
        deploy_vercel
        ;;
    tencent)
        if [ "$SKIP_BUILD" = false ]; then
            install_deps
            build_project
        fi
        deploy_tencent
        ;;
esac

echo ""
echo "完成！"
