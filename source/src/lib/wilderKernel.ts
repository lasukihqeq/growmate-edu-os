// ===================================================================
// WILDER-729 AI 模型能力分型内核 v2.0.0
// 基于GROWMATEAI模型能力分型内核文档
// 729种学习画像 = 6维度 × 3档(H/M/L) = 3^6
// 整合 VATWP 五模态评估 + 课程/职业推荐规则
// v2.0: 集成30种潜能类型系统 + 个性化报告内容库
// ===================================================================

// ========== 30类型系统导入与再导出 ==========
export { TALENT_TYPES_30, matchTalentType30, crossMatchProfile, getAllTalentTypes, getTalentsByTier, registerTalentType } from './talentTypes30'
export type { TalentType30, TalentTier, CrossMatchResult } from './talentTypes30'
export { TALENT_REPORT_CONTENT, getReportContent, getUniversitiesByTier, getBooksByTarget, getParentFocusAreas } from './reportPersonalization'
export type { TalentReportContent, UniversityRec, BookRec, DocumentaryRec, ParentFocus } from './reportPersonalization'

import { matchTalentType30 as _matchTalent30 } from './talentTypes30'

// ========== 类型定义 ==========

/** WILDER 六维度 */
export type WilderDimension = 'W' | 'I' | 'L' | 'D' | 'E' | 'R'

/** 维度水平：1=低, 2=中, 3=高 (对应文档 T001 W3 I2 L1 格式) */
export type WilderLevel = 1 | 2 | 3

/** 729种画像编码 e.g. "W3I2L1D2E1R1" */
export type ProfileCode729 = string

/** 五种评估模态 */
export type AssessmentModality = 'V' | 'A' | 'T' | 'W' | 'P'

/** 人格特质四维度分数 */
export interface PersonalityTraitsScores {
  /** 社交能量方向：高=外向型，低=内向型 (0-100) */
  socialEnergy: number
  /** 信息处理偏好：高=直觉型，低=感觉型 (0-100) */
  infoProcessing: number
  /** 决策风格：高=思考型，低=情感型 (0-100) */
  decisionStyle: number
  /** 生活组织方式：高=计划型，低=灵活型 (0-100) */
  lifeOrganization: number
}

/** 人格画像信息（用于 Profile729 输出） */
export interface PersonalityProfileInfo {
  /** 人格类型中文描述，如"热情社交型" */
  typeName: string
  /** 核心特质描述 */
  coreTraits: string[]
  /** 与 WILDER 维度的关联说明 */
  wilderCorrelation: string
}

/** WILDER 维度元数据 */
export interface WilderDimensionMeta {
  key: WilderDimension
  name: string
  nameEn: string
  emoji: string
  description: string
  keywords: string[]
  weightTrigger: string
  /** 25项二级能力目标 */
  secondLevelAbilities: string[]
  /** 高/中/低描述 */
  levelDescriptions: {
    high: string
    mid: string
    low: string
  }
}

/** 模态评估规则 */
export interface ModalityRule {
  key: AssessmentModality
  name: string
  nameZh: string
  icon: string
  color: string
  triggers: string[]
  assessment: string
  output: string
  /** 该模态可评估的WILDER维度及权重 */
  wilderWeights: Partial<Record<WilderDimension, number>>
}

/** 729画像类型 */
export interface Profile729 {
  /** 编号 T001-T729 */
  id: string
  /** 编码如 W3I2L1D2E1R1 */
  code: ProfileCode729
  /** WILDER各维度水平 */
  levels: Record<WilderDimension, WilderLevel>
  /** 潜能类型名 */
  talentName: string
  talentNameEn: string
  /** 人格画像（基于四维度评估，使用中文描述） */
  personalityProfile: PersonalityProfileInfo
  /** 孩子特点描述 */
  characterDescription: string
  /** 优势描述 */
  strengthDesc: string
  /** 短板描述 */
  weaknessDesc: string
  /** 教育加强点 */
  educationFocus: string[]
  /** 未来职业方向 */
  careerPaths: string[]
  /** 推荐课程类型 */
  recommendedCourses: {
    kepu?: string   // 科普课
    kechuang?: string // 科创课
    kekao?: string    // 科考课
  }
}

/** 课程产品线 */
export interface ProductLine {
  key: string
  name: string
  alias: string
  delivery: string
  core: string
  typicalOutputs: string[]
  typicalWilder: { primary: WilderDimension[]; support: WilderDimension[] }
  typicalModalities: AssessmentModality[]
}

/** 证据包结构 */
export interface EvidencePacket {
  modality: AssessmentModality
  timestamp: string
  wilderDimensions: WilderDimension[]
  confidence: number
  summary: string
  auditTrail: string
  /** 人格特质验证依据（可选） */
  personalityEvidence?: {
    /** 人格类型名称 */
    typeName: string
    /** 核心特质 */
    coreTraits: string[]
    /** 与WILDER维度的关联证据 */
    wilderCorrelationEvidence: string
    /** 验证一致性分数 (0-100) */
    consistencyScore: number
  }
}

