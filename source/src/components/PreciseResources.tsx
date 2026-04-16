/**
 * PreciseResources.tsx - 精准投喂资源组件
 *
 * L4 资源层核心组件
 * 功能: 执行"3-2-1精选法则"，只给最匹配的资源
 * 目标: 解决"怎么选"的问题，从100个选择变成精准投喂
 */

import React from 'react'
import { BookOpen, Film, Target, Sparkles, Clock, Zap, Award } from 'lucide-react'
import { generatePreciseResources, type PreciseResourceResult } from '../lib/preciseResourceEngine'
import type { DynamicReportData } from '../lib/reportContentGenerator'
import type { WilderDimension } from '../lib/wilderKernel'

// ========== Props 接口 ==========

export interface PreciseResourcesProps {
  /** 报告数据 */
  reportData: DynamicReportData
}

// ========== 维度颜色映射 ==========

const DIMENSION_COLORS: Record<WilderDimension, { bg: string; text: string; badge: string }> = {
  W: { bg: 'bg-purple-100', text: 'text-purple-600', badge: 'bg-purple-500' },
  I: { bg: 'bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-500' },
  L: { bg: 'bg-green-100', text: 'text-green-600', badge: 'bg-green-500' },
  D: { bg: 'bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-500' },
  E: { bg: 'bg-pink-100', text: 'text-pink-600', badge: 'bg-pink-500' },
  R: { bg: 'bg-indigo-100', text: 'text-indigo-600', badge: 'bg-indigo-500' }
}

const DIMENSION_ICONS: Record<WilderDimension, string> = {
  W: '🔭', I: '🔬', L: '🤝', D: '📐', E: '🎤', R: '🧘'
}

// ========== 精准资源组件 ==========

