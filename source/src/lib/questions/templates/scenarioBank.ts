// ===================================================================
// 场景素材库 v1.0
// 为模板引擎提供参数化场景变体
// 按主题分类：自然探索、社交互动、学业挑战、创意创作、情感管理
// ===================================================================

import type { ScenarioVariant } from './templateEngine'

// ========== 好奇心(W)场景变体 ==========

export const CURIOSITY_SCENARIOS: ScenarioVariant[] = [
  { variantId: 'V01', params: { location: '公园', object: '一种从没见过的花', action_curious: '蹲下来仔细观察花瓣的形状和颜色', action_ignore: '继续走不太在意', action_ask: '问爸爸妈妈这是什么花', action_photo: '拍一张照片回家查', action_touch: '小心地摸一摸花瓣' } },
  { variantId: 'V02', params: { location: '海边', object: '一个奇怪形状的贝壳', action_curious: '捡起来翻来覆去看它的纹路', action_ignore: '放回沙子里不管它', action_ask: '问同伴知不知道这是什么贝壳', action_photo: '带回家上网搜一搜', action_touch: '用手指划过贝壳上的纹理' } },
  { variantId: 'V03', params: { location: '博物馆', object: '一块从没见过的矿石标本', action_curious: '凑近展柜仔细看它的结晶结构', action_ignore: '走马观花看下一个', action_ask: '问讲解员这块矿石是怎么形成的', action_photo: '记下名字回家查资料', action_touch: '想摸摸它的表面是粗糙还是光滑' } },
  { variantId: 'V04', params: { location: '小区花园', object: '一只颜色特别的蝴蝶', action_curious: '静静跟着它看它飞到哪里', action_ignore: '看一眼就走了', action_ask: '问小伙伴有没有见过这种蝴蝶', action_photo: '尝试拍照记录下来', action_touch: '慢慢伸出手指看它会不会停下' } },
  { variantId: 'V05', params: { location: '图书馆', object: '一本封面很奇特的书', action_curious: '忍不住翻开看看里面写了什么', action_ignore: '放回书架继续找想看的书', action_ask: '问图书管理员这本书讲什么', action_photo: '记下书名以后再看', action_touch: '摸了摸特殊材质的封面' } },
  { variantId: 'V06', params: { location: '山里', object: '一种发着微光的苔藓', action_curious: '弯腰仔细观察它为什么会发光', action_ignore: '觉得有点奇怪就走开了', action_ask: '兴奋地叫同伴来看', action_photo: '掏出手电筒照射看看效果', action_touch: '小心翼翼地碰一碰' } },
  { variantId: 'V07', params: { location: '菜市场', object: '一种没见过的水果', action_curious: '拿起来闻一闻看看什么味道', action_ignore: '看了一眼就走了', action_ask: '问卖水果的人这是什么', action_photo: '拍下来回家搜索', action_touch: '摸摸它的外皮是什么质感' } },
  { variantId: 'V08', params: { location: '天文台', object: '望远镜里看到一颗特别亮的星', action_curious: '调整望远镜想看得更清楚', action_ignore: '看了一眼觉得差不多就算了', action_ask: '问天文老师那是什么星', action_photo: '在星图上标记它的位置', action_touch: '转动望远镜探索周围还有什么' } },
  { variantId: 'V09', params: { location: '厨房', object: '一种从没用过的调料', action_curious: '打开闻一闻是什么味道', action_ignore: '放回原处不碰它', action_ask: '问家人这个调料是做什么用的', action_photo: '看看瓶子上的说明', action_touch: '倒一点在手指上尝尝' } },
  { variantId: 'V10', params: { location: '工地旁边', object: '一台巨大的挖掘机在工作', action_curious: '站在安全的地方看它怎么运作', action_ignore: '绕道走不太关心', action_ask: '问爸爸挖掘机是怎么工作的', action_photo: '数一数它有几个关节', action_touch: '模仿挖掘机的动作' } },
]

// ========== 探究力(I)场景变体 ==========

