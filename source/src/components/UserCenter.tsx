import { useState, useEffect } from 'react'
import { ArrowLeft, FileText, Calendar, User, ChevronRight, Search, Trash2, AlertCircle, Award } from 'lucide-react'
import { WilderLogoHero } from './ui/WilderLogo'
import type { DynamicReportData } from '../lib/reportContentGenerator'

interface UserCenterProps {
  onBack: () => void
  onViewReport: (reportData: DynamicReportData) => void
}

interface SavedReport {
  id: string
  studentInfo: {
    name: string
    age: number
    grade: string
    school?: string
    testDate?: string
  }
  talentType: string
  profileCode: string
  createdAt: string
  reportData: DynamicReportData
}

export function UserCenter({ onBack, onViewReport }: UserCenterProps) {
  const [reports, setReports] = useState<SavedReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      // 从 localStorage 加载本地报告
      const localData = localStorage.getItem('wilder_assessments')
      const localReports: SavedReport[] = localData ? JSON.parse(localData) : []

      // 按创建时间排序（最新的在前）
      localReports.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      setReports(localReports)
    } catch (error) {
      console.error('加载报告失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    const updated = reports.filter(r => r.id !== id)
    setReports(updated)
    localStorage.setItem('wilder_assessments', JSON.stringify(updated))
    setDeleteConfirm(null)
  }

  const filteredReports = reports.filter(report =>
    report.studentInfo.name.includes(searchTerm) ||
    report.talentType.includes(searchTerm)
  )

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[rgba(10,10,26,0.06)] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-[rgba(59,95,217,0.06)] rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[rgba(10,10,26,0.6)]" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-[#0A0A1A]">科创入学测评报告</h1>
              <p className="text-xs text-[rgba(10,10,26,0.5)]">共 {reports.length} 份报告</p>
            </div>
            <WilderLogoHero variant="blue" size="sm" />
          </div>
        </div>
      </header>

      {/* Search */}
      {reports.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(10,10,26,0.35)]" />
            <input
              type="text"
              placeholder="搜索姓名或类型..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(10,10,26,0.06)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-500/20 focus:border-brand-blue-500"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-brand-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[rgba(10,10,26,0.5)] text-sm">加载中...</p>
          </div>
        ) : reports.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-[rgba(59,95,217,0.06)] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[rgba(10,10,26,0.35)]" />
            </div>
            <h3 className="text-lg font-bold text-[rgba(10,10,26,0.7)] mb-2">暂无测评报告</h3>
            <p className="text-[rgba(10,10,26,0.5)] text-sm mb-6">
              完成测评后，您的报告将保存在这里
            </p>
            <button
              onClick={onBack}
              className="px-6 py-2.5 bg-brand-blue-500 text-white font-medium rounded-xl hover:bg-brand-blue-600 transition-colors"
            >
              开始测评
            </button>
          </div>
        ) : (
          /* Report List */
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-[rgba(10,10,26,0.06)] overflow-hidden hover:shadow-md transition-shadow"
              >
                {deleteConfirm === report.id ? (
                  /* Delete Confirmation */
                  <div className="p-4 bg-red-50">
                    <div className="flex items-center gap-2 text-red-600 mb-3">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">确定删除此报告？</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="flex-1 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                      >
                        确认删除
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 py-2 bg-white border border-[rgba(10,10,26,0.06)] text-[rgba(10,10,26,0.6)] text-sm font-medium rounded-lg hover:bg-[rgba(59,95,217,0.04)] transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Report Card */
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => onViewReport(report.reportData)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {report.studentInfo.name.charAt(0)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[#0A0A1A] truncate">
                            {report.studentInfo.name}
                          </h3>
                          <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                            {report.studentInfo.grade}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[rgba(10,10,26,0.5)] mb-2">
                          <span className="flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {report.talentType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(report.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[rgba(10,10,26,0.35)]">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {report.studentInfo.age}岁
                          </span>
                          {report.studentInfo.school && (
                            <>
                              <span>·</span>
                              <span className="truncate max-w-[120px]">
                                {report.studentInfo.school}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteConfirm(report.id)
                          }}
                          className="p-2 text-[rgba(10,10,26,0.35)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-5 h-5 text-[rgba(10,10,26,0.35)]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredReports.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <p className="text-[rgba(10,10,26,0.5)] text-sm">
                  未找到包含 "{searchTerm}" 的报告
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        {reports.length > 0 && (
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-700">
                <p className="font-medium mb-1">数据存储说明</p>
                <p>报告数据存储在当前浏览器中，清除浏览器数据可能导致报告丢失。建议截图保存重要报告。</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
