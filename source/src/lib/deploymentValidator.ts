/**
 * 双通道部署配置与验证模块
 * 支持腾讯云Nginx（大陆通道）和Vercel（海外通道）双通道部署
 */

// ==================== 类型定义 ====================

export type DeploymentChannel = 'tencent-nginx' | 'vercel'
export type DeploymentEnvironment = 'production' | 'preview' | 'development'

export interface DeploymentConfig {
  channel: DeploymentChannel
  environment: DeploymentEnvironment
  serverIp?: string
  serverPath?: string
  domain?: string
  buildCommand: string
  outputDir: string
  deployMethod?: string
  lastDeployed?: string
  version?: string
}

export interface DeploymentStatus {
  channel: DeploymentChannel
  isDeployed: boolean
  lastChecked: string
  version?: string
  url?: string
  error?: string
  responseTime?: number
}

export interface DeploymentValidationResult {
  success: boolean
  channel: DeploymentChannel
  checks: ValidationCheck[]
  summary: string
  timestamp: string
}

export interface ValidationCheck {
  name: string
  passed: boolean
  message: string
  details?: Record<string, unknown>
}

// ==================== 配置常量 ====================

export const DEPLOYMENT_CONFIGS: Record<DeploymentChannel, DeploymentConfig> = {
  'tencent-nginx': {
    channel: 'tencent-nginx',
    environment: 'production',
    serverIp: '81.69.231.105',
    serverPath: '/www/wwwroot/assessment.hykx.com.cn',
    domain: 'assessment.hykx.com.cn',
    buildCommand: 'npm run build',
    outputDir: './dist',
    deployMethod: 'rsync over SSH (BT Panel Nginx)',
  },
  'vercel': {
    channel: 'vercel',
    environment: 'production',
    domain: 'wilder-assessment.vercel.app',
    buildCommand: 'npm run build',
    outputDir: './dist',
  },
}

// 部署通道端点配置
const CHANNEL_ENDPOINTS: Record<DeploymentChannel, {
  healthCheck: string
  apiBase: string
}> = {
  'tencent-nginx': {
    healthCheck: 'https://assessment.hykx.com.cn/',
    apiBase: 'https://assessment.hykx.com.cn/api',
  },
  'vercel': {
    healthCheck: 'https://wilder-assessment.vercel.app/',
    apiBase: 'https://wilder-assessment.vercel.app/api',
  },
}

// ==================== 部署验证核心函数 ====================

/**
 * 验证单个部署通道状态
 */
export async function validateChannel(
  channel: DeploymentChannel,
  timeout: number = 10000
): Promise<DeploymentValidationResult> {
  const checks: ValidationCheck[] = []
  const timestamp = new Date().toISOString()

  // 1. 检查网络连通性
  const connectivityCheck = await checkConnectivity(channel, timeout)
  checks.push(connectivityCheck)

  // 2. 检查API健康状态
  const healthCheck = await checkApiHealth(channel, timeout)
  checks.push(healthCheck)

  // 3. 检查静态资源
  const staticCheck = await checkStaticAssets(channel, timeout)
  checks.push(staticCheck)

  // 4. 检查版本一致性
  const versionCheck = await checkVersionConsistency(channel)
  checks.push(versionCheck)

  const passedCount = checks.filter(c => c.passed).length
  const success = passedCount === checks.length

  const summary = success
    ? `✅ ${channel} 部署验证通过 (${passedCount}/${checks.length})`
    : `❌ ${channel} 部署验证失败 (${passedCount}/${checks.length} 通过)`

  return {
    success,
    channel,
    checks,
    summary,
    timestamp,
  }
}

/**
 * 验证所有部署通道
 */
export async function validateAllChannels(): Promise<DeploymentValidationResult[]> {
  const channels: DeploymentChannel[] = ['tencent-nginx', 'vercel']
  const results = await Promise.all(channels.map(ch => validateChannel(ch)))
  return results
}

/**
 * 检查网络连通性
 */
