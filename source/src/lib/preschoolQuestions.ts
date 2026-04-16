// ===================================================================
// 学龄前(4-5岁)专属测评题库 v1.0
// 基于皮亚杰前运算阶段认知发展理论设计
// 设计原则：情境生活化、语言简单化、选项具象化、形式游戏化
// ===================================================================

export type PreschoolAgeGroup = 'preschool-4' | 'preschool-5'

export interface PreschoolChoiceQuestion {
  id: string
  ageGroup: PreschoolAgeGroup
  text: string
  scenario?: string
  model: 'MI' | 'BigFive' | 'Cognitive' | 'WILDER' | 'EF' | 'CHC' | 'Grit' | 'SEL'
  dimension: string
  wilderMapping: string[]
  options: { id: string; text: string; scores: Record<string, number> }[]
  cognitiveLevel: string
  designRationale: string
  // 幼儿专用：可选的图片描述（便于家长读题时展示）
  visualHint?: string
}

export interface PreschoolJudgmentQuestion {
  id: string
  ageGroup: PreschoolAgeGroup
  text: string
  scenario?: string
  model: 'MI' | 'BigFive' | 'Cognitive' | 'WILDER' | 'EF' | 'CHC' | 'Grit' | 'SEL'
  dimension: string
  wilderMapping: string[]
  correctAnswer: boolean
  scores: { yes: Record<string, number>; no: Record<string, number> }
  cognitiveLevel: string
  designRationale: string
  visualHint?: string
}

