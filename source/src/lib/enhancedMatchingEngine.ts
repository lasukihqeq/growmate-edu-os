/**
 * 增强型大学/专业/资源智能匹配引擎
 * 基于WILDER六维潜能模型进行精准匹配
 * 
 * 特点：
 * - 基于实际得分（0-100）的加权匹配算法
 * - 区分主要维度和次要维度的权重
 * - 个性化匹配理由生成
 * - 多梯度推荐（985/211/一本/国际）
 */

import {
  type University, type Major, type WilderDim,
  UNIVERSITIES_985, UNIVERSITIES_211, UNIVERSITIES_YIBEN, UNIVERSITIES_INTERNATIONAL,
  MAJORS_DATABASE
} from './universityDatabase'
import { BOOK_DATABASE, type Book } from './bookDatabase'
import { DOCUMENTARY_DATABASE, type Documentary } from './documentaryDatabase'

// ============ 类型定义 ============

export interface WilderScores {
  W: number  // 好奇心 Wonder
  I: number  // 探究力 Inquiry
  L: number  // 连接力 Link
  D: number  // 设计力 Design
  E: number  // 表达力 Expression
  R: number  // 反思力 Reflection
}

export interface MajorMatch {
  major: Major
  matchScore: number // 0-100
  matchReason: string
  dimensionAlignment: { dim: WilderDim; contribution: number }[]
  careerAlignment: string
  aiResistanceNote: string
}

export interface UniversityMatch {
  university: University
  matchScore: number // 0-100
  matchReason: string
  recommendedMajors: MajorMatch[]
  uniqueAdvantages: string[]
  locationAdvantage?: string
}

export interface TieredRecommendations {
  tier985: UniversityMatch[]
  tier211: UniversityMatch[]
  tierYiben: UniversityMatch[]
  international: UniversityMatch[]
  topMajors: MajorMatch[]
  summary: string
}

export interface BookRecommendation {
  book: Book
  matchScore: number
  matchReason: string
  readingTip: string
}

export interface DocumentaryRecommendation {
  documentary: Documentary
  matchScore: number
  matchReason: string
  watchTip: string
  careerRelevance?: string
}

// WILDER维度的中文名称映射
const WILDER_NAMES: Record<WilderDim, string> = {
  W: '好奇心',
  I: '探究力',
  L: '连接力',
  D: '设计力',
  E: '表达力',
  R: '反思力'
}

// ============ 核心匹配算法 ============

/**
 * 计算专业与学生WILDER维度的匹配分数
 * 主要维度权重0.4，次要维度权重0.2
 */
export function calculateMajorMatchScore(
  scores: WilderScores,
  major: Major
): { score: number; contributions: { dim: WilderDim; contribution: number }[] } {
  const majorDims = major.wilderDimensions
  if (majorDims.length === 0) {
    return { score: 50, contributions: [] } // 默认中等匹配
  }

  // 主要维度（第一个）权重更高
  const primaryDim = majorDims[0]
  const secondaryDims = majorDims.slice(1)

  let totalScore = 0
  let totalWeight = 0
  const contributions: { dim: WilderDim; contribution: number }[] = []

  // 主要维度贡献 (权重 0.5)
  const primaryScore = scores[primaryDim] || 0
  const primaryContribution = primaryScore * 0.5
  totalScore += primaryContribution
  totalWeight += 0.5
  contributions.push({ dim: primaryDim, contribution: primaryContribution })

  // 次要维度贡献 (每个权重平分剩余 0.5)
  if (secondaryDims.length > 0) {
    const secondaryWeight = 0.5 / secondaryDims.length
    secondaryDims.forEach(dim => {
      const dimScore = scores[dim] || 0
      const contribution = dimScore * secondaryWeight
      totalScore += contribution
      totalWeight += secondaryWeight
      contributions.push({ dim, contribution })
    })
  }

  // 归一化到0-100
  const normalizedScore = Math.round(totalScore / totalWeight)
  
  // 就业率和AI抗性加成
  let bonus = 0
  if (major.employmentRate && major.employmentRate > 92) bonus += 3
  if (major.aiResistance === 'high') bonus += 5
  else if (major.aiResistance === 'medium') bonus += 2

  const finalScore = Math.min(100, normalizedScore + bonus)

  return { score: finalScore, contributions }
}

