// ===================================================================
// 年龄常模归一化评分模块
// 基于发展心理学的Z-score → 百分位标准心理测量方法
// 用T分数（均值50、标准差10）替代原始百分比作为主展示分数
// v1.1: 新增学龄前(4-5岁)常模
// ===================================================================

// ========== 年龄组定义 ==========
export type AgeGroup = 'preschool' | 'lower-primary' | 'upper-primary' | 'junior-high' | 'high-school'

export interface AgeGroupConfig {
  key: AgeGroup
  label: string
  ageRange: [number, number] // inclusive
}

export const AGE_GROUPS: AgeGroupConfig[] = [
  { key: 'preschool', label: '学龄前(4-5岁)', ageRange: [4, 5] },
  { key: 'lower-primary', label: '6-9岁', ageRange: [6, 9] },
  { key: 'upper-primary', label: '10-12岁', ageRange: [10, 12] },
  { key: 'junior-high', label: '13-15岁', ageRange: [13, 15] },
  { key: 'high-school', label: '16-18岁', ageRange: [16, 18] },
]

// ========== 各年龄组各维度的均值/标准差常模参数 ==========
// 基于百分制分数（rawScore / WILDER_MAX * 100）
// 参数设计基于发展心理学原则
interface NormParams { mean: number; sd: number }

const NORMS: Record<AgeGroup, Record<string, NormParams>> = {
  'preschool': {
    // 4-5岁学龄前：基于皮亚杰前运算阶段发展特征
    W: { mean: 70, sd: 12 },  // 幼儿天然好奇心最强 (Engel 2011)
    I: { mean: 40, sd: 14 },  // 系统性探究尚未发展，以探索为主
    L: { mean: 50, sd: 15 },  // 社会认知初步发展，平行游戏向合作游戏过渡
    D: { mean: 35, sd: 14 },  // 执行功能晚发育 (Diamond 2013)，计划性弱
    E: { mean: 65, sd: 14 },  // 幼儿表达意愿强，但表达能力有限
    R: { mean: 30, sd: 14 },  // 元认知最后成熟 (Flavell 1979)，自我反思能力弱
  },
  'lower-primary': {
    W: { mean: 65, sd: 14 },  // 幼儿天然好奇心高 (Engel 2011)
    I: { mean: 48, sd: 15 },  // 系统性探究尚未发展
    L: { mean: 55, sd: 14 },  // 社会认知初步
    D: { mean: 42, sd: 16 },  // 执行功能晚发育 (Diamond 2013)
    E: { mean: 60, sd: 15 },  // 幼儿表达意愿强
    R: { mean: 38, sd: 16 },  // 元认知最后成熟 (Flavell 1979)
  },
  'upper-primary': {
    W: { mean: 60, sd: 13 },
    I: { mean: 55, sd: 14 },
    L: { mean: 58, sd: 13 },
    D: { mean: 50, sd: 14 },
    E: { mean: 58, sd: 14 },
    R: { mean: 48, sd: 15 },
  },
  'junior-high': {
    W: { mean: 55, sd: 12 },
    I: { mean: 60, sd: 13 },
    L: { mean: 60, sd: 12 },
    D: { mean: 58, sd: 13 },
    E: { mean: 55, sd: 13 },
    R: { mean: 55, sd: 14 },
  },
  'high-school': {
    W: { mean: 52, sd: 11 },
    I: { mean: 63, sd: 12 },
    L: { mean: 62, sd: 11 },
    D: { mean: 62, sd: 12 },
    E: { mean: 55, sd: 12 },
    R: { mean: 60, sd: 13 },
  },
}

// ========== 正态分布CDF近似（Abramowitz & Stegun 1964） ==========
function normalCDF(z: number): number {
  // 标准正态分布累积分布函数
  // 使用 Horner 形式的有理逼近，精度 ≤ 1.5×10⁻⁷
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = z < 0 ? -1 : 1
  const x = Math.abs(z) / Math.SQRT2
  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return 0.5 * (1.0 + sign * y)
}

// ========== 年龄分组 ==========
export function getAgeGroup(age: number | undefined | null): AgeGroup {
  if (age == null || isNaN(age)) return 'upper-primary' // 缺失/NaN → 默认 upper-primary
  if (age < 6) return 'preschool' // 4-5岁归入学龄前
  if (age > 18) return 'high-school'
  for (const g of AGE_GROUPS) {
    if (age >= g.ageRange[0] && age <= g.ageRange[1]) return g.key
  }
  return 'upper-primary'
}

export function getAgeGroupLabel(ageGroup: AgeGroup): string {
  const found = AGE_GROUPS.find(g => g.key === ageGroup)
  return found ? found.label : '10-12岁'
}

