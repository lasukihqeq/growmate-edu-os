/**
 * ReportIdentityCard.tsx - 身份卡 + 分型组件
 * 
 * 功能: 展示 30 类型身份卡、60 分型、潜能星象卡
 * 包含:
 * - 30 类型潜能身份卡
 * - 60 分型精细化潜能身份卡
 * - 潜能星象卡（趣味元素）
 * - 交叉匹配洞察
 * - 孩子特点画像
 * - 核心优势资产
 * - 总结地图
 */

import React from 'react'
import { ReportSectionHeader } from './ui/ReportSectionHeader'
import type { DynamicReportData } from '../lib/reportContentGenerator'
import { getTalentConstellation } from '../lib/funElements'
import { SectionInsight } from './ReportEducationFoundation'

// ========== Props 接口 ==========
export interface ReportIdentityCardProps {
  /** 报告数据 */
  reportData: DynamicReportData
  /** 章节追踪函数 */
  trackSection?: (element: HTMLElement | null) => void
}

// ========== 颜色辅助函数 ==========
const COLOR_MAP: Record<string, { bg: string; text: string; border: string; light: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', light: 'bg-blue-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', light: 'bg-amber-100' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', light: 'bg-emerald-100' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', light: 'bg-purple-100' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200', light: 'bg-teal-100' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200', light: 'bg-rose-100' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', light: 'bg-slate-100' },
}

function getColor(c: string) {
  return COLOR_MAP[c] || COLOR_MAP.slate
}

/**
 * 报告身份卡组件
 */
