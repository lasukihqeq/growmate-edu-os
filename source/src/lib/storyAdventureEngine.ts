// ===================================================================
// 故事冒险测评引擎 v2.0
// 将测评问题包装为沉浸式故事冒险体验
// 支持章节系统、即时奖励、AI伙伴互动
// ===================================================================

import type { AgeGroupKey } from './questions/types'
import type { UnifiedQuestion } from './questions/types'
import { shuffleOptions } from './optionShuffle'
import { generateOptionsFromPool } from './optionPools'

// ===================================================================
// 类型定义
// ===================================================================

/** 故事世界设定 */
export interface StoryWorld {
  id: string
  title: string
  setting: string
  ageGroup: AgeGroupKey
  companion: StoryCompanion
  chapters: StoryChapterDef[]
  totalQuestions: number
  estimatedMinutes: number
}

/** AI伙伴角色 */
export interface StoryCompanion {
  name: string
  emoji: string
  personality: 'cheerful' | 'wise' | 'brave' | 'curious'
  greetingLines: string[]
  reactionPositive: string[]
  reactionNeutral: string[]
}

/** 章节定义 */
export interface StoryChapterDef {
  id: string
  title: string
  sceneDescription: string
  targetDimensions: string[]
  questionsPerChapter: number
  reward: ChapterReward
}

/** 章节奖励 */
export interface ChapterReward {
  xp: number
  badge?: { id: string; name: string; emoji: string }
  storyProgress: string
}

/** 游戏状态 */
export interface StoryGameState {
  worldId: string
  currentChapter: number
  currentQuestionInChapter: number
  totalAnswered: number
  dimensionXP: Record<string, number>
  unlockedBadges: Array<{ id: string; name: string; emoji: string; unlockedAt: number }>
  streakCount: number
  maxStreak: number
  lastAnswerScore: number | null
  storyFlags: string[]
}

// ===================================================================
// 故事世界库（按年龄段）
// ===================================================================

