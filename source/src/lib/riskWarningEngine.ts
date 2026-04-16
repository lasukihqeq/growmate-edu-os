// ===================================================================
// GrowMate 成长暗礁与风险预警引擎 v1.0
// 抓住家长的"责任心"——制造合理的痛点焦虑
// L2 风险预警层：成长暗礁 + 应试冲突 + 窗口期倒计时
// ===================================================================

import type { WilderDimension } from './wilderKernel'

// ========== 类型定义 ==========

export interface GrowthRisk {
  /** 暗礁名称 - 富有画面感的命名 */
  reefName: string
  /** 暗礁描述 - 痛点直指 */
  reefDescription: string
  /** 现实困境 - 2个可能的困境 */
  dilemmas: [string, string]
  /** 应试冲突预测 */
  schoolConflict: {
    /** 可能被贴的标签 */
    mislabel: string
    /** 真相解读 */
    truthStatement: string
    /** 教师沟通建议 */
    teacherTip: string
  }
}

export interface WindowPeriodWarning {
  /** 需补齐的维度 */
  targetDimension: WilderDimension
  /** 维度中文名 */
  dimensionName: string
  /** 窗口期剩余月数 */
  monthsRemaining: number
  /** 紧迫程度 */
  urgency: 'critical' | 'urgent' | 'moderate' | 'stable'
  /** 窗口期描述 */
  description: string
  /** 脑科学依据 */
  neuroscienceBasis: string
}

export interface ParentingPitfall {
  /** 忌讳行为标题 */
  title: string
  /** 错误做法 */
  wrongBehavior: string
  /** 为什么错 */
  whyWrong: string
  /** 正确做法 */
  rightBehavior: string
}

export interface RiskWarningResult {
  /** 成长暗礁 */
  growthRisks: GrowthRisk[]
  /** 窗口期预警 */
  windowWarning: WindowPeriodWarning
  /** 家长避坑指南 */
  pitfalls: [ParentingPitfall, ParentingPitfall, ParentingPitfall]
  /** 综合预警标题 */
  overallWarningTitle: string
  /** 权威警示语 */
  authorityStatement: string
}

export interface RiskWarningInput {
  /** 孩子姓名 */
  name: string
  /** 孩子年龄 */
  age: number
  /** 画像编码 */
  profileCode: string
  /** WILDER维度分值 */
  wilderScores: Record<string, number>
  /** 维度短板（低分维度） */
  weakDimensions: WilderDimension[]
  /** 维度长板（高分维度） */
  strongDimensions: WilderDimension[]
}

// ========== 成长暗礁词库 ==========

