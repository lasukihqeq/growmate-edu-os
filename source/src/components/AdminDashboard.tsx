import { useState, useEffect, useCallback } from 'react'
import {
  verifyAdmin, setAdminToken, getStats, getAssessments,
  deleteAssessment, getExportUrl, getAssessmentDetail
} from '../lib/api'
import { SalesStrategyPanel } from './SalesStrategyPanel'
import { Profile30Panel } from './Profile30Panel'
import { DataMigration } from './admin/DataMigration'
import { GrowthArchive } from './admin/GrowthArchive'
import { StatsReport } from './admin/StatsReport'
import { CRMBoard } from './admin/CRMBoard'
import { ReminderPanel } from './admin/ReminderPanel'
import { RevenueAnalytics } from './admin/RevenueAnalytics'
import { TokenManagement } from './admin/TokenManagement'
import { BackupManagerPanel } from './admin/BackupManager'
import { DeploymentValidatorPanel } from './admin/DeploymentValidator'
import { identifyProfile30, PROFILES_BY_ID } from '../lib/profile30System'
import { ReportPage } from './ReportPage'
import type { DynamicReportData } from '../lib/reportContentGenerator'
import type { InterestClass } from '../types'
import { getDurationLabel, getSatisfactionLabel, getCategoryById } from '../lib/interestCategories'

interface Props {
  onBack: () => void
}

interface StatsData {
  total: number; today: number; this_week: number; this_month: number
  avg_scores: Record<string, number>
  talent_distribution: { talent_type: string; count: number }[]
  age_distribution: { student_age: number; count: number }[]
  daily_counts: { date: string; count: number }[]
}

interface AssessmentRow {
  id: number; student_name: string; student_age: number; student_grade: string
  parent_phone: string; parent_name: string
  student_school: string; interest_classes: string
  structured_interests?: InterestClass[] | null
  score_w: number; score_i: number; score_l: number
  score_d: number; score_e: number; score_r: number
  profile_code: string; talent_type: string
  duration_seconds: number; created_at: string; status: string
}

interface ListResponse {
  total: number; page: number; per_page: number; total_pages: number
  data: AssessmentRow[]
}

const WILDER_LABELS: Record<string, string> = {
  W: '好奇心', I: '探究力', L: '联结力', D: '设计力', E: '表达力', R: '反思力'
}

