/**
 * GROWMATE WILDER 30种核心学习画像体系
 * 
 * 设计逻辑：基于729种理论组合，通过聚类分析和教育实践经验，
 * 将画像分为4个层级共30种核心类型
 * 
 * Layer 1 (6种): 单维度突出型 - 某一维度显著高于其他
 * Layer 2 (15种): 双维度组合型 - 两个维度共同主导
 * Layer 3 (6种): 三维度均衡导向型 - 三个维度均衡发展
 * Layer 4 (3种): 特殊发展型 - 全面均衡、极端对比、潜力待激活
 */

// ==================== WILDER维度定义 ====================

export const WILDER_DIMENSIONS = {
  W: {
    code: 'W',
    name: '荒野探索',
    nameEn: 'Wilderness Exploration',
    icon: '🏕️',
    color: '#f59e0b',
    abilities: ['户外生存', '环境适应', '自然导航', '风险感知'],
    description: '在自然环境中探索、适应和生存的能力'
  },
  I: {
    code: 'I',
    name: '探究研究',
    nameEn: 'Inquiry & Investigation',
    icon: '🔬',
    color: '#3b82f6',
    abilities: ['科学方法', '假设验证', '数据分析', '逻辑推理', '批判思维'],
    description: '运用科学方法探究问题的能力'
  },
  L: {
    code: 'L',
    name: '生命科学',
    nameEn: 'Life Science',
    icon: '🌿',
    color: '#10b981',
    abilities: ['生态认知', '物种识别', '生命关怀', '系统思维'],
    description: '理解和关爱生命系统的能力'
  },
  D: {
    code: 'D',
    name: '设计创造',
    nameEn: 'Design & Creation',
    icon: '⚙️',
    color: '#8b5cf6',
    abilities: ['问题解决', '原型制作', '迭代优化', '创新思维'],
    description: '设计解决方案并动手创造的能力'
  },
  E: {
    code: 'E',
    name: '环境意识',
    nameEn: 'Environmental Awareness',
    icon: '🌍',
    color: '#06b6d4',
    abilities: ['可持续理念', '环保行动', '公民责任', '生态伦理'],
    description: '理解环境问题并付诸行动的能力'
  },
  R: {
    code: 'R',
    name: '韧性协作',
    nameEn: 'Resilience & Teamwork',
    icon: '🤝',
    color: '#ef4444',
    abilities: ['抗挫能力', '团队沟通', '领导力', '情绪管理'],
    description: '在团队中展现韧性和协作的能力'
  }
} as const

// ==================== 30种核心画像定义 ====================

export interface Profile30 {
  id: string
  layer: 1 | 2 | 3 | 4
  category: string
  name: string
  nameEn: string
  icon: string
  tagline: string
  description: string
  wilderPattern: {
    primary: string[]    // 主导维度
    secondary?: string[] // 次要维度
    developing?: string[] // 待发展维度
  }
  characteristics: string[]
  learningStyle: {
    name: string
    description: string
    bestEnvironment: string
  }
  socialPattern: {
    name: string
    description: string
  }
  growthFocus: string[]
  careerHints: string[]
}

export interface SalesStrategy30 {
  profileId: string
  // 客户沟通话术
  communication: {
    openingScript: string      // 开场话术
    valueProposition: string   // 价值主张
    trustBuilding: string      // 建立信任
    needDiscovery: string[]    // 需求挖掘问题
  }
  // 家长痛点与应对
  painPoints: Array<{
    pain: string
    diagnosis: string
    response: string
    evidence?: string
  }>
  // 课程推荐逻辑
  courseRecommendation: {
    tier1: Array<{ course: string; reason: string; priority: number }>
    tier2: Array<{ course: string; reason: string; priority: number }>
    upsell: Array<{ course: string; trigger: string }>
  }
  // 价格策略
  pricingStrategy: {
    sensitivity: 'high' | 'medium' | 'low'
    preferredPackage: string
    discountTrigger: string
    bundleRecommendation: string
  }
  // 增值服务建议
  valueAddedServices: Array<{
    service: string
    reason: string
    timing: string
  }>
  // 异议处理
  objectionHandling: Array<{
    objection: string
    response: string
    followUp?: string
  }>
  // 成交策略
  closingStrategy: {
    bestTiming: string[]
    closingTechnique: string
    urgencyCreation: string
    riskReversal: string
  }
  // KPI关联
  kpiTargets: {
    conversionRateTarget: number  // 目标转化率 %
    avgOrderValue: number          // 目标客单价 元
    renewalRateTarget: number      // 目标续费率 %
    referralPotential: 'high' | 'medium' | 'low'
  }
}

// ==================== Layer 1: 单维度突出型 (6种) ====================

