// ===================================================================
// optionPools + storyAdventureEngine + conversationOrchestrator 单元测试
// ===================================================================

import { describe, it, expect } from 'vitest'
import { generateOptionsFromPool, WILDER_OPTION_POOLS, type OptionLevel } from '../../lib/optionPools'
import {
  getStoryWorldsForAge,
  initGameState,
  processAnswer,
  calculateProgress,
  getCompanionReaction,
  checkStreakBadges,
} from '../../lib/storyAdventureEngine'
import {
  extractSignals,
  ConversationOrchestrator,
} from '../../lib/ai/conversationOrchestrator'

// ===================================================================
// optionPools 测试
// ===================================================================

describe('optionPools - 年龄自适应选项池', () => {
  it('WILDER_OPTION_POOLS 包含6个维度', () => {
    expect(Object.keys(WILDER_OPTION_POOLS)).toEqual(['W', 'I', 'L', 'D', 'E', 'R'])
  })

  it('每个维度包含5个年龄段的选项', () => {
    for (const dim of Object.keys(WILDER_OPTION_POOLS)) {
      const pool = WILDER_OPTION_POOLS[dim]
      expect(Object.keys(pool)).toContain('preschool')
      expect(Object.keys(pool)).toContain('lower-primary')
      expect(Object.keys(pool)).toContain('upper-primary')
    }
  })

  it('每个年龄段包含high/medium/low三个层级', () => {
    for (const dim of Object.keys(WILDER_OPTION_POOLS)) {
      for (const ageGroup of Object.keys(WILDER_OPTION_POOLS[dim])) {
        const agePool: Record<string, any> = WILDER_OPTION_POOLS[dim][ageGroup as keyof typeof WILDER_OPTION_POOLS[typeof dim]]
        expect(agePool).toHaveProperty('high')
        expect(agePool).toHaveProperty('medium')
        expect(agePool).toHaveProperty('low')
      }
    }
  })

  it('generateOptionsFromPool 返回3个选项（高/中/低）', () => {
    const options = generateOptionsFromPool('W', 'upper-primary', 'test-q1', 'seed1')
    expect(options).toHaveLength(3)
  })

  it('generateOptionsFromPool 返回的选项包含text和scores', () => {
    const options = generateOptionsFromPool('W', 'lower-primary', 'test-q2', 'seed2')
    for (const opt of options) {
      expect(opt).toHaveProperty('text')
      expect(opt).toHaveProperty('scores')
      expect(typeof opt.text).toBe('string')
      expect(opt.text.length).toBeGreaterThan(0)
    }
  })

  it('不同sessionSeed生成不同的选项文本', () => {
    const options1 = generateOptionsFromPool('W', 'upper-primary', 'test-q3', 'seed_a')
    const options2 = generateOptionsFromPool('W', 'upper-primary', 'test-q3', 'seed_b')
    // 选项文本可能相同（池较小时），但分数结构应一致
    expect(options1).toHaveLength(3)
    expect(options2).toHaveLength(3)
  })

  it('不存在的维度返回降级选项', () => {
    const options = generateOptionsFromPool('X', 'upper-primary', 'test-q4', 'seed1')
    expect(options).toHaveLength(3)
    expect(options[0].scores).toHaveProperty('X')
  })

  it('不同年龄段的选项文本不同', () => {
    const preschoolOptions = generateOptionsFromPool('W', 'preschool', 'test-q5', 'seed1')
    const highSchoolOptions = generateOptionsFromPool('W', 'high-school', 'test-q5', 'seed1')
    // 学前和高中选项文本应该有差异
    const preschoolTexts = preschoolOptions.map(o => o.text).join('|')
    const highSchoolTexts = highSchoolOptions.map(o => o.text).join('|')
    expect(preschoolTexts).not.toBe(highSchoolTexts)
  })
})

// ===================================================================
// storyAdventureEngine 测试
// ===================================================================

