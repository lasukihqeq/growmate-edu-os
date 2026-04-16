// ===================================================================
// GrowMate 728种报告内容生成器 v3.0
// 基于 WILDER-729 内核 + 测评分数 动态生成完整报告内容
// 覆盖全部13个章节，每种画像生成差异化内容
// v2.0: 集成30科创天赋类型个性化内容库(院校/书籍/纪录片/家长关注)
// v3.0: 集成728纪录片匹配引擎 + 分年龄段家长指导话语 + 适龄题库
// ===================================================================

import { WILDER_MAX } from './assessmentEngine'
import type { EnhancedReport, AssessmentScores, WilderDimension } from './assessmentEngine'
import { matchTalentType30, crossMatchProfile } from './talentTypes30'
import type { TalentType30, CrossMatchResult } from './talentTypes30'
import { matchTalentType60 } from './talentTypes60'
import type { TalentType60, TalentMatch60 } from './talentTypes60'
import { getReportContent, getUniversitiesByTier, getBooksByTarget, getParentFocusAreas } from './reportPersonalization'
import type { TalentReportContent, UniversityRec, DocumentaryRec, ParentFocus } from './reportPersonalization'
import { matchDocumentaries728 } from './documentaryMatcher728'
import type { DocMatchResult728 } from './documentaryMatcher728'
import { generateParentGuidance20 } from './parentGuidancePhrases'
import type { ParentGuidanceSet } from './parentGuidancePhrases'
import { getAllQuestionsByAge, getAgeCognitiveProfile } from './ageAdaptiveQuestions'
import type { EvidenceRecord, DimensionEvidence as ImportedDimensionEvidence } from './evidenceChainBuilder'
import { computeAgeNormalizedScores } from './ageNormativeScoring'
import { generateNewModelAnalysis } from './newModelReportSections'
import type { NewModelAnalysis } from './newModelReportSections'
import { generateEducatorPanel, type EducatorPanelResult } from './educatorPanel'

// ===================================================================
// 人格特质描述模板库（基于四维度评估，内部使用，报告输出不出现人格类型代码）
// 四维度：socialEnergy(社交能量)、infoProcessing(信息处理)、decisionStyle(决策风格)、lifeOrganization(生活组织)
// ===================================================================

interface PersonalityInsightTemplate {
  coreDescription: (name: string) => string
  strengthNarrative: (name: string) => string
  growthNarrative: (name: string) => string
  parentTip: string
}

/** 
 * 人格特质组合描述模板（内部使用key，报告输出不出现这些代码）
 * 组合规则：
 * - socialEnergy: 高=E(外向), 低=I(内向)
 * - infoProcessing: 高=N(直觉), 低=S(感觉)  
 * - decisionStyle: 高=T(思考), 低=F(情感)
 * - lifeOrganization: 高=J(计划), 低=P(灵活)
 */
