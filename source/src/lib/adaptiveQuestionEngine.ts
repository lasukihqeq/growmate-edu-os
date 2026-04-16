// ===================================================================
// 自适应出题引擎 v1.1
// 基于置信度的IRT简化自适应题目选择
// 核心算法: urgency[d] = (1 - confidence[d]) * weight[d]
// 选择最能降低总紧迫度的下一道题
// v1.1: 新增学龄前(4-5岁)题目支持
// ===================================================================

import {
  getChoiceQuestionsByAge, getJudgmentQuestionsByAge,
  type AdaptiveChoiceQuestion, type AdaptiveJudgmentQuestion,
} from './ageAdaptiveQuestions'
import {
  getNewModelChoiceQuestionsByAge, getNewModelJudgmentQuestionsByAge,
} from './newModelQuestions'
import {
  choiceQuestions, judgmentQuestions,
  type ChoiceQuestion, type JudgmentQuestion,
} from './assessmentEngine'
import {
  getPreschoolChoiceQuestions, getPreschoolJudgmentQuestions, isPreschoolAge,
} from './preschoolQuestions'

// ========== 类型定义 ==========

export type QuestionCandidate = {
  type: 'choice'
  question: ChoiceQuestion | AdaptiveChoiceQuestion
} | {
  type: 'judgment'
  question: JudgmentQuestion | AdaptiveJudgmentQuestion
}

export interface AdaptiveEngineState {
  /** 已回答的题目ID列表 */
  answeredIds: Set<string>
  /** 各维度的置信度 (0-1) */
  dimensionConfidence: Record<string, number>
  /** 按顺序记录的已选题目ID（用于草稿恢复重放） */
  selectionHistory: string[]
  /** 已回答总数 */
  totalAnswered: number
  /** 最大题目数 */
  maxQuestions: number
  /** 完整候选题池 */
  pool: QuestionCandidate[]
  /** 随机种子 */
  seed: number
}

export interface AdaptiveEngineConfig {
  maxQuestions: number
  /** WILDER六维权重 */
  wilderWeight: number
  /** 新模型维度权重 */
  newModelWeight: number
  /** 最低目标置信度 */
  minConfidenceTarget: number
  /** 随机种子 */
  seed: number
}

/** 后端API钩子接口（预留，暂不实现） */
export interface AdaptiveAPIHook {
  selectNext?: (state: AdaptiveEngineState) => Promise<string | null>
  enabled: boolean
  fallbackToLocal: boolean
}

// ========== 常量 ==========

const WILDER_DIMS = ['W', 'I', 'L', 'D', 'E', 'R'] as const
const NEW_MODEL_DIMS = [
  'Gf', 'Gc',
  'grit_passion', 'grit_perseverance',
  'sel_selfAwareness', 'sel_selfManagement', 'sel_socialAwareness',
  'sel_relationshipSkills', 'sel_responsibleDecision',
] as const
const ALL_TRACKED_DIMS = [...WILDER_DIMS, ...NEW_MODEL_DIMS] as const

const DEFAULT_CONFIG: AdaptiveEngineConfig = {
  maxQuestions: 32,
  wilderWeight: 1.0,
  newModelWeight: 0.8,
  minConfidenceTarget: 0.6,
  seed: Date.now(),
}

// ========== 工具函数 ==========

/** 带种子的伪随机数生成器 */
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/** 获取题目覆盖的所有得分键 */
function getQuestionDimensions(candidate: QuestionCandidate): string[] {
  const dims = new Set<string>()
  if (candidate.type === 'choice') {
    for (const opt of candidate.question.options) {
      Object.keys(opt.scores).forEach(k => dims.add(k))
    }
  } else {
    Object.keys(candidate.question.scores.yes).forEach(k => dims.add(k))
    Object.keys(candidate.question.scores.no).forEach(k => dims.add(k))
  }
  return [...dims]
}

