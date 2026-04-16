import type { ColorProfile, CompositionProfile, WorkAnalysisResult, EnhancedColorProfile, EnhancedCompositionProfile, ColorHarmony, SpatialDistribution, VisualFlow, WILDERWorkMapping } from '../types/newFeatures'

// ===================================================================
// 作品上传 — Canvas API 图像分析引擎 V2.0
// 纯前端实现：通过 Canvas 2D 提取色彩、构图、笔触等特征
// 增强版：新增色彩和谐、空间分布、三分法、视觉动线、主体识别
// ===================================================================

// ---------- 精细色彩名称映射 (36+ 色相区间) ----------
const FINE_COLOR_NAMES: { hMin: number; hMax: number; name: string; emoji: string }[] = [
  { hMin: 0, hMax: 10, name: '正红色', emoji: '🔴' },
  { hMin: 10, hMax: 25, name: '橙红色', emoji: '🟠' },
  { hMin: 25, hMax: 40, name: '橙色', emoji: '🟠' },
  { hMin: 40, hMax: 55, name: '金黄色', emoji: '🟡' },
  { hMin: 55, hMax: 70, name: '黄色', emoji: '🟡' },
  { hMin: 70, hMax: 85, name: '黄绿色', emoji: '🟢' },
  { hMin: 85, hMax: 100, name: '草绿色', emoji: '🟢' },
  { hMin: 100, hMax: 120, name: '绿色', emoji: '🟢' },
  { hMin: 120, hMax: 140, name: '青绿色', emoji: '🔵' },
  { hMin: 140, hMax: 160, name: '青色', emoji: '🔵' },
  { hMin: 160, hMax: 180, name: '蓝绿色', emoji: '🔵' },
  { hMin: 180, hMax: 200, name: '天蓝色', emoji: '🔵' },
  { hMin: 200, hMax: 220, name: '蓝色', emoji: '🔵' },
  { hMin: 220, hMax: 240, name: '深蓝色', emoji: '🔵' },
  { hMin: 240, hMax: 260, name: '靛蓝色', emoji: '🔵' },
  { hMin: 260, hMax: 280, name: '蓝紫色', emoji: '🟣' },
  { hMin: 280, hMax: 300, name: '紫色', emoji: '🟣' },
  { hMin: 300, hMax: 320, name: '紫红色', emoji: '🟣' },
  { hMin: 320, hMax: 340, name: '品红色', emoji: '🩷' },
  { hMin: 340, hMax: 360, name: '玫红色', emoji: '🩷' },
]

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')
}

function getFineColorName(h: number, s: number, l: number): string {
  if (l < 12) return '纯黑色'
  if (l > 92) return '纯白色'
  if (s < 8) return l < 45 ? '深灰色' : '浅灰色'
  if (s < 18) return l < 45 ? '暗灰色' : '淡灰色'
  for (const c of FINE_COLOR_NAMES) {
    if (h >= c.hMin && h < c.hMax) return c.name
  }
  return '未知色'
}

function getFineColorEmoji(h: number, s: number, l: number): string {
  if (l < 12 || l > 92) return '⚫'
  if (s < 15) return '⚪'
  for (const c of FINE_COLOR_NAMES) {
    if (h >= c.hMin && h < c.hMax) return c.emoji
  }
  return '🎨'
}

// ---------- 量化桶 ----------
interface ColorBucket {
  r: number; g: number; b: number
  count: number
  hue: number; sat: number; lit: number
  x: number; y: number // 位置信息
}