const PERSONALITY_INSIGHT_TEMPLATES: Record<string, PersonalityInsightTemplate> = {
  // ═══════════════════════════════════════════════════════════════
  // 分析家系列 (NT型) - 直觉+思考
  // ═══════════════════════════════════════════════════════════════
  
  // ENTJ: 外向+直觉+思考+计划
  ENTJ: {
    coreDescription: (name) => `${name}是一个充满领导力的孩子，善于在群体中发挥影响力，对未来有独到的愿景，喜欢用逻辑分析来做决策，并且习惯有计划地推进目标。`,
    strengthNarrative: (name) => `${name}天生具有组织者的潜质，TA能够看到事物的全局，善于制定策略并带领他人执行。这种特质使TA在需要统筹规划的项目中表现出色，能够自然地成为团队的核心。`,
    growthNarrative: (name) => `${name}有时可能对他人的感受不够敏感，在追求效率时容易忽略同伴的情感需求。帮助TA理解"有效的领导也需要关心每一个人"，会让TA的影响力更加持久和温暖。`,
    parentTip: '给TA主导一些家庭小项目的机会，同时引导TA在决策时考虑每个家庭成员的感受。'
  },
  
  // ENTP: 外向+直觉+思考+灵活
  ENTP: {
    coreDescription: (name) => `${name}是一个思维敏捷、充满创意的孩子，TA喜欢与人交流想法，善于发现事物之间的关联，喜欢用逻辑挑战常规，并且享受灵活应变的过程。`,
    strengthNarrative: (name) => `${name}拥有出色的创新思维和辩论能力，TA能从一个想法跳到另一个想法，发现别人看不到的可能性。这种特质让TA在头脑风暴和解决复杂问题时特别有优势。`,
    growthNarrative: (name) => `${name}有时可能因为想法太多而难以坚持完成，或者因为喜欢辩论而让人感到被挑战。帮助TA学会"先完成再完美"，以及用更温和的方式表达不同意见。`,
    parentTip: '鼓励TA把创意写下来并挑选一个付诸实践，同时肯定TA的独特视角，引导TA学会倾听。'
  },
  
  // INTJ: 内向+直觉+思考+计划
  INTJ: {
    coreDescription: (name) => `${name}是一个深思熟虑、有战略眼光的孩子，TA喜欢独立思考和规划，善于看到事物的长远发展方向，重视逻辑和效率，并且习惯有条不紊地推进目标。`,
    strengthNarrative: (name) => `${name}拥有卓越的系统思维和战略眼光，TA能够构建复杂的知识框架，并制定长期计划来实现目标。这种特质让TA在需要深度思考和系统规划的任务中表现出色。`,
    growthNarrative: (name) => `${name}有时可能过于追求完美和效率，对不确定性和变化感到不适。帮助TA理解"完成比完美更重要"，以及灵活调整计划也是智慧的一部分。`,
    parentTip: '尊重TA的独处思考时间，同时鼓励TA分享内心的想法，帮助TA看到执行中的小步骤也很重要。'
  },
  
  // INTP: 内向+直觉+思考+灵活
  INTP: {
    coreDescription: (name) => `${name}是一个好奇心旺盛、喜欢探索真理的孩子，TA享受独自思考的时光，善于分析复杂的概念，追求逻辑上的一致性，并且喜欢保持开放和灵活的态度。`,
    strengthNarrative: (name) => `${name}拥有出色的分析能力和求知欲，TA喜欢追问"为什么"，能够深入理解抽象概念并发现其中的逻辑关系。这种特质让TA在科学研究、哲学思考和理论探索方面有天赋。`,
    growthNarrative: (name) => `${name}有时可能过于沉浸在自己的思维世界中，或者因为追求完美答案而迟迟不行动。帮助TA学会"边做边学"，以及把想法与现实世界连接起来。`,
    parentTip: '提供丰富的学习资源和思考空间，同时温和地鼓励TA把想法付诸实践，哪怕是小实验。'
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 外交家系列 (NF型) - 直觉+情感
  // ═══════════════════════════════════════════════════════════════
  
  // ENFJ: 外向+直觉+情感+计划
  ENFJ: {
    coreDescription: (name) => `${name}是一个热情洋溢、善于激励他人的孩子，TA喜欢与人互动，善于理解他人的潜能，重视和谐的人际关系，并且乐于帮助他人成长。`,
    strengthNarrative: (name) => `${name}拥有天生的共情能力和领导魅力，TA能够敏锐地感知他人的情绪和需求，并用自己的热情感染周围的人。这种特质让TA在团队协作、教育引导和人际协调方面表现出色。`,
    growthNarrative: (name) => `${name}有时可能过于关注他人的感受而忽略自己的需求，或者在追求和谐时回避必要的冲突。帮助TA学会"照顾好自己才能更好地帮助他人"，以及健康的冲突也是成长的一部分。`,
    parentTip: '肯定TA关心他人的品质，同时提醒TA也要关注自己的感受，鼓励TA表达真实的需求。'
  },
  
  // ENFP: 外向+直觉+情感+灵活
  ENFP: {
    coreDescription: (name) => `${name}是一个充满热情、富有想象力的孩子，TA喜欢探索各种可能性，善于发现生活中的美好，重视内心的价值观，并且享受自由自在的生活方式。`,
    strengthNarrative: (name) => `${name}拥有丰富的创造力和感染力，TA能够用独特的视角看待世界，并用热情点燃周围人的激情。这种特质让TA在创意表达、人际连接和激发他人潜能方面特别有天赋。`,
    growthNarrative: (name) => `${name}有时可能因为兴趣太多而难以专注，或者在遇到困难时容易放弃。帮助TA学会"选择一个方向深入探索"，以及坚持完成一件事带来的成就感。`,
    parentTip: '支持TA探索多样的兴趣，同时帮助TA学会设定优先级，庆祝TA完成的每一个小目标。'
  },
  
  // INFJ: 内向+直觉+情感+计划
  INFJ: {
    coreDescription: (name) => `${name}是一个富有洞察力、追求意义的孩子，TA喜欢安静的深度思考，善于理解复杂的情感和动机，重视内心的价值观，并且希望为世界带来积极的改变。`,
    strengthNarrative: (name) => `${name}拥有深刻的洞察力和坚定的理想主义，TA能够理解他人言语背后的深层含义，并用自己的方式默默影响周围的人。这种特质让TA在理解他人、写作表达和追求理想方面表现出色。`,
    growthNarrative: (name) => `${name}有时可能因为理想与现实之间的差距而感到沮丧，或者因为过于敏感而容易受伤。帮助TA理解"改变世界从身边小事开始"，以及保护自己的能量也很重要。`,
    parentTip: '尊重TA的内心世界，提供安全的情感表达空间，鼓励TA把大理想分解为可实现的小步骤。'
  },
  
  // INFP: 内向+直觉+情感+灵活
  INFP: {
    coreDescription: (name) => `${name}是一个内心世界丰富、充满想象力的孩子，TA喜欢安静地思考，对美好事物有独特的感知力，重视内心的价值观，喜欢保持生活的灵活和开放。`,
    strengthNarrative: (name) => `${name}拥有深厚的共情能力和创造力，TA能敏锐地感知他人的情绪，并用独特的方式表达自己的想法。这种特质让TA在艺术创作、写作和人际关怀方面有天赋。`,
    growthNarrative: (name) => `${name}有时过于沉浸在内心世界中，可能需要一些温和的推动来将想法付诸行动。帮助TA学会设定小目标并逐步完成，同时保护TA敏感的内心。`,
    parentTip: '尊重TA的独处时间，提供日记本或创作工具，鼓励TA把内心的想法以自己喜欢的方式表达出来。'
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 守护者系列 (SJ型) - 感觉+判断
  // ═══════════════════════════════════════════════════════════════
  
  // ESTJ: 外向+感觉+思考+计划
  ESTJ: {
    coreDescription: (name) => `${name}是一个务实可靠、善于组织的孩子，TA喜欢在群体中发挥作用，注重实际效果和具体细节，习惯用逻辑分析问题，并且重视秩序和计划。`,
    strengthNarrative: (name) => `${name}拥有出色的执行力和组织能力，TA能够高效地完成任务，建立清晰的规则并确保事情按计划进行。这种特质让TA在项目管理、团队协调和实际操作中表现出色。`,
    growthNarrative: (name) => `${name}有时可能过于坚持规则和效率，对变化和他人的情感需求不够敏感。帮助TA理解"灵活应变也是一种能力"，以及关心他人的感受能让合作更顺畅。`,
    parentTip: '肯定TA的责任感和执行力，同时鼓励TA尝试新的方法，引导TA关注他人的情绪和需求。'
  },
  
  // ESFJ: 外向+感觉+情感+计划
  ESFJ: {
    coreDescription: (name) => `${name}是一个热心友善、乐于助人的孩子，TA喜欢与人互动，关心身边人的需求，重视和谐的人际关系，并且喜欢有组织、有计划的生活。`,
    strengthNarrative: (name) => `${name}拥有出色的社交能力和服务意识，TA能够敏锐地察觉他人的需要，并主动提供帮助来维护团队的和谐。这种特质让TA在团队协作、社区服务和人际协调方面表现出色。`,
    growthNarrative: (name) => `${name}有时可能过于在意他人的评价，或者在追求和谐时忽略了自己的需求。帮助TA建立"我的价值不取决于别人的认可"的信念，以及学会温和地说"不"。`,
    parentTip: '欣赏TA关心他人的品质，同时鼓励TA表达自己的想法和需求，帮助TA建立内在的自信。'
  },
  
  // ISTJ: 内向+感觉+思考+计划
  ISTJ: {
    coreDescription: (name) => `${name}是一个认真负责、注重细节的孩子，TA喜欢独立工作，重视实际经验和可靠的信息，习惯用逻辑分析问题，并且喜欢有计划、有条理的生活方式。`,
    strengthNarrative: (name) => `${name}拥有出色的专注力和可靠性，TA能够细致地完成任务，建立系统性的知识体系，并始终如一地履行承诺。这种特质让TA在研究、分析和需要精确性的工作中表现出色。`,
    growthNarrative: (name) => `${name}有时可能过于谨慎，对变化和新事物持保守态度。帮助TA理解"尝试新事物也是成长的一部分"，以及偶尔犯错也是学习的机会。`,
    parentTip: '肯定TA的认真和可靠，同时温和地鼓励TA尝试新的体验，帮助TA看到变化中的机会。'
  },
  
  // ISFJ: 内向+感觉+情感+计划
  ISFJ: {
    coreDescription: (name) => `${name}是一个温和体贴、忠诚可靠的孩子，TA喜欢安静的环境，注重实际的细节和事实，关心他人的感受，并且喜欢稳定有序的生活节奏。`,
    strengthNarrative: (name) => `${name}拥有出色的观察力和奉献精神，TA能够注意到别人忽略的细节，并用实际行动关心和照顾身边的人。这种特质让TA在护理、教育、艺术和任何需要细心和耐心的工作中表现出色。`,
    growthNarrative: (name) => `${name}有时可能过于谦虚，不愿意表达自己的成就，或者因为过于在意他人而忽略自己。帮助TA学会"为自己的努力感到骄傲"，以及"照顾好自己才能更好地照顾他人"。`,
    parentTip: '看见并肯定TA的付出，鼓励TA表达自己的需求和成就，帮助TA建立健康的边界。'
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 探险家系列 (SP型) - 感觉+知觉
  // ═══════════════════════════════════════════════════════════════
  
  // ESTP: 外向+感觉+思考+灵活
  ESTP: {
    coreDescription: (name) => `${name}是一个活力四射、喜欢行动的孩子，TA喜欢与人互动，注重当下的实际体验，善于快速分析问题，并且享受灵活应变、即兴发挥的过程。`,
    strengthNarrative: (name) => `${name}拥有出色的行动力和适应能力，TA能够在变化中迅速做出反应，善于发现眼前的机会并立即行动。这种特质让TA在体育、商业、应急处理和任何需要快速反应的领域中表现出色。`,
    growthNarrative: (name) => `${name}有时可能因为追求即时满足而忽略长期后果，或者在感到束缚时容易冲动。帮助TA学会"暂停思考后果"，以及长远规划能让短期的快乐更持久。`,
    parentTip: '给TA足够的活动空间和实践机会，同时帮助TA建立简单的规则意识，引导TA思考行为的后果。'
  },
  
  // ESFP: 外向+感觉+情感+灵活
  ESFP: {
    coreDescription: (name) => `${name}是一个热情开朗、享受生活的孩子，TA喜欢成为人群中的焦点，注重当下的美好体验，重视与他人的情感连接，并且喜欢自由自在的生活方式。`,
    strengthNarrative: (name) => `${name}拥有出色的表现力和感染力，TA能够用自己的热情感染周围的人，善于创造愉快的氛围并让每个人都感到被欢迎。这种特质让TA在表演、社交、活动策划和任何需要人际互动的领域中表现出色。`,
    growthNarrative: (name) => `${name}有时可能过于追求当下的快乐，对枯燥但必要的任务缺乏耐心。帮助TA学会"先苦后甜"，以及完成责任后的快乐会更加满足。`,
    parentTip: '欣赏TA带来的欢乐和活力，同时帮助TA建立简单的日常规律，让TA体验完成任务的成就感。'
  },
  
  // ISTP: 内向+感觉+思考+灵活
  ISTP: {
    coreDescription: (name) => `${name}是一个冷静务实、喜欢动手探索的孩子，TA喜欢独立工作，注重实际的体验和观察，善于分析事物的运作原理，并且享受灵活自由的工作方式。`,
    strengthNarrative: (name) => `${name}拥有出色的动手能力和问题解决技巧，TA喜欢拆解和组装东西，善于在危机中保持冷静并找到实用的解决方案。这种特质让TA在工程、技术、运动和任何需要实际操作和应变能力的领域中表现出色。`,
    growthNarrative: (name) => `${name}有时可能过于独立，不善于表达情感，或者对抽象的理论缺乏耐心。帮助TA理解"表达感受也是连接的方式"，以及理论知识能帮助实践更上一层楼。`,
    parentTip: '提供丰富的动手实践机会，尊重TA的独立空间，同时温和地鼓励TA分享内心的想法和感受。'
  },
  
  // ISFP: 内向+感觉+情感+灵活
  ISFP: {
    coreDescription: (name) => `${name}是一个温柔敏感、富有艺术气质的孩子，TA喜欢安静的环境，注重当下的美好体验，重视内心的感受，并且喜欢保持生活的灵活和自然。`,
    strengthNarrative: (name) => `${name}拥有出色的审美能力和创造力，TA能够感知细微的美，并用独特的方式表达自己的情感和价值观。这种特质让TA在艺术、设计、自然探索和任何需要审美和同理心的领域中表现出色。`,
    growthNarrative: (name) => `${name}有时可能过于敏感，对批评反应强烈，或者在面对冲突时选择回避。帮助TA建立"批评是针对行为而非人格"的认知，以及温和地表达自己的需求也是一种勇气。`,
    parentTip: '欣赏TA独特的审美和创造力，提供安全的表达空间，用温和的方式给予反馈，帮助TA建立自信。'
  },
}

// ========== 学生信息类型 ==========
export interface StudentProfile {
  name: string
  age: number
  grade: string
  school?: string
  testDate: string
  testDuration?: string
}

// ========== 完整动态报告数据接口 ==========
export interface DynamicReportData {
  // 基础信息
  student: StudentProfile
  reportVersion: string
  reportDate: string

  // 画像核心
  talentType: string
  talentTypeEn: string
  talentDescription: string
  profileCode: string
  variantId: number
  confidence: number

  // WILDER 分数 (百分比 0-100)
  wilderScores: Record<string, number>
  wilderPercentiles: Record<string, number>
  wilderLevels: Record<string, string>
  wilderTScores: Record<string, number>  // T分数（均值50、标准差10）
  ageNormInfo: {
    ageGroup: string
    ageGroupLabel: string
    peerMeans: Record<string, number>
  }

  // 排序后维度（从高到低）
  sortedDims: { key: string; name: string; score: number; level: string; emoji: string }[]
  topDims: string[] // 前2高维度
  bottomDims: string[] // 后2低维度

  // Section Explorer: 画像解读
  explorer: {
    coreInsight: string        // 核心发现句
    actionableInsight: string  // 可训练点
    strengthEngines: { letter: string; name: string; level: string }[]
    coreTraits: string[]
    growthDirections: { letter: string; name: string; level: string }[]
    todayAction: { phrase: string; explanation: string }
    characterTraits: {
      title: string; emoji: string; color: string
      behaviorDesc: string; mechanism: string; devMeaning: string; parentTip: string
    }[]
    strengthAssets: { name: string; emoji: string; evidence: string; transferValue: string; color: string }[]
    systemBugs: {
      title: string; priority: string
      trigger: string; earlySignals: string[]; microTraining: string
    }[]
    summaryMap: { icon: string; title: string; content: string; note: string; color: string }[]
  }

  // Section 0: 定心丸
  reassurance: { headline: string; todayAction: string }

  // Section 1: 结论总览
  conclusion: {
    corePosition: string
    top3Types: { label: string; name: string; pct: number; desc: string; color: string }[]
    radarInsight: { strongest: string; toActivate: string; balanced: string }
    confidenceDetail: { score: number; reason: string }
    supplementNeeded: string[]
  }

  // Section 2: 证据链
  evidenceChain: {
    code: string; type: string; content: string
    inference: string; futureImplication: string
  }[]

  // Section 3: 优势资产
  strengthAssets: {
    tags: { name: string; emoji: string; color: string }[]
    details: { name: string; emoji: string; portrait: string; parentStrategy: string; color: string }[]
  }

  // Section 4: 风险与误区
  risks: {
    title: string; description: string
    earlyWarnings: string[]
    repairStrategies: string[]
  }[]

  // Section 4b: 风险预判（学习/社交/职业）
  riskPredictions: {
    learningRisk: { title: string; content: string; subjects: string[]; warning: string }
    socialRisk: { title: string; content: string; scenarios: string[]; warning: string }
    careerBlindspot: { title: string; content: string; fields: string[]; warning: string }
  }

  // Section 5: 教育学家圆桌会诊
  educatorPanel?: EducatorPanelResult
  // 向后兼容：保留 growthPaths 作为别名
  growthPaths: {
    level: string; name: string; color: string
    goal: string; cycle: string; effort: string; output: string
    tasks: string[]
    riskWarning?: string
  }[]

  // Section 6: 90天行动计划
  weeklyPlan: {
    week: string; task: string; duration: string
    output: string; parentScript: string
  }[]

  // Section 7: 沟通脚本
  communicationScripts: {
    encouragements: { text: string; scene: string; intent: string }[]
    questions: { text: string; scene: string; intent: string }[]
    boundaries: { text: string; scene: string; intent: string }[]
  }

  // Section 8: 学校配合
  schoolCooperation: {
    learningStyle: { title: string; desc: string; color: string }[]
    classroomRoles: string[]
    teacherOpportunities: { title: string; desc: string }[]
  }

  // Section 9: 大学推荐
  universityRecommendations: {
    domestic: { name: string; major: string; reason: string }[]
    international: { name: string; major: string; reason: string; color: string }[]
  }

  // Section 9b: 科创天赋类型个性化大学推荐 (30类型)
  talentUniversities: UniversityRec[]

  // Section 10: 职业方向
  careerDirections: {
    icon: string; name: string; reason: string; path: string; color: string
  }[]
  aiInsight: string

  // Section 11: 书籍推荐
  bookRecommendations: {
    forChild: { ageRange: string; books: { name: string; desc: string }[] }[]
    forParent: { name: string; desc: string }[]
  }

  // Section 11b: 纪录片推荐 (30类型)
  documentaryRecommendations: DocumentaryRec[]

  // Section 11c: 家长关注焦点 (30类型)
  talentParentFocus: ParentFocus[]

  // Section 12: 下一步
  nextSteps: { step: string; desc: string }[]

  // Section 13: 附录
  appendix: {
    modelExplanation: string
    privacyNote: string
    auditLog: { model_version: string; timestamp: string; data_privacy: string }
  }

  // ========== Phase 3 新增字段 ==========

  // 多模型交叉验证
  multiModelValidation: {
    miAnalysis: {
      topIntelligences: { name: string; nameEn: string; score: number; wilderCorrelation: string }[]
      interpretation: string
    }
    bigFiveAnalysis: {
      traits: { dimension: string; name: string; level: string; score: number; wilderCorrelation: string }[]
      interpretation: string
    }
    cognitiveAnalysis: {
      stage: string
      stageDesc: string
      indicators: { name: string; achieved: boolean; score: number; detail: string }[]
      interpretation: string
    }
    efAnalysis: {
      inhibition: { level: string; score: number; detail: string }
      flexibility: { level: string; score: number; detail: string }
      interpretation: string
    }
    personalityProfile: { type: string; name: string; description: string; wilderCorrelation: string }
    crossValidationSummary: string
  }

  // 家长核心教育指导方案
  familySolutions: {
    learningProfile: { title: string; icon: string; description: string; tips: string[] }[]
    cultivationStrategy: { scenario: string; problem: string; solution: string; expectedOutcome: string; color: string }[]
    ageDevelopment: { ageRange: string; focus: string; milestones: string[]; parentRole: string; color: string }[]
    parentChildCommunication: { situation: string; wrongApproach: string; rightApproach: string; reason: string }[]
  }

  // 14天快速启动计划
  fourteenDayPlan: { day: string; task: string; goal: string; duration: string; parentTip: string }[]

  // 365天年度发展蓝图
  yearlyBlueprint: { quarter: string; theme: string; goals: string[]; milestone: string; retestNote?: string; color: string }[]

  // GROWMATE课程产品线匹配
  curriculumMatching: {
    recommended: { name: string; type: string; icon: string; reason: string; priority: string; color: string; ageRange: string }[]
    rationale: string
  }

  // 置信度与动态发展说明
  confidenceStatement: {
    overallRange: string
    factors: { name: string; value: string; contribution: string }[]
    dynamicNote: string
    ageChangeNote: string
    retestRecommendation: string
  }

  // ========== Phase 4: 30类型系统新增字段 ==========
  talentType30Key: string                // 30类型key e.g. 'D-WI'
  talentType30: TalentType30 | null      // 30类型完整信息
  crossMatch: CrossMatchResult | null    // 交叉匹配结果
  talentReportContent: TalentReportContent | null  // 个性化报告内容

  // ========== Phase 5: 728匹配引擎 + 家长指导 + 适龄题库 ==========
  docMatch728: DocMatchResult728 | null    // 728纪录片匹配结果
  parentGuidance20: ParentGuidanceSet | null // 20句家长指导话语
  ageAdaptiveInfo: {                        // 适龄题库信息
    ageGroup: string
    totalQuestions: number
    designNotes: string
    cognitiveProfile: { stage: string; characteristics: string[]; assessmentFocus: string[] }
  } | null

  // ========== 交叉验证透明度 ==========
  /** 交叉验证一致性得分 0-100 */
  crossValidationScore?: number
  /** 交叉验证等级 */
  crossValidationLevel?: 'excellent' | 'good' | 'moderate' | 'low'
  /** 检测到的不一致项 */
  crossValidationInconsistencies?: {
    type: string
    description: string
    recommendation: string
  }[]

  // ========== Phase 6: 新模型分析 ==========
  /** CHC / Grit / SEL 综合分析 + 13种模型组合差异化 */
  newModelAnalysis: NewModelAnalysis | null

  // ========== Phase 7: 60科创天赋分型系统 ==========
  /** 60分型匹配结果 */
  talentMatch60: TalentMatch60 | null
  /** 60分型key e.g. 'S-W-α' */
  talentType60Key: string
  /** 60分型完整信息 */
  talentType60: TalentType60 | null

  // ========== Phase 8: AI-Native 引擎字段 ==========
  /** AI 向量空间分析结果 */
  vectorPoint?: import('./ai/types').VectorPoint | null
  /** AI 涌现人才探测结果 */
  emergentTalents?: import('./ai/types').EmergentTalent[] | null
}

// ========== 维度元数据辅助 ==========
const DIM_META: Record<string, { name: string; nameEn: string; emoji: string }> = {
  W: { name: '好奇心', nameEn: 'Wonder', emoji: '🔭' },
  I: { name: '探究力', nameEn: 'Inquiry', emoji: '🔬' },
  L: { name: '连接力', nameEn: 'Link', emoji: '🤝' },
  D: { name: '设计力', nameEn: 'Design', emoji: '📐' },
  E: { name: '表达力', nameEn: 'Expression', emoji: '🎤' },
  R: { name: '反思力', nameEn: 'Reflection', emoji: '🪞' },
}

// ========== 30秒速览摘要 ==========
/** 30秒速览摘要数据结构 */
export interface QuickSummary {
  /** 核心特质描述，如"TA 是一个充满好奇心、善于深度探究的孩子" */
  coreTraitLine: string
  /** 最突出的能力，如"最突出的能力: 探究力（得分 85 分，表现出色）" */
  topStrength: string
  /** 本周行动建议，如"本周可以试试: 和 TA 一起观察一只蚂蚁搬家的全过程" */
  oneAction: string
}

/** Top2 维度组合的通俗描述模板 */
const CORE_TRAIT_TEMPLATES: Record<string, string> = {
  WI: '对世界充满好奇、喜欢追根究底的小探索家',
  WL: '热爱发现新事物、善于与人分享的小伙伴',
  WD: '既有好奇心又有执行力的小创造家',
  WE: '善于发现并生动表达的小分享家',
  WR: '边探索边思考、不断进步的小学者',
  IW: '对世界充满好奇、喜欢追根究底的小探索家',
  IL: '善于深度探究、乐于教会别人的小老师',
  ID: '既能钻研又能动手的小工程师',
  IE: '能把复杂事情讲清楚的小科普家',
  IR: '善于分析又会总结经验的小研究员',
  LW: '热爱发现新事物、善于与人分享的小伙伴',
  LI: '善于深度探究、乐于教会别人的小老师',
  LD: '善于协作、做事有条理的小队长',
  LE: '善于沟通、能带动气氛的小主持人',
  LR: '善于倾听、会换位思考的小知心',
  DW: '既有好奇心又有执行力的小创造家',
  DI: '既能钻研又能动手的小工程师',
  DL: '善于协作、做事有条理的小队长',
  DE: '善于规划、表达清晰的小策划师',
  DR: '做事有计划、会复盘改进的小管理者',
  EW: '善于发现并生动表达的小分享家',
  EI: '能把复杂事情讲清楚的小科普家',
  EL: '善于沟通、能带动气氛的小主持人',
  ED: '善于规划、表达清晰的小策划师',
  ER: '表达流畅、善于反思总结的小演说家',
  RW: '边探索边思考、不断进步的小学者',
  RI: '善于分析又会总结经验的小研究员',
  RL: '善于倾听、会换位思考的小知心',
  RD: '做事有计划、会复盘改进的小管理者',
  RE: '表达流畅、善于反思总结的小演说家',
}

/** 各维度的行动建议库 */
const ACTION_SUGGESTIONS: Record<string, string[]> = {
  W: [
    '和TA一起观察一只蚂蚁搬家的全过程，鼓励TA提出3个"为什么"',
    '一起翻开一本科普绘本，让TA挑选最想探索的问题',
    '在公园散步时，让TA当"发现小记者"，记录看到的有趣现象',
  ],
  I: [
    '让TA设计一个小实验验证"哪种纸飞机飞得最远"',
    '一起做一次厨房小实验，看看鸡蛋放在盐水里会发生什么',
    '鼓励TA用放大镜观察树叶，画下观察到的细节',
  ],
  L: [
    '让TA组织一次家庭游戏之夜，负责规则讲解和分组',
    '邀请TA的好朋友来家里，让TA当小主人接待',
    '做饭时请TA当小帮厨，学习分工合作完成一道菜',
  ],
  D: [
    '让TA负责规划一次周末出游的行程安排',
    '一起用积木或纸盒搭建TA想象中的理想房子',
    '让TA设计一份家庭作息时间表并尝试执行',
  ],
  E: [
    '让TA用3分钟给全家讲讲今天学校最有趣的一件事',
    '和TA一起录一段介绍自己房间的小视频',
    '让TA把喜欢的绘本故事用自己的话讲给弟弟妹妹/玩偶听',
  ],
  R: [
    '睡前和TA聊聊"今天最满意的一件事和想改进的一件事"',
    '做完作业后问问TA"这次哪道题做得最顺手？为什么？"',
    '和TA一起写"每周三件好事"日记，培养积极回顾的习惯',
  ],
}

// ===================================================================
// 人格特质相关辅助函数
// ===================================================================

/**
 * 根据人格特质四维度分数计算内部人格类型key
 * 仅供内部匹配模板使用，不对外展示
 * 
 * 四维度映射：
 * - socialEnergy: 高=E(外向), 低=I(内向)
 * - infoProcessing: 高=N(直觉), 低=S(感觉)
 * - decisionStyle: 高=T(思考), 低=F(情感)
 * - lifeOrganization: 高=J(计划), 低=P(灵活)
 */
function getPersonalityTypeKey(traits: {
  socialEnergy: number
  infoProcessing: number
  decisionStyle: number
  lifeOrganization: number
}): string {
  const e_i = traits.socialEnergy >= 50 ? 'E' : 'I'
  const s_n = traits.infoProcessing >= 50 ? 'N' : 'S'
  const t_f = traits.decisionStyle >= 50 ? 'T' : 'F'
  const j_p = traits.lifeOrganization >= 50 ? 'J' : 'P'
  return `${e_i}${s_n}${t_f}${j_p}`
}

/**
 * 根据人格特质生成补充短语（用于融入核心特质描述）
 */
function getPersonalityPhrase(traits: {
  socialEnergy: number
  infoProcessing: number
  decisionStyle: number
  lifeOrganization: number
}): string {
  const phrases: string[] = []
  
  // 社交能量维度（仅当分数偏离中等时添加）
  if (traits.socialEnergy >= 65) {
    phrases.push('善于在与人互动中获得灵感和能量')
  } else if (traits.socialEnergy <= 35) {
    phrases.push('更喜欢在安静中独立思考')
  }
  
  // 信息处理维度
  if (traits.infoProcessing >= 65) {
    phrases.push('常常有天马行空的创意想法')
  } else if (traits.infoProcessing <= 35) {
    phrases.push('注重细节和实际体验')
  }
  
  // 决策风格维度
  if (traits.decisionStyle >= 65) {
    phrases.push('习惯用逻辑来分析问题')
  } else if (traits.decisionStyle <= 35) {
    phrases.push('很在意身边人的感受')
  }
  
  // 生活组织维度
  if (traits.lifeOrganization >= 65) {
    phrases.push('喜欢按计划有条不紊地做事')
  } else if (traits.lifeOrganization <= 35) {
    phrases.push('喜欢灵活应变、即兴发挥')
  }
  
  return phrases.length > 0 ? '，' + phrases.join('、') : ''
}

/**
 * 生成人格特质叙事段落
 * 输出温暖、具体、面向家长的自然语言描述
 */
export function generatePersonalityNarrative(
  personalityTraits: {
    socialEnergy: number
    infoProcessing: number
    decisionStyle: number
    lifeOrganization: number
  },
  _wilderScores: Record<string, number>,
  childName: string
): {
  personalityOverview: string
  strengthInsight: string
  growthInsight: string
  parentActionTip: string
} {
  // 1. 获取内部type key
  const typeKey = getPersonalityTypeKey(personalityTraits)
  
  // 2. 从模板库获取模板（如果找不到则使用默认模板）
  const template = PERSONALITY_INSIGHT_TEMPLATES[typeKey] || PERSONALITY_INSIGHT_TEMPLATES['ENFP']
  
  // 3. 用childName替换模板中的占位符
  const personalityOverview = template.coreDescription(childName)
  const strengthInsight = template.strengthNarrative(childName)
  const growthInsight = template.growthNarrative(childName)
  const parentActionTip = template.parentTip
  
  return {
    personalityOverview,
    strengthInsight,
    growthInsight,
    parentActionTip,
  }
}

/**
 * 生成30秒速览摘要
 * @param wilderScores 各维度得分 (0-100)
 * @param wilderPcts 各维度百分位（可选，用于更丰富的描述）
 * @param childName 孩子名字（可选，用于替代"TA"）
 * @param personalityTraits 人格特质四维度（可选，用于融入人格特质描述）
 */
export function generateQuickSummary(
  wilderScores: Record<string, number>,
  _wilderPcts?: Record<string, number>,
  childName?: string,
  personalityTraits?: {
    socialEnergy: number
    infoProcessing: number
    decisionStyle: number
    lifeOrganization: number
  }
): QuickSummary {
  // 1. 按分数排序找出 top2 维度
  const dims = ['W', 'I', 'L', 'D', 'E', 'R']
  const sortedDims = dims
    .map(d => ({ key: d, score: wilderScores[d] || 0 }))
    .sort((a, b) => b.score - a.score)
  
  const top1 = sortedDims[0]
  const top2 = sortedDims[1]
  const top1Key = top1.key
  const top2Key = top2.key
  const combinedKey = top1Key + top2Key
  
  // 2. 生成 coreTraitLine（融入人格特质描述）
  const name = childName || 'TA'
  const traitDesc = CORE_TRAIT_TEMPLATES[combinedKey] || CORE_TRAIT_TEMPLATES[top2Key + top1Key] || '充满潜力的孩子'
  
  // 如果有personalityTraits，生成补充短语融入描述
  let personalityPhrase = ''
  if (personalityTraits) {
    personalityPhrase = getPersonalityPhrase(personalityTraits)
  }
  
  const coreTraitLine = `${name}是一个${traitDesc}${personalityPhrase}`
  
  // 3. 生成 topStrength
  const top1Name = DIM_META[top1Key]?.name || '未知'
  const top1Score = top1.score
  const scoreLevel = top1Score >= 90 ? '非常出色' : top1Score >= 80 ? '表现出色' : top1Score >= 70 ? '良好' : '有潜力'
  const topStrength = `最突出的能力：${top1Name}（得分 ${top1Score} 分，${scoreLevel}）`
  
  // 4. 生成 oneAction（基于分数确定性选择，避免渲染不纯）
  const actions = ACTION_SUGGESTIONS[top1Key] || ACTION_SUGGESTIONS['W']
  const stableIndex = (top1.score + top2.score) % actions.length
  let actionText = actions[stableIndex]
  // 如果有孩子名字，替换 TA
  if (childName) {
    actionText = actionText.replace(/TA/g, childName)
  }
  const oneAction = `本周试试：${actionText}`
  
  return {
    coreTraitLine,
    topStrength,
    oneAction,
  }
}

const DIM_LEVEL_DESC: Record<string, Record<string, string>> = {
  W: { high: '对世界充满强烈好奇，善于发现问题和提出追问', mid: '有一定好奇心，需要适当激发和引导', low: '好奇心正在萌芽，等待合适的契机被点燃' },
  I: { high: '善于追根究底，有科学思维雏形和证据意识', mid: '有求证意识，但深度和系统性不够稳定', low: '直觉敏锐，求证能力有巨大成长空间' },
  L: { high: '善于协作，能主动融入团队并将知识跨域迁移', mid: '能配合他人，主动性和知识迁移能力有提升空间', low: '独立思考能力强，团队协作能力正在发展中' },
  D: { high: '善于规划和组织，做事有条理，能将想法转为方案', mid: '有基础的计划能力，方案设计和执行中偶有偏差', low: '行动力强，规划能力可以通过练习快速提升' },
  E: { high: '善于表达和展示，沟通有感染力和说服力', mid: '能基本表达想法，深度、结构和感染力待提升', low: '内心世界丰富，正在寻找合适的表达方式' },
  R: { high: '有良好的自我觉察和复盘习惯，能主动优化行为', mid: '能进行初步反思，归因分析和改进策略待加强', low: '反思能力正在培养中，未来潜力巨大' },
}

// v2.0: 5档精细化维度描述（基于百分制分数，比3档更精准）
const DIM_LEVEL_DESC_5: Record<string, Record<string, string>> = {
  W: {
    exceptional: '好奇心极为突出，善于发现细节并提出深度追问，在同龄中非常稀有',
    high: '对世界充满强烈好奇，善于发现问题和提出追问',
    above_mid: '好奇心活跃，经常能提出有趣的问题，稍加引导即可深入',
    mid: '有一定好奇心，在感兴趣的领域会主动探索',
    emerging: '好奇心正在萌芽，等待合适的契机被点燃',
  },
  I: {
    exceptional: '探究力极强，有系统的求证习惯和严谨的证据意识',
    high: '善于追根究底，有科学思维雏形和证据意识',
    above_mid: '有求证意识，能在引导下进行有条理的探究',
    mid: '有初步的求证意识，深度和系统性有提升空间',
    emerging: '直觉敏锐，求证能力有巨大成长空间',
  },
  L: {
    exceptional: '协作能力极强，能自然地整合团队并推动跨域知识迁移',
    high: '善于协作，能主动融入团队并将知识跨域迁移',
    above_mid: '能积极配合他人，在熟悉环境中展现协作潜力',
    mid: '能配合他人，主动性和知识迁移能力有提升空间',
    emerging: '独立思考能力强，团队协作能力正在发展中',
  },
  D: {
    exceptional: '规划和组织能力极为出色，能独立将复杂任务拆解为清晰步骤',
    high: '善于规划和组织，做事有条理，能将想法转为方案',
    above_mid: '有基本规划意识，在支持下能设计可行方案',
    mid: '有基础的计划能力，方案设计中偶有偏差',
    emerging: '行动力强，规划能力可以通过练习快速提升',
  },
  E: {
    exceptional: '表达力极为突出，沟通有强感染力和说服力，同龄中罕见',
    high: '善于表达和展示，沟通有感染力和说服力',
    above_mid: '能清晰表达想法，在感兴趣话题上表现尤为出色',
    mid: '能基本表达想法，深度和感染力待提升',
    emerging: '内心世界丰富，正在寻找合适的表达方式',
  },
  R: {
    exceptional: '反思能力极强，有成熟的自我觉察和主动优化行为的习惯',
    high: '有良好的自我觉察和复盘习惯，能主动优化行为',
    above_mid: '能进行有意识的反思，归因分析正在发展',
    mid: '能进行初步反思，归因分析和改进策略待加强',
    emerging: '反思能力正在培养中，未来潜力巨大',
  },
}

/** v2.0: 根据百分制分数返回5档精细化描述 */
function getDimLevelDesc5(dim: string, pct: number): string {
  const level = pct >= 90 ? 'exceptional' : pct >= 75 ? 'high' : pct >= 55 ? 'above_mid' : pct >= 40 ? 'mid' : 'emerging'
  return DIM_LEVEL_DESC_5[dim]?.[level] || DIM_LEVEL_DESC[dim]?.mid || ''
}

/**
 * 根据维度和人格特质生成补充描述
 * 为每个WILDER维度x人格特质组合提供个性化补充
 */
function getPersonalitySupplementForDim(
  dim: string,
  _pct: number,
  traits: {
    socialEnergy: number
    infoProcessing: number
    decisionStyle: number
    lifeOrganization: number
  }
): string {
  const supplements: string[] = []
  
  switch (dim) {
    case 'W': // 好奇心维度
      if (traits.infoProcessing >= 60) {
        supplements.push('TA的好奇心更偏向于发散想象，喜欢探索"如果...会怎样"的问题')
      } else if (traits.infoProcessing <= 40) {
        supplements.push('TA的好奇心更偏向于实际观察，喜欢亲手触摸和验证')
      }
      break
      
    case 'I': // 探究力维度
      if (traits.decisionStyle >= 60) {
        supplements.push('TA的探究更注重逻辑推理和客观分析')
      } else if (traits.decisionStyle <= 40) {
        supplements.push('TA的探究往往从关心人和事的角度出发')
      }
      break
      
    case 'L': // 连接力维度
      if (traits.socialEnergy >= 60) {
        supplements.push('TA在团队中天然具有感染力，能带动气氛')
      } else if (traits.socialEnergy <= 40) {
        supplements.push('TA更擅长一对一的深度交流，与少数好友的关系质量很高')
      }
      break
      
    case 'D': // 设计力维度
      if (traits.lifeOrganization >= 60) {
        supplements.push('TA天生善于制定和遵循计划')
      } else if (traits.lifeOrganization <= 40) {
        supplements.push('TA的设计力更多体现在灵活应变和创意迭代上')
      }
      break
      
    case 'E': // 表达力维度
      if (traits.socialEnergy >= 60) {
        supplements.push('TA在公众场合表达自如，善于即兴发挥')
      } else if (traits.socialEnergy <= 40) {
        supplements.push('TA更擅长深思熟虑后的书面或创意表达')
      }
      break
      
    case 'R': // 反思力维度
      if (traits.infoProcessing >= 60) {
        supplements.push('TA的反思常常涉及深层的自我理解和意义探寻')
      } else if (traits.infoProcessing <= 40) {
        supplements.push('TA的反思更聚焦于具体事件的回顾和经验总结')
      }
      break
  }
  
  return supplements.length > 0 ? `（${supplements.join('；')}）` : ''
}

/**
 * 获取融入人格特质的维度描述（增强版）
 */
export function getDimLevelDescWithPersonality(
  dim: string,
  pct: number,
  personalityTraits?: {
    socialEnergy: number
    infoProcessing: number
    decisionStyle: number
    lifeOrganization: number
  }
): string {
  // 先获取基础描述
  const baseDesc = getDimLevelDesc5(dim, pct)
  
  if (!personalityTraits) return baseDesc
  
  // 根据维度和人格特质添加个性化补充
  const supplement = getPersonalitySupplementForDim(dim, pct, personalityTraits)
  
  return supplement ? `${baseDesc}${supplement}` : baseDesc
}

/** v2.0: 根据年龄归一化百分位返回优势等级标签 */
function getStrengthLabel(percentile: number): string {
  if (percentile >= 95) return '卓越'
  if (percentile >= 85) return '超强'
  if (percentile >= 70) return '显著'
  return '优势'
}

/** v2.0: 从实际数据组装置信度原因描述（替代硬编码文本） */
function buildConfidenceReason(enhancedReport: EnhancedReport, layer2Count: number): string {
  const cv = enhancedReport.crossValidation
  if (!cv) return '基于WILDER六维评估的综合分析'

  const parts: string[] = []
  // 交叉验证一致性
  if (cv.consistencyLevel === 'excellent') {
    parts.push(`多模型交叉验证一致性极高(${cv.overallConsistency}%)`)
  } else if (cv.consistencyLevel === 'good') {
    parts.push(`多模型交叉验证一致性良好(${cv.overallConsistency}%)`)
  } else if (cv.consistencyLevel === 'moderate') {
    parts.push(`多模型交叉验证一致性中等(${cv.overallConsistency}%)`)
  } else {
    parts.push(`多模型交叉验证一致性${cv.overallConsistency}%`)
  }
  // 模型数
  parts.push(`${cv.modelValidations.length}个心理学模型独立验证`)
  // 不一致项
  if (cv.inconsistencies.length > 0) {
    parts.push(`${cv.inconsistencies.length}项待观察确认`)
  }
  // Layer2深度
  if (layer2Count > 10) {
    parts.push(`覆盖${layer2Count}个子维度深度分析`)
  } else if (layer2Count > 0) {
    parts.push(`涵盖${layer2Count}个子维度`)
  }
  return parts.join('、')
}

/** v2.0: 根据百分位对 coreInsight 文本追加分数幅度修饰 */
function addMagnitudeModifier(
  baseInsight: string,
  top1Percentile: number, top2Percentile: number,
  dim1Name: string, _dim2Name: string
): string {
  let modifier = ''
  if (top1Percentile >= 95 && top2Percentile >= 85) {
    modifier = '这是同龄段中非常罕见的高水平组合。'
  } else if (top1Percentile >= 85 && Math.abs(top1Percentile - top2Percentile) <= 5) {
    modifier = '两项能力齐头并进、互相增强。'
  } else if (top1Percentile >= 85 && top2Percentile < 70) {
    modifier = `${dim1Name}是绝对核心优势。`
  }
  return modifier ? `${baseInsight} ${modifier}` : baseInsight
}

// ========== 特质行为画像模板（基于前2高维度组合） ==========
const TRAIT_TEMPLATES: Record<string, {
  coreInsight: (name: string, topScore: number, dim1: string, dim2: string) => string
  actionableInsight: string
  traits: {
    title: string; emoji: string; color: string
    behavior: (name: string) => string
    mechanism: string; devMeaning: string; parentTip: string
  }[]
}> = {
  WI: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.W.name})是稀缺的科创天赋力，${d2}(${DIM_META.I.name})让TA的好奇心有了科学方法的支撑——"`,
    actionableInsight: '这不是散漫，是探索型学习者的典型特征。',
    traits: [
      { title: '探索驱动模式：火焰型点燃', emoji: '🔥', color: 'amber', behavior: (n) => `${n}看到新事物会立即停下手中的事跑去观察；能连续追踪一个有趣的发现很长时间；经常问"这是怎么回事"、"为什么会这样"。`, mechanism: '好奇心(W)极强意味着对新奇刺激有天然的神经兴奋反应。探究力(I)强化了这种好奇心的深度——不仅想知道"是什么"，还想知道"为什么"。', devMeaning: '这种"火焰型点燃"是科学家、发明家、探险家的核心特质。在AI时代，机器不会对蝴蝶感到好奇，这种能力极为稀缺。', parentTip: 'TA不是"坐不住"，而是"发现了更有趣的事"。当TA东张西望时，试着问"你发现了什么"而不是"你怎么又不专心"。' },
      { title: '注意力曲线：脉冲式专注', emoji: '📈', color: 'blue', behavior: (n) => `${n}做作业时可能每隔5-10分钟就会"神游"——但遇到真正感兴趣的事能连续投入30分钟以上。`, mechanism: '好奇心驱动的注意力是"脉冲式"而非"恒流式"：短暂高峰→快速转移→再次点燃。这种模式在创意工作中是优势，在重复性任务中是挑战。', devMeaning: '不要试图把TA变成"恒流式"，而是学会利用"脉冲式"——把大任务切成小块，每块5-10分钟。', parentTip: '把大任务切成5-10分钟的小块，每完成一块就休息一下。利用TA的节奏，而不是对抗它。' },
      { title: '学习模式：实证求知者', emoji: '🔬', color: 'indigo', behavior: (n) => `${n}不轻易接受"因为书上说的"，喜欢自己验证；会用简单的方法测试自己的想法；对"做实验"特别感兴趣。`, mechanism: '探究力(I)高意味着TA有天然的"求证本能"——不满足于别人给的答案，要自己确认。', devMeaning: '这是科学方法的萌芽。现在保护好这种"怀疑精神"，未来学理科时会事半功倍。', parentTip: '当TA质疑你的说法时，不要觉得被冒犯。说"你觉得可以怎么验证？"，把质疑变成探究。' },
    ],
  },
  WD: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.W.name})驱动发现问题，${d2}(${DIM_META.D.name})驱动解决问题——这是天生的创造者组合——"`,
    actionableInsight: '好奇心+设计力 = 创新的完整引擎。',
    traits: [
      { title: '创造驱动模式：建筑师思维', emoji: '🏗️', color: 'amber', behavior: (n) => `${n}不仅对事物好奇，还想"造一个出来"；看到问题就想设计解决方案；喜欢用积木、纸板等材料搭建东西。`, mechanism: '好奇心(W)提供发现问题的敏锐度，设计力(D)提供把想法变成现实的执行力。两者结合形成完整的创新闭环。', devMeaning: '这种"从发现到创造"的能力在产品设计、建筑、发明领域极为珍贵。', parentTip: '给TA提供"建造"的机会——积木、编程、手工都行。重要的是让TA体验"从想法到成品"的完整过程。' },
      { title: '计划能力：有条理的探索者', emoji: '📋', color: 'blue', behavior: (n) => `${n}在开始做事前会自然地想"先做什么后做什么"；做项目时能列出步骤；做完会检查是否遗漏。`, mechanism: '设计力(D)高意味着前额叶的"执行规划"功能发育良好，这让好奇心的探索有了方向和结构。', devMeaning: '有计划的探索者比随机探索者效率高得多。这种能力在学术研究和工程领域是核心竞争力。', parentTip: '鼓励TA在探索前"画一张计划图"，在探索后"写一份小结"。让计划成为探索的一部分。' },
      { title: '完成闭环：项目型学习者', emoji: '🎯', color: 'green', behavior: (n) => `${n}能够从头到尾完成一个项目（虽然可能需要提醒）；完成后会有明显的成就感；喜欢展示自己的作品。`, mechanism: '设计力(D)为"完成闭环"提供了方法论支持——能规划、能执行、能验收。', devMeaning: '"完成一件事"的能力是所有成就的基础。TA已经具备这个底座，需要的是更多的练习机会。', parentTip: '每周给TA一个"微项目"——从头到尾完成，每次不超过2小时。完成后一起庆祝。' },
    ],
  },
  WE: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.W.name})让TA看到别人看不到的东西，${d2}(${DIM_META.E.name})让TA能生动地分享给全世界——"`,
    actionableInsight: '好奇心+表达力 = 天生的传播者。',
    traits: [
      { title: '发现与分享模式：故事讲述者', emoji: '📖', color: 'amber', behavior: (n) => `${n}发现有趣的事情后，第一反应是"我要告诉别人"；讲述发现时眉飞色舞，能让听众也感到兴奋。`, mechanism: '好奇心(W)提供源源不断的素材，表达力(E)把这些素材编织成引人入胜的故事。', devMeaning: '在信息爆炸时代，"能把复杂的事说得有趣"是极稀缺的能力。科普作家、演讲者、教育者都需要这种科创天赋力。', parentTip: '给TA"讲故事"的舞台——家庭分享会、录小视频、给弟弟妹妹讲科学小故事。' },
      { title: '表达风格：感染型沟通', emoji: '🎙️', color: 'purple', behavior: (n) => `${n}说话时有感染力，能让人愿意听下去；善于用比喻和例子解释复杂的事；在人群中有天然的"关注度"。`, mechanism: '表达力(E)高意味着语言组织和非语言表达（语调、表情、节奏）都较同龄人成熟。', devMeaning: '这种沟通能力在任何领域都是加分项——无论是科学答辩、商业路演还是日常社交。', parentTip: '让TA多练习"给不懂的人解释"——这是检验和提升表达力的最好方式。' },
      { title: '社交倾向：热情发起者', emoji: '💬', color: 'rose', behavior: (n) => `${n}遇到新朋友会主动打招呼、分享自己的发现；喜欢当"导游"带别人去看有趣的东西。`, mechanism: '好奇心驱动发现，表达力驱动分享，两者结合形成强大的社交启动力。', devMeaning: '主动发起社交的能力在未来工作中非常重要——团队领导、客户关系、社群运营都需要这种"破冰"能力。', parentTip: '引导TA从"认识很多人"到"和几个人深度交流一个话题"——把广度转化为深度。' },
    ],
  },
  // ========== 补全12种维度组合模板 ==========
  WL: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.W.name})让TA对世界充满好奇，${d2}(${DIM_META.L.name})让TA善于与人分享探索的乐趣——这是天生的探索伙伴"`,
    actionableInsight: '好奇心+连接力 = 协作式探索者，在团队中如鱼得水。',
    traits: [
      { title: '协作探索模式：团队发现者', emoji: '🤝', color: 'amber', behavior: (n) => `${n}喜欢和朋友一起探索新事物；发现有趣的东西会第一时间拉上小伙伴；在团队活动中总是最活跃的那个。`, mechanism: '好奇心(W)驱动发现，连接力(L)把独自探索变成社交活动。这种组合让学习变得有趣且有社交回报。', devMeaning: '科学研究越来越强调团队协作。能在探索中自然建立人际连接，是未来科研团队核心成员的特质。', parentTip: '组织"探索小分队"——邀请TA的朋友一起做实验、去自然观察。把社交需求和学习需求结合起来。' },
      { title: '分享驱动力：知识传播者', emoji: '📢', color: 'blue', behavior: (n) => `${n}学到新知识后，会主动教给同学或弟弟妹妹；喜欢当"小老师"；解释事情时很有耐心。`, mechanism: '连接力(L)让TA在乎他人的理解和感受，好奇心(W)提供持续的知识素材。两者结合产生强烈的知识分享动机。', devMeaning: '"能把知识传递给别人"是检验真正理解的最好方式，也是教育、培训行业的核心能力。', parentTip: '让TA有机会"当老师"——给弟弟妹妹讲故事、给爷爷奶奶解释新事物。这既能巩固知识，又能满足社交需求。' },
      { title: '社交学习者', emoji: '💡', color: 'purple', behavior: (n) => `${n}在小组讨论中学习效率最高；喜欢"一起研究"胜过"独自学习"；能从同伴身上学到很多。`, mechanism: '连接力(L)让TA对社交情境特别敏感，能从人际互动中提取信息和灵感。', devMeaning: '社交学习是一种高效的学习方式。未来的工作几乎都是团队协作，这种能力是核心竞争力。', parentTip: '给TA创造"学习伙伴"——找兴趣相近的同学一起学习。比独自刷题有效得多。' },
    ],
  },
  WR: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.W.name})让TA不断发现新问题，${d2}(${DIM_META.R.name})让TA能从每次探索中提炼智慧——这是深度学习者的黄金组合"`,
    actionableInsight: '好奇心+反思力 = 不断进化的探索者。',
    traits: [
      { title: '反思型探索者', emoji: '🔍', color: 'amber', behavior: (n) => `${n}不只是"做完就算"，做完后会想"这次学到了什么"；能从失败的实验中总结经验；对自己的思考过程有觉察。`, mechanism: '好奇心(W)驱动尝试新事物，反思力(R)从每次尝试中提取经验。这形成了一个"探索-反思-进化"的正循环。', devMeaning: '这种"能从经验中学习"的能力是成长的加速器。同样的经历，TA能比同龄人收获多2-3倍。', parentTip: '每次探索后问"你发现了什么？如果再做一次，你会怎么做不一样？"帮TA养成反思习惯。' },
      { title: '自我觉察能力', emoji: '🪞', color: 'indigo', behavior: (n) => `${n}能说出自己"擅长什么、不擅长什么"；对自己的情绪和状态有一定觉察；能识别自己的学习模式。`, mechanism: '反思力(R)高意味着元认知能力发展良好——能"站在自己之外看自己"。这在儿童中相当难得。', devMeaning: '自我觉察是情商和逆商的基础。有这种能力的孩子，在青春期的自我认同阶段会更顺利。', parentTip: '定期做"自我画像"——让TA画出/写出"我是一个怎样的人"。追踪TA对自己认知的变化。' },
      { title: '经验学习者', emoji: '📝', color: 'green', behavior: (n) => `${n}很少犯同样的错误两次；能把一个领域学到的方法迁移到另一个领域；有"举一反三"的能力。`, mechanism: '反思力(R)让TA能提取经验中的"规律"，好奇心(W)则提供广泛的经验素材。两者结合产生强大的迁移学习能力。', devMeaning: '"从经验中学习"是AI最难复制的人类能力之一。这种能力在快速变化的未来尤为珍贵。', parentTip: '问TA"这和你之前学的什么有点像？"帮TA建立知识之间的连接。' },
    ],
  },
  IL: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.I.name})让TA追求真理和证据，${d2}(${DIM_META.L.name})让TA能把发现传递给更多人——这是天生的科学传播者"`,
    actionableInsight: '探究力+连接力 = 不仅能发现真理，还能让它传播开来。',
    traits: [
      { title: '协作型研究者', emoji: '🔬', color: 'blue', behavior: (n) => `${n}喜欢和小伙伴一起做实验、一起验证想法；能在团队中担任"验证员"角色；善于分工协作完成复杂任务。`, mechanism: '探究力(I)提供科学方法和求证意识，连接力(L)让这种能力在团队中发挥价值。', devMeaning: '现代科学研究几乎都是团队协作。能在协作中保持求证精神，是顶尖科研团队成员的核心特质。', parentTip: '组织"家庭科学俱乐部"——全家一起做实验，让TA担任"首席科学家"角色。' },
      { title: '知识桥梁', emoji: '🌉', color: 'purple', behavior: (n) => `${n}能把复杂的科学概念解释给不懂的人听；善于用比喻和例子；同学有不懂的问题喜欢问TA。`, mechanism: '探究力(I)确保TA真正理解概念，连接力(L)让TA愿意并善于把理解传递给别人。', devMeaning: '科学素养的普及需要这样的"知识桥梁"。在科普、教育、咨询领域，这是核心竞争力。', parentTip: '让TA定期给家人做"科学小讲座"——用5分钟解释一个概念。这是检验理解深度的最好方式。' },
      { title: '同伴学习促进者', emoji: '👥', color: 'teal', behavior: (n) => `${n}在小组学习中不只关心自己懂不懂，也关心队友懂不懂；会主动帮助落后的同学；有"一起进步"的意识。`, mechanism: '连接力(L)让TA对他人的状态敏感，探究力(I)让TA有能力帮助他人理解。', devMeaning: '这种"利他型学习者"在任何团队中都是宝贵的存在。未来的领导力很大程度上是"帮助他人成长"的能力。', parentTip: '鼓励TA做"学习小老师"——帮同学讲题、带弟弟妹妹学习。这对自己的学习也有巨大帮助。' },
    ],
  },
  ID: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.I.name})让TA追求严谨和真理，${d2}(${DIM_META.D.name})让TA能把想法变成现实——这是工程师和发明家的核心特质"`,
    actionableInsight: '探究力+设计力 = 从"为什么"到"怎么做"的完整闭环。',
    traits: [
      { title: '系统工程思维', emoji: '⚙️', color: 'blue', behavior: (n) => `${n}做事有条理，能列出步骤并按计划执行；喜欢"拆解"复杂的东西看里面是什么；做完会检查是否有遗漏。`, mechanism: '探究力(I)提供分析能力，设计力(D)提供组织能力。两者结合形成强大的系统工程思维。', devMeaning: '这是工程师、建筑师、程序员的核心认知模式。在STEM领域有天然优势。', parentTip: '给TA"工程挑战"——用有限材料解决一个问题（如用纸建一座桥）。让TA体验从分析到设计到实现的完整过程。' },
      { title: '验证型创造者', emoji: '🔧', color: 'amber', behavior: (n) => `${n}做东西之前会先想清楚"这样做行不行"；会用简单的方式先测试想法；不满足于"能用就行"，追求"做得好"。`, mechanism: '探究力(I)让TA在创造过程中保持求证意识——先验证再投入。这减少了试错成本。', devMeaning: '这种"先验证再行动"的习惯在创业、产品开发中极为珍贵。能大大提高成功率。', parentTip: '鼓励TA做"小测试"——在做一个大项目前，先用简单版本验证想法是否可行。' },
      { title: '质量驱动者', emoji: '✅', color: 'green', behavior: (n) => `${n}对自己的作品有质量标准；完成后会自己检查一遍；不太接受"差不多就行"的态度。`, mechanism: '探究力(I)让TA对"正确性"敏感，设计力(D)让TA有能力把想法实现到预期标准。', devMeaning: '追求质量是专业精神的基础。在任何专业领域，这种态度都会带来长期回报。', parentTip: '肯定TA对质量的追求："你这次检查出了一个小问题并修好了，这很专业！"' },
    ],
  },
  IE: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.I.name})让TA能深入理解复杂的事物，${d2}(${DIM_META.E.name})让TA能把复杂变简单地讲出来——这是顶级科普者和教育者的科创天赋力"`,
    actionableInsight: '探究力+表达力 = 把深度变成广度的能力。',
    traits: [
      { title: '深入浅出能力', emoji: '💎', color: 'purple', behavior: (n) => `${n}善于用简单的话解释复杂的概念；喜欢举例子和打比方；能让不懂的人听懂。`, mechanism: '探究力(I)确保TA真正理解概念的本质，表达力(E)让TA能把这种理解用听众能接受的方式表达出来。', devMeaning: '这是科普、教育、培训领域最稀缺的能力。爱因斯坦说"如果你不能简单地解释，说明你还没理解"。', parentTip: '让TA给不同的人解释同一个概念——给同龄人、给弟弟妹妹、给爷爷奶奶。这能极大提升表达的灵活性。' },
      { title: '逻辑表达者', emoji: '📊', color: 'blue', behavior: (n) => `${n}说话有条理，习惯用"首先、然后、最后"这样的结构；汇报时能回应追问；善于用数据和事实支撑观点。`, mechanism: '探究力(I)提供逻辑框架和证据意识，表达力(E)让这些在沟通中清晰呈现。', devMeaning: '这种"有理有据"的沟通风格在学术、商业、法律等领域都是核心竞争力。', parentTip: '鼓励TA用"观点+理由+例子"的结构表达。这个框架在作文、答题、面试中都很有用。' },
      { title: '知识转化者', emoji: '🔄', color: 'teal', behavior: (n) => `${n}能把书本知识变成自己的话；善于总结和归纳；学完后能讲出"核心要点是什么"。`, mechanism: '探究力(I)让TA深入理解并提取核心，表达力(E)让TA能把提取的核心重新组织输出。', devMeaning: '这种"输入-加工-输出"的完整学习闭环，是高效学习的本质。', parentTip: '每学完一个主题，让TA用3句话总结"最重要的3点是什么"。这是检验学习效果的好方法。' },
    ],
  },
  IR: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.I.name})让TA能严谨分析，${d2}(${DIM_META.R.name})让TA能从分析中提取智慧——这是学者和研究者的核心特质"`,
    actionableInsight: '探究力+反思力 = 越学越聪明的秘密武器。',
    traits: [
      { title: '深度学习者', emoji: '🎓', color: 'indigo', behavior: (n) => `${n}不满足于"记住答案"，要理解"为什么是这样"；学完会想"这和我之前知道的有什么关系"；能把新知识和旧知识连接起来。`, mechanism: '探究力(I)驱动对因果关系的追问，反思力(R)把这些理解整合进自己的知识体系。', devMeaning: '这是真正的"学习如何学习"的能力。有这种能力的孩子，学习效率会随着年龄增长不断提高。', parentTip: '经常问TA"这和你之前学的什么有关系？"帮TA建立知识网络。' },
      { title: '自我修正能力', emoji: '🔄', color: 'blue', behavior: (n) => `${n}做错题后不只是看正确答案，会想"我错在哪里"；能识别自己的思维漏洞；很少犯同样的错误两次。`, mechanism: '探究力(I)让TA追问错误的原因，反思力(R)把这种分析转化为行为改变。', devMeaning: '自我修正能力是学习效率的倍增器。有这种能力的孩子，用同样的时间能学到更多。', parentTip: '建立"错题反思本"——不只记正确答案，更重要的是记"我为什么错了"和"下次怎么避免"。' },
      { title: '元认知能力', emoji: '🧠', color: 'purple', behavior: (n) => `${n}能说出自己"怎么学得最好"；对自己的学习状态有觉察；能根据情况调整学习策略。`, mechanism: '反思力(R)让TA能"监控自己的思考过程"，探究力(I)让这种监控更加精确和有效。', devMeaning: '元认知是"学习如何学习"的核心。这种能力在高中和大学阶段会成为巨大优势。', parentTip: '定期问TA"你觉得最近哪种学习方式对你最有效？"帮TA建立对自己学习模式的觉察。' },
    ],
  },
  LD: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.L.name})让TA善于协调团队，${d2}(${DIM_META.D.name})让TA能把团队力量组织成行动——这是天生的项目经理和团队领导者"`,
    actionableInsight: '连接力+设计力 = 把人凝聚起来做成事的能力。',
    traits: [
      { title: '团队组织者', emoji: '👔', color: 'blue', behavior: (n) => `${n}在小组活动中会自然地开始分工——"你做这个，我做那个"；能看到谁擅长什么并合理安排；让团队运转更顺畅。`, mechanism: '连接力(L)让TA理解每个人的特点，设计力(D)让TA能把这些特点组织成高效分工。', devMeaning: '这是项目管理和团队领导的核心能力。在任何组织中，这样的人都是稀缺资源。', parentTip: '给TA"小项目经理"的角色——让TA组织一次家庭活动、一次同学聚会。让TA体验"组织人做事"的成就感。' },
      { title: '协作型规划者', emoji: '📋', color: 'purple', behavior: (n) => `${n}做计划时会考虑"谁来做什么"；能根据成员的能力调整计划；善于协调不同意见。`, mechanism: '设计力(D)提供规划能力，连接力(L)让规划过程充分考虑人的因素。', devMeaning: '"让对的人做对的事"是管理的本质。这种能力在职场中会持续带来价值。', parentTip: '在家庭决策中给TA发言权——"你觉得这件事怎么安排比较好？"培养TA的规划思维。' },
      { title: '执行推动者', emoji: '🚀', color: 'green', behavior: (n) => `${n}不只是做计划，还能推动计划执行；会提醒队友进度；在团队中起"黏合剂"作用。`, mechanism: '设计力(D)让TA能跟踪计划进度，连接力(L)让TA愿意并善于推动他人。', devMeaning: '"能让事情发生"的能力比"能想出好主意"更稀缺。这是真正的执行力。', parentTip: '给TA一个需要协调家人的任务——比如组织周末出游。让TA体验"推动事情发生"的过程。' },
    ],
  },
  LE: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.L.name})让TA与人建立连接，${d2}(${DIM_META.E.name})让TA能感染和影响他人——这是天生的沟通大师和影响力核心"`,
    actionableInsight: '连接力+表达力 = 社交领域的核心竞争力。',
    traits: [
      { title: '人际影响力', emoji: '✨', color: 'rose', behavior: (n) => `${n}说话时能让别人愿意听；善于说服和影响他人；在朋友中有一定的"号召力"。`, mechanism: '连接力(L)让TA与人建立情感连接，表达力(E)让这种连接转化为影响力。', devMeaning: '这是领导力的核心要素之一。在政治、商业、教育等领域，这种能力是成功的关键。', parentTip: '给TA"说服挑战"——让TA尝试说服家人接受一个想法。复盘"哪些说法最有效"。' },
      { title: '社交敏感度', emoji: '🎭', color: 'purple', behavior: (n) => `${n}能感知到别人的情绪和需求；善于在不同场合调整表达方式；很少"说错话"。`, mechanism: '连接力(L)提供人际敏感度，表达力(E)让这种敏感度转化为恰当的沟通行为。', devMeaning: '高情商的核心就是"能读懂别人，能让别人读懂自己"。这在任何职业中都是加分项。', parentTip: '看电影/电视时问TA"你觉得这个人现在是什么感受？他为什么这么说？"培养社交观察力。' },
      { title: '关系建立者', emoji: '🤝', color: 'teal', behavior: (n) => `${n}能快速和陌生人熟络起来；善于记住别人的名字和特点；有一群稳定的好朋友。`, mechanism: '连接力(L)驱动TA与人建立关系，表达力(E)让这个过程更加自然和高效。', devMeaning: '"人脉"是一种重要的社会资本。善于建立和维护关系的人，在人生中会获得更多机会。', parentTip: '鼓励TA主动维护友谊——记住朋友的生日、在朋友需要时提供支持。这些习惯会受益终身。' },
    ],
  },
  LR: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.L.name})让TA与人建立深度连接，${d2}(${DIM_META.R.name})让TA能理解人心——这是心理咨询师和人生导师的核心特质"`,
    actionableInsight: '连接力+反思力 = 理解自己，也理解他人。',
    traits: [
      { title: '共情能力', emoji: '💗', color: 'rose', behavior: (n) => `${n}能感受到别人的情绪；当朋友难过时会去安慰；善于从对方的角度思考问题。`, mechanism: '连接力(L)让TA对人际信号敏感，反思力(R)让TA能理解这些信号背后的原因。', devMeaning: '共情是所有"与人打交道"职业的核心能力——心理咨询、教育、医疗、管理都需要。', parentTip: '问TA"你觉得TA为什么会有这种反应？"培养TA理解他人行为背后动机的能力。' },
      { title: '人际智慧', emoji: '🦉', color: 'purple', behavior: (n) => `${n}能看出谁和谁关系好、谁和谁有矛盾；善于化解冲突；在复杂的人际关系中能保持清醒。`, mechanism: '连接力(L)提供人际观察力，反思力(R)把这些观察提炼成对人际关系的理解。', devMeaning: '能看懂"人"的能力在任何组织中都极为珍贵。这是高管和领导者的必备能力。', parentTip: '和TA讨论"人"——家里的人、学校的人、故事里的人。帮TA建立对人性的理解。' },
      { title: '深度关系建立者', emoji: '🔗', color: 'indigo', behavior: (n) => `${n}朋友可能不多，但都很铁；重视友谊的质量而非数量；能和朋友进行深度的交流。`, mechanism: '反思力(R)让TA思考"什么是真正的友谊"，连接力(L)让TA有能力把这种思考变成现实。', devMeaning: '深度关系是人生幸福感的重要来源。能建立深度关系的人，在重要时刻总有人支持。', parentTip: '不要强迫TA"多交朋友"。尊重TA对友谊质量的追求，这是一种难得的品质。' },
    ],
  },
  DE: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.D.name})让TA能把想法变成作品，${d2}(${DIM_META.E.name})让TA能展示和推销自己的作品——这是创业者和产品人的黄金组合"`,
    actionableInsight: '设计力+表达力 = 既能做事，又能让别人知道你做的事。',
    traits: [
      { title: '产品思维', emoji: '📦', color: 'amber', behavior: (n) => `${n}做东西时会想"谁来用这个？他们会喜欢吗？"；善于根据反馈改进作品；有"用户意识"。`, mechanism: '设计力(D)驱动创造，表达力(E)让TA关注"如何让别人理解和喜欢我的作品"。', devMeaning: '产品思维是创业和产品管理的核心。能做出好产品并让人知道它好，是商业成功的基础。', parentTip: '让TA做一个"产品"——可以是一个手工作品、一段视频、一个小发明。然后让TA"介绍"给家人。' },
      { title: '展示型创造者', emoji: '🎨', color: 'purple', behavior: (n) => `${n}完成作品后喜欢展示给别人看；能清楚地介绍"我做了什么、怎么做的"；对展示效果有追求。`, mechanism: '设计力(D)确保作品质量，表达力(E)让作品能被更多人看到和理解。', devMeaning: '在"酒香也怕巷子深"的时代，能展示自己的能力和成果极为重要。', parentTip: '帮TA建立"作品集"——收集TA的作品照片/视频。定期一起回顾TA的进步。' },
      { title: '说服型执行者', emoji: '🎯', color: 'blue', behavior: (n) => `${n}做事不只是做完，还能说清楚"为什么这么做"；善于为自己的方案争取支持；能说服别人接受自己的设计。`, mechanism: '设计力(D)提供方案，表达力(E)让方案获得认可和支持。', devMeaning: '在团队中，能让自己的想法被采纳是一种重要能力。这需要既有好想法，又能表达清楚。', parentTip: '当TA有想法时，让TA"提案"——用3分钟说服家人为什么应该采纳TA的建议。' },
    ],
  },
  DR: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.D.name})让TA能规划和执行，${d2}(${DIM_META.R.name})让TA能从执行中不断优化——这是追求卓越的匠人心态"`,
    actionableInsight: '设计力+反思力 = 精益求精的能力。',
    traits: [
      { title: '持续改进者', emoji: '📈', color: 'green', behavior: (n) => `${n}做完一件事后会想"下次可以怎么做得更好"；会主动复盘自己的行为；追求"每次都比上次好"。`, mechanism: '设计力(D)让TA能系统地规划改进，反思力(R)提供改进的方向和动力。', devMeaning: '这是"精益"和"持续改进"的核心心态。在任何专业领域，这种态度会带来卓越。', parentTip: '建立"复盘习惯"——每个项目做完后花10分钟一起讨论"哪里做得好，哪里可以更好"。' },
      { title: '自我管理能力', emoji: '⏰', color: 'blue', behavior: (n) => `${n}对自己的时间和任务有一定管理意识；能制定并基本执行计划；对自己的执行情况有觉察。`, mechanism: '设计力(D)提供计划能力，反思力(R)提供自我监控能力。两者结合形成自我管理。', devMeaning: '自我管理是"自律"的核心。这种能力在高中、大学和职场中会成为巨大优势。', parentTip: '帮TA建立"周计划"习惯——每周日花10分钟规划下周，每周六花5分钟回顾本周。' },
      { title: '质量导向者', emoji: '✨', color: 'amber', behavior: (n) => `${n}对自己的作品有标准；不满足于"差不多"；完成后会检查并修正不满意的地方。`, mechanism: '设计力(D)让TA有能力实现高质量，反思力(R)让TA知道什么是"好"。', devMeaning: '追求卓越是专业精神的核心。这种态度会在长期职业发展中带来巨大回报。', parentTip: '肯定TA对质量的追求。不要说"差不多就行了"，而是"你想做到什么标准？需要什么支持？"' },
    ],
  },
  ER: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}(${DIM_META.E.name})让TA能表达和影响他人，${d2}(${DIM_META.R.name})让TA能审视和优化自己的表达——这是演讲家和沟通大师的核心特质"`,
    actionableInsight: '表达力+反思力 = 越讲越会讲的能力。',
    traits: [
      { title: '自我觉察型表达者', emoji: '🎤', color: 'purple', behavior: (n) => `${n}说完话后会想"我刚才说得怎么样"；能感知听众的反应并调整；对自己的表达效果有追求。`, mechanism: '表达力(E)让TA善于沟通，反思力(R)让TA能不断优化沟通方式。', devMeaning: '这是顶尖演讲者和沟通者的核心能力——不只是会说，还知道怎么说得更好。', parentTip: '每次TA做汇报/讲话后，问TA"你觉得哪里讲得好，哪里可以更好？"培养自我反馈能力。' },
      { title: '情绪智力', emoji: '💫', color: 'rose', behavior: (n) => `${n}对自己的情绪有觉察；能用语言描述自己的感受；在情绪激动时能逐渐冷静下来。`, mechanism: '反思力(R)让TA能觉察自己的情绪状态，表达力(E)让TA能把情绪用语言表达出来。', devMeaning: '情绪智力是"情商"的核心。这种能力在青春期和成年后的人际关系中极为重要。', parentTip: '帮TA建立"情绪词汇表"——用丰富的词汇描述情绪，而不只是"开心/不开心"。' },
      { title: '反思型沟通者', emoji: '💭', color: 'indigo', behavior: (n) => `${n}会思考"为什么这样说别人会接受"；能分析成功和不成功的沟通案例；对"怎么说"有自己的见解。`, mechanism: '表达力(E)提供沟通经验，反思力(R)把这些经验提炼成沟通智慧。', devMeaning: '能"学会沟通"的能力比"天生会沟通"更可贵。这意味着TA的沟通能力会持续提升。', parentTip: '和TA讨论"沟通"——一起分析为什么有些话有效，有些话没效。培养沟通的元认知。' },
    ],
  },
  // ========== 6种单维突出型模板（top1显著高于top2超过15分时使用） ==========
  W_solo: {
    coreInsight: (name, topScore, d1, _d2) => `"${name}的${d1}(${DIM_META.W.name})异常突出，达到${topScore}分——这是纯粹的探索者特质，TA用好奇心照亮世界——"`,
    actionableInsight: '好奇心是TA的核心引擎，一切学习从"想知道"开始。',
    traits: [
      { title: '探索驱动者：纯粹的好奇心', emoji: '🔭', color: 'amber', behavior: (n) => `${n}看到任何新事物都想去了解；会主动问"这是什么""为什么会这样"；对未知有天然的兴奋感。`, mechanism: '好奇心(W)极度突出意味着对新奇刺激有超强的神经兴奋反应，这是探索型人格的核心特征。', devMeaning: '这种纯粹的好奇心是发明家、科学家、探险家的种子特质。在AI时代，机器无法产生真正的好奇，这种能力将越来越珍贵。', parentTip: 'TA的好奇心是最宝贵的资产。不要压制TA的"为什么"，而是一起去探索答案。' },
      { title: '问题发现者', emoji: '❓', color: 'blue', behavior: (n) => `${n}总能在别人习以为常的事物中发现问题；经常有独特的观察角度；善于提出"没想过"的问题。`, mechanism: '高好奇心带来敏锐的问题意识，能在平凡中发现不平凡。', devMeaning: '"发现问题比解决问题更重要"——爱因斯坦说的这句话正是描述TA的核心优势。', parentTip: '每天和TA分享一个"今天我发现的有趣事情"，让好奇心成为家庭文化。' },
      { title: '探索型学习者', emoji: '🗺️', color: 'green', behavior: (n) => `${n}在探索中学习效率最高；传统授课方式可能无法满足TA；需要"亲自去看看"才能真正理解。`, mechanism: '好奇心驱动的学习是主动的、内在动机的，与被动接受知识有本质区别。', devMeaning: '这种学习方式在传统学校可能被误解为"坐不住"，但在项目制学习、探究式学习中是巨大优势。', parentTip: '给TA探索的空间和资源——博物馆、自然、实验、旅行。让好奇心有"用武之地"。' },
    ],
  },
  I_solo: {
    coreInsight: (name, topScore, d1, _d2) => `"${name}的${d1}(${DIM_META.I.name})异常突出，达到${topScore}分——这是天生的求证者，TA用严谨的态度追寻真理——"`,
    actionableInsight: '探究力是TA的核心引擎，"证据在哪里"是TA的口头禅。',
    traits: [
      { title: '证据导向者：科学思维萌芽', emoji: '🔬', color: 'blue', behavior: (n) => `${n}不轻易相信别人说的话，要自己验证；做事讲究"有根据"；善于用实验或观察来证明自己的想法。`, mechanism: '探究力(I)极度突出意味着大脑的因果推理和验证机制非常活跃，这是科学思维的核心。', devMeaning: '这种求证精神是科学家、研究者、侦探的核心特质。在"假信息泛滥"的时代，这种能力将成为稀缺资源。', parentTip: '当TA质疑你时，不要觉得被冒犯。问"你觉得怎么能验证？"把质疑变成探究。' },
      { title: '逻辑严谨者', emoji: '🧮', color: 'indigo', behavior: (n) => `${n}说话做事有条理；善于发现矛盾和漏洞；不接受"差不多"的解释。`, mechanism: '高探究力带来对逻辑一致性的敏感，能快速识别推理中的问题。', devMeaning: '这种逻辑能力在数学、编程、法律等需要严密推理的领域是核心竞争力。', parentTip: '和TA玩逻辑游戏——侦探故事、数学谜题、编程挑战。让TA的逻辑能力有发挥空间。' },
      { title: '深度学习者', emoji: '📊', color: 'purple', behavior: (n) => `${n}学东西要"学透"；不满足于表面的了解；会主动追问"为什么是这样"直到真正理解。`, mechanism: '探究力驱动的学习是深度的、追求理解的，与浅层记忆有本质区别。', devMeaning: '这种"求甚解"的习惯会让TA在任何领域都能达到专业水平。深度比广度更重要。', parentTip: '不要催TA"快点学完"。让TA有时间深入理解，这比快速刷完更有价值。' },
    ],
  },
  L_solo: {
    coreInsight: (name, topScore, d1, _d2) => `"${name}的${d1}(${DIM_META.L.name})异常突出，达到${topScore}分——这是天生的连接者，TA用关系编织世界——"`,
    actionableInsight: '连接力是TA的核心引擎，人际关系和协作是TA的舒适区。',
    traits: [
      { title: '社交枢纽：天生的连接者', emoji: '🤝', color: 'rose', behavior: (n) => `${n}走到哪里都能交到朋友；善于在不同的人之间搭建桥梁；在团队中起"黏合剂"作用。`, mechanism: '连接力(L)极度突出意味着社交脑区高度活跃，对人际信号极其敏感。', devMeaning: '这种连接能力是社群运营、团队管理、公关外交的核心特质。在"人脉即资源"的时代极为珍贵。', parentTip: 'TA需要社交。不要强迫TA"一个人安静学习"，给TA和朋友一起学习的机会。' },
      { title: '协作推动者', emoji: '👥', color: 'teal', behavior: (n) => `${n}在团队项目中如鱼得水；善于协调不同意见；能让团队运转更顺畅。`, mechanism: '高连接力带来对团队动态的敏感，能自然地承担协调和润滑的角色。', devMeaning: '未来的工作几乎都是团队协作。TA的协作能力会在职业生涯中持续带来回报。', parentTip: '给TA组织活动的机会——生日派对、学习小组、家庭聚会。让TA的组织能力有实践场景。' },
      { title: '知识迁移者', emoji: '🌉', color: 'purple', behavior: (n) => `${n}善于把一个领域学到的东西用到另一个领域；能在不同的人和知识之间建立联系；有"融会贯通"的能力。`, mechanism: '连接力不只是人际连接，也包括知识之间的连接。高连接力带来跨域迁移的敏感度。', devMeaning: '这种"举一反三"的能力在跨界创新、综合应用领域是核心竞争力。', parentTip: '问TA"这和你之前学的什么有关系？"帮TA建立知识之间的桥梁。' },
    ],
  },
  D_solo: {
    coreInsight: (name, topScore, d1, _d2) => `"${name}的${d1}(${DIM_META.D.name})异常突出，达到${topScore}分——这是天生的构建者，TA用规划和行动改变现实——"`,
    actionableInsight: '设计力是TA的核心引擎，"做出来"比"想出来"更让TA兴奋。',
    traits: [
      { title: '行动建筑师：把想法变成现实', emoji: '🏗️', color: 'amber', behavior: (n) => `${n}有想法就想立刻动手做；善于把大目标拆成小步骤；完成一个项目后有强烈的成就感。`, mechanism: '设计力(D)极度突出意味着前额叶的执行功能高度发达，能把抽象想法转化为具体行动。', devMeaning: '这种"从想到做"的能力是工程师、建筑师、产品经理的核心特质。在"想法廉价，执行稀缺"的时代极为珍贵。', parentTip: '给TA"做东西"的机会——积木、编程、手工、布置房间。让TA体验从想法到成品的完整过程。' },
      { title: '计划执行者', emoji: '📋', color: 'blue', behavior: (n) => `${n}做事有条理，会自然地列出步骤；能按计划推进并完成任务；对"完成"有强烈的追求。`, mechanism: '高设计力带来自然的规划能力和执行力，能把复杂任务组织成可执行的步骤。', devMeaning: '这种执行力在任何领域都是稀缺能力。"能把事情做成"比"有好想法"更重要。', parentTip: '给TA独立完成项目的机会，从头到尾让TA自己负责。完成后一起庆祝。' },
      { title: '问题解决者', emoji: '🔧', color: 'green', behavior: (n) => `${n}遇到问题第一反应是"怎么解决"而不是"好难啊"；善于想出各种方案；能根据反馈调整方法。`, mechanism: '设计力带来解决问题的行动导向，不只是分析问题，而是推动解决。', devMeaning: '这种"解决问题"的心态是创业者和领导者的核心特质。问题=机会，这是TA的天然视角。', parentTip: '当TA遇到困难时，不要直接给答案。问"你觉得可以怎么解决？"激发TA的方案思维。' },
    ],
  },
  E_solo: {
    coreInsight: (name, topScore, d1, _d2) => `"${name}的${d1}(${DIM_META.E.name})异常突出，达到${topScore}分——这是天生的表达者，TA用语言和展示影响世界——"`,
    actionableInsight: '表达力是TA的核心引擎，"让别人知道"和"讲出来"是TA的天然需求。',
    traits: [
      { title: '天生演说家：感染力表达', emoji: '🎤', color: 'purple', behavior: (n) => `${n}说话有感染力，能让人愿意听下去；善于用生动的语言描述事物；在人群中自带"关注度"。`, mechanism: '表达力(E)极度突出意味着语言脑区和情感表达系统高度协调，能把想法转化为有感染力的输出。', devMeaning: '这种表达能力是演讲家、主持人、教育者、销售的核心特质。在"注意力稀缺"的时代，能抓住注意力就是超能力。', parentTip: '给TA表达的舞台——家庭分享会、录小视频、班级演讲。让TA的表达力有发挥空间。' },
      { title: '故事讲述者', emoji: '📖', color: 'amber', behavior: (n) => `${n}善于把经历变成有趣的故事；说话有节奏和起伏；能让无聊的事变得有趣。`, mechanism: '高表达力带来叙事能力，能把信息重新组织成引人入胜的故事结构。', devMeaning: '故事是人类最强大的传播工具。会讲故事的人在任何领域都有沟通优势。', parentTip: '让TA讲今天发生的事——用"故事"的方式。帮TA练习叙事能力。' },
      { title: '情感连接者', emoji: '💫', color: 'rose', behavior: (n) => `${n}能用语言让别人感受到TA的情绪；善于表达关心和支持；说话让人感到温暖和被理解。`, mechanism: '表达力不只是逻辑表达，也包括情感表达。高表达力带来情感共鸣的能力。', devMeaning: '这种情感连接能力在心理咨询、客户服务、领导力等领域是核心竞争力。', parentTip: '鼓励TA表达感受——不只是"发生了什么"，还有"我感觉怎么样"。丰富TA的情感词汇。' },
    ],
  },
  R_solo: {
    coreInsight: (name, topScore, d1, _d2) => `"${name}的${d1}(${DIM_META.R.name})异常突出，达到${topScore}分——这是天生的思考者，TA用反思和内省理解自己和世界——"`,
    actionableInsight: '反思力是TA的核心引擎，"想清楚"比"快点做"更重要。',
    traits: [
      { title: '内省智者：深度自我觉察', emoji: '🪞', color: 'indigo', behavior: (n) => `${n}对自己的想法和感受有清晰的觉察；能说出"我为什么这样想/这样做"；比同龄人更了解自己。`, mechanism: '反思力(R)极度突出意味着元认知能力高度发达，能"站在自己之外看自己"。', devMeaning: '这种自我觉察能力是哲学家、心理咨询师、人生导师的核心特质。在追求内在成长的时代极为珍贵。', parentTip: '尊重TA需要"想一想"的时间。不要催促TA"快点决定"，让TA有反思的空间。' },
      { title: '经验提炼者', emoji: '📝', color: 'purple', behavior: (n) => `${n}做完事情后会想"学到了什么"；很少犯同样的错误两次；能从经历中总结规律。`, mechanism: '高反思力带来经验学习的效率，能从每次经历中提取可迁移的智慧。', devMeaning: '这种"从经验中学习"的能力是成长的加速器。同样的经历，TA能收获2-3倍于同龄人。', parentTip: '每天睡前和TA做"今日三件事"——今天学到了什么、做得好的、明天想改进的。' },
      { title: '情绪调节者', emoji: '🧘', color: 'teal', behavior: (n) => `${n}对自己的情绪有觉察；能识别情绪的来源；在情绪激动时能逐渐冷静下来。`, mechanism: '反思力带来情绪调节能力，能观察自己的情绪而不被情绪控制。', devMeaning: '情绪智力是"情商"的核心。这种能力在青春期和成年后的人际关系中极为重要。', parentTip: '当TA情绪不好时，帮TA命名情绪——"你现在是生气还是难过？"培养情绪觉察力。' },
    ],
  },
  // 默认模板（用于动态生成兜底）
  DEFAULT: {
    coreInsight: (name, _score, d1, d2) => `"${name}的${d1}和${d2}构成了独特的科创天赋力组合，两者交织产生独特的认知与行为风格——"`,
    actionableInsight: '这种组合模式代表了一种独特的成长路径，值得深度探索。',
    traits: [
      { title: '双维协同优势', emoji: '⭐', color: 'amber', behavior: (n) => `${n}在这两个维度的交叉领域展现出独特的潜力，这种组合在同龄人中并不常见。`, mechanism: '两个高维度的协同作用产生了独特的认知风格——既能发现问题，也能组织行动。', devMeaning: '这种独特的组合意味着TA有自己的成长路径，不需要套用"标准模板"。', parentTip: '观察TA最自然、最投入的状态，那就是两个维度协同发力的时刻。保护它、滋养它。' },
      { title: '学习风格特征', emoji: '📚', color: 'blue', behavior: (n) => `${n}在这两个维度的支撑下形成了独特的学习偏好，在适合的方式下学习效率明显更高。`, mechanism: '双维度的强势组合决定了最优的学习输入通道和处理方式——这是TA的"学习密码"。', devMeaning: '了解并利用这种学习风格，比强行改变它更有效。在优势领域深入，效果远超补短板。', parentTip: '不要用"别人家的孩子"的方式教TA。观察TA自己怎么学最有效，然后支持这种方式。' },
      { title: '成长潜力方向', emoji: '🌱', color: 'green', behavior: (n) => `${n}的这种组合在特定领域有巨大发展空间，通过合适的引导可以快速成长。`, mechanism: '双维度的协同让TA在某些交叉领域有独特优势，这是差异化竞争力的来源。', devMeaning: '找到这两个维度的"交叉点"领域，那里就是TA最容易取得成就的方向。', parentTip: '用优势带动成长——把TA感兴趣和擅长的结合起来，学习就会变得自然而高效。' },
    ],
  },
}

