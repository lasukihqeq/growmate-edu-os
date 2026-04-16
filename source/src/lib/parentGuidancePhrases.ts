// ===================================================================
// 分年龄段家长20句常用指导话语系统 v1.1
// 基于WILDER维度×年龄段×报告类型 生成个性化家长指导语
// 每种报告类型提供20句最常用表达（按场景分类）
// v1.1: 新增学龄前(4-5岁)阶段指导语
// ===================================================================

export type AgeStage = 'preschool' | 'lower-primary' | 'upper-primary' | 'middle-school' | 'high-school'

export interface GuidancePhrase {
  id: number
  category: 'encourage' | 'question' | 'boundary' | 'conflict' | 'motivation'
  phrase: string
  scene: string
  intent: string
  ageNote?: string
}

export interface ParentGuidanceSet {
  ageStage: AgeStage
  ageLabel: string
  topDims: string[]
  talentType: string
  phrases: GuidancePhrase[]
  dailyRoutine: string[]
  avoidPhrases: string[]
}

function getAgeStage(age: number): AgeStage {
  if (age <= 5) return 'preschool'
  if (age <= 9) return 'lower-primary'
  if (age <= 12) return 'upper-primary'
  if (age <= 15) return 'middle-school'
  return 'high-school'
}

function getAgeLabel(stage: AgeStage): string {
  const m: Record<AgeStage, string> = {
    'preschool': '学龄前(4-5岁)',
    'lower-primary': '小学低年级(6-9岁)',
    'upper-primary': '小学高年级(10-12岁)',
    'middle-school': '初中(13-15岁)',
    'high-school': '高中(16-18岁)',
  }
  return m[stage]
}