export const INQUIRY_SCENARIOS: ScenarioVariant[] = [
  { variantId: 'V01', params: { problem: '为什么天空是蓝色的', method_experiment: '用三棱镜做光的分解实验', method_read: '查阅关于光散射的科普书', method_ask: '问科学老师请他讲解', method_think: '自己画图推理光线的路径', method_discuss: '和同学一起查资料讨论' } },
  { variantId: 'V02', params: { problem: '为什么冰淇淋在太阳下会化', method_experiment: '把冰淇淋放在不同温度下观察融化速度', method_read: '查阅物质三态变化的知识', method_ask: '问大人热量传递是怎么回事', method_think: '画一个冰变成水的过程图', method_discuss: '和小伙伴讨论怎么让冰淇淋更耐化' } },
  { variantId: 'V03', params: { problem: '为什么树叶秋天会变黄', method_experiment: '收集不同树的叶子观察变化时间', method_read: '查叶绿素和类胡萝卜素的科普文章', method_ask: '问生物老师叶子里有什么色素', method_think: '推测温度和光照时间的影响', method_discuss: '和同学一起做观察记录对比' } },
  { variantId: 'V04', params: { problem: '为什么肥皂泡是圆的', method_experiment: '用不同形状的铁丝框吹泡泡观察', method_read: '查阅表面张力的知识', method_ask: '问老师什么是表面张力', method_think: '思考球形是不是最省材料的形状', method_discuss: '和朋友比赛谁能吹出最大的泡泡' } },
  { variantId: 'V05', params: { problem: '为什么指南针总是指向北方', method_experiment: '用磁铁靠近指南针看会怎样', method_read: '查阅地球磁场的相关知识', method_ask: '问科学老师地球像一个大磁铁是什么意思', method_think: '用磁铁和铁粉做实验观察磁力线', method_discuss: '和同学讨论古人是怎么发现这个现象的' } },
  { variantId: 'V06', params: { problem: '为什么重的东西和轻的东西同时落地', method_experiment: '从同样高度同时扔两个不同重量的球', method_read: '查阅伽利略比萨斜塔实验的故事', method_ask: '问物理老师空气阻力是怎么回事', method_think: '想象在没有空气的地方会怎样', method_discuss: '和同学辩论到底谁先落地' } },
  { variantId: 'V07', params: { problem: '为什么有的人能浮在水面上', method_experiment: '在水里放入不同的东西看哪些浮哪些沉', method_read: '查阅密度和浮力的关系', method_ask: '问游泳教练怎样让身体浮起来', method_think: '想为什么铁能沉但铁做的船能浮', method_discuss: '和同学一起研究人体密度' } },
  { variantId: 'V08', params: { problem: '为什么下雨前蚂蚁会搬家', method_experiment: '在蚂蚁窝附近放杯水观察它们的反应', method_read: '查阅蚂蚁感知气压变化的资料', method_ask: '问自然老师动物能预测天气吗', method_think: '记录天气和蚂蚁行为做对比表', method_discuss: '和同学一起观察还有哪些动物能预报天气' } },
]

// ========== 连接力(L)场景变体 ==========