const LAYER1_PROFILES: Profile30[] = [
  {
    id: 'W-dominant',
    layer: 1,
    category: '单维度突出型',
    name: '荒野探险家',
    nameEn: 'Wilderness Explorer',
    icon: '🏕️',
    tagline: '天生的冒险家，在自然中如鱼得水',
    description: '荒野探索(W)维度显著突出，对户外环境有天然的热爱和适应能力。这类孩子在野外环境中最能展现自信，具有出色的环境感知和风险判断能力。',
    wilderPattern: { primary: ['W'], secondary: [], developing: ['I', 'D'] },
    characteristics: ['热爱户外活动', '方向感极强', '适应能力突出', '喜欢挑战极限', '在自然中专注力倍增'],
    learningStyle: { name: '体验式学习', description: '通过亲身体验和感官感知学习最有效', bestEnvironment: '户外开放环境，有挑战性的自然场地' },
    socialPattern: { name: '探险伙伴型', description: '喜欢与志同道合的伙伴一起探索，在冒险中建立深厚友谊' },
    growthFocus: ['将探险经验转化为系统知识', '培养科学记录习惯', '发展团队领导力'],
    careerHints: ['户外教练', '野生动物保护员', '探险向导', '地质勘探', '环境监测']
  },
  {
    id: 'I-dominant',
    layer: 1,
    category: '单维度突出型',
    name: '科学研究者',
    nameEn: 'Scientific Researcher',
    icon: '🔬',
    tagline: '天生的探究者，用科学方法解读世界',
    description: '探究研究(I)维度显著突出，对科学方法有天然的理解和运用能力。这类孩子善于提问、假设、验证，具有严谨的逻辑思维。',
    wilderPattern: { primary: ['I'], secondary: [], developing: ['E', 'R'] },
    characteristics: ['问题意识强', '逻辑思维缜密', '善于数据分析', '追求证据支撑', '喜欢深度钻研'],
    learningStyle: { name: '探究式学习', description: '通过提出问题和验证假设的方式学习最有效', bestEnvironment: '有观察工具和记录材料的实验环境' },
    socialPattern: { name: '学术伙伴型', description: '喜欢与能进行深度讨论的伙伴交流，在学术讨论中最活跃' },
    growthFocus: ['拓展知识面广度', '加强表达和分享', '培养团队协作能力'],
    careerHints: ['科学家', '研究员', '数据分析师', '医学研究', '技术开发']
  },
  {
    id: 'L-dominant',
    layer: 1,
    category: '单维度突出型',
    name: '生命守护者',
    nameEn: 'Life Guardian',
    icon: '🌿',
    tagline: '天生的生命共情者，与自然万物心意相通',
    description: '生命科学(L)维度显著突出，对生命有天然的敏感和关爱能力。这类孩子善于观察生命现象，对生态系统有深刻理解。',
    wilderPattern: { primary: ['L'], secondary: [], developing: ['D', 'R'] },
    characteristics: ['对生命高度敏感', '观察力细腻', '有同理心', '关注生态平衡', '喜欢照顾动植物'],
    learningStyle: { name: '观察式学习', description: '通过细致观察生命现象学习最有效', bestEnvironment: '有丰富生物多样性的自然环境' },
    socialPattern: { name: '关怀伙伴型', description: '在团队中常扮演照顾者角色，善于关注他人需求' },
    growthFocus: ['将感性认知转化为系统知识', '培养科学表达能力', '发展行动力'],
    careerHints: ['生物学家', '兽医', '生态保护', '园艺师', '自然教育工作者']
  },
  {
    id: 'D-dominant',
    layer: 1,
    category: '单维度突出型',
    name: '创意工程师',
    nameEn: 'Creative Engineer',
    icon: '⚙️',
    tagline: '天生的创造者，用双手改变世界',
    description: '设计创造(D)维度显著突出，对解决问题和动手制作有天然的热情。这类孩子善于将想法变成现实，具有出色的工程思维。',
    wilderPattern: { primary: ['D'], secondary: [], developing: ['I', 'L'] },
    characteristics: ['动手能力强', '创意丰富', '善于解决问题', '追求完美', '喜欢改造事物'],
    learningStyle: { name: '项目式学习', description: '通过动手制作项目学习最有效', bestEnvironment: '有充足材料和工具的创客空间' },
    socialPattern: { name: '协作创造型', description: '喜欢与团队一起完成有挑战性的制作任务' },
    growthFocus: ['加强理论基础', '培养系统设计思维', '提升团队沟通能力'],
    careerHints: ['工程师', '设计师', '发明家', '建筑师', '产品经理']
  },
  {
    id: 'E-dominant',
    layer: 1,
    category: '单维度突出型',
    name: '环保行动派',
    nameEn: 'Environmental Activist',
    icon: '🌍',
    tagline: '天生的地球守护者，用行动践行责任',
    description: '环境意识(E)维度显著突出，对环境问题有强烈的责任感和行动力。这类孩子关注可持续发展，具有出色的公民意识。',
    wilderPattern: { primary: ['E'], secondary: [], developing: ['W', 'D'] },
    characteristics: ['环保意识强', '责任感突出', '善于影响他人', '关注社会议题', '行动力强'],
    learningStyle: { name: '行动式学习', description: '通过参与环保行动学习最有效', bestEnvironment: '有实际环保项目的社区环境' },
    socialPattern: { name: '倡导领袖型', description: '善于组织和动员他人参与有意义的行动' },
    growthFocus: ['深化科学知识基础', '培养系统思考能力', '平衡理想与现实'],
    careerHints: ['环保工作者', '可持续发展顾问', '公益组织', '政策研究', '绿色企业']
  },
  {
    id: 'R-dominant',
    layer: 1,
    category: '单维度突出型',
    name: '团队核心',
    nameEn: 'Team Core',
    icon: '🤝',
    tagline: '天生的领袖，在协作中绽放光芒',
    description: '韧性协作(R)维度显著突出，在团队环境中最能发挥能力。这类孩子具有出色的抗挫能力和团队协调能力。',
    wilderPattern: { primary: ['R'], secondary: [], developing: ['I', 'L'] },
    characteristics: ['团队意识强', '抗挫能力突出', '善于沟通协调', '情绪稳定', '乐于助人'],
    learningStyle: { name: '协作式学习', description: '通过团队项目学习最有效', bestEnvironment: '需要团队协作的任务环境' },
    socialPattern: { name: '团队枢纽型', description: '自然成为团队的核心连接者和气氛调节者' },
    growthFocus: ['发展专业技能深度', '培养独立思考能力', '加强知识系统性'],
    careerHints: ['团队管理者', '人力资源', '教练', '心理咨询', '社区工作者']
  }
]

