/**
 * 双通道部署验证测试用例
 * 测试部署验证逻辑的各个功能模块
 */

import {
  validateChannel,
  validateAllChannels,
  validateDualChannelSync,
  generateDeployCommands,
  generateDeploymentReport,
  saveDeploymentStatus,
  getStoredDeploymentStatuses,
  getLastDeploymentStatus,
  DEPLOYMENT_CONFIGS,
  type DeploymentChannel,
  type DeploymentValidationResult as _DeploymentValidationResult,
} from '../lib/deploymentValidator'

// ==================== 测试工具函数 ====================

interface TestResult {
  name: string
  passed: boolean
  message: string
  duration: number
}

const testResults: TestResult[] = []

function test(name: string, fn: () => Promise<boolean> | boolean): Promise<void> {
  return Promise.resolve().then(async () => {
    const startTime = Date.now()
    try {
      const passed = await fn()
      const duration = Date.now() - startTime
      testResults.push({
        name,
        passed,
        message: passed ? '通过' : '失败',
        duration,
      })
    } catch (error) {
      const duration = Date.now() - startTime
      testResults.push({
        name,
        passed: false,
        message: error instanceof Error ? error.message : '未知错误',
        duration,
      })
    }
  })
}

// ==================== 测试用例 ====================

/**
 * 测试配置完整性
 */
async function testConfigCompleteness(): Promise<void> {
  await test('部署配置 - 腾讯云Nginx配置完整', () => {
    const config = DEPLOYMENT_CONFIGS['tencent-nginx']
    return !!(
      config.channel &&
      config.buildCommand &&
      config.outputDir &&
      config.serverIp
    )
  })

  await test('部署配置 - Vercel配置完整', () => {
    const config = DEPLOYMENT_CONFIGS['vercel']
    return !!(
      config.channel &&
      config.buildCommand &&
      config.outputDir &&
      config.domain
    )
  })
}

/**
 * 测试部署状态存储
 */
async function testDeploymentStatusStorage(): Promise<void> {
  await test('部署状态 - 保存和读取', () => {
    const testStatus = {
      channel: 'vercel' as DeploymentChannel,
      isDeployed: true,
      lastChecked: new Date().toISOString(),
      url: 'https://test.vercel.app',
    }

    saveDeploymentStatus(testStatus)

    const stored = getStoredDeploymentStatuses()
    return stored['vercel']?.url === testStatus.url
  })

  await test('部署状态 - 获取单个通道状态', () => {
    const status = getLastDeploymentStatus('vercel')
    return status !== null && status.channel === 'vercel'
  })
}

/**
 * 测试部署命令生成
 */
async function testDeployCommandsGeneration(): Promise<void> {
  await test('部署命令 - 腾讯云Nginx命令生成', () => {
    const commands = generateDeployCommands('tencent-nginx')
    return commands.length > 0 && commands.some((c: string) => c.includes('deploy-tencent'))
  })

  await test('部署命令 - Vercel命令生成', () => {
    const commands = generateDeployCommands('vercel')
    return commands.length > 0 && commands.some((c: string) => c.includes('vercel'))
  })
}

/**
 * 测试部署验证逻辑（模拟测试）
 */
async function testValidationLogic(): Promise<void> {
  await test('部署验证 - 验证结果结构正确', async () => {
    // 使用较短超时进行快速测试
    const result = await validateChannel('vercel', 5000)

    return (
      typeof result.success === 'boolean' &&
      typeof result.channel === 'string' &&
      Array.isArray(result.checks) &&
      typeof result.summary === 'string' &&
      typeof result.timestamp === 'string'
    )
  })

  await test('部署验证 - 检查项结构正确', async () => {
    const result = await validateChannel('vercel', 5000)

    if (result.checks.length === 0) return false

    const check = result.checks[0]
    return (
      typeof check.name === 'string' &&
      typeof check.passed === 'boolean' &&
      typeof check.message === 'string'
    )
  })
}

/**
 * 测试双通道同步验证
 */
async function testDualChannelSync(): Promise<void> {
  await test('双通道同步 - 返回结果结构正确', async () => {
    const result = await validateDualChannelSync()

    return (
      typeof result.bothChannelsDeployed === 'boolean' &&
      result.channels.tencent.channel === 'tencent-nginx' &&
      result.channels.vercel.channel === 'vercel' &&
      typeof result.recommendation === 'string'
    )
  })
}

/**
 * 测试所有通道验证
 */
async function testAllChannelsValidation(): Promise<void> {
  await test('所有通道验证 - 返回两个通道结果', async () => {
    const results = await validateAllChannels()
    return results.length === 2
  })

  await test('所有通道验证 - 包含两个通道', async () => {
    const results = await validateAllChannels()
    const channels = results.map((r: { channel: string }) => r.channel)
    return channels.includes('tencent-nginx') && channels.includes('vercel')
  })
}

/**
 * 测试报告生成
 */
async function testReportGeneration(): Promise<void> {
  await test('报告生成 - 生成正确格式', async () => {
    const results = await validateAllChannels()
    const report = generateDeploymentReport(results)

    return (
      report.includes('部署验证报告') &&
      report.includes('tencent-nginx') &&
      report.includes('vercel')
    )
  })
}

// ==================== 运行所有测试 ====================

export async function runDeploymentTests(): Promise<{
  total: number
  passed: number
  failed: number
  results: TestResult[]
  summary: string
}> {
  console.log('🧪 开始运行双通道部署验证测试...\n')

  // 清空之前的测试结果
  testResults.length = 0

  // 运行所有测试
  await testConfigCompleteness()
  await testDeploymentStatusStorage()
  await testDeployCommandsGeneration()
  await testValidationLogic()
  await testDualChannelSync()
  await testAllChannelsValidation()
  await testReportGeneration()

  // 统计结果
  const total = testResults.length
  const passed = testResults.filter(r => r.passed).length
  const failed = total - passed

  // 生成摘要
  const summary = `
📊 测试结果摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
总计: ${total} 个测试
通过: ${passed} 个 ✅
失败: ${failed} 个 ${failed > 0 ? '❌' : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${testResults
  .map(r => `${r.passed ? '✅' : '❌'} ${r.name} (${r.duration}ms)`)
  .join('\n')}
`

  console.log(summary)

  return {
    total,
    passed,
    failed,
    results: [...testResults],
    summary,
  }
}

// ==================== 浏览器端测试入口 ====================

// 将测试函数挂载到window对象（开发模式）
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).runDeploymentTests = runDeploymentTests
}

// 导出测试运行函数
export default runDeploymentTests
