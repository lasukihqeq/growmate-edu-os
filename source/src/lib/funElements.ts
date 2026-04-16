// 趣味性元素库 - 让测试过程更有趣！
// 包含：AI向导个性化语言、奖励徽章、鼓励话语、趣味知识等

// ========== AI向导小荒的个性化表达 ==========
export const AI_PERSONALITY = {
  name: '小荒',
  greetings: {
    morning: ['早上好呀！☀️ 今天元气满满吗？', '新的一天，新的探险！🌅', '美好的早晨，准备好发现新奇了吗？'],
    afternoon: ['下午好！🌤️ 精神还不错吧？', '阳光正好，来场思维冒险！', '下午茶时间到！来点脑力运动？'],
    evening: ['晚上好！🌙 今天过得怎么样？', '夜晚是思考的好时光～', '繁星点点，智慧闪闪！✨'],
  },
  
  // 俏皮的过渡语
  transitions: {
    excited: [
      '哇哦！这个答案太有意思了！🎉',
      '厉害厉害！你的脑回路很独特呢～',
      '有意思！我喜欢你的思考方式！💡',
      '嘿嘿，这个角度很新颖哦！',
    ],
    encouraging: [
      '不错不错，继续保持这个状态！💪',
      '你的思维很活跃呢！',
      '我看到了一颗聪明的小脑袋～🧠',
      '稳扎稳打，很有探索者的风范！',
    ],
    curious: [
      '咦？这个想法挺特别的，说来听听～',
      '有趣！我好奇你是怎么想到的？',
      '独特的视角！能展开说说吗？🔍',
    ],
    playful: [
      '哈哈，你和我想的一样！（或者不一样？😏）',
      '看来我们是"同道中人"呢～',
      '这题你答得比我还快！（开玩笑的啦）',
      '你是不是偷偷看过答案？（当然没有啦～）',
    ],
  },
  
  // 阶段开场白
  stageIntros: {
    warmup: [
      '🔥 好啦，先来热热身！这几道题不计分，随便答～',
      '🔥 轻松一下！这是我们互相认识的环节～',
      '🔥 准备活动开始！放轻松，没有标准答案哦～',
    ],
    wonder: [
      '🔭 接下来，让我们打开好奇心的雷达！',
      '🔭 探险模式启动！看看你的观察力有多敏锐～',
      '🔭 好奇心大爆发时间到！准备好提问了吗？',
    ],
    inquiry: [
      '🔬 逻辑大师登场！让我们用证据说话～',
      '🔬 侦探模式开启！每个答案都要有依据哦～',
      '🔬 思维迷宫来了！别怕，你的大脑会帮你找到出路～',
    ],
    expression: [
      '💡 创意时间！脑洞大开，不设限！',
      '💡 想象力起飞～这里没有"太离谱"的答案！',
      '💡 表达自己的机会来了！大声说出你的想法～',
    ],
    design: [
      '🏕️ 野外挑战！考验你的团队协作和应变能力～',
      '🏕️ 实战演练！假如你是队长，你会怎么做？',
      '🏕️ 荒野生存技能测试！别紧张，这只是假设～',
    ],
    reflection: [
      '🎯 最后冲刺！这几道题考验你的自我认知～',
      '🎯 终极解码！了解自己，才能更好地成长～',
      '🎯 压轴登场！最后几题，展现你的深度思考～',
    ],
  },
  
  // 完成庆祝语
  completions: {
    child: [
      '🎉 太棒啦！{name}小探险家完成了所有关卡！你简直是天才中的天才！（好吧，我可能有点夸张了，但你真的很棒！）',
      '🏆 哇哦！全部通关！{name}，你的表现让小荒我都惊呆了！赶紧去看看你的专属报告吧～',
      '🌟 恭喜恭喜！探险结束啦！{name}，你知道吗？每个答案都在告诉我你是一个多么独特的人！',
    ],
    teen: [
      '🎯 所有任务完成！{name}，你的思维方式给我留下了深刻印象。期待看到你的能力报告！',
      '✅ 挑战结束！{name}，你展现了很棒的逻辑思维和创造力。数据分析中，稍等片刻～',
      '🏅 出色的表现！{name}研究员，你的数据已经收集完毕。让我们看看分析结果会有什么发现！',
    ],
  },
  
  // 等待时的俏皮话
  waitingQuips: [
    '正在思考中...🤔（小荒的CPU在高速运转）',
    '让我想想...💭（假装很认真地分析）',
    '嗯嗯...📝（小荒正在做笔记）',
    '有意思...🔍（发现了一些有趣的东西）',
  ],
}

