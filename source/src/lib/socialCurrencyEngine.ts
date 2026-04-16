// ===================================================================
// GrowMate 社交货币生成引擎 v1.0
// 把冷冰冰的测评数据翻译成家长发朋友圈时自带光环的文案
// L1 社交货币层：天赋人设海报
// ===================================================================

import type { WilderDimension } from './wilderKernel'

// ========== 类型定义 ==========

/** WILDER维度分数字典 */
export type WilderScores = Record<WilderDimension, number>

export interface SocialCurrency {
  /** 天赋头衔 - 富有文学色彩或跨界感的名字 */
  talentTitle: string
  /** 灵魂一句话 - 让家长产生"这就是我孩子"共鸣 */
  soulSentence: string
  /** 三个闪光标签 - 高级感词汇 */
  shiningTags: [string, string, string]
  /** 朋友圈炫娃文案 - 模拟家长口吻 */
  momentsText: string
  /** 视觉意象 - 用于海报设计 */
  visualMetaphor: string
}

export interface SocialCurrencyInput {
  /** 孩子姓名 */
  name: string
  /** 画像编码 e.g. "W3I2L1D2E1R1" */
  profileCode: string
  /** WILDER维度分值 */
  wilderScores: Record<string, number>
  /** WILDER维度百分比 */
  wilderPercentiles: Record<string, number>
  /** 天赋类型名称 */
  talentTypeName: string
  /** 天赋类型key */
  talentTypeKey: string
}

// ========== 天赋头衔词库 ==========

/** 维度对应的跨界头衔词根 */
const TITLE_ROOTS: Record<WilderDimension, { prefix: string[]; suffix: string[] }> = {
  W: {
    prefix: ['星际', '万物', '未知', '追问', '探索'],
    suffix: ['航海家', '探险家', '叩问者', '发现官', '采集师']
  },
  I: {
    prefix: ['逻辑', '证据', '真相', '求证', '实验'],
    suffix: ['织网者', '捕手', '卫士', '工程师', '分析师']
  },
  L: {
    prefix: ['纽带', '温暖', '连接', '桥梁', '共鸣'],
    suffix: ['核心', '粘合剂', '守护者', '协调师', '建造师']
  },
  D: {
    prefix: ['蓝图', '结构', '系统', '规划', '建造'],
    suffix: ['大师', '架构师', '设计师', '工程师', '策划官']
  },
  E: {
    prefix: ['舞台', '故事', '光芒', '声浪', '传播'],
    suffix: ['之星', '讲述者', '策展人', '大使', '主理人']
  },
  R: {
    prefix: ['内观', '洞察', '静水', '深度', '镜'],
    suffix: ['先知', '思考者', '哲人', '观察官', '领航员']
  }
}

/** 双维度组合的头衔模板 */
const DUAL_TITLE_TEMPLATES: Record<string, string[]> = {
  'W+I': ['宇宙实验室的首席观察官', '万物逻辑的破译者', '会提问的真理猎人'],
  'W+L': ['人群中的探险队长', '温暖的好奇心发射台', '带团队去发现的领航员'],
  'W+D': ['未来蓝图的设计师', '把为什么变成怎么办的工程师', '星际时代的规划师'],
  'W+E': ['故事里的探险家', '能说会问的发现官', '用表达点亮好奇的传播者'],
  'W+R': ['沉思的探索者', '在追问中自省的智者', '内外兼修的叩问者'],
  'I+L': ['团队的逻辑中枢', '温暖的分析师', '会协作的求证者'],
  'I+D': ['结构化本能的建造师', '逻辑织网者', '严丝合缝的系统设计师'],
  'I+E': ['会说理的故事家', '用证据讲故事的传播者', '逻辑与表达的双核驱动'],
  'I+R': ['深度分析的哲学家', '自我审视的求真者', '证据之镜的守护者'],
  'L+D': ['团队的规划核心', '连接与设计双引擎', '人群中的蓝图师'],
  'L+E': ['光芒四射的连接者', '用故事凝聚人心的策展人', '舞台上的纽带'],
  'L+R': ['静默的关怀者', '深度共情的观察家', '温柔的内省者'],
  'D+E': ['蓝图讲述者', '会设计会表达的复合型', '规划与传播双引擎'],
  'D+R': ['内敛的建造师', '自我迭代的规划师', '设计人生的设计师'],
  'E+R': ['会讲故事的哲学家', '表达与自省双修', '光芒下的思考者']
}

