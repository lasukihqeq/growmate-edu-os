/**
 * GROWMATE销售话术知识库
 * 基于WILDER六维度测评结果，生成个性化销售策略
 * 品牌语调：专业而不晦涩、温暖而不矫情、有趣而不轻浮、自信而不傲慢
 */

// ==================== 类型定义 ====================

export interface ChildProfile {
  type: string; typeEn: string; icon: string; tagline: string; description: string
  wilderPattern: { high: string[]; low: string[] }
  behaviorTraits: string[]
  explorationMode: { name: string; icon: string; description: string }
  attentionPattern: { name: string; description: string }
  socialMode: { name: string; description: string }
}

export interface SalesStrategy {
  parentPainPoints: { pain: string; response: string }[]
  courseRecommendations: { course: string; reason: string; priority: number }[]
  bestTiming: string[]
  objectionHandling: { objection: string; response: string }[]
  closingPoints: string[]
  communicationScript: { scene: string; script: string }[]
}

// ==================== 8种核心画像类型 ====================

export const CHILD_PROFILES: Record<string, ChildProfile> = {
  'agile-explorer': {
    type: '灵动探索者', typeEn: 'Agile Explorer', icon: '🦋',
    tagline: '好奇心是他最稀缺的潜能',
    description: '对世界充满好奇，兴趣广泛但转换频繁。像蝴蝶一样在不同领域间穿梭，每次停留都有真实投入。',
    wilderPattern: { high: ['W', 'I'], low: ['D', 'R'] },
    behaviorTraits: ['课堂上看到窗外蝴蝶会立即去观察', '能连续追踪蚂蚁15分钟蹲地不动', '拆旧玩具研究弹簧原理半小时', '房间里充满"半成品"——画到一半的画、拼到一半的积木', '开始10个项目，完成2-3个'],
    explorationMode: { name: '火焰型点燃', icon: '🔥', description: '微小变化都能激发探索欲。是科学家、发明家、探险家的核心特质。' },
    attentionPattern: { name: '脉冲式专注', description: '短暂高峰→快速转移→再次点燃。创意工作中是优势。' },
    socialMode: { name: '热情发起者', description: '从社交互动中获取能量，喜欢分享发现、当"导游"。' },
  },
  'deep-thinker': {
    type: '深度思考者', typeEn: 'Deep Thinker', icon: '🔬',
    tagline: '他的思考深度远超同龄人',
    description: '安静但内心丰富，喜欢深入钻研。一旦找到感兴趣的方向，展现惊人的专注力和洞察力。',
    wilderPattern: { high: ['I', 'R'], low: ['E', 'L'] },
    behaviorTraits: ['一个人能安静看书或研究2小时以上', '问的问题常让大人不知怎么回答', '喜欢自己做实验、做笔记记录发现', '小组活动中偏好安静观察', '做完的作品虽少但完成度极高'],
    explorationMode: { name: '钻井型深挖', icon: '⛏️', description: '在一个点上深度挖掘直到理解透彻。是学者、工程师的核心特质。' },
    attentionPattern: { name: '恒流式专注', description: '一旦进入状态长时间保持。启动较慢，需安静环境。' },
    socialMode: { name: '选择性深交', description: '朋友不多但关系很深，更享受一对一深度交流。' },
  },
  'creative-builder': {
    type: '创意建造者', typeEn: 'Creative Builder', icon: '🏗️',
    tagline: '他能把想象变成现实',
    description: '动手能力强，不满足于观察，总想亲手做点什么，在创造过程中学习和成长。',
    wilderPattern: { high: ['D', 'W'], low: ['R', 'L'] },
    behaviorTraits: ['用纸箱胶带能搭建复杂结构', '看到有趣的东西就想"我也做一个"', '对乐高、编程、木工特别热衷', '经常改造家里的物品', '画设计图比实际执行更让他兴奋'],
    explorationMode: { name: '工坊型创造', icon: '🔨', description: '通过"做"来理解世界。是设计师、工程师、创业者的核心特质。' },
    attentionPattern: { name: '项目式沉浸', description: '有具体产出物的任务能让他全力以赴。' },
    socialMode: { name: '协作型搭档', description: '在团队项目中表现出色，喜欢和志同道合的人一起"搞事情"。' },
  },
  'empathic-connector': {
    type: '共情联结者', typeEn: 'Empathic Connector', icon: '🤝',
    tagline: '他能感受到别人感受不到的',
    description: '对人的情感有天然感知力，善于建立和维护关系。在团队中是天然的"粘合剂"。',
    wilderPattern: { high: ['L', 'E'], low: ['I', 'D'] },
    behaviorTraits: ['能察觉到妈妈"没说出口的不开心"', '班里有同学被孤立时主动陪伴', '擅长协调同学间的矛盾', '讲故事时能准确抓住听众情绪', '对动物植物也表现出关心和照顾'],
    explorationMode: { name: '触角型感知', icon: '🌊', description: '通过"感受"来理解世界。是咨询师、教师、管理者的核心特质。' },
    attentionPattern: { name: '关系驱动式', description: '人际互动越丰富越专注。独处时容易失去动力。' },
    socialMode: { name: '深度维护者', description: '擅长深度维护关系，是团队中的"情感中枢"。' },
  },
  'expressive-performer': {
    type: '表达展示者', typeEn: 'Expressive Performer', icon: '🎭',
    tagline: '他天生就是舞台的中心',
    description: '语言表达能力突出，能把复杂的事情讲得生动有趣，是天生的"故事讲述者"。',
    wilderPattern: { high: ['E', 'W'], low: ['R', 'D'] },
    behaviorTraits: ['课堂上最积极举手发言', '能把普通的事讲得绘声绘色', '喜欢模仿大人说话、表演角色', '遇到不公平会大声说出来', '朋友圈子大，是"社交达人"'],
    explorationMode: { name: '舞台型展现', icon: '🎤', description: '通过"说"和"演"来理解世界。是主持人、律师、传媒人的核心特质。' },
    attentionPattern: { name: '观众驱动式', description: '有观众时表现特别出色，需要反馈来维持动力。' },
    socialMode: { name: '中心辐射型', description: '天然的社交中心，能快速建立广泛人际网络。' },
  },
  'reflective-strategist': {
    type: '反思策略者', typeEn: 'Reflective Strategist', icon: '🧭',
    tagline: '他比同龄人看得更远',
    description: '善于总结和规划，有超越年龄的"元认知"能力。不只做事，更思考"为什么"和"怎样更好"。',
    wilderPattern: { high: ['R', 'D'], low: ['W', 'E'] },
    behaviorTraits: ['做完事后自己总结改进方向', '制定计划并坚持执行', '游戏中是"策略型"玩家', '能清楚说出自己的优缺点', '面对失败会分析原因'],
    explorationMode: { name: '棋手型推演', icon: '♟️', description: '通过"想"来理解世界。是战略顾问、项目经理、企业家的核心特质。' },
    attentionPattern: { name: '目标导向式', description: '有明确目标时专注力极强，需要理解"为什么"。' },
    socialMode: { name: '观察型参与者', description: '先观察后参与，在团队中常扮演"军师"角色。' },
  },
  'nature-guardian': {
    type: '自然守护者', typeEn: 'Nature Guardian', icon: '🌿',
    tagline: '大自然是他最好的老师',
    description: '对自然有天然亲近感，在自然环境中表现出最好的状态和最强的学习力。',
    wilderPattern: { high: ['W', 'L'], low: ['D', 'E'] },
    behaviorTraits: ['一到户外就像换了个人', '能记住各种动植物名字', '对小动物有天然亲近感', '在室内待久了会烦躁', '喜欢收集石头、树叶、标本'],
    explorationMode: { name: '感官型浸润', icon: '🍃', description: '通过多感官体验理解世界。是自然科学家、生态保护者的核心特质。' },
    attentionPattern: { name: '环境敏感式', description: '自然环境中专注力最佳。封闭空间会削弱表现。' },
    socialMode: { name: '同好型聚集', description: '在有共同兴趣的群体中最自在。' },
  },
  'balanced-grower': {
    type: '均衡成长者', typeEn: 'Balanced Grower', icon: '🌱',
    tagline: '均衡发展，潜力无限',
    description: '六维度相对均衡，有很好的发展基础，关键是找到突破口引导形成优势。',
    wilderPattern: { high: [], low: [] },
    behaviorTraits: ['各科比较平均', '什么都愿意尝试但还没找到"最爱"', '适应能力强', '家长觉得"挺好的"但说不上"特别在哪"', '需要更多元的体验来激发潜在优势'],
    explorationMode: { name: '全频型扫描', icon: '📡', description: '对各类体验都有基础好奇心，需要足够多样的刺激找到"引爆点"。' },
    attentionPattern: { name: '适应式灵活', description: '能根据环境调整节奏。关键是找到让他"眼睛发光"的领域。' },
    socialMode: { name: '适应性社交', description: '各种社交场景都能适应，还没找到最舒适的定位。' },
  },
  // ==================== 补充的8种潜能画像 ====================
  'systematic-researcher': {
    type: '系统研究员', typeEn: 'Systematic Researcher', icon: '🔎',
    tagline: '他能把复杂问题变成清晰答案',
    description: '兼具探究深度和设计规划能力，善于用系统化方法解决复杂问题。是天生的问题解决者。',
    wilderPattern: { high: ['I', 'D'], low: ['E', 'L'] },
    behaviorTraits: ['遇到问题先列计划再行动', '做实验前会画流程图', '喜欢把发现整理成笔记本', '能在一个项目上持续投入很长时间', '作品数量不多但每个都很完整'],
    explorationMode: { name: '工程师型求解', icon: '⚙️', description: '把好奇心转化为可执行的研究计划。是科学家、工程师的核心特质。' },
    attentionPattern: { name: '项目沉浸式', description: '有明确目标的长期项目最能吸引他，过程中高度专注。' },
    socialMode: { name: '专业型搭档', description: '在专业性强的小组中能发挥重要作用，但需要志同道合的伙伴。' },
  },
  'collaborative-explorer': {
    type: '协作探索者', typeEn: 'Collaborative Explorer', icon: '🧭',
    tagline: '他在团队中发现世界的奥秘',
    description: '既有探究精神又善于团队协作，能在与他人的互动中激发更深入的发现。',
    wilderPattern: { high: ['I', 'L'], low: ['E', 'D'] },
    behaviorTraits: ['喜欢和同学一起做实验', '讨论中能提出关键问题', '善于整合不同人的观点', '在小组研究中常是核心推动者', '能把复杂发现讲给同伴听'],
    explorationMode: { name: '团队求证型', icon: '🤜🤛', description: '通过协作探索加深对事物的理解。是研究团队leader的核心特质。' },
    attentionPattern: { name: '互动激发式', description: '在有质量的讨论和合作中专注力达到峰值。' },
    socialMode: { name: '知识共建者', description: '在探索型社交中最活跃，能把社交变成学习机会。' },
  },
  'science-communicator': {
    type: '科学传播者', typeEn: 'Science Communicator', icon: '📢',
    tagline: '他能让复杂知识变得生动有趣',
    description: '既有探究深度又有表达潜能，能把复杂的发现用生动的语言传播出去。',
    wilderPattern: { high: ['I', 'E'], low: ['D', 'L'] },
    behaviorTraits: ['看完科普书会迫不及待讲给别人', '喜欢当"小老师"解释知识', '能把抽象概念用比喻说清楚', '爱写科学日记或拍科普视频', '课堂上举手发言分享发现'],
    explorationMode: { name: '传播型学习', icon: '📡', description: '通过"教"来深化"学"。是科普作家、教师的核心特质。' },
    attentionPattern: { name: '输出驱动式', description: '有分享机会时专注力倍增，"讲出来"是他最好的学习方式。' },
    socialMode: { name: '知识分享者', description: '社交中常扮演"讲解员"角色，通过分享知识建立连接。' },
  },
  'harmony-facilitator': {
    type: '和谐促进者', typeEn: 'Harmony Facilitator', icon: '⚖️',
    tagline: '他能让团队更默契',
    description: '高度联结力和反思力让他成为团队的"粘合剂"，善于化解矛盾、促进共识。',
    wilderPattern: { high: ['L', 'R'], low: ['W', 'D'] },
    behaviorTraits: ['能感知到团队里的"不对劲"', '主动帮助调解同学矛盾', '会思考"怎样让大家都舒服"', '活动结束后会回顾团队配合情况', '在乎团队里每个人的感受'],
    explorationMode: { name: '关系观察型', icon: '👁️', description: '对人际关系有敏锐洞察，通过理解他人来理解世界。是咨询师、HR的核心特质。' },
    attentionPattern: { name: '关系觉察式', description: '在处理人际关系时专注力最强，对情绪变化高度敏感。' },
    socialMode: { name: '和事佬', description: '自然而然成为团队的情感纽带和矛盾调解人。' },
  },
  'project-manager': {
    type: '项目统筹师', typeEn: 'Project Manager', icon: '📋',
    tagline: '他能让团队高效运转',
    description: '联结力和设计力的组合使他成为天生的组织者，善于协调资源、推进项目。',
    wilderPattern: { high: ['L', 'D'], low: ['W', 'I'] },
    behaviorTraits: ['小组活动中主动分配任务', '能记住每个人擅长什么', '做事前喜欢"开个小会"', '用表格或清单管理进度', '能把松散的团队凝聚起来'],
    explorationMode: { name: '统筹协调型', icon: '📊', description: '通过组织和协调来推动事情发展。是项目经理、班长的核心特质。' },
    attentionPattern: { name: '进度追踪式', description: '在管理项目进度时高度专注，喜欢事情"在掌控中"。' },
    socialMode: { name: '组织枢纽', description: '自然成为团队的组织中心，善于连接不同角色。' },
  },
  'creative-presenter': {
    type: '创意演绎家', typeEn: 'Creative Presenter', icon: '🎬',
    tagline: '他能把想法变成精彩演出',
    description: '设计力和表达力的结合，让他能把精心策划的内容以精彩的方式呈现。',
    wilderPattern: { high: ['D', 'E'], low: ['I', 'L'] },
    behaviorTraits: ['做PPT或海报特别用心', '表演前会反复排练', '能把普通的内容变得有创意', '喜欢策划活动再亲自主持', '追求作品的"完美呈现"'],
    explorationMode: { name: '作品打磨型', icon: '💎', description: '从构思到呈现的全流程都追求卓越。是导演、策展人的核心特质。' },
    attentionPattern: { name: '完美主义式', description: '在创作和演绎过程中高度投入，对细节有执着追求。' },
    socialMode: { name: '舞台中心', description: '喜欢被关注，在展示作品时最有魅力。' },
  },
  'quality-optimizer': {
    type: '品质优化师', typeEn: 'Quality Optimizer', icon: '📈',
    tagline: '他能让一切变得更好',
    description: '设计力和反思力的组合让他成为"精益求精"的代名词，善于持续改进。',
    wilderPattern: { high: ['D', 'R'], low: ['W', 'L'] },
    behaviorTraits: ['做完事后会想"哪里还能更好"', '会给自己设定改进目标', '喜欢优化学习方法和流程', '作品修改多次才"满意"', '能清楚说出每次改进的原因'],
    explorationMode: { name: '迭代优化型', icon: '🔄', description: '通过不断迭代让事情越做越好。是产品经理、质量工程师的核心特质。' },
    attentionPattern: { name: '目标追踪式', description: '有明确改进目标时专注力极强，享受"进步的过程"。' },
    socialMode: { name: '默默精进', description: '不太在乎社交评价，更关注自我标准的达成。' },
  },
  'reflective-speaker': {
    type: '沉思表达者', typeEn: 'Reflective Speaker', icon: '💭',
    tagline: '他的话语有思想的重量',
    description: '表达力和反思力的结合让他的分享有深度和洞察，能引发他人思考。',
    wilderPattern: { high: ['E', 'R'], low: ['W', 'D'] },
    behaviorTraits: ['发言前会仔细想好要说什么', '喜欢写日记记录感悟', '说出的话常让人"醍醐灌顶"', '能把个人经历讲成有启发的故事', '分享后会反思表达效果'],
    explorationMode: { name: '内省分享型', icon: '🪷', description: '通过向内反思和向外表达的循环深化认知。是作家、演讲者的核心特质。' },
    attentionPattern: { name: '沉淀输出式', description: '需要内省沉淀时间，但一旦开口就有真知灼见。' },
    socialMode: { name: '思想领袖', description: '不追求广泛社交，但在深度交流中有强大影响力。' },
  },
}

