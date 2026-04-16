/**
 * 令牌管理面板 - 一次性邀请码和专业版令牌管理
 */
import { useState, useEffect } from 'react'
import {
  generateTokenBatch, getTokenStats, exportAvailableTokens,
  getAllOneTimeTokens, getTokenBatches, clearAllOneTimeTokens,
  type TokenBatch, type OneTimeToken
} from '../../lib/tokenManager'

export function TokenManagement() {
  const [stats, setStats] = useState({ invite: { total: 0, used: 0, available: 0 }, pro: { total: 0, used: 0, available: 0 } })
  const [batches, setBatches] = useState<TokenBatch[]>([])
  const [showTokens, setShowTokens] = useState<'invite' | 'pro' | null>(null)
  const [tokens, setTokens] = useState<Array<{ token: string; isValid: boolean; usedAt?: string }>>([])
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const loadData = () => {
    setStats(getTokenStats())
    setBatches(getTokenBatches())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleGenerate = (type: 'invite' | 'pro', count: number) => {
    if (!confirm(`确定生成 ${count} 个${type === 'invite' ? '邀请码' : '专业版令牌'}？`)) return
    generateTokenBatch(type, count)
    loadData()
  }

  const handleExport = (type: 'invite' | 'pro') => {
    const available = exportAvailableTokens(type)
    const text = available.join('\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${type === 'invite' ? '邀请码' : '专业版令牌'}_${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
  }

  const handleShowTokens = (type: 'invite' | 'pro') => {
    const all = getAllOneTimeTokens()
    const filtered = all.filter((t: OneTimeToken) => t.type === type).map((t: OneTimeToken) => ({
      token: t.token,
      isValid: t.isValid,
      usedAt: t.usedAt,
    }))
    setTokens(filtered)
    setShowTokens(type)
  }

  const handleCopyToken = async (token: string) => {
    await navigator.clipboard.writeText(token)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 1500)
  }

  const handleClearAll = () => {
    if (!confirm('⚠️ 确定清除所有一次性令牌？此操作不可恢复！\n\n（原有固定邀请码和专业版令牌不受影响）')) return
    clearAllOneTimeTokens()
    loadData()
    setShowTokens(null)
    setTokens([])
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 邀请码统计 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">🎫 一次性邀请码</h3>
            <span className="text-xs text-gray-400">用于进入测评系统</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2A4CC0]">{stats.invite.total}</div>
              <div className="text-xs text-gray-500 mt-1">总数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.invite.available}</div>
              <div className="text-xs text-gray-500 mt-1">可用</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-400">{stats.invite.used}</div>
              <div className="text-xs text-gray-500 mt-1">已用</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleGenerate('invite', 100)}
              className="flex-1 py-2 text-sm font-medium text-white bg-[#2A4CC0] rounded-lg hover:bg-teal-700 transition-colors">
              生成 100 个
            </button>
            <button onClick={() => handleGenerate('invite', 500)}
              className="flex-1 py-2 text-sm font-medium text-white bg-[#2A4CC0] rounded-lg hover:bg-teal-700 transition-colors">
              生成 500 个
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleExport('invite')}
              className="flex-1 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
              导出可用
            </button>
            <button onClick={() => handleShowTokens('invite')}
              className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              查看全部
            </button>
          </div>
        </div>

        {/* 专业版令牌统计 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">🔑 一次性专业版令牌</h3>
            <span className="text-xs text-gray-400">用于解锁专业版报告</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{stats.pro.total}</div>
              <div className="text-xs text-gray-500 mt-1">总数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.pro.available}</div>
              <div className="text-xs text-gray-500 mt-1">可用</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-400">{stats.pro.used}</div>
              <div className="text-xs text-gray-500 mt-1">已用</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleGenerate('pro', 100)}
              className="flex-1 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
              生成 100 个
            </button>
            <button onClick={() => handleGenerate('pro', 500)}
              className="flex-1 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
              生成 500 个
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleExport('pro')}
              className="flex-1 py-2 text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
              导出可用
            </button>
            <button onClick={() => handleShowTokens('pro')}
              className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              查看全部
            </button>
          </div>
        </div>
      </div>

      {/* 固定令牌说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">原有固定令牌保持不变</p>
            <p className="text-blue-600">固定邀请码: <code className="bg-blue-100 px-1.5 py-0.5 rounded">由环境变量 VITE_FIXED_INVITE_CODE 配置</code></p>
            <p className="text-blue-600 mt-1">固定专业版令牌: <code className="bg-blue-100 px-1.5 py-0.5 rounded">WILDER PRO</code></p>
            <p className="text-xs text-blue-500 mt-2">以上固定令牌可重复使用，不受一次性令牌机制影响。</p>
          </div>
        </div>
      </div>

      {/* 批次记录 */}
      {batches.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📦 生成批次记录</h3>
          <div className="space-y-2">
            {batches.slice(-10).reverse().map(batch => (
              <div key={batch.batchId} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    batch.type === 'invite' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {batch.type === 'invite' ? '邀请码' : '专业版'}
                  </span>
                  <span className="text-sm text-gray-600">{batch.count} 个</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(batch.createdAt).toLocaleString('zh-CN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 令牌列表弹窗 */}
      {showTokens && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {showTokens === 'invite' ? '🎫 邀请码列表' : '🔑 专业版令牌列表'}
              </h3>
              <button onClick={() => setShowTokens(null)}
                className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-1">
                {tokens.map((t, i) => (
                  <div key={i} className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                    t.isValid ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <code className={`font-mono text-sm ${t.isValid ? 'text-green-700' : 'text-gray-400 line-through'}`}>
                        {t.token}
                      </code>
                      {t.isValid && (
                        <button onClick={() => handleCopyToken(t.token)}
                          className="text-xs text-gray-400 hover:text-gray-600">
                          {copiedToken === t.token ? '✓' : '📋'}
                        </button>
                      )}
                    </div>
                    <div className="text-xs">
                      {t.isValid ? (
                        <span className="text-green-600">可用</span>
                      ) : (
                        <span className="text-gray-400">
                          已用 · {t.usedAt ? new Date(t.usedAt).toLocaleString('zh-CN') : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-between">
              <button onClick={handleClearAll}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                清除所有一次性令牌
              </button>
              <button onClick={() => setShowTokens(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
