/**
 * 专业版内容标识组件（已废弃）
 * 统一版本后，这些组件不再显示任何PRO标记，仅透传children
 */

interface ProBadgeProps {
  /** 显示模式（已废弃） */
  variant?: 'badge' | 'banner' | 'inline' | 'lock'
  /** 尺寸（已废弃） */
  size?: 'sm' | 'md' | 'lg'
  /** 自定义文字（已废弃） */
  text?: string
  /** 是否显示图标（已废弃） */
  showIcon?: boolean
  /** 自定义类名（已废弃） */
  className?: string
}

/** 已废弃 - 不再显示PRO标记 */
export function ProBadge(_props: ProBadgeProps) {
  return null
}

/** 专业版内容包装器（已废弃）- 仅透传children */
export function ProContentWrapper({
  children,
  title,
  className = '',
}: {
  children: React.ReactNode
  title?: string
  showBadge?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      {title && <h3 className="text-lg font-bold text-[#0A0A1A] mb-3">{title}</h3>}
      {children}
    </div>
  )
}

/** 专业版分隔线（已废弃）- 不再显示 */
export function ProDivider(_props: { text?: string }) {
  return null
}

export default ProBadge
