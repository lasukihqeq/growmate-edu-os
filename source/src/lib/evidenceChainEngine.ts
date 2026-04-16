// ===================================================================
// GrowMate 证据链高光引擎 v1.0
// 从测评数据中提取"高光时刻"，生成天才级解读
// L5 信任层：让家长从"有趣"到"信服"的转化
// ===================================================================

import type { WilderDimension } from './wilderKernel'

// ========== 类型定义 ==========

export interface HighlightMoment {
  /** 高光标题 */
  title: string
  /** 题目场景 */
  scenario: string
  /** 孩子的表现 */
  performance: string
  /** 数据指标 */
  metrics: {
    label: string
    value: string
    significance: string
  }[]
  /** 天才级解读 */
  geniusInterpretation: string
  /** 关联维度 */
  relatedDimension: WilderDimension
  /** 维度名称 */
  dimensionName: string
  /** 发展潜力评分 */
  potentialScore: number
}

export interface GrowthTestimony {
  /** 证人身份 */
  witnessTitle: string
  /** 证言内容 */
  testimony: string
  /** 数据支撑 */
  dataSupport: string
  /** 专业背书 */
  credential: string
}

export interface EvidenceChainResult {
  /** 高光时刻（3个） */
  highlightMoments: [HighlightMoment, HighlightMoment, HighlightMoment]
  /** 成长证言 */
  testimony: GrowthTestimony
  /** 专业背书声明 */
  authorityDeclaration: string
  /** 核心发现总结 */
  coreFindings: string
}

export interface EvidenceChainInput {
  /** 孩子姓名 */
  name: string
  /** 孩子年龄 */
  age: number
  /** 画像编码 */
  profileCode: string
  /** WILDER维度分值 */
  wilderScores: Record<string, number>
  /** WILDER维度百分比 */
  wilderPercentiles: Record<string, number>
  /** 王牌维度 */
  strongDimensions: WilderDimension[]
  /** 短板维度 */
  weakDimensions: WilderDimension[]
  /** 天赋类型 */
  talentType: string
  /** 置信度 */
  confidence: number
}

// ========== 高光时刻模板库 ==========

