// ===================================================================
// 动态沙盘推演系统 - 拖拽排序交互面板
// 场景: "团队需要完成4项任务，请排列优先级"
// ===================================================================

import React, { useState, useRef, useCallback } from 'react'

interface SortItem {
  id: string
  text: string
  emoji: string
}

interface DragSortPanelProps {
  items: SortItem[]
  onConfirm: (orderedIds: string[]) => void
  title: string
  disabled?: boolean
}

export const DragSortPanel: React.FC<DragSortPanelProps> = ({
  items: initialItems,
  onConfirm,
  title,
  disabled = false,
}) => {
  const [orderedItems, setOrderedItems] = useState<SortItem[]>(initialItems)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const dragNodeRef = useRef<number | null>(null)

  const getRankColor = (index: number): string => {
    const colors = [
      'from-amber-400 to-orange-500',
      'from-sky-400 to-blue-500',
      'from-violet-400 to-purple-500',
      'from-emerald-400 to-teal-500',
      'from-rose-400 to-pink-500',
      'from-indigo-400 to-blue-600',
    ]
    return colors[index % colors.length]
  }

  const getRankLabel = (index: number): string => {
    const labels = ['第1', '第2', '第3', '第4', '第5', '第6', '第7', '第8']
    return labels[index] || `第${index + 1}`
  }

  // --- HTML5 Drag & Drop ---
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      if (disabled) return
      dragNodeRef.current = index
      setDraggedIndex(index)
      e.dataTransfer.effectAllowed = 'move'
      // 使拖拽时有半透明效果
      if (e.currentTarget) {
        e.dataTransfer.setDragImage(e.currentTarget, 0, 0)
      }
    },
    [disabled]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      if (dragNodeRef.current === null || dragNodeRef.current === index) return
      setDragOverIndex(index)
    },
    []
  )

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>, index: number) => {
      e.preventDefault()
      if (dragNodeRef.current === null || dragNodeRef.current === index) return
      setDragOverIndex(index)
    },
    []
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      e.preventDefault()
      const dragIndex = dragNodeRef.current
      if (dragIndex === null || dragIndex === dropIndex) return

      setOrderedItems((prev) => {
        const newItems = [...prev]
        const [draggedItem] = newItems.splice(dragIndex, 1)
        newItems.splice(dropIndex, 0, draggedItem)
        return newItems
      })
      setHasInteracted(true)
      setDraggedIndex(null)
      setDragOverIndex(null)
      dragNodeRef.current = null
    },
    []
  )

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null)
    setDragOverIndex(null)
    dragNodeRef.current = null
  }, [])

  // --- 触摸端: 上移/下移按钮 ---
  const moveItem = useCallback(
    (index: number, direction: 'up' | 'down') => {
      if (disabled) return
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= orderedItems.length) return

      setOrderedItems((prev) => {
        const newItems = [...prev]
        const temp = newItems[index]
        newItems[index] = newItems[targetIndex]
        newItems[targetIndex] = temp
        return newItems
      })
      setHasInteracted(true)
    },
    [disabled, orderedItems.length]
  )

  const handleConfirm = () => {
    if (disabled || isConfirming) return
    setIsConfirming(true)
    setTimeout(() => {
      onConfirm(orderedItems.map((item) => item.id))
      setIsConfirming(false)
    }, 300)
  }

  return (
    <div className="drag-sort-panel bg-white rounded-2xl shadow-lg p-6">
      {/* 标题 */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-xl">📋</span>
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          拖拽卡片或使用箭头按钮调整顺序
        </p>
      </div>

      {/* 可排序卡片列表 */}
      <div className="space-y-3">
        {orderedItems.map((item, index) => {
          const isDragging = draggedIndex === index
          const isDragOver = dragOverIndex === index && draggedIndex !== index

          return (
            <div
              key={item.id}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                relative flex items-center gap-3 p-4 rounded-xl border-2
                transition-all duration-200 select-none
                ${isDragging ? 'opacity-40 scale-95 border-dashed border-gray-300 bg-gray-50' : ''}
                ${isDragOver ? 'border-[#3B5FD9] bg-blue-50 shadow-md transform -translate-y-0.5' : ''}
                ${!isDragging && !isDragOver ? 'border-gray-200 bg-white hover:shadow-sm' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}
              `}
            >
              {/* 排名徽章 */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${getRankColor(index)} flex items-center justify-center text-white font-bold text-xs shadow-sm`}
              >
                {getRankLabel(index)}
              </div>

              {/* Emoji + 文字 */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                <p className="font-medium text-gray-800 text-base leading-snug">
                  {item.text}
                </p>
              </div>

              {/* 拖拽手柄 + 上下移动按钮 */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* 上移 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    moveItem(index, 'up')
                  }}
                  disabled={disabled || index === 0}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    index === 0 || disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                  aria-label="上移"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>

                {/* 下移 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    moveItem(index, 'down')
                  }}
                  disabled={disabled || index === orderedItems.length - 1}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    index === orderedItems.length - 1 || disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                  aria-label="下移"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 拖拽手柄图标 */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                </div>
              </div>
            </div>
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
          ) : hasInteracted ? (
            '确认排序'
          ) : (
            '调整顺序后确认'
          )}
        </button>
      </div>
    </div>
  )
}
