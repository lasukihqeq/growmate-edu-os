import type { TalentTreeData, TalentTreeNode } from '../types/newFeatures'

const WILDER_DIM_CONFIG: Record<string, { name: string; nameEn: string; icon: string; color: string; abilities: string[]; activities: string[] }> = {
  W: {
    name: '好奇心', nameEn: 'Wonder', icon: '🔭', color: '#f59e0b',
    abilities: ['发散性提问', '情境敏感度', '多感官探索'],
    activities: ['科学观察日记', '自然博物馆探索', '每周好奇心挑战'],
  },
  I: {
    name: '探究力', nameEn: 'Inquiry', icon: '🔬', color: '#6366f1',
    abilities: ['假设验证', '变量控制', '证据推理'],
    activities: ['科学实验设计', '数据分析项目', 'STEM竞赛准备'],
  },
  L: {
    name: '连接力', nameEn: 'Link', icon: '🤝', color: '#14b8a6',
    abilities: ['跨学科迁移', '类比思维', '系统整合'],
    activities: ['跨学科读书会', '思维导图训练', '项目式学习PBL'],
  },
  D: {
    name: '设计力', nameEn: 'Design', icon: '📐', color: '#ec4899',
    abilities: ['方案规划', '原型制作', '迭代优化'],
    activities: ['创客工坊', '编程入门', '工程设计挑战'],
  },
  E: {
    name: '表达力', nameEn: 'Expression', icon: '🎤', color: '#8b5cf6',
    abilities: ['结构化表达', '多模态呈现', '说服与影响'],
    activities: ['科学演讲训练', '视频制作', '辩论社团'],
  },
  R: {
    name: '反思力', nameEn: 'Reflection', icon: '🪞', color: '#0ea5e9',
    abilities: ['元认知监控', '策略调整', '自我评估'],
    activities: ['学习复盘日记', '目标管理训练', '正念冥想入门'],
  },
}

export function generateTalentTreeData(
  _wilderScores: Record<string, number>,
  talentType: string,
  sortedDims: { key: string; name: string; score: number }[]
): TalentTreeData {
  const root: TalentTreeNode = {
    id: 'root',
    label: talentType,
    level: 0,
    color: '#1e293b',
    icon: '⭐',
  }

  const dimensions: TalentTreeNode[] = sortedDims.map((dim, _idx) => {
    const config = WILDER_DIM_CONFIG[dim.key]
    if (!config) return { id: dim.key, label: dim.name, level: 1 as const, color: '#64748b', score: dim.score }

    const abilityChildren: TalentTreeNode[] = config.abilities.map((ab, i) => ({
      id: `${dim.key}-ab-${i}`,
      label: ab,
      level: 2 as const,
      color: config.color,
      score: Math.max(40, dim.score - 10 + Math.round(Math.random() * 20)),
      children: config.activities.slice(i, i + 1).map((act, j) => ({
        id: `${dim.key}-act-${i}-${j}`,
        label: act,
        level: 3 as const,
        color: config.color,
        description: `推荐：${act}`,
      })),
    }))

    return {
      id: dim.key,
      label: config.name,
      labelEn: config.nameEn,
      level: 1 as const,
      color: config.color,
      icon: config.icon,
      score: dim.score,
      children: abilityChildren,
    }
  })

  return { root, dimensions }
}
