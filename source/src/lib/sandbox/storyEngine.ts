// ===================================================================
// 动态沙盘推演系统 - 剧情生成引擎 v1.0
// 将传统题目包装为情境事件，生成连贯的剧情体验
// ===================================================================

import {
  type SceneNode,
  type StoryChapter,
  type ContextualOption,
  type SandboxStory,
} from './types'
import { type UnifiedQuestion, type AgeGroupKey } from '../questions/types'
import {
  WILDER_CONTEXT_RULES,
  STORY_THEME_PACKS,
  NARRATIVE_BRIDGES,
} from './scenarioBank'

/** 剧情上下文管理器 */
export class StoryContextManager {
  private context: string[] = []
  private maxContextLength = 8

  addScene(narrative: string, decision: string) {
    this.context.push(`场景：${narrative} → 选择：${decision}`)
    if (this.context.length > this.maxContextLength) {
      this.context.shift()
    }
  }

  getContext(): string[] {
    return [...this.context]
  }

  getContextForAI(): string {
    return this.context.join('\n')
  }

  clear() {
    this.context = []
  }
}

/** 剧情生成引擎 */
export class StoryGenerator {
  private contextManager: StoryContextManager
  private sceneCounter = 0

  constructor() {
    this.contextManager = new StoryContextManager()
  }

  /**
   * 将传统题目映射为情境场景
   * @param question 原始题目
   * @param ageGroup 年龄段
   * @param storyTheme 故事主题
   * @param context 剧情上下文
   */
  mapQuestionToContext(
    question: UnifiedQuestion,
    ageGroup: AgeGroupKey,
    storyTheme: string = 'natural_exploration',
    context: string[] = []
  ): SceneNode {
    // 确定主要映射维度
    const primaryDim = question.wilderMapping[0] || 'W'
    const contextRules = WILDER_CONTEXT_RULES[primaryDim]

    if (!contextRules) {
      // 降级：使用默认模板
      return this.createDefaultScene(question, ageGroup)
    }

    // 生成剧情描述
    const narrative = this.generateNarrative(contextRules, ageGroup, context)

    // 生成情境化选项
    const contextualOptions = this.generateContextualOptions(
      question,
      contextRules,
      ageGroup
    )

    // 生成AI生图提示词
    const illustration = this.generateIllustrationPrompt(
      narrative,
      ageGroup,
      storyTheme
    )

    this.sceneCounter++

    return {
      sceneId: `scene_${this.sceneCounter}`,
      narrative,
      mappedQuestionId: question.id,
      illustration,
      illustrationStyle: this.getIllustrationStyle(ageGroup),
      decision: {
        decisionId: `decision_${this.sceneCounter}`,
        presentationMode: question.type === 'choice' ? 'choice' : 'judgment',
        contextualOptions,
        timeLimit: this.getTimeLimit(ageGroup),
      },
      dimensionImpact: this.calculateDimensionImpact(question, contextualOptions),
      context: [...context],
    }
  }

  /**
   * 生成连贯叙事
   * @param scene 当前场景
   * @param context 剧情上下文
   */
  generateCoherentNarrative(scene: SceneNode, context: string[]): string {
    if (context.length === 0) {
      return scene.narrative
    }

    // 添加过渡句
    const bridge = this.getTransitionPhrase()
    return `${bridge}\n\n${scene.narrative}`
  }

  /**
   * 生成章节结构
   */
  generateChapters(
    questions: UnifiedQuestion[],
    _ageGroup: AgeGroupKey,
    theme: string
  ): StoryChapter[] {
    const chapters: StoryChapter[] = []
    const questionsPerChapter = 6
    let chapterIndex = 0

    for (let i = 0; i < questions.length; i += questionsPerChapter) {
      const chunk = questions.slice(i, i + questionsPerChapter)
      const dims = [...new Set(chunk.flatMap(q => q.wilderMapping))]

      chapters.push({
        chapterId: `ch_${chapterIndex + 1}`,
        title: this.getChapterTitle(chapterIndex, theme),
        theme: theme as any,
        targetDimensions: dims,
        difficulty: this.getChapterDifficulty(chunk),
      })
      chapterIndex++
    }

    return chapters
  }

