import { useState, useCallback } from 'react'
import { Download, FileJson, Loader2, CheckCircle2, X } from 'lucide-react'
import { getAssessments } from '../../lib/api'

interface ExportPanelProps {
  onClose?: () => void
}

type DateMode = 'day' | 'week' | 'range'

export function StudentExportPanel({ onClose }: ExportPanelProps) {
  const [dateMode, setDateMode] = useState<DateMode>('day')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()))
  const [rangeStart, setRangeStart] = useState(new Date().toISOString().split('T')[0])
  const [rangeEnd, setRangeEnd] = useState(new Date().toISOString().split('T')[0])
  const [exporting, setExporting] = useState(false)
  const [exportResult, setExportResult] = useState<{ count: number; filename: string } | null>(null)
  const [error, setError] = useState('')

  // 获取周起始日期
  function getWeekStart(date: Date): string {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    return d.toISOString().split('T')[0]
  }

  // 获取周结束日期
  function getWeekEnd(startDate: string): string {
    const d = new Date(startDate)
    d.setDate(d.getDate() + 6)
    return d.toISOString().split('T')[0]
  }

  // 计算日期范围
  const getDateRange = useCallback(() => {
    if (dateMode === 'day') {
      return { start: selectedDate, end: selectedDate }
    } else if (dateMode === 'week') {
      return { start: weekStart, end: getWeekEnd(weekStart) }
    } else {
      return { start: rangeStart, end: rangeEnd }
    }
  }, [dateMode, selectedDate, weekStart, rangeStart, rangeEnd])

  // 执行导出
  const handleExport = async () => {
    setExporting(true)
    setError('')
    setExportResult(null)

    try {
      const { start, end } = getDateRange()
      
      // 获取测评数据
      const response = await getAssessments({
        start_date: start,
        end_date: end,
        per_page: 1000,
      })

      const assessments = response.data || []

      if (assessments.length === 0) {
        setError('所选日期范围内没有学员数据')
        setExporting(false)
        return
      }

      // 构建导出数据
      const exportData = assessments.map((a: Record<string, unknown>) => ({
        id: a.id,
        student_name: a.student_name || (a.studentInfo as Record<string, unknown>)?.name,
        student_age: a.student_age || (a.studentInfo as Record<string, unknown>)?.age,
        parent_phone: a.parent_phone || (a.studentInfo as Record<string, unknown>)?.phone,
        grade: a.grade || (a.studentInfo as Record<string, unknown>)?.grade,
        talent_type: a.talent_type,
        profile_code: a.profile_code,
        scores: a.scores || a.assessmentScores,
        created_at: a.created_at || a.createdAt,
        test_date: a.test_date,
        duration_seconds: a.duration_seconds,
      }))

      // 生成JSON文件
      const filename = `wilder_students_${start}_${end}.json`
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      // 创建下载链接
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportResult({ count: assessments.length, filename })
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出失败，请重试')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-brand-blue-500 to-brand-blue-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <FileJson className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">学员数据导出</h3>
            <p className="text-white/70 text-xs">批量下载JSON格式数据</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* 日期模式选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">选择日期模式</label>
          <div className="flex gap-2">
            {[
              { key: 'day', label: '按日', icon: '📅' },
              { key: 'week', label: '按周', icon: '📆' },
              { key: 'range', label: '日期范围', icon: '📊' },
            ].map(mode => (
              <button
                key={mode.key}
                onClick={() => setDateMode(mode.key as DateMode)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all text-sm font-medium ${
                  dateMode === mode.key
                    ? 'border-brand-blue-500 bg-brand-blue-50 text-brand-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span className="mr-1.5">{mode.icon}</span>
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* 日期选择器 */}
        <div className="bg-gray-50 rounded-xl p-4">
          {dateMode === 'day' && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">选择日期</label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-500/20 outline-none"
              />
            </div>
          )}

          {dateMode === 'week' && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">选择周（周一至周日）</label>
              <input
                type="date"
                value={weekStart}
                onChange={e => setWeekStart(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-500/20 outline-none"
              />
              <p className="text-xs text-gray-400 mt-2">
                导出范围：{weekStart} 至 {getWeekEnd(weekStart)}
              </p>
            </div>
          )}

          {dateMode === 'range' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">开始日期</label>
                <input
                  type="date"
                  value={rangeStart}
                  onChange={e => setRangeStart(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-500/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">结束日期</label>
                <input
                  type="date"
                  value={rangeEnd}
                  onChange={e => setRangeEnd(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue-500 focus:ring-2 focus:ring-brand-blue-500/20 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* 成功提示 */}
        {exportResult && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-green-800">
                成功导出 {exportResult.count} 条学员数据
              </p>
              <p className="text-xs text-green-600">文件：{exportResult.filename}</p>
            </div>
          </div>
        )}

        {/* 导出按钮 */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full py-4 bg-gradient-to-r from-brand-blue-500 to-brand-blue-600 text-white font-bold rounded-xl shadow-lg shadow-brand-blue-500/30 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {exporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              正在导出...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              导出JSON数据
            </>
          )}
        </button>

        {/* 说明 */}
        <div className="text-xs text-gray-400 text-center">
          数据将以JSON格式下载，包含学员基本信息、测评分数、潜能画像等
        </div>
      </div>
    </div>
  )
}

export default StudentExportPanel
