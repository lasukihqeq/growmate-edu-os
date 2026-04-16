// ===================================================================
// 动态沙盘推演系统 - 类型定义 v1.0
// 支持生成式剧情、AI角色互动、多重宇宙分支测试
// ===================================================================

import type { AgeGroupKey } from '../questions/types'

// ========== 沙盘剧情系统 ==========

/** 故事主题类型 */
export type StoryTheme =
  | 'natural_exploration'   // 自然探索
  | 'social_collaboration'  // 社交协作
  | 'creative_innovation'   // 创造创新
  | 'mystery_solving'       // 解谜推理
  | 'startup_challenge'     // 创业挑战
  | 'crisis_management'     // 危机管理

/** 故事章节 */
export interface StoryChapter {
  chapterId: string
  title: string
  theme: StoryTheme
  targetDimensions: string[]  // 目标WILDER维度
  difficulty: 1 | 2 | 3 | 4 | 5
}

/** 场景分支 */
export interface SceneBranch {
  branchId: string
  triggerCondition: BranchTrigger
  alternateScene: SceneNode
  explorationPurpose: string  // "测试W维度的稳定性"
}

/** 分支触发条件 */
export interface BranchTrigger {
  type: 'dimension_uncertain' | 'contradictory_pattern' | 'probing_required'
  targetDimension?: string
  threshold?: number
}

/** AI生图风格 */
export type IllustrationStyle = 'cartoon_friendly' | 'realistic_editorial' | 'fantasy' | 'minimalist'

/** 场景节点 - 剧情的基本单元，映射到传统题目 */
export interface SceneNode {
  sceneId: string
  narrative: string                     // 剧情描述
  mappedQuestionId: string              // 对应 UnifiedQuestion.id
  illustration?: string                 // AI生图提示词
  illustrationStyle?: IllustrationStyle
  character?: AICharacter               // 出场角色
  decision: DecisionPoint               // 决策点
  branches?: SceneBranch[]              // 多重宇宙分支
  dimensionImpact: Record<string, number> // 预估维度影响
  context: string[]                     // 剧情上下文（用于连贯性）
}

/** 决策点 - 包装传统题目 */
export interface DecisionPoint {
  decisionId: string
  presentationMode: 'choice' | 'judgment' | 'action_sequence' | 'resource_allocation'
  contextualOptions: ContextualOption[]
  timeLimit?: number  // 可选限时（秒）
}

/** 情境化选项 */
export interface ContextualOption {
  id: string
  narrative: string              // "你决定先寻找水源..."
  actionDescription: string      // 行为描述
  dimensionScores: Record<string, number>
  nextSceneHint?: string         // 剧情走向提示
}

// ========== AI角色系统 ==========

/** 角色原型 */
export type CharacterArchetype =
  | 'robot_friend'       // 3-9岁：遇到麻烦的机器人朋友
  | 'mischievous_fairy'  // 3-9岁：爱恶作剧的小精灵
  | 'investor'           // 10-18岁：投资人
  | 'competitor'         // 10-18岁：竞争对手
  | 'devil_advocate'     // 10-18岁：法庭反方律师
  | 'mentor'             // 通用：导师角色

/** AI角色定义 */
export interface AICharacter {
  characterId: string
  name: string
  archetype: CharacterArchetype
  personality: CharacterPersonality
  dialogueStyle: DialogueStyle
  visualPrompt: string  // 生图提示词
}

/** 角色性格 */
export interface CharacterPersonality {
  tone: 'friendly' | 'serious' | 'playful' | 'challenging' | 'mysterious'
  interactionStyle: 'supportive' | 'questioning' | 'collaborative' | 'competitive'
  ageAppropriate: AgeGroupKey[]
}

/** 对话风格 */
export interface DialogueStyle {
  greetingPattern: string[]
  reactionPattern: Record<string, string[]>  // positive/negative/neutral
  transitionPhrases: string[]
  closingStyle: string
}

/** 对话条目 */
export interface DialogueEntry {
  speaker: 'ai' | 'player'
  content: string
  emotion?: 'happy' | 'sad' | 'curious' | 'confused' | 'determined'
  timestamp: number
}

/** 角色互动记录 */
export interface CharacterInteraction {
  sceneId: string
  characterId: string
  dialogueSequence: DialogueEntry[]
  playerResponse: string
  nlpAnalysis: ResponseAnalysis
}

// ========== NLP分析系统 ==========

/** NLP响应分析 */
export interface ResponseAnalysis {
  detectedVerbs: string[]        // 动词 → 执行力指标
  detectedNouns: string[]        // 名词复杂度 → 认知广度
  conditionalPhrases: string[]   // 条件句 → 逻辑推演
  sentimentScore: number         // -1 到 1
  complexityLevel: 'simple' | 'moderate' | 'complex'
  inferredDimensions: Record<string, number>
}

// ========== 多重宇宙系统 ==========

/** 平行宇宙 */
export interface ParallelUniverse {
  universeId: string
  divergingSceneId: string       // 分叉点
  targetDimension: string        // 探测目标维度
  scenarioVariation: string      // 情境变体
  playerDecisions: string[]      // 玩家决策
  accumulatedScores: Record<string, number>
  isActive: boolean
}

