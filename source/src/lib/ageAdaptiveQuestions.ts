// ===================================================================
// 分年龄段差异化测评题库 v1.1
// 基于认知发展理论，为不同年龄段设计适龄测评题目
// 年龄分层：学龄前(4-5) / 小学低年级(6-9) / 小学高年级(10-12) / 初中(13-15) / 高中(16-18)
// v1.1: 新增学龄前阶段支持
// ===================================================================

export type AgeGroupKey = 'preschool' | 'lower-primary' | 'upper-primary' | 'middle-school' | 'high-school'

export interface AdaptiveChoiceQuestion {
  id: string
  ageGroup: AgeGroupKey
  text: string
  scenario?: string
  model: 'MI' | 'BigFive' | 'Cognitive' | 'WILDER' | 'EF' | 'CHC' | 'Grit' | 'SEL'
  dimension: string
  wilderMapping: string[]
  options: { id: string; text: string; scores: Record<string, number> }[]
  cognitiveLevel: string
  designRationale: string
}

export interface AdaptiveJudgmentQuestion {
  id: string
  ageGroup: AgeGroupKey
  text: string
  scenario?: string
  model: 'MI' | 'BigFive' | 'Cognitive' | 'WILDER' | 'EF' | 'CHC' | 'Grit' | 'SEL'
  dimension: string
  wilderMapping: string[]
  correctAnswer: boolean
  scores: { yes: Record<string, number>; no: Record<string, number> }
  cognitiveLevel: string
  designRationale: string
}

function getAgeGroupKey(age: number): AgeGroupKey {
  if (age <= 5) return 'preschool'
  if (age <= 9) return 'lower-primary'
  if (age <= 12) return 'upper-primary'
  if (age <= 15) return 'middle-school'
  return 'high-school'
}

// ========== 小学低年级(6-9岁) 选择题 ==========
// 设计原则：具象化情境、图文描述、简单选项、聚焦基础认知
const CHOICE_LOWER_PRIMARY: AdaptiveChoiceQuestion[] = [
  {
    id: 'LP-C01', ageGroup: 'lower-primary',
    text: '你在公园里看到一种从来没见过的虫子，你会怎么做？',
    scenario: '你和妈妈/爸爸在公园散步，发现草丛里有一只奇怪的虫子',
    model: 'WILDER', dimension: '好奇心vs谨慎', wilderMapping: ['W', 'I'],
    options: [
      { id: 'a', text: '蹲下来仔细看，想知道它叫什么', scores: { W: 3, I: 1 } },
      { id: 'b', text: '用树枝轻轻碰碰它，看它会怎样', scores: { W: 2, I: 2 } },
      { id: 'c', text: '拍一张照片，回家查一查', scores: { I: 3, D: 1 } },
      { id: 'd', text: '告诉妈妈/爸爸，让大人来看', scores: { L: 2, R: 1 } },
    ],
    cognitiveLevel: '具象操作期-观察与行动',
    designRationale: '6-9岁儿童以具象思维为主，通过熟悉的公园场景测评好奇心和探究力的初始倾向',
  },
  {
    id: 'LP-C02', ageGroup: 'lower-primary',
    text: '你做了一个手工作品，老师说可以改进一下，你会怎么想？',
    scenario: '美术课上，你用彩纸做了一个小动物，老师走过来说"这里可以再改改会更好"',
    model: 'BigFive', dimension: '开放性vs防御', wilderMapping: ['R', 'D'],
    options: [
      { id: 'a', text: '马上动手改，试好几种新方法', scores: { R: 2, D: 2, W: 1 } },
      { id: 'b', text: '跑去抱抱妈妈/爸爸，然后再回来改', scores: { L: 2, E: 1 } },
      { id: 'c', text: '问老师"哪里不好？为什么要改？"', scores: { I: 2, R: 1 } },
      { id: 'd', text: '觉得自己做的已经很好了，不想改', scores: { E: 2 } },
    ],
    cognitiveLevel: '具象操作期-反馈接受',
    designRationale: '测评低龄儿童对反馈的态度，区分成长型vs固定型心态的早期表现',
  },
  {
    id: 'LP-C03', ageGroup: 'lower-primary',
    text: '下课的时候，你最喜欢做什么？',
    scenario: '课间休息15分钟',
    model: 'MI', dimension: '多元智能偏好', wilderMapping: ['E', 'L', 'W'],
    options: [
      { id: 'a', text: '和好朋友一起玩游戏', scores: { L: 3, E: 1 } },
      { id: 'b', text: '自己看书或画画', scores: { W: 2, R: 1 } },
      { id: 'c', text: '跑去操场运动', scores: { E: 2, D: 1 } },
      { id: 'd', text: '找老师问问题或聊天', scores: { W: 2, I: 1, L: 1 } },
    ],
    cognitiveLevel: '具象操作期-自由选择',
    designRationale: '通过自由选择场景测评基础社交偏好和兴趣倾向',
  },
  {
    id: 'LP-C04', ageGroup: 'lower-primary',
    text: '你想给好朋友准备一个生日礼物，你会怎么做？',
    scenario: '好朋友的生日快到了',
    model: 'WILDER', dimension: '设计力+连接力', wilderMapping: ['D', 'L'],
    options: [
      { id: 'a', text: '画一幅画送给TA', scores: { E: 2, D: 1, L: 1 } },
      { id: 'b', text: '先想想TA最喜欢什么，再决定送什么', scores: { L: 3, R: 1 } },
      { id: 'c', text: '做一个手工，按照自己的计划一步步做', scores: { D: 3, I: 1 } },
      { id: 'd', text: '问妈妈/爸爸帮忙选一个', scores: { L: 1, R: 1 } },
    ],
    cognitiveLevel: '具象操作期-计划与社交',
    designRationale: '通过礼物选择测评设计力(规划)和连接力(共情)的基础水平',
  },
  {
    id: 'LP-C05', ageGroup: 'lower-primary',
    text: '科学课上，老师问"为什么天会下雨"，你会怎么做？',
    scenario: '老师提出了一个科学问题',
    model: 'Cognitive', dimension: '因果推理', wilderMapping: ['I', 'W'],
    options: [
      { id: 'a', text: '举手说自己的想法，哪怕不确定对不对', scores: { W: 2, E: 2 } },
      { id: 'b', text: '先想一想，等想清楚了再说', scores: { I: 2, R: 2 } },
      { id: 'c', text: '翻课本找答案', scores: { I: 2, D: 1 } },
      { id: 'd', text: '听其他同学怎么说', scores: { L: 2, R: 1 } },
    ],
    cognitiveLevel: '具象操作期-因果初步理解',
    designRationale: '测评低龄儿童面对科学问题时的思维策略偏好',
  },
  {
    id: 'LP-C06', ageGroup: 'lower-primary',
    text: '你和同桌因为一件小事吵架了，你会怎么做？',
    scenario: '下课后，同桌不小心碰倒了你的铅笔盒，你们吵了起来',
    model: 'WILDER', dimension: '连接力+反思力', wilderMapping: ['L', 'R'],
    options: [
      { id: 'a', text: '马上说对不起，主动和好', scores: { L: 3, E: 1 } },
      { id: 'b', text: '想一想是不是自己也有做得不对的地方', scores: { R: 3, L: 1 } },
      { id: 'c', text: '找老师来帮忙解决', scores: { L: 1, D: 1 } },
      { id: 'd', text: '先不理TA，等自己不生气了再说', scores: { R: 1, E: 1 } },
    ],
    cognitiveLevel: '具象操作期-社会情绪调节',
    designRationale: '通过日常冲突场景测评连接力(关系修复)和反思力(自我检视)的基础表现',
  },
  {
    id: 'LP-C07', ageGroup: 'lower-primary',
    text: '老师让你在全班同学面前讲一个故事，你的感觉是什么？',
    scenario: '语文课上，老师请你到讲台上讲故事',
    model: 'WILDER', dimension: '表达力', wilderMapping: ['E', 'L'],
    options: [
      { id: 'a', text: '很开心！我喜欢讲给大家听', scores: { E: 3, L: 1 } },
      { id: 'b', text: '有点紧张，但我会试试看', scores: { E: 1, R: 1 } },
      { id: 'c', text: '我会先想好怎么讲，再上台', scores: { D: 2, E: 1 } },
      { id: 'd', text: '不太想去，希望老师让别人讲', scores: { E: 0, L: 1 } },
    ],
    cognitiveLevel: '具象操作期-公开表达意愿',
    designRationale: '通过公开表达场景测评表达力倾向和公众沟通意愿',
  },
  {
    id: 'LP-C08', ageGroup: 'lower-primary',
    text: '你发现积木可以搭成很多不同的样子，你会怎么玩？',
    scenario: '自由活动时间，教室里有一盒积木',
    model: 'WILDER', dimension: '设计力+好奇心', wilderMapping: ['D', 'W'],
    options: [
      { id: 'a', text: '按照说明书上的步骤，一步一步搭', scores: { D: 2, I: 1 } },
      { id: 'b', text: '想一个自己想要的东西(房子、汽车)，然后开始搭', scores: { D: 3, W: 1 } },
      { id: 'c', text: '随便试试，看能搭出什么有趣的形状', scores: { W: 3, E: 1 } },
      { id: 'd', text: '和朋友一起商量，合作搭一个大的作品', scores: { L: 3, D: 1 } },
    ],
    cognitiveLevel: '具象操作期-创造性游戏',
    designRationale: '通过自由建构活动测评设计力(规划能力)和好奇心(探索意愿)的平衡',
  },
  {
    id: 'LP-C09', ageGroup: 'lower-primary',
    text: '家里来了一位你不认识的叔叔/阿姨，你会怎么做？',
    scenario: '周末在家，爸妈的朋友来做客',
    model: 'WILDER', dimension: '连接力', wilderMapping: ['L', 'E'],
    options: [
      { id: 'a', text: '主动打招呼，问叔叔/阿姨好', scores: { L: 2, E: 2 } },
      { id: 'b', text: '跟着爸妈一起和客人聊天', scores: { L: 3, E: 1 } },
      { id: 'c', text: '礼貌地打个招呼，然后做自己的事', scores: { L: 1, R: 1 } },
      { id: 'd', text: '有点害羞，躲在爸妈身后', scores: { L: 0, E: 0 } },
    ],
    cognitiveLevel: '具象操作期-社交应对',
    designRationale: '通过陌生人互动场景测评连接力(社交主动性)和表达力(沟通意愿)',
  },
  {
    id: 'LP-C10', ageGroup: 'lower-primary',
    text: '你在做一道数学题，试了好几次都做不对，你会怎么办？',
    scenario: '做作业时遇到一道难题',
    model: 'WILDER', dimension: '探究力+反思力', wilderMapping: ['I', 'R'],
    options: [
      { id: 'a', text: '从头到尾检查一遍，找出哪一步算错了', scores: { I: 2, R: 2 } },
      { id: 'b', text: '画个图或者摆小棒，换一种方式来理解题目', scores: { I: 3, W: 1 } },
      { id: 'c', text: '先做别的题，等会儿再回来做这道', scores: { D: 2, R: 1 } },
      { id: 'd', text: '问爸妈或老师怎么做', scores: { L: 2, I: 1 } },
    ],
    cognitiveLevel: '具象操作期-问题解决策略',
    designRationale: '通过学习挫折场景测评探究力(多种尝试)和反思力(检查错误)的萌芽',
  },
]

