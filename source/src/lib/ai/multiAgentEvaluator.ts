// ===================================================================
// GROWMATE AI-Native 引擎 — 双Agent对冲评估器 v1.0.0
// Agent A(风险官) ⊕ Agent B(战略师) → 共识/分歧 → 平衡报告
// ===================================================================

import type {
  AgentConfig,
  AgentOutput,
  AgentSection,
  SynthesisResult,
  ConsensusZone,
  DivergenceZone,
  DualPerspectiveReport,
  LanguageProfile,

} from './types'
import { getDefaultProvider } from './aiServiceProvider'
import { buildRiskOfficerSystemPrompt, buildStrategistSystemPrompt, buildAgentUserPrompt } from './promptTemplates'
import { computeLanguageProfile } from './temperatureController'
import { retrieveByDimensions, formatContextForPrompt } from './ragKnowledgeEngine'

// ============================================================
// Agent定义
// ============================================================

export const AGENT_RISK_OFFICER: AgentConfig = {
  id: 'risk_officer',
  name: '理性风险官',
  nameEn: 'Risk Analyst',
  avatar: '🛡️',
  systemPrompt: '', // 由promptTemplates动态生成
  temperature: 0.3,
  perspective: '严谨、数据驱动、关注风险',
  focusAreas: ['性格暗面', '教育雷区', '应试冲突', '同龄基线', '窗口期警告'],
}

export const AGENT_STRATEGIST: AgentConfig = {
  id: 'strategist',
  name: '战略规划师',
  nameEn: 'Growth Strategist',
  avatar: '🚀',
  systemPrompt: '', // 由promptTemplates动态生成
  temperature: 0.7,
  perspective: '乐观、前瞻、关注上限',
  focusAreas: ['跃迁路径', 'AI时代机遇', '跨界融合', '非常规方向', '天花板分析'],
}

// ============================================================
// 输入输出类型
// ============================================================

export interface DualAgentInput {
  profileVector: number[]
  wilderScores: Record<string, number>
  talentType: string
  childName: string
  age: number
  topDims: string
  bottomDims: string
  languageProfile?: LanguageProfile
}

// ============================================================
// 主入口
// ============================================================

export async function evaluateWithDualAgents(input: DualAgentInput): Promise<DualPerspectiveReport> {
  try {
    const languageProfile = input.languageProfile || computeLanguageProfile(input.age)

    // RAG上下文
    const ragResults = retrieveByDimensions(
      input.topDims.split('+'),
      input.bottomDims.split('+'),
      input.age,
      10,
    )
    const ragContext = formatContextForPrompt(ragResults)

    // 构建Agent上下文
    const agentCtx = {
      wilderScores: input.wilderScores,
      talentType: input.talentType,
      childName: input.childName,
      age: input.age,
      topDims: input.topDims,
      bottomDims: input.bottomDims,
      ragContext,
      languageInstruction: languageProfile.promptInstruction,
      cotSummary: '',
    }

    // 并行调用两个Agent
    const [riskResult, strategyResult] = await Promise.all([
      runAgent(AGENT_RISK_OFFICER, agentCtx),
      runAgent(AGENT_STRATEGIST, agentCtx),
    ])

    // 合成
    const synthesis = synthesize(riskResult, strategyResult, input)

    const executiveSummary = generateExecutiveSummary(synthesis, input.childName, input.talentType)

    return {
      riskOfficer: riskResult,
      strategist: strategyResult,
      synthesis,
      executiveSummary,
      isAIGenerated: riskResult.isAIGenerated || strategyResult.isAIGenerated,
      generatedAt: new Date().toISOString(),
    }
  } catch (err) {
    console.error('[MultiAgent] LLM evaluation failed, using sync fallback:', err)
    return evaluateWithDualAgentsSync(input)
  }
}

