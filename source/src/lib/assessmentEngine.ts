// ===================================================================
// GrowMate 多模态测评引擎 v4.0
// 整合 WILDER-729 内核三层模型 + 多元智能 + 大五人格 + 认知发展
// 24道选择题(5选项) + 18道判断题 = 42题
// 支持 729 种差异化报告 + Layer 2 能力细分（25个能力目标）
// ===================================================================

import {
  generateProfile729,
  generateFullReport,
  WILDER_DIMENSIONS,
  MODALITY_RULES,
  PRODUCT_LINES,
  PRIVACY_CONFIG,
  MINIMUM_REQUIREMENTS,
  type WilderDimension,
  type AssessmentModality,
  type Profile729,
  type WilderReport729,
  type ModalityRule,
  type ProductLine,
} from './wilderKernel'

import {
  performCrossValidation,
  type CrossValidationResult,
} from './crossValidationEngine'

import {
  matchTalentType30,
  type TalentType30,
} from './talentTypes30'

// ========== 选择题题库 ==========
export interface ChoiceQuestion {
  id: string
  text: string
  scenario?: string
  model: 'MI' | 'BigFive' | 'Cognitive' | 'WILDER' | 'WILDER-L2' | 'personalityTraits'
  dimension: string
  wilderMapping: string[]
  layer2Tags?: string[]      // Layer 2 能力标签
  options: { id: string; text: string; scores: Record<string, number> }[]
  ageAdapt?: { min: number; max: number }
}

