/**
 * ReportCover.tsx - 报告封面区域组件
 * 
 * 功能: 报告页面的封面/头部区域
 * 包含:
 * - 品牌栏
 * - 主标题区（学员名称、天赋类型）
 * - 学员信息卡
 * - 30秒速览卡片
 * - 核心模型展示
 * - 底部签章
 */

import React from 'react'
import { Zap } from 'lucide-react'
import { WilderLogoReport } from './ui/WilderLogo'
import { WilderDimensionsGrid } from './ui/WilderDimensionIcon'
import type { DynamicReportData } from '../lib/reportContentGenerator'
import { generateQuickSummary } from '../lib/reportContentGenerator'
import { TALENT_TYPES_30 } from '../lib/talentTypes30'
import { TalentPersonaCard } from './TalentPersonaCard'

// ========== 术语解释组件 ==========
function GlossaryTerm({ term, children }: { term: string; children?: React.ReactNode }) {
  const [showTooltip, setShowTooltip] = React.useState(false)
  const GLOSSARY: Record<string, { detail: string }> = {
    '多元智能': { detail: '加德纳提出的多元智能理论，认为人类智能是多元的，包括语言、逻辑数学、空间、音乐、身体运动、人际、内省、自然观察等八种智能。' },
    '大五人格': { detail: '大五人格模型（Big Five），将人格分为开放性、尽责性、外向性、宜人性和神经质五个维度，是心理学界广泛认可的人格理论。' },
  }
  const entry = GLOSSARY[term]
  if (!entry) return <>{children || term}</>
  
  return (
    <span className="relative inline-block">
      <span
        className="border-b border-dashed border-[rgba(10,10,26,0.15)] cursor-help text-inherit"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children || term}
      </span>
      {showTooltip && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#0A0A1A] text-white text-xs rounded-lg shadow-xl">
          <span className="font-bold block mb-1">{term}</span>
          <span className="text-[rgba(255,255,255,0.5)]">{entry.detail}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  )
}

// ========== Props 接口 ==========
export interface ReportCoverProps {
  /** 报告数据 */
  reportData: DynamicReportData
  /** 章节追踪函数 */
  trackSection?: (element: HTMLElement | null) => void
}

/**
 * 报告封面组件
 */