// ========== 4岁题目（更简单、更生活化）==========
const CHOICE_PRESCHOOL_4: PreschoolChoiceQuestion[] = [
  {
    id: 'PS4-C01',
    ageGroup: 'preschool-4',
    text: '宝宝，你在公园里看到一只没见过的小虫子，你会怎么做呀？',
    scenario: '和爸爸妈妈在草地上玩',
    model: 'WILDER',
    dimension: '好奇心',
    wilderMapping: ['W', 'I'],
    options: [
      { id: 'a', text: '蹲下来看看它长什么样子', scores: { W: 3, I: 1 } },
      { id: 'b', text: '叫爸爸妈妈来看', scores: { L: 2, W: 1 } },
      { id: 'c', text: '用小手轻轻碰碰它', scores: { W: 2, I: 2 } },
      { id: 'd', text: '有点害怕，躲到妈妈身后', scores: { E: 0, W: 0 } },
    ],
    cognitiveLevel: '前运算阶段-观察探索',
    designRationale: '4岁幼儿通过具体动作探索世界，测评好奇心的自然表现',
    visualHint: '小虫子的图片',
  },
  {
    id: 'PS4-C02',
    ageGroup: 'preschool-4',
    text: '宝宝，积木倒掉了，你会怎么办？',
    scenario: '你搭的高高的积木塔突然倒了',
    model: 'WILDER',
    dimension: '坚持力',
    wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '马上重新搭起来', scores: { D: 3, R: 1 } },
      { id: 'b', text: '有点难过，休息一下再搭', scores: { R: 2, E: 1 } },
      { id: 'c', text: '叫妈妈/爸爸帮忙一起搭', scores: { L: 2, D: 1 } },
      { id: 'd', text: '不想玩了，去玩别的', scores: { D: 0, W: 1 } },
    ],
    cognitiveLevel: '前运算阶段-挫折应对',
    designRationale: '通过积木倒塌场景测评幼儿的坚持力和情绪调节',
    visualHint: '积木倒塌的图片',
  },
  {
    id: 'PS4-C03',
    ageGroup: 'preschool-4',
    text: '宝宝，你想玩小朋友的玩具，你会怎么说呀？',
    scenario: '幼儿园里，有个小朋友在玩一个很好玩的玩具',
    model: 'WILDER',
    dimension: '连接力',
    wilderMapping: ['L', 'E'],
    options: [
      { id: 'a', text: '走过去说"我可以和你一起玩吗？"', scores: { L: 3, E: 2 } },
      { id: 'b', text: '站在旁边看TA玩', scores: { L: 1, I: 1 } },
      { id: 'c', text: '去拿别的玩具自己玩', scores: { W: 1, D: 1 } },
      { id: 'd', text: '直接伸手去拿', scores: { L: 0, E: 1 } },
    ],
    cognitiveLevel: '前运算阶段-社交互动',
    designRationale: '测评幼儿的社交策略和连接力发展',
    visualHint: '两个小朋友的图片',
  },
  {
    id: 'PS4-C04',
    ageGroup: 'preschool-4',
    text: '宝宝，妈妈/爸爸给你讲故事的时候，你喜欢做什么呀？',
    scenario: '睡觉前的故事时间',
    model: 'WILDER',
    dimension: '好奇心+表达力',
    wilderMapping: ['W', 'E'],
    options: [
      { id: 'a', text: '听得很认真，想知道后面发生什么', scores: { W: 3, I: 1 } },
      { id: 'b', text: '会问"为什么呀？""然后呢？"', scores: { W: 2, E: 2 } },
      { id: 'c', text: '喜欢跟着一起说故事里的词', scores: { E: 3, L: 1 } },
      { id: 'd', text: '有时候会跑神，想别的事情', scores: { W: 1, R: 1 } },
    ],
    cognitiveLevel: '前运算阶段-语言理解',
    designRationale: '通过故事场景测评好奇心和语言表达倾向',
  },
  {
    id: 'PS4-C05',
    ageGroup: 'preschool-4',
    text: '宝宝，你画了一幅画，老师/妈妈说"真好看"，你心里怎么想呀？',
    scenario: '你用彩笔画了一幅画',
    model: 'WILDER',
    dimension: '表达力',
    wilderMapping: ['E', 'R'],
    options: [
      { id: 'a', text: '很开心，想画更多给大家看', scores: { E: 3, W: 1 } },
      { id: 'b', text: '想告诉老师/妈妈画的是什么', scores: { E: 2, L: 1 } },
      { id: 'c', text: '继续安静地画，不说话', scores: { R: 2, D: 1 } },
      { id: 'd', text: '有点害羞，把画藏起来', scores: { E: 0, R: 1 } },
    ],
    cognitiveLevel: '前运算阶段-自我表达',
    designRationale: '测评幼儿对正向反馈的反应和表达意愿',
  },
  {
    id: 'PS4-C06',
    ageGroup: 'preschool-4',
    text: '宝宝，如果玩具小熊"生病"了，你会怎么做呀？',
    scenario: '玩过家家游戏',
    model: 'WILDER',
    dimension: '连接力+反思力',
    wilderMapping: ['L', 'R'],
    options: [
      { id: 'a', text: '给它盖被子，喂它喝水', scores: { L: 3, E: 1 } },
      { id: 'b', text: '抱着它，轻轻拍拍它', scores: { L: 2, R: 1 } },
      { id: 'c', text: '叫妈妈/爸爸来看看', scores: { L: 1, D: 1 } },
      { id: 'd', text: '继续玩别的玩具', scores: { L: 0, W: 1 } },
    ],
    cognitiveLevel: '前运算阶段-共情发展',
    designRationale: '通过假装游戏测评幼儿的共情能力和连接力',
    visualHint: '小熊玩偶的图片',
  },
  {
    id: 'PS4-C07',
    ageGroup: 'preschool-4',
    text: '宝宝，你有两块饼干，好朋友也想吃，你会怎么做呀？',
    scenario: '吃点心的时候',
    model: 'WILDER',
    dimension: '连接力',
    wilderMapping: ['L', 'R'],
    options: [
      { id: 'a', text: '分一块给好朋友', scores: { L: 3, R: 1 } },
      { id: 'b', text: '把两块都掰开，一人一半', scores: { L: 2, D: 1 } },
      { id: 'c', text: '自己先吃完，再给好朋友', scores: { L: 1, R: 1 } },
      { id: 'd', text: '不想分，自己吃', scores: { L: 0, E: 1 } },
    ],
    cognitiveLevel: '前运算阶段-分享行为',
    designRationale: '通过分享场景测评幼儿的社交连接力发展',
  },
  {
    id: 'PS4-C08',
    ageGroup: 'preschool-4',
    text: '宝宝，你正在搭积木，妈妈/爸爸叫你吃饭了，你会怎么做呀？',
    scenario: '玩得很开心的时候',
    model: 'WILDER',
    dimension: '设计力+反思力',
    wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '马上放下积木，去吃饭', scores: { R: 2, L: 2 } },
      { id: 'b', text: '说"等一下"，把积木搭完再去', scores: { D: 3, R: 1 } },
      { id: 'c', text: '把积木摆好，吃完饭继续玩', scores: { D: 2, R: 2 } },
      { id: 'd', text: '不想吃饭，想继续玩', scores: { D: 1, R: 0 } },
    ],
    cognitiveLevel: '前运算阶段-任务切换',
    designRationale: '测评幼儿的计划性和自我调节能力',
  },
  {
    id: 'PS4-C09',
    ageGroup: 'preschool-4',
    text: '宝宝，小朋友不小心撞到你，你会怎么做呀？',
    scenario: '在幼儿园玩游戏',
    model: 'WILDER',
    dimension: '连接力+反思力',
    wilderMapping: ['L', 'R'],
    options: [
      { id: 'a', text: '没关系，继续玩', scores: { L: 2, R: 2 } },
      { id: 'b', text: '告诉TA"你撞到我了"', scores: { E: 2, L: 1 } },
      { id: 'c', text: '有点想哭', scores: { E: 1, R: 1 } },
      { id: 'd', text: '也去撞TA一下', scores: { L: 0, E: 0 } },
    ],
    cognitiveLevel: '前运算阶段-冲突处理',
    designRationale: '测评幼儿的社交情绪调节能力',
  },
  {
    id: 'PS4-C10',
    ageGroup: 'preschool-4',
    text: '宝宝，你想吃柜子里的糖果，但是够不着，你会怎么做呀？',
    scenario: '糖果放在很高的地方',
    model: 'WILDER',
    dimension: '设计力+探究力',
    wilderMapping: ['D', 'I'],
    options: [
      { id: 'a', text: '搬个小凳子站上去拿', scores: { D: 3, I: 2 } },
      { id: 'b', text: '叫妈妈/爸爸帮忙', scores: { L: 2, E: 1 } },
      { id: 'c', text: '跳起来试试能不能拿到', scores: { I: 2, W: 1 } },
      { id: 'd', text: '看着糖果，不知道怎么办', scores: { D: 0, I: 0 } },
    ],
    cognitiveLevel: '前运算阶段-问题解决',
    designRationale: '测评幼儿的工具使用和问题解决能力',
    visualHint: '高柜子和糖果的图片',
  },
  {
    id: 'PS4-C11',
    ageGroup: 'preschool-4',
    text: '宝贝，水龙头的水一直滴滴滴，你想知道水去哪里了吗？',
    scenario: '在家里看到水龙头滴水',
    model: 'WILDER',
    dimension: '探究欲望',
    wilderMapping: ['I', 'W'],
    options: [
      { id: 'a', text: '想！我要跟着水看看', scores: { I: 3, W: 2 } },
      { id: 'b', text: '想知道，但我要问大人', scores: { I: 2, L: 1 } },
      { id: 'c', text: '把水龙头关掉', scores: { D: 2, R: 1 } },
      { id: 'd', text: '没什么好看的', scores: {} },
    ],
    cognitiveLevel: '前运算阶段-因果探究',
    designRationale: '测评4岁幼儿对日常现象的探究欲望',
    visualHint: '水龙头滴水的图片',
  },
  {
    id: 'PS4-C12',
    ageGroup: 'preschool-4',
    text: '妈妈说糖放进水里就不见了，你想自己试试看吗？',
    scenario: '妈妈在厨房做事',
    model: 'WILDER',
    dimension: '实验探究',
    wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: '想！我要看糖怎么不见的', scores: { I: 3, W: 1 } },
      { id: 'b', text: '试试看，还想试试盐会不会也不见', scores: { I: 3, D: 2 } },
      { id: 'c', text: '妈妈说了就是这样吧', scores: { R: 1 } },
      { id: 'd', text: '不想试，怕浪费糖', scores: { R: 1 } },
    ],
    cognitiveLevel: '前运算阶段-实验验证',
    designRationale: '测评4岁幼儿的实验探究意愿和变量思维萌芽',
    visualHint: '糖和水杯的图片',
  },
]