/** 完整评估报告 */
export interface WilderReport729 {
  profile: Profile729
  wilderScores: Record<WilderDimension, number>
  wilderPercentiles: Record<WilderDimension, number>
  modalityEvidence: EvidencePacket[]
  courseRecommendations: ProductLine[]
  careerInsights: string[]
  parentGuidance: string
  growthPlan: { shortTerm: string; longTerm: string }
  auditLog: { model_version: string; timestamp: string; data_privacy: string }
}

// ========== WILDER 六维度定义 ==========

export const WILDER_DIMENSIONS: WilderDimensionMeta[] = [
  {
    key: 'W',
    name: '好奇心',
    nameEn: 'Wonder',
    emoji: '🔭',
    description: '对自然与现象的主动追问',
    keywords: ['提问', '好奇', '观察', '现象', '为什么', '怎么会', '发现', '惊奇', '探索', '初识', '启发'],
    weightTrigger: '命中≥2词 → Wonder+20%',
    secondLevelAbilities: [
      '观察力', '提问力', '想象力', '求知欲', '敏感度',
      '新奇探索', '玩耍精神', '注意力集中', '学习敏捷', '惊奇感',
      '创意发散', '直觉探索', '情境感受', '游戏心态', '开放心态',
      '冒险精神', '探索坚持', '创新驱动', '感官敏锐', '审美力',
      '体验开放', '灵感捕捉', '想象扩展', '学习驱动', '情绪驱动'
    ],
    levelDescriptions: {
      high: '对世界充满强烈好奇，善于发现问题和提出追问',
      mid: '有一定好奇心，需要适当激发和引导',
      low: '倾向于接受已知，探索欲和追问习惯待唤醒'
    }
  },
  {
    key: 'I',
    name: '探究力',
    nameEn: 'Inquiry',
    emoji: '🔬',
    description: '科学方法与证据推理',
    keywords: ['假设', '对照', '变量', '数据', '测量', '图表', '验证', '实验', '证据', '推理', '分析', '样方', '样线', '监测'],
    weightTrigger: '命中≥2词 → Inquiry+25%',
    secondLevelAbilities: [
      '提问能力', '假设建构', '研究设计', '数据采集', '数据分析',
      '逻辑推理', '验证能力', '问题解决', '工具使用', '实地探究',
      '实验操作', '资料检索', '批判性思维', '创新探究', '合作探究',
      '时间管理', '资源利用', '学科整合', '沟通交流', '结果呈现',
      '证据运用', '学习迁移', '迭代改进', '自我驱动', '科学精神'
    ],
    levelDescriptions: {
      high: '善于追根究底，有科学思维雏形和证据意识',
      mid: '有求证意识，但深度和系统性不够稳定',
      low: '更依赖直觉判断，求证和验证习惯待培养'
    }
  },
  {
    key: 'L',
    name: '连接力',
    nameEn: 'Link',
    emoji: '🤝',
    description: '知识迁移与系统关联',
    keywords: ['连接', '迁移', '应用', '跨学科', '系统图', '生态链', '食物网', '关联', '情境', '真实世界'],
    weightTrigger: '命中≥2词 → Link+15%',
    secondLevelAbilities: [
      '知识迁移', '系统思维', '跨学科整合', '概念图谱', '信息整合',
      '模式识别', '生态理解', '社会连接', '因果推理', '时间关联',
      '空间关联', '类比能力', '文化连接', '技术应用', '学习整合',
      '情境应用', '网络思维', '知识映射', '多元连接', '价值链接',
      '语言连接', '情感连接', '思维整合', '跨界协作', '全球视野'
    ],
    levelDescriptions: {
      high: '善于协作，能主动融入团队，并将知识跨域迁移',
      mid: '能配合他人，主动性和知识迁移能力有提升空间',
      low: '偏好独立行动，跨域关联和社交协作需引导'
    }
  },
  {
    key: 'D',
    name: '设计力',
    nameEn: 'Design',
    emoji: '📐',
    description: '方案迭代与工程思维',
    keywords: ['方案', '原型', '迭代', '测试', 'BOM', '工程', '设计', '约束', '需求', '用户', '装置', '结构'],
    weightTrigger: '命中≥2词 → Design+25%',
    secondLevelAbilities: [
      '原型设计', '方案创新', '模型建构', '优化改进', '工程思维',
      '创意构思', '问题定义', '结构设计', '空间设计', '材料运用',
      '可持续设计', '用户导向', '原因分析', '风险控制', '表达设计',
      '审美设计', '交互设计', '系统设计', '团队共创', '项目管理',
      '实用导向', '创新突破', '学科融合', '实践验证', '迭代改进'
    ],
    levelDescriptions: {
      high: '善于规划和组织，做事有条理，能将想法转为可行方案',
      mid: '有基础的计划能力，方案设计和执行中偶有偏差',
      low: '更倾向即兴行动，系统规划和工程思维待培养'
    }
  },
  {
    key: 'E',
    name: '表达力',
    nameEn: 'Expression',
    emoji: '🎤',
    description: '结构化表达与说服力',
    keywords: ['解释', '表达', '路演', '展板', '视频', '演示', '汇报', '展示', '说服', '结构化', '可视化'],
    weightTrigger: '命中≥2词 → Expression+15%',
    secondLevelAbilities: [
      '逻辑表达', '语言表达', '视觉表达', '故事讲述', '数据表达',
      '情绪表达', '多模态表达', '演讲能力', '沟通能力', '说服能力',
      '辩论能力', '表演表达', '艺术表达', '创意表达', '技术表达',
      '知识表达', '合作交流', '跨文化表达', '影响力表达', '反馈表达',
      '图文结合', '声音表达', '即兴表达', '结构化呈现', '多媒体表达'
    ],
    levelDescriptions: {
      high: '善于表达和展示，沟通有感染力和说服力',
      mid: '能基本表达想法，深度、结构和感染力待提升',
      low: '表达较含蓄内敛，需要更多展示机会和方法训练'
    }
  },
  {
    key: 'R',
    name: '反思力',
    nameEn: 'Reflection',
    emoji: '🪞',
    description: '复盘深度与改进策略',
    keywords: ['复盘', '反思', '改进', '下一步', '评估', '自评', '互评', '优化', '迭代反馈'],
    weightTrigger: '命中≥2词 → Reflection+10%',
    secondLevelAbilities: [
      '自我认知', '目标反思', '行为评估', '过程复盘', '结果审视',
      '改进规划', '自我调节', '情绪反思', '学习反思', '成长评估',
      '失败分析', '成功总结', '习惯养成', '自我监控', '元认知',
      '经验提炼', '策略评估', '价值反思', '深度思考', '自我效能',
      '同伴反思', '批判自省', '长期视角', '自律能力', '成长型心态'
    ],
    levelDescriptions: {
      high: '有良好的自我觉察和复盘习惯，能主动优化行为',
      mid: '能进行初步反思，归因分析和改进策略待加强',
      low: '反思意识较薄弱，需要方法引导和习惯培养'
    }
  },
]

