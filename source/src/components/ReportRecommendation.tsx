/**
 * ReportRecommendation.tsx - 推荐资源组件
 *
 * 功能: 报告的推荐资源章节
 * 包含:
 * - 大学与专业推荐（10岁以上）
 * - BBC纪录片推荐
 * - 阅读书籍推荐
 * - 竞赛推荐
 * - 夏令营与研学推荐
 * - 在线课程推荐
 * - 博物馆与科技馆推荐
 * - 期刊杂志推荐
 */

import React from 'react'
import { Film, BookOpen, GraduationCap, MapPin, Monitor, Building2, Newspaper } from 'lucide-react'
import { ReportSectionHeader } from './ui/ReportSectionHeader'
import { BaseCard } from './ui/BaseCard'
import type { DynamicReportData } from '../lib/reportContentGenerator'
import { getRecommendedDocumentaries } from '../lib/documentaryDatabase'
import { getRecommendedBooks } from '../lib/bookDatabase'
import { getEnhancedUniversityRecommendations, type WilderScores } from '../lib/enhancedMatchingEngine'
import {
  getRecommendedCompetitions,
  getRecommendedSummerCamps,
  getRecommendedOnlineCourses,
  getRecommendedMuseums,
  getRecommendedJournals,
} from '../lib/educationalResourcesDatabase'

// ========== Props 接口 ==========
export interface ReportRecommendationProps {
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
  slate: { bg: 'bg-[rgba(59,95,217,0.04)]', text: 'text-[rgba(10,10,26,0.7)]', border: 'border-[rgba(10,10,26,0.06)]', light: 'bg-[rgba(59,95,217,0.06)]' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', light: 'bg-purple-100' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200', light: 'bg-rose-100' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200', light: 'bg-teal-100' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200', light: 'bg-indigo-100' },
  gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', light: 'bg-gray-100' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-800', border: 'border-violet-200', light: 'bg-violet-100' },
}

function getColor(c: string) {
  return COLOR_MAP[c] || COLOR_MAP.gray
}

/**
 * 报告推荐资源组件
 */
