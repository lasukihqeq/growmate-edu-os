/**
 * ReportSectionHeader - 报告章节头图组件
 *
 * 功能: 为报告 5 个主章节提供头部装饰区域
 * 特点:
 * - 每个 variant 对应不同的 SVG 装饰图案和品牌色调
 * - 统一高度 120-160px
 * - 标题白色叠加在彩色 SVG 背景上
 * - 使用 Lucide 图标辅助
 */

import { 
  Sparkles, 
  IdCard, 
  TrendingUp, 
  BookOpen, 
  HeartHandshake 
} from 'lucide-react'

/** 章节类型 */
export type SectionVariant = 'overview' | 'identity' | 'growth' | 'courses' | 'parent'

export interface ReportSectionHeaderProps {
  /** 章节类型 */
  variant: SectionVariant
  /** 章节标题 */
  title: string
  /** 章节副标题 */
  subtitle?: string
  /** 自定义类名 */
  className?: string
}

/** 章节配置 */
const SECTION_CONFIG: Record<SectionVariant, {
  label: string
  color: string
  gradientFrom: string
  gradientTo: string
  icon: React.ComponentType<{ className?: string }>
}> = {
  overview: {
    label: '潜能总览',
    color: '#3B5FD9',
    gradientFrom: '#3B5FD9',
    gradientTo: '#1E40AF',
    icon: Sparkles,
  },
  identity: {
    label: '身份卡',
    color: '#FFB800',
    gradientFrom: '#F59E0B',
    gradientTo: '#D97706',
    icon: IdCard,
  },
  growth: {
    label: '成长路径',
    color: '#0F9D94',
    gradientFrom: '#0F9D94',
    gradientTo: '#0D7377',
    icon: TrendingUp,
  },
  courses: {
    label: '课程推荐',
    color: '#3B82F6',
    gradientFrom: '#3B82F6',
    gradientTo: '#1D4ED8',
    icon: BookOpen,
  },
  parent: {
    label: '家长指导',
    color: '#10B981',
    gradientFrom: '#10B981',
    gradientTo: '#059669',
    icon: HeartHandshake,
  },
}