// ========== 维度专属鼓励话语 ==========
const DIM_ENCOURAGE: Record<string, Record<AgeStage, GuidancePhrase[]>> = {
  W: {
    'preschool': [
      { id: 1, category: 'encourage', phrase: '哇！宝宝发现了什么呀？给妈妈/爸爸看看！', scene: '孩子发现新事物时', intent: '保护好奇心，鼓励分享发现' },
      { id: 2, category: 'encourage', phrase: '宝宝问的问题真好！我们一起来找答案吧！', scene: '孩子提问时', intent: '肯定提问行为，建立探索习惯' },
      { id: 3, category: 'question', phrase: '这是什么呀？你觉得呢？', scene: '看到新鲜事物时', intent: '引导观察和表达' },
    ],
    'lower-primary': [
      { id: 1, category: 'encourage', phrase: '你问的这个问题好有趣！我们一起去找答案吧！', scene: '孩子提出好奇问题时', intent: '保护好奇心，建立"问问题是好事"的信念' },
      { id: 2, category: 'encourage', phrase: '哇，你发现了一个我都没注意到的东西！', scene: '孩子观察到新事物时', intent: '强化观察力和发现力' },
      { id: 3, category: 'question', phrase: '你觉得这个是怎么来的？我们猜猜看？', scene: '遇到新鲜事物时', intent: '引导主动思考而非被动接受' },
    ],
    'upper-primary': [
      { id: 1, category: 'encourage', phrase: '你的好奇心让你发现了很多人忽略的东西，这是你的超能力。', scene: '探索行为时', intent: '将好奇心与"超能力"关联' },
      { id: 2, category: 'question', phrase: '关于这个，你最想知道的三件事是什么？', scene: '新话题讨论时', intent: '训练聚焦式好奇心' },
      { id: 3, category: 'encourage', phrase: '不是每个人都会问出这样的问题，你很特别。', scene: '提出深层问题时', intent: '肯定思考深度' },
    ],
    'middle-school': [
      { id: 1, category: 'encourage', phrase: '你对这个问题的思考角度很独特，能再展开说说吗？', scene: '表达观点时', intent: '肯定独立思考' },
      { id: 2, category: 'question', phrase: '如果你有机会研究一个课题，你会选什么？', scene: '日常聊天中', intent: '引导学术好奇心' },
      { id: 3, category: 'encourage', phrase: '能保持好奇心的人，在任何领域都走得更远。', scene: '学习遇到瓶颈时', intent: '将好奇心与长期价值挂钩' },
    ],
    'high-school': [
      { id: 1, category: 'encourage', phrase: '你对这个领域的持续关注，已经超过很多同龄人了。', scene: '深度探索某主题时', intent: '肯定专注力与学术深度' },
      { id: 2, category: 'question', phrase: '你觉得这个问题目前的主流答案有什么局限？', scene: '讨论学术话题时', intent: '培养批判性思考' },
      { id: 3, category: 'encourage', phrase: '好奇心驱动的人，往往能做出最有价值的创新。', scene: '职业/专业探讨时', intent: '好奇心与职业价值联系' },
    ],
  },
  I: {
    'preschool': [
      { id: 1, category: 'encourage', phrase: '宝宝试了一下，发现这样不行，又换了一种方法，真聪明！', scene: '尝试解决问题时', intent: '肯定探索精神' },
      { id: 2, category: 'question', phrase: '如果这样做会怎么样呢？我们试试看？', scene: '遇到问题时', intent: '引导尝试和验证' },
      { id: 3, category: 'encourage', phrase: '宝宝会自己想办法了，真棒！', scene: '独立解决问题时', intent: '肯定自主探究' },
    ],
    'lower-primary': [
      { id: 1, category: 'encourage', phrase: '你刚才验证的方式很聪明，像真正的小科学家！', scene: '尝试验证某事时', intent: '肯定求证精神' },
      { id: 2, category: 'question', phrase: '你怎么知道这是对的？有什么方法可以试一试？', scene: '孩子做判断时', intent: '培养求证意识' },
      { id: 3, category: 'encourage', phrase: '做实验不一定要成功，每次试都能学到新东西。', scene: '实验失败时', intent: '建立"失败也是数据"的观念' },
    ],
    'upper-primary': [
      { id: 1, category: 'encourage', phrase: '你的逻辑推理能力越来越强了，这对学习帮助很大。', scene: '展示推理过程时', intent: '肯定逻辑能力' },
      { id: 2, category: 'question', phrase: '如果换一种方法，结果会不同吗？', scene: '完成任务后', intent: '引导变量思考' },
      { id: 3, category: 'encourage', phrase: '你不轻易相信答案，总是要自己确认——这个习惯很棒。', scene: '质疑信息时', intent: '肯定批判性思维' },
    ],
    'middle-school': [
      { id: 1, category: 'encourage', phrase: '你的论证过程很有说服力，不是所有人都能做到这一点。', scene: '讨论问题时', intent: '肯定论证能力' },
      { id: 2, category: 'question', phrase: '这个结论的证据充分吗？还需要什么数据？', scene: '学术讨论时', intent: '培养证据意识' },
      { id: 3, category: 'encourage', phrase: '善于求证的人，未来做研究会很有优势。', scene: '学业规划时', intent: '探究力与学术未来联系' },
    ],
    'high-school': [
      { id: 1, category: 'encourage', phrase: '你能区分"观点"和"事实"，这种能力在信息时代很稀缺。', scene: '分析信息时', intent: '肯定信息素养' },
      { id: 2, category: 'question', phrase: '如果要设计一个实验来验证这个假说，你会怎么做？', scene: '学术探讨时', intent: '培养实验设计思维' },
      { id: 3, category: 'encourage', phrase: '科学思维不只是理科的事，它是一种看世界的方式。', scene: '文理选择时', intent: '扩展探究力认知' },
    ],
  },
  L: {
    'preschool': [
      { id: 1, category: 'encourage', phrase: '宝宝愿意和小朋友一起玩，真棒！', scene: '分享玩具时', intent: '强化分享行为' },
      { id: 2, category: 'question', phrase: '小朋友好像不开心了，我们要不要去问问TA？', scene: '社交情境中', intent: '培养共情意识' },
      { id: 3, category: 'encourage', phrase: '宝宝会照顾别人了，真是个小暖男/小暖女！', scene: '帮助他人时', intent: '肯定亲社会行为' },
    ],
    'lower-primary': [
      { id: 1, category: 'encourage', phrase: '你刚才主动帮助小朋友了，你是一个很温暖的人。', scene: '助人行为后', intent: '强化亲社会行为' },
      { id: 2, category: 'question', phrase: '你觉得他现在的心情是什么？我们能做什么？', scene: '社交情境中', intent: '培养共情力' },
      { id: 3, category: 'encourage', phrase: '大家都喜欢和你一起玩，因为你懂得照顾别人的感受。', scene: '社交反馈时', intent: '建立社交自信' },
    ],
    'upper-primary': [
      { id: 1, category: 'encourage', phrase: '你在团队里总能让大家配合得更好，这是领导力的表现。', scene: '团队活动后', intent: '肯定协调能力' },
      { id: 2, category: 'question', phrase: '如果你来安排，怎样让每个人都能发挥自己的强项？', scene: '团队任务时', intent: '培养组织力' },
      { id: 3, category: 'encourage', phrase: '能把不同的知识联系在一起，说明你的思维很灵活。', scene: '跨学科联想时', intent: '肯定知识连接力' },
    ],
    'middle-school': [
      { id: 1, category: 'encourage', phrase: '你能站在不同角度思考问题，这在同龄人中很难得。', scene: '讨论分歧时', intent: '肯定多元视角' },
      { id: 2, category: 'question', phrase: '这个问题和你之前学的哪些内容有关联？', scene: '学习新知时', intent: '训练知识迁移' },
      { id: 3, category: 'encourage', phrase: '人际关系中你的共情能力是潜能，善用它。', scene: '人际互动后', intent: '共情力价值认知' },
    ],
    'high-school': [
      { id: 1, category: 'encourage', phrase: '你善于整合不同来源的信息，这是复杂问题解决的关键能力。', scene: '综合分析时', intent: '肯定系统思维' },
      { id: 2, category: 'question', phrase: '这个领域和其他学科有什么交叉点？', scene: '专业探讨时', intent: '培养跨学科意识' },
      { id: 3, category: 'encourage', phrase: '未来最需要的人才，是能连接不同领域的人。', scene: '未来规划时', intent: '连接力与职业价值' },
    ],
  },
  D: {
    'preschool': [
      { id: 1, category: 'encourage', phrase: '宝宝搭的积木好整齐呀！是一层一层搭上去的！', scene: '建构游戏时', intent: '肯定计划性和结构意识' },
      { id: 2, category: 'question', phrase: '我们先做什么，再做什么呢？', scene: '开始任务前', intent: '培养步骤意识' },
      { id: 3, category: 'encourage', phrase: '宝宝自己穿鞋子了，真厉害！', scene: '自理行为时', intent: '肯定自主完成能力' },
    ],
    'lower-primary': [
      { id: 1, category: 'encourage', phrase: '你的计划做得真清楚，按步骤来的感觉真好！', scene: '有条理完成任务时', intent: '肯定规划能力' },
      { id: 2, category: 'question', phrase: '你打算先做什么，再做什么？', scene: '开始任务前', intent: '培养规划习惯' },
      { id: 3, category: 'encourage', phrase: '你搭建的作品结构好棒，有设计师的潜力！', scene: '建构活动后', intent: '肯定空间和结构能力' },
    ],
    'upper-primary': [
      { id: 1, category: 'encourage', phrase: '你把复杂的事情拆成了小步骤，这是非常聪明的做法。', scene: '拆解任务时', intent: '肯定任务分解能力' },
      { id: 2, category: 'question', phrase: '如果时间只有一半，你会怎么调整计划？', scene: '计划讨论时', intent: '培养灵活规划' },
      { id: 3, category: 'encourage', phrase: '你对细节的关注度很高，做出来的东西质量都很好。', scene: '完成高质量作品时', intent: '肯定品质意识' },
    ],
    'middle-school': [
      { id: 1, category: 'encourage', phrase: '你的项目管理能力让人印象深刻，很多大人都做不到。', scene: '完成复杂任务时', intent: '肯定项目管理力' },
      { id: 2, category: 'question', phrase: '这个方案有没有备选计划？如果遇到意外怎么办？', scene: '制定计划时', intent: '培养风险意识' },
      { id: 3, category: 'encourage', phrase: '设计思维不只是画图，而是一种解决问题的方式。', scene: '设计讨论时', intent: '扩展设计力认知' },
    ],
    'high-school': [
      { id: 1, category: 'encourage', phrase: '你的系统化思维在未来工作中会是核心竞争力。', scene: '展示系统规划时', intent: '设计力与职业价值' },
      { id: 2, category: 'question', phrase: '从终局倒推，你的阶段性里程碑是什么？', scene: '长期规划时', intent: '培养逆向规划' },
      { id: 3, category: 'encourage', phrase: '能把想法变成可执行方案的人，就是最有竞争力的人。', scene: '创业/项目讨论时', intent: '执行力价值认知' },
    ],
  },
  E: {
    'preschool': [
      { id: 1, category: 'encourage', phrase: '宝宝说的真好！妈妈/爸爸听明白了！', scene: '孩子表达想法时', intent: '肯定表达意愿' },
      { id: 2, category: 'question', phrase: '今天在幼儿园发生了什么好玩的事呀？', scene: '放学后', intent: '引导叙事表达' },
      { id: 3, category: 'encourage', phrase: '宝宝愿意说给大家听，真勇敢！', scene: '公开表达时', intent: '肯定表达勇气' },
    ],
    'lower-primary': [
      { id: 1, category: 'encourage', phrase: '你讲得真清楚，妈妈/爸爸完全听懂了！', scene: '孩子汇报/讲解时', intent: '强化结构表达能力' },
      { id: 2, category: 'question', phrase: '你能给我讲讲今天最有趣的事吗？', scene: '放学后', intent: '练习叙事表达' },
      { id: 3, category: 'encourage', phrase: '你的故事讲得真精彩，大家都很喜欢听！', scene: '讲述分享时', intent: '肯定表达信心' },
    ],
    'upper-primary': [
      { id: 1, category: 'encourage', phrase: '你表达的逻辑性越来越强了，观点很有说服力。', scene: '论述观点时', intent: '肯定逻辑表达' },
      { id: 2, category: 'question', phrase: '如果你要说服一个反对的人，你会怎么说？', scene: '辩论练习时', intent: '培养说服力' },
      { id: 3, category: 'encourage', phrase: '敢于在大家面前表达自己，这本身就是一种勇气。', scene: '公开发言后', intent: '肯定表达勇气' },
    ],
    'middle-school': [
      { id: 1, category: 'encourage', phrase: '你的表达能力在同龄人中非常突出，这是难得的潜能。', scene: '展示表达力时', intent: '身份认同建设' },
      { id: 2, category: 'question', phrase: '怎样让你的表达更有影响力？试试加入故事和数据。', scene: '准备演讲时', intent: '提升表达技巧' },
      { id: 3, category: 'encourage', phrase: '好的表达不只是说话，也包括倾听和回应。', scene: '沟通中', intent: '全面表达素养' },
    ],
    'high-school': [
      { id: 1, category: 'encourage', phrase: '你的演讲/写作能力，在大学申请和未来职业中都是加分项。', scene: '表达展示后', intent: '表达力与未来联系' },
      { id: 2, category: 'question', phrase: '你的核心观点用一句话怎么说？', scene: '准备重要表达时', intent: '培养提炼能力' },
      { id: 3, category: 'encourage', phrase: '能清晰表达复杂想法的人，在任何领域都是稀缺人才。', scene: '职业规划时', intent: '表达力职业价值' },
    ],
  },
  R: {
    'preschool': [
      { id: 1, category: 'encourage', phrase: '宝宝知道自己刚才做了什么，真棒！', scene: '回顾行为时', intent: '培养自我意识' },
      { id: 2, category: 'question', phrase: '刚才那个游戏，宝宝觉得哪里最好玩？', scene: '活动结束后', intent: '引导简单反思' },
      { id: 3, category: 'encourage', phrase: '宝宝会自己想"我做得对不对"了，这是很厉害的！', scene: '自我纠正时', intent: '肯定元认知萌芽' },
    ],
    'lower-primary': [
      { id: 1, category: 'encourage', phrase: '你刚才的总结很到位，能看到自己的进步说明你在成长。', scene: '反思总结时', intent: '肯定反思习惯' },
      { id: 2, category: 'question', phrase: '如果重来一次，你会怎么做不一样？', scene: '任务完成后', intent: '培养反思能力' },
      { id: 3, category: 'encourage', phrase: '知道自己哪里做得好、哪里可以更好，这很了不起。', scene: '自我评价时', intent: '建立反思正反馈' },
    ],
    'upper-primary': [
      { id: 1, category: 'encourage', phrase: '你能客观看待自己的表现，这种自我觉察很难得。', scene: '自我评估时', intent: '肯定元认知' },
      { id: 2, category: 'question', phrase: '这次成功的关键因素是什么？下次怎么复制？', scene: '取得成绩后', intent: '培养成功归因' },
      { id: 3, category: 'encourage', phrase: '愿意复盘的人，进步速度是别人的两倍。', scene: '鼓励复盘时', intent: '反思与成长联系' },
    ],
    'middle-school': [
      { id: 1, category: 'encourage', phrase: '你对自己的认识越来越清晰了，这是成熟的表现。', scene: '自我剖析时', intent: '肯定自我认知深度' },
      { id: 2, category: 'question', phrase: '你觉得自己最近三个月最大的变化是什么？', scene: '成长对话中', intent: '引导长期反思' },
      { id: 3, category: 'encourage', phrase: '反思不是自我批评，而是找到更好的自己。', scene: '过度自我批评时', intent: '建立健康反思观' },
    ],
    'high-school': [
      { id: 1, category: 'encourage', phrase: '你的元认知水平很高——知道自己知道什么、不知道什么。', scene: '深度自我分析时', intent: '肯定元认知成熟' },
      { id: 2, category: 'question', phrase: '回看过去一年，你最想感谢自己做出的哪个决定？', scene: '年终回顾时', intent: '培养感恩式反思' },
      { id: 3, category: 'encourage', phrase: '能反思的领导者，才能持续进步。', scene: '领导力讨论时', intent: '反思力与领导力联系' },
    ],
  },
}

