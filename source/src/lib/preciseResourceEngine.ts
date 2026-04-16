// ===================================================================
// GrowMate 精准投喂引擎 v1.0
// 执行"3-2-1精选法则"：从几百个选项中只选最匹配的
// L4 资源层：精准过滤 + 命中注定推荐语 + 行动钩子
// ===================================================================

import type { WilderDimension } from './wilderKernel'

// ========== 类型定义 ==========

export interface PreciseBook {
  /** 书名 */
  title: string
  /** 作者 */
  author: string
  /** 封面色（用于UI展示） */
  coverColor: string
  /** 选入理由 - "为什么这本书非他不可" */
  selectionReason: string
  /** 针对维度 */
  targetDimension: WilderDimension
  /** 维度中文名 */
  dimensionName?: string
  /** 小挑战 */
  challenge: string
  /** 适合年龄 */
  ageRange: string
}

export interface PreciseDocumentary {
  /** 片名 */
  title: string
  /** 平台 */
  platform: string
  /** 时长 */
  duration: string
  /** 选入理由 */
  selectionReason: string
  /** 针对维度 */
  targetDimension: WilderDimension
  /** 维度中文名 */
  dimensionName?: string
  /** 观影小挑战 */
  challenge: string
  /** 心流触发点 */
  flowTrigger: string
}

export interface KeyAction {
  /** 行动类型 */
  type: 'competition' | 'museum' | 'camp' | 'course' | 'project'
  /** 行动名称 */
  title: string
  /** 时间窗口 */
  timeWindow: string
  /** 选入理由 */
  selectionReason: string
  /** 行动价值 */
  value: string
  /** 行动步骤 */
  steps: string[]
  /** 投入预估 */
  investment: string
}

export interface PreciseResourceResult {
  /** 3本必读书籍 */
  books: [PreciseBook, PreciseBook, PreciseBook]
  /** 2部深度纪录片 */
  documentaries: [PreciseDocumentary, PreciseDocumentary]
  /** 1个关键行动 */
  keyAction: KeyAction
  /** 主编推荐语 */
  editorNote: string
  /** 本季主题 */
  seasonTheme: string
}

export interface PreciseResourceInput {
  /** 孩子姓名 */
  name: string
  /** 孩子年龄 */
  age: number
  /** 画像编码 */
  profileCode: string
  /** 短板维度 */
  weakDimensions: WilderDimension[]
  /** 王牌维度 */
  strongDimensions: WilderDimension[]
  /** 天赋类型 */
  talentType: string
}

// ========== 书籍词库 ==========

