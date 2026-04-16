// ===================================================================
// 随机抽题引擎 v1.1
// 实现AI测评问题随机性与结果关联性的平衡
// 核心原理：按维度分类题库 + 均衡抽样 + 得分按维度归类
// v1.1: 新增学龄前(4-5岁)题目支持
// ===================================================================

import { 
  choiceQuestions, judgmentQuestions,
  type ChoiceQuestion, type JudgmentQuestion 
} from './assessmentEngine'

import { 
  getChoiceQuestionsByAge, getJudgmentQuestionsByAge,
  type AdaptiveChoiceQuestion, type AdaptiveJudgmentQuestion 
} from './ageAdaptiveQuestions'

import {
  getNewModelChoiceQuestionsByAge, getNewModelJudgmentQuestionsByAge,
} from './newModelQuestions'

import {
  getPreschoolChoiceQuestions, getPreschoolJudgmentQuestions, isPreschoolAge,
} from './preschoolQuestions'

// ========== 维度类型定义 ==========
export type WilderDimension = 'W' | 'I' | 'L' | 'D' | 'E' | 'R'

const ALL_DIMENSIONS: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']

// ========== 题库池数据结构 ==========
export interface QuestionPool {
  dimension: WilderDimension
  choiceQuestions: (ChoiceQuestion | AdaptiveChoiceQuestion)[]
  judgmentQuestions: (JudgmentQuestion | AdaptiveJudgmentQuestion)[]
}

// ========== 抽题配置 ==========
export interface RandomSelectionConfig {
  /** 每个维度至少抽取的选择题数量 */
  minChoicePerDimension: number
  /** 每个维度至少抽取的判断题数量 */
  minJudgmentPerDimension: number
  /** 总选择题数量上限 */
  maxTotalChoice: number
  /** 总判断题数量上限 */
  maxTotalJudgment: number
  /** 是否包含 Layer2 深度题目 */
  includeLayer2: boolean
  /** 打乱顺序的随机种子（可选，用于可复现的随机） */
  seed?: number
}

// 默认配置
export const DEFAULT_RANDOM_CONFIG: RandomSelectionConfig = {
  minChoicePerDimension: 2,
  minJudgmentPerDimension: 1,
  maxTotalChoice: 24,
  maxTotalJudgment: 14,
  includeLayer2: true,
}

// ========== 工具函数 ==========

