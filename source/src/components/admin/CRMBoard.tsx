import { useState, useEffect, useCallback } from 'react'
import { getStudents, updateStudent, getSalesMembers } from '../../lib/api'
import { SALES_FUNNEL_STAGES, PARENT_TYPES } from '../../lib/salesStrategies30'
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'

interface Student {
  id: string; student_name: string; student_age: number; parent_phone: string
  crm_stage: string; assigned_sales: string; profile_code: string; talent_type: string
  last_assessment_date: string; assessment_count: number; parent_type?: string
}

const CRM_STAGES = [
  { key: 'lead', label: '新线索', icon: '🆕', color: '#6b7280', funnelKey: 'awareness' },
  { key: 'contacted', label: '已联系', icon: '📞', color: '#3b82f6', funnelKey: 'interest' },
  { key: 'qualified', label: '已确认', icon: '✅', color: '#f59e0b', funnelKey: 'evaluation' },
  { key: 'trialed', label: '已试课', icon: '🎓', color: '#8b5cf6', funnelKey: 'decision' },
  { key: 'enrolled', label: '已报名', icon: '🎉', color: '#10b981', funnelKey: 'purchase' },
  { key: 'renewing', label: '续费中', icon: '🔄', color: '#ec4899', funnelKey: 'retention' },
]