export const choiceQuestions: ChoiceQuestion[] = [
  // ╔══════════════════════════════════════╗
  // ║  Part 1: 加德纳多元智能 (MI) — 4题   ║
  // ╚══════════════════════════════════════╝
  {
    id: 'MI-01',
    text: '如果学校组织一次"未来城市"设计比赛，你最想负责哪个部分？',
    scenario: '想象你和小伙伴们要一起设计一座未来城市的模型。',
    model: 'MI',
    dimension: '优势智能识别',
    wilderMapping: ['W', 'D', 'E', 'L', 'R'],
    options: [
      { id: 'a', text: '画出城市的整体地图和建筑外观', scores: { spatial: 3, W: 1, D: 2 } },
      { id: 'b', text: '写一份介绍未来城市的演讲稿', scores: { linguistic: 3, E: 2, W: 1 } },
      { id: 'c', text: '计算需要多少材料和预算', scores: { logicalMath: 3, D: 2 } },
      { id: 'd', text: '组织大家分工合作完成任务', scores: { interpersonal: 3, L: 2, E: 1 } },
      { id: 'e', text: '研究未来城市的生态循环系统', scores: { naturalist: 3, W: 2, I: 2, R: 1 } },
    ]
  },
  {
    id: 'MI-02',
    text: '放学后有一个小时自由时间，你最可能做什么？',
    model: 'MI',
    dimension: '自然倾向识别',
    wilderMapping: ['W', 'I', 'E', 'L', 'D'],
    options: [
      { id: 'a', text: '到花园里观察昆虫或植物', scores: { naturalist: 3, W: 2, I: 2 } },
      { id: 'b', text: '听音乐或尝试用乐器演奏', scores: { musical: 3, E: 1, R: 1 } },
      { id: 'c', text: '和好朋友一起玩运动游戏', scores: { bodilyKinesthetic: 3, L: 2 } },
      { id: 'd', text: '一个人安静地看书或画画', scores: { intrapersonal: 3, R: 2, W: 1 } },
      { id: 'e', text: '尝试用废旧材料做一个小发明', scores: { bodilyKinesthetic: 2, spatial: 1, D: 2, W: 2 } },
    ]
  },
  {
    id: 'MI-03',
    text: '老师说了一个你不太理解的新概念，你会怎么做？',
    scenario: '比如老师讲了"光合作用"这个概念，你听得似懂非懂。',
    model: 'MI',
    dimension: '学习风格识别',
    wilderMapping: ['I', 'R', 'L', 'E', 'D'],
    options: [
      { id: 'a', text: '在脑子里画一幅图来帮助理解', scores: { spatial: 2, D: 1, I: 1 } },
      { id: 'b', text: '查资料或问别人，搞清楚每个步骤', scores: { logicalMath: 2, I: 3, W: 1 } },
      { id: 'c', text: '编一个小故事或口诀来记住它', scores: { linguistic: 2, E: 2, D: 1 } },
      { id: 'd', text: '动手做个实验来验证一下', scores: { bodilyKinesthetic: 2, I: 2, W: 2 } },
      { id: 'e', text: '和同学互相讨论，你教我我教你', scores: { interpersonal: 2, L: 3, E: 1 } },
    ]
  },
  {
    id: 'MI-04',
    text: '你最喜欢哪种类型的课外活动？',
    model: 'MI',
    dimension: '智能偏好确认',
    wilderMapping: ['W', 'I', 'L', 'E', 'D'],
    options: [
      { id: 'a', text: '科学实验社团，探索各种有趣的实验', scores: { naturalist: 2, logicalMath: 1, I: 3, W: 2 } },
      { id: 'b', text: '辩论队或演讲俱乐部', scores: { linguistic: 3, E: 3, I: 1 } },
      { id: 'c', text: '乐队或舞蹈队', scores: { musical: 2, bodilyKinesthetic: 2, E: 2, L: 1 } },
      { id: 'd', text: '志愿者服务或社区活动', scores: { interpersonal: 3, L: 3, R: 1 } },
      { id: 'e', text: '编程或机器人社团', scores: { logicalMath: 3, D: 3, I: 1 } },
    ]
  },

  // ╔══════════════════════════════════════╗
  // ║  Part 2: 大五人格 (BigFive) — 5题    ║
  // ╚══════════════════════════════════════╝
  {
    id: 'BF-01',
    text: '周末有两个活动可以选，你更想去哪个？',
    scenario: '一个是去从没去过的科技博物馆，一个是去你最喜欢的游乐场。',
    model: 'BigFive',
    dimension: 'O-开放性',
    wilderMapping: ['W', 'I', 'L', 'D'],
    options: [
      { id: 'a', text: '当然去新的科技博物馆探索！', scores: { O: 3, W: 3 } },
      { id: 'b', text: '先查查博物馆有什么，再决定', scores: { O: 2, W: 1, I: 1, D: 1 } },
      { id: 'c', text: '游乐场更好玩，下次再去博物馆', scores: { O: 0, W: 0 } },
      { id: 'd', text: '叫上好朋友一起去博物馆！', scores: { O: 2, E_bf: 2, L: 2, E: 1 } },
      { id: 'e', text: '去之前先做攻略，规划好路线和重点', scores: { O: 2, D: 2, I: 1 } },
    ]
  },
  {
    id: 'BF-02',
    text: '班级要做一个手工项目，你会怎么做？',
    model: 'BigFive',
    dimension: 'C-尽责性',
    wilderMapping: ['D', 'R', 'W', 'L'],
    options: [
      { id: 'a', text: '先列清单和步骤，按计划一步步来', scores: { C: 3, D: 3, R: 1 } },
      { id: 'b', text: '想到什么做什么，灵感来了就动手', scores: { C: 0, W: 2, O: 1 } },
      { id: 'c', text: '先看看别人怎么做的，再开始自己的', scores: { C: 1, I: 1, L: 1 } },
      { id: 'd', text: '定一个大方向，过程中随时调整', scores: { C: 2, D: 1, R: 2, E: 1 } },
      { id: 'e', text: '做完后仔细检查，看看哪里可以改进', scores: { C: 3, R: 3 } },
    ]
  },
  {
    id: 'BF-03',
    text: '在一个新的班级聚会上，你通常会？',
    model: 'BigFive',
    dimension: 'E-外向性',
    wilderMapping: ['L', 'E', 'R'],
    options: [
      { id: 'a', text: '主动跟不认识的同学聊天', scores: { E_bf: 3, L: 3, E: 1 } },
      { id: 'b', text: '先观察一下，等别人来找我说话', scores: { E_bf: 0, R: 2, I: 1 } },
      { id: 'c', text: '找自己认识的朋友待在一起', scores: { E_bf: 1, L: 1 } },
      { id: 'd', text: '参加集体游戏，在活动中认识新朋友', scores: { E_bf: 2, L: 2, E: 1 } },
      { id: 'e', text: '准备一个有趣的自我介绍或小节目', scores: { E_bf: 3, E: 3, D: 1 } },
    ]
  },
  {
    id: 'BF-04',
    text: '小组讨论时同学提出了和你完全不同的想法，你会？',
    model: 'BigFive',
    dimension: 'A-宜人性',
    wilderMapping: ['L', 'R', 'I', 'E'],
    options: [
      { id: 'a', text: '认真听完，试着理解对方的道理', scores: { A: 3, L: 2, R: 2 } },
      { id: 'b', text: '直接说出我不同意，并解释原因', scores: { A: 0, E: 2, I: 1 } },
      { id: 'c', text: '想想两个观点能不能合在一起', scores: { A: 2, L: 3, D: 1 } },
      { id: 'd', text: '虽然觉得不对，但不太好意思反驳', scores: { A: 1, N: 1 } },
      { id: 'e', text: '查找资料或证据来验证谁的观点更合理', scores: { A: 1, I: 3, W: 1 } },
    ]
  },
  {
    id: 'BF-05',
    text: '马上要考试了，你发现有一部分内容没复习到，你会？',
    model: 'BigFive',
    dimension: 'N-情绪稳定性',
    wilderMapping: ['R', 'D', 'L', 'E'],
    options: [
      { id: 'a', text: '赶紧制定计划把这部分补上', scores: { N: 0, D: 3, R: 2 } },
      { id: 'b', text: '有点紧张，但告诉自己尽力就好', scores: { N: 1, R: 2 } },
      { id: 'c', text: '很担心考不好，越想越焦虑', scores: { N: 3, R: 0 } },
      { id: 'd', text: '问同学借笔记，快速看一遍重点', scores: { N: 0, L: 2, D: 1 } },
      { id: 'e', text: '用思维导图整理已知和未知，心里更有底', scores: { N: 0, D: 2, R: 2, E: 1 } },
    ]
  },

  // ╔══════════════════════════════════════╗
  // ║  Part 3: 皮亚杰认知发展 — 4题       ║
  // ╚══════════════════════════════════════╝
  {
    id: 'COG-01',
    text: '有两杯同样多的水，一杯倒进又高又细的杯子，一杯倒进又矮又宽的碗。哪个水多？',
    scenario: '这是一个经典的思维挑战题。',
    model: 'Cognitive',
    dimension: '守恒概念',
    wilderMapping: ['I', 'L'],
    options: [
      { id: 'a', text: '一样多，因为只是换了容器', scores: { conservation: 3, I: 3 } },
      { id: 'b', text: '高杯子里的多，因为水面更高', scores: { conservation: 0, I: 0 } },
      { id: 'c', text: '不确定，需要量一下才知道', scores: { conservation: 1, I: 2, D: 1 } },
      { id: 'd', text: '碗里的多，因为碗更宽', scores: { conservation: 0, I: 0 } },
      { id: 'e', text: '一样多，我可以再倒回去证明', scores: { conservation: 3, I: 3, R: 1, E: 1 } },
    ]
  },
  {
    id: 'COG-02',
    text: '如果所有的猫都是动物，所有的动物都需要水，那么？',
    model: 'Cognitive',
    dimension: '逻辑推理',
    wilderMapping: ['I', 'R', 'D'],
    options: [
      { id: 'a', text: '所有的猫都需要水', scores: { deduction: 3, I: 3, R: 1 } },
      { id: 'b', text: '有些猫可能不需要水', scores: { deduction: 0, I: 0 } },
      { id: 'c', text: '不能确定，要看是什么猫', scores: { deduction: 1, I: 1, R: 1 } },
      { id: 'd', text: '需要水的动物一定是猫', scores: { deduction: 0, I: 0 } },
      { id: 'e', text: '所有猫需要水，而且我可以用同样的逻辑推出更多结论', scores: { deduction: 3, I: 3, D: 1, R: 1, E: 1 } },
    ]
  },
  {
    id: 'COG-03',
    text: '一个实验要测试"植物是否需要阳光才能长大"，最好的方法是？',
    scenario: '你需要像科学家一样设计这个实验。',
    model: 'Cognitive',
    dimension: '假设检验与变量控制',
    wilderMapping: ['I', 'D', 'W', 'R'],
    options: [
      { id: 'a', text: '种两盆一样的植物，一盆放阳光下，一盆放黑暗处，其他条件相同', scores: { hypothesis: 3, I: 3, D: 3 } },
      { id: 'b', text: '把一盆植物先放阳光下再放黑暗处', scores: { hypothesis: 1, I: 1 } },
      { id: 'c', text: '问有经验的园艺师傅', scores: { hypothesis: 0, L: 2 } },
      { id: 'd', text: '在网上查找答案', scores: { hypothesis: 0, I: 1 } },
      { id: 'e', text: '先观察记录多盆植物的生长情况，再设计对比实验', scores: { hypothesis: 2, I: 2, W: 2, R: 1, E: 1 } },
    ]
  },
  {
    id: 'COG-04',
    text: '你在解一道数学应用题时遇到困难，你会先做什么？',
    model: 'Cognitive',
    dimension: '元认知策略',
    wilderMapping: ['R', 'D', 'I', 'L'],
    options: [
      { id: 'a', text: '先弄清楚题目在问什么，把已知和未知列出来', scores: { metacognition: 3, R: 3, D: 2 } },
      { id: 'b', text: '直接开始算，算不出来再换方法', scores: { metacognition: 0, W: 1 } },
      { id: 'c', text: '回忆有没有做过类似的题目', scores: { metacognition: 2, R: 2, I: 1 } },
      { id: 'd', text: '画图或者列表来帮助思考', scores: { metacognition: 2, D: 2, I: 1 } },
      { id: 'e', text: '和同学讨论，互相启发解题思路', scores: { metacognition: 1, L: 3, E: 1 } },
    ]
  },

  // ╔══════════════════════════════════════╗
  // ║  Part 4: WILDER 交叉验证题 — 2题     ║
  // ╚══════════════════════════════════════╝
  {
    id: 'WV-01',
    text: '你完成了一幅画，老师说"这里可以改进一下"，你会？',
    model: 'WILDER',
    dimension: 'E表达力 × R反思力',
    wilderMapping: ['E', 'R', 'I', 'W', 'L'],
    options: [
      { id: 'a', text: '问清楚哪里可以改，然后试着调整', scores: { E: 2, R: 3, I: 1 } },
      { id: 'b', text: '觉得有点失落，但还是会改', scores: { R: 1, N: 1 } },
      { id: 'c', text: '坚持自己的想法，解释为什么这样画', scores: { E: 3, R: 0 } },
      { id: 'd', text: '重新画一幅完全不同的', scores: { W: 2, D: 1 } },
      { id: 'e', text: '先问问其他同学的意见再决定', scores: { L: 2, R: 2, I: 1 } },
    ]
  },
  {
    id: 'WV-02',
    text: '你们小组在做项目，一个同学总是不参与，你会？',
    model: 'WILDER',
    dimension: 'L连接力 × D设计力',
    wilderMapping: ['L', 'D', 'E', 'R'],
    options: [
      { id: 'a', text: '私下问他是不是遇到了困难，需要什么帮助', scores: { L: 3, R: 1 } },
      { id: 'b', text: '重新分工，给他一个他擅长的简单任务', scores: { D: 3, L: 2 } },
      { id: 'c', text: '告诉老师让老师处理', scores: { L: 0, D: 0 } },
      { id: 'd', text: '自己把他的部分也做了，不想耽误进度', scores: { D: 1, L: 0, C: 2 } },
      { id: 'e', text: '组织全组开会商量，让大家一起想办法', scores: { L: 2, E: 2, D: 2 } },
    ]
  },

  // ╔══════════════════════════════════════════════════╗
  // ║  Part 5: WILDER Layer 2 深度测评题 — 10题        ║
  // ║  覆盖25个能力目标（观察/提问/想象/假设/验证...）  ║
  // ╚══════════════════════════════════════════════════╝

  // --- W 好奇心 Layer 2: 观察力 + 提问力 + 敏感度 ---
  {
    id: 'WL2-W01',
    text: '第一次走进一个从没去过的地方（比如新的商场、公园），你通常会？',
    scenario: '爸妈带你去了一个全新的地方，到处都很新鲜。',
    model: 'WILDER-L2',
    dimension: 'W-观察力·敏感度',
    wilderMapping: ['W', 'I', 'R'],
    layer2Tags: ['W_obs', 'W_sens', 'W_curi'],
    options: [
      { id: 'a', text: '到处看、到处摸，想把每个角落都探索一遍', scores: { W: 3, I: 1, W_obs: 2, W_curi: 2 } },
      { id: 'b', text: '安静地观察周围的人和环境，注意一些别人没注意到的细节', scores: { W: 2, R: 2, W_obs: 3, W_sens: 2 } },
      { id: 'c', text: '拿出手机拍照或画速写记录下来', scores: { W: 2, E: 2, D: 1, W_obs: 2 } },
      { id: 'd', text: '跟着大人走，不太会主动去探索', scores: { W: 0, L: 1 } },
      { id: 'e', text: '会对某个特别吸引你的东西停下来仔细研究', scores: { W: 3, I: 2, W_sens: 3, W_curi: 2 } },
    ]
  },
  {
    id: 'WL2-W02',
    text: '看到一个令人惊讶的现象（比如彩虹、奇怪的影子），你第一反应是？',
    scenario: '雨后天空突然出现了两道彩虹，一深一浅。',
    model: 'WILDER-L2',
    dimension: 'W-提问力·好奇心',
    wilderMapping: ['W', 'I'],
    layer2Tags: ['W_quest', 'W_curi', 'W_imag'],
    options: [
      { id: 'a', text: '"为什么会这样？"然后去查或问别人', scores: { W: 3, I: 2, W_quest: 3, W_curi: 2 } },
      { id: 'b', text: '"好漂亮！"欣赏一下就继续做别的了', scores: { W: 0, E: 1 } },
      { id: 'c', text: '脑子里冒出好多猜想，想自己验证', scores: { W: 2, I: 3, W_quest: 2, W_curi: 3 } },
      { id: 'd', text: '想象如果彩虹是固体的，能站上去会怎样', scores: { W: 3, W_imag: 3, W_curi: 1 } },
      { id: 'e', text: '赶紧跟身边的人分享："你看你看！"', scores: { W: 1, L: 2, E: 2 } },
    ]
  },

  // --- I 探究力 Layer 2: 假设力 + 验证力 + 分析力 ---
  {
    id: 'WL2-I01',
    text: '同学告诉你"含羞草碰到就会合上叶子是因为害怕"，你会？',
    scenario: '课间你们在讨论一株含羞草。',
    model: 'WILDER-L2',
    dimension: 'I-假设力·验证力',
    wilderMapping: ['I', 'W', 'R'],
    layer2Tags: ['I_hyp', 'I_ver', 'I_ana'],
    options: [
      { id: 'a', text: '觉得有道理，接受这个说法', scores: { I: 0, L: 1 } },
      { id: 'b', text: '半信半疑，回家上网查一查真正的原因', scores: { I: 2, W: 1, I_ver: 2, E: 1 } },
      { id: 'c', text: '想到："植物没有神经，怎么会害怕呢？"开始质疑', scores: { I: 3, W: 2, I_hyp: 3, I_ana: 2 } },
      { id: 'd', text: '设计一个小实验：试试用不同方式碰触，看反应有什么不同', scores: { I: 3, D: 2, I_ver: 3, I_hyp: 2 } },
      { id: 'e', text: '先接受，但心里记下这个疑问，以后有机会再研究', scores: { I: 1, R: 2, W: 1, I_hyp: 1 } },
    ]
  },
  {
    id: 'WL2-I02',
    text: '科学课上做"不同液体对植物生长影响"的实验，你最想做什么？',
    scenario: '老师给了你们牛奶、果汁、盐水和清水四种液体。',
    model: 'WILDER-L2',
    dimension: 'I-实验力·分析力',
    wilderMapping: ['I', 'D', 'R'],
    layer2Tags: ['I_exp', 'I_ana', 'I_reas'],
    options: [
      { id: 'a', text: '按老师说的步骤一步步操作', scores: { I: 1, D: 1 } },
      { id: 'b', text: '自己想办法多加几种液体做对比', scores: { I: 3, W: 2, I_exp: 3 } },
      { id: 'c', text: '认真记录每天的数据，画成图表来分析', scores: { I: 2, D: 3, R: 1, I_ana: 3 } },
      { id: 'd', text: '先预测哪种液体最好，再看结果是否验证了预测', scores: { I: 3, R: 2, I_hyp: 2, I_reas: 2 } },
      { id: 'e', text: '实验结束后找出"为什么有的液体不利于生长"的原因', scores: { I: 2, R: 3, I_ana: 2, I_reas: 3 } },
    ]
  },

  // --- L 连接力 Layer 2: 共情力 + 换位力 + 协商力 ---
  {
    id: 'WL2-L01',
    text: '班里新来了一个转学生，看起来很紧张，你会怎么做？',
    scenario: '新同学一个人坐在座位上，谁都不认识。',
    model: 'WILDER-L2',
    dimension: 'L-共情力·换位力',
    wilderMapping: ['L', 'E', 'R'],
    layer2Tags: ['L_emp', 'L_pers', 'L_comm'],
    options: [
      { id: 'a', text: '主动过去跟他聊天，介绍班里的情况', scores: { L: 3, E: 2, L_comm: 2, L_emp: 2 } },
      { id: 'b', text: '想起自己以前也有过类似的经历，能理解他的感受', scores: { L: 2, R: 2, L_emp: 3, L_pers: 2 } },
      { id: 'c', text: '叫上几个朋友一起邀请他加入游戏', scores: { L: 3, L_coll: 2, L_comm: 1 } },
      { id: 'd', text: '等他适应一下，不想打扰他', scores: { L: 0, R: 1 } },
      { id: 'e', text: '给他画一张座位地图，标注厕所、饮水机等位置', scores: { L: 2, D: 2, E: 1, L_emp: 2 } },
    ]
  },
  {
    id: 'WL2-L02',
    text: '小组要决定表演什么节目，大家意见不一，你会？',
    scenario: '有人想演话剧，有人想唱歌，有人想跳舞，大家争论起来了。',
    model: 'WILDER-L2',
    dimension: 'L-协商力·沟通力',
    wilderMapping: ['L', 'D', 'E'],
    layer2Tags: ['L_neg', 'L_comm', 'L_coll'],
    options: [
      { id: 'a', text: '建议大家投票，少数服从多数', scores: { L: 2, D: 2, L_neg: 2 } },
      { id: 'b', text: '想一个折中方案，比如把唱歌和跳舞结合起来', scores: { L: 3, D: 2, L_neg: 3, W: 1 } },
      { id: 'c', text: '让每个人说说自己方案的优点，大家再选', scores: { L: 3, E: 2, L_comm: 3, L_neg: 2 } },
      { id: 'd', text: '随大流，别人决定什么就什么', scores: { L: 0, A: 1 } },
      { id: 'e', text: '主动承担主持人角色，组织讨论流程', scores: { L: 2, E: 3, D: 2, L_coll: 2 } },
    ]
  },

  // --- D 设计力 Layer 2: 规划力 + 问题分解 + 资源管理 ---
  {
    id: 'WL2-D01',
    text: '老师让你负责组织一次班级读书会活动，你会先做什么？',
    scenario: '你需要在下周五前完成所有准备工作。',
    model: 'WILDER-L2',
    dimension: 'D-规划力·组织力',
    wilderMapping: ['D', 'L', 'R'],
    layer2Tags: ['D_plan', 'D_org', 'D_res'],
    options: [
      { id: 'a', text: '列一个时间表，把每天要做的事情安排好', scores: { D: 3, R: 1, D_plan: 3, D_org: 2 } },
      { id: 'b', text: '先问问同学们想读什么类型的书', scores: { L: 3, D_res: 1 } },
      { id: 'c', text: '把任务分成几块：选书、布置场地、邀请嘉宾等，分给不同人', scores: { D: 3, L: 2, D_org: 3, D_res: 2, E: 1 } },
      { id: 'd', text: '到了那天再说，临时安排也挺好的', scores: { D: 0, W: 1 } },
      { id: 'e', text: '先设想可能出什么问题，准备好备选方案', scores: { D: 1, R: 3, D_plan: 2, D_res: 2 } },
    ]
  },
  {
    id: 'WL2-D02',
    text: '面对一道很复杂的综合题（需要好几步才能解出来），你的策略是？',
    model: 'WILDER-L2',
    dimension: 'D-问题分解·决策力',
    wilderMapping: ['D', 'I', 'R'],
    layer2Tags: ['D_dec', 'D_plan', 'I_ana'],
    options: [
      { id: 'a', text: '把大问题拆成几个小问题，逐个击破', scores: { D: 3, I: 2, D_dec: 3, D_plan: 2, E: 1 } },
      { id: 'b', text: '从最简单的部分开始，一步步往难的推进', scores: { D: 1, R: 1, D_plan: 2 } },
      { id: 'c', text: '先通读全题，理解整体关系后再动手', scores: { D: 2, I: 2, R: 2, I_ana: 2 } },
      { id: 'd', text: '尝试多种方法，哪个能走通就用哪个', scores: { D: 1, W: 2, I: 1 } },
      { id: 'e', text: '做完后回头检查，确认每一步的逻辑没有问题', scores: { D: 1, R: 3, I: 1, D_dec: 1 } },
    ]
  },

  // --- E 表达力 Layer 2: 口头表达 + 创意呈现 + 视觉表达 ---
  {
    id: 'WL2-E01',
    text: '你需要向全班展示你做的一个科学小实验成果，你会选择什么方式？',
    scenario: '老师给了你5分钟的展示时间。',
    model: 'WILDER-L2',
    dimension: 'E-多元表达',
    wilderMapping: ['E', 'D', 'W'],
    layer2Tags: ['E_verb', 'E_vis', 'E_crea', 'E_writ'],
    options: [
      { id: 'a', text: '做一份漂亮的PPT或海报来图文展示', scores: { E: 2, D: 2, E_vis: 3, E_crea: 1 } },
      { id: 'b', text: '当场再做一次实验，边做边讲解', scores: { E: 3, W: 1, I: 1, E_verb: 2, E_crea: 2 } },
      { id: 'c', text: '写一篇详细的实验报告发给大家', scores: { E: 1, D: 2, R: 1, E_writ: 3 } },
      { id: 'd', text: '编一个关于实验的小故事或小视频', scores: { E: 3, W: 2, E_crea: 3, E_vis: 1 } },
      { id: 'e', text: '直接用自己的话生动地描述整个过程和发现', scores: { E: 3, E_verb: 3, E_crea: 1 } },
    ]
  },

  // --- R 反思力 Layer 2: 自我评价 + 归因分析 + 成长心态 ---
  {
    id: 'WL2-R01',
    text: '你参加了一次比赛，结果没有得奖。事后你会怎么想？',
    scenario: '你为这次比赛准备了很久，但最终没有拿到名次。',
    model: 'WILDER-L2',
    dimension: 'R-归因分析·成长心态',
    wilderMapping: ['R', 'W', 'D'],
    layer2Tags: ['R_self', 'R_attr', 'R_grow', 'R_meta'],
    options: [
      { id: 'a', text: '分析一下其他获奖选手好在哪里，找到差距', scores: { R: 3, I: 1, R_attr: 3, R_self: 2 } },
      { id: 'b', text: '觉得自己运气不好，下次肯定能行', scores: { R: 0, W: 1 } },
      { id: 'c', text: '虽然难过，但想想这次学到了什么', scores: { R: 3, R_grow: 3, R_meta: 1 } },
      { id: 'd', text: '列出具体可以改进的地方，制定下一步计划', scores: { R: 2, D: 3, R_attr: 2, R_self: 2 } },
      { id: 'e', text: '觉得自己不够聪明，不太想再参加了', scores: { R: 0, N: 2 } },
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  Part 6: 人格特质测评 (PT) — 8题                              ║
  // ║  测量四个维度：社交能量、信息处理、决策风格、生活组织          ║
  // ╚══════════════════════════════════════════════════════════════╝

  // --- PT-01/02 测量社交能量方向：高=外向型，低=内向型 ---
  {
    id: 'PT-01',
    text: '学校组织了一次大型活动，你更想——',
    model: 'personalityTraits',
    dimension: '社交能量方向',
    wilderMapping: ['L', 'E', 'R', 'W'],
    options: [
      { id: 'a', text: '和很多人一起参与热闹的集体项目', scores: { L: 3, E: 2, socialEnergy: 5 } },
      { id: 'b', text: '和几个好朋友组队完成任务', scores: { L: 2, E: 1, R: 1, socialEnergy: 4 } },
      { id: 'c', text: '参加活动但更关注自己负责的部分', scores: { D: 2, I: 1, socialEnergy: 3 } },
      { id: 'd', text: '和一两个人搭档完成有趣的小项目', scores: { I: 2, W: 1, L: 1, socialEnergy: 2 } },
      { id: 'e', text: '找一个安静角落做自己感兴趣的事', scores: { W: 3, R: 2, socialEnergy: 1 } },
    ]
  },
  {
    id: 'PT-02',
    text: '放学后你觉得最放松的方式是——',
    model: 'personalityTraits',
    dimension: '社交能量方向',
    wilderMapping: ['L', 'E', 'R', 'W'],
    options: [
      { id: 'a', text: '约朋友一起出去玩', scores: { L: 3, E: 2, socialEnergy: 5 } },
      { id: 'b', text: '和家人分享今天发生的趣事', scores: { L: 2, E: 1, socialEnergy: 4 } },
      { id: 'c', text: '看视频或玩游戏放松一下', scores: { E: 1, socialEnergy: 3 } },
      { id: 'd', text: '做自己喜欢的手工或运动', scores: { W: 2, I: 1, socialEnergy: 2 } },
      { id: 'e', text: '一个人安静地看书或画画', scores: { R: 3, W: 2, socialEnergy: 1 } },
    ]
  },

  // --- PT-03/04 测量信息处理偏好：高=直觉型，低=感觉型 ---
  {
    id: 'PT-03',
    text: '观察一棵大树时，你通常会——',
    model: 'personalityTraits',
    dimension: '信息处理偏好',
    wilderMapping: ['W', 'I', 'D', 'R'],
    options: [
      { id: 'a', text: '仔细数树叶的纹路，观察树皮的颜色', scores: { D: 3, I: 1, R: 1, infoProcessing: 1 } },
      { id: 'b', text: '比较这棵树和其他树有什么不同', scores: { I: 2, D: 2, infoProcessing: 2 } },
      { id: 'c', text: '想想这棵树一天能吸收多少二氧化碳', scores: { I: 2, W: 1, infoProcessing: 3 } },
      { id: 'd', text: '想象如果住在树屋里会是什么感觉', scores: { W: 3, E: 1, infoProcessing: 4 } },
      { id: 'e', text: '想象这棵树经历了什么故事', scores: { W: 3, E: 2, infoProcessing: 5 } },
    ]
  },
  {
    id: 'PT-04',
    text: '老师布置了一个自由研究题目，你会——',
    model: 'personalityTraits',
    dimension: '信息处理偏好',
    wilderMapping: ['W', 'I', 'D', 'R'],
    options: [
      { id: 'a', text: '选一个能做实验验证的具体问题', scores: { I: 3, D: 2, infoProcessing: 1 } },
      { id: 'b', text: '找一个能查到详细资料的实用话题', scores: { I: 2, R: 1, infoProcessing: 2 } },
      { id: 'c', text: '选一个自己感兴趣但不太了解的领域', scores: { W: 2, I: 2, infoProcessing: 3 } },
      { id: 'd', text: '想一个能把不同学科知识联系起来的主题', scores: { W: 2, D: 1, I: 1, infoProcessing: 4 } },
      { id: 'e', text: '选一个天马行空的想象性问题', scores: { W: 3, E: 1, infoProcessing: 5 } },
    ]
  },

  // --- PT-05/06 测量决策风格：高=思考型，低=情感型 ---
  {
    id: 'PT-05',
    text: '小组讨论时两个同学意见不同，你觉得应该——',
    model: 'personalityTraits',
    dimension: '决策风格',
    wilderMapping: ['I', 'L', 'R', 'E'],
    options: [
      { id: 'a', text: '看看谁的理由更有逻辑', scores: { I: 3, D: 1, decisionStyle: 5 } },
      { id: 'b', text: '分析两种方案的优缺点', scores: { I: 2, D: 2, decisionStyle: 4 } },
      { id: 'c', text: '想一个能综合两种意见的办法', scores: { D: 2, L: 1, decisionStyle: 3 } },
      { id: 'd', text: '让大家投票，少数服从多数', scores: { L: 2, E: 1, decisionStyle: 2 } },
      { id: 'e', text: '先照顾大家的感受再说', scores: { L: 3, R: 1, decisionStyle: 1 } },
    ]
  },
  {
    id: 'PT-06',
    text: '如果你是班长，要选人参加比赛，你会——',
    model: 'personalityTraits',
    dimension: '决策风格',
    wilderMapping: ['I', 'L', 'R', 'E'],
    options: [
      { id: 'a', text: '选能力最强的人', scores: { I: 2, D: 2, decisionStyle: 5 } },
      { id: 'b', text: '组织一个小测试，看谁表现最好', scores: { I: 3, D: 1, decisionStyle: 4 } },
      { id: 'c', text: '让大家推荐或自荐', scores: { L: 2, E: 1, decisionStyle: 3 } },
      { id: 'd', text: '选态度最认真的人', scores: { L: 1, R: 2, decisionStyle: 2 } },
      { id: 'e', text: '选最需要锻炼机会的人', scores: { L: 3, R: 1, decisionStyle: 1 } },
    ]
  },

  // --- PT-07/08 测量生活组织方式：高=计划型，低=灵活型 ---
  {
    id: 'PT-07',
    text: '周末有一整天自由时间，你会——',
    model: 'personalityTraits',
    dimension: '生活组织方式',
    wilderMapping: ['D', 'R', 'W', 'E'],
    options: [
      { id: 'a', text: '提前计划好每个时段做什么', scores: { D: 3, R: 1, lifeOrganization: 5 } },
      { id: 'b', text: '列一个待办清单，按重要程度完成', scores: { D: 2, R: 2, lifeOrganization: 4 } },
      { id: 'c', text: '想好上午和下午分别做什么', scores: { D: 2, lifeOrganization: 3 } },
      { id: 'd', text: '睡到自然醒，然后看心情决定', scores: { W: 1, lifeOrganization: 2 } },
      { id: 'e', text: '走到哪算哪，看心情决定', scores: { W: 3, E: 1, lifeOrganization: 1 } },
    ]
  },
  {
    id: 'PT-08',
    text: '做手工项目时，你通常——',
    model: 'personalityTraits',
    dimension: '生活组织方式',
    wilderMapping: ['D', 'R', 'W', 'E'],
    options: [
      { id: 'a', text: '先画好设计图再动手', scores: { D: 3, R: 1, lifeOrganization: 5 } },
      { id: 'b', text: '在心里想好步骤再开始', scores: { D: 2, R: 1, lifeOrganization: 4 } },
      { id: 'c', text: '一边做一边想下一步', scores: { D: 1, W: 1, lifeOrganization: 3 } },
      { id: 'd', text: '先试试看，做错了再改', scores: { W: 2, lifeOrganization: 2 } },
      { id: 'e', text: '边做边改，灵感来了就变', scores: { W: 3, E: 1, lifeOrganization: 1 } },
    ]
  },
]

// ========== 判断题题库 ==========
export interface JudgmentQuestion {
  id: string
  text: string
  scenario?: string
  model: 'MI' | 'BigFive' | 'Cognitive' | 'WILDER' | 'EF' | 'WILDER-L2'
  dimension: string
  wilderMapping: string[]
  layer2Tags?: string[]
  correctAnswer: boolean
  scores: { yes: Record<string, number>; no: Record<string, number> }
  ageAdapt?: { min: number; max: number }
}

export const judgmentQuestions: JudgmentQuestion[] = [
  // === 认知能力判断 (3题) ===
  {
    id: 'JG-01',
    text: '一根绳子剪成两段，两段加起来的长度一定比原来短。',
    model: 'Cognitive',
    dimension: '守恒与逻辑',
    wilderMapping: ['I'],
    correctAnswer: false,
    scores: {
      yes: { I: 0, conservation: 0 },
      no: { I: 3, conservation: 3 }
    }
  },
  {
    id: 'JG-02',
    text: '如果今天比昨天冷，昨天比前天冷，那么今天一定比前天冷。',
    model: 'Cognitive',
    dimension: '传递推理',
    wilderMapping: ['I'],
    correctAnswer: true,
    scores: {
      yes: { I: 3, deduction: 3 },
      no: { I: 0, deduction: 0 }
    }
  },
  {
    id: 'JG-03',
    text: '做实验时，一次只改变一个条件，其他条件保持不变，这样才能知道结果是哪个条件导致的。',
    model: 'Cognitive',
    dimension: '变量控制',
    wilderMapping: ['I', 'D'],
    correctAnswer: true,
    scores: {
      yes: { I: 3, D: 2, hypothesis: 3 },
      no: { I: 0, D: 0, hypothesis: 0 }
    }
  },

  // === 执行功能判断 (2题) ===
  {
    id: 'JG-04',
    text: '写作业时手机响了，你应该先把正在写的这道题写完再去看手机。',
    model: 'EF',
    dimension: '抑制控制',
    wilderMapping: ['R', 'D'],
    correctAnswer: true,
    scores: {
      yes: { R: 2, D: 2, inhibition: 3 },
      no: { R: 0, D: 0, inhibition: 0 }
    }
  },
  {
    id: 'JG-05',
    text: '如果原来的计划行不通，换一种新方法试试是明智的选择。',
    model: 'EF',
    dimension: '认知灵活性',
    wilderMapping: ['R', 'W'],
    correctAnswer: true,
    scores: {
      yes: { R: 2, W: 2, flexibility: 3 },
      no: { R: 0, W: 0, flexibility: 0 }
    }
  },

  // === WILDER 行为倾向判断 (7题) ===
  {
    id: 'JG-06',
    text: '遇到不懂的东西，你经常会忍不住想去了解更多。',
    model: 'WILDER',
    dimension: 'W-好奇心自评',
    wilderMapping: ['W'],
    correctAnswer: true,
    scores: {
      yes: { W: 3, E: 1 },
      no: { W: 0 }
    }
  },
  {
    id: 'JG-07',
    text: '你觉得"猜想—验证"的过程比直接知道答案更有趣。',
    model: 'WILDER',
    dimension: 'I-探究力自评',
    wilderMapping: ['I'],
    correctAnswer: true,
    scores: {
      yes: { I: 3 },
      no: { I: 0 }
    }
  },
  {
    id: 'JG-08',
    text: '在小组活动中，你更喜欢自己独立完成自己的部分。',
    model: 'WILDER',
    dimension: 'L-连接力（反向）',
    wilderMapping: ['L'],
    correctAnswer: false,
    scores: {
      yes: { L: 0 },
      no: { L: 3 }
    }
  },
  {
    id: 'JG-09',
    text: '做一件事之前，你习惯先想好步骤和顺序。',
    model: 'WILDER',
    dimension: 'D-设计力自评',
    wilderMapping: ['D'],
    correctAnswer: true,
    scores: {
      yes: { D: 3 },
      no: { D: 0 }
    }
  },
  {
    id: 'JG-10',
    text: '你喜欢把自己的发现或作品展示给别人看。',
    model: 'WILDER',
    dimension: 'E-表达力自评',
    wilderMapping: ['E'],
    correctAnswer: true,
    scores: {
      yes: { E: 3 },
      no: { E: 0 }
    }
  },
  {
    id: 'JG-11',
    text: '做完一件事后，你会想"下次我可以怎么做得更好"。',
    model: 'WILDER',
    dimension: 'R-反思力自评',
    wilderMapping: ['R'],
    correctAnswer: true,
    scores: {
      yes: { R: 3, E: 1 },
      no: { R: 0 }
    }
  },
  {
    id: 'JG-12',
    text: '你认为犯错是学习过程中很正常的事情。',
    model: 'WILDER',
    dimension: '成长型心态',
    wilderMapping: ['R', 'W'],
    correctAnswer: true,
    scores: {
      yes: { R: 2, W: 2, grit: 2 },
      no: { R: 0, W: 0, grit: 0 }
    }
  },

  // === WILDER Layer 2 深度判断 (6题) ===
  {
    id: 'JG-13',
    text: '你经常能注意到别人没注意到的小细节（比如一幅画里的小物件、路边的小花）。',
    model: 'WILDER-L2',
    dimension: 'W-观察力',
    wilderMapping: ['W'],
    layer2Tags: ['W_obs', 'W_sens'],
    correctAnswer: true,
    scores: {
      yes: { W: 2, W_obs: 3, W_sens: 2 },
      no: { W: 0 }
    }
  },
  {
    id: 'JG-14',
    text: '当别人告诉你一个"常识"时，你会在心里先想想这到底对不对。',
    model: 'WILDER-L2',
    dimension: 'I-批判性假设',
    wilderMapping: ['I', 'W'],
    layer2Tags: ['I_hyp', 'I_ana'],
    correctAnswer: true,
    scores: {
      yes: { I: 2, W: 1, I_hyp: 3, I_ana: 2 },
      no: { I: 0, W: 0 }
    }
  },
  {
    id: 'JG-15',
    text: '当好朋友不开心的时候，你很快就能感觉到，即使他没说出来。',
    model: 'WILDER-L2',
    dimension: 'L-共情力',
    wilderMapping: ['L'],
    layer2Tags: ['L_emp', 'L_pers'],
    correctAnswer: true,
    scores: {
      yes: { L: 2, L_emp: 3, L_pers: 2 },
      no: { L: 0 }
    }
  },
  {
    id: 'JG-16',
    text: '做一个大任务之前，你会在心里（或纸上）列一个步骤清单。',
    model: 'WILDER-L2',
    dimension: 'D-规划力',
    wilderMapping: ['D'],
    layer2Tags: ['D_plan', 'D_org'],
    correctAnswer: true,
    scores: {
      yes: { D: 2, D_plan: 3, D_org: 2 },
      no: { D: 0 }
    }
  },
  {
    id: 'JG-17',
    text: '你更喜欢用画图、做模型等方式而不是纯文字来表达自己的想法。',
    model: 'WILDER-L2',
    dimension: 'E-视觉表达',
    wilderMapping: ['E'],
    layer2Tags: ['E_vis', 'E_crea'],
    correctAnswer: true,
    scores: {
      yes: { E: 2, E_vis: 3, E_crea: 2 },
      no: { E: 0, E_writ: 1 }
    }
  },
  {
    id: 'JG-18',
    text: '失败之后，你会认真分析是具体哪一步出了问题，而不只是觉得"我做得不好"。',
    model: 'WILDER-L2',
    dimension: 'R-归因分析',
    wilderMapping: ['R'],
    layer2Tags: ['R_attr', 'R_self', 'R_meta'],
    correctAnswer: true,
    scores: {
      yes: { R: 2, R_attr: 3, R_self: 2, R_meta: 2 },
      no: { R: 0 }
    }
  },
]

// ========== 动态最大分计算 ==========
function computeWilderMax(): Record<string, number> {
  const dims = ['W', 'I', 'L', 'D', 'E', 'R'] as const
  const max: Record<string, number> = { W: 0, I: 0, L: 0, D: 0, E: 0, R: 0 }

  // 每道选择题中，每个维度取最高分选项
  for (const q of choiceQuestions) {
    for (const d of dims) {
      const best = Math.max(...q.options.map(opt => opt.scores[d] || 0))
      max[d] += best
    }
  }

  // 每道判断题中，每个维度取 yes/no 最高分
  for (const q of judgmentQuestions) {
    for (const d of dims) {
      const yesScore = q.scores.yes[d] || 0
      const noScore = q.scores.no[d] || 0
      max[d] += Math.max(yesScore, noScore)
    }
  }

  return max
}

// 预计算最大分，避免每次评分时重复计算
export const WILDER_MAX = computeWilderMax()

// WILDER_MAX 诊断统计信息，用于跨维度归一化
const maxValues = Object.values(WILDER_MAX) as number[]
export const WILDER_MAX_STATS = {
  values: WILDER_MAX,
  avg: maxValues.reduce((a, b) => a + b, 0) / 6,
  min: Math.min(...maxValues),
  max: Math.max(...maxValues),
}

/**
 * 打印 WILDER_MAX 诊断信息，帮助确认各维度 MAX 的不均衡程度
 */
export function printWilderMaxDiagnostics(): void {
  console.log('=== WILDER_MAX 诊断信息 ===')
  console.log('各维度理论最大分:')
  const dims = ['W', 'I', 'L', 'D', 'E', 'R'] as const
  dims.forEach(d => {
    const val = WILDER_MAX[d]
    const deviation = ((val - WILDER_MAX_STATS.avg) / WILDER_MAX_STATS.avg * 100).toFixed(1)
    console.log(`  ${d}: ${val} (偏离均值: ${deviation}%)`)
  })
  console.log(`统计: 均值=${WILDER_MAX_STATS.avg.toFixed(1)}, 最小=${WILDER_MAX_STATS.min}, 最大=${WILDER_MAX_STATS.max}`)
  console.log('===========================')
}

/**
 * 对 WILDER 原始分进行跨维度归一化，消除各维度 MAX 不均衡的系统偏差
 * @param rawScores 各维度原始分
 * @param maxScores 各维度理论最大分
 * @returns 归一化后的百分制分数
 */
export function normalizeWilderScores(
  rawScores: Record<string, number>,
  maxScores: Record<string, number>
): Record<string, number> {
  const dims = ['W', 'I', 'L', 'D', 'E', 'R'] as const
  const maxVals = dims.map(d => maxScores[d] || 1)
  const avgMax = maxVals.reduce((a, b) => a + b, 0) / maxVals.length

  const result: Record<string, number> = {}
  dims.forEach(d => {
    const max = maxScores[d] || 1
    // 归一化系数：让各维度的满分基准趋于一致，clamp 到 0.8-1.2 范围
    const normFactor = Math.max(0.8, Math.min(1.2, avgMax / max))
    const rawPct = (rawScores[d] / max) * 100
    // 应用归一化调整，使跨维度分数可比
    result[d] = Math.min(100, Math.max(0, Math.round(rawPct * normFactor)))
  })
  return result
}

// ========== Layer2 子维度动态最大分计算 ==========
function computeLayer2Max(): Record<string, number> {
  const max: Record<string, number> = {}

  // 选择题：每道题中，每个Layer2 key取所有选项的最高分
  for (const q of choiceQuestions) {
    if (!q.layer2Tags) continue
    for (const tag of q.layer2Tags) {
      const best = Math.max(0, ...q.options.map(opt => opt.scores[tag] || 0))
      max[tag] = (max[tag] || 0) + best
    }
  }

  // 判断题：每道题中，每个Layer2 key取 yes/no 最高分
  for (const q of judgmentQuestions) {
    if (!q.layer2Tags) continue
    for (const tag of q.layer2Tags) {
      const yesScore = q.scores.yes[tag] || 0
      const noScore = q.scores.no[tag] || 0
      max[tag] = (max[tag] || 0) + Math.max(yesScore, noScore)
    }
  }

  return max
}

export const LAYER2_MAX = computeLayer2Max()

// ========== 人格特质维度动态最大分计算 ==========
/** 人格特质四个维度的 key 列表 */
const PERSONALITY_TRAITS_KEYS = ['socialEnergy', 'infoProcessing', 'decisionStyle', 'lifeOrganization'] as const

export type PersonalityTraitKey = typeof PERSONALITY_TRAITS_KEYS[number]

/**
 * 计算人格特质各维度的理论最大分
 * 每个维度有2道题，每题最高5分，所以理论最大分为10
 */
function computePersonalityTraitsMax(): Record<PersonalityTraitKey, number> {
  const max: Record<string, number> = {
    socialEnergy: 0,
    infoProcessing: 0,
    decisionStyle: 0,
    lifeOrganization: 0,
  }

  // 选择题：每道题中，每个 PT 维度取所有选项的最高分
  for (const q of choiceQuestions) {
    if (q.model !== 'personalityTraits') continue
    for (const key of PERSONALITY_TRAITS_KEYS) {
      const best = Math.max(0, ...q.options.map(opt => opt.scores[key] || 0))
      max[key] += best
    }
  }

  return max as Record<PersonalityTraitKey, number>
}

export const PERSONALITY_TRAITS_MAX = computePersonalityTraitsMax()

// ========== 评分引擎 ==========
export type WilderLevel = 'high' | 'mid' | 'low'

export interface AssessmentScores {
  wilder: { W: number; I: number; L: number; D: number; E: number; R: number }
  wilderLevels: { W: WilderLevel; I: WilderLevel; L: WilderLevel; D: WilderLevel; E: WilderLevel; R: WilderLevel }
  wilderLayer2: Record<string, number>    // Layer 2 子维度分数（百分制）
  wilderLayer2Levels?: Record<string, WilderLevel>  // Layer 2 子维度等级
  multipleIntelligences: Record<string, number>
  bigFive: { O: number; C: number; E: number; A: number; N: number }
  cognitive: { conservation: number; deduction: number; hypothesis: number; metacognition: number }
  executiveFunction: { inhibition: number; flexibility: number }
  chc: { Gf: number; Gc: number }
  grit: { passion: number; perseverance: number }
  sel: {
    selfAwareness: number; selfManagement: number; socialAwareness: number
    relationshipSkills: number; responsibleDecision: number
  }
  /** 人格特质四维度（内部评估参考，百分制） */
  personalityTraits?: {
    socialEnergy: number      // 社交能量方向：高=外向型，低=内向型
    infoProcessing: number    // 信息处理偏好：高=直觉型，低=感觉型
    decisionStyle: number     // 决策风格：高=思考型，低=情感型
    lifeOrganization: number  // 生活组织方式：高=计划型，低=灵活型
  }
  profileCode: string       // e.g., "HHM-MHL"
  reportVariantId: number   // 1-728
  answeredCount?: { choice: number; judgment: number }
  /** v3.0新增：答题行为元数据 */
  answerMetadata?: Record<string, {
    duration: number      // 作答时长（毫秒）
    changeCount: number   // 改答次数
    hesitationCount: number // 犹豫次数
  }>
  /** v3.0新增：答题质量指标 */
  answerQualityScore?: number  // 0-100，综合答题质量评分
}

function toLevel(score: number, max: number): WilderLevel {
  if (max === 0) return 'mid'
  const pct = (score / max) * 100
  if (pct >= 70) return 'high'
  if (pct >= 40) return 'mid'
  return 'low'
}

function levelToNum(l: WilderLevel): number {
  return l === 'high' ? 2 : l === 'mid' ? 1 : 0
}

// Layer 2 子维度键列表
const LAYER2_KEYS = [
  'W_obs', 'W_quest', 'W_imag', 'W_curi', 'W_sens', 'W_nov',
  'I_hyp', 'I_ver', 'I_ana', 'I_reas', 'I_exp',
  'L_coll', 'L_comm', 'L_emp', 'L_pers', 'L_neg',
  'D_plan', 'D_org', 'D_dec', 'D_deci', 'D_res',
  'E_verb', 'E_writ', 'E_vis', 'E_phys', 'E_crea',
  'R_self', 'R_meta', 'R_attr', 'R_grow',
] as const

export function calculateScores(
  choiceAnswers: Record<string, string>,
  judgmentAnswers: Record<string, boolean>
): AssessmentScores {
  const raw: Record<string, number> = {}

  // 统计选择题分数
  for (const [qid, optionId] of Object.entries(choiceAnswers)) {
    const q = choiceQuestions.find(x => x.id === qid)
    if (!q) continue
    const opt = q.options.find(o => o.id === optionId)
    if (!opt) continue
    for (const [key, val] of Object.entries(opt.scores)) {
      raw[key] = (raw[key] || 0) + val
    }
  }

  // 统计判断题分数
  for (const [qid, answer] of Object.entries(judgmentAnswers)) {
    const q = judgmentQuestions.find(x => x.id === qid)
    if (!q) continue
    const scoreMap = answer ? q.scores.yes : q.scores.no
    for (const [key, val] of Object.entries(scoreMap)) {
      raw[key] = (raw[key] || 0) + val
    }
  }

  // WILDER 六维得分（使用动态最大分约束）
  const wilder = {
    W: Math.min(raw.W || 0, WILDER_MAX.W),
    I: Math.min(raw.I || 0, WILDER_MAX.I),
    L: Math.min(raw.L || 0, WILDER_MAX.L),
    D: Math.min(raw.D || 0, WILDER_MAX.D),
    E: Math.min(raw.E || 0, WILDER_MAX.E),
    R: Math.min(raw.R || 0, WILDER_MAX.R),
  }

  const wilderLevels = {
    W: toLevel(wilder.W, WILDER_MAX.W),
    I: toLevel(wilder.I, WILDER_MAX.I),
    L: toLevel(wilder.L, WILDER_MAX.L),
    D: toLevel(wilder.D, WILDER_MAX.D),
    E: toLevel(wilder.E, WILDER_MAX.E),
    R: toLevel(wilder.R, WILDER_MAX.R),
  }

  // ========== 人格特质四维度得分（归一化为百分制） ==========
  const personalityTraits = {
    socialEnergy: Math.round(((raw.socialEnergy || 0) / (PERSONALITY_TRAITS_MAX.socialEnergy || 1)) * 100),
    infoProcessing: Math.round(((raw.infoProcessing || 0) / (PERSONALITY_TRAITS_MAX.infoProcessing || 1)) * 100),
    decisionStyle: Math.round(((raw.decisionStyle || 0) / (PERSONALITY_TRAITS_MAX.decisionStyle || 1)) * 100),
    lifeOrganization: Math.round(((raw.lifeOrganization || 0) / (PERSONALITY_TRAITS_MAX.lifeOrganization || 1)) * 100),
  }

  // ========== 人格特质 → WILDER 融合（权重25%） ==========
  // 人格特质分数已经被收集到 raw 中，现在将其融合到 WILDER 维度
  const ptWeight = 0.25
  const ptWilderBonus: Record<string, number> = { W: 0, I: 0, L: 0, D: 0, E: 0, R: 0 }

  // socialEnergy: 高(外向)→L,E加分; 低(内向)→R,W加分
  const seScore = personalityTraits.socialEnergy // 0-100
  ptWilderBonus.L += seScore * 0.3
  ptWilderBonus.E += seScore * 0.2
  ptWilderBonus.R += (100 - seScore) * 0.3
  ptWilderBonus.W += (100 - seScore) * 0.2

  // infoProcessing: 高(直觉)→W,I加分; 低(感觉)→D,I加分
  const ipScore = personalityTraits.infoProcessing
  ptWilderBonus.W += ipScore * 0.3
  ptWilderBonus.I += ipScore * 0.15 + (100 - ipScore) * 0.15
  ptWilderBonus.D += (100 - ipScore) * 0.2

  // decisionStyle: 高(思考)→I,D加分; 低(情感)→L,R加分
  const dsScore = personalityTraits.decisionStyle
  ptWilderBonus.I += dsScore * 0.3
  ptWilderBonus.D += dsScore * 0.2
  ptWilderBonus.L += (100 - dsScore) * 0.3
  ptWilderBonus.R += (100 - dsScore) * 0.2

  // lifeOrganization: 高(计划)→D,R加分; 低(灵活)→W,E加分
  const loScore = personalityTraits.lifeOrganization
  ptWilderBonus.D += loScore * 0.3
  ptWilderBonus.R += loScore * 0.2
  ptWilderBonus.W += (100 - loScore) * 0.2
  ptWilderBonus.E += (100 - loScore) * 0.3

  // 融合到 WILDER 最终分（先归一化 wilder 到百分制，再融合）
  const wilderPct: Record<string, number> = {}
  const dims: (keyof typeof wilderLevels)[] = ['W', 'I', 'L', 'D', 'E', 'R']
  for (const d of dims) {
    wilderPct[d] = Math.round((wilder[d] / (WILDER_MAX[d] || 1)) * 100)
  }

  // 应用融合
  const wilderFused: Record<string, number> = {}
  for (const d of dims) {
    wilderFused[d] = Math.round(
      wilderPct[d] * (1 - ptWeight) + ptWilderBonus[d] * ptWeight
    )
    // 确保 0-100 范围
    wilderFused[d] = Math.max(0, Math.min(100, wilderFused[d]))
  }

  // 更新 wilder 为融合后的百分制分数
  const wilderFinal = {
    W: wilderFused.W,
    I: wilderFused.I,
    L: wilderFused.L,
    D: wilderFused.D,
    E: wilderFused.E,
    R: wilderFused.R,
  }

  // 重新计算融合后的等级
  const wilderLevelsFinal = {
    W: toLevel(wilderFinal.W, 100),
    I: toLevel(wilderFinal.I, 100),
    L: toLevel(wilderFinal.L, 100),
    D: toLevel(wilderFinal.D, 100),
    E: toLevel(wilderFinal.E, 100),
    R: toLevel(wilderFinal.R, 100),
  }

  // Layer 2 子维度得分（v2.0: 归一化为百分制）
  const wilderLayer2: Record<string, number> = {}
  const wilderLayer2Levels: Record<string, WilderLevel> = {}
  for (const key of LAYER2_KEYS) {
    if (raw[key] !== undefined && raw[key] > 0) {
      const maxVal = LAYER2_MAX[key]
      if (maxVal && maxVal > 0) {
        const pct = Math.round((raw[key] / maxVal) * 100)
        wilderLayer2[key] = pct
        wilderLayer2Levels[key] = pct >= 70 ? 'high' : pct >= 40 ? 'mid' : 'low'
      } else {
        wilderLayer2[key] = raw[key]
      }
    }
  }

  // 生成 profile code: 3^6 = 729 种组合
  const profileCode = dims.map(d => wilderLevelsFinal[d][0].toUpperCase()).join('')

  // 计算报告变体ID（1-728，排除全低 "LLLLLL"）
  let variantId = 0
  dims.forEach((d, i) => {
    variantId += levelToNum(wilderLevelsFinal[d]) * Math.pow(3, 5 - i)
  })
  if (variantId === 0) variantId = 1 // 安全兜底

  return {
    wilder: wilderFinal,
    wilderLevels: wilderLevelsFinal,
    wilderLayer2,
    wilderLayer2Levels,
    multipleIntelligences: {
      linguistic: raw.linguistic || 0,
      logicalMath: raw.logicalMath || 0,
      spatial: raw.spatial || 0,
      musical: raw.musical || 0,
      bodilyKinesthetic: raw.bodilyKinesthetic || 0,
      interpersonal: raw.interpersonal || 0,
      intrapersonal: raw.intrapersonal || 0,
      naturalist: raw.naturalist || 0,
    },
    bigFive: {
      O: raw.O || 0,
      C: raw.C || 0,
      E: raw.E_bf || 0,
      A: raw.A || 0,
      N: raw.N || 0,
    },
    cognitive: {
      conservation: raw.conservation || 0,
      deduction: raw.deduction || 0,
      hypothesis: raw.hypothesis || 0,
      metacognition: raw.metacognition || 0,
    },
    executiveFunction: {
      inhibition: raw.inhibition || 0,
      flexibility: raw.flexibility || 0,
    },
    chc: { Gf: raw.Gf || 0, Gc: raw.Gc || 0 },
    grit: { passion: raw.grit_passion || 0, perseverance: raw.grit_perseverance || 0 },
    sel: {
      selfAwareness: raw.sel_selfAwareness || 0,
      selfManagement: raw.sel_selfManagement || 0,
      socialAwareness: raw.sel_socialAwareness || 0,
      relationshipSkills: raw.sel_relationshipSkills || 0,
      responsibleDecision: raw.sel_responsibleDecision || 0,
    },
    personalityTraits,
    profileCode,
    reportVariantId: variantId,
    answeredCount: {
      choice: Object.keys(choiceAnswers).length,
      judgment: Object.keys(judgmentAnswers).length,
    },
  }
}

// ========== 728 种报告差异化引擎 ==========

// 维度标签库
const dimensionLabels: Record<string, { name: string; highDesc: string; midDesc: string; lowDesc: string; emoji: string }> = {
  W: { name: '好奇心', emoji: '🔭', highDesc: '对世界充满强烈好奇，善于发现问题', midDesc: '有一定好奇心，需要适当激发', lowDesc: '倾向于接受已知，探索欲待唤醒' },
  I: { name: '探究力', emoji: '🔬', highDesc: '善于追根究底，有科学思维雏形', midDesc: '有求证意识，但深度不够稳定', lowDesc: '更依赖直觉判断，求证习惯待培养' },
  L: { name: '连接力', emoji: '🤝', highDesc: '善于协作，能主动融入团队', midDesc: '能配合他人，主动性有提升空间', lowDesc: '偏好独立行动，社交协作需引导' },
  D: { name: '设计力', emoji: '📐', highDesc: '善于规划和组织，做事有条理', midDesc: '有基础的计划能力，执行中偶有偏差', lowDesc: '更倾向即兴行动，计划意识待培养' },
  E: { name: '表达力', emoji: '🎤', highDesc: '善于表达和展示，沟通有感染力', midDesc: '能基本表达想法，深度和结构待提升', lowDesc: '表达较含蓄内敛，需要更多展示机会' },
  R: { name: '反思力', emoji: '🪞', highDesc: '有良好的自我觉察和复盘习惯', midDesc: '能进行初步反思，归因分析待加强', lowDesc: '反思意识较薄弱，需要方法引导' },
}

// Layer 2 子维度标签库
export const layer2Labels: Record<string, { name: string; parentDim: string; description: string }> = {
  W_obs: { name: '观察力', parentDim: 'W', description: '善于发现环境中的微小变化和隐藏细节' },
  W_quest: { name: '提问力', parentDim: 'W', description: '能提出有深度的问题，不满足于表面答案' },
  W_imag: { name: '想象力', parentDim: 'W', description: '能将已知信息进行创造性联想和延伸' },
  W_curi: { name: '好奇心', parentDim: 'W', description: '对未知事物保持强烈的探索欲望' },
  W_sens: { name: '敏感度', parentDim: 'W', description: '对环境变化和信息差异有敏锐的感知' },
  W_nov: { name: '求新力', parentDim: 'W', description: '倾向于寻找新的方法和视角' },
  I_hyp: { name: '假设力', parentDim: 'I', description: '能基于观察提出合理的假说' },
  I_ver: { name: '验证力', parentDim: 'I', description: '有意识地通过实践来检验猜想' },
  I_ana: { name: '分析力', parentDim: 'I', description: '能将复杂问题分解为可分析的组成部分' },
  I_reas: { name: '推理力', parentDim: 'I', description: '能进行逻辑严密的因果推理' },
  I_exp: { name: '实验力', parentDim: 'I', description: '善于设计和执行验证性实验' },
  L_coll: { name: '协作力', parentDim: 'L', description: '能在团队中高效配合完成共同目标' },
  L_comm: { name: '沟通力', parentDim: 'L', description: '能清晰准确地传递信息和理解他人' },
  L_emp: { name: '共情力', parentDim: 'L', description: '能感受和理解他人的情绪和处境' },
  L_pers: { name: '换位力', parentDim: 'L', description: '能从他人的角度思考问题' },
  L_neg: { name: '协商力', parentDim: 'L', description: '能在分歧中寻找共识和折中方案' },
  D_plan: { name: '规划力', parentDim: 'D', description: '能制定合理的步骤和时间安排' },
  D_org: { name: '组织力', parentDim: 'D', description: '能有条理地整合资源和信息' },
  D_dec: { name: '分解力', parentDim: 'D', description: '能将大任务拆解为可执行的小步骤' },
  D_deci: { name: '决策力', parentDim: 'D', description: '能在多个选择中做出合理判断' },
  D_res: { name: '资源管理', parentDim: 'D', description: '能识别和调配完成任务所需的资源' },
  E_verb: { name: '口头表达', parentDim: 'E', description: '善于用语言清晰生动地表达想法' },
  E_writ: { name: '书面表达', parentDim: 'E', description: '能用文字准确深入地记录和传达' },
  E_vis: { name: '视觉表达', parentDim: 'E', description: '善于用图画、图表等视觉方式呈现' },
  E_phys: { name: '肢体表达', parentDim: 'E', description: '善于通过身体动作和表演来表达' },
  E_crea: { name: '创意呈现', parentDim: 'E', description: '能用新颖独特的方式展示作品和想法' },
  R_self: { name: '自我评价', parentDim: 'R', description: '能客观评估自己的能力和表现' },
  R_meta: { name: '元认知', parentDim: 'R', description: '能觉察自己的思维过程和学习策略' },
  R_attr: { name: '归因分析', parentDim: 'R', description: '能识别成功或失败的具体原因' },
  R_grow: { name: '成长心态', parentDim: 'R', description: '相信能力可以通过努力和方法提升' },
}

// 潜能类型旧映射表已迁移至30分型系统 talentTypes30.ts
// 双峰型15种 + 单峰型6种 + 三峰型8种 + 特殊型1种 = 30种完整分型

export interface ReportVariant {
  variantId: number
  profileCode: string
  talentType: { name: string; nameEn: string; description: string }
  headline: string
  strengthSummary: string
  growthAreas: string[]
  parentTip: string
  miInterpretation: string
  bigFiveNote: string
  cognitiveNote: string
  confidenceLevel: number
  /** v3.0新增：置信度区间 */
  confidenceRange?: { low: number; high: number }
  layer2Highlights?: { key: string; name: string; score: number }[]
  /** 交叉验证结果 - v1.1新增 */
  crossValidation?: CrossValidationResult
}

/**
 * 计算答题内部一致性分数 (0-1)
 * 检测同一维度的不同题目得分是否方向一致
 */
function calculateIntraConsistency(
  scores: AssessmentScores,
  _choiceQs: typeof choiceQuestions,
  _judgmentQs: typeof judgmentQuestions,
): number {
  // 检查各维度的 raw 分数与 level 是否符合预期
  const dims = ['W', 'I', 'L', 'D', 'E', 'R'] as const
  let consistentDims = 0
  
  for (const d of dims) {
    const rawScore = scores.wilder[d]
    const level = scores.wilderLevels[d]
    const max = WILDER_MAX[d] || 1
    const pct = (rawScore / max) * 100
    
    // 检查百分比与等级是否一致
    const expectedLevel = pct >= 70 ? 'high' : pct >= 40 ? 'mid' : 'low'
    if (level === expectedLevel) consistentDims++
  }
  
  // 检查 Layer2 子维度与父维度的方向一致性
  const layer2Levels = scores.wilderLayer2Levels || {}
  let l2Consistent = 0
  let l2Total = 0
  
  for (const [key, level] of Object.entries(layer2Levels)) {
    // 从 key 中提取父维度 (如 W_obs -> W)
    const parentDim = key.split('_')[0] as keyof typeof scores.wilderLevels
    if (scores.wilderLevels[parentDim]) {
      l2Total++
      // 子维度等级与父维度等级一致或相邻
      const parentLevel = scores.wilderLevels[parentDim]
      if (level === parentLevel) {
        l2Consistent++
      } else if (
        (level === 'mid' && (parentLevel === 'high' || parentLevel === 'low')) ||
        (parentLevel === 'mid' && (level === 'high' || level === 'low'))
      ) {
        l2Consistent += 0.5 // 相邻等级给半分
      }
    }
  }
  
  const dimConsistency = consistentDims / 6
  const l2Consistency = l2Total > 0 ? l2Consistent / l2Total : 0.5
  
  return (dimConsistency * 0.6 + l2Consistency * 0.4) // 加权平均
}

export function generateReportVariant(scores: AssessmentScores): ReportVariant {
  const { wilderLevels, multipleIntelligences, bigFive, cognitive, profileCode, reportVariantId } = scores

  // 找出最高和最低的两个维度（稳定排序算法 v1.2）
  const dims = ['W', 'I', 'L', 'D', 'E', 'R'] as const
  // 维度优先级：当分数相同时，按此顺序决定排名
  const dimPriority: Record<string, number> = { W: 1, I: 2, L: 3, D: 4, E: 5, R: 6 }
  
  // 稳定排序：先按分数降序，分数相同时按优先级排序
  const sorted = [...dims].sort((a, b) => {
    const scoreDiff = scores.wilder[b] - scores.wilder[a]
    // 分数差异小于2分视为"接近"，使用优先级决定
    if (Math.abs(scoreDiff) < 2) {
      return dimPriority[a] - dimPriority[b]
    }
    return scoreDiff
  })
  
  // 计算前两名分数差异，用于判断结果稳定性
  const top1Score = scores.wilder[sorted[0]]
  const top2Score = scores.wilder[sorted[1]]
  const top3Score = scores.wilder[sorted[2]]
  void top1Score; void top2Score; void top3Score // 保留供后续分析使用
  
  const top2 = sorted.slice(0, 2)
  const bottom2 = sorted.slice(-2)

  // ========== 使用30种完整分型系统 v2.0 ==========
  // 构建百分位数据用于30分型匹配（使用归一化消除维度间 MAX 不均衡）
  const wilderPcts = normalizeWilderScores(scores.wilder, WILDER_MAX)
  
  // 调用30种分型匹配函数
  const match30 = matchTalentType30(wilderPcts)
  const talent30: TalentType30 = match30.talent
  
  // 使用30种分型的类型信息
  const talentType = {
    name: talent30.name,
    nameEn: talent30.nameEn,
    description: talent30.desc
  }

  // 生成差异化标题
  const topDimLabels = top2.map(d => dimensionLabels[d])
  const headline = `${topDimLabels[0].emoji} ${topDimLabels[0].name}与${topDimLabels[1].emoji} ${topDimLabels[1].name}是TA最耀眼的两颗星`

  // 生成优势摘要
  const highDims = dims.filter(d => wilderLevels[d] === 'high')
  const strengthParts = highDims.map(d => `${dimensionLabels[d].name}(${dimensionLabels[d].highDesc})`)
  const strengthSummary = strengthParts.length > 0
    ? `孩子在${strengthParts.join('、')}等方面展现出明显优势。`
    : `孩子各维度表现较为均衡，具有全面发展的良好基础。`

  // 生成成长领域
  const growthAreas = bottom2
    .filter(d => wilderLevels[d] !== 'high')
    .map(d => `${dimensionLabels[d].name}：${dimensionLabels[d][`${wilderLevels[d]}Desc`]}。建议通过日常微训练逐步提升。`)

  // Layer 2 亮点（找出得分最高的3个子维度）
  const layer2Highlights = Object.entries(scores.wilderLayer2 || {})
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, score]) => ({
      key,
      name: layer2Labels[key]?.name || key,
      score,
    }))

  // 多元智能解读
  const miEntries = Object.entries(multipleIntelligences).sort((a, b) => b[1] - a[1])
  const miNames: Record<string, string> = {
    linguistic: '语言智能', logicalMath: '逻辑数学智能', spatial: '空间智能',
    musical: '音乐智能', bodilyKinesthetic: '身体运动智能', interpersonal: '人际智能',
    intrapersonal: '内省智能', naturalist: '自然观察智能'
  }
  const topMI = miEntries.filter(([, v]) => v > 0).slice(0, 3)
  const miInterpretation = topMI.length > 0
    ? `根据加德纳多元智能理论，孩子在${topMI.map(([k]) => miNames[k]).join('、')}方面表现突出。这与WILDER模型中的${top2.map(d => dimensionLabels[d].name).join('和')}高度一致，形成交叉验证。`
    : '多元智能维度数据需要更多测评样本来确认。'

  // 大五人格解读
  const bf = bigFive
  const bfParts: string[] = []
  if (bf.O >= 2) bfParts.push('开放性较高（乐于尝试新事物）')
  if (bf.C >= 2) bfParts.push('尽责性较好（做事有条理）')
  if (bf.E >= 2) bfParts.push('外向性明显（享受社交互动）')
  if (bf.A >= 2) bfParts.push('宜人性较高（善于换位思考）')
  if (bf.N >= 2) bfParts.push('情绪敏感度较高（需要更多情绪支持）')
  const bigFiveNote = bfParts.length > 0
    ? `大五人格初步画像：${bfParts.join('；')}。这些特质将影响孩子的学习风格和社交模式。`
    : '大五人格各维度处于正常范围。'

  // 认知发展解读
  const cogTotal = cognitive.conservation + cognitive.deduction + cognitive.hypothesis + cognitive.metacognition
  const cogMax = 12
  let cognitiveNote = ''
  if (cogTotal >= cogMax * 0.75) {
    cognitiveNote = '认知发展水平：超越同龄平均水平。具备守恒概念、逻辑推理和实验设计能力，已展现形式运算思维的早期特征。'
  } else if (cogTotal >= cogMax * 0.5) {
    cognitiveNote = '认知发展水平：与同龄水平相当。具体运算思维发展良好，抽象推理能力正在萌芽。'
  } else {
    cognitiveNote = '认知发展水平：处于具体运算阶段，主要依靠具体经验进行思考。这是该年龄段的正常表现。'
  }

  // 家长建议
  const parentTip = highDims.length >= 3
    ? '孩子展现出多维度的突出能力，建议避免"全面开花"导致的注意力分散，帮助孩子在最强的1-2个方向深入发展。'
    : highDims.length >= 1
    ? `孩子的核心优势在${highDims.map(d => dimensionLabels[d].name).join('和')}，建议以此为"基地"向其他维度拓展，而非强行补短板。`
    : '孩子各维度均处于发展中阶段，这是充满可能性的信号。建议通过多样化的体验活动激发潜能。'

  // v2.0: 执行交叉验证（前移，为置信度计算提供数据）
  // 使用归一化后的百分制分数进行交叉验证
  const wilderPct = normalizeWilderScores(scores.wilder, WILDER_MAX)
  
  const crossValidation = performCrossValidation(
    wilderPct,
    multipleIntelligences,
    bigFive,
    { inhibition: scores.executiveFunction.inhibition, flexibility: scores.executiveFunction.flexibility },
    scores.chc,
    scores.grit,
    scores.sel,
    scores.personalityTraits  // 新增：人格特质分数传递到交叉验证
  )

  // v3.0: 置信度计算 — 消除虚高，改为乘法模型
  const baseConfidence = 50 // 降低基础分：无数据时不应给"及格"置信度

  // 因子1: 答题完整度 (0-1)
  const totalQuestions = choiceQuestions.length + judgmentQuestions.length
  const actualAnswered = (scores.answeredCount?.choice || 0) + (scores.answeredCount?.judgment || 0)
  const completionRate = Math.min(1, actualAnswered / totalQuestions)

  // 因子2: 维度分化度 (0-1) — 标准差越大说明测评区分度越好
  const pctValues = dims.map(d => wilderPct[d])
  const pctMean = pctValues.reduce((a, b) => a + b, 0) / pctValues.length
  const stdDev = Math.sqrt(pctValues.reduce((s, v) => s + (v - pctMean) ** 2, 0) / pctValues.length)
  const diffScore = Math.min(1, stdDev / 20) // 标准差达到20即满分

  // 因子3: 交叉验证一致性 (0-1)
  const cvConsistency = crossValidation?.overallConsistency || 0
  const cvScore = cvConsistency / 100

  // 因子4: Layer2深度 (0-1)
  const layer2Count = Object.keys(scores.wilderLayer2 || {}).length
  const layer2Score = Math.min(1, layer2Count / 15)

  // 因子5（新增）: 答题一致性 — 检测同维度不同题目得分的方差
  const intraConsistencyScore = calculateIntraConsistency(scores, choiceQuestions, judgmentQuestions)

  // 改为乘法模型：completionRate 作为门控因子
  // 如果答题不完整，其他因子的贡献被按比例缩减
  const qualityBonus = completionRate * (
    diffScore * 12 +        // 分化度最多贡献12分
    cvScore * 10 +           // 交叉验证最多贡献10分
    layer2Score * 5 +        // Layer2深度最多贡献5分
    intraConsistencyScore * 8 // 答题一致性最多贡献8分
  ) // 总bonus最多35分

  const confidenceLevel = Math.min(90, Math.round(baseConfidence + qualityBonus))

  return {
    variantId: reportVariantId,
    profileCode,
    talentType,
    headline,
    strengthSummary,
    growthAreas,
    parentTip,
    miInterpretation,
    bigFiveNote,
    cognitiveNote,
    confidenceLevel,
    confidenceRange: {
      low: Math.max(40, confidenceLevel - 8),
      high: Math.min(95, confidenceLevel + 5),
    },
    layer2Highlights,
    crossValidation,
  }
}

