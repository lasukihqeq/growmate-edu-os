/**
 * React hook: 组件级草稿自动保存
 * 使用 useEffect 定期保存，避免频繁写入
 */

import { useEffect, useRef, useCallback } from 'react'
import { saveDraft, type DraftData } from '../lib/draftManager'

interface UseDraftOptions {
  /** 自动保存间隔（毫秒），默认 3000 */
  interval?: number
  /** 是否启用自动保存 */
  enabled?: boolean
}

/**
 * 组件级草稿自动保存 hook
 * @param getDraftData 回调函数，返回需要保存的草稿数据片段
 * @param deps 依赖数组，当依赖变化时触发保存
 * @param options 配置选项
 */
export function useDraftAutoSave(
  getDraftData: () => Partial<Omit<DraftData, 'savedAt' | 'version'>>,
  deps: unknown[],
  options: UseDraftOptions = {}
) {
  const { interval = 3000, enabled = true } = options
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const getDraftDataRef = useRef(getDraftData)
  getDraftDataRef.current = getDraftData

  const save = useCallback(() => {
    if (!enabled) return
    try {
      const data = getDraftDataRef.current()
      saveDraft(data)
    } catch { /* ignore */ }
  }, [enabled])

  // 依赖变化时触发延迟保存（防抖）
  useEffect(() => {
    if (!enabled) return

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(save, interval)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, save, interval, enabled])

  // 页面关闭/隐藏时立即保存
  useEffect(() => {
    if (!enabled) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        save()
      }
    }
    const handleBeforeUnload = () => save()

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [enabled, save])

  return { saveNow: save }
}
