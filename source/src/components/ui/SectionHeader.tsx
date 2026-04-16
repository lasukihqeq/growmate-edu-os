import React from 'react'
import type { LucideIcon } from 'lucide-react'

export interface SectionHeaderProps {
  /** 章节标题 */
  title: string
  /** 副标题 */
  subtitle?: string
  /** 徽章文字 */
  badge?: string
  /** 标题图标 */
  icon?: LucideIcon
  /** 对齐方式 */
  align?: 'left' | 'center'
  /** 自定义类名 */
  className?: string
}

/**
 * 统一章节标题组件
 * 
 * 使用品牌蓝色调，无渐变
 * 支持 badge、icon、subtitle 等扩展
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  icon: Icon,
  align = 'left',
  className = '',
}) => {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div className={`flex flex-col gap-2 ${alignClass} ${className}`}>
      {/* 标签行 */}
      <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
        {/* 装饰线 */}
        <div className="w-5 h-0.5 bg-ws-primary rounded-full flex-shrink-0" aria-hidden="true" />
        
        {/* 徽章 */}
        {badge && (
          <span className="px-2.5 py-0.5 text-caption font-medium bg-ws-primary-bg text-ws-primary rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* 标题行 */}
      <div className={`flex items-center gap-2.5 ${align === 'center' ? 'justify-center' : ''}`}>
        {Icon && (
          <Icon className="w-6 h-6 text-ws-primary flex-shrink-0" aria-hidden="true" />
        )}
        <h2 className="text-title-lg font-bold text-ws-text-primary">{title}</h2>
      </div>

      {/* 副标题 */}
      {subtitle && (
        <p className="text-body-sm text-ws-text-secondary max-w-2xl">{subtitle}</p>
      )}
    </div>
  )
}

export default SectionHeader
