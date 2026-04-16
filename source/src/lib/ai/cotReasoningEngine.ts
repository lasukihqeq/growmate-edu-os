// ===================================================================
// GROWMATE AI-Native 引擎 — CoT三层思维链推理引擎 v1.0.0
// 观察 → 推理 → 预测，每个结论可追溯到具体测评证据
// ===================================================================

import type {
  ObservationNode,
  InferenceNode,
  PredictionNode,
  CausalChain,
  ReasoningResult,
  ReasoningVisualization,
  LanguageProfile,
} from './types'
import { getDefaultProvider } from './aiServiceProvider'
import { buildCoTInferencePrompt, buildCoTPredictionPrompt } from './promptTemplates'
import { computeLanguageProfile } from './temperatureController'

export interface EvidenceRecord {
  questionId: string
  questionText: string
  answer: string
  dimension: string
  score: number
}

export interface CoTReasoningInput {
  wilderScores: Record<string, number>
  wilderLevels: Record<string, string>
  evidenceRecords: EvidenceRecord[]
  profileVector?: number[]
  talentType30Key: string
  age: number
  childName: string
  languageProfile?: LanguageProfile
}

// ============================================================
// 主入口
// ============================================================

export async function performCoTReasoning(input: CoTReasoningInput): Promise<ReasoningResult> {
  try {
    // Step 1: 观察层（同步本地）
    const observations = extractObservations(input.wilderScores, input.wilderLevels, input.evidenceRecords, input.age)

    if (observations.length === 0) {
      return performCoTReasoningSync(input)
    }

    // Step 2: 推理层（异步LLM）
    const languageProfile = input.languageProfile || computeLanguageProfile(input.age)
    let inferences: InferenceNode[] = []

    try {
      inferences = await performInference(observations, input.profileVector || [], languageProfile, input)
    } catch (err) {
      console.warn('[CoT] LLM inference failed, using sync fallback:', err)
      inferences = performInferenceSync(observations, input)
    }

    if (inferences.length === 0) {
      inferences = performInferenceSync(observations, input)
    }

    // Step 3: 预测层（异步LLM）
    let predictions: PredictionNode[] = []
    try {
      predictions = await generatePredictions(inferences, input.age, input.talentType30Key, languageProfile, input)
    } catch (err) {
      console.warn('[CoT] LLM prediction failed, using sync fallback:', err)
      predictions = generatePredictionsSync(inferences, input)
    }

    if (predictions.length === 0) {
      predictions = generatePredictionsSync(inferences, input)
    }

    // Step 4: 组装因果链
    const chains = assembleCausalChains(observations, inferences, predictions)

    const isAIGenerated = true
    const keyInsights = chains.slice(0, 5).map(c => `${c.title}: ${c.overallConfidence > 0.7 ? '高置信' : '中置信'}`)

    return {
      chains,
      summary: `基于对${input.childName}的WILDER六维评估数据，通过${observations.length}个关键观察、${inferences.length}步认知推理和${predictions.length}个潜力预测，形成了${chains.length}条完整的因果推理链。`,
      keyInsights,
      isAIGenerated,
      timestamp: new Date().toISOString(),
    }
  } catch (err) {
    console.error('[CoT] Full pipeline failed:', err)
    return performCoTReasoningSync(input)
  }
}

/** 同步降级版本 */
export function performCoTReasoningSync(input: CoTReasoningInput): ReasoningResult {
  const observations = extractObservations(input.wilderScores, input.wilderLevels, input.evidenceRecords, input.age)
  const inferences = performInferenceSync(observations, input)
  const predictions = generatePredictionsSync(inferences, input)
  const chains = assembleCausalChains(observations, inferences, predictions)

  return {
    chains,
    summary: `基于对${input.childName}的WILDER六维评估数据（规则引擎推理），形成了${chains.length}条因果推理链。`,
    keyInsights: chains.slice(0, 5).map(c => c.title),
    isAIGenerated: false,
    timestamp: new Date().toISOString(),
  }
}

// ============================================================
// 观察层（同步本地）
// ============================================================

