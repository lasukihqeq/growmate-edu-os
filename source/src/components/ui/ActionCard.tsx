import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'

export interface ActionCardProps {
  /** 标题 */
  title: string
  /** 描述文字 */
  description?: string
  /** 行动按钮文字 */
  actionText: string
  /** 点击回调 */
  onAction: () => void
  /** 图标 */
  icon?: LucideIcon
  /** 图标背景色变体 */
  variant?: 'primary' | 'success' | 'accent'
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
}

const variantStyles = {
  primary: {
    icon: 'bg-ws-primary-bg text-ws-primary',
    border: 'border-l-ws-primary',
    button: 'text-ws-primary hover:bg-ws-primary-bg',
  },
  success: {
    icon: 'bg-ws-success-bg text-ws-success',
    border: 'border-l-ws-success',
    button: 'text-ws-success hover:bg-ws-success-bg',
  },
  accent: {
    icon: 'bg-ws-accent-bg text-ws-accent',
    border: 'border-l-ws-accent',
    button: 'text-ws-accent hover:bg-ws-accent-bg',
  },
}

/**
 * 行动引导卡片组件
 * 
 * 用于"本周3件事"等行动引导场景
 * 支持 icon、variant 变体
 */
export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon: Icon,
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const styles = variantStyles[variant]

  return (
    <div
      className={`
        bg-white rounded-ws-card border border-ws-border-soft border-l-4
        ${styles.border}
        shadow-card p-4
        transition-all duration-200
        ${disabled ? 'opacity-50' : 'hover:shadow-elevated'}
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        {/* 图标 */}
        {Icon && (
          <div
            className={`
              w-10 h-10 rounded-ws-card flex items-center justify-center flex-shrink-0
              ${styles.icon}
            `}
            aria-hidden="true"
          >
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <h4 className="text-title-sm text-ws-text-primary mb-0.5">{title}</h4>
          {description && (
            <p className="text-body-sm text-ws-text-secondary line-clamp-2">{description}</p>
          )}

          {/* 行动按钮 */}
          <button
            type="button"
            onClick={onAction}
            disabled={disabled}
            className={`
              mt-3 inline-flex items-center gap-1.5
              text-body-sm font-medium
              transition-colors duration-150
              min-h-[44px] px-0 py-1
              ${styles.button}
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-label={`${actionText}: ${title}`}
          >
            <span>{actionText}</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActionCard
