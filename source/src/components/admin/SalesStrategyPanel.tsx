import { useState, useEffect, useCallback, useMemo } from 'react'
import { Target, Lightbulb, Sparkles, Brain, RefreshCw, User, BookOpen, FolderOpen, HelpCircle, ChevronDown, ChevronRight, Users } from 'lucide-react'
import { getStats } from '../../lib/api'
import { identifyProfile30, PROFILES_BY_ID } from '../../lib/profile30System'
import { generateAIRecommendation, SALES_FUNNEL_STAGES, SUCCESS_CASES, SALES_FAQ, PARENT_TYPES, identifyParentType } from '../../lib/salesStrategies30'
import { identifyChildProfile, getSalesPackage } from '../../lib/salesKnowledgeBase'
import type { WilderScores, InterestClass } from '../../types'

interface SalesStrategy {
  id: string
  title: string
  description: string
  category: 'conversion' | 'retention' | 'upsell' | 'content'
  priority: 'high' | 'medium' | 'low'
  actionItems: string[]
  targetMetrics: string
}

interface ContentSuggestion {
  type: 'article' | 'video' | 'activity' | 'script'
  title: string
  description: string
  targetAudience: string
  keyPoints: string[]
}

// GROWMATE品牌定位驱动的销售策略
const WILDER_STRATEGIES: SalesStrategy[] = [
  {
    id: '1',
    title: '潜能发现转化策略',
    description: '基于"让教育从淘汰到成全"理念，帮助家长发现孩子独特潜能，而非焦虑补短板',
    category: 'conversion',
    priority: 'high',
    actionItems: [
      '测评后24小时内发送潜能发现报告解读',
      '强调孩子Top3优势能力，避免焦虑营销',
      '提供"潜能匹配课程"而非"补差课程"',
      '分享同龄同潜能孩子成长案例',
    ],
    targetMetrics: '测评→试课转化率提升至35%',
  },
  {
    id: '2',
    title: '科学探索力培养路径',
    description: '围绕WILDER六维能力模型，设计从好奇到专精的成长路径',
    category: 'upsell',
    priority: 'high',
    actionItems: [
      '根据潜能画像推荐L1-L6进阶课程',
      '展示"从好奇到自信实践"的成长地图',
      '提供季度能力复测，追踪成长轨迹',
      '设计家庭科学探索任务包',
    ],
    targetMetrics: '学员续费率提升至60%',
  },
  {
    id: '3',
    title: '家长沟通话术优化',
    description: '基于测评结果生成个性化沟通策略，让对话从说教变为连接',
    category: 'content',
    priority: 'medium',
    actionItems: [
      '根据孩子潜能类型生成20条沟通话术',
      '培训销售使用"发现式"而非"推销式"沟通',
      '建立家长社群，分享科学育儿知识',
      '定期发送孩子成长观察报告',
    ],
    targetMetrics: '家长满意度提升至4.8分',
  },
  {
    id: '4',
    title: '学员生命周期管理',
    description: '建立从新线索到续费转介绍的全流程服务体系',
    category: 'retention',
    priority: 'high',
    actionItems: [
      '新学员：7天内完成潜能报告解读',
      '活跃学员：每月发送成长观察+课程匹配',
      '沉默学员：30天未活跃触发关怀触达',
      '毕业学员：提供成长档案+转介绍激励',
    ],
    targetMetrics: '学员生命周期价值提升40%',
  },
]

// AI内容生成建议
const AI_CONTENT_SUGGESTIONS: ContentSuggestion[] = [
  {
    type: 'article',
    title: '如何发现孩子的科学探索潜能',
    description: '基于WILDER模型，帮助家长识别孩子的潜能信号',
    targetAudience: '新线索家长',
    keyPoints: ['WILDER六维能力解读', '日常观察清单', '潜能vs兴趣区分'],
  },
  {
    type: 'video',
    title: '潜能发现案例：从好奇到自信',
    description: '真实学员成长故事，展示潜能培养成果',
    targetAudience: '犹豫期家长',
    keyPoints: ['测评前后对比', '家长真实反馈', '导师专业解读'],
  },
  {
    type: 'activity',
    title: '周末科学探索任务包',
    description: '家庭可执行的微任务，培养科学探索能力',
    targetAudience: '在读学员家长',
    keyPoints: ['10-15分钟/天', '无需专业设备', '亲子互动设计'],
  },
  {
    type: 'script',
    title: '潜能报告解读话术库',
    description: '针对不同潜能类型的沟通策略',
    targetAudience: '销售团队',
    keyPoints: ['优势肯定话术', '成长建议话术', '异议处理话术'],
  },
]

