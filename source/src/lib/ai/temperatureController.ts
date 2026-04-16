// ===================================================================
// GROWMATE AI-Native 引擎 — 年龄自适应温度控制器 v1.0.0
// 纯规则计算模块，不依赖LLM，是所有AI模块的上游
// ===================================================================

import type { LanguageProfile, VocabularyLevel, SentenceComplexity, EvidenceDensity } from './types'

// ============================================================
// 年龄语言规格定义
// ============================================================

export interface AgeLanguageSpec {
  ageMin: number
  ageMax: number
  label: string
  temperature: [number, number]
  vocabulary: {
    level: VocabularyLevel
    maxWordLength: number
    allowedJargon: boolean
    metaphorStyle: 'animal' | 'story' | 'analogy' | 'data'
    description: string
  }
  sentence: {
    complexity: SentenceComplexity
    maxLength: number
    allowSubordinateClauses: boolean
    listingStyle: 'emoji' | 'number' | 'bullet' | 'inline'
    description: string
  }
  evidence: {
    density: EvidenceDensity
    citationStyle: 'none' | 'informal' | 'parenthetical' | 'formal'
    dataPointsPerParagraph: number
    includePercentiles: boolean
    includeResearchReferences: boolean
    description: string
  }
  emotional: {
    warmth: number
    directness: number
    encouragement: number
    urgency: number
    toneLabel: string
    description: string
  }
  examplePhrase: string
}

