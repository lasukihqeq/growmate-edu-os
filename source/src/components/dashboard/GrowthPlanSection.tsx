import { useState } from 'react'
import { Rocket, TrendingUp, Star, CheckCircle2 } from 'lucide-react'

interface GrowthPlanSectionProps {
  fourteenDayPlan: { day: string; task: string; goal: string; duration: string; parentTip: string }[]
  growthPaths: {
    level: string; name: string; color: string
    goal: string; cycle: string; effort: string; output: string
    tasks: string[]
  }[]
  yearlyBlueprint: { quarter: string; theme: string; goals: string[]; milestone: string; color: string }[]
}

type PlanTab = '14days' | '90days' | '365days'

const TAB_CONFIG: { id: PlanTab; label: string; icon: React.ReactNode; color: string }[] = [
  { id: '14days', label: '14天启动', icon: <Rocket size={16} />, color: '#3B82F6' },
  { id: '90days', label: '90天成长', icon: <TrendingUp size={16} />, color: '#10B981' },
  { id: '365days', label: '365天愿景', icon: <Star size={16} />, color: '#8B5CF6' },
]

export function GrowthPlanSection({ fourteenDayPlan, growthPaths, yearlyBlueprint }: GrowthPlanSectionProps) {
  const [activeTab, setActiveTab] = useState<PlanTab>('14days')

  return (
    <div className="rounded-2xl bg-white border border-[var(--ws-border-soft)] p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-5 rounded-full bg-[#10B981]" />
        <h3 className="text-base font-semibold text-[var(--ws-text-primary)]">个性化成长计划</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TAB_CONFIG.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              transition-all duration-200
              ${activeTab === tab.id
                ? 'text-white'
                : 'text-[var(--ws-text-secondary)] bg-[var(--ws-bg-elevated)] hover:bg-[rgba(10,10,26,0.06)]'
              }
            `}
            style={activeTab === tab.id ? { background: tab.color } : undefined}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 14-Day Plan */}
      {activeTab === '14days' && (
        <div className="space-y-3">
          {fourteenDayPlan.length > 0 ? fourteenDayPlan.slice(0, 7).map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[rgba(59,130,246,0.04)] border border-[rgba(59,130,246,0.08)]">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                <span className="text-xs font-bold text-[#3B82F6]">{item.day}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--ws-text-primary)] mb-0.5">{item.task}</p>
                <p className="text-xs text-[var(--ws-text-secondary)]">{item.goal}</p>
                {item.duration && (
                  <span className="inline-block mt-1 text-[10px] text-[var(--ws-text-muted)] bg-[rgba(10,10,26,0.04)] px-2 py-0.5 rounded-full">
                    {item.duration}
                  </span>
                )}
              </div>
            </div>
          )) : (
            <p className="text-sm text-[var(--ws-text-muted)] text-center py-8">暂无 14 天计划数据</p>
          )}
        </div>
      )}

      {/* 90-Day Growth Paths */}
      {activeTab === '90days' && (
        <div className="space-y-4">
          {growthPaths.length > 0 ? growthPaths.map((path, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border"
              style={{
                borderColor: `${path.color || '#10B981'}20`,
                background: `${path.color || '#10B981'}06`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: path.color || '#10B981' }}
                />
                <span className="text-sm font-semibold text-[var(--ws-text-primary)]">{path.name}</span>
                <span className="text-[10px] text-[var(--ws-text-muted)] ml-auto">{path.cycle}</span>
              </div>
              <p className="text-xs text-[var(--ws-text-secondary)] mb-3">{path.goal}</p>
              <div className="space-y-1.5">
                {path.tasks.slice(0, 4).map((task, ti) => (
                  <div key={ti} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[var(--ws-text-muted)] flex-shrink-0" />
                    <span className="text-xs text-[var(--ws-text-secondary)]">{task}</span>
                  </div>
                ))}
              </div>
              {path.output && (
                <div className="mt-3 pt-3 border-t border-[var(--ws-border-soft)]">
                  <span className="text-[10px] text-[var(--ws-text-muted)]">预期产出：</span>
                  <span className="text-xs text-[var(--ws-text-secondary)]">{path.output}</span>
                </div>
              )}
            </div>
          )) : (
            <p className="text-sm text-[var(--ws-text-muted)] text-center py-8">暂无 90 天成长路径数据</p>
          )}
        </div>
      )}

      {/* 365-Day Blueprint */}
      {activeTab === '365days' && (
        <div className="space-y-4">
          {yearlyBlueprint.length > 0 ? yearlyBlueprint.map((quarter, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border"
              style={{
                borderColor: `${quarter.color || '#8B5CF6'}20`,
                background: `${quarter.color || '#8B5CF6'}06`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold" style={{ color: quarter.color || '#8B5CF6' }}>
                  {quarter.quarter}
                </span>
                <span className="text-sm font-medium text-[var(--ws-text-primary)]">{quarter.theme}</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {quarter.goals.map((goal, gi) => (
                  <div key={gi} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[var(--ws-text-muted)]" />
                    <span className="text-xs text-[var(--ws-text-secondary)]">{goal}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={12} style={{ color: quarter.color || '#8B5CF6' }} />
                <span className="text-[11px] font-medium" style={{ color: quarter.color || '#8B5CF6' }}>
                  里程碑: {quarter.milestone}
                </span>
              </div>
            </div>
          )) : (
            <p className="text-sm text-[var(--ws-text-muted)] text-center py-8">暂无年度发展蓝图数据</p>
          )}
        </div>
      )}
    </div>
  )
}