// ========== VATWP 五模态评估规则 ==========

export const MODALITY_RULES: ModalityRule[] = [
  {
    key: 'V',
    name: 'Video',
    nameZh: '视频动作',
    icon: '🎬',
    color: 'from-red-500 to-rose-500',
    triggers: ['观察', '操作', '协作', '实验', '野外', '动手', '制作', '搭建'],
    assessment: '动作质量、协作行为、操作规范性',
    output: '行为切片 + 协作热力图',
    wilderWeights: { I: 30, D: 25, L: 25, W: 10, R: 10 }
  },
  {
    key: 'A',
    name: 'Audio',
    nameZh: '音频语音',
    icon: '🎙️',
    color: 'from-violet-500 to-purple-500',
    triggers: ['表达', '讲解', '路演', '讨论', '汇报', '答辩', '解释'],
    assessment: '语言结构、逻辑清晰度、说服力',
    output: '语音转文字 + 表达评分',
    wilderWeights: { E: 40, I: 20, L: 15, W: 15, R: 10 }
  },
  {
    key: 'T',
    name: 'Text',
    nameZh: '文本书面',
    icon: '📝',
    color: 'from-blue-500 to-cyan-500',
    triggers: ['记录', '日志', '报告', '反思', '文档', '笔记', '总结'],
    assessment: '书面表达质量、证据引用、逻辑链',
    output: '文本分析 + 写作能力雷达',
    wilderWeights: { R: 30, I: 25, E: 20, W: 15, D: 10 }
  },
  {
    key: 'W',
    name: 'Work',
    nameZh: '作品工作',
    icon: '🏗️',
    color: 'from-amber-500 to-orange-500',
    triggers: ['作品', '装置', '展板', '图纸', '模型', '原型', '代码', '系统图'],
    assessment: '作品完成度、创意、工程质量',
    output: '作品档案 + 多维评分',
    wilderWeights: { D: 35, I: 20, W: 20, E: 15, R: 10 }
  },
  {
    key: 'P',
    name: 'Peer',
    nameZh: '同伴互评',
    icon: '👥',
    color: 'from-emerald-500 to-teal-500',
    triggers: ['互评', '小组', '协作', '讨论', '反馈'],
    assessment: '同伴评价信度、协作贡献度',
    output: '互评矩阵 + 协作网络图',
    wilderWeights: { L: 40, E: 20, R: 20, D: 10, W: 10 }
  },
]

// ========== 课程产品线定义 ==========

export const PRODUCT_LINES: ProductLine[] = [
  {
    key: 'kepu',
    name: '科普',
    alias: '校内科学实验课',
    delivery: '校内/课后服务',
    core: '实验/现象/验证',
    typicalOutputs: ['实验记录', '小作品', '结论卡'],
    typicalWilder: { primary: ['I', 'W'], support: ['E', 'R'] },
    typicalModalities: ['V', 'T', 'W'],
  },
  {
    key: 'kechuang',
    name: '科创',
    alias: '周末户外PBL体系课',
    delivery: '周末户外体系课',
    core: '真实问题 + 项目产出',
    typicalOutputs: ['展板', '装置', '数据报告', '路演'],
    typicalWilder: { primary: ['D', 'I'], support: ['E', 'L', 'R'] },
    typicalModalities: ['V', 'A', 'W', 'P'],
  },
  {
    key: 'kekao',
    name: '科考',
    alias: '寒暑假营地目的地科考',
    delivery: '寒暑假营地',
    core: '目的地为母体',
    typicalOutputs: ['科考手册', '野外数据', '研究报告', '物种档案'],
    typicalWilder: { primary: ['I', 'L'], support: ['W', 'D', 'R'] },
    typicalModalities: ['V', 'T', 'W', 'A'],
  },
]

