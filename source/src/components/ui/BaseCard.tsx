import React from 'react'
import type { LucideIcon } from 'lucide-react'

export type BaseCardVariant = 'default' | 'insight' | 'advantage' | 'risk' | 'method'

export interface BaseCardProps {
  /** 卡片变体，决定左侧边框颜色 */
  variant?: BaseCardVariant
  /** 卡片标题 */
  title?: string
  /** 标题图标 */
  icon?: LucideIcon
  /** 子内容 */
  children: React.ReactNode
  /** 是否悬停效果 */
  hoverable?: boolean
  /** 自定义类名 */
  className?: string
  /** 点击事件 */
  onClick?: () => void
}

const variantStyles: Record<BaseCardVariant, { border: string; bg: string }> = {
  default: {
    border: 'border-l-ws-primary',
    bg: 'bg-white',
  },
  insight: {
    border: 'border-l-ws-primary',
    bg: 'bg-ws-card-insight',
  },
  advantage: {
    border: 'border-l-ws-success',
    bg: 'bg-ws-card-advantage',
  },
  risk: {
    border: 'border-l-ws-warning',
    bg: 'bg-ws-card-risk',
  },
  method: {
    border: 'border-l-ws-primary',
    bg: 'bg-ws-card-method',
  },
}

/**
 * 统一卡片容器组件
 * 
 * 支持 5 种变体：default | insight | advantage | risk | method
 * 统一圆角（12px）、阴影（soft）、内边距（1.25rem）
 */
export const BaseCard: React.FC<BaseCardProps> = ({
  variant = 'default',
  title,
  icon: Icon,
  children,
  hoverable = false,
  className = '',
  onClick,
}) => {
  const styles = variantStyles[variant]
  
  const hoverClasses = hoverable
    ? 'transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-card cursor-pointer'
    : ''

  return (
    <div
      className={`
        rounded-ws-card border border-ws-border-soft border-l-4
        ${styles.border} ${styles.bg}
        shadow-soft p-5
        ${hoverClasses}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {title && (
        <div className="flex items-center gap-2 mb-3">
          {Icon && (
            <Icon className="w-5 h-5 text-ws-primary flex-shrink-0" aria-hidden="true" />
          )}
          <h3 className="text-title-sm text-ws-text-primary">{title}</h3>
        </div>
      )}
      <div className="text-body-sm text-ws-text-secondary">{children}</div>
    </div>
  )
}

export default BaseCard
