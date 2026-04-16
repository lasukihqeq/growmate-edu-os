// ===================================================================
// 用户指纹与测试-重测一致性机制 v1.0
// 基于用户稳定标识生成确定性种子
// 保证同一用户多次测评的核心题重叠率 > 60%
// ===================================================================

/** 简单的字符串哈希（FNV-1a变体） */
function fnv1aHash(str: string): number {
  let hash = 2166136261
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0 // 转为无符号32位整数
}

/**
 * 基于用户标识生成确定性种子
 * 输入相同的标识信息，总是生成相同的种子
 */
export function generateSessionSeed(
  studentName: string,
  studentAge: number,
  phoneLastFour?: string
): number {
  const identity = `${studentName}|${studentAge}|${phoneLastFour || '0000'}`
  return fnv1aHash(identity)
}

/** 带种子的伪随机数生成器 */
export function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/**
 * 计算两次测评结果的皮尔逊相关系数
 * 用于评估测试-重测一致性
 */
export function pearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0

  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((a, xi, i) => a + xi * y[i], 0)
  const sumX2 = x.reduce((a, xi) => a + xi * xi, 0)
  const sumY2 = y.reduce((a, yi) => a + yi * yi, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  )

  if (denominator === 0) return 0
  return numerator / denominator
}

/**
 * 计算两个题目集的重叠率
 */
export function questionOverlapRate(set1: string[], set2: string[]): number {
  if (set1.length === 0 || set2.length === 0) return 0
  const s1 = new Set(set1)
  const overlap = set2.filter(id => s1.has(id)).length
  return overlap / Math.max(set1.length, set2.length)
}