// ========== 729 画像生成引擎 ==========

/** 将 H/M/L 映射为 3/2/1 */
function levelCode(l: WilderLevel): string {
  return l === 3 ? 'H' : l === 2 ? 'M' : 'L'
}

/** 生成 T-编号 (001-729) */
function profileIndex(levels: Record<WilderDimension, WilderLevel>): number {
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
  let idx = 0
  dims.forEach((d, i) => {
    idx += (levels[d] - 1) * Math.pow(3, 5 - i)
  })
  return idx + 1 // 1-based
}

/** 生成画像编码 e.g. "W3I2L1D2E1R1" */
function encodeProfile(levels: Record<WilderDimension, WilderLevel>): ProfileCode729 {
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
  return dims.map(d => `${d}${levels[d]}`).join('')
}

/** 生成 HML 短码 e.g. "HML-MHL" */
export function encodeHML(levels: Record<WilderDimension, WilderLevel>): string {
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
  const codes = dims.map(d => levelCode(levels[d]))
  return `${codes.slice(0, 3).join('')}-${codes.slice(3).join('')}`
}

// ========== 潜能类型映射表 (扩展版) ==========
// 基于前两个最高维度组合, 覆盖所有 C(6,2)=15 种

// 旧版15类型映射表 (保留向后兼容，新系统使用 talentTypes30.ts)
/** @deprecated 使用 TALENT_TYPES_30 替代 */
export const TALENT_MAP_LEGACY: Record<string, {
  name: string
  nameEn: string
  desc: string
  personalityProfile: { typeName: string; coreTraits: string[]; wilderCorrelation: string }
  careers: string[]
}> = {
  'WI': {
    name: '灵动探索者',
    nameEn: 'Agile Explorer',
    desc: '天生的发现者，善于提出问题并追根究底，在好奇心和科学方法间自如切换',
    personalityProfile: {
      typeName: '好奇思辨型',
      coreTraits: ['思维敏捷', '善于联想', '独立探索'],
      wilderCorrelation: '好奇心与探究力的双重优势，适合需要创新思维的研究领域'
    },
    careers: ['自然科考纪录片导演', '科学教育主持人', '研究员', '创新创业者']
  },
  'WL': {
    name: '社交发现家',
    nameEn: 'Social Discoverer',
    desc: '在互动中发现灵感，善于连接人与知识，把好奇心传递给周围的人',
    personalityProfile: {
      typeName: '热情社交型',
      coreTraits: ['善于沟通', '富有感染力', '善于激励他人'],
      wilderCorrelation: '连接力与好奇心的结合，在社交中发现和传递知识'
    },
    careers: ['公益组织创始人', '教育培训师', '社区活动策划', '国际NGO工作者']
  },
  'WD': {
    name: '创意建筑师',
    nameEn: 'Creative Architect',
    desc: '好奇心驱动的规划者，能将天马行空的想法变为可行蓝图',
    personalityProfile: {
      typeName: '战略创意型',
      coreTraits: ['有远见', '善于规划', '创意驱动'],
      wilderCorrelation: '设计力与好奇心的结合，将创意转化为可执行的方案'
    },
    careers: ['产品设计师', '建筑师', '发明家', '创业公司CEO']
  },
  'WE': {
    name: '故事探险家',
    nameEn: 'Story Adventurer',
    desc: '用生动的表达分享探索发现，天生的传播者和叙事者',
    personalityProfile: {
      typeName: '表达探索型',
      coreTraits: ['善于讲故事', '富有感染力', '探索精神'],
      wilderCorrelation: '表达力与好奇心的结合，善于将发现转化为引人入胜的叙事'
    },
    careers: ['科普作家', '纪录片编导', '短视频创作者', '演讲教练']
  },
  'WR': {
    name: '深度思考者',
    nameEn: 'Deep Thinker',
    desc: '好奇且善于自省，在沉思中寻找答案，追求认知的深度',
    personalityProfile: {
      typeName: '内省思考型',
      coreTraits: ['深度思考', '自我觉察', '追求真理'],
      wilderCorrelation: '反思力与好奇心的结合，在探索中进行深层认知加工'
    },
    careers: ['哲学研究者', '心理咨询师', '作家', '独立研究员']
  },
  'IL': {
    name: '团队研究员',
    nameEn: 'Team Researcher',
    desc: '在协作中展现卓越的求证和推理能力，能带领团队攻克难题',
    personalityProfile: {
      typeName: '协作分析型',
      coreTraits: ['团队协作', '逻辑严密', '善于求证'],
      wilderCorrelation: '连接力与探究力的结合，在团队中发挥"大脑"角色'
    },
    careers: ['科研项目负责人', '实验室主管', '数据科学家', '质量工程师']
  },
  'ID': {
    name: '系统分析师',
    nameEn: 'System Analyst',
    desc: '善于设计验证方案，用数据说话，在求证中构建系统性理解',
    personalityProfile: {
      typeName: '系统分析型',
      coreTraits: ['系统思维', '严谨求证', '善于规划'],
      wilderCorrelation: '设计力与探究力的结合，将求证过程系统化、方法论化'
    },
    careers: ['系统工程师', '科研数据分析师', '产品经理', '专利工程师']
  },
  'IE': {
    name: '科学演说家',
    nameEn: 'Science Presenter',
    desc: '能将复杂发现用生动语言传递给他人，让科学不再枯燥',
    personalityProfile: {
      typeName: '理性表达型',
      coreTraits: ['善于讲解', '逻辑清晰', '有说服力'],
      wilderCorrelation: '表达力与探究力的结合，将复杂知识转化为通俗表达'
    },
    careers: ['科学传播人', '大学教授', 'TED演讲者', '科技记者']
  },
  'IR': {
    name: '哲学探究者',
    nameEn: 'Philosophical Inquirer',
    desc: '在求证与反思的循环中不断深化认知，追求真理',
    personalityProfile: {
      typeName: '求真思辨型',
      coreTraits: ['追求真理', '深度反思', '辩证思维'],
      wilderCorrelation: '反思力与探究力的结合，在求证中不断深化认知'
    },
    careers: ['基础科研学者', '科学哲学家', '政策分析师', '独立调查记者']
  },
  'LD': {
    name: '项目统筹师',
    nameEn: 'Project Coordinator',
    desc: '善于组织团队和资源，推动项目有序进行，天生的领导者',
    personalityProfile: {
      typeName: '组织领导型',
      coreTraits: ['善于统筹', '团队领导', '目标导向'],
      wilderCorrelation: '设计力与连接力的结合，在团队中发挥组织核心作用'
    },
    careers: ['项目经理', '管理咨询师', '运营总监', '社会企业家']
  },
  'LE': {
    name: '沟通引领者',
    nameEn: 'Communication Leader',
    desc: '在团队中以表达力凝聚共识，激发他人的行动力',
    personalityProfile: {
      typeName: '魅力表达型',
      coreTraits: ['善于沟通', '有感染力', '凝聚人心'],
      wilderCorrelation: '表达力与连接力的结合，通过表达凝聚团队共识'
    },
    careers: ['公关经理', '人力资源总监', '市场营销总监', '社群运营']
  },
  'LR': {
    name: '和谐推动者',
    nameEn: 'Harmony Facilitator',
    desc: '善于体察他人，在团队中起到平衡作用，是隐形的组织支柱',
    personalityProfile: {
      typeName: '温和关怀型',
      coreTraits: ['善解人意', '善于调和', '默默付出'],
      wilderCorrelation: '反思力与连接力的结合，在团队中起到平衡调和作用'
    },
    careers: ['心理咨询师', '社工', '调解员', '团队教练']
  },
  'DE': {
    name: '策划演绎家',
    nameEn: 'Strategic Performer',
    desc: '能将周密计划以精彩方式呈现，兼具策略和表现力',
    personalityProfile: {
      typeName: '创意表现型',
      coreTraits: ['策划能力', '表现力强', '有感染力'],
      wilderCorrelation: '表达力与设计力的结合，将周密计划转化为精彩呈现'
    },
    careers: ['品牌策划总监', '活动导演', '广告创意人', '游戏设计师']
  },
  'DR': {
    name: '精益优化师',
    nameEn: 'Lean Optimizer',
    desc: '在反思中不断优化方案，追求卓越品质',
    personalityProfile: {
      typeName: '精益求精型',
      coreTraits: ['追求卓越', '善于优化', '持续改进'],
      wilderCorrelation: '反思力与设计力的结合，在反思中不断优化完善'
    },
    careers: ['质量管理工程师', '精益生产专家', '软件架构师', '风控分析师']
  },
  'ER': {
    name: '表达修行者',
    nameEn: 'Expressive Reflector',
    desc: '善于通过复盘提升表达的深度和感染力，不断精进表达艺术',
    personalityProfile: {
      typeName: '反思表达型',
      coreTraits: ['善于反思', '表达精进', '追求深度'],
      wilderCorrelation: '反思力与表达力的结合，在反思中不断提升表达质量'
    },
    careers: ['文学创作者', '纪录片导演', '演员/导演', '自媒体作者']
  },
}

