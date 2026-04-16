// ===================================================================
// GROWMATE AI-Native 引擎 — AI 洞察报告章节包装器 v2.0.0
// 优化：错误提示 + 重试按钮 + 完整数据传递 + 加载超时反馈
// ===================================================================

import { useEffect, useState, useCallback } from 'react'
import type { AssessmentScores, EnhancedReport, WilderDimension } from '../../lib/assessmentEngine'
import type { EvidenceChain as EvidenceChainType } from '../../lib/evidenceChainBuilder'
import { computeSyncAIEnhancements, initAIEnhancement } from '../../lib/aiReportEnhancer'
import { CoTCausalChainSection, DualAgentSection, EmergentTalentsSection } from './AIInsightSections'
import type { CausalChain, DualPerspectiveReport, VectorPoint, EmergentTalent } from '../../lib/ai/types'

// ============================================================
// Props 接口
// ============================================================

export interface AIInsightReportSectionProps {
  studentName: string
  studentAge: number
  assessmentScores?: AssessmentScores
  enhancedReport?: EnhancedReport
  evidenceChain?: EvidenceChainType
  wilderScores?: Record<string, number>
  profileCode?: string
  // 优化 3: 传递完整数据
  vectorPoint?: VectorPoint
  emergentTalents?: EmergentTalent[]
}

// ============================================================
// 错误提示组件
// ============================================================

function AIErrorFallback({
  error,
  onRetry,
  studentName,
}: {
  error: string
  onRetry: () => void
  studentName: string
}) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-amber-200 p-6 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
          ⚠️
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-amber-900 mb-1">
            AI 分析暂时不可用
          </h3>
          <p className="text-sm text-amber-700 mb-3">
            {studentName}的 AI 深度分析遇到了一些问题，已自动降级为基础分析模式。
          </p>
          <details className="text-xs text-amber-600 mb-3">
            <summary className="cursor-pointer hover:text-amber-700">查看错误详情</summary>
            <pre className="mt-2 p-2 bg-amber-50 rounded overflow-x-auto">
              {error}
            </pre>
          </details>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重新分析
          </button>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 加载超时提示组件
// ============================================================

function AILoadingWithTimeout({
  elapsed,
  studentName,
}: {
  elapsed: number
  studentName: string
}) {
  const showTimeoutWarning = elapsed > 10000 // 10 秒后显示

  if (!showTimeoutWarning) {
    return null
  }

  return (
    <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
      <div className="flex items-center gap-2">
        <svg className="animate-spin w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm text-blue-700">
          正在为 {studentName} 进行深度 AI 分析，请稍候...
        </p>
      </div>
      <p className="text-xs text-blue-600 mt-1">
        已等待 {Math.round(elapsed / 1000)} 秒，通常需要 3-5 秒
      </p>
    </div>
  )
}

// ============================================================
// 主组件
// ============================================================

/**
 * AI 洞察报告章节 v2.0
 *
 * 优化：
 * 1. ✅ 错误提示 + 重试按钮
 * 2. ✅ 加载超时反馈
 * 3. ✅ 支持传递完整数据（vectorPoint + emergentTalents）
 * 4. ✅ 自动缓存 + 请求去重
 */
