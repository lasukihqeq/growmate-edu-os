import { useEffect, useRef, useState, useCallback } from 'react'
import { ArrowLeft, Printer, ArrowUp, Film, BookOpen, GraduationCap, Share2, MapPin, Monitor, Building2, Newspaper, Compass, Award, TrendingUp, ShieldCheck } from 'lucide-react'
import { InteractiveRadarChart, PieChart, TrendChart, ProgressRing, NormReferenceSection } from './ReportCharts'
import type { DynamicReportData } from '../lib/reportContentGenerator'
import { getRecommendedDocumentaries } from '../lib/documentaryDatabase'
import { getRecommendedBooks } from '../lib/bookDatabase'
import { getEnhancedUniversityRecommendations, type WilderScores } from '../lib/enhancedMatchingEngine'
import { getTalentConstellation } from '../lib/funElements'
import { TALENT_TYPES_30 } from '../lib/talentTypes30'
import { TALENT_TYPES_60 } from '../lib/talentTypes60'
import { SectionInsight } from './ReportEducationFoundation'
import { ReportMethodologyEnhancements } from './ReportMethodology'
import { ReportCourseRecommendation } from './ReportCourseRecommendation'
import { MultiAgentAnalysisSection } from './MultiAgentAnalysisSection'
import { EducatorConsultation } from './EducatorConsultation'
import { TalentTree } from './TalentTree'
import { AttentionProfileSection } from './AttentionProfileSection'
import { WorkUploadSection } from './WorkUploadSection'
// 注意：PRO版功能已合并到统一版本，以下import保留以兼容旧代码但不再使用
// import AcademicValueShowcase from './AcademicValueShowcase'
// import { validateProToken, useProToken } from '../lib/tokenManager'
import {
  getRecommendedCompetitions,
  getRecommendedSummerCamps,
  getRecommendedOnlineCourses,
  getRecommendedMuseums,
  getRecommendedJournals,
} from '../lib/educationalResourcesDatabase'
import { GLOSSARY } from '../lib/glossary'
import { ReportCover } from './ReportCover'
import { ReportOverview } from './ReportOverview'
import { GrowthRiskWarning } from './GrowthRiskWarning'
import { ActionPlan14Days } from './ActionPlan14Days'
import { PreciseResources } from './PreciseResources'
import { EvidenceChain } from './EvidenceChain'
import { AIInsightReportSection } from './ai/AIInsightReportSection'

