// ===================================================================
// 动态沙盘推演系统 - 统一导出
// ===================================================================

// 类型
export * from './types'
export { SANDBOX_BADGES, WILDER_CONTEXT_RULES, STORY_THEME_PACKS } from './scenarioBank'

// 引擎
export { StoryGenerator, StoryContextManager, storyGenerator } from './storyEngine'

// 年龄适配
export {
  getSandboxConfig,
  getSandboxConfigByAgeGroup,
  createAICharacterForAge,
  getWelcomeMessage,
  getEncouragement,
} from './ageAdapter'

// 会话管理
export {
  createSandboxSession,
  saveSession,
  loadSession,
  clearSession,
  updateDimensionScores,
  addDecisionRecord,
  updateCurrentScene,
  markSessionCompleted,
  getSessionStats,
  sessionToAIEngineState,
  restoreFromAIEngineState,
} from './sessionManager'
