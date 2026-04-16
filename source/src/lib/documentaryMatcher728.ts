// ===================================================================
// 728学习类型×纪录片精准匹配引擎 v1.0
// 基于WILDER六维度×3档(H/M/L)=729画像 精准匹配纪录片
// 匹配维度：画像编码 + 年龄段 + 潜能类型 → 个性化纪录片清单
// ===================================================================

import type { Documentary } from './documentaryDatabase'
import { getDocumentariesByWilder } from './documentaryDatabase'

// ========== 类型定义 ==========

export type AgeGroup = 'lower-primary' | 'upper-primary' | 'middle-school' | 'high-school'
export type WilderLevel = 'H' | 'M' | 'L'
export type WilderDim = 'W' | 'I' | 'L' | 'D' | 'E' | 'R'

export interface DocMatchResult728 {
  profileCode: string
  ageGroup: AgeGroup
  talentKey: string
  coreRecommendations: MatchedDoc[]
  growthRecommendations: MatchedDoc[]
  explorationRecommendations: MatchedDoc[]
  familyWatchRecommendations: MatchedDoc[]
  matchExplanation: string
}

export interface MatchedDoc {
  documentary: Documentary
  matchScore: number
  matchReasons: string[]
  watchStrategy: string
  parentGuide: string
}

// ========== 常量 ==========

const CATEGORY_DIM_AFFINITY: Record<string, Record<WilderDim, number>> = {
  science:    { W: 0.35, I: 0.30, L: 0.05, D: 0.10, E: 0.05, R: 0.15 },
  nature:     { W: 0.30, I: 0.25, L: 0.10, D: 0.05, E: 0.10, R: 0.20 },
  history:    { W: 0.15, I: 0.20, L: 0.20, D: 0.10, E: 0.15, R: 0.20 },
  technology: { W: 0.25, I: 0.25, L: 0.05, D: 0.30, E: 0.05, R: 0.10 },
  art:        { W: 0.15, I: 0.05, L: 0.15, D: 0.20, E: 0.30, R: 0.15 },
  society:    { W: 0.10, I: 0.10, L: 0.30, D: 0.10, E: 0.20, R: 0.20 },
  geography:  { W: 0.30, I: 0.20, L: 0.10, D: 0.15, E: 0.10, R: 0.15 },
  biography:  { W: 0.15, I: 0.15, L: 0.15, D: 0.15, E: 0.20, R: 0.20 },
}

const LEVEL_SCORE: Record<WilderLevel, number> = { H: 3, M: 2, L: 1 }

const DIM_NAMES: Record<string, string> = {
  W: '好奇心', I: '探究力', L: '连接力', D: '设计力', E: '表达力', R: '反思力',
}
function getDimName(dim: string): string { return DIM_NAMES[dim] || dim }

export function getAgeGroup(age: number): AgeGroup {
  if (age <= 9) return 'lower-primary'
  if (age <= 12) return 'upper-primary'
  if (age <= 15) return 'middle-school'
  return 'high-school'
}

const AGE_GROUP_TRAITS: Record<AgeGroup, { attentionSpan: string; cognitiveLevel: string; watchTip: string }> = {
  'lower-primary': { attentionSpan: '15-25分钟', cognitiveLevel: '具象思维为主，喜欢视觉冲击和动物角色', watchTip: '建议分段观看，每次1-2集，配合简单提问互动' },
  'upper-primary': { attentionSpan: '30-45分钟', cognitiveLevel: '开始抽象思维，能理解因果关系和科学概念', watchTip: '可连续观看2-3集，鼓励做观看笔记或画思维导图' },
  'middle-school': { attentionSpan: '45-60分钟', cognitiveLevel: '抽象思维成熟，能进行假设-验证推理', watchTip: '鼓励批判性观看，可布置观后迷你研究任务' },
  'high-school': { attentionSpan: '60分钟+', cognitiveLevel: '元认知发展，能进行跨学科联想和深度分析', watchTip: '推荐做深度笔记、撰写观后短文或开展主题讨论' },
}

// ========== 核心算法 ==========

