import { useState, useRef, useCallback, type ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { useClickOutside } from '../../hooks/useClickOutside'

export interface SearchDropdownProps<T> {
  /** 当前显示的文本值 */
  value: string
  /** 值变化回调 */
  onChange: (value: string) => void
  /** 选中项回调 */
  onSelect: (item: T) => void
  /** 搜索函数 */
  onSearch: (query: string) => T[]
  /** 将搜索结果项渲染为列表项 */
  renderItem: (item: T, isActive: boolean) => ReactNode
  /** 从选中项提取显示文本 */
  getItemLabel: (item: T) => string
  /** 占位标签 */
  label: string
  /** 错误信息 */
  error?: string
  /** 辅助文本 */
  helperText?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义头部内容（如拼音导航条） */
  headerContent?: ReactNode
  /** 空状态文本 */
  emptyText?: string
  /** className */
  className?: string
}

/**
 * 通用搜索下拉组件
 * - 支持自定义搜索函数
 * - 支持键盘导航（上下选择 + Enter确认 + Esc关闭）
 * - 点击外部自动关闭
 * - 支持自定义头部（如拼音导航条）
 */
export function SearchDropdown<T>({
  value,
  onChange,
  onSelect,
  onSearch,
  renderItem,
  getItemLabel,
  label,
  error,
  helperText,
  disabled,
  headerContent,
  emptyText = '无匹配结果',
  className = '',
}: SearchDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<T[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useClickOutside(containerRef, () => {
    setIsOpen(false)
  })

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    onChange(q)
    if (q.trim()) {
      const items = onSearch(q.trim())
      setResults(items)
      setActiveIndex(-1)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [onChange, onSearch])

  const handleSelect = useCallback((item: T) => {
    onChange(getItemLabel(item))
    onSelect(item)
    setIsOpen(false)
    setResults([])
    setActiveIndex(-1)
  }, [onChange, onSelect, getItemLabel])

  const handleFocus = useCallback(() => {
    if (!disabled && value.trim()) {
      const items = onSearch(value.trim())
      setResults(items)
      setIsOpen(items.length > 0)
    }
  }, [disabled, value, onSearch])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < results.length) {
          handleSelect(results[activeIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }, [isOpen, results, activeIndex, handleSelect])

  const handleClear = useCallback(() => {
    onChange('')
    onSelect(null as unknown as T)
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }, [onChange, onSelect])

  // 自动滚动到活动项
  const scrollToActive = useCallback(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`)
      activeEl?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  // 在 activeIndex 变化时滚动
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(scrollToActive)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 输入框 */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder=" "
          className={`
            peer w-full px-4 pt-5 pb-2 text-base pl-10
            border-2 rounded-2xl
            bg-white dark:bg-ws-bg-card
            text-[#0A0A1A] dark:text-ws-text-primary
            placeholder-transparent
            transition-all duration-200
            focus:outline-none
            ${error
              ? 'border-red-400 focus:border-red-500 bg-red-50/30 dark:bg-red-900/10'
              : 'border-[rgba(10,10,26,0.06)] dark:border-ws-border-soft focus:border-teal-400 dark:focus:border-ws-teal focus:bg-teal-50/30 dark:focus:bg-teal-900/10'
            }
          `}
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />

        {/* 清除按钮 */}
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}

        <label
          className={`
            absolute left-10 transition-all duration-200 pointer-events-none
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
      </div>

      {/* 下拉列表 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-64 flex flex-col">
          {/* 自定义头部 */}
          {headerContent}

          {/* 结果列表 */}
          <div ref={listRef} className="overflow-y-auto flex-1">
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                {emptyText}
              </div>
            ) : (
              results.map((item, index) => (
                <div
                  key={index}
                  data-index={index}
                  onClick={() => handleSelect(item)}
                  className={`
                    px-4 py-2.5 cursor-pointer transition-colors text-sm
                    ${activeIndex === index
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }
                  `}
                >
                  {renderItem(item, activeIndex === index)}
                </div>
              ))
            )}
          </div>
        </div>
      )}

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

export default SearchDropdown
