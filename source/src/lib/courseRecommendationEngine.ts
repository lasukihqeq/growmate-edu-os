/**
 * GROWMATE课程推荐引擎
 * 基于WILDER六维度测评分数，智能匹配最适合的课程
 * 
 * 课程分类：
 * - 科普：校内科学实验课（启蒙W/I）
 * - 科创：周末户外PBL体系课（I/D/L/E）
 * - 科考：寒暑假营地科考课（I/R深度）
 * - 附加集训：专项能力强化
 */

// ==================== 类型定义 ====================

export interface Course {
  id: string
  name: string              // 原课程名
  displayName: string       // 展示名称（优化后）
  grade: string             // 年级：幼儿园/一年级...六年级/L0-L4/通用
  category: '科普' | '科创' | '科考' | '附加集训'
  semester?: string         // 学期
  month?: string            // 月份
  unit?: string             // 单元
  intro: string             // 课程简介
  wilderFocus: WilderFocus  // WILDER维度聚焦
  wilderDesc?: string       // 原始WILDER描述
  venue?: string            // 场地
  duration?: string         // 时长
  season?: string           // 适合季节
}

export interface WilderFocus {
  primary: string[]         // 主培养维度
  secondary: string[]       // 辅培养维度
  weights: Record<string, number>  // 各维度权重 0-1
}

export interface RecommendedCourse {
  course: Course
  matchScore: number        // 匹配度 0-100
  matchReasons: string[]    // 匹配原因
  priorityTag: '强烈推荐' | '推荐' | '适合'
}

export interface RecommendationResult {
  topPicks: RecommendedCourse[]      // 精选推荐（前3）
  byCategory: {
    科普: RecommendedCourse[]
    科创: RecommendedCourse[]
    科考: RecommendedCourse[]
    附加集训: RecommendedCourse[]
  }
  growthPath: GrowthPathSuggestion   // 成长路径建议
}

export interface GrowthPathSuggestion {
  currentStage: string
  suggestedPath: { stage: string; courses: string[]; focus: string }[]
  timeline: string
}

// ==================== WILDER维度配置 ====================

const WILDER_CONFIG = {
  W: { name: '好奇心', nameEn: 'Wonder', color: '#f59e0b', icon: '✨' },
  I: { name: '探究力', nameEn: 'Inquiry', color: '#3b82f6', icon: '🔬' },
  L: { name: '联结力', nameEn: 'Link', color: '#8b5cf6', icon: '🤝' },
  D: { name: '设计力', nameEn: 'Design', color: '#10b981', icon: '🏗️' },
  E: { name: '表达力', nameEn: 'Expression', color: '#ef4444', icon: '🎭' },
  R: { name: '反思力', nameEn: 'Reflection', color: '#06b6d4', icon: '🧭' },
}

// 年级与难度等级映射
const GRADE_LEVEL_MAP: Record<string, number> = {
  '幼儿园': 0, 'L0': 0,
  '一年级': 1, 'L1': 1,
  '二年级': 2, 'L2': 2,
  '三年级': 3, 'L3': 3,
  '四年级': 4, 'L4': 4,
  '五年级': 5, 'L5': 5,
  '六年级': 6,
  '通用': 3,  // 默认中等难度
  '': 3,
}

// ==================== 课程数据库（精选核心课程） ====================

