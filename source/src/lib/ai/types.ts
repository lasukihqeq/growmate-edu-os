// ===================================================================
// GROWMATE AI-Native 引擎 — 类型定义系统 v1.0.0
// 所有AI相关类型的唯一来源
// ===================================================================

import type { WilderDimension } from '../wilderKernel'
import type { TalentType30 } from '../wilderKernel'

// ============================================================
// 1. 向量空间类型
// ============================================================

/** 16维向量坐标：6原始WILDER维度 + 10交叉维度 */
export interface VectorPoint {
  rawDimensions: Record<WilderDimension, number>
  crossDimensions: Record<string, number>
  fullVector: number[]
  profileCode?: string
  talentTypeKey?: string
}

/** 交叉维度配置 */
export interface CrossDimensionConfig {
  pair: [WilderDimension, WilderDimension]
  key: string
  semanticLabel: string
  emergentSignal: string
  weight: number
}

/** 涌现天赋类型 */
export interface EmergentTalent {
  baseTypes: string[]
  emergentPattern: string
  crossDimensionSignals: Record<string, number>
  uniqueness: number
  narrativeHint: string
  confidence: number
}

/** 天赋聚类结果 */
export interface TalentCluster {
  centroidVector: number[]
  members: VectorPoint[]
  label: string
  dominantDimensions: WilderDimension[]
  size: number
}

/** 天赋星系可视化数据 */
export interface TalentStar {
  position: { x: number; y: number }
  profileCode?: string
  talentTypeKey?: string
  brightness: number
}

export interface Constellation {
  name: string
  members: string[]
  centerPosition: { x: number; y: number }
}

export interface TalentGalaxy {
  stars: TalentStar[]
  constellations: Constellation[]
  axisLabels: [string, string]
}

export interface NearestTalentMatch {
  key: string
  similarity: number
  talentType: TalentType30
}

// ============================================================
// 2. CoT因果推理类型
// ============================================================

/** 观察层节点 */
export interface ObservationNode {
  id: string
  type: 'behavioral' | 'cognitive' | 'social' | 'creative' | 'reflective'
  description: string
  evidence: {
    questionId: string
    questionText: string
    answer: string
    score: number
  }[]
  wilderDimensions: string[]
  confidence: number
  ageContext: string
  text?: string
}

/** 推理层节点 */
export interface InferenceNode {
  id: string
  fromObservations: string[]
  trait: string
  reasoning: string
  mechanism: string
  confidence: number
  alternativeExplanations: string[]
  text?: string
}

/** 预测层节点 */
export interface PredictionNode {
  id: string
  fromInferences: string[]
  prediction: string
  timeframe: 'short' | 'medium' | 'long'
  probability: 'high' | 'medium' | 'low'
  conditions: string[]
  risks: string[]
  text?: string
  confidence?: number
}

/** 完整因果链 */
export interface CausalChain {
  id: string
  title: string
  observations: ObservationNode[]
  inferences: InferenceNode[]
  predictions: PredictionNode[]
  overallConfidence: number
  chainType?: 'behavioral' | 'cognitive' | 'social'
  chainTitle?: string
  summary?: string
  primaryDimension?: string
  interventions?: { title: string; description: string; urgency: 'high' | 'medium' | 'low' }[]
}

export interface ReasoningResult {
  chains: CausalChain[]
  summary: string
  keyInsights: string[]
  isAIGenerated: boolean
  timestamp: string
}

export interface ReasoningVisualization {
  nodes: { id: string; type: 'observation' | 'inference' | 'prediction'; label: string; x: number; y: number }[]
  edges: { from: string; to: string; label?: string }[]
  layers: { name: string; nodeIds: string[] }[]
}

// ============================================================
// 3. Agent评估类型
// ============================================================

export type AgentId = 'risk_officer' | 'strategist'

export interface AgentPerspective {
  educatorId: string
  systemPrompt: string
  temperature: number
  focusDimensions: WilderDimension[]
  evaluationLens: string
}

export interface AgentConfig {
  id: AgentId
  name: string
  nameEn: string
  avatar: string
  systemPrompt: string
  temperature: number
  perspective: string
  focusAreas: string[]
}

export interface AgentSection {
  title: string
  content: string
  type: 'risk' | 'opportunity' | 'analysis' | 'recommendation'
  severity?: 'high' | 'medium' | 'low'
  timeframe?: string
  relatedDimensions: string[]
}