/** 同步降级版本 */
export function evaluateWithDualAgentsSync(input: DualAgentInput): DualPerspectiveReport {
  const dimNames: Record<string, string> = { W: '好奇心', I: '探究力', L: '联结力', D: '设计力', E: '表达力', R: '反思力' }

  // Agent A: 风险官（基于风险预警规则）
  const riskSections: AgentSection[] = []
  const highDims = Object.entries(input.wilderScores).filter(([, v]) => v >= 70).map(([k]) => k)
  const lowDims = Object.entries(input.wilderScores).filter(([, v]) => v < 40).map(([k]) => k)

  // 性格暗面
  if (highDims.length > 0) {
    const riskTexts: Record<string, string> = {
      W: `${dimNames.W}过高可能导致注意力分散、三分钟热度，建议设定"探索时间段"`,
      I: `${dimNames.I}过高可能陷入细节而忽略大局，需学会"够用就好"`,
      L: `${dimNames.L}过高可能过度关注他人评价而忽略自身需求`,
      D: `${dimNames.D}过高可能导致完美主义和执行焦虑，需培养"先完成再完美"的心态`,
      E: `${dimNames.E}过高可能表达欲过强而倾听不足`,
      R: `${dimNames.R}过高可能过度反思而导致决策犹豫`,
    }
    const warnings = highDims.map(d => riskTexts[d]).filter(Boolean)
    riskSections.push({
      title: '性格暗面',
      content: warnings.join('；'),
      type: 'risk',
      severity: 'medium',
      relatedDimensions: highDims,
    })
  }

  // 短板警告
  if (lowDims.length > 0) {
    riskSections.push({
      title: '短板提升建议',
      content: `${lowDims.map(d => dimNames[d]).join('、')}维度处于基础水平，建议通过有针对性的练习逐步提升`,
      type: 'recommendation',
      relatedDimensions: lowDims,
    })
  }

  // Agent B: 战略师（基于天赋类型优势）
  const strategySections: AgentSection[] = [
    {
      title: '核心优势',
      content: `${input.childName}的核心优势在于${input.topDims}维度的突出表现，这在AI时代是具有稀缺性的能力组合`,
      type: 'opportunity',
      relatedDimensions: input.topDims.split('+'),
    },
    {
      title: '发展潜力',
      content: `基于当前${input.talentType}的天赋类型，未来在教育、科技、创意等领域都有良好的发展基础`,
      type: 'opportunity',
      relatedDimensions: ['W', 'I', 'L', 'D', 'E', 'R'],
    },
  ]

  const riskOfficer: AgentOutput = {
    agentId: 'risk_officer',
    agentName: '理性风险官',
    sections: riskSections,
    overallTone: 'cautious',
    keyPoints: ['关注优势维度的暗面风险', '重视短板的提升', '平衡发展与保护'],
    confidenceLevel: 0.7,
    isAIGenerated: false,
  }

  const strategist: AgentOutput = {
    agentId: 'strategist',
    agentName: '战略规划师',
    sections: strategySections,
    overallTone: 'optimistic',
    keyPoints: ['核心优势明显', '发展潜力大', 'AI时代机遇良好'],
    confidenceLevel: 0.7,
    isAIGenerated: false,
  }

  const synthesis = synthesize(riskOfficer, strategist, input)

  return {
    riskOfficer,
    strategist,
    synthesis,
    executiveSummary: generateExecutiveSummary(synthesis, input.childName, input.talentType),
    isAIGenerated: false,
    generatedAt: new Date().toISOString(),
  }
}

// ============================================================
// 单个Agent执行
// ============================================================

export async function runAgent(
  config: AgentConfig,
  ctx: {
    wilderScores: Record<string, number>
    talentType: string
    childName: string
    age: number
    topDims: string
    bottomDims: string
    ragContext: string
    languageInstruction: string
    cotSummary?: string
  },
): Promise<AgentOutput> {
  try {
    const systemPrompt = config.id === 'risk_officer'
      ? buildRiskOfficerSystemPrompt(ctx as any)
      : buildStrategistSystemPrompt(ctx as any)

    const userPrompt = buildAgentUserPrompt(ctx as any)

    const response = await getDefaultProvider().chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: config.temperature,
      maxTokens: 2048,
    })

    if (!response) {
      throw new Error(`Agent ${config.name} returned null`)
    }

    // 解析JSON输出
    try {
      const jsonStart = response.content.indexOf('{')
      const jsonEnd = response.content.lastIndexOf('}') + 1
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonStr = response.content.slice(jsonStart, jsonEnd)
        const parsed = JSON.parse(jsonStr)

        const sections: AgentSection[] = (parsed.sections || []).map((s: Record<string, unknown>) => ({
          title: (s.title as string) || '',
          content: (s.content as string) || '',
          type: (s.type as AgentSection['type']) || 'analysis',
          severity: s.severity as AgentSection['severity'],
          timeframe: s.timeframe as string,
          relatedDimensions: (s.relatedDimensions as string[]) || [],
        }))

        return {
          agentId: config.id,
          agentName: config.name,
          sections,
          overallTone: (parsed.overallTone as AgentOutput['overallTone']) || 'balanced',
          keyPoints: (parsed.keyPoints as string[]) || [],
          confidenceLevel: (parsed.confidenceLevel as number) || 0.7,
          isAIGenerated: true,
        }
      }
    } catch {
      console.warn(`[MultiAgent] Failed to parse ${config.name} output`)
    }

    // Fallback: 用纯文本生成一个简单结果
    return {
      agentId: config.id,
      agentName: config.name,
      sections: [{
        title: '综合评估',
        content: response.content.slice(0, 500),
        type: 'analysis',
        relatedDimensions: ['W', 'I', 'L', 'D', 'E', 'R'],
      }],
      overallTone: 'balanced',
      keyPoints: [response.content.slice(0, 100)],
      confidenceLevel: 0.5,
      isAIGenerated: true,
    }
  } catch (err) {
    console.error(`[MultiAgent] Agent ${config.name} error:`, err)
    throw err
  }
}

