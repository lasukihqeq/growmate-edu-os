/**
 * ReportGenerator — 报告生成封装组件
 *
 * 职责：
 * 1. 将 assessmentScores + enhancedReport 转换为 DynamicReportData
 * 2. 处理生成过程中的错误（显示友好提示而非白屏）
 * 3. 提供加载态 UI
 * 4. 生成完成后回调 onGenerated
 */

import { useEffect, useRef, useState } from 'react'
import { Loader2, AlertTriangle, RotateCcw } from 'lucide-react'
import {
  generateDynamicReport,
  type DynamicReportData,
  type StudentProfile,
} from '../lib/reportContentGenerator'
import type { AssessmentScores, EnhancedReport } from '../lib/assessmentEngine'
import type { EvidenceChain } from '../lib/evidenceChainBuilder'
import type { StudentInfo } from '../types'

interface ReportGeneratorProps {
  studentInfo: StudentInfo
  assessmentScores: AssessmentScores
  enhancedReport: EnhancedReport
  evidenceChain?: EvidenceChain | null
  /** 生成成功后的回调 */
  onGenerated: (report: DynamicReportData) => void
  /** 生成失败或用户放弃时的回调 */
  onError: () => void
}

type GenerationState =
  | { status: 'generating' }
  | { status: 'success'; report: DynamicReportData }
  | { status: 'error'; message: string }

export function ReportGenerator({
  studentInfo,
  assessmentScores,
  enhancedReport,
  evidenceChain,
  onGenerated,
  onError,
}: ReportGeneratorProps) {
  const [state, setState] = useState<GenerationState>({ status: 'generating' })
  const attemptRef = useRef(0)

  const generate = () => {
    attemptRef.current += 1
    setState({ status: 'generating' })

    // 使用 setTimeout 避免同步阻塞渲染
    setTimeout(() => {
      try {
        const profile: StudentProfile = {
          name: studentInfo.name,
          age: studentInfo.age,
          grade: studentInfo.grade ?? '',
          school: studentInfo.school || '',
          testDate: studentInfo.testDate || new Date().toLocaleDateString('zh-CN'),
        }

        const report = generateDynamicReport(
          profile,
          assessmentScores,
          enhancedReport,
          evidenceChain
            ? { useRealData: true, dimensionEvidences: evidenceChain.dimensionEvidences }
            : undefined,
        )

        setState({ status: 'success', report })
        onGenerated(report)
      } catch (err) {
        const message = err instanceof Error ? err.message : '未知错误'
        console.error('[ReportGenerator] 报告生成失败:', err)
        setState({ status: 'error', message })
      }
    }, 0)
  }

  // 首次挂载时自动生成
  useEffect(() => {
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state.status === 'generating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd]">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
          <p className="text-[#1d1d1f] text-lg font-medium">
            正在生成专属报告...
          </p>
          <p className="text-[#86868b] text-sm">
            AI 正在分析 {studentInfo.name} 的测评数据
          </p>
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd] px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-[#1d1d1f] mb-2">报告生成遇到问题</h2>
          <p className="text-sm text-[#86868b] mb-6">{state.message}</p>
          <div className="flex gap-3">
            {attemptRef.current < 3 && (
              <button
                onClick={generate}
                className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                重试
              </button>
            )}
            <button
              onClick={onError}
              className="flex-1 py-3 border border-black/[0.06] text-[#1d1d1f] font-medium rounded-xl hover:bg-black/[0.02] transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  // success 状态由 onGenerated 回调处理跳转，不渲染额外 UI
  return null
}
