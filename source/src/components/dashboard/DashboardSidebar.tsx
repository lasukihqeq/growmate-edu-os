import { useState } from 'react'
import { LayoutDashboard, BarChart3, Target, BookOpen, ArrowLeft, Menu, X } from 'lucide-react'

interface SidebarItem {
  id: string
  icon: React.ReactNode
  label: string
}

const NAV_ITEMS: SidebarItem[] = [
  { id: 'overview', icon: <LayoutDashboard size={20} />, label: '总览' },
  { id: 'analysis', icon: <BarChart3 size={20} />, label: '能力分析' },
  { id: 'growth', icon: <Target size={20} />, label: '成长计划' },
  { id: 'resources', icon: <BookOpen size={20} />, label: '学习资源' },
]

interface DashboardSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  onBack: () => void
  studentName?: string
}

export function DashboardSidebar({ activeSection, onSectionChange, onBack, studentName }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-white border border-[var(--ws-border-soft)] flex items-center justify-center"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-white border-r border-[var(--ws-border-soft)]
          flex flex-col w-[220px] transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button (mobile) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 lg:hidden"
        >
          <X size={20} className="text-[var(--ws-text-secondary)]" />
        </button>

        {/* Logo */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0A0A1A] flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--ws-text-primary)]">GrowMate</p>
              <p className="text-[10px] text-[var(--ws-text-muted)]">WILDER Dashboard</p>
            </div>
          </div>
        </div>

        {/* Student name */}
        {studentName && (
          <div className="px-5 pb-4">
            <div className="px-3 py-2 rounded-lg bg-[var(--ws-bg-elevated)]">
              <p className="text-xs text-[var(--ws-text-secondary)]">当前学生</p>
              <p className="text-sm font-medium text-[var(--ws-text-primary)]">{studentName}</p>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-3">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { onSectionChange(item.id); setMobileOpen(false) }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium
                transition-all duration-200
                ${activeSection === item.id
                  ? 'bg-[#0A0A1A] text-white'
                  : 'text-[var(--ws-text-secondary)] hover:bg-[var(--ws-bg-elevated)] hover:text-[var(--ws-text-primary)]'
                }
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Back button */}
        <div className="px-3 pb-6">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-[var(--ws-text-secondary)] hover:bg-[var(--ws-bg-elevated)] hover:text-[var(--ws-text-primary)]
              transition-all duration-200"
          >
            <ArrowLeft size={20} />
            <span>返回首页</span>
          </button>
        </div>
      </aside>
    </>
  )
}
