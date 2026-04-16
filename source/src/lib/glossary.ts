/**
 * WILDER 测评报告术语库
 * 为非专业用户提供通俗易懂的术语解释
 */

export interface GlossaryEntry {
  /** 简短解释（10字以内，用于 tooltip） */
  short: string
  /** 详细解释（50-100字，用于弹出面板） */
  detail: string
  /** 术语类别 */
  category: 'dimension' | 'model' | 'metric' | 'concept'
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  // === WILDER 六维度 ===
  '好奇心': {
    short: '对新事物的探索欲',
    detail: '反映孩子主动发现和探索新事物的意愿。好奇心强的孩子喜欢问"为什么"，对未知世界充满热情，是科学探索的起点。',
    category: 'dimension',
  },
  '探究力': {
    short: '追根究底的能力',
    detail: '反映孩子深入研究问题的能力，包括提出假设、设计验证方案、分析结果。探究力强的孩子不满足于表面答案，喜欢自己动手验证。',
    category: 'dimension',
  },
  '连接力': {
    short: '与人协作的能力',
    detail: '反映孩子在团队中沟通、协作和共情的能力。连接力强的孩子善于理解他人、化解分歧，在集体活动中能发挥纽带作用。',
    category: 'dimension',
  },
  '设计力': {
    short: '规划和组织的能力',
    detail: '反映孩子制定计划、分解任务、管理资源的能力。设计力强的孩子做事有条理，善于把大目标拆成小步骤逐一完成。',
    category: 'dimension',
  },
  '表达力': {
    short: '展示想法的能力',
    detail: '反映孩子通过语言、文字、图画等方式清晰传达想法的能力。表达力强的孩子善于把自己的发现和思考分享给别人。',
    category: 'dimension',
  },
  '反思力': {
    short: '自我觉察和复盘能力',
    detail: '反映孩子自我评估、总结经验、从错误中学习的能力。反思力强的孩子会主动思考"下次怎么做更好"，具有成长型思维。',
    category: 'dimension',
  },

  // === 心理学模型 ===
  '多元智能': {
    short: '8种不同的聪明方式',
    detail: '由哈佛大学加德纳教授提出，认为人有8种不同的智能（语言、逻辑、空间、音乐、运动、人际、内省、自然观察），每个孩子的智能组合都是独特的。',
    category: 'model',
  },
  '大五人格': {
    short: '5种基本性格特征',
    detail: '心理学中最受认可的人格模型，包含开放性（是否喜欢新事物）、尽责性（做事是否有条理）、外向性（是否喜欢社交）、宜人性（是否善于合作）、情绪稳定性（情绪是否平稳）。',
    category: 'model',
  },
  'CHC认知能力': {
    short: '思维灵活度和知识运用',
    detail: '一种评估认知能力的框架，主要看两方面：流体推理（面对新问题时灵活思考的能力）和晶体智力（运用已有知识解决问题的能力）。',
    category: 'model',
  },
  '执行功能': {
    short: '大脑的"指挥官"能力',
    detail: '大脑管理注意力、控制冲动、灵活切换任务的能力。好比大脑的"指挥官"，帮助孩子专注做事、抵抗诱惑、灵活应变。',
    category: 'model',
  },
  '坚毅力': {
    short: '对目标的持久热情和毅力',
    detail: '由心理学家达克沃斯提出，包含两个维度：对目标的持续热情（不轻易放弃兴趣）和面对困难时的坚持不懈。',
    category: 'model',
  },
  '社会情感学习': {
    short: '情商和社交能力',
    detail: '包含自我意识、自我管理、社会意识、关系技能和负责任决策五个方面。简单说就是"认识自己、管理自己、理解别人、与人相处、做好决定"。',
    category: 'model',
  },

  // === 统计指标 ===
  '百分位': {
    short: '在同龄人中的位置',
    detail: '表示孩子在同龄人中的相对位置。例如第75百分位意味着TA的表现超过了75%的同龄孩子。这不是考试分数，而是一种排名方式。',
    category: 'metric',
  },
  '一致性': {
    short: '不同模型结果是否吻合',
    detail: '我们用多种评估方法从不同角度观察孩子，然后检查这些结果是否指向相同的方向。一致性高说明测评结论更可靠。',
    category: 'metric',
  },
  '置信度': {
    short: '结果的可靠程度',
    detail: '综合考虑答题完整度、各模型一致性等因素后，对测评结论可靠性的整体评估。置信度越高，结果越可以作为教育决策的参考。',
    category: 'metric',
  },
  '交叉验证': {
    short: '多种方法互相印证',
    detail: '用多种不同的心理学模型分别评估孩子，然后对比各模型的结论是否一致。就像用不同角度的照片拼出一个更完整、更真实的画像。',
    category: 'metric',
  },

