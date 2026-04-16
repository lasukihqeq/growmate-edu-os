/**
 * GROWMATE品牌LOGO组件
 * 根据背景色自动选择合适的LOGO版本
 *
 * LOGO使用规范：
 * - 蓝色背景（深色）：使用 wilder-logo-blue.png（黄色LOGO+黄色文字）
 * - 黄色背景：使用 wilder-logo-yellow.png（蓝色LOGO+蓝色文字）
 * - 浅色/白色背景：使用 wilder-logo-dark.png（蓝色LOGO+蓝色文字，透明底）
 */

interface WilderLogoProps {
  /** LOGO变体
   * - auto: 自动判断（默认）
   * - blue: 蓝色背景用（黄色LOGO）
   * - yellow: 黄色背景用（蓝色LOGO）
   * - light: 浅色背景用（蓝色LOGO透明底）
   */
  variant?: 'auto' | 'blue' | 'yellow' | 'light'
  /** 尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** 自定义类名 */
  className?: string
  /** 点击事件 */
  onClick?: () => void
  /** 是否显示装饰光晕 */
  showGlow?: boolean
}

const SIZE_CONFIG = {
  xs: { height: 'h-6', maxWidth: 'max-w-[120px]' },
  sm: { height: 'h-8', maxWidth: 'max-w-[160px]' },
  md: { height: 'h-10', maxWidth: 'max-w-[200px]' },
  lg: { height: 'h-12', maxWidth: 'max-w-[240px]' },
  xl: { height: 'h-16', maxWidth: 'max-w-[280px]' },
  '2xl': { height: 'h-20', maxWidth: 'max-w-[320px]' },
}

const LOGO_SOURCES = {
  blue: '/images/wilder-logo-blue.png',      // 蓝底黄字 - 用于深色背景
  yellow: '/images/wilder-logo-yellow.png',  // 黄底蓝字 - 用于黄色背景
  light: '/images/wilder-logo-dark.png',     // 透明底蓝字 - 用于浅色背景
}

export function WilderLogo({
  variant = 'auto',
  size = 'md',
  className = '',
  onClick,
  showGlow = false,
}: WilderLogoProps) {
  const config = SIZE_CONFIG[size]

  // auto模式默认使用浅色背景版本
  const logoSrc = LOGO_SOURCES[variant === 'auto' ? 'light' : variant]

  return (
    <div
      className={`flex items-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <div className={`relative ${showGlow ? 'animate-logo-glow' : ''}`}>
        {/* 光晕效果 */}
        {showGlow && (
          <div className="absolute inset-0 blur-xl opacity-50">
            <img
              src={logoSrc}
              alt=""
              className={`${config.height} ${config.maxWidth} w-auto object-contain`}
              aria-hidden="true"
            />
          </div>
        )}
        {/* 主LOGO */}
        <img
          src={logoSrc}
          alt="GROWMATE"
          className={`${config.height} ${config.maxWidth} w-auto object-contain relative z-10 transition-transform duration-300 ${onClick ? 'hover:scale-105' : ''}`}
        />
      </div>
    </div>
  )
}

/** 紧凑型LOGO（用于导航栏等空间受限场景） */
export function WilderLogoCompact({
  variant = 'auto',
  size = 'md',
  className = '',
  onClick,
}: Omit<WilderLogoProps, 'showGlow'>) {
  const config = SIZE_CONFIG[size]
  const logoSrc = LOGO_SOURCES[variant === 'auto' ? 'light' : variant]

  return (
    <div className={`flex items-center ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick}>
      <img
        src={logoSrc}
        alt="GROWMATE"
        className={`${config.height} w-auto object-contain transition-all duration-300 ${onClick ? 'hover:brightness-110' : ''}`}
      />
    </div>
  )
}

/** 居中展示LOGO（用于登录页等场景） */
export function WilderLogoHero({
  variant = 'blue',
  size = 'xl',
  className = '',
  showGlow = true,
}: WilderLogoProps) {
  const config = SIZE_CONFIG[size]
  const logoSrc = LOGO_SOURCES[variant === 'auto' ? 'light' : variant]

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* 光晕背景 */}
      {showGlow && (
        <div className="absolute w-48 h-48 bg-brand-yellow-500/20 rounded-full blur-3xl animate-pulse" />
      )}

      {/* LOGO容器 */}
      <div className="relative">
        {/* 外圈装饰 */}
        <div className="absolute -inset-4 rounded-full border border-white/10" />

        {/* LOGO */}
        <img
          src={logoSrc}
          alt="GROWMATE"
          className={`${config.height} ${config.maxWidth} w-auto object-contain relative z-10 drop-shadow-2xl`}
        />
      </div>
    </div>
  )
}

/** 报告页头部LOGO（蓝底场景专用） */
export function WilderLogoReport({ studentName }: { studentName?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {/* 微光效果 */}
        <div className="absolute inset-0 blur-md opacity-30">
          <img
            src={LOGO_SOURCES.blue}
            alt=""
            className="h-10 w-auto object-contain"
            aria-hidden="true"
          />
        </div>
        <img
          src={LOGO_SOURCES.blue}
          alt="GROWMATE"
          className="h-10 w-auto object-contain relative z-10"
        />
      </div>
      {studentName && (
        <div className="ml-auto hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
          <span className="text-white/60 text-sm">测评对象</span>
          <span className="text-white font-bold">{studentName}</span>
        </div>
      )}
    </div>
  )
}

export default WilderLogo
