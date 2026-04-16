// ===================================================================
// WILDER 星球探险 - 关卡设计
// 6个维度 × 3个挑战 = 18个挑战点
// ===================================================================

import type { MiniGameChallenge, WilderDimension } from './types'

/**
 * 好奇心(W) - 探索未知星球区域
 * 评估倾向：主动探索、观察细节、提出假设
 */
export const WONDER_CHALLENGES: MiniGameChallenge[] = [
  {
    id: 'W-1',
    dimension: 'W',
    dimensionName: '好奇心',
    type: 'exploration',
    difficulty: 1,
    title: '神秘信号',
    scenario: '你在 WILDER 星球表面巡逻时，探测器突然接收到一段神秘的信号...',
    question: '你会怎么做？',
    options: [
      {
        id: 'a',
        text: '立刻追踪信号来源，看看是什么',
        emoji: '📡',
        dimensionScores: { W: 4, I: 2, L: 0, D: 0, E: 0, R: 1 },
        narrativeFeedback: '你充满探索精神！主动寻找未知是科学家的重要品质。',
      },
      {
        id: 'b',
        text: '先记录信号特征，分析规律后再行动',
        emoji: '📝',
        dimensionScores: { W: 3, I: 4, L: 0, D: 1, E: 0, R: 1 },
        narrativeFeedback: '你不仅有好奇心，还懂得先观察分析，这是科学探究的好习惯！',
      },
      {
        id: 'c',
        text: '先告诉 AI 伙伴，一起商量再决定',
        emoji: '🤖',
        dimensionScores: { W: 2, I: 1, L: 3, D: 0, E: 1, R: 0 },
        narrativeFeedback: '你懂得合作分享，这是很好的团队意识！',
      },
      {
        id: 'd',
        text: '信号可能有危险，先远离再说',
        emoji: '⚠️',
        dimensionScores: { W: 1, I: 1, L: 0, D: 0, E: 0, R: 2 },
        narrativeFeedback: '谨慎是好事，但有时候冒险才能有新发现哦！',
      },
    ],
  },
  {
    id: 'W-2',
    dimension: 'W',
    dimensionName: '好奇心',
    type: 'exploration',
    difficulty: 2,
    title: '发光植物',
    scenario: '你发现了一片会发光的植物森林，每棵植物发出不同颜色的光...',
    question: '你最想弄清楚什么？',
    options: [
      {
        id: 'a',
        text: '为什么这些植物会发光？',
        emoji: '💡',
        dimensionScores: { W: 4, I: 2, L: 0, D: 0, E: 0, R: 0 },
        narrativeFeedback: '追问"为什么"是好奇心的核心表现！',
      },
      {
        id: 'b',
        text: '不同颜色的光有什么作用？',
        emoji: '🌈',
        dimensionScores: { W: 3, I: 3, L: 0, D: 1, E: 0, R: 0 },
        narrativeFeedback: '你关注细节差异，这是敏锐的观察力！',
      },
      {
        id: 'c',
        text: '这些植物能不能吃？有没有毒？',
        emoji: '🍃',
        dimensionScores: { W: 2, I: 2, L: 0, D: 0, E: 0, R: 2 },
        narrativeFeedback: '你懂得先考虑安全问题，很谨慎！',
      },
      {
        id: 'd',
        text: '能不能带一些回去研究？',
        emoji: '🔬',
        dimensionScores: { W: 3, I: 3, L: 0, D: 2, E: 0, R: 0 },
        narrativeFeedback: '你有实验研究的意识，这是科学家的思维！',
      },
    ],
  },
  {
    id: 'W-3',
    dimension: 'W',
    dimensionName: '好奇心',
    type: 'exploration',
    difficulty: 3,
    title: '奇怪的地形',
    scenario: '地图显示前方有一片区域地形很奇怪，像是被什么东西改造过...',
    question: '你的第一反应是？',
    options: [
      {
        id: 'a',
        text: '太酷了！我要去实地看看',
        emoji: '🗺️',
        dimensionScores: { W: 4, I: 1, L: 0, D: 0, E: 0, R: 1 },
        narrativeFeedback: '你对未知充满热情，这是探索者的精神！',
      },
      {
        id: 'b',
        text: '会不会是外星生物建造的？',
        emoji: '👽',
        dimensionScores: { W: 4, I: 3, L: 0, D: 1, E: 0, R: 0 },
        narrativeFeedback: '你的想象力很丰富，还能提出合理的假设！',
      },
      {
        id: 'c',
        text: '先用卫星地图放大看看',
        emoji: '🛰️',
        dimensionScores: { W: 2, I: 4, L: 0, D: 1, E: 0, R: 0 },
        narrativeFeedback: '你懂得利用工具先做远程观察，这是聪明的做法！',
      },
      {
        id: 'd',
        text: '在笔记上记录这个发现，回去查资料',
        emoji: '📓',
        dimensionScores: { W: 2, I: 2, L: 0, D: 1, E: 0, R: 3 },
        narrativeFeedback: '你有记录和查证的习惯，这是严谨的科学态度！',
      },
    ],
  },
]