export function CRMBoard() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [salesMembers, setSalesMembers] = useState<{ id: string; name: string }[]>([])
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board')
  const [expandedStageScript, setExpandedStageScript] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [studRes, salesRes] = await Promise.all([
        getStudents({ per_page: 200 }),
        getSalesMembers(true).catch(() => [])
      ])
      setStudents(studRes.data || [])
      setSalesMembers(Array.isArray(salesRes) ? salesRes : [])
    } catch { setStudents([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleStageChange = async (studentId: string, newStage: string) => {
    try {
      await updateStudent(studentId, { crm_stage: newStage })
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, crm_stage: newStage } : s))
    } catch (e) { console.error('更新阶段失败:', e) }
  }

  const handleAssignSales = async (studentId: string, salesName: string) => {
    try {
      await updateStudent(studentId, { assigned_sales: salesName })
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, assigned_sales: salesName } : s))
    } catch (e) { console.error('分配失败:', e) }
  }

  const grouped = CRM_STAGES.map(stage => ({
    ...stage,
    students: students.filter(s => (s.crm_stage || 'lead') === stage.key)
  }))

  if (loading) return <div className="text-center py-12 text-gray-400 animate-pulse">加载CRM数据...</div>

  return (
    <div className="space-y-4">
      {/* 顶部统计 + 视图切换 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {grouped.map(g => (
            <div key={g.key} className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }} />
              <span className="text-gray-600">{g.label}</span>
              <span className="font-bold" style={{ color: g.color }}>{g.students.length}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button onClick={() => setViewMode('board')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${viewMode === 'board' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
            看板
          </button>
          <button onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
            列表
          </button>
        </div>
      </div>

      {viewMode === 'board' ? (
        /* 看板视图 */
        <div className="grid grid-cols-6 gap-3" style={{ minHeight: 400 }}>
          {grouped.map(g => {
            const funnelStage = SALES_FUNNEL_STAGES[g.funnelKey]
            const isScriptExpanded = expandedStageScript === g.key
            return (
              <div key={g.key} className="bg-gray-50 rounded-xl p-3 flex flex-col">
                <div className="mb-3 pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{g.icon}</span>
                    <span className="text-sm font-bold text-gray-700">{g.label}</span>
                    <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: g.color }}>
                      {g.students.length}
                    </span>
                  </div>
                  {/* 话术提示按钮 */}
                  {funnelStage && (
                    <button
                      onClick={() => setExpandedStageScript(isScriptExpanded ? null : g.key)}
                      className="mt-2 w-full flex items-center justify-between px-2 py-1.5 bg-blue-50 rounded-lg text-xs text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        话术提示
                      </span>
                      {isScriptExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                  {/* 展开的话术提示 */}
                  {isScriptExpanded && funnelStage && (
                    <div className="mt-2 p-2 bg-white rounded-lg text-xs text-gray-600 space-y-2 border border-blue-100">
                      <p className="font-medium text-gray-700">{funnelStage.name}</p>
                      <div className="space-y-1">
                        {funnelStage.scripts.slice(0, 2).map((script, i) => (
                          <p key={i} className="text-[10px] leading-relaxed text-gray-500">• {script.slice(0, 80)}...</p>
                        ))}
                      </div>
                      <div className="pt-1 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400">⏱ {funnelStage.timeframe}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto max-h-[500px]">
                  {g.students.length === 0 ? (
                    <div className="text-center text-xs text-gray-300 py-6">暂无</div>
                  ) : g.students.map(s => (
                    <div key={s.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group">
                      <div className="flex items-start justify-between mb-1.5">
                        <span className="font-bold text-sm text-gray-800">{s.student_name}</span>
                        <span className="text-xs text-gray-400">{s.student_age}岁</span>
                      </div>
                      {s.talent_type && (
                        <div className="text-xs text-blue-600 bg-blue-50 rounded px-1.5 py-0.5 inline-block mb-1.5">
                          {s.talent_type}
                        </div>
                      )}
                      {/* 家长类型标签 */}
                      {s.parent_type && PARENT_TYPES[s.parent_type] && (
                        <div className="text-xs text-purple-600 bg-purple-50 rounded px-1.5 py-0.5 inline-block mb-1.5 ml-1">
                          {PARENT_TYPES[s.parent_type].name}
                        </div>
                      )}
                      {s.parent_phone && (
                        <div className="text-xs text-gray-400 mb-1.5">
                          📞 {s.parent_phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                        </div>
                      )}
                      {s.assigned_sales && (
                        <div className="text-xs text-amber-600">👤 {s.assigned_sales}</div>
                      )}
                      {/* 快速阶段切换 */}
                      <div className="mt-2 pt-2 border-t border-gray-50 hidden group-hover:flex gap-1 flex-wrap">
                        {CRM_STAGES.filter(st => st.key !== g.key).slice(0, 3).map(st => (
                          <button key={st.key} onClick={() => handleStageChange(s.id, st.key)}
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 hover:text-white transition-colors"
                            style={{ ['--hover-bg' as string]: st.color }}
                            onMouseEnter={e => (e.target as HTMLElement).style.background = st.color}
                            onMouseLeave={e => (e.target as HTMLElement).style.background = ''}>
                            →{st.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* 列表视图 */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500">
                <th className="px-4 py-3 text-left font-medium">学生</th>
                <th className="px-4 py-3 text-left font-medium">电话</th>
                <th className="px-4 py-3 text-left font-medium">潜能画像</th>
                <th className="px-4 py-3 text-left font-medium">家长类型</th>
                <th className="px-4 py-3 text-center font-medium">当前阶段</th>
                <th className="px-4 py-3 text-center font-medium">负责销售</th>
                <th className="px-4 py-3 text-center font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map(s => {
                const stage = CRM_STAGES.find(st => st.key === (s.crm_stage || 'lead')) || CRM_STAGES[0]
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{s.student_name}</div>
                      <div className="text-xs text-gray-400">{s.student_age}岁</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {s.parent_phone ? s.parent_phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{s.talent_type || '-'}</td>
                    <td className="px-4 py-3">
                      {s.parent_type && PARENT_TYPES[s.parent_type] ? (
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                          {PARENT_TYPES[s.parent_type].name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select value={s.crm_stage || 'lead'} onChange={e => handleStageChange(s.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-full border-0 cursor-pointer text-white font-medium"
                        style={{ background: stage.color }}>
                        {CRM_STAGES.map(st => <option key={st.key} value={st.key}>{st.icon} {st.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select value={s.assigned_sales || ''} onChange={e => handleAssignSales(s.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-lg border border-gray-200 bg-white">
                        <option value="">未分配</option>
                        {salesMembers.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {s.parent_phone && (
                        <a href={`tel:${s.parent_phone}`} className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">📞 拨打</a>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
