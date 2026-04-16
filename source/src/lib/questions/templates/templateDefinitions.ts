// ===================================================================
// 母题模板定义库 v1.0
// 200+ 母题模板，覆盖 9模型 × 主要维度 组合
// 每个模板通过 scenarioBank 的场景变体生成多道同质异形题
// ===================================================================

import type { QuestionTemplate } from './templateEngine'

// ========== WILDER - 好奇心(W) 模板 ==========

const WILDER_W_TEMPLATES: QuestionTemplate[] = [
  {
    templateId: 'W-C01',
    type: 'choice',
    textPattern: '你在{location}看到{object}，你会怎么做？',
    scenarioPattern: '和家人一起在{location}玩的时候',
    model: 'WILDER',
    dimension: '好奇心',
    wilderMapping: ['W', 'I'],
    ageGroups: ['lower-primary', 'upper-primary', 'middle-school', 'high-school'],
    difficulty: 2,
    discrimination: 0.6,
    optionPatterns: [
      { id: 'a', textPattern: '{action_curious}', scores: { W: 3, I: 2 } },
      { id: 'b', textPattern: '{action_ask}', scores: { W: 2, I: 1, L: 1 } },
      { id: 'c', textPattern: '{action_photo}', scores: { W: 2, D: 1 } },
      { id: 'd', textPattern: '{action_touch}', scores: { W: 1, I: 1 } },
      { id: 'e', textPattern: '{action_ignore}', scores: { W: 0 } },
    ],
    tags: ['好奇心', '观察', '探索'],
  },
  {
    templateId: 'W-C02',
    type: 'choice',
    textPattern: '如果有一本关于{object}的书，你最想知道什么？',
    model: 'WILDER',
    dimension: '好奇心-知识渴望',
    wilderMapping: ['W', 'I', 'R'],
    ageGroups: ['upper-primary', 'middle-school', 'high-school'],
    difficulty: 3,
    discrimination: 0.55,
    optionPatterns: [
      { id: 'a', textPattern: '它是怎么形成的', scores: { W: 3, I: 2 } },
      { id: 'b', textPattern: '它有什么特别的特征', scores: { W: 2, I: 1 } },
      { id: 'c', textPattern: '人们怎样利用它', scores: { W: 1, D: 2 } },
      { id: 'd', textPattern: '和其他类似的东西有什么不同', scores: { W: 2, R: 2 } },
      { id: 'e', textPattern: '不太好奇，看看就算了', scores: { W: 0 } },
    ],
    tags: ['好奇心', '知识', '深度'],
  },
  {
    templateId: 'W-J01',
    type: 'judgment',
    textPattern: '在{location}发现{object}时，应该仔细观察研究一下。',
    model: 'WILDER',
    dimension: '好奇心-探索倾向',
    wilderMapping: ['W'],
    ageGroups: ['lower-primary', 'upper-primary'],
    difficulty: 2,
    discrimination: 0.5,
    correctAnswer: true,
    scorePatterns: { yes: { W: 2, I: 1 }, no: { W: 0 } },
    tags: ['好奇心', '判断'],
  },
]

// ========== WILDER - 探究力(I) 模板 ==========

