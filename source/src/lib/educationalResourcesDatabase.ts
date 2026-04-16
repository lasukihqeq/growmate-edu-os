/**
 * 教育资源推荐数据库
 * 包含竞赛、夏令营、在线课程、博物馆、期刊杂志等推荐
 */

// ==================== 类型定义 ====================

export interface CompetitionRec {
  name: string
  category: 'science' | 'math' | 'tech' | 'art' | 'language' | 'comprehensive'
  level: '国际' | '国家级' | '省级' | '市级'
  gradeRange: string
  organizer: string
  description: string
  benefit: string
  preparationTime: string
  relatedDims: string[]  // WILDER维度
}

export interface SummerCampRec {
  name: string
  type: '学术' | '科技' | '艺术' | '体育' | '综合'
  organizer: string
  location: string
  duration: string
  gradeRange: string
  description: string
  highlights: string[]
  relatedDims: string[]
}

export interface OnlineCourseRec {
  name: string
  platform: string
  subject: string
  difficulty: '入门' | '进阶' | '高级'
  ageRange: string
  duration: string
  description: string
  skills: string[]
  relatedDims: string[]
}

export interface MuseumRec {
  name: string
  city: string
  type: '科技馆' | '自然博物馆' | '历史博物馆' | '艺术馆' | '综合'
  highlights: string[]
  recommendedAge: string
  visitTips: string
  relatedDims: string[]
}

export interface JournalRec {
  name: string
  type: '科普' | '学术' | '兴趣'
  frequency: string
  ageRange: string
  description: string
  sampleTopics: string[]
  relatedDims: string[]
}

export interface CommunityRec {
  name: string
  type: '线上社区' | '线下社团' | '比赛组织'
  platform?: string
  description: string
  benefits: string[]
  relatedDims: string[]
}

// ==================== 竞赛推荐数据库 ====================

export const COMPETITIONS: CompetitionRec[] = [
  // 科学类竞赛
  {
    name: '全国青少年科技创新大赛',
    category: 'science',
    level: '国家级',
    gradeRange: '小学-高中',
    organizer: '中国科协、教育部',
    description: '国内最具影响力的青少年科技竞赛，涵盖发明创造、科学研究论文等',
    benefit: '获奖可获得高校自主招生加分，培养科学研究能力',
    preparationTime: '3-6个月',
    relatedDims: ['W', 'I', 'D'],
  },
  {
    name: '国际科学与工程大奖赛(ISEF)',
    category: 'science',
    level: '国际',
    gradeRange: '初中-高中',
    organizer: '美国科学与公众协会',
    description: '全球最大规模的中学生科学竞赛，被誉为"青少年诺贝尔奖"',
    benefit: '国际认可度高，获奖者常被顶尖大学录取',
    preparationTime: '6-12个月',
    relatedDims: ['W', 'I', 'D', 'R'],
  },
  {
    name: '全国中学生生物学奥林匹克竞赛',
    category: 'science',
    level: '国家级',
    gradeRange: '高中',
    organizer: '中国植物学会、动物学会',
    description: '生物学领域最高级别中学生竞赛',
    benefit: '金牌选手可直接进入国家集训队，保送名校',
    preparationTime: '1-2年',
    relatedDims: ['W', 'I'],
  },
  {
    name: '全国青少年人工智能创新挑战赛',
    category: 'tech',
    level: '国家级',
    gradeRange: '小学-高中',
    organizer: '中国少年儿童发展服务中心',
    description: 'AI领域专业竞赛，涵盖机器学习、计算机视觉等方向',
    benefit: '紧跟科技前沿，培养AI时代核心竞争力',
    preparationTime: '3-6个月',
    relatedDims: ['I', 'D'],
  },

  // 数学类竞赛
  {
    name: '全国高中数学联赛',
    category: 'math',
    level: '国家级',
    gradeRange: '高中',
    organizer: '中国数学会',
    description: '国内最权威的数学竞赛，选拔国际数学奥林匹克选手',
    benefit: '省一等奖以上可获得名校自主招生资格',
    preparationTime: '1-2年',
    relatedDims: ['I', 'D'],
  },
  {
    name: '美国数学竞赛(AMC)',
    category: 'math',
    level: '国际',
    gradeRange: '初中-高中',
    organizer: '美国数学协会',
    description: '全球影响力最大的数学竞赛之一',
    benefit: 'AMC12高分可晋级AIME，是美国名校申请重要加分项',
    preparationTime: '6个月-1年',
    relatedDims: ['I', 'D', 'R'],
  },
  {
    name: '华罗庚金杯少年数学邀请赛',
    category: 'math',
    level: '国家级',
    gradeRange: '小学-初中',
    organizer: '中国少年报社',
    description: '面向小学生的数学思维竞赛',
    benefit: '培养数学兴趣和逻辑思维能力',
    preparationTime: '3-6个月',
    relatedDims: ['I', 'D'],
  },

  // 科技类竞赛
  {
    name: '全国青少年信息学奥林匹克竞赛(NOI)',
    category: 'tech',
    level: '国家级',
    gradeRange: '初中-高中',
    organizer: '中国计算机学会',
    description: '编程与算法领域最高级别中学生竞赛',
    benefit: '金牌选手可直接保送清华北大',
    preparationTime: '2-3年',
    relatedDims: ['I', 'D', 'R'],
  },
  {
    name: '世界机器人大赛',
    category: 'tech',
    level: '国际',
    gradeRange: '小学-高中',
    organizer: '中国电子学会',
    description: '机器人领域国际级赛事，涵盖编程、机械设计等',
    benefit: '培养动手能力和工程思维',
    preparationTime: '3-6个月',
    relatedDims: ['D', 'I', 'L'],
  },
  {
    name: '全国中小学信息技术创新与实践大赛(NOC)',
    category: 'tech',
    level: '国家级',
    gradeRange: '小学-高中',
    organizer: '城乡统筹发展研究中心',
    description: '信息技术应用创新大赛',
    benefit: '培养信息技术应用能力和创新意识',
    preparationTime: '2-4个月',
    relatedDims: ['D', 'I'],
  },

  // 语言艺术类竞赛
  {
    name: '全国中小学生演讲比赛',
    category: 'language',
    level: '国家级',
    gradeRange: '小学-高中',
    organizer: '中国少年儿童新闻出版总社',
    description: '培养语言表达和公众演讲能力',
    benefit: '提升自信心和沟通能力',
    preparationTime: '1-3个月',
    relatedDims: ['E', 'L'],
  },
  {
    name: '全国青少年创意写作大赛',
    category: 'language',
    level: '国家级',
    gradeRange: '小学-高中',
    organizer: '中国作家协会',
    description: '激发创意写作潜能，培养文学素养',
    benefit: '提升写作能力和创意思维',
    preparationTime: '1-3个月',
    relatedDims: ['E', 'W', 'R'],
  },

  // 艺术类竞赛
  {
    name: '全国中小学生绘画书法作品比赛',
    category: 'art',
    level: '国家级',
    gradeRange: '小学-高中',
    organizer: '中国艺术教育促进会',
    description: '美术书法领域权威赛事',
    benefit: '培养艺术审美和创作能力',
    preparationTime: '2-4个月',
    relatedDims: ['D', 'E'],
  },

  // 综合类竞赛
  {
    name: '全国青少年模拟政协提案征集活动',
    category: 'comprehensive',
    level: '国家级',
    gradeRange: '初中-高中',
    organizer: '共青团中央',
    description: '培养社会责任感和公民意识',
    benefit: '提升社会调研能力和公共表达能力',
    preparationTime: '2-4个月',
    relatedDims: ['L', 'E', 'R'],
  },
]

