import { useCallback } from 'react'

export type Theme = 'light'

interface UseThemeReturn {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggle: () => void
  isDark: boolean
}

/**
 * 主题 Hook - 固定浅色模式
 * 暗色模式已禁用，始终返回 light
 */
export function useTheme(): UseThemeReturn {
  const setTheme = useCallback((_theme: Theme) => {
    // 确保 DOM 始终为 light 状态
    const root = document.documentElement
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
  }, [])

  const toggle = useCallback(() => {
    // no-op: 仅支持浅色模式
  }, [])

  // 确保初始状态为 light
  if (typeof window !== 'undefined') {
    const root = document.documentElement
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
  }

  return {
    theme: 'light',
    setTheme,
    toggle,
    isDark: false,
  }
}

export default useTheme
