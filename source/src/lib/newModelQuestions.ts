// ===================================================================
// 新模型题目框架 v1.0
// CHC流体/晶体推理 + Grit坚毅力量表 + CASEL SEL社会情感学习
// 每模型每年龄组: 6选择题 + 3判断题 = 9题 × 4组 × 3模型 = 108题
// ===================================================================

import type { AdaptiveChoiceQuestion, AdaptiveJudgmentQuestion, AgeGroupKey } from './ageAdaptiveQuestions'

// ========== 辅助函数 ==========

function getAgeGroupKey(age: number): AgeGroupKey {
  if (age <= 9) return 'lower-primary'
  if (age <= 12) return 'upper-primary'
  if (age <= 15) return 'middle-school'
  return 'high-school'
}

// ========== CHC 流体/晶体推理题库 ==========
// Gf (流体推理): 模式识别、新颖问题解决、抽象推理
// Gc (晶体智力): 词汇知识、常识积累、文化学习

// ---------- 小学低年级 (6-9岁) ----------
const CHC_CHOICE_LOWER_PRIMARY: AdaptiveChoiceQuestion[] = [
  {
    id: 'CHC-LP-C01', ageGroup: 'lower-primary',
    text: '看看这组图形：⭐🔵⭐🔵⭐？接下来应该是什么？',
    scenario: '老师在黑板上画了一串图形，让你猜下一个',
    model: 'CHC', dimension: '流体推理-模式识别', wilderMapping: ['I', 'W'],
    options: [
      { id: 'a', text: '🔵，因为是交替出现的', scores: { Gf: 3, I: 2, W: 1 } },
      { id: 'b', text: '⭐，因为星星多', scores: { Gf: 1, I: 1 } },
      { id: 'c', text: '不确定，需要再看看', scores: { Gf: 0, R: 1 } },
      { id: 'd', text: '🔺，换个新的图形', scores: { Gf: 0, W: 2 } },
    ],
    cognitiveLevel: '具象操作期-模式识别',
    designRationale: '测试基础模式识别能力，6-9岁儿童应能识别简单交替规律',
  },
  {
    id: 'CHC-LP-C02', ageGroup: 'lower-primary',
    text: '猫有4条腿，鸟有2条腿。如果院子里有2只猫和3只鸟，一共有多少条腿？',
    scenario: '你在院子里看到一群小动物',
    model: 'CHC', dimension: '流体推理-逻辑计算', wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: '14条腿（4×2+2×3=14）', scores: { Gf: 3, I: 2, D: 1 } },
      { id: 'b', text: '先数猫的腿，再数鸟的腿，加在一起', scores: { Gf: 2, I: 1, D: 2 } },
      { id: 'c', text: '大概10几条吧', scores: { Gf: 1, I: 0 } },
      { id: 'd', text: '我不太会算，但可以一个一个数', scores: { Gf: 1, D: 1 } },
    ],
    cognitiveLevel: '具象操作期-简单推理',
    designRationale: '通过具象场景测试基础逻辑推理和计算能力',
  },
  {
    id: 'CHC-LP-C03', ageGroup: 'lower-primary',
    text: '"苹果"是一种水果，"胡萝卜"是一种蔬菜。那"香蕉"是什么？',
    scenario: '老师在上分类课，让你给食物分组',
    model: 'CHC', dimension: '晶体智力-分类知识', wilderMapping: ['E', 'R'],
    options: [
      { id: 'a', text: '水果，因为它是甜的、长在树上', scores: { Gc: 3, E: 1, R: 1 } },
      { id: 'b', text: '水果，因为妈妈说过', scores: { Gc: 2, L: 1 } },
      { id: 'c', text: '食物，但我不确定具体是哪一类', scores: { Gc: 1, R: 1 } },
      { id: 'd', text: '我不太清楚怎么分', scores: { Gc: 0, W: 1 } },
    ],
    cognitiveLevel: '具象操作期-知识分类',
    designRationale: '测试基础分类知识（晶体智力），区分记忆型与理解型回答',
  },
  {
    id: 'CHC-LP-C04', ageGroup: 'lower-primary',
    text: '小明比小红高，小红比小华高。谁最矮？',
    scenario: '三个小朋友站在一起比身高',
    model: 'CHC', dimension: '流体推理-传递推理', wilderMapping: ['I', 'R'],
    options: [
      { id: 'a', text: '小华最矮，因为他比小红矮，小红又比小明矮', scores: { Gf: 3, I: 2, R: 1 } },
      { id: 'b', text: '小华，但我需要再想想', scores: { Gf: 2, R: 2 } },
      { id: 'c', text: '不太确定，关系太复杂了', scores: { Gf: 1, R: 1 } },
      { id: 'd', text: '要把他们排成一排才能看出来', scores: { Gf: 1, D: 1 } },
    ],
    cognitiveLevel: '具象操作期-传递推理',
    designRationale: '经典传递推理任务，Piaget认为7-8岁开始掌握',
  },
  {
    id: 'CHC-LP-C05', ageGroup: 'lower-primary',
    text: '"高兴"的反义词是什么？',
    scenario: '语文课上老师问你反义词',
    model: 'CHC', dimension: '晶体智力-词汇知识', wilderMapping: ['E', 'L'],
    options: [
      { id: 'a', text: '伤心/难过', scores: { Gc: 3, E: 2 } },
      { id: 'b', text: '不高兴', scores: { Gc: 2, E: 1 } },
      { id: 'c', text: '生气', scores: { Gc: 1, E: 1 } },
      { id: 'd', text: '我不太知道什么是反义词', scores: { Gc: 0, R: 1 } },
    ],
    cognitiveLevel: '具象操作期-词汇运用',
    designRationale: '测试词汇知识深度和语义理解能力',
  },
  {
    id: 'CHC-LP-C06', ageGroup: 'lower-primary',
    text: '一个杯子装满水，如果把水倒进一个又矮又胖的碗里，水会变多、变少还是一样多？',
    scenario: '你在厨房帮妈妈做实验',
    model: 'CHC', dimension: '流体推理-守恒概念', wilderMapping: ['I', 'W'],
    options: [
      { id: 'a', text: '一样多，只是换了容器', scores: { Gf: 3, I: 2 } },
      { id: 'b', text: '看起来变少了，但其实一样多', scores: { Gf: 3, I: 1, R: 1 } },
      { id: 'c', text: '水会变少，因为碗更矮', scores: { Gf: 1 } },
      { id: 'd', text: '我不确定，要试试才知道', scores: { Gf: 1, W: 2, I: 1 } },
    ],
    cognitiveLevel: '具象操作期-液体守恒',
    designRationale: '经典Piaget守恒任务，反映流体推理发展水平',
  },
]

const CHC_JUDGMENT_LOWER_PRIMARY: AdaptiveJudgmentQuestion[] = [
  {
    id: 'CHC-LP-J01', ageGroup: 'lower-primary',
    text: '如果所有的鱼都会游泳，金鱼是一种鱼，那金鱼一定会游泳。',
    scenario: '逻辑推理小测试',
    model: 'CHC', dimension: '流体推理-演绎推理', wilderMapping: ['I', 'R'],
    correctAnswer: true,
    scores: { yes: { Gf: 2, I: 1 }, no: { Gf: 0, R: 1 } },
    cognitiveLevel: '具象操作期-基础演绎',
    designRationale: '基础三段论推理，测试演绎逻辑起点',
  },
  {
    id: 'CHC-LP-J02', ageGroup: 'lower-primary',
    text: '太阳从东边升起，从西边落下。',
    scenario: '自然常识判断',
    model: 'CHC', dimension: '晶体智力-常识', wilderMapping: ['E', 'W'],
    correctAnswer: true,
    scores: { yes: { Gc: 2, W: 1 }, no: { Gc: 0 } },
    cognitiveLevel: '具象操作期-生活常识',
    designRationale: '测试基础自然科学常识积累',
  },
  {
    id: 'CHC-LP-J03', ageGroup: 'lower-primary',
    text: '把一块橡皮泥捏成不同形状，橡皮泥的重量会改变。',
    scenario: '手工课上的思考题',
    model: 'CHC', dimension: '流体推理-物质守恒', wilderMapping: ['I', 'W'],
    correctAnswer: false,
    scores: { yes: { Gf: 0 }, no: { Gf: 2, I: 1, W: 1 } },
    cognitiveLevel: '具象操作期-质量守恒',
    designRationale: '守恒概念测试，形状变化不影响质量',
  },
]

// ---------- 小学高年级 (10-12岁) ----------
const CHC_CHOICE_UPPER_PRIMARY: AdaptiveChoiceQuestion[] = [
  {
    id: 'CHC-UP-C01', ageGroup: 'upper-primary',
    text: '数列 2, 4, 8, 16, ? 下一个数是多少？',
    scenario: '数学课上的规律发现',
    model: 'CHC', dimension: '流体推理-数列规律', wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: '32，每个数是前一个的2倍', scores: { Gf: 3, I: 2, D: 1 } },
      { id: 'b', text: '32，但我是一个个加出来的', scores: { Gf: 2, I: 1, D: 1 } },
      { id: 'c', text: '24，每次增加的越来越多', scores: { Gf: 1, I: 1 } },
      { id: 'd', text: '我需要更多时间来找规律', scores: { Gf: 1, R: 1, D: 1 } },
    ],
    cognitiveLevel: '早期形式运算-数列推理',
    designRationale: '指数增长模式识别，需要超越简单加法思维',
  },
  {
    id: 'CHC-UP-C02', ageGroup: 'upper-primary',
    text: '下面哪个词和其他三个不是同一类？猫、狗、鹦鹉、老虎',
    scenario: '分类思维训练',
    model: 'CHC', dimension: '晶体智力-概念分类', wilderMapping: ['E', 'R'],
    options: [
      { id: 'a', text: '鹦鹉，因为它是鸟类，其他都是哺乳动物', scores: { Gc: 3, E: 1, R: 1 } },
      { id: 'b', text: '老虎，因为它不能当宠物', scores: { Gc: 2, E: 1 } },
      { id: 'c', text: '猫，因为它最小', scores: { Gc: 1 } },
      { id: 'd', text: '有好几种分法，取决于分类标准', scores: { Gc: 2, Gf: 1, R: 2 } },
    ],
    cognitiveLevel: '早期形式运算-概念分类',
    designRationale: '多层次分类思维测试，区分表面特征与科学分类',
  },
  {
    id: 'CHC-UP-C03', ageGroup: 'upper-primary',
    text: '如果A>B，B>C，C>D，那么以下哪个一定正确？',
    scenario: '数学逻辑思考',
    model: 'CHC', dimension: '流体推理-传递推理', wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: 'A>D', scores: { Gf: 3, I: 2 } },
      { id: 'b', text: 'A是最大的', scores: { Gf: 2, I: 1 } },
      { id: 'c', text: 'A比C大2', scores: { Gf: 0, I: 1 } },
      { id: 'd', text: '需要知道具体数字才能判断', scores: { Gf: 1, R: 1 } },
    ],
    cognitiveLevel: '早期形式运算-抽象传递推理',
    designRationale: '从具象向抽象推理过渡，使用字母符号而非具体事物',
  },
  {
    id: 'CHC-UP-C04', ageGroup: 'upper-primary',
    text: '"持之以恒"这个成语是什么意思？',
    scenario: '语文课成语学习',
    model: 'CHC', dimension: '晶体智力-词汇深度', wilderMapping: ['E', 'R'],
    options: [
      { id: 'a', text: '做事情能坚持很长时间，不轻易放弃', scores: { Gc: 3, E: 2 } },
      { id: 'b', text: '一直拿着什么东西不放手', scores: { Gc: 1, E: 1 } },
      { id: 'c', text: '和"坚持"差不多的意思', scores: { Gc: 2, E: 1 } },
      { id: 'd', text: '我听过但不太确定具体意思', scores: { Gc: 1, R: 1 } },
    ],
    cognitiveLevel: '早期形式运算-抽象词汇理解',
    designRationale: '成语理解需要超越字面意义，反映晶体智力深度',
  },
  {
    id: 'CHC-UP-C05', ageGroup: 'upper-primary',
    text: '一个农夫有鸡和兔子共10只，数脚共有28只脚。有几只鸡几只兔？',
    scenario: '数学应用题',
    model: 'CHC', dimension: '流体推理-假设检验', wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: '6只鸡4只兔（6×2+4×4=28）', scores: { Gf: 3, I: 2, D: 1 } },
      { id: 'b', text: '可以假设都是鸡，多出来的脚就是兔子的', scores: { Gf: 3, I: 2, D: 2 } },
      { id: 'c', text: '我会一个个试，直到数字对', scores: { Gf: 2, D: 1 } },
      { id: 'd', text: '这题太复杂了，需要列方程', scores: { Gf: 1, D: 1, R: 1 } },
    ],
    cognitiveLevel: '早期形式运算-系统尝试',
    designRationale: '鸡兔同笼经典问题，区分直觉解法、策略解法和系统方法',
  },
  {
    id: 'CHC-UP-C06', ageGroup: 'upper-primary',
    text: '地球上最大的沙漠是什么？',
    scenario: '地理知识竞赛',
    model: 'CHC', dimension: '晶体智力-常识', wilderMapping: ['E', 'W'],
    options: [
      { id: 'a', text: '撒哈拉沙漠', scores: { Gc: 3, E: 1, W: 1 } },
      { id: 'b', text: '南极洲（从科学定义来说）', scores: { Gc: 3, Gf: 1, W: 2, I: 1 } },
      { id: 'c', text: '戈壁沙漠', scores: { Gc: 1, W: 1 } },
      { id: 'd', text: '我不太清楚，但很想了解', scores: { Gc: 0, W: 2 } },
    ],
    cognitiveLevel: '早期形式运算-知识广度',
    designRationale: '测试常识广度，b选项(南极)奖励突破性认知',
  },
]