// ==================== 夏令营/研学推荐数据库 ====================

export const SUMMER_CAMPS: SummerCampRec[] = [
  {
    name: '中国科学院大学科学夏令营',
    type: '学术',
    organizer: '中国科学院大学',
    location: '北京',
    duration: '7天',
    gradeRange: '初中-高中',
    description: '走进中科院实验室，与科学家面对面交流',
    highlights: ['参观国家重点实验室', '聆听院士讲座', '动手科学实验', '科研院所参访'],
    relatedDims: ['W', 'I'],
  },
  {
    name: '清华大学工程物理夏令营',
    type: '学术',
    organizer: '清华大学',
    location: '北京',
    duration: '5天',
    gradeRange: '高中',
    description: '体验清华工程教育，了解前沿科技',
    highlights: ['清华实验室参观', '教授指导项目', '学长经验分享', '校园深度体验'],
    relatedDims: ['I', 'D'],
  },
  {
    name: '北京大学人文社科夏令营',
    type: '学术',
    organizer: '北京大学',
    location: '北京',
    duration: '5天',
    gradeRange: '高中',
    description: '感受北大人文底蕴，探索社会科学',
    highlights: ['名师讲座', '学术研讨', '图书馆体验', '文化参访'],
    relatedDims: ['E', 'L', 'R'],
  },
  {
    name: '腾讯青少年科技营',
    type: '科技',
    organizer: '腾讯',
    location: '深圳',
    duration: '5天',
    gradeRange: '初中-高中',
    description: '了解互联网科技，体验产品开发',
    highlights: ['腾讯总部参观', '编程工作坊', '产品经理体验', 'AI技术入门'],
    relatedDims: ['D', 'I'],
  },
  {
    name: '华为未来种子科技营',
    type: '科技',
    organizer: '华为',
    location: '深圳/东莞',
    duration: '7天',
    gradeRange: '高中',
    description: '探索ICT技术，培养科技创新意识',
    highlights: ['华为园区参观', '5G技术体验', '芯片科普', '工程师面对面'],
    relatedDims: ['I', 'D'],
  },
  {
    name: '大疆无人机科技营',
    type: '科技',
    organizer: '大疆创新',
    location: '深圳',
    duration: '5天',
    gradeRange: '初中-高中',
    description: '学习无人机技术，体验飞行乐趣',
    highlights: ['无人机原理', '飞行操控', '航拍技巧', '编程控制'],
    relatedDims: ['D', 'I', 'W'],
  },
  {
    name: '西双版纳热带雨林科考营',
    type: '综合',
    organizer: '中科院西双版纳植物园',
    location: '云南西双版纳',
    duration: '7天',
    gradeRange: '小学-初中',
    description: '探索热带雨林生态，培养自然观察力',
    highlights: ['雨林探险', '物种观察', '生态研究', '傣族文化'],
    relatedDims: ['W', 'I', 'L'],
  },
  {
    name: '敦煌文化研学营',
    type: '综合',
    organizer: '敦煌研究院',
    location: '甘肃敦煌',
    duration: '6天',
    gradeRange: '初中-高中',
    description: '感受丝路文明，体验敦煌艺术',
    highlights: ['莫高窟深度参观', '壁画临摹', '沙漠探险', '历史文化讲座'],
    relatedDims: ['W', 'E', 'R'],
  },
  {
    name: '航天科技夏令营',
    type: '科技',
    organizer: '中国航天科技集团',
    location: '北京/文昌',
    duration: '7天',
    gradeRange: '初中-高中',
    description: '探索航天科技，感受太空魅力',
    highlights: ['航天器参观', '火箭模型制作', '航天员讲座', '发射场参观'],
    relatedDims: ['W', 'I', 'D'],
  },
  {
    name: '国家大剧院艺术夏令营',
    type: '艺术',
    organizer: '国家大剧院',
    location: '北京',
    duration: '7天',
    gradeRange: '小学-初中',
    description: '沉浸式艺术体验，培养艺术素养',
    highlights: ['音乐会欣赏', '戏剧工作坊', '艺术大师课', '舞台体验'],
    relatedDims: ['E', 'L'],
  },
]

