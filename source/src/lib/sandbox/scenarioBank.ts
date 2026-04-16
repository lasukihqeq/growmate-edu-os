// ===================================================================
// 沙盘情境素材库 v1.0
// 提供各WILDER维度的情境模板，用于将传统题目包装为剧情事件
// ===================================================================

import type { ContextMappingTemplate, StoryTheme } from './types'

/** WILDER各维度的情境映射规则 */
export const WILDER_CONTEXT_RULES: Record<string, ContextMappingTemplate> = {
  // 好奇心 → 探索发现情境
  W: {
    dimension: 'W',
    scenarioType: 'discovery',
    narrativeTemplate: '你发现了一个{object}，它看起来{adjective}，引起了你的注意',
    objectPool: [
      '奇怪的发光石头',
      '一本泛黄的古老笔记本',
      '隐藏在树林深处的神秘小屋',
      '一个会说话的古怪仪器',
      '从未见过的奇异植物',
      '天空中突然出现的奇特光晕',
    ],
    adjectivePool: [
      '闪闪发光',
      '散发着淡淡的蓝光',
      '布满奇怪的符号',
      '微微震动着',
      '散发着奇特的香味',
      '表面覆盖着晶莹的露珠',
    ],
    problemPool: [],
    actionMapping: {
      curious: '蹲下来仔细观察，想要了解它的秘密',
      ask: '立刻向身边的同伴或大人求助询问',
      document: '拿出手机拍照记录，想要回家查资料',
      cautious: '保持距离，小心观察是否有危险',
      ignore: '看了一眼后继续原来的行程',
    },
  },

  // 探究力 → 问题解决情境
  I: {
    dimension: 'I',
    scenarioType: 'problem_solving',
    narrativeTemplate: '你遇到了一个问题：{problem}。你必须想办法解决它',
    objectPool: [],
    adjectivePool: [],
    problemPool: [
      '指南针失灵了，你无法确定方向',
      '搭建的桥梁突然倒塌',
      '实验数据出现了异常，与预期完全不同',
      '团队的意见产生了严重分歧',
      '发现了一个谜题，解开它需要多步推理',
      '关键的资料被损坏或缺失',
    ],
    actionMapping: {
      experiment: '设计一个实验来验证不同的可能性',
      read: '查阅相关资料和文献寻找线索',
      think: '静下心来仔细推理分析',
      collaborate: '组织团队讨论，集思广益',
      ask_expert: '请教有经验的导师或专家',
    },
  },

  // 连接力 → 社交协作情境
  L: {
    dimension: 'L',
    scenarioType: 'social_collaboration',
    narrativeTemplate: '你所在的团队面临着{problem}，需要协调各方力量',
    objectPool: [],
    adjectivePool: [],
    problemPool: [
      '资源分配的矛盾',
      '任务分工的争议',
      '团队成员之间的沟通障碍',
      '与外部合作伙伴的信任危机',
      '紧急情况下的人员调度',
    ],
    actionMapping: {
      lead: '主动站出来担任协调者角色',
      mediate: '居中调解，寻找各方都能接受的方案',
      support: '默默支持团队的决定，做好自己的部分',
      delegate: '根据每个人的特长分配任务',
      listen: '先倾听每个人的想法，再提出建议',
    },
  },

  // 设计力 → 创造创新情境
  D: {
    dimension: 'D',
    scenarioType: 'creative_innovation',
    narrativeTemplate: '你需要设计一个{object}来解决当前的挑战',
    objectPool: [
      '全新的交通工具',
      '适应极端环境的住所',
      '高效的能源收集装置',
      '智能垃圾分类系统',
      '跨语言沟通的翻译设备',
    ],
    adjectivePool: [
      '环保且可持续的',
      '成本极低但功能强大的',
      '美观且实用的',
      '能够自我修复的',
      '可以自适应环境的',
    ],
    problemPool: [],
    actionMapping: {
      brainstorm: '组织头脑风暴，收集尽可能多的创意',
      prototype: '快速制作原型，边做边改进',
      research: '研究已有的解决方案，寻找灵感',
      sketch: '先画出详细的设计图纸',
      iterate: '从一个简单版本开始，不断迭代优化',
    },
  },

  // 表达力 → 沟通展示情境
  E: {
    dimension: 'E',
    scenarioType: 'communication',
    narrativeTemplate: '你需要向{object}解释你的想法和计划',
    objectPool: [
      '一群持怀疑态度的投资人',
      '完全不了解技术背景的普通观众',
      '意见分歧的团队成员',
      '时间紧迫的决策委员会',
      '充满好奇心但缺乏耐心的小朋友',
    ],
    adjectivePool: [],
    problemPool: [],
    actionMapping: {
      visualize: '用图表和可视化方式清晰展示',
      story: '用一个生动的故事来传达核心观点',
      demonstrate: '现场演示，让事实说话',
      simplify: '用最简单直白的语言解释',
      persuade: '用数据和逻辑进行有说服力的论述',
    },
  },

  // 反思力 → 自我审视情境
  R: {
    dimension: 'R',
    scenarioType: 'self_reflection',
    narrativeTemplate: '经历了一次{object}后，你需要回顾整个过程',
    objectPool: [
      '失败的实验',
      '成功的团队项目',
      '激烈的辩论赛',
      '充满挑战的野外探险',
      '意外的事件',
    ],
    adjectivePool: [
      '出乎意料的',
      '充满教训的',
      '改变你认知的',
      '让你重新思考价值观的',
      '揭示了你未曾注意到的盲点的',
    ],
    problemPool: [],
    actionMapping: {
      journal: '写下详细的反思日记',
      discuss: '与信任的朋友深入讨论得失',
      analyze: '系统地分析成功和失败的因素',
      adjust: '根据经验教训调整下一步计划',
      celebrate: '先庆祝成果，再思考改进空间',
    },
  },
}