const CHC_JUDGMENT_UPPER_PRIMARY: AdaptiveJudgmentQuestion[] = [
  {
    id: 'CHC-UP-J01', ageGroup: 'upper-primary',
    text: '如果下雨，地面就会湿。现在地面是湿的，所以一定是下过雨了。',
    scenario: '逻辑推理判断',
    model: 'CHC', dimension: '流体推理-逆向推理谬误', wilderMapping: ['I', 'R'],
    correctAnswer: false,
    scores: { yes: { Gf: 0 }, no: { Gf: 3, I: 2, R: 1 } },
    cognitiveLevel: '早期形式运算-逻辑谬误识别',
    designRationale: '经典"肯定后件"谬误，地面湿也可能是洒水等原因',
  },
  {
    id: 'CHC-UP-J02', ageGroup: 'upper-primary',
    text: '恐龙在大约6500万年前灭绝了。',
    scenario: '科学常识判断',
    model: 'CHC', dimension: '晶体智力-科学常识', wilderMapping: ['W', 'E'],
    correctAnswer: true,
    scores: { yes: { Gc: 2, W: 1 }, no: { Gc: 0 } },
    cognitiveLevel: '早期形式运算-科学知识',
    designRationale: '测试基础科学常识积累水平',
  },
  {
    id: 'CHC-UP-J03', ageGroup: 'upper-primary',
    text: '一个正方形的对角线把正方形分成了4个相同的三角形。',
    scenario: '几何直觉判断',
    model: 'CHC', dimension: '流体推理-空间推理', wilderMapping: ['I', 'D'],
    correctAnswer: true,
    scores: { yes: { Gf: 2, I: 1, D: 1 }, no: { Gf: 0 } },
    cognitiveLevel: '早期形式运算-空间推理',
    designRationale: '空间推理能力，两条对角线将正方形分为4个等腰直角三角形',
  },
]

// ---------- 初中 (13-15岁) ----------
const CHC_CHOICE_MIDDLE_SCHOOL: AdaptiveChoiceQuestion[] = [
  {
    id: 'CHC-MS-C01', ageGroup: 'middle-school',
    text: '在一个密封容器中加热水，水的沸点会怎样变化？',
    scenario: '物理实验思考',
    model: 'CHC', dimension: '流体推理-因果推理', wilderMapping: ['I', 'W'],
    options: [
      { id: 'a', text: '沸点升高，因为压强增大', scores: { Gf: 3, I: 2, Gc: 1 } },
      { id: 'b', text: '沸点不变，水还是100度', scores: { Gf: 0, Gc: 1 } },
      { id: 'c', text: '沸点降低，因为容器限制了', scores: { Gf: 1 } },
      { id: 'd', text: '需要考虑压强和温度的关系', scores: { Gf: 2, I: 2, R: 1 } },
    ],
    cognitiveLevel: '形式运算期-变量关系推理',
    designRationale: '需要理解压强-温度关系，区分死记硬背与因果推理',
  },
  {
    id: 'CHC-MS-C02', ageGroup: 'middle-school',
    text: '一段话中"这位科学家的实验如同点亮了一盏明灯"，作者想表达什么？',
    scenario: '语文阅读理解',
    model: 'CHC', dimension: '晶体智力-语境理解', wilderMapping: ['E', 'R'],
    options: [
      { id: 'a', text: '实验成果具有开创性和启发性', scores: { Gc: 3, E: 2, R: 1 } },
      { id: 'b', text: '实验室很亮', scores: { Gc: 0 } },
      { id: 'c', text: '科学家发明了灯', scores: { Gc: 0 } },
      { id: 'd', text: '这是比喻，说明实验带来了新的理解方向', scores: { Gc: 3, E: 1, R: 2 } },
    ],
    cognitiveLevel: '形式运算期-隐喻理解',
    designRationale: '测试超越字面意义的理解能力，隐喻处理需要较高晶体智力',
  },
  {
    id: 'CHC-MS-C03', ageGroup: 'middle-school',
    text: '甲、乙、丙三人中只有一人说了真话。甲说"乙说谎了"，乙说"丙说谎了"，丙说"甲和乙都说谎了"。谁说了真话？',
    scenario: '逻辑谜题',
    model: 'CHC', dimension: '流体推理-复杂逻辑', wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: '乙说了真话', scores: { Gf: 3, I: 2, D: 1 } },
      { id: 'b', text: '丙说了真话', scores: { Gf: 1, I: 1 } },
      { id: 'c', text: '甲说了真话', scores: { Gf: 1, I: 1 } },
      { id: 'd', text: '需要逐一假设来排除', scores: { Gf: 2, I: 2, D: 2 } },
    ],
    cognitiveLevel: '形式运算期-命题逻辑',
    designRationale: '经典逻辑谜题，需要假设-验证策略来系统推理',
  },
  {
    id: 'CHC-MS-C04', ageGroup: 'middle-school',
    text: '"民主"这个概念最核心的含义是什么？',
    scenario: '社会学概念讨论',
    model: 'CHC', dimension: '晶体智力-抽象概念', wilderMapping: ['E', 'R'],
    options: [
      { id: 'a', text: '人民有权参与公共决策', scores: { Gc: 3, E: 2, R: 1 } },
      { id: 'b', text: '少数服从多数', scores: { Gc: 2, E: 1 } },
      { id: 'c', text: '人人平等', scores: { Gc: 2, L: 1 } },
      { id: 'd', text: '投票选举领导人', scores: { Gc: 1, E: 1 } },
    ],
    cognitiveLevel: '形式运算期-抽象概念理解',
    designRationale: '测试对抽象社会概念的理解深度',
  },
  {
    id: 'CHC-MS-C05', ageGroup: 'middle-school',
    text: '一个班有40人参加考试，平均分是75分。去掉最高分95分和最低分35分后，剩余38人的平均分大约是多少？',
    scenario: '数学应用思考',
    model: 'CHC', dimension: '流体推理-估算推理', wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: '大约75.5分（总分不变太多，人数减少）', scores: { Gf: 3, I: 2, D: 1 } },
      { id: 'b', text: '还是75分左右', scores: { Gf: 2, I: 1 } },
      { id: 'c', text: '需要精确计算：(40×75-95-35)/38', scores: { Gf: 2, D: 2, I: 1 } },
      { id: 'd', text: '会高一些因为去掉了低分', scores: { Gf: 1, I: 1 } },
    ],
    cognitiveLevel: '形式运算期-定量推理',
    designRationale: '测试数量推理和估算能力，c选项表现方法论意识',
  },
  {
    id: 'CHC-MS-C06', ageGroup: 'middle-school',
    text: '光合作用的化学方程式中，原料是什么？',
    scenario: '生物学基础知识',
    model: 'CHC', dimension: '晶体智力-科学知识', wilderMapping: ['E', 'W'],
    options: [
      { id: 'a', text: '二氧化碳和水', scores: { Gc: 3, E: 1, W: 1 } },
      { id: 'b', text: '氧气和水', scores: { Gc: 1 } },
      { id: 'c', text: '阳光和二氧化碳', scores: { Gc: 2, W: 1 } },
      { id: 'd', text: '葡萄糖和氧气', scores: { Gc: 0, W: 1 } },
    ],
    cognitiveLevel: '形式运算期-科学概念',
    designRationale: '测试重要科学概念的精确理解',
  },
]

const CHC_JUDGMENT_MIDDLE_SCHOOL: AdaptiveJudgmentQuestion[] = [
  {
    id: 'CHC-MS-J01', ageGroup: 'middle-school',
    text: '两个偶数相加一定是偶数，两个奇数相加也一定是偶数。',
    scenario: '数学规律判断',
    model: 'CHC', dimension: '流体推理-数学推理', wilderMapping: ['I', 'R'],
    correctAnswer: true,
    scores: { yes: { Gf: 2, I: 1, R: 1 }, no: { Gf: 0 } },
    cognitiveLevel: '形式运算期-数学命题验证',
    designRationale: '需要理解奇偶性规律而非逐个验证',
  },
  {
    id: 'CHC-MS-J02', ageGroup: 'middle-school',
    text: '相关性等于因果性——两件事常常一起发生，就意味着一件事导致了另一件事。',
    scenario: '科学方法论思考',
    model: 'CHC', dimension: '流体推理-因果推理', wilderMapping: ['I', 'R'],
    correctAnswer: false,
    scores: { yes: { Gf: 0 }, no: { Gf: 3, I: 2, R: 1 } },
    cognitiveLevel: '形式运算期-科学方法论',
    designRationale: '区分相关与因果是科学思维核心，流体推理高阶标志',
  },
  {
    id: 'CHC-MS-J03', ageGroup: 'middle-school',
    text: '地球绕太阳公转一圈大约需要365天。',
    scenario: '天文常识判断',
    model: 'CHC', dimension: '晶体智力-科学常识', wilderMapping: ['W', 'E'],
    correctAnswer: true,
    scores: { yes: { Gc: 2, W: 1 }, no: { Gc: 0 } },
    cognitiveLevel: '形式运算期-天文知识',
    designRationale: '基础天文常识，为晶体智力提供参照数据点',
  },
]