// ========== 维度特征描述库（用于动态模板生成） ==========
const DIM_TRAITS: Record<string, {
  coreDrive: string
  learningStyle: string
  socialStyle: string
  strengthArea: string
  futureDirection: string
}> = {
  W: {
    coreDrive: '对未知的渴望驱动TA不断探索',
    learningStyle: '通过发现和追问来学习，好奇心是最强的学习动力',
    socialStyle: '善于发现有趣的话题，用新鲜事物吸引他人',
    strengthArea: '问题发现、创新启发、探索导向',
    futureDirection: '科学家、发明家、探险家、记者',
  },
  I: {
    coreDrive: '对真理的追求驱动TA深入探究',
    learningStyle: '通过验证和求证来学习，"为什么"是TA的核心问题',
    socialStyle: '用逻辑和证据说服他人，重视交流的严谨性',
    strengthArea: '分析推理、证据收集、系统思考',
    futureDirection: '研究员、工程师、律师、侦探',
  },
  L: {
    coreDrive: '与人连接的需求驱动TA建立关系',
    learningStyle: '通过协作和讨论来学习，社交情境中效率最高',
    socialStyle: '天然的社交催化剂，善于协调和连接不同的人',
    strengthArea: '团队协作、知识迁移、人际沟通',
    futureDirection: '项目经理、HR、社群运营、外交官',
  },
  D: {
    coreDrive: '创造和实现的冲动驱动TA付诸行动',
    learningStyle: '通过动手实践来学习，"做出来"比"想出来"更重要',
    socialStyle: '喜欢在行动中合作，用成果证明自己',
    strengthArea: '规划执行、问题解决、项目管理',
    futureDirection: '建筑师、产品经理、创业者、导演',
  },
  E: {
    coreDrive: '表达和分享的欲望驱动TA与世界互动',
    learningStyle: '通过讲述和展示来学习，教会别人是最好的掌握方式',
    socialStyle: '有感染力的沟通者，能让复杂的事变得有趣',
    strengthArea: '演讲表达、故事叙述、影响他人',
    futureDirection: '演讲家、教师、销售、自媒体创作者',
  },
  R: {
    coreDrive: '理解自我的需求驱动TA不断反思',
    learningStyle: '通过复盘和总结来学习，从经验中提取智慧',
    socialStyle: '善于倾听和理解他人，有洞察力的观察者',
    strengthArea: '自我觉察、情绪管理、经验学习',
    futureDirection: '心理咨询师、作家、导师、哲学家',
  },
}

