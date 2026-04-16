// ===================================================================
// WILDER 教育学家虚拟专家博弈引擎 v1.0
// 基于10位历史教育学家的教育理论，针对孩子测评结果
// 进行多专家视角的深度分析与圆桌讨论
// ===================================================================

// ========== 类型定义 ==========

export interface EducatorProfile {
  id: string
  name: string
  nameEn: string
  era: string
  avatar: string // 用emoji表示
  coreTheory: string
  specialtyDomains: string[]
  wilderFocus: string[] // 主要关注的WILDER维度
  perspectiveStyle: string // 发言风格
  keyPrinciples: string[]
}

export interface EducatorDialogue {
  round: number // 1-3
  speakerId: string
  speakerName: string
  speakerAvatar: string
  type: 'observation' | 'suggestion' | 'debate' | 'consensus'
  content: string
  targetDimensions: string[]
  respondingTo?: string // 回应哪位学家ID
  agreement?: 'agree' | 'partially' | 'alternative'
}

export interface ConsensusPoint {
  title: string
  supporters: string[] // 支持的学家名字
  recommendation: string
  rationale: string
}

export interface DivergencePoint {
  topic: string
  perspectives: { educatorId: string; educatorName: string; position: string }[]
  parentGuidance: string
}

export interface ActionItem {
  priority: 'high' | 'medium' | 'low'
  action: string
  source: string // 来自哪位学家名字
  timeframe: '本周' | '1个月内' | '长期'
  targetDim: string // WILDER维度字母
}

export interface EducatorPanelResult {
  sessionTitle: string
  childProfile: string
  dialogues: EducatorDialogue[]
  consensusPoints: ConsensusPoint[]
  divergencePoints: DivergencePoint[]
  finalRecommendation: string
  actionPlan: ActionItem[]
}

// ========== WILDER维度中文名映射 ==========

const WILDER_DIM_NAMES: Record<string, string> = {
  W: '好奇心',
  I: '探究力',
  L: '连接力',
  D: '设计力',
  E: '表达力',
  R: '反思力'
}

// ========== 十位教育学家知识库 ==========

export const EDUCATORS: EducatorProfile[] = [
  {
    id: 'montessori',
    name: '蒙台梭利',
    nameEn: 'Maria Montessori',
    era: '1870-1952',
    avatar: '🏛️',
    coreTheory: '自主学习与敏感期教育——儿童拥有内在的学习驱动力，教育应创造适宜的预备环境',
    specialtyDomains: ['早期感官教育', '自主学习环境设计', '儿童注意力培养', '日常生活技能训练'],
    wilderFocus: ['W', 'I'],
    perspectiveStyle: '温和而坚定，常以观察儿童的故事引入，强调"跟随儿童"的理念',
    keyPrinciples: [
      '尊重儿童的自然发展节奏',
      '提供"准备好的环境"',
      '强调感官教育与动手操作',
      '教师的角色是观察者而非主导者'
    ]
  },
  {
    id: 'dewey',
    name: '杜威',
    nameEn: 'John Dewey',
    era: '1859-1952',
    avatar: '🔧',
    coreTheory: '做中学与民主教育——教育即生活，学校即社会，真实经验是学习的核心',
    specialtyDomains: ['项目式学习设计', '真实情境问题解决', '跨学科整合课程', '民主参与式教学'],
    wilderFocus: ['I', 'D'],
    perspectiveStyle: '务实而开放，善于联系生活实例，强调教育与社会的联结',
    keyPrinciples: [
      '教育即生活，学校即社会',
      '从做中学(Learning by Doing)',
      '以儿童兴趣为中心的课程设计',
      '思维五步法解决真实问题'
    ]
  },
  {
    id: 'piaget',
    name: '皮亚杰',
    nameEn: 'Jean Piaget',
    era: '1896-1980',
    avatar: '🔬',
    coreTheory: '认知发展阶段与知识建构——儿童是知识的主动建构者，学习通过同化与顺应实现',
    specialtyDomains: ['认知发展评估', '儿童思维特点分析', '概念形成过程研究', '逻辑推理能力培养'],
    wilderFocus: ['I', 'R'],
    perspectiveStyle: '严谨而敏锐，擅长用认知科学的视角分析儿童行为，注重阶段性特征',
    keyPrinciples: [
      '认知发展具有阶段性特征',
      '同化与顺应是学习的机制',
      '儿童是知识的主动建构者',
      '认知冲突促进思维发展'
    ]
  },
  {
    id: 'vygotsky',
    name: '维果茨基',
    nameEn: 'Lev Vygotsky',
    era: '1896-1934',
    avatar: '🤝',
    coreTheory: '最近发展区与脚手架理论——社会互动是认知发展的基础，学习发生在ZPD区域',
    specialtyDomains: ['协作学习设计', '差异化教学策略', '语言与思维发展', '支架式教学实施'],
    wilderFocus: ['L', 'I'],
    perspectiveStyle: '热情而富有建设性，强调合作与引导的力量，善于发现儿童的潜能',
    keyPrinciples: [
      '社会互动是认知发展的基础',
      '最近发展区(ZPD)是教学的最佳区域',
      '语言是思维发展的工具',
      '更有能力的他人提供脚手架支持'
    ]
  },
  {
    id: 'froebel',
    name: '福禄贝尔',
    nameEn: 'Friedrich Fröbel',
    era: '1782-1852',
    avatar: '🎨',
    coreTheory: '游戏教育与恩物理论——游戏是儿童发展的最高阶段，教育应顺应儿童的神性本质',
    specialtyDomains: ['游戏化课程设计', '创造性活动组织', '早期艺术启蒙', '自然教育实施'],
    wilderFocus: ['W', 'E'],
    perspectiveStyle: '充满诗意与创造力，相信每个孩子都蕴含着宇宙的奥秘',
    keyPrinciples: [
      '游戏是儿童发展的最高阶段',
      '恩物是连接内外世界的媒介',
      '教育应顺应儿童的神性本质',
      '活动与创造是学习的核心'
    ]
  },
  {
    id: 'rousseau',
    name: '卢梭',
    nameEn: 'Jean-Jacques Rousseau',
    era: '1712-1778',
    avatar: '🌿',
    coreTheory: '自然教育论——儿童天性本善，教育应顺应自然，保护儿童的纯真与天性',
    specialtyDomains: ['自然教育实施', '儿童天性保护', '消极教育策略', '自由发展引导'],
    wilderFocus: ['W', 'R'],
    perspectiveStyle: '理想主义而深刻，崇尚自然与自由，反对过早的知识灌输',
    keyPrinciples: [
      '儿童天性本善，教育应保护而非扭曲',
      '自然是最好的老师',
      '消极教育——不急于教导，让儿童自然成长',
      '尊重儿童的独特节奏和内在时间表'
    ]
  },
  {
    id: 'comenius',
    name: '夸美纽斯',
    nameEn: 'John Amos Comenius',
    era: '1592-1670',
    avatar: '📖',
    coreTheory: '泛智教育与直观教学——把一切知识教给一切人，强调循序渐进与直观感知',
    specialtyDomains: ['系统课程设计', '直观教学方法', '循序渐进教学', '普及教育理念'],
    wilderFocus: ['E', 'D'],
    perspectiveStyle: '系统而有序，强调教学的科学性与可操作性，追求教育的普及与民主',
    keyPrinciples: [
      '泛智教育——把一切知识教给一切人',
      '直观教学——从具体到抽象',
      '循序渐进——由易到难、由近及远',
      '教育适应自然原则'
    ]
  },
  {
    id: 'herbart',
    name: '赫尔巴特',
    nameEn: 'Johann Friedrich Herbart',
    era: '1776-1841',
    avatar: '📐',
    coreTheory: '四段教学法与兴趣培养——教学应激发多方面兴趣，形成道德品格',
    specialtyDomains: ['系统教学法设计', '兴趣培养策略', '道德教育实施', '课程科学化'],
    wilderFocus: ['D', 'R'],
    perspectiveStyle: '严谨而有序，强调教学过程的科学化与规范化',
    keyPrinciples: [
      '四段教学法：明了、联想、系统、方法',
      '教育的最高目的是培养道德品格',
      '多方面兴趣是教学的基础',
      '教学应具有教育性'
    ]
  },
  {
    id: 'sukhomlinsky',
    name: '苏霍姆林斯基',
    nameEn: 'Vasyl Sukhomlynsky',
    era: '1918-1970',
    avatar: '💝',
    coreTheory: '全面和谐发展教育——培养真正的人，德智体美劳全面发展',
    specialtyDomains: ['自然教育实施', '阅读习惯培养', '道德情感教育', '家校社协同育人'],
    wilderFocus: ['L', 'R'],
    perspectiveStyle: '温暖而深情，强调爱与关怀是教育的灵魂，重视阅读与自然的力量',
    keyPrinciples: [
      '教育的核心是培养真正的人',
      '德智体美劳全面发展',
      '大自然是最好的课堂',
      '阅读是精神成长的源泉'
    ]
  },
  {
    id: 'tao',
    name: '陶行知',
    nameEn: 'Tao Xingzhi',
    era: '1891-1946',
    avatar: '🌾',
    coreTheory: '生活教育理论——生活即教育，社会即学校，教学做合一',
    specialtyDomains: ['生活化课程设计', '实践教育实施', '小先生制推广', '社会教育整合'],
    wilderFocus: ['I', 'L'],
    perspectiveStyle: '朴实而有力，强调实践与生活是教育的源头活水',
    keyPrinciples: [
      '生活即教育——教育来源于生活',
      '社会即学校——打破学校与社会的围墙',
      '教学做合一——在做中学，在学中做',
      '小先生制——儿童互教互学'
    ]
  }
]

