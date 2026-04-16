// ===================================================================
// 智能自适应AI选题引擎 v1.0
// 三阶段选题策略: 探索(1-10) → 聚焦(11-25) → 验证(26-32)
// 核心特性:
//   - WILDER选题权重25%（与融合权重对齐）
//   - 答案模式实时分析
//   - 基于信息增益的动态选题
//   - 测试-重测一致性（确定性种子）
// ===================================================================

import type { UnifiedQuestion } from './questions/types'
import { ALL_TRACKED_DIMS, WILDER_DIMS, NEW_MODEL_DIMS } from './questions/types'
import { getQuestions, initializeQuestionBank, computeMaxScoresFromQuestions } from './questions/index'
import { generateSessionSeed, seededRandom } from './sessionFingerprint'

// ========== 类型定义 ==========

export type EnginePhase = 'explore' | 'focus' | 'verify'

export interface AIEngineConfig {
  maxQuestions: number
  /** 探索阶段题目数 */
  exploreCount: number
  /** 聚焦阶段题目数 */
  focusCount: number
  /** 最低置信度目标 */
  minConfidenceTarget: number
  /** 随机种子 */
  seed: number
}

export interface DimensionEstimate {
  mean: number
  variance: number
  sampleCount: number
}

export interface AIEngineState {
  // 基础状态
  answeredIds: Set<string>
  selectionHistory: string[]
  totalAnswered: number
  maxQuestions: number
  seed: number

  // 维度估计
  dimensionEstimate: Record<string, DimensionEstimate>

  // 答案模式追踪
  answerPatterns: Record<string, number[]>

  // 阶段信息
  phase: EnginePhase

  // 一致性标记
  consistencyFlags: Record<string, boolean>

  // 已加载的候选题池
  questionPool: UnifiedQuestion[]

  // 实际使用的题目（用于计算最大分数）
  usedQuestions: UnifiedQuestion[]
}

export interface CoverageReport {
  wilderCoverage: Record<string, { confidence: number; sampleCount: number }>
  newModelCoverage: Record<string, { confidence: number; sampleCount: number }>
  overallConfidence: number
  phase: EnginePhase
  anomalies: string[]
}

// ========== 常量 ==========

const DEFAULT_CONFIG: AIEngineConfig = {
  maxQuestions: 32,
  exploreCount: 10,
  focusCount: 15,
  minConfidenceTarget: 0.6,
  seed: 0, // 0 表示需要调用者提供确定性种子，确保结果可复现
}

/** 选题阶段的模型权重（与crossValidation融合权重对齐） */
const SELECTION_MODEL_WEIGHTS: Record<string, number> = {
  WILDER: 0.25,
  'WILDER-L2': 0.10,
  MI: 0.10,
  BigFive: 0.09,
  CHC: 0.10,
  Grit: 0.09,
  SEL: 0.09,
  EF: 0.09,
  Cognitive: 0.06,
  RIASEC: 0.03,
}

// ========== 工具函数 ==========

function getModelWeight(model: string): number {
  return SELECTION_MODEL_WEIGHTS[model] ?? 0.05
}

function getDimWeight(dim: string): number {
  if ((WILDER_DIMS as readonly string[]).includes(dim)) return 1.0
  if ((NEW_MODEL_DIMS as readonly string[]).includes(dim)) return 0.8
  return 0.5
}

/** 获取题目覆盖的所有得分维度 */
function getQuestionDimensions(q: UnifiedQuestion): string[] {
  const dims = new Set<string>()
  if (q.type === 'choice' && q.options) {
    for (const opt of q.options) {
      Object.keys(opt.scores).forEach(k => dims.add(k))
    }
  } else if (q.type === 'judgment' && q.scores) {
    Object.keys(q.scores.yes).forEach(k => dims.add(k))
    Object.keys(q.scores.no).forEach(k => dims.add(k))
  }
  return [...dims]
}

/** 判断维度是否在跟踪列表中 */
function isTrackedDim(dim: string): boolean {
  return (ALL_TRACKED_DIMS as readonly string[]).includes(dim)
}

// ========== 核心引擎 ==========

