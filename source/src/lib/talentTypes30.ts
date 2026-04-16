// ===================================================================
// GrowMate 30 潜能类型系统 v2.0
// 基于 WILDER 六维度的三层分型模型
// 层级: 单峰型(6) + 双峰型(15) + 三峰型(8) + 特殊型(1) = 30
// ===================================================================

export type TalentTier = 'single' | 'dual' | 'triple' | 'special'

/** 人格画像信息（用于报告输出，使用中文描述） */
export interface PersonalityProfileInfo {
  /** 人格类型中文描述 */
  typeName: string
  /** 核心特质列表 */
  coreTraits: string[]
  /** 与 WILDER 维度的关联说明 */
  wilderCorrelation: string
}

export interface TalentType30 {
  key: string                    // 唯一标识 e.g. 'S-W', 'D-WI', 'T-WIL'
  tier: TalentTier               // 分层
  name: string                   // 中文名
  nameEn: string                 // 英文名
  icon: string                   // 图标
  tagline: string                // 一句话标签
  desc: string                   // 详细描述
  dims: string[]                 // 核心维度组合
  /** 人格画像（使用中文描述，不出现任何代码） */
  personalityProfile?: PersonalityProfileInfo
  careers: string[]              // 职业方向 (8-10)
  parentHighlight: string        // 家长最关心的一句话
  coreStrength: string           // 核心优势描述
  growthFocus: string            // 成长重点
  aiAgeInsight: string           // AI时代洞察
  poetryLine: string             // 报告封面诗意描述（白话）
  poetryQuote: string            // 报告封面金句（古诗/名言）
  mbtiApprox?: string            // MBTI近似类型 e.g. 'INTJ', 'ENFP'
}

// ==================== 30种潜能类型 ====================

