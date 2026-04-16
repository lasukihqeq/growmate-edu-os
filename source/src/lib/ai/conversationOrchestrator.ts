// ===================================================================
// AI对话编排器 v1.0
// 管理对话式测评流程，提取WILDER维度信号
// 支持LLM接入和脚本对话树两种模式
// ===================================================================

import type { AgeGroupKey } from '../questions/types'
import { createSignalExtractor, type OpenEndedSignalExtractor, type SignalExtractionResult } from './openEndedSignalExtractor'
import type { WilderDimension } from '../minigame/types'

// ===================================================================
// 类型定义
// ===================================================================

/** 对话消息 */
export interface ConversationMessage {
  id: string
  role: 'ai' | 'child' | 'system'
  content: string
  timestamp: number
  metadata?: {
    targetDimension?: string
    scoreHint?: number
    turnType?: 'opening' | 'exploration' | 'probing' | 'closing'
  }
}

/** WILDER维度信号 */
export interface DimensionSignal {
  dimension: string
  strength: number  // 0-1
  evidence: string
  source: 'keyword' | 'pattern' | 'sentiment'
}

/** 对话会话状态 */
export interface ConversationState {
  messages: ConversationMessage[]
  signals: DimensionSignal[]
  turnCount: number
  maxTurns: number
  currentPhase: 'warmup' | 'explore' | 'focus' | 'verify' | 'closing'
  coveredDimensions: Set<string>
  estimatedScores: Record<string, number>
  childProfile: {
    name: string
    age: number
    ageGroup: AgeGroupKey
  }
}

/** 对话编排器配置 */
export interface OrchestratorConfig {
  useLLM: boolean
  maxTurns: number
  dimensionsToCover: string[]
  systemPromptOverride?: string
}

// ===================================================================
// 关键词信号检测器
// ===================================================================

const DIMENSION_KEYWORDS: Record<string, {
  positive: string[]
  negative: string[]
}> = {
  W: {
    positive: ['为什么', '怎么', '好奇', '想知道', '神奇', '有趣', '酷', '厉害', '探索', '发现', '新', '没见过', '想看', '想试'],
    negative: ['无聊', '不想', '无所谓', '算了', '随便', '不知道', '不清楚', '没感觉'],
  },
  I: {
    positive: ['实验', '验证', '分析', '推理', '假设', '证明', '研究', '逻辑', '因为', '所以', '原因', '证据'],
    negative: ['猜的', '直觉', '不知道为什么', '随便选的', '没想过'],
  },
  L: {
    positive: ['一起', '帮忙', '合作', '分享', '团队', '大家', '朋友', '理解', '支持', '协调'],
    negative: ['自己', '不管', '不想管', '各做各的', '不需要别人'],
  },
  D: {
    positive: ['设计', '创造', '发明', '改造', '创新', '方案', '计划', '构思', '优化', '改进'],
    negative: ['照着做', '模仿', '按原来的', '没有想法', '不会设计'],
  },
  E: {
    positive: ['解释', '表达', '讲述', '说明', '说服', '展示', '演讲', '描述', '沟通', '表达清楚'],
    negative: ['说不清', '不知道怎么说', '不想说', '难表达'],
  },
  R: {
    positive: ['反思', '总结', '回顾', '教训', '经验', '改进', '下次', '调整', '思考', '复盘'],
    negative: ['不想想', '过去了', '无所谓', '没总结'],
  },
}

/** 从消息中提取维度信号 */
export function extractSignals(message: string): DimensionSignal[] {
  const signals: DimensionSignal[] = []
  const normalizedMsg = message.toLowerCase()

  for (const [dim, keywords] of Object.entries(DIMENSION_KEYWORDS)) {
    let positiveCount = 0
    let negativeCount = 0
    const evidence: string[] = []

    for (const kw of keywords.positive) {
      if (normalizedMsg.includes(kw)) {
        positiveCount++
        evidence.push(kw)
      }
    }

    for (const kw of keywords.negative) {
      if (normalizedMsg.includes(kw)) {
        negativeCount++
        evidence.push(kw)
      }
    }

    if (positiveCount > 0 || negativeCount > 0) {
      const strength = Math.min(1, (positiveCount * 0.3 - negativeCount * 0.2) + 0.5)
      signals.push({
        dimension: dim,
        strength: Math.max(0, Math.min(1, strength)),
        evidence: evidence.join(', '),
        source: 'keyword',
      })
    }
  }

  // 如果没有检测到任何信号，添加一个弱信号
  if (signals.length === 0 && message.length > 5) {
    signals.push({
      dimension: 'W',
      strength: 0.3,
      evidence: '参与了对话',
      source: 'pattern',
    })
  }

  return signals
}