// ============================================================
// 合成器（本地算法）
// ============================================================

export function synthesize(
  agentA: AgentOutput,
  agentB: AgentOutput,
  _input: DualAgentInput,
): SynthesisResult {
  // 关键词提取
  const keywordsA = extractKeywords(agentA.sections.map(s => s.content).join(' '))
  const keywordsB = extractKeywords(agentB.sections.map(s => s.content).join(' '))

  // 共识区域：两个Agent都提到的关键词
  const commonKeywords = [...keywordsA].filter(k => keywordsB.has(k))
  const consensusZones: ConsensusZone[] = []

  for (const kw of commonKeywords) {
    const aSection = agentA.sections.find(s => s.content.includes(kw))
    const bSection = agentB.sections.find(s => s.content.includes(kw))
    if (aSection && bSection) {
      consensusZones.push({
        topic: kw,
        riskOfficerView: aSection.content.slice(0, 150),
        strategistView: bSection.content.slice(0, 150),
        sharedConclusion: `双方都关注到了"${kw}"这一关键因素`,
        confidenceLevel: 0.7,
      })
    }
  }

  // 分歧区域：只有一方提到的关键词
  const divergenceZones: DivergenceZone[] = []
  const onlyA = [...keywordsA].filter(k => !keywordsB.has(k))
  const onlyB = [...keywordsB].filter(k => !keywordsA.has(k))

  for (const kw of onlyA.slice(0, 3)) {
    const section = agentA.sections.find(s => s.content.includes(kw))
    if (section) {
      divergenceZones.push({
        topic: kw,
        riskOfficerPosition: section.content.slice(0, 150),
        strategistPosition: '未特别关注',
        parentGuidance: `风险官关注到了"${kw}"，建议家长留意但无需过度紧张`,
        suggestedAction: '观察为主，适时引导',
      })
    }
  }

  for (const kw of onlyB.slice(0, 3)) {
    const section = agentB.sections.find(s => s.content.includes(kw))
    if (section) {
      divergenceZones.push({
        topic: kw,
        riskOfficerPosition: '未特别关注',
        strategistPosition: section.content.slice(0, 150),
        parentGuidance: `战略师发现了"${kw}"的潜力，值得关注和投入`,
        suggestedAction: '提供资源支持，鼓励探索',
      })
    }
  }

  // 整合建议
  const integratedRecommendations = [
    ...consensusZones.map(c => c.sharedConclusion),
    ...divergenceZones.map(d => d.suggestedAction),
  ]

  // 平衡叙事
  const balancedNarrative = `
综合风险官和战略师的评估，双方一致认同的要点包括：${consensusZones.map(c => c.topic).join('、') || '核心发展方向'}。
在部分维度上存在视角差异：${divergenceZones.map(d => `${d.topic}（风险官关注风险，战略师关注机会）`).join('；') || '无明显分歧'}。
建议家长既要关注潜在风险，也要积极发现和利用发展机遇。
`.trim()

  return {
    consensusZones,
    divergenceZones,
    integratedRecommendations,
    balancedNarrative,
  }
}

/** 简单关键词提取（TF统计） */
function extractKeywords(text: string): Set<string> {
  const words = text.split(/[\s，。！？、；：""''（）【】《》\n\r\t]+/).filter(w => w.length >= 2)
  const freq = new Map<string, number>()
  for (const w of words) {
    freq.set(w, (freq.get(w) || 0) + 1)
  }
  return new Set(
    [...freq.entries()]
      .filter(([, count]) => count >= 2)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word)
  )
}

/** 生成执行摘要 */
function generateExecutiveSummary(synthesis: SynthesisResult, childName: string, talentType: string): string {
  const consensusCount = synthesis.consensusZones.length
  const divergenceCount = synthesis.divergenceZones.length

  let summary = `${childName}的双视角评估完成了${consensusCount}项共识和${divergenceCount}项分歧分析。`

  if (consensusCount > 0) {
    summary += `双方一致认同的核心要点是：${synthesis.consensusZones.slice(0, 3).map(c => c.topic).join('、')}。`
  }

  summary += `整体评估表明，${talentType}的发展路径既有需要关注的风险领域，也存在值得期待的发展机遇。`

  return summary
}