/**
 * 洞察力(I) - 模式识别与逻辑推理
 * 评估倾向：找规律、分类、因果推理
 */
export const INQUIRY_CHALLENGES: MiniGameChallenge[] = [
  {
    id: 'I-1',
    dimension: 'I',
    dimensionName: '洞察力',
    type: 'pattern',
    difficulty: 2,
    title: '信号解码',
    scenario: '你截获了一段重复的外星信号：●●○●●●○○●●●●○○○...',
    question: '接下来应该是什么？',
    options: [
      {
        id: 'a',
        text: '●●●●●○○○○（黑球加一，白球加一）',
        emoji: '🔮',
        dimensionScores: { W: 0, I: 4, L: 0, D: 0, E: 0, R: 0 },
        narrativeFeedback: '你发现了规律！每次黑球和白球各增加一个，洞察力很强！',
      },
      {
        id: 'b',
        text: '●●●●●●○○○○○（继续递增）',
        emoji: '📊',
        dimensionScores: { W: 0, I: 2, L: 0, D: 0, E: 0, R: 0 },
        narrativeFeedback: '你看到了递增趋势，但需要更仔细观察具体规律。',
      },
      {
        id: 'c',
        text: '●○●○●○（交替出现）',
        emoji: '🔄',
        dimensionScores: { W: 0, I: 1, L: 0, D: 0, E: 0, R: 0 },
        narrativeFeedback: '交替模式很常见，但这里的规律更复杂一些。',
      },
      {
        id: 'd',
        text: '我想画出来找规律',
        emoji: '✏️',
        dimensionScores: { W: 1, I: 3, L: 0, D: 1, E: 0, R: 2 },
        narrativeFeedback: '用可视化方法找规律，这是很好的解题策略！',
      },
    ],
  },
  {
    id: 'I-2',
    dimension: 'I',
    dimensionName: '洞察力',
    type: 'puzzle',
    difficulty: 3,
    title: '分类任务',
    scenario: '你收集了 8 种矿石样本，需要从不同角度分类它们...',
    question: '你觉得最合理的分类方式是？',
    options: [
      {
        id: 'a',
        text: '按颜色分：红色系、蓝色系、绿色系',
        emoji: '🎨',
        dimensionScores: { W: 0, I: 2, L: 0, D: 0, E: 0, R: 0 },
        narrativeFeedback: '颜色是直观的分类标准，但可能不是最本质的。',
      },
      {
        id: 'b',
        text: '按硬度分：软、中、硬三个等级',
        emoji: '💎',
        dimensionScores: { W: 0, I: 3, L: 0, D: 1, E: 0, R: 0 },
        narrativeFeedback: '物理属性是科学的分类角度！',
      },
      {
        id: 'c',
        text: '按含金属量分：高、中、低',
        emoji: '⚙️',
        dimensionScores: { W: 0, I: 4, L: 0, D: 1, E: 0, R: 0 },
        narrativeFeedback: '化学成分是最本质的分类方式，洞察力很强！',
      },
      {
        id: 'd',
        text: '我会尝试多种分类方式，看看哪种最有意义',
        emoji: '🔀',
        dimensionScores: { W: 1, I: 4, L: 0, D: 2, E: 0, R: 1 },
        narrativeFeedback: '多维度尝试分类，这是系统思维的表现！',
      },
    ],
  },
  {
    id: 'I-3',
    dimension: 'I',
    dimensionName: '洞察力',
    type: 'puzzle',
    difficulty: 3,
    title: '因果推理',
    scenario: '星球上一种特有的能量水晶突然变暗淡了，可能是什么原因？',
    question: '你认为最需要调查的方向是？',
    options: [
      {
        id: 'a',
        text: '是不是能量来源被切断了',
        emoji: '⚡',
        dimensionScores: { W: 0, I: 4, L: 0, D: 0, E: 0, R: 0 },
        narrativeFeedback: '你直接关注核心因果关系，推理能力强！',
      },
      {
        id: 'b',
        text: '是不是环境条件变了（温度、湿度）',
        emoji: '🌡️',
        dimensionScores: { W: 1, I: 3, L: 0, D: 0, E: 0, R: 0 },
        narrativeFeedback: '你考虑到了外部变量的影响！',
      },
      {
        id: 'c',
        text: '会不会是水晶本身的寿命到了',
        emoji: '⏳',
        dimensionScores: { W: 0, I: 2, L: 0, D: 0, E: 0, R: 1 },
        narrativeFeedback: '你考虑了内部因素，思路全面！',
      },
      {
        id: 'd',
        text: '设计一个实验来验证各种可能性',
        emoji: '🧪',
        dimensionScores: { W: 1, I: 4, L: 0, D: 3, E: 0, R: 1 },
        narrativeFeedback: '用实验验证假设，这是标准的科学方法！',
      },
    ],
  },
]