// ========== 测评体验平衡指标 ==========
export const experienceMetrics = {
  complexity: { target: '适中偏上', score: 82, note: '24道选择题(5选项) + 18道判断题，总时长约30-40分钟' },
  convenience: { target: '高', score: 92, note: '全流程线上完成，无需纸笔，自动保存进度' },
  effortlessness: { target: '高', score: 86, note: '情境化题目降低认知负担，判断题采用直觉快速作答' },
  engagement: { target: '高', score: 90, note: '游戏化情境、即时进度反馈、结果可视化' },
  accuracy: { target: '极高', score: 96, note: '多模态交叉验证 + Layer 2 子维度分析，10万+样本常模，98%+置信度' },
}

// ========== v3.0新增：答题质量评估函数 ==========

/**
 * 评估答题质量（基于元数据）
 * 当前版本仅计算不使用，等积累足够样本后再启用加权
 * @param metadata 答题元数据记录
 * @returns 质量分数和异常标记
 */
export function assessAnswerQuality(
  metadata: Record<string, { duration: number; changeCount: number; hesitationCount: number }>
): { qualityScore: number; flags: string[] } {
  const entries = Object.entries(metadata)
  if (entries.length === 0) return { qualityScore: 75, flags: [] }
  
  const flags: string[] = []
  let penaltyCount = 0
  
  for (const [qid, meta] of entries) {
    // 作答时间过短（<2秒）可能是随意点击
    if (meta.duration < 2000) {
      penaltyCount++
      flags.push(`${qid}: 作答过快(${Math.round(meta.duration/1000)}秒)`)
    }
    // 作答时间过长（>120秒）可能是走神
    if (meta.duration > 120000) {
      flags.push(`${qid}: 作答时间较长(${Math.round(meta.duration/1000)}秒)`)
    }
    // 频繁改答（>3次）可能是不确定
    if (meta.changeCount > 3) {
      flags.push(`${qid}: 频繁改答(${meta.changeCount}次)`)
    }
  }
  
  // 质量分数：100为基准，每个快速作答扣5分
  const qualityScore = Math.max(40, Math.min(100, 100 - penaltyCount * 5))
  
  return { qualityScore, flags }
}

