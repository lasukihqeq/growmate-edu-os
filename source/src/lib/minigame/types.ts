// ===================================================================
// WILDER 星球探险 - 小游戏类型定义
// ===================================================================

/** 挑战类型 */
export type ChallengeType =
  | 'exploration'   // 探索发现
  | 'puzzle'        // 解谜
  | 'resource'      // 资源分配
  | 'pattern'       // 模式识别
  | 'dialogue'      // 对话沟通
  | 'building'      // 搭建设计

/** WILDER 维度 */
export type WilderDimension = 'W' | 'I' | 'L' | 'D' | 'E' | 'R'

/** 难度等级 */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5

/** 单个挑战选项 */
export interface ChallengeOption {
  id: string
  text: string
  emoji?: string
  /** 对各维度的影响分数 */
  dimensionScores: Record<WilderDimension, number>
  /** 叙事反馈（游戏内展示） */
  narrativeFeedback: string
}

/** 单个挑战配置 */
export interface MiniGameChallenge {
  id: string
  /** 所属维度 */
  dimension: WilderDimension
  /** 维度中文名 */
  dimensionName: string
  /** 挑战类型 */
  type: ChallengeType
  /** 难度 */
  difficulty: DifficultyLevel
  /** 挑战标题 */
  title: string
  /** 情境描述（背景故事） */
  scenario: string
  /** 挑战问题/任务 */
  question: string
  /** 选项 */
  options: ChallengeOption[]
  /** 年龄适配（可选，不填则全年龄） */
  ageRange?: { min: number; max: number }
}

/** 游戏状态 */
export interface MiniGameState {
  /** 学生姓名 */
  studentName: string
  /** 学生年龄 */
  studentAge: number
  /** 当前关卡索引 */
  currentLevelIndex: number
  /** 当前挑战索引（关卡内的第几个挑战） */
  currentChallengeIndex: number
  /** 已完成的挑战 ID 列表 */
  completedChallenges: string[]
  /** 维度累计分数 */
  dimensionScores: Record<WilderDimension, number>
  /** 总得分 */
  totalScore: number
  /** 连击数 */
  combo: number
  /** 最大连击 */
  maxCombo: number
  /** 开始时间 */
  startTime: number
  /** 游戏会话 ID */
  sessionId: string
}

/** 游戏结果（兼容 SandboxResults 接口） */
export interface MiniGameResults {
  /** 维度分数（与 SandboxResults.dimensionScores 兼容） */
  dimensionScores: Record<string, number>
  /** 决策历史 */
  decisionHistory: MiniGameDecisionRecord[]
  /** 用时（秒） */
  elapsedTime: number
  /** 会话 ID */
  sessionId: string
  /** 额外游戏数据 */
  gameMetadata: {
    totalScore: number
    maxCombo: number
    challengesCompleted: number
    levelProgress: Record<WilderDimension, 'completed' | 'skipped' | 'in_progress'>
  }
}

/** 游戏决策记录 */
export interface MiniGameDecisionRecord {
  challengeId: string
  dimension: WilderDimension
  selectedOptionId: string
  responseTime: number // 秒
  dimensionImpact: Record<WilderDimension, number>
  timestamp: number
}

/** 游戏主题配置（年龄适配） */
export interface GameTheme {
  /** 主题名称 */
  name: string
  /** AI 伙伴角色 */
  companion: {
    name: string
    emoji: string
    description: string
  }
  /** 星球背景描述 */
  planetDescription: string
  /** 关卡名称前缀 */
  levelPrefix: string
}

/** 年龄组 */
export type AgeGroup = '6-8' | '9-11' | '12-14' | '15-18'

/** 获取年龄组 */
export function getAgeGroup(age: number): AgeGroup {
  if (age <= 8) return '6-8'
  if (age <= 11) return '9-11'
  if (age <= 14) return '12-14'
  return '15-18'
}

/** WILDER 维度中文名称映射 */
export const DIMENSION_NAMES: Record<WilderDimension, string> = {
  W: '好奇心',
  I: '洞察力',
  L: '连接力',
  D: '设计力',
  E: '表达力',
  R: '韧性',
}

/** WILDER 维度 Emoji 映射 */
export const DIMENSION_EMOJIS: Record<WilderDimension, string> = {
  W: '🔭',
  I: '🔬',
  L: '🤝',
  D: '📐',
  E: '🎤',
  R: '💪',
}
