// ===================================================================
// GROWMATE AI 结果去重引擎 v1.0.0
// 基于语义相似度的响应去重，防止重复内容输出
// 支持精确匹配 + 模糊匹配 + 滑动窗口历史
// ===================================================================

import type { LLMResponse } from './types'

// ============================================================
// 类型定义
// ============================================================

export interface DedupConfig {
  /** 精确匹配窗口大小（最近 N 条） */
  exactWindowSize: number
  /** 模糊匹配相似度阈值 (0-1) */
  fuzzyThreshold: number
  /** 滑动窗口历史记录总数上限 */
  historyLimit: number
  /** 是否启用模糊匹配 */
  enableFuzzy: boolean
  /** 是否区分模型 */
  modelAware: boolean
}

export interface DedupResult {
  /** 是否重复 */
  isDuplicate: boolean
  /** 重复类型 */
  type: 'none' | 'exact' | 'fuzzy'
  /** 相似度 (0-1) */
  similarity: number
  /** 匹配的原文 */
  matchedText: string | null
}

export interface DedupHistoryEntry {
  id: string
  content: string
  model: string
  timestamp: number
  fingerprint: string
}

export const DEFAULT_DEDUP_CONFIG: DedupConfig = {
  exactWindowSize: 5,
  fuzzyThreshold: 0.85,
  historyLimit: 100,
  enableFuzzy: true,
  modelAware: true,
}

// ============================================================
// 文本相似度计算
// ============================================================

/** 计算两个字符串的 Jaccard 相似度 */
export function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(tokenize(a))
  const setB = new Set(tokenize(b))

  const intersection = new Set([...setA].filter(x => setB.has(x)))
  const union = new Set([...setA, ...setB])

  return union.size === 0 ? 0 : intersection.size / union.size
}

/** 计算余弦相似度（基于字符 n-gram） */
export function cosineSimilarity(a: string, b: string): number {
  const n = 3
  const gramsA = getNGrams(a, n)
  const gramsB = getNGrams(b, n)

  const allGrams = new Set([...Object.keys(gramsA), ...Object.keys(gramsB)])

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (const gram of allGrams) {
    const va = gramsA[gram] || 0
    const vb = gramsB[gram] || 0
    dotProduct += va * vb
    normA += va * va
    normB += vb * vb
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  return denominator === 0 ? 0 : dotProduct / denominator
}

/** 综合相似度（加权平均） */
function combinedSimilarity(a: string, b: string): number {
  const jaccard = jaccardSimilarity(a, b)
  const cosine = cosineSimilarity(a, b)
  return 0.4 * jaccard + 0.6 * cosine
}

/** 文本分词（中文按字符，英文按单词） */
function tokenize(text: string): string[] {
  // 移除标点和空白，转为小写
  const cleaned = text.toLowerCase().replace(/[^\w\u4e00-\u9fff]/g, '')
  // 中文字符逐个分割
  const chineseChars = cleaned.match(/[\u4e00-\u9fff]/g) || []
  // 英文/数字连续分割
  const otherTokens = cleaned.match(/[a-z0-9]+/g) || []
  return [...chineseChars, ...otherTokens]
}

/** 获取 n-gram */
function getNGrams(text: string, n: number): Record<string, number> {
  const cleaned = text.toLowerCase().replace(/\s+/g, '')
  const grams: Record<string, number> = {}

  for (let i = 0; i <= cleaned.length - n; i++) {
    const gram = cleaned.slice(i, i + n)
    grams[gram] = (grams[gram] || 0) + 1
  }

  return grams
}

// ============================================================
// 内容指纹
// ============================================================

/** 生成内容指纹（用于快速精确匹配） */
export function contentFingerprint(content: string): string {
  const normalized = content
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\u4e00-\u9fff\s]/g, '')
    .trim()

  let hash = 5381
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) + hash) + normalized.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash).toString(36) + '_' + normalized.length.toString(36)
}

// ============================================================
// AIDedupEngine 类
// ============================================================

export class AIDedupEngine {
  private config: DedupConfig
  private history: DedupHistoryEntry[] = []
  private fingerprints: Set<string> = new Set()

  constructor(config: Partial<DedupConfig> = {}) {
    this.config = { ...DEFAULT_DEDUP_CONFIG, ...config }
  }

  // ============================================================
  // 核心方法：检查重复
  // ============================================================

