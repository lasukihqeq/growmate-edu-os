// GROWMATE科创体系课程数据库
// 基于WILDER六维能力模型的课程匹配系统

export interface Course {
  id: string
  name: string
  displayName: string
  type: '科普' | '科创' | '科考'
  grade: string // 幼儿园, 一年级, 二年级...
  level: string // L0, L1, L2...
  month: string
  duration: string
  location: string
  description: string
  wilderFocus: string[] // 主要培养的WILDER维度
  wilderGoals: Record<string, string> // 各维度教学目标
  skills: string[] // 重点培养能力
  thinkingModels: string[] // 思维模型
}

// WILDER维度定义
export const WILDER_DIMS = {
  W: { name: '好奇与探索', en: 'Wonder', emoji: '🔮', color: 'amber' },
  I: { name: '探究与发现', en: 'Inquiry', emoji: '🔬', color: 'sky' },
  L: { name: '联结与整合', en: 'Link', emoji: '🔗', color: 'rose' },
  D: { name: '设计与创造', en: 'Design', emoji: '🛠️', color: 'violet' },
  E: { name: '表达与分享', en: 'Expression', emoji: '🎤', color: 'emerald' },
  R: { name: '反思与优化', en: 'Reflection', emoji: '💡', color: 'slate' },
}