/**
 * 连接力(L) - 资源分配与团队协作
 * 评估倾向：共情、协调、帮助他人
 */
export const LINK_CHALLENGES: MiniGameChallenge[] = [
  {
    id: 'L-1',
    dimension: 'L',
    dimensionName: '连接力',
    type: 'resource',
    difficulty: 2,
    title: '能量分配',
    scenario: '你的飞船只剩下 3 格能量，前方有三个求救信号...',
    question: '你会怎么分配？',
    options: [
      {
        id: 'a',
        text: '全部能量去救最近的，确保至少救一个',
        emoji: '🎯',
        dimensionScores: { W: 0, I: 1, L: 2, D: 0, E: 0, R: 1 },
        narrativeFeedback: '你懂得集中力量确保成功，很务实！',
      },
      {
        id: 'b',
        text: '每个分配 1 格，试试看能帮多少',
        emoji: '⚖️',
        dimensionScores: { W: 0, I: 1, L: 4, D: 0, E: 0, R: 0 },
        narrativeFeedback: '你希望尽可能帮助更多人，很有同情心！',
      },
      {
        id: 'c',
        text: '先了解三个求救者的情况再做决定',
        emoji: '🔍',
        dimensionScores: { W: 1, I: 2, L: 3, D: 1, E: 0, R: 1 },
        narrativeFeedback: '先收集信息再做决策，这是负责任的做法！',
      },
      {
        id: 'd',
        text: '用 2 格能量发信号请求总部支援',
        emoji: '📡',
        dimensionScores: { W: 0, I: 2, L: 3, D: 2, E: 0, R: 1 },
        narrativeFeedback: '你懂得寻求外部资源，这是系统思维！',
      },
    ],
  },
  {
    id: 'L-2',
    dimension: 'L',
    dimensionName: '连接力',
    type: 'dialogue',
    difficulty: 3,
    title: '调解冲突',
    scenario: '两个外星种族因为资源问题争吵，他们都来找你评理...',
    question: '你第一步会做什么？',
    options: [
      {
        id: 'a',
        text: '分别听两边说，了解各自的立场',
        emoji: '👂',
        dimensionScores: { W: 0, I: 1, L: 4, D: 0, E: 2, R: 0 },
        narrativeFeedback: '你懂得倾听是调解的第一步，情商很高！',
      },
      {
        id: 'b',
        text: '把他们叫到一起，当面说清楚',
        emoji: '🤝',
        dimensionScores: { W: 0, I: 1, L: 3, D: 0, E: 3, R: 0 },
        narrativeFeedback: '你重视直接沟通，这是高效的解决方式！',
      },
      {
        id: 'c',
        text: '先调查资源到底够不够分',
        emoji: '📊',
        dimensionScores: { W: 0, I: 3, L: 2, D: 1, E: 0, R: 0 },
        narrativeFeedback: '你从事实出发，这是理性的调解方式！',
      },
      {
        id: 'd',
        text: '提出一个双方都能接受的分配方案',
        emoji: '💡',
        dimensionScores: { W: 0, I: 2, L: 3, D: 3, E: 1, R: 0 },
        narrativeFeedback: '你主动提出解决方案，这是领导者的思维！',
      },
    ],
  },
  {
    id: 'L-3',
    dimension: 'L',
    dimensionName: '连接力',
    type: 'resource',
    difficulty: 3,
    title: '帮助新伙伴',
    scenario: '一个新来的探险队员什么都不会，总是拖团队后腿...',
    question: '你会怎么做？',
    options: [
      {
        id: 'a',
        text: '主动教他，耐心地一步步带',
        emoji: '📚',
        dimensionScores: { W: 0, I: 0, L: 4, D: 0, E: 2, R: 1 },
        narrativeFeedback: '你愿意帮助他人成长，这是很好的团队品质！',
      },
      {
        id: 'b',
        text: '给他安排简单的工作，发挥他的长处',
        emoji: '🎯',
        dimensionScores: { W: 0, I: 1, L: 3, D: 2, E: 0, R: 0 },
        narrativeFeedback: '你懂得发现他人的长处，这是优秀的领导力！',
      },
      {
        id: 'c',
        text: '让他自己先学，有需要再来问我',
        emoji: '📖',
        dimensionScores: { W: 0, I: 0, L: 2, D: 0, E: 0, R: 2 },
        narrativeFeedback: '你鼓励自主学习，但有时主动帮助会更好！',
      },
      {
        id: 'd',
        text: '跟队长说，让专业的人来培训',
        emoji: '👨‍🏫',
        dimensionScores: { W: 0, I: 0, L: 2, D: 1, E: 1, R: 0 },
        narrativeFeedback: '你懂得寻求专业资源，这是聪明的做法！',
      },
    ],
  },
]

