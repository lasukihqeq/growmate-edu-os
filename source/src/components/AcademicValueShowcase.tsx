import { useState } from 'react'

interface AcademicValueShowcaseProps {
  onClose?: () => void
  studentName?: string
}

/* ------------------------------------------------------------------ */
/*  GROWMATE科创教育价值展示页 - 统一版本                              */
/*  注：PRO版功能已合并到统一版本，此组件保留用于展示学术价值        */
/* ------------------------------------------------------------------ */
export default function AcademicValueShowcase({
  onClose,
  studentName = '您的孩子',
}: AcademicValueShowcaseProps) {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(0)

  /* ---- 核心数据亮点（重构版） ---- */
  const coreHighlights = [
    {
      icon: '🎯',
      title: '终于知道孩子适合什么',
      desc: '不再猜着报班、盲目跟风，一份报告看清孩子的能力倾向和发展方向',
      highlight: '省下3-5个"试错班"的钱和时间',
    },
    {
      icon: '🗺️',
      title: '从现在到高考，路线图已规划',
      desc: '不是只给分数，而是告诉你每一步该做什么、该投什么、该避什么',
      highlight: '让每一分钱的教育投资都用对地方',
    },
    {
      icon: '💬',
      title: '终于知道怎么说孩子才听',
      desc: '20条根据孩子性格定制的沟通话术，亲子对话从冲突变成连接',
      highlight: '用对话术，孩子居然主动听了',
    },
  ]

  /* ---- 核心功能（手风琴展示） ---- */
  const features = [
    {
      icon: '🎯',
      title: '精准定位潜能方向',
      shortDesc: '不再猜着报班、盲目跟风',
      fullDesc: '通过5大经典心理学模型交叉验证，精准识别孩子的能力优势组合。终于知道TA适合科学家型、创业者型还是艺术家型——越早知道，越少走弯路。',
      tag: '方向清晰',
      color: 'indigo',
    },
    {
      icon: '🔮',
      title: '提前预见成长风险',
      shortDesc: '防患于未然，少走弯路',
      fullDesc: '基于92000+中国儿童数据，提前识别学业风险、社交风险、职业盲点，并给出针对性干预方案。不是等问题出现再补救，而是提前规避。',
      tag: '风险预警',
      color: 'purple',
    },
    {
      icon: '🗺️',
      title: '全年培养路线图',
      shortDesc: '从现在到高考，步步有规划',
      fullDesc: '按季度规划成长路线，从"这周末该做什么"到"大学申请策略"，每一步都有数据支撑。不再每学期纠结报什么班——一张表管全年。',
      tag: '路径清晰',
      color: 'amber',
    },
    {
      icon: '📚',
      title: '精准资源推荐',
      shortDesc: '书单、纪录片，看完眼界翻倍',
      fullDesc: '根据孩子潜能类型智能匹配728种组合的书籍和纪录片。不是随便推荐畅销书，是根据TA的特点"精准投喂"——看完这些，眼界直接超过同龄人3年。',
      tag: '资源精准',
      color: 'emerald',
    },
    {
      icon: '💬',
      title: '亲子沟通话术库',
      shortDesc: '说对话，孩子才愿意听',
      fullDesc: '20条根据孩子性格定制的沟通话术，让报告真正落地到日常生活。孩子写作业磨蹭？考差了不知怎么安慰？每一句都是"说到孩子心里去"的。',
      tag: '即刻可用',
      color: 'teal',
    },
  ]

  /* ---- 理论框架 ---- */
  const theories = [
    { name: '多元智能理论', author: 'Howard Gardner' },
    { name: '大五人格模型', author: 'Costa & McCrae' },
    { name: '认知发展理论', author: 'Jean Piaget' },
    { name: '执行功能理论', author: 'Miyake et al.' },
    { name: 'MBTI类型学', author: 'Myers-Briggs' },
  ]

  const tagColorMap: Record<string, string> = {
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    teal: 'bg-teal-100 text-teal-700 border-teal-200',
  }

  /* ================================================================ */
  return (
    <div className="fixed inset-0 z-[200] showcase-overlay" onClick={onClose}>
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-[#0A0A1A]/60 backdrop-blur-sm" />

      {/* 主面板 */}
      <div
        className="absolute inset-x-0 bottom-0 top-0 sm:top-8 sm:inset-x-4 md:inset-x-auto md:max-w-3xl md:mx-auto overflow-hidden flex flex-col bg-white sm:rounded-t-3xl showcase-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 可滚动区域 */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* ===== Hero ===== */}
          <div className="relative overflow-hidden">
            {/* 渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900" />
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(99,102,241,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.3) 0%, transparent 50%)' }}
            />
            {/* 网格装饰 */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            <div className="relative px-6 pt-6 pb-8 sm:px-10 sm:pt-8 sm:pb-10">
              {/* 关闭按钮 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all z-10"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>

              {/* 品牌徽章 */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-4 showcase-badge-anim">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-amber-300 tracking-widest uppercase">GROWMATE科创教育</span>
              </div>

              {/* 痛点共鸣 */}
              <p className="text-indigo-200/80 text-sm mb-3 leading-relaxed">
                兴趣班报了一堆，钱花了不少——到底哪个适合孩子？别人家孩子学钢琴，我家也要学吗？
              </p>

              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                让{studentName}的教育投资<br/>
                <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                  每一分钱都用对地方
                </span>
              </h1>

              {/* 核心亮点卡片 */}
              <div className="space-y-3 mt-6">
                {coreHighlights.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 showcase-card-anim"
                    style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
                        <p className="text-indigo-200/70 text-xs leading-relaxed">{item.desc}</p>
                        <p className="text-amber-300 text-xs font-medium mt-1">{item.highlight}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== 核心功能（手风琴展示） ===== */}
          <div className="px-6 sm:px-10 pb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🔬</span>
              <h2 className="text-lg font-bold text-[#0A0A1A]">核心功能</h2>
            </div>
            <p className="text-xs text-[rgba(10,10,26,0.35)] mb-5">点击展开了解详情</p>

            <div className="space-y-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    expandedFeature === i 
                      ? 'border-indigo-200 shadow-showcase-card bg-white' 
                      : 'border-[rgba(10,10,26,0.06)] bg-white hover:border-[rgba(10,10,26,0.08)]'
                  }`}
                >
                  <button
                    onClick={() => setExpandedFeature(expandedFeature === i ? null : i)}
                    className="w-full p-4 flex items-center gap-3 text-left"
                  >
                    <span className="text-2xl flex-shrink-0">{f.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-[#0A0A1A]">{f.title}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tagColorMap[f.color] || 'bg-[rgba(59,95,217,0.06)] text-[rgba(10,10,26,0.6)] border-[rgba(10,10,26,0.06)]'}`}>
                          {f.tag}
                        </span>
                      </div>
                      <p className="text-xs text-[rgba(10,10,26,0.5)] mt-0.5">{f.shortDesc}</p>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-[rgba(10,10,26,0.35)] transition-transform duration-300 flex-shrink-0 ${expandedFeature === i ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFeature === i && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="pl-11 border-l-2 border-indigo-100 ml-3">
                        <p className="text-sm text-[rgba(10,10,26,0.6)] leading-relaxed">{f.fullDesc}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ===== 理论框架与学术背书 ===== */}
          <div className="px-6 sm:px-10 py-8 bg-gradient-to-b from-slate-50 to-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🏛️</span>
              <h2 className="text-lg font-bold text-[#0A0A1A]">理论框架与学术背书</h2>
            </div>
            <p className="text-xs text-[rgba(10,10,26,0.35)] mb-5">基于经同行评审的经典心理学理论</p>

            {/* 理论卡片 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {theories.map((t, i) => (
                <div 
                  key={i}
                  className="bg-white border border-[rgba(10,10,26,0.06)] rounded-xl px-3 py-2 text-center hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <div className="text-xs font-bold text-[rgba(10,10,26,0.7)]">{t.name}</div>
                  <div className="text-[10px] text-[rgba(10,10,26,0.35)] mt-0.5">{t.author}</div>
                </div>
              ))}
            </div>

            {/* 研究支持 */}
            <div className="bg-white border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">📜</div>
                <span className="text-sm font-bold text-[rgba(10,10,26,0.7)]">研究支持</span>
              </div>
              <ul className="space-y-2 text-xs text-[rgba(10,10,26,0.6)]">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
                  <span>中国教育学会科学教育重点课题研究成果</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
                  <span>92,000+名中国儿童8年纵向追踪数据验证</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
                  <span>评估框架经同行评审与学术验证</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ===== 为什么不选基因检测 ===== */}
          <div className="px-6 sm:px-10 py-6">
            <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">⚠️</span>
                  <h3 className="font-bold text-white text-sm">关于"潜能基因检测"的科学争议</h3>
                </div>
                <blockquote className="border-l-2 border-amber-500/50 pl-3 mb-4">
                  <p className="text-[rgba(10,10,26,0.2)] text-xs leading-relaxed italic">
                    "潜能基因检测动辄数千元，但多位专家指出：智力、创造力等复杂特征受多基因与环境交互影响，单基因检测无法预测潜能。"
                  </p>
                  <cite className="text-[rgba(10,10,26,0.5)] text-[10px] mt-1 block">—— 新京报 2023年调查报道</cite>
                </blockquote>
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
                  <div className="text-xs font-bold text-amber-300 mb-2">GROWMATE测评的不同之处：</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[rgba(10,10,26,0.2)]">
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-400 flex-shrink-0">✓</span>
                      <span>基于行为表现而非基因推测</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-400 flex-shrink-0">✓</span>
                      <span>5大经典心理学模型交叉验证</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-400 flex-shrink-0">✓</span>
                      <span>92000+儿童纵向追踪数据实证</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-400 flex-shrink-0">✓</span>
                      <span>聚焦"可培养的能力"而非标签</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== 市场定价对比 ===== */}
          <div className="px-6 sm:px-10 py-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">💎</span>
              <h2 className="text-lg font-bold text-[#0A0A1A]">市场定价参考</h2>
            </div>
            <p className="text-xs text-[rgba(10,10,26,0.35)] mb-5">帮助您建立价值认知</p>

            {/* GROWMATE测评 */}
            <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-200/30 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">⭐</span>
                  <span className="text-sm font-bold text-[#0A0A1A]">GROWMATE科创教育测评</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-[rgba(10,10,26,0.6)] mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-indigo-500">✓</span>
                    <span>5模型交叉验证</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-indigo-500">✓</span>
                    <span>35+页深度报告</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-indigo-500">✓</span>
                    <span>年度发展蓝图</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-indigo-500">✓</span>
                    <span>92000+中国数据</span>
                  </div>
                </div>
                <div className="bg-white/80 rounded-xl p-3 border border-indigo-100">
                  <div className="text-xs font-bold text-amber-700 mb-1.5">🎁 测评包含内容</div>
                  <ul className="text-[11px] text-[rgba(10,10,26,0.6)] space-y-1">
                    <li>• 完整潜能评估报告</li>
                    <li>• 个性化成长建议</li>
                    <li>• 专家一对一解读</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ===== 数据实证 ===== */}
          <div className="px-6 sm:px-10 py-6">
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-5 sm:p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.05]"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-lg">📊</div>
                  <h3 className="font-bold text-base">数据说话</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
                    <div className="text-3xl font-black text-amber-300 mb-1">37%</div>
                    <p className="text-[rgba(10,10,26,0.2)] text-xs leading-relaxed">
                      研究显示，接受早期能力识别与精准干预的儿童，在3年后的综合能力评估中，<strong className="text-white">平均超越同龄人37%</strong>。
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
                    <div className="text-3xl font-black text-emerald-300 mb-1">2.8x</div>
                    <p className="text-[rgba(10,10,26,0.2)] text-xs leading-relaxed">
                      完成测评的家庭，制定教育计划的针对性提升 <strong className="text-white">2.8 倍</strong>，教育资源浪费显著降低。
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-[rgba(10,10,26,0.35)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                  数据来源：GROWMATE·科创教育入学测评 92,000+ 名儿童纵向追踪研究（2017-2025）
                </div>
              </div>
            </div>
          </div>

          {/* ===== 社会证明 ===== */}
          <div className="px-6 sm:px-10 py-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">💬</span>
              <h2 className="text-base font-bold text-[#0A0A1A]">家长好评</h2>
            </div>
            <div className="space-y-3">
              <div className="bg-white border border-[rgba(10,10,26,0.06)] rounded-xl p-4">
                <p className="text-sm text-[rgba(10,10,26,0.6)] italic leading-relaxed">
                  "终于有一份报告能告诉我孩子具体怎么培养，而不是只给个分数。年度蓝图让我们的教育投入更有方向。"
                </p>
                <div className="mt-2 text-xs text-[rgba(10,10,26,0.35)]">—— 杭州 琪琪妈妈</div>
              </div>
              <div className="bg-white border border-[rgba(10,10,26,0.06)] rounded-xl p-4">
                <p className="text-sm text-[rgba(10,10,26,0.6)] italic leading-relaxed">
                  "之前花了3000多做基因检测，结果模棱两可。GROWMATE的35页报告比那个实用太多了，每一条建议都能落地。"
                </p>
                <div className="mt-2 text-xs text-[rgba(10,10,26,0.35)]">—— 上海 小明爸爸</div>
              </div>
            </div>
          </div>

          {/* 底部间距给 sticky 区域让路 */}
          <div className="h-44" />
        </div>

        {/* ===== 底部关闭按钮 ===== */}
        <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[rgba(10,10,26,0.06)] px-6 sm:px-10 py-5 z-10">
          <button
            onClick={onClose}
            className="w-full px-5 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl text-sm hover:shadow-glow-indigo hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            了解更多GROWMATE课程 →
          </button>
        </div>
      </div>
    </div>
  )
}