// ========== 虚拟奖励徽章系统 ==========
export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  category: 'wonder' | 'inquiry' | 'expression' | 'design' | 'reflection' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const BADGES: Badge[] = [
  // 好奇心类
  { id: 'curious_cat', name: '好奇小猫', icon: '🐱', description: '对世界充满好奇！', category: 'wonder', rarity: 'common' },
  { id: 'question_master', name: '问题大王', icon: '❓', description: '提出了超棒的问题！', category: 'wonder', rarity: 'rare' },
  { id: 'eagle_eye', name: '鹰眼观察家', icon: '🦅', description: '观察力超级敏锐！', category: 'wonder', rarity: 'epic' },
  
  // 探究力类
  { id: 'little_detective', name: '小小侦探', icon: '🔍', description: '善于发现线索！', category: 'inquiry', rarity: 'common' },
  { id: 'logic_wizard', name: '逻辑魔法师', icon: '🧙', description: '推理能力超强！', category: 'inquiry', rarity: 'rare' },
  { id: 'scientist', name: '未来科学家', icon: '🔬', description: '展现了科学思维！', category: 'inquiry', rarity: 'epic' },
  
  // 表达力类
  { id: 'storyteller', name: '故事达人', icon: '📚', description: '表达清晰有趣！', category: 'expression', rarity: 'common' },
  { id: 'creative_genius', name: '创意天才', icon: '💡', description: '想法新颖独特！', category: 'expression', rarity: 'rare' },
  { id: 'idea_fountain', name: '点子喷泉', icon: '⛲', description: '源源不断的创意！', category: 'expression', rarity: 'epic' },
  
  // 设计力类
  { id: 'team_player', name: '团队小能手', icon: '🤝', description: '善于合作！', category: 'design', rarity: 'common' },
  { id: 'problem_solver', name: '问题终结者', icon: '🎯', description: '解决问题超厉害！', category: 'design', rarity: 'rare' },
  { id: 'leader', name: '未来领袖', icon: '👑', description: '展现了领导力！', category: 'design', rarity: 'epic' },
  
  // 反思力类
  { id: 'self_aware', name: '自知小达人', icon: '🪞', description: '很了解自己！', category: 'reflection', rarity: 'common' },
  { id: 'growth_mindset', name: '成长型思维', icon: '🌱', description: '相信自己会进步！', category: 'reflection', rarity: 'rare' },
  { id: 'wise_owl', name: '智慧猫头鹰', icon: '🦉', description: '思考深刻有见地！', category: 'reflection', rarity: 'epic' },
  
  // 特殊徽章
  { id: 'speed_demon', name: '闪电侠', icon: '⚡', description: '反应超级快！', category: 'special', rarity: 'rare' },
  { id: 'unique_thinker', name: '独特思想家', icon: '🌈', description: '想法与众不同！', category: 'special', rarity: 'epic' },
  { id: 'full_clear', name: '全关卡通关', icon: '🏆', description: '完成了所有挑战！', category: 'special', rarity: 'legendary' },
  { id: 'explorer_elite', name: '精英探险家', icon: '⭐', description: '表现超越期待！', category: 'special', rarity: 'legendary' },
]

// ========== 趣味知识库（测试间隙穿插）==========
export const FUN_FACTS = {
  science: [
    '💡 你知道吗？蜜蜂跳舞是在告诉同伴花在哪里！',
    '🌍 地球每天都在"变胖"——因为宇宙尘埃不断落下来～',
    '🐙 章鱼有三个心脏！两个给鳃，一个给身体～',
    '🌈 彩虹其实是个完整的圆，只是地平线挡住了下半部分！',
    '🦋 蝴蝶的味觉器官在脚上！它们"踩"一下就知道好不好吃～',
    '⚡ 闪电的温度比太阳表面还要热5倍！',
    '🧠 你的大脑产生的电力可以点亮一个小灯泡！',
    '🌊 海洋里95%的区域人类还没有探索过！',
  ],
  thinking: [
    '🧩 爱因斯坦小时候被老师认为"脑子不好使"！',
    '💭 做梦的时候，大脑比清醒时还要活跃！',
    '🎮 玩游戏其实可以锻炼反应速度和决策能力～',
    '📚 多读书的人平均寿命更长哦！',
    '✍️ 写字可以帮助记忆，比打字效果好～',
    '🎵 听音乐学习，效率因人而异，你可以试试看！',
  ],
  nature: [
    '🐘 大象是唯一不能跳跃的哺乳动物！',
    '🦔 刺猬天生对很多毒素免疫！',
    '🌻 向日葵的花盘每天都会跟着太阳转动～',
    '🐧 企鹅求婚会送"鹅卵石"当礼物！',
    '🦜 鹦鹉是唯一能"学舌"的鸟类～',
    '🌲 世界上最古老的树有5000多岁了！',
  ],
}

// ========== 鼓励性语言库 ==========
export const ENCOURAGEMENTS = {
  // 答题后的即时反馈
  instant: {
    correct: [
      '漂亮！✨',
      '答得好！👍',
      '厉害！💪',
      'Nice！🎯',
      '不错哦～',
      '很棒！',
    ],
    thinking: [
      '有意思的想法！',
      '独特的角度！',
      '这个思路很好～',
      '我喜欢这个答案！',
      '很有创意！',
    ],
    effort: [
      '认真思考的样子很帅！',
      '不管答案如何，勇于尝试就是赢家！',
      '每一次思考都是成长～',
      '答案不重要，过程最珍贵！',
    ],
  },
  
  // 阶段完成的庆祝
  stageClear: [
    '🎉 关卡通过！你太厉害啦！',
    '✅ 这一关稳稳拿下！继续加油！',
    '🌟 完美通关！下一关更精彩～',
    '🏅 漂亮！这一关你展现了超强实力！',
  ],
  
  // 最终完成的总结
  final: [
    '你展现了独特的思维方式！',
    '每个答案都很精彩！',
    '今天的表现让我印象深刻！',
    '你的潜力无限！',
    '期待看到你的成长！',
  ],
}