// 课程数据库 - 精选代表性课程
export const COURSE_DATABASE: Course[] = [
  // ========== 幼儿园 (L0) ==========
  {
    id: 'K-01',
    name: '动物探险护卫队',
    displayName: '动物探险护卫队｜小动物要住在怎样的地方',
    type: '科普',
    grade: '幼儿园',
    level: 'L0',
    month: '9月',
    duration: '45-90min',
    location: '学校lab',
    description: '穿越"丛林迷宫"去帮小动物们找家，一路发现各种稀奇古怪的栖息地，做个善良又勇敢的"动物护卫队"！',
    wilderFocus: ['W', 'I', 'L'],
    wilderGoals: {
      W: '好奇动物住哪',
      I: '观察不同动物图片/模型',
      L: '说出动物住在什么地方',
      D: '尝试拼搭/绘制动物之家',
      E: '介绍自己帮助的动物',
      R: '回顾不同动物喜欢的环境'
    },
    skills: ['观察力', '分类能力'],
    thinkingModels: ['归纳思维']
  },
  {
    id: 'K-02',
    name: '森林里的我',
    displayName: '森林里的我｜用自然拼出属于你的自画像',
    type: '科创',
    grade: '幼儿园',
    level: 'L0',
    month: '9月',
    duration: '90-120min',
    location: '公园lab',
    description: '你能用自然界的材料拼出"森林里的自己"吗？通过色彩、质地与形态表达自我个性，拼贴头像并进行个性化讲述。',
    wilderFocus: ['W', 'D', 'E'],
    wilderGoals: {
      W: '树叶、果壳、树枝……它们能拼出"我"吗？',
      I: '观察自然物的形状、色彩、纹理',
      L: '学习如何通过自然素材传达个人特征',
      D: '制作"自然自画像"拼贴作品',
      E: '向同伴展示并讲述创作',
      R: '反思自己与自然的连接'
    },
    skills: ['创意表达', '自我认知'],
    thinkingModels: ['设计思维']
  },
  {
    id: 'K-03',
    name: '空气炮大挑战',
    displayName: '空气炮大挑战｜看不见的空气也能发射',
    type: '科普',
    grade: '幼儿园',
    level: 'L0',
    month: '4月',
    duration: '45-90min',
    location: '学校lab',
    description: '看不见的空气也有力量？做个"空气炮"突突突发射纸圈，畅享"空气轰隆"的乐趣。',
    wilderFocus: ['W', 'I', 'D'],
    wilderGoals: {
      W: '看到空气炮发射纸圈，惊呼"好厉害"',
      I: '尝试用不同力度打气观察纸圈飞行距离',
      L: '理解空气也有力量、能推动物体',
      D: '组装纸箱空气炮并进行发射实验',
      E: '分享"我怎样让它飞得远"',
      R: '反思生活中哪些地方利用了空气的力量'
    },
    skills: ['动手能力', '因果推理'],
    thinkingModels: ['实验思维']
  },
  {
    id: 'K-04',
    name: '泡泡乐园工程师',
    displayName: '泡泡试炼场｜发明最强泡泡组合',
    type: '科创',
    grade: '幼儿园',
    level: 'L0',
    month: '10月',
    duration: '90-120min',
    location: '公园lab',
    description: '泡泡为什么有时大、有时破得快？调配不同泡泡液浓度、测试工具形状，找到"最强泡泡组合"。',
    wilderFocus: ['I', 'D', 'R'],
    wilderGoals: {
      W: '怎样才能吹出最大、最稳的泡泡？',
      I: '测试不同浓度泡泡液对泡泡的影响',
      L: '了解表面张力、蒸发速度与泡泡形状的物理原理',
      D: '设计多种配比方案并进行对比实验',
      E: '评比"最强泡泡"组合，分享设计优化过程',
      R: '反思实验变量设置与工程迭代'
    },
    skills: ['实验设计', '数据分析'],
    thinkingModels: ['工程迭代']
  },
  {
    id: 'K-05',
    name: '森林时钟计划',
    displayName: '森林时钟计划｜建造一座能感知时间的自然装置',
    type: '科创',
    grade: '幼儿园',
    level: 'L0',
    month: '11月',
    duration: '90-120min',
    location: '公园lab',
    description: '自然界中有哪些事物可以显示时间变化？感受时间的变化，了解自然元素与时间联系，最终制作一个森林时钟。',
    wilderFocus: ['W', 'L', 'D'],
    wilderGoals: {
      W: '自然中有哪些事物可以反映时间变化？',
      I: '观察植物花期、苔藓湿度、光影角度等时间线索',
      L: '了解"物候""年轮""太阳钟"等自然计时方式',
      D: '以树叶、石头、木桩等材料设计"森林时钟"模型',
      E: '展示计时装置，讲述其指示时间的原理',
      R: '反思时间与自然万物的关联'
    },
    skills: ['系统思维', '创意设计'],
    thinkingModels: ['系统思维']
  },
  
  // ========== 一年级 (L1) ==========
  {
    id: 'G1-01',
    name: '空气的声音魔法',
    displayName: '空气的声音魔法｜声音是怎么传播的',
    type: '科普',
    grade: '一年级',
    level: 'L1',
    month: '9月',
    duration: '45-90min',
    location: '学校lab',
    description: '声音是如何产生的？通过制作一个听诊器，探索振动与声音的奥秘，感受空气的"歌唱"魔力！',
    wilderFocus: ['W', 'I', 'D'],
    wilderGoals: {
      W: '感到"听诊器"能听见心跳很神奇',
      I: '感受声波在空气中传播（气球/水杯实验）',
      L: '理解声音由振动产生，需空气传播',
      D: '制作简易听诊器模型，进行试验',
      E: '向同学演示"我听到的秘密声音"',
      R: '总结生活中有哪些声音与空气有关'
    },
    skills: ['观察力', '动手能力'],
    thinkingModels: ['因果推理']
  },
  {
    id: 'G1-02',
    name: '疯狂动物城',
    displayName: '动物世界拼图馆｜分类与演化图谱创作任务',
    type: '科创',
    grade: '一年级',
    level: 'L1',
    month: '9月',
    duration: '90-120min',
    location: '公园lab',
    description: '如何用图谱展示动物的多样性与演化？选择代表性动物，绘制分类思维导图，整理演化信息。',
    wilderFocus: ['I', 'L', 'E'],
    wilderGoals: {
      W: '动物有哪些不同的种类和演化关系？',
      I: '查阅资料，收集常见动物图像与演化信息',
      L: '学习动物的分类方式与基本演化路径',
      D: '设计动物分类导图与说明图册',
      E: '展示"我的动物家谱"并讲解图谱设计',
      R: '回顾自然界中动物的多样性，理解生物进化的基本逻辑'
    },
    skills: ['信息整合', '图谱设计'],
    thinkingModels: ['分类思维', '系统思维']
  },
  {
    id: 'G1-03',
    name: '大树先生',
    displayName: '树木观察档案局｜为一棵大树绘制身份证',
    type: '科创',
    grade: '一年级',
    level: 'L1',
    month: '9月',
    duration: '90-120min',
    location: '公园lab',
    description: '如何为一棵树制作一张完整的身份证？实地观察一棵树的枝干、叶片、树皮等特征，绘制结构画并记录。',
    wilderFocus: ['I', 'D', 'E'],
    wilderGoals: {
      W: '一棵树有哪些独特的"身份证信息"？',
      I: '实地观察树干、树皮、叶形、枝干结构等',
      L: '认识植物的不同结构与功能',
      D: '绘制"树档案卡"，记录自然观察细节',
      E: '制作"大树生命画卷"，讲述这棵树的故事',
      R: '表达对身边植物的关注与尊重'
    },
    skills: ['观察记录', '自然连接'],
    thinkingModels: ['结构思维']
  },
  {
    id: 'G1-04',
    name: '地心历险记',
    displayName: '地心结构探索馆｜地球的"内核"究竟长啥样',
    type: '科普',
    grade: '一年级',
    level: 'L1',
    month: '10月',
    duration: '45-90min',
    location: '学校lab',
    description: '地球的内部结构是什么样的？通过模型展示地球的神秘"内核"，深入探索地球的内部奥秘。',
    wilderFocus: ['W', 'I', 'D'],
    wilderGoals: {
      W: '好奇"地下有没有火焰/水晶"',
      I: '观察地球剖面模型（核心、地幔等）',
      L: '了解地壳、地幔、地核的层级结构',
      D: '用彩泥/泡沫球制作地球剖面模型',
      E: '展示"我的地球肚子"',
      R: '表达地球结构如何影响火山、地震等现象'
    },
    skills: ['模型构建', '空间想象'],
    thinkingModels: ['层级思维']
  },
  {
    id: 'G1-05',
    name: '水质净化师',
    displayName: '水质净化师实验室｜净化一瓶"脏水"',
    type: '科创',
    grade: '一年级',
    level: 'L1',
    month: '10月',
    duration: '90-120min',
    location: '公园lab',
    description: '如何通过模拟技术净化受污染的水？设计并测试简易净水装置，观察不同滤材净化效果。',
    wilderFocus: ['I', 'D', 'R'],
    wilderGoals: {
      W: '怎么让脏水变干净？',
      I: '观察不同水样的污染物，测试滤材如砂石、炭层等',
      L: '了解物理过滤原理和常见净水材料功能',
      D: '搭建净水装置，记录净化效果变化',
      E: '展示"净水装置"并汇报实验报告',
      R: '反思日常生活中水资源的可持续利用与环保实践'
    },
    skills: ['工程设计', '环保意识'],
    thinkingModels: ['工程思维', '迭代优化']
  },
  {
    id: 'G1-06',
    name: '光影小剧场',
    displayName: '光影小剧场｜用影子演一出森林剧',
    type: '科创',
    grade: '一年级',
    level: 'L1',
    month: '10月',
    duration: '90-120min',
    location: '公园lab',
    description: '如何设计一个森林中的故事，并用影子剧讲出来？学习光与影的科学原理，结合戏剧创作一场森林主题影子剧。',
    wilderFocus: ['W', 'D', 'E'],
    wilderGoals: {
      W: '光和影是怎样形成的？',
      I: '观察光源、投影与形状变化关系',
      L: '理解光线传播方向与遮挡形成影子原理',
      D: '设计角色剪影、制作光影舞台与剧本',
      E: '开展"森林影子剧"演出并录像记录',
      R: '反思团队创作过程，表达对森林故事的理解'
    },
    skills: ['创意表达', '团队协作'],
    thinkingModels: ['设计思维', '叙事思维']
  },
  {
    id: 'G1-07',
    name: '千足百喙',
    displayName: '儿童观鸟指南创作坊｜从观察走向图鉴设计',
    type: '科创',
    grade: '一年级',
    level: 'L1',
    month: '11月',
    duration: '90-120min',
    location: '公园lab',
    description: '如何设计一本适合儿童使用的观鸟图鉴？实地观鸟、拍照记录、整理分类并制作图鉴手册。',
    wilderFocus: ['I', 'L', 'E'],
    wilderGoals: {
      W: '如何把鸟的特征记录下来并归类？',
      I: '野外观鸟、记录颜色、形状、鸣叫等特征',
      L: '学习鸟类辨识方法与分类基础',
      D: '整理信息并设计一本适合儿童使用的观鸟图鉴',
      E: '展示图鉴成果，附带推荐观鸟路线',
      R: '回顾观察记录过程，分享自己与鸟类的接触体验'
    },
    skills: ['观察记录', '图鉴设计'],
    thinkingModels: ['分类思维', '信息整合']
  },
  {
    id: 'G1-08',
    name: '恐龙复原剧场',
    displayName: '恐龙复原剧场｜演绎史前生命的一天',
    type: '科创',
    grade: '一年级',
    level: 'L1',
    month: '12月',
    duration: '90-120min',
    location: '公园lab',
    description: '恐龙生活的样子能不能被我们"复原"出来？通过化石研究和情景布景，演绎恐龙时代的一天。',
    wilderFocus: ['W', 'L', 'E'],
    wilderGoals: {
      W: '我们能"还原"恐龙的生活吗？',
      I: '研究恐龙骨骼、生活环境、食性等资料与化石线索',
      L: '了解古生物学中的推理方法和科学绘本编创方式',
      D: '小组编排"恐龙故事"，通过布景、剧本演绎史前一天',
      E: '进行剧场演出，讲述你编织的恐龙生活故事',
      R: '反思科学与想象的边界，理解科学推断与创造力的结合'
    },
    skills: ['科学推理', '创意表达'],
    thinkingModels: ['叙事思维', '推理思维']
  },
  
  // ========== 二年级 (L2) ==========
  {
    id: 'G2-01',
    name: '蛋蛋传奇',
    displayName: '蛋蛋传奇｜坠蛋保护器工程挑战',
    type: '科创',
    grade: '二年级',
    level: 'L2',
    month: '3月',
    duration: '90-120min',
    location: '公园lab',
    description: '通过制作坠蛋保护器，引导学生探索蛋在坠落过程中的保护机制和工程设计原理。',
    wilderFocus: ['I', 'D', 'R'],
    wilderGoals: {
      W: '怎样才能保护鸡蛋不碎？',
      I: '探索不同材料的缓冲效果',
      L: '理解能量吸收与结构保护原理',
      D: '设计并制作坠蛋保护装置',
      E: '演示测试并讲解设计理念',
      R: '反思失败原因并优化设计'
    },
    skills: ['工程设计', '问题解决'],
    thinkingModels: ['工程迭代', '失败学习']
  },
  {
    id: 'G2-02',
    name: '规律解码挑战',
    displayName: '规律解码挑战｜用数字规律设计智力游戏',
    type: '科创',
    grade: '二年级',
    level: 'L2',
    month: '4月',
    duration: '90-120min',
    location: '公园lab',
    description: '通过设计一道规律闯关题，引导学生发现和解析数学规律，培养逻辑思维和问题解决能力。',
    wilderFocus: ['I', 'L', 'D'],
    wilderGoals: {
      W: '哪些规律可以变成挑战游戏？',
      I: '探索数字、图形、颜色等规律实例',
      L: '学习递增、对称、周期等常见模式',
      D: '设计包含规律变化的"解谜题本+通关规则"',
      E: '开展"规律解密挑战赛"',
      R: '反思设计者与玩家视角中的不同难度理解'
    },
    skills: ['逻辑思维', '游戏设计'],
    thinkingModels: ['模式识别', '逆向思维']
  },
  {
    id: 'G2-03',
    name: '吃虫子的植物',
    displayName: '捕虫植物发明展｜设计一台仿生"食虫装置"',
    type: '科创',
    grade: '二年级',
    level: 'L2',
    month: '6月',
    duration: '90-120min',
    location: '公园lab',
    description: '通过制作一个捕虫装置，引导学生了解吃虫子的植物的特征和捕食机制，培养仿生设计能力。',
    wilderFocus: ['W', 'I', 'D'],
    wilderGoals: {
      W: '植物怎么"吃虫子"？',
      I: '观察食虫植物如猪笼草、捕蝇草的构造',
      L: '分析其捕虫原理，如黏附、闭合、陷阱结构等',
      D: '设计仿生捕虫装置并测试诱捕效果',
      E: '展示《仿生捕虫装置+策略说明手册》',
      R: '反思自然灵感如何转化为工程设计创意'
    },
    skills: ['仿生设计', '观察分析'],
    thinkingModels: ['仿生思维', '功能分析']
  },
  {
    id: 'G2-04',
    name: '日晷新科技',
    displayName: '日晷新科技｜制作石头日晷',
    type: '科创',
    grade: '二年级',
    level: 'L2',
    month: '10月',
    duration: '90-120min',
    location: '公园lab',
    description: '通过制作一个石头日晷，引导学生了解日晷原理和地球运动的基本知识。',
    wilderFocus: ['W', 'L', 'D'],
    wilderGoals: {
      W: '古人怎么知道时间？',
      I: '观察太阳位置与影子变化',
      L: '理解地球自转与太阳方位关系',
      D: '设计并制作石头日晷',
      E: '演示日晷计时并讲解原理',
      R: '反思古人智慧与现代计时的联系'
    },
    skills: ['天文基础', '动手制作'],
    thinkingModels: ['历史思维', '空间思维']
  },
  
  // ========== 科考课程 ==========
  {
    id: 'EXP-01',
    name: '森林昆虫探险',
    displayName: '森林昆虫探险｜发现身边的微观世界',
    type: '科考',
    grade: '一二年级',
    level: 'L1-L2',
    month: '夏季',
    duration: '半天',
    location: '户外森林',
    description: '深入森林探索昆虫世界，学习昆虫分类与生态习性，培养野外观察能力。',
    wilderFocus: ['W', 'I', 'L'],
    wilderGoals: {
      W: '森林里藏着多少种昆虫？',
      I: '使用放大镜、网兜等工具观察采集',
      L: '学习昆虫分类与生态位知识',
      D: '制作昆虫观察记录本',
      E: '分享发现的神奇昆虫',
      R: '反思人与昆虫的生态关系'
    },
    skills: ['野外观察', '分类能力'],
    thinkingModels: ['生态思维']
  },
  {
    id: 'EXP-02',
    name: '湿地生态考察',
    displayName: '湿地生态考察｜探索水陆交界的秘密',
    type: '科考',
    grade: '二三年级',
    level: 'L2-L3',
    month: '春秋',
    duration: '一天',
    location: '湿地公园',
    description: '考察湿地生态系统，观察水生植物与动物，理解湿地的生态功能。',
    wilderFocus: ['I', 'L', 'R'],
    wilderGoals: {
      W: '湿地为什么被称为"地球之肾"？',
      I: '采集水样、观察水生生物',
      L: '理解湿地生态系统的食物链',
      D: '绘制湿地生态图谱',
      E: '汇报考察发现',
      R: '反思湿地保护的重要性'
    },
    skills: ['生态调查', '系统思维'],
    thinkingModels: ['系统思维', '环保意识']
  },
  {
    id: 'EXP-03',
    name: '夜观星空',
    displayName: '夜观星空｜探索宇宙的奥秘',
    type: '科考',
    grade: '三年级以上',
    level: 'L3+',
    month: '秋冬',
    duration: '晚间3小时',
    location: '郊外营地',
    description: '在远离光污染的地方观测星空，认识星座、行星，了解宇宙的浩瀚。',
    wilderFocus: ['W', 'I', 'L'],
    wilderGoals: {
      W: '星星为什么会眨眼睛？',
      I: '使用望远镜观测星体',
      L: '学习星座神话与天文知识',
      D: '绘制星空图',
      E: '讲述星座故事',
      R: '反思人类在宇宙中的位置'
    },
    skills: ['天文观测', '空间想象'],
    thinkingModels: ['宇宙观', '叙事思维']
  },

  // ========== 三年级 (L3) ==========
  {
    id: 'G3-01',
    name: '电路魔法师',
    displayName: '电路魔法师｜点亮你的第一盏灯',
    type: '科创',
    grade: '三年级',
    level: 'L3',
    month: '3月',
    duration: '90-120min',
    location: '学校lab',
    description: '学习基础电路原理，动手搭建简单电路，点亮LED灯，理解电流的奥秘。',
    wilderFocus: ['I', 'D'],
    wilderGoals: {
      W: '电是怎么让灯亮起来的？',
      I: '探索导体、绝缘体和电路闭合原理',
      L: '理解电流、电压、电阻的基本关系',
      D: '设计并搭建创意电路作品',
      E: '展示并讲解自己的电路设计',
      R: '反思电在日常生活中的应用'
    },
    skills: ['电路设计', '动手能力'],
    thinkingModels: ['因果推理', '系统思维']
  },
  {
    id: 'G3-02',
    name: '微生物探险家',
    displayName: '微生物探险家｜发现肉眼看不见的世界',
    type: '科普',
    grade: '三年级',
    level: 'L3',
    month: '4月',
    duration: '45-90min',
    location: '学校lab',
    description: '使用显微镜观察水滴、土壤、食物中的微生物，探索微观世界的奥秘。',
    wilderFocus: ['W', 'I'],
    wilderGoals: {
      W: '水滴里有什么小生命？',
      I: '使用显微镜观察各种样本',
      L: '了解微生物的种类和作用',
      D: '制作微生物观察记录卡',
      E: '分享观察发现',
      R: '反思微生物与人类的关系'
    },
    skills: ['显微镜使用', '观察记录'],
    thinkingModels: ['微观思维', '生态思维']
  },
  {
    id: 'G3-03',
    name: '桥梁工程师',
    displayName: '桥梁工程师｜设计能承重的桥梁',
    type: '科创',
    grade: '三年级',
    level: 'L3',
    month: '5月',
    duration: '90-120min',
    location: '公园lab',
    description: '学习不同桥梁结构的力学原理，用简单材料设计并建造能承重的桥梁。',
    wilderFocus: ['D', 'I', 'R'],
    wilderGoals: {
      W: '什么样的桥最结实？',
      I: '研究拱桥、悬索桥、桁架桥的结构特点',
      L: '理解力的分散与传递原理',
      D: '设计并建造承重桥梁模型',
      E: '进行承重测试并展示设计理念',
      R: '反思结构优化的工程思维'
    },
    skills: ['结构设计', '力学分析'],
    thinkingModels: ['工程思维', '优化迭代']
  },
  {
    id: 'G3-04',
    name: '化学厨房',
    displayName: '化学厨房｜厨房里的科学实验',
    type: '科普',
    grade: '三年级',
    level: 'L3',
    month: '6月',
    duration: '45-90min',
    location: '学校lab',
    description: '用厨房常见材料进行化学实验，探索酸碱反应、发酵等化学原理。',
    wilderFocus: ['I', 'W', 'D'],
    wilderGoals: {
      W: '醋和小苏打混合会怎样？',
      I: '进行酸碱反应、发酵等实验',
      L: '理解化学反应的基本原理',
      D: '设计创意化学实验',
      E: '记录并分享实验过程',
      R: '反思化学在生活中的应用'
    },
    skills: ['实验操作', '安全意识'],
    thinkingModels: ['实验思维', '因果推理']
  },
  {
    id: 'G3-05',
    name: '气象小专家',
    displayName: '气象小专家｜建立你的气象站',
    type: '科创',
    grade: '三年级',
    level: 'L3',
    month: '9月',
    duration: '90-120min',
    location: '公园lab',
    description: '学习气象知识，制作简易气象仪器，建立个人气象观测站。',
    wilderFocus: ['I', 'D', 'L'],
    wilderGoals: {
      W: '天气是怎么预报的？',
      I: '观测温度、湿度、风向、气压等气象要素',
      L: '理解气象变化的规律和原因',
      D: '制作温度计、风向标、雨量计等仪器',
      E: '进行天气预报播报',
      R: '反思气候变化对生活的影响'
    },
    skills: ['数据观测', '仪器制作'],
    thinkingModels: ['数据思维', '系统思维']
  },

  // ========== 四年级 (L4) ==========
  {
    id: 'G4-01',
    name: '机器人初探',
    displayName: '机器人初探｜编程让机器人动起来',
    type: '科创',
    grade: '四年级',
    level: 'L4',
    month: '3月',
    duration: '90-120min',
    location: '学校lab',
    description: '学习基础编程概念，使用图形化编程控制机器人完成任务。',
    wilderFocus: ['D', 'I'],
    wilderGoals: {
      W: '机器人是怎么听懂指令的？',
      I: '探索传感器和执行器的工作原理',
      L: '理解程序逻辑和控制流程',
      D: '编写程序让机器人完成挑战任务',
      E: '展示机器人作品并讲解程序逻辑',
      R: '反思人工智能的发展和影响'
    },
    skills: ['编程思维', '问题分解'],
    thinkingModels: ['算法思维', '迭代优化']
  },
  {
    id: 'G4-02',
    name: '生态瓶世界',
    displayName: '生态瓶世界｜创造一个微型生态系统',
    type: '科创',
    grade: '四年级',
    level: 'L4',
    month: '4月',
    duration: '90-120min',
    location: '公园lab',
    description: '设计并建造密封生态瓶，观察生态系统的物质循环和能量流动。',
    wilderFocus: ['L', 'I', 'W'],
    wilderGoals: {
      W: '瓶子里的生物能自己活下去吗？',
      I: '研究生产者、消费者、分解者的关系',
      L: '理解生态系统的平衡原理',
      D: '设计并建造自给自足的生态瓶',
      E: '长期观察并记录生态变化',
      R: '反思人类对地球生态的影响'
    },
    skills: ['系统设计', '长期观察'],
    thinkingModels: ['系统思维', '生态思维']
  },
  {
    id: 'G4-03',
    name: '能量转换站',
    displayName: '能量转换站｜探索能量的变化形式',
    type: '科普',
    grade: '四年级',
    level: 'L4',
    month: '5月',
    duration: '45-90min',
    location: '学校lab',
    description: '通过实验探索机械能、电能、热能、光能等能量形式之间的转换。',
    wilderFocus: ['I', 'W'],
    wilderGoals: {
      W: '能量可以从一种形式变成另一种吗？',
      I: '进行各种能量转换实验',
      L: '理解能量守恒定律',
      D: '设计能量转换装置',
      E: '演示并讲解能量转换过程',
      R: '反思可再生能源的重要性'
    },
    skills: ['实验分析', '概念理解'],
    thinkingModels: ['因果推理', '守恒思维']
  },
  {
    id: 'G4-04',
    name: '仿生设计师',
    displayName: '仿生设计师｜向自然学习设计',
    type: '科创',
    grade: '四年级',
    level: 'L4',
    month: '10月',
    duration: '90-120min',
    location: '公园lab',
    description: '观察自然界的巧妙设计，学习仿生学原理，设计仿生作品。',
    wilderFocus: ['D', 'W', 'L'],
    wilderGoals: {
      W: '自然界有哪些值得学习的设计？',
      I: '观察研究动植物的结构和功能',
      L: '理解仿生学的基本原理和应用',
      D: '设计并制作仿生作品',
      E: '展示并讲解仿生设计理念',
      R: '反思人与自然的关系'
    },
    skills: ['观察力', '创意设计'],
    thinkingModels: ['仿生思维', '设计思维']
  },
  {
    id: 'G4-05',
    name: '密码与编码',
    displayName: '密码与编码｜信息安全的秘密',
    type: '科普',
    grade: '四年级',
    level: 'L4',
    month: '11月',
    duration: '45-90min',
    location: '学校lab',
    description: '学习密码学基础，了解编码和解码原理，体验信息安全的重要性。',
    wilderFocus: ['I', 'D', 'R'],
    wilderGoals: {
      W: '密码是怎么保护信息的？',
      I: '探索凯撒密码、摩斯密码等加密方法',
      L: '理解编码和解码的数学原理',
      D: '设计自己的加密系统',
      E: '进行密码破解挑战赛',
      R: '反思信息安全的重要性'
    },
    skills: ['逻辑推理', '模式识别'],
    thinkingModels: ['数学思维', '安全思维']
  },

  // ========== 五六年级 (L5-L6) ==========
  {
    id: 'G56-01',
    name: '基因探秘',
    displayName: '基因探秘｜生命的密码',
    type: '科普',
    grade: '五六年级',
    level: 'L5-L6',
    month: '4月',
    duration: '45-90min',
    location: '学校lab',
    description: '学习DNA结构和遗传原理，进行DNA提取实验，探索生命的奥秘。',
    wilderFocus: ['I', 'W'],
    wilderGoals: {
      W: '为什么孩子长得像父母？',
      I: '进行DNA提取和观察实验',
      L: '理解基因、染色体、遗传的关系',
      D: '制作DNA双螺旋模型',
      E: '讲解遗传学基本原理',
      R: '反思基因技术的伦理问题'
    },
    skills: ['实验操作', '科学推理'],
    thinkingModels: ['分子思维', '系统思维']
  },
  {
    id: 'G56-02',
    name: '可持续城市',
    displayName: '可持续城市｜设计未来绿色城市',
    type: '科创',
    grade: '五六年级',
    level: 'L5-L6',
    month: '5月',
    duration: '90-120min',
    location: '公园lab',
    description: '学习可持续发展理念，设计节能环保的未来城市模型。',
    wilderFocus: ['D', 'L', 'E'],
    wilderGoals: {
      W: '未来城市会是什么样子？',
      I: '研究城市能源、交通、垃圾处理等系统',
      L: '理解可持续发展的原则和实践',
      D: '设计并建造可持续城市模型',
      E: '向"市民"推介城市设计方案',
      R: '反思个人行动对环境的影响'
    },
    skills: ['系统设计', '环保意识'],
    thinkingModels: ['可持续思维', '系统思维']
  },
  {
    id: 'G56-03',
    name: '火箭发射',
    displayName: '火箭发射｜探索航天原理',
    type: '科创',
    grade: '五六年级',
    level: 'L5-L6',
    month: '6月',
    duration: '90-120min',
    location: '户外场地',
    description: '学习火箭飞行原理，设计并发射水火箭，探索航天科技。',
    wilderFocus: ['D', 'I', 'W'],
    wilderGoals: {
      W: '火箭是怎么飞上天的？',
      I: '探索牛顿第三定律和空气动力学',
      L: '理解推进、升力、重力的关系',
      D: '设计并制作能飞得最高的水火箭',
      E: '进行发射比赛并分析改进方向',
      R: '反思人类航天探索的意义'
    },
    skills: ['工程设计', '数据分析'],
    thinkingModels: ['工程思维', '优化迭代']
  },
  {
    id: 'G56-04',
    name: '人工智能入门',
    displayName: '人工智能入门｜让机器学会思考',
    type: '科创',
    grade: '五六年级',
    level: 'L5-L6',
    month: '9月',
    duration: '90-120min',
    location: '学校lab',
    description: '了解人工智能基本概念，体验机器学习，思考AI的未来。',
    wilderFocus: ['I', 'D', 'R'],
    wilderGoals: {
      W: '机器能像人一样思考吗？',
      I: '探索机器学习的基本原理',
      L: '理解训练数据、算法、模型的关系',
      D: '训练一个简单的图像识别模型',
      E: '展示AI作品并讨论AI伦理',
      R: '反思AI对未来社会的影响'
    },
    skills: ['计算思维', '批判思考'],
    thinkingModels: ['算法思维', '伦理思维']
  },
  {
    id: 'G56-05',
    name: '科学辩论赛',
    displayName: '科学辩论赛｜用证据说话',
    type: '科普',
    grade: '五六年级',
    level: 'L5-L6',
    month: '11月',
    duration: '90-120min',
    location: '学校lab',
    description: '学习科学论证方法，围绕科学话题进行辩论，培养批判性思维。',
    wilderFocus: ['E', 'I', 'R'],
    wilderGoals: {
      W: '如何用科学证据支持观点？',
      I: '研究辩题相关的科学证据和数据',
      L: '理解科学论证的逻辑结构',
      D: '准备辩论材料和论证策略',
      E: '参与科学辩论赛',
      R: '反思科学素养和批判性思维的重要性'
    },
    skills: ['逻辑推理', '公众表达'],
    thinkingModels: ['批判思维', '论证思维']
  },

  // ========== WILDER维度专项课程 ==========
  // W维度专项课程
  {
    id: 'W-01',
    name: '好奇心实验室',
    displayName: '好奇心实验室｜每个问题都值得探索',
    type: '科普',
    grade: '全年级',
    level: 'L0-L6',
    month: '全年',
    duration: '45-90min',
    location: '学校lab',
    description: '由学生提出感兴趣的问题，老师引导进行探索性实验，培养提问能力。',
    wilderFocus: ['W', 'I'],
    wilderGoals: {
      W: '你最想知道什么问题的答案？',
      I: '设计实验探索自己的问题',
      L: '理解科学探究的基本方法',
      D: '设计验证假设的实验方案',
      E: '分享探索发现',
      R: '反思提问的价值'
    },
    skills: ['提问能力', '探究精神'],
    thinkingModels: ['问题导向思维']
  },
  {
    id: 'W-02',
    name: '神奇物种档案',
    displayName: '神奇物种档案｜发现地球上最奇特的生命',
    type: '科考',
    grade: '全年级',
    level: 'L0-L6',
    month: '春秋',
    duration: '半天',
    location: '动物园/博物馆',
    description: '参观观察奇特的动植物，了解它们独特的生存策略和进化故事。',
    wilderFocus: ['W', 'I', 'L'],
    wilderGoals: {
      W: '地球上还有什么神奇的生物？',
      I: '观察记录物种的特征和行为',
      L: '了解物种适应环境的进化策略',
      D: '制作物种档案卡',
      E: '讲述最喜欢的物种故事',
      R: '反思生物多样性的价值'
    },
    skills: ['观察力', '信息整理'],
    thinkingModels: ['进化思维', '分类思维']
  },

  // I维度专项课程
  {
    id: 'I-01',
    name: '科学方法训练营',
    displayName: '科学方法训练营｜像科学家一样思考',
    type: '科创',
    grade: '三年级以上',
    level: 'L3+',
    month: '暑期',
    duration: '3天',
    location: '学校lab',
    description: '系统学习科学研究方法：提出问题、查阅资料、设计实验、收集数据、得出结论。',
    wilderFocus: ['I', 'R', 'D'],
    wilderGoals: {
      W: '科学家是怎么做研究的？',
      I: '实践完整的科学研究流程',
      L: '理解变量控制和对照实验',
      D: '设计并完成一个小型研究项目',
      E: '撰写并展示研究报告',
      R: '反思科学研究的严谨性'
    },
    skills: ['科学方法', '研究设计'],
    thinkingModels: ['实证思维', '系统思维']
  },
  {
    id: 'I-02',
    name: '数据侦探',
    displayName: '数据侦探｜用数据解决问题',
    type: '科创',
    grade: '四年级以上',
    level: 'L4+',
    month: '10月',
    duration: '90-120min',
    location: '学校lab',
    description: '学习数据收集和分析方法，用数据回答感兴趣的问题。',
    wilderFocus: ['I', 'D', 'R'],
    wilderGoals: {
      W: '数据能告诉我们什么故事？',
      I: '设计问卷或实验收集数据',
      L: '学习数据可视化和统计基础',
      D: '用数据分析回答研究问题',
      E: '制作数据可视化作品并展示',
      R: '反思数据的局限性和偏见'
    },
    skills: ['数据分析', '统计思维'],
    thinkingModels: ['数据思维', '批判思维']
  },

  // L维度专项课程
  {
    id: 'L-01',
    name: '生态守护者',
    displayName: '生态守护者｜保护我们的地球家园',
    type: '科考',
    grade: '全年级',
    level: 'L0-L6',
    month: '地球日',
    duration: '一天',
    location: '自然保护区',
    description: '参与生态保护实践，了解环境问题和保护行动。',
    wilderFocus: ['L', 'E', 'R'],
    wilderGoals: {
      W: '我们能为地球做什么？',
      I: '调查当地生态环境状况',
      L: '了解环境问题和保护措施',
      D: '设计并实施环保行动方案',
      E: '宣传环保理念',
      R: '反思个人行动的影响力'
    },
    skills: ['环保意识', '行动力'],
    thinkingModels: ['生态思维', '系统思维']
  },
  {
    id: 'L-02',
    name: '动物行为观察',
    displayName: '动物行为观察｜理解动物的语言',
    type: '科考',
    grade: '二年级以上',
    level: 'L2+',
    month: '春秋',
    duration: '半天',
    location: '户外公园',
    description: '系统学习动物行为观察方法，记录和分析动物的沟通和社会行为。',
    wilderFocus: ['L', 'I', 'W'],
    wilderGoals: {
      W: '动物之间怎么交流？',
      I: '使用观察记录表系统记录行为',
      L: '理解动物行为的意义和原因',
      D: '制作动物行为图鉴',
      E: '分享观察发现',
      R: '反思人与动物的关系'
    },
    skills: ['行为观察', '记录分析'],
    thinkingModels: ['行为学思维', '同理心']
  },

  // D维度专项课程
  {
    id: 'D-01',
    name: '设计思维工坊',
    displayName: '设计思维工坊｜用设计解决真实问题',
    type: '科创',
    grade: '三年级以上',
    level: 'L3+',
    month: '全年',
    duration: '120min',
    location: '学校lab',
    description: '学习设计思维五步法，针对真实问题进行同理心调研、定义问题、创意发散、原型制作、测试迭代。',
    wilderFocus: ['D', 'E', 'R'],
    wilderGoals: {
      W: '如何设计出真正有用的东西？',
      I: '进行用户调研了解真实需求',
      L: '理解以人为中心的设计理念',
      D: '制作低保真原型并测试',
      E: '向"用户"展示并收集反馈',
      R: '根据反馈迭代优化设计'
    },
    skills: ['设计思维', '创新能力'],
    thinkingModels: ['设计思维', '用户思维']
  },
  {
    id: 'D-02',
    name: '创客马拉松',
    displayName: '创客马拉松｜24小时创造挑战',
    type: '科创',
    grade: '四年级以上',
    level: 'L4+',
    month: '寒暑假',
    duration: '24小时',
    location: '创客空间',
    description: '团队合作，在限定时间内完成一个创意项目，体验从想法到产品的全过程。',
    wilderFocus: ['D', 'R', 'L'],
    wilderGoals: {
      W: '一天能做出什么？',
      I: '快速学习所需技能',
      L: '团队协作分工合作',
      D: '动手制作创意作品',
      E: '项目路演和展示',
      R: '反思团队协作和时间管理'
    },
    skills: ['项目管理', '团队协作'],
    thinkingModels: ['敏捷思维', '协作思维']
  },

  // E维度专项课程
  {
    id: 'E-01',
    name: '科学演讲家',
    displayName: '科学演讲家｜把科学讲给大家听',
    type: '科普',
    grade: '三年级以上',
    level: 'L3+',
    month: '全年',
    duration: '90min',
    location: '学校lab',
    description: '学习科学传播技巧，准备并进行科学主题的公众演讲。',
    wilderFocus: ['E', 'I', 'R'],
    wilderGoals: {
      W: '怎样把复杂的科学讲清楚？',
      I: '深入研究一个科学话题',
      L: '学习演讲结构和表达技巧',
      D: '准备演讲稿和视觉辅助',
      E: '进行科学演讲',
      R: '根据反馈改进表达方式'
    },
    skills: ['公众表达', '科学传播'],
    thinkingModels: ['故事思维', '观众思维']
  },
  {
    id: 'E-02',
    name: '环保大使',
    displayName: '环保大使｜传播绿色理念',
    type: '科考',
    grade: '全年级',
    level: 'L0-L6',
    month: '世界环境日',
    duration: '一天',
    location: '社区/学校',
    description: '学习环保知识后，设计并实施环保宣传活动，影响更多人。',
    wilderFocus: ['E', 'L', 'D'],
    wilderGoals: {
      W: '怎样让更多人关注环保？',
      I: '研究有效的传播方法',
      L: '理解环保的重要性和紧迫性',
      D: '设计宣传海报、视频或活动',
      E: '组织环保宣传活动',
      R: '反思宣传效果和改进方向'
    },
    skills: ['宣传策划', '影响力'],
    thinkingModels: ['传播思维', '影响力思维']
  },

  // R维度专项课程
  {
    id: 'R-01',
    name: '失败学院',
    displayName: '失败学院｜从失败中学习',
    type: '科创',
    grade: '全年级',
    level: 'L0-L6',
    month: '全年',
    duration: '90min',
    location: '学校lab',
    description: '分享和分析失败案例，学习如何从失败中汲取教训，培养成长型思维。',
    wilderFocus: ['R', 'W', 'D'],
    wilderGoals: {
      W: '失败真的是成功之母吗？',
      I: '分析失败的原因和模式',
      L: '学习著名科学家的失败故事',
      D: '故意设计一个"失败"实验',
      E: '分享自己的失败故事和收获',
      R: '建立对失败的健康态度'
    },
    skills: ['反思能力', '韧性'],
    thinkingModels: ['成长型思维', '迭代思维']
  },
  {
    id: 'R-02',
    name: '科学家的笔记本',
    displayName: '科学家的笔记本｜记录思考的轨迹',
    type: '科普',
    grade: '二年级以上',
    level: 'L2+',
    month: '开学季',
    duration: '45-90min',
    location: '学校lab',
    description: '学习如何记录科学笔记，包括观察记录、实验记录、思维图、反思日志等。',
    wilderFocus: ['R', 'I', 'E'],
    wilderGoals: {
      W: '科学家是怎么记笔记的？',
      I: '学习不同类型的科学记录方法',
      L: '理解记录对科学思维的重要性',
      D: '设计个人科学笔记本格式',
      E: '分享笔记中的发现和想法',
      R: '养成记录和反思的习惯'
    },
    skills: ['记录能力', '反思习惯'],
    thinkingModels: ['元认知', '可视化思维']
  }
]