/** 获取维度权重 */
function getDimWeight(dim: string, config: AdaptiveEngineConfig): number {
  if ((WILDER_DIMS as readonly string[]).includes(dim)) return config.wilderWeight
  if ((NEW_MODEL_DIMS as readonly string[]).includes(dim)) return config.newModelWeight
  return 0.5 // Layer2 及其他键的默认权重
}

// ========== 核心引擎 ==========

/** 创建自适应引擎实例 */
export function createAdaptiveEngine(
  age: number,
  config?: Partial<AdaptiveEngineConfig>
): AdaptiveEngineState {
  const cfg = { ...DEFAULT_CONFIG, ...config }

  // 构建完整候选题池
  let pool: QuestionCandidate[] = []
  
  // 学龄前儿童(4-5岁)：使用专门的幼儿化题目
  if (isPreschoolAge(age)) {
    const preschoolChoices = getPreschoolChoiceQuestions(age)
    const preschoolJudgments = getPreschoolJudgmentQuestions(age)
    
    pool = [
      ...preschoolChoices.map(q => ({ type: 'choice' as const, question: q as unknown as AdaptiveChoiceQuestion })),
      ...preschoolJudgments.map(q => ({ type: 'judgment' as const, question: q as unknown as AdaptiveJudgmentQuestion })),
    ]
    
    // 学龄前题目数量适当减少
    cfg.maxQuestions = Math.min(cfg.maxQuestions, 20)
  } else {
    // 6岁以上：使用标准年龄适配题目
    const ageChoices = getChoiceQuestionsByAge(age)
    const ageJudgments = getJudgmentQuestionsByAge(age)
    const newChoices = getNewModelChoiceQuestionsByAge(age)
    const newJudgments = getNewModelJudgmentQuestionsByAge(age)
    const layer2Choices = choiceQuestions.filter(q => q.model === 'WILDER-L2')
    const layer2Judgments = judgmentQuestions.filter(q => q.model === 'WILDER-L2')

    pool = [
      ...ageChoices.map(q => ({ type: 'choice' as const, question: q })),
      ...newChoices.map(q => ({ type: 'choice' as const, question: q })),
      ...layer2Choices.map(q => ({ type: 'choice' as const, question: q })),
      ...ageJudgments.map(q => ({ type: 'judgment' as const, question: q })),
      ...newJudgments.map(q => ({ type: 'judgment' as const, question: q })),
      ...layer2Judgments.map(q => ({ type: 'judgment' as const, question: q })),
    ]
  }

  // 初始化所有跟踪维度的置信度为0
  const dimensionConfidence: Record<string, number> = {}
  for (const d of ALL_TRACKED_DIMS) {
    dimensionConfidence[d] = 0
  }

  return {
    answeredIds: new Set(),
    dimensionConfidence,
    selectionHistory: [],
    totalAnswered: 0,
    maxQuestions: cfg.maxQuestions,
    pool,
    seed: cfg.seed,
  }
}

/** 选择下一道题目 */
export function selectNextQuestion(
  state: AdaptiveEngineState,
  config?: Partial<AdaptiveEngineConfig>
): QuestionCandidate | null {
  const cfg = { ...DEFAULT_CONFIG, ...config }

  // 已达上限
  if (state.totalAnswered >= state.maxQuestions) return null

  // 未回答的候选题
  const candidates = state.pool.filter(c => !state.answeredIds.has(c.question.id))
  if (candidates.length === 0) return null

  // 计算每道候选题的"紧迫度减少"得分
  const random = seededRandom(state.seed + state.totalAnswered)
  let bestCandidate: QuestionCandidate | null = null
  let bestScore = -Infinity

  for (const candidate of candidates) {
    const dims = getQuestionDimensions(candidate)
    // 题目只覆盖已跟踪维度中的部分
    const trackedDims = dims.filter(d => d in state.dimensionConfidence)

    // 计算该题对总紧迫度的降低值
    let urgencyReduction = 0
    for (const d of trackedDims) {
      const currentUrgency = (1 - state.dimensionConfidence[d]) * getDimWeight(d, cfg)
      // 预估回答此题后该维度置信度的增加量
      const expectedIncrease = 1 / Math.max(1, state.maxQuestions / ALL_TRACKED_DIMS.length)
      const newConfidence = Math.min(1, state.dimensionConfidence[d] + expectedIncrease)
      const newUrgency = (1 - newConfidence) * getDimWeight(d, cfg)
      urgencyReduction += (currentUrgency - newUrgency)
    }

    // 添加少量随机扰动避免完全确定性选择
    const noise = random() * 0.1
    const score = urgencyReduction + noise

    if (score > bestScore) {
      bestScore = score
      bestCandidate = candidate
    }
  }

  return bestCandidate
}