// ==================== 销售策略知识库 ====================

export const SALES_STRATEGIES: Record<string, SalesStrategy> = {
  'agile-explorer': {
    parentPainPoints: [
      { pain: '"孩子什么都想学，但三分钟热度，兴趣班报了一堆都不长久"', response: '这恰恰说明他的好奇心特别强——WILDER中W维度极高。三分钟热度不是问题，而是他还没找到能持续"点燃"的环境。GROWMATE的课程每次都有新发现，是户外真实探索而不是教室里重复练习，正适合他的"火焰型点燃"模式。' },
      { pain: '"上课坐不住，老师总说注意力不集中"', response: '测评数据显示他的注意力是"脉冲式"——在感兴趣的事情上能专注30分钟以上。在GROWMATE的户外课上，每5-10分钟就有新发现任务，完美匹配他的专注节奏。很多这类孩子在我们课上的表现让家长惊讶。' },
      { pain: '"做事总是虎头蛇尾，画到一半就去做别的"', response: '这反映设计力和反思力还需训练——好消息是，8-12岁是前额叶发育关键期，现在训练效果最好。我们课程设计了"探索-发现-记录-展示"的完整闭环，每次课都帮他练习"完成一件事的成就感"。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·自然探索营', reason: '满足好奇心，每次新主题新发现', priority: 1 },
      { course: 'GROWMATE·小小科学家', reason: '从观察到记录到展示，训练闭环能力', priority: 2 },
      { course: 'GROWMATE·昆虫研究员', reason: '追踪蚂蚁说明他适合深度观察主题', priority: 3 },
      { course: 'GROWMATE·自然笔记班', reason: '把"看到"变成"记下来"，练习反思力', priority: 4 },
    ],
    bestTiming: ['孩子刚从户外玩回来兴奋地分享发现时——趁热打铁', '家长抱怨"又报了个班不想去了"时——提供差异化方案', '学校家长会后被老师说"坐不住"时——提供专业解读', '春秋季户外活动旺季——自然体验需求最强'],
    objectionHandling: [
      { objection: '"他兴趣班已经很多了，不想再加了"', response: '完全理解。我们的建议恰恰相反——不是加，而是做减法。测评显示他的核心需求是"户外真实探索"，这不是另一个兴趣班，而是帮他找到真正能持续投入的方向。很多家长体验后反而砍掉了2-3个不适合的班。' },
      { objection: '"户外不安全，我比较担心"', response: '安全是我们的第一承诺。每次活动师生比不超过1:6，所有引导员持有急救证书，6年累计服务10000+家庭，零安全事故。让孩子在专业指导下接触自然，比他自己偷偷跑出去玩安全得多。' },
      { objection: '"学校功课那么多，哪有时间"', response: '我们的课程都在周末，每次2-3小时。研究表明，高好奇心的孩子户外活动后学习效率提升20-30%。很多家长反馈上完课回来写作业特别专注——因为"探索需求"被满足了。' },
    ],
    closingPoints: ['他的好奇心在WILDER评测中属于前5%——这是AI时代最稀缺的能力', '8-12岁是训练执行闭环能力的黄金窗口，错过要花3倍努力', '先体验一次，让孩子自己选择——相信他的眼睛会发光', '我们有90天成长追踪，不是上完课就结束'],
    communicationScript: [
      { scene: '首次电话/微信沟通', script: 'XX妈妈/爸爸您好，我看了XX的测评报告，他的好奇心维度得分非常高——这在我们评测过的5万多个孩子中属于前5%。这真的是很了不起的潜能。我想和您聊聊，怎样把这个潜能变成真正的优势，而不是被误解为"坐不住"。您这周有15分钟方便聊聊吗？' },
      { scene: '面对面咨询开场', script: '先给您看一个数据——XX在WILDER好奇心维度的得分是[分数]，这意味着在同龄孩子中他属于"极致好奇"型。这种特质在达芬奇、爱因斯坦身上都能看到。但如果不正确引导，很容易被标签化为"多动""不专心"。今天我们要聊的是：怎样保护这个潜能，同时补上执行闭环的短板。' },
      { scene: '促成报课', script: '我建议先从"自然探索营"开始，这是最匹配XX特点的入门课。每次课都有全新主题，满足好奇心；同时有"探索→发现→记录→展示"的完整流程，在不知不觉中训练闭环能力。我们本月有体验课名额，要不先让XX感受一下？' },
    ],
  },
  'deep-thinker': {
    parentPainPoints: [
      { pain: '"孩子太安静了，不爱说话，我怕他社交有问题"', response: '测评显示他的探究力和反思力非常强——不是不会社交，是"选择性社交"。更喜欢有深度的一对一交流。在GROWMATE的小组探究中，能找到志同道合的小伙伴。' },
      { pain: '"做事太慢了，别人都做完了他还在磨蹭"', response: '慢不是问题，"慢"背后是"深"。测评数据显示他的作品完成度极高——他不是在磨蹭，是在"打磨"。我们的课程允许按自己的节奏探索，不赶进度。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·小小科学家', reason: '深度探究主题，允许慢节奏深挖', priority: 1 },
      { course: 'GROWMATE·自然笔记班', reason: '观察+记录+分析，匹配思考型特质', priority: 2 },
      { course: 'GROWMATE·生态观察员', reason: '长期追踪项目，满足深度钻研需求', priority: 3 },
    ],
    bestTiming: ['孩子分享自己的"发现"或"研究成果"时', '家长担心孩子"太安静""没朋友"时', '学校强调速度让孩子感到压力时'],
    objectionHandling: [
      { objection: '"他那么安静，户外活动适合他吗？"', response: '户外不等于闹腾。我们有很多安静的探索环节——用放大镜观察树皮、追踪足迹、画自然笔记。安静的孩子在这些环节中反而最专注、发现最多。' },
      { objection: '"他已经很喜欢看书了，需要户外吗？"', response: '书本+真实体验=1+1>2。加上"亲手触摸""亲眼观察"的维度，理解深度会有质的飞跃。' },
    ],
    closingPoints: ['深度思考者需要"对的环境"——GROWMATE提供不被催促的探索空间', '他需要同类——在这里能遇到同样热爱探究的伙伴', '从"书本知识"到"亲手验证"，是质的突破'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX的探究力和反思力得分特别突出——他有一种很珍贵的"深度思考"潜能。这类孩子在传统课堂上可能显得"安静"，但在对的环境中会是最有洞察力的那个。' },
      { scene: '促成报课', script: '推荐从"小小科学家"系列开始。有长期追踪项目，每次课不是走马观花而是深入探究——匹配XX"钻井型深挖"的学习风格。小班制6-8人，不会被打扰。' },
    ],
  },
  'creative-builder': {
    parentPainPoints: [
      { pain: '"孩子总是把家里搞得乱七八糟"', response: '这说明他的设计力和好奇心都很强——"乱"是创造力的副产品。GROWMATE给他专门的"创造空间"——用自然材料搭建创造，让能力有正确出口。' },
      { pain: '"只喜欢动手，不爱看书学知识"', response: '他不是不爱学，是"做着学"比"看着学"更适合。我们的课程就是"边做边学"：搭鸟巢理解结构力学，做标本学分类学。知识在动手中自然吸收。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·自然工坊', reason: '用自然材料创造，满足动手欲', priority: 1 },
      { course: 'GROWMATE·生态建造师', reason: '搭鸟巢建庇护所，项目制学习', priority: 2 },
      { course: 'GROWMATE·野外生存技能', reason: '实用技能+动手操作', priority: 3 },
    ],
    bestTiming: ['孩子展示"作品"或"发明"时', '家长为家里乱发愁时', '学校手工课表现突出时'],
    objectionHandling: [
      { objection: '"已经在学编程/乐高了"', response: '不冲突，反而互补。编程和乐高是标准化创造，GROWMATE是用真实自然材料创造——更锻炼适应能力和创造力。' },
    ],
    closingPoints: ['从虚拟创造到真实创造，打通全感官学习通道', '每次课都有实体作品——他能带回家一个"成果"'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX是典型的"创意建造者"——设计力和好奇心都很强。最大需求就是"给我材料让我做"。我们有自然工坊课，用真实自然材料创造，非常适合他。' },
    ],
  },
  'empathic-connector': {
    parentPainPoints: [
      { pain: '"孩子太敏感了，同学说句重话就哭"', response: '高敏感不是弱点，是稀有能力——他能感知到别人感知不到的情绪细节。GROWMATE的户外环境能帮他学会在开放空间中管理情绪。' },
      { pain: '"总是操心别人的事，自己的倒顾不上"', response: '这是"共情联结者"的典型特质。在GROWMATE，我们引导这种能力往"团队领导力"方向发展。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·团队探索营', reason: '在团队协作中发挥联结力优势', priority: 1 },
      { course: 'GROWMATE·自然守护者', reason: '把对人的关心扩展到对自然的关心', priority: 2 },
    ],
    bestTiming: ['孩子因同学关系受挫时', '家长希望培养领导力时', '孩子表现出对动物/植物的关爱时'],
    objectionHandling: [
      { objection: '"他这么敏感，户外会不会不适应？"', response: '自然环境其实是高敏感孩子最好的"减压场"。森林的声音、微风、阳光对情绪有天然的疗愈作用。' },
    ],
    closingPoints: ['在自然中，敏感不是弱点而是超能力', '团队探索让共情力变成领导力'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX的联结力非常强，对周围人的情绪有超越年龄的感知力。这是一种非常珍贵的潜能。我想聊聊如何保护这种潜能的同时，帮他建立更好的情绪边界。' },
    ],
  },
  'expressive-performer': {
    parentPainPoints: [
      { pain: '"话太多了，上课老被老师批评讲话"', response: '他不是"话多"，是表达欲强——WILDER中E维度高。关键是给他正确的"出口"。GROWMATE每次课都有"发现分享"环节，让他尽情表达。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·自然讲解员', reason: '把表达欲转化为专业讲解能力', priority: 1 },
      { course: 'GROWMATE·自然戏剧', reason: '通过角色扮演在自然中学习', priority: 2 },
    ],
    bestTiming: ['孩子绘声绘色分享经历时', '被老师说"上课讲话"时'],
    objectionHandling: [
      { objection: '"已经在学口才/主持了"', response: '口才班练"舞台上的表达"，GROWMATE练"真实场景中的观察和分享"。真情实感的表达力是口才班教不来的。' },
    ],
    closingPoints: ['从"话多被批评"到"表达被欣赏"，一个环境就能改变', '真实体验产生真情表达'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX的表达力在同龄孩子中非常突出。好的表达需要好的"素材"。GROWMATE给他提供真实的自然探索体验，让他有源源不断的精彩故事可以讲。' },
    ],
  },
  'reflective-strategist': {
    parentPainPoints: [
      { pain: '"做事太谨慎了，什么都想很久才动手"', response: '他不是犹豫，是"策略性思考"。反思力和设计力都很强——先想明白再行动。我们的项目式课程正好匹配。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·生态观察员', reason: '长期追踪项目匹配策略性学习', priority: 1 },
      { course: 'GROWMATE·野外生存技能', reason: '需要规划和执行力的挑战', priority: 2 },
    ],
    bestTiming: ['孩子展示"计划"或"总结"时', '家长觉得孩子"不够活泼"时'],
    objectionHandling: [
      { objection: '"他比较内敛，户外会不会太闹？"', response: '我们有大量观察、思考、记录环节。策略型孩子在这些环节中往往是组里的"灵魂人物"。' },
    ],
    closingPoints: ['策略型思维在户外项目中从"内向"变成"军师"', '真实复杂的自然环境是最好的策略训练场'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX的反思力和规划能力远超同龄人。在很多场景下他可能显得"谨慎"，其实是"策略性思维"。我们有专门适合这类孩子的项目式课程。' },
    ],
  },
  'nature-guardian': {
    parentPainPoints: [
      { pain: '"一到户外就不想回家，在家坐不住"', response: '他的身体在告诉你——他需要自然。在自然环境中专注力和学习力都是最优状态。与其在室内"较劲"，不如在户外给他高质量学习体验。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·全年自然探索', reason: '四季主题持续满足户外需求', priority: 1 },
      { course: 'GROWMATE·小小博物学家', reason: '系统学习自然知识', priority: 2 },
      { course: 'GROWMATE·夏令营/冬令营', reason: '沉浸式自然体验', priority: 3 },
    ],
    bestTiming: ['孩子从户外回来兴奋分享时', '春秋季活动高峰季', '孩子在室内烦躁不安时'],
    objectionHandling: [
      { objection: '"他就是喜欢玩，不是学习"', response: '在自然中"玩"就是最好的学习。追蝴蝶学观察力，搭石头学物理学，找虫子学分类学。GROWMATE让这种"玩"变成系统化的学习。' },
    ],
    closingPoints: ['他已经告诉你他需要什么了——自然就是最好的课堂', '把"爱玩"变成"专业"'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX是典型的"自然守护者"——大自然就是他的课堂。这类孩子在户外学习效率比室内高3-5倍。我们有全年四季自然探索课程。' },
    ],
  },
  'balanced-grower': {
    parentPainPoints: [
      { pain: '"觉得各方面都还行，但说不上特别出色在哪"', response: '均衡发展本身就是优势——基础好，可塑性极强。现在最重要的是给他足够多元的体验，找到"眼睛发光"的领域。GROWMATE每次课主题不同，正好是"潜能试金石"。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·自然探索营', reason: '多样化主题帮助发现兴趣方向', priority: 1 },
      { course: 'GROWMATE·综合体验课', reason: '全面接触不同类型活动', priority: 2 },
    ],
    bestTiming: ['家长犹豫"该报什么班"时', '孩子主动表达"想出去玩"时'],
    objectionHandling: [
      { objection: '"什么都行但不突出，值得报课吗？"', response: '正因为什么都行，现在最需要的是"找引爆点"。均衡的孩子一旦找到真正热爱的方向，爆发力惊人。我们的多主题课程就像自助餐，让他自己选最爱的那道菜。' },
    ],
    closingPoints: ['均衡不是没潜能，而是潜能在等待被激活', '多元体验是找到突破口的最佳方式'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX六维度评测显示发展很均衡——这是特别好的基础。关键是帮他找到"引爆点"。GROWMATE每次课主题不同，让他在体验中发现最热爱的方向。' },
    ],
  },

  // ==================== 补充的8种画像销售策略 ====================
  'systematic-researcher': {
    parentPainPoints: [
      { pain: '"孩子做事太慢，总是想半天才开始"', response: '这恰恰是"系统研究员"的特质——先想清楚再动手。测评显示他的探究力和设计力都很强，这种"谋定而后动"是科学家、工程师的核心素质。GROWMATE的项目制课程给他充分的规划和执行空间。' },
      { pain: '"不喜欢和别人一起，总是一个人研究"', response: '他不是不合群，是需要"专业级"的合作伙伴。在GROWMATE，我们会把同类型的孩子组成研究小组，让他在"同频"的伙伴中协作。' },
      { pain: '"只关心自己感兴趣的，其他都不在乎"', response: '深度专注是稀缺能力。我们的课程会基于他的兴趣点，引导向更广的知识网络拓展，"以深带广"。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·小小科学家', reason: '系统化的科学探究项目，匹配研究型思维', priority: 1 },
      { course: 'GROWMATE·生态观察员', reason: '长周期追踪项目，需要规划和执行力', priority: 2 },
      { course: 'GROWMATE·自然笔记班', reason: '观察-记录-分析的完整流程', priority: 3 },
      { course: 'GROWMATE·夏令营研学', reason: '沉浸式项目制学习体验', priority: 4 },
    ],
    bestTiming: ['孩子展示自己的"研究成果"时', '家长发现孩子在某个领域钻研很深时', '学校科学课表现突出时'],
    objectionHandling: [
      { objection: '"他已经很宅了，户外活动适合吗？"', response: 'GROWMATE不是"疯玩"，是在自然环境中进行系统化的科学探究。安静的观察、严谨的记录、长期的追踪——这些正是您孩子擅长的。' },
      { objection: '"学校作业很多，没时间做项目"', response: '每周2-3小时的高质量探究，比日复一日的重复练习更能激发潜能。很多家长反馈，孩子在项目中学到的研究方法反哺到了学科学习。' },
    ],
    closingPoints: ['系统性研究能力是AI时代最难被替代的能力', '让他在真实项目中验证自己的想法，这种成就感无可替代', '8-12岁是培养科学思维的黄金期'],
    communicationScript: [
      { scene: '首次电话沟通', script: 'XX妈妈您好，看了XX的测评报告，他的探究力和设计力都非常突出——这是典型的"系统研究员"特质。这类孩子需要的不是更多兴趣班，而是真正能让他沉浸进去的研究项目。您有10分钟我们聊聊吗？' },
      { scene: '面对面咨询', script: 'XX的特点是"谋定而后动"——先规划再执行。这在同龄孩子中很少见。GROWMATE有专门的长期追踪项目，从观察假设到实验验证，完整的科学研究流程，正好匹配他的学习风格。' },
      { scene: '促成报课', script: '推荐从"生态观察员"系列开始，这是一个为期8周的追踪项目。XX可以选择一个自己感兴趣的课题——比如追踪一种植物的生长，或记录某种昆虫的行为。最后有成果汇报，很有成就感。' },
    ],
  },
  'collaborative-explorer': {
    parentPainPoints: [
      { pain: '"孩子问题特别多，老师都被问烦了"', response: '爱提问是珍贵的探究潜能！问题是他的联结力也很强——既能深入思考，又擅长团队讨论。GROWMATE鼓励提问，我们的引导员会认真对待每一个问题。' },
      { pain: '"他总想拉着别人一起做实验"', response: '这说明他是"协作探索者"——在互动中激发更深入的发现。我们的小组探究模式正好匹配这种学习风格。' },
      { pain: '"在学校成绩还行，但总觉得没完全发挥"', response: '学校教育强调独立完成，而他的优势在协作探究。在GROWMATE的团队项目中，他能找到更好的施展空间。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·团队探索营', reason: '小组协作解决真实问题', priority: 1 },
      { course: 'GROWMATE·小小科学家', reason: '在探究中发展团队领导力', priority: 2 },
      { course: 'GROWMATE·野外生存挑战', reason: '团队协作的终极考验', priority: 3 },
    ],
    bestTiming: ['孩子组织小伙伴一起做探索时', '家长发现孩子在讨论中特别活跃时', '学校小组作业中表现突出时'],
    objectionHandling: [
      { objection: '"他已经很爱说话了，需要学会独立思考"', response: '独立思考和协作讨论不矛盾。我们的课程设计是"先独立观察思考，再小组讨论验证"，两种能力都在培养。' },
      { objection: '"他太爱问为什么了，怕打扰课堂"', response: '在GROWMATE，"为什么"不是打扰，是推动探究的发动机。我们专门设计了"追问环节"，让每个问题都得到重视。' },
    ],
    closingPoints: ['协作探究是科学研究的真实方式——诺贝尔奖越来越多是团队获得', '让他在团队中当"首席提问官"，把潜能变成角色'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX的测评显示探究力和联结力都很强——我们称为"协作探索者"。他不是一个人闷头研究的类型，而是在讨论碰撞中激发最大潜能。GROWMATE有专门的团队探究项目，特别适合他。' },
      { scene: '促成报课', script: '建议从"团队探索营"开始。6人小组一起完成一个真实的探究任务，他可以当"问题发起者"这个角色——最适合发挥他爱提问、善讨论的优势。' },
    ],
  },
  'science-communicator': {
    parentPainPoints: [
      { pain: '"孩子看完书就想给我讲，讲得没完没了"', response: '太棒了！这是"科学传播者"的典型特质——通过"教"来深化"学"。GROWMATE每次课都有"发现分享"环节，让他在讲解中巩固知识。' },
      { pain: '"特别爱表现，但有时候不够严谨"', response: '他的表达欲很强，探究力也不错——关键是把这两个优势结合起来。我们的课程强调"有据可查的分享"，训练他用证据说话。' },
      { pain: '"喜欢科普但只是泛泛了解，不够深入"', response: '这正是需要培养的方向。GROWMATE的项目让他在深度体验后再分享，确保"说出去的都是自己验证过的"。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·自然讲解员', reason: '把学到的知识分享给更多人', priority: 1 },
      { course: 'GROWMATE·小小科学家', reason: '先深度探究，再精彩分享', priority: 2 },
      { course: 'GROWMATE·自然笔记班', reason: '把发现整理成可分享的内容', priority: 3 },
    ],
    bestTiming: ['孩子兴奋地给你讲一个知识点时', '家长发现孩子喜欢拍科普视频时', '学校口头表达或主题演讲表现突出时'],
    objectionHandling: [
      { objection: '"他已经在学口才了"', response: '口才是"怎么说"，GROWMATE给他"说什么"——真实的探索经历才是最有感染力的素材。学完回来，他的口才内容会有质的飞跃。' },
      { objection: '"科普不是正经学习"', response: '能把复杂知识讲清楚，恰恰证明理解得最透彻。费曼说"如果你不能简单地解释它，你就还没真正理解它"。' },
    ],
    closingPoints: ['未来社会，"会讲"和"会做"同样重要', '让他成为同龄人中的"知识博主"'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX的探究力和表达力都很突出——这是"科学传播者"的潜能组合。他不仅能发现有趣的事，还能把发现讲得生动有趣。GROWMATE有专门的"自然讲解员"培训，让他成为真正的"小小科普达人"。' },
      { scene: '促成报课', script: '推荐"自然讲解员"项目。学完8周后，他会在一次公开活动中给参观者讲解——真正"上岗"当讲解员。这种成就感是其他课程给不了的。' },
    ],
  },
  'harmony-facilitator': {
    parentPainPoints: [
      { pain: '"孩子太敏感了，别人一句话他就伤心很久"', response: '高敏感是珍贵的潜能——他能感知到别人感知不到的情绪细节。测评显示他的联结力和反思力都很强，在GROWMATE的团队活动中，他会成为"团队气氛守护者"。' },
      { pain: '"总是操心别人的事，把自己累着"', response: '这说明他天生适合"服务型"角色。我们会引导他在关心他人的同时保护自己的能量边界。' },
      { pain: '"不太争强好胜，担心以后竞争力不够"', response: '未来社会最需要的不是"卷王"而是"连接者"。善于协调团队、化解矛盾的人永远是稀缺资源。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·团队探索营', reason: '在团队中发挥协调优势', priority: 1 },
      { course: 'GROWMATE·自然守护者', reason: '把对人的关心延伸到对自然的关爱', priority: 2 },
      { course: 'GROWMATE·自然冥想', reason: '学习情绪管理和自我保护', priority: 3 },
    ],
    bestTiming: ['孩子主动化解同学矛盾时', '家长发现孩子对他人情绪特别敏感时', '团队活动中担任协调角色时'],
    objectionHandling: [
      { objection: '"他这么敏感，户外会不会受伤？"', response: '自然是最好的疗愈场所。森林中的声音、气味、光影对情绪有天然的舒缓作用。高敏感的孩子在自然中往往最放松。' },
      { objection: '"总是顾着别人，自己的事情做不好"', response: '这正是需要引导的——在关心他人的同时不忘照顾自己。我们的活动设计会教他设置健康的边界。' },
    ],
    closingPoints: ['团队协调能力是领导力的核心', '高敏感不是弱点，是超能力'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX的联结力和反思力测评很高——这是"和谐促进者"的潜能组合。他对人际关系有天然的感知力，这种能力在团队中非常珍贵。' },
      { scene: '促成报课', script: '建议从"团队探索营"开始。在团队任务中，他可以担任"协调员"角色——让每个人都能发挥优势。这会让他的潜能变成可见的价值。' },
    ],
  },
  'project-manager': {
    parentPainPoints: [
      { pain: '"孩子太爱管别人了，什么事都要操心"', response: '这说明他有天生的组织和领导力！测评显示联结力和设计力都很强——典型的"项目统筹师"特质。GROWMATE的团队项目正好让他施展这个潜能。' },
      { pain: '"不太喜欢钻研细节，都是交代别人"', response: '领导者和执行者是不同的角色定位。我们的项目会引导他既能统筹全局，也能参与核心环节——"既是导演也是主演"。' },
      { pain: '"功课上不是最好的，但班级活动很活跃"', response: '组织能力是功课之外的重要能力。很多成功人士学业平平，但组织协调能力超强。我们要保护这个优势。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·团队挑战营', reason: '在团队任务中发挥统筹能力', priority: 1 },
      { course: 'GROWMATE·野外生存挑战', reason: '需要资源管理和团队协调', priority: 2 },
      { course: 'GROWMATE·自然探索营', reason: '轮流担任活动组织者', priority: 3 },
    ],
    bestTiming: ['孩子主动组织同学活动时', '班级活动中担任组织角色时', '家长发现孩子喜欢"安排事情"时'],
    objectionHandling: [
      { objection: '"他已经很能折腾了，需要安静下来"', response: '组织能力需要正确引导，而不是压制。在GROWMATE的项目中，他的"折腾"会变成"统筹"——让能量有正确的出口。' },
      { objection: '"做事不够专注，总想管别人"', response: '统筹型的孩子本来就需要"看全局"，这和专注做一件事是不同的能力维度。我们会教他在统筹和聚焦之间切换。' },
    ],
    closingPoints: ['未来最稀缺的是能把一群人组织起来做成事的人', '让他在实际项目中练习统筹能力'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX测评显示联结力和设计力都很强——典型的"项目统筹师"潜能。他天生就知道怎么把事情组织好、把人协调好。GROWMATE有团队挑战项目，正好让他发挥这个优势。' },
      { scene: '促成报课', script: '推荐"团队挑战营"，这是需要分工协作完成的任务。XX可以担任"项目经理"角色，负责任务分配和进度把控。让他的组织潜能在实战中得到锻炼。' },
    ],
  },
  'creative-presenter': {
    parentPainPoints: [
      { pain: '"什么事情都要做到最漂亮，效率很低"', response: '追求完美呈现是他的特质——设计力和表达力都很强。这种"作品思维"在创意行业非常珍贵。GROWMATE给他展示舞台，让追求完美变成加分项。' },
      { pain: '"准备很久才愿意表演，临时的不敢"', response: '这说明他重视质量，需要充分准备。我们的项目周期足够长，让他从容地从构思到呈现。' },
      { pain: '"只喜欢自己感兴趣的，不感兴趣的敷衍"', response: '找到激发他兴趣的主题是关键。GROWMATE的项目丰富多样，总有能点燃他创作热情的方向。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·自然创意工坊', reason: '从自然中取材进行艺术创作', priority: 1 },
      { course: 'GROWMATE·自然戏剧', reason: '把自然主题演绎成精彩表演', priority: 2 },
      { course: 'GROWMATE·自然笔记班', reason: '图文并茂的创意记录', priority: 3 },
    ],
    bestTiming: ['孩子展示精心准备的作品时', '家长发现孩子喜欢"策划+表演"时', '学校汇报演出中表现突出时'],
    objectionHandling: [
      { objection: '"他已经在学艺术/表演了"', response: 'GROWMATE给他提供的是"素材"和"灵感"——大自然是最好的创意源泉。学完回去，他的作品会更有生命力。' },
      { objection: '"户外这么脏，他爱漂亮可能不适应"', response: '创作需要先"沉下去"收集素材，再"升起来"做成作品。户外体验是作品的"原材料"，回来后的创作才是他的主场。' },
    ],
    closingPoints: ['创意和执行的结合是稀缺能力', '让自然成为他取之不尽的灵感库'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX的设计力和表达力都很突出——典型的"创意演绎家"。他不仅有创意想法，还有把想法变成精彩作品的能力。GROWMATE有自然创意工坊，让他用自然元素创作独一无二的作品。' },
      { scene: '促成报课', script: '推荐"自然创意工坊"，每次课会用自然材料完成一件作品——可能是艺术装置、可能是自然拼贴。课程结束有作品展示，他可以全程参与策展。' },
    ],
  },
  'quality-optimizer': {
    parentPainPoints: [
      { pain: '"做完事总觉得不够好，反复改来改去"', response: '追求精益求精是珍贵品质！测评显示设计力和反思力都很强，这是"品质优化师"的特质。我们会引导他在追求完美和交付成果之间找到平衡。' },
      { pain: '"对自己要求太高，容易受挫"', response: '这需要学会"阶段性满足"——每次进步都是成功。GROWMATE的项目设计有明确的阶段目标，让他在持续进步中获得成就感。' },
      { pain: '"不太喜欢冒险尝试，怕做不好"', response: '他不是怕失败，是对"做得好"有高标准。我们的安全试错环境让他敢于尝试，同时保持高标准。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·生态观察员', reason: '长期追踪项目，持续优化方法', priority: 1 },
      { course: 'GROWMATE·自然笔记班', reason: '通过反思不断提升记录质量', priority: 2 },
      { course: 'GROWMATE·小小科学家', reason: '科学方法的迭代和优化', priority: 3 },
    ],
    bestTiming: ['孩子展示"升级版"作品时', '家长发现孩子喜欢"改进"事情时', '考试后主动分析错题时'],
    objectionHandling: [
      { objection: '"他已经够完美主义了，需要放松"', response: '我们不是让他更完美，而是让追求进步的能量有正确出口。在项目中持续优化，比在考试中反复检查更有价值。' },
      { objection: '"怕他在户外不适应"', response: 'GROWMATE的项目是"渐进式挑战"，每次进步一点点。这种"可控的进步感"正好匹配他的心理需求。' },
    ],
    closingPoints: ['精益求精是未来竞争力的核心', '让他学会在"足够好"和"完美"之间找到平衡点'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX测评显示设计力和反思力都很强——典型的"品质优化师"。他有追求卓越的本能，关键是引导这种能量到正确的地方。GROWMATE的长期项目正好让他在持续优化中获得成就感。' },
      { scene: '促成报课', script: '推荐"生态观察员"项目，为期8周的长期追踪。每周都可以在上一周基础上改进方法——正好匹配他"越做越好"的特点。' },
    ],
  },
  'reflective-speaker': {
    parentPainPoints: [
      { pain: '"话不多，但说出来的话很有道理"', response: '这是"沉思表达者"的典型特质——表达力和反思力的结合！他不是没想法，而是要想清楚才说。GROWMATE给他充分的沉淀时间，再提供分享平台。' },
      { pain: '"不太主动社交，朋友不多"', response: '他追求的是深度交流，不是广泛社交。在GROWMATE，他能找到同样喜欢深度思考的伙伴。' },
      { pain: '"喜欢写日记，但不愿意给人看"', response: '他在用文字整理思想。我们会逐步创造安全的分享环境，让他愿意把思考分享出来。' },
    ],
    courseRecommendations: [
      { course: 'GROWMATE·自然笔记班', reason: '把思考记录下来，从书写到分享', priority: 1 },
      { course: 'GROWMATE·生态观察员', reason: '在长期追踪中沉淀深度洞察', priority: 2 },
      { course: 'GROWMATE·自然冥想', reason: '在自然中获得思考的空间', priority: 3 },
    ],
    bestTiming: ['孩子分享一个深刻感悟时', '家长发现孩子喜欢写随笔时', '需要演讲或分享时临场惊艳时'],
    objectionHandling: [
      { objection: '"他太安静了，户外活动适合他吗？"', response: '自然是最好的沉思空间。很多作家、思想家都在散步中获得灵感。户外体验会成为他思考和写作的素材。' },
      { objection: '"他不太愿意当众发言"', response: '我们有多种分享形式——可以写、可以画、可以小范围交流。不强迫公开演讲，尊重他的节奏。' },
    ],
    closingPoints: ['深度思考+清晰表达=思想领袖', '让自然成为他的灵感源泉'],
    communicationScript: [
      { scene: '首次沟通', script: 'XX妈妈您好，XX的表达力和反思力测评都很高——典型的"沉思表达者"。他说出来的话往往很有分量，因为是经过深思熟虑的。GROWMATE有自然笔记班，让他在记录中整理思想，在分享中传递洞见。' },
      { scene: '促成报课', script: '推荐"自然笔记班"。每次课有专门的"安静观察时间"，然后用图文记录发现和思考。期末有作品集，他可以选择展示还是收藏。尊重他的节奏。' },
    ],
  },
}