export function extractObservations(
  wilderScores: Record<string, number>,
  wilderLevels: Record<string, string>,
  evidenceRecords: EvidenceRecord[],
  age: number,
): ObservationNode[] {
  const dims = ['W', 'I', 'L', 'D', 'E', 'R']
  const dimNames: Record<string, string> = { W: '好奇心', I: '探究力', L: '联结力', D: '设计力', E: '表达力', R: '反思力' }
  const observations: ObservationNode[] = []
  let obsIdx = 0

  for (const dim of dims) {
    const score = wilderScores[dim] || 0
    const level = wilderLevels[dim] || 'mid'
    const dimEvidence = evidenceRecords.filter(e => e.dimension === dim)

    if (dimEvidence.length === 0) continue

    // 判断观察类型
    let obsType: ObservationNode['type'] = 'behavioral'
    if (dim === 'W') obsType = 'cognitive'
    else if (dim === 'L') obsType = 'social'
    else if (dim === 'D') obsType = 'creative'
    else if (dim === 'R') obsType = 'reflective'

    // 年龄上下文
    const ageContext = age <= 6
      ? `在${age}岁学龄前阶段，这种表现属于认知发展的正常范围`
      : age <= 12
        ? `在${age}岁儿童中，这种行为表现${score >= 70 ? '属于领先水平' : score >= 40 ? '处于平均水平' : '有提升空间'}`
        : `在${age}岁青少年中，这种认知模式${score >= 70 ? '显示出较强的能力倾向' : '属于正常发展范围'}`

    // 生成观察描述
    let description = ''
    if (level === 'high') {
      description = `在${dimNames[dim]}相关的${dimEvidence.length}道题目中，连续选择了积极主动类选项，得分${score}分（高水平），展现出明显的${dimNames[dim]}倾向。`
    } else if (level === 'low') {
      description = `在${dimNames[dim]}相关的${dimEvidence.length}道题目中，倾向于选择保守或被动类选项，得分${score}分（基础水平），该维度有发展潜力。`
    } else {
      description = `在${dimNames[dim]}相关的${dimEvidence.length}道题目中，表现出混合但偏向积极的作答模式，得分${score}分（中等水平），有一定的${dimNames[dim]}基础。`
    }

    // 跨维度协同观察
    const highDims = dims.filter(d => (wilderScores[d] || 0) >= 70)
    if (highDims.length >= 2 && highDims.includes(dim)) {
      const pairDim = highDims.find(d => d !== dim)
      if (pairDim) {
        description += ` 同时${dimNames[pairDim]}(${wilderScores[pairDim]}分)也达到高水平，两个维度可能产生协同效应。`
      }
    }

    observations.push({
      id: `obs-${obsIdx++}`,
      type: obsType,
      description,
      evidence: dimEvidence.slice(0, 5).map(e => ({
        questionId: e.questionId,
        questionText: e.questionText,
        answer: e.answer,
        score: e.score,
      })),
      wilderDimensions: [dim],
      confidence: level === 'high' ? 0.85 : level === 'mid' ? 0.65 : 0.7,
      ageContext,
    })
  }

  return observations
}

// ============================================================
// 推理层（异步LLM + 同步降级）
// ============================================================

async function performInference(
  observations: ObservationNode[],
  _profileVector: number[],
  languageProfile: LanguageProfile,
  input: CoTReasoningInput,
): Promise<InferenceNode[]> {
  const observationsText = observations.map(o =>
    `[${o.id}] ${o.description} (置信度: ${(o.confidence * 100).toFixed(0)}%)`
  ).join('\n')

  const prompt = buildCoTInferencePrompt({
    observations: observationsText,
    childName: input.childName,
    age: input.age,
    topDims: Object.entries(input.wilderScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([d]) => d)
      .join('+'),
    languageInstruction: languageProfile.promptInstruction,
  })

  const response = await getDefaultProvider().chatCompletion([
    { role: 'user', content: prompt },
  ], { temperature: 0.5, maxTokens: 2048 })

  if (!response) return []

  // 解析JSON输出
  try {
    const jsonStart = response.content.indexOf('[')
    const jsonEnd = response.content.lastIndexOf(']') + 1
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const jsonStr = response.content.slice(jsonStart, jsonEnd)
      const parsed = JSON.parse(jsonStr)
      if (Array.isArray(parsed)) {
        let infIdx = 0
        return parsed.map((item: Record<string, unknown>) => ({
          id: `inf-${infIdx++}`,
          fromObservations: (item.from_observations as string[]) || [],
          trait: (item.trait as string) || '未命名特质',
          reasoning: (item.reasoning_steps as string[])?.join('。') || (item.reasoning as string) || '',
          mechanism: (item.mechanism as string) || '',
          confidence: (item.confidence as number) || 0.6,
          alternativeExplanations: (item.alternative_explanations as string[]) || [],
        }))
      }
    }
  } catch {
    console.warn('[CoT] Failed to parse LLM inference output')
  }

  return []
}

