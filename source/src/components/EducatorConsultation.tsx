/**
 * 教育学家虚拟专家讨论系统 UI 组件
 * 展示10位历史教育学家基于 WILDER 测评数据的讨论过程和教育建议
 */

import { useState, useMemo } from 'react'
import { Users, MessageCircle, Lightbulb, Target, BookOpen, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import { BaseCard } from './ui/BaseCard'
import { SectionHeader } from './ui/SectionHeader'
import { WilderDimensionBadge } from './ui/WilderDimensionIcon'
import {
  generateEducatorPanel,
  EDUCATORS,
  type EducatorProfile,
  type EducatorDialogue,
  type ConsensusPoint,
  type DivergencePoint,
  type ActionItem,
} from '../lib/educatorPanel'

export interface EducatorConsultationProps {
  wilderScores: { W: number; I: number; L: number; D: number; E: number; R: number }
  wilderLevels?: { W: string; I: string; L: string; D: string; E: string; R: string }
  childAge?: number
  childName?: string
}

/**
 * 获取维度配置
 */
function getDimensionConfig(dim: string) {
  const configs: Record<string, { name: string; color: string }> = {
    W: { name: '好奇心', color: '#3B5FD9' },
    I: { name: '探究力', color: '#1e40af' },
    L: { name: '连接力', color: '#2563eb' },
    D: { name: '设计力', color: '#3b82f6' },
    E: { name: '表达力', color: '#0F9D94' },
    R: { name: '反思力', color: '#5DB8B2' },
  }
  return configs[dim] || { name: dim, color: '#666' }
}

/**
 * 获取教育学家的颜色标识
 */
function getEducatorColors(educatorId: string): { bg: string; text: string; border: string; light: string } {
  const colors: Record<string, { bg: string; text: string; border: string; light: string }> = {
    montessori: { bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-200', light: 'bg-rose-50' },
    dewey: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', light: 'bg-blue-50' },
    piaget: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200', light: 'bg-amber-50' },
    vygotsky: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', light: 'bg-emerald-50' },
    froebel: { bg: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-200', light: 'bg-violet-50' },
    steiner: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200', light: 'bg-orange-50' },
    malaguzzi: { bg: 'bg-cyan-500', text: 'text-cyan-600', border: 'border-cyan-200', light: 'bg-cyan-50' },
    bloom: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200', light: 'bg-indigo-50' },
    gardner: { bg: 'bg-teal-500', text: 'text-teal-600', border: 'border-teal-200', light: 'bg-teal-50' },
    sukhomlynsky: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200', light: 'bg-green-50' },
  }
  return colors[educatorId] || { bg: 'bg-gray-500', text: 'text-gray-600', border: 'border-gray-200', light: 'bg-gray-50' }
}

/**
 * 教育学家头像组件
 */
function EducatorAvatar({ educator, isHighlighted = false, size = 'md' }: { educator: EducatorProfile; isHighlighted?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const colors = getEducatorColors(educator.id)
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-lg',
  }

  return (
    <div
      className={`
        ${sizeClasses[size]} ${colors.bg} rounded-full flex items-center justify-center
        font-semibold text-white shadow-soft
        ${isHighlighted ? 'ring-4 ring-ws-accent ring-offset-2' : ''}
        transition-all duration-200
      `}
      title={`${educator.name} - ${educator.coreTheory.slice(0, 20)}...`}
    >
      <span className="text-lg">{educator.avatar}</span>
    </div>
  )
}

/**
 * 对话卡片组件
 */
function DialogueCard({ dialogue, isActive }: { dialogue: EducatorDialogue; isActive: boolean }) {
  const colors = getEducatorColors(dialogue.speakerId)
  const typeLabels: Record<string, string> = {
    observation: '观察',
    suggestion: '建议',
    debate: '讨论',
    consensus: '共识',
  }
  const typeColors: Record<string, string> = {
    observation: 'bg-blue-100 text-blue-700',
    suggestion: 'bg-amber-100 text-amber-700',
    debate: 'bg-rose-100 text-rose-700',
    consensus: 'bg-emerald-100 text-emerald-700',
  }

  return (
    <div className={`flex gap-3 p-4 rounded-ws-card border transition-all ${isActive ? 'bg-white border-ws-primary shadow-card' : 'bg-white/50 border-ws-border-soft'}`}>
      <div className={`${colors.bg} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
        <span className="text-lg">{dialogue.speakerAvatar}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-ws-text-primary">{dialogue.speakerName}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[dialogue.type]}`}>
            {typeLabels[dialogue.type]}
          </span>
        </div>
        <p className="text-sm text-ws-text-secondary leading-relaxed">{dialogue.content}</p>
        {dialogue.targetDimensions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {dialogue.targetDimensions.map((dim) => {
              const config = getDimensionConfig(dim)
              return (
                <span key={dim} className="text-xs px-2 py-0.5 bg-ws-primary/10 text-ws-primary rounded-full">
                  {config.name}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 共识点卡片
 */
function ConsensusCard({ point }: { point: ConsensusPoint }) {
  return (
    <BaseCard variant="advantage">
      <h4 className="font-semibold text-ws-text-primary mb-2">{point.title}</h4>
      <p className="text-sm text-ws-text-secondary mb-3 leading-relaxed">{point.recommendation}</p>
      <div className="flex flex-wrap gap-1">
        {point.supporters.map((name, idx) => (
          <span key={idx} className="text-xs px-2 py-0.5 bg-ws-success/10 text-ws-success rounded-full">
            {name}
          </span>
        ))}
      </div>
    </BaseCard>
  )
}

/**
 * 分歧点卡片
 */
function DivergenceCard({ point }: { point: DivergencePoint }) {
  return (
    <BaseCard variant="insight">
      <h4 className="font-semibold text-ws-text-primary mb-3 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-ws-primary" />
        {point.topic}
      </h4>
      <div className="space-y-2 mb-3">
        {point.perspectives.map((p, idx) => {
          const colors = getEducatorColors(p.educatorId)
          return (
            <div key={idx} className="flex gap-2 text-sm">
              <span className={`${colors.text} font-medium whitespace-nowrap`}>{p.educatorName}：</span>
              <span className="text-ws-text-secondary">{p.position}</span>
            </div>
          )
        })}
      </div>
      <p className="text-sm text-ws-text-secondary pt-2 border-t border-ws-border-soft">
        <span className="font-medium text-ws-primary">家长指南：</span>
        {point.parentGuidance}
      </p>
    </BaseCard>
  )
}

/**
 * 行动项组件
 */
function ActionItemCard({ item, index }: { item: ActionItem; index: number }) {
  const priorityColors = {
    high: 'bg-ws-danger/10 text-ws-danger border-ws-danger/30',
    medium: 'bg-ws-accent/10 text-ws-accent border-ws-accent/30',
    low: 'bg-ws-success/10 text-ws-success border-ws-success/30',
  }
  const priorityLabels = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级',
  }

  return (
    <div className="flex gap-3 p-3 bg-white rounded-lg border border-ws-border-soft">
      <div className="w-8 h-8 bg-ws-primary/10 rounded-full flex items-center justify-center text-ws-primary font-semibold text-sm flex-shrink-0">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[item.priority]}`}>
            {priorityLabels[item.priority]}
          </span>
          <span className="text-xs text-ws-text-secondary">{item.timeframe}</span>
        </div>
        <p className="text-sm font-medium text-ws-text-primary mb-1">{item.action}</p>
        <p className="text-xs text-ws-text-secondary">
          来自：{item.source} · 针对：{getDimensionConfig(item.targetDim).name}
        </p>
      </div>
    </div>
  )
}

/**
 * 主组件
 */
export function EducatorConsultation({ wilderScores, wilderLevels, childAge = 10, childName = '孩子' }: EducatorConsultationProps) {
  const [activeTab, setActiveTab] = useState<'dialogues' | 'consensus' | 'plan'>('dialogues')
  const [selectedRound, setSelectedRound] = useState<number | null>(null)

  // 计算最高和最低维度
  const sortedDims = useMemo(() => {
    const dims = ['W', 'I', 'L', 'D', 'E', 'R']
    return dims.sort((a, b) => (wilderScores[b as keyof typeof wilderScores] || 0) - (wilderScores[a as keyof typeof wilderScores] || 0))
  }, [wilderScores])

  const topDimensions = sortedDims.slice(0, 2)
  const weakDimensions = sortedDims.slice(-2)

  // 运行教育学家面板生成结果
  const panelResult = useMemo(() => {
    return generateEducatorPanel(
      wilderScores as Record<string, number>,
      (wilderLevels || {}) as Record<string, string>,
      childName,
      childAge,
      topDimensions,
      weakDimensions
    )
  }, [wilderScores, wilderLevels, childName, childAge, topDimensions, weakDimensions])

  // 按轮次分组对话
  const dialoguesByRound = useMemo(() => {
    const grouped: Record<number, EducatorDialogue[]> = { 1: [], 2: [], 3: [] }
    panelResult.dialogues.forEach((d) => {
      if (!grouped[d.round]) grouped[d.round] = []
      grouped[d.round].push(d)
    })
    return grouped
  }, [panelResult.dialogues])

  return (
    <section className="space-y-6">
      {/* 标题区 */}
      <SectionHeader
        title="教育专家圆桌会议"
        subtitle={`10位历史上最伟大的教育学家基于${childName}的WILDER测评数据，展开了一场跨越时空的专业讨论。他们分析了孩子的潜能特点，提出了个性化的教育建议，并就关键教育理念进行了深入探讨。`}
        icon={Users}
      />

      {/* WILDER 分数概览 */}
      <div className="bg-gradient-to-r from-ws-primary/5 to-ws-accent/5 rounded-ws-card-lg p-4 sm:p-6">
        <h3 className="text-title-sm font-semibold text-ws-text-primary mb-4">WILDER 六维测评结果</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {(['W', 'I', 'L', 'D', 'E', 'R'] as const).map((dim) => {
            const score = wilderScores[dim] || 0
            const config = getDimensionConfig(dim)
            const level = score >= 75 ? 'high' : score >= 50 ? 'mid' : 'low'
            const levelColors = {
              high: 'bg-ws-success',
              mid: 'bg-ws-accent',
              low: 'bg-ws-text-secondary',
            }

            return (
              <div key={dim} className="text-center">
                <WilderDimensionBadge dimension={dim} size="sm" showLabel className="mx-auto mb-2" />
                <div className="text-2xl font-bold text-ws-text-primary">{score}</div>
                <div className="text-xs text-ws-text-secondary">{config.name}</div>
                <div className={`mt-1 h-1.5 rounded-full ${levelColors[level]}`} style={{ width: `${score}%` }} />
              </div>
            )
          })}
        </div>
      </div>

      {/* 专家面板 */}
      <div className="bg-white rounded-ws-card-lg shadow-soft p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-title-sm font-semibold text-ws-text-primary">参与讨论的教育学家</h3>
          <span className="text-caption text-ws-text-secondary">基于孩子特点匹配相关专家</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {EDUCATORS.map((educator) => {
            const isRelevant = educator.wilderFocus.some((dim) => topDimensions.includes(dim))
            return (
              <div key={educator.id} className="text-center">
                <EducatorAvatar educator={educator} isHighlighted={isRelevant} size="md" />
                <p className={`text-xs mt-2 font-medium ${isRelevant ? 'text-ws-primary' : 'text-ws-text-secondary'}`}>
                  {educator.name}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 孩子画像 */}
      <BaseCard variant="insight">
        <h4 className="font-semibold text-ws-text-primary mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-ws-accent" />
          专家共识画像
        </h4>
        <p className="text-sm text-ws-text-secondary leading-relaxed">{panelResult.childProfile}</p>
      </BaseCard>

      {/* 标签切换 */}
      <div className="flex flex-wrap gap-2 border-b border-ws-border-soft pb-4">
        <button
          onClick={() => setActiveTab('dialogues')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'dialogues'
              ? 'bg-ws-primary text-white'
              : 'bg-ws-primary/10 text-ws-primary hover:bg-ws-primary/20'
          }`}
        >
          专家对话 ({panelResult.dialogues.length}条)
        </button>
        <button
          onClick={() => setActiveTab('consensus')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'consensus'
              ? 'bg-ws-primary text-white'
              : 'bg-ws-primary/10 text-ws-primary hover:bg-ws-primary/20'
          }`}
        >
          共识与分歧 ({panelResult.consensusPoints.length + panelResult.divergencePoints.length}个)
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'plan'
              ? 'bg-ws-primary text-white'
              : 'bg-ws-primary/10 text-ws-primary hover:bg-ws-primary/20'
          }`}
        >
          行动计划 ({panelResult.actionPlan.length}项)
        </button>
      </div>

      {/* 内容区 */}
      <div className="min-h-[400px]">
        {activeTab === 'dialogues' && (
          <div className="space-y-6">
            {/* 轮次选择 */}
            <div className="flex gap-2">
              {[1, 2, 3].map((round) => (
                <button
                  key={round}
                  onClick={() => setSelectedRound(selectedRound === round ? null : round)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedRound === round || selectedRound === null
                      ? 'bg-ws-primary/10 text-ws-primary'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  第{round}轮 · {round === 1 ? '各抒己见' : round === 2 ? '交锋讨论' : '形成共识'}
                </button>
              ))}
            </div>

            {/* 对话列表 */}
            <div className="space-y-3">
              {(selectedRound ? [selectedRound] : [1, 2, 3]).map((round) => (
                <div key={round}>
                  <h4 className="text-sm font-medium text-ws-text-secondary mb-3">
                    第{round}轮 · {round === 1 ? '各抒己见' : round === 2 ? '交锋讨论' : '形成共识'}
                  </h4>
                  <div className="space-y-3">
                    {(dialoguesByRound[round] || []).map((dialogue, idx) => (
                      <DialogueCard key={idx} dialogue={dialogue} isActive={dialogue.type === 'consensus'} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'consensus' && (
          <div className="space-y-6">
            {/* 共识点 */}
            <div>
              <h4 className="text-title-sm font-semibold text-ws-text-primary mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-ws-success" />
                专家共识 ({panelResult.consensusPoints.length}项)
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {panelResult.consensusPoints.map((point, idx) => (
                  <ConsensusCard key={idx} point={point} />
                ))}
              </div>
            </div>

            {/* 分歧点 */}
            {panelResult.divergencePoints.length > 0 && (
              <div>
                <h4 className="text-title-sm font-semibold text-ws-text-primary mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-ws-warning" />
                  观点分歧 ({panelResult.divergencePoints.length}项)
                </h4>
                <div className="space-y-3">
                  {panelResult.divergencePoints.map((point, idx) => (
                    <DivergenceCard key={idx} point={point} />
                  ))}
                </div>
              </div>
            )}

            {/* 最终建议 */}
            <BaseCard variant="method">
              <h4 className="font-semibold text-ws-text-primary mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-ws-primary" />
                综合建议
              </h4>
              <p className="text-sm text-ws-text-secondary leading-relaxed">{panelResult.finalRecommendation}</p>
            </BaseCard>
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="space-y-6">
            {/* 行动计划 */}
            <div>
              <h4 className="text-title-sm font-semibold text-ws-text-primary mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-ws-primary" />
                具体行动计划
              </h4>
              <div className="space-y-3">
                {panelResult.actionPlan.map((item, idx) => (
                  <ActionItemCard key={idx} item={item} index={idx} />
                ))}
              </div>
            </div>

            {/* 家长指南 */}
            <BaseCard variant="method">
              <h4 className="font-semibold text-ws-text-primary mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-ws-primary" />
                实施建议
              </h4>
              <ul className="space-y-2">
                <li className="text-sm text-ws-text-secondary pl-5 relative">
                  <span className="absolute left-0 text-ws-primary">•</span>
                  根据孩子当前状态，优先执行高优先级行动项
                </li>
                <li className="text-sm text-ws-text-secondary pl-5 relative">
                  <span className="absolute left-0 text-ws-primary">•</span>
                  不同教育学家可能有不同侧重点，可根据家庭实际情况灵活选择
                </li>
                <li className="text-sm text-ws-text-secondary pl-5 relative">
                  <span className="absolute left-0 text-ws-primary">•</span>
                  建议定期回顾行动计划，根据孩子进步情况调整策略
                </li>
                <li className="text-sm text-ws-text-secondary pl-5 relative">
                  <span className="absolute left-0 text-ws-primary">•</span>
                  如有疑问，可预约 GROWMATE 专家进行一对一报告解读
                </li>
              </ul>
            </BaseCard>
          </div>
        )}
      </div>
    </section>
  )
}

export default EducatorConsultation
