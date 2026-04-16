// ===================================================================
// 动态沙盘推演系统 - 决策反馈动画组件
// 粒子爆发 + XP飞入 + 连击火焰
// ===================================================================

import React, { useEffect, useMemo, useRef } from 'react'

/* ========== WILDER 维度色系 ========== */
const WILDER_COLORS: Record<string, string> = {
  W: '#F59E0B', // 意志力 - 琥珀
  I: '#3B82F6', // 洞察力 - 蓝
  L: '#8B5CF6', // 领导力 - 紫
  D: '#10B981', // 驱动力 - 翠绿
  E: '#EF4444', // 共情力 - 红
  R: '#06B6D4', // 韧性   - 青
}

/** 默认回退色（无维度匹配时） */
const FALLBACK_COLOR = '#94A3B8'

/* ========== Props ========== */
interface DecisionFeedbackProps {
  /** 用户选中的选项 ID */
  selectedOptionId: string
  /** 该选项的 WILDER 维度得分 */
  dimensionScores: Record<string, number>
  /** 本次获得的 XP */
  xpGain: number
  /** 当前连击数 */
  combo: number
  /** 动画完成回调 */
  onDone: () => void
}

/* ========== 粒子数据 ========== */
interface Particle {
  id: number
  color: string
  tx: number  // 水平偏移 px
  ty: number  // 垂直偏移 px
  size: number
  delay: number
  shape: 'circle' | 'star' | 'diamond'
}

/** 根据维度得分生成粒子 */
function generateParticles(dimensionScores: Record<string, number>, count: number): Particle[] {
  // 按得分排序维度，得分高的维度产生更多粒子
  const entries = Object.entries(dimensionScores).sort((a, b) => b[1] - a[1])
  const totalScore = entries.reduce((sum, [, v]) => sum + Math.abs(v), 0) || 1
  const shapes: Particle['shape'][] = ['circle', 'star', 'diamond']

  const particles: Particle[] = []
  let id = 0

  for (const [dim, score] of entries) {
    // 按维度得分占比分配粒子数量，至少 1 个
    const dimCount = Math.max(1, Math.round((Math.abs(score) / totalScore) * count))
    const color = WILDER_COLORS[dim] ?? FALLBACK_COLOR

    for (let i = 0; i < dimCount && particles.length < count; i++) {
      const angle = (Math.PI * 2 * Math.random())
      const distance = 40 + Math.random() * 80
      particles.push({
        id: id++,
        color,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        size: 5 + Math.random() * 6,
        delay: Math.random() * 0.15,
        shape: shapes[id % shapes.length],
      })
    }
  }

  // 如果维度为空或不足，补齐默认粒子
  while (particles.length < count) {
    const angle = Math.PI * 2 * Math.random()
    const distance = 40 + Math.random() * 80
    particles.push({
      id: id++,
      color: FALLBACK_COLOR,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      size: 5 + Math.random() * 6,
      delay: Math.random() * 0.15,
      shape: shapes[id % shapes.length],
    })
  }

  return particles
}

/** 取主维度（得分最高的） */
function getPrimaryDimension(scores: Record<string, number>): string | null {
  let best: string | null = null
  let bestVal = -Infinity
  for (const [k, v] of Object.entries(scores)) {
    if (v > bestVal) {
      bestVal = v
      best = k
    }
  }
  return best
}

/* ========== 决策反馈动画组件 ========== */
export const DecisionFeedback: React.FC<DecisionFeedbackProps> = ({
  selectedOptionId,
  dimensionScores,
  xpGain,
  combo,
  onDone,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // 动画总时长 ~1.5 秒后回调
  useEffect(() => {
    timerRef.current = setTimeout(onDone, 1500)
    return () => clearTimeout(timerRef.current)
  }, [onDone])

  // 生成粒子（稳定引用，不随 re-render 变化）
  const particles = useMemo(
    () => generateParticles(dimensionScores, 18),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedOptionId],
  )

  const primaryDim = getPrimaryDimension(dimensionScores)
  const primaryColor = primaryDim ? WILDER_COLORS[primaryDim] ?? FALLBACK_COLOR : FALLBACK_COLOR
  const showComboFire = combo >= 3

  return (
    <div
      className="relative flex items-center justify-center pointer-events-none select-none"
      aria-live="polite"
      aria-label={`+${xpGain} XP${showComboFire ? `, combo x${combo}` : ''}`}
    >
      {/* ---- 1. 粒子爆发效果 ---- */}
      <div className="absolute inset-0 flex items-center justify-center">
        {particles.map(p => (
          <span
            key={p.id}
            className={`particle-burst ${p.shape === 'star' ? 'shape-star' : p.shape === 'diamond' ? 'shape-diamond' : ''}`}
            style={{
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
              backgroundColor: p.color,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ---- 2. XP 飞入数字 ---- */}
      <span
        key={`xp-${selectedOptionId}`}
        className="animate-xp-float text-lg font-black drop-shadow-md"
        style={{ color: primaryColor }}
      >
        +{xpGain} XP
      </span>

      {/* ---- 3. 连击火焰效果（combo >= 3） ---- */}
      {showComboFire && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-combo-fire">
          <div
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-white text-xs font-black shadow-lg"
            style={{
              background: `linear-gradient(135deg, #F97316, #EF4444)`,
              boxShadow: `0 0 12px rgba(249,115,22,0.5)`,
            }}
          >
            <ComboFlameIcon />
            <span>x{combo}</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ========== 火焰 SVG 图标（内联，轻量） ========== */
function ComboFlameIcon() {
  return (
    <svg
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M6 0C6 0 2 4.5 2 8C2 10.2 3.8 12 6 12C8.2 12 10 10.2 10 8C10 4.5 6 0 6 0ZM6 10.5C4.6 10.5 3.5 9.4 3.5 8C3.5 6.3 5.2 3.8 6 2.7C6.8 3.8 8.5 6.3 8.5 8C8.5 9.4 7.4 10.5 6 10.5Z"
        fill="white"
        fillOpacity="0.9"
      />
    </svg>
  )
}

export default DecisionFeedback
