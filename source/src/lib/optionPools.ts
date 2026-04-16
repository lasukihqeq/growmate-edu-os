// ===================================================================
// WILDER维度年龄自适应选项池 v1.0
// 为每个维度×年龄段提供多样化的选项表述，避免重复
// 配合 optionShuffle 实现确定性随机化
// ===================================================================

import type { AgeGroupKey } from './questions/types'

/** 选项能力层级 */
export type OptionLevel = 'high' | 'medium' | 'low'

/** 选项模板条目 */
export interface OptionPoolEntry {
  text: string
  scores: Record<string, number>
}

/** 维度选项池（按年龄段×能力层级） */
export type DimensionOptionPool = Record<AgeGroupKey, Record<OptionLevel, OptionPoolEntry[]>>

// ===================================================================
// WILDER 六维度选项池
// ===================================================================

/** W - 好奇心 (Wonder) */
const WONDER_POOL: DimensionOptionPool = {
  preschool: {
    high: [
      { text: '我想一直看它，想知道它是从哪里来的', scores: { W: 90 } },
      { text: '哇好神奇！我想摸摸看！', scores: { W: 88 } },
      { text: '我能带回家吗？我想天天看', scores: { W: 85 } },
      { text: '我要问爸爸妈妈这是什么东西！', scores: { W: 87 } },
    ],
    medium: [
      { text: '嗯，看起来有点好玩', scores: { W: 60 } },
      { text: '我想看一下，但不一定要摸', scores: { W: 55 } },
      { text: '还行吧，比动画片有趣一点', scores: { W: 58 } },
    ],
    low: [
      { text: '没什么感觉，就那样吧', scores: { W: 35 } },
      { text: '不想看了，我想玩别的', scores: { W: 30 } },
      { text: '有点害怕，不想靠近', scores: { W: 38 } },
    ],
  },
  'lower-primary': {
    high: [
      { text: '我要仔细观察它，搞清楚为什么会这样', scores: { W: 90 } },
      { text: '太酷了！我想查查资料了解它', scores: { W: 88 } },
      { text: '我从来没见过！它能教我什么？', scores: { W: 85 } },
      { text: '我脑子里有好多问题想问！', scores: { W: 87 } },
    ],
    medium: [
      { text: '有点好奇，但我可能不会深入探究', scores: { W: 58 } },
      { text: '看看还行，不会特别想研究', scores: { W: 55 } },
      { text: '如果有人带我看的话，我愿意了解', scores: { W: 60 } },
    ],
    low: [
      { text: '没什么特别的，跟平时差不多', scores: { W: 35 } },
      { text: '我不太感兴趣，还有其他事要做', scores: { W: 30 } },
      { text: '看一眼就够了吧', scores: { W: 38 } },
    ],
  },
  'upper-primary': {
    high: [
      { text: '这激发了我的求知欲，我要深入研究', scores: { W: 92 } },
      { text: '我需要搞清楚背后的原理和机制', scores: { W: 90 } },
      { text: '这种未知让我兴奋！我想亲自验证', scores: { W: 88 } },
      { text: '我的直觉告诉我这里有重要发现', scores: { W: 86 } },
    ],
    medium: [
      { text: '有些兴趣，但可能不会花太多时间', scores: { W: 58 } },
      { text: '如果跟我的爱好相关就会深入了解', scores: { W: 62 } },
      { text: '愿意了解概况，不一定要深入研究', scores: { W: 55 } },
    ],
    low: [
      { text: '没有特别想了解的冲动', scores: { W: 35 } },
      { text: '不如做我已经熟悉的事', scores: { W: 30 } },
      { text: '不确定值不值得花时间', scores: { W: 38 } },
    ],
  },
  'middle-school': {
    high: [
      { text: '这是值得探索的领域，我要系统研究', scores: { W: 92 } },
      { text: '未知正是最吸引我的地方', scores: { W: 90 } },
      { text: '我看到了深入探究的可能性', scores: { W: 88 } },
    ],
    medium: [
      { text: '会关注但不会主动深入研究', scores: { W: 58 } },
      { text: '如果有人引导的话可以试试', scores: { W: 60 } },
    ],
    low: [
      { text: '对这类事物没有太大兴趣', scores: { W: 35 } },
      { text: '更愿意专注已知的领域', scores: { W: 32 } },
    ],
  },
  'high-school': {
    high: [
      { text: '这个发现可能改变我的认知框架', scores: { W: 92 } },
      { text: '未知的边界正是驱动我前进的力量', scores: { W: 90 } },
      { text: '我看到了跨学科研究的可能性', scores: { W: 88 } },
    ],
    medium: [
      { text: '保持开放态度，但不急于深入', scores: { W: 58 } },
      { text: '会有选择地探索有价值的部分', scores: { W: 60 } },
    ],
    low: [
      { text: '对探索未知缺乏动力', scores: { W: 35 } },
      { text: '更倾向于巩固已有知识体系', scores: { W: 32 } },
    ],
  },
}

