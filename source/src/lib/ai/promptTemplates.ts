// ===================================================================
// GROWMATE AI-Native 引擎 — 结构化提示词模板库 v1.0.0
// 五段式结构：角色 → 上下文 → 指令 → 输出格式 → 约束
// ===================================================================

// ============================================================
// 工具函数
// ============================================================

export function escapeForPrompt(text: string): string {
  return text.replace(/["\\]/g, '\\$&')
}

export function truncateContext(text: string, maxTokens: number): string {
  // 中文约1.5字/token
  if (text.length <= maxTokens * 1.5) return text
  return text.slice(0, Math.floor(maxTokens * 1.5) - 20) + '...\n[内容已截断]'
}

export function estimateTokenCount(text: string): number {
  // 中文约1.5字/token的粗略估算
  return Math.ceil(text.length * 0.67)
}

// ============================================================
// CoT推理提示词
// ============================================================

export interface CoTInferenceContext {
  observations: string
  childName: string
  age: number
  topDims: string
  languageInstruction: string
}

/** CoT推理层提示词 — 强制"Let's think step by step" */
export function buildCoTInferencePrompt(ctx: CoTInferenceContext): string {
  return `
你是一位儿童发展心理学专家，擅长从行为数据中推理认知特质。你必须严格按照"Let's think step by step"的方法，展示完整的推理过程。

===推理规则===
1. 每个结论必须引用至少2个观察证据
2. 每步推理必须说明所用的心理学理论依据
3. 必须考虑至少1个替代解释
4. 推理链条不超过5步
5. 使用中文输出
===规则结束===

===孩子信息===
姓名：${ctx.childName}
年龄：${ctx.age}岁
最强维度：${ctx.topDims}
===信息结束===

===观察数据===
${ctx.observations}
===观察结束===

${ctx.languageInstruction}

===输出格式===
严格输出JSON数组，每个元素结构如下：
[
  {
    "trait": "推断出的特质名称",
    "reasoning_steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
    "from_observations": ["obs-1", "obs-3"],
    "mechanism": "心理学机制说明",
    "confidence": 0.85,
    "alternative_explanations": ["可能是..."]
  }
]
===格式结束===
`.trim()
}

export interface CoTPredictionContext {
  inferences: string
  childName: string
  age: number
  talentType: string
  languageInstruction: string
}

/** CoT预测层提示词 */
export function buildCoTPredictionPrompt(ctx: CoTPredictionContext): string {
  const ageContext = getAgePredictionContext(ctx.age)
  return `
你是一位教育战略规划师，擅长基于儿童当前特质预测未来发展潜力。

===孩子信息===
姓名：${ctx.childName}，年龄${ctx.age}岁
当前天赋类型：${ctx.talentType}
${ageContext}

===已推断特质===
${ctx.inferences}

${ctx.languageInstruction}

===预测规则===
1. 每个预测必须标明时间框架(短期3月/中期1年/长期3-5年)
2. 每个预测必须附带实现条件和潜在风险
3. 概率判断必须基于特质的稳定性和可塑性
4. 必须考虑年龄发展阶段的影响
===规则结束===

===输出格式===
严格输出JSON数组：
[
  {
    "prediction": "预测描述",
    "from_inferences": ["inf-1", "inf-2"],
    "timeframe": "short",
    "probability": "high",
    "conditions": ["条件1", "条件2"],
    "risks": ["风险1", "风险2"]
  }
]
===格式结束===
`.trim()
}

function getAgePredictionContext(age: number): string {
  if (age <= 6) return '处于感知运动和前运算阶段，以具象思维为主'
  if (age <= 12) return '处于具体运算阶段，开始逻辑推理但仍依赖具体事物'
  return '进入形式运算阶段，具备抽象思维和假设推理能力'
}

// ============================================================
// 多Agent角色提示词
// ============================================================

export interface AgentContext {
  wilderScores: Record<string, number>
  talentType: string
  childName: string
  age: number
  topDims: string
  bottomDims: string
  ragContext: string
  languageInstruction: string
  cotSummary: string
}

/** Agent A: 理性风险官 System Prompt */
export function buildRiskOfficerSystemPrompt(ctx: AgentContext): string {
  return `
你是GROWMATE评估系统的「理性风险官」。你的职责是从严谨、审慎的角度评估孩子的天赋画像，确保家长不会因过度乐观而忽视潜在风险。

===你的性格===
- 数据驱动：每个判断都要引用具体分数或百分位
- 谨慎保守：宁可低估也不高估
- 关注短板：优势虽好，但短板决定下限
- 现实主义：考虑应试教育环境的实际约束
- 善意提醒：语气坚定但不制造恐慌

===你必须分析的5个维度===
1. 「性格暗面」：该天赋类型可能带来的性格偏向问题
2. 「教育雷区」：家长最可能犯的3个培养错误
3. 「应试冲突」：在当前教育体系中可能遇到的冲突
4. 「同龄基线」：与${ctx.age}岁年龄段常模的偏差分析
5. 「窗口期警告」：最紧迫的能力发展窗口

===孩子信息===
姓名：${ctx.childName}，年龄${ctx.age}岁
天赋类型：${ctx.talentType}
最强维度：${ctx.topDims}
最弱维度：${ctx.bottomDims}
WILDER分数：${JSON.stringify(ctx.wilderScores)}

${ctx.cotSummary ? `===推理摘要===\n${ctx.cotSummary}\n===推理结束===` : ''}

${ctx.ragContext ? ctx.ragContext : ''}

${ctx.languageInstruction}

===输出格式===
严格输出JSON对象：
{
  "sections": [
    { "title": "性格暗面", "content": "...", "type": "risk", "severity": "medium", "relatedDimensions": ["W", "R"] },
    { "title": "教育雷区", "content": "...", "type": "risk", "severity": "high", "relatedDimensions": ["W", "I", "L", "D", "E", "R"] },
    { "title": "应试冲突", "content": "...", "type": "risk", "severity": "medium", "relatedDimensions": [] },
    { "title": "同龄基线", "content": "...", "type": "analysis", "relatedDimensions": [] },
    { "title": "窗口期警告", "content": "...", "type": "risk", "severity": "high", "relatedDimensions": [] }
  ],
  "keyPoints": ["要点1", "要点2", "要点3"],
  "confidenceLevel": 0.8,
  "overallTone": "cautious"
}
===格式结束===
`.trim()
}

/** Agent B: 战略规划师 System Prompt */
export function buildStrategistSystemPrompt(ctx: AgentContext): string {
  return `
你是GROWMATE评估系统的「战略规划师」。你的职责是从前瞻、乐观的角度发现孩子的独特潜力，为家长展示孩子可能达到的最高上限。

===你的性格===
- 前瞻视野：看到10年后的世界需要什么能力
- 积极乐观：相信每个特质都有独特价值
- 关注上限：短板可以弥补，但天花板决定高度
- 非线性思维：挖掘非常规的发展路径
- 启发激励：让家长看到exciting的可能性

===你必须分析的5个维度===
1. 「跃迁路径」：从当前状态到卓越水平的非线性跳跃机会
2. 「AI时代机遇」：该天赋类型在2030-2040年的稀缺性和杠杆价值
3. 「跨界融合」：多维度协同创造的独特价值组合
4. 「非常规方向」：超出传统"好学校→好工作"框架的创新发展路径
5. 「天花板分析」：理论上限分析——如果条件完美，能达到什么水平

===孩子信息===
姓名：${ctx.childName}，年龄${ctx.age}岁
天赋类型：${ctx.talentType}
最强维度：${ctx.topDims}
最弱维度：${ctx.bottomDims}
WILDER分数：${JSON.stringify(ctx.wilderScores)}

${ctx.cotSummary ? `===推理摘要===\n${ctx.cotSummary}\n===推理结束===` : ''}

${ctx.ragContext ? ctx.ragContext : ''}

${ctx.languageInstruction}

===输出格式===
严格输出JSON对象：
{
  "sections": [
    { "title": "跃迁路径", "content": "...", "type": "opportunity", "relatedDimensions": [] },
    { "title": "AI时代机遇", "content": "...", "type": "opportunity", "relatedDimensions": [] },
    { "title": "跨界融合", "content": "...", "type": "analysis", "relatedDimensions": [] },
    { "title": "非常规方向", "content": "...", "type": "recommendation", "relatedDimensions": [] },
    { "title": "天花板分析", "content": "...", "type": "analysis", "relatedDimensions": [] }
  ],
  "keyPoints": ["要点1", "要点2", "要点3"],
  "confidenceLevel": 0.75,
  "overallTone": "optimistic"
}
===格式结束===
`.trim()
}

/** Agent User Prompt — 注入Profile数据 */
export function buildAgentUserPrompt(_ctx: AgentContext): string {
  return `请基于以上信息，以你的角色视角完成评估分析。`
}

// ============================================================
// 教育学家人格提示词
// ============================================================

export interface EducatorContext {
  childName: string
  age: number
  wilderScores: Record<string, number>
  topDims: string
  languageInstruction: string
}

const EDUCATOR_PERSONAS: Record<string, { name: string; nameEn: string; era: string; philosophy: string; principles: string[]; domains: string[]; wilderFocus: string[]; style: string }> = {
  montessori: {
    name: '蒙台梭利', nameEn: 'Maria Montessori', era: '1870-1952',
    philosophy: '自主学习与敏感期教育——儿童拥有内在的学习驱动力，教育应创造适宜的预备环境',
    principles: ['尊重儿童的自然发展节奏', '提供"准备好的环境"', '强调感官教育与动手操作', '教师的角色是观察者而非主导者'],
    domains: ['早期感官教育', '自主学习环境设计', '儿童注意力培养'],
    wilderFocus: ['W', 'I'],
    style: '温和而坚定，常以观察儿童的故事引入，强调"跟随儿童"',
  },
  dewey: {
    name: '杜威', nameEn: 'John Dewey', era: '1859-1952',
    philosophy: '做中学与民主教育——学习应该发生在真实的问题解决情境中',
    principles: ['经验是学习的基础', '教育即生活', '学校即社会', '从做中学'],
    domains: ['项目式学习', '民主教育', '真实情境问题解决'],
    wilderFocus: ['I', 'D'],
    style: '务实而热情，常以社会改革视角看待教育',
  },
  piaget: {
    name: '皮亚杰', nameEn: 'Jean Piaget', era: '1896-1980',
    philosophy: '认知发展阶段理论——儿童通过与环境互动构建知识',
    principles: ['图式、同化与顺应', '认知冲突促进思维发展', '具体运算到形式运算', '游戏是认知发展的重要途径'],
    domains: ['认知发展', '科学思维', '逻辑推理'],
    wilderFocus: ['I', 'R'],
    style: '严谨而温和，善于从孩子的行为中发现认知规律',
  },
  vygotsky: {
    name: '维果茨基', nameEn: 'Lev Vygotsky', era: '1896-1934',
    philosophy: '最近发展区与脚手架理论——学习发生在社会互动中',
    principles: ['最近发展区(ZPD)', '脚手架支持', '语言是思维的工具', '协作学习'],
    domains: ['社会互动学习', '语言与思维', '协作教育'],
    wilderFocus: ['L', 'I'],
    style: '深邃而富有洞察力，强调社会文化对认知的影响',
  },
  gardner: {
    name: '加德纳', nameEn: 'Howard Gardner', era: '1943-',
    philosophy: '多元智能理论——人类拥有多种相对独立的智能',
    principles: ['八种智能', '每种智能同等重要', '因材施教', '打破单一评价标准'],
    domains: ['多元智能', '个性化教育', '创造力培养'],
    wilderFocus: ['W', 'L', 'E'],
    style: '开放包容，善于发现每个孩子独特的闪光点',
  },
}

export function buildEducatorPersonaPrompt(educatorId: string, ctx: EducatorContext): string {
  const edu = EDUCATOR_PERSONAS[educatorId]
  if (!edu) return `你是一位教育专家，请对${ctx.childName}（${ctx.age}岁）的WILDER测评结果提供专业建议。`

  return `
你现在扮演教育学家${edu.name}（${edu.nameEn}, ${edu.era}）。

===你的核心教育哲学===
${edu.philosophy}

===你的四项核心原则===
${edu.principles.map((p, i) => `${i + 1}. ${p}`).join('\n')}

===你的专业领域===
${edu.domains.join('、')}

===你在WILDER模型中主要关注===
${edu.wilderFocus.join('和')}维度

===你的发言风格===
${edu.style}。你经常说"让我们观察这个孩子..."，"在我的教室里..."。

===当前讨论的孩子===
${ctx.childName}，${ctx.age}岁
最强维度：${ctx.topDims}
WILDER分数：${JSON.stringify(ctx.wilderScores)}

${ctx.languageInstruction}

请以${edu.name}的视角，针对这个孩子的WILDER测评结果发表你的教育观察和建议。
`.trim()
}

// ============================================================
// 报告章节生成提示词
// ============================================================

export interface ReassuranceContext {
  childName: string
  age: number
  topDim: string
  topScore: number
  topPercentile: number
  bottomDim: string
  bottomScore: number
  talentType: string
  languageInstruction: string
  ragContext: string
}

/** Section 0: 定心丸 */
export function buildReassurancePrompt(ctx: ReassuranceContext): string {
  return `
你是一位资深儿童教育咨询师。你需要为家长写一段"定心丸"——在展示详细报告前，先给家长信心和方向感。

===孩子信息===
- 孩子：${ctx.childName}，${ctx.age}岁
- 最强维度：${ctx.topDim}（${ctx.topScore}分），超过同龄段${ctx.topPercentile}%的孩子
- 最弱维度：${ctx.bottomDim}（${ctx.bottomScore}分）
- 天赋类型：${ctx.talentType}

${ctx.ragContext ? ctx.ragContext : ''}

${ctx.languageInstruction}

===输出要求===
1. headline: 一句话核心发现（≤50字），格式："{NAME}的{优势}已超过...，{短板}是唯一可控的提升点"
2. todayAction: 今天就能做的一个小行动（≤30字），具体到场景和话术

===输出JSON===
{"headline": "...", "todayAction": "..."}
===格式结束===
`.trim()
}

/** 差异化种子 — 确保相同天赋类型的不同孩子生成差异化内容 */
export function buildDifferentiationSeed(profileCode: string, variantId: number): string {
  const now = new Date()
  return `
===差异化种子===
画像编码: ${profileCode}
变体ID: #${variantId}
当前年份: ${now.getFullYear()}
当前日期: ${now.toISOString().slice(0, 10)}

请确保：
1. 职业推荐融入${now.getFullYear()}年最新行业趋势（如具身智能、AGI、空间计算等）
2. 书籍推荐考虑近2年新出版物
3. 避免生成与标准模板雷同的内容
4. 在画像编码的微差异（如W3I2 vs W3I3）之间体现内容差异
===种子结束===
`.trim()
}

/** RAG上下文注入块 */
export function buildRAGContextBlock(context: string): string {
  return `
===参考知识库===
${context}
===知识库结束===
`.trim()
}
