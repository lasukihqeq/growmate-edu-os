// ===================================================================
// 万题库注册中心 v1.0
// 统一管理所有题库分片的元数据索引、懒加载调度和缓存
// 对外提供统一的题目查询接口
// ===================================================================

import type {
  UnifiedQuestion, QuestionChunkMeta, QuestionFilter,
  AgeGroupKey, QuestionModel,
} from './types'
import { ageToGroup, matchesFilter } from './types'

// ========== 分片缓存 ==========

const chunkCache = new Map<string, UnifiedQuestion[]>()

// ========== 分片注册表 ==========

const registeredChunks: QuestionChunkMeta[] = []

/** 注册一个题库分片 */
export function registerChunk(meta: QuestionChunkMeta): void {
  // 避免重复注册
  if (registeredChunks.some(c => c.chunkId === meta.chunkId)) return
  registeredChunks.push(meta)
}

/** 批量注册分片 */
export function registerChunks(metas: QuestionChunkMeta[]): void {
  for (const meta of metas) {
    registerChunk(meta)
  }
}

// ========== 懒加载 ==========

/** 加载单个分片并缓存 */
async function loadChunk(meta: QuestionChunkMeta): Promise<UnifiedQuestion[]> {
  const cached = chunkCache.get(meta.chunkId)
  if (cached) return cached

  const questions = await meta.loader()
  chunkCache.set(meta.chunkId, questions)
  return questions
}

// ========== 查询接口 ==========

/** 获取满足过滤条件的所有分片元数据（不加载内容） */
function getRelevantChunks(filter: QuestionFilter): QuestionChunkMeta[] {
  return registeredChunks.filter(chunk => {
    // 年龄组过滤
    if (filter.age !== undefined) {
      const targetGroup = ageToGroup(filter.age)
      if (chunk.ageGroup !== targetGroup) return false
    }
    if (filter.ageGroups && !filter.ageGroups.includes(chunk.ageGroup)) return false

    // 模型过滤
    if (filter.models && !filter.models.includes(chunk.model)) return false

    // 类型过滤（粗筛：分片至少含有该类型题目）
    if (filter.type) {
      if (filter.type === 'choice' && chunk.typeDistribution.choice === 0) return false
      if (filter.type === 'judgment' && chunk.typeDistribution.judgment === 0) return false
    }

    return true
  })
}

/** 异步获取满足过滤条件的题目列表 */
export async function getQuestions(filter: QuestionFilter = {}): Promise<UnifiedQuestion[]> {
  const relevantChunks = getRelevantChunks(filter)

  // 并行加载所有相关分片
  const chunkResults = await Promise.all(relevantChunks.map(loadChunk))

  // 合并并过滤
  const allQuestions = chunkResults.flat()
  return allQuestions.filter(q => matchesFilter(q, filter))
}

/** 根据年龄获取全部可用题目 */
export async function getQuestionsByAge(age: number): Promise<UnifiedQuestion[]> {
  return getQuestions({ age })
}

/** 根据年龄 + 模型列表获取题目 */
export async function getQuestionsByAgeAndModels(
  age: number,
  models: QuestionModel[]
): Promise<UnifiedQuestion[]> {
  return getQuestions({ age, models })
}

/** 根据ID获取单道题目（从缓存中查找） */
export function getQuestionById(id: string): UnifiedQuestion | undefined {
  for (const questions of chunkCache.values()) {
    const found = questions.find(q => q.id === id)
    if (found) return found
  }
  return undefined
}

// ========== 统计接口 ==========

/** 获取注册的分片总数 */
export function getChunkCount(): number {
  return registeredChunks.length
}

/** 获取总题目数（从元数据统计，不需要加载） */
export function getTotalQuestionCount(): number {
  return registeredChunks.reduce((sum, c) => sum + c.count, 0)
}

/** 按模型统计题目数 */
export function getCountByModel(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const chunk of registeredChunks) {
    counts[chunk.model] = (counts[chunk.model] || 0) + chunk.count
  }
  return counts
}

/** 按年龄组统计题目数 */
export function getCountByAgeGroup(): Record<AgeGroupKey, number> {
  const counts: Record<string, number> = {}
  for (const chunk of registeredChunks) {
    counts[chunk.ageGroup] = (counts[chunk.ageGroup] || 0) + chunk.count
  }
  return counts as Record<AgeGroupKey, number>
}

/** 获取已加载的分片数 */
export function getLoadedChunkCount(): number {
  return chunkCache.size
}

/** 获取已缓存的题目总数 */
export function getCachedQuestionCount(): number {
  let total = 0
  for (const questions of chunkCache.values()) {
    total += questions.length
  }
  return total
}

// ========== 预加载 ==========

/** 预加载指定年龄的所有分片 */
export async function preloadForAge(age: number): Promise<void> {
  const targetGroup = ageToGroup(age)
  const chunks = registeredChunks.filter(c => c.ageGroup === targetGroup)
  await Promise.all(chunks.map(loadChunk))
}

/** 预加载全部分片（慎用，内存开销大） */
export async function preloadAll(): Promise<void> {
  await Promise.all(registeredChunks.map(loadChunk))
}

// ========== 清理 ==========

/** 清除缓存 */
export function clearCache(): void {
  chunkCache.clear()
}

/** 清除指定年龄组的缓存 */
export function clearCacheForAgeGroup(ageGroup: AgeGroupKey): void {
  for (const chunk of registeredChunks) {
    if (chunk.ageGroup === ageGroup) {
      chunkCache.delete(chunk.chunkId)
    }
  }
}

// ========== 计算最大得分 ==========

/** 从已加载的题目计算各维度最大可能得分 */
export function computeMaxScoresFromQuestions(questions: UnifiedQuestion[]): Record<string, number> {
  const allKeys = new Set<string>()
  for (const q of questions) {
    if (q.type === 'choice' && q.options) {
      for (const opt of q.options) {
        Object.keys(opt.scores).forEach(k => allKeys.add(k))
      }
    } else if (q.type === 'judgment' && q.scores) {
      Object.keys(q.scores.yes).forEach(k => allKeys.add(k))
      Object.keys(q.scores.no).forEach(k => allKeys.add(k))
    }
  }

  const max: Record<string, number> = {}
  for (const k of allKeys) max[k] = 0

  for (const q of questions) {
    if (q.type === 'choice' && q.options) {
      for (const k of allKeys) {
        const best = Math.max(...q.options.map(opt => (opt.scores[k] as number) || 0))
        max[k] += best
      }
    } else if (q.type === 'judgment' && q.scores) {
      for (const k of allKeys) {
        const yesScore = (q.scores.yes[k] as number) || 0
        const noScore = (q.scores.no[k] as number) || 0
        max[k] += Math.max(yesScore, noScore)
      }
    }
  }

  return max
}
