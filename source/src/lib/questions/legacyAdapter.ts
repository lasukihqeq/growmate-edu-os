// ===================================================================
// 旧题库适配器 v1.0
// 将现有 774 道题目从4个不同的类型定义转换为统一的 UnifiedQuestion 格式
// 保持原有 ID 不变，确保草稿和历史数据的兼容性
// ===================================================================

import type { UnifiedQuestion, AgeGroupKey, QuestionModel } from './types'

import {
  choiceQuestions as baseChoiceQuestions,
  judgmentQuestions as baseJudgmentQuestions,
  type ChoiceQuestion,
  type JudgmentQuestion,
} from '../assessmentEngine'

import {
  getChoiceQuestionsByAge,
  getJudgmentQuestionsByAge,
  type AdaptiveChoiceQuestion,
  type AdaptiveJudgmentQuestion,
} from '../ageAdaptiveQuestions'

import {
  getNewModelChoiceQuestionsByAge,
  getNewModelJudgmentQuestionsByAge,
} from '../newModelQuestions'

import {
  getPreschoolChoiceQuestions,
  getPreschoolJudgmentQuestions,
  type PreschoolChoiceQuestion,
  type PreschoolJudgmentQuestion,
} from '../preschoolQuestions'

// ========== 适配函数 ==========

/** 基础选择题 → UnifiedQuestion */
function adaptBaseChoice(q: ChoiceQuestion): UnifiedQuestion {
  return {
    id: q.id,
    type: 'choice',
    text: q.text,
    scenario: q.scenario,
    model: q.model as QuestionModel,
    dimension: q.dimension,
    wilderMapping: q.wilderMapping,
    layer2Tags: q.layer2Tags,
    ageGroup: 'lower-primary', // 基础题默认归为低年级（通用题）
    options: q.options,
    difficulty: 3,
    discrimination: 0.5,
    source: 'legacy',
    tags: [q.model, q.dimension],
    cognitiveLevel: undefined,
    designRationale: undefined,
  }
}

/** 基础判断题 → UnifiedQuestion */
function adaptBaseJudgment(q: JudgmentQuestion): UnifiedQuestion {
  return {
    id: q.id,
    type: 'judgment',
    text: q.text,
    scenario: q.scenario,
    model: q.model as QuestionModel,
    dimension: q.dimension,
    wilderMapping: q.wilderMapping,
    layer2Tags: q.layer2Tags,
    ageGroup: 'lower-primary',
    correctAnswer: q.correctAnswer,
    scores: q.scores,
    difficulty: 3,
    discrimination: 0.5,
    source: 'legacy',
    tags: [q.model, q.dimension],
  }
}

/** 年龄适配选择题 → UnifiedQuestion */
function adaptAdaptiveChoice(q: AdaptiveChoiceQuestion): UnifiedQuestion {
  return {
    id: q.id,
    type: 'choice',
    text: q.text,
    scenario: q.scenario,
    model: q.model as QuestionModel,
    dimension: q.dimension,
    wilderMapping: q.wilderMapping,
    ageGroup: q.ageGroup as AgeGroupKey,
    options: q.options,
    difficulty: 3,
    discrimination: 0.5,
    source: 'legacy',
    tags: [q.model, q.dimension, q.ageGroup],
    cognitiveLevel: q.cognitiveLevel,
    designRationale: q.designRationale,
  }
}

/** 年龄适配判断题 → UnifiedQuestion */
function adaptAdaptiveJudgment(q: AdaptiveJudgmentQuestion): UnifiedQuestion {
  return {
    id: q.id,
    type: 'judgment',
    text: q.text,
    scenario: q.scenario,
    model: q.model as QuestionModel,
    dimension: q.dimension,
    wilderMapping: q.wilderMapping,
    ageGroup: q.ageGroup as AgeGroupKey,
    correctAnswer: q.correctAnswer,
    scores: q.scores,
    difficulty: 3,
    discrimination: 0.5,
    source: 'legacy',
    tags: [q.model, q.dimension, q.ageGroup],
    cognitiveLevel: q.cognitiveLevel,
    designRationale: q.designRationale,
  }
}