// ========== 观察模板库 ==========
// 为每位学家 x 6个WILDER维度 x 3个档位创建观察模板

type ObservationFn = (name: string) => string

const EDUCATOR_OBSERVATIONS: Record<string, Record<string, Record<string, ObservationFn>>> = {
  // ==================== 蒙台梭利 ====================
  montessori: {
    W: {
      high: (name) => `${name}展现出强烈的内在求知欲——这正是我所说的"吸收性心智"的最好体现。这个孩子天生就像海绵一样渴望汲取知识，我们要做的不是灌输，而是为TA创造一个丰富的"预备环境"，让TA自由选择想要探索的领域。建议在家中设置一个专属的"探索角"，放置多样化的探索材料，让${name}按照自己的节奏和兴趣去发现。`,
      mid: (name) => `${name}的好奇心正在萌发中。在我的教室里，这类孩子需要更多的"敏感期引导"——找到TA当前最感兴趣的那个点，然后在那个点上提供丰富的探索材料。不要急于扩展，先让${name}在一个领域深入体验到发现的喜悦，内在的动力会自然生长。`,
      low: (name) => `${name}目前的探索欲望较为含蓄，但请不要着急。在我多年的观察中，很多孩子并非缺乏好奇心，而是还没遇到能点燃TA的那个"火花"。我建议创造一个完全没有评判、没有对错的自由探索空间，让${name}自己选择感兴趣的事物，哪怕只是静静观察一只蚂蚁，也是珍贵的探索。`
    },
    I: {
      high: (name) => `${name}的探究能力令人印象深刻。这种"有目的的工作"正是儿童内在发展动力的体现。我建议提供更多开放性的探究材料——不是告诉${name}该做什么，而是创造条件让TA自己发现问题、设计实验、得出结论。这种自主探究的体验，会成为终身学习的根基。`,
      mid: (name) => `${name}的探究力正处于发展阶段。在蒙台梭利教室中，我们会为这类孩子提供"有结构的自由"——既有明确的操作步骤引导，又留有足够的自主探索空间。可以从日常生活中的小实验开始培养${name}的探究习惯，比如观察植物的生长变化。`,
      low: (name) => `${name}在探究方面需要更多的支持。我的建议是从感官体验入手——触摸、观察、比较。让${name}先通过身体去感知世界，而不是急于进入抽象的探究。感官经验是一切探究的基础，当TA积累了足够的感知素材，探究的种子自然会发芽。`
    },
    L: {
      high: (name) => `${name}展现出很好的社交协作能力。在混龄教室中，这类孩子常常自然而然地成为"小老师"。我建议给${name}更多帮助弟弟妹妹或同伴的机会——教导他人是最深层次的学习，同时也是建立自信和社交技能的最佳途径。`,
      mid: (name) => `${name}的社交能力正在发展中。在我的教室里，我们通过"共同工作"的方式自然促进合作——不是强制分组，而是创造需要合作才能完成的有趣任务。让${name}在实践中体验合作的乐趣，社交能力会自然生长。`,
      low: (name) => `${name}在社交方面偏好独处，这完全正常。在蒙台梭利环境中，我们尊重每个孩子的社交节奏。可以先从一对一的互动开始，逐步过渡到小组活动，不要强迫${name}加入大集体。每个孩子都有自己的社交时间表。`
    },
    D: {
      high: (name) => `${name}有很强的规划和组织能力。这种"有序性"是我在观察儿童时最看重的品质之一。建议给${name}更多自主管理项目的机会，比如让TA来策划一次家庭活动或整理自己的学习空间。秩序感会带来内心的平静与专注。`,
      mid: (name) => `${name}的设计力正在培养中。在预备环境中，我会通过"有序的材料摆放"来帮助孩子建立内在秩序感。建议在家中也保持环境的有序性，每件物品有固定位置，帮助${name}自然习得组织能力。外在的秩序会内化为思维的秩序。`,
      low: (name) => `${name}在规划方面需要更多的环境支持。我的核心理念是"环境即老师"——与其要求孩子变得有条理，不如先创造一个有序的外部环境。当外部环境有序时，${name}的内在秩序感会自然发展。不要急于纠正，让环境来引导。`
    },
    E: {
      high: (name) => `${name}的表达力很出色。在我的教育实践中，我发现表达力强的孩子需要多样化的表达渠道——不仅是语言，还有艺术、肢体、建构等方式。建议为${name}提供丰富的创作材料，让TA找到最适合的表达方式。`,
      mid: (name) => `${name}的表达能力正在丰富中。我建议通过"示范而非纠正"的方式帮助TA——当${name}表达时耐心倾听，用更丰富的语言回应TA，这比直接教导更有效。孩子会自然吸收好的语言模式。`,
      low: (name) => `${name}在表达方面比较含蓄。请记住，不表达不等于没有想法。在我的教室里，很多安静的孩子其实内心世界非常丰富。我建议提供非语言的表达途径——绘画、拼搭、音乐等，让${name}找到属于自己的表达方式。`
    },
    R: {
      high: (name) => `${name}展现出很好的自我觉察能力。这种"内在秩序感"是自我完善的基础。建议引导${name}建立"工作日记"的习惯——记录自己的发现和思考，这将极大促进元认知发展。自我觉察是最珍贵的学习能力。`,
      mid: (name) => `${name}的反思能力正在成长。在我的教育方法中，我会通过"三段式教学"——命名、辨认、回忆——来帮助孩子建立反思习惯。日常可以在活动后简单问${name}"你今天发现了什么？"让反思成为自然的事。`,
      low: (name) => `${name}在反思方面还需要更多引导。这很正常，因为元认知是高级认知能力，需要时间发展。我建议从具体的感官回顾开始——"你看到了什么？听到了什么？感觉怎么样？"——帮助${name}建立觉察的习惯。`
    }
  },

  // ==================== 杜威 ====================
  dewey: {
    W: {
      high: (name) => `${name}的好奇心让我欣喜！这正是教育的起点——对世界的真实关切。我常说"教育即生活"，这样的孩子需要的不是书本知识，而是真实的问题情境。建议带${name}走进社区、走进自然，让TA的好奇心在真实世界中找到落脚点。`,
      mid: (name) => `${name}有一定的好奇心基础。我建议用"思维五步法"来引导TA：从真实的困惑开始，经过观察、假设、推理，最后验证。让${name}在解决真实问题的过程中，体会到好奇心的力量和价值。`,
      low: (name) => `${name}目前的好奇心需要激发。我认为，每个孩子天生都是好奇的，关键是教育环境是否保护了这份天性。建议从${name}日常生活中的小事入手——餐桌上的问题、公园里的发现——创造一个鼓励提问的环境。`
    },
    I: {
      high: (name) => `${name}的探究能力是"做中学"的典范。这样的孩子不需要被动接受知识，他们会在实践中自己建构理解。我建议给${name}设计一个跨学科的项目——比如社区环境调查——让TA在真实的探究中整合各科知识。`,
      mid: (name) => `${name}的探究力正在发展中。我建议采用"设计思维"的方式引导TA：定义问题、收集信息、设计方案、测试迭代。让${name}在小项目中体验完整的探究过程，逐步建立系统思维。`,
      low: (name) => `${name}在探究方面需要更多实践机会。我认为探究力不是教出来的，而是在实践中生长的。建议从${name}感兴趣的事物入手，创造"问题情境"——不是给答案，而是和TA一起去寻找答案。`
    },
    L: {
      high: (name) => `${name}展现了优秀的协作能力。在我看来，学校应该是一个小型的民主社会。这样的孩子天生适合参与团队项目，建议给${name}更多承担社会责任的机会——班级服务、社区志愿活动——在实践中学习合作与领导。`,
      mid: (name) => `${name}的社交能力有良好基础。我建议创造更多需要合作的情境——不是假装合作的任务，而是真正需要分工才能完成的挑战。让${name}在真实的协作中体会相互依赖和共同成长。`,
      low: (name) => `${name}在社交连接方面相对独立。这没有问题，但我建议创造一些轻松的合作机会，让${name}体验"他人是资源而非负担"的感觉。从两三人小组开始，逐步扩大合作范围。`
    },
    D: {
      high: (name) => `${name}的设计规划能力令人印象深刻。这正是"工程思维"的早期表现。我建议给${name}一些开放性的设计挑战——从需求分析到原型制作，让TA体验完整的设计流程。真实的项目是最好的学习。`,
      mid: (name) => `${name}的设计力正在培养中。我建议从"小步快跑"的方式开始：先设计一个简单的计划，执行后反思改进，再设计下一个。让${name}在实践中体会设计是一个迭代的、螺旋上升的过程。`,
      low: (name) => `${name}在规划方面需要更多引导。我认为设计力的核心是"预见性"——在做之前能想象结果。建议从日常生活中培养：让${name}在行动前先描述计划，然后对比结果，逐步建立规划意识。`
    },
    E: {
      high: (name) => `${name}的表达力是宝贵的天赋。在我看来，表达不只是输出，更是思维的深化。建议让${name}参与需要说服他人的真实情境——演讲、辩论、项目路演——让TA在真实的表达中精进这项能力。`,
      mid: (name) => `${name}的表达能力在发展中。我建议采用"演讲与研讨"的方式：让${name}先做一个小型研究，然后向家人汇报。在实践中打磨表达结构、逻辑清晰度和感染力。`,
      low: (name) => `${name}在表达方面比较内敛。我认为表达需要真实的目的和听众。建议创造低压、真诚的表达机会——家庭分享会、一对一访谈——让${name}在有意义的情境中打开表达的窗口。`
    },
    R: {
      high: (name) => `${name}的反思能力是深度学习的标志。我常说，经验加上反思等于成长。建议引导${name}建立系统的反思习惯——不只是想"做得怎么样"，更要思考"为什么这样"、"下次可以怎样更好"。`,
      mid: (name) => `${name}有初步的反思意识。我建议用"经验复盘"的方式帮助TA深化：每次重要活动后，引导${name}回顾过程、分析得失、提炼经验。反思是让经验转化为智慧的关键环节。`,
      low: (name) => `${name}在反思方面需要引导。我认为反思力需要在"有意义的经验"基础上生长。建议先创造丰富的实践机会，然后通过简单的回顾问题帮助${name}开始反思之旅："今天发生了什么？你有什么感受？"`
    }
  },

  // ==================== 皮亚杰 ====================
  piaget: {
    W: {
      high: (name) => `${name}的认知活跃度很高，这正是"建构主义"学习观的印证。孩子不是被动接收信息的容器，而是主动建构知识的建筑师。我建议提供适度的认知冲突——略高于${name}现有认知水平的刺激——让TA在解决冲突中获得认知成长。`,
      mid: (name) => `${name}的好奇心正在有序发展中。从认知发展角度看，TA正处于不断建构图式的阶段。建议给${name}提供丰富的、可探索的材料，让TA通过"同化"和"顺应"两种机制来扩展认知结构。`,
      low: (name) => `${name}的认知探索相对含蓄。这可能意味着TA的认知图式还没有足够多的"刺激"来激活。我建议从${name}感兴趣的领域入手，提供可操作、可感知的探索材料，让TA在具体的动作操作中建立认知基模。`
    },
    I: {
      high: (name) => `${name}展现了出色的科学探究思维。在我的研究中，儿童通过主动的实验来建构对世界的理解。建议给${name}提供开放性的探究问题，让TA自己提出假设、设计实验、验证结果。这是最高层次的知识建构。`,
      mid: (name) => `${name}的探究力正处于发展阶段。我建议关注TA所处的认知发展阶段，提供与TA思维水平匹配的探究任务。过难会导致挫败，过易则缺乏挑战，"适度新颖"是最有效的学习刺激。`,
      low: (name) => `${name}在探究方面需要更多支持。从认知发展看，这可能意味着TA需要更多"具体运算"阶段的经验积累。建议从可触摸、可操作的具体材料入手，帮助${name}建立探究的基础图式。`
    },
    L: {
      high: (name) => `${name}展现出很好的社会认知能力。在我的理论中，社会互动是认知发展的重要推动力。建议为${name}创造更多需要协调他人观点的情境，比如小组讨论、角色扮演——这会促进TA的"观点采择"能力发展。`,
      mid: (name) => `${name}的社交连接能力在发展中。我建议创造结构化的合作任务，让${name}体验"合作是解决问题的策略"。在合作中，TA会逐渐学会理解他人的想法，这是社会认知发展的关键。`,
      low: (name) => `${name}在社交方面偏好独立。从认知发展角度看，TA可能还处于"自我中心"阶段向"社会认知"阶段过渡的时期。建议通过简单的合作游戏，帮助${name}逐步认识到他人也有自己的想法。`
    },
    D: {
      high: (name) => `${name}的规划组织能力是"形式运算"思维早期表现的信号。这类孩子已经能够进行系统的、逻辑的思考。建议给${name}一些需要抽象规划的挑战——比如设计一个完整的实验方案——这会进一步发展TA的逻辑思维。`,
      mid: (name) => `${name}的设计力正在成长中。我建议通过"具体运算"的任务来培养TA的系统思维：比如整理物品的分类活动、按规律排序的游戏。这些经验会为更抽象的规划能力打下基础。`,
      low: (name) => `${name}在规划方面需要支持。这可能与TA的认知发展阶段有关。建议从具体的、可见的秩序活动开始——比如整理玩具、安排作息表——让${name}在可见的秩序中发展内在的组织图式。`
    },
    E: {
      high: (name) => `${name}的表达力显示出成熟的符号思维。在我的研究中，语言是符号系统中最重要的一种。建议让${name}接触多种符号系统——文字、图像、数学符号——让TA学会用不同的方式表征和理解世界。`,
      mid: (name) => `${name}的表达能力在发展中。我建议通过"表征活动"来促进TA的表达：让${name}用绘画、动作、语言等多种方式表达同一个想法，这会帮助TA理解表达是思维的外化形式。`,
      low: (name) => `${name}在表达方面相对含蓄。这可能意味着TA的符号表征系统还在发展中。我建议从非语言的表达方式入手——比如让${name}用积木建构来"说"故事——逐步发展多元化的表达能力。`
    },
    R: {
      high: (name) => `${name}的反思能力是"元认知"早期发展的标志。这类孩子已经能够"思考自己的思考"。建议引导${name}进行更深层的反思：不只是"做了什么"，更要思考"我是怎么想的"、"为什么我会这样想"。`,
      mid: (name) => `${name}有初步的反思意识。我建议通过"认知冲突"来促进TA的反思：当${name}的预期与现实不符时，引导TA思考"为什么会不一样"。这种由冲突引发的反思最有认知发展价值。`,
      low: (name) => `${name}在反思方面需要引导。元认知是认知发展的高级阶段，需要时间生长。我建议从简单的"比较"开始：让${name}比较自己做事的方法和他人的方法，逐步发展出自我监控的意识。`
    }
  },

  // ==================== 维果茨基 ====================
  vygotsky: {
    W: {
      high: (name) => `${name}的好奇心是进入"最近发展区"的钥匙。当孩子主动追问，就意味着TA准备好学习新东西了。我建议成人成为TA的"脚手架"——不是给答案，而是提供适度的提示，让${name}在帮助下达到独立无法达到的高度。`,
      mid: (name) => `${name}的好奇心需要成人的引导来深化。在我的理论中，成人的作用是提供"中介"——帮助孩子在好奇和深层理解之间架起桥梁。建议在${name}提问后，用反问引导TA继续思考，而不是直接回答。`,
      low: (name) => `${name}的好奇心需要环境的激发。我认为好奇心在社交互动中最容易被点燃。建议创造共同探索的情境——和${name}一起观察、一起提问、一起寻找答案。在合作的探索中，好奇心会自然生长。`
    },
    I: {
      high: (name) => `${name}的探究能力令人欣喜。在我的框架里，这样的孩子正处于高效学习的区域——TA有能力，又保持着探索的欲望。我建议提供稍微超出${name}独立能力的探究任务，让TA在合作中达到更高的水平。`,
      mid: (name) => `${name}的探究力在成长中。我建议找到TA的"最近发展区"——那个在成人帮助下可以完成、但独立还做不到的任务——然后提供恰好的支持。帮助${name}逐步把"依赖帮助的能力"转化为"独立的能力"。`,
      low: (name) => `${name}在探究方面需要更多脚手架支持。我建议从最基础的探究技能开始——观察、记录、比较——通过一对一的指导，帮助${name}掌握这些工具。一旦基础工具建立，探究能力会快速发展。`
    },
    L: {
      high: (name) => `${name}展现了出色的社会性协作能力。在我的理论中，高级心理机能首先出现在社会层面，然后才内化为个体能力。建议让${name}在团队中承担"帮助者"的角色，教别人是最好的学习方式。`,
      mid: (name) => `${name}的社交连接能力有良好基础。我建议通过"同伴学习"来促进TA的发展——让${name}与稍强或稍弱的伙伴合作，在差异化的互动中互相促进。最近发展区存在于人际之间。`,
      low: (name) => `${name}在社交方面需要支持。我认为社交能力不是天生的，而是在社会互动中发展出来的。建议从最简单的两人合作开始，逐步增加互动的复杂度。语言是社交的工具，鼓励${name}在合作中多表达。`
    },
    D: {
      high: (name) => `${name}的规划能力是自我调节的高级表现。在我的理论中，语言在自我调节中起核心作用——孩子在行动前会先"对自己说话"。建议鼓励${name}在做计划时先口头表达出来，这会强化TA的自我调节能力。`,
      mid: (name) => `${name}的设计力正在发展中。我建议通过"合作规划"来促进TA：和${name}一起做计划，成人提供示范和提示，让${name}逐步内化规划的过程。今天一起做，明天TA就能独立做。`,
      low: (name) => `${name}在规划方面需要支持。规划是高级的自我调节能力，需要在社交互动中先行发展。建议在日常生活中让${name}参与家庭计划的讨论，通过观察成人如何规划来学习这项能力。`
    },
    E: {
      high: (name) => `${name}的表达力是思维发展的重要标志。在我的研究中，语言不仅是交流工具，更是思维工具。建议创造丰富的讨论机会——和${name}辩论、让TA解释想法、讲故事——这会持续发展TA的思维品质。`,
      mid: (name) => `${name}的表达能力在成长中。我建议通过"对话式学习"来促进TA：提出开放性问题、追问理由、讨论不同观点。在真实的对话中，表达能力会自然提升。`,
      low: (name) => `${name}在表达方面需要支持。我认为表达能力在社交互动中发展最快。建议创造低压的、一对一的表达机会——关键是让${name}感觉到TA的想法被重视，表达是有价值的。`
    },
    R: {
      high: (name) => `${name}的反思能力是"元认知"发展的体现。这类孩子已经在用"内部言语"来监控自己的思维。建议引导${name}把反思的过程外化出来——写日记、画思维导图——这会进一步强化TA的自我监控能力。`,
      mid: (name) => `${name}有初步的反思能力。我建议通过"对话式反思"来促进TA：在活动后，和${name}进行简短的回顾对话。成人的问题可以成为脚手架，帮助${name}学会反思的方法。`,
      low: (name) => `${name}在反思方面需要引导。反思是在社会互动中发展出来的高级能力。建议通过"共同回顾"来培养——和${name}一起回顾一天的事，用问题引导TA思考"为什么"。`
    }
  },

  // ==================== 福禄贝尔 ====================
  froebel: {
    W: {
      high: (name) => `${name}的好奇心让我看到了"神圣的创造精神"。每个孩子都带着探索宇宙的使命来到这个世界。我建议用"恩物"——那些精心设计的游戏材料——来滋养${name}的好奇心，让TA在游戏中发现自然的规律和美的秩序。`,
      mid: (name) => `${name}的好奇心如同一颗正在发芽的种子。我建议创造更多与自然连接的机会——让${name}在花园里、在树林间自由探索。自然界是最伟大的恩物，会唤醒孩子内在的求知欲。`,
      low: (name) => `${name}的好奇心需要用心呵护。我相信每个孩子心中都有一簇神圣的火焰，只是需要合适的火花来点燃。我建议从${name}最简单的兴趣开始——一个玩具、一朵花、一块石头——让TA体验发现的喜悦。`
    },
    I: {
      high: (name) => `${name}的探究能力是"游戏精神"的升华。在我的理念中，游戏不是玩耍，而是儿童认识世界最深刻的方式。建议让${name}参与更有结构性的探究游戏——比如搭建、拆解、实验——在游戏中发展科学思维。`,
      mid: (name) => `${name}的探究力正在"恩物"的滋养下成长。我建议通过系统的游戏材料来培养TA：从简单的形状和颜色开始，逐步引入更复杂的建构活动。每一个恩物都蕴含着宇宙的法则。`,
      low: (name) => `${name}在探究方面需要游戏的引导。我建议从最基本的感官游戏开始——触摸不同材质、观察颜色变化、倾听声音。让${name}先通过游戏建立与世界的感官连接，探究的种子会自然萌发。`
    },
    L: {
      high: (name) => `${name}展现了美好的"和谐精神"。在我的幼儿园里，孩子应该在团体中体验生命的联结。我建议让${name}参与更多创造性的团体游戏——一起搭建、一起唱歌、一起舞蹈——在共同创造中感受生命的合一。`,
      mid: (name) => `${name}的社交连接力正在发展中。我建议通过"合作游戏"来培养TA——比如需要几个孩子共同完成的建构任务。游戏是最好的社交课堂，孩子会在游戏中自然学会合作。`,
      low: (name) => `${name}在社交方面更享受独处。我尊重每个孩子的内在节奏。建议从平行游戏开始——${name}和其他孩子在同一空间各自游戏，逐步过渡到有互动的游戏。让社交成为自然的、愉快的过程。`
    },
    D: {
      high: (name) => `${name}的设计规划能力让我欣喜。这正是"创造精神"的体现——孩子内在有建构和创造的冲动。建议提供更复杂的恩物让${name}挑战，让TA在建构中体验从构思到实现的完整创造过程。`,
      mid: (name) => `${name}的设计力正在成长。我建议通过系统的建构游戏来培养TA：从模仿开始，逐步引导${name}进行自己的设计和创造。每一个建构作品都是孩子内在世界的投射。`,
      low: (name) => `${name}在规划方面需要支持。我建议从简单的"秩序游戏"开始——比如按照规律排列物品、按照颜色分类。这些看似简单的活动，蕴含着逻辑和秩序的种子。`
    },
    E: {
      high: (name) => `${name}的表达力是"诗意灵魂"的体现。我相信每个孩子都有多种表达的语言——声音、动作、色彩、形象。建议让${name}接触多种艺术形式——音乐、绘画、戏剧——让TA找到最适合自己的表达方式。`,
      mid: (name) => `${name}的表达能力在丰富中。我建议通过"艺术游戏"来滋养TA——让${name}自由地画画、唱歌、跳舞。表达不应该是训练，而是一种享受和创造。`,
      low: (name) => `${name}在表达方面比较内敛。我建议创造一个充满艺术氛围的环境——音乐、绘本、色彩——让${name}在浸润中自然打开表达的大门。每一个孩子都有诗意的灵魂，只需要被发现。`
    },
    R: {
      high: (name) => `${name}的反思能力是"内在声音"的倾听。我相信反思是孩子与内在神性的对话。建议引导${name}通过绘画或符号来记录自己的思考，这是一种深刻的自我对话形式。`,
      mid: (name) => `${name}有初步的反思意识。我建议通过"回顾游戏"来培养TA——游戏结束后，让${name}分享今天的发现和感受。在轻松的氛围中，反思会自然发生。`,
      low: (name) => `${name}在反思方面需要引导。我建议从"分享发现"开始——在每次探索后，简单地问${name}"你发现了什么？"让TA逐渐发展出回顾和总结的习惯。`
    }
  },

  // ==================== 卢梭 ====================
  rousseau: {
    W: {
      high: (name) => `${name}的好奇心是天性中最宝贵的礼物。我深信儿童天性本善，好奇心是与生俱来的探索本能。我只有一个建议：不要打扰${name}，让TA在自然中自由探索。我们往往过度干预，反而阻碍了天性的发展。`,
      mid: (name) => `${name}的好奇心正在发展中。我的教育信条是"消极教育"——不是什么都不做，而是不急于教导，让儿童按照自己的节奏成长。建议给${name}充足的自由时间和空间，让TA的好奇心自然生长。`,
      low: (name) => `${name}的好奇心似乎被遮蔽了。这往往是因为过早的知识灌输和不必要的干预。我建议把${name}带到大自然中去，让TA在没有考试、没有评判的环境中重新发现世界。天性需要自由才能绽放。`
    },
    I: {
      high: (name) => `${name}的探究能力显示出TA的理性正在觉醒。但我要提醒：不要让探究变成另一种灌输。让${name}在自然体验中自己得出结论，而不是被告知"正确答案"。真正的知识来源于自己的发现。`,
      mid: (name) => `${name}的探究力在自然发展中。我建议给TA更多亲身实践的机会——不是在课本上学习，而是在自然中体验。让${name}触摸泥土、观察昆虫、感受四季。经验是最好的老师。`,
      low: (name) => `${name}在探究方面需要更多自然体验。探究力不会从书本中生长出来。我建议让${name}远离教室，走进自然——让TA通过自己的感官去认识世界，而不是通过别人的描述。`
    },
    L: {
      high: (name) => `${name}展现了自然的社交能力。我相信在自然状态下，儿童会发展出健康的社会性。建议让${name}在自由的交往中学习相处之道，而不是被教导"应该如何社交"。真诚的关系源于自然。`,
      mid: (name) => `${name}的社交连接力在自然成长中。我建议创造自由的交往环境，让${name}自己选择玩伴和游戏方式。成人的角色不是组织者，而是保护者——保护孩子自由交往的空间。`,
      low: (name) => `${name}在社交方面比较独立。这完全符合自然。每个孩子都有自己的社交节奏，不需要强迫。我建议尊重${name}的选择，给TA独处的自由。真正的社交能力会在自然环境中生长。`
    },
    D: {
      high: (name) => `${name}的规划能力让人印象深刻。但我要提醒：不要把成人的规划观念强加给孩子。让${name}按照自己的方式组织事物，即使看起来"混乱"，那可能正是TA的内在秩序。`,
      mid: (name) => `${name}的设计力在自然发展中。我建议让TA通过日常生活的实践来发展规划能力——比如整理自己的物品、安排自己的时间。真实的需要是最好的学习动力。`,
      low: (name) => `${name}在规划方面需要时间。规划是理性能力的体现，需要自然发展。我建议不要急于教导${name}"应该如何"，而是让TA在实践中体验秩序的必要性。自然会教育孩子。`
    },
    E: {
      high: (name) => `${name}的表达力是天性的流露。我相信在自然环境中，表达是自发的、真诚的。建议给${name}自由表达的空间，不需要刻意训练。最动人的表达来自真实的心声。`,
      mid: (name) => `${name}的表达能力在自然成长中。我建议创造低压的表达环境——让${name}在想说的时候说，而不是被要求说。真实的听众和真实的目的，比技巧训练更重要。`,
      low: (name) => `${name}在表达方面比较安静。我不认为这是问题。每个孩子都有独特的表达节奏。我建议给${name}充足的时间和空间，当TA真正有话要说时，表达会自然发生。`
    },
    R: {
      high: (name) => `${name}的反思能力是理性发展的标志。我认为反思应该源于真实的内在需要，而不是外在的要求。建议让${name}在经历失败后自然地回顾和思考，这是最有价值的反思。`,
      mid: (name) => `${name}有初步的反思意识。我建议在${name}遇到问题时，不要急于给答案，而是让TA自己思考解决方法。困难是反思最好的催化剂。`,
      low: (name) => `${name}在反思方面需要时间。反思力的发展有其自然的时间表。我建议不要焦虑，给${name}足够的自由探索空间。在反复的尝试和体验中，反思的能力会自然生长。`
    }
  },

  // ==================== 夸美纽斯 ====================
  comenius: {
    W: {
      high: (name) => `${name}的好奇心是知识的入口。我相信"把一切知识教给一切人"，但要遵循自然的方法——由易到难、由近及远。建议为${name}设计系统化的探索路径，让TA的好奇心在有序的学习中得到满足和深化。`,
      mid: (name) => `${name}的好奇心正在发展。我建议采用"直观教学"的方法——让${name}先通过感官直接认识事物，再逐步上升到抽象理解。循序渐进是教学的黄金法则。`,
      low: (name) => `${name}的好奇心需要激发。我建议从${name}身边最熟悉的事物开始引导——家庭、学校、自然。好奇心源于对日常事物的深入观察，而不是对遥远事物的空想。`
    },
    I: {
      high: (name) => `${name}的探究能力令人欣喜。我的教育理想是让每个人都能系统地学习一切知识。建议为${name}建立探究的"知识图谱"——让TA看到每个探究主题与其他知识的联系，形成系统的认知结构。`,
      mid: (name) => `${name}的探究力在有序发展中。我建议采用"系统教学法"——把探究技能分解为有序的步骤，让${name}一步一步掌握。从观察到假设，从实验到结论，每一步都清晰可见。`,
      low: (name) => `${name}在探究方面需要系统引导。我建议从最基础的观察能力开始培养——让${name}学会有目的、有方法地观察。观察是探究的起点，是获取知识的第一步。`
    },
    L: {
      high: (name) => `${name}展现了良好的协作能力。我相信教育应该培养"和谐发展的人"。建议让${name}参与更多需要合作的学习项目，在团队中体验知识的共享和思维的碰撞。`,
      mid: (name) => `${name}的社交连接力在发展中。我建议通过"集体教学"的方式培养TA的合作能力——在同一课堂中，${name}可以和不同能力的孩子一起学习，互相帮助。`,
      low: (name) => `${name}在社交方面需要鼓励。我建议创造小型的、结构化的合作学习机会，让${name}在明确分工的任务中体验合作的价值。有序的合作比自由交往更容易上手。`
    },
    D: {
      high: (name) => `${name}的规划能力是系统思维的体现。我建议让${name}学习更系统的规划方法——比如制作思维导图、设计学习计划。有序的思维是有序学习的基础。`,
      mid: (name) => `${name}的设计力在培养中。我建议通过"分步教学"来发展TA的规划能力——把复杂任务分解为简单步骤，让${name}逐步建立系统规划的意识。`,
      low: (name) => `${name}在规划方面需要引导。规划能力可以教授。我建议从简单的日常计划开始——让${name}学会列出任务清单、安排顺序、检查完成。这些习惯会形成终身受用的能力。`
    },
    E: {
      high: (name) => `${name}的表达力是宝贵的天赋。我的教育信条之一是：清晰地表达知识。建议让${name}学习更系统的表达方法——从结构到内容，从口头到书面——让TA的表达更加专业和有力。`,
      mid: (name) => `${name}的表达能力在成长中。我建议通过"演示教学"的方式培养TA——让${name}观察好的表达范例，然后模仿和内化。模仿是学习的自然途径。`,
      low: (name) => `${name}在表达方面需要训练。我建议从最基础的口头表达开始——清晰地说出一个完整句子、描述一个简单事物。表达是可以系统习得的技能。`
    },
    R: {
      high: (name) => `${name}的反思能力是高效学习的保障。我建议让${name}建立系统的学习档案——记录学习过程、定期回顾、总结方法。反思的习惯会让学习事半功倍。`,
      mid: (name) => `${name}有初步的反思意识。我建议把反思纳入学习的常规环节——每次学习结束后，留出几分钟让${name}回顾今天学了什么、有什么不懂。反思需要成为习惯。`,
      low: (name) => `${name}在反思方面需要培养。我建议从简单的"复述"开始——让${name}在学习后说出今天的内容。复述是反思的起点，是最基础的元认知训练。`
    }
  },

  // ==================== 赫尔巴特 ====================
  herbart: {
    W: {
      high: (name) => `${name}的好奇心需要转化为持久的"多方面兴趣"。我建议在满足TA的好奇心同时，引导${name}建立系统的兴趣领域。兴趣是学习最好的动力，是教育的起点。`,
      mid: (name) => `${name}的好奇心正在发展中。我建议通过"联想"来拓展TA的兴趣——把${name}感兴趣的事物与相关的新知识联系起来，让好奇心自然延伸。`,
      low: (name) => `${name}的好奇心需要培养。兴趣是可以激发的。我建议找到${name}最容易产生兴趣的领域，用生动有趣的方式呈现，让TA体验到求知的乐趣。`
    },
    I: {
      high: (name) => `${name}的探究能力展现了良好的思维品质。我建议采用"四段教学法"来深化TA的探究学习：明了问题、联想相关知识、形成系统认识、掌握探究方法。`,
      mid: (name) => `${name}的探究力在发展中。我建议把探究过程系统化——让${name}经历完整的探究步骤：观察、假设、验证、结论。系统的训练会形成稳固的能力。`,
      low: (name) => `${name}在探究方面需要系统指导。我建议从培养"探究兴趣"开始——让${name}体验探究的乐趣，然后逐步教授探究的方法。兴趣先于技能。`
    },
    L: {
      high: (name) => `${name}展现了良好的社交协作能力。我相信教育的最高目的是培养道德品格，而社交能力是道德发展的重要方面。建议让${name}在合作学习中体验责任与关怀。`,
      mid: (name) => `${name}的社交连接力在成长中。我建议通过"团体活动"来培养TA的合作意识——在明确的规则和分工下，${name}会逐渐理解合作的价值。`,
      low: (name) => `${name}在社交方面需要引导。我建议创造结构化的合作情境——有明确目标、有分工的任务。合作能力可以在有组织的环境中培养。`
    },
    D: {
      high: (name) => `${name}的规划能力是优秀的学习品质。我建议让${name}学习更系统的规划方法——四段法：分析需求、设计方案、组织实施、评估改进。这是终身受用的能力。`,
      mid: (name) => `${name}的设计力在培养中。我建议通过"系统教学"来发展TA——把规划分解为清晰的步骤，让${name}在每一步都明确自己该做什么。`,
      low: (name) => `${name}在规划方面需要系统训练。我建议从最基础的"列清单"开始——让${name}学会把任务写下来、排序、逐一完成。简单的习惯会发展成重要的能力。`
    },
    E: {
      high: (name) => `${name}的表达力是宝贵的能力。我建议让${name}学习"系统化表达"——组织观点、构建结构、清晰呈现。表达不只是天赋，更是可以教授的技能。`,
      mid: (name) => `${name}的表达能力在发展中。我建议采用"示范-练习"的方法——让${name}先观察好的表达范例，然后模仿，最后形成自己的风格。`,
      low: (name) => `${name}在表达方面需要培养。表达力与"兴趣"密切相关。我建议先激发${name}表达的欲望——有真实的想说的话，再教授表达的方法。`
    },
    R: {
      high: (name) => `${name}的反思能力让我欣喜。反思是"自我教育"的核心。我建议让${name}建立系统的反思框架：过程回顾、结果评估、经验提炼、方法改进。`,
      mid: (name) => `${name}有初步的反思能力。我建议把反思纳入"四段学习法"的最后阶段——每次学习都经历明了、联想、系统、方法四个环节，反思是最后一个环节。`,
      low: (name) => `${name}在反思方面需要培养。我建议从最简单的"回顾"开始——每次学习后问${name}"今天学了什么？"这是反思最基本的形式。`
    }
  },

  // ==================== 苏霍姆林斯基 ====================
  sukhomlinsky: {
    W: {
      high: (name) => `${name}的好奇心是心灵的窗户。我相信教育首先是关怀人的心灵，好奇心是精神成长的表现。建议带${name}走进大自然——我常带孩子去森林、田野，让TA在自然的怀抱中探索发现。大自然是最好的课堂。`,
      mid: (name) => `${name}的好奇心正在萌发。我建议为TA创造丰富的精神生活——阅读、自然、艺术、劳动。好奇心在多元的精神体验中会自然生长。`,
      low: (name) => `${name}的好奇心需要唤醒。这需要爱的环境和丰富的精神滋养。我建议从${name}最感兴趣的领域入手，用生动的故事和真实的体验点燃TA的求知欲望。每个孩子都是可以唤醒的。`
    },
    I: {
      high: (name) => `${name}的探究能力是智力发展的瑰宝。我建议让${name}参与真实的劳动和研究——在我的学校，孩子们有自己的实验田、有自己的研究课题。在真实的探究中，能力会全面发展。`,
      mid: (name) => `${name}的探究力在成长中。我建议把探究与阅读、劳动结合起来。让${name}在书本中学习理论，在实践中验证发现。理论与实践的结合是最有效的学习。`,
      low: (name) => `${name}在探究方面需要支持。我建议从培养TA的观察兴趣开始——在大自然中观察、在劳动中体验。探究的种子会在丰富的实践中萌发。`
    },
    L: {
      high: (name) => `${name}展现了美好的社交协作能力。我相信"集体"是教育的强大力量。建议让${name}在集体活动中承担更多责任——帮助同学、服务班级——在服务他人中体验生命的意义。`,
      mid: (name) => `${name}的社交连接力在发展中。我建议创造温暖的集体环境——让${name}感受到被接纳、被需要。在爱的集体中，社交能力会自然生长。`,
      low: (name) => `${name}在社交方面比较独立。我建议用"关爱"来打开TA的心门——让${name}感受到他人的温暖，然后引导TA去关心他人。爱是连接心灵的桥梁。`
    },
    D: {
      high: (name) => `${name}的规划能力是全面发展的表现。我建议让${name}参与更多劳动实践——劳动教会人计划、执行、负责。在劳动中培养的设计力，是终身受用的品质。`,
      mid: (name) => `${name}的设计力在培养中。我建议通过"劳动教育"来发展TA——让${name}负责一些家庭或班级的劳动任务，在实践中学习规划和组织。`,
      low: (name) => `${name}在规划方面需要引导。我建议从简单的劳动任务开始——让${name}负责整理自己的书桌、安排自己的作业时间。劳动是最好的教育。`
    },
    E: {
      high: (name) => `${name}的表达力是精神丰富性的体现。我建议让${name}在阅读中汲取营养，在表达中释放智慧。阅读与表达是精神生活的双翼。鼓励${name}多读好书，多表达想法。`,
      mid: (name) => `${name}的表达能力在成长中。我建议创造丰富的表达机会——讲故事、写日记、参与讨论。表达需要在真实的情境中发展。`,
      low: (name) => `${name}在表达方面比较含蓄。我建议从倾听开始——先倾听${name}的心声，让TA感受到表达的温暖回应。当孩子体验到表达被珍视，就会愿意说更多。`
    },
    R: {
      high: (name) => `${name}的反思能力是精神成熟的标志。我建议引导${name}通过日记与自己的心灵对话——记录一天的感受、思考和成长。反思是精神生活的重要组成部分。`,
      mid: (name) => `${name}有初步的反思意识。我建议通过"一天结束时的谈话"来培养TA——睡前和${name}简短交流今天的收获和感受。这是最温暖的反思时刻。`,
      low: (name) => `${name}在反思方面需要引导。我建议从分享情感开始——让${name}表达今天的感受。"你今天开心吗？为什么？"情感的表达是反思的起点。`
    }
  },

  // ==================== 陶行知 ====================
  tao: {
    W: {
      high: (name) => `${name}的好奇心很旺盛！我的教育理念是"生活即教育"——建议带${name}走进真实的社会生活，让TA的好奇心在解决实际问题中得到满足。菜市场、工厂、农田都是课堂，社会是最好的学校。`,
      mid: (name) => `${name}的好奇心正在发展中。我建议把TA的好奇心引向生活——从日常现象入手，和${name}一起观察、提问、探索。生活中的好奇是最有教育价值的。`,
      low: (name) => `${name}的好奇心需要激发。我建议创造丰富的生活体验机会——让${name}接触不同的人和事，走进不同的场景。好奇心源于对生活的热爱和参与。`
    },
    I: {
      high: (name) => `${name}的探究能力让人欣喜。我的主张是"教学做合一"——让${name}在真实的生活情境中探究。比如，让TA来研究家里一个真实的问题：如何节水？如何改善学习环境？真实的探究最有意义。`,
      mid: (name) => `${name}的探究力在成长中。我建议把探究与生活实践结合起来。让${name}先在日常生活中发现问题，然后学习探究方法来解决问题。做中学，学中做。`,
      low: (name) => `${name}在探究方面需要支持。我建议从生活小实验开始——做饭的原理、植物的生长、物品的构造。生活中的探究是最接地气的学习。`
    },
    L: {
      high: (name) => `${name}展现了优秀的协作能力。我提倡"小先生制"——让${name}来当"小先生"，教别人自己会的东西。教是最好的学，合作中${name}会获得更大的成长。`,
      mid: (name) => `${name}的社交连接力在发展中。我建议创造真实的合作情境——比如让${name}和同学一起完成一个社区服务项目。在实践中学习合作，在合作中体验责任。`,
      low: (name) => `${name}在社交方面比较独立。我建议从"结对互助"开始——让${name}和一个伙伴建立互帮关系。简单的互助是社交学习的第一步。`
    },
    D: {
      high: (name) => `${name}的规划能力很出色。我建议让TA参与家庭或社区的真实规划工作——比如策划一次家庭活动、组织一次社区服务。真实的责任会让规划能力得到最好的锻炼。`,
      mid: (name) => `${name}的设计力在培养中。我建议把规划和行动结合起来——让${name}先做计划，然后执行，最后反思改进。在实践中发展规划能力。`,
      low: (name) => `${name}在规划方面需要引导。我建议从生活中的小事开始培养——让${name}自己安排周末时间、自己整理学习计划。生活是最好的教育。`
    },
    E: {
      high: (name) => `${name}的表达力很出色。我建议让TA参与真实的表达情境——向他人介绍项目、在社区分享发现、组织同学讨论。真实的听众和目的，会让表达更有力量。`,
      mid: (name) => `${name}的表达能力在发展中。我建议通过"生活演讲"来培养——让${name}讲述自己的经历、分享自己的发现。表达源于生活，服务于生活。`,
      low: (name) => `${name}在表达方面比较内敛。我建议从"生活分享"开始——让${name}说说今天发生了什么有趣的事。真实的生活是最想表达的内容。`
    },
    R: {
      high: (name) => `${name}的反思能力是实践智慧的体现。我建议让TA建立"实践日记"——记录每天做了什么、学到了什么、有什么感悟。在做中学、在学中思。`,
      mid: (name) => `${name}有初步的反思意识。我建议通过"实践复盘"来培养TA——每次实践活动后，和${name}一起回顾过程、分析得失。反思让实践更有教育价值。`,
      low: (name) => `${name}在反思方面需要引导。我建议从简单的"回顾一天"开始——让${name}说说今天做了什么。回顾是反思的起点。`
    }
  }
}

