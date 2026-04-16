// ===================================================================
// 新功能类型定义 - WILDER V2 迭代
// ===================================================================

// ========== Feature 1: 多模型专家分析 ==========

export interface AgentResult {
  agentId: string
  agentName: string
  agentNameEn: string
  icon: string
  color: string
  confidence: number // 0-100
  keyFindings: string[]
  status: 'pending' | 'analyzing' | 'complete'
  analysisDelay: number // ms, 用于动画
}

export interface MultiAgentAnalysis {
  agents: AgentResult[]
  consensus: string[]
  divergence: string[]
  overallConfidence: number
  analysisTimestamp: number
}

// ========== Feature 5: 场景描述系统 (P0-1) ==========

export type WilderDimension = 'W' | 'I' | 'L' | 'D' | 'E' | 'R'

export interface DimensionScenario {
  dimension: WilderDimension
  dimensionName: string
  level: 'high' | 'mid' | 'low'
  scenario: string
  observationGuide: string
  parentAction: string
  keywords: string[]
}

// ========== Feature 6: 反直觉发现 (P0-2) ==========

export interface CounterIntuitiveFinding {
  id: string
  type: 'surprise' | 'paradox' | 'potential' | 'blindspot'
  title: string
  titleEn: string
  description: string
  evidence: string
  implication: string
  action: string
  confidence: number
}

// ========== Feature 7: 家长验证反馈 (P1-1) ==========

export interface ParentVerification {
  assessmentId: string
  childId: string
  dimension: WilderDimension
  dimensionName: string
  scenarioDescription: string
  parentRating: 'accurate' | 'somewhat' | 'inaccurate' | 'not_observed'
  parentComment?: string
  updatedAt: string
  verifiedScore?: number
}

export interface VerificationResult {
  assessmentId: string
  childId: string
  totalVerified: number
  accuracyRate: number
  adjustmentNeeded: boolean
  adjustedScores?: Record<WilderDimension, number>
  feedbackSummary: string
  nextReviewDate: string
}

// ========== Feature 8: 动态场景匹配 (P1-2) ==========

export interface ScenarioMatchingContext {
  childAge: number
  childGender?: string
  interests: string[]
  recentActivities: string[]
  familyContext: 'single' | 'dual' | 'extended'
  accessToNature: 'urban' | 'suburban' | 'rural'
}

// ========== Feature 9: 多模型验证 (P2-1) ==========

export interface MultiModelVerification {
  assessmentId: string
  models: ModelVerificationResult[]
  consensusScore: number
  divergencePoints: DivergencePoint[]
  finalConfidence: number
  timestamp: string
}

export interface ModelVerificationResult {
  modelId: string
  modelName: string
  modelNameEn: string
  color: string
  scores: Record<WilderDimension, number>
  confidence: number
  keyFindings: string[]
}

export interface DivergencePoint {
  dimension: WilderDimension
  dimensionName: string
  minScore: number
  maxScore: number
  range: number
  explanation: string
}

// ========== Feature 10: 成长时间线 (P2-2) ==========

export interface GrowthRecord {
  id: string
  date: string
  type: 'milestone' | 'improvement' | 'observation' | 'achievement'
  title: string
  description: string
  dimension?: WilderDimension
  evidence?: string
  mediaUrl?: string
}

export interface GrowthTimeline {
  childId: string
  records: GrowthRecord[]
  startDate: string
  endDate: string
  summary: string
}

// ========== Feature 2: 潜能树 ==========

export interface TalentTreeNode {
  id: string
  label: string
  labelEn?: string
  score?: number
  level: 0 | 1 | 2 | 3
  color: string
  icon?: string
  children?: TalentTreeNode[]
  description?: string
}

export interface TalentTreeData {
  root: TalentTreeNode
  dimensions: TalentTreeNode[]
}

// ========== Feature 3: 注意力评估 ==========

export interface AttentionDimension {
  id: string
  name: string
  nameEn: string
  score: number // 0-100
  level: 'strong' | 'developing' | 'needs-support'
  description: string
  strategies: string[]
}

