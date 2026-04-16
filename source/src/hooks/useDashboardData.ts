import type { DynamicReportData } from '../lib/reportContentGenerator'
import type { StudentInfo } from '../types'

export interface DashboardData {
  studentName: string
  talentType: string
  talentDescription: string
  wilderScores: Record<string, number>
  wilderLevels: Record<string, string>
  sortedDims: { key: string; name: string; nameEn: string; score: number; level: string; emoji: string }[]
  topDims: string[]
  bottomDims: string[]
  confidence: number
  profileCode: string
  growthPaths: {
    level: string; name: string; color: string
    goal: string; cycle: string; effort: string; output: string
    tasks: string[]
  }[]
  weeklyPlan: { week: string; task: string; duration: string; output: string; parentScript: string }[]
  fourteenDayPlan: { day: string; task: string; goal: string; duration: string; parentTip: string }[]
  yearlyBlueprint: { quarter: string; theme: string; goals: string[]; milestone: string; color: string }[]
  coreInsight: string
  actionableInsight: string
  aiInsight: string
  hasData: boolean
}

const STORAGE_KEY = 'wilder_assessments'

function loadLatestFromLocalStorage(): DynamicReportData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const list = JSON.parse(raw) as Array<{ reportData?: DynamicReportData }>
    if (!list.length || !list[0].reportData) return null
    return list[0].reportData
  } catch {
    return null
  }
}

function extractDashboardData(report: DynamicReportData, studentInfo?: StudentInfo | null): DashboardData {
  return {
    studentName: studentInfo?.name || report.student?.name || '同学',
    talentType: report.talentType || '未知类型',
    talentDescription: report.talentDescription || '',
    wilderScores: report.wilderScores || {},
    wilderLevels: report.wilderLevels || {},
    sortedDims: (report.sortedDims || []).map(d => ({
      key: d.key,
      name: d.name,
      nameEn: DIM_NAME_EN[d.key] || d.key,
      score: d.score,
      level: d.level,
      emoji: DIM_EMOJI[d.key] || '',
    })),
    topDims: report.topDims || [],
    bottomDims: report.bottomDims || [],
    confidence: report.confidence || 0,
    profileCode: report.profileCode || '',
    growthPaths: report.growthPaths || [],
    weeklyPlan: report.weeklyPlan || [],
    fourteenDayPlan: report.fourteenDayPlan || [],
    yearlyBlueprint: report.yearlyBlueprint || [],
    coreInsight: report.explorer?.coreInsight || '',
    actionableInsight: report.explorer?.actionableInsight || '',
    aiInsight: report.aiInsight || '',
    hasData: true,
  }
}

const DIM_NAME_EN: Record<string, string> = {
  W: 'Wonder', I: 'Inquiry', L: 'Link', D: 'Design', E: 'Expression', R: 'Reflection',
}

const DIM_EMOJI: Record<string, string> = {
  W: '🔭', I: '🔬', L: '🤝', D: '📐', E: '🎤', R: '🪞',
}

const EMPTY: DashboardData = {
  studentName: '', talentType: '', talentDescription: '',
  wilderScores: {}, wilderLevels: {},
  sortedDims: [], topDims: [], bottomDims: [],
  confidence: 0, profileCode: '',
  growthPaths: [], weeklyPlan: [], fourteenDayPlan: [], yearlyBlueprint: [],
  coreInsight: '', actionableInsight: '', aiInsight: '',
  hasData: false,
}

export function useDashboardData(
  dynamicReport?: DynamicReportData | null,
  studentInfo?: StudentInfo | null,
): DashboardData {
  // Priority 1: Props
  if (dynamicReport) {
    return extractDashboardData(dynamicReport, studentInfo)
  }
  // Priority 2: localStorage
  const stored = loadLatestFromLocalStorage()
  if (stored) {
    return extractDashboardData(stored, studentInfo)
  }
  // Priority 3: Empty
  return EMPTY
}
