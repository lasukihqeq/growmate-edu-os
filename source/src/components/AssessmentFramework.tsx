import { useState, useEffect } from 'react'
import { ArrowLeft, Printer, ArrowUp, ChevronDown, ChevronRight, CheckCircle, AlertTriangle, BookOpen, Target, Brain, Users, Lightbulb, Shield, Compass, Award, Activity, BarChart3, ClipboardCheck } from 'lucide-react'

// ===== 10项国际测评模型数据 =====
const assessmentModels = [
  {
    id: 'pisa',
    name: 'PISA 学业素养',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'blue',
    subtitle: '阅读·数学·科学',
    status: 'core' as const,
    description: '基于OECD PISA框架的学业素养评估，测量阅读理解、数学思维和科学探究三大核心素养。',
    designPrinciple: '不考学科知识，而是评估"在真实情境中运用知识解决问题"的能力。采用情境任务而非传统试题。',
    testMethod: {
      format: 'AI对话中嵌入情境任务',
      duration: '约8-10分钟（分散在42分钟对话中）',
      items: 6,
      approach: '通过故事情境自然引入阅读理解、逻辑推理和科学探究任务'
    },
    questions: [
      {
        dimension: '阅读素养',
        type: '情境嵌入式',
        example: 'AI角色"小探"给孩子讲一个关于海豚的科普短文(200字)，然后问："文章说海豚用回声定位找食物，你能用自己的话解释一下这是什么意思吗？"',
        scoring: '评估：信息提取(能否找到关键信息)、理解整合(能否用自己的话解释)、反思评价(能否提出疑问)',
        rubric: ['L1: 只能复述原文关键词', 'L2: 能用自己的话部分解释', 'L3: 能完整解释并举一反三']
      },
      {
        dimension: '数学素养',
        type: '游戏化任务',
        example: '"小探"说："我们要给教室里的25个同学分糖果，每袋有8颗，需要几袋才能保证每人至少得到2颗？"',
        scoring: '评估：数量推理(能否建立数学模型)、策略选择(是逐步计算还是估算)、结果验证(是否主动检查答案)',
        rubric: ['L1: 尝试但方法不完整', 'L2: 能算出正确答案', 'L3: 能算出并解释思路，考虑余数']
      },
      {
        dimension: '科学素养',
        type: '探究对话',
        example: '"小探"展示一个实验场景："如果我们把一块冰放在阳光下和阴凉处，你觉得哪个化得快？为什么？你会怎么设计实验来验证？"',
        scoring: '评估：假设提出(能否给出合理预测)、实验设计(能否控制变量)、证据推理(能否基于证据得出结论)',
        rubric: ['L1: 能预测但无法解释', 'L2: 能提出假设和简单实验方案', 'L3: 能设计有控制变量的实验']
      }
    ],
    interpretation: {
      lookFor: '不看"答对了几道"，而看"思考过程的质量"',
      dimensions: [
        { name: '阅读', high: '信息提取快、能跨文本整合、有批判意识', low: '停留在字面理解、难以推理隐含信息' },
        { name: '数学', high: '能建立数学模型、策略灵活、重视验证', low: '依赖记忆公式、缺少策略意识' },
        { name: '科学', high: '有证据意识、能设计简单实验、逻辑清晰', low: '凭直觉判断、不习惯用证据说话' }
      ],
      meaning: '反映孩子"用知识做事"的能力水平。高分意味着学术潜力好，低分不等于"学不好"，可能是缺少这类训练。'
    },
    development: [
      { level: '阅读高', strategy: '提供跨学科阅读材料，鼓励"读后问三个问题"' },
      { level: '阅读低', strategy: '从兴趣出发选书，每天亲子共读15分钟，先讨论再总结' },
      { level: '数学高', strategy: '引入数学建模类游戏(如数独进阶)，参加趣味数学活动' },
      { level: '数学低', strategy: '用实物操作代替抽象运算，把数学融入日常场景(购物、烘焙)' },
      { level: '科学高', strategy: '鼓励做家庭小实验，记录"科学日记"' },
      { level: '科学低', strategy: '多问"你觉得为什么？"引导观察和假设' }
    ],
    qualityControl: {
      indicators: ['回答一致性', '投入度评分', '语言复杂度'],
      antiCheat: '通过AI对话自然嵌入，减少"应试心态"；追问机制检验理解深度',
      confidenceNote: '阅读和科学维度置信度较高（对话数据丰富），数学维度可能需要补充纸笔测试'
    },
    supplementary: {
      needed: true,
      reason: '数学素养在纯对话场景中评估有局限，建议补充10分钟纸笔任务',
      prediction: '基于对话中的逻辑推理和问题解决表现，预测数学素养为"中高"水平'
    }
  },
  {
    id: 'bigfive',
    name: 'Big Five 人格',
    icon: <Brain className="w-5 h-5" />,
    color: 'purple',
    subtitle: 'O·C·E·A·N',
    status: 'core' as const,
    description: '基于大五人格理论(NEO-FFI)的儿童适配版，评估开放性、尽责性、外向性、宜人性和神经质五个核心人格维度。',
    designPrinciple: '不直接问人格问题，而是通过行为选择和情境反应来推断人格特质。儿童版使用行为描述替代自我报告。',
    testMethod: {
      format: 'AI对话中的情境选择 + 行为观察编码',
      duration: '约6-8分钟（分散嵌入）',
      items: 15,
      approach: '每个维度3道情境题，通过"如果遇到这个情况你会怎么做"来自然评估'
    },
    questions: [
      {
        dimension: 'O 开放性',
        type: '情境选择',
        example: '"今天有两个活动可以选：一个是去博物馆看恐龙化石展，一个是在家玩你最喜欢的游戏。你选哪个？为什么？"',
        scoring: '选新活动+好奇心驱动的解释→O↑; 选熟悉活动+舒适导向→O↓; 关键看"为什么"的深度',
        rubric: ['O↑: 选择新事物并能说出好奇点', 'O中: 犹豫但愿意尝试', 'O↓: 偏好熟悉和确定性']
      },
      {
        dimension: 'C 尽责性',
        type: '任务行为',
        example: '"小探给你一个任务：帮忙整理10张卡片，按颜色排好。你准备怎么做？先做什么后做什么？"（观察是否制定计划、是否有条理）',
        scoring: '有清晰计划+按步骤执行→C↑; 随机行动但能完成→C中; 跳过步骤或中途放弃→C↓',
        rubric: ['C↑: 先分类再排列，检查结果', 'C中: 直接动手，基本完成', 'C↓: 随意排列或中途转话题']
      },
      {
        dimension: 'E 外向性',
        type: '社交情境',
        example: '"如果明天学校来了一个新同学，你会怎么做？会主动去认识他吗？"',
        scoring: '主动打招呼+带他参观→E↑; 等老师介绍再说→E中; 不太想主动接触→E↓',
        rubric: ['E↑: 主动热情，描述详细的互动计划', 'E中: 愿意但等待时机', 'E↓: 需要被推动才会社交']
      }
    ],
    interpretation: {
      lookFor: '看行为倾向的一致性，而非单次选择。三道同维度题的一致性是关键。',
      dimensions: [
        { name: 'O开放性', high: '好奇心强、喜欢新体验、思维灵活', low: '偏好常规、不喜欢变化（不是"封闭"，是"稳定"）' },
        { name: 'C尽责性', high: '有计划、有条理、负责任', low: '灵活随性、行动导向（不是"不负责"，是"即兴型"）' },
        { name: 'E外向性', high: '社交主动、精力充沛、表达欲强', low: '内省、深度思考、独处充电（不是"孤僻"，是"内向"）' },
        { name: 'A宜人性', high: '关注他人、乐于助人、避免冲突', low: '独立思考、敢于质疑（不是"不友善"，是"独立"）' },
        { name: 'N神经质', high: '情绪敏感、容易焦虑', low: '情绪稳定、抗压力强' }
      ],
      meaning: '人格没有"好坏"之分。每种特质在不同情境中都有其价值。了解人格特质是为了匹配最适合的教育方式。'
    },
    development: [
      { level: 'O高', strategy: '提供多样化学习体验，但注意不要"什么都学一点、什么都不深入"' },
      { level: 'C低', strategy: '用"可视化计划表"帮助建立习惯，番茄钟法培养专注力' },
      { level: 'E高', strategy: '发挥社交优势的同时，练习"独处作业时间"' },
      { level: 'A高', strategy: '在保持善良的同时，学习表达自己的需求和边界' },
      { level: 'N高', strategy: '教授情绪命名技巧和"深呼吸三步法"，不压抑而是管理情绪' }
    ],
    qualityControl: {
      indicators: ['跨维度一致性', '社会赞许性得分', '回答时间'],
      antiCheat: '同维度3题交叉验证；追问"为什么"来区分真实选择和迎合性回答',
      confidenceNote: 'O、E维度置信度高（行为信号明显），C维度需结合90天行为观察验证'
    },
    supplementary: {
      needed: false,
      reason: 'AI对话场景能较好捕捉五维特质，但N维度(神经质)在轻松对话中可能被低估',
      prediction: ''
    }
  },
  {
    id: 'mbti',
    name: 'MBTI 类型',
    icon: <Compass className="w-5 h-5" />,
    color: 'teal',
    subtitle: '16型人格',
    status: 'derived' as const,
    description: 'MBTI不单独测评，而是从Big Five和WILDER数据中推导。提供类型参考而非精确分类。',
    designPrinciple: '使用Big Five到MBTI的映射算法，结合WILDER行为数据进行交叉验证。强调"参考"而非"定义"。',
    testMethod: {
      format: '算法推导（无独立测评题目）',
      duration: '0分钟（从已有数据计算）',
      items: 0,
      approach: 'O→N/S，C→J/P，E→E/I，A→F/T 映射，加WILDER行为数据校正'
    },
    questions: [
      {
        dimension: 'E/I 维度',
        type: '从Big Five E推导',
        example: '不设独立题目。基于Big Five外向性得分+WILDER L(连接力)得分综合判断。',
        scoring: 'BigFive E≥60 && WILDER L≥65 → MBTI E; 否则 → MBTI I',
        rubric: ['强E: BigFive E高+WILDER L高', '弱E: BigFive E高但WILDER L中', '强I: BigFive E低+独处偏好明显']
      },
      {
        dimension: 'N/S 维度',
        type: '从Big Five O推导',
        example: '基于Big Five开放性得分+对话中抽象思维表现推导。',
        scoring: 'BigFive O≥65 && 对话中有联想/类比 → MBTI N; 否则 → MBTI S',
        rubric: ['N: 联想丰富、关注可能性', 'S: 关注具体细节、实际操作']
      }
    ],
    interpretation: {
      lookFor: 'MBTI结果仅作参考，不用于重大教育决策。关注"偏好模式"而非"固定类型"。',
      dimensions: [
        { name: 'E/I', high: '外向型：从社交中获取能量', low: '内向型：从独处中恢复能量' },
        { name: 'N/S', high: '直觉型：关注可能性和模式', low: '感知型：关注具体事实和细节' },
        { name: 'T/F', high: '思维型：重逻辑和一致性', low: '情感型：重价值观和和谐' },
        { name: 'J/P', high: '判断型：喜欢计划和确定性', low: '感知型：喜欢灵活和开放性' }
      ],
      meaning: 'MBTI提供"偏好地图"，帮助理解孩子的信息处理和决策风格。10岁儿童的MBTI尚未稳定，仅供参考。'
    },
    development: [
      { level: 'ENFP', strategy: '发挥创意和社交优势，重点培养"完成一件事"的习惯' },
      { level: 'INTJ', strategy: '尊重独处需求，提供深度学习机会，鼓励口头表达想法' },
      { level: '所有类型', strategy: '不要用MBTI限制孩子的发展，每种类型都有无限可能' }
    ],
    qualityControl: {
      indicators: ['BigFive-MBTI映射一致性', '行为数据校验分'],
      antiCheat: '从多维度交叉验证，不依赖单一来源',
      confidenceNote: 'E/I和N/S维度置信度较高，T/F和J/P在10岁儿童中分化不明显'
    },
    supplementary: {
      needed: true,
      reason: '10岁儿童MBTI尚不稳定，建议14岁后正式施测MBTI标准量表',
      prediction: '基于当前数据预测ENFP-A（竞选者型），置信度0.72'
    }
  },
  {
    id: 'wilder',
    name: 'WILDER 六维',
    icon: <Target className="w-5 h-5" />,
    color: 'amber',
    subtitle: '好奇·探究·连接·设计·表达·反思',
    status: 'core' as const,
    description: 'GROWMATE自研的核心评估模型，测量探究力六个维度：Wonder好奇、Inquiry探究、Link连接、Design设计、Expression表达、Reflection反思。',
    designPrinciple: '基于60万儿童数据库建模，每个维度通过3-5个自然对话任务评估。强调"行为证据"而非"自我报告"。',
    testMethod: {
      format: 'AI对话任务 + 实时行为编码',
      duration: '贯穿整个42分钟测评',
      items: 24,
      approach: '每维度4个递进任务：感知→操作→整合→迁移'
    },
    questions: [
      {
        dimension: 'W 好奇心',
        type: '自由探索任务',
        example: '"小探"展示一张奇特的图片(比如深海发光生物)，观察孩子是否主动提问。追踪：提问数量、问题质量(事实性/探究性/创意性)、持续时间。',
        scoring: '主动提出3+探究性问题→W极强(90+); 1-2个问题→W中; 无提问→W待激活',
        rubric: ['W极强: 问"为什么发光""怎么做到的"', 'W高: 问"这是什么""在哪里"', 'W中: 等待引导才提问']
      },
      {
        dimension: 'I 探究力',
        type: '假设验证任务',
        example: '"这里有一个谜题：为什么热水比冷水结冰更快(姆潘巴效应)？你会怎么验证这个说法？"观察假设提出、实验设计、逻辑推理。',
        scoring: '能提假设+设计实验+分析结果→I极强; 能提假设但无验证方案→I中; 接受现成答案→I待激活',
        rubric: ['I极强: 提出可验证的假设', 'I高: 有想法但方案不完整', 'I中: 需引导才能思考']
      },
      {
        dimension: 'L 连接力',
        type: '协作情境模拟',
        example: '"假设你和3个同学一起做一个科学项目，其中一个同学不太会，你会怎么做？"观察协作意愿、角色取向、冲突处理。',
        scoring: '主动帮助+整合团队→L强; 做好自己的→L中; 不考虑他人→L弱',
        rubric: ['L强: "我可以教他，然后我们分工"', 'L中: "我先做我的部分"', 'L弱: "让老师处理吧"']
      }
    ],
    interpretation: {
      lookFor: '六维平衡度和核心优势模式。不追求"六维全高"，而是找到"优势引擎"和"待升级模块"。',
      dimensions: [
        { name: 'W好奇心', high: '探索驱动型，对新事物天然兴奋', low: '需要外部激励才会探索' },
        { name: 'I探究力', high: '善于提假设、找证据、做推理', low: '倾向于接受现成答案' },
        { name: 'L连接力', high: '善于团队协作、整合资源', low: '偏好独立工作，需培养协作意识' },
        { name: 'D设计力', high: '能规划、迭代、完成闭环', low: '需要结构化支持和外部检查点' },
        { name: 'E表达力', high: '清晰表达、结构化呈现', low: '有想法但表达不完整' },
        { name: 'R反思力', high: '善于归因分析、自我调节', low: '需要引导才能进行反思' }
      ],
      meaning: 'WILDER反映的是"探究型学习"的能力结构。六维组合决定孩子的"潜能分型"和最佳学习策略。'
    },
    development: [
      { level: 'W极强', strategy: '保护好奇心，提供多样化探索机会，但注意"从散点到线索"的整合' },
      { level: 'I高', strategy: '提供更多"动手验证"机会，参加科学实验课或STEM项目' },
      { level: 'L弱', strategy: '从"好奇心采访"开始——每周采访一个人，把对事物的好奇迁移到对人的好奇' },
      { level: 'D低', strategy: '用"微项目"训练闭环能力——每个项目不超过2周，确保从头做到尾' },
      { level: 'R弱', strategy: '"今日三问"——发生了什么？为什么？下次怎么做？每天3分钟复盘' }
    ],
    qualityControl: {
      indicators: ['维度间一致性', '回答深度评分', '投入度时间轨迹', '追问一致性'],
      antiCheat: '每维度4题递进设计，难度逐级提升；追问验证理解深度；AI实时检测迎合性回答',
      confidenceNote: 'W/I/E维度置信度高(>0.85)，L/D/R维度需补充实际行为数据'
    },
    supplementary: {
      needed: false,
      reason: '作为核心模型，42分钟对话提供充分数据。但建议90天后复测验证L/R维度变化。',
      prediction: ''
    }
  },
  {
    id: 'via',
    name: 'VIA 品格优势',
    icon: <Award className="w-5 h-5" />,
    color: 'rose',
    subtitle: '24项品格优势',
    status: 'predicted' as const,
    description: 'VIA(Values in Action)品格优势识别，基于积极心理学24项品格优势框架。儿童版通过行为推断Top5优势。',
    designPrinciple: '不直接测评24项，而是从WILDER和Big Five数据中推断Top5品格优势。后续可用VIA Youth Survey验证。',
    testMethod: {
      format: '算法推导 + 行为佐证（半预测）',
      duration: '0分钟独立时间，嵌入WILDER评估中',
      items: 0,
      approach: '从WILDER/BigFive行为数据中推导VIA品格优势的映射关系'
    },
    questions: [
      {
        dimension: '品格推断逻辑',
        type: '映射规则',
        example: 'WILDER W极强 + BigFive O高 → 推断"好奇心"和"热爱学习"为Top优势\nWILDER I高 + 科学素养高 → 推断"洞察力"和"审慎"为Top优势\nWILDER E高 + BigFive E高 → 推断"热情"和"社交智慧"为Top优势',
        scoring: '每项品格优势由2-3个指标交叉验证，取Top5呈现',
        rubric: ['强信号: 3个指标一致指向', '中信号: 2个指标指向', '弱信号: 仅1个指标']
      }
    ],
    interpretation: {
      lookFor: 'Top5品格优势代表孩子最自然、最有能量的特质。关注"优势"而非"缺陷"。',
      dimensions: [
        { name: 'Top5优势', high: '在日常行为中频繁展现这些品格', low: '(VIA不评估"低分"维度)' }
      ],
      meaning: '品格优势是"正确使用时让人感觉最自然、最有活力"的特质。Top5优势是教育干预的最佳着力点。'
    },
    development: [
      { level: '好奇心优势', strategy: '提供丰富探索机会，鼓励"每日一发现"' },
      { level: '热爱学习优势', strategy: '给予自主选择学习内容的空间' },
      { level: '社交智慧优势', strategy: '创造团队领导机会' }
    ],
    qualityControl: {
      indicators: ['推断一致性', '行为佐证数量'],
      antiCheat: '标注为"预测结果"，建议后续用VIA Youth Survey验证',
      confidenceNote: '预测置信度0.72，建议12岁后施测正式VIA量表'
    },
    supplementary: {
      needed: true,
      reason: '当前为算法预测结果，建议12岁后使用VIA Youth Survey(96题)正式施测',
      prediction: '预测Top5: 好奇心、热爱学习、洞察力、热情、创造力'
    }
  },
  {
    id: 'grit',
    name: 'Grit 坚毅力',
    icon: <Shield className="w-5 h-5" />,
    color: 'green',
    subtitle: '热情·毅力',
    status: 'supplementary' as const,
    description: '基于Angela Duckworth的Grit理论，评估"对长期目标的持久热情和坚持不懈的努力"。',
    designPrinciple: '10岁儿童的Grit尚在发展中，采用行为线索推断而非量表自评。关注"过程中的坚持信号"。',
    testMethod: {
      format: '任务行为观察 + 家长问卷补充',
      duration: '约3分钟嵌入任务',
      items: 3,
      approach: '通过递进难度任务观察放弃/坚持行为，结合对话中的自我叙述'
    },
    questions: [
      {
        dimension: '毅力子维度',
        type: '渐进难度任务',
        example: '"小探"给出一个从简单到困难的拼图/谜题序列。观察：遇到困难时是求助、跳过还是坚持？失败后是否愿意再试一次？',
        scoring: '主动重试2次以上→毅力高; 尝试1次后放弃→毅力中; 遇困难立即跳过→毅力待发展',
        rubric: ['高毅力: 失败后说"我再试试"', '中毅力: 失败后犹豫但愿意尝试', '低毅力: 失败后转移话题']
      },
      {
        dimension: '热情子维度',
        type: '兴趣持续性询问',
        example: '"你最喜欢做什么？做了多久了？中间有没有想放弃的时候？后来怎么坚持下来的？"',
        scoring: '有持续1年以上的兴趣→热情高; 兴趣频繁更换→热情待发展',
        rubric: ['高热情: 能讲述坚持过程中的困难和克服', '中热情: 有兴趣但易转移', '低热情: 没有明确持续兴趣']
      }
    ],
    interpretation: {
      lookFor: '10岁的Grit处于发展关键期，关注"可塑性"而非"定型"。',
      dimensions: [
        { name: '毅力', high: '遇到困难不轻易放弃', low: '容易放弃（很正常，是可训练的）' },
        { name: '热情', high: '有持续深入的兴趣', low: '兴趣广泛但不深入（探索期正常现象）' }
      ],
      meaning: 'Grit在10岁时仍在快速发展中。当前得分反映"现在的状态"而非"未来的上限"。低Grit≠没有潜力。'
    },
    development: [
      { level: '毅力低', strategy: '"微目标法"——把大目标拆成5分钟的小任务，每完成一个就庆祝' },
      { level: '热情低', strategy: '"兴趣深潜法"——选一个兴趣坚持3个月，体验"从入门到有成果"的完整过程' }
    ],
    qualityControl: {
      indicators: ['行为一致性', '自述与行为匹配度'],
      antiCheat: '用实际任务行为而非自我报告来评估',
      confidenceNote: '行为观察部分置信度0.78，自述部分可能存在社会赞许偏差'
    },
    supplementary: {
      needed: true,
      reason: '42分钟对话无法充分评估"长期坚持"维度。建议：①家长填写Grit-S量表(8题) ②观察90天计划执行情况',
      prediction: '基于对话行为预测Grit总分为"中等"(3.2/5.0)，热情高于毅力'
    }
  },
  {
    id: 'ef',
    name: '执行功能',
    icon: <Activity className="w-5 h-5" />,
    color: 'indigo',
    subtitle: '抑制控制·认知灵活性·工作记忆',
    status: 'supplementary' as const,
    description: '评估前额叶发展水平：抑制控制(能否管住冲动)、认知灵活性(能否灵活切换)、工作记忆(能否同时处理多个信息)。',
    designPrinciple: '通过认知游戏任务直接测量，不依赖自我报告。10岁是执行功能发展的关键期。',
    testMethod: {
      format: 'AI嵌入式认知游戏',
      duration: '约5分钟',
      items: 3,
      approach: '三个游戏分别测量三个子维度'
    },
    questions: [
      {
        dimension: '抑制控制',
        type: '类Stroop任务',
        example: '"小探"说一系列动物名称，听到"猫"要拍手，听到"狗"不能拍手。语速逐渐加快。记录正确率和错误类型。',
        scoring: '正确率>85%→高; 70-85%→中; <70%→待发展',
        rubric: ['高: 快速准确，错误少', '中: 基本准确，偶有冲动错误', '低: 频繁冲动反应']
      },
      {
        dimension: '认知灵活性',
        type: '规则切换任务',
        example: '先按"颜色"分类(红色一堆、蓝色一堆)，然后突然换规则，按"形状"分类。观察切换速度和错误率。',
        scoring: '切换流畅(<3秒)→高; 有犹豫(3-8秒)→中; 持续性错误→待发展',
        rubric: ['高: 1-2个错误后快速适应', '中: 需要3-5次练习', '低: 持续使用旧规则']
      },
      {
        dimension: '工作记忆',
        type: '信息保持任务',
        example: '"小探"讲一个包含4-6个关键信息的短故事，结束后问关于细节的问题。逐步增加信息量。',
        scoring: '能记住5+细节→高; 3-4个→中; <3个→待发展',
        rubric: ['高: 能复述关键情节和细节', '中: 记住主线但遗漏细节', '低: 仅记住开头或结尾']
      }
    ],
    interpretation: {
      lookFor: '执行功能是"学习的底层操作系统"。它影响注意力、学业成绩和社交行为。',
      dimensions: [
        { name: '抑制控制', high: '能管住冲动、三思而后行', low: '容易冲动行事（很常见，可训练）' },
        { name: '认知灵活性', high: '思维灵活、能快速适应变化', low: '思维较固执、适应变化慢' },
        { name: '工作记忆', high: '能同时处理多个信息', low: '一次只能专注一件事（不是"笨"，是发展中）' }
      ],
      meaning: '执行功能在25岁前持续发展。10岁时的评估反映"当前发展水平"，通过有针对性的训练可以显著提升。'
    },
    development: [
      { level: '抑制控制低', strategy: '"红灯停绿灯行"游戏、"等3秒再回答"练习' },
      { level: '认知灵活性低', strategy: '玩规则多变的桌游(如UNO)、"换个角度想"对话练习' },
      { level: '工作记忆低', strategy: '"故事复述"练习(逐步增加长度)、多步骤指令训练' }
    ],
    qualityControl: {
      indicators: ['游戏完成率', '练习效应指数', '注意力波动'],
      antiCheat: '认知游戏难以作弊；通过练习效应检测真实能力',
      confidenceNote: '认知任务置信度高(>0.85)，但可能受当天状态影响'
    },
    supplementary: {
      needed: true,
      reason: 'AI对话中的认知游戏是简化版。建议补充：NIH Toolbox认知电池(15分钟)或BRIEF-2家长问卷',
      prediction: '基于对话任务预测：抑制控制"中"、认知灵活性"高"、工作记忆"中高"'
    }
  },
  {
    id: 'sdq',
    name: 'SDQ 心理筛查',
    icon: <ClipboardCheck className="w-5 h-5" />,
    color: 'red',
    subtitle: '优势与困难问卷',
    status: 'supplementary' as const,
    description: 'SDQ(Strengths and Difficulties Questionnaire)是国际通用的儿童心理健康筛查工具，评估情绪、行为、同伴和亲社会维度。',
    designPrinciple: '作为筛查工具而非诊断工具。AI对话提供初步信号，建议家长/教师版SDQ量表进行正式评估。',
    testMethod: {
      format: '家长问卷(25题) + AI对话信号检测',
      duration: '家长问卷约5分钟；AI信号检测嵌入对话',
      items: 25,
      approach: '标准SDQ家长版(5维度×5题) + AI对话中的情绪/行为信号自动编码'
    },
    questions: [
      {
        dimension: '情绪症状',
        type: '家长问卷',
        example: '"我的孩子经常抱怨头痛、肚子痛等身体不适" "我的孩子经常担心很多事情" "我的孩子经常不开心、沮丧或者爱哭"',
        scoring: '0-2分三级评分（不符合/有些符合/完全符合），0-10分总分',
        rubric: ['正常: 0-3', '边缘: 4', '异常: 5-10']
      },
      {
        dimension: '亲社会行为',
        type: '家长问卷',
        example: '"我的孩子会考虑别人的感受" "我的孩子愿意和其他孩子分享东西" "我的孩子对比自己小的孩子很好"',
        scoring: '注意：亲社会是"优势"维度，分数越高越好',
        rubric: ['正常: 6-10', '边缘: 5', '异常: 0-4']
      }
    ],
    interpretation: {
      lookFor: 'SDQ是"筛查"工具——发现可能需要关注的信号，而非诊断。任何异常结果都需要专业评估确认。',
      dimensions: [
        { name: '情绪症状', high: '可能存在焦虑/抑郁信号', low: '情绪状态良好' },
        { name: '品行问题', high: '可能存在行为管理挑战', low: '行为自我管理好' },
        { name: '多动注意', high: '可能存在注意力/多动信号', low: '注意力管理好' },
        { name: '同伴问题', high: '可能存在社交困难', low: '同伴关系良好' },
        { name: '亲社会行为', high: '利他行为丰富', low: '需要培养亲社会意识' }
      ],
      meaning: '重要声明：SDQ是教育参考工具，不是医学诊断。任何异常得分都建议咨询专业心理健康服务。'
    },
    development: [
      { level: '情绪异常', strategy: '建议咨询专业心理咨询师；家庭可用"情绪温度计"每日追踪' },
      { level: '品行边缘', strategy: '建立清晰的行为边界；使用正向强化而非惩罚' },
      { level: '亲社会低', strategy: '创造帮助他人的机会；角色扮演练习"换位思考"' }
    ],
    qualityControl: {
      indicators: ['家长问卷完成质量', '家长-AI信号一致性', '社会赞许性检测'],
      antiCheat: '家长版和AI信号交叉验证；反向题检测回答一致性',
      confidenceNote: '家长问卷版置信度高(>0.80)，但可能受家长主观偏差影响。建议同时获取教师版。'
    },
    supplementary: {
      needed: true,
      reason: 'AI对话只能提供初步信号。建议：①家长完成标准SDQ ②教师完成SDQ教师版 ③若有异常信号，转介专业评估',
      prediction: '基于AI对话初步信号预测：总困难分"正常范围"，亲社会行为"良好"'
    }
  },
  {
    id: 'riasec',
    name: 'RIASEC 职业兴趣',
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'cyan',
    subtitle: '霍兰德六型',
    status: 'predicted' as const,
    description: '基于Holland职业兴趣理论的六型模型：R实际型、I研究型、A艺术型、S社会型、E企业型、C常规型。',
    designPrinciple: '10岁儿童的职业兴趣尚未分化，采用活动偏好推断而非传统职业兴趣量表。提供"兴趣方向"参考。',
    testMethod: {
      format: '活动偏好选择 + WILDER/BigFive数据推导',
      duration: '约3分钟嵌入任务',
      items: 6,
      approach: '6对活动两两对比选择(强迫选择法)，结合已有数据交叉验证'
    },
    questions: [
      {
        dimension: '六型偏好',
        type: '强迫选择',
        example: '"你更想做哪个？A.修理一个坏掉的玩具(R) vs B.调查为什么玩具会坏(I)"\n"你更想做哪个？A.画一幅画(A) vs B.组织同学一起画(S)"',
        scoring: '每次选择为对应类型+1分，6轮选择后得到Top3',
        rubric: ['R实际型: 喜欢动手操作', 'I研究型: 喜欢探究思考', 'A艺术型: 喜欢创造表达', 'S社会型: 喜欢帮助合作', 'E企业型: 喜欢组织领导', 'C常规型: 喜欢秩序规则']
      }
    ],
    interpretation: {
      lookFor: '关注Top3兴趣类型的组合模式，而非单一类型。10岁的兴趣方向仅供参考，可能随成长变化。',
      dimensions: [
        { name: 'R实际型', high: '喜欢动手操作、户外活动', low: '' },
        { name: 'I研究型', high: '喜欢思考、探究、分析', low: '' },
        { name: 'A艺术型', high: '喜欢创造、表达、审美', low: '' },
        { name: 'S社会型', high: '喜欢帮助人、社交活动', low: '' },
        { name: 'E企业型', high: '喜欢组织、领导、竞争', low: '' },
        { name: 'C常规型', high: '喜欢有条理、规则明确', low: '' }
      ],
      meaning: '职业兴趣在10岁时仍在快速发展。Top3类型提供"兴趣方向"参考，用于选择兴趣班和课外活动。'
    },
    development: [
      { level: 'I型主导', strategy: '提供科学实验、编程、数学建模等探究性活动' },
      { level: 'A型主导', strategy: '提供艺术创作、音乐、写作等创意性活动' },
      { level: 'S型主导', strategy: '参与志愿服务、团队运动、peer tutoring等社交性活动' }
    ],
    qualityControl: {
      indicators: ['选择一致性', 'WILDER交叉验证'],
      antiCheat: '强迫选择减少中立偏差；与WILDER数据交叉验证',
      confidenceNote: '预测置信度0.68，10岁兴趣变动较大，建议14岁后正式施测'
    },
    supplementary: {
      needed: true,
      reason: '当前为活动偏好推断，建议14岁后使用Holland Self-Directed Search正式施测',
      prediction: '基于活动偏好+WILDER数据预测Top3: I(研究型)+A(艺术型)+E(企业型)'
    }
  },
  {
    id: 'skills21',
    name: '21世纪技能 4C',
    icon: <Users className="w-5 h-5" />,
    color: 'orange',
    subtitle: '创造·批判·协作·沟通',
    status: 'derived' as const,
    description: '基于P21框架的四项核心技能：Creativity创造力、Critical Thinking批判性思维、Collaboration协作、Communication沟通。',
    designPrinciple: '4C技能从WILDER和PISA数据中综合推导，不设独立测评。每项技能对应多个来源指标。',
    testMethod: {
      format: '综合推导（无独立测评）',
      duration: '0分钟独立时间',
      items: 0,
      approach: 'Creativity←WILDER W+BigFive O; Critical←WILDER I+PISA科学; Collaboration←WILDER L; Communication←WILDER E+PISA阅读'
    },
    questions: [
      {
        dimension: '4C推导逻辑',
        type: '映射规则',
        example: 'Creativity = 0.4×WILDER_W + 0.3×BigFive_O + 0.3×WILDER_D\nCritical Thinking = 0.4×WILDER_I + 0.3×PISA_科学 + 0.3×WILDER_R\nCollaboration = 0.5×WILDER_L + 0.3×BigFive_A + 0.2×BigFive_E\nCommunication = 0.4×WILDER_E + 0.3×PISA_阅读 + 0.3×BigFive_E',
        scoring: '加权计算后标准化到0-100分',
        rubric: ['80+: 核心优势', '60-79: 发展良好', '40-59: 发展中', '<40: 需重点关注']
      }
    ],
    interpretation: {
      lookFor: '4C技能是"面向未来"的能力框架。关注组合模式而非单项分数。',
      dimensions: [
        { name: '创造力', high: '善于产生新想法、联想丰富', low: '偏好已知方案、需要鼓励创新' },
        { name: '批判性思维', high: '善于分析、质疑、推理', low: '倾向于接受权威答案' },
        { name: '协作', high: '善于团队合作、整合观点', low: '偏好独立工作' },
        { name: '沟通', high: '表达清晰、善于倾听', low: '需要练习结构化表达' }
      ],
      meaning: '4C是AI时代最不可替代的人类能力。无论未来从事什么职业，这四项能力都是底层基础。'
    },
    development: [
      { level: '创造力高', strategy: '提供开放性项目，鼓励"没有标准答案"的探索' },
      { level: '批判思维低', strategy: '"三个为什么"练习——遇到任何说法都追问三次"为什么"' },
      { level: '协作低', strategy: '从家庭项目开始练习分工合作' },
      { level: '沟通低', strategy: '每日"讲给爸妈听"练习——用3分钟讲今天学了什么' }
    ],
    qualityControl: {
      indicators: ['来源数据一致性', '推导公式稳定性'],
      antiCheat: '综合多源数据，单一来源偏差会被其他来源校正',
      confidenceNote: '推导结果置信度取决于来源数据质量，整体置信度约0.75'
    },
    supplementary: {
      needed: false,
      reason: '作为综合推导结果，不需要独立补测。随WILDER/PISA精度提升而自动优化。',
      prediction: ''
    }
  }
]

