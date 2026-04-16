// ===================================================================
// SmartQuestion — 题目独立模块封装 v1.0
// 装饰器模式包装 UnifiedQuestion，提供自描述 + 自校验能力
// ===================================================================

import type { UnifiedQuestion, QuestionOption } from './types'
import {
  ALL_VALID_DIM_KEYS as _ALL_VALID_DIM_KEYS,
  WILDER_DIM_KEYS,
  LAYER2_DIM_KEYS,
  isDimValid,
  isDimDeprecated,
} from './dimensionRegistry'

// ========== 校验结果类型 ==========

export interface ValidationError {
  code: string
  message: string
  field?: string
}

export interface ValidationWarning {
  code: string
  message: string
  field?: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

// ========== SmartQuestion 封装类 ==========

const _wilderSet = new Set<string>(WILDER_DIM_KEYS)
const _layer2Set = new Set<string>(LAYER2_DIM_KEYS)

export class SmartQuestion {
  readonly raw: UnifiedQuestion

  private _dimensions: string[] | null = null
  private _maxScores: Record<string, number> | null = null

  private constructor(q: UnifiedQuestion) {
    this.raw = q
  }

  // ========== 静态工厂方法 ==========

  static wrap(q: UnifiedQuestion): SmartQuestion {
    return new SmartQuestion(q)
  }

  static wrapBatch(qs: UnifiedQuestion[]): SmartQuestion[] {
    return qs.map(q => new SmartQuestion(q))
  }

  // ========== 自描述方法 ==========

  /** 提取所有涉及的得分维度 key */
  getDimensions(): string[] {
    if (this._dimensions) return this._dimensions
    const dims = new Set<string>()
    if (this.raw.type === 'choice' && this.raw.options) {
      for (const opt of this.raw.options) {
        Object.keys(opt.scores).forEach(k => dims.add(k))
      }
    } else if (this.raw.type === 'judgment' && this.raw.scores) {
      Object.keys(this.raw.scores.yes).forEach(k => dims.add(k))
      Object.keys(this.raw.scores.no).forEach(k => dims.add(k))
    }
    this._dimensions = [...dims]
    return this._dimensions
  }

  /** 仅 WILDER 六维 */
  getWilderDimensions(): string[] {
    return this.getDimensions().filter(d => _wilderSet.has(d))
  }

  /** 仅 Layer2 维度 */
  getLayer2Dimensions(): string[] {
    return this.getDimensions().filter(d => _layer2Set.has(d))
  }

  /** 非 WILDER/Layer2 的模型专属维度 */
  getModelDimensions(): string[] {
    return this.getDimensions().filter(d => !_wilderSet.has(d) && !_layer2Set.has(d))
  }

  /** 某维度的最大可得分 */
  getMaxScore(dim: string): number {
    return this.getMaxScores()[dim] || 0
  }

  /** 所有维度的最大分字典（缓存） */
  getMaxScores(): Record<string, number> {
    if (this._maxScores) return this._maxScores
    const max: Record<string, number> = {}

    if (this.raw.type === 'choice' && this.raw.options) {
      for (const opt of this.raw.options) {
        for (const [k, v] of Object.entries(opt.scores)) {
          max[k] = Math.max(max[k] || 0, v)
        }
      }
    } else if (this.raw.type === 'judgment' && this.raw.scores) {
      for (const [k, v] of Object.entries(this.raw.scores.yes)) {
        max[k] = Math.max(max[k] || 0, v)
      }
      for (const [k, v] of Object.entries(this.raw.scores.no)) {
        max[k] = Math.max(max[k] || 0, v)
      }
    }

    this._maxScores = max
    return max
  }

  /** 选项数（选择题返回选项数，判断题返回 2） */
  getOptionCount(): number {
    if (this.raw.type === 'choice' && this.raw.options) {
      return this.raw.options.length
    }
    return this.raw.type === 'judgment' ? 2 : 0
  }

  // ========== 自校验方法 ==========

  /** 完整校验 */
  validate(): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // V001: ID 非空
    if (!this.raw.id || this.raw.id.trim() === '') {
      errors.push({ code: 'V001', message: '题目 ID 为空', field: 'id' })
    }

    // V002: 选择题必须有选项
    if (this.raw.type === 'choice') {
      if (!this.raw.options || this.raw.options.length < 2) {
        errors.push({
          code: 'V002',
          message: `选择题 ${this.raw.id} 选项数不足（需≥2，实际${this.raw.options?.length || 0}）`,
          field: 'options',
        })
      } else {
        this._validateChoiceOptions(this.raw.options, errors, warnings)
      }
    }