export const COURSE_DATABASE: Course[] = [
  // ========== 科普课程（校内） ==========
  // 幼儿园
  {
    id: 'kp-yey-001',
    name: '帮动物回家',
    displayName: '动物探险护卫队｜小动物要住在怎样的地方',
    grade: '幼儿园',
    category: '科普',
    intro: '穿越"丛林迷宫"去帮小动物们找家，一路发现各种稀奇古怪的栖息地，做个善良又勇敢的"动物护卫队"！',
    wilderFocus: { primary: ['W', 'L'], secondary: ['E'], weights: { W: 0.9, I: 0.5, L: 0.7, D: 0.4, E: 0.6, R: 0.3 } },
    wilderDesc: 'W：好奇动物住哪\nI：观察不同动物图片/模型\nL：说出动物住在什么地方\nD：尝试拼搭/绘制动物之家\nE：介绍自己帮助的动物\nR：回顾不同动物喜欢的环境',
  },
  {
    id: 'kp-yey-002',
    name: '分类小卫士',
    displayName: '环保分类小卫士｜不同的垃圾该去哪儿',
    grade: '幼儿园',
    category: '科普',
    intro: '小手分类大不同！边玩边学垃圾分类的小妙招，变身环保小英雄，守护美丽家园。',
    wilderFocus: { primary: ['W', 'I'], secondary: ['L'], weights: { W: 0.8, I: 0.7, L: 0.6, D: 0.5, E: 0.5, R: 0.4 } },
  },
  {
    id: 'kp-yey-003',
    name: '花朵的秘密',
    displayName: '花朵色彩观察点｜花瓣颜色有什么特别',
    grade: '幼儿园',
    category: '科普',
    intro: '花儿为什么颜色各异、香气扑鼻？和伙伴一起探索花瓣形状与色彩，动手种出专属小花。',
    wilderFocus: { primary: ['W', 'I'], secondary: ['D'], weights: { W: 0.9, I: 0.8, L: 0.4, D: 0.6, E: 0.5, R: 0.3 } },
  },
  {
    id: 'kp-yey-004',
    name: '彩虹泡泡制造者',
    displayName: '彩虹泡泡制造者｜泡泡为什么是五颜六色的',
    grade: '幼儿园',
    category: '科普',
    intro: '五颜六色的泡泡从哪儿来？通过"泡泡作画"发现光与空气的奇妙，用彩虹泡泡装点童年。',
    wilderFocus: { primary: ['W', 'I'], secondary: ['D', 'E'], weights: { W: 0.95, I: 0.7, L: 0.5, D: 0.6, E: 0.7, R: 0.3 } },
  },
  // 一二年级
  {
    id: 'kp-g12-001',
    name: '小小气象员',
    displayName: '小小气象员｜天气变化有哪些线索',
    grade: '一年级',
    category: '科普',
    intro: '今天的天气会变脸吗？建立自己的天气观察表，学做"天气播报"，体验当个专业"气象员"。',
    wilderFocus: { primary: ['W', 'I'], secondary: ['E', 'R'], weights: { W: 0.8, I: 0.85, L: 0.4, D: 0.5, E: 0.7, R: 0.6 } },
  },
  {
    id: 'kp-g12-002',
    name: '身体大侦探',
    displayName: '身体探秘研究｜我们的身体是如何运作的',
    grade: '一年级',
    category: '科普',
    intro: '我们的身体里藏着哪些秘密？测心跳、听呼吸、观察关节，让孩子当次"人体大侦探"！',
    wilderFocus: { primary: ['W', 'I'], secondary: ['R'], weights: { W: 0.85, I: 0.9, L: 0.3, D: 0.4, E: 0.5, R: 0.6 } },
  },
  {
    id: 'kp-g12-003',
    name: '谁的脚印',
    displayName: '动物足迹识别｜从脚印知道是谁经过这里',
    grade: '二年级',
    category: '科普',
    intro: '这些脚印是谁留下的？通过观察与比对，学习如何用脚印识别动物、推测它们的活动轨迹！',
    wilderFocus: { primary: ['W', 'I'], secondary: ['L'], weights: { W: 0.9, I: 0.85, L: 0.6, D: 0.5, E: 0.4, R: 0.5 } },
  },
  // 三四年级
  {
    id: 'kp-g34-001',
    name: '植物的秘密武器',
    displayName: '植物自我保护｜植物有哪些神奇的防御方式',
    grade: '三年级',
    category: '科普',
    intro: '没有腿不能逃跑的植物，是怎么保护自己的？探索刺、毒、气味、伪装等神奇策略！',
    wilderFocus: { primary: ['W', 'I'], secondary: ['L', 'R'], weights: { W: 0.85, I: 0.9, L: 0.7, D: 0.4, E: 0.5, R: 0.6 } },
  },
  {
    id: 'kp-g34-002',
    name: '昆虫微观世界',
    displayName: '昆虫微观世界｜用放大镜发现小小生命的大秘密',
    grade: '四年级',
    category: '科普',
    intro: '一只蚂蚁的身体有多少节？蝴蝶翅膀上的鳞片长什么样？用放大镜打开微观宇宙！',
    wilderFocus: { primary: ['I', 'W'], secondary: ['R', 'D'], weights: { W: 0.8, I: 0.95, L: 0.4, D: 0.6, E: 0.5, R: 0.7 } },
  },
  // 五六年级
  {
    id: 'kp-g56-001',
    name: '生态系统探秘',
    displayName: '生态系统探秘｜食物链中谁吃谁',
    grade: '五年级',
    category: '科普',
    intro: '从一片叶子到一只老鹰，能量是怎样传递的？建立你自己的生态系统模型！',
    wilderFocus: { primary: ['I', 'L'], secondary: ['R', 'D'], weights: { W: 0.7, I: 0.95, L: 0.85, D: 0.7, E: 0.6, R: 0.8 } },
  },
  {
    id: 'kp-g56-002',
    name: '科学实验设计师',
    displayName: '科学实验设计师｜如何设计一个严谨的实验',
    grade: '六年级',
    category: '科普',
    intro: '从假设到验证，学习控制变量、设计对照组，像真正的科学家一样思考和实验！',
    wilderFocus: { primary: ['I', 'D'], secondary: ['R'], weights: { W: 0.6, I: 0.98, L: 0.5, D: 0.9, E: 0.6, R: 0.85 } },
  },

  // ========== 科创课程（周末PBL） ==========
  {
    id: 'kc-l0-001',
    name: '自然自画像',
    displayName: '森林里的我｜用自然拼出属于你的自画像',
    grade: 'L0',
    category: '科创',
    intro: '你能用自然界的材料拼出"森林里的自己"吗？通过色彩、质地与形态表达自我个性，拼贴头像并进行个性化讲述。',
    wilderFocus: { primary: ['D', 'E'], secondary: ['W', 'L'], weights: { W: 0.7, I: 0.5, L: 0.6, D: 0.9, E: 0.85, R: 0.5 } },
  },
  {
    id: 'kc-l0-002',
    name: '纹理探险家',
    displayName: '自然拓印场｜开启一场纹理采集与艺术创作之旅',
    grade: 'L0',
    category: '科创',
    intro: '树皮的裂纹、石头的纹路、叶片的脉络，都是自然的"密码"，采集并观察这些纹理，完成《自然纹理故事画》。',
    wilderFocus: { primary: ['W', 'D'], secondary: ['I', 'E'], weights: { W: 0.85, I: 0.7, L: 0.5, D: 0.9, E: 0.75, R: 0.4 } },
  },
  {
    id: 'kc-l1-001',
    name: '弹弓工程室',
    displayName: '弹弓工程室｜打造安全射击装置',
    grade: 'L1',
    category: '科创',
    intro: '一根树枝也能变成一把远程发射装置？观察弹性原理，设计安全可控的简易弹弓，挑战射程与精准度。',
    wilderFocus: { primary: ['D', 'I'], secondary: ['R'], weights: { W: 0.7, I: 0.85, L: 0.5, D: 0.95, E: 0.6, R: 0.7 } },
  },
  {
    id: 'kc-l1-002',
    name: '杠杆大挑战',
    displayName: '杠杆挑战场｜完成最省力的森林实验',
    grade: 'L1',
    category: '科创',
    intro: '没有工具，你能用树枝撬起比你还重的石头吗？通过调节杠杆长短和支点位置，完成森林中的"最省力实验"。',
    wilderFocus: { primary: ['I', 'D'], secondary: ['R', 'L'], weights: { W: 0.6, I: 0.9, L: 0.6, D: 0.9, E: 0.5, R: 0.75 } },
  },
  {
    id: 'kc-l2-001',
    name: '光影捕手计划',
    displayName: '光影捕手计划｜寻找雨后彩虹的秘密',
    grade: 'L2',
    category: '科创',
    intro: '下雨后的彩虹从哪儿来你知道吗？观察彩虹形成的过程，制作"彩虹捕手"！',
    wilderFocus: { primary: ['I', 'D'], secondary: ['W', 'E'], weights: { W: 0.8, I: 0.9, L: 0.5, D: 0.85, E: 0.7, R: 0.6 } },
  },
  {
    id: 'kc-l2-002',
    name: '森林时钟计划',
    displayName: '森林时钟计划｜建造一座能感知时间的自然装置',
    grade: 'L2',
    category: '科创',
    intro: '自然界中有哪些事物可以显示时间变化？感受时间的变化，了解自然元素与时间联系，最终制作一个森林时钟。',
    wilderFocus: { primary: ['D', 'I'], secondary: ['L', 'R'], weights: { W: 0.7, I: 0.85, L: 0.7, D: 0.95, E: 0.6, R: 0.75 } },
  },
  {
    id: 'kc-l3-001',
    name: '自然风车挑战',
    displayName: '森林风车挑战｜寻找转的最快的自然风车',
    grade: 'L3',
    category: '科创',
    intro: '只用森林中的材料，能不能做出转得最快的风车？探索不同叶片和果实的形态与风阻效果，动手设计最优自然风车模型。',
    wilderFocus: { primary: ['D', 'I'], secondary: ['R', 'E'], weights: { W: 0.6, I: 0.9, L: 0.5, D: 0.95, E: 0.7, R: 0.8 } },
  },
  {
    id: 'kc-l3-002',
    name: '变废为宝创客坊',
    displayName: '资源再生创客坊｜探索废物如何变成宝藏',
    grade: 'L3',
    category: '科创',
    intro: '用过的东西还能做成新作品吗？观察与分类不同类型的"废弃物"，设计一项回收再创作品。',
    wilderFocus: { primary: ['D', 'L'], secondary: ['I', 'E', 'R'], weights: { W: 0.7, I: 0.75, L: 0.85, D: 0.95, E: 0.8, R: 0.7 } },
  },
  {
    id: 'kc-l4-001',
    name: '生态系统工程师',
    displayName: '微型生态系统工程师｜设计一个自给自足的小世界',
    grade: 'L4',
    category: '科创',
    intro: '如何在一个玻璃瓶里创造一个能自己运转的微型世界？设计、搭建、观察、迭代你的生态缸！',
    wilderFocus: { primary: ['D', 'I', 'R'], secondary: ['L'], weights: { W: 0.7, I: 0.95, L: 0.75, D: 0.98, E: 0.6, R: 0.9 } },
  },
  {
    id: 'kc-l4-002',
    name: '科学论文写作营',
    displayName: '小小科学家论文营｜像科学家一样撰写研究报告',
    grade: 'L4',
    category: '科创',
    intro: '从选题、假设、实验设计到数据分析、撰写报告，完整体验科研全流程，产出你的第一篇科学小论文！',
    wilderFocus: { primary: ['I', 'R', 'E'], secondary: ['D'], weights: { W: 0.5, I: 0.98, L: 0.6, D: 0.85, E: 0.9, R: 0.95 } },
  },

  // ========== 科考课程（寒暑假营地） ==========
  {
    id: 'kk-summer-001',
    name: '西双版纳热带雨林科考',
    displayName: '热带雨林探秘｜西双版纳生物多样性科考营',
    grade: '通用',
    category: '科考',
    intro: '深入热带雨林腹地，观察亚洲象、长臂猿等珍稀动物，记录热带植物的生存智慧，完成一份雨林生态调查报告。',
    wilderFocus: { primary: ['I', 'R'], secondary: ['W', 'L', 'E'], weights: { W: 0.85, I: 0.98, L: 0.75, D: 0.6, E: 0.8, R: 0.95 } },
    season: '夏季',
    duration: '7天6夜',
  },
  {
    id: 'kk-summer-002',
    name: '神农架原始森林科考',
    displayName: '神农秘境探险｜神农架原始森林生态科考营',
    grade: '通用',
    category: '科考',
    intro: '探访神秘的神农架原始森林，追踪金丝猴踪迹，调查高山草甸生态系统，揭开"野人"传说背后的科学真相。',
    wilderFocus: { primary: ['I', 'R'], secondary: ['W', 'L'], weights: { W: 0.9, I: 0.95, L: 0.7, D: 0.5, E: 0.7, R: 0.9 } },
    season: '夏季',
    duration: '6天5夜',
  },
  {
    id: 'kk-summer-003',
    name: '青海湖候鸟迁徙科考',
    displayName: '候鸟追踪者｜青海湖鸟类迁徙科考营',
    grade: '通用',
    category: '科考',
    intro: '在中国最大的咸水湖畔观测斑头雁、鸬鹚等候鸟，学习鸟类环志技术，记录候鸟迁徙路线数据。',
    wilderFocus: { primary: ['I', 'R'], secondary: ['L', 'E'], weights: { W: 0.8, I: 0.95, L: 0.8, D: 0.5, E: 0.75, R: 0.9 } },
    season: '夏季',
    duration: '5天4夜',
  },
  {
    id: 'kk-winter-001',
    name: '莽山冬季生态科考',
    displayName: '莽山冬韵｜冬季森林生态系统科考营',
    grade: '通用',
    category: '科考',
    intro: '探索冬季森林的静谧之美，观察动物过冬策略，调查常绿与落叶树种分布规律，完成冬季生态调查报告。',
    wilderFocus: { primary: ['I', 'R'], secondary: ['W', 'L'], weights: { W: 0.85, I: 0.95, L: 0.7, D: 0.5, E: 0.7, R: 0.92 } },
    season: '冬季',
    duration: '5天4夜',
  },
  {
    id: 'kk-winter-002',
    name: '天文观测营',
    displayName: '仰望星空｜冬季天文观测科考营',
    grade: '通用',
    category: '科考',
    intro: '在光污染最少的营地，学习使用天文望远镜，观测冬季星座、月球环形山，记录天体运动规律。',
    wilderFocus: { primary: ['I', 'W'], secondary: ['R', 'E'], weights: { W: 0.95, I: 0.9, L: 0.5, D: 0.6, E: 0.7, R: 0.85 } },
    season: '冬季',
    duration: '4天3夜',
  },
  {
    id: 'kk-intl-001',
    name: '斯里兰卡海洋科考',
    displayName: '印度洋探险｜斯里兰卡海洋生态科考营',
    grade: '通用',
    category: '科考',
    intro: '在印度洋岛国观测蓝鲸、海龟，探索珊瑚礁生态系统，了解海洋保护的紧迫性，完成海洋生态报告。',
    wilderFocus: { primary: ['I', 'R', 'L'], secondary: ['W', 'E'], weights: { W: 0.9, I: 0.95, L: 0.85, D: 0.5, E: 0.8, R: 0.9 } },
    season: '寒假',
    duration: '10天9夜',
  },

  // ========== 附加集训 ==========
  {
    id: 'fx-001',
    name: '自然笔记大师班',
    displayName: '自然笔记大师班｜用画笔记录自然的美',
    grade: '通用',
    category: '附加集训',
    intro: '学习科学绘图技法，从速写到精绘，记录植物、昆虫、鸟类的形态细节，产出专业的自然笔记作品集。',
    wilderFocus: { primary: ['I', 'D'], secondary: ['R', 'E'], weights: { W: 0.7, I: 0.85, L: 0.4, D: 0.9, E: 0.75, R: 0.8 } },
  },
  {
    id: 'fx-002',
    name: '科学演讲训练营',
    displayName: '科学演讲训练营｜成为自信的科学传播者',
    grade: '通用',
    category: '附加集训',
    intro: '学习科学传播技巧，从构思到演讲，让你能把复杂的科学知识用生动的语言讲给任何人听！',
    wilderFocus: { primary: ['E', 'I'], secondary: ['L', 'R'], weights: { W: 0.6, I: 0.8, L: 0.75, D: 0.5, E: 0.98, R: 0.7 } },
  },
  {
    id: 'fx-003',
    name: '生态摄影入门',
    displayName: '生态摄影入门｜用镜头捕捉自然之美',
    grade: '通用',
    category: '附加集训',
    intro: '学习生态摄影基础技法，微距、长焦、光影运用，记录动植物最美的瞬间。',
    wilderFocus: { primary: ['I', 'D'], secondary: ['W', 'R'], weights: { W: 0.85, I: 0.85, L: 0.4, D: 0.8, E: 0.6, R: 0.7 } },
  },
  {
    id: 'fx-004',
    name: '科创竞赛冲刺班',
    displayName: '科创竞赛冲刺班｜备战青少年科技创新大赛',
    grade: '通用',
    category: '附加集训',
    intro: '针对青少年科技创新大赛、环保创意大赛等，系统提升选题、实验设计、报告撰写、答辩技巧。',
    wilderFocus: { primary: ['I', 'D', 'E'], secondary: ['R'], weights: { W: 0.5, I: 0.95, L: 0.6, D: 0.9, E: 0.9, R: 0.85 } },
  },
]