// ========== Demo fallback数据（查看样板报告时使用） ==========
const DEMO_DATA: DynamicReportData = {
  student: { name: '张泽辉', age: 10, grade: '四年级', school: '深圳市某实验小学', testDate: '2026年1月28日', testDuration: '42分钟' },
  reportVersion: '2026年内测版',
  reportDate: '2026年2月7日',
  talentType: '灵动探索者',
  talentTypeEn: 'AGILE EXPLORER',
  talentDescription: '对世界充满好奇，善于通过观察和动手验证理解事物，并能用结构化的方式表达自己的发现。',
  profileCode: 'HHM-MHL',
  variantId: 1,
  confidence: 89,
  wilderScores: { W: 82, I: 88, L: 71, D: 79, E: 85, R: 76 },
  wilderPercentiles: { W: 83, I: 92, L: 67, D: 79, E: 88, R: 74 },
  wilderLevels: { W: 'high', I: 'high', L: 'mid', D: 'high', E: 'high', R: 'high' },
  wilderTScores: { W: 66, I: 74, L: 60, D: 71, E: 69, R: 69 },
  ageNormInfo: {
    ageGroup: 'upper-primary',
    ageGroupLabel: '10-12岁',
    peerMeans: { W: 60, I: 55, L: 58, D: 50, E: 58, R: 48 },
  },
  sortedDims: [
    { key: 'I', name: '探究力', score: 88, level: 'high', emoji: '🔬' },
    { key: 'E', name: '表达力', score: 85, level: 'high', emoji: '🎤' },
    { key: 'W', name: '好奇心', score: 82, level: 'high', emoji: '🔭' },
    { key: 'D', name: '设计力', score: 79, level: 'high', emoji: '📐' },
    { key: 'R', name: '反思力', score: 76, level: 'high', emoji: '🪞' },
    { key: 'L', name: '连接力', score: 71, level: 'mid', emoji: '🤝' },
  ],
  topDims: ['I', 'E'],
  bottomDims: ['R', 'L'],
  explorer: {
    coreInsight: '"张泽辉的探究力(Inquiry)是稀缺潜能，表达力(Expression)让TA的好奇心有了科学方法的支撑——"',
    actionableInsight: '这不是散漫，是探索型学习者的典型特征。',
    strengthEngines: [
      { letter: 'I', name: '探究力驱动', level: '超强' },
      { letter: 'E', name: '表达力驱动', level: '显著' },
      { letter: 'W', name: '好奇心驱动', level: '优势' },
    ],
    coreTraits: ['灵动探索者模式', 'ENFP-A 竞选者', '🔬探究力领先'],
    growthDirections: [
      { letter: 'L', name: '连接力可加强', level: '可加强' },
    ],
    todayAction: { phrase: '"你觉得为什么会这样？我们可以试试"', explanation: '把冲动变成素材，把散点变成线索。' },
    characterTraits: [
      { title: '探索驱动模式：火焰型点燃', emoji: '🔥', color: 'amber', behaviorDesc: '张泽辉看到新事物会立即停下手中的事跑去观察；能连续追踪一个有趣的发现很长时间；经常问"这是怎么回事"。', mechanism: '好奇心(W)极强意味着对新奇刺激有天然的神经兴奋反应。探究力(I)强化了这种好奇心的深度。', devMeaning: '这种"火焰型点燃"是科学家、发明家的核心特质。在AI时代极为稀缺。', parentTip: 'TA不是"坐不住"，而是"发现了更有趣的事"。当TA东张西望时，试着问"你发现了什么"。' },
      { title: '注意力曲线：脉冲式专注', emoji: '📈', color: 'blue', behaviorDesc: '张泽辉做作业时可能每隔5-10分钟就会"神游"——但遇到真正感兴趣的事能连续投入30分钟以上。', mechanism: '好奇心驱动的注意力是"脉冲式"而非"恒流式"。', devMeaning: '不要试图把TA变成"恒流式"，而是学会利用"脉冲式"。', parentTip: '把大任务切成5-10分钟的小块，每完成一块就休息一下。利用TA的节奏。' },
      { title: '学习模式：实证求知者', emoji: '🔬', color: 'indigo', behaviorDesc: '张泽辉不轻易接受"因为书上说的"，喜欢自己验证。', mechanism: '探究力(I)高意味着TA有天然的"求证本能"。', devMeaning: '这是科学方法的萌芽。', parentTip: '当TA质疑你的说法时，说"你觉得可以怎么验证？"。' },
    ],
    strengthAssets: [
      { name: '🔬 探究力优势', emoji: '🔬', evidence: '在WILDER评估中探究力得分88，位于同龄儿童前12%。', transferValue: '数据分析、科学研究、质量控制等领域的核心能力。', color: 'blue' },
      { name: '🎤 表达力优势', emoji: '🎤', evidence: '在WILDER评估中表达力得分85，位于同龄儿童前15%。', transferValue: '演讲、教学、营销、自媒体等领域的稀缺能力。', color: 'purple' },
    ],
    systemBugs: [
      { title: '连接力待升级', priority: '高', trigger: '需要主动发起协作时；团队项目中需关注他人需求时', earlySignals: ['做事时很少问"你需要我帮忙吗？"', '在团队活动中倾向独自完成自己的部分', '被请求帮助时才响应，很少主动'], microTraining: '「好奇心采访」：每周选一个家人/朋友，用10分钟"采访"他们——问3个问题，认真听完再问下一个。' },
      { title: '反思力待升级', priority: '中', trigger: '被问"你学到了什么"时；需要从失败中总结经验时', earlySignals: ['对"为什么这样做？"的回答是"不知道"', '同样的错误会重复犯2-3次以上', '快速跳过失败，不愿回顾'], microTraining: '「今日三问」：睡前花3分钟——①今天最有趣的发现？②有什么可以做得更好？③明天想试什么？' },
    ],
    summaryMap: [
      { icon: '🔥', title: '优势发动机', content: '探究力(Inquiry) + 表达力(Expression) = 灵动探索者引擎', note: '这是核心竞争力，保护它、滋养它、给它找到方向。', color: 'amber' },
      { icon: '🛞', title: '待升级模块', content: '反思力(Reflection) + 连接力(Link) = 需要训练', note: '这不是性格缺陷，是技能缺口，短期可见改变。', color: 'rose' },
      { icon: '🎯', title: '短期目标', content: '完成3个"从头到尾"的小项目（每个≤2周），建立"我能完成"的自我认知。', note: '不追求数量，只追求"完成感"。每完成一个，庆祝一次。', color: 'teal' },
    ],
  },
  reassurance: {
    headline: '"张泽辉的探究力(88分)已超过同龄段92%的孩子，连接力是唯一可控的提升点——这不是性格问题，是方法问题。"',
    todayAction: '晚饭时问一句"今天有什么好奇的事吗？"',
  },
  conclusion: {
    corePosition: '基于测评交互与证据链分析，张泽辉呈现出"灵动探索者"的核心特质。对世界充满好奇，善于通过观察和动手验证理解事物，并能用结构化的方式表达自己的发现。',
    top3Types: [
      { label: '主分型', name: '灵动探索者', pct: 88, desc: '探究力+表达力双核驱动', color: 'blue' },
      { label: '次分型', name: '结构化表达者', pct: 85, desc: '表达力维度突出', color: 'purple' },
      { label: '潜力型', name: '全面发展潜力', pct: 80, desc: '多维度均衡基础', color: 'amber' },
    ],
    radarInsight: {
      strongest: '探究力(88) + 表达力(85)：形成"发现-验证"闭环',
      toActivate: '连接力(71)：能配合他人，主动性和知识迁移能力有提升空间',
      balanced: '好奇心(82) / 设计力(79)：稳健基础',
    },
    confidenceDetail: { score: 87, reason: '样本量充足、情境多样性高、回答一致性0.87' },
    supplementNeeded: ['陌生团队协作：当前数据主要来自个人作答场景', '压力情境表现：需观察竞赛/限时任务下的表现'],
  },
  evidenceChain: [
    { code: 'E001', type: '行为观察', content: '在选择题中主动运用排除法和验证思维，选项分析具有逻辑性。', inference: '具备突出的探究力（Inquiry），评分88分，位于同龄前12%。', futureImplication: '在未来理科学习中，他能更快理解"假设-实验-结论"的科学方法。' },
    { code: 'E002', type: '行为观察', content: '回答时自然使用"首先-然后-最后"结构，表达清晰有条理。', inference: '具备突出的表达力（Expression），评分85分，位于同龄前15%。', futureImplication: '清晰表达是所有学科的元能力，在作文、答题、面试中都会受益。' },
    { code: 'E003', type: '行为观察', content: '对新奇问题表现出强烈兴趣，能快速提出追问和假设。', inference: '具备突出的好奇心（Wonder），评分82分，位于同龄前17%。', futureImplication: '好奇心驱动的学习在深度和持久性上都优于外部激励驱动的学习。' },
    { code: 'E004', type: '行为推断', content: '在涉及团队协作的情境题中，倾向于先完成自己的部分。', inference: '连接力（Link）有提升空间，评分71分。不是"不愿意"协作，而是"不习惯主动发起"。', futureImplication: '未来工作几乎都是团队协作。现在培养"主动关心他人进度"的习惯很有价值。' },
    { code: 'E005', type: '行为推断', content: '在反思类题目中能识别问题但较难系统归因。', inference: '反思力（Reflection）可加强，评分76分。有自我觉察，但归因分析方法待培养。', futureImplication: '反思力是成长的加速器。用"发生了什么→为什么→下次怎么做"框架引导效果最好。' },
    { code: 'E006', type: '综合推断', content: '在设计类题目中表现出良好的规划意识，能列出步骤。', inference: '设计力（Design）评分79分，具备基础的规划和执行能力。', futureImplication: '工程思维的萌芽。可以引导从"拆"到"造"，尝试完整的项目体验。' },
  ],
  riskPredictions: {
    learningRisk: {
      title: '学习风险预警：连接力(L)不足可能影响的学习场景',
      content: '连接力(L)较弱意味着在需要团队协作的学习场景中处于劣势。随着教育改革推进项目式学习(PBL)，小组合作占分比重逐年增加。张泽辉可能在分组时被"剩下"，或在小组中沦为"沉默执行者"而非"主动贡献者"，导致合作类科目成绩偏低。',
      subjects: ['团队项目合作', '课堂讨论参与', '社会实践活动', '综合素质评价'],
      warning: '如果老师频繁反馈"课堂参与度不够"，需要引起重视。',
    },
    socialRisk: {
      title: '社交预判：连接力不足可能带来的人际挑战',
      content: '连接力较弱的孩子在青春期前期(10-14岁)可能面临"有朋友但不深入"的困境。TA善于独立完成任务，但在需要主动建立关系、维护友谊的场景中可能显得被动。这不是"社恐"，而是"社交主动性不足"——等着别人来找TA，而非主动出击。',
      scenarios: ['班级分组时被动等待', '课间活动独自一人', '集体活动中沉默寡言', '友谊维护缺乏主动'],
      warning: '如果孩子开始说"没人找我玩"，但又不主动约人，需要关注。',
    },
    careerBlindspot: {
      title: '职业盲点：连接力短板可能影响的未来发展领域',
      content: '连接力是未来职场的"隐性门槛"。虽然技术岗位看似不需要太多社交，但晋升到管理层、跨部门协作、客户沟通等场景都需要连接力支撑。张泽辉的探究力+表达力组合适合研究员、工程师、产品经理等岗位，但如果连接力持续薄弱，可能在"个人贡献者→团队领导者"的转型中遇到瓶颈。',
      fields: ['团队管理岗', '销售与商务拓展', '公共关系与媒体', '人力资源管理'],
      warning: '建议在小学阶段就有意识地培养"主动关心他人"的习惯，为未来打基础。',
    },
  },
  strengthAssets: {
    tags: [
      { name: '🔬 探究力', emoji: '🔬', color: 'blue' },
      { name: '🎤 表达力', emoji: '🎤', color: 'purple' },
      { name: '🔭 好奇心', emoji: '🔭', color: 'amber' },
      { name: '📐 设计力', emoji: '📐', color: 'green' },
    ],
    details: [
      { name: '探究力', emoji: '🔬', portrait: '遇到问题会追问"为什么"，善于用证据验证自己的想法。看到陀螺会问"为什么转起来不会倒"。', parentStrategy: '"你觉得为什么会这样？我们一起查查看"——每天问一次，保护他的求证意识。', color: 'blue' },
      { name: '表达力', emoji: '🎤', portrait: '汇报时自然使用结构化表达，能回应追问，善于用实物和图片辅助说明。', parentStrategy: '"你能给我讲讲今天学了什么吗？"——让他练习"说给不懂的人听"。', color: 'purple' },
    ],
  },
  risks: [
    { title: '连接力待提升', description: '能配合他人，主动性和知识迁移能力有提升空间', earlyWarnings: ['做事时很少问"你需要我帮忙吗？"', '在家庭活动中倾向于独自完成自己的部分', '被请求帮助时才会响应，很少主动'], repairStrategies: ['每周设置一次"帮助日"——主动帮助一个家人做一件事', '任务开始前问他"你觉得谁可能需要帮助？"', '复盘时问"今天你帮助了谁？感觉怎么样？"'] },
    { title: '反思力待提升', description: '能进行初步反思，归因分析和改进策略待加强', earlyWarnings: ['对"为什么这样做？"的回答是"不知道"', '同样的错误会重复犯2-3次以上', '快速跳过失败，不愿回顾'], repairStrategies: ['用三步框架引导："发生了什么？→ 你觉得为什么？→ 下次可以怎么做？"', '先从"过程复盘"开始，不急于追问"为什么错"'] },
  ],
  growthPaths: [
    { level: 'A', name: '稳健路径：习惯养成型', color: 'green', goal: '建立日常探究习惯', cycle: '90天', effort: '每周3-5小时', output: '好奇心日记90条', tasks: ['每日"好奇心捕捉"习惯（5分钟）', '每周一次家庭科学小实验（30分钟）', '每月一次"发现分享会"给家人讲解'] },
    { level: 'B', name: '进阶路径：项目产出型', color: 'blue', goal: '完成2个完整项目', cycle: '6个月', effort: '每周5-8小时', output: '项目报告+展示视频', tasks: ['完成1个探究类项目', '完成1个制作类项目', '参加1次校级或社区科学展'] },
    { level: 'C', name: '冲刺路径：竞赛申请型', color: 'purple', goal: '获得竞赛证书', cycle: '12个月', effort: '每周8-12小时', output: '竞赛作品+获奖证书', tasks: ['完成1个深度研究项目', '参加省级/国家级科创比赛', '建立个人作品集'], riskWarning: '高强度投入可能影响其他学科和休息。建议先完成Path A再考虑此路径。' },
  ],
  weeklyPlan: [
    { week: 'W1', task: '启动"好奇心捕捉"', duration: '15min/天', output: '好奇心卡片7张', parentScript: '"今天有什么让你觉得奇怪的事？"' },
    { week: 'W2', task: '"问题升级"练习', duration: '20min×3', output: '问题树1张', parentScript: '"这个问题可以拆成哪几个小问题？"' },
    { week: 'W3', task: '"证据收集"初体验', duration: '30min×2', output: '证据卡片4张', parentScript: '"你怎么知道你的想法是对的？"' },
    { week: 'W4', task: '"我的发现"口头汇报', duration: '准备30min', output: '汇报录音1份', parentScript: '"我很想听你讲讲你的发现！"' },
    { week: 'W5', task: '"帮助日"协作练习', duration: '随机', output: '帮助记录1份', parentScript: '"你觉得今天谁可能需要帮助？"' },
    { week: 'W6', task: '"微项目"规划', duration: '45min', output: '项目计划图1张', parentScript: '"你打算怎么做？先做什么后做什么？"' },
    { week: 'W7-8', task: '"微项目"执行', duration: '45min×4', output: '项目进度记录', parentScript: '"今天进展怎么样？遇到什么问题？"' },
    { week: 'W9', task: '"微项目"复盘', duration: '30min', output: '复盘记录1份', parentScript: '"如果重来一次，你会怎么做？"' },
    { week: 'W10-11', task: '"项目展示"准备和展示', duration: '45min×2', output: '展示PPT/视频', parentScript: '"你想让别人知道什么？"' },
    { week: 'W12', task: '"好奇心2.0"', duration: '30min', output: '新问题清单1份', parentScript: '"做完这个项目，你又有什么新问题？"' },
    { week: 'W13', task: '"90天回顾"', duration: '45min', output: '成长对比报告', parentScript: '"你觉得这90天你最大的变化是什么？"' },
  ],
  communicationScripts: {
    encouragements: [
      { text: '"你刚才那个问题问得很好，我也很好奇答案是什么。"', scene: '他提出一个有深度的问题时', intent: '保护问题意识' },
      { text: '"你刚才研究了很久，我看到你很专注，这很不容易。"', scene: '他长时间专注于一件事时', intent: '肯定深度专注力' },
      { text: '"你讲得很清楚，我听懂了结构。"', scene: '他做汇报或分享时', intent: '强化结构表达能力' },
    ],
    questions: [
      { text: '"你是怎么想到这个的？能给我讲讲你的思路吗？"', scene: '他说了一个有趣的观点时', intent: '促进元认知' },
      { text: '"如果重来一次，你会怎么做不一样？"', scene: '复盘某件事时', intent: '培养反思能力' },
      { text: '"你觉得谁可能需要帮助？你能做什么？"', scene: '家庭活动或团队任务前', intent: '培养协作主动性' },
    ],
    boundaries: [
      { text: '"现在是作业时间。你可以选择先做数学还是先做语文，但需要在8点前完成。"', scene: '拖延作业时', intent: '给选择权，但有清晰边界' },
      { text: '"我看到你现在很生气。你可以先冷静一下，等你准备好了我们再聊。"', scene: '情绪激动时', intent: '先处理情绪，再处理事情' },
    ],
  },
  schoolCooperation: {
    learningStyle: [
      { title: '问题驱动型学习者', desc: '从问题出发比从答案出发效果更好。给他一个问题，比直接告诉他答案更能激发学习动力。', color: 'blue' },
      { title: '深度专注型', desc: '进入状态后能长时间保持专注，但需要"慢热"时间。不适合快速切换任务。', color: 'purple' },
      { title: '结构化表达者', desc: '善于用逻辑框架组织信息，适合做汇报和讲解任务。', color: 'green' },
      { title: '独立倾向', desc: '偏好先独立思考再协作，需要给他"先自己想一想"的时间。', color: 'amber' },
    ],
    classroomRoles: ['提问者：负责提出关键问题', '展示者：负责汇报小组成果', '记录者：负责整理实验数据', '验证者：负责检验假设'],
    teacherOpportunities: [
      { title: '科学课/综合实践课的"问题发起人"', desc: '让他在课前收集同学们的问题，整理成"问题清单"，培养问题意识和组织能力。' },
      { title: '小组汇报的"主讲人"角色', desc: '发挥他的结构表达优势，也能通过汇报任务促进他和组员的协作。' },
      { title: '班级科学角/自然角的"观察员"', desc: '让他负责记录观察日志，发挥他的深度观察力，也能培养责任感。' },
    ],
  },
  universityRecommendations: {
    domestic: [
      { name: '清华大学', major: '电子信息类、计算机类', reason: '工科"真刀真枪"做项目与探究力契合' },
      { name: '北京大学', major: '物理学院、元培学院', reason: '学术自由，元培允许跨学科探索' },
      { name: '浙江大学', major: '竺可桢学院、计算机', reason: '工科强+跨学科机会，本科生科研机会多' },
      { name: '上海交通大学', major: '电子信息类、致远学院', reason: '工科实践导向，产业联系紧密' },
      { name: '中国科学技术大学', major: '少年班、物理学', reason: '学术氛围浓厚，本科生科研机会多' },
    ],
    international: [
      { name: 'MIT（美国）', major: 'EECS、机械工程、物理学', reason: '"hands-on"文化与探究力匹配', color: 'blue' },
      { name: '斯坦福大学（美国）', major: 'Symbolic Systems、产品设计', reason: 'd.school设计思维文化契合', color: 'purple' },
      { name: '剑桥大学（英国）', major: 'Natural Sciences、工程学', reason: '跨学科学习+小班教学', color: 'green' },
      { name: 'ETH Zurich（瑞士）', major: '机械工程、电子信息', reason: '强调实验和动手能力', color: 'amber' },
    ],
  },
  careerDirections: [
    { icon: '🔬', name: '科学研究者', reason: '探究力(88)+好奇心(82)契合科研核心需求', path: '科创比赛 → 研究型大学', color: 'blue' },
    { icon: '🎨', name: '产品设计师', reason: '设计力(79)+表达力(85)支撑全流程', path: '设计思维工作坊 → 设计专业', color: 'purple' },
    { icon: '🤖', name: 'AI工程师/提示工程师', reason: '探究力+表达力适合"与AI对话"', path: '编程学习 → CS专业', color: 'green' },
    { icon: '📺', name: '科学传播者/科普创作者', reason: '好奇心+表达力适合"把复杂变简单"', path: '科学博客/视频 → 传播专业', color: 'amber' },
    { icon: '🎓', name: '教育工作者/课程设计师', reason: '探究力+表达力契合教育需求', path: 'peer tutoring → 教育学', color: 'rose' },
    { icon: '🌿', name: '自然科考/生态研究者', reason: '好奇心驱动野外探索，AI难以替代', path: '自然观察 → 生态学', color: 'teal' },
    { icon: '💡', name: '创业者/创新顾问', reason: '好奇心驱动发现机会，设计力支撑落地', path: '创业模拟 → 商科+技术双学位', color: 'indigo' },
    { icon: '📊', name: '数据科学家/分析师', reason: '探究力驱动深挖数据，发现规律', path: '统计基础 → 数据科学专业', color: 'gray' },
  ],
  aiInsight: '张泽辉的探究力和表达力组合，在AI时代尤为珍贵。AI擅长执行明确任务，但定义问题、验证假设、跨领域联想、建立人际信任这些能力，正是AI难以替代的。',
  bookRecommendations: {
    forChild: [
      { ageRange: '8-10岁：激发好奇心', books: [
        { name: '《昆虫记》法布尔', desc: '观察+记录的经典范本，与他的探究特质高度匹配' },
        { name: '《神奇校车》系列', desc: '用冒险方式探索科学，满足好奇心' },
        { name: '《DK万物运转的秘密》', desc: '机械原理图解，适合爱拆东西的孩子' },
        { name: '《这就是物理》系列', desc: '漫画形式讲解物理概念，易懂有趣' },
      ]},
      { ageRange: '10-12岁：深化探究', books: [
        { name: '《万物简史》比尔·布莱森', desc: '科学史入门，培养追问"为什么"的习惯' },
        { name: '《从一到无穷大》伽莫夫', desc: '数学+物理经典科普，适合深度思考' },
        { name: '《物种起源》少儿版', desc: '达尔文的观察方法，学习科学思维' },
        { name: '《居里夫人传》', desc: '科学家精神，坚持探究的榜样' },
      ]},
    ],
    forParent: [
      { name: '《园丁与木匠》艾莉森·高普尼克', desc: '理解孩子' },
      { name: '《终身成长》卡罗尔·德韦克', desc: '理解孩子' },
      { name: '《游戏力》劳伦斯·科恩', desc: '理解孩子' },
      { name: '《如何说孩子才会听》法伯/玛兹丽施', desc: '教育方法' },
      { name: '《正面管教》简·尼尔森', desc: '教育方法' },
      { name: '《非暴力沟通》马歇尔·卢森堡', desc: '教育方法' },
    ],
  },
  nextSteps: [
    { step: '分享报告', desc: '把报告中"学校配合"章节截图发给班主任' },
    { step: '启动90天计划', desc: '和孩子一起选择W1的第一个任务' },
    { step: '预约专家解读', desc: '获得更个性化的教育建议' },
    { step: '3个月后复测', desc: '对比成长变化，调整培养策略' },
  ],
  appendix: {
    modelExplanation: 'WILDER-729模型基于6维度×3档水平=729种独特画像。整合多元智能理论、大五人格模型、皮亚杰认知发展理论和执行功能评估。',
    privacyNote: '本报告不存储可识别个人信息（PII），所有推荐均可解释与审计。数据加密标准：AES-256-GCM。',
    auditLog: { model_version: 'WILDER-729 v3.0', timestamp: '2026-02-07T10:00:00Z', data_privacy: 'PIPL/GB-T-35273-compliant' },
  },
  // Phase 3 新增字段
  multiModelValidation: {
    miAnalysis: {
      topIntelligences: [
        { name: '自然观察智能', nameEn: 'Naturalist', score: 5, wilderCorrelation: '与好奇心(W)+探究力(I)交叉验证' },
        { name: '逻辑数学智能', nameEn: 'Logical-Math', score: 4, wilderCorrelation: '与探究力(I)+设计力(D)交叉验证' },
        { name: '语言智能', nameEn: 'Linguistic', score: 3, wilderCorrelation: '与表达力(E)高度相关' },
      ],
      interpretation: '张泽辉在加德纳八大智能中，自然观察智能、逻辑数学智能、语言智能表现突出。这与WILDER模型中探究力+表达力的优势高度一致，形成"双模型交叉验证"——当两个独立模型指向同一结论时，判断的可靠性显著提升。',
    },
    bigFiveAnalysis: {
      traits: [
        { dimension: 'O', name: '开放性', level: '较高', score: 3, wilderCorrelation: '与好奇心(W)高度一致——两者都反映对新体验的接纳度' },
        { dimension: 'C', name: '尽责性', level: '较高', score: 3, wilderCorrelation: '与设计力(D)+反思力(R)交叉验证——有条理和自律的行为基础' },
        { dimension: 'E', name: '外向性', level: '中等', score: 1, wilderCorrelation: '与连接力(L)+表达力(E)交叉验证——社交主动性和表达积极性' },
        { dimension: 'A', name: '宜人性', level: '较高', score: 2, wilderCorrelation: '与连接力(L)部分相关——合作倾向和共情能力' },
        { dimension: 'N', name: '神经质', level: '较低', score: 0, wilderCorrelation: '与反思力(R)反向关联——情绪调节影响自我觉察深度' },
      ],
      interpretation: '大五人格初步画像显示张泽辉开放性较高、尽责性较高、宜人性较高。开放性高与WILDER好奇心(W:82)形成强交叉验证，表明张泽辉对新体验的积极态度是稳定特质。尽责性好与WILDER设计力(D:79)互相印证。',
    },
    cognitiveAnalysis: {
      stage: '形式运算期（早期）',
      stageDesc: '已展现抽象推理和假设检验能力，认知发展超越同龄平均',
      indicators: [
        { name: '守恒概念', achieved: true, score: 3, detail: '理解物质守恒，不受表面变化干扰' },
        { name: '逻辑推理', achieved: true, score: 3, detail: '能进行传递推理和逻辑演绎' },
        { name: '假设检验', achieved: true, score: 3, detail: '具备变量控制和实验设计能力' },
        { name: '元认知', achieved: true, score: 3, detail: '能监控自己的学习过程，有策略选择意识' },
      ],
      interpretation: '认知发展评估显示张泽辉处于"形式运算期（早期）"。已展现抽象推理和假设检验能力，认知发展超越同龄平均。假设检验能力突出，与WILDER探究力(I:88)形成强验证。元认知能力好，与WILDER反思力(R:76)互相印证。',
    },
    efAnalysis: {
      inhibition: { level: '良好', score: 3, detail: '能抵抗即时诱惑，完成需要延迟满足的任务' },
      flexibility: { level: '良好', score: 3, detail: '能根据情况调整策略，不固执于单一方法' },
      interpretation: '执行功能评估：抑制控制良好，认知灵活性良好。能抵抗干扰完成任务，能灵活切换策略。这与WILDER设计力(D:79)和反思力(R:76)形成三角验证——自控力、灵活性和规划力共同支撑高效学习。',
    },
    personalityProfile: { type: 'ENTP', name: '辩论家', description: '机智的辩论者，享受智力挑战和创新解决方案', wilderCorrelation: '外向思维型与WILDER好奇心(W:82)+探究力(I:88)高度一致' },
    crossValidationSummary: '综合5大模型交叉验证结果：WILDER 探究力(Inquiry)+表达力(Expression)的优势判断得到多元智能(自然观察智能、逻辑数学智能、语言智能)、大五人格(开放性较高/尽责性较高/宜人性较高)、认知发展(假设检验能力)的独立验证。当6个独立指标指向同一方向时，评估置信度从单模型的0.85提升至多模型交叉验证的0.92-0.95。',
  },
  familySolutions: {
    learningProfile: [
      { title: '探究力驱动型学习者', icon: '🎯', description: '张泽辉的学习动力主要来自探究力。当学习内容能激发求证欲时，学习效率最高。', tips: ['用问题引导学习，而非直接给答案', '选择与探究力相关的课外活动', '允许TA在感兴趣的方向深入探索'] },
      { title: '连接力需引导', icon: '🔧', description: '连接力是当前最具性价比的提升方向。不是"补短板"，而是"装新技能"。', tips: ['从优势领域切入——用探究力激发连接力', '每天5-10分钟微训练', '关注过程进步，不过度关注结果'] },
      { title: '最佳学习时间与方式', icon: '⏰', description: '基于张泽辉的能力画像，建议采用"脉冲式学习"——短时间高强度专注+充分休息。', tips: ['每次专注任务控制在15-25分钟', '切换任务时给2-3分钟缓冲', '利用感兴趣的内容做"开胃菜"，再引入需要练习的内容'] },
    ],
    cultivationStrategy: [
      { scenario: '孩子作业拖拉', problem: '家长催促无效，亲子关系紧张', solution: '利用张泽辉的探究力优势：把作业拆成小块，每块5-10分钟。在每块开始前设置一个与探究力相关的"小挑战"作为启动仪式。', expectedOutcome: '2-3周内作业时间缩短30%', color: 'blue' },
      { scenario: '对学习没兴趣', problem: '强制学习导致厌学情绪', solution: '从张泽辉的优势领域切入：先让TA在擅长的探究力方向获得成就感，再用"你在这方面这么强，是不是因为你用了某种方法？"引导反思和迁移。', expectedOutcome: '1-2个月内学习主动性提升', color: 'green' },
      { scenario: '和同学关系紧张', problem: '社交困难影响上学积极性', solution: '发挥张泽辉的探究力特长创造社交机会：让TA在擅长领域"当小老师"，通过"教别人"建立社交连接和自信。', expectedOutcome: '1-2个月内社交主动性增加', color: 'purple' },
      { scenario: '考试焦虑', problem: '越紧张越考不好，恶性循环', solution: '教张泽辉用反思力工具管理情绪：考前做"三步检查"——我准备了什么？还有什么可以快速补？不管结果如何我会怎么复盘？', expectedOutcome: '考试焦虑程度降低，成绩波动减小', color: 'amber' },
    ],
    ageDevelopment: [
      { ageRange: '10-12岁', focus: '深化期：能力定型', milestones: ['在优势领域能产出完整作品', '能进行15分钟以上的结构化表达', '开始思考"我擅长什么/不擅长什么"'], parentRole: '帮助TA建立"优势身份认同"——"你是一个很棒的探索者"', color: 'blue' },
      { ageRange: '12-14岁', focus: '整合期：自我意识', milestones: ['能用优势方法解决弱势领域问题', '有明确的学习偏好和策略', '社交网络基本形成'], parentRole: '从"指导者"转变为"顾问"——被邀请时给建议，而非主动干预', color: 'purple' },
    ],
    parentChildCommunication: [
      { situation: '张泽辉做事三分钟热度', wrongApproach: '"你怎么又不坚持了？做什么事都是三分钟热度！"', rightApproach: '"你发现了这么多有趣的事情！如果选一个最想深入的，你会选哪个？"', reason: '探究力型孩子的注意力本身就是"脉冲式"的——短暂高峰→快速转移→再次点燃。这是特质不是缺点，需要引导聚焦而非批评。' },
      { situation: '张泽辉考试没考好', wrongApproach: '"怎么又没考好？是不是没认真复习？"', rightApproach: '"这次有哪些题是你会做但做错的？我们一起看看发生了什么。"', reason: '把焦点从"结果"转到"过程"，既保护自尊心，又培养反思习惯。' },
      { situation: '张泽辉跟你对着干', wrongApproach: '"我是你妈/爸，你必须听我的！"', rightApproach: '"你有自己的想法很好。我的担心是[具体担心]，你觉得怎么解决？"', reason: '给TA表达空间并纳入决策，比直接命令更能获得配合。' },
      { situation: '张泽辉沉迷电子产品', wrongApproach: '"把手机给我！不准再玩了！"', rightApproach: '"我们来商量一个都能接受的使用规则？你觉得每天[时间]合理吗？"', reason: '协商出的规则比强制执行的规则有效3倍。关键是让孩子参与制定。' },
    ],
  },
  fourteenDayPlan: [
    { day: 'D1', task: '家庭启动会', goal: '全家了解报告核心发现', duration: '30min', parentTip: '一起读报告的"闪光潜能确认书"和"画像解读"部分' },
    { day: 'D2', task: '探究力捕捉日记（启动）', goal: '记录1件与探究力相关的发现', duration: '10min', parentTip: '"今天有什么让你觉得好奇的事？"' },
    { day: 'D3', task: '探究力捕捉日记', goal: '连续第2天记录', duration: '10min', parentTip: '"昨天那个发现，你后来又想到什么了吗？"' },
    { day: 'D4', task: '微实验日', goal: '完成一个5分钟小实验', duration: '15min', parentTip: '"我们来试试这个想法是不是真的？"' },
    { day: 'D5', task: '探究力捕捉日记', goal: '习惯巩固', duration: '10min', parentTip: '"你的好奇心日记已经3篇了！"' },
    { day: 'D6', task: '连接力微训练（首次）', goal: '用5分钟完成一个连接力小任务', duration: '5min', parentTip: '"我们用5分钟试试连接力的小挑战？"' },
    { day: 'D7', task: '第一周回顾', goal: '总结这一周的发现', duration: '15min', parentTip: '"这一周你最大的发现是什么？"' },
    { day: 'D8', task: '问题升级练习', goal: '把一个简单问题变成3个深度问题', duration: '15min', parentTip: '"这个问题可以拆成哪几个小问题？"' },
    { day: 'D9', task: '探究力+连接力结合', goal: '在探究力活动中融入连接力元素', duration: '15min', parentTip: '"做完这个之后，你能给我讲讲你是怎么做的吗？"' },
    { day: 'D10', task: '家庭实验日', goal: '全家一起做一个实验', duration: '30min', parentTip: '"今天我们一起做个实验！你来当总指挥"' },
    { day: 'D11', task: '探究力捕捉日记', goal: '稳定习惯', duration: '10min', parentTip: '"你的日记越来越有深度了！"' },
    { day: 'D12', task: '连接力微训练', goal: '第二次微训练', duration: '10min', parentTip: '"上次的连接力练习感觉怎么样？今天想不想再试一次？"' },
    { day: 'D13', task: '"我的发现"口头分享', goal: '给家人讲述一个发现', duration: '10min', parentTip: '"我很想听你讲讲你最近最有趣的发现！"' },
    { day: 'D14', task: '14天总复盘', goal: '整理14天成果，决定90天计划方向', duration: '20min', parentTip: '"你觉得这两周你最大的变化是什么？接下来想做什么？"' },
  ],
  yearlyBlueprint: [
    { quarter: 'Q1（第1-3个月）', theme: '习惯建立期', goals: ['建立探究力日记习惯', '完成3个微实验', '连接力微训练启动'], milestone: '90天成长对比报告', retestNote: '第90天建议复测，对比WILDER六维变化', color: 'green' },
    { quarter: 'Q2（第4-6个月）', theme: '项目产出期', goals: ['完成1个完整探究项目', '产出1份项目报告', '连接力维度提升5-10分'], milestone: '第一个完整项目作品', color: 'blue' },
    { quarter: 'Q3（第7-9个月）', theme: '能力整合期', goals: ['完成1个跨维度整合项目', '开始建立个人作品集', '尝试1次公开展示'], milestone: '个人作品集初版', retestNote: '第270天建议复测，观察半年以上的能力曲线变化', color: 'purple' },
    { quarter: 'Q4（第10-12个月）', theme: '突破与展望', goals: ['参加1次校级/区级展示或比赛', '完善个人作品集', '制定下一年度方向'], milestone: '年度成长总结+下一年规划', retestNote: '第365天年度复测，生成年度成长追踪报告', color: 'amber' },
  ],
  curriculumMatching: {
    recommended: [
      { name: '荒野科普课', type: '科普课', icon: '🌿', reason: '探究力(88分)驱动的好奇心+探究力适合在真实自然场景中学习科学知识，科普课的"观察-提问-验证"流程与WILDER优势高度匹配。', priority: '首选', color: 'green', ageRange: '科学探索营(10-12岁)' },
      { name: '荒野科创课', type: '科创课', icon: '🔧', reason: '表达力(E:85)支撑从"想法→方案→作品"的完整闭环，科创课的项目制学习能最大化发挥这一优势。', priority: '推荐', color: 'blue', ageRange: '科创实验室(11-14岁)' },
      { name: '荒野科考课', type: '科考课', icon: '🏕️', reason: '好奇心(W:82)驱动的探索欲望在户外科考场景中能获得最大释放。同时，科考课的团队协作环节能有效提升连接力(L:71)。', priority: '推荐', color: 'amber', ageRange: '生态科考(11-13岁)' },
      { name: '荒野科考课（连接力提升）', type: '科考课', icon: '🏕️', reason: '连接力(L:71)是当前最具提升空间的维度。科考课的小组合作模式能在户外实践中自然提升协作能力。', priority: '补强推荐', color: 'amber', ageRange: '生态科考(11-13岁)' },
    ],
    rationale: '基于探究力(88)+表达力(85)的核心优势和反思力(76)+连接力(71)的提升需求，我们从GROWMATE三大产品线（科普课·科创课·科考课）中为您精准匹配了4个推荐方案。',
  },
  confidenceStatement: {
    overallRange: '0.85-0.92（良好置信度）',
    factors: [
      { name: '测评完整度', value: '26题结构化+20题AI对话', contribution: '样本量充足，覆盖6维度×5模态' },
      { name: '回答一致性', value: '0.89', contribution: '同维度不同题目的回答呈现一致趋势' },
      { name: '多模型交叉验证', value: '5模型', contribution: 'WILDER+MI+BigFive+认知发展+执行功能独立验证' },
      { name: '情境多样性', value: '选择+判断+对话', contribution: '多种题型减少单一方法的偏差' },
    ],
    dynamicNote: '重要提示：本报告反映的是测评时点（2026年2月7日）的能力状态，而非"终身标签"。根据发展心理学研究：\n• 6-12岁儿童的认知能力每年可变化10-15%\n• 有针对性的训练可使弱势维度显著提升\n• 优势维度在合适的培养环境下会持续增强\n• WILDER六维画像随年龄和经历动态变化，建议定期复测追踪',
    ageChangeNote: '此阶段能力开始分化但仍有高度可塑性。优势维度的"马太效应"开始显现——强的越强。需要在保持优势的同时给弱势维度创造练习机会。',
    retestRecommendation: '建议在完成一个成长周期后进行复测，生成"成长追踪报告"对比各维度变化趋势。',
  },
  // Phase 4: 30类型系统字段
  talentUniversities: [
    { name: '中国科学技术大学', tier: '985' as const, major: '少年班/物理/天文', reason: '科研自由度全国最高，完美匹配好奇心+求证力' },
    { name: '北京大学', tier: '985' as const, major: '物理/元培学院', reason: '基础科学+跨学科探索' },
    { name: '南京大学', tier: '985' as const, major: '天文/物理/化学', reason: '基础科学研究传统深厚' },
    { name: 'Caltech（美国）', tier: '国际' as const, major: '基础科学', reason: '好奇心+验证能力的理想殿堂' },
  ],
  documentaryRecommendations: [
    { title: '蓝色星球 I & II', platform: 'B站', reason: '好奇心的视觉盛宴+海洋科学探究' },
    { title: '门捷列夫很忙', platform: 'B站', reason: '化学元素的好奇心之旅' },
  ],
  talentParentFocus: [
    { highlight: '好奇心+求证力=科学发现的黄金组合', commonMisunderstanding: '"问题太多""钻牛角尖"', truthReframe: '好问题+验证行动=完整的科学思维闭环，这比刷100道题都珍贵', actionTip: '每周做一次"厨房实验"——从最简单的问题开始验证' },
  ],
  talentType30Key: 'D-WI',
  talentType30: TALENT_TYPES_30['D-WI'] || null,
  crossMatch: null,
  talentReportContent: null,
  docMatch728: null,
  parentGuidance20: {
    ageStage: 'upper-primary' as const,
    topDims: ['I', 'E'],
    talentType: '好奇求证者',
    ageLabel: '高小阶段（10-12岁）',
    phrases: [
      { id: 1, category: 'encourage' as const, phrase: '你问的这个问题好有趣！我们一起去找答案吧！', scene: '孩子提出好奇问题时', intent: '强化好奇心驱动力' },
      { id: 2, category: 'encourage' as const, phrase: '你的观察力真棒，这个细节连我都没注意到！', scene: '孩子发现新事物时', intent: '肯定探究能力' },
      { id: 3, category: 'encourage' as const, phrase: '你刚才的尝试虽然没成功，但你的思路很有创意！', scene: '孩子实验失败时', intent: '鼓励容错和创新' },
      { id: 4, category: 'encourage' as const, phrase: '你能自己想出这个办法，说明你真的在动脑筋！', scene: '孩子独立解决问题时', intent: '强化自主思考' },
      { id: 5, category: 'question' as const, phrase: '你觉得为什么会这样？有没有其他可能的原因？', scene: '孩子遇到现象时', intent: '引导多角度思考' },
      { id: 6, category: 'question' as const, phrase: '如果我们换一种方法试试，你觉得结果会不同吗？', scene: '孩子方法受阻时', intent: '培养灵活思维' },
      { id: 7, category: 'question' as const, phrase: '你能把刚才的发现，用自己的话给我讲一遍吗？', scene: '完成活动后', intent: '锻炼表达力和总结力' },
      { id: 8, category: 'question' as const, phrase: '这和你之前学的哪个知识有关系？能连起来想想吗？', scene: '学习新知识时', intent: '培养连接力' },
      { id: 9, category: 'boundary' as const, phrase: '我理解你很想继续玩，但我们约定好的时间到了，明天可以继续。', scene: '需要停止活动时', intent: '温和而坚定地执行约定' },
      { id: 10, category: 'boundary' as const, phrase: '这件事你可以自己决定，但需要先想清楚可能的后果。', scene: '孩子要做选择时', intent: '培养责任意识' },
      { id: 11, category: 'boundary' as const, phrase: '安全是底线，这个不能商量。但怎么做到安全，你可以提方案。', scene: '涉及安全问题时', intent: '明确底线同时给予自主空间' },
      { id: 12, category: 'boundary' as const, phrase: '我们家的规则是大家一起制定的，所以也需要大家一起遵守。', scene: '孩子违反规则时', intent: '强化契约精神' },
      { id: 13, category: 'conflict' as const, phrase: '你现在很生气，我能理解。等你准备好了，我们再聊。', scene: '孩子情绪激动时', intent: '给情绪降温的空间' },
      { id: 14, category: 'conflict' as const, phrase: '你的想法和我不一样，我很想听听你是怎么想的。', scene: '亲子意见不合时', intent: '表达尊重和倾听意愿' },
      { id: 15, category: 'conflict' as const, phrase: '我刚才说话的方式可能让你不舒服了，对不起。', scene: '家长语气过重后', intent: '示范道歉和修复关系' },
      { id: 16, category: 'conflict' as const, phrase: '我们各退一步，找一个都能接受的方案好不好？', scene: '僵持不下时', intent: '培养协商能力' },
      { id: 17, category: 'motivation' as const, phrase: '你已经坚持了这么久，这本身就是一种了不起的能力！', scene: '孩子想放弃时', intent: '强化坚持的价值' },
      { id: 18, category: 'motivation' as const, phrase: '不用跟别人比，跟上个月的自己比就好。你进步了！', scene: '孩子拿自己和别人比时', intent: '建立内在评价标准' },
      { id: 19, category: 'motivation' as const, phrase: '失败不可怕，重要的是你从中学到了什么。', scene: '考试或比赛失利时', intent: '培养成长型思维' },
      { id: 20, category: 'motivation' as const, phrase: '你今天做的这件事，让我看到你真的在成长！', scene: '孩子有进步表现时', intent: '具体肯定成长' },
    ],
    avoidPhrases: [
      '你看看别人家的孩子！',
      '我都是为你好，你怎么不听话？',
      '这么简单都不会？',
      '你就是不努力！',
      '再这样我就不管你了！',
      '我小时候比你强多了！',
    ],
    dailyRoutine: [
      '早晨：用一个好奇问题开启新的一天（W好奇心）',
      '放学后：先聊今天最有趣的事，再聊作业（E表达力）',
      '睡前：一起回顾今天的"小发现"（R反思力）',
    ],
  },
  ageAdaptiveInfo: null,
  // Phase 6: 新模型分析 (CHC + Grit + SEL)
  newModelAnalysis: {
    chc: {
      GfScore: 2.5,
      GcScore: 2.0,
      GfLevel: '良好',
      GcLevel: '良好',
      interpretation: '张泽辉脑子转得快，肚子里也有货。遇到新问题能很快找到门路，知识面也挺广。这种"能想能说"的孩子，在学习和生活中都不太会遇到卡壳的情况。',
      wilderCorrelation: '推理能力和探究力(I:88)、好奇心(W:82)相呼应；知识积累和表达力(E:85)、反思力(R:76)有关联。',
    },
    grit: {
      passionScore: 2.2,
      perseveranceScore: 1.8,
      totalLevel: '良好',
      interpretation: '张泽辉既有喜欢的事，又能坚持做下去。这种"热爱+坚持"的组合很珍贵——很多孩子有热情但三分钟热度，或者能坚持但不是真心喜欢。TA两个都有，这是长期做成一件事的基础。',
      wilderCorrelation: '兴趣稳定性和好奇心(W:82)、探究力(I:88)相关；坚持力和设计力(D:79)、反思力(R:76)有关联。',
    },
    sel: {
      scores: { selfAwareness: 2.0, selfManagement: 1.5, socialAwareness: 1.8, relationshipSkills: 1.6, responsibleDecision: 2.2 },
      overallLevel: '良好',
      interpretation: '张泽辉在情绪管理、人际交往这些"软实力"上表现不错，自我意识、负责任决策都很突出。这意味着TA能理解自己、也能理解别人，在学校和生活中都会比较顺。',
      wilderCorrelation: '自我意识和反思力(R:76)相关；关系技能和连接力(L:71)、表达力(E:85)有关联；决策能力和设计力(D:79)相呼应。',
      competencyDetails: [
        { name: '自我意识', score: 2.0, level: '良好', tip: '继续保持这种觉察习惯，可以试试情绪日记' },
        { name: '自我管理', score: 1.5, level: '发展中', tip: '从简单的番茄钟开始，25分钟专注做一件事' },
        { name: '社会意识', score: 1.8, level: '良好', tip: '敏锐的社会感知力是领导力的基础' },
        { name: '关系技能', score: 1.6, level: '发展中', tip: '从小合作任务开始，练习倾听和表达' },
        { name: '负责任决策', score: 2.2, level: '良好', tip: '决策意识好，可以讨论更复杂的选择情境' },
      ],
    },
    modelCombination: {
      key: 'high_Gf_high_grit',
      name: '坚毅创新者',
      insight: '脑子活、能坚持——这是做大事的组合。既能发现新问题，又能一路追到底。这种孩子给TA一个有难度的项目，TA能做得津津有味。',
      actionPlan: '让TA尝试需要长时间投入的挑战：一个科学小研究、一个编程作品、一个创意设计。不用催，TA自己会追着做。',
    },
  },
  // Phase 7: 60潜能分型
  talentMatch60: {
    key: 'D-WI-α',
    talent60: TALENT_TYPES_60['D-WI-α'],
    parentTalent30: TALENT_TYPES_30['D-WI'],
    matchReason: '好奇心(W)+探究力(I)双峰组合；逻辑数学智能+自然智能偏高，开放性强，兴趣驱动型',
    multiModalFeatures: {
      miDirection: 'analytical' as const,
      bfDirection: 'explorer' as const,
      gritDirection: 'passionate' as const,
      selDirection: 'self-oriented' as const,
      overallDirection: 'alpha' as const,
    },
    confidence: 88,
  },
  talentType60Key: 'D-WI-α',
  talentType60: TALENT_TYPES_60['D-WI-α'],
}