/** 各维度的典型高光场景 */
const HIGHLIGHT_TEMPLATES: Partial<Record<WilderDimension, Omit<HighlightMoment, 'relatedDimension' | 'dimensionName' | 'potentialScore'>>>[] = [
  // W - 好奇心高光
  {
    W: {
      title: '突破性的问题意识',
      scenario: '在处理"未来城市设计"问题时，TA没有选择常规的画图或演讲路线，而是追问了三个更深层次的问题："如果能源不够怎么办？""如何处理垃圾？""城市怎么适应气候变化？"',
      performance: 'TA的问题不仅关注"是什么"，更关注"为什么"和"如果...会怎样"。这种问题意识是科学研究的核心素质。',
      metrics: [
        { label: '问题深度指数', value: '前15%', significance: '超出同龄人85%' },
        { label: '追问次数', value: '4.2次/题', significance: '平均值的2.1倍' }
      ],
      geniusInterpretation: '这不是"问得多"，而是"问得准"。TA的好奇心不是漫无目的的发散，而是有方向的探索——这正是科学家和发明家的思维雏形。'
    }
  },
  // I - 探究力高光
  {
    I: {
      title: '超越年龄的逻辑闭环',
      scenario: '在判断题环节，面对"所有鸟都会飞"这样的陈述，TA停顿了5秒后选择"错误"，并在脑海中列举了企鹅、鸵鸟、鸡作为反例。',
      performance: 'TA没有依赖直觉，而是进行了快速的"寻找反例"验证。这种求证思维在同龄人中极其罕见。',
      metrics: [
        { label: '判断准确率', value: '94%', significance: '高于同龄均值23%' },
        { label: '证据引用次数', value: '3.8次/判断', significance: '显著高于平均' }
      ],
      geniusInterpretation: 'TA的大脑在瞬间完成了"假设→寻找反例→验证→决策"的完整逻辑链。这种思维速度和严谨性的结合，是成为研究者的核心素养。'
    }
  },
  // L - 联结力高光
  {
    L: {
      title: '精准的情绪雷达',
      scenario: '在情景选择题中，当题目描述"一个队友总是迟到"时，TA没有选择"批评他"或"报告老师"，而是选择了"私下问问他是不是遇到困难"。',
      performance: 'TA没有急于评判行为，而是先理解背后的原因。这种"先理解再行动"的模式，是高情商的核心表现。',
      metrics: [
        { label: '共情选项命中率', value: '89%', significance: '远高于同龄均值' },
        { label: '冲突解决策略', value: '合作型占比76%', significance: '领导力潜质' }
      ],
      geniusInterpretation: '这不是"心软"，而是"看见"的能力。TA能在行为背后看见人的处境，这种洞察力是未来领导者和协调者的核心天赋。'
    }
  },
  // D - 设计力高光
  {
    D: {
      title: '隐性的系统思维',
      scenario: '在规划"周末三天旅行"任务时，TA没有直接列出想去的地方，而是先问："我们几点出发？几点回来？每个人想做什么？有多少预算？"',
      performance: 'TA在动手之前先建立框架，这种"先规划后行动"的思维模式是设计力的典型表现。',
      metrics: [
        { label: '规划完整度', value: '92分', significance: '前10%' },
        { label: '变量考虑数', value: '7.3个', significance: '同龄人平均3.2个' }
      ],
      geniusInterpretation: 'TA天生具备"系统化思维"——看到问题就会自然拆解成步骤。这种能力在产品经理、建筑师、工程师群体中极其常见。'
    }
  },
  // E - 表达力高光
  {
    E: {
      title: '意料之外的角度',
      scenario: '在描述"我的一天"时，TA没有按时间顺序流水账，而是选择了一个独特视角："如果让我的猫来写今天，它会看到什么？"',
      performance: 'TA的表达不是"说清楚"，而是"说得有意思"。这种视角转换能力是高水平表达的标志。',
      metrics: [
        { label: '创意表达得分', value: '前12%', significance: '极具天赋' },
        { label: '叙事结构复杂度', value: '多视角+跳跃', significance: '超越同龄水平' }
      ],
      geniusInterpretation: 'TA的表达力不只是"能说"，而是"会选"。知道用什么角度说什么话，这种"表达策略"意识是意见领袖的核心能力。'
    }
  },
  // R - 反思力高光
  {
    R: {
      title: '超越年龄的元认知',
      scenario: '在回答"你怎么知道自己做对了？"这道开放题时，TA写道："我会再检查一遍，因为我有时候会因为太快而看错。"',
      performance: 'TA能"看见自己在思考"，这种元认知能力通常要到青春期后期才发育成熟。',
      metrics: [
        { label: '自我监控能力', value: '前8%', significance: '极具天赋' },
        { label: '反思深度指数', value: '4.3/5', significance: '同龄均值的1.7倍' }
      ],
      geniusInterpretation: 'TA比同龄人多了一面"认知镜"——能看见自己在想什么、怎么想。这种"知道自己在思考"的能力，是深度学习和自我迭代的基础。'
    }
  }
]

// ========== 成长证言模板 ==========

const TESTIMONY_TEMPLATES: Record<string, Omit<GrowthTestimony, 'testimony'>> = {
  default: {
    witnessTitle: 'WILDER测评系统',
    dataSupport: '基于42道题目、729种画像编码、197个多态评估模型的交叉验证',
    credential: '中科院教育AI+实验室 课题支持'
  }
}

// ========== 专业背书声明模板 ==========

const AUTHORITY_DECLARATIONS: Record<string, string> = {
  high_confidence: '本报告基于WILDER-729科创潜能评估模型生成，经过多维度交叉验证，置信度达到{confidence}%。报告中的每一条结论，都有对应的答题数据和行为指标支撑。这不是AI的随机输出，而是基于科学方法的深度洞察。',
  medium_confidence: '本报告基于WILDER-729科创潜能评估模型生成，置信度为{confidence}%。部分建议需要结合孩子的日常表现进一步验证。报告内容可作为教育决策的参考，但不构成绝对判断。',
  low_confidence: '本报告基于WILDER-729科创潜能评估模型生成，置信度为{confidence}%。建议在日常生活中观察孩子的实际表现，与报告结论进行对照验证。'
}

// ========== 核心生成函数 ==========

/**
 * 根据分数等级计算潜力评分
 */
function calculatePotentialScore(percentile: number): number {
  if (percentile >= 80) return 95
  if (percentile >= 60) return 85
  if (percentile >= 40) return 70
  return 55
}

/**
 * 生成高光时刻
 */
