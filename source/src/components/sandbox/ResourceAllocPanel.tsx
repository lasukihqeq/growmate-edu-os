// ===================================================================
// 动态沙盘推演系统 - 资源分配交互面板
// 场景: "你有100个能量点，分配到探索/防御/研究/社交"
// ===================================================================

import React, { useState, useCallback, useMemo } from 'react'

interface AllocCategory {
  id: string
  name: string
  emoji: string
}

interface ResourceAllocPanelProps {
  categories: AllocCategory[]
  onConfirm: (allocation: Record<string, number>) => void
  title?: string
  totalPoints?: number
  disabled?: boolean
}

export const ResourceAllocPanel: React.FC<ResourceAllocPanelProps> = ({
  categories,
  onConfirm,
  title = '分配你的能量点',
  totalPoints = 100,
  disabled = false,
}) => {
  // 初始均分
  const initialAlloc = useMemo(() => {
    const base = Math.floor(totalPoints / categories.length)
    const remainder = totalPoints - base * categories.length
    const alloc: Record<string, number> = {}
    categories.forEach((cat, i) => {
      alloc[cat.id] = base + (i < remainder ? 1 : 0)
    })
    return alloc
  }, [categories, totalPoints])

  const [allocation, setAllocation] = useState<Record<string, number>>(initialAlloc)
  const [isConfirming, setIsConfirming] = useState(false)
  const [activeSlider, setActiveSlider] = useState<string | null>(null)

  const currentTotal = useMemo(
    () => Object.values(allocation).reduce((sum, v) => sum + v, 0),
    [allocation]
  )

  const getCategoryColorObj = (index: number) => {
    const colors = [
      { bg: 'bg-sky-500', light: 'bg-sky-100', text: 'text-sky-700', gradient: 'from-sky-400 to-blue-500' },
      { bg: 'bg-violet-500', light: 'bg-violet-100', text: 'text-violet-700', gradient: 'from-violet-400 to-purple-500' },
      { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-700', gradient: 'from-emerald-400 to-teal-500' },
      { bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-400 to-orange-500' },
      { bg: 'bg-rose-500', light: 'bg-rose-100', text: 'text-rose-700', gradient: 'from-rose-400 to-pink-500' },
      { bg: 'bg-indigo-500', light: 'bg-indigo-100', text: 'text-indigo-700', gradient: 'from-indigo-400 to-blue-600' },
    ]
    return colors[index % colors.length]
  }

  /**
   * 调整某个分类的值，自动按比例分配剩余给其他分类，保持总和=totalPoints
   */
  const handleSliderChange = useCallback(
    (changedId: string, newValue: number) => {
      if (disabled) return

      const clampedValue = Math.max(0, Math.min(totalPoints, Math.round(newValue)))
      const remaining = totalPoints - clampedValue
      const otherIds = categories.filter((c) => c.id !== changedId).map((c) => c.id)

      // 其他分类当前总和
      const othersTotal = otherIds.reduce((sum, id) => sum + allocation[id], 0)

      const newAlloc: Record<string, number> = { ...allocation, [changedId]: clampedValue }

      if (othersTotal === 0) {
        // 所有其他值为0，平均分配剩余
        const base = Math.floor(remaining / otherIds.length)
        let leftover = remaining - base * otherIds.length
        otherIds.forEach((id) => {
          newAlloc[id] = base + (leftover > 0 ? 1 : 0)
          if (leftover > 0) leftover--
        })
      } else {
        // 按比例分配
        let allocated = 0
        otherIds.forEach((id, i) => {
          if (i === otherIds.length - 1) {
            // 最后一个取余数，确保精确等于 totalPoints
            newAlloc[id] = remaining - allocated
          } else {
            const ratio = allocation[id] / othersTotal
            const val = Math.round(remaining * ratio)
            newAlloc[id] = Math.max(0, val)
            allocated += newAlloc[id]
          }
        })

        // 安全保护: 确保没有负数
        otherIds.forEach((id) => {
          if (newAlloc[id] < 0) newAlloc[id] = 0
        })
      }

      setAllocation(newAlloc)
    },
    [disabled, totalPoints, categories, allocation]
  )

  const handleConfirm = () => {
    if (disabled || isConfirming) return
    setIsConfirming(true)
    setTimeout(() => {
      onConfirm(allocation)
      setIsConfirming(false)
    }, 300)
  }

  const getPercentage = (value: number) =>
    Math.round((value / totalPoints) * 100)

  return (
    <div className="resource-alloc-panel bg-white rounded-2xl shadow-lg p-6">
      {/* 标题 */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-xl">⚡</span>
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          总共 <span className="font-bold text-gray-700">{totalPoints}</span> 个能量点，拖动滑块来分配
        </p>
      </div>

      {/* 总量指示条 */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>已分配</span>
          <span className={currentTotal === totalPoints ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
            {currentTotal} / {totalPoints}
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
          {categories.map((cat, index) => {
            const color = getCategoryColorObj(index)
            const width = getPercentage(allocation[cat.id])
            return (
              <div
                key={cat.id}
                className={`${color.bg} transition-all duration-300 first:rounded-l-full last:rounded-r-full`}
                style={{ width: `${width}%` }}
                title={`${cat.name}: ${allocation[cat.id]}`}
              />
            )
          })}
        </div>
      </div>

      {/* 分类滑块列表 */}
      <div className="space-y-5">
        {categories.map((cat, index) => {
          const color = getCategoryColorObj(index)
          const value = allocation[cat.id]
          const pct = getPercentage(value)
          const isActive = activeSlider === cat.id

          return (
            <div key={cat.id} className="group">
              {/* 分类标题行 */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color.gradient} flex items-center justify-center text-lg shadow-sm`}
                  >
                    {cat.emoji}
                  </div>
                  <span className="font-medium text-gray-800 text-sm">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${color.text} tabular-nums`}>
                    {value}
                  </span>
                  <span className="text-xs text-gray-400">({pct}%)</span>
                </div>
              </div>

              {/* 自定义滑块 */}
              <div className="relative">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${color.gradient} rounded-full transition-all ${isActive ? 'duration-0' : 'duration-300'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={totalPoints}
                  value={value}
                  onChange={(e) => handleSliderChange(cat.id, parseInt(e.target.value, 10))}
                  onMouseDown={() => setActiveSlider(cat.id)}
                  onMouseUp={() => setActiveSlider(null)}
                  onTouchStart={() => setActiveSlider(cat.id)}
                  onTouchEnd={() => setActiveSlider(null)}
                  disabled={disabled}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  aria-label={`分配给${cat.name}的能量点`}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* 图例标签 */}
      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((cat, index) => {
          const color = getCategoryColorObj(index)
          return (
            <span
              key={cat.id}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${color.light} ${color.text}`}
            >
              {cat.emoji} {cat.name}: {allocation[cat.id]}
            </span>
          )
        })}
      </div>

      {/* 确认按钮 */}
      <div className="mt-6">
        <button
          onClick={handleConfirm}
          disabled={disabled || isConfirming}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
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
            '确认分配'
          )}
        </button>
      </div>
    </div>
  )
}
