import type { AttentionQuestion, AttentionProfile, AttentionDimension } from '../types/newFeatures'

// ===================================================================
// 专注力/注意力模式评估题库
// 基于注意力5维度模型，6个情景题
// 注意：这不是临床诊断工具，仅作为教育参考
// ===================================================================

export const ATTENTION_QUESTIONS: AttentionQuestion[] = [
  {
    id: 'attn-1',
    scenario: '老师在讲一个新知识点（大约15分钟），孩子通常会：',
    dimension: 'sustained',
    options: [
      { text: '全程认真听讲，偶尔做笔记', score: 3, dimensionWeights: { sustained: 3, selective: 2 } },
      { text: '前10分钟很专注，后面开始走神', score: 2, dimensionWeights: { sustained: 2, selective: 1 } },
      { text: '时不时走神，需要老师提醒', score: 1, dimensionWeights: { sustained: 1, selective: 1 } },
      { text: '很难坚持听完，经常做其他事情', score: 0, dimensionWeights: { sustained: 0, selective: 0 } },
    ],
  },
  {
    id: 'attn-2',
    scenario: '在嘈杂的教室或家里有电视声时，孩子做作业：',
    dimension: 'selective',
    options: [
      { text: '几乎不受干扰，能专注完成', score: 3, dimensionWeights: { selective: 3, sustained: 2 } },
      { text: '会被分心但能很快回到作业', score: 2, dimensionWeights: { selective: 2, sustained: 1 } },
      { text: '容易被吸引，需要安静环境才行', score: 1, dimensionWeights: { selective: 1, impulse: 1 } },
      { text: '一有声音就停下来，很难继续', score: 0, dimensionWeights: { selective: 0, impulse: 0 } },
    ],
  },
  {
    id: 'attn-3',
    scenario: '孩子想要一个喜欢的玩具/零食，但需要等到周末：',
    dimension: 'impulse',
    options: [
      { text: '能耐心等待，期间不怎么提起', score: 3, dimensionWeights: { impulse: 3, working_memory: 1 } },
      { text: '偶尔会问还有几天，但基本能等', score: 2, dimensionWeights: { impulse: 2, working_memory: 1 } },
      { text: '每天都会催好几次，很着急', score: 1, dimensionWeights: { impulse: 1, cognitive_flex: 0 } },
      { text: '完全等不了，会发脾气或想办法提前得到', score: 0, dimensionWeights: { impulse: 0, cognitive_flex: 0 } },
    ],
  },
  {
    id: 'attn-4',
    scenario: '老师布置了3个步骤的任务（先读题→列算式→检查），孩子会：',
    dimension: 'working_memory',
    options: [
      { text: '按顺序完成每个步骤，不遗漏', score: 3, dimensionWeights: { working_memory: 3, sustained: 1 } },
      { text: '记住大部分，偶尔跳过一步', score: 2, dimensionWeights: { working_memory: 2, sustained: 1 } },
      { text: '经常忘掉后面的步骤，只完成第一步', score: 1, dimensionWeights: { working_memory: 1, sustained: 0 } },
      { text: '听完就忘了，需要反复提醒', score: 0, dimensionWeights: { working_memory: 0, sustained: 0 } },
    ],
  },
  {
    id: 'attn-5',
    scenario: '原来计划好周末去公园，突然下雨改为室内活动，孩子的反应：',
    dimension: 'cognitive_flex',
    options: [
      { text: '很快接受，开心地做室内活动', score: 3, dimensionWeights: { cognitive_flex: 3, impulse: 2 } },
      { text: '有点失望但能适应新计划', score: 2, dimensionWeights: { cognitive_flex: 2, impulse: 1 } },
      { text: '不太高兴，需要较长时间调整', score: 1, dimensionWeights: { cognitive_flex: 1, impulse: 1 } },
      { text: '非常不开心，坚持要去公园或发脾气', score: 0, dimensionWeights: { cognitive_flex: 0, impulse: 0 } },
    ],
  },
  {
    id: 'attn-6',
    scenario: '孩子遇到一道难题做不出来时：',
    dimension: 'cognitive_flex',
    options: [
      { text: '会换个思路试试，或者先跳过回头做', score: 3, dimensionWeights: { cognitive_flex: 3, working_memory: 2, sustained: 1 } },
      { text: '会卡住一会但能自己想办法', score: 2, dimensionWeights: { cognitive_flex: 2, working_memory: 1, sustained: 1 } },
      { text: '一直用同一个方法反复尝试，不会变通', score: 1, dimensionWeights: { cognitive_flex: 1, sustained: 1, impulse: 1 } },
      { text: '直接放弃或发脾气', score: 0, dimensionWeights: { cognitive_flex: 0, impulse: 0, sustained: 0 } },
    ],
  },
]