// ========== 通用场景话语（适用于所有类型） ==========
const UNIVERSAL_PHRASES: Record<AgeStage, GuidancePhrase[]> = {
  'preschool': [
    { id: 14, category: 'boundary', phrase: '现在要吃饭了，玩具先放一放，吃完饭再玩。', scene: '不想停止玩耍时', intent: '清晰的边界+可预见的后续' },
    { id: 15, category: 'conflict', phrase: '宝宝现在不开心，妈妈/爸爸抱抱，等一下再聊。', scene: '情绪激动时', intent: '先安抚情绪再处理事情' },
    { id: 16, category: 'motivation', phrase: '宝宝今天自己穿鞋子了，真棒！', scene: '自理行为时', intent: '关注具体进步' },
    { id: 17, category: 'encourage', phrase: '没关系，再试一次，妈妈/爸爸陪着你。', scene: '失败沮丧时', intent: '建立安全感' },
    { id: 18, category: 'boundary', phrase: '这个不可以，但是那个可以，你要哪一个？', scene: '想要不该要的东西时', intent: '给替代选择' },
    { id: 19, category: 'motivation', phrase: '宝宝想试试吗？妈妈/爸爸看着你！', scene: '不敢尝试时', intent: '用陪伴鼓励尝试' },
    { id: 20, category: 'conflict', phrase: '宝宝生气了，可以说出来，不要打人。', scene: '行为失控时', intent: '接纳情绪但设定行为边界' },
  ],
  'lower-primary': [
    { id: 14, category: 'boundary', phrase: '现在是作业时间。你可以先做数学还是先做语文，但要在规定时间前完成。', scene: '拖延作业时', intent: '给选择权但有清晰边界' },
    { id: 15, category: 'conflict', phrase: '我看到你现在很不开心。你可以先冷静一下，等你准备好了我们再聊。', scene: '情绪激动时', intent: '先处理情绪再处理事情' },
    { id: 16, category: 'motivation', phrase: '你今天比昨天多坚持了5分钟，这就是进步！', scene: '学习坚持时', intent: '关注进步而非结果' },
    { id: 17, category: 'encourage', phrase: '犯错是学习最正常的事，没有错误就没有进步。', scene: '犯错沮丧时', intent: '建立成长型心态' },
    { id: 18, category: 'boundary', phrase: '看完这一集我们就去做别的，这是我们的约定。', scene: '控制屏幕时间', intent: '用约定代替命令' },
    { id: 19, category: 'motivation', phrase: '你选一件今天最想完成的事，我们一起加油！', scene: '缺乏动力时', intent: '给自主权激发内驱力' },
    { id: 20, category: 'conflict', phrase: '你有你的想法，我也有我的担心，我们来商量一个都能接受的办法？', scene: '亲子分歧时', intent: '协商式解决冲突' },
  ],
  'upper-primary': [
    { id: 14, category: 'boundary', phrase: '关于手机使用，我们来制定一个双方都认可的规则？', scene: '屏幕时间管理', intent: '协商出的规则比强制有效3倍' },
    { id: 15, category: 'conflict', phrase: '你有自己的想法很好。我的担心是具体的事情，你觉得怎么解决？', scene: '意见不合时', intent: '给表达空间并纳入决策' },
    { id: 16, category: 'motivation', phrase: '这次比上次进步了，你自己觉得哪里做得最好？', scene: '考试/测验后', intent: '引导自我归因' },
    { id: 17, category: 'encourage', phrase: '你不需要每件事都第一名，但要每件事都尽了力。', scene: '过度焦虑成绩时', intent: '降低结果焦虑' },
    { id: 18, category: 'boundary', phrase: '我信任你能管理好自己的时间，如果需要帮助告诉我。', scene: '培养自主性', intent: '用信任激发责任感' },
    { id: 19, category: 'motivation', phrase: '如果从这次经历里只能学一件事，你会选什么？', scene: '经历挫折后', intent: '引导挫折中学习' },
    { id: 20, category: 'conflict', phrase: '我不是想控制你，我是想了解你的想法，然后看怎么支持你。', scene: '孩子觉得被管太多时', intent: '建立支持而非控制的关系' },
  ],
  'middle-school': [
    { id: 14, category: 'boundary', phrase: '我尊重你的选择，同时希望你想清楚可能的后果。', scene: '重要决策时', intent: '赋权同时培养责任意识' },
    { id: 15, category: 'conflict', phrase: '我们的目标是一样的——你过得好。方法可以不同，来聊聊？', scene: '亲子冲突时', intent: '从对立转为合作' },
    { id: 16, category: 'motivation', phrase: '短期看不到变化很正常，但你现在做的每件事都在积累。', scene: '感到迷茫时', intent: '建立延迟满足信念' },
    { id: 17, category: 'encourage', phrase: '你现在面对的困难，正在锻炼你未来需要的能力。', scene: '学业压力大时', intent: '赋予困难积极意义' },
    { id: 18, category: 'boundary', phrase: '我可以给建议，但最终决定权在你。你需要我的意见吗？', scene: '孩子寻求独立时', intent: '从指导者转变为顾问' },
    { id: 19, category: 'motivation', phrase: '找到自己真正热爱的事，比考第一名更重要。', scene: '探索兴趣时', intent: '鼓励内驱力导向' },
    { id: 20, category: 'conflict', phrase: '我知道你长大了，有些事情你想自己决定。我会学着放手。', scene: '青春期独立需求', intent: '主动适应亲子关系变化' },
  ],
  'high-school': [
    { id: 14, category: 'boundary', phrase: '你的人生你做主，我能做的是提供信息和支持。', scene: '重大选择时', intent: '充分赋权' },
    { id: 15, category: 'conflict', phrase: '我们可能看法不同，但我始终站在你这边。', scene: '价值观分歧时', intent: '无条件支持的信号' },
    { id: 16, category: 'motivation', phrase: '你现在做的选择，正在定义未来的你。不需要完美，但需要真诚。', scene: '人生重要节点', intent: '鼓励真诚选择' },
    { id: 17, category: 'encourage', phrase: '不确定是正常的。保持开放，答案会在路上浮现。', scene: '对未来迷茫时', intent: '接纳不确定性' },
    { id: 18, category: 'boundary', phrase: '如果你需要一个能倾听的人，我随时都在。', scene: '任何困难时刻', intent: '建立安全倾诉空间' },
    { id: 19, category: 'motivation', phrase: '你已经具备了独立面对挑战的能力，我相信你。', scene: '离家/独立前', intent: '传递信任和力量' },
    { id: 20, category: 'conflict', phrase: '即使我们意见不同，我对你的爱和支持不会改变。', scene: '严重分歧时', intent: '确认无条件的爱' },
  ],
}

