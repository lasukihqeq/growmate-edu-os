// ===================================================================
// 潜能60分型系统 v1.0
// 基于 WILDER 六维 + 多模态数据（MI/BigFive/Grit/SEL）的精细化分类
// 架构: 30种基础分型 × 2种多模态子方向 = 60种潜能类型
// ===================================================================

import { matchTalentType30, type TalentType30 } from './talentTypes30'
import type { AssessmentScores } from './assessmentEngine'

// ========== 类型定义 ==========

export type SubDirection = 'alpha' | 'beta'

export interface TalentType60 {
  /** 唯一标识 e.g. 'S-W-α', 'D-WI-β' */
  key: string
  /** 关联的30分型 key */
  parentKey: string
  /** 子方向 */
  direction: SubDirection
  /** 中文名（潜能命名） */
  name: string
  /** 英文名 */
  nameEn: string
  /** 图标 */
  icon: string
  /** 一句话定位（家长感知优化） */
  tagline: string
  /** 详细描述（300字内，家长视角） */
  desc: string
  /** 核心特质标签（3-4个） */
  traits: string[]
  /** 多模态判定依据描述 */
  multiModalBasis: string
  /** 家长最关心的洞察（直击痛点） */
  parentInsight: string
  /** 推荐培养方向 */
  growthDirection: string
  /** 适配职业方向（5-6个） */
  careers: string[]
  /** 报告诗意描述 */
  poetryLine: string
}

// ========== 多模态特征提取 ==========

export interface MultiModalFeatures {
  /** 多元智能优势方向: 'analytical'=逻辑/自然 | 'expressive'=语言/音乐/人际 */
  miDirection: 'analytical' | 'expressive'
  /** 大五人格倾向: 'explorer'=高开放+低尽责 | 'executor'=高尽责+高宜人 */
  bfDirection: 'explorer' | 'executor'
  /** 坚毅力特征: 'passionate'=兴趣驱动 | 'persistent'=毅力驱动 */
  gritDirection: 'passionate' | 'persistent'
  /** SEL 社会情感: 'self-oriented'=自我认知强 | 'social-oriented'=社会认知强 */
  selDirection: 'self-oriented' | 'social-oriented'
  /** 综合子方向判定 */
  overallDirection: SubDirection
}

/** 从评分数据中提取多模态特征 */
function extractMultiModalFeatures(scores: AssessmentScores): MultiModalFeatures {
  const mi = scores.multipleIntelligences
  const bf = scores.bigFive
  const grit = scores.grit
  const sel = scores.sel

  // MI方向: 逻辑+空间+自然 vs 语言+音乐+人际+身体
  const analyticalMI = (mi.logicalMath || 0) + (mi.spatial || 0) + (mi.naturalist || 0) + (mi.intrapersonal || 0)
  const expressiveMI = (mi.linguistic || 0) + (mi.musical || 0) + (mi.interpersonal || 0) + (mi.bodilyKinesthetic || 0)
  const miDirection: 'analytical' | 'expressive' = analyticalMI >= expressiveMI ? 'analytical' : 'expressive'

  // BigFive方向: 高O低C=探索型 vs 高C高A=执行型
  const explorerScore = (bf.O || 0) + Math.max(0, 3 - (bf.C || 0))
  const executorScore = (bf.C || 0) + (bf.A || 0)
  const bfDirection: 'explorer' | 'executor' = explorerScore >= executorScore ? 'explorer' : 'executor'

  // Grit方向
  const gritDirection: 'passionate' | 'persistent' =
    (grit.passion || 0) >= (grit.perseverance || 0) ? 'passionate' : 'persistent'

  // SEL方向
  const selfSEL = (sel.selfAwareness || 0) + (sel.selfManagement || 0)
  const socialSEL = (sel.socialAwareness || 0) + (sel.relationshipSkills || 0) + (sel.responsibleDecision || 0)
  const selDirection: 'self-oriented' | 'social-oriented' = selfSEL >= socialSEL ? 'self-oriented' : 'social-oriented'

  // 综合判定: 投票机制（analytical/explorer/passionate/self → α, 反之 → β）
  let alphaVotes = 0
  if (miDirection === 'analytical') alphaVotes++
  if (bfDirection === 'explorer') alphaVotes++
  if (gritDirection === 'passionate') alphaVotes++
  if (selDirection === 'self-oriented') alphaVotes++

  const overallDirection: SubDirection = alphaVotes >= 2 ? 'alpha' : 'beta'

  return { miDirection, bfDirection, gritDirection, selDirection, overallDirection }
}

// ========== 60种潜能类型定义 ==========