/** 高低分维度冲突 → 暗礁映射 */
const CONFLICT_REEF_MAPPING: Record<string, Omit<GrowthRisk, 'dilemmas'>> = {
  // ═══════════════════════════════════════════════════════════════
  // W(好奇心) 高 + 其他维度低 的冲突
  // ═══════════════════════════════════════════════════════════════
  'W_high_R_low': {
    reefName: '知识碎片化陷阱',
    reefDescription: '好奇心驱动他不断探索新领域，但缺乏反思复盘的习惯，导致知识如"浅层钻井"——打了很多井，都只到地下三米。大量碎片化信息无法形成知识体系，遇到复杂问题时容易"乱枪打鸟"。',
    schoolConflict: {
      mislabel: '注意力不集中 / 三分钟热度',
      truthStatement: '他不是"注意力不集中"，而是大脑的探索欲望太强，以至于难以在同一深度停留太久。这是科学家式的发散思维，但在应试环境中被误读了。',
      teacherTip: '建议与老师沟通：孩子的好奇心是天赋，不是问题。可以请求老师在课堂上给他"为什么"的问题机会，而不是要求他安静坐住。'
    }
  },
  'W_high_I_low': {
    reefName: '浮光掠影式学习',
    reefDescription: '好奇心旺盛但求证能力不足，容易停留在"知道了"的层面，缺乏"验证一下"的习惯。这种孩子常常"知道很多，但说不清为什么"。',
    schoolConflict: {
      mislabel: '只爱听故事不爱思考',
      truthStatement: '他不是不爱思考，而是他的思考路径是"发散式"的，需要引导才能收敛到"证据"上。传统课堂的"标准答案"模式让他无处安放好奇心。',
      teacherTip: '建议请求老师：在讲解新知识时，给孩子布置"小侦探任务"，让他课后去验证一个细节，把好奇心转化为求证力。'
    }
  },
  'W_high_D_low': {
    reefName: '空想家的困境',
    reefDescription: '想象力丰富但落地能力不足，脑子里有100个好点子，但没有一个能变成可执行的方案。这种孩子常常"想得比说得好，说得比做得好"。',
    schoolConflict: {
      mislabel: '好高骛远 / 眼高手低',
      truthStatement: '他不是"眼高手低"，而是他的大脑在"创意生成"阶段非常活跃，但缺少"方案设计"的训练。这不是态度问题，是能力结构问题。',
      teacherTip: '建议与老师沟通：孩子的创意是珍贵的，需要的是"怎么做"的引导，而不是"别想那么多"的打压。'
    }
  },
  'W_high_L_low': {
    reefName: '独行的探索者',
    reefDescription: '好奇心驱动他独自深入未知领域，但缺乏与他人协作的习惯，可能在团队项目中显得格格不入，错失"知识碰撞"带来的深度学习机会。',
    schoolConflict: {
      mislabel: '不合群 / 团队意识差',
      truthStatement: '他不是"不合群"，而是他的探索模式是"独立式"的。在传统课堂强调"小组合作"的氛围中，他容易被边缘化。',
      teacherTip: '建议请求老师：给孩子分配"独立研究任务"，然后安排他向小组汇报发现。让他用自己的方式贡献团队。'
    }
  },
  'W_high_E_low': {
    reefName: '沉默的知识矿藏',
    reefDescription: '内心世界丰富但表达力不足，大量的思考和发现难以外化。这种孩子常常"肚子里有货倒不出来"，在需要展示的场合容易被低估。',
    schoolConflict: {
      mislabel: '不爱发言 / 参与度低',
      truthStatement: '他不是"不爱发言"，而是他的思考密度太高，还没来得及组织语言，课堂就已经翻篇了。沉默的背后是正在进行的深度加工。',
      teacherTip: '建议与老师沟通：允许孩子用书面形式提交思考，或给他"提前准备发言"的机会，而不是即兴点名。'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // I(探究力) 高 + 其他维度低 的冲突
  // ═══════════════════════════════════════════════════════════════
  'I_high_W_low': {
    reefName: '循规蹈矩的验证者',
    reefDescription: '求证能力出色但好奇心不足，善于验证已有结论，却难以提出原创问题。这种孩子可能成为"优秀的执行者"而非"创新者"。',
    schoolConflict: {
      mislabel: '缺乏创造力 / 死记硬背',
      truthStatement: '他不是缺乏创造力，而是他的思维方式是"收敛式"的——先有假设，再验证。在鼓励"发散思维"的课堂上可能显得过于谨慎。',
      teacherTip: '建议请求老师：给孩子布置"设计实验"的任务，让他把验证能力转化为探究能力。'
    }
  },
  'I_high_E_low': {
    reefName: '沉默的逻辑堡垒',
    reefDescription: '逻辑严密但表达困难，大量精准的分析和推理难以传达给他人。在需要说服、展示的场合容易"有理说不出"。',
    schoolConflict: {
      mislabel: '内向 / 社交障碍',
      truthStatement: '他不是社交障碍，而是他的沟通模式是"证据优先"的——在没准备好完整论证之前，他不愿开口。这是科学家的严谨，不是社恐。',
      teacherTip: '建议与老师沟通：给孩子更多书面表达的机会，或允许他用"数据展示"代替"口头汇报"。'
    }
  },
  'I_high_L_low': {
    reefName: '孤立的真相守护者',
    reefDescription: '追求真相但不擅长人际协调，可能在团队中因为"太较真"而显得不合群。这种孩子容易在"真理"和"关系"之间陷入两难。',
    schoolConflict: {
      mislabel: '固执 / 不会变通',
      truthStatement: '他不是固执，而是他的核心价值观是"事实正确"。在需要"情商优先"的场合，他可能显得"直男式"不懂变通。',
      teacherTip: '建议与老师沟通：在团队项目中，安排他担任"质量检验员"角色，让他的求真本能有用武之地。'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // L(联结力) 高 + 其他维度低 的冲突
  // ═══════════════════════════════════════════════════════════════
  'L_high_D_low': {
    reefName: '温情的跟随者',
    reefDescription: '善于感知他人需求但规划能力不足，容易被团队的需求牵着走，缺少自己的方向感。这种孩子可能成为"好帮手"而非"领导者"。',
    schoolConflict: {
      mislabel: '缺乏主见 / 随大流',
      truthStatement: '他不是缺乏主见，而是他的决策模式是"关系优先"的——先考虑别人的感受，再考虑自己的目标。这需要训练"目标感"来平衡。',
      teacherTip: '建议与老师沟通：在小组活动中，轮流担任"计时员"和"记录员"，让他逐步建立结构化意识。'
    }
  },
  'L_high_W_low': {
    reefName: '舒适区的守门人',
    reefDescription: '善于维护关系但好奇心不足，可能因为不想"冒险破坏关系"而拒绝尝试新事物。成长动力主要来自外部推动而非内在探索欲。',
    schoolConflict: {
      mislabel: '安于现状 / 缺乏进取心',
      truthStatement: '他不是缺乏进取心，而是他的成长模式是"关系驱动"的——需要有人陪伴和鼓励，才能迈出探索的一步。',
      teacherTip: '建议与老师沟通：给孩子安排"学习伙伴"，让他在关系中成长，而不是被催促独自探索。'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // D(设计力) 高 + 其他维度低 的冲突
  // ═══════════════════════════════════════════════════════════════
  'D_high_W_low': {
    reefName: '图纸大师的空虚',
    reefDescription: '善于规划但缺乏探索欲，可能陷入"为规划而规划"的陷阱——设计了很多方案，但没有内在动力去执行任何一个。',
    schoolConflict: {
      mislabel: '执行力差 / 光说不练',
      truthStatement: '他不是执行力差，而是他的执行动力需要"意义感"驱动。没有好奇心做燃料，再好的蓝图也只是纸上的艺术品。',
      teacherTip: '建议与老师沟通：给孩子设定"问题导向"的任务，让他为解决真实问题而规划，而不是为规划而规划。'
    }
  },
  'D_high_L_low': {
    reefName: '独断的设计师',
    reefDescription: '规划能力出色但协作意识不足，可能在团队项目中习惯"一言堂"，忽略他人的参与感和贡献。这种孩子需要学习"设计是服务"。',
    schoolConflict: {
      mislabel: '控制欲强 / 不会合作',
      truthStatement: '他不是控制欲强，而是他的思维模式是"系统优先"的——看到混乱就想整理，看到方案就想优化。这需要学习"问一句再改"。',
      teacherTip: '建议与老师沟通：在小组项目中，给他"方案审核员"角色，让他学会在提建议前先征求他人意见。'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // E(表达力) 高 + 其他维度低 的冲突
  // ═══════════════════════════════════════════════════════════════
  'E_high_I_low': {
    reefName: '华丽的空谈家',
    reefDescription: '表达力强但求证能力不足，可能擅长"说得漂亮"但缺乏实质内容支撑。这种孩子需要警惕"会说话"变成"只说话"。',
    schoolConflict: {
      mislabel: '油嘴滑舌 / 不踏实',
      truthStatement: '他不是不踏实，而是他的成长路径需要"证据输入"——先有料，再说得好。目前的问题是输入不足。',
      teacherTip: '建议与老师沟通：给孩子布置"资料收集+展示"的双重任务，让他学会用证据支撑观点。'
    }
  },
  'E_high_R_low': {
    reefName: '外在的光芒黑洞',
    reefDescription: '表达力强但反思力不足，可能过度依赖外在反馈而忽视内在成长。长期来看，可能变成"表演型人才"而非"实力型人才"。',
    schoolConflict: {
      mislabel: '爱表现 / 浮躁',
      truthStatement: '他不是浮躁，而是他的成长模式是"反馈驱动"的——需要外在认可才能继续前进。这需要建立内在的"自我打分系统"。',
      teacherTip: '建议与老师沟通：在表扬孩子时，多夸"过程"少夸"结果"，帮助他建立内在评价标准。'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // R(反思力) 高 + 其他维度低 的冲突
  // ═══════════════════════════════════════════════════════════════
  'R_high_W_low': {
    reefName: '内省的孤岛',
    reefDescription: '反思力强但好奇心不足，可能陷入"过度分析自己"而忽视探索外部世界。成长动力来自内在，但方向感可能不足。',
    schoolConflict: {
      mislabel: '想太多 / 敏感',
      truthStatement: '他不是想太多，而是他的信息处理模式是"深度优先"的——宁可少接触，也要深理解。这需要外在的新鲜刺激来打破内循环。',
      teacherTip: '建议与老师沟通：给孩子布置"体验式作业"，如实地考察、实验操作，用行动打破过度思考。'
    }
  },
  'R_high_E_low': {
    reefName: '沉默的智者困境',
    reefDescription: '内在智慧丰富但难以外化，大量的深度思考无法传达给他人。可能被低估、被忽视，错失展示才华的机会。',
    schoolConflict: {
      mislabel: '不爱说话 / 存在感低',
      truthStatement: '他不是不爱说话，而是他需要"信任感"才能开口。在陌生环境中，他选择观察而非表达。',
      teacherTip: '建议与老师沟通：给孩子更多一对一交流的机会，或让他用"写作"替代"发言"。'
    }
  }
}

// 默认暗礁
const DEFAULT_REEF: Omit<GrowthRisk, 'dilemmas'> = {
  reefName: '发展不均衡的风险',
  reefDescription: '当某项能力显著领先而其他能力滞后时，可能导致"能力孤岛"现象——孩子过度依赖优势能力，回避需要短板能力的场景，形成自我设限的成长模式。',
  schoolConflict: {
    mislabel: '偏科 / 兴趣狭窄',
    truthStatement: '他不是偏科，而是他的能力发展节奏不同步。领先的能力像强光一样遮住了正在发育的短板。',
    teacherTip: '建议与老师沟通：关注孩子的"优势带弱势"——用他擅长的领域带动他不擅长的领域。'
  }
}

// ========== 窗口期配置 ==========

/** 各维度发展的关键窗口期（基于脑科学研究） */
const DIMENSION_WINDOW_PERIODS: Record<WilderDimension, {
  name: string
  peakStart: number  // 黄金期开始年龄
  peakEnd: number    // 黄金期结束年龄
  extendedEnd: number // 延展期结束年龄
  basis: string      // 脑科学依据
}> = {
  W: {
    name: '好奇心',
    peakStart: 3,
    peakEnd: 10,
    extendedEnd: 14,
    basis: '前额叶皮层突触修剪的关键期，好奇心驱动的探索行为会强化特定神经通路。错过这个阶段，大脑会逐渐"关闭"对未知事物的开放态度。'
  },
  I: {
    name: '探究力',
    peakStart: 6,
    peakEnd: 12,
    extendedEnd: 16,
    basis: '逻辑推理能力的发展与大脑顶叶发育同步，青春期前是"证据思维"的关键形成期。'
  },
  L: {
    name: '联结力',
    peakStart: 4,
    peakEnd: 12,
    extendedEnd: 15,
    basis: '社会情感神经网络的敏感期，镜像神经元系统在此阶段最活跃，错过会影响一生的共情和协作能力。'
  },
  D: {
    name: '设计力',
    peakStart: 7,
    peakEnd: 14,
    extendedEnd: 18,
    basis: '执行功能（Executive Function）的发展贯穿整个学龄期，前额叶皮层到25岁才完全成熟，但14岁前是关键的"规划习惯"形成期。'
  },
  E: {
    name: '表达力',
    peakStart: 3,
    peakEnd: 12,
    extendedEnd: 16,
    basis: '语言中枢的发育敏感期，12岁后语言学习的神经可塑性显著下降，表达习惯和风格趋于稳定。'
  },
  R: {
    name: '反思力',
    peakStart: 8,
    peakEnd: 15,
    extendedEnd: 20,
    basis: '元认知能力的发展依赖大脑前额叶的成熟，青春期是"自我觉察"能力的关键形成期。'
  }
}

// ========== 家长避坑指南词库 ==========

const PARENTING_PITFALLS: Record<WilderDimension, ParentingPitfall[]> = {
  W: [
    {
      title: '用"别问了"打断好奇心',
      wrongBehavior: '孩子问"为什么天是蓝的？"，家长不耐烦地说"哪来那么多为什么，记住就行了。"',
      whyWrong: '好奇心是最脆弱的能力，一次粗暴打断，可能让孩子从此"学会"不再提问。',
      rightBehavior: '即使不知道答案，也可以说"这个问题太好了，我们一起去查查。"保护提问的本能比给答案更重要。'
    },
    {
      title: '过度安排，不留自由探索时间',
      wrongBehavior: '把孩子的时间塞满课程和活动，认为"忙起来"就是充实。',
      whyWrong: '好奇心需要"空白"来生长。过度安排会让孩子失去自主探索的欲望，变成"被动吸收者"。',
      rightBehavior: '每天保留1小时"自由时间"，不安排任何任务，让孩子自己决定探索什么。'
    },
    {
      title: '只关注"有用的知识"',
      wrongBehavior: '孩子对恐龙着迷，家长说"恐龙又不会考，看这些有什么用。"',
      whyWrong: '好奇心驱动的是"无功利目的的探索"，这是创新的原点。过早功利化会扼杀探索的纯粹性。',
      rightBehavior: '尊重孩子的兴趣，即使看起来"没用"。恐龙知识背后可能是未来的古生物学家，或至少培养了深度研究能力。'
    }
  ],
  I: [
    {
      title: '用"听话"替代"求证"',
      wrongBehavior: '孩子追问"为什么要这样做？"，家长说"因为我是你爸/妈，听话就行。"',
      whyWrong: '求证精神需要被尊重和回应。用权威压制，会让孩子学会"不问为什么，照做就是"，最终丧失独立思考能力。',
      rightBehavior: '认真解释原因，或者说"这个问题很有深度，让我想想怎么跟你解释清楚。"'
    },
    {
      title: '只给答案不给证据',
      wrongBehavior: '孩子问"你怎么知道地球是圆的？"，家长说"书上说的，记住就好。"',
      whyWrong: '这教会孩子"知识来自权威而非证据"，长期会形成"盲信"而非"求证"的思维习惯。',
      rightBehavior: '带孩子看月食的影子、船在远处的消失，用证据说话。'
    },
    {
      title: '惩罚"较真"行为',
      wrongBehavior: '孩子纠正大人的错误，家长说"就你聪明，你是对的，行了吧？"',
      whyWrong: '这种讽刺会让孩子觉得"求真"是冒犯他人的行为，从而学会在"正确"和"和谐"之间选择后者。',
      rightBehavior: '承认错误，感谢孩子的纠正："你说得对，谢谢你帮我发现这个错误。"'
    }
  ],
  L: [
    {
      title: '把内向当缺点',
      wrongBehavior: '孩子喜欢独处，家长说"你怎么不出去跟小朋友玩？你要合群一点。"',
      whyWrong: '联结力不等于"外向"。内向的孩子往往有更深度的社交能力——少而精的关系。强迫改变会造成自我怀疑。',
      rightBehavior: '尊重孩子的社交节奏，关注他在社交中的质量而非数量。'
    },
    {
      title: '替孩子做社交决定',
      wrongBehavior: '"你跟那个小朋友玩吧，他看起来不错。"——替孩子选择朋友。',
      whyWrong: '联结力的发展需要自主选择和承担后果的过程。剥夺这个过程会让孩子难以建立真正的社交判断力。',
      rightBehavior: '让孩子自己观察、自己尝试、自己决定。如果不顺利，一起复盘而不是替他规避。'
    },
    {
      title: '在他人面前批评孩子',
      wrongBehavior: '当着亲戚朋友的面说"他就是不爱说话/不合群"。',
      whyWrong: '公开批评会严重打击孩子的社交自信，让他觉得自己"在社交方面有问题"。',
      rightBehavior: '保护孩子的社交尊严，私下讨论问题，公开表扬优点。'
    }
  ],
  D: [
    {
      title: '打断孩子的"规划"',
      wrongBehavior: '孩子在搭积木/画画，家长说"好了，该去写作业了，别搞那些没用的。"',
      whyWrong: '设计力的核心是"把想法变成现实"，这个过程需要完整的专注时间。频繁打断会让孩子难以建立"从头到尾做完一件事"的习惯。',
      rightBehavior: '尊重孩子的创作过程，提前约定时间，而不是中途打断。'
    },
    {
      title: '只关注结果不关注过程',
      wrongBehavior: '孩子搭建了一个复杂的乐高作品，家长只说"真棒"，然后收起来。',
      whyWrong: '设计力的核心能力——规划、调整、优化——都在过程中。只夸结果不问过程，会让孩子变成"凑结果"而非"练设计"。',
      rightBehavior: '问孩子："你是怎么想到这样搭的？中间遇到什么困难？是怎么解决的？"'
    },
    {
      title: '用"你应该"替代"你觉得"',
      wrongBehavior: '孩子在做计划，家长说"你应该先做这个，再做那个。"',
      whyWrong: '设计力需要"试错空间"。直接告诉最优解，孩子永远学不会自己规划。',
      rightBehavior: '问："你觉得先做什么比较好？"让他自己思考，即使方案不完美。'
    }
  ],
  E: [
    {
      title: '打断孩子的话',
      wrongBehavior: '孩子正在讲一件事，家长说"好啦好啦，我知道了，快点说重点。"',
      whyWrong: '表达力的核心是"组织思维的完整过程"。频繁打断会让孩子形成"说话要快、要短"的焦虑模式，难以建立深度表达能力。',
      rightBehavior: '耐心听完，给予回应："然后呢？后来怎样了？"鼓励完整表达。'
    },
    {
      title: '替孩子说话',
      wrongBehavior: '有人问孩子问题，家长抢答"他喜欢吃苹果/他今年8岁。"',
      whyWrong: '这是在剥夺孩子练习表达的机会。长期这样，孩子会习惯"有人替我说"，表达能力退化。',
      rightBehavior: '等待孩子自己回答，如果需要可以引导："你来告诉阿姨吧。"'
    },
    {
      title: '只纠正错误不欣赏表达',
      wrongBehavior: '孩子讲了一个故事，家长说"你这个词用错了，应该是……"',
      whyWrong: '表达自信比表达正确更重要。过度纠错会让孩子在开口前先自我审查，变得不敢表达。',
      rightBehavior: '先肯定内容："这个故事太有意思了！"之后再在自然语境中示范正确的表达。'
    }
  ],
  R: [
    {
      title: '否定孩子的感受',
      wrongBehavior: '孩子说"我觉得这个比赛不公平"，家长说"有什么不公平的，人家比你努力多了。"',
      whyWrong: '反思力从"情绪觉察"开始。否定感受会让孩子学会"压抑情绪"而非"理解情绪"，反思变成自我批评。',
      rightBehavior: '先接纳感受："你觉得不公平，能具体说说吗？"帮孩子把模糊的情绪转化为清晰的思考。'
    },
    {
      title: '不给复盘的时间',
      wrongBehavior: '事情结束立刻进入下一个任务，没有时间回顾和反思。',
      whyWrong: '反思力需要"停顿"来工作。永远在前进，永远没有回头看的机会，孩子难以建立"从经验中学习"的习惯。',
      rightBehavior: '重要事件后，留出5-10分钟："我们来回顾一下，哪里做得好？下次可以改进什么？"'
    },
    {
      title: '只批评不引导',
      wrongBehavior: '"你这次怎么又犯同样的错误？"——只指出问题，不给反思框架。',
      whyWrong: '批评只会让孩子学会"我不好"，不会学会"怎么变好"。反思力需要的是引导而非审判。',
      rightBehavior: '"这个错误出现了两次，我们一起想想，是什么原因？有没有什么方法可以避免？"'
    }
  ]
}

// ========== 核心生成函数 ==========

/**
 * 根据高低分维度冲突生成成长暗礁
 */
function generateGrowthRisks(
  name: string,
  strongDims: WilderDimension[],
  weakDims: WilderDimension[]
): GrowthRisk[] {
  const risks: GrowthRisk[] = []

  // 为每个短板维度找冲突
  for (const weakDim of weakDims) {
    // 找到与短板冲突最强的高分维度
    const matchingStrongDim = strongDims[0] // 简化：用最高分维度

    // 构建冲突键
    const conflictKey = `${matchingStrongDim}_high_${weakDim}_low`

    // 查找对应的暗礁
    const reefData = CONFLICT_REEF_MAPPING[conflictKey] || DEFAULT_REEF

    // 生成困境
    const dilemmas: [string, string] = generateDilemmas(name, matchingStrongDim, weakDim)

    risks.push({
      ...reefData,
      dilemmas
    })
  }

  // 至少返回1个风险
  if (risks.length === 0) {
    risks.push({
      ...DEFAULT_REEF,
      dilemmas: [
        `在没有外部刺激的情况下，${name}可能倾向于停留在舒适区，缺乏突破现有能力边界的动力。`,
        `长期的"优势依赖"可能让${name}回避需要短板能力的挑战，形成自我设限的成长模式。`
      ]
    })
  }

  return risks.slice(0, 2) // 最多返回2个风险
}

/**
 * 生成现实困境
 */
function generateDilemmas(
  name: string,
  strongDim: WilderDimension,
  weakDim: WilderDimension
): [string, string] {
  const dimNames: Record<WilderDimension, string> = {
    W: '好奇心', I: '探究力', L: '联结力', D: '设计力', E: '表达力', R: '反思力'
  }

  const strongName = dimNames[strongDim]
  const weakName = dimNames[weakDim]

  return [
    `${name}的${strongName}驱动TA不断探索新领域，但${weakName}的不足可能导致"浅层钻井"——打了很多井，却难以深入到地下水层。`,
    `长期来看，${strongName}与${weakName}的不匹配可能让${name}在面对复杂挑战时感到力不从心——不是能力不够，而是能力结构不均衡。`
  ]
}

/**
 * 计算窗口期预警
 */
function calculateWindowWarning(
  name: string,
  age: number,
  weakDims: WilderDimension[]
): WindowPeriodWarning {
  // 找到窗口期最紧迫的短板维度
  let mostUrgentDim: WilderDimension = weakDims[0] || 'R'
  let minMonthsRemaining = Infinity

  for (const dim of weakDims) {
    const config = DIMENSION_WINDOW_PERIODS[dim]
    const monthsRemaining = Math.max(0, (config.peakEnd - age) * 12)

    if (monthsRemaining < minMonthsRemaining) {
      minMonthsRemaining = monthsRemaining
      mostUrgentDim = dim
    }
  }

  const config = DIMENSION_WINDOW_PERIODS[mostUrgentDim]

  // 计算紧迫程度
  let urgency: WindowPeriodWarning['urgency']
  if (minMonthsRemaining <= 12) {
    urgency = 'critical'
  } else if (minMonthsRemaining <= 24) {
    urgency = 'urgent'
  } else if (minMonthsRemaining <= 48) {
    urgency = 'moderate'
  } else {
    urgency = 'stable'
  }

  // 生成描述
  let description: string
  if (minMonthsRemaining <= 0) {
    description = `${name}已超过${config.name}发展的黄金窗口期，但大脑仍保持一定的可塑性。建议立即开始针对性训练，把握最后的延展期机会。`
  } else if (minMonthsRemaining <= 12) {
    description = `${config.name}发展的黄金补偿期将在${Math.ceil(minMonthsRemaining)}个月后关闭。这是最后的关键窗口，建议立即启动针对性的能力培养计划。`
  } else {
    description = `${name}的${config.name}发展窗口期还有约${Math.ceil(minMonthsRemaining / 12)}年。现在开始干预，性价比最高。`
  }

  return {
    targetDimension: mostUrgentDim,
    dimensionName: config.name,
    monthsRemaining: minMonthsRemaining,
    urgency,
    description,
    neuroscienceBasis: config.basis
  }
}

/**
 * 生成家长避坑指南
 */
function generatePitfalls(
  weakDims: WilderDimension[],
  strongDims: WilderDimension[]
): [ParentingPitfall, ParentingPitfall, ParentingPitfall] {
  const allDims = [...weakDims, ...strongDims]
  const selectedPitfalls: ParentingPitfall[] = []

  // 优先从短板维度选择
  for (const dim of allDims) {
    const pitfalls = PARENTING_PITFALLS[dim]
    if (pitfalls && pitfalls.length > 0) {
      // 选择第一个未重复的pitfall
      const pitfall = pitfalls[0]
      if (!selectedPitfalls.find(p => p.title === pitfall.title)) {
        selectedPitfalls.push(pitfall)
      }
    }
    if (selectedPitfalls.length >= 3) break
  }

  // 如果不够3个，补充默认值
  while (selectedPitfalls.length < 3) {
    selectedPitfalls.push({
      title: '过度保护',
      wrongBehavior: '替孩子解决所有困难，让孩子失去独立面对挑战的机会。',
      whyWrong: '成长需要挫折。过度保护剥夺了孩子从失败中学习的机会。',
      rightBehavior: '在孩子遇到困难时，问"你觉得可以怎么做？"而不是直接帮TA解决。'
    })
  }

  return selectedPitfalls as [ParentingPitfall, ParentingPitfall, ParentingPitfall]
}

/**
 * 生成综合预警标题
 */
function generateOverallWarningTitle(
  name: string,
  strongDims: WilderDimension[],
  weakDims: WilderDimension[]
): string {
  if (weakDims.length === 0) {
    return `${name}的能力发展较为均衡，暂无明显暗礁`
  }

  const dimNames: Record<WilderDimension, string> = {
    W: '探索', I: '求证', L: '协作', D: '规划', E: '表达', R: '反思'
  }

  const strongName = dimNames[strongDims[0]] || '综合'
  const weakName = dimNames[weakDims[0]] || '均衡'

  return `被误读的${strongName}者：${weakName}短板的隐形代价`
}

/**
 * 生成权威警示语
 */
function generateAuthorityStatement(name: string, age: number): string {
  if (age <= 8) {
    return `基于脑科学研究，${age}岁是多项能力发展的黄金期。现在干预，事半功倍；错过窗口，事倍功半。这不是焦虑，是科学。`
  } else if (age <= 12) {
    return `${name}正处于能力发展的关键转折期。根据WILDER模型分析，部分能力窗口将在未来1-3年内逐渐闭合。把握当下，是为未来铺路。`
  } else {
    return `青春期的大脑仍保持高度可塑性，但黄金补偿期正在加速关闭。科学干预仍有效，但时间窗口已不如早期充裕。`
  }
}

// ========== 主导出函数 ==========

/**
 * 生成风险预警报告
 */
export function generateRiskWarning(input: RiskWarningInput): RiskWarningResult {
  const { name, age, strongDimensions, weakDimensions } = input

  return {
    growthRisks: generateGrowthRisks(name, strongDimensions, weakDimensions),
    windowWarning: calculateWindowWarning(name, age, weakDimensions),
    pitfalls: generatePitfalls(weakDimensions, strongDimensions),
    overallWarningTitle: generateOverallWarningTitle(name, strongDimensions, weakDimensions),
    authorityStatement: generateAuthorityStatement(name, age)
  }
}

export default {
  generateRiskWarning
}