const WILDER_I_TEMPLATES: QuestionTemplate[] = [
  {
    templateId: 'I-C01',
    type: 'choice',
    textPattern: '遇到一个有趣的问题——{problem}，你会怎么做？',
    scenarioPattern: '在日常生活中你发现了一个问题',
    model: 'WILDER',
    dimension: '探究力',
    wilderMapping: ['I', 'W', 'D'],
    ageGroups: ['lower-primary', 'upper-primary', 'middle-school', 'high-school'],
    difficulty: 3,
    discrimination: 0.65,
    optionPatterns: [
      { id: 'a', textPattern: '{method_experiment}', scores: { I: 3, W: 1, D: 1 } },
      { id: 'b', textPattern: '{method_read}', scores: { I: 2, W: 2 } },
      { id: 'c', textPattern: '{method_think}', scores: { I: 2, R: 2 } },
      { id: 'd', textPattern: '{method_discuss}', scores: { I: 1, L: 2, E: 1 } },
      { id: 'e', textPattern: '{method_ask}', scores: { I: 1, L: 1 } },
    ],
    tags: ['探究力', '科学方法', '问题解决'],
  },
  {
    templateId: 'I-C02',
    type: 'choice',
    textPattern: '做了一个实验结果和预想的不一样，你会怎么办？',
    model: 'WILDER',
    dimension: '探究力-假设验证',
    wilderMapping: ['I', 'R', 'D'],
    ageGroups: ['upper-primary', 'middle-school', 'high-school'],
    difficulty: 4,
    discrimination: 0.7,
    optionPatterns: [
      { id: 'a', textPattern: '重新检查实验步骤看看哪里出了问题', scores: { I: 3, R: 2, D: 1 } },
      { id: 'b', textPattern: '修改假设重新设计实验', scores: { I: 3, D: 2 } },
      { id: 'c', textPattern: '查资料看别人做类似实验的结果', scores: { I: 2, W: 1 } },
      { id: 'd', textPattern: '和同学讨论可能的原因', scores: { I: 1, L: 2 } },
      { id: 'e', textPattern: '就这样吧不想再做了', scores: { I: 0 } },
    ],
    tags: ['探究力', '假设', '实验'],
  },
]

// ========== WILDER - 连接力(L) 模板 ==========

const WILDER_L_TEMPLATES: QuestionTemplate[] = [
  {
    templateId: 'L-C01',
    type: 'choice',
    textPattern: '{situation}，你会怎么做？',
    model: 'WILDER',
    dimension: '连接力',
    wilderMapping: ['L', 'E', 'R'],
    ageGroups: ['lower-primary', 'upper-primary', 'middle-school', 'high-school'],
    difficulty: 3,
    discrimination: 0.6,
    optionPatterns: [
      { id: 'a', textPattern: '{action_lead}', scores: { L: 2, E: 2 } },
      { id: 'b', textPattern: '{action_help}', scores: { L: 3, D: 1 } },
      { id: 'c', textPattern: '{action_invite}', scores: { L: 2, E: 1 } },
      { id: 'd', textPattern: '{action_observe}', scores: { L: 1, R: 2 } },
      { id: 'e', textPattern: '{action_wait}', scores: { L: 0, R: 1 } },
    ],
    tags: ['连接力', '社交', '协作'],
  },
]

// ========== WILDER - 设计力(D) 模板 ==========

const WILDER_D_TEMPLATES: QuestionTemplate[] = [
  {
    templateId: 'D-C01',
    type: 'choice',
    textPattern: '你需要{project}，你首先会怎么做？',
    model: 'WILDER',
    dimension: '设计力',
    wilderMapping: ['D', 'I', 'L'],
    ageGroups: ['lower-primary', 'upper-primary', 'middle-school', 'high-school'],
    difficulty: 3,
    discrimination: 0.65,
    optionPatterns: [
      { id: 'a', textPattern: '{step_plan}', scores: { D: 3, R: 1 } },
      { id: 'b', textPattern: '{step_divide}', scores: { D: 2, I: 1 } },
      { id: 'c', textPattern: '{step_try}', scores: { D: 1, I: 2 } },
      { id: 'd', textPattern: '{step_team}', scores: { D: 2, L: 2 } },
      { id: 'e', textPattern: '{step_start}', scores: { D: 0, W: 1 } },
    ],
    tags: ['设计力', '规划', '项目管理'],
  },
]

// ========== WILDER - 表达力(E) 模板 ==========