// ========== 小学高年级(10-12岁) 选择题 ==========
// 设计原则：半抽象情境、多步骤思考、引入假设-验证
const CHOICE_UPPER_PRIMARY: AdaptiveChoiceQuestion[] = [
  {
    id: 'UP-C01', ageGroup: 'upper-primary',
    text: '学校科学节要做一个实验项目，你会选择怎样的主题？',
    scenario: '科学节报名，每个人要选一个实验主题来展示',
    model: 'WILDER', dimension: '好奇心+探究力', wilderMapping: ['W', 'I', 'D'],
    options: [
      { id: 'a', text: '选一个从来没人做过的、我自己特别好奇的主题', scores: { W: 3, I: 1 } },
      { id: 'b', text: '选一个能做严格对照实验、能得到明确结论的主题', scores: { I: 3, D: 1 } },
      { id: 'c', text: '选一个能做出炫酷展示效果的主题', scores: { E: 2, D: 2 } },
      { id: 'd', text: '和同学商量，选一个可以合作完成的主题', scores: { L: 3, D: 1 } },
    ],
    cognitiveLevel: '形式运算初期-主题选择',
    designRationale: '10-12岁开始抽象思维，通过实验主题选择测评思维偏好',
  },
  {
    id: 'UP-C02', ageGroup: 'upper-primary',
    text: '你读了一篇文章说"吃巧克力能提高考试成绩"，你怎么想？',
    scenario: '在网上看到一篇科普文章',
    model: 'Cognitive', dimension: '批判性思维', wilderMapping: ['I', 'R'],
    options: [
      { id: 'a', text: '先看看文章有没有写实验是怎么做的', scores: { I: 3, R: 1 } },
      { id: 'b', text: '太好了，以后考试前多吃巧克力', scores: { W: 1 } },
      { id: 'c', text: '问老师或爸妈这个说法对不对', scores: { L: 2, R: 1 } },
      { id: 'd', text: '自己试试看，考试前吃和不吃对比一下', scores: { I: 2, W: 2 } },
    ],
    cognitiveLevel: '形式运算初期-证据评估',
    designRationale: '测评信息辨别能力和求证意识的发展水平',
  },
  {
    id: 'UP-C03', ageGroup: 'upper-primary',
    text: '班级要排一个节目，大家意见不一致，你会怎么做？',
    scenario: '元旦晚会，你们班要准备一个节目，有人想唱歌，有人想演话剧',
    model: 'BigFive', dimension: '协作与领导', wilderMapping: ['L', 'E', 'D'],
    options: [
      { id: 'a', text: '提议先投票，按多数人的意见来', scores: { D: 2, L: 1 } },
      { id: 'b', text: '想办法把两种想法结合起来', scores: { L: 3, D: 1, W: 1 } },
      { id: 'c', text: '主动站出来组织大家讨论', scores: { E: 2, L: 2 } },
      { id: 'd', text: '把自己的想法写下来，发到班级群里', scores: { E: 2, R: 1, D: 1 } },
    ],
    cognitiveLevel: '形式运算初期-社会协调',
    designRationale: '通过团队冲突场景测评社交策略和领导力倾向',
  },
  {
    id: 'UP-C04', ageGroup: 'upper-primary',
    text: '老师让你规划一个小组研究性学习项目，你会先做什么？',
    scenario: '下周五要交一个小组研究报告',
    model: 'WILDER', dimension: '设计力+反思力', wilderMapping: ['D', 'R', 'I'],
    options: [
      { id: 'a', text: '先写一个计划：时间线、分工、每天做什么', scores: { D: 3, R: 1 } },
      { id: 'b', text: '先查资料，了解清楚再做计划', scores: { I: 2, W: 2 } },
      { id: 'c', text: '先和组员讨论，让大家各选擅长的部分', scores: { L: 3, D: 1 } },
      { id: 'd', text: '先看看往年优秀的报告长什么样', scores: { R: 2, I: 1, D: 1 } },
    ],
    cognitiveLevel: '形式运算初期-项目规划',
    designRationale: '通过项目管理场景测评设计力（规划）的发展水平',
  },
  {
    id: 'UP-C05', ageGroup: 'upper-primary',
    text: '数学考试考砸了，你通常会怎么反应？',
    scenario: '平时数学成绩不错，但这次考试比预期差很多',
    model: 'BigFive', dimension: '情绪调节与归因', wilderMapping: ['R', 'D'],
    options: [
      { id: 'a', text: '分析错题，看看是粗心还是没学会', scores: { R: 3, I: 1 } },
      { id: 'b', text: '有点沮丧，但觉得下次能考好', scores: { R: 1, E: 1 } },
      { id: 'c', text: '制定一个补习计划，把薄弱点补上', scores: { D: 3, R: 1 } },
      { id: 'd', text: '问考得好的同学是怎么复习的', scores: { L: 2, I: 1 } },
    ],
    cognitiveLevel: '形式运算初期-归因分析',
    designRationale: '通过挫折情境测评归因方式和自我调节能力',
  },
  {
    id: 'UP-C06', ageGroup: 'upper-primary',
    text: '你负责组织班级图书角，你会怎么做？',
    scenario: '老师让你把班级图书角整理得更好用',
    model: 'WILDER', dimension: '设计力+连接力', wilderMapping: ['D', 'L'],
    options: [
      { id: 'a', text: '按照书的类型(故事、科学、历史)分类摆放', scores: { D: 3, I: 1 } },
      { id: 'b', text: '做一个借阅登记本，记录谁借了什么书', scores: { D: 2, R: 1 } },
      { id: 'c', text: '先问同学们喜欢看什么书，把热门书放在显眼位置', scores: { L: 3, D: 1 } },
      { id: 'd', text: '设计一个推荐卡，让大家写读后感推荐好书', scores: { E: 2, L: 2 } },
    ],
    cognitiveLevel: '形式运算初期-组织设计',
    designRationale: '通过实际管理任务测评设计力(系统规划)和连接力(用户思维)',
  },
  {
    id: 'UP-C07', ageGroup: 'upper-primary',
    text: '科学课上要种植物观察生长，你最想研究什么？',
    scenario: '老师让每人选一个植物种植实验',
    model: 'WILDER', dimension: '探究力+好奇心', wilderMapping: ['I', 'W'],
    options: [
      { id: 'a', text: '试试看音乐对植物生长有没有影响', scores: { W: 3, I: 1 } },
      { id: 'b', text: '对比不同光照条件下植物的生长差异', scores: { I: 3, D: 1 } },
      { id: 'c', text: '种不同品种的植物，看哪种长得最快', scores: { W: 2, I: 1 } },
      { id: 'd', text: '记录植物每天的变化，画成长日记', scores: { R: 2, E: 2 } },
    ],
    cognitiveLevel: '形式运算初期-科学探索',
    designRationale: '通过科学实验选择测评探究力(实验设计)和好奇心(问题提出)',
  },
  {
    id: 'UP-C08', ageGroup: 'upper-primary',
    text: '你发现最好的朋友在考试时偷看别人答案，你会怎么做？',
    scenario: '考试中，你无意间看到这一幕',
    model: 'WILDER', dimension: '反思力+连接力', wilderMapping: ['R', 'L'],
    options: [
      { id: 'a', text: '考试后私下和TA谈谈，告诉TA这样不对', scores: { L: 3, R: 1 } },
      { id: 'b', text: '先想想为什么TA会这么做，再决定怎么办', scores: { R: 3, L: 1 } },
      { id: 'c', text: '假装没看见，这是TA自己的选择', scores: { R: 1 } },
      { id: 'd', text: '告诉老师，让老师处理', scores: { D: 2 } },
    ],
    cognitiveLevel: '形式运算初期-道德判断',
    designRationale: '通过道德两难情境测评反思力(多角度思考)和连接力(关系维护)',
  },
  {
    id: 'UP-C09', ageGroup: 'upper-primary',
    text: '学校要办展览，你会选择展示什么？',
    scenario: '学校举办"我的成长故事"展览',
    model: 'WILDER', dimension: '表达力+反思力', wilderMapping: ['E', 'R'],
    options: [
      { id: 'a', text: '展示我最得意的作品(画、手工、文章)', scores: { E: 3, D: 1 } },
      { id: 'b', text: '讲一个我克服困难的故事', scores: { R: 3, E: 1 } },
      { id: 'c', text: '做一个时间轴，记录我这几年的变化', scores: { R: 2, D: 2 } },
      { id: 'd', text: '和好友一起做联合展示，讲我们的友谊故事', scores: { L: 3, E: 1 } },
    ],
    cognitiveLevel: '形式运算初期-自我展示',
    designRationale: '通过自我展示选择测评表达力(分享意愿)和反思力(自我认知)',
  },
  {
    id: 'UP-C10', ageGroup: 'upper-primary',
    text: '如果可以创办一个兴趣小组，你会选择什么主题？',
    scenario: '学校鼓励学生自主创办兴趣小组',
    model: 'WILDER', dimension: '好奇心+连接力', wilderMapping: ['W', 'L'],
    options: [
      { id: 'a', text: '创办一个探索未知的小组(宇宙、深海、考古)', scores: { W: 3, I: 1 } },
      { id: 'b', text: '创办一个发明创造小组，做有趣的小制作', scores: { D: 3, W: 1 } },
      { id: 'c', text: '创办一个帮助同学的互助小组(辅导、心理支持)', scores: { L: 3, E: 1 } },
      { id: 'd', text: '创办一个表演艺术小组(话剧、舞蹈、音乐)', scores: { E: 3, L: 1 } },
    ],
    cognitiveLevel: '形式运算初期-兴趣导向',
    designRationale: '通过社团创办选择测评核心兴趣领域和WILDER维度倾向',
  },
]