// ---------- 高中 (16-18岁) ----------
const CHC_CHOICE_HIGH_SCHOOL: AdaptiveChoiceQuestion[] = [
  {
    id: 'CHC-HS-C01', ageGroup: 'high-school',
    text: '一个研究发现"冰淇淋销量与溺水事件正相关"。最合理的解释是什么？',
    scenario: '统计学与批判性思维',
    model: 'CHC', dimension: '流体推理-混淆变量识别', wilderMapping: ['I', 'R'],
    options: [
      { id: 'a', text: '存在混淆变量(气温)同时影响两者', scores: { Gf: 3, I: 2, R: 1 } },
      { id: 'b', text: '吃冰淇淋导致游泳从而增加溺水', scores: { Gf: 1, I: 1 } },
      { id: 'c', text: '可能只是巧合', scores: { Gf: 2, R: 1 } },
      { id: 'd', text: '需要进一步实验来确定因果方向', scores: { Gf: 2, I: 2, D: 1 } },
    ],
    cognitiveLevel: '后形式运算期-变量控制',
    designRationale: '经典统计学案例，测试对混淆变量的理解',
  },
  {
    id: 'CHC-HS-C02', ageGroup: 'high-school',
    text: '"每个云层都有银边（Every cloud has a silver lining）"这个谚语的深层含义是什么？',
    scenario: '英语文化与语言理解',
    model: 'CHC', dimension: '晶体智力-跨文化语义', wilderMapping: ['E', 'R'],
    options: [
      { id: 'a', text: '每个困难中都蕴含着积极的一面', scores: { Gc: 3, E: 2, R: 1 } },
      { id: 'b', text: '云层在阳光下会发光', scores: { Gc: 0, W: 1 } },
      { id: 'c', text: '要保持乐观的心态看待问题', scores: { Gc: 2, R: 1 } },
      { id: 'd', text: '是一种认知重评策略的文化表达', scores: { Gc: 3, Gf: 1, R: 2 } },
    ],
    cognitiveLevel: '后形式运算期-文化语义理解',
    designRationale: '跨文化谚语理解需要高晶体智力和抽象推理',
  },
  {
    id: 'CHC-HS-C03', ageGroup: 'high-school',
    text: '在一个由10个数组成的数列中，如果中位数是50，你能确定平均数吗？',
    scenario: '统计推理',
    model: 'CHC', dimension: '流体推理-统计推理', wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: '不能确定，中位数和平均数是不同的统计量', scores: { Gf: 3, I: 2 } },
      { id: 'b', text: '平均数也是50', scores: { Gf: 0 } },
      { id: 'c', text: '取决于数据的分布是否对称', scores: { Gf: 3, I: 2, R: 1 } },
      { id: 'd', text: '大概在50附近', scores: { Gf: 1, I: 1 } },
    ],
    cognitiveLevel: '后形式运算期-统计推理',
    designRationale: '区分中位数和平均数的概念，测试统计推理深度',
  },
  {
    id: 'CHC-HS-C04', ageGroup: 'high-school',
    text: '量子力学中的"测不准原理"核心表达了什么？',
    scenario: '科学概念理解',
    model: 'CHC', dimension: '晶体智力-高阶科学概念', wilderMapping: ['W', 'E'],
    options: [
      { id: 'a', text: '不能同时精确测量粒子的位置和动量', scores: { Gc: 3, W: 1, I: 1 } },
      { id: 'b', text: '测量仪器不够精确', scores: { Gc: 1 } },
      { id: 'c', text: '微观世界的本质不确定性', scores: { Gc: 3, W: 2, Gf: 1 } },
      { id: 'd', text: '我知道这是物理学的重要原理但具体不太清楚', scores: { Gc: 1, W: 1 } },
    ],
    cognitiveLevel: '后形式运算期-前沿科学概念',
    designRationale: '高阶科学概念理解，区分表面理解和深层理解',
  },
  {
    id: 'CHC-HS-C05', ageGroup: 'high-school',
    text: '给你一个黑箱，输入1输出2，输入2输出5，输入3输出10。输入4应该输出什么？',
    scenario: '函数推理',
    model: 'CHC', dimension: '流体推理-函数发现', wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: '17（规律是n²+1）', scores: { Gf: 3, I: 2, D: 1 } },
      { id: 'b', text: '15（每次增加的差递增）', scores: { Gf: 2, I: 1 } },
      { id: 'c', text: '需要尝试不同的函数来拟合', scores: { Gf: 2, I: 2, D: 2 } },
      { id: 'd', text: '不确定，三个数据点可能有多种规律', scores: { Gf: 2, R: 2, I: 1 } },
    ],
    cognitiveLevel: '后形式运算期-函数发现',
    designRationale: '测试模式发现和函数推导能力',
  },
  {
    id: 'CHC-HS-C06', ageGroup: 'high-school',
    text: '关于"启蒙运动"，以下哪个描述最准确？',
    scenario: '历史文化知识',
    model: 'CHC', dimension: '晶体智力-人文知识', wilderMapping: ['E', 'R'],
    options: [
      { id: 'a', text: '强调理性和科学的思想运动，推动了现代社会的形成', scores: { Gc: 3, E: 2, R: 1 } },
      { id: 'b', text: '文艺复兴的另一个名字', scores: { Gc: 1 } },
      { id: 'c', text: '一场工业革命', scores: { Gc: 0 } },
      { id: 'd', text: '以理性挑战权威和传统的思想解放运动', scores: { Gc: 3, E: 1, R: 2 } },
    ],
    cognitiveLevel: '后形式运算期-历史概念',
    designRationale: '测试历史文化知识的深度理解',
  },
]

const CHC_JUDGMENT_HIGH_SCHOOL: AdaptiveJudgmentQuestion[] = [
  {
    id: 'CHC-HS-J01', ageGroup: 'high-school',
    text: '一个论证如果前提为假，结论也一定为假。',
    scenario: '逻辑学基础',
    model: 'CHC', dimension: '流体推理-形式逻辑', wilderMapping: ['I', 'R'],
    correctAnswer: false,
    scores: { yes: { Gf: 0 }, no: { Gf: 3, I: 2, R: 1 } },
    cognitiveLevel: '后形式运算期-形式逻辑',
    designRationale: '前提假不代表结论假（可能碰巧为真），测试对论证结构的理解',
  },
  {
    id: 'CHC-HS-J02', ageGroup: 'high-school',
    text: 'DNA双螺旋结构是由沃森和克里克在1953年发现的。',
    scenario: '科学史知识',
    model: 'CHC', dimension: '晶体智力-科学史', wilderMapping: ['W', 'E'],
    correctAnswer: true,
    scores: { yes: { Gc: 2, W: 1 }, no: { Gc: 0 } },
    cognitiveLevel: '后形式运算期-科学史',
    designRationale: '重要科学里程碑知识',
  },
  {
    id: 'CHC-HS-J03', ageGroup: 'high-school',
    text: '在一个有效的演绎论证中，如果前提都为真，结论一定为真。',
    scenario: '逻辑推理',
    model: 'CHC', dimension: '流体推理-演绎逻辑', wilderMapping: ['I', 'R'],
    correctAnswer: true,
    scores: { yes: { Gf: 2, I: 1 }, no: { Gf: 0 } },
    cognitiveLevel: '后形式运算期-演绎有效性',
    designRationale: '理解演绎有效性是形式逻辑思维成熟的标志',
  },
]

// ========== Grit 坚毅力量表题库 ==========
// passion (兴趣一致性): 长期目标的稳定追求
// perseverance (努力坚持性): 面对困难时的坚持

// ---------- 小学低年级 (6-9岁) ----------
const GRIT_CHOICE_LOWER_PRIMARY: AdaptiveChoiceQuestion[] = [
  {
    id: 'GRIT-LP-C01', ageGroup: 'lower-primary',
    text: '你正在拼一个很难的拼图，已经拼了很久还没完成。你会怎么做？',
    scenario: '周末在家玩拼图',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '继续拼！我一定要把它拼完', scores: { grit_perseverance: 3, D: 2, R: 1 } },
      { id: 'b', text: '休息一下再继续', scores: { grit_perseverance: 2, R: 2, D: 1 } },
      { id: 'c', text: '找大人帮忙一起完成', scores: { grit_perseverance: 1, L: 2 } },
      { id: 'd', text: '换一个简单的玩', scores: { grit_perseverance: 0, W: 1 } },
    ],
    cognitiveLevel: '具象操作期-任务坚持',
    designRationale: '通过熟悉场景测试面对困难时的坚持倾向',
  },
  {
    id: 'GRIT-LP-C02', ageGroup: 'lower-primary',
    text: '你最喜欢的兴趣是什么？你已经学了多久？',
    scenario: '兴趣班分享时间',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['W', 'I'],
    options: [
      { id: 'a', text: '一个爱好坚持了很久，越来越喜欢', scores: { grit_passion: 3, W: 1, I: 2 } },
      { id: 'b', text: '有几个喜欢的，都在学', scores: { grit_passion: 1, W: 2 } },
      { id: 'c', text: '经常换新的兴趣', scores: { grit_passion: 0, W: 3 } },
      { id: 'd', text: '有一个喜欢的但有时候想换', scores: { grit_passion: 2, W: 1, R: 1 } },
    ],
    cognitiveLevel: '具象操作期-兴趣稳定性',
    designRationale: '测评兴趣的持续性和一致性',
  },
  {
    id: 'GRIT-LP-C03', ageGroup: 'lower-primary',
    text: '学骑自行车时摔了好几次，你会怎么想？',
    scenario: '在小区学骑自行车',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '摔几次没关系，多练就会了', scores: { grit_perseverance: 3, R: 1, D: 1 } },
      { id: 'b', text: '有点疼，但还是想学会', scores: { grit_perseverance: 2, R: 1 } },
      { id: 'c', text: '我可能不适合骑车', scores: { grit_perseverance: 0, R: 1 } },
      { id: 'd', text: '让爸妈扶着我慢慢学', scores: { grit_perseverance: 1, L: 2, D: 1 } },
    ],
    cognitiveLevel: '具象操作期-挫折应对',
    designRationale: '通过具象挫折场景测试坚持力与归因方式',
  },
  {
    id: 'GRIT-LP-C04', ageGroup: 'lower-primary',
    text: '你开始画一幅画，但画着画着觉得画得不好。你会怎么做？',
    scenario: '美术课自由创作',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '擦掉重画，直到自己满意', scores: { grit_perseverance: 3, D: 2 } },
      { id: 'b', text: '想想哪里不好，改一改继续画', scores: { grit_perseverance: 2, R: 2, D: 1 } },
      { id: 'c', text: '将就一下，画完就好', scores: { grit_perseverance: 1, D: 1 } },
      { id: 'd', text: '换一张纸重新开始画别的', scores: { grit_perseverance: 0, W: 2 } },
    ],
    cognitiveLevel: '具象操作期-完美主义vs坚持',
    designRationale: '区分放弃型与坚持型应对策略',
  },
  {
    id: 'GRIT-LP-C05', ageGroup: 'lower-primary',
    text: '好朋友说"我们去玩吧！"但你正在做一件还没完成的事情。你会怎么做？',
    scenario: '课间休息时间',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '先做完再去玩', scores: { grit_passion: 2, grit_perseverance: 2, D: 2 } },
      { id: 'b', text: '和朋友说等一下，做完很快的', scores: { grit_passion: 2, L: 1, D: 1 } },
      { id: 'c', text: '马上去玩，回来再做', scores: { grit_passion: 0, L: 2 } },
      { id: 'd', text: '看看这件事重要不重要再决定', scores: { grit_passion: 1, R: 2 } },
    ],
    cognitiveLevel: '具象操作期-延迟满足',
    designRationale: '测试延迟满足和目标坚持能力',
  },
  {
    id: 'GRIT-LP-C06', ageGroup: 'lower-primary',
    text: '你学了一首新歌，但有个地方总是唱错。你会怎么做？',
    scenario: '音乐课学新歌',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'I'],
    options: [
      { id: 'a', text: '反复练那个地方直到唱对', scores: { grit_perseverance: 3, D: 2, I: 1 } },
      { id: 'b', text: '先跳过，以后再练', scores: { grit_perseverance: 1, D: 1 } },
      { id: 'c', text: '让老师再教一次', scores: { grit_perseverance: 1, L: 2 } },
      { id: 'd', text: '差不多就行了，没人会注意', scores: { grit_perseverance: 0 } },
    ],
    cognitiveLevel: '具象操作期-刻意练习',
    designRationale: '测试面对技能困难时的练习坚持性',
  },
]