/** 故事主题情境包 */
export const STORY_THEME_PACKS: Record<StoryTheme, {
  title: string
  description: string
  suitableAgeGroups: string[]
  openingScenarios: string[]
}> = {
  natural_exploration: {
    title: '自然探索之旅',
    description: '深入未知领域，发现自然的奥秘',
    suitableAgeGroups: ['preschool', 'lower-primary', 'upper-primary'],
    openingScenarios: [
      '你是一名年轻的探险家，正在亚马逊雨林深处进行科学考察...',
      '科考船的雷达突然探测到一个海底未知区域...',
      '你收到了一个来自南极科考站的紧急求助信号...',
    ],
  },
  social_collaboration: {
    title: '团队协作挑战',
    description: '在复杂的人际关系中寻找最佳协作方案',
    suitableAgeGroups: ['lower-primary', 'upper-primary', 'middle-school'],
    openingScenarios: [
      '你被选为学生会主席，面临一系列棘手的管理问题...',
      '你的创业团队获得了第一笔投资，但分歧开始出现...',
      '社区需要组织一场大型公益活动，你担任总协调人...',
    ],
  },
  creative_innovation: {
    title: '创新工坊',
    description: '用创造力解决看似不可能的难题',
    suitableAgeGroups: ['upper-primary', 'middle-school', 'high-school'],
    openingScenarios: [
      '你参加了一个全球性的创新挑战赛，题目是解决城市拥堵...',
      '你的发明工作室接到了一个特殊的定制需求...',
      '一家传统企业请求你帮助他们进行数字化转型...',
    ],
  },
  mystery_solving: {
    title: '解谜推理',
    description: '抽丝剥茧，还原事件真相',
    suitableAgeGroups: ['middle-school', 'high-school'],
    openingScenarios: [
      '学校图书馆的一本珍贵古籍离奇失踪了...',
      '你在整理祖父遗物时发现了一封神秘的信件...',
      '社区里连续发生了几起奇怪的事件，似乎互相关联...',
    ],
  },
  startup_challenge: {
    title: '创业风云',
    description: '在商业世界中运筹帷幄',
    suitableAgeGroups: ['high-school'],
    openingScenarios: [
      '你的科技初创公司即将发布第一款产品，却遇到了技术瓶颈...',
      '你发现了一个巨大的市场机会，但竞争对手已经行动...',
      '你的公司面临着严重的公关危机...',
    ],
  },
  crisis_management: {
    title: '危机应对',
    description: '在高压环境下做出关键决策',
    suitableAgeGroups: ['middle-school', 'high-school'],
    openingScenarios: [
      '你正在领导一个科考队，突然遭遇了极端天气...',
      '你负责的项目在关键节点出现了严重失误...',
      '你的团队需要在48小时内完成一个不可能的任务...',
    ],
  },
}