/** I - 探究力 (Inquiry) */
const INQUIRY_POOL: DimensionOptionPool = {
  preschool: {
    high: [
      { text: '我来试试看能不能弄明白！', scores: { I: 90 } },
      { text: '我想自己动手试一试！', scores: { I: 88 } },
      { text: '让我想想是为什么呢...', scores: { I: 85 } },
    ],
    medium: [
      { text: '可以试试，但如果太难就算了', scores: { I: 55 } },
      { text: '我想看看别人怎么做的', scores: { I: 58 } },
    ],
    low: [
      { text: '不想试，太难了', scores: { I: 30 } },
      { text: '能不能直接告诉我答案？', scores: { I: 35 } },
    ],
  },
  'lower-primary': {
    high: [
      { text: '我来设计一个实验验证一下！', scores: { I: 90 } },
      { text: '让我收集线索来推理答案', scores: { I: 88 } },
      { text: '我有自己的想法，想亲自试试', scores: { I: 86 } },
    ],
    medium: [
      { text: '愿意试试，但需要一些提示', scores: { I: 58 } },
      { text: '看看参考资料再做决定', scores: { I: 55 } },
    ],
    low: [
      { text: '直接问老师或者查答案吧', scores: { I: 35 } },
      { text: '这个问题对我来说太复杂了', scores: { I: 30 } },
    ],
  },
  'upper-primary': {
    high: [
      { text: '我来制定研究方案，逐步验证', scores: { I: 92 } },
      { text: '先提出假设，然后设计验证方法', scores: { I: 90 } },
      { text: '这种问题需要系统性思考和分析', scores: { I: 88 } },
    ],
    medium: [
      { text: '可以分析，但需要更多背景信息', scores: { I: 58 } },
      { text: '先看看已有的研究成果', scores: { I: 55 } },
    ],
    low: [
      { text: '这个问题需要太多精力', scores: { I: 35 } },
      { text: '直接接受现有的解释就好', scores: { I: 30 } },
    ],
  },
  'middle-school': {
    high: [
      { text: '设计对照实验来验证假设', scores: { I: 92 } },
      { text: '从多个角度分析问题的本质', scores: { I: 90 } },
    ],
    medium: [
      { text: '查找权威资料来辅助分析', scores: { I: 58 } },
      { text: '在他人基础上补充自己的观点', scores: { I: 55 } },
    ],
    low: [
      { text: '参照已有结论比较省事', scores: { I: 32 } },
      { text: '探究过程太耗时，不如直接用结论', scores: { I: 30 } },
    ],
  },
  'high-school': {
    high: [
      { text: '构建研究框架，运用方法论验证', scores: { I: 92 } },
      { text: '批判性地审视现有理论并提出新假设', scores: { I: 90 } },
    ],
    medium: [
      { text: '进行有条件的探究，关注实用性', scores: { I: 58 } },
      { text: '整合多方观点形成自己的判断', scores: { I: 60 } },
    ],
    low: [
      { text: '对深度探究缺乏内在驱动力', scores: { I: 32 } },
      { text: '更倾向于接受权威解释', scores: { I: 30 } },
    ],
  },
}

