/**
 * 一次性令牌管理模块 v1.0
 * 支持邀请码和专业版令牌的一次性使用机制
 */

// ==================== 类型定义 ====================

export interface OneTimeToken {
  token: string           // 令牌值
  type: 'invite' | 'pro'  // 类型：邀请码或专业版令牌
  createdAt: string       // 创建时间
  usedAt?: string         // 使用时间（使用后记录）
  usedBy?: string         // 使用者信息（手机号或设备ID）
  isValid: boolean        // 是否有效
}

export interface TokenBatch {
  batchId: string         // 批次ID
  type: 'invite' | 'pro'
  count: number           // 生成数量
  createdAt: string
  tokens: OneTimeToken[]
}

// ==================== 存储键 ====================

const STORAGE_KEYS = {
  ONE_TIME_TOKENS: 'wilder_one_time_tokens',
  TOKEN_BATCHES: 'wilder_token_batches',
}

// ==================== 核心函数 ====================

/**
 * 生成随机令牌
 */
function generateRandomToken(prefix: 'INV' | 'PRO'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 排除易混淆字符 I, O, 0, 1
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `${prefix}-${code}`
}

/**
 * 获取所有一次性令牌
 */
export function getAllOneTimeTokens(): OneTimeToken[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ONE_TIME_TOKENS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * 保存令牌列表
 */
function saveTokens(tokens: OneTimeToken[]): void {
  localStorage.setItem(STORAGE_KEYS.ONE_TIME_TOKENS, JSON.stringify(tokens))
}

/**
 * 生成一批一次性令牌
 */
export function generateTokenBatch(
  type: 'invite' | 'pro',
  count: number = 500
): TokenBatch {
  const prefix = type === 'invite' ? 'INV' : 'PRO'
  const tokens: OneTimeToken[] = []
  const existingTokens = new Set(getAllOneTimeTokens().map(t => t.token))

  for (let i = 0; i < count; i++) {
    let token: string
    // 确保不重复
    do {
      token = generateRandomToken(prefix)
    } while (existingTokens.has(token))

    existingTokens.add(token)
    tokens.push({
      token,
      type,
      createdAt: new Date().toISOString(),
      isValid: true,
    })
  }

  // 保存到存储
  const allTokens = getAllOneTimeTokens()
  allTokens.push(...tokens)
  saveTokens(allTokens)

  // 记录批次
  const batch: TokenBatch = {
    batchId: `BATCH-${type.toUpperCase()}-${Date.now()}`,
    type,
    count,
    createdAt: new Date().toISOString(),
    tokens,
  }

  const batches = getTokenBatches()
  batches.push(batch)
  localStorage.setItem(STORAGE_KEYS.TOKEN_BATCHES, JSON.stringify(batches))

  return batch
}

/**
 * 获取所有批次
 */
export function getTokenBatches(): TokenBatch[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TOKEN_BATCHES)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * 验证邀请码（支持原有固定邀请码和一次性邀请码）
 */
export function validateInviteCode(code: string): { valid: boolean; isOneTime?: boolean; error?: string } {
  const trimmedCode = code.trim()

  // 1. 检查固定邀请码
  const envCode = import.meta.env.VITE_FIXED_INVITE_CODE || '12345678'
  if (trimmedCode === envCode.trim()) {
    return { valid: true, isOneTime: false }
  }

  // 2. 检查一次性邀请码
  const tokens = getAllOneTimeTokens()
  const token = tokens.find(t => t.token === trimmedCode && t.type === 'invite')

  if (!token) {
    return { valid: false, error: '邀请码无效' }
  }

  if (!token.isValid) {
    return { valid: false, error: '邀请码已失效（一次性使用）' }
  }

  return { valid: true, isOneTime: true }
}

/**
 * 使用邀请码（标记为已使用）
 */
export function useInviteCode(code: string, usedBy?: string): boolean {
  const trimmedCode = code.trim()

  // 固定邀请码不需要标记
  const envCode = import.meta.env.VITE_FIXED_INVITE_CODE || '12345678'
  if (trimmedCode === envCode.trim()) {
    return true
  }

  // 标记一次性邀请码为已使用
  const tokens = getAllOneTimeTokens()
  const idx = tokens.findIndex(t => t.token === trimmedCode && t.type === 'invite')

  if (idx === -1) return false

  tokens[idx].isValid = false
  tokens[idx].usedAt = new Date().toISOString()
  tokens[idx].usedBy = usedBy || 'unknown'

  saveTokens(tokens)
  return true
}

/**
 * 验证专业版令牌（支持原有固定令牌和一次性令牌）
 */
export function validateProToken(token: string): { valid: boolean; isOneTime?: boolean; error?: string } {
  const trimmedToken = token.trim().toUpperCase()

  // 1. 先检查原有固定令牌
  const FIXED_TOKEN = 'WILDER PRO'
  if (trimmedToken === FIXED_TOKEN) {
    return { valid: true, isOneTime: false }
  }

  // 2. 检查一次性专业版令牌
  const tokens = getAllOneTimeTokens()
  const foundToken = tokens.find(t => t.token.toUpperCase() === trimmedToken && t.type === 'pro')

  if (!foundToken) {
    return { valid: false, error: '令牌无效' }
  }

  if (!foundToken.isValid) {
    return { valid: false, error: '令牌已失效（一次性使用）' }
  }

  return { valid: true, isOneTime: true }
}

/**
 * 使用专业版令牌（标记为已使用）
 */
export function useProToken(token: string, usedBy?: string): boolean {
  const trimmedToken = token.trim().toUpperCase()

  // 固定令牌不需要标记
  const FIXED_TOKEN = 'WILDER PRO'
  if (trimmedToken === FIXED_TOKEN) {
    return true
  }

  // 标记一次性令牌为已使用
  const tokens = getAllOneTimeTokens()
  const idx = tokens.findIndex(t => t.token.toUpperCase() === trimmedToken && t.type === 'pro')

  if (idx === -1) return false

  tokens[idx].isValid = false
  tokens[idx].usedAt = new Date().toISOString()
  tokens[idx].usedBy = usedBy || 'unknown'

  saveTokens(tokens)
  return true
}

/**
 * 获取令牌统计
 */
export function getTokenStats(): {
  invite: { total: number; used: number; available: number }
  pro: { total: number; used: number; available: number }
} {
  const tokens = getAllOneTimeTokens()

  const inviteTokens = tokens.filter(t => t.type === 'invite')
  const proTokens = tokens.filter(t => t.type === 'pro')

  return {
    invite: {
      total: inviteTokens.length,
      used: inviteTokens.filter(t => !t.isValid).length,
      available: inviteTokens.filter(t => t.isValid).length,
    },
    pro: {
      total: proTokens.length,
      used: proTokens.filter(t => !t.isValid).length,
      available: proTokens.filter(t => t.isValid).length,
    },
  }
}

/**
 * 导出未使用的令牌（用于分发）
 */
export function exportAvailableTokens(type: 'invite' | 'pro'): string[] {
  const tokens = getAllOneTimeTokens()
  return tokens
    .filter(t => t.type === type && t.isValid)
    .map(t => t.token)
}

/**
 * 批量导入令牌（用于从外部导入）
 */
export function importTokens(tokens: string[], type: 'invite' | 'pro'): number {
  const existingTokens = new Set(getAllOneTimeTokens().map(t => t.token))
  const newTokens: OneTimeToken[] = []

  for (const token of tokens) {
    const trimmed = token.trim()
    if (trimmed && !existingTokens.has(trimmed)) {
      newTokens.push({
        token: trimmed,
        type,
        createdAt: new Date().toISOString(),
        isValid: true,
      })
      existingTokens.add(trimmed)
    }
  }

  if (newTokens.length > 0) {
    const allTokens = getAllOneTimeTokens()
    allTokens.push(...newTokens)
    saveTokens(allTokens)
  }

  return newTokens.length
}

/**
 * 清除所有一次性令牌（危险操作，仅用于测试）
 */
export function clearAllOneTimeTokens(): void {
  localStorage.removeItem(STORAGE_KEYS.ONE_TIME_TOKENS)
  localStorage.removeItem(STORAGE_KEYS.TOKEN_BATCHES)
}

/**
 * 初始化：如果没有任何一次性令牌，生成默认批次
 */
export function initializeTokens(): void {
  const tokens = getAllOneTimeTokens()
  const hasInvite = tokens.some(t => t.type === 'invite')
  const hasPro = tokens.some(t => t.type === 'pro')

  if (!hasInvite) {
    console.log('[TokenManager] 初始化生成500个一次性邀请码...')
    generateTokenBatch('invite', 500)
  }

  if (!hasPro) {
    console.log('[TokenManager] 初始化生成500个一次性专业版令牌...')
    generateTokenBatch('pro', 500)
  }
}
