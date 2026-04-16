// 兴趣班选择器 v2 - 轻量标签式交互
// 交互流程：点分类 → 显示子项 → 点子项 toggle 选中 → 选中项底部展示为标签
// 点击标签可展开编辑时长/满意度（非强制）

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import type { InterestClass, DurationRange, SatisfactionLevel } from '../types'
import { INTEREST_CATEGORIES, DURATION_OPTIONS, SATISFACTION_OPTIONS, getCategoryById } from '../lib/interestCategories'

interface Props {
  value: InterestClass[]
  onChange: (interests: InterestClass[]) => void
}

export function InterestClassPicker({ value, onChange }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [editingName, setEditingName] = useState<string | null>(null)
  const [customInput, setCustomInput] = useState('')

  // ---- 增删操作 ----

  const toggleInterest = (category: string, name: string) => {
    const existing = value.findIndex(v => v.name === name)
    if (existing >= 0) {
      onChange(value.filter((_, i) => i !== existing))
      if (editingName === name) setEditingName(null)
    } else {
      onChange([...value, {
        category,
        name,
        duration: 'less_half_year',
        satisfaction: 'okay',
        isCustom: false,
      }])
      setEditingName(name)
    }
  }

  const removeInterest = (name: string) => {
    onChange(value.filter(v => v.name !== name))
    if (editingName === name) setEditingName(null)
  }

  const updateField = (name: string, field: 'duration' | 'satisfaction', val: DurationRange | SatisfactionLevel) => {
    onChange(value.map(item => item.name === name ? { ...item, [field]: val } : item))
  }

  const handleAddCustom = () => {
    const trimmed = customInput.trim()
    if (!trimmed || trimmed.length > 15 || value.some(v => v.name === trimmed)) return
    onChange([...value, {
      category: 'other',
      name: trimmed,
      duration: 'less_half_year',
      satisfaction: 'okay',
      isCustom: true,
    }])
    setCustomInput('')
    setEditingName(trimmed)
  }

  const isSelected = (name: string) => value.some(v => v.name === name)
  const activeCat = INTEREST_CATEGORIES.find(c => c.id === activeCategory)

  return (
    <div className="space-y-4">
      {/* 1. 分类网格 - 点击切换展开 */}
      <div className="grid grid-cols-3 gap-2">
        {INTEREST_CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id
          const count = value.filter(v => v.category === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(isActive ? null : cat.id)}
              className={`relative px-2 py-2.5 rounded-xl text-xs font-medium transition-all text-center
                ${isActive
                  ? 'bg-[#3B5FD9] dark:bg-[#3B5FD9] text-white shadow-md shadow-[rgba(59,95,217,0.2)]/20'
                  : 'bg-gray-50 dark:bg-ws-bg-card text-gray-600 dark:text-ws-text-secondary border-2 border-transparent hover:bg-gray-100 dark:hover:bg-ws-bg-elevated active:scale-95'
                }`}
            >
              <span className="text-base block mb-0.5">{cat.emoji}</span>
              {cat.label}
              {count > 0 && !isActive && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#3B5FD9] dark:bg-teal-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none min-w-[18px] h-[18px]">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 2. 子项区域 - 分类展开时显示 */}
      {activeCat && (
        <div className="bg-[rgba(59,95,217,0.04)] dark:bg-ws-bg-elevated rounded-xl p-3 border border-[rgba(10,10,26,0.04)] dark:border-ws-border animate-in fade-in slide-in-from-top-2 duration-200">
          {activeCategory === 'other' ? (
            // 其他分类：自定义输入
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
                placeholder="输入兴趣班名称"
                maxLength={15}
                className="flex-1 px-3 py-2 rounded-lg border border-[rgba(10,10,26,0.06)] dark:border-ws-border text-sm text-[#0A0A1A] placeholder:text-[rgba(10,10,26,0.35)] focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 bg-white dark:bg-ws-bg-card dark:text-ws-text-primary dark:placeholder:text-[rgba(10,10,26,0.5)]"
              />
              <button
                onClick={handleAddCustom}
                disabled={!customInput.trim()}
                className="px-3 py-2 bg-[#3B5FD9] dark:bg-[#2A4CC0] text-white rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-[#2A4CC0] dark:hover:bg-[#3B5FD9] active:scale-95 transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> 添加
              </button>
            </div>
          ) : (
            // 标准分类：子项 chips（点击 toggle）
            <div className="flex flex-wrap gap-2">
              {activeCat.interests.map(name => {
                const selected = isSelected(name)
                return (
                  <button
                    key={name}
                    onClick={() => toggleInterest(activeCategory!, name)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 ${
                      selected
                        ? 'bg-[#3B5FD9] dark:bg-[#3B5FD9] text-white shadow-sm'
                        : 'bg-white dark:bg-ws-bg-card text-gray-600 dark:text-ws-text-secondary border border-[rgba(10,10,26,0.06)] dark:border-ws-border hover:border-teal-300 dark:hover:border-teal-600'
                    }`}
                  >
                    {name}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. 已选标签区 - 紧凑展示所有已选项 */}
      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-[rgba(10,10,26,0.35)] dark:text-ws-text-muted font-medium">
            已选 {value.length} 项（点击可修改详情）
          </p>
          <div className="flex flex-wrap gap-2">
            {value.map(item => {
              const cat = getCategoryById(item.category)
              const isEditing = editingName === item.name
              const satOpt = SATISFACTION_OPTIONS.find(s => s.value === item.satisfaction)
              return (
                <div key={item.name} className="flex flex-col">
                  {/* 标签本体 */}
                  <button
                    onClick={() => setEditingName(isEditing ? null : item.name)}
                    className={`inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 rounded-full text-sm transition-all ${
                      isEditing
                        ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 ring-2 ring-teal-300 dark:ring-teal-600'
                        : 'bg-[rgba(59,95,217,0.06)] dark:bg-ws-bg-elevated text-[rgba(10,10,26,0.6)] dark:text-ws-text-secondary hover:bg-[rgba(59,95,217,0.08)] dark:hover:bg-ws-bg-card'
                    }`}
                  >
                    <span>{cat?.emoji || '✨'}</span>
                    <span className="font-medium">{item.name}</span>
                    {satOpt && !isEditing && (
                      <span className="text-xs opacity-60">{satOpt.emoji}</span>
                    )}
                    <span
                      role="button"
                      onClick={e => { e.stopPropagation(); removeInterest(item.name) }}
                      className="ml-0.5 p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </button>

                  {/* 展开的详情编辑 - 紧凑内联 */}
                  {isEditing && (
                    <div className="mt-1.5 ml-1 p-2.5 bg-white dark:bg-ws-bg-card rounded-xl border border-[rgba(10,10,26,0.04)] dark:border-ws-border shadow-sm space-y-2 animate-in fade-in slide-in-from-top-1 duration-150 max-w-[260px]">
                      <div>
                        <p className="text-[11px] text-[rgba(10,10,26,0.35)] dark:text-ws-text-muted mb-1">学了多久</p>
                        <div className="flex flex-wrap gap-1">
                          {DURATION_OPTIONS.map(d => (
                            <button
                              key={d.value}
                              onClick={() => updateField(item.name, 'duration', d.value)}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                                item.duration === d.value
                                  ? 'bg-[#3B5FD9] dark:bg-[#3B5FD9] text-white'
                                  : 'bg-gray-100 dark:bg-ws-bg-elevated text-gray-500 dark:text-ws-text-muted hover:bg-gray-200 dark:hover:bg-ws-bg-card'
                              }`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] text-[rgba(10,10,26,0.35)] dark:text-ws-text-muted mb-1">孩子感受</p>
                        <div className="flex gap-1">
                          {SATISFACTION_OPTIONS.map(s => (
                            <button
                              key={s.value}
                              onClick={() => updateField(item.name, 'satisfaction', s.value)}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                                item.satisfaction === s.value
                                  ? 'bg-[#3B5FD9] dark:bg-[#3B5FD9] text-white'
                                  : 'bg-gray-100 dark:bg-ws-bg-elevated text-gray-500 dark:text-ws-text-muted hover:bg-gray-200 dark:hover:bg-ws-bg-card'
                              }`}
                            >
                              {s.emoji} {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {value.length === 0 && !activeCategory && (
        <p className="text-xs text-gray-400 dark:text-ws-text-muted text-center">请至少选择 1 个兴趣班，点击上方分类开始选择</p>
      )}
    </div>
  )
}