/**
 * 设计力(D) - 搭建与问题解决
 * 评估倾向：创意、系统思维、方案设计
 */
export const DESIGN_CHALLENGES: MiniGameChallenge[] = [
  {
    id: 'D-1',
    dimension: 'D',
    dimensionName: '设计力',
    type: 'building',
    difficulty: 2,
    title: '搭建桥梁',
    scenario: '你面前有一条宽 10 米的峡谷，手边有木板、绳索、石头...',
    question: '你会怎么设计这座桥？',
    options: [
      {
        id: 'a',
        text: '用木板搭一座简单的独木桥',
        emoji: '🪵',
        dimensionScores: { W: 0, I: 1, L: 0, D: 2, E: 0, R: 0 },
        narrativeFeedback: '简单直接的方案，实用但承重有限。',
      },
      {
        id: 'b',
        text: '用绳索做吊桥，两端固定在石头上',
        emoji: '🌉',
        dimensionScores: { W: 0, I: 2, L: 0, D: 4, E: 0, R: 1 },
        narrativeFeedback: '吊桥设计很有创意，还考虑到了材料特性！',
      },
      {
        id: 'c',
        text: '先测量宽度，计算需要多少材料再动手',
        emoji: '📏',
        dimensionScores: { W: 0, I: 3, L: 0, D: 3, E: 0, R: 1 },
        narrativeFeedback: '先规划再实施，这是工程师的思维！',
      },
      {
        id: 'd',
        text: '能不能找到其他方法过河，不一定建桥',
        emoji: '🤔',
        dimensionScores: { W: 1, I: 2, L: 0, D: 3, E: 0, R: 0 },
        narrativeFeedback: '跳出框架思考，不局限于给定方案！',
      },
    ],
  },
  {
    id: 'D-2',
    dimension: 'D',
    dimensionName: '设计力',
    type: 'building',
    difficulty: 3,
    title: '庇护所设计',
    scenario: '暴风雨来了，你需要在 30 分钟内搭一个临时庇护所...',
    question: '你的设计方案是？',
    options: [
      {
        id: 'a',
        text: '用大树叶和树枝搭一个简单的三角形棚子',
        emoji: '🏠',
        dimensionScores: { W: 0, I: 1, L: 0, D: 2, E: 0, R: 2 },
        narrativeFeedback: '三角形结构稳定，是实用的选择！',
      },
      {
        id: 'b',
        text: '找一个天然洞穴，用材料加固入口',
        emoji: '🕳️',
        dimensionScores: { W: 0, I: 2, L: 0, D: 3, E: 0, R: 1 },
        narrativeFeedback: '利用自然环境，省时又安全！',
      },
      {
        id: 'c',
        text: '挖一个地洞，上面用材料遮盖',
        emoji: '⛺',
        dimensionScores: { W: 0, I: 1, L: 0, D: 3, E: 0, R: 2 },
        narrativeFeedback: '地下庇护所防风效果好，考虑周到！',
      },
      {
        id: 'd',
        text: '先观察周围环境，看有没有现成的材料或地形可以利用',
        emoji: '👀',
        dimensionScores: { W: 1, I: 3, L: 0, D: 3, E: 0, R: 1 },
        narrativeFeedback: '先观察再决策，这是优秀设计师的习惯！',
      },
    ],
  },
  {
    id: 'D-3',
    dimension: 'D',
    dimensionName: '设计力',
    type: 'building',
    difficulty: 4,
    title: '能源系统',
    scenario: '基地需要一个可持续的能源系统，你有太阳能板、风力发电机、电池...',
    question: '你会怎么设计能源方案？',
    options: [
      {
        id: 'a',
        text: '全部用太阳能，简单可靠',
        emoji: '☀️',
        dimensionScores: { W: 0, I: 1, L: 0, D: 2, E: 0, R: 0 },
        narrativeFeedback: '单一能源有局限性，阴天怎么办？',
      },
      {
        id: 'b',
        text: '太阳能 + 风力发电混合，阴天有风',
        emoji: '🌬️',
        dimensionScores: { W: 0, I: 2, L: 0, D: 4, E: 0, R: 0 },
        narrativeFeedback: '混合能源系统更稳定，设计思维成熟！',
      },
      {
        id: 'c',
        text: '太阳能为主，电池储能，风力备用',
        emoji: '🔋',
        dimensionScores: { W: 0, I: 3, L: 0, D: 4, E: 0, R: 1 },
        narrativeFeedback: '主次分明 + 储能 + 备用，这是专业的系统设计！',
      },
      {
        id: 'd',
        text: '先算基地每天需要多少电，再匹配方案',
        emoji: '📊',
        dimensionScores: { W: 0, I: 3, L: 0, D: 4, E: 0, R: 1 },
        narrativeFeedback: '需求驱动设计，这是工程师的标准流程！',
      },
    ],
  },
]