// 兴趣班分析工具函数
function analyzeInterests(interests: InterestClass[]): {
  categoryDist: Record<string, number>
  satisfactionDist: Record<string, number>
  longTermCount: number
  totalCount: number
  insights: string[]
} {
  if (!interests.length) return { categoryDist: {}, satisfactionDist: {}, longTermCount: 0, totalCount: 0, insights: [] }

  const categoryDist: Record<string, number> = {}
  const satisfactionDist: Record<string, number> = { love: 0, okay: 0, dislike: 0 }
  let longTermCount = 0

  for (const item of interests) {
    categoryDist[item.category] = (categoryDist[item.category] || 0) + 1
    satisfactionDist[item.satisfaction] = (satisfactionDist[item.satisfaction] || 0) + 1
    if (item.duration === 'one_to_two' || item.duration === 'more_than_two') longTermCount++
  }

  const insights: string[] = []
  const topCat = Object.entries(categoryDist).sort((a, b) => b[1] - a[1])[0]
  if (topCat) insights.push(`最多兴趣集中在「${topCat[0]}」类别（${topCat[1]}项）`)
  if (satisfactionDist.love > 0) insights.push(`${satisfactionDist.love}项兴趣班孩子非常喜欢`)
  if (satisfactionDist.dislike > 0) insights.push(`${satisfactionDist.dislike}项兴趣班孩子不太喜欢，可关注原因`)
  if (longTermCount > 0) insights.push(`${longTermCount}项已坚持1年以上，说明有较好的持续力`)

  return { categoryDist, satisfactionDist, longTermCount, totalCount: interests.length, insights }
}