/**
 * 计算大学与学生的匹配分数
 * 基于推荐专业平均分 + 学校特色加成
 */
export function calculateUniversityMatchScore(
  scores: WilderScores,
  university: University,
  matchedMajors: MajorMatch[]
): number {
  if (matchedMajors.length === 0) return 50

  // 基础分：推荐专业的平均匹配分
  const avgMajorScore = matchedMajors.reduce((sum, m) => sum + m.matchScore, 0) / matchedMajors.length

  // 学校特色加成
  let featureBonus = 0
  
  // 研究型学校 + 探究力高的学生
  if (university.features.some(f => f.includes('研究') || f.includes('学术')) && scores.I >= 80) {
    featureBonus += 5
  }
  // 实践型学校 + 设计力高的学生
  if (university.features.some(f => f.includes('实践') || f.includes('动手') || f.includes('工科')) && scores.D >= 80) {
    featureBonus += 5
  }
  // 国际化学校 + 连接力/表达力高的学生
  if (university.features.some(f => f.includes('国际') || f.includes('交流')) && (scores.L >= 80 || scores.E >= 80)) {
    featureBonus += 4
  }
  // 综合型学校 + 多维度均衡的学生
  if (university.features.some(f => f.includes('综合')) && isBalanced(scores)) {
    featureBonus += 3
  }

  return Math.min(100, Math.round(avgMajorScore + featureBonus))
}

/**
 * 生成专业匹配理由
 */
export function generateMajorMatchReason(
  scores: WilderScores,
  major: Major,
  contributions: { dim: WilderDim; contribution: number }[]
): string {
  const sortedContributions = [...contributions].sort((a, b) => b.contribution - a.contribution)
  const topContributors = sortedContributions.slice(0, 2)
  
  const dimDescriptions = topContributors.map(c => 
    `${WILDER_NAMES[c.dim]}(${scores[c.dim]})`
  ).join('、')

  let reason = `您的${dimDescriptions}与该专业高度契合`

  // 添加AI时代相关说明
  if (major.aiResistance === 'high') {
    reason += '；该专业在AI时代具有较强的不可替代性'
  } else if (major.aiResistance === 'medium') {
    reason += '；该专业需要人机协作，创造力是核心竞争力'
  }

  // 添加就业前景
  if (major.employmentRate && major.employmentRate > 90) {
    reason += `；就业前景良好(${major.employmentRate}%)`
  }

  return reason
}

/**
 * 生成大学匹配理由
 */
export function generateUniversityMatchReason(
  scores: WilderScores,
  university: University,
  topMajors: MajorMatch[]
): string {
  const topDims = getTopWilderDimensions(scores, 2)
  const dimNames = topDims.map(d => WILDER_NAMES[d]).join('+')
  
  let reason = `${university.name}的`
  
  if (topMajors.length > 0) {
    reason += `${topMajors[0].major.name}等专业`
  } else {
    reason += `${university.strengths.slice(0, 2).join('、')}学科`
  }
  
  reason += `与您的${dimNames}优势高度契合`

  // 添加学校特色说明
  const relevantFeature = university.features.find(f => {
    if (scores.I >= 80 && (f.includes('研究') || f.includes('学术'))) return true
    if (scores.D >= 80 && (f.includes('实践') || f.includes('工科'))) return true
    if (scores.E >= 80 && (f.includes('表达') || f.includes('传播'))) return true
    return false
  })
  
  if (relevantFeature) {
    reason += `；学校"${relevantFeature}"的特点与您的优势相得益彰`
  }

  return reason
}

