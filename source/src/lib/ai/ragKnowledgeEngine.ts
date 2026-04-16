// ===================================================================
// GROWMATE AI-Native 引擎 — RAG本地知识检索引擎 v1.0.0
// 将现有硬编码知识转化为向量化知识条目，建立本地语义检索能力
// TF-IDF向量化（无需外部embedding API）
// ===================================================================

import type {
  KnowledgeEntry,
  KnowledgeMetadata,
  RetrievalResult,
  RAGContext,
  KnowledgeIndex,
  KnowledgeCategory,
} from './types'

// ============================================================
// 全局单例
// ============================================================

let _knowledgeIndex: KnowledgeIndex | null = null

export function getKnowledgeBase(): KnowledgeIndex {
  if (!_knowledgeIndex) {
    _knowledgeIndex = initializeKnowledgeBase()
  }
  return _knowledgeIndex
}

// ============================================================
// 中文分词器（轻量实现：标点切分 + 双字/三字gram）
// ============================================================

const STOP_WORDS = new Set([
  '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个',
  '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好',
  '自己', '这', '那', '吗', '什么', '吗', '呢', '吧', '啊', '呀', '哦', '嗯',
  '这个', '那个', '可以', '因为', '所以', '如果', '但是', '虽然', '而且',
  '并且', '或者', '然后', '这样', '那样', '怎么', '为什么', '哪些',
  '的', '地', '得', '把', '被', '让', '给', '从', '到', '向', '往',
  '等', '而', '与', '及', '其', '以', '为', '对', '于', '关', '于',
])

function tokenize(text: string): string[] {
  // 按标点和空格切分
  const words = text.replace(/[，。！？、；：""''（）【】《》\s\n\r\t]/g, ' ').split(/\s+/).filter(Boolean)

  const tokens: string[] = []
  for (const w of words) {
    if (w.length >= 2 && !STOP_WORDS.has(w)) {
      tokens.push(w)
    }
    // 双字/三字gram
    for (let i = 0; i <= w.length - 2; i++) {
      const bigram = w.slice(i, i + 2)
      if (!STOP_WORDS.has(bigram) && bigram.length >= 2) {
        tokens.push(bigram)
      }
    }
  }

  return tokens
}

// ============================================================
// 知识库初始化
// ============================================================

export function initializeKnowledgeBase(): KnowledgeIndex {
  const index: KnowledgeIndex = {
    entries: [],
    vocabulary: [],
    vocabularyIndex: new Map(),
    documentCount: 0,
    isReady: true,
  }

  try {
    const entries = extractKnowledgeFromModules()
    index.entries = entries
    index.documentCount = entries.length

    // 构建词汇表
    const wordFreq = new Map<string, number>()
    const docFreq = new Map<string, number>()

    for (const entry of entries) {
      const tokens = tokenize(entry.content)
      const uniqueTokens = new Set(tokens)

      for (const token of tokens) {
        wordFreq.set(token, (wordFreq.get(token) || 0) + 1)
      }
      for (const token of uniqueTokens) {
        docFreq.set(token, (docFreq.get(token) || 0) + 1)
      }
    }

    // 筛选：出现>=2次的词，排除停用词
    const vocab: string[] = []
    for (const [word, freq] of wordFreq) {
      if (freq >= 2 && !STOP_WORDS.has(word)) {
        vocab.push(word)
      }
    }

    index.vocabulary = vocab
    index.vocabularyIndex = new Map(vocab.map((w, i) => [w, i]))

    // 计算每条知识的TF-IDF向量
    const N = entries.length
    for (const entry of entries) {
      const tokens = tokenize(entry.content)
      const totalWords = tokens.length || 1
      const tokenFreq = new Map<string, number>()
      for (const t of tokens) {
        tokenFreq.set(t, (tokenFreq.get(t) || 0) + 1)
      }

      const tfidfVec = new Map<number, number>()
      for (const [word, idx] of index.vocabularyIndex) {
        const count = tokenFreq.get(word) || 0
        if (count === 0) continue
        const tf = Math.log(1 + count / totalWords)
        const df = docFreq.get(word) || 1
        const idf = Math.log(N / df)
        tfidfVec.set(idx, tf * idf)
      }
      entry.tfidfVector = tfidfVec
    }

  } catch (err) {
    console.error('[RAG] Knowledge base initialization failed:', err)
    index.isReady = false
  }

  return index
}

