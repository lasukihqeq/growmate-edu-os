import { useState, useRef, useEffect, useCallback } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Home } from './components/Home'
import { Onboarding } from './components/Onboarding'
import { Chat } from './components/Chat'
import { ReportPage } from './components/ReportPage'
import { MultiModalAssessment } from './components/MultiModalAssessment'
import { AdminDashboard } from './components/AdminDashboard'
import { UserCenter } from './components/UserCenter'
import { GrowthDashboard } from './components/dashboard/GrowthDashboard'
import { ResumeDialog } from './components/ResumeDialog'
import { generateDynamicReport, type DynamicReportData, type StudentProfile } from './lib/reportContentGenerator'
import { saveAssessment, autoSyncPending } from './lib/api'
import { loadDraft, clearDraft, type DraftData } from './lib/draftManager'
import { initializeTokens } from './lib/tokenManager'
import type { AssessmentScores, EnhancedReport } from './lib/assessmentEngine'
import type { EvidenceChain } from './lib/evidenceChainBuilder'
import type { StudentInfo, AppScreen } from './types'

// 有效的路由列表（与 AppScreen 类型严格对应）
const VALID_ROUTES: readonly AppScreen[] = [
  'home', 'onboarding', 'multi-modal-assessment', 'chat',
  'report', 'user-center', 'admin', 'dashboard',
] as const

// 从 hash 中解析路由
function getRouteFromHash(): AppScreen {
  const hash = window.location.hash.replace('#/', '').replace('#', '')
  if (!hash) return 'home'
  if (VALID_ROUTES.includes(hash as AppScreen)) return hash as AppScreen
  if (hash.startsWith('report/')) return 'report'
  return 'home'
}