// ========== 经典对话对 ==========

interface ClassicDebate {
  pair: [string, string] // 两位学家的ID
  triggerCondition: (wilderScores: Record<string, number>) => boolean
  topic: string
  generateDebate: (name: string, scores: Record<string, number>) => {
    firstSpeaker: { id: string; content: string }
    secondSpeaker: { id: string; content: string }
    resolution?: string
  }
}

const CLASSIC_DEBATES: ClassicDebate[] = [
  // 皮亚杰 vs 维果茨基：独立发现 vs 引导学习
  {
    pair: ['piaget', 'vygotsky'],
    triggerCondition: (scores) => {
      const diff = Math.abs(scores['I'] - scores['R'])
      return diff > 15
    },
    topic: '孩子应该独立发现还是成人引导学习？',
    generateDebate: (name, scores) => {
      const highI = scores['I'] > scores['R']
      return {
        firstSpeaker: {
          id: 'piaget',
          content: highI
            ? `我观察到${name}的探究力很强，这说明TA已经具备了自主建构知识的能力。我的研究表明，儿童通过自己的探索和发现获得的知识最为稳固。我们应该给TA空间，让TA在与环境的互动中自己建构理解，而不是急于介入。`
            : `虽然${name}的反思力较强，探究方面略显不足，但我认为这不意味着成人应该更多干预。恰恰相反，这说明TA需要更多机会去独立探索。只有在自己的探索中遇到的"认知冲突"，才能真正促进思维发展。`
        },
        secondSpeaker: {
          id: 'vygotsky',
          content: highI
            ? `皮亚杰教授，我尊重您的发现，但我有不同的思考。${name}的探究力强，正说明TA准备好进入更高的学习区域了。我的"最近发展区"理论表明，在孩子独立能达到的水平和有帮助下能达到的水平之间存在巨大潜力。成人适时的"脚手架"支持，可以让${name}的探究达到新的高度。`
            : `皮亚杰教授，这正是我想要讨论的。${name}在反思和探究之间存在差距，这不正是"最近发展区"的体现吗？TA在反思方面已经具备一定能力，说明有认知基础。如果成人能在探究方面提供引导，帮助TA把反思能力迁移到探究中，会事半功倍。`
        },
        resolution: `两位学者的观点并不矛盾：皮亚杰强调自主建构的重要性，维果茨基强调社会支持的时机。对于${name}，可以在尊重TA自主探索的基础上，在关键时刻提供适度的引导。`
      }
    }
  },

  // 蒙台梭利 vs 赫尔巴特：自由探索 vs 结构化教学
  {
    pair: ['montessori', 'herbart'],
    triggerCondition: (scores) => scores['W'] > 50 && scores['D'] > 50,
    topic: '应该给予孩子更多自由还是更多结构？',
    generateDebate: (name, _scores) => {
      return {
        firstSpeaker: {
          id: 'montessori',
          content: `${name}同时展现出好奇心和设计力，这正是"吸收性心智"与"敏感期"重合的宝贵时刻。我的教育哲学是：创造一个精心准备的丰富环境，然后——退后一步。让孩子自由选择、自由探索、自我纠正。过多的结构会压抑孩子的内在驱动力。`
        },
        secondSpeaker: {
          id: 'herbart',
          content: `蒙台梭利博士，我敬佩您对儿童的观察，但我有不同的教育主张。${name}的好奇心和设计力确实宝贵，但需要系统的引导才能转化为持久的兴趣和扎实的能力。我的"四段教学法"提供的是一个清晰的学习路径——明了、联想、系统、方法。自由固然重要，但没有结构的自由可能流于散漫。`
        },
        resolution: `蒙台梭利的"预备环境"和赫尔巴特的"系统教学"可以融合：先为孩子创建有序的、丰富的探索环境，在环境内给予选择的自由，同时在关键节点提供系统化的指导。`
      }
    }
  },

  // 杜威 vs 卢梭：社会实践 vs 自然成长
  {
    pair: ['dewey', 'rousseau'],
    triggerCondition: (scores) => scores['I'] > 60 || scores['L'] > 60,
    topic: '孩子应该更多地参与社会实践还是自然成长？',
    generateDebate: (name, scores) => {
      const highI = scores['I'] > scores['L']
      return {
        firstSpeaker: {
          id: 'dewey',
          content: highI
            ? `${name}的探究力很强，这正是"做中学"的最佳契机。我的教育理念是"教育即生活，学校即社会"。不应该把孩子隔离在温室中，而应该让TA参与真实的社会实践——解决社区问题、参与公共事务。在真实的社会情境中，探究才有意义。`
            : `${name}的连接力很强，说明TA天生适合社会生活。我认为教育不应该脱离社会，而应该就是社会生活本身。让孩子在合作、服务、参与中成长，这比孤立的"学习"更有教育价值。`
        },
        secondSpeaker: {
          id: 'rousseau',
          content: highI
            ? `杜威先生，我理解您对实践教育的重视，但我必须表达我的忧虑。过早让孩子进入复杂的社会，可能会扭曲TA的天性。${name}的探究力强，更应该让TA在自然环境中自由探索，而不是被社会的规则所束缚。自然是唯一的老师，它不会欺骗孩子。`
            : `杜威先生，您强调社会参与，但在我看来，过早的社会化可能正是损害儿童天性的根源。${name}的社交能力强，更要保护TA不被社会的虚伪所污染。让TA在大自然中、在简单的人际关系中成长，这才是自然的教育。`
        },
        resolution: `杜威强调社会参与的教育价值，卢梭强调自然成长的保护意义。两者可以结合：给孩子创造与自然连接的机会，同时提供真实但有边界的社会实践。渐进地、有保护地走向社会。`
      }
    }
  },

  // 福禄贝尔 vs 夸美纽斯：游戏创造 vs 系统学习
  {
    pair: ['froebel', 'comenius'],
    triggerCondition: (scores) => scores['E'] > 50,
    topic: '应该通过游戏还是系统教学来培养表达能力？',
    generateDebate: (name, _scores) => {
      return {
        firstSpeaker: {
          id: 'froebel',
          content: `${name}的表达力让我看到了"诗意灵魂"的萌芽。我深信游戏是儿童发展的最高阶段。表达不应该被"教授"，而应该在游戏中自然绽放。让${name}在艺术游戏中自由表达——绘画、歌唱、戏剧、建构——每一种游戏都是一种语言，都会滋养TA的表达能力。`
        },
        secondSpeaker: {
          id: 'comenius',
          content: `福禄贝尔先生，您的游戏教育理念非常美好，但作为实践教育者，我想补充一点。${name}的表达力在发展，如果只有自由的游戏，可能难以系统提升。我主张通过系统的教学方法——从口语到书面，从简单到复杂——循序渐进地培养表达能力。游戏是手段，系统学习是保障。`
        },
        resolution: `福禄贝尔的"游戏精神"和夸美纽斯的"系统教学"并不矛盾。可以在游戏化的情境中，有意识地引入系统的表达训练——让学习像游戏一样有趣，让游戏有明确的学习目标。`
      }
    }
  },

  // 苏霍姆林斯基 vs 陶行知：情感滋养 vs 生活实践
  {
    pair: ['sukhomlinsky', 'tao'],
    triggerCondition: (scores) => scores['L'] > 50 || scores['R'] > 50,
    topic: '教育应该更注重情感滋养还是生活实践？',
    generateDebate: (name, scores) => {
      const highL = scores['L'] > scores['R']
      return {
        firstSpeaker: {
          id: 'sukhomlinsky',
          content: highL
            ? `${name}的连接力让我看到了一颗温暖的心。教育首先是关怀人的心灵。我主张让${name}在爱的环境中成长——与自然的联结、与书籍的联结、与他人的联结。阅读、自然、爱，这些才是滋养灵魂的养分。实践固然重要，但不能忽视精神世界的培育。`
            : `${name}的反思力很强，这说明TA有一个丰富的内心世界。我认为教育的核心是培养"真正的人"——有丰富精神世界、有高尚道德情操的人。让TA在阅读中成长、在自然中沉思、在爱中滋养，这比任何实践都重要。`
        },
        secondSpeaker: {
          id: 'tao',
          content: highL
            ? `苏霍姆林斯基先生，我非常认同您对心灵的重视。但我同时要强调：心灵的培育不能脱离生活。我的主张是"生活即教育"——让${name}走进真实的生活、参与真实的实践。在劳动中、在服务中、在真实的问题解决中，TA会体验到生命的意义。心灵在实践中成长。`
            : `苏霍姆林斯基先生，您强调内在反思，我非常认同。但我认为真正的反思源于实践。我的教育主张是"教学做合一"——让${name}在做中学，在学中思。没有实践支撑的反思是空洞的，实践后的反思才是深刻的。`
        },
        resolution: `苏霍姆林斯基强调情感与精神的滋养，陶行知强调生活与实践的教育。两者相辅相成：在丰富的生活实践中滋养情感，在温暖的情感中投身实践。做中学，学中悟。`
      }
    }
  }
]

// ========== 辅助函数 ==========

/**
 * 获取WILDER维度的中文名
 */
export function getWilderDimName(dim: string): string {
  return WILDER_DIM_NAMES[dim] || dim
}

/**
 * 根据分数获取档位
 */
export function getScoreLevel(score: number): 'high' | 'mid' | 'low' {
  if (score >= 70) return 'high'
  if (score >= 40) return 'mid'
  return 'low'
}

/**
 * 生成孩子画像摘要
 */
export function generateChildProfile(
  childName: string,
  age: number,
  wilderScores: Record<string, number>,
  topDims: string[],
  weakDims: string[]
): string {
  const topDesc = topDims.map(d => `${getWilderDimName(d)}(${wilderScores[d]}分)`).join('、')
  const weakDesc = weakDims.length > 0
    ? weakDims.map(d => `${getWilderDimName(d)}(${wilderScores[d]}分)`).join('、')
    : '无明显短板'

  return `${childName}，${age}岁，WILDER测评结果显示：在${topDesc}方面表现突出，是核心优势领域；${weakDims.length > 0 ? `${weakDesc}有较大提升空间。` : '各维度发展较为均衡。'}本次邀请10位教育学家基于测评数据进行圆桌讨论，为${childName}的成长提供多视角的教育建议。`
}

/**
 * 生成综合建议总结
 */
export function generateFinalRecommendation(
  childName: string,
  consensusPoints: ConsensusPoint[],
  divergencePoints: DivergencePoint[]
): string {
  let summary = `经过三位教育专家的充分讨论，针对${childName}的成长，形成了${consensusPoints.length}条核心共识`

  if (divergencePoints.length > 0) {
    summary += `和${divergencePoints.length}处值得家长深入思考的差异视角`
  }

  summary += `。各位教育学家一致认为，每个孩子都是独特的，教育应当尊重个体差异，在爱与自由中引导孩子成长。`

  if (consensusPoints.length > 0) {
    summary += `核心建议是：${consensusPoints[0].recommendation}`
    if (consensusPoints.length > 1) {
      summary += `；同时，${consensusPoints[1].recommendation}`
    }
    summary += `。`
  }

  summary += `家长们可以结合自己的教育理念和孩子的实际情况，从多元视角中汲取智慧，找到最适合${childName}的成长路径。`

  return summary
}

/**
 * 根据匹配度排序学家
 */
function sortEducatorsByRelevance(
  topDimensions: string[],
  weakDimensions: string[]
): EducatorProfile[] {
  return [...EDUCATORS].sort((a, b) => {
    // 计算与top维度的匹配度
    const aTopMatch = a.wilderFocus.filter(d => topDimensions.includes(d)).length
    const bTopMatch = b.wilderFocus.filter(d => topDimensions.includes(d)).length

    // 计算与weak维度的匹配度
    const aWeakMatch = a.wilderFocus.filter(d => weakDimensions.includes(d)).length
    const bWeakMatch = b.wilderFocus.filter(d => weakDimensions.includes(d)).length

    // 优先匹配top维度，然后是weak维度
    if (aTopMatch !== bTopMatch) return bTopMatch - aTopMatch
    return bWeakMatch - aWeakMatch
  })
}