/** 创建AI引擎实例 */
export async function createAIEngine(
  age: number,
  config?: Partial<AIEngineConfig>,
  studentName?: string,
  phoneLastFour?: string
): Promise<AIEngineState> {
  const cfg = { ...DEFAULT_CONFIG, ...config }

  // 如果有用户标识，生成确定性种子
  if (studentName) {
    cfg.seed = generateSessionSeed(studentName, age, phoneLastFour)
  }

  // 初始化题库（如果未初始化）
  initializeQuestionBank()

  // 加载适龄题目
  const pool = await getQuestions({ age })

  // 学龄前适配：降低最大题数和阶段阈值（注意力有限）
  if (age <= 5) {
    cfg.maxQuestions = Math.min(cfg.maxQuestions, 22)
    cfg.exploreCount = Math.min(cfg.exploreCount, 7)
    cfg.focusCount = Math.min(cfg.focusCount, 10)
  }

  // 初始化维度估计
  const dimensionEstimate: Record<string, DimensionEstimate> = {}
  const answerPatterns: Record<string, number[]> = {}
  const consistencyFlags: Record<string, boolean> = {}

  for (const d of ALL_TRACKED_DIMS) {
    dimensionEstimate[d] = { mean: 0, variance: 1.0, sampleCount: 0 }
    answerPatterns[d] = []
    consistencyFlags[d] = true
  }

  return {
    answeredIds: new Set(),
    selectionHistory: [],
    totalAnswered: 0,
    maxQuestions: cfg.maxQuestions,
    seed: cfg.seed,
    dimensionEstimate,
    answerPatterns,
    phase: 'explore',
    consistencyFlags,
    questionPool: pool,
    usedQuestions: [],
  }
}

/** 选择下一道题目 */
export function selectNextQuestion(state: AIEngineState): UnifiedQuestion | null {
  // 已达上限
  if (state.totalAnswered >= state.maxQuestions) return null

  // 更新阶段
  const cfg = DEFAULT_CONFIG
  if (state.totalAnswered < cfg.exploreCount) {
    state.phase = 'explore'
  } else if (state.totalAnswered < cfg.exploreCount + cfg.focusCount) {
    state.phase = 'focus'
  } else {
    state.phase = 'verify'
  }

  // 未回答的候选题
  const candidates = state.questionPool.filter(q => !state.answeredIds.has(q.id))
  if (candidates.length === 0) return null

  const random = seededRandom(state.seed + state.totalAnswered)

  let bestCandidate: UnifiedQuestion | null = null
  let bestScore = -Infinity

  for (const candidate of candidates) {
    let score: number

    switch (state.phase) {
      case 'explore':
        score = scoreExplorePhase(candidate, state, random)
        break
      case 'focus':
        score = scoreFocusPhase(candidate, state, random)
        break
      case 'verify':
        score = scoreVerifyPhase(candidate, state, random)
        break
    }

    if (score > bestScore) {
      bestScore = score
      bestCandidate = candidate
    }
  }

  return bestCandidate
}

// ========== 三阶段评分函数 ==========

/** Phase 1 - 探索阶段评分 */
function scoreExplorePhase(
  q: UnifiedQuestion,
  state: AIEngineState,
  random: () => number
): number {
  const dims = getQuestionDimensions(q)
  const trackedDims = dims.filter(isTrackedDim)

  // 1. 维度覆盖奖励：优先选覆盖尚无数据维度的题
  let coverageBonus = 0
  for (const d of trackedDims) {
    if (state.dimensionEstimate[d]?.sampleCount === 0) {
      coverageBonus += 10 // 无数据维度大奖励
    } else if (state.dimensionEstimate[d]?.sampleCount < 2) {
      coverageBonus += 3  // 数据稀少维度小奖励
    }
  }

  // 2. 模型多样性奖励：避免连续选同一模型
  let diversityBonus = 0
  if (state.selectionHistory.length > 0) {
    const lastQuestion = state.questionPool.find(
      p => p.id === state.selectionHistory[state.selectionHistory.length - 1]
    )
    if (lastQuestion && lastQuestion.model !== q.model) {
      diversityBonus = 2
    }
  }

  // 3. 模型选题权重（WILDER=25% 核心权重）
  const modelWeight = getModelWeight(q.model)

  // 4. 确定性扰动（使用传入的 random 函数，确保可复现）
  const noise = random() * 0.3

  return (coverageBonus + diversityBonus) * modelWeight + noise
}