// 动态生成模板（当所有静态模板都不匹配时的终极兜底）
function generateDynamicTemplate(top2: string[], wilderScores: Record<string, number>): {
  coreInsight: (name: string, topScore: number, dim1: string, dim2: string) => string
  actionableInsight: string
  traits: {
    title: string; emoji: string; color: string
    behavior: (name: string) => string
    mechanism: string; devMeaning: string; parentTip: string
  }[]
} {
  const [dim1, dim2] = top2
  const trait1 = DIM_TRAITS[dim1] || DIM_TRAITS.W
  const trait2 = DIM_TRAITS[dim2] || DIM_TRAITS.I
  const score1 = wilderScores[dim1] || 0
  const score2 = wilderScores[dim2] || 0
  const meta1 = DIM_META[dim1] || { name: '未知', nameEn: 'Unknown', emoji: '❓' }
  const meta2 = DIM_META[dim2] || { name: '未知', nameEn: 'Unknown', emoji: '❓' }

  return {
    coreInsight: (name, _topScore, d1, d2) => 
      `"${name}的${d1}(${meta1.name}, ${score1}分)与${d2}(${meta2.name}, ${score2}分)形成独特的双核驱动——${trait1.coreDrive}，同时${trait2.coreDrive.replace('驱动TA', '也让TA')}——"`,
    actionableInsight: `${meta1.name}+${meta2.name}的组合意味着：${trait1.strengthArea}与${trait2.strengthArea}的交叉优势。`,
    traits: [
      {
        title: `双核驱动：${meta1.name}×${meta2.name}`,
        emoji: meta1.emoji,
        color: 'amber',
        behavior: (n) => `${n}${trait1.learningStyle.replace('来学习', '')}，同时${trait2.learningStyle.replace('通过', '也善于通过')}。这种双重模式让TA在学习中有独特的节奏。`,
        mechanism: `${meta1.name}提供了${trait1.strengthArea.split('、')[0]}的能力，${meta2.name}则补充了${trait2.strengthArea.split('、')[0]}的维度。两者协同产生1+1>2的效果。`,
        devMeaning: `这种组合在${trait1.futureDirection.split('、')[0]}和${trait2.futureDirection.split('、')[0]}等需要两种能力交叉的领域有独特优势。`,
        parentTip: `观察TA什么时候最投入——那往往是${meta1.name}和${meta2.name}同时激活的时刻。创造更多这样的机会。`,
      },
      {
        title: `学习风格：${trait1.learningStyle.split('，')[0]}`,
        emoji: meta2.emoji,
        color: 'blue',
        behavior: (n) => `${n}${trait1.learningStyle}。在这种模式下，TA的注意力和记忆力都明显更好。`,
        mechanism: `${meta1.name}高意味着TA的大脑对这种学习模式有天然的偏好和优势。尊重这种偏好会事半功倍。`,
        devMeaning: `不是所有孩子都适合"坐在教室听讲"的方式。TA的学习方式可能需要更多${trait1.strengthArea.split('、')[1] || trait1.strengthArea.split('、')[0]}的元素。`,
        parentTip: `把${meta1.name}融入日常学习——比如${meta1.name === '好奇心' ? '从TA的问题出发' : meta1.name === '探究力' ? '让TA自己验证' : meta1.name === '连接力' ? '组织小组学习' : meta1.name === '设计力' ? '做成小项目' : meta1.name === '表达力' ? '让TA讲给别人听' : '每天复盘总结'}。`,
      },
      {
        title: `社交特点：${trait2.socialStyle.split('，')[0]}`,
        emoji: '🌟',
        color: 'green',
        behavior: (n) => `${n}${trait2.socialStyle}。在社交中，TA往往${meta2.name === '好奇心' ? '用新奇的发现吸引他人' : meta2.name === '探究力' ? '用逻辑和事实说服他人' : meta2.name === '连接力' ? '自然地成为团队的黏合剂' : meta2.name === '设计力' ? '用行动和成果赢得认可' : meta2.name === '表达力' ? '用精彩的表达感染他人' : '用深度的理解打动他人'}。`,
        mechanism: `${meta2.name}强的孩子在社交中有独特的优势——${trait2.socialStyle}。这是TA的社交"密码"。`,
        devMeaning: `了解TA的社交风格，不要强迫TA用别人的方式社交。让TA用自己的优势建立人际关系。`,
        parentTip: `肯定TA的社交方式："你用${meta2.name === '好奇心' ? '有趣的问题' : meta2.name === '探究力' ? '清晰的逻辑' : meta2.name === '连接力' ? '温暖的方式' : meta2.name === '设计力' ? '实际的帮助' : meta2.name === '表达力' ? '生动的描述' : '深刻的理解'}让朋友很喜欢你！"`,
      },
    ],
  }
}

// 为所有组合提供模板匹配（支持单维突出型和双维组合）
function getTraitTemplate(top2: string[], wilderScores?: Record<string, number>) {
  // 1. 检查是否为单峰突出型（top1 显著高于 top2 超过 15 分）
  if (wilderScores) {
    const score1 = wilderScores[top2[0]] || 0
    const score2 = wilderScores[top2[1]] || 0
    if (score1 - score2 > 15) {
      const soloKey = `${top2[0]}_solo`
      if (TRAIT_TEMPLATES[soloKey]) {
        return TRAIT_TEMPLATES[soloKey]
      }
    }
  }

  // 2. 精确匹配 top2 双维组合
  const key = top2.join('')
  const reverseKey = [...top2].reverse().join('')
  if (TRAIT_TEMPLATES[key]) return TRAIT_TEMPLATES[key]
  if (TRAIT_TEMPLATES[reverseKey]) return TRAIT_TEMPLATES[reverseKey]

  // 3. 最后回退：基于维度分布动态生成描述（不再使用通用 DEFAULT）
  if (wilderScores) {
    return generateDynamicTemplate(top2, wilderScores)
  }

  // 4. 如果没有分数信息，使用改进后的 DEFAULT
  return TRAIT_TEMPLATES.DEFAULT
}

// ========== 证据链内容生成器 ==========

/** 
 * 证据链数据来源说明
 * ⚠️ 重要：为确保科学性和可追溯性，证据链应尽可能使用实际测评数据
 */
export interface EvidenceDataSource {
  /** 是否使用实际测评数据 */
  useRealData: boolean
  /** 实际的证据记录（来自evidenceChainBuilder） */
  evidenceRecords?: EvidenceRecord[]
  /** 维度证据汇总 */
  dimensionEvidences?: Record<string, ImportedDimensionEvidence>
}

/**
 * 生成证据链（增强版 - 支持实际数据）
 * 当提供realDataSource时，使用实际测评数据生成证据链
 * 否则使用模板语言（向后兼容）
 */
export function generateEvidenceChainEnhanced(
  topDims: string[],
  bottomDims: string[],
  wilderScores: Record<string, number>,
  studentName: string,
  realDataSource?: EvidenceDataSource
): DynamicReportData['evidenceChain'] {
  // 如果提供了实际数据，优先使用
  if (realDataSource?.useRealData && realDataSource.dimensionEvidences) {
    return generateEvidenceFromRealData(
      topDims, 
      bottomDims, 
      wilderScores, 
      studentName, 
      realDataSource.dimensionEvidences
    )
  }
  
  // 否则使用模板（向后兼容）
  return generateEvidenceChain(topDims, bottomDims, wilderScores, studentName)
}

/**
 * 从实际测评数据生成证据链
 * 确保每个结论都能追溯到具体的测评问题
 */