/**
 * 表达力(E) - 沟通与说服
 * 评估倾向：语言表达、共情、说服技巧
 */
export const EXPRESSION_CHALLENGES: MiniGameChallenge[] = [
  {
    id: 'E-1',
    dimension: 'E',
    dimensionName: '表达力',
    type: 'dialogue',
    difficulty: 2,
    title: '说服长老',
    scenario: '你需要说服外星部落的长老们允许你进入他们的圣地调查...',
    question: '你会怎么说？',
    options: [
      {
        id: 'a',
        text: '解释我的研究对他们也有好处',
        emoji: '💡',
        dimensionScores: { W: 0, I: 1, L: 1, D: 0, E: 3, R: 0 },
        narrativeFeedback: '从对方利益出发，这是有效的说服策略！',
      },
      {
        id: 'b',
        text: '表达对他们文化的尊重和好奇',
        emoji: '🙏',
        dimensionScores: { W: 1, I: 0, L: 2, D: 0, E: 3, R: 0 },
        narrativeFeedback: '尊重是沟通的基础，情商很高！',
      },
      {
        id: 'c',
        text: '展示我之前的研究成果，证明我的能力',
        emoji: '📋',
        dimensionScores: { W: 0, I: 2, L: 0, D: 0, E: 2, R: 0 },
        narrativeFeedback: '用实力说话，但可能不够温暖。',
      },
      {
        id: 'd',
        text: '先了解长老们最关心什么，再针对性沟通',
        emoji: '🎯',
        dimensionScores: { W: 0, I: 1, L: 2, D: 1, E: 4, R: 0 },
        narrativeFeedback: '先理解再说服，这是最高级的沟通技巧！',
      },
    ],
  },
  {
    id: 'E-2',
    dimension: 'E',
    dimensionName: '表达力',
    type: 'dialogue',
    difficulty: 3,
    title: '团队演讲',
    scenario: '你需要向全队汇报你的发现，大家都等着听...',
    question: '你会怎么组织你的汇报？',
    options: [
      {
        id: 'a',
        text: '按时间顺序，从头到尾讲一遍',
        emoji: '⏰',
        dimensionScores: { W: 0, I: 0, L: 0, D: 1, E: 2, R: 0 },
        narrativeFeedback: '时间线清晰，但可能不够吸引人。',
      },
      {
        id: 'b',
        text: '先说最重要的发现，引起大家兴趣',
        emoji: '🎤',
        dimensionScores: { W: 0, I: 1, L: 0, D: 1, E: 4, R: 0 },
        narrativeFeedback: '先声夺人，这是很好的演讲技巧！',
      },
      {
        id: 'c',
        text: '用图表和数据说话，让大家直观看到',
        emoji: '📊',
        dimensionScores: { W: 0, I: 3, L: 0, D: 2, E: 2, R: 0 },
        narrativeFeedback: '数据可视化让表达更有说服力！',
      },
      {
        id: 'd',
        text: '讲一个故事，把发现融入到冒险经历中',
        emoji: '📖',
        dimensionScores: { W: 1, I: 0, L: 1, D: 2, E: 4, R: 0 },
        narrativeFeedback: '故事化表达最能打动人，你是天生的演讲者！',
      },
    ],
  },
  {
    id: 'E-3',
    dimension: 'E',
    dimensionName: '表达力',
    type: 'dialogue',
    difficulty: 3,
    title: '安慰同伴',
    scenario: '一个同伴因为任务失败很沮丧，不知道该怎么安慰...',
    question: '你会怎么说？',
    options: [
      {
        id: 'a',
        text: '"没关系，下次一定会成功的！"',
        emoji: '😊',
        dimensionScores: { W: 0, I: 0, L: 2, D: 0, E: 2, R: 1 },
        narrativeFeedback: '鼓励是好的，但可能忽略了对方真实感受。',
      },
      {
        id: 'b',
        text: '"我知道你现在很难过，我陪你聊聊吧"',
        emoji: '💬',
        dimensionScores: { W: 0, I: 0, L: 3, D: 0, E: 4, R: 0 },
        narrativeFeedback: '先共情再陪伴，这是成熟的沟通方式！',
      },
      {
        id: 'c',
        text: '"我上次也失败了，后来我是这样解决的..."',
        emoji: '🤗',
        dimensionScores: { W: 0, I: 1, L: 2, D: 0, E: 3, R: 1 },
        narrativeFeedback: '分享自己的经历，拉近距离！',
      },
      {
        id: 'd',
        text: '"失败很正常，我们一起来看看哪里出了问题"',
        emoji: '🔍',
        dimensionScores: { W: 0, I: 2, L: 1, D: 1, E: 3, R: 2 },
        narrativeFeedback: '引导反思，既安慰又帮助成长！',
      },
    ],
  },
]