  /**
   * 生成完整沙盘故事
   */
  generateStory(
    questions: UnifiedQuestion[],
    ageGroup: AgeGroupKey,
    theme: string = 'natural_exploration'
  ): SandboxStory {
    const chapters = this.generateChapters(questions, ageGroup, theme)
    const estimatedDuration = Math.ceil(questions.length * 0.75) // 每题约45秒

    return {
      storyId: `story_${Date.now()}`,
      theme: theme as any,
      targetAgeGroup: ageGroup,
      chapters,
      estimatedDuration,
    }
  }

  /**
   * 获取上下文管理器
   */
  getContextManager(): StoryContextManager {
    return this.contextManager
  }

  /**
   * 重置引擎状态
   */
  reset() {
    this.sceneCounter = 0
    this.contextManager.clear()
  }

  // ========== 私有方法 ==========

  private generateNarrative(
    rules: typeof WILDER_CONTEXT_RULES['W'],
    ageGroup: AgeGroupKey,
    _context: string[]
  ): string {
    const object = this.randomPick(rules.objectPool) || '神秘的事物'
    const adjective = this.randomPick(rules.adjectivePool) || '奇特的'
    const problem = this.randomPick(rules.problemPool) || '挑战'

    let template = rules.narrativeTemplate
      .replace('{object}', object)
      .replace('{adjective}', adjective)
      .replace('{problem}', problem)

    // 根据年龄段调整语言复杂度
    template = this.adjustLanguageForAge(template, ageGroup)

    return template
  }

  private generateContextualOptions(
    question: UnifiedQuestion,
    rules: typeof WILDER_CONTEXT_RULES['W'],
    ageGroup: AgeGroupKey
  ): ContextualOption[] {
    if (question.type === 'choice' && question.options) {
      return question.options.map((opt, _idx) => {
        // 将标准选项转换为情境化描述
        const actionKey = this.mapOptionToAction(opt.text, rules)
        const narrative = rules.actionMapping[actionKey as keyof typeof rules.actionMapping] || opt.text

        return {
          id: opt.id,
          narrative: this.adjustLanguageForAge(narrative, ageGroup),
          actionDescription: `你选择了${narrative}`,
          dimensionScores: opt.scores,
          nextSceneHint: this.getNextSceneHint(opt.scores, ageGroup),
        }
      })
    }

    // 判断题降级处理
    return [
      {
        id: 'yes',
        narrative: '你认为这是正确的/应该这样做',
        actionDescription: '你表示赞同',
        dimensionScores: question.scores?.yes || {},
      },
      {
        id: 'no',
        narrative: '你认为这是错误的/不应该这样做',
        actionDescription: '你表示反对',
        dimensionScores: question.scores?.no || {},
      },
    ]
  }

  private generateIllustrationPrompt(
    narrative: string,
    ageGroup: AgeGroupKey,
    theme: string
  ): string {
    const style = this.getIllustrationStyle(ageGroup)
    const basePrompt = `${theme} scene, ${ageGroup} appropriate`

    // 提取关键词
    const keywords = narrative
      .replace(/[，。！？、]/g, ' ')
      .split(' ')
      .filter(w => w.length > 1)
      .slice(0, 5)
      .join(', ')

    return `${basePrompt}, ${keywords}, ${style} style, high quality, detailed`
  }

