// ===================================================================
// GROWMATE AI-Native 引擎 — 16维向量空间引擎 v1.0.0
// 将WILDER 6维分数转化为连续向量空间，支持跨界天赋涌现检测
// ===================================================================

import type {
  VectorPoint,
  CrossDimensionConfig,
  EmergentTalent,
  NearestTalentMatch,
  TalentCluster,
  TalentGalaxy,
  TalentStar,
  Constellation,
} from './types'
import type { WilderDimension } from '../wilderKernel'
import type { TalentType30 } from '../talentTypes30'

// ============================================================
// 交叉维度配置（从C(6,2)=15中选10个教育评估贡献最大的）
// ============================================================

export const CROSS_DIMENSION_CONFIG: CrossDimensionConfig[] = [
  { pair: ['W', 'I'], key: 'WxI', semanticLabel: '好奇驱动的探究', emergentSignal: '科学探索者', weight: 1.0 },
  { pair: ['W', 'L'], key: 'WxL', semanticLabel: '好奇协作', emergentSignal: '团队发现者', weight: 0.8 },
  { pair: ['W', 'D'], key: 'WxD', semanticLabel: '好奇创造', emergentSignal: '创意工程师', weight: 1.0 },
  { pair: ['W', 'R'], key: 'WxR', semanticLabel: '好奇反思', emergentSignal: '哲学型探索者', weight: 0.9 },
  { pair: ['I', 'L'], key: 'IxL', semanticLabel: '探究协作', emergentSignal: '合作研究者', weight: 0.7 },
  { pair: ['I', 'D'], key: 'IxD', semanticLabel: '探究设计', emergentSignal: '系统架构师', weight: 1.0 },
  { pair: ['I', 'E'], key: 'IxE', semanticLabel: '探究表达', emergentSignal: '科学传播者', weight: 1.0 },
  { pair: ['I', 'R'], key: 'IxR', semanticLabel: '探究反思', emergentSignal: '实证思想家', weight: 0.7 },
  { pair: ['L', 'D'], key: 'LxD', semanticLabel: '协作设计', emergentSignal: '社会创新者', weight: 0.9 },
  { pair: ['D', 'E'], key: 'DxE', semanticLabel: '设计表达', emergentSignal: '创意演说家', weight: 0.8 },
]

// 涌现配对定义：两个维度同时高分时触发的复合天赋
interface EmergentPairDef {
  dims: [WilderDimension, WilderDimension]
  threshold: number
  crossThreshold: number
  label: string
  narrativeTemplate: string
}

const EMERGENT_PAIRS: EmergentPairDef[] = [
  {
    dims: ['W', 'D'], threshold: 0.65, crossThreshold: 0.45,
    label: '创意工程师',
    narrativeTemplate: '不仅想得远（好奇心强），还能做出来（设计力强），这是罕见的"创意工程师"特质',
  },
  {
    dims: ['I', 'E'], threshold: 0.65, crossThreshold: 0.45,
    label: '科学传播者',
    narrativeTemplate: '严谨求证的同时善于传播，这是AI时代最稀缺的"科学传播者"能力',
  },
  {
    dims: ['W', 'R'], threshold: 0.70, crossThreshold: 0.50,
    label: '哲学型探索者',
    narrativeTemplate: '不仅爱提问，还会深度内省，呈现出罕见的"哲学型探索者"气质',
  },
  {
    dims: ['I', 'D'], threshold: 0.65, crossThreshold: 0.45,
    label: '系统架构师',
    narrativeTemplate: '用科学方法设计解决方案，这是典型的"系统架构师"思维',
  },
  {
    dims: ['L', 'D'], threshold: 0.60, crossThreshold: 0.40,
    label: '社会创新者',
    narrativeTemplate: '善于联合人际资源推动项目落地，天生的"社会创新者"',
  },
]

// ============================================================
// 30种类型的理想锚点向量（模块初始化时预计算）
// ============================================================

let _talentAnchors: Map<string, VectorPoint> | null = null

/** 获取30种天赋类型的理想锚点向量 */
function getTalentAnchors(): Map<string, VectorPoint> {
  if (_talentAnchors) return _talentAnchors

  _talentAnchors = new Map()

  // 延迟导入避免循环依赖
  import('../talentTypes30').then(({ TALENT_TYPES_30 }) => {
    for (const [key, talent] of Object.entries(TALENT_TYPES_30)) {
      const idealPcts: Record<WilderDimension, number> = {
        W: 50, I: 50, L: 50, D: 50, E: 50, R: 50,
      }
      const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']

      const t30 = talent as TalentType30
      if (t30.tier === 'single' && t30.dims.length === 1) {
        idealPcts[t30.dims[0] as WilderDimension] = 85
      } else if (t30.tier === 'dual' && t30.dims.length === 2) {
        idealPcts[t30.dims[0] as WilderDimension] = 80
        idealPcts[t30.dims[1] as WilderDimension] = 75
      } else if (t30.tier === 'triple') {
        for (const d of t30.dims) idealPcts[d as WilderDimension] = 75
      } else if (t30.tier === 'special') {
        for (const d of dims) idealPcts[d] = 55
      }

      _talentAnchors!.set(key, toVectorPoint(idealPcts, undefined, key))
    }
  }).catch(() => {
    // If import fails, anchors will be empty — nearest search returns empty
  })

  // Return empty map initially (will be populated after import resolves)
  return _talentAnchors
}