export const AGE_LANGUAGE_SPECS: AgeLanguageSpec[] = [
  {
    ageMin: 3, ageMax: 6,
    label: '学龄前(3-6岁)',
    temperature: [0.85, 0.95],
    vocabulary: {
      level: 'concrete',
      maxWordLength: 8,
      allowedJargon: false,
      metaphorStyle: 'animal',
      description: '使用具象、可感知的词语，用动物或故事比喻抽象概念',
    },
    sentence: {
      complexity: 'simple',
      maxLength: 20,
      allowSubordinateClauses: false,
      listingStyle: 'emoji',
      description: '每句不超过20字，使用emoji列举',
    },
    evidence: {
      density: 'low',
      citationStyle: 'none',
      dataPointsPerParagraph: 0,
      includePercentiles: false,
      includeResearchReferences: false,
      description: '不使用数据和引用',
    },
    emotional: {
      warmth: 0.95, directness: 0.2, encouragement: 0.9, urgency: 0.1,
      toneLabel: '温暖鼓励',
      description: '像一位亲切的老朋友在和孩子聊天',
    },
    examplePhrase: '小明就像一只好奇的小猫咪，看到什么都想凑上去闻一闻！',
  },
  {
    ageMin: 7, ageMax: 9,
    label: '小学低年级(7-9岁)',
    temperature: [0.70, 0.85],
    vocabulary: {
      level: 'concrete',
      maxWordLength: 10,
      allowedJargon: false,
      metaphorStyle: 'story',
      description: '故事化表达，用熟悉的生活场景做类比',
    },
    sentence: {
      complexity: 'compound',
      maxLength: 30,
      allowSubordinateClauses: true,
      listingStyle: 'emoji',
      description: '使用简单的"首先...然后..."结构',
    },
    evidence: {
      density: 'low',
      citationStyle: 'none',
      dataPointsPerParagraph: 0,
      includePercentiles: true,
      includeResearchReferences: false,
      description: '偶尔提及"在同龄人中表现很棒"',
    },
    emotional: {
      warmth: 0.85, directness: 0.3, encouragement: 0.85, urgency: 0.15,
      toneLabel: '温暖故事',
      description: '像一位耐心的老师在讲故事',
    },
    examplePhrase: '小明在同龄小朋友中的好奇心特别突出，就像一个天生的"为什么"探测器。',
  },
  {
    ageMin: 10, ageMax: 12,
    label: '小学高年级(10-12岁)',
    temperature: [0.55, 0.70],
    vocabulary: {
      level: 'transitional',
      maxWordLength: 12,
      allowedJargon: true,
      metaphorStyle: 'analogy',
      description: '使用类比和简单术语，开始引入抽象概念',
    },
    sentence: {
      complexity: 'compound',
      maxLength: 40,
      allowSubordinateClauses: true,
      listingStyle: 'number',
      description: '使用数字列举，允许简单从句嵌套',
    },
    evidence: {
      density: 'medium',
      citationStyle: 'informal',
      dataPointsPerParagraph: 1,
      includePercentiles: true,
      includeResearchReferences: false,
      description: '使用百分位数据，非正式引用',
    },
    emotional: {
      warmth: 0.7, directness: 0.6, encouragement: 0.7, urgency: 0.3,
      toneLabel: '客观引导',
      description: '理性分析为主，适度鼓励',
    },
    examplePhrase: '在探究力维度，小明的表现超过了同龄72%的同学，显示出较强的科学思维倾向。',
  },
  {
    ageMin: 13, ageMax: 15,
    label: '初中(13-15岁)',
    temperature: [0.35, 0.50],
    vocabulary: {
      level: 'abstract',
      maxWordLength: 16,
      allowedJargon: true,
      metaphorStyle: 'analogy',
      description: '使用因果推理和专业术语，引入学科概念',
    },
    sentence: {
      complexity: 'complex',
      maxLength: 60,
      allowSubordinateClauses: true,
      listingStyle: 'bullet',
      description: '使用括号和引用，复杂逻辑结构',
    },
    evidence: {
      density: 'high',
      citationStyle: 'parenthetical',
      dataPointsPerParagraph: 2,
      includePercentiles: true,
      includeResearchReferences: true,
      description: '引用数据点和研究结论',
    },
    emotional: {
      warmth: 0.5, directness: 0.8, encouragement: 0.5, urgency: 0.5,
      toneLabel: '客观分析',
      description: '数据驱动、理性客观，尊重青少年判断力',
    },
    examplePhrase: '基于当前测评数据（探究力P78，反思力P65），该生展现出较强的逻辑推理能力，但在元认知层面仍有提升空间。',
  },
  {
    ageMin: 16, ageMax: 18,
    label: '高中(16-18岁)',
    temperature: [0.20, 0.35],
    vocabulary: {
      level: 'academic',
      maxWordLength: 20,
      allowedJargon: true,
      metaphorStyle: 'data',
      description: '学术级表达，使用完整专业术语和框架',
    },
    sentence: {
      complexity: 'academic',
      maxLength: 80,
      allowSubordinateClauses: true,
      listingStyle: 'inline',
      description: '正式学术引用格式，复杂论证结构',
    },
    evidence: {
      density: 'comprehensive',
      citationStyle: 'formal',
      dataPointsPerParagraph: 3,
      includePercentiles: true,
      includeResearchReferences: true,
      description: '完整数据支撑和研究引用',
    },
    emotional: {
      warmth: 0.3, directness: 0.9, encouragement: 0.3, urgency: 0.6,
      toneLabel: '深度探讨',
      description: '学术级别的分析，尊重成年早期的自主判断',
    },
    examplePhrase: '综合WILDER六维评分（好奇心P82/探究力P78/联结力P45/设计力P67/表达力P53/反思力P71）及大五人格剖面，该生呈现出典型的"内向探索者"认知风格。',
  },
]

// ============================================================
// 核心函数
// ============================================================

/**
 * 获取指定年龄的温度值（线性插值）
 * T = 0.95 - (age - 3) * 0.05，然后clamp到区间
 */
export function getTemperatureForAge(age: number): number {
  const clampedAge = Math.max(3, Math.min(18, age))
  const baseTemp = 0.95 - (clampedAge - 3) * 0.05
  const spec = AGE_LANGUAGE_SPECS.find(s => clampedAge >= s.ageMin && clampedAge <= s.ageMax)
  if (spec) {
    return Math.max(spec.temperature[0], Math.min(spec.temperature[1], baseTemp))
  }
  return Math.max(0.2, Math.min(0.95, baseTemp))
}

/** 获取年龄所属的语言规格 */
function getAgeSpec(age: number): AgeLanguageSpec {
  const clampedAge = Math.max(3, Math.min(18, age))
  return AGE_LANGUAGE_SPECS.find(s => clampedAge >= s.ageMin && clampedAge <= s.ageMax) || AGE_LANGUAGE_SPECS[AGE_LANGUAGE_SPECS.length - 1]
}