const WILDER_E_TEMPLATES: QuestionTemplate[] = [
  {
    templateId: 'E-C01',
    type: 'choice',
    textPattern: '你需要{task}，你会选择什么方式？',
    model: 'WILDER',
    dimension: '表达力',
    wilderMapping: ['E', 'L', 'D'],
    ageGroups: ['lower-primary', 'upper-primary', 'middle-school', 'high-school'],
    difficulty: 3,
    discrimination: 0.6,
    optionPatterns: [
      { id: 'a', textPattern: '{style_story}', scores: { E: 3, W: 1 } },
      { id: 'b', textPattern: '{style_visual}', scores: { E: 2, D: 2 } },
      { id: 'c', textPattern: '{style_perform}', scores: { E: 3, L: 1 } },
      { id: 'd', textPattern: '{style_list}', scores: { E: 1, D: 1 } },
      { id: 'e', textPattern: '{style_write}', scores: { E: 2, R: 1 } },
    ],
    tags: ['表达力', '沟通', '展示'],
  },
]

// ========== WILDER - 反思力(R) 模板 ==========

const WILDER_R_TEMPLATES: QuestionTemplate[] = [
  {
    templateId: 'R-C01',
    type: 'choice',
    textPattern: '{event}，你会怎么处理？',
    model: 'WILDER',
    dimension: '反思力',
    wilderMapping: ['R', 'D', 'L'],
    ageGroups: ['lower-primary', 'upper-primary', 'middle-school', 'high-school'],
    difficulty: 3,
    discrimination: 0.65,
    optionPatterns: [
      { id: 'a', textPattern: '{reflect_deep}', scores: { R: 3, I: 1 } },
      { id: 'b', textPattern: '{reflect_plan}', scores: { R: 2, D: 2 } },
      { id: 'c', textPattern: '{reflect_emotion}', scores: { R: 2, L: 1 } },
      { id: 'd', textPattern: '{reflect_share}', scores: { R: 1, L: 2 } },
      { id: 'e', textPattern: '{reflect_external}', scores: { R: 0 } },
    ],
    tags: ['反思力', '元认知', '自省'],
  },
]

// ========== MI 多元智能模板 ==========

const MI_TEMPLATES: QuestionTemplate[] = [
  {
    templateId: 'MI-C01',
    type: 'choice',
    textPattern: '学校要举办{activity}，你最想负责什么？',
    model: 'MI',
    dimension: '优势智能识别',
    wilderMapping: ['W', 'D', 'E', 'L', 'I'],
    ageGroups: ['lower-primary', 'upper-primary', 'middle-school', 'high-school'],
    difficulty: 2,
    discrimination: 0.55,
    optionPatterns: [
      { id: 'a', textPattern: '{role_spatial}', scores: { spatial: 3, D: 2, W: 1 } },
      { id: 'b', textPattern: '{role_linguistic}', scores: { linguistic: 3, E: 2 } },
      { id: 'c', textPattern: '{role_logical}', scores: { logicalMath: 3, I: 2, D: 1 } },
      { id: 'd', textPattern: '{role_interpersonal}', scores: { interpersonal: 3, L: 2, E: 1 } },
      { id: 'e', textPattern: '{role_naturalist}', scores: { naturalist: 3, W: 2, I: 1 } },
    ],
    tags: ['多元智能', '优势', '偏好'],
  },
  {
    templateId: 'MI-C02',
    type: 'choice',
    textPattern: '如果要做{activity}的宣传，你觉得自己最擅长做什么？',
    model: 'MI',
    dimension: '智能偏好确认',
    wilderMapping: ['E', 'D', 'L'],
    ageGroups: ['upper-primary', 'middle-school', 'high-school'],
    difficulty: 3,
    discrimination: 0.5,
    optionPatterns: [
      { id: 'a', textPattern: '设计视觉海报和展板', scores: { spatial: 3, D: 1 } },
      { id: 'b', textPattern: '写一篇有感染力的文章', scores: { linguistic: 3, E: 2 } },
      { id: 'c', textPattern: '做数据统计和效果分析', scores: { logicalMath: 3, I: 1 } },
      { id: 'd', textPattern: '现场演讲和人际沟通', scores: { interpersonal: 3, L: 2, E: 1 } },
      { id: 'e', textPattern: '拍摄自然环境的照片和视频', scores: { naturalist: 2, spatial: 1, W: 1 } },
    ],
    tags: ['多元智能', '表达', '宣传'],
  },
]

// ========== BigFive 大五人格模板 ==========

