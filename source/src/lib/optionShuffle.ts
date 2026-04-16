/**
 * 确定性选项随机化工具
 * 基于 Fisher-Yates 算法 + 种子哈希，保证同一用户看到相同的选项顺序
 */

/** 简易字符串哈希 → 32位整数种子 */
function hashSeed(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return hash >>> 0
}

/** 基于种子的伪随机数生成器 (Mulberry32) */
function mulberry32(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fisher-Yates 洗牌（确定性） */
function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 对选项数组进行确定性随机化
 * @param options  原始选项数组
 * @param questionId  题目ID（保证每题随机序不同）
 * @param sessionSeed  会话种子（如 studentName+phone）
 * @returns 打乱顺序后的选项数组（不修改原数组）
 */
export function shuffleOptions<T>(
  options: T[],
  questionId: string,
  sessionSeed: string,
): T[] {
  const seed = hashSeed(`${sessionSeed}::${questionId}`)
  const rng = mulberry32(seed)
  return seededShuffle(options, rng)
}

/**
 * 检测选项文本是否存在重复
 * @param optionTexts 所有选项文本的数组
 * @returns 重复的文本列表（空数组表示无重复）
 */
export function findDuplicateOptions(optionTexts: string[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const text of optionTexts) {
    const normalized = text.trim().toLowerCase()
    if (seen.has(normalized)) {
      duplicates.add(normalized)
    }
    seen.add(normalized)
  }
  return [...duplicates]
}