// ========== 5岁题目（稍复杂、更多选择）==========
const CHOICE_PRESCHOOL_5: PreschoolChoiceQuestion[] = [
  {
    id: 'PS5-C01',
    ageGroup: 'preschool-5',
    text: '宝贝，你在院子里发现了一朵没见过的小花，你会怎么做？',
    scenario: '和爸爸妈妈在户外玩',
    model: 'WILDER',
    dimension: '好奇心+探究力',
    wilderMapping: ['W', 'I'],
    options: [
      { id: 'a', text: '蹲下来仔细看，想知道它叫什么名字', scores: { W: 3, I: 2 } },
      { id: 'b', text: '用手机拍下来，回家查一查', scores: { I: 3, D: 1 } },
      { id: 'c', text: '问爸爸妈妈这是什么花', scores: { W: 2, L: 1 } },
      { id: 'd', text: '摘下来玩', scores: { W: 1, D: 1 } },
    ],
    cognitiveLevel: '前运算阶段-观察探索',
    designRationale: '5岁幼儿好奇心更持久，开始有初步的分类意识',
  },
  {
    id: 'PS5-C02',
    ageGroup: 'preschool-5',
    text: '宝贝，你想搭一个很高很高的城堡，但是总是倒下来，你会怎么办？',
    scenario: '玩积木的时候',
    model: 'WILDER',
    dimension: '设计力+反思力',
    wilderMapping: ['D', 'R', 'I'],
    options: [
      { id: 'a', text: '想一想为什么倒，换一种方法搭', scores: { I: 3, R: 2, D: 2 } },
      { id: 'b', text: '一直试，直到搭成功为止', scores: { D: 3, R: 1 } },
      { id: 'c', text: '叫爸爸妈妈来帮忙', scores: { L: 2, D: 1 } },
      { id: 'd', text: '不搭城堡了，搭别的', scores: { D: 0, W: 1 } },
    ],
    cognitiveLevel: '前运算阶段-问题解决',
    designRationale: '测评5岁幼儿的坚持力和策略调整能力',
  },
  {
    id: 'PS5-C03',
    ageGroup: 'preschool-5',
    text: '宝贝，幼儿园里来了一个新小朋友，你会怎么做？',
    scenario: '新学期开学',
    model: 'WILDER',
    dimension: '连接力',
    wilderMapping: ['L', 'E'],
    options: [
      { id: 'a', text: '主动过去说"你好，我们一起玩吧"', scores: { L: 3, E: 2 } },
      { id: 'b', text: '给TA看自己的玩具', scores: { L: 2, E: 1 } },
      { id: 'c', text: '先观察一下，等TA来找我', scores: { L: 1, I: 1 } },
      { id: 'd', text: '继续和熟悉的朋友玩', scores: { L: 0, R: 1 } },
    ],
    cognitiveLevel: '前运算阶段-社交主动性',
    designRationale: '测评5岁幼儿的社交连接力和主动性',
  },
  {
    id: 'PS5-C04',
    ageGroup: 'preschool-5',
    text: '宝贝，你画了一幅画，想送给谁呀？',
    scenario: '美术课后',
    model: 'WILDER',
    dimension: '连接力+表达力',
    wilderMapping: ['L', 'E'],
    options: [
      { id: 'a', text: '送给妈妈/爸爸', scores: { L: 2, E: 1 } },
      { id: 'b', text: '送给好朋友', scores: { L: 3, E: 1 } },
      { id: 'c', text: '贴在墙上给大家看', scores: { E: 3, L: 1 } },
      { id: 'd', text: '自己留着', scores: { R: 1, D: 1 } },
    ],
    cognitiveLevel: '前运算阶段-社交表达',
    designRationale: '测评幼儿的社交连接倾向和表达意愿',
  },
  {
    id: 'PS5-C05',
    ageGroup: 'preschool-5',
    text: '宝贝，如果让你给小兔子起一个名字，你会叫它什么？',
    scenario: '看小兔子的图片',
    model: 'WILDER',
    dimension: '好奇心+表达力',
    wilderMapping: ['W', 'E'],
    options: [
      { id: 'a', text: '会想一个特别的名字，比如"蹦蹦"', scores: { W: 2, E: 3 } },
      { id: 'b', text: '就叫"小兔子"', scores: { E: 1, R: 1 } },
      { id: 'c', text: '问爸爸妈妈应该叫什么', scores: { L: 2, R: 1 } },
      { id: 'd', text: '不想起名字', scores: { W: 0, E: 0 } },
    ],
    cognitiveLevel: '前运算阶段-创造性表达',
    designRationale: '测评幼儿的创造性思维和表达意愿',
  },
  {
    id: 'PS5-C06',
    ageGroup: 'preschool-5',
    text: '宝贝，你的好朋友今天没来幼儿园，你会怎么想？',
    scenario: '早上到幼儿园',
    model: 'WILDER',
    dimension: '连接力+反思力',
    wilderMapping: ['L', 'R'],
    options: [
      { id: 'a', text: '有点想TA，想问问老师TA怎么了', scores: { L: 3, R: 1 } },
      { id: 'b', text: '和其他小朋友玩', scores: { L: 1, W: 1 } },
      { id: 'c', text: '自己一个人玩', scores: { L: 0, R: 1 } },
      { id: 'd', text: '没注意到', scores: { L: 0, I: 0 } },
    ],
    cognitiveLevel: '前运算阶段-共情发展',
    designRationale: '测评幼儿对社交关系的敏感度',
  },
  {
    id: 'PS5-C07',
    ageGroup: 'preschool-5',
    text: '宝贝，如果你有三颗糖，有两个好朋友在，你会怎么分？',
    scenario: '吃糖果的时候',
    model: 'WILDER',
    dimension: '连接力+设计力',
    wilderMapping: ['L', 'D'],
    options: [
      { id: 'a', text: '一人一颗，自己吃最后一颗', scores: { L: 3, R: 1 } },
      { id: 'b', text: '把糖掰开，三个人一起分', scores: { L: 2, D: 2 } },
      { id: 'c', text: '自己吃两颗，给好朋友一颗', scores: { L: 1, E: 1 } },
      { id: 'd', text: '自己都吃掉', scores: { L: 0, E: 0 } },
    ],
    cognitiveLevel: '前运算阶段-公平意识',
    designRationale: '测评幼儿的分享意识和公平概念发展',
  },
  {
    id: 'PS5-C08',
    ageGroup: 'preschool-5',
    text: '宝贝，你正在画画，妈妈/爸爸说"要吃饭了"，你会怎么做？',
    scenario: '玩得正开心',
    model: 'WILDER',
    dimension: '反思力+设计力',
    wilderMapping: ['R', 'D'],
    options: [
      { id: 'a', text: '说"好的"，放下画笔去吃饭', scores: { R: 3, L: 1 } },
      { id: 'b', text: '说"等一下，我画完这个就去"', scores: { D: 2, R: 2 } },
      { id: 'c', text: '把画收好，吃完饭继续画', scores: { D: 3, R: 1 } },
      { id: 'd', text: '不想吃饭，想继续画', scores: { D: 1, R: 0 } },
    ],
    cognitiveLevel: '前运算阶段-自我调节',
    designRationale: '测评幼儿的任务切换和自我调节能力',
  },
  {
    id: 'PS5-C09',
    ageGroup: 'preschool-5',
    text: '宝贝，如果玩具被小朋友抢走了，你会怎么做？',
    scenario: '在幼儿园玩游戏',
    model: 'WILDER',
    dimension: '连接力+表达力',
    wilderMapping: ['L', 'E'],
    options: [
      { id: 'a', text: '说"这是我先拿到的，请还给我"', scores: { E: 3, L: 1, R: 1 } },
      { id: 'b', text: '去告诉老师', scores: { L: 1, D: 1 } },
      { id: 'c', text: '哭起来', scores: { E: 1, R: 0 } },
      { id: 'd', text: '也去抢回来', scores: { L: 0, E: 0 } },
    ],
    cognitiveLevel: '前运算阶段-冲突解决',
    designRationale: '测评幼儿的社交冲突处理策略',
  },
  {
    id: 'PS5-C10',
    ageGroup: 'preschool-5',
    text: '宝贝，你看到地上有一只蚂蚁在搬东西，你会怎么做？',
    scenario: '在户外玩',
    model: 'WILDER',
    dimension: '好奇心+探究力',
    wilderMapping: ['W', 'I'],
    options: [
      { id: 'a', text: '蹲下来看很久，想知道它在搬什么', scores: { W: 3, I: 2 } },
      { id: 'b', text: '叫爸爸妈妈来看', scores: { L: 2, W: 1 } },
      { id: 'c', text: '用树枝轻轻碰碰它', scores: { I: 2, W: 1 } },
      { id: 'd', text: '走过去，不看了', scores: { W: 0, I: 0 } },
    ],
    cognitiveLevel: '前运算阶段-自然观察',
    designRationale: '测评幼儿对自然现象的好奇心和观察持久性',
  },
  {
    id: 'PS5-C11',
    ageGroup: 'preschool-5',
    text: '宝贝，如果让你选一本故事书，你想听什么样的？',
    scenario: '睡前故事时间',
    model: 'WILDER',
    dimension: '好奇心',
    wilderMapping: ['W', 'I'],
    options: [
      { id: 'a', text: '没听过的，想知道新故事', scores: { W: 3, I: 1 } },
      { id: 'b', text: '最喜欢的那个，再听一遍', scores: { L: 2, R: 1 } },
      { id: 'c', text: '有小动物的', scores: { W: 1, L: 1 } },
      { id: 'd', text: '随便，爸爸妈妈选就好', scores: { W: 0, L: 1 } },
    ],
    cognitiveLevel: '前运算阶段-兴趣偏好',
    designRationale: '测评幼儿的好奇心倾向和兴趣偏好',
  },
  {
    id: 'PS5-C12',
    ageGroup: 'preschool-5',
    text: '宝贝，你搭的积木被小朋友不小心碰倒了，你会怎么做？',
    scenario: '在幼儿园玩积木',
    model: 'WILDER',
    dimension: '连接力+反思力',
    wilderMapping: ['L', 'R'],
    options: [
      { id: 'a', text: '没关系，我们一起重新搭', scores: { L: 3, R: 2, D: 1 } },
      { id: 'b', text: '有点难过，但自己重新搭', scores: { R: 2, D: 2 } },
      { id: 'c', text: '让小朋友帮忙一起搭', scores: { L: 2, D: 1 } },
      { id: 'd', text: '哭起来或者生气', scores: { L: 0, R: 0 } },
    ],
    cognitiveLevel: '前运算阶段-情绪调节',
    designRationale: '测评幼儿的挫折应对和社交情绪调节',
  },
]

