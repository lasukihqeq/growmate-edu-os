// ===================================================================
// 报告教育基础章节 — 科创天赋力定义 + WILDER模型介绍 + 未来能力
// 家长版核心认知铺垫层，确保家长理解报告价值
// ===================================================================

interface EducationFoundationProps {
  studentName: string
}

// ========== Section 1: 什么是科创天赋力 ==========
function TalentDefinitionSection({ studentName }: { studentName: string }) {
  return (
    <section id="section-talent-definition" className="bg-gradient-to-b from-amber-50 via-orange-50/30 to-white py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full mb-3">
            <span>01</span>
            <span className="w-1 h-1 bg-amber-400 rounded-full" />
            <span>在看报告之前</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A1A] mb-3">
            每个孩子都有科创天赋力
          </h2>
          <p className="text-[rgba(10,10,26,0.5)] text-base max-w-xl mx-auto leading-relaxed">
            只是方向不同。这份报告帮您发现{studentName}的科创天赋方向。
          </p>
        </div>

        {/* 核心定义卡 */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 sm:p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-100/60 to-transparent rounded-full -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-amber-200 shrink-0">
                💡
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0A0A1A] mb-2">科创天赋力 ≠ 天才</h3>
                <p className="text-base text-[rgba(10,10,26,0.7)] leading-relaxed">
                  科创天赋力是孩子<strong className="text-amber-700">在科学探索和创新实践中天然倾向于做好的事</strong>——是TA在没人要求时也会自然去做的行为模式。
                  它不是"聪不聪明"的评判，而是"在科创领域擅长什么方向"的发现。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 三层理解 */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-[rgba(10,10,26,0.06)] hover:border-amber-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl mb-3">🧭</div>
            <h4 className="font-bold text-[#0A0A1A] mb-2 text-sm">科创天赋力是"方向"，不是"水平"</h4>
            <p className="text-sm text-[rgba(10,10,26,0.6)] leading-relaxed">
              不是"聪明与否"，而是"擅长科创的哪个方向"。
              有的孩子天然爱问"为什么"，有的天然爱动手造东西——这都是科创天赋力的方向。
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[rgba(10,10,26,0.06)] hover:border-amber-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl mb-3">🌱</div>
            <h4 className="font-bold text-[#0A0A1A] mb-2 text-sm">科创天赋力是"可培养"的，不是"固定"的</h4>
            <p className="text-sm text-[rgba(10,10,26,0.6)] leading-relaxed">
              6-12岁是科创天赋力方向显现的关键窗口期。
              识别方向后定向培养，效率比盲目训练提升3-5倍。
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[rgba(10,10,26,0.06)] hover:border-amber-300 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl mb-3">👁️</div>
            <h4 className="font-bold text-[#0A0A1A] mb-2 text-sm">科创天赋力被看见，才会被发展</h4>
            <p className="text-sm text-[rgba(10,10,26,0.6)] leading-relaxed">
              很多科创天赋被误读——好奇心强被当成"坐不住"，独立思考被当成"不合群"。
              这份报告帮您看到孩子行为背后的真实科创天赋力。
            </p>
          </div>
        </div>

        {/* 家长一句话 */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-center">
          <p className="text-white font-medium text-sm sm:text-base leading-relaxed">
            "我们不是告诉您孩子有多优秀，而是告诉您——<strong>TA的科创天赋会往哪个方向生长</strong>。"
          </p>
        </div>
      </div>
    </section>
  )
}