// ============================================================
// 知识提取（从现有模块提取硬编码文案）
// ============================================================

function extractKnowledgeFromModules(): KnowledgeEntry[] {
  const entries: KnowledgeEntry[] = []
  let idx = 0

  const addEntry = (
    id: string,
    category: KnowledgeCategory,
    content: string,
    wilderDims: string[],
    metadata: Partial<KnowledgeMetadata>,
  ) => {
    entries.push({
      id,
      category,
      content: content.slice(0, 500),
      contentSummary: content.slice(0, 50),
      tfidfVector: new Map(),
      wilderVector: computeWilderVector(wilderDims),
      metadata: {
        source: metadata.source || 'hardcoded',
        topic: metadata.topic || category,
        domain: metadata.domain || [],
        ageRange: metadata.ageRange || [3, 18],
        evidenceLevel: metadata.evidenceLevel || 'practical',
        wilderDimensions: wilderDims,
        talentTypeKeys: metadata.talentTypeKeys || [],
      },
    })
    idx++
  }

  try {
    // 1. 维度定义知识
    extractDimensionKnowledge(addEntry)

    // 2. 教育学家理论
    extractEducatorKnowledge(addEntry)

    // 3. 家长指导语
    extractParentGuidanceKnowledge(addEntry)

    // 4. 风险预警知识
    extractRiskKnowledge(addEntry)
  } catch (err) {
    console.warn('[RAG] Partial knowledge extraction error:', err)
  }

  return entries
}

/** 从WILDER_DIMENSIONS提取维度知识 */
function extractDimensionKnowledge(addEntry: Function): void {
  const dimMeta: Record<string, { name: string; description: string; keywords: string[]; levels: { high: string; mid: string; low: string } }> = {
    W: {
      name: '好奇心',
      description: '对自然与现象的主动追问',
      keywords: ['提问', '好奇', '观察', '现象', '为什么'],
      levels: { high: '对世界充满强烈好奇，善于发现问题和提出追问', mid: '有一定好奇心，需要适当激发和引导', low: '倾向于接受已知，探索欲和追问习惯待唤醒' },
    },
    I: {
      name: '探究力',
      description: '科学方法与证据推理',
      keywords: ['假设', '对照', '变量', '数据', '测量', '验证', '实验'],
      levels: { high: '善于使用科学方法进行探究和验证', mid: '有基本的探究意识，方法需要指导', low: '探究能力处于基础阶段，需要系统性训练' },
    },
    L: {
      name: '联结力',
      description: '与他人的共情与协作能力',
      keywords: ['合作', '共情', '倾听', '帮助', '协调'],
      levels: { high: '善于与他人合作和共情', mid: '有基本的社交意识，协作能力待发展', low: '偏好独立活动，协作能力需要培养' },
    },
    D: {
      name: '设计力',
      description: '规划执行与创意表达',
      keywords: ['计划', '设计', '创意', '执行', '方案'],
      levels: { high: '善于规划和执行，创意表达丰富', mid: '有一定的规划能力，创意需要引导', low: '执行力和规划能力待培养' },
    },
    E: {
      name: '表达力',
      description: '信息传递与故事讲述',
      keywords: ['表达', '沟通', '故事', '演讲', '传播'],
      levels: { high: '善于表达和沟通，能有效传递信息', mid: '有基本的表达能力，复杂沟通待提升', low: '表达能力处于基础阶段，需要鼓励练习' },
    },
    R: {
      name: '反思力',
      description: '自我觉察与元认知',
      keywords: ['反思', '自省', '总结', '觉察', '思考'],
      levels: { high: '有良好的自我觉察和元认知能力', mid: '有基本的反思意识，深度自省待引导', low: '反思能力待唤醒，需要引导养成总结习惯' },
    },
  }

  for (const [key, dim] of Object.entries(dimMeta)) {
    addEntry(`dim-${key}`, 'dimension',
      `${dim.name}(${key})：${dim.description}。高水平：${dim.levels.high}。中水平：${dim.levels.mid}。低水平：${dim.levels.low}。关键词：${dim.keywords.join('、')}。`,
      [key],
      { source: 'wilderKernel', topic: `维度-${dim.name}`, domain: ['能力评估'], talentTypeKeys: [] },
    )
  }
}

