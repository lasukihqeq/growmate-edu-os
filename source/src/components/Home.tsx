import { useState } from 'react'
import {
  Sparkles,
  BrainCircuit,
  Compass,
  Target,
  Activity,
  Menu,
  ArrowRight,
  Lock,
  BookOpen,
  GraduationCap,
  Cpu,
  Network,
  Fingerprint,
  ChevronRight,
  Award,
  Users,
  Star,
  Shield,
  ChevronDown,
} from 'lucide-react'
import { validateInviteCode, useInviteCode as consumeInviteCode } from '../lib/tokenManager'

// ==========================================
// 品牌专属 LOGO 组件 (Apple Squircle 美学)
// ==========================================
const GrowMateLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div
    className={`relative flex items-center justify-center bg-gradient-to-b from-[#2c2c2e] to-[#151516] shadow-sm border border-white/10 ${className}`}
    style={{ borderRadius: '22.5%' }}
  >
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[65%] h-[65%]">
      <path
        d="M50 15C50 34.33 65.67 50 85 50C65.67 50 50 65.67 50 85C50 65.67 34.33 50 15 50C34.33 50 50 34.33 50 15Z"
        fill="url(#gm-icon-grad)"
      />
      <circle cx="50" cy="50" r="7" fill="#151516" />
      <defs>
        <linearGradient id="gm-icon-grad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e0e0e5" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
      </defs>
    </svg>
  </div>
)

// ==========================================
// Home Page (Apple 设计美学 - 极简画册)
// ==========================================
interface HomeProps {
  onVerified: () => void
  onShowReport: () => void
  onShowUserCenter?: () => void
}

