/**
 * TalentPersonaCard.tsx - 天赋人设海报卡片
 *
 * L1 社交货币层核心组件
 * 功能: 展示天赋头衔、灵魂一句话、闪光标签、朋友圈文案
 * 目标: 让家长愿意截图发朋友圈，自带裂变属性
 */

import React, { useState } from 'react'
import { Share2, Copy, Check, Sparkles } from 'lucide-react'
import { generateSocialCurrency, type SocialCurrency } from '../lib/socialCurrencyEngine'
import type { DynamicReportData } from '../lib/reportContentGenerator'

// ========== Props 接口 ==========

export interface TalentPersonaCardProps {
  /** 报告数据 */
  reportData: DynamicReportData
  /** 是否展开显示朋友圈文案 */
  showMomentsText?: boolean
}

// ========== 天赋人设海报组件 ==========

export const TalentPersonaCard: React.FC<TalentPersonaCardProps> = ({
  reportData: d,
  showMomentsText = true
}) => {
  const [copied, setCopied] = useState(false)
  const [showFullMoments, setShowFullMoments] = useState(false)

  // 生成社交货币
  const socialCurrency: SocialCurrency = generateSocialCurrency({
    name: d.student.name,
    profileCode: d.profileCode,
    wilderScores: d.wilderScores,
    wilderPercentiles: d.wilderPercentiles,
    talentTypeName: d.talentType,
    talentTypeKey: d.talentType30Key || ''
  })

  // 复制朋友圈文案
  const handleCopyMoments = async () => {
    try {
      await navigator.clipboard.writeText(socialCurrency.momentsText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = socialCurrency.momentsText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <section id="section-talent-persona" className="relative overflow-hidden">
      {/* 主卡片 - 渐变背景 */}
      <div className="bg-gradient-to-br from-[#0A0A1A] via-[#1a1a3e] to-[#0A0A1A] text-white p-6 sm:p-8 relative">
        {/* 装饰性背景图案 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FDD22B] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#3B5FD9] rounded-full blur-3xl"></div>
        </div>

        {/* 顶部标签 */}
        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FDD22B]" />
            <span className="text-[#FDD22B] text-xs font-bold tracking-wider uppercase">
              天赋人设解码
            </span>
          </div>
          <span className="text-[rgba(255,255,255,0.4)] text-[10px] tracking-wider">
            WILDER-729 内核
          </span>
        </div>

        {/* 天赋头衔 - 核心展示区 */}
        <div className="relative mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight">
            {socialCurrency.talentTitle}
          </h1>
        </div>

        {/* 灵魂一句话 */}
        <div className="relative mb-8">
          <div className="border-l-4 border-[#FDD22B] pl-4 py-2 bg-white/5 backdrop-blur-sm rounded-r-lg">
            <p className="text-lg sm:text-xl font-medium leading-relaxed text-white/90 italic">
              "{socialCurrency.soulSentence}"
            </p>
          </div>
        </div>

        {/* 三个闪光标签 */}
        <div className="relative mb-6">
          <div className="flex flex-wrap gap-3">
            {socialCurrency.shiningTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold transition-transform hover:scale-105"
                style={{
                  background: index === 0
                    ? 'linear-gradient(135deg, #FDD22B 0%, #FFB800 100%)'
                    : index === 1
                      ? 'linear-gradient(135deg, #3B5FD9 0%, #5B7FE9 100%)'
                      : 'linear-gradient(135deg, #0F9D94 0%, #2FBDB4 100%)',
                  color: index === 0 ? '#0A0A1A' : '#FFFFFF'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 视觉意象 - 可选展示 */}
        <div className="relative mb-6 opacity-70">
          <p className="text-sm text-white/60 italic">
            {socialCurrency.visualMetaphor}
          </p>
        </div>

        {/* 朋友圈文案区域 */}
        {showMomentsText && (
          <div className="relative mt-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#FDD22B]" />
                  <span className="text-[#FDD22B] text-xs font-bold tracking-wider">
                    朋友圈文案预设
                  </span>
                </div>
                <button
                  onClick={handleCopyMoments}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:bg-[#FDD22B]/20"
                  style={{
                    background: copied ? 'rgba(34,197,94,0.2)' : 'rgba(253,210,43,0.1)',
                    color: copied ? '#22c55e' : '#FDD22B'
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      复制文案
                    </>
                  )}
                </button>
              </div>

              <div
                className={`text-sm text-white/80 leading-relaxed ${!showFullMoments ? 'line-clamp-3' : ''}`}
                onClick={() => setShowFullMoments(!showFullMoments)}
              >
                {socialCurrency.momentsText}
              </div>

              {/* 展开提示 */}
              {!showFullMoments && socialCurrency.momentsText.length > 100 && (
                <button
                  onClick={() => setShowFullMoments(true)}
                  className="mt-2 text-[#FDD22B] text-xs underline hover:no-underline"
                >
                  展开全文
                </button>
              )}
            </div>
          </div>
        )}

        {/* 底部品牌签名 */}
        <div className="relative mt-8 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FDD22B] flex items-center justify-center">
                <span className="text-[#0A0A1A] font-black text-xs">W</span>
              </div>
              <div>
                <p className="text-white/60 text-[10px]">GrowMate · WILDER 科创潜能评估</p>
                <p className="text-white/40 text-[10px]">基于 WILDER-729 内核生成</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#FDD22B] text-xs font-bold">{d.talentType}</p>
              <p className="text-white/40 text-[10px]">{d.profileCode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 下方提示条 */}
      <div className="bg-gradient-to-r from-[#FDD22B]/10 to-[#3B5FD9]/10 px-6 py-3 border-t border-[#FDD22B]/20">
        <p className="text-center text-xs text-[rgba(10,10,26,0.6)]">
          长按保存图片，分享给家人朋友
          <span className="mx-2 text-[rgba(10,10,26,0.2)]">|</span>
          点击"复制文案"一键发朋友圈
        </p>
      </div>
    </section>
  )
}

export default TalentPersonaCard