// ==================== 辅助函数 ====================

/** 根据WILDER分数判断孩子画像类型（覆盖全部15种Top2维度组合） */
export function identifyChildProfile(scores: Record<string, number>): string {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const top2 = sorted.slice(0, 2).map(s => s[0])

  // 完整的15种双维度组合映射
  const combinationMap: Record<string, string> = {
    // 原有8种
    'WI': 'agile-explorer',      // 灵动探索者
    'IW': 'agile-explorer',
    'IR': 'deep-thinker',        // 深度思考者
    'RI': 'deep-thinker',
    'DW': 'creative-builder',    // 创意建造者
    'WD': 'creative-builder',
    'LE': 'empathic-connector',  // 共情联结者
    'EL': 'empathic-connector',
    'EW': 'expressive-performer',// 表达展示者
    'WE': 'expressive-performer',
    'RD': 'reflective-strategist',// 反思策略者
    'DR': 'quality-optimizer',   // DR 映射到品质优化师（更精确）
    'WL': 'nature-guardian',     // 自然守护者
    'LW': 'nature-guardian',
    
    // 新增8种
    'ID': 'systematic-researcher',    // 系统研究员 (探究+设计)
    'DI': 'systematic-researcher',
    'IL': 'collaborative-explorer',   // 协作探索者 (探究+联结)
    'LI': 'collaborative-explorer',
    'IE': 'science-communicator',     // 科学传播者 (探究+表达)
    'EI': 'science-communicator',
    'LR': 'harmony-facilitator',      // 和谐促进者 (联结+反思)
    'RL': 'harmony-facilitator',
    'LD': 'project-manager',          // 项目统筹师 (联结+设计)
    'DL': 'project-manager',
    'DE': 'creative-presenter',       // 创意演绎家 (设计+表达)
    'ED': 'creative-presenter',
    'ER': 'reflective-speaker',       // 沉思表达者 (表达+反思)
    'RE': 'reflective-speaker',
  }

  const key = top2.join('')
  if (combinationMap[key]) {
    return combinationMap[key]
  }

  // 均衡发展判断：最高与最低差距小于15%
  const max = sorted[0][1]; const min = sorted[sorted.length - 1][1]
  if (max - min < 15) return 'balanced-grower'

  // 兜底：根据单维度最高映射
  const dimMap: Record<string, string> = { 
    W: 'agile-explorer', 
    I: 'deep-thinker', 
    D: 'creative-builder', 
    L: 'empathic-connector', 
    E: 'expressive-performer', 
    R: 'reflective-strategist' 
  }
  return dimMap[sorted[0][0]] || 'balanced-grower'
}

/** 获取完整的销售方案 */
export function getSalesPackage(profileKey: string) {
  const profile = CHILD_PROFILES[profileKey]
  const strategy = SALES_STRATEGIES[profileKey]
  if (!profile || !strategy) return null
  return { profile, strategy }
}

// ==================== PBL教育理念销售框架 ====================

/** 传统教育 vs 潜能成全教育 对比话术 */
export const EDUCATION_PHILOSOPHY_CONTRAST = {
  title: '成全式教育 vs 淘汰式教育',
  description: '帮助家长理解GROWMATE的教育理念差异',
  
  contrasts: [
    {
      aspect: '对孩子的定位',
      traditional: '找问题、补短板："你数学不好，要多做题"',
      growmate: '找潜能、发优势："你的好奇心是最宝贵的能力"',
      salesHook: '每个孩子生来就有独特的潜能组合，关键是发现和激活它',
    },
    {
      aspect: '对"问题"的态度',
      traditional: '"坐不住"是缺点需要纠正',
      growmate: '"坐不住"可能是探索欲强的信号',
      salesHook: '很多被视为"问题"的表现，换个视角看就是珍贵的潜能特质',
    },
    {
      aspect: '学习方式',
      traditional: '标准化课程，统一进度，被动接收',
      growmate: '项目制学习，个性化节奏，主动探究',
      salesHook: 'PBL项目制学习让孩子在真实问题中学习，记忆深刻、迁移能力强',
    },
    {
      aspect: '评价标准',
      traditional: '分数排名、标准答案',
      growmate: '成长过程、能力发展、个人进步',
      salesHook: '我们追踪的是孩子六个维度的成长曲线，而不是简单的分数',
    },
    {
      aspect: '最终目标',
      traditional: '培养"听话"的孩子、适应现有系统',
      growmate: '培养有潜能认知的孩子、创造自己的价值',
      salesHook: '帮孩子找到自己的潜能优势，相信有潜能认知的孩子能获得更幸福成功的人生',
    },
  ],
  
  coreMessage: '我们不是"补课"，而是"发现"——发现孩子与生俱来的潜能密码',
}

/** PBL（项目制学习）价值主张 */
export const PBL_VALUE_PROPOSITION = {
  title: '什么是PBL项目制学习？',
  description: '用家长听得懂的语言解释PBL',
  
  explanation: '简单说，就是让孩子像科学家一样解决真实问题——从提出问题、做出假设、动手验证、到分享发现，完整走一遍。这不是做做实验玩玩，而是培养思维方式。',
  
  keyBenefits: [
    {
      benefit: '主动学习',
      description: '孩子是项目的主人，不是被动听课。参与度和记忆深度完全不同。',
      parentResonance: '"上完课回来能讲出来，不像其他课上完就忘了"',
    },
    {
      benefit: '真实问题',
      description: '研究的是真实存在的问题，不是书本上的假设。解决真问题的成就感无与伦比。',
      parentResonance: '"他自己设计的实验验证成功时，眼睛都亮了"',
    },
    {
      benefit: '能力迁移',
      description: '学会的是"怎么学习"，这个能力能用到任何学科和领域。',
      parentResonance: '"现在写作文也会先列提纲了，说是做项目学会的方法"',
    },
    {
      benefit: '跨学科整合',
      description: '一个项目可能涉及生物、物理、数学、语文，知识不再是孤立的。',
      parentResonance: '"原来觉得各科是分开的，现在知道都是相通的"',
    },
  ],
  
  counterObjection: '"学校都是应试教育，这个实用吗？"',
  response: '应试能力是短期技能，探究能力是终身资产。而且研究表明，PBL学习者的学科成绩并不比传统学习者差，反而在需要创造性思维的题目上表现更好。',
}