// ===================================================================
// 脚本对话树（无需API Key的伪AI对话模式）
// ===================================================================

interface ScriptedDialogueNode {
  id: string
  dimension: string
  aiMessage: string
  childResponsePatterns: {
    keywords: string[]
    scoreRange: [number, number]
    aiReply: string
    nextDimension?: string
  }[]
  defaultReply: string
  defaultNextDimension?: string
}

const SCRIPTED_DIALOGUE_TREE: Record<AgeGroupKey, ScriptedDialogueNode[]> = {
  preschool: [
    {
      id: 'w-opening',
      dimension: 'W',
      aiMessage: '嗨！你有没有见过会发光的蘑菇呀？🧚✨',
      childResponsePatterns: [
        { keywords: ['见过', '想看', '哪里', '真的吗', '好酷'], scoreRange: [75, 90], aiReply: '哇！你的小眼睛真厉害！那你觉得蘑菇为什么会发光呢？🤔' },
        { keywords: ['没有', '不知道', '什么'], scoreRange: [40, 60], aiReply: '没关系！今天我带你去看好多神奇的东西！你平时喜欢看什么呢？😊' },
      ],
      defaultReply: '嗯嗯！那我来告诉你，在魔法森林里有好多好多神奇的东西！你最喜欢什么动物呀？',
      defaultNextDimension: 'L',
    },
    {
      id: 'i-simple',
      dimension: 'I',
      aiMessage: '小蚂蚁搬东西的时候，总是排成一条长长的队伍！你知道为什么吗？🐜',
      childResponsePatterns: [
        { keywords: ['因为', '跟', '一起', '找路', '帮忙'], scoreRange: [75, 90], aiReply: '你好聪明！小蚂蚁靠气味找路呢！那你觉得它们是怎么跟同伴说话的呀？💡' },
        { keywords: ['不知道', '猜'], scoreRange: [40, 55], aiReply: '没关系！我们一起想想看，你觉得蚂蚁会不会说话呢？🤔' },
      ],
      defaultReply: '你愿意想这个问题，真棒！那换个话题，你有没有帮助过好朋友呀？',
      defaultNextDimension: 'L',
    },
    {
      id: 'l-sharing',
      dimension: 'L',
      aiMessage: '如果你的好朋友忘记带午餐了，你会怎么做呀？🤝',
      childResponsePatterns: [
        { keywords: ['分', '给', '一起', '帮忙', '分享'], scoreRange: [75, 90], aiReply: '你真是一个好朋友！朋友之间互相帮忙是最棒的！🤗 你喜欢跟谁一起玩呢？' },
        { keywords: ['不知道', '老师'], scoreRange: [40, 55], aiReply: '找老师帮忙也是个好主意！不过如果你能分一点给好朋友，他一定会很高兴的！😊' },
      ],
      defaultReply: '嗯！你是个好孩子！那我们来玩一个画画游戏吧！',
      defaultNextDimension: 'D',
    },
    {
      id: 'd-create',
      dimension: 'D',
      aiMessage: '如果你能发明一个超级厉害的机器，你想让它做什么呀？🎨',
      childResponsePatterns: [
        { keywords: ['做', '飞', '帮', '可以', '我想'], scoreRange: [75, 90], aiReply: '哇！你的想法太酷了！你能再告诉我它长什么样子吗？🚀' },
        { keywords: ['不知道', '没想'], scoreRange: [40, 55], aiReply: '没关系！我们一起来想一个吧！比如一个会做冰淇淋的机器人？🍦' },
      ],
      defaultReply: '你的想法真有趣！最后我还有一个问题想问你～',
      defaultNextDimension: 'R',
    },
    {
      id: 'r-think',
      dimension: 'R',
      aiMessage: '今天我们玩得好开心呀！你觉得最有趣的是什么？你还想再玩吗？🪞',
      childResponsePatterns: [
        { keywords: ['喜欢', '有趣', '好玩', '再玩', '因为'], scoreRange: [75, 90], aiReply: '你真的很会总结呢！今天跟你聊天超开心的！我们下次再一起玩吧！🌟' },
        { keywords: ['不知道', '忘了'], scoreRange: [40, 55], aiReply: '没关系！记住你开心了就好！今天跟你聊天真好玩！🌈' },
      ],
      defaultReply: '谢谢你今天跟我聊天！你是个很棒的小朋友！🌟',
    },
  ],
  'lower-primary': [
    {
      id: 'w-discovery',
      dimension: 'W',
      aiMessage: '嘿！你有没有想过，为什么天空是蓝色的，但夕阳却是红色的呢？🌅',
      childResponsePatterns: [
        { keywords: ['因为', '光', '反射', '散射', '大气', '想知道', '为什么'], scoreRange: [75, 90], aiReply: '你的好奇心太强了！天空的颜色跟光的散射有关。你平时还会想哪些"为什么"呢？🔍' },
        { keywords: ['没想过', '不知道', '好看'], scoreRange: [40, 60], aiReply: '没关系！现在开始想也不晚。你有没有遇到过让你特别好奇的事情？😊' },
      ],
      defaultReply: '嗯嗯！你对周围的事物有自己的观察，这很棒！那我们来聊聊团队的事吧～',
      defaultNextDimension: 'L',
    },
    {
      id: 'i-problem',
      dimension: 'I',
      aiMessage: '假设你的遥控车突然不动了，你会怎么找出原因？🤖',
      childResponsePatterns: [
        { keywords: ['检查', '电池', '拆开', '试试', '测试', '排除'], scoreRange: [75, 90], aiReply: '系统性的排查方法！你很有科学家的潜质。那如果检查了电池还是不行呢？🔬' },
        { keywords: ['问', '换', '新的', '不知道'], scoreRange: [40, 55], aiReply: '求助也是方法之一！但试试自己动手检查，也许能发现有趣的东西呢！💡' },
      ],
      defaultReply: '你的想法挺实用的！那我们换个话题聊聊～',
      defaultNextDimension: 'D',
    },
    {
      id: 'l-team',
      dimension: 'L',
      aiMessage: '如果你和三个同学一起做手工作业，但有两个人吵起来了，你会怎么做？🤝',
      childResponsePatterns: [
        { keywords: ['劝', '调解', '沟通', '分工', '一起', '协调', '听'], scoreRange: [75, 90], aiReply: '你很有领导力和协调能力！这种能力在团队合作中特别重要。👍' },
        { keywords: ['不管', '自己', '老师', '不知道'], scoreRange: [40, 55], aiReply: '有时候找大人帮忙也是对的！不过试试看自己能不能解决，会有意想不到的收获哦！💪' },
      ],
      defaultReply: '你的想法值得思考！最后一个问题～',
      defaultNextDimension: 'R',
    },
    {
      id: 'd-innovate',
      dimension: 'D',
      aiMessage: '如果让你设计一个智能书包，它需要有哪些特别的功能？🎒',
      childResponsePatterns: [
        { keywords: ['自动', '提醒', '整理', '定位', '防水', '可以', '功能'], scoreRange: [75, 90], aiReply: '这些功能设计得太有创意了！你最想先实现哪个功能？🎨' },
        { keywords: ['不知道', '普通', '正常'], scoreRange: [40, 55], aiReply: '设计可以从最简单的想法开始！比如书包能不能自动提醒你带作业？😊' },
      ],
      defaultReply: '有想法就是好的开始！我们快结束了～',
      defaultNextDimension: 'R',
    },
    {
      id: 'r-reflect',
      dimension: 'R',
      aiMessage: '今天的聊天中，你觉得哪个问题让你想得最久？为什么？🪞',
      childResponsePatterns: [
        { keywords: ['因为', '让我思考', '没想过', '学到', '发现', '觉得'], scoreRange: [75, 90], aiReply: '能够识别让自己思考的问题，这本身就是一种很棒的能力！🌟 今天的对话到此结束，你表现得非常出色！' },
        { keywords: ['都一样', '没感觉', '不知道'], scoreRange: [40, 55], aiReply: '没关系！有时候反思需要时间。今天跟你聊天很有趣！🌈' },
      ],
      defaultReply: '谢谢你今天的分享！你是一个很有潜力的孩子！🌟',
    },
  ],
  'upper-primary': [
    {
      id: 'w-explore',
      dimension: 'W',
      aiMessage: '如果你能穿越到任何一个时代，你会选择什么时候？为什么？⏳',
      childResponsePatterns: [
        { keywords: ['因为', '想知道', '看看', '好奇', '探索', '了解', '未来', '古代'], scoreRange: [75, 90], aiReply: '你的好奇心驱动着深度思考！这种特质会带你发现别人看不到的世界。🔬' },
        { keywords: ['不知道', '没想过', '随便'], scoreRange: [40, 55], aiReply: '思考"如果"是一种很珍贵的能力。试着给自己一个"如果"的场景，看看会想到什么？🤔' },
      ],
      defaultReply: '你的思考角度很独特。让我们继续探索你的思维模式～',
      defaultNextDimension: 'I',
    },
    {
      id: 'i-analyze',
      dimension: 'I',
      aiMessage: '有人说"热水比冷水结冰更快"（姆潘巴效应），你怎么验证这个说法？🧪',
      childResponsePatterns: [
        { keywords: ['实验', '对照', '变量', '控制', '测量', '同时', '条件'], scoreRange: [75, 90], aiReply: '出色的科学思维！控制变量、设计对照实验——你具备真正的探究能力。🔬' },
        { keywords: ['查', '网上', '问老师', '不知道怎么'], scoreRange: [40, 55], aiReply: '查阅资料是好的起点！但如果能自己设计验证方法，你会发现更多。💡' },
      ],
      defaultReply: '探究力是一个可以持续培养的能力。让我们聊聊另一个维度～',
      defaultNextDimension: 'L',
    },
    {
      id: 'l-collaborate',
      dimension: 'L',
      aiMessage: '你在团队项目中，一个组员从不参与讨论，另一个总是否定别人的方案。你怎么处理？👥',
      childResponsePatterns: [
        { keywords: ['沟通', '私下', '分工', '倾听', '协调', '鼓励', '理解', '共识'], scoreRange: [75, 90], aiReply: '你展现了出色的团队协作和沟通策略！这种能力在任何领域都至关重要。🤝' },
        { keywords: ['不管', '自己做', '告老师', '算了'], scoreRange: [40, 55], aiReply: '有时候独立完成确实更高效，但团队的力量在于整合不同的优势。💪' },
      ],
      defaultReply: '团队协作是一种核心能力，你的思考很有价值～',
      defaultNextDimension: 'D',
    },
    {
      id: 'd-design',
      dimension: 'D',
      aiMessage: '如果给你一块空地和100万预算，你会设计一个什么样的社区空间？🏗️',
      childResponsePatterns: [
        { keywords: ['设计', '规划', '功能', '分区', '可持续', '社区', '需求', '方案'], scoreRange: [75, 90], aiReply: '你的设计思维很系统化！从需求分析到功能规划，这是优秀设计师的思维方式。🎨' },
        { keywords: ['不知道', '随便建', '普通的'], scoreRange: [40, 55], aiReply: '设计思维可以从模仿开始！试着观察你身边的公共空间，想想有什么可以改进的？🏙️' },
      ],
      defaultReply: '创造力的种子已经种下了～让我们进入最后一个话题',
      defaultNextDimension: 'R',
    },
    {
      id: 'r-meta',
      dimension: 'R',
      aiMessage: '回顾我们今天的对话，你在哪些问题上的回答最让你自己满意？为什么？🪞',
      childResponsePatterns: [
        { keywords: ['因为', '思考', '发现', '意识到', '学到', '没想过', '让我重新'], scoreRange: [75, 90], aiReply: '深度反思能力是你最大的财富之一。能从经验中学习的人，成长速度是最快的。🌟' },
        { keywords: ['都差不多', '没有特别', '不确定'], scoreRange: [40, 55], aiReply: '反思需要练习，但你在今天的对话中已经展现了思考的深度。继续保持！💪' },
      ],
      defaultReply: '今天的对话很有价值。你的思维模式展现了独特的潜力！🌟',
    },
  ],
  'middle-school': [
    {
      id: 'w-deep',
      dimension: 'W',
      aiMessage: '如果可以解开宇宙中的一个谜团，你会选择什么？为什么这个谜团对你如此吸引？🌌',
      childResponsePatterns: [
        { keywords: ['因为', '想知道', '为什么', '本质', '原理', '探索', '理解', '奥秘'], scoreRange: [75, 90], aiReply: '你对未知的驱动力令人印象深刻。这种深层的求知欲是创新者的核心特质。🔭' },
        { keywords: ['不知道', '没特别', '无所谓'], scoreRange: [40, 55], aiReply: '探索方向需要时间找到。也许今天的对话能给你一些启发。🤔' },
      ],
      defaultReply: '你的思考深度值得关注。让我们继续～',
      defaultNextDimension: 'I',
    },
    {
      id: 'i-research',
      dimension: 'I',
      aiMessage: '你如何判断一个科学发现是否可信？你会用哪些标准来评估？🔬',
      childResponsePatterns: [
        { keywords: ['证据', '验证', '同行评审', '可重复', '逻辑', '数据', '实验', '来源'], scoreRange: [75, 90], aiReply: '你具备了科研素养的基础——批判性思维和证据意识。这是探究力的核心。📊' },
        { keywords: ['看权威', '网上说的', '不知道'], scoreRange: [40, 55], aiReply: '权威可以作为参考，但独立验证才是科学精神的本质。💡' },
      ],
      defaultReply: '探究力的提升需要持续练习。让我们聊聊协作～',
      defaultNextDimension: 'L',
    },
    {
      id: 'l-lead',
      dimension: 'L',
      aiMessage: '在跨部门项目中，两个团队的目标完全冲突，你作为协调人如何处理？⚖️',
      childResponsePatterns: [
        { keywords: ['沟通', '共赢', '对齐', '优先级', '妥协', '整合', '协商', '利益'], scoreRange: [75, 90], aiReply: '你展现了高级的协作和领导能力。在复杂利益关系中找到平衡点，是非常稀缺的能力。🤝' },
        { keywords: ['不管', '选一边', '上面决定'], scoreRange: [40, 55], aiReply: '在复杂局面中，独立的判断力和协调力尤为重要。💪' },
      ],
      defaultReply: '协作能力值得持续深耕。让我们进入设计话题～',
      defaultNextDimension: 'D',
    },
    {
      id: 'd-system',
      dimension: 'D',
      aiMessage: '请设计一套提升校园环保效率的系统方案，涵盖技术、人员和文化三个层面。🌱',
      childResponsePatterns: [
        { keywords: ['系统', '方案', '流程', '激励', '技术', '文化', '分阶段', '闭环'], scoreRange: [75, 90], aiReply: '系统化设计思维！你能够从多维度、多层次构建解决方案，这是优秀设计力的体现。🎨' },
        { keywords: ['分类', '宣传', '不知道从哪开始'], scoreRange: [40, 55], aiReply: '从局部开始也是好的起点！逐步扩展到系统层面。🏗️' },
      ],
      defaultReply: '设计力是可以通过实践不断提升的。最后一个话题～',
      defaultNextDimension: 'R',
    },
    {
      id: 'r-deep',
      dimension: 'R',
      aiMessage: '今天的对话揭示了你的哪些思维特质？你如何利用这些认知来优化未来的决策？🪞',
      childResponsePatterns: [
        { keywords: ['发现', '意识到', '模式', '偏好', '调整', '改进', '策略', '认知'], scoreRange: [75, 90], aiReply: '元认知能力——对自己思维过程的觉察和调控——是最高级的反思形式。你展现出了这种能力。🌟' },
        { keywords: ['没特别', '不确定', '需要想想'], scoreRange: [40, 55], aiReply: '反思的深度需要积累。今天的对话已经为你提供了很好的素材。💪' },
      ],
      defaultReply: '感谢今天的深度对话！你的思维模式展现出了独特的潜力和发展方向。🌟',
    },
  ],
  'high-school': [
    {
      id: 'w-abstract',
      dimension: 'W',
      aiMessage: '如果科学可以消除人类所有的好奇心，换取绝对的确定性，你会支持吗？🧠',
      childResponsePatterns: [
        { keywords: ['不', '好奇', '驱动', '意义', '探索', '不确定性', '进步', '创新', '自由'], scoreRange: [75, 90], aiReply: '你对好奇心的价值有深层理解。不确定性是创新的土壤，而你是愿意在其中耕耘的人。🔭' },
        { keywords: ['也许', '确定性好', '看情况'], scoreRange: [40, 55], aiReply: '权衡利弊是成熟的思维方式。但好奇心的价值也许比我们直觉感受到的更深远。🤔' },
      ],
      defaultReply: '你的思考角度很有深度。让我们继续探索～',
      defaultNextDimension: 'I',
    },
    {
      id: 'i-epistemology',
      dimension: 'I',
      aiMessage: '你如何区分"我知道"和"我相信我知道"？在什么条件下你会改变自己的认知框架？🧪',
      childResponsePatterns: [
        { keywords: ['证据', '验证', '证伪', '认知偏差', '确认偏误', '更新', '贝叶斯', '范式'], scoreRange: [75, 90], aiReply: '你的认识论素养令人印象深刻。能够质疑自身认知框架的人，才具备真正的探究力。📊' },
        { keywords: ['不确定', '直觉', '看情况'], scoreRange: [40, 55], aiReply: '区分"知道"和"相信知道"确实是哲学难题，但意识到这个问题本身已经是重要的第一步。💡' },
      ],
      defaultReply: '探究力的本质是对真理的持续追求。继续～',
      defaultNextDimension: 'L',
    },
    {
      id: 'l-complex',
      dimension: 'L',
      aiMessage: '作为跨文化团队的领导者，你如何处理价值观的根本性冲突？🌍',
      childResponsePatterns: [
        { keywords: ['尊重', '理解', '求同存异', '沟通', '文化', '框架', '包容', '建设性'], scoreRange: [75, 90], aiReply: '你在跨文化协作中展现了深度理解和建设性态度。这是全球化时代最稀缺的能力之一。🤝' },
        { keywords: ['规则', '效率', '统一', '服从'], scoreRange: [40, 55], aiReply: '标准化有其实用价值，但真正的跨文化领导力在于差异中找到创造力。💪' },
      ],
      defaultReply: '协作的最高形式是在差异中创造价值。进入设计话题～',
      defaultNextDimension: 'D',
    },
    {
      id: 'd-strategic',
      dimension: 'D',
      aiMessage: '设计一个解决"信息茧房"问题的产品方案，需要同时考虑技术可行性和社会影响。🎯',
      childResponsePatterns: [
        { keywords: ['算法', '推荐', '多样性', '用户', '设计', '平衡', '系统', '伦理'], scoreRange: [75, 90], aiReply: '你在设计中兼顾了技术可行性和社会责任，这是顶尖设计思维的标志。🎨' },
        { keywords: ['不容易', '限制', '基本功能'], scoreRange: [40, 55], aiReply: '识别问题的复杂性是设计的第一步。逐步深入，你会找到突破点。🏗️' },
      ],
      defaultReply: '设计思维需要勇气和创造力的结合。最后一个问题～',
      defaultNextDimension: 'R',
    },
    {
      id: 'r-meta-cognition',
      dimension: 'R',
      aiMessage: '回溯今天的对话，你的回答模式揭示了什么关于你思维结构的信息？你如何利用这种自我认知？🪞',
      childResponsePatterns: [
        { keywords: ['模式', '偏好', '倾向', '认知风格', '盲点', '调整', '优化', '元认知'], scoreRange: [75, 90], aiReply: '你展现了最高级的反思能力——元认知。对思维过程的觉察和调控是成长的终极杠杆。🌟' },
        { keywords: ['需要更多时间', '不确定', '部分看到'], scoreRange: [40, 55], aiReply: '元认知需要持续修炼。今天的对话为你的自我觉察提供了有价值的参考点。💪' },
      ],
      defaultReply: '感谢这次深度对话。你的思维展现了独特的深度和潜力。🌟',
    },
  ],
}