export const CONNECTION_SCENARIOS: ScenarioVariant[] = [
  { variantId: 'V01', params: { situation: '班上来了一个新同学，看起来有点紧张', action_lead: '主动过去打招呼介绍自己', action_help: '帮他找到座位并介绍周围同学', action_observe: '先观察一下再决定要不要过去', action_wait: '等他先适应一下再交流', action_invite: '邀请他一起参加课间活动' } },
  { variantId: 'V02', params: { situation: '小组合作项目中有人不太参与', action_lead: '问他想负责哪个部分', action_help: '把一个他擅长的任务分给他', action_observe: '先了解他不参与的原因', action_wait: '给他一些时间看他会不会主动参与', action_invite: '邀请他分享自己的想法' } },
  { variantId: 'V03', params: { situation: '好朋友因为考试没考好心情不好', action_lead: '直接告诉他下次一定能考好', action_help: '帮他分析哪些地方可以改进', action_observe: '安静地陪在他身边', action_wait: '给他独处的时间想清楚', action_invite: '约他放学一起去打球散散心' } },
  { variantId: 'V04', params: { situation: '在社区活动中需要说服邻居一起做环保', action_lead: '大胆上前做一个小演讲', action_help: '准备宣传资料发给大家', action_observe: '先听听邻居们怎么想', action_wait: '找到关心环保的人先做示范', action_invite: '组织一次垃圾分类体验活动' } },
  { variantId: 'V05', params: { situation: '两个好朋友因为误会吵架了', action_lead: '站出来帮他们调解', action_help: '分别找他们了解各自的想法', action_observe: '先让他们冷静下来再介入', action_wait: '等他们自己和好', action_invite: '约他们三个一起吃饭化解矛盾' } },
  { variantId: 'V06', params: { situation: '参加夏令营第一天不认识任何人', action_lead: '主动向身边的人自我介绍', action_help: '找一个看起来友善的人搭话', action_observe: '先看看谁和自己兴趣相似', action_wait: '等别人先来找自己说话', action_invite: '在活动中主动组建一个小组' } },
  { variantId: 'V07', params: { situation: '班长竞选需要组建团队', action_lead: '找到各方面能力强的同学组队', action_help: '了解每个人的优势分配任务', action_observe: '先看看谁有兴趣再邀请', action_wait: '等有意愿的同学自己报名', action_invite: '开一个小会议讨论竞选计划' } },
]

// ========== 设计力(D)场景变体 ==========

export const DESIGN_SCENARIOS: ScenarioVariant[] = [
  { variantId: 'V01', params: { project: '做一个关于太阳系的模型', step_plan: '先查资料了解各行星大小比例再画设计图', step_start: '直接开始用黏土捏行星', step_divide: '列一个任务清单按步骤完成', step_try: '先做一个小的试试看', step_team: '把不同行星分配给不同组员' } },
  { variantId: 'V02', params: { project: '组织一次班级联欢会', step_plan: '先收集大家想法再制定流程表', step_start: '想到什么节目就直接开始准备', step_divide: '列出所有需要准备的东西分工完成', step_try: '先安排几个节目看效果', step_team: '成立策划小组讨论方案' } },
  { variantId: 'V03', params: { project: '写一篇关于家乡变化的调查报告', step_plan: '先列一个采访提纲和调查计划', step_start: '先随便写写自己的感受', step_divide: '把报告分成历史、现在、未来三部分分别调查', step_try: '先采访一个邻居试试方法', step_team: '和同学分工去不同地方调查' } },
  { variantId: 'V04', params: { project: '用废旧材料做一个能动的玩具', step_plan: '先画一张设计图想清楚结构和动力', step_start: '翻出材料边做边想', step_divide: '分步骤做：先做底座再做动力装置最后装饰', step_try: '先做一个最简单的版本测试', step_team: '邀请擅长手工的朋友帮忙' } },
  { variantId: 'V05', params: { project: '设计一个学校节水方案', step_plan: '先调查学校哪里用水最多再想解决办法', step_start: '直接写一些节水小贴士贴在水龙头旁', step_divide: '分为调查现状、设计方案、实施计划三步走', step_try: '先在一个洗手间试行方案看效果', step_team: '组建环保小队分工负责不同区域' } },
  { variantId: 'V06', params: { project: '准备一次科学展览的展位', step_plan: '先确定展示主题然后画展位布局图', step_start: '先把实验器材摆出来再说', step_divide: '列清单：展板内容、互动实验、讲解稿分别准备', step_try: '先模拟一次展示流程', step_team: '每人负责展位的一个部分' } },
]

// ========== 表达力(E)场景变体 ==========