/**
 * 计算完整的语言画像
 */
export function computeLanguageProfile(
  age: number,
  _wilderScores?: Record<string, number>,
  _parentPreference?: Record<string, unknown>,
): LanguageProfile {
  const spec = getAgeSpec(age)

  return {
    ageGroup: `${spec.ageMin}-${spec.ageMax}`,
    ageLabel: spec.label,
    temperature: getTemperatureForAge(age),
    vocabularyLevel: spec.vocabulary.level,
    sentenceComplexity: spec.sentence.complexity,
    evidenceDensity: spec.evidence.density,
    emotionalTone: {
      warmth: spec.emotional.warmth,
      directness: spec.emotional.directness,
      encouragement: spec.emotional.encouragement,
      urgency: spec.emotional.urgency,
      toneLabel: spec.emotional.toneLabel,
      description: spec.emotional.description,
    },
    promptInstruction: generateLanguageInstruction({
      ageGroup: `${spec.ageMin}-${spec.ageMax}`,
      ageLabel: spec.label,
      temperature: getTemperatureForAge(age),
      vocabularyLevel: spec.vocabulary.level,
      sentenceComplexity: spec.sentence.complexity,
      evidenceDensity: spec.evidence.density,
      emotionalTone: spec.emotional,
      promptInstruction: '',
      examplePhrases: [],
    }),
    examplePhrases: [spec.examplePhrase],
  }
}

/**
 * 生成可直接注入prompt的语言风格指令
 */
export function generateLanguageInstruction(profile: LanguageProfile): string {
  const tone = profile.emotionalTone

  const vocabMap: Record<string, string> = {
    concrete: '使用具象、可感知的词语，用动物或故事来比喻抽象概念，避免专业术语',
    transitional: '使用类比的表达方式，可以引入简单的学科术语但要解释清楚',
    abstract: '可以使用因果推理和学科术语，保持逻辑清晰',
    academic: '使用学术级表达，完整的术语和理论框架，引用数据支撑论点',
  }

  const sentenceMap: Record<string, string> = {
    simple: '每句不超过20个字，使用简单直接的结构',
    compound: '可以使用"首先...然后...最后..."等简单连接结构',
    complex: '可以使用从句嵌套和复杂逻辑结构，使用括号补充说明',
    academic: '使用正式学术文体，包含引用格式和复杂论证结构',
  }

  const evidenceMap: Record<string, string> = {
    low: '不使用具体数据和引用，用描述性语言表达',
    medium: '适当使用百分位数据，非正式引用（如"研究表明"）',
    high: '每段引用数据点和研究结论，使用括号引用格式',
    comprehensive: '完整数据支撑，正式学术引用格式',
  }

  return `
===语言风格要求===
你正在为一位${profile.ageGroup}岁孩子的家长撰写报告。请严格遵守以下语言规范：
- 词汇：${vocabMap[profile.vocabularyLevel]}
- 句式：${sentenceMap[profile.sentenceComplexity]}
- 证据：${evidenceMap[profile.evidenceDensity]}
- 语调：温暖${(tone.warmth * 100).toFixed(0)}%，直接${(tone.directness * 100).toFixed(0)}%，鼓励${(tone.encouragement * 100).toFixed(0)}%，紧迫${(tone.urgency * 100).toFixed(0)}%，风格"${tone.toneLabel}"
- 禁止：不使用超出该年龄段理解能力的表达，不使用过度学术化的术语（除非是高中年龄段），不使用超过3层的逻辑嵌套
示例风格："${profile.examplePhrases[0] || ''}"
===语言风格结束===
`.trim()
}

/**
 * 将语言画像指令注入到基础prompt末尾
 */
export function applyLanguageProfile(basePrompt: string, profile: LanguageProfile): string {
  return `${basePrompt}\n\n${profile.promptInstruction}`
}

/** 获取指定年龄的证据密度 */
export function getEvidenceDensityForAge(age: number): EvidenceDensity {
  return getAgeSpec(age).evidence.density
}

/** 获取指定年龄的情感语调 */
export function getEmotionalToneForAge(age: number): LanguageProfile['emotionalTone'] {
  const spec = getAgeSpec(age)
  return spec.emotional
}