/** 从教育学家理论提取知识 */
function extractEducatorKnowledge(addEntry: Function): void {
  const educators = [
    {
      id: 'montessori', name: '蒙台梭利',
      theory: '自主学习与敏感期教育——儿童拥有内在的学习驱动力，教育应创造适宜的预备环境。核心原则：尊重儿童自然发展节奏、提供准备好的环境、强调感官教育与动手操作、教师角色是观察者而非主导者。',
      dims: ['W', 'I'],
    },
    {
      id: 'dewey', name: '杜威',
      theory: '做中学与民主教育——学习应该发生在真实的问题解决情境中。核心原则：经验是学习的基础、教育即生活、学校即社会、从做中学。',
      dims: ['I', 'D'],
    },
    {
      id: 'piaget', name: '皮亚杰',
      theory: '认知发展阶段理论——儿童通过与环境互动构建知识。核心原则：图式、同化与顺应、认知冲突促进思维发展、具体运算到形式运算。',
      dims: ['I', 'R'],
    },
    {
      id: 'vygotsky', name: '维果茨基',
      theory: '最近发展区与脚手架理论——学习发生在社会互动中。核心原则：最近发展区(ZPD)、脚手架支持、语言是思维的工具、协作学习。',
      dims: ['L', 'I'],
    },
    {
      id: 'gardner', name: '加德纳',
      theory: '多元智能理论——人类拥有多种相对独立的智能。核心原则：语言、逻辑数学、空间、身体动觉、音乐、人际、内省、自然观察等八种智能。',
      dims: ['W', 'L', 'E'],
    },
  ]

  for (const edu of educators) {
    addEntry(`edu-${edu.id}-theory`, 'educator_theory',
      `${edu.name}教育理论：${edu.theory}`,
      edu.dims,
      { source: 'educatorPanel', topic: `${edu.name}-理论`, domain: ['教育理论'], talentTypeKeys: [] },
    )
  }
}

/** 从家长指导语提取知识 */
function extractParentGuidanceKnowledge(addEntry: Function): void {
  const guidanceTemplates: Record<string, { dim: string; encouragement: string; question: string; boundary: string }> = {
    W: {
      dim: '好奇心',
      encouragement: '"我看到你在思考新的想法，这个探索精神很棒！"',
      question: '"你觉得如果...会发生什么？你想不想试试？"',
      boundary: '"好奇很好，但有些东西有危险，我们一起先了解安全规则"',
    },
    I: {
      dim: '探究力',
      encouragement: '"你想到了要用数据验证，这个想法很好！"',
      question: '"你怎么知道这个是对的？有什么方法可以证明？"',
      boundary: '"实验前要一起做好安全准备"',
    },
    L: {
      dim: '联结力',
      encouragement: '"你刚才帮助了同学，这种合作精神很好"',
      question: '"你觉得他为什么那样想？如果换作你会怎么做？"',
      boundary: '"帮助别人很好，但也要先照顾好自己"',
    },
    D: {
      dim: '设计力',
      encouragement: '"你把这个做得很有创意，计划很周到"',
      question: '"如果时间再多一些，你还会做什么改进？"',
      boundary: '"追求完美很好，但也要学会设定阶段性目标"',
    },
    E: {
      dim: '表达力',
      encouragement: '"你的表达很有感染力，让人听得入迷"',
      question: '"你能把刚才的事情讲给爷爷奶奶听吗？"',
      boundary: '"说话的时候也要注意听别人的话"',
    },
    R: {
      dim: '反思力',
      encouragement: '"你能够反思自己的表现，这很了不起"',
      question: '"你觉得今天哪里做得好？哪里可以改进？"',
      boundary: '"反思很好，但不要过度自责，每个人都在成长"',
    },
  }

  for (const [key, g] of Object.entries(guidanceTemplates)) {
    addEntry(`guide-${key}-enc`, 'guidance',
      `鼓励话术（${g.dim}）：${g.encouragement}`,
      [key],
      { source: 'parentGuidance', topic: `${g.dim}-鼓励`, domain: ['家长沟通'], ageRange: [3, 18] },
    )
    addEntry(`guide-${key}-q`, 'guidance',
      `提问话术（${g.dim}）：${g.question}`,
      [key],
      { source: 'parentGuidance', topic: `${g.dim}-提问`, domain: ['家长沟通'], ageRange: [3, 18] },
    )
    addEntry(`guide-${key}-bd`, 'guidance',
      `边界话术（${g.dim}）：${g.boundary}`,
      [key],
      { source: 'parentGuidance', topic: `${g.dim}-边界`, domain: ['家长沟通'], ageRange: [3, 18] },
    )
  }
}

