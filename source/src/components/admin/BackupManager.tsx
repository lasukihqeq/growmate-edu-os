/**
 * 备份管理面板组件
 * 提供跨设备备份和恢复功能
 */

import { useState, useRef } from 'react'
import {
  exportBackup,
  importBackup,
  validateBackupFile,
  getBackupSummary,
  getStorageUsage,
  formatStorageSize,
  type FullBackupData,
  type BackupRestoreResult,
} from '../../lib/backupManager'

interface Props {
  onClose?: () => void
}

export function BackupManagerPanel({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'backup' | 'restore' | 'info'>('backup')
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [includeTokens, setIncludeTokens] = useState(false)
  const [includeDraft, setIncludeDraft] = useState(true)
  const [saveToDesktop, setSaveToDesktop] = useState(true)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [restoreResult, setRestoreResult] = useState<BackupRestoreResult | null>(null)
  const [previewData, setPreviewData] = useState<FullBackupData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const storageUsage = getStorageUsage()

  const handleExport = async () => {
    setIsExporting(true)
    setResult(null)

    try {
      const exportResult = await exportBackup({
        includeTokens,
        includeDraft,
        saveToDesktop,
      })

      setResult({
        success: exportResult.success,
        message: exportResult.success
          ? `✅ 备份已保存: ${exportResult.filename}`
          : `❌ 导出失败: ${exportResult.error}`,
      })
    } catch (error) {
      setResult({
        success: false,
        message: `❌ 导出失败: ${error instanceof Error ? error.message : '未知错误'}`,
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setPreviewData(null)
    setRestoreResult(null)

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      const validation = validateBackupFile(data)
      if (!validation.valid) {
        setResult({
          success: false,
          message: `❌ ${validation.error}`,
        })
        setIsImporting(false)
        return
      }

      setPreviewData(data as FullBackupData)
      setResult({
        success: true,
        message: `✅ 文件验证通过，请确认导入`,
      })
    } catch (error) {
      setResult({
        success: false,
        message: `❌ 文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`,
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleConfirmImport = async () => {
    if (!previewData || !fileInputRef.current?.files?.[0]) return

    setIsImporting(true)
    setRestoreResult(null)

    try {
      const result = await importBackup(fileInputRef.current.files[0])
      setRestoreResult(result)

      if (result.success) {
        setResult({
          success: true,
          message: `✅ 恢复成功！测评: ${result.restored.assessments} 条`,
        })
        setPreviewData(null)
      } else {
        setResult({
          success: false,
          message: `❌ 恢复失败: ${result.errors.join(', ')}`,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: `❌ 导入失败: ${error instanceof Error ? error.message : '未知错误'}`,
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 标题栏 */}
      <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">📦 数据备份管理</h2>
            <p className="text-sm text-white/80 mt-0.5">跨设备数据迁移与恢复</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex border-b border-gray-100">
        {[
          { key: 'backup', label: '📤 创建备份' },
          { key: 'restore', label: '📥 恢复数据' },
          { key: 'info', label: '📊 存储信息' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as 'backup' | 'restore' | 'info')
              setResult(null)
              setPreviewData(null)
              setRestoreResult(null)
            }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-[#2A4CC0] border-b-2 border-teal-500 bg-teal-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {/* 创建备份 */}
        {activeTab === 'backup' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-gray-800 mb-3">备份选项</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDraft}
                    onChange={(e) => setIncludeDraft(e.target.checked)}
                    className="w-4 h-4 text-[#3B5FD9] rounded"
                  />
                  <span className="text-sm text-gray-600">包含测评草稿</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTokens}
                    onChange={(e) => setIncludeTokens(e.target.checked)}
                    className="w-4 h-4 text-[#3B5FD9] rounded"
                  />
                  <span className="text-sm text-gray-600">包含邀请码/令牌数据</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveToDesktop}
                    onChange={(e) => setSaveToDesktop(e.target.checked)}
                    className="w-4 h-4 text-[#3B5FD9] rounded"
                  />
                  <span className="text-sm text-gray-600">保存到桌面（推荐）</span>
                </label>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-700">
                💡 提示：备份文件为JSON格式，可保存到任意位置。建议定期备份以防数据丢失。
              </p>
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-3 px-4 bg-[#3B5FD9] hover:bg-[#2A4CC0] disabled:bg-teal-300
                         text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  导出中...
                </>
              ) : (
                <>
                  <span>📤</span>
                  创建并下载备份
                </>
              )}
            </button>
          </div>
        )}

        {/* 恢复数据 */}
        {activeTab === 'restore' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
                id="backup-file-input"
              />
              <label
                htmlFor="backup-file-input"
                className="cursor-pointer block"
              >
                <div className="text-4xl mb-3">📁</div>
                <p className="text-gray-600 font-medium">点击选择备份文件</p>
                <p className="text-sm text-gray-400 mt-1">支持 .json 格式的备份文件</p>
              </label>
            </div>

            {previewData && (
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <h3 className="font-medium text-teal-800 mb-2">📋 备份预览</h3>
                <pre className="text-xs text-teal-700 whitespace-pre-wrap font-mono bg-white/50 p-3 rounded-lg">
                  {getBackupSummary(previewData)}
                </pre>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleConfirmImport}
                    disabled={isImporting}
                    className="flex-1 py-2 px-4 bg-[#3B5FD9] hover:bg-[#2A4CC0] disabled:bg-teal-300
                               text-white font-medium rounded-lg transition-colors"
                  >
                    {isImporting ? '导入中...' : '确认导入'}
                  </button>
                  <button
                    onClick={() => {
                      setPreviewData(null)
                      setResult(null)
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600
                               font-medium rounded-lg transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            {restoreResult && (
              <div
                className={`rounded-xl p-4 ${
                  restoreResult.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <h3 className={`font-medium mb-2 ${restoreResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {restoreResult.success ? '✅ 恢复结果' : '❌ 恢复失败'}
                </h3>
                <ul className="text-sm space-y-1">
                  <li>测评记录: {restoreResult.restored.assessments} 条</li>
                  <li>草稿: {restoreResult.restored.draft ? '已恢复' : '未恢复'}</li>
                  <li>令牌: {restoreResult.restored.tokens ? '已恢复' : '未恢复'}</li>
                  <li>设置: {restoreResult.restored.settings ? '已恢复' : '未恢复'}</li>
                  <li>用户信息: {restoreResult.restored.user ? '已恢复' : '未恢复'}</li>
                  <li>家长账号: {restoreResult.restored.parents} 个</li>
                </ul>
                {restoreResult.warnings.length > 0 && (
                  <div className="mt-2 text-sm text-amber-600">
                    ⚠️ {restoreResult.warnings.join('; ')}
                  </div>
                )}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                💡 提示：导入的数据会与现有数据合并，不会覆盖已有记录。
              </p>
            </div>
          </div>
        )}

        {/* 存储信息 */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-gray-800 mb-3">📊 存储使用情况</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">已使用</span>
                    <span className="font-medium text-gray-800">
                      {formatStorageSize(storageUsage.used)} / {formatStorageSize(storageUsage.total)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3B5FD9] rounded-full transition-all"
                      style={{ width: `${(storageUsage.used / storageUsage.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-gray-800 mb-3">📋 数据明细</h3>
              <div className="space-y-2">
                {Object.entries(storageUsage.breakdown).map(([key, size]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key}</span>
                    <span className="text-gray-800">{formatStorageSize(size)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-700">
                ⚠️ 注意：浏览器本地存储有容量限制，建议定期导出备份并清理旧数据。
              </p>
            </div>
          </div>
        )}

        {/* 结果提示 */}
        {result && (
          <div
            className={`mt-4 p-4 rounded-xl ${
              result.success
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {result.message}
          </div>
        )}
      </div>
    </div>
  )
}
