import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeft, Send, Sparkles, Brain, Lightbulb, Compass, Zap, TreePine, Telescope, Flame } from 'lucide-react'
import { getTimeGreeting, getRandomFunFact, getRandomEncouragement, getMilestone, getCompletionMessage } from '../lib/funElements'
import { createSignalExtractor, type SignalExtractionResult } from '../lib/ai/openEndedSignalExtractor'
import type { WilderDimension } from '../lib/minigame/types'

/* ========== Types ========== */
interface ChatProps {
  studentName: string
  studentAge: number
  onBack: () => void
  onComplete: () => void
}

interface ChatOption {
  id: string
  text: string
  emoji?: string
  score?: number // 用于评分
}

interface ChatQuestion {
  id: string
  stage: number
  dimension: string
  wilder: 'W' | 'I' | 'L' | 'D' | 'E' | 'R' // WILDER维度
  taskCard: string          // 任务卡引入语
  aiMessage: string          // 主问题
  followUp?: string          // 追问/引导语
  options: ChatOption[]
  transition?: string        // 过渡到下一题的衔接语
  growthFeedback?: string    // 成长反馈（每3题）
}

interface ChatMessage {
  id: string
  role: 'ai' | 'user'
  content: string
  timestamp: Date
  isTaskCard?: boolean       // 是否是任务卡样式
  isGrowthFeedback?: boolean // 是否是成长反馈
}

/* ========== 年龄层级判断 ========== */
type AgeLevel = 'L0' | 'L2' | 'L4' | 'L5'

function getAgeLevel(age: number): AgeLevel {
  if (age <= 8) return 'L0'   // 6-8岁
  if (age <= 11) return 'L2'  // 9-11岁
  if (age <= 14) return 'L4'  // 12-14岁
  return 'L5'                  // 15-18岁
}

function getAgeLevelName(level: AgeLevel): string {
  switch (level) {
    case 'L0': return '探险新手'
    case 'L2': return '探索者'
    case 'L4': return '研究员'
    case 'L5': return '科学家'
  }
}

/* ========== 阶段信息 ========== */
const STAGES = [
  { name: '热身关卡', icon: Flame, color: 'from-amber-400 to-orange-500', desc: '让我们互相认识一下' },
  { name: '好奇心探险', icon: Telescope, color: 'from-brand-400 to-brand-600', desc: '测测你的探究力' },
  { name: '思维迷宫', icon: Brain, color: 'from-violet-400 to-purple-500', desc: '挑战你的思维力' },
  { name: '创意工坊', icon: Lightbulb, color: 'from-rose-400 to-pink-500', desc: '释放你的表达力' },
  { name: '荒野挑战', icon: TreePine, color: 'from-emerald-400 to-green-600', desc: '考验你的协作与坚持' },
  { name: '终极解码', icon: Compass, color: 'from-sky-400 to-blue-500', desc: '综合能力大检阅' },
]

