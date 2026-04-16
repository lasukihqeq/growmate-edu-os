import { type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FloatingSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'placeholder'> {
  label: string
  error?: string
  helperText?: string
  options: { value: string; label: string }[]
}

/**
 * 浮动标签下拉选择器组件
 * - 与 FloatingInput 视觉风格统一
 * - 标签在选中时自动上浮
 * - 支持错误/辅助提示
 */
export function FloatingSelect({
  label,
  error,
  helperText,
  options,
  className = '',
  id,
  value,
  ...props
}: FloatingSelectProps) {
  const selectId = id || `floating-select-${label.replace(/\s+/g, '-').toLowerCase()}`
  const hasValue = value !== '' && value !== undefined

  return (
    <div className="relative">
      <div className="relative">
        <select
          id={selectId}
          value={value}
          className={`
            peer w-full px-4 pt-5 pb-2 text-base appearance-none
            border-2 rounded-2xl
            bg-white dark:bg-ws-bg-card
            text-[#0A0A1A] dark:text-ws-text-primary
            transition-all duration-200
            focus:outline-none
            ${error
              ? 'border-red-400 focus:border-red-500 bg-red-50/30 dark:bg-red-900/10'
              : 'border-[rgba(10,10,26,0.06)] dark:border-ws-border-soft focus:border-teal-400 dark:focus:border-ws-teal focus:bg-teal-50/30 dark:focus:bg-teal-900/10'
            }
            ${className}
          `}
          {...props}
        >
          <option value="" disabled></option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <label
          htmlFor={selectId}
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            text-[rgba(10,10,26,0.35)] dark:text-ws-text-muted
            peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:px-1 peer-focus:bg-white dark:peer-focus:bg-ws-bg-card
            peer-focus:text-[#3B5FD9] dark:peer-focus:text-ws-teal
            ${hasValue
              ? 'top-0 -translate-y-1/2 text-xs px-1 bg-white dark:bg-ws-bg-card'
              : 'top-1/2 -translate-y-1/2 text-base'
            }
            ${error ? 'peer-focus:text-red-500 !text-red-500' : ''}
          `}
        >
          {label}
        </label>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      </div>

      {/* 辅助提示 */}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 px-1">{helperText}</p>
      )}

      {/* 错误提示 */}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 px-1">{error}</p>
      )}
    </div>
  )
}

export default FloatingSelect