export function parseProfileCode(profileCode: string): Record<WilderDim, WilderLevel> {
  const cleaned = profileCode.replace('-', '')
  const dims: WilderDim[] = ['W', 'I', 'L', 'D', 'E', 'R']
  const result = {} as Record<WilderDim, WilderLevel>
  dims.forEach((d, i) => { result[d] = (cleaned[i] as WilderLevel) || 'M' })
  return result
}

// 维度多样性计算：覆盖多个维度的纪录片获得额外奖励
function calcDiversityBonus(docDims: WilderDim[], levels: Record<WilderDim, WilderLevel>): number {
  if (docDims.length <= 1) return 0
  const hi = (Object.keys(levels) as WilderDim[]).filter(d => levels[d] === 'H')
  const lo = (Object.keys(levels) as WilderDim[]).filter(d => levels[d] === 'L')
  // 同时覆盖优势和弱势维度的纪录片获得更高奖励
  const coversHi = docDims.some(d => hi.includes(d))
  const coversLo = docDims.some(d => lo.includes(d))
  if (coversHi && coversLo) return 8
  if (docDims.length >= 3) return 5
  return 2
}

// 年龄适配度计算
function calcAgeBonus(doc: Documentary, age: number): number {
  const range = doc.ageRange
  const [min, max] = range.split('-').map(s => parseInt(s.replace('+', '')))
  if (range.includes('+')) return age >= min ? 5 : -10
  const mid = (min + (max || min + 2)) / 2
  const diff = Math.abs(age - mid)
  if (diff <= 1) return 5
  if (diff <= 2) return 2
  return 0
}

function calcMatchScore(doc: Documentary, levels: Record<WilderDim, WilderLevel>, pcts?: Record<string, number>, age?: number): number {
  const aff = CATEGORY_DIM_AFFINITY[doc.category]
  if (!aff) return 50
  const docDims = doc.wilderDimensions as WilderDim[]
  let s = 0
  // 1. 维度-画像匹配基础分 (最高40分)
  let dm = 0
  docDims.forEach(d => { dm += (LEVEL_SCORE[levels[d]] || 2) * (aff[d] || 0.1) })
  s += Math.min(40, dm * 15)
  // 2. 优势维度匹配奖励 (最高25分)
  const hi = (Object.keys(levels) as WilderDim[]).filter(d => levels[d] === 'H')
  s += (docDims.filter(d => hi.includes(d)).length / Math.max(docDims.length, 1)) * 25
  // 3. 评分加成 (最高12分)
  s += Math.min(12, (doc.rating / 10) * 12)
  // 4. 维度百分比加成 (最高10分)
  if (pcts) { let b = 0; docDims.forEach(d => { b += ((pcts[d] || 50) / 100) * (aff[d] || 0.1) }); s += Math.min(10, b * 15) }
  // 5. 维度多样性奖励 (最高8分)
  s += calcDiversityBonus(docDims, levels)
  // 6. 年龄适配度奖励 (最高5分)
  if (age) s += calcAgeBonus(doc, age)
  return Math.min(100, Math.round(s))
}

function makeReasons(doc: Documentary, levels: Record<WilderDim, WilderLevel>): string[] {
  const r: string[] = []
  const hi = (Object.keys(levels) as WilderDim[]).filter(d => levels[d] === 'H')
  const m = (doc.wilderDimensions as WilderDim[]).filter(d => hi.includes(d))
  if (m.length > 0) r.push(`强化${m.map(getDimName).join('+')}核心优势`)
  if (doc.rating >= 9.0) r.push(`高口碑佳作（${doc.rating}分）`)
  if (doc.educationalValue?.length > 0) r.push(`教育价值：${doc.educationalValue.slice(0, 2).join('、')}`)
  return r
}

function makeWatchStrategy(doc: Documentary, levels: Record<WilderDim, WilderLevel>, ag: AgeGroup): string {
  const t = AGE_GROUP_TRAITS[ag]
  const hi = (Object.keys(levels) as WilderDim[]).filter(d => levels[d] === 'H')
  const m = (doc.wilderDimensions as WilderDim[]).filter(d => hi.includes(d as WilderDim))
  if (m.length >= 2) return `与核心优势高度契合。${t.watchTip}。`
  if (m.length === 1) return `可强化${getDimName(m[0])}维度。${t.watchTip}。`
  return `可拓展弱势维度视野。${t.watchTip}。`
}

