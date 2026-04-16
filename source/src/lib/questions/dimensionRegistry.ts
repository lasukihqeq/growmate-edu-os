// ===================================================================
// 维度注册中心 v1.0
// 所有合法维度 key 的单一数据源
// 解决 E_bf/E 命名冲突、未使用维度管理等问题
// ===================================================================

// ========== WILDER 六维（核心评测维度） ==========

export const WILDER_DIM_KEYS = ['W', 'I', 'L', 'D', 'E', 'R'] as const
export type WilderDimKey = (typeof WILDER_DIM_KEYS)[number]

// ========== Layer2 子维度（25 个活跃 + 3 个废弃） ==========

export const LAYER2_DIM_KEYS = [
  // W — 好奇心与探索欲
  'W_obs', 'W_quest', 'W_imag', 'W_curi', 'W_sens',
  // I — 探究与求证能力
  'I_hyp', 'I_ver', 'I_ana', 'I_reas', 'I_exp',
  // L — 协作与连接力
  'L_coll', 'L_comm', 'L_emp', 'L_pers', 'L_neg',
  // D — 规划与设计力
  'D_plan', 'D_org', 'D_dec', 'D_res',
  // E — 表达与呈现力
  'E_verb', 'E_writ', 'E_vis', 'E_crea',
  // R — 反思与自我调节
  'R_self', 'R_meta', 'R_attr', 'R_grow',
] as const
export type Layer2DimKey = (typeof LAYER2_DIM_KEYS)[number]

/** 废弃但仍兼容的 Layer2 维度（定义过但题库中从未使用） */
export const DEPRECATED_DIM_KEYS = ['W_nov', 'D_deci', 'E_phys'] as const
export type DeprecatedDimKey = (typeof DEPRECATED_DIM_KEYS)[number]

// ========== 大五人格（注意: E_bf 专用于 BigFive 外向性，区别于 WILDER 的 E） ==========

export const BIGFIVE_DIM_KEYS = ['O', 'C', 'E_bf', 'A', 'N'] as const
export type BigFiveDimKey = (typeof BIGFIVE_DIM_KEYS)[number]

// ========== 多元智能 ==========

export const MI_DIM_KEYS = [
  'linguistic', 'logicalMath', 'spatial', 'musical',
  'bodilyKinesthetic', 'interpersonal', 'intrapersonal', 'naturalist',
] as const
export type MIDimKey = (typeof MI_DIM_KEYS)[number]

// ========== 认知发展 ==========

export const COGNITIVE_DIM_KEYS = ['conservation', 'deduction', 'hypothesis', 'metacognition'] as const
export type CognitiveDimKey = (typeof COGNITIVE_DIM_KEYS)[number]

// ========== 执行功能 ==========

export const EF_DIM_KEYS = ['inhibition', 'flexibility'] as const
export type EFDimKey = (typeof EF_DIM_KEYS)[number]

// ========== 新模型维度（CHC / Grit / SEL） ==========

export const CHC_DIM_KEYS = ['Gf', 'Gc'] as const
export const GRIT_DIM_KEYS = ['grit_passion', 'grit_perseverance'] as const
export const SEL_DIM_KEYS = [
  'sel_selfAwareness', 'sel_selfManagement', 'sel_socialAwareness',
  'sel_relationshipSkills', 'sel_responsibleDecision',
] as const

export const NEW_MODEL_DIM_KEYS = [
  ...CHC_DIM_KEYS, ...GRIT_DIM_KEYS, ...SEL_DIM_KEYS,
] as const

// ========== 合法维度汇总集合 ==========

export const ALL_VALID_DIM_KEYS: ReadonlySet<string> = new Set([
  ...WILDER_DIM_KEYS,
  ...LAYER2_DIM_KEYS,
  ...DEPRECATED_DIM_KEYS,
  ...BIGFIVE_DIM_KEYS,
  ...MI_DIM_KEYS,
  ...COGNITIVE_DIM_KEYS,
  ...EF_DIM_KEYS,
  ...NEW_MODEL_DIM_KEYS,
])

