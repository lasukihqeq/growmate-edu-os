import { useState, useEffect, useRef } from 'react'
import { Lock, ArrowRight, Brain, CheckCircle2, FileText, FolderOpen, ChevronDown, Shield } from 'lucide-react'
import { validateInviteCode, useInviteCode } from '../lib/tokenManager'
import { WilderLogoHero } from './ui/WilderLogo'

interface InviteGateProps {
  onVerified: () => void
  onShowReport?: () => void
  onShowUserCenter?: () => void
}

export function InviteGate({ onVerified, onShowReport, onShowUserCenter }: InviteGateProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [barFilled, setBarFilled] = useState(false)
  const [showModels, setShowModels] = useState(false)
  const modelsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setBarFilled(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = validateInviteCode(code)

    if (result.valid) {
      if (result.isOneTime) {
        useInviteCode(code)
      }
      onVerified()
    } else {
      setError(result.error || '邀请码无效，请联系GROWMATE工作人员获取')
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)'
        }} />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(0,50,150,0.04) 0%, transparent 70%)'
        }} />
      </div>

      {/* Header - LOGO */}
      <header className="relative z-10 pt-8 pb-2">
        <div className="max-w-md mx-auto flex justify-center">
          <WilderLogoHero variant="blue" size="lg" showGlow={false} />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-5 py-4">
        <div className="w-full max-w-md">

          {/* 英雄图片 */}
          <div className="flex justify-center mb-4">
            <img
              src="/images/hero-potential-discovery.png"
              alt="探索科创潜能的无限可能"
              className="max-h-[240px] w-auto animate-float-slow drop-shadow-[0_0_30px_rgba(20,184,166,0.3)]"
              loading="eager"
            />
          </div>

          {/* 标题区 */}
          <div className="text-center mb-5 animate-slide-up">
            <h1 className="text-2xl font-black text-[#0A0A1A] tracking-tight mb-2">
              GROWMATE · 科创教育入学测评
            </h1>
            <p className="text-sm text-[rgba(10,10,26,0.5)] leading-relaxed">
              基于197模型交叉验证的科创天赋评估系统，20分钟 AI 互动解码科学素养潜能
            </p>
          </div>

          {/* 197模型神经网络交叉验证系统 */}
          <div className="mb-2 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
            {/* 主信任条 - 可点击展开 */}
            <button
              onClick={() => setShowModels(!showModels)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[rgba(59,95,217,0.04)] border border-[rgba(10,10,26,0.06)] rounded-xl hover:bg-[rgba(59,95,217,0.06)] transition-all cursor-pointer"
            >
              <Brain className="w-4.5 h-4.5 text-[#3B5FD9] shrink-0" />
              <span className="text-sm font-semibold text-[#0A0A1A]">197模型神经网络交叉验证</span>
              <div className="flex-1 flex items-center gap-2 justify-end">
                <div className="w-16 h-1.5 bg-[rgba(59,95,217,0.08)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: barFilled ? '98.6%' : '0%' }}
                  />
                </div>
                <span className="text-base font-black text-[#3B5FD9]">98.6%</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[rgba(10,10,26,0.5)] transition-transform duration-300 ${showModels ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* 展开的模型详情 */}
            <div
              ref={modelsRef}
              className="overflow-hidden transition-all duration-300 ease-out"
              style={{ maxHeight: showModels ? `${modelsRef.current?.scrollHeight || 400}px` : '0px', opacity: showModels ? 1 : 0 }}
            >
              <div className="mt-2 p-4 bg-[rgba(59,95,217,0.04)] border border-[rgba(10,10,26,0.06)] rounded-xl space-y-3">
                <div className="text-xs text-[rgba(10,10,26,0.5)] font-medium mb-2">核心验证模型矩阵（8大理论体系）</div>
                {[
                  { name: 'WILDER 六维能力模型', en: '核心框架', weight: 35, color: 'bg-amber-400' },
                  { name: '加德纳多元智能理论', en: 'Gardner MI', weight: 15, color: 'bg-teal-400' },
                  { name: '大五人格模型', en: 'Big Five', weight: 10, color: 'bg-purple-400' },
                  { name: '皮亚杰认知发展理论', en: 'Piaget', weight: 8, color: 'bg-sky-400' },
                  { name: '执行功能评估', en: 'EF Assessment', weight: 8, color: 'bg-rose-400' },
                  { name: 'CHC 认知能力理论', en: 'Cattell-Horn-Carroll', weight: 8, color: 'bg-indigo-400' },
                  { name: '坚毅力理论', en: 'Grit Theory', weight: 8, color: 'bg-orange-400' },
                  { name: '社会情感学习模型', en: 'CASEL SEL', weight: 8, color: 'bg-emerald-400' },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-[120px] shrink-0">
                      <div className="text-xs text-[rgba(10,10,26,0.7)] leading-tight">{m.name}</div>
                      <div className="text-[10px] text-[rgba(10,10,26,0.5)]">{m.en}</div>
                    </div>
                    <div className="flex-1 h-1.5 bg-[rgba(59,95,217,0.06)] rounded-full overflow-hidden">
                      <div className={`h-full ${m.color} rounded-full transition-all duration-700`} style={{ width: barFilled ? `${m.weight}%` : '0%', transitionDelay: `${i * 80}ms` }} />
                    </div>
                    <span className="text-[10px] font-bold text-[rgba(10,10,26,0.5)] w-7 text-right">{m.weight}%</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[rgba(10,10,26,0.04)] flex items-center justify-between">
                  <div className="text-[10px] text-[rgba(10,10,26,0.5)]">
                    <Shield className="w-3 h-3 inline mr-1 text-[#3B5FD9]/70" />
                    融合 197 个子模型 · 动态权重自适应 · 一致性评分机制
                  </div>
                  <div className="text-[10px] text-[#3B5FD9] font-bold">置信度 98.6%</div>
                </div>
              </div>
            </div>
          </div>

          {/* 信任锚点 - 4个内联项 */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-5 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#3B5FD9]/70" />
              <span className="text-[11px] text-[rgba(10,10,26,0.5)]">中科院AI实验室</span>
            </div>
            <span className="text-[rgba(10,10,26,0.2)]">·</span>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#3B5FD9]/70" />
              <span className="text-[11px] text-[rgba(10,10,26,0.5)]">斯坦福d.school</span>
            </div>
            <span className="text-[rgba(10,10,26,0.2)]">·</span>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#3B5FD9]/70" />
              <span className="text-[11px] text-[rgba(10,10,26,0.5)]">STEM教育学会</span>
            </div>
            <span className="text-[rgba(10,10,26,0.2)]">·</span>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#3B5FD9]/70" />
              <span className="text-[11px] text-[rgba(10,10,26,0.5)]">10万+科创测评</span>
            </div>
          </div>

          {/* 邀请码输入区 */}
          <form onSubmit={handleSubmit}>
            <div className="relative mb-3">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(10,10,26,0.35)]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError('') }}
                placeholder="请输入专属邀请码"
                className={`w-full pl-10 pr-4 py-3.5 bg-white border-2 rounded-xl text-[#0A0A1A] text-sm placeholder-slate-400 outline-none transition-all ${
                  error ? 'border-red-400/60 bg-red-50' : 'border-[rgba(10,10,26,0.06)] focus:border-teal-400 focus:ring-2 focus:ring-teal-400/10'
                } ${isShaking ? 'animate-shake' : ''}`}
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mb-3 text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-teal-400 text-white font-bold text-base rounded-xl shadow-lg shadow-[rgba(59,95,217,0.2)]/25 hover:shadow-xl hover:shadow-[rgba(59,95,217,0.2)]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              验证并开始发现
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 次要按钮 */}
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            {onShowReport && (
              <button
                onClick={onShowReport}
                className="py-2.5 bg-[rgba(59,95,217,0.04)] border border-[rgba(10,10,26,0.06)] text-[rgba(10,10,26,0.6)] font-medium text-sm rounded-xl hover:bg-[rgba(59,95,217,0.06)] hover:text-[rgba(10,10,26,0.7)] transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-[rgba(10,10,26,0.35)]" />
                样板报告
              </button>
            )}
            {onShowUserCenter && (
              <button
                onClick={onShowUserCenter}
                className="py-2.5 bg-[rgba(59,95,217,0.04)] border border-[rgba(10,10,26,0.06)] text-[rgba(10,10,26,0.6)] font-medium text-sm rounded-xl hover:bg-[rgba(59,95,217,0.06)] hover:text-[rgba(10,10,26,0.7)] transition-all flex items-center justify-center gap-2"
              >
                <FolderOpen className="w-4 h-4 text-[rgba(10,10,26,0.35)]" />
                我的报告
              </button>
            )}
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="relative z-10 pb-6 pt-4 text-center">
        <p className="text-xs text-[rgba(10,10,26,0.5)] mb-1">
          邀请码由GROWMATE工作人员提供 · 如有疑问请联系课程顾问
        </p>
        <p className="text-xs text-[rgba(10,10,26,0.35)]">
          © {new Date().getFullYear()} GROWMATE科创教育 · 科学评估 · 精准培养
        </p>
      </footer>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}