const STORY_WORLDS: Record<string, StoryWorld[]> = {
  preschool: [
    {
      id: 'magic-forest',
      title: '魔法森林探险',
      setting: '一片会发光的神奇森林，里面住着各种奇妙的小动物',
      ageGroup: 'preschool',
      companion: {
        name: '泡泡',
        emoji: '🧚',
        personality: 'cheerful',
        greetingLines: ['哇！我们要一起探险啦！', '快看！前面有亮亮的东西！'],
        reactionPositive: ['太棒了！你真聪明！✨', '哇！我也这么觉得！🎉'],
        reactionNeutral: ['嗯嗯，好的！继续看看吧~', '这也挺有趣的呢！'],
      },
      chapters: [
        { id: 'ch1', title: '森林入口', sceneDescription: '你站在一片闪闪发光的森林前面，树叶是蓝色的，花朵会唱歌', targetDimensions: ['W'], questionsPerChapter: 3, reward: { xp: 10, badge: { id: 'first-step', name: '勇敢的第一步', emoji: '👣' }, storyProgress: '你踏入了魔法森林' } },
        { id: 'ch2', title: '小溪旁的谜题', sceneDescription: '一条彩虹色的小溪挡住了去路，溪水里有奇怪的泡泡', targetDimensions: ['I', 'D'], questionsPerChapter: 3, reward: { xp: 15, storyProgress: '你找到了过溪的方法' } },
        { id: 'ch3', title: '小动物们的请求', sceneDescription: '一群小动物围了过来，它们好像需要你的帮助', targetDimensions: ['L', 'E'], questionsPerChapter: 3, reward: { xp: 15, storyProgress: '小动物们成了你的朋友' } },
        { id: 'ch4', title: '回到营地', sceneDescription: '天快黑了，大家围在篝火旁聊天，分享今天的冒险', targetDimensions: ['R'], questionsPerChapter: 3, reward: { xp: 20, badge: { id: 'forest-hero', name: '森林小英雄', emoji: '🌟' }, storyProgress: '你完成了魔法森林的冒险' } },
      ],
      totalQuestions: 12,
      estimatedMinutes: 12,
    },
    {
      id: 'ocean-treasure',
      title: '海底寻宝记',
      setting: '乘坐小潜水艇探索海底世界，寻找传说中的宝藏',
      ageGroup: 'preschool',
      companion: {
        name: '小海',
        emoji: '🐬',
        personality: 'curious',
        greetingLines: ['嗨！我是海豚小海！一起去海底看看吧！', '海底有好多宝贝等着我们呢！'],
        reactionPositive: ['好好好！你发现得好快！', '你的眼睛真厉害！👁️'],
        reactionNeutral: ['没关系，我们慢慢来~', '再看看别的吧！'],
      },
      chapters: [
        { id: 'ch1', title: '潜水出发', sceneDescription: '你坐上了小潜水艇，慢慢沉入蓝色的海洋', targetDimensions: ['W'], questionsPerChapter: 3, reward: { xp: 10, badge: { id: 'diver', name: '小潜水员', emoji: '🤿' }, storyProgress: '你开始海底探险' } },
        { id: 'ch2', title: '珊瑚迷宫', sceneDescription: '五颜六色的珊瑚形成了一座迷宫，鱼儿在里面游来游去', targetDimensions: ['I', 'D'], questionsPerChapter: 3, reward: { xp: 15, storyProgress: '你穿过了珊瑚迷宫' } },
        { id: 'ch3', title: '海底朋友', sceneDescription: '一只大海龟慢悠悠地游过来，好像想跟你说什么', targetDimensions: ['L', 'E'], questionsPerChapter: 3, reward: { xp: 15, storyProgress: '海底朋友们帮了你大忙' } },
        { id: 'ch4', title: '宝藏发现', sceneDescription: '终于找到了！海底的宝箱闪闪发光，里面会有什么呢？', targetDimensions: ['R'], questionsPerChapter: 3, reward: { xp: 20, badge: { id: 'treasure-finder', name: '寻宝小达人', emoji: '💎' }, storyProgress: '你找到了海底宝藏' } },
      ],
      totalQuestions: 12,
      estimatedMinutes: 12,
    },
  ],
  'lower-primary': [
    {
      id: 'dino-island',
      title: '恐龙岛大冒险',
      setting: '一座与世隔绝的岛屿上，恐龙依然生活着！你是一名少年探险家',
      ageGroup: 'lower-primary',
      companion: {
        name: '小智',
        emoji: '🦖',
        personality: 'curious',
        greetingLines: ['嘿！听说这座岛上有恐龙！我们出发吧！', '带上你的探险装备，前方有未知等着我们！'],
        reactionPositive: ['厉害！你发现了重要线索！🔍', '这个思路太棒了！继续！'],
        reactionNeutral: ['嗯，这个角度也值得想想', '让我看看接下来会发生什么...'],
      },
      chapters: [
        { id: 'ch1', title: '登陆恐龙岛', sceneDescription: '你们的船靠近了一座浓雾笼罩的神秘岛屿，远处传来低沉的吼声', targetDimensions: ['W'], questionsPerChapter: 3, reward: { xp: 15, badge: { id: 'island-landing', name: '勇敢登岛', emoji: '🏝️' }, storyProgress: '你成功登陆了恐龙岛' } },
        { id: 'ch2', title: '恐龙足迹', sceneDescription: '泥地上有巨大的三趾脚印，通向丛林深处。你需要追踪它们', targetDimensions: ['I', 'D'], questionsPerChapter: 3, reward: { xp: 20, storyProgress: '你追踪到了恐龙的踪迹' } },
        { id: 'ch3', title: '恐龙宝宝', sceneDescription: '你发现了一只受伤的小恐龙，它害怕地缩在树丛中', targetDimensions: ['L', 'E'], questionsPerChapter: 3, reward: { xp: 20, storyProgress: '小恐龙开始信任你了' } },
        { id: 'ch4', title: '火山危机', sceneDescription: '远处的火山开始冒烟了！你需要快速制定撤离计划', targetDimensions: ['D', 'R'], questionsPerChapter: 3, reward: { xp: 25, badge: { id: 'dino-saver', name: '恐龙守护者', emoji: '🦕' }, storyProgress: '你带领大家安全撤离' } },
        { id: 'ch5', title: '告别恐龙岛', sceneDescription: '坐在船上回望渐远的岛屿，这次冒险教会了你很多', targetDimensions: ['R'], questionsPerChapter: 3, reward: { xp: 25, storyProgress: '你完成了恐龙岛的全部冒险' } },
      ],
      totalQuestions: 15,
      estimatedMinutes: 20,
    },
  ],
  'upper-primary': [
    {
      id: 'mars-colony',
      title: '火星殖民计划',
      setting: '2050年，你是火星第一代殖民者中的一员，需要在这颗红色星球上建立新家园',
      ageGroup: 'upper-primary',
      companion: {
        name: '星导',
        emoji: '🚀',
        personality: 'wise',
        greetingLines: ['欢迎来到火星，新殖民者。这颗红色星球将考验你的每项能力。', '我在这里引导你，但真正的决定权在你手中。'],
        reactionPositive: ['出色的判断力，殖民者。', '这个决定显示了你的潜质。'],
        reactionNeutral: ['每个选择都有其价值，让我们看看结果。', '有趣的思路，继续观察。'],
      },
      chapters: [
        { id: 'ch1', title: '着陆火星', sceneDescription: '飞船穿越火星大气层，剧烈震颤后，你终于踏上了这片红色荒原', targetDimensions: ['W'], questionsPerChapter: 3, reward: { xp: 20, badge: { id: 'mars-landing', name: '火星着陆', emoji: '🔴' }, storyProgress: '你成功着陆火星' } },
        { id: 'ch2', title: '基地建设', sceneDescription: '你需要在有限的资源下设计并建造一个可持续的生存基地', targetDimensions: ['D', 'I'], questionsPerChapter: 3, reward: { xp: 25, storyProgress: '基地框架搭建完成' } },
        { id: 'ch3', title: '团队危机', sceneDescription: '殖民者之间出现了分歧，有人想返回地球，有人想继续坚持', targetDimensions: ['L', 'E'], questionsPerChapter: 3, reward: { xp: 25, storyProgress: '你帮助团队找到了共同方向' } },
        { id: 'ch4', title: '沙尘暴来袭', sceneDescription: '一场巨大的沙尘暴正在逼近，你需要做出关键决策保护基地', targetDimensions: ['D', 'R'], questionsPerChapter: 3, reward: { xp: 30, storyProgress: '你带领团队度过了沙尘暴' } },
        { id: 'ch5', title: '新发现', sceneDescription: '暴风过后，探测器发回了一个令人震惊的信号——火星地下可能有液态水', targetDimensions: ['W', 'I'], questionsPerChapter: 3, reward: { xp: 30, storyProgress: '你发现了火星的重大秘密' } },
        { id: 'ch6', title: '火星新纪元', sceneDescription: '站在火星最高的山丘上，你回望这段旅程，思考未来的方向', targetDimensions: ['R'], questionsPerChapter: 3, reward: { xp: 35, badge: { id: 'mars-pioneer', name: '火星先驱', emoji: '👨‍🚀' }, storyProgress: '你开启了火星新纪元' } },
      ],
      totalQuestions: 18,
      estimatedMinutes: 30,
    },
  ],
  'middle-school': [
    {
      id: 'deep-lab',
      title: '深海实验室',
      setting: '你是深海科研站的负责人，需要在极端环境下完成研究任务并应对各种危机',
      ageGroup: 'middle-school',
      companion: {
        name: '海博',
        emoji: '🔬',
        personality: 'wise',
        greetingLines: ['欢迎来到深海科研站。在这里，每一个决策都可能影响整个团队。', '深海隐藏着无数秘密，也有不可预知的危险。'],
        reactionPositive: ['精准的判断。', '你的决策基于充分的推理。'],
        reactionNeutral: ['让我们观察这个选择的后果。', '在深海中，每条路都通向不同的发现。'],
      },
      chapters: [
        { id: 'ch1', title: '下潜准备', sceneDescription: '深海科研站即将下潜至马里亚纳海沟，你需要检查所有系统', targetDimensions: ['W', 'I'], questionsPerChapter: 4, reward: { xp: 25, badge: { id: 'deep-dive', name: '深潜准备', emoji: '🌊' }, storyProgress: '科研站开始下潜' } },
        { id: 'ch2', title: '未知信号', sceneDescription: '声呐探测到来自海底的规律信号，这不符合任何已知自然现象', targetDimensions: ['I', 'D'], questionsPerChapter: 4, reward: { xp: 30, storyProgress: '信号源范围缩小' } },
        { id: 'ch3', title: '团队分歧', sceneDescription: '科学家们对是否继续探索产生了严重分歧，氧气也在减少', targetDimensions: ['L', 'E'], questionsPerChapter: 4, reward: { xp: 30, storyProgress: '团队达成了新的共识' } },
        { id: 'ch4', title: '深海发现', sceneDescription: '你发现了一种从未记录过的深海生物群落，但采集样本有风险', targetDimensions: ['W', 'R'], questionsPerChapter: 4, reward: { xp: 35, storyProgress: '你做出了关键科研决策' } },
        { id: 'ch5', title: '紧急上浮', sceneDescription: '科研站出现故障，你需要在上浮过程中做出一系列关键决策', targetDimensions: ['D', 'R'], questionsPerChapter: 4, reward: { xp: 35, badge: { id: 'deep-explorer', name: '深海探险家', emoji: '🏅' }, storyProgress: '你安全返回了海面' } },
      ],
      totalQuestions: 20,
      estimatedMinutes: 35,
    },
  ],
  'high-school': [
    {
      id: 'time-traveler',
      title: '时间旅行者',
      setting: '你意外获得了一台时间机器，但每次使用都会产生蝴蝶效应，改变历史进程',
      ageGroup: 'high-school',
      companion: {
        name: '时序',
        emoji: '⏳',
        personality: 'wise',
        greetingLines: ['时间是最复杂的变量。每一个选择都在重塑现实。', '你已经启动了时间机器。记住，改变过去的代价是改变未来。'],
        reactionPositive: ['你理解了时间的因果律。', '这个选择体现了深层的逻辑推理。'],
        reactionNeutral: ['时间会揭示一切。让我们观察。', '每个时间线都有其存在的意义。'],
      },
      chapters: [
        { id: 'ch1', title: '时间裂隙', sceneDescription: '实验室的量子计算机突然产生了一个时间裂隙，你被吸入了时空漩涡', targetDimensions: ['W', 'I'], questionsPerChapter: 4, reward: { xp: 30, badge: { id: 'rift-walker', name: '裂隙行者', emoji: '🌀' }, storyProgress: '你穿越了时间裂隙' } },
        { id: 'ch2', title: '历史岔路口', sceneDescription: '你来到了一个关键的历史节点，你的行为可能改变文明的走向', targetDimensions: ['D', 'R'], questionsPerChapter: 4, reward: { xp: 35, storyProgress: '你经历了历史的转折点' } },
        { id: 'ch3', title: '蝴蝶效应', sceneDescription: '你返回现代，发现世界因你的行为而改变，有些变化令人不安', targetDimensions: ['L', 'E'], questionsPerChapter: 4, reward: { xp: 35, storyProgress: '你目睹了蝴蝶效应的后果' } },
        { id: 'ch4', title: '时间悖论', sceneDescription: '你必须解决一个时间悖论——否则时间线将崩溃', targetDimensions: ['I', 'R'], questionsPerChapter: 4, reward: { xp: 40, storyProgress: '你开始理解时间的本质' } },
        { id: 'ch5', title: '回归与选择', sceneDescription: '你有机会回到原来的时间线，但需要做出最终的选择', targetDimensions: ['R'], questionsPerChapter: 4, reward: { xp: 40, badge: { id: 'time-master', name: '时间大师', emoji: '⌚' }, storyProgress: '你完成了时间旅行' } },
      ],
      totalQuestions: 20,
      estimatedMinutes: 40,
    },
  ],
}