// ==================== 在线课程推荐数据库 ====================

export const ONLINE_COURSES: OnlineCourseRec[] = [
  {
    name: '可汗学院数学课程',
    platform: '可汗学院',
    subject: '数学',
    difficulty: '入门',
    ageRange: '6-18岁',
    duration: '按需学习',
    description: '免费优质数学课程，从基础到高级全覆盖',
    skills: ['数学思维', '逻辑推理', '问题解决'],
    relatedDims: ['I', 'D'],
  },
  {
    name: 'Coursera计算机科学入门',
    platform: 'Coursera',
    subject: '计算机',
    difficulty: '入门',
    ageRange: '12-18岁',
    duration: '10周',
    description: '哈佛大学CS50课程，计算机科学经典入门',
    skills: ['编程基础', '计算思维', '算法入门'],
    relatedDims: ['I', 'D'],
  },
  {
    name: '少年得到科学课',
    platform: '少年得到',
    subject: '科学',
    difficulty: '入门',
    ageRange: '6-14岁',
    duration: '系列课程',
    description: '趣味科学课程，激发科学兴趣',
    skills: ['科学思维', '实验能力', '知识拓展'],
    relatedDims: ['W', 'I'],
  },
  {
    name: '学而思网校奥数课程',
    platform: '学而思',
    subject: '数学',
    difficulty: '进阶',
    ageRange: '8-15岁',
    duration: '学期制',
    description: '系统奥数培训，培养数学思维',
    skills: ['数学竞赛', '逻辑思维', '解题技巧'],
    relatedDims: ['I', 'D', 'R'],
  },
  {
    name: '编程猫创意编程',
    platform: '编程猫',
    subject: '编程',
    difficulty: '入门',
    ageRange: '6-16岁',
    duration: '按需学习',
    description: '图形化编程入门，培养计算思维',
    skills: ['编程思维', '创意表达', '逻辑能力'],
    relatedDims: ['D', 'I', 'E'],
  },
  {
    name: '网易公开课TED精选',
    platform: '网易公开课',
    subject: '综合',
    difficulty: '入门',
    ageRange: '10-18岁',
    duration: '每集15-20分钟',
    description: '全球优质演讲，拓展视野',
    skills: ['知识拓展', '英语听力', '思维启发'],
    relatedDims: ['W', 'E', 'R'],
  },
  {
    name: '中国大学MOOC精品课程',
    platform: '中国大学MOOC',
    subject: '综合',
    difficulty: '进阶',
    ageRange: '14-18岁',
    duration: '学期制',
    description: '国内顶尖大学课程，提前体验大学教育',
    skills: ['学科深入', '自主学习', '学术思维'],
    relatedDims: ['I', 'R'],
  },
  {
    name: '猿辅导科学实验课',
    platform: '猿辅导',
    subject: '科学',
    difficulty: '入门',
    ageRange: '6-12岁',
    duration: '系列课程',
    description: '在家就能做的科学实验',
    skills: ['动手能力', '科学探究', '观察能力'],
    relatedDims: ['W', 'I', 'D'],
  },
]

// ==================== 博物馆推荐数据库 ====================

