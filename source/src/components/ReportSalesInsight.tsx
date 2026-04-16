/**
 * 报告销售洞察组件
 * 嵌入在测评报告中，面向销售人员展示转化要点（仅屏幕可见，不打印）
 */

import { identifyChildProfile, getSalesPackage, CHILD_PROFILES } from '../lib/salesKnowledgeBase'

interface Props {
  scores: Record<string, number>
  studentName: string
  studentAge: number
}

export function ReportSalesInsight({ scores, studentName, studentAge }: Props) {
  const profileKey = identifyChildProfile(scores)
  if (!profileKey) return null

  const profile = CHILD_PROFILES[profileKey]
  const pkg = getSalesPackage(profileKey)
  if (!profile || !pkg) return null

  const strategy = pkg.strategy

  return (
    <section className="py-6 px-4 sm:px-6 print:hidden" id="section-sales-insight">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl border border-amber-200 overflow-hidden">
          {/* 标题栏 */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <span className="text-lg">🎯</span>
              <span className="font-bold">销售转化要点</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">内部参考</span>
            </div>
            <span className="text-xs text-amber-100">画像: {profile.type}</span>
          </div>

          <div className="p-5 space-y-4">
            {/* 核心画像 */}
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-amber-100">
              <span className="text-3xl">{profile.icon}</span>
              <div>
                <div className="font-bold text-gray-800">{studentName} · {studentAge}岁</div>
                <div className="text-sm text-amber-700">{profile.type} - {profile.tagline}</div>
              </div>
            </div>

            {/* 家长痛点 & 话术 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-red-100">
                <h4 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-1">
                  <span>💢</span> 家长痛点 & 回应
                </h4>
                <ul className="space-y-2">
                  {strategy.parentPainPoints.slice(0, 3).map((p, i) => (
                    <li key={i} className="text-xs">
                      <div className="text-red-500 font-medium">{p.pain}</div>
                      <div className="text-gray-600 mt-0.5">→ {p.response}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-4 border border-green-100">
                <h4 className="text-sm font-bold text-green-600 mb-2 flex items-center gap-1">
                  <span>💡</span> 沟通话术
                </h4>
                <ul className="space-y-2">
                  {strategy.communicationScript.slice(0, 3).map((s, i) => (
                    <li key={i} className="text-xs">
                      <div className="text-green-600 font-medium">{s.scene}</div>
                      <div className="text-gray-600 mt-0.5">"{s.script}"</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 推荐课程 */}
            {strategy.courseRecommendations.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <h4 className="text-sm font-bold text-blue-600 mb-2 flex items-center gap-1">
                  <span>📚</span> 优先推荐课程
                </h4>
                <div className="space-y-1.5">
                  {strategy.courseRecommendations.slice(0, 4).map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className={`px-1.5 py-0.5 rounded text-white text-[10px] font-bold ${
                        c.priority === 1 ? 'bg-red-500' : c.priority === 2 ? 'bg-amber-500' : 'bg-gray-400'
                      }`}>P{c.priority}</span>
                      <span className="font-medium text-gray-800">{c.course}</span>
                      <span className="text-gray-400">- {c.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 异议处理 & 成交要点 */}
            <div className="grid md:grid-cols-2 gap-4">
              {strategy.objectionHandling.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-purple-100">
                  <h4 className="text-sm font-bold text-purple-600 mb-2 flex items-center gap-1">
                    <span>🛡️</span> 异议处理
                  </h4>
                  <div className="space-y-2">
                    {strategy.objectionHandling.slice(0, 2).map((obj, i) => (
                      <div key={i} className="text-xs">
                        <span className="text-purple-500 font-medium">"{obj.objection}"</span>
                        <div className="text-gray-600 mt-0.5">→ {obj.response}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {strategy.closingPoints.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-teal-100">
                  <h4 className="text-sm font-bold text-[#2A4CC0] mb-2 flex items-center gap-1">
                    <span>✅</span> 成交关键点
                  </h4>
                  <ul className="space-y-1">
                    {strategy.closingPoints.slice(0, 3).map((p, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <span className="text-teal-400 mt-0.5">✦</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