// ===================================================================
// 对话编排器主类
// ===================================================================

export class ConversationOrchestrator {
  private state: ConversationState
  private scriptedTree: ScriptedDialogueNode[]
  private currentNodeIndex: number = 0
  private signalExtractor: OpenEndedSignalExtractor

  constructor(childProfile: { name: string; age: number; ageGroup: AgeGroupKey }, config?: Partial<OrchestratorConfig>) {
    this.state = {
      messages: [],
      signals: [],
      turnCount: 0,
      maxTurns: config?.maxTurns || 10,
      currentPhase: 'warmup',
      coveredDimensions: new Set(),
      estimatedScores: {},
      childProfile,
    }

    this.scriptedTree = SCRIPTED_DIALOGUE_TREE[childProfile.ageGroup] || SCRIPTED_DIALOGUE_TREE['upper-primary']
    this.signalExtractor = createSignalExtractor(childProfile.age)
  }

  /** 开始对话 */
  startConversation(): ConversationMessage {
    const firstNode = this.scriptedTree[0]
    if (!firstNode) {
      return this.createMessage('ai', `你好${this.state.childProfile.name}！让我们开始一段有趣的对话吧！`)
    }

    const message = this.createMessage('ai', firstNode.aiMessage, {
      targetDimension: firstNode.dimension,
      turnType: 'opening',
    })

    this.state.messages.push(message)
    this.state.currentPhase = 'explore'

    return message
  }