function quantizeWithPosition(pixels: Uint8ClampedArray, w: number, _h: number, bucketSize: number = 24): ColorBucket[] {
  const map = new Map<string, ColorBucket>()
  const total = pixels.length / 4

  for (let i = 0; i < pixels.length; i += 4) {
    const r = Math.min(255, Math.round(pixels[i] / bucketSize) * bucketSize)
    const g = Math.min(255, Math.round(pixels[i + 1] / bucketSize) * bucketSize)
    const b = Math.min(255, Math.round(pixels[i + 2] / bucketSize) * bucketSize)
    const a = pixels[i + 3]
    if (a < 128) continue

    const x = (i / 4) % w
    const y = Math.floor((i / 4) / w)
    const key = `${r}-${g}-${b}`
    const existing = map.get(key)
    if (existing) {
      existing.count++
      existing.x = (existing.x + x) / 2
      existing.y = (existing.y + y) / 2
    } else {
      const [h, s, l] = rgbToHsl(r, g, b)
      map.set(key, { r, g, b, count: 1, hue: h, sat: s, lit: l, x, y })
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .map(bucket => ({ ...bucket, count: bucket.count / total }))
}

// ---------- 色彩和谐检测 ----------
function detectColorHarmony(buckets: ColorBucket[]): ColorHarmony {
  const topColors = buckets.slice(0, 10).filter(b => b.sat > 20)
  if (topColors.length < 2) return { type: '单色系', confidence: 90, complementary: null, analogous: [], description: '以单一色彩为主，简洁统一' }

  // 获取主色调的色相
  const hues = topColors.map(b => b.hue)

  // 检测互补色 (180° ± 30°)
  const dominantHue = hues[0]
  const complementaryHue = (dominantHue + 180) % 360
  const hasComplementary = hues.some(h => {
    const diff = Math.abs(h - complementaryHue)
    return diff < 30 || diff > 330
  })

  // 检测类似色 (相邻 60° 以内)
  const analogous = hues.filter(h => {
    const diff = Math.abs(h - dominantHue)
    return diff < 60 || diff > 300
  })

  // 检测分裂互补色 (150°-210° 范围)
  const hasSplitComplementary = hues.some(h => {
    const diff = Math.abs(h - complementaryHue)
    return (diff > 15 && diff < 45) || (diff > 315 && diff < 345)
  })

  // 检测三角调和 (120° ± 20°)
  const triadic = hues.filter(h => {
    const diff1 = Math.abs(h - dominantHue)
    const diff2 = Math.abs(h - (dominantHue + 120) % 360)
    return diff1 < 25 || diff2 < 25
  })

  let type: ColorHarmony['type'] = '单色系'
  let description = '以单一色彩为主，简洁统一'

  if (hasComplementary && analogous.length >= 2) {
    type = '互补对比'
    description = '使用互补色创造强烈视觉对比，富有戏剧性张力'
  } else if (hasComplementary || hasSplitComplementary) {
    type = '互补点缀'
    description = '以互补色作为点缀，打破单调增添活力'
  } else if (triadic.length >= 2) {
    type = '三角调和'
    description = '三种色彩形成平衡三角，画面丰富而不杂乱'
  } else if (analogous.length >= 3) {
    type = '类似渐变'
    description = '相邻色相自然过渡，营造和谐温柔的视觉氛围'
  } else if (analogous.length >= 2) {
    type = '邻近搭配'
    description = '邻近色彩搭配，自然舒适有层次'
  }

  return {
    type,
    confidence: Math.min(95, 60 + topColors.length * 3),
    complementary: hasComplementary ? { hue: Math.round(complementaryHue), present: true } : null,
    analogous: analogous.slice(0, 5).map(h => Math.round(h)),
    description
  }
}

// ---------- 空间分布分析 ----------
function analyzeSpatialDistribution(buckets: ColorBucket[], w: number, h: number): SpatialDistribution {
  const centerX = w / 2
  const centerY = h / 2
  const thirdX1 = w / 3, thirdX2 = w * 2 / 3
  const thirdY1 = h / 3, thirdY2 = h * 2 / 3

  // 计算各区域色彩分布
  let center = 0, top = 0, bottom = 0, left = 0, right = 0, corners = 0

  for (const b of buckets.slice(0, 20)) {
    const cx = b.x - centerX
    const cy = b.y - centerY
    const dist = Math.sqrt(cx * cx + cy * cy)

    if (dist < Math.min(w, h) * 0.25) {
      center += b.count
    } else if (cx * cx / (w * w / 4) + cy * cy / (h * h / 4) < 1) {
      if (cy < -h * 0.15) top += b.count
      else if (cy > h * 0.15) bottom += b.count
      else if (cx < -w * 0.15) left += b.count
      else right += b.count
    } else {
      corners += b.count
    }
  }

  // 三分法兴趣点
  const thirds = [
    { x: thirdX1, y: thirdY1, score: 0 },
    { x: thirdX2, y: thirdY1, score: 0 },
    { x: thirdX1, y: thirdY2, score: 0 },
    { x: thirdX2, y: thirdY2, score: 0 },
  ]

  // 找到最接近兴趣点的显著色彩区域
  for (const b of buckets.slice(0, 30)) {
    for (const t of thirds) {
      const dist = Math.sqrt(Math.pow(b.x - t.x, 2) + Math.pow(b.y - t.y, 2))
      const influence = b.count / (1 + dist / 50)
      t.score += influence
    }
  }

  const dominantRegion = [center, top, bottom, left, right].reduce((max, val, idx, arr) =>
    val > arr[max] ? idx : max, 0)
  const regionNames = ['中心聚焦', '上方延展', '下方稳固', '左侧引导', '右侧展开']

  // 判断是否有明显的主体位置
  let layoutType = '均匀分布'
  if (center > 0.35) layoutType = '中心主体'
  else if (dominantRegion === 1) layoutType = '上方重心'
  else if (dominantRegion === 2) layoutType = '下方重心'
  else if (dominantRegion === 3) layoutType = '左侧布局'
  else if (dominantRegion === 4) layoutType = '右侧布局'
  else if (corners > 0.4) layoutType = '四周发散'

  return {
    layoutType,
    dominantRegion: regionNames[dominantRegion],
    thirdsHotspots: thirds.sort((a, b) => b.score - a.score).map(t => ({
      x: Math.round(t.x), y: Math.round(t.y)
    })),
    centerWeight: Math.round(center * 100),
    balanceScore: Math.round((1 - Math.abs(top - bottom) / ((top + bottom) || 1) * 0.5 - Math.abs(left - right) / ((left + right) || 1) * 0.5) * 100)
  }
}

// ---------- 增强版色彩分析 ----------
function analyzeColorsEnhanced(pixels: Uint8ClampedArray, w: number, h: number): EnhancedColorProfile {
  const buckets = quantizeWithPosition(pixels, w, h, 24)
  const top = buckets.slice(0, 8)

  // 精细主色调
  const dominantColors = top.slice(0, 5).map(b => ({
    hex: rgbToHex(b.r, b.g, b.b),
    percentage: Math.round(b.count * 100),
    name: getFineColorName(b.hue, b.sat, b.lit),
    emoji: getFineColorEmoji(b.hue, b.sat, b.lit),
  }))

  // 精细色彩丰富度（香农熵）
  const probs = buckets.filter(b => b.sat > 15).slice(0, 30).map(b => b.count)
  const entropy = probs.reduce((sum, p) => p > 0 ? sum - p * Math.log2(p) : sum, 0)
  const richness = Math.min(100, Math.round(entropy * 25))

  // 精细冷暖度（考虑明度和彩度修正）
  let warmSum = 0, warmTotal = 0
  for (const b of buckets.slice(0, 20)) {
    // 明度修正：高明度的蓝色偏暖，低明度的红色偏冷
    let tempModifier = 0
    if (b.hue > 200 && b.hue < 260 && b.lit > 60) tempModifier = 0.3 // 亮蓝色偏暖
    if (b.hue > 350 || b.hue < 20) {
      if (b.lit < 40) tempModifier = -0.2 // 暗红色偏冷
    }
    const tempWeight = (b.sat / 100) * (1 - Math.abs(b.lit - 50) / 50) // 彩度高且中等明度时最明显
    const isWarm = (b.hue >= 0 && b.hue < 70) || b.hue > 300
    warmSum += (isWarm ? 1 + tempModifier : 0) * tempWeight * b.count
    warmTotal += tempWeight * b.count
  }
  const warmth = warmTotal > 0 ? Math.round((warmSum / warmTotal) * 100) : 50

  // 对比度（局部+全局）
  const lValues = buckets.slice(0, 30).map(b => b.lit)
  const lMean = lValues.reduce((s, v) => s + v, 0) / (lValues.length || 1)
  const lStd = Math.sqrt(lValues.reduce((s, v) => s + Math.pow(v - lMean, 2), 0) / (lValues.length || 1))

  // 检测是否有明显的高对比区域
  const highContrastRegions = buckets.filter(b =>
    b.lit > 75 || b.lit < 25
  ).reduce((sum, b) => sum + b.count, 0)

  const contrast = Math.min(100, Math.round(lStd * 3 + highContrastRegions * 20))

  // 色彩和谐
  const harmony = detectColorHarmony(buckets)

  // 空间分布
  const spatial = analyzeSpatialDistribution(buckets, w, h)

  // 创作意图推断
  let creativeIntent = ''
  if (spatial.layoutType === '中心主体' && contrast > 50) {
    creativeIntent = '明确主体焦点，强调视觉中心'
  } else if (spatial.layoutType === '均匀分布' && richness > 50) {
    creativeIntent = '探索性表达，色彩分布均衡自由'
  } else if (harmony.type === '互补对比') {
    creativeIntent = '有意图的色彩对比，创造戏剧性效果'
  } else if (spatial.layoutType.includes('重心')) {
    creativeIntent = '有意识的空间布局，视觉引导明确'
  } else {
    creativeIntent = '自然流露的创作风格，真实表达内心'
  }

  return {
    dominantColors,
    richness,
    warmth,
    contrast,
    harmony,
    spatialDistribution: spatial,
    creativeIntent,
    // 保留基础字段
    richnessBasic: Math.min(100, Math.round(buckets.filter(b => b.sat > 15 && b.lit > 10 && b.lit < 90).length / 0.6)),
    warmthBasic: warmth,
    contrastBasic: contrast,
  }
}

// ---------- 增强版构图分析 ----------
function analyzeCompositionEnhanced(
  _ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pixels: Uint8ClampedArray
): EnhancedCompositionProfile {
  // 画面填充率
  let filledPx = 0
  const total = w * h
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3]
    if (a < 128) continue
    if (r < 240 || g < 240 || b < 240) filledPx++
  }
  const fillRate = Math.round((filledPx / total) * 100)

  // 密度
  const gray = new Uint8Array(total)
  for (let i = 0; i < total; i++) {
    gray[i] = Math.round(0.299 * pixels[i * 4] + 0.587 * pixels[i * 4 + 1] + 0.114 * pixels[i * 4 + 2])
  }
  let edgeSum = 0
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const gx = -gray[(y - 1) * w + x - 1] + gray[(y - 1) * w + x + 1]
        - 2 * gray[y * w + x - 1] + 2 * gray[y * w + x + 1]
        - gray[(y + 1) * w + x - 1] + gray[(y + 1) * w + x + 1]
      const gy = -gray[(y - 1) * w + x - 1] - 2 * gray[(y - 1) * w + x] - gray[(y - 1) * w + x + 1]
        + gray[(y + 1) * w + x - 1] + 2 * gray[(y + 1) * w + x] + gray[(y + 1) * w + x + 1]
      const mag = Math.sqrt(gx * gx + gy * gy)
      if (mag > 30) edgeSum++
    }
  }
  const density = Math.min(100, Math.round((edgeSum / total) * 400))

  // 对称性：左右+上下+对角线
  const midX = Math.floor(w / 2), midY = Math.floor(h / 2)
  const leftHist = new Array(16).fill(0), rightHist = new Array(16).fill(0)
  const topHist = new Array(16).fill(0), bottomHist = new Array(16).fill(0)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = Math.floor(gray[y * w + x] / 16)
      if (x < midX) leftHist[idx]++
      else rightHist[idx]++
      if (y < midY) topHist[idx]++
      else bottomHist[idx]++
    }
  }

  const leftTotal = leftHist.reduce((s, v) => s + v, 0) || 1
  const rightTotal = rightHist.reduce((s, v) => s + v, 0) || 1
  const topTotal = topHist.reduce((s, v) => s + v, 0) || 1
  const bottomTotal = bottomHist.reduce((s, v) => s + v, 0) || 1

  let lrDiff = 0, tbDiff = 0
  for (let i = 0; i < 16; i++) {
    lrDiff += Math.abs(leftHist[i] / leftTotal - rightHist[i] / rightTotal)
    tbDiff += Math.abs(topHist[i] / topTotal - bottomHist[i] / bottomTotal)
  }

  const symmetryLR = Math.max(0, Math.round((1 - lrDiff / 2) * 100))
  const symmetryTB = Math.max(0, Math.round((1 - tbDiff / 2) * 100))
  const symmetry = Math.round((symmetryLR + symmetryTB) / 2)

  // 三分法检测：计算兴趣点位置
  const thirdsX = [w / 3, w * 2 / 3]
  const thirdsY = [h / 3, h * 2 / 3]
  let thirdsScore = 0

  // 简化：检测高边缘密度区域是否接近三分线
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const gx = -gray[(y - 1) * w + x - 1] + gray[(y - 1) * w + x + 1] - 2 * gray[y * w + x - 1] + 2 * gray[y * w + x + 1] - gray[(y + 1) * w + x - 1] + gray[(y + 1) * w + x + 1]
      const gy = -gray[(y - 1) * w + x - 1] - 2 * gray[(y - 1) * w + x] - gray[(y - 1) * w + x + 1] + gray[(y + 1) * w + x - 1] + 2 * gray[(y + 1) * w + x] + gray[(y + 1) * w + x + 1]
      const mag = Math.sqrt(gx * gx + gy * gy)
      if (mag > 40) {
        // 检查是否接近三分线
        const nearVLine = Math.abs(x - thirdsX[0]) < w * 0.1 || Math.abs(x - thirdsX[1]) < w * 0.1
        const nearHLine = Math.abs(y - thirdsY[0]) < h * 0.1 || Math.abs(y - thirdsY[1]) < h * 0.1
        if (nearVLine || nearHLine) thirdsScore++
      }
    }
  }
  const ruleOfThirds = Math.min(100, Math.round((thirdsScore / (edgeSum || 1)) * 100))

  // 视觉动线模拟（简化版）
  const visualFlow: VisualFlow = {
    direction: 'center-out',
    strength: Math.round(fillRate * 0.5 + density * 0.3 + (100 - symmetry) * 0.2),
    path: [],
  }

  // 判断主要视觉方向
  if (filledPx > 0) {
    // 计算重心
    let sumX = 0, sumY = 0, weightSum = 0
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4
        if (pixels[idx] < 240 || pixels[idx + 1] < 240 || pixels[idx + 2] < 240) {
          const weight = 255 - (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3
          sumX += x * weight
          sumY += y * weight
          weightSum += weight
        }
      }
    }
    const cx = sumX / (weightSum || 1)
    const cy = sumY / (weightSum || 1)

    if (cx < w * 0.4) visualFlow.direction = 'left-right'
    else if (cx > w * 0.6) visualFlow.direction = 'right-left'
    else if (cy < h * 0.4) visualFlow.direction = 'top-bottom'
    else if (cy > h * 0.6) visualFlow.direction = 'bottom-top'
    else visualFlow.direction = 'center-out'
  }

  // 复杂度
  const complexity = Math.min(100, Math.round((density * 0.5 + fillRate * 0.3 + (100 - symmetry) * 0.2)))

  // 主体识别（简化版：检测高对比中心区域）
  const centerRegion = { x: Math.round(w * 0.3), y: Math.round(h * 0.3), w: Math.round(w * 0.4), h: Math.round(h * 0.4) }
  let centerDetail = 0, outerDetail = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const inCenter = x > centerRegion.x && x < centerRegion.x + centerRegion.w && y > centerRegion.y && y < centerRegion.y + centerRegion.h
      const idx = (y * w + x) * 4
      if (pixels[idx] < 240 || pixels[idx + 1] < 240 || pixels[idx + 2] < 240) {
        if (inCenter) centerDetail++
        else outerDetail++
      }
    }
  }
  const subjectClarity = centerDetail > outerDetail * 0.5 ? '主体明确' : centerDetail > outerDetail * 0.3 ? '有主体倾向' : '散点分布'

  return {
    density,
    symmetry,
    complexity,
    fillRate,
    ruleOfThirds,
    visualFlow,
    spatialDistribution: analyzeSpatialDistribution(quantizeWithPosition(pixels, w, h, 24), w, h),
    symmetryVertical: symmetryTB,
    symmetryHorizontal: symmetryLR,
    subjectClarity,
    // 保留基础字段
    densityBasic: density,
    symmetryBasic: symmetry,
    complexityBasic: complexity,
    fillRateBasic: fillRate,
  }
}