const DIMENSION_META: Record<string, { name: string; nameEn: string; icon: string }> = {
  sustained: { name: '持续注意', nameEn: 'Sustained Attention', icon: '⏱️' },
  selective: { name: '选择注意', nameEn: 'Selective Attention', icon: '🎯' },
  impulse: { name: '冲动控制', nameEn: 'Impulse Control', icon: '🛡️' },
  working_memory: { name: '工作记忆', nameEn: 'Working Memory', icon: '🧠' },
  cognitive_flex: { name: '认知灵活性', nameEn: 'Cognitive Flexibility', icon: '🔄' },
}

const STRATEGIES: Record<string, string[]> = {
  sustained: [
    '采用"番茄工作法"：15分钟专注+5分钟休息',
    '任务前设置明确目标："完成这3道题就休息"',
    '利用感兴趣的内容作为"启动仪式"增加投入感',
  ],
  selective: [
    '创造固定的"学习角"，减少环境干扰',
    '使用耳塞或白噪音帮助集中注意',
    '练习"注意力训练游戏"如找不同、舒尔特方格',
  ],
  impulse: [
    '教孩子"停-想-做"三步法：冲动来时先停3秒',
    '设置合理的延迟奖励机制增强自控',
    '通过棋类游戏训练等待和策略思考',
  ],
  working_memory: [
    '教孩子用"复述法"：重复指令增强记忆',
    '将复杂任务拆解为简单的小步骤清单',
    '玩记忆类游戏：接龙、Simon Says等',
  ],
  cognitive_flex: [
    '鼓励"还有别的方法吗？"的思考习惯',
    '提前告知计划变更，给予缓冲时间',
    '玩需要策略切换的游戏如UNO、象棋',
  ],
}

export function calculateAttentionProfile(
  responses: Record<string, number> // questionId → selectedOptionIndex
): AttentionProfile {
  const dimScores: Record<string, number[]> = {
    sustained: [], selective: [], impulse: [], working_memory: [], cognitive_flex: [],
  }

  // 收集每个维度的得分
  for (const q of ATTENTION_QUESTIONS) {
    const optIdx = responses[q.id]
    if (optIdx === undefined) continue
    const opt = q.options[optIdx]
    if (!opt) continue
    for (const [dim, weight] of Object.entries(opt.dimensionWeights)) {
      if (dimScores[dim]) dimScores[dim].push(weight)
    }
  }

  // 计算每个维度平均分并转换为0-100
  const dimensions: AttentionDimension[] = Object.entries(dimScores).map(([dimId, scores]) => {
    const avg = scores.length > 0 ? scores.reduce((s, v) => s + v, 0) / scores.length : 1.5
    const normalized = Math.round((avg / 3) * 100)
    const meta = DIMENSION_META[dimId] || { name: dimId, nameEn: dimId, icon: '📊' }
    
    const level: 'strong' | 'developing' | 'needs-support' =
      normalized >= 70 ? 'strong' : normalized >= 40 ? 'developing' : 'needs-support'

    return {
      id: dimId,
      name: meta.name,
      nameEn: meta.nameEn,
      score: normalized,
      level,
      description: level === 'strong' ? `${meta.name}表现良好，属于优势领域` :
                    level === 'developing' ? `${meta.name}处于发展中，有进步空间` :
                    `${meta.name}需要重点关注和支持`,
      strategies: (STRATEGIES[dimId] || []).slice(0, level === 'needs-support' ? 3 : 2),
    }
  })

  // 整体水平
  const avgScore = dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length
  const needsSupportCount = dimensions.filter(d => d.level === 'needs-support').length
  const anyVeryLow = dimensions.some(d => d.score < 30)

  const overallLevel: 'green' | 'yellow' | 'red' =
    anyVeryLow || needsSupportCount >= 3 ? 'red' :
    needsSupportCount >= 1 || avgScore < 55 ? 'yellow' : 'green'

  const summary = overallLevel === 'green'
    ? '孩子的注意力模式整体良好，各维度发展均衡。'
    : overallLevel === 'yellow'
    ? `孩子在${dimensions.filter(d => d.level === 'needs-support').map(d => d.name).join('、')}方面可以进一步提升。`
    : '建议关注孩子的注意力发展，部分维度需要重点支持。如持续存在困难，建议咨询专业人士。'

  return {
    dimensions,
    overallLevel,
    summary,
    disclaimer: '本评估仅作为家庭教育参考，不构成任何医学或临床诊断。如孩子在学习和生活中持续遇到注意力困难，建议寻求专业儿童发展评估。',
    recommendations: dimensions
      .filter(d => d.level !== 'strong')
      .flatMap(d => d.strategies.slice(0, 1))
      .slice(0, 5),
  }
}