/**
 * 生成第1轮观察发言
 */
function generateRound1Observations(
  childName: string,
  wilderScores: Record<string, number>,
  wilderLevels: Record<string, string>,
  topDimensions: string[],
  _weakDimensions: string[],
  sortedEducators: EducatorProfile[]
): EducatorDialogue[] {
  const dialogues: EducatorDialogue[] = []

  // 取前6位相关度最高的学家发言
  const speakingEducators = sortedEducators.slice(0, 6)

  speakingEducators.forEach((educator, _index) => {
    // 找到该学家主要关注且在top维度中的维度
    const primaryDim = educator.wilderFocus.find(d => topDimensions.includes(d)) || educator.wilderFocus[0]
    const level = wilderLevels[primaryDim] || getScoreLevel(wilderScores[primaryDim] || 50)

    // 从模板库获取观察内容
    const observationTemplate = EDUCATOR_OBSERVATIONS[educator.id]?.[primaryDim]?.[level]
    const content = observationTemplate ? observationTemplate(childName) : `${educator.name}从${getWilderDimName(primaryDim)}维度进行了观察分析。`

    dialogues.push({
      round: 1,
      speakerId: educator.id,
      speakerName: educator.name,
      speakerAvatar: educator.avatar,
      type: 'observation',
      content,
      targetDimensions: [primaryDim]
    })
  })

  return dialogues
}