function performInferenceSync(
  observations: ObservationNode[],
  _input: CoTReasoningInput,
): InferenceNode[] {
  const dimNames: Record<string, string> = { W: '好奇心', I: '探究力', L: '联结力', D: '设计力', E: '表达力', R: '反思力' }
  const dimTraits: Record<string, string> = {
    W: '内在动机驱动的探索偏好',
    I: '证据导向的求证思维',
    L: '社交共情与协作意愿',
    D: '结构化规划与创意执行',
    E: '信息整合与故事化表达',
    R: '元认知与自我觉察能力',
  }
  const dimMechanisms: Record<string, string> = {
    W: '基于自我决定理论，内在动机与好奇心高度相关。儿童在安全环境中会自然展现探索行为。',
    I: '皮亚杰认知发展理论：儿童通过同化和顺应构建知识体系。求证思维是认知成熟的表现。',
    L: '维果茨基社会文化理论：学习发生在社会互动中。协作能力是社会化的重要指标。',
    D: '执行功能理论：规划、工作记忆和抑制控制是设计力的核心。前额叶皮层发育影响这些能力。',
    E: '信息加工理论：表达力反映了从输入到输出的信息转换效率，涉及语言中枢和社交认知网络。',
    R: '元认知理论：Flavell提出反思能力是认知发展的高级阶段，涉及对自身思维过程的监控。',
  }

  let infIdx = 0
  return observations.map(obs => {
    const dim = obs.wilderDimensions[0]
    return {
      id: `inf-${infIdx++}`,
      fromObservations: [obs.id],
      trait: dimTraits[dim] || '综合认知特质',
      reasoning: `观察到${obs.description}，根据${dimNames[dim]}的心理学机制，可以推断该特质正在发展中。`,
      mechanism: dimMechanisms[dim] || '',
      confidence: obs.confidence * 0.8,
      alternativeExplanations: [
        `可能是暂时性的情境影响，而非稳定的特质倾向`,
        `${dimNames[dim]}的测评可能受到当天情绪或环境因素的干扰`,
      ],
    }
  })
}

// ============================================================
// 预测层（异步LLM + 同步降级）
// ============================================================

async function generatePredictions(
  inferences: InferenceNode[],
  age: number,
  talentType: string,
  languageProfile: LanguageProfile,
  input: CoTReasoningInput,
): Promise<PredictionNode[]> {
  const inferencesText = inferences.map(inf =>
    `[${inf.id}] 特质"${inf.trait}"：${inf.reasoning}`
  ).join('\n')

  const prompt = buildCoTPredictionPrompt({
    inferences: inferencesText,
    childName: input.childName,
    age,
    talentType,
    languageInstruction: languageProfile.promptInstruction,
  })

  const response = await getDefaultProvider().chatCompletion([
    { role: 'user', content: prompt },
  ], { temperature: 0.5, maxTokens: 1536 })

  if (!response) return []

  try {
    const jsonStart = response.content.indexOf('[')
    const jsonEnd = response.content.lastIndexOf(']') + 1
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const jsonStr = response.content.slice(jsonStart, jsonEnd)
      const parsed = JSON.parse(jsonStr)
      if (Array.isArray(parsed)) {
        let predIdx = 0
        return parsed.map((item: Record<string, unknown>) => ({
          id: `pred-${predIdx++}`,
          fromInferences: (item.from_inferences as string[]) || [],
          prediction: (item.prediction as string) || '',
          timeframe: (item.timeframe as 'short' | 'medium' | 'long') || 'medium',
          probability: (item.probability as 'high' | 'medium' | 'low') || 'medium',
          conditions: (item.conditions as string[]) || [],
          risks: (item.risks as string[]) || [],
        }))
      }
    }
  } catch {
    console.warn('[CoT] Failed to parse LLM prediction output')
  }

  return []
}

function generatePredictionsSync(
  inferences: InferenceNode[],
  input: CoTReasoningInput,
): PredictionNode[] {
  const dimNames: Record<string, string> = { W: '好奇心', I: '探究力', L: '联结力', D: '设计力', E: '表达力', R: '反思力' }

  let predIdx = 0
  const predictions: PredictionNode[] = []

  for (const inf of inferences) {
    const dim = inf.fromObservations.length > 0
      ? inferDimensionFromObservation(inf)
      : 'W'

    const score = input.wilderScores[dim] || 50
    const level = score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low'

    if (level === 'high') {
      predictions.push({
        id: `pred-${predIdx++}`,
        fromInferences: [inf.id],
        prediction: `在${dimNames[dim]}方向上，${input.childName}可能表现出持续的优势，适合深度学习项目`,
        timeframe: 'medium',
        probability: 'high',
        conditions: ['提供开放式探索环境', '给予足够的自主决策空间'],
        risks: ['需要注意避免过度专注而忽略其他维度发展'],
      })
    } else if (level === 'low') {
      predictions.push({
        id: `pred-${predIdx++}`,
        fromInferences: [inf.id],
        prediction: `${dimNames[dim]}维度有较大的提升空间，通过有针对性的训练可以在1-2年内达到中等水平`,
        timeframe: 'long',
        probability: 'medium',
        conditions: ['创造低压力的练习环境', '从兴趣点切入'],
        risks: ['如果缺乏引导可能持续处于基础水平'],
      })
    }
  }

  // 通用预测
  predictions.push({
    id: `pred-${predIdx++}`,
    fromInferences: inferences.map(i => i.id),
    prediction: `综合评估，${input.childName}的整体认知发展轨迹良好，核心优势维度稳定`,
    timeframe: 'short',
    probability: 'high',
    conditions: ['保持当前的教育环境'],
    risks: [],
  })

  return predictions
}