export function AdminDashboard({ onBack }: Props) {
  const [authed, setAuthed] = useState(false)
  const [tokenInput, setTokenInput] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<'overview' | 'list' | 'growth' | 'crm' | 'sales' | 'revenue' | 'stats' | 'tokens' | 'backup' | 'deploy'>('overview')
  const [stats, setStats] = useState<StatsData | null>(null)
  const [list, setList] = useState<ListResponse | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [showDetailSales, setShowDetailSales] = useState(false)

  // 增强功能状态
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [filterTalent, setFilterTalent] = useState('')
  const [phoneMasked, setPhoneMasked] = useState(true)
  const [contactStatus, setContactStatus] = useState<Record<number, string>>({})

  const maskPhone = (phone: string) => {
    if (!phone || !phoneMasked) return phone || '-'
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (!list) return
    if (selectedIds.size === list.data.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(list.data.map(r => r.id)))
  }

  const updateContactStatus = (id: number, status: string) => {
    setContactStatus(prev => ({ ...prev, [id]: status }))
  }

  const exportSelected = () => {
    if (!list || selectedIds.size === 0) return
    const rows = list.data.filter(r => selectedIds.has(r.id))
    const csv = [
      ['姓名','年龄','年级','学校','家长电话','潜能类型','W','I','L','D','E','R','画像代码','兴趣班','跟进状态','测评时间'].join(','),
      ...rows.map(r => [
        r.student_name, r.student_age, r.student_grade, r.student_school || '',
        r.parent_phone, r.talent_type,
        r.score_w, r.score_i, r.score_l, r.score_d, r.score_e, r.score_r,
        r.profile_code, `"${(r.interest_classes || '').replace(/"/g, '""')}"`,
        contactStatus[r.id] || '未联系',
        new Date(r.created_at).toLocaleString('zh-CN'),
      ].join(','))
    ].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'GROWMATE_批量导出_' + new Date().toISOString().slice(0,10) + '.csv'
    a.click()
  }

  const handleLogin = async () => {
    setAdminToken(tokenInput.trim())
    const ok = await verifyAdmin()

    if (ok) {
      setAuthed(true)
      setLoginError('')
    } else {
      setLoginError('令牌无效，请检查后重试')
    }
  }

  const loadStats = useCallback(async () => {
    try { setStats(await getStats()) } catch { /* */ }
  }, [])

  const loadList = useCallback(async () => {
    setLoading(true)
    try { setList(await getAssessments({ page, per_page: 15, search })) }
    catch { /* */ }
    finally { setLoading(false) }
  }, [page, search])

  useEffect(() => {
    if (authed && tab === 'overview') loadStats()
    if (authed && tab === 'list') loadList()
  }, [authed, tab, loadStats, loadList])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确定删除 ${name} 的测评记录？此操作不可恢复。`)) return
    await deleteAssessment(id)
    loadList()
  }

  const handleExportJson = () => {
    if (!detail) return
    const name = (detail.student_name as string) || '未知'
    const date = new Date().toISOString().slice(0, 10)
    const blob = new Blob([JSON.stringify(detail, null, 2)], { type: 'application/json;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `WILDER_${name}_${date}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const handleViewDetail = async (id: number) => {
    try {
      const data = await getAssessmentDetail(id)
      setDetail(data)
    } catch { /* */ }
  }

  // ==================== 登录页 ====================
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)' }}>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg, hsl(173 58% 39%), hsl(170 75% 41%))' }}>
              <span className="text-white">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">GROWMATE 管理后台</h1>
            <p className="text-gray-500 mt-1">请输入管理员令牌登录</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="请粘贴管理员令牌"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button onClick={handleLogin}
              className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, hsl(173 58% 39%), hsl(170 75% 41%))' }}>
              登 录
            </button>
            <button onClick={onBack}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">
              ← 返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==================== 详情弹窗 ====================
  if (detail) {
    const d = detail as unknown as AssessmentRow & { full_report?: Record<string, unknown> }
    const wilderScores: Record<string, number> = {
      W: d.score_w || 0, I: d.score_i || 0, L: d.score_l || 0,
      D: d.score_d || 0, E: d.score_e || 0, R: d.score_r || 0,
    }
    const profileResult = identifyProfile30(wilderScores as any)
    const matchedProfile = PROFILES_BY_ID[profileResult.profileId]

    return (
      <div className="min-h-screen bg-gray-50 p-6 print:bg-white print:p-0">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => { setDetail(null); setShowDetailSales(false) }}
            className="mb-4 px-4 py-2 text-sm bg-white rounded-lg shadow hover:shadow-md transition-all no-print">
            ← 返回列表
          </button>

          {showDetailSales ? (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {d.student_name} 的销售策略
                </h2>
                <button onClick={() => setShowDetailSales(false)}
                  className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors no-print">
                  ← 返回详情
                </button>
              </div>
              <SalesStrategyPanel initialScores={wilderScores} studentName={d.student_name} studentAge={d.student_age} />
            </div>
          ) : d.full_report ? (
            // 有完整报告数据时，直接渲染完整报告页面（管理员模式）
            <div>
              <div className="flex gap-3 mb-3 no-print">
                <button onClick={handleExportJson}
                  className="px-4 py-2 text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 rounded-xl shadow transition-all flex items-center gap-2">
                  📦 导出 JSON
                </button>
              </div>
              <ReportPage onBack={() => setDetail(null)} reportData={d.full_report as unknown as DynamicReportData} isAdminMode={true} />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* 顶部操作区 */}
              <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 no-print">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="text-white">
                    <h2 className="text-xl font-bold">{d.student_name} 的测评报告</h2>
                    <p className="text-sm text-white/80 mt-1">科创教育入学测评 · 基础数据</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => window.print()}
                      className="px-5 py-2.5 text-sm font-semibold bg-white text-violet-700 hover:bg-violet-50 rounded-xl shadow-lg transition-all flex items-center gap-2">
                      🖨️ 打印当前页
                    </button>
                    <button onClick={handleExportJson}
                      className="px-5 py-2.5 text-sm font-semibold bg-white text-amber-700 hover:bg-amber-50 rounded-xl shadow-lg transition-all flex items-center gap-2">
                      📦 导出 JSON
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 无完整报告提示 */}
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-700">⚠️ 该测评记录暂无完整报告数据（可能是早期测评或数据未同步）</p>
              </div>

              {/* 匹配画像提示 */}
              {matchedProfile && (
                <div className="mb-6 p-4 rounded-2xl border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{matchedProfile.icon}</span>
                      <div>
                        <div className="font-bold text-teal-800">{matchedProfile.name}</div>
                        <div className="text-xs text-[#2A4CC0]">{matchedProfile.tagline}</div>
                      </div>
                    </div>
                    <button onClick={() => setShowDetailSales(true)}
                      className="px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                      style={{ background: 'linear-gradient(135deg, hsl(173 58% 39%), hsl(200 70% 45%))' }}>
                      查看销售策略 →
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                  ['姓名', d.student_name], ['年龄', `${d.student_age}岁`],
                  ['年级', d.student_grade], ['学校', d.student_school || '-'],
                  ['家长电话', d.parent_phone ? (phoneMasked ? maskPhone(d.parent_phone) : d.parent_phone) : '-'],
                  ['潜能类型', d.talent_type || '-'], ['画像代码', d.profile_code || '-'],
                  ['测评时间', new Date(d.created_at).toLocaleString('zh-CN')],
                  ['用时', d.duration_seconds ? `${Math.round(d.duration_seconds / 60)}分钟` : '-'],
                ].map(([label, value]) => (
                  <div key={String(label)} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500">{label}</div>
                    <div className="font-semibold text-gray-800 mt-0.5">{String(value)}</div>
                  </div>
                ))}
              </div>

              {/* 兴趣班信息 */}
              {(d.structured_interests?.length || d.interest_classes) && (
                <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="text-xs text-amber-600 font-medium mb-2">兴趣班情况</div>
                  {d.structured_interests && d.structured_interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {d.structured_interests.map((item: InterestClass, idx: number) => {
                        const cat = getCategoryById(item.category)
                        return (
                          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-sm text-amber-900">
                            <span>{cat?.emoji || '✨'}</span>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-xs text-amber-600">{getDurationLabel(item.duration)}</span>
                            <span className="text-xs">{getSatisfactionLabel(item.satisfaction)}</span>
                          </span>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-amber-900 whitespace-pre-wrap">{d.interest_classes}</div>
                  )}
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-800 mb-3">WILDER 六维度分数</h3>
              <div className="grid grid-cols-6 gap-3 mb-8">
                {Object.entries(WILDER_LABELS).map(([key, label]) => {
                  const score = (d as unknown as Record<string, unknown>)[`score_${key.toLowerCase()}`] as number || 0
                  return (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold" style={{ color: 'hsl(173 58% 39%)' }}>
                        {Math.round(score)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{key}-{label}</div>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${score}%`, background: 'linear-gradient(90deg, hsl(173 58% 39%), hsl(170 75% 41%))' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              {d.full_report ? (
                <div className="mt-6 border border-gray-200 rounded-2xl overflow-hidden">
                  <details className="group">
                    <summary className="cursor-pointer px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">📋 完整报告数据 (JSON)</span>
                      <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <pre className="p-4 bg-gray-900 text-green-400 text-xs overflow-auto max-h-96">
                      {JSON.stringify(d.full_report, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                  ⚠️ 完整报告数据暂不可用（可能是早期测评记录）
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ==================== 主界面 ====================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶栏 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm">← 首页</button>
            <span className="text-gray-200">|</span>
            <h1 className="text-lg font-bold text-gray-900">GROWMATE 管理后台</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href={getExportUrl('csv')} target="_blank" rel="noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
              导出 CSV
            </a>
            <a href={getExportUrl('json')} target="_blank" rel="noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              导出 JSON
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tab 切换 */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
          {(['overview', 'list', 'growth', 'crm', 'sales', 'revenue', 'stats', 'tokens', 'backup', 'deploy'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {t === 'overview' ? '📊 数据概览' : t === 'list' ? '📋 测评记录' : t === 'growth' ? '🌱 成长档案' : t === 'crm' ? '📱 客户跟进' : t === 'sales' ? '🎯 销售策略' : t === 'revenue' ? '💰 营收分析' : t === 'stats' ? '📈 统计报表' : t === 'tokens' ? '🎫 令牌管理' : t === 'backup' ? '📦 数据备份' : '🚀 部署验证'}
            </button>
          ))}
        </div>

        {/* ===== 概览 ===== */}
        {tab === 'overview' && stats && (
          <div className="space-y-6">
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '总测评数', value: stats.total, color: '#0d9488', icon: '📊' },
                { label: '今日', value: stats.today, color: '#f59e0b', icon: '📅' },
                { label: '本周', value: stats.this_week, color: '#3b82f6', icon: '📈' },
                { label: '本月', value: stats.this_month, color: '#8b5cf6', icon: '📆' },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-3xl font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">{item.label}</div>
                </div>
              ))}
            </div>

            {/* 数据迁移提示 */}
            <DataMigration />

            {/* WILDER 平均分 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">WILDER 六维度平均分</h3>
              <div className="grid grid-cols-6 gap-4">
                {Object.entries(WILDER_LABELS).map(([key, label]) => {
                  const score = stats.avg_scores[key] || 0
                  return (
                    <div key={key} className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(173 58% 39%)"
                            strokeWidth="3" strokeLinecap="round"
                            strokeDasharray={`${score * 0.94} 100`} />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
                          {Math.round(score)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{key}-{label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 潜能类型分布 & 年龄分布 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">探索者类型分布 TOP10</h3>
                {stats.talent_distribution.length === 0 ? (
                  <p className="text-gray-400 text-sm">暂无数据</p>
                ) : (
                  <div className="space-y-2">
                    {stats.talent_distribution.map((t, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-32 truncate">{t.talent_type}</span>
                        <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full text-xs text-white flex items-center justify-end pr-2 font-medium"
                            style={{
                              width: `${Math.max(20, (t.count / stats.total) * 100)}%`,
                              background: `hsl(${170 + i * 15} 60% ${40 + i * 3}%)`
                            }}>
                            {t.count}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">年龄分布</h3>
                {stats.age_distribution.length === 0 ? (
                  <p className="text-gray-400 text-sm">暂无数据</p>
                ) : (
                  <div className="flex items-end gap-2 h-40">
                    {stats.age_distribution.map((a, i) => {
                      const maxCount = Math.max(...stats.age_distribution.map(x => x.count))
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-xs font-medium text-gray-600">{a.count}</span>
                          <div className="w-full rounded-t-lg transition-all"
                            style={{
                              height: `${(a.count / maxCount) * 120}px`,
                              background: 'linear-gradient(180deg, hsl(173 58% 39%), hsl(170 75% 50%))'
                            }} />
                          <span className="text-xs text-gray-500">{a.student_age}岁</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== 记录列表 ===== */}
        {tab === 'list' && (
          <div className="space-y-4">
            {/* 搜索栏 + 筛选 */}
            <div className="flex flex-wrap gap-3 items-center">
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="搜索学生姓名、电话、潜能类型..."
                className="flex-1 min-w-[200px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <select value={filterTalent} onChange={e => setFilterTalent(e.target.value)}
                className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">全部类型</option>
                {(stats?.talent_distribution || []).map(t => (
                  <option key={t.talent_type} value={t.talent_type}>{t.talent_type} ({t.count})</option>
                ))}
              </select>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer bg-white border border-gray-200 px-3 py-2.5 rounded-xl">
                <input type="checkbox" checked={phoneMasked} onChange={e => setPhoneMasked(e.target.checked)} className="rounded" />
                隐私保护
              </label>
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#2A4CC0] font-medium">已选 {selectedIds.size} 条</span>
                  <button onClick={exportSelected} className="px-3 py-1.5 text-xs font-medium text-white bg-[#2A4CC0] rounded-lg hover:bg-teal-700">
                    导出所选
                  </button>
                  <button onClick={() => {
                    selectedIds.forEach(id => updateContactStatus(id, '已联系'))
                    setSelectedIds(new Set())
                  }} className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    标记已联系
                  </button>
                </div>
              )}
            </div>

            {/* 表格 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500">
                      <th className="px-2 py-3 text-center font-medium">
                        <input type="checkbox" checked={list ? selectedIds.size === list.data.length && list.data.length > 0 : false}
                          onChange={toggleSelectAll} className="rounded" />
                      </th>
                      <th className="px-4 py-3 text-left font-medium">学生</th>
                      <th className="px-4 py-3 text-left font-medium">学校</th>
                      <th className="px-4 py-3 text-left font-medium">家长电话</th>
                      <th className="px-4 py-3 text-left font-medium">潜能类型</th>
                      <th className="px-4 py-3 text-center font-medium">W</th>
                      <th className="px-4 py-3 text-center font-medium">I</th>
                      <th className="px-4 py-3 text-center font-medium">L</th>
                      <th className="px-4 py-3 text-center font-medium">D</th>
                      <th className="px-4 py-3 text-center font-medium">E</th>
                      <th className="px-4 py-3 text-center font-medium">R</th>
                      <th className="px-4 py-3 text-center font-medium">跟进</th>
                      <th className="px-4 py-3 text-left font-medium">时间</th>
                      <th className="px-4 py-3 text-center font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr><td colSpan={14} className="text-center py-12 text-gray-400">加载中...</td></tr>
                    ) : !list || list.data.length === 0 ? (
                      <tr><td colSpan={14} className="text-center py-12 text-gray-400">暂无测评记录</td></tr>
                    ) : list.data
                      .filter(row => !filterTalent || row.talent_type === filterTalent)
                      .map(row => {
                      const status = contactStatus[row.id] || '未联系'
                      const statusColors: Record<string, string> = {
                        '未联系': 'bg-gray-100 text-gray-600',
                        '已联系': 'bg-blue-100 text-blue-700',
                        '已转化': 'bg-green-100 text-green-700',
                        '暂缓': 'bg-amber-100 text-amber-700',
                      }
                      return (
                      <tr key={row.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.has(row.id) ? 'bg-teal-50/50' : ''}`}>
                        <td className="px-2 py-3 text-center">
                          <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} className="rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{row.student_name}</div>
                          <div className="text-xs text-gray-400">{row.student_age}岁 · {row.student_grade}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[120px]">
                          {row.student_school || <span className="text-gray-300">-</span>}
                        </td>
                        <td className="px-4 py-3">
                          {row.parent_phone ? (
                            <a href={`tel:${row.parent_phone}`} className="text-sm text-[#2A4CC0] hover:underline">
                              {maskPhone(row.parent_phone)}
                            </a>
                          ) : <span className="text-gray-300">-</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full"
                            style={{ background: 'hsl(173 58% 39% / 0.1)', color: 'hsl(173 58% 39%)' }}>
                            {row.talent_type || '-'}
                          </span>
                        </td>
                        {['w','i','l','d','e','r'].map(dim => (
                          <td key={dim} className="px-4 py-3 text-center text-gray-700 text-xs">
                            {Math.round((row as unknown as Record<string, number>)[`score_${dim}`] || 0)}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          <select value={status} onChange={e => updateContactStatus(row.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[status] || 'bg-gray-100'}`}>
                            <option value="未联系">未联系</option>
                            <option value="已联系">已联系</option>
                            <option value="已转化">已转化</option>
                            <option value="暂缓">暂缓</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(row.created_at).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => handleViewDetail(row.id)}
                              className="px-2 py-1 text-xs text-[#2A4CC0] hover:bg-teal-50 rounded-md transition-colors">
                              详情
                            </button>
                            <button onClick={() => handleDelete(row.id, row.student_name)}
                              className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded-md transition-colors">
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              {list && list.total_pages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">共 {list.total} 条记录</span>
                  <div className="flex gap-1">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                      className="px-3 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30">
                      上一页
                    </button>
                    <span className="px-3 py-1 text-xs text-gray-600">{page} / {list.total_pages}</span>
                    <button onClick={() => setPage(p => Math.min(list.total_pages, p + 1))} disabled={page >= list.total_pages}
                      className="px-3 py-1 text-xs rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30">
                      下一页
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== 成长档案 ===== */}
        {tab === 'growth' && (
          <GrowthArchive />
        )}

        {/* ===== 客户跟进 CRM ===== */}
        {tab === 'crm' && (
          <div className="space-y-6">
            <ReminderPanel />
            <CRMBoard />
          </div>
        )}

        {/* ===== 销售策略 ===== */}
        {tab === 'sales' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">孩子特点与销售策略</h2>
              <p className="text-sm text-gray-500 mt-1">基于WILDER六维度测评，30种核心学习画像的完整销售策略体系（含AI匹配、KPI指标、课程产品）</p>
            </div>
            <Profile30Panel />
          </div>
        )}

        {/* ===== 营收分析 ===== */}
        {tab === 'revenue' && (
          <RevenueAnalytics />
        )}

        {/* ===== 统计报表 ===== */}
        {tab === 'stats' && (
          <StatsReport />
        )}

        {/* ===== 令牌管理 ===== */}
        {tab === 'tokens' && (
          <TokenManagement />
        )}

        {/* ===== 数据备份 ===== */}
        {tab === 'backup' && (
          <BackupManagerPanel />
        )}

        {/* ===== 部署验证 ===== */}
        {tab === 'deploy' && (
          <DeploymentValidatorPanel />
        )}
      </div>
    </div>
  )
}