  /** 处理开放式文字回复（使用语义信号提取） */
  processOpenEndedResponse(childMessage: string, targetDimension?: string): {
    aiMessage: ConversationMessage
    extractionResult: SignalExtractionResult
    shouldFollowUp: boolean
    followUpQuestion?: string
  } {
    // 记录儿童消息
    const childMsg = this.createMessage('child', childMessage)
    this.state.messages.push(childMsg)

    // 使用开放式信号提取器
    const dimension: WilderDimension = (targetDimension || this.getCurrentDimension() || 'W') as WilderDimension
    const extractionResult = this.signalExtractor.extract(childMessage, dimension)

    // 将提取结果转换为传统信号格式
    const signals: DimensionSignal[] = Object.entries(extractionResult.signals).map(([dim, strength]) => ({
      dimension: dim,
      strength: strength / 5, // 转换为 0-1 范围
      evidence: extractionResult.reasoning || `开放式回复: ${childMessage.slice(0, 50)}...`,
      source: 'pattern' as const,
    }))

    this.state.signals.push(...signals)

    // 更新估算分数
    this.updateEstimatedScores(signals)

    // 标记已覆盖的维度
    this.state.coveredDimensions.add(dimension)

    this.state.turnCount++
    this.state.currentPhase = this.determinePhase()

    // 判断是否需要追问（置信度低于60或文本质量较低）
    const shouldFollowUp = extractionResult.confidence < 60
    let followUpQuestion: string | undefined

    if (shouldFollowUp) {
      followUpQuestion = this.signalExtractor.generateFollowUp(
        childMessage,
        dimension,
        extractionResult
      )
    }

    // 生成AI回复
    const aiReply = shouldFollowUp
      ? `谢谢你的分享！${extractionResult.reasoning ? extractionResult.reasoning + '\n\n' : ''}${followUpQuestion}`
      : extractionResult.reasoning
        ? `你的想法很有深度！${extractionResult.reasoning}`
        : '谢谢你的分享！你的想法很有意思。'

    const aiMessage = this.createMessage('ai', aiReply, {
      targetDimension: dimension,
      turnType: shouldFollowUp ? 'probing' : 'exploration',
    })

    this.state.messages.push(aiMessage)

    return {
      aiMessage,
      extractionResult,
      shouldFollowUp,
      followUpQuestion,
    }
  }

