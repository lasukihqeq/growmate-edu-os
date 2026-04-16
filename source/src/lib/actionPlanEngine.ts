// ===================================================================
// GrowMate 14天行动清单引擎 v1.0
// 把100页建议拆解成原子级动作，今晚就能用
// L3 行动层：极简14天指令 + 话术模板 + 勋章时刻
// ===================================================================

import type { WilderDimension } from './wilderKernel'

// ========== 类型定义 ==========

export interface DailyAction {
  /** 天数 */
  day: number
  /** 场景名称 */
  sceneName: string
  /** 场景emoji */
  sceneEmoji: string
  /** 任务标题 */
  taskTitle: string
  /** 任务描述 */
  taskDescription: string
  /** 家长话术模板 */
  parentScript: string
  /** 目标维度 */
  targetDimension: WilderDimension
  /** 维度名称 */
  dimensionName: string
  /** 预计时长 */
  duration: string
  /** 是否为勋章时刻 */
  isBadgeMoment: boolean
  /** 勋章提示（如果有） */
  badgeHint?: string
}

export interface ActionPlanResult {
  /** 14天行动计划 */
  actions: DailyAction[]
  /** 行动口号 */
  slogan: string
  /** 开场引导语 */
  openingGuide: string
  /** 完成激励语 */
  completionReward: string
}

export interface ActionPlanInput {
  /** 孩子姓名 */
  name: string
  /** 孩子年龄 */
  age: number
  /** 画像编码 */
  profileCode: string
  /** 需要重点培养的维度（短板） */
  focusDimensions: WilderDimension[]
  /** 优势维度 */
  strongDimensions: WilderDimension[]
}

// ========== 动作词库 ==========