/** L - 连接力 (Link) */
const LINK_POOL: DimensionOptionPool = {
  preschool: {
    high: [
      { text: '我帮你一起做吧！我们做朋友！', scores: { L: 90 } },
      { text: '大家一起玩更有趣！', scores: { L: 88 } },
      { text: '我想跟他们分享我的好东西！', scores: { L: 85 } },
    ],
    medium: [
      { text: '可以一起玩，但我也要做自己的事', scores: { L: 55 } },
      { text: '如果他们先叫我的话，我可以一起', scores: { L: 58 } },
    ],
    low: [
      { text: '我自己玩就好了', scores: { L: 30 } },
      { text: '不想跟别人一起', scores: { L: 35 } },
    ],
  },
  'lower-primary': {
    high: [
      { text: '我来当队长，我们分工合作！', scores: { L: 90 } },
      { text: '我觉得每个人都能帮上忙', scores: { L: 88 } },
      { text: '我想听听大家的想法，然后一起决定', scores: { L: 86 } },
    ],
    medium: [
      { text: '可以配合，但不想当组织者', scores: { L: 58 } },
      { text: '做好自己的部分就行了吧', scores: { L: 55 } },
    ],
    low: [
      { text: '我一个人做比较快', scores: { L: 35 } },
      { text: '跟别人一起太麻烦了', scores: { L: 30 } },
    ],
  },
  'upper-primary': {
    high: [
      { text: '发挥每个人的优势，高效协作', scores: { L: 92 } },
      { text: '主动协调分歧，寻找共识方案', scores: { L: 90 } },
      { text: '我愿意承担沟通桥梁的角色', scores: { L: 88 } },
    ],
    medium: [
      { text: '配合团队节奏，做好分内事', scores: { L: 58 } },
      { text: '在需要时提供帮助', scores: { L: 55 } },
    ],
    low: [
      { text: '独立完成更高效', scores: { L: 35 } },
      { text: '协作会拖慢我的进度', scores: { L: 30 } },
    ],
  },
  'middle-school': {
    high: [
      { text: '建立高效的团队沟通机制', scores: { L: 92 } },
      { text: '整合不同观点形成最优方案', scores: { L: 90 } },
    ],
    medium: [
      { text: '按需协作，保持适度独立性', scores: { L: 58 } },
      { text: '在明确分工下可以配合', scores: { L: 55 } },
    ],
    low: [
      { text: '团队协作效率不如个人', scores: { L: 32 } },
      { text: '避免不必要的社交消耗', scores: { L: 30 } },
    ],
  },
  'high-school': {
    high: [
      { text: '构建跨领域协作网络，实现价值最大化', scores: { L: 92 } },
      { text: '协调多方利益，推动共同目标', scores: { L: 90 } },
    ],
    medium: [
      { text: '选择性协作，优先保障核心目标', scores: { L: 58 } },
      { text: '在互利基础上进行合作', scores: { L: 60 } },
    ],
    low: [
      { text: '独立作业效率更高', scores: { L: 32 } },
      { text: '减少团队依赖，提升个人产出', scores: { L: 30 } },
    ],
  },
}