const BOOK_DATABASE: Record<WilderDimension, Omit<PreciseBook, 'targetDimension'>[]> = {
  W: [
    {
      title: '《十万个为什么》精选版',
      author: '少年儿童出版社',
      coverColor: 'bg-purple-500',
      selectionReason: '这本书不是让TA学知识，而是保护TA问问题的本能。每一页都是"为什么"的温床。',
      challenge: '读完一章后，让TA提出一个书上没有答案的问题。',
      ageRange: '6-12岁'
    },
    {
      title: '《神奇校车》系列',
      author: '乔安娜·柯尔',
      coverColor: 'bg-indigo-500',
      selectionReason: '这套书把"好奇心"变成了探险故事。TA会跟着卷毛老师一起问"这到底是怎么回事？"',
      challenge: '找出书里哪个科学细节是作者虚构的，哪个是真的。',
      ageRange: '5-10岁'
    },
    {
      title: '《DK儿童百科全书》',
      author: 'DK出版社',
      coverColor: 'bg-violet-500',
      selectionReason: '好奇心的终极武器。图文并茂到让TA忍不住想"翻翻看下一页有什么"。',
      challenge: '每天只允许看2页，但要记住那2页的所有图片。',
      ageRange: '7-14岁'
    },
    {
      title: '《万物简史》少儿版',
      author: '比尔·布莱森',
      coverColor: 'bg-purple-600',
      selectionReason: '从宇宙大爆炸讲到人类文明，满足TA对"世界怎么来的"这个终极问题。',
      challenge: '用一句话概括这本书讲了什么。',
      ageRange: '10-16岁'
    }
  ],
  I: [
    {
      title: '《可怕的科学》系列',
      author: '尼克·阿诺德',
      coverColor: 'bg-blue-500',
      selectionReason: '这不是科普书，是"验证书"。每一个知识点都有实验和证据，完美匹配TA的求证本能。',
      challenge: '选一个书里的实验，在家里做一遍验证它。',
      ageRange: '8-14岁'
    },
    {
      title: '《侦探漫画》科学版',
      author: '多种',
      coverColor: 'bg-cyan-500',
      selectionReason: '用侦探故事训练逻辑推理。TA会爱上"用证据说话"的感觉。',
      challenge: '在凶手揭晓前，用自己的推理猜出凶手是谁。',
      ageRange: '8-12岁'
    },
    {
      title: '《法布尔昆虫记》',
      author: '法布尔',
      coverColor: 'bg-teal-500',
      selectionReason: '真实的观察记录，没有想象，只有证据。让TA学习什么是"科学式观察"。',
      challenge: '自己观察一种昆虫，写出像法布尔那样的观察日记。',
      ageRange: '8-15岁'
    },
    {
      title: '《逻辑思维训练500题》',
      author: '于雷',
      coverColor: 'bg-blue-600',
      selectionReason: '直接训练求证能力的工具书。每一题都需要"找证据"才能解决。',
      challenge: '每周只做5题，但要讲出解题的逻辑过程。',
      ageRange: '10-16岁'
    }
  ],
  L: [
    {
      title: '《小王子》',
      author: '圣埃克苏佩里',
      coverColor: 'bg-green-500',
      selectionReason: '关于"看见"和"被看见"的经典。TA会学会用心感受他人。',
      challenge: '找出书里小王子和玫瑰花之间的三次误解分别是什么。',
      ageRange: '8-99岁'
    },
    {
      title: '《夏洛的网》',
      author: 'E·B·怀特',
      coverColor: 'bg-emerald-500',
      selectionReason: '友谊、牺牲、承诺——这些抽象的概念在故事里变得真实可感。',
      challenge: '想象你是夏洛，你会为威尔伯写什么词？',
      ageRange: '7-12岁'
    },
    {
      title: '《奇迹男孩》',
      author: 'R·J·帕拉西奥',
      coverColor: 'bg-teal-500',
      selectionReason: '关于同理心的教科书。让TA理解"每个人都在打一场你不知道的仗"。',
      challenge: '用奥吉的视角，写一篇自己的日记。',
      ageRange: '9-14岁'
    },
    {
      title: '《窗边的小豆豆》',
      author: '黑柳彻子',
      coverColor: 'bg-green-600',
      selectionReason: '被理解的力量。让TA感受到"有人懂我"是什么感觉。',
      challenge: '找出小林校长对小豆豆做的3件特别的事。',
      ageRange: '7-13岁'
    }
  ],
  D: [
    {
      title: '《乐高创意搭建指南》',
      author: 'DK出版社',
      coverColor: 'bg-orange-500',
      selectionReason: '不只是搭积木，是学习"从想法到蓝图"的过程。',
      challenge: '不看图，自己设计并搭建一个书里没有的作品。',
      ageRange: '6-12岁'
    },
    {
      title: '《建筑设计入门》少儿版',
      author: '多种',
      coverColor: 'bg-amber-500',
      selectionReason: '满足TA对"把想法变成现实"的渴望。房子不是梦，是蓝图。',
      challenge: '画出自己理想卧室的平面图。',
      ageRange: '9-15岁'
    },
    {
      title: '《项目管理图解》',
      author: 'Eiichi Sato',
      coverColor: 'bg-yellow-500',
      selectionReason: '别被名字吓到，这是一本漫画。TA会学会怎么"把大事拆成小事"。',
      challenge: '用书里的方法，规划一次家庭周末活动。',
      ageRange: '10-16岁'
    },
    {
      title: '《机械设计入门》',
      author: 'David Macaulay',
      coverColor: 'bg-orange-600',
      selectionReason: '看到机器就像看透它的内部。这本书喂饱TA对"结构"的好奇心。',
      challenge: '选一个日常物品，画出它的内部结构猜测图。',
      ageRange: '9-16岁'
    }
  ],
  E: [
    {
      title: '《演讲的艺术》少儿版',
      author: '戴尔·卡耐基改编',
      coverColor: 'bg-pink-500',
      selectionReason: '表达力的技术手册。不是让你说得多，而是说得有力量。',
      challenge: '用书里的技巧，准备一个3分钟的自我介绍。',
      ageRange: '10-16岁'
    },
    {
      title: '《故事会讲故事》',
      author: '罗伯特·麦斯基改编',
      coverColor: 'bg-rose-500',
      selectionReason: '每个表达高手都是讲故事的人。这本书教TA怎么把普通的事讲得有趣。',
      challenge: '用书里的公式，把今天发生的事编成一个故事。',
      ageRange: '9-15岁'
    },
    {
      title: '《即兴演讲》青少年版',
      author: 'Judith Humphrey改编',
      coverColor: 'bg-fuchsia-500',
      selectionReason: '表达力的最高境界是"脱口而出"。这本书训练TA的即兴反应。',
      challenge: '随机选一个话题，准备30秒后说满1分钟。',
      ageRange: '11-17岁'
    },
    {
      title: '《TED演讲的秘密》',
      author: '杰里米·多诺万',
      coverColor: 'bg-pink-600',
      selectionReason: '世界上最好的表达者是怎么说的？这本书带TA拆解。',
      challenge: '选一个喜欢的TED演讲，用书里的框架分析它。',
      ageRange: '12-18岁'
    }
  ],
  R: [
    {
      title: '《苏菲的世界》',
      author: '乔斯坦·贾德',
      coverColor: 'bg-indigo-500',
      selectionReason: '反思力的终极读物。每一个哲学问题都是一面镜子。',
      challenge: '读完每章后，写下一个"我之前从没想过的问题"。',
      ageRange: '11-18岁'
    },
    {
      title: '《写给孩子的哲学启蒙书》',
      author: '碧姬·拉贝',
      coverColor: 'bg-violet-500',
      selectionReason: '把深奥的哲学问题变成日常对话。让TA学会"问自己问题"。',
      challenge: '选一个书里的问题，连续问自己7天，记录答案的变化。',
      ageRange: '9-14岁'
    },
    {
      title: '《思维导图》',
      author: '东尼·博赞',
      coverColor: 'bg-purple-500',
      selectionReason: '反思需要工具。思维导图让TA的内在想法变得可见。',
      challenge: '用思维导图复盘本周学到的最重要的东西。',
      ageRange: '8-16岁'
    },
    {
      title: '《冥想入门》少儿版',
      author: '多种',
      coverColor: 'bg-slate-500',
      selectionReason: '反思力的最高级是"观察自己"。这本书教TA静下来看自己。',
      challenge: '每天睡前冥想3分钟，观察自己的呼吸。',
      ageRange: '10-18岁'
    }
  ]
}