/** 各维度的具体行动模板 */
const DIMENSION_ACTIONS: Record<WilderDimension, Omit<DailyAction, 'day' | 'isBadgeMoment' | 'badgeHint'>[]> = {
  // ═══════════════════════════════════════════════════════════════
  // W - 好奇心培养动作
  // ═══════════════════════════════════════════════════════════════
  W: [
    {
      sceneName: '餐桌上的脑洞',
      sceneEmoji: '🍽️',
      taskTitle: '如果...会怎样',
      taskDescription: '今晚吃饭时，问孩子一个"如果...会怎样"的问题，激发TA的想象力。',
      parentScript: '"如果家里的冰箱要搬到月球上，你觉得最难的一步是什么？"',
      targetDimension: 'W',
      dimensionName: '好奇心',
      duration: '3分钟'
    },
    {
      sceneName: '上学路上',
      sceneEmoji: '🚶',
      taskTitle: '发现3个不一样',
      taskDescription: '让孩子找出路上今天和昨天不同的3个地方。',
      parentScript: '"宝贝，今天路上有什么和昨天不一样的地方吗？我们来比赛谁先发现3个！"',
      targetDimension: 'W',
      dimensionName: '好奇心',
      duration: '5分钟'
    },
    {
      sceneName: '睡前时光',
      sceneEmoji: '🌙',
      taskTitle: '今日之问',
      taskDescription: '问孩子今天最想弄明白的一件事。',
      parentScript: '"今天有没有遇到什么让你觉得\'好奇怪\'的事？说出来我们一起猜猜为什么。"',
      targetDimension: 'W',
      dimensionName: '好奇心',
      duration: '5分钟'
    },
    {
      sceneName: '周末探险',
      sceneEmoji: '🔍',
      taskTitle: '家庭小调查',
      taskDescription: '选一个孩子好奇的话题，一起查资料、找答案。',
      parentScript: '"你说想知道蚂蚁怎么交流的，咱们今天来当一回蚂蚁侦探，看看能不能找到答案！"',
      targetDimension: 'W',
      dimensionName: '好奇心',
      duration: '15分钟'
    }
  ],

  // ═══════════════════════════════════════════════════════════════
  // I - 探究力培养动作
  // ═══════════════════════════════════════════════════════════════
  I: [
    {
      sceneName: '餐桌辩论',
      sceneEmoji: '🗣️',
      taskTitle: '证据猎人',
      taskDescription: '讨论一个话题时，要求孩子用"证据"说话。',
      parentScript: '"你觉得这个观点对吗？能给我找一个证据支持你的想法吗？"',
      targetDimension: 'I',
      dimensionName: '探究力',
      duration: '5分钟'
    },
    {
      sceneName: '实验时间',
      sceneEmoji: '🧪',
      taskTitle: '小小验证官',
      taskDescription: '让孩子验证一个"据说"的事实。',
      parentScript: '"书上说冰会浮在水面上，你觉得真的吗？要不我们来做实验验证一下？"',
      targetDimension: 'I',
      dimensionName: '探究力',
      duration: '10分钟'
    },
    {
      sceneName: '新闻时刻',
      sceneEmoji: '📰',
      taskTitle: '真假大侦探',
      taskDescription: '看到一个新闻，问孩子"你怎么知道这是真的？"',
      parentScript: '"这个新闻说...你觉得可信吗？我们一起来找找证据，看看它是真的还是假的。"',
      targetDimension: 'I',
      dimensionName: '探究力',
      duration: '5分钟'
    },
    {
      sceneName: '生活小实验',
      sceneEmoji: '🔬',
      taskTitle: '变量控制游戏',
      taskDescription: '引导孩子思考"如果只改一个条件会怎样"。',
      parentScript: '"你觉得种子发芽需要什么？如果只给阳光不给水会怎样？我们设计一个实验试试！"',
      targetDimension: 'I',
      dimensionName: '探究力',
      duration: '15分钟'
    }
  ],

  // ═══════════════════════════════════════════════════════════════
  // L - 联结力培养动作
  // ═══════════════════════════════════════════════════════════════
  L: [
    {
      sceneName: '家庭会议',
      sceneEmoji: '👨‍👩‍👧',
      taskTitle: '感受传声筒',
      taskDescription: '让每个家庭成员分享今天最开心的瞬间。',
      parentScript: '"今晚我们家来玩个游戏，每个人说一件今天让自己开心的事，然后其他人都说出自己听到后的感受。"',
      targetDimension: 'L',
      dimensionName: '联结力',
      duration: '10分钟'
    },
    {
      sceneName: '社交复盘',
      sceneEmoji: '🤝',
      taskTitle: '朋友观察家',
      taskDescription: '问孩子今天和朋友相处时对方说了什么做了什么。',
      parentScript: '"今天你和朋友玩的时候，你有没有注意到TA说了什么或者做了什么？你觉得TA当时是什么心情？"',
      targetDimension: 'L',
      dimensionName: '联结力',
      duration: '5分钟'
    },
    {
      sceneName: '团队任务',
      sceneEmoji: '🎯',
      taskTitle: '分工小队长',
      taskDescription: '给孩子一个家庭任务的分工协调权。',
      parentScript: '"今天大扫除，你来当小队长，想想我们三个人怎么分工最快最公平？"',
      targetDimension: 'L',
      dimensionName: '联结力',
      duration: '10分钟'
    },
    {
      sceneName: '感恩时刻',
      sceneEmoji: '💝',
      taskTitle: '感谢信计划',
      taskDescription: '让孩子给今天帮助过自己的人说一声谢谢。',
      parentScript: '"今天有没有人帮助过你？要不我们去跟TA说声谢谢？"',
      targetDimension: 'L',
      dimensionName: '联结力',
      duration: '3分钟'
    }
  ],

  // ═══════════════════════════════════════════════════════════════
  // D - 设计力培养动作
  // ═══════════════════════════════════════════════════════════════
  D: [
    {
      sceneName: '任务规划',
      sceneEmoji: '📋',
      taskTitle: '小小规划师',
      taskDescription: '让孩子为明天的活动做计划。',
      parentScript: '"明天周六，我们有三件事要做：去超市、写作业、去公园。你来帮我们规划一下，怎么安排时间最合理？"',
      targetDimension: 'D',
      dimensionName: '设计力',
      duration: '5分钟'
    },
    {
      sceneName: '空间设计',
      sceneEmoji: '🏠',
      taskTitle: '房间改造家',
      taskDescription: '让孩子重新设计自己房间的布局。',
      parentScript: '"如果让你重新布置你的房间，你会怎么摆？画个图给我看看！"',
      targetDimension: 'D',
      dimensionName: '设计力',
      duration: '10分钟'
    },
    {
      sceneName: '目标分解',
      sceneEmoji: '🎯',
      taskTitle: '任务拆解大师',
      taskDescription: '把一个大目标拆成小步骤。',
      parentScript: '"你说想学会骑自行车，我们来拆解一下，第一步是什么？第二步呢？"',
      targetDimension: 'D',
      dimensionName: '设计力',
      duration: '5分钟'
    },
    {
      sceneName: '项目设计',
      sceneEmoji: '🏗️',
      taskTitle: '乐高建筑师',
      taskDescription: '让孩子设计并完成一个积木/手工作品。',
      parentScript: '"今天我们来当建筑师，你想搭什么？先在纸上画个设计图，然后我们来动手实现！"',
      targetDimension: 'D',
      dimensionName: '设计力',
      duration: '20分钟'
    }
  ],

  // ═══════════════════════════════════════════════════════════════
  // E - 表达力培养动作
  // ═══════════════════════════════════════════════════════════════
  E: [
    {
      sceneName: '故事时间',
      sceneEmoji: '📖',
      taskTitle: '一句话故事',
      taskDescription: '让孩子用一句话讲完一个故事。',
      parentScript: '"我们来玩个游戏：我给你三个词，你用一句话讲一个故事！比如：小猫、月亮、魔法。"',
      targetDimension: 'E',
      dimensionName: '表达力',
      duration: '3分钟'
    },
    {
      sceneName: '今日汇报',
      sceneEmoji: '🎤',
      taskTitle: '3分钟演讲',
      taskDescription: '让孩子做今天的"新闻发言人"。',
      parentScript: '"今天你来当新闻发言人，用3分钟告诉我们今天发生的最重要的事！"',
      targetDimension: 'E',
      dimensionName: '表达力',
      duration: '5分钟'
    },
    {
      sceneName: '情绪表达',
      sceneEmoji: '💭',
      taskTitle: '感受翻译官',
      taskDescription: '帮孩子用语言描述复杂的感受。',
      parentScript: '"你现在是什么感觉？开心？难过？还是有点紧张？说出来，我帮你一起理解。"',
      targetDimension: 'E',
      dimensionName: '表达力',
      duration: '3分钟'
    },
    {
      sceneName: '说服训练',
      sceneEmoji: '🎪',
      taskTitle: '小小说服家',
      taskDescription: '让孩子用3个理由说服你同意一个请求。',
      parentScript: '"你想看动画片可以，但你要给我三个理由说服我，为什么今天应该让你看。"',
      targetDimension: 'E',
      dimensionName: '表达力',
      duration: '5分钟'
    }
  ],

  // ═══════════════════════════════════════════════════════════════
  // R - 反思力培养动作
  // ═══════════════════════════════════════════════════════════════
  R: [
    {
      sceneName: '睡前复盘',
      sceneEmoji: '🌙',
      taskTitle: '今日三问',
      taskDescription: '每天睡前问孩子3个反思问题。',
      parentScript: '"睡觉前我们来聊聊：今天最骄傲的事是什么？最想改进的事是什么？明天想做得更好的是什么？"',
      targetDimension: 'R',
      dimensionName: '反思力',
      duration: '5分钟'
    },
    {
      sceneName: '经验总结',
      sceneEmoji: '📝',
      taskTitle: '错误日记',
      taskDescription: '记录今天的"失败"和从中学到的东西。',
      parentScript: '"今天有没有遇到什么困难或者犯错？没关系，我们把这件事记下来，想想下次怎么做会更好。"',
      targetDimension: 'R',
      dimensionName: '反思力',
      duration: '5分钟'
    },
    {
      sceneName: '情绪复盘',
      sceneEmoji: '🧘',
      taskTitle: '情绪温度计',
      taskDescription: '让孩子评估自己今天的情绪状态。',
      parentScript: '"如果1到10分，你今天的心情是几分？为什么是这个分数？有没有什么让分数变高/变低的时刻？"',
      targetDimension: 'R',
      dimensionName: '反思力',
      duration: '3分钟'
    },
    {
      sceneName: '成长对比',
      sceneEmoji: '📈',
      taskTitle: '自己VS自己',
      taskDescription: '让孩子比较现在的自己和过去的变化。',
      parentScript: '"你想想，半年前的你和现在比，有什么不一样了？你觉得自己进步了什么？"',
      targetDimension: 'R',
      dimensionName: '反思力',
      duration: '5分钟'
    }
  ]
}