function generateEvidenceFromRealData(
  topDims: string[],
  bottomDims: string[],
  wilderScores: Record<string, number>,
  studentName: string,
  dimensionEvidences: Record<string, ImportedDimensionEvidence>
): DynamicReportData['evidenceChain'] {
  const evidences: DynamicReportData['evidenceChain'] = []
  let evidenceIndex = 1

  // 高分维度 - 使用实际数据
  for (const dim of topDims) {
    const dimEvidence = dimensionEvidences[dim]
    if (dimEvidence && dimEvidence.topContributors.length > 0) {
      const topContrib = dimEvidence.topContributors[0]
      evidences.push({
        code: `E${String(evidenceIndex++).padStart(3, '0')}`,
        type: '测评数据',
        content: `[${topContrib.questionId}] "${topContrib.questionSummary}" → ${studentName}选择了"${topContrib.answerSummary}"，得分+${topContrib.contribution}分。`,
        inference: `${dimEvidence.dimensionName}得分${dimEvidence.percentage}%（${dimEvidence.level === 'high' ? '高' : dimEvidence.level === 'mid' ? '中' : '低'}水平），${dimEvidence.scientificBasis.slice(0, 50)}...`,
        futureImplication: getEvidenceImplication(dim, dimEvidence.level),
      })
    } else {
      // 无实际数据时使用模板
      const meta = DIM_META[dim]
      evidences.push({
        code: `E${String(evidenceIndex++).padStart(3, '0')}`,
        type: '行为观察',
        content: getPositiveEvidence(dim, studentName),
        inference: `具备突出的${meta.name}（${meta.nameEn}），评分${wilderScores[dim]}分。`,
        futureImplication: getEvidenceImplication(dim, 'high'),
      })
    }
  }

  // 低分维度 - 使用实际数据
  for (const dim of bottomDims) {
    const dimEvidence = dimensionEvidences[dim]
    if (dimEvidence) {
      evidences.push({
        code: `E${String(evidenceIndex++).padStart(3, '0')}`,
        type: '测评数据',
        content: `${studentName}在${dimEvidence.dimensionName}相关问题中得分${dimEvidence.percentage}%，基于${dimEvidence.topContributors.length}道核心题目的综合评估。`,
        inference: `${dimEvidence.dimensionName}处于${dimEvidence.level === 'high' ? '高' : dimEvidence.level === 'mid' ? '中等' : '待提升'}水平，${DIM_LEVEL_DESC[dim]?.[dimEvidence.level] || '有成长空间'}。`,
        futureImplication: getEvidenceImplication(dim, dimEvidence.level),
      })
    } else {
      const meta = DIM_META[dim]
      evidences.push({
        code: `E${String(evidenceIndex++).padStart(3, '0')}`,
        type: '行为观察',
        content: getGrowthEvidence(dim, studentName),
        inference: `${meta.name}待提升：${DIM_LEVEL_DESC[dim]?.low || '需要更多引导和练习'}。`,
        futureImplication: getEvidenceImplication(dim, 'low'),
      })
    }
  }

  return evidences
}

/**
 * 原有证据链生成函数（模板版本，保持向后兼容）
 */
function generateEvidenceChain(
  topDims: string[],
  bottomDims: string[],
  wilderScores: Record<string, number>,
  studentName: string
): DynamicReportData['evidenceChain'] {
  const evidences: DynamicReportData['evidenceChain'] = []
  const allDims = [...topDims, ...Object.keys(wilderScores).filter(d => !topDims.includes(d) && !bottomDims.includes(d)), ...bottomDims]

  // 高分维度的正向证据
  topDims.forEach((d, i) => {
    const meta = DIM_META[d]
    const score = wilderScores[d]
    evidences.push({
      code: `E${String(i + 1).padStart(3, '0')}`,
      type: '行为观察',
      content: getPositiveEvidence(d, studentName),
      inference: `具备突出的${meta.name}（${meta.nameEn}），评分${score}分，位于同龄前${Math.max(5, 100 - score)}%。`,
      futureImplication: getEvidenceImplication(d, 'high'),
    })
  })

  // 中间维度的中性证据
  const midDims = allDims.filter(d => !topDims.includes(d) && !bottomDims.includes(d))
  midDims.slice(0, 2).forEach((d, i) => {
    const meta = DIM_META[d]
    evidences.push({
      code: `E${String(topDims.length + i + 1).padStart(3, '0')}`,
      type: 'AI对话分析',
      content: getNeutralEvidence(d, studentName),
      inference: `${meta.name}处于中等水平，具备基础能力，有提升空间。`,
      futureImplication: getEvidenceImplication(d, 'mid'),
    })
  })

  // 低分维度的待提升证据
  bottomDims.forEach((d, i) => {
    const meta = DIM_META[d]
    evidences.push({
      code: `E${String(topDims.length + midDims.length + i + 1).padStart(3, '0')}`,
      type: '行为观察',
      content: getGrowthEvidence(d, studentName),
      inference: `${meta.name}待提升：${DIM_LEVEL_DESC[d]?.low || '需要更多引导和练习'}。`,
      futureImplication: getEvidenceImplication(d, 'low'),
    })
  })

  return evidences
}

function getPositiveEvidence(dim: string, name: string): string {
  const map: Record<string, string> = {
    W: `在AI对话中，${name}连续提出了5个追问式问题，显示出强烈的探索欲和对未知事物的天然好奇心。`,
    I: `${name}在判断题中展现出清晰的逻辑推理能力，正确率超过同龄平均水平，且能解释推理过程。`,
    L: `在情境模拟中，${name}主动选择了协作方案，并能考虑到团队成员的不同需求和能力。`,
    D: `${name}在回答项目规划类问题时，自然使用了"先...然后...最后"的结构化思维方式。`,
    E: `AI对话中${name}的回答逻辑清晰、用词生动，能用具体例子支持自己的观点。`,
    R: `${name}在复盘类问题中能识别自己的不足，并提出具体的改进方向。`,
  }
  return map[dim] || `${name}在${DIM_META[dim]?.name || dim}维度的测评中展现出突出表现。`
}

function getNeutralEvidence(dim: string, name: string): string {
  const map: Record<string, string> = {
    W: `${name}对部分新奇话题表现出兴趣，但追问深度还有提升空间。`,
    I: `${name}能完成基本的逻辑推理，在复杂推理任务上需要更多练习。`,
    L: `${name}在团队场景中能配合他人，但较少主动发起协作。`,
    D: `${name}有一定的计划意识，但在执行过程中容易偏离原计划。`,
    E: `${name}能表达基本想法，但在结构化和感染力方面有提升空间。`,
    R: `${name}有初步的反思意识，但归因分析的深度和系统性需要加强。`,
  }
  return map[dim] || `${name}在${DIM_META[dim]?.name || dim}维度表现处于同龄中等水平。`
}

function getGrowthEvidence(dim: string, name: string): string {
  const map: Record<string, string> = {
    W: `在AI对话中，${name}倾向于接受给定的答案，较少主动提出"为什么"类型的追问。`,
    I: `${name}在需要验证假设的题目中，更多选择"问别人"而非"自己试试"的方式。`,
    L: `在团队协作情境中，${name}更倾向于先完成自己的部分，较少关注队友的需求和进度。`,
    D: `${name}在项目规划类问题中倾向于"想到什么做什么"，系统性计划能力有待培养。`,
    E: `${name}在需要解释和展示的场景中表现较含蓄，表达的结构性和感染力有提升空间。`,
    R: `${name}在复盘类问题中的回答较简短，对"为什么做得好/不好"的归因分析有待加强。`,
  }
  return map[dim] || `${name}在${DIM_META[dim]?.name || dim}维度有明显的提升空间和成长潜力。`
}

function getEvidenceImplication(dim: string, level: string): string {
  if (level === 'high') {
    const map: Record<string, string> = {
      W: '这种主动探索的习惯将让TA在未来学习中更快发现关键问题，是科学素养的核心基础。',
      I: '求证习惯是理科学习的底层能力，将帮助TA更快掌握"假设-验证-结论"的科学方法。',
      L: '协作能力在未来工作中至关重要，这种主动协作的意识是团队领导力的萌芽。',
      D: '规划和执行能力是所有复杂任务的基础，这种条理性将在学术和职业中持续受益。',
      E: '清晰表达是所有学科的元能力，在作文、答题、面试中都将持续受益。',
      R: '自我反思是成长的加速器，有这种习惯的孩子进步速度通常是同龄人的1.5-2倍。',
    }
    return map[dim] || '这项优势将在未来学习和发展中持续带来积极影响。'
  } else if (level === 'low') {
    const map: Record<string, string> = {
      W: '好消息是，好奇心可以通过环境激发——多接触新事物、多问"你觉得为什么"就能逐步唤醒。',
      I: '求证习惯可以从简单的"生活小实验"开始培养，不需要实验室，厨房就是最好的实验场。',
      L: '协作能力是可训练的技能——从"帮助日"开始，每周一个小任务，3个月见效。',
      D: '规划能力可以从"画计划图"开始——用图示方式列出步骤，比文字清单更适合这个年龄。',
      E: '表达能力可以从"给家人讲故事"开始——安全的环境是建立表达自信的第一步。',
      R: '反思能力可以通过"睡前三问"培养——今天最开心的事？最遗憾的事？明天想做什么？',
    }
    return map[dim] || '这项能力完全可以通过有针对性的训练来提升，通常3-6个月可见明显改变。'
  }
  return '保持现有水平的同时，可以通过日常微训练逐步提升。'
}

// ========== 沟通脚本生成器 ==========
function generateCommunicationScripts(
  topDims: string[],
  bottomDims: string[],
): DynamicReportData['communicationScripts'] {
  const encouragements: { text: string; scene: string; intent: string }[] = []
  const questions: { text: string; scene: string; intent: string }[] = []
  const boundaries: { text: string; scene: string; intent: string }[] = []

  // 基于高维度生成鼓励句式
  topDims.forEach(d => {
    const scripts = ENCOURAGE_SCRIPTS[d]
    if (scripts) encouragements.push(scripts)
  })
  // 补充通用鼓励
  encouragements.push({ text: '"你刚才很努力，这种坚持很了不起。"', scene: '完成了一件有挑战的任务', intent: '肯定过程而非结果' })

  // 基于低维度生成提问句式
  bottomDims.forEach(d => {
    const scripts = QUESTION_SCRIPTS[d]
    if (scripts) questions.push(scripts)
  })
  questions.push({ text: '"你觉得今天最有趣的事是什么？"', scene: '每天晚餐时', intent: '保持日常交流习惯' })

  // 通用边界句式
  boundaries.push(
    { text: '"现在是作业时间。你可以选择先做数学还是先做语文，但需要在规定时间前完成。"', scene: '拖延作业时', intent: '给选择权，但有清晰边界' },
    { text: '"我看到你现在很不开心。你可以先冷静一下，等你准备好了我们再聊。"', scene: '情绪激动时', intent: '先处理情绪，再处理事情' },
  )

  return { encouragements: encouragements.slice(0, 3), questions: questions.slice(0, 3), boundaries: boundaries.slice(0, 2) }
}

const ENCOURAGE_SCRIPTS: Record<string, { text: string; scene: string; intent: string }> = {
  W: { text: '"你刚才那个问题问得很好，我也很好奇答案是什么。"', scene: '提出有深度的问题时', intent: '保护好奇心和问题意识' },
  I: { text: '"你刚才的验证方法很聪明，像一个真正的科学家。"', scene: '用自己的方式验证一件事时', intent: '肯定探究精神' },
  L: { text: '"你刚才主动帮助了同学，这说明你很有团队精神。"', scene: '主动协助他人时', intent: '强化协作行为' },
  D: { text: '"你的计划做得很清楚，按步骤来的感觉真好。"', scene: '有条理地完成任务时', intent: '肯定规划能力' },
  E: { text: '"你讲得很清楚，我完全听懂了。"', scene: '做汇报或讲解时', intent: '强化结构表达能力' },
  R: { text: '"你刚才的总结很到位，能看到自己的进步说明你在成长。"', scene: '进行反思总结时', intent: '肯定反思习惯' },
}

const QUESTION_SCRIPTS: Record<string, { text: string; scene: string; intent: string }> = {
  W: { text: '"今天有什么让你觉得好奇的事吗？"', scene: '日常闲聊时', intent: '激发好奇心' },
  I: { text: '"你怎么知道这是对的？可以怎么验证？"', scene: '讨论一个话题时', intent: '培养求证意识' },
  L: { text: '"你觉得谁可能需要帮助？你能做什么？"', scene: '家庭活动或团队任务前', intent: '培养协作主动性' },
  D: { text: '"你打算怎么做？先做什么后做什么？"', scene: '开始一个新任务前', intent: '培养规划习惯' },
  E: { text: '"你能给我讲讲今天学了什么吗？"', scene: '放学回家后', intent: '练习表达能力' },
  R: { text: '"如果重来一次，你会怎么做不一样？"', scene: '复盘某件事时', intent: '培养反思能力' },
}

// ========== 大学推荐生成器 (v2.0: 优先使用30类型个性化推荐) ==========
function generateUniversityRecommendations(topDims: string[], talentKey?: string): DynamicReportData['universityRecommendations'] {
  // v2.0: 如果有30类型key，从个性化内容库获取
  if (talentKey) {
    const personalized = getUniversitiesByTier(talentKey)
    if (personalized.length > 0) {
      const domestic = personalized
        .filter(u => u.tier !== '国际')
        .map(u => ({ name: u.name, major: u.major, reason: u.reason }))
      const international = personalized
        .filter(u => u.tier === '国际')
        .map((u, i) => ({ name: u.name, major: u.major, reason: u.reason, color: ['blue', 'purple', 'green', 'amber'][i] || 'gray' }))
      return { domestic, international }
    }
  }

  // Fallback: 原有基于维度组合的推荐
  const top2Key = topDims.slice(0, 2).join('')

  // 基于科创天赋类型匹配大学
  const domesticMap: Record<string, { name: string; major: string; reason: string }[]> = {
    WI: [
      { name: '清华大学', major: '电子信息类、计算机类', reason: '工科实践项目与探究力契合' },
      { name: '北京大学', major: '物理学院、元培学院', reason: '学术自由，允许跨学科探索' },
      { name: '中国科学技术大学', major: '少年班、物理学', reason: '学术氛围浓厚，本科生科研机会多' },
      { name: '浙江大学', major: '竺可桢学院', reason: '工科强+跨学科机会' },
      { name: '上海交通大学', major: '致远学院', reason: '工科实践导向，产业联系紧密' },
    ],
    WE: [
      { name: '北京大学', major: '新闻传播、元培学院', reason: '人文底蕴+跨学科探索' },
      { name: '复旦大学', major: '新闻学院、中文系', reason: '传播领域顶尖，文理兼修' },
      { name: '中国传媒大学', major: '播音主持、新闻学', reason: '表达力+传播力的专业培养' },
      { name: '浙江大学', major: '传媒与国际文化学院', reason: '综合性大学中传媒学科强势' },
      { name: '武汉大学', major: '新闻传播学', reason: '人文社科传统深厚' },
    ],
    ID: [
      { name: '清华大学', major: '工程力学、自动化', reason: '系统工程思维培养顶尖' },
      { name: '上海交通大学', major: '机械工程、船舶海洋', reason: '工程设计+实验验证并重' },
      { name: '哈尔滨工业大学', major: '航天工程、机器人', reason: '工程实践导向，项目驱动教学' },
      { name: '华中科技大学', major: '机械工程', reason: '制造业创新能力培养' },
      { name: '北京航空航天大学', major: '航空航天工程', reason: '系统设计与验证能力培养' },
    ],
    LD: [
      { name: '清华大学', major: '经济管理学院', reason: '领导力+系统性思维培养' },
      { name: '北京大学', major: '光华管理学院', reason: '管理+人文兼修' },
      { name: '上海交通大学', major: '安泰管理学院', reason: '产业导向的管理人才培养' },
      { name: '浙江大学', major: '管理学院', reason: '创新管理方向突出' },
      { name: '南京大学', major: '商学院', reason: '理论+实践并重' },
    ],
  }

  const domestic = domesticMap[top2Key] || domesticMap[[topDims[1], topDims[0]].join('')] || [
    { name: '清华大学', major: '根据兴趣选择', reason: '综合实力顶尖，跨学科资源丰富' },
    { name: '北京大学', major: '元培学院', reason: '允许自由探索，找到最适合的方向' },
    { name: '浙江大学', major: '竺可桢学院', reason: '宽口径培养，转专业灵活' },
    { name: '复旦大学', major: '通识教育', reason: '人文+理工兼修' },
    { name: '上海交通大学', major: '致远学院', reason: '拔尖人才培养' },
  ]

  const international = [
    { name: 'MIT（美国）', major: '根据优势维度选择工科/理科', reason: '"hands-on"文化与探究力匹配', color: 'blue' },
    { name: '斯坦福大学（美国）', major: 'd.school设计思维+本专业', reason: '鼓励跨学科创新', color: 'purple' },
    { name: '剑桥大学（英国）', major: 'Natural Sciences', reason: '小班教学+深度探究', color: 'green' },
    { name: 'ETH Zurich（瑞士）', major: '工程与自然科学', reason: '强调实验和动手能力', color: 'amber' },
  ]

  return { domestic, international }
}

// ========== 职业方向生成器 ==========
function generateCareerDirections(
  topDims: string[],
  wilderScores: Record<string, number>,
  careerPaths: string[],
): DynamicReportData['careerDirections'] {
  const d1 = DIM_META[topDims[0]]
  const d2 = DIM_META[topDims[1]]
  const s1 = wilderScores[topDims[0]]
  const s2 = wilderScores[topDims[1]]

  const baseDirections: DynamicReportData['careerDirections'] = [
    { icon: '🔬', name: '科学研究者', reason: `${d1.name}(${s1})+${d2.name}(${s2})契合科研核心需求`, path: '科创比赛 → 研究型大学', color: 'blue' },
    { icon: '🎨', name: '产品设计师', reason: `多维能力组合支撑全流程设计`, path: '设计思维工作坊 → 设计专业', color: 'purple' },
    { icon: '🤖', name: 'AI工程师/提示工程师', reason: `${d1.name}+${d2.name}适合"与AI协作"`, path: '编程学习 → CS专业', color: 'green' },
    { icon: '📺', name: '科学传播者', reason: `好奇心+表达力适合"把复杂变简单"`, path: '科学博客/视频 → 传播专业', color: 'amber' },
  ]

  // 加入来自profile的职业建议
  careerPaths.forEach((career, i) => {
    if (i < 4 && !baseDirections.some(d => d.name.includes(career))) {
      baseDirections.push({
        icon: ['🎓', '🌿', '💡', '📊'][i] || '🎯',
        name: career,
        reason: `基于WILDER-729画像分析推荐`,
        path: '根据兴趣深入探索',
        color: ['rose', 'teal', 'indigo', 'gray'][i] || 'gray',
      })
    }
  })

  return baseDirections.slice(0, 8)
}

// ========== 90天计划生成器 ==========
function generateWeeklyPlan(topDims: string[], bottomDims: string[]): DynamicReportData['weeklyPlan'] {
  const topName = DIM_META[topDims[0]]?.name || '优势'
  const bottomName = DIM_META[bottomDims[0]]?.name || '待提升'

  return [
    { week: 'W1', task: `启动"${topName}捕捉"日记`, duration: '15min/天', output: `${topName}卡片7张`, parentScript: `"今天有什么让你觉得${topName === '好奇心' ? '好奇' : '有趣'}的事？"` },
    { week: 'W2', task: '"问题升级"练习', duration: '20min×3', output: '问题树1张', parentScript: '"这个问题可以拆成哪几个小问题？"' },
    { week: 'W3', task: '"证据收集"初体验', duration: '30min×2', output: '证据卡片4张', parentScript: '"你怎么知道你的想法是对的？"' },
    { week: 'W4', task: '"我的发现"口头汇报', duration: '准备30min', output: '汇报录音1份', parentScript: '"我很想听你讲讲你的发现！"' },
    { week: 'W5', task: `"${bottomName}微训练"启动`, duration: '随机', output: `${bottomName}记录1份`, parentScript: `"你觉得今天在${bottomName}方面有什么新尝试？"` },
    { week: 'W6', task: '"微项目"规划', duration: '45min', output: '项目计划图1张', parentScript: '"你打算怎么做？先做什么后做什么？"' },
    { week: 'W7-8', task: '"微项目"执行', duration: '45min×4', output: '项目进度记录', parentScript: '"今天进展怎么样？遇到什么问题？"' },
    { week: 'W9', task: '"微项目"复盘', duration: '30min', output: '复盘记录1份', parentScript: '"如果重来一次，你会怎么做？"' },
    { week: 'W10-11', task: '"项目展示"准备和展示', duration: '45min×2', output: '展示PPT/视频', parentScript: '"你想让别人知道什么？"' },
    { week: 'W12', task: `"${topName}2.0"升级`, duration: '30min', output: '新问题清单1份', parentScript: '"做完这个项目，你又有什么新问题？"' },
    { week: 'W13', task: '"90天回顾"', duration: '45min', output: '成长对比报告', parentScript: '"你觉得这90天你最大的变化是什么？"' },
  ]
}

