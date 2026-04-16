import { useEffect, useRef } from 'react'
import type { GamificationState } from '../hooks/useGamification'
import type { Badge } from '../lib/funElements'

/* ========== XP 经验条 ========== */
export function XPBar({ state }: { state: GamificationState }) {
  const { level, xp, xpProgress, lastXPGain, combo } = state

  return (
    <div className="flex items-center gap-2 px-3 py-1.5">
      {/* 等级图标 */}
      <div className="flex items-center gap-1">
        <span className="text-base">{level.icon}</span>
        <span className="text-[10px] font-black text-slate-600 dark:text-ws-text-secondary">Lv.{level.level}</span>
      </div>

      {/* XP进度条 */}
      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700 ease-out relative"
          style={{ width: `${Math.round(xpProgress.progress * 100)}%` }}
        >
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>

      {/* XP数值 */}
      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 tabular-nums min-w-[36px] text-right">
        {xp} XP
      </span>

      {/* XP浮动动画 */}
      {lastXPGain > 0 && (
        <span key={`xp-${xp}`} className="animate-xp-float text-xs font-black text-amber-500">
          +{lastXPGain}
        </span>
      )}

      {/* 连击指示 */}
      {combo >= 2 && (
        <span className="animate-combo-fire text-[10px] font-black text-orange-500 dark:text-orange-400">
          x{combo}
        </span>
      )}
    </div>
  )
}

/* ========== 徽章解锁弹窗 ========== */
export function BadgeUnlockPopup({ badge, onDismiss }: { badge: Badge; onDismiss: () => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    timerRef.current = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timerRef.current)
  }, [onDismiss])

  const rarityColors: Record<string, string> = {
    common: 'from-slate-400 to-slate-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-amber-400 to-orange-500',
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none" aria-live="polite">
      <div
        className="animate-badge-shine pointer-events-auto bg-white dark:bg-ws-bg-card rounded-3xl shadow-2xl p-6 max-w-xs text-center border border-slate-100 dark:border-ws-border"
        onClick={onDismiss}
      >
        <div className="text-sm font-bold text-slate-400 dark:text-ws-text-muted mb-2">徽章解锁!</div>
        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${rarityColors[badge.rarity] ?? rarityColors.common} flex items-center justify-center text-3xl shadow-lg mb-3`}>
          {badge.icon}
        </div>
        <div className="text-lg font-black text-slate-800 dark:text-ws-text-primary">{badge.name}</div>
        <div className="text-xs text-slate-500 dark:text-ws-text-secondary mt-1">{badge.description}</div>
        <div className={`mt-2 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${rarityColors[badge.rarity] ?? rarityColors.common} bg-clip-text text-transparent`}>
          {badge.rarity}
        </div>
      </div>
    </div>
  )
}

/* ========== 升级动画 ========== */
export function LevelUpOverlay({ level, onDismiss }: { level: { title: string; icon: string; level: number }; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none" aria-live="polite">
      <div className="animate-level-up-glow pointer-events-auto text-center" onClick={onDismiss}>
        <div className="text-5xl mb-2">{level.icon}</div>
        <div className="text-lg font-black text-amber-500 dark:text-amber-400">LEVEL UP!</div>
        <div className="text-2xl font-black text-slate-800 dark:text-ws-text-primary">{level.title}</div>
        <div className="text-sm text-slate-500 dark:text-ws-text-secondary mt-1">Lv.{level.level}</div>
      </div>
    </div>
  )
}

/* ========== 徽章墙（小型，嵌入header） ========== */
export function BadgeWallMini({ badges }: { badges: Badge[] }) {
  if (badges.length === 0) return null
  return (
    <div className="flex items-center gap-0.5">
      {badges.slice(-5).map(b => (
        <span key={b.id} className="text-sm" title={b.name}>{b.icon}</span>
      ))}
      {badges.length > 5 && (
        <span className="text-[10px] text-slate-400 dark:text-ws-text-muted font-bold">+{badges.length - 5}</span>
      )}
    </div>
  )
}

/* ========== 连击指示器（大版，覆盖在聊天区域） ========== */
export function ComboIndicator({ combo }: { combo: number }) {
  if (combo < 3) return null
  return (
    <div className="fixed top-20 right-4 z-50 animate-combo-fire pointer-events-none" aria-live="polite">
      <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl px-3 py-2 shadow-lg shadow-orange-500/30">
        <div className="text-[10px] font-bold opacity-80">COMBO</div>
        <div className="text-2xl font-black leading-none">x{combo}</div>
      </div>
    </div>
  )
}

/* ========== 冒险地图（小型进度条版） ========== */
export function AdventureMapMini({
  stages,
  currentStage,
  completedStages,
}: {
  stages: { name: string; icon: React.ComponentType<{ className?: string }> }[]
  currentStage: number
  completedStages: number
}) {
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      {stages.map((s, i) => {
        const Icon = s.icon
        const isDone = i < completedStages
        const isActive = i === currentStage
        return (
          <div key={i} className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                isDone
                  ? 'bg-teal-500 dark:bg-teal-500 text-white scale-100'
                  : isActive
                  ? 'bg-teal-400 dark:bg-teal-400 text-white scale-110 ring-2 ring-teal-200 dark:ring-teal-700'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
              }`}
              title={s.name}
            >
              <Icon className="w-3 h-3" />
            </div>
            {i < stages.length - 1 && (
              <div className={`w-3 h-0.5 transition-all ${isDone ? 'bg-teal-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ========== 阶段过渡动画 ========== */
export function StageTransition({
  stageName,
  stageIcon,
  stageColor,
  onComplete,
}: {
  stageName: string
  stageIcon: string
  stageColor: string
  onComplete: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2500)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none animate-fade-in" aria-live="polite">
      <div className="text-center animate-bounce-in">
        <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${stageColor} flex items-center justify-center text-4xl shadow-xl mb-4`}>
          {stageIcon}
        </div>
        <div className="text-2xl font-black text-white drop-shadow-lg">{stageName}</div>
        <div className="text-sm text-white/70 mt-1">准备进入新关卡...</div>
      </div>
    </div>
  )
}