/** 从风险预警引擎提取知识 */
function extractRiskKnowledge(addEntry: Function): void {
  const riskMapping: Record<string, { dim: string; risk: string; mitigation: string }> = {
    W_high: {
      dim: 'W', risk: '好奇心过强可能导致注意力分散、三分钟热度',
      mitigation: '给TA设定"探索时间段"，在一个时间内专注一件事',
    },
    W_low: {
      dim: 'W', risk: '好奇心不足可能导致被动学习、缺乏主动性',
      mitigation: '从TA感兴趣的小事开始，逐步扩大探索范围',
    },
    I_high: {
      dim: 'I', risk: '探究力过强可能让TA陷入细节而忽略大局',
      mitigation: '引导TA学会"够用就好"的探究节奏',
    },
    L_low: {
      dim: 'L', risk: '联结力偏弱可能在团队合作中遇到困难',
      mitigation: '创造低压力的社交场景，让TA在安全环境中练习协作',
    },
    D_high: {
      dim: 'D', risk: '设计力过强可能导致完美主义和执行焦虑',
      mitigation: '教TA"先完成再完美"的理念',
    },
    R_low: {
      dim: 'R', risk: '反思力偏弱可能导致重复犯错、不自知',
      mitigation: '每天10分钟"今日总结"，养成反思习惯',
    },
  }

  for (const [key, r] of Object.entries(riskMapping)) {
    addEntry(`risk-${key}`, 'risk',
      `风险预警（${r.dim}）：${r.risk}。应对策略：${r.mitigation}`,
      [r.dim],
      { source: 'riskWarning', topic: `${r.dim}-风险`, domain: ['风险预警'], evidenceLevel: 'practical' },
    )
  }
}

/** 计算6维WILDER关联度向量 */
function computeWilderVector(dims: string[]): number[] {
  const vector = new Array(6).fill(0)
  const dimMap: Record<string, number> = { W: 0, I: 1, L: 2, D: 3, E: 4, R: 5 }
  for (const d of dims) {
    if (dimMap[d] !== undefined) {
      vector[dimMap[d]] = 1.0
    }
  }
  return vector
}

// ============================================================
// 检索函数
// ============================================================

/**
 * 按Profile向量检索知识
 */
export function retrieveByProfile(
  wilderVector: number[],
  topK: number = 15,
): RetrievalResult[] {
  const kb = getKnowledgeBase()
  if (!kb.isReady || kb.entries.length === 0) return []

  // 截取前6维
  const queryVector = wilderVector.slice(0, 6)

  const results: RetrievalResult[] = []

  for (const entry of kb.entries) {
    // 1. WILDER向量余弦相似度
    const wilderScore = cosineSimilarity6D(queryVector, entry.wilderVector)

    // 2. TF-IDF相似度
    let tfidfScore = 0
    if (entry.tfidfVector.size > 0) {
      // 简化：这里需要一个文本query。对于纯向量检索，我们给一个基础分数
      tfidfScore = 0.5
    }

    // 3. 元数据奖励
    const metadataBonus = 0.1

    const combinedScore = 0.6 * wilderScore + 0.3 * tfidfScore + 0.1 * metadataBonus

    results.push({
      entry,
      score: combinedScore,
      matchType: 'dimensional',
    })
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, topK)
}

/**
 * 按维度和年龄检索
 */