// ===== 质量控制指标 =====
const qualityMetrics = [
  { name: '反迎合分数', description: '检测孩子是否在"讨好"AI而非真实回答', threshold: '≥0.75为可信', method: '同维度正反向题对比、追问一致性检验' },
  { name: '回答一致性', description: '同维度不同题目间的回答稳定性', threshold: '≥0.80为高一致性', method: '同维度3-5题的标准差分析' },
  { name: '投入度指数', description: '孩子对测评的参与热情和投入程度', threshold: '≥0.70为良好投入', method: '回答字数、反应时间、追问参与度综合计算' },
  { name: '语言复杂度', description: '回答中的词汇丰富度和句式复杂性', threshold: '参考值，不作为筛选标准', method: '平均句长、词汇多样性指数(TTR)' },
  { name: '情绪稳定度', description: '测评过程中情绪波动程度', threshold: '标记异常波动供参考', method: 'AI情绪识别+回答语气分析' },
  { name: '整体置信度', description: '报告结论的可信赖程度', threshold: '≥0.85为高置信', method: '所有子指标的加权平均' }
]

// ===== 组件开始 =====
export function AssessmentFramework({ onBack }: { onBack: () => void }) {
  const [activeModel, setActiveModel] = useState('pisa')
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const currentModel = assessmentModels.find(m => m.id === activeModel)!

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // 滚动到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeModel])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'core': return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">核心测评</span>
      case 'derived': return <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">推导结果</span>
      case 'predicted': return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">预测结果</span>
      case 'supplementary': return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">需补测</span>
      default: return null
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f0f4f8 0%, #e8ecf1 100%)' }}>
      {/* 固定顶部导航 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="返回">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">GROWMATE 国际对标测评框架</h1>
              <p className="text-xs text-gray-500">10项国际测评模型 · 完整测试方案与报告模板</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors no-print">
              <Printer className="w-4 h-4" /> 导出PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* 左侧模型导航 */}
        <aside className="w-64 flex-shrink-0 hidden lg:block no-print">
          <div className="sticky top-20 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
              <p className="text-sm font-bold">10项国际测评模型</p>
              <p className="text-xs text-blue-200 mt-0.5">点击查看详细方案</p>
            </div>
            <nav className="p-2 space-y-0.5 max-h-[70vh] overflow-y-auto">
              {assessmentModels.map(model => (
                <button
                  key={model.id}
                  onClick={() => { setActiveModel(model.id); setActiveTab('overview') }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
                    activeModel === model.id
                      ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={`flex-shrink-0 ${activeModel === model.id ? 'text-blue-600' : 'text-gray-400'}`}>
                    {model.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{model.name}</p>
                    <p className="text-xs text-gray-400 truncate">{model.subtitle}</p>
                  </div>
                </button>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={() => { setActiveModel('quality'); setActiveTab('overview') }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
                    activeModel === 'quality'
                      ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className={`w-5 h-5 flex-shrink-0 ${activeModel === 'quality' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div>
                    <p>质量控制面板</p>
                    <p className="text-xs text-gray-400">6项质控指标</p>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 min-w-0">
          {/* 移动端导航 */}
          <div className="lg:hidden mb-4 overflow-x-auto no-print">
            <div className="flex gap-2 pb-2">
              {assessmentModels.map(model => (
                <button
                  key={model.id}
                  onClick={() => { setActiveModel(model.id); setActiveTab('overview') }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeModel === model.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'
                  }`}
                >
                  {model.name}
                </button>
              ))}
              <button
                onClick={() => setActiveModel('quality')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeModel === 'quality' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'
                }`}
              >
                质量控制
              </button>
            </div>
          </div>

          {activeModel === 'quality' ? (
            // ===== 质量控制面板 =====
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6" />
                    <div>
                      <h2 className="text-xl font-bold">质量控制面板</h2>
                      <p className="text-sm text-[rgba(10,10,26,0.2)] mt-1">确保测评结果的科学性和可靠性</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {qualityMetrics.map((metric, i) => (
                      <div key={i} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <h4 className="font-bold text-gray-800">{metric.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{metric.description}</p>
                        <div className="space-y-2 text-xs">
                          <div className="bg-green-50 rounded-lg px-3 py-2">
                            <span className="font-medium text-green-700">阈值：</span>
                            <span className="text-green-600">{metric.threshold}</span>
                          </div>
                          <div className="bg-blue-50 rounded-lg px-3 py-2">
                            <span className="font-medium text-blue-700">方法：</span>
                            <span className="text-blue-600">{metric.method}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      测评伦理与免责声明
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>1. <strong>教育支持用途：</strong>本测评为教育评估参考工具，不替代医学诊断、临床心理评估或专业教育咨询。</li>
                      <li>2. <strong>形成性评价：</strong>所有结果旨在"找到发展着力点"，而非给孩子贴标签或分类。</li>
                      <li>3. <strong>发展可变性：</strong>儿童发展具有可塑性，测评结果反映"此时此刻"的状态，会随教育干预和成长而变化。</li>
                      <li>4. <strong>数据归属：</strong>所有测评数据归家庭所有，GROWMATE不会未经授权使用。</li>
                      <li>5. <strong>专业边界：</strong>若发现需要专业关注的信号（如SDQ异常），建议转介专业服务。</li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-bold text-gray-800 mb-3">补测汇总</h4>
                    <div className="overflow-x-auto">
                      <table className="rpt-table text-sm w-full">
                        <thead>
                          <tr>
                            <th>测评模型</th>
                            <th>当前状态</th>
                            <th>是否需补测</th>
                            <th>补测建议</th>
                            <th>预测结果</th>
                          </tr>
                        </thead>
                        <tbody>
                          {assessmentModels.map(model => (
                            <tr key={model.id}>
                              <td className="font-bold">{model.name}</td>
                              <td>{getStatusBadge(model.status)}</td>
                              <td>{model.supplementary.needed ? <span className="text-amber-600 font-medium">需补测</span> : <span className="text-green-600">已完成</span>}</td>
                              <td className="text-xs">{model.supplementary.reason}</td>
                              <td className="text-xs text-blue-600">{model.supplementary.prediction || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // ===== 测评模型详情 =====
            <div className="space-y-6">
              {/* 模型头部 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className={`p-6 bg-gradient-to-r ${currentModel.color === 'blue' ? 'from-blue-600 to-blue-700' : currentModel.color === 'purple' ? 'from-purple-600 to-purple-700' : currentModel.color === 'teal' ? 'from-teal-600 to-teal-700' : currentModel.color === 'amber' ? 'from-amber-600 to-amber-700' : currentModel.color === 'rose' ? 'from-rose-600 to-rose-700' : currentModel.color === 'green' ? 'from-green-600 to-green-700' : currentModel.color === 'indigo' ? 'from-indigo-600 to-indigo-700' : currentModel.color === 'red' ? 'from-red-600 to-red-700' : currentModel.color === 'cyan' ? 'from-cyan-600 to-cyan-700' : 'from-orange-600 to-orange-700'} text-white`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      {currentModel.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold">{currentModel.name}</h2>
                        {getStatusBadge(currentModel.status)}
                      </div>
                      <p className="text-white/80 text-sm">{currentModel.subtitle}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-white/90 text-sm leading-relaxed">{currentModel.description}</p>
                </div>

                {/* 标签页导航 */}
                <div className="flex border-b border-gray-200 overflow-x-auto no-print">
                  {[
                    { id: 'overview', label: '总览', icon: <BookOpen className="w-4 h-4" /> },
                    { id: 'questions', label: '题目示例', icon: <ClipboardCheck className="w-4 h-4" /> },
                    { id: 'interpret', label: '解读逻辑', icon: <Brain className="w-4 h-4" /> },
                    { id: 'develop', label: '发展建议', icon: <Target className="w-4 h-4" /> },
                    { id: 'quality', label: '质量控制', icon: <Shield className="w-4 h-4" /> },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                {/* 标签页内容 */}
                <div className="p-6">
                  {/* 总览 */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <h4 className="font-bold text-blue-800 mb-2">设计原则</h4>
                        <p className="text-sm text-gray-700">{currentModel.designPrinciple}</p>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <p className="text-xs text-gray-500">测评形式</p>
                          <p className="font-bold text-gray-800 mt-1 text-sm">{currentModel.testMethod.format}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <p className="text-xs text-gray-500">测评时长</p>
                          <p className="font-bold text-gray-800 mt-1 text-sm">{currentModel.testMethod.duration}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <p className="text-xs text-gray-500">题目数量</p>
                          <p className="font-bold text-gray-800 mt-1 text-sm">{currentModel.testMethod.items}题</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <p className="text-xs text-gray-500">实施方式</p>
                          <p className="font-bold text-gray-800 mt-1 text-sm">{currentModel.testMethod.approach.slice(0, 20)}...</p>
                        </div>
                      </div>
                      {currentModel.supplementary.needed && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-amber-800 mb-1">需要补充测试</h4>
                              <p className="text-sm text-gray-700">{currentModel.supplementary.reason}</p>
                              {currentModel.supplementary.prediction && (
                                <p className="text-sm text-blue-600 mt-2 font-medium">预测结果：{currentModel.supplementary.prediction}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 题目示例 */}
                  {activeTab === 'questions' && (
                    <div className="space-y-4">
                      {currentModel.questions.map((q, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleSection(`q-${currentModel.id}-${i}`)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                                {i + 1}
                              </span>
                              <div>
                                <p className="font-bold text-gray-800">{q.dimension}</p>
                                <p className="text-xs text-gray-500">{q.type}</p>
                              </div>
                            </div>
                            {expandedSections.has(`q-${currentModel.id}-${i}`) ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                          </button>
                          {expandedSections.has(`q-${currentModel.id}-${i}`) && (
                            <div className="p-5 space-y-4">
                              <div>
                                <h5 className="text-sm font-bold text-gray-700 mb-2">题目示例</h5>
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                  <p className="text-sm text-gray-700 whitespace-pre-line">{q.example}</p>
                                </div>
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-gray-700 mb-2">评分逻辑</h5>
                                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{q.scoring}</p>
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-gray-700 mb-2">评分标准</h5>
                                <div className="space-y-1.5">
                                  {q.rubric.map((r, j) => (
                                    <div key={j} className={`text-sm px-3 py-2 rounded-lg ${j === 0 ? 'bg-green-50 text-green-700' : j === q.rubric.length - 1 ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                                      {r}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 解读逻辑 */}
                  {activeTab === 'interpret' && (
                    <div className="space-y-6">
                      <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
                        <h4 className="font-bold text-teal-800 mb-2">看什么（Look For）</h4>
                        <p className="text-sm text-gray-700">{currentModel.interpretation.lookFor}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3">维度解读</h4>
                        <div className="space-y-3">
                          {currentModel.interpretation.dimensions.map((dim, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl p-4">
                              <h5 className="font-bold text-gray-800 mb-2">{dim.name}</h5>
                              <div className="grid md:grid-cols-2 gap-3">
                                <div className="bg-green-50 rounded-lg p-3">
                                  <p className="text-xs text-green-600 font-medium mb-1">高分表现</p>
                                  <p className="text-sm text-gray-700">{dim.high}</p>
                                </div>
                                {dim.low && (
                                  <div className="bg-amber-50 rounded-lg p-3">
                                    <p className="text-xs text-amber-600 font-medium mb-1">低分表现</p>
                                    <p className="text-sm text-gray-700">{dim.low}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                        <h4 className="font-bold text-purple-800 mb-2">对他意味着什么</h4>
                        <p className="text-sm text-gray-700">{currentModel.interpretation.meaning}</p>
                      </div>
                    </div>
                  )}

                  {/* 发展建议 */}
                  {activeTab === 'develop' && (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
                        <h4 className="font-bold text-green-800 mb-2">干预原则</h4>
                        <p className="text-sm text-gray-700">所有建议遵循"形成性评价"视角：不是修复缺陷，而是找到最有效的发展着力点。优先发挥优势，然后补强短板。</p>
                      </div>
                      {currentModel.development.map((dev, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                              {i + 1}
                            </span>
                            <p className="font-bold text-gray-800 text-sm">{dev.level}</p>
                          </div>
                          <p className="text-sm text-gray-600 ml-10">{dev.strategy}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 质量控制 */}
                  {activeTab === 'quality' && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h5 className="font-bold text-gray-700 text-sm mb-2">质控指标</h5>
                          <ul className="space-y-1.5">
                            {currentModel.qualityControl.indicators.map((ind, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {ind}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4">
                          <h5 className="font-bold text-blue-700 text-sm mb-2">防作弊机制</h5>
                          <p className="text-sm text-gray-600">{currentModel.qualityControl.antiCheat}</p>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-4">
                          <h5 className="font-bold text-amber-700 text-sm mb-2">置信度说明</h5>
                          <p className="text-sm text-gray-600">{currentModel.qualityControl.confidenceNote}</p>
                        </div>
                      </div>
                      {currentModel.supplementary.needed && (
                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-rose-800">补充测试建议</h4>
                              <p className="text-sm text-gray-700 mt-1">{currentModel.supplementary.reason}</p>
                              {currentModel.supplementary.prediction && (
                                <div className="mt-2 bg-white rounded-lg p-3">
                                  <p className="text-sm"><strong className="text-blue-600">预测结果：</strong>{currentModel.supplementary.prediction}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 回到顶部按钮 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center no-print"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  )
}