// ========== 初中(13-15岁) 选择题 ==========
// 设计原则：抽象假设情境、多变量思考、伦理与价值判断
const CHOICE_MIDDLE_SCHOOL: AdaptiveChoiceQuestion[] = [
  {
    id: 'MS-C01', ageGroup: 'middle-school',
    text: '如果你能用一年时间深入研究一个课题，你最想研究什么类型的问题？',
    scenario: '学校推出"少年学者计划"，每人可选一个课题研究一整年',
    model: 'WILDER', dimension: '学术兴趣与思维偏好', wilderMapping: ['W', 'I', 'D'],
    options: [
      { id: 'a', text: '一个目前科学界还没有答案的未解之谜', scores: { W: 3, I: 1 } },
      { id: 'b', text: '一个可以设计实验、收集数据来验证的假说', scores: { I: 3, D: 1 } },
      { id: 'c', text: '一个能解决身边实际问题的应用型课题', scores: { D: 3, L: 1 } },
      { id: 'd', text: '一个需要采访不同人、理解不同观点的社会议题', scores: { L: 2, E: 2, R: 1 } },
    ],
    cognitiveLevel: '形式运算期-假设思维',
    designRationale: '通过开放式课题选择，测评深层学术兴趣和思维类型偏好',
  },
  {
    id: 'MS-C02', ageGroup: 'middle-school',
    text: '你在网上看到两篇观点完全相反的文章，你的第一反应是？',
    scenario: '一篇说"手机对学习有害"，另一篇说"手机是学习工具"',
    model: 'Cognitive', dimension: '辩证思维', wilderMapping: ['I', 'R', 'W'],
    options: [
      { id: 'a', text: '分别看它们的论据和数据来源', scores: { I: 3, R: 1 } },
      { id: 'b', text: '觉得真相可能在两者之间，取决于"怎么用"', scores: { R: 3, W: 1 } },
      { id: 'c', text: '去查更多相关研究，看主流观点是什么', scores: { I: 2, W: 2 } },
      { id: 'd', text: '根据自己的经验判断哪个更有道理', scores: { E: 2, R: 1 } },
    ],
    cognitiveLevel: '形式运算期-辩证分析',
    designRationale: '测评信息素养和辩证思维能力的发展水平',
  },
  {
    id: 'MS-C03', ageGroup: 'middle-school',
    text: '班里有个同学因为一件事被大家误解了，你会怎么做？',
    scenario: '你知道真相，但说出来可能会得罪误解他的同学',
    model: 'BigFive', dimension: '道德判断与社会勇气', wilderMapping: ['L', 'E', 'R'],
    options: [
      { id: 'a', text: '直接站出来说明真相', scores: { E: 3, L: 1 } },
      { id: 'b', text: '私下告诉被误解的同学，帮TA想办法', scores: { L: 3, R: 1 } },
      { id: 'c', text: '找老师反映，让老师来处理', scores: { D: 2, L: 1 } },
      { id: 'd', text: '先观察事态发展，选择合适的时机再说', scores: { R: 3, D: 1 } },
    ],
    cognitiveLevel: '形式运算期-道德推理',
    designRationale: '通过道德两难情境测评社会勇气和策略性思考能力',
  },
  {
    id: 'MS-C04', ageGroup: 'middle-school',
    text: '你被选为学校活动的策划人，第一步你会做什么？',
    scenario: '学校让你负责策划一次校园文化节',
    model: 'WILDER', dimension: '项目管理与执行', wilderMapping: ['D', 'L', 'E'],
    options: [
      { id: 'a', text: '先做一个详细的项目计划书：目标、预算、时间表', scores: { D: 3, R: 1 } },
      { id: 'b', text: '先调研同学们想要什么样的活动', scores: { L: 2, I: 2 } },
      { id: 'c', text: '研究其他学校的成功案例，借鉴经验', scores: { I: 2, R: 2 } },
      { id: 'd', text: '先组建核心团队，分配角色和职责', scores: { L: 2, D: 2, E: 1 } },
    ],
    cognitiveLevel: '形式运算期-系统规划',
    designRationale: '通过真实项目场景测评设计力和领导力的综合水平',
  },
  {
    id: 'MS-C05', ageGroup: 'middle-school',
    text: '对于"失败是成功之母"这句话，你怎么理解？',
    scenario: '语文课讨论名言警句',
    model: 'Cognitive', dimension: '元认知与反思', wilderMapping: ['R', 'W'],
    options: [
      { id: 'a', text: '关键不是失败本身，而是从中学到了什么', scores: { R: 3, I: 1 } },
      { id: 'b', text: '有些失败确实是浪费时间，不是所有失败都有价值', scores: { I: 2, R: 2 } },
      { id: 'c', text: '不失败更好，但失败了要善于总结经验', scores: { D: 2, R: 1 } },
      { id: 'd', text: '要看是什么样的失败——主动尝试的失败比被动的有价值', scores: { W: 2, R: 2, I: 1 } },
    ],
    cognitiveLevel: '形式运算期-抽象概念理解',
    designRationale: '通过抽象命题理解测评元认知深度和反思性思维',
  },
  {
    id: 'MS-C06', ageGroup: 'middle-school',
    text: '你发现一个你很感兴趣但学校没有的课程，你会怎么做？',
    scenario: '你对心理学/编程/哲学特别感兴趣，但学校不开这门课',
    model: 'WILDER', dimension: '探究力+好奇心', wilderMapping: ['I', 'W'],
    options: [
      { id: 'a', text: '在网上找资源自学，看书、看视频课程', scores: { I: 3, W: 1 } },
      { id: 'b', text: '找有这方面知识的老师或专业人士请教', scores: { W: 2, L: 2 } },
      { id: 'c', text: '联合同学向学校申请开设这门选修课', scores: { E: 2, L: 2, D: 1 } },
      { id: 'd', text: '参加校外的培训班或夏令营', scores: { W: 2, D: 1 } },
    ],
    cognitiveLevel: '形式运算期-自主学习',
    designRationale: '通过学习需求场景测评探究力(主动求知)和好奇心(兴趣驱动)',
  },
  {
    id: 'MS-C07', ageGroup: 'middle-school',
    text: '你的好友陷入了一个你认为不对的交友关系，你会怎么做？',
    scenario: '你担心那个朋友会对TA有不好的影响',
    model: 'WILDER', dimension: '连接力+反思力', wilderMapping: ['L', 'R'],
    options: [
      { id: 'a', text: '当面直说"我觉得那个人不太靠谱"', scores: { E: 3, L: 1 } },
      { id: 'b', text: '先私下调查了解情况，也许我的判断不全面', scores: { R: 3, I: 1 } },
      { id: 'c', text: '不评价对方，但多问TA"你和TA在一起开心吗"', scores: { L: 3, R: 1 } },
      { id: 'd', text: '写一封信或发一条长消息，把想法整理清楚再表达', scores: { D: 2, E: 1, R: 1 } },
    ],
    cognitiveLevel: '形式运算期-复杂社交',
    designRationale: '通过复杂社交情境测评连接力(关系处理)和反思力(多角度思考)',
  },
  {
    id: 'MS-C08', ageGroup: 'middle-school',
    text: '你要做一个关于环保的演讲，你会选择什么角度？',
    scenario: '学校环保主题演讲比赛',
    model: 'WILDER', dimension: '表达力+设计力', wilderMapping: ['E', 'D'],
    options: [
      { id: 'a', text: '用震撼的数据和图片展示环境危机的严重性', scores: { E: 3, I: 1 } },
      { id: 'b', text: '讲一个真实的故事，让大家产生情感共鸣', scores: { E: 2, L: 2 } },
      { id: 'c', text: '提出具体可行的环保行动方案，号召大家参与', scores: { D: 3, L: 1 } },
      { id: 'd', text: '分析环境问题的深层原因，引发大家思考', scores: { R: 2, I: 2 } },
    ],
    cognitiveLevel: '形式运算期-说服策略',
    designRationale: '通过演讲策略选择测评表达力(沟通方式)和设计力(内容组织)',
  },
  {
    id: 'MS-C09', ageGroup: 'middle-school',
    text: '你参加一个创新比赛，在创意阶段遇到瓶颈，你会怎么做？',
    scenario: '团队讨论了很久，但感觉想法都不够好',
    model: 'WILDER', dimension: '设计力+好奇心', wilderMapping: ['D', 'W'],
    options: [
      { id: 'a', text: '去观察生活中的问题，从真实需求中找灵感', scores: { W: 2, L: 2 } },
      { id: 'b', text: '研究其他优秀作品，看看能否借鉴或改进', scores: { I: 2, R: 2 } },
      { id: 'c', text: '用头脑风暴法，先不评判地提出各种可能', scores: { W: 3, D: 1 } },
      { id: 'd', text: '重新审视问题，换个角度定义要解决的问题', scores: { R: 3, I: 1 } },
    ],
    cognitiveLevel: '形式运算期-创新思维',
    designRationale: '通过创新瓶颈场景测评设计力(问题解决)和好奇心(灵感来源)',
  },
  {
    id: 'MS-C10', ageGroup: 'middle-school',
    text: '你发现自己在某个学科上的学习方法一直没效果，你会怎么办？',
    scenario: '很努力但成绩一直提不上去',
    model: 'WILDER', dimension: '反思力+探究力', wilderMapping: ['R', 'I'],
    options: [
      { id: 'a', text: '做一张错题分析表，找出每次错在哪个环节', scores: { R: 3, I: 1 } },
      { id: 'b', text: '大胆换一种全新的方法（比如从做题转为教别人）', scores: { W: 2, I: 2 } },
      { id: 'c', text: '找3个学霸聊聊，对比他们的方法和我的区别', scores: { L: 3, I: 1 } },
      { id: 'd', text: '制定为期两周的学习实验计划，记录每天的效果', scores: { D: 3, R: 1 } },
    ],
    cognitiveLevel: '形式运算期-元学习',
    designRationale: '通过学习困境测评反思力(方法反思)和探究力(策略试验)',
  },
]