// ==================== Layer 2: 双维度组合型 (15种) ====================

const LAYER2_PROFILES: Profile30[] = [
  {
    id: 'WI-explorer-researcher',
    layer: 2,
    category: '双维度组合型',
    name: '野外科学家',
    nameEn: 'Field Scientist',
    icon: '🦎',
    tagline: '在荒野中探索科学奥秘',
    description: '荒野探索(W)与探究研究(I)的组合。既热爱户外冒险，又善于科学探究，是真正的野外科学家类型。',
    wilderPattern: { primary: ['W', 'I'], developing: ['E', 'R'] },
    characteristics: ['野外考察能力强', '善于实地研究', '数据收集严谨', '探险与科学兼备'],
    learningStyle: { name: '野外考察式', description: '在真实自然环境中进行科学探究最有效', bestEnvironment: '有研究价值的自然保护区或野外基地' },
    socialPattern: { name: '科考团队型', description: '擅长组织和参与野外科学考察团队' },
    growthFocus: ['提升团队协作能力', '加强环保行动意识', '培养知识分享习惯'],
    careerHints: ['野外生物学家', '地质学家', '生态研究员', '探险纪录片制作', '自然摄影师']
  },
  {
    id: 'WL-nature-connector',
    layer: 2,
    category: '双维度组合型',
    name: '自然连接者',
    nameEn: 'Nature Connector',
    icon: '🦋',
    tagline: '与自然万物建立深度连接',
    description: '荒野探索(W)与生命科学(L)的组合。既能适应户外环境，又对生命有深刻理解和关爱。',
    wilderPattern: { primary: ['W', 'L'], developing: ['I', 'D'] },
    characteristics: ['与自然共情', '生态敏感度高', '户外适应力强', '善于物种识别'],
    learningStyle: { name: '沉浸式观察', description: '在自然环境中长时间沉浸观察学习最有效', bestEnvironment: '生物多样性丰富的自然保护区' },
    socialPattern: { name: '自然向导型', description: '喜欢带领他人发现自然之美' },
    growthFocus: ['培养系统科学思维', '加强创造与设计能力', '提升影响力'],
    careerHints: ['自然教育导师', '生态旅游向导', '野生动物保护', '自然疗愈师', '有机农业']
  },
  {
    id: 'WD-adventure-maker',
    layer: 2,
    category: '双维度组合型',
    name: '冒险创造家',
    nameEn: 'Adventure Maker',
    icon: '🛶',
    tagline: '在探险中创造无限可能',
    description: '荒野探索(W)与设计创造(D)的组合。既热爱户外冒险，又善于动手解决问题，是真正的户外创客。',
    wilderPattern: { primary: ['W', 'D'], developing: ['I', 'R'] },
    characteristics: ['野外生存技能强', '善于就地取材', '创造性解决问题', '适应力与动手能力兼备'],
    learningStyle: { name: '挑战式制作', description: '在户外挑战中通过动手制作解决问题最有效', bestEnvironment: '有材料资源的户外营地' },
    socialPattern: { name: '实干领袖型', description: '在团队中常是动手解决问题的核心' },
    growthFocus: ['加强理论知识深度', '培养科学记录习惯', '提升团队沟通能力'],
    careerHints: ['户外装备设计师', '生存教练', '探险装备工程师', '户外产品开发', '野外建筑师']
  },
  {
    id: 'WE-eco-explorer',
    layer: 2,
    category: '双维度组合型',
    name: '生态探索者',
    nameEn: 'Eco Explorer',
    icon: '🌲',
    tagline: '用探索行动守护地球',
    description: '荒野探索(W)与环境意识(E)的组合。既热爱户外探险，又具有强烈的环保责任感。',
    wilderPattern: { primary: ['W', 'E'], developing: ['I', 'L'] },
    characteristics: ['探险与环保兼备', '善于发现环境问题', '行动力强', '责任感突出'],
    learningStyle: { name: '行动探索式', description: '在户外探索中发现并解决环境问题最有效', bestEnvironment: '有环保实践机会的自然保护区' },
    socialPattern: { name: '环保先锋型', description: '善于带动他人参与环保行动' },
    growthFocus: ['深化科学知识基础', '加强生态系统理解', '培养耐心和细致'],
    careerHints: ['环境监测员', '保护区巡护员', '环保探险家', '生态纪录片制作', '可持续旅游']
  },
  {
    id: 'WR-adventure-leader',
    layer: 2,
    category: '双维度组合型',
    name: '探险领袖',
    nameEn: 'Adventure Leader',
    icon: '🏔️',
    tagline: '带领团队征服每一座高峰',
    description: '荒野探索(W)与韧性协作(R)的组合。既有出色的户外能力，又具有团队领导力。',
    wilderPattern: { primary: ['W', 'R'], developing: ['I', 'E'] },
    characteristics: ['户外领导力强', '团队凝聚力高', '抗压能力突出', '善于激励他人'],
    learningStyle: { name: '团队探险式', description: '在带领团队完成户外挑战中学习最有效', bestEnvironment: '有团队任务的户外拓展营地' },
    socialPattern: { name: '探险队长型', description: '天生的户外团队领袖' },
    growthFocus: ['加强专业知识深度', '培养科学思维', '提升环境意识'],
    careerHints: ['户外拓展教练', '探险队领队', '团建培训师', '户外运动教练', '青少年营地主管']
  },
  {
    id: 'IL-bio-researcher',
    layer: 2,
    category: '双维度组合型',
    name: '生命科学家',
    nameEn: 'Life Science Researcher',
    icon: '🧬',
    tagline: '用科学方法探索生命奥秘',
    description: '探究研究(I)与生命科学(L)的组合。既有严谨的科学思维，又对生命系统有深刻理解。',
    wilderPattern: { primary: ['I', 'L'], developing: ['D', 'R'] },
    characteristics: ['科学思维与生命关怀兼备', '善于生物观察实验', '数据分析能力强', '系统思考能力突出'],
    learningStyle: { name: '实验观察式', description: '通过设计实验观察生命现象学习最有效', bestEnvironment: '有实验设备的自然实验室' },
    socialPattern: { name: '学术研究型', description: '喜欢与志同道合者进行深度学术讨论' },
    growthFocus: ['加强动手创造能力', '提升团队协作能力', '培养行动力'],
    careerHints: ['生物学家', '医学研究员', '生态学家', '药物研发', '基因工程师']
  },
  {
    id: 'ID-science-engineer',
    layer: 2,
    category: '双维度组合型',
    name: '科创工程师',
    nameEn: 'Science Engineer',
    icon: '🔧',
    tagline: '用科学原理创造解决方案',
    description: '探究研究(I)与设计创造(D)的组合。既有严谨的科学思维，又有出色的工程实现能力。',
    wilderPattern: { primary: ['I', 'D'], developing: ['W', 'R'] },
    characteristics: ['科学与工程兼备', '善于从原理到实现', '系统设计能力强', '追求精益求精'],
    learningStyle: { name: '科学创客式', description: '从科学原理出发进行工程设计最有效', bestEnvironment: '有完善设备的科创实验室' },
    socialPattern: { name: '技术专家型', description: '在专业领域有深度的交流最活跃' },
    growthFocus: ['加强户外适应能力', '提升团队沟通能力', '培养环境意识'],
    careerHints: ['工程师', '发明家', '技术创新者', '专利研发', '科技企业家']
  },
  {
    id: 'IE-science-advocate',
    layer: 2,
    category: '双维度组合型',
    name: '科学传播者',
    nameEn: 'Science Advocate',
    icon: '📢',
    tagline: '用科学知识推动环境行动',
    description: '探究研究(I)与环境意识(E)的组合。既有科学素养，又有环保行动力，善于用科学证据推动变革。',
    wilderPattern: { primary: ['I', 'E'], developing: ['W', 'R'] },
    characteristics: ['科学素养与行动力兼备', '善于用数据说话', '有影响力', '关注社会议题'],
    learningStyle: { name: '调研行动式', description: '通过科学调研支撑环保行动最有效', bestEnvironment: '有实际环境问题研究的社区' },
    socialPattern: { name: '专业倡导型', description: '用专业知识影响公共决策' },
    growthFocus: ['加强户外实践能力', '提升团队领导力', '培养共情能力'],
    careerHints: ['环境科学家', '科学记者', '政策研究员', '可持续发展顾问', 'NGO负责人']
  },
  {
    id: 'IR-methodical-researcher',
    layer: 2,
    category: '双维度组合型',
    name: '深度思考者',
    nameEn: 'Deep Thinker',
    icon: '💡',
    tagline: '在深思熟虑中寻找真理',
    description: '探究研究(I)与韧性协作(R)的组合。既有深度思考能力，又能在团队中发挥学术影响力。',
    wilderPattern: { primary: ['I', 'R'], developing: ['W', 'D'] },
    characteristics: ['思维深度与韧性兼备', '善于复杂问题分析', '团队学术讨论能力强', '不轻言放弃'],
    learningStyle: { name: '协作研究式', description: '在团队深度讨论中学习最有效', bestEnvironment: '有学术氛围的研讨环境' },
    socialPattern: { name: '学术领袖型', description: '在学术团队中常是思想核心' },
    growthFocus: ['加强户外实践能力', '提升动手创造能力', '培养行动力'],
    careerHints: ['学者', '研究项目负责人', '智库研究员', '教授', '科学顾问']
  },
  {
    id: 'LD-eco-designer',
    layer: 2,
    category: '双维度组合型',
    name: '生态设计师',
    nameEn: 'Eco Designer',
    icon: '🌻',
    tagline: '设计与自然和谐共生的未来',
    description: '生命科学(L)与设计创造(D)的组合。既理解生态系统，又善于设计创造，追求人与自然的和谐。',
    wilderPattern: { primary: ['L', 'D'], developing: ['I', 'E'] },
    characteristics: ['生态美学与设计兼备', '善于仿生设计', '自然材料运用', '可持续设计理念'],
    learningStyle: { name: '自然创客式', description: '从自然中获取灵感进行设计创造最有效', bestEnvironment: '有自然材料的创作工作室' },
    socialPattern: { name: '艺术生态型', description: '在艺术与自然交叉领域最活跃' },
    growthFocus: ['加强科学方法训练', '提升环保行动力', '培养团队协作能力'],
    careerHints: ['生态建筑师', '可持续设计师', '自然艺术家', '景观设计师', '绿色产品设计']
  },
  {
    id: 'LE-nature-educator',
    layer: 2,
    category: '双维度组合型',
    name: '生命教育者',
    nameEn: 'Life Educator',
    icon: '🌱',
    tagline: '用生命故事传递环保理念',
    description: '生命科学(L)与环境意识(E)的组合。既理解生命系统，又有强烈的环保责任感，善于传递生态教育理念。',
    wilderPattern: { primary: ['L', 'E'], developing: ['I', 'R'] },
    characteristics: ['生命关怀与环保行动兼备', '善于生态教育', '有感染力', '使命感强'],
    learningStyle: { name: '生态教育式', description: '在传递生态知识中深化理解最有效', bestEnvironment: '有教育功能的自然保护区' },
    socialPattern: { name: '生态导师型', description: '善于引导他人建立生态意识' },
    growthFocus: ['加强科学研究能力', '提升动手实践能力', '培养领导力'],
    careerHints: ['自然教育工作者', '环保NGO负责人', '科普作家', '生态纪录片导演', '有机农场主']
  },
  {
    id: 'LR-empathic-mentor',
    layer: 2,
    category: '双维度组合型',
    name: '共情引导者',
    nameEn: 'Empathic Mentor',
    icon: '👑',
    tagline: '用生命关怀温暖每一颗心',
    description: '生命科学(L)与韧性协作(R)的组合。既有对生命的深刻理解，又有出色的团队关怀能力。',
    wilderPattern: { primary: ['L', 'R'], developing: ['I', 'D'] },
    characteristics: ['共情能力与团队关怀兼备', '善于倾听和支持', '情感细腻', '团队氛围调节者'],
    learningStyle: { name: '关怀协作式', description: '在关怀团队成员中学习成长最有效', bestEnvironment: '温暖支持的团队环境' },
    socialPattern: { name: '团队护卫型', description: '是团队中的情感支柱和氛围守护者' },
    growthFocus: ['加强科学思维训练', '提升动手创造能力', '培养独立性'],
    careerHints: ['心理咨询师', '社工', '特殊教育教师', '动物疗愈师', '生命教练']
  },
  {
    id: 'DE-innovation-activist',
    layer: 2,
    category: '双维度组合型',
    name: '创新行动家',
    nameEn: 'Innovation Activist',
    icon: '♻️',
    tagline: '用创新设计解决环境问题',
    description: '设计创造(D)与环境意识(E)的组合。既有创新设计能力，又有环保责任感，善于创造可持续解决方案。',
    wilderPattern: { primary: ['D', 'E'], developing: ['I', 'R'] },
    characteristics: ['创新与环保兼备', '善于绿色设计', '行动力强', '解决问题导向'],
    learningStyle: { name: '绿色创客式', description: '在解决环境问题中进行创新设计最有效', bestEnvironment: '有环保项目的创客空间' },
    socialPattern: { name: '创变者型', description: '善于发起和推动有影响力的创新项目' },
    growthFocus: ['加强科学理论基础', '提升团队领导力', '培养系统思维'],
    careerHints: ['可持续创新设计师', '社会企业家', '绿色科技创业者', '环保产品开发', '循环经济顾问']
  },
  {
    id: 'DR-creative-leader',
    layer: 2,
    category: '双维度组合型',
    name: '创意领袖',
    nameEn: 'Creative Leader',
    icon: '🚀',
    tagline: '带领团队创造改变世界的可能',
    description: '设计创造(D)与韧性协作(R)的组合。既有创新设计能力，又有团队领导力，善于带领团队完成创新项目。',
    wilderPattern: { primary: ['D', 'R'], developing: ['I', 'E'] },
    characteristics: ['创新与领导力兼备', '善于团队项目管理', '抗压能力强', '目标导向'],
    learningStyle: { name: '项目领导式', description: '在带领团队完成创新项目中学习最有效', bestEnvironment: '有团队任务的项目环境' },
    socialPattern: { name: '项目统帅型', description: '是创新项目的自然领导者' },
    growthFocus: ['加强科学方法训练', '提升环境意识', '培养细腻观察力'],
    careerHints: ['创业者', '项目经理', '创新团队负责人', '产品总监', '设计工作室主管']
  },
  {
    id: 'ER-change-agent',
    layer: 2,
    category: '双维度组合型',
    name: '变革推动者',
    nameEn: 'Change Agent',
    icon: '🌟',
    tagline: '凝聚团队力量推动环保变革',
    description: '环境意识(E)与韧性协作(R)的组合。既有强烈的环保责任感，又有团队组织能力，善于发起社会变革。',
    wilderPattern: { primary: ['E', 'R'], developing: ['I', 'D'] },
    characteristics: ['责任感与组织力兼备', '善于动员行动', '韧性强', '影响力大'],
    learningStyle: { name: '运动组织式', description: '在组织环保行动中学习成长最有效', bestEnvironment: '有社会行动机会的社区' },
    socialPattern: { name: '社会领袖型', description: '是环保社群的核心组织者' },
    growthFocus: ['加强科学知识基础', '提升动手创造能力', '培养专业深度'],
    careerHints: ['环保组织领导者', '社会活动家', '公益负责人', '社区组织者', '可持续发展顾问']
  }
]

