// ===================================================================
// GROWMATE AI-Native 引擎 — AI 洞察展示组件 v1.0.0
// 包含：因果链、双视角评估、涌现人才三个核心组件
// ===================================================================

import { useState, useEffect } from 'react'
import type { CausalChain, DualPerspectiveReport, EmergentTalent, VectorPoint } from '../../lib/ai/types'

// ============================================================
// 通用样式常量
// ============================================================

// style constant removed
const CARD_BG = 'bg-white rounded-xl shadow-sm border border-slate-200'
const HEADER_GRADIENT = 'bg-gradient-to-r from-indigo-600 to-purple-600'

// ============================================================
// 组件 1: AI 思维链因果链展示
// ============================================================

interface CoTCausalChainProps {
  causalChains: CausalChain[] | null
  loading?: boolean
  error?: string | null
  studentName: string
}

export function CoTCausalChainSection({ causalChains, loading = false, error, studentName }: CoTCausalChainProps) {
  if (loading) {
    return <CoTLoadingSkeleton />
  }

  if (error) {
    return <CoTErrorFallback error={error} />
  }

  if (!causalChains || causalChains.length === 0) {
    return null
  }

  return (
    <section className={`${CARD_BG} p-6 mb-6`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-lg ${HEADER_GRADIENT} flex items-center justify-center text-white`}>
          🧠
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">AI 思维链推理</h2>
          <p className="text-sm text-slate-500">基于因果链的深度学习分析</p>
        </div>
        <div className="ml-auto px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
          AI 生成
        </div>
      </div>

      <div className="space-y-6">
        {causalChains.map((chain, index) => (
          <CausalChainCard key={index} chain={chain} studentName={studentName} index={index} />
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
        <p className="text-xs text-amber-700">
          💡 <strong>说明：</strong>此分析基于 WILDER 评估数据和因果推理模型生成，反映 AI 对{studentName}能力发展路径的概率推断。建议结合实际情况综合判断。
        </p>
      </div>
    </section>
  )
}

// 单个因果链卡片
function CausalChainCard({ chain, studentName: _studentName, index }: { chain: CausalChain; studentName: string; index: number }) {
  const [isExpanded, setIsExpanded] = useState(index === 0)

  const dimensionColors: Record<string, string> = {
    W: 'bg-blue-100 text-blue-800 border-blue-300',
    I: 'bg-purple-100 text-purple-800 border-purple-300',
    L: 'bg-green-100 text-green-800 border-green-300',
    D: 'bg-amber-100 text-amber-800 border-amber-300',
    E: 'bg-rose-100 text-rose-800 border-rose-300',
    R: 'bg-teal-100 text-teal-800 border-teal-300',
  }

  const dimensionNames: Record<string, string> = {
    W: '好奇心', I: '探究力', L: '连接力', D: '设计力', E: '表达力', R: '反思力'
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">
            {chain.chainType === 'behavioral' || chain.chainType === 'cognitive' ? '🌟' : chain.chainType === 'social' ? '⚠️' : '🔄'}
          </span>
          <span className="font-medium text-slate-800">{chain.chainTitle}</span>
        </div>
        <svg
          className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* 观察层 */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">观察 Observation</span>
                {chain.primaryDimension && (
                  <span className={`px-2 py-0.5 rounded text-xs border ${dimensionColors[chain.primaryDimension] || ''}`}>
                    {dimensionNames[chain.primaryDimension] || chain.primaryDimension}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-700">{chain.observations[0]?.text || (chain.summary ?? '').split('→')[0]}</p>
            </div>
          </div>

          {/* 箭头 */}
          <div className="flex justify-center">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* 推断层 */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">推断 Inference</span>
              </div>
              <p className="text-sm text-slate-700">{chain.inferences[0]?.text || (chain.summary ?? '').split('→')[1] || 'AI 推断中...'}</p>
            </div>
          </div>

          {/* 箭头 */}
          <div className="flex justify-center">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* 预测层 */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-green-700 uppercase tracking-wide">预测 Prediction</span>
                {chain.predictions[0]?.confidence && (
                  <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 border border-green-300">
                    置信度 {Math.round(chain.predictions[0].confidence * 100)}%
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-700">{chain.predictions[0]?.text || (chain.summary ?? '').split('→')[2] || 'AI 预测中...'}</p>
            </div>
          </div>

          {/* 干预建议 */}
          {chain.interventions && chain.interventions.length > 0 && (
            <>
              <div className="border-t border-slate-200 pt-3 mt-3">
                <h4 className="text-sm font-medium text-slate-800 mb-2">💡 建议干预措施</h4>
                <ul className="space-y-1">
                  {chain.interventions.map((intervention, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{intervention.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// 加载骨架屏
function CoTLoadingSkeleton() {
  return (
    <section className={`${CARD_BG} p-6 mb-6 animate-pulse`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-slate-200" />
        <div className="space-y-2">
          <div className="h-5 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-48 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-slate-100 rounded-lg" />
        ))}
      </div>
    </section>
  )
}

// 错误降级
function CoTErrorFallback({ error }: { error: string }) {
  return (
    <section className={`${CARD_BG} p-6 mb-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg ${HEADER_GRADIENT} flex items-center justify-center text-white`}>
          🧠
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">AI 思维链推理</h2>
          <p className="text-sm text-slate-500">基于因果链的深度学习分析</p>
        </div>
      </div>
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
        <p className="text-sm text-amber-800">
          ⚠️ AI 推理服务暂时不可用，已降级为基础分析模式。
        </p>
        <p className="text-xs text-amber-600 mt-1">
          错误信息：{error}
        </p>
      </div>
    </section>
  )
}

// ============================================================
// 组件 2: 双 Agent 对冲评估展示
// ============================================================

interface DualAgentSectionProps {
  dualPerspective: DualPerspectiveReport | null
  loading?: boolean
  error?: string | null
  studentName: string
}

export function DualAgentSection({ dualPerspective, loading = false, error, studentName: _studentName }: DualAgentSectionProps) {
  if (loading) {
    return <DualAgentLoadingSkeleton />
  }

  if (error) {
    return <DualAgentErrorFallback error={error} />
  }

  if (!dualPerspective) {
    return null
  }

  return (
    <section className={`${CARD_BG} p-6 mb-6`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-lg ${HEADER_GRADIENT} flex items-center justify-center text-white`}>
          ⚖️
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">双视角对冲评估</h2>
          <p className="text-sm text-slate-500">风险官 × 成长策略师 AI 对冲分析</p>
        </div>
        <div className="ml-auto px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
          AI 生成
        </div>
      </div>

      {/* 执行摘要 */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
        <h3 className="text-sm font-semibold text-indigo-900 mb-2">📋 执行摘要</h3>
        <p className="text-sm text-indigo-800 leading-relaxed">{dualPerspective.executiveSummary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Agent A: 风险官 */}
        <AgentCard
          agent={dualPerspective.riskOfficer}
          type="risk"
          title="🛡️ 风险官视角"
          subtitle="保守评估 T=0.3"
        />

        {/* Agent B: 成长策略师 */}
        <AgentCard
          agent={dualPerspective.strategist}
          type="opportunity"
          title="🚀 成长策略师视角"
          subtitle="创新评估 T=0.7"
        />
      </div>

      {/* 共识与分歧 */}
      <div className="space-y-4">
        {/* 共识 */}
        {dualPerspective.synthesis.consensusZones && dualPerspective.synthesis.consensusZones.length > 0 && (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <h3 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
              ✅ 双视角共识 ({dualPerspective.synthesis.consensusZones.length})
            </h3>
            <ul className="space-y-2">
              {dualPerspective.synthesis.consensusZones.map((point, i) => (
                <li key={i} className="text-sm text-green-800">
                  <span className="font-medium">{point.topic}</span>
                  {point.sharedConclusion && <span className="text-green-600 ml-2">— {point.sharedConclusion}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 分歧 */}
        {dualPerspective.synthesis.divergenceZones && dualPerspective.synthesis.divergenceZones.length > 0 && (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
              ⚡ 视角分歧 ({dualPerspective.synthesis.divergenceZones.length})
            </h3>
            <ul className="space-y-3">
              {dualPerspective.synthesis.divergenceZones.map((point, i) => (
                <li key={i} className="text-sm">
                  <div className="font-medium text-amber-900 mb-1">{point.topic}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-red-50 text-red-700">
                      <span className="font-medium">风险官：</span>{point.riskOfficerPosition}
                    </div>
                    <div className="p-2 rounded bg-blue-50 text-blue-700">
                      <span className="font-medium">策略师：</span>{point.strategistPosition}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
        <p className="text-xs text-amber-700">
          💡 <strong>说明：</strong>双视角对冲通过风险官（保守）和成长策略师（创新）的并行评估，识别能力发展的潜在风险和机会。共识项优先级最高，分歧项需结合实际情况判断。
        </p>
      </div>
    </section>
  )
}

// Agent 卡片
function AgentCard({
  agent,
  type,
  title,
  subtitle,
}: {
  agent: any
  type: 'risk' | 'opportunity'
  title: string
  subtitle: string
}) {
  const borderColor = type === 'risk' ? 'border-red-200' : 'border-blue-200'
  const headerBg = type === 'risk' ? 'bg-red-50' : 'bg-blue-50'
  const textColor = type === 'risk' ? 'text-red-900' : 'text-blue-900'
  const itemBg = type === 'risk' ? 'bg-red-50' : 'bg-blue-50'
  const itemText = type === 'risk' ? 'text-red-800' : 'text-blue-800'

  return (
    <div className={`rounded-lg border ${borderColor} overflow-hidden`}>
      <div className={`px-4 py-3 ${headerBg}`}>
        <h3 className={`font-semibold ${textColor}`}>{title}</h3>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      <div className="p-4 space-y-3">
        {/* 核心发现 */}
        {agent.coreFinding && (
          <div>
            <h4 className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">核心发现</h4>
            <p className="text-sm text-slate-700">{agent.coreFinding}</p>
          </div>
        )}

        {/* 关键维度 */}
        {agent.keyDimensions && agent.keyDimensions.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">关键维度</h4>
            <div className="space-y-2">
              {agent.keyDimensions.map((dim: any, i: number) => (
                <div key={i} className={`p-2 rounded ${itemBg}`}>
                  <div className={`text-sm font-medium ${itemText}`}>
                    {dim.name}
                  </div>
                  {dim.concern && <div className="text-xs text-slate-600 mt-0.5">{dim.concern}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 建议 */}
        {agent.recommendations && agent.recommendations.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">建议</h4>
            <ul className="space-y-1">
              {agent.recommendations.map((rec: string, i: number) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

// 加载骨架屏
function DualAgentLoadingSkeleton() {
  return (
    <section className={`${CARD_BG} p-6 mb-6 animate-pulse`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-slate-200" />
        <div className="space-y-2">
          <div className="h-5 w-40 bg-slate-200 rounded" />
          <div className="h-3 w-52 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="h-16 bg-slate-100 rounded-lg mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 bg-slate-100 rounded-lg" />
        <div className="h-48 bg-slate-100 rounded-lg" />
      </div>
    </section>
  )
}

// 错误降级
function DualAgentErrorFallback({ error }: { error: string }) {
  return (
    <section className={`${CARD_BG} p-6 mb-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg ${HEADER_GRADIENT} flex items-center justify-center text-white`}>
          ⚖️
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">双视角对冲评估</h2>
          <p className="text-sm text-slate-500">风险官 × 成长策略师 AI 对冲分析</p>
        </div>
      </div>
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
        <p className="text-sm text-amber-800">
          ⚠️ 双视角评估服务暂时不可用，已降级为基础分析模式。
        </p>
        <p className="text-xs text-amber-600 mt-1">
          错误信息：{error}
        </p>
      </div>
    </section>
  )
}

// ============================================================
// 组件 3: 涌现人才展示
// ============================================================

interface EmergentTalentsSectionProps {
  emergentTalents: EmergentTalent[] | null
  vectorPoint: VectorPoint | null
  loading?: boolean
  studentName: string
}

export function EmergentTalentsSection({ emergentTalents, vectorPoint, loading = false, studentName: _studentName }: EmergentTalentsSectionProps) {
  if (loading) {
    return <EmergentTalentsLoadingSkeleton />
  }

  if (!emergentTalents || emergentTalents.length === 0) {
    return null
  }

  return (
    <section className={`${CARD_BG} p-6 mb-6`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-lg ${HEADER_GRADIENT} flex items-center justify-center text-white`}>
          ✨
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">涌现人才探测</h2>
          <p className="text-sm text-slate-500">跨维度组合产生的特殊能力模式</p>
        </div>
        <div className="ml-auto px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          {emergentTalents.length} 项探测
        </div>
      </div>

      {/* 向量空间可视化 */}
      {vectorPoint && (
        <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">📐 16 维向量空间坐标</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(vectorPoint.rawDimensions).map(([dim, value]) => (
              <div key={dim} className="p-2 rounded bg-white border border-slate-200">
                <div className="text-xs text-slate-500 uppercase">{dim}</div>
                <div className="text-lg font-bold text-slate-800">{Math.round(value * 100)}%</div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 涌现人才列表 */}
      <div className="space-y-4">
        {emergentTalents.map((talent, index) => (
          <EmergentTalentCard key={index} talent={talent} index={index} />
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
        <p className="text-xs text-blue-700">
          💡 <strong>什么是涌现人才？</strong>当两个通常不相关的能力维度同时表现出色时，会产生"1+1{'>'}2"的协同效应，形成独特的复合能力。这种能力在标准评估中容易被忽略，但往往是未来竞争力的关键。
        </p>
      </div>
    </section>
  )
}

// 涌现人才卡片
function EmergentTalentCard({ talent, index }: { talent: EmergentTalent; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const pairColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-indigo-500 to-purple-500',
  ]

  const colorClass = pairColors[index % pairColors.length]

  // 从 emergentPattern 提取维度对，格式如 "W+D 创新者"
  const patternMatch = talent.emergentPattern?.match(/^([A-Z])\+([A-Z])/) || []
  const dim1 = patternMatch[1] || '?'
  const dim2 = patternMatch[2] || '?'

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center text-white text-xs font-bold`}>
            {dim1}×{dim2}
          </div>
          <div className="text-left">
            <div className="font-medium text-slate-800">{talent.emergentPattern || '涌现能力'}</div>
            <div className="text-xs text-slate-500">置信度 {Math.round((talent.confidence || 0) * 100)}%</div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-3">
          <p className="text-sm text-slate-700">{talent.narrativeHint || '这是一种独特的跨维度能力组合。'}</p>

          {talent.crossDimensionSignals && Object.keys(talent.crossDimensionSignals).length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">交叉维度信号</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(talent.crossDimensionSignals).map(([key, value]) => (
                  <span key={key} className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs">
                    {key}: {Math.round((value as number) * 100)}%
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>独特性: {talent.uniqueness || 0}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

// 加载骨架屏
function EmergentTalentsLoadingSkeleton() {
  return (
    <section className={`${CARD_BG} p-6 mb-6 animate-pulse`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-slate-200" />
        <div className="space-y-2">
          <div className="h-5 w-36 bg-slate-200 rounded" />
          <div className="h-3 w-44 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="h-20 bg-slate-100 rounded-lg" />
        ))}
      </div>
    </section>
  )
}

// ============================================================
// 组件 4: AI 功能总控面板（可选）
// ============================================================

interface AIInsightPanelProps {
  studentName: string
  scores: any
  enhancedReport: any
  evidenceChain?: any
}

/**
 * AI 洞察面板 Hook
 * 在组件中调用此 hook 可管理所有 AI 增强数据的加载状态
 */
export function useAIInsights({ studentName, scores, enhancedReport, evidenceChain }: AIInsightPanelProps) {
  const [causalChains, setCausalChains] = useState<CausalChain[] | null>(null)
  const [dualPerspective, setDualPerspective] = useState<DualPerspectiveReport | null>(null)
  const [loading, setLoading] = useState({ cot: false, dualAgent: false })
  const [errors, setErrors] = useState({ cot: null as string | null, dualAgent: null as string | null })

  useEffect(() => {
    let cancelled = false

    async function loadAIInsights() {
      setLoading({ cot: true, dualAgent: true })

      try {
        const { initAIEnhancement } = await import('../../lib/aiReportEnhancer')
        const { asyncPromise } = initAIEnhancement(
          { name: studentName, age: 10, grade: '', school: '', testDate: '' },
          scores,
          enhancedReport,
          evidenceChain
        )

        const result = await asyncPromise

        if (!cancelled) {
          setCausalChains(result.causalChains)
          setDualPerspective(result.dualPerspective)
          setErrors({ cot: result.cotError, dualAgent: result.dualError })
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[AIInsights] Failed to load:', err)
          setErrors({
            cot: err instanceof Error ? err.message : '加载失败',
            dualAgent: err instanceof Error ? err.message : '加载失败',
          })
        }
      } finally {
        if (!cancelled) {
          setLoading({ cot: false, dualAgent: false })
        }
      }
    }

    loadAIInsights()
    return () => { cancelled = true }
  }, [studentName, scores, enhancedReport, evidenceChain])

  return {
    causalChains,
    dualPerspective,
    loading,
    errors,
  }
}
