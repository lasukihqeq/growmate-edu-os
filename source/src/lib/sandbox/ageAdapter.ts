// ===================================================================
// 动态沙盘推演系统 - 年龄适配器 v1.0
// 根据不同年龄段配置差异化的沙盘体验
// ===================================================================

import {
  type SandboxSceneConfig,
  type AICharacter,
  type CharacterArchetype,
  type CharacterPersonality,
  type DialogueStyle,
} from './types'
import { type AgeGroupKey } from '../questions/types'

/** 获取年龄段对应的沙盘配置 */
export function getSandboxConfig(age: number): SandboxSceneConfig {
  if (age <= 6) return PRESET_CONFIGS.preschool
  if (age <= 9) return PRESET_CONFIGS['lower-primary']
  if (age <= 12) return PRESET_CONFIGS['upper-primary']
  if (age <= 15) return PRESET_CONFIGS['middle-school']
  return PRESET_CONFIGS['high-school']
}

/** 获取年龄段对应的配置（使用AgeGroupKey） */
export function getSandboxConfigByAgeGroup(ageGroup: AgeGroupKey): SandboxSceneConfig {
  return PRESET_CONFIGS[ageGroup]
}

/** 获取年龄段对应的AI角色 */
export function createAICharacterForAge(
  age: number,
  customName?: string
): AICharacter {
  const config = getSandboxConfig(age)

  const archetype = config.characterArchetype
  const personality = CHARACTER_PERSONALITIES[archetype]
  const dialogueStyle = DIALOGUE_STYLES[archetype]
  const visualPrompt = CHARACTER_VISUAL_PROMPTS[archetype]

  const defaultName = DEFAULT_CHARACTER_NAMES[archetype]

  return {
    characterId: `char_${archetype}_${Date.now()}`,
    name: customName || defaultName,
    archetype,
    personality,
    dialogueStyle,
    visualPrompt,
  }
}

/** 获取适合年龄段的欢迎语 */
export function getWelcomeMessage(studentName: string, age: number): string {
  const messages: Record<AgeGroupKey, string> = {
    preschool: `嗨！${studentName}小朋友！👋\n\n我是你的AI小伙伴${DEFAULT_CHARACTER_NAMES.robot_friend}！今天我们要一起玩一个超级有趣的探险游戏！你准备好了吗？`,
    'lower-primary': `你好呀，${studentName}！🌟\n\n我是${DEFAULT_CHARACTER_NAMES.mischievous_fairy}，今天我们要一起解谜闯关！听说你是个聪明的小侦探，快来帮我解决这些难题吧！`,
    'upper-primary': `你好，${studentName}！🔭\n\n欢迎来到思维探险。我是你的向导${DEFAULT_CHARACTER_NAMES.mentor}。接下来我们将经历一系列有趣的挑战，这些挑战将帮助发现你独特的天赋和能力。`,
    'middle-school': `欢迎，${studentName}研究员！🔬\n\n我是${DEFAULT_CHARACTER_NAMES.investor}。在接下来的沙盘推演中，你将面临一系列真实的挑战和决策。没有标准答案，只有你的选择和思考。准备好了吗？`,
    'high-school': `${studentName}，欢迎来到深度挑战模式。🧠\n\n我是${DEFAULT_CHARACTER_NAMES.devil_advocate}。在接下来的过程中，我会不断质疑你的判断，挑战你的逻辑。这不是测试，而是一场思维的交锋。让我们看看你的思考有多严密。`,
  }

  return messages[getAgeKey(age)] || messages['upper-primary']
}

/** 获取适合年龄段的鼓励语 */
export function getEncouragement(age: number, dimension: string): string {
  const encouragements: Record<AgeGroupKey, Record<string, string[]>> = {
    preschool: {
      W: ['哇！你的小眼睛真厉害！👀', '太棒了！继续探索！'],
      I: ['你真会动脑筋！💡', '好聪明！继续试试看！'],
      L: ['你和朋友相处得真好！🤝', '团队力量大！'],
      D: ['你的想法真有趣！🎨', '创意无限！'],
      E: ['你说得真清楚！🗣️', '大家都能听懂！'],
      R: ['你真会思考！🪞', '反思让小脑袋更聪明！'],
    },
    'lower-primary': {
      W: ['好奇心是你最强大的武器！', '继续保持探索精神！'],
      I: ['你的探究能力越来越强了！', '深入思考很棒！'],
      L: ['协作让你变得更强大！', '团队因为有你而更好！'],
      D: ['你的创意让人眼前一亮！', '设计思维很出色！'],
      E: ['表达清晰，逻辑清楚！', '沟通能力很强！'],
      R: ['善于反思是优秀的品质！', '从经验中学习很重要！'],
    },
    'upper-primary': {
      W: ['好奇心驱动学习，继续保持！', '探索精神值得赞赏！'],
      I: ['你的分析能力很强！', '探究过程很系统！'],
      L: ['领导力在团队中很关键！', '协作能力出色！'],
      D: ['创新思维是你的优势！', '设计能力出众！'],
      E: ['表达力很强，善于沟通！', '说服力和影响力都很出色！'],
      R: ['反思能力是成长的关键！', '自我认知很清晰！'],
    },
    'middle-school': {
      W: ['对未知的好奇是创新的源泉！', '保持探索精神！'],
      I: ['你的研究方法论很成熟！', '系统思维很强！'],
      L: ['组织协调能力出色！', '团队管理能力优秀！'],
      D: ['创新设计能力很突出！', '问题解决思维出色！'],
      E: ['公众演讲和表达能力很强！', '影响力建设很好！'],
      R: ['元认知能力发展得很好！', '批判性思维很成熟！'],
    },
    'high-school': {
      W: ['对知识边界的探索展现了学术潜力！', '求知欲驱动深度思考！'],
      I: ['你的研究设计能力接近专业水平！', '假设检验思维很成熟！'],
      L: ['跨团队协作和利益平衡能力出色！', '领导力潜质明显！'],
      D: ['系统性创新设计能力突出！', '结构化问题解决能力很强！'],
      E: ['多利益相关者沟通能力优秀！', '影响力和说服力很强！'],
      R: ['深度反思和元认知能力成熟！', '持续改进意识很强！'],
    },
  }

  const dim = dimension || 'W'
  const ageEncouragements = encouragements[getAgeKey(age)] || encouragements['upper-primary']
  const dimEncouragements = ageEncouragements[dim] || ageEncouragements.W

  return dimEncouragements[Math.floor(Math.random() * dimEncouragements.length)]
}