/** 情境连贯性增强模板 */
export const NARRATIVE_BRIDGES = {
  // 场景之间的过渡句
  transitions: [
    '几天后，情况发生了变化...',
    '正当你准备行动时，意想不到的事情发生了...',
    '随着调查的深入，你发现了更多线索...',
    '团队的其他成员也加入了进来...',
    '时间紧迫，你必须尽快做出决定...',
    '新的信息出现了，改变了你的判断...',
    '之前的决定产生了连锁反应...',
    '你收到了一个来自远方的消息...',
  ],
  // 角色反应模板
  characterReactions: {
    supportive: [
      '"我相信你的判断！"你的伙伴坚定地说。',
      '"这个想法很有潜力，我们可以试试。"导师点了点头。',
    ],
    questioning: [
      '"你确定吗？有没有考虑过其他可能性？"同伴提出了疑问。',
      '"这个决定的后果你想清楚了吗？"对手冷冷地问。',
    ],
    challenging: [
      '"证明给我看，这不是异想天开。"投资人双手交叉在胸前。',
      '"你的方案有数据支持吗？"评委严肃地看着你。',
    ],
  },
}

/** 游戏化成就定义 */
export const SANDBOX_BADGES = [
  {
    id: 'story_explorer',
    name: '故事探险家',
    icon: '📖',
    description: '完成了第一个沙盘故事',
    category: 'story' as const,
    rarity: 'common' as const,
  },
  {
    id: 'dimension_master',
    name: '维度大师',
    icon: '🌀',
    description: '在多重宇宙中做出了正确的选择',
    category: 'multiverse' as const,
    rarity: 'rare' as const,
  },
  {
    id: 'ai_friend',
    name: 'AI好友',
    icon: '🤖',
    description: '与AI角色建立了良好的互动关系',
    category: 'character' as const,
    rarity: 'epic' as const,
  },
  {
    id: 'curiosity_master',
    name: '好奇心之王',
    icon: '🔭',
    description: '在W维度上获得最高评分',
    category: 'dimension' as const,
    rarity: 'rare' as const,
  },
  {
    id: 'problem_solver',
    name: '问题终结者',
    icon: '🧩',
    description: '在I维度上获得最高评分',
    category: 'dimension' as const,
    rarity: 'rare' as const,
  },
  {
    id: 'team_leader',
    name: '团队领袖',
    icon: '👑',
    description: '在L维度上获得最高评分',
    category: 'dimension' as const,
    rarity: 'rare' as const,
  },
  {
    id: 'creative_genius',
    name: '创意天才',
    icon: '💡',
    description: '在D维度上获得最高评分',
    category: 'dimension' as const,
    rarity: 'rare' as const,
  },
  {
    id: 'storyteller',
    name: '故事大王',
    icon: '🎭',
    description: '在E维度上获得最高评分',
    category: 'dimension' as const,
    rarity: 'rare' as const,
  },
  {
    id: 'deep_thinker',
    name: '深度思考者',
    icon: '🪞',
    description: '在R维度上获得最高评分',
    category: 'dimension' as const,
    rarity: 'rare' as const,
  },
  {
    id: 'sandbox_legend',
    name: '沙盘传奇',
    icon: '🏆',
    description: '完美通关所有难度级别的沙盘',
    category: 'story' as const,
    rarity: 'legendary' as const,
  },
]