// ========== Section 2: WILDER科创天赋力六维评估 ==========
const WILDER_DIMENSIONS = [
  {
    letter: 'W', name: '好奇心', nameEn: 'Wonder',
    icon: '🔭', color: 'amber',
    ability: '科创探索的起点：发现问题的敏锐度',
    scene: '看到彩虹时，孩子会问"为什么是七种颜色？"',
    future: '问题定义力 — 科创探索的原动力',
    gradient: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    letter: 'I', name: '探究力', nameEn: 'Inquiry',
    icon: '🔬', color: 'blue',
    ability: '科学思维的核心：验证假设的方法论',
    scene: '不只问"为什么"，还想办法自己验证答案',
    future: '批判性思维 — 科学探究的基本功',
    gradient: 'from-sky-400 to-blue-500',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    letter: 'L', name: '连接力', nameEn: 'Link',
    icon: '🤝', color: 'rose',
    ability: '跨学科整合能力：协作与知识联结',
    scene: '能把自己的发现分享给别人，也能从别人那里学习',
    future: '协作领导力 — 团队科创项目的基石',
    gradient: 'from-rose-400 to-pink-500',
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
  {
    letter: 'D', name: '设计力', nameEn: 'Design',
    icon: '📐', color: 'violet',
    ability: '创新实践能力：从构想到原型的转化',
    scene: '有了想法后，能制定计划并一步步做出来',
    future: '创新落地力 — 科创成果的实现路径',
    gradient: 'from-violet-400 to-purple-500',
    bgLight: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  {
    letter: 'E', name: '表达力', nameEn: 'Expression',
    icon: '🎤', color: 'emerald',
    ability: '科创成果展示：清晰传达与影响他人',
    scene: '能把复杂的想法用简单的话讲给别人听',
    future: '影响说服力 — 科创项目路演与答辩能力',
    gradient: 'from-emerald-400 to-teal-500',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  {
    letter: 'R', name: '反思力', nameEn: 'Reflection',
    icon: '🪞', color: 'slate',
    ability: '元认知与成长：从经验中迭代进化',
    scene: '做完一件事后能总结"下次怎么做更好"',
    future: '终身学习力 — 持续精进的核心能力',
    gradient: 'from-slate-400 to-gray-500',
    bgLight: 'bg-[rgba(59,95,217,0.04)]',
    borderColor: 'border-[rgba(10,10,26,0.06)]',
  },
]

function WilderIntroSection() {
  return (
    <section id="section-wilder-intro" className="bg-gradient-to-b from-white via-slate-50/50 to-white py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 text-xs font-bold px-4 py-1.5 rounded-full mb-3">
            <span>02</span>
            <span className="w-1 h-1 bg-teal-400 rounded-full" />
            <span>测评模型</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A1A] mb-3">
            WILDER — 科创天赋力六维评估
          </h2>
          <p className="text-[rgba(10,10,26,0.5)] text-base max-w-2xl mx-auto leading-relaxed">
            专门测量6种"科创教育核心"的天赋能力。
            <br className="hidden sm:block" />
            基于10年、92,000+中国儿童户外科学教育实证数据研发。
          </p>
        </div>

        {/* 核心理念 */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-2xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30">
                🌿
              </div>
              <div>
                <h3 className="font-bold text-lg">为什么是这6种能力？</h3>
                <p className="text-emerald-300 text-xs">Why These 6 Dimensions?</p>
              </div>
            </div>
            <p className="text-[rgba(10,10,26,0.1)] leading-relaxed text-sm sm:text-base">
              真正的科创教育不只是知识传授，更需要培养<strong className="text-emerald-300">好奇心</strong>、
              <strong className="text-emerald-300">科学探究思维</strong>、<strong className="text-emerald-300">跨学科连接</strong>、
              <strong className="text-emerald-300">创新设计</strong>、<strong className="text-emerald-300">成果表达</strong>和
              <strong className="text-emerald-300">反思迭代</strong>。
              WILDER六维模型就是专门测量这6种"科创天赋力"——它们决定了孩子在科创学习中的核心竞争力。
            </p>
          </div>
        </div>

        {/* 六维度卡片 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {WILDER_DIMENSIONS.map((dim) => (
            <div key={dim.letter} className={`${dim.bgLight} rounded-xl p-5 border ${dim.borderColor} hover:shadow-md transition-all group`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-11 h-11 bg-gradient-to-br ${dim.gradient} rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md`}>
                  {dim.letter}
                </div>
                <div>
                  <h4 className="font-bold text-[#0A0A1A] text-sm">{dim.name}</h4>
                  <p className="text-xs text-[rgba(10,10,26,0.35)]">{dim.nameEn}</p>
                </div>
                <span className="ml-auto text-xl">{dim.icon}</span>
              </div>
              <p className="text-sm font-medium text-[rgba(10,10,26,0.7)] mb-2">{dim.ability}</p>
              <div className="bg-white/70 rounded-lg p-3 mb-2">
                <p className="text-xs text-[rgba(10,10,26,0.5)] leading-relaxed">
                  <span className="font-medium text-[rgba(10,10,26,0.6)]">生活场景：</span>{dim.scene}
                </p>
              </div>
              <p className="text-xs text-[rgba(10,10,26,0.5)]">
                <span className="font-medium">未来价值：</span>{dim.future}
              </p>
            </div>
          ))}
        </div>

        {/* 模型来源 */}
        <div className="bg-white rounded-xl border border-[rgba(10,10,26,0.06)] p-5">
          <h4 className="font-bold text-[rgba(10,10,26,0.7)] text-sm mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-teal-100 rounded-md flex items-center justify-center text-xs">📊</span>
            模型科学基础
          </h4>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-[rgba(10,10,26,0.6)]">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              <span><strong>实证数据驱动</strong>：基于92,000+中国儿童10年追踪数据</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              <span><strong>五模型交叉验证</strong>：整合多元智能、大五人格、MBTI、皮亚杰认知发展等权威框架</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              <span><strong>729种独特画像</strong>：6维度 × 3水平 = 精准识别每个孩子的独特组合</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
              <span><strong>AI深度对话</strong>：20分钟AI对话 + 42道结构化题目多模态测评</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ========== Section 3: 面向未来的能力 ==========
function FutureSkillsSection() {
  const futureTable = [
    { dim: 'W', name: '好奇心', future: '问题定义力', whyAI: 'AI回答问题，但不会自己"好奇"', howTrain: '保护追问习惯，鼓励提出"为什么"', icon: '🔭', color: 'amber' },
    { dim: 'I', name: '探究力', future: '批判性思维', whyAI: 'AI给答案，但不会验证真伪', howTrain: '培养求证意识，"你怎么知道这是对的？"', icon: '🔬', color: 'blue' },
    { dim: 'L', name: '连接力', future: '协作领导力', whyAI: 'AI不能建立人际信任', howTrain: '创造协作场景，练习倾听与分享', icon: '🤝', color: 'rose' },
    { dim: 'D', name: '设计力', future: '创新落地力', whyAI: 'AI辅助设计，但不定义需求', howTrain: '完整项目体验，"从头到尾做完一件事"', icon: '📐', color: 'violet' },
    { dim: 'E', name: '表达力', future: '影响说服力', whyAI: 'AI生成文字，但缺乏真实共情', howTrain: '多元表达练习，"说给不懂的人听"', icon: '🎤', color: 'emerald' },
    { dim: 'R', name: '反思力', future: '终身学习力', whyAI: 'AI不能替人反思和成长', howTrain: '复盘习惯培养，"下次怎么做更好？"', icon: '🪞', color: 'slate' },
  ]

  return (
    <section id="section-future-skills" className="bg-gradient-to-b from-white via-indigo-50/30 to-white py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-full mb-3">
            <span>03</span>
            <span className="w-1 h-1 bg-indigo-400 rounded-full" />
            <span>为什么重要</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A0A1A] mb-3">
            2030年，孩子需要什么能力？
          </h2>
          <p className="text-[rgba(10,10,26,0.5)] text-base max-w-2xl mx-auto leading-relaxed">
            未来10年，知识获取将被AI大幅降低门槛。<br className="hidden sm:block" />
            真正的竞争力在于这6种"只有人类才能做好"的能力。
          </p>
        </div>

        {/* AI时代能力对照 */}
        <div className="bg-white rounded-2xl shadow-lg border border-[rgba(10,10,26,0.06)] overflow-hidden mb-6">
          {/* 表头 */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
            <div className="grid grid-cols-12 gap-2 text-xs font-bold">
              <div className="col-span-2 sm:col-span-2">WILDER</div>
              <div className="col-span-3 sm:col-span-2">未来能力</div>
              <div className="col-span-4 sm:col-span-4 hidden sm:block">为什么AI替代不了</div>
              <div className="col-span-7 sm:col-span-4">现在怎么培养</div>
            </div>
          </div>
          {/* 表体 */}
          <div className="divide-y divide-slate-100">
            {futureTable.map((row) => (
              <div key={row.dim} className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-[rgba(59,95,217,0.04)] transition-colors">
                <div className="col-span-2 sm:col-span-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{row.icon}</span>
                    <div>
                      <span className="text-sm font-bold text-[#0A0A1A]">{row.dim}</span>
                      <span className="text-xs text-[rgba(10,10,26,0.5)] hidden sm:inline ml-1">{row.name}</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <span className="text-xs sm:text-sm font-medium text-indigo-700">{row.future}</span>
                </div>
                <div className="col-span-4 sm:col-span-4 hidden sm:block">
                  <span className="text-xs text-[rgba(10,10,26,0.5)]">{row.whyAI}</span>
                </div>
                <div className="col-span-7 sm:col-span-4">
                  <span className="text-xs text-[rgba(10,10,26,0.6)]">{row.howTrain}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 核心信息 */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-5 text-center">
          <p className="text-white font-medium text-sm sm:text-base leading-relaxed">
            这份报告告诉您的不是"孩子哪里好哪里差"，<br className="hidden sm:block" />
            而是<strong>"在科创学习道路上，最该优先发展什么天赋能力"</strong>。
          </p>
        </div>
      </div>
    </section>
  )
}

// ========== 阅读指南 ==========
function ReadingGuideSection({ studentName }: { studentName: string }) {
  return (
    <section id="section-reading-guide" className="bg-white py-6 px-4 sm:px-6 border-b border-[rgba(10,10,26,0.04)]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-5 sm:p-6 border border-[rgba(10,10,26,0.06)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl shrink-0">📖</div>
            <div>
              <h3 className="font-bold text-[#0A0A1A] text-sm mb-3">30秒读懂这份报告</h3>
              <p className="text-sm text-[rgba(10,10,26,0.6)] mb-4">这份报告将帮您解答关于{studentName}的3个核心问题：</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-[rgba(10,10,26,0.04)]">
                  <span className="w-7 h-7 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <span className="text-sm text-[rgba(10,10,26,0.7)] font-medium">我的孩子擅长什么？</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-[rgba(10,10,26,0.04)]">
                  <span className="w-7 h-7 bg-teal-100 text-[#2A4CC0] rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <span className="text-sm text-[rgba(10,10,26,0.7)] font-medium">应该重点培养什么？</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-[rgba(10,10,26,0.04)]">
                  <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <span className="text-sm text-[rgba(10,10,26,0.7)] font-medium">具体怎么做？</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ========== 核心收获高亮组件 ==========
export function SectionInsight({ text, type = 'default' }: { text: string; type?: 'default' | 'action' | 'key' }) {
  const styles = {
    default: 'bg-amber-50 border-amber-200 text-amber-800',
    action: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    key: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const icons = {
    default: '💡',
    action: '✅',
    key: '🔑',
  }

  return (
    <div className={`${styles[type]} border rounded-lg px-4 py-3 flex items-start gap-2.5 mt-4`}>
      <span className="text-base shrink-0">{icons[type]}</span>
      <p className="text-sm font-medium leading-relaxed">{text}</p>
    </div>
  )
}

// ========== 主组件 ==========
export function ReportEducationFoundation({ studentName }: EducationFoundationProps) {
  return (
    <>
      <ReadingGuideSection studentName={studentName} />
      <TalentDefinitionSection studentName={studentName} />
      <WilderIntroSection />
      <FutureSkillsSection />
    </>
  )
}

export default ReportEducationFoundation