/** 家长痛点通用库（按年龄和场景分类） */
export const UNIVERSAL_PAIN_POINTS = {
  // 按年龄分类
  byAge: {
    '6-8岁': [
      {
        pain: '孩子刚上小学，坐不住、注意力不集中',
        diagnosis: '可能是好奇心(W)或表达欲(E)很强，标准课堂不够刺激',
        response: 'GROWMATE的户外课程每5-10分钟有新发现任务，完美匹配短注意力周期。不是让他"安静下来"，而是让他"专注在对的事情上"。',
      },
      {
        pain: '不愿意写作业，一提写字就哭',
        diagnosis: '可能是动手能力(D)强于书面表达(E-writ)，或者学习风格不匹配',
        response: '他可能是"做着学"而不是"写着学"的类型。GROWMATE让他在动手中学习，很多知识不需要"写"出来也能掌握。',
      },
    ],
    '8-10岁': [
      {
        pain: '成绩中等，说不上好也说不上差，没有特长',
        diagnosis: '可能是均衡型(balanced-grower)，需要找到激发点',
        response: '均衡恰恰是好基础——可塑性最强。关键是给他足够多元的体验找到"眼睛发光"的方向。',
      },
      {
        pain: '只对游戏感兴趣，对学习提不起劲',
        diagnosis: '可能是反馈机制不匹配——游戏即时反馈，学习延迟反馈',
        response: 'GROWMATE的项目有即时的发现和成就，让"学习"像"游戏"一样有趣。很多孩子玩完后主动放下游戏。',
      },
      {
        pain: '内向安静，朋友不多，担心社交能力',
        diagnosis: '可能是深度思考型(IR)或沉思表达型(ER)，需要"对的社交场景"',
        response: '内向不是问题，强迫社交才是。在GROWMATE，他能遇到同样热爱探究的伙伴，有共同话题的社交才是高质量社交。',
      },
    ],
    '10-12岁': [
      {
        pain: '青春期叛逆，和家长对着干',
        diagnosis: '这个年龄需要"自主感"和"被尊重感"',
        response: 'GROWMATE的项目让他做主人——选题、设计、执行都是自己决定的。把"叛逆"的能量导向"独立研究"。',
      },
      {
        pain: '小升初压力大，时间都花在补课上',
        diagnosis: '关键是效率而不是时间',
        response: '研究表明，一周2小时的高质量户外探究能让剩余时间的学习效率提升20-30%。不是增加负担，而是提高产出。',
      },
      {
        pain: '学科成绩两极分化，偏科严重',
        diagnosis: '可能是潜能维度和学科匹配度不同',
        response: '偏科背后往往是潜能信号——擅长的学科正好匹配优势维度。我们帮他看清这个规律，用强科思维学弱科。',
      },
    ],
  },
  
  // 按场景分类
  byScenario: {
    '学业焦虑': [
      {
        pain: '担心孩子以后竞争力不够',
        response: 'AI时代最稀缺的是好奇心、创造力、协作能力——恰好是GROWMATE培养的六个维度。这些是算法替代不了的。',
      },
      {
        pain: '别人都在补课，我们不补会不会落后',
        response: '补课是在现有赛道上加速，而我们在帮孩子找到自己的赛道。找对方向后，学习动力和效率都会质变。',
      },
    ],
    '兴趣班选择': [
      {
        pain: '兴趣班报了一堆，不知道哪个该继续',
        response: '做减法的前提是知道孩子真正需要什么。WILDER测评帮您看清孩子的潜能结构，选课就有了科学依据。',
      },
      {
        pain: '孩子报什么班都三分钟热度',
        response: '不是孩子的问题，是还没找到真正点燃他的方向。GROWMATE每次主题不同，正好是"潜能试金石"。',
      },
    ],
    '亲子关系': [
      {
        pain: '不知道怎么和孩子沟通学习的事',
        response: '先理解他的潜能类型，再用他能接受的方式沟通。测评报告里有专门的"沟通建议"，针对性很强。',
      },
      {
        pain: '工作忙，陪伴时间少，感觉和孩子不亲',
        response: '与其内疚，不如让陪伴时间更有质量。GROWMATE有亲子共学项目，2小时的高质量探索胜过2周的低质量陪伴。',
      },
    ],
  },
}