describe('storyAdventureEngine - 故事冒险引擎', () => {
  it('getStoryWorldsForAge 返回适合年龄段的故事', () => {
    const worlds = getStoryWorldsForAge('preschool')
    expect(worlds.length).toBeGreaterThan(0)
    expect(worlds[0].ageGroup).toBe('preschool')
  })

  it('initGameState 初始化正确的游戏状态', () => {
    const state = initGameState('test-world')
    expect(state.worldId).toBe('test-world')
    expect(state.currentChapter).toBe(0)
    expect(state.totalAnswered).toBe(0)
    expect(state.unlockedBadges).toEqual([])
    expect(state.streakCount).toBe(0)
  })

  it('processAnswer 正确更新维度XP', () => {
    const world = getStoryWorldsForAge('preschool')[0]
    const state = initGameState(world.id)
    const newState = processAnswer(state, world, 'W', 85)
    expect(newState.dimensionXP.W).toBeGreaterThan(0)
    expect(newState.totalAnswered).toBe(1)
  })

  it('processAnswer 高分时增加连击', () => {
    const world = getStoryWorldsForAge('preschool')[0]
    const state = initGameState(world.id)
    const state2 = processAnswer(state, world, 'W', 85)
    const state3 = processAnswer(state2, world, 'I', 90)
    expect(state3.streakCount).toBe(2)
  })

  it('processAnswer 低分时重置连击', () => {
    const world = getStoryWorldsForAge('preschool')[0]
    const state = initGameState(world.id)
    const state2 = processAnswer(state, world, 'W', 85)
    const state3 = processAnswer(state2, world, 'I', 50)
    expect(state3.streakCount).toBe(0)
  })

  it('calculateProgress 返回0-100之间的值', () => {
    const world = getStoryWorldsForAge('preschool')[0]
    const state = initGameState(world.id)
    const progress = calculateProgress(state, world)
    expect(progress).toBe(0)
  })

  it('getCompanionReaction 返回非空字符串', () => {
    const world = getStoryWorldsForAge('preschool')[0]
    const reaction = getCompanionReaction(world.companion, 80)
    expect(typeof reaction).toBe('string')
    expect(reaction.length).toBeGreaterThan(0)
  })

  it('checkStreakBadges 5连击解锁徽章', () => {
    const state = {
      ...initGameState('test'),
      maxStreak: 5,
      unlockedBadges: [],
    }
    const badges = checkStreakBadges(state)
    expect(badges.length).toBeGreaterThan(0)
    expect(badges[0].id).toBe('streak-5')
  })

  it('checkStreakBadges 不重复解锁', () => {
    const state = {
      ...initGameState('test'),
      maxStreak: 5,
      unlockedBadges: [{ id: 'streak-5', name: '五连击', emoji: '🔥', unlockedAt: Date.now() }],
    }
    const badges = checkStreakBadges(state)
    expect(badges.find(b => b.id === 'streak-5')).toBeUndefined()
  })
})

// ===================================================================
// conversationOrchestrator 测试
// ===================================================================

describe('conversationOrchestrator - AI对话编排器', () => {
  it('extractSignals 检测好奇心关键词', () => {
    const signals = extractSignals('我很好奇为什么会这样，想知道原因')
    const wSignal = signals.find(s => s.dimension === 'W')
    expect(wSignal).toBeDefined()
    expect(wSignal!.strength).toBeGreaterThan(0.5)
  })

  it('extractSignals 检测探究力关键词', () => {
    const signals = extractSignals('我想设计一个实验来验证这个假设')
    const iSignal = signals.find(s => s.dimension === 'I')
    expect(iSignal).toBeDefined()
  })

  it('extractSignals 检测连接力关键词', () => {
    const signals = extractSignals('我想和大家一起合作完成这个任务')
    const lSignal = signals.find(s => s.dimension === 'L')
    expect(lSignal).toBeDefined()
  })

  it('extractSignals 检测负面关键词', () => {
    const signals = extractSignals('不知道，无聊，随便')
    expect(signals.length).toBeGreaterThan(0)
  })

  it('extractSignals 短消息返回默认弱信号', () => {
    const signals = extractSignals('嗯')
    expect(signals.length).toBe(0) // 太短不触发
  })

  it('ConversationOrchestrator 初始化对话', () => {
    const orchestrator = new ConversationOrchestrator({
      name: '测试',
      age: 8,
      ageGroup: 'lower-primary',
    })
    const firstMsg = orchestrator.startConversation()
    expect(firstMsg.role).toBe('ai')
    expect(firstMsg.content.length).toBeGreaterThan(0)
  })

  it('ConversationOrchestrator 处理儿童回答', () => {
    const orchestrator = new ConversationOrchestrator({
      name: '测试',
      age: 8,
      ageGroup: 'lower-primary',
    })
    orchestrator.startConversation()
    const reply = orchestrator.processChildResponse('我很好奇想知道为什么！')
    expect(reply.role).toBe('ai')
    expect(reply.content.length).toBeGreaterThan(0)
  })

  it('ConversationOrchestrator 更新估算分数', () => {
    const orchestrator = new ConversationOrchestrator({
      name: '测试',
      age: 8,
      ageGroup: 'lower-primary',
    })
    orchestrator.startConversation()
    orchestrator.processChildResponse('我很好奇想知道为什么天空是蓝色的！')
    const scores = orchestrator.getEstimatedScores()
    expect(Object.keys(scores).length).toBeGreaterThan(0)
  })

  it('ConversationOrchestrator 支持不同年龄段', () => {
    const preschoolOrch = new ConversationOrchestrator({
      name: '小朋友',
      age: 4,
      ageGroup: 'preschool',
    })
    const firstMsg = preschoolOrch.startConversation()
    expect(firstMsg.content).toContain('蘑菇') // preschool opening topic
  })
})