export const TALENT_TYPES_30: Record<string, TalentType30> = {
  // ========== 层级A: 单峰型 (6种) ==========
  // 当最强维度与第二维度差距 ≥ 20%
  'S-W': {
    key: 'S-W', tier: 'single', dims: ['W'],
    name: '好奇先锋', nameEn: 'Curiosity Pioneer', icon: '🔭',
    tagline: '问出好问题，比找到答案更重要',
    desc: '好奇心远超同龄人，对世界充满无尽的"为什么"。这类孩子拥有科学家和发明家的核心特质——不满足于表面答案，总想往更深处探索。',
    personalityProfile: {
      typeName: '好奇探索型',
      coreTraits: ['善于提问', '探索精神', '创新思维'],
      wilderCorrelation: '好奇心驱动探索，与探究力(I)和设计力(D)形成创新闭环'
    },
    careers: ['基础科学研究者', '自然科考探险家', '科技记者', '产品创新经理', '博物馆策展人', '科学教育家', '创业孵化导师', '专利发明家'],
    parentHighlight: '好奇心是AI时代最稀缺的能力——机器不会对蝴蝶感到好奇',
    coreStrength: '极强的提问能力和现象捕捉力，能在平凡中发现不平凡',
    growthFocus: '将好奇心转化为系统探究能力，从"问得好"到"研究好"',
    aiAgeInsight: '当AI能回答所有问题时，能"问出好问题"的人将成为最核心的创新驱动力',
    poetryLine: '以万千追问叩开未知之门，每一个"为什么"都是通往真理的钥匙。',
    poetryQuote: '"学贵善疑，疑者觉悟之机也" ——陈献章',
  },
  'S-I': {
    key: 'S-I', tier: 'single', dims: ['I'],
    name: '求真卫士', nameEn: 'Truth Seeker', icon: '🔬',
    tagline: '用证据说话，真理越辩越明',
    desc: '探究力极为突出，不轻易接受现成答案，坚持用事实和数据验证一切。这种"求证精神"是科学方法论的完美萌芽。',
    personalityProfile: {
      typeName: '求真分析型',
      coreTraits: ['严谨求证', '逻辑严密', '证据导向'],
      wilderCorrelation: '探究力驱动验证，与设计力(D)和反思力(R)形成科学方法论闭环'
    },
    careers: ['实验物理学家', '法医鉴定专家', '数据科学家', '质量检测工程师', '临床研究医生', '审计师', '调查记者', '检测认证专家'],
    parentHighlight: '他不是"较真"，而是有着未来科学家的求证本能',
    coreStrength: '极强的逻辑推理能力和证据意识，做事严谨可靠',
    growthFocus: '在保持严谨的同时培养好奇心的广度和团队协作的柔性',
    aiAgeInsight: '当AI生成大量信息时，能辨别真伪、验证可靠性的人将不可替代',
    poetryLine: '执证据之灯照亮真相之路，以严谨之心守护事实的边界。',
    poetryQuote: '"博学之，审问之，慎思之，明辨之" ——《中庸》',
  },
  'S-L': {
    key: 'S-L', tier: 'single', dims: ['L'],
    name: '纽带核心', nameEn: 'Connection Core', icon: '🤝',
    tagline: '他是每个团队的隐形支柱',
    desc: '联结力远超同龄人，天生能感知他人需求、协调团队氛围。在任何群体中都是"粘合剂"角色，让团队运转更顺畅。',
    personalityProfile: {
      typeName: '连接关怀型',
      coreTraits: ['善于协作', '共情能力', '团队和谐'],
      wilderCorrelation: '连接力驱动社交，与表达力(E)和反思力(R)形成人文关怀闭环'
    },
    careers: ['人力资源总监', '心理咨询师', '社工', '国际NGO项目官', '调解员', '社区营造师', '教育培训师', '公益机构创始人'],
    parentHighlight: '他的社交智慧和共情能力，是未来领导力的核心根基',
    coreStrength: '天然的团队粘合剂，善于倾听、理解和连接不同的人',
    growthFocus: '在为他人服务的同时建立自我边界，培养独立思考和执行力',
    aiAgeInsight: 'AI无法替代人与人之间真实的情感连接，联结力是最"人性化"的能力',
    poetryLine: '以温暖为纽带，让每一颗心都找到归属的方向。',
    poetryQuote: '"独学而无友，则孤陋而寡闻" ——《礼记》',
  },
  'S-D': {
    key: 'S-D', tier: 'single', dims: ['D'],
    name: '蓝图大师', nameEn: 'Blueprint Master', icon: '📐',
    tagline: '他能把天马行空变成脚踏实地',
    desc: '设计力极为突出，天生的规划者和建造者。不只是想，更擅长把想法变成可执行的方案，是"从0到1"的核心人才。',
    personalityProfile: {
      typeName: '战略规划型',
      coreTraits: ['善于规划', '系统思维', '执行力强'],
      wilderCorrelation: '设计力驱动执行，与探究力(I)和反思力(R)形成战略闭环'
    },
    careers: ['建筑设计师', '产品经理', '城市规划师', '工业设计师', 'UX设计师', '项目管理专家', '创业公司CEO', '游戏关卡设计师'],
    parentHighlight: '他不是"控制欲强"，是天生的规划师——给他目标，他能设计出路径',
    coreStrength: '出色的规划力和执行力，能将复杂任务拆解为可操作步骤',
    growthFocus: '在追求完美方案的同时保持开放心态，接纳不确定性和他人意见',
    aiAgeInsight: 'AI是出色的执行者，但"设计什么值得被执行"——这需要人类的设计力',
    poetryLine: '胸中有丘壑，笔下有乾坤。将天马行空化为脚踏实地的蓝图。',
    poetryQuote: '"运筹帷幄之中，决胜千里之外" ——《史记》',
  },
  'S-E': {
    key: 'S-E', tier: 'single', dims: ['E'],
    name: '舞台之星', nameEn: 'Stage Star', icon: '🎤',
    tagline: '他能让最复杂的事变得引人入胜',
    desc: '表达力极为突出，天生的传播者和故事讲述者。能把枯燥的信息变得生动有趣，在任何需要展示的场合都光芒四射。',
    personalityProfile: {
      typeName: '魅力表达型',
      coreTraits: ['善于表达', '有感染力', '舞台魅力'],
      wilderCorrelation: '表达力驱动传播，与连接力(L)和好奇心(W)形成影响力闭环'
    },
    careers: ['新闻主播', '脱口秀演员', '品牌公关总监', '演讲教练', '知名博主/UP主', '戏剧导演', '外交官', '市场营销总监'],
    parentHighlight: '他不是"话多"，是拥有未来意见领袖的表达潜能',
    coreStrength: '超强的语言组织力和感染力，能用表达影响和带动他人',
    growthFocus: '在表达能力的基础上增加内容深度，从"说得好听"到"说得有料"',
    aiAgeInsight: 'AI能写文章但缺乏人格魅力，真正的表达力=内容×人格×临场感',
    poetryLine: '以声为笔绘世界，用故事点亮每一双求知的眼眸。',
    poetryQuote: '"言之无文，行而不远" ——《左传》',
  },
  'S-R': {
    key: 'S-R', tier: 'single', dims: ['R'],
    name: '洞察先知', nameEn: 'Insight Oracle', icon: '🧘',
    tagline: '他比同龄人多一面"认知镜"',
    desc: '反思力极为突出，拥有超越年龄的"元认知"能力。不只做事，更能"观察自己在做事"，这种自我觉察力让每次经历都有更深收获。',
    mbtiApprox: 'INFJ / INFP',
    careers: ['心理治疗师', '哲学教授', '战略咨询顾问', '正念教练', '纪录片导演', '文学评论家', '政策研究员', '人生教练'],
    parentHighlight: '他不是"想太多"，是拥有最稀缺的深度自省能力',
    coreStrength: '出色的自我觉察和总结归纳能力，能从经验中快速提炼智慧',
    growthFocus: '在深度反思的同时培养行动力，避免"想太多做太少"的陷阱',
    aiAgeInsight: 'AI可以分析数据但无法自我反思，深度反思力是人类独有的"智慧引擎"',
    poetryLine: '静水流深，以内观之镜映照万物本源。每一次沉思都在编织智慧之网。',
    poetryQuote: '"吾日三省吾身" ——《论语》',
  },

  // ========== 层级B: 双峰型 (15种) ==========
  // 前两个最高维度组合
  'D-WI': {
    key: 'D-WI', tier: 'dual', dims: ['W', 'I'],
    name: '灵动探索者', nameEn: 'Agile Explorer', icon: '🦋',
    tagline: '好奇心驱动的小小科学家',
    desc: '天生的发现者，善于提出问题并追根究底，在好奇心和科学方法间自如切换。是科学家和探险家的雏形。',
    mbtiApprox: 'ENFP / INTP',
    careers: ['自然科考纪录片导演', '科学教育主持人', '生态研究员', '创新创业者', '科技产品经理', '博物学家', '科学记者', '专利工程师'],
    parentHighlight: '好奇心+求证力是科学发现的黄金组合',
    coreStrength: '提问和验证双强，能从观察到假设到验证形成完整闭环',
    growthFocus: '培养将发现转化为成果的设计力和团队协作中的联结力',
    aiAgeInsight: '提出问题+验证答案=完整的科学思维，这是AI最需要人类指导的部分',
    poetryLine: '目光如炬探万物，巧手验真知。以科学思维编织发现之网。',
    poetryQuote: '"格物致知穷至理，观微知著见天心"',
  },
  'D-WL': {
    key: 'D-WL', tier: 'dual', dims: ['W', 'L'],
    name: '社交发现家', nameEn: 'Social Discoverer', icon: '🌐',
    tagline: '在互动中点燃灵感火花',
    desc: '在互动中发现灵感，善于连接人与知识，把好奇心传递给周围的人。是天然的社群学习推动者。',
    mbtiApprox: 'ENFJ / ESFP',
    careers: ['公益组织创始人', '教育培训师', '社区活动策划', '国际NGO工作者', '科普自媒体人', '社群运营官', '文化交流使者', '读书会主理人'],
    parentHighlight: '他的好奇心天然具有"传染力"，能带动身边人一起探索',
    coreStrength: '好奇心+社交力的组合让TA成为天然的知识分享者和学习社群核心',
    growthFocus: '在分享和互动之外培养独立深入研究的能力和项目执行力',
    aiAgeInsight: '在信息爆炸时代，能"策展+连接+分享"的人就是最佳信息中枢',
    poetryLine: '以好奇心为火种，以联结为桥梁，点燃群体探索的星星之火。',
    poetryQuote: '"三人行，必有我师焉" ——《论语》',
  },
  'D-WD': {
    key: 'D-WD', tier: 'dual', dims: ['W', 'D'],
    name: '创意建筑师', nameEn: 'Creative Architect', icon: '🏛️',
    tagline: '好奇心是他的设计灵感源泉',
    desc: '好奇心驱动的规划者，能将天马行空的想法变为可行蓝图。兼具发散思维和收敛执行力。',
    mbtiApprox: 'INTJ / ENTP',
    careers: ['产品设计师', '建筑师', '发明家', '创业公司CEO', '交互设计师', '创新咨询师', '科幻作家', '主题公园设计师'],
    parentHighlight: '他不是在"搞破坏"，是在把脑中的创意变成现实',
    coreStrength: '从灵感到蓝图，从观察到设计，天然的创造性问题解决者',
    growthFocus: '增强作品的完成度和对外展示能力，让好创意被更多人看到',
    aiAgeInsight: 'AI能辅助设计，但"什么值得被设计"的洞察力来自好奇心×设计力',
    poetryLine: '好奇心是灵感的泉眼，设计力是造物的双手。从想象到现实，只需一步。',
    poetryQuote: '"知者创物，巧者述之" ——《周礼·考工记》',
  },
  'D-WE': {
    key: 'D-WE', tier: 'dual', dims: ['W', 'E'],
    name: '故事探险家', nameEn: 'Story Adventurer', icon: '📖',
    tagline: '把每次探索变成精彩故事',
    desc: '用生动的表达分享探索发现，天生的传播者和叙事者。好奇心是素材源泉，表达力是传播载体。',
    mbtiApprox: 'ENFP / ESFJ',
    careers: ['科普作家', '纪录片编导', '短视频创作者', '演讲教练', '旅行作家', '播客主理人', '文化传播人', '品牌故事策划'],
    parentHighlight: '他的好奇心+故事力是天然的"内容创作者"基因',
    coreStrength: '能将探索发现转化为引人入胜的叙事，让知识"活"起来',
    growthFocus: '在生动表达的同时增加内容的严谨性和深度验证',
    aiAgeInsight: '人类的真实探索体验是AI无法替代的优质内容素材',
    poetryLine: '每一次探索都是一段传奇，用故事让发现跨越时空感动他人。',
    poetryQuote: '"读万卷书，行万里路" ——董其昌',
  },
  'D-WR': {
    key: 'D-WR', tier: 'dual', dims: ['W', 'R'],
    name: '深度思考者', nameEn: 'Deep Thinker', icon: '💭',
    tagline: '在沉思中寻找世界的规律',
    desc: '好奇且善于自省，在沉思中寻找答案，追求认知的深度。不满足于"知道"，更追求"理解"。',
    mbtiApprox: 'INFJ / INTP',
    careers: ['哲学研究者', '心理咨询师', '作家', '独立研究员', '冥想导师', '学术出版编辑', '文化评论家', '思想类播客主理人'],
    parentHighlight: '他的好奇心不止在外部世界，更在"为什么"和"怎么看"的深处',
    coreStrength: '好奇心+反思力让TA对世界有超越年龄的深刻理解',
    growthFocus: '将深度思考转化为行动和表达，避免停留在内心世界',
    aiAgeInsight: 'AI处理信息，人类赋予意义——深度思考者是意义的创造者',
    poetryLine: '在好奇与沉思之间，编织对世界最深邃的理解。',
    poetryQuote: '"思之思之，又重思之" ——《管子》',
  },
  'D-IL': {
    key: 'D-IL', tier: 'dual', dims: ['I', 'L'],
    name: '团队研究员', nameEn: 'Team Researcher', icon: '👥',
    tagline: '协作中的最佳求证者',
    desc: '在协作中展现卓越的求证和推理能力，能带领团队攻克难题。兼具理性和社交智慧。',
    mbtiApprox: 'ENTJ / ESTJ',
    careers: ['科研项目负责人', '实验室主管', '数据科学家', '质量工程师', '临床试验经理', '技术团队Lead', '学术合作协调人', '产业联盟秘书长'],
    parentHighlight: '他天生知道如何在团队中发挥"大脑"角色',
    coreStrength: '用严谨的求证方法+出色的团队协调力，推动集体解决复杂问题',
    growthFocus: '在团队协作中保持个人创新思维，同时增强成果展示能力',
    aiAgeInsight: '人类+AI的最佳协作模式就是：人负责验证和协调，AI负责计算和搜索',
    poetryLine: '以严谨为盾，以协作为矛，在团队中成为攻克难题的智慧引擎。',
    poetryQuote: '"众力并，则万钧不足举也" ——《淮南子》',
  },
  'D-ID': {
    key: 'D-ID', tier: 'dual', dims: ['I', 'D'],
    name: '系统分析师', nameEn: 'System Analyst', icon: '⚙️',
    tagline: '用数据和方案说话',
    desc: '善于设计验证方案，用数据说话，在求证中构建系统性理解。天生的分析型工程师。',
    mbtiApprox: 'ISTJ / INTJ',
    careers: ['系统工程师', '科研数据分析师', '产品经理', '专利工程师', '风控模型师', '算法工程师', '精算师', '量化分析师'],
    parentHighlight: '他的"数据思维"在信息时代是最抢手的底层能力',
    coreStrength: '验证+设计的组合让TA能构建完整的"假设→验证→方案"闭环',
    growthFocus: '在系统性思维之外培养沟通表达力和创新想象力',
    aiAgeInsight: '能"设计验证方案"的人才能真正驾驭AI工具，而不是被AI驾驭',
    poetryLine: '以数据为经纬，以逻辑为针线，编织最精密的认知地图。',
    poetryQuote: '"工欲善其事，必先利其器" ——《论语》',
  },
  'D-IE': {
    key: 'D-IE', tier: 'dual', dims: ['I', 'E'],
    name: '科学演说家', nameEn: 'Science Presenter', icon: '🎓',
    tagline: '让科学不再枯燥',
    desc: '能将复杂发现用生动语言传递给他人，让科学不再枯燥。是知识传播的桥梁。',
    mbtiApprox: 'ENTP / ENFJ',
    careers: ['科学传播人', '大学教授', 'TED演讲者', '科技记者', '科普视频UP主', '学术出版编辑', '教育科技产品经理', '知识付费讲师'],
    parentHighlight: '他天生能把"难懂"变成"有趣"，这是最珍贵的传播力',
    coreStrength: '严谨的探究能力+生动的表达力，天然的知识翻译者',
    growthFocus: '增强团队协作力和项目管理能力，将个人影响力扩大到组织层面',
    aiAgeInsight: '当信息过载时，能把复杂知识"翻译"成人人能懂的表达者最稀缺',
    poetryLine: '化繁为简是最高级的智慧，让科学之美绽放于每个人的心间。',
    poetryQuote: '"深入浅出，举重若轻" ——朱光潜',
  },
  'D-IR': {
    key: 'D-IR', tier: 'dual', dims: ['I', 'R'],
    name: '哲学探究者', nameEn: 'Philosophical Inquirer', icon: '📿',
    tagline: '在求证与反思的循环中接近真理',
    desc: '在求证与反思的循环中不断深化认知，追求真理。兼具科学家的严谨和哲学家的深邃。',
    mbtiApprox: 'INFP / INTP',
    careers: ['基础科研学者', '科学哲学家', '政策分析师', '独立调查记者', '伦理委员会顾问', '认知科学研究者', '批判性思维教练', '学术期刊编辑'],
    parentHighlight: '他不是"钻牛角尖"，是在进行超越年龄的深度思辨',
    coreStrength: '求证+反思的闭环让TA能持续自我迭代，越学越深',
    growthFocus: '在深度思辨之外增强行动力和社交能力，让思想产生现实影响',
    aiAgeInsight: 'AI可以处理信息但无法"反思自己的求证过程"——这是纯人类智能',
    poetryLine: '在求证与反思的往复中，抵达真理最深处的幽微之光。',
    poetryQuote: '"路漫漫其修远兮，吾将上下而求索" ——屈原',
  },
  'D-LD': {
    key: 'D-LD', tier: 'dual', dims: ['L', 'D'],
    name: '项目统筹师', nameEn: 'Project Coordinator', icon: '📋',
    tagline: '人和事，他都能安排得明明白白',
    desc: '善于组织团队和资源，推动项目有序进行。天生的领导者，兼具对人的理解和对事的规划。',
    mbtiApprox: 'ENTJ / ESTJ',
    careers: ['项目经理', '管理咨询师', '运营总监', '社会企业家', '活动策划总监', '供应链管理师', '学校教务主任', '产品运营负责人'],
    parentHighlight: '他天生就是"组织者"——给他一群人和一个目标，他能搞定',
    coreStrength: '人际协调+目标规划的组合让TA成为天然的团队领袖',
    growthFocus: '在管理能力之外培养创新思维和独立探究精神',
    aiAgeInsight: '人类管理团队的能力是AI无法替代的——AI无法理解人心',
    poetryLine: '知人善任，运筹帷幄。将团队的智慧凝聚为攻坚的力量。',
    poetryQuote: '"为政以德，譬如北辰，居其所而众星共之" ——《论语》',
  },
  'D-LE': {
    key: 'D-LE', tier: 'dual', dims: ['L', 'E'],
    name: '沟通引领者', nameEn: 'Communication Leader', icon: '🗣️',
    tagline: '用语言凝聚团队的力量',
    desc: '在团队中以表达力凝聚共识，激发他人的行动力。能准确感知群体需求并用恰当的方式传达。',
    mbtiApprox: 'ENFJ / ESFJ',
    careers: ['公关经理', '人力资源总监', '市场营销总监', '社群运营', '培训总监', '外交事务官', '客户关系经理', '品牌传播顾问'],
    parentHighlight: '他不只"能说会道"，更能"说到别人心里去"',
    coreStrength: '共情力+表达力让TA成为天然的"人际桥梁"和意见领袖',
    growthFocus: '在沟通能力之外增强逻辑分析力和独立执行力',
    aiAgeInsight: '在远程协作时代，能用语言建立信任和共识的人是组织的核心资产',
    poetryLine: '以语言为桥，以共情为基，让每一次沟通都抵达人心深处。',
    poetryQuote: '"良言一句三冬暖" ——《增广贤文》',
  },
  'D-LR': {
    key: 'D-LR', tier: 'dual', dims: ['L', 'R'],
    name: '和谐推动者', nameEn: 'Harmony Facilitator', icon: '☯️',
    tagline: '团队里最有智慧的"隐形军师"',
    desc: '善于体察他人，在团队中起到平衡作用。通过深度观察和反思，成为组织的隐性支柱。',
    mbtiApprox: 'ISFJ / INFJ',
    careers: ['心理咨询师', '社工', '调解员', '团队教练', '组织发展顾问', '家庭治疗师', '冲突解决专家', '幸福学研究者'],
    parentHighlight: '他的"安静"不是内向，是在深度感知和理解整个环境',
    coreStrength: '共情+反思让TA能看到团队中"没说出口的需求"',
    growthFocus: '在关注他人的同时建立自我主张能力，勇于表达自己的观点',
    aiAgeInsight: '理解人心+持续反思=最好的领导力教练，这是AI永远学不会的',
    poetryLine: '润物无声，以觉察之心守护团队的平衡与和谐。',
    poetryQuote: '"上善若水，水善利万物而不争" ——《道德经》',
  },
  'D-DE': {
    key: 'D-DE', tier: 'dual', dims: ['D', 'E'],
    name: '策划演绎家', nameEn: 'Strategic Performer', icon: '🎬',
    tagline: '精心策划，精彩呈现',
    desc: '能将周密计划以精彩方式呈现，兼具策略和表现力。是天然的导演和制片人。',
    mbtiApprox: 'ENTJ / ENFP',
    careers: ['品牌策划总监', '活动导演', '广告创意人', '游戏设计师', '展览策划师', '影视制片人', '商业提案专家', '综艺节目策划'],
    parentHighlight: '他不只有好点子，更能把好点子"包装"成让人眼前一亮的作品',
    coreStrength: '规划力+展现力让TA的每个项目都既有深度又有亮点',
    growthFocus: '增强探究深度和团队协作力，让策划内容更有学术含金量',
    aiAgeInsight: '策划+演绎=人类独有的"创意包装"能力，AI能辅助但无法主导',
    poetryLine: '精心策划每一个细节，让呈现的瞬间惊艳所有目光。',
    poetryQuote: '"凡事预则立，不预则废" ——《礼记》',
  },
  'D-DR': {
    key: 'D-DR', tier: 'dual', dims: ['D', 'R'],
    name: '精益优化师', nameEn: 'Lean Optimizer', icon: '🔧',
    tagline: '做一次就要比上一次更好',
    desc: '在反思中不断优化方案，追求卓越品质。每次执行都是一次学习和升级的机会。',
    mbtiApprox: 'ISTJ / INTJ',
    careers: ['质量管理工程师', '精益生产专家', '软件架构师', '风控分析师', '标准化顾问', '运营优化师', '工艺改进工程师', '绩效管理专家'],
    parentHighlight: '他对"更好"的追求不是完美主义，是持续优化的工程师思维',
    coreStrength: '设计+反思的闭环让TA在实践中越做越精，效率和质量持续提升',
    growthFocus: '在追求优化的同时保持创新探索的勇气，避免过度保守',
    aiAgeInsight: '优化是AI擅长的，但"知道该优化什么"需要人类的反思和判断',
    poetryLine: '每一次打磨都是一次超越，在反复推敲中抵达卓越。',
    poetryQuote: '"如切如磋，如琢如磨" ——《诗经》',
  },
  'D-ER': {
    key: 'D-ER', tier: 'dual', dims: ['E', 'R'],
    name: '表达修行者', nameEn: 'Expressive Reflector', icon: '✍️',
    tagline: '每次表达都是一次自我超越',
    desc: '善于通过复盘提升表达的深度和感染力，不断精进表达艺术。是天然的文学家和思想者。',
    mbtiApprox: 'INFP / ENFP',
    careers: ['文学创作者', '纪录片导演', '演员/导演', '自媒体作者', '编剧', '诗人', '散文家', '口述历史记录者'],
    parentHighlight: '他的表达不是"嘴皮子功夫"，是经过深度思考的真诚输出',
    coreStrength: '表达+反思让TA的每次发言都比上次更有深度和感染力',
    growthFocus: '在个人表达之外增强系统性探究和团队协作能力',
    aiAgeInsight: '有深度、有温度、有反思的人类表达，是AI文字永远无法企及的',
    poetryLine: '以笔为心，以思为墨，每一次表达都是灵魂的淬炼与绽放。',
    poetryQuote: '"文章千古事，得失寸心知" ——杜甫',
  },

  // ========== 层级C: 三峰型 (8种) ==========
  // 前三个维度形成集群 (top3间距 ≤ 10, top3-top4 ≥ 15)
  'T-WIL': {
    key: 'T-WIL', tier: 'triple', dims: ['W', 'I', 'L'],
    name: '全能探索家', nameEn: 'Universal Explorer', icon: '🌍',
    tagline: '好奇、求证、合作——探索世界的完美三角',
    desc: '好奇心、探究力、联结力三维均强。既能提出好问题，又能设计验证方案，还能发动团队一起探索。是科学探险队的天然队长。',
    mbtiApprox: 'ENTP / ENFJ',
    careers: ['科考队队长', '综合研究项目负责人', '科普教育创业者', '自然保护区管理者', '跨学科研究协调人', '科学节策展人', '探险旅行设计师', '知识社区创始人'],
    parentHighlight: '他是稀有的"全能型探索者"——既有好奇心，又有方法论，还能团队协作',
    coreStrength: '三维协同让TA能独立发起和推动完整的探索项目',
    growthFocus: '培养将发现转化为产出的设计力和对外展示的表达力',
    aiAgeInsight: '综合型人才在AI时代反而更稀缺——AI擅长单项，人类擅长综合',
    poetryLine: '好奇、求证、协作——三维共振，开启探索世界的完美旅程。',
    poetryQuote: '"仰以观于天文，俯以察于地理" ——《周易》',
  },
  'T-WID': {
    key: 'T-WID', tier: 'triple', dims: ['W', 'I', 'D'],
    name: '创新实验家', nameEn: 'Innovation Lab', icon: '🧪',
    tagline: '从灵感到原型，他一个人就是一支研发团队',
    desc: '好奇心、探究力、设计力三维均强。能从观察中发现问题，用实验验证，再设计出解决方案。天生的发明家。',
    mbtiApprox: 'INTP / INTJ',
    careers: ['研发工程师', '发明家', '科技创业者', '实验设计师', '专利策略师', '创新实验室主管', '原型设计师', 'DeepTech创始人'],
    parentHighlight: '他的脑子里有一个完整的"创新工厂"——从问题到解决方案',
    coreStrength: '观察→求证→设计的完整创新链条，是最具工程师潜质的组合',
    growthFocus: '增强团队协作力和表达展示能力，让发明被更多人看到和使用',
    aiAgeInsight: '人类发明家+AI助手=超级创新引擎，这是最有价值的人机协作模式',
    poetryLine: '从灵感到原型，从假设到验证。一个人的创新实验室已然启动。',
    poetryQuote: '"致知在格物，物格而后知至" ——《大学》',
  },
  'T-IDR': {
    key: 'T-IDR', tier: 'triple', dims: ['I', 'D', 'R'],
    name: '策略领航者', nameEn: 'Strategic Navigator', icon: '🧭',
    tagline: '逻辑严密，方案稳健，每一步都有算计',
    desc: '探究力、设计力、反思力三维均强。做事极其严谨，验证后规划，执行后反思，形成持续优化的完美闭环。',
    mbtiApprox: 'ISTJ / INTJ',
    careers: ['战略咨询顾问', '投资分析师', '技术总监(CTO)', '政策研究员', '风险管理专家', '系统架构师', '精算师', '智库研究员'],
    parentHighlight: '他可能是你见过的"最有章法"的孩子——每一步都经过思考',
    coreStrength: '验证→规划→优化的铁三角，让TA在复杂问题上表现卓越',
    growthFocus: '在理性分析之外发展好奇心的广度和人际互动的柔性',
    aiAgeInsight: '能"设计策略+验证效果+持续优化"的人是AI时代的最佳决策者',
    poetryLine: '以严谨为帆，以策略为舵，在复杂迷局中精准领航。',
    poetryQuote: '"审时度势，因势利导" ——《孙子兵法》',
  },
  'T-WLE': {
    key: 'T-WLE', tier: 'triple', dims: ['W', 'L', 'E'],
    name: '社交催化剂', nameEn: 'Social Catalyst', icon: '🔆',
    tagline: '用好奇心和表达力点燃整个群体',
    desc: '好奇心、联结力、表达力三维均强。能在群体中发起探索话题，用魅力感染他人参与，是最好的学习社群发起人。',
    mbtiApprox: 'ENFP / ENFJ',
    careers: ['社群发起人', '文化策展人', '教育创新创业者', '活动主持人', 'TEDx组织者', '社交媒体运营总监', '品牌大使', '知识IP运营'],
    parentHighlight: '他不只自己好奇，还能带动一群人一起好奇——这是领袖基因',
    coreStrength: '好奇心×联结力×表达力=最强的群体学习催化剂',
    growthFocus: '在社交能力之外培养独立深入钻研和规划执行的能力',
    aiAgeInsight: '在注意力经济时代，能"创造话题+连接社群+精彩表达"的人=流量密码',
    poetryLine: '用好奇点燃话题，用魅力凝聚社群，让探索成为一场共振盛宴。',
    poetryQuote: '"独乐乐不如众乐乐" ——《孟子》',
  },
  'T-WIR': {
    key: 'T-WIR', tier: 'triple', dims: ['W', 'I', 'R'],
    name: '内驱型学者', nameEn: 'Self-Driven Scholar', icon: '📚',
    tagline: '他学习不是为了分数，是因为真的想知道',
    desc: '好奇心、探究力、反思力三维均强。学习完全由内在动力驱动，能自主形成"提问→求证→反思→更深提问"的进阶循环。',
    mbtiApprox: 'INTP / INFJ',
    careers: ['基础科学研究者', '大学教授', '独立学者', '智库分析师', '科学史研究者', '认知科学家', '学术期刊主编', '诺贝尔级研究者'],
    parentHighlight: '他有着科学家最核心的特质——纯粹的求知欲和严谨的自我反思',
    coreStrength: '内驱型学习闭环=终身学习者的核心引擎，他会越学越强',
    growthFocus: '增强对外表达和团队协作能力，让学术成果产生社会影响',
    aiAgeInsight: '自驱力+深度思考=人类认知能力的最高形态，AI永远只是工具',
    poetryLine: '纯粹的求知欲驱动每一步探索，在问与思的循环中不断攀登认知高峰。',
    poetryQuote: '"知之者不如好之者，好之者不如乐之者" ——《论语》',
  },
  'T-DLE': {
    key: 'T-DLE', tier: 'triple', dims: ['D', 'L', 'E'],
    name: '实践建造者', nameEn: 'Practical Builder', icon: '🏗️',
    tagline: '组织团队，设计方案，精彩展示——全流程通关',
    desc: '设计力、联结力、表达力三维均强。不仅能规划项目、协调团队，还能精彩地展示成果。天生的项目制学习明星。',
    mbtiApprox: 'ENTJ / ENFJ',
    careers: ['创业公司CEO', '产品总监', '项目群经理', '品牌运营负责人', '教育科技创始人', '商业活动制片人', '企业内训师', 'COO首席运营官'],
    parentHighlight: '他是班级里的"万能胶"——什么项目交给他都能组织好、展示好',
    coreStrength: '规划+协作+展示的全链条能力让TA在项目制学习中碾压同龄人',
    growthFocus: '在执行力之外培养好奇心驱动的创新思维和深度反思能力',
    aiAgeInsight: '能"设计+组织+呈现"的综合型人才是AI时代组织的核心管理者',
    poetryLine: '规划、协作、呈现——三位一体，让每个项目都成为精彩的交响曲。',
    poetryQuote: '"天行健，君子以自强不息" ——《周易》',
  },
  'T-LER': {
    key: 'T-LER', tier: 'triple', dims: ['L', 'E', 'R'],
    name: '感知协调者', nameEn: 'Sensory Coordinator', icon: '🎭',
    tagline: '他能读懂房间里每个人的心情',
    desc: '联结力、表达力、反思力三维均强。有极强的人际感知力和沟通智慧，能用语言治愈和激励他人。是天然的心灵导师。',
    mbtiApprox: 'INFJ / ENFJ',
    careers: ['心理治疗师', '团队教练', '谈判专家', '调解仲裁人', '演讲培训师', '组织行为学教授', '领导力教练', '品牌人格化顾问'],
    parentHighlight: '他对"人"的理解力和沟通力远超同龄人，这是最珍贵的情商优势',
    coreStrength: '感知+表达+反思让TA能深入理解他人并给出最恰当的回应',
    growthFocus: '在人际智慧之外培养科学探究精神和项目规划执行力',
    aiAgeInsight: '深度理解人性的能力是AI永远无法习得的——这是最"人"的核心竞争力',
    poetryLine: '感知每一缕情绪的涟漪，用温暖的洞察守护人心的柔软。',
    poetryQuote: '"知人者智，自知者明" ——《道德经》',
  },
  'T-WDE': {
    key: 'T-WDE', tier: 'triple', dims: ['W', 'D', 'E'],
    name: '创想工程师', nameEn: 'Creative Engineer', icon: '🚀',
    tagline: '敢想、能做、会秀——创新全才',
    desc: '好奇心、设计力、表达力三维均强。不仅有源源不断的创意灵感，还能把它变成产品，并精彩地"卖"出去。',
    mbtiApprox: 'ENTP / ENTJ',
    careers: ['科技创业者', '创意总监', '产品设计+运营一体化', '发布会演讲者', '创新加速器导师', 'Maker Space创始人', '设计思维教练', '众筹项目发起人'],
    parentHighlight: '他有着乔布斯式的特质——好奇心×设计力×展示力的黄金三角',
    coreStrength: '灵感→产品→发布的全链条创新能力，是最具创业者潜质的组合',
    growthFocus: '增强严谨求证和团队协作能力，让创新更有深度和可持续性',
    aiAgeInsight: '创意+产品化+传播力=AI时代的超级个体，一个人就是一家公司',
    poetryLine: '敢想、能做、会秀。从灵感迸发到惊艳亮相，创新的全旅程尽在掌握。',
    poetryQuote: '"苟日新，日日新，又日新" ——《礼记》',
  },

  // ========== 层级D: 特殊型 (1种) ==========
  'X-BAL': {
    key: 'X-BAL', tier: 'special', dims: [],
    name: '潜能绽放者', nameEn: 'Potential Bloomer', icon: '🌱',
    tagline: '均衡发展，潜力无限——等待那个"引爆点"',
    desc: '六维度发展相对均衡，各方面都具备不错的基础。这类孩子的关键不是"补短板"，而是通过丰富的体验找到真正"眼睛发光"的领域。',
    mbtiApprox: '待深入评估',
    careers: ['根据兴趣深入探索', '综合管理人才', '跨学科研究者', '全栈工程师', '自由职业者', '斜杠创业者', '教育工作者', '通才型顾问'],
    parentHighlight: '均衡不是没潜能，是潜能在等待被激活——关键是给TA足够多的体验',
    coreStrength: '适应性强、学习面广，基础扎实，具备多方向发展的潜力',
    growthFocus: '通过多元体验找到最热爱的方向，然后集中精力深入突破',
    aiAgeInsight: '在VUCA时代，均衡发展的适应性恰恰是一种"反脆弱"优势',
    poetryLine: '六维均衡，潜力如种。等待一场春风，便是满园芬芳。',
    poetryQuote: '"博观而约取，厚积而薄发" ——苏轼',
  },
}