// ========== 核心生成函数 ==========

/**
 * 根据 WILDER 六维评分 (0-100) 生成 729 画像
 * 分层逻辑: ≥70 → Level3(高), 40-69 → Level2(中), <40 → Level1(低)
 */
export function scoreToLevel(score: number): WilderLevel {
  if (score >= 70) return 3
  if (score >= 40) return 2
  return 1
}

/**
 * 根据人格特质四维度分数计算人格画像信息
 * @param pt 人格特质四维度分数（可选）
 * @returns 人格画像信息，如果无数据则返回默认值
 */
function computePersonalityProfile(pt?: PersonalityTraitsScores): PersonalityProfileInfo {
  if (!pt) {
    // 默认返回一个通用的描述
    return {
      typeName: '均衡发展型',
      coreTraits: ['善于适应', '综合平衡'],
      wilderCorrelation: '人格特质与WILDER维度均衡发展，适合多样化探索'
    }
  }

  // 基于四维度生成中文类型名
  const seType = pt.socialEnergy >= 50 ? '热情' : '沉稳'
  const ipType = pt.infoProcessing >= 50 ? '直觉' : '务实'

  // 组合生成类型名
  const typeName = `${seType}${ipType}型`

  // 生成核心特质列表
  const coreTraits: string[] = []
  if (pt.socialEnergy >= 60) coreTraits.push('善于社交')
  else if (pt.socialEnergy < 40) coreTraits.push('独立思考')

  if (pt.infoProcessing >= 60) coreTraits.push('富有想象')
  else if (pt.infoProcessing < 40) coreTraits.push('注重细节')

  if (pt.decisionStyle >= 60) coreTraits.push('逻辑分析')
  else if (pt.decisionStyle < 40) coreTraits.push('重视情感')

  if (pt.lifeOrganization >= 60) coreTraits.push('善于规划')
  else if (pt.lifeOrganization < 40) coreTraits.push('灵活应变')

  // 确保至少有2个特质
  if (coreTraits.length < 2) {
    coreTraits.push('综合平衡')
  }

  // 生成与WILDER的关联描述
  const correlations: string[] = []
  if (pt.socialEnergy >= 50) {
    correlations.push('社交能量有助于连接力(L)和表达力(E)的发挥')
  } else {
    correlations.push('内向特质有助于反思力(R)和好奇心(W)的深度发展')
  }
  if (pt.infoProcessing >= 50) {
    correlations.push('直觉偏好与好奇心(W)和探究力(I)高度契合')
  } else {
    correlations.push('感觉偏好与设计力(D)和探究力(I)的实践面相契合')
  }
  if (pt.decisionStyle >= 50) {
    correlations.push('理性决策与探究力(I)和设计力(D)的分析特性相契合')
  } else {
    correlations.push('情感决策与连接力(L)和反思力(R)的人文特性相契合')
  }
  if (pt.lifeOrganization >= 50) {
    correlations.push('计划偏好与设计力(D)和反思力(R)的系统特性相契合')
  } else {
    correlations.push('灵活偏好与好奇心(W)和表达力(E)的创造性相契合')
  }

  const wilderCorrelation = correlations.join('；')

  return {
    typeName,
    coreTraits,
    wilderCorrelation
  }
}