// ========== 进度里程碑 ==========
export const MILESTONES = [
  { percent: 25, message: '🚀 已完成25%！好的开始是成功的一半～', reward: '获得"开局顺利"成就！' },
  { percent: 50, message: '⭐ 一半啦！中场休息一下？（开玩笑的，继续！）', reward: '解锁"坚持不懈"徽章！' },
  { percent: 75, message: '🔥 75%了！胜利就在眼前！', reward: '获得"冲刺达人"称号！' },
  { percent: 100, message: '🏆 100%！你是最棒的探险家！', reward: '解锁"全关卡通关"传说徽章！' },
]

// ========== 辅助函数 ==========

// 获取当前时段的问候语
export function getTimeGreeting(): string {
  const hour = new Date().getHours()
  const greetings = AI_PERSONALITY.greetings
  if (hour >= 5 && hour < 12) return greetings.morning[Math.floor(Math.random() * greetings.morning.length)]
  if (hour >= 12 && hour < 18) return greetings.afternoon[Math.floor(Math.random() * greetings.afternoon.length)]
  return greetings.evening[Math.floor(Math.random() * greetings.evening.length)]
}

// 获取随机过渡语
export function getRandomTransition(type: keyof typeof AI_PERSONALITY.transitions): string {
  const transitions = AI_PERSONALITY.transitions[type]
  return transitions[Math.floor(Math.random() * transitions.length)]
}

// 获取随机阶段开场白
export function getStageIntro(stage: keyof typeof AI_PERSONALITY.stageIntros): string {
  const intros = AI_PERSONALITY.stageIntros[stage]
  return intros[Math.floor(Math.random() * intros.length)]
}

// 获取随机趣味知识
export function getRandomFunFact(): string {
  const allFacts = [...FUN_FACTS.science, ...FUN_FACTS.thinking, ...FUN_FACTS.nature]
  return allFacts[Math.floor(Math.random() * allFacts.length)]
}

// 获取随机鼓励语
export function getRandomEncouragement(type: keyof typeof ENCOURAGEMENTS.instant): string {
  const encouragements = ENCOURAGEMENTS.instant[type]
  return encouragements[Math.floor(Math.random() * encouragements.length)]
}

// 获取里程碑信息
export function getMilestone(percent: number): typeof MILESTONES[0] | null {
  return MILESTONES.find(m => m.percent === percent) || null
}

// 获取完成语
export function getCompletionMessage(name: string, isChild: boolean): string {
  const messages = isChild ? AI_PERSONALITY.completions.child : AI_PERSONALITY.completions.teen
  return messages[Math.floor(Math.random() * messages.length)].replace('{name}', name)
}

// ========== XP 经验值 / 等级系统 ==========
export interface XPLevel {
  level: number
  title: string
  icon: string
  minXP: number
}

export const XP_LEVELS: XPLevel[] = [
  { level: 1, title: '好奇种子', icon: '🌱', minXP: 0 },
  { level: 2, title: '探索萌芽', icon: '🌿', minXP: 30 },
  { level: 3, title: '知识树苗', icon: '🌲', minXP: 80 },
  { level: 4, title: '智慧之树', icon: '🌳', minXP: 150 },
  { level: 5, title: '星辰探索者', icon: '⭐', minXP: 250 },
  { level: 6, title: '传说科学家', icon: '🏆', minXP: 400 },
]

/** 每答一题的基础XP */
export const BASE_XP_PER_QUESTION = 15

/** 连击加成倍率表 */
export const COMBO_MULTIPLIERS: Record<number, number> = {
  0: 1,
  1: 1,
  2: 1.2,
  3: 1.5,
  4: 1.8,
  5: 2.0,
}

/** 根据当前XP计算等级 */
export function getXPLevel(xp: number): XPLevel {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].minXP) return XP_LEVELS[i]
  }
  return XP_LEVELS[0]
}

/** 计算到下一级所需XP */
export function getXPToNextLevel(xp: number): { current: number; needed: number; progress: number } {
  const currentLevel = getXPLevel(xp)
  const nextLevelIdx = XP_LEVELS.findIndex(l => l.level === currentLevel.level) + 1
  if (nextLevelIdx >= XP_LEVELS.length) {
    return { current: xp, needed: xp, progress: 1 }
  }
  const nextLevel = XP_LEVELS[nextLevelIdx]
  const current = xp - currentLevel.minXP
  const needed = nextLevel.minXP - currentLevel.minXP
  return { current, needed, progress: needed > 0 ? current / needed : 1 }
}

/** 根据连击数获取倍率 */
export function getComboMultiplier(combo: number): number {
  return COMBO_MULTIPLIERS[Math.min(combo, 5)] ?? 2.0
}

