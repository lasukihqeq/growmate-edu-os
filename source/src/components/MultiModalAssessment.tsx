import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ArrowLeft, CheckCircle, Circle, Brain, Target, Sparkles, Printer, RotateCcw, GraduationCap, Briefcase, TrendingUp, BarChart3, Loader2 } from 'lucide-react'
import {
  calculateAdaptiveScores, generateEnhancedReport,
  WILDER_MAX,
  type AssessmentScores, type EnhancedReport,
} from '../lib/assessmentEngine'
import {
  createAIEngine, selectNextQuestion, recordAnswer,
  isEngineComplete, getUsedQuestionMaxScores,
  serializeState, deserializeState,
  type AIEngineState,
} from '../lib/adaptiveAIEngine'
import type { UnifiedQuestion } from '../lib/questions/types'
import { getQuestionsByAge } from '../lib/questions/registry'
import { initializeQuestionBank } from '../lib/questions/index'
import { buildFullEvidenceChain, type EvidenceChain } from '../lib/evidenceChainBuilder'
import type { WorkAnalysisResult } from '../types/newFeatures'
import { analyzeWorkImage } from '../lib/workAnalysisEngine'
import { useDraftAutoSave } from '../hooks/useDraftAutoSave'
import { loadDraft } from '../lib/draftManager'
import { useGamification } from '../hooks/useGamification'
import type { Badge } from '../lib/funElements'
import { XPBar, BadgeUnlockPopup, LevelUpOverlay, ComboIndicator } from './GamificationUI'
import { MiniGameAssessment } from './MiniGameAssessment'
import type { SandboxResults } from './SandboxAssessment'

// ===== Types =====
type Phase = 'intro' | 'answering' | 'artwork' | 'calculating' | 'result'

interface Props {
  onBack: () => void
  onComplete?: (scores: AssessmentScores, report: EnhancedReport, evidenceChain?: EvidenceChain) => void
  studentName?: string
  studentAge: number
  studentPhone?: string
  assessmentMode?: 'standard' | 'minigame'  // 评估模式：标准 or 游戏
  onSwitchMode?: (mode: 'standard' | 'minigame') => void
}