export const ReportCover: React.FC<ReportCoverProps> = ({
  reportData: d,
  trackSection,
}) => {
  const quickSummary = generateQuickSummary(d.wilderScores, d.wilderPercentiles, d.student.name)
  
  // 获取30类型诗意内容
  const t30 = d.talentType30 || (d.talentType30Key ? TALENT_TYPES_30[d.talentType30Key] : null)
  const poetryLine = t30?.poetryLine || '目光如炬探万物，巧手验真知。以结构化思维编织发现之网。'
  const poetryQuote = t30?.poetryQuote || '"格物致知穷至理，观微知著见天心"'

  return (
    <section id="section-cover" ref={trackSection}>
      <header className="relative bg-white overflow-hidden">
        {/* 顶部品牌色块条 */}
        <div className="h-3 bg-[#3B5FD9]"></div>

        <div className="p-6 sm:p-8 lg:p-10">
          {/* 顶部品牌栏 */}
          <div className="flex items-start justify-between mb-10">
            <WilderLogoReport studentName={d.student.name} />
            <div className="text-right">
              <div className="border border-[rgba(10,10,26,0.06)] rounded-lg px-4 py-2 bg-[rgba(59,95,217,0.04)]">
                <p className="text-[rgba(10,10,26,0.5)] text-[10px] uppercase tracking-[0.2em] mb-0.5">Growth Planning</p>
                <p className="text-[#0A0A1A] font-bold text-sm">长期成长规划</p>
              </div>
            </div>
          </div>

          {/* 主标题区 */}
          <div className="text-center py-6 sm:py-10">
            <p className="text-[rgba(10,10,26,0.5)] text-xs sm:text-sm font-medium tracking-[0.3em] mb-4 uppercase">Talent Development Strategy Report</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A0A1A] mb-6 leading-tight">
              <span className="text-[#3B5FD9]">[{d.student.name}]</span> 的<br />专属潜能解码蓝图
            </h2>

            {/* 探索者分型标签 */}
            <p className="text-[rgba(10,10,26,0.5)] text-xs tracking-wider mb-3">WILDER-729 科学探索力交叉分型：</p>

            {/* 品牌金胶囊 */}
            <div className="inline-flex items-center gap-3 bg-[#FDD22B] rounded-full px-8 sm:px-10 py-3 shadow-md">
              <span className="text-[#0A0A1A] font-black text-lg sm:text-xl tracking-wide">{d.talentType}</span>
              <span className="text-[rgba(10,10,26,0.6)] text-lg">·</span>
              <span className="text-[rgba(10,10,26,0.7)] font-bold text-base sm:text-lg tracking-wider">{d.talentTypeEn}</span>
            </div>

            {/* 诗意描述 - 简洁引用样式 */}
            <div className="mt-6 max-w-xl mx-auto">
              <div className="border-l-4 border-[#FDD22B] pl-4 text-left">
                <p className="text-[rgba(10,10,26,0.7)] text-base sm:text-lg font-medium leading-relaxed italic">
                  {poetryLine}
                </p>
                <p className="mt-2 text-[rgba(10,10,26,0.5)] text-sm italic">
                  {poetryQuote}
                </p>
              </div>
            </div>
          </div>

          {/* 学员信息卡 - 白卡+品牌蓝左竖条 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 mt-4 border border-[rgba(10,10,26,0.06)] border-l-4 border-l-[#3B5FD9]">
            <div className="flex flex-col md:flex-row items-center gap-5">
              {/* 姓名展示区 */}
              <div className="min-w-[5rem] px-5 py-4 rounded-xl bg-[#3B5FD9] flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-black text-white tracking-wider">{d.student.name}</span>
              </div>

              {/* 基础信息 */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1.5">
                  <span className="border border-[#3B5FD9] text-[#3B5FD9] text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wider">WILDER-729</span>
                </div>
                <p className="text-[rgba(10,10,26,0.6)] text-sm">{d.student.age}岁 · {d.student.grade}{d.student.school ? ` · ${d.student.school}` : ''}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                  <span className="border border-[rgba(10,10,26,0.06)] bg-[rgba(59,95,217,0.04)] px-3 py-1 rounded text-xs">
                    <span className="text-[rgba(10,10,26,0.5)]">测评日期</span> <span className="text-[rgba(10,10,26,0.7)] font-medium ml-1">{d.student.testDate}</span>
                  </span>
                  <span className="border border-[rgba(10,10,26,0.06)] bg-[rgba(59,95,217,0.04)] px-3 py-1 rounded text-xs">
                    <span className="text-[rgba(10,10,26,0.5)]">报告版本</span> <span className="text-[rgba(10,10,26,0.7)] font-medium ml-1">{d.reportVersion}</span>
                  </span>
                  <span className="border border-[#FDD22B] bg-[#FDD22B]/10 px-3 py-1 rounded text-xs">
                    <span className="text-[rgba(10,10,26,0.6)]">置信度</span> <span className="text-[#0A0A1A] font-bold ml-1">{d.confidence}%</span>
                  </span>
                </div>
              </div>

              {/* 画像编码 */}
              <div className="text-center md:text-right flex-shrink-0">
                <div className="border border-[rgba(10,10,26,0.06)] rounded-xl p-3 bg-[rgba(59,95,217,0.04)]">
                  <p className="text-[10px] text-[rgba(10,10,26,0.5)] mb-1 tracking-wider">画像编码</p>
                  <p className="text-lg font-mono font-bold text-[#3B5FD9] tracking-widest">{d.profileCode}</p>
                  <p className="text-[10px] text-[rgba(10,10,26,0.5)] mt-0.5">变体 #{d.variantId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 天赋人设海报 - 社交货币层 */}
          <div className="mt-6">
            <TalentPersonaCard reportData={d} showMomentsText={true} />
          </div>

          {/* 30秒速览卡片 - 蓝到Teal渐变 */}
          <div className="mt-6 rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94]">
            {/* 标题 */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white text-sm">⚡</span>
              <h3 className="text-white font-bold text-lg tracking-wide">30秒速览</h3>
              <span className="text-[10px] text-white/70 bg-white/10 px-2 py-0.5 rounded-full ml-1">快速了解核心结论</span>
            </div>

            <div className="space-y-4">
              {/* 核心特质描述 */}
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-xl sm:text-2xl font-black text-white leading-relaxed">
                  {quickSummary.coreTraitLine}
                </p>
              </div>

              {/* 最突出能力 */}
              <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#FDD22B] flex items-center justify-center">
                    <span className="text-[#0A0A1A] text-lg">★</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[#FDD22B] text-base sm:text-lg font-bold">{quickSummary.topStrength}</p>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FDD22B] rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (d.sortedDims[0]?.score || 70))}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* 本周行动建议 */}
              <div className="flex items-start gap-3 bg-white/10 rounded-xl p-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-white text-sm">→</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white/90 text-sm sm:text-base font-medium leading-relaxed">{quickSummary.oneAction}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 底部签章 */}
          <div className="mt-5 pt-5 border-t border-[rgba(10,10,26,0.06)]">
            {/* 核心模型展示 */}
            <div className="mb-4">
              <p className="text-[10px] text-[rgba(10,10,26,0.5)] mb-2">核心测评模型</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[#3B5FD9]/10 border border-[#3B5FD9]/20 rounded-full px-3 py-1">
                  <Zap className="w-3 h-3 text-[#3B5FD9]" />
                  <span className="text-[#3B5FD9] text-[10px] font-bold">WILDER科创力模型</span>
                  <span className="text-[8px] text-[#3B5FD9] bg-[#3B5FD9]/10 px-1 rounded">独家</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[rgba(59,95,217,0.04)] border border-[rgba(10,10,26,0.06)] rounded-full px-3 py-1">
                  <span className="text-[#3B5FD9] text-[10px]">●</span>
                  <span className="text-[rgba(10,10,26,0.6)] text-[10px]">加德纳<GlossaryTerm term="多元智能">多元智能</GlossaryTerm></span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[rgba(59,95,217,0.04)] border border-[rgba(10,10,26,0.06)] rounded-full px-3 py-1">
                  <span className="text-[#3B5FD9] text-[10px]">●</span>
                  <span className="text-[rgba(10,10,26,0.6)] text-[10px]"><GlossaryTerm term="大五人格">大五人格</GlossaryTerm>特质</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[rgba(59,95,217,0.04)] border border-[rgba(10,10,26,0.06)] rounded-full px-3 py-1">
                  <span className="text-[#3B5FD9] text-[10px]">●</span>
                  <span className="text-[rgba(10,10,26,0.6)] text-[10px]">心流理论</span>
                </span>
              </div>
            </div>

            {/* WILDER 六维图标展示 */}
            <div className="mb-4 py-4 border-t border-dashed border-[rgba(10,10,26,0.06)]">
              <WilderDimensionsGrid size="sm" showLabel={true} />
            </div>

            <div className="flex items-end justify-between">
              <div className="text-xs text-[rgba(10,10,26,0.5)]">
                <p>生成日期：{d.reportDate}</p>
                <p className="text-[10px] mt-0.5 text-[rgba(10,10,26,0.35)]">本报告基于WILDER-729科创天赋力评估模型生成</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[rgba(10,10,26,0.5)] mb-1">课题支持</p>
                <div className="border border-[#3B5FD9]/20 bg-[#3B5FD9]/5 rounded px-3 py-1.5">
                  <p className="text-[#3B5FD9] font-bold text-[10px]">中科院教育AI+实验室</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </section>
  )
}

export default ReportCover
