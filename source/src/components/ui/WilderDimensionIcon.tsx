/**
 * WilderDimensionIcon - WILDER 六维 SVG 图标组件
 *
 * 功能: WILDER 6 个维度的精美 SVG 图标组件
 * 特点:
 * - 每个维度用纯 SVG path 手绘实现
 * - 线条风格统一、精致，有品牌辨识度
 * - 支持 size / showLabel props
 * - 可用于身份卡、报告页、信息图等多处
 *
 * WILDER 六维度:
 * - W (Wonder/好奇心): 放大镜 + 闪烁星星，色 #3B5FD9
 * - I (Inquiry/探究力): 试管 + 齿轮/灯泡，色 #1e40af
 * - L (Link/连接力): 互联网络节点连线，色 #2563eb
 * - D (Design/设计力): 画笔 + 积木/调色板，色 #3b82f6
 * - E (Expression/表达力): 话筒 + 对话气泡，色 #0F9D94
 * - R (Reflection/反思力): 镜子/书本 + 思考泡泡，色 #5DB8B2
 */

/** WILDER 维度类型 */
export type WilderDimension = 'W' | 'I' | 'L' | 'D' | 'E' | 'R'

/** 图标尺寸 */
export type IconSize = 'sm' | 'md' | 'lg'

export interface WilderDimensionIconProps {
  /** 维度字母 */
  dimension: WilderDimension
  /** 图标尺寸 */
  size?: IconSize
  /** 是否显示维度中文名 */
  showLabel?: boolean
  /** 自定义类名 */
  className?: string
}

/** 维度配置 */
const DIMENSION_CONFIG: Record<WilderDimension, {
  name: string
  color: string
  bgColor: string
}> = {
  W: { name: '好奇心', color: '#3B5FD9', bgColor: 'bg-[#3B5FD9]/10' },
  I: { name: '探究力', color: '#1e40af', bgColor: 'bg-[#1e40af]/10' },
  L: { name: '连接力', color: '#2563eb', bgColor: 'bg-[#2563eb]/10' },
  D: { name: '设计力', color: '#3b82f6', bgColor: 'bg-[#3b82f6]/10' },
  E: { name: '表达力', color: '#0F9D94', bgColor: 'bg-[#0F9D94]/10' },
  R: { name: '反思力', color: '#5DB8B2', bgColor: 'bg-[#5DB8B2]/10' },
}

/** 尺寸映射 */
const SIZE_MAP: Record<IconSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
}

/**
 * W - Wonder/好奇心: 放大镜 + 闪烁星星
 */
function WonderIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 放大镜主体 */}
      <circle
        cx="20"
        cy="20"
        r="12"
        stroke={color}
        strokeWidth="3"
        fill="none"
      />
      {/* 放大镜手柄 */}
      <path
        d="M29 29L38 38"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* 星星1 - 放大镜内 */}
      <path
        d="M16 15L17 18L20 19L17 20L16 23L15 20L12 19L15 18L16 15Z"
        fill={color}
        fillOpacity="0.8"
      />
      {/* 星星2 - 右上角 */}
      <path
        d="M36 8L36.5 9.5L38 10L36.5 10.5L36 12L35.5 10.5L34 10L35.5 9.5L36 8Z"
        fill={color}
        fillOpacity="0.6"
      />
      {/* 闪光点 */}
      <circle cx="14" cy="26" r="1.5" fill={color} fillOpacity="0.5" />
    </svg>
  )
}

/**
 * I - Inquiry/探究力: 试管 + 齿轮/灯泡
 */
function InquiryIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 试管 */}
      <path
        d="M16 6V30C16 34.4183 19.5817 38 24 38C28.4183 38 32 34.4183 32 30V6"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* 试管底部圆弧 */}
      <path
        d="M16 30C16 34.4183 19.5817 38 24 38C28.4183 38 32 34.4183 32 30"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* 试管口 */}
      <path
        d="M14 6H34"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* 液体 */}
      <path
        d="M19 18V28C19 31.3137 21.2386 34 24 34C26.7614 34 29 31.3137 29 28V18H19Z"
        fill={color}
        fillOpacity="0.2"
      />
      {/* 齿轮 */}
      <circle cx="38" cy="38" r="5" stroke={color} strokeWidth="2" fill="none" />
      <circle cx="38" cy="38" r="2" fill={color} />
      {/* 齿轮齿 */}
      <path d="M38 32V30M38 46V44M32 38H30M46 38H44M34 34L32.5 32.5M43.5 43.5L42 42M34 42L32.5 43.5M43.5 32.5L42 34" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/**
 * L - Link/连接力: 互联网络节点连线
 */
function LinkIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 连接线 */}
      <path d="M12 12L24 24" stroke={color} strokeWidth="2" strokeOpacity="0.5" />
      <path d="M36 12L24 24" stroke={color} strokeWidth="2" strokeOpacity="0.5" />
      <path d="M12 36L24 24" stroke={color} strokeWidth="2" strokeOpacity="0.5" />
      <path d="M36 36L24 24" stroke={color} strokeWidth="2" strokeOpacity="0.5" />
      <path d="M12 12L36 12" stroke={color} strokeWidth="2" strokeOpacity="0.3" />
      <path d="M12 36L36 36" stroke={color} strokeWidth="2" strokeOpacity="0.3" />
      {/* 中心节点 */}
      <circle cx="24" cy="24" r="6" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
      <circle cx="24" cy="24" r="3" fill={color} />
      {/* 四角节点 */}
      <circle cx="12" cy="12" r="4" fill={color} />
      <circle cx="36" cy="12" r="4" fill={color} />
      <circle cx="12" cy="36" r="4" fill={color} />
      <circle cx="36" cy="36" r="4" fill={color} />
    </svg>
  )
}

/**
 * D - Design/设计力: 画笔 + 积木/调色板
 */
function DesignIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 画笔 */}
      <path
        d="M8 40L14 34L16 36L10 42L8 40Z"
        fill={color}
      />
      <path
        d="M14 34L34 14C36 12 39 12 41 14C43 16 43 19 41 21L21 41L14 34Z"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
      />
      {/* 积木方块 */}
      <rect x="32" y="32" width="10" height="10" rx="2" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" />
      <rect x="36" y="28" width="10" height="10" rx="2" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.15" />
      {/* 调色点 */}
      <circle cx="20" cy="20" r="2" fill="#FFB800" />
      <circle cx="26" cy="17" r="1.5" fill="#10B981" />
      <circle cx="23" cy="25" r="1.5" fill="#F59E0B" />
    </svg>
  )
}

/**
 * E - Expression/表达力: 话筒 + 对话气泡
 */
function ExpressionIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 对话气泡 */}
      <path
        d="M8 10H32C33.1046 10 34 10.8954 34 12V24C34 25.1046 33.1046 26 32 26H20L14 32V26H8C6.89543 26 6 25.1046 6 24V12C6 10.8954 6.89543 10 8 10Z"
        stroke={color}
        strokeWidth="2.5"
        fill={color}
        fillOpacity="0.1"
      />
      {/* 气泡内的点 */}
      <circle cx="14" cy="18" r="2" fill={color} />
      <circle cx="21" cy="18" r="2" fill={color} />
      <circle cx="28" cy="18" r="2" fill={color} />
      {/* 话筒 */}
      <rect
        x="38"
        y="16"
        width="8"
        height="16"
        rx="4"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* 话筒支架 */}
      <path
        d="M34 28V32C34 35.3137 36.6863 38 40 38V38V32"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 声波 */}
      <path d="M44 24H46" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M44 20H47" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M44 28H47" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

/**
 * R - Reflection/反思力: 镜子/书本 + 思考泡泡
 */
function ReflectionIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 书本 */}
      <path
        d="M6 10C6 8.89543 6.89543 8 8 8H20C21.1046 8 22 8.89543 22 10V38C22 39.1046 21.1046 40 20 40H8C6.89543 40 6 39.1046 6 38V10Z"
        stroke={color}
        strokeWidth="2"
        fill={color}
        fillOpacity="0.1"
      />
      <path
        d="M22 10C22 8.89543 22.8954 8 24 8H36C37.1046 8 38 8.89543 38 10V38C38 39.1046 37.1046 40 36 40H24C22.8954 40 22 39.1046 22 38V10Z"
        stroke={color}
        strokeWidth="2"
        fill={color}
        fillOpacity="0.05"
      />
      {/* 书本中线 */}
      <path d="M14 8V40" stroke={color} strokeWidth="1.5" strokeOpacity="0.3" />
      {/* 书页线条 */}
      <path d="M9 14H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M9 18H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M9 22H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
      {/* 思考泡泡 */}
      <circle cx="36" cy="28" r="8" stroke={color} strokeWidth="2" fill="white" />
      <circle cx="30" cy="36" r="3" fill={color} fillOpacity="0.3" />
      <circle cx="26" cy="40" r="2" fill={color} fillOpacity="0.2" />
      {/* 泡泡内的问号/灯泡 */}
      <path
        d="M34 25C34 23.8954 34.8954 23 36 23C37.1046 23 38 23.8954 38 25C38 26.1046 36 27 36 28"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="36" cy="31" r="1" fill={color} />
    </svg>
  )
}

/** 获取对应维度的图标组件 */
function getDimensionIcon(dimension: WilderDimension) {
  const icons: Record<WilderDimension, React.FC<{ size: number; color: string }>> = {
    W: WonderIcon,
    I: InquiryIcon,
    L: LinkIcon,
    D: DesignIcon,
    E: ExpressionIcon,
    R: ReflectionIcon,
  }
  return icons[dimension]
}

/**
 * WILDER 维度图标组件
 */
export function WilderDimensionIcon({
  dimension,
  size = 'md',
  showLabel = false,
  className = '',
}: WilderDimensionIconProps) {
  const config = DIMENSION_CONFIG[dimension]
  const iconSize = SIZE_MAP[size]
  const IconComponent = getDimensionIcon(dimension)

  if (showLabel) {
    return (
      <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
        <div
          className={`${config.bgColor} rounded-xl p-2 flex items-center justify-center`}
          role="img"
          aria-label={`${dimension} - ${config.name}`}
        >
          <IconComponent size={iconSize} color={config.color} />
        </div>
        <span
          className="text-xs font-medium"
          style={{ color: config.color }}
        >
          {dimension}
        </span>
        <span className="text-xs text-gray-500">{config.name}</span>
      </div>
    )
  }

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      role="img"
      aria-label={`${dimension} - ${config.name}`}
    >
      <IconComponent size={iconSize} color={config.color} />
    </div>
  )
}

/** 紧凑型维度图标（带背景圆） */
export function WilderDimensionBadge({
  dimension,
  size = 'md',
  showLabel = false,
  className = '',
}: WilderDimensionIconProps) {
  const config = DIMENSION_CONFIG[dimension]
  const iconSize = SIZE_MAP[size]
  const IconComponent = getDimensionIcon(dimension)

  const containerSize = size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-14 h-14' : 'w-18 h-18'

  return (
    <div className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
      <div
        className={`${containerSize} ${config.bgColor} rounded-full flex items-center justify-center`}
        role="img"
        aria-label={`${dimension} - ${config.name}`}
      >
        <IconComponent size={iconSize * 0.6} color={config.color} />
      </div>
      {showLabel && (
        <span
          className="text-xs font-medium"
          style={{ color: config.color }}
        >
          {config.name}
        </span>
      )}
    </div>
  )
}

/** 所有维度的展示组 */
export function WilderDimensionsGrid({
  size = 'md',
  showLabel = true,
  className = '',
}: Omit<WilderDimensionIconProps, 'dimension'> & { className?: string }) {
  const dimensions: WilderDimension[] = ['W', 'I', 'L', 'D', 'E', 'R']

  return (
    <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
      {dimensions.map((dim) => (
        <WilderDimensionIcon
          key={dim}
          dimension={dim}
          size={size}
          showLabel={showLabel}
        />
      ))}
    </div>
  )
}

export default WilderDimensionIcon
