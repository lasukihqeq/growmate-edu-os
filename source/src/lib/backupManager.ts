/**
 * 跨设备备份与恢复模块
 * 支持将数据备份到文件，实现跨设备迁移和恢复
 */

import type { StudentInfo } from '../types'

// ==================== 类型定义 ====================

export interface BackupMetadata {
  version: string
  createdAt: string
  deviceId: string
  deviceName: string
  appName: string
  backupType: 'full' | 'partial'
  checksum?: string
}

export interface AssessmentBackup {
  id: string | number
  studentInfo: StudentInfo
  assessmentScores: Record<string, unknown>
  dynamicReport?: Record<string, unknown>
  talentType?: string
  profileCode?: string
  durationSeconds?: number
  createdAt: string
  synced: boolean
}

export interface DraftBackup {
  stage: string
  studentInfo?: StudentInfo
  onboarding?: Record<string, unknown>
  multiModal?: Record<string, unknown>
  chat?: Record<string, unknown>
  savedAt: number
}

export interface TokenBackup {
  oneTimeTokens: unknown[]
  tokenBatches: unknown[]
}

export interface UserBackup {
  id: string
  phone: string
  role: 'admin' | 'parent'
  childName?: string
  createdAt: string
}

export interface ParentBackup {
  id: string
  phone: string
  role: 'admin' | 'parent'
  childName?: string
  createdAt: string
}

export interface FullBackupData {
  metadata: BackupMetadata
  assessments: AssessmentBackup[]
  draft: DraftBackup | null
  tokens: TokenBackup
  settings: Record<string, unknown>
  user?: UserBackup | null
  parents?: ParentBackup[] | null
}

export interface BackupRestoreResult {
  success: boolean
  restored: {
    assessments: number
    draft: boolean
    tokens: boolean
    settings: boolean
    user: boolean
    parents: number
  }
  errors: string[]
  warnings: string[]
}

// ==================== 常量 ====================

const BACKUP_VERSION = '1.1.0'
const STORAGE_KEYS = {
  ASSESSMENTS: 'wilder_assessments',
  DRAFT: 'wilder_assessment_draft',
  ONE_TIME_TOKENS: 'wilder_one_time_tokens',
  TOKEN_BATCHES: 'wilder_token_batches',
  ADMIN_TOKEN: 'growmate_admin_token',
  DEPLOYMENT_STATUS: 'wilder_deployment_status',
  USER: 'wilder_user',
  PARENTS: 'wilder_parents',
}

// ==================== 设备信息 ====================

/**
 * 生成设备唯一标识
 */
