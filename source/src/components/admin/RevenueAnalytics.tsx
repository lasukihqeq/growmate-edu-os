import { useState, useEffect, useCallback } from 'react'


interface RevenueSummary {
  total_revenue: number; month_revenue: number; avg_order_value: number
  renewal_rate: number; total_orders: number
  trend: { month: string; orders: number; revenue: number }[]
}

interface SalesMember {
  id: string; name: string; monthly_target: number; order_count: number
  total_revenue: number; student_count: number; month_followups: number
}

// 通用 fetch helper
async function fetchJSON(url: string) {
  const token = localStorage.getItem('growmate_admin_token')
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } })
  if (!res.ok) throw new Error('请求失败')
  return res.json()
}

const API = (() => {
  const loc = window.location.hostname
  if (loc === 'localhost' || loc === '127.0.0.1') return 'http://localhost:3001/api'
  return 'https://assessment.hykx.com.cn/api'
})()

export function RevenueAnalytics() {
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null)
  const [salesPerf, setSalesPerf] = useState<SalesMember[]>([])
  const [profileConv, setProfileConv] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [rev, perf, conv] = await Promise.all([
        fetchJSON(`${API}/admin/stats/revenue`),
        fetchJSON(`${API}/admin/stats/sales-performance`),
        fetchJSON(`${API}/admin/stats/profile-conversion`)
      ])
      setRevenue(rev)
      setSalesPerf(perf)
      setProfileConv(conv)
    } catch (e) { console.error('加载营收数据失败:', e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const fmtMoney = (n: number) => n >= 10000 ? `¥${(n / 10000).toFixed(1)}万` : `¥${n.toLocaleString()}`

  if (loading) return <div className="text-center py-16 text-gray-400 animate-pulse">加载营收数据...</div>

  return (
    <div className="space-y-6">
      {/* 核心指标卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: '总营收', value: fmtMoney(revenue?.total_revenue || 0), color: '#3B5FD9', icon: '💰' },
          { label: '本月营收', value: fmtMoney(revenue?.month_revenue || 0), color: '#2563eb', icon: '📈' },
          { label: '客单价', value: fmtMoney(revenue?.avg_order_value || 0), color: '#d97706', icon: '🏷️' },
          { label: '续费率', value: `${revenue?.renewal_rate || 0}%`, color: '#059669', icon: '🔄' },
          { label: '总订单', value: String(revenue?.total_orders || 0), color: '#6366f1', icon: '📋' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{item.icon}</span>
              <span className="text-2xl font-black" style={{ color: item.color }}>{item.value}</span>
            </div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* 营收趋势图 (SVG) */}
      {revenue && revenue.trend.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-800 mb-4">📊 营收趋势（近12月）</h3>
          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${Math.max(600, revenue.trend.length * 60)} 200`} className="w-full" style={{ minWidth: 400, maxHeight: 220 }}>
              {(() => {
                const data = revenue.trend
                const maxRev = Math.max(...data.map(d => parseFloat(String(d.revenue))), 1)
                const w = Math.max(600, data.length * 60)
                const padding = { left: 50, right: 20, top: 20, bottom: 35 }
                const chartW = w - padding.left - padding.right
                const chartH = 200 - padding.top - padding.bottom

                const points = data.map((d, i) => ({
                  x: padding.left + (i / Math.max(data.length - 1, 1)) * chartW,
                  y: padding.top + chartH - (parseFloat(String(d.revenue)) / maxRev) * chartH,
                  rev: parseFloat(String(d.revenue)),
                  month: d.month
                }))

                const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
                const areaPath = linePath + ` L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`

                return (
                  <>
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(pct => {
                      const y = padding.top + chartH * (1 - pct)
                      return <g key={pct}>
                        <line x1={padding.left} y1={y} x2={w - padding.right} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                        <text x={padding.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{fmtMoney(maxRev * pct)}</text>
                      </g>
                    })}
                    {/* Area */}
                    <path d={areaPath} fill="url(#revGradient)" opacity="0.3" />
                    <defs>
                      <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Line */}
                    <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Points + Labels */}
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#2563eb" strokeWidth="2" />
                        <text x={p.x} y={padding.top + chartH + 18} textAnchor="middle" fontSize="9" fill="#94a3b8">{p.month.slice(5)}</text>
                        {p.rev > 0 && <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="8" fill="#2563eb" fontWeight="600">{fmtMoney(p.rev)}</text>}
                      </g>
                    ))}
                  </>
                )
              })()}
            </svg>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* 销售业绩排行 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-800 mb-4">🏆 销售业绩排行</h3>
          {salesPerf.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <p>暂无销售数据</p>
              <p className="text-xs mt-1">请先添加销售团队成员</p>
            </div>
          ) : (
            <div className="space-y-3">
              {salesPerf.map((m, i) => {
                const target = parseFloat(String(m.monthly_target)) || 0
                const rev = parseFloat(String(m.total_revenue))
                const pct = target > 0 ? Math.min(100, Math.round(rev / target * 100)) : 0
                return (
                  <div key={m.id} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-700' : 'bg-gray-300'
                    }`}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-800 truncate">{m.name}</span>
                        <span className="text-sm font-bold text-blue-700">{fmtMoney(rev)}</span>
                      </div>
                      {target > 0 && (
                        <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{
                            width: `${pct}%`,
                            background: pct >= 100 ? '#059669' : pct >= 60 ? '#2563eb' : '#f59e0b'
                          }} />
                        </div>
                      )}
                      <div className="flex gap-3 mt-1 text-[10px] text-gray-400">
                        <span>📋 {m.order_count}单</span>
                        <span>👥 {m.student_count}人</span>
                        <span>📞 {m.month_followups}次跟进</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Profile30 转化分析 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-800 mb-4">🧬 画像转化分析</h3>
          {profileConv.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">暂无画像转化数据</div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-5 gap-2 text-[10px] text-gray-400 font-medium pb-1 border-b border-gray-100 sticky top-0 bg-white">
                <span>画像</span><span>学员数</span><span>已报名</span><span>转化率</span><span>营收</span>
              </div>
              {profileConv.map((p: any, i: number) => (
                <div key={i} className="grid grid-cols-5 gap-2 text-xs items-center py-1.5 hover:bg-gray-50 rounded">
                  <span className="font-medium text-gray-800 truncate" title={p.talent_type}>
                    {p.profile_code || '-'}
                  </span>
                  <span className="text-gray-600">{p.student_count}</span>
                  <span className="text-green-700 font-medium">{p.enrolled_count}</span>
                  <span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.conversion_rate >= 50 ? 'bg-green-100 text-green-700' :
                      p.conversion_rate >= 20 ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>{p.conversion_rate}%</span>
                  </span>
                  <span className="text-blue-700 font-medium">{fmtMoney(parseFloat(p.revenue))}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
