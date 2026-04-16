import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ===== GrowMate 统一色彩系统 =====
        'ws-primary': 'var(--ws-primary)',
        'ws-primary-strong': 'var(--ws-primary-strong)',
        'ws-primary-soft': 'var(--ws-primary-soft)',
        'ws-primary-bg': 'var(--ws-primary-bg)',
        'ws-accent': 'var(--ws-accent)',
        'ws-accent-bg': 'var(--ws-accent-bg)',
        'ws-success': 'var(--ws-success)',
        'ws-success-bg': 'var(--ws-success-bg)',
        'ws-warning': 'var(--ws-warning)',
        'ws-warning-bg': 'var(--ws-warning-bg)',
        'ws-danger': 'var(--ws-danger)',

        // 答题流程专用
        'ws-teal': 'var(--ws-teal)',
        'ws-teal-bg': 'var(--ws-teal-bg)',

        // 界面层
        'ws-bg-page': 'var(--ws-bg-page)',
        'ws-bg-card': 'var(--ws-bg-card)',
        'ws-bg-elevated': 'var(--ws-bg-elevated)',
        'ws-border-soft': 'var(--ws-border-soft)',
        'ws-border-medium': 'var(--ws-border-medium)',

        // 文字层
        'ws-text-primary': 'var(--ws-text-primary)',
        'ws-text-secondary': 'var(--ws-text-secondary)',
        'ws-text-muted': 'var(--ws-text-muted)',

        // 分数等级
        'ws-score-high': 'var(--ws-score-high)',
        'ws-score-high-bg': 'var(--ws-score-high-bg)',
        'ws-score-mid': 'var(--ws-score-mid)',
        'ws-score-mid-bg': 'var(--ws-score-mid-bg)',
        'ws-score-low': 'var(--ws-score-low)',
        'ws-score-low-bg': 'var(--ws-score-low-bg)',

        // 报告卡片底色
        'ws-card-insight': 'var(--ws-card-insight-bg)',
        'ws-card-advantage': 'var(--ws-card-advantage-bg)',
        'ws-card-risk': 'var(--ws-card-risk-bg)',
        'ws-card-method': 'var(--ws-card-method-bg)',
      },

      borderRadius: {
        'ws-card': '12px',
        'ws-card-lg': '16px',
        'lg': 'var(--radius)',
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)',
      },

      boxShadow: {
        'soft': '0 1px 4px rgba(15, 23, 42, 0.04)',
        'card': '0 2px 8px rgba(15, 23, 42, 0.06)',
        'elevated': '0 2px 4px rgba(0, 0, 0, 0.03), 0 8px 16px rgba(0, 0, 0, 0.06)',
      },

      fontSize: {
        'title-lg': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
        'title': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'title-sm': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'body': ['0.9375rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.375rem', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.125rem', fontWeight: '400' }],
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      fontFamily: {
        sans: [
          'Space Grotesk', 'Noto Sans SC', 'PingFang SC',
          'HarmonyOS Sans SC', '-apple-system', 'BlinkMacSystemFont', 'sans-serif',
        ],
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'typing-dot': {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-6px)', opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'option-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
        'bounce-owl': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        'wing-flap': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-15deg)' },
          '75%': { transform: 'rotate(15deg)' },
        },
        'leg-run': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(20deg)' },
        },
        'leg-run-alt': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(-20deg)' },
        },
        'dimension-fade': {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        },
      },

      animation: {
        shimmer: 'shimmer 2.5s infinite',
        float: 'float 3s ease-in-out infinite',
        'typing-dot': 'typing-dot 1.2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'option-in': 'option-in 0.3s ease-out both',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        'bounce-owl': 'bounce-owl 0.6s ease-in-out infinite',
        'wing-flap': 'wing-flap 0.4s ease-in-out infinite',
        'leg-run': 'leg-run 0.3s ease-in-out infinite',
        'leg-run-alt': 'leg-run-alt 0.3s ease-in-out infinite 0.15s',
        'dimension-fade': 'dimension-fade 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'float-slow': 'float-slow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
