import { useState, useCallback, useMemo, useRef } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useClickOutside } from '../../hooks/useClickOutside'

export interface BirthdayPickerProps {
  value: string // YYYY-MM-DD
  onChange: (value: string) => void
  error?: string
  helperText?: string
  disabled?: boolean
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

/**
 * 日历弹窗出生日期选择器
 * - 无外部依赖，纯手写日历
 * - 年月快速切换
 * - 4-18岁年龄范围限制
 */
export function BirthdayPicker({ value, onChange, error, helperText, disabled }: BirthdayPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 当前日历显示的年月
  const [viewYear, setViewYear] = useState(() => {
    if (value) return parseInt(value.split('-')[0], 10)
    return new Date().getFullYear() - 10
  })
  const [viewMonth, setViewMonth] = useState(() => {
    if (value) return parseInt(value.split('-')[1], 10) - 1
    return new Date().getMonth()
  })

  useClickOutside(containerRef, () => setIsOpen(false))

  // 年龄范围 → 日期范围
  const today = useMemo(() => new Date(), [])
  const maxDate = useMemo(() => {
    const d = new Date(today)
    d.setFullYear(d.getFullYear() - 4)
    return d
  }, [today])
  const minDate = useMemo(() => {
    const d = new Date(today)
    d.setFullYear(d.getFullYear() - 18)
    return d
  }, [today])

  // 日历网格数据
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    const lastDay = new Date(viewYear, viewMonth + 1, 0)
    const startWeekday = firstDay.getDay()
    const totalDays = lastDay.getDate()

    const days: (number | null)[] = []
    // 前置空白
    for (let i = 0; i < startWeekday; i++) days.push(null)
    // 日期
    for (let i = 1; i <= totalDays; i++) days.push(i)
    // 补全到完整行
    const remaining = 7 - (days.length % 7)
    if (remaining < 7) {
      for (let i = 0; i < remaining; i++) days.push(null)
    }

    return days
  }, [viewYear, viewMonth])

  const formatDate = useCallback((year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }, [])

  const isDateInRange = useCallback((year: number, month: number, day: number): boolean => {
    const date = new Date(year, month, day)
    return date >= minDate && date <= maxDate
  }, [minDate, maxDate])

  const handleDayClick = useCallback((day: number) => {
    if (!isDateInRange(viewYear, viewMonth, day)) return
    const formatted = formatDate(viewYear, viewMonth, day)
    onChange(formatted)
    setIsOpen(false)
  }, [viewYear, viewMonth, isDateInRange, formatDate, onChange])

  const handlePrevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(prev => prev - 1)
    } else {
      setViewMonth(prev => prev - 1)
    }
  }, [viewMonth])

  const handleNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(prev => prev + 1)
    } else {
      setViewMonth(prev => prev + 1)
    }
  }, [viewMonth])

  const handleYearChange = useCallback((delta: number) => {
    setViewYear(prev => prev + delta)
  }, [])

  // 选中日期的解析
  const selectedYear = value ? parseInt(value.split('-')[0], 10) : null
  const selectedMonth = value ? parseInt(value.split('-')[1], 10) - 1 : null
  const selectedDay = value ? parseInt(value.split('-')[2], 10) : null

  // 显示文本
  const displayText = value || ''

  return (
    <div ref={containerRef} className="relative">
      {/* 触发输入框 */}
      <div className="relative">
        <input
          type="text"
          value={displayText}
          readOnly
          disabled={disabled}
          placeholder=" "
          onClick={() => !disabled && setIsOpen(prev => !prev)}
          className={`
            peer w-full px-4 pt-5 pb-2 text-base cursor-pointer
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
        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        <label
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
          出生日期
        </label>
      </div>

      {/* 日历弹窗 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-3">
          {/* 年月导航 */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleYearChange(-1)}
                className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-teal-500 px-1"
              >
                &lt;
              </button>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 min-w-[3rem] text-center">
                {viewYear}年
              </span>
              <button
                type="button"
                onClick={() => handleYearChange(1)}
                className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-teal-500 px-1"
              >
                &gt;
              </button>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 min-w-[2.5rem] text-center">
                {viewMonth + 1}月
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-xs text-slate-400 dark:text-slate-500 py-1 font-medium">
                {d}
              </div>
            ))}
          </div>

          {/* 日期网格 */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="h-8" />
              }

              const inRange = isDateInRange(viewYear, viewMonth, day)
              const isSelected = selectedYear === viewYear && selectedMonth === viewMonth && selectedDay === day
              const isToday = today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  disabled={!inRange}
                  onClick={() => handleDayClick(day)}
                  className={`
                    h-8 w-full flex items-center justify-center text-sm rounded-lg transition-colors
                    ${isSelected
                      ? 'bg-teal-500 text-white font-bold shadow-sm'
                      : inRange
                        ? isToday
                          ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-medium hover:bg-teal-100 dark:hover:bg-teal-900/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    }
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* 快捷年份按钮 */}
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap gap-1 justify-center">
            {Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - 4 - i).map(year => (
              <button
                key={year}
                type="button"
                onClick={() => { setViewYear(year); setViewMonth(0) }}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                  viewYear === year
                    ? 'bg-teal-500 text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {year}
              </button>
            ))}
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

export default BirthdayPicker