// ==================== 匹配算法 ====================

/**
 * 三层分型匹配算法 v2.0 — 竞争性匹配得分模型
 * 为每种分型计算匹配得分（0-100），选择得分最高的分型
 * 消除硬阈值的"悬崖效应"，边界案例过渡更平滑
 */
export function matchTalentType30(
  wilderPcts: Record<string, number>
): { key: string; talent: TalentType30; matchReason: string; matchConfidence?: number } {
  const dims = ['W', 'I', 'L', 'D', 'E', 'R']
  const sorted = [...dims].sort((a, b) => (wilderPcts[b] || 0) - (wilderPcts[a] || 0))
  const scores = sorted.map(d => wilderPcts[d] || 0)

  const gap = scores[0] - scores[1]
  const top3Spread = scores[0] - scores[2]
  const top3BottomGap = scores[2] - scores[3]
  const range = scores[0] - scores[scores.length - 1]

  // ---- 计算各分型匹配得分 ----

  // 单峰得分: gap 15-22 线性插值, >=22 满分
  const singlePeakScore = gap >= 22 ? 100 : gap >= 15 ? Math.round((gap - 15) / 7 * 100) : 0

  // 三峰得分: spread 0-18 + gap 10+ (放宽条件)
  let tripleScore = 0
  if (top3Spread <= 18 && top3BottomGap >= 10) {
    tripleScore = Math.round(
      ((18 - top3Spread) / 18) * 60 + (Math.min(top3BottomGap, 25) / 25) * 40
    )
  }

  // 均衡得分: range < 20 开始计分
  const balancedScore = range < 20 ? Math.round((20 - range) / 20 * 100) : 0

  // 双峰得分: 基础50分，双峰间差距过大时扣分，平均分低时扣分
  const dualGapPenalty = Math.min(30, Math.abs(scores[0] - scores[1]))
  const dualAvg = (scores[0] + scores[1]) / 2
  const dualAvgPenalty = dualAvg < 50 ? Math.round((50 - dualAvg) / 50 * 20) : 0
  const dualScore = Math.max(0, 50 - dualGapPenalty - dualAvgPenalty)

  // ---- 选择最优匹配 ----
  type Candidate = { type: 'single' | 'triple' | 'dual' | 'balanced'; score: number }
  const candidates: Candidate[] = [
    { type: 'single', score: singlePeakScore },
    { type: 'triple', score: tripleScore },
    { type: 'dual', score: dualScore },
    { type: 'balanced', score: balancedScore },
  ]
  candidates.sort((a, b) => b.score - a.score)
  const best = candidates[0]

  // ---- 按最优分型生成结果 ----

  if (best.type === 'single' && best.score > 0) {
    const key = `S-${sorted[0]}`
    if (TALENT_TYPES_30[key]) {
      return {
        key,
        talent: TALENT_TYPES_30[key],
        matchReason: `${sorted[0]}维度(${scores[0]}%)显著领先第二维度(${scores[1]}%)，差距${gap}%`,
        matchConfidence: best.score,
      }
    }
  }

  if (best.type === 'triple' && best.score > 0) {
    const triKey = sorted.slice(0, 3).sort().join('')
    const triMatch = Object.values(TALENT_TYPES_30).find(
      t => t.tier === 'triple' && [...t.dims].sort().join('') === triKey
    )
    if (triMatch) {
      return {
        key: triMatch.key,
        talent: triMatch,
        matchReason: `${sorted.slice(0, 3).join('+')}三维度形成优势集群(${scores.slice(0, 3).join('/')})，与第四维度差距${top3BottomGap}%`,
        matchConfidence: best.score,
      }
    }
  }

  if (best.type === 'balanced' && best.score > 0) {
    return {
      key: 'X-BAL',
      talent: TALENT_TYPES_30['X-BAL'],
      matchReason: `六维度差距仅${range}%，整体发展较为均衡`,
      matchConfidence: best.score,
    }
  }

  // 双峰匹配（默认 fallback 或 best.type === 'dual'）
  const dualKey1 = `D-${sorted[0]}${sorted[1]}`
  const dualKey2 = `D-${sorted[1]}${sorted[0]}`
  if (TALENT_TYPES_30[dualKey1]) {
    return {
      key: dualKey1,
      talent: TALENT_TYPES_30[dualKey1],
      matchReason: `${sorted[0]}(${scores[0]}%)+${sorted[1]}(${scores[1]}%)为最强双维度组合`,
      matchConfidence: Math.max(dualScore, 30),
    }
  }
  if (TALENT_TYPES_30[dualKey2]) {
    return {
      key: dualKey2,
      talent: TALENT_TYPES_30[dualKey2],
      matchReason: `${sorted[1]}(${scores[1]}%)+${sorted[0]}(${scores[0]}%)为最强双维度组合`,
      matchConfidence: Math.max(dualScore, 30),
    }
  }

  // 最终 Fallback
  return {
    key: 'X-BAL',
    talent: TALENT_TYPES_30['X-BAL'],
    matchReason: '综合评估后归入潜能绽放者',
    matchConfidence: 20,
  }
}

