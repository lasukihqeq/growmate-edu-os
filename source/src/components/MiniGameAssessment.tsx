// ===================================================================
// WILDER 星球探险 - 小游戏测评主组件
// 替代原有 SandboxAssessment，通过游戏行为收集 WILDER 六维能力信号
// ===================================================================

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowLeft, CheckCircle, Sparkles, Loader2, Star, Zap, Trophy } from 'lucide-react'
import type { MiniGameChallenge, MiniGameDecisionRecord, WilderDimension } from '../lib/minigame'
import {
  createGameEngine,
  getCurrentChallenge,
  submitAnswer,
  nextChallenge,
  isGameComplete,
  calculateResults,
  getProgress,
  getCurrentLevelTitle,
  getGameThemeForAge,
  DIMENSION_EMOJIS,
  DIMENSION_NAMES,
} from '../lib/minigame'
import { useGamification } from '../hooks/useGamification'
import { XPBar, ComboIndicator, BadgeUnlockPopup, LevelUpOverlay } from './GamificationUI'
import type { SandboxResults } from './SandboxAssessment'

// ===================================================================
// Types
// ===================================================================

interface MiniGameAssessmentProps {
  studentName: string
  studentAge: number
  onComplete: (results: SandboxResults) => void
  onBack?: () => void
}

type GamePhase = 'intro' | 'playing' | 'calculating' | 'result'

// ===================================================================
// 维度颜色映射
// ===================================================================

const DIMENSION_COLORS: Record<WilderDimension, string> = {
  W: 'from-sky-400 to-blue-500',
  I: 'from-violet-400 to-purple-500',
  L: 'from-emerald-400 to-teal-500',
  D: 'from-amber-400 to-orange-500',
  E: 'from-rose-400 to-pink-500',
  R: 'from-indigo-400 to-blue-600',
}

const DIMENSION_BG_COLORS: Record<WilderDimension, string> = {
  W: 'from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20',
  I: 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20',
  L: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
  D: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
  E: 'from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20',
  R: 'from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
}

// ===================================================================
// 主组件
// ===================================================================