// ==================== Layer 3: 三维度均衡导向型 (6种) ====================

const LAYER3_PROFILES: Profile30[] = [
  {
    id: 'WIL-field-naturalist',
    layer: 3,
    category: '三维度均衡型',
    name: '博物学家',
    nameEn: 'Field Naturalist',
    icon: '📖',
    tagline: '在田野中书写自然百科',
    description: '荒野探索(W)、探究研究(I)、生命科学(L)三维度均衡发展。具有博物学家的综合素养。',
    wilderPattern: { primary: ['W', 'I', 'L'], developing: ['D', 'E', 'R'] },
    characteristics: ['野外能力强', '科学素养高', '博物知识广', '善于系统观察和记录'],
    learningStyle: { name: '博物考察式', description: '在综合性野外考察中学习最有效', bestEnvironment: '物种丰富的自然保护区' },
    socialPattern: { name: '知识分享型', description: '喜欢分享博物发现，是自然知识的传播者' },
    growthFocus: ['培养创造与设计能力', '加强环保行动力', '提升团队领导力'],
    careerHints: ['博物学家', '自然博物馆研究员', '生态作家', '野外考察专家', '科普节目主持人']
  },
  {
    id: 'IDL-bio-engineer',
    layer: 3,
    category: '三维度均衡型',
    name: '生物工程师',
    nameEn: 'Bio Engineer',
    icon: '🧪',
    tagline: '用工程思维解密生命密码',
    description: '探究研究(I)、设计创造(D)、生命科学(L)三维度均衡发展。具有生物工程的综合素养。',
    wilderPattern: { primary: ['I', 'D', 'L'], developing: ['W', 'E', 'R'] },
    characteristics: ['科学与工程兼备', '善于生物技术应用', '系统设计能力强', '对生命有深刻理解'],
    learningStyle: { name: '生物创客式', description: '在生物工程项目中学习最有效', bestEnvironment: '有生物实验设备的创客实验室' },
    socialPattern: { name: '技术专家型', description: '在生物技术领域有深度专业交流' },
    growthFocus: ['加强户外实践能力', '提升环保行动意识', '培养团队协作能力'],
    careerHints: ['生物工程师', '基因技术研发', '生物医药', '合成生物学', '生物材料研发']
  },
  {
    id: 'WDE-eco-innovator',
    layer: 3,
    category: '三维度均衡型',
    name: '生态创新者',
    nameEn: 'Eco Innovator',
    icon: '💡',
    tagline: '在自然中寻找可持续创新灵感',
    description: '荒野探索(W)、设计创造(D)、环境意识(E)三维度均衡发展。善于在自然中获取创新灵感。',
    wilderPattern: { primary: ['W', 'D', 'E'], developing: ['I', 'L', 'R'] },
    characteristics: ['户外与创新兼备', '善于仿生设计', '环保行动力强', '可持续创新思维'],
    learningStyle: { name: '自然创新式', description: '在自然环境中寻找设计灵感最有效', bestEnvironment: '有设计资源的自然保护区' },
    socialPattern: { name: '绿色创客型', description: '在可持续创新社群中最活跃' },
    growthFocus: ['加强科学理论深度', '提升生态系统理解', '培养团队领导力'],
    careerHints: ['仿生设计师', '可持续创新顾问', '生态建筑师', '绿色产品开发', '户外装备设计']
  },
  {
    id: 'LER-earth-guardian',
    layer: 3,
    category: '三维度均衡型',
    name: '地球守护者',
    nameEn: 'Earth Guardian',
    icon: '🌎',
    tagline: '用生命热情守护地球家园',
    description: '生命科学(L)、环境意识(E)、韧性协作(R)三维度均衡发展。是有行动力的生态守护者。',
    wilderPattern: { primary: ['L', 'E', 'R'], developing: ['W', 'I', 'D'] },
    characteristics: ['生命关怀与行动兼备', '善于组织环保行动', '团队影响力强', '使命感突出'],
    learningStyle: { name: '行动关怀式', description: '在组织生态保护行动中学习最有效', bestEnvironment: '有保护项目的生态社区' },
    socialPattern: { name: '生态领袖型', description: '是生态保护社群的核心组织者' },
    growthFocus: ['加强科学研究能力', '提升动手创造能力', '培养户外探险能力'],
    careerHints: ['保护区负责人', '环保NGO领导人', '可持续社区建设者', '生态公益创业者', '环保教育家']
  },
  {
    id: 'WIR-expedition-scientist',
    layer: 3,
    category: '三维度均衡型',
    name: '科考探险家',
    nameEn: 'Expedition Scientist',
    icon: '🗺️',
    tagline: '带领团队征服未知的科学边疆',
    description: '荒野探索(W)、探究研究(I)、韧性协作(R)三维度均衡发展。能带领团队完成科学探险。',
    wilderPattern: { primary: ['W', 'I', 'R'], developing: ['L', 'D', 'E'] },
    characteristics: ['探险与科研兼备', '团队领导力强', '抗压能力突出', '善于组织科考活动'],
    learningStyle: { name: '科考领队式', description: '在带领团队科学考察中学习最有效', bestEnvironment: '有挑战性的野外科考项目' },
    socialPattern: { name: '探险领袖型', description: '是科学探险团队的天然领导者' },
    growthFocus: ['加强生态系统理解', '提升设计创造能力', '培养环保行动意识'],
    careerHints: ['科考队长', '探险纪录片制作人', '极地研究者', '科学探险家', '户外科普专家']
  },
  {
    id: 'DER-change-maker',
    layer: 3,
    category: '三维度均衡型',
    name: '社会创变者',
    nameEn: 'Change Maker',
    icon: '⚡',
    tagline: '用创新和行动改变世界',
    description: '设计创造(D)、环境意识(E)、韧性协作(R)三维度均衡发展。善于推动社会创新变革。',
    wilderPattern: { primary: ['D', 'E', 'R'], developing: ['W', 'I', 'L'] },
    characteristics: ['创新与行动兼备', '善于组织变革', '抗压能力强', '社会影响力大'],
    learningStyle: { name: '社会创新式', description: '在推动社会创新项目中学习最有效', bestEnvironment: '有社会创新机会的社区' },
    socialPattern: { name: '创变领袖型', description: '是社会创新运动的核心推动者' },
    growthFocus: ['加强科学知识深度', '提升生态系统理解', '培养户外能力'],
    careerHints: ['社会企业家', '创新组织负责人', '公益创业者', '可持续发展顾问', '社会创新设计师']
  }
]