  /** 生成自适应追问 */
  generateAdaptiveFollowUp(previousResponse: string, targetDimension?: string): string {
    const dimension: WilderDimension = (targetDimension || this.getCurrentDimension() || 'W') as WilderDimension

    // 先分析文本质量
    const quality = this.signalExtractor.analyzeQuality(previousResponse)

    // 根据质量生成不同深度的追问
    if (quality.length < 20) {
      // 短回复 -> 引导式追问
      return `你能再多说一些吗？比如为什么你会这样想呢？`
    } else if (quality.hasReasoning) {
      // 已有推理 -> 深化追问
      return `基于你的分析，如果情况反过来会怎样？你会得出不同的结论吗？`
    } else if (quality.hasCreativity) {
      // 有创意 -> 扩展追问
      return `这个想法很有趣！如果要把这个创意付诸实践，你觉得第一步应该做什么？`
    } else if (quality.hasEmpathy) {
      // 有共情 -> 情境追问
      return `如果你是对方，你希望得到什么样的帮助或支持？`
    }

    // 默认追问
    return `你能举个例子或者详细说明你的想法吗？`
  }

  /** 获取当前维度 */
  private getCurrentDimension(): string | null {
    const currentNode = this.scriptedTree[this.currentNodeIndex]
    return currentNode?.dimension || null
  }