const GRIT_JUDGMENT_LOWER_PRIMARY: AdaptiveJudgmentQuestion[] = [
  {
    id: 'GRIT-LP-J01', ageGroup: 'lower-primary',
    text: '做一件很难的事情，失败了几次就应该放弃。',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'R'],
    correctAnswer: false,
    scores: { yes: { grit_perseverance: 0 }, no: { grit_perseverance: 2, R: 1, D: 1 } },
    cognitiveLevel: '具象操作期-坚持信念',
    designRationale: '直接测试对坚持的态度',
  },
  {
    id: 'GRIT-LP-J02', ageGroup: 'lower-primary',
    text: '找到一个自己真正喜欢的事情，比什么都试一试更重要。',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['W', 'I'],
    correctAnswer: true,
    scores: { yes: { grit_passion: 2, I: 1 }, no: { grit_passion: 0, W: 1 } },
    cognitiveLevel: '具象操作期-兴趣深度vs广度',
    designRationale: '测试对深度探索vs广度涉猎的态度',
  },
  {
    id: 'GRIT-LP-J03', ageGroup: 'lower-primary',
    text: '练习再多也没用，聪明的人不用练就能做好。',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['R', 'D'],
    correctAnswer: false,
    scores: { yes: { grit_perseverance: 0 }, no: { grit_perseverance: 2, R: 2 } },
    cognitiveLevel: '具象操作期-成长心态',
    designRationale: '区分固定心态与成长心态（与grit密切相关）',
  },
]

// ---------- 小学高年级 (10-12岁) ----------
const GRIT_CHOICE_UPPER_PRIMARY: AdaptiveChoiceQuestion[] = [
  {
    id: 'GRIT-UP-C01', ageGroup: 'upper-primary',
    text: '你参加一个比赛，第一轮就被淘汰了。之后你会怎么做？',
    scenario: '学校知识竞赛',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '分析失败原因，下次一定要赢', scores: { grit_perseverance: 3, R: 2, D: 1 } },
      { id: 'b', text: '有点失望，但继续准备下一次', scores: { grit_perseverance: 2, R: 1 } },
      { id: 'c', text: '我可能不适合参加比赛', scores: { grit_perseverance: 0, R: 1 } },
      { id: 'd', text: '换一个我更擅长的比赛', scores: { grit_perseverance: 1, W: 1 } },
    ],
    cognitiveLevel: '早期形式运算-挫折反应',
    designRationale: '测试面对竞争性失败时的坚持力和归因方式',
  },
  {
    id: 'GRIT-UP-C02', ageGroup: 'upper-primary',
    text: '你有一个长期目标（如学会一种乐器/运动），最能描述你的是？',
    scenario: '课外活动规划',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['W', 'D'],
    options: [
      { id: 'a', text: '我会制定计划并坚持每天练习', scores: { grit_passion: 3, D: 2, grit_perseverance: 1 } },
      { id: 'b', text: '我很喜欢但有时候会懒得练', scores: { grit_passion: 2, W: 1 } },
      { id: 'c', text: '我经常换目标，新的总是更有趣', scores: { grit_passion: 0, W: 2 } },
      { id: 'd', text: '我更喜欢享受过程而不是追求目标', scores: { grit_passion: 1, W: 2, R: 1 } },
    ],
    cognitiveLevel: '早期形式运算-目标持续性',
    designRationale: '直接测量长期目标的坚持性和稳定性',
  },
  {
    id: 'GRIT-UP-C03', ageGroup: 'upper-primary',
    text: '一道数学题你想了很久都做不出来，你会怎么做？',
    scenario: '做作业时遇到难题',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: '换不同方法继续尝试', scores: { grit_perseverance: 3, I: 2, D: 1 } },
      { id: 'b', text: '先做别的题，回头再想', scores: { grit_perseverance: 2, D: 2 } },
      { id: 'c', text: '查看答案或参考书', scores: { grit_perseverance: 1, I: 1 } },
      { id: 'd', text: '直接跳过', scores: { grit_perseverance: 0 } },
    ],
    cognitiveLevel: '早期形式运算-学业坚持',
    designRationale: '学业场景中的坚持力测试',
  },
  {
    id: 'GRIT-UP-C04', ageGroup: 'upper-primary',
    text: '你对某个兴趣爱好的热情通常持续多久？',
    scenario: '自我反思时间',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['W', 'R'],
    options: [
      { id: 'a', text: '一旦喜欢就会持续很长时间', scores: { grit_passion: 3, W: 1, R: 1 } },
      { id: 'b', text: '大概几个月，然后可能换新的', scores: { grit_passion: 1, W: 2 } },
      { id: 'c', text: '几周，我很容易对新事物感兴趣', scores: { grit_passion: 0, W: 3 } },
      { id: 'd', text: '取决于这个爱好有多有趣', scores: { grit_passion: 1, R: 1, W: 1 } },
    ],
    cognitiveLevel: '早期形式运算-自我觉察',
    designRationale: '直接测量兴趣持续时间，结合自我觉察',
  },
  {
    id: 'GRIT-UP-C05', ageGroup: 'upper-primary',
    text: '你设定了一个目标，但发现比预期难得多。你会？',
    scenario: '期末学习目标',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '调整方法但不放弃目标', scores: { grit_perseverance: 3, D: 2, R: 1 } },
      { id: 'b', text: '降低目标到可以达到的水平', scores: { grit_perseverance: 1, D: 1, R: 1 } },
      { id: 'c', text: '寻求帮助来达成原目标', scores: { grit_perseverance: 2, L: 2 } },
      { id: 'd', text: '换一个更现实的目标', scores: { grit_perseverance: 0, R: 1 } },
    ],
    cognitiveLevel: '早期形式运算-目标调适',
    designRationale: '测试目标面对障碍时的调整策略',
  },
  {
    id: 'GRIT-UP-C06', ageGroup: 'upper-primary',
    text: '成功最重要的因素是什么？',
    scenario: '班会讨论主题',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['R', 'D'],
    options: [
      { id: 'a', text: '持续的努力和不放弃', scores: { grit_perseverance: 2, grit_passion: 1, D: 1, R: 1 } },
      { id: 'b', text: '找到自己真正热爱的事', scores: { grit_passion: 3, W: 2 } },
      { id: 'c', text: '潜能和聪明', scores: { grit_perseverance: 0, grit_passion: 0 } },
      { id: 'd', text: '运气和机会', scores: { grit_perseverance: 0, grit_passion: 0 } },
    ],
    cognitiveLevel: '早期形式运算-成功观',
    designRationale: '通过成功归因测试grit相关信念',
  },
]

const GRIT_JUDGMENT_UPPER_PRIMARY: AdaptiveJudgmentQuestion[] = [
  {
    id: 'GRIT-UP-J01', ageGroup: 'upper-primary',
    text: '每天花一点时间练习，比偶尔花很长时间练习效果更好。',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'R'],
    correctAnswer: true,
    scores: { yes: { grit_perseverance: 2, D: 1 }, no: { grit_perseverance: 0 } },
    cognitiveLevel: '早期形式运算-刻意练习理念',
    designRationale: '测试对持续练习价值的理解',
  },
  {
    id: 'GRIT-UP-J02', ageGroup: 'upper-primary',
    text: '如果一件事很快就学会了，说明你在这方面有潜能。如果需要很久才能学会，说明不适合你。',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['R', 'W'],
    correctAnswer: false,
    scores: { yes: { grit_passion: 0 }, no: { grit_passion: 2, grit_perseverance: 1, R: 1 } },
    cognitiveLevel: '早期形式运算-学习速度与适合度',
    designRationale: '挑战"学得快=有潜能"的固定心态思维',
  },
  {
    id: 'GRIT-UP-J03', ageGroup: 'upper-primary',
    text: '遇到困难时先休息一下再回来继续，是一种聪明的坚持方式。',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'R'],
    correctAnswer: true,
    scores: { yes: { grit_perseverance: 2, R: 1, D: 1 }, no: { grit_perseverance: 1 } },
    cognitiveLevel: '早期形式运算-策略性坚持',
    designRationale: '区分盲目坚持与策略性坚持',
  },
]