// 勋章配置
const BADGE_MOMENTS = [
  {
    day: 3,
    hint: '如果孩子今天给出了让你惊喜的回答，点击这里记录下来，生成TA的第一张"成长高光卡片"！'
  },
  {
    day: 7,
    hint: '一周里程碑！如果孩子主动使用了本周学到的方法，拍照上传，解锁"小小改变家"勋章！'
  },
  {
    day: 10,
    hint: '如果孩子在某个场景中表现出明显的进步，记录这个"突破时刻"，为TA建立成长档案。'
  },
  {
    day: 14,
    hint: '恭喜完成14天计划！点击生成专属的"成长蜕变报告"，记录这14天的所有高光时刻。'
  }
]

// 开场引导语
const OPENING_GUIDES: Record<number, string> = {
  3: '别被100页报告吓到，我们帮你把最核心的动作拆解成了14天的小任务。每天只需要5分钟，今晚就能开始。',
  6: '道理都懂，但不知道今晚怎么跟孩子说话？这14个"微行动"，让改变从今晚的餐桌开始。',
  9: '不需要昂贵的教具，不需要大把的时间。这14天，我们陪你在日常生活的缝隙里，种下能力成长的种子。',
  12: '每天5分钟，14天后你会看到变化。不是魔法，是科学的积累。准备好了吗？从今天开始。'
}