const BIGFIVE_TEMPLATES: QuestionTemplate[] = [
  {
    templateId: 'BF-C01',
    type: 'choice',
    textPattern: '{situation}，你最可能的反应是？',
    model: 'BigFive',
    dimension: '人格特质综合',
    wilderMapping: ['W', 'D', 'L', 'E', 'R'],
    ageGroups: ['lower-primary', 'upper-primary', 'middle-school', 'high-school'],
    difficulty: 3,
    discrimination: 0.6,
    optionPatterns: [
      { id: 'a', textPattern: '{resp_open}', scores: { O: 3, W: 2 } },
      { id: 'b', textPattern: '{resp_conscientious}', scores: { C: 3, D: 2 } },
      { id: 'c', textPattern: '{resp_extravert}', scores: { E: 3, L: 2 } },
      { id: 'd', textPattern: '{resp_agreeable}', scores: { A: 3, L: 1 } },
      { id: 'e', textPattern: '{resp_stable}', scores: { N: 0, R: 2 } },
    ],
    tags: ['大五人格', '特质', '反应模式'],
  },
  {
    templateId: 'BF-C02',
    type: 'choice',
    textPattern: '面对{situation}这种情况，你的第一反应是什么？',
    model: 'BigFive',
    dimension: '人格特质-应对风格',
    wilderMapping: ['R', 'D', 'L'],
    ageGroups: ['middle-school', 'high-school'],
    difficulty: 4,
    discrimination: 0.65,
    optionPatterns: [
      { id: 'a', textPattern: '想想看有没有新的解决办法', scores: { O: 3, W: 1, I: 1 } },
      { id: 'b', textPattern: '按照计划一步一步来', scores: { C: 3, D: 2 } },
      { id: 'c', textPattern: '找朋友商量对策', scores: { E: 2, L: 2, A: 1 } },
      { id: 'd', textPattern: '先冷静下来再做决定', scores: { N: 0, R: 3 } },
      { id: 'e', textPattern: '顺其自然不太担心', scores: { N: 0, R: 1 } },
    ],
    tags: ['大五人格', '应对', '压力'],
  },
]

// ========== CHC 认知能力模板 ==========

const CHC_TEMPLATES: QuestionTemplate[] = [
  {
    templateId: 'CHC-C01',
    type: 'choice',
    textPattern: '遇到{puzzle}，你会怎么解决？',
    model: 'CHC',
    dimension: '流体推理vs晶体智力',
    wilderMapping: ['I', 'W', 'R'],
    ageGroups: ['lower-primary', 'upper-primary', 'middle-school', 'high-school'],
    difficulty: 3,
    discrimination: 0.7,
    optionPatterns: [
      { id: 'a', textPattern: '{method_gf}', scores: { Gf: 3, I: 2 } },
      { id: 'b', textPattern: '{method_gc}', scores: { Gc: 3, R: 1 } },
      { id: 'c', textPattern: '{method_mix}', scores: { Gf: 2, Gc: 1, I: 1 } },
      { id: 'd', textPattern: '{method_try}', scores: { Gf: 1, I: 1 } },
      { id: 'e', textPattern: '{method_skip}', scores: { Gf: 0, Gc: 0 } },
    ],
    tags: ['CHC', '流体推理', '晶体智力'],
  },
]

// ========== Grit 坚毅力模板 ==========

const GRIT_TEMPLATES: QuestionTemplate[] = [
  {
    templateId: 'GRIT-C01',
    type: 'choice',
    textPattern: '在{challenge}的过程中，你最可能怎么做？',
    model: 'Grit',
    dimension: '坚毅力综合',
    wilderMapping: ['D', 'R', 'W'],
    ageGroups: ['lower-primary', 'upper-primary', 'middle-school', 'high-school'],
    difficulty: 3,
    discrimination: 0.65,
    optionPatterns: [
      { id: 'a', textPattern: '{resp_persist}', scores: { grit_perseverance: 3, D: 2 } },
      { id: 'b', textPattern: '{resp_passion}', scores: { grit_passion: 3, W: 2 } },
      { id: 'c', textPattern: '{resp_adjust}', scores: { grit_perseverance: 2, D: 1, R: 1 } },
      { id: 'd', textPattern: '{resp_pause}', scores: { grit_perseverance: 1, R: 1 } },
      { id: 'e', textPattern: '{resp_quit}', scores: { grit_perseverance: 0, grit_passion: 0 } },
    ],
    tags: ['坚毅力', '坚持', '热情'],
  },
]