// ========== 核心计算 ==========
export interface AgeNormalizedResult {
  ageGroup: AgeGroup
  ageGroupLabel: string
  zScores: Record<string, number>
  percentiles: Record<string, number>
  tScores: Record<string, number>
  peerMeans: Record<string, number>
}

/**
 * 计算基于年龄组的常模归一化分数
 * @param wilderPct 各维度百分制原始分 (0-100)
 * @param age 学生年龄
 * @returns 归一化结果（Z-score, 百分位, T分数）
 */
export function computeAgeNormalizedScores(
  wilderPct: Record<string, number>,
  age: number | undefined | null
): AgeNormalizedResult {
  const ageGroup = getAgeGroup(age)
  const ageGroupLabel = getAgeGroupLabel(ageGroup)
  const norms = NORMS[ageGroup]

  const dims = ['W', 'I', 'L', 'D', 'E', 'R']
  const zScores: Record<string, number> = {}
  const percentiles: Record<string, number> = {}
  const tScores: Record<string, number> = {}
  const peerMeans: Record<string, number> = {}

  for (const d of dims) {
    const raw = wilderPct[d] ?? 50
    const norm = norms[d]
    peerMeans[d] = norm.mean

    // Z-score: (原始分 - 同龄均值) / 标准差
    // sd = 0 → Z = 0
    const z = norm.sd === 0 ? 0 : (raw - norm.mean) / norm.sd
    zScores[d] = Math.round(z * 100) / 100

    // 百分位: Φ(Z) × 100, 限制 [1, 99]
    const pctRaw = Math.round(normalCDF(z) * 100)
    percentiles[d] = Math.min(99, Math.max(1, pctRaw))

    // T分数: 50 + 10 × Z, 限制 [20, 80]
    const tRaw = Math.round(50 + 10 * z)
    tScores[d] = Math.min(80, Math.max(20, tRaw))
  }

  return { ageGroup, ageGroupLabel, zScores, percentiles, tScores, peerMeans }
}

// ========== 百分位档位系统 ==========
export type PercentileBand = 'excellent' | 'good' | 'average' | 'developing' | 'emerging'

export interface PercentileBandInfo {
  /** 档位标识 */
  band: PercentileBand
  /** 中文标签 */
  label: string
  /** 简短描述 */
  description: string
  /** 档位颜色（Tailwind 类名） */
  colorClass: string
  /** 档位图标 */
  icon: string
  /** 百分位范围 [low, high] */
  range: [number, number]
}

const PERCENTILE_BANDS: Record<PercentileBand, Omit<PercentileBandInfo, 'band' | 'range'>> = {
  excellent: {
    label: '表现出色',
    description: '超越大多数同龄孩子，是这方面的小达人',
    colorClass: 'text-emerald-600 bg-emerald-50',
    icon: '⭐',
  },
  good: {
    label: '表现良好',
    description: '高于同龄平均水平，有不错的发展基础',
    colorClass: 'text-blue-600 bg-blue-50',
    icon: '👍',
  },
  average: {
    label: '稳步发展',
    description: '与同龄孩子水平相当，属于正常发展轨迹',
    colorClass: 'text-amber-600 bg-amber-50',
    icon: '📈',
  },
  developing: {
    label: '待发展',
    description: '有提升空间，通过适当引导可以快速进步',
    colorClass: 'text-orange-600 bg-orange-50',
    icon: '🌱',
  },
  emerging: {
    label: '萌芽期',
    description: '这方面的潜力正在萌芽，需要更多机会来激发',
    colorClass: 'text-purple-600 bg-purple-50',
    icon: '🌟',
  },
}

/**
 * 将精确百分位转换为 5 级档位
 */
export function toPercentileBand(percentile: number): PercentileBandInfo {
  let band: PercentileBand
  let range: [number, number]
  
  if (percentile >= 80) {
    band = 'excellent'
    range = [80, 100]
  } else if (percentile >= 60) {
    band = 'good'
    range = [60, 80]
  } else if (percentile >= 40) {
    band = 'average'
    range = [40, 60]
  } else if (percentile >= 20) {
    band = 'developing'
    range = [20, 40]
  } else {
    band = 'emerging'
    range = [0, 20]
  }
  
  return {
    band,
    range,
    ...PERCENTILE_BANDS[band],
  }
}

/**
 * 将百分制分数直接转换为档位（不经过百分位）
 * 适用于没有常模数据时的直接展示
 */
export function scoreToBand(score: number): PercentileBandInfo {
  // 直接用分数作为近似百分位
  return toPercentileBand(score)
}