  /** 处理儿童回答 */
  processChildResponse(childMessage: string): ConversationMessage {
    // 记录儿童消息
    const childMsg = this.createMessage('child', childMessage)
    this.state.messages.push(childMsg)

    // 提取维度信号
    const signals = extractSignals(childMessage)
    this.state.signals.push(...signals)

    // 更新维度估算分数
    this.updateEstimatedScores(signals)

    // 标记已覆盖的维度
    const currentNode = this.scriptedTree[this.currentNodeIndex]
    if (currentNode) {
      this.state.coveredDimensions.add(currentNode.dimension)
    }

    // 匹配脚本节点中的响应
    const aiReply = this.matchScriptedResponse(childMessage)
    const nextNode = this.getNextNode(childMessage)

    this.state.turnCount++
    this.state.currentPhase = this.determinePhase()

    // 如果有下一个节点，准备下一轮
    if (nextNode) {
      this.currentNodeIndex = this.scriptedTree.indexOf(nextNode)
    }

    const aiMessage = this.createMessage('ai', aiReply, {
      targetDimension: nextNode?.dimension,
      turnType: this.state.currentPhase === 'closing' ? 'closing' : 'exploration',
    })

    this.state.messages.push(aiMessage)
    return aiMessage
  }

  /** 获取当前对话状态 */
  getState(): ConversationState {
    return { ...this.state, coveredDimensions: new Set(this.state.coveredDimensions) }
  }

