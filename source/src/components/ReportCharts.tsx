// 报告可视化图表组件
// 包含雷达图、柱状图、饼图、趋势图等

import { useEffect, useRef } from 'react'
import { toPercentileBand } from '../lib/ageNormativeScoring'

// ========== 类型定义 ==========
export interface WilderScore {
  W: number
  I: number
  L: number
  D: number
  E: number
  R: number
}

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

// ========== 交互式雷达图 ==========
interface RadarChartProps {
  scores: WilderScore
  size?: number
  showLabels?: boolean
  animated?: boolean
  compareScores?: WilderScore // 用于对比展示
}

export function InteractiveRadarChart({
  scores,
  size = 300,
  showLabels = true,
  animated = true,
  compareScores
}: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 品牌蓝到Teal色系梯度配色（与落地页VI统一）
  const dimensions = [
    { key: 'W', name: '好奇心', nameEn: 'Wonder', color: '#3B5FD9' },      // 品牌蓝
    { key: 'I', name: '探究力', nameEn: 'Inquiry', color: '#1e40af' },     // 蓝-深
    { key: 'L', name: '连接力', nameEn: 'Link', color: '#2563eb' },        // 蓝-中
    { key: 'D', name: '设计力', nameEn: 'Design', color: '#3b82f6' },      // 蓝-亮
    { key: 'E', name: '表达力', nameEn: 'Expression', color: '#0F9D94' },  // Teal 强调
    { key: 'R', name: '反思力', nameEn: 'Reflection', color: '#5DB8B2' },  // Teal 浅
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 高清屏幕适配 - 使用设备像素比
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.35
    const numSides = 6

    // 清空画布
    ctx.clearRect(0, 0, size, size)

    // 绘制背景网格
    const levels = 5
    for (let level = 1; level <= levels; level++) {
      ctx.beginPath()
      for (let i = 0; i <= numSides; i++) {
        const angle = (Math.PI * 2 * i) / numSides - Math.PI / 2
        const r = (radius * level) / levels
        const x = centerX + r * Math.cos(angle)
        const y = centerY + r * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = level === levels ? '#d1d5db' : '#e5e7eb'
      ctx.lineWidth = level === levels ? 2.5 : 1
      ctx.stroke()
      
      // 在最外层网格显示刻度值
      if (level === levels) {
        ctx.font = '10px system-ui'
        ctx.fillStyle = '#9CA3AF'
        ctx.textAlign = 'right'
        ctx.fillText('100', centerX - 8, centerY - radius + 4)
      }
    }

    // 绘制轴线
    for (let i = 0; i < numSides; i++) {
      const angle = (Math.PI * 2 * i) / numSides - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle))
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // 绘制对比数据（如果有）
    if (compareScores) {
      ctx.beginPath()
      dimensions.forEach((dim, i) => {
        const value = compareScores[dim.key as keyof WilderScore] / 100
        const angle = (Math.PI * 2 * i) / numSides - Math.PI / 2
        const x = centerX + radius * value * Math.cos(angle)
        const y = centerY + radius * value * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.closePath()
      ctx.fillStyle = 'rgba(156, 163, 175, 0.2)'
      ctx.fill()
      ctx.strokeStyle = '#9CA3AF'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])
    }

    // 绘制主数据区域
    ctx.beginPath()
    dimensions.forEach((dim, i) => {
      const value = scores[dim.key as keyof WilderScore] / 100
      const angle = (Math.PI * 2 * i) / numSides - Math.PI / 2
      const x = centerX + radius * value * Math.cos(angle)
      const y = centerY + radius * value * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()

    // 单一品牌蓝半透明填充
    ctx.fillStyle = 'rgba(0, 50, 150, 0.15)'
    ctx.fill()
    
    // 品牌蓝描边（无发光效果）
    ctx.strokeStyle = 'rgba(0, 50, 150, 0.6)'
    ctx.lineWidth = 3
    ctx.stroke()

    // 绘制数据点
    dimensions.forEach((dim, i) => {
      const value = scores[dim.key as keyof WilderScore] / 100
      const angle = (Math.PI * 2 * i) / numSides - Math.PI / 2
      const x = centerX + radius * value * Math.cos(angle)
      const y = centerY + radius * value * Math.sin(angle)
      
      // 绘制实心点
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = dim.color
      ctx.fill()
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // 绘制标签
    if (showLabels) {
      dimensions.forEach((dim, i) => {
        const angle = (Math.PI * 2 * i) / numSides - Math.PI / 2
        const labelRadius = radius + 35
        const x = centerX + labelRadius * Math.cos(angle)
        const y = centerY + labelRadius * Math.sin(angle)

        ctx.font = 'bold 12px system-ui'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = dim.color
        ctx.fillText(dim.key, x, y - 8)

        ctx.font = '10px system-ui'
        ctx.fillStyle = '#6B7280'
        ctx.fillText(dim.name, x, y + 6)

        // 显示分数
        const scoreValue = scores[dim.key as keyof WilderScore]
        ctx.font = 'bold 11px system-ui'
        ctx.fillStyle = '#374151'
        ctx.fillText(scoreValue.toString(), x, y + 20)
      })
    }
  }, [scores, size, showLabels, compareScores, dimensions])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className={`mx-auto ${animated ? 'animate-fade-in' : ''}`}
        style={{ width: size, height: size }}
      />
    </div>
  )
}

// ========== 柱状图组件 ==========
interface BarChartProps {
  data: ChartDataPoint[]
  height?: number
  showPercentile?: boolean
  title?: string
}

export function BarChart({ data, height: _height = 200, showPercentile = true, title }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 100)

  return (
    <div className="w-full">
      {title && <h4 className="font-bold text-gray-700 mb-3 text-sm">{title}</h4>}
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100
          const percentile = Math.round(50 + (item.value - 75) * 2) // 简化的百分位计算
          return (
            <div key={index} className="group">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{item.value}</span>
                  {showPercentile && (
                    <span className="text-xs text-gray-400">Top {Math.max(1, 100 - percentile)}%</span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out group-hover:brightness-110"
                  style={{
                    width: `${percentage}%`,
                    background: item.color || `linear-gradient(90deg, #3B5FD9 0%, #2563eb 100%)`
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ========== 饼图组件 ==========
interface PieChartProps {
  data: ChartDataPoint[]
  size?: number
  title?: string
  showLegend?: boolean
}

export function PieChart({ data, size = 200, title, showLegend = true }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 品牌蓝色系配色方案
  const defaultColors = ['#3B5FD9', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 高清屏幕适配
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.4

    ctx.clearRect(0, 0, size, size)

    let startAngle = -Math.PI / 2

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * Math.PI * 2
      const color = item.color || defaultColors[index % defaultColors.length]

      // 绘制扇形
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()

      // 绘制白色边框
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 3
      ctx.stroke()

      // 绘制标签
      const midAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const x = centerX + labelRadius * Math.cos(midAngle)
      const y = centerY + labelRadius * Math.sin(midAngle)

      if (item.value / total > 0.08) {
        // 绘制标签背景
        const percent = Math.round((item.value / total) * 100)
        ctx.font = 'bold 12px system-ui'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'white'
        ctx.fillText(`${percent}%`, x, y)
      }

      startAngle += sliceAngle
    })

    // 绘制中心圆（环形效果，带渐变）
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.5)
    centerGradient.addColorStop(0, '#ffffff')
    centerGradient.addColorStop(1, '#f8fafc')
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.45, 0, Math.PI * 2)
    ctx.fillStyle = centerGradient
    ctx.fill()
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.stroke()
  }, [data, size, total, defaultColors])

  return (
    <div className="flex flex-col items-center">
      {title && <h4 className="font-bold text-gray-700 mb-3 text-sm">{title}</h4>}
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-3 mt-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || defaultColors[index % defaultColors.length] }}
              />
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ========== 趋势图组件 ==========
interface TrendChartProps {
  data: { label: string; value: number }[]
  height?: number
  title?: string
  color?: string
  showArea?: boolean
}

export function TrendChart({
  data,
  height = 150,
  title,
  color = '#3B82F6',
  showArea = true
}: TrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const width = 400

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 高清屏幕适配
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    const padding = { top: 20, right: 20, bottom: 30, left: 40 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    ctx.clearRect(0, 0, width, height)

    if (data.length === 0) return

    const maxValue = Math.max(...data.map(d => d.value), 100)
    const minValue = Math.min(...data.map(d => d.value), 0)
    const valueRange = maxValue - minValue || 1

    // 计算点的位置
    const points = data.map((d, i) => ({
      x: padding.left + (i / (data.length - 1)) * chartWidth,
      y: padding.top + chartHeight - ((d.value - minValue) / valueRange) * chartHeight
    }))

    // 绘制网格线
    ctx.strokeStyle = '#f3f4f6'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      // Y轴标签
      const value = Math.round(maxValue - (valueRange / 4) * i)
      ctx.font = '10px system-ui'
      ctx.fillStyle = '#9CA3AF'
      ctx.textAlign = 'right'
      ctx.fillText(value.toString(), padding.left - 5, y + 3)
    }

    // 绘制面积
    if (showArea && points.length > 1) {
      ctx.beginPath()
      ctx.moveTo(points[0].x, padding.top + chartHeight)
      points.forEach(p => ctx.lineTo(p.x, p.y))
      ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight)
      ctx.closePath()

      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
      gradient.addColorStop(0, `${color}40`)
      gradient.addColorStop(1, `${color}05`)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // 绘制线条
    if (points.length > 1) {
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    }

    // 绘制数据点
    points.forEach((p, i) => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.stroke()

      // X轴标签
      ctx.font = '9px system-ui'
      ctx.fillStyle = '#6B7280'
      ctx.textAlign = 'center'
      ctx.fillText(data[i].label, p.x, height - 8)
    })
  }, [data, height, color, showArea, width])

  return (
    <div className="w-full">
      {title && <h4 className="font-bold text-gray-700 mb-3 text-sm">{title}</h4>}
      <canvas ref={canvasRef} style={{ width, height }} className="w-full" />
    </div>
  )
}

