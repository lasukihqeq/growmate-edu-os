import { useState, useEffect, useRef } from 'react'
import type { AttentionProfile, AttentionDimension } from '../types/newFeatures'
import { estimateAttentionFromWilder } from '../lib/attentionAssessmentQuestions'

// ========== 专注力/注意力模式评估展示组件 ==========

// 维度配置
const DIM_VISUAL: Record<string, { gradient: string; bg: string; ring: string }> = {
  sustained:      { gradient: 'from-sky-400 to-blue-600',    bg: 'bg-sky-50',    ring: '#3b82f6' },
  selective:      { gradient: 'from-violet-400 to-purple-600', bg: 'bg-violet-50', ring: '#8b5cf6' },
  impulse:        { gradient: 'from-rose-400 to-red-500',    bg: 'bg-rose-50',   ring: '#ef4444' },
  working_memory: { gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-50',  ring: '#f59e0b' },
  cognitive_flex: { gradient: 'from-emerald-400 to-teal-600', bg: 'bg-emerald-50', ring: '#14b8a6' },
}

const LEVEL_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  strong:        { label: '优势', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  developing:    { label: '发展中', color: 'text-amber-700', bg: 'bg-amber-100' },
  'needs-support': { label: '需关注', color: 'text-rose-700', bg: 'bg-rose-100' },
}

const OVERALL_STATUS: Record<string, { label: string; icon: string; gradient: string; desc: string }> = {
  green:  { label: '整体良好', icon: '🟢', gradient: 'from-emerald-500 to-teal-500', desc: '各维度发展均衡，无需特别干预' },
  yellow: { label: '部分关注', icon: '🟡', gradient: 'from-amber-500 to-orange-500', desc: '个别维度需要有针对性的支持' },
  red:    { label: '重点关注', icon: '🔴', gradient: 'from-rose-500 to-red-600',   desc: '多项维度需要重点关注，建议咨询专业人士' },
}

// --------- 圆环进度条 ---------
function DimensionRing({ dim, delay, animate }: { dim: AttentionDimension; delay: number; animate: boolean }) {
  const [progress, setProgress] = useState(0)
  const visual = DIM_VISUAL[dim.id] || DIM_VISUAL.sustained
  const badge = LEVEL_BADGE[dim.level] || LEVEL_BADGE.developing

  useEffect(() => {
    if (!animate) { setProgress(dim.score); return }
    const t = setTimeout(() => setProgress(dim.score), delay)
    return () => clearTimeout(t)
  }, [animate, dim.score, delay])

  const r = 38, c = 2 * Math.PI * r
  const offset = c - (c * progress) / 100

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke={visual.ring}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-gray-800">{Math.round(progress)}</span>
          <span className="text-[9px] text-gray-400 -mt-0.5">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-gray-700">{dim.name}</p>
        <p className="text-[10px] text-gray-400">{dim.nameEn}</p>
        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.color}`}>
          {badge.label}
        </span>
      </div>
    </div>
  )
}

// --------- 维度详情卡 ---------
function DimensionDetailCard({ dim }: { dim: AttentionDimension }) {
  const visual = DIM_VISUAL[dim.id] || DIM_VISUAL.sustained
  const badge = LEVEL_BADGE[dim.level] || LEVEL_BADGE.developing

  return (
    <div className={`rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${visual.bg}`}>
      <div className={`h-1 bg-gradient-to-r ${visual.gradient}`} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{dim.id === 'sustained' ? '⏱️' : dim.id === 'selective' ? '🎯' : dim.id === 'impulse' ? '🛡️' : dim.id === 'working_memory' ? '🧠' : '🔄'}</span>
            <div>
              <h5 className="font-bold text-sm text-gray-800">{dim.name}</h5>
              <p className="text-[10px] text-gray-400">{dim.nameEn}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-black" style={{ color: visual.ring }}>{dim.score}</span>
            <span className={`block text-[10px] font-bold px-1.5 py-0.5 rounded-full ${badge.bg} ${badge.color}`}>{badge.label}</span>
          </div>
        </div>
        {/* 进度条 */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${visual.gradient} transition-all duration-700`}
            style={{ width: `${dim.score}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mb-3">{dim.description}</p>
        {dim.strategies.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">支持策略</p>
            {dim.strategies.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="mt-0.5 w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white bg-gradient-to-br" style={{ background: visual.ring }}>
                  {i + 1}
                </span>
                <span className="leading-relaxed">{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// --------- 五角雷达图（纯SVG） ---------
function AttentionRadar({ dimensions }: { dimensions: AttentionDimension[] }) {
  const cx = 130, cy = 130, R = 100
  const count = dimensions.length
  if (count === 0) return null

  const points = dimensions.map((d, i) => {
    const angle = (i * 360 / count - 90) * (Math.PI / 180)
    const r = R * d.score / 100
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1]

  return (
    <svg viewBox="0 0 260 260" className="w-full max-w-[260px] mx-auto">
      <defs>
        <radialGradient id="att-radar-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(99,102,241,0.08)" />
          <stop offset="60%" stopColor="rgba(139,92,246,0.04)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="att-radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(99,102,241,0.35)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0.15)" />
        </linearGradient>
        <linearGradient id="att-radar-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      {/* 背景光晕 */}
      <circle cx={cx} cy={cy} r={R * 1.2} fill="url(#att-radar-bg)" />
      {/* 虚线网格 */}
      {gridLevels.map((level, li) => (
        <polygon
          key={li}
          points={dimensions.map((_, i) => {
            const angle = (i * 360 / count - 90) * (Math.PI / 180)
            const r = R * level
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
          }).join(' ')}
          fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="1" strokeDasharray="4 4"
        />
      ))}
      {/* 轴线 */}
      {dimensions.map((_, i) => {
        const angle = (i * 360 / count - 90) * (Math.PI / 180)
        return (
          <line key={i}
            x1={cx} y1={cy}
            x2={cx + R * Math.cos(angle)} y2={cy + R * Math.sin(angle)}
            stroke="rgba(148,163,184,0.2)" strokeWidth="1"
          />
        )
      })}
      {/* 数据区域（渐变填充） */}
      <polygon
        points={points.map(p => `${p.x},${p.y}`).join(' ')}
        fill="url(#att-radar-fill)" stroke="url(#att-radar-stroke)" strokeWidth="2.5"
      />
      {/* 数据点（白色外圈+颜色内圈） */}
      {points.map((p, i) => {
        const score = dimensions[i].score
        const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#8b5cf6'
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            <circle cx={p.x} cy={p.y} r="3.5" fill={color} />
          </g>
        )
      })}
      {/* 标签 */}
      {dimensions.map((d, i) => {
        const angle = (i * 360 / count - 90) * (Math.PI / 180)
        const labelR = R + 24
        const x = cx + labelR * Math.cos(angle)
        const y = cy + labelR * Math.sin(angle) + 4
        const isHigh = d.score >= 80
        return (
          <g key={i}>
            {isHigh && (
              <rect x={x - 24} y={y - 9} width="48" height="18" rx="9" fill="rgba(254,243,199,0.9)" />
            )}
            <text x={x} y={y} textAnchor="middle" className={`text-[10px] font-bold ${isHigh ? 'fill-amber-700' : 'fill-gray-500'}`}>
              {d.name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ========== 主组件 ==========

interface Props {
  wilderScores: Record<string, number>
  efAnalysis?: { inhibition: { level: string; score: number }; flexibility: { level: string; score: number } }
  studentName: string
}

export function AttentionProfileSection({ wilderScores, efAnalysis, studentName }: Props) {
  const profile: AttentionProfile = estimateAttentionFromWilder(wilderScores, efAnalysis)
  const [animate, setAnimate] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  // 滚动进入视口时触发动画
  useEffect(() => {
    if (!sectionRef.current || hasAnimated.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          setAnimate(true)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const status = OVERALL_STATUS[profile.overallLevel] || OVERALL_STATUS.green

  return (
    <section ref={sectionRef} id="section-attention" className="page-break">
      <div
        className="rpt-section-title flex items-center gap-2"
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)' }}
      >
        <span className="text-xl">🧩</span>
        <span className="mx-2">|</span>
        <span>注意力模式评估</span>
      </div>

      <div className="rpt-section-content">
        {/* 说明卡 */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-4 mb-5 border border-indigo-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0 mt-0.5">
              🧩
            </div>
            <div>
              <h4 className="font-bold text-sm text-indigo-900 mb-1">什么是注意力模式评估？</h4>
              <p className="text-xs text-indigo-700 leading-relaxed">
                注意力不是一个单一能力，而是由5个维度组成的复杂系统。我们基于{studentName}的WILDER评估数据，
                推算其注意力模式特征，帮助家长理解孩子在不同场景下的注意力表现差异，并提供个性化的支持策略。
              </p>
            </div>
          </div>
        </div>

        {/* 总体状态指示器 */}
        <div className="flex justify-center mb-6">
          <div className={`inline-flex items-center gap-4 bg-gradient-to-r ${status.gradient} rounded-2xl px-6 py-3.5 text-white shadow-lg`}>
            <span className="text-2xl">{status.icon}</span>
            <div>
              <div className="text-lg font-black">{status.label}</div>
              <div className="text-xs text-white/80">{status.desc}</div>
            </div>
          </div>
        </div>

        {/* 摘要 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 shadow-sm">
          <p className="text-sm text-gray-700 leading-relaxed text-center">{profile.summary}</p>
        </div>

        {/* 五维度圆环 + 雷达图 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* 圆环组 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h4 className="font-bold text-sm text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center text-white text-[10px]">📊</span>
              五维度评分
            </h4>
            <div className="flex flex-wrap justify-center gap-4">
              {profile.dimensions.map((dim, i) => (
                <DimensionRing key={dim.id} dim={dim} delay={200 + i * 200} animate={animate} />
              ))}
            </div>
          </div>

          {/* 雷达图 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h4 className="font-bold text-sm text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-violet-500 rounded-md flex items-center justify-center text-white text-[10px]">🎯</span>
              注意力模式雷达图
            </h4>
            <AttentionRadar dimensions={profile.dimensions} />
          </div>
        </div>

        {/* 展开详情按钮 */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-2.5 text-sm text-indigo-600 font-medium bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors mb-5"
        >
          {showDetails ? '收起维度详情 ↑' : '查看各维度详情与支持策略 →'}
        </button>

        {/* 维度详情卡片 */}
        {showDetails && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 animate-fadeIn">
            {profile.dimensions.map(dim => (
              <DimensionDetailCard key={dim.id} dim={dim} />
            ))}
          </div>
        )}

        {/* 推荐策略 */}
        {profile.recommendations.length > 0 && (
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-5 border border-violet-100 mb-5">
            <h4 className="font-bold text-sm text-violet-800 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-violet-500 rounded-md flex items-center justify-center text-white text-[10px]">💡</span>
              优先行动建议
            </h4>
            <div className="space-y-2">
              {profile.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                  <span className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 免责声明 */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-start gap-2">
            <span className="text-sm mt-0.5">⚠️</span>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              {profile.disclaimer}
            </p>
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-3 text-center">
          <p className="text-[10px] text-gray-400">
            基于 WILDER 六维模型 · 执行功能评估 · 注意力五维度模型 推算生成
          </p>
        </div>
      </div>
    </section>
  )
}