export const ReportRecommendation: React.FC<ReportRecommendationProps> = ({
  reportData: d,
  trackSection,
}) => {
  const wilderScores: WilderScores = {
    W: d.wilderScores.W || 0,
    I: d.wilderScores.I || 0,
    L: d.wilderScores.L || 0,
    D: d.wilderScores.D || 0,
    E: d.wilderScores.E || 0,
    R: d.wilderScores.R || 0,
  }
  const topDims = d.topDims as ('W' | 'I' | 'L' | 'D' | 'E' | 'R')[]

  return (
    <>
      {/* ========== 大学推荐 - 仅对10岁及以上显示 ========== */}
      {Number(d.student.age) >= 10 && (
        <section id="section-university" ref={trackSection} className="page-break py-8">
          <ReportSectionHeader
            variant="courses"
            title="985/211大学与专业推荐"
            subtitle="University Recommendations · 核心资源"
          />

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">
                <strong>数据来源说明：</strong>推荐基于QS/THE/ARWU 2024-2025公开榜单及学科评估结果。依据孩子的
                <strong className="text-blue-600">{d.sortedDims[0]?.name}({d.sortedDims[0]?.score})+{d.sortedDims[1]?.name}({d.sortedDims[1]?.score})</strong>核心优势，
                从<strong>1000+所大学、300+专业</strong>数据库中智能匹配。
              </p>
            </div>

            {/* 潜能匹配精选院校 */}
            {d.talentUniversities && d.talentUniversities.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">★</span>
                  「{d.talentType}」潜能匹配精选院校
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {d.talentUniversities.map((uni, i) => {
                    const tierColors: Record<string, { bg: string; border: string; badge: string }> = {
                      '985': { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
                      '211': { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
                      '一本': { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
                      '国际': { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
                    }
                    const tc = tierColors[uni.tier] || tierColors['一本']
                    return (
                      <div key={i} className={`${tc.bg} border ${tc.border} rounded-xl p-4`}>
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-bold text-gray-800">{uni.name}</h5>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${tc.badge}`}>{uni.tier}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">推荐专业：{uni.major}</p>
                        <p className="text-sm text-gray-600">{uni.reason}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 增强匹配引擎动态获取推荐 */}
            {(() => {
              const enhancedRec = getEnhancedUniversityRecommendations(wilderScores, d.student.age)
              return (
                <>
                  {/* 推荐摘要 */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-700">{enhancedRec.summary}</p>
                  </div>

                  {/* 985大学推荐 */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">985</span>
                      985工程大学推荐（精选{enhancedRec.tier985.length}所）
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {enhancedRec.tier985.slice(0, 6).map((match, i) => (
                        <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-5 h-5 text-red-600" />
                              <h5 className="font-bold text-gray-800">{match.university.name}</h5>
                            </div>
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                              匹配度{match.matchScore}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{match.university.location}</p>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{match.matchReason}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {match.university.strengths.slice(0, 3).map((s, j) => (
                              <span key={j} className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">{s}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 211大学推荐 */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">211</span>
                      211工程大学推荐（精选{enhancedRec.tier211.length}所）
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {enhancedRec.tier211.slice(0, 6).map((match, i) => (
                        <div key={i} className="bg-blue-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-5 h-5 text-blue-600" />
                              <h5 className="font-bold text-gray-800">{match.university.name}</h5>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                              匹配度{match.matchScore}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{match.university.location}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">{match.matchReason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 国际大学推荐 */}
                  {enhancedRec.international.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">G</span>
                        国际顶尖大学推荐（{enhancedRec.international.length}所）
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {enhancedRec.international.slice(0, 4).map((match, i) => (
                          <div key={i} className="bg-purple-50 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-bold text-gray-800">{match.university.name}</h5>
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                                匹配度{match.matchScore}%
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{match.university.location}</p>
                            <p className="text-xs text-gray-500 line-clamp-2">{match.matchReason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </section>
      )}

      {/* ========== 10岁以下兴趣培养方向 ========== */}
      {Number(d.student.age) < 10 && (
        <section id="section-interest-cultivation" ref={trackSection} className="page-break py-8">
          <ReportSectionHeader
            variant="growth"
            title="兴趣培养方向"
            subtitle="Interest Cultivation · 核心资源"
          />

          <div className="p-6 space-y-5">
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                根据{d.student.name}当前的能力特点，以下兴趣方向值得关注和培养。这个年龄段最重要的是<strong className="text-pink-600">保护好奇心、培养探索习惯</strong>，而非过早定向。
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {d.sortedDims.slice(0, 2).map((dim, i) => {
                const interestMap: Record<string, { title: string; activities: string[]; icon: string; color: string }> = {
                  'W': { title: '自然探索类', activities: ['户外观察日记', '自然主题绘本阅读', '小小收藏家（标本、石头等）'], icon: 'W', color: 'amber' },
                  'I': { title: '科学实验类', activities: ['厨房小实验', 'STEM玩具探索', '科学绘本共读'], icon: 'I', color: 'blue' },
                  'L': { title: '社交合作类', activities: ['家庭协作游戏', '邀请朋友一起玩', '角色扮演游戏'], icon: 'L', color: 'rose' },
                  'D': { title: '创意建造类', activities: ['积木/乐高自由搭建', '手工制作', '简单编程游戏'], icon: 'D', color: 'purple' },
                  'E': { title: '表达表演类', activities: ['故事复述', '家庭小剧场', '画画+讲故事'], icon: 'E', color: 'green' },
                  'R': { title: '思维游戏类', activities: ['简单棋类游戏', '找不同/迷宫', '睡前回顾"今天最开心的事"'], icon: 'R', color: 'teal' },
                }
                const interest = interestMap[dim.key] || interestMap['W']
                const c = getColor(interest.color)
                return (
                  <BaseCard key={i} variant="insight" title={interest.title}>
                    <p className="text-xs text-gray-500 mb-3">基于{dim.name}优势</p>
                    <ul className="space-y-2">
                      {interest.activities.map((activity, j) => (
                        <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 ${c.text} rounded-full bg-current`}></span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </BaseCard>
                )
              })}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>培养提醒：</strong>对于{d.student.age}岁的孩子，兴趣是最好的老师。不必追求"系统学习"，而是跟随孩子的好奇心，在玩中学、学中玩。大学/职业方向的规划建议等孩子10岁以后再考虑。
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========== BBC纪录片推荐 ========== */}
      <section id="section-documentary" ref={trackSection} className="page-break py-8">
        <ReportSectionHeader
          variant="courses"
          title="BBC纪录片推荐"
          subtitle="Documentary Recommendations · 核心资源"
        />

        <div className="p-6 space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>推荐依据：</strong>基于{d.student.name}的
              <span className="text-purple-600 font-bold">{d.sortedDims[0]?.name}({d.sortedDims[0]?.score})+{d.sortedDims[1]?.name}({d.sortedDims[1]?.score})</span>
              优势特质，精选以下BBC经典纪录片。这些纪录片能有效激发好奇心、培养科学思维、拓展知识视野。
            </p>
          </div>

          {(() => {
            const recommendedCategories = getRecommendedDocumentaries(topDims, d.student.age, 16)
            const categoryIcons: Record<string, { icon: string; color: string }> = {
              '科学探索': { icon: 'sci', color: 'blue' },
              '自然世界': { icon: 'nat', color: 'green' },
              '历史人文': { icon: 'his', color: 'amber' },
              '科技创新': { icon: 'tec', color: 'purple' },
              '艺术文化': { icon: 'art', color: 'rose' },
              '社会视野': { icon: 'soc', color: 'teal' },
              '地理发现': { icon: 'geo', color: 'indigo' },
              '人物传记': { icon: 'bio', color: 'gray' },
            }

            return (
              <div className="space-y-6">
                {recommendedCategories.slice(0, 4).map((catGroup, catIdx) => {
                  const catInfo = categoryIcons[catGroup.category] || { icon: 'doc', color: 'gray' }
                  const c = getColor(catInfo.color)

                  return (
                    <div key={catIdx}>
                      <h4 className={`font-bold ${c.text} mb-3 flex items-center gap-2`}>
                        <span className={`w-8 h-8 ${c.light} rounded-full flex items-center justify-center text-sm font-bold`}>{catGroup.category.slice(0, 2)}</span>
                        {catGroup.category}（{catGroup.documentaries.length}部）
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {catGroup.documentaries.slice(0, 4).map((doc, docIdx) => (
                          <div key={docIdx} className={`${c.bg} border ${c.border} rounded-xl p-4 hover:shadow-md transition-shadow`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-12 h-12 ${c.light} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <Film className={`w-6 h-6 ${c.text}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-bold text-gray-800 truncate">{doc.title}</h5>
                                  <span className="text-xs text-gray-500">({doc.year})</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{doc.synopsis}</p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <span className="bg-white px-2 py-0.5 rounded-full text-gray-600">评分 {doc.rating}</span>
                                  <span className="bg-white px-2 py-0.5 rounded-full text-gray-600">时长 {doc.duration}</span>
                                  {doc.episodes && <span className="bg-white px-2 py-0.5 rounded-full text-gray-600">{doc.episodes}集</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}

                {/* 观看建议 */}
                <div className="bg-blue-600 rounded-xl p-5 text-white">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <span className="text-lg">建议</span>
                    家长观影指南
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="font-medium mb-1">观前引导</p>
                      <p className="text-blue-100">先问孩子："你觉得这个主题会讲什么？"激发预期。</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="font-medium mb-1">观中互动</p>
                      <p className="text-blue-100">随时暂停讨论："这个现象你怎么理解？"培养思考。</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="font-medium mb-1">观后延伸</p>
                      <p className="text-blue-100">引导孩子分享："最让你惊讶的是什么？"巩固收获。</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </section>

      {/* ========== 书籍推荐 ========== */}
      <section id="section-books" ref={trackSection} className="page-break py-8">
        <ReportSectionHeader
          variant="courses"
          title="阅读书籍推荐"
          subtitle="Book Recommendations · 核心资源"
        />

        <div className="p-6 space-y-6">
          {(() => {
            const bookResult = getRecommendedBooks(topDims, d.student.age)
            const childBooks = bookResult.childBooks
            const parentBooks = bookResult.parentBooks
            const childCategories = [...new Set(childBooks.map(b => b.category))]

            return (
              <div className="space-y-6">
                {/* 孩子书单 */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-sm font-bold">读</span>
                    孩子阅读书单（{childBooks.length}本精选）
                  </h4>
                  <div className="space-y-4">
                    {childCategories.map((category, catIdx) => {
                      const catBooks = childBooks.filter(b => b.category === category)
                      const catColors: Record<string, string> = {
                        '科学探索': 'blue', '自然观察': 'green', '思维训练': 'purple',
                        '人文历史': 'amber', '艺术创意': 'rose', '成长故事': 'teal'
                      }
                      const c = getColor(catColors[category] || 'gray')
                      return (
                        <div key={catIdx}>
                          <h5 className={`font-medium ${c.text} mb-2`}>{category}</h5>
                          <div className="grid md:grid-cols-2 gap-3">
                            {catBooks.slice(0, 4).map((book, bookIdx) => (
                              <div key={bookIdx} className={`${c.bg} border ${c.border} rounded-xl p-4 hover:shadow-md transition-shadow`}>
                                <div className="flex items-start gap-3">
                                  <div className={`w-10 h-10 ${c.light} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <BookOpen className={`w-5 h-5 ${c.text}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-bold text-gray-800 truncate">{book.title}</h5>
                                    <p className="text-xs text-gray-500">{book.author}</p>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{book.synopsis}</p>
                                    {book.ageRange && (
                                      <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-500 mt-2 inline-block">
                                        适合{book.ageRange}岁
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 家长书单 */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-bold">长</span>
                    家长阅读书单（{parentBooks.length}本精选）
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {parentBooks.slice(0, 6).map((book, i) => (
                      <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <h5 className="font-bold text-gray-800">{book.title}</h5>
                        <p className="text-xs text-gray-500">{book.author}</p>
                        <p className="text-sm text-gray-600 mt-2">{book.synopsis}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 阅读建议 */}
                <div className="bg-amber-500 rounded-xl p-5 text-white">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <span className="text-lg">建议</span>
                    阅读指导建议
                  </h4>
                  <p className="text-amber-100">优先选择与{d.sortedDims[0]?.name}相关的书籍，利用优势激发阅读兴趣。</p>
                </div>
              </div>
            )
          })()}
        </div>
      </section>

      {/* ========== 竞赛推荐 ========== */}
      <section id="section-competitions" ref={trackSection} className="page-break py-8">
        <ReportSectionHeader
          variant="growth"
          title="竞赛推荐"
          subtitle="Competition Recommendations · 拓展资源"
        />

        <div className="p-6 space-y-6">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
            <p className="text-sm text-gray-700">
              基于{d.student.name}的<strong className="text-rose-600">{d.sortedDims[0]?.name}+{d.sortedDims[1]?.name}</strong>优势特质，推荐以下适合参与的学科竞赛。
            </p>
          </div>

          {(() => {
            const competitions = getRecommendedCompetitions(topDims, d.student.age, 8)
            const levelColors: Record<string, { bg: string; border: string; badge: string }> = {
              '国际': { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
              '国家级': { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
              '省级': { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
              '市级': { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
            }

            return (
              <div className="grid md:grid-cols-2 gap-4">
                {competitions.map((comp, i) => {
                  const lc = levelColors[comp.level] || levelColors['市级']
                  return (
                    <div key={i} className={`${lc.bg} border ${lc.border} rounded-xl p-4 hover:shadow-md transition-shadow`}>
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-gray-800">{comp.name}</h5>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${lc.badge}`}>{comp.level}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{comp.description}</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <p>适合年级：{comp.gradeRange}</p>
                        <p>备赛周期：{comp.preparationTime}</p>
                        <p>收益：{comp.benefit}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </section>

      {/* ========== 夏令营与研学推荐 ========== */}
      <section id="section-camps" ref={trackSection} className="page-break py-8">
        <ReportSectionHeader
          variant="growth"
          title="夏令营与研学推荐"
          subtitle="Summer Camps · 拓展资源"
        />

        <div className="p-6 space-y-6">
          {(() => {
            const camps = getRecommendedSummerCamps(topDims, d.student.age, 6)
            const typeIcons: Record<string, { icon: string; color: string }> = {
              '学术': { icon: '学', color: 'blue' },
              '科技': { icon: '科', color: 'purple' },
              '艺术': { icon: '艺', color: 'rose' },
              '体育': { icon: '体', color: 'green' },
              '综合': { icon: '综', color: 'amber' },
            }

            return (
              <div className="grid md:grid-cols-2 gap-4">
                {camps.map((camp, i) => {
                  const tc = typeIcons[camp.type] || typeIcons['综合']
                  const c = getColor(tc.color)
                  return (
                    <div key={i} className={`${c.bg} border ${c.border} rounded-xl p-4 hover:shadow-md transition-shadow`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-8 h-8 ${c.light} rounded-lg flex items-center justify-center text-sm font-bold ${c.text}`}>{tc.icon}</span>
                          <h5 className="font-bold text-gray-800">{camp.name}</h5>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.light} ${c.text}`}>{camp.type}</span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {camp.location}</p>
                        <p>时长：{camp.duration} | 适合：{camp.gradeRange}</p>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{camp.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {camp.highlights.slice(0, 3).map((h, j) => (
                          <span key={j} className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">{h}</span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </section>

      {/* ========== 在线课程推荐 ========== */}
      <section id="section-course-match" ref={trackSection} className="page-break py-8">
        <ReportSectionHeader
          variant="courses"
          title="在线课程推荐"
          subtitle="Online Courses · 拓展资源"
        />

        <div className="p-6 space-y-6">
          {(() => {
            const courses = getRecommendedOnlineCourses(topDims, d.student.age, 6)
            const difficultyColors: Record<string, { bg: string; badge: string }> = {
              '入门': { bg: 'bg-green-50', badge: 'bg-green-100 text-green-700' },
              '进阶': { bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
              '高级': { bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700' },
            }

            return (
              <div className="grid md:grid-cols-2 gap-4">
                {courses.map((course, i) => {
                  const dc = difficultyColors[course.difficulty] || difficultyColors['入门']
                  return (
                    <div key={i} className={`${dc.bg} border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-5 h-5 text-gray-600" />
                          <h5 className="font-bold text-gray-800">{course.name}</h5>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${dc.badge}`}>{course.difficulty}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{course.platform} | {course.subject} | {course.duration}</p>
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {course.skills.map((skill, j) => (
                          <span key={j} className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </section>

      {/* ========== 博物馆与科技馆推荐 ========== */}
      <section id="section-museums" ref={trackSection} className="page-break py-8">
        <ReportSectionHeader
          variant="growth"
          title="博物馆与科技馆推荐"
          subtitle="Museums · 拓展资源"
        />

        <div className="p-6 space-y-6">
          {(() => {
            const museums = getRecommendedMuseums(topDims, 5)

            return (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {museums.map((museum, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div>
                        <h5 className="font-bold text-gray-800">{museum.name}</h5>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {museum.city} | {museum.type}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">推荐展馆：</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {museum.highlights.slice(0, 3).map((h, j) => (
                            <span key={j} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{h}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">适合年龄：{museum.recommendedAge}</p>
                      <p className="text-xs text-gray-600 bg-gray-50 rounded p-2">{museum.visitTips}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      </section>

      {/* ========== 期刊杂志推荐 ========== */}
      <section id="section-journals" ref={trackSection} className="page-break py-8">
        <ReportSectionHeader
          variant="courses"
          title="期刊杂志订阅推荐"
          subtitle="Journals · 拓展资源"
        />

        <div className="p-6 space-y-6">
          {(() => {
            const journals = getRecommendedJournals(topDims, d.student.age, 4)

            return (
              <div className="grid md:grid-cols-2 gap-4">
                {journals.map((journal, i) => (
                  <div key={i} className="bg-orange-50 border border-orange-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Newspaper className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-800">{journal.name}</h5>
                        <p className="text-xs text-gray-500">{journal.frequency} | {journal.ageRange}</p>
                        <p className="text-sm text-gray-600 mt-2">{journal.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {journal.sampleTopics.map((topic, j) => (
                            <span key={j} className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">{topic}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      </section>
    </>
  )
}

export default ReportRecommendation
