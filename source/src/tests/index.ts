/**
 * 测试运行入口
 * 统一管理所有测试用例
 */

import runDeploymentTests from './deploymentValidator.test'
import runBackupTests from './backupManager.test'

export interface TestSuiteResult {
  suite: string
  total: number
  passed: number
  failed: number
  duration: number
}

/**
 * 运行所有测试套件
 */
export async function runAllTests(): Promise<{
  suites: TestSuiteResult[]
  totalPassed: number
  totalFailed: number
  summary: string
}> {
  console.log('🧪 ========================================')
  console.log('🧪   GROWMATE科创教育入学测评 - 测试套件运行')
  console.log('🧪 ========================================\n')

  const suites: TestSuiteResult[] = []

  // 运行部署验证测试
  console.log('📦 运行部署验证测试...\n')
  const deployStart = Date.now()
  const deployResult = await runDeploymentTests()
  suites.push({
    suite: '双通道部署验证',
    total: deployResult.total,
    passed: deployResult.passed,
    failed: deployResult.failed,
    duration: Date.now() - deployStart,
  })

  console.log('\n')

  // 运行备份管理测试
  console.log('📦 运行备份管理测试...\n')
  const backupStart = Date.now()
  const backupResult = await runBackupTests()
  suites.push({
    suite: '备份管理功能',
    total: backupResult.total,
    passed: backupResult.passed,
    failed: backupResult.failed,
    duration: Date.now() - backupStart,
  })

  const totalPassed = suites.reduce((sum, s) => sum + s.passed, 0)
  const totalFailed = suites.reduce((sum, s) => sum + s.failed, 0)

  const summary = `
📊 ========================================
📊   测试结果汇总
📊 ========================================

${suites.map(s => `
${s.suite}:
  - 总计: ${s.total} 个测试
  - 通过: ${s.passed} 个 ✅
  - 失败: ${s.failed} 个 ${s.failed > 0 ? '❌' : ''}
  - 耗时: ${s.duration}ms
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
总计: ${totalPassed + totalFailed} 个测试
通过: ${totalPassed} 个 ✅
失败: ${totalFailed} 个 ${totalFailed > 0 ? '❌' : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${totalFailed === 0 ? '🎉 所有测试通过！' : '⚠️ 存在失败的测试，请检查详情。'}
`

  console.log(summary)

  return {
    suites,
    totalPassed,
    totalFailed,
    summary,
  }
}

// 浏览器端测试入口
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).runAllTests = runAllTests
  ;(window as unknown as Record<string, unknown>).runDeploymentTests = runDeploymentTests
  ;(window as unknown as Record<string, unknown>).runBackupTests = runBackupTests

  console.log('💡 提示: 在浏览器控制台运行以下命令执行测试:')
  console.log('   - runAllTests()        运行所有测试')
  console.log('   - runDeploymentTests() 运行部署验证测试')
  console.log('   - runBackupTests()     运行备份管理测试')
}

export { runDeploymentTests, runBackupTests }
export default runAllTests
