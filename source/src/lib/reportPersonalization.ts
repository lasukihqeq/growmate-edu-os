// ===================================================================
// GrowMate 30潜能类型 个性化报告内容库 v2.0
// 每种潜能类型独立的大学、书籍、纪录片推荐 + 家长关注要点
// 避免千篇一律推荐清华北大，根据潜能特点精准匹配
// ===================================================================

// ==================== 类型定义 ====================

export interface UniversityRec {
  name: string
  tier: '985' | '211' | '一本' | '国际'
  major: string
  reason: string
}

export interface BookRec {
  title: string
  author: string
  target: 'child' | 'parent'
  ageRange?: string       // child only: '6-9' | '10-12' | '13-16'
  reason: string
}

export interface DocumentaryRec {
  title: string
  platform: string
  reason: string
}

export interface ParentFocus {
  highlight: string       // 报告中高亮的核心关注点
  commonMisunderstanding: string  // 常见误解
  truthReframe: string    // 真相重构
  actionTip: string       // 行动建议
}

export interface TalentReportContent {
  universities: UniversityRec[]
  books: BookRec[]
  documentaries: DocumentaryRec[]
  parentFocus: ParentFocus[]
}

// ==================== 30种潜能类型报告内容 ====================

export const TALENT_REPORT_CONTENT: Record<string, TalentReportContent> = {

  // ========== 单峰型 ==========

  'S-W': {
    universities: [
      { name: '中国科学院大学', tier: '985', major: '本科生科研导师制', reason: '纯科研导向，满足极致好奇心' },
      { name: '北京大学', tier: '985', major: '元培学院', reason: '自由探索+跨学科，不限方向' },
      { name: '南方科技大学', tier: '一本', major: '通识+专业双轨', reason: '创新型大学，鼓励自由探索' },
      { name: '上海科技大学', tier: '一本', major: '物质/生命/信息', reason: '小而精，师生比极高' },
      { name: 'Caltech（美国）', tier: '国际', major: '基础科学', reason: '全球最纯粹的好奇心驱动研究型大学' },
      { name: '苏黎世联邦理工（瑞士）', tier: '国际', major: '自然科学', reason: '爱因斯坦母校，鼓励自由探索' },
    ],
    books: [
      { title: '万物简史', author: '比尔·布莱森', target: 'child', ageRange: '10-12', reason: '用幽默语言点燃对万物的好奇心' },
      { title: '从一到无穷大', author: '乔治·伽莫夫', target: 'child', ageRange: '13-16', reason: '科学家写给好奇青少年的经典' },
      { title: '昆虫记', author: '法布尔', target: 'child', ageRange: '6-9', reason: '观察力训练的最佳启蒙读物' },
      { title: '园丁与木匠', author: '艾莉森·高普尼克', target: 'parent', reason: '理解好奇心驱动型孩子的发展规律' },
      { title: '让孩子的大脑自由', author: '约翰·梅迪纳', target: 'parent', reason: '好奇心如何塑造大脑神经连接' },
    ],
    documentaries: [
      { title: '地球脉动 I & II', platform: 'B站/腾讯视频', reason: '每一帧都是好奇心的盛宴' },
      { title: '宇宙时空之旅', platform: 'B站', reason: '卡尔·萨根式好奇心的传承' },
      { title: '我的章鱼老师', platform: 'Netflix', reason: '好奇心如何与自然建立深度连接' },
    ],
    parentFocus: [
      { highlight: '好奇心是AI时代最稀缺的能力', commonMisunderstanding: '"三分钟热度""注意力不集中"', truthReframe: '不是注意力差，是好奇触角太灵敏——需要的是引导聚焦，而非压制好奇心', actionTip: '每天给TA15分钟"自由探索时间"——不限主题、不评判、只倾听' },
      { highlight: '提问能力>回答能力', commonMisunderstanding: '"总问为什么太烦了"', truthReframe: '每个好问题背后都是独立思考的证据，这比背标准答案珍贵100倍', actionTip: '把TA的好问题记录在"好奇心日记"里，每周回顾一次' },
    ],
  },

  'S-I': {
    universities: [
      { name: '中国科学技术大学', tier: '985', major: '物理学/数学', reason: '最重视基础科研训练的大学' },
      { name: '清华大学', tier: '985', major: '工程力学/精密仪器', reason: '系统性验证方法训练顶尖' },
      { name: '华中科技大学', tier: '985', major: '光电信息/精密测量', reason: '精密测量与实验科学强校' },
      { name: '中国计量大学', tier: '一本', major: '测控技术/标准化', reason: '全国唯一以计量命名，精准求证的殿堂' },
      { name: 'MIT（美国）', tier: '国际', major: 'EECS/物理', reason: '"动手验证"文化与求证精神完美契合' },
      { name: '剑桥大学（英国）', tier: '国际', major: 'Natural Sciences', reason: '牛顿以来的实证科学传统' },
    ],
    books: [
      { title: '费曼物理学讲义', author: '理查德·费曼', target: 'child', ageRange: '13-16', reason: '科学史上最会验证的物理学家' },
      { title: '这才是好读的数学史', author: '比尔·伯林霍夫', target: 'child', ageRange: '10-12', reason: '数学发展就是一部求证史' },
      { title: '批判性思维', author: '理查德·保罗', target: 'parent', reason: '理解如何培养孩子的求证思维' },
    ],
    documentaries: [
      { title: '粒子狂热', platform: 'B站', reason: '科学家如何用大型对撞机验证希格斯玻色子' },
      { title: '追捕弗里德曼一家', platform: '豆瓣', reason: '纪录片展示证据与真相的复杂关系' },
      { title: '宇宙奇迹', platform: 'B站', reason: '物理学家布莱恩·考克斯的求证之旅' },
    ],
    parentFocus: [
      { highlight: '求证精神是对抗信息噪音的核武器', commonMisunderstanding: '"太较真了""做事太慢"', truthReframe: '慢的背后是"深"——TA在确保每一步都经得起检验', actionTip: '遇到争议话题时问TA："你觉得怎么验证这个说法？"' },
    ],
  },

  'S-L': {
    universities: [
      { name: '北京师范大学', tier: '985', major: '心理学/教育学', reason: '国内心理教育学科第一' },
      { name: '中国人民大学', tier: '985', major: '社会学/公共管理', reason: '最懂"人与社会"的大学' },
      { name: '华东师范大学', tier: '985', major: '社会工作/学前教育', reason: '教育关怀传统深厚' },
      { name: '南京师范大学', tier: '211', major: '社会发展/教育科学', reason: '师范类传统强校' },
      { name: '哈佛大学（美国）', tier: '国际', major: '教育学院/公共政策', reason: '全球教育与公益领域标杆' },
      { name: '伦敦政治经济学院', tier: '国际', major: '社会政策', reason: '社会科学领域世界顶尖' },
    ],
    books: [
      { title: '窗边的小豆豆', author: '黑柳彻子', target: 'child', ageRange: '6-9', reason: '理解每个孩子都需要被看见和连接' },
      { title: '非暴力沟通', author: '马歇尔·卢森堡', target: 'child', ageRange: '13-16', reason: '学会用联结力改善关系的经典' },
      { title: '如何说孩子才会听', author: '阿黛尔·法伯', target: 'parent', reason: '联结力型孩子的最佳沟通指南' },
    ],
    documentaries: [
      { title: '人生七年', platform: 'B站', reason: '63年追踪14个孩子，理解人际联结如何塑造人生' },
      { title: '他乡的童年', platform: '优酷', reason: '全球教育中的人际联结差异' },
    ],
    parentFocus: [
      { highlight: '联结力是未来领导力的核心根基', commonMisunderstanding: '"太敏感""操心太多"', truthReframe: '高共情力不是弱点——这是咨询师、教师、管理者的核心素质', actionTip: '肯定TA关心他人的行为，同时教TA设立健康的心理边界' },
    ],
  },

  'S-D': {
    universities: [
      { name: '同济大学', tier: '985', major: '建筑学/城市规划', reason: '设计力培养的顶级学府' },
      { name: '天津大学', tier: '985', major: '建筑/工业设计', reason: '中国第一所大学，工程设计传统悠久' },
      { name: '浙江大学', tier: '985', major: '工业设计/计算机', reason: '设计+技术融合的先行者' },
      { name: '东南大学', tier: '985', major: '建筑学/艺术设计', reason: '建筑老八校之一' },
      { name: '罗德岛设计学院（美国）', tier: '国际', major: '工业设计', reason: '全球设计教育的殿堂' },
      { name: '代尔夫特理工（荷兰）', tier: '国际', major: '工业设计工程', reason: '欧洲设计工程教育领头羊' },
    ],
    books: [
      { title: '设计中的设计', author: '原研哉', target: 'child', ageRange: '13-16', reason: '重新定义"设计"——不只是好看，更是好用' },
      { title: '乐高创意搭建指南', author: '乐高教育', target: 'child', ageRange: '6-9', reason: '设计力的最佳启蒙：从搭建开始' },
      { title: '创新者的窘境', author: '克莱顿·克里斯坦森', target: 'parent', reason: '理解设计型孩子的创新思维模式' },
    ],
    documentaries: [
      { title: '抽象：设计的艺术', platform: 'Netflix/B站', reason: '全球顶级设计师的思维方式' },
      { title: '包豪斯百年', platform: 'B站', reason: '现代设计的源头和精神' },
    ],
    parentFocus: [
      { highlight: '设计力=把想法变成现实的超能力', commonMisunderstanding: '"控制欲太强""太固执"', truthReframe: 'TA不是在控制，是在"设计方案"——给TA足够的材料和空间', actionTip: '买一个"创造角"的工具箱，让TA有地方安放设计欲' },
    ],
  },

  'S-E': {
    universities: [
      { name: '中国传媒大学', tier: '211', major: '播音主持/新闻学', reason: '中国传媒教育的最高学府' },
      { name: '复旦大学', tier: '985', major: '新闻学院', reason: '新闻传播学科全国顶尖' },
      { name: '中央戏剧学院', tier: '一本', major: '表演/导演', reason: '表演艺术教育的殿堂' },
      { name: '北京电影学院', tier: '一本', major: '导演/编剧', reason: '视觉叙事的最高学府' },
      { name: '纽约大学（美国）', tier: '国际', major: 'Tisch艺术学院', reason: '全球表演艺术教育标杆' },
      { name: '伦敦艺术大学', tier: '国际', major: '传媒学院', reason: '创意产业教育世界领先' },
    ],
    books: [
      { title: '演讲的力量', author: '克里斯·安德森', target: 'child', ageRange: '13-16', reason: 'TED创始人教你用表达改变世界' },
      { title: '故事', author: '罗伯特·麦基', target: 'child', ageRange: '13-16', reason: '好莱坞编剧圣经，学会结构化叙事' },
      { title: '内向孩子的潜在优势', author: '马蒂·莱尼', target: 'parent', reason: '表达欲强≠外向，理解表达力的多面性' },
    ],
    documentaries: [
      { title: '面孔', platform: 'B站', reason: '表情是最原始的表达——探索人类表达的起源' },
      { title: '脱口秀大会幕后', platform: '腾讯视频', reason: '看顶级表达者如何打磨每一个词' },
    ],
    parentFocus: [
      { highlight: '表达力是AI时代的"人格魅力"', commonMisunderstanding: '"话太多""上课老讲话"', truthReframe: '表达欲不是问题——需要的是正确的"出口"，而不是堵上嘴', actionTip: '每天给TA一个"3分钟舞台"——可以讲任何事，认真当观众' },
    ],
  },

  'S-R': {
    universities: [
      { name: '北京大学', tier: '985', major: '哲学系/心理学系', reason: '中国人文思辨的最高学府' },
      { name: '复旦大学', tier: '985', major: '哲学学院', reason: '深度思辨传统深厚' },
      { name: '武汉大学', tier: '985', major: '哲学/心理学', reason: '人文社科传统优秀' },
      { name: '华东师范大学', tier: '985', major: '心理与认知科学', reason: '认知科学方向领先' },
      { name: '牛津大学（英国）', tier: '国际', major: 'PPE/哲学', reason: '全球思辨教育的巅峰——从柏拉图到现代' },
      { name: '芝加哥大学（美国）', tier: '国际', major: '社会思想', reason: '"就是要跟你辩论"的学术文化' },
    ],
    books: [
      { title: '苏菲的世界', author: '乔斯坦·贾德', target: 'child', ageRange: '10-12', reason: '哲学入门的完美启蒙，让反思变有趣' },
      { title: '思考，快与慢', author: '丹尼尔·卡尼曼', target: 'child', ageRange: '13-16', reason: '理解自己的思维方式，提升元认知能力' },
      { title: '终身成长', author: '卡罗尔·德韦克', target: 'parent', reason: '反思力型孩子的成长型思维培养指南' },
    ],
    documentaries: [
      { title: '人生意义', platform: 'B站', reason: '哲学家们如何通过反思找到生命的方向' },
      { title: '被讨厌的勇气（动画版）', platform: 'B站', reason: '阿德勒心理学的反思力应用' },
    ],
    parentFocus: [
      { highlight: '反思力是"成长加速器"——让每次经历都有3倍收获', commonMisunderstanding: '"想太多""太内向""做事犹豫"', truthReframe: 'TA不是犹豫，是在做深度"内部运算"——思考完才行动更高效', actionTip: '不催促TA"快点决定"，给反思留空间。可以问："你在想什么？"' },
    ],
  },

  // ========== 双峰型 (精选不同的推荐，避免重复清华北大) ==========

  'D-WI': {
    universities: [
      { name: '中国科学技术大学', tier: '985', major: '少年班/物理/天文', reason: '科研自由度全国最高，完美匹配好奇心+求证力' },
      { name: '北京大学', tier: '985', major: '物理/元培学院', reason: '基础科学+跨学科探索' },
      { name: '南京大学', tier: '985', major: '天文/物理/化学', reason: '基础科学研究传统深厚' },
      { name: '中国科学院大学', tier: '985', major: '各基础学科', reason: '直接接触前沿科研的机会' },
      { name: 'Caltech（美国）', tier: '国际', major: '基础科学', reason: '好奇心+验证能力的理想殿堂' },
    ],
    books: [
      { title: '时间简史', author: '霍金', target: 'child', ageRange: '13-16', reason: '好奇心与求证精神的完美结合' },
      { title: '科学探索者系列', author: 'Prentice Hall', target: 'child', ageRange: '10-12', reason: '系统的科学探究方法训练' },
      { title: '让孩子像科学家一样思考', author: '梅拉妮·米切尔', target: 'parent', reason: '如何在家培养科学思维' },
    ],
    documentaries: [
      { title: '蓝色星球 I & II', platform: 'B站', reason: '好奇心的视觉盛宴+海洋科学探究' },
      { title: '门捷列夫很忙', platform: 'B站', reason: '化学元素的好奇心之旅' },
    ],
    parentFocus: [
      { highlight: '好奇心+求证力=科学发现的黄金组合', commonMisunderstanding: '"问题太多""钻牛角尖"', truthReframe: '好问题+验证行动=完整的科学思维闭环，这比刷100道题都珍贵', actionTip: '每周做一次"厨房实验"——从最简单的问题开始验证' },
    ],
  },

  'D-WL': {
    universities: [
      { name: '浙江大学', tier: '985', major: '教育学/社会学', reason: '综合性大学中社会科学强势' },
      { name: '中山大学', tier: '985', major: '社会学/人类学', reason: '田野调查和社区研究传统' },
      { name: '华东师范大学', tier: '985', major: '教育学/社会发展', reason: '教育与社会的交叉研究' },
      { name: '伦敦大学学院（英国）', tier: '国际', major: '教育/人类学', reason: '全球教育研究的领导者' },
    ],
    books: [
      { title: '乡土中国', author: '费孝通', target: 'child', ageRange: '13-16', reason: '理解"人与人的连接"如何构成社会' },
      { title: '小王子', author: '圣埃克苏佩里', target: 'child', ageRange: '6-9', reason: '最美的关于人际联结的寓言' },
      { title: '社交天性', author: '马修·利伯曼', target: 'parent', reason: '理解社交型探索者的大脑机制' },
    ],
    documentaries: [
      { title: '他乡的童年', platform: '优酷', reason: '看世界各地的孩子如何在互动中学习' },
    ],
    parentFocus: [
      { highlight: '好奇心+联结力=天然的知识传播者', commonMisunderstanding: '"只会玩，不专心学习"', truthReframe: 'TA的学习方式就是"在互动中探索"——社交也是学习的渠道', actionTip: '鼓励TA组织"小型探索俱乐部"，带着朋友一起学' },
    ],
  },

  'D-WD': {
    universities: [
      { name: '同济大学', tier: '985', major: '建筑/设计创意学院', reason: '好奇心+设计力的最佳培养土壤' },
      { name: '清华大学', tier: '985', major: '美术学院/信息艺术', reason: '艺术与技术的交叉创新' },
      { name: '湖南大学', tier: '985', major: '工业设计', reason: '设计学科全国领先' },
      { name: '斯坦福大学（美国）', tier: '国际', major: 'd.school设计思维', reason: '设计思维教育的全球标杆' },
    ],
    books: [
      { title: '了不起的设计', author: 'DK', target: 'child', ageRange: '6-9', reason: '从日常物品中发现设计的魅力' },
      { title: '创新者', author: '沃尔特·艾萨克森', target: 'child', ageRange: '13-16', reason: '数字革命先驱们的创意建筑之路' },
      { title: '设计思维', author: '蒂姆·布朗', target: 'parent', reason: '理解创意建筑师型孩子的思维方式' },
    ],
    documentaries: [
      { title: '抽象：设计的艺术', platform: 'Netflix/B站', reason: '全球顶级设计师如何将好奇心变成产品' },
    ],
    parentFocus: [
      { highlight: '好奇心+设计力=创新型问题解决者', commonMisunderstanding: '"搞破坏""乱拆东西"', truthReframe: '拆解是为了理解，理解是为了重建——这是工程师的核心学习方式', actionTip: '给TA一个"创造角"：旧电器、纸板、胶水、工具——让TA自由创造' },
    ],
  },

  'D-WE': {
    universities: [
      { name: '复旦大学', tier: '985', major: '新闻学院/中文系', reason: '叙事+探索的完美训练场' },
      { name: '中国传媒大学', tier: '211', major: '广播电视编导', reason: '用画面讲故事的专业训练' },
      { name: '武汉大学', tier: '985', major: '新闻传播/信息管理', reason: '人文传播传统深厚' },
      { name: '哥伦比亚大学（美国）', tier: '国际', major: '新闻学院', reason: '全球新闻教育的殿堂' },
    ],
    books: [
      { title: '写给大家的中国美术史', author: '蒋勋', target: 'child', ageRange: '10-12', reason: '用故事讲述视觉探索的历史' },
      { title: '海底两万里', author: '儒勒·凡尔纳', target: 'child', ageRange: '10-12', reason: '好奇心+叙事力的科幻经典' },
      { title: '故事经济学', author: '罗伯特·麦基', target: 'parent', reason: '理解叙事能力在未来的价值' },
    ],
    documentaries: [
      { title: '航拍中国', platform: 'B站', reason: '用全新视角讲述中国故事' },
      { title: '但是还有书籍', platform: 'B站', reason: '关于叙事和表达的人文纪录片' },
    ],
    parentFocus: [
      { highlight: '好奇心+表达力=天然的内容创作者', commonMisunderstanding: '"只会说不会做"', truthReframe: '表达就是TA的"产出"——好的叙事能力在AI时代价值连城', actionTip: '鼓励TA写"探索日记"或拍"发现短视频"' },
    ],
  },

  'D-WR': {
    universities: [
      { name: '北京大学', tier: '985', major: '哲学/心理学/物理', reason: '深度思考者的理想学府' },
      { name: '南京大学', tier: '985', major: '天文/哲学/匡亚明学院', reason: '安静而深邃的学术氛围' },
      { name: '厦门大学', tier: '985', major: '哲学/海洋科学', reason: '滨海学府的沉思式学习体验' },
      { name: '牛津大学（英国）', tier: '国际', major: '哲学/物理', reason: '导师制教学=深度思考者的天堂' },
    ],
    books: [
      { title: '苏菲的世界', author: '乔斯坦·贾德', target: 'child', ageRange: '10-12', reason: '好奇心+反思力的完美入门' },
      { title: '存在主义是一种人道主义', author: '萨特', target: 'child', ageRange: '13-16', reason: '深度思考"存在"的意义' },
      { title: '深度工作', author: '卡尔·纽波特', target: 'parent', reason: '理解深度思考者需要的环境和节奏' },
    ],
    documentaries: [
      { title: '人生意义', platform: 'B站', reason: '哲学家们的思考与人生' },
    ],
    parentFocus: [
      { highlight: '好奇心+反思力=最深层次的理解力', commonMisunderstanding: '"发呆""想太多""太安静"', truthReframe: 'TA的大脑在进行高质量的"内部运算"——这比外在忙碌更有价值', actionTip: '尊重TA的"安静时间"，提供独处空间，不要把沉默等同于"没在学"' },
    ],
  },

  'D-IL': {
    universities: [
      { name: '上海交通大学', tier: '985', major: '致远学院/生物医学', reason: '团队型科研导向明确' },
      { name: '清华大学', tier: '985', major: '生命科学/交叉信息', reason: '跨学科团队研究机会多' },
      { name: '西安交通大学', tier: '985', major: '少年班/工程科学', reason: '工程实践+团队协作' },
      { name: '麻省理工学院（美国）', tier: '国际', major: '生物工程/CS', reason: 'Lab文化+团队科研最强' },
    ],
    books: [
      { title: '双螺旋', author: '詹姆斯·沃森', target: 'child', ageRange: '13-16', reason: 'DNA发现故事——团队协作改写科学史' },
      { title: '团队的力量', author: '斯坦利·麦克里斯特尔', target: 'parent', reason: '理解团队型研究者的协作模式' },
    ],
    documentaries: [
      { title: '粒子狂热', platform: 'B站', reason: '数千名科学家的团队求证之旅' },
    ],
    parentFocus: [
      { highlight: '求证+协作=科研项目的核心人才', commonMisunderstanding: '"太依赖别人"', truthReframe: '协作不是依赖——TA知道如何利用集体智慧解决更大的问题', actionTip: '鼓励参加科学社团或项目式学习小组' },
    ],
  },

  'D-ID': {
    universities: [
      { name: '哈尔滨工业大学', tier: '985', major: '航天/机器人/AI', reason: '系统工程+实验验证并重' },
      { name: '北京航空航天大学', tier: '985', major: '航空航天/信息', reason: '精密系统设计的顶级学府' },
      { name: '华中科技大学', tier: '985', major: '机械/光电/计算机', reason: '工程实践能力培养一流' },
      { name: '电子科技大学', tier: '985', major: '电子信息/通信', reason: '信息系统分析设计强校' },
      { name: 'ETH Zurich（瑞士）', tier: '国际', major: '工程/CS', reason: '精密工程+系统设计的全球标杆' },
    ],
    books: [
      { title: '系统之美', author: '德内拉·梅多斯', target: 'child', ageRange: '13-16', reason: '系统思维的入门经典' },
      { title: '编程之美', author: '微软亚洲研究院', target: 'child', ageRange: '10-12', reason: '算法=用逻辑设计解决方案' },
      { title: '原则', author: '瑞·达利欧', target: 'parent', reason: '系统化决策的经典框架' },
    ],
    documentaries: [
      { title: '登月第一人', platform: 'B站', reason: '系统工程的巅峰之作——阿波罗计划' },
      { title: '代码奔腾', platform: '腾讯视频', reason: '中国AI和芯片工程师的系统分析之路' },
    ],
    parentFocus: [
      { highlight: '验证+设计=最强的工程师思维', commonMisunderstanding: '"太刻板""不够灵活"', truthReframe: '严谨不是刻板，是"不允许自己犯低级错误"的工程师品质', actionTip: '给TA复杂一点的拼装模型或编程项目，让系统思维"用起来"' },
    ],
  },

  'D-IE': {
    universities: [
      { name: '清华大学', tier: '985', major: '新雅书院', reason: '通识教育+跨学科表达' },
      { name: '北京大学', tier: '985', major: '新闻传播+自然科学双学位', reason: '科学+传播的跨学科路径' },
      { name: '南方科技大学', tier: '一本', major: '理学+通识', reason: '科研+表达双轨培养' },
      { name: '斯坦福大学（美国）', tier: '国际', major: 'CS+Communication', reason: '科技+传播的跨学科标杆' },
    ],
    books: [
      { title: '科学革命的结构', author: '托马斯·库恩', target: 'child', ageRange: '13-16', reason: '理解科学如何被传播和接受' },
      { title: '费曼的彩虹', author: '列纳德·蒙洛迪诺', target: 'child', ageRange: '10-12', reason: '最会表达的物理学家的故事' },
      { title: '知识的错觉', author: '史蒂文·斯洛曼', target: 'parent', reason: '理解"知识翻译者"角色的价值' },
    ],
    documentaries: [
      { title: '宇宙时空之旅', platform: 'B站', reason: '科学传播的巅峰之作' },
    ],
    parentFocus: [
      { highlight: '求证+表达=天然的知识翻译者', commonMisunderstanding: '"不够专注，老想讲给别人听"', truthReframe: '教别人是最好的学习方式——TA在"教"的过程中理解更深', actionTip: '让TA当家里的"小老师"，每周给家人讲一个新知识' },
    ],
  },

  'D-IR': {
    universities: [
      { name: '北京大学', tier: '985', major: '哲学/科学史', reason: '科学哲学的最高学府' },
      { name: '中国科学技术大学', tier: '985', major: '科技史/基础物理', reason: '求真+反思的学术净土' },
      { name: '南京大学', tier: '985', major: '匡亚明学院/基础学科', reason: '安静深邃的学术氛围' },
      { name: '剑桥大学（英国）', tier: '国际', major: '科学哲学/物理', reason: '牛顿+维特根斯坦的思辨传承' },
    ],
    books: [
      { title: '哥德尔、艾舍尔、巴赫', author: '侯世达', target: 'child', ageRange: '13-16', reason: '逻辑、递归与反思的智力盛宴' },
      { title: '科学方法论', author: '波普尔', target: 'child', ageRange: '13-16', reason: '理解"证伪"——科学思辨的核心' },
      { title: '反脆弱', author: '塔勒布', target: 'parent', reason: '理解深度思辨型孩子的"反脆弱"特质' },
    ],
    documentaries: [
      { title: '维度：数学漫步', platform: 'B站', reason: '数学之美与深度思辨的视觉化' },
    ],
    parentFocus: [
      { highlight: '求证+反思=最深层次的科学思辨力', commonMisunderstanding: '"钻牛角尖""太学究气"', truthReframe: '这是未来基础科学研究者的核心特质——诺贝尔奖得主的标配', actionTip: '给TA足够的"独处思考时间"，不要用"快点做决定"打断深度思考' },
    ],
  },

  'D-LD': {
    universities: [
      { name: '上海交通大学', tier: '985', major: '安泰管理学院', reason: '管理+实践导向的领导力培养' },
      { name: '清华大学', tier: '985', major: '经管学院', reason: '系统性领导力培养' },
      { name: '中山大学', tier: '985', major: '管理学院/公共管理', reason: '华南地区管理教育领头羊' },
      { name: '沃顿商学院（美国）', tier: '国际', major: '管理/领导力', reason: '全球商业领导力教育的巅峰' },
    ],
    books: [
      { title: '高效能人士的七个习惯', author: '柯维', target: 'child', ageRange: '13-16', reason: '项目管理和自我管理的经典' },
      { title: '第五项修炼', author: '彼得·圣吉', target: 'parent', reason: '理解系统思维型领导者的培养方式' },
    ],
    documentaries: [
      { title: '成为沃伦·巴菲特', platform: 'B站', reason: '长期主义+人际智慧的典范' },
    ],
    parentFocus: [
      { highlight: '协调力+规划力=天生的组织者', commonMisunderstanding: '"太爱管别人""小大人"', truthReframe: 'TA天生的组织能力是未来项目经理、CEO的核心素质', actionTip: '让TA负责组织一次家庭活动——从计划到执行到总结' },
    ],
  },

  'D-LE': {
    universities: [
      { name: '中国人民大学', tier: '985', major: '新闻传播/公共管理', reason: '沟通+领导力的双重培养' },
      { name: '外交学院', tier: '一本', major: '外交学', reason: '用语言影响世界的专业训练' },
      { name: '北京外国语大学', tier: '211', major: '多语种+国际关系', reason: '跨文化沟通能力培养' },
      { name: '乔治城大学（美国）', tier: '国际', major: '外交/公共政策', reason: '全球外交沟通教育的标杆' },
    ],
    books: [
      { title: '影响力', author: '罗伯特·西奥迪尼', target: 'child', ageRange: '13-16', reason: '理解沟通如何改变他人行为' },
      { title: '关键对话', author: '科里·帕特森', target: 'parent', reason: '帮助沟通引领者型孩子处理高压沟通场景' },
    ],
    documentaries: [
      { title: '大外交家', platform: 'B站', reason: '看顶级沟通者如何用语言改变历史' },
    ],
    parentFocus: [
      { highlight: '共情+表达=天然的意见领袖', commonMisunderstanding: '"太八卦""爱管闲事"', truthReframe: 'TA不是八卦，是在"读取和处理社交信息"——这是情商的核心', actionTip: '鼓励参加辩论队或模拟联合国，给沟通能力一个"专业出口"' },
    ],
  },

  'D-LR': {
    universities: [
      { name: '北京师范大学', tier: '985', major: '心理学/社会工作', reason: '国内心理学教育的最高学府' },
      { name: '华南师范大学', tier: '211', major: '心理学', reason: '应用心理学方向强势' },
      { name: '南开大学', tier: '985', major: '社会学/心理学', reason: '人文关怀传统深厚' },
      { name: '伦敦大学国王学院', tier: '国际', major: '心理学/精神病学', reason: '全球心理学研究前列' },
    ],
    books: [
      { title: '被讨厌的勇气', author: '岸见一郎', target: 'child', ageRange: '13-16', reason: '在共情他人和自我觉察间找到平衡' },
      { title: '共情的力量', author: '亚瑟·乔拉米卡利', target: 'parent', reason: '理解高共情型孩子的内心世界' },
    ],
    documentaries: [
      { title: '人生七年', platform: 'B站', reason: '63年人生追踪，理解人际关系如何塑造命运' },
    ],
    parentFocus: [
      { highlight: '共情+反思=最深层次的人际智慧', commonMisunderstanding: '"太敏感""太在意别人"', truthReframe: '高敏感+深反思=未来最优秀的心理咨询师、教练或领导者的特质', actionTip: '教TA区分"共情"和"过度承担"——你可以理解别人的感受，但不必为别人的情绪负责' },
    ],
  },

  'D-DE': {
    universities: [
      { name: '北京电影学院', tier: '一本', major: '导演/美术/动画', reason: '视觉叙事+策划执行的专业训练' },
      { name: '中国美术学院', tier: '一本', major: '设计艺术学院', reason: '东方美学+设计策划' },
      { name: '浙江大学', tier: '985', major: '传媒+设计', reason: '综合性大学中设计与传播的交叉' },
      { name: '帕森斯设计学院（美国）', tier: '国际', major: '设计与策略', reason: '设计策略的全球标杆' },
    ],
    books: [
      { title: '创意之道', author: '赖声川', target: 'child', ageRange: '13-16', reason: '策划+创意的完美结合' },
      { title: '游戏设计艺术', author: '杰西·谢尔', target: 'child', ageRange: '10-12', reason: '设计+演绎的最佳实践' },
      { title: '用户体验要素', author: 'Jesse James Garrett', target: 'parent', reason: '理解策划演绎家的设计思维' },
    ],
    documentaries: [
      { title: '设计面面观', platform: 'B站', reason: '设计如何影响每一件产品的体验' },
    ],
    parentFocus: [
      { highlight: '设计+表达=从构思到呈现的全链条能力', commonMisunderstanding: '"爱出风头""太戏精"', truthReframe: '设计能力+表现力=天然的导演和制片人特质', actionTip: '让TA策划并执行一次"家庭展览"或"迷你演出"——从策划到呈现全流程' },
    ],
  },

  'D-DR': {
    universities: [
      { name: '华中科技大学', tier: '985', major: '机械/质量工程', reason: '精益制造+持续改进的理念培养' },
      { name: '大连理工大学', tier: '985', major: '工程管理/精益制造', reason: '日式精益管理方法引入最早' },
      { name: '西安交通大学', tier: '985', major: '管理科学/工业工程', reason: '系统优化方向领先' },
      { name: '东京大学（日本）', tier: '国际', major: '工学/品质管理', reason: '精益生产理念的发源地' },
    ],
    books: [
      { title: '精益思想', author: '詹姆斯·沃麦克', target: 'child', ageRange: '13-16', reason: '理解"持续改进"的力量' },
      { title: '清单革命', author: '阿图·葛文德', target: 'parent', reason: '理解优化型思维如何拯救生命' },
    ],
    documentaries: [
      { title: '寿司之神', platform: 'B站', reason: '85岁仍在优化的匠人精神' },
    ],
    parentFocus: [
      { highlight: '设计+反思=持续进化的工匠精神', commonMisunderstanding: '"太完美主义""做事太慢"', truthReframe: 'TA追求的不是完美，是"比上次更好"——这是最稀缺的成长型心态', actionTip: '鼓励TA做"版本记录"——每次改进都记下来，看到自己的进化轨迹' },
    ],
  },

  'D-ER': {
    universities: [
      { name: '北京大学', tier: '985', major: '中文系/比较文学', reason: '文学创作与思辨的最高学府' },
      { name: '复旦大学', tier: '985', major: '中文系/创意写作MFA', reason: '国内最早的创意写作专业' },
      { name: '南京大学', tier: '985', major: '文学院/戏剧影视', reason: '人文底蕴深厚的创作摇篮' },
      { name: '爱荷华大学（美国）', tier: '国际', major: '创意写作', reason: '全球创意写作教育的发源地' },
    ],
    books: [
      { title: '写作这回事', author: '斯蒂芬·金', target: 'child', ageRange: '13-16', reason: '大师分享写作的反思与精进之路' },
      { title: '活着', author: '余华', target: 'child', ageRange: '13-16', reason: '用最简洁的语言表达最深的思考' },
      { title: '创作者的日常', author: '梅森·柯里', target: 'parent', reason: '理解创作型孩子的独特节奏和需求' },
    ],
    documentaries: [
      { title: '但是还有书籍', platform: 'B站', reason: '关于写作、表达与人生反思的纪录片' },
    ],
    parentFocus: [
      { highlight: '表达+反思=有深度有温度的创作力', commonMisunderstanding: '"太感性""不务实"', truthReframe: '文学和深度表达是人类文明的基石——AI可以生成文字，但无法创造人性温度', actionTip: '鼓励TA写日记或博客——不评判内容，只肯定"坚持表达"这件事' },
    ],
  },

  // ========== 三峰型 ==========

  'T-WIL': {
    universities: [
      { name: '中国科学院大学', tier: '985', major: '综合理学', reason: '全能型探索者的科研乐园' },
      { name: '浙江大学', tier: '985', major: '竺可桢学院', reason: '跨学科+团队探索' },
      { name: '新加坡国立大学', tier: '国际', major: '理学/跨学科', reason: '亚洲最强的综合型研究环境' },
    ],
    books: [
      { title: '枪炮、病菌与钢铁', author: '贾雷德·戴蒙德', target: 'child', ageRange: '13-16', reason: '全能型探索的教科书——跨学科思维' },
      { title: '项目式学习设计', author: '巴克教育研究所', target: 'parent', reason: '帮助全能型孩子找到项目式学习方式' },
    ],
    documentaries: [
      { title: '王朝', platform: 'B站', reason: '好奇心×探究力×团队协作的自然大片' },
    ],
    parentFocus: [
      { highlight: '好奇+求证+协作=科考队长型人才', commonMisunderstanding: '"什么都想学，怕不精"', truthReframe: '全能型探索者恰恰需要广度——深度会在找到"真爱领域"后自然发生', actionTip: '让TA尝试带领小伙伴完成一个为期一个月的"探索项目"' },
    ],
  },

  'T-WID': {
    universities: [
      { name: '清华大学', tier: '985', major: '交叉信息研究院', reason: '创新+验证+设计的顶级训练场' },
      { name: '上海交通大学', tier: '985', major: '致远学院/机械', reason: '工程创新导向明确' },
      { name: 'MIT（美国）', tier: '国际', major: 'Media Lab', reason: '全球创新实验的圣地' },
    ],
    books: [
      { title: '创新者的DNA', author: '杰夫·戴尔', target: 'child', ageRange: '13-16', reason: '发明家如何从好奇到验证到产品化' },
      { title: '改变世界的方程式', author: '伊恩·斯图尔特', target: 'child', ageRange: '10-12', reason: '数学如何变成改变世界的工具' },
      { title: '从0到1', author: '彼得·蒂尔', target: 'parent', reason: '理解创新实验家型孩子的思维方式' },
    ],
    documentaries: [
      { title: '创新之路', platform: '央视/B站', reason: '全球创新历史——从爱迪生到硅谷' },
    ],
    parentFocus: [
      { highlight: '好奇×验证×设计=完整的发明家链条', commonMisunderstanding: '"太爱折腾""满屋子半成品"', truthReframe: '每个"半成品"都是一次创新尝试——爱迪生失败了一千次才成功', actionTip: '给TA一个"发明周"——从问题到原型，让TA经历完整的创新过程' },
    ],
  },

  'T-IDR': {
    universities: [
      { name: '清华大学', tier: '985', major: '经管/工程管理', reason: '战略+数据+优化的顶级培养' },
      { name: '北京大学', tier: '985', major: '光华管理/数学', reason: '定量分析+策略决策' },
      { name: '耶鲁大学（美国）', tier: '国际', major: '计算+社会科学', reason: '策略性思维的全球标杆' },
    ],
    books: [
      { title: '策略思维', author: '迪克西特', target: 'child', ageRange: '13-16', reason: '博弈论入门——策略思维的科学' },
      { title: '孙子兵法（解读版）', author: '孙武', target: 'child', ageRange: '10-12', reason: '2500年前的策略大师智慧' },
      { title: '思维的发现', author: '迈克尔·刘易斯', target: 'parent', reason: '理解策略型孩子的决策方式' },
    ],
    documentaries: [
      { title: 'AlphaGo', platform: 'B站', reason: '人机博弈——策略思维的极限挑战' },
    ],
    parentFocus: [
      { highlight: '验证×设计×反思=最强的策略决策力', commonMisunderstanding: '"做事太磨蹭""过度谨慎"', truthReframe: 'TA不是慢，是在做"最优策略推演"——想清楚再行动比冲动更高效', actionTip: '和TA一起下棋或玩策略类桌游——这是TA最享受的学习方式' },
    ],
  },

  'T-WLE': {
    universities: [
      { name: '复旦大学', tier: '985', major: '新闻传播/社会学', reason: '传播+社群的交叉学科' },
      { name: '中国传媒大学', tier: '211', major: '传媒管理/新媒体', reason: '社交媒体时代的传播教育' },
      { name: '南加州大学（美国）', tier: '国际', major: '传播/创意产业', reason: '媒体+社群+创业的交叉' },
    ],
    books: [
      { title: '社交货币', author: '乔纳·伯杰', target: 'child', ageRange: '13-16', reason: '理解社交传播的底层逻辑' },
      { title: '游戏力', author: '劳伦斯·科恩', target: 'parent', reason: '理解社交催化剂型孩子的互动方式' },
    ],
    documentaries: [
      { title: '社交困境', platform: 'Netflix', reason: '理解社交网络对人类互动的影响' },
    ],
    parentFocus: [
      { highlight: '好奇×联结×表达=天生的社群领袖', commonMisunderstanding: '"太社交了""光玩不学"', truthReframe: 'TA的学习方式就是"通过社交传播知识"——这是知识IP的核心能力', actionTip: '鼓励TA组建学习分享小组或做科普短视频' },
    ],
  },

  'T-WIR': {
    universities: [
      { name: '北京大学', tier: '985', major: '物理/哲学双学位', reason: '科学+思辨的最高学术殿堂' },
      { name: '中国科学技术大学', tier: '985', major: '物理/数学', reason: '纯粹学术驱动的研究型大学' },
      { name: '普林斯顿大学（美国）', tier: '国际', major: '理论物理/哲学', reason: '爱因斯坦的学术家园，最纯粹的学者文化' },
    ],
    books: [
      { title: '上帝掷骰子吗', author: '曹天元', target: 'child', ageRange: '13-16', reason: '量子力学史——好奇+验证+反思的极致之旅' },
      { title: '确定性的终结', author: '伊利亚·普利高津', target: 'child', ageRange: '13-16', reason: '科学与哲学反思的交叉点' },
      { title: '心流', author: '米哈里·契克森米哈赖', target: 'parent', reason: '理解内驱型学者的"心流"状态' },
    ],
    documentaries: [
      { title: '爱因斯坦的大脑', platform: 'B站', reason: '最伟大的内驱型学者的大脑之谜' },
    ],
    parentFocus: [
      { highlight: '好奇×验证×反思=终身学习的自驱引擎', commonMisunderstanding: '"太宅了""不爱社交""只会读书"', truthReframe: 'TA有着科学家最核心的三种能力——纯粹的求知欲是最稀缺的潜能', actionTip: '给TA自主选择学习主题的自由——强制学习会破坏内驱力' },
    ],
  },

  'T-DLE': {
    universities: [
      { name: '清华大学', tier: '985', major: '经管学院/创新创业', reason: '全方位管理人才培养' },
      { name: '浙江大学', tier: '985', major: '管理/设计/传媒三选', reason: '综合管理+设计+传播' },
      { name: '伦敦商学院', tier: '国际', major: 'MBA/创业管理', reason: '全球商业领导力教育的标杆' },
    ],
    books: [
      { title: '精益创业', author: '埃里克·莱斯', target: 'child', ageRange: '13-16', reason: '从设计到团队到展示的创业全流程' },
      { title: '领导力21法则', author: '约翰·麦克斯韦尔', target: 'parent', reason: '理解实践建造者型领导力的培养路径' },
    ],
    documentaries: [
      { title: '硅谷传奇', platform: 'B站', reason: '看创业者如何将想法变成改变世界的产品' },
    ],
    parentFocus: [
      { highlight: '设计×协作×表达=全链条项目型人才', commonMisunderstanding: '"太爱出风头""爱指挥别人"', truthReframe: '能规划+能组织+能展示=天生的CEO特质，不是出风头是在领导', actionTip: '让TA主导一个真实项目——比如组织一次义卖或校园活动' },
    ],
  },

  'T-LER': {
    universities: [
      { name: '北京师范大学', tier: '985', major: '心理学/应用心理', reason: '人际感知力的专业训练' },
      { name: '华东师范大学', tier: '985', major: '心理与认知科学', reason: '认知科学方向领先' },
      { name: '密歇根大学（美国）', tier: '国际', major: '心理学/组织行为学', reason: '全球社会心理学研究的标杆' },
    ],
    books: [
      { title: '情商', author: '丹尼尔·戈尔曼', target: 'child', ageRange: '13-16', reason: '感知协调者的能力密码' },
      { title: '高敏感是种潜能', author: '伊尔斯·桑德', target: 'parent', reason: '理解高感知力孩子的内心世界' },
    ],
    documentaries: [
      { title: '脑内乘风破浪', platform: 'B站/Disney+', reason: '情绪如何工作——皮克斯版心理学课' },
    ],
    parentFocus: [
      { highlight: '联结×表达×反思=最懂人心的沟通大师', commonMisunderstanding: '"太感性""不够理性"', truthReframe: '情感智慧不是不理性——是一种更高级的信息处理方式', actionTip: '肯定TA的情感洞察力，同时引导TA用"分析框架"梳理感受' },
    ],
  },

  'T-WDE': {
    universities: [
      { name: '清华大学', tier: '985', major: '美院/交叉信息/创业', reason: '创意+技术+展示的顶级平台' },
      { name: '同济大学', tier: '985', major: '设计创意学院', reason: '创意设计与展示的融合' },
      { name: '斯坦福大学（美国）', tier: '国际', major: 'd.school+Engineering', reason: '创新创业教育的全球标杆' },
    ],
    books: [
      { title: '乔布斯传', author: '艾萨克森', target: 'child', ageRange: '13-16', reason: '好奇心×设计力×展示力的完美范本' },
      { title: '创业维艰', author: '本·霍洛维茨', target: 'parent', reason: '理解创想工程师型孩子的创业者潜质' },
    ],
    documentaries: [
      { title: '创新之路', platform: '央视/B站', reason: '从灵感到产品到发布——创新全链条' },
    ],
    parentFocus: [
      { highlight: '好奇×设计×表达=乔布斯式的黄金三角', commonMisunderstanding: '"太爱折腾""想一出是一出"', truthReframe: '灵感→产品→发布的全链条能力=未来超级个体的核心竞争力', actionTip: '给TA一个"发布日"——每月发布一个小作品，培养从0到1的闭环习惯' },
    ],
  },

  // ========== 特殊型 ==========

  'X-BAL': {
    universities: [
      { name: '浙江大学', tier: '985', major: '竺可桢学院/通识', reason: '宽口径培养+灵活转专业' },
      { name: '北京大学', tier: '985', major: '元培学院', reason: '自由探索，找到最适合的方向' },
      { name: '复旦大学', tier: '985', major: '通识教育体系', reason: '文理兼修的博雅教育' },
      { name: '香港大学', tier: '国际', major: '通识/跨学科', reason: '亚洲博雅教育的标杆' },
      { name: '杜克大学（美国）', tier: '国际', major: 'Liberal Arts', reason: '美式博雅教育的典范' },
    ],
    books: [
      { title: '刻意练习', author: '安德斯·艾利克森', target: 'child', ageRange: '13-16', reason: '找到"引爆点"后如何深入精进' },
      { title: '斜杠青年', author: 'Marci Alboher', target: 'child', ageRange: '13-16', reason: '均衡发展者的多元人生可能' },
      { title: '让孩子自己找答案', author: '丹尼尔·西格尔', target: 'parent', reason: '如何帮助均衡型孩子找到"点燃点"' },
    ],
    documentaries: [
      { title: '人生七年', platform: 'B站', reason: '均衡发展的孩子长大后的多元人生' },
      { title: '寻找手艺', platform: 'B站', reason: '通过探索找到自己热爱的事' },
    ],
    parentFocus: [
      { highlight: '均衡不是没潜能，是潜能在等待被激活', commonMisunderstanding: '"什么都行但不突出""没有特长"', truthReframe: '均衡发展的孩子适应力最强——给足体验，"引爆点"会自然出现', actionTip: '每个季度让TA尝试一个完全不同的领域——舞蹈、编程、烹饪、写作——让身体替大脑做选择' },
    ],
  },

  // ==================== 60分型个性化内容（高频双峰型 α/β 差异化推荐） ====================

  'D-WI-α': {
    universities: [
      { name: '中国科学技术大学', tier: '985', major: '少年班/物理/天文', reason: '纯科研导向，完美匹配理论探索型好奇心+求证力' },
      { name: '北京大学', tier: '985', major: '物理/数学/元培学院', reason: '基础科学+理论研究的自由探索' },
      { name: '中国科学院大学', tier: '985', major: '基础物理/天文', reason: '直接接触前沿理论研究' },
      { name: 'Caltech（美国）', tier: '国际', major: '理论物理/数学', reason: '全球最纯粹的理论好奇心驱动研究型大学' },
    ],
    books: [
      { title: '时间简史', author: '霍金', target: 'child', ageRange: '13-16', reason: '理论好奇心与逻辑求证的完美结合' },
      { title: '从一到无穷大', author: '乔治·伽莫夫', target: 'child', ageRange: '10-12', reason: '用逻辑推理探索数学和物理的奥秘' },
      { title: '园丁与木匠', author: '艾莉森·高普尼克', target: 'parent', reason: '理解好奇心驱动型孩子的独立思考需求' },
    ],
    documentaries: [
      { title: '宇宙时空之旅', platform: 'B站', reason: '理论好奇心的终极视觉盛宴' },
      { title: '门捷列夫很忙', platform: 'B站', reason: '用逻辑和实验揭示元素规律' },
    ],
    parentFocus: [
      { highlight: '理论探索型：好奇心+逻辑验证=科学家思维', commonMisunderstanding: '"钻牛角尖""不切实际"', truthReframe: '对理论问题的执着是科学家最核心的品质，别急着要"实用"的答案', actionTip: '给TA提供科学实验工具和书籍，允许TA在感兴趣的理论问题上深钻' },
    ],
  },

  'D-WI-β': {
    universities: [
      { name: '复旦大学', tier: '985', major: '新闻+自然科学双学位', reason: '好奇心+人文表达的跨学科培养' },
      { name: '南京大学', tier: '985', major: '天文/人文科学', reason: '科学素养+人文关怀并重' },
      { name: '浙江大学', tier: '985', major: '科学传播/竺可桢学院', reason: '综合性强，适合跨界好奇心' },
      { name: '哥伦比亚大学（美国）', tier: '国际', major: '科学新闻/通识', reason: '科学与人文叙事的全球标杆' },
    ],
    books: [
      { title: '万物简史', author: '比尔·布莱森', target: 'child', ageRange: '10-12', reason: '用幽默叙事讲述科学，适合人文型好奇心' },
      { title: '海底两万里', author: '儒勒·凡尔纳', target: 'child', ageRange: '10-12', reason: '好奇心+叙事力的科幻冒险' },
      { title: '故事经济学', author: '罗伯特·麦基', target: 'parent', reason: '理解表达型探索者如何通过叙事学习' },
    ],
    documentaries: [
      { title: '但是还有书籍', platform: 'B站', reason: '探索世界的人文视角' },
      { title: '他乡的童年', platform: '优酷', reason: '用好奇心观察世界各地孩子的成长' },
    ],
    parentFocus: [
      { highlight: '人文探索型：好奇心+社交感知=内容创作者思维', commonMisunderstanding: '"太爱说话""不专心做事"', truthReframe: 'TA通过与人交流和讲故事来学习，表达就是TA的探索方式', actionTip: '鼓励写"发现日记"或拍短视频，让TA用自己的方式记录探索过程' },
    ],
  },

  'D-WD-α': {
    universities: [
      { name: '清华大学', tier: '985', major: '建筑学院/精密仪器', reason: '技术+设计的严谨创造' },
      { name: '哈尔滨工业大学', tier: '985', major: '机械设计/建筑', reason: '精密系统设计能力培养' },
      { name: '同济大学', tier: '985', major: '建筑/城市规划', reason: '结构化设计思维的理想土壤' },
      { name: 'MIT（美国）', tier: '国际', major: '机械工程/建筑', reason: '技术创新+系统设计的全球标杆' },
    ],
    books: [
      { title: '系统之美', author: '德内拉·梅多斯', target: 'child', ageRange: '13-16', reason: '理解复杂系统设计的核心逻辑' },
      { title: '了不起的设计', author: 'DK', target: 'child', ageRange: '6-9', reason: '从日常物品发现设计中的结构美' },
      { title: '设计思维', author: '蒂姆·布朗', target: 'parent', reason: '理解结构化创意思维的培养方法' },
    ],
    documentaries: [
      { title: '超级工程', platform: 'B站', reason: '系统化工程设计的壮美纪录' },
    ],
    parentFocus: [
      { highlight: '系统创造型：好奇心+结构化设计=工程创新者', commonMisunderstanding: '"太刻板""不够灵活"', truthReframe: '严谨的设计思维是创新的基础，先"拆解"再"重建"是工程师的核心学习路径', actionTip: '给TA复杂的建构类玩具和编程项目，让系统设计能力有用武之地' },
    ],
  },

  'D-WD-β': {
    universities: [
      { name: '同济大学', tier: '985', major: '设计创意学院', reason: '创意设计+跨学科协作' },
      { name: '中国美术学院', tier: '一本', major: '设计艺术学院', reason: '艺术创意+视觉表达' },
      { name: '湖南大学', tier: '985', major: '工业设计', reason: '用户体验+创意实践' },
      { name: '斯坦福大学（美国）', tier: '国际', major: 'd.school设计思维', reason: '以人为中心的创意设计标杆' },
    ],
    books: [
      { title: '创新者', author: '沃尔特·艾萨克森', target: 'child', ageRange: '13-16', reason: '数字革命先驱们的协作创意之路' },
      { title: '画给孩子的设计史', author: 'DK', target: 'child', ageRange: '6-9', reason: '在人文故事中感受设计的力量' },
      { title: '创造力', author: '米哈里·契克森米哈赖', target: 'parent', reason: '理解创意表达型孩子的心流状态' },
    ],
    documentaries: [
      { title: '抽象：设计的艺术', platform: 'Netflix/B站', reason: '全球顶级设计师如何用创意改变世界' },
    ],
    parentFocus: [
      { highlight: '创意表达型：好奇心+视觉叙事=创意策划者', commonMisunderstanding: '"只会画画有什么用"', truthReframe: '视觉叙事和创意表达是未来最有价值的能力之一——每个品牌都需要会讲故事的设计师', actionTip: '给TA一个"创造角"，鼓励TA和小伙伴一起完成创意项目' },
    ],
  },

  'D-ID-α': {
    universities: [
      { name: '哈尔滨工业大学', tier: '985', major: '航天/机器人/AI', reason: '精密系统工程的严谨训练' },
      { name: '北京航空航天大学', tier: '985', major: '航空航天/自动控制', reason: '验证+设计的顶级工程学府' },
      { name: '电子科技大学', tier: '985', major: '电子信息/通信', reason: '信号处理和系统设计' },
      { name: 'ETH Zurich（瑞士）', tier: '国际', major: '机械/电子工程', reason: '精密工程+理论验证的全球标杆' },
    ],
    books: [
      { title: '编程之美', author: '微软亚洲研究院', target: 'child', ageRange: '10-12', reason: '算法思维——用逻辑解决复杂问题' },
      { title: '系统之美', author: '德内拉·梅多斯', target: 'child', ageRange: '13-16', reason: '系统工程思维的基础框架' },
      { title: '原则', author: '瑞·达利欧', target: 'parent', reason: '系统化决策的经典，匹配分析型孩子的思维模式' },
    ],
    documentaries: [
      { title: '登月第一人', platform: 'B站', reason: '系统工程+精密验证的巅峰之作' },
      { title: '代码奔腾', platform: '腾讯视频', reason: '中国工程师的系统分析精神' },
    ],
    parentFocus: [
      { highlight: '精密分析型：验证+系统设计=顶级工程师', commonMisunderstanding: '"太较真""不够灵活"', truthReframe: '每一次"较真"都是在训练精密思维，这是航天工程师和AI算法师的核心素质', actionTip: '提供编程、机器人搭建等需要系统设计的项目，让TA的精密大脑"满负荷运转"' },
    ],
  },

  'D-ID-β': {
    universities: [
      { name: '华中科技大学', tier: '985', major: '机械/生物医学工程', reason: '工程+人文关怀的交叉应用' },
      { name: '清华大学', tier: '985', major: '新雅书院/工程物理', reason: '技术+人文素养的通识培养' },
      { name: '上海交通大学', tier: '985', major: '生物医学工程', reason: '技术服务于人的工程理念' },
      { name: '斯坦福大学（美国）', tier: '国际', major: '人机交互/生物设计', reason: '技术+人本设计的全球引领者' },
    ],
    books: [
      { title: '隐秩序', author: '约翰·霍兰', target: 'child', ageRange: '13-16', reason: '复杂系统中人与环境的互动' },
      { title: '人类简史', author: '尤瓦尔·赫拉利', target: 'child', ageRange: '13-16', reason: '从系统视角理解人类协作如何塑造世界' },
      { title: '非暴力沟通', author: '马歇尔·卢森堡', target: 'parent', reason: '帮助协作型系统思考者更好地表达技术观点' },
    ],
    documentaries: [
      { title: '手术两百年', platform: 'B站', reason: '精密系统思维如何服务于人类健康' },
    ],
    parentFocus: [
      { highlight: '协作系统型：验证+设计+团队=技术领导者', commonMisunderstanding: '"既想搞技术又爱管闲事"', truthReframe: '能同时理解系统和理解人的孩子，是未来最稀缺的技术管理者', actionTip: '鼓励TA带领小伙伴一起完成技术项目，在协作中发挥系统思维' },
    ],
  },

  'D-WE-α': {
    universities: [
      { name: '北京大学', tier: '985', major: '新闻传播+理科双学位', reason: '科学探索+深度表达的跨学科路径' },
      { name: '中国科学技术大学', tier: '985', major: '科技传播/科学史', reason: '科学思维+传播能力' },
      { name: '南方科技大学', tier: '一本', major: '通识+理学', reason: '科研素养+独立表达的创新环境' },
      { name: '哥伦比亚大学（美国）', tier: '国际', major: '科学新闻', reason: '将科学发现转化为公众叙事的全球标杆' },
    ],
    books: [
      { title: '科学革命的结构', author: '托马斯·库恩', target: 'child', ageRange: '13-16', reason: '理解科学如何被独立思考者推动' },
      { title: '费曼的彩虹', author: '列纳德·蒙洛迪诺', target: 'child', ageRange: '10-12', reason: '最会用逻辑讲故事的物理学家' },
      { title: '知识的错觉', author: '史蒂文·斯洛曼', target: 'parent', reason: '理解独立思考型表达者的学习方式' },
    ],
    documentaries: [
      { title: '宇宙时空之旅', platform: 'B站', reason: '科学叙事的巅峰——从理论到表达' },
    ],
    parentFocus: [
      { highlight: '分析叙事型：好奇心+独立表达=科学传播者', commonMisunderstanding: '"只会纸上谈兵"', truthReframe: '能把复杂的事讲清楚是最高级的能力——费曼说"你不能解释就是不理解"', actionTip: '让TA写科学博客或做科普视频，用表达倒逼深度理解' },
    ],
  },

  'D-WE-β': {
    universities: [
      { name: '复旦大学', tier: '985', major: '新闻学院/中文系', reason: '人文叙事+社交表达的完美训练场' },
      { name: '中国传媒大学', tier: '211', major: '广播电视编导', reason: '用画面和声音与人连接' },
      { name: '武汉大学', tier: '985', major: '新闻传播/信息管理', reason: '人文传播+社会洞察传统' },
      { name: '伦敦政治经济学院（英国）', tier: '国际', major: '传播/媒体', reason: '社会传播学研究的全球引领者' },
    ],
    books: [
      { title: '写给大家的中国美术史', author: '蒋勋', target: 'child', ageRange: '10-12', reason: '在人文故事中学习视觉表达' },
      { title: '小王子', author: '圣埃克苏佩里', target: 'child', ageRange: '6-9', reason: '关于人际联结和表达的经典寓言' },
      { title: '故事经济学', author: '罗伯特·麦基', target: 'parent', reason: '理解叙事型孩子如何通过社交学习' },
    ],
    documentaries: [
      { title: '航拍中国', platform: 'B站', reason: '用全新视角讲述中国故事' },
      { title: '但是还有书籍', platform: 'B站', reason: '人文叙事和社交连接的温暖纪录' },
    ],
    parentFocus: [
      { highlight: '社交叙事型：好奇心+协作表达=内容创业者', commonMisunderstanding: '"太爱表现""不够深入"', truthReframe: 'TA在与人互动中获取灵感，在表达中深化理解——社交就是TA的学习方式', actionTip: '鼓励组织读书会、发起播客或vlog，让TA在社交表达中释放潜力' },
    ],
  },

  'D-LE-α': {
    universities: [
      { name: '外交学院', tier: '一本', major: '外交学/国际关系', reason: '独立分析+精准沟通的专业训练' },
      { name: '中国人民大学', tier: '985', major: '法学/公共管理', reason: '逻辑表达+政策分析' },
      { name: '北京大学', tier: '985', major: '国际关系/法学', reason: '独立思辨+深度表达的学术传统' },
      { name: '乔治城大学（美国）', tier: '国际', major: '国际关系/法学', reason: '精准沟通+独立分析的全球标杆' },
    ],
    books: [
      { title: '影响力', author: '罗伯特·西奥迪尼', target: 'child', ageRange: '13-16', reason: '理解逻辑说服如何改变他人行为' },
      { title: '穷查理宝典', author: '查理·芒格', target: 'child', ageRange: '13-16', reason: '多元思维模型的独立思考框架' },
      { title: '关键对话', author: '科里·帕特森', target: 'parent', reason: '帮助分析型沟通者处理复杂情境' },
    ],
    documentaries: [
      { title: '大外交家', platform: 'B站', reason: '独立分析+精准表达如何改变历史走向' },
    ],
    parentFocus: [
      { highlight: '分析引领型：共情+逻辑表达=策略沟通者', commonMisunderstanding: '"太强势""总想赢"', truthReframe: '逻辑化的沟通能力是律师、外交官、谈判专家的核心素质', actionTip: '鼓励参加辩论赛和模拟法庭，为分析型沟通力找到专业出口' },
    ],
  },

  'D-LE-β': {
    universities: [
      { name: '中国人民大学', tier: '985', major: '新闻传播/社会学', reason: '人际洞察+公共传播' },
      { name: '北京外国语大学', tier: '211', major: '多语种+国际关系', reason: '跨文化协作沟通能力' },
      { name: '华东师范大学', tier: '985', major: '教育/社会发展', reason: '社会关怀+教育沟通' },
      { name: '伦敦政治经济学院（英国）', tier: '国际', major: '社会政策/传播', reason: '社会影响力+人际传播的全球标杆' },
    ],
    books: [
      { title: '社交天性', author: '马修·利伯曼', target: 'child', ageRange: '13-16', reason: '理解社交型领袖的大脑机制' },
      { title: '共情的力量', author: '亚瑟·乔拉米卡利', target: 'parent', reason: '理解高共情型沟通者的内心世界' },
    ],
    documentaries: [
      { title: '他乡的童年', platform: '优酷', reason: '看不同文化中的孩子如何通过社交学习' },
    ],
    parentFocus: [
      { highlight: '协作引领型：共情+团队表达=社群领袖', commonMisunderstanding: '"太八卦""爱管闲事"', truthReframe: 'TA不是八卦，是天然的"人际雷达"和"团队润滑剂"——这是情商的最高形态', actionTip: '鼓励组织班级活动或社区项目，让TA的社群引领力有施展舞台' },
    ],
  },
}