  /** 获取估算的维度分数 */
  getEstimatedScores(): Record<string, number> {
    return { ...this.state.estimatedScores }
  }

  /** 对话是否结束 */
  isComplete(): boolean {
    return this.state.turnCount >= this.state.maxTurns || this.state.currentPhase === 'closing'
  }

  /** 获取下一轮的AI开场语（如果有下一个节点） */
  getNextOpeningMessage(): ConversationMessage | null {
    const nextNode = this.scriptedTree[this.currentNodeIndex]
    if (!nextNode) return null

    const message = this.createMessage('ai', nextNode.aiMessage, {
      targetDimension: nextNode.dimension,
      turnType: 'exploration',
    })
    this.state.messages.push(message)
    return message
  }

  // ========== 私有方法 ==========

  private matchScriptedResponse(childMessage: string): string {
    const node = this.scriptedTree[this.currentNodeIndex]
    if (!node) return '谢谢你的分享！我们的对话很有价值。🌟'

    const normalizedMsg = childMessage.toLowerCase()

    for (const pattern of node.childResponsePatterns) {
      for (const keyword of pattern.keywords) {
        if (normalizedMsg.includes(keyword)) {
          return pattern.aiReply
        }
      }
    }

    return node.defaultReply
  }

  private getNextNode(childMessage: string): ScriptedDialogueNode | null {
    const node = this.scriptedTree[this.currentNodeIndex]
    if (!node) return null

    const normalizedMsg = childMessage.toLowerCase()

    // 检查是否匹配了特定的下一步维度
    for (const pattern of node.childResponsePatterns) {
      for (const keyword of pattern.keywords) {
        if (normalizedMsg.includes(keyword) && pattern.nextDimension) {
          return this.scriptedTree.find(n => n.dimension === pattern.nextDimension) || null
        }
      }
    }

    // 默认下一步
    if (node.defaultNextDimension) {
      return this.scriptedTree.find(n => n.dimension === node.defaultNextDimension) || null
    }

    // 顺序推进
    const nextIdx = this.currentNodeIndex + 1
    return nextIdx < this.scriptedTree.length ? this.scriptedTree[nextIdx] : null
  }