// ===================================================================
// 故事引擎核心逻辑
// ===================================================================

/** 获取适合年龄段的故事世界 */
export function getStoryWorldsForAge(ageGroup: AgeGroupKey): StoryWorld[] {
  return STORY_WORLDS[ageGroup] || STORY_WORLDS['upper-primary'] || []
}

/** 初始化游戏状态 */
export function initGameState(worldId: string): StoryGameState {
  return {
    worldId,
    currentChapter: 0,
    currentQuestionInChapter: 0,
    totalAnswered: 0,
    dimensionXP: {},
    unlockedBadges: [],
    streakCount: 0,
    maxStreak: 0,
    lastAnswerScore: null,
    storyFlags: [],
  }
}

/** 处理回答并更新游戏状态 */
export function processAnswer(
  state: StoryGameState,
  world: StoryWorld,
  dimension: string,
  score: number,
): StoryGameState {
  const newXP = { ...state.dimensionXP }
  newXP[dimension] = (newXP[dimension] || 0) + Math.round(score * 0.15)

  // 连击计算
  const isHighScore = score >= 70
  const newStreak = isHighScore ? state.streakCount + 1 : 0
  const newMaxStreak = Math.max(state.maxStreak, newStreak)

  // 检查章节完成
  const chapter = world.chapters[state.currentChapter]
  let newChapter = state.currentChapter
  let newQuestionInChapter = state.currentQuestionInChapter + 1
  let newBadges = [...state.unlockedBadges]
  let newFlags = [...state.storyFlags]

  if (chapter && newQuestionInChapter >= chapter.questionsPerChapter) {
    // 章节完成
    if (chapter.reward.badge && !newBadges.find(b => b.id === chapter.reward!.badge!.id)) {
      newBadges.push({ ...chapter.reward.badge, unlockedAt: Date.now() })
    }
    newFlags.push(chapter.reward.storyProgress)
    newChapter = state.currentChapter + 1
    newQuestionInChapter = 0
  }

  return {
    worldId: state.worldId,
    currentChapter: newChapter,
    currentQuestionInChapter: newQuestionInChapter,
    totalAnswered: state.totalAnswered + 1,
    dimensionXP: newXP,
    unlockedBadges: newBadges,
    streakCount: newStreak,
    maxStreak: newMaxStreak,
    lastAnswerScore: score,
    storyFlags: newFlags,
  }
}