/** 获取章节专属 SVG 装饰图案 */
function SectionDecoration({ variant }: { variant: SectionVariant }) {
  switch (variant) {
    case 'overview':
      // 蓝色星图/星座连线图案
      return (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 140"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFB800" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFB800" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* 星座连线 */}
          <path
            d="M50,30 L120,60 L80,100 L150,80 L200,40 L250,90 L300,50 L350,85"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          {/* 星星点 */}
          <circle cx="50" cy="30" r="4" fill="url(#starGlow)" />
          <circle cx="120" cy="60" r="3" fill="url(#starGlow)" />
          <circle cx="80" cy="100" r="5" fill="url(#starGlow)" />
          <circle cx="150" cy="80" r="3" fill="url(#starGlow)" />
          <circle cx="200" cy="40" r="6" fill="url(#starGlow)" />
          <circle cx="250" cy="90" r="3" fill="url(#starGlow)" />
          <circle cx="300" cy="50" r="4" fill="url(#starGlow)" />
          <circle cx="350" cy="85" r="5" fill="url(#starGlow)" />
          {/* 额外装饰星 */}
          <circle cx="380" cy="25" r="2" fill="white" opacity="0.6" />
          <circle cx="30" cy="110" r="2" fill="white" opacity="0.5" />
        </svg>
      )

    case 'identity':
      // 金色边框 + 自然叶片图案
      return (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 140"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB800" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* 左侧叶片群 */}
          <path
            d="M20,100 Q40,60 80,70 Q60,90 40,100 Z"
            fill="url(#leafGrad)"
            transform="rotate(-15, 50, 80)"
          />
          <path
            d="M30,110 Q55,70 100,85 Q75,100 50,110 Z"
            fill="url(#leafGrad)"
            transform="rotate(-5, 65, 90)"
          />
          {/* 右侧叶片群 */}
          <path
            d="M380,100 Q360,60 320,70 Q340,90 360,100 Z"
            fill="url(#leafGrad)"
            transform="rotate(15, 350, 80)"
          />
          <path
            d="M370,110 Q345,70 300,85 Q325,100 350,110 Z"
            fill="url(#leafGrad)"
            transform="rotate(5, 335, 90)"
          />
          {/* 装饰圆环 */}
          <circle cx="200" cy="70" r="35" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <circle cx="200" cy="70" r="25" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </svg>
      )

    case 'growth':
      // 向上的流动路径线条
      return (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 140"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="pathGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#0F9D94" stopOpacity="0" />
              <stop offset="100%" stopColor="#0F9D94" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* 向上的流动线条 */}
          <path
            d="M50,130 Q60,100 70,110 Q90,90 100,100 Q120,70 130,80 Q150,50 160,60 Q180,30 200,20"
            fill="none"
            stroke="url(#pathGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M150,130 Q165,100 175,105 Q195,75 205,85 Q225,55 235,60 Q255,35 270,25"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M280,130 Q290,100 300,95 Q320,65 330,70 Q350,40 360,35"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* 终点标记 */}
          <circle cx="200" cy="20" r="5" fill="#0F9D94" />
          <circle cx="270" cy="25" r="4" fill="rgba(255,255,255,0.5)" />
          <circle cx="360" cy="35" r="3" fill="rgba(255,255,255,0.3)" />
        </svg>
      )

    case 'courses':
      // 书本 + 自然元素生长图案
      return (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 140"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* 左侧书本 */}
          <rect x="30" y="80" width="40" height="50" rx="3" fill="url(#bookGrad)" transform="rotate(-10, 50, 105)" />
          <rect x="35" y="80" width="40" height="50" rx="3" fill="rgba(255,255,255,0.15)" transform="rotate(5, 55, 105)" />
          {/* 右侧书本 */}
          <rect x="320" y="80" width="45" height="55" rx="3" fill="url(#bookGrad)" transform="rotate(8, 342, 107)" />
          <rect x="325" y="80" width="40" height="50" rx="3" fill="rgba(255,255,255,0.12)" transform="rotate(-5, 345, 105)" />
          {/* 生长的小树/植物 */}
          <path
            d="M200,130 L200,90 M200,100 Q180,85 170,90 M200,100 Q220,85 230,90 M200,85 Q190,70 185,75 M200,85 Q210,70 215,75"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* 小叶片 */}
          <ellipse cx="170" cy="88" rx="8" ry="5" fill="rgba(255,255,255,0.15)" />
          <ellipse cx="230" cy="88" rx="8" ry="5" fill="rgba(255,255,255,0.15)" />
        </svg>
      )

    case 'parent':
      // 双手托举嫩芽图案
      return (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 140"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="handGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* 左手 */}
          <path
            d="M120,130 Q100,110 110,95 Q125,85 140,95 Q150,105 145,120 Q140,130 130,130 Z"
            fill="url(#handGrad)"
          />
          {/* 右手 */}
          <path
            d="M280,130 Q300,110 290,95 Q275,85 260,95 Q250,105 255,120 Q260,130 270,130 Z"
            fill="url(#handGrad)"
          />
          {/* 中间的嫩芽 */}
          <path
            d="M200,95 L200,50"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* 嫩叶 */}
          <path
            d="M200,70 Q180,55 185,45 Q195,50 200,70"
            fill="rgba(255,255,255,0.25)"
          />
          <path
            d="M200,70 Q220,55 215,45 Q205,50 200,70"
            fill="rgba(255,255,255,0.25)"
          />
          <path
            d="M200,55 Q190,40 195,32 Q202,38 200,55"
            fill="rgba(255,255,255,0.3)"
          />
          <path
            d="M200,55 Q210,40 205,32 Q198,38 200,55"
            fill="rgba(255,255,255,0.3)"
          />
          {/* 爱心装饰 */}
          <path
            d="M50,50 C50,40 60,35 70,40 C80,35 90,40 90,50 C90,60 70,75 70,75 C70,75 50,60 50,50"
            fill="rgba(255,255,255,0.1)"
          />
          <path
            d="M310,50 C310,40 320,35 330,40 C340,35 350,40 350,50 C350,60 330,75 330,75 C330,75 310,60 310,50"
            fill="rgba(255,255,255,0.1)"
          />
        </svg>
      )
  }
}

/**
 * 报告章节头部组件
 */
export function ReportSectionHeader({
  variant,
  title,
  subtitle,
  className = '',
}: ReportSectionHeaderProps) {
  const config = SECTION_CONFIG[variant]
  const Icon = config.icon

  return (
    <div
      className={`relative h-[140px] md:h-[160px] overflow-hidden ${className}`}
      role="banner"
      aria-label={`${title}章节头部`}
    >
      {/* 渐变背景 */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${config.gradientFrom} 0%, ${config.gradientTo} 100%)`,
        }}
      />

      {/* SVG 装饰图案 */}
      <SectionDecoration variant={variant} />

      {/* 右上角光晕 */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: config.color }}
      />

      {/* 内容区域 */}
      <div className="relative z-10 flex items-center h-full px-6 md:px-10">
        <div className="flex items-center gap-4">
          {/* 图标 */}
          <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>

          {/* 文字 */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              {title}
            </h2>
            {subtitle && (
              <p className="text-white/70 text-sm md:text-base mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 底部装饰线 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
          opacity: 0.5,
        }}
      />
    </div>
  )
}

export default ReportSectionHeader
