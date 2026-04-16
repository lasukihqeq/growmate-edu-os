// ===================================================================
// 开放式对话 - LLM 语义信号提取器
// 从自由文本回答中提取 WILDER 六维能力信号
// ===================================================================

import type { WilderDimension } from '../minigame/types'

/** 信号提取结果 */
export interface SignalExtractionResult {
  /** 各维度信号分数 (0-5) */
  signals: Record<WilderDimension, number>
  /** 置信度 (0-100) */
  confidence: number
  /** 推理过程（用于调试） */
  reasoning: string
  /** 回答质量指标 */
  qualityMetrics: {
    length: number // 字符数
    complexity: 'low' | 'medium' | 'high' // 复杂度
    hasReasoning: boolean // 是否包含推理
    hasCreativity: boolean // 是否展现创造力
    hasEmpathy: boolean // 是否展现共情
  }
}

/**
 * 开放式信号提取器
 * 使用 LLM 分析自由文本，提取 WILDER 维度信号
 *
 * 注意：当前版本使用启发式规则作为 MVP，后续可替换为 LLM 调用
 */
export class OpenEndedSignalExtractor {
  private ageLevel: string

  constructor(ageLevel: string) {
    this.ageLevel = ageLevel
  }

  /**
   * 从文本中提取信号
   */
  extract(text: string, targetDimension: WilderDimension): SignalExtractionResult {
    // 质量指标分析
    const qualityMetrics = this.analyzeQuality(text)

    // 基于规则的信号提取（MVP 版本）
    const signals = this.extractSignalsByRules(text, targetDimension, qualityMetrics)

    // 置信度计算
    const confidence = this.calculateConfidence(text, signals)

    // 推理过程
    const reasoning = this.generateReasoning(text, targetDimension, signals, qualityMetrics)

    return { signals, confidence, reasoning, qualityMetrics }
  }

  /**
   * 分析文本质量指标
   */
  analyzeQuality(text: string): SignalExtractionResult['qualityMetrics'] {
    const length = text.length
    const words = text.split(/\s+/).filter(w => w.length > 0)

    // 复杂度：基于句子数量和词汇多样性
    const sentences = text.split(/[。！？.!?\n]/).filter(s => s.trim().length > 0)
    const uniqueWords = new Set(words.map(w => w.toLowerCase()))
    const lexicalDiversity = words.length > 0 ? uniqueWords.size / words.length : 0

    let complexity: 'low' | 'medium' | 'high' = 'low'
    if (sentences.length >= 2 && lexicalDiversity > 0.6) {
      complexity = 'high'
    } else if (sentences.length >= 1 && length > 15) {
      complexity = 'medium'
    }

    // 是否包含推理（因为、所以、如果、那么等）
    const reasoningKeywords = ['因为', '所以', '如果', '那么', '为什么', '可能', '也许', '我觉得', '我认为', '感觉', '原因']
    const hasReasoning = reasoningKeywords.some(kw => text.includes(kw))

    // 是否展现创造力（比喻、想象、新奇表达）
    const creativityKeywords = ['像', '好像', '想象', '如果', '假如', '也许', '可能', '不一样的', '特别的']
    const hasCreativity = creativityKeywords.some(kw => text.includes(kw)) || length > 50

    // 是否展现共情（关心他人、情感表达）
    const empathyKeywords = ['关心', '帮助', '理解', '感受', '难过', '开心', '朋友', '一起', '分享', '陪伴']
    const hasEmpathy = empathyKeywords.some(kw => text.includes(kw))

    return { length, complexity, hasReasoning, hasCreativity, hasEmpathy }
  }