  private createDefaultScene(
    question: UnifiedQuestion,
    _ageGroup: AgeGroupKey
  ): SceneNode {
    return {
      sceneId: `scene_default_${this.sceneCounter}`,
      narrative: question.scenario || question.text,
      mappedQuestionId: question.id,
      decision: {
        decisionId: `decision_default_${this.sceneCounter}`,
        presentationMode: question.type,
        contextualOptions: question.type === 'choice' && question.options
          ? question.options.map(opt => ({
              id: opt.id,
              narrative: opt.text,
              actionDescription: opt.text,
              dimensionScores: opt.scores,
            }))
          : [
              { id: 'yes', narrative: '是', actionDescription: '是', dimensionScores: {} },
              { id: 'no', narrative: '否', actionDescription: '否', dimensionScores: {} },
            ],
      },
      dimensionImpact: {},
      context: [],
    }
  }

  private getIllustrationStyle(ageGroup: AgeGroupKey): 'cartoon_friendly' | 'realistic_editorial' | 'fantasy' | 'minimalist' {
    switch (ageGroup) {
      case 'preschool':
      case 'lower-primary':
        return 'cartoon_friendly'
      case 'upper-primary':
        return 'fantasy'
      case 'middle-school':
      case 'high-school':
        return 'realistic_editorial'
      default:
        return 'minimalist'
    }
  }

  private getTimeLimit(ageGroup: AgeGroupKey): number {
    switch (ageGroup) {
      case 'preschool': return 120
      case 'lower-primary': return 100
      case 'upper-primary': return 90
      case 'middle-school': return 80
      case 'high-school': return 75
      default: return 90
    }
  }

  private adjustLanguageForAge(text: string, ageGroup: AgeGroupKey): string {
    // 低龄段：简化语言，增加emoji
    if (ageGroup === 'preschool' || ageGroup === 'lower-primary') {
      return text
        .replace(/复杂/g, '难')
        .replace(/分析/g, '看看')
        .replace(/推理/g, '想一想')
    }

    // 高龄段：增加专业感
    if (ageGroup === 'high-school') {
      return text
        .replace(/看看/g, '分析')
        .replace(/想一想/g, '推理')
        .replace(/难/g, '具有挑战性')
    }

    return text
  }

  /** 中文语义关键词 → actionMapping 英文 key 映射表 */
  private static readonly CHINESE_ACTION_KEYWORDS: Record<string, Record<string, string[]>> = {
    W: {
      curious: ['想知道', '好奇', '仔细观察', '想了解', '研究', '深入了解', '探索', '求知欲'],
      ask: ['询问', '问', '求助', '请教', '打听', '咨询'],
      document: ['拍照', '记录', '查资料', '记下来', '拍下来'],
      cautious: ['小心', '谨慎', '保持距离', '注意安全', '先观察'],
      ignore: ['不理', '忽略', '不管', '看了一眼', '算了', '不感兴趣'],
    },
    I: {
      experiment: ['实验', '试试', '验证', '测试', '动手', '亲自', '自己试'],
      read: ['查阅', '资料', '文献', '书籍', '搜索', '查查'],
      think: ['想一想', '思考', '推理', '分析', '想想', '静下心'],
      collaborate: ['讨论', '合作', '一起', '团队', '集思广益', '大家'],
      ask_expert: ['请教', '专家', '导师', '老师', '咨询', '有经验'],
    },
    L: {
      lead: ['带领', '领导', '组织', '站出来', '当队长', '主动', '协调者'],
      mediate: ['调解', '协调', '居中', '找共识', '折中', '平衡'],
      support: ['支持', '配合', '帮忙', '辅助', '做好自己', '分内'],
      delegate: ['分配', '分工', '委派', '按特长', '安排', '调度'],
      listen: ['倾听', '听', '先听', '了解', '理解', '尊重'],
    },
    D: {
      brainstorm: ['头脑风暴', '想创意', '发散', '灵感', '尽可能多'],
      prototype: ['原型', '快速做', '先做', '边做边改', '试做'],
      research: ['研究', '调研', '查资料', '参考', '借鉴', '已有方案'],
      sketch: ['画图', '设计图', '草图', '规划', '画出来', '图纸'],
      iterate: ['迭代', '改进', '优化', '调整', '从简单', '不断'],
    },
    E: {
      visualize: ['图表', '可视化', '画出来', '展示图', '图示'],
      story: ['故事', '讲故事', '举例', '比喻', '生动', '情境'],
      demonstrate: ['演示', '展示', '现场', '实际', '做给你看', '事实'],
      simplify: ['简单', '直白', '容易懂', '通俗', '大白话', '最简单'],
      persuade: ['说服', '数据', '逻辑', '论证', '证明', '论述'],
    },
    R: {
      journal: ['日记', '写下来', '记录', '笔记', '心得', '反思日记'],
      discuss: ['讨论', '交流', '聊', '分享', '对话', '朋友'],
      analyze: ['分析', '总结', '回顾', '复盘', '归纳', '系统'],
      adjust: ['调整', '改进', '改变', '重新规划', '下次', '计划'],
      celebrate: ['庆祝', '开心', '肯定', '鼓励', '先高兴', '成果'],
    },
  }