export const TALENT_TYPES_60: Record<string, TalentType60> = {
  // ==================== 单峰型 × 2 = 12种 ====================

  // S-W 好奇先锋 → 2种子类型
  'S-W-α': {
    key: 'S-W-α', parentKey: 'S-W', direction: 'alpha',
    name: '万物探秘者', nameEn: 'Universal Questioner', icon: '🔭',
    tagline: '对自然规律和科学奥秘有天然的痴迷',
    desc: '这个孩子的好奇心指向"事物如何运作"——为什么天空是蓝色的、树叶为什么变黄、电脑如何思考。TA的问题往往直指事物本质，具有未来科学家的思维特质。当其他孩子满足于"知道了"，TA总要追问"为什么是这样"。',
    traits: ['自然探索', '逻辑追问', '深度好奇', '独立思考'],
    multiModalBasis: '逻辑数学智能+自然智能偏高，开放性强，兴趣驱动型',
    parentInsight: '他的每个"为什么"都不是在抬杠，而是一颗科学家大脑在自然运转',
    growthDirection: '提供丰富的科学实验和自然观察机会，允许他在感兴趣的问题上深入钻研',
    careers: ['科学研究者', '自然博物学家', '发明家', '科技记者', '博物馆策展人', '天文学爱好者'],
    poetryLine: '以万千追问叩开自然的密码，每一个"为什么"都是通往真理的钥匙。',
  },
  'S-W-β': {
    key: 'S-W-β', parentKey: 'S-W', direction: 'beta',
    name: '灵感捕捉师', nameEn: 'Inspiration Catcher', icon: '✨',
    tagline: '对人文世界和创意灵感有超强雷达',
    desc: '这个孩子的好奇心指向"人与故事"——为什么有人开心有人难过、故事里的角色为什么做出那个选择、世界上不同的人怎么生活。TA的好奇心带有温度，善于从日常中发现令人惊叹的细节。',
    traits: ['人文关怀', '细节敏感', '创意联想', '故事思维'],
    multiModalBasis: '语言智能+人际智能偏高，宜人性强，社会认知导向',
    parentInsight: '他不是"爱管闲事"，是天生对人和故事有敏锐的感知力',
    growthDirection: '多接触文学、戏剧、人文纪录片，鼓励他用写作或绘画记录观察',
    careers: ['作家', '纪录片创作者', '文化研究者', '品牌策划', '播客主理人', '社会观察家'],
    poetryLine: '以细腻之眼捕捉世界的微光，在故事与细节间编织独特的灵感图谱。',
  },

  // S-I 求真卫士 → 2种子类型
  'S-I-α': {
    key: 'S-I-α', parentKey: 'S-I', direction: 'alpha',
    name: '逻辑验证官', nameEn: 'Logic Verifier', icon: '🔬',
    tagline: '用数据和推理构建真相的拼图',
    desc: '这个孩子的求证方式偏向"数据型"——喜欢用数字、实验和逻辑链来验证猜想。做事非常严谨，对模糊和不确定的答案有天然的不安感。TA的桌上可能永远有一张正在填的表格或一个正在跑的实验。',
    traits: ['数据驱动', '逻辑严密', '实验精神', '精确控制'],
    multiModalBasis: '逻辑数学智能突出，尽责性高，毅力驱动型',
    parentInsight: '他的"较真"不是固执，是未来数据科学家的严谨本能在萌芽',
    growthDirection: '提供编程、数学建模、科学实验等结构化探究机会',
    careers: ['数据科学家', '实验物理学家', '审计师', '检测工程师', '临床研究者', '算法工程师'],
    poetryLine: '以数据为砖、逻辑为瓦，砌筑通往真相的精密之塔。',
  },
  'S-I-β': {
    key: 'S-I-β', parentKey: 'S-I', direction: 'beta',
    name: '真相追踪者', nameEn: 'Truth Tracker', icon: '🕵️',
    tagline: '像侦探一样追踪事实的蛛丝马迹',
    desc: '这个孩子的求证方式偏向"调查型"——善于通过观察、采访、收集线索来还原真相。不喜欢盲目相信，但求证方式更灵活多元，既能逻辑推理也能直觉判断。',
    traits: ['调查思维', '线索敏感', '多源验证', '独立判断'],
    multiModalBasis: '语言智能+内省智能偏高，开放性强，兴趣驱动型',
    parentInsight: '他不是"不信任大人"，是天生有独立判断和求证的需求',
    growthDirection: '鼓励参与辩论、调查性写作、科学小报等需要多角度求证的活动',
    careers: ['调查记者', '法医专家', '策略分析师', '独立研究员', '知识产权律师', '事实核查员'],
    poetryLine: '循着事实的蛛丝马迹，用独立判断还原世界的本来面目。',
  },

  // S-L 纽带核心 → 2种子类型
  'S-L-α': {
    key: 'S-L-α', parentKey: 'S-L', direction: 'alpha',
    name: '共情守护者', nameEn: 'Empathy Guardian', icon: '💝',
    tagline: '能感受到别人说不出口的情绪',
    desc: '这个孩子的联结力偏向"共情型"——对他人的情绪变化极其敏感，总能第一个发现谁不开心、谁需要帮助。TA在团队中是"情绪温度计"，让每个人都感觉被理解和接纳。',
    traits: ['高度共情', '情绪感知', '默默守护', '包容接纳'],
    multiModalBasis: '人际智能+内省智能偏高，自我认知导向，宜人性强',
    parentInsight: '他的"太敏感"其实是最珍贵的潜能——理解他人是领导力的根基',
    growthDirection: '帮助TA建立情绪边界，在共情的同时保护自己不被情绪淹没',
    careers: ['心理咨询师', '社工', '儿童治疗师', '生命教练', '医护关怀师', '疗愈空间设计师'],
    poetryLine: '以柔软的心感知每一缕情绪的涟漪，在无声处给予最温暖的守护。',
  },
  'S-L-β': {
    key: 'S-L-β', parentKey: 'S-L', direction: 'beta',
    name: '社群凝聚者', nameEn: 'Community Builder', icon: '🌐',
    tagline: '天生的社群架构师，把散沙凝成团队',
    desc: '这个孩子的联结力偏向"组织型"——不只善于感知他人，更善于主动创造连接、搭建关系网。TA是同学中的"社交枢纽"，能让不同性格的人都玩到一起。',
    traits: ['社交组织', '资源整合', '关系搭建', '跨圈连接'],
    multiModalBasis: '人际智能+语言智能偏高，社会认知导向，外向性强',
    parentInsight: '他的"交友广泛"不是浮于表面，是天然的社群架构能力',
    growthDirection: '鼓励TA组织活动、带领项目，将社交能力转化为领导力',
    careers: ['社区运营官', '活动策划', '公关经理', '国际NGO负责人', '招生顾问', '社群创业者'],
    poetryLine: '以连接为潜能，将一个个独立的星辰编织成璀璨的社群星座。',
  },

  // S-D 蓝图大师 → 2种子类型
  'S-D-α': {
    key: 'S-D-α', parentKey: 'S-D', direction: 'alpha',
    name: '系统构建师', nameEn: 'System Builder', icon: '⚙️',
    tagline: '在TA脑中，一切都能被拆解和重组',
    desc: '这个孩子的设计力偏向"系统型"——擅长把复杂问题拆解为步骤，构建流程和规则。TA搭积木不是随意堆叠，而是先想结构、再搭基座、最后封顶。天生的工程师思维。',
    traits: ['系统思维', '流程优化', '结构化', '追求效率'],
    multiModalBasis: '逻辑数学+空间智能偏高，尽责性强，毅力驱动型',
    parentInsight: '他的"规矩多"不是刻板，是天生的系统架构师在练习构建秩序',
    growthDirection: '提供编程、机器人、工程搭建等结构化创造机会',
    careers: ['软件架构师', '工业设计师', '城市规划师', '系统工程师', '项目经理', '产品经理'],
    poetryLine: '将混沌拆解为秩序，用系统之美构建这个时代的基础设施。',
  },
  'S-D-β': {
    key: 'S-D-β', parentKey: 'S-D', direction: 'beta',
    name: '创意造物者', nameEn: 'Creative Maker', icon: '🎨',
    tagline: '脑中的奇思妙想总能变成手中的作品',
    desc: '这个孩子的设计力偏向"创造型"——擅长将灵感快速转化为实物或方案。不拘泥于现有框架，喜欢用新材料、新方法做出从没见过的东西。是天生的创客（Maker）。',
    traits: ['创意实现', '快速原型', '跨界融合', '敢于试错'],
    multiModalBasis: '空间智能+身体动觉偏高，开放性强，兴趣驱动型',
    parentInsight: '他"捣鼓东西"不是在浪费时间，每一次动手都是创造力在生长',
    growthDirection: '提供手工、3D打印、设计思维等动手创造的空间和工具',
    careers: ['产品设计师', '建筑师', '游戏设计师', '创客空间主理人', '工艺美术家', '发明家'],
    poetryLine: '双手是梦想的翻译官，让每一个奇思妙想都有触手可及的形状。',
  },

  // S-E 舞台之星 → 2种子类型
  'S-E-α': {
    key: 'S-E-α', parentKey: 'S-E', direction: 'alpha',
    name: '思想表达家', nameEn: 'Thought Communicator', icon: '🎙️',
    tagline: '能把最深刻的道理讲成最生动的故事',
    desc: '这个孩子的表达力偏向"内容型"——不只是会说，更在意说什么。TA的表达有深度和结构，善于将复杂的想法用清晰的语言传递出去。未来可能成为思想传播者或教育者。',
    traits: ['深度输出', '结构表达', '思想传播', '说服力强'],
    multiModalBasis: '语言智能+内省智能偏高，自我认知导向，开放性强',
    parentInsight: '他表达的不只是"会说话"，而是"有东西可说"——这才是真正的表达力',
    growthDirection: '鼓励写作、演讲、辩论等需要深度思考支撑的表达活动',
    careers: ['大学教授', 'TED演讲者', '科普作家', '知识付费讲师', '政策倡导者', '教育创新者'],
    poetryLine: '以思想为墨、逻辑为笔，将深刻的道理化为触动人心的声音。',
  },
  'S-E-β': {
    key: 'S-E-β', parentKey: 'S-E', direction: 'beta',
    name: '魅力感染者', nameEn: 'Charisma Radiator', icon: '🌟',
    tagline: '站在人群中自带聚光灯效果',
    desc: '这个孩子的表达力偏向"感染型"——有天然的舞台魅力和表演潜能，能通过声音、表情、肢体语言打动和感染他人。TA在台上比台下更自信、更耀眼。',
    traits: ['舞台魅力', '感染力', '表演潜能', '即兴应变'],
    multiModalBasis: '音乐智能+身体动觉+人际智能偏高，外向性强，社会认知导向',
    parentInsight: '他的"爱表演"不是虚荣心，是表达潜能的自然呈现',
    growthDirection: '提供戏剧、主持、短视频创作等舞台表现机会',
    careers: ['主持人', '演员', '脱口秀演员', '品牌代言人', '视频创作者', '活动主持'],
    poetryLine: '天生自带聚光灯，在舞台上绽放最真实的魅力与光芒。',
  },

  // S-R 洞察先知 → 2种子类型
  'S-R-α': {
    key: 'S-R-α', parentKey: 'S-R', direction: 'alpha',
    name: '认知进化者', nameEn: 'Cognitive Evolver', icon: '🧠',
    tagline: '永远在优化自己的思维系统',
    desc: '这个孩子的反思力偏向"认知型"——善于复盘自己的思考过程，不断优化学习方法和问题解决策略。别人犯两次错的事情，TA通常一次就能总结规律。是"学习如何学习"的高手。',
    traits: ['元认知', '策略优化', '自我迭代', '方法论'],
    multiModalBasis: '内省智能+逻辑智能偏高，自我认知导向，尽责性强',
    parentInsight: '他看起来"磨磨蹭蹭"可能是在复盘总结——这种自我优化能力比刷题更有价值',
    growthDirection: '鼓励写学习日记、做思维导图，将内在的反思过程外化可见',
    careers: ['学习科学研究者', '认知科学家', '战略咨询顾问', '教育方法论专家', '效率教练', '思维训练师'],
    poetryLine: '在反思的镜面中不断校准认知的罗盘，让每一次思考都成为进化。',
  },
  'S-R-β': {
    key: 'S-R-β', parentKey: 'S-R', direction: 'beta',
    name: '心灵观照者', nameEn: 'Inner Observer', icon: '🪷',
    tagline: '对自己和他人的内心世界有超乎年龄的洞察',
    desc: '这个孩子的反思力偏向"情感型"——善于觉察自己和他人的情绪变化、内心需求，有超越年龄的自我理解力。TA可能很小就会说出"我觉得我今天的情绪不太好"这样的话。',
    traits: ['情绪觉察', '自我理解', '内在和谐', '同理反思'],
    multiModalBasis: '内省智能+人际智能偏高，社会认知导向，宜人性强',
    parentInsight: '他的"安静"和"想太多"其实是珍贵的内在觉察力——未来心理学家的种子',
    growthDirection: '提供正念、日记、艺术表达等内在探索渠道，同时鼓励将感悟分享出来',
    careers: ['心理治疗师', '正念导师', '哲学教授', '生命教育家', '纪录片导演', '灵性作家'],
    poetryLine: '静水流深处，以觉察之光照见内心最幽微的风景。',
  },

  // ==================== 双峰型 × 2 = 30种 ====================

  // D-WI 灵动探索者 → 2种子类型
  'D-WI-α': {
    key: 'D-WI-α', parentKey: 'D-WI', direction: 'alpha',
    name: '理论探索家', nameEn: 'Theory Explorer', icon: '🧪',
    tagline: '先提出假设，再用实验验证——天生的科学家',
    desc: '好奇心+探究力的组合，偏向理论和逻辑方向。善于从观察中抽象出规律，再用严谨方法验证。是科学方法论的天然实践者。',
    traits: ['理论建模', '假设验证', '逻辑推演', '抽象思维'],
    multiModalBasis: '逻辑数学+自然智能偏高，毅力驱动',
    parentInsight: '他对"规律"和"原理"有天然的痴迷，这是最珍贵的科学家种子',
    growthDirection: '数学建模、科学实验、编程等结构化探究',
    careers: ['理论物理学家', '数学研究者', '生物学家', '人工智能研究员', '天文学家', '基因科学家'],
    poetryLine: '以假设为帆、实验为桨，驶向未知理论的星辰大海。',
  },
  'D-WI-β': {
    key: 'D-WI-β', parentKey: 'D-WI', direction: 'beta',
    name: '田野发现家', nameEn: 'Field Discoverer', icon: '🦋',
    tagline: '在真实世界中寻找惊奇——天生的博物学家',
    desc: '好奇心+探究力的组合，偏向实践和观察方向。善于在真实环境中敏锐地发现异常现象，并通过动手实验来验证。是达尔文式的博物学家。',
    traits: ['田野观察', '实践验证', '现象敏感', '动手实验'],
    multiModalBasis: '自然智能+语言智能偏高，兴趣驱动，社会认知导向',
    parentInsight: '他在大自然里比在教室里更专注——这正是他独特的探究方式',
    growthDirection: '户外科考、自然日志、标本制作、观鸟等实地探索',
    careers: ['生态学家', '地质勘探家', '考古学者', '自然摄影师', '环保科学家', '农业研究员'],
    poetryLine: '脚踏泥土仰望星空，在田野与山川中发现世界的惊奇密码。',
  },

  // D-WL 社交发现家 → 2种子类型
  'D-WL-α': {
    key: 'D-WL-α', parentKey: 'D-WL', direction: 'alpha',
    name: '知识策展人', nameEn: 'Knowledge Curator', icon: '📚',
    tagline: '善于发现好内容并分享给对的人',
    desc: '好奇心+联结力的组合，偏向内容策展方向。善于在海量信息中发现有价值的知识，并精准匹配给需要的人。是信息时代的"知识筛选器"。',
    traits: ['信息筛选', '精准匹配', '内容品味', '知识分享'],
    multiModalBasis: '内省+自然智能偏高，自我认知导向',
    parentInsight: '他推荐的书、视频总是特别对味——这种"信息品味"是稀缺能力',
    growthDirection: '读书会、知识分享社群、信息可视化项目',
    careers: ['图书馆策展人', '知识管理师', '内容运营', '教育科技产品经理', '学术编辑', '知识付费策划'],
    poetryLine: '以好奇心为雷达、以联结力为桥梁，为每一颗求知的心找到最对的答案。',
  },
  'D-WL-β': {
    key: 'D-WL-β', parentKey: 'D-WL', direction: 'beta',
    name: '探索领航员', nameEn: 'Exploration Navigator', icon: '🧭',
    tagline: '带领伙伴们一起出发探索未知',
    desc: '好奇心+联结力的组合，偏向团队引领方向。不仅自己好奇，更擅长将好奇心"传染"给身边人，能组织和带领一群人一起探索。',
    traits: ['团队引领', '好奇传染', '社群组织', '共同探索'],
    multiModalBasis: '人际+语言智能偏高，社会认知导向，外向性强',
    parentInsight: '他的好奇心自带"社交属性"——不只自己探索，还能带动一群人',
    growthDirection: '项目式学习、科考营、社群发起等团队探索活动',
    careers: ['科考队领队', '研学旅行设计师', '社群创始人', '教育创新者', '公益项目发起人', 'TEDx组织者'],
    poetryLine: '点燃自己的好奇之火，再引燃整个团队的探索之焰。',
  },

  // D-WD 创意建筑师 → 2种子类型
  'D-WD-α': {
    key: 'D-WD-α', parentKey: 'D-WD', direction: 'alpha',
    name: '技术创新家', nameEn: 'Tech Innovator', icon: '💡',
    tagline: '在技术领域，问题就是他最好的燃料',
    desc: '好奇心+设计力的组合，偏向技术创新。善于从技术难题中发现机会，用工程思维设计解决方案。是从"问题"到"产品"的快速转化者。',
    traits: ['技术驱动', '问题导向', '工程思维', '创新解决'],
    multiModalBasis: '逻辑数学+空间智能偏高，毅力驱动，尽责性强',
    parentInsight: '他拆东西不是为了破坏，是为了理解然后做出更好的',
    growthDirection: '机器人编程、电子制作、科技发明比赛',
    careers: ['硬件工程师', '科技创业者', 'CTO', '专利发明家', '智能硬件设计师', '机器人工程师'],
    poetryLine: '以技术为画笔，以问题为画布，绘制改变世界的创新蓝图。',
  },
  'D-WD-β': {
    key: 'D-WD-β', parentKey: 'D-WD', direction: 'beta',
    name: '体验设计师', nameEn: 'Experience Designer', icon: '🎭',
    tagline: '好奇心激发灵感，设计力创造惊喜',
    desc: '好奇心+设计力的组合，偏向体验和美学方向。善于从生活观察中获取灵感，设计出让人"哇"的体验和产品。关注人的感受多于技术参数。',
    traits: ['美学敏感', '体验导向', '用户思维', '感性设计'],
    multiModalBasis: '空间+音乐+人际智能偏高，开放性强',
    parentInsight: '他对"好看""好用"有超越年龄的品味——这是设计潜能的核心',
    growthDirection: '美术、手工设计、UI/UX体验、空间布置等美学创造',
    careers: ['UX设计师', '空间设计师', '品牌设计师', '主题乐园策划', '展览设计师', '创意导演'],
    poetryLine: '从好奇中汲取灵感，用设计为世界增添一份惊喜与美好。',
  },

  // D-WE 故事探险家 → 2种子类型
  'D-WE-α': {
    key: 'D-WE-α', parentKey: 'D-WE', direction: 'alpha',
    name: '深度叙事者', nameEn: 'Deep Narrator', icon: '📝',
    tagline: '用文字和影像讲述触动人心的真实故事',
    desc: '好奇心+表达力组合，偏向深度内容创作。善于深入挖掘一个话题，用扎实的调查和生动的叙事呈现出来。内容有分量、有温度。',
    traits: ['深度调查', '叙事功力', '内容品质', '真实记录'],
    multiModalBasis: '语言+内省智能偏高，自我认知导向，兴趣驱动',
    parentInsight: '他写的东西和说的话总有一种"份量感"——这是内容创作者的核心潜能',
    growthDirection: '非虚构写作、纪录片制作、深度采访等严肃创作',
    careers: ['非虚构作家', '纪录片导演', '深度记者', '播客制作人', '口述历史记录者', '文化评论家'],
    poetryLine: '以好奇为线索、以叙事为画卷，将世界的真实编织成动人的篇章。',
  },
  'D-WE-β': {
    key: 'D-WE-β', parentKey: 'D-WE', direction: 'beta',
    name: '创意传播者', nameEn: 'Creative Broadcaster', icon: '📡',
    tagline: '把新鲜的发现用最有趣的方式传递出去',
    desc: '好奇心+表达力组合，偏向传播与互动。善于将新奇发现快速转化为有趣的内容，在社交平台上引发共鸣。是"信息时代的原住民"。',
    traits: ['快速创作', '社交传播', '趣味转化', '互动力强'],
    multiModalBasis: '语言+人际+音乐智能偏高，社会认知导向',
    parentInsight: '他"玩手机"可能不是浪费时间，而是在练习内容创作的核心技能',
    growthDirection: '短视频创作、自媒体运营、校园广播等内容传播实践',
    careers: ['短视频创作者', '科普博主', '品牌内容官', '社交媒体运营', '知识IP运营', '内容营销师'],
    poetryLine: '让每一个发现都长出翅膀，飞向每一颗等待被点亮的好奇之心。',
  },

  // D-WR 深度思考者 → 2种子类型
  'D-WR-α': {
    key: 'D-WR-α', parentKey: 'D-WR', direction: 'alpha',
    name: '哲学沉思者', nameEn: 'Philosophical Ponderer', icon: '🏔️',
    tagline: '在追问中不断逼近世界的"终极问题"',
    desc: '好奇心+反思力组合，偏向哲学与本质探索。对"为什么存在""什么是公平""意识是什么"等根本问题有天然的兴趣和超越年龄的思考深度。',
    traits: ['本质追问', '哲学思辨', '认知深度', '独立思想'],
    multiModalBasis: '内省+逻辑智能偏高，自我认知导向，开放性极强',
    parentInsight: '他问的问题有时让大人都答不上来——这不是怪，是思想早熟',
    growthDirection: '哲学阅读、思辨讨论、创意写作等深度思考场景',
    careers: ['哲学研究者', '科学哲学家', '伦理学教授', '独立撰稿人', '思想类播客', '战略智库研究员'],
    poetryLine: '在追问与沉思的交汇处，触碰宇宙最深处的终极真理。',
  },
  'D-WR-β': {
    key: 'D-WR-β', parentKey: 'D-WR', direction: 'beta',
    name: '内省成长者', nameEn: 'Reflective Grower', icon: '🌿',
    tagline: '每一次经历都能从中提炼出成长的养分',
    desc: '好奇心+反思力组合，偏向自我成长与体验提炼。善于从日常经历中发现意义，通过持续反思不断成长。是"自我教练"型人格。',
    traits: ['经验提炼', '成长导向', '自我觉察', '意义赋予'],
    multiModalBasis: '内省+人际智能偏高，社会认知导向，宜人性强',
    parentInsight: '他特别善于"从错误中学习"——这种自我迭代能力比任何成绩都更有价值',
    growthDirection: '日记写作、成长复盘、正念练习、体验式学习',
    careers: ['人生教练', '教育者', '成长类作家', '领导力培训师', '正念导师', '用户研究员'],
    poetryLine: '每一段经历都是一颗种子，在反思的土壤中生长为智慧的大树。',
  },

  // D-IL 团队研究员 → 2种子类型
  'D-IL-α': {
    key: 'D-IL-α', parentKey: 'D-IL', direction: 'alpha',
    name: '学术协作者', nameEn: 'Academic Collaborator', icon: '🏛️',
    tagline: '用科学方法推动团队攻克学术难题',
    desc: '探究力+联结力组合，偏向学术研究方向。善于在团队中承担"大脑"角色，用数据和逻辑推动集体决策。',
    traits: ['学术协作', '数据决策', '团队大脑', '研究领导'],
    multiModalBasis: '逻辑+内省智能偏高，自我认知导向，毅力驱动',
    parentInsight: '他在小组讨论中总能提出关键问题——这是天然的研究领导力',
    growthDirection: '科学项目式学习、研究性课题、数学竞赛团队',
    careers: ['科研项目负责人', '实验室主管', '技术团队Lead', '学术期刊编辑', '研究基金评审', '数据分析师'],
    poetryLine: '以严谨之心引领团队，在协作中攻克一道道学术高峰。',
  },
  'D-IL-β': {
    key: 'D-IL-β', parentKey: 'D-IL', direction: 'beta',
    name: '实践调研者', nameEn: 'Field Investigator', icon: '📋',
    tagline: '走到一线去调查，带回团队最需要的答案',
    desc: '探究力+联结力组合，偏向社会调研方向。善于通过人际沟通获取一手信息，将调查结果系统化地呈现。',
    traits: ['社会调研', '一线访谈', '信息整合', '实地求证'],
    multiModalBasis: '人际+语言智能偏高，社会认知导向',
    parentInsight: '他喜欢"问东问西"不是八卦，是天生的调查员在收集信息',
    growthDirection: '社会调查、采访、数据收集和分析实践',
    careers: ['市场调研分析师', '社会学者', '用户研究员', '政策研究员', '调查记者', '产品用研负责人'],
    poetryLine: '带着问题走进人群，用调查和倾听为团队找到最真实的答案。',
  },

  // D-ID 系统分析师 → 2种子类型
  'D-ID-α': {
    key: 'D-ID-α', parentKey: 'D-ID', direction: 'alpha',
    name: '算法架构师', nameEn: 'Algorithm Architect', icon: '🔢',
    tagline: '用算法和模型解构世界的复杂性',
    desc: '探究力+设计力组合，偏向算法和数理建模。善于将复杂问题抽象为数学模型，用算法求解。是数字时代最具价值的思维方式。',
    traits: ['数理建模', '算法思维', '抽象能力', '精密设计'],
    multiModalBasis: '逻辑数学+空间智能偏高，毅力驱动，尽责性强',
    parentInsight: '他对数字和规律的敏感度远超同龄人——这是算法时代最核心的潜能',
    growthDirection: '数学竞赛、编程算法、科学建模',
    careers: ['算法工程师', '量化分析师', '人工智能研究员', '精算师', '数据科学家', '密码学家'],
    poetryLine: '以算法为利刃，切开复杂问题的层层迷雾，精准抵达答案。',
  },
  'D-ID-β': {
    key: 'D-ID-β', parentKey: 'D-ID', direction: 'beta',
    name: '产品工程师', nameEn: 'Product Engineer', icon: '🛠️',
    tagline: '从需求到方案再到落地，全链条通关',
    desc: '探究力+设计力组合，偏向产品化和落地实现。善于将调研洞察转化为可执行方案，注重"做出来"而不只"想清楚"。',
    traits: ['产品化', '全链路', '落地执行', '需求转化'],
    multiModalBasis: '空间+人际智能偏高，社会认知导向',
    parentInsight: '他总能把"想法"变成"东西"——这种从0到1的能力极其珍贵',
    growthDirection: '创客项目、产品设计、科技创新实践',
    careers: ['产品经理', '全栈工程师', '工业设计师', '技术产品负责人', '专利工程师', '科技创业者'],
    poetryLine: '从洞察到蓝图，从蓝图到实物。让每一个好点子都有落地的归宿。',
  },

  // D-IE 科学演说家 → 2种子类型
  'D-IE-α': {
    key: 'D-IE-α', parentKey: 'D-IE', direction: 'alpha',
    name: '学术传译者', nameEn: 'Academic Translator', icon: '🎓',
    tagline: '把最前沿的研究变成人人能懂的知识',
    desc: '探究力+表达力组合，偏向学术传播。善于将复杂的专业知识"翻译"成通俗易懂的语言，是知识从象牙塔到大众的桥梁。',
    traits: ['学术翻译', '深入浅出', '知识传播', '科学沟通'],
    multiModalBasis: '语言+逻辑智能偏高，自我认知导向',
    parentInsight: '他天生能把"难懂"变成"有趣"——这是最珍贵的知识传播潜能',
    growthDirection: '科普写作、学术演讲、知识可视化',
    careers: ['科学传播人', '大学教授', '科普作家', '教育科技产品经理', '学术出版编辑', '知识付费讲师'],
    poetryLine: '化繁为简是最高级的智慧，让学术之光照亮每一颗求知之心。',
  },
  'D-IE-β': {
    key: 'D-IE-β', parentKey: 'D-IE', direction: 'beta',
    name: '证据说服家', nameEn: 'Evidence Persuader', icon: '⚖️',
    tagline: '用事实和证据赢得每一场辩论',
    desc: '探究力+表达力组合，偏向辩论和说服。善于用严谨的证据链和有力的表达来说服他人，在讨论中总能拿出"硬证据"。',
    traits: ['证据链构建', '说服力', '辩论能力', '逻辑论证'],
    multiModalBasis: '语言+人际智能偏高，社会认知导向',
    parentInsight: '他"爱辩论"不是抬杠，是在训练未来律师或政策倡导者的核心技能',
    growthDirection: '辩论赛、模拟法庭、模联、公共演讲',
    careers: ['律师', '政策倡导者', '辩论教练', '商务谈判专家', '公关危机处理', 'TED演讲者'],
    poetryLine: '以事实为矛、以逻辑为盾，在观点的交锋中让真理闪光。',
  },

  // D-IR 哲学探究者 → 2种子类型
  'D-IR-α': {
    key: 'D-IR-α', parentKey: 'D-IR', direction: 'alpha',
    name: '方法论大师', nameEn: 'Methodology Master', icon: '📐',
    tagline: '不只解决问题，更在乎"用什么方法"解决',
    desc: '探究力+反思力组合，偏向方法论和认识论。对"如何知道"比"知道什么"更感兴趣。善于评估和优化研究方法本身。',
    traits: ['方法论', '认识论', '思维工具', '元研究'],
    multiModalBasis: '逻辑+内省智能偏高，自我认知导向，毅力驱动',
    parentInsight: '他质疑的不是答案，而是得到答案的过程——这是最高阶的批判性思维',
    growthDirection: '科学方法论、批判性思维训练、研究设计',
    careers: ['科学哲学家', '研究方法学家', '批判性思维教练', '认知科学研究者', '教育评估专家', '政策分析师'],
    poetryLine: '在方法与路径的反复推敲中，抵达认知最精密的核心。',
  },
  'D-IR-β': {
    key: 'D-IR-β', parentKey: 'D-IR', direction: 'beta',
    name: '意义追寻者', nameEn: 'Meaning Seeker', icon: '🌌',
    tagline: '在求证与反思中追寻更深层的意义',
    desc: '探究力+反思力组合，偏向意义和价值探索。不满足于事实本身，更追问"这意味着什么""这对人类有何价值"。',
    traits: ['价值追问', '意义探索', '人文关怀', '深度反思'],
    multiModalBasis: '内省+人际智能偏高，社会认知导向',
    parentInsight: '他不是"想太多"，是天生的思想者在寻找生命的深层意义',
    growthDirection: '人文阅读、伦理讨论、公益实践、生命教育',
    careers: ['伦理委员会顾问', '文化研究者', '社会创新家', '人文记者', '生命教育工作者', '公益策略师'],
    poetryLine: '在求证与反思的交响中，追寻事实背后最深沉的人生意义。',
  },

  // D-LD 项目统筹师 → 2种子类型
  'D-LD-α': {
    key: 'D-LD-α', parentKey: 'D-LD', direction: 'alpha',
    name: '战略统帅', nameEn: 'Strategic Commander', icon: '🏰',
    tagline: '目标明确、路径清晰、执行有力',
    desc: '联结力+设计力组合，偏向战略规划和目标管理。不仅能协调团队，更能制定清晰的战略路径。是"知道方向并能带队到达"的人。',
    traits: ['战略规划', '目标管理', '团队激励', '执行推动'],
    multiModalBasis: '逻辑+内省智能偏高，毅力驱动，尽责性强',
    parentInsight: '他天生就知道"先做什么后做什么"——这种战略感是天生领导者的标配',
    growthDirection: '项目管理实践、领导力训练、战略思维课程',
    careers: ['CEO', '管理咨询师', '运营总监', '项目总经理', '教务主任', '创业加速器导师'],
    poetryLine: '运筹帷幄之中，以战略眼光指引团队抵达胜利之巅。',
  },
  'D-LD-β': {
    key: 'D-LD-β', parentKey: 'D-LD', direction: 'beta',
    name: '人才教练', nameEn: 'Talent Coach', icon: '🤝',
    tagline: '让每个人都在最合适的位置发光',
    desc: '联结力+设计力组合，偏向人才发展和团队建设。善于发现每个人的长处并安排到最合适的角色，让团队如精密齿轮般运转。',
    traits: ['知人善任', '团队建设', '个性化赋能', '组织优化'],
    multiModalBasis: '人际+语言智能偏高，社会认知导向，宜人性强',
    parentInsight: '他安排分工总是特别合理——这种"识人"的本事是天生的管理潜能',
    growthDirection: '团队运动、学生会、志愿服务组织等管理实践',
    careers: ['人力资源总监', '团队教练', '组织发展顾问', '社会企业家', '教育管理者', '孵化器运营'],
    poetryLine: '以知人善任为笔，以团队和谐为画布，描绘每个人绽放的图景。',
  },

  // D-LE 沟通引领者 → 2种子类型
  'D-LE-α': {
    key: 'D-LE-α', parentKey: 'D-LE', direction: 'alpha',
    name: '观点引领者', nameEn: 'Opinion Leader', icon: '📢',
    tagline: '有自己的观点，更能让别人认同',
    desc: '联结力+表达力组合，偏向思想引领。不只是传递信息，更在意输出自己的独特观点并建立影响力。',
    traits: ['观点输出', '影响力', '意见领袖', '品牌塑造'],
    multiModalBasis: '语言+内省智能偏高，自我认知导向',
    parentInsight: '他不只"能说"，更"有自己的想法"——这是真正的意见领袖潜质',
    growthDirection: '写作、演讲、辩论、自媒体运营等意见表达',
    careers: ['品牌策略师', '公关顾问', '政治评论家', '自媒体创始人', '企业发言人', '品牌大使'],
    poetryLine: '以独到观点为旗帜，用表达的力量引领思潮的方向。',
  },
  'D-LE-β': {
    key: 'D-LE-β', parentKey: 'D-LE', direction: 'beta',
    name: '情感联结师', nameEn: 'Emotional Connector', icon: '💬',
    tagline: '说到每个人心里去，让团队拧成一股绳',
    desc: '联结力+表达力组合，偏向情感沟通。善于用温暖而精准的语言触动人心，在冲突中化解矛盾、在低谷时给人力量。',
    traits: ['情感沟通', '共鸣力', '团队凝聚', '冲突化解'],
    multiModalBasis: '人际+音乐智能偏高，社会认知导向，宜人性强',
    parentInsight: '他说的话总能"说到别人心里去"——这种情商在任何领域都是核心竞争力',
    growthDirection: '心理辅导、调解实践、团队建设活动',
    careers: ['心理咨询师', '客户关系经理', '培训师', '调解员', '外交官', '婚姻家庭顾问'],
    poetryLine: '以温暖的语言为桥，连接每一颗心，让沟通抵达灵魂深处。',
  },

  // D-LR 和谐推动者 → 2种子类型
  'D-LR-α': {
    key: 'D-LR-α', parentKey: 'D-LR', direction: 'alpha',
    name: '洞察辅导者', nameEn: 'Insight Counselor', icon: '🔮',
    tagline: '看到他人看不到的深层需求',
    desc: '联结力+反思力组合，偏向个体洞察。善于通过细腻的观察和深度倾听，发现他人未说出口的需求和情绪。是一对一深度辅导的高手。',
    traits: ['深度倾听', '需求洞察', '个体关怀', '心理直觉'],
    multiModalBasis: '内省+人际智能偏高，自我认知导向',
    parentInsight: '他总能"看穿"别人的心思——这不是读心术，而是极其敏锐的共情洞察力',
    growthDirection: '心理学入门、倾听训练、深度访谈实践',
    careers: ['心理咨询师', '儿童发展专家', '教育顾问', '生命教练', '人才评估师', '用户研究员'],
    poetryLine: '以洞察为灯，照亮他人内心最隐微的角落，给予最精准的理解。',
  },
  'D-LR-β': {
    key: 'D-LR-β', parentKey: 'D-LR', direction: 'beta',
    name: '团队调和者', nameEn: 'Team Harmonizer', icon: '☯️',
    tagline: '是团队中看不见的平衡守护神',
    desc: '联结力+反思力组合，偏向群体和谐。善于感知团队的整体氛围和动态变化，默默调整和维护团队的平衡与和谐。',
    traits: ['氛围感知', '平衡维护', '冲突预防', '隐性领导'],
    multiModalBasis: '人际+语言智能偏高，社会认知导向，宜人性强',
    parentInsight: '他在团队中的"安静"不是没存在感，是在默默维护整个团队的和谐',
    growthDirection: '团队运动、志愿服务、班级管理等群体协调实践',
    careers: ['组织发展顾问', '调解仲裁员', '团队教练', '社工', '文化建设负责人', '幸福学研究者'],
    poetryLine: '润物无声，在团队的暗流中守护着和谐与平衡的微妙艺术。',
  },

  // D-DE 策划演绎家 → 2种子类型
  'D-DE-α': {
    key: 'D-DE-α', parentKey: 'D-DE', direction: 'alpha',
    name: '策略制片人', nameEn: 'Strategic Producer', icon: '🎬',
    tagline: '从策划到执行到亮相，全程掌控',
    desc: '设计力+表达力组合，偏向项目制作。善于从全局视角策划项目，把控每个环节，确保最终呈现效果惊艳。是天然的制片人和总导演。',
    traits: ['全局把控', '精密策划', '品质标准', '完美呈现'],
    multiModalBasis: '逻辑+空间智能偏高，毅力驱动，尽责性强',
    parentInsight: '他"追求完美"不是吹毛求疵，是对品质有高标准——这是制片人的核心素质',
    growthDirection: '戏剧制作、活动策划、影视项目、展览布置',
    careers: ['影视制片人', '活动总导演', '品牌策划总监', '展览策划师', '游戏制作人', '综艺节目策划'],
    poetryLine: '精心策划每一个节拍，让呈现的瞬间成为无法忘怀的经典。',
  },
  'D-DE-β': {
    key: 'D-DE-β', parentKey: 'D-DE', direction: 'beta',
    name: '创意演绎者', nameEn: 'Creative Performer', icon: '🎪',
    tagline: '用创意点亮每一次呈现',
    desc: '设计力+表达力组合，偏向创意演绎。善于在呈现环节加入意想不到的创意元素，让平凡的内容变得令人惊喜。',
    traits: ['创意呈现', '惊喜制造', '艺术直觉', '表现力'],
    multiModalBasis: '音乐+空间+身体动觉偏高，开放性强',
    parentInsight: '他的"天马行空"加上"动手能力"，就是天生的创意总监',
    growthDirection: '创意设计、舞台表演、手工艺术、视觉传达',
    careers: ['创意总监', '广告创意人', '舞台设计师', '视觉艺术家', '演出策划', '创意工作室主理人'],
    poetryLine: '在设计与演绎的交汇处，绽放出最不可预期的创意烟火。',
  },

  // D-DR 精益优化师 → 2种子类型
  'D-DR-α': {
    key: 'D-DR-α', parentKey: 'D-DR', direction: 'alpha',
    name: '质量工匠', nameEn: 'Quality Craftsman', icon: '⚒️',
    tagline: '每一个细节都经得起反复检验',
    desc: '设计力+反思力组合，偏向品质精进。对作品质量有近乎偏执的追求，通过不断打磨将每一件事做到极致。是"工匠精神"的完美体现。',
    traits: ['极致品质', '持续打磨', '细节完美', '工匠精神'],
    multiModalBasis: '逻辑+空间智能偏高，毅力驱动，尽责性极强',
    parentInsight: '他反复修改作业不是强迫症，是天生的工匠在追求极致品质',
    growthDirection: '精细手工、编程调试、模型制作等需要精打细磨的活动',
    careers: ['质量工程师', '软件架构师', '精密仪器设计师', '工艺大师', '品控专家', '标准化顾问'],
    poetryLine: '如切如磋、如琢如磨，在反复精进中抵达手艺的至高境界。',
  },
  'D-DR-β': {
    key: 'D-DR-β', parentKey: 'D-DR', direction: 'beta',
    name: '迭代进化者', nameEn: 'Iterative Evolver', icon: '🔄',
    tagline: '每一次复盘都让方案更上一个台阶',
    desc: '设计力+反思力组合，偏向流程优化。善于从执行结果中总结经验，持续优化方案和流程。每做一次就比上次好一点。',
    traits: ['流程优化', '复盘总结', '持续改进', '学习型'],
    multiModalBasis: '内省+语言智能偏高，开放性强，自我认知导向',
    parentInsight: '他总说"下次我要换个方式"——这种持续优化的本能是终身成长的引擎',
    growthDirection: '复盘记录、方案迭代、A/B测试思维训练',
    careers: ['运营优化师', '精益生产专家', '增长策略师', '教学设计师', '流程改进顾问', '绩效管理师'],
    poetryLine: '每一次复盘都是一次进化，在迭代的螺旋中持续攀升。',
  },

  // D-ER 表达修行者 → 2种子类型
  'D-ER-α': {
    key: 'D-ER-α', parentKey: 'D-ER', direction: 'alpha',
    name: '文字炼金师', nameEn: 'Word Alchemist', icon: '✒️',
    tagline: '每一个字都经过深思熟虑的淬炼',
    desc: '表达力+反思力组合，偏向文字创作。善于通过深度思考和反复打磨，写出直击人心的文字。是"文字有力量"的最佳诠释者。',
    traits: ['文字功力', '思想深度', '反复打磨', '洞察力'],
    multiModalBasis: '语言+内省智能偏高，自我认知导向，兴趣驱动',
    parentInsight: '他安静时可能在构思——那些经过深思的文字会比即兴更有力量',
    growthDirection: '文学创作、散文写作、诗歌、剧本等深度写作',
    careers: ['小说家', '编剧', '文学评论家', '专栏作家', '诗人', '文案大师'],
    poetryLine: '以思想为火、以文字为金，在反复淬炼中锻造直击灵魂的篇章。',
  },
  'D-ER-β': {
    key: 'D-ER-β', parentKey: 'D-ER', direction: 'beta',
    name: '表演修行者', nameEn: 'Performance Practitioner', icon: '🎭',
    tagline: '每一次登台都是一次自我超越',
    desc: '表达力+反思力组合，偏向表演和口头表达。每次演出或演讲后都会深度复盘，不断精进自己的表现力。',
    traits: ['表演精进', '深度复盘', '感染力', '自我突破'],
    multiModalBasis: '音乐+身体动觉+人际智能偏高，社会认知导向',
    parentInsight: '他"爱表演"加上"会反思"，让每一次登台都比上次更好——这是顶级演员的素质',
    growthDirection: '戏剧表演、即兴表演、演讲比赛等舞台实践+复盘',
    careers: ['演员', '导演', '演讲培训师', '戏剧治疗师', '配音演员', '口述历史表演者'],
    poetryLine: '在舞台与反思的往复中，将每一次表演升华为艺术的永恒。',
  },

  // ==================== 三峰型 × 2 = 16种 ====================

  // T-WIL 全能探索家 → 2种子类型
  'T-WIL-α': {
    key: 'T-WIL-α', parentKey: 'T-WIL', direction: 'alpha',
    name: '科研领航者', nameEn: 'Research Navigator', icon: '🚀',
    tagline: '独立发起并推动完整科研项目的天生领袖',
    desc: '好奇心+探究力+联结力三维均强，偏向科研组织方向。不仅自己能做研究，还能组织团队、分配任务、推动科研项目。',
    traits: ['科研组织', '团队带领', '项目推动', '跨学科视野'],
    multiModalBasis: '逻辑+自然+内省智能偏高，自我认知导向',
    parentInsight: '他具备极其稀缺的"科研领导力"——既懂科学又懂人',
    growthDirection: '科研项目制学习、科技创新大赛、跨学科工作坊',
    careers: ['科研项目总监', '实验室创始人', '科考队队长', '研究型创业者', '学术带头人', '科学基金管理者'],
    poetryLine: '集好奇、严谨、协作于一身，领航科研的星辰大海。',
  },
  'T-WIL-β': {
    key: 'T-WIL-β', parentKey: 'T-WIL', direction: 'beta',
    name: '社会创新家', nameEn: 'Social Innovator', icon: '🌍',
    tagline: '用科学方法解决真实的社会问题',
    desc: '三维均强，偏向社会创新。善于发现社会问题，用科学方法调研，联合各方力量推动解决方案。',
    traits: ['社会问题', '科学调研', '多方协作', '创新方案'],
    multiModalBasis: '人际+语言智能偏高，社会认知导向',
    parentInsight: '他关心的不只是"知识"，更是"知识如何帮助人"——这是社会创新者的种子',
    growthDirection: '公益项目、社会调查、社区服务等社会实践',
    careers: ['社会企业创始人', 'NGO项目官', '公益创新家', '政策研究员', '社区发展专家', '可持续发展顾问'],
    poetryLine: '以好奇发现问题，以科学验证方案，以连接推动改变。',
  },

  // T-WID 创新实验家 → 2种子类型
  'T-WID-α': {
    key: 'T-WID-α', parentKey: 'T-WID', direction: 'alpha',
    name: '硬核发明家', nameEn: 'Hardcore Inventor', icon: '🔧',
    tagline: '从灵感到原型到专利，一个人的研发中心',
    desc: '三维均强，偏向技术发明。善于将好奇心驱动的发现通过严谨验证和工程设计转化为实际产品或技术。',
    traits: ['技术发明', '工程实现', '专利思维', '硬核创新'],
    multiModalBasis: '逻辑+空间智能偏高，毅力驱动',
    parentInsight: '他的卧室可能就是未来的"车库创业实验室"——这是最有创业者基因的组合',
    growthDirection: '科技发明大赛、开源项目、硬件制作',
    careers: ['发明家', '科技创业CTO', '硬件工程师', 'DeepTech创始人', '专利策略师', '研发总监'],
    poetryLine: '从灵感的火花到原型的诞生，每一项发明都改写未来的可能。',
  },
  'T-WID-β': {
    key: 'T-WID-β', parentKey: 'T-WID', direction: 'beta',
    name: '跨界融合家', nameEn: 'Cross-Domain Fusionist', icon: '🧬',
    tagline: '在不同领域的交叉点创造全新的解决方案',
    desc: '三维均强，偏向跨领域创新。善于将不同学科的知识和方法融合在一起，产生突破性的解决方案。',
    traits: ['跨界思维', '知识融合', '突破性创新', '多学科视野'],
    multiModalBasis: '多元智能较均衡，开放性强',
    parentInsight: '他"什么都感兴趣"不是没定力——跨界思维本身就是最强的创新力',
    growthDirection: '跨学科项目、STEAM教育、通识课程',
    careers: ['生物信息学家', '交叉科学研究者', '创新设计师', '新材料科学家', '跨媒体创作者', '创新咨询师'],
    poetryLine: '在学科的交叉路口，种下创新最肥沃的种子。',
  },

  // T-IDR 策略领航者 → 2种子类型
  'T-IDR-α': {
    key: 'T-IDR-α', parentKey: 'T-IDR', direction: 'alpha',
    name: '决策分析师', nameEn: 'Decision Analyst', icon: '📊',
    tagline: '用数据和逻辑做出最优决策',
    desc: '三维均强，偏向数据决策。善于收集数据、分析趋势、设计方案并持续优化，在复杂决策场景中表现卓越。',
    traits: ['数据决策', '趋势分析', '风险评估', '方案优化'],
    multiModalBasis: '逻辑+空间智能偏高，毅力驱动，尽责性强',
    parentInsight: '他做选择时特别慎重——这不是犹豫不决，是在用数据做决策',
    growthDirection: '数据分析项目、策略游戏、金融模拟',
    careers: ['战略咨询师', '投资分析师', '首席数据官', '风控专家', '精算师', '智库研究员'],
    poetryLine: '以数据为基、以逻辑为经，在不确定中精准锚定最优解。',
  },
  'T-IDR-β': {
    key: 'T-IDR-β', parentKey: 'T-IDR', direction: 'beta',
    name: '系统优化家', nameEn: 'System Optimizer', icon: '🔄',
    tagline: '让每一个系统都运转得更好',
    desc: '三维均强，偏向系统优化。善于审视整个系统的运作方式，找出瓶颈和低效环节，设计改进方案。',
    traits: ['系统优化', '流程改进', '瓶颈发现', '效率提升'],
    multiModalBasis: '内省+人际智能偏高，社会认知导向',
    parentInsight: '他总能发现"哪里可以更好"——这种持续优化的思维是组织进步的引擎',
    growthDirection: '流程优化项目、效率工具使用、组织管理实践',
    careers: ['运营总监', 'CTO', '精益管理专家', '系统架构师', '教育体系设计师', '政策优化顾问'],
    poetryLine: '以全局之眼审视系统，在优化的循环中推动每一个环节走向卓越。',
  },

  // T-WLE 社交催化剂 → 2种子类型
  'T-WLE-α': {
    key: 'T-WLE-α', parentKey: 'T-WLE', direction: 'alpha',
    name: '思想策展人', nameEn: 'Idea Curator', icon: '💡',
    tagline: '发现最好的想法，传播给最对的人',
    desc: '三维均强，偏向思想传播。善于在信息海洋中发现有价值的思想，通过社交网络精准传播，成为知识生态的核心节点。',
    traits: ['思想筛选', '精准传播', '知识策展', '生态构建'],
    multiModalBasis: '语言+内省智能偏高，自我认知导向',
    parentInsight: '他分享的东西总特别有营养——这种"策展式传播"是信息时代的稀缺能力',
    growthDirection: '内容创作、知识社群运营、读书会组织',
    careers: ['知识社群创始人', '内容策展人', '学术平台运营', '思想类自媒体', '文化节策划', '智库传播官'],
    poetryLine: '以好奇为雷达、以连接为脉络、以表达为声量，策展时代最好的思想。',
  },
  'T-WLE-β': {
    key: 'T-WLE-β', parentKey: 'T-WLE', direction: 'beta',
    name: '社群发动机', nameEn: 'Community Engine', icon: '🔆',
    tagline: '用魅力和热情点燃整个社群的探索欲',
    desc: '三维均强，偏向社群激活。天生的社群领袖，能用个人魅力和感染力发动一群人一起行动。',
    traits: ['社群激活', '感染力', '行动发起', '群体领导'],
    multiModalBasis: '人际+音乐智能偏高，社会认知导向，外向性强',
    parentInsight: '他走到哪里，哪里就热闹起来——这种天然的号召力是未来领袖的核心',
    growthDirection: '学生会、社团组织、志愿活动发起等社群实践',
    careers: ['社群运营CEO', '活动策划总监', '品牌大使', '社交媒体总监', 'TEDx组织者', '公益活动发起人'],
    poetryLine: '天生的火种，走到哪里就点亮哪里，让好奇与热情在人群中共振。',
  },

  // T-WIR 内驱型学者 → 2种子类型
  'T-WIR-α': {
    key: 'T-WIR-α', parentKey: 'T-WIR', direction: 'alpha',
    name: '基础科学探路者', nameEn: 'Fundamental Science Pioneer', icon: '🔭',
    tagline: '为了"知道"本身而求知——最纯粹的学者',
    desc: '三维均强，偏向基础研究。被纯粹的求知欲驱动，不追求功利化回报，享受理解世界本质的过程。',
    traits: ['纯粹求知', '基础研究', '理论深度', '学术独立'],
    multiModalBasis: '逻辑+自然+内省智能偏高，自我认知导向',
    parentInsight: '他学习不是为了分数或就业——这种纯粹的内在动机是顶级学者的标配',
    growthDirection: '深度阅读、学术讨论、研究性课题、数理竞赛',
    careers: ['大学教授', '基础科学研究者', '数学家', '理论物理学家', '独立学者', '学术期刊主编'],
    poetryLine: '以纯粹的求知欲为帆，航向人类认知的最远边界。',
  },
  'T-WIR-β': {
    key: 'T-WIR-β', parentKey: 'T-WIR', direction: 'beta',
    name: '智慧整合者', nameEn: 'Wisdom Integrator', icon: '📖',
    tagline: '在不同领域的知识之间架设理解的桥梁',
    desc: '三维均强，偏向知识整合。善于在不同学科之间找到联系，将分散的知识编织成连贯的理解框架。',
    traits: ['知识整合', '跨域理解', '体系构建', '通识素养'],
    multiModalBasis: '语言+人际+内省智能偏高，社会认知导向',
    parentInsight: '他能把看似无关的知识联系在一起——这种"连点成线"的能力是通识教育的最高目标',
    growthDirection: '通识阅读、跨学科讨论、知识整合项目',
    careers: ['通识教育家', '科学史学者', '跨学科研究者', '百科全书编者', '知识管理师', '教育体系设计师'],
    poetryLine: '在知识的星辰间架设桥梁，编织出理解世界的宏伟图谱。',
  },

  // T-DLE 实践建造者 → 2种子类型
  'T-DLE-α': {
    key: 'T-DLE-α', parentKey: 'T-DLE', direction: 'alpha',
    name: '创业实干家', nameEn: 'Startup Builder', icon: '🏗️',
    tagline: '从商业计划到团队组建到产品发布，全流程通关',
    desc: '三维均强，偏向创业和商业。善于设计商业模式、组建团队、打造产品并推向市场。',
    traits: ['商业敏感', '团队组建', '产品打造', '市场推广'],
    multiModalBasis: '逻辑+空间智能偏高，毅力驱动',
    parentInsight: '他在班级活动中展现的组织力和执行力——放大到社会就是创业家的核心能力',
    growthDirection: '模拟创业、商业计划书、产品设计实践',
    careers: ['创业公司CEO', '产品总监', 'COO', '商业加速器导师', '投资经理', '连锁品牌创始人'],
    poetryLine: '规划蓝图、组建团队、精彩呈现——创业的全旅程尽在掌握。',
  },
  'T-DLE-β': {
    key: 'T-DLE-β', parentKey: 'T-DLE', direction: 'beta',
    name: '文化营造者', nameEn: 'Culture Creator', icon: '🎨',
    tagline: '打造让人心生向往的空间和体验',
    desc: '三维均强，偏向文化营造和体验设计。善于创造有温度、有美感的空间和活动，让参与者获得独特体验。',
    traits: ['文化塑造', '体验设计', '美学追求', '社区营造'],
    multiModalBasis: '音乐+人际+空间智能偏高，社会认知导向',
    parentInsight: '他布置的空间、组织的活动总有一种"氛围感"——这是文化营造者的潜能',
    growthDirection: '空间设计、文化活动策划、社区营造实践',
    careers: ['文化空间创始人', '活动体验设计师', '品牌文化官', '社区营造师', '策展人', '文创产品设计师'],
    poetryLine: '以设计为骨、以情感为魂，营造每一个让人心生归属的文化空间。',
  },

  // T-LER 感知协调者 → 2种子类型
  'T-LER-α': {
    key: 'T-LER-α', parentKey: 'T-LER', direction: 'alpha',
    name: '心灵导师', nameEn: 'Soul Mentor', icon: '🕊️',
    tagline: '用洞察和语言照亮他人的人生方向',
    desc: '三维均强，偏向个体辅导。善于通过深度倾听和精准的语言引导，帮助他人看清自己的内心。',
    traits: ['深度辅导', '人生引导', '情绪智慧', '语言治愈'],
    multiModalBasis: '内省+语言智能偏高，自我认知导向',
    parentInsight: '他说的话总能让人"豁然开朗"——这种辅导潜能远超同龄人',
    growthDirection: '心理学学习、倾听训练、志愿辅导实践',
    careers: ['心理治疗师', '人生教练', '领导力教练', '灵性导师', '叙事治疗师', '教育咨询师'],
    poetryLine: '以洞察为光、以语言为路，引领迷途的心灵找到归航的方向。',
  },
  'T-LER-β': {
    key: 'T-LER-β', parentKey: 'T-LER', direction: 'beta',
    name: '社群情感家', nameEn: 'Community Empath', icon: '🎭',
    tagline: '是团队中的情感中枢，让每个人都感觉被看见',
    desc: '三维均强，偏向群体情感管理。善于感知和调节群体情绪，在团队中创造安全和信任的氛围。',
    traits: ['群体情绪', '安全氛围', '信任构建', '团队关怀'],
    multiModalBasis: '人际+音乐智能偏高，社会认知导向',
    parentInsight: '他让身边的人"都觉得舒服"——这种创造安全感的能力是稀缺的领导力',
    growthDirection: '团队建设、心理安全训练、冲突管理实践',
    careers: ['组织行为学家', '团队教练', '谈判专家', '文化官', '幸福学研究者', '调解仲裁师'],
    poetryLine: '在群体的情绪波动中，做那个创造安全感和信任感的温暖锚点。',
  },

  // T-WDE 创想工程师 → 2种子类型
  'T-WDE-α': {
    key: 'T-WDE-α', parentKey: 'T-WDE', direction: 'alpha',
    name: '科技创变者', nameEn: 'Tech Changemaker', icon: '⚡',
    tagline: '用科技创新改变世界的运行方式',
    desc: '三维均强，偏向科技创业方向。善于将好奇心驱动的发现转化为产品，并通过精彩的发布会推向市场。乔布斯式人格。',
    traits: ['科技创业', '产品发布', '颠覆创新', '市场洞察'],
    multiModalBasis: '逻辑+空间智能偏高，毅力驱动',
    parentInsight: '他的好奇心+动手力+表现力——这是科技创业者黄金三角的完美组合',
    growthDirection: '科技创业项目、产品演示、创客大赛',
    careers: ['科技创业CEO', '产品发布会演讲者', '创新加速器导师', 'CTO/CPO', '天使投资人', '科技媒体人'],
    poetryLine: '敢想、能做、会秀——以科技之力重新定义明天的样子。',
  },
  'T-WDE-β': {
    key: 'T-WDE-β', parentKey: 'T-WDE', direction: 'beta',
    name: '创意全才', nameEn: 'Creative Polymath', icon: '🎪',
    tagline: '在创意、制作和呈现之间自由切换的全能选手',
    desc: '三维均强，偏向创意全能。能同时扮演灵感源、执行者和发言人三种角色，是"一个人就是一支创意团队"。',
    traits: ['全能创作', '角色切换', '独立完成', '跨媒介'],
    multiModalBasis: '多元智能较均衡，开放性强，兴趣驱动',
    parentInsight: '他"什么都想做"且"什么都能做出来"——这是AI时代超级个体的原型',
    growthDirection: '跨媒介创作、独立项目、个人品牌打造',
    careers: ['独立创作者', '跨媒介艺术家', '个人品牌IP', 'Maker Space创始人', '创意工作室主理人', '设计思维教练'],
    poetryLine: '创意、制作、呈现——三位一体，一个人就是一支创想军团。',
  },

  // ==================== 特殊型 × 2 = 2种 ====================

  'X-BAL-α': {
    key: 'X-BAL-α', parentKey: 'X-BAL', direction: 'alpha',
    name: '探索型潜能绽放者', nameEn: 'Exploratory Bloomer', icon: '🌱',
    tagline: '均衡的六维是最肥沃的土壤，等待一颗种子落下',
    desc: '六维均衡且偏向探索和自我驱动方向。这个孩子像一块海绵，对什么都有不错的吸收力。关键不是"补短板"，而是通过大量探索体验找到那个"让TA眼睛发光"的领域。',
    traits: ['广泛兴趣', '自我驱动', '适应性强', '等待激活'],
    multiModalBasis: '多维度均衡，偏向内在驱动和探索导向',
    parentInsight: '均衡不等于平庸——它意味着TA在很多方向都有发展可能，关键是找到引爆点',
    growthDirection: '广泛体验不同领域（科学、艺术、运动、社交），观察哪个领域让孩子"忘记时间"',
    careers: ['通才型管理者', '跨学科研究者', '全栈工程师', '教育工作者', '自由职业者', '综合创业者'],
    poetryLine: '六维如六扇窗，等待一阵春风吹开那扇通往热爱的门。',
  },
  'X-BAL-β': {
    key: 'X-BAL-β', parentKey: 'X-BAL', direction: 'beta',
    name: '协作型潜能绽放者', nameEn: 'Collaborative Bloomer', icon: '🌻',
    tagline: '在团队和互动中最容易找到自己的方向',
    desc: '六维均衡且偏向社交和协作方向。这个孩子在与人互动中最能激发潜能。与其让TA独自尝试，不如创造更多团队活动和社交学习的机会。',
    traits: ['团队激活', '社交学习', '协作成长', '环境敏感'],
    multiModalBasis: '多维度均衡，偏向社交驱动和协作导向',
    parentInsight: '他可能在一个人时表现普通，但在团队中总能闪光——社交就是他的激活器',
    growthDirection: '团队运动、社群活动、合作项目、夏令营等社交丰富的学习场景',
    careers: ['团队管理者', '社群运营', '协作教育家', '社会工作者', '客户成功经理', '活动策划师'],
    poetryLine: '在与人共鸣的互动中，潜能的种子悄然破土，绽放最灿烂的可能。',
  },
}