// ========== 对比图组件 ==========
interface ComparisonChartProps {
  leftData: { label: string; value: number }[]
  rightData: { label: string; value: number }[]
  leftTitle: string
  rightTitle: string
  leftColor?: string
  rightColor?: string
}

export function ComparisonChart({
  leftData,
  rightData,
  leftTitle,
  rightTitle,
  leftColor = '#3B82F6',
  rightColor = '#9CA3AF'
}: ComparisonChartProps) {
  const maxValue = Math.max(
    ...leftData.map(d => d.value),
    ...rightData.map(d => d.value),
    100
  )

  return (
    <div className="w-full">
      <div className="flex justify-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: leftColor }} />
          <span className="text-sm text-gray-600">{leftTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rightColor }} />
          <span className="text-sm text-gray-600">{rightTitle}</span>
        </div>
      </div>
      <div className="space-y-3">
        {leftData.map((item, index) => {
          const rightValue = rightData[index]?.value || 0
          const leftPct = (item.value / maxValue) * 100
          const rightPct = (rightValue / maxValue) * 100

          return (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-600">{item.label}</span>
                <span className="text-gray-500">
                  <span style={{ color: leftColor }}>{item.value}</span>
                  <span className="mx-1">/</span>
                  <span style={{ color: rightColor }}>{rightValue}</span>
                </span>
              </div>
              <div className="flex gap-1 h-2">
                <div className="flex-1 bg-gray-100 rounded-l-full overflow-hidden">
                  <div
                    className="h-full rounded-l-full transition-all duration-500"
                    style={{ width: `${leftPct}%`, backgroundColor: leftColor }}
                  />
                </div>
                <div className="flex-1 bg-gray-100 rounded-r-full overflow-hidden flex justify-end">
                  <div
                    className="h-full rounded-r-full transition-all duration-500"
                    style={{ width: `${rightPct}%`, backgroundColor: rightColor }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ========== 信息图表卡片 ==========
interface InfoCardProps {
  icon: string
  title: string
  value: string | number
  subtitle?: string
  color?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

export function InfoCard({ icon, title, value, subtitle, color = '#3B82F6', trend, trendValue }: InfoCardProps) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-400'
  }
  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className={`text-sm ${trendColors[trend]}`}>
            {trendIcons[trend]} {trendValue}
          </div>
        )}
      </div>
    </div>
  )
}

// ========== 进度环组件 ==========
interface ProgressRingProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  sublabel?: string
}

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = '#3B82F6',
  label,
  sublabel
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / max) * circumference

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        {/* 进度圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {label && <span className="text-xs text-gray-500">{label}</span>}
      </div>
      {sublabel && <span className="text-xs text-gray-400 mt-2">{sublabel}</span>}
    </div>
  )
}

// ========== 导出所有组件 ==========
export const Charts = {
  InteractiveRadarChart,
  BarChart,
  PieChart,
  TrendChart,
  ComparisonChart,
  InfoCard,
  ProgressRing
}

// ========== 增强版常模参照对比组件 ==========
interface NormComparisonBarProps {
  dimensions: {
    key: string
    name: string
    score: number
    percentile: number // 0-100, 越高越好
    color: string
  }[]
  studentName: string
  peerAverage?: number // 同龄人平均分(默认70)
  ageGroupLabel?: string // "6-9岁"
  peerMeans?: Record<string, number> // 各维度同龄均值
}

export function NormReferenceSection({ dimensions, studentName, peerAverage = 70, ageGroupLabel, peerMeans }: NormComparisonBarProps) {
  return (
    <div className="space-y-6">
      {/* 标题与说明 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
          <span className="text-xl">📊</span>
          {studentName}在同龄儿童中的位置
        </h4>
        <p className="text-sm text-blue-700 leading-relaxed">
          基于{ageGroupLabel || '同龄'}年龄段常模数据，展示各能力维度的发展水平。
        </p>
      </div>

      {/* 维度档位展示 */}
      <div className="space-y-4">
        {dimensions.map((dim, index) => {
          const peerMean = peerMeans?.[dim.key] ?? peerAverage
          const bandInfo = toPercentileBand(dim.percentile)
          const barWidth = Math.min(100, Math.max(5, dim.percentile))
          
          // 进度条颜色映射（品牌蓝到Teal色系，与落地页VI统一）
          const barColor = dim.percentile >= 75 ? '#3B5FD9' :   // 深蓝（高百分位）
                          dim.percentile >= 50 ? '#0F9D94' :    // Teal（中高百分位）
                          dim.percentile >= 25 ? '#5DB8B2' :    // 浅Teal（中百分位）
                          '#93c5fd'                              // 极浅蓝（低百分位）
          
          return (
            <div key={index} className="group">
              {/* 维度信息行 */}
              <div className="flex items-center gap-3 py-2">
                {/* 档位色点指示器（替代 emoji） */}
                <span 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ 
                    backgroundColor: dim.percentile >= 75 ? '#3B5FD9' :
                                    dim.percentile >= 50 ? '#0F9D94' :
                                    dim.percentile >= 25 ? '#5DB8B2' : '#93c5fd'
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm"
                        style={{ backgroundColor: dim.color }}
                      >
                        {dim.key}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{dim.name}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bandInfo.colorClass}`}>
                      {bandInfo.label}
                    </span>
                  </div>
                  
                  {/* 进度条 */}
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(5, barWidth)}%`,
                        backgroundColor: barColor
                      }}
                    />
                  </div>
                  
                  {/* 档位描述 */}
                  <p className="text-xs text-gray-500 mt-0.5">{bandInfo.description}</p>
                  
                  {/* 分数对比 */}
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dim.color }}></span>
                      <span className="text-gray-600">{studentName}: <strong>{dim.score}分</strong></span>
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span className="text-gray-500">同龄平均: {peerMean}分</span>
                    </span>
                  </div>
                  
                  {/* 深度分析：保留精确百分位数字 */}
                  <details className="text-xs text-gray-400 mt-1">
                    <summary className="cursor-pointer hover:text-gray-600">查看详细数据</summary>
                    <p className="mt-1 pl-2 border-l-2 border-gray-200">精确百分位: 第{dim.percentile}百分位（处于{bandInfo.range[0]}-{bandInfo.range[1]}百分位档位）</p>
                  </details>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 解读说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h5 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2">
          如何理解档位评价？
        </h5>
        <div className="text-xs text-blue-700 leading-relaxed space-y-1">
          <p>我们采用五级档位评价，更科学地反映孩子的发展水平：</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3B5FD9]"></span> 优秀</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0F9D94]"></span> 良好</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#5DB8B2]"></span> 中等</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#93c5fd]"></span> 发展中</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#bfdbfe]"></span> 待培养</span>
          </div>
          <p className="mt-2">颜色深浅代表百分位区间，点击"查看详细数据"可查看精确百分位。</p>
        </div>
      </div>
    </div>
  )
}
