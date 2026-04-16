// ===================================================================
// 动态沙盘推演系统 - 主容器组件 (游戏化重构版)
// 将传统评估流程包装为沉浸式沙盘体验
// 集成: XP/连击/徽章系统 + 故事世界引擎 + 多种交互形式
// ===================================================================

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { UnifiedQuestion } from '../lib/questions/types'
import { ageToGroup } from '../lib/questions/types'
import type { SceneNode } from '../lib/sandbox/types'
import {
  StoryGenerator,
  createAICharacterForAge,
  getWelcomeMessage,
  createSandboxSession,
  saveSession,
  loadSession,
  clearSession,
  updateDimensionScores,
  addDecisionRecord,
  updateCurrentScene,
  markSessionCompleted,
} from '../lib/sandbox'
import { StoryPanel } from './sandbox/StoryPanel'
import { DecisionPanel } from './sandbox/DecisionPanel'
import { CharacterPanel } from './sandbox/CharacterPanel'
import { shuffleOptions } from '../lib/optionShuffle'
import { generateOptionsFromPool } from '../lib/optionPools'

// 游戏化系统集成
import { useGamification } from '../hooks/useGamification'
import { XPBar, ComboIndicator, BadgeUnlockPopup, LevelUpOverlay, StageTransition } from './GamificationUI'
import { getStoryWorldsForAge, initGameState, processAnswer, calculateProgress, getCompanionReaction, checkStreakBadges } from '../lib/storyAdventureEngine'
import type { StoryWorld, StoryGameState } from '../lib/storyAdventureEngine'

// 新交互形式
import { InteractionRouter, type InteractionType } from './sandbox/InteractionRouter'
import { DecisionFeedback } from './sandbox/DecisionFeedback'
import { ChapterTransition } from './sandbox/ChapterTransition'
import type { CharacterEmotion } from './sandbox/CharacterPanel'

interface SandboxAssessmentProps {
  studentName: string
  studentAge: number
  questions: UnifiedQuestion[]
  onComplete: (results: SandboxResults) => void
  onBack?: () => void
}

export interface SandboxResults {
  dimensionScores: Record<string, number>
  decisionHistory: any[]
  elapsedTime: number
  sessionId: string
}

