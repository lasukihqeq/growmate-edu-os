// ===================================================================
// 模板化题目生成引擎 v1.0
// 通过母题模板 + 场景参数变体批量生成同质异形题
// 保持相同的评分结构，仅替换情境文本
// ===================================================================

import type { UnifiedQuestion, AgeGroupKey, QuestionModel, QuestionOption } from '../types'

// ========== 模板类型定义 ==========

export interface QuestionTemplate {
  /** 模板ID */
  templateId: string
  /** 题目类型 */
  type: 'choice' | 'judgment'
  /** 题目正文模板，含 {placeholder} 占位符 */
  textPattern: string
  /** 场景描述模板 */
  scenarioPattern?: string
  /** 所属模型 */
  model: QuestionModel
  /** 测评维度 */
  dimension: string
  /** WILDER映射 */
  wilderMapping: string[]
  /** Layer2标签 */
  layer2Tags?: string[]
  /** 适用年龄组 */
  ageGroups: AgeGroupKey[]
  /** 基础难度 */
  difficulty: 1 | 2 | 3 | 4 | 5
  /** 基础区分度 */
  discrimination: number

  // 选择题模板
  optionPatterns?: OptionPattern[]

  // 判断题模板
  correctAnswer?: boolean
  scorePatterns?: { yes: Record<string, number>; no: Record<string, number> }

  /** 内容标签 */
  tags: string[]
}

export interface OptionPattern {
  id: string
  textPattern: string
  scores: Record<string, number>
}

/** 场景变体参数集 */
export interface ScenarioVariant {
  /** 变体ID后缀 */
  variantId: string
  /** 适用年龄组（可覆盖模板的ageGroups） */
  ageGroup?: AgeGroupKey
  /** 参数键值对 */
  params: Record<string, string>
}

// ========== 核心生成函数 ==========

/** 将模板文本中的 {placeholder} 替换为参数值 */
function interpolate(pattern: string, params: Record<string, string>): string {
  return pattern.replace(/\{(\w+)\}/g, (_match, key) => params[key] || `{${key}}`)
}

/** 从单个模板 + 变体列表生成题目数组 */
export function generateFromTemplate(
  template: QuestionTemplate,
  variants: ScenarioVariant[]
): UnifiedQuestion[] {
  const questions: UnifiedQuestion[] = []
  const seenOptionSets = new Set<string>()

  for (const variant of variants) {
    const ageGroups = variant.ageGroup
      ? [variant.ageGroup]
      : template.ageGroups

    for (const ageGroup of ageGroups) {
      const id = `TPL-${template.templateId}-${variant.variantId}-${ageGroup}`
      const text = interpolate(template.textPattern, variant.params)
      const scenario = template.scenarioPattern
        ? interpolate(template.scenarioPattern, variant.params)
        : undefined

      if (template.type === 'choice' && template.optionPatterns) {
        const options: QuestionOption[] = template.optionPatterns.map(op => ({
          id: op.id,
          text: interpolate(op.textPattern, variant.params),
          scores: { ...op.scores },
        }))

        // 去重守卫：跳过选项文本完全相同的变体
        const optionFingerprint = options.map(o => o.text.trim().toLowerCase()).sort().join('||')
        if (seenOptionSets.has(optionFingerprint)) {
          continue
        }
        seenOptionSets.add(optionFingerprint)

        questions.push({
          id,
          type: 'choice',
          text,
          scenario,
          model: template.model,
          dimension: template.dimension,
          wilderMapping: [...template.wilderMapping],
          layer2Tags: template.layer2Tags ? [...template.layer2Tags] : undefined,
          ageGroup,
          options,
          difficulty: template.difficulty,
          discrimination: template.discrimination * 0.85, // 模板变体略降区分度
          source: 'template',
          templateId: template.templateId,
          tags: [...template.tags, ageGroup],
        })
      } else if (template.type === 'judgment' && template.scorePatterns) {
        questions.push({
          id,
          type: 'judgment',
          text,
          scenario,
          model: template.model,
          dimension: template.dimension,
          wilderMapping: [...template.wilderMapping],
          layer2Tags: template.layer2Tags ? [...template.layer2Tags] : undefined,
          ageGroup,
          correctAnswer: template.correctAnswer,
          scores: {
            yes: { ...template.scorePatterns.yes },
            no: { ...template.scorePatterns.no },
          },
          difficulty: template.difficulty,
          discrimination: template.discrimination * 0.85,
          source: 'template',
          templateId: template.templateId,
          tags: [...template.tags, ageGroup],
        })
      }
    }
  }

  return questions
}

/** 从多个模板批量生成题目 */
export function batchGenerate(
  templates: QuestionTemplate[],
  variantBank: Map<string, ScenarioVariant[]>
): UnifiedQuestion[] {
  const allQuestions: UnifiedQuestion[] = []

  for (const template of templates) {
    const variants = variantBank.get(template.templateId) || []
    if (variants.length > 0) {
      allQuestions.push(...generateFromTemplate(template, variants))
    }
  }

  return allQuestions
}

/** 统计批量生成结果 */
export function getGenerationStats(questions: UnifiedQuestion[]): {
  total: number
  byModel: Record<string, number>
  byAgeGroup: Record<string, number>
  byType: { choice: number; judgment: number }
} {
  const byModel: Record<string, number> = {}
  const byAgeGroup: Record<string, number> = {}
  let choice = 0
  let judgment = 0

  for (const q of questions) {
    byModel[q.model] = (byModel[q.model] || 0) + 1
    byAgeGroup[q.ageGroup] = (byAgeGroup[q.ageGroup] || 0) + 1
    if (q.type === 'choice') choice++
    else judgment++
  }

  return {
    total: questions.length,
    byModel,
    byAgeGroup,
    byType: { choice, judgment },
  }
}