// ---------- WILDER双向映射 ----------
function mapToWILDER(
  color: EnhancedColorProfile,
  composition: EnhancedCompositionProfile,
  existingScores?: Record<string, number>
): WILDERWorkMapping {
  const mapping: WILDERWorkMapping = {
    scores: {},
    traits: [],
    confidenceAdjustment: 0,
    bidirectionalFeedback: [],
  }

  // W(好奇心) - 色彩丰富度、探索欲望
  let wScore = 0
  if (color.richness > 60) wScore += 25
  else if (color.richness > 40) wScore += 15
  if (color.harmony.type === '互补对比' || color.harmony.type === '三角调和') wScore += 20
  if (color.spatialDistribution.layoutType === '均匀分布' || color.spatialDistribution.layoutType === '四周发散') wScore += 15
  wScore = Math.min(100, wScore + (existingScores?.W || 70) * 0.4)
  mapping.scores.W = Math.round(wScore)

  // I(探究力) - 细节密度、观察深度
  let iScore = 0
  if (composition.density > 50) iScore += 25
  else if (composition.density > 35) iScore += 15
  if (composition.subjectClarity === '主体明确') iScore += 20
  if (composition.ruleOfThirds > 60) iScore += 15
  iScore = Math.min(100, iScore + (existingScores?.I || 70) * 0.4)
  mapping.scores.I = Math.round(iScore)

  // L(联结力) - 色彩温暖、情感表达
  let lScore = 0
  if (color.warmth > 55) lScore += 25
  else if (color.warmth > 40) lScore += 15
  if (color.harmony.type === '类似渐变' || color.harmony.type === '邻近搭配') lScore += 15
  if (color.spatialDistribution.layoutType === '中心主体') lScore += 10
  lScore = Math.min(100, lScore + (existingScores?.L || 70) * 0.4)
  mapping.scores.L = Math.round(lScore)

  // D(设计力) - 构图结构、空间规划
  let dScore = 0
  if (composition.symmetry > 60) dScore += 25
  else if (composition.symmetry > 45) dScore += 15
  if (composition.ruleOfThirds > 55) dScore += 20
  if (composition.spatialDistribution?.layoutType && composition.spatialDistribution.layoutType !== '均匀分布') dScore += 15
  dScore = Math.min(100, dScore + (existingScores?.D || 70) * 0.4)
  mapping.scores.D = Math.round(dScore)

  // E(表达力) - 色彩表达、视觉冲击力
  let eScore = 0
  if (color.contrast > 55) eScore += 25
  else if (color.contrast > 40) eScore += 15
  if (color.richness > 50) eScore += 20
  if (color.harmony?.type === '互补对比') eScore += 15
  if (composition.fillRate > 65) eScore += 15
  eScore = Math.min(100, eScore + (existingScores?.E || 70) * 0.4)
  mapping.scores.E = Math.round(eScore)

  // R(反思力) - 层次深度、留白思考
  let rScore = 0
  if (composition.fillRate < 45) rScore += 25
  else if (composition.fillRate < 60) rScore += 15
  if (composition.spatialDistribution?.layoutType === '下方重心' || composition.spatialDistribution?.layoutType === '上方延展') rScore += 15
  if (composition.visualFlow?.direction === 'center-out') rScore += 15
  if (color.creativeIntent?.includes('留白') || color.creativeIntent?.includes('空间')) rScore += 20
  rScore = Math.min(100, rScore + (existingScores?.R || 70) * 0.4)
  mapping.scores.R = Math.round(rScore)

  // 生成特质描述
  if (mapping.scores.W! > 75) mapping.traits.push('色彩探索欲望强烈，对新颜色充满好奇')
  if (mapping.scores.I! > 75) mapping.traits.push('画面细节丰富，观察入微')
  if (mapping.scores.L! > 75) mapping.traits.push('色彩温暖，画面传递积极情感')
  if (mapping.scores.D! > 75) mapping.traits.push('构图工整，有空间规划意识')
  if (mapping.scores.E! > 75) mapping.traits.push('视觉表达冲击力强，色彩运用大胆')
  if (mapping.scores.R! > 75) mapping.traits.push('画面有层次感和思考深度')

  // 双向反馈
  if (existingScores) {
    // 安全获取分数，处理可能缺失的维度
    const safeGet = (key: string, defaultVal = 70) => existingScores[key] ?? defaultVal
    const avgExisting = (safeGet('W') + safeGet('I') + safeGet('L') + safeGet('D') + safeGet('E') + safeGet('R')) / 6
    const avgNew = ((mapping.scores.W ?? 70) + (mapping.scores.I ?? 70) + (mapping.scores.L ?? 70) + (mapping.scores.D ?? 70) + (mapping.scores.E ?? 70) + (mapping.scores.R ?? 70)) / 6
    mapping.confidenceAdjustment = Math.round((avgNew - avgExisting) * 0.15)

    if (mapping.confidenceAdjustment > 5) {
      mapping.bidirectionalFeedback.push('作品分析结果提升了评估置信度')
    } else if (mapping.confidenceAdjustment < -5) {
      mapping.bidirectionalFeedback.push('作品表现与问卷有差异，建议重点关注该维度')
    } else {
      mapping.bidirectionalFeedback.push('作品表现与问卷结果高度一致')
    }
  }

  return mapping
}

