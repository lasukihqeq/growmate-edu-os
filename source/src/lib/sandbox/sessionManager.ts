// ===================================================================
// 动态沙盘推演系统 - 会话管理器 v1.0
// 负责沙盘会话的持久化、草稿恢复和状态管理
// ===================================================================

import type { SandboxSession, StoryProgress, DecisionRecord } from './types'

const STORAGE_KEY = 'GROWMATE_SANDBOX_DRAFT'
const DRAFT_EXPIRY_DAYS = 7

/** 序列化AI引擎状态 */
export interface SerializedAIEngineState {
  seed: number
  totalAnswered: number
  maxQuestions: number
  dimension_scores: Record<string, number>
  answered_questions: string[]
}

/**
 * 创建新的沙盘会话
 */
export function createSandboxSession(
  studentInfo: { name: string; age: number; phoneLastFour?: string },
  storyProgress: StoryProgress
): SandboxSession {
  const now = Date.now()

  return {
    sessionId: `sandbox_${now}_${Math.random().toString(36).substr(2, 9)}`,
    studentInfo,
    storyProgress,
    characterInteractions: [],
    multiverseState: {
      activeBranches: [],
      fusionRequired: false,
      pendingResolution: [],
    },
    dimensionScores: {},
    startedAt: now,
    lastUpdatedAt: now,
    completed: false,
  }
}

/**
 * 保存会话到localStorage
 */
export function saveSession(session: SandboxSession): void {
  try {
    const data = {
      ...session,
      lastUpdatedAt: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('[Sandbox] Failed to save session:', e)
  }
}

/**
 * 从localStorage加载会话
 */
export function loadSession(): SandboxSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const session: SandboxSession = JSON.parse(raw)

    // 检查是否过期
    const expiryMs = DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    if (Date.now() - session.lastUpdatedAt > expiryMs) {
      console.warn('[Sandbox] Draft expired, clearing...')
      clearSession()
      return null
    }

    return session
  } catch (e) {
    console.warn('[Sandbox] Failed to load session:', e)
    return null
  }
}

/**
 * 清除会话
 */
export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * 更新会话的维度分数
 */
export function updateDimensionScores(
  session: SandboxSession,
  scores: Record<string, number>
): SandboxSession {
  return {
    ...session,
    dimensionScores: {
      ...session.dimensionScores,
      ...scores,
    },
    lastUpdatedAt: Date.now(),
  }
}

/**
 * 添加决策记录
 */
export function addDecisionRecord(
  session: SandboxSession,
  record: DecisionRecord
): SandboxSession {
  const newProgress = {
    ...session.storyProgress,
    decisionHistory: [...session.storyProgress.decisionHistory, record],
  }

  return {
    ...session,
    storyProgress: newProgress,
    lastUpdatedAt: Date.now(),
  }
}

/**
 * 更新当前场景
 */
export function updateCurrentScene(
  session: SandboxSession,
  newScene: any
): SandboxSession {
  // 首次加载场景时 currentScene 可能为 null，此时不将其加入 completedScenes
  const prevSceneId = session.storyProgress.currentScene?.sceneId
  const completedScenes = prevSceneId
    ? [...session.storyProgress.completedScenes, prevSceneId]
    : [...session.storyProgress.completedScenes]

  const newProgress = {
    ...session.storyProgress,
    currentScene: newScene,
    completedScenes,
  }

  return {
    ...session,
    storyProgress: newProgress,
    lastUpdatedAt: Date.now(),
  }
}

/**
 * 标记会话完成
 */
export function markSessionCompleted(session: SandboxSession): SandboxSession {
  return {
    ...session,
    completed: true,
    lastUpdatedAt: Date.now(),
  }
}

/**
 * 获取会话统计信息
 */
export function getSessionStats(session: SandboxSession): {
  totalScenes: number
  completedScenes: number
  elapsedMinutes: number
  averageResponseTime: number
  dimensionSummary: Record<string, number>
} {
  const totalScenes = session.storyProgress.currentStory.chapters.reduce(
    (sum, ch) => sum + (ch.targetDimensions.length || 1),
    0
  )

  const decisionHistory = session.storyProgress.decisionHistory
  const totalResponseTime = decisionHistory.reduce(
    (sum, d) => sum + d.responseTime,
    0
  )

  return {
    totalScenes,
    completedScenes: session.storyProgress.completedScenes.length,
    elapsedMinutes: Math.round((Date.now() - session.startedAt) / 60000),
    averageResponseTime: decisionHistory.length > 0
      ? Math.round(totalResponseTime / decisionHistory.length)
      : 0,
    dimensionSummary: session.dimensionScores,
  }
}

/**
 * 将会话转换为AI引擎可理解的格式
 */
export function sessionToAIEngineState(session: SandboxSession): SerializedAIEngineState {
  return {
    seed: session.startedAt,
    totalAnswered: session.storyProgress.decisionHistory.length,
    maxQuestions: session.storyProgress.currentStory.chapters.length * 6,
    dimension_scores: session.dimensionScores,
    answered_questions: session.storyProgress.decisionHistory.map(d => d.sceneId),
  }
}

/**
 * 从AI引擎状态恢复会话
 */
export function restoreFromAIEngineState(
  session: SandboxSession,
  engineState: SerializedAIEngineState
): SandboxSession {
  return {
    ...session,
    dimensionScores: engineState.dimension_scores,
    storyProgress: {
      ...session.storyProgress,
      completedScenes: engineState.answered_questions,
      decisionHistory: engineState.answered_questions.map((sceneId, idx) => ({
        sceneId,
        decisionId: `decision_${idx}`,
        selectedOption: 'restored',
        responseTime: 0,
        dimensionImpact: {},
      })),
    },
  }
}
