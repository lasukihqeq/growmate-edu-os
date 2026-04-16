// ===================================================================
// 新模型报告内容生成器 v1.1
// CHC / Grit / SEL 分析 + 13种模型组合差异化
// v1.1: 优化语言表述，减少AI感，增强人性化和亲和力
// ===================================================================

import type { AssessmentScores } from './assessmentEngine'

// ========== 类型定义 ==========

export interface CHCReportSection {
  GfScore: number
  GcScore: number
  GfLevel: string
  GcLevel: string
  interpretation: string
  wilderCorrelation: string
}

export interface GritReportSection {
  passionScore: number
  perseveranceScore: number
  totalLevel: string
  interpretation: string
  wilderCorrelation: string
}

export interface SELReportSection {
  scores: Record<string, number>
  overallLevel: string
  interpretation: string
  wilderCorrelation: string
  competencyDetails: { name: string; score: number; level: string; tip: string }[]
}

export type ModelCombinationPatternKey =
  | 'high_Gf_high_grit' | 'high_Gf_low_Gc' | 'high_Gc_low_Gf'
  | 'high_grit_low_sel' | 'high_sel_low_grit' | 'balanced_cognitive'
  | 'high_Gf_high_sel' | 'low_all_new' | 'high_all_new'
  | 'grit_sel_synergy' | 'Gf_perseverance' | 'sel_leadership' | 'default'

export interface ModelCombinationPattern {
  key: ModelCombinationPatternKey
  name: string
  insight: string
  actionPlan: string
}

export interface NewModelAnalysis {
  chc: CHCReportSection
  grit: GritReportSection
  sel: SELReportSection
  modelCombination: ModelCombinationPattern
}

// ========== 工具函数 ==========

function scoreLevel(score: number): string {
  if (score >= 4) return '突出'
  if (score >= 2) return '良好'
  if (score >= 1) return '发展中'
  return '待提升'
}

function overallLevel(total: number, maxPossible: number): string {
  const pct = total / Math.max(1, maxPossible)
  if (pct >= 0.7) return '优秀'
  if (pct >= 0.5) return '良好'
  if (pct >= 0.3) return '发展中'
  return '待提升'
}

// ========== CHC 分析 ==========

export function generateCHCAnalysis(
  scores: AssessmentScores,
  wilderPct: Record<string, number>,
  studentName: string
): CHCReportSection {
  const { Gf, Gc } = scores.chc
  const GfLevel = scoreLevel(Gf)
  const GcLevel = scoreLevel(Gc)

  let interpretation: string
  if (Gf >= 2 && Gc >= 2) {
    interpretation = `${studentName}脑子转得快，肚子里也有货。遇到新问题能很快找到门路，知识面也挺广。这种"能想能说"的孩子，在学习和生活中都不太会遇到卡壳的情况——既能理解新东西，又能用已知的知识来帮忙。`
  } else if (Gf >= 2 && Gc < 2) {
    interpretation = `${studentName}很聪明，反应快，但知识储备还有点薄。这种孩子常常被说"聪明但不爱背书"——其实不是记不住，是觉得背东西没意思。TA更擅长理解新问题，而不是重复记忆已有的内容。顺着TA的兴趣去找书看、看纪录片，比逼着背课文管用。`
  } else if (Gf < 2 && Gc >= 2) {
    interpretation = `${studentName}知识面广，看书多，记得住。但遇到完全没见过的怪问题时，可能需要多想一想。这种孩子适合用"老办法解决新问题"的思路——多带TA做实验、玩逻辑游戏，帮TA把知识用活。`
  } else {
    interpretation = `${studentName}的认知能力还在发展中，这在这个年龄很正常。多带TA探索、多读书、多问"为什么"，两项能力都会慢慢跟上来的。`
  }

  const wilderCorrelation = `推理能力和探究力(I:${wilderPct.I || 0})、好奇心(W:${wilderPct.W || 0})相呼应；知识积累和表达力(E:${wilderPct.E || 0})、反思力(R:${wilderPct.R || 0})有关联。`

  return { GfScore: Gf, GcScore: Gc, GfLevel, GcLevel, interpretation, wilderCorrelation }
}

// ========== Grit 分析 ==========