export const MUSEUMS: MuseumRec[] = [
  {
    name: '中国科学技术馆',
    city: '北京',
    type: '科技馆',
    highlights: ['科学乐园', '华夏之光', '探索与发现', '科技与生活'],
    recommendedAge: '3-18岁',
    visitTips: '建议预留一整天，互动展品丰富',
    relatedDims: ['W', 'I', 'D'],
  },
  {
    name: '上海科技馆',
    city: '上海',
    type: '科技馆',
    highlights: ['生物万象', '地壳探秘', '智慧之光', '彩虹儿童乐园'],
    recommendedAge: '3-18岁',
    visitTips: '建议提前预约，周末人较多',
    relatedDims: ['W', 'I', 'D'],
  },
  {
    name: '北京自然博物馆',
    city: '北京',
    type: '自然博物馆',
    highlights: ['古生物展厅', '动物世界', '植物世界', '人体奥秘'],
    recommendedAge: '5-18岁',
    visitTips: '免费参观，需提前预约',
    relatedDims: ['W', 'I'],
  },
  {
    name: '故宫博物院',
    city: '北京',
    type: '历史博物馆',
    highlights: ['太和殿', '珍宝馆', '钟表馆', '书画馆'],
    recommendedAge: '6-18岁',
    visitTips: '建议租讲解器，提前了解历史背景',
    relatedDims: ['W', 'E', 'R'],
  },
  {
    name: '中国国家博物馆',
    city: '北京',
    type: '综合',
    highlights: ['古代中国', '复兴之路', '古代青铜器', '古代瓷器'],
    recommendedAge: '8-18岁',
    visitTips: '免费参观，需提前预约',
    relatedDims: ['W', 'E', 'R'],
  },
  {
    name: '中国航空博物馆',
    city: '北京',
    type: '科技馆',
    highlights: ['飞机展厅', '导弹展厅', '航空历史', '模拟飞行'],
    recommendedAge: '6-18岁',
    visitTips: '适合航空航天爱好者',
    relatedDims: ['W', 'I', 'D'],
  },
  {
    name: '广东科学中心',
    city: '广州',
    type: '科技馆',
    highlights: ['实验与发现', '数码世界', '交通世界', '儿童天地'],
    recommendedAge: '3-18岁',
    visitTips: '亚洲最大科学中心，建议预留一天',
    relatedDims: ['W', 'I', 'D'],
  },
  {
    name: '浙江自然博物馆',
    city: '杭州',
    type: '自然博物馆',
    highlights: ['生命探索', '地球生命故事', '丰富奇异的生物世界'],
    recommendedAge: '5-18岁',
    visitTips: '免费参观，适合生物爱好者',
    relatedDims: ['W', 'I'],
  },
  {
    name: '成都大熊猫繁育研究基地',
    city: '成都',
    type: '自然博物馆',
    highlights: ['大熊猫产房', '熊猫活动场', '科普教育中心'],
    recommendedAge: '全年龄',
    visitTips: '建议上午参观，熊猫活动更频繁',
    relatedDims: ['W', 'L'],
  },
  {
    name: '中国丝绸博物馆',
    city: '杭州',
    type: '艺术馆',
    highlights: ['丝路馆', '蚕桑馆', '织造馆', '修复馆'],
    recommendedAge: '6-18岁',
    visitTips: '了解丝绸文化，体验手工织造',
    relatedDims: ['W', 'E', 'D'],
  },
]

// ==================== 期刊杂志推荐数据库 ====================

export const JOURNALS: JournalRec[] = [
  {
    name: '我们爱科学',
    type: '科普',
    frequency: '半月刊',
    ageRange: '6-14岁',
    description: '中国少年儿童新闻出版总社主办，国内发行量最大的少儿科普期刊',
    sampleTopics: ['科学探险', '动物世界', '科学实验', '科技前沿'],
    relatedDims: ['W', 'I'],
  },
  {
    name: '少年科学画报',
    type: '科普',
    frequency: '月刊',
    ageRange: '6-14岁',
    description: '图文并茂的科普期刊，用漫画讲科学',
    sampleTopics: ['自然探索', '科技发明', '宇宙奥秘', '人体探秘'],
    relatedDims: ['W', 'I'],
  },
  {
    name: '博物',
    type: '科普',
    frequency: '月刊',
    ageRange: '10-18岁',
    description: '《中国国家地理》旗下青少年版，自然人文科普',
    sampleTopics: ['自然生态', '人文地理', '历史考古', '科学探索'],
    relatedDims: ['W', 'I', 'E'],
  },
  {
    name: '数学小灵通',
    type: '兴趣',
    frequency: '月刊',
    ageRange: '6-12岁',
    description: '趣味数学期刊，培养数学兴趣',
    sampleTopics: ['数学故事', '趣味题解', '数学游戏', '思维训练'],
    relatedDims: ['I', 'D'],
  },
  {
    name: '中学生数理化',
    type: '学术',
    frequency: '月刊',
    ageRange: '12-18岁',
    description: '配合中学课程，提升理科学习能力',
    sampleTopics: ['知识点解析', '典型例题', '学习方法', '竞赛辅导'],
    relatedDims: ['I', 'D', 'R'],
  },
  {
    name: '少年文艺',
    type: '兴趣',
    frequency: '月刊',
    ageRange: '8-16岁',
    description: '优秀儿童文学作品，培养文学素养',
    sampleTopics: ['小说', '散文', '诗歌', '童话'],
    relatedDims: ['E', 'W', 'R'],
  },
  {
    name: '科学画报',
    type: '科普',
    frequency: '月刊',
    ageRange: '12-18岁',
    description: '历史悠久的高级科普期刊，内容深入',
    sampleTopics: ['科技前沿', '科学发现', '工程技术', '科学人物'],
    relatedDims: ['W', 'I'],
  },
  {
    name: '知识就是力量',
    type: '科普',
    frequency: '月刊',
    ageRange: '10-18岁',
    description: '经典科普期刊，涵盖各科学领域',
    sampleTopics: ['科学知识', '技术发展', '科学史话', '未来展望'],
    relatedDims: ['W', 'I', 'R'],
  },
]

