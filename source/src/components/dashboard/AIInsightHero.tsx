import { Sparkles } from 'lucide-react'

interface AIInsightHeroProps {
  talentType: string
  coreInsight: string
  confidence: number
  profileCode: string
}

export function AIInsightHero({ talentType, coreInsight, confidence, profileCode }: AIInsightHeroProps) {
  const circumference = 2 * Math.PI * 36
  const strokeDashoffset = circumference * (1 - confidence / 100)

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0A0A1A] p-6 lg:p-8">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(59,95,217,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[radial-gradient(circle,rgba(255,184,0,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
        {/* Left: Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[#FFB800]" />
            <span className="text-xs font-medium text-[#FFB800] tracking-wider uppercase">AI Insight</span>
          </div>

          <h2 className="text-xl lg:text-2xl font-bold text-white mb-2 tracking-tight">
            {talentType}
          </h2>

          <p className="text-sm text-white/60 leading-relaxed mb-4 line-clamp-3">
            {coreInsight || '基于 WILDER 六维度评估模型的综合分析结果。'}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/10 text-white/70">
              {profileCode}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--ws-primary)]/20 text-[#7B9AFF]">
              WILDER-729
            </span>
          </div>
        </div>

        {/* Right: Confidence ring */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              {/* Background ring */}
              <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
              {/* Progress ring */}
              <circle
                cx="40" cy="40" r="36" fill="none"
                stroke="url(#confidence-gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="confidence-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B5FD9" />
                  <stop offset="100%" stopColor="#7B9AFF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{confidence}</span>
              <span className="text-[10px] text-white/40">置信度</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