export function generateGritAnalysis(
  scores: AssessmentScores,
  wilderPct: Record<string, number>,
  studentName: string
): GritReportSection {
  const { passion, perseverance } = scores.grit
  const total = passion + perseverance
  const totalLevel = overallLevel(total, 12)

  let interpretation: string
  if (passion >= 2 && perseverance >= 2) {
    interpretation = `${studentName}既有喜欢的事，又能坚持做下去。这种"热爱+坚持"的组合很珍贵——很多孩子有热情但三分钟热度，或者能坚持但不是真心喜欢。TA两个都有，这是长期做成一件事的基础。`
  } else if (passion >= 2 && perseverance < 2) {
    interpretation = `${studentName}有自己喜欢的方向，但遇到困难时容易退缩。TA不是不坚持，是还没学会"怎么坚持"。试着把大目标拆成小目标，每完成一步就庆祝一下，让TA尝到坚持的甜头。`
  } else if (passion < 2 && perseverance >= 2) {
    interpretation = `${studentName}能坚持，但好像还没找到真心喜欢的事。TA可能在"为了任务而坚持"，而不是"因为热爱而坚持"。帮TA多尝试不同的活动，找到那个让TA眼睛发光的方向。`
  } else {
    interpretation = `${studentName}还在探索自己的兴趣和节奏，这很正常。不用急着"找到热爱的事"，可以从小挑战开始——完成一个小任务，体验一次"我做到了"的感觉，慢慢建立信心。`
  }

  const wilderCorrelation = `兴趣稳定性和好奇心(W:${wilderPct.W || 0})、探究力(I:${wilderPct.I || 0})相关；坚持力和设计力(D:${wilderPct.D || 0})、反思力(R:${wilderPct.R || 0})有关联。`

  return { passionScore: passion, perseveranceScore: perseverance, totalLevel, interpretation, wilderCorrelation }
}

// ========== SEL 分析 ==========

const SEL_COMPETENCY_INFO: Record<string, { name: string; tip_high: string; tip_low: string }> = {
  selfAwareness: {
    name: '自我意识',
    tip_high: '继续保持这种觉察习惯，可以试试情绪日记，加深对自己的理解',
    tip_low: '每天睡前问一句"今天我有什么感觉？为什么？"，慢慢培养对自己情绪的觉察',
  },
  selfManagement: {
    name: '自我管理',
    tip_high: '有良好的自我调节基础，可以挑战更复杂的目标管理和时间规划',
    tip_low: '从简单的番茄钟开始，25分钟专注做一件事，逐步建立自律的感觉',
  },
  socialAwareness: {
    name: '社会意识',
    tip_high: '敏锐的社会感知力是领导力的基础，可以引导TA关注更广泛的社会话题',
    tip_low: '通过角色扮演游戏或故事讨论，练习"如果我是TA，我会怎么想"',
  },
  relationshipSkills: {
    name: '关系技能',
    tip_high: '有良好的人际基础，可以尝试在团队中扮演协调者或组织者的角色',
    tip_low: '从小合作任务开始，练习倾听别人的想法、表达自己的意见',
  },
  responsibleDecision: {
    name: '负责任决策',
    tip_high: '决策意识好，可以和TA讨论更复杂的选择情境，培养系统性思考',
    tip_low: '从日常小决定开始练习"想想后果再行动"，比如"如果现在玩游戏，作业什么时候做？"',
  },
}