/**
 * 生成第2轮讨论发言
 */
function generateRound2Discussions(
  childName: string,
  wilderScores: Record<string, number>,
  sortedEducators: EducatorProfile[]
): EducatorDialogue[] {
  const dialogues: EducatorDialogue[] = []

  // 检查哪些经典辩论被触发
  const triggeredDebates = CLASSIC_DEBATES.filter(debate => debate.triggerCondition(wilderScores))

  // 生成辩论对话
  triggeredDebates.slice(0, 2).forEach((debate) => {
    const debateContent = debate.generateDebate(childName, wilderScores)

    dialogues.push({
      round: 2,
      speakerId: debateContent.firstSpeaker.id,
      speakerName: EDUCATORS.find(e => e.id === debateContent.firstSpeaker.id)?.name || '',
      speakerAvatar: EDUCATORS.find(e => e.id === debateContent.firstSpeaker.id)?.avatar || '',
      type: 'debate',
      content: debateContent.firstSpeaker.content,
      targetDimensions: debate.pair.includes('piaget') || debate.pair.includes('vygotsky')
        ? ['I', 'R']
        : debate.pair.includes('montessori') || debate.pair.includes('herbart')
          ? ['W', 'D']
          : debate.pair.includes('dewey') || debate.pair.includes('rousseau')
            ? ['I', 'L']
            : debate.pair.includes('froebel') || debate.pair.includes('comenius')
              ? ['E']
              : ['L', 'R'],
      respondingTo: debateContent.secondSpeaker.id
    })

    dialogues.push({
      round: 2,
      speakerId: debateContent.secondSpeaker.id,
      speakerName: EDUCATORS.find(e => e.id === debateContent.secondSpeaker.id)?.name || '',
      speakerAvatar: EDUCATORS.find(e => e.id === debateContent.secondSpeaker.id)?.avatar || '',
      type: 'debate',
      content: debateContent.secondSpeaker.content,
      targetDimensions: dialogues[dialogues.length - 1].targetDimensions,
      respondingTo: debateContent.firstSpeaker.id
    })
  })

  // 添加其他学家的补充建议
  const debatedIds = dialogues.map(d => d.speakerId)
  const otherEducators = sortedEducators.filter(e => !debatedIds.includes(e.id)).slice(0, 3)

  otherEducators.forEach(educator => {
    const focusDim = educator.wilderFocus[0]
    const suggestionContent = generateSuggestionContent(educator, childName, focusDim, wilderScores[focusDim] || 50)

    dialogues.push({
      round: 2,
      speakerId: educator.id,
      speakerName: educator.name,
      speakerAvatar: educator.avatar,
      type: 'suggestion',
      content: suggestionContent,
      targetDimensions: [focusDim]
    })
  })

  return dialogues
}