/** Fisher-Yates 洗牌算法 */
function shuffleArray<T>(array: T[], seed?: number): T[] {
  const result = [...array]
  const random = seed !== undefined ? seededRandom(seed) : Math.random
  
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** 带种子的伪随机数生成器 */
function seededRandom(seed: number): () => number {
  let currentSeed = seed
  return () => {
    currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff
    return currentSeed / 0x7fffffff
  }
}

/** 获取题目的主维度（wilderMapping 第一个维度） */
function getPrimaryDimension(wilderMapping: string[]): WilderDimension | null {
  const primary = wilderMapping[0]
  if (ALL_DIMENSIONS.includes(primary as WilderDimension)) {
    return primary as WilderDimension
  }
  return null
}

/** 判断题目是否覆盖某维度 */
function questionCoversDimension(wilderMapping: string[], dim: WilderDimension): boolean {
  return wilderMapping.includes(dim)
}

// ========== 构建维度题库池 ==========

/** 按维度分类题目 */
export function buildDimensionPools(
  choices: (ChoiceQuestion | AdaptiveChoiceQuestion)[],
  judgments: (JudgmentQuestion | AdaptiveJudgmentQuestion)[]
): Map<WilderDimension, QuestionPool> {
  const pools = new Map<WilderDimension, QuestionPool>()
  
  // 初始化空池
  for (const dim of ALL_DIMENSIONS) {
    pools.set(dim, {
      dimension: dim,
      choiceQuestions: [],
      judgmentQuestions: [],
    })
  }
  
  // 按主维度分类选择题
  for (const q of choices) {
    const primary = getPrimaryDimension(q.wilderMapping)
    if (primary && pools.has(primary)) {
      pools.get(primary)!.choiceQuestions.push(q)
    }
  }
  
  // 按主维度分类判断题
  for (const q of judgments) {
    const primary = getPrimaryDimension(q.wilderMapping)
    if (primary && pools.has(primary)) {
      pools.get(primary)!.judgmentQuestions.push(q)
    }
  }
  
  return pools
}

// ========== 随机抽题算法 ==========

export interface RandomizedQuestionSet {
  choices: (ChoiceQuestion | AdaptiveChoiceQuestion)[]
  judgments: (JudgmentQuestion | AdaptiveJudgmentQuestion)[]
  dimensionCoverage: Record<WilderDimension, { choice: number; judgment: number }>
  totalQuestions: number
  selectionSeed: number
}

/** 从题目池生成确定性哈希作为默认种子 */
function generatePoolHash(pools: Map<WilderDimension, QuestionPool>): number {
  let hash = 0
  pools.forEach((pool, dim) => {
    // 基于题目ID和维度计算哈希
    const poolKey = `${dim}:${pool.choiceQuestions.map(q => q.id).sort().join(',')}:${pool.judgmentQuestions.map(q => q.id).sort().join(',')}`
    for (let i = 0; i < poolKey.length; i++) {
      const char = poolKey.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
  })
  return Math.abs(hash)
}

/** 从题库池中随机抽取题目 */
export function selectRandomQuestions(
  pools: Map<WilderDimension, QuestionPool>,
  config: RandomSelectionConfig = DEFAULT_RANDOM_CONFIG
): RandomizedQuestionSet {
  // 使用题目池哈希作为默认种子，确保同一题目池始终产生相同结果
  const seed = config.seed ?? generatePoolHash(pools)
  const random = seededRandom(seed)
  
  const selectedChoices: (ChoiceQuestion | AdaptiveChoiceQuestion)[] = []
  const selectedJudgments: (JudgmentQuestion | AdaptiveJudgmentQuestion)[] = []
  const usedChoiceIds = new Set<string>()
  const usedJudgmentIds = new Set<string>()
  
  // 第一轮：确保每个维度至少有最小数量的题目
  for (const dim of ALL_DIMENSIONS) {
    const pool = pools.get(dim)
    if (!pool) continue
    
    // 抽取选择题
    const availableChoices = pool.choiceQuestions.filter(q => !usedChoiceIds.has(q.id))
    const shuffledChoices = shuffleArray(availableChoices, Math.floor(random() * 1000000))
    const selectCount = Math.min(config.minChoicePerDimension, shuffledChoices.length)
    
    for (let i = 0; i < selectCount; i++) {
      selectedChoices.push(shuffledChoices[i])
      usedChoiceIds.add(shuffledChoices[i].id)
    }
    
    // 抽取判断题
    const availableJudgments = pool.judgmentQuestions.filter(q => !usedJudgmentIds.has(q.id))
    const shuffledJudgments = shuffleArray(availableJudgments, Math.floor(random() * 1000000))
    const selectJCount = Math.min(config.minJudgmentPerDimension, shuffledJudgments.length)
    
    for (let i = 0; i < selectJCount; i++) {
      selectedJudgments.push(shuffledJudgments[i])
      usedJudgmentIds.add(shuffledJudgments[i].id)
    }
  }
  
  // 第二轮：补充到目标数量（随机从所有池中抽取）
  const allRemainingChoices: (ChoiceQuestion | AdaptiveChoiceQuestion)[] = []
  const allRemainingJudgments: (JudgmentQuestion | AdaptiveJudgmentQuestion)[] = []
  
  for (const pool of pools.values()) {
    allRemainingChoices.push(...pool.choiceQuestions.filter(q => !usedChoiceIds.has(q.id)))
    allRemainingJudgments.push(...pool.judgmentQuestions.filter(q => !usedJudgmentIds.has(q.id)))
  }
  
  // 补充选择题
  const shuffledRemaining = shuffleArray(allRemainingChoices, Math.floor(random() * 1000000))
  const additionalChoiceCount = Math.min(
    config.maxTotalChoice - selectedChoices.length,
    shuffledRemaining.length
  )
  
  for (let i = 0; i < additionalChoiceCount; i++) {
    selectedChoices.push(shuffledRemaining[i])
  }
  
  // 补充判断题
  const shuffledRemainingJ = shuffleArray(allRemainingJudgments, Math.floor(random() * 1000000))
  const additionalJudgmentCount = Math.min(
    config.maxTotalJudgment - selectedJudgments.length,
    shuffledRemainingJ.length
  )
  
  for (let i = 0; i < additionalJudgmentCount; i++) {
    selectedJudgments.push(shuffledRemainingJ[i])
  }
  
  // 最终打乱顺序
  const finalChoices = shuffleArray(selectedChoices, Math.floor(random() * 1000000))
  const finalJudgments = shuffleArray(selectedJudgments, Math.floor(random() * 1000000))
  
  // 计算维度覆盖统计
  const coverage: Record<WilderDimension, { choice: number; judgment: number }> = {
    W: { choice: 0, judgment: 0 },
    I: { choice: 0, judgment: 0 },
    L: { choice: 0, judgment: 0 },
    D: { choice: 0, judgment: 0 },
    E: { choice: 0, judgment: 0 },
    R: { choice: 0, judgment: 0 },
  }
  
  for (const q of finalChoices) {
    for (const dim of ALL_DIMENSIONS) {
      if (questionCoversDimension(q.wilderMapping, dim)) {
        coverage[dim].choice++
      }
    }
  }
  
  for (const q of finalJudgments) {
    for (const dim of ALL_DIMENSIONS) {
      if (questionCoversDimension(q.wilderMapping, dim)) {
        coverage[dim].judgment++
      }
    }
  }
  
  return {
    choices: finalChoices,
    judgments: finalJudgments,
    dimensionCoverage: coverage,
    totalQuestions: finalChoices.length + finalJudgments.length,
    selectionSeed: seed,
  }
}

// ========== 年龄自适应随机抽题 ==========

/** 根据年龄生成随机题组 */
export function generateRandomQuestionSetByAge(
  age: number,
  config: Partial<RandomSelectionConfig> = {}
): RandomizedQuestionSet {
  // 合并配置（是否包含 Layer2 深度题）
  const mergedConfig = { ...DEFAULT_RANDOM_CONFIG, ...config }
  
  // 学龄前儿童(4-5岁)：使用专门的幼儿化题目
  if (isPreschoolAge(age)) {
    const preschoolChoices = getPreschoolChoiceQuestions(age)
    const preschoolJudgments = getPreschoolJudgmentQuestions(age)
    
    // 学龄前题目数量适当减少
    const preschoolConfig = {
      ...mergedConfig,
      maxTotalChoice: Math.min(mergedConfig.maxTotalChoice, 18),
      maxTotalJudgment: Math.min(mergedConfig.maxTotalJudgment, 8),
    }
    
    // 构建维度池
    const pools = buildDimensionPools(
      preschoolChoices as unknown as (ChoiceQuestion | AdaptiveChoiceQuestion)[],
      preschoolJudgments as unknown as (JudgmentQuestion | AdaptiveJudgmentQuestion)[]
    )
    
    return selectRandomQuestions(pools, preschoolConfig)
  }
  
  // 6岁以上：使用标准年龄适配题目
  const ageChoices = getChoiceQuestionsByAge(age)
  const ageJudgments = getJudgmentQuestionsByAge(age)
  
  // 可选：包含 Layer2 深度测评题
  let allChoices: (ChoiceQuestion | AdaptiveChoiceQuestion)[] = [...ageChoices]
  let allJudgments: (JudgmentQuestion | AdaptiveJudgmentQuestion)[] = [...ageJudgments]
  
  if (mergedConfig.includeLayer2) {
    const layer2Choices = choiceQuestions.filter(q => q.model === 'WILDER-L2')
    const layer2Judgments = judgmentQuestions.filter(q => q.model === 'WILDER-L2')
    allChoices = [...allChoices, ...layer2Choices]
    allJudgments = [...allJudgments, ...layer2Judgments]
  }

  // 新模型题目（CHC/Grit/SEL）
  const newModelChoices = getNewModelChoiceQuestionsByAge(age)
  const newModelJudgments = getNewModelJudgmentQuestionsByAge(age)
  allChoices = [...allChoices, ...newModelChoices]
  allJudgments = [...allJudgments, ...newModelJudgments]
  
  // 构建维度池
  const pools = buildDimensionPools(allChoices, allJudgments)
  
  // 执行随机抽题
  return selectRandomQuestions(pools, mergedConfig)
}

// ========== 从全局题库随机抽题（不分年龄） ==========

/** 从全局题库生成随机题组 */
export function generateRandomQuestionSetFromAll(
  config: Partial<RandomSelectionConfig> = {}
): RandomizedQuestionSet {
  const mergedConfig = { ...DEFAULT_RANDOM_CONFIG, ...config }
  
  // 使用全局题库
  const allChoices = [...choiceQuestions]
  const allJudgments = [...judgmentQuestions]
  
  // 构建维度池
  const pools = buildDimensionPools(allChoices, allJudgments)
  
  // 执行随机抽题
  return selectRandomQuestions(pools, mergedConfig)
}

// ========== 题组验证 ==========

export interface QuestionSetValidation {
  isValid: boolean
  issues: string[]
  dimensionBalance: Record<WilderDimension, 'adequate' | 'minimal' | 'insufficient'>
}

/** 验证题组的维度覆盖是否充分 */
export function validateQuestionSet(
  questionSet: RandomizedQuestionSet,
  minCoverageThreshold: number = 3
): QuestionSetValidation {
  const issues: string[] = []
  const balance: Record<WilderDimension, 'adequate' | 'minimal' | 'insufficient'> = {
    W: 'adequate', I: 'adequate', L: 'adequate',
    D: 'adequate', E: 'adequate', R: 'adequate',
  }
  
  for (const dim of ALL_DIMENSIONS) {
    const total = questionSet.dimensionCoverage[dim].choice + 
                  questionSet.dimensionCoverage[dim].judgment
    
    if (total === 0) {
      issues.push(`维度 ${dim} 没有任何题目覆盖`)
      balance[dim] = 'insufficient'
    } else if (total < minCoverageThreshold) {
      issues.push(`维度 ${dim} 覆盖不足 (${total} < ${minCoverageThreshold})`)
      balance[dim] = 'minimal'
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    dimensionBalance: balance,
  }
}

// ========== 得分计算（与随机题组兼容） ==========

/** 计算随机题组的最大可能得分 */
export function computeRandomSetMaxScores(
  questionSet: RandomizedQuestionSet
): Record<string, number> {
  // 收集所有出现的得分键
  const allKeys = new Set<string>()
  for (const q of questionSet.choices) {
    for (const opt of q.options) {
      Object.keys(opt.scores).forEach(k => allKeys.add(k))
    }
  }
  for (const q of questionSet.judgments) {
    Object.keys(q.scores.yes).forEach(k => allKeys.add(k))
    Object.keys(q.scores.no).forEach(k => allKeys.add(k))
  }

  const max: Record<string, number> = {}
  for (const k of allKeys) max[k] = 0

  // 选择题：每题每维度取最高分选项
  for (const q of questionSet.choices) {
    for (const k of allKeys) {
      const best = Math.max(...q.options.map(opt => (opt.scores[k] as number) || 0))
      max[k] += best
    }
  }

  // 判断题：每题每维度取 yes/no 最高分
  for (const q of questionSet.judgments) {
    for (const k of allKeys) {
      const yesScore = (q.scores.yes[k] as number) || 0
      const noScore = (q.scores.no[k] as number) || 0
      max[k] += Math.max(yesScore, noScore)
    }
  }

  return max
}

// ========== 导出类型 ==========
export type { ChoiceQuestion, JudgmentQuestion, AdaptiveChoiceQuestion, AdaptiveJudgmentQuestion }
