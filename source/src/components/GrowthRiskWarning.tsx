/**
 * GrowthRiskWarning.tsx - 成长暗礁与风险预警组件
 *
 * L2 风险预警层核心组件
 * 功能: 展示成长暗礁、应试冲突预测、窗口期倒计时、家长避坑指南
 * 目标: 抓住家长的"责任心"，制造合理的痛点焦虑
 */

import React from 'react'
import { AlertTriangle, Lightbulb, XCircle, CheckCircle, ChevronRight } from 'lucide-react'
import { generateRiskWarning, type RiskWarningResult } from '../lib/riskWarningEngine'
import type { DynamicReportData } from '../lib/reportContentGenerator'
import type { WilderDimension } from '../lib/wilderKernel'

// ========== Props 接口 ==========

export interface GrowthRiskWarningProps {
  /** 报告数据 */
  reportData: DynamicReportData
}

// ========== 紧迫程度颜色映射 ==========

const URGENCY_COLORS = {
  critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', badge: 'bg-red-100 text-red-700' },
  urgent: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
  moderate: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700' },
  stable: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', badge: 'bg-green-100 text-green-700' }
}

// ========== 维度图标映射 ==========

const DIMENSION_ICONS: Record<WilderDimension, string> = {
  W: '🔭', I: '🔬', L: '🤝', D: '📐', E: '🎤', R: '🧘'
}

// ========== 成长暗礁组件 ==========