// ==================== Layer 4: 特殊发展型 (3种) ====================

const LAYER4_PROFILES: Profile30[] = [
  {
    id: 'balanced-all',
    layer: 4,
    category: '特殊发展型',
    name: '全面发展者',
    nameEn: 'Balanced Developer',
    icon: '🌈',
    tagline: '六维均衡，潜力无限',
    description: 'WILDER六维度相对均衡发展，没有明显的优势或劣势。这类孩子有很好的发展基础，关键是找到突破口。',
    wilderPattern: { primary: [], secondary: ['W', 'I', 'L', 'D', 'E', 'R'], developing: [] },
    characteristics: ['各方面比较平均', '适应能力强', '可塑性高', '需要找到激发点'],
    learningStyle: { name: '多元体验式', description: '在多样化体验中发现优势方向最有效', bestEnvironment: '多主题多形式的综合学习环境' },
    socialPattern: { name: '适应型', description: '能适应各种社交场景，但尚未找到最佳定位' },
    growthFocus: ['发现并聚焦优势方向', '培养深度专注能力', '建立明确的成长目标'],
    careerHints: ['通才型管理者', '跨学科研究者', '综合型顾问', '全栈教育者', '多领域创业者']
  },
  {
    id: 'contrast-type',
    layer: 4,
    category: '特殊发展型',
    name: '对比发展者',
    nameEn: 'Contrast Developer',
    icon: '⚖️',
    tagline: '优势与挑战并存，成长空间广阔',
    description: '某些维度显著突出，某些维度明显薄弱，形成鲜明对比。这类孩子需要发挥优势同时补强短板。',
    wilderPattern: { primary: [], secondary: [], developing: [] },
    characteristics: ['优势与劣势明显', '特点鲜明', '需要针对性培养', '成长空间大'],
    learningStyle: { name: '扬长补短式', description: '在发挥优势的同时针对性提升短板最有效', bestEnvironment: '有针对性训练机会的定制化环境' },
    socialPattern: { name: '专长贡献型', description: '在能发挥专长的领域最有价值' },
    growthFocus: ['充分发挥优势维度', '科学补强薄弱维度', '建立自信心'],
    careerHints: ['专业领域专家', '特长型人才', '细分领域佼佼者', '专项教练', '定制化服务者']
  },
  {
    id: 'potential-type',
    layer: 4,
    category: '特殊发展型',
    name: '潜力待激活者',
    nameEn: 'Potential Awakener',
    icon: '🌟',
    tagline: '蕴藏无限潜能，等待点燃时刻',
    description: '整体得分偏低但有上升趋势，或某些维度显示出潜在优势。这类孩子需要更多鼓励和机会来激发潜能。',
    wilderPattern: { primary: [], secondary: [], developing: ['W', 'I', 'L', 'D', 'E', 'R'] },
    characteristics: ['潜力尚未释放', '需要更多体验', '自信心待建立', '有成长空间'],
    learningStyle: { name: '鼓励启发式', description: '在充满鼓励和成功体验的环境中学习最有效', bestEnvironment: '低压力高支持的成长环境' },
    socialPattern: { name: '渐进融入型', description: '需要时间建立信任，逐步融入团队' },
    growthFocus: ['建立自信心', '创造成功体验', '发现隐藏优势'],
    careerHints: ['需要时间发现适合的方向', '有大器晚成可能', '适合多元探索', '宜保持开放心态']
  }
]

