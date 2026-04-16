// ===================================================================
// 动态沙盘推演系统 - 场景点击探索面板
// 场景: 一幅场景图，有5-8个可点击热区
// 适合3-9岁，大热区+视觉反馈
// ===================================================================

import React, { useState, useCallback } from 'react'

interface Hotspot {
  id: string
  /** 水平位置百分比 0-100 */
  x: number
  /** 垂直位置百分比 0-100 */
  y: number
  emoji: string
  label: string
  description: string
}

interface SceneExploreProps {
  hotspots: Hotspot[]
  onExplore: (id: string) => void
  onConfirm: () => void
  title?: string
  backgroundEmoji?: string
  disabled?: boolean
}

export const SceneExplore: React.FC<SceneExploreProps> = ({
  hotspots,
  onExplore,
  onConfirm,
  title = '探索这个场景',
  backgroundEmoji = '\ud83c\udf33',
  disabled = false,
}) => {
  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set())
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null)
  const [pulsingId, setPulsingId] = useState<string | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const exploredCount = exploredIds.size
  const totalCount = hotspots.length
  const allExplored = exploredCount >= totalCount

  const handleHotspotClick = useCallback(
    (hotspot: Hotspot) => {
      if (disabled) return

      // 触发视觉反馈脉冲
      setPulsingId(hotspot.id)
      setTimeout(() => setPulsingId(null), 600)

      // 标记已探索
      setExploredIds((prev) => {
        const next = new Set(prev)
        next.add(hotspot.id)
        return next
      })

      // 显示描述
      setActiveHotspot(hotspot)

      // 触发回调
      onExplore(hotspot.id)
    },
    [disabled, onExplore]
  )

  const handleCloseDetail = useCallback(() => {
    setActiveHotspot(null)
  }, [])

  const handleConfirm = () => {
    if (disabled || isConfirming) return
    setIsConfirming(true)
    setTimeout(() => {
      onConfirm()
      setIsConfirming(false)
    }, 300)
  }

  /** 为热区生成柔和的背景色 */
  const getHotspotColors = (index: number, explored: boolean) => {
    const palette = [
      { bg: 'bg-sky-100', border: 'border-sky-300', activeBg: 'bg-sky-200', ring: 'ring-sky-400' },
      { bg: 'bg-violet-100', border: 'border-violet-300', activeBg: 'bg-violet-200', ring: 'ring-violet-400' },
      { bg: 'bg-emerald-100', border: 'border-emerald-300', activeBg: 'bg-emerald-200', ring: 'ring-emerald-400' },
      { bg: 'bg-amber-100', border: 'border-amber-300', activeBg: 'bg-amber-200', ring: 'ring-amber-400' },
      { bg: 'bg-rose-100', border: 'border-rose-300', activeBg: 'bg-rose-200', ring: 'ring-rose-400' },
      { bg: 'bg-indigo-100', border: 'border-indigo-300', activeBg: 'bg-indigo-200', ring: 'ring-indigo-400' },
      { bg: 'bg-teal-100', border: 'border-teal-300', activeBg: 'bg-teal-200', ring: 'ring-teal-400' },
      { bg: 'bg-pink-100', border: 'border-pink-300', activeBg: 'bg-pink-200', ring: 'ring-pink-400' },
    ]
    return palette[index % palette.length]
  }

  return (
    <div className="scene-explore bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* 标题栏 */}
      <div className="p-5 pb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-xl">\ud83d\udd0d</span>
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94] transition-all duration-500 rounded-full"
              style={{ width: `${totalCount > 0 ? (exploredCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 tabular-nums whitespace-nowrap">
            {exploredCount}/{totalCount} 已探索
          </span>
        </div>
      </div>

      {/* 场景画布 */}
      <div className="relative mx-4 mb-4 rounded-xl bg-gradient-to-br from-emerald-50 via-sky-50 to-violet-50 border-2 border-gray-100 overflow-hidden"
        style={{ paddingBottom: '65%' /* 宽高比约3:2 */ }}
      >
        {/* 装饰背景 emoji */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 text-[120px] pointer-events-none select-none">
          {backgroundEmoji}
        </div>

        {/* 热区 */}
        {hotspots.map((hotspot, index) => {
          const explored = exploredIds.has(hotspot.id)
          const isActive = activeHotspot?.id === hotspot.id
          const isPulsing = pulsingId === hotspot.id
          const colors = getHotspotColors(index, explored)

          return (
            <button
              key={hotspot.id}
              onClick={() => handleHotspotClick(hotspot)}
              disabled={disabled}
              className={`
                absolute transform -translate-x-1/2 -translate-y-1/2
                flex flex-col items-center gap-0.5
                transition-all duration-300
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                group
              `}
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
              }}
              aria-label={`探索: ${hotspot.label}`}
            >
              {/* 脉冲环 (未探索时) */}
              {!explored && !disabled && (
                <span className="absolute inset-0 -m-2 rounded-full bg-blue-400/20 animate-ping" />
              )}

              {/* emoji 圆形按钮 */}
              <div
                className={`
                  relative w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl
                  shadow-md transition-all duration-300
                  ${explored ? `${colors.activeBg} ${colors.border}` : `${colors.bg} ${colors.border}`}
                  ${isActive ? `ring-4 ${colors.ring} scale-110 shadow-lg` : ''}
                  ${isPulsing ? 'scale-125' : ''}
                  ${!disabled ? 'group-hover:scale-110 group-hover:shadow-lg' : ''}
                `}
              >
                {hotspot.emoji}

                {/* 已探索对勾 */}
                {explored && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 标签 */}
              <span
                className={`
                  text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap
                  transition-all duration-300
                  ${explored ? 'bg-emerald-100 text-emerald-700' : 'bg-white/80 text-gray-700 shadow-sm'}
                  ${isActive ? 'font-bold' : ''}
                `}
              >
                {hotspot.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* 详情弹窗 */}
      {activeHotspot && (
        <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 animate-fade-in">
          <div className="flex items-start gap-3">
            <span className="text-3xl flex-shrink-0">{activeHotspot.emoji}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-800 text-base">
                {activeHotspot.label}
              </h4>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {activeHotspot.description}
              </p>
            </div>
            <button
              onClick={handleCloseDetail}
              className="flex-shrink-0 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors shadow-sm"
              aria-label="关闭"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 底部操作区 */}
      <div className="px-5 pb-5">
        {/* 已探索提示 */}
        {exploredCount > 0 && !allExplored && (
          <p className="text-xs text-gray-500 text-center mb-3">
            还有 {totalCount - exploredCount} 个地方没有探索哦，点点看吧！
          </p>
        )}
        {allExplored && (
          <p className="text-xs text-emerald-600 text-center mb-3 font-medium">
            太棒了！你已经探索了所有地方！
          </p>
        )}

        {/* 确认按钮 */}
        <button
          onClick={handleConfirm}
          disabled={disabled || isConfirming}
          className={`w-full py-3.5 px-4 rounded-xl font-medium text-base transition-all ${
            !disabled && !isConfirming
              ? allExplored
                ? 'bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94] text-white shadow-md hover:opacity-90'
                : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm hover:opacity-90'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              确认中...
            </span>
          ) : allExplored ? (
            '探索完毕，继续前进！'
          ) : (
            `继续探索 (${exploredCount}/${totalCount})`
          )}
        </button>
      </div>

      {/* 内联动画样式 */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
