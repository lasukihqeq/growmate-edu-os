// ===================================================================
// 动态沙盘推演系统 - 决策交互面板
// ===================================================================

import React, { useState, useEffect } from 'react'
import type { ContextualOption, DecisionPoint } from '../../lib/sandbox/types'

interface DecisionPanelProps {
  decision: DecisionPoint
  onDecision: (optionId: string) => void
  timeLimit?: number
  disabled?: boolean
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({
  decision,
  onDecision,
  timeLimit,
  disabled = false,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0)
  const [isConfirming, setIsConfirming] = useState(false)

  // 倒计时
  useEffect(() => {
    if (!timeLimit || disabled) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLimit, disabled])

  // 时间到自动提交
  useEffect(() => {
    if (timeRemaining === 0 && selectedId && !disabled) {
      handleSubmit()
    }
  }, [timeRemaining, selectedId, disabled])

  const handleSelect = (optionId: string) => {
    if (disabled) return
    setSelectedId(optionId)
  }

  const handleSubmit = () => {
    if (!selectedId || disabled) return
    setIsConfirming(true)
    setTimeout(() => {
      onDecision(selectedId)
      setIsConfirming(false)
    }, 300)
  }

  const getOptionLetter = (index: number): string => {
    return String.fromCharCode(65 + index) // A, B, C, D...
  }

  const getOptionColor = (index: number): string => {
    const colors = [
      'from-sky-400 to-blue-500',
      'from-violet-400 to-purple-500',
      'from-emerald-400 to-teal-500',
      'from-amber-400 to-orange-500',
      'from-rose-400 to-pink-500',
      'from-indigo-400 to-blue-600',
    ]
    return colors[index % colors.length]
  }

  const isTimeWarning = timeRemaining > 0 && timeRemaining <= 10
  const isTimeDanger = timeRemaining > 0 && timeRemaining <= 5

  return (
    <div className="decision-panel bg-white rounded-2xl shadow-lg p-6">
      {/* 标题 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-xl">🎯</span>
          做出你的选择
        </h3>
        {timeLimit && timeRemaining > 0 && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className={isTimeDanger ? 'text-red-500 font-bold' : isTimeWarning ? 'text-amber-500' : 'text-gray-500'}>
                ⏱️ 剩余时间
              </span>
              <span className={isTimeDanger ? 'text-red-500 font-bold' : isTimeWarning ? 'text-amber-500' : 'text-gray-700 font-medium'}>
                {timeRemaining}秒
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  isTimeDanger ? 'bg-red-500' : isTimeWarning ? 'bg-amber-500' : 'bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94]'
                }`}
                style={{ width: `${(timeRemaining / timeLimit) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 选项列表 */}
      <div className="space-y-3">
        {decision.contextualOptions.map((option, index) => (
          <OptionCard
            key={option.id}
            option={option}
            letter={getOptionLetter(index)}
            color={getOptionColor(index)}
            isSelected={selectedId === option.id}
            onSelect={() => handleSelect(option.id)}
            disabled={disabled || isConfirming}
          />
        ))}
      </div>

      {/* 确认按钮 */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={!selectedId || disabled || isConfirming}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
            selectedId && !disabled && !isConfirming
              ? 'bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94] text-white shadow-md hover:opacity-90'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              确认中...
            </span>
          ) : (
            '确认选择'
          )}
        </button>
      </div>
    </div>
  )
}

/** 单个选项卡片 */
interface OptionCardProps {
  option: ContextualOption
  letter: string
  color: string
  isSelected: boolean
  onSelect: () => void
  disabled: boolean
}

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  letter,
  color,
  isSelected,
  onSelect,
  disabled,
}) => {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? `border-[#3B5FD9] bg-blue-50 shadow-md`
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex items-start gap-3">
        {/* 选项字母 */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
        >
          {letter}
        </div>

        {/* 选项内容 */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${isSelected ? 'text-[#3B5FD9]' : 'text-gray-800'}`}>
            {option.narrative}
          </p>
          {option.nextSceneHint && (
            <p className="text-xs text-gray-500 mt-1">
              💡 {option.nextSceneHint}
            </p>
          )}
        </div>

        {/* 选中指示器 */}
        {isSelected && (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#3B5FD9] flex items-center justify-center text-white text-sm">
            ✓
          </div>
        )}
      </div>
    </button>
  )
}