  private mapOptionToAction(optionText: string, rules: typeof WILDER_CONTEXT_RULES['W']): string | null {
    const dimension = rules.dimension
    const chineseMap = StoryGenerator.CHINESE_ACTION_KEYWORDS[dimension]

    // 优先用中文语义关键词匹配
    if (chineseMap) {
      for (const [actionKey, keywords] of Object.entries(chineseMap)) {
        if (keywords.some(kw => optionText.includes(kw))) {
          return actionKey
        }
      }
    }

    // 其次用 actionMapping 的英文 key 直接匹配
    const actionKeywords = Object.keys(rules.actionMapping)
    for (const key of actionKeywords) {
      if (optionText.includes(key)) return key
    }

    // 无匹配返回 null，由调用方使用原始选项文本
    return null
  }

  private getNextSceneHint(scores: Record<string, number>, _ageGroup: AgeGroupKey): string {
    // 根据得分预测剧情走向
    const topDim = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
    if (!topDim) return '故事继续发展...'

    const hints: Record<string, string> = {
      W: '你的好奇心将引领你发现新的线索...',
      I: '你的探究精神将帮助你解开谜团...',
      L: '团队的协作将成为关键...',
      D: '你的创意将改变整个局面...',
      E: '你的表达将影响他人的决定...',
      R: '你的反思将带来深刻的领悟...',
    }

    return hints[topDim[0]] || '故事继续发展...'
  }

  private calculateDimensionImpact(
    question: UnifiedQuestion,
    options: ContextualOption[]
  ): Record<string, number> {
    // 计算所有选项的平均维度影响
    const impact: Record<string, number> = {}
    const dims = question.wilderMapping

    for (const dim of dims) {
      const scores = options.map(opt => opt.dimensionScores[dim] || 0)
      impact[dim] = scores.reduce((a, b) => a + b, 0) / scores.length
    }

    return impact
  }

  private getChapterTitle(index: number, theme: string): string {
    const themePack = STORY_THEME_PACKS[theme as keyof typeof STORY_THEME_PACKS]
    if (!themePack) return `第${index + 1}章`

    const titles = [
      `启程：${themePack.title}的开始`,
      `探索：深入未知`,
      `挑战：障碍与机遇`,
      `突破：关键的转折`,
      `收获：成果与反思`,
      `终章：新的起点`,
    ]

    return titles[index % titles.length]
  }

  private getChapterDifficulty(questions: UnifiedQuestion[]): 1 | 2 | 3 | 4 | 5 {
    const avg = questions.reduce((sum, q) => sum + q.difficulty, 0) / questions.length
    return Math.round(avg) as 1 | 2 | 3 | 4 | 5
  }

  private getTransitionPhrase(): string {
    return this.randomPick(NARRATIVE_BRIDGES.transitions)
  }

  private randomPick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }
}

/** 单例导出 */
export const storyGenerator = new StoryGenerator()