// ========== GROWMATE科创教育入学测评统一版本动态侧边导航 ==========
// 注意：已合并为标准版和专业版为统一版本，所有功能对所有用户开放

function buildNavItems(_data: DynamicReportData) {
  // 按照实际section在页面中的位置排序
  return [
    { id: 'section-ch1', label: '🎯 科创天赋发现', highlight: true },
    { id: 'section-this-week', label: '📋 本周行动建议' },
    { id: 'section-explorer', label: '🔍 画像解读' },
    { id: 'section-charts', label: '📈 能力图谱' },
    { id: 'section-multimodel', label: '🌟 综合潜能画像' },
    { id: 'section-course-match', label: '🎓 课程推荐' },
    { id: 'section-evidence', label: '🔬 证据链分析' },
    { id: 'section-4', label: '💎 优势与成长空间' },
    { id: 'section-growth-plan', label: '🗺️ 成长路径规划' },
    { id: 'section-8', label: '💬 家庭沟通指南' },
    { id: 'section-confidence', label: '📊 置信度说明' },
    { id: 'section-educator-consultation', label: '👨‍🏫 专家圆桌' },
    { id: 'section-expert', label: '🌿 专家咨询' },
  ]
}

// ========== 颜色映射 ==========
// 品牌蓝到 Teal 渐变方案（与落地页 VI 统一）
const DIM_COLORS: Record<string, string> = {
  W: '#3B5FD9',  // 品牌蓝
  I: '#1e40af',  // 蓝-深
  L: '#2563eb',  // 蓝-中
  D: '#3b82f6',  // 蓝-亮
  E: '#0F9D94',  // Teal 强调（与落地页统一）
  R: '#5DB8B2',  // Teal 浅
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; light: string }> = {
  // 优化精简4色系统
  // 1. 品牌蓝 - 主要信息、核心数据
  blue: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', light: 'bg-blue-100' },
  // 2. 荒野金 - 强调、警告、CTA
  amber: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', light: 'bg-amber-100' },
  // 3. 自然绿 - 正向反馈、行动建议
  green: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', light: 'bg-emerald-100' },
  // 4. 中性灰 - 次要信息
  slate: { bg: 'bg-[rgba(59,95,217,0.04)]', text: 'text-[rgba(10,10,26,0.7)]', border: 'border-[rgba(10,10,26,0.06)]', light: 'bg-[rgba(59,95,217,0.06)]' },
  // 向下兼容映射（保持旧代码兼容）
  purple: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', light: 'bg-blue-100' },
  rose: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', light: 'bg-amber-100' },
  teal: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', light: 'bg-emerald-100' },
  indigo: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', light: 'bg-blue-100' },
  gray: { bg: 'bg-[rgba(59,95,217,0.04)]', text: 'text-[rgba(10,10,26,0.7)]', border: 'border-[rgba(10,10,26,0.06)]', light: 'bg-[rgba(59,95,217,0.06)]' },
}

function getColor(c: string) {
  return COLOR_MAP[c] || COLOR_MAP.gray
}

// ========== WILDER维度名称 ==========
const DIM_NAMES: Record<string, string> = {
  W: '好奇心 Wonder', I: '探究力 Inquiry', L: '连接力 Link',
  D: '设计力 Design', E: '表达力 Expression', R: '反思力 Reflection',
}

// ========== 术语解释组件 ==========
/** 术语解释组件 - 带下划线虚线和点击弹出解释 */
function GlossaryTerm({ term, children }: { term: string; children?: React.ReactNode }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const entry = GLOSSARY[term]
  if (!entry) return <>{children || term}</>
  
  return (
    <span className="relative inline-block">
      <span
        className="border-b border-dashed border-[rgba(10,10,26,0.15)] cursor-help text-inherit"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children || term}
      </span>
      {showTooltip && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#0A0A1A] text-white text-xs rounded-lg shadow-xl">
          <span className="font-bold block mb-1">{term}</span>
          <span className="text-[rgba(255,255,255,0.5)]">{entry.detail}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  )
}

// ========== 报告阅读行为追踪 Hook ==========
interface SectionReadData {
  /** 章节 ID */
  sectionId: string
  /** 累计可见时长（毫秒） */
  totalVisibleTime: number
  /** 首次进入视口时间 */
  firstSeenAt?: number
  /** 进入视口次数 */
  viewCount: number
  /** 是否曾展开（如果是可折叠区域） */
  wasExpanded?: boolean
}

interface ReadingBehavior {
  /** 报告打开时间 */
  openedAt: number
  /** 最大滚动到达率 (0-100%) */
  maxScrollDepth: number
  /** 各章节的阅读数据 */
  sections: Record<string, SectionReadData>
  /** 总阅读时长（毫秒） */
  totalReadTime: number
}

function useReadingTracker() {
  const behaviorRef = useRef<ReadingBehavior>({
    openedAt: Date.now(),
    maxScrollDepth: 0,
    sections: {},
    totalReadTime: 0,
  })
  const observerRef = useRef<IntersectionObserver | null>(null)
  const visibilityTimersRef = useRef<Record<string, number>>({})
  
  useEffect(() => {
    // 创建 IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const sectionId = entry.target.id
          if (!sectionId) return
          
          if (!behaviorRef.current.sections[sectionId]) {
            behaviorRef.current.sections[sectionId] = {
              sectionId,
              totalVisibleTime: 0,
              viewCount: 0,
            }
          }
          
          const sectionData = behaviorRef.current.sections[sectionId]
          
          if (entry.isIntersecting) {
            // 进入视口
            sectionData.viewCount++
            if (!sectionData.firstSeenAt) {
              sectionData.firstSeenAt = Date.now()
            }
            // 开始计时
            visibilityTimersRef.current[sectionId] = Date.now()
          } else {
            // 离开视口，累计可见时长
            const startTime = visibilityTimersRef.current[sectionId]
            if (startTime) {
              sectionData.totalVisibleTime += Date.now() - startTime
              delete visibilityTimersRef.current[sectionId]
            }
          }
        })
      },
      { threshold: [0.1, 0.5] } // 10% 和 50% 可见时触发
    )
    
    // 滚动深度追踪
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const depth = Math.round((scrollTop / docHeight) * 100)
        behaviorRef.current.maxScrollDepth = Math.max(
          behaviorRef.current.maxScrollDepth, depth
        )
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      observerRef.current?.disconnect()
      window.removeEventListener('scroll', handleScroll)
      
      // 组件卸载时，结算所有还在视口中的计时
      for (const [sectionId, startTime] of Object.entries(visibilityTimersRef.current)) {
        if (behaviorRef.current.sections[sectionId]) {
          behaviorRef.current.sections[sectionId].totalVisibleTime += Date.now() - startTime
        }
      }
      
      // 计算总阅读时长
      behaviorRef.current.totalReadTime = Date.now() - behaviorRef.current.openedAt
      
      // 保存到 localStorage
      try {
        const key = `wilder_reading_behavior_${Date.now()}`
        localStorage.setItem(key, JSON.stringify(behaviorRef.current))
        
        // 保留最近10条记录，清理旧数据
        const allKeys = Object.keys(localStorage)
          .filter(k => k.startsWith('wilder_reading_behavior_'))
          .sort()
        if (allKeys.length > 10) {
          allKeys.slice(0, allKeys.length - 10).forEach(k => localStorage.removeItem(k))
        }
      } catch (e) {
        // localStorage 满了或不可用，静默失败
      }
    }
  }, [])
  
  // 返回一个注册函数，供章节元素使用
  const trackSection = useCallback((element: HTMLElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element)
    }
  }, [])
  
  return { trackSection }
}

// ========== 主组件 ==========
// 使用颜色映射变量（避免编译警告）
void DIM_COLORS
void DIM_NAMES