// ========== 纪录片词库 ==========

const DOCUMENTARY_DATABASE: Record<WilderDimension, Omit<PreciseDocumentary, 'targetDimension'>[]> = {
  W: [
    {
      title: '《宇宙时空之旅》',
      platform: 'B站/Netflix',
      duration: '13集×45分钟',
      selectionReason: '每一帧都在回答"为什么"。从宇宙尺度激发TA的好奇心。',
      challenge: '看完后，用5句话讲清楚"我们从哪来"这个问题。',
      flowTrigger: '宏大的视觉奇观会触发TA的探索欲，每一集都是一个新世界。'
    },
    {
      title: '《蓝色星球2》',
      platform: 'B站/BBC',
      duration: '7集×60分钟',
      selectionReason: '深海的未知感完美匹配好奇心。TA会忍不住问"下面还有什么？"',
      challenge: '找出一个科学家至今没研究清楚的深海现象。',
      flowTrigger: '从未见过的画面会让TA忘记时间流逝。'
    }
  ],
  I: [
    {
      title: '《像侦探一样思考》',
      platform: 'B站/腾讯',
      duration: '6集×50分钟',
      selectionReason: '每一个案件都需要证据链条。TA会学会"不妄下结论"。',
      challenge: '在真相揭晓前，列出你找到的所有证据。',
      flowTrigger: '抽丝剥茧的节奏会让TA的大脑持续运转。'
    },
    {
      title: '《科学实验大爆炸》',
      platform: 'B站/Discovery',
      duration: '20集×30分钟',
      selectionReason: '验证的本能在这里得到满足。每个实验都是"让我证明给你看"。',
      challenge: '选一个实验，预测结果后再看答案。',
      flowTrigger: '悬念-验证的循环会让TA沉浸其中。'
    }
  ],
  L: [
    {
      title: '《人生七年》系列',
      platform: 'B站/BBC',
      duration: '9集×90分钟',
      selectionReason: '看别人的人生，理解人生的复杂。共情力的终极训练场。',
      challenge: '选一个孩子，想象他28岁会是什么样。',
      flowTrigger: '真实的人生故事会让TA深度代入。'
    },
    {
      title: '《人间世》',
      platform: 'B站/爱奇艺',
      duration: '10集×45分钟',
      selectionReason: '生命、家庭、选择的重量。让TA理解"每个人的选择都有原因"。',
      challenge: '看完后，写下自己对"生命"的理解。',
      flowTrigger: '情感的深度会让TA长时间沉浸思考。'
    }
  ],
  D: [
    {
      title: '《抽象：设计的艺术》',
      platform: 'Netflix',
      duration: '8集×45分钟',
      selectionReason: '看世界顶级设计师如何"从想法到作品"。每一个案例都是蓝图思维。',
      challenge: '选一个设计师，总结TA的设计方法论。',
      flowTrigger: '设计过程的可视化会让TA欲罢不能。'
    },
    {
      title: '《超级工厂》',
      platform: 'B站/Discovery',
      duration: '多集×45分钟',
      selectionReason: '看一个产品从图纸到生产。规划力、执行力的终极展现。',
      challenge: '画出你想象的工厂流水线。',
      flowTrigger: '有序的过程会让TA感到愉悦。'
    }
  ],
  E: [
    {
      title: '《TED演讲精选》',
      platform: 'B站/TED官网',
      duration: '多集×15分钟',
      selectionReason: '每个演讲18分钟说清楚一件事。表达力的教科书级示范。',
      challenge: '选一个演讲，分析TA的开场和结尾用了什么技巧。',
      flowTrigger: '短小精悍的表达会让TA持续受到刺激。'
    },
    {
      title: '《国王的演讲》',
      platform: '各大视频平台',
      duration: '118分钟',
      selectionReason: '表达力的成长故事。让TA相信"表达是可以练出来的"。',
      challenge: '找出主人公的三个关键突破点。',
      flowTrigger: '成长叙事会让TA深度代入。'
    }
  ],
  R: [
    {
      title: '《生命里》',
      platform: 'B站/优酷',
      duration: '3集×50分钟',
      selectionReason: '面对死亡的思考。让TA学会珍惜、学会反思生命的意义。',
      challenge: '如果今天是生命的最后一天，你最想做什么？',
      flowTrigger: '深度的议题会让TA进入沉思状态。'
    },
    {
      title: '《地球之盐》',
      platform: 'B站/Netflix',
      duration: '110分钟',
      selectionReason: '摄影师的人生反思。用画面引导TA思考"我想成为什么人"。',
      challenge: '用一张照片记录你今天最想记住的瞬间。',
      flowTrigger: '视觉与哲学的结合会让TA深度沉浸。'
    }
  ]
}