export const EXPRESSION_SCENARIOS: ScenarioVariant[] = [
  { variantId: 'V01', params: { task: '在班会上分享假期中最有趣的经历', style_story: '讲一个有开头、经过、结尾的完整故事', style_list: '列出几个要点简单说明', style_visual: '画一幅画或做PPT来配合讲解', style_perform: '用角色扮演的方式重现当时的场景', style_write: '写一篇短文让大家传阅' } },
  { variantId: 'V02', params: { task: '向家人解释一个你在学校学到的科学原理', style_story: '编一个小故事来解释这个原理', style_list: '用简单的步骤一二三讲清楚', style_visual: '画一张示意图帮助理解', style_perform: '用家里的东西做个小实验演示', style_write: '写一个通俗易懂的说明文' } },
  { variantId: 'V03', params: { task: '说服同学参加一个你觉得有意义的活动', style_story: '讲一个参加过的人获得了什么的故事', style_list: '列出参加这个活动的三个好处', style_visual: '做一张吸引人的海报', style_perform: '现场展示活动的有趣环节', style_write: '写一封有感染力的邀请信' } },
  { variantId: 'V04', params: { task: '在读书会上分享你最近读的一本好书', style_story: '讲书中最打动你的情节', style_list: '总结这本书的三个核心观点', style_visual: '画一张思维导图展示书的结构', style_perform: '朗读你最喜欢的段落', style_write: '写一篇简短的书评' } },
  { variantId: 'V05', params: { task: '记录并分享一次有意义的志愿服务经历', style_story: '以时间线讲述这次经历', style_list: '说说做了什么、学到了什么', style_visual: '制作一个照片拼贴配文字说明', style_perform: '以采访形式让同伴提问你回答', style_write: '写一篇日记体的感想' } },
  { variantId: 'V06', params: { task: '在家庭聚会上介绍你正在学习的一项新技能', style_story: '讲讲学习过程中最困难和最有成就感的时刻', style_list: '用三句话概括：是什么、怎么学的、有什么收获', style_visual: '现场展示你的学习成果', style_perform: '表演你新学会的技能', style_write: '录一段小视频讲解' } },
]

// ========== 反思力(R)场景变体 ==========

export const REFLECTION_SCENARIOS: ScenarioVariant[] = [
  { variantId: 'V01', params: { event: '考试成绩比预想的差', reflect_deep: '分析是哪些题目出了问题以及为什么', reflect_emotion: '先接受失望的心情然后思考下一步', reflect_plan: '制定一个改进计划针对弱项练习', reflect_external: '觉得是试卷太难了不太公平', reflect_share: '和家人或老师聊聊寻求建议' } },
  { variantId: 'V02', params: { event: '和好朋友因为小事吵架了', reflect_deep: '想想自己有没有做得不对的地方', reflect_emotion: '先冷静下来感受自己的情绪', reflect_plan: '想好怎么道歉和沟通', reflect_external: '觉得是对方的错', reflect_share: '找另一个朋友聊聊请教意见' } },
  { variantId: 'V03', params: { event: '参加比赛没有获得名次', reflect_deep: '复盘比赛过程找到可以改进的环节', reflect_emotion: '允许自己难过但不放弃', reflect_plan: '为下一次比赛制定训练计划', reflect_external: '觉得评委不公平', reflect_share: '请教练帮忙分析表现' } },
  { variantId: 'V04', params: { event: '做了一件让自己后悔的事', reflect_deep: '认真想想当时为什么会那样做', reflect_emotion: '承认后悔的感觉并原谅自己', reflect_plan: '想好以后遇到类似情况怎么处理', reflect_external: '觉得是别人影响了自己', reflect_share: '写日记记录自己的感受和想法' } },
  { variantId: 'V05', params: { event: '发现自己的学习方法效率不高', reflect_deep: '分析哪些方法有效哪些浪费时间', reflect_emotion: '不焦虑接受需要调整的事实', reflect_plan: '尝试新的学习方法并记录效果', reflect_external: '觉得是课程安排不合理', reflect_share: '向学习好的同学请教经验' } },
  { variantId: 'V06', params: { event: '完成了一个特别有挑战的项目', reflect_deep: '总结哪些策略帮助你成功了', reflect_emotion: '享受成就感同时保持谦虚', reflect_plan: '把成功经验记录下来以后借鉴', reflect_external: '觉得运气好也很重要', reflect_share: '在班上分享自己的经验' } },
]