// ========== 判断题（4-5岁共用，更简单）==========
const JUDGMENT_PRESCHOOL: PreschoolJudgmentQuestion[] = [
  {
    id: 'PS-J01',
    ageGroup: 'preschool-4',
    text: '宝宝，你喜欢问"为什么"吗？',
    scenario: '平时说话的时候',
    model: 'WILDER',
    dimension: '好奇心',
    wilderMapping: ['W', 'I'],
    correctAnswer: true,
    scores: {
      yes: { W: 2, I: 1 },
      no: { W: 0, R: 1 },
    },
    cognitiveLevel: '前运算阶段-语言发展',
    designRationale: '通过提问行为测评好奇心发展',
  },
  {
    id: 'PS-J02',
    ageGroup: 'preschool-4',
    text: '宝宝，你喜欢自己试着穿衣服吗？',
    scenario: '早上起床',
    model: 'WILDER',
    dimension: '设计力',
    wilderMapping: ['D', 'R'],
    correctAnswer: true,
    scores: {
      yes: { D: 2, R: 1 },
      no: { D: 0, L: 1 },
    },
    cognitiveLevel: '前运算阶段-自理能力',
    designRationale: '测评幼儿的自主性和执行功能',
  },
  {
    id: 'PS-J03',
    ageGroup: 'preschool-4',
    text: '宝宝，你愿意把玩具借给好朋友玩吗？',
    scenario: '有小朋友来家里玩',
    model: 'WILDER',
    dimension: '连接力',
    wilderMapping: ['L', 'R'],
    correctAnswer: true,
    scores: {
      yes: { L: 2, R: 1 },
      no: { L: 0, E: 1 },
    },
    cognitiveLevel: '前运算阶段-分享行为',
    designRationale: '测评幼儿的分享意愿和社交连接力',
  },
  {
    id: 'PS-J04',
    ageGroup: 'preschool-5',
    text: '宝贝，你喜欢自己选今天穿什么衣服吗？',
    scenario: '早上起床',
    model: 'WILDER',
    dimension: '设计力',
    wilderMapping: ['D', 'E'],
    correctAnswer: true,
    scores: {
      yes: { D: 2, E: 1 },
      no: { D: 0, L: 1 },
    },
    cognitiveLevel: '前运算阶段-自主决策',
    designRationale: '测评幼儿的自主决策能力',
  },
  {
    id: 'PS-J05',
    ageGroup: 'preschool-5',
    text: '宝贝，你要画一棵大树，你会先想一想怎么画，还是直接拿起笔就画？',
    scenario: '画画或做手工',
    model: 'WILDER',
    dimension: '反思力',
    wilderMapping: ['R', 'D'],
    correctAnswer: true,
    scores: {
      yes: { R: 2, D: 1 },
      no: { W: 2, I: 1 },
    },
    cognitiveLevel: '前运算阶段-元认知萌芽',
    designRationale: '测评幼儿的元认知萌芽，双向正面评分避免社会期望偏差',
  },
  {
    id: 'PS-J06',
    ageGroup: 'preschool-5',
    text: '宝贝，你看到别的小朋友难过，会想去安慰TA吗？',
    scenario: '在幼儿园',
    model: 'WILDER',
    dimension: '连接力',
    wilderMapping: ['L', 'R'],
    correctAnswer: true,
    scores: {
      yes: { L: 2, R: 1 },
      no: { L: 0, I: 1 },
    },
    cognitiveLevel: '前运算阶段-共情发展',
    designRationale: '测评幼儿的共情能力发展',
  },
]