// ==================== 社区/社团推荐数据库 ====================

export const COMMUNITIES: CommunityRec[] = [
  {
    name: '科学松鼠会',
    type: '线上社区',
    platform: '网站/微信公众号',
    description: '科普作家社区，传播有趣的科学知识',
    benefits: ['优质科普内容', '科学思维培养', '互动问答'],
    relatedDims: ['W', 'I'],
  },
  {
    name: '果壳少年',
    type: '线上社区',
    platform: '网站/APP',
    description: '面向青少年的科学兴趣社区',
    benefits: ['同龄人交流', '科学活动', '知识分享'],
    relatedDims: ['W', 'I', 'L'],
  },
  {
    name: '学校科技社团',
    type: '线下社团',
    description: '校内科技创新、机器人、编程等社团',
    benefits: ['动手实践', '团队协作', '比赛机会'],
    relatedDims: ['D', 'I', 'L'],
  },
  {
    name: '少年宫兴趣班',
    type: '线下社团',
    description: '各地少年宫开设的科技、艺术、体育兴趣班',
    benefits: ['专业指导', '系统学习', '展示平台'],
    relatedDims: ['D', 'E', 'L'],
  },
  {
    name: '中国青少年机器人竞赛',
    type: '比赛组织',
    description: '全国性机器人竞赛组织',
    benefits: ['机器人学习', '比赛经验', '创新能力'],
    relatedDims: ['D', 'I', 'L'],
  },
]

// ==================== 教育App推荐数据库 ====================

export interface EducationalAppRec {
  name: string
  platform: 'iOS' | 'Android' | 'Web' | '全平台'
  category: '编程' | '科学' | '数学' | '语言' | '艺术' | '综合'
  ageRange: string
  isFree: boolean
  description: string
  features: string[]
  relatedDims: string[]
}