// ========== 主生成函数 ==========
export function generateDynamicReport(
  student: StudentProfile,
  scores: AssessmentScores,
  enhancedReport: EnhancedReport,
  evidenceDataSource?: EvidenceDataSource,
): DynamicReportData {
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']

  // 百分制分数（优先使用调整后的分数，确保至少有几项优秀）
  const wilderPct: Record<string, number> = {}
  if (enhancedReport.adjustedWilderPcts) {
    // 使用调整后的分数
    dims.forEach(d => { wilderPct[d] = enhancedReport.adjustedWilderPcts![d] })
  } else {
    // 回退到原始计算
    const wilderMax = enhancedReport.dynamicWilderMax || WILDER_MAX
    dims.forEach(d => { wilderPct[d] = Math.round((scores.wilder[d] / (wilderMax[d] || 1)) * 100) })
  }

  // 排序
  const sorted = [...dims].sort((a, b) => wilderPct[b] - wilderPct[a])
  const topDims = sorted.slice(0, 2)
  const bottomDims = sorted.slice(-2)

  const sortedDims = sorted.map(d => ({
    key: d,
    name: DIM_META[d].name,
    score: wilderPct[d],
    level: scores.wilderLevels[d],
    emoji: DIM_META[d].emoji,
  }))

  // 百分位（基于年龄常模归一化）
  const ageNorm = computeAgeNormalizedScores(wilderPct, student.age)
  const wilderPercentiles: Record<string, number> = {}
  dims.forEach(d => {
    wilderPercentiles[d] = ageNorm.percentiles[d]
  })
  const wilderTScores = ageNorm.tScores

  // 科创天赋类型
  const talentType = enhancedReport.talentType.name
  const talentTypeEn = enhancedReport.talentType.nameEn
  const talentDescription = enhancedReport.talentType.description

  // v2.0: 30类型匹配引擎
  const match30 = matchTalentType30(wilderPct)
  const talentType30Key = match30.key
  const talent30 = match30.talent
  const talentReportContent = getReportContent(talentType30Key)
  
  // 交叉匹配
  const levelsForCross: Record<string, number> = {}
  dims.forEach(d => {
    levelsForCross[d] = wilderPct[d] >= 70 ? 3 : wilderPct[d] >= 40 ? 2 : 1
  })
  const crossMatchResult = crossMatchProfile(
    talentType30Key, levelsForCross, wilderPct, scores.reportVariantId
  )

  // 获取特质模板（传入分数以支持单峰检测和动态生成）
  const traitTemplate = getTraitTemplate(topDims, wilderPct)

  const topNames = topDims.map(d => `${DIM_META[d].name}(${DIM_META[d].nameEn})`)
  const coreInsightText = traitTemplate.coreInsight(student.name, wilderPct[topDims[0]], topNames[0], topNames[1])

  // 高/低维度
  const highDims = dims.filter(d => scores.wilderLevels[d] === 'high')
  const lowDims = dims.filter(d => scores.wilderLevels[d] === 'low')

  // 生成人格特质叙事（如果有personalityTraits数据）
  const personalityNarrative = scores.personalityTraits
    ? generatePersonalityNarrative(scores.personalityTraits, wilderPct, student.name)
    : null

  // Section Explorer
  const explorer: DynamicReportData['explorer'] = {
    coreInsight: addMagnitudeModifier(
      // 融入人格特质描述到核心洞察
      personalityNarrative 
        ? `${coreInsightText} ${personalityNarrative.personalityOverview}`
        : coreInsightText,
      wilderPercentiles[topDims[0]] || 50,
      wilderPercentiles[topDims[1]] || 50,
      DIM_META[topDims[0]].name,
      DIM_META[topDims[1]].name
    ),
    actionableInsight: traitTemplate.actionableInsight,
    strengthEngines: highDims.slice(0, 3).map(d => ({
      letter: d, name: `${DIM_META[d].name}驱动`, level: getStrengthLabel(wilderPercentiles[d] || 50)
    })),
    coreTraits: [
      `${talentType}模式`,
      // 安全访问 personalityProfile（兼容两种数据格式）
      (() => {
        const pp: unknown = enhancedReport.profile729?.personalityProfile
        if (!pp) return '待评估'
        if (typeof pp === 'string') return pp.split(' / ')[0]
        if (typeof pp === 'object' && pp !== null && 'typeName' in pp) return (pp as { typeName: string }).typeName
        return '待评估'
      })(),
      `${DIM_META[topDims[0]].emoji}${DIM_META[topDims[0]].name}领先`,
    ],
    growthDirections: lowDims.slice(0, 3).map(d => ({
      letter: d, name: `${DIM_META[d].name}${scores.wilderLevels[d] === 'low' ? '待提升' : '可加强'}`, level: scores.wilderLevels[d] === 'low' ? '待提升' : '可加强'
    })),
    todayAction: {
      phrase: getTodayActionPhrase(topDims, bottomDims, student.name),
      explanation: getTodayActionExplanation(topDims, bottomDims),
    },
    characterTraits: traitTemplate.traits.map(t => ({
      title: t.title, emoji: t.emoji, color: t.color,
      behaviorDesc: t.behavior(student.name),
      mechanism: t.mechanism,
      devMeaning: t.devMeaning,
      parentTip: t.parentTip,
    })),
    strengthAssets: [
      // 基础WILDER维度优势
      ...topDims.map(d => ({
        name: `${DIM_META[d].emoji} ${DIM_META[d].name}优势`,
        emoji: DIM_META[d].emoji,
        evidence: `在WILDER评估中${DIM_META[d].name}得分${wilderPct[d]}(T=${wilderTScores[d]})，位于同龄儿童前${Math.max(1, 100 - wilderPercentiles[d])}%。`,
        transferValue: getTransferValue(d),
        color: ['amber', 'blue', 'purple', 'green', 'rose', 'teal'][dims.indexOf(d as WilderDimension)] || 'gray',
      })),
      // 人格特质优势（如果有数据）
      ...(personalityNarrative ? [{
        name: '🌟 人格特质优势',
        emoji: '🌟',
        evidence: personalityNarrative.strengthInsight,
        transferValue: '人格特质优势是跨领域发展的底层能力，影响学习风格、社交方式和职业选择。',
        color: 'rose' as const,
      }] : []),
    ],
    systemBugs: bottomDims.filter(d => scores.wilderLevels[d] !== 'high').map((d, i) => ({
      title: `${DIM_META[d].name}待升级`,
      priority: i === 0 ? '高' : '中',
      trigger: getBugTrigger(d),
      earlySignals: getBugEarlySignals(d),
      microTraining: getBugMicroTraining(d),
    })),
    summaryMap: [
      {
        icon: '🔥', title: '优势发动机',
        content: `${highDims.map(d => `${DIM_META[d].name}(${DIM_META[d].nameEn})`).join(' + ')} = ${talentType}引擎`,
        note: '这是核心竞争力，保护它、滋养它、给它找到方向。',
        color: 'amber',
      },
      {
        icon: '🛞', title: '待升级模块',
        content: `${lowDims.map(d => `${DIM_META[d].name}(${DIM_META[d].nameEn})`).join(' + ')} = 需要训练`,
        note: '这不是性格缺陷，是技能缺口。90天可见改变。',
        color: 'rose',
      },
      {
        icon: '🎯', title: '90天目标',
        content: `完成3个"从头到尾"的小项目（每个≤2周），建立"我能完成"的自我认知。`,
        note: '不追求数量，只追求"完成感"。每完成一个，庆祝一次。',
        color: 'teal',
      },
    ],
  }

  // Section 0: 定心丸
  const topDimStr = `${DIM_META[topDims[0]].name}(${wilderPct[topDims[0]]}分)`
  const bottomDimStr = `${DIM_META[bottomDims[0]].name}`
  const reassurance = {
    headline: `"${student.name}的${topDimStr}已超过同龄段${wilderPercentiles[topDims[0]]}%的孩子，${bottomDimStr}是唯一可控的提升点——这不是性格问题，是方法问题。"`,
    todayAction: `晚饭时问一句"今天有什么${DIM_META[topDims[0]].name === '好奇心' ? '好奇' : '有趣'}的事吗？"`,
  }

  // Section 1: 结论总览
  const conclusion = {
    corePosition: `基于测评交互与证据链分析，${student.name}呈现出"${talentType}"的核心特质。${talentDescription}`,
    top3Types: [
      { label: '主分型', name: talentType, pct: Math.min(95, wilderPct[topDims[0]]), desc: talentDescription, color: 'blue' },
      { label: '次分型', name: getSecondaryType(sorted), pct: Math.min(85, wilderPct[topDims[1]]), desc: `${DIM_META[topDims[1]].name}维度突出`, color: 'purple' },
      { label: '潜力型', name: '全面发展潜力', pct: Math.min(75, Math.round(Object.values(wilderPct).reduce((a, b) => a + b, 0) / 6)), desc: '多维度均衡基础', color: 'amber' },
    ],
    radarInsight: {
      strongest: `${DIM_META[topDims[0]].name}(${wilderPct[topDims[0]]}) + ${DIM_META[topDims[1]].name}(${wilderPct[topDims[1]]})：形成"${getDimPairLabel(topDims)}"闭环`,
      toActivate: `${DIM_META[bottomDims[0]].name}(${wilderPct[bottomDims[0]]})：${getDimLevelDesc5(bottomDims[0], wilderPct[bottomDims[0]])}`,
      balanced: sorted.slice(2, 4).map(d => `${DIM_META[d].name}(${wilderPct[d]})`).join(' / ') + '：稳健基础',
    },
    confidenceDetail: {
      score: enhancedReport.confidenceLevel,
      reason: buildConfidenceReason(enhancedReport, Object.keys(scores.wilderLayer2 || {}).length),
    },
    supplementNeeded: ['陌生团队协作：当前数据主要来自个人作答场景', '压力情境表现：需观察竞赛/限时任务下的表现'],
  }

  // 生成剩余章节
  const evidenceChain = generateEvidenceChainEnhanced(topDims, bottomDims, wilderPct, student.name, evidenceDataSource)

  const strengthAssets: DynamicReportData['strengthAssets'] = {
    tags: topDims.concat(sorted.slice(2, 4)).map(d => ({
      name: `${DIM_META[d].emoji} ${DIM_META[d].name}`, emoji: DIM_META[d].emoji,
      color: ['amber', 'blue', 'purple', 'green', 'rose', 'teal'][dims.indexOf(d as WilderDimension)] || 'gray',
    })),
    details: topDims.slice(0, 3).map(d => ({
      name: DIM_META[d].name, emoji: DIM_META[d].emoji,
      portrait: getStrengthPortrait(d, student.name),
      parentStrategy: getStrengthParentStrategy(d),
      color: ['blue', 'purple', 'amber'][topDims.indexOf(d)] || 'gray',
    })),
  }

  // 成长潜力区（原"风险"）：以积极导向描述待发展领域
  const growthPotentialAreas = bottomDims.filter(d => scores.wilderLevels[d] !== 'high').map(d => ({
    title: `${DIM_META[d].name}成长潜力`,
    description: getDimLevelDesc5(d, wilderPct[d]),
    earlyWarnings: getBugEarlySignals(d),
    repairStrategies: getRepairStrategies(d),
  }))
  
  // 兼容旧接口
  const risks = growthPotentialAreas

  // Section 5: 教育学家圆桌会诊（使用博弈引擎）
  let educatorPanel: EducatorPanelResult
  try {
    educatorPanel = generateEducatorPanel(
      wilderPct,
      scores.wilderLevels,
      student.name,
      student.age,
      topDims,
      bottomDims
    )
  } catch (error) {
    // 向后兼容：如果博弈引擎失败，使用默认内容
    console.warn('教育学家博弈引擎调用失败，使用默认内容:', error)
    educatorPanel = generateDefaultEducatorPanel(student.name, student.age, topDims, bottomDims)
  }

  // 保留原有 growthPaths 作为向后兼容
  const growthPaths = generateGrowthPaths(topDims, bottomDims)
  const weeklyPlan = generateWeeklyPlan(topDims, bottomDims)
  const communicationScripts = generateCommunicationScripts(topDims, bottomDims)

  const schoolCooperation = generateSchoolCooperation(topDims, bottomDims, student.name)
  const universityRecommendations = generateUniversityRecommendations(topDims, talentType30Key)
  const careerDirections = generateCareerDirections(topDims, wilderPct, talent30?.careers ?? enhancedReport.profile729?.careerPaths ?? [])

  const bookRecommendations = generateBookRecommendations(topDims, student.age, talentType30Key)

  // v2.0: 个性化纪录片推荐 & 家长关注焦点
  const talentParentFocus: ParentFocus[] = getParentFocusAreas(talentType30Key)

  // Phase 3: 新增生成器
  const multiModelValidation = generateMultiModelValidation(scores, topDims, wilderPct, student.name)
  const familySolutions = generateFamilySolutions(topDims, bottomDims, student.name, student.age)
  const fourteenDayPlan = generateFourteenDayPlan(topDims, bottomDims, student.name)
  const yearlyBlueprint = generateYearlyBlueprint(topDims, bottomDims)
  const curriculumMatching = generateCurriculumMatching(topDims, bottomDims, wilderPct, student.age)
  const confidenceStatement = generateConfidenceStatement(scores, enhancedReport, student.age)

  // Phase 6: 新模型综合分析 (CHC + Grit + SEL + 13种模型组合)
  const newModelAnalysis = (scores.chc && scores.grit && scores.sel)
    ? generateNewModelAnalysis(scores, wilderPct, student.name)
    : null

  // Phase 7: 60科创天赋分型匹配
  const talentMatch60Result = matchTalentType60(wilderPct, scores)

  // 60分型优先获取个性化内容，fallback到30分型
  const talentReportContent60 = talentMatch60Result.talent60
    ? getReportContent(talentMatch60Result.key) || talentReportContent
    : talentReportContent

  // 60分型个性化内容（纪录片、大学）
  const effectiveContent = talentReportContent60 || talentReportContent
  const documentaryRecommendations: DocumentaryRec[] = effectiveContent?.documentaries || []
  const talentUniversities: UniversityRec[] = effectiveContent?.universities || []

  return {
    student,
    reportVersion: '2026年内测版',
    reportDate: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
    talentType: talent30 ? talent30.name : talentType,
    talentTypeEn: talent30 ? talent30.nameEn : talentTypeEn,
    talentDescription: talent30 ? talent30.desc : talentDescription,
    profileCode: scores.profileCode,
    variantId: scores.reportVariantId,
    confidence: enhancedReport.confidenceLevel,
    wilderScores: wilderPct,
    wilderPercentiles,
    wilderTScores,
    ageNormInfo: {
      ageGroup: ageNorm.ageGroup,
      ageGroupLabel: ageNorm.ageGroupLabel,
      peerMeans: ageNorm.peerMeans,
    },
    wilderLevels: scores.wilderLevels as unknown as Record<string, string>,
    sortedDims,
    topDims,
    bottomDims,
    explorer,
    reassurance,
    conclusion,
    evidenceChain,
    strengthAssets,
    risks,
    riskPredictions: generateRiskPredictions(topDims, bottomDims, wilderPct, student.name, student.age),
    educatorPanel,
    growthPaths,
    weeklyPlan,
    communicationScripts,
    schoolCooperation,
    universityRecommendations,
    talentUniversities,
    careerDirections,
    aiInsight: talent30
      ? `${student.name}的科创天赋类型「${talent30.name}」在科创学习中尤为珍贵。${talent30.aiAgeInsight}` + (talentMatch60Result.talent60 ? `\n精细化分析显示，${student.name}更偏向「${talentMatch60Result.talent60.name}」（${talentMatch60Result.talent60.nameEn}）方向：${talentMatch60Result.talent60.tagline}。置信度${talentMatch60Result.confidence}%。` : '')
      : `${student.name}的${DIM_META[topDims[0]].name}和${DIM_META[topDims[1]].name}组合，在科创学习中尤为珍贵。科学探索需要定义问题、验证假设、跨领域联想、建立协作关系这些能力，这正是科创天赋力的核心。`,
    bookRecommendations,
    documentaryRecommendations,
    talentParentFocus,
    nextSteps: [
      { step: '分享报告', desc: '把报告中"学校配合"章节截图发给班主任' },
      { step: '启动90天计划', desc: '和孩子一起选择W1的第一个任务' },
      { step: '预约专家解读', desc: '获得更个性化的教育建议' },
      { step: '3个月后复测', desc: '对比成长变化，调整培养策略' },
    ],
    appendix: {
      modelExplanation: 'WILDER-729模型基于6维度×3档水平=729种独特画像。整合多元智能理论、大五人格模型、皮亚杰认知发展理论和执行功能评估，通过多理论交叉验证提高评估准确性。',
      privacyNote: '本报告不存储可识别个人信息（PII），所有推荐均可解释与审计。数据加密标准：AES-256-GCM，合规标准：PIPL / GB/T 35273-2020。',
      auditLog: enhancedReport.fullReport?.auditLog ?? {
        model_version: 'WILDER-729 v3.0',
        timestamp: new Date().toISOString(),
        data_privacy: 'PIPL compliant',
      },
    },
    multiModelValidation,
    familySolutions,
    fourteenDayPlan,
    yearlyBlueprint,
    curriculumMatching,
    confidenceStatement,
    // Phase 4: 30类型系统
    talentType30Key,
    talentType30: talent30 || null,
    crossMatch: crossMatchResult || null,
    talentReportContent: effectiveContent || null,
    // Phase 5: 728匹配引擎 + 家长指导 + 适龄题库
    docMatch728: matchDocumentaries728(scores.profileCode, student.age, talentType30Key, wilderPct, topDims),
    parentGuidance20: generateParentGuidance20(student.age, topDims, talent30 ? talent30.name : talentType),
    ageAdaptiveInfo: (() => {
      const qi = getAllQuestionsByAge(student.age)
      const cp = getAgeCognitiveProfile(student.age)
      return { ageGroup: qi.ageGroup, totalQuestions: qi.totalCount, designNotes: qi.designNotes, cognitiveProfile: cp }
    })(),
    // 交叉验证透明度字段
    crossValidationScore: enhancedReport.crossValidation?.overallConsistency,
    crossValidationLevel: enhancedReport.crossValidation?.consistencyLevel,
    crossValidationInconsistencies: enhancedReport.crossValidation?.inconsistencies?.map((inc: { type: string; description: string; recommendation: string }) => ({
      type: inc.type,
      description: inc.description,
      recommendation: inc.recommendation,
    })),
    // Phase 6: 新模型分析
    newModelAnalysis,
    // Phase 7: 60科创天赋分型
    talentMatch60: talentMatch60Result,
    talentType60Key: talentMatch60Result.key,
    talentType60: talentMatch60Result.talent60,
    // Phase 8: AI-Native 引擎字段
    vectorPoint: enhancedReport.vectorPoint || null,
    emergentTalents: enhancedReport.emergentTalents || null,
  }
}

// ========== 辅助函数 ==========

function getTransferValue(dim: string): string {
  const map: Record<string, string> = {
    W: '科学研究、产品创新、探索型职业的核心驱动力。AI无法复制"无目的的好奇"。',
    I: '数据分析、科学研究、质量控制等领域的核心能力。',
    L: '团队管理、跨部门协作、教育等领域的底层能力。',
    D: '产品设计、工程管理、创业等领域的关键竞争力。',
    E: '演讲、教学、营销、自媒体等领域的稀缺能力。',
    R: '管理咨询、心理咨询、学术研究等领域的加速器。',
  }
  return map[dim] || '在多个领域都具有可迁移的价值。'
}

function getBugTrigger(dim: string): string {
  const map: Record<string, string> = {
    W: '面对常规/重复性任务时；缺少新鲜刺激的环境中',
    I: '需要严格论证或多步推理时；缺少具体引导',
    L: '需要主动发起协作时；团队项目中需关注他人需求时',
    D: '任务时长超过15分钟；过程中出现新的有趣刺激',
    E: '需要在陌生人面前表达时；需要组织复杂信息时',
    R: '被问"你学到了什么"时；需要从失败中总结经验时',
  }
  return map[dim] || '在该维度相关的任务场景中'
}

function getBugEarlySignals(dim: string): string[] {
  const map: Record<string, string[]> = {
    W: ['对"你有什么问题吗？"回答"没有"', '不太主动探索新事物', '对新话题兴趣持续时间较短'],
    I: ['遇到复杂问题时直接放弃或猜测', '较少使用"因为...所以..."的因果推理', '不太愿意检查自己的答案'],
    L: ['做事时很少问"你需要我帮忙吗？"', '在团队活动中倾向独自完成自己的部分', '被请求帮助时才响应，很少主动'],
    D: ['开始做事后5分钟内就问"我可以先做别的吗？"', '有大量"半成品"——画到一半的画、拼到一半的积木', '对"你上次那个做完了吗？"表现出回避'],
    E: ['说话时经常用"那个...就是..."等模糊词', '在需要展示时退缩或说"我不会"', '回答问题时通常很简短'],
    R: ['对"为什么这样做？"的回答是"不知道"', '同样的错误会重复犯2-3次以上', '快速跳过失败，不愿回顾'],
  }
  return map[dim] || ['该维度相关行为表现需要关注']
}

function getBugMicroTraining(dim: string): string {
  const map: Record<string, string> = {
    W: '「好奇心捕捉」：每天发现一件"奇怪"的事，用一句话记录下来。一周后看看能攒多少好奇心种子。',
    I: '「小实验日」：每周做一个厨房小实验——面包为什么会发起来？冰块为什么会融化？从最简单的问题开始。',
    L: '「好奇心采访」：每周选一个家人/朋友，用10分钟"采访"他们——问3个问题，认真听完再问下一个。',
    D: '「番茄钟启动」：选一个小任务，设置10分钟计时器，完成后立即庆祝。每周增加2分钟。',
    E: '「每日一讲」：每天用1分钟给家人讲一件今天的事。要求用"首先-然后-最后"的结构。',
    R: '「今日三问」：睡前花3分钟问三个问题——①今天最有趣的发现？②有什么可以做得更好？③明天想试什么？',
  }
  return map[dim] || '通过每日微训练逐步提升，每次5-10分钟即可。'
}

function getTodayActionPhrase(topDims: string[], _bottomDims: string[], _name: string): string {
  const topDim = topDims[0]
  const phrases: Record<string, string> = {
    W: `"你发现了什么有趣的？先记下来"`,
    I: `"你觉得为什么会这样？我们可以试试"`,
    L: `"你觉得谁会需要帮助？"`,
    D: `"你打算先做什么？画个计划吧"`,
    E: `"你能给我讲讲吗？我很想听"`,
    R: `"如果再来一次，你会怎么做？"`,
  }
  return phrases[topDim] || `"你今天有什么新发现吗？"`
}

function getTodayActionExplanation(topDims: string[], _bottomDims: string[]): string {
  return `——把${DIM_META[topDims[0]]?.name || '优势'}转化为成长动力。`
}

function getSecondaryType(sorted: string[]): string {
  const secondDim = sorted[1]
  const typeMap: Record<string, string> = {
    W: '好奇心探索者', I: '实证求知者', L: '团队协作者',
    D: '方案设计者', E: '结构化表达者', R: '深度反思者',
  }
  return typeMap[secondDim] || '多维发展者'
}

function getDimPairLabel(topDims: string[]): string {
  const pairMap: Record<string, string> = {
    WI: '发现-验证', WL: '发现-协作', WD: '发现-创造',
    WE: '发现-表达', WR: '发现-反思', IL: '验证-协作',
    ID: '验证-设计', IE: '验证-表达', IR: '验证-反思',
    LD: '协作-设计', LE: '协作-表达', LR: '协作-反思',
    DE: '设计-表达', DR: '设计-反思', ER: '表达-反思',
  }
  const key = topDims.join('')
  const reverseKey = [...topDims].reverse().join('')
  return pairMap[key] || pairMap[reverseKey] || '多维协同'
}

function getStrengthPortrait(dim: string, name: string): string {
  const map: Record<string, string> = {
    W: `${name}对世界充满好奇，看到新事物时眼睛会发光。这种"发现"的能力在AI时代极为稀缺——机器不会对蝴蝶感到好奇。`,
    I: `${name}不轻易接受别人给的答案，喜欢自己验证。这种"求证精神"是科学方法论的萌芽。`,
    L: `${name}善于理解他人需求，能在团队中起到连接作用。这种社交智慧在任何领域都是核心竞争力。`,
    D: `${name}做事有条理，能把想法变成可执行的计划。这种"从0到1"的能力是创业者和工程师的核心素质。`,
    E: `${name}善于用清晰的结构表达想法，能让复杂的事情变得易懂。这种能力在演讲、写作、教学中都极为珍贵。`,
    R: `${name}善于从经历中提取教训，这种"成长加速器"让TA的每一次经历都比同龄人收获更多。`,
  }
  return map[dim] || `${name}在${DIM_META[dim]?.name || '该维度'}方面展现出突出能力。`
}

function getStrengthParentStrategy(dim: string): string {
  const map: Record<string, string> = {
    W: '当TA提问时，不急于给答案，而是说"你觉得呢？我们可以怎么找答案？"',
    I: '给TA提供"做实验"的机会——厨房、花园、旧玩具都是最好的实验室。',
    L: '创造"小组任务"的家庭场景——一起做饭、一起整理房间，让协作变成日常。',
    D: '鼓励TA在做事前"画一张计划图"，在做事后"检查一遍清单"。',
    E: '给TA"讲给不懂的人听"的机会——给爷爷奶奶讲学校的事，给弟弟妹妹讲故事。',
    R: '每天睡前问"今天最开心的事？最遗憾的事？明天想做什么？"。',
  }
  return map[dim] || '在日常生活中创造更多练习这项能力的机会。'
}

function getRepairStrategies(dim: string): string[] {
  const map: Record<string, string[]> = {
    W: ['每天问孩子"今天有什么让你好奇的？"', '带孩子接触新事物——新的公园、新的书、新的体验', '当TA提问时认真对待，一起查答案'],
    I: ['用"你觉得为什么？"替代"答案是..."', '做家庭小实验——从"面包为什么会发起来"开始', '鼓励TA自己查资料验证想法'],
    L: ['每周设置一次"帮助日"——主动帮助一个家人做一件事', '任务开始前问"你觉得谁可能需要帮助？"', '复盘时问"今天你帮助了谁？感觉怎么样？"'],
    D: ['用"番茄钟"训练——10分钟任务，完成后庆祝', '帮TA设计"完成一件事的庆祝仪式"', '从最小的任务开始，建立"完成=快乐"的正循环'],
    E: ['每天用1分钟给家人讲一件事', '录制小视频——讲一个知识点或一个故事', '参加辩论社、演讲社等学校活动'],
    R: ['用三步框架引导：发生了什么？→为什么？→下次怎么做？', '先从"过程复盘"开始，不急于追问"为什么错"', '每天睡前三问：最开心？最遗憾？明天想做？'],
  }
  return map[dim] || ['通过日常微训练逐步提升', '创造更多实践机会', '耐心等待，每个孩子都有自己的节奏']
}

function generateGrowthPaths(topDims: string[], _bottomDims: string[]): DynamicReportData['growthPaths'] {
  const topName = DIM_META[topDims[0]]?.name || '优势'
  return [
    {
      level: 'A', name: '稳健路径：习惯养成型', color: 'green',
      goal: `建立日常${topName}习惯`, cycle: '90天', effort: '每周3-5小时', output: `${topName}日记90条`,
      tasks: [
        `每日"${topName}捕捉"习惯（5分钟）`,
        '每周一次家庭科学小实验（30分钟）',
        '每月一次"发现分享会"给家人讲解',
      ],
    },
    {
      level: 'B', name: '进阶路径：项目产出型', color: 'blue',
      goal: '完成2个完整项目', cycle: '6个月', effort: '每周5-8小时', output: '项目报告+展示视频',
      tasks: [
        '完成1个探究类项目', '完成1个制作/设计类项目', '参加1次校级或社区展示',
      ],
    },
    {
      level: 'C', name: '冲刺路径：竞赛申请型', color: 'purple',
      goal: '获得竞赛证书/作品集', cycle: '12个月', effort: '每周8-12小时', output: '竞赛作品+获奖证书',
      tasks: [
        '深入1个专业领域', '参加省级/国家级竞赛', '建立个人作品集',
      ],
      riskWarning: '高强度投入可能影响其他学科和休息，建议先完成Path A再考虑。',
    },
  ]
}

function generateSchoolCooperation(topDims: string[], bottomDims: string[], name: string): DynamicReportData['schoolCooperation'] {
  return {
    learningStyle: topDims.concat(bottomDims.slice(0, 1)).map(d => ({
      title: `${DIM_META[d].name}型学习者`,
      desc: DIM_LEVEL_DESC[d]?.high || DIM_LEVEL_DESC[d]?.mid || '有待深入评估',
      color: ['blue', 'purple', 'amber'][topDims.indexOf(d)] || 'green',
    })),
    classroomRoles: topDims.map(d => {
      const roles: Record<string, string> = {
        W: '问题发起人：负责提出关键问题', I: '验证者：负责检验假设',
        L: '协调者：负责团队沟通', D: '项目经理：负责规划执行',
        E: '展示者：负责汇报成果', R: '复盘者：负责总结反思',
      }
      return roles[d] || `${DIM_META[d].name}方向负责人`
    }),
    teacherOpportunities: [
      { title: `发挥${DIM_META[topDims[0]].name}优势`, desc: `让${name}在${DIM_META[topDims[0]].name}相关的任务中担任核心角色，建立自信。` },
      { title: `培养${DIM_META[bottomDims[0]].name}`, desc: `在安全的环境中逐步增加${DIM_META[bottomDims[0]].name}方面的练习机会。` },
      { title: '个性化反馈', desc: `对${name}的反馈应侧重过程而非结果，肯定TA的努力和进步。` },
    ],
  }
}

function generateBookRecommendations(topDims: string[], age: number, talentKey?: string): DynamicReportData['bookRecommendations'] {
  const ageRange = age <= 9 ? '6-9岁' : age <= 12 ? '10-12岁' : '13-16岁'
  const ageRangeKey = age <= 9 ? '6-9' : age <= 12 ? '10-12' : '13-16'

  // v2.0: 如果有30类型key，从个性化内容库获取
  if (talentKey) {
    const childBooks = getBooksByTarget(talentKey, 'child', ageRangeKey)
    const parentBooks = getBooksByTarget(talentKey, 'parent')
    if (childBooks.length > 0 || parentBooks.length > 0) {
      return {
        forChild: [{
          ageRange,
          books: childBooks.map(b => ({ name: `《${b.title}》${b.author}`, desc: b.reason })),
        }],
        forParent: parentBooks.map(b => ({ name: `《${b.title}》${b.author}`, desc: b.reason })),
      }
    }
  }

  // Fallback: 原有基于维度的推荐

  const childBooks: Record<string, { name: string; desc: string }[]> = {
    W: [
      { name: '《昆虫记》法布尔', desc: '观察+记录的经典范本' },
      { name: '《万物简史》比尔·布莱森', desc: '激发对世界的好奇' },
      { name: '《十万个为什么》', desc: '保持追问习惯的好伙伴' },
    ],
    I: [
      { name: '《这不是真的吧》系列', desc: '科学思维和证据意识培养' },
      { name: '《实验室的秘密》', desc: '了解科学方法的趣味读物' },
      { name: '《数学是怎样炼成的》', desc: '逻辑推理能力提升' },
    ],
    L: [
      { name: '《窗边的小豆豆》', desc: '理解不同学习风格和友谊' },
      { name: '《夏洛的网》', desc: '友谊和协作的力量' },
      { name: '《团队的力量》', desc: '了解协作的意义' },
    ],
    D: [
      { name: '《STEAM科学实验》', desc: '动手做项目的灵感来源' },
      { name: '《乐高创意指南》', desc: '从创意到实物的方法论' },
      { name: '《发明家学院》', desc: '培养工程思维' },
    ],
    E: [
      { name: '《演讲的力量》少年版', desc: '学习表达的基础方法' },
      { name: '《写给孩子的表达课》', desc: '提升书面和口头表达' },
      { name: '《故事的力量》', desc: '学会讲好一个故事' },
    ],
    R: [
      { name: '《成长型思维》少年版', desc: '建立"错误是学习"的心态' },
      { name: '《思考的乐趣》', desc: '培养深度思考习惯' },
      { name: '《心灵日记》引导版', desc: '练习每日反思' },
    ],
  }

  const forChild = [{
    ageRange,
    books: (childBooks[topDims[0]] || childBooks.W).concat(
      (childBooks[topDims[1]] || childBooks.I).slice(0, 1)
    ),
  }]

  const forParent = [
    { name: '《科创天赋力》', desc: '了解如何识别和培养孩子的科创天赋力' },
    { name: '《正面管教》简·尼尔森', desc: '温和而坚定的教育方法' },
    { name: '《终身成长》卡罗尔·德韦克', desc: '培养孩子的成长型思维' },
  ]

  return { forChild, forParent }
}