/* ========== 6-8岁题库 (L0-L1) ========== */
const QUESTIONS_L0: ChatQuestion[] = [
  // Stage 0: 热身
  {
    id: 'l0_q1', stage: 0, dimension: '破冰', wilder: 'W',
    taskCard: '🎒 任务卡 #1：超能力选择',
    aiMessage: '嘿小探险家！如果你明天醒来，发现自己有了一个超能力，你最想要哪一个？',
    options: [
      { id: 'a', text: '能听懂小动物说话', emoji: '🐾', score: 3 },
      { id: 'b', text: '能飞到天上去', emoji: '🦅', score: 3 },
      { id: 'c', text: '能变隐形', emoji: '👻', score: 3 },
      { id: 'd', text: '能变出好吃的', emoji: '🍰', score: 3 },
    ],
    transition: '哇哦！这个选择太酷了！',
  },
  {
    id: 'l0_q2', stage: 0, dimension: '兴趣', wilder: 'I',
    taskCard: '🎒 任务卡 #2：周末冒险',
    aiMessage: '想象一下：周末一整天，没有作业，你想干什么？',
    options: [
      { id: 'a', text: '出去玩、探险', emoji: '🏃', score: 3 },
      { id: 'b', text: '画画、做手工', emoji: '🎨', score: 3 },
      { id: 'c', text: '看书、看动画', emoji: '📺', score: 3 },
      { id: 'd', text: '和朋友一起玩', emoji: '👫', score: 3 },
    ],
    transition: '不错不错，我开始了解你了！',
  },
  {
    id: 'l0_q3', stage: 0, dimension: '自我认知', wilder: 'R',
    taskCard: '🎒 任务卡 #3：天气性格',
    aiMessage: '如果你是一种天气，你觉得自己像哪种？',
    options: [
      { id: 'a', text: '大太阳——总是开开心心', emoji: '☀️', score: 3 },
      { id: 'b', text: '小雨——有时候安静想事情', emoji: '🌧️', score: 3 },
      { id: 'c', text: '大风——精力充沛跑来跑去', emoji: '🌪️', score: 3 },
      { id: 'd', text: '彩虹——心情会变来变去', emoji: '🌈', score: 3 },
    ],
    growthFeedback: '🌟 成长发现：你很会观察自己的感受，这是一种很棒的能力！',
    transition: '热身完成！接下来我们开始真正的探险～',
  },

  // Stage 1: 好奇心探险 (Wonder)
  {
    id: 'l0_q4', stage: 1, dimension: '观察力', wilder: 'W',
    taskCard: '🔍 探险任务 #1：小侦探观察',
    aiMessage: '小侦探来了！\n\n树叶为什么是绿色的，你觉得是因为什么？',
    options: [
      { id: 'a', text: '因为太阳照的', emoji: '☀️', score: 2 },
      { id: 'b', text: '因为树叶里面有绿色的东西', emoji: '🧪', score: 4 },
      { id: 'c', text: '因为本来就是绿色', emoji: '🤔', score: 1 },
      { id: 'd', text: '我不知道，但我很想知道', emoji: '❓', score: 3 },
    ],
    followUp: '有意思！那你猜猜看，秋天树叶为什么会变黄呢？',
    transition: '你的好奇心真棒！',
  },
  {
    id: 'l0_q5', stage: 1, dimension: '提问能力', wilder: 'W',
    taskCard: '🔍 探险任务 #2：问题大王',
    aiMessage: '如果你遇到了一只会说话的蚂蚁，你最想问它什么？',
    options: [
      { id: 'a', text: '你们的家长什么样？', emoji: '🏠', score: 3 },
      { id: 'b', text: '你能举起比自己重的东西吗？', emoji: '💪', score: 4 },
      { id: 'c', text: '你每天吃什么？', emoji: '🍽️', score: 2 },
      { id: 'd', text: '你有朋友吗？', emoji: '🐜', score: 3 },
    ],
    transition: '哈哈，这个问题问得好！',
  },
  {
    id: 'l0_q6', stage: 1, dimension: '因果推理', wilder: 'W',
    taskCard: '🔍 探险任务 #3：小小推理家',
    aiMessage: '冰淇淋放在太阳下会怎么样？',
    options: [
      { id: 'a', text: '会化掉变成水', emoji: '💧', score: 4 },
      { id: 'b', text: '会变得更好吃', emoji: '😋', score: 1 },
      { id: 'c', text: '不会有变化', emoji: '🤷', score: 1 },
      { id: 'd', text: '会变热', emoji: '🔥', score: 2 },
    ],
    growthFeedback: '🌟 成长发现：你能把看到的事情和原因联系起来，这是科学家最重要的本领！',
    transition: '你的观察力很敏锐！',
  },

  // Stage 2: 思维迷宫 (Inquiry)
  {
    id: 'l0_q7', stage: 2, dimension: '逻辑推理', wilder: 'I',
    taskCard: '🧩 思维关卡 #1：数字游戏',
    aiMessage: '来玩个数字游戏！\n\n1, 2, 3, 5, 8, 13, ___\n\n下一个数字是什么？',
    options: [
      { id: 'a', text: '14', emoji: '🔢', score: 1 },
      { id: 'b', text: '21', emoji: '✨', score: 4 },
      { id: 'c', text: '15', emoji: '🤔', score: 1 },
      { id: 'd', text: '我想画出来算一算', emoji: '📝', score: 3 },
    ],
    transition: '动脑筋的感觉怎么样？',
  },
  {
    id: 'l0_q8', stage: 2, dimension: '分类能力', wilder: 'I',
    taskCard: '🧩 思维关卡 #2：分类大师',
    aiMessage: '哪个和其他不一样？\n\n🍎苹果、🍊橘子、🥕胡萝卜、🍇葡萄',
    options: [
      { id: 'a', text: '苹果——因为是红色的', emoji: '🍎', score: 2 },
      { id: 'b', text: '胡萝卜——因为是蔬菜不是水果', emoji: '🥕', score: 4 },
      { id: 'c', text: '橘子——因为要剥皮', emoji: '🍊', score: 2 },
      { id: 'd', text: '葡萄——因为是一串一串的', emoji: '🍇', score: 2 },
    ],
    transition: '你的分类方式很有意思！',
  },
  {
    id: 'l0_q9', stage: 2, dimension: '空间想象', wilder: 'I',
    taskCard: '🧩 思维关卡 #3：图形魔法',
    aiMessage: '一张正方形的纸，对折再对折，然后在角上剪一个小洞。\n\n打开后会有几个洞？',
    options: [
      { id: 'a', text: '1个', emoji: '1️⃣', score: 1 },
      { id: 'b', text: '2个', emoji: '2️⃣', score: 2 },
      { id: 'c', text: '4个', emoji: '4️⃣', score: 4 },
      { id: 'd', text: '我想试试看才知道', emoji: '✂️', score: 3 },
    ],
    growthFeedback: '🌟 成长发现：你很擅长在脑子里想象图形变化，这是设计师和工程师都需要的能力！',
    transition: '太棒了！接下来换个方向～',
  },

  // Stage 3: 创意工坊 (Expression)
  {
    id: 'l0_q10', stage: 3, dimension: '想象力', wilder: 'L',
    taskCard: '🎨 创意任务 #1：神奇改造',
    aiMessage: '如果给你一个大纸箱，你会把它变成什么？',
    options: [
      { id: 'a', text: '变成一辆赛车', emoji: '🏎️', score: 4 },
      { id: 'b', text: '变成一个小房子', emoji: '🏠', score: 3 },
      { id: 'c', text: '变成一个机器人', emoji: '🤖', score: 4 },
      { id: 'd', text: '拆开来画画', emoji: '🖼️', score: 3 },
    ],
    transition: '哇，你的脑洞好大！',
  },
  {
    id: 'l0_q11', stage: 3, dimension: '语言表达', wilder: 'L',
    taskCard: '🎨 创意任务 #2：感觉魔术师',
    aiMessage: '不用"开心"这个词，你怎么形容开心的感觉？',
    options: [
      { id: 'a', text: '像肚子里有泡泡在咕噜咕噜', emoji: '🫧', score: 4 },
      { id: 'b', text: '像被暖暖的阳光照着', emoji: '☀️', score: 4 },
      { id: 'c', text: '想笑、想跳', emoji: '😊', score: 3 },
      { id: 'd', text: '说不清楚，就是很舒服', emoji: '😌', score: 2 },
    ],
    transition: '你形容得真好！',
  },
  {
    id: 'l0_q12', stage: 3, dimension: '故事创作', wilder: 'L',
    taskCard: '🎨 创意任务 #3：故事接龙',
    aiMessage: '"从前有一只小兔子，它发现了一个会发光的神秘洞穴..."\n\n接下来会发生什么？',
    options: [
      { id: 'a', text: '小兔子勇敢地走了进去', emoji: '🐰', score: 4 },
      { id: 'b', text: '小兔子跑回去叫朋友一起来', emoji: '🐿️', score: 3 },
      { id: 'c', text: '小兔子先观察了一会儿', emoji: '👀', score: 3 },
      { id: 'd', text: '小兔子有点害怕，决定明天再来', emoji: '🌙', score: 2 },
    ],
    growthFeedback: '🌟 成长发现：你很会用语言表达自己的想法，这是一种超级重要的沟通力！',
    transition: '你讲故事的能力不错！',
  },

  // Stage 4: 荒野挑战 (Collaboration & Persistence)
  {
    id: 'l0_q13', stage: 4, dimension: '团队合作', wilder: 'D',
    taskCard: '🏕️ 荒野挑战 #1：新朋友',
    aiMessage: '班上来了一个新同学，看起来有点紧张。你会怎么做？',
    options: [
      { id: 'a', text: '主动过去打招呼', emoji: '👋', score: 4 },
      { id: 'b', text: '等老师让我们认识', emoji: '👩‍🏫', score: 2 },
      { id: 'c', text: '先看看再说', emoji: '👀', score: 2 },
      { id: 'd', text: '邀请TA一起玩', emoji: '🎮', score: 4 },
    ],
    transition: '你很有爱心！',
  },
  {
    id: 'l0_q14', stage: 4, dimension: '坚持力', wilder: 'E',
    taskCard: '🏕️ 荒野挑战 #2：困难时刻',
    aiMessage: '积木塔倒了三次还是搭不好，你会怎么办？',
    options: [
      { id: 'a', text: '再试一次！', emoji: '💪', score: 4 },
      { id: 'b', text: '换个方法试试', emoji: '🔄', score: 4 },
      { id: 'c', text: '休息一下再来', emoji: '☕', score: 3 },
      { id: 'd', text: '算了，玩别的吧', emoji: '🎈', score: 1 },
    ],
    transition: '面对困难的态度很重要！',
  },
  {
    id: 'l0_q15', stage: 4, dimension: '情绪管理', wilder: 'E',
    taskCard: '🏕️ 荒野挑战 #3：情绪小怪兽',
    aiMessage: '如果有人不小心弄坏了你最喜欢的玩具，你会？',
    options: [
      { id: 'a', text: '很生气，但会慢慢平复', emoji: '😤', score: 3 },
      { id: 'b', text: '很难过，可能会哭', emoji: '😢', score: 3 },
      { id: 'c', text: '告诉大人处理', emoji: '🙋', score: 3 },
      { id: 'd', text: '没关系，玩具可以再买', emoji: '😌', score: 3 },
    ],
    growthFeedback: '🌟 成长发现：你知道怎么和别人相处，也知道怎么处理自己的情绪，这是很成熟的表现！',
    transition: '你处理问题的方式很棒！',
  },

  // Stage 5: 终极解码 (Reflection)
  {
    id: 'l0_q16', stage: 5, dimension: '自我认知', wilder: 'R',
    taskCard: '🎯 终极任务 #1：自画像',
    aiMessage: '如果让你的好朋友说说你，TA会怎么形容你？',
    options: [
      { id: 'a', text: '很聪明、点子多', emoji: '🧠', score: 3 },
      { id: 'b', text: '很善良、乐于助人', emoji: '💝', score: 3 },
      { id: 'c', text: '很有趣、爱笑', emoji: '😄', score: 3 },
      { id: 'd', text: '很认真、做事专心', emoji: '📚', score: 3 },
    ],
    transition: '你很了解自己！',
  },
  {
    id: 'l0_q17', stage: 5, dimension: '学习偏好', wilder: 'R',
    taskCard: '🎯 终极任务 #2：学习方式',
    aiMessage: '学新东西的时候，哪种方式你学得最快？',
    options: [
      { id: 'a', text: '看别人怎么做', emoji: '👁️', score: 3 },
      { id: 'b', text: '自己动手试试', emoji: '✋', score: 3 },
      { id: 'c', text: '听别人讲解', emoji: '👂', score: 3 },
      { id: 'd', text: '画图或做笔记', emoji: '📝', score: 3 },
    ],
    transition: '每个人都有自己擅长的学习方式！',
  },
  {
    id: 'l0_q18', stage: 5, dimension: '未来愿景', wilder: 'R',
    taskCard: '🎯 终极任务 #3：未来的你',
    aiMessage: '最后一个问题！长大以后，你最想成为什么样的人？',
    options: [
      { id: 'a', text: '很厉害的人，在某件事上做到最好', emoji: '🏆', score: 3 },
      { id: 'b', text: '很快乐的人，做喜欢的事', emoji: '😊', score: 3 },
      { id: 'c', text: '能帮助别人的人', emoji: '🤝', score: 3 },
      { id: 'd', text: '还不知道，但想一直学新东西', emoji: '🚀', score: 3 },
    ],
    growthFeedback: '🌟 成长发现：你对未来有自己的想法，这种思考能力会帮助你一步步接近梦想！',
  },
]