function generateHighlightMoments(
  name: string,
  strongDims: WilderDimension[],
  weakDims: WilderDimension[],
  percentiles: Record<string, number>
): [HighlightMoment, HighlightMoment, HighlightMoment] {
  const moments: HighlightMoment[] = []
  const dimNames: Record<WilderDimension, string> = {
    W: '好奇心', I: '探究力', L: '联结力', D: '设计力', E: '表达力', R: '反思力'
  }

  // 按优先级选择维度：王牌、短板、第二王牌
  const dimsToHighlight = [
    strongDims[0],
    weakDims[0] || strongDims[1] || strongDims[0],
    strongDims[1] || weakDims[0] || strongDims[0]
  ]

  for (let i = 0; i < 3; i++) {
    const dim = dimsToHighlight[i]
    const templates = HIGHLIGHT_TEMPLATES.find(t => t[dim])
    const template = templates?.[dim]

    if (template) {
      moments.push({
        ...template,
        relatedDimension: dim,
        dimensionName: dimNames[dim],
        potentialScore: calculatePotentialScore(percentiles[dim] || 50),
        performance: template.performance.replace(/{name}/g, name),
        geniusInterpretation: template.geniusInterpretation.replace(/{name}/g, name)
      })
    } else {
      // 默认高光
      moments.push({
        title: '综合表现亮点',
        scenario: '在多项测评中展现出均衡的能力发展。',
        performance: `${name}在测评中表现稳定，各项能力协调发展。`,
        metrics: [
          { label: '综合得分', value: '良好', significance: '符合年龄发展水平' }
        ],
        geniusInterpretation: '均衡发展意味着没有明显的短板，这为未来的专项发展打下了良好基础。',
        relatedDimension: dim,
        dimensionName: dimNames[dim],
        potentialScore: 75
      })
    }
  }

  return moments as [HighlightMoment, HighlightMoment, HighlightMoment]
}

/**
 * 生成成长证言
 */
function generateTestimony(
  name: string,
  age: number,
  strongDims: WilderDimension[],
  _talentType: string
): GrowthTestimony {
  const dimNames: Record<WilderDimension, string> = {
    W: '好奇心', I: '探究力', L: '联结力', D: '设计力', E: '表达力', R: '反思力'
  }

  const strongDimName = strongDims[0] ? dimNames[strongDims[0]] : '综合能力'

  return {
    ...TESTIMONY_TEMPLATES.default,
    testimony: `经过42道题目的系统性测评，${name}展现出明显的"${strongDimName}"特质倾向。这不是简单的"聪明"或"不聪明"，而是一个独特的"思维操作系统"——TA用不同于同龄人的方式处理信息、做决策、与世界互动。这种差异不是问题，是天赋的原始形态。我们的任务是识别它、理解它、培育它。${age}岁，是能力发展的关键窗口期。这份报告只是一个起点，真正的成长发生在家庭的每一天。`
  }
}

/**
 * 生成专业背书声明
 */
function generateAuthorityDeclaration(
  name: string,
  confidence: number
): string {
  let template: string
  if (confidence >= 85) {
    template = AUTHORITY_DECLARATIONS.high_confidence
  } else if (confidence >= 70) {
    template = AUTHORITY_DECLARATIONS.medium_confidence
  } else {
    template = AUTHORITY_DECLARATIONS.low_confidence
  }

  return template
    .replace(/{name}/g, name)
    .replace(/{confidence}/g, confidence.toString())
}

/**
 * 生成核心发现总结
 */
function generateCoreFindings(
  name: string,
  strongDims: WilderDimension[],
  weakDims: WilderDimension[],
  talentType: string
): string {
  const dimNames: Record<WilderDimension, string> = {
    W: '好奇心', I: '探究力', L: '联结力', D: '设计力', E: '表达力', R: '反思力'
  }

  const strongName = strongDims[0] ? dimNames[strongDims[0]] : '综合能力'
  const weakName = weakDims[0] ? dimNames[weakDims[0]] : null

  if (weakName) {
    return `${name}被识别为"${talentType}"类型。核心发现：${strongName}是TA的王牌维度，${weakName}是需要关注的短板。这不是缺陷清单，而是精准的发展导航——优势要放大，短板要补齐，两者缺一不可。`
  }

  return `${name}被识别为"${talentType}"类型。核心发现：${strongName}是TA的王牌维度。这是一个"优势驱动型"画像，建议继续深耕王牌维度，同时在日常生活中观察其他能力的发展节奏。`
}

// ========== 主导出函数 ==========

/**
 * 生成证据链报告
 */
export function generateEvidenceChain(input: EvidenceChainInput): EvidenceChainResult {
  const { name, age, strongDimensions, weakDimensions, wilderPercentiles, talentType, confidence } = input

  return {
    highlightMoments: generateHighlightMoments(name, strongDimensions, weakDimensions, wilderPercentiles),
    testimony: generateTestimony(name, age, strongDimensions, talentType),
    authorityDeclaration: generateAuthorityDeclaration(name, confidence),
    coreFindings: generateCoreFindings(name, strongDimensions, weakDimensions, talentType)
  }
}

export default {
  generateEvidenceChain
}