export const MiniGameAssessment: React.FC<MiniGameAssessmentProps> = ({
  studentName,
  studentAge,
  onComplete,
  onBack,
}) => {
  // 游戏状态
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [gameState, setGameState] = useState<any>(null)
  const [currentChallenge, setCurrentChallenge] = useState<MiniGameChallenge | null>(null)
  const [decisionHistory, setDecisionHistory] = useState<MiniGameDecisionRecord[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string>('')

  // 游戏化
  const { state: gamification, onAnswer: gamifyOnAnswer, dismissBadge, dismissLevelUp } = useGamification()

  // 主题配置
  const theme = getGameThemeForAge(studentAge)

  // 初始化游戏
  const handleStart = useCallback(() => {
    const engine = createGameEngine(studentName, studentAge)
    setGameState(engine)

    const challenge = getCurrentChallenge(engine)
    setCurrentChallenge(challenge)

    setPhase('playing')
  }, [studentName, studentAge])

  // 处理选择
  const handleOptionSelect = useCallback((optionId: string) => {
    if (!gameState || selectedOption || !currentChallenge) return

    setSelectedOption(optionId)
    gamifyOnAnswer()

    // 提交答案
    const { newState, record } = submitAnswer(gameState, currentChallenge.id, optionId)
    setGameState(newState)
    setDecisionHistory(prev => [...prev, record])

    // 获取反馈
    const option = currentChallenge.options.find(o => o.id === optionId)
    if (option) {
      setFeedbackMessage(option.narrativeFeedback)
    }

    // 延迟后进入下一题
    setTimeout(() => {
      setFeedbackMessage('')
      setSelectedOption(null)

      // 前进
      const updatedState = nextChallenge(newState)
      setGameState(updatedState)

      // 检查是否完成
      if (isGameComplete(updatedState)) {
        handleComplete(updatedState)
        return
      }

      // 加载下一挑战
      const nextChallenge_ = getCurrentChallenge(updatedState)
      setCurrentChallenge(nextChallenge_)
    }, 1500)
  }, [gameState, selectedOption, currentChallenge, gamifyOnAnswer])

  // 完成游戏
  const handleComplete = useCallback((finalState: any) => {
    setPhase('calculating')

    const results = calculateResults(finalState, decisionHistory)

    // 转换为 SandboxResults 格式（兼容现有接口）
    const sandboxResults: SandboxResults = {
      dimensionScores: results.dimensionScores,
      decisionHistory: results.decisionHistory,
      elapsedTime: results.elapsedTime,
      sessionId: results.sessionId,
    }

    setTimeout(() => {
      setPhase('result')
      onComplete(sandboxResults)
    }, 1500)
  }, [decisionHistory, onComplete])

  // 进度
  const progress = gameState ? getProgress(gameState) : 0

  // ===================================================================
  // 渲染：Intro 阶段
  // ===================================================================

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* 标题区 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#3B5FD9] to-[#0F9D94] text-white text-5xl mb-4 shadow-lg animate-bounce-in">
              {theme.companion.emoji}
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 animate-slide-up">
              {studentName}，欢迎来到 WILDER 星球！
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 animate-slide-up">
              {theme.planetDescription}
            </p>
          </div>

          {/* AI 伙伴介绍 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6 animate-slide-up border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span>{theme.companion.emoji}</span>
              <span>你的伙伴：{theme.companion.name}</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300">{theme.companion.description}</p>
          </div>

          {/* 游戏规则 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6 animate-slide-up border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🎮</span>
              <span>游戏规则</span>
            </h2>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">🎯</span>
                <span>你将通过 <strong>6 个关卡</strong>，探索 WILDER 星球的 6 个维度</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">💡</span>
                <span>每关有 <strong>3 个挑战</strong>，跟随你的内心做出选择</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">⚡</span>
                <span>每个选择都会影响你的能力评分，<strong>没有标准答案</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">🏆</span>
                <span>完成挑战获得 XP 和徽章，最终生成你的<strong>天赋报告</strong></span>
              </li>
            </ul>
          </div>

          {/* 六维能力预览 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6 animate-slide-up border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">六维能力</h2>
            <div className="grid grid-cols-3 gap-3">
              {(['W', 'I', 'L', 'D', 'E', 'R'] as WilderDimension[]).map(dim => (
                <div key={dim} className={`p-3 rounded-xl bg-gradient-to-r ${DIMENSION_BG_COLORS[dim]} border border-slate-100 dark:border-slate-700`}>
                  <div className="text-2xl mb-1">{DIMENSION_EMOJIS[dim]}</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-white">{DIMENSION_NAMES[dim]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 py-4 px-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                返回
              </button>
            )}
            <button
              onClick={handleStart}
              className="flex-1 py-4 px-4 bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94] text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              开始探险！🚀
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ===================================================================
  // 渲染：Calculating 阶段
  // ===================================================================

  if (phase === 'calculating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#3B5FD9] to-[#0F9D94] text-white text-4xl mb-4 animate-pulse shadow-lg">
            🧮
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            正在生成你的天赋报告...
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            AI 正在分析你的决策模式和思维特质
          </p>
        </div>
      </div>
    )
  }

  // ===================================================================
  // 渲染：Playing 阶段
  // ===================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 顶部进度栏 */}
        <div className="sticky top-0 z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 rounded-2xl mb-6 shadow-sm">
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-t-2xl overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${currentChallenge ? DIMENSION_COLORS[currentChallenge.dimension] : 'from-[#3B5FD9] to-[#0F9D94]'} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎮</span>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  WILDER 星球探险
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentChallenge ? getCurrentLevelTitle(gameState) : '准备中'}
                </p>
              </div>
              {/* XP 条 */}
              <div className="ml-4 w-48">
                <XPBar state={gamification} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#3B5FD9]">{progress}%</p>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：挑战卡片 */}
          <div className="lg:col-span-2">
            {currentChallenge && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* 维度标签 */}
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${DIMENSION_COLORS[currentChallenge.dimension]} shadow-lg animate-bounce-in`}>
                    <span className="text-xl">{DIMENSION_EMOJIS[currentChallenge.dimension]}</span>
                    <span className="text-sm font-bold text-white">{currentChallenge.dimensionName}</span>
                  </div>
                </div>

                {/* 情境描述 */}
                {currentChallenge.scenario && (
                  <div className={`bg-gradient-to-r ${DIMENSION_BG_COLORS[currentChallenge.dimension]} rounded-2xl px-5 py-4 border border-slate-200 dark:border-slate-700 animate-slide-up`}>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{currentChallenge.scenario}</p>
                  </div>
                )}

                {/* 挑战标题和问题 */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    {currentChallenge.title}
                  </h2>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">{currentChallenge.question}</p>
                </div>

                {/* 选项 */}
                <div className="space-y-3">
                  {currentChallenge.options.map((opt, i) => {
                    const isSelected = selectedOption === opt.id
                    const hasSelection = selectedOption !== null
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleOptionSelect(opt.id)}
                        disabled={hasSelection}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden
                          ${isSelected
                            ? 'border-[#3B5FD9] dark:border-[#6B8CF0] bg-[#EEF2FF] dark:bg-[#3B5FD9]/20 shadow-lg scale-[1.02]'
                            : hasSelection
                            ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 opacity-40 scale-[0.97]'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#6B8CF0] dark:hover:border-slate-600 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]'
                          }
                        `}
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <div className="flex items-start gap-4 relative z-10">
                          {opt.emoji && (
                            <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                          )}
                          <span className={`text-base leading-relaxed pt-1 ${isSelected ? 'text-[#3B5FD9] dark:text-[#6B8CF0] font-semibold' : 'text-slate-800 dark:text-slate-200'}`}>
                            {opt.text}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* 反馈消息 */}
                {feedbackMessage && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 animate-slide-up">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      {feedbackMessage}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 右侧：AI 伙伴 + 连击 */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-4">
              {/* 连击指示器 */}
              <ComboIndicator combo={gamification.combo} />

              {/* AI 伙伴卡片 */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{theme.companion.emoji}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{theme.companion.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{theme.companion.description}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {selectedOption ? '做得好！继续加油 💪' : '跟随你的内心，做出选择吧！'}
                  </p>
                </div>
              </div>

              {/* 维度进度 */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">维度进度</h4>
                <div className="space-y-2">
                  {(['W', 'I', 'L', 'D', 'E', 'R'] as WilderDimension[]).map((dim, idx) => {
                    const isCompleted = gameState?.currentLevelIndex > idx
                    const isCurrent = gameState?.currentLevelIndex === idx
                    return (
                      <div key={dim} className="flex items-center gap-2">
                        <span className="text-sm">{DIMENSION_EMOJIS[dim]}</span>
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500 w-full' : isCurrent ? `bg-gradient-to-r ${DIMENSION_COLORS[dim]}` : 'bg-slate-300 dark:bg-slate-600 w-0'}`}
                          />
                        </div>
                        {isCompleted && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 游戏化覆盖层 */}
      {gamification.latestBadge && (
        <BadgeUnlockPopup badge={gamification.latestBadge as any} onDismiss={dismissBadge} />
      )}
      {gamification.justLeveledUp && (
        <LevelUpOverlay level={gamification.level} onDismiss={dismissLevelUp} />
      )}
    </div>
  )
}
