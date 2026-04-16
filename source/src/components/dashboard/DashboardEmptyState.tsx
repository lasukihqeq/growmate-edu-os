import { ClipboardList } from 'lucide-react'

interface DashboardEmptyStateProps {
  onStartAssessment: () => void
}

export function DashboardEmptyState({ onStartAssessment }: DashboardEmptyStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--ws-bg-page)] p-6">
      <div className="max-w-md text-center">
        {/* Illustration */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-[var(--ws-primary-bg)] flex items-center justify-center">
          <ClipboardList size={40} className="text-[var(--ws-primary)]" />
        </div>

        <h2 className="text-xl font-semibold text-[var(--ws-text-primary)] mb-2">
          还没有测评数据
        </h2>
        <p className="text-sm text-[var(--ws-text-secondary)] mb-8 leading-relaxed">
          完成一次 WILDER 多模态测评后，即可在这里查看你的个性化能力画像和成长计划。
        </p>

        <button
          onClick={onStartAssessment}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold
            text-white bg-[#0A0A1A] hover:bg-[#1a1a2e] transition-colors duration-200"
        >
          开始测评
        </button>
      </div>
    </div>
  )
}