// ---------- 综合解读生成 V2.0 ----------
function generateInterpretationV2(
  color: EnhancedColorProfile,
  composition: EnhancedCompositionProfile,
  wilderMapping?: WILDERWorkMapping
): Omit<WorkAnalysisResult, 'colorProfile' | 'compositionProfile'> {
  const tags: string[] = []
  const traits: string[] = []

  // 色彩维度解读
  if (color.richness > 65) {
    tags.push('🎨 色彩丰富')
    traits.push('善于运用多种色彩表达情感，色感敏锐')
  } else if (color.richness > 35) {
    tags.push('🎨 色彩适中')
    traits.push('色彩使用有节制，偏好和谐搭配')
  } else {
    tags.push('🎨 简约用色')
    traits.push('倾向于用少量颜色清晰传达主题')
  }

  if (color.warmth > 65) {
    tags.push('🔥 暖色调主导')
    traits.push('用色充满热情和活力，表达欲望强烈')
  } else if (color.warmth < 35) {
    tags.push('❄️ 冷色调主导')
    traits.push('偏好冷色系，呈现出理性和沉静的审美')
  }

  if (color.contrast > 60) {
    tags.push('⚡ 高对比')
    traits.push('善于利用明暗对比创造视觉冲击力')
  }

  // 色彩和谐解读
  if (color.harmony?.type && color.harmony.type !== '单色系') {
    tags.push(`✨ ${color.harmony.type}`)
    if (color.harmony.description) traits.push(color.harmony.description)
  }

  // 空间布局解读
  if (color.spatialDistribution?.layoutType) {
    tags.push(`📐 ${color.spatialDistribution.layoutType}`)
  }
  if (color.spatialDistribution?.layoutType?.includes('中心')) {
    traits.push('有明确的主体意识，画面焦点突出')
  }

  // 构图维度解读
  if (composition.fillRate > 70) {
    tags.push('🖌️ 大胆铺色')
    traits.push('画面饱满，表达自信，不惧怕空白')
  } else if (composition.fillRate < 30) {
    tags.push('🖌️ 留白取意')
    traits.push('善于留白，画面中有"呼吸感"')
  }

  if (composition.symmetry > 70) {
    tags.push('⚖️ 构图工整')
    traits.push('注重画面平衡，具备空间规划意识')
  } else if (composition.symmetry < 40) {
    tags.push('🎭 自由构图')
    traits.push('构图自由不拘泥对称，想象力丰富')
  }

  if (composition.density > 60) {
    tags.push('🔍 细节丰富')
    traits.push('善于刻画细节，观察力和专注力并重')
  }

  // 三分法解读
  if (composition.ruleOfThirds > 55) {
    traits.push('有意无意地遵循视觉构图法则，画面舒适度高')
  }

  // 视觉动线解读
  const flowDirections: Record<string, string> = {
    'left-right': '从左到右的视觉动线，适合叙事性表达',
    'right-left': '从右到左的视觉引导，有带入感',
    'top-bottom': '从上到下的视角，适合展示宏大场景',
    'bottom-top': '从下往上的视角，有仰望感',
    'center-out': '从中心向外的发散，适合主体突出',
  }
  if (composition.visualFlow?.direction && flowDirections[composition.visualFlow.direction]) {
    traits.push(flowDirections[composition.visualFlow.direction])
  }

  // 表达风格
  let expressionStyle = ''
  if (color.richness > 60 && composition.fillRate > 60) {
    expressionStyle = '热情奔放型——色彩大胆、画面饱满，充分展现内心世界'
  } else if (color.richness < 40 && composition.symmetry > 65) {
    expressionStyle = '精细规划型——用色克制、构图工整，注重秩序和结构'
  } else if (composition.density > 55 && color.contrast > 50) {
    expressionStyle = '观察记录型——善于捕捉细节，画面层次感强'
  } else if (composition.fillRate < 40 && color.warmth > 50) {
    expressionStyle = '意象表达型——善于留白和暗示，赋予画面故事性'
  } else if (composition.ruleOfThirds > 50) {
    expressionStyle = '法则运用型——自然运用构图法则，画面和谐舒适'
  } else {
    expressionStyle = '均衡探索型——在色彩和构图中寻找平衡，处于积极探索阶段'
  }

  // WILDER关联
  if (wilderMapping) {
    if (wilderMapping.traits?.length > 0) {
      traits.push(...wilderMapping.traits)
    }
    if (wilderMapping.bidirectionalFeedback?.length > 0) {
      traits.push(wilderMapping.bidirectionalFeedback[0])
    }
  }

  // 总结
  const summary = `${expressionStyle.split('——')[0]}。` +
    `作品色彩${color.richness > 60 ? '丰富多彩' : color.richness > 35 ? '搭配和谐' : '简洁有力'}，` +
    `画面${composition.fillRate > 60 ? '饱满自信' : composition.fillRate > 35 ? '均衡有序' : '留白雅致'}，` +
    `${composition.density > 50 ? '细节刻画到位' : '整体感强'}。` +
    (color.creativeIntent ? `从作品中可以感受到：${color.creativeIntent}。` : '')

  return { parentTags: tags, summary, creativeTraits: traits, expressionStyle }
}