// ---------- 初中 (13-15岁) ----------
const GRIT_CHOICE_MIDDLE_SCHOOL: AdaptiveChoiceQuestion[] = [
  {
    id: 'GRIT-MS-C01', ageGroup: 'middle-school',
    text: '你在学一项新技能已经半年了，进步变得很慢（进入瓶颈期）。你会怎么做？',
    scenario: '学习乐器/编程/运动',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '寻找新方法突破瓶颈，坚持下去', scores: { grit_perseverance: 3, D: 2, I: 1 } },
      { id: 'b', text: '理解瓶颈期是正常的，耐心等待突破', scores: { grit_perseverance: 3, R: 2 } },
      { id: 'c', text: '考虑是否该换个方向', scores: { grit_perseverance: 1, R: 1 } },
      { id: 'd', text: '减少练习频率，保持兴趣不要逼自己', scores: { grit_perseverance: 1, R: 1, W: 1 } },
    ],
    cognitiveLevel: '形式运算期-瓶颈应对',
    designRationale: '瓶颈期是grit最重要的测试场景',
  },
  {
    id: 'GRIT-MS-C02', ageGroup: 'middle-school',
    text: '如果你可以选择，你更愿意？',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['W', 'I'],
    options: [
      { id: 'a', text: '在一个领域深入钻研成为专家', scores: { grit_passion: 3, I: 2 } },
      { id: 'b', text: '在几个相关领域都有不错的能力', scores: { grit_passion: 2, W: 1, I: 1 } },
      { id: 'c', text: '广泛尝试各种不同的领域', scores: { grit_passion: 0, W: 3 } },
      { id: 'd', text: '先广泛尝试，找到最喜欢的再深入', scores: { grit_passion: 2, W: 1, R: 1 } },
    ],
    cognitiveLevel: '形式运算期-专注vs广度',
    designRationale: '直接测量深度专注vs广度探索倾向',
  },
  {
    id: 'GRIT-MS-C03', ageGroup: 'middle-school',
    text: '回顾过去一年，你在学业或兴趣上最大的成就是怎么取得的？',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '通过长期的持续努力和不断改进', scores: { grit_perseverance: 3, D: 2, R: 1 } },
      { id: 'b', text: '在关键时刻集中精力冲刺', scores: { grit_perseverance: 1, D: 1 } },
      { id: 'c', text: '有老师/家长的帮助和督促', scores: { grit_perseverance: 1, L: 2 } },
      { id: 'd', text: '运气好碰到了适合自己的', scores: { grit_perseverance: 0, W: 1 } },
    ],
    cognitiveLevel: '形式运算期-成就归因',
    designRationale: '通过归因方式间接测量grit水平',
  },
  {
    id: 'GRIT-MS-C04', ageGroup: 'middle-school',
    text: '面对一个需要几个月才能完成的大项目，你最常见的状态是？',
    scenario: '科学探究项目/自主学习计划',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '开始兴奋，中间坚持，最后有成就感', scores: { grit_passion: 3, grit_perseverance: 2, D: 1 } },
      { id: 'b', text: '开始兴奋，中间有时懈怠，但能完成', scores: { grit_passion: 2, grit_perseverance: 1, R: 1 } },
      { id: 'c', text: '开始兴奋，后来经常拖延', scores: { grit_passion: 1, grit_perseverance: 0 } },
      { id: 'd', text: '不喜欢太长的项目，更喜欢短期任务', scores: { grit_passion: 0, D: 1 } },
    ],
    cognitiveLevel: '形式运算期-项目坚持',
    designRationale: '测试在长期项目中的热情曲线',
  },
  {
    id: 'GRIT-MS-C05', ageGroup: 'middle-school',
    text: '当你在某个领域取得了一些成绩后，你更可能？',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['W', 'I'],
    options: [
      { id: 'a', text: '设定更高的目标继续深入', scores: { grit_passion: 3, I: 2, D: 1 } },
      { id: 'b', text: '保持现有水平，在旁边领域拓展', scores: { grit_passion: 2, W: 1 } },
      { id: 'c', text: '满足了，开始尝试新领域', scores: { grit_passion: 0, W: 2 } },
      { id: 'd', text: '分享经验帮助别人', scores: { grit_passion: 1, L: 2, E: 1 } },
    ],
    cognitiveLevel: '形式运算期-成就后行为',
    designRationale: '测试成就后的行为倾向——是深入还是转移',
  },
  {
    id: 'GRIT-MS-C06', ageGroup: 'middle-school',
    text: '同学们都说某个课外活动很无聊，但你觉得它对你的长期目标很重要。你会？',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '坚持参加，不受别人影响', scores: { grit_perseverance: 3, D: 2, R: 1 } },
      { id: 'b', text: '继续参加但内心有些动摇', scores: { grit_perseverance: 2, R: 1 } },
      { id: 'c', text: '大家都不去了那我也不去了', scores: { grit_perseverance: 0, L: 1 } },
      { id: 'd', text: '重新评估这个活动对我的价值', scores: { grit_perseverance: 1, R: 2 } },
    ],
    cognitiveLevel: '形式运算期-同伴压力',
    designRationale: '测试在社会压力下的目标坚持力',
  },
]

const GRIT_JUDGMENT_MIDDLE_SCHOOL: AdaptiveJudgmentQuestion[] = [
  {
    id: 'GRIT-MS-J01', ageGroup: 'middle-school',
    text: '比起潜能，努力是决定长期成就更重要的因素。',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['R', 'D'],
    correctAnswer: true,
    scores: { yes: { grit_perseverance: 2, R: 1 }, no: { grit_perseverance: 0 } },
    cognitiveLevel: '形式运算期-成就信念',
    designRationale: '直接测试对努力vs潜能的信念（Dweck growth mindset）',
  },
  {
    id: 'GRIT-MS-J02', ageGroup: 'middle-school',
    text: '频繁更换目标说明这个人善于探索新事物。',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['W', 'R'],
    correctAnswer: false,
    scores: { yes: { grit_passion: 0, W: 1 }, no: { grit_passion: 2, R: 1 } },
    cognitiveLevel: '形式运算期-目标稳定性',
    designRationale: '区分"善于探索"与"缺乏坚持"',
  },
  {
    id: 'GRIT-MS-J03', ageGroup: 'middle-school',
    text: '真正热爱一件事的人，即使没有外在奖励也会持续投入。',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['W', 'I'],
    correctAnswer: true,
    scores: { yes: { grit_passion: 2, W: 1 }, no: { grit_passion: 0 } },
    cognitiveLevel: '形式运算期-内在动机',
    designRationale: '测试对内在动机的理解',
  },
]

// ---------- 高中 (16-18岁) ----------
const GRIT_CHOICE_HIGH_SCHOOL: AdaptiveChoiceQuestion[] = [
  {
    id: 'GRIT-HS-C01', ageGroup: 'high-school',
    text: '你对人生未来方向的想法，最接近哪个描述？',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['W', 'D'],
    options: [
      { id: 'a', text: '我有一个清晰的长期方向，正在为之努力', scores: { grit_passion: 3, D: 2 } },
      { id: 'b', text: '我有大概方向，但还在探索具体路径', scores: { grit_passion: 2, W: 1, R: 1 } },
      { id: 'c', text: '我有几个感兴趣的方向，还在选择', scores: { grit_passion: 1, W: 2 } },
      { id: 'd', text: '我还不确定自己想做什么', scores: { grit_passion: 0, W: 1, R: 1 } },
    ],
    cognitiveLevel: '后形式运算期-人生规划',
    designRationale: '测量对长期人生方向的清晰度和承诺度',
  },
  {
    id: 'GRIT-HS-C02', ageGroup: 'high-school',
    text: '在高考/重要考试的备考中，你觉得最大的挑战是？',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '长期保持学习的节奏和热情', scores: { grit_perseverance: 2, grit_passion: 1, D: 1, R: 1 } },
      { id: 'b', text: '遇到瓶颈时不灰心', scores: { grit_perseverance: 3, R: 2 } },
      { id: 'c', text: '抵抗各种诱惑和干扰', scores: { grit_perseverance: 2, D: 2 } },
      { id: 'd', text: '找到适合自己的方法', scores: { grit_perseverance: 1, I: 1, R: 1 } },
    ],
    cognitiveLevel: '后形式运算期-备考坚持',
    designRationale: '通过自评挑战间接测量grit水平',
  },
  {
    id: 'GRIT-HS-C03', ageGroup: 'high-school',
    text: '你如何看待"一万小时定律"（成为专家需要一万小时刻意练习）？',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['R', 'I'],
    options: [
      { id: 'a', text: '基本认同，持续练习是成功的关键', scores: { grit_perseverance: 3, R: 1 } },
      { id: 'b', text: '方向对了，但质量比时间更重要', scores: { grit_perseverance: 2, R: 2, I: 1 } },
      { id: 'c', text: '潜能也很重要，不是所有人都能靠练习成功', scores: { grit_perseverance: 1, R: 1 } },
      { id: 'd', text: '这个说法过于简化了，需要很多条件配合', scores: { grit_perseverance: 1, R: 2, I: 1 } },
    ],
    cognitiveLevel: '后形式运算期-刻意练习理论',
    designRationale: '测试对Ericsson刻意练习理论的理解和认同度',
  },
  {
    id: 'GRIT-HS-C04', ageGroup: 'high-school',
    text: '你在过去两年中，是否有一个一直在坚持的项目或目标？',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['W', 'D'],
    options: [
      { id: 'a', text: '是的，而且还在持续投入', scores: { grit_passion: 3, D: 2, grit_perseverance: 1 } },
      { id: 'b', text: '有，但中间换过一次方向', scores: { grit_passion: 2, D: 1, R: 1 } },
      { id: 'c', text: '我的兴趣和目标变化比较大', scores: { grit_passion: 0, W: 2 } },
      { id: 'd', text: '想坚持但没找到值得长期投入的事', scores: { grit_passion: 1, W: 1, R: 1 } },
    ],
    cognitiveLevel: '后形式运算期-长期承诺',
    designRationale: '直接测量实际的长期承诺行为',
  },
  {
    id: 'GRIT-HS-C05', ageGroup: 'high-school',
    text: '当你的努力暂时看不到回报时，你通常会怎么想？',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['R', 'D'],
    options: [
      { id: 'a', text: '积累总会在某个时刻爆发，继续坚持', scores: { grit_perseverance: 3, R: 1 } },
      { id: 'b', text: '调整方法看看能否提高效率', scores: { grit_perseverance: 2, D: 2, I: 1 } },
      { id: 'c', text: '开始怀疑方向是否正确', scores: { grit_perseverance: 1, R: 2 } },
      { id: 'd', text: '如果太久没效果就会放弃', scores: { grit_perseverance: 0 } },
    ],
    cognitiveLevel: '后形式运算期-延迟回报忍耐',
    designRationale: '测试面对延迟回报时的心理韧性',
  },
  {
    id: 'GRIT-HS-C06', ageGroup: 'high-school',
    text: '你觉得"热情"和"坚持"之间的关系是？',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['W', 'R'],
    options: [
      { id: 'a', text: '热情驱动坚持，坚持深化热情，是一个正向循环', scores: { grit_passion: 3, grit_perseverance: 1, R: 2 } },
      { id: 'b', text: '有热情才能坚持，没热情很难持久', scores: { grit_passion: 2, W: 1 } },
      { id: 'c', text: '坚持更重要，热情可以慢慢培养', scores: { grit_perseverance: 2, grit_passion: 1, R: 1 } },
      { id: 'd', text: '两者是独立的，有的人有热情但不坚持', scores: { grit_passion: 1, R: 2 } },
    ],
    cognitiveLevel: '后形式运算期-概念整合',
    designRationale: '测试对grit两个维度关系的元认知理解',
  },
]

const GRIT_JUDGMENT_HIGH_SCHOOL: AdaptiveJudgmentQuestion[] = [
  {
    id: 'GRIT-HS-J01', ageGroup: 'high-school',
    text: '如果你发现自己对一件事不再有热情了，放弃是明智的选择。',
    model: 'Grit', dimension: '兴趣一致性', wilderMapping: ['R', 'W'],
    correctAnswer: false,
    scores: { yes: { grit_passion: 0, R: 1 }, no: { grit_passion: 2, R: 1 } },
    cognitiveLevel: '后形式运算期-热情管理',
    designRationale: '区分暂时的倦怠与真正的方向不对',
  },
  {
    id: 'GRIT-HS-J02', ageGroup: 'high-school',
    text: '能够接受短期的痛苦和不适来换取长期的成长，是成熟的表现。',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['D', 'R'],
    correctAnswer: true,
    scores: { yes: { grit_perseverance: 2, R: 1, D: 1 }, no: { grit_perseverance: 0 } },
    cognitiveLevel: '后形式运算期-延迟满足',
    designRationale: '测试对延迟满足和短期牺牲的认同',
  },
  {
    id: 'GRIT-HS-J03', ageGroup: 'high-school',
    text: '一个人的坚毅水平主要由性格决定，很难通过后天培养改变。',
    model: 'Grit', dimension: '努力坚持性', wilderMapping: ['R', 'D'],
    correctAnswer: false,
    scores: { yes: { grit_perseverance: 0 }, no: { grit_perseverance: 2, R: 2 } },
    cognitiveLevel: '后形式运算期-grit可塑性',
    designRationale: '测试对grit本身的成长心态',
  },
]

// ========== CASEL SEL 社会情感学习题库 ==========
// 五大能力: selfAwareness, selfManagement, socialAwareness, relationshipSkills, responsibleDecision

