/**
 * 部署验证面板组件
 * 提供双通道部署状态验证功能
 */

import { useState } from 'react'
import {
  validateChannel,
  validateAllChannels,
  validateDualChannelSync,
  generateDeploymentReport,
  DEPLOYMENT_CONFIGS,
  type DeploymentValidationResult,
  type DualChannelSyncResult,
} from '../../lib/deploymentValidator'

export function DeploymentValidatorPanel() {
  const [isValidating, setIsValidating] = useState(false)
  const [singleResult, setSingleResult] = useState<DeploymentValidationResult | null>(null)
  const [dualResult, setDualResult] = useState<DualChannelSyncResult | null>(null)
  const [report, setReport] = useState<string>('')

  const handleValidateChannel = async (channel: 'tencent-nginx' | 'vercel') => {
    setIsValidating(true)
    setSingleResult(null)
    try {
      const result = await validateChannel(channel)
      setSingleResult(result)
    } catch (error) {
      console.error('验证失败:', error)
    } finally {
      setIsValidating(false)
    }
  }

  const handleValidateAll = async () => {
    setIsValidating(true)
    setDualResult(null)
    setReport('')
    try {
      const result = await validateDualChannelSync()
      setDualResult(result)

      const allResults = await validateAllChannels()
      setReport(generateDeploymentReport(allResults))
    } catch (error) {
      console.error('验证失败:', error)
    } finally {
      setIsValidating(false)
    }
  }

  const tencentConfig = DEPLOYMENT_CONFIGS['tencent-nginx']
  const vercelConfig = DEPLOYMENT_CONFIGS['vercel']

  return (
    <div className="space-y-6">
      {/* 部署配置信息 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* 腾讯云Nginx配置 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🇨🇳</span>
            <div>
              <h3 className="font-bold text-gray-900">大陆通道</h3>
              <p className="text-sm text-gray-500">腾讯云Nginx服务器</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">服务器</span>
              <span className="text-gray-800 font-mono text-xs">{tencentConfig.serverIp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">域名</span>
              <span className="text-gray-800">{tencentConfig.domain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">部署方式</span>
              <span className="text-gray-800 font-mono text-xs">rsync + SSH</span>
            </div>
          </div>
          <button
            onClick={() => handleValidateChannel('tencent-nginx')}
            disabled={isValidating}
            className="mt-4 w-full py-2 px-4 bg-[#3B5FD9] hover:bg-[#2A4CC0] disabled:bg-teal-300
                       text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isValidating ? (
              <>
                <span className="animate-spin">⏳</span>
                验证中...
              </>
            ) : (
              <>🔍 验证通道</>
            )}
          </button>
        </div>

        {/* Vercel配置 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🌍</span>
            <div>
              <h3 className="font-bold text-gray-900">海外通道</h3>
              <p className="text-sm text-gray-500">Vercel边缘网络</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">域名</span>
              <span className="text-gray-800">{vercelConfig.domain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">构建命令</span>
              <span className="text-gray-800 font-mono text-xs">{vercelConfig.buildCommand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">输出目录</span>
              <span className="text-gray-800 font-mono text-xs">{vercelConfig.outputDir}</span>
            </div>
          </div>
          <button
            onClick={() => handleValidateChannel('vercel')}
            disabled={isValidating}
            className="mt-4 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300
                       text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isValidating ? (
              <>
                <span className="animate-spin">⏳</span>
                验证中...
              </>
            ) : (
              <>🔍 验证通道</>
            )}
          </button>
        </div>
      </div>

      {/* 双通道同步验证 */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">双通道同步验证</h3>
            <p className="text-sm text-white/80 mt-1">同时验证两个部署通道的可用性</p>
          </div>
          <button
            onClick={handleValidateAll}
            disabled={isValidating}
            className="px-6 py-3 bg-white text-[#2A4CC0] font-semibold rounded-xl
                       hover:bg-gray-100 disabled:bg-gray-200 transition-colors
                       flex items-center gap-2"
          >
            {isValidating ? (
              <>
                <span className="animate-spin">⏳</span>
                验证中...
              </>
            ) : (
              <>🚀 开始验证</>
            )}
          </button>
        </div>
      </div>

      {/* 单通道验证结果 */}
      {singleResult && (
        <div className={`rounded-2xl p-5 ${
          singleResult.success
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <h3 className={`font-bold mb-3 ${
            singleResult.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {singleResult.channel === 'tencent-nginx' ? '🇨🇳 大陆通道' : '🌍 海外通道'} 验证结果
          </h3>
          <div className="space-y-2">
            {singleResult.checks.map((check, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span>{check.passed ? '✅' : '❌'}</span>
                <div>
                  <span className="font-medium text-gray-800">{check.name}</span>
                  <span className="text-gray-600 ml-2">{check.message}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-600">
            验证时间: {new Date(singleResult.timestamp).toLocaleString('zh-CN')}
          </p>
        </div>
      )}

      {/* 双通道验证结果 */}
      {dualResult && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-5 ${
            dualResult.bothChannelsDeployed
              ? 'bg-green-50 border border-green-200'
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <h3 className={`font-bold text-lg mb-2 ${
              dualResult.bothChannelsDeployed ? 'text-green-800' : 'text-amber-800'
            }`}>
              {dualResult.bothChannelsDeployed ? '✅ 双通道部署正常' : '⚠️ 部分通道异常'}
            </h3>
            <p className="text-gray-700">{dualResult.recommendation}</p>
          </div>

          {/* 各通道详情 */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: 'tencent', label: '🇨🇳 大陆通道', result: dualResult.channels.tencent },
              { key: 'vercel', label: '🌍 海外通道', result: dualResult.channels.vercel },
            ].map(({ key, label, result }) => (
              <div key={key} className={`rounded-xl p-4 ${
                result.success ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <h4 className="font-medium text-gray-800 mb-2">{label}</h4>
                <div className="space-y-1">
                  {result.checks.map((check, idx) => (
                    <div key={idx} className="text-sm flex items-center gap-2">
                      <span>{check.passed ? '✓' : '✗'}</span>
                      <span className="text-gray-600">{check.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 部署报告 */}
      {report && (
        <div className="bg-gray-900 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-3">📋 部署验证报告</h3>
          <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap overflow-auto max-h-64">
            {report}
          </pre>
        </div>
      )}

      {/* 部署命令参考 */}
      <div className="bg-gray-50 rounded-2xl p-5">
        <h3 className="font-bold text-gray-800 mb-4">📖 部署命令参考</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">腾讯云Nginx部署</h4>
            <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`# 构建项目
npm run build

# 使用部署脚本
./deploy-tencent.sh

# 或手动 rsync
rsync -avz --delete -e "ssh -i ~/.ssh/growmate_deploy" \\
  ./dist/ root@81.69.231.105:/www/wwwroot/assessment.hykx.com.cn/`}
            </pre>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Vercel部署</h4>
            <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`# 构建项目
npm run build

# 生产部署
vercel --prod

# 预览部署
vercel`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
