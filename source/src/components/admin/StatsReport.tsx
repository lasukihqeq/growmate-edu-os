import { useState, useEffect } from 'react'
import { getStats, getSalesStats } from '../../lib/api'

interface SalesFunnel {
  stage: string
  count: number
  label: string
  color: string
}

const STAGE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  lead: { label: '新线索', color: '#6b7280', icon: '🆕' },
  contacted: { label: '已联系', color: '#3b82f6', icon: '📞' },
  qualified: { label: '已确认', color: '#f59e0b', icon: '✅' },
  trialed: { label: '已试课', color: '#8b5cf6', icon: '🎓' },
  enrolled: { label: '已报名', color: '#10b981', icon: '🎉' },
  renewing: { label: '续费中', color: '#ec4899', icon: '🔄' },
}

export function StatsReport() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null)
  const [salesFunnel, setSalesFunnel] = useState<SalesFunnel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, salesData] = await Promise.allSettled([getStats(), getSalesStats()])
      
      if (statsData.status === 'fulfilled') setStats(statsData.value)
      
      if (salesData.status === 'fulfilled' && salesData.value?.funnel) {
        const funnel = (salesData.value.funnel as Array<{ crm_stage: string; count: number }>).map(item => ({
          stage: item.crm_stage,
          count: item.count,
          label: STAGE_CONFIG[item.crm_stage]?.label || item.crm_stage,
          color: STAGE_CONFIG[item.crm_stage]?.color || '#999',
        }))
        setSalesFunnel(funnel)
      }
    } catch (err) {
      console.error('加载统计失败:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400 animate-pulse">加载统计报表...</div>
  }

  const total = (stats?.total as number) || 0
  const funnelTotal = salesFunnel.reduce((s, f) => s + f.count, 0)
  const funnelMax = Math.max(...salesFunnel.map(f => f.count), 1)
  const enrolled = salesFunnel.find(f => f.stage === 'enrolled')?.count || 0
  const conversionRate = total > 0 ? ((enrolled / total) * 100).toFixed(1) : '0'

  const talentDist = (stats?.talent_distribution as Array<{ talent_type: string; count: number }>) || []
  const ageDist = (stats?.age_distribution as Array<{ student_age: number; count: number }>) || []
  const avgScores = (stats?.avg_scores as Record<string, number>) || {}
  const ageMax = Math.max(...ageDist.map(a => a.count), 1)

  const dimLabels: Record<string, string> = {
    W: '好奇心', I: '探究力', L: '联结力', D: '设计力', E: '表达力', R: '反思力'
  }
  const dimColors: Record<string, string> = {
    W: '#f59e0b', I: '#10b981', L: '#3b82f6', D: '#8b5cf6', E: '#ec4899', R: '#6366f1'
  }

  return (
    <div className="space-y-6">
      {/* 核心指标 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '总测评量', value: total, icon: '📊', color: '#0d9488' },
          { label: '客户总数', value: funnelTotal, icon: '👥', color: '#3b82f6' },
          { label: '已报名', value: enrolled, icon: '🎉', color: '#10b981' },
          { label: '总转化率', value: conversionRate + '%', icon: '📈', color: '#8b5cf6' },
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

      {/* 销售漏斗 */}
      {salesFunnel.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔺 销售漏斗</h3>
          <div className="space-y-3">
            {salesFunnel.map((item, i) => {
              const widthPct = Math.max(15, (item.count / funnelMax) * 100)
              const stageCfg = STAGE_CONFIG[item.stage]
              return (
                <div key={item.stage} className="flex items-center gap-3">
                  <span className="text-sm w-20 text-gray-600 flex items-center gap-1">
                    {stageCfg?.icon} {item.label}
                  </span>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div className="h-full rounded-lg flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${widthPct}%`, background: item.color }}>
                      <span className="text-xs text-white font-bold">{item.count}</span>
                    </div>
                  </div>
                  {i > 0 && salesFunnel[i - 1].count > 0 && (
                    <span className="text-xs text-gray-400 w-12 text-right">
                      {Math.round((item.count / salesFunnel[i - 1].count) * 100)}%
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* WILDER 维度分布 + 年龄分布 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* WILDER 平均分 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🌟 WILDER 维度均值</h3>
          <div className="space-y-3">
            {Object.entries(dimLabels).map(([k, label]) => {
              const score = avgScores[k] || 0
              return (
                <div key={k} className="flex items-center gap-3">
                  <span className="text-xs w-16 text-gray-500">{k}-{label}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${score}%`, background: dimColors[k] }} />
                  </div>
                  <span className="text-sm font-bold w-8 text-right" style={{ color: dimColors[k] }}>
                    {Math.round(score)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 年龄分布 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">👶 年龄分布</h3>
          {ageDist.length === 0 ? (
            <p className="text-sm text-gray-400">暂无数据</p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {ageDist.map(item => (
                <div key={item.student_age} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-xs font-bold text-[#2A4CC0] mb-1">{item.count}</span>
                  <div className="w-full bg-gradient-to-t from-teal-500 to-teal-300 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(item.count / ageMax) * 100}%`, minHeight: '4px' }} />
                  <span className="text-[10px] text-gray-400 mt-1">{item.student_age}岁</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 潜能类型分布 */}
      {talentDist.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🎨 潜能类型 TOP 10</h3>
          <div className="space-y-2">
            {talentDist.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-32 truncate">{t.talent_type}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full text-xs text-white flex items-center justify-end pr-2 font-medium"
                    style={{
                      width: `${Math.max(20, (t.count / total) * 100)}%`,
                      background: `hsl(${170 + i * 15} 60% ${40 + i * 3}%)`
                    }}>
                    {t.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 导出按钮 */}
      <div className="flex gap-3 justify-end">
        <button onClick={() => window.print()}
          className="px-5 py-2.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
          🖨️ 打印报表
        </button>
      </div>
    </div>
  )
}
