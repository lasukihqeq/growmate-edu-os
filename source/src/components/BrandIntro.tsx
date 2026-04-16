import { TreePine, ArrowRight, Shield, Award, BookOpen, CheckCircle2, Star } from 'lucide-react'

interface BrandIntroProps {
  onStart: () => void
}

export function BrandIntro({ onStart }: BrandIntroProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-blue-500 via-brand-blue-600 to-brand-blue-700 flex flex-col">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3B5FD9]/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
            <TreePine className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">GROWMATE</h1>
            <p className="text-xs text-white/60 font-medium">WILDER SCIENCE</p>
          </div>
        </div>
      </header>

      {/* Main Content - 一屏展示 */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg text-center">
          {/* 专属标签 */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-yellow-500/20 text-brand-yellow-300 text-sm font-bold mb-6">
            <Star className="w-4 h-4" />
            GROWMATE · 科创教育入学测评
          </div>

          {/* 主标题 - 科创天赋发现 */}
          <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
            发现孩子的<br />
            <span className="text-teal-300">科创天赋力</span>
          </h2>

          <p className="text-white/70 text-sm mb-8 leading-relaxed">
            基于WILDER六维科创评估模型<br />
            20分钟科学测评，为孩子可见的成长
          </p>

          {/* 核心数据 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <div className="text-2xl font-black text-white">6维</div>
              <div className="text-xs text-white/50">科创评估模型</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <div className="text-2xl font-black text-teal-300">50K+</div>
              <div className="text-xs text-white/50">家庭信赖</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <div className="text-2xl font-black text-amber-300">98%</div>
              <div className="text-xs text-white/50">家长满意度</div>
            </div>
          </div>

          {/* 权威背书 */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <BookOpen className="w-4 h-4" />
              <span>中科大出版社</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <Shield className="w-4 h-4" />
              <span>教育学会课题</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <Award className="w-4 h-4" />
              <span>创客中国冠军</span>
            </div>
          </div>

          {/* CTA按钮 */}
          <button
            onClick={onStart}
            className="w-full py-5 bg-gradient-to-r from-teal-400 to-emerald-500 text-white text-lg font-black rounded-2xl shadow-xl shadow-[rgba(59,95,217,0.2)]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            开始科创天赋测评
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* 底部说明 */}
          <div className="flex items-center justify-center gap-4 mt-6 text-white/50 text-xs">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 约20分钟</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 即时报告</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 数据安全</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} GROWMATE · 为孩子可见的成长
        </p>
      </footer>
    </div>
  )
}