// ========== 主函数 ==========

const MIN_ANALYSIS_TIME = 3000
const MAX_ANALYSIS_TIME = 4500

export async function analyzeWorkImage(
  file: File,
  wilderScores?: Record<string, number>,
  onProgress?: (stage: string) => void
): Promise<WorkAnalysisResult> {
  const startTime = Date.now()

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = async () => {
      try {
        // 阶段1: 提取色彩
        onProgress?.('extracting_colors')
        await sleep(600)

        const maxDim = 400
        let w = img.width, h = img.height
        if (w > maxDim || h > maxDim) {
          const scale = maxDim / Math.max(w, h)
          w = Math.round(w * scale)
          h = Math.round(h * scale)
        }

        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(url)
          reject(new Error('无法创建 Canvas 2D 上下文'))
          return
        }
        ctx.drawImage(img, 0, 0, w, h)

        const imageData = ctx.getImageData(0, 0, w, h)
        const pixels = imageData.data

        // 增强版色彩分析
        const colorProfile = analyzeColorsEnhanced(pixels, w, h)
        if (!colorProfile || !colorProfile.dominantColors) {
          throw new Error('色彩分析失败')
        }

        // 阶段2: 分析构图
        onProgress?.('analyzing_composition')
        await sleep(600)

        const compositionProfile = analyzeCompositionEnhanced(ctx, w, h, pixels)
        if (!compositionProfile) {
          throw new Error('构图分析失败')
        }

        // 阶段3: WILDER双向映射
        onProgress?.('mapping_wilder')
        await sleep(400)

        const wilderMapping = mapToWILDER(colorProfile, compositionProfile, wilderScores)

        // 阶段4: 生成解读
        onProgress?.('generating_interpretation')
        await sleep(500)

        const interpretation = generateInterpretationV2(colorProfile, compositionProfile, wilderMapping)
        if (!interpretation || !interpretation.parentTags || !interpretation.expressionStyle) {
          throw new Error('解读生成失败')
        }

        // 确保总时间
        const elapsed = Date.now() - startTime
        const remainingTime = Math.max(0, MIN_ANALYSIS_TIME - elapsed)
        const randomExtra = Math.random() * (MAX_ANALYSIS_TIME - MIN_ANALYSIS_TIME)
        await sleep(remainingTime + randomExtra)

        URL.revokeObjectURL(url)
        
        // 正确映射 EnhancedColorProfile 到 ColorProfile
        // 移除 emoji 字段以符合基础类型定义
        const baseColorProfile: ColorProfile = {
          dominantColors: colorProfile.dominantColors.map(c => ({
            hex: c.hex,
            percentage: c.percentage,
            name: c.name,
          })),
          richness: colorProfile.richness,
          warmth: colorProfile.warmth,
          contrast: colorProfile.contrast,
        }
        
        // 正确映射 EnhancedCompositionProfile 到 CompositionProfile
        const baseCompositionProfile: CompositionProfile = {
          density: compositionProfile.density,
          symmetry: compositionProfile.symmetry,
          complexity: compositionProfile.complexity,
          fillRate: compositionProfile.fillRate,
        }
        
        resolve({
          colorProfile: baseColorProfile,
          compositionProfile: baseCompositionProfile,
          ...interpretation,
          // 额外返回增强数据供需要的组件使用
          enhancedData: {
            wilderMapping,
            colorProfile,
            compositionProfile,
          }
        })
      } catch (e) {
        URL.revokeObjectURL(url)
        reject(e)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('无法加载图片文件'))
    }

    img.src = url
  })
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