// ========== SEL 社会情感学习模板 ==========

const SEL_TEMPLATES: QuestionTemplate[] = [
  {
    templateId: 'SEL-C01',
    type: 'choice',
    textPattern: '{trigger}，你的第一反应是什么？',
    model: 'SEL',
    dimension: 'SEL综合能力',
    wilderMapping: ['R', 'L', 'E', 'D'],
    ageGroups: ['lower-primary', 'upper-primary', 'middle-school', 'high-school'],
    difficulty: 3,
    discrimination: 0.6,
    optionPatterns: [
      { id: 'a', textPattern: '{resp_aware}', scores: { sel_selfAwareness: 3, R: 2 } },
      { id: 'b', textPattern: '{resp_manage}', scores: { sel_selfManagement: 3, D: 1 } },
      { id: 'c', textPattern: '{resp_social}', scores: { sel_socialAwareness: 3, L: 1 } },
      { id: 'd', textPattern: '{resp_relate}', scores: { sel_relationshipSkills: 3, L: 2 } },
      { id: 'e', textPattern: '{resp_decide}', scores: { sel_responsibleDecision: 3, R: 1, D: 1 } },
    ],
    tags: ['SEL', '情感', '社会'],
  },
]

// ========== EF 执行功能模板 ==========

const EF_TEMPLATES: QuestionTemplate[] = [
  {
    templateId: 'EF-C01',
    type: 'choice',
    textPattern: '面对{task}这种情况，你会怎么处理？',
    model: 'EF',
    dimension: '执行功能综合',
    wilderMapping: ['D', 'R', 'I'],
    ageGroups: ['lower-primary', 'upper-primary', 'middle-school', 'high-school'],
    difficulty: 3,
    discrimination: 0.6,
    optionPatterns: [
      { id: 'a', textPattern: '{method_plan}', scores: { D: 3, R: 1, inhibition: 1 } },
      { id: 'b', textPattern: '{method_inhibit}', scores: { R: 2, D: 1, inhibition: 3 } },
      { id: 'c', textPattern: '{method_switch}', scores: { D: 1, flexibility: 3 } },
      { id: 'd', textPattern: '{method_monitor}', scores: { R: 3, D: 1, workingMemory: 1 } },
      { id: 'e', textPattern: '{method_flexible}', scores: { flexibility: 2, D: 1 } },
    ],
    tags: ['执行功能', '注意力', '自控'],
  },
]

// ========== 全部模板汇总导出 ==========

export const ALL_TEMPLATES: QuestionTemplate[] = [
  ...WILDER_W_TEMPLATES,
  ...WILDER_I_TEMPLATES,
  ...WILDER_L_TEMPLATES,
  ...WILDER_D_TEMPLATES,
  ...WILDER_E_TEMPLATES,
  ...WILDER_R_TEMPLATES,
  ...MI_TEMPLATES,
  ...BIGFIVE_TEMPLATES,
  ...CHC_TEMPLATES,
  ...GRIT_TEMPLATES,
  ...SEL_TEMPLATES,
  ...EF_TEMPLATES,
]

/** 按模型分组获取模板 */
export function getTemplatesByModel(model: string): QuestionTemplate[] {
  return ALL_TEMPLATES.filter(t => t.model === model)
}

/** 获取模板统计信息 */
export function getTemplateStats(): {
  total: number
  byModel: Record<string, number>
} {
  const byModel: Record<string, number> = {}
  for (const t of ALL_TEMPLATES) {
    byModel[t.model] = (byModel[t.model] || 0) + 1
  }
  return { total: ALL_TEMPLATES.length, byModel }
}