// ========== 多元智能场景变体 ==========

export const MI_SCENARIOS: ScenarioVariant[] = [
  { variantId: 'V01', params: { activity: '学校科技节', role_spatial: '设计展馆的布局和装饰', role_linguistic: '撰写开幕式主持词', role_logical: '设计科学竞赛的评分系统', role_interpersonal: '协调各班展位的安排', role_naturalist: '策划户外自然观察体验区' } },
  { variantId: 'V02', params: { activity: '社区义卖活动', role_spatial: '设计摊位的展示架和标价牌', role_linguistic: '写宣传文案吸引顾客', role_logical: '管理收支账目和找零', role_interpersonal: '负责接待和说服顾客购买', role_naturalist: '售卖自己种的多肉植物' } },
  { variantId: 'V03', params: { activity: '校园文化周', role_spatial: '绘制活动海报和路线图', role_linguistic: '采访参与者写一篇报道', role_logical: '统计各项活动的参与人数', role_interpersonal: '组织跨班级的合作表演', role_naturalist: '带领同学做校园生态调查' } },
  { variantId: 'V04', params: { activity: '班级毕业纪念册制作', role_spatial: '负责排版设计和照片编辑', role_linguistic: '为每个同学写一段个性化寄语', role_logical: '规划页面分配和制作进度', role_interpersonal: '收集同学们的回忆和感想', role_naturalist: '拍摄校园里最美的自然风景' } },
  { variantId: 'V05', params: { activity: '家庭旅行规划', role_spatial: '画旅行路线图标注景点', role_linguistic: '查攻略整理成旅行手册', role_logical: '计算预算和时间安排', role_interpersonal: '了解每个家人想去哪里协调意见', role_naturalist: '研究目的地的动植物和地形' } },
]

// ========== 大五人格场景变体 ==========

export const BIGFIVE_SCENARIOS: ScenarioVariant[] = [
  { variantId: 'V01', params: { situation: '放学后有两小时自由时间', resp_open: '尝试一个从没做过的新游戏', resp_conscientious: '先把作业做完再玩', resp_extravert: '约几个同学一起出去玩', resp_agreeable: '问家人需不需要帮忙', resp_stable: '按计划做自己之前安排好的事' } },
  { variantId: 'V02', params: { situation: '老师让全班投票决定班级活动', resp_open: '提出一个全新的创意活动方案', resp_conscientious: '仔细考虑每个选项的利弊再投票', resp_extravert: '积极发言为自己喜欢的方案拉票', resp_agreeable: '支持大多数人选的方案', resp_stable: '无论结果如何都觉得没关系' } },
  { variantId: 'V03', params: { situation: '要参加一个陌生人居多的聚会', resp_open: '觉得很兴奋能认识新朋友', resp_conscientious: '提前想好自我介绍的内容', resp_extravert: '主动找人聊天很快融入', resp_agreeable: '观察别人喜欢什么话题然后附和', resp_stable: '虽然有点紧张但能自如应对' } },
  { variantId: 'V04', params: { situation: '发现同桌的作文写得比自己好', resp_open: '好奇地问同桌是怎么写出来的', resp_conscientious: '暗下决心下次一定写得更好', resp_extravert: '大方地夸赞同桌写得好', resp_agreeable: '真心为同桌感到高兴', resp_stable: '觉得各有各的优点不太在意' } },
  { variantId: 'V05', params: { situation: '接到一个自己不太感兴趣的任务', resp_open: '想办法把它变得更有趣', resp_conscientious: '认真完成因为这是自己的责任', resp_extravert: '拉上朋友一起做就不无聊了', resp_agreeable: '既然答应了就好好做', resp_stable: '平静地接受然后开始执行' } },
]

// ========== CHC认知能力场景变体 ==========