  private updateEstimatedScores(signals: DimensionSignal[]): void {
    for (const signal of signals) {
      const currentScore = this.state.estimatedScores[signal.dimension] || 50
      // 使用加权移动平均更新分数
      const weight = 0.3
      const newScore = currentScore * (1 - weight) + (signal.strength * 100) * weight
      this.state.estimatedScores[signal.dimension] = Math.round(newScore)
    }

    // 确保所有维度都有估算分数
    for (const dim of ['W', 'I', 'L', 'D', 'E', 'R']) {
      if (!this.state.estimatedScores[dim]) {
        this.state.estimatedScores[dim] = 50
      }
    }
  }

  private determinePhase(): 'warmup' | 'explore' | 'focus' | 'verify' | 'closing' {
    if (this.state.turnCount >= this.state.maxTurns - 1) return 'closing'
    if (this.state.turnCount <= 1) return 'warmup'
    if (this.state.coveredDimensions.size >= 4) return 'verify'
    if (this.state.coveredDimensions.size >= 2) return 'focus'
    return 'explore'
  }

  private createMessage(
    role: 'ai' | 'child' | 'system',
    content: string,
    metadata?: ConversationMessage['metadata'],
  ): ConversationMessage {
    return {
      id: `msg_${this.state.messages.length}_${Date.now()}`,
      role,
      content,
      timestamp: Date.now(),
      metadata,
    }
  }
}
