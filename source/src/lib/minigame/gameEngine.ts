// ===================================================================
// WILDER 星球探险 - 游戏引擎核心
// ===================================================================

import type {
  MiniGameState,
  MiniGameResults,
  MiniGameDecisionRecord,
  MiniGameChallenge,
  WilderDimension,
  AgeGroup,
  GameTheme,
} from './types'
import { getAgeGroup, DIMENSION_NAMES } from './types'
import { getChallengesForAge } from './challenges'

/**
 * 根据年龄获取游戏主题配置
 */
export function getGameThemeForAge(age: number): GameTheme {
  if (age <= 8) {
    return {
      name: '童趣星球',
      companion: {
        name: '小荒',
        emoji: '🦊',
        description: '一只聪明的小狐狸，喜欢探索和交朋友',
      },
      planetDescription: '欢迎来到 WILDER 星球！这里有好多好玩的东西等着你去发现！',
      levelPrefix: '探险',
    }
  }
  if (age <= 11) {
    return {
      name: '冒险星球',
      companion: {
        name: '小荒',
        emoji: '🤖',
        description: '一个可爱的 AI 机器人，知识渊博又幽默',
      },
      planetDescription: 'WILDER 星球正在等待勇敢的探险家！你准备好了吗？',
      levelPrefix: '关卡',
    }
  }
  if (age <= 14) {
    return {
      name: '挑战星球',
      companion: {
        name: '领航员',
        emoji: '🧭',
        description: '一位经验丰富的星际领航员，会给你建议但让你自己做决定',
      },
      planetDescription: 'WILDER 星球充满未知和挑战，需要智慧和勇气才能探索。',
      levelPrefix: '任务',
    }
  }
  return {
    name: '战略星球',
    companion: {
      name: '导师',
      emoji: '🎯',
      description: '一位深思熟虑的导师，用问题引导你思考',
    },
    planetDescription: 'WILDER 星球是一个复杂的系统，需要系统思维和战略眼光。',
    levelPrefix: '阶段',
  }
}

/**
 * 创建游戏状态
 */
export function createGameEngine(
  studentName: string,
  studentAge: number,
): MiniGameState {
  return {
    studentName,
    studentAge,
    currentLevelIndex: 0,
    currentChallengeIndex: 0,
    completedChallenges: [],
    dimensionScores: { W: 0, I: 0, L: 0, D: 0, E: 0, R: 0 },
    totalScore: 0,
    combo: 0,
    maxCombo: 0,
    startTime: Date.now(),
    sessionId: `${studentName}_${studentAge}_${Date.now().toString(36)}`,
  }
}

/**
 * 获取当前挑战
 */
export function getCurrentChallenge(state: MiniGameState): MiniGameChallenge | null {
  const challenges = getChallengesForAge(state.studentAge)
  const allDimensions: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
  const currentDim = allDimensions[state.currentLevelIndex]
  if (!currentDim) return null

  const dimChallenges = challenges.filter(c => c.dimension === currentDim)
  if (!dimChallenges || dimChallenges.length === 0) return null

  return dimChallenges[state.currentChallengeIndex] || null
}

/**
 * 提交答案
 */
export function submitAnswer(
  state: MiniGameState,
  challengeId: string,
  optionId: string,
): { newState: MiniGameState; record: MiniGameDecisionRecord } {
  const challenges = getChallengesForAge(state.studentAge)
  const challenge = challenges.find(c => c.id === challengeId)
  if (!challenge) throw new Error(`Challenge not found: ${challengeId}`)

  const option = challenge.options.find(o => o.id === optionId)
  if (!option) throw new Error(`Option not found: ${optionId}`)

  // 计算响应时间
  const responseTime = Math.floor((Date.now() - state.startTime) / 1000)

  // 更新维度分数
  const newDimensionScores = { ...state.dimensionScores }
  for (const [dim, score] of Object.entries(option.dimensionScores)) {
    newDimensionScores[dim as WilderDimension] = (newDimensionScores[dim as WilderDimension] || 0) + score
  }

  // 计算连击（如果本次得分 > 2，连击 +1，否则重置）
  const maxDimScore = Math.max(...Object.values(option.dimensionScores))
  const newCombo = maxDimScore >= 2 ? state.combo + 1 : 0
  const newMaxCombo = Math.max(state.maxCombo, newCombo)

  // 计算总分
  const newTotalScore = Object.values(newDimensionScores).reduce((sum, s) => sum + s, 0)

  // 创建决策记录
  const record: MiniGameDecisionRecord = {
    challengeId,
    dimension: challenge.dimension,
    selectedOptionId: optionId,
    responseTime,
    dimensionImpact: option.dimensionScores,
    timestamp: Date.now(),
  }

  // 创建新状态
  const newState: MiniGameState = {
    ...state,
    dimensionScores: newDimensionScores,
    totalScore: newTotalScore,
    combo: newCombo,
    maxCombo: newMaxCombo,
    completedChallenges: [...state.completedChallenges, challengeId],
  }

  return { newState, record }
}