// ========== 4岁 MI 多元智能题目 ==========
const CHOICE_MI_PRESCHOOL_4: PreschoolChoiceQuestion[] = [
  {
    id: 'PS4-MI-C01',
    ageGroup: 'preschool-4',
    text: '宝宝，你最喜欢用什么方式讲一个故事给小朋友听呀？',
    scenario: '幼儿园讲故事时间',
    model: 'MI',
    dimension: '语言智能',
    wilderMapping: ['E', 'L'],
    options: [
      { id: 'a', text: '用嘴巴讲，还会用不同的声音', scores: { E: 3, L: 1 } },
      { id: 'b', text: '拿着书，指着图片讲', scores: { E: 2, I: 1 } },
      { id: 'c', text: '让妈妈先讲，我跟着说', scores: { L: 2, E: 1 } },
      { id: 'd', text: '不太想讲故事', scores: { E: 0, R: 1 } },
    ],
    cognitiveLevel: '前运算阶段-语言表达',
    designRationale: '通过讲故事偏好测评幼儿语言智能，4岁幼儿开始尝试简单叙事',
    visualHint: '小朋友讲故事的图片',
  },
  {
    id: 'PS4-MI-C02',
    ageGroup: 'preschool-4',
    text: '宝宝，妈妈买了5个苹果，你和弟弟/妹妹一人2个，还剩几个呀？',
    scenario: '吃水果的时候',
    model: 'MI',
    dimension: '逻辑数学智能',
    wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: '还剩1个！（想了想）', scores: { I: 3, D: 1 } },
      { id: 'b', text: '用手指头数一数', scores: { I: 2, D: 2 } },
      { id: 'c', text: '不知道，让妈妈算', scores: { L: 1, I: 0 } },
      { id: 'd', text: '我要吃更多！', scores: { I: 0, W: 1 } },
    ],
    cognitiveLevel: '前运算阶段-数量概念',
    designRationale: '4岁幼儿开始建立基本数量概念，通过生活情境测评逻辑数学智能',
  },
  {
    id: 'PS4-MI-C03',
    ageGroup: 'preschool-4',
    text: '宝宝，你最喜欢用什么东西搭房子呀？',
    scenario: '玩搭建游戏',
    model: 'MI',
    dimension: '空间智能',
    wilderMapping: ['D', 'W'],
    options: [
      { id: 'a', text: '积木，搭得高高的', scores: { D: 3, W: 1 } },
      { id: 'b', text: '用被子和枕头搭帐篷', scores: { D: 2, W: 2 } },
      { id: 'c', text: '用纸和胶水做一个', scores: { D: 2, I: 1 } },
      { id: 'd', text: '不太喜欢搭东西', scores: { D: 0, R: 1 } },
    ],
    cognitiveLevel: '前运算阶段-空间建构',
    designRationale: '通过搭建偏好测评幼儿空间智能，4岁幼儿喜欢简单的空间构建',
    visualHint: '积木搭成房子的图片',
  },
  {
    id: 'PS4-MI-C04',
    ageGroup: 'preschool-4',
    text: '宝宝，听到好听的音乐，你会怎么做呀？',
    scenario: '家里或幼儿园放音乐',
    model: 'MI',
    dimension: '音乐智能',
    wilderMapping: ['E', 'R'],
    options: [
      { id: 'a', text: '跟着音乐跳起来', scores: { E: 3, R: 1 } },
      { id: 'b', text: '跟着唱，虽然不太会词', scores: { E: 2, L: 1 } },
      { id: 'c', text: '安静地听，觉得很好听', scores: { R: 2, W: 1 } },
      { id: 'd', text: '不太注意音乐', scores: { E: 0, W: 0 } },
    ],
    cognitiveLevel: '前运算阶段-音乐感知',
    designRationale: '4岁幼儿对节奏和旋律有自然反应，通过音乐反应测评音乐智能',
  },
]

// ========== 5岁 MI 多元智能题目 ==========
const CHOICE_MI_PRESCHOOL_5: PreschoolChoiceQuestion[] = [
  {
    id: 'PS5-MI-C01',
    ageGroup: 'preschool-5',
    text: '宝贝，在操场上你最喜欢做什么运动呀？',
    scenario: '幼儿园体育活动时间',
    model: 'MI',
    dimension: '身体动觉智能',
    wilderMapping: ['D', 'I'],
    options: [
      { id: 'a', text: '跑步、跳远，使劲儿跑', scores: { D: 3, I: 1 } },
      { id: 'b', text: '踢球，和小朋友一起踢', scores: { D: 2, L: 2 } },
      { id: 'c', text: '爬来爬去，像小猴子', scores: { I: 2, D: 2 } },
      { id: 'd', text: '不太喜欢运动，想坐着玩', scores: { D: 0, R: 1 } },
    ],
    cognitiveLevel: '前运算阶段-身体协调',
    designRationale: '5岁幼儿大运动能力发展迅速，通过运动偏好测评身体动觉智能',
  },
  {
    id: 'PS5-MI-C02',
    ageGroup: 'preschool-5',
    text: '宝贝，有个小朋友哭了，你会怎么做呀？',
    scenario: '在幼儿园',
    model: 'MI',
    dimension: '人际智能',
    wilderMapping: ['L', 'E'],
    options: [
      { id: 'a', text: '走过去问TA怎么了', scores: { L: 3, E: 1 } },
      { id: 'b', text: '把自己的玩具给TA玩', scores: { L: 2, E: 2 } },
      { id: 'c', text: '去告诉老师', scores: { L: 1, D: 1 } },
      { id: 'd', text: '继续玩自己的', scores: { L: 0, R: 1 } },
    ],
    cognitiveLevel: '前运算阶段-社交共情',
    designRationale: '5岁幼儿共情能力增强，通过帮助他人场景测评人际智能',
  },
  {
    id: 'PS5-MI-C03',
    ageGroup: 'preschool-5',
    text: '宝贝，你一个人安安静静的时候，最喜欢做什么呀？',
    scenario: '自己在房间里',
    model: 'MI',
    dimension: '内省智能',
    wilderMapping: ['R', 'W'],
    options: [
      { id: 'a', text: '想想今天发生了什么开心的事', scores: { R: 3, W: 1 } },
      { id: 'b', text: '看看绘本书', scores: { W: 2, I: 1 } },
      { id: 'c', text: '自己跟玩偶说说话', scores: { E: 2, R: 1 } },
      { id: 'd', text: '不喜欢一个人待着', scores: { L: 1, R: 0 } },
    ],
    cognitiveLevel: '前运算阶段-自我觉察',
    designRationale: '5岁幼儿开始有初步自省能力，通过独处偏好测评内省智能',
  },
  {
    id: 'PS5-MI-C04',
    ageGroup: 'preschool-5',
    text: '宝贝，你在外面看到天上有一只鸟，你会想什么呀？',
    scenario: '户外散步',
    model: 'MI',
    dimension: '自然观察智能',
    wilderMapping: ['W', 'I'],
    options: [
      { id: 'a', text: '想知道它是什么鸟，要飞去哪里', scores: { W: 3, I: 2 } },
      { id: 'b', text: '看看它飞得多高', scores: { W: 2, I: 1 } },
      { id: 'c', text: '叫爸爸妈妈快看', scores: { L: 2, E: 1 } },
      { id: 'd', text: '看一眼就走了', scores: { W: 0, I: 0 } },
    ],
    cognitiveLevel: '前运算阶段-自然观察',
    designRationale: '5岁幼儿对自然界好奇心增强，通过动物观察测评自然观察智能',
  },
]