// ========== 主生成函数 ==========

/**
 * 生成个性化家长20句指导话语
 * @param age 学生年龄
 * @param topDims WILDER前2高维度 e.g., ['W', 'I']
 * @param talentType 潜能类型名称
 * @returns 完整的20句指导话语集
 */
export function generateParentGuidance20(
  age: number,
  topDims: string[],
  talentType: string
): ParentGuidanceSet {
  const stage = getAgeStage(age)
  const dim1 = topDims[0] || 'W'
  const dim2 = topDims[1] || 'I'

  // 从两个优势维度各取3句 = 6句 + 次维度2句 = 8句维度相关
  const dimPhrases1 = DIM_ENCOURAGE[dim1]?.[stage] || []
  const dimPhrases2 = DIM_ENCOURAGE[dim2]?.[stage] || []

  // 如果有第三维度（中等维度），取2句作为平衡
  const allDims: string[] = ['W', 'I', 'L', 'D', 'E', 'R']
  const otherDims = allDims.filter(d => d !== dim1 && d !== dim2)
  const balanceDim = otherDims[0] || 'R'
  const balancePhrases = (DIM_ENCOURAGE[balanceDim]?.[stage] || []).slice(0, 1).map((p, i) => ({
    ...p, id: 10 + i,
  }))

  // 组合：维度专属(3+3+1=7) + 通用(7) + 避免话语 + 日常习惯
  const allPhrases: GuidancePhrase[] = [
    ...dimPhrases1.map((p, i) => ({ ...p, id: i + 1 })),
    ...dimPhrases2.map((p, i) => ({ ...p, id: i + 4 })),
    ...balancePhrases.map((p, i) => ({ ...p, id: i + 7 })),
    // 再从其他维度补2句独特的
    ...(DIM_ENCOURAGE[otherDims[1]]?.[stage] || []).slice(0, 1).map((p, i) => ({ ...p, id: 8 + i })),
    ...(DIM_ENCOURAGE[otherDims[2]]?.[stage] || []).slice(0, 1).map((p, i) => ({ ...p, id: 9 + i })),
    // 补齐到13句维度相关 → 不够就从dim1/dim2重复取
    ...(dimPhrases1.length > 2 ? [] : dimPhrases2.slice(2, 3).map((p, i) => ({ ...p, id: 10 + i }))),
  ].slice(0, 13)

  // 加上7句通用话语
  const universalForAge = UNIVERSAL_PHRASES[stage] || UNIVERSAL_PHRASES['upper-primary']
  const combined = [...allPhrases, ...universalForAge].slice(0, 20)

  // 重新编号
  combined.forEach((p, i) => { p.id = i + 1 })

  // 日常习惯建议
  const dailyRoutine = getDailyRoutine(stage, dim1, dim2)
  const avoidPhrases = getAvoidPhrases(stage)

  return {
    ageStage: stage,
    ageLabel: getAgeLabel(stage),
    topDims: [dim1, dim2],
    talentType,
    phrases: combined,
    dailyRoutine,
    avoidPhrases,
  }
}