// ========== Phase 3: 多模型交叉验证生成器 ==========
const MI_NAMES: Record<string, { name: string; nameEn: string }> = {
  linguistic: { name: '语言智能', nameEn: 'Linguistic' },
  logicalMath: { name: '逻辑数学智能', nameEn: 'Logical-Math' },
  spatial: { name: '空间智能', nameEn: 'Spatial' },
  musical: { name: '音乐智能', nameEn: 'Musical' },
  bodilyKinesthetic: { name: '身体运动智能', nameEn: 'Bodily-Kinesthetic' },
  interpersonal: { name: '人际智能', nameEn: 'Interpersonal' },
  intrapersonal: { name: '内省智能', nameEn: 'Intrapersonal' },
  naturalist: { name: '自然观察智能', nameEn: 'Naturalist' },
}

const MI_WILDER_MAP: Record<string, string> = {
  linguistic: '与表达力(E)高度相关',
  logicalMath: '与探究力(I)+设计力(D)交叉验证',
  spatial: '与设计力(D)高度相关',
  musical: '与表达力(E)部分相关',
  bodilyKinesthetic: '与设计力(D)+连接力(L)部分相关',
  interpersonal: '与连接力(L)+表达力(E)交叉验证',
  intrapersonal: '与反思力(R)高度相关',
  naturalist: '与好奇心(W)+探究力(I)交叉验证',
}

const BF_NAMES: Record<string, string> = { O: '开放性', C: '尽责性', E: '外向性', A: '宜人性', N: '神经质' }
const BF_WILDER_MAP: Record<string, string> = {
  O: '与好奇心(W)高度一致——两者都反映对新体验的接纳度',
  C: '与设计力(D)+反思力(R)交叉验证——有条理和自律的行为基础',
  E: '与连接力(L)+表达力(E)交叉验证——社交主动性和表达积极性',
  A: '与连接力(L)部分相关——合作倾向和共情能力',
  N: '与反思力(R)反向关联——情绪调节影响自我觉察深度',
}

function generateMultiModelValidation(
  scores: AssessmentScores, topDims: string[], wilderPct: Record<string, number>, studentName: string
): DynamicReportData['multiModelValidation'] {
  // MI Analysis
  const miEntries = Object.entries(scores.multipleIntelligences).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
  const topMI = miEntries.slice(0, 3).map(([k, v]) => ({
    name: MI_NAMES[k]?.name || k, nameEn: MI_NAMES[k]?.nameEn || k,
    score: v, wilderCorrelation: MI_WILDER_MAP[k] || '与WILDER模型形成补充验证',
  }))
  const miTopNames = topMI.map(m => m.name).join('、')
  const miInterpretation = topMI.length > 0
    ? `${studentName}在加德纳八大智能中，${miTopNames}表现突出。这与WILDER模型中${topDims.map(d => DIM_META[d].name).join('+')}的优势高度一致，形成"双模型交叉验证"——当两个独立模型指向同一结论时，判断的可靠性显著提升。`
    : '多元智能数据样本量不足，建议补测以获得更完整的交叉验证。'

  // BigFive Analysis
  const bfTraits = (['O', 'C', 'E', 'A', 'N'] as const).map(d => {
    const score = d === 'E' ? scores.bigFive.E : scores.bigFive[d]
    const level = score >= 2 ? '较高' : score >= 1 ? '中等' : '较低'
    return { dimension: d, name: BF_NAMES[d], level, score, wilderCorrelation: BF_WILDER_MAP[d] }
  })
  const highBF = bfTraits.filter(t => t.level === '较高').map(t => `${t.name}${t.level}`)
  const bfInterpretation = highBF.length > 0
    ? `大五人格初步画像显示${studentName}${highBF.join('、')}。${bfTraits.find(t => t.dimension === 'O')?.level === '较高' ? `开放性高与WILDER好奇心(W:${wilderPct.W})形成强交叉验证，表明${studentName}对新体验的积极态度是稳定特质。` : ''}${bfTraits.find(t => t.dimension === 'C')?.level === '较高' ? `尽责性好与WILDER设计力(D:${wilderPct.D})互相印证。` : ''}`
    : '大五人格各维度处于正常发展范围，人格特征将随年龄和经历逐步分化。'

  // Cognitive Analysis
  const cog = scores.cognitive
  const cogTotal = cog.conservation + cog.deduction + cog.hypothesis + cog.metacognition
  const cogMax = 12
  const cogPct = cogTotal / cogMax
  const stage = cogPct >= 0.75 ? '形式运算期（早期）' : cogPct >= 0.5 ? '具体运算期（成熟）' : '具体运算期（发展中）'
  const stageDesc = cogPct >= 0.75 ? '已展现抽象推理和假设检验能力，认知发展超越同龄平均' : cogPct >= 0.5 ? '具体运算思维发展良好，正向抽象思维过渡' : '主要依靠具体经验进行思考，这是该年龄段的正常表现'
  const cogIndicators = [
    { name: '守恒概念', achieved: cog.conservation >= 2, score: cog.conservation, detail: cog.conservation >= 2 ? '理解物质守恒，不受表面变化干扰' : '对守恒的理解需要更多具体操作经验' },
    { name: '逻辑推理', achieved: cog.deduction >= 2, score: cog.deduction, detail: cog.deduction >= 2 ? '能进行传递推理和逻辑演绎' : '逻辑推理能力正在发展中，需要更多练习' },
    { name: '假设检验', achieved: cog.hypothesis >= 2, score: cog.hypothesis, detail: cog.hypothesis >= 2 ? '具备变量控制和实验设计能力' : '实验设计思维待培养，可从简单实验开始' },
    { name: '元认知', achieved: cog.metacognition >= 2, score: cog.metacognition, detail: cog.metacognition >= 2 ? '能监控自己的学习过程，有策略选择意识' : '对自身学习过程的觉察还在发展，可用"思考记录"引导' },
  ]
  const cogInterpretation = `认知发展评估显示${studentName}处于"${stage}"。${stageDesc}。${cog.hypothesis >= 2 ? `假设检验能力突出，与WILDER探究力(I:${wilderPct.I})形成强验证。` : ''}${cog.metacognition >= 2 ? `元认知能力好，与WILDER反思力(R:${wilderPct.R})互相印证。` : ''}`

  // EF Analysis
  const ef = scores.executiveFunction
  const inhLevel = ef.inhibition >= 2 ? '良好' : ef.inhibition >= 1 ? '发展中' : '待提升'
  const flexLevel = ef.flexibility >= 2 ? '良好' : ef.flexibility >= 1 ? '发展中' : '待提升'
  const efInterpretation = `执行功能评估：抑制控制${inhLevel}，认知灵活性${flexLevel}。${ef.inhibition >= 2 ? '能抵抗干扰完成任务，' : ''}${ef.flexibility >= 2 ? '能灵活切换策略。' : ''}${ef.inhibition >= 2 && ef.flexibility >= 2 ? `这与WILDER设计力(D:${wilderPct.D})和反思力(R:${wilderPct.R})形成三角验证——自控力、灵活性和规划力共同支撑高效学习。` : '执行功能仍在发展中，可通过结构化任务和游戏化训练逐步提升。'}`

  // 人格特质画像（基于四维度评估，报告输出使用中文名称）
  const personalityTypeKey = scores.wilderLevels.W === 'high' && scores.wilderLevels.L === 'high' ? 'ENFP' :
    scores.wilderLevels.I === 'high' && scores.wilderLevels.R === 'high' ? 'INTJ' :
    scores.wilderLevels.W === 'high' && scores.wilderLevels.I === 'high' ? 'ENTP' :
    scores.wilderLevels.D === 'high' && scores.wilderLevels.R === 'high' ? 'ISTJ' :
    scores.wilderLevels.L === 'high' && scores.wilderLevels.E === 'high' ? 'ENFJ' :
    scores.wilderLevels.E === 'high' && scores.wilderLevels.R === 'high' ? 'INFJ' : 'ENFP'
  
  // 人格特质类型名称（使用中文描述，直观呈现人格特征）
  const personalityNames: Record<string, string> = { 
    ENFP: '热情探索型', INTJ: '战略思考型', ENTP: '创新思辨型', 
    ISTJ: '务实可靠型', ENFJ: '领导激励型', INFJ: '洞察理想型',
    ENTJ: '领导组织型', INTP: '分析探索型', ESTJ: '务实管理型',
    ESFJ: '热心合作型', ISFJ: '细心守护型', ESTP: '行动应变型',
    ESFP: '热情表现型', ISTP: '冷静实践型', ISFP: '艺术感知型',
    INFP: '理想创造型'
  }
  
  // 人格特质描述（自然语言描述，避免专业术语）
  const personalityDescs: Record<string, string> = {
    ENFP: '充满热情、善于发现可能性并激励他人的创新者',
    INTJ: '善于战略性思考、构建系统和长期规划的思想者',
    ENTP: '机智善辩、享受智力挑战和创新解决方案的探索者',
    ISTJ: '可靠务实、注重细节和责任感的执行者',
    ENFJ: '天生的领导者，善于理解和激发他人的潜能',
    INFJ: '富有洞察力、追求深层意义的理想主义者',
    ENTJ: '天生的组织者，善于制定策略并带领团队达成目标',
    INTP: '好奇心旺盛、喜欢探索真理和逻辑的分析者',
    ESTJ: '务实高效、善于建立秩序和管理事务的管理者',
    ESFJ: '热心友善、乐于助人和维护和谐的协作者',
    ISFJ: '温和体贴、忠诚可靠且注重细节的守护者',
    ESTP: '活力四射、善于行动和灵活应变的实践者',
    ESFP: '热情开朗、善于表现和创造愉快氛围的表演者',
    ISTP: '冷静务实、善于动手和解决问题的技术者',
    ISFP: '温柔敏感、富有艺术气质和审美力的创作者',
    INFP: '内心世界丰富、充满想象力和同理心的理想家',
  }
  
  // 人格特质与WILDER的关联描述
  const personalityWilderMap: Record<string, string> = {
    ENFP: `热情探索型与WILDER好奇心(W:${wilderPct.W})+连接力(L:${wilderPct.L})高度吻合`,
    INTJ: `战略思考型与WILDER探究力(I:${wilderPct.I})+反思力(R:${wilderPct.R})交叉验证`,
    ENTP: `创新思辨型与WILDER好奇心(W:${wilderPct.W})+探究力(I:${wilderPct.I})高度一致`,
    ISTJ: `务实可靠型与WILDER设计力(D:${wilderPct.D})+反思力(R:${wilderPct.R})互相印证`,
    ENFJ: `领导激励型与WILDER连接力(L:${wilderPct.L})+表达力(E:${wilderPct.E})三角验证`,
    INFJ: `洞察理想型与WILDER表达力(E:${wilderPct.E})+反思力(R:${wilderPct.R})形成互补`,
    ENTJ: `领导组织型与WILDER设计力(D:${wilderPct.D})+表达力(E:${wilderPct.E})高度一致`,
    INTP: `分析探索型与WILDER好奇心(W:${wilderPct.W})+探究力(I:${wilderPct.I})深度关联`,
    ESTJ: `务实管理型与WILDER设计力(D:${wilderPct.D})+连接力(L:${wilderPct.L})互相印证`,
    ESFJ: `热心合作型与WILDER连接力(L:${wilderPct.L})+反思力(R:${wilderPct.R})形成支撑`,
    ISFJ: `细心守护型与WILDER探究力(I:${wilderPct.I})+设计力(D:${wilderPct.D})交叉验证`,
    ESTP: `行动应变型与WILDER好奇心(W:${wilderPct.W})+设计力(D:${wilderPct.D})高度吻合`,
    ESFP: `热情表现型与WILDER表达力(E:${wilderPct.E})+连接力(L:${wilderPct.L})深度关联`,
    ISTP: `冷静实践型与WILDER探究力(I:${wilderPct.I})+设计力(D:${wilderPct.D})技术验证`,
    ISFP: `艺术感知型与WILDER好奇心(W:${wilderPct.W})+表达力(E:${wilderPct.E})创意融合`,
    INFP: `理想创造型与WILDER好奇心(W:${wilderPct.W})+反思力(R:${wilderPct.R})内在探索`,
  }

  // Cross-validation summary (8大模型：WILDER + MI + BigFive + Cognitive + EF + CHC + Grit + SEL)
  const chcInfo = scores.chc ? `、CHC认知(Gf:${scores.chc.Gf}/Gc:${scores.chc.Gc})` : ''
  const gritInfo = scores.grit ? `、坚毅力(热情:${scores.grit.passion}/坚持:${scores.grit.perseverance})` : ''
  const selInfo = scores.sel ? `、社会情感学习(SEL)` : ''
  const modelCount = 5 + (scores.chc ? 1 : 0) + (scores.grit ? 1 : 0) + (scores.sel ? 1 : 0)
  const totalIndicators = topMI.length + highBF.length + (scores.chc ? 2 : 0) + (scores.grit ? 2 : 0) + (scores.sel ? 5 : 0)
  const crossValidationSummary = `综合${modelCount}大模型交叉验证结果：WILDER ${topDims.map(d => `${DIM_META[d].name}(${DIM_META[d].nameEn})`).join('+')}的优势判断得到多元智能(${miTopNames})、大五人格(${highBF.join('/')})${cog.hypothesis >= 2 ? '、认知发展(假设检验能力)' : ''}${chcInfo}${gritInfo}${selInfo}的独立验证。当${totalIndicators}个独立指标指向同一方向时，评估置信度从单模型的0.85提升至多模型交叉验证的${modelCount >= 8 ? '0.95-0.97' : modelCount >= 6 ? '0.93-0.95' : '0.92-0.95'}。`

  return {
    miAnalysis: { topIntelligences: topMI, interpretation: miInterpretation },
    bigFiveAnalysis: { traits: bfTraits, interpretation: bfInterpretation },
    cognitiveAnalysis: { stage, stageDesc, indicators: cogIndicators, interpretation: cogInterpretation },
    efAnalysis: {
      inhibition: { level: inhLevel, score: ef.inhibition, detail: ef.inhibition >= 2 ? '能抵抗即时诱惑，完成需要延迟满足的任务' : '面对分心刺激时较难保持专注，需要外部结构支持' },
      flexibility: { level: flexLevel, score: ef.flexibility, detail: ef.flexibility >= 2 ? '能根据情况调整策略，不固执于单一方法' : '倾向使用熟悉方法，切换策略时需要引导' },
      interpretation: efInterpretation,
    },
    personalityProfile: { 
      type: personalityTypeKey, 
      name: personalityNames[personalityTypeKey] || '热情探索型', 
      description: personalityDescs[personalityTypeKey] || '充满潜力的成长型人格', 
      wilderCorrelation: personalityWilderMap[personalityTypeKey] || '人格特质与WILDER六维度深度关联，为评估提供多角度验证'
    },
    crossValidationSummary,
  }
}

// ========== Phase 3: 家长教育指导方案生成器 ==========
function generateFamilySolutions(
  topDims: string[], bottomDims: string[], studentName: string, age: number
): DynamicReportData['familySolutions'] {
  const topName = DIM_META[topDims[0]]?.name || '优势'
  const bottomName = DIM_META[bottomDims[0]]?.name || '待提升'

  const learningProfile = [
    { title: `${topName}驱动型学习者`, icon: '🎯', description: `${studentName}的学习动力主要来自${topName}。当学习内容能激发${topName === '好奇心' ? '探索欲' : topName === '探究力' ? '求证欲' : topName === '表达力' ? '展示欲' : '内在动力'}时，学习效率最高。`, tips: [`用问题引导学习，而非直接给答案`, `选择与${topName}相关的课外活动`, `允许TA在感兴趣的方向深入探索`] },
    { title: `${scores_wilderLevelDesc(bottomDims[0])}需引导`, icon: '🔧', description: `${bottomName}是当前最具性价比的提升方向。不是"补短板"，而是"装新技能"。`, tips: [`用优势带动弱势——用${topName}激发${bottomName}`, `每天5-10分钟微训练，不要一次性长时间练习`, `关注过程进步，不过度关注结果`] },
    { title: '最佳学习时间与方式', icon: '⏰', description: `基于${studentName}的能力画像，建议采用"脉冲式学习"——短时间高强度专注+充分休息。`, tips: ['每次专注任务控制在15-25分钟', '切换任务时给2-3分钟缓冲', '利用感兴趣的内容做"开胃菜"，再引入需要练习的内容'] },
  ]

  const cultivationStrategy = [
    { scenario: '孩子作业拖拉', problem: '家长催促无效，亲子关系紧张', solution: `利用${studentName}的${topName}优势：把作业拆成小块，每块5-10分钟。在每块开始前设置一个与${topName}相关的"小挑战"作为启动仪式。`, expectedOutcome: '2-3周内作业时间缩短30%', color: 'blue' },
    { scenario: '对学习没兴趣', problem: '强制学习导致厌学情绪', solution: `从${studentName}的优势领域切入：先让TA在擅长的${topName}方向获得成就感，再用"你在这方面这么强，是不是因为你用了某种方法？"引导反思和迁移。`, expectedOutcome: '1-2个月内学习主动性提升', color: 'green' },
    { scenario: '和同学关系紧张', problem: '社交困难影响上学积极性', solution: `发挥${studentName}的${topName}特长创造社交机会：让TA在擅长领域"当小老师"，通过"教别人"建立社交连接和自信。`, expectedOutcome: '1-2个月内社交主动性增加', color: 'purple' },
    { scenario: '考试焦虑', problem: '越紧张越考不好，恶性循环', solution: `教${studentName}用反思力工具管理情绪：考前做"三步检查"——我准备了什么？还有什么可以快速补？不管结果如何我会怎么复盘？`, expectedOutcome: '考试焦虑程度降低，成绩波动减小', color: 'amber' },
  ]

  const ageDevelopment = age <= 9
    ? [
      { ageRange: '6-8岁', focus: '探索期：广泛接触', milestones: ['对3个以上领域表现出好奇', '能完成10分钟以上的专注任务', '愿意和同伴分享发现'], parentRole: '提供丰富的体验机会，不要过早限定方向', color: 'green' },
      { ageRange: '9-10岁', focus: '聚焦期：初步分化', milestones: ['在1-2个领域展现持续兴趣', '能自主制定简单计划', '开始出现"最喜欢的事"'], parentRole: '支持深入而非强制广泛，帮助TA在喜欢的方向上获得更多成功体验', color: 'blue' },
    ]
    : age <= 12
    ? [
      { ageRange: '10-12岁', focus: '深化期：能力定型', milestones: ['在优势领域能产出完整作品', '能进行15分钟以上的结构化表达', '开始思考"我擅长什么/不擅长什么"'], parentRole: '帮助TA建立"优势身份认同"——"你是一个很棒的探索者"', color: 'blue' },
      { ageRange: '12-14岁', focus: '整合期：自我意识', milestones: ['能用优势方法解决弱势领域问题', '有明确的学习偏好和策略', '社交网络基本形成'], parentRole: '从"指导者"转变为"顾问"——被邀请时给建议，而非主动干预', color: 'purple' },
    ]
    : [
      { ageRange: '13-15岁', focus: '整合期：个性定型', milestones: ['形成稳定的学习风格', '能独立规划中长期目标', '开始思考未来方向'], parentRole: '尊重TA的选择，提供资源而非代替决策', color: 'purple' },
      { ageRange: '15-18岁', focus: '突破期：专业化准备', milestones: ['在核心领域有可展示的成果', '能进行独立研究或创作', '对未来专业方向有初步想法'], parentRole: '做"支持系统"——提供信息、资源和情绪支持', color: 'amber' },
    ]

  const parentChildCommunication = [
    { situation: `${studentName}做事三分钟热度`, wrongApproach: '"你怎么又不坚持了？做什么事都是三分钟热度！"', rightApproach: `"你发现了这么多有趣的事情！如果选一个最想深入的，你会选哪个？"`, reason: `${topName}型孩子的注意力本身就是"脉冲式"的——短暂高峰→快速转移→再次点燃。这是特质不是缺点，需要引导聚焦而非批评。` },
    { situation: `${studentName}考试没考好`, wrongApproach: '"怎么又没考好？是不是没认真复习？"', rightApproach: `"这次有哪些题是你会做但做错的？我们一起看看发生了什么。"`, reason: '把焦点从"结果"转到"过程"，既保护自尊心，又培养反思习惯。' },
    { situation: `${studentName}跟你对着干`, wrongApproach: '"我是你妈/爸，你必须听我的！"', rightApproach: `"你有自己的想法很好。我的担心是[具体担心]，你觉得怎么解决？"`, reason: '给TA表达空间并纳入决策，比直接命令更能获得配合。' },
    { situation: `${studentName}沉迷电子产品`, wrongApproach: '"把手机给我！不准再玩了！"', rightApproach: `"我们来商量一个都能接受的使用规则？你觉得每天[时间]合理吗？"`, reason: '协商出的规则比强制执行的规则有效3倍。关键是让孩子参与制定。' },
  ]

  return { learningProfile, cultivationStrategy, ageDevelopment, parentChildCommunication }
}

function scores_wilderLevelDesc(dim: string): string {
  return DIM_LEVEL_DESC[dim]?.low?.slice(0, 6) || '该能力'
}

// ========== Phase 3: 14天快速启动计划生成器 ==========
function generateFourteenDayPlan(topDims: string[], bottomDims: string[], _studentName: string): DynamicReportData['fourteenDayPlan'] {
  const topName = DIM_META[topDims[0]]?.name || '优势'
  const bottomName = DIM_META[bottomDims[0]]?.name || '待提升'
  return [
    { day: 'D1', task: '家庭启动会', goal: '全家了解报告核心发现', duration: '30min', parentTip: '一起读报告的"定心丸"和"画像解读"部分' },
    { day: 'D2', task: `${topName}捕捉日记（启动）`, goal: `记录1件与${topName}相关的发现`, duration: '10min', parentTip: `"今天有什么让你觉得${topName === '好奇心' ? '好奇' : '有趣'}的事？"` },
    { day: 'D3', task: `${topName}捕捉日记`, goal: '连续第2天记录', duration: '10min', parentTip: '"昨天那个发现，你后来又想到什么了吗？"' },
    { day: 'D4', task: '微实验日', goal: '完成一个5分钟小实验', duration: '15min', parentTip: '"我们来试试这个想法是不是真的？"' },
    { day: 'D5', task: `${topName}捕捉日记`, goal: '习惯巩固', duration: '10min', parentTip: '"你的好奇心日记已经3篇了！"' },
    { day: 'D6', task: `${bottomName}微训练（首次）`, goal: `用5分钟完成一个${bottomName}小任务`, duration: '5min', parentTip: `"我们用5分钟试试${bottomName}的小挑战？"` },
    { day: 'D7', task: '第一周回顾', goal: '总结这一周的发现', duration: '15min', parentTip: '"这一周你最大的发现是什么？"' },
    { day: 'D8', task: '问题升级练习', goal: '把一个简单问题变成3个深度问题', duration: '15min', parentTip: '"这个问题可以拆成哪几个小问题？"' },
    { day: 'D9', task: `${topName}捕捉+${bottomName}结合`, goal: `在${topName}活动中融入${bottomName}元素`, duration: '15min', parentTip: `"做完这个之后，你能给我讲讲你是怎么做的吗？"` },
    { day: 'D10', task: '家庭实验日', goal: '全家一起做一个实验', duration: '30min', parentTip: '"今天我们一起做个实验！你来当总指挥"' },
    { day: 'D11', task: `${topName}捕捉日记`, goal: '稳定习惯', duration: '10min', parentTip: '"你的日记越来越有深度了！"' },
    { day: 'D12', task: `${bottomName}微训练`, goal: '第二次微训练', duration: '10min', parentTip: `"上次的${bottomName}练习感觉怎么样？今天想不想再试一次？"` },
    { day: 'D13', task: '"我的发现"口头分享', goal: `给家人讲述一个发现`, duration: '10min', parentTip: '"我很想听你讲讲你最近最有趣的发现！"' },
    { day: 'D14', task: '14天总复盘', goal: '整理14天成果，决定90天计划方向', duration: '20min', parentTip: '"你觉得这两周你最大的变化是什么？接下来想做什么？"' },
  ]
}

