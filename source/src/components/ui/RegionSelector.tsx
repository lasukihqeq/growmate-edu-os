import { useState, useCallback, useMemo } from 'react'
import { MapPin, ChevronRight } from 'lucide-react'
import {
  PROVINCES,
  getCitiesByProvince,
  getDistrictsByCity,
  getAvailableInitials,
  getProvincesByInitial,
  getProvinceByCode,
  getCityByCode,
  getDistrictByCode,
  type RegionValue,
} from '../../lib/regionData'

export interface RegionSelectorProps {
  value: RegionValue
  onChange: (value: RegionValue) => void
  error?: string
  disabled?: boolean
}

/**
 * 省市区三级联动选择器
 * - 省份支持拼音首字母快速导航
 * - 三级联动：选省份 → 加载城市 → 选城市 → 加载区县
 * - 显示当前已选地区的面包屑路径
 */
export function RegionSelector({ value, onChange, error, disabled }: RegionSelectorProps) {
  const [step, setStep] = useState<'province' | 'city' | 'district'>(value.province ? (value.city ? 'district' : 'city') : 'province')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeInitial, setActiveInitial] = useState<string | null>(null)

  const availableInitials = useMemo(() => getAvailableInitials(), [])

  // 根据当前步骤获取列表
  const currentList = useMemo(() => {
    if (step === 'province') {
      if (activeInitial) return getProvincesByInitial(activeInitial)
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return PROVINCES.filter(p =>
          p.name.includes(searchQuery) || p.pinyin.includes(q) || p.initial === q.toUpperCase()
        )
      }
      return PROVINCES
    }
    if (step === 'city') {
      const cities = getCitiesByProvince(value.province!)
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return cities.filter(c =>
          c.name.includes(searchQuery) || c.pinyin.includes(q)
        )
      }
      return cities
    }
    if (step === 'district') {
      const districts = getDistrictsByCity(value.city!)
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return districts.filter(d =>
          d.name.includes(searchQuery) || d.pinyin.includes(q)
        )
      }
      return districts
    }
    return []
  }, [step, searchQuery, activeInitial, value.province, value.city])

  const handleSelectProvince = useCallback((code: string) => {
    onChange({ province: code, city: undefined, district: undefined })
    setSearchQuery('')
    setActiveInitial(null)
    // 检查是否有城市数据
    const cities = getCitiesByProvince(code)
    if (cities.length > 0) {
      setStep('city')
    }
  }, [onChange])

  const handleSelectCity = useCallback((code: string) => {
    onChange({ ...value, city: code, district: undefined })
    setSearchQuery('')
    setActiveInitial(null)
    // 检查是否有区县数据
    const districts = getDistrictsByCity(code)
    if (districts.length > 0) {
      setStep('district')
    }
  }, [onChange, value])

  const handleSelectDistrict = useCallback((code: string) => {
    onChange({ ...value, district: code })
    setSearchQuery('')
    setActiveInitial(null)
  }, [onChange, value])

  const handleStepBack = useCallback(() => {
    if (step === 'district') {
      onChange({ ...value, district: undefined })
      setStep('city')
    } else if (step === 'city') {
      onChange({ province: undefined, city: undefined, district: undefined })
      setStep('province')
    }
    setSearchQuery('')
    setActiveInitial(null)
  }, [step, value, onChange])

  // 显示已选地区名称
  const displayText = useMemo(() => {
    const parts: string[] = []
    if (value.province) {
      const p = getProvinceByCode(value.province)
      if (p) parts.push(p.name)
    }
    if (value.city) {
      const c = getCityByCode(value.city)
      if (c) parts.push(c.name)
    }
    if (value.district) {
      const d = getDistrictByCode(value.district)
      if (d) parts.push(d.name)
    }
    return parts.join(' / ')
  }, [value])

  const stepLabels = { province: '选择省份', city: '选择城市', district: '选择区县' }

  return (
    <div>
      {/* 已选地区显示 + 面包屑 */}
      {displayText && (
        <div className="mb-2 flex items-center gap-1.5 text-sm text-teal-600 dark:text-teal-400">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{displayText}</span>
          <button
            type="button"
            onClick={() => {
              onChange({ province: undefined, city: undefined, district: undefined })
              setStep('province')
              setSearchQuery('')
              setActiveInitial(null)
            }}
            className="ml-1 text-xs text-slate-400 hover:text-red-400 transition-colors underline"
          >
            重选
          </button>
        </div>
      )}

      <div className={`rounded-2xl border-2 overflow-hidden transition-all ${
        error ? 'border-red-400' : 'border-[rgba(10,10,26,0.06)] dark:border-ws-border-soft'
      }`}>
        {/* 头部：标题 + 返回 */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            {step !== 'province' && (
              <button
                type="button"
                onClick={handleStepBack}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline"
              >
                返回
              </button>
            )}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {stepLabels[step]}
            </span>
          </div>
          {step === 'province' && value.province && (
            <span className="text-xs text-slate-400">已选：{getProvinceByCode(value.province)?.name}</span>
          )}
        </div>

        {/* 拼音导航条（仅省份步骤显示） */}
        {step === 'province' && (
          <div className="flex flex-wrap gap-0.5 px-3 py-2 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/50">
            <button
              type="button"
              onClick={() => { setActiveInitial(null); setSearchQuery('') }}
              className={`px-1.5 py-0.5 text-xs rounded transition-colors ${
                !activeInitial
                  ? 'bg-teal-500 text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              全部
            </button>
            {availableInitials.map(initial => (
              <button
                key={initial}
                type="button"
                onClick={() => { setActiveInitial(activeInitial === initial ? null : initial); setSearchQuery('') }}
                className={`px-1.5 py-0.5 text-xs rounded transition-colors ${
                  activeInitial === initial
                    ? 'bg-teal-500 text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {initial}
              </button>
            ))}
          </div>
        )}

        {/* 搜索框 */}
        <div className="px-3 py-2 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/50">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`搜索${step === 'province' ? '省份' : step === 'city' ? '城市' : '区县'}...`}
            disabled={disabled}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-teal-400"
          />
        </div>

        {/* 列表 */}
        <div className="max-h-48 overflow-y-auto bg-white dark:bg-slate-800">
          {currentList.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              无匹配结果
            </div>
          ) : (
            currentList.map(item => {
              const isSelected =
                (step === 'province' && value.province === item.code) ||
                (step === 'city' && value.city === item.code) ||
                (step === 'district' && value.district === item.code)

              return (
                <button
                  key={item.code}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (step === 'province') handleSelectProvince(item.code)
                    else if (step === 'city') handleSelectCity(item.code)
                    else handleSelectDistrict(item.code)
                  }}
                  className={`
                    w-full text-left px-4 py-2.5 text-sm flex items-center justify-between
                    transition-colors
                    ${isSelected
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <span>{item.name}</span>
                  {isSelected && <span className="text-teal-500 text-xs">已选</span>}
                  {!isSelected && (step === 'province' || step === 'city') && (
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 px-1">{error}</p>
      )}
    </div>
  )
}

export default RegionSelector
