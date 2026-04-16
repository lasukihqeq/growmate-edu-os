import { useState, useMemo } from 'react'
import {
  CHILD_PROFILES,
  identifyChildProfile, getSalesPackage,
  EDUCATION_PHILOSOPHY_CONTRAST,
  PBL_VALUE_PROPOSITION,
  UNIVERSAL_PAIN_POINTS,
  UNIVERSAL_OBJECTION_HANDLING,
  SALES_SCRIPT_TEMPLATES,
  COURSE_TALENT_MATRIX,
  type ChildProfile, type SalesStrategy,
} from '../lib/salesKnowledgeBase'
import {
  recommendCourses,
  getCategoryDescription,
  getGradeRange,
  type RecommendationResult,
} from '../lib/courseRecommendationEngine'

interface Props {
  initialScores?: Record<string, number>
  studentName?: string
  studentAge?: number
}

const PROFILE_KEYS = Object.keys(CHILD_PROFILES)

const WILDER_COLORS: Record<string, string> = {
  W: '#f59e0b', I: '#3b82f6', L: '#8b5cf6', D: '#10b981', E: '#ef4444', R: '#06b6d4',
}
const WILDER_NAMES: Record<string, string> = {
  W: '好奇心', I: '探究力', L: '联结力', D: '设计力', E: '表达力', R: '反思力',
}

const CATEGORY_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  '科普': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  '科创': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  '科考': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  '附加集训': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
}

type ToolTab = 'profiles' | 'courses' | 'pbl' | 'painPoints' | 'objections' | 'scripts' | 'workflow' | 'matrix'

