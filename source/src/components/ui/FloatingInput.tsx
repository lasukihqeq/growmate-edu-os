import { forwardRef, type InputHTMLAttributes } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export interface FloatingInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  label: string
  error?: string
  success?: boolean
  helperText?: string
}

/**
 * 浮动标签输入框组件
 * - 标签在输入时自动上浮
 * - 支持错误状态（红色边框 + 错误信息 + shake动画）
 * - 支持成功状态（绿色边框 + 勾选图标）
 * - 支持深色主题
 */
export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, success, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `floating-input-${label.replace(/\s+/g, '-').toLowerCase()}`

    return (
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          placeholder=" "
          className={`
            peer w-full px-4 pt-5 pb-2 text-base
            border-2 rounded-2xl
            bg-white dark:bg-ws-bg-card
            text-[#0A0A1A] dark:text-ws-text-primary
            placeholder-transparent
            transition-all duration-200
            focus:outline-none
            ${error
              ? 'border-red-400 focus:border-red-500 bg-red-50/30 dark:bg-red-900/10'
              : success
                ? 'border-emerald-400 focus:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10'
                : 'border-[rgba(10,10,26,0.06)] dark:border-ws-border-soft focus:border-teal-400 dark:focus:border-ws-teal focus:bg-teal-50/30 dark:focus:bg-teal-900/10'
            }
            ${error ? 'animate-shake' : ''}
            ${className}
          `}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            text-[rgba(10,10,26,0.35)] dark:text-ws-text-muted
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
            peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:px-1 peer-focus:bg-white dark:peer-focus:bg-ws-bg-card
            peer-focus:text-[#3B5FD9] dark:peer-focus:text-ws-teal
            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-ws-bg-card
            ${error ? 'peer-focus:text-red-500 peer-[:not(:placeholder-shown)]:text-red-500' : ''}
          `}
        >
          {label}
        </label>

        {/* 成功/错误图标 */}
        {(success || error) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {success && !error && (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            )}
            {error && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}

        {/* 辅助提示文本 */}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 px-1">
            {helperText}
          </p>
        )}

        {/* 错误提示文本 */}
        {error && (
          <p className="mt-1.5 text-xs text-red-500 px-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)

FloatingInput.displayName = 'FloatingInput'

export default FloatingInput