// ============================================================
// 核心函数
// ============================================================

/**
 * 将WILDER分数转化为16维向量
 * 6原始维度归一化 + 10交叉维度几何平均
 */
export function toVectorPoint(
  wilderPcts: Record<WilderDimension, number>,
  profileCode?: string,
  talentTypeKey?: string,
): VectorPoint {
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']

  // Step 1: 归一化原始维度到 0-1
  const rawDimensions: Record<WilderDimension, number> = {} as Record<WilderDimension, number>
  for (const d of dims) {
    rawDimensions[d] = wilderPcts[d] / 100.0
  }

  // Step 2: 计算交叉维度（几何平均 × 权重）
  const crossDimensions: Record<string, number> = {}
  for (const config of CROSS_DIMENSION_CONFIG) {
    const [d1, d2] = config.pair
    const v1 = rawDimensions[d1] || 0
    const v2 = rawDimensions[d2] || 0
    // 几何平均 = sqrt(a*b)，比简单乘积更稳定
    crossDimensions[config.key] = Math.sqrt(v1 * v2) * config.weight
  }

  // Step 3: 拼接为16维向量
  const fullVector: number[] = [
    ...dims.map(d => rawDimensions[d]),
    ...CROSS_DIMENSION_CONFIG.map(c => crossDimensions[c.key]),
  ]

  return {
    rawDimensions,
    crossDimensions,
    fullVector,
    profileCode,
    talentTypeKey,
  }
}

/**
 * 余弦相似度（在16维fullVector上计算）
 */
