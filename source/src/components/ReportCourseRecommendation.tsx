interface CourseRecommendationProps {
  studentName: string
  age: number
  sortedDims: { key: string; name: string; score: number }[]
  talentType60Name?: string
  subDirection?: 'alpha' | 'beta'
}

export function ReportCourseRecommendation({ studentName, sortedDims, talentType60Name, subDirection }: CourseRecommendationProps) {
  const top2 = sortedDims.slice(0, 2)

  // 根据60分型方向生成课程匹配提示
  const directionHint = talentType60Name
    ? subDirection === 'alpha'
      ? `作为「${talentType60Name}」（分析探索型），建议侧重结构化深度探究类课程`
      : `作为「${talentType60Name}」（协作表达型），建议侧重互动性和创意表达类课程`
    : ''

  return (
    <section id="section-course-match" className="py-8 px-4 sm:px-6 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="max-w-4xl mx-auto">
        {/* 标题区 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
            <span>🎓</span>
            <span>GROWMATE · 定制课程方案</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#0A0A1A] mb-2">
            为{studentName}量身定制的培养方案
          </h2>
          <p className="text-[rgba(10,10,26,0.5)] text-sm max-w-xl mx-auto">
            基于{top2.map(d => `${d.name}(${d.score}分)`).join('+')}的科创天赋力画像，
            从三大产品线中精准匹配最适合的成长路径
          </p>
          {directionHint && (
            <p className="text-[#2A4CC0] text-xs mt-2 max-w-lg mx-auto font-medium">{directionHint}</p>
          )}
        </div>

        {/* 培养理念 - 能力图 */}
        <div className="bg-white rounded-2xl overflow-hidden border border-blue-100 shadow-sm mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3">
            <h3 className="text-white font-bold flex items-center gap-2">
              <span className="text-xl">🧠</span>
              面向AI时代不可替代的能力培养
            </h3>
            <p className="text-blue-100 text-xs mt-0.5">用能力面对未来，用真实世界培养不可替代性</p>
          </div>
          <div className="p-4">
            <img
              src="/images/course-ability.png"
              alt="GROWMATE六大核心能力培养体系：问题建出与识别、知识与能力建构、合作探究与方案设计、原型制造与成果形态、成果展示、评估与反思"
              className="w-full rounded-xl"
              loading="lazy"
            />
          </div>
        </div>

        {/* ========== 课程产品线 - 已隐藏 ========== */}
        {/*
        <div className="bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3">
            <h3 className="text-white font-bold flex items-center gap-2">
              <span className="text-xl">📚</span>
              十年磨一课《自然里的科学课》· 中国科学技术大学出版出品
            </h3>
            <p className="text-amber-100 text-xs mt-0.5">科普课 · 科创课 · 科考课 三大产品线</p>
          </div>
          <div className="p-4">
            <img
              src="/images/course-products.png"
              alt="GROWMATE三大课程产品线：01科普课-自然里的科学课、02科创课-科创实验室、03科考课-野外研学"
              className="w-full rounded-xl"
              loading="lazy"
            />
          </div>
        </div>
        */}

        {/* 个性化匹配说明 */}
        <div className="bg-white rounded-2xl p-6 border border-violet-100 shadow-sm mb-6">
          <h3 className="font-bold text-[#0A0A1A] mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center text-white text-sm">🎯</span>
            {studentName}的课程匹配建议
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                type: '科普课',
                icon: '🌿',
                color: 'emerald',
                tagline: '知识启蒙 · 校内实验室',
                desc: subDirection === 'beta'
                  ? `${top2[0]?.name}驱动的好奇心适合在真实自然场景中学习科学知识，科普课的小组观察讨论环节能充分发挥协作表达优势。`
                  : `${top2[0]?.name}驱动的好奇心+探究力适合在真实自然场景中学习科学知识，科普课的"观察-提问-验证"流程与WILDER优势高度匹配。`,
              },
              {
                type: '科创课',
                icon: '🔧',
                color: 'violet',
                tagline: '项目制学习 · 科创实验室',
                desc: subDirection === 'beta'
                  ? `${top2[0]?.name}支撑团队项目中的创意表达和协作呈现，科创课的团队汇报和作品展示环节是最佳舞台。`
                  : `${top2[0]?.name}支撑从"想法→方案→作品"的完整闭环，科创课的项目制学习能最大化发挥这一优势。`,
              },
              {
                type: '科考课',
                icon: '🏕️',
                color: 'amber',
                tagline: '户外探索 · 野外研学',
                desc: subDirection === 'beta'
                  ? `${top2[0]?.name}驱动的探索欲望在户外科考中与团队互动结合，科考课丰富的社交协作场景能全面激活协作表达潜力。`
                  : `${top2[0]?.name}驱动的探索欲望在户外科考场景中能获得最大释放，科考课的独立观察记录环节能深化结构化思维。`,
              },
            ].map((item) => {
              const colors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
                emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
                violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700' },
                amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
              }
              const c = colors[item.color]
              return (
                <div key={item.type} className={`${c.bg} border ${c.border} rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className={`font-bold ${c.text}`}>荒野{item.type}</h4>
                      <span className={`text-xs ${c.badge} px-2 py-0.5 rounded-full`}>{item.tagline}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[rgba(10,10,26,0.6)] mt-2">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ========== 联系销售 CTA - 已隐藏 ========== */}
        {/*
        <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">🌟 开启{studentName}的科创天赋成长之旅</h3>
          <p className="text-indigo-100 text-sm mb-4">
            添加GROWMATE小树老师，获取专属课程体验名额和科创培养方案
          </p>
          <div className="flex justify-center">
            <div className="bg-teal-50 rounded-2xl p-5 border-2 border-teal-400 shadow-lg">
              <p className="text-center text-sm text-gray-600 font-medium mb-3">GROWMATE · 小树老师</p>
              <img src="/images/expert-wechat-qr.jpg" alt="GROWMATE小树老师微信二维码" className="w-36 h-36 rounded-lg mx-auto" />
              <p className="text-center text-sm text-gray-700 font-bold mt-3">GROWMATE · 小树老师</p>
              <p className="text-center text-xs text-[#2A4CC0] mt-1">扫码添加，预约一对一报告解读</p>
            </div>
          </div>
        </div>
        */}
      </div>
    </section>
  )
}

export default ReportCourseRecommendation