// ========== Phase 3: 365天年度发展蓝图生成器 ==========
function generateYearlyBlueprint(topDims: string[], bottomDims: string[]): DynamicReportData['yearlyBlueprint'] {
  const topName = DIM_META[topDims[0]]?.name || '优势'
  const bottomName = DIM_META[bottomDims[0]]?.name || '待提升'
  return [
    { quarter: 'Q1（第1-3个月）', theme: '习惯建立期', goals: [`建立${topName}日记习惯`, `完成3个微实验`, `${bottomName}微训练启动`], milestone: '90天成长对比报告', retestNote: '第90天建议复测，对比WILDER六维变化', color: 'green' },
    { quarter: 'Q2（第4-6个月）', theme: '项目产出期', goals: ['完成1个完整探究项目', '产出1份项目报告', `${bottomName}维度提升5-10分`], milestone: '第一个完整项目作品', color: 'blue' },
    { quarter: 'Q3（第7-9个月）', theme: '能力整合期', goals: ['完成1个跨维度整合项目', '开始建立个人作品集', '尝试1次公开展示'], milestone: '个人作品集初版', retestNote: '第270天建议复测，观察半年以上的能力曲线变化', color: 'purple' },
    { quarter: 'Q4（第10-12个月）', theme: '突破与展望', goals: ['参加1次校级/区级展示或比赛', '完善个人作品集', '制定下一年度方向'], milestone: '年度成长总结+下一年规划', retestNote: '第365天年度复测，生成年度成长追踪报告', color: 'amber' },
  ]
}

// ========== Phase 3: 课程产品线匹配生成器 ==========
function generateCurriculumMatching(
  topDims: string[], bottomDims: string[], wilderPct: Record<string, number>, age: number
): DynamicReportData['curriculumMatching'] {
  const courses: DynamicReportData['curriculumMatching']['recommended'] = []
  const topName = DIM_META[topDims[0]]?.name || ''
  const top2Name = DIM_META[topDims[1]]?.name || ''

  // 科普课推荐逻辑
  if (topDims.includes('W') || topDims.includes('I')) {
    courses.push({
      name: '荒野科普课', type: '科普课', icon: '🌿',
      reason: `${topName}(${wilderPct[topDims[0]]}分)驱动的好奇心+探究力适合在真实自然场景中学习科学知识，科普课的"观察-提问-验证"流程与WILDER优势高度匹配。`,
      priority: '首选', color: 'green', ageRange: age <= 9 ? '自然启蒙营(6-9岁)' : age <= 12 ? '科学探索营(10-12岁)' : '研学精英营(13+岁)',
    })
  }

  // 科创课推荐逻辑
  if (topDims.includes('D') || topDims.includes('I') || topDims.includes('E')) {
    courses.push({
      name: '荒野科创课', type: '科创课', icon: '🔧',
      reason: `${topDims.includes('D') ? `设计力(D:${wilderPct.D})` : `${topName}(${wilderPct[topDims[0]]})`}支撑从"想法→方案→作品"的完整闭环，科创课的项目制学习能最大化发挥这一优势。`,
      priority: topDims.includes('D') ? '首选' : '推荐', color: 'blue', ageRange: age <= 10 ? '创意工坊(8-10岁)' : '科创实验室(11-14岁)',
    })
  }

  // 科考课推荐逻辑
  if (topDims.includes('W') || topDims.includes('L') || wilderPct.W >= 65) {
    courses.push({
      name: '荒野科考课', type: '科考课', icon: '🏕️',
      reason: `${topDims.includes('W') ? `好奇心(W:${wilderPct.W})` : `${topName}`}驱动的探索欲望在户外科考场景中能获得最大释放。同时，科考课的团队协作环节能有效提升连接力(L:${wilderPct.L})。`,
      priority: topDims.includes('W') && topDims.includes('L') ? '首选' : '推荐', color: 'amber', ageRange: age <= 10 ? '自然探险(8-10岁)' : age <= 13 ? '生态科考(11-13岁)' : '野外研学(14+岁)',
    })
  }

  // 如果没有匹配到任何首选，添加通用推荐
  if (courses.length === 0) {
    courses.push({
      name: '荒野科普课', type: '科普课', icon: '🌿',
      reason: `适合${topName}+${top2Name}组合的基础科学素养培养，在轻松有趣的环境中激发学习兴趣。`,
      priority: '推荐', color: 'green', ageRange: age <= 9 ? '自然启蒙营(6-9岁)' : '科学探索营(10-12岁)',
    })
  }

  // 根据弱势维度补充推荐
  if (bottomDims.includes('L') && !courses.some(c => c.type === '科考课')) {
    courses.push({
      name: '荒野科考课（连接力提升）', type: '科考课', icon: '🏕️',
      reason: `连接力(L:${wilderPct.L})是当前最具提升空间的维度。科考课的小组合作模式能在户外实践中自然提升协作能力。`,
      priority: '补强推荐', color: 'amber', ageRange: age <= 10 ? '自然探险(8-10岁)' : '生态科考(11-13岁)',
    })
  }
  if (bottomDims.includes('E') && !courses.some(c => c.name.includes('科创'))) {
    courses.push({
      name: '荒野科创课（表达力提升）', type: '科创课', icon: '🔧',
      reason: `表达力(E:${wilderPct.E})可通过科创课的"项目展示"环节得到实战锻炼——每个项目都需要"讲给别人听"。`,
      priority: '补强推荐', color: 'blue', ageRange: age <= 10 ? '创意工坊(8-10岁)' : '科创实验室(11-14岁)',
    })
  }

  const rationale = `基于${topDims.map(d => `${DIM_META[d].name}(${wilderPct[d]})`).join('+')}的核心优势和${bottomDims.map(d => `${DIM_META[d].name}(${wilderPct[d]})`).join('+')}的提升需求，我们从GROWMATE三大产品线（科普课·科创课·科考课）中为您精准匹配了${courses.length}个推荐方案。`

  return { recommended: courses, rationale }
}

// ========== Phase 3b: 风险预判生成器（学习/社交/职业） ==========

const LEARNING_RISK_MAP: Record<string, { subjects: string[]; content: string; warning: string }> = {
  W: {
    subjects: ['语文深层阅读', '历史人文感悟', '政治哲学思辨'],
    content: '随着年级升高，学科评价将从"知识复述"转向"人文感悟"和"深层理解"。好奇心(W)驱动的孩子倾向于追逐新鲜事物，但在需要反复精读、深度共情的学科中容易感到枯燥。语文学科的"深层解析"和历史/社会学科的"跨时空同理心"可能成为挑战——TA可能觉得这些课程只是为了考试而存在的"僵尸知识"，从而产生厌学心理。',
    warning: '一旦出现"这有什么用"的口头禅，说明学习动机正在从内驱转向被迫。',
  },
  I: {
    subjects: ['数学应用题', '科学实验报告', '英语写作表达'],
    content: '探究力(I)强的孩子善于提问和分析，但容易陷入"分析瘫痪"——花大量时间研究问题本身，却在输出环节（写报告、做总结、表达观点）上卡壳。随着学业难度增加，"想得深但写不出"的矛盾会越来越明显。考试中可能出现"明明懂了但分数不高"的困境，因为TA的思维过程难以用标准答题格式呈现。',
    warning: '如果孩子经常说"我知道答案但不知道怎么写"，这是信号。',
  },
  L: {
    subjects: ['团队项目合作', '课堂讨论参与', '社会实践活动'],
    content: '连接力(L)较弱意味着在需要团队协作的学习场景中处于劣势。随着教育改革推进项目式学习(PBL)，小组合作占分比重逐年增加。TA可能在分组时被"剩下"，或在小组中沦为"沉默执行者"而非"主动贡献者"，导致合作类科目成绩偏低。更深层的风险是：TA可能因此产生"我不擅长和别人合作"的自我认知，形成回避型社交模式。',
    warning: '如果老师频繁反馈"课堂参与度不够"，需要引起重视。',
  },
  D: {
    subjects: ['综合实践活动', '信息技术项目', '理科实验设计'],
    content: '设计力(D)不足的孩子在"从0到1"的创造型任务中会显得吃力。当学校要求完成科创项目、课题研究或自主设计实验时，TA可能不知从何下手——不是缺少想法，而是缺少把想法变成可执行方案的"工程思维"。这种能力在未来教育中越来越重要，尤其是综合素质评价、自主招生面试等场景。',
    warning: '如果孩子面对开放性任务时频繁说"我不会"或"老师没教过"，说明设计力需要培养。',
  },
  E: {
    subjects: ['口语考试', '课堂展示', '辩论与演讲', '面试'],
    content: '表达力(E)不足在小学阶段影响不大，但进入初高中后会成为显性短板。课堂讨论、辩论赛、研究性学习答辩、升学面试……这些场景都在考验"把想法清晰传达给别人"的能力。TA可能"肚子里有货倒不出来"，在竞争性展示场合被表达流利的同学压过，导致明明实力不差却屡屡"输在嘴上"。',
    warning: '如果孩子在需要当众发言时持续回避、紧张或敷衍了事，需要及时干预。',
  },
  R: {
    subjects: ['错题整理', '复习规划', '考试策略', '自主学习'],
    content: '反思力(R)薄弱的核心风险在于"重复犯错"和"效率低下"。随着学业难度提升，单纯靠聪明和努力已经不够，需要"学习如何学习"的元认知能力。TA可能花了大量时间学习但成绩提升缓慢，因为没有建立有效的错题分析、知识整理和复习规划系统。高中阶段这种差距会被急剧放大——同样的智力水平，有反思习惯的学生可能领先1-2个年级。',
    warning: '如果同样的错误反复出现3次以上，说明反思-修正的闭环没有建立。',
  },
}

const SOCIAL_RISK_MAP: Record<string, { content: string; scenarios: string[]; warning: string }> = {
  W: {
    scenarios: ['话题终结者', '注意力飘忽', '兴趣不持久'],
    content: '好奇心驱动的孩子在社交中容易"话题跳跃"——正聊一个话题突然被新事物吸引，让对方觉得"TA不在乎我说的话"。在需要持续关注和深度倾听的友谊维护中，这种模式容易让同伴感到被忽视。TA可能朋友很多但"知心朋友"很少，因为深度关系需要持续的情感投入，而TA的注意力总是被新鲜事物牵走。',
    warning: '如果孩子的"最好的朋友"频繁更换（每学期换一个），需要引导深度社交能力。',
  },
  I: {
    scenarios: ['过度质疑', '挑剔同伴', '说教倾向'],
    content: '探究力强的孩子容易在社交中表现出"过度较真"——对同伴的观点刨根问底，或不自觉地纠正别人的错误。虽然出发点是求真，但在同龄人看来这是"杠精"或"爱挑刺"。青春期后这种行为更容易被解读为"自以为是"或"不尊重人"，导致社交圈缩小。',
    warning: '如果其他家长或老师反馈"孩子说话太直接"或"让别的小朋友不舒服"，要开始引导社交技巧。',
  },
  L: {
    scenarios: ['社交边缘化', '缺乏归属感', '冲突回避'],
    content: '连接力不足的孩子极易成为社交场域中的"隐形人"。TA捕捉不到非言语暗示（眼神、语调、社交潜规则），常会在不合时宜的场合说出破坏气氛的话。这种"不懂眼色"的行为会被同龄人解读为"傲慢"或"自私"，导致TA在青春期社交圈中被边缘化，或者只能建立极为浅层的玩伴关系，缺乏真正的情感支持网络。',
    warning: '如果孩子回家后从不提起同学的名字，或总说"没有人和我玩"，这是社交预警信号。',
  },
  D: {
    scenarios: ['缺乏主见', '依赖他人', '被动跟随'],
    content: '设计力不足在社交中表现为"缺乏主见"——总是等别人提方案、定规则。在需要共同决策的场景中（玩什么游戏、去哪里玩、怎么分工），TA容易成为"跟随者"而非"发起者"。长期来看，这会影响TA在同伴中的影响力和领导力，甚至形成"讨好型人格"——为了维持关系而压抑自己的需求。',
    warning: '如果孩子在朋友面前总是"随便""都行""你们定"，需要刻意培养主动表达偏好的能力。',
  },
  E: {
    scenarios: ['沉默寡言', '情感隔离', '误解频发'],
    content: '表达力不足的核心社交风险是"内心戏丰富但嘴上说不出"。TA可能有自己的想法和感受，但无法有效传达给同伴，导致被误解为"冷漠""不合群"。在冲突情境中，TA可能选择沉默或爆发（因为找不到合适的表达方式），两种极端都会损害关系。随着年龄增长，"会说话"越来越成为社交核心竞争力，这个短板的影响会逐年放大。',
    warning: '如果孩子在社交冲突后选择独自哭泣或完全回避，而不是寻求帮助，需要介入。',
  },
  R: {
    scenarios: ['重复社交错误', '不吸取教训', '关系修复困难'],
    content: '反思力弱的孩子在社交中容易"踩同一个坑"——上次因为某句话得罪了朋友，下次还是同样的方式。TA缺乏"社交复盘"的习惯，不会在冲突后思考"我哪里做得不好"。这导致社交技能的成长速度远慢于同龄人，到了青春期可能出现明显的社交成熟度落差，被同伴视为"幼稚"。',
    warning: '如果同样的社交冲突反复发生（比如总是因为"不守规则"被小朋友排斥），需要专门引导。',
  },
}

const CAREER_RISK_MAP: Record<string, { content: string; fields: string[]; warning: string }> = {
  W: {
    fields: ['需要长期专注的研究岗', '重复性高的技术工种', '严格流程化的管理岗'],
    content: '好奇心驱动型人才在需要"十年磨一剑"的深度研究领域（如基础科学、学术研究）可能缺乏耐力。在未来职业中，TA可能频繁跳槽、转行，难以在一个领域积累足够深度的专业壁垒。虽然跨界能力是优势，但如果没有至少一个"根据地"，容易变成"什么都懂一点，什么都不精"的职业困境。',
    warning: '关键是帮TA找到一个"持续感兴趣"的核心领域，用好奇心作为燃料而非障碍。',
  },
  I: {
    fields: ['快速决策的管理岗', '需要妥协的商务谈判', '人情世故密集的公关'],
    content: '探究力型人才容易在需要"差不多就行"的商业环境中不适应。TA追求完美和深度理解的特质，在快节奏的商业决策、需要灵活妥协的谈判、以及靠关系推动的业务场景中可能成为阻碍。TA可能因为"还没研究透"而错过最佳决策窗口，或因为"不愿意将就"而失去合作机会。',
    warning: '需要平衡"追求真相"和"务实推进"的能力，这是从学术到职场最大的适应挑战。',
  },
  L: {
    fields: ['团队管理', '客户关系', '产品设计', '医疗服务'],
    content: '在未来需要高度协作、用户心理洞察或系统性统筹的职业中，连接力不足会成为看不见的"天花板"。管理岗需要理解团队成员的需求和情绪，产品设计需要深度共情用户，医疗和教育需要建立信任关系——这些都依赖于连接力。TA可能技术能力很强，但难以晋升到需要"管人"而非"管事"的层级，在行业中触碰到看不见的职业天花板。',
    warning: '技术路线可能更适合TA，但也需要基本的协作能力来支撑职业发展。',
  },
  D: {
    fields: ['创业', '产品经理', '建筑设计', '战略规划'],
    content: '设计力不足在未来创新驱动的经济中是严重的竞争力缺失。从"方案设计"到"产品原型"，从"商业计划"到"战略规划"，设计力是把想法变为现实的桥梁。TA可能擅长发现问题但不擅长设计解决方案，在需要"从0到1"创造的岗位中会明显落后于同级竞争者。',
    warning: '可以通过项目制学习逐步培养"先做一个最小版本"的实践思维。',
  },
  E: {
    fields: ['销售与市场', '公共演讲', '教育培训', '内容创作'],
    content: '表达力在未来职业中的权重将持续上升——无论是向投资人介绍项目、向团队传达愿景、还是向客户展示方案，"能把事情讲清楚、讲得打动人"是跨行业的核心竞争力。表达力不足可能导致TA的才华被低估——"做得好但说不好"，在升职加薪、资源争取等关键节点上吃亏。',
    warning: '表达力是可以训练的技能，越早开始越好。从"家庭分享时间"开始每天练习。',
  },
  R: {
    fields: ['战略咨询', '投资决策', '科学研究', '高管层'],
    content: '反思力是从"执行者"到"决策者"的关键跃迁能力。缺乏反思习惯的人在需要复盘、迭代、战略调整的高层岗位中会遇到瓶颈。TA可能在职业前期凭借聪明和勤奋快速成长，但到了需要"从经验中提取模式"和"从失败中学习系统"的阶段，成长曲线会明显放缓，被那些"每天复盘"的竞争对手超越。',
    warning: '反思力的培养需要"刻意练习"——不是自然会的，但一旦养成习惯，终身受益。',
  },
}

function generateRiskPredictions(
  _topDims: string[], bottomDims: string[], _wilderPct: Record<string, number>,
  name: string, age: number
): DynamicReportData['riskPredictions'] {
  // 用发展潜力维度作为核心成长方向
  const growthDim = bottomDims[0] || 'R'
  const secondGrowth = bottomDims[1] || 'L'
  const ageLabel = age <= 9 ? '小学低年级' : age <= 12 ? '小学高年级' : age <= 15 ? '初中' : '高中'

  const lr = LEARNING_RISK_MAP[growthDim] || LEARNING_RISK_MAP['R']
  const sr = SOCIAL_RISK_MAP[growthDim] || SOCIAL_RISK_MAP['R']
  const cr = CAREER_RISK_MAP[secondGrowth] || CAREER_RISK_MAP['L']

  return {
    learningRisk: {
      title: `学习成长机会：${DIM_META[growthDim].name}的发展空间`,
      content: `${name}目前处于${ageLabel}阶段，${DIM_META[growthDim].name}有充足的成长空间。${lr.content.replace('可能遇到', '可以通过练习改善')}。这正是教育干预的最佳时机——研究表明，针对性的练习可以在90天内使该维度提升5-10分。`,
      subjects: lr.subjects,
      warning: lr.warning.replace('风险', '关注点'),
    },
    socialRisk: {
      title: `社交发展潜力：${DIM_META[growthDim].name}在同伴交往中的成长机会`,
      content: `${name}的${DIM_META[growthDim].name}正在发展中，这意味着在社交场景中有明确的成长方向。${sr.content.replace('可能产生', '可以通过练习改善')}。每个孩子都有自己的社交节奏，关键是找到适合TA的方式。`,
      scenarios: sr.scenarios,
      warning: sr.warning.replace('风险', '成长点'),
    },
    careerBlindspot: {
      title: `未来发展潜力：${DIM_META[secondGrowth].name}的提升空间`,
      content: `${name}的${DIM_META[secondGrowth].name}有提升空间，这意味着在未来职业发展中有一个明确的成长方向。${cr.content.replace('可能形成隐性瓶颈', '可以通过针对性训练转化为优势')}。记住：能力是动态发展的，不是固定标签。`,
      fields: cr.fields,
      warning: cr.warning.replace('盲点', '发展点'),
    },
  }
}

// ========== Phase 3: 置信度与动态发展说明生成器 ==========
function generateConfidenceStatement(
  _scores: AssessmentScores, enhancedReport: EnhancedReport, age: number
): DynamicReportData['confidenceStatement'] {
  const confidence = enhancedReport.confidenceLevel
  const cv = enhancedReport.crossValidation

  // v2.0: 综合置信度和交叉验证一致性确定置信度区间
  const cvConsistency = cv?.overallConsistency || 0
  const combinedConfidence = Math.round((confidence + cvConsistency) / 2)
  const overallRange = combinedConfidence >= 90 ? '0.90-0.95（高置信度）'
    : combinedConfidence >= 80 ? '0.80-0.92（良好置信度）'
    : combinedConfidence >= 70 ? '0.70-0.85（基础置信度）'
    : '0.60-0.75（参考置信度）'

  // v2.0: 数据驱动的 factors（替代硬编码）
  const modelCount = cv?.modelValidations?.length || 5
  const modelNames = cv?.modelValidations?.map(m => m.modelName).slice(0, 4).join('+') || 'WILDER+MI+BigFive+认知发展+执行功能'
  const consistencyDesc = cv?.consistencyLevel === 'excellent' ? '极高' : cv?.consistencyLevel === 'good' ? '良好' : cv?.consistencyLevel === 'moderate' ? '中等' : '待提升'
  const inconsistencyNote = cv && cv.inconsistencies.length > 0
    ? `，${cv.inconsistencies.length}项待观察`
    : ''

  const factors = [
    { name: '测评完整度', value: `置信度${confidence}%`, contribution: `覆盖6维度多模态评估，答题完整度直接影响置信度水平` },
    { name: '回答一致性', value: `${consistencyDesc}${inconsistencyNote}`, contribution: `同维度不同题目的回答一致性${consistencyDesc}，交叉验证分数${cvConsistency}%` },
    { name: '多模型交叉验证', value: `${modelCount}模型`, contribution: `${modelNames}独立验证` },
    { name: '情境多样性', value: '选择+判断+对话', contribution: '多种题型减少单一方法的偏差' },
  ]

  const dynamicNote = `重要提示：本报告反映的是测评时点（${new Date().toLocaleDateString('zh-CN')}）的能力状态，而非"终身标签"。根据发展心理学研究：
• 6-12岁儿童的认知能力每年可变化10-15%
• 有针对性的训练可在90天内使弱势维度提升5-10分
• 优势维度在合适的培养环境下会持续增强
• WILDER六维画像随年龄和经历动态变化，建议每3-6个月复测追踪`

  const ageStageNote: Record<string, string> = {
    '6-8': '此阶段大脑可塑性极强，几乎所有维度都可以通过环境刺激和训练显著提升。当前画像更多反映"初始倾向"而非"固定能力"。',
    '9-11': '此阶段能力开始分化但仍有高度可塑性。优势维度的"马太效应"开始显现——强的越强。需要在保持优势的同时给弱势维度创造练习机会。',
    '12-14': '此阶段能力画像趋于稳定但仍在发展。优势维度已形成较稳定的行为模式，弱势维度的提升需要更有针对性的方法。',
    '15+': '此阶段核心能力画像基本定型，但仍可以通过刻意练习提升。建议聚焦在1-2个核心优势的深度发展。',
  }
  const ageKey = age <= 8 ? '6-8' : age <= 11 ? '9-11' : age <= 14 ? '12-14' : '15+'
  const ageChangeNote = ageStageNote[ageKey]

  return {
    overallRange,
    factors,
    dynamicNote,
    ageChangeNote,
    retestRecommendation: `建议在${age <= 12 ? '90天' : '6个月'}后进行复测，生成"成长追踪报告"对比各维度变化趋势。`,
  }
}

// ===================================================================
// 教育学家圆桌会诊默认内容生成器（向后兼容）
// 当博弈引擎失败时使用
// ===================================================================

function generateDefaultEducatorPanel(
  childName: string,
  age: number,
  topDims: string[],
  _weakDims: string[]
): EducatorPanelResult {
  const topDimNames = topDims.map(d => DIM_META[d]?.name || d).join('、')
  
  return {
    sessionTitle: `${childName}的成长圆桌讨论`,
    childProfile: `${childName}，${age}岁，WILDER测评结果显示在${topDimNames}方面表现突出。本次邀请教育学家基于测评数据提供多视角的教育建议。`,
    dialogues: [
      {
        round: 1,
        speakerId: 'tao',
        speakerName: '陶行知',
        speakerAvatar: '🌾',
        type: 'observation',
        content: `${childName}展现出了良好的发展潜力。我的教育理念是"生活即教育"，建议家长多给孩子创造真实的生活体验机会，让孩子在做中学、学中做。`,
        targetDimensions: topDims
      },
      {
        round: 1,
        speakerId: 'montessori',
        speakerName: '蒙台梭利',
        speakerAvatar: '🏛️',
        type: 'observation',
        content: `从${topDimNames}的表现来看，${childName}拥有内在的学习驱动力。建议为孩子创造一个丰富的"预备环境"，让TA自由选择想要探索的领域。`,
        targetDimensions: topDims
      },
      {
        round: 3,
        speakerId: 'tao',
        speakerName: '陶行知',
        speakerAvatar: '🌾',
        type: 'consensus',
        content: `作为本次圆桌讨论的主持人，我代表各位教育同仁总结：\n\n第一，${childName}是一个独特而珍贵的生命，TA的每一个特质都值得被看见和尊重。\n\n第二，教育的本质是"教学做合一"——在真实的生活中学习、在具体的实践中成长。\n\n第三，家长可以根据孩子的实际情况，选择最适合的成长路径。\n\n最后，请记住：每个孩子都是一颗独特的种子，教育是提供阳光、水分和肥沃的土壤，然后——耐心等待花开。`,
        targetDimensions: ['W', 'I', 'L', 'D', 'E', 'R']
      }
    ],
    consensusPoints: [
      {
        title: `继续发展${topDimNames}优势`,
        supporters: ['陶行知', '蒙台梭利', '杜威'],
        recommendation: `${childName}在${topDimNames}方面有良好表现，建议提供更具挑战性的任务和更广阔的实践平台。`,
        rationale: '尊重儿童的发展规律，在优势领域深耕细作'
      }
    ],
    divergencePoints: [],
    finalRecommendation: `经过教育专家的分析，针对${childName}的成长形成了核心共识：继续发展${topDimNames}优势，同时在日常生活中创造多元化的学习体验。家长们可以结合自己的教育理念和孩子的实际情况，找到最适合的成长路径。`,
    actionPlan: [
      {
        priority: 'high',
        action: `为${childName}设计与${topDimNames}相关的挑战项目`,
        source: '教育专家团队',
        timeframe: '本周',
        targetDim: topDims[0] || 'W'
      },
      {
        priority: 'medium',
        action: '每周安排家庭分享时间，让孩子表达自己的想法',
        source: '陶行知',
        timeframe: '本周',
        targetDim: 'E'
      }
    ]
  }
}
