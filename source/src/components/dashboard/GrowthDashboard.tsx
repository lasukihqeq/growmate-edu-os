import { useDashboardData } from '../../hooks/useDashboardData'
import { DashboardLayout } from './DashboardLayout'
import { DashboardEmptyState } from './DashboardEmptyState'
import type { DynamicReportData } from '../../lib/reportContentGenerator'
import type { StudentInfo } from '../../types'

interface GrowthDashboardProps {
  onBack: () => void
  dynamicReport?: DynamicReportData | null
  studentInfo?: StudentInfo | null
}

export function GrowthDashboard({ onBack, dynamicReport, studentInfo }: GrowthDashboardProps) {
  const data = useDashboardData(dynamicReport, studentInfo)

  if (!data.hasData) {
    return <DashboardEmptyState onStartAssessment={onBack} />
  }

  return <DashboardLayout data={data} onBack={onBack} />
}
