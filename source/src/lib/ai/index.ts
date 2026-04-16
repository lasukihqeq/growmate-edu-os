// ===================================================================
// GROWMATE AI 引擎统一导出
// ===================================================================

// 核心类型（来自 types.ts）
export type {
  // 向量空间类型
  VectorPoint,
  CrossDimensionConfig,
  EmergentTalent,
  TalentCluster,
  TalentStar,
  Constellation,
  TalentGalaxy,
  NearestTalentMatch,
  // CoT因果推理类型
  ObservationNode,
  InferenceNode,
  PredictionNode,
  CausalChain,
  ReasoningResult,
  ReasoningVisualization,
  // Agent评估类型
  AgentId,
  AgentPerspective,
  AgentConfig,
  AgentSection,
  AgentOutput,
  ConsensusZone,
  DivergenceZone,
  SynthesisResult,
  DualPerspectiveReport,
  // RAG知识检索类型
  KnowledgeCategory,
  KnowledgeEntry,
  KnowledgeMetadata,
  RetrievalResult,
  RAGContext,
  KnowledgeIndex,
  // 温度控制与语言画像类型
  VocabularyLevel,
  SentenceComplexity,
  EvidenceDensity,
  LanguageProfile,
  // LLM通信类型
  LLMMessage,
  LLMResponse,
  StreamChunk,
  ProviderStatus,
  // AI服务配置类型
  ProviderConfig,
  AIServiceConfig,
  AIReportSegment,
  AICallOptions,
  // 报告AI元数据
  AIReportMetadata,
} from './types'

// AI 服务提供者（多 provider 降级链）
export {
  AIServiceProvider,
  createAIServiceProvider,
  getDefaultProvider,
} from './aiServiceProvider'

// 缓存管理
export {
  AICacheManager,
  createAICacheManager,
  getDefaultCacheManager,
  hashMessages,
  cacheKey,
  type CacheEntry,
  type CacheStats,
  type CacheOptions,
  type CacheConfig,
} from './cacheManager'

// 结果去重
export {
  AIDedupEngine,
  createAIDedupEngine,
  getDefaultDedupEngine,
  checkAndRecord,
  contentFingerprint,
  jaccardSimilarity,
  cosineSimilarity,
  type DedupConfig,
  type DedupResult,
  type DedupHistoryEntry,
} from './deduplicationEngine'

// 思维链推理
export {
  performCoTReasoning,
  performCoTReasoningSync,
  extractObservations,
  assembleCausalChains,
  buildVisualizationData,
  type EvidenceRecord,
  type CoTReasoningInput,
} from './cotReasoningEngine'

// 多智能体评估
export {
  AGENT_RISK_OFFICER,
  AGENT_STRATEGIST,
  evaluateWithDualAgents,
  evaluateWithDualAgentsSync,
  runAgent,
  synthesize,
  type DualAgentInput,
} from './multiAgentEvaluator'

// 提示词模板
export {
  escapeForPrompt,
  truncateContext,
  estimateTokenCount,
  buildCoTInferencePrompt,
  buildCoTPredictionPrompt,
  buildRiskOfficerSystemPrompt,
  buildStrategistSystemPrompt,
  buildAgentUserPrompt,
  buildEducatorPersonaPrompt,
  buildReassurancePrompt,
  buildDifferentiationSeed,
  buildRAGContextBlock,
  type CoTInferenceContext,
  type CoTPredictionContext,
  type AgentContext,
  type EducatorContext,
  type ReassuranceContext,
} from './promptTemplates'

// RAG 知识引擎
export {
  getKnowledgeBase,
  initializeKnowledgeBase,
  retrieveByProfile,
  retrieveByDimensions,
  retrieveByQuery,
  formatContextForPrompt,
  buildRAGContext,
} from './ragKnowledgeEngine'

// 温度控制
export {
  AGE_LANGUAGE_SPECS,
  getTemperatureForAge,
  computeLanguageProfile,
  generateLanguageInstruction,
  applyLanguageProfile,
  getEvidenceDensityForAge,
  getEmotionalToneForAge,
  type AgeLanguageSpec,
} from './temperatureController'

// 向量空间引擎
export {
  CROSS_DIMENSION_CONFIG,
  toVectorPoint,
  cosineSimilarity as cosineSimilarityVec,
  euclideanDistance,
  detectEmergentTalents,
  findNearestTalentTypes,
  clusterProfiles,
  generateTalentGalaxy,
} from './vectorSpaceEngine'