/** 三维度组合的头衔模板 */
const TRIPLE_TITLE_TEMPLATES: Record<string, string[]> = {
  'W+I+D': ['星际航海时代的逻辑师', '科学家式的工程师', '从提问到建造的全能选手'],
  'W+I+L': ['带领团队探索真理的队长', '好奇又严谨的协作者', '科学探险队的灵魂人物'],
  'W+I+E': ['会说会问的科学传播者', '科普大使', '好奇心驱动的故事家'],
  'W+I+R': ['深思的科学叩问者', '追问真理的哲学家', '内省的研究者'],
  'W+D+E': ['创意蓝图讲述者', '未来设计师兼传播官', '从想法到表达的完整链条'],
  'I+D+L': ['团队的系统建造师', '逻辑与协作的工程师', '为团队设计最优路径'],
  'I+D+R': ['自我迭代的系统设计师', '深思熟虑的建造师', '闭环思考者'],
  'L+E+R': ['温柔的故事哲学家', '会共情会表达的智者', '深度连接者']
}

// ========== 灵魂一句话词库 ==========

const SOUL_SENTENCES: Record<WilderDimension, string[]> = {
  W: [
    '在别人只看到树叶的地方，他已经推导出了整片森林的供水系统。',
    '他的眼睛总是在寻找答案，而他的问题总是在创造新问题。',
    '对世界保持好奇，是他最珍贵的超能力。',
    '他不会停止追问，因为每个答案背后都藏着更大的世界。'
  ],
  I: [
    '他不是"较真"，而是在用最严谨的方式守护真相。',
    '当别人接受答案时，他在追问证据；当别人相信时，他在验证。',
    '他的逻辑像解开的鲁班锁，严丝合缝却又充满变幻。',
    '在信息爆炸的时代，他是天生的"真相过滤器"。'
  ],
  L: [
    '他不需要成为人群中最亮的星，但每个团队都离不开他。',
    '他能让陌生人变成朋友，让朋友变成战友。',
    '他的温暖不是软弱，而是一种把人凝聚在一起的隐形力量。',
    '在任何群体里，他都是那个让一切变得更顺畅的"润滑剂"。'
  ],
  D: [
    '给他一个目标，他能画出一张让所有人看懂的地图。',
    '他的脑子里有一张永远在更新的蓝图。',
    '他不是"控制欲强"，是天生的规划师——看到混乱就想整理。',
    '当别人还在想"做什么"，他已经想清楚"怎么做"了。'
  ],
  E: [
    '他能把最枯燥的事，讲成最有趣的故事。',
    '站在台上，他就是光。',
    '他的表达不只是说话，而是在创造影响力。',
    '当他开口，整个房间都会安静下来听。'
  ],
  R: [
    '他比同龄人多一面"认知镜"，能看到自己在想什么。',
    '他的内心像一汪深水，表面平静，内在澄澈。',
    '他不是"想太多"，是在用最珍贵的方式消化世界。',
    '每次经历，他都能提炼出比别人多十倍的智慧。'
  ]
}