export function generateSELAnalysis(
  scores: AssessmentScores,
  wilderPct: Record<string, number>,
  studentName: string
): SELReportSection {
  const sel = scores.sel
  const selScores: Record<string, number> = {
    selfAwareness: sel.selfAwareness,
    selfManagement: sel.selfManagement,
    socialAwareness: sel.socialAwareness,
    relationshipSkills: sel.relationshipSkills,
    responsibleDecision: sel.responsibleDecision,
  }

  const total = Object.values(selScores).reduce((s, v) => s + v, 0)
  const oLevel = overallLevel(total, 25)

  const competencyDetails = Object.entries(selScores).map(([key, score]) => {
    const info = SEL_COMPETENCY_INFO[key]
    const level = scoreLevel(score)
    const tip = score >= 2 ? info.tip_high : info.tip_low
    return { name: info.name, score, level, tip }
  })

  const highComps = competencyDetails.filter(c => c.score >= 2).map(c => c.name)
  const lowComps = competencyDetails.filter(c => c.score < 1).map(c => c.name)

  let interpretation: string
  if (highComps.length >= 3) {
    interpretation = `${studentName}在情绪管理、人际交往这些"软实力"上表现不错，${highComps.join('、')}都很突出。这意味着TA能理解自己、也能理解别人，在学校和生活中都会比较顺。`
  } else if (highComps.length >= 1) {
    interpretation = `${studentName}在${highComps.join('、')}方面做得比较好。${lowComps.length > 0 ? `${lowComps.join('、')}还可以加强。` : ''}这些能力不是天生的，日常多练就能提升。`
  } else {
    interpretation = `${studentName}在社会情感能力上还在发展中，这在这个年龄很常见。不用着急，可以从最简单的开始——比如每天问问TA"今天你有什么感觉"，帮TA认识自己的情绪。`
  }

  const wilderCorrelation = `自我意识和反思力(R:${wilderPct.R || 0})相关；关系技能和连接力(L:${wilderPct.L || 0})、表达力(E:${wilderPct.E || 0})有关联；决策能力和设计力(D:${wilderPct.D || 0})相呼应。`

  return { scores: selScores, overallLevel: oLevel, interpretation, wilderCorrelation, competencyDetails }
}

// ========== 模型组合差异化 ==========

