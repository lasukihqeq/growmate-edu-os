import { useState, useRef, useCallback, useEffect } from 'react'
import type { WorkAnalysisResult } from '../types/newFeatures'
import { analyzeWorkImage } from '../lib/workAnalysisEngine'

// ========== 作品上传与创意分析展示组件 ==========

// ---------- 分析阶段类型 ----------
type AnalysisStage = 'extracting_colors' | 'analyzing_composition' | 'generating_interpretation' | 'complete'

const STAGE_LABELS: Record<AnalysisStage, { text: string; icon: string }> = {
  extracting_colors: { text: '提取色彩特征', icon: '🎨' },
  analyzing_composition: { text: '分析构图布局', icon: '📐' },
  generating_interpretation: { text: '生成创意解读', icon: '✨' },
  complete: { text: '分析完成', icon: '✅' },
}

// ---------- 色块可视化 ----------
function ColorSwatch({ hex, name, pct }: { hex: string; name: string; pct: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-7 h-7 rounded-lg border border-gray-200 shadow-sm flex-shrink-0" style={{ backgroundColor: hex }} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-700 truncate">{name}</p>
        <p className="text-gray-400 font-mono text-[10px]">{hex}</p>
      </div>
      <span className="text-gray-500 font-bold">{pct}%</span>
    </div>
  )
}