/** 记录答案并更新置信度 */
export function recordAnswer(
  state: AdaptiveEngineState,
  questionId: string,
  _answer: string | boolean,
  config?: Partial<AdaptiveEngineConfig>
): AdaptiveEngineState {
  // 找到对应的候选题
  const candidate = state.pool.find(c => c.question.id === questionId)
  if (!candidate) return state

  const dims = getQuestionDimensions(candidate)
  const trackedDims = dims.filter(d => d in state.dimensionConfidence)

  // 更新置信度
  const expectedQPerDim = Math.max(1, (config?.maxQuestions ?? state.maxQuestions) / ALL_TRACKED_DIMS.length)
  const increment = 1 / expectedQPerDim

  const newConfidence = { ...state.dimensionConfidence }
  for (const d of trackedDims) {
    newConfidence[d] = Math.min(1, newConfidence[d] + increment)
  }

  const newAnsweredIds = new Set(state.answeredIds)
  newAnsweredIds.add(questionId)

  return {
    ...state,
    answeredIds: newAnsweredIds,
    dimensionConfidence: newConfidence,
    selectionHistory: [...state.selectionHistory, questionId],
    totalAnswered: state.totalAnswered + 1,
  }
}

/** 从历史记录重放引擎状态（用于草稿恢复） */
export function replayFromHistory(
  age: number,
  history: string[],
  answers: { choiceAnswers: Record<string, string>; judgmentAnswers: Record<string, boolean> },
  config?: Partial<AdaptiveEngineConfig>
): AdaptiveEngineState {
  let state = createAdaptiveEngine(age, config)

  for (const qid of history) {
    const answer = answers.choiceAnswers[qid] ?? answers.judgmentAnswers[qid]
    if (answer !== undefined) {
      state = recordAnswer(state, qid, answer, config)
    }
  }

  return state
}

/** 获取引擎当前的维度覆盖统计 */
export function getEngineCoverage(state: AdaptiveEngineState): {
  wilderCoverage: Record<string, number>
  newModelCoverage: Record<string, number>
  overallConfidence: number
} {
  const wilderCoverage: Record<string, number> = {}
  const newModelCoverage: Record<string, number> = {}

  for (const d of WILDER_DIMS) {
    wilderCoverage[d] = state.dimensionConfidence[d] || 0
  }
  for (const d of NEW_MODEL_DIMS) {
    newModelCoverage[d] = state.dimensionConfidence[d] || 0
  }

  const allVals = Object.values(state.dimensionConfidence)
  const overallConfidence = allVals.length > 0
    ? allVals.reduce((s, v) => s + v, 0) / allVals.length
    : 0

  return { wilderCoverage, newModelCoverage, overallConfidence }
}

/** 判断引擎是否已完成（达到上限或所有维度足够） */
export function isEngineComplete(
  state: AdaptiveEngineState,
  config?: Partial<AdaptiveEngineConfig>
): boolean {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  if (state.totalAnswered >= state.maxQuestions) return true

  // 检查所有跟踪维度是否都达到最低置信度
  for (const d of ALL_TRACKED_DIMS) {
    if ((state.dimensionConfidence[d] || 0) < cfg.minConfidenceTarget) {
      return false
    }
  }
  return true
}
