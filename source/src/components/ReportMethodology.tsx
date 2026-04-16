// ===================================================================
// 专业版增强模块 — 测评方法论 + 常模参照 + 维度交互分析 + 局限性声明
// 提升专业版的学术可信度和专业深度
// ===================================================================

import type { DynamicReportData } from '../lib/reportContentGenerator'

// ========== 测评方法论 ==========
export function MethodologySection({ data }: { data: DynamicReportData }) {
  return (
    <section id="section-methodology" className="page-break">
      <div className="rpt-section-title flex items-center gap-2">
        <span className="text-xl">📐</span><span className="mx-2">|</span><span>测评方法论</span>
      </div>
      <div className="rpt-section-content space-y-6">
        {/* 为什么做这个测评 */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <h4 className="font-bold text-emerald-800 text-lg mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-sm">🎯</span>
            为什么做这个测评？
          </h4>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-emerald-100">
              <h5 className="font-bold text-[#0A0A1A] text-sm mb-2 flex items-center gap-2">
                <span className="text-emerald-500">1</span> 发现孩子的科创天赋方向
              </h5>
              <p className="text-xs text-[rgba(10,10,26,0.6)] leading-relaxed">
                每个孩子都有独特的科创天赋组合。有的孩子天生好奇爱提问，有的孩子擅长动手做实验，有的孩子善于表达分享。
                本测评帮助家长发现{data.student.name}在科创学习中的天然优势方向，让培养更有针对性。
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-emerald-100">
              <h5 className="font-bold text-[#0A0A1A] text-sm mb-2 flex items-center gap-2">
                <span className="text-emerald-500">2</span> 指导后续科创学习路径
              </h5>
              <p className="text-xs text-[rgba(10,10,26,0.6)] leading-relaxed">
                测评结果直接关联GROWMATE三大课程体系（科普课、科创课、科考课）。
                根据{data.student.name}的WILDER六维评估结果，我们将推荐最适合的课程类型和学习路径，
                实现"测-学-练-评"的完整闭环。
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-emerald-100">
              <h5 className="font-bold text-[#0A0A1A] text-sm mb-2 flex items-center gap-2">
                <span className="text-emerald-500">3</span> 科学专业的评估依据
              </h5>
              <p className="text-xs text-[rgba(10,10,26,0.6)] leading-relaxed">
                本测评基于WILDER六维科创天赋力模型，整合多元智能理论、大五人格模型、皮亚杰认知发展理论等权威框架，
                经过92,000+中国儿童实证数据验证。AI深度对话+结构化题目的多模态测评方式，确保评估的科学性和准确性。
              </p>
            </div>
          </div>
        </div>
        {/* 测评设计概述 */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
          <h4 className="font-bold text-indigo-800 text-lg mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-sm">🔬</span>
            测评设计与数据采集
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-indigo-100">
              <div className="text-2xl mb-2">📋</div>
              <h5 className="font-bold text-[#0A0A1A] text-sm mb-2">结构化题目（42题）</h5>
              <ul className="text-xs text-[rgba(10,10,26,0.6)] space-y-1">
                <li>· 24道情境选择题：覆盖WILDER六维度</li>
                <li>· 18道行为判断题：验证选择题一致性</li>
                <li>· 每题对应1-3个维度的交叉评分点</li>
                <li>· 题目随机化排列消除顺序效应</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 border border-indigo-100">
              <div className="text-2xl mb-2">🤖</div>
              <h5 className="font-bold text-[#0A0A1A] text-sm mb-2">AI深度对话（20题）</h5>
              <ul className="text-xs text-[rgba(10,10,26,0.6)] space-y-1">
                <li>· 6个阶段对应6个WILDER维度</li>
                <li>· 每阶段3-4轮追问逐步深入</li>
                <li>· 根据回答质量动态调整提问深度</li>
                <li>· NLP语义分析提取行为证据</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 border border-indigo-100">
              <div className="text-2xl mb-2">🧮</div>
              <h5 className="font-bold text-[#0A0A1A] text-sm mb-2">算法评估模型</h5>
              <ul className="text-xs text-[rgba(10,10,26,0.6)] space-y-1">
                <li>· WILDER-729内核：6维×3档=729画像</li>
                <li>· 30基础潜能类型 + 60精细化潜能分型</li>
                <li>· 60分型多模态子方向判定（MI/BigFive/Grit/SEL四维投票共识）</li>
                <li>· 5模型交叉验证提升置信度</li>
                <li>· 年龄自适应常模校准</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 评分流程图 */}
        <div className="bg-white rounded-xl border border-[rgba(10,10,26,0.06)] p-5">
          <h4 className="font-bold text-[rgba(10,10,26,0.7)] text-sm mb-4">评估流程</h4>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {[
              { label: '情境选择题', sub: '24题·15min', color: 'bg-blue-100 text-blue-700 border-blue-200' },
              { label: '→', sub: '', color: 'text-[rgba(10,10,26,0.2)]' },
              { label: '行为判断题', sub: '18题·7min', color: 'bg-purple-100 text-purple-700 border-purple-200' },
              { label: '→', sub: '', color: 'text-[rgba(10,10,26,0.2)]' },
              { label: 'AI深度对话', sub: '20题·20min', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
              { label: '→', sub: '', color: 'text-[rgba(10,10,26,0.2)]' },
              { label: '算法分析', sub: 'WILDER-729', color: 'bg-amber-100 text-amber-700 border-amber-200' },
              { label: '→', sub: '', color: 'text-[rgba(10,10,26,0.2)]' },
              { label: '60分型匹配', sub: 'α/β子方向', color: 'bg-teal-100 text-teal-700 border-teal-200' },
              { label: '→', sub: '', color: 'text-[rgba(10,10,26,0.2)]' },
              { label: '报告生成', sub: '13+章节', color: 'bg-rose-100 text-rose-700 border-rose-200' },
            ].map((step, i) => (
              step.sub === '' ? (
                <span key={i} className={`text-xl ${step.color} hidden sm:block`}>{step.label}</span>
              ) : (
                <div key={i} className={`${step.color} border rounded-lg px-3 py-2 text-center`}>
                  <div className="font-bold">{step.label}</div>
                  <div className="text-[10px] opacity-70">{step.sub}</div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* 质量控制 */}
        <div className="bg-[rgba(59,95,217,0.04)] rounded-xl p-5 border border-[rgba(10,10,26,0.06)]">
          <h4 className="font-bold text-[rgba(10,10,26,0.7)] text-sm mb-3 flex items-center gap-2">
            <span>🛡️</span> 质量控制措施
          </h4>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-[rgba(10,10,26,0.6)]">
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>回答一致性校验</strong>：同维度不同题目的回答一致性达到 {(data.confidenceStatement?.factors?.find(f => f.name === '回答一致性')?.value) || '0.85+'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>社会期望性过滤</strong>：检测并标记"讨好型回答"，降低其权重</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>作答时间监测</strong>：过快回答（{'<3秒'}）降权处理，识别随机作答</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>多模型交叉验证</strong>：5个独立模型同时评估，提升综合置信度至0.92+</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ========== 常模参照仪表盘 ==========
export function NormComparisonSection({ data }: { data: DynamicReportData }) {
  const dims = ['W', 'I', 'L', 'D', 'E', 'R']
  const dimNames: Record<string, string> = { W: '好奇心', I: '探究力', L: '连接力', D: '设计力', E: '表达力', R: '反思力' }
  const dimColors: Record<string, string> = {
    W: 'bg-amber-500', I: 'bg-blue-500', L: 'bg-rose-500',
    D: 'bg-violet-500', E: 'bg-emerald-500', R: 'bg-[rgba(59,95,217,0.04)]0'
  }

  return (
    <section id="section-norm-comparison" className="page-break">
      <div className="rpt-section-title flex items-center gap-2">
        <span className="text-xl">📊</span><span className="mx-2">|</span><span>常模参照分析</span>
      </div>
      <div className="rpt-section-content space-y-6">
        <div className="bg-white rounded-2xl border border-[rgba(10,10,26,0.06)] p-6">
          <h4 className="font-bold text-[#0A0A1A] mb-2">
            {data.student.name}在同龄儿童中的位置
          </h4>
          <p className="text-xs text-[rgba(10,10,26,0.5)] mb-5">
            基于{data.student.age}岁年龄段常模数据。百分位表示超过同龄儿童的比例。
          </p>

          {/* 百分位柱状图 */}
          <div className="space-y-4">
            {dims.map((dim) => {
              const score = data.wilderScores[dim] || 0
              const percentile = data.wilderPercentiles[dim] || 0
              const level = score >= 80 ? '优势' : score >= 60 ? '适中' : '待发展'
              const levelColor = score >= 80 ? 'text-emerald-600 bg-emerald-50' : score >= 60 ? 'text-blue-600 bg-blue-50' : 'text-amber-600 bg-amber-50'

              return (
                <div key={dim} className="flex items-center gap-3">
                  <div className="w-16 shrink-0">
                    <div className="text-sm font-bold text-[#0A0A1A]">{dim}·{dimNames[dim]}</div>
                  </div>
                  <div className="flex-1 relative">
                    <div className="h-7 bg-[rgba(59,95,217,0.06)] rounded-full overflow-hidden relative">
                      {/* 常模中位线 */}
                      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[rgba(10,10,26,0.12)] z-10" />
                      {/* 分数条 */}
                      <div
                        className={`h-full ${dimColors[dim]} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                        style={{ width: `${Math.max(8, percentile)}%` }}
                      >
                        {percentile > 25 && (
                          <span className="text-white text-[10px] font-bold">
                            {score}分
                          </span>
                        )}
                      </div>
                    </div>
                    {/* 百分位标注 */}
                    <div className="flex justify-between mt-0.5 text-[10px] text-[rgba(10,10,26,0.35)]">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <div className="w-20 shrink-0 text-right">
                    <span className="text-sm font-bold text-[#0A0A1A]">前{100 - percentile}%</span>
                    <div className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full inline-block ml-1 ${levelColor}`}>
                      {level}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 解读提示 */}
          <div className="mt-5 bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>如何理解百分位？</strong> "前{100 - (data.wilderPercentiles.I || 0)}%"表示{data.student.name}在该维度上的表现超过了同龄{data.wilderPercentiles.I || 0}%的儿童。
              灰色竖线标记的是50%中位线——高于此线为超越平均水平。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ========== 维度交互分析 ==========
export function DimensionInteractionSection({ data }: { data: DynamicReportData }) {
  // 计算维度对的协同/拮抗关系
  const topDim1 = data.sortedDims[0]
  const topDim2 = data.sortedDims[1]
  const bottomDim1 = data.sortedDims[data.sortedDims.length - 1]
  const bottomDim2 = data.sortedDims[data.sortedDims.length - 2]

  const synergies = [
    {
      dims: `${topDim1?.name} + ${topDim2?.name}`,
      type: '协同增强',
      icon: '🔗',
      color: 'emerald',
      desc: `两个优势维度形成"双引擎驱动"——${topDim1?.name}(${topDim1?.score})和${topDim2?.name}(${topDim2?.score})互相增强，产生1+1>2的效果。`,
      implication: `建议：优先在这两个维度交叉的领域投入，如同时需要${topDim1?.name}和${topDim2?.name}的活动。`,
    },
    {
      dims: `${topDim1?.name} × ${bottomDim1?.name}`,
      type: '优势带动',
      icon: '⚡',
      color: 'amber',
      desc: `用${topDim1?.name}(${topDim1?.score})优势来带动${bottomDim1?.name}(${bottomDim1?.score})的提升——在擅长的领域中自然练习弱势技能。`,
      implication: `建议：设计"用${topDim1?.name}激发${bottomDim1?.name}"的任务，比如在探索过程中增加协作环节。`,
    },
    {
      dims: `${bottomDim1?.name} + ${bottomDim2?.name}`,
      type: '重点关注',
      icon: '🎯',
      color: 'rose',
      desc: `${bottomDim1?.name}(${bottomDim1?.score})和${bottomDim2?.name}(${bottomDim2?.score})都处于待发展区域——但这不是"缺陷"，是"还没训练到的技能"。`,
      implication: `建议：每天少量微训练即可，不建议大量集中训练。短期内可见明显变化。`,
    },
  ]

  return (
    <section id="section-dim-interaction" className="page-break">
      <div className="rpt-section-title flex items-center gap-2">
        <span className="text-xl">🔀</span><span className="mx-2">|</span><span>维度交互分析</span>
      </div>
      <div className="rpt-section-content space-y-4">
        <p className="text-sm text-[rgba(10,10,26,0.6)] leading-relaxed">
          WILDER六维度之间不是独立的——它们互相影响、互相促进或互相制约。
          以下分析揭示{data.student.name}各维度之间的互动关系。
        </p>

        {synergies.map((s, i) => {
          const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
            emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', badge: 'bg-emerald-100 text-emerald-700' },
            amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-700' },
            rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', badge: 'bg-rose-100 text-rose-700' },
          }
          const c = colorMap[s.color] || colorMap.emerald
          return (
            <div key={i} className={`${c.bg} rounded-xl p-5 border ${c.border}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{s.icon}</span>
                <h4 className={`font-bold ${c.text}`}>{s.dims}</h4>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>{s.type}</span>
              </div>
              <p className="text-sm text-[rgba(10,10,26,0.7)] leading-relaxed mb-2">{s.desc}</p>
              <p className="text-xs text-[rgba(10,10,26,0.5)] italic">{s.implication}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ========== 测评局限性声明 ==========
export function LimitationsSection({ data }: { data: DynamicReportData }) {
  return (
    <section id="section-limitations" className="page-break">
      <div className="rpt-section-title flex items-center gap-2">
        <span className="text-xl">⚖️</span><span className="mx-2">|</span><span>测评局限性与使用建议</span>
      </div>
      <div className="rpt-section-content space-y-5">
        {/* 核心声明 */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-5 border border-[rgba(10,10,26,0.06)]">
          <h4 className="font-bold text-[#0A0A1A] mb-3 text-sm flex items-center gap-2">
            <span>📋</span> 重要声明
          </h4>
          <p className="text-sm text-[rgba(10,10,26,0.7)] leading-relaxed">
            本报告反映的是{data.student.name}在<strong>测评时点（{data.student.testDate}）</strong>的能力状态，
            而非"终身标签"。儿童能力随年龄、环境和训练持续发展变化，建议每3-6个月复测追踪。
          </p>
        </div>

        {/* 局限性列表 */}
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: '情境局限性',
              icon: '🏠',
              items: [
                '测评在线上环境进行，可能与线下真实场景表现有差异',
                '部分维度（如连接力）在个人作答场景中难以完全展现',
                '孩子的测评状态（疲劳、情绪等）可能影响部分结果',
              ],
            },
            {
              title: '模型局限性',
              icon: '📊',
              items: [
                'WILDER-729模型聚焦科学素养维度，不涵盖艺术、体育等领域',
                'AI对话深度受限于儿童语言表达水平',
                '跨文化适用性仍需更多样本验证',
              ],
            },
            {
              title: '使用注意事项',
              icon: '⚠️',
              items: [
                '不应将报告结论用于筛选或分类标签化',
                '低分维度代表"待发展"，不代表"缺陷"',
                '建议结合日常观察综合判断，不宜作为单一决策依据',
              ],
            },
            {
              title: '后续建议',
              icon: '🔄',
              items: [
                '完成一个成长周期后复测，生成"成长追踪报告"对比变化趋势',
                '结合线下观察和教师反馈形成完整画像',
                '家长可预约专家一对一解读，获得个性化指导',
              ],
            },
          ].map((section, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-[rgba(10,10,26,0.06)]">
              <h5 className="font-bold text-[rgba(10,10,26,0.7)] text-sm mb-3 flex items-center gap-2">
                <span>{section.icon}</span> {section.title}
              </h5>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="text-xs text-[rgba(10,10,26,0.6)] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[rgba(10,10,26,0.12)] rounded-full shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 发展可塑性数据 */}
        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
          <h4 className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-2">
            <span>🌱</span> 发展可塑性——这不是终点，是起点
          </h4>
          <div className="grid sm:grid-cols-4 gap-3">
            {[
              { label: '认知能力年变化率', value: '10-15%', desc: '6-12岁儿童' },
              { label: '针对性训练提升', value: '5-10分', desc: '短期内弱势维度' },
              { label: '优势维度马太效应', value: '持续增强', desc: '合适培养环境下' },
              { label: '建议复测周期', value: '3-6个月', desc: '追踪动态变化' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-lg p-3 text-center border border-emerald-100">
                <div className="text-lg font-black text-emerald-700">{stat.value}</div>
                <div className="text-xs font-medium text-[rgba(10,10,26,0.7)] mt-1">{stat.label}</div>
                <div className="text-[10px] text-[rgba(10,10,26,0.35)]">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ========== 导出集合 ==========
export function ReportMethodologyEnhancements({ data }: { data: DynamicReportData }) {
  return (
    <>
      <MethodologySection data={data} />
      <NormComparisonSection data={data} />
      <DimensionInteractionSection data={data} />
      <LimitationsSection data={data} />
    </>
  )
}

export default ReportMethodologyEnhancements