/**
 * 根据 WILDER 百分比分数生成完整 729 画像
 * @param wilderPcts WILDER六维百分比分数 (0-100)
 * @param personalityTraits 人格特质四维度分数（可选，用于融入人格特质描述）
 */
export function generateProfile729(
  wilderPcts: Record<WilderDimension, number>,
  personalityTraits?: PersonalityTraitsScores
): Profile729 {
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']

  // 计算各维度水平
  const levels = {} as Record<WilderDimension, WilderLevel>
  dims.forEach(d => { levels[d] = scoreToLevel(wilderPcts[d]) })

  // 生成编码
  const code = encodeProfile(levels)
  const idx = profileIndex(levels)
  const id = `T${String(idx).padStart(3, '0')}`

  // 找出前两个最高维度
  const sorted = [...dims].sort((a, b) => wilderPcts[b] - wilderPcts[a])
  const top2 = sorted.slice(0, 2)
  void top2 // 保留变量供未来扩展使用
  const bottom2 = sorted.slice(-2)

  // v2.0: 优先使用30类型匹配引擎
  const match30 = _matchTalent30(wilderPcts)
  const talent30 = match30.talent

  // 计算人格画像（优先使用传入的人格特质数据，否则使用默认值）
  const personalityProfile = computePersonalityProfile(personalityTraits)

  // 兼容旧接口：使用30类型匹配结果
  const talent = {
    name: talent30.name,
    nameEn: talent30.nameEn,
    desc: talent30.desc,
    personalityProfile: talent30.personalityProfile || personalityProfile,
    careers: talent30.careers,
  }

  // 找到维度元数据
  const dimMeta = Object.fromEntries(WILDER_DIMENSIONS.map(d => [d.key, d]))

  // 生成特点描述
  const highDims = dims.filter(d => levels[d] === 3)
  const lowDims = dims.filter(d => levels[d] === 1)

  const strengthDesc = highDims.length > 0
    ? `在${highDims.map(d => `${dimMeta[d].name}(${dimMeta[d].levelDescriptions.high})`).join('、')}方面展现出明显优势。`
    : '各维度表现较为均衡，具有全面发展的良好基础。'

  const weaknessDesc = lowDims.length > 0
    ? `${lowDims.map(d => `${dimMeta[d].name}(${dimMeta[d].levelDescriptions.low})`).join('、')}是可重点培养的成长空间。`
    : '各维度均达到中等以上水平，无明显短板。'

  // 教育加强点
  const educationFocus = bottom2.map(d =>
    `${dimMeta[d].nameEn} ${dimMeta[d].name}：${dimMeta[d].levelDescriptions[levels[d] === 3 ? 'high' : levels[d] === 2 ? 'mid' : 'low']}`
  )

  // 课程推荐（基于最强维度匹配产品线）
  const recommendedCourses: Profile729['recommendedCourses'] = {}
  PRODUCT_LINES.forEach(pl => {
    const matchScore = pl.typicalWilder.primary.reduce((s, d) => s + wilderPcts[d], 0)
      + pl.typicalWilder.support.reduce((s, d) => s + wilderPcts[d] * 0.5, 0)
    if (pl.key === 'kepu') recommendedCourses.kepu = `推荐${pl.name}课程（匹配度 ${Math.round(matchScore / 3)}%）`
    if (pl.key === 'kechuang') recommendedCourses.kechuang = `推荐${pl.name}课程（匹配度 ${Math.round(matchScore / 4)}%）`
    if (pl.key === 'kekao') recommendedCourses.kekao = `推荐${pl.name}课程（匹配度 ${Math.round(matchScore / 3.5)}%）`
  })

  // 特点描述（融入人格特质信息）
  let characterDescription = `这个孩子的核心潜能类型是「${talent.name}」。${talent.desc}。${strengthDesc}${lowDims.length > 0 ? `同时，${weaknessDesc}` : ''}`

  // 如果有人格特质数据，补充人格描述
  if (personalityTraits) {
    characterDescription += `在人格特质方面，孩子表现为「${personalityProfile.typeName}」，具有${personalityProfile.coreTraits.join('、')}等特点。`
  }

  return {
    id,
    code,
    levels,
    talentName: talent.name,
    talentNameEn: talent.nameEn,
    personalityProfile: talent.personalityProfile,
    characterDescription,
    strengthDesc,
    weaknessDesc,
    educationFocus,
    careerPaths: talent.careers,
    recommendedCourses,
  }
}