export function retrieveByDimensions(
  topDims: string[],
  bottomDims: string[],
  age: number,
  topK: number = 15,
): RetrievalResult[] {
  const kb = getKnowledgeBase()
  if (!kb.isReady || kb.entries.length === 0) return []

  const results: RetrievalResult[] = []

  for (const entry of kb.entries) {
    const meta = entry.metadata
    let score = 0
    let matchType: RetrievalResult['matchType'] = 'metadata'

    // 维度匹配
    const entryDims = meta.wilderDimensions || []
    let dimMatch = 0
    for (const d of topDims) {
      if (entryDims.includes(d)) dimMatch += 2
    }
    for (const d of bottomDims) {
      if (entryDims.includes(d)) dimMatch += 1
    }
    score = dimMatch / (topDims.length * 2 + bottomDims.length + 1)

    // 年龄过滤
    if (age < meta.ageRange[0] || age > meta.ageRange[1]) {
      score *= 0.3
    }

    if (score > 0) {
      results.push({ entry, score, matchType })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, topK)
}

/**
 * 文本查询检索
 */
export function retrieveByQuery(
  query: string,
  _filters?: Record<string, unknown>,
  topK: number = 15,
): RetrievalResult[] {
  const kb = getKnowledgeBase()
  if (!kb.isReady || kb.entries.length === 0) return []

  const queryTokens = tokenize(query)
  const results: RetrievalResult[] = []

  for (const entry of kb.entries) {
    const entryTokens = entry.tfidfVector
    if (entryTokens.size === 0) continue

    // 计算查询词与知识条目的TF-IDF余弦相似度
    let dotProduct = 0
    let queryMag = 0
    let entryMag = 0

    const queryVec = new Map<number, number>()
    for (const token of queryTokens) {
      const idx = kb.vocabularyIndex.get(token)
      if (idx !== undefined) {
        queryVec.set(idx, (queryVec.get(idx) || 0) + 1)
      }
    }

    // 归一化query向量
    const totalQT = queryTokens.length || 1
    const N = kb.documentCount
    for (const [idx, count] of queryVec) {
      const tf = Math.log(1 + count / totalQT)
      const df = 1 // 简化：假设查询词只出现一次
      const idf = Math.log(N / df)
      queryVec.set(idx, tf * idf)
    }

    for (const [idx, qVal] of queryVec) {
      const eVal = entryTokens.get(idx) || 0
      dotProduct += qVal * eVal
      queryMag += qVal * qVal
    }
    for (const [, eVal] of entryTokens) {
      entryMag += eVal * eVal
    }

    const sim = (queryMag === 0 || entryMag === 0) ? 0 : dotProduct / (Math.sqrt(queryMag) * Math.sqrt(entryMag))

    if (sim > 0) {
      results.push({ entry, score: sim, matchType: 'semantic' })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, topK)
}

// ============================================================
// 上下文构建
// ============================================================

/**
 * 格式化检索结果为LLM prompt可用的上下文块
 */
export function formatContextForPrompt(results: RetrievalResult[]): string {
  if (results.length === 0) return '（暂无参考知识）'

  const lines = ['===参考知识库===']
  results.forEach((r, i) => {
    const source = r.entry.metadata.source
    const dims = r.entry.metadata.wilderDimensions.join('+') || '通用'
    lines.push(`[${i + 1}] 来源：${source} | 关联维度：${dims} | 相关性：${(r.score * 100).toFixed(0)}%`)
    lines.push(`内容：${r.entry.content}`)
    lines.push('')
  })
  lines.push('===知识库结束===')

  return lines.join('\n')
}

/**
 * 构建RAG上下文对象
 */
export function buildRAGContext(results: RetrievalResult[]): RAGContext {
  return {
    retrievedChunks: results.map(r => ({
      source: r.entry.metadata.source,
      content: r.entry.content,
      relevanceScore: r.score,
    })),
    childAge: 10, // 默认值，调用方应覆盖
  }
}

// ============================================================
// 工具函数
// ============================================================

/** 6维余弦相似度 */
function cosineSimilarity6D(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0
  for (let i = 0; i < Math.min(a.length, b.length, 6); i++) {
    dot += (a[i] || 0) * (b[i] || 0)
    magA += (a[i] || 0) * (a[i] || 0)
    magB += (b[i] || 0) * (b[i] || 0)
  }
  if (magA === 0 || magB === 0) return 0
  return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}