// ========== 4岁 EF 执行功能题目 ==========
const CHOICE_EF_PRESCHOOL_4: PreschoolChoiceQuestion[] = [
  {
    id: 'PS4-EF-C01',
    ageGroup: 'preschool-4',
    text: '宝宝，玩"木头人"游戏的时候，老师说"不许动"，你能做到吗？',
    scenario: '幼儿园做游戏',
    model: 'EF',
    dimension: '抑制控制',
    wilderMapping: ['R', 'D'],
    options: [
      { id: 'a', text: '能忍住不动，一直站好', scores: { R: 3, D: 2 } },
      { id: 'b', text: '大部分时间能忍住，偶尔动一下', scores: { R: 2, D: 1 } },
      { id: 'c', text: '很难忍住，总想动', scores: { R: 1, D: 0 } },
      { id: 'd', text: '不想玩这个游戏', scores: { R: 0, W: 1 } },
    ],
    cognitiveLevel: '前运算阶段-行为抑制',
    designRationale: '木头人游戏是测评4岁幼儿抑制控制的经典范式，直观反映行为控制能力',
    visualHint: '小朋友玩木头人的图片',
  },
  {
    id: 'PS4-EF-C02',
    ageGroup: 'preschool-4',
    text: '宝宝，你正在玩汽车，老师说"现在我们要画画了"，你会怎么办？',
    scenario: '幼儿园活动切换',
    model: 'EF',
    dimension: '认知灵活性',
    wilderMapping: ['W', 'L'],
    options: [
      { id: 'a', text: '把汽车放好，去画画', scores: { W: 2, L: 2 } },
      { id: 'b', text: '有点不想，但还是去了', scores: { R: 2, L: 1 } },
      { id: 'c', text: '想再玩一会儿汽车', scores: { D: 1, W: 1 } },
      { id: 'd', text: '不想画画，继续玩汽车', scores: { W: 0, L: 0 } },
    ],
    cognitiveLevel: '前运算阶段-活动转换',
    designRationale: '活动切换场景测评4岁幼儿的认知灵活性，反映任务转换能力',
  },
  {
    id: 'PS4-EF-C03',
    ageGroup: 'preschool-4',
    text: '宝宝，妈妈让你去拿"桌子上的红色杯子"，你能记住吗？',
    scenario: '在家里帮忙',
    model: 'EF',
    dimension: '工作记忆',
    wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: '能记住，拿对了！', scores: { I: 3, D: 1 } },
      { id: 'b', text: '有时候会忘记是什么颜色', scores: { I: 2, D: 1 } },
      { id: 'c', text: '走到一半忘了，回来问妈妈', scores: { I: 1, L: 1 } },
      { id: 'd', text: '不想去拿', scores: { I: 0, D: 0 } },
    ],
    cognitiveLevel: '前运算阶段-简单记忆',
    designRationale: '通过多特征指令测评4岁幼儿工作记忆，反映信息保持能力',
  },
]

// ========== 5岁 EF 执行功能题目 ==========
const CHOICE_EF_PRESCHOOL_5: PreschoolChoiceQuestion[] = [
  {
    id: 'PS5-EF-C01',
    ageGroup: 'preschool-5',
    text: '宝贝，排队等着玩滑梯，前面还有好几个小朋友，你会怎么做？',
    scenario: '在游乐场',
    model: 'EF',
    dimension: '抑制控制',
    wilderMapping: ['R', 'D'],
    options: [
      { id: 'a', text: '耐心等着，轮到我再玩', scores: { R: 3, D: 1 } },
      { id: 'b', text: '一边等一边和旁边的小朋友说话', scores: { R: 2, L: 2 } },
      { id: 'c', text: '有点着急，想插队', scores: { R: 1, D: 0 } },
      { id: 'd', text: '不想等了，去玩别的', scores: { R: 0, W: 1 } },
    ],
    cognitiveLevel: '前运算阶段-延迟满足',
    designRationale: '排队等待场景测评5岁幼儿的延迟满足和抑制控制能力',
  },
  {
    id: 'PS5-EF-C02',
    ageGroup: 'preschool-5',
    text: '宝贝，玩游戏的时候突然规则变了，你会怎么办？',
    scenario: '和小朋友玩游戏',
    model: 'EF',
    dimension: '认知灵活性',
    wilderMapping: ['W', 'L'],
    options: [
      { id: 'a', text: '听听新规则，按新的来', scores: { W: 3, L: 1 } },
      { id: 'b', text: '有点不习惯，但试试看', scores: { W: 2, R: 1 } },
      { id: 'c', text: '还是想按原来的玩', scores: { W: 1, D: 1 } },
      { id: 'd', text: '不想玩了', scores: { W: 0, L: 0 } },
    ],
    cognitiveLevel: '前运算阶段-规则灵活性',
    designRationale: '规则变化场景测评5岁幼儿认知灵活性，反映适应能力',
  },
  {
    id: 'PS5-EF-C03',
    ageGroup: 'preschool-5',
    text: '宝贝，妈妈让你先穿袜子，再穿鞋子，最后系鞋带，你能按顺序做吗？',
    scenario: '出门前',
    model: 'EF',
    dimension: '工作记忆',
    wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: '能！我记得住顺序', scores: { I: 3, D: 2 } },
      { id: 'b', text: '有时候会忘了先后顺序', scores: { I: 2, D: 1 } },
      { id: 'c', text: '需要妈妈再说一遍', scores: { I: 1, L: 1 } },
      { id: 'd', text: '让妈妈帮我穿', scores: { I: 0, D: 0 } },
    ],
    cognitiveLevel: '前运算阶段-序列记忆',
    designRationale: '多步骤指令测评5岁幼儿工作记忆的序列保持能力',
  },
]