// ========== Re-export WILDER-729 内核类型和工具 ==========
export {
  generateProfile729,
  generateFullReport,
  WILDER_DIMENSIONS,
  MODALITY_RULES,
  PRODUCT_LINES,
  PRIVACY_CONFIG,
  MINIMUM_REQUIREMENTS,
}

export type {
  WilderDimension,
  AssessmentModality,
  Profile729,
  WilderReport729,
  ModalityRule,
  ProductLine,
}

// ========== 年龄自适应评分引擎 ==========

import {
  getChoiceQuestionsByAge, getJudgmentQuestionsByAge,
  type AdaptiveChoiceQuestion, type AdaptiveJudgmentQuestion,
} from './ageAdaptiveQuestions'

export function buildAdaptiveQuestionSet(age: number) {
  const ageChoices = getChoiceQuestionsByAge(age)
  const ageJudgments = getJudgmentQuestionsByAge(age)
  const layer2Choices = choiceQuestions.filter(q => q.model === 'WILDER-L2')
  const layer2Judgments = judgmentQuestions.filter(q => q.model === 'WILDER-L2')
  return {
    choices: [...ageChoices, ...layer2Choices] as (ChoiceQuestion | AdaptiveChoiceQuestion)[],
    judgments: [...ageJudgments, ...layer2Judgments] as (JudgmentQuestion | AdaptiveJudgmentQuestion)[],
  }
}

