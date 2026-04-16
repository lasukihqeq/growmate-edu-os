/**
 * ReportCoverBg - 报告封面 SVG 背景装饰组件
 *
 * 功能: 为报告页封面提供柔和的抽象波浪背景
 * 特点:
 * - 柔和的抽象波浪曲线 + 圆形光晕效果
 * - 品牌蓝 #3B5FD9（主色调）+ 暖黄 #FFB800（点缀光晕）
 * - 多层半透明渐变叠加，营造温暖专业的教育报告感
 * - CSS animation 实现微妙的浮动/呼吸动效
 * - 避免编程/科技风格，保持教育人文气质
 */

export interface ReportCoverBgProps {
  /** 自定义类名 */
  className?: string
  /** 是否显示动画效果 */
  animated?: boolean
  /** 光晕强度: 'subtle' | 'normal' | 'strong' */
  glowIntensity?: 'subtle' | 'normal' | 'strong'
}

/**
 * 报告封面背景组件
 * 使用纯 SVG + CSS 实现轻量级装饰背景
 */
export function ReportCoverBg({
  className = '',
  animated = true,
  glowIntensity = 'normal',
}: ReportCoverBgProps) {
  const glowOpacity = {
    subtle: 0.15,
    normal: 0.25,
    strong: 0.4,
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* 基础渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3B5FD9] via-[#2B4FB8] to-[#1E3A8A]" />

      {/* SVG 波浪层 1 - 底层大波浪 */}
      <svg
        className={`absolute w-full h-full ${animated ? 'animate-wave-slow' : ''}`}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B5FD9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M0,600 C200,550 400,650 600,600 C800,550 1000,620 1200,580 C1350,560 1440,600 1440,600 L1440,900 L0,900 Z"
          fill="url(#wave1)"
        />
      </svg>

      {/* SVG 波浪层 2 - 中层波浪 */}
      <svg
        className={`absolute w-full h-full ${animated ? 'animate-wave-medium' : ''}`}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animationDelay: '0.5s' }}
      >
        <defs>
          <linearGradient id="wave2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5B7FE9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B5FD9" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M0,500 C180,450 350,520 550,480 C750,440 950,490 1150,460 C1300,440 1440,480 1440,480 L1440,900 L0,900 Z"
          fill="url(#wave2)"
        />
      </svg>

      {/* SVG 波浪层 3 - 顶层轻柔波浪 */}
      <svg
        className={`absolute w-full h-full ${animated ? 'animate-wave-fast' : ''}`}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animationDelay: '1s' }}
      >
        <defs>
          <linearGradient id="wave3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFB800" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#3B5FD9" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFB800" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <path
          d="M0,400 C160,370 320,420 480,390 C640,360 800,400 960,380 C1120,360 1280,390 1440,370 L1440,900 L0,900 Z"
          fill="url(#wave3)"
        />
      </svg>

      {/* 暖黄光晕 1 - 右上角 */}
      <div
        className={`absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FFB800] blur-3xl ${animated ? 'animate-glow-pulse' : ''}`}
        style={{ opacity: glowOpacity[glowIntensity] }}
      />

      {/* 暖黄光晕 2 - 左下角 */}
      <div
        className={`absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#FFB800] blur-3xl ${animated ? 'animate-glow-pulse' : ''}`}
        style={{ opacity: glowOpacity[glowIntensity] * 0.6, animationDelay: '1.5s' }}
      />

      {/* 蓝色光晕 - 中间偏左 */}
      <div
        className={`absolute top-1/3 -left-16 w-72 h-72 rounded-full bg-[#60A5FA] blur-3xl ${animated ? 'animate-glow-pulse' : ''}`}
        style={{ opacity: glowOpacity[glowIntensity] * 0.5, animationDelay: '0.8s' }}
      />

      {/* 装饰圆形元素 */}
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="circleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB800" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFB800" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 右侧装饰圆 */}
        <circle
          cx="1300"
          cy="200"
          r="80"
          fill="url(#circleGlow)"
          className={animated ? 'animate-float-slow' : ''}
        />

        {/* 左侧装饰圆 */}
        <circle
          cx="150"
          cy="700"
          r="60"
          fill="url(#circleGlow)"
          className={animated ? 'animate-float-slow' : ''}
          style={{ animationDelay: '2s' }}
        />

        {/* 小装饰点 */}
        <circle cx="1200" cy="350" r="4" fill="#FFB800" opacity="0.5" />
        <circle cx="200" cy="200" r="3" fill="#FFB800" opacity="0.4" />
        <circle cx="800" cy="750" r="5" fill="#60A5FA" opacity="0.3" />
      </svg>

      {/* 柔和的顶部渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
    </div>
  )
}

export default ReportCoverBg