export const ReportIdentityCard: React.FC<ReportIdentityCardProps> = ({
  reportData: d,
  trackSection,
}) => {
  return (
    <section id="section-explorer" ref={trackSection} className="page-break py-8">
      {/* 章节头部 */}
      <ReportSectionHeader
        variant="identity"
        title="潜能身份卡"
        subtitle={`${d.talentType}画像解读 · 国际对标版`}
      />

      <div className="p-6 space-y-6">
        <SectionInsight 
          text={`${d.student.name}属于「${d.talentType}」画像，意味着TA的潜能倾向于${d.sortedDims[0]?.name}和${d.sortedDims[1]?.name}的组合发力。这不是标签，而是TA独特的成长起点。`} 
          type="key" 
        />

        {/* 潜能总览 */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-orange-300 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-200/30 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="flex items-center justify-center gap-3 mb-6 relative">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">📌</span>
            </div>
            <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 tracking-wider">潜能总览</h4>
          </div>

          {/* 画像编码 */}
          <div className="bg-white rounded-xl p-4 mb-5 border border-orange-200 shadow-sm">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">画像编码</p>
              <p className="text-xl md:text-2xl font-mono font-black text-gray-800 tracking-wide">
                {d.profileCode}｜{d.sortedDims.map(dim => `${dim.key}${Math.round(dim.score/20)}`).join(' ')}
                <span className="text-orange-500"> ——</span>
                <span className="text-amber-600">「{d.talentType}」</span>
                <span className="text-gray-500 text-sm ml-2">({d.talentTypeEn})</span>
              </p>
            </div>
          </div>

          {/* 核心结论卡片 */}
          <div className="bg-white rounded-2xl p-6 mb-5 shadow-md border border-orange-100 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">核心发现</div>
            <div className="mt-2 space-y-4">
              <div className="text-center">
                <p className="text-lg md:text-xl font-black text-gray-800 leading-relaxed">{d.explorer.coreInsight}</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 mt-4">
                <p className="text-center text-lg md:text-xl text-emerald-700 font-black">✨ {d.explorer.actionableInsight}</p>
              </div>
            </div>
          </div>

          {/* 潜能解读三栏 */}
          <div className="grid md:grid-cols-3 gap-4 mb-5">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm">🚀</span>
                <h5 className="font-bold text-green-700 text-sm">优势引擎</h5>
              </div>
              <ul className="space-y-2 text-sm">
                {d.explorer.strengthEngines.map((e, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-gray-700"><strong>{e.letter}{e.name.replace(/驱动$/, '')}</strong> {e.level}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">💎</span>
                <h5 className="font-bold text-blue-700 text-sm">核心特质</h5>
              </div>
              <ul className="space-y-2 text-sm">
                {d.explorer.coreTraits.map((t, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white text-sm">🔧</span>
                <h5 className="font-bold text-amber-700 text-sm">成长方向</h5>
              </div>
              <ul className="space-y-2 text-sm">
                {d.explorer.growthDirections.map((g, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    <span className="text-gray-700"><strong>{g.letter}{g.name.replace(/(待提升|可加强)$/, '')}</strong> {g.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 今日行动 */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-start gap-4 relative">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💡</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-100 mb-2 uppercase tracking-wider">今天就能做的动作</p>
                <p className="text-base md:text-lg leading-relaxed">
                  当TA又"三分钟热度"时，说<span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-lg font-bold mx-1">{d.explorer.todayAction.phrase}</span>
                </p>
                <p className="text-blue-200 mt-2 text-sm">——{d.explorer.todayAction.explanation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 30类型潜能身份卡 */}
        {d.talentType30 && (
          <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border-2 border-purple-300 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-center justify-center gap-3 mb-5 relative">
              <span className="text-4xl">{d.talentType30.icon}</span>
              <div className="text-center">
                <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-600">{d.talentType30.name}</h4>
                <p className="text-sm text-purple-500 font-medium">{d.talentType30.nameEn} · {d.talentType30Key}</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-xl p-4 mb-4 text-center border border-purple-100">
              <p className="text-lg font-bold text-gray-800 italic">"{d.talentType30.tagline}"</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center text-white text-xs">💪</span>
                  <h5 className="font-bold text-green-700 text-sm">核心优势</h5>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{d.talentType30.coreStrength}</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-white text-xs">🌱</span>
                  <h5 className="font-bold text-amber-700 text-sm">成长重点</h5>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{d.talentType30.growthFocus}</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs">🤖</span>
                  <h5 className="font-bold text-blue-700 text-sm">AI时代洞察</h5>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{d.talentType30.aiAgeInsight}</p>
              </div>
            </div>

            {d.talentType30.mbtiApprox && d.talentType30.mbtiApprox !== '待深入评估' && (
              <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
                <span className="bg-purple-100 px-3 py-1 rounded-full font-medium">MBTI近似: {d.talentType30.mbtiApprox}</span>
                <span className="bg-purple-100 px-3 py-1 rounded-full font-medium">层级: {d.talentType30.tier === 'single' ? '单峰型' : d.talentType30.tier === 'dual' ? '双峰型' : d.talentType30.tier === 'triple' ? '三峰型' : '特殊型'}</span>
              </div>
            )}
          </div>
        )}

        {/* 潜能星象卡（趣味化元素） */}
        {(() => {
          const constellation = getTalentConstellation(d.talentType30Key || 'D-WI')
          if (!constellation) return null
          return (
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-white">
              {/* 星空背景装饰 */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-8 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-12 right-16 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-20 left-1/4 w-1 h-1 bg-blue-200 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-16 right-1/3 w-1 h-1 bg-pink-200 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
              </div>

              <div className="relative z-10">
                {/* 趣味彩蛋声明 */}
                <div className="bg-white/10 backdrop-blur border border-dashed border-yellow-300/40 rounded-xl px-4 py-2.5 mb-5 text-center">
                  <p className="text-xs text-yellow-200/90 leading-relaxed">
                    <span className="font-bold">🎭 趣味彩蛋</span> · 以下内容为趣味性补充，<span className="underline decoration-dashed underline-offset-2">非科学评估结论</span>，不应作为教育决策依据。
                  </p>
                </div>

                {/* 标题区 */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full mb-3">
                    <span className="text-yellow-300">🎭</span>
                    <span className="text-sm font-medium text-purple-200">潜能星象 · 趣味彩蛋</span>
                    <span className="text-yellow-300">🎭</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-5xl">{constellation.symbol}</span>
                    <div>
                      <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200">
                        {constellation.name}
                      </h4>
                      <p className="text-purple-300 text-sm">元素属性: {constellation.element}</p>
                    </div>
                  </div>
                </div>

                {/* 座右铭 */}
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-5 text-center border border-white/20">
                  <p className="text-lg font-medium italic text-purple-100">"{constellation.motto}"</p>
                </div>

                {/* 幸运元素卡片 */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
                  <div className="bg-gradient-to-br from-rose-500/30 to-pink-500/30 backdrop-blur rounded-xl p-2 sm:p-3 text-center border border-dashed border-white/20">
                    <div className="text-xl sm:text-2xl mb-1">🎨</div>
                    <div className="text-[10px] sm:text-xs text-purple-200 mb-0.5">趣味幸运色</div>
                    <div className="font-bold text-white text-xs sm:text-base">{constellation.luckyColor}</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500/30 to-yellow-500/30 backdrop-blur rounded-xl p-2 sm:p-3 text-center border border-dashed border-white/20">
                    <div className="text-xl sm:text-2xl mb-1">🔢</div>
                    <div className="text-[10px] sm:text-xs text-purple-200 mb-0.5">趣味幸运数</div>
                    <div className="font-bold text-white text-lg sm:text-xl">{constellation.luckyNumber}</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/30 to-blue-500/30 backdrop-blur rounded-xl p-2 sm:p-3 text-center border border-dashed border-white/20">
                    <div className="text-xl sm:text-2xl mb-1">🍀</div>
                    <div className="text-[10px] sm:text-xs text-purple-200 mb-0.5">趣味幸运物</div>
                    <div className="font-bold text-white text-xs sm:text-base">{constellation.luckyItem}</div>
                  </div>
                </div>

                {/* 超能力与成长空间 */}
                <div className="grid md:grid-cols-2 gap-4 mb-5">
                  <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur rounded-xl p-4 border border-emerald-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">⚡</span>
                      <span className="font-bold text-emerald-300">专属超能力</span>
                    </div>
                    <p className="text-sm text-white/90">{constellation.superpower}</p>
                  </div>
                  <div className="bg-gradient-to-br from-rose-500/20 to-red-500/20 backdrop-blur rounded-xl p-4 border border-rose-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">💫</span>
                      <span className="font-bold text-rose-300">成长空间</span>
                    </div>
                    <p className="text-sm text-white/90">{constellation.kryptonite}</p>
                  </div>
                </div>

                {/* 名人对标 */}
                <div className="bg-white/5 backdrop-blur rounded-xl p-4 mb-5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🌟</span>
                    <span className="font-bold text-yellow-200">同类型名人</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {constellation.celebrities.map((celeb, i) => (
                      <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-sm text-purple-100 border border-white/20">
                        {celeb}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 底部趣味声明 */}
                <div className="mt-5 text-center">
                  <p className="text-[10px] text-purple-300/60 leading-relaxed">
                    以上"潜能星象"为趣味性类比，基于WILDER测评结果以游戏化方式呈现。幸运色、幸运数字等均为娱乐内容，不代表科学结论。
                  </p>
                </div>
              </div>
            </div>
          )
        })()}

        {/* 孩子特点画像 */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-[#FFB800]">🦋</span>
            孩子特点画像：{d.talentType}
          </h4>
          <div className="space-y-4">
            {d.explorer.characterTraits.map((trait, i) => {
              const c = getColor(trait.color)
              return (
                <div key={i} className={`bg-gradient-to-br ${c.bg} to-white rounded-xl p-5 border ${c.border}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{trait.emoji}</span>
                    <h5 className={`font-bold ${c.text}`}>{i + 1}. {trait.title}</h5>
                  </div>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>行为画面：</strong>{trait.behaviorDesc}</p>
                    <p><strong>内在机制：</strong>{trait.mechanism}</p>
                    <p><strong>发展意义：</strong>{trait.devMeaning}</p>
                    <p className={`${c.text} bg-white rounded-lg p-2 mt-2`}><strong>家长视角：</strong>{trait.parentTip}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 核心优势资产 */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">💎</span>
            核心优势资产（可复利的潜能）
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {d.explorer.strengthAssets.map((asset, i) => {
              const c = getColor(asset.color)
              return (
                <div key={i} className={`${c.bg} rounded-xl p-4`}>
                  <h5 className={`font-bold ${c.text} mb-2`}>{asset.name}</h5>
                  <p className="text-sm text-gray-600"><strong>证据：</strong>{asset.evidence}</p>
                  <p className={`text-sm ${c.text} mt-2`}><strong>可迁移价值：</strong>{asset.transferValue}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 总结地图 */}
        <div>
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-[#2A4CC0]">🗺️</span>
            总结地图：{d.talentType}的成长导航
          </h4>
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-6">
            <div className="space-y-4">
              {d.explorer.summaryMap.map((item, i) => {
                const bgColors = ['bg-amber-400', 'bg-rose-400', 'bg-[#3B5FD9]']
                const textColors = ['text-amber-800', 'text-rose-800', 'text-teal-800']
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${bgColors[i] || 'bg-gray-400'} rounded-full flex items-center justify-center text-white font-bold shrink-0`}>{item.icon}</div>
                    <div>
                      <p className={`font-bold ${textColors[i] || 'text-gray-800'}`}>{item.title}</p>
                      <p className="text-gray-700">{item.content}</p>
                      <p className="text-sm text-gray-500 mt-1">→ {item.note}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReportIdentityCard
