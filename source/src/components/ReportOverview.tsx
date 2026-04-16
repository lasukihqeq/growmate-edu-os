/**
 * ReportOverview.tsx - 潜能总览组件
 * 
 * 功能: 报告的潜能总览章节 (Ch.1)
 * 包含:
 * - 四象限能力定位分析
 * - 三条成长发展轴
 * - 成长优先级排序
 */

import React from 'react'
import { ArrowDown } from 'lucide-react'
import { ReportSectionHeader } from './ui/ReportSectionHeader'
import { BaseCard } from './ui/BaseCard'
import type { DynamicReportData } from '../lib/reportContentGenerator'
import { SectionInsight } from './ReportEducationFoundation'

// ========== Props 接口 ==========
export interface ReportOverviewProps {
  /** 报告数据 */
  reportData: DynamicReportData
  /** 章节追踪函数 */
  trackSection?: (element: HTMLElement | null) => void
}

/**
 * 报告潜能总览组件
 */
export const ReportOverview: React.FC<ReportOverviewProps> = ({
  reportData: d,
  trackSection,
}) => {
  return (
    <section id="section-ch1" ref={trackSection} className="page-break py-8">
      {/* 章节头部 */}
      <ReportSectionHeader
        variant="overview"
        title="潜能总览"
        subtitle="Executive Summary · 核心发现与成长方向"
      />

      <div className="p-6 space-y-6">
        {/* 核心洞察 */}
        <SectionInsight 
          text={`${d.student.name}是典型的「${d.talentType}」。核心优势：${d.sortedDims[0]?.name}(${d.sortedDims[0]?.score}) + ${d.sortedDims[1]?.name}(${d.sortedDims[1]?.score})双核驱动。`} 
          type="key" 
        />

        {/* 四象限能力定位 */}
        <div className="bg-white border border-[rgba(10,10,26,0.06)] rounded-2xl p-6">
          <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#3B5FD9] rounded-lg flex items-center justify-center text-white text-sm font-bold">4</span>
            四象限能力定位分析
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {/* 优势象限 */}
            <BaseCard variant="advantage" title="优势象限（高能力×高兴趣）">
              <p className="text-xs text-[rgba(10,10,26,0.5)] mb-3">核心竞争力区域</p>
              <div className="space-y-2">
                {d.sortedDims.slice(0, 2).map((dim, i) => (
                  <div key={i} className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 flex items-center justify-between">
                    <span className="font-medium text-gray-700">{dim.name}</span>
                    <span className="text-green-600 font-bold">{dim.score}分</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[rgba(10,10,26,0.6)] mt-3">策略：重点投资，打造护城河</p>
            </BaseCard>

            {/* 潜力象限 */}
            <BaseCard variant="insight" title="潜力象限（中能力×高可塑）">
              <p className="text-xs text-[rgba(10,10,26,0.5)] mb-3">成长突破区域</p>
              <div className="space-y-2">
                {d.sortedDims.slice(2, 4).map((dim, i) => (
                  <div key={i} className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 flex items-center justify-between">
                    <span className="font-medium text-gray-700">{dim.name}</span>
                    <span className="text-amber-600 font-bold">{dim.score}分</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[rgba(10,10,26,0.6)] mt-3">策略：定向培养，挖掘潜能</p>
            </BaseCard>

            {/* 补强象限 */}
            <BaseCard variant="risk" title="补强象限（待提升区域）">
              <p className="text-xs text-[rgba(10,10,26,0.5)] mb-3">需关注的能力短板</p>
              <div className="space-y-2">
                {d.sortedDims.slice(-2).map((dim, i) => (
                  <div key={i} className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 flex items-center justify-between">
                    <span className="font-medium text-gray-700">{dim.name}</span>
                    <span className="text-red-600 font-bold">{dim.score}分</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[rgba(10,10,26,0.6)] mt-3">策略：补强而非补齐，达到基准线即可</p>
            </BaseCard>

            {/* 风险象限 */}
            <BaseCard variant="default" title="风险预警">
              <p className="text-xs text-[rgba(10,10,26,0.5)] mb-3">需要关注的潜在问题</p>
              <div className="space-y-2 text-sm text-gray-600">
                {d.risks.slice(0, 2).map((risk, i) => (
                  <div key={i} className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3">
                    <p className="font-medium text-[rgba(10,10,26,0.7)]">{risk.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{risk.description}</p>
                  </div>
                ))}
              </div>
            </BaseCard>
          </div>
        </div>

        {/* 三条成长发展轴 */}
        <div className="bg-white border border-[rgba(10,10,26,0.06)] rounded-2xl p-6">
          <h4 className="font-bold text-[#0A0A1A] text-lg mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#3B5FD9] text-white text-sm font-semibold">3</span>
            三条成长发展轴
          </h4>
          <p className="text-sm text-[rgba(10,10,26,0.6)] mb-4 bg-[rgba(59,95,217,0.04)] rounded-lg p-3">
            每个孩子的成长都需要"主攻方向"。以下三条轴线是根据{d.student.name}的测评结果，为TA量身定制的发展路线图——
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {/* 优势深耕轴 */}
            <div className="bg-white rounded-xl p-4 border border-[rgba(10,10,26,0.06)]">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#3B5FD9] text-white text-sm font-semibold mb-3">1</span>
              <h5 className="font-bold text-gray-800 mb-2">优势深耕轴</h5>
              <p className="text-sm text-gray-600 mb-3">
                {d.student.name}在<strong className="text-[#3B5FD9]">{d.sortedDims[0]?.name}</strong>和<strong className="text-[#3B5FD9]">{d.sortedDims[1]?.name}</strong>方面表现突出，这两项能力就像TA的"潜能发动机"——别的孩子可能需要努力才能做到的事情，TA天生就能做得又快又好。
              </p>
              <p className="text-xs text-gray-500 mb-2">
                <strong>家长请注意：</strong>这两个优势领域是{d.student.name}未来脱颖而出的关键筹码，一定要重点培养，让优势变成"绝对优势"！
              </p>
              <div className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 text-xs text-[rgba(10,10,26,0.7)]">
                <strong>冲刺目标：</strong>通过持续深耕，让这两项能力达到同龄孩子中<span className="font-black text-[#3B5FD9]">前5%</span>的水平——这将是TA未来升学、竞赛、甚至职业发展的核心竞争力！
              </div>
            </div>

            {/* 潜力激活轴 */}
            <div className="bg-white rounded-xl p-4 border border-[rgba(10,10,26,0.06)]">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#3B5FD9] text-white text-sm font-semibold mb-3">2</span>
              <h5 className="font-bold text-gray-800 mb-2">潜力激活轴</h5>
              <p className="text-sm text-gray-600 mb-3">
                {d.student.name}的<strong className="text-amber-600">{d.sortedDims[2]?.name}</strong>和<strong className="text-amber-600">{d.sortedDims[3]?.name}</strong>目前处于"沉睡状态"——不是没有潜力，而是还没被激发出来！这就像一颗种子，只要给它阳光和水分，很快就能发芽。
              </p>
              <p className="text-xs text-gray-500 mb-2">
                <strong>好消息：</strong>这个年龄段的孩子，这两项能力的可塑性非常强。只要方法得当，进步会非常明显，家长很快就能看到变化！
              </p>
              <div className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 text-xs text-[rgba(10,10,26,0.7)]">
                <strong>提升目标：</strong>通过每天10-15分钟的针对性微训练，<span className="font-black text-amber-600">90天内提升10-15分</span>完全可以实现——这相当于从班级中游跃升到前三分之一！
              </div>
            </div>

            {/* 风险管控轴 */}
            <div className="bg-white rounded-xl p-4 border border-[rgba(10,10,26,0.06)]">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#3B5FD9] text-white text-sm font-semibold mb-3">3</span>
              <h5 className="font-bold text-gray-800 mb-2">风险管控轴</h5>
              <p className="text-sm text-gray-600 mb-3">
                {d.student.name}在<strong className="text-[rgba(10,10,26,0.6)]">{d.sortedDims[4]?.name}</strong>和<strong className="text-[rgba(10,10,26,0.6)]">{d.sortedDims[5]?.name}</strong>方面相对薄弱——但请不要焦虑！这不代表"有问题"，只是说明TA的精力和潜能更多地分配到了其他地方。
              </p>
              <p className="text-xs text-gray-500 mb-2">
                <strong>重要提醒：</strong>这两个维度不需要追求卓越，但要确保"不拖后腿"。就像木桶原理，短板太短会影响整体，保持基本水平就好。
              </p>
              <div className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 text-xs text-[rgba(10,10,26,0.7)]">
                <strong>守护目标：</strong>通过适度关注，<span className="font-black text-[rgba(10,10,26,0.7)]">保持在合格线以上</span>即可——把更多精力放在优势深耕和潜力激活上，性价比更高！
              </div>
            </div>
          </div>
        </div>

        {/* 成长优先级排序 */}
        <div className="bg-white border border-[rgba(10,10,26,0.06)] rounded-2xl p-6">
          <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#3B5FD9] text-white text-sm font-semibold">P</span>
            成长优先级排序
          </h4>
          <p className="text-sm text-gray-500 mb-4 bg-gray-50 rounded-lg p-3">
            家长常问："{d.student.name}这么多方面都要培养，我到底先抓哪个？"——别急，我们按照<strong>"投入产出比最高"</strong>的原则，帮您排好了优先级：
          </p>
          <div className="space-y-4">
            {/* P0 立即执行 */}
            <div className="p-4 bg-white rounded-xl border border-[rgba(10,10,26,0.06)] border-l-4 border-l-red-500">
              <div className="flex items-start gap-4">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">P0</span>
                <div className="flex-1">
                  <p className="font-bold text-[#0A0A1A] text-lg mb-1">立即执行</p>
                  <p className="text-sm text-gray-700">
                    <strong className="text-[#3B5FD9]">{d.sortedDims[0]?.name}</strong>是{d.student.name}最耀眼的潜能！趁热打铁，现在就开始强化——帮TA建立"发现问题→动手验证→清晰表达"的完整闭环，让优势变成习惯！
                  </p>
                </div>
              </div>
            </div>

            {/* P1 90天内启动 */}
            <div className="p-4 bg-white rounded-xl border border-[rgba(10,10,26,0.06)] border-l-4 border-l-amber-500">
              <div className="flex items-start gap-4">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">P1</span>
                <div className="flex-1">
                  <p className="font-bold text-[#0A0A1A] text-lg mb-1">短期启动</p>
                  <p className="text-sm text-gray-700">
                    {d.student.name}的<strong className="text-amber-600">{d.sortedDims[4]?.name}</strong>和<strong className="text-amber-600">{d.sortedDims[5]?.name}</strong>需要通过"微训练"来唤醒——每天碎片时间积累，短期内即可看到变化。
                  </p>
                </div>
              </div>
            </div>

            {/* P2 6个月规划 */}
            <div className="p-4 bg-white rounded-xl border border-[rgba(10,10,26,0.06)] border-l-4 border-l-blue-500">
              <div className="flex items-start gap-4">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">P2</span>
                <div className="flex-1">
                  <p className="font-bold text-[#0A0A1A] text-lg mb-1">6个月规划</p>
                  <p className="text-sm text-gray-700">
                    带{d.student.name}完成<strong className="text-[#3B5FD9]">第一个完整的探究项目</strong>——从选题、调研、实验到展示，让TA亲身体验"从0到1"的成就感。
                  </p>
                </div>
              </div>
            </div>

            {/* P3 长期布局 */}
            <div className="p-4 bg-white rounded-xl border border-[rgba(10,10,26,0.06)] border-l-4 border-l-slate-400">
              <div className="flex items-start gap-4">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[rgba(59,95,217,0.06)] text-[rgba(10,10,26,0.7)]">P3</span>
                <div className="flex-1">
                  <p className="font-bold text-[#0A0A1A] text-lg mb-1">长期布局</p>
                  <p className="text-sm text-gray-700">
                    根据{d.student.name}的兴趣和潜能组合，逐步锁定1-2个<strong className="text-[rgba(10,10,26,0.6)]">深耕领域</strong>，开始积累"拿得出手"的作品集——这将成为TA未来申请学校、参加竞赛、甚至简历上的亮点！
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 导航引导 */}
        <div className="flex justify-center mt-6 mb-2">
          <button 
            onClick={() => document.getElementById('section-this-week')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 font-medium transition-colors"
          >
            继续了解本周行动计划 <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default ReportOverview