/** 用于 LAYER2_KEYS 向后兼容（含废弃维度） */
export const LAYER2_KEYS_COMPAT = [
  ...LAYER2_DIM_KEYS,
  ...DEPRECATED_DIM_KEYS,
] as const

// ========== 维度分类枚举 ==========

export type DimCategory =
  | 'wilder' | 'layer2' | 'bigfive' | 'mi'
  | 'cognitive' | 'ef' | 'chc' | 'grit' | 'sel'
  | 'deprecated' | 'unknown'

// ========== 工具函数 ==========

const _deprecatedSet = new Set<string>(DEPRECATED_DIM_KEYS)
const _wilderSet = new Set<string>(WILDER_DIM_KEYS)
const _layer2Set = new Set<string>(LAYER2_DIM_KEYS)
const _bigfiveSet = new Set<string>(BIGFIVE_DIM_KEYS)
const _miSet = new Set<string>(MI_DIM_KEYS)
const _cognitiveSet = new Set<string>(COGNITIVE_DIM_KEYS)
const _efSet = new Set<string>(EF_DIM_KEYS)
const _chcSet = new Set<string>(CHC_DIM_KEYS)
const _gritSet = new Set<string>(GRIT_DIM_KEYS)
const _selSet = new Set<string>(SEL_DIM_KEYS)

/** 检查维度 key 是否合法（包含废弃维度） */
export function isDimValid(key: string): boolean {
  return ALL_VALID_DIM_KEYS.has(key)
}

/** 检查维度 key 是否已废弃 */
export function isDimDeprecated(key: string): boolean {
  return _deprecatedSet.has(key)
}

/** 获取维度所属分类 */
export function getDimCategory(key: string): DimCategory {
  if (_wilderSet.has(key)) return 'wilder'
  if (_layer2Set.has(key)) return 'layer2'
  if (_deprecatedSet.has(key)) return 'deprecated'
  if (_bigfiveSet.has(key)) return 'bigfive'
  if (_miSet.has(key)) return 'mi'
  if (_cognitiveSet.has(key)) return 'cognitive'
  if (_efSet.has(key)) return 'ef'
  if (_chcSet.has(key)) return 'chc'
  if (_gritSet.has(key)) return 'grit'
  if (_selSet.has(key)) return 'sel'
  return 'unknown'
}

/** 获取 Layer2 维度对应的 WILDER 父维度 */
export function getParentWilderDim(layer2Key: string): WilderDimKey | null {
  if (!layer2Key.includes('_')) return null
  const prefix = layer2Key.charAt(0) as WilderDimKey
  if (_wilderSet.has(prefix)) return prefix
  return null
}

/** 获取某模型允许使用的 score key 白名单 */
export function getModelAllowedKeys(model: string): ReadonlySet<string> {
  const base = new Set<string>([...WILDER_DIM_KEYS, ...LAYER2_DIM_KEYS, ...DEPRECATED_DIM_KEYS])

  switch (model) {
    case 'MI':
      MI_DIM_KEYS.forEach(k => base.add(k))
      break
    case 'BigFive':
      BIGFIVE_DIM_KEYS.forEach(k => base.add(k))
      break
    case 'Cognitive':
      COGNITIVE_DIM_KEYS.forEach(k => base.add(k))
      break
    case 'EF':
      EF_DIM_KEYS.forEach(k => base.add(k))
      break
    case 'CHC':
      CHC_DIM_KEYS.forEach(k => base.add(k))
      break
    case 'Grit':
      GRIT_DIM_KEYS.forEach(k => base.add(k))
      break
    case 'SEL':
      SEL_DIM_KEYS.forEach(k => base.add(k))
      break
    case 'WILDER':
    case 'WILDER-L2':
      // 已包含在 base 中
      break
    case 'RIASEC':
      // RIASEC 维度暂未定义，允许所有
      return ALL_VALID_DIM_KEYS
    default:
      return ALL_VALID_DIM_KEYS
  }

  return base
}