// ========== 高中(16-18岁) 选择题 ==========
// 设计原则：复杂抽象情境、多视角分析、跨学科整合、价值观探索
const CHOICE_HIGH_SCHOOL: AdaptiveChoiceQuestion[] = [
  {
    id: 'HS-C01', ageGroup: 'high-school',
    text: 'AI可以写论文、做设计、写代码，你认为人类最不可能被AI替代的能力是什么？',
    scenario: '班会讨论"AI时代我们应该培养什么能力"',
    model: 'WILDER', dimension: 'AI时代核心能力', wilderMapping: ['W', 'I', 'R'],
    options: [
      { id: 'a', text: '提出有价值的新问题——AI擅长回答问题但不擅长提问', scores: { W: 3, I: 1 } },
      { id: 'b', text: '判断信息真伪和建立信任——AI没有人类的诚信基础', scores: { I: 2, L: 2 } },
      { id: 'c', text: '理解他人情感和建立深度关系——AI没有真正的共情', scores: { L: 3, E: 1 } },
      { id: 'd', text: '定义问题的价值和意义——AI不理解"为什么重要"', scores: { R: 3, W: 1 } },
    ],
    cognitiveLevel: '后形式运算-跨域抽象分析',
    designRationale: '通过AI时代议题测评高阶思维方向和价值判断',
  },
  {
    id: 'HS-C02', ageGroup: 'high-school',
    text: '如果你有机会参加一个国际项目，你最想参加哪一类？',
    scenario: '学校提供四种国际交流项目机会',
    model: 'MI', dimension: '学术与职业倾向', wilderMapping: ['W', 'I', 'L', 'D', 'E', 'R'],
    options: [
      { id: 'a', text: '跨学科研究营——探索一个前沿科学问题', scores: { W: 2, I: 2 } },
      { id: 'b', text: '社会创新工作坊——设计一个解决真实社会问题的方案', scores: { D: 2, L: 2 } },
      { id: 'c', text: '模拟联合国或辩论赛——在国际舞台上表达观点', scores: { E: 3, L: 1 } },
      { id: 'd', text: '田野调查项目——深入一个文化去观察和记录', scores: { R: 2, W: 2, I: 1 } },
    ],
    cognitiveLevel: '后形式运算-自我定位',
    designRationale: '通过真实选择测评学术兴趣与未来发展方向',
  },
  {
    id: 'HS-C03', ageGroup: 'high-school',
    text: '面对一个复杂的社会问题（如教育公平），你倾向于用什么方式思考？',
    scenario: '学校通识课讨论社会议题',
    model: 'Cognitive', dimension: '系统思维深度', wilderMapping: ['I', 'R', 'L'],
    options: [
      { id: 'a', text: '收集数据，用统计和逻辑分析因果关系', scores: { I: 3, D: 1 } },
      { id: 'b', text: '理解不同利益相关方的立场和诉求', scores: { L: 3, R: 1 } },
      { id: 'c', text: '追溯历史，理解问题形成的深层原因', scores: { R: 2, W: 2, I: 1 } },
      { id: 'd', text: '设计一个可行的解决方案并评估其影响', scores: { D: 3, I: 1 } },
    ],
    cognitiveLevel: '后形式运算-系统分析',
    designRationale: '通过复杂问题分析测评系统思维方式和认知复杂度',
  },
  {
    id: 'HS-C04', ageGroup: 'high-school',
    text: '在学习一个新领域时，你通常的策略是什么？',
    scenario: '你决定自学一个完全陌生的领域（如哲学/编程/心理学）',
    model: 'WILDER', dimension: '学习策略与元认知', wilderMapping: ['R', 'I', 'D'],
    options: [
      { id: 'a', text: '先画一张思维导图——搞清楚这个领域有哪些分支和关系', scores: { D: 3, R: 1 } },
      { id: 'b', text: '找一个有趣的问题动手做，遇到不会的再去学', scores: { W: 2, I: 2 } },
      { id: 'c', text: '精读该领域最经典的一本书，做详细笔记和批注', scores: { I: 3, R: 1 } },
      { id: 'd', text: '找到这个领域的从业者或爱好者社群，通过交流快速入门', scores: { L: 3, E: 1 } },
    ],
    cognitiveLevel: '后形式运算-元学习',
    designRationale: '通过学习策略选择测评元认知水平和自主学习能力',
  },
  {
    id: 'HS-C05', ageGroup: 'high-school',
    text: '你认为一个人在18岁时最重要的能力是什么？',
    scenario: '高中生活即将结束，你在思考自己的能力图谱',
    model: 'WILDER', dimension: '自我认知与价值观', wilderMapping: ['R', 'W', 'D'],
    options: [
      { id: 'a', text: '独立思考和判断的能力——不被他人轻易左右', scores: { R: 3, I: 1 } },
      { id: 'b', text: '持续学习和适应变化的能力——未来变化太快', scores: { W: 2, I: 2 } },
      { id: 'c', text: '与不同的人建立有效关系的能力——人脉即资源', scores: { L: 3, E: 1 } },
      { id: 'd', text: '把想法变成现实的执行力——想到就能做到', scores: { D: 3 } },
    ],
    cognitiveLevel: '后形式运算-价值排序',
    designRationale: '通过价值排序测评自我认知深度和未来导向',
  },
  {
    id: 'HS-C06', ageGroup: 'high-school',
    text: '你读到一篇颠覆性的学术论文，挑战了你之前的认知，你的反应是？',
    scenario: '一篇新研究推翻了教科书上的经典理论',
    model: 'WILDER', dimension: '好奇心+反思力', wilderMapping: ['W', 'R'],
    options: [
      { id: 'a', text: '兴奋——马上读原论文，追踪它引用的文献和实验数据', scores: { W: 3, I: 1 } },
      { id: 'b', text: '先反思自己之前的理解为什么会错，复盘认知过程', scores: { R: 3, I: 1 } },
      { id: 'c', text: '暂不下结论，等半年看学术界的同行评议和复现结果', scores: { I: 2, R: 2 } },
      { id: 'd', text: '写一篇对比分析，把新旧理论的优劣整理出来分享', scores: { E: 2, D: 2 } },
    ],
    cognitiveLevel: '后形式运算-知识重构',
    designRationale: '通过知识冲突场景测评好奇心(开放性)和反思力(认知灵活性)',
  },
  {
    id: 'HS-C07', ageGroup: 'high-school',
    text: '你要做一个关于气候变化的深度研究报告，你会选择什么路径？',
    scenario: '研究性学习大作业，需要展现深度思考',
    model: 'WILDER', dimension: '探究力+设计力', wilderMapping: ['I', 'D'],
    options: [
      { id: 'a', text: '分析气候数据，建立数学模型预测未来趋势', scores: { I: 3, D: 1 } },
      { id: 'b', text: '调研不同国家的应对政策，比较其有效性', scores: { I: 2, R: 2 } },
      { id: 'c', text: '设计一个社区层面的减排行动方案', scores: { D: 3, L: 1 } },
      { id: 'd', text: '采访不同群体，理解人们对气候变化的认知差异', scores: { L: 2, E: 2 } },
    ],
    cognitiveLevel: '后形式运算-研究设计',
    designRationale: '通过研究路径选择测评探究力(方法论)和设计力(结构化能力)',
  },
  {
    id: 'HS-C08', ageGroup: 'high-school',
    text: '你发现自己的人生目标和父母的期望完全不同，你会怎么做？',
    scenario: '你想学艺术，但父母希望你选择更"稳定"的专业',
    model: 'WILDER', dimension: '连接力+反思力', wilderMapping: ['L', 'R'],
    options: [
      { id: 'a', text: '深入思考自己真正想要什么，确认这不是冲动', scores: { R: 3, W: 1 } },
      { id: 'b', text: '尝试理解父母担忧背后的原因，寻找双赢方案', scores: { L: 3, R: 1 } },
      { id: 'c', text: '用事实和规划说服父母，展示我的决心和准备', scores: { E: 2, D: 2 } },
      { id: 'd', text: '寻找该领域成功人士的案例，证明这条路的可行性', scores: { I: 2, E: 1 } },
    ],
    cognitiveLevel: '后形式运算-价值冲突',
    designRationale: '通过代际价值冲突测评连接力(关系处理)和反思力(自我确认)',
  },
  {
    id: 'HS-C09', ageGroup: 'high-school',
    text: '如果让你给全校做一次TED式演讲，你会选择什么主题？',
    scenario: '学校"思想者讲坛"邀请你分享',
    model: 'WILDER', dimension: '表达力+反思力', wilderMapping: ['E', 'R'],
    options: [
      { id: 'a', text: '分享我的成长故事和从中获得的人生感悟', scores: { E: 2, R: 2 } },
      { id: 'b', text: '讲一个我深度研究过的学术话题', scores: { I: 2, E: 2 } },
      { id: 'c', text: '探讨一个我认为被忽视但很重要的社会问题', scores: { R: 2, L: 2, E: 1 } },
      { id: 'd', text: '挑战一个主流观点，提出不同的思考角度', scores: { W: 2, E: 2, R: 1 } },
    ],
    cognitiveLevel: '后形式运算-思想表达',
    designRationale: '通过思想分享场景测评表达力(影响力)和反思力(洞察深度)',
  },
  {
    id: 'HS-C10', ageGroup: 'high-school',
    text: '你有一个创新想法，但需要说服团队和资源，你的策略是？',
    scenario: '创业比赛或科研项目，需要组建团队并获得支持',
    model: 'WILDER', dimension: '设计力+连接力', wilderMapping: ['D', 'L'],
    options: [
      { id: 'a', text: '先做详细的可行性分析和商业计划书', scores: { D: 3, I: 1 } },
      { id: 'b', text: '做一个原型或demo，让人看到具体效果', scores: { D: 2, E: 2 } },
      { id: 'c', text: '找到志同道合的伙伴，共同完善这个想法', scores: { L: 3, E: 1 } },
      { id: 'd', text: '先做小规模试验，用数据证明想法的价值', scores: { I: 2, D: 2 } },
    ],
    cognitiveLevel: '后形式运算-创新实现',
    designRationale: '通过创新实现场景测评设计力(执行规划)和连接力(团队建设)',
  },
]