export function SalesStrategyPanel({ initialScores, studentName, studentAge = 9 }: Props) {
  const matchedKey = initialScores ? identifyChildProfile(initialScores) : null
  const [selectedKey, setSelectedKey] = useState<string | null>(matchedKey)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['painPoints', 'courses', 'scripts']))
  const [toolTab, setToolTab] = useState<ToolTab>(initialScores ? 'courses' : 'profiles')
  const [expandedCategory, setExpandedCategory] = useState<string | null>('科普')

  // 基于WILDER分数计算课程推荐
  const courseRecommendation = useMemo<RecommendationResult | null>(() => {
    if (!initialScores) return null
    return recommendCourses(initialScores, studentAge)
  }, [initialScores, studentAge])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      next.has(section) ? next.delete(section) : next.add(section)
      return next
    })
  }

  const pkg = selectedKey ? getSalesPackage(selectedKey) : null

  // ==================== 工具Tab切换 ====================
  const renderToolTabs = () => (
    <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1 flex-wrap">
      {([
        { key: 'courses', label: '🎯 课程推荐', highlight: !!initialScores },
        { key: 'workflow', label: '📋 成交工作流' },
        { key: 'profiles', label: '👤 画像策略', count: PROFILE_KEYS.length },
        { key: 'pbl', label: '📚 PBL理念' },
        { key: 'painPoints', label: '💬 痛点库' },
        { key: 'objections', label: '🛡️ 异议处理' },
        { key: 'scripts', label: '🎙️ 话术模板' },
        { key: 'matrix', label: '📊 课程匹配' },
      ] as { key: ToolTab; label: string; count?: number; highlight?: boolean }[]).map(t => (
        <button key={t.key} onClick={() => { setToolTab(t.key); setSelectedKey(null) }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            toolTab === t.key 
              ? 'bg-white text-gray-900 shadow-sm' 
              : t.highlight 
                ? 'text-[#2A4CC0] bg-teal-50 hover:bg-teal-100' 
                : 'text-gray-500 hover:text-gray-700'
          }`}>
          {t.label} {t.count && <span className="ml-1 px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded-full text-[10px]">{t.count}</span>}
        </button>
      ))}
    </div>
  )

  // ==================== PBL教育理念 ====================
  const renderPBLFramework = () => (
    <div className="space-y-6">
      {/* 成全式教育对比 */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
        <h3 className="text-lg font-bold text-teal-800 mb-2">{EDUCATION_PHILOSOPHY_CONTRAST.title}</h3>
        <p className="text-sm text-[#2A4CC0] mb-4">{EDUCATION_PHILOSOPHY_CONTRAST.description}</p>
        <div className="space-y-3">
          {EDUCATION_PHILOSOPHY_CONTRAST.contrasts.map((c, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-teal-100">
              <div className="text-xs font-bold text-teal-700 mb-2">{c.aspect}</div>
              <div className="grid md:grid-cols-2 gap-3 mb-2">
                <div className="p-2 rounded-lg bg-red-50 border border-red-100">
                  <div className="text-[10px] text-red-500 font-medium mb-1">❌ 传统教育</div>
                  <div className="text-xs text-red-800">{c.traditional}</div>
                </div>
                <div className="p-2 rounded-lg bg-green-50 border border-green-100">
                  <div className="text-[10px] text-green-500 font-medium mb-1">✅ 潜能成全教育</div>
                  <div className="text-xs text-green-800">{c.growmate}</div>
                </div>
              </div>
              <div className="text-xs text-teal-700 bg-teal-50 p-2 rounded-lg">
                💡 <strong>销售切入点：</strong>{c.salesHook}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <div className="text-sm font-bold text-amber-800">🎯 核心话术</div>
          <p className="text-sm text-amber-700 mt-1">{EDUCATION_PHILOSOPHY_CONTRAST.coreMessage}</p>
        </div>
      </div>

      {/* PBL价值主张 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{PBL_VALUE_PROPOSITION.title}</h3>
        <p className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-xl italic">{PBL_VALUE_PROPOSITION.explanation}</p>
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {PBL_VALUE_PROPOSITION.keyBenefits.map((b, i) => (
            <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="font-bold text-blue-800 text-sm mb-1">{b.benefit}</div>
              <p className="text-xs text-blue-600 mb-2">{b.description}</p>
              <div className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
                👨‍👩‍👦 家长反馈：<span className="italic">"{b.parentResonance}"</span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
          <div className="text-sm font-bold text-orange-800 mb-1">🤔 常见质疑：{PBL_VALUE_PROPOSITION.counterObjection}</div>
          <p className="text-sm text-orange-700">{PBL_VALUE_PROPOSITION.response}</p>
        </div>
      </div>
    </div>
  )

  // ==================== 通用痛点库 ====================
  const renderPainPointsLibrary = () => (
    <div className="space-y-6">
      {/* 按年龄分类 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📅 按年龄分类的痛点</h3>
        {Object.entries(UNIVERSAL_PAIN_POINTS.byAge).map(([age, points]) => (
          <div key={age} className="mb-4">
            <div className="text-sm font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg inline-block mb-2">{age}</div>
            <div className="space-y-2">
              {points.map((p, i) => (
                <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-3 py-2 bg-red-50 border-b border-red-100 text-sm text-red-800">😟 {p.pain}</div>
                  <div className="px-3 py-2 bg-amber-50 border-b border-amber-100 text-xs text-amber-700">🔍 诊断：{p.diagnosis}</div>
                  <div className="px-3 py-2 bg-green-50 text-xs text-green-800">✅ {p.response}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 按场景分类 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🎭 按场景分类的痛点</h3>
        {Object.entries(UNIVERSAL_PAIN_POINTS.byScenario).map(([scenario, points]) => (
          <div key={scenario} className="mb-4">
            <div className="text-sm font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg inline-block mb-2">{scenario}</div>
            <div className="space-y-2">
              {points.map((p, i) => (
                <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-3 py-2 bg-red-50 border-b border-red-100 text-sm text-red-800">😟 {p.pain}</div>
                  <div className="px-3 py-2 bg-green-50 text-xs text-green-800">✅ {p.response}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ==================== 异议处理库 ====================
  const renderObjectionHandling = () => (
    <div className="space-y-4">
      {Object.entries(UNIVERSAL_OBJECTION_HANDLING).map(([category, objections]) => (
        <div key={category} className="bg-white rounded-2xl p-5 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs">
              {category === '价格类' ? '💰' : category === '时间类' ? '⏰' : category === '效果类' ? '📊' : category === '信任类' ? '🤝' : '🤔'}
            </span>
            {category}
          </h3>
          <div className="space-y-3">
            {objections.map((o, i) => (
              <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-2.5 bg-orange-50 border-b border-orange-100">
                  <span className="text-sm font-medium text-orange-800">🤔 "{o.objection}"</span>
                </div>
                <div className="px-4 py-2.5 bg-blue-50">
                  <span className="text-sm text-blue-800">💡 {o.response}</span>
                </div>
                {'alternatives' in o && o.alternatives && (
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">备选方案：</div>
                    {o.alternatives.map((alt, j) => (
                      <div key={j} className="text-xs text-gray-600">• {alt}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  // ==================== 话术模板 ====================
  const renderScriptTemplates = () => (
    <div className="space-y-4">
      {Object.entries(SALES_SCRIPT_TEMPLATES).map(([scene, scripts]) => (
        <div key={scene} className="bg-white rounded-2xl p-5 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-teal-100 text-[#2A4CC0] rounded-full flex items-center justify-center text-xs">
              {scene === '首次电话' ? '📞' : scene === '面对面咨询' ? '🤝' : scene === '促成转化' ? '🎯' : '📋'}
            </span>
            {scene}
          </h3>
          <div className="space-y-2">
            {Object.entries(scripts).map(([step, script]) => (
              <div key={step} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-xs font-medium text-teal-700 mb-1">{step}</div>
                <p className="text-sm text-gray-700">{script}</p>
                <button onClick={() => navigator.clipboard.writeText(script)}
                  className="mt-2 px-2 py-1 text-xs text-[#2A4CC0] bg-teal-50 rounded hover:bg-teal-100">
                  📋 复制
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  // ==================== 课程推荐（基于WILDER分数） ====================
  const renderCourseRecommendations = () => {
    if (!courseRecommendation) {
      return (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">📚</div>
          <p>暂无测评数据，请先查看画像策略或课程匹配矩阵</p>
        </div>
      )
    }

    const { topPicks, byCategory, growthPath } = courseRecommendation

    return (
      <div className="space-y-6">
        {/* 学生信息卡 */}
        {studentName && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-2xl">👤</div>
              <div>
                <div className="font-bold text-teal-800 text-lg">{studentName}</div>
                <div className="text-sm text-[#2A4CC0]">{studentAge}岁 · 当前阶段：{growthPath.currentStage}</div>
              </div>
            </div>
          </div>
        )}

        {/* 精选推荐TOP3 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">⭐</span>
            精选推荐
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {topPicks.map((rec, i) => (
              <div key={rec.course.id} className={`relative rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                i === 0 ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50' :
                i === 1 ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
              }`}>
                {i === 0 && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-bl-xl">
                    最佳匹配
                  </div>
                )}
                <div className="p-4">
                  <div className={`inline-block px-2 py-1 rounded-lg text-xs font-medium mb-2 ${CATEGORY_COLORS[rec.course.category]?.bg} ${CATEGORY_COLORS[rec.course.category]?.text}`}>
                    {rec.course.category}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{rec.course.displayName || rec.course.name}</h4>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{rec.course.intro}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">匹配度</span>
                      <span className={`text-sm font-bold ${rec.matchScore >= 80 ? 'text-green-600' : rec.matchScore >= 60 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {rec.matchScore}%
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      rec.priorityTag === '强烈推荐' ? 'bg-green-100 text-green-700' :
                      rec.priorityTag === '推荐' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>{rec.priorityTag}</span>
                  </div>
                  {rec.matchReasons.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="text-[10px] text-gray-400 mb-1">推荐理由：</div>
                      <div className="flex flex-wrap gap-1">
                        {rec.matchReasons.map((r, j) => (
                          <span key={j} className="px-1.5 py-0.5 text-[10px] bg-teal-50 text-teal-700 rounded">{r}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 成长路径建议 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
          <h3 className="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">🛤️</span>
            成长路径建议
            <span className="ml-auto text-xs font-normal text-indigo-500">{growthPath.timeline}</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {growthPath.suggestedPath.map((stage, i) => (
              <div key={i} className="relative">
                {i < growthPath.suggestedPath.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-indigo-200"></div>
                )}
                <div className="bg-white rounded-xl p-4 border border-indigo-100 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    <span className="text-sm font-bold text-indigo-800">{stage.stage}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{stage.focus}</div>
                  <div className="flex flex-wrap gap-1">
                    {stage.courses.map((c, j) => (
                      <span key={j} className="px-2 py-0.5 text-[10px] bg-indigo-50 text-indigo-700 rounded-full">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 分类课程详情 */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {(['科普', '科创', '科考', '附加集训'] as const).map(cat => {
              const count = byCategory[cat]?.length || 0
              return (
                <button
                  key={cat}
                  onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                    expandedCategory === cat 
                      ? `${CATEGORY_COLORS[cat]?.bg} ${CATEGORY_COLORS[cat]?.text} border-b-2 ${CATEGORY_COLORS[cat]?.border}`
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {cat} <span className="ml-1 text-xs opacity-60">({count})</span>
                </button>
              )
            })}
          </div>
          {expandedCategory && byCategory[expandedCategory as keyof typeof byCategory] && (
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-4 px-2">{getCategoryDescription(expandedCategory)}</p>
              <div className="space-y-3">
                {byCategory[expandedCategory as keyof typeof byCategory].map(rec => (
                  <div key={rec.course.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                    <div className={`shrink-0 w-12 h-12 rounded-xl ${CATEGORY_COLORS[rec.course.category]?.bg} flex items-center justify-center text-xl`}>
                      {rec.course.category === '科普' ? '🔬' : rec.course.category === '科创' ? '🏗️' : rec.course.category === '科考' ? '🏕️' : '🎯'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{rec.course.displayName || rec.course.name}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <span>适合：{getGradeRange(rec.course.grade)}</span>
                            {rec.course.duration && <span>· {rec.course.duration}</span>}
                            {rec.course.season && <span>· {rec.course.season}</span>}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className={`text-lg font-bold ${rec.matchScore >= 80 ? 'text-green-600' : rec.matchScore >= 60 ? 'text-amber-600' : 'text-gray-500'}`}>
                            {rec.matchScore}%
                          </div>
                          <div className="text-[10px] text-gray-400">匹配度</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{rec.course.intro}</p>
                      {rec.matchReasons.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {rec.matchReasons.map((r, j) => (
                            <span key={j} className="px-2 py-0.5 text-[10px] bg-teal-50 text-teal-700 rounded-full">{r}</span>
                          ))}
                        </div>
                      )}
                      {rec.course.wilderFocus && (
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-[10px] text-gray-400">WILDER聚焦：</span>
                          {rec.course.wilderFocus.primary.map(d => (
                            <span key={d} className="px-1.5 py-0.5 text-[10px] font-medium rounded" 
                              style={{ background: `${WILDER_COLORS[d]}20`, color: WILDER_COLORS[d] }}>
                              {WILDER_NAMES[d]}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ==================== 成交工作流 ====================
  const renderSalesWorkflow = () => (
    <div className="space-y-6">
      {/* 成交目标看板 */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
        <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">🎯</span>
          成交目标
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: '体验课→体系课', target: '40%', color: 'orange', tip: '首次体验后7天内跟进' },
            { label: '科普→科创升级', target: '25%', color: 'purple', tip: '1学期后推荐升级' },
            { label: '科创→科考转化', target: '15%', color: 'amber', tip: '暑假前3个月启动' },
            { label: '老带新推荐', target: '20%', color: 'teal', tip: '课程结束后即时激励' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 text-center">
              <div className={`text-2xl font-black text-${item.color}-600`}>{item.target}</div>
              <div className="text-sm font-medium text-gray-700 mt-1">{item.label}</div>
              <div className="text-[10px] text-gray-400 mt-2">💡 {item.tip}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 标准工作流 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">📋</span>
          标准成交工作流
        </h3>
        <div className="space-y-4">
          {[
            {
              step: '1. 测评解读（Day 0）',
              icon: '📊',
              color: 'blue',
              tasks: [
                '完成WILDER测评并生成报告',
                '识别潜能画像类型和优势维度',
                '准备针对性课程推荐清单',
              ],
              script: '您好，XX的测评结果出来了，发现他/她在[优势维度]方面表现突出，属于[画像类型]，这类孩子最适合的培养方式是...',
            },
            {
              step: '2. 首次电话（Day 1-3）',
              icon: '📞',
              color: 'green',
              tasks: [
                '分享测评亮点，引起家长兴趣',
                '了解家长痛点和期望',
                '介绍匹配课程，邀请体验',
              ],
              script: '看到XX在[维度]方面特别突出，这在我们测过的孩子中属于前20%。想了解一下，您平时观察到他/她有什么特别的表现吗？',
            },
            {
              step: '3. 体验课（Day 7-14）',
              icon: '🎪',
              color: 'purple',
              tasks: [
                '安排对应潜能类型的体验课',
                '课中观察并记录亮点表现',
                '课后即时反馈，趁热打铁',
              ],
              script: '今天XX表现很棒！特别是在[具体环节]的时候，完全符合他/她[画像类型]的特质。您看到他/她眼睛发光的那个瞬间了吗？',
            },
            {
              step: '4. 跟进转化（Day 14-21）',
              icon: '🎯',
              color: 'orange',
              tasks: [
                '发送详细体验反馈报告',
                '推荐最匹配的体系课程',
                '处理异议，促成报名',
              ],
              script: '基于XX的潜能特点和体验表现，最适合他/她的成长路径是[推荐课程]。我们有[优惠/名额限制]，建议尽早锁定...',
            },
            {
              step: '5. 持续维护（持续）',
              icon: '🔄',
              color: 'teal',
              tasks: [
                '每月发送学习进度报告',
                '关键节点升级课程推荐',
                '激励老带新转介绍',
              ],
              script: 'XX这学期进步很大，[维度]提升了X分！下学期可以考虑[进阶课程]，另外如果有朋友家孩子也需要，老学员推荐有专属优惠...',
            },
          ].map((item, i) => (
            <div key={i} className={`rounded-2xl border-2 border-${item.color}-100 overflow-hidden`}>
              <div className={`bg-${item.color}-50 px-5 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`font-bold text-${item.color}-800`}>{item.step}</span>
                </div>
              </div>
              <div className="p-5 grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold text-gray-500 mb-2">✅ 关键动作</div>
                  <ul className="space-y-1">
                    {item.tasks.map((t, j) => (
                      <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className={`text-${item.color}-500 mt-0.5`}>•</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`bg-${item.color}-50 rounded-xl p-3`}>
                  <div className="text-xs font-bold text-gray-500 mb-2">💬 参考话术</div>
                  <p className="text-sm text-gray-700 italic">"{studentName ? item.script.replace(/XX/g, studentName) : item.script}"</p>
                  <button onClick={() => {
                    const text = studentName ? item.script.replace(/XX/g, studentName) : item.script
                    navigator.clipboard.writeText(text)
                  }} className={`mt-2 px-2 py-1 text-xs text-${item.color}-600 bg-white rounded border border-${item.color}-200 hover:bg-${item.color}-50`}>
                    📋 复制
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 快速成交话术卡 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">⚡</span>
          快速成交话术
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              scene: '创造紧迫感',
              script: '这期课程只剩[X]个名额了，特别是[潜能类型]的孩子我们会优先推荐。要不先给您锁定？',
            },
            {
              scene: '价值强化',
              script: '一学期课程不到3000元，但孩子收获的是：清晰的潜能认知、科学思维方法、同频的朋友圈。这些是花多少钱都买不到的。',
            },
            {
              scene: '降低风险',
              script: '我们有7天试学期——如果前两次课觉得不合适，全额退款。您完全没有风险，不如让孩子先试试？',
            },
            {
              scene: '下一步明确',
              script: '如果没问题，我现在就帮您登记。需要您填一下基本信息，课程顾问会和您确认具体上课时间。',
            },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-sm font-medium text-red-800">
                {item.scene}
              </div>
              <div className="px-4 py-3">
                <p className="text-sm text-gray-700">"{item.script}"</p>
                <button onClick={() => navigator.clipboard.writeText(item.script)}
                  className="mt-2 px-2 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100">
                  📋 复制
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ==================== 课程匹配矩阵 ====================
  const renderCourseMatrix = () => (
    <div className="space-y-4">
      {Object.entries(COURSE_TALENT_MATRIX).map(([course, data]) => (
        <div key={course} className="bg-white rounded-2xl p-5 border border-gray-200">
          <h3 className="text-base font-bold text-gray-800 mb-3">📚 {course}</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-green-50 border border-green-100">
              <div className="text-xs font-bold text-green-700 mb-2">🎯 最佳匹配</div>
              <div className="flex flex-wrap gap-1">
                {data.bestFit.map(key => {
                  const p = CHILD_PROFILES[key]
                  return p ? (
                    <span key={key} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {p.icon} {p.type}
                    </span>
                  ) : null
                })}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-xs font-bold text-blue-700 mb-2">👍 适合</div>
              <div className="flex flex-wrap gap-1">
                {data.goodFit.map(key => {
                  const p = CHILD_PROFILES[key]
                  return p ? (
                    <span key={key} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {p.icon} {p.type}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <div className="font-medium text-gray-700 mb-1">推荐理由：</div>
            {Object.entries(data.reasonsMap).slice(0, 3).map(([key, reason]) => {
              const p = CHILD_PROFILES[key]
              return p ? (
                <div key={key} className="mb-1">• <strong>{p.type}</strong>：{reason}</div>
              ) : null
            })}
          </div>
        </div>
      ))}
    </div>
  )

  // ==================== 画像卡片网格 ====================
  const renderProfileGrid = () => (
    <div className="space-y-4">
      {matchedKey && (
        <div className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-2 text-amber-800">
            <span className="text-xl">🎯</span>
            <span className="font-semibold">
              {studentName ? `${studentName} ` : '该学生'}匹配画像：
              {CHILD_PROFILES[matchedKey].icon} {CHILD_PROFILES[matchedKey].type}
            </span>
            <button
              onClick={() => setSelectedKey(matchedKey)}
              className="ml-auto px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors"
            >
              查看策略 →
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PROFILE_KEYS.map(key => {
          const p = CHILD_PROFILES[key]
          const isMatched = key === matchedKey
          return (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`relative text-left p-4 rounded-2xl border-2 transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                isMatched
                  ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-teal-200'
              }`}
            >
              {isMatched && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 text-white text-xs rounded-full flex items-center justify-center font-bold shadow">
                  !
                </span>
              )}
              <div className="text-3xl mb-2">{p.icon}</div>
              <div className="font-bold text-gray-900 text-sm">{p.type}</div>
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">{p.tagline}</div>
              <div className="flex gap-1 mt-2 flex-wrap">
                {p.wilderPattern.high.map(d => (
                  <span key={d} className="px-1.5 py-0.5 text-[10px] font-bold rounded"
                    style={{ background: `${WILDER_COLORS[d]}20`, color: WILDER_COLORS[d] }}>
                    {d}↑
                  </span>
                ))}
                {p.wilderPattern.low.map(d => (
                  <span key={d} className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 text-gray-400">
                    {d}↓
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  // ==================== 策略详情页 ====================
  const renderStrategyDetail = (profile: ChildProfile, strategy: SalesStrategy) => (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <button onClick={() => setSelectedKey(null)}
          className="shrink-0 mt-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
          ← 返回
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{profile.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.type}</h2>
              <p className="text-sm text-gray-500">{profile.typeEn}</p>
            </div>
            {selectedKey === matchedKey && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">当前匹配</span>
            )}
          </div>
          <p className="text-base text-teal-700 font-medium mt-2">"{profile.tagline}"</p>
          <p className="text-sm text-gray-600 mt-1">{profile.description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <span>{profile.explorationMode.icon}</span>
            <span className="font-bold text-sm text-gray-800">{profile.explorationMode.name}</span>
          </div>
          <p className="text-xs text-gray-600">{profile.explorationMode.description}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <span>🎯</span>
            <span className="font-bold text-sm text-gray-800">{profile.attentionPattern.name}</span>
          </div>
          <p className="text-xs text-gray-600">{profile.attentionPattern.description}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <span>👥</span>
            <span className="font-bold text-sm text-gray-800">{profile.socialMode.name}</span>
          </div>
          <p className="text-xs text-gray-600">{profile.socialMode.description}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 mb-3">WILDER 维度模式</h3>
        <div className="flex gap-2">
          {['W','I','L','D','E','R'].map(d => {
            const isHigh = profile.wilderPattern.high.includes(d)
            const isLow = profile.wilderPattern.low.includes(d)
            return (
              <div key={d} className={`flex-1 text-center p-2 rounded-lg transition-all ${
                isHigh ? 'bg-gradient-to-b from-teal-50 to-teal-100 ring-2 ring-teal-300' :
                isLow ? 'bg-gray-50 opacity-50' : 'bg-gray-50'
              }`}>
                <div className="text-lg font-bold" style={{ color: WILDER_COLORS[d] }}>{d}</div>
                <div className="text-[10px] text-gray-500">{WILDER_NAMES[d]}</div>
                {isHigh && <div className="text-[10px] font-bold text-[#2A4CC0] mt-0.5">强势</div>}
                {isLow && <div className="text-[10px] text-gray-400 mt-0.5">待提升</div>}
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 mb-3">典型行为表现</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {profile.behaviorTraits.map((t, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-[#3B5FD9] mt-0.5 shrink-0">•</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-dashed border-gray-200 pt-5">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
            style={{ background: 'linear-gradient(135deg, hsl(173 58% 39%), hsl(200 70% 45%))' }}>💼</span>
          销售策略
        </h3>
      </div>

      <CollapsibleSection title="家长痛点与应对" icon="💬" isOpen={expandedSections.has('painPoints')} onToggle={() => toggleSection('painPoints')}>
        <div className="space-y-3">
          {strategy.parentPainPoints.map((pp, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
              <div className="px-4 py-3 bg-red-50 border-b border-red-100">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 text-sm mt-0.5">😟</span>
                  <span className="text-sm font-medium text-red-800">{pp.pain}</span>
                </div>
              </div>
              <div className="px-4 py-3 bg-green-50">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-sm mt-0.5">✅</span>
                  <span className="text-sm text-green-800">{pp.response}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="课程推荐（按优先级）" icon="📚" isOpen={expandedSections.has('courses')} onToggle={() => toggleSection('courses')}>
        <div className="space-y-2">
          {[...strategy.courseRecommendations].sort((a, b) => a.priority - b.priority).map((c, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                c.priority === 1 ? 'bg-amber-500' : c.priority === 2 ? 'bg-gray-400' : 'bg-gray-300'
              }`}>{c.priority}</span>
              <div>
                <div className="font-semibold text-sm text-gray-900">{c.course}</div>
                <div className="text-xs text-gray-500 mt-0.5">{c.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="最佳沟通时机" icon="⏰" isOpen={expandedSections.has('timing')} onToggle={() => toggleSection('timing')}>
        <div className="space-y-2">
          {strategy.bestTiming.map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 p-2 rounded-lg bg-amber-50 border border-amber-100">
              <span className="text-amber-500">⚡</span><span>{t}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="异议处理话术" icon="🛡️" isOpen={expandedSections.has('objections')} onToggle={() => toggleSection('objections')}>
        <div className="space-y-3">
          {strategy.objectionHandling.map((o, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
              <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
                <div className="flex items-start gap-2">
                  <span className="text-orange-400 text-sm mt-0.5">🤔</span>
                  <span className="text-sm font-medium text-orange-800">{o.objection}</span>
                </div>
              </div>
              <div className="px-4 py-3 bg-blue-50">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 text-sm mt-0.5">💡</span>
                  <span className="text-sm text-blue-800">{o.response}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="成交关键点" icon="🎯" isOpen={expandedSections.has('closing')} onToggle={() => toggleSection('closing')}>
        <div className="space-y-2">
          {strategy.closingPoints.map((c, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100">
              <span className="text-[#3B5FD9] font-bold text-sm">✦</span>
              <span className="text-sm text-teal-800 font-medium">{c}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="场景沟通话术" icon="🎙️" isOpen={expandedSections.has('scripts')} onToggle={() => toggleSection('scripts')}>
        <div className="space-y-3">
          {strategy.communicationScript.map((s, i) => (
            <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-800 text-white font-medium text-sm flex items-center gap-2">
                <span>{i === 0 ? '📞' : i === 1 ? '🤝' : '📝'}</span>{s.scene}
              </div>
              <div className="px-4 py-3 bg-gray-50">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {studentName ? s.script.replace(/XX/g, studentName) : s.script}
                </p>
                <button onClick={() => {
                  const text = studentName ? s.script.replace(/XX/g, studentName) : s.script
                  navigator.clipboard.writeText(text)
                }} className="mt-2 px-3 py-1 text-xs text-[#2A4CC0] bg-teal-50 rounded-md hover:bg-teal-100 transition-colors">
                  📋 复制话术
                </button>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  )

  // ==================== 主渲染 ====================
  return (
    <div className="space-y-4">
      {renderToolTabs()}
      {toolTab === 'courses' && renderCourseRecommendations()}
      {toolTab === 'workflow' && renderSalesWorkflow()}
      {toolTab === 'profiles' && (selectedKey && pkg ? renderStrategyDetail(pkg.profile, pkg.strategy) : renderProfileGrid())}
      {toolTab === 'pbl' && renderPBLFramework()}
      {toolTab === 'painPoints' && renderPainPointsLibrary()}
      {toolTab === 'objections' && renderObjectionHandling()}
      {toolTab === 'scripts' && renderScriptTemplates()}
      {toolTab === 'matrix' && renderCourseMatrix()}
    </div>
  )
}

function CollapsibleSection({ title, icon, isOpen, onToggle, children }: {
  title: string; icon: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button onClick={onToggle} className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
        <span className="flex items-center gap-2 font-bold text-sm text-gray-800"><span>{icon}</span> {title}</span>
        <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}