export function cosineSimilarity(a: VectorPoint, b: VectorPoint): number {
  const va = a.fullVector
  const vb = b.fullVector
  const dim = Math.min(va.length, vb.length)

  let dot = 0, magA = 0, magB = 0
  for (let i = 0; i < dim; i++) {
    dot += va[i] * vb[i]
    magA += va[i] * va[i]
    magB += vb[i] * vb[i]
  }

  if (magA === 0 || magB === 0) return 0
  return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

/** 欧氏距离 */
export function euclideanDistance(a: VectorPoint, b: VectorPoint): number {
  const va = a.fullVector
  const vb = b.fullVector
  const dim = Math.min(va.length, vb.length)
  let sum = 0
  for (let i = 0; i < dim; i++) {
    const diff = va[i] - vb[i]
    sum += diff * diff
  }
  return Math.sqrt(sum)
}

/**
 * 涌现天赋检测
 * 当两个"通常不共存"的维度同时高分时，识别复合天赋
 */
export function detectEmergentTalents(point: VectorPoint): EmergentTalent[] {
  const results: EmergentTalent[] = []

  for (const ep of EMERGENT_PAIRS) {
    const d1Score = point.rawDimensions[ep.dims[0]] || 0
    const d2Score = point.rawDimensions[ep.dims[1]] || 0
    const crossKey = `${ep.dims[0]}x${ep.dims[1]}`
    const crossScore = point.crossDimensions[crossKey] || 0

    if (d1Score >= ep.threshold && d2Score >= ep.threshold && crossScore >= ep.crossThreshold) {
      const confidence = Math.min(d1Score, d2Score) * crossScore
      results.push({
        baseTypes: [point.talentTypeKey || 'unknown'],
        emergentPattern: ep.label,
        crossDimensionSignals: { [crossKey]: crossScore },
        uniqueness: computeUniqueness(point, crossKey),
        narrativeHint: ep.narrativeTemplate,
        confidence,
      })
    }
  }

  return results
}

/**
 * 计算独特性分数
 */
function computeUniqueness(point: VectorPoint, crossKey: string): number {
  // 简化版：用交叉维度的绝对值作为独特性代理指标
  const crossVal = point.crossDimensions[crossKey] || 0
  // 映射到0-100范围
  return Math.min(100, Math.round(crossVal * 150))
}

/**
 * 在30种类型锚点中找最近邻
 */
export function findNearestTalentTypes(point: VectorPoint, topK: number = 3): NearestTalentMatch[] {
  const anchors = getTalentAnchors()
  if (anchors.size === 0) return []

  const results: NearestTalentMatch[] = []

  for (const [key, anchor] of anchors) {
    const sim = cosineSimilarity(point, anchor)
    // 延迟获取talentType
    results.push({ key, similarity: sim, talentType: null as unknown as TalentType30 })
  }

  results.sort((a, b) => b.similarity - a.similarity)

  // 异步补全talentType
  import('../talentTypes30').then(({ TALENT_TYPES_30 }) => {
    for (const r of results) {
      if (TALENT_TYPES_30[r.key]) {
        r.talentType = TALENT_TYPES_30[r.key]
      }
    }
  }).catch(() => {})

  return results.slice(0, topK)
}

/**
 * K-Means++ 聚类（纯CPU实现）
 */
export function clusterProfiles(points: VectorPoint[], k: number = 6): TalentCluster[] {
  if (points.length === 0) return []
  if (points.length <= k) {
    return points.map(p => ({
      centroidVector: [...p.fullVector],
      members: [p],
      label: p.profileCode || 'unknown',
      dominantDimensions: getTopDimensions(p),
      size: 1,
    }))
  }

  const vectors = points.map(p => p.fullVector)
  const dim = vectors[0].length

  // K-Means++ 初始化
  const centroids = kMeansPlusPlusInit(vectors, k)

  let assignments: number[] = new Array(points.length).fill(0)

  for (let iter = 0; iter < 50; iter++) {
    // 分配
    assignments = vectors.map(v => {
      let minDist = Infinity, minIdx = 0
      for (let c = 0; c < centroids.length; c++) {
        const dist = euclideanDistArray(v, centroids[c])
        if (dist < minDist) { minDist = dist; minIdx = c }
      }
      return minIdx
    })

    // 更新质心
    const newCentroids = centroids.map(() => new Array(dim).fill(0))
    const counts = new Array(k).fill(0)
    for (let i = 0; i < points.length; i++) {
      const c = assignments[i]
      counts[c]++
      for (let j = 0; j < dim; j++) {
        newCentroids[c][j] += vectors[i][j]
      }
    }
    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) {
        for (let j = 0; j < dim; j++) {
          newCentroids[c][j] /= counts[c]
        }
      }
    }

    // 收敛检查
    let maxShift = 0
    for (let c = 0; c < k; c++) {
      maxShift = Math.max(maxShift, euclideanDistArray(centroids[c], newCentroids[c]))
    }
    if (maxShift < 0.001) break

    for (let c = 0; c < k; c++) {
      centroids[c] = [...newCentroids[c]]
    }
  }

  // 组装结果
  const clusters: TalentCluster[] = []
  for (let c = 0; c < k; c++) {
    const members = points.filter((_, i) => assignments[i] === c)
    if (members.length === 0) continue
    clusters.push({
      centroidVector: centroids[c],
      members,
      label: generateClusterLabel(centroids[c]),
      dominantDimensions: getTopDimensionsFromVector(centroids[c]),
      size: members.length,
    })
  }

  return clusters
}

/**
 * 天赋星系可视化数据（PCA降维到2D）
 */
export function generateTalentGalaxy(points: VectorPoint[]): TalentGalaxy {
  if (points.length === 0) return { stars: [], constellations: [], axisLabels: ['PC1', 'PC2'] }

  const vectors = points.map(p => p.fullVector)
  const dim = vectors[0].length

  // 计算均值
  const mean = new Array(dim).fill(0)
  for (const v of vectors) {
    for (let j = 0; j < dim; j++) mean[j] += v[j]
  }
  for (let j = 0; j < dim; j++) mean[j] /= vectors.length

  // 中心化
  const centered = vectors.map(v => v.map((val, j) => val - mean[j]))

  // 幂迭代法求前2个主成分
  const [pc1, pc2] = powerIterationPCA(centered, dim, 2)

  // 投影到2D
  const projections = centered.map(row => ({
    x: dotProduct(row, pc1),
    y: dotProduct(row, pc2),
  }))

  // 归一化到 [-1, 1]
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const p of projections) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x)
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y)
  }
  const rangeX = maxX - minX || 1
  const rangeY = maxY - minY || 1

  const normalized = projections.map(p => ({
    x: 2 * (p.x - minX) / rangeX - 1,
    y: 2 * (p.y - minY) / rangeY - 1,
  }))

  // 计算最大亮度
  let maxMag = 0
  const mags = points.map(p => {
    const mag = Math.sqrt(p.fullVector.reduce((s, v) => s + v * v, 0))
    maxMag = Math.max(maxMag, mag)
    return mag
  })
  if (maxMag === 0) maxMag = 1

  const stars: TalentStar[] = points.map((p, i) => ({
    position: normalized[i],
    profileCode: p.profileCode,
    talentTypeKey: p.talentTypeKey,
    brightness: mags[i] / maxMag,
  }))

  // 星座 = 聚类结果
  const clusters = clusterProfiles(points, 6)
  const constellations: Constellation[] = clusters.map(c => ({
    name: c.label,
    members: c.members.map(m => m.profileCode || '').filter(Boolean),
    centerPosition: { x: 0, y: 0 },
  }))

  return {
    stars,
    constellations,
    axisLabels: ['主成分1', '主成分2'],
  }
}