// ---------- 指标条 ----------
function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// ---------- 分析中占位动画（增强版） ----------
function AnalyzingOverlay({ stage }: { stage: AnalysisStage }) {
  const [dots, setDots] = useState('')
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 400)
    return () => clearInterval(timer)
  }, [])
  
  const stageInfo = STAGE_LABELS[stage]
  const stages: AnalysisStage[] = ['extracting_colors', 'analyzing_composition', 'generating_interpretation']
  const currentIdx = stages.indexOf(stage)
  const progress = stage === 'complete' ? 100 : Math.round(((currentIdx + 1) / stages.length) * 90)
  
  return (
    <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center gap-5 z-10">
      {/* 双重旋转圆环动画 */}
      <div className="relative w-20 h-20">
        {/* 外圈：渐变旋转 */}
        <div 
          className="absolute inset-0 rounded-full animate-spin"
          style={{ 
            background: 'conic-gradient(from 0deg, #f59e0b, #ef4444, #8b5cf6, #3b82f6, #10b981, #f59e0b)',
            animationDuration: '2s'
          }}
        />
        {/* 外圈遮罩 */}
        <div className="absolute inset-[3px] bg-white rounded-full" />
        {/* 内圈：反向旋转 */}
        <div 
          className="absolute inset-2 border-4 border-transparent rounded-full animate-spin"
          style={{ 
            borderTopColor: '#8b5cf6',
            borderRightColor: '#f59e0b',
            animationDirection: 'reverse',
            animationDuration: '1s'
          }}
        />
        {/* 中心图标 */}
        <div className="absolute inset-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl animate-pulse">{stageInfo.icon}</span>
        </div>
      </div>
      
      {/* 进度条 */}
      <div className="w-48">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-1">{progress}%</p>
      </div>
      
      {/* 阶段文本 */}
      <div className="text-center">
        <p className="font-bold text-sm text-gray-800">正在分析作品{dots}</p>
        <p className="text-xs text-gray-500 mt-1">{stageInfo.text}</p>
      </div>
      
      {/* 步骤指示器 */}
      <div className="flex items-center gap-2">
        {stages.map((s, i) => {
          const isActive = i === currentIdx
          const isComplete = i < currentIdx || stage === 'complete'
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                isComplete 
                  ? 'bg-emerald-500 text-white' 
                  : isActive 
                  ? 'bg-amber-500 text-white animate-pulse' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {isComplete ? '✓' : STAGE_LABELS[s].icon}
              </div>
              {i < stages.length - 1 && (
                <div className={`w-6 h-0.5 transition-colors duration-300 ${
                  i < currentIdx ? 'bg-emerald-400' : 'bg-gray-200'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ========== 主组件 ==========

interface Props {
  wilderScores: Record<string, number>
  studentName: string
}

export function WorkUploadSection({ wilderScores, studentName }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>('extracting_colors')
  const [result, setResult] = useState<WorkAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  // 图片压缩：移动端拍照可能很大，压缩到合理尺寸
  const compressImage = useCallback(async (f: File): Promise<File> => {
    if (f.size <= 2 * 1024 * 1024) return f // 2MB以下不压缩
    return new Promise((resolve) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(f)
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxDim = 1600
        let w = img.width, h = img.height
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round(h * maxDim / w); w = maxDim }
          else { w = Math.round(w * maxDim / h); h = maxDim }
        }
        canvas.width = w; canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(objectUrl)
          resolve(f) // 无法创建 canvas 上下文时返回原文件
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(objectUrl) // 释放内存
          resolve(blob ? new File([blob], f.name, { type: 'image/jpeg' }) : f)
        }, 'image/jpeg', 0.85)
      }
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl) // 释放内存
        resolve(f)
      }
      img.src = objectUrl
    })
  }, [])

  const handleFile = useCallback(async (f: File) => {
    if (!f.type.startsWith('image/')) {
      setError('请上传图片文件（JPG、PNG 等）')
      return
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('文件大小不能超过 20MB')
      return
    }
    setError(null)
    
    // 压缩大图
    const compressed = await compressImage(f)
    setFile(compressed)
    setPreview(URL.createObjectURL(compressed))
    setResult(null)
    setAnalyzing(true)
    setAnalysisStage('extracting_colors')

    try {
      // 使用压缩后的文件进行分析，而非原始文件
      const analysis = await analyzeWorkImage(compressed, wilderScores, (stage) => {
        setAnalysisStage(stage as AnalysisStage)
      })
      setAnalysisStage('complete')
      setResult(analysis)
    } catch (e) {
      setError(`分析失败：${e instanceof Error ? e.message : '未知错误'}`)
    } finally {
      setAnalyzing(false)
    }
  }, [wilderScores, compressImage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
    if (cameraRef.current) cameraRef.current.value = ''
  }

  return (
    <section id="section-work-upload" className="page-break">
      <div
        className="rpt-section-title flex items-center gap-2"
        style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)' }}
      >
        <span className="text-xl">🎨</span>
        <span className="mx-2">|</span>
        <span>作品创意分析</span>
      </div>

      <div className="rpt-section-content">
        {/* 说明卡 */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-5 border border-amber-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0 mt-0.5">
              🎨
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-900 mb-1">上传孩子的作品，解读创造力密码</h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                上传{studentName}的一幅画作、手工照片或创意作品图片，系统将通过色彩分析和构图解读，
                结合WILDER能力画像，为您呈现孩子独特的创意表达风格。
              </p>
            </div>
          </div>
        </div>

        {/* 上传区域 - 双入口 */}
        {!file && (
          <div className="space-y-3">
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-amber-400 rounded-2xl p-8 text-center cursor-pointer transition-colors group bg-white"
            >
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform">
                📷
              </div>
              <p className="font-bold text-gray-700 mb-1">点击选择图片或拖拽到此处</p>
              <p className="text-xs text-gray-400">支持 JPG、PNG 格式，最大 20MB（自动压缩）</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
            {/* 移动端拍照按钮 */}
            <button
              onClick={() => cameraRef.current?.click()}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm sm:hidden"
            >
              📸 拍摄孩子作品
            </button>
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex items-center gap-2">
            <span className="text-rose-500">⚠️</span>
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        {/* 预览 + 分析结果 */}
        {file && preview && (
          <div className="relative">
            {analyzing && <AnalyzingOverlay stage={analysisStage} />}

            <div className="grid lg:grid-cols-2 gap-5">
              {/* 左侧：图片预览 */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                    <span className="w-6 h-6 bg-amber-500 rounded-md flex items-center justify-center text-white text-[10px]">📷</span>
                    作品预览
                  </h4>
                  <button onClick={reset} className="text-xs text-gray-400 hover:text-rose-500 transition-colors">
                    重新上传
                  </button>
                </div>
                <img
                  src={preview}
                  alt={`${studentName}的作品`}
                  className="w-full rounded-lg object-contain max-h-80 bg-gray-50"
                />
                <p className="text-[10px] text-gray-400 mt-2 text-center">{file.name} · {(file.size / 1024).toFixed(0)}KB</p>
              </div>

              {/* 右侧：色彩分析 */}
              {result && (
                <div className="space-y-4">
                  {/* 色彩卡 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-violet-500 rounded-md flex items-center justify-center text-white text-[10px]">🎨</span>
                      色彩特征
                    </h4>
                    {/* 色块条 */}
                    <div className="flex h-5 rounded-full overflow-hidden mb-3">
                      {result.colorProfile.dominantColors.map((c, i) => (
                        <div
                          key={i}
                          style={{ backgroundColor: c.hex, width: `${Math.max(c.percentage, 5)}%` }}
                          className="first:rounded-l-full last:rounded-r-full"
                          title={`${c.name} ${c.percentage}%`}
                        />
                      ))}
                    </div>
                    <div className="space-y-2 mb-4">
                      {result.colorProfile.dominantColors.map((c, i) => (
                        <ColorSwatch key={i} hex={c.hex} name={c.name} pct={c.percentage} />
                      ))}
                    </div>
                    <div className="space-y-2.5">
                      <MetricBar label="色彩丰富度" value={result.colorProfile.richness} color="#8b5cf6" />
                      <MetricBar label="冷暖倾向（暖→）" value={result.colorProfile.warmth} color="#f59e0b" />
                      <MetricBar label="明暗对比" value={result.colorProfile.contrast} color="#6366f1" />
                    </div>
                  </div>

                  {/* 构图卡 */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#3B5FD9] rounded-md flex items-center justify-center text-white text-[10px]">📐</span>
                      构图特征
                    </h4>
                    <div className="space-y-2.5">
                      <MetricBar label="画面填充率" value={result.compositionProfile.fillRate} color="#14b8a6" />
                      <MetricBar label="细节密度" value={result.compositionProfile.density} color="#3b82f6" />
                      <MetricBar label="对称均衡" value={result.compositionProfile.symmetry} color="#8b5cf6" />
                      <MetricBar label="视觉复杂度" value={result.compositionProfile.complexity} color="#f97316" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 下方：综合解读 */}
            {result && (
              <div className="mt-5 space-y-4">
                {/* 表达风格卡 */}
                <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 rounded-xl p-5 border border-amber-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-xl shadow-md">
                      ⭐
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">创意表达风格</h4>
                      <p className="text-[10px] text-gray-400">Expression Style</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">{result.expressionStyle}</p>
                </div>

                {/* 标签 + 特征 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-500 rounded-md flex items-center justify-center text-white text-[10px]">🏷️</span>
                      作品特征标签
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.parentTags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center text-white text-[10px]">💡</span>
                      创造力特质解读
                    </h4>
                    <div className="space-y-2">
                      {result.creativeTraits.map((trait, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                          <span className="leading-relaxed">{trait}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 总结 */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <p className="text-sm text-gray-700 leading-relaxed text-center">{result.summary}</p>
                </div>

                {/* 免责 */}
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <div className="flex items-start gap-2">
                    <span className="text-sm mt-0.5">ℹ️</span>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      作品分析基于图像色彩与构图特征提取，结合WILDER能力画像进行综合解读。分析结果仅供家庭教育参考，
                      不代表专业美术评估。每个孩子的创造力都是独特的，数据分析无法完全呈现作品背后的情感和故事。
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[10px] text-gray-400">
                    基于 Canvas API 色彩提取 · Sobel 边缘检测 · 构图特征分析 · WILDER 六维关联
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