/** 通用异议处理库 */
export const UNIVERSAL_OBJECTION_HANDLING = {
  价格类: [
    {
      objection: '太贵了',
      response: '理解您的考虑。换个角度看：一学期课程不到3000元，但收获的是清晰的潜能认知、科学的思维方法、同频的朋友圈。这些是花多少钱都买不到的。',
      alternatives: ['我们有体验课，先让孩子感受一下', '可以先从基础系列开始，投入更可控'],
    },
    {
      objection: '别的机构更便宜',
      response: '便宜有便宜的道理，但要看给孩子的是什么。很多机构是"带孩子玩"，我们是"让孩子在玩中成长"。有WILDER测评体系做支撑，每次课都有明确的能力目标。',
    },
  ],
  时间类: [
    {
      objection: '没时间，功课太多',
      response: '时间是挤出来的——关键是"值不值得挤"。每周2-3小时的高质量户外探究，能让剩余时间的学习效率提升20-30%。我们不是在抢时间，而是在提效率。',
    },
    {
      objection: '周末要休息/要补课',
      response: '户外探索本身就是最好的休息——"换一个环境"比"躺着不动"更能恢复精力。而且真正的学习发生在好奇心被点燃的时候，不是在疲惫补课的时候。',
    },
  ],
  效果类: [
    {
      objection: '玩能学到什么',
      response: '这是最常见的误解。GROWMATE的"玩"是有设计的——每个活动都指向WILDER六个维度的特定能力目标。玩完后孩子说得出自己学到了什么，我们也有追踪报告证明进步。',
    },
    {
      objection: '对升学有帮助吗',
      response: '直接帮助有限，但间接影响巨大。自主招生、综合素质评价越来越看重"独特经历"和"研究能力"，这正是GROWMATE培养的。长远看，潜能认知和探究能力才是决定人生高度的因素。',
    },
    {
      objection: '学校已经有科学课了',
      response: '学校科学课是"知识传授"，GROWMATE是"能力培养"。知道"什么是光合作用"和"能设计实验验证光合作用"是完全不同的层次。',
    },
  ],
  信任类: [
    {
      objection: '没听说过你们',
      response: '我们确实比较低调，主要靠口碑传播。您可以看看我们的案例集和家长评价——真实反馈比广告更有说服力。',
    },
    {
      objection: '户外不安全',
      response: '安全是我们的第一承诺。师生比不超过1:6，所有引导员持急救证书，活动前有安全排查，6年服务10000+家庭零事故。让孩子在专业指导下接触自然，比他自己偷偷跑出去玩安全得多。',
    },
  ],
  决策类: [
    {
      objection: '我再考虑考虑',
      response: '完全理解。建议您先让孩子体验一次——孩子的真实反应是最好的决策依据。我们近期有体验课，名额有限，要不先给您留一个？',
    },
    {
      objection: '等放假再说',
      response: '放假是好时机，但名额会更紧张。现在报名正好有时间为假期安排做准备。而且很多习惯的培养是持续性的，越早开始越好。',
    },
    {
      objection: '孩子自己不感兴趣',
      response: '他可能只是没见过"真正的自然课"是什么样。带他来体验一次——很多孩子是"玩过才知道自己喜欢"。不喜欢不勉强，喜欢了再说。',
    },
  ],
}

