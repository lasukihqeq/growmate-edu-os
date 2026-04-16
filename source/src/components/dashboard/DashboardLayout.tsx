import { useState } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { AIInsightHero } from './AIInsightHero'
import { WilderRadarSection } from './WilderRadarSection'
import { GrowthPlanSection } from './GrowthPlanSection'
import type { DashboardData } from '../../hooks/useDashboardData'

interface DashboardLayoutProps {
  data: DashboardData
  onBack: () => void
}

export function DashboardLayout({ data, onBack }: DashboardLayoutProps) {
  const [activeSection, setActiveSection] = useState('overview')

  return (
    <div className="min-h-screen bg-[var(--ws-bg-page)]">
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onBack={onBack}
        studentName={data.studentName}
      />

      {/* Main content area */}
      <main className="lg:ml-[220px] min-h-screen">
        <div className="max-w-[960px] mx-auto px-4 lg:px-8 py-6 lg:py-10 pt-16 lg:pt-10">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-lg lg:text-xl font-bold text-[var(--ws-text-primary)]">
              {data.studentName}的成长仪表盘
            </h1>
            <p className="text-sm text-[var(--ws-text-secondary)] mt-1">
              基于 WILDER 六维度测评的个性化分析
            </p>
          </div>

          {/* Sections */}
          {(activeSection === 'overview' || activeSection === 'analysis') && (
            <div className="space-y-6">
              {/* AI Insight Hero */}
              <AIInsightHero
                talentType={data.talentType}
                coreInsight={data.coreInsight}
                confidence={data.confidence}
                profileCode={data.profileCode}
              />

              {/* WILDER Radar */}
              <WilderRadarSection
                wilderScores={data.wilderScores}
                wilderLevels={data.wilderLevels}
                sortedDims={data.sortedDims}
              />
            </div>
          )}

          {(activeSection === 'overview' || activeSection === 'growth') && (
            <div className={activeSection === 'overview' ? 'mt-6' : ''}>
              {/* Growth Plan */}
              <GrowthPlanSection
                fourteenDayPlan={data.fourteenDayPlan}
                growthPaths={data.growthPaths}
                yearlyBlueprint={data.yearlyBlueprint}
              />
            </div>
          )}

          {activeSection === 'resources' && (
            <div className="rounded-2xl bg-white border border-[var(--ws-border-soft)] p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 rounded-full bg-[#FFB800]" />
                <h3 className="text-base font-semibold text-[var(--ws-text-primary)]">学习资源推荐</h3>
              </div>
              {data.aiInsight ? (
                <div className="p-4 rounded-xl bg-[var(--ws-bg-elevated)]">
                  <p className="text-sm text-[var(--ws-text-secondary)] leading-relaxed">{data.aiInsight}</p>
                </div>
              ) : (
                <p className="text-sm text-[var(--ws-text-muted)] text-center py-8">
                  完整学习资源请查看详细报告
                </p>
              )}
              {data.actionableInsight && (
                <div className="mt-4 p-4 rounded-xl bg-[rgba(59,95,217,0.04)] border-l-3 border-[var(--ws-primary)]">
                  <p className="text-xs font-medium text-[var(--ws-primary)] mb-1">可行动建议</p>
                  <p className="text-sm text-[var(--ws-text-secondary)] leading-relaxed">{data.actionableInsight}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