const DUAL_SOUL_SENTENCES: Record<string, string[]> = {
  'W+I': [
    '他既有科学家的好奇心，又有侦探的求证精神。',
    '问出好问题只是第一步，他还会亲自去验证答案。',
    '在探索真理的路上，他既敢问，也敢验。'
  ],
  'W+D': [
    '他不仅会问"为什么"，还能设计出"怎么办"。',
    '好奇心是他的燃料，规划力是他的引擎。',
    '从天马行空到脚踏实地，他一个人就是一个闭环。'
  ],
  'I+D': [
    '他的思维像精密仪器，既能分析问题，又能设计解决方案。',
    '逻辑是他的眼睛，设计是他的手。',
    '在别人只看到混乱时，他已经在脑海里搭建好了系统。'
  ],
  'L+E': [
    '他既能感知每个人的情绪，又能把这种感知变成动人的表达。',
    '他是团队的温暖核心，也是最会讲故事的那个人。',
    '当他说"我们"，整个世界都愿意跟着他走。'
  ],
  'E+R': [
    '他会表达，更会自省；既能影响别人，也在不断优化自己。',
    '他的光芒不是用来照亮别人，而是映照内心的澄澈。',
    '台上闪闪发光，台下深度思考——这就是他的双面魅力。'
  ]
}

// ========== 闪光标签词库 ==========

const SHINING_TAGS: Record<WilderDimension, string[]> = {
  W: ['#追问本能', '#万物观察家', '#好奇心驱动', '#为什么专家', '#探索者思维'],
  I: ['#逻辑织网者', '#证据重度依赖', '#真相过滤器', '#严谨到骨子里', '#求证本能'],
  L: ['#人群粘合剂', '#温暖核心', '#团队润滑剂', '#共情力MAX', '#隐形支柱'],
  D: ['#结构化本能', '#蓝图天生', '#系统建造师', '#规划闭环', '#从0到1专家'],
  E: ['#舞台引力', '#故事策展人', '#声音发光体', '#影响力制造机', '#表达即武器'],
  R: ['#内观之镜', '#深度消化者', '#智慧提炼师', '#自我迭代者', '#静水流深']
}

const DUAL_TAG_COMBOS: Record<string, string[]> = {
  'W+I': ['#科学侦探', '#真理猎手', '#验证型好奇', '#探究闭环'],
  'W+D': ['#未来设计师', '#探索工程师', '#创意实现者', '#好奇心造物主'],
  'I+D': ['#逻辑架构师', '#系统化思维', '#精密建造者', '#细节控捕手'],
  'W+E': ['#故事探险家', '#好奇传播者', '#会问会说的发现官', '#科普DNA'],
  'I+E': ['#逻辑讲述者', '#会说理的故事家', '#证据派传播者', '#理性光芒'],
  'L+E': ['#温暖影响力', '#故事型领导', '#共情传播者', '#人群中的光'],
  'D+E': ['#蓝图讲述者', '#设计传播官', '#会说会设计的复合型', '#表达型规划师'],
  'L+R': ['#深度关怀者', '#温柔哲人', '#内省型连接者', '#静默核心'],
  'E+R': ['#光芒思考者', '#自省型传播者', '#双面魅力', '#台上闪亮台下深沉'],
  'D+R': ['#自省型建造师', '#迭代设计师', '#内观规划师', '#智慧蓝图'],
  'I+R': ['#深度分析师', '#求真哲人', '#内省逻辑师', '#验证型智慧']
}

// ========== 朋友圈文案模板 ==========