// ========== 4岁 SEL 社会情感题目 ==========
const CHOICE_SEL_PRESCHOOL_4: PreschoolChoiceQuestion[] = [
  {
    id: 'PS4-SEL-C01',
    ageGroup: 'preschool-4',
    text: '宝宝，你现在心里是什么感觉呀？',
    scenario: '和爸爸妈妈聊天',
    model: 'SEL',
    dimension: '自我意识',
    wilderMapping: ['R'],
    options: [
      { id: 'a', text: '我知道！我现在很开心', scores: { R: 3 } },
      { id: 'b', text: '有时候能说出来', scores: { R: 2, E: 1 } },
      { id: 'c', text: '妈妈问的时候才知道', scores: { R: 1, L: 1 } },
      { id: 'd', text: '不太知道什么感觉', scores: { R: 0 } },
    ],
    cognitiveLevel: '前运算阶段-情绪识别',
    designRationale: '测评4岁幼儿的情绪自我觉察能力，这是SEL的基础能力',
  },
  {
    id: 'PS4-SEL-C02',
    ageGroup: 'preschool-4',
    text: '宝宝，你看到地上有别人掉的小零食，你会怎么做呀？',
    scenario: '在幼儿园',
    model: 'SEL',
    dimension: '负责任决策',
    wilderMapping: ['D', 'I'],
    options: [
      { id: 'a', text: '不拿，那不是我的', scores: { D: 3, I: 1 } },
      { id: 'b', text: '捡起来交给老师', scores: { D: 2, L: 2 } },
      { id: 'c', text: '问问旁边的小朋友是谁的', scores: { L: 2, I: 1 } },
      { id: 'd', text: '捡起来吃掉', scores: { D: 0, I: 0 } },
    ],
    cognitiveLevel: '前运算阶段-规则意识',
    designRationale: '通过道德判断场景测评4岁幼儿的负责任决策萌芽',
  },
]

// ========== 5岁 SEL 社会情感题目 ==========
const CHOICE_SEL_PRESCHOOL_5: PreschoolChoiceQuestion[] = [
  {
    id: 'PS5-SEL-C01',
    ageGroup: 'preschool-5',
    text: '宝贝，你生气的时候，会怎么让自己不那么生气呀？',
    scenario: '有不开心的事情发生',
    model: 'SEL',
    dimension: '自我管理',
    wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '深呼吸，让自己冷静下来', scores: { D: 3, R: 2 } },
      { id: 'b', text: '去找妈妈/爸爸抱抱', scores: { L: 2, R: 1 } },
      { id: 'c', text: '自己哭一会儿就好了', scores: { R: 2, E: 1 } },
      { id: 'd', text: '会发脾气，摔东西', scores: { D: 0, R: 0 } },
    ],
    cognitiveLevel: '前运算阶段-情绪调节',
    designRationale: '5岁幼儿开始学习情绪调节策略，测评自我管理能力',
  },
  {
    id: 'PS5-SEL-C02',
    ageGroup: 'preschool-5',
    text: '宝贝，小朋友摔倒了在哭，你看到了会怎么做呀？',
    scenario: '在操场玩的时候',
    model: 'SEL',
    dimension: '社会意识',
    wilderMapping: ['L'],
    options: [
      { id: 'a', text: '跑过去问TA疼不疼，帮TA站起来', scores: { L: 3 } },
      { id: 'b', text: '去告诉老师有人摔倒了', scores: { L: 2, D: 1 } },
      { id: 'c', text: '在旁边看着TA', scores: { L: 1, R: 1 } },
      { id: 'd', text: '继续玩，没注意到', scores: { L: 0, I: 0 } },
    ],
    cognitiveLevel: '前运算阶段-同理心',
    designRationale: '通过他人受伤场景测评5岁幼儿的同理心和社会意识',
  },
  {
    id: 'PS5-SEL-C03',
    ageGroup: 'preschool-5',
    text: '宝贝，你不小心把小朋友的积木弄倒了，你会怎么做呀？',
    scenario: '在幼儿园玩积木',
    model: 'SEL',
    dimension: '关系技能',
    wilderMapping: ['L', 'E'],
    options: [
      { id: 'a', text: '说"对不起"，帮TA重新搭', scores: { L: 3, E: 2 } },
      { id: 'b', text: '说"对不起"', scores: { L: 2, E: 1 } },
      { id: 'c', text: '假装不是我弄的', scores: { L: 0, E: 0 } },
      { id: 'd', text: '跑去玩别的', scores: { L: 0, R: 0 } },
    ],
    cognitiveLevel: '前运算阶段-道歉与修复',
    designRationale: '测评5岁幼儿的关系修复能力和社交技巧',
  },
]

// ========== MI/EF/SEL 判断题 ==========
const JUDGMENT_MI_PRESCHOOL: PreschoolJudgmentQuestion[] = [
  {
    id: 'PS-MI-J01',
    ageGroup: 'preschool-4',
    text: '宝宝，你喜欢唱歌吗？',
    scenario: '平时在家或幼儿园',
    model: 'MI',
    dimension: '音乐智能',
    wilderMapping: ['E', 'R'],
    correctAnswer: true,
    scores: {
      yes: { E: 2, R: 1 },
      no: { E: 0, W: 1 },
    },
    cognitiveLevel: '前运算阶段-音乐偏好',
    designRationale: '通过简单偏好测评幼儿的音乐智能倾向',
  },
  {
    id: 'PS-MI-J02',
    ageGroup: 'preschool-4',
    text: '宝宝，你喜欢看小动物和花花草草吗？',
    scenario: '在户外',
    model: 'MI',
    dimension: '自然观察智能',
    wilderMapping: ['W', 'I'],
    correctAnswer: true,
    scores: {
      yes: { W: 2, I: 1 },
      no: { W: 0, R: 1 },
    },
    cognitiveLevel: '前运算阶段-自然兴趣',
    designRationale: '测评4岁幼儿对自然界事物的兴趣和观察倾向',
  },
  {
    id: 'PS-MI-J03',
    ageGroup: 'preschool-5',
    text: '宝贝，你喜欢拼图游戏吗？',
    scenario: '玩玩具',
    model: 'MI',
    dimension: '空间智能',
    wilderMapping: ['D', 'W'],
    correctAnswer: true,
    scores: {
      yes: { D: 2, W: 1 },
      no: { D: 0, I: 1 },
    },
    cognitiveLevel: '前运算阶段-空间推理',
    designRationale: '拼图偏好反映5岁幼儿的空间智能发展',
  },
  {
    id: 'PS-MI-J04',
    ageGroup: 'preschool-5',
    text: '宝贝，你能自己把玩具分类放好吗？',
    scenario: '收拾玩具',
    model: 'MI',
    dimension: '逻辑数学智能',
    wilderMapping: ['I', 'D'],
    correctAnswer: true,
    scores: {
      yes: { I: 2, D: 1 },
      no: { I: 0, L: 1 },
    },
    cognitiveLevel: '前运算阶段-分类能力',
    designRationale: '分类是逻辑数学智能的基础，测评5岁幼儿的归类能力',
  },
]