// ============================================================
// 内部算法
// ============================================================

/** K-Means++ 初始化 */
function kMeansPlusPlusInit(vectors: number[][], k: number): number[][] {
  const n = vectors.length
  const centroids: number[][] = []

  // 随机选第一个中心
  const firstIdx = Math.floor(Math.random() * n)
  centroids.push([...vectors[firstIdx]])

  for (let c = 1; c < k; c++) {
    // 计算每个点到最近质心的距离平方
    const dists = vectors.map(v => {
      let minD = Infinity
      for (const centroid of centroids) {
        minD = Math.min(minD, euclideanDistArray(v, centroid))
      }
      return minD * minD
    })

    // 按距离加权随机选择
    const totalDist = dists.reduce((s, d) => s + d, 0)
    if (totalDist === 0) {
      centroids.push([...vectors[Math.floor(Math.random() * n)]])
      continue
    }

    let r = Math.random() * totalDist
    let selected = 0
    for (let i = 0; i < n; i++) {
      r -= dists[i]
      if (r <= 0) { selected = i; break }
    }
    centroids.push([...vectors[selected]])
  }

  return centroids
}

function euclideanDistArray(a: number[], b: number[]): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i]
    sum += d * d
  }
  return Math.sqrt(sum)
}

function dotProduct(a: number[], b: number[]): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i]
  return sum
}

/** 幂迭代法求前k个主成分 */
function powerIterationPCA(centered: number[][], dim: number, _numComponents: number): [number[], number[]] {
  // 计算协方差矩阵
  const n = centered.length
  const covMatrix: number[][] = Array.from({ length: dim }, () => new Array(dim).fill(0))
  for (const row of centered) {
    for (let i = 0; i < dim; i++) {
      for (let j = i; j < dim; j++) {
        covMatrix[i][j] += row[i] * row[j]
      }
    }
  }
  for (let i = 0; i < dim; i++) {
    for (let j = i; j < dim; j++) {
      covMatrix[i][j] /= (n - 1)
      if (i !== j) covMatrix[j][i] = covMatrix[i][j]
    }
  }

  // 幂迭代求第一个主成分
  let v1 = new Array(dim).fill(0).map(() => Math.random())
  for (let iter = 0; iter < 100; iter++) {
    const w = matVecMul(covMatrix, v1)
    const norm = Math.sqrt(w.reduce((s, x) => s + x * x, 0))
    if (norm === 0) break
    v1 = w.map(x => x / norm)
  }

  //  deflate 后求第二个主成分
  const covDeflated = covMatrix.map((row, i) =>
    row.map((val, j) => val - v1[i] * v1[j])
  )
  let v2 = new Array(dim).fill(0).map(() => Math.random())
  for (let iter = 0; iter < 100; iter++) {
    const w = matVecMul(covDeflated, v2)
    const norm = Math.sqrt(w.reduce((s, x) => s + x * x, 0))
    if (norm === 0) break
    v2 = w.map(x => x / norm)
  }

  return [v1, v2]
}

function matVecMul(matrix: number[][], vec: number[]): number[] {
  return matrix.map(row => row.reduce((s, v, j) => s + v * vec[j], 0))
}

function getTopDimensions(point: VectorPoint): WilderDimension[] {
  const dims: [WilderDimension, number][] = Object.entries(point.rawDimensions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2) as [WilderDimension, number][]
  return dims.map(([d]) => d)
}

function getTopDimensionsFromVector(vec: number[]): WilderDimension[] {
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
  return dims
    .map((d, i) => ({ dim: d, val: vec[i] }))
    .sort((a, b) => b.val - a.val)
    .slice(0, 2)
    .map(d => d.dim)
}

function generateClusterLabel(centroid: number[]): string {
  const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
  const named = dims.map((d, i) => ({ dim: d, val: centroid[i] }))
  named.sort((a, b) => b.val - a.val)
  const top2 = named.slice(0, 2)
  const dimNames: Record<WilderDimension, string> = {
    W: '好奇', I: '探究', L: '联结', D: '设计', E: '表达', R: '反思',
  }
  return `${dimNames[top2[0].dim]}+${dimNames[top2[1].dim]}星系`
}