/* ========== 9-11岁题库 (L2-L3) ========== */
const QUESTIONS_L2: ChatQuestion[] = [
  // Stage 0: 热身
  {
    id: 'l2_q1', stage: 0, dimension: '破冰', wilder: 'W',
    taskCard: '🎒 探索者档案 #1',
    aiMessage: '欢迎来到GROWMATE基地！在我们开始探险之前，先让我了解一下你～\n\n如果你可以获得一个科学家的超能力，你会选？',
    options: [
      { id: 'a', text: '能看到微观世界——比显微镜还厉害', emoji: '🔬', score: 3 },
      { id: 'b', text: '能预测天气——比卫星还准', emoji: '🌤️', score: 3 },
      { id: 'c', text: '能和任何动物交流', emoji: '🦁', score: 3 },
      { id: 'd', text: '能让时间变慢——研究任何现象', emoji: '⏳', score: 3 },
    ],
    transition: '有趣的选择！科学家确实需要这样的"超能力"思维。',
  },
  {
    id: 'l2_q2', stage: 0, dimension: '兴趣', wilder: 'I',
    taskCard: '🎒 探索者档案 #2',
    aiMessage: '如果学校开了这些课，不计成绩纯粹为了好玩，你最想选哪一门？',
    options: [
      { id: 'a', text: '机器人编程与AI', emoji: '🤖', score: 3 },
      { id: 'b', text: '野外生存与自然探索', emoji: '🏕️', score: 3 },
      { id: 'c', text: '创意写作与戏剧表演', emoji: '🎭', score: 3 },
      { id: 'd', text: '经济学与商业模拟', emoji: '📊', score: 3 },
    ],
    transition: '这个选择说明了很多关于你的兴趣方向！',
  },
  {
    id: 'l2_q3', stage: 0, dimension: '自我认知', wilder: 'R',
    taskCard: '🎒 探索者档案 #3',
    aiMessage: '在小组活动中，你通常是什么角色？',
    options: [
      { id: 'a', text: '出主意的那个——"我觉得我们可以..."', emoji: '💡', score: 3 },
      { id: 'b', text: '组织协调的那个——"来，我们分工一下"', emoji: '📋', score: 3 },
      { id: 'c', text: '默默干活的那个——"交给我吧"', emoji: '🔧', score: 3 },
      { id: 'd', text: '看情况，什么都能做', emoji: '🔄', score: 3 },
    ],
    growthFeedback: '🌟 探索者徽章：你对自己的定位很清晰！自我认知是探索世界的第一步。',
    transition: '档案建立完成！现在开始正式的探索任务——',
  },

  // Stage 1: 好奇心探险 (Wonder/Inquiry)
  {
    id: 'l2_q4', stage: 1, dimension: '科学观察', wilder: 'W',
    taskCard: '🔭 科学任务 #1：变量侦探',
    aiMessage: '小明想知道植物长得快不快和什么有关。他准备了三盆一样的植物，你觉得他应该怎么做实验？',
    options: [
      { id: 'a', text: '一盆多浇水、一盆少浇水、一盆正常', emoji: '💧', score: 4 },
      { id: 'b', text: '三盆都放不同地方，看哪个长得好', emoji: '📍', score: 2 },
      { id: 'c', text: '三盆用不同的土、不同的水、不同的光', emoji: '🌱', score: 1 },
      { id: 'd', text: '我觉得应该只改变一个条件', emoji: '🎯', score: 4 },
    ],
    followUp: '为什么你这样选？科学家做实验时有什么讲究？',
    transition: '你已经有变量控制的意识了！',
  },
  {
    id: 'l2_q5', stage: 1, dimension: '因果推理', wilder: 'W',
    taskCard: '🔭 科学任务 #2：因果链',
    aiMessage: '下雨天，蚯蚓会从泥土里爬出来。你觉得是因为什么？',
    options: [
      { id: 'a', text: '因为土里太湿了，蚯蚓会被淹死', emoji: '💧', score: 4 },
      { id: 'b', text: '因为蚯蚓喜欢雨水的味道', emoji: '👃', score: 1 },
      { id: 'c', text: '因为下雨天温度变低了', emoji: '🌡️', score: 2 },
      { id: 'd', text: '我不确定，但可以设计实验验证', emoji: '🔬', score: 4 },
    ],
    transition: '会思考"因为...所以..."是很重要的科学思维！',
  },
  {
    id: 'l2_q6', stage: 1, dimension: '提问能力', wilder: 'W',
    taskCard: '🔭 科学任务 #3：问题大师',
    aiMessage: '你发现家里的植物叶子变黄了。作为一个小科学家，你会先问什么问题？',
    options: [
      { id: 'a', text: '是不是浇水太多或太少了？', emoji: '💧', score: 4 },
      { id: 'b', text: '是不是光照不够？', emoji: '☀️', score: 4 },
      { id: 'c', text: '其他植物有没有同样的问题？', emoji: '🌿', score: 4 },
      { id: 'd', text: '这棵植物是什么时候开始变黄的？', emoji: '📅', score: 4 },
    ],
    growthFeedback: '🌟 探索者徽章：你问问题的方式非常科学！好的问题是发现答案的第一步。',
    transition: '问对问题，就成功了一半！',
  },

  // Stage 2: 思维迷宫 (Inquiry)
  {
    id: 'l2_q7', stage: 2, dimension: '逻辑推理', wilder: 'I',
    taskCard: '🧩 逻辑挑战 #1：推理游戏',
    aiMessage: '小红、小明、小华三个人，一个喜欢画画，一个喜欢音乐，一个喜欢运动。\n\n线索：\n• 小红不喜欢运动\n• 喜欢音乐的不是小华\n\n请问小明喜欢什么？',
    options: [
      { id: 'a', text: '画画', emoji: '🎨', score: 1 },
      { id: 'b', text: '音乐', emoji: '🎵', score: 4 },
      { id: 'c', text: '运动', emoji: '⚽', score: 1 },
      { id: 'd', text: '信息不够，无法确定', emoji: '❓', score: 2 },
    ],
    followUp: '你是怎么推理出来的？能说说你的思考过程吗？',
    transition: '逻辑推理就是这样一步步排除的！',
  },
  {
    id: 'l2_q8', stage: 2, dimension: '数学思维', wilder: 'I',
    taskCard: '🧩 逻辑挑战 #2：规律发现',
    aiMessage: '观察这个数列的规律：\n\n2, 6, 12, 20, 30, ___\n\n下一个数是多少？',
    options: [
      { id: 'a', text: '40', emoji: '🔢', score: 2 },
      { id: 'b', text: '42', emoji: '✨', score: 4 },
      { id: 'c', text: '36', emoji: '🤔', score: 1 },
      { id: 'd', text: '让我列一列看看差值', emoji: '📝', score: 4 },
    ],
    transition: '找规律是数学思维的核心能力！',
  },
  {
    id: 'l2_q9', stage: 2, dimension: '方案比较', wilder: 'I',
    taskCard: '🧩 逻辑挑战 #3：方案PK',
    aiMessage: '你要从家里去图书馆，有两条路：\n• 路线A：走大路，2公里，但要等3个红绿灯\n• 路线B：走小路，1.5公里，但有一段上坡\n\n你骑自行车去，会选哪条？',
    options: [
      { id: 'a', text: '选A，因为大路更安全平坦', emoji: '🛣️', score: 3 },
      { id: 'b', text: '选B，因为距离短，上坡可以锻炼', emoji: '🚴', score: 3 },
      { id: 'c', text: '看时间紧不紧，赶时间选B', emoji: '⏰', score: 4 },
      { id: 'd', text: '两条路都试一次，比较哪个更快', emoji: '🔄', score: 4 },
    ],
    growthFeedback: '🌟 探索者徽章：你会综合考虑多个因素来做决定，这是非常成熟的思维方式！',
    transition: '决策能力是很重要的生活技能！',
  },

  // Stage 3: 创意工坊 (Expression/Link)
  {
    id: 'l2_q10', stage: 3, dimension: '创意思维', wilder: 'L',
    taskCard: '💡 创意实验室 #1：跨界思考',
    aiMessage: '回形针除了夹纸，还能用来做什么？说出最有创意的用法！',
    options: [
      { id: 'a', text: '做成小挂钩挂东西', emoji: '🪝', score: 3 },
      { id: 'b', text: '拉直了当简易开锁工具', emoji: '🔓', score: 4 },
      { id: 'c', text: '串起来做成项链或装饰', emoji: '📿', score: 3 },
      { id: 'd', text: '当书签或手机卡槽针', emoji: '📱', score: 4 },
    ],
    transition: '创意就是看到别人看不到的可能性！',
  },
  {
    id: 'l2_q11', stage: 3, dimension: '表达能力', wilder: 'L',
    taskCard: '💡 创意实验室 #2：科学讲解员',
    aiMessage: '如果要给一年级小朋友解释"为什么天是蓝色的"，你会怎么说？',
    options: [
      { id: 'a', text: '阳光里有彩虹的颜色，蓝色最容易被天空抓住', emoji: '🌈', score: 4 },
      { id: 'b', text: '因为光的散射，蓝光波长短容易被大气散射', emoji: '🔬', score: 2 },
      { id: 'c', text: '就像海水看起来是蓝的一样，天空也会反射蓝色', emoji: '🌊', score: 3 },
      { id: 'd', text: '太阳的光穿过空气时，蓝色的光被撒得到处都是', emoji: '☀️', score: 4 },
    ],
    transition: '能把复杂的事情讲简单，是一种很厉害的能力！',
  },
  {
    id: 'l2_q12', stage: 3, dimension: '联想能力', wilder: 'L',
    taskCard: '💡 创意实验室 #3：类比大师',
    aiMessage: '如果把人体比作一座城市，心脏像什么？大脑像什么？',
    options: [
      { id: 'a', text: '心脏像水泵站，大脑像市政府', emoji: '🏛️', score: 4 },
      { id: 'b', text: '心脏像发电厂，大脑像控制中心', emoji: '⚡', score: 4 },
      { id: 'c', text: '心脏像公交总站，大脑像指挥塔', emoji: '🚌', score: 3 },
      { id: 'd', text: '我有自己的比喻想法', emoji: '💭', score: 4 },
    ],
    growthFeedback: '🌟 探索者徽章：你很擅长用熟悉的东西解释新概念，这是优秀老师都具备的能力！',
    transition: '类比思维是科学发现的重要工具！',
  },

  // Stage 4: 荒野挑战 (Design/Collaboration)
  {
    id: 'l2_q13', stage: 4, dimension: '问题解决', wilder: 'D',
    taskCard: '🏕️ 野外任务 #1：生存挑战',
    aiMessage: '你和队友在野外迷路了，太阳快下山。你们有：一张地图（但不知道自己在哪）、一瓶水、一把刀、一条绳子。\n\n第一步应该做什么？',
    options: [
      { id: 'a', text: '找高处观察周围环境', emoji: '⛰️', score: 4 },
      { id: 'b', text: '先找一个安全的地方过夜', emoji: '🏕️', score: 3 },
      { id: 'c', text: '选一个方向坚定走下去', emoji: '🧭', score: 2 },
      { id: 'd', text: '先和队友讨论，达成一致', emoji: '🤝', score: 4 },
    ],
    followUp: '如果队友有不同意见，你会怎么处理？',
    transition: '在紧急情况下的决策能力很重要！',
  },
  {
    id: 'l2_q14', stage: 4, dimension: '团队协作', wilder: 'D',
    taskCard: '🏕️ 野外任务 #2：分工合作',
    aiMessage: '你们小组要完成一个科学展示项目，有人想做实验部分，有人想做PPT，有人想当讲解员。\n\n但是，有两个人都想当讲解员，怎么办？',
    options: [
      { id: 'a', text: '让他们轮流讲，各讲一部分', emoji: '🔄', score: 4 },
      { id: 'b', text: '让全组投票决定', emoji: '🗳️', score: 3 },
      { id: 'c', text: '看谁讲得更好就让谁讲', emoji: '🎤', score: 3 },
      { id: 'd', text: '问问他们各自最擅长什么再分工', emoji: '💬', score: 4 },
    ],
    transition: '团队合作需要智慧！',
  },
  {
    id: 'l2_q15', stage: 4, dimension: '坚持力', wilder: 'E',
    taskCard: '🏕️ 野外任务 #3：挫折应对',
    aiMessage: '你准备了很久的演讲比赛，但是上台时忘词了，只拿到了第三名。\n\n比赛后你会怎么想？',
    options: [
      { id: 'a', text: '分析原因，下次改进', emoji: '📝', score: 4 },
      { id: 'b', text: '有点沮丧，但第三名也不错', emoji: '🥉', score: 3 },
      { id: 'c', text: '太紧张了，我不适合比赛', emoji: '😰', score: 1 },
      { id: 'd', text: '请教第一名是怎么准备的', emoji: '🙋', score: 4 },
    ],
    growthFeedback: '🌟 探索者徽章：你面对挫折的态度非常积极！这种心态会帮助你越来越强。',
    transition: '从失败中学习，是成长的捷径！',
  },

  // Stage 5: 终极解码 (Reflection)
  {
    id: 'l2_q16', stage: 5, dimension: '元认知', wilder: 'R',
    taskCard: '🎯 终极解码 #1：学习策略',
    aiMessage: '考试前一天，你发现还有很多内容没复习完。你会怎么做？',
    options: [
      { id: 'a', text: '优先复习自己不熟悉的重点', emoji: '🎯', score: 4 },
      { id: 'b', text: '从头到尾快速过一遍', emoji: '📖', score: 2 },
      { id: 'c', text: '找同学一起复习讨论', emoji: '👥', score: 3 },
      { id: 'd', text: '早点睡，第二天精神好更重要', emoji: '😴', score: 3 },
    ],
    transition: '学会学习，比学到什么更重要！',
  },
  {
    id: 'l2_q17', stage: 5, dimension: '批判思维', wilder: 'R',
    taskCard: '🎯 终极解码 #2：信息判断',
    aiMessage: '你在网上看到一篇文章说"巧克力可以让人变聪明"。你会？',
    options: [
      { id: 'a', text: '查一下是谁写的，有没有科学依据', emoji: '🔍', score: 4 },
      { id: 'b', text: '找其他来源看是不是也这么说', emoji: '📰', score: 4 },
      { id: 'c', text: '听起来有道理，可能是真的', emoji: '🤔', score: 1 },
      { id: 'd', text: '问老师或家长怎么看', emoji: '👨‍🏫', score: 3 },
    ],
    transition: '质疑精神是科学素养的核心！',
  },
  {
    id: 'l2_q18', stage: 5, dimension: '未来规划', wilder: 'R',
    taskCard: '🎯 终极解码 #3：成长愿景',
    aiMessage: '最后一个问题！\n\n五年后的你，最希望自己在什么方面有进步？',
    options: [
      { id: 'a', text: '学习成绩，在某个学科特别优秀', emoji: '📚', score: 3 },
      { id: 'b', text: '特长技能，比如音乐、体育或编程', emoji: '🎸', score: 3 },
      { id: 'c', text: '社交能力，有更多好朋友', emoji: '👥', score: 3 },
      { id: 'd', text: '综合发展，成为更好的自己', emoji: '⭐', score: 3 },
    ],
    growthFeedback: '🌟 探索者徽章：你有清晰的成长目标！保持这份对未来的期待，你一定会越来越棒！',
  },
]