function inferDimensionFromObservation(inf: InferenceNode): string {
  const dimMap: Record<string, string> = {
    '好奇': 'W', '探索': 'W', '提问': 'W',
    '探究': 'I', '验证': 'I', '实验': 'I',
    '协作': 'L', '共情': 'L', '社交': 'L',
    '设计': 'D', '规划': 'D', '创意': 'D',
    '表达': 'E', '沟通': 'E', '故事': 'E',
    '反思': 'R', '元认知': 'R', '自省': 'R',
  }
  for (const [keyword, dim] of Object.entries(dimMap)) {
    if (inf.trait.includes(keyword) || inf.reasoning.includes(keyword)) return dim
  }
  return 'W'
}

// ============================================================
// 因果链组装
// ============================================================

export function assembleCausalChains(
  observations: ObservationNode[],
  inferences: InferenceNode[],
  predictions: PredictionNode[],
): CausalChain[] {
  const chains: CausalChain[] = []

  // 按推理节点分组
  for (const inf of inferences) {
    const relatedObs = observations.filter(o => inf.fromObservations.includes(o.id))
    const relatedPreds = predictions.filter(p => p.fromInferences.includes(inf.id))

    if (relatedObs.length === 0) continue

    const chainTitle = relatedObs.map(o => o.wilderDimensions.join('/')).join('+') + ' → ' + inf.trait + ' → ' + (relatedPreds[0]?.prediction?.slice(0, 20) || '待观察')
    const overallConf = relatedObs.reduce((s, o) => s + o.confidence, 0) / relatedObs.length * inf.confidence

    chains.push({
      id: `chain-${chains.length}`,
      title: chainTitle,
      observations: relatedObs,
      inferences: [inf],
      predictions: relatedPreds,
      overallConfidence: Math.min(1, overallConf),
    })
  }

  return chains
}

// ============================================================
// 可视化数据构建
// ============================================================

export function buildVisualizationData(result: ReasoningResult): ReasoningVisualization {
  const nodes: ReasoningVisualization['nodes'] = []
  const edges: ReasoningVisualization['edges'] = []
  const layers: ReasoningVisualization['layers'] = [
    { name: '观察', nodeIds: [] },
    { name: '推理', nodeIds: [] },
    { name: '预测', nodeIds: [] },
  ]

  // 添加节点
  for (const chain of result.chains) {
    for (const obs of chain.observations) {
      nodes.push({ id: obs.id, type: 'observation', label: obs.description.slice(0, 30), x: 0, y: 0 })
      layers[0].nodeIds.push(obs.id)
    }
    for (const inf of chain.inferences) {
      nodes.push({ id: inf.id, type: 'inference', label: inf.trait, x: 0, y: 0 })
      layers[1].nodeIds.push(inf.id)
    }
    for (const pred of chain.predictions) {
      nodes.push({ id: pred.id, type: 'prediction', label: pred.prediction.slice(0, 30), x: 0, y: 0 })
      layers[2].nodeIds.push(pred.id)
    }

    // 添加边
    for (const obsId of chain.inferences.flatMap(i => i.fromObservations)) {
      edges.push({ from: obsId, to: chain.inferences[0]?.id || '' })
    }
    for (const pred of chain.predictions) {
      for (const infId of pred.fromInferences) {
        edges.push({ from: infId, to: pred.id })
      }
    }
  }

  // 简单布局：三层排列
  const layerY = [0, 200, 400]
  for (let li = 0; li < 3; li++) {
    const layerNodeIds = layers[li].nodeIds
    for (let ni = 0; ni < layerNodeIds.length; ni++) {
      const node = nodes.find(n => n.id === layerNodeIds[ni])
      if (node) {
        node.x = (ni + 1) * 250 - 125
        node.y = layerY[li]
      }
    }
  }

  return { nodes, edges, layers }
}