export function AIInsightReportSection({
  studentName,
  studentAge,
  assessmentScores,
  enhancedReport,
  evidenceChain,
  wilderScores,
  profileCode,
  vectorPoint: externalVectorPoint,
  emergentTalents: externalEmergentTalents,
}: AIInsightReportSectionProps) {
  // 同步数据（立即可用）
  const [syncData, setSyncData] = useState<{
    vectorPoint: VectorPoint | null
    emergentTalents: EmergentTalent[] | null
  }>({ vectorPoint: null, emergentTalents: null })

  // 异步数据（后台加载）
  const [asyncData, setAsyncData] = useState<{
    causalChains: CausalChain[] | null
    dualPerspective: DualPerspectiveReport | null
  }>({ causalChains: null, dualPerspective: null })

  // 加载状态
  const [loading, setLoading] = useState({
    cot: false,
    dualAgent: false,
  })

  // 错误状态
  const [errors, setErrors] = useState({
    cot: null as string | null,
    dualAgent: null as string | null,
  })

  // 加载时间跟踪
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)

  // 重试函数
  const [refreshFn, setRefreshFn] = useState<(() => Promise<void>) | null>(null)

  // 初始化 AI 增强
  const initializeAI = useCallback(() => {
    // 如果有外部传入的完整数据，优先使用
    if (externalVectorPoint || externalEmergentTalents) {
      setSyncData({
        vectorPoint: externalVectorPoint || null,
        emergentTalents: externalEmergentTalents || null,
      })
    }

    if (!assessmentScores || !enhancedReport) {
      // 如果缺少必要数据，尝试从简化数据初始化
      if (wilderScores && profileCode) {
        const simpleScores = {
          wilder: wilderScores as Record<WilderDimension, number>,
          profileCode,
        } as AssessmentScores

        const simpleReport = {
          profile729: { code: profileCode },
          talentType: { key: '' },
        } as unknown as EnhancedReport

        const sync = computeSyncAIEnhancements(simpleScores, simpleReport)
        setSyncData({ vectorPoint: sync.vectorPoint, emergentTalents: sync.emergentTalents })
      }
      return
    }

    // 完整数据初始化
    const student = {
      name: studentName,
      age: studentAge,
      grade: '',
      school: '',
      testDate: '',
    }

    const { syncData: sync, asyncPromise, forceRefresh } = initAIEnhancement(
      student,
      assessmentScores,
      enhancedReport,
      evidenceChain ? { dimensionEvidences: Object.values(evidenceChain.dimensionEvidences) } : undefined
    )

    // 设置同步数据（优先使用外部传入的）
    setSyncData({
      vectorPoint: externalVectorPoint || sync.vectorPoint,
      emergentTalents: externalEmergentTalents || sync.emergentTalents,
    })

    // 保存刷新函数
    setRefreshFn(() => forceRefresh)

    // 异步加载 AI 数据
    setLoadStartTime(Date.now())
    setLoading({ cot: true, dualAgent: true })
    setErrors({ cot: null, dualAgent: null })

    asyncPromise
      .then(result => {
        setAsyncData({
          causalChains: result.causalChains,
          dualPerspective: result.dualPerspective,
        })
        setErrors({
          cot: result.cotError,
          dualAgent: result.dualError,
        })
      })
      .catch(err => {
        console.error('[AIInsightReportSection] Async load failed:', err)
        setErrors({
          cot: err instanceof Error ? err.message : '加载失败',
          dualAgent: err instanceof Error ? err.message : '加载失败',
        })
      })
      .finally(() => {
        setLoading({ cot: false, dualAgent: false })
        setLoadStartTime(null)
      })
  }, [
    studentName,
    studentAge,
    assessmentScores,
    enhancedReport,
    evidenceChain,
    wilderScores,
    profileCode,
    externalVectorPoint,
    externalEmergentTalents,
  ])

  // 初始化
  useEffect(() => {
    initializeAI()
  }, [initializeAI])

  // 加载时间计时器
  useEffect(() => {
    if (!loadStartTime) return

    const timer = setInterval(() => {
      setElapsed(Date.now() - loadStartTime)
    }, 1000)

    return () => clearInterval(timer)
  }, [loadStartTime])

  // 重试处理
  const handleRetry = useCallback(() => {
    if (refreshFn) {
      setLoading({ cot: true, dualAgent: true })
      setErrors({ cot: null, dualAgent: null })
      setLoadStartTime(Date.now())

      refreshFn()
        .then(() => {
          // forceRefresh 重新初始化，数据通过 initializeAI effect 更新
        })
        .catch(err => {
          setErrors({
            cot: err instanceof Error ? err.message : '重试失败',
            dualAgent: err instanceof Error ? err.message : '重试失败',
          })
        })
        .finally(() => {
          setLoading({ cot: false, dualAgent: false })
          setLoadStartTime(null)
        })
    }
  }, [refreshFn])

  // 如果没有任何 AI 数据且没有错误，不渲染
  const hasAnyData = syncData.vectorPoint || syncData.emergentTalents?.length || asyncData.causalChains || asyncData.dualPerspective
  const isAnyLoading = loading.cot || loading.dualAgent
  const hasAnyError = errors.cot || errors.dualAgent

  // 如果全部错误且无数据，显示错误提示
  if (hasAnyError && !hasAnyData && !isAnyLoading) {
    return (
      <AIErrorFallback
        error={errors.cot || errors.dualAgent || '未知错误'}
        onRetry={handleRetry}
        studentName={studentName}
      />
    )
  }

  if (!hasAnyData && !isAnyLoading && !hasAnyError) {
    return null
  }

  return (
    <div className="ai-section-glow">
      {/* AI 标题 */}
      <div className="ai-header mb-6">
        <div className="ai-header__icon">🧠</div>
        <div>
          <div className="ai-header__title">AI 深度分析</div>
          <div className="text-xs text-gray-400 mt-0.5">基于 WILDER 模型的智能洞察</div>
        </div>
        <span className="ai-header__tag">DeepSeek 驱动</span>
      </div>

      {/* AI 思维链推理 */}
      <section id="section-ai-cot" className="page-break mb-6">
        <CoTCausalChainSection
          causalChains={asyncData.causalChains}
          loading={loading.cot}
          error={errors.cot}
          studentName={studentName}
        />
      </section>

      {/* AI 双视角对冲评估 */}
      <section id="section-ai-dual-agent" className="page-break mb-6">
        <DualAgentSection
          dualPerspective={asyncData.dualPerspective}
          loading={loading.dualAgent}
          error={errors.dualAgent}
          studentName={studentName}
        />
      </section>

      {/* AI 涌现人才探测 */}
      <section id="section-ai-emergent" className="page-break mb-6">
        <EmergentTalentsSection
          emergentTalents={syncData.emergentTalents}
          vectorPoint={syncData.vectorPoint}
          studentName={studentName}
        />
      </section>

      {/* 加载超时提示 */}
      {isAnyLoading && <AILoadingWithTimeout elapsed={elapsed} studentName={studentName} />}

      {/* 错误提示（部分错误时显示在底部） */}
      {hasAnyError && hasAnyData && (
        <section className="bg-white rounded-xl shadow-sm border border-amber-200 p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
              ⚠️
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-900 mb-1">
                部分 AI 分析不可用
              </h4>
              <p className="text-xs text-amber-700 mb-2">
                已自动降级为基础分析模式，其他分析正常显示。
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重新分析
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

// ============================================================
// 简化版组件（仅使用 reportData）
// ============================================================

export interface AISimpleSectionProps {
  reportData: {
    student: { name: string; age: number }
    wilderScores: Record<string, number>
    profileCode: string
    vectorPoint?: VectorPoint
    emergentTalents?: EmergentTalent[]
  }
}

/**
 * 简化版 AI 洞察组件 v2.0
 * 仅使用 reportData 中的信息，不需要额外的 assessmentScores
 * 适合快速集成到现有报告中
 */
export function AISimpleSection({ reportData }: AISimpleSectionProps) {
  const [loading, setLoading] = useState(true)
  const [syncData, setSyncData] = useState<{
    vectorPoint: VectorPoint | null
    emergentTalents: EmergentTalent[] | null
  }>({ vectorPoint: null, emergentTalents: null })

  useEffect(() => {
    if (!reportData?.wilderScores || !reportData?.profileCode) return

    // 如果有外部数据，直接使用
    if (reportData.vectorPoint || reportData.emergentTalents) {
      setSyncData({
        vectorPoint: reportData.vectorPoint || null,
        emergentTalents: reportData.emergentTalents || null,
      })
      setLoading(false)
      return
    }

    const dims: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']
    const wilderPcts = {} as Record<WilderDimension, number>
    dims.forEach(d => {
      wilderPcts[d] = reportData.wilderScores[d] || 0
    })

    const simpleScores = {
      wilder: wilderPcts,
      profileCode: reportData.profileCode,
    } as AssessmentScores

    const simpleReport = {
      profile729: { code: reportData.profileCode },
      talentType: { key: '' },
    } as unknown as EnhancedReport

    const sync = computeSyncAIEnhancements(simpleScores, simpleReport)
    setSyncData(sync)
    setLoading(false)
  }, [reportData])

  if (!reportData?.wilderScores || loading) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-slate-200" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <EmergentTalentsSection
      emergentTalents={syncData.emergentTalents}
      vectorPoint={syncData.vectorPoint}
      studentName={reportData.student.name}
    />
  )
}
