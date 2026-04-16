// ===================================================================
// 章节过渡动画组件
// ===================================================================

import React, { useEffect, useState } from 'react'

interface ChapterTransitionProps {
  chapterTitle: string
  chapterIcon: string
  chapterNumber: number
  totalChapters: number
  reward?: { xp: number; badge?: { name: string; emoji: string } }
  onComplete: () => void
}

export const ChapterTransition: React.FC<ChapterTransitionProps> = ({
  chapterTitle,
  chapterIcon,
  chapterNumber,
  totalChapters,
  reward,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 300)
    const t2 = setTimeout(() => setPhase('exit'), 2200)
    const t3 = setTimeout(onComplete, 2500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center transition-all duration-500 ${
        phase === 'enter' ? 'bg-black/0' : phase === 'show' ? 'bg-black/60' : 'bg-black/0'
      } backdrop-blur-sm`}
    >
      <div
        className={`text-center transition-all duration-500 ${
          phase === 'enter' ? 'scale-50 opacity-0' : phase === 'show' ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
        }`}
      >
        {/* 章节图标 */}
        <div className="relative mb-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-[#3B5FD9] to-[#0F9D94] flex items-center justify-center text-5xl shadow-2xl animate-bounce-in">
            {chapterIcon}
          </div>
          {/* 章节编号 */}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-white text-sm font-black flex items-center justify-center shadow-lg">
            {chapterNumber}
          </div>
        </div>

        {/* 章节标题 */}
        <div className="text-3xl font-black text-white drop-shadow-lg mb-2 animate-fade-in">
          {chapterTitle}
        </div>

        {/* 进度 */}
        <div className="text-sm text-white/70 mb-4">
          第 {chapterNumber} / {totalChapters} 章
        </div>

        {/* 奖励 */}
        {reward && (
          <div className="animate-fade-in space-y-2">
            {reward.xp > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/20 border border-amber-400/30">
                <span className="text-amber-300 font-bold">+{reward.xp} XP</span>
              </div>
            )}
            {reward.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-400/20 border border-purple-400/30 ml-2">
                <span className="text-2xl">{reward.badge.emoji}</span>
                <span className="text-purple-300 font-bold">{reward.badge.name}</span>
              </div>
            )}
          </div>
        )}

        {/* 提示 */}
        <div className="text-xs text-white/50 mt-6 animate-pulse">
          准备进入新关卡...
        </div>
      </div>
    </div>
  )
}