  check(response: LLMResponse, model?: string): DedupResult {
    const content = response.content.trim()
    if (!content) {
      return { isDuplicate: false, type: 'none', similarity: 0, matchedText: null }
    }

    // 1. 精确匹配（基于指纹）
    const fp = contentFingerprint(content)
    const recentFingerprints = this.getRecentFingerprints()

    if (recentFingerprints.has(fp)) {
      return {
        isDuplicate: true,
        type: 'exact',
        similarity: 1.0,
        matchedText: this.findMatchedText(fp),
      }
    }

    // 2. 模糊匹配（基于语义相似度）
    if (this.config.enableFuzzy) {
      const recentContents = this.getRecentContents(model)
      for (const entry of recentContents) {
        const sim = combinedSimilarity(content, entry.content)
        if (sim >= this.config.fuzzyThreshold) {
          return {
            isDuplicate: true,
            type: 'fuzzy',
            similarity: sim,
            matchedText: entry.content,
          }
        }
      }
    }

    return { isDuplicate: false, type: 'none', similarity: 0, matchedText: null }
  }

  // ============================================================
  // 核心方法：记录响应
  // ============================================================

  record(response: LLMResponse, model?: string): void {
    const content = response.content.trim()
    if (!content) return

    const entry: DedupHistoryEntry = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      content,
      model: model || response.model || 'unknown',
      timestamp: Date.now(),
      fingerprint: contentFingerprint(content),
    }

    // 添加到历史记录
    this.history.unshift(entry)
    this.fingerprints.add(entry.fingerprint)

    // 限制历史记录大小
    if (this.history.length > this.config.historyLimit) {
      const removed = this.history.pop()
      if (removed) {
        // 只有当该指纹没有其他条目时才移除
        if (!this.history.some(e => e.fingerprint === removed.fingerprint)) {
          this.fingerprints.delete(removed.fingerprint)
        }
      }
    }
  }

  // ============================================================
  // 批量去重
  // ============================================================

  deduplicateBatch(responses: LLMResponse[], model?: string): LLMResponse[] {
    const results: LLMResponse[] = []

    for (const response of responses) {
      const checkResult = this.check(response, model)
      if (!checkResult.isDuplicate) {
        results.push(response)
        this.record(response, model)
      }
    }

    return results
  }

  // ============================================================
  // 获取最近 N 个不重复的响应
  // ============================================================

  getUniqueResponses(count: number = 3): DedupHistoryEntry[] {
    const seen = new Set<string>()
    const unique: DedupHistoryEntry[] = []

    for (const entry of this.history) {
      if (!seen.has(entry.fingerprint)) {
        seen.add(entry.fingerprint)
        unique.push(entry)
        if (unique.length >= count) break
      }
    }

    return unique
  }

  // ============================================================
  // 清空历史
  // ============================================================

  clear(): void {
    this.history = []
    this.fingerprints.clear()
  }

  // ============================================================
  // 统计信息
  // ============================================================

  getHistorySize(): number {
    return this.history.length
  }

  getFingerprintCount(): number {
    return this.fingerprints.size
  }

  // ============================================================
  // 内部方法
  // ============================================================

  private getRecentFingerprints(): Set<string> {
    const recent = new Set<string>()
    const limit = Math.min(this.config.exactWindowSize, this.history.length)
    for (let i = 0; i < limit; i++) {
      recent.add(this.history[i].fingerprint)
    }
    return recent
  }

  private findMatchedText(fingerprint: string): string | null {
    for (let i = 0; i < this.config.exactWindowSize && i < this.history.length; i++) {
      if (this.history[i].fingerprint === fingerprint) {
        return this.history[i].content
      }
    }
    return null
  }

  private getRecentContents(model?: string): DedupHistoryEntry[] {
    let entries = this.history.slice(0, this.config.exactWindowSize * 3)
    if (this.config.modelAware && model) {
      entries = entries.filter(e => e.model === model)
    }
    return entries
  }
}

// ============================================================
// 工厂函数与单例
// ============================================================

let _dedupInstance: AIDedupEngine | null = null

/** 创建去重引擎实例 */
export function createAIDedupEngine(config?: Partial<DedupConfig>): AIDedupEngine {
  return new AIDedupEngine(config)
}

/** 获取全局去重单例 */
export function getDefaultDedupEngine(): AIDedupEngine {
  if (!_dedupInstance) {
    _dedupInstance = new AIDedupEngine()
  }
  return _dedupInstance
}

// ============================================================
// 便捷函数：一体化检查并记录
// ============================================================

/** 检查是否重复，如果不重复则记录并返回 true */
export function checkAndRecord(
  engine: AIDedupEngine,
  response: LLMResponse,
  model?: string,
): boolean {
  const result = engine.check(response, model)
  if (!result.isDuplicate) {
    engine.record(response, model)
    return true
  }
  return false
}