const MOMENTS_TEMPLATES: Record<string, string[]> = {
  'single-W': [
    '刚做完{name}的科学潜能测评，结果让我沉默了——他的好奇心得分远超同龄人。老师说："AI能回答所有问题，但不会对蝴蝶感到好奇。"{name}问的问题，是AI的边界。突然觉得，保护好他眼里的光，比让他多背十个单词重要。',
    '分享一下今天的测评惊喜。{name}的天赋类型是"好奇先锋"——不是爱问问题那么简单，而是能"问出好问题"。测评报告说，这比找到答案更重要。想起他问过我："妈妈，月亮为什么跟着我们走？"那时候我敷衍过去了，现在想想，也许该认真回答。',
  ],
  'single-I': [
    '{name}的测评结果出来了："求真卫士"。原来他平时那些"较真"和"追问到底"，不是倔，是科学家式的求证本能。报告里有一句话让我印象深刻："他不是在质疑，而是在用最严谨的方式守护真相。"这话我得记下来，下次他再问我"为什么"的时候，我要更耐心。',
  ],
  'single-L': [
    '今天解锁了{name}的天赋密码——"纽带核心"。测评老师说，他在任何群体里都是那个让一切变顺畅的人。不是最亮的星，但每个团队都离不开他。突然想到他在学校总是那个帮同学和老师沟通的角色。这种"隐形支柱"的能力，也许比当第一名更珍贵。',
  ],
  'single-D': [
    '{name}的潜能测评结果："蓝图大师"。怪不得他玩游戏总是先规划策略，做作业也要列计划。原来这是天赋。报告里写："给他一个目标，他能画出一张让所有人看懂的地图。"这孩子以后可能是要当产品经理或者建筑师的节奏？',
  ],
  'single-E': [
    '分享一个有趣的结果：{name}是"舞台之星"。测评报告写："他能把最枯燥的事，讲成最有趣的故事。"难怪他在班级里总是那个发言的代表。老师说，表达力=内容×人格×临场感，AI可以写文章，但替代不了{name}站在台上的光芒。',
  ],
  'single-R': [
    '{name}的测评结果让我重新认识了他："洞察先知"。原来他的"想太多"是最稀缺的深度自省能力。报告说："他比同龄人多一面认知镜，能看到自己在想什么。"这种能从经验中快速提炼智慧的能力，也许才是真正让人生开挂的底层能力。',
  ],
  'dual-WI': [
    '今天做完测评，报告说{name}是"既能问出好问题，又能亲自去验证答案"的类型。好奇心+求证精神双高。测评师说，这组合在AI时代特别珍贵——因为AI能回答问题，但不会自己提问和验证。',
  ],
  'dual-WD': [
    '{name}的潜能画像很特别：好奇心和规划力双核驱动。报告描述得特别好："从天马行空到脚踏实地，他一个人就是一个闭环。"怪不得他总是问我"为什么"，然后自己想办法"怎么办"。',
  ],
  'dual-ID': [
    '解锁{name}的天赋密码：逻辑+设计双引擎。测评报告说他的思维像精密仪器，既能分析问题，又能设计解决方案。这个组合在工程师、产品经理、建筑设计师群体里特别常见。突然理解了他为什么总想"搭点什么"。',
  ],
  'dual-LE': [
    '{name}的测评结果："温暖影响力"型。既能感知每个人的情绪，又能把这种感知变成动人的表达。报告说他能"让陌生人变朋友，让朋友变战友"。这种能力，比考试第一名难多了。',
  ],
  'dual-ER': [
    '{name}的天赋组合是"表达+反思"。报告说他"台上闪闪发光，台下深度思考"。这种光芒和深度的组合，让他的表达不只是说话，而是有重量的输出。',
  ],
  'default': [
    '今天给{name}做了科学潜能测评，结果比我想象的更有启发性。不是简单的"聪明不聪明"，而是看到了他独特的思维方式和潜能方向。原来每个孩子都有一套自己的"操作系统"，测评为我打开了一扇认识他的窗户。',
  ]
}

// ========== 视觉意象词库 ==========

const VISUAL_METAPHORS: Record<WilderDimension, string> = {
  W: '他的眼睛像雷达，永远在扫描未知的信号',
  I: '他的思维像解开的鲁班锁，严丝合缝却又充满变幻',
  L: '他像人群中的温柔引力场，悄悄把所有人聚在一起',
  D: '他的脑子里有一张永远在更新的蓝图',
  E: '当他开口，整个房间都会安静下来听',
  R: '他的内心像一汪深水，表面平静，内在澄澈'
}

const DUAL_VISUALS: Record<string, string> = {
  'W+I': '他既有侦探的放大镜，又有科学家的实验室',
  'W+D': '他不仅会画问号，还能把问号变成惊叹号',
  'I+D': '他的思维像精密仪器，既能分析问题，又能设计解决方案',
  'W+E': '他的好奇心会发光，照亮别人也照亮自己',
  'I+E': '他用证据说话，但说出来的话比证据更动人',
  'L+E': '他像冬日里会讲故事的篝火，温暖又有故事',
  'E+R': '台上光芒万丈，台下静水流深',
  'D+R': '他设计的每一条路，都走过深度思考的脚印',
  'L+R': '他是人群中最安静的那盏灯，但每个人都走向他',
  'I+R': '他的求证之路，最终指向内心的真理'
}

