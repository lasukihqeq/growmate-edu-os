// ===================================================================
// 扩展题目批量生成器 v1.0
// 为每个 模型×年龄组 生成大量高质量扩展题目
// 这些题目基于心理学理论的维度定义和评分标准编写
// 总产出目标：~7500 道扩展题
// ===================================================================

import type { UnifiedQuestion, QuestionChunkMeta, AgeGroupKey, QuestionModel } from './types'

// ========== 题目生成工具 ==========

/** 创建选择题 */
function choice(
  id: string, ageGroup: AgeGroupKey, model: QuestionModel,
  text: string, dimension: string, wilderMapping: string[],
  options: { id: string; text: string; scores: Record<string, number> }[],
  extra?: { scenario?: string; difficulty?: 1|2|3|4|5; tags?: string[]; layer2Tags?: string[] }
): UnifiedQuestion {
  return {
    id, type: 'choice', text, model, dimension, wilderMapping, ageGroup,
    options,
    scenario: extra?.scenario,
    layer2Tags: extra?.layer2Tags,
    difficulty: extra?.difficulty || 3,
    discrimination: 0.55,
    source: 'expanded',
    tags: extra?.tags || [model, dimension],
  }
}

/** 创建判断题 */
function judgment(
  id: string, ageGroup: AgeGroupKey, model: QuestionModel,
  text: string, dimension: string, wilderMapping: string[],
  correctAnswer: boolean,
  scores: { yes: Record<string, number>; no: Record<string, number> },
  extra?: { scenario?: string; difficulty?: 1|2|3|4|5; tags?: string[] }
): UnifiedQuestion {
  return {
    id, type: 'judgment', text, model, dimension, wilderMapping, ageGroup,
    correctAnswer, scores,
    scenario: extra?.scenario,
    difficulty: extra?.difficulty || 3,
    discrimination: 0.5,
    source: 'expanded',
    tags: extra?.tags || [model, dimension],
  }
}

// ========== MI 多元智能扩展题 ==========

function generateMIQuestions(ag: AgeGroupKey): UnifiedQuestion[] {
  const qs: UnifiedQuestion[] = []
  const dims = [
    { dim: 'linguistic', wm: ['E', 'L'], name: '语言智能' },
    { dim: 'logicalMath', wm: ['I', 'D'], name: '逻辑数学智能' },
    { dim: 'spatial', wm: ['D', 'W'], name: '空间智能' },
    { dim: 'musical', wm: ['E', 'R'], name: '音乐智能' },
    { dim: 'bodilyKinesthetic', wm: ['D', 'I'], name: '身体动觉智能' },
    { dim: 'interpersonal', wm: ['L', 'E'], name: '人际智能' },
    { dim: 'intrapersonal', wm: ['R', 'W'], name: '内省智能' },
    { dim: 'naturalist', wm: ['W', 'I'], name: '自然观察智能' },
  ]

  const scenarioSets: Record<AgeGroupKey, { prefix: string; contexts: string[] }> = {
    'preschool': { prefix: 'PS-MI', contexts: ['在幼儿园里', '和小朋友一起', '在家里玩的时候'] },
    'lower-primary': { prefix: 'LP-MI', contexts: ['在学校课间', '放学后和朋友', '周末在家'] },
    'upper-primary': { prefix: 'UP-MI', contexts: ['在兴趣小组中', '学校活动中', '和同学一起'] },
    'middle-school': { prefix: 'MS-MI', contexts: ['在社团活动中', '和同学合作时', '假期中'] },
    'high-school': { prefix: 'HS-MI', contexts: ['准备学科竞赛时', '社会实践中', '未来规划时'] },
  }

  const { prefix, contexts } = scenarioSets[ag]
  let idx = 1

  for (const d of dims) {
    // 每个MI维度生成多道选择题
    for (let i = 0; i < 4; i++) {
      const ctx = contexts[i % contexts.length]
      qs.push(choice(
        `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'MI',
        generateMIChoiceText(d.dim, d.name, ag, i),
        d.name, d.wm,
        generateMIOptions(d.dim, d.wm, i),
        { scenario: ctx, difficulty: (Math.min(5, 2 + Math.floor(i / 2))) as 1|2|3|4|5, tags: ['MI', d.name] }
      ))
      idx++
    }

    // 每个MI维度生成判断题: v0正向(correct=true), v1反向(correct=false)
    for (let i = 0; i < 2; i++) {
      const isPositive = i === 0
      qs.push(judgment(
        `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'MI',
        generateMIJudgmentText(d.dim, d.name, ag, i),
        d.name, d.wm,
        isPositive,
        {
          yes: isPositive ? { [d.dim]: 2, [d.wm[0]]: 2 } : { [d.dim]: 0, [d.wm[0]]: 0 },
          no: isPositive ? { [d.dim]: 0, [d.wm[0]]: 0 } : { [d.dim]: 2, [d.wm[0]]: 2 },
        },
        { difficulty: 2, tags: ['MI', d.name, 'judgment'] }
      ))
      idx++
    }
  }

  return qs
}

function generateMIChoiceText(dim: string, name: string, _ag: AgeGroupKey, variant: number): string {
  const texts: Record<string, string[]> = {
    linguistic: [
      '如果让你选一种方式表达对一本好书的感受，你会选择？',
      '班上要做一份报纸，你最想负责哪个版块？',
      '如果要记录一次旅行的故事，你会怎么做？',
      '有一个重要的消息需要传达给全班，你会怎么做？',
    ],
    logicalMath: [
      '遇到一道很有趣的数学难题，你会怎么做？',
      '家里有一个坏掉的电子钟，你会怎么处理？',
      '发现超市里一个商品的标价好像有问题，你会？',
      '如果让你设计一个游戏的计分规则，你会注重什么？',
    ],
    spatial: [
      '如果要重新布置你的房间，你会怎么开始？',
      '学校组织搭建模型比赛，你会怎么准备？',
      '需要给同学指路，你最习惯用什么方式？',
      '如果要设计一个班级图书角，你会怎么做？',
    ],
    musical: [
      '听到一首很喜欢的新歌，你最想做什么？',
      '在安静的环境中你更喜欢做什么？',
      '如果要给一部短片配背景音乐，你觉得最重要的是？',
      '走在路上听到远处传来音乐声，你会？',
    ],
    bodilyKinesthetic: [
      '学习一个新的手工技能（比如折纸或编织），你的方式是？',
      '上体育课学新动作，你更倾向哪种方式？',
      '如果有一个机器人需要组装，你会怎么做？',
      '需要用肢体表达一个概念（比如"春天"），你会？',
    ],
    interpersonal: [
      '发现一个同学好几天都闷闷不乐，你会怎么做？',
      '小组里有两个人意见不同，你会怎么做？',
      '新学期第一天想认识新同学，你通常会？',
      '朋友向你诉说烦恼的时候，你觉得最重要的是？',
    ],
    intrapersonal: [
      '一天结束时，你最常思考的问题是？',
      '取得了一个好成绩之后，你的第一反应是？',
      '当你感到迷茫不知道该怎么做时，你通常会？',
      '如果要写一篇"我是谁"的文章，你会重点写什么？',
    ],
    naturalist: [
      '在户外看到一棵不认识的树，你会怎么做？',
      '如果有机会参加一个野外考察活动，你最感兴趣的是？',
      '天气突然变化了（比如突然打雷），你会？',
      '在菜市场看到各种蔬菜水果，你会注意什么？',
    ],
  }
  return texts[dim]?.[variant] || `关于${name}的问题${variant + 1}`
}