// ==================== 728画像×潜能类型 交叉增强 ====================

export interface CrossMatchResult {
  talentKey: string
  profileCode: string            // HML编码如"HMH-LMH"
  variantId: number              // T001-T729
  uniqueInsights: string[]       // 该组合独有的洞察
  strengthModifiers: string[]    // 基于画像等级的优势修正
  riskModifiers: string[]        // 基于画像等级的风险修正
  parentFocusAreas: string[]     // 家长关注重点
}

/**
 * 潜能类型×学习画像交叉匹配
 * 同一潜能类型下，不同HML画像产生差异化洞察
 */
export function crossMatchProfile(
  talentKey: string,
  levels: Record<string, number>, // 1=Low, 2=Mid, 3=High
  wilderPcts: Record<string, number>,
  variantId: number,
): CrossMatchResult {
  const talent = TALENT_TYPES_30[talentKey]
  if (!talent) {
    return {
      talentKey, profileCode: '', variantId,
      uniqueInsights: [], strengthModifiers: [], riskModifiers: [], parentFocusAreas: [],
    }
  }

  const dims = ['W', 'I', 'L', 'D', 'E', 'R']
  const levelCode = dims.map(d => levels[d] === 3 ? 'H' : levels[d] === 2 ? 'M' : 'L')
  const profileCode = `${levelCode.slice(0, 3).join('')}-${levelCode.slice(3).join('')}`

  const uniqueInsights: string[] = []
  const strengthModifiers: string[] = []
  const riskModifiers: string[] = []
  const parentFocusAreas: string[] = []

  const DIM_NAMES: Record<string, string> = {
    W: '好奇心', I: '探究力', L: '联结力', D: '设计力', E: '表达力', R: '反思力',
  }

  // 核心维度是否全部达到高水平
  const coreDimsAllHigh = talent.dims.every(d => levels[d] === 3)
  const coreDimsHasLow = talent.dims.some(d => levels[d] === 1)

  if (coreDimsAllHigh) {
    uniqueInsights.push(`核心维度${talent.dims.join('+')}全部达到高水平——这是${talent.name}的"满星"形态`)
    strengthModifiers.push(`潜能特征将以最充分的方式呈现，建议直接进入进阶挑战`)
  } else if (coreDimsHasLow) {
    const lowCoreDims = talent.dims.filter(d => levels[d] === 1)
    uniqueInsights.push(`虽然整体匹配${talent.name}画像，但${lowCoreDims.map(d => DIM_NAMES[d]).join('、')}维度尚处基础阶段——属于"潜力型"，需重点培养`)
    riskModifiers.push(`核心维度中${lowCoreDims.join('+')}偏低，可能在该方向上遇到瓶颈，需针对性训练`)
  }

  // 非核心维度的异常高分 → 独特交叉洞察
  const nonCoreDims = dims.filter(d => !talent.dims.includes(d))
  nonCoreDims.forEach(d => {
    if (levels[d] === 3) {
      uniqueInsights.push(`${DIM_NAMES[d]}维度意外达到高水平——这让TA在${talent.name}基础上多了一个独特的"加分项"`)
      strengthModifiers.push(`可以利用${DIM_NAMES[d]}优势来强化${talent.name}的核心能力表达`)
    }
    if (levels[d] === 1 && wilderPcts[d] < 25) {
      riskModifiers.push(`${DIM_NAMES[d]}维度偏低(${wilderPcts[d]}%)，需要关注是否影响日常学习`)
      parentFocusAreas.push(`关注${DIM_NAMES[d]}的日常表现，通过小训练逐步提升`)
    }
  })

  // 家长关注重点 (基于画像独特组合)
  parentFocusAreas.push(talent.parentHighlight)
  if (levels['E'] === 1) parentFocusAreas.push('表达力偏低——多创造安全的表达场景，鼓励"说出来"')
  if (levels['L'] === 1) parentFocusAreas.push('联结力偏低——不要急于扩大社交圈，先从1-2个深度关系开始')
  if (levels['R'] === 1) parentFocusAreas.push('反思力偏低——每天睡前"今日三问"是最简单有效的训练')
  if (levels['D'] === 1) parentFocusAreas.push('设计力偏低——用"番茄钟"帮TA从小任务开始建立完成感')

  return {
    talentKey,
    profileCode,
    variantId,
    uniqueInsights,
    strengthModifiers,
    riskModifiers,
    parentFocusAreas,
  }
}

// ==================== 辅助函数 ====================

/** 获取所有潜能类型列表 */
export function getAllTalentTypes(): TalentType30[] {
  return Object.values(TALENT_TYPES_30)
}

/** 获取指定层级的潜能类型 */
export function getTalentsByTier(tier: TalentTier): TalentType30[] {
  return Object.values(TALENT_TYPES_30).filter(t => t.tier === tier)
}

/** 检查是否可以扩展新类型 (扩展机制) */
export function registerTalentType(type: TalentType30): boolean {
  if (TALENT_TYPES_30[type.key]) return false // 已存在
  TALENT_TYPES_30[type.key] = type
  return true
}
