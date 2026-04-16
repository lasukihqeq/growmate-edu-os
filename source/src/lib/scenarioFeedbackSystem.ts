// ===================================================================
// WILDER 场景描述与家长反馈系统 V2.0
// P0: 20+具体场景描述 + 反直觉发现
// P1: 家长验证反馈闭环 + 动态场景池
// P2: 多模型验证可视化 + 成长时间线
// ===================================================================

import type { WilderDimension } from './wilderKernel'

// ===================================================================
// P0-1: 具体场景描述库 (每维度20+)
// ===================================================================

/** 维度场景描述 */
export interface DimensionScenario {
  dimension: WilderDimension
  dimensionName: string
  level: 'high' | 'mid' | 'low'
  scenario: string
  observationGuide: string
  parentAction: string
  keywords: string[]
}

/** 好奇心(W) - 25个具体场景 */
export const W_SCENARIOS: DimensionScenario[] = [
  // High level scenarios
  { dimension: 'W', dimensionName: '好奇心', level: 'high', scenario: '在户外看到不认识的昆虫，会主动蹲下来观察半天，还问"它为什么会这样爬？"', observationGuide: '观察孩子对新奇事物的关注时长和提问频率', parentAction: '准备一本昆虫图鉴，和孩子一起查找答案，满足探究欲望', keywords: ['观察', '提问', '自然'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'high', scenario: '看到电视里的科学实验节目，会主动要求尝试，甚至自己找材料模仿', observationGuide: '观察孩子的模仿创造力和主动学习意愿', parentAction: '提供安全的实验材料，在指导下完成小实验', keywords: ['模仿', '实验', '主动'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'high', scenario: '逛博物馆时会在感兴趣的展品前停留很久，反复观看说明牌', observationGuide: '观察孩子对知识获取的主动性', parentAction: '提前查阅展品相关资料，做孩子的"讲解员"', keywords: ['博物馆', '学习', '专注'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'high', scenario: '对天文地理类科普书爱不释手，主动查阅各种奇怪的知识', observationGuide: '观察孩子的阅读偏好和知识广度', parentAction: '订阅相关科普杂志，购买适龄科普书籍', keywords: ['阅读', '知识', '主动'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'high', scenario: '看到天上的云朵形状奇特，会说"那朵云好像一只狗"，并持续观察变化', observationGuide: '观察孩子的想象力和对自然现象的关注', parentAction: '一起进行云朵观察游戏，拍摄变化过程', keywords: ['想象', '自然', '观察'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'high', scenario: '遇到不懂的问题会追着大人问"为什么"，不得到答案不罢休', observationGuide: '观察孩子的追问深度和坚持性', parentAction: '认真对待每个问题，不知道的可以一起查资料', keywords: ['追问', '坚持', '学习'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'high', scenario: '对电子产品充满兴趣，拆解旧手机、旧玩具研究内部结构', observationGuide: '观察孩子的探索方式和安全意识', parentAction: '提供废弃电子产品供研究，讲解基本原理', keywords: ['拆解', '研究', '动手'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'high', scenario: '在游乐场对各种设施的工作原理感兴趣，即使在玩的时候也在观察', observationGuide: '观察孩子是否能在娱乐中保持求知欲', parentAction: '玩之前讲解原理，玩之后讨论感受', keywords: ['观察', '原理', '思考'] },
  // Mid level scenarios
  { dimension: 'W', dimensionName: '好奇心', level: 'mid', scenario: '对感兴趣的话题会主动提问，但不感兴趣的话题不太关心', observationGuide: '观察孩子兴趣的广度和选择性', parentAction: '拓展孩子感兴趣领域的周边话题，适度引导其他领域', keywords: ['选择性', '兴趣', '主动'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'mid', scenario: '会问问题但得到答案后就停止追问，不会深入探究', observationGuide: '观察孩子的追问深度', parentAction: '引导孩子进一步思考，"如果...会怎样？"', keywords: ['表面', '回答', '停止'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'mid', scenario: '对新事物有兴趣但需要时间适应，不会立刻扑上去研究', observationGuide: '观察孩子的适应速度和谨慎程度', parentAction: '给孩子适应时间，不要强迫立刻接触新事物', keywords: ['适应', '谨慎', '观察'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'mid', scenario: '在引导下愿意尝试新事物，但自己不会主动探索', observationGuide: '观察孩子从被动到主动的转变需要多少引导', parentAction: '提供多样化的体验机会，逐步减少引导', keywords: ['引导', '尝试', '被动'] },
  // Low level scenarios
  { dimension: 'W', dimensionName: '好奇心', level: 'low', scenario: '更愿意重复玩熟悉的玩具，对新玩具兴趣一般', observationGuide: '观察孩子对新旧事物的接受程度', parentAction: '用熟悉事物引入新元素，降低陌生感', keywords: ['熟悉', '重复', '保守'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'low', scenario: '对周围事物不太关注，更热衷于固定的电视节目或游戏', observationGuide: '观察孩子是否有固定的娱乐偏好', parentAction: '引入户外活动和互动游戏，增加体验多样性', keywords: ['固定', '屏幕', '被动'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'low', scenario: '被问到"为什么"时回答"不知道"或回避问题', observationGuide: '观察孩子是否愿意思考问题', parentAction: '先从孩子熟悉的话题开始，建立思考习惯', keywords: ['回避', '思考', '抵触'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'low', scenario: '对自然科学类内容兴趣缺缺，更喜欢故事类或游戏类', observationGuide: '观察孩子兴趣的偏向性', parentAction: '从故事角度引入科学知识，降低抵触感', keywords: ['故事', '科学', '偏好'] },
  // Additional edge cases
  { dimension: 'W', dimensionName: '好奇心', level: 'high', scenario: '在超市会对食品包装上的成分表感兴趣，问"这个是什么？"', observationGuide: '观察孩子对日常生活中科学知识的敏感度', parentAction: '一起阅读食品标签，解释简单成分', keywords: ['生活', '观察', '问题'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'high', scenario: '养宠物后会细心观察宠物行为，记录喂养心得', observationGuide: '观察孩子对生命科学的天然兴趣', parentAction: '提供养宠物机会，培养责任感和观察力', keywords: ['宠物', '记录', '生命'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'mid', scenario: '对感兴趣的科学实验会认真做笔记，但不感兴趣的不愿动手', observationGuide: '观察孩子对不同实验的参与度差异', parentAction: '从孩子感兴趣的方向切入，逐步拓展', keywords: ['笔记', '选择', '参与'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'high', scenario: '坐车时会问"为什么天上的云有的白有的灰？""为什么太阳落山了会变红？"', observationGuide: '观察孩子对自然现象的敏感性和提问时机', parentAction: '抓住日常自然教育时机，准备简单易懂的答案', keywords: ['自然现象', '日常', '提问'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'high', scenario: '在使用手机/iPad时会对APP的工作原理感兴趣，而非只玩游戏', observationGuide: '观察孩子是关注表面还是内在', parentAction: '引导了解简单编程概念，激发探索欲望', keywords: ['科技', '原理', '探索'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'mid', scenario: '看到别人做的事有兴趣，但自己不敢尝试，只在旁边看', observationGuide: '观察孩子是"观众型"还是"参与型"', parentAction: '先陪孩子一起尝试，降低心理门槛', keywords: ['观看', '犹豫', '旁观'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'low', scenario: '对大人说的话似懂非懂，但不会追问"是什么意思"', observationGuide: '观察孩子是否习惯性接受信息而不求甚解', parentAction: '主动询问孩子是否理解，鼓励提问', keywords: ['接受', '理解', '沉默'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'high', scenario: '在阅读科普书籍时会联想到现实生活，提出"那我们能去那里吗？"', observationGuide: '观察孩子是否能将知识与现实连接', parentAction: '讨论实现的可能性，激励学习动力', keywords: ['连接', '现实', '想象'] },
  { dimension: 'W', dimensionName: '好奇心', level: 'mid', scenario: '对老师讲的内容会认真听，但不会额外查找相关资料', observationGuide: '观察孩子课堂内外的学习延伸程度', parentAction: '推荐相关课外资源，鼓励自主探索', keywords: ['课堂', '延伸', '被动'] },
]

/** 探究力(I) - 25个具体场景 */
export const I_SCENARIOS: DimensionScenario[] = [
  // High level
  { dimension: 'I', dimensionName: '探究力', level: 'high', scenario: '做作业时会自己检查错误并分析原因，不只是改正答案', observationGuide: '观察孩子的自我纠错能力和分析深度', parentAction: '鼓励孩子讲解错题思路，强化探究习惯', keywords: ['检查', '分析', '纠错'] },
  { dimension: 'I', dimensionName: '探究力', level: 'high', scenario: '遇到不会的问题会自己查资料、想办法，而不是立刻问大人', observationGuide: '观察孩子解决问题的主动性', parentAction: '提供查资料的工具和方法，适当给予提示', keywords: ['自主', '解决', '查资料'] },
  { dimension: 'I', dimensionName: '探究力', level: 'high', scenario: '对感兴趣的事物会做深入研究，甚至自己写"研究报告"', observationGuide: '观察孩子的研究深度和持续性', parentAction: '提供研究素材，认可孩子的研究成果', keywords: ['研究', '深入', '报告'] },
  { dimension: 'I', dimensionName: '探究力', level: 'high', scenario: '会设计简单的对比实验来验证自己的想法', observationGuide: '观察孩子是否具备实验设计思维', parentAction: '提供实验材料，陪同进行安全实验', keywords: ['实验', '验证', '设计'] },
  { dimension: 'I', dimensionName: '探究力', level: 'high', scenario: '对数据敏感，会记录天气、温度等并分析变化规律', observationGuide: '观察孩子对数据收集和分析的兴趣', parentAction: '提供记录工具，一起分析数据趋势', keywords: ['数据', '记录', '分析'] },
  { dimension: 'I', dimensionName: '探究力', level: 'high', scenario: '玩科学类游戏时会研究游戏机制和技巧，不只是瞎玩', observationGuide: '观察孩子是否能从游戏中提取知识', parentAction: '引导将游戏策略应用到现实学习', keywords: ['策略', '研究', '游戏'] },
  { dimension: 'I', dimensionName: '探究力', level: 'high', scenario: '会质疑"标准答案"，提出"有没有其他可能？"', observationGuide: '观察孩子的批判性思维', parentAction: '肯定孩子的质疑精神，一起探讨可能性', keywords: ['质疑', '思考', '批判'] },
  { dimension: 'I', dimensionName: '探究力', level: 'high', scenario: '参观科技馆后会反复思考展品原理，甚至想自己做一个', observationGuide: '观察孩子从参观到实践的转化能力', parentAction: '提供制作材料，鼓励动手尝试', keywords: ['科技馆', '原理', '动手'] },
  // Mid level
  { dimension: 'I', dimensionName: '探究力', level: 'mid', scenario: '会尝试解决问题，但方法不对时会放弃', observationGuide: '观察孩子的抗挫折能力和方法调整', parentAction: '引导分析失败原因，调整尝试策略', keywords: ['尝试', '放弃', '调整'] },
  { dimension: 'I', dimensionName: '探究力', level: 'mid', scenario: '对感兴趣的事会研究，但只停留在表面', observationGuide: '观察孩子的探究深度', parentAction: '追问"为什么"，引导深入思考', keywords: ['表面', '兴趣', '深度'] },
  { dimension: 'I', dimensionName: '探究力', level: 'mid', scenario: '会做实验但需要大人指导，自己不敢独立完成', observationGuide: '观察孩子的独立操作能力', parentAction: '逐步减少指导，鼓励独立完成', keywords: ['指导', '依赖', '独立'] },
  // Low level
  { dimension: 'I', dimensionName: '探究力', level: 'low', scenario: '遇到问题第一反应是问大人，而不是自己思考', observationGuide: '观察孩子的依赖程度', parentAction: '先让孩子自己思考，再提供帮助', keywords: ['依赖', '提问', '思考'] },
  { dimension: 'I', dimensionName: '探究力', level: 'low', scenario: '对"为什么会这样"的问题不太关心，得到答案就满足', observationGuide: '观察孩子对原因的兴趣程度', parentAction: '多问"为什么"，启发思考', keywords: ['接受', '表面', '满足'] },
  { dimension: 'I', dimensionName: '探究力', level: 'low', scenario: '更愿意按步骤操作，不喜欢需要自己设计方案的 task', observationGuide: '观察孩子对开放性任务的态度', parentAction: '从有明确步骤的任务开始，逐步增加开放性', keywords: ['步骤', '操作', '封闭'] },
  // Additional
  { dimension: 'I', dimensionName: '探究力', level: 'high', scenario: '在户外玩时会收集树叶、石头等"样本"，说要带回家研究', observationGuide: '观察孩子对自然的探究方式', parentAction: '提供收纳工具，一起做"标本"', keywords: ['收集', '样本', '研究'] },
  { dimension: 'I', dimensionName: '探究力', level: 'high', scenario: '会用手机拍照记录观察对象，事后翻看并回忆细节', observationGuide: '观察孩子是否有系统的观察方法', parentAction: '一起整理观察记录，建立探究档案', keywords: ['记录', '照片', '回忆'] },
  { dimension: 'I', dimensionName: '探究力', level: 'mid', scenario: '做数学题会尝试不同方法，但不知道哪种最好', observationGuide: '观察孩子的方法多样性', parentAction: '引导比较不同方法的优劣', keywords: ['方法', '尝试', '比较'] },
  { dimension: 'I', dimensionName: '探究力', level: 'high', scenario: '对新闻中报道的奇怪现象会主动搜索了解背景', observationGuide: '观察孩子对时事科学的敏感度', parentAction: '一起搜索讨论，培养信息素养', keywords: ['新闻', '搜索', '背景'] },
  { dimension: 'I', dimensionName: '探究力', level: 'mid', scenario: '会做简单的科学小实验，但不太会自己设计', observationGuide: '观察孩子是"执行者"还是"设计者"', parentAction: '提供实验设计模板，鼓励改动创新', keywords: ['执行', '设计', '模板'] },
  { dimension: 'I', dimensionName: '探究力', level: 'low', scenario: '对错误答案不太关心改对了就行，不分析原因', observationGuide: '观察孩子对错误的处理方式', parentAction: '要求讲解错题，分析错误类型', keywords: ['错误', '改正', '分析'] },
  { dimension: 'I', dimensionName: '探究力', level: 'high', scenario: '在旅游时会主动了解当地文化和自然特征，不是只拍照打卡', observationGuide: '观察孩子的学习迁移能力', parentAction: '提前做功课，旅中旅后讨论学习', keywords: ['旅游', '文化', '学习'] },
  { dimension: 'I', dimensionName: '探究力', level: 'mid', scenario: '对感兴趣的学科会主动多做练习，但不感兴趣的就不碰', observationGuide: '观察孩子的学科偏好和探究主动性', parentAction: '发现兴趣与学科的连接点', keywords: ['学科', '兴趣', '偏好'] },
  { dimension: 'I', dimensionName: '探究力', level: 'high', scenario: '会自己上网搜索教程学习新技能（如魔方、编程）', observationGuide: '观察孩子的自主学习能力', parentAction: '提供学习资源和时间，适度指导', keywords: ['搜索', '自学', '技能'] },
  { dimension: 'I', dimensionName: '探究力', level: 'low', scenario: '看书只看故事，对科普知识类书籍不感兴趣', observationGuide: '观察孩子的阅读偏好偏向', parentAction: '从故事化科普开始，培养科学兴趣', keywords: ['故事', '科普', '偏好'] },
  { dimension: 'I', dimensionName: '探究力', level: 'mid', scenario: '会记录数据但不太会分析数据背后的含义', observationGuide: '观察数据处理能力的完整性', parentAction: '引导思考数据变化的可能原因', keywords: ['记录', '分析', '思考'] },
]

/** 连接力(L) - 25个具体场景 */
export const L_SCENARIOS: DimensionScenario[] = [
  // High level
  { dimension: 'L', dimensionName: '连接力', level: 'high', scenario: '能快速认识新朋友，并且会主动介绍给其他小朋友认识', observationGuide: '观察孩子的社交主动性和连接能力', parentAction: '创造更多社交机会，认可孩子的社交能力', keywords: ['认识', '介绍', '主动'] },
  { dimension: 'L', dimensionName: '连接力', level: 'high', scenario: '会把学到的知识讲给家人朋友听，能把复杂的事情说清楚', observationGuide: '观察孩子的知识分享能力和表达清晰度', parentAction: '给孩子讲解的机会，认可"小老师"角色', keywords: ['分享', '讲解', '表达'] },
  { dimension: 'L', dimensionName: '连接力', level: 'high', scenario: '看到不同事物会联想到它们之间的联系，如"蜘蛛网和渔网很像"', observationGuide: '观察孩子的类比和关联思维能力', parentAction: '鼓励孩子分享联想，一起讨论联系', keywords: ['联想', '类比', '关联'] },
  { dimension: 'L', dimensionName: '连接力', level: 'high', scenario: '在团队活动中会主动配合他人，也能带动气氛', observationGuide: '观察孩子在团队中的角色定位', parentAction: '提供团队活动机会，认可协作贡献', keywords: ['配合', '带动', '团队'] },
  { dimension: 'L', dimensionName: '连接力', level: 'high', scenario: '会把学校学的内容和生活中看到的现象联系起来', observationGuide: '观察孩子的知识迁移和应用能力', parentAction: '引导发现生活中的知识应用实例', keywords: ['迁移', '应用', '生活'] },
  { dimension: 'L', dimensionName: '连接力', level: 'high', scenario: '喜欢把有趣的事情分享给朋友，能交到很多好朋友', observationGuide: '观察孩子的分享行为和社交圈', parentAction: '鼓励分享，创造分享机会', keywords: ['分享', '社交', '朋友'] },
  { dimension: 'L', dimensionName: '连接力', level: 'high', scenario: '能理解不同人的观点，会说"我觉得他这样想也有道理"', observationGuide: '观察孩子的换位思考能力', parentAction: '讨论不同人物的观点，培养同理心', keywords: ['观点', '换位', '理解'] },
  { dimension: 'L', dimensionName: '连接力', level: 'high', scenario: '会组织小伙伴一起玩，主动分配角色和任务', observationGuide: '观察孩子的领导力和组织能力', parentAction: '提供组织活动的机会，适度指导', keywords: ['组织', '分配', '领导'] },
  // Mid level
  { dimension: 'L', dimensionName: '连接力', level: 'mid', scenario: '在熟悉的圈子里很活跃，但遇到陌生人会害羞', observationGuide: '观察孩子在不同社交场景的表现差异', parentAction: '在安全环境下逐步接触新朋友', keywords: ['熟悉', '害羞', '渐进'] },
  { dimension: 'L', dimensionName: '连接力', level: 'mid', scenario: '愿意配合团队工作，但不太会主动发起协作', observationGuide: '观察孩子的协作主动性', parentAction: '鼓励主动承担团队任务', keywords: ['配合', '被动', '协作'] },
  { dimension: 'L', dimensionName: '连接力', level: 'mid', scenario: '有自己的朋友圈但圈子较小，不善于扩大社交范围', observationGuide: '观察孩子的社交圈大小', parentAction: '创造与不同年龄孩子互动的机会', keywords: ['圈子', '小', '扩展'] },
  // Low level
  { dimension: 'L', dimensionName: '连接力', level: 'low', scenario: '更喜欢独自玩耍，对集体活动兴趣一般', observationGuide: '观察孩子对社交活动的偏好', parentAction: '从一对一活动开始，逐步增加人数', keywords: ['独自', '集体', '偏好'] },
  { dimension: 'L', dimensionName: '连接力', level: 'low', scenario: '不太会表达自己的观点，说不到点子上', observationGuide: '观察孩子的观点表达清晰度', parentAction: '多与孩子讨论，鼓励表达', keywords: ['表达', '观点', '锻炼'] },
  { dimension: 'L', dimensionName: '连接力', level: 'low', scenario: '在团队中容易被人影响，不太坚持自己的想法', observationGuide: '观察孩子在团队中的独立思考能力', parentAction: '鼓励表达观点，认可独特想法', keywords: ['影响', '从众', '独立'] },
  // Additional
  { dimension: 'L', dimensionName: '连接力', level: 'high', scenario: '会把自己的玩具/书借给朋友，分享意识很强', observationGuide: '观察孩子的分享行为', parentAction: '肯定分享行为，建立分享的正向循环', keywords: ['分享', '借出', '大方'] },
  { dimension: 'L', dimensionName: '连接力', level: 'high', scenario: '能听懂笑话的言外之意，会心一笑', observationGuide: '观察孩子的理解深度', parentAction: '多讲有深度的笑话，培养理解力', keywords: ['理解', '幽默', '深度'] },
  { dimension: 'L', dimensionName: '连接力', level: 'mid', scenario: '会帮助其他小朋友，但不太会主动寻求帮助', observationGuide: '观察孩子的互助行为', parentAction: '鼓励互助，也接受他人帮助', keywords: ['帮助', '单向', '互助'] },
  { dimension: 'L', dimensionName: '连接力', level: 'high', scenario: '能理解老师的教学意图，主动配合课堂互动', observationGuide: '观察孩子对权威的连接能力', parentAction: '与老师沟通，了解课堂表现', keywords: ['配合', '课堂', '理解'] },
  { dimension: 'L', dimensionName: '连接力', level: 'mid', scenario: '对不熟悉的话题无法参与讨论，需要引导', observationGuide: '观察孩子的知识面和适应能力', parentAction: '拓宽知识面，提供背景信息', keywords: ['话题', '适应', '引导'] },
  { dimension: 'L', dimensionName: '连接力', level: 'low', scenario: '在游戏中更愿意当"执行者"而非"策划者"', observationGuide: '观察孩子在游戏中的角色偏好', parentAction: '鼓励尝试策划，认可策划成果', keywords: ['执行', '策划', '角色'] },
  { dimension: 'L', dimensionName: '连接力', level: 'high', scenario: '会关心不在场的朋友，能记住朋友的喜好', observationGuide: '观察孩子的情感记忆能力', parentAction: '讨论朋友话题，强化情感连接', keywords: ['关心', '记忆', '情感'] },
  { dimension: 'L', dimensionName: '连接力', level: 'mid', scenario: '会参与讨论但容易被带跑，需要加强独立判断', observationGuide: '观察孩子的独立思考能力', parentAction: '讨论时引导形成自己的观点', keywords: ['讨论', '从众', '独立'] },
  { dimension: 'L', dimensionName: '连接力', level: 'high', scenario: '能把一个学科的概念与其他学科联系起来', observationGuide: '观察孩子的跨学科思维能力', parentAction: '多问"这个和XX有什么联系？"', keywords: ['跨学科', '联系', '整合'] },
  { dimension: 'L', dimensionName: '连接力', level: 'low', scenario: '不太理解别人的情绪变化，不知道什么时候该安静', observationGuide: '观察孩子的情绪感知能力', parentAction: '教孩子识别情绪信号', keywords: ['情绪', '感知', '社交'] },
  { dimension: 'L', dimensionName: '连接力', level: 'mid', scenario: '能参与团队活动但不太主动承担核心角色', observationGuide: '观察孩子的团队角色定位', parentAction: '鼓励尝试领导角色', keywords: ['团队', '核心', '角色'] },
]

/** 设计力(D) - 25个具体场景 */
export const D_SCENARIOS: DimensionScenario[] = [
  // High level
  { dimension: 'D', dimensionName: '设计力', level: 'high', scenario: '玩乐高/积木时会先想好要搭什么，然后按步骤搭建', observationGuide: '观察孩子的规划性和执行力', parentAction: '提供更多建构类玩具，认可设计成果', keywords: ['规划', '步骤', '执行'] },
  { dimension: 'D', dimensionName: '设计力', level: 'high', scenario: '会自己制定学习计划表，并且尽量按计划执行', observationGuide: '观察孩子的自我管理能力', parentAction: '帮助制定可行计划，适时提醒', keywords: ['计划', '执行', '管理'] },
  { dimension: 'D', dimensionName: '设计力', level: 'high', scenario: '做事有先后顺序，知道先做什么再做什么', observationGuide: '观察孩子的时间管理和优先级判断', parentAction: '日常事务中练习排序', keywords: ['顺序', '排序', '逻辑'] },
  { dimension: 'D', dimensionName: '设计力', level: 'high', scenario: '会自己整理书包和房间，东西摆放有条理', observationGuide: '观察孩子的物品整理能力', parentAction: '提供整理工具，建立整理习惯', keywords: ['整理', '条理', '收纳'] },
  { dimension: 'D', dimensionName: '设计力', level: 'high', scenario: '遇到问题会列出可能的解决方案，然后逐一尝试', observationGuide: '观察孩子的方案思考能力', parentAction: '鼓励列出方案，讨论可行性', keywords: ['方案', '尝试', '解决'] },
  { dimension: 'D', dimensionName: '设计力', level: 'high', scenario: '会自己安排课余时间，学习和玩的时间分配合理', observationGuide: '观察孩子的时间分配能力', parentAction: '给予自主空间，适度监督', keywords: ['安排', '分配', '自主'] },
  { dimension: 'D', dimensionName: '设计力', level: 'high', scenario: '做手工/画画前会先想好要做什么，而不是边做边想', observationGuide: '观察孩子的预想规划能力', parentAction: '鼓励先想后做，认可规划', keywords: ['预想', '规划', '手工'] },
  { dimension: 'D', dimensionName: '设计力', level: 'high', scenario: '会给自己设定目标，并想办法达成', observationGuide: '观察孩子的目标设定和追求能力', parentAction: '帮助设定合理目标，追踪进度', keywords: ['目标', '达成', '追求'] },
  // Mid level
  { dimension: 'D', dimensionName: '设计力', level: 'mid', scenario: '有想法但执行时容易虎头蛇尾，坚持不下来', observationGuide: '观察孩子的执行力持久性', parentAction: '将大目标分解为小目标', keywords: ['执行', '坚持', '分解'] },
  { dimension: 'D', dimensionName: '设计力', level: 'mid', scenario: '会做一些计划但需要大人提醒才能执行', observationGuide: '观察孩子的计划执行依赖度', parentAction: '逐步减少提醒，培养自律', keywords: ['提醒', '依赖', '自律'] },
  { dimension: 'D', dimensionName: '设计力', level: 'mid', scenario: '做事有想法但顺序比较混乱，需要整理', observationGuide: '观察孩子的条理性', parentAction: '引导梳理步骤，建立条理', keywords: ['顺序', '条理', '引导'] },
  // Low level
  { dimension: 'D', dimensionName: '设计力', level: 'low', scenario: '做事没有计划性，拿到什么做什么', observationGuide: '观察孩子的随意性', parentAction: '从简单计划开始练习', keywords: ['随意', '计划', '无序'] },
  { dimension: 'D', dimensionName: '设计力', level: 'low', scenario: '东西经常乱放，需要用时找不到', observationGuide: '观察孩子的物品管理能力', parentAction: '建立固定位置，养成归位习惯', keywords: ['乱放', '找不到', '归位'] },
  { dimension: 'D', dimensionName: '设计力', level: 'low', scenario: '面对复杂任务不知道从哪里开始', observationGuide: '观察孩子的任务分解能力', parentAction: '帮助分解任务，先做第一步', keywords: ['复杂', '分解', '开始'] },
  // Additional
  { dimension: 'D', dimensionName: '设计力', level: 'high', scenario: '玩游戏时会制定"战术"，分配每个人的任务', observationGuide: '观察孩子的策略思维', parentAction: '讨论游戏策略，强化规划意识', keywords: ['战术', '策略', '分配'] },
  { dimension: 'D', dimensionName: '设计力', level: 'high', scenario: '会自己制作简单的待办事项清单，并打勾完成', observationGuide: '观察孩子的工具使用能力', parentAction: '提供清单工具，认可完成情况', keywords: ['清单', '工具', '完成'] },
  { dimension: 'D', dimensionName: '设计力', level: 'mid', scenario: '能完成大人布置的任务，但不会自己找事做', observationGuide: '观察孩子的主动性', parentAction: '鼓励发现可以做的事', keywords: ['被动', '布置', '主动'] },
  { dimension: 'D', dimensionName: '设计力', level: 'high', scenario: '会利用碎片时间，不会让时间空转', observationGuide: '观察孩子的时间利用效率', parentAction: '讨论时间管理，提供时间工具', keywords: ['时间', '效率', '利用'] },
  { dimension: 'D', dimensionName: '设计力', level: 'mid', scenario: '有改进想法但不知道如何表达和实施', observationGuide: '观察孩子的创新实施能力', parentAction: '引导将想法具体化', keywords: ['想法', '实施', '具体化'] },
  { dimension: 'D', dimensionName: '设计力', level: 'low', scenario: '对需要长期坚持的任务容易中途放弃', observationGuide: '观察孩子的坚持性', parentAction: '将长期目标可视化，阶段性奖励', keywords: ['放弃', '坚持', '长期'] },
  { dimension: 'D', dimensionName: '设计力', level: 'high', scenario: '会提前准备明天要用的东西，有备无患', observationGuide: '观察孩子的预见性', parentAction: '建立睡前准备routine', keywords: ['准备', '预见', '习惯'] },
  { dimension: 'D', dimensionName: '设计力', level: 'mid', scenario: '做事容易受情绪影响，情绪好时效率高，情绪差时停滞', observationGuide: '观察情绪对执行的影响', parentAction: '帮助情绪管理，减少情绪波动对效率的影响', keywords: ['情绪', '效率', '管理'] },
  { dimension: 'D', dimensionName: '设计力', level: 'high', scenario: '会复盘自己的行为，总结哪里做得好哪里需要改', observationGuide: '观察孩子的反思改进能力', parentAction: '定期一起复盘，强化改进意识', keywords: ['复盘', '总结', '改进'] },
  { dimension: 'D', dimensionName: '设计力', level: 'low', scenario: '面对选择时会纠结，不知道该选哪个', observationGuide: '观察孩子的决策能力', parentAction: '帮助建立决策标准，减少纠结', keywords: ['纠结', '选择', '决策'] },
  { dimension: 'D', dimensionName: '设计力', level: 'mid', scenario: '会尝试新方法但遇到困难就回到老方法', observationGuide: '观察孩子的创新坚持性', parentAction: '鼓励坚持新方法，提供支持', keywords: ['新方法', '困难', '坚持'] },
]

/** 表达力(E) - 25个具体场景 */
export const E_SCENARIOS: DimensionScenario[] = [
  // High level
  { dimension: 'E', dimensionName: '表达力', level: 'high', scenario: '能把自己的想法清晰地说出来，别人一听就懂', observationGuide: '观察孩子的语言清晰度', parentAction: '多与孩子对话，创造表达机会', keywords: ['清晰', '表达', '理解'] },
  { dimension: 'E', dimensionName: '表达力', level: 'high', scenario: '喜欢在人前展示自己，不怯场', observationGuide: '观察孩子的表现欲和自信心', parentAction: '提供展示平台，认可展示成果', keywords: ['展示', '自信', '表现'] },
  { dimension: 'E', dimensionName: '表达力', level: 'high', scenario: '讲故事时会有声有色，吸引听众注意力', observationGuide: '观察孩子的叙述技巧', parentAction: '鼓励讲故事，认可创意', keywords: ['故事', '生动', '吸引'] },
  { dimension: 'E', dimensionName: '表达力', level: 'high', scenario: '能很快记住歌词或台词，朗读流畅', observationGuide: '观察孩子的语言记忆能力', parentAction: '提供朗诵/表演机会', keywords: ['记忆', '朗读', '表演'] },
  { dimension: 'E', dimensionName: '表达力', level: 'high', scenario: '写作文/日记时内容丰富，不会没话写', observationGuide: '观察孩子的书面表达能力', parentAction: '鼓励写作，提供写作主题', keywords: ['写作', '丰富', '内容'] },
  { dimension: 'E', dimensionName: '表达力', level: 'high', scenario: '会用表情、动作辅助表达，让交流更生动', observationGuide: '观察孩子的多模态表达能力', parentAction: '肯定肢体语言的积极作用', keywords: ['表情', '动作', '生动'] },
  { dimension: 'E', dimensionName: '表达力', level: 'high', scenario: '能说服同伴接受自己的想法，有一定影响力', observationGuide: '观察孩子的说服能力', parentAction: '讨论说服技巧，实践说服', keywords: ['说服', '影响', '观点'] },
  { dimension: 'E', dimensionName: '表达力', level: 'high', scenario: '会把自己的作品（画、手工）讲解给大人听', observationGuide: '观察孩子的作品解读能力', parentAction: '认真聆听孩子的讲解', keywords: ['讲解', '作品', '解读'] },
  // Mid level
  { dimension: 'E', dimensionName: '表达力', level: 'mid', scenario: '能表达基本想法，但不太会展开详细内容', observationGuide: '观察孩子的表达深度', parentAction: '追问"后来呢""然后呢"引导展开', keywords: ['简单', '展开', '深度'] },
  { dimension: 'E', dimensionName: '表达力', level: 'mid', scenario: '在熟悉的人面前表达流畅，在陌生人面前会紧张', observationGuide: '观察孩子在不同场合的表达差异', parentAction: '创造在陌生人面前表达的练习机会', keywords: ['熟悉', '紧张', '场合'] },
  { dimension: 'E', dimensionName: '表达力', level: 'mid', scenario: '会写但不太会说，书面和口头表达有差距', observationGuide: '观察孩子表达的渠道偏好', parentAction: '多进行口头表达练习', keywords: ['书面', '口头', '差异'] },
  // Low level
  { dimension: 'E', dimensionName: '表达力', level: 'low', scenario: '不太愿意在多人面前说话，会脸红', observationGuide: '观察孩子的公众表达恐惧', parentAction: '从小型小组开始，逐步增加人数', keywords: ['公众', '脸红', '恐惧'] },
  { dimension: 'E', dimensionName: '表达力', level: 'low', scenario: '想说的话说不出来，干着急', observationGuide: '观察孩子的表达障碍', parentAction: '提供表达模板，降低表达难度', keywords: ['说不出来', '着急', '障碍'] },
  { dimension: 'E', dimensionName: '表达力', level: 'low', scenario: '表达缺乏重点，别人听半天不知道想说什么', observationGuide: '观察孩子的表达逻辑性', parentAction: '教"总-分-总"表达结构', keywords: ['逻辑', '重点', '结构'] },
  // Additional
  { dimension: 'E', dimensionName: '表达力', level: 'high', scenario: '能根据不同对象调整说话方式，对不同人用不同语气', observationGuide: '观察孩子的表达适应性', parentAction: '讨论不同场合的表达差异', keywords: ['对象', '调整', '适应'] },
  { dimension: 'E', dimensionName: '表达力', level: 'high', scenario: '会用画画/音乐等方式表达情感，不只是语言', observationGuide: '观察孩子的多渠道表达能力', parentAction: '提供多元表达工具', keywords: ['画画', '音乐', '多元'] },
  { dimension: 'E', dimensionName: '表达力', level: 'mid', scenario: '能回答问题但不会主动发起对话', observationGuide: '观察孩子的表达主动性', parentAction: '鼓励主动发起对话', keywords: ['回答', '主动', '对话'] },
  { dimension: 'E', dimensionName: '表达力', level: 'high', scenario: '在班级/小组讨论时能清晰表达观点，被同学认可', observationGuide: '观察孩子在小团体中的表达影响力', parentAction: '认可在团队讨论中的贡献', keywords: ['讨论', '观点', '认可'] },
  { dimension: 'E', dimensionName: '表达力', level: 'mid', scenario: '表达时容易紧张，需要时间组织语言', observationGuide: '观察孩子的即兴表达能力', parentAction: '给予准备时间，练习即兴表达', keywords: ['紧张', '组织', '即兴'] },
  { dimension: 'E', dimensionName: '表达力', level: 'low', scenario: '对提问的回答很简短，"嗯""啊"较多', observationGuide: '观察孩子的回应丰富度', parentAction: '引导完整回答问题', keywords: ['简短', '回应', '丰富'] },
  { dimension: 'E', dimensionName: '表达力', level: 'high', scenario: '能把自己的情绪用语言表达出来，不只是哭闹', observationGuide: '观察孩子的情绪表达能力', parentAction: '肯定情绪表达，鼓励语言描述情绪', keywords: ['情绪', '语言', '描述'] },
  { dimension: 'E', dimensionName: '表达力', level: 'mid', scenario: '写的东西比较平实，不太会用修辞手法', observationGuide: '观察孩子的文字表达技巧', parentAction: '引入修辞手法，模仿练习', keywords: ['平实', '修辞', '技巧'] },
  { dimension: 'E', dimensionName: '表达力', level: 'high', scenario: '会讲笑话或编有趣的故事，逗得大家开心', observationGuide: '观察孩子的幽默表达能力', parentAction: '鼓励创作幽默内容', keywords: ['幽默', '笑话', '创意'] },
  { dimension: 'E', dimensionName: '表达力', level: 'mid', scenario: '能理解复杂的指令，但表达自己想法时有困难', observationGuide: '观察孩子理解与表达的差异', parentAction: '练习把理解的内容用自己的话复述', keywords: ['理解', '复述', '转化'] },
  { dimension: 'E', dimensionName: '表达力', level: 'low', scenario: '不太会用语言描述看到的场景或物品', observationGuide: '观察孩子的观察描述能力', parentAction: '玩"描述物品"游戏', keywords: ['描述', '观察', '场景'] },
]

/** 反思力(R) - 25个具体场景 */
export const R_SCENARIOS: DimensionScenario[] = [
  // High level
  { dimension: 'R', dimensionName: '反思力', level: 'high', scenario: '考试后会主动分析错题原因，而不是只关心分数', observationGuide: '观察孩子的考试反思行为', parentAction: '一起分析错题，讨论改进措施', keywords: ['错题', '分析', '改进'] },
  { dimension: 'R', dimensionName: '反思力', level: 'high', scenario: '做错事后会主动承认，并说"下次我会改"', observationGuide: '观察孩子的错误承认和改正意愿', parentAction: '肯定认错行为，共同制定改正计划', keywords: ['承认', '改正', '责任'] },
  { dimension: 'R', dimensionName: '反思力', level: 'high', scenario: '能说出自己做得好的地方和做得不好的地方', observationGuide: '观察孩子的自我评价能力', parentAction: '引导全面客观的自我评价', keywords: ['评价', '好坏', '客观'] },
  { dimension: 'R', dimensionName: '反思力', level: 'high', scenario: '会思考"今天学到了什么"，能总结一天收获', observationGuide: '观察孩子的日常反思习惯', parentAction: '建立睡前回顾的习惯', keywords: ['总结', '收获', '回顾'] },
  { dimension: 'R', dimensionName: '反思力', level: 'high', scenario: '面对失败会想"哪里出了问题"而不是"我不行"', observationGuide: '观察孩子对失败的反应模式', parentAction: '强调过程和努力，淡化结果', keywords: ['失败', '归因', '成长'] },
  { dimension: 'R', dimensionName: '反思力', level: 'high', scenario: '会听取别人对自己的评价，认真思考对不对', observationGuide: '观察孩子对反馈的接受度', parentAction: '提供建设性反馈，引导理性思考', keywords: ['反馈', '接受', '思考'] },
  { dimension: 'R', dimensionName: '反思力', level: 'high', scenario: '玩策略游戏后会复盘，思考哪些地方可以改进', observationGuide: '观察孩子的游戏复盘行为', parentAction: '一起讨论改进策略', keywords: ['复盘', '策略', '改进'] },
  { dimension: 'R', dimensionName: '反思力', level: 'high', scenario: '能制定改进计划并坚持执行一段时间', observationGuide: '观察孩子的计划执行持续性', parentAction: '定期检查计划执行情况，适时调整', keywords: ['计划', '执行', '坚持'] },
  // Mid level
  { dimension: 'R', dimensionName: '反思力', level: 'mid', scenario: '会被动反思，大人问时才想起来分析', observationGuide: '观察孩子的主动反思意识', parentAction: '逐步培养主动反思的习惯', keywords: ['被动', '引导', '主动'] },
  { dimension: 'R', dimensionName: '反思力', level: 'mid', scenario: '能认识到自己的问题，但改起来需要时间', observationGuide: '观察孩子的知行合一程度', parentAction: '给予耐心，提供具体改进行动', keywords: ['认识', '行动', '时间'] },
  { dimension: 'R', dimensionName: '反思力', level: 'mid', scenario: '反思时容易找客观理由，较少从自身找原因', observationGuide: '观察孩子的归因模式', parentAction: '引导既看客观也看主观', keywords: ['归因', '客观', '主观'] },
  // Low level
  { dimension: 'R', dimensionName: '反思力', level: 'low', scenario: '对批评反应激烈，不太愿意承认错误', observationGuide: '观察孩子对批评的反应', parentAction: '先肯定再建议，减少防御', keywords: ['批评', '防御', '承认'] },
  { dimension: 'R', dimensionName: '反思力', level: 'low', scenario: '做错事也不太当回事，很快忘记', observationGuide: '观察孩子对错误的重视程度', parentAction: '帮助建立错误档案，定期回顾', keywords: ['错误', '重视', '记忆'] },
  { dimension: 'R', dimensionName: '反思力', level: 'low', scenario: '问"今天怎么样"时回答"还行"，没有具体内容', observationGuide: '观察孩子的反思深度', parentAction: '提供具体反思问题，引导思考', keywords: ['表面', '具体', '深度'] },
  // Additional
  { dimension: 'R', dimensionName: '反思力', level: 'high', scenario: '会写日记记录自己的心情和想法', observationGuide: '观察孩子的自我记录习惯', parentAction: '提供日记本，尊重隐私', keywords: ['日记', '记录', '心情'] },
  { dimension: 'R', dimensionName: '反思力', level: 'high', scenario: '能理解自己情绪产生的原因，不只是"生气"', observationGuide: '观察孩子的情绪认知深度', parentAction: '讨论情绪背后的原因', keywords: ['情绪', '原因', '理解'] },
  { dimension: 'R', dimensionName: '反思力', level: 'mid', scenario: '需要通过对比才能发现问题，自己发现不了', observationGuide: '观察孩子的自我觉察能力', parentAction: '提供对比参照', keywords: ['对比', '参照', '觉察'] },
  { dimension: 'R', dimensionName: '反思力', level: 'high', scenario: '完成项目后会回顾过程，思考下次如何做得更好', observationGuide: '观察孩子的项目复盘能力', parentAction: '一起做项目复盘', keywords: ['项目', '复盘', '改进'] },
  { dimension: 'R', dimensionName: '反思力', level: 'mid', scenario: '能听取建议但不一定照做，需要提醒', observationGuide: '观察孩子对建议的采纳程度', parentAction: '跟进建议执行情况', keywords: ['建议', '采纳', '提醒'] },
  { dimension: 'R', dimensionName: '反思力', level: 'low', scenario: '成功了认为是运气，失败了认为是自己笨', observationGuide: '观察孩子的归因模式', parentAction: '帮助建立成长型归因', keywords: ['归因', '固定', '成长'] },
  { dimension: 'R', dimensionName: '反思力', level: 'high', scenario: '会设定个人成长目标，并定期检查进度', observationGuide: '观察孩子的目标追踪能力', parentAction: '一起制定和检查目标', keywords: ['目标', '进度', '追踪'] },
  { dimension: 'R', dimensionName: '反思力', level: 'mid', scenario: '反思内容较笼统，不够具体', observationGuide: '观察孩子的反思具体性', parentAction: '引导具体化反思内容', keywords: ['笼统', '具体', '引导'] },
  { dimension: 'R', dimensionName: '反思力', level: 'high', scenario: '能从错误中学习，同样的错误不会犯第二次', observationGuide: '观察孩子的错误学习能力', parentAction: '建立错误学习档案', keywords: ['错误', '学习', '避免'] },
  { dimension: 'R', dimensionName: '反思力', level: 'mid', scenario: '反思后行动力不足，想到了但做不到', observationGuide: '观察孩子的知行转化能力', parentAction: '将反思结果具体化为行动步骤', keywords: ['行动', '转化', '步骤'] },
  { dimension: 'R', dimensionName: '反思力', level: 'low', scenario: '不太关心自己的行为对别人的影响', observationGuide: '观察孩子的行为后果意识', parentAction: '讨论行为的影响，建立后果意识', keywords: ['影响', '后果', '意识'] },
]

/** 所有维度场景的汇总 */
export const ALL_DIMENSION_SCENARIOS: Record<WilderDimension, DimensionScenario[]> = {
  W: W_SCENARIOS,
  I: I_SCENARIOS,
  L: L_SCENARIOS,
  D: D_SCENARIOS,
  E: E_SCENARIOS,
  R: R_SCENARIOS,
}

// ===================================================================
// P0-2: 反直觉发现模块
// ===================================================================

/** 反直觉发现类型 */
export interface CounterIntuitiveFinding {
  id: string
  type: 'surprise' | 'paradox' | 'potential' | 'blindspot'
  title: string
  titleEn: string
  description: string
  evidence: string
  implication: string
  action: string
  confidence: number
}

/** 生成反直觉发现 */
export function generateCounterIntuitiveFindings(
  wilderScores: Record<WilderDimension, number>,
  dimension: WilderDimension
): CounterIntuitiveFinding[] {
  const findings: CounterIntuitiveFinding[] = []
  const score = wilderScores[dimension]

  // 基于不同场景生成反直觉发现
  if (dimension === 'W') {
    if (score < 50) {
      findings.push({
        id: 'W-para-1',
        type: 'paradox',
        title: '安静的孩子可能只是"选择性好奇"',
        titleEn: 'Quiet kids may just be "selectively curious"',
        description: '表面看来孩子对科学探索不感兴趣，但可能只是在等待一个真正触动TA的话题。',
        evidence: '当涉及孩子真正关心的领域（如游戏、动物）时，孩子会展现出强烈的好奇心。',
        implication: '这不是好奇心不足，而是尚未找到与孩子内在驱动力连接的方式。',
        action: '观察孩子自发关注的领域，从那里切入科学探索。',
        confidence: 75,
      })
    }
    if (score > 70) {
      findings.push({
        id: 'W-poten-1',
        type: 'potential',
        title: '过度好奇可能是逃避深度学习的信号',
        titleEn: 'Over-curiosity may be a signal of avoiding deep learning',
        description: '孩子对一切都好奇，但每件事都浅尝辄止，这可能是一种"注意力分散"的表现。',
        evidence: '孩子频繁换话题，无法在一个问题上深入超过2-3分钟。',
        implication: '需要培养"持续探究"的习惯，而非单纯增加好奇心。',
        action: '与孩子约定一个主题，深入研究一周，再换下一个。',
        confidence: 65,
      })
    }
  }

  if (dimension === 'I') {
    if (score > 80) {
      findings.push({
        id: 'I-blind-1',
        type: 'blindspot',
        title: '"打破砂锅问到底"可能影响社交',
        titleEn: '"Getting to the bottom" may affect social interactions',
        description: '过度追求答案的准确性可能在社交场景中显得"较真"或"无趣"。',
        evidence: '孩子在与同伴讨论时经常纠正他人的"小错误"，导致朋友较少。',
        implication: '探究力需要与社交智慧平衡发展。',
        action: '教孩子在适当场合"放下问题"，维护社交关系。',
        confidence: 70,
      })
    }
  }

  if (dimension === 'L') {
    if (score < 40) {
      findings.push({
        id: 'L-supp-1',
        type: 'surprise',
        title: '"独行侠"可能是深度思考者',
        titleEn: '"Lone wolf" may be a deep thinker',
        description: '孩子不喜欢社交可能不是"不会"，而是"不想"，TA正在享受独处的深度思考。',
        evidence: '孩子独自玩耍时能完成复杂任务，如拼复杂乐高、写长篇小说。',
        implication: '不必强迫社交，但需要提供表达和展示的渠道。',
        action: '尊重独处需求，同时提供一对一的深度交流机会。',
        confidence: 80,
      })
    }
  }

  if (dimension === 'D') {
    if (score < 45) {
      findings.push({
        id: 'D-para-1',
        type: 'paradox',
        title: '"没计划"可能是创意思维的土壤',
        titleEn: '"No plan" may be the soil for creative thinking',
        description: '没有规划的孩子可能具备更强的发散思维，能产生意想不到的创意。',
        evidence: '孩子在free play中经常有独特的创造发明。',
        implication: '需要平衡"创意自由"和"项目管理"两种能力。',
        action: '在创意活动中加入简单的规划环节，如"今天要做三件事"。',
        confidence: 72,
      })
    }
  }

  if (dimension === 'E') {
    if (score > 75) {
      findings.push({
        id: 'E-blind-1',
        type: 'blindspot',
        title: '"能说会道"可能掩盖思考深度不足',
        titleEn: '"Glib talk" may cover up shallow thinking',
        description: '善于表达的孩子可能习惯用"说"代替"想"，缺乏深度思考。',
        evidence: '孩子能快速回答问题，但答案缺乏深度和独特见解。',
        implication: '需要训练"思考后再表达"的习惯。',
        action: '增加"先写再说"的练习，培养深度表达。',
        confidence: 68,
      })
    }
  }

  if (dimension === 'R') {
    if (score < 35) {
      findings.push({
        id: 'R-supp-1',
        type: 'surprise',
        title: '"不反思"可能是活在当下的表现',
        titleEn: '"No reflection" may be a sign of living in the moment',
        description: '不擅长反思的孩子可能更善于"当下体验"，不容易被过去或未来的焦虑困扰。',
        evidence: '孩子做错事后很快就能重新开心，不纠结过去。',
        implication: '这是优势也是短板，需要在适当时机引入反思练习。',
        action: '用"未来视角"而非"过去视角"引导反思，"下次想怎样？"而非"今天哪错了？"。',
        confidence: 78,
      })
    }
  }

  return findings.sort((a, b) => b.confidence - a.confidence)
}

// ===================================================================
// P1-1: 家长验证反馈闭环
// ===================================================================

/** 家长验证反馈项 */
export interface ParentVerification {
  assessmentId: string
  childId: string
  dimension: WilderDimension
  dimensionName: string
  scenarioDescription: string
  parentRating: 'accurate' | 'somewhat' | 'inaccurate' | 'not_observed'
  parentComment?: string
  updatedAt: string
  verifiedScore?: number
}

/** 家长反馈验证结果 */
export interface VerificationResult {
  assessmentId: string
  childId: string
  totalVerified: number
  accuracyRate: number
  adjustmentNeeded: boolean
  adjustedScores?: Record<WilderDimension, number>
  feedbackSummary: string
  nextReviewDate: string
}

/** 生成家长验证请求 */
export function generateVerificationRequest(
  assessmentId: string,
  childId: string,
  wilderScores: Record<WilderDimension, number>
): ParentVerification[] {
  const requests: ParentVerification[] = []
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
  const dimensionNames: Record<WilderDimension, string> = {
    W: '好奇心', I: '探究力', L: '连接力', D: '设计力', E: '表达力', R: '反思力'
  }

  dims.forEach(dim => {
    const score = wilderScores[dim]
    const level = score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low'
    const scenarios = ALL_DIMENSION_SCENARIOS[dim].filter(s => s.level === level)
    const selectedScenario = scenarios[Math.floor(Math.random() * Math.min(scenarios.length, 3))]

    if (selectedScenario) {
      requests.push({
        assessmentId,
        childId,
        dimension: dim,
        dimensionName: dimensionNames[dim],
        scenarioDescription: selectedScenario.scenario,
        parentRating: 'not_observed',
        updatedAt: new Date().toISOString(),
      })
    }
  })

  return requests
}

/** 处理家长验证反馈 */
export function processVerification(
  verifications: ParentVerification[],
  originalScores: Record<WilderDimension, number>
): VerificationResult {
  let accurateCount = 0
  let somewhatCount = 0
  let totalCount = verifications.length
  const adjustments: Record<WilderDimension, number> = { ...originalScores }

  verifications.forEach(v => {
    if (v.parentRating === 'accurate') {
      accurateCount++
    } else if (v.parentRating === 'somewhat') {
      somewhatCount++
    }

    // 根据反馈调整分数
    if (v.verifiedScore !== undefined && v.parentRating !== 'not_observed') {
      // 权重调整：新验证占40%，原评估占60%
      adjustments[v.dimension] = Math.round(originalScores[v.dimension] * 0.6 + v.verifiedScore * 0.4)
    }
  })

  const accuracyRate = totalCount > 0 ? Math.round(((accurateCount + somewhatCount * 0.5) / totalCount) * 100) : 0

  // 计算下次review日期（1个月后）
  const nextDate = new Date()
  nextDate.setMonth(nextDate.getMonth() + 1)

  return {
    assessmentId: verifications[0]?.assessmentId || '',
    childId: verifications[0]?.childId || '',
    totalVerified: accurateCount + somewhatCount,
    accuracyRate,
    adjustmentNeeded: accuracyRate < 60 || Math.abs(accuracyRate - 70) > 20,
    adjustedScores: adjustments,
    feedbackSummary: accuracyRate >= 70 ? '评估结果与家长观察高度一致' :
      accuracyRate >= 50 ? '评估结果基本准确，部分维度需要关注' :
        '评估结果与家长观察有差异，建议重新评估',
    nextReviewDate: nextDate.toISOString(),
  }
}

// ===================================================================
// P1-2: 动态场景池匹配
// ===================================================================

/** 场景匹配上下文 */
export interface ScenarioMatchingContext {
  childAge: number
  childGender?: string
  interests: string[]
  recentActivities: string[]
  familyContext: 'single' | 'dual' | 'extended'
  accessToNature: 'urban' | 'suburban' | 'rural'
}

/** 动态场景匹配 */
export function matchScenarios(
  dimension: WilderDimension,
  context: ScenarioMatchingContext,
  count: number = 5
): DimensionScenario[] {
  const allScenarios = ALL_DIMENSION_SCENARIOS[dimension]

  // 关键词匹配权重
  const interestKeywords: Record<string, string[]> = {
    '动物': ['观察', '宠物', '自然', '生命'],
    '科学实验': ['实验', '研究', '验证', '探究'],
    '阅读': ['阅读', '书籍', '知识', '学习'],
    '运动': ['游戏', '活动', '团队', '竞技'],
    '艺术': ['画', '手工', '创作', '表达'],
    '户外': ['户外', '自然', '探索', '观察'],
    '科技': ['手机', '电脑', '程序', '创新'],
  }

  const scoredScenarios = allScenarios.map(scenario => {
    let score = 50 // 基础分

    // 年龄匹配 (允许±2岁偏差)
    // 简化：假设所有场景适合6-12岁

    // 兴趣匹配
    context.interests.forEach(interest => {
      const keywords = interestKeywords[interest] || []
      const matchCount = scenario.keywords.filter(k => keywords.includes(k)).length
      score += matchCount * 10
    })

    // 活动匹配
    context.recentActivities.forEach(activity => {
      const keywords = interestKeywords[activity] || []
      const matchCount = scenario.keywords.filter(k => keywords.includes(k)).length
      score += matchCount * 8
    })

    // 自然环境匹配
    if (context.accessToNature === 'rural' || context.accessToNature === 'suburban') {
      if (scenario.keywords.includes('自然') || scenario.keywords.includes('观察') || scenario.keywords.includes('户外')) {
        score += 15
      }
    }

    // 家庭环境匹配
    if (context.familyContext === 'extended') {
      if (scenario.keywords.includes('分享') || scenario.keywords.includes('团队') || scenario.keywords.includes('朋友')) {
        score += 10
      }
    }

    return { scenario, score }
  })

  return scoredScenarios
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(s => s.scenario)
}

// ===================================================================
// P2-1: 多模型验证可视化
// ===================================================================

/** 多模型验证结果 */
export interface MultiModelVerification {
  assessmentId: string
  models: ModelVerificationResult[]
  consensusScore: number
  divergencePoints: DivergencePoint[]
  finalConfidence: number
  timestamp: string
}

export interface ModelVerificationResult {
  modelId: string
  modelName: string
  modelNameEn: string
  color: string
  scores: Record<WilderDimension, number>
  confidence: number
  keyFindings: string[]
}

export interface DivergencePoint {
  dimension: WilderDimension
  dimensionName: string
  minScore: number
  maxScore: number
  range: number
  explanation: string
}

/** 生成多模型验证结果（模拟） */
export function generateMultiModelVerification(
  wilderScores: Record<WilderDimension, number>
): MultiModelVerification {
  const models: ModelVerificationResult[] = [
    {
      modelId: 'gpt4',
      modelName: 'GPT-4',
      modelNameEn: 'GPT-4',
      color: '#10a37f',
      scores: { ...wilderScores },
      confidence: 85,
      keyFindings: ['语言理解深度强', '推理逻辑清晰'],
    },
    {
      modelId: 'claude',
      modelName: 'Claude',
      modelNameEn: 'Claude 3.5',
      color: '#d4a373',
      scores: {
        W: wilderScores.W + Math.round((Math.random() - 0.5) * 10),
        I: wilderScores.I + Math.round((Math.random() - 0.5) * 8),
        L: wilderScores.L + Math.round((Math.random() - 0.5) * 12),
        D: wilderScores.D + Math.round((Math.random() - 0.5) * 6),
        E: wilderScores.E + Math.round((Math.random() - 0.5) * 10),
        R: wilderScores.R + Math.round((Math.random() - 0.5) * 8),
      },
      confidence: 82,
      keyFindings: ['细节敏感度高', '共情能力强'],
    },
    {
      modelId: 'qwen',
      modelName: '通义千问',
      modelNameEn: 'Qwen',
      color: '#ff6b6b',
      scores: {
        W: wilderScores.W + Math.round((Math.random() - 0.5) * 8),
        I: wilderScores.I + Math.round((Math.random() - 0.5) * 10),
        L: wilderScores.L + Math.round((Math.random() - 0.5) * 6),
        D: wilderScores.D + Math.round((Math.random() - 0.5) * 12),
        E: wilderScores.E + Math.round((Math.random() - 0.5) * 8),
        R: wilderScores.R + Math.round((Math.random() - 0.5) * 10),
      },
      confidence: 78,
      keyFindings: ['中文语境理解好', '本土化适配强'],
    },
  ]

  // 计算分歧点
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
  const dimensionNames: Record<WilderDimension, string> = {
    W: '好奇心', I: '探究力', L: '连接力', D: '设计力', E: '表达力', R: '反思力'
  }

  const divergencePoints: DivergencePoint[] = dims.map(dim => {
    const scores = models.map(m => m.scores[dim])
    const minScore = Math.min(...scores)
    const maxScore = Math.max(...scores)

    return {
      dimension: dim,
      dimensionName: dimensionNames[dim],
      minScore,
      maxScore,
      range: maxScore - minScore,
      explanation: maxScore - minScore > 15 ?
        '各模型对该维度判断差异较大，建议重点验证' :
        maxScore - minScore > 10 ?
          '存在一定差异，综合评估后给出最终结果' :
          '各模型判断一致，置信度较高',
    }
  }).filter(d => d.range > 8)

  // 计算共识分
  const consensusScore = Math.round(
    (1 - divergencePoints.reduce((sum, d) => sum + d.range, 0) / 600) * 100
  )

  return {
    assessmentId: `MV-${Date.now()}`,
    models,
    consensusScore,
    divergencePoints,
    finalConfidence: Math.round(consensusScore * 0.7 + 30),
    timestamp: new Date().toISOString(),
  }
}

// ===================================================================
// P2-2: 成长时间线
// ===================================================================

/** 成长记录项 */
export interface GrowthRecord {
  id: string
  date: string
  type: 'milestone' | 'improvement' | 'observation' | 'achievement'
  title: string
  description: string
  dimension?: WilderDimension
  evidence?: string
  mediaUrl?: string
}

/** 成长时间线数据 */
export interface GrowthTimeline {
  childId: string
  records: GrowthRecord[]
  startDate: string
  endDate: string
  summary: string
}

/** 生成成长时间线 */
export function generateGrowthTimeline(
  childId: string,
  wilderScores: Record<WilderDimension, number>,
  existingRecords: GrowthRecord[] = []
): GrowthTimeline {
  const dimensionNames: Record<WilderDimension, string> = {
    W: '好奇心', I: '探究力', L: '连接力', D: '设计力', E: '表达力', R: '反思力'
  }

  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']

  // 生成初始成长记录（基于评估结果）
  const newRecords: GrowthRecord[] = dims
    .filter(dim => wilderScores[dim] >= 70)
    .map(dim => ({
      id: `GR-${Date.now()}-${dim}`,
      date: new Date().toISOString(),
      type: 'milestone' as const,
      title: `${dimensionNames[dim]}评估达标`,
      description: `在${dimensionNames[dim]}维度表现突出，获得里程碑认证`,
      dimension: dim,
      evidence: `WILDER评估得分：${wilderScores[dim]}分`,
    }))

  // 合并现有记录
  const allRecords = [...existingRecords, ...newRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // 生成总结
  const highDims = dims.filter(d => wilderScores[d] >= 70)
  const summary = highDims.length >= 3 ?
    `孩子展现出${highDims.map(d => dimensionNames[d]).join('、')}等多方面优势` :
    highDims.length > 0 ?
      `孩子在${dimensionNames[highDims[0]]}方面表现突出` :
      '各维度正在均衡发展'

  return {
    childId,
    records: allRecords,
    startDate: allRecords.length > 0 ? allRecords[allRecords.length - 1].date : new Date().toISOString(),
    endDate: new Date().toISOString(),
    summary,
  }
}

/** 生成成长建议 */
export function generateGrowthSuggestions(
  wilderScores: Record<WilderDimension, number>
): { dimension: WilderDimension; action: string; timeline: string }[] {
  const suggestions: { dimension: WilderDimension; action: string; timeline: string }[] = []
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
  const dimensionNames: Record<WilderDimension, string> = {
    W: '好奇心', I: '探究力', L: '连接力', D: '设计力', E: '表达力', R: '反思力'
  }

  dims.forEach(dim => {
    if (wilderScores[dim] < 50) {
      suggestions.push({
        dimension: dim,
        action: `通过${dimensionNames[dim]}相关活动提升，每周至少2次专项练习`,
        timeline: '1个月初见成效，3个月明显改善',
      })
    }
  })

  return suggestions.sort((a, b) => wilderScores[a.dimension] - wilderScores[b.dimension])
}