// ========== 关键行动词库 ==========

const KEY_ACTIONS: Record<string, Omit<KeyAction, 'type'>> = {
  'W_strong': {
    title: '科学探究类竞赛（如青少年科技创新大赛）',
    timeWindow: '每年3-5月报名',
    selectionReason: '给好奇心一个出口。比赛会让TA从"问问题"升级到"研究问题"。',
    value: '获得研究性学习的完整体验，为升学积累竞争力',
    investment: '每周3-5小时，持续2-3个月',
    steps: [
      '从日常生活中发现一个值得研究的"为什么"',
      '设计简单的研究方法（观察/实验/调查）',
      '记录数据、整理发现',
      '制作展示海报或报告',
      '参加校级/区级选拔'
    ]
  },
  'I_strong': {
    title: '科学博物馆深度探索日',
    timeWindow: '本季度周末',
    selectionReason: '求证本能需要真实的对象。博物馆是最好的"证据库"。',
    value: '训练系统化观察和证据整理能力',
    investment: '单日4-6小时',
    steps: [
      '提前选定1-2个展区作为探索重点',
      '带上笔记本，记录所有"为什么"和可能的"答案"',
      '回家后验证至少3个发现',
      '制作一份"博物馆探索报告"'
    ]
  },
  'L_strong': {
    title: '团队项目式夏令营',
    timeWindow: '寒暑假',
    selectionReason: '联结力需要在真实团队中锻炼。夏令营是最好的社交实验室。',
    value: '深度体验团队协作，建立真实友谊',
    investment: '1-2周，5000-15000元',
    steps: [
      '选择主题符合兴趣的营地（科技/艺术/运动）',
      '提前了解团队分工模式',
      '主动争取一个协作型角色',
      '记录团队中的人际互动经验'
    ]
  },
  'D_strong': {
    title: '创客工坊/编程营',
    timeWindow: '本季度周末或假期',
    selectionReason: '设计力需要"动手"的验证。让TA体验从蓝图到成品的全过程。',
    value: '培养项目管理和动手实现能力',
    investment: '周末半天或集中营5天',
    steps: [
      '选择一个TA感兴趣的创造主题（机器人/木工/编程）',
      '从构思到设计草图',
      '动手制作并调试',
      '展示作品并收集反馈'
    ]
  },
  'E_strong': {
    title: '演讲/辩论训练班',
    timeWindow: '本季度',
    selectionReason: '表达力需要舞台。系统训练会让TA从"会说"升级到"说得有力量"。',
    value: '建立表达自信，掌握结构化表达技巧',
    investment: '每周2小时，持续8-12周',
    steps: [
      '选择一个适合TA水平的训练班',
      '每周练习一个表达技巧',
      '参加内部展示或比赛',
      '录制视频复盘进步'
    ]
  },
  'R_strong': {
    title: '写作/日记打卡计划',
    timeWindow: '即日起',
    selectionReason: '反思力需要输出的载体。写作是最好的自我对话方式。',
    value: '建立持续的自我觉察习惯',
    investment: '每天15分钟',
    steps: [
      '准备一本专门的反思笔记本',
      '每天睡前回答三个问题：今天最骄傲的事、最想改进的事、明天的目标',
      '每周回顾一次本周的反思',
      '每月总结自己的成长轨迹'
    ]
  }
}