export const EDUCATIONAL_APPS: EducationalAppRec[] = [
  // W维度 - 探索好奇
  {
    name: '百度百科',
    platform: '全平台',
    category: '综合',
    ageRange: '8岁以上',
    isFree: true,
    description: '随时查阅各类知识，满足好奇心',
    features: ['海量词条', '多媒体内容', '知识关联'],
    relatedDims: ['W', 'I'],
  },
  {
    name: 'Google Earth',
    platform: '全平台',
    category: '科学',
    ageRange: '6岁以上',
    isFree: true,
    description: '虚拟探索地球每个角落，培养地理兴趣',
    features: ['3D地球浏览', '街景漫游', '历史影像'],
    relatedDims: ['W', 'L'],
  },
  {
    name: 'Toca Nature',
    platform: 'iOS',
    category: '科学',
    ageRange: '4-8岁',
    isFree: false,
    description: '创建和探索自然生态系统的儿童游戏',
    features: ['生态模拟', '动物观察', '环境互动'],
    relatedDims: ['W', 'L'],
  },
  {
    name: '形色识花',
    platform: '全平台',
    category: '科学',
    ageRange: '全年龄',
    isFree: true,
    description: '拍照识别植物，了解植物知识',
    features: ['AI识别', '植物百科', '养护指南'],
    relatedDims: ['W', 'I', 'L'],
  },
  {
    name: 'Star Walk',
    platform: '全平台',
    category: '科学',
    ageRange: '8岁以上',
    isFree: false,
    description: '实时星空地图，探索宇宙奥秘',
    features: ['AR星空', '天体信息', '天文事件提醒'],
    relatedDims: ['W', 'I'],
  },
  // I维度 - 探究思考
  {
    name: 'Brilliant',
    platform: '全平台',
    category: '数学',
    ageRange: '10岁以上',
    isFree: false,
    description: '交互式数学和科学学习平台',
    features: ['概念可视化', '问题导向学习', '渐进式难度'],
    relatedDims: ['I', 'D'],
  },
  {
    name: 'DragonBox数学',
    platform: '全平台',
    category: '数学',
    ageRange: '5-12岁',
    isFree: false,
    description: '通过游戏学习代数和几何',
    features: ['游戏化学习', '概念内化', '自适应难度'],
    relatedDims: ['I', 'W'],
  },
  {
    name: 'Tinybop系列',
    platform: 'iOS',
    category: '科学',
    ageRange: '4-10岁',
    isFree: false,
    description: '互动探索人体、植物、机械等科学主题',
    features: ['互动探索', '无文字界面', '自主发现'],
    relatedDims: ['I', 'W'],
  },
  {
    name: 'MEL Science',
    platform: '全平台',
    category: '科学',
    ageRange: '10岁以上',
    isFree: false,
    description: 'VR化学实验和物理模拟',
    features: ['VR实验', '分子可视化', '安全实验'],
    relatedDims: ['I', 'D'],
  },
  {
    name: '洋葱学院',
    platform: '全平台',
    category: '综合',
    ageRange: '8-18岁',
    isFree: false,
    description: '动画视频讲解数理化知识',
    features: ['动画讲解', '知识点拆解', '练习题库'],
    relatedDims: ['I', 'R'],
  },
  // L维度 - 生命联结
  {
    name: 'iNaturalist',
    platform: '全平台',
    category: '科学',
    ageRange: '8岁以上',
    isFree: true,
    description: '自然观察和物种识别社区',
    features: ['物种识别', '观察记录', '科学贡献'],
    relatedDims: ['L', 'W', 'I'],
  },
  {
    name: '花伴侣',
    platform: '全平台',
    category: '科学',
    ageRange: '全年龄',
    isFree: true,
    description: '植物识别和养护指南',
    features: ['拍照识花', '养护知识', '花历提醒'],
    relatedDims: ['L', 'W'],
  },
  {
    name: 'WWF Together',
    platform: '全平台',
    category: '科学',
    ageRange: '8岁以上',
    isFree: true,
    description: '世界自然基金会官方App，了解濒危动物',
    features: ['动物故事', '互动体验', '环保行动'],
    relatedDims: ['L', 'E', 'W'],
  },
  {
    name: 'Forest专注森林',
    platform: '全平台',
    category: '综合',
    ageRange: '8岁以上',
    isFree: false,
    description: '通过专注种树培养时间管理能力',
    features: ['游戏化专注', '虚拟森林', '真实种树'],
    relatedDims: ['L', 'R'],
  },
  {
    name: '观鸟识鸟',
    platform: '全平台',
    category: '科学',
    ageRange: '6岁以上',
    isFree: true,
    description: '鸟类识别和观鸟记录工具',
    features: ['鸟类图鉴', '叫声识别', '观鸟打卡'],
    relatedDims: ['L', 'W', 'I'],
  },
  // D维度 - 设计创造
  {
    name: 'Scratch Jr',
    platform: '全平台',
    category: '编程',
    ageRange: '5-8岁',
    isFree: true,
    description: '幼儿图形化编程入门',
    features: ['拖拽编程', '角色动画', '故事创作'],
    relatedDims: ['D', 'I', 'E'],
  },
  {
    name: 'Tinkercad',
    platform: 'Web',
    category: '艺术',
    ageRange: '10岁以上',
    isFree: true,
    description: '免费在线3D建模工具',
    features: ['简易3D建模', '电路模拟', '编程控制'],
    relatedDims: ['D', 'I'],
  },
  {
    name: 'Canva',
    platform: '全平台',
    category: '艺术',
    ageRange: '10岁以上',
    isFree: true,
    description: '简易图形设计工具',
    features: ['海报设计', '模板丰富', '协作功能'],
    relatedDims: ['D', 'E'],
  },
  {
    name: 'Swift Playgrounds',
    platform: 'iOS',
    category: '编程',
    ageRange: '10岁以上',
    isFree: true,
    description: 'Apple官方编程学习App',
    features: ['游戏化学习', 'Swift语言', '互动教程'],
    relatedDims: ['D', 'I'],
  },
  {
    name: 'Arduino Create',
    platform: 'Web',
    category: '编程',
    ageRange: '12岁以上',
    isFree: true,
    description: 'Arduino在线编程环境',
    features: ['在线编程', '项目分享', '硬件仿真'],
    relatedDims: ['D', 'I'],
  },
  // E维度 - 表达沟通
  {
    name: '讯飞配音',
    platform: '全平台',
    category: '语言',
    ageRange: '8岁以上',
    isFree: false,
    description: '给视频、动画配音练习表达',
    features: ['趣味配音', '语音评分', '作品分享'],
    relatedDims: ['E', 'D'],
  },
  {
    name: 'Book Creator',
    platform: '全平台',
    category: '综合',
    ageRange: '6岁以上',
    isFree: false,
    description: '创作和发布电子书',
    features: ['多媒体编辑', '简易排版', '云端发布'],
    relatedDims: ['E', 'D', 'W'],
  },
  {
    name: 'Explain Everything',
    platform: '全平台',
    category: '综合',
    ageRange: '8岁以上',
    isFree: false,
    description: '创作讲解视频和互动演示',
    features: ['白板录制', '语音讲解', '协作编辑'],
    relatedDims: ['E', 'I'],
  },
  {
    name: '趣配音',
    platform: '全平台',
    category: '语言',
    ageRange: '6岁以上',
    isFree: false,
    description: '英语配音学习App',
    features: ['电影配音', '口语练习', 'AI评分'],
    relatedDims: ['E', 'L'],
  },
  {
    name: '小宇宙',
    platform: '全平台',
    category: '综合',
    ageRange: '12岁以上',
    isFree: true,
    description: '播客收听和创作平台',
    features: ['优质播客', '创作工具', '知识分享'],
    relatedDims: ['E', 'W', 'I'],
  },
  // R维度 - 反思成长
  {
    name: 'Day One',
    platform: 'iOS',
    category: '综合',
    ageRange: '10岁以上',
    isFree: false,
    description: '优秀的日记和反思记录工具',
    features: ['多媒体日记', '时间线', '标签整理'],
    relatedDims: ['R', 'E'],
  },
  {
    name: 'Notion',
    platform: '全平台',
    category: '综合',
    ageRange: '12岁以上',
    isFree: true,
    description: '全能笔记和知识管理工具',
    features: ['灵活笔记', '数据库', '协作功能'],
    relatedDims: ['R', 'D', 'I'],
  },
  {
    name: 'Headspace',
    platform: '全平台',
    category: '综合',
    ageRange: '10岁以上',
    isFree: false,
    description: '冥想和正念练习App',
    features: ['引导冥想', '专注练习', '睡眠音频'],
    relatedDims: ['R', 'L'],
  },
  {
    name: '墨墨背单词',
    platform: '全平台',
    category: '语言',
    ageRange: '8岁以上',
    isFree: false,
    description: '科学记忆曲线背单词',
    features: ['遗忘曲线', '个性化复习', '进度追踪'],
    relatedDims: ['R', 'I'],
  },
  {
    name: 'Streaks',
    platform: 'iOS',
    category: '综合',
    ageRange: '10岁以上',
    isFree: false,
    description: '习惯养成和目标追踪',
    features: ['习惯打卡', '连续天数', '数据统计'],
    relatedDims: ['R', 'D'],
  },
]