export interface AgentOutput {
  agentId: string
  agentName: string
  sections: AgentSection[]
  overallTone: 'cautious' | 'optimistic' | 'balanced'
  keyPoints: string[]
  confidenceLevel: number
  isAIGenerated: boolean
}

export interface ConsensusZone {
  topic: string
  riskOfficerView: string
  strategistView: string
  sharedConclusion: string
  confidenceLevel: number
}

export interface DivergenceZone {
  topic: string
  riskOfficerPosition: string
  strategistPosition: string
  parentGuidance: string
  suggestedAction: string
}

export interface SynthesisResult {
  consensusZones: ConsensusZone[]
  divergenceZones: DivergenceZone[]
  integratedRecommendations: string[]
  balancedNarrative: string
}

export interface DualPerspectiveReport {
  riskOfficer: AgentOutput
  strategist: AgentOutput
  synthesis: SynthesisResult
  executiveSummary: string
  isAIGenerated: boolean
  generatedAt: string
}

// ============================================================
// 4. RAG知识检索类型
// ============================================================

export type KnowledgeCategory = 'talent_type' | 'educator_theory' | 'book' | 'university' | 'course' | 'documentary' | 'career' | 'risk' | 'guidance' | 'dimension'

export interface KnowledgeEntry {
  id: string
  category: KnowledgeCategory
  content: string
  contentSummary: string
  tfidfVector: Map<number, number>
  wilderVector: number[]
  metadata: KnowledgeMetadata
}

export interface KnowledgeMetadata {
  source: string
  topic: string
  domain: string[]
  ageRange: [number, number]
  evidenceLevel: 'theoretical' | 'empirical' | 'practical' | 'experiential'
  wilderDimensions: string[]
  talentTypeKeys: string[]
}

export interface RetrievalResult {
  entry: KnowledgeEntry
  score: number
  matchType: 'semantic' | 'dimensional' | 'metadata'
}

export interface RAGContext {
  retrievedChunks: { source: string; content: string; relevanceScore: number }[]
  talentTypeContext?: TalentType30
  childAge: number
  wilderVector?: VectorPoint
}

export interface KnowledgeIndex {
  entries: KnowledgeEntry[]
  vocabulary: string[]
  vocabularyIndex: Map<string, number>
  documentCount: number
  isReady: boolean
}

// ============================================================
// 5. 温度控制与语言画像类型
// ============================================================

export type VocabularyLevel = 'concrete' | 'transitional' | 'abstract' | 'academic'
export type SentenceComplexity = 'simple' | 'compound' | 'complex' | 'academic'
export type EvidenceDensity = 'low' | 'medium' | 'high' | 'comprehensive'

export interface LanguageProfile {
  ageGroup: string
  ageLabel: string
  temperature: number
  vocabularyLevel: VocabularyLevel
  sentenceComplexity: SentenceComplexity
  evidenceDensity: EvidenceDensity
  emotionalTone: {
    warmth: number
    directness: number
    encouragement: number
    urgency: number
    toneLabel: string
    description: string
  }
  promptInstruction: string
  examplePhrases: string[]
}

// ============================================================
// 6. LLM通信类型
// ============================================================

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMResponse {
  content: string
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  finishReason: string
}

export interface StreamChunk {
  delta: string
  finishReason: string | null
}

export interface ProviderStatus {
  name: string
  healthy: boolean
  lastError?: string
  lastSuccessAt?: string
  consecutiveFailures: number
}

// ============================================================
// 7. AI服务配置类型
// ============================================================

export interface ProviderConfig {
  name: string
  apiKey: string
  baseUrl: string
  defaultModel: string
  priority: number
  enabled: boolean
}

export interface AIServiceConfig {
  providers: ProviderConfig[]
  defaultModel: string
  maxRetries: number
  retryBaseDelayMs: number
  timeoutMs: number
  enableStreaming: boolean
  fallbackToTemplate: boolean
}

export interface AIReportSegment {
  segmentId: string
  content: string
  causalChain: CausalChain | null
  provider: string
  model: string
  generatedAt: string
  tokenUsage: { prompt: number; completion: number; total: number }
  fallbackUsed: boolean
  qualityScore: number
}

export interface AICallOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  temperatureProfile?: string
}

// ============================================================
// 8. 报告AI元数据
// ============================================================

export interface AIReportMetadata {
  isAIGenerated: boolean
  aiCoverage: number
  fallbackSections: string[]
  reasoningChains?: CausalChain[]
  dualPerspective?: DualPerspectiveReport
  emergentTalents?: EmergentTalent[]
}