// ---------- 小学低年级 (6-9岁) ----------
const SEL_CHOICE_LOWER_PRIMARY: AdaptiveChoiceQuestion[] = [
  {
    id: 'SEL-LP-C01', ageGroup: 'lower-primary',
    text: '你今天感到不高兴了。你知道自己为什么不高兴吗？',
    scenario: '放学回家后的情绪觉察',
    model: 'SEL', dimension: '自我意识', wilderMapping: ['R'],
    options: [
      { id: 'a', text: '知道，因为和好朋友吵架了', scores: { sel_selfAwareness: 3, R: 2 } },
      { id: 'b', text: '大概知道，心里不舒服', scores: { sel_selfAwareness: 2, R: 1 } },
      { id: 'c', text: '不知道，就是不高兴', scores: { sel_selfAwareness: 1, R: 0 } },
      { id: 'd', text: '我其实没有不高兴', scores: { sel_selfAwareness: 0 } },
    ],
    cognitiveLevel: '具象操作期-情绪识别',
    designRationale: '测试基础情绪觉察和命名能力',
  },
  {
    id: 'SEL-LP-C02', ageGroup: 'lower-primary',
    text: '你很生气想发脾气，这时候你会怎么做？',
    scenario: '和同学发生矛盾',
    model: 'SEL', dimension: '自我管理', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '深呼吸，让自己先冷静下来', scores: { sel_selfManagement: 3, R: 1, D: 1 } },
      { id: 'b', text: '找老师或妈妈帮忙', scores: { sel_selfManagement: 2, L: 1 } },
      { id: 'c', text: '大声喊出来', scores: { sel_selfManagement: 0 } },
      { id: 'd', text: '一个人呆一会儿', scores: { sel_selfManagement: 2, R: 2 } },
    ],
    cognitiveLevel: '具象操作期-情绪调节',
    designRationale: '测试基础情绪调节策略',
  },
  {
    id: 'SEL-LP-C03', ageGroup: 'lower-primary',
    text: '好朋友摔倒了在哭，你会怎么做？',
    scenario: '操场上课间活动',
    model: 'SEL', dimension: '社会意识', wilderMapping: ['L', 'R'],
    options: [
      { id: 'a', text: '跑过去问他哪里疼，帮他起来', scores: { sel_socialAwareness: 3, L: 2 } },
      { id: 'b', text: '去叫老师来帮忙', scores: { sel_socialAwareness: 2, L: 1 } },
      { id: 'c', text: '在旁边等着，不知道怎么帮', scores: { sel_socialAwareness: 1 } },
      { id: 'd', text: '继续玩自己的，他会自己站起来', scores: { sel_socialAwareness: 0 } },
    ],
    cognitiveLevel: '具象操作期-共情行动',
    designRationale: '测试共情感受和利他行为',
  },
  {
    id: 'SEL-LP-C04', ageGroup: 'lower-primary',
    text: '小组活动中，你和另一个同学都想当组长。怎么办？',
    scenario: '课堂小组合作',
    model: 'SEL', dimension: '关系技能', wilderMapping: ['L', 'E'],
    options: [
      { id: 'a', text: '商量一下，轮流当或者分工', scores: { sel_relationshipSkills: 3, L: 2, E: 1 } },
      { id: 'b', text: '举手表决让同学们选', scores: { sel_relationshipSkills: 2, sel_responsibleDecision: 1, L: 1 } },
      { id: 'c', text: '让给他/她', scores: { sel_relationshipSkills: 1, L: 1 } },
      { id: 'd', text: '坚持自己要当', scores: { sel_relationshipSkills: 0, E: 1 } },
    ],
    cognitiveLevel: '具象操作期-冲突解决',
    designRationale: '测试基础冲突解决和协商能力',
  },
  {
    id: 'SEL-LP-C05', ageGroup: 'lower-primary',
    text: '你捡到了一支很漂亮的笔，不知道是谁的。你会？',
    scenario: '教室里发现失物',
    model: 'SEL', dimension: '负责任决策', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '交给老师，让老师帮忙找到失主', scores: { sel_responsibleDecision: 3, D: 1, L: 1 } },
      { id: 'b', text: '问问周围的同学是谁的', scores: { sel_responsibleDecision: 2, L: 2 } },
      { id: 'c', text: '先留着，等有人来找再还', scores: { sel_responsibleDecision: 1, R: 1 } },
      { id: 'd', text: '很漂亮，自己留下来', scores: { sel_responsibleDecision: 0 } },
    ],
    cognitiveLevel: '具象操作期-道德判断',
    designRationale: '通过道德困境测试负责任决策',
  },
  {
    id: 'SEL-LP-C06', ageGroup: 'lower-primary',
    text: '你觉得自己最擅长什么？你怎么知道的？',
    scenario: '班级分享时间',
    model: 'SEL', dimension: '自我意识', wilderMapping: ['R', 'E'],
    options: [
      { id: 'a', text: '我擅长XX，因为我做的时候感觉很开心，别人也说我做得好', scores: { sel_selfAwareness: 3, R: 2, E: 1 } },
      { id: 'b', text: '老师说我XX做得好', scores: { sel_selfAwareness: 2, L: 1 } },
      { id: 'c', text: '我什么都一般般', scores: { sel_selfAwareness: 1 } },
      { id: 'd', text: '我不知道自己擅长什么', scores: { sel_selfAwareness: 0, R: 0 } },
    ],
    cognitiveLevel: '具象操作期-自我评价',
    designRationale: '测试自我认知和自我评价能力',
  },
]

const SEL_JUDGMENT_LOWER_PRIMARY: AdaptiveJudgmentQuestion[] = [
  {
    id: 'SEL-LP-J01', ageGroup: 'lower-primary',
    text: '感到害怕的时候，告诉别人是不好意思的事情。',
    model: 'SEL', dimension: '自我意识', wilderMapping: ['R', 'L'],
    correctAnswer: false,
    scores: { yes: { sel_selfAwareness: 0 }, no: { sel_selfAwareness: 2, R: 1, L: 1 } },
    cognitiveLevel: '具象操作期-情绪表达',
    designRationale: '测试对情绪表达的开放态度',
  },
  {
    id: 'SEL-LP-J02', ageGroup: 'lower-primary',
    text: '如果别人和我想法不一样，说明别人是错的。',
    model: 'SEL', dimension: '社会意识', wilderMapping: ['L', 'R'],
    correctAnswer: false,
    scores: { yes: { sel_socialAwareness: 0 }, no: { sel_socialAwareness: 2, L: 1, R: 1 } },
    cognitiveLevel: '具象操作期-观点多元性',
    designRationale: '测试对多元观点的接纳度',
  },
  {
    id: 'SEL-LP-J03', ageGroup: 'lower-primary',
    text: '做决定之前，应该想一想这样做会不会伤害到别人。',
    model: 'SEL', dimension: '负责任决策', wilderMapping: ['D', 'R'],
    correctAnswer: true,
    scores: { yes: { sel_responsibleDecision: 2, R: 1 }, no: { sel_responsibleDecision: 0 } },
    cognitiveLevel: '具象操作期-后果预判',
    designRationale: '测试基础的后果考虑能力',
  },
]

// ---------- 小学高年级 (10-12岁) ----------
const SEL_CHOICE_UPPER_PRIMARY: AdaptiveChoiceQuestion[] = [
  {
    id: 'SEL-UP-C01', ageGroup: 'upper-primary',
    text: '考试考砸了，你通常会怎么想？',
    scenario: '期中考试成绩出来',
    model: 'SEL', dimension: '自我意识', wilderMapping: ['R'],
    options: [
      { id: 'a', text: '这次准备不够充分，下次改进学习方法', scores: { sel_selfAwareness: 3, R: 2, sel_selfManagement: 1 } },
      { id: 'b', text: '有点难过，但我知道一次考试不代表一切', scores: { sel_selfAwareness: 2, R: 1 } },
      { id: 'c', text: '我就是不聪明', scores: { sel_selfAwareness: 1 } },
      { id: 'd', text: '题出得太难了', scores: { sel_selfAwareness: 0 } },
    ],
    cognitiveLevel: '早期形式运算-归因分析',
    designRationale: '测试自我觉察和归因方式',
  },
  {
    id: 'SEL-UP-C02', ageGroup: 'upper-primary',
    text: '你有很多作业要做，还想去看电视。你会怎么安排？',
    scenario: '放学后的时间管理',
    model: 'SEL', dimension: '自我管理', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '先做完作业再看，给自己设个奖励', scores: { sel_selfManagement: 3, D: 2, R: 1 } },
      { id: 'b', text: '做一部分作业，休息看一会儿，再继续', scores: { sel_selfManagement: 2, D: 1 } },
      { id: 'c', text: '先看一会儿再做作业', scores: { sel_selfManagement: 1 } },
      { id: 'd', text: '看完电视再说', scores: { sel_selfManagement: 0 } },
    ],
    cognitiveLevel: '早期形式运算-时间管理',
    designRationale: '测试自我管理和延迟满足能力',
  },
  {
    id: 'SEL-UP-C03', ageGroup: 'upper-primary',
    text: '一个新转学来的同学看起来很孤单，你会怎么做？',
    scenario: '班级来了新同学',
    model: 'SEL', dimension: '社会意识', wilderMapping: ['L', 'E'],
    options: [
      { id: 'a', text: '主动过去认识他/她，邀请一起玩', scores: { sel_socialAwareness: 3, L: 2, E: 1 } },
      { id: 'b', text: '如果他/她看起来想交朋友，我会去聊聊', scores: { sel_socialAwareness: 2, L: 1 } },
      { id: 'c', text: '等他/她主动来找我', scores: { sel_socialAwareness: 1 } },
      { id: 'd', text: '我自己的朋友够了', scores: { sel_socialAwareness: 0 } },
    ],
    cognitiveLevel: '早期形式运算-社会觉察',
    designRationale: '测试对他人情感需求的觉察和回应',
  },
  {
    id: 'SEL-UP-C04', ageGroup: 'upper-primary',
    text: '和好朋友意见不一致时，你通常会？',
    scenario: '和朋友在讨论一个问题',
    model: 'SEL', dimension: '关系技能', wilderMapping: ['L', 'E'],
    options: [
      { id: 'a', text: '先听他/她说完，再表达我的想法', scores: { sel_relationshipSkills: 3, L: 2, E: 1, R: 1 } },
      { id: 'b', text: '各自说明理由，找到都能接受的方案', scores: { sel_relationshipSkills: 3, L: 1, E: 1, D: 1 } },
      { id: 'c', text: '避免争论，保持和谐', scores: { sel_relationshipSkills: 1, L: 1 } },
      { id: 'd', text: '坚持自己的观点直到说服对方', scores: { sel_relationshipSkills: 0, E: 2 } },
    ],
    cognitiveLevel: '早期形式运算-沟通协商',
    designRationale: '测试建设性沟通和冲突管理能力',
  },
  {
    id: 'SEL-UP-C05', ageGroup: 'upper-primary',
    text: '同学邀请你一起抄作业，你怎么决定？',
    scenario: '作业还没写完',
    model: 'SEL', dimension: '负责任决策', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '不抄，自己不会的可以请教老师', scores: { sel_responsibleDecision: 3, R: 1, I: 1 } },
      { id: 'b', text: '不抄，但我可以和同学一起讨论怎么做', scores: { sel_responsibleDecision: 3, L: 2 } },
      { id: 'c', text: '看看他的思路，自己重新写', scores: { sel_responsibleDecision: 2, I: 1 } },
      { id: 'd', text: '这次先抄了，下次自己做', scores: { sel_responsibleDecision: 0 } },
    ],
    cognitiveLevel: '早期形式运算-道德判断',
    designRationale: '测试面对同伴压力时的道德判断和决策能力',
  },
  {
    id: 'SEL-UP-C06', ageGroup: 'upper-primary',
    text: '你注意到一个同学这几天情绪很低落。你会？',
    scenario: '观察到同学的变化',
    model: 'SEL', dimension: '社会意识', wilderMapping: ['L', 'R'],
    options: [
      { id: 'a', text: '找个合适的时机，私下问问他怎么了', scores: { sel_socialAwareness: 3, L: 2, R: 1 } },
      { id: 'b', text: '多和他说话聊天，让他开心起来', scores: { sel_socialAwareness: 2, L: 2 } },
      { id: 'c', text: '告诉老师关注一下', scores: { sel_socialAwareness: 2, sel_responsibleDecision: 1 } },
      { id: 'd', text: '他自己的事，我管不了', scores: { sel_socialAwareness: 0 } },
    ],
    cognitiveLevel: '早期形式运算-情感觉察',
    designRationale: '测试对他人情绪变化的觉察和适当回应',
  },
]