function makeParentGuide(ag: AgeGroup): string {
  const g: Record<AgeGroup, string> = {
    'lower-primary': '观前：用简单问题激发好奇心；观中：关注"哇"时刻及时回应；观后：让孩子画出最喜欢的画面',
    'upper-primary': '观前：让孩子预测内容；观中：鼓励提出"为什么"；观后：一起查资料做延伸',
    'middle-school': '观前：分享你的看法；观中：讨论不同观点和证据；观后：鼓励写观后感或做小课题',
    'high-school': '观前：作为平等讨论者参与；观中：注意独到见解给予认可；观后：讨论局限性，批判思考',
  }
  return g[ag]
}

// ========== 主函数 ==========

export function matchDocumentaries728(
  profileCode: string, age: number, talentKey: string,
  wilderPcts?: Record<string, number>, topDims?: string[]
): DocMatchResult728 {
  const levels = parseProfileCode(profileCode)
  const ageGroup = getAgeGroup(age)
  const eDims = topDims || (Object.keys(levels) as WilderDim[]).filter(d => levels[d] === 'H').slice(0, 2)
  if (eDims.length === 0) { eDims.push('W', 'I') }

  const allDocs = getDocumentariesByWilder(eDims as ('W'|'I'|'L'|'D'|'E'|'R')[], age)
  const scored: MatchedDoc[] = allDocs.map(doc => ({
    documentary: doc, matchScore: calcMatchScore(doc, levels, wilderPcts, age),
    matchReasons: makeReasons(doc, levels), watchStrategy: makeWatchStrategy(doc, levels, ageGroup),
    parentGuide: makeParentGuide(ageGroup),
  })).sort((a, b) => b.matchScore - a.matchScore)

  const hi = (Object.keys(levels) as WilderDim[]).filter(d => levels[d] === 'H')
  const lo = (Object.keys(levels) as WilderDim[]).filter(d => levels[d] === 'L')
  const mi = (Object.keys(levels) as WilderDim[]).filter(d => levels[d] === 'M')

  const core = scored.slice(0, 5)
  const growth = scored.filter(s => (s.documentary.wilderDimensions as WilderDim[]).some(d => lo.includes(d))).slice(0, 3)
    .map(s => ({ ...s, matchReasons: [`帮助提升：${lo.map(getDimName).join('、')}`, ...s.matchReasons.slice(0, 1)] }))
  const explore = scored.filter(s => (s.documentary.wilderDimensions as WilderDim[]).some(d => mi.includes(d)) && !core.includes(s)).slice(0, 3)
  const family = scored.filter(s => s.documentary.rating >= 9.0 && s.matchScore >= 60).slice(0, 3)
    .map(s => ({ ...s, watchStrategy: `亲子共看推荐：${AGE_GROUP_TRAITS[ageGroup].watchTip}` }))

  const t = AGE_GROUP_TRAITS[ageGroup]
  const al = ageGroup === 'lower-primary' ? '小学低年级' : ageGroup === 'upper-primary' ? '小学高年级' : ageGroup === 'middle-school' ? '初中' : '高中'
  const exp = `基于「${talentKey}」潜能类型和${hi.map(getDimName).join('+')}优势画像（${al}阶段），精选纪录片清单。注意力跨度约${t.attentionSpan}，${t.cognitiveLevel}。`

  return { profileCode, ageGroup, talentKey, coreRecommendations: core, growthRecommendations: growth, explorationRecommendations: explore, familyWatchRecommendations: family, matchExplanation: exp }
}

export function getQuickDocTitles(profileCode: string, age: number): string[] {
  return matchDocumentaries728(profileCode, age, 'auto').coreRecommendations.map(r => r.documentary.title)
}

export function getGrowthDocumentaries(profileCode: string, age: number): MatchedDoc[] {
  return matchDocumentaries728(profileCode, age, 'auto').growthRecommendations
}

export function getAgeWatchingGuide(age: number): typeof AGE_GROUP_TRAITS[AgeGroup] {
  return AGE_GROUP_TRAITS[getAgeGroup(age)]
}