  // === 概念类 ===
  '流体推理': {
    short: '灵活应对新问题的能力',
    detail: '面对从未见过的新问题时，不依赖已有知识，而是通过分析、推理找到解决方法的能力。这种能力帮助孩子举一反三。',
    category: 'concept',
  },
  '晶体智力': {
    short: '运用已有知识的能力',
    detail: '通过学习和经验积累的知识和技能，以及运用这些知识解决问题的能力。阅读量大、知识面广的孩子在这方面通常表现较好。',
    category: 'concept',
  },
  '认知灵活性': {
    short: '灵活切换思路的能力',
    detail: '在不同任务或思维方式之间灵活切换的能力。认知灵活性好的孩子能从多个角度看问题，不容易"钻牛角尖"。',
    category: 'concept',
  },
  '抑制控制': {
    short: '抵抗诱惑、专注的能力',
    detail: '控制冲动、抵抗干扰、保持专注的能力。抑制控制好的孩子能在写作业时不被手机分心，在需要等待时保持耐心。',
    category: 'concept',
  },
  '元认知': {
    short: '"思考自己的思考"',
    detail: '对自己的认知过程进行觉察和调节的能力。简单说就是孩子能意识到"我是怎么想的"、"我的学习方法有没有效"，并据此调整策略。',
    category: 'concept',
  },
  '成长型思维': {
    short: '相信努力能变聪明',
    detail: '相信智力和能力可以通过努力、学习和坚持来提升的信念。拥有成长型思维的孩子不怕犯错，把挑战看作成长的机会。',
    category: 'concept',
  },
  '观察力': {
    short: '发现细节的能力',
    detail: '善于发现环境中微小变化和隐藏细节的能力。观察力强的孩子往往能注意到别人忽视的东西。',
    category: 'concept',
  },
  '假设力': {
    short: '基于观察提猜想的能力',
    detail: '能根据观察到的现象提出合理猜想的能力。这是科学思维的重要组成部分——先猜、再验证。',
    category: 'concept',
  },
  '共情力': {
    short: '感受他人情绪的能力',
    detail: '能感受和理解他人的情绪和处境的能力。共情力强的孩子善于"将心比心"，在人际交往中更受欢迎。',
    category: 'concept',
  },
  '归因分析': {
    short: '找原因的能力',
    detail: '能识别成功或失败的具体原因的能力。擅长归因分析的孩子不会简单归结为"运气好/不好"或"聪明/笨"，而是找到具体可改进的环节。',
    category: 'concept',
  },
  '潜能分型': {
    short: '孩子的天赋特征类型',
    detail: '基于六个维度的得分组合，将孩子归入最匹配的潜能类型。每种类型都有独特的优势组合和发展方向，帮助家长理解孩子的核心特点。',
    category: 'concept',
  },
  '维度': {
    short: '评估的一个方面',
    detail: '我们从6个不同的方面来观察孩子的能力特点，每个方面就是一个"维度"。就像描述一个人的身高、体重、视力一样，每个维度反映不同的特征。',
    category: 'concept',
  },
  'Layer2子维度': {
    short: '更细致的能力拆分',
    detail: '在6个大维度下面，还有更细致的能力分项。比如"好奇心"下面包含观察力、提问力、想象力等。这些细分帮助更精确地定位孩子的具体优势。',
    category: 'concept',
  },
}

/**
 * 获取术语解释
 */
export function getGlossaryEntry(term: string): GlossaryEntry | undefined {
  return GLOSSARY[term]
}

/**
 * 获取所有术语按类别分组
 */
export function getGlossaryByCategory(): Record<string, { term: string; entry: GlossaryEntry }[]> {
  const grouped: Record<string, { term: string; entry: GlossaryEntry }[]> = {}
  for (const [term, entry] of Object.entries(GLOSSARY)) {
    if (!grouped[entry.category]) grouped[entry.category] = []
    grouped[entry.category].push({ term, entry })
  }
  return grouped
}
