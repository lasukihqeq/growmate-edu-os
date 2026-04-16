import { useState, useRef, useEffect, useCallback } from 'react'
import type { TalentTreeData, TalentTreeNode } from '../types/newFeatures'
import { generateTalentTreeData } from '../lib/talentTreeDataGenerator'

// ========== SVG 潜能树可视化 ==========

interface TalentTreeProps {
  wilderScores: Record<string, number>
  talentType: string
  sortedDims: { key: string; name: string; score: number }[]
  talentType60Name?: string
}

// 布局常量
const CX = 350
const CY = 350
const R_L1 = 140  // L1 维度距离中心
const R_L2 = 240  // L2 能力距离中心
const R_L3 = 310  // L3 活动距离中心
const NODE_R_L0 = 42
const NODE_R_L1 = 28
const NODE_R_L2 = 16
const NODE_R_L3 = 12

interface LayoutNode {
  x: number
  y: number
  r: number
  node: TalentTreeNode
  parentX?: number
  parentY?: number
}

function computeLayout(data: TalentTreeData): LayoutNode[] {
  const nodes: LayoutNode[] = []
  
  // Root center
  nodes.push({ x: CX, y: CY, r: NODE_R_L0, node: data.root })
  
  const dimCount = data.dimensions.length
  data.dimensions.forEach((dim, i) => {
    const angle = (Math.PI * 2 * i) / dimCount - Math.PI / 2
    const dx = CX + R_L1 * Math.cos(angle)
    const dy = CY + R_L1 * Math.sin(angle)
    
    // 根据分数调整节点大小
    const scoreRatio = (dim.score || 70) / 100
    const nodeR = NODE_R_L1 * (0.7 + scoreRatio * 0.4)
    
    nodes.push({ x: dx, y: dy, r: nodeR, node: dim, parentX: CX, parentY: CY })
    
    // L2 children
    const children = dim.children || []
    const childSpread = 0.35 // 子节点扇形展开角度
    children.forEach((child, ci) => {
      const childAngle = angle + (ci - (children.length - 1) / 2) * childSpread
      const cx2 = CX + R_L2 * Math.cos(childAngle)
      const cy2 = CY + R_L2 * Math.sin(childAngle)
      
      nodes.push({ x: cx2, y: cy2, r: NODE_R_L2, node: child, parentX: dx, parentY: dy })
      
      // L3 leaves
      const leaves = child.children || []
      leaves.forEach((leaf, li) => {
        const leafAngle = childAngle + (li - (leaves.length - 1) / 2) * 0.2
        const cx3 = CX + R_L3 * Math.cos(leafAngle)
        const cy3 = CY + R_L3 * Math.sin(leafAngle)
        nodes.push({ x: cx3, y: cy3, r: NODE_R_L3, node: leaf, parentX: cx2, parentY: cy2 })
      })
    })
  })
  
  return nodes
}

// SVG Bezier curve path between parent and child
function connectionPath(px: number, py: number, cx: number, cy: number): string {
  const mx = (px + cx) / 2
  const my = (py + cy) / 2
  // 稍微弯曲
  const ctrl1x = px + (mx - px) * 0.5 + (cy - py) * 0.1
  const ctrl1y = py + (my - py) * 0.5 - (cx - px) * 0.1
  return `M${px},${py} Q${ctrl1x},${ctrl1y} ${cx},${cy}`
}