// ========== 日常习惯建议 ==========

function getDailyRoutine(stage: AgeStage, dim1: string, dim2: string): string[] {
  const base: Record<AgeStage, string[]> = {
    'preschool': [
      '每天睡前讲故事，让宝宝说说"今天最开心的事"',
      '每周一次"探索时间"——带宝宝去公园或户外观察',
      '多和宝宝说话，鼓励TA表达自己的想法',
    ],
    'lower-primary': [
      '每天放学后，用5分钟听孩子讲"今天最有趣的一件事"',
      '每周一次"好奇心时间"——一起研究一个新问题',
      '睡前10分钟亲子阅读，让孩子选书',
    ],
    'upper-primary': [
      '每天一次"3件好事"分享——各说今天做得好的3件事',
      '每周一次家庭会议——让孩子参与家庭决策',
      '鼓励孩子记录"学习周记"，哪怕只写3句话',
    ],
    'middle-school': [
      '保持每周至少一次深度对话（不谈成绩，谈想法）',
      '尊重孩子的独处需求，但保持"开放的门"',
      '定期一起看纪录片或讨论新闻事件',
    ],
    'high-school': [
      '以"顾问"而非"领导"的角色参与孩子的决策',
      '每月一次深度对话——聊未来、聊价值观、聊困惑',
      '提供资源和信息，而非直接给答案',
    ],
  }
  const dimTip: Record<string, string> = {
    W: '给孩子创造"自由探索"的时间，不安排任何课外班',
    I: '准备一个"家庭实验角"，让孩子随时能动手验证',
    L: '多创造家庭和朋友的社交机会，培养社交能力',
    D: '让孩子参与家庭项目（整理房间/做饭/旅行规划）',
    E: '给孩子创造表达机会（家庭演讲/录视频/写日记）',
    R: '每周末做一次"本周回顾"，养成反思习惯',
  }
  return [...base[stage], dimTip[dim1] || '', dimTip[dim2] || ''].filter(Boolean)
}