// ========== 匹配算法 ==========

export interface TalentMatch60 {
  key: string
  talent60: TalentType60
  parentTalent30: TalentType30
  matchReason: string
  multiModalFeatures: MultiModalFeatures
  confidence: number
}

/**
 * 60种潜能类型匹配算法
 * Step 1: 使用现有30分型算法确定基础分型
 * Step 2: 使用多模态数据（MI/BigFive/Grit/SEL）确定α/β子方向
 * Step 3: 组合得到60分型结果
 */
export function matchTalentType60(
  wilderPcts: Record<string, number>,
  scores: AssessmentScores,
): TalentMatch60 {
  // Step 1: 30分型匹配
  const match30 = matchTalentType30(wilderPcts)

  // Step 2: 多模态特征提取
  const features = extractMultiModalFeatures(scores)

  // Step 3: 组合60分型 key
  const direction = features.overallDirection
  const key60 = `${match30.key}-${direction === 'alpha' ? 'α' : 'β'}`

  // 查找60分型
  const talent60 = TALENT_TYPES_60[key60]

  if (!talent60) {
    // Fallback: 使用均衡型
    const fallbackKey = `X-BAL-${direction === 'alpha' ? 'α' : 'β'}`
    return {
      key: fallbackKey,
      talent60: TALENT_TYPES_60[fallbackKey],
      parentTalent30: match30.talent,
      matchReason: `${match30.matchReason}；多模态数据显示偏向${direction === 'alpha' ? '探索/分析' : '协作/表达'}方向`,
      multiModalFeatures: features,
      confidence: 70,
    }
  }

  // 计算置信度
  const confidence = computeConfidence60(wilderPcts, scores, features, match30.key)

  return {
    key: key60,
    talent60,
    parentTalent30: match30.talent,
    matchReason: `${match30.matchReason}；${talent60.multiModalBasis}`,
    multiModalFeatures: features,
    confidence,
  }
}