// 同步路由到 URL hash（避免重复设置）
function syncHashToRoute(screen: AppScreen) {
  const target = `#/${screen}`
  if (window.location.hash !== target) {
    window.location.hash = target
  }
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(getRouteFromHash)
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
  const [assessmentScores, setAssessmentScores] = useState<AssessmentScores | null>(null)
  const [enhancedReport, setEnhancedReport] = useState<EnhancedReport | null>(null)
  const [evidenceChain, setEvidenceChain] = useState<EvidenceChain | null>(null)
  const [dynamicReport, setDynamicReport] = useState<DynamicReportData | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [pendingDraft, setPendingDraft] = useState<DraftData | null>(() => loadDraft())
  const [assessmentMode, setAssessmentMode] = useState<'standard' | 'minigame'>('standard')
  const startTimeRef = useRef<number>(0)

  // 路由切换：同时更新状态和 URL hash
  const navigateTo = useCallback((screen: AppScreen) => {
    setCurrentScreen(screen)
    syncHashToRoute(screen)
  }, [])

  // 启动时：自动同步 + 初始化令牌（合并为单次 effect）
  useEffect(() => {
    autoSyncPending().catch(() => { /* 静默失败 */ })
    initializeTokens()
  }, [])

  // 监听 hash 变化（浏览器前进/后退）
  useEffect(() => {
    const onHashChange = () => {
      setCurrentScreen(getRouteFromHash())
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // ─── 导航回调 ───

  const handleInviteVerified = useCallback(() => {
    setIsVerified(true)
    navigateTo('onboarding')
  }, [navigateTo])

  const handleResumeDraft = useCallback(() => {
    if (!pendingDraft) return
    setIsVerified(true)
    if (pendingDraft.studentInfo) setStudentInfo(pendingDraft.studentInfo)
    startTimeRef.current = Date.now()
    const stageToScreen: Record<string, AppScreen> = {
      'onboarding': 'onboarding',
      'multi-modal': 'multi-modal-assessment',
      'chat': 'chat',
    }
    navigateTo(stageToScreen[pendingDraft.stage] || 'onboarding')
    setPendingDraft(null)
  }, [pendingDraft, navigateTo])

  const handleDiscardDraft = useCallback(() => {
    clearDraft()
    setPendingDraft(null)
  }, [])

  const handleOnboardingComplete = useCallback((info: StudentInfo) => {
    setStudentInfo({ ...info, testDate: new Date().toLocaleDateString('zh-CN') })
    startTimeRef.current = Date.now()
    navigateTo('multi-modal-assessment')
  }, [navigateTo])

  const handleBackToHome = useCallback(() => {
    navigateTo(isVerified ? 'onboarding' : 'home')
    setStudentInfo(null)
    setAssessmentScores(null)
    setEnhancedReport(null)
    setEvidenceChain(null)
    setDynamicReport(null)
  }, [isVerified, navigateTo])

  const handleShowReport = useCallback(() => {
    setDynamicReport(null)
    navigateTo('report')
  }, [navigateTo])

  const handleShowUserCenter = useCallback(() => {
    navigateTo('user-center')
  }, [navigateTo])

  const handleViewSavedReport = useCallback((reportData: DynamicReportData) => {
    setDynamicReport(reportData)
    navigateTo('report')
  }, [navigateTo])

  const handleMultiModalComplete = useCallback((
    scores: AssessmentScores, report: EnhancedReport, chain?: EvidenceChain,
  ) => {
    setAssessmentScores(scores)
    setEnhancedReport(report)
    if (chain) setEvidenceChain(chain)
    navigateTo('chat')
  }, [navigateTo])

  // AI 对话完成 → 生成报告 → 保存
  const handleChatComplete = useCallback(() => {
    if (!studentInfo || !assessmentScores || !enhancedReport) return

    const studentProfile: StudentProfile = {
      name: studentInfo.name,
      age: studentInfo.age,
      grade: studentInfo.grade ?? '',
      school: studentInfo.school || '',
      testDate: studentInfo.testDate || new Date().toLocaleDateString('zh-CN'),
    }

    let report: DynamicReportData
    try {
      report = generateDynamicReport(
        studentProfile, assessmentScores, enhancedReport,
        evidenceChain
          ? { useRealData: true, dimensionEvidences: evidenceChain.dimensionEvidences }
          : undefined,
      )
    } catch (err) {
      console.error('[App] 报告生成失败:', err)
      alert('报告生成遇到问题，请重新开始测评')
      navigateTo('home')
      return
    }

    setDynamicReport(report)
    clearDraft()

    // 异步保存到云端（不阻塞体验）
    const durationSeconds = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0
    saveAssessment({
      studentInfo: studentInfo as unknown as Record<string, unknown>,
      assessmentScores: assessmentScores as unknown as Record<string, unknown>,
      dynamicReport: report as unknown as Record<string, unknown>,
      talentType: report.talentType,
      profileCode: assessmentScores.profileCode,
      durationSeconds,
    }).catch(() => { /* 静默失败，本地已缓存 */ })

    navigateTo('report')
  }, [studentInfo, assessmentScores, enhancedReport, evidenceChain, navigateTo])

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* 恢复进度对话框 */}
        {pendingDraft && (
          <ResumeDialog
            draft={pendingDraft}
            onResume={handleResumeDraft}
            onDiscard={handleDiscardDraft}
          />
        )}

        {currentScreen === 'home' && (
          <Home
            onVerified={handleInviteVerified}
            onShowReport={handleShowReport}
            onShowUserCenter={handleShowUserCenter}
          />
        )}

        {currentScreen === 'onboarding' && (
          <ErrorBoundary>
            <Onboarding onComplete={handleOnboardingComplete} onBack={handleBackToHome} />
          </ErrorBoundary>
        )}

        {currentScreen === 'multi-modal-assessment' && (
          <ErrorBoundary>
            <MultiModalAssessment
              onBack={handleBackToHome}
              onComplete={handleMultiModalComplete}
              studentName={studentInfo?.name}
              studentAge={studentInfo?.age ?? 10}
              studentPhone={studentInfo?.phone}
              assessmentMode={assessmentMode}
              onSwitchMode={setAssessmentMode}
            />
          </ErrorBoundary>
        )}

        {currentScreen === 'chat' && (
          <ErrorBoundary>
            <Chat
              studentName={studentInfo?.name || '同学'}
              studentAge={studentInfo?.age ?? 10}
              onBack={handleBackToHome}
              onComplete={handleChatComplete}
            />
          </ErrorBoundary>
        )}

        {currentScreen === 'report' && (
          <ErrorBoundary>
            <ReportPage onBack={handleBackToHome} reportData={dynamicReport ?? undefined} />
          </ErrorBoundary>
        )}

        {currentScreen === 'admin' && (
          <ErrorBoundary>
            <AdminDashboard onBack={handleBackToHome} />
          </ErrorBoundary>
        )}

        {currentScreen === 'user-center' && (
          <ErrorBoundary>
            <UserCenter onBack={handleBackToHome} onViewReport={handleViewSavedReport} />
          </ErrorBoundary>
        )}

        {currentScreen === 'dashboard' && (
          <ErrorBoundary>
            <GrowthDashboard
              onBack={handleBackToHome}
              dynamicReport={dynamicReport}
              studentInfo={studentInfo}
            />
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App