export const CHC_SCENARIOS: ScenarioVariant[] = [
  { variantId: 'V01', params: { puzzle: '一个复杂的拼图缺少几块', method_gf: '观察已有拼图的图案规律推测缺失部分', method_gc: '根据盒子上的完整图片找到对应位置', method_mix: '先分析规律再对照参考图', method_try: '一块一块试直到对上', method_skip: '先跳过困难的部分拼简单的' } },
  { variantId: 'V02', params: { puzzle: '数学题需要找到数字规律', method_gf: '观察相邻数字的差值变化规律', method_gc: '回忆老师教过的等差等比公式', method_mix: '先猜一个规律再验证', method_try: '把几个猜测的答案代入看哪个对', method_skip: '先做其他题有时间再回来想' } },
  { variantId: 'V03', params: { puzzle: '一段英文文章有几个生词', method_gf: '通过上下文猜测生词的含义', method_gc: '查字典找到准确的意思', method_mix: '先猜再查字典确认', method_try: '跳过生词看整体能不能理解', method_skip: '把不懂的词都标出来一起问老师' } },
  { variantId: 'V04', params: { puzzle: '一道科学题描述了一个从没见过的现象', method_gf: '根据已知的物理原理推测原因', method_gc: '回忆课本上有没有类似的知识点', method_mix: '先假设一个原因再用排除法验证', method_try: '搜索看看有没有现成的答案', method_skip: '记下来下次问老师' } },
  { variantId: 'V05', params: { puzzle: '需要记住一首很长的古诗', method_gf: '分析诗的结构和韵律找记忆规律', method_gc: '理解每句诗的意思帮助记忆', method_mix: '先理解再找节奏规律反复朗读', method_try: '分段背诵然后拼起来', method_skip: '抄写几遍加深印象' } },
]

// ========== Grit坚毅力场景变体 ==========

export const GRIT_SCENARIOS: ScenarioVariant[] = [
  { variantId: 'V01', params: { challenge: '学习一个很难的新乐器', resp_persist: '虽然手指很痛但每天坚持练习半小时', resp_passion: '越学越觉得有意思想学更多曲子', resp_adjust: '觉得太难了换一种更简单的乐器', resp_pause: '先休息几天再继续', resp_quit: '觉得自己不是学音乐的料就放弃了' } },
  { variantId: 'V02', params: { challenge: '参加长跑训练为运动会做准备', resp_persist: '每天按计划跑完规定的距离', resp_passion: '享受跑步时风吹过脸的感觉', resp_adjust: '跑不动就改走但不停下来', resp_pause: '累了就休息一天明天继续', resp_quit: '跑了两天觉得太累就不练了' } },
  { variantId: 'V03', params: { challenge: '完成一个为期三周的科学项目', resp_persist: '即使遇到困难也按计划每天推进一点', resp_passion: '对项目越来越感兴趣主动查更多资料', resp_adjust: '遇到瓶颈时调整方案但不放弃目标', resp_pause: '做不下去时先去做别的事换换脑子', resp_quit: '觉得太复杂了随便写个交差' } },
  { variantId: 'V04', params: { challenge: '学习一门外语达到能对话的水平', resp_persist: '每天固定时间背单词和练口语', resp_passion: '喜欢看外语电影主动创造语言环境', resp_adjust: '发现方法不对就试新的学习方式', resp_pause: '厌倦了就暂停几天', resp_quit: '觉得太慢了失去耐心不学了' } },
  { variantId: 'V05', params: { challenge: '练习书法想写出好看的字', resp_persist: '每天坚持临帖一页即使进步很慢', resp_passion: '欣赏书法作品越来越能感受到美', resp_adjust: '某种字体太难就先练好基本笔画', resp_pause: '写烦了就暂时做别的', resp_quit: '觉得自己写字天生不好看就放弃了' } },
]

// ========== SEL社会情感场景变体 ==========