  /**
   * 基于规则提取信号（MVP 版本）
   * 后续可替换为 LLM 调用
   */
  private extractSignalsByRules(
    text: string,
    targetDimension: WilderDimension,
    quality: SignalExtractionResult['qualityMetrics'],
  ): Record<WilderDimension, number> {
    const signals: Record<WilderDimension, number> = {
      W: 2, // 基础分
      I: 2,
      L: 2,
      D: 2,
      E: 2,
      R: 2,
    }

    // 根据目标维度调整分数
    switch (targetDimension) {
      case 'W': // 好奇心
        if (text.includes('为什么') || text.includes('想知道') || text.includes('好奇')) signals.W += 2
        if (text.includes('观察') || text.includes('发现') || text.includes('探索')) signals.W += 1
        if (quality.hasReasoning) signals.W += 1
        if (quality.complexity === 'high') signals.W += 1
        break

      case 'I': // 洞察力
        if (text.includes('因为') || text.includes('所以') || text.includes('原因')) signals.I += 2
        if (text.includes('规律') || text.includes('模式') || text.includes('分类')) signals.I += 1
        if (quality.hasReasoning) signals.I += 2
        if (quality.complexity === 'high') signals.I += 1
        break

      case 'L': // 连接力
        if (text.includes('帮助') || text.includes('一起') || text.includes('团队')) signals.L += 2
        if (text.includes('朋友') || text.includes('分享') || text.includes('关心')) signals.L += 1
        if (quality.hasEmpathy) signals.L += 2
        if (text.includes('理解') || text.includes('尊重')) signals.L += 1
        break

      case 'D': // 设计力
        if (text.includes('设计') || text.includes('方案') || text.includes('计划')) signals.D += 2
        if (text.includes('首先') || text.includes('然后') || text.includes('最后')) signals.D += 1
        if (quality.hasReasoning) signals.D += 1
        if (quality.complexity === 'high') signals.D += 1
        break

      case 'E': // 表达力
        if (quality.length > 30) signals.E += 2
        if (quality.hasCreativity) signals.E += 1
        if (text.includes('我觉得') || text.includes('我认为')) signals.E += 1
        if (quality.complexity === 'high') signals.E += 2
        break

      case 'R': // 韧性
        if (text.includes('坚持') || text.includes('努力') || text.includes('不放弃')) signals.R += 2
        if (text.includes('失败') || text.includes('困难') || text.includes('挫折')) signals.R += 1
        if (text.includes('学习') || text.includes('改进') || text.includes('下次')) signals.R += 2
        if (quality.hasReasoning) signals.R += 1
        break
    }

    // 长度奖励（表达更充分）
    if (quality.length > 50) {
      Object.keys(signals).forEach(key => {
        signals[key as WilderDimension] = Math.min(5, signals[key as WilderDimension] + 0.5)
      })
    }

    // 限制在 0-5 范围
    Object.keys(signals).forEach(key => {
      signals[key as WilderDimension] = Math.max(0, Math.min(5, signals[key as WilderDimension]))
    })

    return signals
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(
    text: string,
    signals: Record<WilderDimension, number>,
  ): number {
    let confidence = 50 // 基础置信度

    // 文本长度影响
    if (text.length > 20) confidence += 10
    if (text.length > 50) confidence += 10
    if (text.length > 100) confidence += 10

    // 信号强度影响
    const maxSignal = Math.max(...Object.values(signals))
    if (maxSignal > 3) confidence += 10

    // 复杂度影响
    if (text.split(/[。！？.!?\n]/).length > 1) confidence += 10

    return Math.min(95, Math.max(30, confidence))
  }

  /**
   * 生成推理过程（用于调试）
   */
  private generateReasoning(
    text: string,
    targetDimension: WilderDimension,
    signals: Record<WilderDimension, number>,
    quality: SignalExtractionResult['qualityMetrics'],
  ): string {
    const dimensionNames: Record<WilderDimension, string> = {
      W: '好奇心',
      I: '洞察力',
      L: '连接力',
      D: '设计力',
      E: '表达力',
      R: '韧性',
    }

    return `分析目标维度: ${dimensionNames[targetDimension]} | 文本长度: ${quality.length}字符 | 复杂度: ${quality.complexity} | 推理: ${quality.hasReasoning ? '是' : '否'} | 创造力: ${quality.hasCreativity ? '是' : '否'} | 共情: ${quality.hasEmpathy ? '是' : '否'} | 最高信号: ${Object.entries(signals).sort((a, b) => b[1] - a[1])[0][0]}=${Object.entries(signals).sort((a, b) => b[1] - a[1])[0][1]}`
  }

  /**
   * 生成自适应追问（基于回答深度）
   */
  generateFollowUp(
    originalText: string,
    targetDimension: WilderDimension,
    extractionResult: SignalExtractionResult,
  ): string {
    const { qualityMetrics } = extractionResult

    // 如果回答很短，鼓励多说
    if (qualityMetrics.length < 10) {
      return '能多说说你的想法吗？我很好奇你的观点！'
    }

    // 如果回答缺乏推理，引导深入思考
    if (!qualityMetrics.hasReasoning) {
      const followUps: Record<WilderDimension, string> = {
        W: '你为什么这么想呢？能说说你的理由吗？',
        I: '你是怎么得出这个结论的？能分享一下你的思考过程吗？',
        L: '你觉得别人会怎么看待这个问题呢？',
        D: '如果要实现这个想法，你觉得第一步应该做什么？',
        E: '你能举个例子或者讲个故事来说明吗？',
        R: '如果遇到困难，你会怎么坚持下来呢？',
      }
      return followUps[targetDimension]
    }

    // 如果回答已经有推理，挑战或深化
    const challenges: Record<WilderDimension, string> = {
      W: '如果情况完全相反，你会怎么想？',
      I: '有没有可能还有别的原因？',
      L: '如果团队里有人不同意你的做法，你会怎么处理？',
      D: '如果资源不够，你会怎么调整方案？',
      E: '如果要说服一个持反对意见的人，你会怎么说？',
      R: '如果失败了两次，你还会尝试吗？为什么？',
    }
    return challenges[targetDimension]
  }
}

/**
 * 工厂函数：创建信号提取器
 */
export function createSignalExtractor(age: number): OpenEndedSignalExtractor {
  const ageLevel = age <= 8 ? 'L0' : age <= 11 ? 'L2' : age <= 14 ? 'L4' : 'L5'
  return new OpenEndedSignalExtractor(ageLevel)
}