// ========== 主编推荐语词库 ==========

const EDITOR_NOTES: Record<string, string> = {
  'W': '好奇心是最珍贵的种子。这些资源不是让TA学知识，而是保护TA问问题的本能。记住：AI能回答所有问题，但不会对蝴蝶感到好奇。',
  'I': '求证精神是科学家的核心特质。这些资源会训练TA从"听说"到"验证"的思维习惯。在信息爆炸的时代，真相过滤器是最稀缺的能力。',
  'L': '联结力是未来领导力的根基。这些资源会帮助TA理解他人、建立关系。记住：一个人能走多远，取决于和谁一起走。',
  'D': '设计力是"把想法变成现实"的能力。这些资源会训练TA从天马行空到脚踏实地的思维闭环。未来属于能"做出来"的人。',
  'E': '表达力=内容×人格×临场感。这些资源不只是让TA说得好听，而是说得有力量。记住：影响力从开口那一刻开始。',
  'R': '反思力是智慧提取器。这些资源会帮助TA从经历中提炼经验，从经验中生长智慧。记住：不会反思的人，重复20年也只是1年经验用了20次。'
}

// ========== 核心生成函数 ==========

/** WILDER维度中文名映射 */
const DIMENSION_NAMES: Record<WilderDimension, string> = {
  W: '好奇心',
  I: '探究力',
  L: '联结力',
  D: '设计力',
  E: '表达力',
  R: '反思力',
}

/**
 * 随机选择数组元素
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * 根据维度选择书籍
 */