// ========== 核心生成函数 ==========

/**
 * 获取维度排序（从高到低）
 */
function getSortedDimensions(scores: Record<string, number>): WilderDimension[] {
  return (Object.keys(scores) as WilderDimension[])
    .sort((a, b) => scores[b] - scores[a])
}

/**
 * 随机选择数组元素
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * 生成天赋头衔
 */
function generateTalentTitle(
  name: string,
  sortedDims: WilderDimension[],
  scores: Record<string, number>
): string {
  const topDim = sortedDims[0]
  const secondDim = sortedDims[1]
  const thirdDim = sortedDims[2]

  // 三峰型
  if (thirdDim && scores[thirdDim] >= 70) {
    const key = [topDim, secondDim, thirdDim].sort().join('+')
    const templates = TRIPLE_TITLE_TEMPLATES[key]
    if (templates) {
      return `${name} · ${pickRandom(templates)}`
    }
  }

  // 双峰型
  const dualKey = `${topDim}+${secondDim}`
  const dualTemplates = DUAL_TITLE_TEMPLATES[dualKey] || DUAL_TITLE_TEMPLATES[`${secondDim}+${topDim}`]
  if (dualTemplates) {
    return `${name} · ${pickRandom(dualTemplates)}`
  }

  // 单峰型
  const root = TITLE_ROOTS[topDim]
  return `${name} · ${pickRandom(root.prefix)}${pickRandom(root.suffix)}`
}

/**
 * 生成灵魂一句话
 */
function generateSoulSentence(
  name: string,
  sortedDims: WilderDimension[],
  scores: Record<string, number>
): string {
  const topDim = sortedDims[0]
  const secondDim = sortedDims[1]
  const thirdDim = sortedDims[2]

  // 三峰型 - 组合描述
  if (thirdDim && scores[thirdDim] >= 70) {
    return `${name}是三种能力的完美融合：${getDimensionName(topDim)}、${getDimensionName(secondDim)}和${getDimensionName(thirdDim)}共同驱动，让他在探索、分析和行动之间自如切换。`
  }

  // 双峰型
  const dualKey = `${topDim}+${secondDim}`
  const dualSentences = DUAL_SOUL_SENTENCES[dualKey] || DUAL_SOUL_SENTENCES[`${secondDim}+${topDim}`]
  if (dualSentences) {
    return pickRandom(dualSentences).replace(/{name}/g, name)
  }

  // 单峰型
  return pickRandom(SOUL_SENTENCES[topDim])
}

/**
 * 生成三个闪光标签
 */
function generateShiningTags(
  sortedDims: WilderDimension[],
  _scores: Record<string, number>
): [string, string, string] {
  const topDim = sortedDims[0]
  const secondDim = sortedDims[1]

  // 双维度组合标签
  const dualKey = `${topDim}+${secondDim}`
  const dualTags = DUAL_TAG_COMBOS[dualKey] || DUAL_TAG_COMBOS[`${secondDim}+${topDim}`]

  if (dualTags) {
    // 从组合标签中选1个，各自维度选1个
    const tag1 = pickRandom(dualTags)
    const tag2 = pickRandom(SHINING_TAGS[topDim])
    const tag3 = pickRandom(SHINING_TAGS[secondDim])
    return [tag1, tag2, tag3]
  }

  // 单维度标签
  const tags = SHINING_TAGS[topDim]
  return [
    pickRandom(tags),
    pickRandom(tags.filter(t => t !== tags[0])),
    pickRandom(SHINING_TAGS[secondDim])
  ]
}

/**
 * 生成朋友圈文案
 */