/** 根据答题阶段返回应解锁的徽章ID */
export function getStageBadgeId(stageIdx: number): string | null {
  const stageBadgeMap: Record<number, string> = {
    0: 'curious_cat',      // 热身完成
    1: 'question_master',  // 好奇心
    2: 'logic_wizard',     // 思维
    3: 'creative_genius',  // 创意
    4: 'problem_solver',   // 荒野
    5: 'wise_owl',         // 终极
  }
  return stageBadgeMap[stageIdx] ?? null
}

// ========== 星座风格趣味元素（报告展示用）==========
// ⚠️ 重要说明：以下内容为趣味性补充元素，非科学评估结论
// 仅用于增加报告的趣味性和可读性，不作为教育决策依据

/** 趣味元素免责声明 - 在报告中展示时必须附带 */
export const FUN_ELEMENTS_DISCLAIMER = {
  title: '🎭 趣味彩蛋',
  subtitle: '以下内容为趣味性补充，非科学评估',
  description: '潜能星象是根据您孩子的WILDER测评结果，以趣味方式呈现的个性化标签。这些元素（如幸运色、幸运数字等）仅供娱乐参考，不代表科学结论，不应作为教育决策的依据。',
  scientificNote: '科学评估结论请参阅报告正文中的"WILDER六维分析"和"证据链"部分。'
}

/** 趣味元素类别标记 */
export type FunElementCategory = 'entertainment' | 'inspiration' | 'analogy'

// 潜能星象：每种潜能类型对应的"星座"式标签
// ⚠️ 这是趣味性类比，非科学分类
export interface TalentConstellation {
  name: string           // 星象名称
  symbol: string         // 象征符号
  element: string        // 元素属性（趣味类比，非科学分类）
  motto: string          // 座右铭
  luckyColor: string     // 幸运色（趣味元素）
  luckyNumber: number    // 幸运数字（趣味元素）
  luckyItem: string      // 幸运物品（趣味元素）
  celebrities: string[]  // 同类型名人（启发性参考）
  superpower: string     // "超能力"（优势的趣味表达）
  kryptonite: string     // "成长空间"（原为克星，更改为积极表达）
  compatibleTypes: string[]  // 协作建议类型
  challengeTypes: string[]   // 互补搭档类型
  seasonalAdvice: string // 季节性建议（趣味参考）
  /** 标记此为趣味元素，非科学评估（可选） */
  _isFunElement?: true
  /** 元素类别（可选） */
  _category?: FunElementCategory
}

