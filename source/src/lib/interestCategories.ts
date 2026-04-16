// 兴趣班预设分类数据 + 序列化工具

import type { InterestClass, DurationRange, SatisfactionLevel } from '../types'

export interface InterestCategory {
  id: string
  label: string
  emoji: string
  color: string // tailwind color prefix
  interests: string[]
}

export const INTEREST_CATEGORIES: InterestCategory[] = [
  { id: 'music', label: '音乐类', emoji: '🎵', color: 'violet', interests: ['钢琴', '小提琴', '吉他', '架子鼓', '古筝', '声乐', '尤克里里'] },
  { id: 'sports', label: '体育类', emoji: '⚽', color: 'emerald', interests: ['游泳', '篮球', '足球', '跆拳道', '击剑', '网球', '羽毛球', '滑冰', '体操'] },
  { id: 'coding', label: '编程/科技', emoji: '💻', color: 'blue', interests: ['Scratch编程', 'Python', '机器人', '3D打印', '无人机'] },
  { id: 'art', label: '美术类', emoji: '🎨', color: 'rose', interests: ['素描', '国画', '油画', '陶艺', '书法', '手工'] },
  { id: 'academic', label: '学科类', emoji: '📚', color: 'amber', interests: ['奥数', '英语', '作文', '阅读', '科学实验'] },
  { id: 'language', label: '语言类', emoji: '🌍', color: 'cyan', interests: ['英语口语', '日语', '法语', '演讲与口才', '主持'] },
  { id: 'dance', label: '舞蹈类', emoji: '💃', color: 'pink', interests: ['芭蕾', '中国舞', '拉丁舞', '街舞', '现代舞'] },
  { id: 'chess', label: '棋类/思维', emoji: '♟️', color: 'slate', interests: ['围棋', '国际象棋', '编程思维', '数独'] },
  { id: 'other', label: '其他', emoji: '✨', color: 'gray', interests: [] },
]

export const DURATION_OPTIONS: { value: DurationRange; label: string }[] = [
  { value: 'less_half_year', label: '< 半年' },
  { value: 'half_to_one', label: '半年-1年' },
  { value: 'one_to_two', label: '1-2年' },
  { value: 'more_than_two', label: '2年以上' },
]

export const SATISFACTION_OPTIONS: { value: SatisfactionLevel; label: string; emoji: string }[] = [
  { value: 'love', label: '很喜欢', emoji: '😍' },
  { value: 'okay', label: '还行', emoji: '😊' },
  { value: 'dislike', label: '不太喜欢', emoji: '😐' },
]

export function getDurationLabel(d: DurationRange): string {
  return DURATION_OPTIONS.find(o => o.value === d)?.label || d
}

export function getSatisfactionLabel(s: SatisfactionLevel): string {
  const opt = SATISFACTION_OPTIONS.find(o => o.value === s)
  return opt ? `${opt.emoji}${opt.label}` : s
}

export function getCategoryById(id: string): InterestCategory | undefined {
  return INTEREST_CATEGORIES.find(c => c.id === id)
}

/** 将结构化兴趣列表序列化为可读文本（向后兼容） */
export function serializeInterests(interests: InterestClass[]): string {
  if (!interests.length) return ''
  return interests.map(i => {
    const dur = getDurationLabel(i.duration)
    const sat = SATISFACTION_OPTIONS.find(o => o.value === i.satisfaction)?.label || ''
    return `${i.name}${dur}，${sat}`
  }).join('；')
}