export const SEL_SCENARIOS: ScenarioVariant[] = [
  { variantId: 'V01', params: { trigger: '被同学当众指出作业的错误', resp_aware: '意识到自己感到尴尬和不舒服', resp_manage: '深呼吸让自己冷静下来', resp_social: '注意到同学并没有恶意只是直接', resp_relate: '感谢同学帮忙指出然后改正', resp_decide: '想清楚这是好事虽然方式不太好' } },
  { variantId: 'V02', params: { trigger: '好朋友转学要离开了', resp_aware: '感到很伤心和不舍', resp_manage: '虽然难过但告诉自己可以保持联系', resp_social: '理解朋友也同样舍不得', resp_relate: '约好以后经常视频通话', resp_decide: '准备一份特别的告别礼物' } },
  { variantId: 'V03', params: { trigger: '在班上竞选失败了', resp_aware: '承认自己感到失望和沮丧', resp_manage: '不在同学面前表现出太多失望', resp_social: '真诚祝贺当选的同学', resp_relate: '告诉支持自己的人感谢他们', resp_decide: '反思自己可以在哪些方面做得更好' } },
  { variantId: 'V04', params: { trigger: '发现有同学在背后说自己坏话', resp_aware: '感到生气和受伤', resp_manage: '先不冲动想清楚再行动', resp_social: '想想对方为什么会这样说', resp_relate: '找一个合适的时机和对方谈', resp_decide: '决定不以牙还牙而是正面解决' } },
  { variantId: 'V05', params: { trigger: '第一次在很多人面前演讲', resp_aware: '感到紧张手心出汗', resp_manage: '用之前练习的方法调整呼吸', resp_social: '看到台下有朋友在微笑鼓励', resp_relate: '演讲结束后感谢大家的倾听', resp_decide: '告诉自己紧张是正常的勇敢开始就好' } },
]

// ========== EF执行功能场景变体 ==========

export const EF_SCENARIOS: ScenarioVariant[] = [
  { variantId: 'V01', params: { task: '同时要完成数学作业、准备明天的英语演讲和整理书包', method_inhibit: '先忍住想玩手机的冲动', method_switch: '做完数学就切换到准备演讲', method_plan: '列一个优先级清单按重要程度排序', method_monitor: '每做完一项就检查一下质量', method_flexible: '发现时间不够就先做最紧急的' } },
  { variantId: 'V02', params: { task: '上课时窗外有很好看的风景不断分散注意力', method_inhibit: '告诉自己先专心听课下课再看', method_switch: '偶尔瞥一眼然后把注意力拉回来', method_plan: '选一个背对窗户的座位', method_monitor: '发现走神就在笔记上做个标记提醒自己', method_flexible: '课间出去看个够这样上课就不惦记了' } },
  { variantId: 'V03', params: { task: '正在做一道很难的题突然想起还有一件事没做', method_inhibit: '先把这道题做完再处理那件事', method_switch: '在本子上记下那件事然后回到这道题', method_plan: '设一个提醒闹钟待会处理', method_monitor: '告诉自己一次只做一件事', method_flexible: '如果那件事很紧急就先去处理' } },
  { variantId: 'V04', params: { task: '做科学实验的步骤很多需要按顺序完成', method_inhibit: '忍住想跳过步骤直接看结果的冲动', method_switch: '完成一步就在清单上打勾进入下一步', method_plan: '先把所有步骤读一遍理清顺序', method_monitor: '每一步做完都检查是否正确再继续', method_flexible: '发现某一步做不了就先想替代方案' } },
]

// ========== 导出统一接口 ==========

export const ALL_SCENARIO_BANKS: Record<string, ScenarioVariant[]> = {
  curiosity: CURIOSITY_SCENARIOS,
  inquiry: INQUIRY_SCENARIOS,
  connection: CONNECTION_SCENARIOS,
  design: DESIGN_SCENARIOS,
  expression: EXPRESSION_SCENARIOS,
  reflection: REFLECTION_SCENARIOS,
  mi: MI_SCENARIOS,
  bigfive: BIGFIVE_SCENARIOS,
  chc: CHC_SCENARIOS,
  grit: GRIT_SCENARIOS,
  sel: SEL_SCENARIOS,
  ef: EF_SCENARIOS,
}