export const GrowthRiskWarning: React.FC<GrowthRiskWarningProps> = ({
  reportData: d
}) => {
  // 解析短板和长板维度
  const weakDims = getWeakDimensions(d.wilderPercentiles)
  const strongDims = getStrongDimensions(d.wilderPercentiles)

  // 生成风险预警
  const riskWarning: RiskWarningResult = generateRiskWarning({
    name: d.student.name,
    age: d.student.age,
    profileCode: d.profileCode,
    wilderScores: d.wilderScores,
    weakDimensions: weakDims,
    strongDimensions: strongDims
  })

  const urgencyStyle = URGENCY_COLORS[riskWarning.windowWarning.urgency]

  return (
    <section id="section-risk-warning" className="relative">
      {/* 顶部警示条 */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
        <div className="flex items-center gap-3 text-white">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <h3 className="font-bold text-lg">成长暗礁预警</h3>
            <p className="text-white/80 text-sm">不是危言耸听，是科学预判</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-amber-50 to-white p-6 sm:p-8">
        {/* 权威警示语 */}
        <div className="mb-8 p-4 bg-white rounded-xl border border-amber-100 shadow-sm">
          <p className="text-[rgba(10,10,26,0.7)] text-sm leading-relaxed italic">
            {riskWarning.authorityStatement}
          </p>
        </div>

        {/* 窗口期倒计时 - 核心紧迫感模块 */}
        <div className={`mb-8 rounded-2xl p-6 ${urgencyStyle.bg} border-2 ${urgencyStyle.border}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${urgencyStyle.badge} flex items-center justify-center text-2xl`}>
                {DIMENSION_ICONS[riskWarning.windowWarning.targetDimension]}
              </div>
              <div>
                <p className="text-xs text-[rgba(10,10,26,0.5)] uppercase tracking-wider">窗口期倒计时</p>
                <h4 className={`font-bold text-lg ${urgencyStyle.text}`}>
                  {riskWarning.windowWarning.dimensionName}发展窗口
                </h4>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-black ${urgencyStyle.text}`}>
                {Math.max(0, Math.ceil(riskWarning.windowWarning.monthsRemaining))}
              </p>
              <p className="text-xs text-[rgba(10,10,26,0.5)]">个月</p>
            </div>
          </div>

          <p className="text-[rgba(10,10,26,0.7)] text-sm leading-relaxed mb-4">
            {riskWarning.windowWarning.description}
          </p>

          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-xs text-[rgba(10,10,26,0.5)] mb-1">脑科学依据</p>
            <p className="text-xs text-[rgba(10,10,26,0.6)] leading-relaxed">
              {riskWarning.windowWarning.neuroscienceBasis}
            </p>
          </div>
        </div>

        {/* 成长暗礁卡片 */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-lg font-bold text-[#0A0A1A] mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            可能的成长暗礁
          </h4>

          <div className="space-y-4">
            {riskWarning.growthRisks.map((risk, index) => (
              <div key={index} className="bg-white rounded-xl border border-[rgba(10,10,26,0.06)] overflow-hidden">
                {/* 暗礁标题 */}
                <div className="bg-[rgba(10,10,26,0.03)] px-5 py-4 border-b border-[rgba(10,10,26,0.04)]">
                  <h5 className="font-bold text-[#0A0A1A] flex items-center gap-2">
                    <span className="text-amber-500">⚠️</span>
                    {risk.reefName}
                  </h5>
                </div>

                <div className="p-5 space-y-4">
                  {/* 暗礁描述 */}
                  <p className="text-[rgba(10,10,26,0.7)] text-sm leading-relaxed">
                    {risk.reefDescription}
                  </p>

                  {/* 现实困境 */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-[rgba(10,10,26,0.5)] uppercase tracking-wider">可能的困境</p>
                    {risk.dilemmas.map((dilemma, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-[rgba(10,10,26,0.6)]">
                        <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>{dilemma}</span>
                      </div>
                    ))}
                  </div>

                  {/* 应试冲突预测 */}
                  <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-xs font-bold text-red-600 uppercase tracking-wider">应试冲突预警</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium text-[rgba(10,10,26,0.6)]">可能被贴的标签：</span>
                        <span className="text-red-600 font-medium">"{risk.schoolConflict.mislabel}"</span>
                      </p>
                      <p>
                        <span className="font-medium text-[rgba(10,10,26,0.6)]">真相：</span>
                        <span className="text-[rgba(10,10,26,0.8)]">{risk.schoolConflict.truthStatement}</span>
                      </p>
                    </div>
                  </div>

                  {/* 教师沟通建议 */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">教师沟通建议</span>
                    </div>
                    <p className="text-sm text-[rgba(10,10,26,0.7)]">{risk.schoolConflict.teacherTip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 家长避坑指南 */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-bold text-[#0A0A1A] mb-4">
            <XCircle className="w-5 h-5 text-red-500" />
            家长避坑指南
          </h4>
          <p className="text-sm text-[rgba(10,10,26,0.5)] mb-4">
            以下行为可能会无意中扼杀孩子的天赋，请务必避免：
          </p>

          <div className="space-y-4">
            {riskWarning.pitfalls.map((pitfall, index) => (
              <div key={index} className="bg-white rounded-xl border border-[rgba(10,10,26,0.06)] p-5">
                <h5 className="font-bold text-[#0A0A1A] mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  {pitfall.title}
                </h5>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-[rgba(10,10,26,0.5)]">错误做法：</span>
                      <span className="text-[rgba(10,10,26,0.7)]">{pitfall.wrongBehavior}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-[rgba(10,10,26,0.5)]">为什么错：</span>
                      <span className="text-[rgba(10,10,26,0.7)]">{pitfall.whyWrong}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-[rgba(10,10,26,0.5)]">正确做法：</span>
                      <span className="text-[rgba(10,10,26,0.8)]">{pitfall.rightBehavior}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部行动召唤 */}
        <div className="mt-8 p-5 bg-gradient-to-r from-[#3B5FD9]/10 to-[#0F9D94]/10 rounded-xl border border-[#3B5FD9]/20">
          <p className="text-sm text-[rgba(10,10,26,0.7)] text-center">
            知道风险只是第一步。<span className="font-bold text-[#3B5FD9]">接下来14天，我们带你一步步化解暗礁。</span>
          </p>
        </div>
      </div>
    </section>
  )
}

// ========== 辅助函数 ==========

/**
 * 获取短板维度（分数最低的1-2个）
 */
function getWeakDimensions(percentiles: Record<string, number>): WilderDimension[] {
  const entries = Object.entries(percentiles) as [WilderDimension, number][]
  const sorted = entries.sort((a, b) => a[1] - b[1])
  return sorted.slice(0, 2).map(([dim]) => dim)
}

/**
 * 获取长板维度（分数最高的1-2个）
 */
function getStrongDimensions(percentiles: Record<string, number>): WilderDimension[] {
  const entries = Object.entries(percentiles) as [WilderDimension, number][]
  const sorted = entries.sort((a, b) => b[1] - a[1])
  return sorted.slice(0, 2).map(([dim]) => dim)
}

export default GrowthRiskWarning