// ========== 模态评估触发引擎 ==========

/**
 * 根据课程内容关键词，自动推荐适用的评估模态
 * @param contentKeywords - 课程/任务描述中的关键词
 * @returns 推荐的模态列表（至少2种）
 */
export function recommendModalities(contentKeywords: string[]): ModalityRule[] {
  const scores: Record<AssessmentModality, number> = { V: 0, A: 0, T: 0, W: 0, P: 0 }

  contentKeywords.forEach(kw => {
    MODALITY_RULES.forEach(rule => {
      if (rule.triggers.some(t => kw.includes(t) || t.includes(kw))) {
        scores[rule.key] += 1
      }
    })
  })

  // 按匹配度排序，至少返回2种
  const sorted = MODALITY_RULES
    .map(r => ({ ...r, score: scores[r.key] }))
    .sort((a, b) => b.score - a.score)

  return sorted.slice(0, Math.max(2, sorted.filter(s => s.score > 0).length))
}

/**
 * 根据选择的模态计算对 WILDER 各维度的权重贡献
 * @returns 归一化后的维度权重 (0-100)
 */
export function calculateModalityWeights(
  activeModalities: AssessmentModality[]
): Record<WilderDimension, number> {
  const weights: Record<WilderDimension, number> = { W: 0, I: 0, L: 0, D: 0, E: 0, R: 0 }

  activeModalities.forEach(m => {
    const rule = MODALITY_RULES.find(r => r.key === m)
    if (!rule) return
    const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
    dims.forEach(d => {
      weights[d] += (rule.wilderWeights[d] || 0)
    })
  })

  // 归一化到百分比
  const total = Object.values(weights).reduce((s, v) => s + v, 0)
  if (total > 0) {
    const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
    dims.forEach(d => { weights[d] = Math.round((weights[d] / total) * 100) })
  }

  return weights
}

// ========== WILDER 关键词映射引擎 ==========

/**
 * 分析文本内容，识别 WILDER 维度关键词并计算维度加权
 * @param text - 待分析的文本内容
 * @returns 各维度的命中词数和加权分
 */
export function analyzeWilderKeywords(text: string): Record<WilderDimension, { hits: string[]; weight: number }> {
  const result = {} as Record<WilderDimension, { hits: string[]; weight: number }>

  WILDER_DIMENSIONS.forEach(dim => {
    const hits = dim.keywords.filter(kw => text.includes(kw))
    const baseWeight = hits.length >= 2
      ? parseInt(dim.weightTrigger.match(/(\d+)%/)?.[1] || '10')
      : hits.length > 0 ? 5 : 0
    result[dim.key] = { hits, weight: baseWeight }
  })

  return result
}

// ========== 证据包生成器 ==========

/**
 * 生成可审计的证据包
 * @param modality 评估模态
 * @param dimensions WILDER维度列表
 * @param confidence 置信度
 * @param summary 摘要
 * @param personalityEvidence 人格特质验证依据（可选）
 */