// 30种潜能类型的星象映射
export const TALENT_CONSTELLATIONS: Record<string, TalentConstellation> = {
  // ========== 探究主导型 (D-开头) ==========
  'D-WI': {
    name: '星辰探索者',
    symbol: '🌟',
    element: '光',
    motto: '我探索，故我在',
    luckyColor: '星空蓝',
    luckyNumber: 7,
    luckyItem: '望远镜',
    celebrities: ['爱因斯坦', '霍金', '玛丽·居里', '达尔文'],
    superpower: '能在混沌中发现规律',
    kryptonite: '重复性任务会消耗能量',
    compatibleTypes: ['D-ID', 'S-WI', 'D-WD'],
    challengeTypes: ['B-LD', 'B-LE'],
    seasonalAdvice: '春季是你灵感爆发的高峰期，多接触自然会激发更多好奇心',
  },
  'D-WD': {
    name: '创世建筑师',
    symbol: '🏛️',
    element: '土',
    motto: '从想法到现实，只差一个计划',
    luckyColor: '琥珀金',
    luckyNumber: 8,
    luckyItem: '蓝图本',
    celebrities: ['达芬奇', '乔布斯', '扎哈·哈迪德', '詹姆斯·戴森'],
    superpower: '能把最疯狂的想法变成现实',
    kryptonite: '完美主义可能导致无法完成',
    compatibleTypes: ['D-ID', 'D-DE', 'S-WD'],
    challengeTypes: ['B-LR', 'S-ER'],
    seasonalAdvice: '秋季是你收获成果的季节，之前播下的创意种子会结出果实',
  },
  'D-WE': {
    name: '故事织梦者',
    symbol: '📖',
    element: '风',
    motto: '每个发现都值得被世界知道',
    luckyColor: '极光紫',
    luckyNumber: 3,
    luckyItem: '笔记本',
    celebrities: ['卡尔·萨根', '大卫·爱登堡', '科普作家比尔·奈', '罗翔'],
    superpower: '能把复杂变简单，把枯燥变有趣',
    kryptonite: '可能在表达时跑题太远',
    compatibleTypes: ['D-IE', 'S-WE', 'D-LE'],
    challengeTypes: ['S-IR', 'B-DR'],
    seasonalAdvice: '夏季是你表达欲最旺盛的时候，多参加分享活动',
  },
  'D-WL': {
    name: '探险伙伴家',
    symbol: '🧭',
    element: '水',
    motto: '一个人走得快，一群人走得远',
    luckyColor: '海洋蓝',
    luckyNumber: 6,
    luckyItem: '指南针',
    celebrities: ['珍·古道尔', '斯坦·李', '腾讯马化腾', '雷军'],
    superpower: '能把独自的探索变成团队的冒险',
    kryptonite: '可能过于依赖团队认可',
    compatibleTypes: ['D-IL', 'S-WL', 'D-LD'],
    challengeTypes: ['S-IR', 'D-WR'],
    seasonalAdvice: '冬季适合和志同道合的朋友一起做项目',
  },
  'D-WR': {
    name: '智慧炼金师',
    symbol: '⚗️',
    element: '火',
    motto: '每次探索都是一次自我进化',
    luckyColor: '熔岩橙',
    luckyNumber: 9,
    luckyItem: '日记本',
    celebrities: ['理查德·费曼', '查理·芒格', '王阳明', '曾国藩'],
    superpower: '能从每次经历中提取黄金般的智慧',
    kryptonite: '可能过度自我分析导致行动迟缓',
    compatibleTypes: ['D-IR', 'S-WR', 'D-DR'],
    challengeTypes: ['B-LE', 'D-WL'],
    seasonalAdvice: '秋冬交替时是你反思沉淀的黄金期',
  },
  'D-ID': {
    name: '精密工程师',
    symbol: '⚙️',
    element: '金',
    motto: '细节决定成败，系统决定高度',
    luckyColor: '钛银灰',
    luckyNumber: 1,
    luckyItem: '精密工具',
    celebrities: ['埃隆·马斯克', '任正非', '詹姆斯·瓦特', '尼古拉·特斯拉'],
    superpower: '能设计出严密无缝的系统',
    kryptonite: '可能忽视情感和人的因素',
    compatibleTypes: ['D-WI', 'D-DR', 'S-ID'],
    challengeTypes: ['B-LE', 'D-WE'],
    seasonalAdvice: '春季适合启动新的工程项目',
  },
  'D-IE': {
    name: '真理传播者',
    symbol: '📡',
    element: '光',
    motto: '让知识的光芒照亮每个角落',
    luckyColor: '智慧蓝',
    luckyNumber: 5,
    luckyItem: '麦克风',
    celebrities: ['TED演讲者', '李永乐老师', '何同学', '毕导'],
    superpower: '能把最深奥的知识讲得人人都懂',
    kryptonite: '可能过于追求完美表达而延误发布',
    compatibleTypes: ['D-WE', 'D-IL', 'S-IE'],
    challengeTypes: ['S-DR', 'B-LR'],
    seasonalAdvice: '夏季是你输出最旺盛的时期',
  },
  'D-IL': {
    name: '知识桥梁师',
    symbol: '🌉',
    element: '木',
    motto: '连接智慧，成就彼此',
    luckyColor: '森林绿',
    luckyNumber: 2,
    luckyItem: '白板',
    celebrities: ['可汗学院创始人', '俞敏洪', '张桂梅', '费曼'],
    superpower: '能让知识在人与人之间流动',
    kryptonite: '可能在帮助他人时忽略自己',
    compatibleTypes: ['D-WL', 'D-IE', 'S-IL'],
    challengeTypes: ['D-WR', 'S-DR'],
    seasonalAdvice: '开学季是你发挥价值的黄金时刻',
  },
  'D-IR': {
    name: '深度学者',
    symbol: '📚',
    element: '水',
    motto: '学而不思则罔，思而不学则殆',
    luckyColor: '墨玉黑',
    luckyNumber: 4,
    luckyItem: '古籍',
    celebrities: ['牛顿', '康德', '陈景润', '张益唐'],
    superpower: '能在知识的海洋中潜入最深处',
    kryptonite: '可能过于沉浸学术而脱离实际',
    compatibleTypes: ['D-WR', 'D-ID', 'S-IR'],
    challengeTypes: ['B-LE', 'D-WL'],
    seasonalAdvice: '冬季是你深度阅读和思考的最佳时节',
  },
  'D-DE': {
    name: '产品创造家',
    symbol: '🎨',
    element: '火',
    motto: '好产品自己会说话',
    luckyColor: '创意橙',
    luckyNumber: 11,
    luckyItem: '原型模型',
    celebrities: ['乔纳森·艾维', '原研哉', '深�的设计师', '陈可辛'],
    superpower: '能创造出让人惊叹的作品并完美呈现',
    kryptonite: '可能过于在意外界评价',
    compatibleTypes: ['D-WD', 'D-LE', 'S-DE'],
    challengeTypes: ['D-IR', 'S-LR'],
    seasonalAdvice: '春夏之交是你创作灵感最丰富的时期',
  },
  'D-DR': {
    name: '卓越匠人',
    symbol: '🔨',
    element: '土',
    motto: '精益求精，止于至善',
    luckyColor: '匠心棕',
    luckyNumber: 10,
    luckyItem: '工匠工具',
    celebrities: ['宫崎骏', '秋山利辉', '故宫文物修复师', '李子柒'],
    superpower: '能把每件作品打磨到极致',
    kryptonite: '可能因追求完美而进度缓慢',
    compatibleTypes: ['D-ID', 'D-WD', 'S-DR'],
    challengeTypes: ['D-WE', 'B-LE'],
    seasonalAdvice: '秋季是你收获成果、精修作品的最佳时期',
  },
  'D-LE': {
    name: '魅力领袖',
    symbol: '👑',
    element: '火',
    motto: '影响力源于真诚的连接',
    luckyColor: '皇室紫',
    luckyNumber: 12,
    luckyItem: '徽章',
    celebrities: ['马云', '奥普拉', '董明珠', 'TED策展人'],
    superpower: '能凝聚人心并激发行动',
    kryptonite: '可能过于在意他人的看法',
    compatibleTypes: ['D-WE', 'D-LD', 'S-LE'],
    challengeTypes: ['D-IR', 'S-WR'],
    seasonalAdvice: '夏季是你社交活动和影响力扩展的高峰期',
  },
  'D-LD': {
    name: '组织架构师',
    symbol: '🏢',
    element: '金',
    motto: '把对的人放在对的位置',
    luckyColor: '领导蓝',
    luckyNumber: 8,
    luckyItem: '组织架构图',
    celebrities: ['杰克·韦尔奇', '任正非', '稻盛和夫', '张一鸣'],
    superpower: '能让团队运转如精密机器',
    kryptonite: '可能忽视个体的情感需求',
    compatibleTypes: ['D-WL', 'D-DE', 'S-LD'],
    challengeTypes: ['D-WR', 'S-ER'],
    seasonalAdvice: '新年伊始是你规划团队架构的最佳时机',
  },
  'D-LR': {
    name: '心灵导师',
    symbol: '🧘',
    element: '水',
    motto: '理解他人，先理解自己',
    luckyColor: '禅意青',
    luckyNumber: 6,
    luckyItem: '冥想垫',
    celebrities: ['弗洛伊德', '卡尔·罗杰斯', '武志红', '陈海贤'],
    superpower: '能看透人心并给予智慧指引',
    kryptonite: '可能过度共情而消耗自己',
    compatibleTypes: ['D-WR', 'D-IL', 'S-LR'],
    challengeTypes: ['D-ID', 'D-DE'],
    seasonalAdvice: '秋冬季节是你深度陪伴他人的温暖时刻',
  },
  'D-ER': {
    name: '演说哲人',
    symbol: '🎭',
    element: '风',
    motto: '言为心声，行为己任',
    luckyColor: '思想金',
    luckyNumber: 7,
    luckyItem: '演讲稿',
    celebrities: ['苏格拉底', '马丁·路德·金', '乔布斯', 'TED演讲者'],
    superpower: '能用语言触动心灵并启发改变',
    kryptonite: '可能过于追求表达的完美',
    compatibleTypes: ['D-IE', 'D-WE', 'S-ER'],
    challengeTypes: ['D-ID', 'S-LD'],
    seasonalAdvice: '春季是你演讲和公开表达的最佳时机',
  },

  // ========== 稳健发展型 (S-开头) ==========
  'S-WI': {
    name: '稳健探索者',
    symbol: '🔭',
    element: '土',
    motto: '稳扎稳打，步步为营',
    luckyColor: '大地褐',
    luckyNumber: 4,
    luckyItem: '放大镜',
    celebrities: ['法拉第', '门捷列夫', '屠呦呦', '袁隆平'],
    superpower: '能在长期观察中发现他人忽略的规律',
    kryptonite: '可能因过于谨慎而错过机会',
    compatibleTypes: ['D-WI', 'S-ID', 'S-WD'],
    challengeTypes: ['D-LE', 'D-WE'],
    seasonalAdvice: '四季更替时做观察记录，能发现最多规律',
  },
  'S-WD': {
    name: '实干创造者',
    symbol: '🛠️',
    element: '金',
    motto: '千里之行，始于足下',
    luckyColor: '工匠银',
    luckyNumber: 5,
    luckyItem: '瑞士军刀',
    celebrities: ['本杰明·富兰克林', '莱特兄弟', '华为余承东', '董明珠'],
    superpower: '能把创意落地为可靠的产品',
    kryptonite: '可能过于务实而缺乏突破',
    compatibleTypes: ['D-WD', 'S-ID', 'S-DR'],
    challengeTypes: ['D-WE', 'D-LE'],
    seasonalAdvice: '秋季收获时节，你的务实特质最能发挥价值',
  },
  'S-WE': {
    name: '温和传播者',
    symbol: '🌸',
    element: '木',
    motto: '润物细无声',
    luckyColor: '樱花粉',
    luckyNumber: 3,
    luckyItem: '绘本',
    celebrities: ['蒙台梭利', '窦桂梅', '绘本作家', '自然纪录片解说'],
    superpower: '能用温和的方式传递深刻的道理',
    kryptonite: '可能过于低调而被忽视',
    compatibleTypes: ['D-WE', 'S-IE', 'S-IL'],
    challengeTypes: ['D-LE', 'D-DE'],
    seasonalAdvice: '春季万物复苏时，你的温和表达最能打动人心',
  },
  'S-ID': {
    name: '精细工匠',
    symbol: '🔩',
    element: '金',
    motto: '工欲善其事，必先利其器',
    luckyColor: '精钢灰',
    luckyNumber: 1,
    luckyItem: '卡尺',
    celebrities: ['瑞士钟表匠', '故宫修复师', '芯片工程师', '外科医生'],
    superpower: '能在细节上做到极致精准',
    kryptonite: '可能过于关注细节而忽视全局',
    compatibleTypes: ['D-ID', 'S-WI', 'S-DR'],
    challengeTypes: ['D-WE', 'D-LE'],
    seasonalAdvice: '冬季静心时刻，最适合你做精细的工作',
  },
  'S-IE': {
    name: '耐心讲解者',
    symbol: '📝',
    element: '水',
    motto: '教学相长，诲人不倦',
    luckyColor: '知识蓝',
    luckyNumber: 2,
    luckyItem: '教案本',
    celebrities: ['蔡元培', '陶行知', '优秀班主任', '培训讲师'],
    superpower: '能用最适合的方式让每个人都能理解',
    kryptonite: '可能过于耐心而效率偏低',
    compatibleTypes: ['D-IE', 'S-IL', 'S-WE'],
    challengeTypes: ['D-DE', 'D-LE'],
    seasonalAdvice: '开学季和期末是你最能发挥价值的时候',
  },
  'S-IL': {
    name: '默默支持者',
    symbol: '🌿',
    element: '木',
    motto: '甘做绿叶衬红花',
    luckyColor: '常青绿',
    luckyNumber: 6,
    luckyItem: '笔记本',
    celebrities: ['优秀助教', '科研团队核心成员', '幕后英雄'],
    superpower: '能在团队中默默提供关键支持',
    kryptonite: '可能因太低调而得不到应有认可',
    compatibleTypes: ['D-IL', 'S-IE', 'S-LD'],
    challengeTypes: ['D-LE', 'D-DE'],
    seasonalAdvice: '团队攻关时期，你的支持最为关键',
  },
  'S-IR': {
    name: '沉稳思考者',
    symbol: '🪨',
    element: '土',
    motto: '三思而后行',
    luckyColor: '沉稳棕',
    luckyNumber: 4,
    luckyItem: '思考椅',
    celebrities: ['达尔文', '亚当·斯密', '沃伦·巴菲特', '段永平'],
    superpower: '能在深思熟虑后做出最优决策',
    kryptonite: '可能因过度思考而错失时机',
    compatibleTypes: ['D-IR', 'S-WR', 'S-DR'],
    challengeTypes: ['D-WE', 'D-LE'],
    seasonalAdvice: '冬季是你深度思考和复盘的最佳时节',
  },
  'S-DE': {
    name: '稳健设计师',
    symbol: '📐',
    element: '土',
    motto: '好设计经得起时间考验',
    luckyColor: '素雅白',
    luckyNumber: 8,
    luckyItem: '设计尺',
    celebrities: ['无印良品设计师', '建筑大师贝聿铭', '经典产品设计师'],
    superpower: '能创造出经久不衰的经典设计',
    kryptonite: '可能过于保守而缺乏突破',
    compatibleTypes: ['D-DE', 'S-WD', 'S-DR'],
    challengeTypes: ['D-WE', 'D-LE'],
    seasonalAdvice: '换季整理时，你的设计美学最能发挥价值',
  },
  'S-DR': {
    name: '品质守护者',
    symbol: '🛡️',
    element: '金',
    motto: '质量是生命，标准是底线',
    luckyColor: '品质金',
    luckyNumber: 10,
    luckyItem: '检测工具',
    celebrities: ['ISO标准制定者', '质量管理专家', '米其林评审'],
    superpower: '能确保每个细节都达到最高标准',
    kryptonite: '可能因过于严格而与人产生摩擦',
    compatibleTypes: ['D-DR', 'S-ID', 'S-IR'],
    challengeTypes: ['D-WE', 'D-LE'],
    seasonalAdvice: '年终总结时，你的品质意识最能发挥作用',
  },
  'S-LE': {
    name: '温暖联结者',
    symbol: '🤗',
    element: '火',
    motto: '真诚是最好的社交技巧',
    luckyColor: '暖阳橙',
    luckyNumber: 9,
    luckyItem: '相册',
    celebrities: ['优秀HR', '社区组织者', '心灵导师', '班长'],
    superpower: '能让每个人都感受到被重视',
    kryptonite: '可能过于在意维护关系而委屈自己',
    compatibleTypes: ['D-LE', 'S-LR', 'S-IL'],
    challengeTypes: ['D-ID', 'D-IR'],
    seasonalAdvice: '节假日聚会时，你的联结能力最能发挥价值',
  },
  'S-LD': {
    name: '协调执行者',
    symbol: '📋',
    element: '水',
    motto: '执行力就是竞争力',
    luckyColor: '执行蓝',
    luckyNumber: 5,
    luckyItem: '项目表',
    celebrities: ['优秀项目经理', '活动策划师', '班级委员'],
    superpower: '能让计划顺利落地执行',
    kryptonite: '可能过于关注执行而忽视创新',
    compatibleTypes: ['D-LD', 'S-IL', 'S-DE'],
    challengeTypes: ['D-WE', 'D-WR'],
    seasonalAdvice: '开学初和项目启动期，你的协调能力最关键',
  },
  'S-LR': {
    name: '倾听共情者',
    symbol: '👂',
    element: '水',
    motto: '理解是治愈的开始',
    luckyColor: '疗愈青',
    luckyNumber: 7,
    luckyItem: '茶杯',
    celebrities: ['心理咨询师', '生活导师', '知心朋友'],
    superpower: '能让人感到被深度理解和接纳',
    kryptonite: '可能过度吸收他人情绪',
    compatibleTypes: ['D-LR', 'S-LE', 'S-IR'],
    challengeTypes: ['D-ID', 'D-DE'],
    seasonalAdvice: '秋冬季节，你的温暖陪伴最能抚慰人心',
  },
  'S-ER': {
    name: '深思表达者',
    symbol: '✍️',
    element: '风',
    motto: '好文章是改出来的',
    luckyColor: '墨香黑',
    luckyNumber: 4,
    luckyItem: '钢笔',
    celebrities: ['散文作家', '专栏作者', '深度报道记者'],
    superpower: '能用文字准确表达深刻的思考',
    kryptonite: '可能因追求完美而难以发表',
    compatibleTypes: ['D-ER', 'S-IR', 'S-WR'],
    challengeTypes: ['D-LE', 'D-DE'],
    seasonalAdvice: '秋高气爽时，是你写作灵感最丰富的时期',
  },

  // ========== 均衡发展型 (B-开头) ==========
  'B-WI': {
    name: '全能探险家',
    symbol: '🌍',
    element: '光',
    motto: '广泛探索，均衡成长',
    luckyColor: '彩虹色',
    luckyNumber: 12,
    luckyItem: '地球仪',
    celebrities: ['博学家', '通才', '跨界专家'],
    superpower: '能在多个领域建立连接',
    kryptonite: '可能因兴趣太广而难以精专',
    compatibleTypes: ['D-WI', 'S-WI', 'B-ID'],
    challengeTypes: ['D-IR', 'S-DR'],
    seasonalAdvice: '四季交替时，保持对不同领域的好奇',
  },
  'B-LD': {
    name: '全面协作者',
    symbol: '🔗',
    element: '水',
    motto: '团队的力量大于个人',
    luckyColor: '协作蓝',
    luckyNumber: 6,
    luckyItem: '团队徽章',
    celebrities: ['优秀团队成员', '班级委员', '项目组核心'],
    superpower: '能在各种团队中找到自己的位置',
    kryptonite: '可能过于适应而失去个人特色',
    compatibleTypes: ['D-LD', 'S-LD', 'B-LE'],
    challengeTypes: ['D-WR', 'S-IR'],
    seasonalAdvice: '团队活动密集的时期，你的价值最能体现',
  },
  'B-LE': {
    name: '亲和力大使',
    symbol: '💝',
    element: '火',
    motto: '用真诚赢得每一份信任',
    luckyColor: '亲和粉',
    luckyNumber: 3,
    luckyItem: '友谊手链',
    celebrities: ['社交达人', '外交官', '公关专家'],
    superpower: '能和各种性格的人建立良好关系',
    kryptonite: '可能难以在冲突中坚持立场',
    compatibleTypes: ['D-LE', 'S-LE', 'B-LD'],
    challengeTypes: ['D-IR', 'S-DR'],
    seasonalAdvice: '社交活动丰富的季节，尽情发挥你的亲和力',
  },
  'B-DR': {
    name: '稳健成长者',
    symbol: '🌱',
    element: '木',
    motto: '每天进步一点点',
    luckyColor: '成长绿',
    luckyNumber: 7,
    luckyItem: '成长日记',
    celebrities: ['终身学习者', '自我提升达人', '成长教练'],
    superpower: '能在各个维度稳步提升',
    kryptonite: '可能因追求全面而缺乏突出特长',
    compatibleTypes: ['D-DR', 'S-DR', 'B-IR'],
    challengeTypes: ['D-WE', 'D-LE'],
    seasonalAdvice: '新年伊始，制定均衡的成长计划',
  },
}

