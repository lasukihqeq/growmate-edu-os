// ========== 基础类型 ==========

export type AppScreen = 'brand-intro' | 'home' | 'login' | 'onboarding' | 'chat' | 'report' | 'multi-modal-assessment' | 'admin' | 'user-center' | 'maic-classroom' | 'maic-playback' | 'dashboard'

/** 简化版学生信息 (v3 - 增强信息收集) */
export interface StudentInfo {
  name: string           // 学生姓名
  age: number            // 年龄
  birthday?: string      // 出生日期 (YYYY-MM-DD)
  grade?: string         // 年级（可选，根据年龄自动推算）
  phone?: string         // 手机号（可选）
  school?: string        // 学校（可选）
  // v3 新增：地区信息
  province?: string      // 省份 code
  city?: string          // 城市 code
  district?: string      // 区县 code
  // v3 新增：学校分类
  schoolCategory?: string // 学校分类（小学/初中/高中/九年一贯制/完全中学）
  // 以下为向后兼容的可选字段
  interestClasses?: string
  structuredInterests?: InterestClass[]
  testDate?: string
  testDuration?: number
}

// ========== 兴趣班结构化（保留向后兼容） ==========
export type DurationRange = 'less_half_year' | 'half_to_one' | 'one_to_two' | 'more_than_two'
export type SatisfactionLevel = 'love' | 'okay' | 'dislike'

export interface InterestClass {
  category: string
  name: string
  duration: DurationRange
  satisfaction: SatisfactionLevel
  isCustom?: boolean
}

export interface Question {
  id: string
  text: string
  category: string
  dimension: string
  options: QuestionOption[]
}

export interface QuestionOption {
  id: string
  text: string
  score: number
}

// ========== WILDER ==========
export interface WilderScores {
  W: number; I: number; L: number; D: number; E: number; R: number
  [key: string]: number
}

// ========== Big Five ==========
export interface BigFiveScores {
  O: number; C: number; E: number; A: number; N: number
  [key: string]: number
}

// ========== MBTI ==========
export type MBTIType = 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'

// ========== PISA ==========
export interface PISAScores {
  reading: 'high' | 'mid' | 'low'
  math: 'high' | 'mid' | 'low'
  science: 'high' | 'mid' | 'low'
}

// ========== RIASEC ==========
export type RIASECType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
export interface RIASECScores {
  R: number; I: number; A: number; S: number; E: number; C: number
  [key: string]: number
}

// ========== 21世纪技能 ==========
export interface Skills21Scores {
  creativity: number
  criticalThinking: number
  collaboration: number
  communication: number
}

// ========== Grit ==========
export interface GritScores {
  passion: number
  perseverance: number
  total: number
  level: 'high' | 'mid' | 'low'
}

// ========== CHC (Cattell-Horn-Carroll) ==========
export interface CHCScores {
  Gf: number   // Fluid reasoning
  Gc: number   // Crystallized intelligence
  total: number
  level: 'high' | 'mid' | 'low'
}

// ========== CASEL SEL ==========
export interface SELScores {
  selfAwareness: number
  selfManagement: number
  socialAwareness: number
  relationshipSkills: number
  responsibleDecision: number
  total: number
  level: 'high' | 'mid' | 'low'
}

// ========== 执行功能 ==========
export interface ExecutiveFunctionScores {
  inhibition: number
  cognitiveFlexibility: number
  workingMemory: number
  total: number
  level: string
}

// ========== SDQ ==========
export interface SDQScores {
  emotional: number
  conduct: number
  hyperactivity: number
  peer: number
  prosocial: number
  total: number
  level: string
}

// ========== VIA ==========
export interface VIAResult {
  topStrengths: string[]
  predicted: boolean
}

// ========== 10模型汇总 ==========
export interface TenModelResults {
  pisa: PISAScores
  bigFive: BigFiveScores
  mbti: { type: MBTIType; name: string; variant: string }
  wilder: WilderScores
  via: VIAResult
  grit: GritScores
  executiveFunction: ExecutiveFunctionScores
  sdq: SDQScores
  riasec: { top3: RIASECType[]; scores: RIASECScores; predicted: boolean }
  skills21: Skills21Scores
  chc: CHCScores
  sel: SELScores
}

// ========== 报告数据 ==========
export interface TalentType {
  id: string
  name: string
  nameEn: string
  icon: string
  strengths: string[]
  challenges: string[]
  educationTips: string[]
  keywords: string[]
}

export interface Evidence {
  id: string
  content: string
  inference: string
  significance: string
  source: string
}

