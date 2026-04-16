// ===================================================================
// 动态沙盘推演系统 - 情感温度计交互面板
// 场景: "你对这个决定的信心如何?"
// 适合3-12岁，大emoji+简单文字
// ===================================================================

import React, { useState, useCallback, useMemo } from 'react'

interface EmotionSliderProps {
  question: string
  onConfirm: (value: number) => void
  minValue?: number
  maxValue?: number
  disabled?: boolean
}

/** 情绪等级配置 */
interface EmotionLevel {
  emoji: string
  label: string
  color: string
  bgGradient: string
}

const EMOTION_LEVELS: EmotionLevel[] = [
  { emoji: '\ud83d\ude30', label: '完全不', color: 'text-red-500', bgGradient: 'from-red-100 to-red-200' },
  { emoji: '\ud83d\ude1f', label: '不太行', color: 'text-orange-500', bgGradient: 'from-orange-100 to-orange-200' },
  { emoji: '\ud83d\ude10', label: '一般般', color: 'text-amber-500', bgGradient: 'from-amber-100 to-amber-200' },
  { emoji: '\ud83d\ude0a', label: '还不错', color: 'text-emerald-500', bgGradient: 'from-emerald-100 to-emerald-200' },
  { emoji: '\ud83e\udd29', label: '非常确定', color: 'text-blue-500', bgGradient: 'from-blue-100 to-blue-200' },
]

export const EmotionSlider: React.FC<EmotionSliderProps> = ({
  question,
  onConfirm,
  minValue = 0,
  maxValue = 100,
  disabled = false,
}) => {
  const midpoint = Math.round((minValue + maxValue) / 2)
  const [value, setValue] = useState(midpoint)
  const [isDragging, setIsDragging] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  /** 根据当前值计算情绪等级 (0-4) */
  const emotionIndex = useMemo(() => {
    const range = maxValue - minValue
    if (range === 0) return 2
    const normalized = (value - minValue) / range // 0..1
    const idx = Math.min(
      EMOTION_LEVELS.length - 1,
      Math.floor(normalized * EMOTION_LEVELS.length)
    )
    // 当 value === maxValue 时，floor 会给出 length，需 clamp
    return Math.max(0, Math.min(EMOTION_LEVELS.length - 1, idx))
  }, [value, minValue, maxValue])

  const currentEmotion = EMOTION_LEVELS[emotionIndex]

  /** 计算百分比 */
  const percentage = useMemo(() => {
    const range = maxValue - minValue
    if (range === 0) return 50
    return Math.round(((value - minValue) / range) * 100)
  }, [value, minValue, maxValue])

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return
      setValue(parseInt(e.target.value, 10))
    },
    [disabled]
  )

  const handleConfirm = () => {
    if (disabled || isConfirming) return
    setIsConfirming(true)
    setTimeout(() => {
      onConfirm(value)
      setIsConfirming(false)
    }, 300)
  }

  return (
    <div className={`emotion-slider bg-gradient-to-b ${currentEmotion.bgGradient} rounded-2xl shadow-lg p-6 transition-colors duration-500`}>
      {/* 问题文字 */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">
          {question}
        </h3>
      </div>

      {/* 大号 Emoji 展示 */}
      <div className="flex flex-col items-center mb-8">
        <div
          className={`text-8xl transition-all duration-300 ${isDragging ? 'scale-110' : 'scale-100'}`}
          role="img"
          aria-label={currentEmotion.label}
        >
          {currentEmotion.emoji}
        </div>
        <p className={`mt-3 text-xl font-bold ${currentEmotion.color} transition-colors duration-300`}>
          {currentEmotion.label}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {value} / {maxValue}
        </p>
      </div>

      {/* 水平滑块温度计 */}
      <div className="px-2 mb-6">
        {/* 情绪标签行 */}
        <div className="flex justify-between mb-3 px-1">
          {EMOTION_LEVELS.map((level, i) => (
            <button
              key={i}
              onClick={() => {
                if (disabled) return
                // 点击 emoji 跳到对应值
                const segmentValue = minValue + Math.round(
                  ((i + 0.5) / EMOTION_LEVELS.length) * (maxValue - minValue)
                )
                setValue(segmentValue)
              }}
              disabled={disabled}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                emotionIndex === i ? 'scale-110 opacity-100' : 'scale-90 opacity-40'
              } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-70'}`}
            >
              <span className="text-2xl">{level.emoji}</span>
            </button>
          ))}
        </div>

        {/* 温度计轨道 */}
        <div className="relative h-6 mb-2">
          {/* 背景轨道 */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 rounded-full bg-gradient-to-r from-red-300 via-amber-300 via-60% to-blue-400 opacity-30" />

          {/* 填充轨道 */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-4 rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-blue-500 transition-all"
            style={{ width: `${percentage}%`, transitionDuration: isDragging ? '0ms' : '300ms' }}
          />

          {/* range input */}
          <input
            type="range"
            min={minValue}
            max={maxValue}
            value={value}
            onChange={handleSliderChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            aria-label="情感温度计"
          />

          {/* 自定义滑块指示器 */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg border-3 border-white flex items-center justify-center transition-all ${
              isDragging ? 'scale-125 shadow-xl' : 'scale-100'
            }`}
            style={{
              left: `${percentage}%`,
              transitionDuration: isDragging ? '0ms' : '300ms',
            }}
          >
            <span className="text-base">{currentEmotion.emoji}</span>
          </div>
        </div>

        {/* 两端标签 */}
        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>{EMOTION_LEVELS[0].label}</span>
          <span>{EMOTION_LEVELS[EMOTION_LEVELS.length - 1].label}</span>
        </div>
      </div>

      {/* 确认按钮 */}
      <div className="mt-4">
        <button
          onClick={handleConfirm}
          disabled={disabled || isConfirming}
          className={`w-full py-3.5 px-4 rounded-xl font-medium text-lg transition-all ${
            !disabled && !isConfirming
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
            <span className="flex items-center justify-center gap-2">
              {currentEmotion.emoji} 就是这样！
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