/** D - 设计力 (Design) */
const DESIGN_POOL: DimensionOptionPool = {
  preschool: {
    high: [
      { text: '我想自己画一个超级酷的！', scores: { D: 90 } },
      { text: '让我来搭一个大大的东西！', scores: { D: 88 } },
      { text: '我有个超棒的主意！看我的！', scores: { D: 86 } },
    ],
    medium: [
      { text: '可以照着样子做一个', scores: { D: 55 } },
      { text: '试试看吧，做不好也没关系', scores: { D: 58 } },
    ],
    low: [
      { text: '不知道做什么，没有想法', scores: { D: 30 } },
      { text: '别人做什么我就做什么', scores: { D: 35 } },
    ],
  },
  'lower-primary': {
    high: [
      { text: '先画设计图，然后一步步做出来！', scores: { D: 90 } },
      { text: '我想做一个跟别人都不一样的！', scores: { D: 88 } },
      { text: '失败了也没关系，我可以改！', scores: { D: 86 } },
    ],
    medium: [
      { text: '可以模仿一个好的例子来改', scores: { D: 58 } },
      { text: '需要有人帮我理清思路', scores: { D: 55 } },
    ],
    low: [
      { text: '不知道从哪里开始', scores: { D: 35 } },
      { text: '等别人设计好我再参与', scores: { D: 30 } },
    ],
  },
  'upper-primary': {
    high: [
      { text: '从需求出发，设计完整的解决方案', scores: { D: 92 } },
      { text: '快速原型迭代，不断优化设计', scores: { D: 90 } },
      { text: '用创新思维突破常规设计限制', scores: { D: 88 } },
    ],
    medium: [
      { text: '在现有方案基础上做改进', scores: { D: 58 } },
      { text: '需要更详细的指导才能开始', scores: { D: 55 } },
    ],
    low: [
      { text: '缺乏从零开始设计的信心', scores: { D: 35 } },
      { text: '更愿意执行而非规划', scores: { D: 30 } },
    ],
  },
  'middle-school': {
    high: [
      { text: '构建系统化的设计思维框架', scores: { D: 92 } },
      { text: '以用户为中心进行创新设计', scores: { D: 90 } },
    ],
    medium: [
      { text: '在成熟框架下进行局部优化', scores: { D: 58 } },
      { text: '需要结构化的设计流程指导', scores: { D: 55 } },
    ],
    low: [
      { text: '缺乏系统设计能力', scores: { D: 32 } },
      { text: '更擅长执行既定方案', scores: { D: 30 } },
    ],
  },
  'high-school': {
    high: [
      { text: '从战略高度进行系统化架构设计', scores: { D: 92 } },
      { text: '融合多学科视角进行创新设计', scores: { D: 90 } },
    ],
    medium: [
      { text: '在约束条件下进行优化设计', scores: { D: 58 } },
      { text: '有选择地进行创意尝试', scores: { D: 60 } },
    ],
    low: [
      { text: '设计思维有待发展', scores: { D: 32 } },
      { text: '更依赖既有模式', scores: { D: 30 } },
    ],
  },
}