// ========== 避免话语 ==========

function getAvoidPhrases(stage: AgeStage): string[] {
  const common = [
    '你看看别人家的孩子……',
    '我这都是为你好！',
    '你怎么又/总是/永远……',
    '说了多少遍了你怎么就不听！',
  ]
  const ageSpecific: Record<AgeStage, string[]> = {
    'preschool': ['你再不听话我就不要你了', '你看看别的小朋友多乖'],
    'lower-primary': ['你太小了不懂', '大人说的话你照做就行'],
    'upper-primary': ['你这样下去以后怎么办', '这点小事都做不好'],
    'middle-school': ['你翅膀硬了是不是', '我像你这么大的时候……'],
    'high-school': ['你不听我的以后会后悔', '我供你吃供你穿你还……'],
  }
  return [...common, ...(ageSpecific[stage] || [])]
}

// ========== 快速查询接口 ==========

/** 获取特定场景的话语 */
export function getPhrasesByCategory(
  age: number,
  topDims: string[],
  category: GuidancePhrase['category']
): GuidancePhrase[] {
  const set = generateParentGuidance20(age, topDims, '')
  return set.phrases.filter(p => p.category === category)
}

/** 获取每日一句（随机） */
export function getDailyPhrase(age: number, topDims: string[]): GuidancePhrase {
  const set = generateParentGuidance20(age, topDims, '')
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return set.phrases[dayOfYear % set.phrases.length]
}

/** 获取避免用语列表 */
export function getAvoidList(age: number): string[] {
  return getAvoidPhrases(getAgeStage(age))
}
