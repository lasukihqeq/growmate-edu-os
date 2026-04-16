const WILDER_COLORS: Record<string, string> = {
  W: '#F59E0B', I: '#3B82F6', L: '#10B981', D: '#8B5CF6', E: '#EF4444', R: '#06B6D4',
}

const WILDER_NAMES: Record<string, string> = {
  W: '好奇心', I: '探究力', L: '连接力', D: '设计力', E: '表达力', R: '反思力',
}

const WILDER_NAMES_EN: Record<string, string> = {
  W: 'Wonder', I: 'Inquiry', L: 'Link', D: 'Design', E: 'Expression', R: 'Reflection',
}

interface WilderRadarSectionProps {
  wilderScores: Record<string, number>
  wilderLevels: Record<string, string>
  sortedDims: { key: string; name: string; score: number; level: string }[]
}

// SVG radar chart constants
const CENTER = 120
const RADIUS = 90
const DIMS = ['W', 'I', 'L', 'D', 'E', 'R']

function polarToXY(angle: number, r: number): [number, number] {
  const rad = ((angle - 90) * Math.PI) / 180
  return [CENTER + r * Math.cos(rad), CENTER + r * Math.sin(rad)]
}

function getPolygonPoints(scores: Record<string, number>, maxVal: number): string {
  return DIMS.map((dim, i) => {
    const angle = (360 / 6) * i
    const val = Math.max(0, Math.min(scores[dim] || 0, maxVal))
    const r = (val / maxVal) * RADIUS
    const [x, y] = polarToXY(angle, r)
    return `${x},${y}`
  }).join(' ')
}

function getLevelColor(level: string) {
  switch (level) {
    case 'high': return 'bg-[var(--ws-score-high-bg)] text-[var(--ws-score-high)]'
    case 'mid': return 'bg-[var(--ws-score-mid-bg)] text-[var(--ws-score-mid)]'
    case 'low': return 'bg-[var(--ws-score-low-bg)] text-[var(--ws-score-low)]'
    default: return 'bg-gray-100 text-gray-500'
  }
}

function getLevelLabel(level: string) {
  switch (level) {
    case 'high': return '优秀'
    case 'mid': return '良好'
    case 'low': return '待发展'
    default: return '-'
  }
}

export function WilderRadarSection({ wilderScores, wilderLevels, sortedDims }: WilderRadarSectionProps) {
  // Grid lines (3 concentric hexagons at 33%, 66%, 100%)
  const gridLevels = [0.33, 0.66, 1]

  return (
    <div className="rounded-2xl bg-white border border-[var(--ws-border-soft)] p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-5 rounded-full bg-[var(--ws-primary)]" />
        <h3 className="text-base font-semibold text-[var(--ws-text-primary)]">WILDER 能力画像</h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Radar chart */}
        <div className="flex-shrink-0">
          <svg width="240" height="240" viewBox="0 0 240 240">
            {/* Grid hexagons */}
            {gridLevels.map((level, gi) => {
              const r = RADIUS * level
              const points = DIMS.map((_, i) => {
                const angle = (360 / 6) * i
                const [x, y] = polarToXY(angle, r)
                return `${x},${y}`
              }).join(' ')
              return (
                <polygon
                  key={gi}
                  points={points}
                  fill="none"
                  stroke="rgba(10,10,26,0.06)"
                  strokeWidth="1"
                />
              )
            })}

            {/* Axis lines */}
            {DIMS.map((_, i) => {
              const angle = (360 / 6) * i
              const [x, y] = polarToXY(angle, RADIUS)
              return (
                <line
                  key={i}
                  x1={CENTER} y1={CENTER} x2={x} y2={y}
                  stroke="rgba(10,10,26,0.06)" strokeWidth="1"
                />
              )
            })}

            {/* Data polygon */}
            <polygon
              points={getPolygonPoints(wilderScores, 100)}
              fill="rgba(59,95,217,0.12)"
              stroke="#3B5FD9"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Data points & labels */}
            {DIMS.map((dim, i) => {
              const angle = (360 / 6) * i
              const val = Math.max(0, Math.min(wilderScores[dim] || 0, 100))
              const r = (val / 100) * RADIUS
              const [px, py] = polarToXY(angle, r)
              const [lx, ly] = polarToXY(angle, RADIUS + 18)
              return (
                <g key={dim}>
                  <circle cx={px} cy={py} r="4" fill={WILDER_COLORS[dim]} stroke="white" strokeWidth="2" />
                  <text
                    x={lx} y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[10px] font-semibold"
                    fill={WILDER_COLORS[dim]}
                  >
                    {dim}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Dimension list */}
        <div className="flex-1 w-full space-y-3">
          {(sortedDims.length > 0 ? sortedDims : DIMS.map(d => ({
            key: d, name: WILDER_NAMES[d], score: wilderScores[d] || 0, level: wilderLevels[d] || 'mid'
          }))).map(dim => (
            <div key={dim.key} className="flex items-center gap-3">
              {/* Color dot */}
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: WILDER_COLORS[dim.key] }} />

              {/* Name */}
              <div className="w-24 flex-shrink-0">
                <p className="text-sm font-medium text-[var(--ws-text-primary)]">{WILDER_NAMES[dim.key] || dim.name}</p>
                <p className="text-[10px] text-[var(--ws-text-muted)]">{WILDER_NAMES_EN[dim.key] || dim.key}</p>
              </div>

              {/* Progress bar */}
              <div className="flex-1 min-w-0">
                <div className="h-2 rounded-full bg-[rgba(10,10,26,0.04)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${dim.score}%`, background: WILDER_COLORS[dim.key] }}
                  />
                </div>
              </div>

              {/* Score */}
              <span className="text-sm font-semibold text-[var(--ws-text-primary)] w-8 text-right">
                {Math.round(dim.score)}
              </span>

              {/* Level badge */}
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${getLevelColor(dim.level)}`}>
                {getLevelLabel(dim.level)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