/**
 * 根据WILDER画像推荐课程
 * @param topDims 排序后的WILDER维度数组（前2个为优势维度）
 * @param age 学生年龄
 * @returns 推荐课程列表
 */
export function recommendCourses(
  topDims: { key: string; score: number }[],
  age: number
): Course[] {
  // 确定适合的年级
  const gradeFilter = getGradeFilter(age)
  
  // 获取优势维度（前2个）
  const topKeys = topDims.slice(0, 2).map(d => d.key)
  
  // 筛选匹配的课程
  const matchedCourses = COURSE_DATABASE.filter(course => {
    // 年级匹配
    const gradeMatch = gradeFilter.some(g => course.grade.includes(g))
    if (!gradeMatch) return false
    
    // WILDER维度匹配（课程的主要培养维度包含学生的优势维度）
    const dimMatch = course.wilderFocus.some(dim => topKeys.includes(dim))
    return dimMatch
  })
  
  // 按匹配度排序（优先推荐与两个优势维度都匹配的课程）
  const sorted = matchedCourses.sort((a, b) => {
    const aScore = a.wilderFocus.filter(dim => topKeys.includes(dim)).length
    const bScore = b.wilderFocus.filter(dim => topKeys.includes(dim)).length
    return bScore - aScore
  })
  
  // 返回前6个推荐
  return sorted.slice(0, 6)
}

function getGradeFilter(age: number): string[] {
  if (age <= 6) return ['幼儿园']
  if (age === 7) return ['幼儿园', '一年级']
  if (age === 8) return ['一年级', '二年级', '一二年级']
  if (age === 9) return ['二年级', '三年级', '二三年级']
  if (age === 10) return ['三年级', '四年级', '三年级以上']
  if (age === 11) return ['四年级', '五年级', '三年级以上']
  if (age === 12) return ['五年级', '六年级', '三年级以上']
  if (age <= 15) return ['三年级以上'] // 初中
  return ['三年级以上'] // 高中
}

/**
 * 获取课程类型图标
 */
export function getCourseTypeIcon(type: Course['type']): string {
  switch (type) {
    case '科普': return '📚'
    case '科创': return '🔧'
    case '科考': return '🏕️'
  }
}

/**
 * 获取课程类型颜色
 */
export function getCourseTypeColor(type: Course['type']): string {
  switch (type) {
    case '科普': return 'blue'
    case '科创': return 'violet'
    case '科考': return 'emerald'
  }
}