// ==================== 推荐算法核心 ====================

/**
 * 解析WILDER分数并识别优势/弱势维度
 */
export function analyzeWilderScores(scores: Record<string, number>): {
  topDims: string[]
  bottomDims: string[]
  avgScore: number
  scoreProfile: 'high-all' | 'low-all' | 'balanced' | 'polarized'
} {
  const dims = ['W', 'I', 'L', 'D', 'E', 'R']
  const sorted = dims.sort((a, b) => (scores[b] || 0) - (scores[a] || 0))
  const values = dims.map(d => scores[d] || 0)
  const avg = values.reduce((s, v) => s + v, 0) / 6
  const max = Math.max(...values)
  const min = Math.min(...values)
  
  let profile: 'high-all' | 'low-all' | 'balanced' | 'polarized' = 'balanced'
  if (avg > 75 && min > 65) profile = 'high-all'
  else if (avg < 50 && max < 60) profile = 'low-all'
  else if (max - min > 30) profile = 'polarized'
  
  return {
    topDims: sorted.slice(0, 2),
    bottomDims: sorted.slice(-2),
    avgScore: avg,
    scoreProfile: profile,
  }
}

/**
 * 计算课程与学生WILDER分数的匹配度
 */
function calculateMatchScore(
  course: Course,
  studentScores: Record<string, number>,
  studentAge: number,
  subDirection?: 'alpha' | 'beta'
): { score: number; reasons: string[] } {
  const reasons: string[] = []
  let score = 0
  
  const { topDims, bottomDims, scoreProfile } = analyzeWilderScores(studentScores)
  const weights = course.wilderFocus.weights
  
  // 1. 优势维度匹配 (40分)
  const primaryMatch = course.wilderFocus.primary.filter(d => topDims.includes(d))
  if (primaryMatch.length > 0) {
    const bonus = primaryMatch.length * 20
    score += bonus
    const dimNames = primaryMatch.map(d => WILDER_CONFIG[d as keyof typeof WILDER_CONFIG].name)
    reasons.push(`发挥${dimNames.join('/')}优势`)
  }
  
  // 2. 弱势维度培养 (30分)
  const secondaryMatch = course.wilderFocus.secondary.filter(d => bottomDims.includes(d))
  if (secondaryMatch.length > 0) {
    const bonus = secondaryMatch.length * 15
    score += bonus
    const dimNames = secondaryMatch.map(d => WILDER_CONFIG[d as keyof typeof WILDER_CONFIG].name)
    reasons.push(`提升${dimNames.join('/')}能力`)
  }
  
  // 3. 整体匹配度 (20分) - 基于权重向量相似度
  let weightedSum = 0
  let totalWeight = 0
  for (const dim of Object.keys(weights)) {
    const w = weights[dim] || 0
    const s = (studentScores[dim] || 50) / 100
    weightedSum += w * s
    totalWeight += w
  }
  const alignmentScore = totalWeight > 0 ? (weightedSum / totalWeight) * 20 : 10
  score += alignmentScore
  
  // 4. 年龄/年级匹配 (10分)
  const courseLevel = GRADE_LEVEL_MAP[course.grade] ?? 3
  const studentLevel = Math.floor((studentAge - 6) / 1) // 简化：年龄-6作为年级
  const levelDiff = Math.abs(courseLevel - studentLevel)
  if (levelDiff === 0) {
    score += 10
    reasons.push('年级完全匹配')
  } else if (levelDiff <= 1) {
    score += 7
  } else if (levelDiff <= 2) {
    score += 4
  }
  
  // 5. 特殊情况加成
  if (scoreProfile === 'polarized' && primaryMatch.length > 0) {
    score += 5
    reasons.push('发挥潜能特长')
  }
  if (scoreProfile === 'balanced' && course.category === '科普') {
    score += 3
    reasons.push('均衡探索各领域')
  }

  // 6. 60分型子方向匹配加成 (最多+8分)
  if (subDirection) {
    if (subDirection === 'alpha') {
      // alpha方向：偏分析/探索/深度型课程
      if ((weights['I'] || 0) >= 0.85 || (weights['D'] || 0) >= 0.85) {
        score += 4
        reasons.push('alpha方向：适合结构化深度探究')
      }
      if ((weights['R'] || 0) >= 0.7) {
        score += 4
        reasons.push('alpha方向：匹配独立反思型学习')
      }
    } else {
      // beta方向：偏协作/表达/社交型课程
      if ((weights['L'] || 0) >= 0.7 || (weights['E'] || 0) >= 0.7) {
        score += 4
        reasons.push('beta方向：丰富的团队互动体验')
      }
      if (course.category === '科考') {
        score += 4
        reasons.push('beta方向：户外协作场景丰富')
      }
    }
  }
  
  return { score: Math.min(100, Math.round(score)), reasons }
}

