/**
 * ResumeDialog — 恢复进度对话框
 * 检测到未完成的草稿时弹出，让用户选择继续或重新开始
 */

import { useEffect, useRef } from 'react'
import { RotateCcw, Trash2 } from 'lucide-react'
import type { DraftData } from '../lib/draftManager'
import { getDraftSummary } from '../lib/draftManager'

interface Props {
  draft: DraftData
  onResume: () => void
  onDiscard: () => void
}

export function ResumeDialog({ draft, onResume, onDiscard }: Props) {
  const summary = getDraftSummary(draft)
  const resumeRef = useRef<HTMLButtonElement>(null)

  // 自动聚焦"继续"按钮 + Escape 键关闭
  useEffect(() => {
    resumeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDiscard()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDiscard])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
      aria-describedby="resume-desc"
    >
      <div className="bg-white rounded-[1.5rem] shadow-2xl max-w-sm w-full overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="resume-title" className="text-lg font-bold text-white">
                发现未完成的测评
              </h2>
              <p className="text-sm text-white/80">是否继续上次的进度？</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div
            id="resume-desc"
            className="bg-[#f5f5f7] rounded-xl p-4 mb-5"
          >
            <p className="text-sm text-[#1d1d1f]/70 font-medium">{summary}</p>
          </div>

          <div className="space-y-3">
            <button
              ref={resumeRef}
              onClick={onResume}
              className="w-full py-3.5 bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              继续上次的进度
            </button>
            <button
              onClick={onDiscard}
              className="w-full py-3 border border-black/[0.06] text-[#86868b] font-medium rounded-xl hover:bg-[#f5f5f7] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              重新开始
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
