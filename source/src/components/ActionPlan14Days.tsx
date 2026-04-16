/**
 * ActionPlan14Days.tsx - 14天行动清单组件
 *
 * L3 行动层核心组件
 * 功能: 展示14天原子级行动、话术模板、勋章时刻
 * 目标: 把100页建议拆解成今晚就能用的动作
 */

import React, { useState } from 'react'
import { CheckCircle2, ChevronRight, Clock, Copy, Check, Sparkles, Star, Target, MessageCircle } from 'lucide-react'
import { generateActionPlan, type ActionPlanResult, type DailyAction } from '../lib/actionPlanEngine'
import type { DynamicReportData } from '../lib/reportContentGenerator'
import type { WilderDimension } from '../lib/wilderKernel'

// ========== Props 接口 ==========

export interface ActionPlan14DaysProps {
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


// ========== 14天行动清单组件 ==========

export const ActionPlan14Days: React.FC<ActionPlan14DaysProps> = ({
  reportData: d
}) => {
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set())
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [copiedScript, setCopiedScript] = useState<number | null>(null)

  // 解析短板和长板维度
  const weakDims = getWeakDimensions(d.wilderPercentiles)
  const strongDims = getStrongDimensions(d.wilderPercentiles)

  // 生成行动计划
  const actionPlan: ActionPlanResult = generateActionPlan({
    name: d.student.name,
    age: d.student.age,
    profileCode: d.profileCode,
    focusDimensions: weakDims,
    strongDimensions: strongDims
  })

  // 切换完成状态
  const toggleComplete = (day: number) => {
    setCompletedDays(prev => {
      const next = new Set(prev)
      if (next.has(day)) {
        next.delete(day)
      } else {
        next.add(day)
      }
      return next
    })
  }

  // 复制话术
  const copyScript = async (day: number, script: string) => {
    try {
      await navigator.clipboard.writeText(script)
      setCopiedScript(day)
      setTimeout(() => setCopiedScript(null), 2000)
    } catch {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = script
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedScript(day)
      setTimeout(() => setCopiedScript(null), 2000)
    }
  }

  // 计算进度
  const progress = Math.round((completedDays.size / 14) * 100)

  return (
    <section id="section-action-plan" className="relative bg-white">
      {/* 顶部进度条 */}
      <div className="bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94] p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-xl">14天行动计划</h3>
            <p className="text-white/70 text-sm">{actionPlan.slogan}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black">{progress}%</p>
            <p className="text-white/70 text-xs">完成进度</p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FDD22B] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* 开场引导语 */}
        <div className="mb-6 p-4 bg-[#FDD22B]/10 rounded-xl border border-[#FDD22B]/30">
          <p className="text-sm text-[rgba(10,10,26,0.7)] leading-relaxed">
            {actionPlan.openingGuide}
          </p>
        </div>

        {/* 行动列表 */}
        <div className="space-y-3">
          {actionPlan.actions.map((action) => (
            <ActionCard
              key={action.day}
              action={action}
              isCompleted={completedDays.has(action.day)}
              isExpanded={expandedDay === action.day}
              isCopied={copiedScript === action.day}
              onToggleComplete={() => toggleComplete(action.day)}
              onToggleExpand={() => setExpandedDay(expandedDay === action.day ? null : action.day)}
              onCopyScript={() => copyScript(action.day, action.parentScript)}
            />
          ))}
        </div>

        {/* 完成激励 */}
        {progress === 100 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-[#FDD22B]/20 to-[#FFB800]/20 rounded-xl border border-[#FDD22B]/30 text-center">
            <Sparkles className="w-10 h-10 text-[#FDD22B] mx-auto mb-3" />
            <h4 className="font-bold text-lg text-[#0A0A1A] mb-2">恭喜完成14天计划！</h4>
            <p className="text-sm text-[rgba(10,10,26,0.6)]">{actionPlan.completionReward}</p>
          </div>
        )}
      </div>
    </section>
  )
}

// ========== 单日行动卡片组件 ==========

interface ActionCardProps {
  action: DailyAction
  isCompleted: boolean
  isExpanded: boolean
  isCopied: boolean
  onToggleComplete: () => void
  onToggleExpand: () => void
  onCopyScript: () => void
}

const ActionCard: React.FC<ActionCardProps> = ({
  action,
  isCompleted,
  isExpanded,
  isCopied,
  onToggleComplete,
  onToggleExpand,
  onCopyScript
}) => {
  const colors = DIMENSION_COLORS[action.targetDimension]

  return (
    <div
      className={`rounded-xl border transition-all ${
        isCompleted
          ? 'bg-green-50 border-green-200'
          : action.isBadgeMoment
            ? 'bg-amber-50 border-amber-200'
            : 'bg-white border-[rgba(10,10,26,0.06)]'
      }`}
    >
      {/* 主行 */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={onToggleExpand}
      >
        {/* 天数 */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
          isCompleted ? 'bg-green-500 text-white' : `${colors.bg} ${colors.text}`
        }`}>
          {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : `D${action.day}`}
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{action.sceneEmoji}</span>
            <span className="font-bold text-[#0A0A1A] truncate">{action.sceneName}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
              {action.dimensionName}
            </span>
            {action.isBadgeMoment && (
              <Star className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <p className="text-sm text-[rgba(10,10,26,0.6)] truncate">{action.taskTitle}</p>
        </div>

        {/* 时长 */}
        <div className="flex items-center gap-1 text-xs text-[rgba(10,10,26,0.4)] flex-shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>{action.duration}</span>
        </div>

        {/* 展开箭头 */}
        <ChevronRight
          className={`w-5 h-5 text-[rgba(10,10,26,0.3)] transition-transform flex-shrink-0 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
      </div>

      {/* 展开内容 */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-[rgba(10,10,26,0.04)] pt-4">
          {/* 任务描述 */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[#3B5FD9]" />
              <span className="text-xs font-bold text-[#3B5FD9] uppercase tracking-wider">任务</span>
            </div>
            <p className="text-sm text-[rgba(10,10,26,0.7)]">{action.taskDescription}</p>
          </div>

          {/* 话术模板 */}
          <div className="mb-4 bg-[rgba(10,10,26,0.02)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#FDD22B]" />
                <span className="text-xs font-bold text-[rgba(10,10,26,0.5)] uppercase tracking-wider">
                  家长话术模板
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onCopyScript()
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isCopied
                    ? 'bg-green-100 text-green-600'
                    : 'bg-[#3B5FD9]/10 text-[#3B5FD9] hover:bg-[#3B5FD9]/20'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    复制
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-[rgba(10,10,26,0.8)] italic leading-relaxed">
              {action.parentScript}
            </p>
          </div>

          {/* 勋章提示 */}
          {action.isBadgeMoment && action.badgeHint && (
            <div className="p-3 bg-amber-100 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">勋章时刻</span>
              </div>
              <p className="text-xs text-amber-700">{action.badgeHint}</p>
            </div>
          )}

          {/* 完成按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleComplete()
            }}
            className={`w-full mt-4 py-3 rounded-lg font-bold text-sm transition-all ${
              isCompleted
                ? 'bg-green-100 text-green-600 border border-green-200'
                : 'bg-[#3B5FD9] text-white hover:bg-[#3B5FD9]/90'
            }`}
          >
            {isCompleted ? '✓ 已完成' : '标记为完成'}
          </button>
        </div>
      )}
    </div>
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

export default ActionPlan14Days