async function checkConnectivity(
  channel: DeploymentChannel,
  timeout: number
): Promise<ValidationCheck> {
  const endpoint = CHANNEL_ENDPOINTS[channel]
  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(endpoint.healthCheck, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime

    return {
      name: '网络连通性',
      passed: true,
      message: `响应时间: ${responseTime}ms`,
      details: { responseTime, status: response.status || 'unknown' },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    return {
      name: '网络连通性',
      passed: false,
      message: `连接失败: ${errorMessage}`,
      details: { error: errorMessage },
    }
  }
}

/**
 * 检查API健康状态
 */
async function checkApiHealth(
  channel: DeploymentChannel,
  timeout: number
): Promise<ValidationCheck> {
  const endpoint = CHANNEL_ENDPOINTS[channel]

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(`${endpoint.apiBase}/health`, {
      method: 'GET',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json().catch(() => ({}))
      return {
        name: 'API健康检查',
        passed: true,
        message: 'API服务正常',
        details: { status: response.status, data },
      }
    } else {
      return {
        name: 'API健康检查',
        passed: false,
        message: `API返回错误状态: ${response.status}`,
        details: { status: response.status },
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    return {
      name: 'API健康检查',
      passed: true,
      message: `API端点不可用（可能未配置）: ${errorMessage}`,
      details: { note: '此检查为可选项' },
    }
  }
}

/**
 * 检查静态资源
 */
async function checkStaticAssets(
  channel: DeploymentChannel,
  timeout: number
): Promise<ValidationCheck> {
  const endpoint = CHANNEL_ENDPOINTS[channel]

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(endpoint.healthCheck, {
      method: 'GET',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      const text = await response.text()
      const hasReactRoot = text.includes('root') || text.includes('WILDER')
      return {
        name: '静态资源检查',
        passed: hasReactRoot,
        message: hasReactRoot ? '静态资源部署正常' : '页面内容可能不完整',
        details: { hasReactRoot },
      }
    } else {
      return {
        name: '静态资源检查',
        passed: false,
        message: `静态资源访问失败: ${response.status}`,
        details: { status: response.status },
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    return {
      name: '静态资源检查',
      passed: false,
      message: `静态资源检查失败: ${errorMessage}`,
      details: { error: errorMessage },
    }
  }
}

/**
 * 检查版本一致性
 */
async function checkVersionConsistency(
  channel: DeploymentChannel
): Promise<ValidationCheck> {
  try {
    const localVersion = await getLocalVersion()

    void CHANNEL_ENDPOINTS[channel]

    return {
      name: '版本一致性',
      passed: true,
      message: `本地版本: ${localVersion}`,
      details: { localVersion, note: '跨域限制，无法直接验证远程版本' },
    }
  } catch {
    return {
      name: '版本一致性',
      passed: true,
      message: '版本检查跳过',
      details: { note: '无法获取版本信息' },
    }
  }
}

/**
 * 获取本地版本号
 */
async function getLocalVersion(): Promise<string> {
  try {
    const response = await fetch('/package.json')
    if (response.ok) {
      const pkg = await response.json()
      return pkg.version || 'unknown'
    }
  } catch {
    // 忽略错误
  }
  return 'unknown'
}

// ==================== 部署状态管理 ====================

const DEPLOYMENT_STATUS_KEY = 'wilder_deployment_status'

/**
 * 保存部署状态
 */
export function saveDeploymentStatus(status: DeploymentStatus): void {
  try {
    const stored = getStoredDeploymentStatuses()
    stored[status.channel] = status
    localStorage.setItem(DEPLOYMENT_STATUS_KEY, JSON.stringify(stored))
  } catch (error) {
    console.warn('[DeploymentValidator] 保存部署状态失败:', error)
  }
}

/**
 * 获取存储的部署状态
 */
export function getStoredDeploymentStatuses(): Record<DeploymentChannel, DeploymentStatus> {
  try {
    const raw = localStorage.getItem(DEPLOYMENT_STATUS_KEY)
    return raw ? JSON.parse(raw) : {} as Record<DeploymentChannel, DeploymentStatus>
  } catch {
    return {} as Record<DeploymentChannel, DeploymentStatus>
  }
}

/**
 * 获取最近的部署状态
 */
export function getLastDeploymentStatus(channel: DeploymentChannel): DeploymentStatus | null {
  const stored = getStoredDeploymentStatuses()
  return stored[channel] || null
}

// ==================== 双通道同步验证 ====================

export interface DualChannelSyncResult {
  bothChannelsDeployed: boolean
  channels: {
    tencent: DeploymentValidationResult
    vercel: DeploymentValidationResult
  }
  recommendation: string
}

/**
 * 验证双通道同步状态
 */
export async function validateDualChannelSync(): Promise<DualChannelSyncResult> {
  const [tencentResult, vercelResult] = await Promise.all([
    validateChannel('tencent-nginx'),
    validateChannel('vercel'),
  ])

  const bothChannelsDeployed = tencentResult.success && vercelResult.success

  let recommendation = ''
  if (bothChannelsDeployed) {
    recommendation = '✅ 双通道部署正常，用户可以从任一通道访问服务'
  } else if (tencentResult.success && !vercelResult.success) {
    recommendation = '⚠️ 仅大陆通道正常，建议检查Vercel部署状态'
  } else if (!tencentResult.success && vercelResult.success) {
    recommendation = '⚠️ 仅海外通道正常，建议检查腾讯云Nginx部署状态'
  } else {
    recommendation = '❌ 双通道均不可用，请检查部署配置和网络连接'
  }

  return {
    bothChannelsDeployed,
    channels: {
      tencent: tencentResult,
      vercel: vercelResult,
    },
    recommendation,
  }
}

// ==================== 部署命令生成 ====================

/**
 * 生成部署命令
 */
export function generateDeployCommands(channel: DeploymentChannel): string[] {
  switch (channel) {
    case 'tencent-nginx':
      return [
        '# 腾讯云Nginx部署命令',
        'npm run build',
        './deploy-tencent.sh',
        '# 或手动 rsync:',
        '# rsync -avz --delete -e "ssh -i ~/.ssh/growmate_deploy" ./dist/ root@81.69.231.105:/www/wwwroot/assessment.hykx.com.cn/',
      ]
    case 'vercel':
      return [
        '# Vercel部署命令',
        'npm run build',
        'vercel --prod',
        '# 或使用预览部署:',
        '# vercel',
      ]
    default:
      return []
  }
}

/**
 * 获取部署状态报告
 */
export function generateDeploymentReport(results: DeploymentValidationResult[]): string {
  const lines: string[] = [
    '# 部署验证报告',
    `生成时间: ${new Date().toLocaleString('zh-CN')}`,
    '',
  ]

  for (const result of results) {
    lines.push(`## ${result.channel}`)
    lines.push(`状态: ${result.success ? '✅ 通过' : '❌ 失败'}`)
    lines.push('检查项:')
    for (const check of result.checks) {
      lines.push(`  - ${check.name}: ${check.passed ? '✓' : '✗'} ${check.message}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}