// 完成激励语
const COMPLETION_REWARDS = [
  '恭喜完成14天行动！孩子的能力就像肌肉，越练越强。这只是开始，继续保持！',
  '14天的坚持，比任何礼物都珍贵。孩子的每一次进步，都被悄悄记录在成长档案里了。',
  '行动是检验认知的唯一标准。你做到了，孩子也感受到了。这份陪伴，是无价的教育。'
]

// ========== 核心生成函数 ==========

/**
 * 随机选择数组元素
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * 根据年龄调整开场语
 */
function getOpeningGuide(age: number): string {
  if (age <= 6) return OPENING_GUIDES[3]
  if (age <= 9) return OPENING_GUIDES[6]
  if (age <= 12) return OPENING_GUIDES[9]
  return OPENING_GUIDES[12]
}

/**
 * 生成14天行动计划
 */
export function generateActionPlan(input: ActionPlanInput): ActionPlanResult {
  const { name, age, focusDimensions, strongDimensions } = input

  const actions: DailyAction[] = []

  // 确定维度优先级：先短板，后长板（保持优势）
  const dimensionPriority = [...focusDimensions, ...strongDimensions]
  // 去重
  const uniqueDimensions = [...new Set(dimensionPriority)]

  // 如果没有维度，默认用全部
  const dimsToUse = uniqueDimensions.length > 0 ? uniqueDimensions : ['W' as WilderDimension, 'I' as WilderDimension, 'L' as WilderDimension]

  // 为14天分配动作
  let actionIndex = 0
  for (let day = 1; day <= 14; day++) {
    // 循环选择维度
    const dim = dimsToUse[actionIndex % dimsToUse.length]
    const dimActions = DIMENSION_ACTIONS[dim]

    // 选择该维度下的一个动作
    const action = dimActions[day % dimActions.length]

    // 检查是否是勋章时刻
    const badgeConfig = BADGE_MOMENTS.find(b => b.day === day)

    actions.push({
      day,
      sceneName: action.sceneName,
      sceneEmoji: action.sceneEmoji,
      taskTitle: action.taskTitle,
      taskDescription: action.taskDescription.replace(/{name}/g, name),
      parentScript: action.parentScript.replace(/{name}/g, name),
      targetDimension: action.targetDimension,
      dimensionName: action.dimensionName,
      duration: action.duration,
      isBadgeMoment: !!badgeConfig,
      badgeHint: badgeConfig?.hint
    })

    actionIndex++
  }

  return {
    actions,
    slogan: '每天5分钟，14天看到变化',
    openingGuide: getOpeningGuide(age),
    completionReward: pickRandom(COMPLETION_REWARDS).replace(/{name}/g, name)
  }
}

/**
 * 获取单日行动（按天索引）
 */
export function getDailyAction(input: ActionPlanInput, day: number): DailyAction | null {
  const plan = generateActionPlan(input)
  return plan.actions.find(a => a.day === day) || null
}

export default {
  generateActionPlan,
  getDailyAction
}