// 获取潜能星象信息（趣味元素，非科学评估）
export function getTalentConstellation(talentKey: string): (TalentConstellation & { disclaimer: string }) | null {
  const constellation = TALENT_CONSTELLATIONS[talentKey]
  if (!constellation) return null
  return {
    ...constellation,
    _isFunElement: true,
    _category: 'entertainment' as FunElementCategory,
    disclaimer: FUN_ELEMENTS_DISCLAIMER.description
  }
}

// 获取幸运信息卡片数据（趣味元素，仅供娱乐）
export function getLuckyCard(talentKey: string): {
  color: string
  number: number
  item: string
  element: string
  _disclaimer: string
} | null {
  const constellation = TALENT_CONSTELLATIONS[talentKey]
  if (!constellation) return null
  return {
    color: constellation.luckyColor,
    number: constellation.luckyNumber,
    item: constellation.luckyItem,
    element: constellation.element,
    _disclaimer: '⚠️ 以上为趣味性内容，非科学评估结论'
  }
}

// 获取名人对标
export function getCelebrityMatches(talentKey: string): string[] {
  const constellation = TALENT_CONSTELLATIONS[talentKey]
  return constellation?.celebrities || []
}

// 获取搭档建议
export function getCompatibilityInfo(talentKey: string) {
  const constellation = TALENT_CONSTELLATIONS[talentKey]
  if (!constellation) return null
  return {
    bestMatches: constellation.compatibleTypes,
    challengeMatches: constellation.challengeTypes,
  }
}