/** E - 表达力 (Expression) */
const EXPRESSION_POOL: DimensionOptionPool = {
  preschool: {
    high: [
      { text: '我要给大家讲一个超级精彩的故事！', scores: { E: 90 } },
      { text: '让我画给你们看！这样更清楚！', scores: { E: 88 } },
      { text: '我有好多话想说！听我讲！', scores: { E: 86 } },
    ],
    medium: [
      { text: '可以说一点，但不太会讲很长的', scores: { E: 55 } },
      { text: '如果别人先说我也可以跟着说', scores: { E: 58 } },
    ],
    low: [
      { text: '不想说，让别人说吧', scores: { E: 30 } },
      { text: '我说不清楚，还是不说了', scores: { E: 35 } },
    ],
  },
  'lower-primary': {
    high: [
      { text: '我可以用不同的方式把想法说清楚！', scores: { E: 90 } },
      { text: '让我组织一下语言，讲给大家听', scores: { E: 88 } },
      { text: '我觉得演讲和展示特别有意思！', scores: { E: 86 } },
    ],
    medium: [
      { text: '能说清楚重点，但不太会展开', scores: { E: 58 } },
      { text: '私下说得好，人多就紧张', scores: { E: 55 } },
    ],
    low: [
      { text: '不太擅长用语言表达自己', scores: { E: 35 } },
      { text: '宁愿写下来也不想说', scores: { E: 30 } },
    ],
  },
  'upper-primary': {
    high: [
      { text: '用逻辑清晰的语言说服他人', scores: { E: 92 } },
      { text: '运用多种表达方式增强说服力', scores: { E: 90 } },
      { text: '自信地展示我的观点和论据', scores: { E: 88 } },
    ],
    medium: [
      { text: '能表达核心观点，但缺乏感染力', scores: { E: 58 } },
      { text: '书面表达比口头更擅长', scores: { E: 55 } },
    ],
    low: [
      { text: '表达想法时常感到困难', scores: { E: 35 } },
      { text: '更倾向于倾听而非发言', scores: { E: 30 } },
    ],
  },
  'middle-school': {
    high: [
      { text: '结构化表达复杂观点，具有说服力', scores: { E: 92 } },
      { text: '根据听众调整表达策略', scores: { E: 90 } },
    ],
    medium: [
      { text: '能清晰表达但缺乏感染力', scores: { E: 58 } },
      { text: '在熟悉领域表达流畅', scores: { E: 60 } },
    ],
    low: [
      { text: '不擅长公开表达', scores: { E: 32 } },
      { text: '表达时容易紧张或词不达意', scores: { E: 30 } },
    ],
  },
  'high-school': {
    high: [
      { text: '精准表达复杂概念，具有影响力', scores: { E: 92 } },
      { text: '运用多模态表达增强传播效果', scores: { E: 90 } },
    ],
    medium: [
      { text: '在专业领域表达清晰', scores: { E: 58 } },
      { text: '擅长书面但口头偏弱', scores: { E: 55 } },
    ],
    low: [
      { text: '表达沟通是明显短板', scores: { E: 32 } },
      { text: '需要系统性提升表达能力', scores: { E: 30 } },
    ],
  },
}

/** R - 反思力 (Reflection) */
const REFLECTION_POOL: DimensionOptionPool = {
  preschool: {
    high: [
      { text: '我想想看，刚才是不是做错了？', scores: { R: 90 } },
      { text: '下次我会用不同的方法！', scores: { R: 88 } },
      { text: '我跟妈妈说说今天发生了什么', scores: { R: 86 } },
    ],
    medium: [
      { text: '有时候会想一想，但很快就忘了', scores: { R: 55 } },
      { text: '如果别人问我才会想', scores: { R: 58 } },
    ],
    low: [
      { text: '做完就完了，不想再想', scores: { R: 30 } },
      { text: '我不喜欢回顾做过的事', scores: { R: 35 } },
    ],
  },
  'lower-primary': {
    high: [
      { text: '我来总结一下哪些做得好，哪些可以改进', scores: { R: 90 } },
      { text: '我觉得下次可以换一个更好的方法', scores: { R: 88 } },
      { text: '我想跟好朋友聊聊今天学到了什么', scores: { R: 86 } },
    ],
    medium: [
      { text: '偶尔会想一下，但不太深入', scores: { R: 58 } },
      { text: '被提醒了才会回顾', scores: { R: 55 } },
    ],
    low: [
      { text: '做完就过去了，不想再提', scores: { R: 35 } },
      { text: '反思没什么用，不如往前看', scores: { R: 30 } },
    ],
  },
  'upper-primary': {
    high: [
      { text: '系统分析成功和失败的原因', scores: { R: 92 } },
      { text: '从经验中提炼可复用的方法论', scores: { R: 90 } },
      { text: '主动寻求反馈来改进自己', scores: { R: 88 } },
    ],
    medium: [
      { text: '会做简单总结，但不够系统', scores: { R: 58 } },
      { text: '在重大事件后才会反思', scores: { R: 55 } },
    ],
    low: [
      { text: '很少主动回顾和总结', scores: { R: 35 } },
      { text: '更关注当下而非过去', scores: { R: 30 } },
    ],
  },
  'middle-school': {
    high: [
      { text: '建立系统化的复盘和迭代机制', scores: { R: 92 } },
      { text: '用批判性思维审视自身认知盲点', scores: { R: 90 } },
    ],
    medium: [
      { text: '定期但浅层地回顾关键事件', scores: { R: 58 } },
      { text: '在他人引导下进行深度反思', scores: { R: 55 } },
    ],
    low: [
      { text: '缺乏自我审视的习惯', scores: { R: 32 } },
      { text: '反思意识有待培养', scores: { R: 30 } },
    ],
  },
  'high-school': {
    high: [
      { text: '运用元认知能力进行深度自我迭代', scores: { R: 92 } },
      { text: '将反思成果转化为可执行的改进计划', scores: { R: 90 } },
    ],
    medium: [
      { text: '能进行结构化反思但深度有限', scores: { R: 58 } },
      { text: '选择性反思重要决策', scores: { R: 60 } },
    ],
    low: [
      { text: '自我反思能力有待加强', scores: { R: 32 } },
      { text: '倾向于忽略过去的经验教训', scores: { R: 30 } },
    ],
  },
}

