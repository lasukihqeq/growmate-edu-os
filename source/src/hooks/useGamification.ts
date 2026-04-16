import { useState, useCallback, useRef } from 'react'
import {
  type XPLevel,
  BASE_XP_PER_QUESTION,
  getXPLevel, getXPToNextLevel, getComboMultiplier,
} from '../lib/funElements'

export interface GamificationState {
  xp: number
  level: XPLevel
  combo: number
  maxCombo: number
  /** 最近一次获得的XP增量（用于浮动动画） */
  lastXPGain: number
  /** 是否刚升级（用于升级动画） */
  justLeveledUp: boolean
  /** XP进度（到下一级） */
  xpProgress: { current: number; needed: number; progress: number }
  /** 最近解锁的徽章（用于弹窗展示） */
  latestBadge?: { id: string; name: string; icon: string; description: string; category: 'wonder' | 'inquiry' | 'expression' | 'design' | 'reflection' | 'special'; rarity: 'common' | 'rare' | 'epic' | 'legendary' }
  /** 关闭徽章弹窗 */
  dismissBadge?: () => void
}

export function useGamification() {
  const [xp, setXP] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [lastXPGain, setLastXPGain] = useState(0)
  const [justLeveledUp, setJustLeveledUp] = useState(false)

  const prevLevelRef = useRef(1)

  /** 答题后调用：增加XP、更新连击、检测升级 */
  const onAnswer = useCallback(() => {
    setCombo(prev => {
      const newCombo = prev + 1
      setMaxCombo(mc => Math.max(mc, newCombo))
      return newCombo
    })

    setXP(prev => {
      const multiplier = getComboMultiplier(combo + 1)
      const gain = Math.round(BASE_XP_PER_QUESTION * multiplier)
      setLastXPGain(gain)

      const newXP = prev + gain
      const newLevel = getXPLevel(newXP)
      if (newLevel.level > prevLevelRef.current) {
        setJustLeveledUp(true)
        prevLevelRef.current = newLevel.level
        // 自动清除升级标记
        setTimeout(() => setJustLeveledUp(false), 3000)
      }
      return newXP
    })
  }, [combo])

  /** 清除升级动画标记 */
  const dismissLevelUp = useCallback(() => setJustLeveledUp(false), [])

  /** 关闭徽章弹窗（暂为空操作，待徽章系统接入后实现） */
  const dismissBadge = useCallback(() => {}, [])

  const level = getXPLevel(xp)
  const xpProgress = getXPToNextLevel(xp)

  const state: GamificationState = {
    xp,
    level,
    combo,
    maxCombo,
    lastXPGain,
    justLeveledUp,
    xpProgress,
    dismissBadge,
  }

  return {
    state,
    onAnswer,
    dismissLevelUp,
    dismissBadge,
  }
}