export const SandboxAssessment: React.FC<SandboxAssessmentProps> = ({
  studentName,
  studentAge,
  questions,
  onComplete,
  onBack,
}) => {
  // 状态
  const [phase, setPhase] = useState<'intro' | 'playing' | 'calculating' | 'result'>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({})
  const [decisionHistory, setDecisionHistory] = useState<any[]>([])
  const [startTime, setStartTime] = useState<number>(0)
  const [_sessionId, setSessionId] = useState<string>('')

  // 沙盘特有状态
  const [storyGenerator] = useState(() => new StoryGenerator())
  const [currentScene, setCurrentScene] = useState<any>(null)
  const [aiCharacter, setAiCharacter] = useState<any>(null)
  const [dialogueMessages, setDialogueMessages] = useState<any[]>([])
  const [session, setSession] = useState<any>(null)
  const [_showCharacterPanel, _setShowCharacterPanel] = useState(true)

  // 游戏化状态
  const { state: gamification, onAnswer: gamifyOnAnswer, dismissLevelUp, dismissBadge } = useGamification()
  const [storyWorld, setStoryWorld] = useState<StoryWorld | null>(null)
  const [gameWorld, setGameWorld] = useState<StoryGameState | null>(null)
  const [showStageTransition, setShowStageTransition] = useState(false)
  const [stageTransitionData, setStageTransitionData] = useState<{ name: string; icon: string; color: string } | null>(null)
  const [unlockedBadges, setUnlockedBadges] = useState<any[]>([])

  // 决策反馈动画状态
  const [showDecisionFeedback, setShowDecisionFeedback] = useState(false)
  const [feedbackData, setFeedbackData] = useState<{ optionId: string; dimensionScores: Record<string, number>; xpGain: number; combo: number } | null>(null)

  // 章节过渡状态
  const [showChapterTransition, setShowChapterTransition] = useState(false)
  const [chapterTransitionData, setChapterTransitionData] = useState<any>(null)

  // 角色情感状态
  const [characterEmotion, setCharacterEmotion] = useState<CharacterEmotion>({
    trust: 50,
    excitement: 50,
    concern: 30,
    currentExpression: 'curious',
  })

  // 交互类型 (默认为choice)
  const [interactionType, setInteractionType] = useState<InteractionType>('choice')

  const containerRef = useRef<HTMLDivElement>(null)
  const sessionRef = useRef<any>(null)

  // 同步 session 到 ref，避免 useCallback 的 stale closure
  useEffect(() => {
    sessionRef.current = session
  }, [session])

  // 初始化
  useEffect(() => {
    // 清除可能残留的损坏会话数据
    const existingSession = loadSession()
    if (existingSession && !existingSession.completed) {
      // 验证会话完整性：currentScene 必须存在才是有效的可恢复会话
      if (existingSession.storyProgress?.currentScene?.sceneId) {
        // 恢复会话
        setSession(existingSession)
        setSessionId(existingSession.sessionId)
        setPhase('playing')
        setStartTime(existingSession.startedAt)
        return
      }
      // 会话数据不完整，清除并重新开始
      clearSession()
    }

    // 创建新会话
    const character = createAICharacterForAge(studentAge)
    setAiCharacter(character)

    const welcomeMsg = getWelcomeMessage(studentName, studentAge)
    setDialogueMessages([{
      speaker: 'ai' as const,
      content: welcomeMsg,
      timestamp: Date.now(),
    }])
  }, [studentName, studentAge])

  // 当进入 playing 阶段且无当前场景时，自动加载第一个场景
  useEffect(() => {
    if (phase !== 'playing' || !session || currentScene) return
    loadScene(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, session])

  // 开始评估
  // 有效题目列表（优先使用传入的，否则生成 WILDER 维度情境题）
  const effectiveQuestions = useMemo(() => {
    if (questions.length > 0) return questions
    // 无题目时生成6个 WILDER 维度情境题
    const dims = [
      { dim: 'W', name: '好奇心', scenario: '你在森林里发现了一扇隐藏的门，门上刻着奇怪符号' },
      { dim: 'I', name: '探究力', scenario: '一个神秘仪器发出规律信号，你需要破译它的含义' },
      { dim: 'L', name: '连接力', scenario: '你的队友们在争吵，任务即将失败，你需要调解' },
      { dim: 'D', name: '设计力', scenario: '你们需要在有限材料下搭建一座能承重的桥' },
      { dim: 'E', name: '表达力', scenario: '你需要说服长老们支持你的探险计划' },
      { dim: 'R', name: '反思力', scenario: '上次行动失败了，你需要总结教训重新规划' },
    ]
    const ageGroup = ageToGroup(studentAge)
    const sessionSeed = `${studentName}_${studentAge}_${Date.now().toString(36)}`

    return dims.map((d, i) => {
      // 从选项池生成年龄自适应选项
      const poolOptions = generateOptionsFromPool(d.dim, ageGroup, `sandbox-default-${d.dim}`, sessionSeed)
      // 使用确定性洗牌打乱选项顺序
      const shuffledOptions = shuffleOptions(poolOptions, `sandbox-default-${d.dim}`, sessionSeed)

      return {
        id: `sandbox-default-${d.dim}`,
        type: 'choice' as const,
        text: d.scenario,
        scenario: d.scenario,
        model: 'WILDER' as const,
        dimension: d.dim,
        wilderMapping: [d.dim],
        ageGroup,
        options: shuffledOptions.map((opt, optIdx) => ({
          id: opt.id || `${d.dim}-${optIdx}`,
          text: opt.text,
          scores: opt.scores,
        })),
        difficulty: (2 + Math.floor(i / 2)) as 1 | 2 | 3 | 4 | 5,
        discrimination: 0.6,
        source: 'template' as const,
        tags: [d.name, '沙盘默认'],
      }
    }) as UnifiedQuestion[]
  }, [questions, studentAge, studentName])

  const handleStart = useCallback(() => {
    const ageGroup = ageToGroup(studentAge)

    // 选择故事世界
    const worlds = getStoryWorldsForAge(ageGroup)
    const selectedWorld = worlds[Math.floor(Math.random() * worlds.length)]
    setStoryWorld(selectedWorld)

    // 初始化游戏状态
    const gameState = initGameState(selectedWorld.id)
    setGameWorld(gameState)

    // 生成故事
    const story = storyGenerator.generateStory(effectiveQuestions, ageGroup)

    // 创建会话
    const newSession = createSandboxSession(
      { name: studentName, age: studentAge },
      {
        currentStory: story,
        currentChapter: 0,
        currentScene: null as unknown as SceneNode,
        completedScenes: [],
        decisionHistory: [],
        narrativeContext: [],
      }
    )

    setSession(newSession)
    setSessionId(newSession.sessionId)
    setStartTime(Date.now())
    setPhase('playing')
    // 不再直接调用 loadScene(0)，由 useEffect 在 session 更新后自动触发
  }, [studentName, studentAge, effectiveQuestions, storyGenerator])

  // 加载场景
  const loadScene = useCallback((questionIndex: number) => {
    if (questionIndex >= effectiveQuestions.length) {
      handleComplete()
      return
    }

    const question = effectiveQuestions[questionIndex]
    const ageGroup = ageToGroup(studentAge)
    const context = storyGenerator.getContextManager().getContext()

    const scene = storyGenerator.mapQuestionToContext(question, ageGroup, 'natural_exploration', context)

    setCurrentScene(scene)
    setCurrentQuestionIndex(questionIndex)

    // 更新对话 - 结合故事世界的场景描述
    if (aiCharacter && storyWorld && gameWorld) {
      const chapter = storyWorld.chapters[gameWorld.currentChapter]
      if (chapter && gameWorld.currentQuestionInChapter === 0) {
        // 新章节开始，使用章节场景描述
        setDialogueMessages(prev => [
          ...prev,
          {
            speaker: 'ai' as const,
            content: `${chapter.sceneDescription}`,
            timestamp: Date.now(),
          },
        ])
      } else {
        const reaction = aiCharacter.dialogueStyle.reactionPattern.neutral[
          Math.floor(Math.random() * aiCharacter.dialogueStyle.reactionPattern.neutral.length)
        ]
        setDialogueMessages(prev => [
          ...prev,
          {
            speaker: 'ai' as const,
            content: `${reaction}\n\n${scene.narrative.substring(0, 100)}...`,
            timestamp: Date.now(),
          },
        ])
      }
    }

    // 保存会话（使用 ref 避免依赖 session 导致循环重建）
    const currentSession = sessionRef.current
    if (currentSession) {
      const updatedSession = updateCurrentScene(currentSession, scene)
      setSession(updatedSession)
      saveSession(updatedSession)
    }
  }, [effectiveQuestions, studentAge, storyGenerator, aiCharacter, storyWorld, gameWorld])

  // 处理决策
  const handleDecision = useCallback((optionId: string) => {
    if (!currentScene) return
    const currentSession = sessionRef.current
    if (!currentSession) return

    const selectedOption = currentScene.decision.contextualOptions.find(
      (opt: any) => opt.id === optionId
    )

    if (!selectedOption) return

    // 计算响应时间
    const responseTime = Math.floor((Date.now() - startTime) / 1000)

    // 更新维度分数
    const newScores = { ...dimensionScores }
    for (const [dim, score] of Object.entries(selectedOption.dimensionScores)) {
      newScores[dim] = (newScores[dim] || 0) + (score as number)
    }
    setDimensionScores(newScores)

    // 记录决策
    const decisionRecord = {
      sceneId: currentScene.sceneId,
      decisionId: currentScene.decision.decisionId,
      selectedOption: optionId,
      responseTime,
      dimensionImpact: selectedOption.dimensionScores,
    }

    setDecisionHistory(prev => [...prev, decisionRecord])

    // 更新会话（使用 ref 获取最新 session）
    let updatedSession = addDecisionRecord(currentSession, decisionRecord)
    updatedSession = updateDimensionScores(updatedSession, newScores)
    setSession(updatedSession)
    saveSession(updatedSession)

    // 更新上下文
    storyGenerator.getContextManager().addScene(
      currentScene.narrative,
      selectedOption.narrative
    )

    // 添加用户消息到对话
    if (aiCharacter) {
      setDialogueMessages(prev => [
        ...prev,
        {
          speaker: 'player' as const,
          content: selectedOption.narrative,
          timestamp: Date.now(),
        },
      ])
    }

    // === 游戏化更新 ===
    // 1. 触发XP/连击更新
    gamifyOnAnswer()

    // 2. 显示决策反馈动画
    setFeedbackData({
      optionId,
      dimensionScores: selectedOption.dimensionScores,
      xpGain: gamification.lastXPGain || 15,
      combo: gamification.combo + 1,
    })
    setShowDecisionFeedback(true)

    // 3. 更新角色情感
    const mainDim = Object.keys(selectedOption.dimensionScores)[0] || 'W'
    const mainScore = (selectedOption.dimensionScores[mainDim] as number) || 0
    setCharacterEmotion(prev => {
      const newTrust = Math.min(100, prev.trust + (mainScore > 3 ? 5 : -2))
      const newExcitement = Math.min(100, Math.max(0, prev.excitement + (responseTime < 30 ? 8 : -3)))
      const newConcern = Math.max(0, prev.concern + (responseTime > 60 ? 5 : -2))
      const newExpression = newExcitement > 70 ? 'excited' : newTrust > 60 ? 'happy' : newConcern > 50 ? 'worried' : 'curious'
      return { trust: newTrust, excitement: newExcitement, concern: newConcern, currentExpression: newExpression }
    })

    // 4. 更新故事世界游戏状态
    if (storyWorld && gameWorld) {
      const newGameWorld = processAnswer(gameWorld, storyWorld, mainDim, mainScore)
      setGameWorld(newGameWorld)

      // 5. 检查章节完成
      const prevChapter = gameWorld.currentChapter
      if (newGameWorld.currentChapter > prevChapter && storyWorld.chapters[prevChapter]) {
        const completedChapter = storyWorld.chapters[prevChapter]
        // 触发章节过渡动画
        setChapterTransitionData({
          title: completedChapter.title,
          icon: completedChapter.reward.badge?.emoji || '🌟',
          number: newGameWorld.currentChapter,
          total: storyWorld.chapters.length,
          reward: completedChapter.reward,
        })
        setShowChapterTransition(true)
      }

      // 6. 检查连击徽章
      const streakBadges = checkStreakBadges(newGameWorld)
      if (streakBadges.length > 0) {
        // 可以触发徽章解锁动画
      }
    }

    // 加载下一个场景 (延迟到反馈动画完成后)
    setTimeout(() => {
      loadScene(currentQuestionIndex + 1)
    }, 1500)
  }, [currentScene, dimensionScores, startTime, aiCharacter, storyGenerator, loadScene, currentQuestionIndex, gamifyOnAnswer, storyWorld, gameWorld, gamification])

  // 处理AI对话
  const handleSendMessage = useCallback((message: string) => {
    if (!aiCharacter) return

    setDialogueMessages(prev => [
      ...prev,
      {
        speaker: 'player' as const,
        content: message,
        timestamp: Date.now(),
      },
    ])

    // AI回复（简化版，实际应接入NLP分析）
    setTimeout(() => {
      const reactions = aiCharacter.dialogueStyle.reactionPattern
      const pattern = Math.random() > 0.5 ? 'positive' : 'neutral'
      const reply = reactions[pattern][
        Math.floor(Math.random() * reactions[pattern].length)
      ]

      setDialogueMessages(prev => [
        ...prev,
        {
          speaker: 'ai' as const,
          content: reply,
          timestamp: Date.now(),
        },
      ])
    }, 1000)
  }, [aiCharacter])

  // 完成评估
  const handleComplete = useCallback(() => {
    setPhase('calculating')

    const currentSession = sessionRef.current
    if (!currentSession) return

    const finalSession = markSessionCompleted(currentSession)
    saveSession(finalSession)

    // 准备结果
    const results: SandboxResults = {
      dimensionScores,
      decisionHistory,
      elapsedTime: Math.floor((Date.now() - startTime) / 1000),
      sessionId: currentSession.sessionId,
    }

    // 清除草稿
    clearSession()

    setTimeout(() => {
      setPhase('result')
      onComplete(results)
    }, 1500)
  }, [dimensionScores, decisionHistory, startTime, onComplete])

  // 进度计算 (使用故事世界引擎)
  const progress = storyWorld && gameWorld
    ? calculateProgress(gameWorld, storyWorld)
    : (effectiveQuestions.length > 0
      ? Math.round((currentQuestionIndex / effectiveQuestions.length) * 100)
      : 0)

  // 渲染
  if (phase === 'intro') {
    return (
      <div className="sandbox-assessment min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* 标题 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#3B5FD9] to-[#0F9D94] text-white text-4xl mb-4 shadow-lg">
              🎮
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {studentName}，欢迎来到思维沙盘！
            </h1>
            <p className="text-gray-600 text-lg">
              在这里，你将经历一场独特的冒险之旅
            </p>
          </div>

          {/* 说明卡片 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>📖</span> 游戏规则
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-lg">🎯</span>
                <span>你将面对一系列情境挑战</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">🤖</span>
                <span>AI伙伴会陪你一起冒险</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">⚡</span>
                <span>每个选择都会影响故事发展</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <span>没有标准答案，跟随你的内心</span>
              </li>
            </ul>
          </div>

          {/* 按钮 */}
          <div className="flex gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                返回
              </button>
            )}
            <button
              onClick={handleStart}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94] text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg"
            >
              开始冒险！ 🚀
            </button>
          </div>
        </div>
      </div>
    )
  }

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
            AI正在分析你的决策模式和思维特质
          </p>
        </div>
      </div>
    )
  }

  // 游戏进行中
  return (
    <div className="sandbox-assessment min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div ref={containerRef} className="max-w-6xl mx-auto">
        {/* 顶部进度栏 - 集成XPBar */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/60 rounded-2xl mb-6 shadow-sm">
          <div className="h-1.5 bg-gray-100 rounded-t-2xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎮</span>
              <div>
                <p className="font-semibold text-gray-800">
                  {storyWorld ? storyWorld.title : '思维沙盘'}
                </p>
                <p className="text-xs text-gray-500">
                  {storyWorld && gameWorld
                    ? `第 ${gameWorld.currentChapter + 1}/${storyWorld.chapters.length} 章`
                    : `进度 ${currentQuestionIndex + 1}/${effectiveQuestions.length}`
                  }
                </p>
              </div>
              {/* XP经验条 */}
              <XPBar state={gamification} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#3B5FD9]">{progress}%</p>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* 左侧：剧情 + 决策 */}
          <div className="lg:col-span-2 space-y-6">
            {currentScene && (
              <>
                <StoryPanel
                  scene={currentScene}
                  character={aiCharacter}
                  progress={progress}
                />
                {/* 使用交互路由器替代固定的DecisionPanel */}
                <InteractionRouter
                  type={interactionType}
                  scene={currentScene}
                  onDecision={handleDecision}
                  timeLimit={currentScene.decision.timeLimit}
                />
              </>
            )}
          </div>

          {/* 右侧：AI角色对话 + 连击指示 */}
          <div className="lg:col-span-1 relative">
            <div className="sticky top-32">
              {/* 连击指示器 */}
              <ComboIndicator combo={gamification.combo} />

              {aiCharacter && (
                <CharacterPanel
                  character={aiCharacter}
                  messages={dialogueMessages}
                  studentAge={studentAge}
                  onSendMessage={handleSendMessage}
                  showInput={false}
                  emotion={characterEmotion}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 游戏化浮层 */}
      {gamification.justLeveledUp && (
        <LevelUpOverlay level={gamification.level} onDismiss={dismissLevelUp} />
      )}

      {gamification.latestBadge && (
        <BadgeUnlockPopup badge={gamification.latestBadge} onDismiss={dismissBadge} />
      )}

      {showStageTransition && stageTransitionData && (
        <StageTransition
          stageName={stageTransitionData.name}
          stageIcon={stageTransitionData.icon}
          stageColor={stageTransitionData.color}
          onComplete={() => setShowStageTransition(false)}
        />
      )}

      {/* 决策反馈动画 */}
      {showDecisionFeedback && feedbackData && (
        <DecisionFeedback
          selectedOptionId={feedbackData.optionId}
          dimensionScores={feedbackData.dimensionScores}
          xpGain={feedbackData.xpGain}
          combo={feedbackData.combo}
          onDone={() => setShowDecisionFeedback(false)}
        />
      )}

      {/* 章节过渡动画 */}
      {showChapterTransition && chapterTransitionData && (
        <ChapterTransition
          chapterTitle={chapterTransitionData.title}
          chapterIcon={chapterTransitionData.icon}
          chapterNumber={chapterTransitionData.number}
          totalChapters={chapterTransitionData.total}
          reward={chapterTransitionData.reward}
          onComplete={() => setShowChapterTransition(false)}
        />
      )}
    </div>
  )
}