/** 销售话术模板库（按场景） */
export const SALES_SCRIPT_TEMPLATES = {
  首次电话: {
    opening: '您好，是XX妈妈/爸爸吗？我是GROWMATE的[名字]。看到XX完成了我们的WILDER测评，想花3分钟和您分享一下他的潜能报告——有些发现还挺有意思的。',
    reportHighlight: '[孩子名]在[最高维度]维度的得分非常突出，这在我们评测过的几万个孩子中属于前[百分比]。这意味着...',
    needDiscovery: '想请教一下，您平时观察到他在[相关行为表现]方面有什么特别的表现吗？',
    transitionToCourse: '基于这个潜能特点，我们有一个课程特别适合他...',
    closing: '要不这样，我先给您发一份更详细的报告解读，您看看有没有说中您的观察。然后周末有个体验课名额，要不先给您留一个？',
  },
  
  面对面咨询: {
    warmUp: '谢谢您带XX过来。先喝杯水，我们慢慢聊。XX，你最近有什么好玩的事情想分享吗？',
    reportReview: '我们来一起看看XX的测评报告。这六个维度分别是...XX在[维度]方面特别突出...',
    parentConcernExplore: '您平时最关心或者最头疼的是XX哪方面的问题？',
    painPointResponse: '[针对性回应]',
    courseIntro: '基于今天的沟通，我觉得[课程名]会非常适合XX。这个课程的特点是...',
    trialSuggestion: '光说不练假把式——不如让XX先体验一次？我们近期有[日期]的体验课...',
    closingAttempt: '您觉得怎么样？如果感兴趣，我们现在就可以安排。',
  },
  
  促成转化: {
    valueReinforce: '回顾一下，XX的潜能组合是[类型]，最需要的是[核心需求]。[课程名]正好能满足这个需求...',
    urgencyCreate: '这期课程名额有限，特别是[适合的潜能类型]的孩子我们会优先推荐。建议尽早锁定名额。',
    riskReverse: '我们有7天试学期——如果前两次课觉得不合适，全额退款。所以您没有任何风险。',
    nextStepClear: '如果没问题，我现在就帮您登记。需要您填一下基本信息...',
  },
  
  跟进维护: {
    postTrialFollowUp: 'XX妈妈您好，XX上次体验课的表现很棒！引导员说他在[具体表现]方面特别突出。您和XX聊过课后感受吗？',
    dormantReactivate: 'XX妈妈您好，好久没联系了。最近有一个[新课程/活动]特别适合像XX这样[潜能类型]的孩子，想告诉您一声。',
    referralRequest: '感谢您一直以来的信任！XX在我们这里成长很明显。如果您身边有朋友孩子也需要类似的课程，欢迎推荐——老学员推荐有优惠哦。',
  },
}

/** 课程与潜能匹配矩阵 */
export const COURSE_TALENT_MATRIX: Record<string, { 
  bestFit: string[], 
  goodFit: string[], 
  reasonsMap: Record<string, string> 
}> = {
  '自然探索营': {
    bestFit: ['agile-explorer', 'nature-guardian', 'balanced-grower'],
    goodFit: ['collaborative-explorer', 'science-communicator', 'creative-builder'],
    reasonsMap: {
      'agile-explorer': '满足好奇心，每次新主题新发现',
      'nature-guardian': '沉浸在自然中，发挥环境敏感优势',
      'balanced-grower': '多样化主题帮助发现兴趣方向',
      'collaborative-explorer': '团队探索中激发更多发现',
      'science-communicator': '丰富的分享素材',
      'creative-builder': '自然中的创意灵感',
    },
  },
  '小小科学家': {
    bestFit: ['deep-thinker', 'systematic-researcher', 'collaborative-explorer'],
    goodFit: ['science-communicator', 'quality-optimizer', 'agile-explorer'],
    reasonsMap: {
      'deep-thinker': '深度探究主题，允许慢节奏深挖',
      'systematic-researcher': '系统化的科学探究项目',
      'collaborative-explorer': '团队研究中发挥提问优势',
      'science-communicator': '先深度探究，再精彩分享',
      'quality-optimizer': '科学方法的迭代和优化',
      'agile-explorer': '从观察到记录到展示，训练闭环能力',
    },
  },
  '生态观察员': {
    bestFit: ['systematic-researcher', 'deep-thinker', 'quality-optimizer'],
    goodFit: ['nature-guardian', 'reflective-speaker', 'collaborative-explorer'],
    reasonsMap: {
      'systematic-researcher': '长周期追踪项目，需要规划和执行力',
      'deep-thinker': '长期追踪项目，满足深度钻研需求',
      'quality-optimizer': '长期追踪项目，持续优化方法',
      'nature-guardian': '深度连接自然的机会',
      'reflective-speaker': '在长期追踪中沉淀深度洞察',
      'collaborative-explorer': '团队长期合作项目',
    },
  },
  '团队探索营': {
    bestFit: ['empathic-connector', 'collaborative-explorer', 'project-manager', 'harmony-facilitator'],
    goodFit: ['expressive-performer', 'nature-guardian', 'science-communicator'],
    reasonsMap: {
      'empathic-connector': '在团队协作中发挥联结力优势',
      'collaborative-explorer': '小组协作解决真实问题',
      'project-manager': '在团队任务中发挥统筹能力',
      'harmony-facilitator': '在团队中发挥协调优势',
      'expressive-performer': '团队展示中发挥表达优势',
      'nature-guardian': '同好型聚集，找到志同道合的伙伴',
      'science-communicator': '在讨论中分享发现',
    },
  },
  '自然讲解员': {
    bestFit: ['science-communicator', 'expressive-performer'],
    goodFit: ['collaborative-explorer', 'empathic-connector', 'creative-presenter'],
    reasonsMap: {
      'science-communicator': '把学到的知识分享给更多人',
      'expressive-performer': '把表达欲转化为专业讲解能力',
      'collaborative-explorer': '在互动中深化知识理解',
      'empathic-connector': '用共情力感染听众',
      'creative-presenter': '把讲解变成精彩表演',
    },
  },
  '自然笔记班': {
    bestFit: ['reflective-speaker', 'deep-thinker', 'quality-optimizer'],
    goodFit: ['systematic-researcher', 'nature-guardian', 'science-communicator'],
    reasonsMap: {
      'reflective-speaker': '把思考记录下来，从书写到分享',
      'deep-thinker': '观察+记录+分析，匹配思考型特质',
      'quality-optimizer': '通过反思不断提升记录质量',
      'systematic-researcher': '观察-记录-分析的完整流程',
      'nature-guardian': '深度记录自然观察',
      'science-communicator': '把发现整理成可分享的内容',
    },
  },
  '自然创意工坊': {
    bestFit: ['creative-builder', 'creative-presenter'],
    goodFit: ['agile-explorer', 'expressive-performer', 'nature-guardian'],
    reasonsMap: {
      'creative-builder': '用自然材料创造，满足动手欲',
      'creative-presenter': '从自然中取材进行艺术创作',
      'agile-explorer': '把探索发现变成创意作品',
      'expressive-performer': '通过作品表达想法',
      'nature-guardian': '与自然的创意连接',
    },
  },
  '野外生存挑战': {
    bestFit: ['project-manager', 'creative-builder', 'reflective-strategist'],
    goodFit: ['collaborative-explorer', 'systematic-researcher', 'harmony-facilitator'],
    reasonsMap: {
      'project-manager': '需要资源管理和团队协调',
      'creative-builder': '实用技能+动手操作',
      'reflective-strategist': '需要规划和执行力的挑战',
      'collaborative-explorer': '团队协作的终极考验',
      'systematic-researcher': '系统化解决生存问题',
      'harmony-facilitator': '在压力下协调团队',
    },
  },
}