/** 计算60分型匹配置信度 */
function computeConfidence60(
  wilderPcts: Record<string, number>,
  scores: AssessmentScores,
  features: MultiModalFeatures,
  _parentKey: string,
): number {
  let confidence = 75 // 基础值

  // 因素1: WILDER维度区分度越高，30分型越确定 → +10
  const dims = ['W', 'I', 'L', 'D', 'E', 'R']
  const sorted = [...dims].sort((a, b) => (wilderPcts[b] || 0) - (wilderPcts[a] || 0))
  const spread = (wilderPcts[sorted[0]] || 0) - (wilderPcts[sorted[1]] || 0)
  if (spread >= 20) confidence += 10
  else if (spread >= 10) confidence += 5

  // 因素2: 多模态投票一致性
  let alphaVotes = 0
  if (features.miDirection === 'analytical') alphaVotes++
  if (features.bfDirection === 'explorer') alphaVotes++
  if (features.gritDirection === 'passionate') alphaVotes++
  if (features.selDirection === 'self-oriented') alphaVotes++
  const voteConsistency = Math.max(alphaVotes, 4 - alphaVotes) / 4
  confidence += Math.round(voteConsistency * 10) // 最多+10

  // 因素3: 数据丰富度
  const mi = scores.multipleIntelligences
  const miTotal = Object.values(mi).reduce((s, v) => s + (v || 0), 0)
  if (miTotal > 10) confidence += 3 // MI数据充足
  const bf = scores.bigFive
  const bfTotal = Object.values(bf).reduce((s, v) => s + (v || 0), 0)
  if (bfTotal > 5) confidence += 2 // BigFive数据充足

  return Math.min(98, confidence)
}

// ========== 工具函数 ==========

/** 获取所有60种类型 */
export function getAllTalentTypes60(): TalentType60[] {
  return Object.values(TALENT_TYPES_60)
}

/** 通过父级30分型key获取对应的两种60分型 */
export function getSubTypes(parentKey: string): TalentType60[] {
  return Object.values(TALENT_TYPES_60).filter(t => t.parentKey === parentKey)
}

/** 获取60分型总数 */
export function getTalentType60Count(): number {
  return Object.keys(TALENT_TYPES_60).length
}
