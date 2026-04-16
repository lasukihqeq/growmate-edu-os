/**
 * ReportGrowthPath.tsx - 成长路径组件
 * 
 * 功能: 报告的成长路径章节 (Ch.4 + Ch.5)
 * 包含:
 * - Ch.4 能力投资部分（资源配置、家庭教育原则、护城河构建）
 * - Ch.5 年度行动路线图
 *   - 12个月季度计划（Q1-Q4）
 *   - 14天详细计划
 *   - 90天周计划
 *   - 沟通脚本库（鼓励、提问、边界、冲突、动机）
 */

import React from 'react'
import { Wallet, Home, Shield, Calendar, BookOpen, MessageCircle, CheckCircle2, Clock, Target } from 'lucide-react'
import { ReportSectionHeader } from './ui/ReportSectionHeader'
import { BaseCard } from './ui/BaseCard'
import type { DynamicReportData } from '../lib/reportContentGenerator'

// ========== Props 接口 ==========
export interface ReportGrowthPathProps {
  /** 报告数据 */
  reportData: DynamicReportData
  /** 章节追踪函数 */
  trackSection?: (element: HTMLElement | null) => void
}

// ========== 颜色辅助函数 ==========
const COLOR_MAP: Record<string, { bg: string; text: string; border: string; light: string; iconBg: string }> = {
  green: { 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-800', 
    border: 'border-emerald-200', 
    light: 'bg-emerald-100',
    iconBg: 'bg-emerald-500'
  },
  blue: { 
    bg: 'bg-blue-50', 
    text: 'text-blue-800', 
    border: 'border-blue-200', 
    light: 'bg-blue-100',
    iconBg: 'bg-blue-500'
  },
  purple: { 
    bg: 'bg-violet-50', 
    text: 'text-violet-800', 
    border: 'border-violet-200', 
    light: 'bg-violet-100',
    iconBg: 'bg-violet-500'
  },
  amber: { 
    bg: 'bg-amber-50', 
    text: 'text-amber-800', 
    border: 'border-amber-200', 
    light: 'bg-amber-100',
    iconBg: 'bg-amber-500'
  },
  cyan: { 
    bg: 'bg-cyan-50', 
    text: 'text-cyan-800', 
    border: 'border-cyan-200', 
    light: 'bg-cyan-100',
    iconBg: 'bg-cyan-500'
  },
  rose: { 
    bg: 'bg-rose-50', 
    text: 'text-rose-800', 
    border: 'border-rose-200', 
    light: 'bg-rose-100',
    iconBg: 'bg-rose-500'
  },
}

function getColor(c: string) {
  return COLOR_MAP[c] || COLOR_MAP.blue
}

// ========== 章节洞察组件 ==========
function SectionInsight({ text, type = 'info' }: { text: string; type?: 'info' | 'action' | 'key' }) {
  const styles = {
    info: 'bg-[rgba(59,95,217,0.04)] border-l-ws-primary',
    action: 'bg-ws-success-bg border-l-ws-success',
    key: 'bg-ws-accent-bg border-l-ws-accent',
  }
  
  return (
    <div className={`border-l-4 rounded-r-lg p-4 ${styles[type]}`}>
      <p className="text-sm text-ws-text-primary leading-relaxed">{text}</p>
    </div>
  )
}

/**
 * 报告成长路径组件
 */