/** 学龄前选择题 → UnifiedQuestion */
function adaptPreschoolChoice(q: PreschoolChoiceQuestion): UnifiedQuestion {
  return {
    id: q.id,
    type: 'choice',
    text: q.text,
    scenario: q.scenario,
    model: q.model as QuestionModel,
    dimension: q.dimension,
    wilderMapping: q.wilderMapping,
    ageGroup: 'preschool',
    options: q.options,
    difficulty: 2, // 学龄前默认较低难度
    discrimination: 0.4,
    source: 'legacy',
    tags: [q.model, q.dimension, 'preschool'],
    cognitiveLevel: q.cognitiveLevel,
    designRationale: q.designRationale,
  }
}

/** 学龄前判断题 → UnifiedQuestion */
function adaptPreschoolJudgment(q: PreschoolJudgmentQuestion): UnifiedQuestion {
  return {
    id: q.id,
    type: 'judgment',
    text: q.text,
    scenario: q.scenario,
    model: q.model as QuestionModel,
    dimension: q.dimension,
    wilderMapping: q.wilderMapping,
    ageGroup: 'preschool',
    correctAnswer: q.correctAnswer,
    scores: q.scores,
    difficulty: 2,
    discrimination: 0.4,
    source: 'legacy',
    tags: [q.model, q.dimension, 'preschool'],
    cognitiveLevel: q.cognitiveLevel,
    designRationale: q.designRationale,
  }
}

// ========== 导出：按年龄获取统一格式的旧题 ==========

/** 获取指定年龄的全部旧题库题目（统一格式） */
export function getLegacyQuestionsByAge(age: number): UnifiedQuestion[] {
  const questions: UnifiedQuestion[] = []

  if (age <= 5) {
    // 学龄前
    const preschoolChoices = getPreschoolChoiceQuestions(age)
    const preschoolJudgments = getPreschoolJudgmentQuestions(age)
    questions.push(...preschoolChoices.map(adaptPreschoolChoice))
    questions.push(...preschoolJudgments.map(adaptPreschoolJudgment))
  } else {
    // 6岁以上：基础题 + 年龄适配题 + 新模型题
    // Layer2 深度题（来自基础题库）
    const layer2Choices = baseChoiceQuestions.filter(q => q.model === 'WILDER-L2')
    const layer2Judgments = baseJudgmentQuestions.filter(q => q.model === 'WILDER-L2')
    questions.push(...layer2Choices.map(adaptBaseChoice))
    questions.push(...layer2Judgments.map(adaptBaseJudgment))

    // 年龄适配题
    const ageChoices = getChoiceQuestionsByAge(age)
    const ageJudgments = getJudgmentQuestionsByAge(age)
    questions.push(...ageChoices.map(adaptAdaptiveChoice))
    questions.push(...ageJudgments.map(adaptAdaptiveJudgment))

    // 新模型题（CHC/Grit/SEL）
    const newChoices = getNewModelChoiceQuestionsByAge(age)
    const newJudgments = getNewModelJudgmentQuestionsByAge(age)
    questions.push(...newChoices.map(adaptAdaptiveChoice))
    questions.push(...newJudgments.map(adaptAdaptiveJudgment))
  }

  return questions
}

/** 获取全部旧题库题目数量统计 */
export function getLegacyStats(): {
  base: number
  ageAdaptive: number
  newModel: number
  preschool: number
  total: number
} {
  const base = baseChoiceQuestions.length + baseJudgmentQuestions.length
  // 估算各年龄组
  const ages = [8, 11, 14, 17] // 各年龄组代表年龄
  let ageAdaptive = 0
  let newModel = 0
  for (const age of ages) {
    ageAdaptive += getChoiceQuestionsByAge(age).length + getJudgmentQuestionsByAge(age).length
    newModel += getNewModelChoiceQuestionsByAge(age).length + getNewModelJudgmentQuestionsByAge(age).length
  }
  const preschool = getPreschoolChoiceQuestions(4).length + getPreschoolJudgmentQuestions(4).length

  return {
    base,
    ageAdaptive,
    newModel,
    preschool,
    total: base + ageAdaptive + newModel + preschool,
  }
}

// ========== 按年龄组分组导出（供注册中心使用） ==========

const AGE_GROUP_REPRESENTATIVE: Record<AgeGroupKey, number> = {
  'preschool': 4,
  'lower-primary': 8,
  'upper-primary': 11,
  'middle-school': 14,
  'high-school': 17,
}

/** 按年龄组获取旧题（注册中心分片用） */
export function getLegacyByAgeGroup(ageGroup: AgeGroupKey): UnifiedQuestion[] {
  const age = AGE_GROUP_REPRESENTATIVE[ageGroup]
  return getLegacyQuestionsByAge(age)
}
