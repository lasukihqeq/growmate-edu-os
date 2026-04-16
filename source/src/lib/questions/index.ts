// ===================================================================
// 万题库入口 + 初始化
// 注册所有题库分片（旧题 + 模板生成题 + 扩展题）
// ===================================================================

import type { UnifiedQuestion, QuestionChunkMeta, AgeGroupKey, QuestionModel } from './types'
import { AGE_GROUPS } from './types'
import { registerChunks, getTotalQuestionCount, getCountByModel, getCountByAgeGroup } from './registry'
import { getLegacyByAgeGroup } from './legacyAdapter'
import { batchGenerate } from './templates/templateEngine'
import { ALL_TEMPLATES } from './templates/templateDefinitions'
import {
  CURIOSITY_SCENARIOS, INQUIRY_SCENARIOS, CONNECTION_SCENARIOS,
  DESIGN_SCENARIOS, EXPRESSION_SCENARIOS, REFLECTION_SCENARIOS,
  MI_SCENARIOS, BIGFIVE_SCENARIOS, CHC_SCENARIOS,
  GRIT_SCENARIOS, SEL_SCENARIOS, EF_SCENARIOS,
} from './templates/scenarioBank'
import type { ScenarioVariant } from './templates/templateEngine'
import { generateExpandedQuestions } from './expandedQuestionGenerator'

// ========== 模板→变体映射 ==========

function buildVariantBank(): Map<string, ScenarioVariant[]> {
  const bank = new Map<string, ScenarioVariant[]>()

  // WILDER好奇心(W)模板使用好奇心场景
  bank.set('W-C01', CURIOSITY_SCENARIOS)
  bank.set('W-C02', CURIOSITY_SCENARIOS)
  bank.set('W-J01', CURIOSITY_SCENARIOS)

  // WILDER探究力(I)模板使用探究场景
  bank.set('I-C01', INQUIRY_SCENARIOS)
  bank.set('I-C02', INQUIRY_SCENARIOS)

  // WILDER连接力(L)模板使用连接场景
  bank.set('L-C01', CONNECTION_SCENARIOS)

  // WILDER设计力(D)模板使用设计场景
  bank.set('D-C01', DESIGN_SCENARIOS)

  // WILDER表达力(E)模板使用表达场景
  bank.set('E-C01', EXPRESSION_SCENARIOS)

  // WILDER反思力(R)模板使用反思场景
  bank.set('R-C01', REFLECTION_SCENARIOS)

  // MI模板使用MI场景
  bank.set('MI-C01', MI_SCENARIOS)
  bank.set('MI-C02', MI_SCENARIOS)

  // BigFive模板使用大五场景
  bank.set('BF-C01', BIGFIVE_SCENARIOS)
  bank.set('BF-C02', BIGFIVE_SCENARIOS)

  // CHC模板使用CHC场景
  bank.set('CHC-C01', CHC_SCENARIOS)

  // Grit模板使用坚毅力场景
  bank.set('GRIT-C01', GRIT_SCENARIOS)

  // SEL模板使用SEL场景
  bank.set('SEL-C01', SEL_SCENARIOS)

  // EF模板使用EF场景
  bank.set('EF-C01', EF_SCENARIOS)

  return bank
}

// ========== 生成模板题并按年龄组分组 ==========

function generateAndGroupTemplateQuestions(): Map<AgeGroupKey, UnifiedQuestion[]> {
  const variantBank = buildVariantBank()
  const allTemplateQuestions = batchGenerate(ALL_TEMPLATES, variantBank)

  const grouped = new Map<AgeGroupKey, UnifiedQuestion[]>()
  for (const ag of AGE_GROUPS) {
    grouped.set(ag, [])
  }

  for (const q of allTemplateQuestions) {
    grouped.get(q.ageGroup)?.push(q)
  }

  return grouped
}

// ========== 初始化函数 ==========

let initialized = false

/** 初始化万题库（注册所有分片） */
export function initializeQuestionBank(): {
  totalQuestions: number
  byModel: Record<string, number>
  byAgeGroup: Record<string, number>
} {
  if (initialized) {
    return {
      totalQuestions: getTotalQuestionCount(),
      byModel: getCountByModel(),
      byAgeGroup: getCountByAgeGroup(),
    }
  }

  const chunks: QuestionChunkMeta[] = []

  // 1. 注册旧题库分片
  for (const ag of AGE_GROUPS) {
    const legacyQuestions = getLegacyByAgeGroup(ag)
    if (legacyQuestions.length > 0) {
      // 按模型拆分旧题
      const byModel = new Map<QuestionModel, UnifiedQuestion[]>()
      for (const q of legacyQuestions) {
        if (!byModel.has(q.model)) byModel.set(q.model, [])
        byModel.get(q.model)!.push(q)
      }

      for (const [model, questions] of byModel) {
        const chunkId = `legacy-${model}-${ag}`
        chunks.push({
          chunkId,
          model,
          ageGroup: ag,
          count: questions.length,
          dimensions: [...new Set(questions.flatMap(q => q.wilderMapping))],
          typeDistribution: {
            choice: questions.filter(q => q.type === 'choice').length,
            judgment: questions.filter(q => q.type === 'judgment').length,
          },
          loader: async () => questions,
        })
      }
    }
  }

  // 2. 注册模板生成题分片
  const templateGroups = generateAndGroupTemplateQuestions()
  for (const [ag, questions] of templateGroups) {
    if (questions.length === 0) continue

    // 按模型拆分模板题
    const byModel = new Map<QuestionModel, UnifiedQuestion[]>()
    for (const q of questions) {
      if (!byModel.has(q.model)) byModel.set(q.model, [])
      byModel.get(q.model)!.push(q)
    }

    for (const [model, modelQuestions] of byModel) {
      const chunkId = `template-${model}-${ag}`
      chunks.push({
        chunkId,
        model,
        ageGroup: ag,
        count: modelQuestions.length,
        dimensions: [...new Set(modelQuestions.flatMap(q => q.wilderMapping))],
        typeDistribution: {
          choice: modelQuestions.filter(q => q.type === 'choice').length,
          judgment: modelQuestions.filter(q => q.type === 'judgment').length,
        },
        loader: async () => modelQuestions,
      })
    }
  }

  // 3. 注册扩展题分片
  const expandedChunks = generateExpandedQuestions()
  chunks.push(...expandedChunks)

  // 批量注册
  registerChunks(chunks)
  initialized = true

  return {
    totalQuestions: getTotalQuestionCount(),
    byModel: getCountByModel(),
    byAgeGroup: getCountByAgeGroup(),
  }
}

/** 获取初始化状态 */
export function isInitialized(): boolean {
  return initialized
}

// Re-export registry functions for convenience
export {
  getQuestions,
  getQuestionsByAge,
  getQuestionsByAgeAndModels,
  getQuestionById,
  getTotalQuestionCount,
  getCountByModel,
  getCountByAgeGroup,
  preloadForAge,
  computeMaxScoresFromQuestions,
} from './registry'

export type {
  UnifiedQuestion,
  QuestionFilter,
  QuestionChunkMeta,
  AgeGroupKey,
  QuestionModel,
} from './types'