// 为ReportPage使用：根据WILDER分数自动推算注意力模式
export function estimateAttentionFromWilder(
  wilderScores: Record<string, number>,
  efAnalysis?: { inhibition: { level: string; score: number }; flexibility: { level: string; score: number } }
): AttentionProfile {
  // 用WILDER分数 + 执行功能数据模拟注意力评估
  const base = (wilderScores.R || 70) / 100 // 反思力与注意力相关

  const dimMap: Record<string, number> = {
    sustained: Math.min(100, Math.round((wilderScores.I || 70) * 0.6 + (wilderScores.R || 70) * 0.4)),
    selective: Math.min(100, Math.round((wilderScores.D || 70) * 0.5 + (wilderScores.R || 70) * 0.5)),
    impulse: efAnalysis ? Math.round(efAnalysis.inhibition.score / 3 * 100) : Math.min(100, Math.round((wilderScores.R || 70) * 0.7 + base * 30)),
    working_memory: Math.min(100, Math.round((wilderScores.I || 70) * 0.4 + (wilderScores.L || 70) * 0.3 + (wilderScores.D || 70) * 0.3)),
    cognitive_flex: efAnalysis ? Math.round(efAnalysis.flexibility.score / 3 * 100) : Math.min(100, Math.round((wilderScores.W || 70) * 0.4 + (wilderScores.L || 70) * 0.3 + base * 30)),
  }

  const dimensions: AttentionDimension[] = Object.entries(dimMap).map(([dimId, score]) => {
    const meta = DIMENSION_META[dimId] || { name: dimId, nameEn: dimId, icon: '📊' }
    const level: 'strong' | 'developing' | 'needs-support' =
      score >= 70 ? 'strong' : score >= 40 ? 'developing' : 'needs-support'
    return {
      id: dimId, name: meta.name, nameEn: meta.nameEn, score, level,
      description: level === 'strong' ? `${meta.name}表现良好` : level === 'developing' ? `${meta.name}有进步空间` : `${meta.name}需要关注`,
      strategies: (STRATEGIES[dimId] || []).slice(0, level === 'needs-support' ? 3 : 2),
    }
  })

  const needsSupportCount = dimensions.filter(d => d.level === 'needs-support').length
  const anyVeryLow = dimensions.some(d => d.score < 30)
  const overallLevel: 'green' | 'yellow' | 'red' =
    anyVeryLow || needsSupportCount >= 3 ? 'red' : needsSupportCount >= 1 ? 'yellow' : 'green'

  return {
    dimensions, overallLevel,
    summary: overallLevel === 'green' ? '注意力模式整体良好。' : overallLevel === 'yellow' ? '部分维度有提升空间。' : '部分维度需要重点关注。',
    disclaimer: '本评估基于WILDER能力模型推算，仅作为家庭教育参考，不构成任何医学或临床诊断。',
    recommendations: dimensions.filter(d => d.level !== 'strong').flatMap(d => d.strategies.slice(0, 1)).slice(0, 5),
  }
}