/** 维度解析 */
export interface DimensionResolution {
  dimension: string
  observedVariance: number
  confidenceScore: number
  recommendedFusion: 'average' | 'weighted' | 'max' | 'min'
}

/** 多重宇宙状态 */
export interface MultiverseState {
  activeBranches: ParallelUniverse[]
  fusionRequired: boolean
  pendingResolution: DimensionResolution[]
}

// ========== 沙盘会话系统 ==========

/** 决策记录 */
export interface DecisionRecord {
  sceneId: string
  decisionId: string
  selectedOption: string
  responseTime: number  // 秒
  dimensionImpact: Record<string, number>
  characterReaction?: string
}

/** 剧情进度 */
export interface StoryProgress {
  currentStory: SandboxStory
  currentChapter: number
  currentScene: SceneNode
  completedScenes: string[]
  decisionHistory: DecisionRecord[]
  narrativeContext: string[]  // AI维护的剧情上下文
}

/** 沙盘故事定义 */
export interface SandboxStory {
  storyId: string
  theme: StoryTheme
  targetAgeGroup: AgeGroupKey
  chapters: StoryChapter[]
  estimatedDuration: number  // 分钟
}

/** 完整沙盘会话状态 */
export interface SandboxSession {
  sessionId: string
  studentInfo: {
    name: string
    age: number
    phoneLastFour?: string
  }
  storyProgress: StoryProgress
  characterInteractions: CharacterInteraction[]
  multiverseState: MultiverseState
  dimensionScores: Record<string, number>  // 累计维度分数
  startedAt: number
  lastUpdatedAt: number
  completed: boolean
}

// ========== 沙盘配置系统 ==========

/** 沙盘场景配置 */
export interface SandboxSceneConfig {
  characterArchetype: CharacterArchetype
  maxScenes: number
  timePerScene: number  // 秒
  presentationMode: string[]
  illustrationStyle: IllustrationStyle
  dialogueComplexity: 'simple' | 'moderate' | 'advanced'
  narrativeLength: 'short' | 'medium' | 'long'
}

/** 年龄适配配置 */
export interface SandboxAgeConfig {
  preschool: SandboxSceneConfig   // 3-6岁
  'lower-primary': SandboxSceneConfig // 7-9岁
  'upper-primary': SandboxSceneConfig // 10-12岁
  'middle-school': SandboxSceneConfig // 13-15岁
  'high-school': SandboxSceneConfig   // 16-18岁
}

// ========== 题目→情境映射规则 ==========

/** 情境映射模板 */
export interface ContextMappingTemplate {
  dimension: string
  scenarioType: string
  narrativeTemplate: string
  objectPool: string[]
  adjectivePool: string[]
  problemPool: string[]
  actionMapping: Record<string, string>
}

// ========== 游戏化成就 ==========

/** 沙盘专属成就 */
export interface SandboxBadge {
  id: string
  name: string
  icon: string
  description: string
  category: 'story' | 'dimension' | 'character' | 'multiverse'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

// ========== 工具函数 ==========

/** 获取年龄段对应的配置 */
export function getSandboxConfig(age: number): SandboxSceneConfig {
  if (age <= 6) return PRESET_CONFIGS.preschool
  if (age <= 9) return PRESET_CONFIGS['lower-primary']
  if (age <= 12) return PRESET_CONFIGS['upper-primary']
  if (age <= 15) return PRESET_CONFIGS['middle-school']
  return PRESET_CONFIGS['high-school']
}

/** 预设年龄段配置 */
const PRESET_CONFIGS: Record<AgeGroupKey, SandboxSceneConfig> = {
  preschool: {
    characterArchetype: 'robot_friend',
    maxScenes: 22,
    timePerScene: 120,
    presentationMode: ['voice_first', 'visual_heavy', 'simple_choice'],
    illustrationStyle: 'cartoon_friendly',
    dialogueComplexity: 'simple',
    narrativeLength: 'short',
  },
  'lower-primary': {
    characterArchetype: 'mischievous_fairy',
    maxScenes: 25,
    timePerScene: 100,
    presentationMode: ['story_driven', 'interactive_choice'],
    illustrationStyle: 'cartoon_friendly',
    dialogueComplexity: 'simple',
    narrativeLength: 'short',
  },
  'upper-primary': {
    characterArchetype: 'mentor',
    maxScenes: 28,
    timePerScene: 90,
    presentationMode: ['text_first', 'puzzle_based'],
    illustrationStyle: 'fantasy',
    dialogueComplexity: 'moderate',
    narrativeLength: 'medium',
  },
  'middle-school': {
    characterArchetype: 'investor',
    maxScenes: 30,
    timePerScene: 80,
    presentationMode: ['text_first', 'data_rich'],
    illustrationStyle: 'realistic_editorial',
    dialogueComplexity: 'advanced',
    narrativeLength: 'medium',
  },
  'high-school': {
    characterArchetype: 'devil_advocate',
    maxScenes: 32,
    timePerScene: 75,
    presentationMode: ['text_first', 'data_rich', 'multi_stakeholder'],
    illustrationStyle: 'realistic_editorial',
    dialogueComplexity: 'advanced',
    narrativeLength: 'long',
  },
}