export function SalesStrategyPanel() {
  const [, setStats] = useState<Record<string, unknown>>({})
  const [, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'strategy' | 'content' | 'ai' | 'personalized' | 'sop' | 'cases' | 'faq'>('strategy')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [students, setStudents] = useState<Record<string, unknown>[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  // 新增状态
  const [expandedStage, setExpandedStage] = useState<string | null>('awareness')
  const [caseProfileFilter, setCaseProfileFilter] = useState<string>('all')
  const [caseParentFilter, setCaseParentFilter] = useState<string>('all')
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<string>('all')
  const [parentSignals, setParentSignals] = useState<string[]>([])
  const [identifiedParentType, setIdentifiedParentType] = useState<{ type: string; confidence: number; matchedSignals: string[] } | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const statsData = await getStats()
      setStats(statsData)
    } catch {
      // 使用默认数据
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // 从 localStorage 加载学生测评数据
  useEffect(() => {
    try {
      const raw = localStorage.getItem('wilder_assessments')
      if (raw) {
        const data = JSON.parse(raw)
        if (Array.isArray(data)) setStudents(data)
      }
    } catch {
      // 忽略解析错误
    }
  }, [])

  // 提取 WILDER 分数（兼容多种存储路径）
  const extractWilderScores = (student: Record<string, unknown>): WilderScores | null => {
    // 路径1: 顶层 wilderScores
    if (student.wilderScores && typeof student.wilderScores === 'object') {
      const ws = student.wilderScores as Record<string, unknown>
      if (typeof ws.W === 'number') return ws as unknown as WilderScores
    }
    // 路径2: assessmentScores 内嵌套
    const scores = student.assessmentScores as Record<string, unknown> | undefined
    if (scores) {
      if (typeof scores.W === 'number' && typeof scores.I === 'number') {
        return { W: scores.W as number, I: scores.I as number, L: scores.L as number, D: scores.D as number, E: scores.E as number, R: scores.R as number }
      }
      if (scores.wilder && typeof scores.wilder === 'object') {
        return scores.wilder as WilderScores
      }
    }
    return null
  }

  // 个性化策略生成
  const personalizedStrategy = useMemo(() => {
    if (!selectedStudentId) return null
    const student = students.find(s => (s.id as string) === selectedStudentId)
    if (!student) return null

    const info = student.studentInfo as Record<string, unknown> | undefined
    const wilderScores = extractWilderScores(student)
    const structuredInterests = (info?.structuredInterests as InterestClass[]) || []
    const interestText = (info?.interestClasses as string) || ''

    // WILDER 画像匹配
    let profile30Result: { profileId: string; confidence: number; matchReason: string } | null = null
    let aiRec: ReturnType<typeof generateAIRecommendation> | null = null
    let childProfileKey: string | null = null
    let salesPkg: ReturnType<typeof getSalesPackage> = null

    if (wilderScores) {
      profile30Result = identifyProfile30(wilderScores)
      aiRec = generateAIRecommendation(wilderScores)
      childProfileKey = identifyChildProfile(wilderScores)
      salesPkg = getSalesPackage(childProfileKey)
    }

    // 兴趣班分析
    const interestAnalysis = analyzeInterests(structuredInterests)

    return {
      info,
      wilderScores,
      profile30Result,
      aiRec,
      childProfileKey,
      salesPkg,
      structuredInterests,
      interestText,
      interestAnalysis,
    }
  }, [selectedStudentId, students])

  const filteredStrategies = selectedCategory === 'all'
    ? WILDER_STRATEGIES
    : WILDER_STRATEGIES.filter(s => s.category === selectedCategory)

  const categoryColors = {
    conversion: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    retention: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    upsell: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    content: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="space-y-6">
      {/* 品牌理念卡片 */}
      <div className="bg-gradient-to-r from-brand-blue-500 via-brand-blue-600 to-teal-500 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">GROWMATE·销售策略中心</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              基于"让教育从淘汰到成全"理念，帮助每个孩子被发现、被懂得、被成全。
              我们不焦虑营销，而是用科学的方式发现孩子的独特潜能。
            </p>
          </div>
        </div>
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {[
          { key: 'strategy', label: '销售策略', icon: Target },
          { key: 'sop', label: 'SOP手册', icon: BookOpen },
          { key: 'cases', label: '案例库', icon: FolderOpen },
          { key: 'faq', label: 'FAQ', icon: HelpCircle },
          { key: 'personalized', label: '个性化推荐', icon: User },
          { key: 'content', label: '内容建议', icon: Lightbulb },
          { key: 'ai', label: 'AI内容底座', icon: Sparkles },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-brand-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 销售策略 */}
      {activeTab === 'strategy' && (
        <div className="space-y-4">
          {/* 分类筛选 */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: '全部策略' },
              { key: 'conversion', label: '转化策略' },
              { key: 'retention', label: '留存策略' },
              { key: 'upsell', label: '升单策略' },
              { key: 'content', label: '内容策略' },
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-brand-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 策略卡片 */}
          <div className="grid gap-4">
            {filteredStrategies.map(strategy => {
              const colors = categoryColors[strategy.category]
              return (
                <div
                  key={strategy.id}
                  className={`${colors.bg} ${colors.border} border rounded-xl p-5`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className={`font-bold ${colors.text}`}>{strategy.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{strategy.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[strategy.priority]}`}>
                      {strategy.priority === 'high' ? '高优先' : strategy.priority === 'medium' ? '中优先' : '低优先'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {strategy.actionItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-brand-blue-500 mt-0.5">✓</span>
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-200/50">
                    <span className="text-xs text-gray-500">目标指标：</span>
                    <span className="text-xs font-medium text-gray-700 ml-1">{strategy.targetMetrics}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 内容建议 */}
      {activeTab === 'content' && (
        <div className="grid md:grid-cols-2 gap-4">
          {AI_CONTENT_SUGGESTIONS.map((content, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">
                  {content.type === 'article' ? '📝' : content.type === 'video' ? '🎬' : content.type === 'activity' ? '🎯' : '💬'}
                </span>
                <span className="text-xs text-gray-500 uppercase">
                  {content.type === 'article' ? '文章' : content.type === 'video' ? '视频' : content.type === 'activity' ? '活动' : '话术'}
                </span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">{content.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{content.description}</p>
              <div className="text-xs text-gray-500 mb-3">
                目标受众：{content.targetAudience}
              </div>
              <div className="flex flex-wrap gap-1">
                {content.keyPoints.map((point, j) => (
                  <span key={j} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                    {point}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI内容底座 */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          {/* AI能力说明 */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">GROWMATE AI内容底座</h4>
                <p className="text-sm text-gray-500">基于WILDER模型的智能内容生成系统</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              AI内容底座深度融合GROWMATE的教育理念，能够根据学员的潜能画像、年龄阶段、学习进度，
              自动生成个性化的学习建议、家长沟通话术、课程推荐等内容，确保每一条内容都符合
              "发现、懂得、成全"的品牌精神。
            </p>
          </div>

          {/* AI生成能力 */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: '个性化报告解读',
                desc: '根据潜能类型生成专属解读文案',
                icon: '📊',
                features: ['潜能优势分析', '成长路径建议', '课程匹配推荐'],
              },
              {
                title: '家长沟通助手',
                desc: '生成针对性沟通话术和跟进策略',
                icon: '💬',
                features: ['异议处理话术', '关怀触达文案', '成长反馈模板'],
              },
              {
                title: '课程内容生成',
                desc: '基于WILDER模型设计学习内容',
                icon: '📚',
                features: ['探索任务设计', '知识图谱构建', '测评题目生成'],
              },
            ].map((ai, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="text-3xl mb-3">{ai.icon}</div>
                <h5 className="font-bold text-gray-800 mb-2">{ai.title}</h5>
                <p className="text-sm text-gray-600 mb-3">{ai.desc}</p>
                <div className="space-y-1">
                  {ai.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-1 h-1 bg-brand-blue-500 rounded-full" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* AI配置入口 */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">AI模型状态</p>
                <p className="text-xs text-gray-500">已接入WILDER-729模型引擎</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              运行正常
            </span>
          </div>
        </div>
      )}

      {/* SOP手册 */}
      {activeTab === 'sop' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-bold text-gray-800">销售SOP手册</h4>
                <p className="text-sm text-gray-500">从认知到转介绍的7个阶段完整操作指南</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {Object.entries(SALES_FUNNEL_STAGES).map(([key, stage]) => (
              <div key={key} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedStage(expandedStage === key ? null : key)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                      {Object.keys(SALES_FUNNEL_STAGES).indexOf(key) + 1}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-800">{stage.name}</p>
                      <p className="text-xs text-gray-500">{stage.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{stage.timeframe}</span>
                    {expandedStage === key ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  </div>
                </button>
                
                {expandedStage === key && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    {/* 话术 */}
                    <div className="mt-4">
                      <p className="text-xs font-bold text-blue-600 mb-2 flex items-center gap-1">
                        <span>💬</span> 核心话术
                      </p>
                      <div className="space-y-2">
                        {stage.scripts.map((script, i) => (
                          <div key={i} className="p-3 bg-blue-50 rounded-lg text-sm text-gray-700 leading-relaxed">
                            {script}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* 行动清单 */}
                    <div className="mt-4">
                      <p className="text-xs font-bold text-green-600 mb-2 flex items-center gap-1">
                        <span>✅</span> 行动清单
                      </p>
                      <div className="grid gap-2">
                        {stage.actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-500 mt-0.5">•</span>
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* KPI */}
                    <div className="mt-4">
                      <p className="text-xs font-bold text-purple-600 mb-2 flex items-center gap-1">
                        <span>📊</span> 关键指标
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {stage.kpis.map((kpi, i) => (
                          <span key={i} className="px-3 py-1.5 bg-purple-50 rounded-lg text-xs">
                            <span className="text-gray-600">{kpi.metric}:</span>
                            <span className="font-bold text-purple-700 ml-1">{kpi.target}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* 小贴士 */}
                    <div className="mt-4">
                      <p className="text-xs font-bold text-amber-600 mb-2 flex items-center gap-1">
                        <span>💡</span> 经验提示
                      </p>
                      <div className="p-3 bg-amber-50 rounded-lg">
                        {stage.tips.map((tip, i) => (
                          <p key={i} className="text-xs text-amber-800 mb-1 last:mb-0">• {tip}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 案例库 */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-bold text-gray-800">成功案例库</h4>
                <p className="text-sm text-gray-500">真实学员成长故事，助力销售沟通</p>
              </div>
            </div>
          </div>
          
          {/* 筛选器 */}
          <div className="flex gap-3 flex-wrap">
            <select
              value={caseProfileFilter}
              onChange={e => setCaseProfileFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="all">全部画像</option>
              <option value="W-dominant">W-探索型</option>
              <option value="I-dominant">I-探究型</option>
              <option value="L-dominant">L-感知型</option>
              <option value="D-dominant">D-实践型</option>
              <option value="E-dominant">E-责任型</option>
              <option value="R-dominant">R-韧性型</option>
            </select>
            <select
              value={caseParentFilter}
              onChange={e => setCaseParentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="all">全部家长类型</option>
              {Object.entries(PARENT_TYPES).map(([key, type]) => (
                <option key={key} value={key}>{type.name}</option>
              ))}
            </select>
          </div>
          
          {/* 案例列表 */}
          <div className="grid gap-4">
            {SUCCESS_CASES
              .filter(c => caseProfileFilter === 'all' || c.studentProfile === caseProfileFilter)
              .filter(c => caseParentFilter === 'all' || c.parentType === caseParentFilter)
              .map(caseItem => (
                <div key={caseItem.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-gray-800">{caseItem.title}</h4>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{caseItem.studentProfile}</span>
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">{PARENT_TYPES[caseItem.parentType]?.name || caseItem.parentType}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="text-gray-400">学生：</span>{caseItem.studentGrade} · {caseItem.studentAge}岁
                    <span className="text-gray-300 mx-2">|</span>
                    <span className="text-gray-400">周期：</span>{caseItem.duration}
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{caseItem.background}</p>
                  
                  {/* 挑战 */}
                  <div className="mb-3">
                    <p className="text-xs font-bold text-red-600 mb-1">面临挑战</p>
                    <div className="flex flex-wrap gap-1">
                      {caseItem.challenges.slice(0, 3).map((ch, i) => (
                        <span key={i} className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs">{ch}</span>
                      ))}
                    </div>
                  </div>
                  
                  {/* 介入方案 */}
                  <div className="p-3 bg-blue-50 rounded-lg mb-3">
                    <p className="text-xs font-bold text-blue-600 mb-1">介入方案</p>
                    <p className="text-sm text-gray-700">{caseItem.intervention}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {caseItem.courses.map((course, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white rounded text-xs text-blue-600">{course}</span>
                      ))}
                    </div>
                  </div>
                  
                  {/* 成果 */}
                  <div className="mb-3">
                    <p className="text-xs font-bold text-green-600 mb-1">取得成果</p>
                    <div className="grid gap-1">
                      {caseItem.outcomes.map((outcome, i) => (
                        <p key={i} className="text-sm text-gray-700 flex items-start gap-1">
                          <span className="text-green-500">✓</span> {outcome}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  {/* 家长评价 */}
                  <div className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                    <p className="text-sm text-gray-700 italic">"{caseItem.parentQuote}"</p>
                  </div>
                  
                  {/* 销售提示 */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-purple-600 mb-1">💡 销售提示</p>
                    <div className="space-y-1">
                      {caseItem.tips.map((tip, i) => (
                        <p key={i} className="text-xs text-gray-600">• {tip}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-amber-600" />
              <div>
                <h4 className="font-bold text-gray-800">常见问题FAQ</h4>
                <p className="text-sm text-gray-500">销售常见问题及标准回答</p>
              </div>
            </div>
          </div>
          
          {/* 分类筛选 */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: '全部' },
              { key: 'value', label: '价值类' },
              { key: 'safety', label: '安全类' },
              { key: 'logistics', label: '服务类' },
              { key: 'pricing', label: '价格类' },
              { key: 'effect', label: '效果类' },
              { key: 'comparison', label: '对比类' },
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setFaqCategoryFilter(cat.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  faqCategoryFilter === cat.key
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          
          {/* FAQ列表 */}
          <div className="space-y-3">
            {SALES_FAQ
              .filter(item => faqCategoryFilter === 'all' || item.category === faqCategoryFilter)
              .map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-xs font-bold flex-shrink-0 mt-0.5">
                      Q
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 mb-2">{item.question}</p>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-bold flex-shrink-0 mt-0.5">
                          A
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{item.answer}</p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.tags.map((tag, j) => (
                          <span key={j} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 个性化推荐 */}
      {activeTab === 'personalized' && (
        <div className="space-y-6">
          {/* 学生选择器 */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">选择学生</label>
            {students.length === 0 ? (
              <p className="text-sm text-gray-400">暂无学生测评记录，完成测评后可在此查看个性化推荐</p>
            ) : (
              <select
                value={selectedStudentId || ''}
                onChange={e => setSelectedStudentId(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
              >
                <option value="">请选择学生...</option>
                {students.map((s, i) => {
                  const info = s.studentInfo as Record<string, unknown> | undefined
                  const name = (info?.name as string) || `学生${i + 1}`
                  const date = (s.createdAt as string) || ''
                  const dateStr = date ? new Date(date).toLocaleDateString('zh-CN') : ''
                  return (
                    <option key={String(s.id || i)} value={String(s.id || i)}>
                      {name} {dateStr ? `(${dateStr})` : ''}
                    </option>
                  )
                })}
              </select>
            )}
          </div>

          {/* 未选择学生 */}
          {!personalizedStrategy && selectedStudentId === null && students.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">请在上方选择一位学生，查看个性化销售策略推荐</p>
            </div>
          )}

          {/* 学生画像卡 */}
          {personalizedStrategy && (
            <>
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">👤</span> 学生画像
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">姓名：</span><span className="font-medium">{(personalizedStrategy.info?.name as string) || '-'}</span></div>
                  <div><span className="text-gray-500">年龄：</span><span className="font-medium">{(personalizedStrategy.info?.age as number) || '-'}岁</span></div>
                  <div><span className="text-gray-500">年级：</span><span className="font-medium">{(personalizedStrategy.info?.grade as string) || '-'}</span></div>
                  <div><span className="text-gray-500">学校：</span><span className="font-medium">{(personalizedStrategy.info?.school as string) || '-'}</span></div>
                </div>

                {/* WILDER 维度分数 */}
                {personalizedStrategy.wilderScores && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">WILDER 六维分数</p>
                    <div className="grid grid-cols-6 gap-2">
                      {(['W', 'I', 'L', 'D', 'E', 'R'] as const).map(dim => {
                        const score = personalizedStrategy.wilderScores![dim]
                        const maxScore = 100
                        const pct = Math.min(100, Math.round((score / maxScore) * 100))
                        return (
                          <div key={dim} className="text-center">
                            <div className="text-xs font-bold text-gray-600 mb-1">{dim}</div>
                            <div className="h-16 bg-gray-100 rounded-md relative overflow-hidden">
                              <div
                                className="absolute bottom-0 w-full bg-teal-400 rounded-md transition-all"
                                style={{ height: `${pct}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-gray-500 mt-1">{Math.round(score)}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 30画像匹配结果 */}
                {personalizedStrategy.profile30Result && (
                  <div className="mt-4 p-3 bg-white/70 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">画像匹配</p>
                    <p className="font-bold text-teal-700">
                      {PROFILES_BY_ID[personalizedStrategy.profile30Result.profileId]?.name || personalizedStrategy.profile30Result.profileId}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      置信度 {Math.round(personalizedStrategy.profile30Result.confidence)}% · {personalizedStrategy.profile30Result.matchReason}
                    </p>
                  </div>
                )}

                {!personalizedStrategy.wilderScores && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                    该学生暂无WILDER测评分数，无法进行画像匹配
                  </div>
                )}
              </div>

              {/* 家长类型识别 */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>家长类型识别</span>
                </h4>
                
                {/* 信号选择器 */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">请选择家长在沟通中表现出的信号（可多选）：</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '反复问能不能提高成绩',
                      '关注分数和排名',
                      '希望孩子有特长',
                      '关注素质教育',
                      '问有没有竞赛',
                      '关注简历加分项',
                      '孩子内向不合群',
                      '希望孩子更自信',
                      '孩子沉迷手机/游戏',
                      '不愿出门',
                      '希望孩子全面发展',
                      '重视自然教育',
                    ].map(signal => (
                      <button
                        key={signal}
                        onClick={() => {
                          const newSignals = parentSignals.includes(signal)
                            ? parentSignals.filter(s => s !== signal)
                            : [...parentSignals, signal]
                          setParentSignals(newSignals)
                          setIdentifiedParentType(identifyParentType(newSignals))
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                          parentSignals.includes(signal)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {signal}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 识别结果 */}
                {identifiedParentType && identifiedParentType.type && (
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold text-purple-700">{PARENT_TYPES[identifiedParentType.type]?.name || identifiedParentType.type}</p>
                        <p className="text-xs text-gray-500">置信度 {identifiedParentType.confidence}%</p>
                      </div>
                    </div>
                    
                    {PARENT_TYPES[identifiedParentType.type] && (
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs font-bold text-gray-600 mb-1">接触策略</p>
                          <p className="text-sm text-gray-700">{PARENT_TYPES[identifiedParentType.type].approach}</p>
                        </div>
                        
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs font-bold text-blue-600 mb-2">推荐开场话术</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{PARENT_TYPES[identifiedParentType.type].scripts.opening}</p>
                        </div>
                        
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs font-bold text-green-600 mb-2">价值主张</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{PARENT_TYPES[identifiedParentType.type].scripts.valueProposition}</p>
                        </div>
                        
                        <div className="p-3 bg-white rounded-lg">
                          <p className="text-xs font-bold text-amber-600 mb-2">异议处理参考</p>
                          <div className="space-y-2">
                            {PARENT_TYPES[identifiedParentType.type].scripts.objectionHandling.slice(0, 2).map((obj, i) => (
                              <div key={i} className="text-sm">
                                <p className="text-gray-500 mb-1">❓ "{obj.objection}"</p>
                                <p className="text-gray-700">→ {obj.response}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {parentSignals.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">点击上方信号标签，系统将自动识别家长类型并推荐话术</p>
                )}
              </div>

              {/* 兴趣班分析 */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">🎨</span> 兴趣班分析
                </h4>
                {personalizedStrategy.structuredInterests.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {personalizedStrategy.structuredInterests.map(item => {
                        const satEmoji = item.satisfaction === 'love' ? '😍' : item.satisfaction === 'okay' ? '😊' : '😐'
                        const durLabel = item.duration === 'less_half_year' ? '<半年' : item.duration === 'half_to_one' ? '半年-1年' : item.duration === 'one_to_two' ? '1-2年' : '2年+'
                        return (
                          <span key={item.name} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs">
                            <span>{satEmoji}</span>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-400">{durLabel}</span>
                          </span>
                        )
                      })}
                    </div>
                    {personalizedStrategy.interestAnalysis.insights.length > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg space-y-1">
                        {personalizedStrategy.interestAnalysis.insights.map((insight, i) => (
                          <p key={i} className="text-xs text-blue-700 flex items-start gap-1.5">
                            <span className="text-blue-400 mt-0.5">💡</span> {insight}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ) : personalizedStrategy.interestText ? (
                  <p className="text-sm text-gray-600">{personalizedStrategy.interestText}</p>
                ) : (
                  <p className="text-sm text-gray-400">该学生未填写兴趣班信息</p>
                )}
              </div>

              {/* 课程推荐 */}
              {personalizedStrategy.aiRec && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">📚</span> 推荐课程
                  </h4>
                  <div className="space-y-3">
                    {personalizedStrategy.aiRec.primaryCourses.map((course, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                        <span className="text-lg font-bold text-green-600 mt-0.5">#{i + 1}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{course.course}</p>
                          <p className="text-xs text-gray-500 mt-1">{course.reason}</p>
                          <div className="mt-1">
                            <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                              匹配度 {Math.round(course.matchScore)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">预估转化率：<span className="font-medium text-gray-700">{Math.round(personalizedStrategy.aiRec.predictedConversion)}%</span></p>
                  </div>
                </div>
              )}

              {/* 销售话术指南 */}
              {personalizedStrategy.salesPkg && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">💬</span> 销售话术指南
                  </h4>
                  <div className="space-y-4">
                    {/* 画像标签 */}
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{personalizedStrategy.salesPkg.profile.icon}</span>
                      <div>
                        <p className="font-medium text-gray-800">{personalizedStrategy.salesPkg.profile.type}</p>
                        <p className="text-xs text-gray-500">{personalizedStrategy.salesPkg.profile.tagline}</p>
                      </div>
                    </div>

                    {/* 痛点应对 */}
                    {personalizedStrategy.salesPkg.strategy.parentPainPoints.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-red-600 mb-2">家长痛点 & 应对</p>
                        <div className="space-y-2">
                          {personalizedStrategy.salesPkg.strategy.parentPainPoints.slice(0, 3).map((pp: { pain: string; response: string }, i: number) => (
                            <div key={i} className="p-2.5 bg-red-50 rounded-lg">
                              <p className="text-xs text-red-700 font-medium">😟 "{pp.pain}"</p>
                              <p className="text-xs text-gray-700 mt-1">→ {pp.response}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 成交亮点 */}
                    {personalizedStrategy.salesPkg.strategy.closingPoints?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-green-600 mb-2">成交亮点</p>
                        <div className="flex flex-wrap gap-1.5">
                          {personalizedStrategy.salesPkg.strategy.closingPoints.map((point: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs">
                              ✓ {point}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 异议处理 */}
                    {personalizedStrategy.salesPkg.strategy.objectionHandling?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-amber-600 mb-2">异议处理</p>
                        <div className="space-y-2">
                          {personalizedStrategy.salesPkg.strategy.objectionHandling.slice(0, 3).map((obj: { objection: string; response: string }, i: number) => (
                            <div key={i} className="p-2.5 bg-amber-50 rounded-lg">
                              <p className="text-xs text-amber-700 font-medium">🤔 "{obj.objection}"</p>
                              <p className="text-xs text-gray-700 mt-1">→ {obj.response}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 沟通策略 */}
                    {personalizedStrategy.aiRec && (
                      <div>
                        <p className="text-xs font-bold text-blue-600 mb-2">沟通要点</p>
                        <div className="space-y-1">
                          {personalizedStrategy.aiRec.communicationStrategy.keyMessages.map((msg, i) => (
                            <p key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                              <span className="text-blue-400">▸</span> {msg}
                            </p>
                          ))}
                        </div>
                        {personalizedStrategy.aiRec.communicationStrategy.cautionPoints.length > 0 && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded">
                            <p className="text-[10px] text-yellow-600 font-medium mb-1">⚠️ 注意事项</p>
                            {personalizedStrategy.aiRec.communicationStrategy.cautionPoints.map((cp, i) => (
                              <p key={i} className="text-[10px] text-yellow-700">{cp}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 无销售策略包时的降级显示 */}
              {!personalizedStrategy.salesPkg && personalizedStrategy.wilderScores && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                  暂无匹配的销售话术包，可基于上方画像信息自行组织沟通策略
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default SalesStrategyPanel