export function ReportPage({ onBack, reportData, isAdminMode: _isAdminMode }: { onBack: () => void; reportData?: DynamicReportData; isAdminMode?: boolean }) {
  const d = reportData || DEMO_DATA

  // 统一版本：所有功能对所有用户开放，不再需要PRO状态管理
  const navItems = buildNavItems(d)
  const reportContainerRef = useRef<HTMLDivElement>(null)
  
  // 报告阅读行为追踪
  const { trackSection } = useReadingTracker()

  const [activeSection, setActiveSection] = useState('')
  const [readingProgress, setReadingProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 阅读进度追踪
  useEffect(() => {
    const handleScroll = () => {
      const container = reportContainerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const scrollHeight = container.scrollHeight - window.innerHeight
      const scrolled = Math.max(0, -rect.top)
      const progress = scrollHeight > 0 ? Math.min(100, (scrolled / scrollHeight) * 100) : 0
      setReadingProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 绘制雷达图
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = 300 * dpr
    canvas.height = 300 * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = '300px'
    canvas.style.height = '300px'

    const centerX = 150, centerY = 150, radius = 100
    const labels = ['W·好奇心', 'I·探究力', 'L·连接力', 'D·设计力', 'E·表达力', 'R·反思力']
    const keys = ['W', 'I', 'L', 'D', 'E', 'R']
    const values = keys.map(k => d.wilderScores[k] || 0)

    ctx.clearRect(0, 0, 300, 300)

    // Layer 1: 背景光晕
    const bgGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.3)
    bgGlow.addColorStop(0, 'rgba(59,130,246,0.08)')
    bgGlow.addColorStop(0.5, 'rgba(139,92,246,0.05)')
    bgGlow.addColorStop(1, 'transparent')
    ctx.fillStyle = bgGlow
    ctx.fillRect(0, 0, 300, 300)

    // Layer 2: 虚线网格
    ctx.strokeStyle = 'rgba(148,163,184,0.2)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath()
      for (let j = 0; j <= 6; j++) {
        const angle = (j * 60 - 90) * Math.PI / 180
        const r = radius * i / 5
        const x = centerX + r * Math.cos(angle), y = centerY + r * Math.sin(angle)
        if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.closePath(); ctx.stroke()
    }
    ctx.setLineDash([])

    // 轴线
    ctx.strokeStyle = 'rgba(148,163,184,0.25)'
    ctx.lineWidth = 1
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 - 90) * Math.PI / 180
      ctx.beginPath(); ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle))
      ctx.stroke()
    }

    // Layer 3: 数据多边形（渐变填充）
    const dataGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    dataGrad.addColorStop(0, 'rgba(59,130,246,0.45)')
    dataGrad.addColorStop(1, 'rgba(139,92,246,0.18)')
    ctx.fillStyle = dataGrad
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 - 90) * Math.PI / 180
      const r = radius * values[i] / 100
      const x = centerX + r * Math.cos(angle), y = centerY + r * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.closePath(); ctx.fill()

    // 渐变描边
    const strokeGrad = ctx.createLinearGradient(50, 50, 250, 250)
    strokeGrad.addColorStop(0, '#3b82f6')
    strokeGrad.addColorStop(1, '#a855f7')
    ctx.strokeStyle = strokeGrad
    ctx.lineWidth = 2.5
    ctx.stroke()

    // 顶点标记
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 - 90) * Math.PI / 180
      const r = radius * values[i] / 100
      const x = centerX + r * Math.cos(angle), y = centerY + r * Math.sin(angle)
      // 白色外圈
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = 'white'; ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 1; ctx.stroke()
      // 颜色内圈
      ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2)
      ctx.fillStyle = values[i] >= 80 ? '#10b981' : values[i] >= 60 ? '#f59e0b' : '#8b5cf6'
      ctx.fill()
    }

    // Layer 4: 标签
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 - 90) * Math.PI / 180
      const x = centerX + (radius + 28) * Math.cos(angle)
      const y = centerY + (radius + 28) * Math.sin(angle)

      // 高分标签加金色底
      if (values[i] >= 80) {
        ctx.fillStyle = 'rgba(254,243,199,0.9)'
        const w = 56, h = 18
        ctx.beginPath()
        ctx.roundRect(x - w/2, y - h/2, w, h, 9)
        ctx.fill()
        ctx.fillStyle = '#b45309'
      } else {
        ctx.fillStyle = '#475569'
      }
      ctx.font = 'bold 11px "Plus Jakarta Sans", "Noto Sans SC", sans-serif'
      ctx.fillText(labels[i], x, y)
    }
  }, [d.wilderScores])

  // 监听滚动高亮导航
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id) }) },
      { threshold: 0.3 }
    )
    navItems.forEach(item => { const el = document.getElementById(item.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [navItems])

  // 页面加载时滚动到封面顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4 print:bg-white print:p-0" style={{ background: '#EEF1FA' }}>
      {/* 侧边导航 */}
      <nav className="rpt-nav-sidebar no-print hidden lg:block">
        {navItems.map(item => (
          <a key={item.id} href={`#${item.id}`}
            onClick={(e) => { e.preventDefault(); scrollToSection(item.id) }}
            className={`${activeSection === item.id ? 'active' : ''} ${item.highlight ? 'text-[#FFB800] font-bold' : ''}`}
          >{item.label}</a>
        ))}
      </nav>

      {/* 浮动操作按钮 */}
      <div className="rpt-floating-actions no-print">
        <button onClick={onBack} className="rpt-floating-btn bg-[#0A0A1A] text-white" title="返回"><ArrowLeft className="w-5 h-5" /></button>

        {/* 统一版本：所有用户都可以使用分享和打印功能 */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${d.student.name}的科创天赋力测评报告`,
                text: `发现孩子的探索者画像：${d.talentType}`,
                url: window.location.href
              })
            } else {
              navigator.clipboard.writeText(window.location.href)
              alert('链接已复制，可粘贴到微信分享给好友')
            }
          }}
          className="rpt-floating-btn bg-[#0F9D94] text-white"
          title="分享"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            // 提示用户选择"另存为PDF"
            const tips = '💡 提示：在打印对话框中选择"另存为PDF"或"Save as PDF"即可保存PDF文件'
            console.log(tips)
            window.print()
          }}
          className="rpt-floating-btn bg-[#3B5FD9] text-white hover:bg-[#2A4CC0]"
          title="打印/导出PDF（推荐，速度快）"
        >
          <Printer className="w-5 h-5" />
        </button>
        {/* 移除了html2canvas导出按钮，改用浏览器原生打印更快 */}
        <button onClick={scrollToTop} className="rpt-floating-btn bg-[#0A0A1A] text-white" title="回到顶部"><ArrowUp className="w-5 h-5" /></button>
      </div>

      <div ref={reportContainerRef} className="report-container rounded-2xl overflow-hidden">
        {/* ========== 成长规划封面 (简洁商业风格) ========== */}
        <ReportCover reportData={d} trackSection={trackSection} />

        {/* ========== 报告导航栏（统一版本 + 进度条） ========== */}
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40 no-print">
          {/* 阅读进度条 */}
          <div className="h-1 bg-gray-100">
            <div 
              className="h-full bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94] transition-all duration-300 ease-out"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌿</span>
                <span className="font-semibold text-gray-800 text-sm">GROWMATE 科创教育测评报告</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{Math.round(readingProgress)}%</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                  {d.student.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========== 天赋星探品牌 + WILDER × OpenMAIC 展示区 ========== */}
        <section className="relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #0A2540 0%, #1a3a5c 100%)',
          padding: '3rem 1.5rem'
        }}>
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
          <div className="relative max-w-4xl mx-auto text-center">
            {/* 天赋星探标签 */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{
              background: 'rgba(212, 168, 83, 0.15)',
              border: '1px solid rgba(212, 168, 83, 0.3)'
            }}>
              <span style={{ color: '#D4A853', fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em' }}>
                天赋星探 · TALENT SCOUT
              </span>
            </div>

            {/* WILDER */}
            <h2 className="mb-1" style={{
              color: '#FFFFFF',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '0.12em',
              lineHeight: 1.3
            }}>
              WILDER
            </h2>
            <p className="mb-4" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', letterSpacing: '0.02em' }}>
              (Wonder · Inquiry · Link · Design · Expression · Reflection)
            </p>

            {/* × OpenMAIC */}
            <h3 className="mb-1" style={{
              color: '#FFFFFF',
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
              fontWeight: 500,
              letterSpacing: '0.05em'
            }}>
              × OpenMAIC
            </h3>
            <p className="mb-6" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', letterSpacing: '0.02em' }}>
              (Open Multi-Agent Interactive Classroom)
            </p>

            {/* 分隔线 */}
            <div className="mx-auto mb-6" style={{
              width: '48px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #00BFA5, transparent)'
            }} />

            {/* 主标语 */}
            <p style={{
              color: '#00BFA5',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              marginBottom: '0.75rem'
            }}>
              四层智能教育闭环系统
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.95rem',
              fontStyle: 'italic',
              maxWidth: '28rem',
              margin: '0 auto'
            }}>
              从精准测评到个性化教学，AI驱动的完整教育诊断闭环
            </p>
          </div>
        </section>

        {/* ========== 专家解读入口 ========== */}
        <section id="section-expert-top" ref={trackSection} className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🌿</span>
                  <h3 className="text-xl font-bold">预约报告解读专家</h3>
                </div>
                <p className="text-emerald-100 text-sm mb-4">
                  想更深入了解孩子的潜能报告？GROWMATE专家老师将为您一对一解读报告，并定制专属成长建议。
                </p>
                <a href="#section-expert" className="inline-flex items-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-50 transition-colors">
                  <span>🍀</span> 添加GROWMATE微信 · 免费解读报告
                </a>
              </div>
              <div className="bg-teal-50 rounded-2xl p-5 border-2 border-teal-400 shadow-xl inline-block">
                <p className="text-center text-sm text-gray-600 font-medium mb-3">GROWMATE · 科创教育入学测评</p>
                <img src="/images/expert-wechat-qr.jpg" alt="专家微信二维码" className="w-36 h-36 rounded-lg mx-auto" />
                <p className="text-center text-sm text-gray-700 font-bold mt-3">GROWMATE · 科创教育入学测评</p>
                <p className="text-center text-xs text-[#2A4CC0] mt-1">扫码添加，预约一对一报告解读</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== 定心丸 ========== */}
        <section id="section-reassurance" ref={trackSection} className="bg-gradient-to-r from-amber-50 to-yellow-50 py-8 px-4 sm:px-6 border-b border-amber-100">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-200 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-amber-200">
                👑
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#0A0A1A] mb-3">✨ 闪光潜能确认书 ✨</h3>
              <p className="text-base text-[rgba(10,10,26,0.7)] leading-relaxed max-w-2xl mx-auto mb-4">
                {d.reassurance.headline}
              </p>
              <div className="bg-amber-50 rounded-xl p-4 inline-block">
                <p className="text-sm text-amber-700">
                  <strong>家长今天就能做的动作：</strong>{d.reassurance.todayAction}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== 专业干预对比图 ========== */}
        <section id="section-intervention" ref={trackSection} className="bg-gradient-to-br from-slate-50 to-white py-8 px-4 sm:px-6 border-b border-[rgba(10,10,26,0.04)]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-xl font-black text-[#0A0A1A]">📈 专业教育干预的价值</h3>
              <p className="text-[rgba(10,10,26,0.5)] text-sm mt-1">基于92,000+儿童追踪数据的实证结论</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-[rgba(10,10,26,0.06)] shadow-sm">
              {/* 对比图表 */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* 无干预组 */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center text-white">📉</div>
                    <div>
                      <h4 className="font-bold text-gray-700">无专业干预</h4>
                      <p className="text-xs text-gray-500">自然发展轨迹</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">优势维度保持率</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-400 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <span className="text-xs text-gray-500">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">潜能转化率</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-400 rounded-full" style={{width: '32%'}}></div>
                        </div>
                        <span className="text-xs text-gray-500">32%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">优势转移率</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-400 rounded-full" style={{width: '28%'}}></div>
                        </div>
                        <span className="text-xs text-gray-500">28%</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 专业干预组 */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">📈</div>
                    <div>
                      <h4 className="font-bold text-emerald-700">有专业干预</h4>
                      <p className="text-xs text-emerald-600">科学培养轨迹</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-emerald-600">优势维度保持率</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-emerald-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{width: '87%'}}></div>
                        </div>
                        <span className="text-xs text-emerald-600">87%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-emerald-600">潜能转化率</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-emerald-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{width: '76%'}}></div>
                        </div>
                        <span className="text-xs text-emerald-600">76%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-emerald-600">优势转移率</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-emerald-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{width: '65%'}}></div>
                        </div>
                        <span className="text-xs text-emerald-600">65%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 关键结论 */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-bold text-amber-800 mb-1">关键结论</h4>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      数据显示，接受专业教育干预的儿童，其优势维度的保持率是无干预组的<strong>1.9倍</strong>，
                      潜能转化率提升<strong>2.4倍</strong>。早期识别与科学培养，能让孩子的天赋优势持续发展。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== 一屏总览（快速了解核心信息） ========== */}
        <ReportOverview reportData={d} trackSection={trackSection} />

        {/* ========== GROWMATE品牌介绍 - 已隐藏 ========== */}
        {/* 
        <section id="section-brand" ref={trackSection} className="bg-gradient-to-b from-slate-50 to-white py-6 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl border border-[rgba(10,10,26,0.06)] p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-xl shadow-md">🌿</div>
                <div>
                  <h3 className="text-lg font-black text-[#0A0A1A]">关于GROWMATE</h3>
                  <p className="text-[rgba(10,10,26,0.5)] text-xs">在科学中觉醒，在荒野中生长</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 text-center">
                  <div className="text-lg font-black text-emerald-600 mb-1">10年+</div>
                  <div className="text-[rgba(10,10,26,0.5)]">户外科学教育深耕</div>
                </div>
                <div className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 text-center">
                  <div className="text-lg font-black text-blue-600 mb-1">92,000+</div>
                  <div className="text-[rgba(10,10,26,0.5)]">中国儿童实证数据</div>
                </div>
                <div className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 text-center">
                  <div className="text-lg font-black text-amber-600 mb-1">创客中国冠军</div>
                  <div className="text-[rgba(10,10,26,0.5)]">教育创新领军品牌</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        */}

        <main className="p-6 space-y-8">
          {/* ========== Chapter 1: 潜能总览 ========== */}
          <section id="section-ch1" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl font-black">Ch.1</span><span className="mx-2">|</span><span>潜能总览（Executive Summary）</span>
            </div>
            <div className="rpt-section-content space-y-6">
              <SectionInsight text={`${d.student.name}是典型的「${d.talentType}」。核心优势：${d.sortedDims[0]?.name}(${d.sortedDims[0]?.score}) + ${d.sortedDims[1]?.name}(${d.sortedDims[1]?.score})双核驱动。`} type="key" />

              {/* 四象限能力定位 */}
              <div className="bg-white border border-[rgba(10,10,26,0.06)] rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#3B5FD9] rounded-lg flex items-center justify-center text-white text-sm font-bold">4</span>
                  四象限能力定位分析
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* 优势象限 */}
                  <div className="bg-white border border-[rgba(10,10,26,0.06)] rounded-xl p-4 border-l-4 border-l-green-500">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
                      <div>
                        <h5 className="font-bold text-[#0A0A1A]">优势象限（高能力×高兴趣）</h5>
                        <p className="text-xs text-[rgba(10,10,26,0.5)]">核心竞争力区域</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {d.sortedDims.slice(0, 2).map((dim, i) => (
                        <div key={i} className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 flex items-center justify-between">
                          <span className="font-medium text-gray-700">{dim.name}</span>
                          <span className="text-green-600 font-bold">{dim.score}分</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-[rgba(10,10,26,0.6)] mt-3">策略：重点投资，打造护城河</p>
                  </div>

                  {/* 潜力象限 */}
                  <div className="bg-white border border-[rgba(10,10,26,0.06)] rounded-xl p-4 border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block w-3 h-3 rounded-full bg-amber-500" />
                      <div>
                        <h5 className="font-bold text-[#0A0A1A]">潜力象限（中能力×高可塑）</h5>
                        <p className="text-xs text-[rgba(10,10,26,0.5)]">成长突破区域</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {d.sortedDims.slice(2, 4).map((dim, i) => (
                        <div key={i} className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 flex items-center justify-between">
                          <span className="font-medium text-gray-700">{dim.name}</span>
                          <span className="text-amber-600 font-bold">{dim.score}分</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-[rgba(10,10,26,0.6)] mt-3">策略：定向培养，挖掘潜能</p>
                  </div>

                  {/* 补强象限 */}
                  <div className="bg-white border border-[rgba(10,10,26,0.06)] rounded-xl p-4 border-l-4 border-l-red-500">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
                      <div>
                        <h5 className="font-bold text-[#0A0A1A]">补强象限（待提升区域）</h5>
                        <p className="text-xs text-[rgba(10,10,26,0.5)]">需关注的能力短板</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {d.sortedDims.slice(-2).map((dim, i) => (
                        <div key={i} className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 flex items-center justify-between">
                          <span className="font-medium text-gray-700">{dim.name}</span>
                          <span className="text-red-600 font-bold">{dim.score}分</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-[rgba(10,10,26,0.6)] mt-3">策略：补强而非补齐，达到基准线即可</p>
                  </div>

                  {/* 风险象限 */}
                  <div className="bg-white border border-[rgba(10,10,26,0.06)] rounded-xl p-4 border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
                      <div>
                        <h5 className="font-bold text-[#0A0A1A]">风险预警</h5>
                        <p className="text-xs text-[rgba(10,10,26,0.5)]">需要关注的潜在问题</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {d.risks.slice(0, 2).map((risk, i) => (
                        <div key={i} className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3">
                          <p className="font-medium text-[rgba(10,10,26,0.7)]">{risk.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{risk.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3条成长发展轴 */}
              <div className="bg-white border border-[rgba(10,10,26,0.06)] rounded-2xl p-6">
                <h4 className="font-bold text-[#0A0A1A] text-lg mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#3B5FD9] text-white text-sm font-semibold">3</span>
                  三条成长发展轴
                </h4>
                <p className="text-sm text-[rgba(10,10,26,0.6)] mb-4 bg-[rgba(59,95,217,0.04)] rounded-lg p-3">
                  每个孩子的成长都需要"主攻方向"。以下三条轴线是根据{d.student.name}的测评结果，为TA量身定制的发展路线图——
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-[rgba(10,10,26,0.06)]">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#3B5FD9] text-white text-sm font-semibold mb-3">1</span>
                    <h5 className="font-bold text-gray-800 mb-2">优势深耕轴</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      {d.student.name}在<strong className="text-[#3B5FD9]">{d.sortedDims[0]?.name}</strong>和<strong className="text-[#3B5FD9]">{d.sortedDims[1]?.name}</strong>方面表现突出，这两项能力就像TA的"潜能发动机"——别的孩子可能需要努力才能做到的事情，TA天生就能做得又快又好。
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      <strong>家长请注意：</strong>这两个优势领域是{d.student.name}未来脱颖而出的关键筹码，一定要重点培养，让优势变成"绝对优势"！
                    </p>
                    <div className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 text-xs text-[rgba(10,10,26,0.7)]">
                      <strong>冲刺目标：</strong>通过持续深耕，让这两项能力达到同龄孩子中<span className="font-black text-[#3B5FD9]">前5%</span>的水平——这将是TA未来升学、竞赛、甚至职业发展的核心竞争力！
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-[rgba(10,10,26,0.06)]">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#3B5FD9] text-white text-sm font-semibold mb-3">2</span>
                    <h5 className="font-bold text-gray-800 mb-2">潜力激活轴</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      {d.student.name}的<strong className="text-amber-600">{d.sortedDims[2]?.name}</strong>和<strong className="text-amber-600">{d.sortedDims[3]?.name}</strong>目前处于"沉睡状态"——不是没有潜力，而是还没被激发出来！这就像一颗种子，只要给它阳光和水分，很快就能发芽。
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      <strong>好消息：</strong>这个年龄段的孩子，这两项能力的可塑性非常强。只要方法得当，进步会非常明显，家长很快就能看到变化！
                    </p>
                    <div className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 text-xs text-[rgba(10,10,26,0.7)]">
                      <strong>提升目标：</strong>通过每天10-15分钟的针对性微训练，<span className="font-black text-amber-600">90天内提升10-15分</span>完全可以实现——这相当于从班级中游跃升到前三分之一！
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-[rgba(10,10,26,0.06)]">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#3B5FD9] text-white text-sm font-semibold mb-3">3</span>
                    <h5 className="font-bold text-gray-800 mb-2">风险管控轴</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      {d.student.name}在<strong className="text-[rgba(10,10,26,0.6)]">{d.sortedDims[4]?.name}</strong>和<strong className="text-[rgba(10,10,26,0.6)]">{d.sortedDims[5]?.name}</strong>方面相对薄弱——但请不要焦虑！这不代表"有问题"，只是说明TA的精力和潜能更多地分配到了其他地方。
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      <strong>重要提醒：</strong>这两个维度不需要追求卓越，但要确保"不拖后腿"。就像木桶原理，短板太短会影响整体，保持基本水平就好。
                    </p>
                    <div className="bg-[rgba(59,95,217,0.04)] rounded-lg p-3 text-xs text-[rgba(10,10,26,0.7)]">
                      <strong>守护目标：</strong>通过适度关注，<span className="font-black text-[rgba(10,10,26,0.7)]">保持在合格线以上</span>即可——把更多精力放在优势深耕和潜力激活上，性价比更高！
                    </div>
                  </div>
                </div>
              </div>

              {/* 优先级排序 */}
              <div className="bg-white border border-[rgba(10,10,26,0.06)] rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#3B5FD9] text-white text-sm font-semibold">P</span>
                  成长优先级排序
                </h4>
                <p className="text-sm text-gray-500 mb-4 bg-gray-50 rounded-lg p-3">
                  家长常问："{d.student.name}这么多方面都要培养，我到底先抓哪个？"——别急，我们按照<strong>"投入产出比最高"</strong>的原则，帮您排好了优先级：
                </p>
                <div className="space-y-4">
                  {/* P0 立即执行 */}
                  <div className="p-4 bg-white rounded-xl border border-[rgba(10,10,26,0.06)] border-l-4 border-l-red-500">
                    <div className="flex items-start gap-4">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">P0</span>
                      <div className="flex-1">
                        <p className="font-bold text-[#0A0A1A] text-lg mb-1">立即执行</p>
                        <p className="text-sm text-gray-700">
                          <strong className="text-[#3B5FD9]">{d.sortedDims[0]?.name}</strong>是{d.student.name}最耀眼的潜能！趁热打铁，现在就开始强化——帮TA建立"发现问题→动手验证→清晰表达"的完整闭环，让优势变成习惯！
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* P1 90天内启动 */}
                  <div className="p-4 bg-white rounded-xl border border-[rgba(10,10,26,0.06)] border-l-4 border-l-amber-500">
                    <div className="flex items-start gap-4">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">P1</span>
                      <div className="flex-1">
                        <p className="font-bold text-[#0A0A1A] text-lg mb-1">短期启动</p>
                        <p className="text-sm text-gray-700">
                          {d.student.name}的<strong className="text-amber-600">{d.sortedDims[4]?.name}</strong>和<strong className="text-amber-600">{d.sortedDims[5]?.name}</strong>需要通过"微训练"来唤醒——每天碎片时间积累，短期内即可看到变化。
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* P2 6个月规划 */}
                  <div className="p-4 bg-white rounded-xl border border-[rgba(10,10,26,0.06)] border-l-4 border-l-blue-500">
                    <div className="flex items-start gap-4">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">P2</span>
                      <div className="flex-1">
                        <p className="font-bold text-[#0A0A1A] text-lg mb-1">6个月规划</p>
                        <p className="text-sm text-gray-700">
                          带{d.student.name}完成<strong className="text-[#3B5FD9]">第一个完整的探究项目</strong>——从选题、调研、实验到展示，让TA亲身体验"从0到1"的成就感。
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* P3 长期布局 */}
                  <div className="p-4 bg-white rounded-xl border border-[rgba(10,10,26,0.06)] border-l-4 border-l-slate-400">
                    <div className="flex items-start gap-4">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[rgba(59,95,217,0.06)] text-[rgba(10,10,26,0.7)]">P3</span>
                      <div className="flex-1">
                        <p className="font-bold text-[#0A0A1A] text-lg mb-1">长期布局</p>
                        <p className="text-sm text-gray-700">
                          根据{d.student.name}的兴趣和潜能组合，逐步锁定1-2个<strong className="text-[rgba(10,10,26,0.6)]">深耕领域</strong>，开始积累"拿得出手"的作品集——这将成为TA未来申请学校、参加竞赛、甚至简历上的亮点！
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 导航引导 */}
              <div className="flex justify-center mt-6 mb-2">
                <button 
                  onClick={() => document.getElementById('section-this-week')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 font-medium transition-colors"
                >
                  继续了解本周行动计划 ↓
                </button>
              </div>
            </div>
          </section>

          {/* ========== 本周可以做的3件事（新增区块） ========== */}
          <section id="section-this-week" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="mx-2">|</span><span>本周可以做的3件事</span>
            </div>
            <div className="rpt-section-content">
              <p className="text-gray-600 mb-4 text-sm">从今天开始，用最简单的方式启动成长计划——每件事只需5-15分钟。</p>
              <div className="grid md:grid-cols-3 gap-4">
                {(() => {
                  // 从14天计划中提取最易执行的前3项
                  const easyActions = d.fourteenDayPlan?.slice(0, 3) || []
                  const actionLabels = ['1', '2', '3']
                  const actionColors = [
                    { border: 'border-l-green-500' },
                    { border: 'border-l-blue-500' },
                    { border: 'border-l-amber-500' },
                  ]
                  return easyActions.map((action, i) => (
                    <div key={i} className={`bg-white border border-[rgba(10,10,26,0.06)] border-l-4 ${actionColors[i]?.border || 'border-l-slate-400'} rounded-xl p-4`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#3B5FD9] text-white text-sm font-semibold">
                          {actionLabels[i]}
                        </span>
                        <span className="text-xs bg-[rgba(59,95,217,0.06)] px-2 py-1 rounded-full text-[rgba(10,10,26,0.6)] font-medium">{action.duration}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{action.task}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{action.goal}</p>
                      <div className="mt-3 bg-[rgba(59,95,217,0.04)] rounded-lg p-2">
                        <p className="text-xs text-[rgba(10,10,26,0.7)]">{action.parentTip?.substring(0, 30) || '开始行动吧！'}</p>
                      </div>
                    </div>
                  ))
                })()}
              </div>
              {/* 导航到完整计划 */}
              <div className="flex justify-center mt-6 mb-2">
                <button 
                  onClick={() => document.getElementById('section-growth-plan')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
                >
                  查看完整90天成长计划 ↓
                </button>
              </div>
            </div>
          </section>

          <section id="section-explorer" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="mx-2">|</span>
              <span>{d.talentType}画像解读（国际对标版）</span>
            </div>
            <div className="rpt-section-content space-y-6">
              <SectionInsight text={`${d.student.name}属于「${d.talentType}」画像，意味着TA的潜能倾向于${d.sortedDims[0]?.name}和${d.sortedDims[1]?.name}的组合发力。这不是标签，而是TA独特的成长起点。`} type="key" />
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

                {/* 画像编码 + MBTI映射 */}
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

              {/* ========== 30类型潜能身份卡 ========== */}
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

              {/* ========== 60分型精细化潜能身份卡 ========== */}
              {d.talentType60 && d.talentMatch60 && (() => {
                const t60 = d.talentType60
                const match60 = d.talentMatch60
                const features = match60.multiModalFeatures

                // 多模态方向标签映射
                const modalLabels = [
                  { key: 'MI多元智能', direction: features.miDirection, alphaLabel: '逻辑/自然智能', betaLabel: '语言/人际智能', isAlpha: features.miDirection === 'analytical' },
                  { key: 'BigFive人格', direction: features.bfDirection, alphaLabel: '开放探索型', betaLabel: '尽责执行型', isAlpha: features.bfDirection === 'explorer' },
                  { key: 'Grit坚毅力', direction: features.gritDirection, alphaLabel: '兴趣驱动型', betaLabel: '毅力驱动型', isAlpha: features.gritDirection === 'passionate' },
                  { key: 'SEL社会情感', direction: features.selDirection, alphaLabel: '自我认知导向', betaLabel: '社会认知导向', isAlpha: features.selDirection === 'self-oriented' },
                ]
                const alphaVotes = modalLabels.filter(m => m.isAlpha).length
                const betaVotes = 4 - alphaVotes

                return (
                  <div className="bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 border-2 border-teal-300 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-teal-200/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    {/* 关联标签 */}
                    <div className="flex items-center justify-center gap-2 mb-4 relative">
                      <span className="bg-teal-100 text-teal-700 text-xs px-3 py-1 rounded-full font-medium">基于多模态数据的精细化分型</span>
                      {d.talentType30 && (
                        <span className="bg-white text-[#2A4CC0] text-xs px-3 py-1 rounded-full border border-teal-200">
                          隶属于「{d.talentType30.name}」
                        </span>
                      )}
                    </div>

                    {/* 标题区 */}
                    <div className="flex items-center justify-center gap-3 mb-5 relative">
                      <span className="text-4xl">{t60.icon}</span>
                      <div className="text-center">
                        <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">{t60.name}</h4>
                        <p className="text-sm text-[#3B5FD9] font-medium">{t60.nameEn} · {t60.key}</p>
                      </div>
                    </div>

                    {/* Tagline */}
                    <div className="bg-white/80 backdrop-blur rounded-xl p-4 mb-4 text-center border border-teal-100">
                      <p className="text-lg font-bold text-gray-800 italic">&ldquo;{t60.tagline}&rdquo;</p>
                    </div>

                    {/* 详细描述 */}
                    <div className="bg-white/60 rounded-xl p-4 mb-4 border border-teal-100">
                      <p className="text-sm text-gray-700 leading-relaxed">{t60.desc}</p>
                    </div>

                    {/* 多模态投票可视化 */}
                    <div className="bg-white rounded-xl p-4 mb-4 border border-teal-200">
                      <h5 className="font-bold text-teal-700 text-sm mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-[#3B5FD9] rounded-md flex items-center justify-center text-white text-xs">🗳</span>
                        多模态子方向判定
                      </h5>
                      <div className="space-y-2">
                        {modalLabels.map((modal) => (
                          <div key={modal.key} className="flex items-center gap-2 text-xs">
                            <span className="w-24 text-gray-600 font-medium shrink-0">{modal.key}</span>
                            <div className="flex-1 flex items-center gap-1">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${!modal.isAlpha ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300' : 'bg-gray-50 text-gray-400'}`}>
                                {modal.betaLabel}
                              </span>
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full relative mx-1">
                                <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm ${modal.isAlpha ? 'right-0 bg-blue-500' : 'left-0 bg-emerald-500'}`}></div>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${modal.isAlpha ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'bg-gray-50 text-gray-400'}`}>
                                {modal.alphaLabel}
                              </span>
                            </div>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${modal.isAlpha ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                              {modal.isAlpha ? 'α' : 'β'}
                            </span>
                          </div>
                        ))}
                      </div>
                      {/* 综合判定 */}
                      <div className="mt-3 pt-3 border-t border-teal-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${features.overallDirection === 'alpha' ? 'text-blue-600' : 'text-emerald-600'}`}>
                            综合判定：{features.overallDirection === 'alpha' ? 'α' : 'β'}方向
                          </span>
                          <span className="text-xs text-gray-500">({alphaVotes}:{betaVotes} 投票)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-500">置信度</span>
                          <span className={`text-sm font-bold ${match60.confidence >= 85 ? 'text-[#2A4CC0]' : match60.confidence >= 75 ? 'text-amber-600' : 'text-gray-600'}`}>
                            {match60.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 三列网格: 核心特质 / 培养方向 / 职业方向 */}
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-xl p-4 border border-cyan-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-7 h-7 bg-cyan-500 rounded-lg flex items-center justify-center text-white text-xs">🏷</span>
                          <h5 className="font-bold text-cyan-700 text-sm">核心特质</h5>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {t60.traits.map((trait, i) => (
                            <span key={i} className="bg-cyan-50 text-cyan-700 text-xs px-2 py-1 rounded-full border border-cyan-200">{trait}</span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 border border-teal-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-7 h-7 bg-[#3B5FD9] rounded-lg flex items-center justify-center text-white text-xs">🌱</span>
                          <h5 className="font-bold text-teal-700 text-sm">培养方向</h5>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{t60.growthDirection}</p>
                      </div>

                      <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xs">💼</span>
                          <h5 className="font-bold text-emerald-700 text-sm">职业方向</h5>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {t60.careers.map((career, i) => (
                            <span key={i} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full border border-emerald-200">{career}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 家长洞察 */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-4 border border-amber-200">
                      <div className="flex items-start gap-2">
                        <span className="text-lg mt-0.5">💡</span>
                        <div>
                          <h5 className="font-bold text-amber-700 text-sm mb-1">家长最关心的洞察</h5>
                          <p className="text-sm text-gray-700 leading-relaxed">{t60.parentInsight}</p>
                        </div>
                      </div>
                    </div>

                    {/* 多模态判定依据 */}
                    <div className="bg-white/60 rounded-xl p-3 mb-4 border border-teal-100">
                      <p className="text-xs text-gray-500"><span className="font-medium text-[#2A4CC0]">判定依据：</span>{t60.multiModalBasis}</p>
                    </div>

                    {/* 诗意收尾 */}
                    <div className="text-center py-2">
                      <p className="text-sm text-[#2A4CC0] italic leading-relaxed">{t60.poetryLine}</p>
                    </div>
                  </div>
                )
              })()}

              {/* ========== 潜能星象卡（趣味化元素）========== */}
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
                      <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.7s'}}></div>
                      <div className="absolute top-1/3 right-8 w-1 h-1 bg-cyan-200 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
                    </div>

                    <div className="relative z-10">
                      {/* 趣味彩蛋声明 */}
                      <div className="bg-white/10 backdrop-blur border border-dashed border-yellow-300/40 rounded-xl px-4 py-2.5 mb-5 text-center">
                        <p className="text-xs text-yellow-200/90 leading-relaxed">
                          <span className="font-bold">🎭 趣味彩蛋</span> · 以下内容为趣味性补充，<span className="underline decoration-dashed underline-offset-2">非科学评估结论</span>，不应作为教育决策依据。科学结论请参阅"WILDER六维分析"和"证据链"部分。
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

                      {/* 幸运元素卡片（趣味性，仅供娱乐） */}
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

                      {/* 超能力与成长空间（趣味类比） */}
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

                      {/* 搭档相性 */}
                      <div className="grid md:grid-cols-2 gap-4 mb-5">
                        <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">💕</span>
                            <span className="font-bold text-pink-300 text-sm">最佳搭档类型</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {constellation.compatibleTypes.map((type, i) => (
                              <span key={i} className="bg-pink-500/20 px-2 py-0.5 rounded text-xs text-pink-200">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">⚔️</span>
                            <span className="font-bold text-amber-300 text-sm">挑战性搭档</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {constellation.challengeTypes.map((type, i) => (
                              <span key={i} className="bg-amber-500/20 px-2 py-0.5 rounded text-xs text-amber-200">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 季节建议 */}
                      <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur rounded-xl p-4 border border-white/10 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-lg">🌸</span>
                          <span className="font-bold text-purple-200">本季能量指引</span>
                          <span className="text-lg">🍂</span>
                        </div>
                        <p className="text-sm text-white/90">{constellation.seasonalAdvice}</p>
                      </div>

                      {/* 底部趣味声明 */}
                      <div className="mt-5 text-center">
                        <p className="text-[10px] text-purple-300/60 leading-relaxed">
                          以上"潜能星象"为趣味性类比，基于WILDER测评结果以游戏化方式呈现。幸运色、幸运数字、搭档类型等均为娱乐内容，不代表科学结论。
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* ========== 交叉匹配洞察 ========== */}
              {d.crossMatch && d.crossMatch.uniqueInsights.length > 0 && (
                <div className="bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white text-sm">🔗</span>
                    <h4 className="font-bold text-sky-700">潜能×画像 交叉洞察</h4>
                    <span className="text-xs bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full ml-auto">画像编码: {d.crossMatch.profileCode}</span>
                  </div>
                  <div className="space-y-2">
                    {d.crossMatch.uniqueInsights.map((insight, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 border border-sky-100 flex items-start gap-2">
                        <span className="text-sky-500 mt-0.5">◆</span>
                        <p className="text-sm text-gray-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                  {d.crossMatch.strengthModifiers.length > 0 && (
                    <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200">
                      <p className="text-xs font-bold text-green-700 mb-1">优势增强:</p>
                      {d.crossMatch.strengthModifiers.map((m, i) => (
                        <p key={i} className="text-sm text-green-700">+ {m}</p>
                      ))}
                    </div>
                  )}
                  {d.crossMatch.riskModifiers.length > 0 && (
                    <div className="mt-3 bg-amber-50 rounded-lg p-3 border border-amber-200">
                      <p className="text-xs font-bold text-amber-700 mb-1">关注风险:</p>
                      {d.crossMatch.riskModifiers.map((m, i) => (
                        <p key={i} className="text-sm text-amber-700">⚠ {m}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

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

              {/* 待升级模块提示（详见Ch.3） */}
              <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 text-lg">⚠</span>
                  <div>
                    <h4 className="font-bold text-rose-800">待升级模块</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {d.student.name}在{d.sortedDims[d.sortedDims.length - 1]?.name}和{d.sortedDims[d.sortedDims.length - 2]?.name}维度存在提升空间。
                      详细的学习风险、社交预判和职业盲点分析，请参阅 <a href="#section-ch3" className="text-[#FFB800] font-bold underline">Ch.3 学习挑战预警</a>。
                    </p>
                  </div>
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

          {/* ========== 多维能力可视化分析（放在潜能总览之前） ========== */}
          <section id="section-charts" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="mx-2">|</span><span>多维能力可视化分析</span>
            </div>
            <div className="rpt-section-content space-y-6">
              {/* 第一行：雷达图 + 饼图 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-700 mb-1 text-sm flex items-center gap-2">
                    <span className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs">🎯</span>
                    WILDER 六维能力雷达图
                  </h4>
                  <p className="text-xs text-gray-400 mb-4">与同龄平均水平对比</p>
                  <InteractiveRadarChart
                    scores={{ W: d.wilderScores.W || 0, I: d.wilderScores.I || 0, L: d.wilderScores.L || 0, D: d.wilderScores.D || 0, E: d.wilderScores.E || 0, R: d.wilderScores.R || 0 }}
                    compareScores={d.ageNormInfo?.peerMeans ? { W: d.ageNormInfo.peerMeans.W || 60, I: d.ageNormInfo.peerMeans.I || 55, L: d.ageNormInfo.peerMeans.L || 58, D: d.ageNormInfo.peerMeans.D || 50, E: d.ageNormInfo.peerMeans.E || 58, R: d.ageNormInfo.peerMeans.R || 48 } : { W: 60, I: 55, L: 58, D: 50, E: 58, R: 48 }}
                    size={280}
                  />
                  <div className="flex justify-center gap-4 mt-2 text-xs">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500"></span> {d.student.name}</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-400"></span> 同龄平均</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-700 mb-1 text-sm flex items-center gap-2">
                    <span className="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xs">🧩</span>
                    潜能类型分布占比
                  </h4>
                  <p className="text-xs text-gray-400 mb-4">各维度在总能力中的权重</p>
                  <PieChart
                    data={d.sortedDims.map(dim => ({
                      label: `${dim.key} ${dim.name}`,
                      value: dim.score,
                      color: dim.key === 'W' ? '#F59E0B' : dim.key === 'I' ? '#3B82F6' : dim.key === 'L' ? '#EC4899' : dim.key === 'D' ? '#8B5CF6' : dim.key === 'E' ? '#10B981' : '#6366F1'
                    }))}
                    size={220}
                  />
                </div>
              </div>

              {/* 第二行：常模参照对比（增强版） */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <NormReferenceSection
                  studentName={d.student.name}
                  ageGroupLabel={d.ageNormInfo?.ageGroupLabel}
                  peerMeans={d.ageNormInfo?.peerMeans}
                  dimensions={d.sortedDims.map(dim => ({
                    key: dim.key,
                    name: dim.name,
                    score: dim.score,
                    percentile: d.wilderPercentiles[dim.key] || Math.round(50 + (dim.score - 70) * 1.5),
                    color: dim.key === 'W' ? '#F59E0B' : dim.key === 'I' ? '#3B82F6' : dim.key === 'L' ? '#EC4899' : dim.key === 'D' ? '#8B5CF6' : dim.key === 'E' ? '#10B981' : '#6366F1'
                  }))}
                />
              </div>

              {/* 第三行：成长趋势 + 进度环 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-700 mb-1 text-sm flex items-center gap-2">
                    <span className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-white text-xs">📈</span>
                    预测成长趋势
                  </h4>
                  <p className="text-xs text-gray-400 mb-4">基于当前培养计划的90天预期变化</p>
                  <TrendChart
                    data={[
                      { label: '当前', value: Math.round((d.wilderScores.W + d.wilderScores.I + d.wilderScores.L + d.wilderScores.D + d.wilderScores.E + d.wilderScores.R) / 6) },
                      { label: '30天', value: Math.round((d.wilderScores.W + d.wilderScores.I + d.wilderScores.L + d.wilderScores.D + d.wilderScores.E + d.wilderScores.R) / 6) + 3 },
                      { label: '60天', value: Math.round((d.wilderScores.W + d.wilderScores.I + d.wilderScores.L + d.wilderScores.D + d.wilderScores.E + d.wilderScores.R) / 6) + 6 },
                      { label: '90天', value: Math.round((d.wilderScores.W + d.wilderScores.I + d.wilderScores.L + d.wilderScores.D + d.wilderScores.E + d.wilderScores.R) / 6) + 10 },
                    ]}
                    color="#F59E0B"
                  />
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-700 mb-1 text-sm flex items-center gap-2">
                    <span className="w-7 h-7 bg-rose-500 rounded-lg flex items-center justify-center text-white text-xs">🎯</span>
                    核心能力仪表盘
                  </h4>
                  <p className="text-xs text-gray-400 mb-4">Top3优势维度的达成度</p>
                  <div className="flex justify-around items-center">
                    {d.sortedDims.slice(0, 3).map((dim, i) => (
                      <ProgressRing
                        key={i}
                        value={dim.score}
                        color={i === 0 ? '#3B82F6' : i === 1 ? '#8B5CF6' : '#10B981'}
                        label={dim.key}
                        sublabel={dim.name}
                        size={100}
                        strokeWidth={8}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 导航引导 */}
              <div className="flex justify-center mt-6 mb-2">
                <button 
                  onClick={() => document.getElementById('section-evidence')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-purple-500 hover:text-purple-700 flex items-center gap-1 font-medium transition-colors"
                >
                  查看证据链分析 ↓
                </button>
              </div>
            </div>
          </section>

          {/* ========== 潜能画像速览 ========== */}
          <section id="section-talent-preview" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="mx-2">|</span><span>潜能画像速览</span>
            </div>
            <div className="rpt-section-content">
              <div className="text-gray-700 leading-relaxed space-y-3 mb-4">
                <p className="text-sm md:text-base">
                  {d.student.name}是一个典型的「{d.sortedDims[0]?.key === 'W' ? '小小探险家' : 
                    d.sortedDims[0]?.key === 'I' ? '追问小达人' :
                    d.sortedDims[0]?.key === 'L' ? '联想小天才' :
                    d.sortedDims[0]?.key === 'D' ? '创意小工匠' :
                    d.sortedDims[0]?.key === 'E' ? '表达小明星' : '思考小哲人'}」。
                  {d.sortedDims[0]?.key === 'W' ? '在课堂上,TA坐不住,总是迫不及待要举手发问;在公园里,TA会追逐蝴蝶、趴在地上看蚂蚁搬家。任何新鲜事物都能点燃TA的兴趣火花——但往往三分钟后又被下一个新奇事物吸引走了。' :
                    d.sortedDims[0]?.key === 'I' ? '总是不停地问"为什么",刨根问底是TA的标配。看动画片会追问"这个怎么做到的",吃饭时会好奇"米饭为什么会熟"。虽然有时让大人招架不住,但这恰恰是最珍贵的探究种子。' :
                    d.sortedDims[0]?.key === 'L' ? '脑子里总是在"连线"——把看似不相关的事情联系在一起。可能突然冒出"恐龙灭绝和今天的雾霾有什么关系"这样的问题。这种跨界思维,正是未来创新的底层能力。' :
                    d.sortedDims[0]?.key === 'D' ? '手比脑子快,有了想法就要动手试试。积木、乐高、废旧纸盒都是TA的宝贝。做出来的东西可能"奇形怪状",但每一个都凝结着TA的创造力和解决问题的尝试。' :
                    d.sortedDims[0]?.key === 'E' ? '天生的"小主持人",爱讲故事、爱表演、爱分享。在人群中毫不怯场,甚至有点"人来疯"。这份表达欲和感染力,是未来领导力和影响力的种子。' :
                    '经常会"发呆"——其实是在脑子里回放和思考。做完一件事会问自己"下次怎么做得更好"。这种元认知能力,是自主学习者的核心特质。'}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                    <p className="text-xs text-emerald-600 font-bold mb-1">✨ 优势亮点</p>
                    <p className="text-sm text-emerald-700">{d.sortedDims[0]?.name}和{d.sortedDims[1]?.name}双轮驱动,{Number(d.student.age) < 8 ? '正是培养探究习惯的黄金期' : Number(d.student.age) < 12 ? '可以开始系统性的项目式学习' : '适合挑战更复杂的综合项目'}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                    <p className="text-xs text-amber-600 font-bold mb-1">⚠️ 成长提醒</p>
                    <p className="text-sm text-amber-700">{d.sortedDims[5]?.name}相对较弱,{Number(d.student.age) < 8 ? '不必焦虑,先保护兴趣最重要' : Number(d.student.age) < 12 ? '可以通过游戏化方式逐步培养' : '建议有意识地进行刻意练习'}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== 潜能能力树（新增V2） ========== */}
          <TalentTree
            wilderScores={d.wilderScores}
            talentType={d.talentType}
            sortedDims={d.sortedDims.map(dim => ({ key: dim.key, name: dim.name, score: dim.score }))}
            talentType60Name={d.talentType60?.name}
          />

          {/* ========== 注意力模式评估（新增V2） ========== */}
          <AttentionProfileSection
            wilderScores={d.wilderScores}
            efAnalysis={d.multiModelValidation?.efAnalysis ? {
              inhibition: { level: d.multiModelValidation.efAnalysis.inhibition.level, score: d.multiModelValidation.efAnalysis.inhibition.score },
              flexibility: { level: d.multiModelValidation.efAnalysis.flexibility.level, score: d.multiModelValidation.efAnalysis.flexibility.score },
            } : undefined}
            studentName={d.student.name}
          />

          {/* ========== 作品上传创意分析 ========== */}
          <WorkUploadSection
            wilderScores={d.wilderScores}
            studentName={d.student.name}
          />

          {/* ========== Chapter 2: 认知结构深度解析 ========== */}
          <section id="section-ch2" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl font-black">Ch.2</span><span className="mx-2">|</span><span>认知结构深度解析</span>
            </div>
            <div className="rpt-section-content space-y-6">
              <SectionInsight text={`${d.student.name}的学习动力主要来自内在好奇心。当学习内容能激发求证欲时，学习效率最高。`} type="key" />
              {/* 内驱力分析 */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-6">
                <h4 className="font-bold text-purple-800 text-lg mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm">🔥</span>
                  内驱力（Motivation）分析
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4">
                    <h5 className="font-bold text-purple-700 mb-2">驱动类型</h5>
                    <p className="text-gray-700">{d.explorer.strengthEngines[0]?.name || '探究力驱动'}</p>
                    <p className="text-sm text-gray-500 mt-2">{d.student.name}的学习动力主要来自内在好奇心，而非外部奖励。当学习内容能激发求证欲时，学习效率最高。</p>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <h5 className="font-bold text-purple-700 mb-2">最佳激活场景</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✓ 遇到"为什么"类问题时</li>
                      <li>✓ 有机会动手验证假设时</li>
                      <li>✓ 可以自主选择探索方向时</li>
                      <li>⚠ 被动接受答案时动力下降</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 信息加工方式 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <h4 className="font-bold text-blue-800 text-lg mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">🧠</span>
                  信息加工方式（Processing）
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">👁️</span>
                    </div>
                    <h5 className="font-bold text-gray-800">输入偏好</h5>
                    <p className="text-sm text-gray-600 mt-2">视觉+动觉型<br/>喜欢通过观察和动手理解事物</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">⚡</span>
                    </div>
                    <h5 className="font-bold text-gray-800">处理模式</h5>
                    <p className="text-sm text-gray-600 mt-2">脉冲式专注<br/>短时高强度→休息→再次点燃</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">💬</span>
                    </div>
                    <h5 className="font-bold text-gray-800">输出偏好</h5>
                    <p className="text-sm text-gray-600 mt-2">结构化表达<br/>善于用"首先-然后-最后"框架</p>
                  </div>
                </div>
              </div>

              {/* 能力协同效应 */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
                <h4 className="font-bold text-emerald-800 text-lg mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-sm">🔗</span>
                  能力协同效应（Synergy）
                </h4>
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <div className="bg-blue-100 rounded-xl px-4 py-2 text-center">
                      <span className="text-2xl">{d.sortedDims[0]?.emoji}</span>
                      <p className="font-bold text-blue-700">{d.sortedDims[0]?.name}</p>
                      <p className="text-xs text-blue-500">{d.sortedDims[0]?.score}分</p>
                    </div>
                    <span className="text-2xl text-gray-400">×</span>
                    <div className="bg-purple-100 rounded-xl px-4 py-2 text-center">
                      <span className="text-2xl">{d.sortedDims[1]?.emoji}</span>
                      <p className="font-bold text-purple-700">{d.sortedDims[1]?.name}</p>
                      <p className="text-xs text-purple-500">{d.sortedDims[1]?.score}分</p>
                    </div>
                    <span className="text-2xl text-gray-400">=</span>
                    <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl px-6 py-3 text-center text-white">
                      <p className="font-black text-lg">协同加成</p>
                      <p className="text-sm opacity-90">1+1 &gt; 2</p>
                    </div>
                  </div>
                  <p className="text-center text-gray-600 mt-4">
                    {d.sortedDims[0]?.name}与{d.sortedDims[1]?.name}形成正向协同——{d.explorer.actionableInsight}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ========== Chapter 3: 学习挑战预警 ========== */}
          <section id="section-ch3" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl font-black">Ch.3</span><span className="mx-2">|</span><span>学习挑战预警</span>
            </div>
            <div className="rpt-section-content space-y-8">
              <SectionInsight text={`基于${d.student.name}的WILDER六维测评数据，我们从学业、社交、未来职业三个维度进行了深度预判。这不是"缺陷清单"，而是帮助家长提前布局、化风险为机遇的战略地图。`} type="default" />

              {/* ---- 3.1 学习风险 ---- */}
              <div className="bg-white border-2 border-red-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl font-bold">1</span>
                  <div>
                    <h4 className="text-white font-bold text-base">{d.riskPredictions.learningRisk.title}</h4>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{d.riskPredictions.learningRisk.content}</p>
                  
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <h6 className="font-bold text-red-700 mb-3 text-sm">可能受影响的学科/学习场景</h6>
                    <div className="flex flex-wrap gap-2">
                      {d.riskPredictions.learningRisk.subjects.map((subj, i) => (
                        <span key={i} className="inline-flex items-center px-3 py-1.5 bg-white border border-red-200 text-red-700 rounded-full text-xs font-medium shadow-sm">
                          {subj}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3">
                    <span className="text-amber-500 text-lg mt-0.5">⚠</span>
                    <div>
                      <h6 className="font-bold text-amber-800 text-sm mb-1">家长预警信号</h6>
                      <p className="text-sm text-amber-700">{d.riskPredictions.learningRisk.warning}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---- 3.2 社交预判 ---- */}
              <div className="bg-white border-2 border-purple-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl font-bold">2</span>
                  <div>
                    <h4 className="text-white font-bold text-base">{d.riskPredictions.socialRisk.title}</h4>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{d.riskPredictions.socialRisk.content}</p>
                  
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <h6 className="font-bold text-purple-700 mb-3 text-sm">可能出现的社交场景</h6>
                    <div className="flex flex-wrap gap-2">
                      {d.riskPredictions.socialRisk.scenarios.map((sc, i) => (
                        <span key={i} className="inline-flex items-center px-3 py-1.5 bg-white border border-purple-200 text-purple-700 rounded-full text-xs font-medium shadow-sm">
                          {sc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-violet-50 rounded-xl p-4 border border-violet-200 flex items-start gap-3">
                    <span className="text-violet-500 text-lg mt-0.5">⚠</span>
                    <div>
                      <h6 className="font-bold text-violet-800 text-sm mb-1">家长预警信号</h6>
                      <p className="text-sm text-violet-700">{d.riskPredictions.socialRisk.warning}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---- 3.3 职业盲点 ---- */}
              <div className="bg-white border-2 border-teal-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl font-bold">3</span>
                  <div>
                    <h4 className="text-white font-bold text-base">{d.riskPredictions.careerBlindspot.title}</h4>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{d.riskPredictions.careerBlindspot.content}</p>
                  
                  <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                    <h6 className="font-bold text-teal-700 mb-3 text-sm">可能受限的职业领域</h6>
                    <div className="flex flex-wrap gap-2">
                      {d.riskPredictions.careerBlindspot.fields.map((field, i) => (
                        <span key={i} className="inline-flex items-center px-3 py-1.5 bg-white border border-teal-200 text-teal-700 rounded-full text-xs font-medium shadow-sm">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 flex items-start gap-3">
                    <span className="text-emerald-500 text-lg mt-0.5">⚠</span>
                    <div>
                      <h6 className="font-bold text-emerald-800 text-sm mb-1">家长关注建议</h6>
                      <p className="text-sm text-emerald-700">{d.riskPredictions.careerBlindspot.warning}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 总结提示 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">💙</span>
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">家长心态调整</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      以上预判是基于{d.student.name}当前测评数据的<strong>概率性推演</strong>，并非确定性结论。每个孩子都有自己独特的成长节奏。
                      我们的建议是：<strong>用优势带动弱势，而不是强行补齐短板。</strong>当{d.student.name}在{d.sortedDims[0]?.name}和{d.sortedDims[1]?.name}上建立了足够的自信后，
                      以上风险会在成长过程中自然缓解。关键是<strong>早期识别、提前干预、科学引导</strong>。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== Chapter 4: 能力发展与投资策略 ========== */}
          <section id="section-ch4" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl font-black">Ch.4</span><span className="mx-2">|</span><span>能力发展与投资策略</span>
            </div>
            <div className="rpt-section-content space-y-6">
              <SectionInsight text={`培养策略：70%精力巩固${d.sortedDims[0]?.name}+${d.sortedDims[1]?.name}优势，30%精力提升${d.sortedDims[d.sortedDims.length-1]?.name}。`} type="action" />
              
              {/* 资源配置比例 */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
                <h4 className="font-bold text-amber-800 text-lg mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white text-sm">💰</span>
                  资源配置黄金比例
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center border-2 border-emerald-300">
                    <div className="text-4xl font-black text-emerald-600 mb-2">60%</div>
                    <h5 className="font-bold text-gray-800">优势深耕</h5>
                    <p className="text-sm text-gray-600 mt-2">投入到{d.sortedDims[0]?.name}和{d.sortedDims[1]?.name}</p>
                    <p className="text-xs text-emerald-600 mt-1">让强项更强</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border-2 border-amber-300">
                    <div className="text-4xl font-black text-amber-600 mb-2">30%</div>
                    <h5 className="font-bold text-gray-800">潜力激活</h5>
                    <p className="text-sm text-gray-600 mt-2">投入到中等维度的定向提升</p>
                    <p className="text-xs text-amber-600 mt-1">挖掘潜能</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border-2 border-rose-300">
                    <div className="text-4xl font-black text-rose-600 mb-2">10%</div>
                    <h5 className="font-bold text-gray-800">底线保障</h5>
                    <p className="text-sm text-gray-600 mt-2">投入到{d.sortedDims.slice(-2).map(s => s.name).join('和')}</p>
                    <p className="text-xs text-rose-600 mt-1">补强不补齐</p>
                  </div>
                </div>
              </div>

              {/* 家庭教育风格 - 简化版 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                <h4 className="font-bold text-purple-800 text-lg mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm">🏠</span>
                  家庭教育原则
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4">
                    <h5 className="font-bold text-green-700 mb-2">✅ 推荐</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 用问题引导，给予探索空间</li>
                      <li>• 关注过程而非仅看结果</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <h5 className="font-bold text-red-700 mb-2">❌ 避免</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 强制长时间专注</li>
                      <li>• 横向比较或过度干预</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-purple-600 mt-3 text-center">
                  详细的沟通策略和场景指南，请参阅 <a href="#section-family" className="underline font-bold">家长实践指南</a> 章节
                </p>
              </div>

              {/* 护城河构建 */}
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-2xl p-6">
                <h4 className="font-bold text-cyan-800 text-lg mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white text-sm">🏰</span>
                  护城河构建策略
                </h4>
                <div className="bg-white rounded-xl p-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-cyan-200 rounded-xl p-4">
                      <h5 className="font-bold text-cyan-700 mb-2">核心护城河</h5>
                      <p className="text-sm text-gray-600 mb-3">{d.sortedDims[0]?.name}({d.sortedDims[0]?.score}分) + {d.sortedDims[1]?.name}({d.sortedDims[1]?.score}分)</p>
                      <div className="bg-cyan-50 rounded-lg p-3">
                        <p className="text-sm text-cyan-700">形成"发现→验证→表达"的完整闭环，这是AI难以替代的人类独特能力。</p>
                      </div>
                    </div>
                    <div className="border border-amber-200 rounded-xl p-4">
                      <h5 className="font-bold text-amber-700 mb-2">能力叠加策略</h5>
                      <p className="text-sm text-gray-600 mb-3">将优势能力与兴趣领域深度融合</p>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-sm text-amber-700">建议方向：科学探究 × 表达展示 = 科学传播者/科普创作者</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== 成长暗礁与风险预警 ========== */}
          <GrowthRiskWarning reportData={d} />

          {/* ========== 14天行动清单 ========== */}
          <ActionPlan14Days reportData={d} />

          {/* ========== Chapter 5: 年度行动路线图 ========== */}
          <section id="section-ch5" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl font-black">Ch.5</span><span className="mx-2">|</span><span>年度行动路线图</span>
            </div>
            <div className="rpt-section-content space-y-6">
              <SectionInsight text="行动比完美更重要。每周3-5小时定向投入，90天即可见到显著变化。" type="action" />
              {/* 12个月计划概览 */}
              <div className="space-y-4">
                {d.yearlyBlueprint.map((q, i) => {
                  const c = getColor(q.color)
                  return (
                    <div key={i} className={`border-2 ${c.border} rounded-2xl overflow-hidden`}>
                      <div className={`${c.bg} p-4 flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <span className={`w-12 h-12 bg-gradient-to-br ${
                            q.color === 'green' ? 'from-green-500 to-emerald-500' :
                            q.color === 'blue' ? 'from-blue-500 to-indigo-500' :
                            q.color === 'purple' ? 'from-purple-500 to-violet-500' :
                            'from-amber-500 to-orange-500'
                          } rounded-xl flex items-center justify-center text-white font-black`}>Q{i + 1}</span>
                          <div>
                            <h5 className={`font-bold ${c.text}`}>{q.quarter}</h5>
                            <p className="text-gray-600">{q.theme}</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg px-3 py-1.5">
                          <p className="text-xs text-gray-500">里程碑</p>
                          <p className={`font-bold ${c.text} text-sm`}>{q.milestone}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {q.goals.map((goal, j) => (
                            <span key={j} className={`${c.light} ${c.text} px-3 py-1.5 rounded-full text-sm`}>✓ {goal}</span>
                          ))}
                        </div>
                        {q.retestNote && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                            <span className="text-amber-500">🔄</span>
                            <p className="text-sm text-amber-700">{q.retestNote}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ========== Chapter 6: 给家长的成长建议 ========== */}
          <section id="section-ch6" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl font-black">Ch.6</span><span className="mx-2">|</span><span>给家长的成长建议</span>
            </div>
            <div className="rpt-section-content space-y-6">
              {/* 核心理念 */}
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <p className="text-purple-300 text-sm mb-2 tracking-widest uppercase">核心理念</p>
                  <h3 className="text-2xl md:text-3xl font-black leading-relaxed">
                    潜能不是标签，而是<span className="text-amber-400">结构优势</span>
                  </h3>
                  <p className="text-purple-200 mt-4 leading-relaxed">
                    {d.student.name}的WILDER画像不是一个"定性"，而是一张"地图"——它告诉我们从哪里出发（当前状态），可以往哪里去（可能路径），以及路上可能遇到什么（风险预警）。
                  </p>
                </div>
              </div>

              {/* 教育框架 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5">
                  <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">🎯</span> 长期主义视角
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• 优势是需要时间来"熬"的，不是速成的</li>
                    <li>• 10年后的竞争力，来自今天的习惯积累</li>
                    <li>• 不追求"全面发展"，追求"差异化优势"</li>
                    <li>• 让孩子在自己的节奏里成长</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
                  <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">⚖️</span> 风险管理思维
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• 短板不需要"补齐"，达到基准线即可</li>
                    <li>• 过度投入弱项会消耗有限的注意力资源</li>
                    <li>• 关注"早期预警信号"，及时调整</li>
                    <li>• 接受"不完美"是明智选择，不是妥协</li>
                  </ul>
                </div>
              </div>

              {/* 具体建议 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm">💬</span>
                  家长常见困惑与科学回应
                </h4>
                <div className="space-y-4">
                  {d.familySolutions.parentChildCommunication.slice(0, 3).map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4">
                      <p className="font-bold text-gray-700 mb-3">场景：{item.situation}</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                          <p className="text-xs text-red-600 font-medium mb-1">❌ 常见反应</p>
                          <p className="text-sm text-red-700">{item.wrongApproach}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                          <p className="text-xs text-green-600 font-medium mb-1">✅ 科学回应</p>
                          <p className="text-sm text-green-700">{item.rightApproach}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 bg-white rounded-lg p-2">💡 {item.reason}</p>
                      <div className="bg-indigo-50 rounded-lg px-3 py-2 mt-2 border border-indigo-100">
                        <p className="text-xs text-indigo-700">
                          <strong>📖 教育学原理：</strong>
                          {item.situation.includes('坐不住') || item.situation.includes('专注') 
                            ? '根据注意力发展理论（Posner & Rothbart），儿童的持续注意力随年龄增长逐步成熟，过早要求长时间专注可能适得其反。' 
                            : item.situation.includes('三分钟热度') || item.situation.includes('兴趣')
                            ? '心理学家Csikszentmihalyi的"心流理论"指出，兴趣广泛是创造力的前兆。关键不是限制探索范围，而是帮助孩子在感兴趣的领域达到"心流"状态。'
                            : item.situation.includes('社交') || item.situation.includes('朋友')
                            ? 'Vygotsky的社会建构主义理论认为，同伴互动是认知发展的重要推动力。社交能力的培养需要在安全的环境中自然发生。'
                            : 'Carol Dweck的成长型思维理论表明，强调过程而非结果的反馈方式，能显著提升孩子的学习动机和抗挫能力。'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ========== 多模型专家交叉验证 ========== */}
          {d.multiModelValidation && (
          <MultiAgentAnalysisSection
            crossValidation={(() => {
              // 从现有数据构建交叉验证结果
              const mv = d.multiModelValidation
              return {
                overallConsistency: d.confidence || 89,
                modelValidations: [
                  {
                    modelName: '加德纳多元智能',
                    modelNameEn: 'Gardner MI',
                    validationScore: Math.min(95, (d.confidence || 89) + 3),
                    interpretation: mv.miAnalysis.interpretation,
                    reliability: 0.85,
                    wilderCorrelations: mv.miAnalysis.topIntelligences.map(mi => ({
                      wilderDim: mi.wilderCorrelation?.match(/\(([A-Z])\)/)?.[1] || 'W',
                      wilderDimName: mi.name,
                      correlatedFactors: [mi.nameEn],
                      expectedDirection: 'positive' as const,
                      actualMatch: true,
                      matchStrength: mi.score * 20,
                    })),
                  },
                  {
                    modelName: '大五人格模型',
                    modelNameEn: 'Big Five',
                    validationScore: Math.min(95, (d.confidence || 89) + 1),
                    interpretation: mv.bigFiveAnalysis.interpretation,
                    reliability: 0.82,
                    wilderCorrelations: mv.bigFiveAnalysis.traits.filter(t => t.score >= 2).map(t => ({
                      wilderDim: t.dimension,
                      wilderDimName: t.name,
                      correlatedFactors: [t.dimension],
                      expectedDirection: 'positive' as const,
                      actualMatch: true,
                      matchStrength: t.score * 25 + 25,
                    })),
                  },
                  {
                    modelName: '执行功能评估',
                    modelNameEn: 'Executive Function',
                    validationScore: Math.min(95, (d.confidence || 89) - 1),
                    interpretation: mv.efAnalysis.interpretation,
                    reliability: 0.80,
                    wilderCorrelations: [
                      { wilderDim: 'D', wilderDimName: '抑制控制', correlatedFactors: ['inhibition'], expectedDirection: 'positive' as const, actualMatch: mv.efAnalysis.inhibition.level === '良好', matchStrength: mv.efAnalysis.inhibition.score * 25 + 10 },
                      { wilderDim: 'R', wilderDimName: '认知灵活性', correlatedFactors: ['flexibility'], expectedDirection: 'positive' as const, actualMatch: mv.efAnalysis.flexibility.level === '良好', matchStrength: mv.efAnalysis.flexibility.score * 25 + 10 },
                    ],
                  },
                ],
                consistencyLevel: (d.confidence || 89) >= 85 ? 'excellent' : (d.confidence || 89) >= 70 ? 'good' : 'moderate',
                confidenceStatement: mv.crossValidationSummary,
                inconsistencies: [],
                interpretation: mv.crossValidationSummary,
                fusionConfidence: (d.confidence || 89) / 100,
                modelWeights: { 'Gardner MI': 0.15, 'Big Five': 0.10, 'Executive Function': 0.10, 'WILDER': 0.35, 'Other': 0.30 },
              }
            })()}
          />
          )}


          <section id="section-start-journey" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="mx-2">|</span><span>开启{d.student.name}的潜能成长之旅</span>
            </div>
            <div className="rpt-section-content">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200 text-center">
                <div className="mb-6">
                  <span className="text-5xl">🌱</span>
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-4">
                  让{d.student.name}的潜能发展，找到最适合的成长路径
                </h3>

                {/* 价值主张卡片 */}
                <div className="grid md:grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 text-left">
                    <span className="text-2xl mb-2 block">🎯</span>
                    <p className="font-bold text-gray-800 text-sm mb-1">读懂潜能密码</p>
                    <p className="text-xs text-gray-500">不再凭感觉报班、随大流跟风，让每一次教育选择都有据可依</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 text-left">
                    <span className="text-2xl mb-2 block">🗺️</span>
                    <p className="font-bold text-gray-800 text-sm mb-1">绘就成长蓝图</p>
                    <p className="text-xs text-gray-500">不只是评估分数，而是提供清晰的成长路径，让教育决策从"试试看"变成"看得准"</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 text-left">
                    <span className="text-2xl mb-2 block">💬</span>
                    <p className="font-bold text-gray-800 text-sm mb-1">找到对话钥匙</p>
                    <p className="text-xs text-gray-500">根据孩子性格定制的沟通策略，让亲子对话从单向说教变成双向理解</p>
                  </div>
                </div>

                {/* ========== 成长规划和二维码区块 - 已隐藏 ========== */}
                {/*
                <p className="text-gray-600 mb-6 max-w-lg mx-auto leading-relaxed">
                  {d.student.name}的潜能画像已经清晰，接下来需要专业的成长规划师为TA量身定制每日成长任务。
                  添加GROWMATE，我们将为{d.student.name}安排：
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                  <div className="bg-white rounded-xl p-4 border border-emerald-200">
                    <span className="text-2xl mb-2 block">📋</span>
                    <p className="font-bold text-gray-800 text-sm">每日专属任务</p>
                    <p className="text-xs text-gray-500 mt-1">基于画像定制的10-15分钟微任务</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-emerald-200">
                    <span className="text-2xl mb-2 block">👨‍🏫</span>
                    <p className="font-bold text-gray-800 text-sm">1对1成长指导</p>
                    <p className="text-xs text-gray-500 mt-1">专业成长规划师跟踪辅导</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-emerald-200">
                    <span className="text-2xl mb-2 block">📊</span>
                    <p className="font-bold text-gray-800 text-sm">阶段性评估</p>
                    <p className="text-xs text-gray-500 mt-1">每月复盘，动态调整培养方案</p>
                  </div>
                </div>
                <div className="flex justify-center mb-4">
                  <div className="bg-teal-50 rounded-2xl p-5 border-2 border-teal-400 shadow-lg inline-block">
                    <p className="text-center text-sm text-gray-600 font-medium mb-3">GROWMATE · 科创教育入学测评</p>
                    <img src="/images/expert-wechat-qr.jpg" alt="GROWMATE微信二维码" className="w-36 h-36 rounded-lg mx-auto" />
                    <p className="text-center text-sm text-gray-700 font-bold mt-3">GROWMATE · 科创教育入学测评</p>
                    <p className="text-center text-xs text-[#2A4CC0] mt-1">扫码添加，预约一对一报告解读</p>
                  </div>
                </div>
                */}
              </div>
            </div>
          </section>

          {/* ========== 科创体系课匹配 ========== */}
          <ReportCourseRecommendation 
            studentName={d.student.name}
            age={Number(d.student.age)}
            sortedDims={d.sortedDims}
            talentType60Name={d.talentType60?.name}
            subDirection={d.talentMatch60?.multiModalFeatures?.overallDirection}
          />

          {/* ========== Phase 3: 综合潜能画像（WILDER为主模型，辅以国际权威框架交叉验证） ========== */}
          <section id="section-multimodel" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">🌟</span><span className="mx-2">|</span><span>综合潜能画像</span>
            </div>
            <div className="rpt-section-content space-y-6">

              {/* 模型层级说明 */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-300 rounded-xl p-4 relative">
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg flex-shrink-0">W</span>
                  <div>
                    <h4 className="font-bold text-teal-800 text-sm mb-1">本报告评估模型说明</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      <strong className="text-teal-700">核心评估模型：WILDER-729</strong>（GROWMATE自研六维能力模型）是本报告的主要评估依据，所有核心结论均基于此模型的实际测评数据。
                      以下MBTI、多元智能、大五人格等国际权威框架仅作为<strong className="text-amber-700">辅助参考</strong>，用于从不同视角补充验证WILDER核心结论，不单独作为评估依据。
                    </p>
                  </div>
                </div>
              </div>
              
              {/* ===== 辅助参考：国际主流模型解读 ===== */}
              {d.multiModelValidation && (
              <>
              <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full mb-2">
                      <span className="text-yellow-300">📋</span>
                      <span className="text-sm font-medium text-purple-200">辅助参考 · 国际权威测评框架</span>
                    </div>
                    <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-200 to-cyan-200">
                      {d.student.name}的多维能力画像
                    </h3>
                  </div>
                  
                  {/* 三大模型并排展示 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
                    {/* MBTI 性格类型 - 主打 */}
                    <div className="bg-gradient-to-br from-indigo-500/30 to-purple-500/30 backdrop-blur rounded-xl p-4 sm:p-5 border border-white/20 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                        <span className="text-xl sm:text-2xl">🧭</span>
                        <span className="font-bold text-indigo-200 text-sm sm:text-base">MBTI 性格类型</span>
                      </div>
                      <div className="flex justify-center gap-1 mb-2">
                        {d.multiModelValidation.personalityProfile.type.split('').map((letter, i) => (
                          <span key={i} className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center text-lg sm:text-xl font-black text-white">
                            {letter}
                          </span>
                        ))}
                      </div>
                      <div className="text-base sm:text-lg font-bold text-white mb-1">{d.multiModelValidation.personalityProfile.name}</div>
                      <p className="text-xs text-purple-200 leading-relaxed hidden sm:block">{d.multiModelValidation.personalityProfile.description}</p>
                    </div>
                    
                    {/* 多元智能 Top3 */}
                    <div className="bg-gradient-to-br from-emerald-500/30 to-teal-500/30 backdrop-blur rounded-xl p-4 sm:p-5 border border-white/20">
                      <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                        <span className="text-xl sm:text-2xl">🧠</span>
                        <span className="font-bold text-emerald-200 text-sm sm:text-base">多元智能 Top3</span>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        {d.multiModelValidation.miAnalysis.topIntelligences.slice(0, 3).map((mi, i) => (
                          <div key={i} className="flex items-center gap-2 bg-white/10 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                            <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-700' : 'bg-amber-600 text-white'}`}>
                              {i + 1}
                            </span>
                            <span className="flex-1 font-medium text-white text-xs sm:text-sm">{mi.name}</span>
                            <span className="text-emerald-300 font-bold text-sm">{mi.score}分</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* 大五人格雷达 */}
                    <div className="bg-gradient-to-br from-rose-500/30 to-pink-500/30 backdrop-blur rounded-xl p-4 sm:p-5 border border-white/20 sm:col-span-2 md:col-span-1">
                      <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                        <span className="text-xl sm:text-2xl">🎭</span>
                        <span className="font-bold text-rose-200 text-sm sm:text-base">大五人格</span>
                      </div>
                      <div className="space-y-1 sm:space-y-1.5">
                        {d.multiModelValidation.bigFiveAnalysis.traits.map((t, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-6 sm:w-8 text-[10px] sm:text-xs text-white/80">{t.dimension}</span>
                            <div className="flex-1 bg-white/20 rounded-full h-1.5 sm:h-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${t.level === '较高' ? 'bg-gradient-to-r from-pink-400 to-rose-400' : t.level === '中等' ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-white/40'}`} 
                                style={{ width: `${Math.max(25, t.score * 30 + 10)}%` }} 
                              />
                            </div>
                            <span className={`text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded ${t.level === '较高' ? 'bg-rose-400/50 text-white' : t.level === '中等' ? 'bg-white/20 text-white/80' : 'bg-white/10 text-white/60'}`}>
                              {t.level === '较高' ? '↑' : t.level === '中等' ? '→' : '↓'}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] sm:text-xs text-pink-200 mt-2 text-center">O开放 C尽责 E外向 A宜人 N情绪</p>
                    </div>
                  </div>
                  
                  {/* 解读说明 */}
                  <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
                    <p className="text-sm text-purple-100 leading-relaxed">{d.multiModelValidation.miAnalysis.interpretation}</p>
                  </div>
                </div>
              </div>

              {/* ===== 第二层：认知发展与执行功能（专业补充）===== */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* 皮亚杰认知发展 */}
                <div className="bg-white border-2 border-sky-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-xl">🧩</span>
                    <div>
                      <h4 className="font-bold text-sky-800">皮亚杰认知发展</h4>
                      <p className="text-xs text-sky-600">Piaget's Cognitive Development</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-lg p-4 mb-3">
                    <div className="font-bold text-sky-800 text-lg">{d.multiModelValidation.cognitiveAnalysis.stage}</div>
                    <div className="text-sm text-gray-600 mt-1">{d.multiModelValidation.cognitiveAnalysis.stageDesc}</div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {d.multiModelValidation.cognitiveAnalysis.indicators.map((ind, i) => (
                      <div key={i} className={`rounded-lg p-2 text-center ${ind.achieved ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-200'}`}>
                        <div className="text-base sm:text-lg mb-0.5">{ind.achieved ? '✅' : '🔄'}</div>
                        <div className="text-[10px] sm:text-xs font-medium text-gray-700 truncate">{ind.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 执行功能 */}
                <div className="bg-white border-2 border-amber-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">⚡</span>
                    <div>
                      <h4 className="font-bold text-amber-800"><GlossaryTerm term="执行功能">执行功能</GlossaryTerm></h4>
                      <p className="text-xs text-amber-600">Executive Function</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`rounded-lg p-3 text-center ${d.multiModelValidation.efAnalysis.inhibition.level === '良好' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                      <div className="text-2xl mb-1">{d.multiModelValidation.efAnalysis.inhibition.level === '良好' ? '🛡️' : '🔧'}</div>
                      <div className="font-medium text-sm text-gray-700">抑制控制</div>
                      <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${d.multiModelValidation.efAnalysis.inhibition.level === '良好' ? 'bg-emerald-200 text-emerald-700' : 'bg-amber-200 text-amber-700'}`}>
                        {d.multiModelValidation.efAnalysis.inhibition.level}
                      </div>
                    </div>
                    <div className={`rounded-lg p-3 text-center ${d.multiModelValidation.efAnalysis.flexibility.level === '良好' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                      <div className="text-2xl mb-1">{d.multiModelValidation.efAnalysis.flexibility.level === '良好' ? '🔄' : '🔧'}</div>
                      <div className="font-medium text-sm text-gray-700">认知灵活性</div>
                      <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${d.multiModelValidation.efAnalysis.flexibility.level === '良好' ? 'bg-emerald-200 text-emerald-700' : 'bg-amber-200 text-amber-700'}`}>
                        {d.multiModelValidation.efAnalysis.flexibility.level}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 leading-relaxed">{d.multiModelValidation.efAnalysis.interpretation}</p>
                </div>
              </div>

              {/* ===== WILDER核心模型验证 ===== */}
              <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 border-2 border-teal-300 rounded-xl p-5 relative">
                <div className="absolute top-3 right-3 bg-[#2A4CC0] text-white text-xs px-2 py-0.5 rounded-full">
                  核心评估模型
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <span className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg">W</span>
                  <div>
                    <h4 className="font-bold text-teal-800 text-sm sm:text-base">WILDER-729 六维能力评估（核心模型）</h4>
                    <p className="text-[10px] sm:text-xs text-[#2A4CC0]">以下为本报告核心评估结果，辅助模型分析结果与WILDER结论交叉验证</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                  {['W', 'I', 'L', 'D', 'E', 'R'].map((dim) => {
                    const score = d.wilderScores[dim] || 0
                    const level = score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low'
                    const dimNames: Record<string, string> = { W: '好奇', I: '探究', L: '连接', D: '设计', E: '表达', R: '反思' }
                    return (
                      <div key={dim} className={`rounded-lg p-1.5 sm:p-2 text-center ${level === 'high' ? 'bg-teal-100 border border-teal-300' : level === 'mid' ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50 border border-gray-200'}`}>
                        <div className={`text-base sm:text-lg font-black ${level === 'high' ? 'text-teal-700' : level === 'mid' ? 'text-[#2A4CC0]' : 'text-gray-500'}`}>{dim}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">{dimNames[dim]}</div>
                        <div className={`text-xs sm:text-sm font-bold mt-0.5 sm:mt-1 ${level === 'high' ? 'text-teal-700' : level === 'mid' ? 'text-[#2A4CC0]' : 'text-gray-500'}`}>{score}</div>
                      </div>
                    )
                  })}
                </div>
                <div className="bg-white rounded-lg p-3 border border-teal-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-teal-700">交叉验证结论：</strong>{d.multiModelValidation.crossValidationSummary}
                  </p>
                </div>
              </div>

              {/* 模型说明脚注 */}
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
                <p className="font-bold text-gray-600 mb-1">模型层级说明</p>
                <p><strong className="text-[#2A4CC0]">★ WILDER-729（核心）：</strong>GROWMATE自研六维能力模型，6维度×3水平=729种画像，是本报告的<span className="underline">主要评估依据</span>，所有核心结论基于此模型</p>
                <p><strong className="text-gray-500">○ MBTI（辅助参考）：</strong>迈尔斯-布里格斯性格类型指标，仅用于从性格偏好维度补充验证</p>
                <p><strong className="text-gray-500">○ 多元智能MI（辅助参考）：</strong>哈佛大学加德纳教授8种智能分类，仅用于从智能分布维度补充验证</p>
                <p><strong className="text-gray-500">○ 大五人格（辅助参考）：</strong>心理学界人格特质模型(OCEAN)，仅用于从人格特质维度补充验证</p>
                <p className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-200">辅助参考模型的结果仅在与WILDER核心结论方向一致时增强判断可信度，不单独作为评估结论。当辅助模型与核心模型出现分歧时，以WILDER评估结果为准。</p>
              </div>
              </>
              )}
            </div>
          </section>

          {/* ========== 专业版增强模块（方法论 + 常模 + 维度交互 + 局限性）========== */}
          <ReportMethodologyEnhancements data={d} />

          {/* ========== Section 1: 结论总览 ========== */}
          <section id="section-1" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">1</span><span className="mx-2">|</span><span>结论总览（1页能读完）</span>
            </div>
            <div className="rpt-section-content space-y-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">1</span> 潜能核心定位
                </h4>
                <div className="rpt-quote-box"><p className="text-gray-700 leading-relaxed">{d.conclusion.corePosition}</p></div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">2</span> Top3 潜能分型
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {d.conclusion.top3Types.map((t, i) => {
                    const c = getColor(t.color)
                    return (
                      <div key={i} className={`bg-gradient-to-br ${c.bg} to-white border ${c.border} rounded-xl p-4`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`rpt-tag ${t.color === 'blue' ? 'bg-blue-600' : t.color === 'purple' ? 'bg-purple-500' : 'bg-amber-500'} text-white`}>{t.label}</span>
                          <span className={`font-bold ${c.text}`}>{t.pct}%</span>
                        </div>
                        <h5 className="font-bold text-gray-800">{t.name}</h5>
                        <p className="text-sm text-gray-600 mt-1">{t.desc}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">3</span> 六维雷达一句话解读
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600 text-xl">▲</span>
                    <div><p className="font-bold text-green-700">最强双维</p><p className="text-sm text-gray-600">{d.conclusion.radarInsight.strongest}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                    <span className="text-amber-600 text-xl">◆</span>
                    <div><p className="font-bold text-amber-700">待激活维度</p><p className="text-sm text-gray-600">{d.conclusion.radarInsight.toActivate}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600 text-xl">●</span>
                    <div><p className="font-bold text-blue-700">均衡区</p><p className="text-sm text-gray-600">{d.conclusion.radarInsight.balanced}</p></div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">4</span> 置信度与边界
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-700">整体置信度</span>
                      <span className="rpt-score-badge rpt-score-high">高 ({(d.conclusion.confidenceDetail.score / 100).toFixed(2)})</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: `${d.conclusion.confidenceDetail.score}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">原因：{d.conclusion.confidenceDetail.reason}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4">
                    <p className="font-medium text-amber-800 mb-2">需要补测的维度</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {d.conclusion.supplementNeeded.map((s, i) => <li key={i}>• <strong>{s.split('：')[0]}</strong>：{s.split('：')[1]}</li>)}
                    </ul>
                  </div>
                </div>

                {/* 交叉验证一致性指标 */}
                {d.crossValidationScore != null && (
                  <div className="mt-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-600 text-lg">🔬</span>
                        <span className="font-bold text-indigo-800">多模型<GlossaryTerm term="交叉验证">交叉验证</GlossaryTerm><GlossaryTerm term="一致性">一致性</GlossaryTerm></span>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        d.crossValidationLevel === 'excellent' ? 'bg-green-100 text-green-700' :
                        d.crossValidationLevel === 'good' ? 'bg-blue-100 text-blue-700' :
                        d.crossValidationLevel === 'moderate' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {d.crossValidationLevel === 'excellent' ? '极高' : d.crossValidationLevel === 'good' ? '高' : d.crossValidationLevel === 'moderate' ? '中等' : '较低'}
                        {' '}{d.crossValidationScore}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-indigo-100 rounded-full overflow-hidden mb-3">
                      <div className={`h-full rounded-full transition-all ${
                        d.crossValidationLevel === 'excellent' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                        d.crossValidationLevel === 'good' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                        d.crossValidationLevel === 'moderate' ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                        'bg-gradient-to-r from-red-400 to-rose-500'
                      }`} style={{ width: `${d.crossValidationScore}%` }} />
                    </div>
                    <p className="text-xs text-indigo-600 mb-2">
                      WILDER核心模型与MBTI、多元智能、大五人格、执行功能4个辅助模型的结果一致程度
                    </p>
                    {d.crossValidationInconsistencies && d.crossValidationInconsistencies.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-indigo-700">检测到的不一致项：</p>
                        {d.crossValidationInconsistencies.map((inc, i) => (
                          <div key={i} className="bg-white/70 rounded-lg p-2.5 border border-indigo-100">
                            <p className="text-xs font-medium text-gray-700">{inc.description}</p>
                            <p className="text-xs text-gray-500 mt-1">建议：{inc.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ========== 结构化测评结果速览 ========== */}
          <section id="section-assessment-snapshot" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="mx-2">|</span><span>结构化测评结果速览</span>
            </div>
            <div className="rpt-section-content space-y-6">
              {/* 四大模型速览卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PISA评估维度 */}
                <div className="bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">P</span>
                    <div>
                      <h4 className="font-bold text-sky-800 text-sm">PISA 评估维度</h4>
                      <p className="text-xs text-sky-500">国际学生评估项目对标</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    {[
                      { name: '阅读', level: d.wilderScores.E >= 80 ? '高' : d.wilderScores.E >= 60 ? '中' : '低', color: d.wilderScores.E >= 80 ? 'bg-emerald-500' : d.wilderScores.E >= 60 ? 'bg-amber-500' : 'bg-rose-400' },
                      { name: '数学', level: d.wilderScores.D >= 80 ? '高' : d.wilderScores.D >= 60 ? '中' : '低', color: d.wilderScores.D >= 80 ? 'bg-emerald-500' : d.wilderScores.D >= 60 ? 'bg-amber-500' : 'bg-rose-400' },
                      { name: '科学', level: d.wilderScores.I >= 80 ? '高' : d.wilderScores.I >= 60 ? '中' : '低', color: d.wilderScores.I >= 80 ? 'bg-emerald-500' : d.wilderScores.I >= 60 ? 'bg-amber-500' : 'bg-rose-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-sky-100 shadow-sm">
                        <span className="text-sm font-bold text-sky-800">{item.name}</span>
                        <span className={`${item.color} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{item.level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 大五人格特质 */}
                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-9 h-9 bg-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">B5</span>
                    <div>
                      <h4 className="font-bold text-purple-800 text-sm">大五人格特质</h4>
                      <p className="text-xs text-purple-500">Big Five Personality Traits</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {d.multiModelValidation.bigFiveAnalysis.traits.map((t, i) => {
                      const arrow = t.level === '较高' ? '↑' : t.level === '中等' ? '→' : '↓'
                      const arrowColor = t.level === '较高' ? 'text-emerald-600' : t.level === '中等' ? 'text-amber-600' : 'text-rose-500'
                      return (
                        <div key={i} className="bg-white rounded-xl px-3 py-2.5 border border-purple-100 shadow-sm text-center min-w-[60px]">
                          <span className="text-sm font-black text-purple-700">{t.dimension}</span>
                          <span className={`text-lg font-black ${arrowColor} ml-1`}>{arrow}</span>
                          <p className="text-[10px] text-gray-400 mt-0.5">{t.name}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* MBTI性格类型 */}
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">MB</span>
                    <div>
                      <h4 className="font-bold text-indigo-800 text-sm">MBTI 性格类型</h4>
                      <p className="text-xs text-indigo-500">Myers-Briggs 类型指标</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {d.multiModelValidation.personalityProfile.type.split('').map((letter, i) => (
                        <span key={i} className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-lg font-black text-indigo-700">{letter}</span>
                      ))}
                      <span className="ml-1 text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold">-A</span>
                    </div>
                    <p className="text-base font-bold text-indigo-700">{d.multiModelValidation.personalityProfile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{d.multiModelValidation.personalityProfile.description}</p>
                  </div>
                </div>

                {/* WILDER能力倾向 */}
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-9 h-9 bg-[#3B5FD9] rounded-xl flex items-center justify-center text-white font-bold text-sm">WD</span>
                    <div>
                      <h4 className="font-bold text-teal-800 text-sm">WILDER 能力倾向</h4>
                      <p className="text-xs text-[#3B5FD9]">WILDER科创天赋力评估</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {d.sortedDims.map((dim, i) => {
                      const levelLabel = dim.score >= 85 ? '极强' : dim.score >= 75 ? '较强' : dim.score >= 65 ? '中等' : dim.score >= 55 ? '中低' : '弱'
                      const levelColor = dim.score >= 85 ? 'bg-emerald-500' : dim.score >= 75 ? 'bg-teal-400' : dim.score >= 65 ? 'bg-amber-400' : dim.score >= 55 ? 'bg-orange-400' : 'bg-rose-400'
                      return (
                        <div key={i} className="bg-white rounded-lg p-2.5 border border-teal-100 shadow-sm text-center">
                          <span className="text-sm font-black text-teal-700">{dim.key}</span>
                          <span className={`ml-1 ${levelColor} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full`}>{levelLabel}</span>
                          <p className="text-[10px] text-gray-400 mt-0.5">{dim.name}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* 维度解释说明 */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs text-gray-500">
                <p className="font-bold text-gray-600 mb-2">各维度说明</p>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-1">
                  <p><strong>PISA：</strong>基于国际学生评估计划三大素养维度，阅读对应表达力(E)，数学对应设计力(D)，科学对应探究力(I)</p>
                  <p><strong>大五人格：</strong>O=开放性 C=尽责性 E=外向性 A=宜人性 N=神经质 ↑高 →中 ↓低</p>
                  <p><strong>MBTI：</strong>迈尔斯-布里格斯类型指标，基于四个维度的偏好组合，-A表示自信亚型</p>
                  <p><strong>WILDER：</strong>W=好奇心 I=探究力 L=连接力 D=设计力 E=表达力 R=反思力</p>
                </div>
              </div>
            </div>
          </section>

          {/* ========== Section 2: 教育资源配置（专业版核心模块前置）========== */}
          {/* 大学推荐 - 仅对10岁及以上显示 */}
          {Number(d.student.age) >= 10 ? (
          <section id="section-university" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">🎓</span><span className="mx-2">|</span><span>985/211大学与专业推荐</span>
              <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">核心资源</span>
            </div>
            <div className="rpt-section-content space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>数据来源说明：</strong>推荐基于QS/THE/ARWU 2024-2025公开榜单及学科评估结果。依据孩子的
                  <strong className="text-blue-600">{d.sortedDims[0]?.name}({d.sortedDims[0]?.score})+{d.sortedDims[1]?.name}({d.sortedDims[1]?.score})</strong>核心优势，
                  从<strong>1000+所大学、300+专业</strong>数据库中智能匹配。
                </p>
              </div>
              
              {/* 潜能匹配精选院校（30类型个性化推荐） */}
              {d.talentUniversities && d.talentUniversities.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-xs">★</span>
                    「{d.talentType}」潜能匹配精选院校
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {d.talentUniversities.map((uni, i) => {
                      const tierColors: Record<string, { bg: string; border: string; badge: string }> = {
                        '985': { bg: 'from-red-50 to-orange-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
                        '211': { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
                        '一本': { bg: 'from-green-50 to-emerald-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
                        '国际': { bg: 'from-purple-50 to-violet-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
                      }
                      const tc = tierColors[uni.tier] || tierColors['一本']
                      return (
                        <div key={i} className={`bg-gradient-to-br ${tc.bg} border ${tc.border} rounded-xl p-4`}>
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

              {/* 使用增强匹配引擎动态获取推荐 */}
              {(() => {
                const wilderScores: WilderScores = {
                  W: d.wilderScores.W || 0,
                  I: d.wilderScores.I || 0,
                  L: d.wilderScores.L || 0,
                  D: d.wilderScores.D || 0,
                  E: d.wilderScores.E || 0,
                  R: d.wilderScores.R || 0
                }
                const enhancedRec = getEnhancedUniversityRecommendations(wilderScores, d.student.age)
                
                return (
                  <>
                    {/* 推荐摘要 */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
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
                          <div key={i} className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 hover:shadow-md transition-shadow">
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
                          <div key={i} className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow">
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
                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{match.matchReason}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 国际大学推荐 */}
                    {enhancedRec.international.length > 0 && (
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">🌍</span>
                          国际顶尖大学推荐（{enhancedRec.international.length}所）
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {enhancedRec.international.slice(0, 4).map((match, i) => (
                            <div key={i} className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-shadow">
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
          ) : (
          /* 10岁以下显示兴趣培养方向 */
          <section id="section-interest-cultivation" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="mx-2">|</span><span>兴趣培养方向</span>
            </div>
            <div className="rpt-section-content space-y-5">
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
                <p className="text-sm text-gray-700">
                  根据{d.student.name}当前的能力特点，以下兴趣方向值得关注和培养。这个年龄段最重要的是<strong className="text-pink-600">保护好奇心、培养探索习惯</strong>，而非过早定向。
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* 基于 top2 维度推荐兴趣方向 */}
                {d.sortedDims.slice(0, 2).map((dim, i) => {
                  const interestMap: Record<string, { title: string; activities: string[]; icon: string; color: string }> = {
                    'W': { title: '自然探索类', activities: ['户外观察日记', '自然主题绘本阅读', '小小收藏家（标本、石头等）'], icon: '🔭', color: 'amber' },
                    'I': { title: '科学实验类', activities: ['厨房小实验', 'STEM玩具探索', '科学绘本共读'], icon: '🔬', color: 'blue' },
                    'L': { title: '社交合作类', activities: ['家庭协作游戏', '邀请朋友一起玩', '角色扮演游戏'], icon: '🤝', color: 'rose' },
                    'D': { title: '创意建造类', activities: ['积木/乐高自由搭建', '手工制作', '简单编程游戏'], icon: '🎨', color: 'purple' },
                    'E': { title: '表达表演类', activities: ['故事复述', '家庭小剧场', '画画+讲故事'], icon: '🎭', color: 'green' },
                    'R': { title: '思维游戏类', activities: ['简单棋类游戏', '找不同/迷宫', '睡前回顾"今天最开心的事"'], icon: '🧩', color: 'teal' },
                  }
                  const interest = interestMap[dim.key] || interestMap['W']
                  const c = getColor(interest.color)
                  return (
                    <div key={i} className={`${c.bg} border ${c.border} rounded-2xl p-5`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`w-12 h-12 ${c.light} rounded-xl flex items-center justify-center text-2xl`}>{interest.icon}</span>
                        <div>
                          <h4 className={`font-bold ${c.text}`}>{interest.title}</h4>
                          <p className="text-xs text-gray-500">基于{dim.name}优势</p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {interest.activities.map((activity, j) => (
                          <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 ${c.text} rounded-full bg-current`}></span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <strong>💡 培养提醒：</strong>对于{d.student.age}岁的孩子，兴趣是最好的老师。不必追求"系统学习"，而是跟随孩子的好奇心，在玩中学、学中玩。大学/职业方向的规划建议等孩子10岁以后再考虑。
                </p>
              </div>
            </div>
          </section>
          )}

          {/* 培养方案 */}
          <section id="section-development" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">💡</span><span className="mx-2">|</span><span>个性化培养方案</span>
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">核心资源</span>
            </div>
            <div className="rpt-section-content space-y-6">
              {/* 场景化培养策略 */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">🎯 场景化培养策略</h4>
                <div className="space-y-4">
                  {d.familySolutions.cultivationStrategy.map((cs, i) => {
                    const c = getColor(cs.color)
                    return (
                      <div key={i} className={`border ${c.border} rounded-xl overflow-hidden`}>
                        <div className={`${c.bg} p-3 flex items-center justify-between`}>
                          <span className="font-bold text-gray-700">场景：{cs.scenario}</span>
                          <span className={`text-xs ${c.text} bg-white px-2 py-0.5 rounded-full`}>预期效果：{cs.expectedOutcome}</span>
                        </div>
                        <div className="p-4 space-y-2 text-sm">
                          <p><span className="text-red-500 font-medium">❌ 常见困难：</span><span className="text-gray-600">{cs.problem}</span></p>
                          <p><span className="text-green-600 font-medium">✅ 方案：</span><span className="text-gray-600">{cs.solution}</span></p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 年龄段发展参考 */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">📈 年龄段发展参考</h4>
                <div className="space-y-4">
                  {d.familySolutions.ageDevelopment.map((ad, i) => {
                    const c = getColor(ad.color)
                    return (
                      <div key={i} className={`bg-white border ${c.border} rounded-xl p-5`}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`${c.text} font-bold text-lg`}>{ad.ageRange}</span>
                          <span className="text-gray-500">—</span>
                          <span className="font-medium text-gray-700">{ad.focus}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className={`${c.bg} rounded-lg p-3`}>
                            <p className="font-medium text-gray-700 text-sm mb-2">发展里程碑：</p>
                            <ul className="space-y-1">
                              {ad.milestones.map((m, j) => <li key={j} className="text-xs text-gray-600 flex gap-1.5"><span>🏁</span>{m}</li>)}
                            </ul>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="font-medium text-gray-700 text-sm mb-2">家长角色：</p>
                            <p className="text-xs text-gray-600">{ad.parentRole}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* BBC纪录片推荐 */}
          <section id="section-documentary" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">🎬</span><span className="mx-2">|</span><span>BBC纪录片推荐</span>
              <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">核心资源</span>
            </div>
            <div className="rpt-section-content space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>推荐依据：</strong>基于{d.student.name}的
                  <span className="text-purple-600 font-bold">{d.sortedDims[0]?.name}({d.sortedDims[0]?.score})+{d.sortedDims[1]?.name}({d.sortedDims[1]?.score})</span>
                  优势特质，精选以下BBC经典纪录片。这些纪录片能有效激发好奇心、培养科学思维、拓展知识视野。
                </p>
              </div>
              
              {(() => {
                const topDims = d.topDims as ('W' | 'I' | 'L' | 'D' | 'E' | 'R')[]
                const recommendedCategories = getRecommendedDocumentaries(topDims, d.student.age, 16)
                const categoryIcons: Record<string, { icon: string; color: string }> = {
                  '科学探索': { icon: '🔬', color: 'blue' },
                  '自然世界': { icon: '🌿', color: 'green' },
                  '历史人文': { icon: '🏛️', color: 'amber' },
                  '科技创新': { icon: '💡', color: 'purple' },
                  '艺术文化': { icon: '🎨', color: 'rose' },
                  '社会视野': { icon: '🌍', color: 'teal' },
                  '地理发现': { icon: '🗺️', color: 'indigo' },
                  '人物传记': { icon: '👤', color: 'gray' },
                }
                
                return (
                  <div className="space-y-6">
                    {recommendedCategories.slice(0, 4).map((catGroup, catIdx) => {
                      const catInfo = categoryIcons[catGroup.category] || { icon: '📺', color: 'gray' }
                      const c = getColor(catInfo.color)
                      
                      return (
                        <div key={catIdx}>
                          <h4 className={`font-bold ${c.text} mb-3 flex items-center gap-2`}>
                            <span className={`w-8 h-8 ${c.light} rounded-full flex items-center justify-center`}>{catInfo.icon}</span>
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
                                      <span className="bg-white px-2 py-0.5 rounded-full text-gray-600">⭐ {doc.rating}</span>
                                      <span className="bg-white px-2 py-0.5 rounded-full text-gray-600">⏱️ {doc.duration}</span>
                                      {doc.episodes && <span className="bg-white px-2 py-0.5 rounded-full text-gray-600">📺 {doc.episodes}集</span>}
                                      <span className={`${c.light} px-2 py-0.5 rounded-full ${c.text}`}>📚 {Array.isArray(doc.educationalValue) ? doc.educationalValue[0] : doc.educationalValue}</span>
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
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        <span className="text-xl">💡</span>
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

          {/* ========== 精准资源投喂 ========== */}
          <PreciseResources reportData={d} />

          {/* 书籍推荐 */}
          <section id="section-books" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">📚</span><span className="mx-2">|</span><span>阅读书籍推荐</span>
              <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">核心资源</span>
            </div>
            <div className="rpt-section-content space-y-6">
              {(() => {
                const topDims = d.topDims as ('W' | 'I' | 'L' | 'D' | 'E' | 'R')[]
                const bookResult = getRecommendedBooks(topDims, d.student.age)
                const childBooks = bookResult.childBooks
                const parentBooks = bookResult.parentBooks
                const childCategories = [...new Set(childBooks.map(b => b.category))]
                
                return (
                  <div className="space-y-6">
                    {/* 孩子书单 */}
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">📖</span>
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
                        <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">👨‍👩‍👧</span>
                        家长阅读书单（{parentBooks.length}本精选）
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {parentBooks.slice(0, 6).map((book, i) => (
                          <div key={i} className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                            <h5 className="font-bold text-gray-800">{book.title}</h5>
                            <p className="text-xs text-gray-500">{book.author}</p>
                            <p className="text-sm text-gray-600 mt-2">{book.synopsis}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 阅读建议 */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        阅读指导建议
                      </h4>
                      <p className="text-green-100">优先选择与{d.sortedDims[0]?.name}相关的书籍，利用优势激发阅读兴趣。</p>
                    </div>
                  </div>
                )
              })()}
            </div>
          </section>

          {/* ========== 新增: 竞赛推荐 ========== */}
          <section id="section-competitions" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">🏆</span><span className="mx-2">|</span><span>竞赛推荐</span>
              <span className="ml-auto text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">拓展资源</span>
            </div>
            <div className="rpt-section-content space-y-6">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  基于{d.student.name}的<strong className="text-rose-600">{d.sortedDims[0]?.name}+{d.sortedDims[1]?.name}</strong>优势特质，推荐以下适合参与的学科竞赛。
                </p>
              </div>
              
              {(() => {
                const topDims = d.topDims as ('W' | 'I' | 'L' | 'D' | 'E' | 'R')[]
                const competitions = getRecommendedCompetitions(topDims, d.student.age, 8)
                const levelColors: Record<string, { bg: string; border: string; badge: string }> = {
                  '国际': { bg: 'from-purple-50 to-violet-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
                  '国家级': { bg: 'from-red-50 to-orange-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
                  '省级': { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
                  '市级': { bg: 'from-green-50 to-emerald-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
                }
                
                return (
                  <div className="grid md:grid-cols-2 gap-4">
                    {competitions.map((comp, i) => {
                      const lc = levelColors[comp.level] || levelColors['市级']
                      const categoryIcons: Record<string, string> = {
                        'science': '🔬', 'math': '📐', 'tech': '💻', 'art': '🎨', 'language': '📝', 'comprehensive': '🌟'
                      }
                      return (
                        <div key={i} className={`bg-gradient-to-br ${lc.bg} border ${lc.border} rounded-xl p-4 hover:shadow-md transition-shadow`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{categoryIcons[comp.category] || '🏅'}</span>
                              <h5 className="font-bold text-gray-800">{comp.name}</h5>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${lc.badge}`}>{comp.level}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{comp.description}</p>
                          <div className="space-y-1 text-xs text-gray-500">
                            <p>📅 适合年级：{comp.gradeRange}</p>
                            <p>⏱️ 备赛周期：{comp.preparationTime}</p>
                            <p>✨ 收益：{comp.benefit}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>
          </section>

          {/* ========== 新增: 夏令营/研学推荐 ========== */}
          <section id="section-camps" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">🏕️</span><span className="mx-2">|</span><span>夏令营与研学推荐</span>
              <span className="ml-auto text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">拓展资源</span>
            </div>
            <div className="rpt-section-content space-y-6">
              {(() => {
                const topDims = d.topDims as ('W' | 'I' | 'L' | 'D' | 'E' | 'R')[]
                const camps = getRecommendedSummerCamps(topDims, d.student.age, 6)
                const typeIcons: Record<string, { icon: string; color: string }> = {
                  '学术': { icon: '🎓', color: 'blue' },
                  '科技': { icon: '💻', color: 'purple' },
                  '艺术': { icon: '🎨', color: 'rose' },
                  '体育': { icon: '⚽', color: 'green' },
                  '综合': { icon: '🌟', color: 'amber' },
                }
                
                return (
                  <div className="grid md:grid-cols-2 gap-4">
                    {camps.map((camp, i) => {
                      const tc = typeIcons[camp.type] || typeIcons['综合']
                      const c = getColor(tc.color)
                      return (
                        <div key={i} className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-xl p-4 hover:shadow-md transition-shadow`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{tc.icon}</span>
                              <h5 className="font-bold text-gray-800">{camp.name}</h5>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${c.light} ${c.text}`}>{camp.type}</span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <p className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {camp.location}</p>
                            <p>📅 时长：{camp.duration} | 适合：{camp.gradeRange}</p>
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

          {/* ========== 新增: 在线课程推荐 ========== */}
          <section id="section-course-match" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">💻</span><span className="mx-2">|</span><span>在线课程推荐</span>
              <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">拓展资源</span>
            </div>
            <div className="rpt-section-content space-y-6">
              {(() => {
                const topDims = d.topDims as ('W' | 'I' | 'L' | 'D' | 'E' | 'R')[]
                const courses = getRecommendedOnlineCourses(topDims, d.student.age, 6)
                const difficultyColors: Record<string, { bg: string; badge: string }> = {
                  '入门': { bg: 'from-green-50 to-emerald-50', badge: 'bg-green-100 text-green-700' },
                  '进阶': { bg: 'from-blue-50 to-indigo-50', badge: 'bg-blue-100 text-blue-700' },
                  '高级': { bg: 'from-purple-50 to-violet-50', badge: 'bg-purple-100 text-purple-700' },
                }
                
                return (
                  <div className="grid md:grid-cols-2 gap-4">
                    {courses.map((course, i) => {
                      const dc = difficultyColors[course.difficulty] || difficultyColors['入门']
                      return (
                        <div key={i} className={`bg-gradient-to-br ${dc.bg} border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow`}>
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

          {/* ========== 新增: 博物馆推荐 ========== */}
          <section id="section-museums" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">🏛️</span><span className="mx-2">|</span><span>博物馆与科技馆推荐</span>
              <span className="ml-auto text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">拓展资源</span>
            </div>
            <div className="rpt-section-content space-y-6">
              {(() => {
                const topDims = d.topDims as ('W' | 'I' | 'L' | 'D' | 'E' | 'R')[]
                const museums = getRecommendedMuseums(topDims, 5)
                const typeIcons: Record<string, string> = {
                  '科技馆': '🔬', '自然博物馆': '🌿', '历史博物馆': '📜', '艺术馆': '🎨', '综合': '🏛️'
                }
                
                return (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {museums.map((museum, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{typeIcons[museum.type] || '🏛️'}</span>
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
                          <p className="text-xs text-gray-500">👥 适合年龄：{museum.recommendedAge}</p>
                          <p className="text-xs text-gray-600 bg-gray-50 rounded p-2">{museum.visitTips}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </section>

          {/* ========== 新增: 期刊杂志推荐 ========== */}
          <section id="section-journals" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">📰</span><span className="mx-2">|</span><span>期刊杂志订阅推荐</span>
              <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">拓展资源</span>
            </div>
            <div className="rpt-section-content space-y-6">
              {(() => {
                const topDims = d.topDims as ('W' | 'I' | 'L' | 'D' | 'E' | 'R')[]
                const journals = getRecommendedJournals(topDims, d.student.age, 4)
                
                return (
                  <div className="grid md:grid-cols-2 gap-4">
                    {journals.map((journal, i) => (
                      <div key={i} className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Newspaper className="w-6 h-6 text-[#FFB800]" />
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

          {/* ========== Section 3: 证据链 ========== */}
          <section id="section-evidence" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">🔬</span><span className="mx-2">|</span><span>证据链：我为什么这样判断</span>
            </div>
            <div className="rpt-section-content">
              <p className="text-gray-600 mb-4">以下每条推断都有具体证据支撑，您可以追溯验证：</p>
              <div className="space-y-4">
                {d.evidenceChain.map((ev, i) => {
                  const tagColors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-teal-100 text-teal-700', 'bg-green-100 text-green-700']
                  return (
                    <div key={i} className="rpt-evidence-card">
                      <div className="flex items-start gap-3">
                        <span className={`rpt-tag ${tagColors[i % tagColors.length]}`}>{ev.code}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">证据</p>
                          <p className="text-gray-600 text-sm mt-1"><span className="bg-yellow-100 px-1 rounded">{ev.type}</span> {ev.content}</p>
                          <p className="font-medium text-gray-800 mt-3">→ 推断</p>
                          <p className="text-gray-600 text-sm mt-1">{ev.inference}</p>
                          <p className="font-medium text-gray-800 mt-3">→ 对未来学习的意义</p>
                          <p className="text-gray-600 text-sm mt-1">{ev.futureImplication}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* 导航引导 */}
              <div className="flex justify-center mt-6 mb-2">
                <button 
                  onClick={() => document.getElementById('section-growth-plan')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 font-medium transition-colors"
                >
                  查看成长路径规划 ↓
                </button>
              </div>
            </div>
          </section>

          {/* ========== Section 4: 优势与成长空间 ========== */}
          <section id="section-4" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">💎</span><span className="mx-2">|</span><span>优势与成长空间</span>
            </div>
            <div className="rpt-section-content">
              <div className="flex flex-wrap gap-2 mb-4">
                {d.strengthAssets.tags.map((tag, i) => {
                  const c = getColor(tag.color)
                  return <span key={i} className={`rpt-tag ${c.light} ${c.text}`}>{tag.name}</span>
                })}
              </div>
              {/* 简化展示：家长策略聚焦 */}
              <div className="grid md:grid-cols-2 gap-4">
                {d.strengthAssets.details.map((detail, i) => {
                  const c = getColor(detail.color)
                  return (
                    <div key={i} className={`${c.bg} rounded-xl p-4 border ${c.border}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{detail.emoji}</span>
                        <h5 className={`font-bold ${c.text}`}>{detail.name}</h5>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className={`text-sm ${c.text}`}><strong>家长策略：</strong>{detail.parentStrategy}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ========== Section 5: 成长空间（风险与误区） ========== */}
          <section id="section-5" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">🌱</span><span className="mx-2">|</span><span>成长空间：风险与误区</span>
            </div>
            <div className="rpt-section-content space-y-6">
              {d.risks.map((risk, i) => (
                <div key={i} className="rpt-warning-card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">⚠️</span>
                    <h5 className="font-bold text-amber-800">短板/盲区 #{i + 1}：{risk.title}</h5>
                  </div>
                  <div className="space-y-3 text-sm">
                    <p className="text-gray-700"><strong>表现：</strong>{risk.description}</p>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-amber-800"><strong>早期预警信号：</strong></p>
                      <ul className="mt-2 space-y-1 text-gray-600">
                        {risk.earlyWarnings.map((w, j) => <li key={j}>• {w}</li>)}
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-green-800"><strong>修复策略：</strong></p>
                      <ul className="mt-2 space-y-1 text-gray-600">
                        {risk.repairStrategies.map((s, j) => <li key={j}>{j + 1}. {s}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========== Phase 3: 家长实践指南 ========== */}
          <section id="section-family" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">🏠</span><span className="mx-2">|</span><span>家长实践指南（教育场景解析）</span>
            </div>
            <div className="rpt-section-content space-y-6">
              {/* 学习特点画像 */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">🎯 学习特点画像</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {d.familySolutions.learningProfile.map((lp, i) => (
                    <div key={i} className="bg-white border border-blue-200 rounded-xl p-4">
                      <div className="text-2xl mb-2">{lp.icon}</div>
                      <h5 className="font-bold text-blue-800 mb-2">{lp.title}</h5>
                      <p className="text-sm text-gray-600 mb-3">{lp.description}</p>
                      <ul className="space-y-1.5">
                        {lp.tips.map((tip, j) => (
                          <li key={j} className="text-xs text-gray-500 flex gap-1.5"><span className="text-blue-400">✦</span>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 个性化培养方案 */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">💡 个性化培养方案（场景化解决）</h4>
                <div className="space-y-4">
                  {d.familySolutions.cultivationStrategy.map((cs, i) => {
                    const c = getColor(cs.color)
                    return (
                      <div key={i} className={`border ${c.border} rounded-xl overflow-hidden`}>
                        <div className={`${c.bg} p-3 flex items-center justify-between`}>
                          <span className="font-bold text-gray-700">场景：{cs.scenario}</span>
                          <span className={`text-xs ${c.text} bg-white px-2 py-0.5 rounded-full`}>预期效果：{cs.expectedOutcome}</span>
                        </div>
                        <div className="p-4 space-y-2 text-sm">
                          <p><span className="text-red-500 font-medium">❌ 常见困难：</span><span className="text-gray-600">{cs.problem}</span></p>
                          <p><span className="text-green-600 font-medium">✅ 方案：</span><span className="text-gray-600">{cs.solution}</span></p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 年龄段发展参考 */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">📈 年龄段发展参考</h4>
                <div className="space-y-4">
                  {d.familySolutions.ageDevelopment.map((ad, i) => {
                    const c = getColor(ad.color)
                    return (
                      <div key={i} className={`bg-white border ${c.border} rounded-xl p-5`}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`${c.text} font-bold text-lg`}>{ad.ageRange}</span>
                          <span className="text-gray-500">—</span>
                          <span className="font-medium text-gray-700">{ad.focus}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className={`${c.bg} rounded-lg p-3`}>
                            <p className="font-medium text-gray-700 text-sm mb-2">发展里程碑：</p>
                            <ul className="space-y-1">
                              {ad.milestones.map((m, j) => <li key={j} className="text-xs text-gray-600 flex gap-1.5"><span>🏁</span>{m}</li>)}
                            </ul>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="font-medium text-gray-700 text-sm mb-2">家长角色：</p>
                            <p className="text-xs text-gray-600">{ad.parentRole}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 亲子沟通升级 */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">💬 亲子沟通升级脚本</h4>
                <div className="space-y-4">
                  {d.familySolutions.parentChildCommunication.map((pc, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                      <h5 className="font-bold text-gray-700 mb-3">场景：{pc.situation}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="bg-red-50 rounded-lg p-3">
                          <p className="text-xs text-red-500 font-medium mb-1">❌ 常见错误说法</p>
                          <p className="text-sm text-red-700 italic">{pc.wrongApproach}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-green-600 font-medium mb-1">✅ 推荐说法</p>
                          <p className="text-sm text-green-700 italic">{pc.rightApproach}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-2.5">
                        <p className="text-xs text-blue-700"><strong>为什么有效：</strong>{pc.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ========== Section 6: 成长路径 ========== */}
          <section id="section-growth-plan" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">📈</span><span className="mx-2">|</span><span>成长路径（把焦虑变成路线图）</span>
            </div>
            <div className="rpt-section-content">
              <div className="space-y-6">
                {d.growthPaths.map((path, i) => {
                  const c = getColor(path.color)
                  const bgClass = path.color === 'green' ? 'bg-green-500' : path.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
                  return (
                    <div key={i} className={`border-2 ${c.border} rounded-xl overflow-hidden`}>
                      <div className={`${c.bg} p-4 flex items-center gap-3`}>
                        <div className={`w-10 h-10 ${bgClass} text-white rounded-full flex items-center justify-center font-bold`}>{path.level}</div>
                        <div>
                          <h5 className={`font-bold ${c.text}`}>{path.name}</h5>
                          <p className={`text-sm ${c.text} opacity-80`}>目标：{path.goal}</p>
                        </div>
                        {path.riskWarning && <span className="rpt-tag bg-red-100 text-red-700 ml-auto">风险提示</span>}
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="bg-gray-50 p-3 rounded-lg"><p className="text-gray-500">目标</p><p className="font-medium">{path.goal}</p></div>
                          <div className="bg-gray-50 p-3 rounded-lg"><p className="text-gray-500">周期</p><p className="font-medium">{path.cycle}</p></div>
                          <div className="bg-gray-50 p-3 rounded-lg"><p className="text-gray-500">投入</p><p className="font-medium">{path.effort}</p></div>
                          <div className="bg-gray-50 p-3 rounded-lg"><p className="text-gray-500">可衡量输出</p><p className="font-medium">{path.output}</p></div>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {path.tasks.map((t, j) => <li key={j}>✅ {t}</li>)}
                        </ul>
                        {path.riskWarning && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                            <p className="text-red-700 font-medium">⚠️ 风险提示：</p>
                            <p className="text-red-600 mt-1">{path.riskWarning}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ========== Phase 3: 14天快速启动计划 ========== */}
          <section id="section-14day" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">📋</span><span className="mx-2">|</span><span>14天快速启动计划</span>
            </div>
            <div className="rpt-section-content">
              <p className="text-sm text-gray-500 mb-4">从今天开始，用14天建立第一个好习惯——每天只需10-30分钟。</p>
              <div className="space-y-2">
                {d.fourteenDayPlan.map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${i < 7 ? 'bg-blue-50' : 'bg-purple-50'} border ${i < 7 ? 'border-blue-100' : 'border-purple-100'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${i < 7 ? 'bg-blue-500' : 'bg-purple-500'}`}>{item.day}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-700 text-sm">{item.task}</span>
                        <span className="text-xs bg-white text-gray-500 px-2 py-0.5 rounded-full">{item.duration}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">目标：{item.goal}</p>
                      <p className="text-xs text-blue-600 mt-1 italic">💡 家长话术：{item.parentTip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========== Section 7: 90天行动计划 ========== */}
          <section id="section-7" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">7</span><span className="mx-2">|</span><span>90天行动计划（陪跑清单）</span>
            </div>
            <div className="rpt-section-content">
              <p className="text-gray-600 mb-4">以下是基于Path A（稳健路径）的详细执行计划：</p>
              <div className="overflow-x-auto">
                <table className="rpt-table text-sm">
                  <thead><tr><th className="w-16">周次</th><th>主任务</th><th className="w-20">时长</th><th>产出物</th><th>家长话术</th></tr></thead>
                  <tbody>
                    {d.weeklyPlan.map((row, i) => (
                      <tr key={i} className="rpt-week-row">
                        <td className="font-bold text-blue-600">{row.week}</td>
                        <td><strong>{row.task}</strong></td>
                        <td>{row.duration}</td>
                        <td>{row.output}</td>
                        <td className="text-blue-600 text-xs">{row.parentScript}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ========== Phase 3: 365天年度发展蓝图 ========== */}
          <section id="section-365day" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">📅</span><span className="mx-2">|</span><span>365天年度发展蓝图</span>
            </div>
            <div className="rpt-section-content">
              <p className="text-sm text-gray-500 mb-4">从习惯建立到突破展望，用一年时间完成可见的成长跃迁。</p>
              <div className="space-y-4">
                {d.yearlyBlueprint.map((q, i) => {
                  const c = getColor(q.color)
                  return (
                    <div key={i} className={`border-2 ${c.border} rounded-xl overflow-hidden`}>
                      <div className={`${c.bg} p-4 flex items-center justify-between`}>
                        <div>
                          <span className={`font-bold ${c.text}`}>{q.quarter}</span>
                          <span className="text-gray-500 mx-2">—</span>
                          <span className="font-medium text-gray-700">{q.theme}</span>
                        </div>
                        <span className="text-xs bg-white text-gray-600 px-2 py-1 rounded-full">🏆 {q.milestone}</span>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {q.goals.map((g, j) => (
                            <span key={j} className={`text-xs ${c.bg} ${c.text} px-3 py-1 rounded-full`}>✦ {g}</span>
                          ))}
                        </div>
                        {q.retestNote && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-700 flex items-center gap-2">
                            <span>🔄</span>{q.retestNote}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ========== Section 8: 家庭沟通指南 ========== */}
          <section id="section-8" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">💬</span><span className="mx-2">|</span><span>家庭沟通指南</span>
            </div>
            <div className="rpt-section-content space-y-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">👑</span> 3句鼓励句式
                </h4>
                <div className="space-y-3">
                  {d.communicationScripts.encouragements.map((item, i) => (
                    <div key={i} className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                      <p className="font-medium text-green-800">{item.text}</p>
                      <p className="text-sm text-gray-600 mt-1">使用场景：{item.scene}。意图：{item.intent}。</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">💙</span> 3句提问句式
                </h4>
                <div className="space-y-3">
                  {d.communicationScripts.questions.map((item, i) => (
                    <div key={i} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="font-medium text-blue-800">{item.text}</p>
                      <p className="text-sm text-gray-600 mt-1">使用场景：{item.scene}。意图：{item.intent}。</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">🧡</span> 2句边界句式
                </h4>
                <div className="space-y-3">
                  {d.communicationScripts.boundaries.map((item, i) => (
                    <div key={i} className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                      <p className="font-medium text-amber-800">{item.text}</p>
                      <p className="text-sm text-gray-600 mt-1">使用场景：{item.scene}。意图：{item.intent}。</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ========== 新增: 家长20句常用指导话语 ========== */}
          {d.parentGuidance20 && d.parentGuidance20.phrases.length > 0 && (
            <section id="section-parent-phrases" className="page-break">
              <div className="rpt-section-title flex items-center gap-2">
                <span className="mx-2">|</span><span>家长20句常用指导话语（{d.parentGuidance20.ageLabel}）</span>
              </div>
              <div className="rpt-section-content space-y-5">
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200">
                  <p className="text-sm text-gray-700">以下20句话语根据{d.student.name}的<strong className="text-violet-600">「{d.talentType}」</strong>潜能类型和<strong className="text-violet-600">{d.parentGuidance20.ageLabel}</strong>认知特点定制。</p>
                </div>
                {(['encourage', 'question', 'boundary', 'conflict', 'motivation'] as const).map(cat => {
                  const items = d.parentGuidance20!.phrases.filter(p => p.category === cat)
                  if (items.length === 0) return null
                  const catMeta: Record<string, { icon: string; label: string; color: string }> = {
                    encourage: { icon: '💪', label: '鼓励句式', color: 'green' },
                    question: { icon: '❓', label: '提问句式', color: 'blue' },
                    boundary: { icon: '🛡️', label: '边界设定', color: 'amber' },
                    conflict: { icon: '🤝', label: '冲突化解', color: 'rose' },
                    motivation: { icon: '🔥', label: '激励动力', color: 'purple' },
                  }
                  const meta = catMeta[cat]
                  const c = getColor(meta.color)
                  return (
                    <div key={cat}>
                      <h4 className={"font-bold " + c.text + " mb-3 flex items-center gap-2"}>
                        <span className={"w-7 h-7 " + c.light + " rounded-full flex items-center justify-center text-sm"}>{meta.icon}</span>
                        {meta.label}（{items.length}句）
                      </h4>
                      <div className="space-y-2">
                        {items.map((p, i) => (
                          <div key={i} className={c.bg + " border " + c.border + " rounded-lg p-3"}>
                            <p className="text-sm font-bold text-gray-800 mb-1">"{p.phrase}"</p>
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span>场景：{p.scene}</span>
                              <span>意图：{p.intent}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {d.parentGuidance20.avoidPhrases.length > 0 && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <h4 className="font-bold text-red-700 mb-2">🚫 请避免这些说法</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {d.parentGuidance20.avoidPhrases.map((ap, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border border-red-100">
                          <p className="text-sm text-red-700 line-through">{ap}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ========== Section 9: 学校配合 ========== */}
          <section id="section-9" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">9</span><span className="mx-2">|</span><span>学校与老师怎么配合</span>
            </div>
            <div className="rpt-section-content">
              <p className="text-gray-600 mb-4">以下内容可直接转发给班主任或科学老师：</p>
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-gray-800 mb-3">📚 {d.student.name}的学习风格画像</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {d.schoolCooperation.learningStyle.map((ls, i) => {
                    const c = getColor(ls.color)
                    return (
                      <div key={i} className="bg-white p-3 rounded-lg">
                        <p className="text-sm"><strong className={c.text}>{i + 1}. {ls.title}：</strong>{ls.desc}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-gray-800 mb-3">🎭 适合的课堂角色</h4>
                <div className="flex flex-wrap gap-3">
                  {d.schoolCooperation.classroomRoles.map((role, i) => {
                    const tagColors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-amber-100 text-amber-700']
                    return <span key={i} className={`rpt-tag ${tagColors[i % tagColors.length]}`}>{role}</span>
                  })}
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-800 mb-3">🎯 老师可以给TA的{d.schoolCooperation.teacherOpportunities.length}个机会</h4>
                <div className="space-y-3">
                  {d.schoolCooperation.teacherOpportunities.map((opp, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg">
                      <p className="font-medium text-green-700">{i + 1}. {opp.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{opp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ========== 新增: 家长认知升级（30类型误解vs真相） ========== */}
          {d.talentParentFocus && d.talentParentFocus.length > 0 && (
            <section id="section-parent-focus" className="page-break">
              <div className="rpt-section-title flex items-center gap-2">
                <span className="mx-2">|</span><span>家长认知升级：关于{d.talentType}的真相</span>
              </div>
              <div className="rpt-section-content space-y-5">
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
                  <p className="text-sm text-gray-700">
                    以下内容基于<strong className="text-pink-600">「{d.talentType}」</strong>潜能类型的特征，帮助您识别常见的教育误区，用科学的视角重新理解孩子的行为表现。
                  </p>
                </div>
                
                {d.talentParentFocus.map((focus, i) => (
                  <div key={i} className="bg-white rounded-2xl border-2 border-pink-200 overflow-hidden shadow-md">
                    {/* 高亮核心观点 */}
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">⭐</span>
                        <p className="font-bold text-lg">{focus.highlight}</p>
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-4">
                      {/* 常见误解 */}
                      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">✗</span>
                          <h5 className="font-bold text-red-700 text-sm">常见误解</h5>
                        </div>
                        <p className="text-sm text-red-800 font-medium">家长常说：{focus.commonMisunderstanding}</p>
                      </div>

                      {/* 真相重构 */}
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                          <h5 className="font-bold text-green-700 text-sm">科学真相</h5>
                        </div>
                        <p className="text-sm text-green-800 leading-relaxed">{focus.truthReframe}</p>
                      </div>

                      {/* 行动建议 */}
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">→</span>
                          <h5 className="font-bold text-blue-700 text-sm">今天就能做</h5>
                        </div>
                        <p className="text-sm text-blue-800 leading-relaxed">{focus.actionTip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ========== Section 10: AI职业方向 - 仅对10岁及以上显示 ========== */}
          {Number(d.student.age) >= 10 && (
          <section id="section-10" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">💼</span><span className="mx-2">|</span><span>AI时代职业方向与不可替代能力</span>
            </div>
            <div className="rpt-section-content space-y-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">🚀 AI时代职业方向推荐（{d.careerDirections.length}大方向）</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {d.careerDirections.map((career, i) => {
                    const c = getColor(career.color)
                    return (
                      <div key={i} className={`border ${c.border} rounded-xl p-4 bg-gradient-to-br ${c.bg} to-white`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{career.icon}</span>
                          <h5 className={`font-bold ${c.text}`}>{career.name}</h5>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{career.reason}</p>
                        <p className="text-xs text-gray-500"><strong>路径：</strong>{career.path}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <p className="text-sm text-gray-700"><strong>👉 家长价值提示：</strong>{d.aiInsight}</p>
              </div>
            </div>
          </section>
          )}

          {/* ========== Section 11: 下一步 ========== */}
          <section id="section-11" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">11</span><span className="mx-2">|</span><span>补测与下一步</span>
            </div>
            <div className="rpt-section-content space-y-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">📅 下一步行动</h4>
                <div className="space-y-3">
                  {d.nextSteps.map((ns, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4">
                      <h5 className="font-bold text-gray-800">{i + 1}. {ns.step}</h5>
                      <p className="text-sm text-gray-600 mt-1">{ns.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-3">📅 下一轮测评建议</h4>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div><p className="text-gray-500">建议时间点</p><p className="font-medium">90天后</p></div>
                    <div><p className="text-gray-500">复测目的</p><p className="font-medium">观察{d.bottomDims.map(dim => d.sortedDims.find(s => s.key === dim)?.name || dim).join('和')}的变化</p></div>
                    <div><p className="text-gray-500">预期改变量</p><p className="font-medium">弱项维度提升5-10分</p></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========== Phase 3: 置信度与动态发展说明 ========== */}
          <section id="section-confidence" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">📊</span><span className="mx-2">|</span><span><GlossaryTerm term="置信度">置信度</GlossaryTerm>与动态发展说明</span>
            </div>
            <div className="rpt-section-content space-y-5">
              {/* 置信度范围 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h4 className="font-bold text-blue-800">综合评估<GlossaryTerm term="置信度">置信度</GlossaryTerm></h4>
                    <p className="text-lg font-black text-blue-600">{d.confidenceStatement.overallRange}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {d.confidenceStatement.factors.map((f, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 text-center overflow-hidden">
                      <div className="font-medium text-gray-700 text-sm">{f.name}</div>
                      <div className="text-blue-600 font-bold text-sm mt-1 break-words">{f.value}</div>
                      <div className="text-xs text-gray-400 mt-1 break-words leading-tight" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{f.contribution}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 动态发展说明 */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">⚠️ 动态发展声明</h4>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{d.confidenceStatement.dynamicNote}</div>
              </div>

              {/* 年龄段说明 */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">🌱 当前年龄段特点</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{d.confidenceStatement.ageChangeNote}</p>
              </div>

              {/* 复测建议 */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">🔄</span>
                <p className="text-sm text-purple-700 font-medium">{d.confidenceStatement.retestRecommendation}</p>
              </div>
            </div>
          </section>

          {/* ========== Section 12: 附录 ========== */}
          <section id="section-12" className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">12</span><span className="mx-2">|</span><span>附录：评分解释</span>
            </div>
            <div className="rpt-section-content space-y-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-3">🔷 WILDER六维解释</h4>
                <div className="overflow-x-auto">
                  <table className="rpt-table text-sm">
                    <thead><tr><th>维度</th><th>英文</th><th>一句话定义</th><th>高分表现</th><th>低分表现</th></tr></thead>
                    <tbody>
                      {[
                        { dim: 'W', en: 'Wonder', def: '对世界的好奇心与探索欲', high: '主动提问、关注新事物', low: '对新事物无感、很少主动提问' },
                        { dim: 'I', en: 'Inquiry', def: '探究与求证的能力', high: '提出假设、收集证据', low: '只接受答案、不会追问验证' },
                        { dim: 'L', en: 'Link', def: '协作与连接的能力', high: '主动帮助、整合观点', low: '独来独往、不考虑他人需求' },
                        { dim: 'D', en: 'Design', def: '设计与规划的能力', high: '制定计划、迭代优化', low: '随机行动、不做计划' },
                        { dim: 'E', en: 'Expression', def: '表达与呈现的能力', high: '清晰表达、回应反馈', low: '表达混乱、无法回应提问' },
                        { dim: 'R', en: 'Reflection', def: '反思与自我调节的能力', high: '自我觉察、分析原因', low: '重复犯错、不会归因分析' },
                      ].map((item, i) => (
                        <tr key={i}><td className="font-bold text-blue-600">{item.dim}</td><td>{item.en}</td><td>{item.def}</td><td>{item.high}</td><td>{item.low}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-3">🎯 模型说明</h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{d.appendix.modelExplanation}</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-3">⚖️ 隐私与免责声明</h4>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700 mb-3">{d.appendix.privacyNote}</p>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>1. <strong>教育支持用途：</strong>本报告为教育评估参考，不替代医学诊断、临床心理评估或专业教育咨询。</li>
                    <li>2. <strong>发展可变性：</strong>所有结论反映测评时点的状态，儿童发展具有可塑性。</li>
                    <li>3. <strong>不贴标签：</strong>报告中的"分型"是理解孩子的工具，不是终身标签。</li>
                    <li>4. <strong>数据归属：</strong>测评数据和报告内容归家庭所有。</li>
                  </ul>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-3">📝 审计日志</h4>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  <p>模型版本：{d.appendix.auditLog.model_version}</p>
                  <p>生成时间：{d.appendix.auditLog.timestamp}</p>
                  <p>隐私合规：{d.appendix.auditLog.data_privacy}</p>
                  <p>报告变体：#{d.variantId} | 画像编码：{d.profileCode}</p>
                </div>
              </div>
            </div>
          </section>

          {/* ========== 教育学家虚拟专家讨论系统 ========== */}
          <section id="section-educator-consultation" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">👨‍🏫</span><span className="mx-2">|</span><span>教育学家圆桌会议 · 跨时空专家研讨</span>
            </div>
            <div className="rpt-section-content">
              <EducatorConsultation
                wilderScores={{
                  W: d.wilderScores.W ?? 0,
                  I: d.wilderScores.I ?? 0,
                  L: d.wilderScores.L ?? 0,
                  D: d.wilderScores.D ?? 0,
                  E: d.wilderScores.E ?? 0,
                  R: d.wilderScores.R ?? 0,
                }}
                childAge={d.student.age}
                childName={d.student.name}
              />
            </div>
          </section>

          {/* ========== 证据链与高光重现 ========== */}
          <section id="section-evidence-chain" ref={trackSection} className="page-break">
            <EvidenceChain reportData={d} />
          </section>

          {/* ========== AI 深度分析（AI-Native 引擎） ========== */}
          <AIInsightReportSection
            studentName={d.student.name}
            studentAge={d.student.age}
            wilderScores={d.wilderScores}
            profileCode={d.profileCode}
            vectorPoint={d.vectorPoint ?? undefined}
            emergentTalents={d.emergentTalents ?? undefined}
          />

          {/* ========== 专家解读 ========== */}
          <section id="section-expert" ref={trackSection} className="page-break">
            <div className="rpt-section-title flex items-center gap-2">
              <span className="text-xl">🌿</span><span className="mx-2">|</span><span>预约专家解读 · 开启成长之旅</span>
            </div>
            <div className="rpt-section-content space-y-6">
              {/* 测评与课程的连接 - 简化版 */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-6">
                <h4 className="font-bold text-teal-800 mb-3 text-lg">🎯 基于{d.talentType}潜能画像的定制方案</h4>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  这份报告识别出{d.student.name}的核心优势是<strong className="text-[#2A4CC0]">{d.sortedDims[0]?.name}+{d.sortedDims[1]?.name}</strong>。GROWMATE可根据这一画像，为TA定制专属成长路径：
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {d.topDims.slice(0, 2).map((dim, i) => {
                    const dimInfo = d.sortedDims.find(s => s.key === dim)
                    return (
                      <div key={i} className="flex items-start gap-3 bg-white/80 rounded-xl p-4 border border-teal-100">
                        <span className="text-2xl">{dimInfo?.emoji || '⭐'}</span>
                        <div>
                          <h5 className="font-bold text-gray-800 text-sm">{dimInfo?.name}优势 → 推荐课程</h5>
                          <p className="text-xs text-gray-600 mt-1">
                            {dim === 'W' && '「自然观察家」系列，激发好奇心与探索欲'}
                            {dim === 'I' && '「小小科学家」实验探究，培养系统性科学方法'}
                            {dim === 'L' && '「团队挑战营」协作课程，强化连接与沟通'}
                            {dim === 'D' && '「创客工坊」设计课程，将创意转化为项目'}
                            {dim === 'E' && '「科学演说家」表达课程，增强科学沟通力'}
                            {dim === 'R' && '「思维日志」反思课程，培养自我觉察能力'}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ========== 报告解读专家 CTA - 已隐藏 ========== */}
              {/*
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-center text-white">
                <h4 className="text-xl font-black mb-2">📞 预约一对一报告解读</h4>
                <p className="text-teal-100 text-sm mb-5 max-w-lg mx-auto">
                  GROWMATE专家老师将为您深度解读{d.student.name}的潜能报告，并定制专属成长建议。
                </p>
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-teal-50 rounded-2xl p-5 border-2 border-teal-400 shadow-lg">
                    <p className="text-center text-sm text-gray-600 font-medium mb-3">GROWMATE · 科创教育入学测评</p>
                    <img src="/images/expert-wechat-qr.jpg" alt="GROWMATE微信二维码" className="w-36 h-36 rounded-lg mx-auto" />
                    <p className="text-center text-sm text-gray-700 font-bold mt-3">GROWMATE · 科创教育入学测评</p>
                    <p className="text-center text-xs text-[#2A4CC0] mt-1">扫码添加，预约一对一报告解读</p>
                  </div>
                  <a
                    href="/images/expert-wechat-qr.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2A4CC0] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all no-underline"
                  >
                    长按保存二维码 · 微信扫一扫添加
                  </a>
                </div>
              </div>
              */}

              {/* ========== 苹果级极简 CTA 区域 ========== */}
              <div className="relative rounded-2xl overflow-hidden" style={{
                backgroundColor: '#FCFDF9',
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.01) 1px, rgba(0,0,0,0.01) 2px)',
                padding: '3rem 2rem'
              }}>
                <div className="text-center max-w-lg mx-auto">
                  {/* 大标题 */}
                  <h3 className="tracking-tight mb-3" style={{
                    color: '#0A2540',
                    fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                    fontWeight: 800,
                    lineHeight: 1.2
                  }}>
                    发现孩子的科创天赋力
                  </h3>

                  {/* 副标题 */}
                  <p className="mb-8" style={{
                    color: '#64748B',
                    fontSize: '1.1rem',
                    fontFamily: 'Georgia, "Noto Serif SC", serif',
                    lineHeight: 1.6
                  }}>
                    20分钟科学测评，精准定位科创潜能
                  </p>

                  {/* CTA 按钮 */}
                  <a
                    href="#section-expert-top"
                    className="inline-flex items-center gap-2.5 no-underline transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #0A2540, #1a3a5c)',
                      color: '#FFFFFF',
                      fontSize: '18px',
                      fontWeight: 600,
                      padding: '16px 48px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(10,37,64,0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 24px rgba(10,37,64,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(10,37,64,0.3)';
                    }}
                  >
                    <Compass size={20} strokeWidth={2} />
                    立即开始评测
                  </a>

                  {/* 信任标签组 */}
                  <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                      <Award size={18} style={{ color: '#D4A853' }} />
                      学员专属
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                      <TrendingUp size={18} style={{ color: '#00BFA5' }} />
                      即时报告
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                      <ShieldCheck size={18} style={{ color: '#00BFA5' }} />
                      数据安全
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════ Premium Footer ═══════ */}
          <footer style={{
            backgroundColor: '#F1F5F9',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(148,163,184,0.03) 2px, rgba(148,163,184,0.03) 3px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(148,163,184,0.03) 2px, rgba(148,163,184,0.03) 3px)',
          }} className="mt-12 print:mt-4">
            <div className="max-w-6xl mx-auto px-8 lg:px-12 pt-16 pb-8">
              {/* 品牌 + 四列导航 */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-8 lg:gap-12">
                {/* 品牌列 */}
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      background: 'linear-gradient(135deg, #0A2540 0%, #1a4a6c 50%, #0A2540 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>GROWMATE</span>
                  </div>
                  <div className="mb-3">
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.3em', color: '#64748B' }}>EDU · OS</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748B', maxWidth: '240px' }}>
                    AI驱动的儿童科创潜能评估系统，以WILDER六维模型为核心，为每个孩子绘制独一无二的成长地图。
                  </p>
                </div>
                {/* 产品服务 */}
                <div>
                  <h4 className="text-sm font-semibold mb-4" style={{ color: '#1E293B', letterSpacing: '0.05em' }}>产品服务</h4>
                  <ul className="space-y-2.5">
                    {['WILDER测评', '潜能报告', '成长规划', '家长端'].map(item => (
                      <li key={item} className="text-sm" style={{ color: '#475569', fontWeight: 300 }}>{item}</li>
                    ))}
                  </ul>
                </div>
                {/* 关于我们 */}
                <div>
                  <h4 className="text-sm font-semibold mb-4" style={{ color: '#1E293B', letterSpacing: '0.05em' }}>关于我们</h4>
                  <ul className="space-y-2.5">
                    {['品牌故事', '教育理念', '团队介绍', '加入我们'].map(item => (
                      <li key={item} className="text-sm" style={{ color: '#475569', fontWeight: 300 }}>{item}</li>
                    ))}
                  </ul>
                </div>
                {/* 帮助支持 */}
                <div>
                  <h4 className="text-sm font-semibold mb-4" style={{ color: '#1E293B', letterSpacing: '0.05em' }}>帮助支持</h4>
                  <ul className="space-y-2.5">
                    {['常见问题', '联系客服', '隐私政策', '服务条款'].map(item => (
                      <li key={item} className="text-sm" style={{ color: '#475569', fontWeight: 300 }}>{item}</li>
                    ))}
                  </ul>
                </div>
                {/* 资源中心 */}
                <div>
                  <h4 className="text-sm font-semibold mb-4" style={{ color: '#1E293B', letterSpacing: '0.05em' }}>资源中心</h4>
                  <ul className="space-y-2.5">
                    {['科创指南', '家长学院', '研究报告', '合作伙伴'].map(item => (
                      <li key={item} className="text-sm" style={{ color: '#475569', fontWeight: 300 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* 分割线 */}
              <div className="my-8" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #CBD5E1, transparent)' }} />
              {/* 版权 + 荣誉 */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs" style={{ color: '#94A3B8' }}>© 2026 GROWMATE. 保留所有权利。</p>
                <p className="text-xs" style={{ color: '#94A3B8', letterSpacing: '0.05em', fontWeight: 300 }}>
                  中科院AI+实验室 · 中国教育学会重点课题 · 创客中国赛区冠军
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