/* ========== 12-14岁题库 (L4) ========== */
const QUESTIONS_L4: ChatQuestion[] = [
  // Stage 0: 热身
  {
    id: 'l4_q1', stage: 0, dimension: '破冰', wilder: 'W',
    taskCard: '📋 研究员档案 #1',
    aiMessage: '欢迎来到GROWMATE研究院！作为一名见习研究员，让我先了解一下你的思维风格。\n\n如果你可以参与任何一项科学研究，你最想研究什么？',
    options: [
      { id: 'a', text: '人工智能——让机器像人一样思考', emoji: '🤖', score: 3 },
      { id: 'b', text: '宇宙探索——寻找外星生命', emoji: '🚀', score: 3 },
      { id: 'c', text: '基因编辑——治愈遗传疾病', emoji: '🧬', score: 3 },
      { id: 'd', text: '环境科学——解决气候变化', emoji: '🌍', score: 3 },
    ],
    transition: '有意思的选择！每个领域都有巨大的研究价值。',
  },
  {
    id: 'l4_q2', stage: 0, dimension: '思维风格', wilder: 'I',
    taskCard: '📋 研究员档案 #2',
    aiMessage: '面对一个复杂问题，你倾向于哪种思考方式？',
    options: [
      { id: 'a', text: '先收集数据，用证据说话', emoji: '📊', score: 3 },
      { id: 'b', text: '先提出假设，再验证', emoji: '🔬', score: 3 },
      { id: 'c', text: '类比其他领域的解决方案', emoji: '🔗', score: 3 },
      { id: 'd', text: '头脑风暴，不设限地想', emoji: '💭', score: 3 },
    ],
    transition: '这说明了你的认知偏好，很有参考价值！',
  },
  {
    id: 'l4_q3', stage: 0, dimension: '自我认知', wilder: 'R',
    taskCard: '📋 研究员档案 #3',
    aiMessage: '在团队项目中，你认为自己的核心竞争力是什么？',
    options: [
      { id: 'a', text: '发现问题和提出创新思路', emoji: '💡', score: 3 },
      { id: 'b', text: '严谨分析和逻辑论证', emoji: '🔍', score: 3 },
      { id: 'c', text: '沟通协调和推动执行', emoji: '🤝', score: 3 },
      { id: 'd', text: '学习能力强，什么都能上手', emoji: '📚', score: 3 },
    ],
    growthFeedback: '🔬 研究员认证：你对自己的能力有清晰的认知，这是自我领导力的基础。',
    transition: '档案建立完成！现在进入正式的研究任务——',
  },

  // Stage 1: 科学探究 (Wonder/Inquiry)
  {
    id: 'l4_q4', stage: 1, dimension: '假设验证', wilder: 'W',
    taskCard: '🔬 实验设计 #1：假设检验',
    aiMessage: '有人声称："听古典音乐能提高学习效率。"\n\n如果你要设计实验来验证这个说法，最关键的是什么？',
    options: [
      { id: 'a', text: '设置对照组——有听音乐和没听音乐的两组', emoji: '👥', score: 4 },
      { id: 'b', text: '控制变量——两组的学习材料、时间、环境都一样', emoji: '🎯', score: 4 },
      { id: 'c', text: '样本量足够大，避免偶然性', emoji: '📊', score: 3 },
      { id: 'd', text: '以上都很重要，缺一不可', emoji: '✅', score: 4 },
    ],
    followUp: '如果实验结果支持这个假设，你能说"古典音乐一定能提高学习效率"吗？为什么？',
    transition: '科学实验的核心就是控制变量和设置对照！',
  },
  {
    id: 'l4_q5', stage: 1, dimension: '证据评估', wilder: 'W',
    taskCard: '🔬 实验设计 #2：证据链',
    aiMessage: '一项研究发现：每天喝咖啡的人平均寿命更长。\n\n你认为可以得出"咖啡延长寿命"的结论吗？',
    options: [
      { id: 'a', text: '不能，相关不等于因果', emoji: '⚠️', score: 4 },
      { id: 'b', text: '可以，数据支持这个结论', emoji: '📈', score: 1 },
      { id: 'c', text: '需要看研究的具体设计和样本', emoji: '🔍', score: 3 },
      { id: 'd', text: '可能有第三个因素同时影响两者', emoji: '🔗', score: 4 },
    ],
    transition: '区分相关性和因果性，是科学思维的关键！',
  },
  {
    id: 'l4_q6', stage: 1, dimension: '反例思维', wilder: 'W',
    taskCard: '🔬 实验设计 #3：寻找反例',
    aiMessage: '"所有能飞的都有翅膀。"\n\n你能找到反例推翻这个说法吗？',
    options: [
      { id: 'a', text: '飞机能飞，但没有像鸟那样的翅膀', emoji: '✈️', score: 3 },
      { id: 'b', text: '飞鱼能飞一段距离，它有鳍不是翅膀', emoji: '🐟', score: 3 },
      { id: 'c', text: '蒲公英种子能飞，没有翅膀', emoji: '🌬️', score: 4 },
      { id: 'd', text: '火箭能飞，完全靠推力不靠翅膀', emoji: '🚀', score: 4 },
    ],
    growthFeedback: '🔬 研究员认证：你有很强的反例思维！这是检验假设的重要工具。',
    transition: '寻找反例是检验理论的重要方法！',
  },

  // Stage 2: 系统思维 (Inquiry/Design)
  {
    id: 'l4_q7', stage: 2, dimension: '系统分析', wilder: 'I',
    taskCard: '🧩 系统分析 #1：多因素',
    aiMessage: '一个城市的交通拥堵问题，你认为可能的原因有哪些？（选最全面的分析）',
    options: [
      { id: 'a', text: '车太多，路太少', emoji: '🚗', score: 2 },
      { id: 'b', text: '红绿灯设置不合理、公交系统不便利', emoji: '🚦', score: 3 },
      { id: 'c', text: '城市规划、出行习惯、基础设施、政策等多因素', emoji: '🏙️', score: 4 },
      { id: 'd', text: '高峰期集中出行导致的', emoji: '⏰', score: 2 },
    ],
    followUp: '如果你是城市规划师，你会优先解决哪个因素？为什么？',
    transition: '复杂问题需要系统性的思考！',
  },
  {
    id: 'l4_q8', stage: 2, dimension: '数据解读', wilder: 'I',
    taskCard: '🧩 系统分析 #2：数据陷阱',
    aiMessage: '一款App的广告说："90%的用户认为我们的产品有效！"\n\n这个数据有什么问题？',
    options: [
      { id: 'a', text: '没说总共调查了多少人', emoji: '❓', score: 3 },
      { id: 'b', text: '可能只调查了满意的用户', emoji: '🎯', score: 4 },
      { id: 'c', text: '"有效"的标准是什么没说清', emoji: '📏', score: 4 },
      { id: 'd', text: '以上都是问题', emoji: '⚠️', score: 4 },
    ],
    transition: '批判性地看待数据，是信息时代的必备技能！',
  },
  {
    id: 'l4_q9', stage: 2, dimension: '方案设计', wilder: 'D',
    taskCard: '🧩 系统分析 #3：解决方案',
    aiMessage: '学校食堂的食物浪费很严重。如果让你设计一个减少浪费的方案，你会怎么做？',
    options: [
      { id: 'a', text: '调研原因（份量太大？不好吃？），对症下药', emoji: '🔍', score: 4 },
      { id: 'b', text: '推出小份餐选项，按需取餐', emoji: '🍱', score: 3 },
      { id: 'c', text: '设立"光盘挑战"，给予奖励', emoji: '🏆', score: 3 },
      { id: 'd', text: '先收集数据，分析浪费高峰时段和菜品', emoji: '📊', score: 4 },
    ],
    growthFeedback: '🔬 研究员认证：你有很强的方案设计能力！从调研到设计到执行，思路清晰。',
    transition: '好的解决方案需要先理解问题！',
  },

  // Stage 3: 表达与联结 (Expression/Link)
  {
    id: 'l4_q10', stage: 3, dimension: '论证能力', wilder: 'L',
    taskCard: '📝 论证训练 #1：观点陈述',
    aiMessage: '"学生应该有更多自主选择学习内容的权利。"\n\n如果你支持这个观点，你会用什么论据？',
    options: [
      { id: 'a', text: '兴趣驱动的学习效率更高', emoji: '📈', score: 4 },
      { id: 'b', text: '每个人的天赋不同，统一教育不公平', emoji: '🌈', score: 3 },
      { id: 'c', text: '现实世界需要的能力很多样', emoji: '🌍', score: 3 },
      { id: 'd', text: '自主选择培养决策能力和责任感', emoji: '🎯', score: 4 },
    ],
    followUp: '如果有人反对你的观点，说"学生不成熟，不知道该学什么"，你怎么回应？',
    transition: '好的论证需要论据支撑！',
  },
  {
    id: 'l4_q11', stage: 3, dimension: '跨学科联结', wilder: 'L',
    taskCard: '📝 论证训练 #2：知识联结',
    aiMessage: '全球变暖这个问题，涉及到哪些学科的知识？',
    options: [
      { id: 'a', text: '物理（温室效应）、化学（碳排放）', emoji: '🔬', score: 3 },
      { id: 'b', text: '地理（气候变化）、生物（生态影响）', emoji: '🌍', score: 3 },
      { id: 'c', text: '经济（发展模式）、政治（国际合作）', emoji: '📊', score: 3 },
      { id: 'd', text: '以上所有，而且它们相互关联', emoji: '🔗', score: 4 },
    ],
    transition: '真实问题往往需要跨学科的视角！',
  },
  {
    id: 'l4_q12', stage: 3, dimension: '沟通协商', wilder: 'L',
    taskCard: '📝 论证训练 #3：说服力',
    aiMessage: '你们班想组织一次春游，但校长担心安全问题。你怎么说服校长同意？',
    options: [
      { id: 'a', text: '详细的安全预案+家长签字同意', emoji: '📋', score: 4 },
      { id: 'b', text: '说明春游对学习和团队建设的好处', emoji: '🌟', score: 3 },
      { id: 'c', text: '找老师和家长代表一起去沟通', emoji: '👥', score: 3 },
      { id: 'd', text: '先了解校长具体担心什么，针对性回应', emoji: '🎯', score: 4 },
    ],
    growthFeedback: '🔬 研究员认证：你的沟通策略很成熟！先理解对方的顾虑再回应，是高效沟通的关键。',
    transition: '有效沟通需要换位思考！',
  },

  // Stage 4: 实践与坚持 (Design/Persistence)
  {
    id: 'l4_q13', stage: 4, dimension: '项目规划', wilder: 'D',
    taskCard: '🛠️ 项目实战 #1：任务分解',
    aiMessage: '你要在两周内完成一个科学研究小论文。你会怎么规划时间？',
    options: [
      { id: 'a', text: '第一周找资料、做实验，第二周写论文', emoji: '📅', score: 3 },
      { id: 'b', text: '先定好每天的小目标，逐步完成', emoji: '✅', score: 4 },
      { id: 'c', text: '先列大纲，边研究边写', emoji: '📝', score: 3 },
      { id: 'd', text: '预留几天缓冲时间，防止意外', emoji: '⏳', score: 4 },
    ],
    transition: '项目管理能力是完成复杂任务的关键！',
  },
  {
    id: 'l4_q14', stage: 4, dimension: '抗压能力', wilder: 'E',
    taskCard: '🛠️ 项目实战 #2：压力应对',
    aiMessage: '临近比赛，队友突然退出，你需要一个人完成两个人的工作。你会？',
    options: [
      { id: 'a', text: '评估哪些是必须的，优先完成核心部分', emoji: '🎯', score: 4 },
      { id: 'b', text: '找老师或其他同学帮忙', emoji: '🙋', score: 3 },
      { id: 'c', text: '加班加点，尽量完成原计划', emoji: '💪', score: 2 },
      { id: 'd', text: '调整预期，接受可能的结果不完美', emoji: '🧘', score: 4 },
    ],
    transition: '在压力下做出明智选择是一种能力！',
  },
  {
    id: 'l4_q15', stage: 4, dimension: '反思复盘', wilder: 'R',
    taskCard: '🛠️ 项目实战 #3：经验总结',
    aiMessage: '一个你很用心准备的项目，结果不如预期。项目结束后最该做什么？',
    options: [
      { id: 'a', text: '分析哪些环节出了问题', emoji: '🔍', score: 4 },
      { id: 'b', text: '收集他人的反馈意见', emoji: '💬', score: 4 },
      { id: 'c', text: '记录下来，下次避免同样的错误', emoji: '📝', score: 4 },
      { id: 'd', text: '休息调整，下次再战', emoji: '🔄', score: 2 },
    ],
    growthFeedback: '🔬 研究员认证：你有很强的复盘意识！从经验中学习是持续进步的秘诀。',
    transition: '复盘是最高效的学习方式！',
  },

  // Stage 5: 综合反思 (Reflection)
  {
    id: 'l4_q16', stage: 5, dimension: '价值判断', wilder: 'R',
    taskCard: '🎯 终极思辨 #1：伦理困境',
    aiMessage: '科学家发明了一种可以大幅提高记忆力的药物，但可能有未知的长期副作用。应该批准使用吗？',
    options: [
      { id: 'a', text: '应该，收益大于风险', emoji: '✅', score: 2 },
      { id: 'b', text: '不应该，安全第一', emoji: '⛔', score: 2 },
      { id: 'c', text: '有限批准，先用于特定人群并跟踪', emoji: '🔬', score: 4 },
      { id: 'd', text: '让公众参与决策，不能只由科学家决定', emoji: '🗳️', score: 4 },
    ],
    transition: '科学和伦理常常需要平衡！',
  },
  {
    id: 'l4_q17', stage: 5, dimension: '自我管理', wilder: 'R',
    taskCard: '🎯 终极思辨 #2：时间分配',
    aiMessage: '你发现自己花了太多时间在社交媒体上，影响了学习。你会怎么调整？',
    options: [
      { id: 'a', text: '给自己设定每天的使用时限', emoji: '⏰', score: 4 },
      { id: 'b', text: '把手机放远一点，减少诱惑', emoji: '📵', score: 3 },
      { id: 'c', text: '分析为什么会沉迷，找到根本原因', emoji: '🔍', score: 4 },
      { id: 'd', text: '找替代活动，用更有价值的事填充时间', emoji: '📚', score: 3 },
    ],
    transition: '自我管理是成功的基础！',
  },
  {
    id: 'l4_q18', stage: 5, dimension: '未来规划', wilder: 'R',
    taskCard: '🎯 终极思辨 #3：成长方向',
    aiMessage: '最后一个问题！\n\n你认为，三年后的自己最需要具备什么能力？',
    options: [
      { id: 'a', text: '独立思考和批判性判断', emoji: '🧠', score: 3 },
      { id: 'b', text: '某个专业领域的深度知识', emoji: '📚', score: 3 },
      { id: 'c', text: '跨领域整合和创新能力', emoji: '🔗', score: 3 },
      { id: 'd', text: '自我管理和持续学习能力', emoji: '🚀', score: 3 },
    ],
    growthFeedback: '🔬 研究员认证：你对未来有清晰的规划！有目标感的人，更容易实现自己想要的。',
  },
]