/** 为章节中的问题生成年龄自适应选项 */
export function generateChapterQuestions(
  chapter: StoryChapterDef,
  ageGroup: AgeGroupKey,
  sessionSeed: string,
): Array<{ dimension: string; questionText: string; options: Array<{ id: string; text: string; scores: Record<string, number> }> }> {
  const questions: Array<{ dimension: string; questionText: string; options: Array<{ id: string; text: string; scores: Record<string, number> }> }> = []

  for (let i = 0; i < chapter.questionsPerChapter; i++) {
    const dim = chapter.targetDimensions[i % chapter.targetDimensions.length]
    const questionId = `${chapter.id}-q${i}`
    const poolOptions = generateOptionsFromPool(dim, ageGroup, questionId, sessionSeed)
    const shuffledOptions = shuffleOptions(poolOptions, questionId, sessionSeed)

    questions.push({
      dimension: dim,
      questionText: chapter.sceneDescription,
      options: shuffledOptions.map((opt, idx) => ({
        id: opt.id || `${dim}-opt-${idx}`,
        text: opt.text,
        scores: opt.scores,
      })),
    })
  }

  return questions
}

/** 计算总进度百分比 */
export function calculateProgress(state: StoryGameState, world: StoryWorld): number {
  const totalQuestions = world.chapters.reduce((sum, ch) => sum + ch.questionsPerChapter, 0)
  if (totalQuestions === 0) return 0
  return Math.round((state.totalAnswered / totalQuestions) * 100)
}

/** 获取伙伴对回答的反应 */
export function getCompanionReaction(
  companion: StoryCompanion,
  score: number,
): string {
  if (score >= 70) {
    return companion.reactionPositive[Math.floor(Math.random() * companion.reactionPositive.length)]
  }
  return companion.reactionNeutral[Math.floor(Math.random() * companion.reactionNeutral.length)]
}

/** 检查是否已获得连击徽章 */
export function checkStreakBadges(state: StoryGameState): Array<{ id: string; name: string; emoji: string }> {
  const newBadges: Array<{ id: string; name: string; emoji: string }> = []

  if (state.maxStreak >= 5 && !state.unlockedBadges.find(b => b.id === 'streak-5')) {
    newBadges.push({ id: 'streak-5', name: '五连击', emoji: '🔥' })
  }
  if (state.maxStreak >= 10 && !state.unlockedBadges.find(b => b.id === 'streak-10')) {
    newBadges.push({ id: 'streak-10', name: '十连击大师', emoji: '💥' })
  }

  return newBadges
}