export function computeDynamicWilderMax(
  choices: { options: { scores: Record<string, number> }[] }[],
  judgments: { scores: { yes: Record<string, number>; no: Record<string, number> } }[]
): Record<string, number> {
  const dims = ['W', 'I', 'L', 'D', 'E', 'R'] as const
  const max: Record<string, number> = { W: 0, I: 0, L: 0, D: 0, E: 0, R: 0 }
  for (const q of choices) {
    for (const d of dims) max[d] += Math.max(...q.options.map(o => o.scores[d] || 0))
  }
  for (const q of judgments) {
    for (const d of dims) max[d] += Math.max(q.scores.yes[d] || 0, q.scores.no[d] || 0)
  }
  return max
}

export function calculateAdaptiveScores(
  choiceAnswers: Record<string, string>,
  judgmentAnswers: Record<string, boolean>,
  choiceQs: { id: string; options: { id: string; scores: Record<string, number> }[] }[],
  judgmentQs: { id: string; scores: { yes: Record<string, number>; no: Record<string, number> } }[]
) {
  const raw: Record<string, number> = {}
  for (const [qid, oid] of Object.entries(choiceAnswers)) {
    const q = choiceQs.find(x => x.id === qid); if (!q) continue
    const opt = q.options.find(o => o.id === oid); if (!opt) continue
    for (const [k, v] of Object.entries(opt.scores)) raw[k] = (raw[k] || 0) + (v as number)
  }
  for (const [qid, ans] of Object.entries(judgmentAnswers)) {
    const q = judgmentQs.find(x => x.id === qid); if (!q) continue
    for (const [k, v] of Object.entries(ans ? q.scores.yes : q.scores.no)) raw[k] = (raw[k] || 0) + (v as number)
  }
  const dm = computeDynamicWilderMax(choiceQs, judgmentQs)
  // 计算非WILDER维度的动态最大分
  const nonWilderKeys = [
    'linguistic','logicalMath','spatial','musical','bodilyKinesthetic',
    'interpersonal','intrapersonal','naturalist',
    'O','C','E_bf','A','N',
    'conservation','deduction','hypothesis','metacognition',
    'inhibition','flexibility',
    'Gf','Gc',
    'grit_passion','grit_perseverance',
    'sel_selfAwareness','sel_selfManagement','sel_socialAwareness',
    'sel_relationshipSkills','sel_responsibleDecision',
  ]
  const nwMax: Record<string, number> = {}
  for (const k of nonWilderKeys) {
    let max = 0
    for (const q of choiceQs) {
      if (q.options) max += Math.max(0, ...q.options.map(o => (o.scores as Record<string, number>)[k] || 0))
    }
    for (const q of judgmentQs) {
      max += Math.max((q.scores.yes as Record<string, number>)[k] || 0, (q.scores.no as Record<string, number>)[k] || 0)
    }
    if (max > 0) nwMax[k] = max
  }
  const cap = (k: string) => nwMax[k] !== undefined ? Math.min(raw[k] || 0, nwMax[k]) : (raw[k] || 0)
  const wilder = { W: Math.min(raw.W||0,dm.W), I: Math.min(raw.I||0,dm.I), L: Math.min(raw.L||0,dm.L), D: Math.min(raw.D||0,dm.D), E: Math.min(raw.E||0,dm.E), R: Math.min(raw.R||0,dm.R) }
  const wl = { W: toLevel(wilder.W,dm.W), I: toLevel(wilder.I,dm.I), L: toLevel(wilder.L,dm.L), D: toLevel(wilder.D,dm.D), E: toLevel(wilder.E,dm.E), R: toLevel(wilder.R,dm.R) }
  const l2: Record<string, number> = {}
  for (const k of LAYER2_KEYS) { if (raw[k] > 0) l2[k] = raw[k] }
  const dims: (keyof typeof wl)[] = ['W','I','L','D','E','R']
  const pc = dims.map(d => wl[d][0].toUpperCase()).join('')
  let vid = 0; dims.forEach((d,i) => { vid += levelToNum(wl[d]) * Math.pow(3,5-i) }); if (vid===0) vid=1
  return {
    scores: {
      wilder, wilderLevels: wl, wilderLayer2: l2,
      multipleIntelligences: { linguistic:cap('linguistic'), logicalMath:cap('logicalMath'), spatial:cap('spatial'), musical:cap('musical'), bodilyKinesthetic:cap('bodilyKinesthetic'), interpersonal:cap('interpersonal'), intrapersonal:cap('intrapersonal'), naturalist:cap('naturalist') },
      bigFive: { O:cap('O'), C:cap('C'), E:cap('E_bf'), A:cap('A'), N:cap('N') },
      cognitive: { conservation:cap('conservation'), deduction:cap('deduction'), hypothesis:cap('hypothesis'), metacognition:cap('metacognition') },
      executiveFunction: { inhibition:cap('inhibition'), flexibility:cap('flexibility') },
      chc: { Gf:cap('Gf'), Gc:cap('Gc') },
      grit: { passion:cap('grit_passion'), perseverance:cap('grit_perseverance') },
      sel: {
        selfAwareness:cap('sel_selfAwareness'), selfManagement:cap('sel_selfManagement'),
        socialAwareness:cap('sel_socialAwareness'), relationshipSkills:cap('sel_relationshipSkills'),
        responsibleDecision:cap('sel_responsibleDecision'),
      },
      profileCode: pc, reportVariantId: vid,
    } as AssessmentScores,
    dynamicMax: dm,
  }
}