// ==================== 获取推荐内容 ====================

export function getReportContent(talentKey: string): TalentReportContent | null {
  // 优先精确匹配（支持60-key如'D-WI-α'）
  if (TALENT_REPORT_CONTENT[talentKey]) return TALENT_REPORT_CONTENT[talentKey]
  // fallback: 提取30-key（去掉'-α'/'-β'后缀）
  const parentKey = talentKey.replace(/-[αβ]$/, '')
  return TALENT_REPORT_CONTENT[parentKey] || null
}

/** 获取差异化大学推荐 (按层级筛选) */
export function getUniversitiesByTier(
  talentKey: string,
  tier?: '985' | '211' | '一本' | '国际',
): UniversityRec[] {
  const content = TALENT_REPORT_CONTENT[talentKey]
  if (!content) return []
  if (!tier) return content.universities
  return content.universities.filter(u => u.tier === tier)
}

/** 获取差异化书籍推荐 (按目标人群筛选) */
export function getBooksByTarget(
  talentKey: string,
  target: 'child' | 'parent',
  ageRange?: string,
): BookRec[] {
  const content = TALENT_REPORT_CONTENT[talentKey]
  if (!content) return []
  let books = content.books.filter(b => b.target === target)
  if (ageRange) books = books.filter(b => !b.ageRange || b.ageRange === ageRange)
  return books
}

/** 获取家长关注重点 */
export function getParentFocusAreas(talentKey: string): ParentFocus[] {
  const content = TALENT_REPORT_CONTENT[talentKey]
  return content?.parentFocus || []
}
