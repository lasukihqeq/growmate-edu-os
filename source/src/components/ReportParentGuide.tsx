/**
 * ReportParentGuide.tsx - 家长指南组件
 *
 * 功能: 报告的家长指导章节
 * 包含:
 * - 家长实践指南（学习特点、培养方案、年龄段发展、亲子沟通）
 * - 家庭沟通指南（鼓励句式、提问句式、边界句式）
 * - 家长20句常用指导话语
 * - 学校与老师配合方案
 * - 家长认知升级（误解vs真相）
 */

import React from 'react'
import { ReportSectionHeader } from './ui/ReportSectionHeader'
import type { DynamicReportData } from '../lib/reportContentGenerator'

// ========== Props 接口 ==========
export interface ReportParentGuideProps {
  /** 报告数据 */
  reportData: DynamicReportData
  /** 章节追踪函数 */
  trackSection?: (element: HTMLElement | null) => void
}

// ========== 颜色辅助函数 ==========
const COLOR_MAP: Record<string, { bg: string; text: string; border: string; light: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', light: 'bg-blue-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', light: 'bg-amber-100' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', light: 'bg-emerald-100' },
  slate: { bg: 'bg-[rgba(59,95,217,0.04)]', text: 'text-[rgba(10,10,26,0.7)]', border: 'border-[rgba(10,10,26,0.06)]', light: 'bg-[rgba(59,95,217,0.06)]' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', light: 'bg-purple-100' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200', light: 'bg-rose-100' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200', light: 'bg-teal-100' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200', light: 'bg-indigo-100' },
  gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', light: 'bg-gray-100' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-800', border: 'border-violet-200', light: 'bg-violet-100' },
}

function getColor(c: string) {
  return COLOR_MAP[c] || COLOR_MAP.gray
}

/**
 * 报告家长指南组件
 */
