import { useCallback } from 'react'
import { GraduationCap } from 'lucide-react'
import { SearchDropdown } from './SearchDropdown'
import {
  searchSchools,
  getSchoolCategories,
  type SchoolItem,
  type SchoolCategory,
  type SchoolSearchResult,
} from '../../lib/schoolData'
import { getProvinceByCode } from '../../lib/regionData'

export interface SchoolSearchProps {
  value: string              // 学校名称
  onChange: (value: string) => void
  onSelect: (school: SchoolItem | null) => void
  province?: string          // 省份 code，用于地区关联
  city?: string              // 城市 code
  schoolCategory?: string    // 当前选中的学校分类
  onCategoryChange?: (cat: string) => void
  error?: string
  disabled?: boolean
}

/**
 * 学校搜索组件
 * - 自动补全搜索（支持中文名、拼音、首字母匹配）
 * - 学校分类选择（小学/初中/高中/九年一贯制/完全中学）
 * - 地区关联显示
 */
export function SchoolSearch({
  value,
  onChange,
  onSelect,
  province,
  city,
  schoolCategory,
  onCategoryChange,
  error,
  disabled,
}: SchoolSearchProps) {
  const categories = getSchoolCategories()

  const handleSearch = useCallback((query: string): SchoolSearchResult[] => {
    let results = searchSchools(query, 30)

    // 如果有省份筛选，优先显示本省学校
    if (province) {
      const localResults = results.filter(r => r.school.province === province)
      const otherResults = results.filter(r => r.school.province !== province)
      results = [...localResults, ...otherResults]
    }

    // 如果有城市筛选，优先显示本市学校
    if (city) {
      const cityResults = results.filter(r => r.school.city === city)
      const otherResults = results.filter(r => r.school.city !== city)
      // 去重
      const seen = new Set(cityResults.map(r => r.school.id))
      const uniqueOther = otherResults.filter(r => !seen.has(r.school.id))
      results = [...cityResults, ...uniqueOther]
    }

    // 如果有分类筛选
    if (schoolCategory) {
      results = results.filter(r => r.school.category.includes(schoolCategory as SchoolCategory))
    }

    return results
  }, [province, city, schoolCategory])

  const handleSelect = useCallback((result: SchoolSearchResult) => {
    onChange(result.school.name)
    onSelect(result.school)
  }, [onChange, onSelect])

  const renderItem = useCallback((result: SchoolSearchResult, isActive: boolean) => {
    const school = result.school
    const provinceName = province ? getProvinceByCode(province)?.name : undefined

    return (
      <div className="flex items-center gap-2">
        <GraduationCap className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-500' : 'text-slate-400'}`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm truncate">{school.name}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {school.category.map(cat => (
              <span
                key={cat}
                className="inline-block px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
              >
                {cat}
              </span>
            ))}
            {provinceName && school.province === province && (
              <span className="text-[10px] text-teal-500">同地区</span>
            )}
          </div>
        </div>
      </div>
    )
  }, [province])

  return (
    <div className="space-y-2">
      {/* 学校分类选择 */}
      {onCategoryChange && (
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onCategoryChange('')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              !schoolCategory
                ? 'bg-teal-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            全部
          </button>
          {categories.map(cat => (
            <button
              key={cat.value}
              type="button"
              onClick={() => onCategoryChange(cat.value)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                schoolCategory === cat.value
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* 搜索框 */}
      <SearchDropdown<SchoolSearchResult>
        value={value}
        onChange={onChange}
        onSelect={handleSelect}
        onSearch={handleSearch}
        renderItem={renderItem}
        getItemLabel={(r) => r.school.name}
        label="学校名称"
        error={error}
        helperText="输入学校名称或拼音搜索，不在列表中可直接输入"
        disabled={disabled}
        emptyText="未找到匹配学校，可直接输入学校名称"
      />
    </div>
  )
}

export default SchoolSearch