// ========== 判断题（分年龄段） ==========

const JUDGMENT_LOWER_PRIMARY: AdaptiveJudgmentQuestion[] = [
  {
    id: 'LP-J01', ageGroup: 'lower-primary',
    text: '把一杯水倒进一个又高又细的杯子里，水会变多。', scenario: '妈妈把你的水倒到了另一个杯子里',
    model: 'Cognitive', dimension: '守恒概念', wilderMapping: ['I'],
    correctAnswer: false, scores: { yes: { I: 0 }, no: { I: 3 } },
    cognitiveLevel: '具象操作期-守恒', designRationale: '经典皮亚杰守恒任务适配低龄版本',
  },
  {
    id: 'LP-J02', ageGroup: 'lower-primary',
    text: '遇到不懂的东西，我会特别想知道答案。',
    model: 'WILDER', dimension: '好奇心自评', wilderMapping: ['W'],
    correctAnswer: true, scores: { yes: { W: 2 }, no: { W: 0 } },
    cognitiveLevel: '自我报告', designRationale: '简单直接的好奇心自评题',
  },
  {
    id: 'LP-J03', ageGroup: 'lower-primary',
    text: '我喜欢把自己知道的事情讲给别人听。',
    model: 'WILDER', dimension: '表达力自评', wilderMapping: ['E'],
    correctAnswer: true, scores: { yes: { E: 2 }, no: { E: 0 } },
    cognitiveLevel: '自我报告', designRationale: '低龄版表达力自评',
  },
  {
    id: 'LP-J04', ageGroup: 'lower-primary',
    text: '当我的想法和别人不一样时，我也敢说出来。',
    model: 'WILDER', dimension: '表达力+好奇心', wilderMapping: ['E', 'W'],
    correctAnswer: true, scores: { yes: { E: 2, W: 1 }, no: { E: 0 } },
    cognitiveLevel: '自我报告', designRationale: '测评表达意愿和独立思考倾向',
  },
  {
    id: 'LP-J05', ageGroup: 'lower-primary',
    text: '和朋友一起玩比自己一个人玩更开心。',
    model: 'WILDER', dimension: '连接力自评', wilderMapping: ['L'],
    correctAnswer: true, scores: { yes: { L: 2 }, no: { L: 0 } },
    cognitiveLevel: '自我报告', designRationale: '测评社交倾向和连接力基础水平',
  },
]