/**
 * 生成建议内容
 */
function generateSuggestionContent(
  educator: EducatorProfile,
  childName: string,
  dimension: string,
  score: number
): string {
  const level = getScoreLevel(score)
  const dimName = getWilderDimName(dimension)

  // 使用模板库
  const template = EDUCATOR_OBSERVATIONS[educator.id]?.[dimension]?.[level]
  if (template) {
    return template(childName)
  }

  // 备用内容
  const suggestions: Record<string, string> = {
    high: `从${dimName}维度看，${childName}表现出色。${educator.coreTheory}的视角下，建议进一步拓展这一优势领域。`,
    mid: `${childName}的${dimName}处于发展中阶段。结合${educator.name}的教育理念，可以通过日常活动逐步提升。`,
    low: `${dimName}是${childName}可以重点培养的领域。${educator.name}会建议从兴趣入手，循序渐进地引导。`
  }

  return suggestions[level]
}

/**
 * 生成第3轮共识
 */
function generateRound3Consensus(
  childName: string,
  topDimensions: string[],
  weakDimensions: string[],
  wilderScores: Record<string, number>,
  allDialogues: EducatorDialogue[]
): { consensusPoints: ConsensusPoint[]; divergencePoints: DivergencePoint[]; finalDialogues: EducatorDialogue[] } {
  const consensusPoints: ConsensusPoint[] = []
  const divergencePoints: DivergencePoint[] = []
  const finalDialogues: EducatorDialogue[] = []

  // 根据top维度生成共识
  topDimensions.forEach((dim, _index) => {
    const dimName = getWilderDimName(dim)
    const level = getScoreLevel(wilderScores[dim] || 50)

    // 找出关注该维度的学家
    const relevantEducators = EDUCATORS.filter(e => e.wilderFocus.includes(dim))

    if (relevantEducators.length >= 3) {
      consensusPoints.push({
        title: level === 'high'
          ? `继续发展${dimName}优势`
          : `培养${dimName}能力`,
        supporters: relevantEducators.slice(0, 4).map(e => e.name),
        recommendation: level === 'high'
          ? `${childName}在${dimName}方面有突出表现，建议提供更具挑战性的任务和更广阔的实践平台，让优势成为真正的竞争力。`
          : `${childName}的${dimName}有良好基础，建议通过日常活动和小项目持续培养，逐步建立自信和能力。`,
        rationale: relevantEducators[0].keyPrinciples[0] || '尊重儿童的发展规律'
      })
    }
  })

  // 根据weak维度生成需要关注的点
  weakDimensions.forEach(dim => {
    const dimName = getWilderDimName(dim)
    const relevantEducators = EDUCATORS.filter(e => e.wilderFocus.includes(dim))

    if (relevantEducators.length >= 2) {
      consensusPoints.push({
        title: `关注${dimName}的发展`,
        supporters: relevantEducators.slice(0, 3).map(e => e.name),
        recommendation: `${childName}的${dimName}是可以通过系统培养提升的领域。建议在日常生活中创造相关练习机会，不急不躁，静待花开。`,
        rationale: relevantEducators[0].keyPrinciples[0] || '每个孩子都有自己的发展节奏'
      })
    }
  })

  // 从辩论中提取分歧点
  const debates = allDialogues.filter(d => d.type === 'debate')
  if (debates.length >= 2) {
    const debateTopics = CLASSIC_DEBATES.filter(d => d.triggerCondition(wilderScores))
    debateTopics.slice(0, 1).forEach(debate => {
      divergencePoints.push({
        topic: debate.topic,
        perspectives: debate.pair.map(id => {
          const educator = EDUCATORS.find(e => e.id === id)
          return {
            educatorId: id,
            educatorName: educator?.name || '',
            position: educator?.coreTheory || ''
          }
        }),
        parentGuidance: '这两种视角都有价值，家长可以根据孩子的具体情况和家庭教育理念，选择最适合的方式。教育的本质是爱与智慧的平衡。'
      })
    })
  }

  // 陶行知做最终总结
  const taoEducator = EDUCATORS.find(e => e.id === 'tao')!
  finalDialogues.push({
    round: 3,
    speakerId: 'tao',
    speakerName: taoEducator.name,
    speakerAvatar: taoEducator.avatar,
    type: 'consensus',
    content: `作为本次圆桌讨论的主持人，我代表各位教育同仁做以下总结：\n\n第一，${childName}是一个独特而珍贵的生命，TA的每一个特质都值得被看见和尊重。\n\n第二，教育的本质是"教学做合一"——在真实的生活中学习、在具体的实践中成长。无论是发展优势还是补足短板，都应源于真实的生活需要。\n\n第三，各位同仁的观点虽然有所不同，但殊途同归——都是为了让孩子成为最好的自己。家长可以结合自己的教育理念和${childName}的实际情况，从多元视角中汲取智慧。\n\n最后，请记住：每个孩子都是一颗独特的种子，教育是提供阳光、水分和肥沃的土壤，然后——耐心等待花开。`,
    targetDimensions: ['W', 'I', 'L', 'D', 'E', 'R']
  })

  return { consensusPoints, divergencePoints, finalDialogues }
}

/**
 * 生成行动计划
 */
function generateActionPlan(
  childName: string,
  _consensusPoints: ConsensusPoint[],
  topDimensions: string[],
  weakDimensions: string[]
): ActionItem[] {
  const actions: ActionItem[] = []

  // 基于top维度生成高优先级行动
  topDimensions.slice(0, 2).forEach(dim => {
    const dimName = getWilderDimName(dim)
    const educator = EDUCATORS.find(e => e.wilderFocus.includes(dim))

    actions.push({
      priority: 'high',
      action: `为${childName}设计与${dimName}相关的挑战项目或深度活动`,
      source: educator?.name || '教育专家团队',
      timeframe: '本周',
      targetDim: dim
    })
  })

  // 基于weak维度生成中优先级行动
  weakDimensions.slice(0, 2).forEach(dim => {
    const dimName = getWilderDimName(dim)
    const educator = EDUCATORS.find(e => e.wilderFocus.includes(dim))

    actions.push({
      priority: 'medium',
      action: `在日常生活中创造${dimName}的练习机会`,
      source: educator?.name || '教育专家团队',
      timeframe: '1个月内',
      targetDim: dim
    })
  })

  // 添加长期行动
  actions.push({
    priority: 'low',
    action: `建立${childName}的成长档案，记录每一步进步和变化`,
    source: '陶行知',
    timeframe: '长期',
    targetDim: 'R'
  })

  actions.push({
    priority: 'medium',
    action: '每周安排家庭分享时间，让孩子表达自己的想法和感受',
    source: '苏霍姆林斯基',
    timeframe: '本周',
    targetDim: 'E'
  })

  return actions
}

// ========== 核心导出函数 ==========

/**
 * 生成教育学家圆桌讨论结果
 */
export function generateEducatorPanel(
  wilderScores: Record<string, number>,
  wilderLevels: Record<string, string>,
  childName: string,
  age: number,
  topDimensions: string[],
  weakDimensions: string[]
): EducatorPanelResult {
  // 生成会话标题
  const sessionTitle = `${childName}的成长圆桌讨论`

  // 生成孩子画像
  const childProfile = generateChildProfile(childName, age, wilderScores, topDimensions, weakDimensions)

  // 根据匹配度排序学家
  const sortedEducators = sortEducatorsByRelevance(topDimensions, weakDimensions)

  // 第1轮：各抒己见
  const round1Dialogues = generateRound1Observations(
    childName,
    wilderScores,
    wilderLevels,
    topDimensions,
    weakDimensions,
    sortedEducators
  )

  // 第2轮：交锋讨论
  const round2Dialogues = generateRound2Discussions(
    childName,
    wilderScores,
    sortedEducators
  )

  // 合并前两轮对话
  const allDialogues = [...round1Dialogues, ...round2Dialogues]

  // 第3轮：形成共识
  const { consensusPoints, divergencePoints, finalDialogues } = generateRound3Consensus(
    childName,
    topDimensions,
    weakDimensions,
    wilderScores,
    allDialogues
  )

  // 合并所有对话
  const dialogues = [...allDialogues, ...finalDialogues]

  // 生成最终建议
  const finalRecommendation = generateFinalRecommendation(childName, consensusPoints, divergencePoints)

  // 生成行动计划
  const actionPlan = generateActionPlan(childName, consensusPoints, topDimensions, weakDimensions)

  return {
    sessionTitle,
    childProfile,
    dialogues,
    consensusPoints,
    divergencePoints,
    finalRecommendation,
    actionPlan
  }
}

// ========== 额外导出 ==========

export { EDUCATOR_OBSERVATIONS, CLASSIC_DEBATES }