// ==================== 科学实验套装推荐 ====================

export interface ScienceKitRec {
  name: string
  brand: string
  category: '化学' | '物理' | '生物' | '电子' | '机器人' | '综合'
  ageRange: string
  priceRange: string
  description: string
  experiments: string[]
  relatedDims: string[]
}

export const SCIENCE_KITS: ScienceKitRec[] = [
  // W维度
  {
    name: '我的第一个显微镜套装',
    brand: 'AmScope',
    category: '生物',
    ageRange: '6-10岁',
    priceRange: '200-400元',
    description: '入门级显微镜套装，探索微观世界',
    experiments: ['观察植物细胞', '观察昆虫翅膀', '观察水中微生物'],
    relatedDims: ['W', 'I'],
  },
  {
    name: '恐龙化石挖掘套装',
    brand: '国家地理',
    category: '综合',
    ageRange: '6-12岁',
    priceRange: '100-200元',
    description: '模拟考古挖掘，体验发现的乐趣',
    experiments: ['化石挖掘', '骨骼拼装', '标本制作'],
    relatedDims: ['W', 'I'],
  },
  {
    name: '天文望远镜入门套装',
    brand: '星特朗',
    category: '物理',
    ageRange: '8岁以上',
    priceRange: '300-600元',
    description: '入门级天文望远镜，探索星空',
    experiments: ['月球观测', '行星观测', '星座识别'],
    relatedDims: ['W', 'I'],
  },
  // I维度
  {
    name: '化学实验套装150合1',
    brand: 'Thames & Kosmos',
    category: '化学',
    ageRange: '10-14岁',
    priceRange: '300-500元',
    description: '专业化学实验套装，安全可靠',
    experiments: ['酸碱反应', '结晶实验', '电解实验'],
    relatedDims: ['I', 'W'],
  },
  {
    name: '物理实验套装',
    brand: '科学罐头',
    category: '物理',
    ageRange: '8-14岁',
    priceRange: '200-400元',
    description: '力学、光学、电学基础实验',
    experiments: ['杠杆原理', '光的折射', '简单电路'],
    relatedDims: ['I', 'D'],
  },
  {
    name: '人体解剖模型',
    brand: '4D MASTER',
    category: '生物',
    ageRange: '8-14岁',
    priceRange: '100-300元',
    description: '可拆卸人体器官模型',
    experiments: ['器官识别', '系统组装', '功能学习'],
    relatedDims: ['I', 'W'],
  },
  // L维度
  {
    name: '生态瓶制作套装',
    brand: 'Back to the Roots',
    category: '生物',
    ageRange: '6-12岁',
    priceRange: '150-300元',
    description: '制作自给自足的微型生态系统',
    experiments: ['生态瓶建造', '物质循环观察', '生态平衡'],
    relatedDims: ['L', 'I', 'W'],
  },
  {
    name: '植物培育实验室',
    brand: 'Little Botanist',
    category: '生物',
    ageRange: '5-10岁',
    priceRange: '100-200元',
    description: '种植和观察植物生长',
    experiments: ['种子发芽', '光照实验', '向性观察'],
    relatedDims: ['L', 'I'],
  },
  {
    name: '蚂蚁农场观察套装',
    brand: 'AntWorks',
    category: '生物',
    ageRange: '6-12岁',
    priceRange: '100-200元',
    description: '观察蚂蚁社会和行为',
    experiments: ['隧道挖掘', '食物搬运', '社会分工'],
    relatedDims: ['L', 'W', 'I'],
  },
  // D维度
  {
    name: 'Arduino入门套装',
    brand: 'Arduino',
    category: '电子',
    ageRange: '10岁以上',
    priceRange: '200-400元',
    description: '开源电子原型平台入门套装',
    experiments: ['LED控制', '传感器应用', '小型机器人'],
    relatedDims: ['D', 'I'],
  },
  {
    name: '乐高机器人EV3',
    brand: 'LEGO',
    category: '机器人',
    ageRange: '10-16岁',
    priceRange: '2000-4000元',
    description: '可编程机器人套装',
    experiments: ['机械结构', '编程控制', '任务挑战'],
    relatedDims: ['D', 'I', 'R'],
  },
  {
    name: 'Snap Circuits电子积木',
    brand: 'Elenco',
    category: '电子',
    ageRange: '8-14岁',
    priceRange: '200-500元',
    description: '磁扣式电子电路积木',
    experiments: ['基础电路', '报警器', '收音机'],
    relatedDims: ['D', 'I'],
  },
  {
    name: '3D打印笔套装',
    brand: '3Doodler',
    category: '综合',
    ageRange: '8岁以上',
    priceRange: '200-400元',
    description: '手持3D打印笔，空中绘画',
    experiments: ['立体造型', '建筑模型', '艺术创作'],
    relatedDims: ['D', 'E'],
  },
  // E维度
  {
    name: '科学展板制作套装',
    brand: 'Pacon',
    category: '综合',
    ageRange: '8-14岁',
    priceRange: '50-100元',
    description: '科学项目展示板材料',
    experiments: ['项目展示', '数据可视化', '演示设计'],
    relatedDims: ['E', 'D'],
  },
  {
    name: '儿童实验室外套和护目镜',
    brand: '科学小子',
    category: '综合',
    ageRange: '5-12岁',
    priceRange: '50-100元',
    description: '让孩子像科学家一样做实验',
    experiments: ['角色扮演', '安全实验', '科学态度'],
    relatedDims: ['E', 'I'],
  },
  // R维度
  {
    name: '科学笔记本套装',
    brand: 'Moleskine',
    category: '综合',
    ageRange: '8岁以上',
    priceRange: '50-150元',
    description: '专业科学实验记录本',
    experiments: ['实验记录', '观察笔记', '反思日志'],
    relatedDims: ['R', 'I'],
  },
  {
    name: '科学项目计时器',
    brand: 'Time Timer',
    category: '综合',
    ageRange: '6岁以上',
    priceRange: '100-200元',
    description: '可视化计时器，培养时间管理',
    experiments: ['实验计时', '专注训练', '项目管理'],
    relatedDims: ['R', 'D'],
  },
]