const JUDGMENT_UPPER_PRIMARY: AdaptiveJudgmentQuestion[] = [
  {
    id: 'UP-J01', ageGroup: 'upper-primary',
    text: '小明比小红高，小红比小刚高，所以小明一定比小刚高。',
    model: 'Cognitive', dimension: '传递推理', wilderMapping: ['I'],
    correctAnswer: true, scores: { yes: { I: 3 }, no: { I: 0 } },
    cognitiveLevel: '形式运算初期-逻辑推理', designRationale: '传递推理能力测评',
  },
  {
    id: 'UP-J02', ageGroup: 'upper-primary',
    text: '做一件事之前，我习惯先想一想可能会遇到什么困难。',
    model: 'WILDER', dimension: '设计力自评', wilderMapping: ['D', 'R'],
    correctAnswer: true, scores: { yes: { D: 2, R: 1 }, no: { D: 0 } },
    cognitiveLevel: '自我报告', designRationale: '计划性和风险预估的自评',
  },
  {
    id: 'UP-J03', ageGroup: 'upper-primary',
    text: '如果一个科学实验的结果和我预想的不同，说明实验失败了。',
    model: 'Cognitive', dimension: '科学思维', wilderMapping: ['I', 'R'],
    correctAnswer: false, scores: { yes: { I: 0 }, no: { I: 2, R: 1 } },
    cognitiveLevel: '形式运算初期-科学方法', designRationale: '测评对科学方法的理解深度',
  },
  {
    id: 'UP-J04', ageGroup: 'upper-primary',
    text: '我常常会想"如果这样做会怎么样"，然后试一试。',
    model: 'WILDER', dimension: '探究力+好奇心', wilderMapping: ['I', 'W'],
    correctAnswer: true, scores: { yes: { I: 2, W: 1 }, no: { I: 0 } },
    cognitiveLevel: '自我报告', designRationale: '测评假设-验证思维和主动探索倾向',
  },
  {
    id: 'UP-J05', ageGroup: 'upper-primary',
    text: '当我做错事后，我会想想下次怎么做会更好。',
    model: 'WILDER', dimension: '反思力自评', wilderMapping: ['R'],
    correctAnswer: true, scores: { yes: { R: 2 }, no: { R: 0 } },
    cognitiveLevel: '自我报告', designRationale: '测评反思习惯和成长型心态',
  },
]