/** 预设年龄段配置 */
const PRESET_CONFIGS: Record<AgeGroupKey, SandboxSceneConfig> = {
  preschool: {
    characterArchetype: 'robot_friend',
    maxScenes: 22,
    timePerScene: 120,
    presentationMode: ['voice_first', 'visual_heavy', 'simple_choice'],
    illustrationStyle: 'cartoon_friendly',
    dialogueComplexity: 'simple',
    narrativeLength: 'short',
  },
  'lower-primary': {
    characterArchetype: 'mischievous_fairy',
    maxScenes: 25,
    timePerScene: 100,
    presentationMode: ['story_driven', 'interactive_choice'],
    illustrationStyle: 'cartoon_friendly',
    dialogueComplexity: 'simple',
    narrativeLength: 'short',
  },
  'upper-primary': {
    characterArchetype: 'mentor',
    maxScenes: 28,
    timePerScene: 90,
    presentationMode: ['text_first', 'puzzle_based'],
    illustrationStyle: 'fantasy',
    dialogueComplexity: 'moderate',
    narrativeLength: 'medium',
  },
  'middle-school': {
    characterArchetype: 'investor',
    maxScenes: 30,
    timePerScene: 80,
    presentationMode: ['text_first', 'data_rich'],
    illustrationStyle: 'realistic_editorial',
    dialogueComplexity: 'advanced',
    narrativeLength: 'medium',
  },
  'high-school': {
    characterArchetype: 'devil_advocate',
    maxScenes: 32,
    timePerScene: 75,
    presentationMode: ['text_first', 'data_rich', 'multi_stakeholder'],
    illustrationStyle: 'realistic_editorial',
    dialogueComplexity: 'advanced',
    narrativeLength: 'long',
  },
}

/** 角色性格模板 */
const CHARACTER_PERSONALITIES: Record<CharacterArchetype, CharacterPersonality> = {
  robot_friend: {
    tone: 'friendly',
    interactionStyle: 'supportive',
    ageAppropriate: ['preschool', 'lower-primary'],
  },
  mischievous_fairy: {
    tone: 'playful',
    interactionStyle: 'questioning',
    ageAppropriate: ['lower-primary', 'upper-primary'],
  },
  mentor: {
    tone: 'serious',
    interactionStyle: 'collaborative',
    ageAppropriate: ['upper-primary', 'middle-school'],
  },
  investor: {
    tone: 'challenging',
    interactionStyle: 'questioning',
    ageAppropriate: ['middle-school', 'high-school'],
  },
  devil_advocate: {
    tone: 'challenging',
    interactionStyle: 'competitive',
    ageAppropriate: ['high-school'],
  },
  competitor: {
    tone: 'serious',
    interactionStyle: 'competitive',
    ageAppropriate: ['middle-school', 'high-school'],
  },
}

