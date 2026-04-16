// ===================================================================
// 动态沙盘推演系统 - 剧情展示面板
// ===================================================================

import React from 'react'
import type { SceneNode, AICharacter } from '../../lib/sandbox/types'

interface StoryPanelProps {
  scene: SceneNode
  character?: AICharacter | null
  onContinue?: () => void
  showIllustration?: boolean
  progress?: number
}

export const StoryPanel: React.FC<StoryPanelProps> = ({
  scene,
  character,
  onContinue,
  showIllustration = true,
  progress = 0,
}) => {
  return (
    <div className="story-panel bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* 进度条 */}
      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* AI生图占位区 */}
      {showIllustration && scene.illustration && (
        <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
          <div className="text-center p-4">
            <div className="text-4xl mb-2">🎨</div>
            <p className="text-xs text-gray-500">AI插画生成中...</p>
            <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">
              {scene.illustration}
            </p>
          </div>
        </div>
      )}

      {/* 角色头像 */}
      {character && (
        <div className="flex items-center gap-3 px-6 pt-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-xl shadow-md">
            {getCharacterEmoji(character.archetype)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{character.name}</p>
            <p className="text-xs text-gray-500">AI 伙伴</p>
          </div>
        </div>
      )}

      {/* 剧情文本 */}
      <div className="px-6 py-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {scene.narrative}
          </p>
        </div>
      </div>

      {/* 继续按钮 */}
      {onContinue && (
        <div className="px-6 pb-4">
          <button
            onClick={onContinue}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94] text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            继续探索 →
          </button>
        </div>
      )}
    </div>
  )
}

/** 获取角色对应的emoji */
function getCharacterEmoji(archetype: string): string {
  const emojis: Record<string, string> = {
    robot_friend: '🤖',
    mischievous_fairy: '🧚',
    mentor: '👨‍🏫',
    investor: '💼',
    devil_advocate: '⚖️',
    competitor: '🏃',
  }
  return emojis[archetype] || '🤖'
}