// ===== Floating Particles Background =====
function FloatingParticles({ count = 12, colors }: { count?: number; colors?: string[] }) {
  const particles = useMemo(() => {
    const defaultColors = ['#3B5FD9', '#FFB800', '#0F9D94', '#7C5CE6', '#F59E0B', '#3B82F6']
    const c = colors || defaultColors
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      bottom: `${-10 + Math.random() * 20}%`,
      size: 4 + Math.random() * 8,
      color: c[i % c.length],
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 5,
      shape: ['circle', 'star', 'diamond'][Math.floor(Math.random() * 3)] as string,
    }))
  }, [count, colors])

  return (
    <div className="floating-particles">
      {particles.map(p => (
        <div
          key={p.id}
          className={`floating-particle ${p.shape === 'star' ? 'shape-star' : p.shape === 'diamond' ? 'shape-diamond' : ''}`}
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  )
}

// ===== Milestone Celebration =====
function MilestoneCelebration({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="text-center mb-2">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-full animate-bounce-in shadow-md shadow-teal-500/10">
        <span className="text-lg animate-float">{emoji}</span>
        <span className="text-xs font-bold text-teal-700">{text}</span>
        <span className="text-lg animate-float" style={{ animationDelay: '0.5s' }}>✨</span>
      </div>
    </div>
  )
}

// ===== Main Component =====
export function MultiModalAssessment({
  onBack,
  onComplete,
  studentName,
  studentAge,
  studentPhone,
  assessmentMode: externalMode = 'standard',
  onSwitchMode,
}: Props) {
  const [assessmentMode, setAssessmentMode] = useState<'standard' | 'minigame'>(externalMode)
  const [phase, setPhase] = useState<Phase>('intro')
  const [choiceAnswers, setChoiceAnswers] = useState<Record<string, string>>({})
  const [judgmentAnswers, setJudgmentAnswers] = useState<Record<string, boolean>>({})
  const [scores, setScores] = useState<AssessmentScores | null>(null)
  const [report, setReport] = useState<EnhancedReport | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // AI引擎状态
  const [engineState, setEngineState] = useState<AIEngineState | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<UnifiedQuestion | null>(null)
  const [isEngineLoading, setIsEngineLoading] = useState(false)
  const [sandboxQuestions, setSandboxQuestions] = useState<UnifiedQuestion[]>([])
  const engineInitRef = useRef(false)

  // 游戏化系统
  const { state: gamification, onAnswer: gamifyOnAnswer, dismissBadge, dismissLevelUp } = useGamification()

  // 恢复草稿
  useEffect(() => {
    if (engineInitRef.current) return
    engineInitRef.current = true

    const draft = loadDraft()
    if (draft?.stage === 'multi-modal' && draft.multiModal) {
      const dm = draft.multiModal
      setChoiceAnswers(dm.choiceAnswers)
      setJudgmentAnswers(dm.judgmentAnswers)

      if (dm.engineMode === 'ai' && dm.aiEngineState) {
        // AI引擎草稿恢复
        setIsEngineLoading(true)
        deserializeState(dm.aiEngineState, studentAge).then(state => {
          setEngineState(state)
          const nextQ = selectNextQuestion(state)
          if (nextQ && (dm.phase === 'answering' || dm.phase === 'choice' || dm.phase === 'judgment')) {
            setCurrentQuestion(nextQ)
            setPhase('answering')
          } else if (dm.phase === 'artwork') {
            setPhase('artwork')
          }
          setIsEngineLoading(false)
        }).catch(() => {
          setIsEngineLoading(false)
        })
      }
      // 非AI模式的旧草稿不恢复（让用户重新开始用AI模式）
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 自动保存草稿（仅在答题阶段）
  useDraftAutoSave(
    () => ({
      stage: 'multi-modal',
      multiModal: {
        phase,
        currentChoiceIdx: 0,
        currentJudgmentIdx: 0,
        choiceAnswers,
        judgmentAnswers,
        randomSeed: engineState?.seed || 0,
        engineMode: 'ai' as const,
        aiEngineState: engineState ? serializeState(engineState) : undefined,
      },
    }),
    [phase, choiceAnswers, judgmentAnswers, engineState?.totalAnswered],
    { enabled: phase === 'answering' || phase === 'artwork' }
  )

  // 进度计算
  const totalSteps = engineState?.maxQuestions || 32
  const currentStep = engineState?.totalAnswered || 0
  const progress = phase === 'intro' ? 0 : phase === 'result' ? 100 : Math.round((currentStep / totalSteps) * 100)

  // 预估剩余时间计算（每题约15秒）
  const remainingSteps = totalSteps - currentStep
  const estimatedMinutes = Math.ceil(remainingSteps * 15 / 60)

  // 阶段里程碑
  const getMilestoneMessage = () => {
    if (progress >= 75) return { emoji: '🎉', text: '最后冲刺！马上完成' }
    if (progress >= 50) return { emoji: '💪', text: '已过半！继续加油' }
    if (progress >= 25) return { emoji: '✨', text: '不错！保持节奏' }
    return null
  }
  const milestone = getMilestoneMessage()

  // 模式切换
  const handleSwitchMode = useCallback((mode: 'standard' | 'minigame') => {
    setAssessmentMode(mode)
    onSwitchMode?.(mode)
  }, [onSwitchMode])

  // 沙盘模式完成 → 桥接转换为标准 AssessmentScores + EnhancedReport
  const handleSandboxComplete = useCallback((results: SandboxResults) => {
    // 将 SandboxResults.dimensionScores 归一化为 WILDER 百分位
    const dims: ('W' | 'I' | 'L' | 'D' | 'E' | 'R')[] = ['W', 'I', 'L', 'D', 'E', 'R']
    const dimNames: Record<string, string> = { W: '好奇心', I: '探究力', L: '连接力', D: '设计力', E: '表达力', R: '反思力' }
    const wilder: Record<string, number> = {}
    const wilderLevels: Record<string, 'high' | 'mid' | 'low'> = {}
    let profileCode = ''

    for (const d of dims) {
      // 沙盘维度分数可能是绝对累加值，需要归一化到 0-100
      const raw = results.dimensionScores[d] ?? results.dimensionScores[dimNames[d]] ?? 0
      const pct = Math.min(100, Math.max(0, Math.round(raw)))
      wilder[d] = pct
      wilderLevels[d] = pct >= 70 ? 'high' : pct >= 40 ? 'mid' : 'low'
      profileCode += wilderLevels[d][0].toUpperCase()
    }

    // 格式化为 HHM-MHL 风格
    profileCode = `${profileCode.slice(0, 3)}-${profileCode.slice(3)}`

    const sandboxScores: AssessmentScores = {
      wilder: wilder as any,
      wilderLevels: wilderLevels as any,
      wilderLayer2: {},
      multipleIntelligences: { linguistic: 50, logicalMath: 50, spatial: 50, musical: 50, bodily: 50, interpersonal: 50, intrapersonal: 50, naturalist: 50 },
      bigFive: { O: 50, C: 50, E: 50, A: 50, N: 50 },
      cognitive: { conservation: 50, deduction: 50, hypothesis: 50, metacognition: 50 },
      executiveFunction: { inhibition: 50, flexibility: 50 },
      chc: { Gf: 50, Gc: 50 },
      grit: { passion: 50, perseverance: 50 },
      sel: { selfAwareness: 50, selfManagement: 50, socialAwareness: 50, relationshipSkills: 50, responsibleDecision: 50 },
      profileCode,
      reportVariantId: 1,
    }

    const sandboxReport = generateEnhancedReport(sandboxScores)
    onComplete?.(sandboxScores, sandboxReport)
  }, [onComplete])

  // 开始测评（初始化引擎 + 进入答题阶段）
  const handleStart = useCallback(async () => {
    // 游戏模式：MiniGameAssessment 组件自行处理初始化
    if (assessmentMode === 'minigame') {
      setPhase('answering')
      return
    }

    if (isEngineLoading) return
    setIsEngineLoading(true)
    try {
      let state = engineState
      if (!state) {
        state = await createAIEngine(studentAge, {}, studentName, studentPhone?.slice(-4))
        setEngineState(state)
      }
      const firstQ = selectNextQuestion(state)
      setCurrentQuestion(firstQ)
      setPhase('answering')
    } finally {
      setIsEngineLoading(false)
    }
  }, [engineState, studentAge, studentName, studentPhone, isEngineLoading, assessmentMode])

  // 处理选择题回答
  const handleChoiceAnswer = useCallback((questionId: string, optionId: string) => {
    if (!engineState) return
    setSelectedOption(optionId)
    gamifyOnAnswer()
    setTimeout(() => {
      setChoiceAnswers(prev => ({ ...prev, [questionId]: optionId }))
      setSelectedOption(null)

      // 更新引擎状态
      const newState = recordAnswer(engineState, questionId, optionId)
      setEngineState(newState)

      // 检查是否完成
      if (isEngineComplete(newState)) {
        setPhase('artwork')
        setCurrentQuestion(null)
        return
      }

      // 选择下一题
      const nextQ = selectNextQuestion(newState)
      if (nextQ) {
        setCurrentQuestion(nextQ)
      } else {
        setPhase('artwork')
        setCurrentQuestion(null)
      }
    }, 600)
  }, [engineState, gamifyOnAnswer])

  // 处理判断题回答
  const handleJudgmentAnswer = useCallback((questionId: string, answer: boolean) => {
    if (!engineState) return

    gamifyOnAnswer()
    setJudgmentAnswers(prev => ({ ...prev, [questionId]: answer }))

    // 更新引擎状态
    const newState = recordAnswer(engineState, questionId, answer)
    setEngineState(newState)

    // 检查是否完成
    if (isEngineComplete(newState)) {
      setPhase('artwork')
      setCurrentQuestion(null)
      return
    }

    // 选择下一题
    const nextQ = selectNextQuestion(newState)
    if (nextQ) {
      setCurrentQuestion(nextQ)
    } else {
      setPhase('artwork')
      setCurrentQuestion(null)
    }
  }, [engineState, gamifyOnAnswer])

  // 计算结果
  const handleCalculate = useCallback(() => {
    if (!engineState) return
    setPhase('calculating')
    setTimeout(() => {
      // 从AI引擎获取实际使用题目的最大分
      const dynamicMax = getUsedQuestionMaxScores(engineState)

      // 分离选择题和判断题用于评分
      const usedChoices = engineState.usedQuestions.filter(q => q.type === 'choice')
      const usedJudgments = engineState.usedQuestions.filter(q => q.type === 'judgment')

      const { scores: s } = calculateAdaptiveScores(
        choiceAnswers, judgmentAnswers,
        usedChoices as any[], usedJudgments as any[]
      )
      setScores(s)
      const r = generateEnhancedReport(s, dynamicMax)
      setReport(r)

      // 构建完整证据链
      const chain = buildFullEvidenceChain(
        studentName || '同学',
        usedChoices as any[], usedJudgments as any[],
        choiceAnswers, judgmentAnswers,
        dynamicMax
      )
      console.log('[Assessment] 证据链构建完成，共', chain.evidenceRecords.length, '条证据，置信度', chain.confidenceScore + '%')

      if (onComplete) {
        setTimeout(() => onComplete(s, r, chain), 800)
      } else {
        setPhase('result')
      }
    }, 2500)
  }, [engineState, choiceAnswers, judgmentAnswers, onComplete, studentName])

  const handleRestart = useCallback(() => {
    setPhase('intro')
    setChoiceAnswers({})
    setJudgmentAnswers({})
    setScores(null)
    setReport(null)
    setSelectedOption(null)
    setEngineState(null)
    setCurrentQuestion(null)
    engineInitRef.current = false
  }, [])

  // 当前题型标签
  const phaseLabel = currentQuestion?.type === 'choice' ? '情境选择' : currentQuestion?.type === 'judgment' ? '快速判断' : '测评'

  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
      {/* 游戏模式：直接渲染全屏 MiniGameAssessment */}
      {phase === 'answering' && assessmentMode === 'minigame' ? (
        <MiniGameAssessment
          studentName={studentName || '同学'}
          studentAge={studentAge}
          onComplete={handleSandboxComplete}
          onBack={onBack}
        />
      ) : (
      <>
      {/* Top Bar - 仅标准模式显示 */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-lg mx-auto px-5 py-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onBack} className="text-slate-600 dark:text-ws-text-secondary hover:text-slate-900 dark:hover:text-ws-text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              {phase === 'answering' && currentQuestion && (
                <>
                  <span className="text-xs font-medium text-slate-400 dark:text-ws-text-muted">
                    {phaseLabel}
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-ws-text-secondary bg-slate-100 dark:bg-ws-bg-elevated px-2 py-1 rounded-full">
                    {currentStep + 1}/{totalSteps}
                  </span>
                </>
              )}
            </div>
            {phase === 'answering' && assessmentMode === 'standard' && estimatedMinutes > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-ws-text-muted">
                  约{estimatedMinutes}分钟
                </span>
              </div>
            )}
          </div>
          {/* 里程碑提示 */}
          {milestone && phase === 'answering' && assessmentMode === 'standard' && (
            <MilestoneCelebration emoji={milestone.emoji} text={milestone.text} />
          )}
        </div>
        {phase === 'answering' && assessmentMode === 'standard' && (
          <div className="h-2 bg-slate-100 dark:bg-ws-bg-elevated relative overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-teal-400 via-emerald-500 to-green-500 transition-all duration-700 ease-out relative ${progress >= 75 ? 'progress-celebrate' : ''}`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 shimmer" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white dark:bg-ws-bg-card border-2 border-teal-500 dark:border-teal-400 rounded-full shadow-md" style={{ animation: 'soft-pulse 2s ease-in-out infinite' }} />
            </div>
          </div>
        )}
      </div>

      {/* XP 经验条 */}
      {phase === 'answering' && assessmentMode === 'standard' && (
        <div className="sticky top-[60px] z-40 bg-white/90 dark:bg-[#1a2332]/90 backdrop-blur-sm border-b border-slate-100/50">
          <div className="max-w-lg mx-auto">
            <XPBar state={gamification} />
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-5 py-6">
        {phase === 'intro' && (
          <IntroPhase
            onStart={handleStart}
            studentAge={studentAge}
            isLoading={isEngineLoading}
            assessmentMode={assessmentMode}
            onSwitchMode={handleSwitchMode}
          />
        )}
        {/* 标准模式：渲染问卷流程 */}
        {phase === 'answering' && assessmentMode === 'standard' && currentQuestion?.type === 'choice' && (
          <ChoicePhase
            key={`choice-${currentQuestion.id}`}
            question={currentQuestion}
            selectedOption={selectedOption}
            onAnswer={handleChoiceAnswer}
            onGoBack={() => {}}
            canGoBack={false}
            previousAnswer={choiceAnswers[currentQuestion.id]}
          />
        )}
        {phase === 'answering' && assessmentMode === 'standard' && currentQuestion?.type === 'judgment' && (
          <JudgmentPhase
            key={`judgment-${currentQuestion.id}`}
            question={currentQuestion}
            onAnswer={handleJudgmentAnswer}
            onGoBack={() => {}}
            canGoBack={false}
            previousAnswer={judgmentAnswers[currentQuestion.id]}
          />
        )}
        {phase === 'answering' && assessmentMode === 'standard' && isEngineLoading && !currentQuestion && (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#3B5FD9] mx-auto" />
            <p className="text-sm text-slate-500 mt-4">正在准备题目...</p>
          </div>
        )}
        {phase === 'artwork' && (
          <ArtworkPhase
            onSkip={handleCalculate}
            onAnalyzed={handleCalculate}
            studentName={studentName}
          />
        )}
        {phase === 'calculating' && <CalculatingPhase />}
        {phase === 'result' && scores && report && (
          <ResultPhase scores={scores} report={report} onRestart={handleRestart} onBack={onBack} studentName={studentName} />
        )}
      </div>

      {/* 游戏化覆盖层 */}
      <ComboIndicator combo={gamification.combo} />

      {gamification.latestBadge && (
        <BadgeUnlockPopup badge={gamification.latestBadge as Badge} onDismiss={dismissBadge} />
      )}

      {gamification.justLeveledUp && (
        <LevelUpOverlay level={gamification.level} onDismiss={dismissLevelUp} />
      )}
      </>
      )}
    </div>
  )
}

// ===== Intro Phase =====
function IntroPhase({
  onStart,
  studentAge,
  isLoading,
  assessmentMode = 'standard',
  onSwitchMode,
}: {
  onStart: () => void
  studentAge: number
  isLoading?: boolean
  assessmentMode?: 'standard' | 'minigame'
  onSwitchMode?: (mode: 'standard' | 'minigame') => void
}) {
  const getGreeting = (age: number) => {
    if (age <= 9) return { title: '小探索家，准备好了吗？', emoji: '🌟', desc: '一起发现你的特别之处！' }
    if (age <= 12) return { title: '让我们发现你的超能力！', emoji: '⚡', desc: '每个人都有独特的潜能。' }
    if (age <= 15) return { title: '探索你的潜能密码', emoji: '🔑', desc: '找到属于你的成长路径。' }
    return { title: '发现你的核心竞争力', emoji: '🎯', desc: '了解自己，规划未来。' }
  }

  const greeting = getGreeting(studentAge)

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* 浮动粒子装饰 */}
      <FloatingParticles count={10} />

      {/* Hero - 带动画增强 */}
      <div className="text-center space-y-4 pt-8 relative">
        {/* 背景装饰圆环 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full border-4 border-dashed border-[#3B5FD9]/20 dark:border-[#3B5FD9]/40 opacity-40" style={{ animation: 'slow-spin 20s linear infinite' }} />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 border-dashed border-[#FFB800]/30" style={{ animation: 'slow-spin 15s linear infinite reverse' }} />

        <div className="text-6xl mb-4 animate-bounce-in relative z-10" style={{ animationDelay: '0.2s' }}>{greeting.emoji}</div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-ws-text-primary leading-tight animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {greeting.title}
        </h1>
        <p className="text-slate-600 dark:text-ws-text-secondary leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {greeting.desc}
        </p>
      </div>

      {/* Key Benefits - 交错弹入动画 */}
      <div className="space-y-3">
        {[
          { icon: '🎨', title: '发现你的潜能', desc: '找到你最擅长的领域', gradient: 'from-rose-50 to-orange-50 dark:from-rose-900/10 dark:to-orange-900/10' },
          { icon: '📚', title: '个性化建议', desc: '获得专属成长方案', gradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10' },
          { icon: '🚀', title: '规划未来', desc: '探索适合你的发展方向', gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10' },
        ].map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 p-4 bg-gradient-to-r ${item.gradient} rounded-2xl border border-slate-100/80 dark:border-ws-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-bounce-in`}
            style={{ animationDelay: `${0.5 + i * 0.15}s` }}
          >
            <div className="text-3xl flex-shrink-0" style={{ animation: 'soft-pulse 3s ease-in-out infinite', animationDelay: `${i * 0.5}s` }}>{item.icon}</div>
            <div>
              <div className="font-bold text-slate-900 dark:text-ws-text-primary mb-1">{item.title}</div>
              <div className="text-sm text-slate-600 dark:text-ws-text-secondary">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Start Button - 带呼吸光晕 */}
      <div className="text-center pt-4 animate-slide-up" style={{ animationDelay: '0.95s' }}>
        {/* 模式选择双卡片 */}
        {onSwitchMode && (
          <div className="mb-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => onSwitchMode('standard')}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                assessmentMode === 'standard'
                  ? 'border-[#3B5FD9] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg shadow-[#3B5FD9]/15 scale-[1.02]'
                  : 'border-slate-200 dark:border-ws-border bg-white dark:bg-ws-bg-card hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {assessmentMode === 'standard' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#3B5FD9] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
              <div className="text-2xl mb-2">📝</div>
              <div className={`font-bold text-sm mb-1 ${assessmentMode === 'standard' ? 'text-[#3B5FD9]' : 'text-slate-700 dark:text-ws-text-primary'}`}>标准模式</div>
              <div className="text-xs text-slate-500 dark:text-ws-text-muted leading-relaxed">传统问卷<br/>约 8-10 分钟</div>
            </button>
            <button
              onClick={() => onSwitchMode('minigame')}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                assessmentMode === 'minigame'
                  ? 'border-[#0F9D94] bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 shadow-lg shadow-[#0F9D94]/15 scale-[1.02]'
                  : 'border-slate-200 dark:border-ws-border bg-white dark:bg-ws-bg-card hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {assessmentMode === 'minigame' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#0F9D94] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
              <div className="text-2xl mb-2">🎮</div>
              <div className={`font-bold text-sm mb-1 ${assessmentMode === 'minigame' ? 'text-[#0F9D94]' : 'text-slate-700 dark:text-ws-text-primary'}`}>游戏模式</div>
              <div className="text-xs text-slate-500 dark:text-ws-text-muted leading-relaxed">闯关测评<br/>约 10-12 分钟</div>
            </button>
          </div>
        )}

        <button
          onClick={onStart}
          disabled={isLoading}
          className="w-full py-5 bg-gradient-to-r from-[#3B5FD9] to-indigo-600 dark:from-[#3B5FD9] dark:to-indigo-500 text-white text-lg font-bold rounded-2xl shadow-lg shadow-[#3B5FD9]/30 dark:shadow-[#3B5FD9]/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 relative overflow-hidden"
        >
          {/* 光效扫过 */}
          {!isLoading && <div className="absolute inset-0 shimmer" />}
          <span className="relative z-10">{isLoading ? '正在准备...' : assessmentMode === 'minigame' ? '开始闯关！🚀' : '开始探索 ✨'}</span>
        </button>
        <p className="text-xs text-slate-400 dark:text-ws-text-muted mt-3">
          {assessmentMode === 'minigame' ? '约 10-12 分钟 · 游戏体验' : '约 8-10 分钟 · 随时可返回'}
        </p>
      </div>
    </div>
  )
}

// ===== Choice Phase =====
function ChoicePhase({
  question, selectedOption, onAnswer, onGoBack, canGoBack, previousAnswer
}: {
  question: any
  selectedOption: string | null
  onAnswer: (qid: string, optId: string) => void
  onGoBack: () => void
  canGoBack: boolean
  previousAnswer?: string
}) {
  const optionLabels = ['A', 'B', 'C', 'D', 'E']
  const dimensionEmojis: Record<string, string> = {
    '好奇心': '🔭', '探究力': '🔬', '连接力': '🤝',
    '设计力': '📐', '表达力': '🎤', '反思力': '🪞'
  }
  const dimensionColors: Record<string, string> = {
    '好奇心': 'from-sky-400 to-blue-500',
    '探究力': 'from-violet-400 to-purple-500',
    '连接力': 'from-emerald-400 to-teal-500',
    '设计力': 'from-amber-400 to-orange-500',
    '表达力': 'from-rose-400 to-pink-500',
    '反思力': 'from-indigo-400 to-blue-600',
  }
  const gradColor = dimensionColors[question.dimension] || 'from-[#3B5FD9] to-[#2A4BC1]'

  return (
    <div className="space-y-6 animate-slide-in-right relative">
      {/* Dimension Context - 带弹出动画 */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradColor} shadow-lg animate-bounce-in`}>
          <span className="text-xl animate-dim-icon-pop">{dimensionEmojis[question.dimension] || '✨'}</span>
          <span className="text-sm font-bold text-white">{question.dimension}</span>
        </div>
      </div>

      {/* Scenario */}
      {question.scenario && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl px-5 py-4 border border-blue-100 dark:border-blue-800/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-sm text-slate-700 dark:text-ws-text-primary leading-relaxed">{question.scenario}</p>
        </div>
      )}

      {/* Question */}
      <h2 className="text-lg font-bold text-slate-900 dark:text-ws-text-primary leading-relaxed animate-slide-up" style={{ animationDelay: '0.15s' }}>{question.text}</h2>

      {/* Options - 序列弹入 */}
      <div className="space-y-3">
        {question.options.map((opt: any, i: number) => {
          const isSelected = selectedOption === opt.id
          const isPrevious = previousAnswer === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onAnswer(question.id, opt.id)}
              disabled={selectedOption !== null}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 stagger-item relative overflow-hidden
                ${isSelected
                  ? 'border-[#3B5FD9] dark:border-[#6B8CF0] bg-[#EEF2FF] dark:bg-[#3B5FD9]/20 shadow-lg scale-[1.02] animate-option-ripple'
                  : isPrevious
                  ? 'border-slate-300 dark:border-ws-border bg-slate-50 dark:bg-ws-bg-elevated'
                  : 'border-slate-200 dark:border-ws-border bg-white dark:bg-ws-bg-card hover:border-[#6B8CF0] dark:hover:border-slate-600 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]'
                }
                ${selectedOption !== null && !isSelected ? 'opacity-40 scale-[0.97]' : ''}
              `}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* 选中闪光 */}
              {isSelected && <div className="answer-flash bg-[#3B5FD9]/20" />}
              <div className="flex items-start gap-4 relative z-10">
                <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${isSelected
                    ? 'bg-gradient-to-br from-[#3B5FD9] to-indigo-500 text-white shadow-md rotate-0'
                    : isPrevious
                    ? 'bg-slate-400 dark:bg-slate-600 text-white'
                    : 'bg-slate-100 dark:bg-ws-bg-elevated text-slate-600 dark:text-ws-text-secondary group-hover:bg-slate-200'}`}>
                  {isSelected ? <CheckCircle className="w-5 h-5" /> : optionLabels[i]}
                </span>
                <span className={`text-base leading-relaxed pt-1.5 transition-colors duration-300 ${isSelected ? 'text-[#3B5FD9] dark:text-[#6B8CF0] font-semibold' : 'text-slate-800 dark:text-ws-text-primary'}`}>{opt.text}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Back Button */}
      {canGoBack && (
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 dark:text-ws-text-muted hover:text-slate-700 dark:hover:text-ws-text-secondary rounded-lg hover:bg-slate-100 dark:hover:bg-ws-bg-elevated transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          上一题
        </button>
      )}
    </div>
  )
}

// ===== Judgment Phase =====
function JudgmentPhase({
  question, onAnswer, onGoBack, canGoBack, previousAnswer: _previousAnswer
}: {
  question: any
  onAnswer: (qid: string, answer: boolean) => void
  onGoBack: () => void
  canGoBack?: boolean
  previousAnswer?: boolean
}) {
  const [selected, setSelected] = useState<boolean | null>(null)
  const dimensionEmojis: Record<string, string> = {
    '好奇心': '🔭', '探究力': '🔬', '连接力': '🤝',
    '设计力': '📐', '表达力': '🎤', '反思力': '🪞'
  }

  const handleSelect = (answer: boolean) => {
    if (selected !== null) return
    setSelected(answer)
    setTimeout(() => {
      onAnswer(question.id, answer)
    }, 500)
  }

  const getOptionClass = (value: boolean) => {
    const isSelected = selected === value
    const hasSelection = selected !== null
    const base = 'flex-1 py-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden'
    if (isSelected) {
      return `${base} border-[#3B5FD9] dark:border-[#6B8CF0] bg-gradient-to-br from-[#EEF2FF] to-indigo-50 dark:from-[#3B5FD9]/20 dark:to-indigo-900/20 shadow-lg scale-[1.03] animate-option-ripple`
    }
    if (hasSelection) {
      return `${base} border-slate-200 dark:border-ws-border bg-white dark:bg-ws-bg-card opacity-40 scale-[0.97]`
    }
    return `${base} border-slate-200 dark:border-ws-border bg-white dark:bg-ws-bg-card hover:border-violet-300 dark:hover:border-slate-600 hover:shadow-md hover:-translate-y-0.5 active:scale-95`
  }

  return (
    <div className="space-y-8 animate-slide-in-right pt-4">
      {/* Dimension Context */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full shadow-lg animate-bounce-in">
          <span className="text-xl animate-dim-icon-pop">{dimensionEmojis[question.dimension] || '✨'}</span>
          <span className="text-sm font-bold text-white">{question.dimension}</span>
        </div>
      </div>

      {/* Scenario */}
      {question.scenario && (
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl px-5 py-4 border border-violet-100 dark:border-violet-800/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-sm text-slate-700 dark:text-ws-text-primary leading-relaxed">{question.scenario}</p>
        </div>
      )}

      {/* Question Card - 带呼吸边框 */}
      <div className="bg-white dark:bg-ws-bg-card rounded-3xl border-2 border-slate-200 dark:border-ws-border p-8 text-center shadow-sm animate-slide-up relative" style={{ animationDelay: '0.15s' }}>
        {/* 引导提示 */}
        <div className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl inline-block">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">请根据孩子的日常表现，判断这句话是否描述准确</p>
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-ws-text-primary leading-relaxed mb-6">{question.text}</h2>

        {/* Options - 带动画 */}
        <div className="flex gap-4">
          <button
            onClick={() => handleSelect(true)}
            disabled={selected !== null}
            className={getOptionClass(true)}
          >
            {selected === true && <div className="answer-flash bg-emerald-400/20" />}
            <div className="relative z-10">
              {selected === true
                ? <CheckCircle className="w-8 h-8 mx-auto mb-2 text-[#3B5FD9] dark:text-[#6B8CF0] animate-bounce-in" />
                : <Circle className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
              }
              <span className={`text-base font-bold transition-colors duration-300 ${selected === true ? 'text-[#3B5FD9] dark:text-[#6B8CF0]' : 'text-slate-700 dark:text-ws-text-primary'}`}>符合，就是这样</span>
              <span className={`block text-xs mt-1 transition-colors duration-300 ${selected === true ? 'text-[#3B5FD9] dark:text-[#6B8CF0]' : 'text-slate-400 dark:text-ws-text-muted'}`}>孩子的表现与描述一致</span>
            </div>
          </button>
          <button
            onClick={() => handleSelect(false)}
            disabled={selected !== null}
            className={getOptionClass(false)}
          >
            {selected === false && <div className="answer-flash bg-emerald-400/20" />}
            <div className="relative z-10">
              {selected === false
                ? <CheckCircle className="w-8 h-8 mx-auto mb-2 text-[#3B5FD9] dark:text-[#6B8CF0] animate-bounce-in" />
                : <Circle className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
              }
              <span className={`text-base font-bold transition-colors duration-300 ${selected === false ? 'text-[#3B5FD9] dark:text-[#6B8CF0]' : 'text-slate-700 dark:text-ws-text-primary'}`}>不太符合</span>
              <span className={`block text-xs mt-1 transition-colors duration-300 ${selected === false ? 'text-[#3B5FD9] dark:text-[#6B8CF0]' : 'text-slate-400 dark:text-ws-text-muted'}`}>孩子很少这样表现</span>
            </div>
          </button>
        </div>
      </div>

      {/* Back Button */}
      {canGoBack !== false && (
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 dark:text-ws-text-muted hover:text-slate-700 dark:hover:text-ws-text-secondary rounded-lg hover:bg-slate-100 dark:hover:bg-ws-bg-elevated transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          上一题
        </button>
      )}
    </div>
  )
}

// ===== Artwork Phase (Step 3 - Optional) =====
// 增加 mapping_wilder 以匹配 workAnalysisEngine 的 onProgress 回调
type ArtworkAnalysisStage = 'extracting_colors' | 'analyzing_composition' | 'mapping_wilder' | 'generating_interpretation' | 'complete'

const ARTWORK_STAGE_LABELS: Record<ArtworkAnalysisStage, { text: string; icon: string }> = {
  extracting_colors: { text: '提取色彩特征', icon: '🎨' },
  analyzing_composition: { text: '分析构图布局', icon: '📐' },
  mapping_wilder: { text: '映射天赋维度', icon: '🧬' },
  generating_interpretation: { text: '生成创意解读', icon: '✨' },
  complete: { text: '分析完成', icon: '✅' },
}

function ArtworkPhase({ onSkip, onAnalyzed, studentName }: { onSkip: () => void; onAnalyzed: () => void; studentName?: string }) {
  console.log('[ArtworkPhase] 组件渲染开始')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisStage, setAnalysisStage] = useState<ArtworkAnalysisStage>('extracting_colors')
  const [result, setResult] = useState<WorkAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 安全的点击处理函数
  const handleUploadClick = useCallback(() => {
    console.log('[ArtworkPhase] 上传区域点击')
    try {
      if (inputRef.current) {
        inputRef.current.click()
      } else {
        console.warn('[ArtworkPhase] inputRef.current 为 null')
      }
    } catch (e) {
      console.error('[ArtworkPhase] 点击触发失败:', e)
    }
  }, [])

  const handleFile = useCallback(async (f: File) => {
    console.log('[ArtworkPhase] handleFile 开始处理:', f.name)
    if (!f.type.startsWith('image/')) { setError('请上传图片文件'); return }
    if (f.size > 10 * 1024 * 1024) { setError('文件不超过10MB'); return }
    setError(null)
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setAnalyzing(true)
    setAnalysisStage('extracting_colors')
    setResult(null) // 清除之前的结果
    try {
      const analysis = await analyzeWorkImage(f, undefined, (stage) => {
        console.log('[ArtworkPhase] 分析阶段:', stage)
        // 安全地设置阶段，确保是有效的 ArtworkAnalysisStage
        if (stage === 'extracting_colors' || stage === 'analyzing_composition' || 
            stage === 'mapping_wilder' || stage === 'generating_interpretation' || stage === 'complete') {
          setAnalysisStage(stage)
        }
      })
      // 验证分析结果的完整性
      if (!analysis || typeof analysis !== 'object') {
        throw new Error('分析结果无效')
      }
      setAnalysisStage('complete')
      setResult(analysis)
    } catch (e) {
      console.error('[ArtworkPhase] 分析失败:', e)
      setError(`分析失败：${e instanceof Error ? e.message : '未知错误'}`)
      setResult(null)
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const stages: ArtworkAnalysisStage[] = ['extracting_colors', 'analyzing_composition', 'mapping_wilder', 'generating_interpretation']
  const currentIdx = stages.indexOf(analysisStage)
  const progress = analysisStage === 'complete' ? 100 : Math.round(((Math.max(0, currentIdx) + 1) / stages.length) * 90)
  // 安全获取 stageInfo，提供默认值防止崩溃
  const stageInfo = ARTWORK_STAGE_LABELS[analysisStage] || { text: '处理中...', icon: '⏳' }
  
  console.log('[ArtworkPhase] 状态:', { file: !!file, analyzing, analysisStage, currentIdx, progress })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-3 pt-4">
        <div className="text-5xl">🎨</div>
        <h2 className="text-xl font-black text-slate-900 dark:text-ws-text-primary">上传一幅{studentName || '孩子'}的作品</h2>
        <p className="text-sm text-slate-500 dark:text-ws-text-secondary leading-relaxed">
          一幅画、一个手工、一张创意照片——帮助我们更全面地了解创造力特征
        </p>
      </div>

      {!file && (
        <div
          onClick={handleUploadClick}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          onDragOver={e => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 dark:border-ws-border hover:border-amber-400 dark:hover:border-amber-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white dark:bg-ws-bg-card"
        >
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">📷</div>
          <p className="font-bold text-gray-700 dark:text-ws-text-primary text-sm mb-1">点击上传或拖拽图片</p>
          <p className="text-xs text-gray-400 dark:text-ws-text-muted">支持 JPG、PNG，最大 10MB</p>
          <input 
            ref={inputRef} 
            type="file" 
            accept="image/*" 
            onChange={e => { 
              console.log('[ArtworkPhase] 文件选择变化');
              const f = e.target.files?.[0]; 
              if (f) handleFile(f) 
            }} 
            className="hidden" 
          />
        </div>
      )}

      {error && (
        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-xl p-3 text-sm text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <span>⚠️</span>{error}
        </div>
      )}

      {file && preview && (
        <div className="bg-white dark:bg-ws-bg-card rounded-xl border border-gray-200 dark:border-ws-border p-4 shadow-sm relative">
          <img src={preview} alt="作品预览" className="w-full rounded-lg object-contain max-h-48 bg-gray-50 dark:bg-ws-bg-elevated mb-3" />
          
          {/* 增强版分析动画 */}
          {analyzing && (
            <div className="space-y-4 py-4">
              {/* 双重旋转圆环 */}
              <div className="flex justify-center">
                <div className="relative w-16 h-16">
                  <div
                    className="absolute inset-0 rounded-full animate-spin"
                    style={{
                      background: 'conic-gradient(from 0deg, #f59e0b, #ef4444, #8b5cf6, #3b82f6, #10b981, #f59e0b)',
                      animationDuration: '2s'
                    }}
                  />
                  <div className="absolute inset-[3px] bg-white dark:bg-ws-bg-card rounded-full" />
                  <div
                    className="absolute inset-2 border-3 border-transparent rounded-full animate-spin"
                    style={{
                      borderTopColor: '#8b5cf6',
                      borderRightColor: '#f59e0b',
                      animationDirection: 'reverse',
                      animationDuration: '1s'
                    }}
                  />
                  <div className="absolute inset-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-lg animate-pulse">{stageInfo.icon}</span>
                  </div>
                </div>
              </div>

              {/* 进度条 */}
              <div className="px-4">
                <div className="h-2 bg-gray-100 dark:bg-ws-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* 阶段文本 */}
              <div className="text-center">
                <p className="text-sm font-bold text-gray-700 dark:text-ws-text-primary">正在分析作品...</p>
                <p className="text-xs text-gray-500 dark:text-ws-text-muted mt-1">{stageInfo.text}</p>
              </div>

              {/* 步骤指示器 */}
              <div className="flex items-center justify-center gap-2">
                {stages.map((s, i) => {
                  const isActive = i === currentIdx
                  const isComplete = i < currentIdx || analysisStage === 'complete'
                  return (
                    <div key={s} className="flex items-center gap-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                        isComplete
                          ? 'bg-emerald-500 dark:bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-amber-500 dark:bg-amber-600 text-white animate-pulse'
                          : 'bg-gray-200 dark:bg-ws-bg-elevated text-gray-400 dark:text-ws-text-muted'
                      }`}>
                        {isComplete ? '✓' : (ARTWORK_STAGE_LABELS[s]?.icon || '⏳')}
                      </div>
                      {i < stages.length - 1 && (
                        <div className={`w-4 h-0.5 transition-colors duration-300 ${
                          i < currentIdx ? 'bg-emerald-400 dark:bg-emerald-500' : 'bg-gray-200 dark:bg-ws-border'
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-2 pt-2">
              {result.parentTags && result.parentTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {result.parentTags.map((tag, i) => (
                    <span key={i} className="text-[11px] font-bold px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">{tag}</span>
                  ))}
                </div>
              )}
              {result.expressionStyle && (
                <p className="text-xs text-gray-600 dark:text-ws-text-secondary">{result.expressionStyle}</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2">
        {result && (
          <button
            onClick={onAnalyzed}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-amber-300/40 dark:hover:shadow-amber-500/20 transition-all text-sm"
          >
            作品已分析完成，继续生成报告 →
          </button>
        )}
        <button
          onClick={onSkip}
          className="w-full py-3 bg-gray-100 dark:bg-ws-bg-elevated text-gray-600 dark:text-ws-text-secondary font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-ws-bg-card transition-colors text-sm"
        >
          跳过此步骤，直接生成报告
        </button>
      </div>

      <p className="text-center text-[10px] text-gray-400 dark:text-ws-text-muted">
        作品分析为可选增强功能，不影响核心测评结果
      </p>
    </div>
  )
}

// ===== Calculating Phase =====
function CalculatingPhase() {
  const [step, setStep] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string }>>([])
  const steps = [
    { text: '正在分析第一轮回答...', icon: <Brain className="w-5 h-5" />, emoji: '🧠' },
    { text: '发现你的潜能特征...', icon: <Sparkles className="w-5 h-5" />, emoji: '✨' },
    { text: '准备AI专属互动问答...', icon: <Target className="w-5 h-5" />, emoji: '🎯' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => Math.min(prev + 1, steps.length - 1))
    }, 800)
    return () => clearInterval(timer)
  }, [])

  // 定时生成庆祝粒子
  useEffect(() => {
    const timer = setInterval(() => {
      setParticles(prev => {
        const newP = { id: Date.now(), x: 10 + Math.random() * 80, color: ['#3B5FD9', '#FFB800', '#0F9D94', '#7C5CE6'][Math.floor(Math.random() * 4)] }
        return [...prev.slice(-8), newP]
      })
    }, 400)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="py-12 text-center space-y-8 animate-in fade-in duration-500 relative overflow-hidden">
      {/* 浮动庆祝粒子 */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: 0,
            background: p.color,
            animation: 'particle-float 3s ease-out forwards',
          }}
        />
      ))}

      {/* 双层旋转圆环 */}
      <div className="relative w-28 h-28 mx-auto animate-bounce-in">
        {/* 外环 - 慢速旋转 */}
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#3B5FD9]/20 dark:border-[#3B5FD9]/40" style={{ animation: 'slow-spin 8s linear infinite' }} />
        {/* 中环 - 渐变旋转 */}
        <div className="absolute inset-1 rounded-full" style={{
          background: 'conic-gradient(from 0deg, #3B5FD9, #7C5CE6, #0F9D94, #FFB800, #3B5FD9)',
          animation: 'slow-spin 3s linear infinite',
        }}>
          <div className="absolute inset-[3px] bg-white dark:bg-ws-bg-card rounded-full" />
        </div>
        {/* 内核 */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#3B5FD9] to-indigo-600 dark:from-[#3B5FD9] dark:to-indigo-700 flex items-center justify-center shadow-lg shadow-[#3B5FD9]/30">
          <Sparkles className="w-8 h-8 text-white" style={{ animation: 'soft-pulse 1.5s ease-in-out infinite' }} />
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-ws-text-primary mb-2">第一轮测评完成！</h2>
        <p className="text-sm text-slate-500 dark:text-ws-text-secondary">专属AI第二轮互动问答即将开始</p>
      </div>

      {/* Progress Steps - 带交错动画 */}
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-500 animate-bounce-in ${
            i <= step ? 'bg-gradient-to-r from-[#EEF2FF] to-indigo-50 dark:from-[#3B5FD9]/20 dark:to-indigo-900/20 border-2 border-[#6B8CF0] dark:border-[#3B5FD9]/50 shadow-sm' : 'bg-slate-50 dark:bg-ws-bg-elevated border-2 border-slate-100 dark:border-ws-border opacity-50'
          }`} style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
            <span className={`text-lg ${i <= step ? '' : 'grayscale opacity-50'}`}>{s.emoji}</span>
            <span className={`text-sm font-medium flex-1 text-left ${i <= step ? 'text-[#3B5FD9] dark:text-[#6B8CF0]' : 'text-slate-400 dark:text-ws-text-muted'}`}>{s.text}</span>
            {i < step && <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 ml-auto animate-bounce-in" />}
            {i === step && <div className="w-5 h-5 rounded-full border-2 border-[#3B5FD9] border-t-transparent animate-spin ml-auto" />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== Result Phase (Simplified) =====
function ResultPhase({
  scores, report, onRestart, onBack: _onBack, studentName
}: {
  scores: AssessmentScores
  report: EnhancedReport
  onRestart: () => void
  onBack: () => void
  studentName?: string
}) {
  void _onBack // 保留接口但暂未使用
  const dims = ['W', 'I', 'L', 'D', 'E', 'R'] as const
  const dimLabels: Record<string, { name: string; emoji: string }> = {
    W: { name: '好奇心', emoji: '🔭' }, I: { name: '探究力', emoji: '🔬' },
    L: { name: '连接力', emoji: '🤝' }, D: { name: '设计力', emoji: '📐' },
    E: { name: '表达力', emoji: '🎤' }, R: { name: '反思力', emoji: '🪞' },
  }
  const levelLabels = { high: '突出', mid: '发展中', low: '待激发' }

  const { profile729, fullReport: _fullReport } = report
  void _fullReport // 保留但暂未使用

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Profile Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2A4BC1] to-indigo-900 dark:from-[#1E3A8A] dark:to-indigo-900 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">#{report.variantId}</span>
            <span className="px-3 py-1 bg-emerald-500/30 rounded-full text-xs font-bold">置信度 {report.confidenceLevel}%</span>
          </div>
          <h1 className="text-2xl font-black mb-2">{studentName ? `${studentName}的画像：` : ''}{profile729.talentName}</h1>
          <p className="text-white/80 text-sm leading-relaxed">{profile729.characterDescription}</p>
        </div>
      </div>

      {/* WILDER Dimensions */}
      <div className="bg-white dark:bg-ws-bg-card rounded-3xl border border-slate-100 dark:border-ws-border p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-ws-text-primary mb-5 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#3B5FD9] dark:text-[#6B8CF0]" /> 六维能力图谱
        </h3>
        <div className="space-y-4">
          {dims.map(d => {
            const pct = Math.round((scores.wilder[d] / WILDER_MAX[d]) * 100)
            const level = scores.wilderLevels[d]
            const barColors = { high: 'from-emerald-400 to-emerald-500', mid: 'from-amber-400 to-amber-500', low: 'from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700' }
            const levelColorsDark = { high: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30', mid: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30', low: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-ws-bg-elevated' }
            return (
              <div key={d}>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-ws-text-primary">
                    <span className="text-xl">{dimLabels[d].emoji}</span>
                    {dimLabels[d].name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${levelColorsDark[level]}`}>
                    {levelLabels[level]}
                  </span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-ws-bg-elevated rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${barColors[level]} transition-all duration-1000`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Core Findings */}
      <div className="bg-white dark:bg-ws-bg-card rounded-3xl border border-slate-100 dark:border-ws-border p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-ws-text-primary flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" /> 核心发现
        </h3>
        <p className="text-slate-900 dark:text-ws-text-primary font-semibold">{report.headline}</p>
        <p className="text-slate-600 dark:text-ws-text-secondary text-sm leading-relaxed">{report.strengthSummary}</p>
      </div>

      {/* Course Recommendations */}
      <div className="bg-white dark:bg-ws-bg-card rounded-3xl border border-slate-100 dark:border-ws-border p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-ws-text-primary flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#3B5FD9] dark:text-[#6B8CF0]" /> 推荐课程
        </h3>
        <div className="space-y-3">
          {Object.entries(profile729.recommendedCourses).slice(0, 2).map(([key, rec]) => (
            <div key={key} className="p-4 bg-[#EEF2FF] dark:bg-[#3B5FD9]/20 rounded-2xl border border-[#6B8CF0]/30 dark:border-[#3B5FD9]/30">
              <p className="text-sm text-[#3B5FD9] dark:text-[#6B8CF0] font-medium">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Career Paths */}
      <div className="bg-white dark:bg-ws-bg-card rounded-3xl border border-slate-100 dark:border-ws-border p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-ws-text-primary flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-violet-500 dark:text-violet-400" /> 未来方向
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {profile729.careerPaths.slice(0, 4).map((c, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-100 dark:border-violet-800/50">
              <TrendingUp className="w-4 h-4 text-violet-500 dark:text-violet-400" />
              <span className="text-sm text-violet-700 dark:text-violet-300 font-medium">{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button onClick={onRestart} className="flex-1 py-4 bg-white dark:bg-ws-bg-card text-slate-700 dark:text-ws-text-primary font-bold rounded-2xl border-2 border-slate-200 dark:border-ws-border hover:border-[#6B8CF0] dark:hover:border-[#3B5FD9] transition-colors">
          <RotateCcw className="w-4 h-4 mx-auto mb-1" />
          <span className="text-sm">重新测评</span>
        </button>
        <button onClick={() => window.print()} className="flex-1 py-4 bg-slate-800 dark:bg-slate-700 text-white font-bold rounded-2xl hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
          <Printer className="w-4 h-4 mx-auto mb-1" />
          <span className="text-sm">导出报告</span>
        </button>
      </div>
    </div>
  )
}