// ===================================================================
// 选项池聚合 & 工具函数
// ===================================================================

/** WILDER六维度选项池 */
export const WILDER_OPTION_POOLS: Record<string, DimensionOptionPool> = {
  W: WONDER_POOL,
  I: INQUIRY_POOL,
  L: LINK_POOL,
  D: DESIGN_POOL,
  E: EXPRESSION_POOL,
  R: REFLECTION_POOL,
}

/** 从选项池中为指定维度和年龄生成3个选项（高/中/低各一） */
export function generateOptionsFromPool(
  dimension: string,
  ageGroup: AgeGroupKey,
  questionId: string,
  sessionSeed: string,
): Array<{ id: string; text: string; scores: Record<string, number> }> {
  const pool = WILDER_OPTION_POOLS[dimension]
  if (!pool) {
    // 降级：返回通用选项
    return generateFallbackOptions(dimension)
  }

  const agePool = pool[ageGroup]
  if (!agePool) {
    return generateFallbackOptions(dimension)
  }

  // 使用确定性种子选择选项，避免同一session重复
  const seed = simpleHash(`${sessionSeed}::${dimension}::${questionId}`)
  const levels: OptionLevel[] = ['high', 'medium', 'low']

  const selectedOptions = levels.map((level, idx) => {
    const entries = agePool[level]
    if (!entries || entries.length === 0) {
      // 降级到相邻年龄段
      return generateFallbackOption(dimension, level)
    }
    const pickIndex = (seed + idx * 7) % entries.length
    const entry = entries[pickIndex]
    return {
      id: `${dimension}-${level}-${idx}`,
      text: entry.text,
      scores: entry.scores,
    }
  })

  return selectedOptions
}

/** 生成通用降级选项 */
function generateFallbackOptions(dimension: string): Array<{ id: string; text: string; scores: Record<string, number> }> {
  return [
    { id: `${dimension}-high`, text: '积极主动地应对', scores: { [dimension]: 85 } },
    { id: `${dimension}-medium`, text: '适度地参与其中', scores: { [dimension]: 55 } },
    { id: `${dimension}-low`, text: '保持观望态度', scores: { [dimension]: 35 } },
  ]
}

function generateFallbackOption(dimension: string, level: OptionLevel): { id: string; text: string; scores: Record<string, number> } {
  const scores = { high: 85, medium: 55, low: 35 }[level]
  const texts = {
    high: '积极主动地应对',
    medium: '适度地参与其中',
    low: '保持观望态度',
  }
  return { id: `${dimension}-${level}`, text: texts[level], scores: { [dimension]: scores } }
}

/** 简单确定性哈希 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}