function generateDeviceId(): string {
  const stored = localStorage.getItem('wilder_device_id')
  if (stored) return stored

  const id = `device_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
  localStorage.setItem('wilder_device_id', id)
  return id
}

/**
 * 获取设备名称
 */
function getDeviceName(): string {
  const ua = navigator.userAgent
  let name = '未知设备'

  if (/iPhone/.test(ua)) name = 'iPhone'
  else if (/iPad/.test(ua)) name = 'iPad'
  else if (/Android/.test(ua)) name = 'Android设备'
  else if (/Mac/.test(ua)) name = 'Mac'
  else if (/Windows/.test(ua)) name = 'Windows PC'
  else if (/Linux/.test(ua)) name = 'Linux PC'

  return name
}

// ==================== 备份核心函数 ====================

/**
 * 创建完整备份
 */
export function createFullBackup(): FullBackupData {
  const metadata: BackupMetadata = {
    version: BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    deviceId: generateDeviceId(),
    deviceName: getDeviceName(),
    appName: 'GROWMATE科创教育入学测评',
    backupType: 'full',
  }

  // 收集测评数据
  const assessments = collectAssessments()

  // 收集草稿数据
  const draft = collectDraft()

  // 收集令牌数据
  const tokens = collectTokens()

  // 收集设置
  const settings = collectSettings()

  // 收集用户数据
  const user = collectUser()
  const parents = collectParents()

  const backup: FullBackupData = {
    metadata,
    assessments,
    draft,
    tokens,
    settings,
    user,
    parents,
  }

  // 计算校验和
  backup.metadata.checksum = calculateChecksum(backup)

  return backup
}

/**
 * 收集测评数据
 */
function collectAssessments(): AssessmentBackup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS)
    if (!raw) return []

    const data = JSON.parse(raw)
    return data.map((item: Record<string, unknown>) => ({
      id: item.id as string | number,
      studentInfo: item.studentInfo as StudentInfo,
      assessmentScores: item.assessmentScores as Record<string, unknown>,
      dynamicReport: item.dynamicReport as Record<string, unknown>,
      talentType: item.talentType as string,
      profileCode: item.profileCode as string,
      durationSeconds: item.durationSeconds as number,
      createdAt: item.createdAt as string,
      synced: item.synced as boolean,
    }))
  } catch {
    return []
  }
}

/**
 * 收集草稿数据
 */
function collectDraft(): DraftBackup | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT)
    if (!raw) return null

    const data = JSON.parse(raw)
    return {
      stage: data.stage,
      studentInfo: data.studentInfo,
      onboarding: data.onboarding,
      multiModal: data.multiModal,
      chat: data.chat,
      savedAt: data.savedAt,
    }
  } catch {
    return null
  }
}

/**
 * 收集令牌数据
 */
function collectTokens(): TokenBackup {
  try {
    const oneTimeTokens = localStorage.getItem(STORAGE_KEYS.ONE_TIME_TOKENS)
    const tokenBatches = localStorage.getItem(STORAGE_KEYS.TOKEN_BATCHES)

    return {
      oneTimeTokens: oneTimeTokens ? JSON.parse(oneTimeTokens) : [],
      tokenBatches: tokenBatches ? JSON.parse(tokenBatches) : [],
    }
  } catch {
    return { oneTimeTokens: [], tokenBatches: [] }
  }
}

/**
 * 收集设置
 */
function collectSettings(): Record<string, unknown> {
  const settings: Record<string, unknown> = {}

  try {
    const adminToken = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)
    if (adminToken) settings.adminToken = adminToken

    const deploymentStatus = localStorage.getItem(STORAGE_KEYS.DEPLOYMENT_STATUS)
    if (deploymentStatus) settings.deploymentStatus = JSON.parse(deploymentStatus)
  } catch {
    // 忽略错误
  }

  return settings
}

/**
 * 收集用户信息（不含密码）
 */
function collectUser(): UserBackup | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER)
    if (!raw) return null

    const data = JSON.parse(raw)
    return {
      id: data.id,
      phone: data.phone,
      role: data.role,
      childName: data.childName,
      createdAt: data.createdAt,
    }
  } catch {
    return null
  }
}

/**
 * 收集家长账号（排除密码字段）
 */
function collectParents(): ParentBackup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PARENTS)
    if (!raw) return []

    const data = JSON.parse(raw)
    return data.map((item: Record<string, unknown>) => ({
      id: item.id as string,
      phone: item.phone as string,
      role: item.role as 'admin' | 'parent',
      childName: item.childName as string | undefined,
      createdAt: item.createdAt as string,
    }))
  } catch {
    return []
  }
}

/**
 * 计算校验和
 */
function calculateChecksum(data: FullBackupData): string {
  const str = JSON.stringify({
    assessments: data.assessments.length,
    draft: data.draft ? 1 : 0,
    tokens: data.tokens.oneTimeTokens.length,
    user: data.user ? 1 : 0,
    parents: data.parents?.length || 0,
  })
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

// ==================== 导出备份 ====================

export interface ExportOptions {
  filename?: string
  includeTokens?: boolean
  includeDraft?: boolean
  saveToDesktop?: boolean
}

/**
 * 导出备份文件
 */
export async function exportBackup(options: ExportOptions = {}): Promise<{
  success: boolean
  filename: string
  error?: string
}> {
  try {
    const backup = createFullBackup()

    // 如果不包含令牌，清除令牌数据
    if (!options.includeTokens) {
      backup.tokens = { oneTimeTokens: [], tokenBatches: [] }
    }

    // 如果不包含草稿，清除草稿数据
    if (!options.includeDraft) {
      backup.draft = null
    }

    // 生成文件名
    const date = new Date().toISOString().slice(0, 10)
    const time = new Date().toTimeString().slice(0, 8).replace(/:/g, '-')
    const defaultFilename = `GROWMATE测评_备份_${date}_${time}.json`
    const filename = options.filename || defaultFilename

    // 创建Blob并下载
    const json = JSON.stringify(backup, null, 2)
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' })

    // 使用File System Access API（如果支持）保存到桌面
    if (options.saveToDesktop && 'showSaveFilePicker' in window) {
      try {
        const handle = await (window as unknown as { showSaveFilePicker: (opts: unknown) => Promise<{ createWritable: () => Promise<{ write: (data: Blob) => Promise<void>; close: () => Promise<void> }> }> }).showSaveFilePicker({
          suggestedName: filename,
          types: [
            {
              description: 'JSON备份文件',
              accept: { 'application/json': ['.json'] },
            },
          ],
        })
        const writable = await handle.createWritable()
        await writable.write(blob)
        await writable.close()

        return { success: true, filename }
      } catch (e) {
        // 用户取消或API不可用，回退到传统下载
        console.log('[Backup] File System API不可用，使用传统下载')
      }
    }

    // 传统下载方式
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    return { success: true, filename }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    return { success: false, filename: '', error: errorMessage }
  }
}

// ==================== 导入恢复 ====================

/**
 * 验证备份文件
 */
export function validateBackupFile(data: unknown): {
  valid: boolean
  error?: string
  metadata?: BackupMetadata
} {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: '无效的备份文件格式' }
  }

  const backup = data as Record<string, unknown>

  if (!backup.metadata || typeof backup.metadata !== 'object') {
    return { valid: false, error: '缺少元数据信息' }
  }

  const metadata = backup.metadata as Record<string, unknown>

  if (!metadata.version || !metadata.createdAt || !metadata.deviceId) {
    return { valid: false, error: '元数据不完整' }
  }

  if (!Array.isArray(backup.assessments)) {
    return { valid: false, error: '测评数据格式错误' }
  }

  return {
    valid: true,
    metadata: metadata as unknown as BackupMetadata,
  }
}

/**
 * 从文件导入备份
 */
export async function importBackup(file: File): Promise<BackupRestoreResult> {
  const result: BackupRestoreResult = {
    success: false,
    restored: { assessments: 0, draft: false, tokens: false, settings: false, user: false, parents: 0 },
    errors: [],
    warnings: [],
  }

  try {
    const text = await file.text()
    const data = JSON.parse(text)

    // 验证备份文件
    const validation = validateBackupFile(data)
    if (!validation.valid) {
      result.errors.push(validation.error || '验证失败')
      return result
    }

    const backup = data as FullBackupData

    // 检查版本兼容性
    if (backup.metadata.version !== BACKUP_VERSION) {
      result.warnings.push(`备份版本 ${backup.metadata.version} 与当前版本 ${BACKUP_VERSION} 可能不兼容`)
    }

    // 恢复测评数据
    const assessmentResult = restoreAssessments(backup.assessments)
    result.restored.assessments = assessmentResult.restored
    result.errors.push(...assessmentResult.errors)

    // 恢复草稿数据
    if (backup.draft) {
      const draftResult = restoreDraft(backup.draft)
      result.restored.draft = draftResult.success
      if (!draftResult.success) {
        result.warnings.push('草稿数据恢复失败')
      }
    }

    // 恢复令牌数据
    if (backup.tokens && backup.tokens.oneTimeTokens.length > 0) {
      const tokenResult = restoreTokens(backup.tokens)
      result.restored.tokens = tokenResult.success
      if (!tokenResult.success) {
        result.warnings.push('令牌数据恢复失败')
      }
    }

    // 恢复设置
    if (backup.settings && Object.keys(backup.settings).length > 0) {
      const settingsResult = restoreSettings(backup.settings)
      result.restored.settings = settingsResult.success
    }

    // 恢复用户信息（向后兼容：旧备份无此字段）
    if (backup.user) {
      const userResult = restoreUser(backup.user)
      result.restored.user = userResult.success
    }

    // 恢复家长账号（向后兼容：旧备份无此字段）
    if (backup.parents && backup.parents.length > 0) {
      const parentsResult = restoreParents(backup.parents)
      result.restored.parents = parentsResult.restored
    }

    result.success = result.errors.length === 0
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : '文件解析失败')
  }

  return result
}

/**
 * 恢复测评数据
 */
function restoreAssessments(assessments: AssessmentBackup[]): {
  restored: number
  errors: string[]
} {
  const errors: string[] = []
  let restored = 0

  try {
    const existing = collectAssessments()
    const existingIds = new Set(existing.map(a => a.id))

    // 合并数据，不覆盖已有数据
    const merged = [...existing]
    for (const item of assessments) {
      if (!existingIds.has(item.id)) {
        merged.push(item)
        restored++
      }
    }

    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(merged))
  } catch (error) {
    errors.push(error instanceof Error ? error.message : '恢复测评数据失败')
  }

  return { restored, errors }
}

/**
 * 恢复草稿数据
 */
function restoreDraft(draft: DraftBackup): { success: boolean } {
  try {
    // 检查是否有更新的草稿
    const existingRaw = localStorage.getItem(STORAGE_KEYS.DRAFT)
    if (existingRaw) {
      const existing = JSON.parse(existingRaw)
      if (existing.savedAt > draft.savedAt) {
        return { success: true } // 保留更新的草稿
      }
    }

    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft))
    return { success: true }
  } catch {
    return { success: false }
  }
}

/**
 * 恢复令牌数据
 */
function restoreTokens(tokens: TokenBackup): { success: boolean } {
  try {
    // 合并令牌，避免重复
    const existing = collectTokens()
    const existingTokenSet = new Set(
      existing.oneTimeTokens.map((t: unknown) => (t as Record<string, unknown>).token as string)
    )

    const mergedTokens = [...existing.oneTimeTokens]
    for (const token of tokens.oneTimeTokens as Record<string, unknown>[]) {
      if (!existingTokenSet.has(token.token as string)) {
        mergedTokens.push(token)
      }
    }

    localStorage.setItem(STORAGE_KEYS.ONE_TIME_TOKENS, JSON.stringify(mergedTokens))

    if (tokens.tokenBatches.length > 0) {
      localStorage.setItem(STORAGE_KEYS.TOKEN_BATCHES, JSON.stringify(tokens.tokenBatches))
    }

    return { success: true }
  } catch {
    return { success: false }
  }
}

/**
 * 恢复设置
 */
function restoreSettings(settings: Record<string, unknown>): { success: boolean } {
  try {
    if (settings.adminToken) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, settings.adminToken as string)
    }
    if (settings.deploymentStatus) {
      localStorage.setItem(STORAGE_KEYS.DEPLOYMENT_STATUS, JSON.stringify(settings.deploymentStatus))
    }
    return { success: true }
  } catch {
    return { success: false }
  }
}

/**
 * 恢复用户信息
 */
function restoreUser(user: UserBackup): { success: boolean } {
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEYS.USER)
    if (existingRaw) {
      return { success: true } // 保留当前已登录用户，不覆盖
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    return { success: true }
  } catch {
    return { success: false }
  }
}

/**
 * 恢复家长账号（合并策略：已有的保留，新增的追加）
 */
function restoreParents(parents: ParentBackup[]): { restored: number } {
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEYS.PARENTS)
    const existing: Record<string, unknown>[] = existingRaw ? JSON.parse(existingRaw) : []
    const existingPhones = new Set(existing.map(p => p.phone as string))

    let restored = 0
    for (const parent of parents) {
      if (!existingPhones.has(parent.phone)) {
        existing.push({ ...parent, needPasswordReset: true })
        restored++
      }
    }

    localStorage.setItem(STORAGE_KEYS.PARENTS, JSON.stringify(existing))
    return { restored }
  } catch {
    return { restored: 0 }
  }
}

// ==================== 辅助函数 ====================

/**
 * 获取备份信息摘要
 */
export function getBackupSummary(backup: FullBackupData): string {
  const lines = [
    `📦 备份信息`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `版本: ${backup.metadata.version}`,
    `创建时间: ${new Date(backup.metadata.createdAt).toLocaleString('zh-CN')}`,
    `来源设备: ${backup.metadata.deviceName}`,
    `设备ID: ${backup.metadata.deviceId}`,
    ``,
    `📊 数据统计:`,
    `  - 测评记录: ${backup.assessments.length} 条`,
    `  - 草稿: ${backup.draft ? '有' : '无'}`,
    `  - 令牌: ${backup.tokens.oneTimeTokens.length} 个`,
    `  - 用户信息: ${backup.user ? '有' : '无'}`,
    `  - 家长账号: ${backup.parents?.length || 0} 个`,
  ]

  return lines.join('\n')
}

/**
 * 清除所有本地数据（用于重置）
 */
export function clearAllLocalData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
  localStorage.removeItem('wilder_device_id')
}

/**
 * 获取本地存储使用情况
 */
export function getStorageUsage(): {
  used: number
  total: number
  breakdown: Record<string, number>
} {
  const breakdown: Record<string, number> = {}
  let used = 0

  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const item = localStorage.getItem(key)
    const size = item ? new Blob([item]).size : 0
    breakdown[name] = size
    used += size
  })

  // localStorage 通常限制为 5MB
  const total = 5 * 1024 * 1024

  return { used, total, breakdown }
}

/**
 * 格式化存储大小
 */
export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
