/**
 * EvidenceChain.tsx - 证据链高光组件
 *
 * L5 信任层核心组件
 * 功能: 展示高光时刻、天才级解读、成长证言
 * 目标: 完成从"有趣"到"信服"的转化，建立专业信任
 */

import React from 'react'
import { Award, TrendingUp, Lightbulb, Shield, Sparkles, Quote, CheckCircle } from 'lucide-react'
import { generateEvidenceChain, type EvidenceChainResult } from '../lib/evidenceChainEngine'
import type { DynamicReportData } from '../lib/reportContentGenerator'
import type { WilderDimension } from '../lib/wilderKernel'

// ========== Props 接口 ==========

export interface EvidenceChainProps {
  /** 报告数据 */
  reportData: DynamicReportData
}

// ========== 维度颜色映射 ==========

const DIMENSION_COLORS: Record<WilderDimension, { bg: string; text: string; accent: string }> = {
  W: { bg: 'bg-purple-100', text: 'text-purple-600', accent: 'bg-purple-500' },
  I: { bg: 'bg-blue-100', text: 'text-blue-600', accent: 'bg-blue-500' },
  L: { bg: 'bg-green-100', text: 'text-green-600', accent: 'bg-green-500' },
  D: { bg: 'bg-orange-100', text: 'text-orange-600', accent: 'bg-orange-500' },
  E: { bg: 'bg-pink-100', text: 'text-pink-600', accent: 'bg-pink-500' },
  R: { bg: 'bg-indigo-100', text: 'text-indigo-600', accent: 'bg-indigo-500' }
}

const DIMENSION_ICONS: Record<WilderDimension, string> = {
  W: '🔭', I: '🔬', L: '🤝', D: '📐', E: '🎤', R: '🧘'
}

// ========== 证据链组件 ==========

export const EvidenceChain: React.FC<EvidenceChainProps> = ({
  reportData: d
}) => {
  // 解析维度
  const weakDims = getWeakDimensions(d.wilderPercentiles)
  const strongDims = getStrongDimensions(d.wilderPercentiles)

  // 生成证据链
  const evidence: EvidenceChainResult = generateEvidenceChain({
    name: d.student.name,
    age: d.student.age,
    profileCode: d.profileCode,
    wilderScores: d.wilderScores,
    wilderPercentiles: d.wilderPercentiles,
    strongDimensions: strongDims,
    weakDimensions: weakDims,
    talentType: d.talentType,
    confidence: d.confidence
  })

  return (
    <section id="section-evidence-chain" className="relative">
      {/* 顶部专业背书条 */}
      <div className="bg-gradient-to-r from-[#0A0A1A] to-[#2a2a4e] px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#FDD22B]" />
          <div>
            <h3 className="font-bold text-lg">证据链与高光重现</h3>
            <p className="text-white/60 text-sm">基于真实数据的深度洞察</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-slate-50 to-white p-6 sm:p-8">
        {/* 核心发现总结 */}
        <div className="mb-8 p-5 bg-white rounded-xl border border-[rgba(10,10,26,0.06)] shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3B5FD9] flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#3B5FD9] uppercase tracking-wider mb-2">核心发现</p>
              <p className="text-sm text-[rgba(10,10,26,0.7)] leading-relaxed">
                {evidence.coreFindings}
              </p>
            </div>
          </div>
        </div>

        {/* 高光时刻 */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-5 h-5 text-[#FDD22B]" />
            <h4 className="text-lg font-bold text-[#0A0A1A]">测评高光时刻</h4>
            <span className="text-xs text-[rgba(10,10,26,0.4)] bg-[rgba(10,10,26,0.03)] px-2 py-0.5 rounded-full">
              基于真实答题表现
            </span>
          </div>

          <div className="space-y-6">
            {evidence.highlightMoments.map((moment, index) => {
              const colors = DIMENSION_COLORS[moment.relatedDimension]
              return (
                <div key={index} className="bg-white rounded-xl border border-[rgba(10,10,26,0.06)] overflow-hidden shadow-sm">
                  {/* 高光头部 */}
                  <div className={`${colors.bg} px-5 py-4 border-b border-[rgba(10,10,26,0.04)]`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{DIMENSION_ICONS[moment.relatedDimension]}</span>
                        <div>
                          <h5 className="font-bold text-[#0A0A1A]">{moment.title}</h5>
                          <p className={`text-xs ${colors.text}`}>{moment.dimensionName}潜能爆发</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-[#FDD22B]" />
                          <span className="text-sm font-bold text-[#0A0A1A]">潜力评分</span>
                        </div>
                        <p className="text-2xl font-black text-[#FDD22B]">{moment.potentialScore}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* 场景描述 */}
                    <div>
                      <p className="text-xs font-bold text-[rgba(10,10,26,0.4)] uppercase tracking-wider mb-2">
                        答题场景重现
                      </p>
                      <p className="text-sm text-[rgba(10,10,26,0.7)] leading-relaxed italic">
                        "{moment.scenario}"
                      </p>
                    </div>

                    {/* 表现分析 */}
                    <div className="bg-[rgba(10,10,26,0.02)] rounded-lg p-4">
                      <p className="text-sm text-[rgba(10,10,26,0.7)]">{moment.performance}</p>
                    </div>

                    {/* 数据指标 */}
                    <div className="grid grid-cols-2 gap-3">
                      {moment.metrics.map((metric, i) => (
                        <div key={i} className="bg-[#3B5FD9]/5 rounded-lg p-3">
                          <p className="text-xs text-[rgba(10,10,26,0.5)]">{metric.label}</p>
                          <p className="text-lg font-bold text-[#0A0A1A]">{metric.value}</p>
                          <p className="text-xs text-[#3B5FD9]">{metric.significance}</p>
                        </div>
                      ))}
                    </div>

                    {/* 天才级解读 */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-100">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                            天才级解读
                          </p>
                          <p className="text-sm text-[rgba(10,10,26,0.8)] leading-relaxed">
                            {moment.geniusInterpretation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 成长证言 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Quote className="w-5 h-5 text-[#3B5FD9]" />
            <h4 className="text-lg font-bold text-[#0A0A1A]">成长证言</h4>
          </div>

          <div className="bg-gradient-to-br from-[#3B5FD9]/5 to-[#0F9D94]/5 rounded-xl p-6 border border-[#3B5FD9]/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#3B5FD9] flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[rgba(10,10,26,0.5)] mb-2">
                  {evidence.testimony.witnessTitle}
                </p>
                <p className="text-[rgba(10,10,26,0.8)] leading-relaxed mb-4">
                  {evidence.testimony.testimony}
                </p>
                <div className="flex items-center gap-4 text-xs text-[rgba(10,10,26,0.5)]">
                  <span>数据支撑：{evidence.testimony.dataSupport}</span>
                  <span className="text-[rgba(10,10,26,0.2)]">|</span>
                  <span>{evidence.testimony.credential}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 专业背书声明 */}
        <div className="p-5 bg-[#0A0A1A] rounded-xl text-white">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#FDD22B] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-[#FDD22B] uppercase tracking-wider mb-2">专业声明</p>
              <p className="text-sm text-white/80 leading-relaxed">
                {evidence.authorityDeclaration}
              </p>
            </div>
          </div>
        </div>

        {/* 底部信任标签 */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[rgba(10,10,26,0.4)]">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            729种画像交叉验证
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            197个多态评估模型
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            中科院教育AI+实验室支持
          </span>
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

export default EvidenceChain