const JUDGMENT_EF_PRESCHOOL: PreschoolJudgmentQuestion[] = [
  {
    id: 'PS-EF-J01',
    ageGroup: 'preschool-4',
    text: '宝宝，你能忍住不偷看别人的礼物吗？',
    scenario: '过生日的时候',
    model: 'EF',
    dimension: '抑制控制',
    wilderMapping: ['R', 'D'],
    correctAnswer: true,
    scores: {
      yes: { R: 2, D: 1 },
      no: { R: 0, W: 1 },
    },
    cognitiveLevel: '前运算阶段-诱惑抵抗',
    designRationale: '通过延迟满足场景测评4岁幼儿的抑制控制能力',
  },
  {
    id: 'PS-EF-J02',
    ageGroup: 'preschool-5',
    text: '宝贝，你能记住老师说的三件事情吗？比如"先洗手，再吃饭，最后喝水"',
    scenario: '在幼儿园',
    model: 'EF',
    dimension: '工作记忆',
    wilderMapping: ['I', 'D'],
    correctAnswer: true,
    scores: {
      yes: { I: 2, D: 1 },
      no: { I: 0, L: 1 },
    },
    cognitiveLevel: '前运算阶段-序列记忆',
    designRationale: '多步指令测评5岁幼儿的工作记忆容量',
  },
  {
    id: 'PS-EF-J03',
    ageGroup: 'preschool-5',
    text: '宝贝，如果正在画画，老师突然说"现在我们去唱歌"，你能很快转过来吗？',
    scenario: '幼儿园活动切换',
    model: 'EF',
    dimension: '认知灵活性',
    wilderMapping: ['W', 'L'],
    correctAnswer: true,
    scores: {
      yes: { W: 2, L: 1 },
      no: { W: 0, D: 1 },
    },
    cognitiveLevel: '前运算阶段-任务转换',
    designRationale: '任务切换场景测评5岁幼儿的认知灵活性',
  },
]

const JUDGMENT_SEL_PRESCHOOL: PreschoolJudgmentQuestion[] = [
  {
    id: 'PS-SEL-J01',
    ageGroup: 'preschool-4',
    text: '宝宝，你开心的时候会笑，难过的时候会哭，对吗？',
    scenario: '和妈妈聊天',
    model: 'SEL',
    dimension: '自我意识',
    wilderMapping: ['R'],
    correctAnswer: true,
    scores: {
      yes: { R: 2 },
      no: { R: 0, E: 1 },
    },
    cognitiveLevel: '前运算阶段-情绪识别',
    designRationale: '测评4岁幼儿的基本情绪觉察能力',
  },
  {
    id: 'PS-SEL-J02',
    ageGroup: 'preschool-4',
    text: '宝宝，你愿意和新来的小朋友一起玩吗？',
    scenario: '幼儿园来了新同学',
    model: 'SEL',
    dimension: '关系技能',
    wilderMapping: ['L', 'E'],
    correctAnswer: true,
    scores: {
      yes: { L: 2, E: 1 },
      no: { L: 0, R: 1 },
    },
    cognitiveLevel: '前运算阶段-社交开放性',
    designRationale: '测评4岁幼儿的社交开放性和关系建立意愿',
  },
  {
    id: 'PS-SEL-J03',
    ageGroup: 'preschool-5',
    text: '宝贝，做错了事情你会说"对不起"吗？',
    scenario: '和小朋友相处',
    model: 'SEL',
    dimension: '关系技能',
    wilderMapping: ['L', 'E'],
    correctAnswer: true,
    scores: {
      yes: { L: 2, E: 1 },
      no: { L: 0, R: 1 },
    },
    cognitiveLevel: '前运算阶段-道歉行为',
    designRationale: '测评5岁幼儿的社交修复能力',
  },
  {
    id: 'PS-SEL-J04',
    ageGroup: 'preschool-5',
    text: '宝贝，如果规定不能跑，你能做到慢慢走吗？',
    scenario: '在走廊上',
    model: 'SEL',
    dimension: '自我管理',
    wilderMapping: ['D', 'R'],
    correctAnswer: true,
    scores: {
      yes: { D: 2, R: 1 },
      no: { D: 0, W: 1 },
    },
    cognitiveLevel: '前运算阶段-规则遵守',
    designRationale: '测评5岁幼儿的自我管理和规则遵守能力',
  },
]

// ========== 导出函数 ==========
export function getPreschoolChoiceQuestions(age: number): PreschoolChoiceQuestion[] {
  if (age <= 3) {
    // 3岁: 仅基础WILDER + SEL(情感识别适合3岁)，不含EF/MI(认知要求偏高)
    return [...CHOICE_PRESCHOOL_4, ...CHOICE_SEL_PRESCHOOL_4]
  }
  if (age <= 4) {
    // 4岁: 基础 + MI + EF + SEL
    return [...CHOICE_PRESCHOOL_4, ...CHOICE_MI_PRESCHOOL_4, ...CHOICE_EF_PRESCHOOL_4, ...CHOICE_SEL_PRESCHOOL_4]
  }
  // 5岁: 仅5岁专属题(不再混入4岁题，避免稀释)
  return [...CHOICE_PRESCHOOL_5, ...CHOICE_MI_PRESCHOOL_5, ...CHOICE_EF_PRESCHOOL_5, ...CHOICE_SEL_PRESCHOOL_5]
}

export function getPreschoolJudgmentQuestions(age: number): PreschoolJudgmentQuestion[] {
  const all = [...JUDGMENT_PRESCHOOL, ...JUDGMENT_MI_PRESCHOOL, ...JUDGMENT_EF_PRESCHOOL, ...JUDGMENT_SEL_PRESCHOOL]
  if (age <= 4) {
    // 3-4岁: 仅返回基础难度判断题，排除5岁难度
    return all.filter(q => q.ageGroup === 'preschool-4')
  }
  return all // 5岁: 返回全部（判断题总量较少，保留完整题池确保评估覆盖度）
}

export function isPreschoolAge(age: number): boolean {
  return age >= 3 && age <= 5
}

// 导出所有题目（用于管理后台预览）
export function getAllPreschoolChoiceQuestions(): PreschoolChoiceQuestion[] {
  return [
    ...CHOICE_PRESCHOOL_4, ...CHOICE_PRESCHOOL_5,
    ...CHOICE_MI_PRESCHOOL_4, ...CHOICE_MI_PRESCHOOL_5,
    ...CHOICE_EF_PRESCHOOL_4, ...CHOICE_EF_PRESCHOOL_5,
    ...CHOICE_SEL_PRESCHOOL_4, ...CHOICE_SEL_PRESCHOOL_5,
  ]
}

export function getAllPreschoolJudgmentQuestions(): PreschoolJudgmentQuestion[] {
  return [...JUDGMENT_PRESCHOOL, ...JUDGMENT_MI_PRESCHOOL, ...JUDGMENT_EF_PRESCHOOL, ...JUDGMENT_SEL_PRESCHOOL]
}