const SEL_JUDGMENT_UPPER_PRIMARY: AdaptiveJudgmentQuestion[] = [
  {
    id: 'SEL-UP-J01', ageGroup: 'upper-primary',
    text: '能控制自己情绪的人，是因为他们不会生气或难过。',
    model: 'SEL', dimension: '自我管理', wilderMapping: ['R', 'D'],
    correctAnswer: false,
    scores: { yes: { sel_selfManagement: 0 }, no: { sel_selfManagement: 2, R: 1 } },
    cognitiveLevel: '早期形式运算-情绪管理认知',
    designRationale: '区分情绪压抑与情绪管理',
  },
  {
    id: 'SEL-UP-J02', ageGroup: 'upper-primary',
    text: '在做一个重要决定之前，应该考虑这个决定对别人的影响。',
    model: 'SEL', dimension: '负责任决策', wilderMapping: ['D', 'R'],
    correctAnswer: true,
    scores: { yes: { sel_responsibleDecision: 2, R: 1, L: 1 }, no: { sel_responsibleDecision: 0 } },
    cognitiveLevel: '早期形式运算-后果思维',
    designRationale: '测试决策过程中的后果考量和他人视角',
  },
  {
    id: 'SEL-UP-J03', ageGroup: 'upper-primary',
    text: '真正的好朋友应该什么事情都同意你的看法。',
    model: 'SEL', dimension: '关系技能', wilderMapping: ['L', 'R'],
    correctAnswer: false,
    scores: { yes: { sel_relationshipSkills: 0 }, no: { sel_relationshipSkills: 2, L: 1, R: 1 } },
    cognitiveLevel: '早期形式运算-友谊认知',
    designRationale: '测试对健康友谊的理解',
  },
]

// ---------- 初中 (13-15岁) ----------
const SEL_CHOICE_MIDDLE_SCHOOL: AdaptiveChoiceQuestion[] = [
  {
    id: 'SEL-MS-C01', ageGroup: 'middle-school',
    text: '你意识到自己对某个同学有偏见。你会怎么处理？',
    scenario: '自我觉察时刻',
    model: 'SEL', dimension: '自我意识', wilderMapping: ['R'],
    options: [
      { id: 'a', text: '反思偏见的来源，尝试更客观地了解对方', scores: { sel_selfAwareness: 3, R: 3 } },
      { id: 'b', text: '承认自己有偏见，但很难改变', scores: { sel_selfAwareness: 2, R: 1 } },
      { id: 'c', text: '每个人都有偏见，很正常', scores: { sel_selfAwareness: 1 } },
      { id: 'd', text: '我觉得自己的判断没什么问题', scores: { sel_selfAwareness: 0 } },
    ],
    cognitiveLevel: '形式运算期-自我觉察深度',
    designRationale: '测试高阶自我觉察——识别和反思自身偏见',
  },
  {
    id: 'SEL-MS-C02', ageGroup: 'middle-school',
    text: '考试前一天你感到非常焦虑，你会采用什么策略来应对？',
    scenario: '期末考试前夕',
    model: 'SEL', dimension: '自我管理', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '做一些放松活动（运动/音乐），然后有计划地复习重点', scores: { sel_selfManagement: 3, D: 2, R: 1 } },
      { id: 'b', text: '把焦虑转化为动力，抓紧时间复习', scores: { sel_selfManagement: 2, D: 1 } },
      { id: 'c', text: '和朋友聊天分散注意力', scores: { sel_selfManagement: 1, L: 1 } },
      { id: 'd', text: '焦虑到什么都做不了', scores: { sel_selfManagement: 0 } },
    ],
    cognitiveLevel: '形式运算期-压力管理',
    designRationale: '测试高阶情绪调节和压力管理策略',
  },
  {
    id: 'SEL-MS-C03', ageGroup: 'middle-school',
    text: '你发现班里有同学被排挤和欺负。你会？',
    scenario: '校园欺凌场景',
    model: 'SEL', dimension: '社会意识', wilderMapping: ['L', 'D'],
    options: [
      { id: 'a', text: '直接站出来制止，或者报告老师', scores: { sel_socialAwareness: 2, sel_responsibleDecision: 3, L: 1, D: 1 } },
      { id: 'b', text: '私下去关心被欺负的同学', scores: { sel_socialAwareness: 3, L: 2 } },
      { id: 'c', text: '觉得不对但不敢说', scores: { sel_socialAwareness: 2, sel_responsibleDecision: 1 } },
      { id: 'd', text: '不关我的事', scores: { sel_socialAwareness: 0, sel_responsibleDecision: 0 } },
    ],
    cognitiveLevel: '形式运算期-道德勇气',
    designRationale: '测试社会正义感和行动勇气',
  },
  {
    id: 'SEL-MS-C04', ageGroup: 'middle-school',
    text: '团队项目中，有个成员一直不配合工作。你会怎么处理？',
    scenario: '课堂分组项目',
    model: 'SEL', dimension: '关系技能', wilderMapping: ['L', 'E'],
    options: [
      { id: 'a', text: '和他沟通了解原因，找到他擅长的部分让他参与', scores: { sel_relationshipSkills: 3, L: 2, E: 1 } },
      { id: 'b', text: '明确分工和截止日期，让每个人负责', scores: { sel_relationshipSkills: 2, D: 2 } },
      { id: 'c', text: '自己多做一点来弥补', scores: { sel_relationshipSkills: 1, D: 1 } },
      { id: 'd', text: '告诉老师让老师处理', scores: { sel_relationshipSkills: 1, sel_responsibleDecision: 1 } },
    ],
    cognitiveLevel: '形式运算期-团队管理',
    designRationale: '测试在真实团队场景中的人际技能',
  },
  {
    id: 'SEL-MS-C05', ageGroup: 'middle-school',
    text: '你的好朋友做了一件你觉得不对的事情，你怎么处理？',
    scenario: '友谊与原则冲突',
    model: 'SEL', dimension: '负责任决策', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '私下和他/她坦诚地谈谈我的想法', scores: { sel_responsibleDecision: 3, L: 1, E: 1, R: 1 } },
      { id: 'b', text: '指出问题但不勉强他/她改变', scores: { sel_responsibleDecision: 2, R: 1 } },
      { id: 'c', text: '算了，朋友嘛不必太较真', scores: { sel_responsibleDecision: 1, L: 1 } },
      { id: 'd', text: '这是他/她的事，我管不着', scores: { sel_responsibleDecision: 0 } },
    ],
    cognitiveLevel: '形式运算期-原则vs关系',
    designRationale: '测试在友情与原则冲突时的决策能力',
  },
  {
    id: 'SEL-MS-C06', ageGroup: 'middle-school',
    text: '你发现自己在压力大的时候会对身边的人发脾气。你怎么看这件事？',
    scenario: '自我反思',
    model: 'SEL', dimension: '自我意识', wilderMapping: ['R'],
    options: [
      { id: 'a', text: '这是我的一个模式，我需要找到更好的压力释放方式', scores: { sel_selfAwareness: 3, sel_selfManagement: 1, R: 2 } },
      { id: 'b', text: '压力大的时候控制不住很正常', scores: { sel_selfAwareness: 1 } },
      { id: 'c', text: '每次发完脾气都很后悔，但下次还是会这样', scores: { sel_selfAwareness: 2, R: 1 } },
      { id: 'd', text: '他们也不应该惹我', scores: { sel_selfAwareness: 0 } },
    ],
    cognitiveLevel: '形式运算期-行为模式觉察',
    designRationale: '测试对自身行为模式的深度觉察',
  },
]

const SEL_JUDGMENT_MIDDLE_SCHOOL: AdaptiveJudgmentQuestion[] = [
  {
    id: 'SEL-MS-J01', ageGroup: 'middle-school',
    text: '一个人的情绪只会影响自己，不会影响周围的人。',
    model: 'SEL', dimension: '社会意识', wilderMapping: ['L', 'R'],
    correctAnswer: false,
    scores: { yes: { sel_socialAwareness: 0 }, no: { sel_socialAwareness: 2, L: 1, R: 1 } },
    cognitiveLevel: '形式运算期-情绪传染',
    designRationale: '测试对情绪影响他人的理解',
  },
  {
    id: 'SEL-MS-J02', ageGroup: 'middle-school',
    text: '在做决定时，同时考虑短期利益和长期后果是成熟的表现。',
    model: 'SEL', dimension: '负责任决策', wilderMapping: ['D', 'R'],
    correctAnswer: true,
    scores: { yes: { sel_responsibleDecision: 2, D: 1, R: 1 }, no: { sel_responsibleDecision: 0 } },
    cognitiveLevel: '形式运算期-决策成熟度',
    designRationale: '测试对决策复杂性的理解',
  },
  {
    id: 'SEL-MS-J03', ageGroup: 'middle-school',
    text: '有效的沟通不仅是说出自己的想法，更重要的是倾听对方。',
    model: 'SEL', dimension: '关系技能', wilderMapping: ['L', 'E'],
    correctAnswer: true,
    scores: { yes: { sel_relationshipSkills: 2, L: 1, E: 1 }, no: { sel_relationshipSkills: 0 } },
    cognitiveLevel: '形式运算期-沟通理念',
    designRationale: '测试对有效沟通的理解',
  },
]