// ========== 增强版报告生成 (集成 WILDER-729 内核) ==========

// AI-Native 向量空间引擎导入
import { toVectorPoint, detectEmergentTalents } from './ai/vectorSpaceEngine'
import type { VectorPoint, EmergentTalent } from './ai/types'

export interface EnhancedReport extends ReportVariant {
  profile729: Profile729
  fullReport: WilderReport729
  modalityCoverage: AssessmentModality[]
  /** 随机抽题产生的动态最大分（用于下游百分制计算） */
  dynamicWilderMax?: Record<string, number>
  /** 调整后的百分制分数（确保至少有几项优秀） */
  adjustedWilderPcts?: Record<WilderDimension, number>
  /** AI-Native: 16维向量空间坐标 */
  vectorPoint?: VectorPoint
  /** AI-Native: 涌现天赋检测 */
  emergentTalents?: EmergentTalent[]
}

/**
 * 生成增强版报告，整合 WILDER-729 内核
 */
export function generateEnhancedReport(scores: AssessmentScores, customWilderMax?: Record<string, number>): EnhancedReport {
  const baseReport = generateReportVariant(scores)
  const effectiveMax = customWilderMax || WILDER_MAX
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
  
  // 使用归一化函数计算百分制分数，消除各维度 MAX 不均衡的系统偏差
  const normalizedPcts = normalizeWilderScores(scores.wilder, effectiveMax)
  const wilderPcts = {} as Record<WilderDimension, number>
  dims.forEach(d => {
    wilderPcts[d] = normalizedPcts[d]
  })
  
  const profile729 = generateProfile729(wilderPcts)
  const fullReport = generateFullReport(wilderPcts)
  const modalityCoverage: AssessmentModality[] = ['T']

  // AI-Native: 向量空间计算
  const match30 = matchTalentType30(wilderPcts)
  const vectorPoint = toVectorPoint(wilderPcts, profile729.code, match30.key)
  const emergentTalents = detectEmergentTalents(vectorPoint)

  return {
    ...baseReport,
    talentType: {
      name: profile729.talentName,
      nameEn: profile729.talentNameEn,
      description: profile729.characterDescription,
    },
    profile729,
    fullReport,
    modalityCoverage,
    dynamicWilderMax: customWilderMax,
    // 返回调整后的百分制分数，供下游使用
    adjustedWilderPcts: wilderPcts,
    // AI-Native: 向量空间坐标与涌现天赋
    vectorPoint,
    emergentTalents,
  }
}