/**
 * 生成AI抗性说明
 */
function generateAIResistanceNote(major: Major): string {
  switch (major.aiResistance) {
    case 'high':
      return '🛡️ AI时代高抗性：该领域核心技能（创造、情感、复杂判断）难以被AI替代'
    case 'medium':
      return '⚖️ AI时代中等抗性：部分工作可被AI辅助，需培养人机协作能力'
    case 'low':
      return '⚠️ AI时代需关注：建议关注该领域中更具创造性和人际性的方向'
    default:
      return ''
  }
}

/**
 * 生成职业对齐说明
 */
function generateCareerAlignment(major: Major, scores: WilderScores): string {
  const topDim = getTopWilderDimensions(scores, 1)[0]
  const prospects = major.careerProspects.slice(0, 3).join('、')
  
  const alignmentMap: Record<WilderDim, string> = {
    W: '好奇心驱动型职业',
    I: '研究探索型职业',
    L: '人际协作型职业',
    D: '创造设计型职业',
    E: '表达传播型职业',
    R: '分析优化型职业'
  }

  return `发展方向：${prospects}，属于${alignmentMap[topDim]}`
}

// ============ 主要推荐函数 ============

/**
 * 获取增强型大学推荐
 * 返回分层推荐结果，包含匹配分数和理由
 */
export function getEnhancedUniversityRecommendations(
  scores: WilderScores,
  _studentAge?: number
): TieredRecommendations {
  const allMajors = MAJORS_DATABASE || []
  
  // 1. 计算所有专业的匹配分数
  const majorScores: MajorMatch[] = allMajors.map(major => {
    const { score, contributions } = calculateMajorMatchScore(scores, major)
    return {
      major,
      matchScore: score,
      matchReason: generateMajorMatchReason(scores, major, contributions),
      dimensionAlignment: contributions,
      careerAlignment: generateCareerAlignment(major, scores),
      aiResistanceNote: generateAIResistanceNote(major)
    }
  })

  // 2. 筛选高匹配度专业（>70分）
  const topMajors = majorScores
    .filter(m => m.matchScore >= 70)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 20)

  // 如果高匹配度专业不足，降低阈值
  if (topMajors.length < 10) {
    const additionalMajors = majorScores
      .filter(m => m.matchScore >= 60 && m.matchScore < 70)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10 - topMajors.length)
    topMajors.push(...additionalMajors)
  }

  // 3. 为每个层级匹配大学
  const matchUniversitiesForTier = (
    universities: University[],
    limit: number
  ): UniversityMatch[] => {
    const matches: UniversityMatch[] = []

    for (const uni of universities) {
      // 找出该大学匹配的专业
      const relevantMajors = topMajors.filter(m => {
        // 通过推荐大学ID匹配
        if (m.major.recommendedUniversities?.includes(uni.id)) return true
        // 通过学校优势学科匹配
        if (uni.strengths.some(s => 
          m.major.subCategory?.includes(s) || 
          m.major.name.includes(s) ||
          m.major.category === s.toLowerCase()
        )) return true
        // 通过学科类别匹配
        const strengthCategories = uni.strengths.map(s => s.toLowerCase())
        if (strengthCategories.some(sc => 
          m.major.category === sc || 
          m.major.subCategory?.toLowerCase().includes(sc)
        )) return true
        return false
      })

      if (relevantMajors.length === 0) continue

      const matchScore = calculateUniversityMatchScore(scores, uni, relevantMajors)
      
      matches.push({
        university: uni,
        matchScore,
        matchReason: generateUniversityMatchReason(scores, uni, relevantMajors),
        recommendedMajors: relevantMajors.slice(0, 4),
        uniqueAdvantages: uni.features.slice(0, 3),
        locationAdvantage: uni.province || uni.country
      })
    }

    // 按匹配分数排序
    return matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)
  }

  // 4. 为各层级生成推荐
  const tier985 = matchUniversitiesForTier(UNIVERSITIES_985, 8)
  const tier211 = matchUniversitiesForTier(UNIVERSITIES_211, 10)
  const tierYiben = matchUniversitiesForTier(UNIVERSITIES_YIBEN, 8)
  const international = matchUniversitiesForTier(UNIVERSITIES_INTERNATIONAL, 6)

  // 5. 生成推荐摘要
  const topDims = getTopWilderDimensions(scores, 2)
  const dimNames = topDims.map(d => WILDER_NAMES[d]).join('、')
  const summary = `基于您的${dimNames}优势，从1000+所大学、300+专业中智能匹配。` +
    `推荐985院校${tier985.length}所、211院校${tier211.length}所、` +
    `优质一本${tierYiben.length}所、国际名校${international.length}所。`

  return {
    tier985,
    tier211,
    tierYiben,
    international,
    topMajors: topMajors.slice(0, 12),
    summary
  }
}

/**
 * 获取增强型书籍推荐
 */
export function getEnhancedBookRecommendations(
  scores: WilderScores,
  age: number,
  careerDirections?: string[]
): {
  childBooks: BookRecommendation[]
  parentBooks: BookRecommendation[]
  summary: string
} {
  const books = BOOK_DATABASE || []
  const topDims = getTopWilderDimensions(scores, 3)
  
  // 根据年龄确定阅读范围
  const getAgeRange = (age: number): string[] => {
    if (age <= 8) return ['6-8', '8-10']
    if (age <= 10) return ['8-10', '10-12']
    if (age <= 12) return ['10-12', '12-14']
    if (age <= 14) return ['12-14', '14+']
    return ['14+', 'adult']
  }
  const ageRanges = getAgeRange(age)

  // 计算书籍匹配分数
  const scoreBook = (book: Book): number => {
    let score = 50 // 基础分

    // WILDER维度匹配
    const dimMatch = book.wilderDimensions?.filter(d => topDims.includes(d as WilderDim)).length || 0
    score += dimMatch * 15

    // 年龄匹配
    if (ageRanges.includes(book.ageRange || '')) score += 10

    // 评分加成
    if (book.rating && book.rating >= 9) score += 10
    else if (book.rating && book.rating >= 8.5) score += 5

    // 职业方向匹配
    if (careerDirections && book.category) {
      const categoryMatch = careerDirections.some(c => 
        c.toLowerCase().includes(book.category?.toLowerCase() || '') ||
        (book.category?.toLowerCase() || '').includes(c.toLowerCase())
      )
      if (categoryMatch) score += 8
    }

    return Math.min(100, score)
  }

  // 筛选孩子书籍
  const childBooks = books
    .filter(b => b.targetAudience === 'child' || b.targetAudience === 'both')
    .filter(b => ageRanges.includes(b.ageRange || ''))
    .map(book => ({
      book,
      matchScore: scoreBook(book),
      matchReason: generateBookMatchReason(book, scores, topDims),
      readingTip: book.readingTip || '建议亲子共读，边读边讨论'
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 12)

  // 筛选家长书籍
  const parentBooks = books
    .filter(b => b.targetAudience === 'parent')
    .map(book => ({
      book,
      matchScore: scoreBook(book),
      matchReason: generateParentBookReason(book, scores),
      readingTip: book.readingTip || '理解孩子潜能特质的参考读物'
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6)

  const dimNames = topDims.map(d => WILDER_NAMES[d]).join('+')
  const summary = `基于${dimNames}优势，从2000+书目中精选。` +
    `孩子书单${childBooks.length}本，家长书单${parentBooks.length}本。`

  return { childBooks, parentBooks, summary }
}

/**
 * 获取增强型纪录片推荐
 */
export function getEnhancedDocumentaryRecommendations(
  scores: WilderScores,
  age: number,
  careerDirections?: string[]
): {
  documentaries: DocumentaryRecommendation[]
  summary: string
} {
  const docs = DOCUMENTARY_DATABASE || []
  const topDims = getTopWilderDimensions(scores, 3)
  
  // 根据年龄确定适合的纪录片
  const suitableAgeRanges = age <= 10 ? ['6+', '8+', '10+'] : ['10+', '12+', '14+', 'all']

  // 计算纪录片匹配分数
  const scoreDocumentary = (doc: Documentary): number => {
    let score = 50 // 基础分

    // WILDER维度匹配
    const dimMatch = doc.wilderDimensions?.filter(d => topDims.includes(d as WilderDim)).length || 0
    score += dimMatch * 15

    // 年龄匹配
    if (suitableAgeRanges.includes(doc.ageRange || '')) score += 10

    // 评分加成
    if (doc.rating && doc.rating >= 9.5) score += 15
    else if (doc.rating && doc.rating >= 9) score += 10
    else if (doc.rating && doc.rating >= 8.5) score += 5

    // 职业方向匹配
    if (careerDirections && doc.category) {
      const categoryMap: Record<string, string[]> = {
        'science': ['科学', '研究', '工程'],
        'nature': ['生态', '自然', '探险'],
        'technology': ['科技', 'AI', '工程师', '程序'],
        'art': ['艺术', '设计', '创意'],
        'history': ['历史', '人文', '考古'],
        'biography': ['传记', '企业家', '领袖'],
        'society': ['社会', '教育', '心理']
      }
      
      const relatedCareers = categoryMap[doc.category] || []
      const careerMatch = careerDirections.some(c => 
        relatedCareers.some(rc => c.includes(rc))
      )
      if (careerMatch) score += 10
    }

    return Math.min(100, score)
  }

  // 生成职业相关性说明
  const generateCareerRelevance = (doc: Documentary): string | undefined => {
    if (!careerDirections || careerDirections.length === 0) return undefined
    
    const categoryCareerMap: Record<string, string> = {
      'science': '与科学研究、数据分析职业方向相关',
      'technology': '与AI工程师、产品设计职业方向相关',
      'nature': '与生态研究、自然科学职业方向相关',
      'art': '与创意设计、艺术创作职业方向相关',
      'biography': '了解成功人士的成长路径，启发职业规划',
      'society': '理解社会运作，培养人文关怀'
    }
    
    return categoryCareerMap[doc.category || '']
  }

  const documentaries = docs
    .filter(d => suitableAgeRanges.includes(d.ageRange || 'all'))
    .map(doc => ({
      documentary: doc,
      matchScore: scoreDocumentary(doc),
      matchReason: generateDocumentaryMatchReason(doc, scores, topDims),
      watchTip: doc.watchTip || '建议亲子观看，观后讨论感受',
      careerRelevance: generateCareerRelevance(doc)
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10)

  const dimNames = topDims.map(d => WILDER_NAMES[d]).join('+')
  const summary = `基于${dimNames}优势，从500+纪录片中精选${documentaries.length}部。`

  return { documentaries, summary }
}

// ============ 辅助函数 ============

/**
 * 获取WILDER维度排序（按分数从高到低）
 */
export function getTopWilderDimensions(scores: WilderScores, count: number): WilderDim[] {
  const dims: WilderDim[] = ['W', 'I', 'L', 'D', 'E', 'R']
  return dims
    .sort((a, b) => (scores[b] || 0) - (scores[a] || 0))
    .slice(0, count)
}

/**
 * 判断学生是否多维度均衡
 */
function isBalanced(scores: WilderScores): boolean {
  const values = Object.values(scores)
  const max = Math.max(...values)
  const min = Math.min(...values)
  return (max - min) < 15 // 最高和最低差距小于15分视为均衡
}

/**
 * 生成WILDER特质描述
 */
export function getWilderProfileDescription(scores: WilderScores): string {
  const topDims = getTopWilderDimensions(scores, 3)
  
  const descriptions: Record<WilderDim, string> = {
    W: '充满好奇心，对新事物有强烈探索欲',
    I: '善于深度探究，追问事物本质',
    L: '善于建立连接，具有出色的人际协作能力',
    D: '具有设计思维，善于规划和创造',
    E: '表达能力出众，善于清晰传递想法',
    R: '善于反思总结，能从经验中学习成长'
  }

  return topDims.map(d => descriptions[d]).join('，')
}

/**
 * 生成书籍匹配理由
 */
function generateBookMatchReason(book: Book, _scores: WilderScores, topDims: WilderDim[]): string {
  const matchingDims = book.wilderDimensions?.filter(d => topDims.includes(d as WilderDim)) || []
  
  if (matchingDims.length > 0) {
    const dimNames = matchingDims.map(d => WILDER_NAMES[d as WilderDim]).join('、')
    return `与您的${dimNames}优势高度契合，能激发相关潜能`
  }
  
  return book.category ? `${book.category}类优质读物，拓展视野` : '精选推荐读物'
}

/**
 * 生成家长书籍推荐理由
 */
function generateParentBookReason(book: Book, scores: WilderScores): string {
  const topDim = getTopWilderDimensions(scores, 1)[0]
  
  if (book.category === 'parenting' || book.category === 'education') {
    return `帮助您理解和培养孩子的${WILDER_NAMES[topDim]}优势`
  }
  if (book.category === 'psychology') {
    return '深入了解儿童心理发展，科学育儿'
  }
  
  return '家长必读，助力孩子成长'
}

/**
 * 生成纪录片匹配理由
 */
function generateDocumentaryMatchReason(doc: Documentary, _scores: WilderScores, topDims: WilderDim[]): string {
  const matchingDims = doc.wilderDimensions?.filter(d => topDims.includes(d as WilderDim)) || []
  
  if (matchingDims.length > 0) {
    const dimNames = matchingDims.map(d => WILDER_NAMES[d as WilderDim]).join('、')
    return `激发${dimNames}，拓展认知边界`
  }
  
  const categoryDesc: Record<string, string> = {
    'science': '培养科学思维和探究精神',
    'nature': '激发对自然世界的好奇与敬畏',
    'technology': '了解前沿科技，启发创新思维',
    'art': '培养审美能力和创造力',
    'history': '以史为鉴，开拓视野',
    'biography': '学习杰出人物的成长故事'
  }
  
  return categoryDesc[doc.category || ''] || '优质纪录片，亲子共赏'
}

/**
 * 生成推荐摘要报告
 */
export function generateRecommendationSummary(
  uniRec: TieredRecommendations,
  studentName: string,
  scores: WilderScores
): string {
  const topDims = getTopWilderDimensions(scores, 2)
  const dimNames = topDims.map(d => WILDER_NAMES[d]).join('+')
  
  const topMajor = uniRec.topMajors[0]
  const topUni985 = uniRec.tier985[0]
  const topUni211 = uniRec.tier211[0]
  
  let summary = `📊 ${studentName}的升学规划摘要\n\n`
  summary += `🎯 核心优势：${dimNames}\n`
  
  if (topMajor) {
    summary += `🔬 最匹配专业：${topMajor.major.name}（匹配度${topMajor.matchScore}%）\n`
  }
  
  if (topUni985) {
    summary += `🏫 985推荐：${topUni985.university.name}（匹配度${topUni985.matchScore}%）\n`
  }
  
  if (topUni211) {
    summary += `🎓 211推荐：${topUni211.university.name}（匹配度${topUni211.matchScore}%）\n`
  }
  
  summary += `\n💡 建议：充分发挥${dimNames}优势，关注相关专业的本科生科研机会。`
  
  return summary
}