// ---------- 高中 (16-18岁) ----------
const SEL_CHOICE_HIGH_SCHOOL: AdaptiveChoiceQuestion[] = [
  {
    id: 'SEL-HS-C01', ageGroup: 'high-school',
    text: '你觉得"自我意识"最重要的方面是？',
    scenario: '心理学选修课讨论',
    model: 'SEL', dimension: '自我意识', wilderMapping: ['R'],
    options: [
      { id: 'a', text: '理解自己的情绪、价值观和行为模式之间的关系', scores: { sel_selfAwareness: 3, R: 3 } },
      { id: 'b', text: '知道自己的优缺点', scores: { sel_selfAwareness: 2, R: 1 } },
      { id: 'c', text: '了解自己的兴趣和目标', scores: { sel_selfAwareness: 2, W: 1 } },
      { id: 'd', text: '知道别人怎么看我', scores: { sel_selfAwareness: 1, L: 1 } },
    ],
    cognitiveLevel: '后形式运算期-元自我意识',
    designRationale: '测试对自我意识概念本身的理解深度',
  },
  {
    id: 'SEL-HS-C02', ageGroup: 'high-school',
    text: '面对一个你确实做错的事情，最好的回应方式是？',
    scenario: '承担责任的时刻',
    model: 'SEL', dimension: '自我管理', wilderMapping: ['R', 'D'],
    options: [
      { id: 'a', text: '真诚道歉，说明会如何避免再犯，并付诸行动', scores: { sel_selfManagement: 3, sel_responsibleDecision: 2, R: 1, D: 1 } },
      { id: 'b', text: '承认错误并道歉', scores: { sel_selfManagement: 2, R: 1 } },
      { id: 'c', text: '解释当时的情况和原因', scores: { sel_selfManagement: 1 } },
      { id: 'd', text: '尽量减小影响就好了', scores: { sel_selfManagement: 0 } },
    ],
    cognitiveLevel: '后形式运算期-责任担当',
    designRationale: '测试承担责任和修复关系的综合能力',
  },
  {
    id: 'SEL-HS-C03', ageGroup: 'high-school',
    text: '你如何看待"换位思考"这件事？',
    scenario: '哲学/伦理讨论',
    model: 'SEL', dimension: '社会意识', wilderMapping: ['L', 'R'],
    options: [
      { id: 'a', text: '换位思考需要意识到不同人有不同的背景和经历，不能简单用自己的标准衡量', scores: { sel_socialAwareness: 3, R: 2, L: 1 } },
      { id: 'b', text: '想想如果我是对方会怎么感受', scores: { sel_socialAwareness: 2, L: 1 } },
      { id: 'c', text: '理论上重要但实际中很难做到', scores: { sel_socialAwareness: 1, R: 1 } },
      { id: 'd', text: '有时候没必要，每个人管好自己就行', scores: { sel_socialAwareness: 0 } },
    ],
    cognitiveLevel: '后形式运算期-视角采择深度',
    designRationale: '测试共情能力的深度——从简单角色取替到系统性视角采择',
  },
  {
    id: 'SEL-HS-C04', ageGroup: 'high-school',
    text: '在需要团队合作完成的重大任务中，你认为最关键的是？',
    scenario: '学生会活动策划',
    model: 'SEL', dimension: '关系技能', wilderMapping: ['L', 'E'],
    options: [
      { id: 'a', text: '建立信任和心理安全感，让每个人都敢表达', scores: { sel_relationshipSkills: 3, L: 2, E: 1 } },
      { id: 'b', text: '明确的分工和沟通机制', scores: { sel_relationshipSkills: 2, D: 2 } },
      { id: 'c', text: '有一个强有力的领导者', scores: { sel_relationshipSkills: 1, D: 1 } },
      { id: 'd', text: '每个人都足够能干', scores: { sel_relationshipSkills: 0 } },
    ],
    cognitiveLevel: '后形式运算期-团队领导力',
    designRationale: '测试对团队协作深层机制的理解',
  },
  {
    id: 'SEL-HS-C05', ageGroup: 'high-school',
    text: '面对一个涉及多方利益的复杂决定（如选科/升学），你的决策过程是？',
    scenario: '人生重要决策',
    model: 'SEL', dimension: '负责任决策', wilderMapping: ['D', 'R'],
    options: [
      { id: 'a', text: '收集信息、考虑各方利益、权衡长短期影响、与信任的人讨论后决定', scores: { sel_responsibleDecision: 3, D: 2, R: 1, L: 1 } },
      { id: 'b', text: '分析利弊后按自己内心的声音决定', scores: { sel_responsibleDecision: 2, R: 2 } },
      { id: 'c', text: '主要听家长和老师的建议', scores: { sel_responsibleDecision: 1, L: 1 } },
      { id: 'd', text: '跟着感觉走，想太多反而纠结', scores: { sel_responsibleDecision: 0 } },
    ],
    cognitiveLevel: '后形式运算期-系统决策',
    designRationale: '测试复杂决策中的系统性思维',
  },
  {
    id: 'SEL-HS-C06', ageGroup: 'high-school',
    text: '你如何理解"情绪智力"这个概念？',
    scenario: '心理学话题',
    model: 'SEL', dimension: '自我意识', wilderMapping: ['R', 'L'],
    options: [
      { id: 'a', text: '识别、理解和管理自己与他人情绪的综合能力', scores: { sel_selfAwareness: 3, R: 2, L: 1 } },
      { id: 'b', text: '控制自己不生气的能力', scores: { sel_selfAwareness: 1 } },
      { id: 'c', text: '善于读懂别人心思', scores: { sel_selfAwareness: 1, L: 1 } },
      { id: 'd', text: '在社交场合表现得体的能力', scores: { sel_selfAwareness: 1, L: 1, E: 1 } },
    ],
    cognitiveLevel: '后形式运算期-概念理解',
    designRationale: '测试对情绪智力概念的理解深度',
  },
]

const SEL_JUDGMENT_HIGH_SCHOOL: AdaptiveJudgmentQuestion[] = [
  {
    id: 'SEL-HS-J01', ageGroup: 'high-school',
    text: '一个领导者最重要的能力是专业技术能力，而不是人际交往能力。',
    model: 'SEL', dimension: '关系技能', wilderMapping: ['L', 'E'],
    correctAnswer: false,
    scores: { yes: { sel_relationshipSkills: 0 }, no: { sel_relationshipSkills: 2, L: 1, E: 1 } },
    cognitiveLevel: '后形式运算期-领导力认知',
    designRationale: '测试对领导力中人际因素重要性的理解',
  },
  {
    id: 'SEL-HS-J02', ageGroup: 'high-school',
    text: '在复杂的道德困境中，没有绝对的对错，重要的是思考和决策的过程。',
    model: 'SEL', dimension: '负责任决策', wilderMapping: ['R', 'D'],
    correctAnswer: true,
    scores: { yes: { sel_responsibleDecision: 2, R: 2 }, no: { sel_responsibleDecision: 0 } },
    cognitiveLevel: '后形式运算期-道德复杂性',
    designRationale: '测试对道德复杂性和过程正义的理解',
  },
  {
    id: 'SEL-HS-J03', ageGroup: 'high-school',
    text: '高自我意识的人更容易受到他人评价的影响。',
    model: 'SEL', dimension: '自我意识', wilderMapping: ['R'],
    correctAnswer: false,
    scores: { yes: { sel_selfAwareness: 0 }, no: { sel_selfAwareness: 2, R: 2 } },
    cognitiveLevel: '后形式运算期-自我意识悖论',
    designRationale: '真正的自我意识带来内在稳定性而非外在敏感',
  },
]

// ========== 按年龄分组查询函数 ==========

const ALL_CHC_CHOICES: Record<AgeGroupKey, AdaptiveChoiceQuestion[]> = {
  'preschool': [], // 学龄前暂不使用新模型题目
  'lower-primary': CHC_CHOICE_LOWER_PRIMARY,
  'upper-primary': CHC_CHOICE_UPPER_PRIMARY,
  'middle-school': CHC_CHOICE_MIDDLE_SCHOOL,
  'high-school': CHC_CHOICE_HIGH_SCHOOL,
}
const ALL_CHC_JUDGMENTS: Record<AgeGroupKey, AdaptiveJudgmentQuestion[]> = {
  'preschool': [], // 学龄前暂不使用新模型题目
  'lower-primary': CHC_JUDGMENT_LOWER_PRIMARY,
  'upper-primary': CHC_JUDGMENT_UPPER_PRIMARY,
  'middle-school': CHC_JUDGMENT_MIDDLE_SCHOOL,
  'high-school': CHC_JUDGMENT_HIGH_SCHOOL,
}
const ALL_GRIT_CHOICES: Record<AgeGroupKey, AdaptiveChoiceQuestion[]> = {
  'preschool': [], // 学龄前暂不使用新模型题目
  'lower-primary': GRIT_CHOICE_LOWER_PRIMARY,
  'upper-primary': GRIT_CHOICE_UPPER_PRIMARY,
  'middle-school': GRIT_CHOICE_MIDDLE_SCHOOL,
  'high-school': GRIT_CHOICE_HIGH_SCHOOL,
}
const ALL_GRIT_JUDGMENTS: Record<AgeGroupKey, AdaptiveJudgmentQuestion[]> = {
  'preschool': [], // 学龄前暂不使用新模型题目
  'lower-primary': GRIT_JUDGMENT_LOWER_PRIMARY,
  'upper-primary': GRIT_JUDGMENT_UPPER_PRIMARY,
  'middle-school': GRIT_JUDGMENT_MIDDLE_SCHOOL,
  'high-school': GRIT_JUDGMENT_HIGH_SCHOOL,
}
const ALL_SEL_CHOICES: Record<AgeGroupKey, AdaptiveChoiceQuestion[]> = {
  'preschool': [], // 学龄前暂不使用新模型题目
  'lower-primary': SEL_CHOICE_LOWER_PRIMARY,
  'upper-primary': SEL_CHOICE_UPPER_PRIMARY,
  'middle-school': SEL_CHOICE_MIDDLE_SCHOOL,
  'high-school': SEL_CHOICE_HIGH_SCHOOL,
}
const ALL_SEL_JUDGMENTS: Record<AgeGroupKey, AdaptiveJudgmentQuestion[]> = {
  'preschool': [], // 学龄前暂不使用新模型题目
  'lower-primary': SEL_JUDGMENT_LOWER_PRIMARY,
  'upper-primary': SEL_JUDGMENT_UPPER_PRIMARY,
  'middle-school': SEL_JUDGMENT_MIDDLE_SCHOOL,
  'high-school': SEL_JUDGMENT_HIGH_SCHOOL,
}

/** 获取指定年龄的所有新模型选择题 */
export function getNewModelChoiceQuestionsByAge(age: number): AdaptiveChoiceQuestion[] {
  const key = getAgeGroupKey(age)
  return [
    ...ALL_CHC_CHOICES[key],
    ...ALL_GRIT_CHOICES[key],
    ...ALL_SEL_CHOICES[key],
  ]
}

/** 获取指定年龄的所有新模型判断题 */
export function getNewModelJudgmentQuestionsByAge(age: number): AdaptiveJudgmentQuestion[] {
  const key = getAgeGroupKey(age)
  return [
    ...ALL_CHC_JUDGMENTS[key],
    ...ALL_GRIT_JUDGMENTS[key],
    ...ALL_SEL_JUDGMENTS[key],
  ]
}

/** 获取所有新模型选择题（不分年龄） */
export function getAllNewModelChoiceQuestions(): AdaptiveChoiceQuestion[] {
  const keys: AgeGroupKey[] = ['lower-primary', 'upper-primary', 'middle-school', 'high-school']
  return keys.flatMap(k => [
    ...ALL_CHC_CHOICES[k],
    ...ALL_GRIT_CHOICES[k],
    ...ALL_SEL_CHOICES[k],
  ])
}

/** 获取所有新模型判断题（不分年龄） */
export function getAllNewModelJudgmentQuestions(): AdaptiveJudgmentQuestion[] {
  const keys: AgeGroupKey[] = ['lower-primary', 'upper-primary', 'middle-school', 'high-school']
  return keys.flatMap(k => [
    ...ALL_CHC_JUDGMENTS[k],
    ...ALL_GRIT_JUDGMENTS[k],
    ...ALL_SEL_JUDGMENTS[k],
  ])
}