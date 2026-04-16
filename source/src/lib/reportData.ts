// GROWMATE科创教育入学测评 V2.0 Demo Report Data — 张泽辉
// Matches reference: GROWMATE科创教育入学测评_张泽辉_天赋力测评报告_V2.0.html

export const reportData = {
  // ===== 基本信息 =====
  studentName: '张泽辉',
  reportVersion: 'V2.0（DEMO示例版）',
  testDate: '2026年1月28日',
  reportDate: '2026年2月4日',
  institution: 'GROWMATE｜科创教育入学测评',
  testDuration: 42,
  evidenceCount: 20,

  // ===== WILDER 六维得分 =====
  wilderScores: { W: 82, I: 88, L: 71, D: 79, E: 85, R: 76 },

  // ===== 一、执行摘要 =====
  topStrengths: [
    { name: '探究力 (Inquiry)', score: 88, evidence: '主动提出"为什么蜘蛛不是昆虫"并自行验证；连续15分钟专注研究树叶脉络' },
    { name: '表达力 (Expression)', score: 85, evidence: '汇报时使用"首先-然后-最后"结构；能回应听众提问' },
    { name: '好奇心 (Wonder)', score: 82, evidence: '看到陀螺会问"为什么转起来不会倒"；在家拆解旧电器研究零件' },
  ],
  keyActions: [
    { title: '启动"好奇心捕捉"习惯', detail: '每天记录1个"想知道为什么"的事（5分钟）' },
    { title: '完成1个微项目', detail: '选择感兴趣的问题，设计→执行→复盘完整流程' },
    { title: '尝试1次协作体验', detail: '在家庭任务中主动询问他人需要什么帮助' },
  ],
  riskActions: [
    { anxiety: '"他不太合群"', evidence: '协作主动性(68)确实偏低，但被请求时帮助有效(E011)', action: '不强迫"合群"，而是创造低压力的协作机会' },
    { anxiety: '"他做事慢"', evidence: '他的"慢"是在思考和验证(E007连续15分钟探索)', action: '区分"慢在哪个环节"，保护深度专注' },
    { anxiety: '"复盘能力弱"', evidence: '有自我觉察(E006)，但归因分析需加强', action: '用"发生了什么→为什么→下次怎么做"三步引导' },
  ],

  // ===== 二、测评方法与可信度 =====
  methodComparison: [
    { dimension: '评估依据', generic: '对话内容生成', growmate: '专用WILDER模型 + 证据链' },
    { dimension: '可解释性', generic: '难以追溯', growmate: '每个结论对应具体证据编号' },
    { dimension: '数据安全', generic: '公域服务器', growmate: '支持私域部署' },
    { dimension: '迭代闭环', generic: '无', growmate: '支持复测 + 成长曲线追踪' },
  ],
  wilderDefinitions: [
    { dim: 'W', en: 'Wonder', def: '好奇心与探索欲', behavior: '主动提问、关注新事物', misconception: '把"乱动乱问"当作不专心' },
    { dim: 'I', en: 'Inquiry', def: '探究与求证能力', behavior: '提出假设、收集证据', misconception: '只看"答案对不对"' },
    { dim: 'L', en: 'Link', def: '协作与连接能力', behavior: '主动帮助、整合观点', misconception: '用"合群"简单评判' },
    { dim: 'D', en: 'Design', def: '设计与规划能力', behavior: '制定计划、迭代优化', misconception: '把"想好再做"当作拖延' },
    { dim: 'E', en: 'Expression', def: '表达与呈现能力', behavior: '清晰表达、回应反馈', misconception: '只看"说得多不多"' },
    { dim: 'R', en: 'Reflection', def: '反思与自我调节', behavior: '自我觉察、行为调整', misconception: '把"知道错了"等同于"会改"' },
  ],
  qualityMetrics: [
    { metric: '反迎合分数', score: '0.87', note: '回答未刻意讨好，真实度高' },
    { metric: '一致性分数', score: '0.91', note: '不同场景下表现一致' },
    { metric: '响应时长异常率', score: '0.03', note: '极少数回答过快/过慢' },
  ],

  // ===== 三、孩子画像总览 =====
  subIndicators: [
    { dimension: 'Wonder', subs: [
      { name: '好奇心触发频率', score: 85, desc: '日常中频繁被新事物吸引' },
      { name: '探索持续时长', score: 78, desc: '能持续探索，但易被新兴趣分散' },
      { name: '跨领域联想能力', score: 83, desc: '能把不同领域的观察联系起来' },
    ]},
    { dimension: 'Inquiry', subs: [
      { name: '问题提出质量', score: 91, desc: '问题具体、有深度、指向本质' },
      { name: '假设生成能力', score: 86, desc: '能基于观察提出合理猜测' },
      { name: '证据收集意识', score: 87, desc: '会主动寻找支持/反驳的证据' },
    ]},
    { dimension: 'Link', subs: [
      { name: '协作主动性', score: 68, desc: '被请求时会帮助，但较少主动' },
      { name: '观点整合能力', score: 75, desc: '能理解他人观点，整合一般' },
      { name: '冲突调解意愿', score: 70, desc: '倾向于回避冲突' },
    ]},
    { dimension: 'Expression', subs: [
      { name: '口头表达清晰度', score: 88, desc: '说话有结构，能回应提问' },
      { name: '书面表达结构性', score: 82, desc: '图文结合好，文字量可提升' },
      { name: '多媒体呈现能力', score: 85, desc: '善于用图片/实物辅助表达' },
    ]},
  ],

  // ===== 四、性状画像 =====
  t726Types: [
    { name: '真实探索者', label: '主分型', confidence: '高', match: '89%' },
    { name: '结构化表达者', label: '次分型1', confidence: '中', match: '72%' },
    { name: '问题驱动者', label: '次分型2', confidence: '中', match: '68%' },
    { name: '独立建造者', label: '次分型3', confidence: '低', match: '54%' },
  ],
  shineScenarios: [
    '遇到"反常识"的现象时——比如发现蜘蛛有8条腿而不是6条(E001)',
    '可以自由观察和动手的场景——连续15分钟研究放大镜下的树叶(E007)',
    '有机会"拆解"和"研究"的时候——在家拆旧电器问"这个零件干什么"(E014)',
    '需要解释"为什么"的汇报场景——用结构化方式讲述发现过程(E002)',
  ],
  stuckScenarios: [
    '需要快速与陌生人协作时——倾向于先做自己的部分(E004)',
    '被要求"快点做完"时——他的深度思考需要时间(E007)',
    '需要解释"为什么做得不好"时——知道不好但说不清原因(E006)',
  ],
  misunderstandings: [
    { misconception: '"他不合群"', truth: '协作主动性68，但被请求时帮助有效(E011)', correct: '他不是"不愿意"协作，而是"不会主动"。需要帮他找到协作的触发点。' },
    { misconception: '"他做事太慢"', truth: '连续15分钟专注探索(E007)', correct: '他的"慢"是在深度思考，这是宝贵的能力。区分"思考慢"和"执行慢"。' },
    { misconception: '"他不会反思"', truth: '有自我觉察(E006)，能说出改进点(E018)', correct: '他有反思意识，但缺少方法。需要用三步框架引导。' },
  ],

  // ===== 五、教育红线14条 =====
  redLines: [
    { id: 1, behavior: '在他探索时说"别浪费时间了"', consequence: '好奇心被贬低，探索行为消失', alternative: '说"你在研究什么？能给我讲讲吗？"' },
    { id: 2, behavior: '用"你看看人家XXX"比较', consequence: '自我价值感受损', alternative: '说"你这次比上次进步在哪里？"' },
    { id: 3, behavior: '在他表达时打断或否定', consequence: '表达意愿下降', alternative: '完整听完后说"我听到你说的是……对吗？"' },
    { id: 4, behavior: '用成绩分数定义他的价值', consequence: '形成"我=分数"的认知', alternative: '说"这次你觉得哪里做得好？"' },
    { id: 5, behavior: '犯错时直接惩罚不复盘', consequence: '学会"避免被发现"', alternative: '说"发生了什么？下次可以怎么做？"' },
    { id: 6, behavior: '过度控制探索路径', consequence: '失去自主性', alternative: '说"你想怎么做？需要什么帮助？"' },
    { id: 7, behavior: '在他专注时频繁打扰', consequence: '心流状态被打断', alternative: '观察他是否"进入状态"，是则不打扰' },
    { id: 8, behavior: '只说"你要合群"', consequence: '不知道"怎么合群"', alternative: '说"你觉得和别人一起做事哪里不舒服？"' },
    { id: 9, behavior: '用物质奖励替代过程关注', consequence: '形成外在动机依赖', alternative: '说"你那个想法很有意思，怎么想到的？"' },
    { id: 10, behavior: '说"有什么好哭的"', consequence: '学会压抑情绪', alternative: '说"你现在很难过，是因为……吗？"' },
    { id: 11, behavior: '把"慢"等同于"笨"', consequence: '产生自我怀疑', alternative: '观察他"慢"在哪个环节，针对性支持' },
    { id: 12, behavior: '在外人面前数落缺点', consequence: '深层自尊损伤', alternative: '问题只在私下讨论' },
    { id: 13, behavior: '用"你答应过的"绑架', consequence: '对承诺产生恐惧', alternative: '说"你当时是怎么想的？现在想法变了吗？"' },
    { id: 14, behavior: '失败时说"我早就说过"', consequence: '不敢尝试', alternative: '说"结果和预期不一样，哪里出了问题？"' },
  ],

  // ===== 六、教育法则12条 =====
  principles: [
    { id: 1, name: '证据先于评价', principle: '孩子需要知道"为什么"', practice: '①描述行为 ②说影响 ③询问看法', check: '反馈是否先说事实？' },
    { id: 2, name: '问题先于答案', principle: '直接给答案剥夺思考', practice: '①把答案变问题 ②给30秒思考 ③先说"有意思"', check: '用问题回应了几次？' },
    { id: 3, name: '作品先于分数', principle: '作品是能力真实证据', practice: '①每周整理一件作品 ②一起看 ③存档', check: '收集了作品吗？' },
    { id: 4, name: '复盘先于归因', principle: '先还原过程才找到原因', practice: '①发生了什么 ②你怎么想 ③下次怎么做', check: '完成三步复盘了吗？' },
    { id: 5, name: '边界先于说教', principle: '清晰边界比长篇道理有效', practice: '①一句话说清 ②说后果 ③确认理解', check: '边界是否清晰一致？' },
    { id: 6, name: '情绪先于事情', principle: '情绪没被看见无法沟通', practice: '①命名情绪 ②表示理解 ③等平复再谈', check: '先处理情绪了吗？' },
    { id: 7, name: '选择先于命令', principle: '有选择权执行意愿更强', practice: '①命令变选择 ②尊重选择 ③用复盘代替"我早说过"', check: '给了选择权吗？' },
    { id: 8, name: '具体先于笼统', principle: '"很棒"没有信息量', practice: '①说具体哪里好 ②说明"好"在哪 ③问怎么做到的', check: '表扬是否具体？' },
    { id: 9, name: '示范先于要求', principle: '做什么比说什么更有影响', practice: '①自己先做到 ②让他看到过程 ③承认不完美', check: '示范过期望行为吗？' },
    { id: 10, name: '好奇先于纠正', principle: '先理解逻辑才能找到卡点', practice: '①先问"怎么想的" ②找卡点 ③针对性帮助', check: '纠正前先问了吗？' },
    { id: 11, name: '陪伴先于监督', principle: '陪伴创造安全感', practice: '①在旁边做自己的事 ②他来问时响应 ③结束后问有意思的事', check: '"在旁边"vs"盯着"比例？' },
    { id: 12, name: '过程先于结果', principle: '关注过程培养成长思维', practice: '①问"怎么做到的" ②问过程困难 ③找过程亮点', check: '过程时间超过结果？' },
  ],

  // ===== 七、沟通20句话 =====
  sentences: [
    { id: 1, text: '"你在研究什么？能给我讲讲吗？"', scene: '看到他在专注做某事时', intent: '保护好奇心' },
    { id: 2, text: '"这个想法很有意思，你是怎么想到的？"', scene: '他说了新颖的观点时', intent: '促进表达' },
    { id: 3, text: '"我看到你刚才……这样做的结果是……"', scene: '需要给反馈时', intent: '引导复盘' },
    { id: 4, text: '"你觉得是什么原因？"', scene: '他遇到问题或失败时', intent: '引导复盘' },
    { id: 5, text: '"如果重来一次，你会怎么做？"', scene: '复盘的最后一步', intent: '引导复盘' },
    { id: 6, text: '"你是想先做A还是先做B？"', scene: '需要他完成某事时', intent: '建立边界' },
    { id: 7, text: '"这件事不可以，因为……"', scene: '需要设定边界时', intent: '建立边界' },
    { id: 8, text: '"你现在看起来很生气/难过，是因为……吗？"', scene: '他情绪激动时', intent: '情绪支持' },
    { id: 9, text: '"遇到这种事，确实会让人不舒服。"', scene: '命名情绪之后', intent: '情绪支持' },
    { id: 10, text: '"等你准备好了，我们再聊这件事。"', scene: '他情绪还没平复时', intent: '情绪支持' },
    { id: 11, text: '"你需要我帮忙吗？还是想自己先试试？"', scene: '他遇到困难时', intent: '促进自主' },
    { id: 12, text: '"你刚才坚持了很长时间，这很不容易。"', scene: '他完成有难度的任务时', intent: '正向激励' },
    { id: 13, text: '"我注意到你这次比上次……"', scene: '想要肯定他时', intent: '正向激励' },
    { id: 14, text: '"你是怎么做到的？"', scene: '他做成了某件事时', intent: '促进表达' },
    { id: 15, text: '"我听到你说的是……对吗？"', scene: '他表达完观点后', intent: '促进表达' },
    { id: 16, text: '"这个部分我不太懂，你能再解释一下吗？"', scene: '想让他更深入思考时', intent: '促进表达' },
    { id: 17, text: '"你觉得这样做好在哪里？有什么可以更好的？"', scene: '他完成作品后', intent: '引导复盘' },
    { id: 18, text: '"今天有什么有意思的事想和我说吗？"', scene: '日常交流', intent: '保护好奇心' },
    { id: 19, text: '"我也遇到过类似的困难，我当时是……"', scene: '他遇到困难感到沮丧时', intent: '情绪支持' },
    { id: 20, text: '"这件事我们可以一起想想办法。"', scene: '他遇到难以解决的问题时', intent: '促进自主' },
  ],

  // ===== 八、职业建议 =====
  abilities: [
    { id: 1, name: '复杂问题定义能力', mapping: 'Inquiry, Wonder', level: '中高' },
    { id: 2, name: '跨领域迁移能力', mapping: 'Wonder, Link', level: '中' },
    { id: 3, name: '人际信任建立能力', mapping: 'Link, Expression', level: '待激活' },
    { id: 4, name: '复杂项目管理能力', mapping: 'Design, Reflection', level: '中' },
    { id: 5, name: '深度专注能力', mapping: 'Wonder, Inquiry', level: '高' },
    { id: 6, name: '批判性思维能力', mapping: 'Inquiry, Reflection', level: '中高' },
    { id: 7, name: '创意生成能力', mapping: 'Wonder, Design', level: '中' },
    { id: 8, name: '叙事表达能力', mapping: 'Expression', level: '中高' },
    { id: 9, name: '自我觉察与调节能力', mapping: 'Reflection', level: '待激活' },
    { id: 10, name: '持续学习能力', mapping: 'Wonder, Inquiry, Reflection', level: '高' },
    { id: 11, name: '模糊情境决策能力', mapping: 'Inquiry, Design', level: '中' },
    { id: 12, name: '道德判断能力', mapping: 'Reflection, Link', level: '待评估' },
  ],
  careerClusters: [
    { name: '科学研究者', reason: '探究力(88)+好奇心(82)契合科研核心需求', fill: '协作能力', path: '科创比赛；研究型大学' },
    { name: '产品设计师', reason: '设计力(79)+表达力(85)支撑全流程', fill: '用户同理心', path: '设计思维工作坊；设计专业' },
    { name: '技术工程师', reason: '探究力+设计力契合工程循环', fill: '复盘能力', path: '编程/机器人竞赛' },
    { name: '科学传播者', reason: '好奇心+表达力适合"把复杂变简单"', fill: '书面深度', path: '科学博客/视频；传播双学位' },
    { name: '创业者', reason: '好奇心驱动发现机会，设计力支撑落地', fill: '协作+复盘', path: '创业模拟；辅修商科' },
    { name: '教育工作者', reason: '探究力+表达力契合教育需求', fill: '学习敏感度', path: 'peer tutoring；教育学' },
    { name: '数据分析师', reason: '探究力驱动深挖数据', fill: '系统性复盘', path: '统计/数据科学专业' },
    { name: '内容创作者', reason: '好奇心+表达力驱动创作', fill: '持续产出自律', path: '建立创作习惯；传播专业' },
  ],

  // ===== 九、大学推荐 =====
  internationalUnis: [
    { name: 'MIT', country: '美国', majors: 'EECS、机械工程、物理学', reason: '"hands-on"文化与探究力匹配' },
    { name: '斯坦福大学', country: '美国', majors: 'Symbolic Systems、产品设计', reason: 'd.school设计思维文化契合' },
    { name: '剑桥大学', country: '英国', majors: 'Natural Sciences、工程学', reason: '跨学科学习+小班教学' },
    { name: 'ETH Zurich', country: '瑞士', majors: '机械工程、电子信息', reason: '强调实验和动手能力' },
    { name: 'NUS', country: '新加坡', majors: 'CS、数据科学、工程', reason: '理论实践兼顾，创业生态活跃' },
  ],
  domesticUnis: [
    { name: '清华大学', majors: '电子信息类、计算机类', reason: '工科"真刀真枪"做项目与探究力契合' },
    { name: '北京大学', majors: '物理学院、元培学院', reason: '学术自由，元培允许跨学科' },
    { name: '浙江大学', majors: '竺可桢学院、计算机', reason: '工科强+跨学科机会' },
    { name: '上海交通大学', majors: '电子信息类、致远学院', reason: '工科实践导向，产业联系紧密' },
    { name: '中国科学技术大学', majors: '少年班、物理学', reason: '学术氛围浓厚，本科生科研机会多' },
    { name: '南京大学', majors: '物理学院、匡亚明学院', reason: '理科传统强，大理科培养模式' },
    { name: '复旦大学', majors: '自然科学试验班', reason: '通识教育强，大类招生后选专业' },
    { name: '哈尔滨工业大学', majors: '航天学院、机器人工程', reason: '航天和机器人领域顶尖' },
    { name: '同济大学', majors: '设计创意学院', reason: '设计教育领先' },
    { name: '香港科技大学', majors: '工程学院、理学院', reason: '研究型定位，国际化环境' },
  ],

  // ===== 十、14天行动计划 =====
  dailyPlan: [
    { day: 1, task: '"好奇心捕捉"启动', duration: '15min', output: '记录1个"想知道为什么"的事', dimension: 'Wonder' },
    { day: 2, task: '"问题升级"练习', duration: '20min', output: '把问题拆成3个小问题', dimension: 'Inquiry' },
    { day: 3, task: '"证据收集"初体验', duration: '30min', output: '找2条证据', dimension: 'Inquiry' },
    { day: 4, task: '"我的发现"口头汇报', duration: '15min', output: '3分钟讲述探索过程', dimension: 'Expression' },
    { day: 5, task: '"帮助日"协作练习', duration: '不固定', output: '主动帮助一个家人', dimension: 'Link' },
    { day: 6, task: '"微项目"规划', duration: '30min', output: '画出计划图', dimension: 'Design' },
    { day: 7, task: '"微项目"执行Day1', duration: '45min', output: '完成第1-2步', dimension: 'Design' },
    { day: 8, task: '"微项目"执行Day2', duration: '45min', output: '继续推进', dimension: 'Design+Link' },
    { day: 9, task: '"微项目"复盘', duration: '20min', output: '回答三个问题', dimension: 'Reflection' },
    { day: 10, task: '"项目展示"准备', duration: '30min', output: '准备展示材料', dimension: 'Expression' },
    { day: 11, task: '"项目展示"', duration: '20min', output: '向家人展示', dimension: 'Expression' },
    { day: 12, task: '"好奇心2.0"', duration: '20min', output: '写3个新问题', dimension: 'Wonder+Reflection' },
    { day: 13, task: '"两周回顾"', duration: '30min', output: '选最满意和最想改进的', dimension: 'Reflection' },
    { day: 14, task: '"下一步"规划', duration: '20min', output: '写下30天想做的事', dimension: 'Design+Wonder' },
  ],

  // ===== 十一、90天路径图 =====
  phases: [
    {
      name: '第一阶段 (Day 1-30)：建立习惯 + 完成首个项目',
      goals: ['建立每日"好奇心捕捉"习惯', '完成1个微项目', '尝试1次协作'],
      outputs: ['"好奇心日记"30条', '微项目作品1件', '展示记录1份'],
      review: ['最大的发现是什么？', '项目中的最大困难？', '和别人合作感觉怎样？'],
    },
    {
      name: '第二阶段 (Day 31-60)：深化探究 + 扩展协作',
      goals: ['完成1个较复杂的探究项目', '尝试与同伴协作', '开始有意识复盘'],
      outputs: ['探究报告1件', '协作记录1份', '复盘日志4篇'],
      review: ['这次探究和上个月有什么不同？', '和朋友合作哪些顺利/不顺利？'],
    },
    {
      name: '第三阶段 (Day 61-90)：整合输出 + 建立成长意识',
      goals: ['完成1个可展示的"代表作"', '形成稳定复盘习惯', '能识别自己的成长'],
      outputs: ['"代表作"项目1件', '汇报记录1份', '90天成长对比1份'],
      review: ['给这90天打几分？', '最大的变化是什么？', '接下来想挑战什么？'],
    },
  ],

  // ===== 十二、证据链附录 =====
  evidences: [
    { id: 'E001', dimension: 'Inquiry', summary: '主动提出"为什么蜘蛛不是昆虫"，从腿数和身体结构自行验证', confidence: 'A' },
    { id: 'E002', dimension: 'Expression', summary: '汇报时使用"首先-然后-最后"结构，能回应提问', confidence: 'A' },
    { id: 'E003', dimension: 'Wonder', summary: '表示"看到不认识的东西就想知道是什么"，举例磁铁原理', confidence: 'B' },
    { id: 'E004', dimension: 'Link', summary: '小组任务中倾向独立完成，较少主动询问队友', confidence: 'A' },
    { id: 'E005', dimension: 'Design', summary: '搭建桥梁先画草图，材料不足时调整方案', confidence: 'A' },
    { id: 'E006', dimension: 'Reflection', summary: '复盘时能说出"做得不太好"，追问原因时回答模糊', confidence: 'B' },
    { id: 'E007', dimension: 'Inquiry', summary: '连续15分钟研究树叶脉络，用手机拍照记录', confidence: 'A' },
    { id: 'E008', dimension: 'Wonder', summary: '看到陀螺问"为什么转起来不会倒"', confidence: 'A' },
    { id: 'E011', dimension: 'Link', summary: '队友遇困难，被询问后才帮助，帮助内容有效', confidence: 'A' },
    { id: 'E014', dimension: 'Wonder', summary: '家长反馈：在家经常拆解旧电器研究', confidence: 'B' },
  ],
}