export interface AttentionProfile {
  dimensions: AttentionDimension[]
  overallLevel: 'green' | 'yellow' | 'red'
  summary: string
  disclaimer: string
  recommendations: string[]
}

export interface AttentionQuestion {
  id: string
  scenario: string
  dimension: string
  options: {
    text: string
    score: number
    dimensionWeights: Record<string, number>
  }[]
}

// ========== Feature 4: 作品上传分析 ==========

export interface ColorProfile {
  dominantColors: { hex: string; percentage: number; name: string }[]
  richness: number // 0-100
  warmth: number // 0-100 (0=冷色调, 100=暖色调)
  contrast: number // 0-100
}

export interface CompositionProfile {
  density: number // 0-100
  symmetry: number // 0-100
  complexity: number // 0-100
  fillRate: number // 0-100 (画面填充率)
}

export interface WorkAnalysisResult {
  colorProfile: ColorProfile
  compositionProfile: CompositionProfile
  parentTags: string[]
  summary: string
  creativeTraits: string[]
  expressionStyle: string
  enhancedData?: {
    wilderMapping?: WILDERWorkMapping
    colorProfile?: EnhancedColorProfile
    compositionProfile?: EnhancedCompositionProfile
  }
}

// ========== Feature 4B: 增强版作品分析类型 ==========

export interface EnhancedColorProfile {
  dominantColors: { hex: string; percentage: number; name: string; emoji: string }[]
  richness: number // 香农熵计算
  warmth: number // 精细冷暖度
  contrast: number // 局部+全局对比度
  harmony: ColorHarmony
  spatialDistribution: SpatialDistribution
  creativeIntent: string
  // 兼容基础字段
  richnessBasic: number
  warmthBasic: number
  contrastBasic: number
}

export interface ColorHarmony {
  type: '单色系' | '互补对比' | '互补点缀' | '三角调和' | '类似渐变' | '邻近搭配'
  confidence: number
  complementary: { hue: number; present: boolean } | null
  analogous: number[]
  description: string
}

export interface SpatialDistribution {
  layoutType: string
  dominantRegion: string
  thirdsHotspots: { x: number; y: number }[]
  centerWeight: number
  balanceScore: number
}

export interface EnhancedCompositionProfile {
  density: number
  symmetry: number
  complexity: number
  fillRate: number
  ruleOfThirds: number
  visualFlow: VisualFlow
  spatialDistribution: SpatialDistribution
  symmetryVertical: number
  symmetryHorizontal: number
  subjectClarity: string
  // 兼容基础字段
  densityBasic: number
  symmetryBasic: number
  complexityBasic: number
  fillRateBasic: number
}

export interface VisualFlow {
  direction: 'left-right' | 'right-left' | 'top-bottom' | 'bottom-top' | 'center-out'
  strength: number
  path: { x: number; y: number }[]
}

export interface WILDERWorkMapping {
  scores: {
    W?: number
    I?: number
    L?: number
    D?: number
    E?: number
    R?: number
  }
  traits: string[]
  confidenceAdjustment: number
  bidirectionalFeedback: string[]
}

// ========== Feature 4C: 注意力独立评估类型 ==========

export interface AttentionAssessmentQuestion {
  id: string
  dimension: 'sustained' | 'selective' | 'impulse' | 'working_memory' | 'cognitive_flex'
  type: 'choice' | 'judgment'
  question: string
  options?: { id: string; text: string; score: number }[]
  correctAnswer?: string
  scoring: Record<string, number>
  description: string
}

export interface AttentionProfileDetailed {
  sustained: number // 持续注意力 (0-100)
  selective: number // 选择性注意力
  impulse: number // 冲动控制
  workingMemory: number // 工作记忆
  cognitiveFlex: number // 认知灵活性
  overall: number // 综合评分
  confidence: number // 置信度
  patterns: AttentionPattern[]
  recommendations: string[]
}

export interface AttentionPattern {
  type: string
  description: string
  evidence: string
  suggestion: string
}
