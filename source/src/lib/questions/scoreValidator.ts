// ===================================================================
// 得分映射校验规则引擎 v1.0
// 10 条规则（S001-S010），区分 error / warning
// ===================================================================

import type { UnifiedQuestion } from './types'
import {
  ALL_VALID_DIM_KEYS,
  isDimDeprecated,
  getModelAllowedKeys as _getModelAllowedKeys,
} from './dimensionRegistry'

// ========== 类型定义 ==========

export interface ScoreIssue {
  severity: 'error' | 'warning'
  code: string
  message: string
  questionId: string
  optionId?: string
  dimension?: string
}

export interface ScoreValidationResult {
  valid: boolean
  issues: ScoreIssue[]
}

// ========== 校验函数 ==========

/** 校验单道题目的得分映射完整性和合规性 */
export function validateQuestionScores(q: UnifiedQuestion): ScoreValidationResult {
  const issues: ScoreIssue[] = []

  if (q.type === 'choice') {
    validateChoiceScores(q, issues)
  } else if (q.type === 'judgment') {
    validateJudgmentScores(q, issues)
  }

  // S006: wilderMapping 声明的维度至少在一个选项中有正分
  validateWilderMappingCoverage(q, issues)

  return {
    valid: issues.filter(i => i.severity === 'error').length === 0,
    issues,
  }
}

// ========== 选择题校验 ==========

function validateChoiceScores(q: UnifiedQuestion, issues: ScoreIssue[]): void {
  if (!q.options) return

  // allowedKeys reserved for future model-specific key filtering
  // const allowedKeys = getModelAllowedKeys(q.model)

  for (const opt of q.options) {
    // S001: 选项 scores 不能为空
    if (!opt.scores || Object.keys(opt.scores).length === 0) {
      issues.push({
        severity: 'error',
        code: 'S001',
        message: `选项 scores 为空对象`,
        questionId: q.id,
        optionId: opt.id,
      })
      continue
    }

    for (const [key, val] of Object.entries(opt.scores)) {
      // S003: key 必须在合法维度集合中
      if (!ALL_VALID_DIM_KEYS.has(key)) {
        issues.push({
          severity: 'error',
          code: 'S003',
          message: `未知维度 key "${key}"`,
          questionId: q.id,
          optionId: opt.id,
          dimension: key,
        })
      }
      // S010: 废弃维度告警
      else if (isDimDeprecated(key)) {
        issues.push({
          severity: 'warning',
          code: 'S010',
          message: `使用了废弃维度 "${key}"`,
          questionId: q.id,
          optionId: opt.id,
          dimension: key,
        })
      }

      // S008: WILDER 维度得分建议不超过 3
      if (['W', 'I', 'L', 'D', 'E', 'R'].includes(key) && val > 3) {
        issues.push({
          severity: 'warning',
          code: 'S008',
          message: `WILDER 维度 ${key} 得分 ${val} 超过建议最大值 3`,
          questionId: q.id,
          optionId: opt.id,
          dimension: key,
        })
      }

      // S004: BigFive 模型题应使用 E_bf 而非 E
      if (q.model === 'BigFive' && key === 'E') {
        issues.push({
          severity: 'warning',
          code: 'S004',
          message: `BigFive 模型题中使用了 E(表达力)，应使用 E_bf(外向性)`,
          questionId: q.id,
          optionId: opt.id,
          dimension: key,
        })
      }

      // S005: 非 BigFive 模型题不应出现 E_bf
      if (q.model !== 'BigFive' && key === 'E_bf') {
        issues.push({
          severity: 'warning',
          code: 'S005',
          message: `非 BigFive 模型题中出现了 E_bf(外向性)`,
          questionId: q.id,
          optionId: opt.id,
          dimension: key,
        })
      }
    }

    // S009: 同一选项不应同时含 E 和 E_bf
    const scoreKeys = Object.keys(opt.scores)
    if (scoreKeys.includes('E') && scoreKeys.includes('E_bf')) {
      issues.push({
        severity: 'error',
        code: 'S009',
        message: `选项同时包含 E(表达力) 和 E_bf(外向性)`,
        questionId: q.id,
        optionId: opt.id,
      })
    }
  }

  // S007: 选项间至少有一个维度的得分分布不全相同
  validateOptionDiversity(q, issues)
}

// ========== 判断题校验 ==========

function validateJudgmentScores(q: UnifiedQuestion, issues: ScoreIssue[]): void {
  if (!q.scores) return

  // S002: yes/no 不能同时全为 0
  const yesTotal = Object.values(q.scores.yes).reduce((s, v) => s + Math.abs(v), 0)
  const noTotal = Object.values(q.scores.no).reduce((s, v) => s + Math.abs(v), 0)
  if (yesTotal === 0 && noTotal === 0) {
    issues.push({
      severity: 'error',
      code: 'S002',
      message: `判断题 yes 和 no 分数全为 0`,
      questionId: q.id,
    })
  }

  // 检查 key 合法性
  for (const scoreMap of [q.scores.yes, q.scores.no]) {
    for (const key of Object.keys(scoreMap)) {
      if (!ALL_VALID_DIM_KEYS.has(key)) {
        issues.push({
          severity: 'error',
          code: 'S003',
          message: `未知维度 key "${key}"`,
          questionId: q.id,
          dimension: key,
        })
      } else if (isDimDeprecated(key)) {
        issues.push({
          severity: 'warning',
          code: 'S010',
          message: `使用了废弃维度 "${key}"`,
          questionId: q.id,
          dimension: key,
        })
      }
    }
  }
}

// ========== 辅助校验 ==========

function validateWilderMappingCoverage(q: UnifiedQuestion, issues: ScoreIssue[]): void {
  if (!q.wilderMapping || q.wilderMapping.length === 0) return

  const scoredDims = new Set<string>()

  if (q.type === 'choice' && q.options) {
    for (const opt of q.options) {
      for (const [k, v] of Object.entries(opt.scores)) {
        if (v > 0) scoredDims.add(k)
      }
    }
  } else if (q.type === 'judgment' && q.scores) {
    for (const [k, v] of Object.entries(q.scores.yes)) {
      if (v > 0) scoredDims.add(k)
    }
    for (const [k, v] of Object.entries(q.scores.no)) {
      if (v > 0) scoredDims.add(k)
    }
  }

  for (const wm of q.wilderMapping) {
    if (!scoredDims.has(wm)) {
      issues.push({
        severity: 'warning',
        code: 'S006',
        message: `wilderMapping 声明了 ${wm}，但无选项贡献正分`,
        questionId: q.id,
        dimension: wm,
      })
    }
  }
}

function validateOptionDiversity(q: UnifiedQuestion, issues: ScoreIssue[]): void {
  if (!q.options || q.options.length < 2) return

  // 收集所有维度
  const allDims = new Set<string>()
  for (const opt of q.options) {
    Object.keys(opt.scores).forEach(k => allDims.add(k))
  }

  // 检查是否存在至少一个维度，其得分在选项间有差异
  let hasDiversity = false
  for (const dim of allDims) {
    const scores = q.options.map(o => o.scores[dim] || 0)
    const uniqueScores = new Set(scores)
    if (uniqueScores.size > 1) {
      hasDiversity = true
      break
    }
  }

  if (!hasDiversity) {
    issues.push({
      severity: 'warning',
      code: 'S007',
      message: `所有选项在所有维度上得分完全相同，无区分度`,
      questionId: q.id,
    })
  }
}
