// ===================================================================
// 万题库统一类型定义 v1.0
// 统一 ChoiceQuestion / AdaptiveChoiceQuestion / PreschoolChoiceQuestion
// 以及 JudgmentQuestion / AdaptiveJudgmentQuestion / PreschoolJudgmentQuestion
// 为单一 UnifiedQuestion 接口
// ===================================================================

// ========== 基础类型 ==========

export type AgeGroupKey = 'preschool' | 'lower-primary' | 'upper-primary' | 'middle-school' | 'high-school'

export type QuestionModel =
  | 'MI' | 'BigFive' | 'Cognitive' | 'WILDER' | 'WILDER-L2'
  | 'EF' | 'CHC' | 'Grit' | 'SEL' | 'RIASEC'

export type QuestionSource = 'legacy' | 'expanded' | 'template'

export type QuestionType = 'choice' | 'judgment'

// ========== 统一题目接口 ==========

export interface UnifiedQuestion {
  /** 全局唯一标识 */
  id: string
  /** 题目类型 */
  type: QuestionType
  /** 题目正文 */
  text: string
  /** 情境描述（可选） */
  scenario?: string
  /** 所属理论模型 */
  model: QuestionModel
  /** 测评维度 */
  dimension: string
  /** WILDER六维映射 */
  wilderMapping: string[]
  /** Layer2 能力标签（可选） */
  layer2Tags?: string[]
  /** 适用年龄组 */
  ageGroup: AgeGroupKey

  // ---- 选择题专用字段 (type === 'choice') ----
  /** 选项列表（选择题） */
  options?: QuestionOption[]

  // ---- 判断题专用字段 (type === 'judgment') ----
  /** 正确答案（判断题） */
  correctAnswer?: boolean
  /** 判断题得分映射 */
  scores?: { yes: Record<string, number>; no: Record<string, number> }

  // ---- 心理测量学属性 ----
  /** 难度等级 1-5（1最易，5最难） */
  difficulty: 1 | 2 | 3 | 4 | 5
  /** 区分度 0.0-1.0（越高越能区分不同能力水平） */
  discrimination: number
  /** 题目来源 */
  source: QuestionSource
  /** 模板关联ID（模板生成题使用） */
  templateId?: string
  /** 内容标签 */
  tags: string[]
  /** 认知水平描述（可选） */
  cognitiveLevel?: string
  /** 设计原理（可选） */
  designRationale?: string
}

export interface QuestionOption {
  id: string
  text: string
  scores: Record<string, number>
}

// ========== 题库分片元数据 ==========

export interface QuestionChunkMeta {
  /** 分片ID */
  chunkId: string
  /** 所属模型 */
  model: QuestionModel
  /** 年龄组 */
  ageGroup: AgeGroupKey
  /** 题目数量 */
  count: number
  /** 覆盖的维度列表 */
  dimensions: string[]
  /** 题目类型分布 */
  typeDistribution: { choice: number; judgment: number }
  /** 动态导入工厂 */
  loader: () => Promise<UnifiedQuestion[]>
}

// ========== 查询过滤器 ==========

export interface QuestionFilter {
  /** 按年龄筛选（自动映射到年龄组） */
  age?: number
  /** 按年龄组筛选 */
  ageGroups?: AgeGroupKey[]
  /** 按模型筛选 */
  models?: QuestionModel[]
  /** 按维度筛选 */
  dimensions?: string[]
  /** 按类型筛选 */
  type?: QuestionType
  /** 按来源筛选 */
  source?: QuestionSource[]
  /** 按难度范围筛选 */
  difficultyRange?: { min: 1 | 2 | 3 | 4 | 5; max: 1 | 2 | 3 | 4 | 5 }
  /** 排除的题目ID */
  excludeIds?: Set<string>
}

// ========== 工具函数 ==========

/** 年龄 → 年龄组映射 */
export function ageToGroup(age: number): AgeGroupKey {
  if (age <= 5) return 'preschool'
  if (age <= 9) return 'lower-primary'
  if (age <= 12) return 'upper-primary'
  if (age <= 15) return 'middle-school'
  return 'high-school'
}

/** 判断题目是否匹配过滤器 */
export function matchesFilter(q: UnifiedQuestion, filter: QuestionFilter): boolean {
  if (filter.excludeIds?.has(q.id)) return false
  if (filter.age !== undefined && q.ageGroup !== ageToGroup(filter.age)) return false
  if (filter.ageGroups && !filter.ageGroups.includes(q.ageGroup)) return false
  if (filter.models && !filter.models.includes(q.model)) return false
  if (filter.dimensions && !filter.dimensions.includes(q.dimension)) return false
  if (filter.type && q.type !== filter.type) return false
  if (filter.source && !filter.source.includes(q.source)) return false
  if (filter.difficultyRange) {
    if (q.difficulty < filter.difficultyRange.min || q.difficulty > filter.difficultyRange.max) return false
  }
  return true
}

// ========== 常量 ==========

export const WILDER_DIMS = ['W', 'I', 'L', 'D', 'E', 'R'] as const

export const NEW_MODEL_DIMS = [
  'Gf', 'Gc',
  'grit_passion', 'grit_perseverance',
  'sel_selfAwareness', 'sel_selfManagement', 'sel_socialAwareness',
  'sel_relationshipSkills', 'sel_responsibleDecision',
] as const

export const ALL_TRACKED_DIMS = [...WILDER_DIMS, ...NEW_MODEL_DIMS] as const

export const AGE_GROUPS: AgeGroupKey[] = [
  'preschool', 'lower-primary', 'upper-primary', 'middle-school', 'high-school'
]

export const ALL_MODELS: QuestionModel[] = [
  'MI', 'BigFive', 'Cognitive', 'WILDER', 'WILDER-L2',
  'EF', 'CHC', 'Grit', 'SEL', 'RIASEC'
]
