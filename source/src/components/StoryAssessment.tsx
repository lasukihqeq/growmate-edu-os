// ===================================================================
// 故事冒险测评组件 v2.0
// 沉浸式故事驱动测评，集成游戏化机制
// ===================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  getStoryWorldsForAge,
  initGameState,
  processAnswer,
  generateChapterQuestions,
  calculateProgress,
  getCompanionReaction,
  checkStreakBadges,
  type StoryWorld,
  type StoryGameState,
  type StoryCompanion,
} from '../lib/storyAdventureEngine'
import { ageToGroup } from '../lib/questions/types'

interface StoryAssessmentProps {
  studentName: string
  studentAge: number
  onComplete: (results: {
    dimensionScores: Record<string, number>
    dimensionXP: Record<string, number>
    badges: Array<{ id: string; name: string; emoji: string }>
    elapsedTime: number
    storyWorldId: string
  }) => void
  onBack?: () => void
}

type Phase = 'world-select' | 'intro' | 'playing' | 'chapter-complete' | 'calculating'

export const StoryAssessment: React.FC<StoryAssessmentProps> = ({
  studentName,
  studentAge,
  onComplete,
  onBack,
}) => {
  const ageGroup = ageToGroup(studentAge)
  const availableWorlds = useMemo(() => getStoryWorldsForAge(ageGroup), [ageGroup])

  const [phase, setPhase] = useState<Phase>('world-select')
  const [selectedWorld, setSelectedWorld] = useState<StoryWorld | null>(null)
  const [gameState, setGameState] = useState<StoryGameState | null>(null)
  const [currentQuestions, setCurrentQuestions] = useState<ReturnType<typeof generateChapterQuestions>>([])
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({})
  const [startTime, setStartTime] = useState(0)
  const [showFeedback, setShowFeedback] = useState<{ message: string; score: number } | null>(null)
  const [newBadge, setNewBadge] = useState<{ id: string; name: string; emoji: string } | null>(null)

  // 选择故事世界
  const handleSelectWorld = useCallback((world: StoryWorld) => {
    setSelectedWorld(world)
    setGameState(initGameState(world.id))
    setPhase('intro')
  }, [])

  // 开始冒险
  const handleStartAdventure = useCallback(() => {
    if (!selectedWorld || !gameState) return
    const sessionSeed = `${studentName}_${studentAge}_${Date.now().toString(36)}`
    const chapter = selectedWorld.chapters[0]
    const questions = generateChapterQuestions(chapter, ageGroup, sessionSeed)
    setCurrentQuestions(questions)
    setCurrentQuestionIdx(0)
    setStartTime(Date.now())
    setPhase('playing')
  }, [selectedWorld, gameState, studentName, studentAge, ageGroup])

  // 回答问题
  const handleAnswer = useCallback((optionIdx: number) => {
    if (!gameState || !selectedWorld || currentQuestionIdx >= currentQuestions.length) return

    const question = currentQuestions[currentQuestionIdx]
    const option = question.options[optionIdx]
    if (!option) return

    // 计算维度分数
    const dim = question.dimension
    const score = option.scores[dim] || 50
    const newScores = { ...dimensionScores }
    newScores[dim] = (newScores[dim] || 0) + score
    setDimensionScores(newScores)

    // 更新游戏状态
    const newState = processAnswer(gameState, selectedWorld, dim, score)

    // 检查连击徽章
    const streakBadges = checkStreakBadges(newState)
    if (streakBadges.length > 0) {
      const badge = streakBadges[0]
      if (!newState.unlockedBadges.find(b => b.id === badge.id)) {
        newState.unlockedBadges.push({ ...badge, unlockedAt: Date.now() })
        setNewBadge(badge)
        setTimeout(() => setNewBadge(null), 3000)
      }
    }

    setGameState(newState)

    // 显示即时反馈
    const reaction = getCompanionReaction(selectedWorld.companion, score)
    setShowFeedback({ message: reaction, score })
    setTimeout(() => setShowFeedback(null), 2000)

    // 检查是否章节完成
    const chapter = selectedWorld.chapters[gameState.currentChapter]
    const nextQuestionIdx = currentQuestionIdx + 1
    if (nextQuestionIdx >= currentQuestions.length) {
      // 章节完成
      if (chapter.reward.badge && !newState.unlockedBadges.find(b => b.id === chapter.reward!.badge!.id)) {
        setNewBadge(chapter.reward.badge)
        setTimeout(() => setNewBadge(null), 3000)
      }
      setPhase('chapter-complete')
    } else {
      setCurrentQuestionIdx(nextQuestionIdx)
    }
  }, [gameState, selectedWorld, currentQuestions, currentQuestionIdx, dimensionScores])

  // 继续下一章节
  const handleNextChapter = useCallback(() => {
    if (!selectedWorld || !gameState) return
    if (gameState.currentChapter >= selectedWorld.chapters.length) {
      // 所有章节完成
      setPhase('calculating')
      setTimeout(() => {
        const results = {
          dimensionScores,
          dimensionXP: gameState.dimensionXP,
          badges: gameState.unlockedBadges,
          elapsedTime: Math.floor((Date.now() - startTime) / 1000),
          storyWorldId: selectedWorld.id,
        }
        onComplete(results)
      }, 1500)
      return
    }

    const sessionSeed = `${studentName}_${studentAge}_${Date.now().toString(36)}`
    const chapter = selectedWorld.chapters[gameState.currentChapter]
    const questions = generateChapterQuestions(chapter, ageGroup, sessionSeed)
    setCurrentQuestions(questions)
    setCurrentQuestionIdx(0)
    setPhase('playing')
  }, [selectedWorld, gameState, studentName, studentAge, ageGroup, dimensionScores, startTime, onComplete])

  // ===================================================================
  // 渲染
  // ===================================================================

  // 世界选择界面
  if (phase === 'world-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {studentName}，选择你的冒险！
            </h1>
            <p className="text-gray-600">每一段冒险都将帮助你发现独特的天赋</p>
          </div>

          <div className="space-y-4">
            {availableWorlds.map(world => (
              <button
                key={world.id}
                onClick={() => handleSelectWorld(world)}
                className="w-full text-left bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-indigo-300"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{world.companion.emoji}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{world.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{world.setting}</p>
                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      <span>{world.chapters.length} 章节</span>
                      <span>约 {world.estimatedMinutes} 分钟</span>
                      <span>伙伴：{world.companion.name}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="mt-6 w-full py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              返回
            </button>
          )}
        </div>
      </div>
    )
  }

  // 故事介绍界面
  if (phase === 'intro' && selectedWorld) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <span className="text-6xl block mb-4">{selectedWorld.companion.emoji}</span>
            <h1 className="text-4xl font-bold mb-3">{selectedWorld.title}</h1>
            <p className="text-purple-200 text-lg">{selectedWorld.setting}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selectedWorld.companion.emoji}</span>
              <div>
                <p className="font-bold">{selectedWorld.companion.name}</p>
                <p className="text-purple-200 text-sm">你的冒险伙伴</p>
              </div>
            </div>
            <p className="text-purple-100 italic">
              "{selectedWorld.companion.greetingLines[0]}"
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{selectedWorld.chapters.length}</p>
              <p className="text-purple-200 text-sm">章节</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{selectedWorld.totalQuestions}</p>
              <p className="text-purple-200 text-sm">道挑战</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">~{selectedWorld.estimatedMinutes}</p>
              <p className="text-purple-200 text-sm">分钟</p>
            </div>
          </div>

          <button
            onClick={handleStartAdventure}
            className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            开始冒险！ 🚀
          </button>
        </div>
      </div>
    )
  }

  // 章节完成界面
  if (phase === 'chapter-complete' && selectedWorld && gameState) {
    const chapter = selectedWorld.chapters[gameState.currentChapter - 1]
    const nextChapter = selectedWorld.chapters[gameState.currentChapter]

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          <div className="mb-6">
            <span className="text-6xl block mb-4">🎉</span>
            <h2 className="text-2xl font-bold text-gray-800">章节完成！</h2>
            <p className="text-gray-600 mt-2">{chapter?.title || '未知章节'}</p>
          </div>

          {/* 奖励展示 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">获得经验值</p>
                <p className="text-2xl font-bold text-amber-600">+{chapter?.reward.xp || 10} XP</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">最高连击</p>
                <p className="text-2xl font-bold text-orange-600">{gameState.maxStreak} 🔥</p>
              </div>
            </div>
            {chapter?.reward.badge && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">获得徽章</p>
                <p className="text-xl">{chapter.reward.badge.emoji} {chapter.reward.badge.name}</p>
              </div>
            )}
            <p className="mt-4 text-sm text-gray-500 italic">{chapter?.reward.storyProgress}</p>
          </div>

          <button
            onClick={handleNextChapter}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            {nextChapter ? `继续冒险：${nextChapter.title}` : '完成冒险！'} 🌟
          </button>
        </div>
      </div>
    )
  }

  // 计算中界面
  if (phase === 'calculating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#3B5FD9] to-[#0F9D94] text-white text-4xl mb-4 animate-pulse shadow-lg">
            🧮
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            正在生成你的天赋报告...
          </h2>
          <p className="text-gray-600">
            AI正在分析你的冒险决策
          </p>
        </div>
      </div>
    )
  }

  // 游戏进行中界面
  if (!selectedWorld || !gameState || currentQuestions.length === 0) return null

  const progress = calculateProgress(gameState, selectedWorld)
  const currentQuestion = currentQuestions[currentQuestionIdx]
  const chapter = selectedWorld.chapters[gameState.currentChapter]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 顶部状态栏 */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/60 rounded-2xl mb-6 shadow-sm">
          {/* 进度条 */}
          <div className="h-2 bg-gray-100 rounded-t-2xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedWorld.companion.emoji}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{chapter?.title || selectedWorld.title}</p>
                <p className="text-xs text-gray-500">
                  第 {currentQuestionIdx + 1}/{currentQuestions.length} 题 · 进度 {progress}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {gameState.streakCount >= 3 && (
                <span className="text-sm font-bold text-orange-500 animate-pulse">
                  🔥 {gameState.streakCount}连击
                </span>
              )}
              {/* XP展示 */}
              <div className="text-right">
                <p className="text-lg font-bold text-indigo-600">
                  {Object.values(gameState.dimensionXP).reduce((a, b) => a + b, 0)} XP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 故事场景 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* 场景描述 */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
            <p className="text-lg font-medium leading-relaxed">
              {chapter?.sceneDescription || currentQuestion?.questionText}
            </p>
          </div>

          {/* 伙伴互动 */}
          <div className="p-6">
            <div className="flex items-start gap-3 mb-6 bg-purple-50 rounded-xl p-4">
              <span className="text-2xl flex-shrink-0">{selectedWorld.companion.emoji}</span>
              <div>
                <p className="font-semibold text-purple-800 text-sm">{selectedWorld.companion.name}</p>
                <p className="text-purple-700 mt-1">
                  {showFeedback
                    ? showFeedback.message
                    : '你会怎么做呢？选择最接近你想法的答案吧！'
                  }
                </p>
              </div>
            </div>

            {/* 选项列表 */}
            <div className="space-y-3">
              {currentQuestion?.options.map((option, idx) => (
                <button
                  key={option.id || idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gray-100 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center font-bold text-sm text-gray-500 group-hover:text-indigo-600 transition-colors">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <p className="text-gray-700 group-hover:text-indigo-800 font-medium transition-colors pt-1">
                      {option.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 维度XP进度 */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-600 mb-3">能力成长</p>
          <div className="grid grid-cols-6 gap-2">
            {['W', 'I', 'L', 'D', 'E', 'R'].map(dim => {
              const dimNames: Record<string, string> = { W: '好奇', I: '探究', L: '连接', D: '设计', E: '表达', R: '反思' }
              const dimEmojis: Record<string, string> = { W: '🔭', I: '🔍', L: '🤝', D: '💡', E: '🗣️', R: '🪞' }
              const xp = gameState.dimensionXP[dim] || 0
              return (
                <div key={dim} className="text-center">
                  <span className="text-lg">{dimEmojis[dim]}</span>
                  <p className="text-xs text-gray-500 mt-1">{dimNames[dim]}</p>
                  <p className="text-sm font-bold text-indigo-600">{xp}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 已获得的徽章 */}
        {gameState.unlockedBadges.length > 0 && (
          <div className="mt-4 bg-white rounded-2xl shadow-sm p-4">
            <p className="text-sm font-semibold text-gray-600 mb-2">已获得徽章</p>
            <div className="flex gap-2 flex-wrap">
              {gameState.unlockedBadges.map(badge => (
                <span key={badge.id} className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-sm">
                  {badge.emoji} {badge.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 新徽章弹窗 */}
      {newBadge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-sm mx-4 animate-bounce-in">
            <span className="text-6xl block mb-4">{newBadge.emoji}</span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">新徽章解锁！</h3>
            <p className="text-lg font-semibold text-amber-600">{newBadge.name}</p>
          </div>
        </div>
      )}

      {/* 即时反馈浮层 */}
      {showFeedback && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] animate-fade-in">
          <div className={`px-6 py-3 rounded-full shadow-lg font-medium text-sm ${
            showFeedback.score >= 70
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            {showFeedback.message}
          </div>
        </div>
      )}
    </div>
  )
}
