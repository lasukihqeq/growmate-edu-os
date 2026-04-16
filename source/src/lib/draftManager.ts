/**
 * 测评进度草稿管理器
 * localStorage 持久化 + 7天过期 + 跨阶段恢复
 */

import type { StudentInfo, InterestClass } from '../types'
import type { SerializedAIEngineState } from './adaptiveAIEngine'

// ========== 类型定义 ==========

export type AssessmentStage = 'onboarding' | 'multi-modal' | 'chat'

export interface OnboardingDraft {
  formData: {
    name: string
    age: string
    grade: string
    school: string
    interestClasses: InterestClass[]
    phone: string
  }
  step: number
}

export interface MultiModalDraft {
  phase: string
  currentChoiceIdx: number
  currentJudgmentIdx: number
  choiceAnswers: Record<string, string>
  judgmentAnswers: Record<string, boolean>
  randomSeed: number
  selectionHistory?: string[]
  engineMode?: 'random' | 'adaptive' | 'ai'
  /** AI引擎序列化状态（engineMode='ai' 时使用） */
  aiEngineState?: SerializedAIEngineState
}

export interface ChatDraft {
  messageCount: number
  /** 存储最近的消息摘要用于恢复上下文（不存全部消息，仅存AI可恢复的关键信息） */
  topicsSoFar: string[]
}

export interface DraftData {
  stage: AssessmentStage
  studentInfo?: StudentInfo
  onboarding?: OnboardingDraft
  multiModal?: MultiModalDraft
  chat?: ChatDraft
  savedAt: number  // timestamp
  version: number  // schema version for future migration
}

// ========== 常量 ==========

const DRAFT_KEY = 'wilder_assessment_draft'
const DRAFT_VERSION = 3
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000  // 7 天

// ========== 核心函数 ==========

/** 读取草稿（过期则自动清除） */
export function loadDraft(): DraftData | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null

    const draft: DraftData = JSON.parse(raw)

    // 过期检查
    if (Date.now() - draft.savedAt > EXPIRY_MS) {
      clearDraft()
      console.log('[DraftManager] 草稿已过期，已清除')
      return null
    }

    // 版本检查（v1 → v2 → v3 向后兼容）
    if (draft.version < DRAFT_VERSION) {
      if (draft.version === 1 && draft.multiModal) {
        draft.multiModal.engineMode = 'random'
        draft.version = 2
        console.log('[DraftManager] 草稿从v1迁移到v2（random模式）')
      }
      // v2 → v3: Onboarding 从6步合并为5步（age+grade 合为一步）
      if (draft.version === 2) {
        if (draft.onboarding) {
          const oldStep = draft.onboarding.step
          // 步骤映射: 0→0, 1→1, 2→1, 3→2, 4→3, 5→4
          const stepMap: Record<number, number> = { 0: 0, 1: 1, 2: 1, 3: 2, 4: 3, 5: 4 }
          draft.onboarding.step = stepMap[oldStep] ?? Math.min(oldStep, 4)
        }
        draft.version = 3
        console.log('[DraftManager] 草稿从v2迁移到v3（5步流程）')
      }
    }
    if (draft.version !== DRAFT_VERSION) {
      clearDraft()
      console.log('[DraftManager] 草稿版本不匹配，已清除')
      return null
    }

    return draft
  } catch (e) {
    console.warn('[DraftManager] 读取草稿失败:', e)
    clearDraft()
    return null
  }
}

/** 保存草稿（自动合并已有数据） */
export function saveDraft(partial: Partial<Omit<DraftData, 'savedAt' | 'version'>>): void {
  try {
    const existing = loadDraft()
    const draft: DraftData = {
      stage: partial.stage || existing?.stage || 'onboarding',
      studentInfo: partial.studentInfo ?? existing?.studentInfo,
      onboarding: partial.onboarding ?? existing?.onboarding,
      multiModal: partial.multiModal ?? existing?.multiModal,
      chat: partial.chat ?? existing?.chat,
      savedAt: Date.now(),
      version: DRAFT_VERSION,
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch (e) {
    console.warn('[DraftManager] 保存草稿失败:', e)
  }
}

/** 清除草稿 */
export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch { /* ignore */ }
}

/** 检查是否有可恢复的草稿 */
export function hasDraft(): boolean {
  return loadDraft() !== null
}

/** 获取草稿的简要描述（用于恢复对话框展示） */
export function getDraftSummary(draft: DraftData): string {
  const stageLabels: Record<AssessmentStage, string> = {
    'onboarding': '信息填写',
    'multi-modal': '多模态测评',
    'chat': 'AI对话',
  }
  const stageName = stageLabels[draft.stage] || '测评'
  const name = draft.studentInfo?.name || draft.onboarding?.formData.name || ''
  const timeAgo = getTimeAgo(draft.savedAt)

  let detail = ''
  if (draft.stage === 'onboarding' && draft.onboarding) {
    detail = `（已填写${draft.onboarding.step + 1}/5步）`
  } else if (draft.stage === 'multi-modal' && draft.multiModal) {
    const answered = Object.keys(draft.multiModal.choiceAnswers).length + Object.keys(draft.multiModal.judgmentAnswers).length
    detail = `（已答${answered}题）`
  } else if (draft.stage === 'chat' && draft.chat) {
    detail = `（已对话${draft.chat.messageCount}轮）`
  }

  return `${name ? name + '的' : ''}${stageName}${detail}，${timeAgo}保存`
}

// ========== 辅助函数 ==========

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  return `${days}天前`
}