export const PreciseResources: React.FC<PreciseResourcesProps> = ({
  reportData: d
}) => {
  // 解析维度
  const weakDims = getWeakDimensions(d.wilderPercentiles)
  const strongDims = getStrongDimensions(d.wilderPercentiles)

  // 生成精准资源
  const resources: PreciseResourceResult = generatePreciseResources({
    name: d.student.name,
    age: d.student.age,
    profileCode: d.profileCode,
    weakDimensions: weakDims,
    strongDimensions: strongDims,
    talentType: d.talentType
  })

  return (
    <section id="section-precise-resources" className="relative bg-white">
      {/* 顶部主题条 */}
      <div className="bg-gradient-to-r from-[#0A0A1A] to-[#1a1a3e] px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#FDD22B]" />
          <div>
            <h3 className="font-bold text-lg">精准资源投喂</h3>
            <p className="text-white/60 text-sm">{resources.seasonTheme}</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* 主编推荐语 */}
        <div className="mb-8 p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FDD22B] flex items-center justify-center flex-shrink-0">
              <span className="text-lg">📝</span>
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">主编推荐</p>
              <p className="text-sm text-[rgba(10,10,26,0.7)] leading-relaxed italic">
                {resources.editorNote}
              </p>
            </div>
          </div>
        </div>

        {/* 3本必读书籍 */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-5 h-5 text-[#3B5FD9]" />
            <h4 className="text-lg font-bold text-[#0A0A1A]">本月必读 · 3本精选</h4>
            <span className="text-xs text-[rgba(10,10,26,0.4)] bg-[rgba(10,10,26,0.03)] px-2 py-0.5 rounded-full">
              非他不可
            </span>
          </div>

          <div className="space-y-4">
            {resources.books.map((book, index) => (
              <div key={index} className="bg-white rounded-xl border border-[rgba(10,10,26,0.06)] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* 书籍头部 */}
                <div className="flex items-stretch">
                  {/* 书脊 */}
                  <div className={`w-2 ${DIMENSION_COLORS[book.targetDimension].badge}`}></div>
                  
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[rgba(10,10,26,0.4)]">NO.{index + 1}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${DIMENSION_COLORS[book.targetDimension].bg} ${DIMENSION_COLORS[book.targetDimension].text}`}>
                            {DIMENSION_ICONS[book.targetDimension]} {book.dimensionName}
                          </span>
                        </div>
                        <h5 className="font-bold text-[#0A0A1A] text-lg">{book.title}</h5>
                        <p className="text-xs text-[rgba(10,10,26,0.5)]">{book.author} · {book.ageRange}</p>
                      </div>
                    </div>

                    {/* 选入理由 */}
                    <div className="bg-[rgba(10,10,26,0.02)] rounded-lg p-3 mb-3">
                      <p className="text-xs font-bold text-[#3B5FD9] mb-1">为什么这本书非TA不可</p>
                      <p className="text-sm text-[rgba(10,10,26,0.7)]">{book.selectionReason}</p>
                    </div>

                    {/* 小挑战 */}
                    <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-700 mb-0.5">阅读小挑战</p>
                        <p className="text-sm text-amber-800">{book.challenge}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2部深度纪录片 */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Film className="w-5 h-5 text-[#0F9D94]" />
            <h4 className="text-lg font-bold text-[#0A0A1A]">深度观影 · 2部精选</h4>
            <span className="text-xs text-[rgba(10,10,26,0.4)] bg-[rgba(10,10,26,0.03)] px-2 py-0.5 rounded-full">
              激发心流
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {resources.documentaries.map((doc, index) => (
              <div key={index} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${DIMENSION_COLORS[doc.targetDimension].bg} ${DIMENSION_COLORS[doc.targetDimension].text}`}>
                    {DIMENSION_ICONS[doc.targetDimension]} {doc.dimensionName}
                  </span>
                  <span className="text-xs text-[rgba(10,10,26,0.4)]">{doc.platform}</span>
                </div>

                <h5 className="font-bold text-[#0A0A1A] text-lg mb-2">{doc.title}</h5>
                <div className="flex items-center gap-2 text-xs text-[rgba(10,10,26,0.5)] mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{doc.duration}</span>
                </div>

                {/* 选入理由 */}
                <p className="text-sm text-[rgba(10,10,26,0.7)] mb-3">{doc.selectionReason}</p>

                {/* 心流触发点 */}
                <div className="bg-white/60 rounded-lg p-3 mb-3">
                  <p className="text-xs text-[rgba(10,10,26,0.5)] mb-1">心流触发点</p>
                  <p className="text-sm text-[rgba(10,10,26,0.7)]">{doc.flowTrigger}</p>
                </div>

                {/* 观影挑战 */}
                <div className="flex items-start gap-2 p-3 bg-teal-100/50 rounded-lg">
                  <Zap className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-teal-700 mb-0.5">观影小挑战</p>
                    <p className="text-sm text-teal-800">{doc.challenge}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1个关键行动 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-[#FDD22B]" />
            <h4 className="text-lg font-bold text-[#0A0A1A]">本季大招 · 1个关键行动</h4>
            <span className="text-xs bg-[#FDD22B]/20 text-amber-700 px-2 py-0.5 rounded-full font-bold">
              强烈推荐
            </span>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl border-2 border-[#FDD22B]/30 overflow-hidden">
            {/* 行动头部 */}
            <div className="bg-gradient-to-r from-[#FDD22B]/20 to-[#FFB800]/20 p-5 border-b border-[#FDD22B]/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[rgba(10,10,26,0.5)] mb-1">行动类型：{getActionTypeLabel(resources.keyAction.type)}</p>
                  <h5 className="font-bold text-[#0A0A1A] text-xl">{resources.keyAction.title}</h5>
                </div>
                <Award className="w-8 h-8 text-[#FDD22B]" />
              </div>
            </div>

            <div className="p-5">
              {/* 时间窗口 */}
              <div className="flex items-center gap-2 mb-4 text-sm text-[rgba(10,10,26,0.6)]">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>时间窗口：<strong className="text-[#0A0A1A]">{resources.keyAction.timeWindow}</strong></span>
                <span className="text-[rgba(10,10,26,0.3)]">|</span>
                <span>投入预估：<strong className="text-[#0A0A1A]">{resources.keyAction.investment}</strong></span>
              </div>

              {/* 选入理由 */}
              <div className="bg-white/60 rounded-lg p-4 mb-4">
                <p className="text-xs font-bold text-[rgba(10,10,26,0.5)] mb-1">为什么这个行动非TA不可</p>
                <p className="text-sm text-[rgba(10,10,26,0.7)]">{resources.keyAction.selectionReason}</p>
              </div>

              {/* 行动价值 */}
              <div className="bg-[#3B5FD9]/5 rounded-lg p-4 mb-4">
                <p className="text-xs font-bold text-[#3B5FD9] mb-1">行动价值</p>
                <p className="text-sm text-[rgba(10,10,26,0.7)]">{resources.keyAction.value}</p>
              </div>

              {/* 行动步骤 */}
              <div>
                <p className="text-xs font-bold text-[rgba(10,10,26,0.5)] mb-3 uppercase tracking-wider">执行步骤</p>
                <div className="space-y-2">
                  {resources.keyAction.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#FDD22B] text-[#0A0A1A] text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm text-[rgba(10,10,26,0.7)] pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="p-4 bg-[rgba(10,10,26,0.02)] rounded-xl text-center">
          <p className="text-xs text-[rgba(10,10,26,0.5)]">
            以上资源基于 {d.student.name} 的 {d.profileCode} 画像编码精准匹配
          </p>
        </div>
      </div>
    </section>
  )
}

// ========== 辅助函数 ==========

function getWeakDimensions(percentiles: Record<string, number>): WilderDimension[] {
  const entries = Object.entries(percentiles) as [WilderDimension, number][]
  const sorted = entries.sort((a, b) => a[1] - b[1])
  return sorted.slice(0, 2).map(([dim]) => dim)
}

function getStrongDimensions(percentiles: Record<string, number>): WilderDimension[] {
  const entries = Object.entries(percentiles) as [WilderDimension, number][]
  const sorted = entries.sort((a, b) => b[1] - a[1])
  return sorted.slice(0, 2).map(([dim]) => dim)
}

function getActionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    competition: '竞赛',
    museum: '博物馆',
    camp: '营地活动',
    course: '课程',
    project: '项目'
  }
  return labels[type] || '活动'
}

export default PreciseResources