export interface CoreStrength {
  icon: string
  name: string
  evidence: string
  transferValue: string
  colorScheme: string
}

export interface SystemVulnerability {
  title: string
  trigger: string
  earlySignals: string[]
  microTraining: string
}

export interface ChildTrait {
  icon: string
  title: string
  colorScheme: string
  behaviorPaint: string
  innerMechanism: string
  developmentMeaning: string
  parentView: string
}

export interface GrowthPath {
  id: string
  name: string
  description: string
  color: string
  duration: string
  investment: string
  output: string
  tasks: string[]
}

export interface WeeklyTask {
  week: number
  theme: string
  task: string
  parentAction: string
  output: string
}

export interface CommunicationScript {
  scene: string
  wrong: string
  right: string
  why: string
  color: string
}

export interface UniversityRecommendation {
  name: string
  majors: string
  reason: string
  extra: string
  extraLabel: string
}

export interface CareerDirection {
  icon: string
  name: string
  color: string
  description: string
  path: string
  aiNote: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  actionItems: string[]
}

export interface AssessmentResult {
  studentInfo: StudentInfo
  wilderScores: WilderScores
  bigFiveScores: BigFiveScores
  mbtiType: MBTIType
  mbtiName: string
  mbtiVariant: string
  talentType: TalentType
  subTalentTypes: TalentType[]
  tenModels: TenModelResults
  evidences: Evidence[]
  recommendations: Recommendation[]
  growthPaths: GrowthPath[]
  weeklyPlan: WeeklyTask[]
  childTraits: ChildTrait[]
  vulnerabilities: SystemVulnerability[]
  coreStrengths: CoreStrength[]
  communicationScripts: CommunicationScript[]
  universities: {
    u985: UniversityRecommendation[]
    u211: UniversityRecommendation[]
    yiben: UniversityRecommendation[]
    international: UniversityRecommendation[]
  }
  careerDirections: CareerDirection[]
  books: {
    child: { ageRange: string; color: string; books: { title: string; note: string }[] }[]
    parent: { category: string; color: string; books: string[] }[]
  }
}

// ========== K12 学科课程推荐 ==========

export type K12Subject = '数学' | '科学' | '语文'

export type K12GradeBand = '幼儿园' | '低小' | '中小' | '高小' | '初中'

/** K12 学科课程类型条目 */
export interface K12SubjectCourse {
  id: string
  subject: K12Subject
  approach: string
  approachEn: string
  gradeBand: K12GradeBand
  ageRange: string
  displayName: string
  description: string
  wilderAffinity: Record<string, number>
  primaryDims: string[]
  secondaryDims: string[]
  pisaAlignment: { dimension: 'reading' | 'math' | 'science'; level: 1 | 2 | 3 }
  subDirectionBias: 'alpha' | 'beta' | 'neutral'
  sampleTopics: string[]
  emoji: string
  colorScheme: string
}

/** K12 匹配评分明细 */
export interface K12ScoreBreakdown {
  wilderDimMatch: number
  weaknessCultivation: number
  overallAlignment: number
  ageGradeMatch: number
  pisaTierAdjust: number
  subDirectionBonus: number
}

/** K12 单条推荐结果 */
export interface K12RecommendedCourse {
  course: K12SubjectCourse
  matchScore: number
  matchReasons: string[]
  priorityTag: '强烈推荐' | '推荐' | '适合'
  scoreBreakdown: K12ScoreBreakdown
}

/** K12 完整推荐结果 */
export interface K12RecommendationResult {
  bySubject: {
    数学: K12RecommendedCourse[]
    科学: K12RecommendedCourse[]
    语文: K12RecommendedCourse[]
  }
  topPick: K12RecommendedCourse
  bridgeSuggestions: OutdoorK12Bridge[]
  rationale: string
}

/** 知识桥接 */
export interface KnowledgeBridge {
  outdoorTopic: string
  k12Topic: string
  connectionType: '知识对应' | '概念迁移' | '方法论共享'
  description: string
}

/** 能力迁移 */
export interface SkillTransfer {
  wilderDim: string
  outdoorSkill: string
  k12Skill: string
  transferMechanism: string
}

/** 户外↔K12 桥接条目 */
export interface OutdoorK12Bridge {
  id: string
  outdoorCourseId: string
  outdoorCourseName: string
  k12CourseId: string
  k12CourseName: string
  knowledgeBridges: KnowledgeBridge[]
  skillTransfers: SkillTransfer[]
  strengthDirection: 'outdoor→k12' | 'k12→outdoor' | 'bidirectional'
}
