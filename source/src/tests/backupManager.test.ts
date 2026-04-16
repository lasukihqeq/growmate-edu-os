/**
 * 备份管理功能测试用例
 * 测试跨设备备份和恢复功能
 */

import {
  createFullBackup,
  exportBackup,
  importBackup,
  validateBackupFile,
  getStorageUsage,
  formatStorageSize,
  getBackupSummary,
  type FullBackupData as _FullBackupData,
} from '../lib/backupManager'

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
// ==================== 测试用例 ====================

/**
 * 测试备份创建
 */
async function testBackupCreation(): Promise<void> {
  await test('备份创建 - 创建完整备份', () => {
    const backup = createFullBackup()
    return !!(
      backup.metadata &&
      backup.metadata.version &&
      backup.metadata.createdAt &&
      backup.metadata.deviceId &&
      Array.isArray(backup.assessments)
    )
  })

  await test('备份创建 - 元数据完整', () => {
    const backup = createFullBackup()
    return !!(
      backup.metadata.version &&
      backup.metadata.createdAt &&
      backup.metadata.deviceId &&
      backup.metadata.deviceName &&
      backup.metadata.appName === 'GROWMATE科创教育入学测评'
    )
  })

  await test('备份创建 - 包含校验和', () => {
    const backup = createFullBackup()
    return typeof backup.metadata.checksum === 'string'
  })
}

/**
 * 测试备份验证
 */
async function testBackupValidation(): Promise<void> {
  await test('备份验证 - 有效数据验证通过', () => {
    const backup = createFullBackup()
    const result = validateBackupFile(backup)
    return result.valid === true
  })

  await test('备份验证 - 无效数据验证失败', () => {
    const result = validateBackupFile(null)
    return result.valid === false
  })

  await test('备份验证 - 缺少元数据验证失败', () => {
    const result = validateBackupFile({ assessments: [] })
    return result.valid === false
  })

  await test('备份验证 - 元数据不完整验证失败', () => {
    const result = validateBackupFile({
      metadata: { version: '1.0.0' },
      assessments: [],
    })
    return result.valid === false
  })
}

/**
 * 测试导出功能
 */
async function testExportFunctionality(): Promise<void> {
  await test('导出功能 - 导出返回正确结构', async () => {
    const result = await exportBackup({ saveToDesktop: false })
    return typeof result.success === 'boolean' && typeof result.filename === 'string'
  })

  await test('导出功能 - 生成正确文件名', async () => {
    const result = await exportBackup({
      filename: 'test-backup.json',
      saveToDesktop: false,
    })
    return result.filename === 'test-backup.json'
  })
}

/**
 * 测试存储信息
 */
async function testStorageInfo(): Promise<void> {
  await test('存储信息 - 获取存储使用情况', () => {
    const usage = getStorageUsage()
    return (
      typeof usage.used === 'number' &&
      typeof usage.total === 'number' &&
      typeof usage.breakdown === 'object'
    )
  })

  await test('存储信息 - 格式化存储大小', () => {
    const bytes = 1024
    const formatted = formatStorageSize(bytes)
    return formatted.includes('KB')
  })

  await test('存储信息 - 格式化MB大小', () => {
    const bytes = 1024 * 1024
    const formatted = formatStorageSize(bytes)
    return formatted.includes('MB')
  })
}

/**
 * 测试备份摘要
 */
async function testBackupSummary(): Promise<void> {
  await test('备份摘要 - 生成摘要字符串', () => {
    const backup = createFullBackup()
    const summary = getBackupSummary(backup)
    return (
      summary.includes('备份信息') &&
      summary.includes('版本') &&
      summary.includes('创建时间')
    )
  })

  await test('备份摘要 - 包含数据统计', () => {
    const backup = createFullBackup()
    const summary = getBackupSummary(backup)
    return summary.includes('测评记录')
  })
}

/**
 * 测试导入验证
 */
async function testImportValidation(): Promise<void> {
  await test('导入验证 - 空文件验证失败', async () => {
    const emptyFile = new File([''], 'empty.json', { type: 'application/json' })
    try {
      await importBackup(emptyFile)
      return false // 应该抛出错误
    } catch {
      return true
    }
  })

  await test('导入验证 - 无效JSON验证失败', async () => {
    const invalidFile = new File(['not json'], 'invalid.json', { type: 'application/json' })
    try {
      await importBackup(invalidFile)
      return false
    } catch {
      return true
    }
  })
}

// ==================== 运行所有测试 ====================

export async function runBackupTests(): Promise<{
  total: number
  passed: number
  failed: number
  results: TestResult[]
  summary: string
}> {
  console.log('🧪 开始运行备份管理测试...\n')

  // 清空之前的测试结果
  testResults.length = 0

  // 运行所有测试
  await testBackupCreation()
  await testBackupValidation()
  await testExportFunctionality()
  await testStorageInfo()
  await testBackupSummary()
  await testImportValidation()

  // 统计结果
  const total = testResults.length
  const passed = testResults.filter(r => r.passed).length
  const failed = total - passed

  // 生成摘要
  const summary = `
📊 备份管理测试结果摘要
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
  ;(window as unknown as Record<string, unknown>).runBackupTests = runBackupTests
}

// 导出测试运行函数
export default runBackupTests