// ==================== 推荐函数扩展 ====================

/**
 * 根据WILDER维度获取推荐的教育App
 */
export function getRecommendedApps(
  topDims: string[],
  _age: number,
  limit: number = 6
): EducationalAppRec[] {
  const scored = EDUCATIONAL_APPS.map(app => {
    const matchScore = app.relatedDims.filter(d => topDims.includes(d)).length
    return { ...app, matchScore }
  })

  return scored
    .filter(a => a.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

/**
 * 根据WILDER维度获取推荐的科学套装
 */
export function getRecommendedScienceKits(
  topDims: string[],
  _age: number,
  limit: number = 5
): ScienceKitRec[] {
  const scored = SCIENCE_KITS.map(kit => {
    const matchScore = kit.relatedDims.filter(d => topDims.includes(d)).length
    return { ...kit, matchScore }
  })

  return scored
    .filter(k => k.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

// ==================== 推荐函数 ====================

/**
 * 根据WILDER维度获取推荐的竞赛
 */
export function getRecommendedCompetitions(
  topDims: string[],
  _age: number,
  limit: number = 6
): CompetitionRec[] {
  // 按相关度排序
  const scored = COMPETITIONS.map(comp => {
    const matchScore = comp.relatedDims.filter(d => topDims.includes(d)).length
    return { ...comp, matchScore }
  })

  return scored
    .filter(c => c.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

/**
 * 根据WILDER维度获取推荐的夏令营
 */
export function getRecommendedSummerCamps(
  topDims: string[],
  _age: number,
  limit: number = 5
): SummerCampRec[] {
  const scored = SUMMER_CAMPS.map(camp => {
    const matchScore = camp.relatedDims.filter(d => topDims.includes(d)).length
    return { ...camp, matchScore }
  })

  return scored
    .filter(c => c.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

/**
 * 根据WILDER维度获取推荐的在线课程
 */
export function getRecommendedOnlineCourses(
  topDims: string[],
  _age: number,
  limit: number = 6
): OnlineCourseRec[] {
  const scored = ONLINE_COURSES.map(course => {
    const matchScore = course.relatedDims.filter(d => topDims.includes(d)).length
    return { ...course, matchScore }
  })

  return scored
    .filter(c => c.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

/**
 * 根据WILDER维度获取推荐的博物馆
 */
export function getRecommendedMuseums(
  topDims: string[],
  limit: number = 5
): MuseumRec[] {
  const scored = MUSEUMS.map(museum => {
    const matchScore = museum.relatedDims.filter(d => topDims.includes(d)).length
    return { ...museum, matchScore }
  })

  return scored
    .filter(m => m.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

/**
 * 根据WILDER维度获取推荐的期刊
 */
export function getRecommendedJournals(
  topDims: string[],
  _age: number,
  limit: number = 4
): JournalRec[] {
  const scored = JOURNALS.map(journal => {
    const matchScore = journal.relatedDims.filter(d => topDims.includes(d)).length
    return { ...journal, matchScore }
  })

  return scored
    .filter(j => j.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

/**
 * 根据WILDER维度获取推荐的社区
 */
export function getRecommendedCommunities(
  topDims: string[],
  limit: number = 4
): CommunityRec[] {
  const scored = COMMUNITIES.map(community => {
    const matchScore = community.relatedDims.filter(d => topDims.includes(d)).length
    return { ...community, matchScore }
  })

  return scored
    .filter(c => c.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}