export function TalentTree({ wilderScores, talentType, sortedDims, talentType60Name }: TalentTreeProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [visibleLevels, setVisibleLevels] = useState<Set<number>>(new Set([0, 1]))
  const [animateIn, setAnimateIn] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  const treeData = generateTalentTreeData(wilderScores, talentType, sortedDims)
  const layoutNodes = computeLayout(treeData)

  // Intersection observer for animation
  useEffect(() => {
    if (!sectionRef.current || hasAnimated.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          setAnimateIn(true)
          setTimeout(() => setVisibleLevels(new Set([0, 1, 2])), 800)
          setTimeout(() => setVisibleLevels(new Set([0, 1, 2, 3])), 1400)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleNodeClick = useCallback((node: TalentTreeNode) => {
    setSelectedNode(prev => prev === node.id ? null : node.id)
    // 展开到该节点的层级
    if (node.level >= 1) {
      setVisibleLevels(prev => {
        const next = new Set(prev)
        for (let l = 0; l <= Math.min(node.level + 1, 3); l++) next.add(l)
        return next
      })
    }
  }, [])

  // 找到选中节点的信息
  const selectedInfo = selectedNode
    ? layoutNodes.find(n => n.node.id === selectedNode)?.node
    : null

  return (
    <section ref={sectionRef} id="section-talent-tree" className="page-break">
      <div
        className="rpt-section-title flex items-center gap-2"
        style={{ background: 'linear-gradient(135deg, #059669 0%, #14b8a6 50%, #0ea5e9 100%)' }}
      >
        <span className="text-xl">🌳</span>
        <span className="mx-2">|</span>
        <span>探索力能力树</span>
      </div>

      <div className="rpt-section-content">
        {/* 说明 */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-4 border border-emerald-100">
          <p className="text-xs text-emerald-700 leading-relaxed">
            <strong>探索力能力树</strong>以{talentType}为核心{talentType60Name ? `（精细分型：${talentType60Name}）` : ''}，展开6大WILDER维度、18项子能力和推荐活动。
            节点大小反映能力强度，点击节点查看详情。
          </p>
        </div>

        {/* SVG Tree */}
        <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-gray-100 overflow-hidden">
          <svg viewBox="0 0 700 700" className="w-full h-auto max-h-[600px]">
            {/* 背景圆环 */}
            <circle cx={CX} cy={CY} r={R_L1} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" opacity={0.5} />
            <circle cx={CX} cy={CY} r={R_L2} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" opacity={0.3} />
            <circle cx={CX} cy={CY} r={R_L3} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" opacity={0.2} />

            {/* 连接线 */}
            {layoutNodes
              .filter(n => n.parentX !== undefined && visibleLevels.has(n.node.level))
              .map((n, i) => (
                <path
                  key={`conn-${i}`}
                  d={connectionPath(n.parentX!, n.parentY!, n.x, n.y)}
                  fill="none"
                  stroke={n.node.color}
                  strokeWidth={n.node.level <= 1 ? 2 : 1}
                  opacity={animateIn ? (hoveredNode === n.node.id || selectedNode === n.node.id ? 0.8 : 0.25) : 0}
                  className="transition-opacity duration-700"
                />
              ))}

            {/* 节点 */}
            {layoutNodes
              .filter(n => visibleLevels.has(n.node.level))
              .map((n) => {
                const isHovered = hoveredNode === n.node.id
                const isSelected = selectedNode === n.node.id
                const scale = isHovered || isSelected ? 1.15 : 1

                return (
                  <g
                    key={n.node.id}
                    className="cursor-pointer transition-all duration-300"
                    style={{ opacity: animateIn ? 1 : 0, transition: `opacity 0.5s ease ${n.node.level * 0.3}s` }}
                    onClick={() => handleNodeClick(n.node)}
                    onMouseEnter={() => setHoveredNode(n.node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* 光晕效果 */}
                    {(isHovered || isSelected) && (
                      <circle cx={n.x} cy={n.y} r={n.r * 1.6} fill={n.node.color} opacity={0.1} />
                    )}

                    {/* 节点圆 */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={n.r * scale}
                      fill="white"
                      stroke={n.node.color}
                      strokeWidth={n.node.level === 0 ? 3 : 2}
                      className="drop-shadow-sm"
                    />

                    {/* 填充进度（仅L1+有分数的节点） */}
                    {n.node.score && n.node.level >= 1 && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={n.r * scale * 0.85}
                        fill={n.node.color}
                        opacity={n.node.score / 200 + 0.15}
                      />
                    )}

                    {/* 图标/文字 */}
                    {n.node.level === 0 && (
                      <>
                        <text x={n.x} y={n.y - 6} textAnchor="middle" className="text-lg" dominantBaseline="middle">{n.node.icon || '⭐'}</text>
                        <text x={n.x} y={n.y + 14} textAnchor="middle" fill="#1e293b" fontSize="8" fontWeight="bold">{n.node.label.slice(0, 5)}</text>
                      </>
                    )}
                    {n.node.level === 1 && (
                      <>
                        <text x={n.x} y={n.y - 4} textAnchor="middle" fontSize="14" dominantBaseline="middle">{n.node.icon}</text>
                        <text x={n.x} y={n.y + 13} textAnchor="middle" fill={n.node.color} fontSize="9" fontWeight="bold" fontFamily="system-ui, sans-serif">{n.node.label}</text>
                        {n.node.score && (
                          <text x={n.x} y={n.y + 24} textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="600">{n.node.score}</text>
                        )}
                      </>
                    )}
                    {n.node.level === 2 && (
                      <text x={n.x} y={n.y + 1} textAnchor="middle" fill={n.node.color} fontSize="7" fontWeight="700" dominantBaseline="middle" fontFamily="system-ui, sans-serif">
                        {n.node.label.slice(0, 5)}
                      </text>
                    )}
                    {n.node.level === 3 && (
                      <text x={n.x} y={n.y + 1} textAnchor="middle" fill="#64748b" fontSize="6" fontWeight="500" dominantBaseline="middle" fontFamily="system-ui, sans-serif">
                        {n.node.label.slice(0, 4)}
                      </text>
                    )}
                  </g>
                )
              })}
          </svg>

          {/* 图例 */}
          <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-[10px] text-gray-500 border border-gray-100">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border-2 border-amber-400" /> L1 维度</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border-2 border-indigo-400" /> L2 能力</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full border-2 border-gray-300" /> L3 活动</span>
          </div>

          {/* 选中节点详情浮窗 */}
          {selectedInfo && selectedInfo.level >= 1 && (
            <div className="absolute top-3 right-3 bg-white rounded-xl p-3 shadow-lg border border-gray-200 max-w-[200px] text-xs">
              <div className="flex items-center gap-2 mb-1">
                {selectedInfo.icon && <span className="text-base">{selectedInfo.icon}</span>}
                <strong className="text-gray-800">{selectedInfo.label}</strong>
              </div>
              {selectedInfo.labelEn && <p className="text-gray-400 text-[10px] font-mono mb-1">{selectedInfo.labelEn}</p>}
              {selectedInfo.score && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-1 flex-1 bg-gray-100 rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${selectedInfo.score}%`, backgroundColor: selectedInfo.color }} />
                  </div>
                  <span className="font-bold" style={{ color: selectedInfo.color }}>{selectedInfo.score}</span>
                </div>
              )}
              {selectedInfo.description && <p className="text-gray-500 leading-relaxed">{selectedInfo.description}</p>}
              <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-gray-600 mt-1 text-[10px]">关闭 ×</button>
            </div>
          )}
        </div>

        {/* 底部快捷维度卡片（移动端友好） */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
          {treeData.dimensions.map(dim => (
            <button
              key={dim.id}
              onClick={() => handleNodeClick(dim)}
              className={`rounded-xl p-2 text-center border transition-all ${
                selectedNode === dim.id
                  ? 'border-current shadow-md scale-105'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
              style={selectedNode === dim.id ? { borderColor: dim.color, backgroundColor: `${dim.color}10` } : {}}
            >
              <div className="text-lg">{dim.icon}</div>
              <div className="text-[10px] font-bold text-gray-700">{dim.label}</div>
              <div className="text-[10px] font-bold" style={{ color: dim.color }}>{dim.score}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
