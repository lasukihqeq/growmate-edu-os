// ===================================================================
// 交互路由器 - 根据交互类型渲染对应的组件
// ===================================================================

import React, { useState, useCallback } from 'react'
import { DecisionPanel } from './DecisionPanel'
import { DragSortPanel } from './DragSortPanel'
import { ResourceAllocPanel } from './ResourceAllocPanel'
import { EmotionSlider } from './EmotionSlider'
import { SceneExplore } from './SceneExplore'

export type InteractionType = 'choice' | 'drag_sort' | 'resource_alloc' | 'emotion_slider' | 'scene_explore'

interface InteractionRouterProps {
  type: InteractionType
  scene: any
  onDecision: (result: any) => void
  timeLimit?: number
}

export const InteractionRouter: React.FC<InteractionRouterProps> = ({
  type,
  scene,
  onDecision,
  timeLimit,
}) => {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = useCallback((result: any) => {
    setIsConfirming(true)
    setTimeout(() => {
      onDecision(result)
      setIsConfirming(false)
    }, 300)
  }, [onDecision])

  // 根据交互类型渲染对应组件
  switch (type) {
    case 'drag_sort':
      return (
        <DragSortPanel
          items={scene.interactionItems || []}
          onConfirm={(orderedIds) => handleConfirm({ type: 'drag_sort', orderedIds })}
          title={scene.decision?.title || '排列优先级'}
          disabled={isConfirming}
        />
      )

    case 'resource_alloc':
      return (
        <ResourceAllocPanel
          categories={scene.interactionCategories || []}
          onConfirm={(allocation) => handleConfirm({ type: 'resource_alloc', allocation })}
          title={scene.decision?.title || '分配资源'}
          disabled={isConfirming}
        />
      )

    case 'emotion_slider':
      return (
        <EmotionSlider
          question={scene.decision?.title || '你感觉如何？'}
          onConfirm={(value) => handleConfirm({ type: 'emotion_slider', value })}
          disabled={isConfirming}
        />
      )

    case 'scene_explore':
      return (
        <SceneExplore
          hotspots={scene.hotspots || []}
          onExplore={(id) => {/* 探索逻辑 */}}
          onConfirm={() => handleConfirm({ type: 'scene_explore' })}
          title={scene.decision?.title || '探索场景'}
          disabled={isConfirming}
        />
      )

    default: // 'choice'
      return (
        <DecisionPanel
          decision={scene.decision}
          onDecision={(optionId) => handleConfirm({ type: 'choice', optionId })}
          timeLimit={timeLimit}
        />
      )
  }
}