/**
 * 前进到下一个挑战
 */
export function nextChallenge(state: MiniGameState): MiniGameState {
  const challengesPerLevel = 3 // 每个维度 3 个挑战
  const newChallengeIndex = state.currentChallengeIndex + 1

  if (newChallengeIndex >= challengesPerLevel) {
    // 当前维度完成，进入下一个维度
    return {
      ...state,
      currentLevelIndex: state.currentLevelIndex + 1,
      currentChallengeIndex: 0,
    }
  }

  return {
    ...state,
    currentChallengeIndex: newChallengeIndex,
  }
}

/**
 * 检查游戏是否完成（6个维度都完成）
 */
export function isGameComplete(state: MiniGameState): boolean {
  return state.currentLevelIndex >= 6
}

/**
 * 计算游戏结果（兼容 SandboxResults 接口）
 */
export function calculateResults(state: MiniGameState, decisionHistory: MiniGameDecisionRecord[]): MiniGameResults {
  const elapsedTime = Math.floor((Date.now() - state.startTime) / 1000)
  const allDimensions: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']

  // 维度分数归一化到 0-100（总分约 60-80 分，线性映射）
  const normalizedScores: Record<string, number> = {}
  for (const dim of allDimensions) {
    const raw = state.dimensionScores[dim] || 0
    // 满分约 12-15 分，映射到 0-100
    const normalized = Math.min(100, Math.max(0, Math.round((raw / 15) * 100)))
    normalizedScores[dim] = normalized
    normalizedScores[DIMENSION_NAMES[dim]] = normalized
  }

  // 进度状态
  const levelProgress: Record<WilderDimension, 'completed' | 'skipped' | 'in_progress'> = {
    W: state.currentLevelIndex > 0 ? 'completed' : state.currentLevelIndex === 0 ? 'in_progress' : 'skipped',
    I: state.currentLevelIndex > 1 ? 'completed' : state.currentLevelIndex === 1 ? 'in_progress' : 'skipped',
    L: state.currentLevelIndex > 2 ? 'completed' : state.currentLevelIndex === 2 ? 'in_progress' : 'skipped',
    D: state.currentLevelIndex > 3 ? 'completed' : state.currentLevelIndex === 3 ? 'in_progress' : 'skipped',
    E: state.currentLevelIndex > 4 ? 'completed' : state.currentLevelIndex === 4 ? 'in_progress' : 'skipped',
    R: state.currentLevelIndex >= 5 ? 'completed' : state.currentLevelIndex === 5 ? 'in_progress' : 'skipped',
  }

  return {
    dimensionScores: normalizedScores,
    decisionHistory,
    elapsedTime,
    sessionId: state.sessionId,
    gameMetadata: {
      totalScore: state.totalScore,
      maxCombo: state.maxCombo,
      challengesCompleted: state.completedChallenges.length,
      levelProgress,
    },
  }
}

/**
 * 获取当前进度百分比
 */
export function getProgress(state: MiniGameState): number {
  const totalChallenges = 18 // 6 维度 × 3 挑战
  const completed = state.completedChallenges.length
  return Math.round((completed / totalChallenges) * 100)
}

/**
 * 获取当前维度名称
 */
export function getCurrentDimensionName(state: MiniGameState): string {
  const allDimensions: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
  const currentDim = allDimensions[state.currentLevelIndex]
  return currentDim ? DIMENSION_NAMES[currentDim] : ''
}

/**
 * 获取当前关卡标题（用于 UI 展示）
 */
export function getCurrentLevelTitle(state: MiniGameState): string {
  const allDimensions: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
  const currentDim = allDimensions[state.currentLevelIndex]
  if (!currentDim) return ''

  const theme = getGameThemeForAge(state.studentAge)
  return `${theme.levelPrefix}${state.currentLevelIndex + 1}：${DIMENSION_NAMES[currentDim]}`
}
