import { useState, useEffect } from 'react'
import { getMigrationStatus, migrateLocalData } from '../../lib/api'

export function DataMigration() {
  const [status, setStatus] = useState({ total: 0, synced: 0, pending: 0 })
  const [migrating, setMigrating] = useState(false)
  const [result, setResult] = useState<{ migrated: number; failed: number } | null>(null)

  useEffect(() => {
    refreshStatus()
  }, [])

  const refreshStatus = () => {
    setStatus(getMigrationStatus())
  }

  const handleMigrate = async () => {
    setMigrating(true)
    setResult(null)
    try {
      const res = await migrateLocalData()
      setResult(res)
      refreshStatus()
    } catch (err) {
      console.error('Migration failed:', err)
    } finally {
      setMigrating(false)
    }
  }

  const progress = status.total > 0 ? Math.round((status.synced / status.total) * 100) : 100

  if (status.total === 0) {
    return null
  }

  return (
    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">☁️</span>
        <h3 className="text-base font-bold text-amber-800">本地数据迁移</h3>
      </div>
      <p className="text-sm text-amber-700 mb-4">
        检测到浏览器中存有历史测评数据，建议迁移至云端以确保数据安全
      </p>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-amber-800 mb-1">
          <span>同步进度</span>
          <span className="font-medium">{status.synced} / {status.total} 条</span>
        </div>
        <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {status.pending > 0 && (
        <div className="bg-amber-100 border border-amber-300 rounded-xl p-3 mb-4 flex items-center gap-2">
          <span className="text-amber-600">⚠️</span>
          <span className="text-sm text-amber-800">
            有 <strong>{status.pending}</strong> 条数据待迁移到云端服务器
          </span>
        </div>
      )}

      {result && (
        <div className={`rounded-xl p-3 mb-4 flex items-center gap-2 ${
          result.failed === 0 
            ? 'bg-green-100 border border-green-300' 
            : 'bg-red-100 border border-red-300'
        }`}>
          <span>{result.failed === 0 ? '✅' : '❌'}</span>
          <span className={`text-sm ${result.failed === 0 ? 'text-green-800' : 'text-red-800'}`}>
            迁移完成：成功 {result.migrated} 条
            {result.failed > 0 && `，失败 ${result.failed} 条`}
          </span>
        </div>
      )}

      {status.pending > 0 && (
        <button
          onClick={handleMigrate}
          disabled={migrating}
          className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 
                     text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {migrating ? (
            <>
              <span className="animate-spin">⏳</span>
              迁移中...
            </>
          ) : (
            <>
              <span>☁️</span>
              开始迁移 ({status.pending} 条)
            </>
          )}
        </button>
      )}

      {status.pending === 0 && status.total > 0 && (
        <div className="flex items-center justify-center gap-2 py-2 text-sm text-green-600">
          <span>✅</span>
          所有本地数据已同步完成
        </div>
      )}
    </div>
  )
}