export const ReportParentGuide: React.FC<ReportParentGuideProps> = ({
  reportData: d,
  trackSection,
}) => {
  return (
    <>
      {/* ========== 家长实践指南 ========== */}
      <section id="section-family" ref={trackSection} className="page-break py-8">
        <ReportSectionHeader
          variant="parent"
          title="家长实践指南"
          subtitle="Parent Guide · 教育场景解析"
        />

        <div className="p-6 space-y-6">
          {/* 学习特点画像 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">学</span>
              学习特点画像
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {d.familySolutions.learningProfile.map((lp, i) => (
                <div key={i} className="bg-white border border-blue-200 rounded-xl p-4">
                  <div className="text-2xl mb-2">{lp.icon}</div>
                  <h5 className="font-bold text-blue-800 mb-2">{lp.title}</h5>
                  <p className="text-sm text-gray-600 mb-3">{lp.description}</p>
                  <ul className="space-y-1.5">
                    {lp.tips.map((tip, j) => (
                      <li key={j} className="text-xs text-gray-500 flex gap-1.5">
                        <span className="text-blue-400">* </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 个性化培养方案 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">培</span>
              个性化培养方案（场景化解决）
            </h4>
            <div className="space-y-4">
              {d.familySolutions.cultivationStrategy.map((cs, i) => {
                const c = getColor(cs.color)
                return (
                  <div key={i} className={`border ${c.border} rounded-xl overflow-hidden`}>
                    <div className={`${c.bg} p-3 flex items-center justify-between`}>
                      <span className="font-bold text-gray-700">场景：{cs.scenario}</span>
                      <span className={`text-xs ${c.text} bg-white px-2 py-0.5 rounded-full`}>预期效果：{cs.expectedOutcome}</span>
                    </div>
                    <div className="p-4 space-y-2 text-sm">
                      <p><span className="text-red-500 font-medium">常见困难：</span><span className="text-gray-600">{cs.problem}</span></p>
                      <p><span className="text-green-600 font-medium">方案：</span><span className="text-gray-600">{cs.solution}</span></p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 年龄段发展参考 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">发</span>
              年龄段发展参考
            </h4>
            <div className="space-y-4">
              {d.familySolutions.ageDevelopment.map((ad, i) => {
                const c = getColor(ad.color)
                return (
                  <div key={i} className={`bg-white border ${c.border} rounded-xl p-5`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`${c.text} font-bold text-lg`}>{ad.ageRange}</span>
                      <span className="text-gray-500">—</span>
                      <span className="font-medium text-gray-700">{ad.focus}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className={`${c.bg} rounded-lg p-3`}>
                        <p className="font-medium text-gray-700 text-sm mb-2">发展里程碑：</p>
                        <ul className="space-y-1">
                          {ad.milestones.map((m, j) => (
                            <li key={j} className="text-xs text-gray-600 flex gap-1.5">
                              <span>完成</span>
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium text-gray-700 text-sm mb-2">家长角色：</p>
                        <p className="text-xs text-gray-600">{ad.parentRole}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 亲子沟通升级 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">话</span>
              亲子沟通升级脚本
            </h4>
            <div className="space-y-4">
              {d.familySolutions.parentChildCommunication.map((pc, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <h5 className="font-bold text-gray-700 mb-3">场景：{pc.situation}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs text-red-500 font-medium mb-1">常见错误说法</p>
                      <p className="text-sm text-red-700 italic">{pc.wrongApproach}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-green-600 font-medium mb-1">推荐说法</p>
                      <p className="text-sm text-green-700 italic">{pc.rightApproach}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2.5">
                    <p className="text-xs text-blue-700"><strong>为什么有效：</strong>{pc.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== 家庭沟通指南 ========== */}
      <section id="section-8" ref={trackSection} className="page-break py-8">
        <ReportSectionHeader
          variant="parent"
          title="家庭沟通指南"
          subtitle="Family Communication · 沟通脚本"
        />

        <div className="p-6 space-y-6">
          {/* 鼓励句式 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-sm font-bold">赞</span>
              3句鼓励句式
            </h4>
            <div className="space-y-3">
              {d.communicationScripts.encouragements.map((item, i) => (
                <div key={i} className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <p className="font-medium text-green-800">{item.text}</p>
                  <p className="text-sm text-gray-600 mt-1">使用场景：{item.scene}。意图：{item.intent}。</p>
                </div>
              ))}
            </div>
          </div>

          {/* 提问句式 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">问</span>
              3句提问句式
            </h4>
            <div className="space-y-3">
              {d.communicationScripts.questions.map((item, i) => (
                <div key={i} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <p className="font-medium text-blue-800">{item.text}</p>
                  <p className="text-sm text-gray-600 mt-1">使用场景：{item.scene}。意图：{item.intent}。</p>
                </div>
              ))}
            </div>
          </div>

          {/* 边界句式 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-sm font-bold">界</span>
              2句边界句式
            </h4>
            <div className="space-y-3">
              {d.communicationScripts.boundaries.map((item, i) => (
                <div key={i} className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <p className="font-medium text-amber-800">{item.text}</p>
                  <p className="text-sm text-gray-600 mt-1">使用场景：{item.scene}。意图：{item.intent}。</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== 家长20句常用指导话语 ========== */}
      {d.parentGuidance20 && d.parentGuidance20.phrases.length > 0 && (
        <section id="section-parent-phrases" ref={trackSection} className="page-break py-8">
          <ReportSectionHeader
            variant="parent"
            title={`家长20句常用指导话语（${d.parentGuidance20.ageLabel}）`}
            subtitle="Parent Phrases · 日常指导"
          />

          <div className="p-6 space-y-5">
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                以下20句话语根据{d.student.name}的<strong className="text-violet-600">「{d.talentType}」</strong>潜能类型和<strong className="text-violet-600">{d.parentGuidance20.ageLabel}</strong>认知特点定制。
              </p>
            </div>

            {(['encourage', 'question', 'boundary', 'conflict', 'motivation'] as const).map(cat => {
              const items = d.parentGuidance20!.phrases.filter(p => p.category === cat)
              if (items.length === 0) return null

              const catMeta: Record<string, { icon: string; label: string; color: string }> = {
                encourage: { icon: '赞', label: '鼓励句式', color: 'green' },
                question: { icon: '问', label: '提问句式', color: 'blue' },
                boundary: { icon: '界', label: '边界设定', color: 'amber' },
                conflict: { icon: '和', label: '冲突化解', color: 'rose' },
                motivation: { icon: '激', label: '激励动力', color: 'purple' },
              }
              const meta = catMeta[cat]
              const c = getColor(meta.color)

              return (
                <div key={cat}>
                  <h4 className={`font-bold ${c.text} mb-3 flex items-center gap-2`}>
                    <span className={`w-7 h-7 ${c.light} rounded-full flex items-center justify-center text-sm font-bold`}>{meta.icon}</span>
                    {meta.label}（{items.length}句）
                  </h4>
                  <div className="space-y-2">
                    {items.map((p, i) => (
                      <div key={i} className={`${c.bg} border ${c.border} rounded-lg p-3`}>
                        <p className="text-sm font-bold text-gray-800 mb-1">"{p.phrase}"</p>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>场景：{p.scene}</span>
                          <span>意图：{p.intent}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* 避免说法 */}
            {d.parentGuidance20.avoidPhrases.length > 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <h4 className="font-bold text-red-700 mb-2">请避免这些说法</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {d.parentGuidance20.avoidPhrases.map((ap, i) => (
                    <div key={i} className="bg-white rounded-lg p-2 border border-red-100">
                      <p className="text-sm text-red-700 line-through">{ap}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========== 学校与老师配合 ========== */}
      <section id="section-9" ref={trackSection} className="page-break py-8">
        <ReportSectionHeader
          variant="parent"
          title="学校与老师怎么配合"
          subtitle="School Cooperation · 家校协同"
        />

        <div className="p-6 space-y-6">
          <p className="text-gray-600 mb-4">以下内容可直接转发给班主任或科学老师：</p>

          {/* 学习风格画像 */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">风</span>
              {d.student.name}的学习风格画像
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {d.schoolCooperation.learningStyle.map((ls, i) => {
                const c = getColor(ls.color)
                return (
                  <div key={i} className="bg-white p-3 rounded-lg">
                    <p className="text-sm"><strong className={c.text}>{i + 1}. {ls.title}：</strong>{ls.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 适合的课堂角色 */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">角</span>
              适合的课堂角色
            </h4>
            <div className="flex flex-wrap gap-3">
              {d.schoolCooperation.classroomRoles.map((role, i) => {
                const tagColors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-amber-100 text-amber-700']
                return (
                  <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-medium ${tagColors[i % tagColors.length]}`}>
                    {role}
                  </span>
                )
              })}
            </div>
          </div>

          {/* 老师可以给TA的机会 */}
          <div className="bg-green-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">机</span>
              老师可以给TA的{d.schoolCooperation.teacherOpportunities.length}个机会
            </h4>
            <div className="space-y-3">
              {d.schoolCooperation.teacherOpportunities.map((opp, i) => (
                <div key={i} className="bg-white p-4 rounded-lg">
                  <p className="font-medium text-green-700">{i + 1}. {opp.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{opp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== 家长认知升级 ========== */}
      {d.talentParentFocus && d.talentParentFocus.length > 0 && (
        <section id="section-parent-focus" ref={trackSection} className="page-break py-8">
          <ReportSectionHeader
            variant="parent"
            title={`家长认知升级：关于${d.talentType}的真相`}
            subtitle="Cognitive Upgrade · 误解vs真相"
          />

          <div className="p-6 space-y-5">
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                以下内容基于<strong className="text-pink-600">「{d.talentType}」</strong>潜能类型的特征，帮助您识别常见的教育误区，用科学的视角重新理解孩子的行为表现。
              </p>
            </div>

            {d.talentParentFocus.map((focus, i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-pink-200 overflow-hidden shadow-md">
                {/* 高亮核心观点 */}
                <div className="bg-pink-500 p-4 text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">核心</span>
                    <p className="font-bold text-lg">{focus.highlight}</p>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* 常见误解 */}
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">X</span>
                      <h5 className="font-bold text-red-700 text-sm">常见误解</h5>
                    </div>
                    <p className="text-sm text-red-800 font-medium">家长常说：{focus.commonMisunderstanding}</p>
                  </div>

                  {/* 真相重构 */}
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">OK</span>
                      <h5 className="font-bold text-green-700 text-sm">科学真相</h5>
                    </div>
                    <p className="text-sm text-green-800 leading-relaxed">{focus.truthReframe}</p>
                  </div>

                  {/* 行动建议 */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Go</span>
                      <h5 className="font-bold text-blue-700 text-sm">今天就能做</h5>
                    </div>
                    <p className="text-sm text-blue-800 leading-relaxed">{focus.actionTip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export default ReportParentGuide