function selectBooks(
  strongDims: WilderDimension[],
  weakDims: WilderDimension[],
  name: string
): [PreciseBook, PreciseBook, PreciseBook] {
  const selectedBooks: PreciseBook[] = []

  // 第一本：针对王牌维度，极致加强
  if (strongDims.length > 0) {
    const dim = strongDims[0]
    const books = BOOK_DATABASE[dim]
    const book = pickRandom(books)
    selectedBooks.push({
      ...book,
      targetDimension: dim,
      dimensionName: DIMENSION_NAMES[dim],
      selectionReason: book.selectionReason.replace(/{name}/g, name)
    })
  }

  // 第二本：针对短板维度，精准补齐
  if (weakDims.length > 0) {
    const dim = weakDims[0]
    const books = BOOK_DATABASE[dim]
    const book = pickRandom(books)
    selectedBooks.push({
      ...book,
      targetDimension: dim,
      dimensionName: DIMENSION_NAMES[dim],
      selectionReason: book.selectionReason.replace(/{name}/g, name)
    })
  }

  // 第三本：针对第二长板或第二短板
  const thirdDim = strongDims[1] || weakDims[1] || strongDims[0]
  const books = BOOK_DATABASE[thirdDim]
  const book = pickRandom(books)
  selectedBooks.push({
    ...book,
    targetDimension: thirdDim,
    dimensionName: DIMENSION_NAMES[thirdDim],
    selectionReason: book.selectionReason.replace(/{name}/g, name)
  })

  return selectedBooks as [PreciseBook, PreciseBook, PreciseBook]
}

/**
 * 根据维度选择纪录片
 */
function selectDocumentaries(
  strongDims: WilderDimension[],
  name: string
): [PreciseDocumentary, PreciseDocumentary] {
  const selectedDocs: PreciseDocumentary[] = []

  // 两部纪录片都针对王牌维度，激发心流
  for (let i = 0; i < 2; i++) {
    const dim = strongDims[i] || strongDims[0]
    const docs = DOCUMENTARY_DATABASE[dim]
    const doc = pickRandom(docs)
    selectedDocs.push({
      ...doc,
      targetDimension: dim,
      dimensionName: DIMENSION_NAMES[dim],
      selectionReason: doc.selectionReason.replace(/{name}/g, name)
    })
  }

  return selectedDocs as [PreciseDocumentary, PreciseDocumentary]
}

/**
 * 选择关键行动
 */
function selectKeyAction(
  strongDims: WilderDimension[],
  _weakDims: WilderDimension[],
  name: string
): KeyAction {
  // 优先针对王牌维度
  const dim = strongDims[0]
  const key = `${dim}_strong` as keyof typeof KEY_ACTIONS

  const actionData = KEY_ACTIONS[key] || KEY_ACTIONS['W_strong']

  return {
    type: key.includes('竞赛') ? 'competition' : key.includes('博物馆') ? 'museum' : key.includes('营') ? 'camp' : 'project',
    ...actionData,
    selectionReason: actionData.selectionReason.replace(/{name}/g, name)
  }
}

/**
 * 生成主编推荐语
 */
function generateEditorNote(strongDims: WilderDimension[]): string {
  const dim = strongDims[0] || 'W'
  return EDITOR_NOTES[dim] || EDITOR_NOTES['W']
}

/**
 * 生成本季主题
 */
function generateSeasonTheme(
  strongDims: WilderDimension[],
  weakDims: WilderDimension[],
  name: string
): string {
  const dimNames: Record<WilderDimension, string> = {
    W: '探索', I: '求证', L: '连接', D: '创造', E: '表达', R: '反思'
  }

  const strong = dimNames[strongDims[0]] || '成长'
  const weak = weakDims[0] ? dimNames[weakDims[0]] : ''

  if (weak) {
    return `${strong}为剑，${weak}为盾——这个季度，${name}的全面成长计划`
  }
  return `${strong}为本，持续精进——这个季度，${name}的能力强化计划`
}

// ========== 主导出函数 ==========

/**
 * 生成精准投喂资源
 */
export function generatePreciseResources(input: PreciseResourceInput): PreciseResourceResult {
  const { name, strongDimensions, weakDimensions } = input

  return {
    books: selectBooks(strongDimensions, weakDimensions, name),
    documentaries: selectDocumentaries(strongDimensions, name),
    keyAction: selectKeyAction(strongDimensions, weakDimensions, name),
    editorNote: generateEditorNote(strongDimensions),
    seasonTheme: generateSeasonTheme(strongDimensions, weakDimensions, name)
  }
}

export default {
  generatePreciseResources
}