/**
 * 韧性(R) - 面对挫折的态度
 * 评估倾向：坚持、反思、情绪管理
 */
export const RESILIENCE_CHALLENGES: MiniGameChallenge[] = [
  {
    id: 'R-1',
    dimension: 'R',
    dimensionName: '韧性',
    type: 'exploration',
    difficulty: 2,
    title: '第一次失败',
    scenario: '你设计的桥梁在测试时坍塌了，大家都很失望...',
    question: '你的第一反应是？',
    options: [
      {
        id: 'a',
        text: '分析哪里出了问题，重新设计',
        emoji: '🔍',
        dimensionScores: { W: 0, I: 2, L: 0, D: 1, E: 0, R: 4 },
        narrativeFeedback: '从失败中学习，这是成长型思维！',
      },
      {
        id: 'b',
        text: '有点难过，但很快调整心态再来',
        emoji: '💪',
        dimensionScores: { W: 0, I: 0, L: 0, D: 0, E: 0, R: 4 },
        narrativeFeedback: '情绪恢复能力强，这是韧性的重要表现！',
      },
      {
        id: 'c',
        text: '请教有经验的人，听听他们的建议',
        emoji: '🙋',
        dimensionScores: { W: 0, I: 1, L: 2, D: 1, E: 1, R: 3 },
        narrativeFeedback: '善于求助也是一种智慧！',
      },
      {
        id: 'd',
        text: '觉得是不是自己不适合做这个',
        emoji: '😔',
        dimensionScores: { W: 0, I: 0, L: 0, D: 0, E: 0, R: 1 },
        narrativeFeedback: '自我怀疑是正常的，但别太快放弃自己！',
      },
    ],
  },
  {
    id: 'R-2',
    dimension: 'R',
    dimensionName: '韧性',
    type: 'exploration',
    difficulty: 3,
    title: '连续挫折',
    scenario: '这已经是你第三次尝试失败了，队友开始质疑你的方案...',
    question: '你会怎么做？',
    options: [
      {
        id: 'a',
        text: '换个完全不同的思路试试',
        emoji: '🔄',
        dimensionScores: { W: 1, I: 1, L: 0, D: 3, E: 0, R: 3 },
        narrativeFeedback: '灵活变通，不固执于一种方案，这是聪明做法！',
      },
      {
        id: 'b',
        text: '和团队一起复盘，找到根本原因',
        emoji: '📋',
        dimensionScores: { W: 0, I: 2, L: 2, D: 1, E: 1, R: 4 },
        narrativeFeedback: '系统性复盘，找到根源再解决，这是成熟的做法！',
      },
      {
        id: 'c',
        text: '坚持原来的方案，再调整细节',
        emoji: '🎯',
        dimensionScores: { W: 0, I: 0, L: 0, D: 1, E: 0, R: 3 },
        narrativeFeedback: '坚持是好的，但也要考虑是否需要大调整。',
      },
      {
        id: 'd',
        text: '让更有经验的人来主导，我配合学习',
        emoji: '📚',
        dimensionScores: { W: 0, I: 0, L: 2, D: 0, E: 1, R: 2 },
        narrativeFeedback: '懂得让位学习，这也是成长的一种方式！',
      },
    ],
  },
  {
    id: 'R-3',
    dimension: 'R',
    dimensionName: '韧性',
    type: 'exploration',
    difficulty: 4,
    title: '最终考验',
    scenario: '任务截止前最后一天，核心设备突然坏了，修复需要 12 小时...',
    question: '你决定？',
    options: [
      {
        id: 'a',
        text: '全力抢修，能修多少是多少',
        emoji: '🔧',
        dimensionScores: { W: 0, I: 0, L: 0, D: 1, E: 0, R: 4 },
        narrativeFeedback: '全力以赴不放弃，这是坚韧的精神！',
      },
      {
        id: 'b',
        text: '评估能不能用备用方案完成任务',
        emoji: '💡',
        dimensionScores: { W: 0, I: 2, L: 0, D: 3, E: 0, R: 3 },
        narrativeFeedback: '寻找替代方案，灵活应对危机！',
      },
      {
        id: 'c',
        text: '向上级申请延期，说明情况',
        emoji: '📞',
        dimensionScores: { W: 0, I: 0, L: 1, D: 0, E: 2, R: 2 },
        narrativeFeedback: '主动沟通说明情况，这是负责任的态度！',
      },
      {
        id: 'd',
        text: '冷静分析，看哪些部分是必须完成的，优先保障',
        emoji: '🎯',
        dimensionScores: { W: 0, I: 3, L: 0, D: 3, E: 0, R: 4 },
        narrativeFeedback: '压力下依然能理性优先级排序，这是超强的韧性！',
      },
    ],
  },
]

/**
 * 获取所有挑战（按维度顺序排列）
 */
export function getAllChallenges(): MiniGameChallenge[] {
  return [
    ...WONDER_CHALLENGES,
    ...INQUIRY_CHALLENGES,
    ...LINK_CHALLENGES,
    ...DESIGN_CHALLENGES,
    ...EXPRESSION_CHALLENGES,
    ...RESILIENCE_CHALLENGES,
  ]
}

/**
 * 根据年龄过滤挑战（可选）
 */
export function getChallengesForAge(age: number): MiniGameChallenge[] {
  const all = getAllChallenges()
  // 当前所有挑战全年龄适用，未来可按 ageRange 过滤
  return all
}

/**
 * 按维度获取挑战
 */
export function getChallengesByDimension(dim: WilderDimension): MiniGameChallenge[] {
  switch (dim) {
    case 'W': return WONDER_CHALLENGES
    case 'I': return INQUIRY_CHALLENGES
    case 'L': return LINK_CHALLENGES
    case 'D': return DESIGN_CHALLENGES
    case 'E': return EXPRESSION_CHALLENGES
    case 'R': return RESILIENCE_CHALLENGES
  }
}