export function createEvidencePacket(
  modality: AssessmentModality,
  dimensions: WilderDimension[],
  confidence: number,
  summary: string,
  personalityEvidence?: EvidencePacket['personalityEvidence']
): EvidencePacket {
  const packet: EvidencePacket = {
    modality,
    timestamp: new Date().toISOString(),
    wilderDimensions: dimensions,
    confidence: Math.min(100, Math.max(0, confidence)),
    summary,
    auditTrail: `[${modality}] ${new Date().toLocaleString('zh-CN')} | dims=${dimensions.join(',')} | conf=${confidence}%`
  }

  // 如果提供了人格特质证据，添加到证据包
  if (personalityEvidence) {
    packet.personalityEvidence = personalityEvidence
  }

  return packet
}

// ========== 完整报告生成 ==========

/**
 * 生成完整的 WILDER-729 评估报告
 */
export function generateFullReport(
  wilderPcts: Record<WilderDimension, number>,
  evidence: EvidencePacket[] = [],
): WilderReport729 {
  const profile = generateProfile729(wilderPcts)
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']

  // 百分位估算 (基于10万+样本正态分布近似)
  const wilderPercentiles = {} as Record<WilderDimension, number>
  dims.forEach(d => {
    // 简单映射: 分数60 ≈ 第50百分位, 每10分约15百分位
    const pct = Math.min(99, Math.max(1, Math.round(50 + (wilderPcts[d] - 60) * 1.5)))
    wilderPercentiles[d] = pct
  })

  // 匹配最佳课程产品线
  const courseScores = PRODUCT_LINES.map(pl => {
    const score = pl.typicalWilder.primary.reduce((s, d) => s + wilderPcts[d], 0)
      + pl.typicalWilder.support.reduce((s, d) => s + wilderPcts[d] * 0.5, 0)
    return { ...pl, score }
  }).sort((a, b) => b.score - a.score)

  // 发展规划
  const highDims = dims.filter(d => profile.levels[d] === 3)

  const shortTerm = highDims.length > 0
    ? `在最强的${highDims.map(d => WILDER_DIMENSIONS.find(x => x.key === d)!.name).join('/')}方向深入一个完整项目，建立成就感和专注力。`
    : '通过多样化的GROWMATE体验课程，帮助孩子发现自己最感兴趣和最擅长的领域。'

  const longTerm = `3年后，逐步成长为具有"${profile.talentName}"特质的少年，在${profile.careerPaths.slice(0, 2).join('/')}等方向展现出色潜力。`

  return {
    profile,
    wilderScores: { ...wilderPcts },
    wilderPercentiles,
    modalityEvidence: evidence,
    courseRecommendations: courseScores.slice(0, 3),
    careerInsights: profile.careerPaths,
    parentGuidance: generateParentGuidance(profile, wilderPcts),
    growthPlan: { shortTerm, longTerm },
    auditLog: {
      model_version: '1.0.0',
      timestamp: new Date().toISOString(),
      data_privacy: '不存储可识别PII，所有推荐均可解释与审计'
    }
  }
}

// ========== 家长指导生成 ==========

function generateParentGuidance(
  profile: Profile729,
  _pcts: Record<WilderDimension, number>
): string {
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
  const highDims = dims.filter(d => profile.levels[d] === 3)
  const lowDims = dims.filter(d => profile.levels[d] === 1)

  if (highDims.length >= 3) {
    return `孩子展现出多维度的突出能力（${highDims.map(d => WILDER_DIMENSIONS.find(x => x.key === d)!.name).join('、')}），建议避免"全面开花"导致注意力分散，帮助孩子在最强的1-2个方向深入发展。建议选择GROWMATE科创或科考课程，在真实场景中锤炼核心优势。`
  }

  if (highDims.length >= 1) {
    const topDim = WILDER_DIMENSIONS.find(x => x.key === highDims[0])!
    return `孩子的核心优势在${topDim.name}（${topDim.nameEn}），建议以此为"基地"向其他维度拓展。${lowDims.length > 0 ? `同时，${lowDims.map(d => WILDER_DIMENSIONS.find(x => x.key === d)!.name).join('和')}是可以通过GROWMATE课程逐步提升的领域。` : ''}建议从科普课开始建立信心，逐步过渡到科创和科考课程。`
  }

  return '孩子各维度均处于发展中阶段，这是充满可能性的信号。建议通过GROWMATE的多样化体验课程激发潜能，先从兴趣驱动的科普课开始探索。每个孩子都有自己的节奏，耐心陪伴就是最好的教育。'
}

// ========== 数据隐私与审计 ==========

export const PRIVACY_CONFIG = {
  /** 不存储可识别PII */
  piiPolicy: 'NO_PII_STORED',
  /** 数据本地化要求 */
  dataLocalization: 'CN_MAINLAND',
  /** 支持私域化部署 */
  deploymentMode: 'PRIVATE_CLOUD_READY',
  /** 审计日志保留期 */
  auditRetention: '3_YEARS',
  /** 加密标准 */
  encryption: 'AES-256-GCM',
  /** GDPR合规 */
  compliance: ['PIPL', 'GB/T 35273-2020'],
}

/** 最低要求配置 */
export const MINIMUM_REQUIREMENTS = {
  ai_modalities_min: 2,
  evidence_points_min: 2,
  quantifiable_metrics_min: 1,
  confidence_threshold: 0.85,
}