/**
 * 根据WILDER分数推荐课程
 */
export function recommendCourses(
  wilderScores: Record<string, number>,
  studentAge: number,
  _studentGrade?: string,  // 保留用于未来年级精确匹配
  options?: {
    preferredCategories?: string[]
    excludeIds?: string[]
    maxResults?: number
    subDirection?: 'alpha' | 'beta'
  }
): RecommendationResult {
  const { preferredCategories, excludeIds = [], subDirection } = options || {}
  
  // 过滤并计算匹配度
  const scored: RecommendedCourse[] = COURSE_DATABASE
    .filter(c => !excludeIds.includes(c.id))
    .filter(c => !preferredCategories || preferredCategories.includes(c.category))
    .map(course => {
      const { score, reasons } = calculateMatchScore(course, wilderScores, studentAge, subDirection)
      return {
        course,
        matchScore: score,
        matchReasons: reasons,
        priorityTag: score >= 80 ? '强烈推荐' as const : score >= 60 ? '推荐' as const : '适合' as const,
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
  
  // 分类整理
  const byCategory = {
    科普: scored.filter(r => r.course.category === '科普').slice(0, 5),
    科创: scored.filter(r => r.course.category === '科创').slice(0, 5),
    科考: scored.filter(r => r.course.category === '科考').slice(0, 5),
    附加集训: scored.filter(r => r.course.category === '附加集训').slice(0, 4),
  }
  
  // 精选TOP3（确保类别多样性）
  const topPicks: RecommendedCourse[] = []
  const categories = ['科普', '科创', '科考'] as const
  for (const cat of categories) {
    const best = byCategory[cat][0]
    if (best && topPicks.length < 3) {
      topPicks.push(best)
    }
  }
  // 补充高分课程
  for (const r of scored) {
    if (topPicks.length >= 3) break
    if (!topPicks.some(t => t.course.id === r.course.id)) {
      topPicks.push(r)
    }
  }
  
  // 生成成长路径建议
  const { topDims, bottomDims, avgScore } = analyzeWilderScores(wilderScores)
  const growthPath = generateGrowthPath(topDims, bottomDims, avgScore, studentAge)
  
  return {
    topPicks,
    byCategory,
    growthPath,
  }
}

/**
 * 生成成长路径建议
 */
function generateGrowthPath(
  topDims: string[],
  bottomDims: string[],
  _avgScore: number,  // 保留用于未来阶段判断
  studentAge: number
): GrowthPathSuggestion {
  const topNames = topDims.map(d => WILDER_CONFIG[d as keyof typeof WILDER_CONFIG].name).join('/')
  const bottomNames = bottomDims.map(d => WILDER_CONFIG[d as keyof typeof WILDER_CONFIG].name).join('/')
  
  let currentStage = '启蒙探索期'
  if (studentAge >= 10) currentStage = '深度探究期'
  else if (studentAge >= 8) currentStage = '能力构建期'
  else if (studentAge >= 6) currentStage = '兴趣激发期'
  
  const suggestedPath = [
    {
      stage: '第一阶段（1-3月）',
      courses: ['科普入门课程'],
      focus: `通过校内科普课激发好奇心，同时发挥${topNames}优势`,
    },
    {
      stage: '第二阶段（4-6月）',
      courses: ['周末科创课程'],
      focus: `在PBL项目中深化${topNames}，同时补强${bottomNames}`,
    },
    {
      stage: '第三阶段（暑假）',
      courses: ['科考营地课程'],
      focus: '通过沉浸式科考体验，实现六维度综合提升',
    },
  ]
  
  return {
    currentStage,
    suggestedPath,
    timeline: '建议周期：6-12个月',
  }
}

/**
 * 根据画像类型获取推荐课程（兼容旧版销售策略面板）
 */
export function getCoursesByProfile(profileKey: string): RecommendedCourse[] {
  // 画像类型到WILDER模式的映射
  const profileWilderMap: Record<string, { high: string[], low: string[] }> = {
    'agile-explorer': { high: ['W', 'I'], low: ['D', 'R'] },
    'deep-thinker': { high: ['I', 'R'], low: ['E', 'L'] },
    'creative-builder': { high: ['D', 'W'], low: ['R', 'L'] },
    'empathic-connector': { high: ['L', 'E'], low: ['I', 'D'] },
    'expressive-performer': { high: ['E', 'W'], low: ['R', 'D'] },
    'reflective-strategist': { high: ['R', 'D'], low: ['W', 'E'] },
    'nature-guardian': { high: ['W', 'L'], low: ['D', 'E'] },
    'balanced-grower': { high: [], low: [] },
    'systematic-researcher': { high: ['I', 'D'], low: ['E', 'L'] },
    'collaborative-explorer': { high: ['I', 'L'], low: ['E', 'D'] },
    'science-communicator': { high: ['I', 'E'], low: ['D', 'L'] },
    'harmony-facilitator': { high: ['L', 'R'], low: ['W', 'D'] },
  }
  
  const pattern = profileWilderMap[profileKey] || { high: [], low: [] }
  
  // 构造模拟分数
  const mockScores: Record<string, number> = { W: 60, I: 60, L: 60, D: 60, E: 60, R: 60 }
  pattern.high.forEach(d => mockScores[d] = 85)
  pattern.low.forEach(d => mockScores[d] = 45)
  
  const result = recommendCourses(mockScores, 9) // 假设9岁
  return [...result.topPicks, ...result.byCategory['科普'].slice(0, 2), ...result.byCategory['科创'].slice(0, 2)]
    .filter((r, i, arr) => arr.findIndex(x => x.course.id === r.course.id) === i)
    .slice(0, 6)
}

// ==================== 工具函数 ====================

export function getWilderConfig() {
  return WILDER_CONFIG
}

export function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    '科普': '校内科学实验课，激发好奇心，建立科学思维基础',
    '科创': '周末户外PBL项目课，培养问题解决和设计能力',
    '科考': '寒暑假营地科考课，深度探究，完整科研体验',
    '附加集训': '专项能力强化课程，针对性提升特定技能',
  }
  return descriptions[category] || ''
}

export function getGradeRange(grade: string): string {
  const ranges: Record<string, string> = {
    '幼儿园': '4-6岁',
    'L0': '5-7岁',
    '一年级': '6-7岁',
    'L1': '6-8岁',
    '二年级': '7-8岁',
    'L2': '7-9岁',
    '三年级': '8-9岁',
    'L3': '8-10岁',
    '四年级': '9-10岁',
    'L4': '9-12岁',
    '五年级': '10-11岁',
    '六年级': '11-12岁',
    '通用': '6-15岁',
  }
  return ranges[grade] || '适龄'
}