/** 对话风格模板 */
const DIALOGUE_STYLES: Record<CharacterArchetype, DialogueStyle> = {
  robot_friend: {
    greetingPattern: [
      '你好呀！我是你的AI朋友！🤖',
      '哔哔！今天我们要一起去探险！',
    ],
    reactionPattern: {
      positive: ['太棒了！你真聪明！✨', '好主意！我学到了新东西！'],
      negative: ['没关系！我们再想想！💪', '这个选择也很有趣！'],
      neutral: ['嗯，我明白了！', '原来如此！那我们继续吧！'],
    },
    transitionPhrases: [
      '接下来我们去看看...',
      '新的冒险在等着我们！',
      '准备好下一步了吗？',
    ],
    closingStyle: '今天真开心！谢谢你和我一起玩！下次再见！👋',
  },
  mischievous_fairy: {
    greetingPattern: [
      '嘻嘻！猜猜我是谁？🧚',
      '嘿嘿，我来给你出难题啦！',
    ],
    reactionPattern: {
      positive: ['哇！你太厉害了！🎉', '这个答案让我大吃一惊！'],
      negative: ['哈哈，是不是被我难住了？😜', '再想想看！'],
      neutral: ['有趣的选择！', '让我看看接下来会发生什么！'],
    },
    transitionPhrases: [
      '嘿嘿，接下来更有趣了！',
      '猜猜看，下一个难题是什么？',
      '准备好了吗？大冒险要开始啦！',
    ],
    closingStyle: '今天玩得真开心！你比我想象的还要聪明！下次再一起玩哦！🧚✨',
  },
  mentor: {
    greetingPattern: [
      '你好，欢迎来到思维探险。',
      '很高兴与你一起探索。',
    ],
    reactionPattern: {
      positive: ['很好的思考！继续深入。', '你的分析很有见地。'],
      negative: ['这个角度值得重新考虑。', '让我们换个思路看看。'],
      neutral: ['这个选择反映了你的思考方式。', '让我们继续探索。'],
    },
    transitionPhrases: [
      '接下来我们将面对新的挑战。',
      '让我们进入下一个阶段。',
      '准备好了吗？ deeper exploration awaits.',
    ],
    closingStyle: '今天你的表现展现了独特的思维特质。记住，持续反思和探索是成长的关键。',
  },
  investor: {
    greetingPattern: [
      '你好。我是投资人。让我看看你有什么潜力。',
      '欢迎来到商业沙盘。准备好面对真实挑战了吗？',
    ],
    reactionPattern: {
      positive: ['不错的决策。继续证明你的判断。', '有潜力的选择。'],
      negative: ['这个决定的风险你想清楚了吗？', '数据支持你的选择吗？'],
      neutral: ['有意思。让我们看看结果如何。', '观察你的决策过程。'],
    },
    transitionPhrases: [
      '市场在变化，新的挑战来了。',
      '下一个决策点。',
      '时间不等人，做决定吧。',
    ],
    closingStyle: '你的决策模式展现了你的思维特点。投资看的是判断力和风险意识。',
  },
  devil_advocate: {
    greetingPattern: [
      '你好。我是你的辩论对手。准备好被质疑了吗？',
      '欢迎来到思维交锋。我会挑战你的每一个判断。',
    ],
    reactionPattern: {
      positive: ['哼，这个论点还算有力。但还不够。', '暂时认可，但继续证明。'],
      negative: ['这就是你的最佳论据吗？', '逻辑漏洞很明显。'],
      neutral: ['有趣的立场。但证据呢？', '让我看看你能否 defend it.'],
    },
    transitionPhrases: [
      '新的挑战来了，这次更棘手。',
      '你以为结束了？还没呢。',
      '准备好迎接更强的质疑了吗？',
    ],
    closingStyle: '今天的交锋展现了你的思维韧性。记住，真正的强者欢迎质疑。',
  },
  competitor: {
    greetingPattern: [
      '你好，竞争对手。让我们看看谁更强。',
      '欢迎来到竞技场。拿出你最好的表现。',
    ],
    reactionPattern: {
      positive: ['不错，但我不认为这是最优解。', '暂时领先，但我会追上。'],
      negative: ['这个选择太保守了。', '你确定这是最佳方案？'],
      neutral: ['势均力敌。让我们继续。', '观察你的策略。'],
    },
    transitionPhrases: [
      '下一轮竞争开始。',
      '市场不等人，行动吧。',
      '新的机会出现了，你打算怎么做？',
    ],
    closingStyle: '今天的竞争展现了你的决策风格。记住，市场永远在变化。',
  },
}

/** 角色视觉提示词 */
const CHARACTER_VISUAL_PROMPTS: Record<CharacterArchetype, string> = {
  robot_friend: 'cute friendly robot with big eyes, cartoon style, warm colors, child-friendly',
  mischievous_fairy: 'playful magical fairy with sparkling wings, whimsical illustration, bright colors',
  mentor: 'wise elderly scholar with kind eyes, professional illustration, warm tones, trustworthy appearance',
  investor: 'sharp business professional in modern office, editorial illustration, confident posture',
  devil_advocate: 'intense debater at podium, editorial style, serious expression, professional attire',
  competitor: 'determined rival in competitive setting, dynamic pose, professional illustration',
}

/** 默认角色名称 */
const DEFAULT_CHARACTER_NAMES: Record<CharacterArchetype, string> = {
  robot_friend: '小智',
  mischievous_fairy: '闪闪',
  mentor: '明师',
  investor: '投资人',
  devil_advocate: '挑战者',
  competitor: '对手',
}

/** 获取年龄键 */
function getAgeKey(age: number): AgeGroupKey {
  if (age <= 5) return 'preschool'
  if (age <= 9) return 'lower-primary'
  if (age <= 12) return 'upper-primary'
  if (age <= 15) return 'middle-school'
  return 'high-school'
}