function generateMomentsText(
  name: string,
  talentTypeKey: string,
  talentTypeName: string
): string {
  // 根据天赋类型选择模板
  let templates: string[] | undefined

  if (talentTypeKey.startsWith('S-')) {
    const dim = talentTypeKey.split('-')[1]
    templates = MOMENTS_TEMPLATES[`single-${dim}`]
  } else if (talentTypeKey.startsWith('D-')) {
    const dims = talentTypeKey.split('-')[1]
    templates = MOMENTS_TEMPLATES[`dual-${dims}`]
  }

  if (!templates || templates.length === 0) {
    templates = MOMENTS_TEMPLATES['default']
  }

  return pickRandom(templates)
    .replace(/{name}/g, name)
    .replace(/{talentType}/g, talentTypeName)
}

/**
 * 生成视觉意象
 */
function generateVisualMetaphor(
  sortedDims: WilderDimension[],
  scores: Record<string, number>
): string {
  const topDim = sortedDims[0]
  const secondDim = sortedDims[1]
  const thirdDim = sortedDims[2]

  // 三峰型
  if (thirdDim && scores[thirdDim] >= 70) {
    return `他是三核驱动：${VISUAL_METAPHORS[topDim].slice(0, 10)}...同时${VISUAL_METAPHORS[secondDim].slice(0, 10)}...`
  }

  // 双峰型
  const dualKey = `${topDim}+${secondDim}`
  const dualVisual = DUAL_VISUALS[dualKey] || DUAL_VISUALS[`${secondDim}+${topDim}`]
  if (dualVisual) {
    return dualVisual
  }

  // 单峰型
  return VISUAL_METAPHORS[topDim]
}

/**
 * 获取维度中文名
 */
function getDimensionName(dim: WilderDimension): string {
  const names: Record<WilderDimension, string> = {
    W: '好奇心',
    I: '探究力',
    L: '联结力',
    D: '设计力',
    E: '表达力',
    R: '反思力'
  }
  return names[dim]
}

// ========== 主导出函数 ==========

/**
 * 生成社交货币
 * 输入测评数据，输出可直接用于朋友圈分享的天赋人设内容
 */
export function generateSocialCurrency(input: SocialCurrencyInput): SocialCurrency {
  const { name, profileCode: _profileCode, wilderScores: _wilderScores, wilderPercentiles, talentTypeName, talentTypeKey } = input

  // 获取维度排序
  const sortedDims = getSortedDimensions(wilderPercentiles)

  // 生成各部分内容
  const talentTitle = generateTalentTitle(name, sortedDims, wilderPercentiles)
  const soulSentence = generateSoulSentence(name, sortedDims, wilderPercentiles)
  const shiningTags = generateShiningTags(sortedDims, wilderPercentiles)
  const momentsText = generateMomentsText(name, talentTypeKey, talentTypeName)
  const visualMetaphor = generateVisualMetaphor(sortedDims, wilderPercentiles)

  return {
    talentTitle,
    soulSentence,
    shiningTags,
    momentsText,
    visualMetaphor
  }
}

/**
 * 根据Profile编码快速生成简化版社交货币
 */
export function quickGenerateSocialCurrency(
  name: string,
  profileCode: string,
  talentTypeName: string,
  talentTypeKey: string
): SocialCurrency {
  // 从Profile编码解析维度分数
  const scores: Record<string, number> = {}
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']

  dims.forEach(dim => {
    const match = profileCode.match(new RegExp(`${dim}(\\d)`))
    if (match) {
      scores[dim] = parseInt(match[1]) * 33 // 1->33, 2->66, 3->99
    }
  })

  // 如果解析失败，使用默认值
  if (Object.keys(scores).length === 0) {
    dims.forEach(dim => {
      scores[dim] = 50
    })
  }

  return generateSocialCurrency({
    name,
    profileCode,
    wilderScores: scores,
    wilderPercentiles: scores,
    talentTypeName,
    talentTypeKey
  })
}

export default {
  generateSocialCurrency,
  quickGenerateSocialCurrency
}