const JUDGMENT_MIDDLE_SCHOOL: AdaptiveJudgmentQuestion[] = [
  {
    id: 'MS-J01', ageGroup: 'middle-school',
    text: '要验证"植物是否需要阳光才能生长"，最好的方法是种两盆一样的植物，一盆放阳光下，一盆放暗处，其他条件保持相同。',
    model: 'Cognitive', dimension: '变量控制', wilderMapping: ['I', 'D'],
    correctAnswer: true, scores: { yes: { I: 3, D: 1 }, no: { I: 0 } },
    cognitiveLevel: '形式运算期-实验设计', designRationale: '控制变量法的理解与应用',
  },
  {
    id: 'MS-J02', ageGroup: 'middle-school',
    text: '一个人如果在某方面有潜能，就不需要太多努力就能成功。',
    model: 'BigFive', dimension: '成长型心态', wilderMapping: ['R', 'W'],
    correctAnswer: false, scores: { yes: { R: 0 }, no: { R: 2, W: 1 } },
    cognitiveLevel: '价值判断', designRationale: '测评成长型vs固定型心态',
  },
  {
    id: 'MS-J03', ageGroup: 'middle-school',
    text: '做完一件事之后，我会想想哪里做得好、哪里可以改进。',
    model: 'WILDER', dimension: '反思力自评', wilderMapping: ['R'],
    correctAnswer: true, scores: { yes: { R: 2 }, no: { R: 0 } },
    cognitiveLevel: '自我报告-元认知', designRationale: '测评反思习惯的自我认知',
  },
  {
    id: 'MS-J04', ageGroup: 'middle-school',
    text: '我喜欢了解不同人的想法，即使和我的观点完全相反。',
    model: 'WILDER', dimension: '连接力+好奇心', wilderMapping: ['L', 'W'],
    correctAnswer: true, scores: { yes: { L: 2, W: 1 }, no: { L: 0 } },
    cognitiveLevel: '自我报告', designRationale: '测评开放性思维和社交好奇心',
  },
  {
    id: 'MS-J05', ageGroup: 'middle-school',
    text: '当我对一个话题感兴趣时，我会主动去找资料深入了解。',
    model: 'WILDER', dimension: '探究力+好奇心', wilderMapping: ['I', 'W'],
    correctAnswer: true, scores: { yes: { I: 2, W: 1 }, no: { I: 0 } },
    cognitiveLevel: '自我报告', designRationale: '测评主动探究倾向和深度学习意愿',
  },
]

const JUDGMENT_HIGH_SCHOOL: AdaptiveJudgmentQuestion[] = [
  {
    id: 'HS-J01', ageGroup: 'high-school',
    text: '相关性不等于因果性——"冰淇淋销量增加"和"溺水事件增加"同时发生，不代表吃冰淇淋导致溺水。',
    model: 'Cognitive', dimension: '高阶逻辑推理', wilderMapping: ['I', 'R'],
    correctAnswer: true, scores: { yes: { I: 3, R: 1 }, no: { I: 0 } },
    cognitiveLevel: '后形式运算-统计推理', designRationale: '区分相关性与因果性的能力',
  },
  {
    id: 'HS-J02', ageGroup: 'high-school',
    text: '在做重要决定时，我会考虑这个决定对5年后的自己意味着什么。',
    model: 'WILDER', dimension: '长期思维', wilderMapping: ['R', 'D'],
    correctAnswer: true, scores: { yes: { R: 2, D: 2 }, no: { R: 0, D: 0 } },
    cognitiveLevel: '自我报告-时间视角', designRationale: '测评时间视角和长期规划意识',
  },
  {
    id: 'HS-J03', ageGroup: 'high-school',
    text: '解决复杂问题时，我倾向于先理解整体结构，再关注细节。',
    model: 'WILDER', dimension: '系统思维', wilderMapping: ['D', 'I'],
    correctAnswer: true, scores: { yes: { D: 2, I: 1 }, no: { D: 0 } },
    cognitiveLevel: '自我报告-认知风格', designRationale: '测评系统性vs线性思维偏好',
  },
  {
    id: 'HS-J04', ageGroup: 'high-school',
    text: '我经常会质疑权威观点，想要自己验证是否正确。',
    model: 'WILDER', dimension: '探究力+好奇心', wilderMapping: ['I', 'W'],
    correctAnswer: true, scores: { yes: { I: 2, W: 2 }, no: { I: 0 } },
    cognitiveLevel: '自我报告', designRationale: '测评批判性思维和独立探究精神',
  },
  {
    id: 'HS-J05', ageGroup: 'high-school',
    text: '我能够从不同的角度看待同一个问题，理解多元观点。',
    model: 'WILDER', dimension: '反思力+连接力', wilderMapping: ['R', 'L'],
    correctAnswer: true, scores: { yes: { R: 2, L: 1 }, no: { R: 0 } },
    cognitiveLevel: '自我报告', designRationale: '测评认知复杂度和多元视角能力',
  },
]

// ========== 导出函数 ==========

/** 根据年龄获取适龄选择题 */
export function getChoiceQuestionsByAge(age: number): AdaptiveChoiceQuestion[] {
  const group = getAgeGroupKey(age)
  const map: Record<AgeGroupKey, AdaptiveChoiceQuestion[]> = {
    'preschool': [], // 学龄前题目在preschoolQuestions.ts中单独处理
    'lower-primary': CHOICE_LOWER_PRIMARY,
    'upper-primary': CHOICE_UPPER_PRIMARY,
    'middle-school': CHOICE_MIDDLE_SCHOOL,
    'high-school': CHOICE_HIGH_SCHOOL,
  }
  return map[group]
}

/** 根据年龄获取适龄判断题 */
export function getJudgmentQuestionsByAge(age: number): AdaptiveJudgmentQuestion[] {
  const group = getAgeGroupKey(age)
  const map: Record<AgeGroupKey, AdaptiveJudgmentQuestion[]> = {
    'preschool': [], // 学龄前题目在preschoolQuestions.ts中单独处理
    'lower-primary': JUDGMENT_LOWER_PRIMARY,
    'upper-primary': JUDGMENT_UPPER_PRIMARY,
    'middle-school': JUDGMENT_MIDDLE_SCHOOL,
    'high-school': JUDGMENT_HIGH_SCHOOL,
  }
  return map[group]
}

/** 获取所有题目（选择+判断）按年龄 */
export function getAllQuestionsByAge(age: number): {
  choices: AdaptiveChoiceQuestion[]
  judgments: AdaptiveJudgmentQuestion[]
  ageGroup: AgeGroupKey
  totalCount: number
  designNotes: string
} {
  const group = getAgeGroupKey(age)
  const choices = getChoiceQuestionsByAge(age)
  const judgments = getJudgmentQuestionsByAge(age)
  const notes: Record<AgeGroupKey, string> = {
    'preschool': '学龄前(4-5岁)：生活化情境+简单语言+具象选项，侧重好奇心和社交连接力评估',
    'lower-primary': '小学低年级(6-9岁)：具象化场景+简单选项+趣味互动，侧重好奇心和基础认知能力评估',
    'upper-primary': '小学高年级(10-12岁)：半抽象情境+多步骤思考+引入假设验证，侧重批判思维和自我管理评估',
    'middle-school': '初中(13-15岁)：抽象假设+多变量+道德判断，侧重系统思维和社会认知评估',
    'high-school': '高中(16-18岁)：复杂抽象+跨学科+价值观探索，侧重元认知和未来导向评估',
  }
  return { choices, judgments, ageGroup: group, totalCount: choices.length + judgments.length, designNotes: notes[group] }
}

/** 获取年龄组的认知发展特点 */
export function getAgeCognitiveProfile(age: number): {
  stage: string; characteristics: string[]; assessmentFocus: string[]
} {
  const group = getAgeGroupKey(age)
  const profiles: Record<AgeGroupKey, { stage: string; characteristics: string[]; assessmentFocus: string[] }> = {
    'preschool': {
      stage: '皮亚杰前运算阶段',
      characteristics: ['以具体形象思维为主', '语言快速发展期', '自我中心但开始社交', '注意力跨度10-15分钟', '通过游戏和模仿学习'],
      assessmentFocus: ['好奇心和探索行为', '基础社交连接力', '情绪表达能力', '初步自理能力'],
    },
    'lower-primary': {
      stage: '皮亚杰具体运算期',
      characteristics: ['以具象思维为主', '开始理解守恒概念', '能进行简单分类和排序', '注意力跨度15-25分钟', '以自我为中心但开始去中心化'],
      assessmentFocus: ['基础好奇心和探索行为', '简单因果理解', '初步社交能力', '基本自我认知'],
    },
    'upper-primary': {
      stage: '皮亚杰形式运算初期',
      characteristics: ['抽象思维开始发展', '能进行传递推理', '理解因果关系', '注意力跨度30-45分钟', '社会比较意识增强'],
      assessmentFocus: ['批判性思维萌芽', '科学方法初步理解', '自我管理和规划力', '同伴关系与协作'],
    },
    'middle-school': {
      stage: '皮亚杰形式运算期',
      characteristics: ['抽象思维成熟', '假设-验证推理', '道德推理能力发展', '注意力跨度45-60分钟', '自我意识和身份认同构建'],
      assessmentFocus: ['系统性思维和辩证分析', '实验设计和变量控制', '道德判断和社会责任', '元认知和反思能力'],
    },
    'high-school': {
      stage: '后形式运算期',
      characteristics: ['元认知成熟', '跨学科联想', '价值观形成', '注意力跨度60分钟+', '未来导向与生涯规划'],
      assessmentFocus: ['复杂问题解决和系统分析', '相关性vs因果性区分', '自主学习策略', '长期规划和价值排序'],
    },
  }
  return profiles[group]
}

export { getAgeGroupKey }
