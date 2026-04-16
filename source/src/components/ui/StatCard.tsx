import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export type StatTrend = 'up' | 'down' | 'neutral'

export interface StatCardProps {
  /** 标签文字 */
  label: string
  /** 数值 */
  value: string | number
  /** 趋势方向 */
  trend?: StatTrend
  /** 趋势描述文字 */
  trendText?: string
  /** 图标 */
  icon?: LucideIcon
  /** 图标背景色变体 */
  iconVariant?: 'primary' | 'success' | 'warning' | 'accent'
  /** 自定义类名 */
  className?: string
}

const iconVariantStyles = {
  primary: 'bg-ws-primary-bg text-ws-primary',
  success: 'bg-ws-success-bg text-ws-success',
  warning: 'bg-ws-warning-bg text-ws-warning',
  accent: 'bg-ws-accent-bg text-ws-accent',
}

const trendColors = {
  up: 'text-ws-success',
  down: 'text-ws-danger',
  neutral: 'text-ws-text-muted',
}

/**
 * 数据统计卡片组件
 * 
 * 用于首页信任指标、报告页数据展示
 * 支持 trend 趋势显示和 icon 图标
 */
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendText,
  icon: Icon,
  iconVariant = 'primary',
  className = '',
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const showTrend = trend && trendText

  return (
    <div
      className={`
        bg-white rounded-ws-card border border-ws-border-soft
        shadow-soft p-4 min-h-[44px]
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        {/* 左侧内容 */}
        <div className="flex-1 min-w-0">
          <p className="text-caption text-ws-text-muted mb-1 truncate">{label}</p>
          <p className="text-title text-ws-text-primary font-bold">{value}</p>
          
          {/* 趋势 */}
          {showTrend && (
            <div className={`flex items-center gap-1 mt-1 ${trendColors[trend]}`}>
              <TrendIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="text-caption font-medium">{trendText}</span>
            </div>
          )}
        </div>

        {/* 右侧图标 */}
        {Icon && (
          <div
            className={`
              w-10 h-10 rounded-ws-card flex items-center justify-center flex-shrink-0
              ${iconVariantStyles[iconVariant]}
            `}
            aria-hidden="true"
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