export function Home({ onVerified, onShowReport, onShowUserCenter }: HomeProps) {
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setIsVerifying(true)
    setError('')

    // 使用真实的邀请码验证
    setTimeout(() => {
      const result = validateInviteCode(code)
      if (result.valid) {
        if (result.isOneTime) {
          consumeInviteCode(code)
        }
        onVerified()
      } else {
        setError(result.error || '邀请码无效')
        setIsVerifying(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] font-sans text-[#1d1d1f] overflow-hidden relative selection:bg-indigo-500/30 pb-32">

      {/* ===== Header ===== */}
      <header className="fixed top-0 w-full z-20 px-6 py-4 flex justify-between items-center bg-[#fbfbfd]/80 backdrop-blur-md border-b border-[#1d1d1f]/[0.04]">
        <div className="flex items-center gap-2.5">
          <GrowMateLogo className="w-7 h-7" />
          <span className="text-[19px] font-bold tracking-tight text-[#1d1d1f]">GROWMATE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wide text-[#86868b]">
          <a href="#about" className="hover:text-[#1d1d1f] transition-colors">WILDER 测评</a>
          <a href="#persona" className="hover:text-[#1d1d1f] transition-colors">728 画像</a>
          <a href="#architecture" className="hover:text-[#1d1d1f] transition-colors">AI 架构</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onShowReport} className="hidden sm:inline-flex text-[13px] font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors">
            样板报告
          </button>
          {onShowUserCenter && (
            <button onClick={onShowUserCenter} className="hidden sm:inline-flex text-[13px] font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors">
              我的报告
            </button>
          )}
          <button className="md:hidden text-[#1d1d1f]">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="relative z-10 pt-32 px-6 md:px-12 max-w-[1200px] mx-auto flex flex-col items-center text-center">

        {/* ===== Hero 区域 ===== */}
        <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full text-[11px] font-semibold tracking-widest text-indigo-600 uppercase">
            <Sparkles className="w-3.5 h-3.5" /> AI 潜能唤醒引擎
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#1d1d1f] leading-[1.05]">
            别让天赋，止于沉睡。<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              用 AI 与科学唤醒它。
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[#86868b] font-medium leading-relaxed max-w-2xl mx-auto mt-6 tracking-tight">
            每一个孩子都蕴藏着未被发掘的可能。GROWMATE 融合 WILDER 科学模型与前沿 AI 算法，打造「测评-画像-教育」全链路闭环，让天赋真正被看见。
          </p>
        </div>

        {/* ===== 邀请码输入 ===== */}
        <div className="mt-16 w-full max-w-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleVerify} className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-15 transition duration-500" />

            <div className="relative flex items-center p-2 bg-white/80 backdrop-blur-2xl rounded-full border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-focus-within:bg-white transition-all duration-300">
              <div className="pl-4 pr-2 text-[#86868b]">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError('') }}
                placeholder="输入邀请码进入专属空间"
                className="flex-1 bg-transparent border-none outline-none px-2 text-[#1d1d1f] placeholder-[#86868b] font-medium text-[15px]"
                disabled={isVerifying}
              />
              <button
                type="submit"
                disabled={isVerifying || !code.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  code.trim() && !isVerifying
                    ? 'bg-[#1d1d1f] text-white hover:scale-105 shadow-md'
                    : 'bg-[#f5f5f7] text-[#86868b] cursor-not-allowed'
                }`}
              >
                {isVerifying ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
          {error ? (
            <p className="text-[12px] font-medium text-red-500 mt-4">{error}</p>
          ) : (
            <p className="text-[12px] font-medium text-[#86868b] mt-4">任意字符均可体验内部系统</p>
          )}
        </div>

        {/* ===== 业务全景架构图 (Apple Silicon 风格) ===== */}
        <div id="architecture" className="mt-32 w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1d1d1f]">
              业务全景：数据的奇妙旅程。
            </h2>
            <p className="text-[16px] text-[#86868b] font-medium mt-3">从自适应答题，到最终课程推荐的 AI 计算流。</p>
          </div>

          <div className="relative w-full max-w-5xl mx-auto">
            {/* 桌面端连线 */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#d2d2d7] to-transparent -translate-y-1/2 -z-10" />

            <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-6 relative z-10">

              {/* 节点 1：数据采集 */}
              <div className="flex-1 bg-white p-6 rounded-[2rem] border border-black/[0.04] shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-[16px] font-bold text-[#1d1d1f] mb-1">自适应题库</h4>
                <p className="text-[12px] text-[#86868b] font-medium leading-relaxed">
                  动态捕捉作答反馈<br />与年龄段心智数据
                </p>
              </div>

              {/* 连接箭头 */}
              <div className="flex items-center justify-center text-[#d2d2d7] py-2 md:py-0">
                <ChevronRight className="w-6 h-6 hidden md:block" />
                <ChevronRight className="w-6 h-6 rotate-90 md:hidden" />
              </div>

              {/* 节点 2：核心引擎 (The Brain) */}
              <div className="flex-[1.5] relative group p-[2px] rounded-[2rem] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-10 group-hover:opacity-25 transition-opacity duration-700" />
                <div className="h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white text-indigo-600 flex items-center justify-center mb-4 shadow-sm">
                    <Cpu className="w-7 h-7" />
                  </div>
                  <h4 className="text-[18px] font-bold text-[#1d1d1f] mb-4 tracking-wide">画像分类器 (AI引擎)</h4>

                  <div className="w-full flex flex-col gap-2">
                    <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-xl text-left border border-indigo-100">
                      <Network className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="text-[12px] font-medium text-[#1d1d1f]">多模态特征识别</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center gap-2 bg-white/80 px-3 py-2 rounded-xl text-left border border-purple-100">
                        <BrainCircuit className="w-4 h-4 text-purple-500 shrink-0" />
                        <span className="text-[11px] font-medium text-[#1d1d1f] truncate">认知特征抽取</span>
                      </div>
                      <div className="flex-1 flex items-center gap-2 bg-white/80 px-3 py-2 rounded-xl text-left border border-pink-100">
                        <Activity className="w-4 h-4 text-pink-500 shrink-0" />
                        <span className="text-[11px] font-medium text-[#1d1d1f] truncate">情绪波动分析</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 连接箭头 */}
              <div className="flex items-center justify-center text-[#d2d2d7] py-2 md:py-0">
                <ChevronRight className="w-6 h-6 hidden md:block" />
                <ChevronRight className="w-6 h-6 rotate-90 md:hidden" />
              </div>

              {/* 节点 3：输出与闭环 */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex-1 bg-white p-5 rounded-[1.5rem] border border-black/[0.04] shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[15px] font-bold text-[#1d1d1f]">728 认知画像</h4>
                    <p className="text-[11px] text-[#86868b] font-medium mt-0.5">精准锁定性格特质</p>
                  </div>
                </div>

                <div className="flex-1 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-[1.5rem] border border-white shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white text-indigo-500 flex items-center justify-center shrink-0 shadow-sm">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[15px] font-bold text-[#1d1d1f]">课程推荐引擎</h4>
                    <p className="text-[11px] text-[#86868b] font-medium mt-0.5">生成专属教育闭环</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ===== Bento Box Grid ===== */}
        <div id="about" className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left animate-fade-in" style={{ animationDelay: '0.3s' }}>

          {/* Card 1: WILDER 六维模型 */}
          <div className="col-span-1 bg-white rounded-[2rem] p-10 border border-black/[0.04] shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgb(0,0,0,0.04)] transition-shadow duration-500">
            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] text-indigo-500 flex items-center justify-center mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-2 tracking-tight">WILDER 六维模型</h3>
            <p className="text-[14px] text-[#86868b] font-medium leading-relaxed">
              好奇心 · 探究力 · 连接力 · 设计力 · 表达力 · 反思力 —— 六大维度全面扫描孩子的科创潜能图谱。
            </p>
          </div>

          {/* Card 2: 728 认知画像 (Gradient card, spans 2 cols on lg) */}
          <div id="persona" className="col-span-1 lg:col-span-2 relative group p-[1px] rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 group-hover:from-indigo-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 transition-all duration-700" />
            <div className="h-full bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50 rounded-[2rem] p-10 relative z-10">
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-white text-purple-500 flex items-center justify-center mb-5 shadow-sm">
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <h3 className="text-[22px] font-bold text-[#1d1d1f] mb-3 tracking-tight">728 种差异化认知画像</h3>
                  <p className="text-[14px] text-[#86868b] font-medium leading-relaxed mb-6">
                    基于六维度的三级量化，每个孩子都能获得独属于自己的画像编码。不是模糊的"你很聪明"，而是"你在探究力 × 设计力上有独特天赋"。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['W·好奇心', 'I·探究力', 'L·连接力', 'D·设计力', 'E·表达力', 'R·反思力'].map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full text-[11px] font-medium bg-white/80 text-[#1d1d1f] border border-indigo-100/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: AI 对话测评 */}
          <div className="col-span-1 bg-white rounded-[2rem] p-10 border border-black/[0.04] shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgb(0,0,0,0.04)] transition-shadow duration-500">
            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] text-purple-500 flex items-center justify-center mb-5">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-2 tracking-tight">AI 对话式测评</h3>
            <p className="text-[14px] text-[#86868b] font-medium leading-relaxed">
              20分钟轻松对话，不是枯燥问卷。AI 根据回答实时调整追问策略，让测评像聊天一样自然。
            </p>
          </div>

          {/* Card 4: 个性化培养 */}
          <div className="col-span-1 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[2rem] p-10 border border-white shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgb(0,0,0,0.04)] transition-shadow duration-500">
            <div className="w-12 h-12 rounded-2xl bg-white text-indigo-500 flex items-center justify-center mb-5 shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-2 tracking-tight">14天行动计划</h3>
            <p className="text-[14px] text-[#86868b] font-medium leading-relaxed">
              不只是报告，而是拿到就能用的培养方案。精确到天的任务清单 + 家长操作指南。
            </p>
          </div>

          {/* Card 5: 数据安全 */}
          <div className="col-span-1 bg-white rounded-[2rem] p-10 border border-black/[0.04] shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgb(0,0,0,0.04)] transition-shadow duration-500">
            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] text-green-500 flex items-center justify-center mb-5">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-2 tracking-tight">银行级数据安全</h3>
            <p className="text-[14px] text-[#86868b] font-medium leading-relaxed">
              严格遵守《儿童个人信息网络保护规定》，所有数据加密存储，绝不用于任何商业用途。
            </p>
          </div>

        </div>

        {/* ===== 社会证明 ===== */}
        <div className="mt-24 w-full animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { icon: BookOpen, text: '中科院AI+实验室认证' },
              { icon: Award, text: '中国教育学会课题' },
              { icon: Star, text: '创客中国赛区冠军' },
              { icon: Users, text: '10万+样本验证' },
            ].map((item, i) => (
              <div key={i} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-[12px] font-semibold text-[#86868b] border border-black/[0.04] shadow-[0_2px_12px_rgb(0,0,0,0.02)]">
                <item.icon className="w-3.5 h-3.5 text-indigo-500" />
                {item.text}
              </div>
            ))}
          </div>

          {/* 评价 */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { text: '"以前总觉得儿子数学不行，测完才发现他逻辑极强，只是不擅长死记硬背。按报告建议换了教法，现在是班里的逻辑小达人！"', name: '张女士', info: '8岁男孩家长 · 杭州' },
              { text: '"AI互动非常有意思，从没见过儿子能专注做完一个测评。报告里的证据链非常详实，不是模棱两可的话，很实在。"', name: '陈老师', info: '10岁孩子家长 · 小学教师' },
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-black/[0.04] shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, si) => <Star key={si} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-[14px] text-[#86868b] font-medium leading-relaxed mb-6 italic">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1d1d1f]">{t.name}</p>
                    <p className="text-[11px] text-[#86868b]">{t.info}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== FAQ ===== */}
        <div className="mt-24 w-full max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1d1d1f] text-center mb-10">
            常见问题。
          </h2>
          <div className="space-y-3">
            {[
              { q: '测评适合多大年龄的孩子？', a: '覆盖 4-17 岁儿童青少年。根据不同年龄段设计了分层题库和 AI 对话策略，4-5 岁幼儿有专属学龄前题目，确保每个年龄段都能获得准确评估。' },
              { q: '需要多长时间？孩子会不会觉得无聊？', a: 'AI 对话式评测约 15-20 分钟，采用游戏化交互设计，孩子在轻松对话中完成评测。96% 的孩子反馈"像和一个有趣的朋友聊天"。' },
              { q: '数据安全如何保障？', a: '严格遵守《儿童个人信息网络保护规定》，采用银行级加密技术，所有数据存储于国内合规服务器，绝不将孩子信息用于任何商业用途。' },
            ].map((item, i) => (
              <details key={i} className="group bg-white rounded-[1.5rem] border border-black/[0.04] shadow-[0_2px_12px_rgb(0,0,0,0.02)] overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-[#f5f5f7]/50 transition-colors list-none outline-none">
                  <span className="font-semibold text-[#1d1d1f] text-[15px]">{item.q}</span>
                  <ChevronDown className="w-5 h-5 text-[#86868b] transition-transform duration-300 group-open:rotate-180 flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 text-[14px] text-[#86868b] font-medium leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div className="mt-24 w-full max-w-2xl mx-auto text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#1d1d1f] leading-tight mb-4">
            开启天赋发现之旅。
          </h2>
          <p className="text-[16px] text-[#86868b] font-medium mb-10">
            20 分钟科学测评，精准定位科创潜能。
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#1d1d1f] text-white text-[15px] font-semibold rounded-full hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300"
          >
            立即开始评测
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </main>

      {/* ===== Footer ===== */}
      <footer className="mt-32 bg-[#1d1d1f] py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <GrowMateLogo className="w-6 h-6" />
                <span className="text-[15px] font-bold text-white">GROWMATE</span>
              </div>
              <p className="text-white/40 text-[12px] leading-relaxed">科创教育入学测评，为孩子可见的成长。</p>
            </div>
            <div>
              <h4 className="font-semibold text-white text-[13px] mb-3">产品服务</h4>
              <ul className="space-y-2 text-[12px] text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">科创天赋测评</a></li>
                <li><a href="#" className="hover:text-white transition-colors">能力报告</a></li>
                <li><a href="#" className="hover:text-white transition-colors">成长课程</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-[13px] mb-3">关于我们</h4>
              <ul className="space-y-2 text-[12px] text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">专家团队</a></li>
                <li><a href="#" className="hover:text-white transition-colors">科研背景</a></li>
                <li><a href="#" className="hover:text-white transition-colors">合作伙伴</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-[13px] mb-3">帮助支持</h4>
              <ul className="space-y-2 text-[12px] text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">使用指南</a></li>
                <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
                <li><a href="#" className="hover:text-white transition-colors">用户协议</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-white/30">
            <p>&copy; {new Date().getFullYear()} GROWMATE. 保留所有权利。</p>
            <p>中科院AI+实验室 · 中国教育学会重点课题 · 创客中国赛区冠军</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