// ==================== 合并所有画像 ====================

export const ALL_30_PROFILES: Profile30[] = [
  ...LAYER1_PROFILES,
  ...LAYER2_PROFILES,
  ...LAYER3_PROFILES,
  ...LAYER4_PROFILES,
]

export const PROFILES_BY_ID: Record<string, Profile30> = Object.fromEntries(
  ALL_30_PROFILES.map(p => [p.id, p])
)

// ==================== 画像识别算法 ====================

interface WilderScores {
  W: number
  I: number
  L: number
  D: number
  E: number
  R: number
}

/**
 * 基于WILDER分数识别30种画像
 * 算法逻辑：
 * 1. 计算各维度标准化分数
 * 2. 识别显著突出维度（>均值+1SD）
 * 3. 识别显著薄弱维度（<均值-1SD）
 * 4. 根据突出维度数量匹配Layer
 * 5. 在Layer内精确匹配具体画像
 */
export function identifyProfile30(scores: WilderScores): {
  profileId: string
  confidence: number
  matchReason: string
  alternativeProfiles: string[]
} {
  const values = Object.values(scores)
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const sd = Math.sqrt(values.map(v => Math.pow(v - mean, 2)).reduce((a, b) => a + b, 0) / values.length)
  
  // 识别突出和薄弱维度
  const highThreshold = mean + sd * 0.7
  const lowThreshold = mean - sd * 0.7
  
  const highDims = Object.entries(scores)
    .filter(([_, v]) => v >= highThreshold)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k)
  
  const lowDims = Object.entries(scores)
    .filter(([_, v]) => v <= lowThreshold)
    .map(([k]) => k)
  
  const sortedDims = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k)
  
  // 计算均衡度
  const range = Math.max(...values) - Math.min(...values)
  const isBalanced = range < 15
  
  let profileId: string
  let confidence: number
  let matchReason: string
  let alternativeProfiles: string[] = []
  
  // Layer 4 特殊类型判断
  if (isBalanced) {
    profileId = 'balanced-all'
    confidence = 85
    matchReason = '六维度相对均衡，差距小于15分'
    alternativeProfiles = ['potential-type']
  } else if (highDims.length >= 2 && lowDims.length >= 2 && (Math.max(...values) - Math.min(...values) > 40)) {
    profileId = 'contrast-type'
    confidence = 80
    matchReason = `优势(${highDims.join(',')})与劣势(${lowDims.join(',')})对比明显`
    alternativeProfiles = [LAYER1_PROFILES.find(p => p.wilderPattern.primary.includes(highDims[0]))?.id || 'balanced-all']
  } else if (mean < 40 && range < 25) {
    profileId = 'potential-type'
    confidence = 75
    matchReason = '整体分数偏低，潜力待激活'
    alternativeProfiles = ['balanced-all']
  }
  // Layer 1 单维度突出
  else if (highDims.length === 1 && (scores[highDims[0] as keyof WilderScores] - mean > sd * 1.2)) {
    const dim = highDims[0]
    profileId = `${dim}-dominant`
    confidence = 90
    matchReason = `${WILDER_DIMENSIONS[dim as keyof typeof WILDER_DIMENSIONS].name}维度显著突出`
    alternativeProfiles = [`${sortedDims[0]}${sortedDims[1]}-*`.replace('-*', '')]
  }
  // Layer 3 三维度均衡
  else if (highDims.length >= 3) {
    const top3 = sortedDims.slice(0, 3).sort().join('')
    const layer3Match = LAYER3_PROFILES.find(p => 
      p.wilderPattern.primary.sort().join('') === top3
    )
    if (layer3Match) {
      profileId = layer3Match.id
      confidence = 85
      matchReason = `${top3}三维度均衡发展`
    } else {
      // 找最接近的Layer 3画像
      profileId = LAYER3_PROFILES[0].id
      confidence = 70
      matchReason = '三维度均衡发展（近似匹配）'
    }
    alternativeProfiles = LAYER3_PROFILES.filter(p => p.id !== profileId).slice(0, 2).map(p => p.id)
  }
  // Layer 2 双维度组合
  else {
    const top2 = sortedDims.slice(0, 2)
    // 查找匹配的双维度画像
    const layer2Match = LAYER2_PROFILES.find(p => 
      p.wilderPattern.primary.includes(top2[0]) && p.wilderPattern.primary.includes(top2[1])
    )
    if (layer2Match) {
      profileId = layer2Match.id
      confidence = 88
      matchReason = `${top2.join('+')}双维度组合主导`
    } else {
      // 兜底到单维度
      profileId = `${top2[0]}-dominant`
      confidence = 75
      matchReason = `${top2[0]}维度主导（单维度兜底）`
    }
    alternativeProfiles = LAYER2_PROFILES
      .filter(p => p.wilderPattern.primary.some(d => top2.includes(d)) && p.id !== profileId)
      .slice(0, 2)
      .map(p => p.id)
  }
  
  return { profileId, confidence, matchReason, alternativeProfiles }
}

// ==================== 导出类型 ====================

export type { WilderScores }
