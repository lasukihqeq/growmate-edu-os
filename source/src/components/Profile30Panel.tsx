/**
 * 30种画像销售策略面板
 * 完整展示WILDER 30种核心画像及其销售策略
 */

import { useState } from 'react'
import {
  ALL_30_PROFILES,
  PROFILES_BY_ID,
  WILDER_DIMENSIONS,
  identifyProfile30,
  type Profile30,
} from '../lib/profile30System'
import {
  LAYER1_STRATEGIES,
  ALL_SALES_STRATEGIES,
  KPI_SYSTEM,
  OPTIMIZATION_RECOMMENDATIONS,
  generateAIRecommendation,
  COURSE_PRODUCTS,
} from '../lib/salesStrategies30'

interface Props {
  initialScores?: { W: number; I: number; L: number; D: number; E: number; R: number }
  studentName?: string
}

type ViewMode = 'profiles' | 'kpi' | 'courses' | 'ai-match'

export function Profile30Panel({ initialScores, studentName }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('profiles')
  const [selectedLayer, setSelectedLayer] = useState<1 | 2 | 3 | 4 | 'all'>('all')
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['painPoints', 'courses']))

  // 如果有初始分数，自动识别画像
  const matchedProfile = initialScores ? identifyProfile30(initialScores) : null
  const aiRecommendation = initialScores ? generateAIRecommendation(initialScores) : null

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      next.has(section) ? next.delete(section) : next.add(section)
      return next
    })
  }

  // 按层级筛选画像
  const filteredProfiles = selectedLayer === 'all' 
    ? ALL_30_PROFILES 
    : ALL_30_PROFILES.filter(p => p.layer === selectedLayer)

  // ==================== 顶部Tab ====================
  const renderTabs = () => (
    <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1 flex-wrap">
      {([
        { key: 'profiles', label: '👤 30种画像', count: 30 },
        { key: 'ai-match', label: '🤖 AI匹配' },
        { key: 'kpi', label: '📊 KPI体系' },
        { key: 'courses', label: '📚 课程产品' },
      ] as { key: ViewMode; label: string; count?: number }[]).map(t => (
        <button key={t.key} onClick={() => setViewMode(t.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewMode === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}>
          {t.label}
          {t.count && <span className="ml-1 px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs">{t.count}</span>}
        </button>
      ))}
    </div>
  )

  // ==================== 画像网格 ====================
  const renderProfileGrid = () => (
    <div className="space-y-4">
      {/* 层级筛选 */}
      <div className="flex gap-2 flex-wrap">
        {([
          { key: 'all', label: '全部', count: 30 },
          { key: 1, label: 'Layer1 单维突出', count: 6 },
          { key: 2, label: 'Layer2 双维组合', count: 15 },
          { key: 3, label: 'Layer3 三维均衡', count: 6 },
          { key: 4, label: 'Layer4 特殊发展', count: 3 },
        ] as { key: 1 | 2 | 3 | 4 | 'all'; label: string; count: number }[]).map(l => (
          <button key={String(l.key)} onClick={() => setSelectedLayer(l.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedLayer === l.key 
                ? 'bg-[#2A4CC0] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {l.label} ({l.count})
          </button>
        ))}
      </div>

      {/* 匹配提示 */}
      {matchedProfile && (
        <div className="p-4 rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div className="flex-1">
              <div className="font-bold text-amber-800">
                {studentName || '该学生'} 匹配画像：{PROFILES_BY_ID[matchedProfile.profileId]?.name}
              </div>
              <div className="text-xs text-amber-600 mt-0.5">
                置信度: {matchedProfile.confidence}% · {matchedProfile.matchReason}
              </div>
            </div>
            <button onClick={() => setSelectedProfile(matchedProfile.profileId)}
              className="px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-md hover:shadow-lg transition-all"
              style={{ background: 'linear-gradient(135deg, hsl(173 58% 39%), hsl(200 70% 45%))' }}>
              查看策略 →
            </button>
          </div>
        </div>
      )}

      {/* 画像卡片网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {filteredProfiles.map(profile => {
          const isMatched = profile.id === matchedProfile?.profileId
          return (
            <button key={profile.id} onClick={() => setSelectedProfile(profile.id)}
              className={`relative text-left p-3 rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                isMatched
                  ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-teal-200'
              }`}>
              {isMatched && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow">
                  ✓
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{profile.icon}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  profile.layer === 1 ? 'bg-blue-100 text-blue-700' :
                  profile.layer === 2 ? 'bg-green-100 text-green-700' :
                  profile.layer === 3 ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
                }`}>L{profile.layer}</span>
              </div>
              <div className="font-bold text-gray-900 text-sm">{profile.name}</div>
              <div className="text-[11px] text-gray-500 mt-1 line-clamp-2">{profile.tagline}</div>
              <div className="flex gap-1 mt-2 flex-wrap">
                {profile.wilderPattern.primary.map(d => (
                  <span key={d} className="px-1 py-0.5 text-[9px] font-bold rounded"
                    style={{ 
                      background: `${WILDER_DIMENSIONS[d as keyof typeof WILDER_DIMENSIONS]?.color}20`, 
                      color: WILDER_DIMENSIONS[d as keyof typeof WILDER_DIMENSIONS]?.color 
                    }}>
                    {d}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  // ==================== 画像详情 ====================
  const renderProfileDetail = (profile: Profile30) => {
    const strategy = ALL_SALES_STRATEGIES[profile.id] || LAYER1_STRATEGIES.find(s => s.profileId === profile.id)
    
    return (
      <div className="space-y-5">
        {/* 返回按钮 + 头部 */}
        <div className="flex items-start gap-4">
          <button onClick={() => setSelectedProfile(null)}
            className="shrink-0 mt-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
            ← 返回列表
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{profile.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    profile.layer === 1 ? 'bg-blue-100 text-blue-700' :
                    profile.layer === 2 ? 'bg-green-100 text-green-700' :
                    profile.layer === 3 ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>{profile.category}</span>
                </div>
                <p className="text-sm text-gray-500">{profile.nameEn}</p>
              </div>
            </div>
            <p className="text-base text-teal-700 font-medium mt-2">"{profile.tagline}"</p>
            <p className="text-sm text-gray-600 mt-1">{profile.description}</p>
          </div>
        </div>

        {/* WILDER维度模式 */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-3">WILDER 维度模式</h3>
          <div className="flex gap-2">
            {(['W','I','L','D','E','R'] as const).map(d => {
              const dim = WILDER_DIMENSIONS[d]
              const isPrimary = profile.wilderPattern.primary.includes(d)
              const isDeveloping = profile.wilderPattern.developing?.includes(d)
              return (
                <div key={d} className={`flex-1 text-center p-2 rounded-lg ${
                  isPrimary ? 'bg-gradient-to-b from-teal-50 to-teal-100 ring-2 ring-teal-300' :
                  isDeveloping ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-gray-50'
                }`}>
                  <div className="text-lg font-bold" style={{ color: dim.color }}>{d}</div>
                  <div className="text-[10px] text-gray-500">{dim.name}</div>
                  {isPrimary && <div className="text-[10px] font-bold text-[#2A4CC0] mt-0.5">主导</div>}
                  {isDeveloping && <div className="text-[10px] text-amber-600 mt-0.5">发展中</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* 特征卡片 */}
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="font-bold text-sm text-blue-800 mb-2">🎓 学习风格</div>
            <div className="text-sm text-blue-700 font-medium">{profile.learningStyle.name}</div>
            <p className="text-xs text-blue-600 mt-1">{profile.learningStyle.description}</p>
            <div className="text-xs text-blue-500 mt-2 bg-blue-50 p-2 rounded">
              最佳环境：{profile.learningStyle.bestEnvironment}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="font-bold text-sm text-purple-800 mb-2">👥 社交模式</div>
            <div className="text-sm text-purple-700 font-medium">{profile.socialPattern.name}</div>
            <p className="text-xs text-purple-600 mt-1">{profile.socialPattern.description}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="font-bold text-sm text-green-800 mb-2">🚀 成长重点</div>
            <ul className="text-xs text-green-600 space-y-1">
              {profile.growthFocus.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 行为特征 */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-3">典型行为特征</h3>
          <div className="grid md:grid-cols-2 gap-2">
            {profile.characteristics.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-[#3B5FD9] mt-0.5">•</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 职业方向提示 */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-800 mb-2">💼 未来职业方向提示</h3>
          <div className="flex flex-wrap gap-2">
            {profile.careerHints.map((c, i) => (
              <span key={i} className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-full text-gray-600">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* 销售策略部分 */}
        {strategy && (
          <>
            <div className="border-t-2 border-dashed border-gray-200 pt-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, hsl(173 58% 39%), hsl(200 70% 45%))' }}>💼</span>
                销售策略
              </h3>
            </div>

            {/* KPI目标 */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: '目标转化率', value: `${strategy.kpiTargets.conversionRateTarget}%`, color: '#10b981' },
                { label: '目标客单价', value: `¥${strategy.kpiTargets.avgOrderValue}`, color: '#3b82f6' },
                { label: '目标续费率', value: `${strategy.kpiTargets.renewalRateTarget}%`, color: '#8b5cf6' },
                { label: '转介绍潜力', value: strategy.kpiTargets.referralPotential, color: '#f59e0b' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <div className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* 痛点与应对 */}
            <CollapsibleSection title="家长痛点与应对" icon="💬" 
              isOpen={expandedSections.has('painPoints')} onToggle={() => toggleSection('painPoints')}>
              <div className="space-y-3">
                {strategy.painPoints.map((pp, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
                    <div className="px-4 py-3 bg-red-50 border-b border-red-100">
                      <div className="text-sm font-medium text-red-800">😟 {pp.pain}</div>
                      <div className="text-xs text-red-600 mt-1">🔍 诊断：{pp.diagnosis}</div>
                    </div>
                    <div className="px-4 py-3 bg-green-50">
                      <div className="text-sm text-green-800">✅ {pp.response}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* 课程推荐 */}
            <CollapsibleSection title="课程推荐" icon="📚"
              isOpen={expandedSections.has('courses')} onToggle={() => toggleSection('courses')}>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-teal-700 mb-2">首推课程</div>
                  {strategy.courseRecommendation.tier1.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 border border-teal-100 mb-2">
                      <span className="w-6 h-6 rounded-full bg-[#3B5FD9] text-white text-xs flex items-center justify-center font-bold">
                        {c.priority}
                      </span>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{c.course}</div>
                        <div className="text-xs text-gray-500">{c.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-600 mb-2">补充推荐</div>
                  {strategy.courseRecommendation.tier2.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100 mb-1">
                      <span className="text-gray-400 text-xs">{c.priority}</span>
                      <span className="text-sm text-gray-700">{c.course}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleSection>

            {/* 异议处理 */}
            <CollapsibleSection title="异议处理" icon="🛡️"
              isOpen={expandedSections.has('objections')} onToggle={() => toggleSection('objections')}>
              <div className="space-y-3">
                {strategy.objectionHandling.map((obj, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
                    <div className="px-4 py-2 bg-orange-50 border-b border-orange-100">
                      <span className="text-sm font-medium text-orange-800">🤔 "{obj.objection}"</span>
                    </div>
                    <div className="px-4 py-2 bg-blue-50">
                      <span className="text-sm text-blue-800">💡 {obj.response}</span>
                    </div>
                    {obj.followUp && (
                      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                        <span className="text-xs text-gray-600">跟进：{obj.followUp}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* 成交策略 */}
            <CollapsibleSection title="成交策略" icon="🎯"
              isOpen={expandedSections.has('closing')} onToggle={() => toggleSection('closing')}>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="text-xs font-bold text-amber-700 mb-1">⏰ 最佳成交时机</div>
                  <ul className="text-sm text-amber-800">
                    {strategy.closingStrategy.bestTiming.map((t, i) => (
                      <li key={i}>• {t}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                    <div className="text-xs font-bold text-green-700 mb-1">🎪 成交技巧</div>
                    <p className="text-sm text-green-800">{strategy.closingStrategy.closingTechnique}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                    <div className="text-xs font-bold text-red-700 mb-1">⚡ 紧迫感创造</div>
                    <p className="text-sm text-red-800">{strategy.closingStrategy.urgencyCreation}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="text-xs font-bold text-blue-700 mb-1">🛡️ 风险消除</div>
                  <p className="text-sm text-blue-800">{strategy.closingStrategy.riskReversal}</p>
                </div>
              </div>
            </CollapsibleSection>
          </>
        )}
      </div>
    )
  }

  // ==================== AI匹配视图 ====================
  const renderAIMatch = () => (
    <div className="space-y-6">
      {initialScores && aiRecommendation ? (
        <>
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
            <h3 className="text-lg font-bold text-teal-800 mb-4 flex items-center gap-2">
              🤖 AI智能匹配结果
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">匹配画像</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{PROFILES_BY_ID[aiRecommendation.profileId]?.icon}</span>
                  <span className="font-bold text-lg">{PROFILES_BY_ID[aiRecommendation.profileId]?.name}</span>
                </div>
                <div className="mt-2 text-sm text-[#2A4CC0]">置信度：{aiRecommendation.confidence.toFixed(0)}%</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-1">预测转化率</div>
                <div className="text-2xl font-bold text-green-600">{aiRecommendation.predictedConversion.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-3">📚 AI推荐课程</h4>
            <div className="space-y-2">
              {aiRecommendation.primaryCourses.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div>
                    <div className="font-medium">{c.course}</div>
                    <div className="text-xs text-gray-500">{c.reason}</div>
                  </div>
                  <div className="text-sm font-bold text-[#2A4CC0]">{c.matchScore.toFixed(0)}分</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-3">🎯 沟通策略建议</h4>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 mb-3">
              <div className="text-sm font-medium text-amber-800">开场重点：{aiRecommendation.communicationStrategy.openingFocus}</div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                <div className="text-xs font-bold text-green-700 mb-2">✅ 关键信息</div>
                <ul className="text-sm text-green-800 space-y-1">
                  {aiRecommendation.communicationStrategy.keyMessages.map((m, i) => (
                    <li key={i}>• {m}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                <div className="text-xs font-bold text-red-700 mb-2">⚠️ 注意事项</div>
                <ul className="text-sm text-red-800 space-y-1">
                  {aiRecommendation.communicationStrategy.cautionPoints.map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">🤖</div>
          <p>请先完成WILDER测评获取AI匹配结果</p>
        </div>
      )}
    </div>
  )

  // ==================== KPI视图 ====================
  const renderKPIView = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: '整体转化率目标', value: `${KPI_SYSTEM.conversion.overall.target}%`, benchmark: `${KPI_SYSTEM.conversion.overall.benchmark}%`, color: '#10b981' },
          { label: '年度客单价目标', value: `¥${KPI_SYSTEM.avgOrderValue.annual.target}`, benchmark: `¥${KPI_SYSTEM.avgOrderValue.annual.benchmark}`, color: '#3b82f6' },
          { label: '会员续费率目标', value: `${KPI_SYSTEM.renewal.annualMember.target}%`, benchmark: `${KPI_SYSTEM.renewal.annualMember.benchmark}%`, color: '#8b5cf6' },
          { label: 'NPS净推荐值', value: `${KPI_SYSTEM.satisfaction.nps.target}`, benchmark: `${KPI_SYSTEM.satisfaction.nps.benchmark}`, color: '#f59e0b' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-sm text-gray-600 mt-1">{kpi.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">基准: {kpi.benchmark}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">📈 优化建议</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(OPTIMIZATION_RECOMMENDATIONS).map(([category, items]) => (
            <div key={category} className="p-4 rounded-xl bg-gray-50">
              <div className="text-sm font-bold text-gray-700 mb-2 capitalize">
                {category.replace(/([A-Z])/g, ' $1').replace('low ', '低').replace('A O V', '客单价').replace('Renewal', '续费').replace('Referral', '转介绍').replace('Conversion', '转化')}
              </div>
              {items.map((item, i) => (
                <div key={i} className="mb-2 last:mb-0">
                  <div className="text-xs text-gray-600">❌ {item.issue}</div>
                  <div className="text-xs text-green-600">✅ {item.action}</div>
                  <div className="text-xs text-[#3B5FD9]">预期提升: {item.expectedLift}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ==================== 课程产品视图 ====================
  const renderCoursesView = () => (
    <div className="space-y-6">
      {Object.entries(COURSE_PRODUCTS).map(([category, products]) => (
        <div key={category} className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 capitalize">
            {category === 'popular' ? '📌 科普课程 (入门)' : 
             category === 'creation' ? '⭐ 科创课程 (主力)' : 
             '🏆 科考课程 (高端)'}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(products).map(([name, info]) => (
              <div key={name} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="font-medium text-gray-800">{name}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-[#2A4CC0]">¥{info.price}</span>
                  <span className="text-xs text-gray-500">{info.duration}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    info.level === '入门' ? 'bg-green-100 text-green-700' :
                    info.level === '进阶' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>{info.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  // ==================== 主渲染 ====================
  return (
    <div className="space-y-4">
      {renderTabs()}
      {viewMode === 'profiles' && (selectedProfile ? renderProfileDetail(PROFILES_BY_ID[selectedProfile]) : renderProfileGrid())}
      {viewMode === 'ai-match' && renderAIMatch()}
      {viewMode === 'kpi' && renderKPIView()}
      {viewMode === 'courses' && renderCoursesView()}
    </div>
  )
}

// ==================== 可折叠组件 ====================

function CollapsibleSection({ title, icon, isOpen, onToggle, children }: {
  title: string; icon: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button onClick={onToggle} className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50">
        <span className="flex items-center gap-2 font-bold text-sm text-gray-800">
          <span>{icon}</span> {title}
        </span>
        <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}