function generateMIOptions(dim: string, wm: string[], variant: number): { id: string; text: string; scores: Record<string, number> }[] {
  // 每个维度+变体都有场景专属选项，避免通用模板导致的交叉关联
  const optionBank: Record<string, { id: string; text: string; scores: Record<string, number> }[][]> = {
    linguistic: [
      // v0: 如果让你选一种方式表达对一本好书的感受
      [
        { id: 'a', text: '写一篇读后感或书评分享出去', scores: { linguistic: 3, [wm[0]]: 2 } },
        { id: 'b', text: '跟朋友详细地讲述书里的故事', scores: { linguistic: 2, [wm[0]]: 1 } },
        { id: 'c', text: '在书上做标注，摘抄喜欢的句子', scores: { linguistic: 2 } },
        { id: 'd', text: '心里想想就好，不太需要表达', scores: { linguistic: 1 } },
        { id: 'e', text: '不太看书，没什么感受', scores: { linguistic: 0 } },
      ],
      // v1: 班上要做一份报纸
      [
        { id: 'a', text: '撰写主编卷首语或深度专题报道', scores: { linguistic: 3, [wm[0]]: 2 } },
        { id: 'b', text: '负责采访同学并写成新闻稿', scores: { linguistic: 3, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '写一些小笑话、诗歌或趣味栏目', scores: { linguistic: 2 } },
        { id: 'd', text: '帮忙校对错别字和语句', scores: { linguistic: 1 } },
        { id: 'e', text: '不太想参与文字相关的工作', scores: { linguistic: 0 } },
      ],
      // v2: 如果要记录一次旅行
      [
        { id: 'a', text: '写一篇图文并茂的游记', scores: { linguistic: 3, [wm[0]]: 2 } },
        { id: 'b', text: '每天记下流水账和有趣的见闻', scores: { linguistic: 2 } },
        { id: 'c', text: '给景点写简短的描述标注', scores: { linguistic: 1 } },
        { id: 'd', text: '主要靠拍照和录视频记录', scores: { linguistic: 0 } },
        { id: 'e', text: '不太会主动记录', scores: { linguistic: 0 } },
      ],
      // v3: 有重要消息需要传达
      [
        { id: 'a', text: '当众做一个清晰完整的口头说明', scores: { linguistic: 3, [wm[0]]: 2 } },
        { id: 'b', text: '写一份通知贴在公告栏', scores: { linguistic: 2 } },
        { id: 'c', text: '编辑一条详细的群消息', scores: { linguistic: 2 } },
        { id: 'd', text: '告诉一个同学让他帮忙传话', scores: { linguistic: 1 } },
        { id: 'e', text: '觉得别人应该自己去了解', scores: { linguistic: 0 } },
      ],
    ],
    logicalMath: [
      // v0: 遇到一道数学难题
      [
        { id: 'a', text: '兴奋地尝试用不同方法求解', scores: { logicalMath: 3, [wm[0]]: 2 } },
        { id: 'b', text: '按照学过的公式一步步推理', scores: { logicalMath: 2, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '看看答案解析再理解思路', scores: { logicalMath: 1 } },
        { id: 'd', text: '跳过难题做别的', scores: { logicalMath: 0 } },
        { id: 'e', text: '数学难题让我很头疼', scores: { logicalMath: 0 } },
      ],
      // v1: 坏掉的电子钟
      [
        { id: 'a', text: '拆开研究哪个零件出了问题', scores: { logicalMath: 3, [wm[0]]: 2 } },
        { id: 'b', text: '查说明书按故障排查步骤检查', scores: { logicalMath: 2, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '试着重启或换电池看看', scores: { logicalMath: 1 } },
        { id: 'd', text: '请大人帮忙修理', scores: { logicalMath: 0 } },
        { id: 'e', text: '直接换一个新的', scores: { logicalMath: 0 } },
      ],
      // v2: 超市标价问题
      [
        { id: 'a', text: '心算验证价格是否合理', scores: { logicalMath: 3, [wm[0]]: 2 } },
        { id: 'b', text: '对比同类商品价格推断是否标错', scores: { logicalMath: 2 } },
        { id: 'c', text: '扫一下看看电子价签怎么显示的', scores: { logicalMath: 1 } },
        { id: 'd', text: '问店员确认一下', scores: { logicalMath: 0 } },
        { id: 'e', text: '没注意过价格', scores: { logicalMath: 0 } },
      ],
      // v3: 设计游戏计分规则
      [
        { id: 'a', text: '用公式和权重让计分公平且有区分度', scores: { logicalMath: 3, [wm[0]]: 2 } },
        { id: 'b', text: '设置多级分数和加减分条件', scores: { logicalMath: 2, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '简单的赢了加分输了减分', scores: { logicalMath: 1 } },
        { id: 'd', text: '参考别的游戏的规则', scores: { logicalMath: 0 } },
        { id: 'e', text: '觉得计分规则无所谓', scores: { logicalMath: 0 } },
      ],
    ],
    spatial: [
      // v0: 重新布置房间
      [
        { id: 'a', text: '先在脑中或纸上画出平面布局图', scores: { spatial: 3, [wm[0]]: 2 } },
        { id: 'b', text: '量好家具尺寸再规划摆放位置', scores: { spatial: 2, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '看看家居杂志找灵感', scores: { spatial: 1 } },
        { id: 'd', text: '直接搬搬看，不满意再调', scores: { spatial: 1 } },
        { id: 'e', text: '不太在意房间怎么布置', scores: { spatial: 0 } },
      ],
      // v1: 搭建模型比赛
      [
        { id: 'a', text: '先画三视图设计稿再动手', scores: { spatial: 3, [wm[0]]: 2 } },
        { id: 'b', text: '在脑海中构想立体形状再搭建', scores: { spatial: 3, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '边看参考图边搭建', scores: { spatial: 2 } },
        { id: 'd', text: '跟着教程一步步来', scores: { spatial: 1 } },
        { id: 'e', text: '对搭建模型没什么兴趣', scores: { spatial: 0 } },
      ],
      // v2: 给同学指路
      [
        { id: 'a', text: '画一张简笔地图标注路线', scores: { spatial: 3, [wm[0]]: 2 } },
        { id: 'b', text: '用"左转右转"加方位详细描述', scores: { spatial: 2 } },
        { id: 'c', text: '告诉大概方向和标志物', scores: { spatial: 1 } },
        { id: 'd', text: '直接带他走过去', scores: { spatial: 0 } },
        { id: 'e', text: '自己也经常迷路', scores: { spatial: 0 } },
      ],
      // v3: 设计班级图书角
      [
        { id: 'a', text: '画出详细的空间利用设计图', scores: { spatial: 3, [wm[0]]: 2 } },
        { id: 'b', text: '构思整体风格和各区域功能分布', scores: { spatial: 2, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '搜集别人的设计方案参考', scores: { spatial: 1 } },
        { id: 'd', text: '把书分类摆好就行', scores: { spatial: 0 } },
        { id: 'e', text: '不太关心空间设计', scores: { spatial: 0 } },
      ],
    ],
    musical: [
      // v0: 听到一首很喜欢的新歌
      [
        { id: 'a', text: '试着用乐器或哼唱把旋律学会', scores: { musical: 3, [wm[0]]: 2 } },
        { id: 'b', text: '反复听，关注编曲和节奏变化', scores: { musical: 3, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '记住歌词和调子，平时跟着唱', scores: { musical: 2 } },
        { id: 'd', text: '加入播放列表偶尔听一下', scores: { musical: 1 } },
        { id: 'e', text: '听歌对我来说无所谓', scores: { musical: 0 } },
      ],
      // v1: 安静的环境中
      [
        { id: 'a', text: '听音乐或自己创作旋律', scores: { musical: 3, [wm[0]]: 2 } },
        { id: 'b', text: '随意哼歌或打节拍', scores: { musical: 2 } },
        { id: 'c', text: '脑子里会自动响起某段音乐', scores: { musical: 2, [wm[1] || wm[0]]: 1 } },
        { id: 'd', text: '享受安静，不需要音乐', scores: { musical: 0 } },
        { id: 'e', text: '看书、画画或做别的事', scores: { musical: 0 } },
      ],
      // v2: 给短片配音乐
      [
        { id: 'a', text: '根据画面情绪精确选择匹配的音乐', scores: { musical: 3, [wm[0]]: 2 } },
        { id: 'b', text: '自己尝试创作一段简单的配乐', scores: { musical: 3, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '凭感觉从音乐库里挑选', scores: { musical: 2 } },
        { id: 'd', text: '随便配一首流行歌曲', scores: { musical: 1 } },
        { id: 'e', text: '觉得有没有音乐差别不大', scores: { musical: 0 } },
      ],
      // v3: 远处传来音乐声
      [
        { id: 'a', text: '仔细辨别是什么乐器、什么曲子', scores: { musical: 3, [wm[0]]: 2 } },
        { id: 'b', text: '不自觉地跟着节拍走路', scores: { musical: 2 } },
        { id: 'c', text: '会停下来听一会儿', scores: { musical: 1 } },
        { id: 'd', text: '注意到了但不太在意', scores: { musical: 0 } },
        { id: 'e', text: '基本不会注意到', scores: { musical: 0 } },
      ],
    ],
    bodilyKinesthetic: [
      // v0: 学习新手工技能
      [
        { id: 'a', text: '直接上手试，边做边摸索技巧', scores: { bodilyKinesthetic: 3, [wm[0]]: 2 } },
        { id: 'b', text: '看一遍示范后就能模仿得不错', scores: { bodilyKinesthetic: 3, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '需要反复练习好几次才能学会', scores: { bodilyKinesthetic: 2 } },
        { id: 'd', text: '先看文字教程再慢慢学', scores: { bodilyKinesthetic: 1 } },
        { id: 'e', text: '手工类的东西不太擅长', scores: { bodilyKinesthetic: 0 } },
      ],
      // v1: 上体育课学新动作
      [
        { id: 'a', text: '看一遍老师示范就能跟着做', scores: { bodilyKinesthetic: 3, [wm[0]]: 2 } },
        { id: 'b', text: '需要多练几次，但能掌握动作要领', scores: { bodilyKinesthetic: 2 } },
        { id: 'c', text: '模仿动作可以，但协调性一般', scores: { bodilyKinesthetic: 1 } },
        { id: 'd', text: '更喜欢自由活动而不是学规范动作', scores: { bodilyKinesthetic: 1 } },
        { id: 'e', text: '不太喜欢体育运动', scores: { bodilyKinesthetic: 0 } },
      ],
      // v2: 组装机器人
      [
        { id: 'a', text: '凭直觉和手感快速拼装各部件', scores: { bodilyKinesthetic: 3, [wm[0]]: 2 } },
        { id: 'b', text: '仔细对照说明书一步步精确安装', scores: { bodilyKinesthetic: 2, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '大概组装起来再调整', scores: { bodilyKinesthetic: 2 } },
        { id: 'd', text: '看别人怎么装的再跟着做', scores: { bodilyKinesthetic: 1 } },
        { id: 'e', text: '动手操作类活动不太感兴趣', scores: { bodilyKinesthetic: 0 } },
      ],
      // v3: 用肢体表达概念
      [
        { id: 'a', text: '能自然地用动作和姿态生动表达', scores: { bodilyKinesthetic: 3, [wm[0]]: 2 } },
        { id: 'b', text: '经过简单排练可以表演出来', scores: { bodilyKinesthetic: 2 } },
        { id: 'c', text: '只能做一些简单比划', scores: { bodilyKinesthetic: 1 } },
        { id: 'd', text: '更习惯用语言描述而非肢体', scores: { bodilyKinesthetic: 0 } },
        { id: 'e', text: '用肢体表达让我很不自在', scores: { bodilyKinesthetic: 0 } },
      ],
    ],
    interpersonal: [
      // v0: 同学闷闷不乐
      [
        { id: 'a', text: '主动找他聊天，了解发生了什么', scores: { interpersonal: 3, [wm[0]]: 2 } },
        { id: 'b', text: '默默陪伴在旁边，等他想说时再听', scores: { interpersonal: 2, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '告诉老师或他的好朋友留意一下', scores: { interpersonal: 1 } },
        { id: 'd', text: '觉得是他自己的事，不太会主动关心', scores: { interpersonal: 0 } },
        { id: 'e', text: '没有特别注意到', scores: { interpersonal: 0 } },
      ],
      // v1: 两个人意见不同
      [
        { id: 'a', text: '帮双方梳理分歧点，促成共识', scores: { interpersonal: 3, [wm[0]]: 2 } },
        { id: 'b', text: '分别听取两方想法，找到折中方案', scores: { interpersonal: 3, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '建议大家投票决定', scores: { interpersonal: 2 } },
        { id: 'd', text: '觉得争论浪费时间，自己做好自己的', scores: { interpersonal: 0 } },
        { id: 'e', text: '不太想参与', scores: { interpersonal: 0 } },
      ],
      // v2: 认识新同学
      [
        { id: 'a', text: '主动自我介绍并询问对方兴趣', scores: { interpersonal: 3, [wm[0]]: 2 } },
        { id: 'b', text: '找机会在活动中自然地搭话', scores: { interpersonal: 2 } },
        { id: 'c', text: '等别人先来找自己', scores: { interpersonal: 1 } },
        { id: 'd', text: '觉得慢慢熟悉就好，不急于社交', scores: { interpersonal: 0 } },
        { id: 'e', text: '不太喜欢认识新朋友', scores: { interpersonal: 0 } },
      ],
      // v3: 朋友诉说烦恼
      [
        { id: 'a', text: '认真倾听并试着理解他的感受', scores: { interpersonal: 3, [wm[0]]: 2 } },
        { id: 'b', text: '帮他分析问题并给出建议', scores: { interpersonal: 2, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '安慰他说"会好起来的"', scores: { interpersonal: 1 } },
        { id: 'd', text: '不太知道该说什么', scores: { interpersonal: 0 } },
        { id: 'e', text: '觉得每个人应该自己处理情绪', scores: { interpersonal: 0 } },
      ],
    ],
    intrapersonal: [
      // v0: 一天结束时最常思考的
      [
        { id: 'a', text: '今天哪些做得好、哪些可以改进', scores: { intrapersonal: 3, [wm[0]]: 2 } },
        { id: 'b', text: '自己的感受和情绪变化', scores: { intrapersonal: 2, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '明天要做什么', scores: { intrapersonal: 1 } },
        { id: 'd', text: '今天发生的有趣的事', scores: { intrapersonal: 1 } },
        { id: 'e', text: '一般不会特别去想什么', scores: { intrapersonal: 0 } },
      ],
      // v1: 取得好成绩后
      [
        { id: 'a', text: '分析是什么因素让自己成功', scores: { intrapersonal: 3, [wm[0]]: 2 } },
        { id: 'b', text: '心里很开心但不太向外表露', scores: { intrapersonal: 2 } },
        { id: 'c', text: '觉得是运气好或题目简单', scores: { intrapersonal: 1 } },
        { id: 'd', text: '赶紧告诉朋友和家人', scores: { intrapersonal: 0 } },
        { id: 'e', text: '不太在意成绩高低', scores: { intrapersonal: 0 } },
      ],
      // v2: 感到迷茫时
      [
        { id: 'a', text: '安静独处，仔细整理内心想法', scores: { intrapersonal: 3, [wm[0]]: 2 } },
        { id: 'b', text: '写日记或画画帮助自己理清思路', scores: { intrapersonal: 3, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '找人聊聊听听别人怎么看', scores: { intrapersonal: 1 } },
        { id: 'd', text: '做些喜欢的事转移注意力', scores: { intrapersonal: 0 } },
        { id: 'e', text: '不太会主动去理清', scores: { intrapersonal: 0 } },
      ],
      // v3: 写"我是谁"
      [
        { id: 'a', text: '深入剖析自己的性格特点和价值观', scores: { intrapersonal: 3, [wm[0]]: 2 } },
        { id: 'b', text: '分析自己的优缺点和成长变化', scores: { intrapersonal: 2, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '描述自己的兴趣爱好和日常生活', scores: { intrapersonal: 1 } },
        { id: 'd', text: '列举基本信息和外在标签', scores: { intrapersonal: 0 } },
        { id: 'e', text: '不太知道怎么描述自己', scores: { intrapersonal: 0 } },
      ],
    ],
    naturalist: [
      // v0: 不认识的树
      [
        { id: 'a', text: '仔细观察叶子、树皮的特征然后查资料辨认', scores: { naturalist: 3, [wm[0]]: 2 } },
        { id: 'b', text: '拍照或画下来，以后慢慢了解', scores: { naturalist: 2, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '看一眼觉得挺好看就继续走了', scores: { naturalist: 1 } },
        { id: 'd', text: '不太会注意路边的植物', scores: { naturalist: 0 } },
        { id: 'e', text: '对植物没什么兴趣', scores: { naturalist: 0 } },
      ],
      // v1: 野外考察
      [
        { id: 'a', text: '采集标本、观察记录生物和地质现象', scores: { naturalist: 3, [wm[0]]: 2 } },
        { id: 'b', text: '用放大镜仔细观察微小的生物', scores: { naturalist: 3, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '欣赏风景拍照打卡', scores: { naturalist: 1 } },
        { id: 'd', text: '和朋友一起玩户外游戏', scores: { naturalist: 0 } },
        { id: 'e', text: '不太喜欢户外活动', scores: { naturalist: 0 } },
      ],
      // v2: 天气突然变化
      [
        { id: 'a', text: '观察云层、风向变化并猜测接下来天气如何', scores: { naturalist: 3, [wm[0]]: 2 } },
        { id: 'b', text: '想起相关的气象知识去解释这个现象', scores: { naturalist: 2, [wm[1] || wm[0]]: 1 } },
        { id: 'c', text: '赶紧找地方躲避', scores: { naturalist: 0 } },
        { id: 'd', text: '觉得天气变化很正常没什么特别', scores: { naturalist: 0 } },
        { id: 'e', text: '不太关注天气', scores: { naturalist: 0 } },
      ],
      // v3: 菜市场蔬果
      [
        { id: 'a', text: '对比不同品种的差异，好奇它们的产地和生长环境', scores: { naturalist: 3, [wm[0]]: 2 } },
        { id: 'b', text: '注意哪些是应季的、哪些反季节', scores: { naturalist: 2 } },
        { id: 'c', text: '挑选新鲜好看的', scores: { naturalist: 1 } },
        { id: 'd', text: '买需要的东西就走', scores: { naturalist: 0 } },
        { id: 'e', text: '不太逛菜市场', scores: { naturalist: 0 } },
      ],
    ],
  }

  const dimOptions = optionBank[dim]
  if (dimOptions && dimOptions[variant % dimOptions.length]) {
    return dimOptions[variant % dimOptions.length]
  }
  // 极端兜底：不应走到这里
  return [
    { id: 'a', text: '非常感兴趣，会深入了解', scores: { [dim]: 3, [wm[0]]: 1 } },
    { id: 'b', text: '有一定兴趣', scores: { [dim]: 2 } },
    { id: 'c', text: '看情况', scores: { [dim]: 1 } },
    { id: 'd', text: '兴趣不大', scores: { [dim]: 0 } },
    { id: 'e', text: '不感兴趣', scores: { [dim]: 0 } },
  ]
}

function generateMIJudgmentText(dim: string, name: string, _ag: AgeGroupKey, variant: number): string {
  // v0 = 正向题 (correct=true), v1 = 反向题 (correct=false)
  const texts: Record<string, string[]> = {
    linguistic: ['善于用文字表达自己想法的人通常也善于和别人沟通。', '不爱说话的人语言能力一定很差。'],
    logicalMath: ['发现事物之间的规律是一种重要的思维能力。', '数学只有唯一正确的解题方法。'],
    spatial: ['有的人看地图比看文字说明更容易理解路线。', '画画好的人一定空间感也好。'],
    musical: ['音乐可以帮助人们表达文字难以表达的情感。', '每个人对同一首音乐的感受都是一样的。'],
    bodilyKinesthetic: ['有些知识通过动手操作比看书更容易理解。', '学习成绩好的人运动能力一定差。'],
    interpersonal: ['善于理解他人感受的人通常也擅长团队合作。', '领导力就是让别人听自己的话。'],
    intrapersonal: ['了解自己的优点和缺点有助于做出更好的选择。', '花时间独处思考是浪费时间的表现。'],
    naturalist: ['仔细观察自然界的变化有助于培养科学思维。', '只有科学家才需要观察自然现象。'],
  }
  return texts[dim]?.[variant] || `${name}对个人成长很重要。`
}

// ========== BigFive 大五人格扩展题 ==========

function generateBigFiveQuestions(ag: AgeGroupKey): UnifiedQuestion[] {
  const qs: UnifiedQuestion[] = []
  const dims = [
    { dim: 'O', wm: ['W', 'I'], name: '开放性' },
    { dim: 'C', wm: ['D', 'R'], name: '尽责性' },
    { dim: 'E', wm: ['L', 'E'], name: '外向性' },
    { dim: 'A', wm: ['L', 'R'], name: '宜人性' },
    { dim: 'N', wm: ['R'], name: '情绪稳定性' },
  ]

  const prefix = `${ag.split('-').map(w => w[0]).join('').toUpperCase()}-BF`
  let idx = 1

  for (const d of dims) {
    for (let i = 0; i < 5; i++) {
      qs.push(choice(
        `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'BigFive',
        generateBFChoiceText(d.dim, d.name, ag, i),
        d.name, d.wm,
        generateBFOptions(d.dim, d.wm, i),
        { difficulty: (Math.min(5, 2 + Math.floor(i / 2))) as 1|2|3|4|5, tags: ['BigFive', d.name] }
      ))
      idx++
    }
    for (let i = 0; i < 3; i++) {
      const isPositive = i < 2
      qs.push(judgment(
        `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'BigFive',
        generateBFJudgmentText(d.dim, d.name, ag, i),
        d.name, d.wm,
        isPositive,
        {
          yes: isPositive ? { [d.dim]: 2, [d.wm[0]]: 1 } : { [d.dim]: 0 },
          no: isPositive ? { [d.dim]: 0 } : { [d.dim]: 2, [d.wm[0]]: 1 },
        },
        { difficulty: 2, tags: ['BigFive', d.name, 'judgment'] }
      ))
      idx++
    }
  }

  return qs
}

function generateBFChoiceText(dim: string, name: string, _ag: AgeGroupKey, variant: number): string {
  const texts: Record<string, string[]> = {
    O: ['周末有机会尝试一个全新的活动，你的反应是？', '老师介绍了一种你从没听过的学习方法，你会？', '如果可以到一个完全陌生的地方生活一个月，你觉得？', '遇到一个和你观点完全不同的人，你会？', '有人送你一本关于你不了解的领域的书，你会？'],
    C: ['有一份为期一周的作业需要完成，你通常怎么做？', '你的书桌通常是什么样子？', '答应别人的事情你通常怎么处理？', '临近考试，你的复习策略是？', '有三件事需要在今天完成，你会怎么安排？'],
    E: ['参加一个大部分是陌生人的聚会，你的感受是？', '一个人待着和一群人在一起，你更喜欢哪种？', '课堂上老师提了一个问题你知道答案，你会？', '需要在公共场合发表意见，你的反应是？', '周末两天你会怎么安排社交活动？'],
    A: ['同学不小心弄坏了你的东西，你会怎么做？', '小组投票结果和你的想法不一样，你会？', '看到有人在公共场合需要帮助，你通常会？', '好朋友犯了一个明显的错误，你会？', '别人夸奖你的时候，你通常的反应是？'],
    N: ['考试成绩公布前的那段时间，你通常感觉怎样？', '遇到一个自己解决不了的难题，你的心态是？', '被老师当众批评了，你事后会怎样？', '重要的比赛或表演前，你通常的状态是？', '和朋友产生矛盾后你的心情多久能恢复？'],
  }
  return texts[dim]?.[variant] || `关于${name}的问题${variant + 1}`
}

function generateBFOptions(dim: string, _wm: string[], variant: number): { id: string; text: string; scores: Record<string, number> }[] {
  const optionSets: Record<string, { id: string; text: string; scores: Record<string, number> }[][]> = {
    O: [
      // v0: 尝试全新活动
      [
        { id: 'a', text: '非常期待，迫不及待想试试', scores: { O: 3, W: 2 } },
        { id: 'b', text: '有点好奇，愿意了解一下', scores: { O: 2, W: 1 } },
        { id: 'c', text: '看看再说，如果有意思就参加', scores: { O: 1 } },
        { id: 'd', text: '更喜欢做自己熟悉的活动', scores: { O: 0 } },
        { id: 'e', text: '不太想参加未知的活动', scores: { O: 0 } },
      ],
      // v1: 新学习方法
      [
        { id: 'a', text: '立刻想试试看有没有效果', scores: { O: 3, I: 1 } },
        { id: 'b', text: '先了解原理再决定要不要尝试', scores: { O: 2, I: 1 } },
        { id: 'c', text: '看别人用了效果怎样再说', scores: { O: 1 } },
        { id: 'd', text: '觉得现在的方法挺好不需要换', scores: { O: 0 } },
        { id: 'e', text: '不太信任新方法', scores: { O: 0 } },
      ],
      // v2: 陌生地方生活一个月
      [
        { id: 'a', text: '太棒了，正好体验不同的生活方式', scores: { O: 3, W: 2 } },
        { id: 'b', text: '有点忐忑但更多是期待', scores: { O: 2 } },
        { id: 'c', text: '如果有人一起去就愿意', scores: { O: 1 } },
        { id: 'd', text: '不太想离开熟悉的环境', scores: { O: 0 } },
        { id: 'e', text: '完全不想去陌生的地方', scores: { O: 0 } },
      ],
      // v3: 观点完全不同的人
      [
        { id: 'a', text: '很好奇他为什么这么想，想深入了解', scores: { O: 3, W: 1 } },
        { id: 'b', text: '愿意听听看，也许能开阔视野', scores: { O: 2 } },
        { id: 'c', text: '礼貌地听完但保留自己的看法', scores: { O: 1 } },
        { id: 'd', text: '觉得对方的观点不对', scores: { O: 0 } },
        { id: 'e', text: '不太想跟观点不同的人交流', scores: { O: 0 } },
      ],
      // v4: 不了解领域的书
      [
        { id: 'a', text: '太好了，正好可以拓展知识面', scores: { O: 3, W: 1 } },
        { id: 'b', text: '翻翻看，如果有意思就读下去', scores: { O: 2 } },
        { id: 'c', text: '放在一边有空了再看', scores: { O: 1 } },
        { id: 'd', text: '更想要自己感兴趣领域的书', scores: { O: 0 } },
        { id: 'e', text: '不太会去读不了解的领域', scores: { O: 0 } },
      ],
    ],
    C: [
      // v0: 一周的作业
      [
        { id: 'a', text: '第一天就开始制定计划逐步完成', scores: { C: 3, D: 2 } },
        { id: 'b', text: '前几天先想想怎么做然后集中完成', scores: { C: 2, D: 1 } },
        { id: 'c', text: '中间找个时间一口气做完', scores: { C: 1 } },
        { id: 'd', text: '差不多到截止日期前赶工', scores: { C: 0 } },
        { id: 'e', text: '经常忘记直到被提醒', scores: { C: 0 } },
      ],
      // v1: 书桌状态
      [
        { id: 'a', text: '整整齐齐，每样东西都有固定位置', scores: { C: 3, D: 1 } },
        { id: 'b', text: '大体整洁，偶尔有点乱', scores: { C: 2 } },
        { id: 'c', text: '用的时候整理，平时有点杂', scores: { C: 1 } },
        { id: 'd', text: '比较乱但自己能找到东西', scores: { C: 0 } },
        { id: 'e', text: '很乱，经常找不到东西', scores: { C: 0 } },
      ],
      // v2: 答应别人的事情
      [
        { id: 'a', text: '一定会按时高质量完成', scores: { C: 3, D: 1 } },
        { id: 'b', text: '尽力完成，有困难会提前说', scores: { C: 2 } },
        { id: 'c', text: '会做但可能不太及时', scores: { C: 1 } },
        { id: 'd', text: '有时候会忘记', scores: { C: 0 } },
        { id: 'e', text: '经常答应了却做不到', scores: { C: 0 } },
      ],
      // v3: 考试复习策略
      [
        { id: 'a', text: '提前两周制定复习计划按科目推进', scores: { C: 3, D: 2 } },
        { id: 'b', text: '提前几天集中复习重点内容', scores: { C: 2 } },
        { id: 'c', text: '考前一天突击', scores: { C: 1 } },
        { id: 'd', text: '随便看看就上考场', scores: { C: 0 } },
        { id: 'e', text: '不太复习', scores: { C: 0 } },
      ],
      // v4: 三件事今天完成
      [
        { id: 'a', text: '评估紧急程度排序，逐个完成', scores: { C: 3, D: 2 } },
        { id: 'b', text: '列个清单从最重要的开始', scores: { C: 2, D: 1 } },
        { id: 'c', text: '哪个想做先做哪个', scores: { C: 1 } },
        { id: 'd', text: '同时做三件可能哪个都没做好', scores: { C: 0 } },
        { id: 'e', text: '感觉有压力不知道从哪开始', scores: { C: 0 } },
      ],
    ],
    E: [
      // v0: 陌生人聚会
      [
        { id: 'a', text: '很兴奋这是认识新朋友的好机会', scores: { E: 3, L: 2 } },
        { id: 'b', text: '有点紧张但也期待', scores: { E: 2, L: 1 } },
        { id: 'c', text: '找一两个认识的人待在一起', scores: { E: 1 } },
        { id: 'd', text: '有点不自在希望能早点离开', scores: { E: 0 } },
        { id: 'e', text: '能不去就不去', scores: { E: 0 } },
      ],
      // v1: 独处vs群体
      [
        { id: 'a', text: '喜欢一群人在一起，热闹有活力', scores: { E: 3, L: 1 } },
        { id: 'b', text: '大部分时间喜欢跟人在一起', scores: { E: 2 } },
        { id: 'c', text: '各一半，需要平衡', scores: { E: 1 } },
        { id: 'd', text: '更喜欢一个人待着充电', scores: { E: 0 } },
        { id: 'e', text: '强烈偏好独处', scores: { E: 0 } },
      ],
      // v2: 课堂上知道答案
      [
        { id: 'a', text: '立刻举手回答', scores: { E: 3 } },
        { id: 'b', text: '等几秒看没人回答再举手', scores: { E: 2 } },
        { id: 'c', text: '小声跟同桌说答案', scores: { E: 1 } },
        { id: 'd', text: '知道但不太想当众说', scores: { E: 0 } },
        { id: 'e', text: '不想引起注意', scores: { E: 0 } },
      ],
      // v3: 公共场合发表意见
      [
        { id: 'a', text: '觉得自在，愿意分享自己的想法', scores: { E: 3 } },
        { id: 'b', text: '准备好了就能说', scores: { E: 2 } },
        { id: 'c', text: '被点名才会说', scores: { E: 1 } },
        { id: 'd', text: '很紧张不太想发言', scores: { E: 0 } },
        { id: 'e', text: '尽量避免', scores: { E: 0 } },
      ],
      // v4: 周末社交安排
      [
        { id: 'a', text: '约很多朋友一起出去玩', scores: { E: 3, L: 1 } },
        { id: 'b', text: '至少一天和朋友聚会', scores: { E: 2 } },
        { id: 'c', text: '约一个好朋友就够了', scores: { E: 1 } },
        { id: 'd', text: '更想自己在家休息', scores: { E: 0 } },
        { id: 'e', text: '两天都不想社交', scores: { E: 0 } },
      ],
    ],
    A: [
      // v0: 同学弄坏东西
      [
        { id: 'a', text: '告诉他没关系的不用在意', scores: { A: 3, L: 1 } },
        { id: 'b', text: '有点不高兴但不会说出来', scores: { A: 2 } },
        { id: 'c', text: '让他道歉或赔偿', scores: { A: 1 } },
        { id: 'd', text: '直接表达不满', scores: { A: 0 } },
        { id: 'e', text: '很生气可能会吵起来', scores: { A: 0 } },
      ],
      // v1: 投票结果和自己不一样
      [
        { id: 'a', text: '尊重集体决定，全力支持', scores: { A: 3, L: 1 } },
        { id: 'b', text: '虽然遗憾但愿意配合', scores: { A: 2 } },
        { id: 'c', text: '表达自己的保留意见但服从结果', scores: { A: 1 } },
        { id: 'd', text: '坚持自己的想法不太想配合', scores: { A: 0 } },
        { id: 'e', text: '觉得投票不公平', scores: { A: 0 } },
      ],
      // v2: 公共场合有人需要帮助
      [
        { id: 'a', text: '立刻主动上前帮助', scores: { A: 3, L: 1 } },
        { id: 'b', text: '如果周围没人帮，我会上前', scores: { A: 2 } },
        { id: 'c', text: '觉得应该帮但有点犹豫', scores: { A: 1 } },
        { id: 'd', text: '看看就走了', scores: { A: 0 } },
        { id: 'e', text: '不太想管闲事', scores: { A: 0 } },
      ],
      // v3: 好朋友犯了错误
      [
        { id: 'a', text: '委婉地指出来帮他改正', scores: { A: 3, L: 1 } },
        { id: 'b', text: '找合适的时机私下提醒', scores: { A: 2 } },
        { id: 'c', text: '暗示一下希望他自己意识到', scores: { A: 1 } },
        { id: 'd', text: '直接指出不留情面', scores: { A: 0 } },
        { id: 'e', text: '不说，不是我的事', scores: { A: 0 } },
      ],
      // v4: 别人夸奖你
      [
        { id: 'a', text: '真诚感谢并表示还有需要改进的地方', scores: { A: 3, R: 1 } },
        { id: 'b', text: '有点不好意思但很开心', scores: { A: 2 } },
        { id: 'c', text: '客气地说"哪里哪里"', scores: { A: 1 } },
        { id: 'd', text: '觉得理所应当', scores: { A: 0 } },
        { id: 'e', text: '怀疑对方是不是有什么目的', scores: { A: 0 } },
      ],
    ],
    N: [
      // v0: 考试成绩公布前
      [
        { id: 'a', text: '非常紧张焦虑得睡不好', scores: { N: 3 } },
        { id: 'b', text: '有些担心但能控制', scores: { N: 2, R: 1 } },
        { id: 'c', text: '偶尔会想一下但不太影响心情', scores: { N: 1 } },
        { id: 'd', text: '顺其自然不太担心', scores: { N: 0, R: 1 } },
        { id: 'e', text: '完全不在意', scores: { N: 0 } },
      ],
      // v1: 解决不了的难题
      [
        { id: 'a', text: '很沮丧很着急甚至想哭', scores: { N: 3 } },
        { id: 'b', text: '有些挫败但不会崩溃', scores: { N: 2 } },
        { id: 'c', text: '暂时放一放等冷静了再想', scores: { N: 1, R: 1 } },
        { id: 'd', text: '无所谓解决不了就算了', scores: { N: 0 } },
        { id: 'e', text: '反而觉得挑战很有意思', scores: { N: 0 } },
      ],
      // v2: 被当众批评
      [
        { id: 'a', text: '很受伤会反复回想很久', scores: { N: 3 } },
        { id: 'b', text: '当时难过但几天后就好了', scores: { N: 2 } },
        { id: 'c', text: '想想批评是否合理然后调整', scores: { N: 1, R: 1 } },
        { id: 'd', text: '不太在意别人的批评', scores: { N: 0 } },
        { id: 'e', text: '批评也是一种反馈，虚心接受', scores: { N: 0, R: 1 } },
      ],
      // v3: 比赛或表演前
      [
        { id: 'a', text: '紧张到手抖、失眠', scores: { N: 3 } },
        { id: 'b', text: '有些紧张但还能正常发挥', scores: { N: 2 } },
        { id: 'c', text: '略微紧张反而更兴奋', scores: { N: 1 } },
        { id: 'd', text: '很放松觉得就是展示自己', scores: { N: 0 } },
        { id: 'e', text: '完全不紧张', scores: { N: 0 } },
      ],
      // v4: 和朋友矛盾后心情恢复
      [
        { id: 'a', text: '很久都放不下反复纠结', scores: { N: 3 } },
        { id: 'b', text: '几天才能恢复', scores: { N: 2 } },
        { id: 'c', text: '一天左右就好了', scores: { N: 1 } },
        { id: 'd', text: '很快就释然了', scores: { N: 0, R: 1 } },
        { id: 'e', text: '几乎不会因为这种事影响心情', scores: { N: 0 } },
      ],
    ],
  }
  return optionSets[dim]?.[variant % (optionSets[dim]?.length || 1)] || optionSets['O'][0]
}

function generateBFJudgmentText(dim: string, name: string, _ag: AgeGroupKey, variant: number): string {
  const texts: Record<string, string[]> = {
    O: ['尝试新事物即使可能失败也是有价值的。', '有创造力的人通常喜欢接受新挑战。', '只做自己确定能成功的事情才是明智的。'],
    C: ['做事之前制定计划有助于提高效率。', '善于管理时间的人通常学习成绩也不错。', '做事太有计划性会让人变得不灵活。'],
    E: ['善于社交的人在团队中通常能发挥更大作用。', '主动和别人交流有助于拓宽视野。', '安静内向的人在社交场合一定不开心。'],
    A: ['在团队合作中考虑他人的感受很重要。', '有时候妥协是解决冲突的好方法。', '总是迁就别人说明性格软弱。'],
    N: ['遇到困难时保持冷静有助于更好地解决问题。', '适当的紧张可以帮助我们更好地发挥。', '容易紧张的人做事一定做不好。'],
  }
  return texts[dim]?.[variant] || `${name}对生活有重要影响。`
}

// ========== CHC 认知能力扩展题 ==========

function generateCHCQuestions(ag: AgeGroupKey): UnifiedQuestion[] {
  const prefix = `${ag.split('-').map(w => w[0]).join('').toUpperCase()}-CHC`
  const qs: UnifiedQuestion[] = []
  let idx = 1

  const gfTexts = [
    '下面的图形序列中，缺失的图形最可能是什么？',
    '如果A比B高，B比C高，那么关于A和C的关系可以确定的是？',
    '一个新的数学符号"★"的规则是：a★b = a+b+ab，那么2★3等于？',
    '观察这组数：2,6,12,20,30,...下一个数是？',
    '有三个容器和无限的水，但只有5升和3升的容器，怎样量出4升水？',
    '如果所有的花都是植物，所有的玫瑰都是花，那么一定正确的是？',
    '一块布对折三次后剪去一个角，展开后有几个洞？',
    '有4个人过桥，桥每次最多过2人，需要手电筒，过桥时间分别是1、2、5、10分钟，最快几分钟全过？',
  ]
  const gcTexts = [
    '哪个成语使用了比喻的修辞手法？',
    '"滴水穿石"这个成语告诉我们什么道理？',
    '以下哪位科学家提出了相对论？',
    '二十四节气中，哪个节气表示一年中白天最长？',
    '"温故而知新"出自哪部经典著作？',
    '以下哪个不是可再生能源？',
    '成语"画龙点睛"的典故是关于什么的？',
    '以下哪项是健康饮食的基本原则？',
  ]

  for (let i = 0; i < Math.min(gfTexts.length, 8); i++) {
    qs.push(choice(
      `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'CHC',
      gfTexts[i], '流体推理', ['I', 'W'],
      [
        { id: 'a', text: '通过分析规律推理出答案', scores: { Gf: 3, I: 2 } },
        { id: 'b', text: '用排除法缩小范围', scores: { Gf: 2, I: 1, D: 1 } },
        { id: 'c', text: '凭直觉选一个试试', scores: { Gf: 1, W: 1 } },
        { id: 'd', text: '画图帮助思考', scores: { Gf: 2, D: 1 } },
        { id: 'e', text: '觉得太难了跳过', scores: { Gf: 0 } },
      ],
      { difficulty: (Math.min(5, 3 + Math.floor(i / 3))) as 1|2|3|4|5, tags: ['CHC', '流体推理'] }
    ))
    idx++
  }

  for (let i = 0; i < Math.min(gcTexts.length, 8); i++) {
    qs.push(choice(
      `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'CHC',
      gcTexts[i], '晶体智力', ['E', 'R'],
      [
        { id: 'a', text: '根据学过的知识回答', scores: { Gc: 3, R: 1 } },
        { id: 'b', text: '根据课外阅读积累回答', scores: { Gc: 2, W: 1 } },
        { id: 'c', text: '推理一下哪个最合理', scores: { Gc: 1, Gf: 1, I: 1 } },
        { id: 'd', text: '回忆在哪里看到过相关内容', scores: { Gc: 2, R: 1 } },
        { id: 'e', text: '不确定随便选一个', scores: { Gc: 0 } },
      ],
      { difficulty: (Math.min(5, 2 + Math.floor(i / 3))) as 1|2|3|4|5, tags: ['CHC', '晶体智力'] }
    ))
    idx++
  }

  // 判断题
  const chcJudgments = [
    { text: '遇到新问题时能灵活运用学过的方法是一种重要的能力。', correct: true, dim: 'Gf' },
    { text: '解决难题只需要聪明不需要学习积累。', correct: false, dim: 'Gc' },
    { text: '逻辑推理能力可以通过练习来提升。', correct: true, dim: 'Gf' },
    { text: '读很多书的人一定比不读书的人聪明。', correct: false, dim: 'Gc' },
  ]

  for (const jq of chcJudgments) {
    const wm = jq.dim === 'Gf' ? ['I', 'W'] : ['E', 'R']
    qs.push(judgment(
      `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'CHC',
      jq.text, jq.dim === 'Gf' ? '流体推理' : '晶体智力', wm,
      jq.correct,
      {
        yes: jq.correct ? { [jq.dim]: 2, [wm[0]]: 1 } : { [jq.dim]: 0 },
        no: jq.correct ? { [jq.dim]: 0 } : { [jq.dim]: 2, [wm[0]]: 1 },
      },
      { difficulty: 2, tags: ['CHC', jq.dim, 'judgment'] }
    ))
    idx++
  }

  return qs
}

// ========== Grit/SEL/EF/Cognitive/WILDER 扩展题 ==========
// 使用类似的模式为其余模型生成题目

function generateGritQuestions(ag: AgeGroupKey): UnifiedQuestion[] {
  const prefix = `${ag.split('-').map(w => w[0]).join('').toUpperCase()}-GRIT`
  const qs: UnifiedQuestion[] = []
  let idx = 1

  const passionTexts = [
    '对于你感兴趣的事情，你通常能保持多久的热情？',
    '你有没有一个持续超过半年的爱好或兴趣？',
    '当发现一个新的兴趣领域时，你通常会？',
    '你觉得找到真正热爱的事情重要吗？',
    '如果你现在的兴趣和未来的学业方向冲突了，你会？',
  ]

  const perseveranceTexts = [
    '遇到一个很难的挑战，需要花很长时间才能完成，你会？',
    '在学习一项新技能时进展很慢，你的反应是？',
    '一个目标需要每天坚持做一件枯燥的事才能达到，你会？',
    '比赛前的训练很辛苦身体很累，你会怎么做？',
    '一个项目做到一半发现比预想的难很多，你会？',
  ]

  // 每道兴趣一致性题有场景专属选项
  type OptSet = { id: string; text: string; scores: Record<string, number> }[]
  const passionOptionBank: OptSet[] = [
    // v0: 保持多久的热情
    [
      { id: 'a', text: '越深入越感兴趣，能持续很长时间', scores: { grit_passion: 3, W: 2 } },
      { id: 'b', text: '能保持几个月的热情', scores: { grit_passion: 2, W: 1 } },
      { id: 'c', text: '几周后热情就会减退', scores: { grit_passion: 1 } },
      { id: 'd', text: '通常新鲜几天就转移了', scores: { grit_passion: 0 } },
      { id: 'e', text: '没有什么特别感兴趣的事', scores: { grit_passion: 0 } },
    ],
    // v1: 持续超过半年的爱好
    [
      { id: 'a', text: '有好几个，而且越来越深入', scores: { grit_passion: 3, W: 2 } },
      { id: 'b', text: '有一两个一直在坚持', scores: { grit_passion: 2 } },
      { id: 'c', text: '有过但后来就不太做了', scores: { grit_passion: 1 } },
      { id: 'd', text: '兴趣换了很多但没有一个超过半年', scores: { grit_passion: 0, W: 1 } },
      { id: 'e', text: '没有什么固定的爱好', scores: { grit_passion: 0 } },
    ],
    // v2: 发现新兴趣领域
    [
      { id: 'a', text: '深入了解，如果真喜欢就长期投入', scores: { grit_passion: 3, W: 1 } },
      { id: 'b', text: '先花一段时间体验看是否真的喜欢', scores: { grit_passion: 2 } },
      { id: 'c', text: '短暂尝试但可能很快就换下一个', scores: { grit_passion: 1, W: 1 } },
      { id: 'd', text: '总是被新的兴趣吸引无法专注', scores: { grit_passion: 0, W: 2 } },
      { id: 'e', text: '不太主动去发现新兴趣', scores: { grit_passion: 0 } },
    ],
    // v3: 找到真正热爱的事情重要吗
    [
      { id: 'a', text: '非常重要，我一直在找并且愿意长期投入', scores: { grit_passion: 3, W: 1 } },
      { id: 'b', text: '重要，但还在寻找的过程中', scores: { grit_passion: 2 } },
      { id: 'c', text: '还好，有没有都可以', scores: { grit_passion: 1 } },
      { id: 'd', text: '不太重要，做什么都差不多', scores: { grit_passion: 0 } },
      { id: 'e', text: '没想过这个问题', scores: { grit_passion: 0 } },
    ],
    // v4: 兴趣和学业方向冲突
    [
      { id: 'a', text: '想办法把兴趣和学业结合起来', scores: { grit_passion: 3, W: 1, D: 1 } },
      { id: 'b', text: '课余时间坚持兴趣不放弃', scores: { grit_passion: 2 } },
      { id: 'c', text: '先以学业为主，兴趣以后再说', scores: { grit_passion: 1 } },
      { id: 'd', text: '放弃兴趣全力专注学业', scores: { grit_passion: 0 } },
      { id: 'e', text: '两个都不太想投入', scores: { grit_passion: 0 } },
    ],
  ]

  for (let i = 0; i < passionTexts.length; i++) {
    qs.push(choice(
      `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'Grit',
      passionTexts[i], '兴趣一致性', ['W', 'I'],
      passionOptionBank[i % passionOptionBank.length],
      { difficulty: 3, tags: ['Grit', '兴趣一致性'] }
    ))
    idx++
  }

  // 每道努力坚持性题有场景专属选项
  const perseveranceOptionBank: OptSet[] = [
    // v0: 很难的挑战需要花很长时间
    [
      { id: 'a', text: '分阶段攻克，一步步坚持到底', scores: { grit_perseverance: 3, D: 2 } },
      { id: 'b', text: '试一段时间如果有进展就继续', scores: { grit_perseverance: 2, D: 1 } },
      { id: 'c', text: '做一阵停一阵断断续续', scores: { grit_perseverance: 1 } },
      { id: 'd', text: '看到困难可能就不想做了', scores: { grit_perseverance: 0 } },
      { id: 'e', text: '太难的事不会开始', scores: { grit_perseverance: 0 } },
    ],
    // v1: 学新技能进展慢
    [
      { id: 'a', text: '分析瓶颈调整方法继续练习', scores: { grit_perseverance: 3, R: 1 } },
      { id: 'b', text: '加大练习量相信量变引起质变', scores: { grit_perseverance: 2, D: 1 } },
      { id: 'c', text: '有点灰心但还在坚持', scores: { grit_perseverance: 1 } },
      { id: 'd', text: '觉得自己可能不适合就放弃了', scores: { grit_perseverance: 0 } },
      { id: 'e', text: '换一个更容易上手的学', scores: { grit_perseverance: 0 } },
    ],
    // v2: 每天做枯燥的事才能达到目标
    [
      { id: 'a', text: '制定每日任务表严格执行', scores: { grit_perseverance: 3, D: 2 } },
      { id: 'b', text: '给自己设置小奖励保持动力', scores: { grit_perseverance: 2, D: 1 } },
      { id: 'c', text: '坚持一段时间后可能会松懈', scores: { grit_perseverance: 1 } },
      { id: 'd', text: '很难坚持做枯燥的事', scores: { grit_perseverance: 0 } },
      { id: 'e', text: '不想要需要这么辛苦才能达到的目标', scores: { grit_perseverance: 0 } },
    ],
    // v3: 训练很辛苦身体很累
    [
      { id: 'a', text: '咬牙坚持，把辛苦当成成长的必经之路', scores: { grit_perseverance: 3, D: 1 } },
      { id: 'b', text: '适当休息调整后继续训练', scores: { grit_perseverance: 2, R: 1 } },
      { id: 'c', text: '减少训练量降低强度', scores: { grit_perseverance: 1 } },
      { id: 'd', text: '找借口请假偷懒', scores: { grit_perseverance: 0 } },
      { id: 'e', text: '想要退出', scores: { grit_perseverance: 0 } },
    ],
    // v4: 项目比预想的难很多
    [
      { id: 'a', text: '重新评估后制定更详细的计划继续', scores: { grit_perseverance: 3, D: 2, R: 1 } },
      { id: 'b', text: '寻找帮助或合作者一起完成', scores: { grit_perseverance: 2, L: 1 } },
      { id: 'c', text: '简化项目范围先完成基础部分', scores: { grit_perseverance: 1, D: 1 } },
      { id: 'd', text: '失去动力想要放弃', scores: { grit_perseverance: 0 } },
      { id: 'e', text: '直接放弃做别的', scores: { grit_perseverance: 0 } },
    ],
  ]

  for (let i = 0; i < perseveranceTexts.length; i++) {
    qs.push(choice(
      `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'Grit',
      perseveranceTexts[i], '努力坚持性', ['D', 'R'],
      perseveranceOptionBank[i % perseveranceOptionBank.length],
      { difficulty: 3, tags: ['Grit', '努力坚持性'] }
    ))
    idx++
  }

  return qs
}

function generateSELQuestions(ag: AgeGroupKey): UnifiedQuestion[] {
  const prefix = `${ag.split('-').map(w => w[0]).join('').toUpperCase()}-SEL`
  const qs: UnifiedQuestion[] = []
  let idx = 1

  const selDims = [
    { dim: 'sel_selfAwareness', wm: ['R'], name: '自我意识', texts: [
      '你觉得自己最大的优点是什么？', '当你心情不好的时候你通常能意识到原因吗？',
      '你了解自己在什么时候学习效率最高吗？', '你对自己的性格特点有清晰的认识吗？',
    ]},
    { dim: 'sel_selfManagement', wm: ['D', 'R'], name: '自我管理', texts: [
      '面对巨大的压力你通常怎么调节？', '你能控制自己不在上课时玩手机吗？',
      '当心情很激动时你能管理好自己的行为吗？', '你有没有定期检查学习计划完成情况的习惯？',
    ]},
    { dim: 'sel_socialAwareness', wm: ['L'], name: '社会意识', texts: [
      '你能感觉到别人没有说出口的情绪吗？', '当一个同学被大家排挤你会注意到吗？',
      '你觉得关注社会公共事务重要吗？', '你能理解来自不同背景的同学的想法吗？',
    ]},
    { dim: 'sel_relationshipSkills', wm: ['L', 'E'], name: '关系技能', texts: [
      '和意见不同的人怎样才能有效沟通？', '维持一段友谊你觉得最重要的是什么？',
      '在团队中发生冲突你通常扮演什么角色？', '你擅长在合适的时机说合适的话吗？',
    ]},
    { dim: 'sel_responsibleDecision', wm: ['D', 'I'], name: '负责任决策', texts: [
      '做一个重要决定之前你通常会考虑哪些因素？', '如果朋友拉你一起做你觉得不对的事你会？',
      '面对两个都有道理的选择你怎么做决定？', '做决定时你会想这个决定对其他人的影响吗？',
    ]},
  ]

  // 每个维度的每道题都有场景专属选项
  const selOptionBank: Record<string, { id: string; text: string; scores: Record<string, number> }[][]> = {
    sel_selfAwareness: [
      // v0: 自己最大的优点
      [
        { id: 'a', text: '能清楚说出自己的多个优缺点', scores: { sel_selfAwareness: 3, R: 2 } },
        { id: 'b', text: '大概知道自己擅长什么', scores: { sel_selfAwareness: 2, R: 1 } },
        { id: 'c', text: '别人说我什么好我就觉得是什么', scores: { sel_selfAwareness: 1 } },
        { id: 'd', text: '没有认真想过这个问题', scores: { sel_selfAwareness: 0 } },
        { id: 'e', text: '觉得自己没什么特别的优点', scores: { sel_selfAwareness: 0 } },
      ],
      // v1: 心情不好时意识到原因
      [
        { id: 'a', text: '总能准确识别情绪来源', scores: { sel_selfAwareness: 3, R: 2 } },
        { id: 'b', text: '大部分时候能找到原因', scores: { sel_selfAwareness: 2, R: 1 } },
        { id: 'c', text: '有时候说不清为什么不开心', scores: { sel_selfAwareness: 1 } },
        { id: 'd', text: '经常莫名其妙地情绪低落', scores: { sel_selfAwareness: 0 } },
        { id: 'e', text: '不太会关注自己的情绪', scores: { sel_selfAwareness: 0 } },
      ],
      // v2: 学习效率最高的时候
      [
        { id: 'a', text: '非常了解，会主动安排高效时段学重要内容', scores: { sel_selfAwareness: 3, R: 2 } },
        { id: 'b', text: '大致知道自己是"早起型"还是"夜猫型"', scores: { sel_selfAwareness: 2 } },
        { id: 'c', text: '没太注意过，感觉差不多', scores: { sel_selfAwareness: 1 } },
        { id: 'd', text: '好像什么时候效率都不太高', scores: { sel_selfAwareness: 0 } },
        { id: 'e', text: '从没想过这个问题', scores: { sel_selfAwareness: 0 } },
      ],
      // v3: 对性格特点的认识
      [
        { id: 'a', text: '非常清晰，知道自己在不同场景下的表现', scores: { sel_selfAwareness: 3, R: 2 } },
        { id: 'b', text: '有一些了解，但还在不断认识自己', scores: { sel_selfAwareness: 2 } },
        { id: 'c', text: '别人比我更了解我自己', scores: { sel_selfAwareness: 1 } },
        { id: 'd', text: '觉得性格这东西很难说清楚', scores: { sel_selfAwareness: 0 } },
        { id: 'e', text: '没有特别想过', scores: { sel_selfAwareness: 0 } },
      ],
    ],
    sel_selfManagement: [
      // v0: 面对巨大压力
      [
        { id: 'a', text: '用运动、深呼吸等方法有效调节', scores: { sel_selfManagement: 3, D: 1, R: 1 } },
        { id: 'b', text: '找朋友倾诉或做喜欢的事缓解', scores: { sel_selfManagement: 2 } },
        { id: 'c', text: '硬撑着等压力过去', scores: { sel_selfManagement: 1 } },
        { id: 'd', text: '经常被压力压得喘不过气', scores: { sel_selfManagement: 0 } },
        { id: 'e', text: '会用不太好的方式发泄（发脾气等）', scores: { sel_selfManagement: 0 } },
      ],
      // v1: 上课不玩手机
      [
        { id: 'a', text: '完全没问题，上课时会自觉收起来', scores: { sel_selfManagement: 3, D: 1 } },
        { id: 'b', text: '大部分时候可以，偶尔忍不住看一眼', scores: { sel_selfManagement: 2 } },
        { id: 'c', text: '需要靠老师监督才行', scores: { sel_selfManagement: 1 } },
        { id: 'd', text: '经常忍不住偷看', scores: { sel_selfManagement: 0 } },
        { id: 'e', text: '基本控制不住', scores: { sel_selfManagement: 0 } },
      ],
      // v2: 心情激动时管理行为
      [
        { id: 'a', text: '能先冷静下来再做决定', scores: { sel_selfManagement: 3, R: 1 } },
        { id: 'b', text: '虽然激动但不会做出格的事', scores: { sel_selfManagement: 2 } },
        { id: 'c', text: '有时候会冲动但事后后悔', scores: { sel_selfManagement: 1 } },
        { id: 'd', text: '经常控制不住自己的情绪反应', scores: { sel_selfManagement: 0 } },
        { id: 'e', text: '情绪上来什么都不管了', scores: { sel_selfManagement: 0 } },
      ],
      // v3: 定期检查学习计划
      [
        { id: 'a', text: '每周都会回顾和调整计划', scores: { sel_selfManagement: 3, D: 2, R: 1 } },
        { id: 'b', text: '有时候会检查一下完成进度', scores: { sel_selfManagement: 2 } },
        { id: 'c', text: '做了计划但很少回头看', scores: { sel_selfManagement: 1 } },
        { id: 'd', text: '一般不做计划', scores: { sel_selfManagement: 0 } },
        { id: 'e', text: '做了也执行不了', scores: { sel_selfManagement: 0 } },
      ],
    ],
    sel_socialAwareness: [
      // v0: 感觉到别人没说出口的情绪
      [
        { id: 'a', text: '经常能从表情和语气中察觉到', scores: { sel_socialAwareness: 3, L: 2 } },
        { id: 'b', text: '有时候能感觉到氛围不对', scores: { sel_socialAwareness: 2, L: 1 } },
        { id: 'c', text: '除非对方表现很明显否则不太注意', scores: { sel_socialAwareness: 1 } },
        { id: 'd', text: '通常要别人说出来我才知道', scores: { sel_socialAwareness: 0 } },
        { id: 'e', text: '不太关注别人的情绪', scores: { sel_socialAwareness: 0 } },
      ],
      // v1: 同学被排挤
      [
        { id: 'a', text: '会注意到并主动关心那个同学', scores: { sel_socialAwareness: 3, L: 2 } },
        { id: 'b', text: '会注意到但不太知道该怎么做', scores: { sel_socialAwareness: 2 } },
        { id: 'c', text: '有人提到才意识到', scores: { sel_socialAwareness: 1 } },
        { id: 'd', text: '一般不会特别留意', scores: { sel_socialAwareness: 0 } },
        { id: 'e', text: '觉得不关我的事', scores: { sel_socialAwareness: 0 } },
      ],
      // v2: 关注社会公共事务
      [
        { id: 'a', text: '很重要，会主动了解并关心', scores: { sel_socialAwareness: 3, L: 1 } },
        { id: 'b', text: '有一定关注，偶尔会讨论', scores: { sel_socialAwareness: 2 } },
        { id: 'c', text: '刷到了会看一下', scores: { sel_socialAwareness: 1 } },
        { id: 'd', text: '觉得离自己太远了', scores: { sel_socialAwareness: 0 } },
        { id: 'e', text: '不太感兴趣', scores: { sel_socialAwareness: 0 } },
      ],
      // v3: 理解不同背景同学的想法
      [
        { id: 'a', text: '能设身处地从对方的角度思考', scores: { sel_socialAwareness: 3, L: 2 } },
        { id: 'b', text: '愿意尝试理解但不一定做得到', scores: { sel_socialAwareness: 2 } },
        { id: 'c', text: '觉得大家想法应该都差不多', scores: { sel_socialAwareness: 1 } },
        { id: 'd', text: '不太理解和自己不一样的想法', scores: { sel_socialAwareness: 0 } },
        { id: 'e', text: '不太关注别人怎么想', scores: { sel_socialAwareness: 0 } },
      ],
    ],
    sel_relationshipSkills: [
      // v0: 和意见不同的人有效沟通
      [
        { id: 'a', text: '先确认理解对方的意思再表达自己的观点', scores: { sel_relationshipSkills: 3, L: 2, E: 1 } },
        { id: 'b', text: '保持冷静，用事实和道理说服', scores: { sel_relationshipSkills: 2, E: 1 } },
        { id: 'c', text: '各说各的，最后投票或找人仲裁', scores: { sel_relationshipSkills: 1 } },
        { id: 'd', text: '不太擅长和想法不同的人沟通', scores: { sel_relationshipSkills: 0 } },
        { id: 'e', text: '一般选择避免冲突不说了', scores: { sel_relationshipSkills: 0 } },
      ],
      // v1: 维持友谊最重要的
      [
        { id: 'a', text: '真诚相待，相互信任和支持', scores: { sel_relationshipSkills: 3, L: 2 } },
        { id: 'b', text: '经常沟通保持联系', scores: { sel_relationshipSkills: 2, L: 1 } },
        { id: 'c', text: '有共同的兴趣爱好', scores: { sel_relationshipSkills: 1 } },
        { id: 'd', text: '不给对方添麻烦', scores: { sel_relationshipSkills: 0 } },
        { id: 'e', text: '没有特别维护过友谊', scores: { sel_relationshipSkills: 0 } },
      ],
      // v2: 团队冲突中的角色
      [
        { id: 'a', text: '调解者——帮双方找到共识', scores: { sel_relationshipSkills: 3, L: 2, E: 1 } },
        { id: 'b', text: '支持者——安抚情绪缓和气氛', scores: { sel_relationshipSkills: 2, L: 1 } },
        { id: 'c', text: '旁观者——等他们自己解决', scores: { sel_relationshipSkills: 0 } },
        { id: 'd', text: '参与者——也卷入争论', scores: { sel_relationshipSkills: 0 } },
        { id: 'e', text: '回避者——尽量远离冲突', scores: { sel_relationshipSkills: 0 } },
      ],
      // v3: 在合适的时机说合适的话
      [
        { id: 'a', text: '大部分时候能做到，会察言观色', scores: { sel_relationshipSkills: 3, L: 1, E: 1 } },
        { id: 'b', text: '比较注意场合但偶尔会说错话', scores: { sel_relationshipSkills: 2 } },
        { id: 'c', text: '心直口快有时候无意间伤到人', scores: { sel_relationshipSkills: 1 } },
        { id: 'd', text: '不太注意说话的方式和时机', scores: { sel_relationshipSkills: 0 } },
        { id: 'e', text: '更喜欢少说话', scores: { sel_relationshipSkills: 0 } },
      ],
    ],
    sel_responsibleDecision: [
      // v0: 做重要决定前考虑哪些因素
      [
        { id: 'a', text: '利弊分析、对自己和他人的影响、长期后果', scores: { sel_responsibleDecision: 3, D: 1, I: 1 } },
        { id: 'b', text: '主要考虑利弊和可行性', scores: { sel_responsibleDecision: 2, D: 1 } },
        { id: 'c', text: '问问身边人的意见再决定', scores: { sel_responsibleDecision: 1 } },
        { id: 'd', text: '主要跟着感觉走', scores: { sel_responsibleDecision: 0 } },
        { id: 'e', text: '不太做需要认真考虑的决定', scores: { sel_responsibleDecision: 0 } },
      ],
      // v1: 朋友拉你做不对的事
      [
        { id: 'a', text: '明确拒绝并说明原因', scores: { sel_responsibleDecision: 3, D: 1 } },
        { id: 'b', text: '找借口婉拒', scores: { sel_responsibleDecision: 2 } },
        { id: 'c', text: '犹豫很久可能会妥协', scores: { sel_responsibleDecision: 1 } },
        { id: 'd', text: '碍于面子跟着去了', scores: { sel_responsibleDecision: 0 } },
        { id: 'e', text: '觉得偶尔一次没关系', scores: { sel_responsibleDecision: 0 } },
      ],
      // v2: 两个都有道理的选择
      [
        { id: 'a', text: '列出各自的优劣势再系统对比', scores: { sel_responsibleDecision: 3, I: 1 } },
        { id: 'b', text: '选择更符合自己价值观的那个', scores: { sel_responsibleDecision: 2, R: 1 } },
        { id: 'c', text: '问信任的人帮忙参谋', scores: { sel_responsibleDecision: 1 } },
        { id: 'd', text: '纠结很久最后随机选一个', scores: { sel_responsibleDecision: 0 } },
        { id: 'e', text: '尽量拖延不做选择', scores: { sel_responsibleDecision: 0 } },
      ],
      // v3: 考虑决定对他人的影响
      [
        { id: 'a', text: '总会考虑，这是做决定的重要依据', scores: { sel_responsibleDecision: 3, L: 1 } },
        { id: 'b', text: '比较重要的决定会考虑', scores: { sel_responsibleDecision: 2 } },
        { id: 'c', text: '偶尔会想到', scores: { sel_responsibleDecision: 1 } },
        { id: 'd', text: '主要考虑对自己的影响', scores: { sel_responsibleDecision: 0 } },
        { id: 'e', text: '不太会想到这一点', scores: { sel_responsibleDecision: 0 } },
      ],
    ],
  }

  for (const sd of selDims) {
    for (let i = 0; i < sd.texts.length; i++) {
      const dimOpts = selOptionBank[sd.dim]
      const opts = dimOpts?.[i % dimOpts.length] || [
        { id: 'a', text: '非常擅长', scores: { [sd.dim]: 3, [sd.wm[0]]: 1 } },
        { id: 'b', text: '比较擅长', scores: { [sd.dim]: 2 } },
        { id: 'c', text: '一般', scores: { [sd.dim]: 1 } },
        { id: 'd', text: '不太擅长', scores: { [sd.dim]: 0 } },
        { id: 'e', text: '比较弱', scores: { [sd.dim]: 0 } },
      ]
      qs.push(choice(
        `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'SEL',
        sd.texts[i], sd.name, sd.wm,
        opts,
        { difficulty: 3, tags: ['SEL', sd.name] }
      ))
      idx++
    }
  }

  return qs
}

function generateEFQuestions(ag: AgeGroupKey): UnifiedQuestion[] {
  const prefix = `${ag.split('-').map(w => w[0]).join('').toUpperCase()}-EF`
  const qs: UnifiedQuestion[] = []
  let idx = 1

  const inhibitionTexts = [
    '上课时突然想到一个有趣的事情想和同桌说，你会？',
    '排队等很久终于快到你了但有人插队，你会？',
    '考试时看到答案好像写在旁边同学的试卷上，你会？',
    '正在做作业突然想到一个好玩的游戏，你会？',
    '和人讨论时很想打断对方说自己的观点，你会？',
  ]

  const flexibilityTexts = [
    '原定的计划因为突发情况必须改变，你的反应是？',
    '一直用的学习方法忽然不太管用了，你会？',
    '发现自己之前的想法是错的，你通常会？',
    '游戏规则中途突然改变，你能适应吗？',
    '需要同时关注两件不同的事情，你会怎么做？',
  ]

  const wmTexts = [
    '老师一次说了三个注意事项你能记住吗？',
    '看完一段较长的说明后你能按顺序操作吗？',
    '做一道需要多步运算的数学题你能记住中间结果吗？',
    '听一段故事后你能复述出主要情节吗？',
  ]

  // 每道抑制控制题有场景专属选项
  type OptSet = { id: string; text: string; scores: Record<string, number> }[]
  const inhibitionOptionBank: OptSet[] = [
    // v0: 上课想和同桌说话
    [
      { id: 'a', text: '忍住不说，下课再聊', scores: { inhibition: 3, R: 2, D: 1 } },
      { id: 'b', text: '在纸上记下来下课再说', scores: { inhibition: 2, R: 1, D: 1 } },
      { id: 'c', text: '小声快速说一句', scores: { inhibition: 1 } },
      { id: 'd', text: '忍不住跟同桌聊一会儿', scores: { inhibition: 0 } },
      { id: 'e', text: '想说就说了', scores: { inhibition: 0 } },
    ],
    // v1: 有人插队
    [
      { id: 'a', text: '深呼吸冷静下来，礼貌提醒对方', scores: { inhibition: 3, R: 2 } },
      { id: 'b', text: '虽然很生气但忍住不发作', scores: { inhibition: 2, R: 1 } },
      { id: 'c', text: '皱皱眉嘟囔几句', scores: { inhibition: 1 } },
      { id: 'd', text: '直接大声质问对方', scores: { inhibition: 0 } },
      { id: 'e', text: '非常生气可能会和对方冲突', scores: { inhibition: 0 } },
    ],
    // v2: 考试看到旁边的答案
    [
      { id: 'a', text: '立刻把目光移回自己的试卷', scores: { inhibition: 3, R: 1, D: 1 } },
      { id: 'b', text: '心里提醒自己不能看', scores: { inhibition: 2 } },
      { id: 'c', text: '不小心瞟了一眼但马上意识到不对', scores: { inhibition: 1 } },
      { id: 'd', text: '可能会看几眼', scores: { inhibition: 0 } },
      { id: 'e', text: '很难不去看', scores: { inhibition: 0 } },
    ],
    // v3: 做作业想到好玩的游戏
    [
      { id: 'a', text: '继续做作业，完成了再玩', scores: { inhibition: 3, D: 2 } },
      { id: 'b', text: '给自己设一个完成目标再休息', scores: { inhibition: 2, D: 1 } },
      { id: 'c', text: '可能先看一会儿再回来做', scores: { inhibition: 1 } },
      { id: 'd', text: '放下作业先玩一局', scores: { inhibition: 0 } },
      { id: 'e', text: '作业扔在一边玩很久', scores: { inhibition: 0 } },
    ],
    // v4: 讨论时想打断对方
    [
      { id: 'a', text: '耐心听完再清晰地表达自己的观点', scores: { inhibition: 3, R: 1 } },
      { id: 'b', text: '做笔记记下想说的等对方说完', scores: { inhibition: 2, D: 1 } },
      { id: 'c', text: '尝试忍住但偶尔会插嘴', scores: { inhibition: 1 } },
      { id: 'd', text: '经常会打断别人', scores: { inhibition: 0 } },
      { id: 'e', text: '觉得自己的想法更重要就直接说了', scores: { inhibition: 0 } },
    ],
  ]

  for (let i = 0; i < inhibitionTexts.length; i++) {
    qs.push(choice(
      `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'EF',
      inhibitionTexts[i], '抑制控制', ['R', 'D'],
      inhibitionOptionBank[i % inhibitionOptionBank.length],
      { difficulty: 2, tags: ['EF', '抑制控制'] }
    ))
    idx++
  }

  // 每道认知灵活性题有场景专属选项
  const flexibilityOptionBank: OptSet[] = [
    // v0: 计划突然改变
    [
      { id: 'a', text: '很快调整心态制定新计划', scores: { flexibility: 3, W: 1 } },
      { id: 'b', text: '有些不开心但能接受并适应', scores: { flexibility: 2 } },
      { id: 'c', text: '需要一段时间才能调整过来', scores: { flexibility: 1 } },
      { id: 'd', text: '很不舒服，一直想着原来的计划', scores: { flexibility: 0 } },
      { id: 'e', text: '很难接受变化，情绪波动大', scores: { flexibility: 0 } },
    ],
    // v1: 学习方法不管用了
    [
      { id: 'a', text: '积极寻找新方法，尝试不同策略', scores: { flexibility: 3, W: 1 } },
      { id: 'b', text: '分析原因然后做针对性调整', scores: { flexibility: 2, R: 1 } },
      { id: 'c', text: '加倍努力用同样的方法', scores: { flexibility: 1 } },
      { id: 'd', text: '有些焦虑不知道该怎么办', scores: { flexibility: 0 } },
      { id: 'e', text: '觉得是自己能力不够', scores: { flexibility: 0 } },
    ],
    // v2: 之前的想法是错的
    [
      { id: 'a', text: '很快接受并更新自己的认知', scores: { flexibility: 3, R: 1 } },
      { id: 'b', text: '虽然有些不好意思但愿意改正', scores: { flexibility: 2 } },
      { id: 'c', text: '需要充分的证据才愿意改变', scores: { flexibility: 1 } },
      { id: 'd', text: '很难承认自己是错的', scores: { flexibility: 0 } },
      { id: 'e', text: '坚持自己的想法不太会改', scores: { flexibility: 0 } },
    ],
    // v3: 游戏规则中途改变
    [
      { id: 'a', text: '觉得更有趣了，迅速适应新规则', scores: { flexibility: 3, W: 1 } },
      { id: 'b', text: '需要想一下但能跟上', scores: { flexibility: 2 } },
      { id: 'c', text: '有些混乱需要反复确认', scores: { flexibility: 1 } },
      { id: 'd', text: '很不习惯，总是按旧规则做', scores: { flexibility: 0 } },
      { id: 'e', text: '不想玩了', scores: { flexibility: 0 } },
    ],
    // v4: 同时关注两件不同的事
    [
      { id: 'a', text: '能在两件事之间灵活切换', scores: { flexibility: 3, D: 1 } },
      { id: 'b', text: '先处理紧急的再切换到另一件', scores: { flexibility: 2 } },
      { id: 'c', text: '有些手忙脚乱但勉强应付', scores: { flexibility: 1 } },
      { id: 'd', text: '只能专注一件，另一件就顾不上', scores: { flexibility: 0 } },
      { id: 'e', text: '很难同时处理多件事', scores: { flexibility: 0 } },
    ],
  ]

  for (let i = 0; i < flexibilityTexts.length; i++) {
    qs.push(choice(
      `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'EF',
      flexibilityTexts[i], '认知灵活性', ['W', 'L'],
      flexibilityOptionBank[i % flexibilityOptionBank.length],
      { difficulty: 3, tags: ['EF', '认知灵活性'] }
    ))
    idx++
  }

  // 每道工作记忆题有场景专属选项
  const wmOptionBank: OptSet[] = [
    // v0: 老师说三个注意事项
    [
      { id: 'a', text: '轻松记住全部三个', scores: { workingMemory: 3, I: 1 } },
      { id: 'b', text: '记住两个可能忘一个', scores: { workingMemory: 2 } },
      { id: 'c', text: '只记住第一个和最后一个', scores: { workingMemory: 1 } },
      { id: 'd', text: '需要赶紧记笔记', scores: { workingMemory: 0, D: 1 } },
      { id: 'e', text: '说完就忘了大半', scores: { workingMemory: 0 } },
    ],
    // v1: 长段说明后按顺序操作
    [
      { id: 'a', text: '在脑中构建步骤顺序然后执行', scores: { workingMemory: 3, D: 1 } },
      { id: 'b', text: '记住大致流程，细节边做边想', scores: { workingMemory: 2 } },
      { id: 'c', text: '需要反复回看说明', scores: { workingMemory: 1 } },
      { id: 'd', text: '看完就混乱了需要一步步对照', scores: { workingMemory: 0 } },
      { id: 'e', text: '根本记不住那么多步骤', scores: { workingMemory: 0 } },
    ],
    // v2: 多步运算记住中间结果
    [
      { id: 'a', text: '心算全程无压力', scores: { workingMemory: 3, I: 1 } },
      { id: 'b', text: '简单的可以，复杂了需要草稿纸', scores: { workingMemory: 2 } },
      { id: 'c', text: '经常算到后面忘了前面', scores: { workingMemory: 1 } },
      { id: 'd', text: '必须每步都写下来', scores: { workingMemory: 0, D: 1 } },
      { id: 'e', text: '心算特别困难', scores: { workingMemory: 0 } },
    ],
    // v3: 听故事后复述
    [
      { id: 'a', text: '能完整复述主线和重要细节', scores: { workingMemory: 3, I: 1 } },
      { id: 'b', text: '主要情节能说出来细节可能遗漏', scores: { workingMemory: 2 } },
      { id: 'c', text: '只记得印象最深的片段', scores: { workingMemory: 1 } },
      { id: 'd', text: '大概知道讲了什么但说不清楚', scores: { workingMemory: 0 } },
      { id: 'e', text: '听完基本记不住', scores: { workingMemory: 0 } },
    ],
  ]

  for (let i = 0; i < wmTexts.length; i++) {
    qs.push(choice(
      `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'EF',
      wmTexts[i], '工作记忆', ['I', 'D'],
      wmOptionBank[i % wmOptionBank.length],
      { difficulty: 3, tags: ['EF', '工作记忆'] }
    ))
    idx++
  }

  return qs
}

function generateWILDERExpandedQuestions(ag: AgeGroupKey): UnifiedQuestion[] {
  const prefix = `${ag.split('-').map(w => w[0]).join('').toUpperCase()}-WLD`
  const qs: UnifiedQuestion[] = []
  let idx = 1

  // 每个WILDER维度生成扩展题
  const wilderDims = [
    { dim: 'W', name: '好奇心', count: 8 },
    { dim: 'I', name: '探究力', count: 8 },
    { dim: 'L', name: '连接力', count: 8 },
    { dim: 'D', name: '设计力', count: 8 },
    { dim: 'E', name: '表达力', count: 8 },
    { dim: 'R', name: '反思力', count: 8 },
  ]

  for (const wd of wilderDims) {
    for (let i = 0; i < wd.count; i++) {
      qs.push(choice(
        `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'WILDER',
        generateWILDERText(wd.dim, wd.name, ag, i),
        wd.name, [wd.dim],
        generateWILDEROptions(wd.dim, i % 8),
        { difficulty: (Math.min(5, 2 + Math.floor(i / 3))) as 1|2|3|4|5, tags: ['WILDER', wd.name] }
      ))
      idx++
    }
  }

  return qs
}

function generateWILDERText(dim: string, name: string, _ag: AgeGroupKey, variant: number): string {
  const texts: Record<string, string[]> = {
    W: ['在书店里你最先被什么类型的书吸引？', '如果可以学任何新技能你最想学什么？', '你对哪类新闻最感兴趣？', '看到一个新奇的东西你的第一反应是？', '你最近对什么新事物产生了好奇心？', '你更喜欢探索已知的领域还是完全未知的领域？', '周末你更想做什么？', '如果有一天可以变成任何动物你会选什么？'],
    I: ['遇到一个未解之谜你会怎么做？', '做一个科学实验前你通常会？', '你更喜欢哪种学习方式？', '当一个答案你不确定时你会？', '你最喜欢什么类型的项目？', '如何判断一条信息是否可靠？', '你通常怎样验证一个想法是否正确？', '做研究报告时你最注重什么？'],
    L: ['在小组合作中你通常扮演什么角色？', '当朋友需要帮助时你的反应是？', '你更喜欢独自完成任务还是和别人合作？', '对方观点和你不同时你怎么做？', '怎样才能让团队合作更高效？', '你觉得一个好的领导者最重要的品质是？', '和陌生人交流你是什么感受？', '你如何处理朋友之间的矛盾？'],
    D: ['接到一个新任务你首先做什么？', '你更喜欢按部就班还是灵活应变？', '如何把一个大目标分解成小步骤？', '你做事情之前会制定计划吗？', '项目进行到一半发现原来的方案有问题你会？', '你觉得好的计划最重要的特点是什么？', '时间紧任务重你会怎么安排？', '你有没有记录待办事项的习惯？'],
    E: ['你更擅长口头表达还是书面表达？', '需要在众人面前发言你的感受是？', '你如何把一个复杂的概念解释给别人听？', '你觉得表达想法时最重要的是什么？', '用什么方式分享观点你最自在？', '当别人误解你的意思时你会怎么做？', '你更喜欢讲故事还是讲道理？', '做汇报展示你最注重什么？'],
    R: ['做完一件事后你会回顾过程吗？', '你有写日记或做总结的习惯吗？', '犯了错误后你通常会怎么想？', '你怎样从失败中学习？', '你了解自己的学习风格吗？', '做一个重要决定后你会反思这个决定的好坏吗？', '你认为反思对成长的价值是什么？', '你通常怎样评价自己的表现？'],
  }
  return texts[dim]?.[variant] || `关于${name}的问题${variant + 1}`
}

function generateWILDEROptions(dim: string, variant: number): { id: string; text: string; scores: Record<string, number> }[] {
  // 每个WILDER维度的每道题都有场景专属选项
  const optionBank: Record<string, { id: string; text: string; scores: Record<string, number> }[][]> = {
    W: [
      // v0: 在书店里最先被什么吸引
      [
        { id: 'a', text: '从没见过的新领域，比如天文学或考古', scores: { W: 3 } },
        { id: 'b', text: '和自己兴趣相关但更深入的内容', scores: { W: 2 } },
        { id: 'c', text: '排行榜上的热门书', scores: { W: 1 } },
        { id: 'd', text: '学校推荐的课外读物', scores: { W: 0 } },
        { id: 'e', text: '不太逛书店', scores: { W: 0 } },
      ],
      // v1: 学任何新技能最想学什么
      [
        { id: 'a', text: '完全陌生的领域，比如飞行或潜水', scores: { W: 3 } },
        { id: 'b', text: '已经略知一二但想深入的技能', scores: { W: 2 } },
        { id: 'c', text: '朋友都在学的技能', scores: { W: 1 } },
        { id: 'd', text: '对升学或就业有用的技能', scores: { W: 0 } },
        { id: 'e', text: '不太想学新技能', scores: { W: 0 } },
      ],
      // v2: 对哪类新闻最感兴趣
      [
        { id: 'a', text: '科学发现、太空探索等前沿领域', scores: { W: 3 } },
        { id: 'b', text: '世界各地有趣的文化和现象', scores: { W: 2 } },
        { id: 'c', text: '和自己生活相关的本地新闻', scores: { W: 1 } },
        { id: 'd', text: '娱乐明星或体育赛事', scores: { W: 1 } },
        { id: 'e', text: '不太关注新闻', scores: { W: 0 } },
      ],
      // v3: 看到新奇的东西第一反应
      [
        { id: 'a', text: '好奇它是怎么工作的，想弄清楚原理', scores: { W: 3 } },
        { id: 'b', text: '想动手摸一摸、试一试', scores: { W: 2 } },
        { id: 'c', text: '拍张照发朋友圈', scores: { W: 1 } },
        { id: 'd', text: '看看就好', scores: { W: 0 } },
        { id: 'e', text: '不太会被新东西吸引', scores: { W: 0 } },
      ],
      // v4: 最近对什么新事物产生了好奇心
      [
        { id: 'a', text: '经常对各种新事物感到好奇', scores: { W: 3 } },
        { id: 'b', text: '最近发现了一个想深入了解的领域', scores: { W: 2 } },
        { id: 'c', text: '偶尔看到有意思的会多看一眼', scores: { W: 1 } },
        { id: 'd', text: '生活中没什么让我特别好奇的', scores: { W: 0 } },
        { id: 'e', text: '没有特别想了解的新事物', scores: { W: 0 } },
      ],
      // v5: 探索已知vs未知领域
      [
        { id: 'a', text: '完全未知的——不确定性本身就很刺激', scores: { W: 3 } },
        { id: 'b', text: '以已知为基础向未知拓展', scores: { W: 2 } },
        { id: 'c', text: '看心情决定', scores: { W: 1 } },
        { id: 'd', text: '更喜欢深耕已知的领域', scores: { W: 0 } },
        { id: 'e', text: '没有特别的偏好', scores: { W: 0 } },
      ],
      // v6: 周末更想做什么
      [
        { id: 'a', text: '去一个没去过的地方探索', scores: { W: 3 } },
        { id: 'b', text: '尝试一种新的活动或爱好', scores: { W: 2 } },
        { id: 'c', text: '做自己熟悉且喜欢的事情', scores: { W: 1 } },
        { id: 'd', text: '在家休息放松', scores: { W: 0 } },
        { id: 'e', text: '补作业或上补习班', scores: { W: 0 } },
      ],
      // v7: 变成任何动物
      [
        { id: 'a', text: '鹰——可以从高空俯瞰整个世界', scores: { W: 3 } },
        { id: 'b', text: '海豚——探索广阔的海底世界', scores: { W: 3 } },
        { id: 'c', text: '猫——自由自在地到处闲逛', scores: { W: 1 } },
        { id: 'd', text: '狗——和人亲近有安全感', scores: { W: 0 } },
        { id: 'e', text: '没想过这种问题', scores: { W: 0 } },
      ],
    ],
    I: [
      // v0: 遇到未解之谜
      [
        { id: 'a', text: '查资料、做实验，一定要找到答案', scores: { I: 3 } },
        { id: 'b', text: '提出假设然后想办法验证', scores: { I: 3 } },
        { id: 'c', text: '上网搜一下看看有没有现成解释', scores: { I: 1 } },
        { id: 'd', text: '觉得有趣但不会花太多时间', scores: { I: 0 } },
        { id: 'e', text: '不太在意答案是什么', scores: { I: 0 } },
      ],
      // v1: 做科学实验前
      [
        { id: 'a', text: '先查阅文献了解相关知识背景', scores: { I: 3 } },
        { id: 'b', text: '设计实验方案和预期结果', scores: { I: 3 } },
        { id: 'c', text: '直接动手做边做边看', scores: { I: 1 } },
        { id: 'd', text: '看看实验指导书怎么写的', scores: { I: 1 } },
        { id: 'e', text: '不太喜欢做实验', scores: { I: 0 } },
      ],
      // v2: 更喜欢哪种学习方式
      [
        { id: 'a', text: '自己提出问题然后想办法找答案', scores: { I: 3 } },
        { id: 'b', text: '通过实验和观察来发现规律', scores: { I: 2 } },
        { id: 'c', text: '听老师讲解然后做练习巩固', scores: { I: 1 } },
        { id: 'd', text: '和同学一起讨论学习', scores: { I: 1 } },
        { id: 'e', text: '背下来就好', scores: { I: 0 } },
      ],
      // v3: 答案不确定时
      [
        { id: 'a', text: '用不同方法反复验证直到确信', scores: { I: 3 } },
        { id: 'b', text: '对照多个可靠来源交叉确认', scores: { I: 2 } },
        { id: 'c', text: '问老师或专业的人确认', scores: { I: 1 } },
        { id: 'd', text: '选一个最可能的就好', scores: { I: 0 } },
        { id: 'e', text: '不太纠结答案是否准确', scores: { I: 0 } },
      ],
      // v4: 最喜欢什么类型的项目
      [
        { id: 'a', text: '需要自己设计研究方案的探究型项目', scores: { I: 3 } },
        { id: 'b', text: '有明确目标但需要自己找方法的项目', scores: { I: 2 } },
        { id: 'c', text: '有清晰步骤按要求执行的项目', scores: { I: 1 } },
        { id: 'd', text: '小组合作完成的项目', scores: { I: 1 } },
        { id: 'e', text: '越简单越好', scores: { I: 0 } },
      ],
      // v5: 判断信息可靠性
      [
        { id: 'a', text: '查证原始出处和数据来源', scores: { I: 3 } },
        { id: 'b', text: '对比多个渠道看说法是否一致', scores: { I: 2 } },
        { id: 'c', text: '看是不是官方或权威媒体发布的', scores: { I: 1 } },
        { id: 'd', text: '感觉合理就信了', scores: { I: 0 } },
        { id: 'e', text: '不太会去判断真假', scores: { I: 0 } },
      ],
      // v6: 验证想法是否正确
      [
        { id: 'a', text: '设计对照实验来检验', scores: { I: 3 } },
        { id: 'b', text: '收集数据和证据进行分析', scores: { I: 2 } },
        { id: 'c', text: '和别人讨论看看大家怎么看', scores: { I: 1 } },
        { id: 'd', text: '想一想觉得有道理就行', scores: { I: 0 } },
        { id: 'e', text: '不太去验证', scores: { I: 0 } },
      ],
      // v7: 做研究报告最注重什么
      [
        { id: 'a', text: '数据的准确性和论证的严谨性', scores: { I: 3 } },
        { id: 'b', text: '研究方法是否科学合理', scores: { I: 2 } },
        { id: 'c', text: '内容是否完整全面', scores: { I: 1 } },
        { id: 'd', text: '排版好看格式规范', scores: { I: 0 } },
        { id: 'e', text: '能交差就行', scores: { I: 0 } },
      ],
    ],
    L: [
      // v0: 小组合作中的角色
      [
        { id: 'a', text: '协调者——让每个人发挥特长', scores: { L: 3 } },
        { id: 'b', text: '沟通者——帮大家达成共识', scores: { L: 3 } },
        { id: 'c', text: '执行者——认真完成分配的任务', scores: { L: 1 } },
        { id: 'd', text: '独立完成自己的部分就好', scores: { L: 0 } },
        { id: 'e', text: '不太喜欢小组合作', scores: { L: 0 } },
      ],
      // v1: 朋友需要帮助
      [
        { id: 'a', text: '立即放下手上的事去帮忙', scores: { L: 3 } },
        { id: 'b', text: '了解情况后尽力帮助', scores: { L: 2 } },
        { id: 'c', text: '口头安慰或给些建议', scores: { L: 1 } },
        { id: 'd', text: '如果自己方便的话会帮', scores: { L: 1 } },
        { id: 'e', text: '觉得每个人应该自己解决问题', scores: { L: 0 } },
      ],
      // v2: 独自vs合作完成任务
      [
        { id: 'a', text: '和别人合作——互相启发效率更高', scores: { L: 3 } },
        { id: 'b', text: '看情况，有些事合作更好', scores: { L: 2 } },
        { id: 'c', text: '各有利弊，没有偏好', scores: { L: 1 } },
        { id: 'd', text: '更喜欢独立完成——按自己节奏', scores: { L: 0 } },
        { id: 'e', text: '强烈偏好独自完成', scores: { L: 0 } },
      ],
      // v3: 对方观点不同
      [
        { id: 'a', text: '认真倾听并试着理解对方的逻辑', scores: { L: 3 } },
        { id: 'b', text: '寻找双方观点中合理的部分', scores: { L: 2 } },
        { id: 'c', text: '坚持己见但尊重对方', scores: { L: 1 } },
        { id: 'd', text: '觉得没必要争论', scores: { L: 0 } },
        { id: 'e', text: '不太在意别人的观点', scores: { L: 0 } },
      ],
      // v4: 让团队合作更高效
      [
        { id: 'a', text: '让每个人都有发言机会、各尽其才', scores: { L: 3 } },
        { id: 'b', text: '明确分工并保持沟通', scores: { L: 2 } },
        { id: 'c', text: '找一个靠谱的人做组长', scores: { L: 1 } },
        { id: 'd', text: '每个人做好自己的部分就行', scores: { L: 0 } },
        { id: 'e', text: '团队合作天然效率低', scores: { L: 0 } },
      ],
      // v5: 好的领导者最重要的品质
      [
        { id: 'a', text: '善于倾听和凝聚团队', scores: { L: 3 } },
        { id: 'b', text: '关心每个成员的状态和需求', scores: { L: 2 } },
        { id: 'c', text: '有远见和决策能力', scores: { L: 1 } },
        { id: 'd', text: '专业能力强', scores: { L: 0 } },
        { id: 'e', text: '不太关心领导力话题', scores: { L: 0 } },
      ],
      // v6: 和陌生人交流
      [
        { id: 'a', text: '很自然，喜欢认识新的人', scores: { L: 3 } },
        { id: 'b', text: '有点紧张但能主动搭话', scores: { L: 2 } },
        { id: 'c', text: '如果对方先开口我就能聊', scores: { L: 1 } },
        { id: 'd', text: '比较不自在，尽量避免', scores: { L: 0 } },
        { id: 'e', text: '非常不喜欢和陌生人互动', scores: { L: 0 } },
      ],
      // v7: 处理朋友间矛盾
      [
        { id: 'a', text: '主动找双方沟通，促进和解', scores: { L: 3 } },
        { id: 'b', text: '分别安慰双方，等情绪平复再调解', scores: { L: 2 } },
        { id: 'c', text: '谁找我就开导谁', scores: { L: 1 } },
        { id: 'd', text: '不太想卷入别人的矛盾', scores: { L: 0 } },
        { id: 'e', text: '觉得矛盾会自然解决', scores: { L: 0 } },
      ],
    ],
    D: [
      // v0: 接到新任务首先做什么
      [
        { id: 'a', text: '拆解目标，制定详细的执行计划', scores: { D: 3 } },
        { id: 'b', text: '列出要做的事情和优先级', scores: { D: 2 } },
        { id: 'c', text: '先大概想一想再开始做', scores: { D: 1 } },
        { id: 'd', text: '直接开始做，边做边想', scores: { D: 0 } },
        { id: 'e', text: '等别人告诉我该怎么做', scores: { D: 0 } },
      ],
      // v1: 按部就班vs灵活应变
      [
        { id: 'a', text: '先做好完整计划，但保留调整空间', scores: { D: 3 } },
        { id: 'b', text: '按部就班——有序推进才高效', scores: { D: 2 } },
        { id: 'c', text: '灵活应变——随机应变更实际', scores: { D: 1 } },
        { id: 'd', text: '看心情决定', scores: { D: 0 } },
        { id: 'e', text: '不太在意方式', scores: { D: 0 } },
      ],
      // v2: 分解大目标
      [
        { id: 'a', text: '画思维导图或甘特图拆解子任务', scores: { D: 3 } },
        { id: 'b', text: '按时间节点划分里程碑', scores: { D: 2 } },
        { id: 'c', text: '先做最紧急的，其余慢慢来', scores: { D: 1 } },
        { id: 'd', text: '不太会分解，做到哪算哪', scores: { D: 0 } },
        { id: 'e', text: '大目标让我感到有压力', scores: { D: 0 } },
      ],
      // v3: 做事之前制定计划
      [
        { id: 'a', text: '一定会——写下详细的步骤和时间表', scores: { D: 3 } },
        { id: 'b', text: '会——至少在脑中过一遍流程', scores: { D: 2 } },
        { id: 'c', text: '简单的事不会，复杂的事会', scores: { D: 1 } },
        { id: 'd', text: '很少做计划', scores: { D: 0 } },
        { id: 'e', text: '觉得计划赶不上变化', scores: { D: 0 } },
      ],
      // v4: 方案有问题怎么办
      [
        { id: 'a', text: '分析问题原因然后修订方案继续', scores: { D: 3 } },
        { id: 'b', text: '回到原点重新设计一个更好的方案', scores: { D: 2 } },
        { id: 'c', text: '小修小补能用就行', scores: { D: 1 } },
        { id: 'd', text: '有点沮丧不太想继续', scores: { D: 0 } },
        { id: 'e', text: '放弃这个项目', scores: { D: 0 } },
      ],
      // v5: 好的计划最重要的特点
      [
        { id: 'a', text: '目标清晰、步骤具体、可以衡量进度', scores: { D: 3 } },
        { id: 'b', text: '既有框架又留有灵活调整的余地', scores: { D: 2 } },
        { id: 'c', text: '简单明了容易执行', scores: { D: 1 } },
        { id: 'd', text: '不太确定什么算好的计划', scores: { D: 0 } },
        { id: 'e', text: '做计划不重要，做才重要', scores: { D: 0 } },
      ],
      // v6: 时间紧任务重
      [
        { id: 'a', text: '快速排列优先级，集中精力做最重要的', scores: { D: 3 } },
        { id: 'b', text: '制作时间表精确分配每个任务的时间', scores: { D: 2 } },
        { id: 'c', text: '先做最简单的积累完成感', scores: { D: 1 } },
        { id: 'd', text: '很焦虑不知从何开始', scores: { D: 0 } },
        { id: 'e', text: '拖到最后一刻再说', scores: { D: 0 } },
      ],
      // v7: 记录待办事项的习惯
      [
        { id: 'a', text: '每天写to-do list并逐项打勾', scores: { D: 3 } },
        { id: 'b', text: '重要事情会记在手机或本子上', scores: { D: 2 } },
        { id: 'c', text: '偶尔记一下', scores: { D: 1 } },
        { id: 'd', text: '全靠脑子记', scores: { D: 0 } },
        { id: 'e', text: '经常忘记要做的事', scores: { D: 0 } },
      ],
    ],
    E: [
      // v0: 口头vs书面表达
      [
        { id: 'a', text: '两种都擅长，看场合灵活选择', scores: { E: 3 } },
        { id: 'b', text: '更擅长口头表达，说比写自然', scores: { E: 2 } },
        { id: 'c', text: '更擅长书面表达，写比说清楚', scores: { E: 2 } },
        { id: 'd', text: '两种都不太擅长', scores: { E: 0 } },
        { id: 'e', text: '不太喜欢表达想法', scores: { E: 0 } },
      ],
      // v1: 众人面前发言
      [
        { id: 'a', text: '享受——是展示想法的好机会', scores: { E: 3 } },
        { id: 'b', text: '有点紧张但能表达清楚', scores: { E: 2 } },
        { id: 'c', text: '如果准备充分可以做到', scores: { E: 1 } },
        { id: 'd', text: '非常紧张尽量避免', scores: { E: 0 } },
        { id: 'e', text: '完全不想在公共场合发言', scores: { E: 0 } },
      ],
      // v2: 解释复杂概念
      [
        { id: 'a', text: '用生活中的例子类比让对方秒懂', scores: { E: 3 } },
        { id: 'b', text: '把复杂内容分层逐步讲解', scores: { E: 2 } },
        { id: 'c', text: '画图或列要点帮助说明', scores: { E: 2 } },
        { id: 'd', text: '说一遍如果对方不懂就不太知道怎么办', scores: { E: 0 } },
        { id: 'e', text: '不太擅长给别人讲东西', scores: { E: 0 } },
      ],
      // v3: 表达想法时最重要的是
      [
        { id: 'a', text: '让听的人能完全理解你的意思', scores: { E: 3 } },
        { id: 'b', text: '逻辑清晰有条理', scores: { E: 2 } },
        { id: 'c', text: '真诚表达自己的真实想法', scores: { E: 1 } },
        { id: 'd', text: '简短说完就好', scores: { E: 0 } },
        { id: 'e', text: '不太在意表达方式', scores: { E: 0 } },
      ],
      // v4: 什么方式分享观点最自在
      [
        { id: 'a', text: '当面和一群人讨论交流', scores: { E: 3 } },
        { id: 'b', text: '写文章或发帖表达', scores: { E: 2 } },
        { id: 'c', text: '和一两个亲近的人私下聊', scores: { E: 1 } },
        { id: 'd', text: '默默在心里想，不太分享', scores: { E: 0 } },
        { id: 'e', text: '不太有想分享的观点', scores: { E: 0 } },
      ],
      // v5: 被误解时
      [
        { id: 'a', text: '换种方式重新解释直到对方理解', scores: { E: 3 } },
        { id: 'b', text: '补充更多细节和例子', scores: { E: 2 } },
        { id: 'c', text: '简单澄清一下', scores: { E: 1 } },
        { id: 'd', text: '觉得算了解释不清', scores: { E: 0 } },
        { id: 'e', text: '不太在意别人是否理解', scores: { E: 0 } },
      ],
      // v6: 讲故事vs讲道理
      [
        { id: 'a', text: '讲故事——用故事传递道理更有感染力', scores: { E: 3 } },
        { id: 'b', text: '两者结合——先讲故事再总结道理', scores: { E: 2 } },
        { id: 'c', text: '讲道理——直接说要点更高效', scores: { E: 1 } },
        { id: 'd', text: '看听众是谁再决定', scores: { E: 1 } },
        { id: 'e', text: '不太擅长两者', scores: { E: 0 } },
      ],
      // v7: 做汇报展示最注重什么
      [
        { id: 'a', text: '观众能被打动并清晰理解核心信息', scores: { E: 3 } },
        { id: 'b', text: '讲述流畅有感染力', scores: { E: 2 } },
        { id: 'c', text: 'PPT好看内容完整', scores: { E: 1 } },
        { id: 'd', text: '能讲完不出错就好', scores: { E: 0 } },
        { id: 'e', text: '能不做就不做', scores: { E: 0 } },
      ],
    ],
    R: [
      // v0: 做完一件事后回顾
      [
        { id: 'a', text: '总会回顾——分析做得好和不好的原因', scores: { R: 3 } },
        { id: 'b', text: '重要的事情会回顾总结', scores: { R: 2 } },
        { id: 'c', text: '偶尔会想一想', scores: { R: 1 } },
        { id: 'd', text: '做完就向前看了', scores: { R: 0 } },
        { id: 'e', text: '很少回头看', scores: { R: 0 } },
      ],
      // v1: 写日记或做总结的习惯
      [
        { id: 'a', text: '坚持写——帮我理清思路和情绪', scores: { R: 3 } },
        { id: 'b', text: '阶段性地做学习总结', scores: { R: 2 } },
        { id: 'c', text: '偶尔写写心情', scores: { R: 1 } },
        { id: 'd', text: '试过但没有坚持下来', scores: { R: 0 } },
        { id: 'e', text: '从来不写', scores: { R: 0 } },
      ],
      // v2: 犯了错误后
      [
        { id: 'a', text: '分析错误原因并思考如何避免再犯', scores: { R: 3 } },
        { id: 'b', text: '记住教训，下次注意', scores: { R: 2 } },
        { id: 'c', text: '有些自责但很快就过去了', scores: { R: 1 } },
        { id: 'd', text: '觉得犯错很正常不太在意', scores: { R: 0 } },
        { id: 'e', text: '尽量不去想', scores: { R: 0 } },
      ],
      // v3: 从失败中学习
      [
        { id: 'a', text: '详细复盘每个环节找到失败根因', scores: { R: 3 } },
        { id: 'b', text: '总结主要的经验教训', scores: { R: 2 } },
        { id: 'c', text: '知道大概哪里出了问题', scores: { R: 1 } },
        { id: 'd', text: '失败让我沮丧不太想回顾', scores: { R: 0 } },
        { id: 'e', text: '失败就失败了往前看', scores: { R: 0 } },
      ],
      // v4: 了解自己的学习风格
      [
        { id: 'a', text: '非常了解——知道什么方法最适合自己', scores: { R: 3 } },
        { id: 'b', text: '大概知道自己的偏好', scores: { R: 2 } },
        { id: 'c', text: '没有特别研究过', scores: { R: 1 } },
        { id: 'd', text: '不太清楚什么是学习风格', scores: { R: 0 } },
        { id: 'e', text: '从没想过这个问题', scores: { R: 0 } },
      ],
      // v5: 做重要决定后反思
      [
        { id: 'a', text: '经常反思——评估决定的效果和影响', scores: { R: 3 } },
        { id: 'b', text: '结果出来后会回想当初的选择', scores: { R: 2 } },
        { id: 'c', text: '如果结果不好才会反思', scores: { R: 1 } },
        { id: 'd', text: '做了就不再想了', scores: { R: 0 } },
        { id: 'e', text: '很少做需要反思的重要决定', scores: { R: 0 } },
      ],
      // v6: 反思对成长的价值
      [
        { id: 'a', text: '核心——没有反思就没有真正的成长', scores: { R: 3 } },
        { id: 'b', text: '重要——能帮助不断改进', scores: { R: 2 } },
        { id: 'c', text: '有一定帮助', scores: { R: 1 } },
        { id: 'd', text: '行动比反思更重要', scores: { R: 0 } },
        { id: 'e', text: '没太想过这个问题', scores: { R: 0 } },
      ],
      // v7: 评价自己的表现
      [
        { id: 'a', text: '从多个维度客观分析优缺点', scores: { R: 3 } },
        { id: 'b', text: '和之前的自己对比看是否进步', scores: { R: 2 } },
        { id: 'c', text: '看别人对我的评价来判断', scores: { R: 1 } },
        { id: 'd', text: '觉得还行就好不太深究', scores: { R: 0 } },
        { id: 'e', text: '不太会评价自己', scores: { R: 0 } },
      ],
    ],
  }

  const dimOptions = optionBank[dim]
  if (dimOptions && dimOptions[variant % dimOptions.length]) {
    return dimOptions[variant % dimOptions.length]
  }
  return [
    { id: 'a', text: '非常积极主动', scores: { [dim]: 3 } },
    { id: 'b', text: '比较积极', scores: { [dim]: 2 } },
    { id: 'c', text: '一般', scores: { [dim]: 1 } },
    { id: 'd', text: '不太积极', scores: { [dim]: 0 } },
    { id: 'e', text: '很少关注', scores: { [dim]: 0 } },
  ]
}

function generateCognitiveQuestions(ag: AgeGroupKey): UnifiedQuestion[] {
  const prefix = `${ag.split('-').map(w => w[0]).join('').toUpperCase()}-COG`
  const qs: UnifiedQuestion[] = []
  let idx = 1

  const cogTexts = [
    '面对一个有多种解决方案的问题，你倾向于？',
    '当两个信息来源给出不同的答案时，你会？',
    '你觉得以下哪种思维方式最重要？',
    '学习新知识时你更倾向于哪种方式？',
    '如果有人提出一个观点你不同意，你会？',
    '你觉得"批判性思维"是什么意思？',
    '面对一个复杂的信息你会怎么处理？',
    '做决策时你更依赖直觉还是分析？',
  ]

  // 每道认知发展题有场景专属选项
  type OptSet = { id: string; text: string; scores: Record<string, number> }[]
  const cogOptionBank: OptSet[] = [
    // v0: 有多种解决方案的问题
    [
      { id: 'a', text: '列出所有方案对比优劣后选最优', scores: { I: 3, R: 1 } },
      { id: 'b', text: '尝试两三种看哪个效果好', scores: { I: 2 } },
      { id: 'c', text: '选看起来最可行的那个', scores: { I: 1 } },
      { id: 'd', text: '选最简单最快的方案', scores: { I: 0 } },
      { id: 'e', text: '不太知道怎么选', scores: { I: 0 } },
    ],
    // v1: 两个信息来源不同答案
    [
      { id: 'a', text: '追溯原始数据来判断哪个更可靠', scores: { I: 3, R: 1 } },
      { id: 'b', text: '找第三方来源交叉验证', scores: { I: 2 } },
      { id: 'c', text: '选更权威的那个来源', scores: { I: 1 } },
      { id: 'd', text: '选自己觉得更合理的', scores: { I: 0 } },
      { id: 'e', text: '不太知道该信谁', scores: { I: 0 } },
    ],
    // v2: 哪种思维方式最重要
    [
      { id: 'a', text: '逻辑推理——基于证据得出结论', scores: { I: 3 } },
      { id: 'b', text: '批判性思维——质疑和反思', scores: { I: 2, R: 1 } },
      { id: 'c', text: '创造性思维——想出新点子', scores: { I: 1, W: 1 } },
      { id: 'd', text: '实用性思维——关注能不能用', scores: { I: 0, D: 1 } },
      { id: 'e', text: '没想过这个问题', scores: { I: 0 } },
    ],
    // v3: 学习新知识的方式
    [
      { id: 'a', text: '理解原理再举一反三', scores: { I: 3, R: 1 } },
      { id: 'b', text: '通过实验或实践来掌握', scores: { I: 2 } },
      { id: 'c', text: '看视频或听讲解', scores: { I: 1 } },
      { id: 'd', text: '反复背诵和练习', scores: { I: 0 } },
      { id: 'e', text: '被动接受就好', scores: { I: 0 } },
    ],
    // v4: 不同意别人的观点
    [
      { id: 'a', text: '用事实和逻辑提出不同看法', scores: { I: 3, R: 1 } },
      { id: 'b', text: '先认可合理部分再指出分歧', scores: { I: 2, L: 1 } },
      { id: 'c', text: '保留意见私下想想', scores: { I: 1, R: 1 } },
      { id: 'd', text: '虽然不同意但不说', scores: { I: 0 } },
      { id: 'e', text: '别人说什么就是什么吧', scores: { I: 0 } },
    ],
    // v5: 什么是批判性思维
    [
      { id: 'a', text: '独立思考、质疑假设、基于证据做判断', scores: { I: 3 } },
      { id: 'b', text: '不盲目接受信息，分析后再相信', scores: { I: 2 } },
      { id: 'c', text: '能发现别人的错误', scores: { I: 1 } },
      { id: 'd', text: '就是批评和否定别人吧', scores: { I: 0 } },
      { id: 'e', text: '不太清楚是什么意思', scores: { I: 0 } },
    ],
    // v6: 处理复杂信息
    [
      { id: 'a', text: '拆解成部分逐一分析再综合', scores: { I: 3, D: 1 } },
      { id: 'b', text: '找出关键信息忽略次要细节', scores: { I: 2, R: 1 } },
      { id: 'c', text: '画思维导图整理关系', scores: { I: 1, D: 1 } },
      { id: 'd', text: '反复看几遍慢慢理解', scores: { I: 0 } },
      { id: 'e', text: '觉得太复杂了直接放弃', scores: { I: 0 } },
    ],
    // v7: 依赖直觉还是分析
    [
      { id: 'a', text: '重要决策靠分析，小事可以凭直觉', scores: { I: 3, R: 1 } },
      { id: 'b', text: '主要靠分析但也参考直觉', scores: { I: 2 } },
      { id: 'c', text: '两者差不多', scores: { I: 1 } },
      { id: 'd', text: '大多数时候凭直觉', scores: { I: 0 } },
      { id: 'e', text: '不太做决策', scores: { I: 0 } },
    ],
  ]

  for (let i = 0; i < cogTexts.length; i++) {
    qs.push(choice(
      `${prefix}-E${String(idx).padStart(3, '0')}`, ag, 'Cognitive',
      cogTexts[i], '认知发展', ['I', 'R'],
      cogOptionBank[i % cogOptionBank.length],
      { difficulty: 3, tags: ['Cognitive', '认知发展'] }
    ))
    idx++
  }

  return qs
}

// ========== 主导出函数 ==========

/** 生成所有扩展题并返回分片元数据 */
export function generateExpandedQuestions(): QuestionChunkMeta[] {
  const chunks: QuestionChunkMeta[] = []
  // 非学龄前的年龄组
  const nonPreschoolGroups: AgeGroupKey[] = ['lower-primary', 'upper-primary', 'middle-school', 'high-school']

  const generators: { model: QuestionModel; fn: (ag: AgeGroupKey) => UnifiedQuestion[] }[] = [
    { model: 'MI', fn: generateMIQuestions },
    { model: 'BigFive', fn: generateBigFiveQuestions },
    { model: 'CHC', fn: generateCHCQuestions },
    { model: 'Grit', fn: generateGritQuestions },
    { model: 'SEL', fn: generateSELQuestions },
    { model: 'EF', fn: generateEFQuestions },
    { model: 'WILDER', fn: generateWILDERExpandedQuestions },
    { model: 'Cognitive', fn: generateCognitiveQuestions },
  ]

  for (const gen of generators) {
    for (const ag of nonPreschoolGroups) {
      const questions = gen.fn(ag)
      if (questions.length === 0) continue

      const dims = new Set<string>()
      let choiceCount = 0
      let judgmentCount = 0
      for (const q of questions) {
        q.wilderMapping.forEach(d => dims.add(d))
        if (q.type === 'choice') choiceCount++
        else judgmentCount++
      }

      chunks.push({
        chunkId: `expanded-${gen.model}-${ag}`,
        model: gen.model,
        ageGroup: ag,
        count: questions.length,
        dimensions: [...dims],
        typeDistribution: { choice: choiceCount, judgment: judgmentCount },
        loader: async () => questions,
      })
    }
  }

  return chunks
}