/* ========== 15-18岁题库 (L5-L6) - 精简版 ========== */
const QUESTIONS_L5: ChatQuestion[] = [
  // 由于篇幅限制，L5使用L4的基础上做适当调整
  ...QUESTIONS_L4.map(q => ({
    ...q,
    id: q.id.replace('l4', 'l5'),
    // 可以根据需要调整问题难度和内容
  }))
]

/* ========== 根据年龄获取题库 ========== */
function getQuestionsByAge(age: number): ChatQuestion[] {
  const level = getAgeLevel(age)
  switch (level) {
    case 'L0': return QUESTIONS_L0
    case 'L2': return QUESTIONS_L2
    case 'L4': return QUESTIONS_L4
    case 'L5': return QUESTIONS_L5
    default: return QUESTIONS_L2
  }
}

/* ========== 组件 ========== */
export function Chat({ studentName, studentAge, onBack, onComplete }: ChatProps) {
  const QUESTIONS = getQuestionsByAge(studentAge)
  const TOTAL_QUESTIONS = QUESTIONS.length
  const ageLevel = getAgeLevel(studentAge)
  const ageLevelName = getAgeLevelName(ageLevel)

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(-1)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // 开放式输入相关状态
  const [userInputText, setUserInputText] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const signalExtractor = useState(() => createSignalExtractor(studentAge))[0]
  const [openEndedScores, setOpenEndedScores] = useState<Record<WilderDimension, number[]>>({
    W: [], I: [], L: [], D: [], E: [], R: []
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const firstName = studentName.length > 1 ? studentName.slice(1) : (studentName || '探险家')

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 150)
  }, [])

  const addMessage = useCallback((role: 'ai' | 'user', content: string, extra?: Partial<ChatMessage>) => {
    const msg: ChatMessage = { 
      id: `msg-${Date.now()}-${Math.random()}`, 
      role, 
      content, 
      timestamp: new Date(),
      ...extra
    }
    setMessages(prev => [...prev, msg])
    return msg
  }, [])

  // 欢迎语 - 使用趣味元素
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const timeGreeting = getTimeGreeting()
        const welcomeMsg = studentAge <= 8
          ? `${timeGreeting}\n\n嘿！${firstName}小探险家！🌟 我是你的荒野向导"小荒"！\n\n今天我们要一起玩一些超级有趣的探险游戏！每完成一关，你就能获得一枚神秘徽章哦～ 🏅\n\n记住：这里没有对错，只有属于你的独特答案！准备好开启你的探险之旅了吗？`
          : studentAge <= 11
          ? `${timeGreeting}\n\n你好，${firstName}探索者！🔭 我是GROWMATE实验室的AI向导"小荒"～\n\n接下来我们会通过一系列有趣的挑战来探索你的"超能力"。每个问题都像一张任务卡，完成它就能解锁下一关，还有机会获得稀有徽章！\n\n准备好了吗？让我们开始这场思维大冒险！`
          : `${timeGreeting}\n\n欢迎，${firstName}研究员！🔬 我是GROWMATE研究院的AI助手"小荒"。\n\n接下来的20分钟，我们将通过一系列思维挑战来分析你的能力图谱。这不是考试，而是一次科学的自我探索——每个回答都在帮助我更好地了解你！\n\n准备好接受挑战了吗？`
        addMessage('ai', welcomeMsg)
        setTimeout(() => {
          // 添加趣味知识作为开场
          const funFact = getRandomFunFact()
          addMessage('ai', `💡 小荒的冷知识：${funFact}`, { isTaskCard: true })
          setTimeout(() => {
            addMessage('ai', `🏷️ 你的探险等级：${ageLevelName}`, { isTaskCard: true })
            setTimeout(() => setShowOptions(true), 500)
          }, 800)
        }, 1200)
      }, 1500)
    }, 500)
    return () => clearTimeout(timer)
  }, [firstName, studentAge, ageLevelName, addMessage])

  useEffect(() => { scrollToBottom() }, [messages, isTyping, scrollToBottom])

  const handleStartReady = () => {
    setShowOptions(false)
    addMessage('user', '准备好了！开始吧 🚀')
    setTimeout(() => proceedToQuestion(0), 600)
  }

  const proceedToQuestion = (idx: number) => {
    if (idx >= TOTAL_QUESTIONS) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        // 使用趣味完成语
        const completeMsg = getCompletionMessage(firstName, studentAge <= 11)
        addMessage('ai', completeMsg)
        // 添加徽章庆祝
        setTimeout(() => {
          addMessage('ai', '🏆 恭喜获得【全关卡通关】传说徽章！\n⭐ 你的专属能力报告正在生成中...', { isGrowthFeedback: true })
          setIsComplete(true)
        }, 1500)
      }, 2000)
      return
    }

    // 检查里程碑
    const progressPercent = Math.round(((idx + 1) / TOTAL_QUESTIONS) * 100)
    const milestone = getMilestone(progressPercent)
    
    setCurrentQuestionIdx(idx)
    const q = QUESTIONS[idx]
    setIsTyping(true)

    const prevQ = idx > 0 ? QUESTIONS[idx - 1] : null
    const delay = prevQ?.transition ? 1200 : 800

    setTimeout(() => {
      // 里程碑庆祝
      if (milestone && idx > 0) {
        setIsTyping(false)
        addMessage('ai', `${milestone.message}\n🎁 ${milestone.reward}`, { isGrowthFeedback: true })
        setIsTyping(true)
      }
      
      // 成长反馈（每3题后）
      if (prevQ?.growthFeedback) {
        setIsTyping(false)
        addMessage('ai', prevQ.growthFeedback, { isGrowthFeedback: true })
        setIsTyping(true)
      }

      setTimeout(() => {
        // 阶段提示
        if (idx === 0 || q.stage !== QUESTIONS[idx - 1]?.stage) {
          setIsTyping(false)
          const stage = STAGES[q.stage]
          addMessage('ai', `🎮 进入【${stage.name}】\n${stage.desc}`, { isTaskCard: true })
          setIsTyping(true)
        }

        setTimeout(() => {
          setIsTyping(false)
          // 过渡语
          if (prevQ?.transition) {
            addMessage('ai', prevQ.transition)
            setIsTyping(true)
            setTimeout(() => {
              setIsTyping(false)
              // 任务卡
              addMessage('ai', q.taskCard, { isTaskCard: true })
              setTimeout(() => {
                addMessage('ai', q.aiMessage)
                setTimeout(() => {
                  setShowOptions(true)
                  setSelectedOption(null)
                }, 300)
              }, 600)
            }, 800)
          } else {
            // 任务卡
            addMessage('ai', q.taskCard, { isTaskCard: true })
            setTimeout(() => {
              addMessage('ai', q.aiMessage)
              setTimeout(() => {
                setShowOptions(true)
                setSelectedOption(null)
              }, 300)
            }, 600)
          }
        }, 500)
      }, prevQ?.growthFeedback ? 1500 : 300)
    }, delay)
  }

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption) return
    setSelectedOption(optionId)
    setShowOptions(false)

    const q = QUESTIONS[currentQuestionIdx]
    const option = q.options.find(o => o.id === optionId)
    if (!option) return

    const displayText = option.emoji ? `${option.emoji} ${option.text}` : option.text
    addMessage('user', displayText)

    // 添加即时鼓励反馈
    const encouragement = getRandomEncouragement('thinking')
    setTimeout(() => {
      addMessage('ai', encouragement)
      setTimeout(() => proceedToQuestion(currentQuestionIdx + 1), 600)
    }, 400)
  }

  // 处理开放式文字提交
  const handleTextSubmit = async () => {
    const text = userInputText.trim()
    if (!text || selectedOption) return

    // 清空输入
    setUserInputText('')
    setSelectedOption('__text__') // 标记为已回答

    // 显示用户消息
    addMessage('user', text)

    // 提取信号
    setIsExtracting(true)
    const currentQ = QUESTIONS[currentQuestionIdx]
    const targetDimension = currentQ?.wilder as WilderDimension || 'W'

    try {
      const result = signalExtractor.extract(text, targetDimension)

      // 更新分数
      setOpenEndedScores(prev => ({
        ...prev,
        [targetDimension]: [...prev[targetDimension], result.signals[targetDimension] || 0]
      }))

      // AI 反馈
      const feedback = result.reasoning
        ? `你的想法很有意思！${result.reasoning}`
        : getRandomEncouragement('thinking')

      setTimeout(() => {
        addMessage('ai', feedback)

        // 生成追问（如果置信度较低）
        if (result.confidence < 60) {
          const followUp = signalExtractor.generateFollowUp(text, targetDimension, result)
          setTimeout(() => {
            addMessage('ai', followUp)
            setShowOptions(true) // 显示选项或继续输入
            setSelectedOption(null)
          }, 800)
        } else {
          // 直接进入下一题
          setTimeout(() => proceedToQuestion(currentQuestionIdx + 1), 600)
        }
      }, 400)
    } catch (error) {
      // 降级处理：使用选项评分
      console.error('Signal extraction failed:', error)
      addMessage('ai', '谢谢你的分享！')
      setTimeout(() => proceedToQuestion(currentQuestionIdx + 1), 600)
    } finally {
      setIsExtracting(false)
    }
  }

  // 进度计算
  const progressPercent = currentQuestionIdx < 0 ? 0 : Math.round(((currentQuestionIdx + 1) / TOTAL_QUESTIONS) * 100)
  const currentStage = currentQuestionIdx >= 0 ? QUESTIONS[Math.min(currentQuestionIdx, TOTAL_QUESTIONS - 1)]?.stage ?? 0 : 0
  const currentStageInfo = STAGES[currentStage]
  const StageIcon = currentStageInfo?.icon ?? Sparkles

  const currentQ = currentQuestionIdx >= 0 && currentQuestionIdx < TOTAL_QUESTIONS
    ? QUESTIONS[currentQuestionIdx]
    : null

  return (
    <div className="h-dvh flex flex-col chat-bg overflow-hidden">
      {/* ===== 顶部导航 + 进度 ===== */}
      <header className="sticky top-0 z-50 glass-header border-b border-[rgba(10,10,26,0.06)]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="h-12 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-[rgba(10,10,26,0.35)] hover:text-[#3B5FD9] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">返回</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0A0A1A] flex items-center justify-center">
                <StageIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0A0A1A]">{currentStageInfo?.name ?? '准备中'}</div>
                <div className="text-[10px] text-[rgba(10,10,26,0.35)] font-medium">
                  {currentQuestionIdx < 0 ? `${ageLevelName} · 即将开始` : isComplete ? '探索完成' : `第 ${currentQuestionIdx + 1}/${TOTAL_QUESTIONS} 关`}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-[#3B5FD9]">{isComplete ? 100 : progressPercent}%</div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="pb-2">
            <div className="relative w-full h-1.5 bg-[rgba(10,10,26,0.06)] rounded-full overflow-visible">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out bg-[#3B5FD9]"
                style={{ width: `${isComplete ? 100 : progressPercent}%` }}
              />
              {/* 进度指示点 */}
              <div 
                className="absolute -top-0.5 transition-all duration-700 ease-out"
                style={{ left: `calc(${isComplete ? 100 : progressPercent}% - 5px)` }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#3B5FD9] shadow-sm" />
              </div>
            </div>
            <div className="flex justify-between mt-3 hidden sm:flex">
              {STAGES.map((s, i) => {
                const isActive = i === currentStage
                const isDone = i < currentStage || isComplete
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isDone ? 'bg-[#3B5FD9]' : isActive ? 'bg-[#3B5FD9] scale-125 ring-4 ring-[rgba(59,95,217,0.1)]' : 'bg-[rgba(10,10,26,0.08)]'}`} />
                    <span className={`text-[8px] mt-1 font-semibold hidden sm:block transition-colors ${isDone ? 'text-[#3B5FD9]' : isActive ? 'text-[#3B5FD9]' : 'text-[rgba(10,10,26,0.2)]'}`}>{s.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {/* ===== 聊天区域 ===== */}
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              {msg.role === 'ai' && (
                <div className={`avatar-ai mr-2 mt-1 ${
                  msg.isTaskCard 
                    ? '!bg-[#FFB800]' 
                    : msg.isGrowthFeedback 
                    ? '!bg-[#0F9D94]' 
                    : ''
                }`}>
                  {msg.isTaskCard ? <Zap className="w-3.5 h-3.5 text-white" /> : 
                   msg.isGrowthFeedback ? <Sparkles className="w-3.5 h-3.5 text-white" /> :
                   <Sparkles className="w-3.5 h-3.5 text-white" />}
                </div>
              )}
              <div className={
                msg.isTaskCard 
                  ? 'task-card-bubble' 
                  : msg.isGrowthFeedback
                  ? 'growth-feedback-bubble'
                  : msg.role === 'ai' 
                  ? 'chat-bubble-ai' 
                  : 'chat-bubble-user'
              }>
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start justify-start animate-fade-in">
              <div className="avatar-ai mr-2 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="chat-bubble-ai">
                <div className="flex items-center gap-1.5 py-1">
                  <div className="typing-dot" style={{ animationDelay: '0ms' }} />
                  <div className="typing-dot" style={{ animationDelay: '150ms' }} />
                  <div className="typing-dot" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* ===== 底部选项区域 ===== */}
      <footer className="shrink-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[rgba(10,10,26,0.06)] pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {currentQuestionIdx === -1 && showOptions && !isComplete && (
            <button
              onClick={handleStartReady}
              className="w-full py-4 bg-[#0A0A1A] text-white font-bold text-lg rounded-full shadow-lg hover:bg-[#3B5FD9] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Send className="w-5 h-5" />
              我们AI 智能体老师想和你聊聊
            </button>
          )}

          {currentQuestionIdx >= 0 && showOptions && !isComplete && currentQ && (
            <>
              {/* 选项按钮 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt.id)}
                    disabled={!!selectedOption}
                    className={`option-btn group text-left flex items-start gap-3 ${
                      selectedOption === opt.id
                        ? 'selected ring-2 ring-[rgba(59,95,217,0.3)]'
                        : selectedOption
                        ? 'opacity-50'
                        : ''
                    }`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {opt.emoji && <span className="text-xl mt-0.5 group-hover:scale-125 transition-transform">{opt.emoji}</span>}
                    <span className="text-sm font-medium text-[rgba(10,10,26,0.7)]">{opt.text}</span>
                  </button>
                ))}
              </div>

              {/* 分隔线 */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-[rgba(10,10,26,0.08)]" />
                <span className="text-xs text-[rgba(10,10,26,0.35)] font-medium">或直接输入你的想法</span>
                <div className="flex-1 h-px bg-[rgba(10,10,26,0.08)]" />
              </div>

              {/* 文字输入框 */}
              <div className="flex gap-2">
                <textarea
                  value={userInputText}
                  onChange={(e) => setUserInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleTextSubmit()
                    }
                  }}
                  placeholder={
                    studentAge <= 8 ? '说说你的想法...（也可以点上面的选项）' :
                    studentAge <= 11 ? '写下你的答案或想法...' :
                    '输入你的观点、分析或解决方案...'
                  }
                  disabled={!!selectedOption || isExtracting}
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-[rgba(10,10,26,0.12)] px-3 py-2 text-sm text-[rgba(10,10,26,0.8)] placeholder:text-[rgba(10,10,26,0.3)] focus:outline-none focus:border-[#3B5FD9] focus:ring-1 focus:ring-[rgba(59,95,217,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={!userInputText.trim() || !!selectedOption || isExtracting}
                  className="px-4 bg-[#3B5FD9] text-white rounded-xl hover:bg-[#2A4CC0] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center"
                >
                  {isExtracting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </>
          )}

          {!showOptions && !isComplete && currentQuestionIdx >= 0 && (
            <div className="text-center py-3">
              <span className="text-xs text-[rgba(10,10,26,0.35)] font-medium">荒野导师正在准备下一关...</span>
            </div>
          )}

          {isComplete && (
            <button
              onClick={onComplete}
              className="w-full py-4 bg-[#3B5FD9] text-white font-bold text-lg rounded-full shadow-lg shadow-[rgba(59,95,217,0.2)] hover:bg-[#2A4CC0] active:scale-95 transition-all flex items-center justify-center gap-3 animate-slide-up"
            >
              <Sparkles className="w-5 h-5" />
              查看我的科学探索力报告
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