    // V003: 判断题必须有 scores
    if (this.raw.type === 'judgment') {
      if (!this.raw.scores || !this.raw.scores.yes || !this.raw.scores.no) {
        errors.push({
          code: 'V003',
          message: `判断题 ${this.raw.id} 缺少 scores.yes 或 scores.no`,
          field: 'scores',
        })
      } else {
        this._validateJudgmentScores(this.raw.scores, warnings)
      }
    }

    // V004: wilderMapping 声明的维度至少在 scores 中出现一次
    if (this.raw.wilderMapping && this.raw.wilderMapping.length > 0) {
      const dims = this.getDimensions()
      for (const wm of this.raw.wilderMapping) {
        if (_wilderSet.has(wm) && !dims.includes(wm)) {
          warnings.push({
            code: 'V004',
            message: `${this.raw.id}: wilderMapping 声明了 ${wm}，但无选项贡献该维度分数`,
            field: 'wilderMapping',
          })
        }
      }
    }

    // V005: difficulty 范围
    if (this.raw.difficulty < 1 || this.raw.difficulty > 5) {
      warnings.push({
        code: 'V005',
        message: `${this.raw.id}: difficulty=${this.raw.difficulty} 超出 1-5 范围`,
        field: 'difficulty',
      })
    }

    // V006: discrimination 范围
    if (this.raw.discrimination < 0 || this.raw.discrimination > 1) {
      warnings.push({
        code: 'V006',
        message: `${this.raw.id}: discrimination=${this.raw.discrimination} 超出 0-1 范围`,
        field: 'discrimination',
      })
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // ========== 内部校验辅助 ==========

  private _validateChoiceOptions(
    options: QuestionOption[],
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    for (const opt of options) {
      // 检查选项 ID 非空
      if (!opt.id) {
        errors.push({
          code: 'V010',
          message: `${this.raw.id}: 存在空选项 ID`,
          field: `options.${opt.id}`,
        })
      }

      // 检查 scores 不为空
      if (!opt.scores || Object.keys(opt.scores).length === 0) {
        warnings.push({
          code: 'V011',
          message: `${this.raw.id} 选项 ${opt.id}: scores 为空`,
          field: `options.${opt.id}.scores`,
        })
        continue
      }

      // 检查 scores key 合法性
      for (const key of Object.keys(opt.scores)) {
        if (!isDimValid(key)) {
          errors.push({
            code: 'V012',
            message: `${this.raw.id} 选项 ${opt.id}: 未知维度 key "${key}"`,
            field: `options.${opt.id}.scores.${key}`,
          })
        } else if (isDimDeprecated(key)) {
          warnings.push({
            code: 'V013',
            message: `${this.raw.id} 选项 ${opt.id}: 使用了废弃维度 "${key}"`,
            field: `options.${opt.id}.scores.${key}`,
          })
        }
      }

      // 检查同一选项不应同时含 E 和 E_bf
      const scoreKeys = Object.keys(opt.scores)
      if (scoreKeys.includes('E') && scoreKeys.includes('E_bf')) {
        errors.push({
          code: 'V014',
          message: `${this.raw.id} 选项 ${opt.id}: 同时包含 E(表达力) 和 E_bf(外向性)，请明确区分`,
          field: `options.${opt.id}.scores`,
        })
      }
    }
  }

  private _validateJudgmentScores(
    scores: { yes: Record<string, number>; no: Record<string, number> },
    warnings: ValidationWarning[]
  ): void {
    const allKeys = new Set([...Object.keys(scores.yes), ...Object.keys(scores.no)])

    // 检查 key 合法性
    for (const key of allKeys) {
      if (!isDimValid(key)) {
        warnings.push({
          code: 'V020',
          message: `${this.raw.id}: 判断题 scores 中未知维度 key "${key}"`,
          field: `scores.${key}`,
        })
      } else if (isDimDeprecated(key)) {
        warnings.push({
          code: 'V021',
          message: `${this.raw.id}: 判断题 scores 中使用废弃维度 "${key}"`,
          field: `scores.${key}`,
        })
      }
    }

    // 检查 yes 和 no 不应全为 0
    const yesTotal = Object.values(scores.yes).reduce((s, v) => s + Math.abs(v), 0)
    const noTotal = Object.values(scores.no).reduce((s, v) => s + Math.abs(v), 0)
    if (yesTotal === 0 && noTotal === 0) {
      warnings.push({
        code: 'V022',
        message: `${this.raw.id}: 判断题 yes 和 no 分数全为 0，无区分度`,
        field: 'scores',
      })
    }
  }
}