export const ReportGrowthPath: React.FC<ReportGrowthPathProps> = ({
  reportData: d,
  trackSection,
}) => {
  return (
    <>
      {/* ========== Chapter 4: 能力发展与投资策略 ========== */}
      <section id="section-ch4" ref={trackSection} className="page-break py-8">
        <ReportSectionHeader
          variant="growth"
          title="能力发展与投资策略"
          subtitle="Investment Strategy · 资源配置与护城河构建"
        />

        <div className="p-6 space-y-6">
          {/* 核心洞察 */}
          <SectionInsight 
            text={`培养策略：70%精力巩固${d.sortedDims[0]?.name}+${d.sortedDims[1]?.name}优势，30%精力提升${d.sortedDims[d.sortedDims.length-1]?.name}。`} 
            type="action" 
          />

          {/* 资源配置黄金比例 */}
          <BaseCard variant="insight" title="资源配置黄金比例" icon={Wallet}>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {/* 优势深耕 */}
              <div className="bg-white rounded-xl p-4 text-center border-2 border-ws-success">
                <div className="text-4xl font-black text-ws-success mb-2">60%</div>
                <h5 className="font-bold text-ws-text-primary">优势深耕</h5>
                <p className="text-sm text-ws-text-secondary mt-2">
                  投入到{d.sortedDims[0]?.name}和{d.sortedDims[1]?.name}
                </p>
                <p className="text-xs text-ws-success mt-1">让强项更强</p>
              </div>
              
              {/* 潜力激活 */}
              <div className="bg-white rounded-xl p-4 text-center border-2 border-ws-accent">
                <div className="text-4xl font-black text-ws-accent mb-2">30%</div>
                <h5 className="font-bold text-ws-text-primary">潜力激活</h5>
                <p className="text-sm text-ws-text-secondary mt-2">
                  投入到中等维度的定向提升
                </p>
                <p className="text-xs text-ws-accent mt-1">挖掘潜能</p>
              </div>
              
              {/* 底线保障 */}
              <div className="bg-white rounded-xl p-4 text-center border-2 border-ws-warning">
                <div className="text-4xl font-black text-ws-warning mb-2">10%</div>
                <h5 className="font-bold text-ws-text-primary">底线保障</h5>
                <p className="text-sm text-ws-text-secondary mt-2">
                  投入到{d.sortedDims.slice(-2).map(s => s.name).join('和')}
                </p>
                <p className="text-xs text-ws-warning mt-1">补强不补齐</p>
              </div>
            </div>
          </BaseCard>

          {/* 家庭教育原则 */}
          <BaseCard variant="default" title="家庭教育原则" icon={Home}>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-ws-success-bg rounded-xl p-4 border border-ws-success-border">
                <h5 className="font-bold text-ws-success mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  推荐做法
                </h5>
                <ul className="text-sm text-ws-text-secondary space-y-1">
                  <li>• 用问题引导，给予探索空间</li>
                  <li>• 关注过程而非仅看结果</li>
                  <li>• 允许试错，保护好奇心</li>
                  <li>• 定期复盘，庆祝小进步</li>
                </ul>
              </div>
              <div className="bg-ws-warning-bg rounded-xl p-4 border border-ws-warning-border">
                <h5 className="font-bold text-ws-warning mb-2">需要避免</h5>
                <ul className="text-sm text-ws-text-secondary space-y-1">
                  <li>• 强制长时间专注</li>
                  <li>• 横向比较或过度干预</li>
                  <li>• 只关注分数和排名</li>
                  <li>• 包办代替，剥夺探索机会</li>
                </ul>
              </div>
            </div>
          </BaseCard>

          {/* 护城河构建策略 */}
          <BaseCard variant="advantage" title="护城河构建策略" icon={Shield}>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white rounded-xl p-4 border border-ws-primary-border">
                <h5 className="font-bold text-ws-primary mb-2">核心护城河</h5>
                <p className="text-sm text-ws-text-secondary mb-3">
                  {d.sortedDims[0]?.name}({d.sortedDims[0]?.score}分) + {d.sortedDims[1]?.name}({d.sortedDims[1]?.score}分)
                </p>
                <div className="bg-ws-primary-bg rounded-lg p-3">
                  <p className="text-sm text-ws-primary">
                    形成"发现→验证→表达"的完整闭环，这是AI难以替代的人类独特能力。
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-ws-accent-border">
                <h5 className="font-bold text-ws-accent mb-2">能力叠加策略</h5>
                <p className="text-sm text-ws-text-secondary mb-3">
                  将优势能力与兴趣领域深度融合
                </p>
                <div className="bg-ws-accent-bg rounded-lg p-3">
                  <p className="text-sm text-ws-accent">
                    建议方向：科学探究 × 表达展示 = 科学传播者/科普创作者
                  </p>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </section>

      {/* ========== Chapter 5: 年度行动路线图 ========== */}
      <section id="section-ch5" ref={trackSection} className="page-break py-8">
        <ReportSectionHeader
          variant="growth"
          title="年度行动路线图"
          subtitle="Annual Roadmap · 从习惯建立到突破展望"
        />

        <div className="p-6 space-y-8">
          {/* 核心洞察 */}
          <SectionInsight 
            text="行动比完美更重要。每周3-5小时定向投入，90天即可见到显著变化。" 
            type="action" 
          />

          {/* 12个月季度计划 */}
          <div className="space-y-4">
            <h4 className="font-bold text-ws-text-primary text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-ws-primary" />
              12个月季度规划
            </h4>
            <div className="space-y-4">
              {d.yearlyBlueprint.map((q, i) => {
                const c = getColor(q.color)
                return (
                  <div key={i} className={`border-2 ${c.border} rounded-2xl overflow-hidden`}>
                    <div className={`${c.bg} p-4 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center text-white font-black`}>
                          Q{i + 1}
                        </span>
                        <div>
                          <h5 className={`font-bold ${c.text}`}>{q.quarter}</h5>
                          <p className="text-ws-text-secondary text-sm">{q.theme}</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg px-3 py-1.5">
                        <p className="text-xs text-ws-text-secondary">里程碑</p>
                        <p className={`font-bold ${c.text} text-sm`}>{q.milestone}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {q.goals.map((goal, j) => (
                          <span key={j} className={`${c.light} ${c.text} px-3 py-1.5 rounded-full text-sm flex items-center gap-1`}>
                            <CheckCircle2 className="w-3 h-3" />
                            {goal}
                          </span>
                        ))}
                      </div>
                      {q.retestNote && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <p className="text-sm text-amber-700">{q.retestNote}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 14天快速启动计划 */}
          <div className="space-y-4">
            <h4 className="font-bold text-ws-text-primary text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-ws-primary" />
              14天快速启动计划
            </h4>
            <p className="text-sm text-ws-text-secondary">
              从今天开始，用14天建立第一个好习惯——每天只需10-30分钟。
            </p>
            <div className="space-y-2">
              {d.fourteenDayPlan.map((item, i) => (
                <div 
                  key={i} 
                  className={`flex items-start gap-3 p-3 rounded-lg border ${i < 7 ? 'bg-blue-50 border-blue-100' : 'bg-purple-50 border-purple-100'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${i < 7 ? 'bg-blue-500' : 'bg-purple-500'}`}>
                    {item.day}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-ws-text-primary text-sm">{item.task}</span>
                      <span className="text-xs bg-white text-ws-text-secondary px-2 py-0.5 rounded-full border">
                        {item.duration}
                      </span>
                    </div>
                    <p className="text-xs text-ws-text-secondary mt-0.5">目标：{item.goal}</p>
                    <p className="text-xs text-ws-primary mt-1 italic">
                      家长话术：{item.parentTip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 90天周计划 */}
          <div className="space-y-4">
            <h4 className="font-bold text-ws-text-primary text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-ws-primary" />
              90天行动计划（陪跑清单）
            </h4>
            <p className="text-sm text-ws-text-secondary">
              以下是基于稳健路径的详细执行计划：
            </p>
            <div className="overflow-x-auto rounded-xl border border-ws-border-soft">
              <table className="w-full text-sm">
                <thead className="bg-ws-primary-bg">
                  <tr>
                    <th className="w-16 py-3 px-4 text-left text-ws-primary font-semibold">周次</th>
                    <th className="py-3 px-4 text-left text-ws-primary font-semibold">主任务</th>
                    <th className="w-24 py-3 px-4 text-left text-ws-primary font-semibold">时长</th>
                    <th className="py-3 px-4 text-left text-ws-primary font-semibold">产出物</th>
                    <th className="py-3 px-4 text-left text-ws-primary font-semibold">家长话术</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ws-border-soft">
                  {d.weeklyPlan.map((row, i) => (
                    <tr key={i} className="hover:bg-ws-primary-bg/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-ws-primary">{row.week}</td>
                      <td className="py-3 px-4 font-medium text-ws-text-primary">{row.task}</td>
                      <td className="py-3 px-4 text-ws-text-secondary">{row.duration}</td>
                      <td className="py-3 px-4 text-ws-text-secondary">{row.output}</td>
                      <td className="py-3 px-4 text-ws-primary text-xs">{row.parentScript}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 沟通脚本库 */}
          <div className="space-y-4">
            <h4 className="font-bold text-ws-text-primary text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-ws-primary" />
              家庭沟通脚本库
            </h4>
            
            {/* 鼓励句式 */}
            <BaseCard variant="advantage" title="鼓励句式">
              <div className="space-y-3 mt-3">
                {d.communicationScripts.encouragements.map((item, i) => (
                  <div key={i} className="bg-ws-success-bg border-l-4 border-ws-success p-4 rounded-r-lg">
                    <p className="font-medium text-ws-text-primary">{item.text}</p>
                    <p className="text-sm text-ws-text-secondary mt-1">
                      使用场景：{item.scene}。意图：{item.intent}。
                    </p>
                  </div>
                ))}
              </div>
            </BaseCard>

            {/* 提问句式 */}
            <BaseCard variant="insight" title="提问句式">
              <div className="space-y-3 mt-3">
                {d.communicationScripts.questions.map((item, i) => (
                  <div key={i} className="bg-ws-primary-bg border-l-4 border-ws-primary p-4 rounded-r-lg">
                    <p className="font-medium text-ws-text-primary">{item.text}</p>
                    <p className="text-sm text-ws-text-secondary mt-1">
                      使用场景：{item.scene}。意图：{item.intent}。
                    </p>
                  </div>
                ))}
              </div>
            </BaseCard>

            {/* 边界句式 */}
            <BaseCard variant="risk" title="边界设定句式">
              <div className="space-y-3 mt-3">
                {d.communicationScripts.boundaries.map((item, i) => (
                  <div key={i} className="bg-ws-warning-bg border-l-4 border-ws-warning p-4 rounded-r-lg">
                    <p className="font-medium text-ws-text-primary">{item.text}</p>
                    <p className="text-sm text-ws-text-secondary mt-1">
                      使用场景：{item.scene}。意图：{item.intent}。
                    </p>
                  </div>
                ))}
              </div>
            </BaseCard>
          </div>
        </div>
      </section>
    </>
  )
}

export default ReportGrowthPath