/** Phase 2 - 聚焦阶段评分 */
function scoreFocusPhase(
  q: UnifiedQuestion,
  state: AIEngineState,
  random: () => number
): number {
  const dims = getQuestionDimensions(q)
  const trackedDims = dims.filter(isTrackedDim)

  // 1. 信息增益：方差大的维度需要更多数据
  let infoGain = 0
  for (const d of trackedDims) {
    const est = state.dimensionEstimate[d]
    if (est) {
      infoGain += est.variance * getDimWeight(d)
    }
  }

  // 2. 答案模式奖励：检测到矛盾信号的维度优先
  let patternBonus = 0
  for (const d of trackedDims) {
    if (!state.consistencyFlags[d]) {
      patternBonus += 5 // 不一致维度大奖励
    }
  }

  // 3. 难度匹配：题目难度与当前能力估计匹配时信息量最大
  let difficultyFit = 0
  if (trackedDims.length > 0) {
    const avgMean = trackedDims.reduce((s, d) =>
      s + (state.dimensionEstimate[d]?.mean || 0), 0) / trackedDims.length
    // 能力越高适合越难的题
    const idealDifficulty = Math.min(5, Math.max(1, Math.round(1 + avgMean * 4)))
    const diff = Math.abs(q.difficulty - idealDifficulty)
    difficultyFit = Math.max(0, 3 - diff) // 差距越小分越高
  }

  // 4. 模型权重
  const modelWeight = getModelWeight(q.model)

  // 5. 确定性扰动（使用传入的 random 函数）
  const noise = random() * 0.2

  return (infoGain + patternBonus + difficultyFit) * modelWeight + noise
}

/** Phase 3 - 验证阶段评分 */
function scoreVerifyPhase(
  q: UnifiedQuestion,
  state: AIEngineState,
  random: () => number
): number {
  const dims = getQuestionDimensions(q)
  const trackedDims = dims.filter(isTrackedDim)

  // 1. 交叉验证价值：选择能验证已有结论的题
  let crossVerifyValue = 0
  for (const d of trackedDims) {
    const est = state.dimensionEstimate[d]
    if (est && est.sampleCount >= 2) {
      // 已有充足数据的维度，验证价值较高
      crossVerifyValue += (1 - est.variance) * getDimWeight(d)
    }
  }

  // 2. 不一致解决：优先解决标记的不一致
  let inconsistencyResolution = 0
  for (const d of trackedDims) {
    if (!state.consistencyFlags[d]) {
      inconsistencyResolution += 8
    }
  }

  // 3. 最低置信度补救
  let minConfidenceUrgency = 0
  for (const d of trackedDims) {
    const est = state.dimensionEstimate[d]
    if (est && est.sampleCount < 2) {
      minConfidenceUrgency += 5 // 数据太少的维度紧急补充
    }
  }

  // 4. 模型权重
  const modelWeight = getModelWeight(q.model)

  // 5. 确定性扰动（使用传入的 random 函数）
  const noise = random() * 0.1

  return (crossVerifyValue + inconsistencyResolution + minConfidenceUrgency) * modelWeight + noise
}

// ========== 答案记录与模式分析 ==========

/** 记录答案并更新引擎状态 */
export function recordAnswer(
  state: AIEngineState,
  questionId: string,
  answer: string | boolean
): AIEngineState {
  const question = state.questionPool.find(q => q.id === questionId)
  if (!question) return state

  // 获取本次答案的得分
  const answerScores = getAnswerScores(question, answer)

  // 获取相关维度
  const dims = getQuestionDimensions(question)
  const trackedDims = dims.filter(isTrackedDim)

  // 更新维度估计
  const newEstimate = { ...state.dimensionEstimate }
  const newPatterns = { ...state.answerPatterns }

  for (const d of trackedDims) {
    const scoreValue = answerScores[d] || 0
    const maxPossible = getMaxScoreForDim(question, d)
    const normalizedScore = maxPossible > 0 ? scoreValue / maxPossible : 0

    // 更新模式追踪
    if (!newPatterns[d]) newPatterns[d] = []
    newPatterns[d] = [...newPatterns[d], normalizedScore]

    // 增量更新均值和方差（Welford算法）
    const prev = newEstimate[d] || { mean: 0, variance: 1.0, sampleCount: 0 }
    const n = prev.sampleCount + 1
    const delta = normalizedScore - prev.mean
    const newMean = prev.mean + delta / n
    const delta2 = normalizedScore - newMean
    const newM2 = (prev.variance * prev.sampleCount) + delta * delta2
    const newVariance = n > 1 ? newM2 / n : 1.0

    newEstimate[d] = {
      mean: newMean,
      variance: Math.max(0.01, newVariance), // 最小方差防止为0
      sampleCount: n,
    }
  }

  // 分析答案模式 → 更新一致性标记
  const newConsistencyFlags = analyzePatterns(newPatterns, state.consistencyFlags)

  // 更新状态
  const newAnsweredIds = new Set(state.answeredIds)
  newAnsweredIds.add(questionId)

  return {
    ...state,
    answeredIds: newAnsweredIds,
    selectionHistory: [...state.selectionHistory, questionId],
    totalAnswered: state.totalAnswered + 1,
    dimensionEstimate: newEstimate,
    answerPatterns: newPatterns,
    consistencyFlags: newConsistencyFlags,
    usedQuestions: [...state.usedQuestions, question],
  }
}

/** 从答案中提取分数 */
function getAnswerScores(q: UnifiedQuestion, answer: string | boolean): Record<string, number> {
  if (q.type === 'choice' && q.options) {
    const option = q.options.find(o => o.id === answer)
    return option?.scores || {}
  } else if (q.type === 'judgment' && q.scores) {
    return answer === true || answer === 'true'
      ? q.scores.yes
      : q.scores.no
  }
  return {}
}

/** 获取某维度在某题上的最大可能分 */
function getMaxScoreForDim(q: UnifiedQuestion, dim: string): number {
  if (q.type === 'choice' && q.options) {
    return Math.max(0, ...q.options.map(o => (o.scores[dim] as number) || 0))
  } else if (q.type === 'judgment' && q.scores) {
    return Math.max(
      (q.scores.yes[dim] as number) || 0,
      (q.scores.no[dim] as number) || 0
    )
  }
  return 0
}

// ========== 答案模式分析 ==========

/** 分析答案模式，检测异常 */
function analyzePatterns(
  patterns: Record<string, number[]>,
  prevFlags: Record<string, boolean>
): Record<string, boolean> {
  const flags = { ...prevFlags }

  for (const dim of ALL_TRACKED_DIMS) {
    const scores = patterns[dim]
    if (!scores || scores.length < 5) continue

    // 1. 响应一致性检测：检查最近5道题的方向一致性
    const recent = scores.slice(-5)
    const isHighDir = recent.filter(s => s >= 0.5).length
    const isLowDir = recent.filter(s => s < 0.5).length

    // 5题中至少3:2分裂才标记不一致
    if (isHighDir >= 2 && isLowDir >= 2) {
      flags[dim] = false
    } else if (scores.length >= 6) {
      // 6题以上且最近5题方向一致 → 恢复一致标记
      flags[dim] = true
    }
  }

  // 2. 社会期望偏差检测：如果所有答案都选最高分
  const allScores = Object.values(patterns).flat()
  if (allScores.length >= 15) {
    const highCount = allScores.filter(s => s >= 0.9).length
    if (highCount / allScores.length > 0.9) {
      // 90%以上选最高分 → 所有维度降低一致性
      for (const d of ALL_TRACKED_DIMS) {
        flags[d] = false
      }
    }
  }

  return flags
}

// ========== 引擎状态查询 ==========

/** 判断引擎是否已完成 */
export function isEngineComplete(state: AIEngineState): boolean {
  if (state.totalAnswered >= state.maxQuestions) return true

  // 检查所有跟踪维度是否都有足够的数据
  for (const d of ALL_TRACKED_DIMS) {
    const est = state.dimensionEstimate[d]
    if (!est || est.sampleCount < 1) return false
  }
  // 如果所有维度都有数据且方差足够小
  const avgVariance = ALL_TRACKED_DIMS.reduce((s, d) =>
    s + (state.dimensionEstimate[d]?.variance || 1), 0) / ALL_TRACKED_DIMS.length
  return state.totalAnswered >= DEFAULT_CONFIG.exploreCount && avgVariance < 0.2
}

/** 获取覆盖报告 */
export function getEngineCoverage(state: AIEngineState): CoverageReport {
  const wilderCoverage: Record<string, { confidence: number; sampleCount: number }> = {}
  const newModelCoverage: Record<string, { confidence: number; sampleCount: number }> = {}
  const anomalies: string[] = []

  for (const d of WILDER_DIMS) {
    const est = state.dimensionEstimate[d]
    const confidence = est ? Math.min(1, est.sampleCount / 5) * (1 - est.variance) : 0
    wilderCoverage[d] = { confidence: Math.max(0, confidence), sampleCount: est?.sampleCount || 0 }
  }

  for (const d of NEW_MODEL_DIMS) {
    const est = state.dimensionEstimate[d]
    const confidence = est ? Math.min(1, est.sampleCount / 3) * (1 - est.variance) : 0
    newModelCoverage[d] = { confidence: Math.max(0, confidence), sampleCount: est?.sampleCount || 0 }
  }

  // 检测异常
  for (const [dim, flag] of Object.entries(state.consistencyFlags)) {
    if (!flag) anomalies.push(`维度 ${dim} 存在响应不一致`)
  }

  const allConfidences = [
    ...Object.values(wilderCoverage).map(v => v.confidence),
    ...Object.values(newModelCoverage).map(v => v.confidence),
  ]
  const overallConfidence = allConfidences.length > 0
    ? allConfidences.reduce((s, v) => s + v, 0) / allConfidences.length
    : 0

  return { wilderCoverage, newModelCoverage, overallConfidence, phase: state.phase, anomalies }
}

/** 从历史记录重放引擎状态（用于草稿恢复） */
export async function replayFromHistory(
  age: number,
  history: string[],
  answers: { choiceAnswers: Record<string, string>; judgmentAnswers: Record<string, boolean> },
  config?: Partial<AIEngineConfig>,
  studentName?: string,
  phoneLastFour?: string
): Promise<AIEngineState> {
  let state = await createAIEngine(age, config, studentName, phoneLastFour)

  for (const qid of history) {
    const answer = answers.choiceAnswers[qid] ?? answers.judgmentAnswers[qid]
    if (answer !== undefined) {
      state = recordAnswer(state, qid, answer)
    }
  }

  return state
}

/** 获取引擎实际使用的题目，用于计算最大分数 */
export function getUsedQuestionMaxScores(state: AIEngineState): Record<string, number> {
  return computeMaxScoresFromQuestions(state.usedQuestions)
}

// ========== 序列化/反序列化（用于草稿存储） ==========

export interface SerializedAIEngineState {
  answeredIds: string[]
  selectionHistory: string[]
  totalAnswered: number
  maxQuestions: number
  seed: number
  dimensionEstimate: Record<string, DimensionEstimate>
  answerPatterns: Record<string, number[]>
  phase: EnginePhase
  consistencyFlags: Record<string, boolean>
}

export function serializeState(state: AIEngineState): SerializedAIEngineState {
  return {
    answeredIds: [...state.answeredIds],
    selectionHistory: state.selectionHistory,
    totalAnswered: state.totalAnswered,
    maxQuestions: state.maxQuestions,
    seed: state.seed,
    dimensionEstimate: state.dimensionEstimate,
    answerPatterns: state.answerPatterns,
    phase: state.phase,
    consistencyFlags: state.consistencyFlags,
  }
}

export async function deserializeState(
  serialized: SerializedAIEngineState,
  age: number
): Promise<AIEngineState> {
  initializeQuestionBank()
  const pool = await getQuestions({ age })

  // 重建 usedQuestions
  const usedQuestions: UnifiedQuestion[] = []
  for (const id of serialized.selectionHistory) {
    const q = pool.find(p => p.id === id)
    if (q) usedQuestions.push(q)
  }

  return {
    answeredIds: new Set(serialized.answeredIds),
    selectionHistory: serialized.selectionHistory,
    totalAnswered: serialized.totalAnswered,
    maxQuestions: serialized.maxQuestions,
    seed: serialized.seed,
    dimensionEstimate: serialized.dimensionEstimate,
    answerPatterns: serialized.answerPatterns,
    phase: serialized.phase,
    consistencyFlags: serialized.consistencyFlags,
    questionPool: pool,
    usedQuestions,
  }
}