export function determineModelCombinationPattern(scores: AssessmentScores): ModelCombinationPattern {
  const { Gf, Gc } = scores.chc
  const { passion, perseverance } = scores.grit
  const sel = scores.sel
  const gritTotal = passion + perseverance
  const selAvg = (sel.selfAwareness + sel.selfManagement + sel.socialAwareness + sel.relationshipSkills + sel.responsibleDecision) / 5
  const wilderE = scores.wilder.E || 0

  // 按优先级匹配模式

  if (Gf >= 2 && gritTotal >= 4) {
    return {
      key: 'high_Gf_high_grit',
      name: '坚毅创新者',
      insight: '脑子活、能坚持——这是做大事的组合。既能发现新问题，又能一路追到底。这种孩子给TA一个有难度的项目，TA能做得津津有味。',
      actionPlan: '让TA尝试需要长时间投入的挑战：一个科学小研究、一个编程作品、一个创意设计。不用催，TA自己会追着做。',
    }
  }

  if (Gf >= 2 && selAvg >= 2) {
    return {
      key: 'high_Gf_high_sel',
      name: '共情型问题解决者',
      insight: '既能分析问题，又能理解人。这种孩子不光聪明，还"懂事"——知道怎么做决定时要考虑别人的感受。',
      actionPlan: '让TA参与一些需要"解决问题+考虑他人"的活动，比如班级活动策划、社区服务设计。',
    }
  }

  if (gritTotal >= 3 && selAvg >= 1.5) {
    return {
      key: 'grit_sel_synergy',
      name: '韧性协作者',
      insight: '能坚持，也能合作。这种孩子在团队里很受欢迎——不会半途跑掉，也懂得照顾别人。',
      actionPlan: '鼓励TA参加需要长期协作的活动：社团、志愿者、小组项目。TA会是那个"粘合剂"一样的角色。',
    }
  }

  if (Gf >= 2 && perseverance >= 2) {
    return {
      key: 'Gf_perseverance',
      name: '深度钻研型',
      insight: '聪明又能沉下心。这种孩子适合"往深里挖"——不是走马观花，而是一钻到底。',
      actionPlan: '数学竞赛、科学实验、编程项目……给TA选择一个方向，然后给足时间和空间让TA钻研。',
    }
  }

  if (sel.relationshipSkills >= 2 && wilderE >= 60) {
    return {
      key: 'sel_leadership',
      name: '天然领导者',
      insight: '会交朋友，也会表达。这种孩子天生适合当"小队长"——大家愿意听TA说，也愿意跟着TA做。',
      actionPlan: '多给TA"带队伍"的机会：小组长、活动策划、演讲展示。这些经历会帮TA建立自信。',
    }
  }

  if (Gf >= 2 && Gc < 1) {
    return {
      key: 'high_Gf_low_Gc',
      name: '直觉型思考者',
      insight: '反应快、脑子活，但知识面还不够宽。这种孩子常常被说"聪明但基础不扎实"——其实不是能力问题，是兴趣点还没对上。',
      actionPlan: '顺着TA的兴趣去扩展知识面：喜欢动物就看动物纪录片，喜欢机械就逛科技馆。让学习变得"有意思"。'
    }
  }

  if (Gc >= 2 && Gf < 1) {
    return {
      key: 'high_Gc_low_Gf',
      name: '知识积累型',
      insight: '知识面广，记得住，但遇到完全陌生的问题可能需要提示。这种孩子适合"学以致用"的练习。',
      actionPlan: '多做开放性任务：科学实验、辩论赛、案例分析。帮TA把脑子里的知识用起来。',
    }
  }

  if (gritTotal >= 4 && selAvg < 1) {
    return {
      key: 'high_grit_low_sel',
      name: '孤独坚持者',
      insight: '能一个人闷头做很久，但不太会求助和合作。这种孩子容易"一个人扛"，长期可能会觉得累。',
      actionPlan: '在保护TA坚持特质的同时，慢慢引导合作：先从两人合作开始，体验"两个人比一个人强"的感觉。',
    }
  }

  if (selAvg >= 2 && gritTotal < 2) {
    return {
      key: 'high_sel_low_grit',
      name: '社交达人',
      insight: '人缘好、会来事，但遇到困难可能容易放弃。这种孩子需要把"社交动力"变成"坚持动力"。',
      actionPlan: '帮TA找个"学习搭子"，和朋友一起完成挑战。社交属性也可以变成坚持的理由。',
    }
  }

  if (Math.abs(Gf - Gc) < 1 && Gf >= 1 && Gc >= 1) {
    return {
      key: 'balanced_cognitive',
      name: '均衡发展型',
      insight: '认知能力各方面发展得比较均衡，没有明显的短板，也没有特别突出的强项。',
      actionPlan: '均衡是好事，但也可以找找TA最感兴趣的方向，让那个方向变得"更突出一点"。',
    }
  }

  const allNewHigh = Gf >= 2 && Gc >= 2 && gritTotal >= 4 && selAvg >= 2
  if (allNewHigh) {
    return {
      key: 'high_all_new',
      name: '全面卓越型',
      insight: '认知能力、坚毅力、社会情感能力都很突出。这种孩子最需要的不是"补短板"，而是"找方向"。',
      actionPlan: '给TA一个有挑战、有意义的"大项目"——比如一个持续一学期的研究课题，让TA的各方面能力都有施展的地方。',
    }
  }

  const allNewLow = Gf < 1 && Gc < 1 && gritTotal < 2 && selAvg < 1
  if (allNewLow) {
    return {
      key: 'low_all_new',
      name: '潜力待发掘型',
      insight: '各项指标还在发展中——这不代表能力不行，更可能是还没遇到让TA"燃起来"的事。',
      actionPlan: '从最容易产生成就感的活动开始——通常是动手类或社交类的。一次成功的体验，会带动整体发展。',
    }
  }

  return {
    key: 'default',
    name: '独特发展型',
    insight: '每个孩子都有自己的发展节奏。现有的数据显示一个有特色的能力组合——不是标准模板，但有自己的亮点。',
    actionPlan: '结合日常观察，找到TA最自然表现出的兴趣和优势，从那里出发来规划成长路径。',
  }
}

/** 为模型组合生成个性化解读文本 */
export function generateCombinationInsight(
  pattern: ModelCombinationPattern,
  studentName: string
): string {
  return `综合认知能力、坚毅力和社会情感发展来看，${studentName}是"${pattern.name}"类型。${pattern.insight}`
}

/** 生成完整的新模型分析报告 */
export function generateNewModelAnalysis(
  scores: AssessmentScores,
  wilderPct: Record<string, number>,
  studentName: string
): NewModelAnalysis {
  const chc = generateCHCAnalysis(scores, wilderPct, studentName)
  const grit = generateGritAnalysis(scores, wilderPct, studentName)
  const sel = generateSELAnalysis(scores, wilderPct, studentName)
  const modelCombination = determineModelCombinationPattern(scores)

  return { chc, grit, sel, modelCombination }
}
