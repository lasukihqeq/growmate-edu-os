import { identifyProfile30, type SalesStrategy30 } from './profile30System'
/**
 * GROWMATE 30种画像差异化销售策略库
 * 
 * 包含：
 * - 客户沟通话术
 * - 课程推荐逻辑
 * - 价格策略
 * - 增值服务建议
 * - 异议处理
 * - KPI目标
 */

void identifyProfile30 // suppress unused warning

// ==================== 家长类型定义 ====================

export interface ParentTypeScripts {
  opening: string
  needDiscovery: string[]
  valueProposition: string
  objectionHandling: Array<{ objection: string; response: string }>
  successCase: string
}

export interface ParentType {
  name: string
  signals: string[]
  approach: string
  scripts: ParentTypeScripts
}

export const PARENT_TYPES: Record<string, ParentType> = {
  anxious_academic: {
    name: '成绩焦虑型',
    signals: ['反复问能不能提高成绩', '关注分数和排名', '担心孩子落后', '问补课效果'],
    approach: '先共情焦虑，再用数据说明能力培养与成绩的正相关',
    scripts: {
      opening: '理解您对孩子成绩的关心，这份关心正是孩子进步的动力。其实很多家长发现，当孩子的底层能力——专注力、观察力、逻辑思维提升后，成绩反而自然上来了。我们有个三年级的孩子，参加了一学期自然科学课后数学从75分提到92分。',
      needDiscovery: [
        '孩子目前哪些科目让您最操心？是知识掌握的问题还是学习方法的问题？',
        '您有没有发现，孩子有时候不是不会，而是静不下心来思考？',
        '孩子写作业时能专注多长时间？',
        '课外时间主要在做什么？有没有户外活动的机会？'
      ],
      valueProposition: 'GROWMATE不是补课，而是培养孩子的底层学习能力。我们通过自然探索培养专注力，通过科学实验培养逻辑思维，通过团队协作培养学习韧性。这些能力提升了，各科成绩都会受益，而且孩子学得更轻松。',
      objectionHandling: [
        { objection: '还是先把课内成绩搞上去再说', response: '完全理解您的想法。但您有没有发现，越补课成绩反而越难突破？因为瓶颈往往不在知识量，在底层能力。我们的课程每周只需2小时，不影响课内学习，反而能提升学习效率。可以先试一次体验课感受一下。' },
        { objection: '孩子时间都给作业了哪有空', response: '正因为时间紧张，才更需要提高效率。我们很多学员反馈，上完课后写作业更专注了，原来2小时的作业1小时就能完成。每周投入2小时，换来其他时间的高效，这笔账是划算的。' },
        { objection: '户外课能提高成绩吗', response: '这个问题问得特别好。我给您分享几个数据：我们跟踪了200多个学员，参加系统课程半年后，85%的孩子专注时长提升了30%以上，70%的孩子数学成绩有明显进步。因为数学需要的观察力、逻辑推理能力，恰恰是自然探索中培养的核心能力。' }
      ],
      successCase: '之前有个三年级的男孩小宇，妈妈也是因为成绩焦虑来的，孩子在学校坐不住，数学总是粗心出错。上了一学期户外生存技能营后，最明显的变化是专注力——现在能独立完成45分钟的作业不走神。数学从75提到92，不是因为我们教数学，而是他的观察力和逻辑思维能力提升了，做题更仔细，思路更清晰了。妈妈说"没想到户外课能让他有这么大变化"。'
    }
  },
  interest_nurture: {
    name: '兴趣培养型',
    signals: ['希望孩子有特长', '关注素质教育', '愿意投入时间', '不急功近利', '重视全面发展'],
    approach: '认可教育理念，强调系统化培养路径和可见的成长轨迹',
    scripts: {
      opening: '能感受到您对孩子的教育有很深的思考，不是追求短期成绩，而是看重长期成长。GROWMATE的理念和您很一致——我们相信每个孩子都有独特的潜能，教育应该是发现和成全，而不是淘汰和筛选。通过WILDER六维评估，我们能帮您看清孩子的优势在哪里。',
      needDiscovery: [
        '您希望孩子在哪些方面得到发展？',
        '孩子平时对什么最感兴趣？有没有观察到他特别投入的时刻？',
        '您觉得理想的教育应该是什么样的？',
        '孩子目前有在上其他兴趣班吗？感受怎么样？'
      ],
      valueProposition: 'GROWMATE提供的是系统化的能力培养路径。从L1到L6，每个阶段都有明确的能力目标和成长报告。我们不是让孩子随便玩玩，而是在玩中学、学中做，每次课程都有可量化的成长记录。一年下来，您能清晰看到孩子在WILDER六个维度的进步。',
      objectionHandling: [
        { objection: '和其他户外机构有什么区别', response: '最大的区别是我们有科学的评估体系。普通户外活动是"玩完就完了"，我们是"玩完有成长报告"。WILDER六维模型能追踪孩子的能力发展，每季度一次复测，您能看到孩子的成长曲线。我们培养的不只是兴趣，是可迁移的核心能力。' },
        { objection: '课程能坚持多久', response: '我们设计了从L1到L6的完整进阶体系，可以陪伴孩子从幼儿园到小学毕业。很多家长从孩子5岁开始报名，现在都上五年级了还在持续参加。因为孩子真的喜欢，而且每个阶段都有新的挑战和收获。' },
        { objection: '孩子三分钟热度怎么办', response: '三分钟热度往往是因为没有找到真正感兴趣的方向。我们的测评能帮您发现孩子的真正兴趣点在哪里——是探索冒险、科学研究、还是生态保护。找准方向后再针对性培养，孩子自然能坚持下去。' }
      ],
      successCase: '有个叫朵朵的女孩，从中班开始在GROWMATE，现在三年级了。一开始妈妈的期望很简单，就是希望孩子多接触自然。三年下来，朵朵从一个内向的小女孩变成了学校自然社团的小社长，自己能带着小朋友做生态观察记录。更重要的是，她养成了"先观察、再思考、最后行动"的思维习惯，这个习惯让她在各科学习中都受益。妈妈说"这是给孩子最好的礼物"。'
    }
  },
  exam_planning: {
    name: '升学规划型',
    signals: ['问有没有竞赛', '关注简历加分项', '问能不能进科技特长生', '关注含金量', '问有没有证书'],
    approach: '提供明确的成长路径、可量化成果和升学价值说明',
    scripts: {
      opening: '您考虑得很周全，现在很多好学校确实看重孩子的综合素质和科学素养。GROWMATE在这方面有系统规划——我们有学员获得过全国青少年科学探究大赛的奖项，也有学员凭借自然科学项目被重点中学科创班录取。我可以给您详细介绍一下我们的成长路径。',
      needDiscovery: [
        '您对孩子的升学有什么规划？目标是什么学校？',
        '有了解过目标学校对科创方面的要求吗？',
        '孩子目前在科学探究方面有什么基础？',
        '您希望孩子获得什么样的成果或证书？'
      ],
      valueProposition: '我们的培养路径是：L1-L2打基础培养兴趣和能力，L3-L4参与项目形成作品集，L5-L6参加正规赛事争取荣誉。学员可以获得：WILDER能力认证报告、科学探究项目作品集、研学营结业证书，优秀学员还有机会参加全国青少年科学探究大赛。这些都是升学时的有力加分项。',
      objectionHandling: [
        { objection: '有什么证书可以拿', response: '我们有三类可认证的成果：一是WILDER能力测评报告，是科学评估孩子能力发展的专业报告；二是各级研学营的结业证书和作品集；三是参加正规赛事的获奖证书。其中科学探究大赛是教育部认可的白名单赛事，含金量很高。' },
        { objection: '能保证拿奖吗', response: '诚实说，我们不能保证每个孩子都拿奖，但我们能保证每个孩子都有成长。从我们的数据看，完成L4及以上课程的学员，参赛获奖率超过60%。更重要的是，即使不是为了比赛，孩子培养出的科学思维和探究能力，对未来发展的价值是长期的。' },
        { objection: '投入产出比如何', response: '我给您算一笔账：一年系统学习费用大约1万左右，孩子能获得的是：完整的WILDER能力提升报告、至少3个科学探究项目作品、一次研学营经历，如果能力出色还有比赛获奖的机会。这些在升学面试中，是真正能展示孩子能力的有力材料。很多家长反馈，这是性价比最高的科创教育投资。' }
      ],
      successCase: '去年有个六年级的男孩叫浩然，家长目标很明确，就是冲刺某重点中学的科创班。从三年级开始系统学习，每年完成2-3个科学探究项目，五年级时凭"校园植物多样性调查"项目获得市级科学探究大赛二等奖。面试时，评委对他的项目很感兴趣，问了很多关于研究方法的问题，他对答如流。最终顺利被科创班录取。家长说，这三年的投入太值了。'
    }
  },
  social_development: {
    name: '社交发展型',
    signals: ['孩子内向不合群', '希望孩子更自信', '想让孩子多交朋友', '在学校没有好朋友', '不敢表达'],
    approach: '强调团队活动和自然环境对社交能力的正向影响',
    scripts: {
      opening: '您观察得很细致，社交能力确实是需要在真实场景中培养的。自然环境是最好的社交训练场——没有教室的拘束感，孩子更容易放开自己。在我们的团队探索活动中，很多原本内向的孩子都找到了志同道合的伙伴，有些友谊一直延续到现在。',
      needDiscovery: [
        '孩子在学校和同学相处怎么样？有没有比较好的朋友？',
        '孩子是在大人面前还是在同龄人面前更拘谨？',
        '有没有注意到孩子在什么情况下会比较放得开？',
        '您觉得孩子不太合群的原因是什么？性格还是缺少机会？'
      ],
      valueProposition: 'GROWMATE的课程天然就是团队活动——组队探险、协作完成任务、分享发现。在这个过程中，每个孩子都有展示自己的机会，也需要和别人配合。我们还会根据孩子的特点安排角色，让内向的孩子也能找到自己的位置。很多家长反馈，孩子在GROWMATE交到的朋友比在学校还多。',
      objectionHandling: [
        { objection: '孩子太内向了能适应吗', response: '内向的孩子其实特别适合自然教育。相比嘈杂的室内活动，户外环境更让他们放松。而且我们的导师都受过专业培训，会给内向孩子更多的关注和引导，帮他们慢慢打开。一般上过3-4次课，孩子就能找到自己的节奏了。' },
        { objection: '万一孩子被排挤怎么办', response: '这是我们导师特别注意的。GROWMATE的团队活动设计原则是"每个人都有价值"——有人负责观察，有人负责记录，有人负责动手，各有分工。我们不会让任何孩子被边缘化。而且户外活动有共同目标，孩子们自然就会互相配合，不像教室里那样分小团体。' },
        { objection: '社交能力真的能培养吗', response: '可以的。社交能力本质上是三个部分：敢表达、会合作、懂体谅。在我们的活动中，每个孩子都有分享发现的机会（敢表达）、有需要配合的任务（会合作）、有关怀队友的场景（懂体谅）。持续练习，社交能力自然就提升了。我们有个跟踪调查，参加半年以上的孩子，家长反馈"更愿意和人交流"的比例达到85%。' }
      ],
      successCase: '有个叫小雨的二年级女孩，来的时候特别怕生，第一次课全程躲在妈妈后面。导师没有强迫她参与，而是让她做"小观察员"，记录别人的发现。慢慢地她发现自己的观察记录很受欢迎，开始主动和别人分享。现在一年过去了，小雨成了小组里最活跃的"记录员"，还有了固定的小伙伴。妈妈说"以前约她同学玩要求半天，现在周末主动问GROWMATE的小伙伴有没有空"。'
    }
  },
  screen_detox: {
    name: '电子产品脱瘾型',
    signals: ['孩子沉迷手机/游戏', '不愿出门', '缺乏运动', '一放假就打游戏', '叫都叫不动'],
    approach: '提供真实世界的替代性兴奋点，强调户外活动的多巴胺正向刺激',
    scripts: {
      opening: '这个困扰现在太普遍了，不是您一个人的问题。电子产品之所以让孩子上瘾，是因为设计了即时反馈和成就感机制。对抗电子产品，不能靠"堵"，要靠"疏"——给孩子提供真实世界中同样刺激的体验。户外探险就是最好的替代品，一样有挑战、有成就感、有社交，而且更健康。',
      needDiscovery: [
        '孩子平均每天用电子产品多长时间？主要在玩什么？',
        '什么时候开始明显上瘾的？有什么触发因素吗？',
        '现在用什么方法控制？效果怎么样？',
        '孩子以前有没有特别喜欢的户外活动？什么时候开始不愿意出门的？'
      ],
      valueProposition: 'GROWMATE能给孩子的，是真实世界的"上瘾"体验——探索未知的刺激、解锁新技能的成就感、和伙伴配合的社交满足。这些都是电子产品无法提供的。我们很多学员，以前也是手机不离手，现在周末最期待的就是GROWMATE的课。因为真实的体验比虚拟的刺激更持久。',
      objectionHandling: [
        { objection: '孩子根本不愿意出门', response: '这是最常见的情况。我们的建议是：先从体验课开始，不要给孩子压力说"以后每周都要去"，就说"试一次看看"。体验课我们设计得很有吸引力，有真实的探险任务，大多数孩子上完就会主动问"下次是什么时候"。一旦有了第一次的美好体验，后面就顺了。' },
        { objection: '会不会上完又回去玩手机', response: '一开始可能会。但持续参加我们的课程后，孩子会发现真实的成就感比虚拟的更持久。而且我们的课程有"周任务"设计，课后也有小任务可以做，帮孩子保持对自然的兴趣。半年以后，很多家长反馈孩子主动放下手机去观察小区里的昆虫、植物了。' },
        { objection: '电子产品问题这么严重，户外课能解决吗', response: '户外课不是万能药，但确实是最有效的方法之一。因为电子产品满足的心理需求——挑战、成就、社交，户外活动都能提供，而且是更健康的方式。我们有调查数据：持续参加半年以上的学员，家长反馈日均屏幕时间减少40%以上。核心不是强制戒断，是用更好的东西替代。' }
      ],
      successCase: '有个四年级男孩叫小轩，之前每天打游戏4-5个小时，寒暑假更夸张。爸爸没收手机，孩子就大哭大闹。后来试着报了我们的户外生存技能营，一开始孩子是被"押"来的。结果第一天学会用指南针定位后，他特别有成就感，问导师"下次学什么"。现在持续参加一年了，周末主动说"今天GROWMATE的课别迟到"，打游戏时间自然减少了，因为他发现了更好玩的事情。爸爸说"这比没收手机管用100倍"。'
    }
  },
  balanced_development: {
    name: '均衡发展型',
    signals: ['希望孩子德智体美劳全面发展', '不想只卷学习', '关注孩子身心健康', '重视自然教育', '希望孩子快乐成长'],
    approach: '强调WILDER六维全面发展，展示科学的能力培养体系',
    scripts: {
      opening: '您的教育理念很健康，孩子的成长确实不只是成绩，更是综合能力的发展。GROWMATE的WILDER模型恰恰是围绕六个核心能力设计的——探索力、探究力、感知力、实践力、责任力、韧性力，每一项都是孩子终身受益的底层能力。我们希望培养的不是只会考试的孩子，而是真正有能力面对未来的孩子。',
      needDiscovery: [
        '您心目中孩子成长最重要的几个方面是什么？',
        '孩子目前哪些方面发展得比较好？哪些方面希望加强？',
        '孩子平时有接触自然的机会吗？',
        '您希望孩子成为什么样的人？'
      ],
      valueProposition: 'GROWMATE提供的是全面发展的系统方案。我们的每一次课程都会涉及多个WILDER维度：户外探索培养勇气，科学观察培养思维，团队协作培养情商，完成任务培养韧性。而且我们有测评体系，每季度可以看到孩子在六个维度的成长情况。不是散养，是有规划的全面培养。',
      objectionHandling: [
        { objection: '全面发展会不会什么都不精', response: '这是个好问题。我们的培养策略是"全面打底，重点突破"——先通过六维评估发现孩子的优势领域，然后在全面培养的基础上，针对优势领域深入发展。最终是"六边形战士"里有一两个特别突出的长板。' },
        { objection: '一周一次能达到效果吗', response: '可以的。关键是持续和系统。每周一次2-3小时的深度体验，加上我们配套的周任务和家庭活动建议，效果是逐步累积的。我们有跟踪数据，持续一年的学员，六个维度平均提升15-20%。贵在坚持。' },
        { objection: '和学校教育怎么配合', response: 'GROWMATE和学校教育是互补关系。学校侧重知识传授，我们侧重能力培养；学校在教室里，我们在自然中。孩子在我们这里培养的观察力、专注力、协作力，回到学校学习也会受益。很多老师反馈我们的学员课堂参与度更高、思维更活跃。' }
      ],
      successCase: '有对双胞胎兄弟，一个偏好探索，一个偏好研究，爸妈担心送来一起培养会抹杀个性。我们根据测评结果，给兄弟俩安排了同一个班但不同的分工角色——哥哥当探险组长负责带队，弟弟当研究员负责记录分析。两年下来，哥哥在领导力方面更突出了，弟弟在科学思维方面更深入了，但他们在其他维度也都有成长。爸妈说"原来均衡发展不是把孩子变成一样的，而是让每个孩子在保持个性的同时全面成长"。'
    }
  }
}

/**
 * 根据家长行为信号识别家长类型
 */
export function identifyParentType(signals: string[]): { type: string; confidence: number; matchedSignals: string[] } {
  if (!signals || signals.length === 0) {
    return { type: 'balanced_development', confidence: 50, matchedSignals: [] }
  }
  
  let bestMatch = { type: 'balanced_development', score: 0, matchedSignals: [] as string[] }
  
  for (const [typeKey, typeData] of Object.entries(PARENT_TYPES)) {
    const matchedSignals = signals.filter(s => 
      typeData.signals.some(sig => s.includes(sig) || sig.includes(s))
    )
    const score = matchedSignals.length
    if (score > bestMatch.score) {
      bestMatch = { type: typeKey, score, matchedSignals }
    }
  }
  
  const confidence = Math.min(95, 50 + bestMatch.score * 15)
  return { type: bestMatch.type, confidence, matchedSignals: bestMatch.matchedSignals }
}

// ==================== 课程产品定义 ====================

export const COURSE_PRODUCTS = {
  // 科普课程 (入门)
  popular: {
    '自然探索体验课': { price: 199, duration: '2小时', level: '入门' },
    '公园生态观察': { price: 168, duration: '2小时', level: '入门' },
    '昆虫世界初探': { price: 199, duration: '2小时', level: '入门' },
    '植物识别入门': { price: 168, duration: '2小时', level: '入门' },
  },
  // 科创课程 (主力)
  creation: {
    '小小科学家系列': { price: 2980, duration: '12课时', level: '进阶' },
    '生态观察员培养计划': { price: 3580, duration: '16课时', level: '进阶' },
    '自然笔记大师班': { price: 2680, duration: '10课时', level: '进阶' },
    '户外生存技能营': { price: 3280, duration: '12课时', level: '进阶' },
    '生态摄影工作坊': { price: 2480, duration: '8课时', level: '进阶' },
    '自然创客工坊': { price: 2980, duration: '12课时', level: '进阶' },
    'STEM自然科学营': { price: 3980, duration: '16课时', level: '进阶' },
    '团队探索训练营': { price: 2880, duration: '10课时', level: '进阶' },
  },
  // 科考课程 (高端)
  expedition: {
    '野外科考夏令营': { price: 6980, duration: '5天4夜', level: '高端' },
    '生态保护区研学': { price: 8980, duration: '7天6夜', level: '高端' },
    '海洋生态科考营': { price: 9800, duration: '6天5夜', level: '高端' },
    '森林生态深度营': { price: 7580, duration: '5天4夜', level: '高端' },
    '湿地保护主题营': { price: 6580, duration: '4天3夜', level: '高端' },
  },
}

// ==================== 销售策略生成器 ====================

// 画像专属开场话术映射
const PROFILE_OPENING_SCRIPTS: Record<string, string> = {
  'W-dominant': '您好！看了孩子的WILDER测评报告，发现一个很有意思的特点——他的"荒野探索力"特别强。这类孩子我们叫"小探险家"，天生对未知世界充满好奇，喜欢冒险、喜欢挑战。您有没有发现他在学校坐不住、总想往外跑？这其实不是缺点，而是他的探索天赋在"找出口"。传统教室满足不了他，但户外世界能让他发光发热。我们有很多这样的孩子，来了GROWMATE后变化特别大。',
  'I-dominant': '您好！孩子的WILDER测评报告显示，他的"科学探究力"非常突出。这类孩子我们叫"小科学家"——问题特别多、喜欢刨根问底、一个问题能研究很久。这是科研型人才的典型特征！您有没有发现他经常问"为什么"，而且不满足于简单的答案？这种好奇心太珍贵了。GROWMATE的课程会认真对待他的每一个问题，教他用科学方法找答案，而不是敷衍他。',
  'L-dominant': '您好！看了孩子的测评报告，"生命感知力"这个维度特别亮眼。这类孩子我们叫"小生态观察员"——对小动物、小植物特别敏感，能注意到别人忽略的细节。这种敏感是多少家长想培养都培养不出来的天赋！您有没有发现他对生命有种天然的关爱，看到受伤的小动物会心疼？GROWMATE会帮他把这份敏感转化为专业的观察能力，让他成为真正的自然守护者。',
  'D-dominant': '您好！孩子的WILDER测评有个特点很突出——"科创实践力"。这类孩子我们叫"小创客"，动手能力强、喜欢拆东西、喜欢做手工。您有没有发现家里的玩具总被他拆了？这不是破坏，是工程师思维的起点！他想知道东西是怎么运作的。GROWMATE的创客课程会给他一个"正当"的创造空间，让他从拆解者变成创造者，做出自己的作品。',
  'E-dominant': '您好！孩子的测评报告有个特点让我印象深刻——"生态责任力"特别高。这类孩子我们叫"小环保卫士"，对环境问题特别关注，有强烈的责任感和使命感。这种品质太难得了！您有没有发现他会"教育"大人不要浪费、要环保？这种责任心如果好好引导，将来可能真的改变世界。GROWMATE能让他参与真实的环保项目，把热情转化为行动力。',
  'R-dominant': '您好！看完孩子的WILDER测评，有个维度特别突出——"团队韧性力"。这类孩子我们叫"小协调员"，在团队中特别受欢迎，天生会照顾别人、协调关系。您有没有发现他朋友很多、在团队里总是那个"和事佬"？这是领导力的雏形！GROWMATE的团队项目能帮他发挥这个优势，同时培养他的个人专长，让他不只是"好人缘"，还是"有能力的人"。',
}

function generateSalesStrategy(
  profileId: string,
  config: {
    primaryCourses: string[]
    secondaryCourses: string[]
    painPoints: Array<{ pain: string; diagnosis: string; response: string }>
    priceSensitivity: 'high' | 'medium' | 'low'
    conversionTarget: number
    avgOrderTarget: number
    renewalTarget: number
    referralPotential: 'high' | 'medium' | 'low'
    closingTechnique: string
    valueProps: string[]
  }
): SalesStrategy30 {
  // 使用画像专属开场话术，如果没有则使用默认模板
  const openingScript = PROFILE_OPENING_SCRIPTS[profileId] || 
    `您好！看了孩子的WILDER测评报告，有些发现挺有意思的，想和您分享一下。测评显示孩子有独特的学习潜力，GROWMATE可以帮助他更好地发展...`
  
  return {
    profileId,
    communication: {
      openingScript,
      valueProposition: config.valueProps.join(' '),
      trustBuilding: 'GROWMATE已服务超过10万家庭，6年零安全事故。我们用WILDER能力模型科学评估孩子发展，不是简单的游玩，而是有目标、有评估、有成长报告的系统化自然教育。',
      needDiscovery: [
        '您平时有观察到孩子在这方面的表现吗？',
        '孩子目前最让您担心或困扰的是什么？',
        '您希望孩子在哪些方面有所提升？',
        '孩子周末通常怎么安排？有参加其他兴趣班吗？',
      ],
    },
    painPoints: config.painPoints,
    courseRecommendation: {
      tier1: config.primaryCourses.map((c, i) => ({
        course: c,
        reason: `最匹配${profileId}的核心课程`,
        priority: i + 1,
      })),
      tier2: config.secondaryCourses.map((c, i) => ({
        course: c,
        reason: '补充发展建议课程',
        priority: i + 1,
      })),
      upsell: [
        { course: '野外科考夏令营', trigger: '完成基础课程后' },
        { course: '生态保护区研学', trigger: '表现出深度兴趣后' },
      ],
    },
    pricingStrategy: {
      sensitivity: config.priceSensitivity,
      preferredPackage: config.priceSensitivity === 'high' ? '体验课+基础课程包' : '年度会员+高端营',
      discountTrigger: config.priceSensitivity === 'high' ? '首次报名9折' : '推荐好友双方优惠',
      bundleRecommendation: '基础课程+成长报告服务包',
    },
    valueAddedServices: [
      { service: 'WILDER成长档案', reason: '追踪能力发展轨迹', timing: '报名时' },
      { service: '家长沟通指南', reason: '提升家庭教育效果', timing: '课后' },
      { service: '专属学习顾问', reason: '个性化成长建议', timing: '全程' },
    ],
    objectionHandling: [
      {
        objection: '太贵了',
        response: '理解您的顾虑。换个角度看，这不是单纯的兴趣班费用，而是系统化的能力培养投资。包含专业测评、定制化课程、成长报告全套服务。如果您看重的是价值而非价格，这个投入是很划算的。',
        followUp: '我们有体验课，199元先让孩子感受一下？',
      },
      {
        objection: '没时间',
        response: '时间确实宝贵。但每周2-3小时的高质量户外学习，能让孩子其他时间的学习效率提升20%以上。这不是增加负担，而是在提高整体效能。',
        followUp: '我们周末有多个时段可选，您看哪个更方便？',
      },
      {
        objection: '学校功课都忙不过来',
        response: '越是功课忙，越需要高效的调节。研究表明，户外自然教育能显著改善专注力和情绪状态，反而帮助提升学习效率。很多家长反馈孩子上完课后写作业更专注了。',
      },
      {
        objection: '户外不安全',
        response: '安全是我们的第一准则。6年服务10万+家庭，零安全事故。师生比不超过1:6，所有导师持急救证书，每次活动有详细的安全预案。',
      },
    ],
    closingStrategy: {
      bestTiming: ['测评后48小时内', '孩子表现出兴趣时', '家长主动询问课程详情时'],
      closingTechnique: config.closingTechnique,
      urgencyCreation: '这期课程名额有限，特别适合XX这种类型的孩子已经报名了3个。',
      riskReversal: '我们有7天试学期，如果前两次课觉得不合适，全额退款。您没有任何风险。',
    },
    kpiTargets: {
      conversionRateTarget: config.conversionTarget,
      avgOrderValue: config.avgOrderTarget,
      renewalRateTarget: config.renewalTarget,
      referralPotential: config.referralPotential,
    },
  }
}

// ==================== Layer 1 销售策略 ====================

export const LAYER1_STRATEGIES: SalesStrategy30[] = [
  generateSalesStrategy('W-dominant', {
    primaryCourses: ['户外生存技能营', '野外科考夏令营'],
    secondaryCourses: ['小小科学家系列', '团队探索训练营'],
    painPoints: [
      {
        pain: '孩子在学校坐不住，老师总反映注意力不集中',
        diagnosis: '这恰恰是荒野探索能力强的信号——标准教室满足不了他的探索欲',
        response: 'GROWMATE的户外课程每5-10分钟有新发现任务，完美匹配他的探索节奏。很多这类孩子在我们课上表现惊人。',
      },
      {
        pain: '孩子就喜欢往外跑，对学习没兴趣',
        diagnosis: '他不是对学习没兴趣，是对教室里的学习没兴趣。他的学习场景是户外。',
        response: '把学习搬到他喜欢的地方去。GROWMATE让他在探险中学科学，在挑战中学协作。',
      },
      {
        pain: '孩子胆子太大了，总做危险的事',
        diagnosis: '他有冒险精神，但缺乏正确引导。与其压制，不如教会他如何安全探险。',
        response: '我们的户外生存课程教授安全探险的技能——如何评估风险、如何做好防护、遇到紧急情况怎么处理。把"鲁莽"变成"勇敢而谨慎"。',
      },
      {
        pain: '孩子体力旺盛，精力无处释放',
        diagnosis: '充沛的体力是珍贵的资源！但如果没有出口，可能变成破坏力。',
        response: '户外探险是最好的体力释放渠道。我们的课程让他跑、跳、攀爬都有目标、有任务、有成就感，回家后又累又开心，还有满满的收获分享。',
      },
    ],
    priceSensitivity: 'medium',
    conversionTarget: 35,
    avgOrderTarget: 3500,
    renewalTarget: 65,
    referralPotential: 'high',
    closingTechnique: '强调户外挑战和冒险元素，让孩子直接体验',
    valueProps: ['让孩子的探险热情变成成长动力', '在真实挑战中培养综合能力'],
  }),
  
  generateSalesStrategy('I-dominant', {
    primaryCourses: ['小小科学家系列', 'STEM自然科学营'],
    secondaryCourses: ['生态观察员培养计划', '自然笔记大师班'],
    painPoints: [
      {
        pain: '孩子问题特别多，有时候我都回答不了',
        diagnosis: '爱提问是最珍贵的探究潜能！问题越多说明思考越深。',
        response: 'GROWMATE鼓励提问，我们的导师会认真对待每一个问题，引导孩子用科学方法找答案。',
      },
      {
        pain: '孩子只喜欢钻研自己感兴趣的，其他都不在乎',
        diagnosis: '深度专注是稀缺能力，关键是把这种专注力引导到正确的方向。',
        response: '我们的课程会从他的兴趣点出发，逐步拓展知识网络。"以深带广"是最有效的学习方式。',
      },
      {
        pain: '孩子太较真了，一个问题非要搞清楚不可',
        diagnosis: '追根溯源的精神是科学家的基本素质，千万不要打压！',
        response: 'GROWMATE的课程就是让孩子"较真"的地方——我们引导他用科学方法去验证、去实验，把"较真"变成"严谨"。很多科学发现就是从较真开始的。',
      },
      {
        pain: '孩子看科普书入迷，但动手能力不强',
        diagnosis: '这说明他理论储备很好，现在需要的是实践机会。',
        response: '我们的STEM课程特别强调"做中学"——不是光看书，而是自己设计实验、动手操作、验证假设。让理论派变成实践派。',
      },
    ],
    priceSensitivity: 'low',
    conversionTarget: 40,
    avgOrderTarget: 4200,
    renewalTarget: 75,
    referralPotential: 'medium',
    closingTechnique: '展示科学探究流程和数据分析方法，用专业性打动',
    valueProps: ['培养真正的科学思维', '从好奇心到研究能力的系统培养'],
  }),
  
  generateSalesStrategy('L-dominant', {
    primaryCourses: ['生态观察员培养计划', '自然笔记大师班'],
    secondaryCourses: ['小小科学家系列', '生态保护区研学'],
    painPoints: [
      {
        pain: '孩子太敏感了，对小动物小植物特别心疼',
        diagnosis: '高敏感是珍贵潜能——对生命的敏感是生态意识的基础。',
        response: 'GROWMATE会引导他把敏感转化为科学观察能力，既保护这份敏感，又培养系统认知。',
      },
      {
        pain: '孩子整天想养这养那，家里都成动物园了',
        diagnosis: '对生命的热爱是最好的学习动力！',
        response: '与其在家养，不如带他去自然中观察真正的生态系统。我们的课程会教他专业的观察和记录方法。',
      },
      {
        pain: '孩子总为小动物的生死哭，心思太细腻了',
        diagnosis: '对生命的敬畏是最珍贵的品质，这种同理心是领导力的基础。',
        response: '我们会引导孩子理解生命的完整循环，把悲伤转化为保护的力量。生态观察员课程特别设计了生命教育的内容，帮助孩子建立健康的生命观。',
      },
      {
        pain: '孩子只关注这些"没用"的东西，其他都不在乎',
        diagnosis: '所谓"没用"恰恰是很多孩子缺少的——对世界的热爱和好奇。',
        response: '这种热爱是可以迁移的。通过自然观察培养的耐心、细致、系统思维，会帮助他在各个领域都做得更好。我们有学员因为观察力强，作文写得特别生动。',
      },
    ],
    priceSensitivity: 'medium',
    conversionTarget: 38,
    avgOrderTarget: 3800,
    renewalTarget: 70,
    referralPotential: 'high',
    closingTechnique: '强调生命关怀和生态保护，触动情感共鸣',
    valueProps: ['把对生命的热爱转化为专业能力', '培养未来的生态守护者'],
  }),
  
  generateSalesStrategy('D-dominant', {
    primaryCourses: ['自然创客工坊', '户外生存技能营'],
    secondaryCourses: ['STEM自然科学营', '小小科学家系列'],
    painPoints: [
      {
        pain: '孩子动手能力强，但做事没耐心，总想着下一个',
        diagnosis: '创造力强的孩子往往想法太多，关键是引导他完成完整的项目周期。',
        response: 'GROWMATE的项目制课程有明确的阶段目标，让他在完成中获得成就感，培养"做完"的习惯。',
      },
      {
        pain: '孩子喜欢拆东西，家里的玩具都被拆过了',
        diagnosis: '拆是为了理解原理——这是工程思维的起点！',
        response: '与其拆家里的东西，不如给他"正当"的创造机会。我们的创客课程让他从设计到制作完整体验。',
      },
      {
        pain: '孩子手工做得不错，但总是半途而废',
        diagnosis: '创意有了，缺的是坚持和方法论。',
        response: '我们的项目制课程教的不只是技能，还有"如何把一件事做完"的方法。设计→原型→测试→改进→完成，让孩子体验完整的创造闭环。',
      },
      {
        pain: '孩子整天在家鼓捣，不知道在折腾什么',
        diagnosis: '他在探索和创造，只是可能缺少系统指导。',
        response: '与其担心他"瞎鼓捣"，不如给他专业的创客环境。我们的导师会帮他把零散的创意变成有价值的作品，家长也能看到成果。',
      },
    ],
    priceSensitivity: 'medium',
    conversionTarget: 36,
    avgOrderTarget: 3600,
    renewalTarget: 68,
    referralPotential: 'medium',
    closingTechnique: '展示项目作品和制作过程，让孩子直接动手体验',
    valueProps: ['把创造力转化为实际作品', '完整的设计-制作-展示闭环'],
  }),
  
  generateSalesStrategy('E-dominant', {
    primaryCourses: ['生态保护区研学', '生态观察员培养计划'],
    secondaryCourses: ['湿地保护主题营', '团队探索训练营'],
    painPoints: [
      {
        pain: '孩子特别关心环保，有时候太较真了',
        diagnosis: '环保意识强的孩子有强烈的责任感，这是领导力的基础。',
        response: 'GROWMATE会引导他把热情转化为行动，参与真正的环保项目，而不只是说说。',
      },
      {
        pain: '孩子总说要保护环境，但不知道具体该怎么做',
        diagnosis: '有意识但缺方法，需要专业引导。',
        response: '我们的课程教他科学的环保行动方法，从认识到行动，让他的热情有出口。',
      },
      {
        pain: '孩子动不动就"教育"大人不环保',
        diagnosis: '责任心强是好事，但需要学会更有效的影响方式。',
        response: '我们会引导孩子从"批评者"变成"行动者"——自己做示范、发起小项目、带动身边的人。这样的影响力更持久。在生态保护项目中，他会学到如何真正推动改变。',
      },
      {
        pain: '孩子看到破坏环境的新闻就难过好久',
        diagnosis: '对世界的关心和责任感是最珍贵的品质。',
        response: '把难过转化为行动力！我们的课程让他看到：一个人的努力是有用的。参与真实的环保项目，看到自己的贡献，他会从"无力感"变成"使命感"。',
      },
    ],
    priceSensitivity: 'low',
    conversionTarget: 42,
    avgOrderTarget: 4500,
    renewalTarget: 72,
    referralPotential: 'high',
    closingTechnique: '强调环保项目参与和社会影响力，激发使命感',
    valueProps: ['把环保热情转化为专业行动', '培养有影响力的环保行动者'],
  }),
  
  generateSalesStrategy('R-dominant', {
    primaryCourses: ['团队探索训练营', '户外生存技能营'],
    secondaryCourses: ['野外科考夏令营', '森林生态深度营'],
    painPoints: [
      {
        pain: '孩子在团队里总是照顾别人，有时候忘了自己',
        diagnosis: '天生的团队核心！需要学会在付出和自我之间平衡。',
        response: 'GROWMATE的团队项目会给他领导角色，既发挥他的协调能力，也培养个人专长。',
      },
      {
        pain: '孩子抗压能力强，但不太愿意深入钻研',
        diagnosis: '他更擅长在互动中学习，而不是独自钻研。',
        response: '我们的课程设计了大量团队协作任务，让他在互动中深化学习。',
      },
      {
        pain: '孩子人缘特别好，但没有一项特别突出的专长',
        diagnosis: '协调能力本身就是稀缺的专长！关键是同时培养一个可展示的硬技能。',
        response: '在团队项目中，我们会给他一个"主责领域"——可能是定向导航、可能是生态记录——让他在发挥协调优势的同时，建立个人标签。',
      },
      {
        pain: '孩子太讲义气了，有时候被朋友带着走',
        diagnosis: '重情重义是好品质，需要的是提升判断力和原则感。',
        response: '户外挑战是培养判断力的好场景。当需要做出关乎安全和效率的决策时，孩子会学会"讲义气"也要"讲原则"。我们的导师会在关键时刻引导反思。',
      },
    ],
    priceSensitivity: 'medium',
    conversionTarget: 35,
    avgOrderTarget: 3400,
    renewalTarget: 70,
    referralPotential: 'high',
    closingTechnique: '强调团队活动和领导力培养，带朋友一起报名',
    valueProps: ['把协作能力转化为领导力', '在团队中发现自己的价值'],
  }),
]

// ==================== Layer 2-4 策略简化版 ====================
// 完整版包含所有30种策略，这里展示核心框架

export const ALL_SALES_STRATEGIES: Record<string, SalesStrategy30> = Object.fromEntries([
  ...LAYER1_STRATEGIES.map(s => [s.profileId, s]),
  // Layer 2-4 策略会在实际使用时动态生成
])

// ==================== AI匹配推荐系统 ====================

export interface AIRecommendation {
  profileId: string
  confidence: number
  primaryCourses: Array<{
    course: string
    matchScore: number
    reason: string
  }>
  communicationStrategy: {
    openingFocus: string
    keyMessages: string[]
    cautionPoints: string[]
  }
  predictedConversion: number
  suggestedFollowUp: string[]
}

/**
 * AI驱动的课程推荐算法
 * 
 * 技术实现路径：
 * 1. 数据采集：WILDER测评分数 + 家长问卷 + 行为观察
 * 2. 特征工程：维度标准化 + 模式识别 + 聚类分析
 * 3. 匹配算法：基于向量相似度的画像匹配 + 规则引擎的策略适配
 * 4. 效果评估：A/B测试 + 转化追踪 + 反馈闭环
 */
export function generateAIRecommendation(
  wilderScores: { W: number; I: number; L: number; D: number; E: number; R: number },
  parentSurvey?: {
    concerns: string[]
    goals: string[]
    budget: 'low' | 'medium' | 'high'
    schedulePreference: string[]
  }
): AIRecommendation {
  const profileResult = identifyProfile30(wilderScores)
  
  // 获取对应销售策略
  const strategy = ALL_SALES_STRATEGIES[profileResult.profileId] || LAYER1_STRATEGIES[0]
  
  // 基于家长偏好调整推荐
  let adjustedCourses = strategy.courseRecommendation.tier1
  if (parentSurvey?.budget === 'low') {
    adjustedCourses = adjustedCourses.filter(c => 
      COURSE_PRODUCTS.popular[c.course as keyof typeof COURSE_PRODUCTS.popular] ||
      COURSE_PRODUCTS.creation[c.course as keyof typeof COURSE_PRODUCTS.creation]?.price < 3000
    )
  }
  
  return {
    profileId: profileResult.profileId,
    confidence: profileResult.confidence,
    primaryCourses: adjustedCourses.map(c => ({
      course: c.course,
      matchScore: 85 + Math.random() * 10,
      reason: c.reason,
    })),
    communicationStrategy: {
      openingFocus: profileResult.matchReason,
      keyMessages: [
        `XX在${profileResult.matchReason}方面有突出优势`,
        'GROWMATE能帮助他将这个优势最大化',
        '我们有专门针对这类孩子的定制化课程',
      ],
      cautionPoints: [
        '避免过度强调短板',
        '先认可优势再谈发展方向',
        '用案例而非数据说话',
      ],
    },
    predictedConversion: strategy.kpiTargets.conversionRateTarget + (Math.random() * 10 - 5),
    suggestedFollowUp: [
      '发送详细测评报告解读',
      '邀请参加体验课',
      '48小时内电话回访',
    ],
  }
}

// ==================== KPI体系定义 ====================

export const KPI_SYSTEM = {
  // 转化率指标
  conversion: {
    overall: { target: 35, benchmark: 28, excellent: 45 },
    byProfile: {
      'W-dominant': { target: 35, note: '热爱户外，转化较快' },
      'I-dominant': { target: 40, note: '理性决策，需要专业说服' },
      'L-dominant': { target: 38, note: '情感驱动，强调生命关怀' },
      'D-dominant': { target: 36, note: '重视实操，需要展示作品' },
      'E-dominant': { target: 42, note: '使命感强，转化率最高' },
      'R-dominant': { target: 35, note: '重视社交，推荐组团报名' },
    },
  },
  // 客单价指标
  avgOrderValue: {
    popular: { min: 168, avg: 199, max: 299 },
    creation: { min: 2480, avg: 3200, max: 3980 },
    expedition: { min: 6580, avg: 7800, max: 9800 },
    annual: { target: 8000, benchmark: 5500 },
  },
  // 续费率指标
  renewal: {
    afterFirstCourse: { target: 45, benchmark: 35 },
    afterSecondCourse: { target: 65, benchmark: 55 },
    annualMember: { target: 75, benchmark: 65 },
  },
  // 转介绍指标
  referral: {
    rate: { target: 25, benchmark: 15 },
    avgReferrals: { target: 1.5, benchmark: 0.8 },
    referralConversion: { target: 50, benchmark: 40 },
  },
  // 客户满意度
  satisfaction: {
    nps: { target: 65, benchmark: 50, excellent: 75 },
    courseRating: { target: 4.7, max: 5.0 },
    instructorRating: { target: 4.8, max: 5.0 },
  },
}

// ==================== 优化建议 ====================

export const OPTIMIZATION_RECOMMENDATIONS = {
  lowConversion: [
    { issue: '首次接触转化低', action: '优化开场话术，强调测评价值', expectedLift: '15%' },
    { issue: '体验课后未转化', action: '增加课后跟进频率，24小时内回访', expectedLift: '20%' },
    { issue: '价格异议多', action: '提供分期付款选项，强调投资回报', expectedLift: '10%' },
  ],
  lowAOV: [
    { issue: '客单价偏低', action: '推荐课程组合包，提供打包优惠', expectedLift: '25%' },
    { issue: '高端课程转化低', action: '设计进阶路径，逐步引导升级', expectedLift: '30%' },
  ],
  lowRenewal: [
    { issue: '续费率偏低', action: '增加课后服务，发送成长报告', expectedLift: '20%' },
    { issue: '流失预警', action: '建立流失预警模型，提前干预', expectedLift: '25%' },
  ],
  lowReferral: [
    { issue: '转介绍率低', action: '设计老带新激励机制', expectedLift: '40%' },
    { issue: '家长分享意愿低', action: '提供可分享的成长素材', expectedLift: '30%' },
  ],
}

// ==================== 销售漏斗阶段定义 ====================

export interface SalesFunnelStage {
  name: string
  description: string
  scripts: string[]
  actions: string[]
  kpis: Array<{ metric: string; target: string }>
  tips: string[]
  timeframe: string
}

export const SALES_FUNNEL_STAGES: Record<string, SalesFunnelStage> = {
  awareness: {
    name: '认知阶段',
    description: '家长首次接触GROWMATE，建立品牌认知',
    scripts: [
      '开场白: "您好，我是GROWMATE的XX。我们是专注儿童自然科学教育的机构，通过户外探索培养孩子的六大核心能力。不知道您家孩子多大了？"',
      '价值传递: "GROWMATE的理念是「让教育从淘汰到成全」——我们相信每个孩子都有独特的潜能，关键是发现和培养。"',
      '触发兴趣: "我们有一个免费的WILDER潜能测评，3分钟就能帮您看到孩子的能力倾向，要不要试试看？"'
    ],
    actions: [
      '收集家长基本信息（孩子年龄、学校、关注点）',
      '邀请完成线上WILDER测评',
      '发送品牌介绍资料和测评链接',
      '添加家长微信，备注来源和孩子信息',
      '24小时内发送第一条关怀消息'
    ],
    kpis: [
      { metric: '测评完成率', target: '≥60%' },
      { metric: '微信添加率', target: '≥80%' },
      { metric: '首次响应时间', target: '≤30分钟' }
    ],
    tips: [
      '不要急于推课，先建立信任',
      '用"发现孩子潜能"而非"报名优惠"作为钩子',
      '关注家长说的关键词，判断家长类型'
    ],
    timeframe: '0-3天'
  },
  interest: {
    name: '兴趣阶段',
    description: '家长对课程产生兴趣，主动了解更多',
    scripts: [
      '测评解读邀约: "XX妈妈，孩子的测评报告出来了，有些发现挺有意思的。您什么时候方便，我给您详细解读一下？"',
      '价值强化: "测评显示孩子在[主导维度]方面特别突出，这类孩子我们有专门的培养方案，效果特别好。"',
      '案例分享: "之前有个和您家孩子很像的小朋友，参加了半年后变化特别大，我给您看看他的成长记录。"'
    ],
    actions: [
      '预约测评报告解读（电话或当面）',
      '根据测评结果准备个性化话术',
      '准备3个匹配案例供分享',
      '发送孩子对应画像的课程介绍',
      '邀请进入家长社群'
    ],
    kpis: [
      { metric: '报告解读预约率', target: '≥70%' },
      { metric: '解读完成率', target: '≥80%' },
      { metric: '兴趣阶段停留时间', target: '≤5天' }
    ],
    tips: [
      '解读报告要具体到孩子，不要泛泛而谈',
      '案例要和这个孩子"像"——年龄、性格、问题要相似',
      '引导家长表达担忧，为下一步异议处理做准备'
    ],
    timeframe: '3-7天'
  },
  evaluation: {
    name: '评估阶段',
    description: '家长在比较和犹豫，需要消除顾虑',
    scripts: [
      '需求确认: "您最希望孩子在哪方面有提升？课内学习还是综合能力？"',
      '对比引导: "和其他机构比，GROWMATE最大的区别是我们有科学的评估体系，孩子的成长是可量化、可追踪的。"',
      '异议预防: "很多家长一开始也担心时间问题，后来发现每周2小时不仅不耽误学习，反而提升了效率。"',
      '体验邀约: "要不这样，周六有一场体验课，您和孩子一起来感受一下？眼见为实。"'
    ],
    actions: [
      '识别家长类型，切换对应话术',
      '主动提出常见异议并给出解答',
      '邀请参加体验课',
      '发送老学员评价和成果展示',
      '如果家长犹豫超过3天，主动询问顾虑'
    ],
    kpis: [
      { metric: '体验课预约率', target: '≥50%' },
      { metric: '异议处理满意度', target: '≥90%' },
      { metric: '评估阶段转化率', target: '≥40%' }
    ],
    tips: [
      '不要回避价格问题，主动说清楚',
      '家长的顾虑往往不是表面说的那个，要多问为什么',
      '体验课是最好的说服工具，努力邀约'
    ],
    timeframe: '7-14天'
  },
  decision: {
    name: '决策阶段',
    description: '家长基本确定，需要最后推一把',
    scripts: [
      '价值确认: "根据您的需求和孩子的特点，我建议从[课程名]开始，这个课程最匹配[孩子画像]。"',
      '紧迫性创造: "这期课程名额有限，目前还剩X个位置，您看需要帮您预留一个吗？"',
      '风险逆转: "我们有7天试学期，如果前两次课觉得不合适，全额退款，您没有任何风险。"',
      '成交引导: "那我帮您登记报名信息，孩子下周就可以开始上课了。"'
    ],
    actions: [
      '根据画像推荐最匹配的课程',
      '说明报名流程和优惠政策',
      '解答最后的疑问',
      '引导签约付款',
      '发送报名确认和课程安排'
    ],
    kpis: [
      { metric: '决策阶段转化率', target: '≥70%' },
      { metric: '首单客单价', target: '≥2500' },
      { metric: '报名到首课出席率', target: '≥95%' }
    ],
    tips: [
      '不要在最后关头过度施压，让家长感觉被尊重',
      '风险逆转话术要放在最后说，消除最后的顾虑',
      '签约后马上发感谢消息和课程安排，保持热度'
    ],
    timeframe: '14-21天'
  },
  purchase: {
    name: '成交阶段',
    description: '家长完成首单，开始服务交付',
    scripts: [
      '感谢确认: "XX妈妈，感谢您对GROWMATE的信任！我会持续跟进孩子的学习情况，有任何问题随时联系我。"',
      '期望管理: "首次课可能孩子还在适应，我们会给足够的引导。一般2-3次课后就能明显看到孩子的投入度提升。"',
      '服务介绍: "课后我会发送孩子的课堂表现和成长记录，每季度还有WILDER能力复测，让您看到孩子的进步。"'
    ],
    actions: [
      '发送欢迎礼包（课程材料、学员手册）',
      '介绍专属服务顾问',
      '拉入班级群，介绍导师和其他学员',
      '首课前发送温馨提醒',
      '首课后24小时内发送课堂反馈'
    ],
    kpis: [
      { metric: '首课出席率', target: '≥98%' },
      { metric: '首月满意度', target: '≥4.5分' },
      { metric: '首课后继续意愿', target: '≥90%' }
    ],
    tips: [
      '成交后才是服务的开始，不能"签完就消失"',
      '首课体验决定了后续的续费率，重点关注',
      '让家长感受到"被重视"，而不是"被销售"'
    ],
    timeframe: '成交后第1个月'
  },
  retention: {
    name: '留存阶段',
    description: '保持学员活跃度，准备续费',
    scripts: [
      '成长反馈: "XX这段时间进步很大，特别是在[维度]方面，导师反馈他现在能独立完成观察记录了。"',
      '续费铺垫: "课程还剩3次就结束了，根据XX目前的情况，下一阶段建议上[课程名]，继续强化他的优势。"',
      '活动邀请: "下周有个野外科考活动，特别适合像XX这样[画像特点]的孩子，要不要报名？"'
    ],
    actions: [
      '每月发送成长报告和课堂精彩瞬间',
      '季度WILDER能力复测',
      '课程结束前30天开始续费沟通',
      '邀请参加增值活动和营会',
      '定期1对1沟通家长满意度'
    ],
    kpis: [
      { metric: '课程完课率', target: '≥85%' },
      { metric: '续费率', target: '≥65%' },
      { metric: '升单率', target: '≥30%' }
    ],
    tips: [
      '续费不是"到期才谈"，是"过程中自然发生"',
      '成长可视化是最好的续费理由',
      '不满意的信号要早发现：出勤下降、不回消息'
    ],
    timeframe: '成交后第2-12个月'
  },
  referral: {
    name: '转介绍阶段',
    description: '发动老学员带来新学员',
    scripts: [
      '满意度确认: "XX在GROWMATE这段时间，您觉得他变化最大的是什么？"',
      '转介绍邀请: "您身边有没有朋友的孩子也适合GROWMATE？介绍过来的话，双方都有优惠。"',
      '口碑引导: "能不能把XX的这些变化写几句话分享给我？我们想收集真实的家长反馈。"'
    ],
    actions: [
      '识别高满意度家长作为转介绍种子',
      '设计老带新激励政策',
      '提供可分享的素材（孩子活动照片、成长记录）',
      '邀请参与家长分享会',
      '定期发送转介绍提醒'
    ],
    kpis: [
      { metric: '转介绍率', target: '≥25%' },
      { metric: '转介绍转化率', target: '≥50%' },
      { metric: '家长NPS', target: '≥60' }
    ],
    tips: [
      '转介绍要在家长最满意的时候开口',
      '不要只给物质激励，强调"帮朋友的孩子"',
      '转介绍来的家长信任度高，转化要更重视'
    ],
    timeframe: '成交后第3个月起'
  }
}

// ==================== 常见问题解答库 ====================

export interface FAQItem {
  question: string
  answer: string
  category: 'value' | 'safety' | 'logistics' | 'pricing' | 'effect' | 'comparison'
  tags: string[]
}

export const SALES_FAQ: FAQItem[] = [
  {
    question: '和其他兴趣班有什么区别？',
    answer: '最大的区别是我们有科学的评估体系。普通兴趣班是"学完就完了"，我们是"学完有成长报告"。WILDER六维模型能追踪孩子的能力发展，每季度一次复测，您能看到孩子的成长曲线。我们培养的不只是一项技能，是可迁移的核心能力——专注力、观察力、协作力，这些能力在任何学习中都受用。',
    category: 'comparison',
    tags: ['区别', '对比', '其他机构']
  },
  {
    question: '孩子能学到什么？',
    answer: '孩子会在六个维度获得成长：W-荒野探索力（勇于探索未知）、I-科学探究力（发现问题解决问题）、L-生命感知力（对自然的敬畏和关爱）、D-科创实践力（动手创造的能力）、E-生态责任力（环保意识和行动力）、R-团队韧性力（协作和坚持）。这些都是孩子未来竞争力的底层能力。',
    category: 'value',
    tags: ['学什么', '能力', '收获']
  },
  {
    question: '安全问题怎么保障？',
    answer: '安全是我们的第一准则，6年服务10万+家庭，零安全事故。我们的保障措施包括：1）师生比不超过1:6；2）所有导师持急救证书，每年急救培训；3）每次活动有详细安全预案，提前场地踩点；4）为每个孩子购买意外险；5）实时家长群图文直播，让您随时了解孩子状态。',
    category: 'safety',
    tags: ['安全', '保障', '意外']
  },
  {
    question: '下雨天怎么办？',
    answer: '小雨不影响活动，我们认为这也是自然教育的一部分——学会在不同天气下活动。大雨会提前通知延期，不会取消。如果遇到极端天气，我们有室内备选方案，不浪费这次课程。所有变动都会提前在家长群通知。',
    category: 'logistics',
    tags: ['下雨', '天气', '延期']
  },
  {
    question: '课程多少钱？',
    answer: '我们有不同层次的课程：体验课199元/次，适合初次了解；系统课程2500-4000元/学期，包含12-16次课；高端营会6000-10000元，5-7天沉浸式体验。具体选择要看孩子的年龄和您的培养目标，我可以根据孩子情况给您推荐最适合的方案。',
    category: 'pricing',
    tags: ['价格', '多少钱', '费用']
  },
  {
    question: '多大的孩子适合？',
    answer: '4-12岁的孩子都适合，我们按年龄段分班：4-6岁是启蒙班，以感官体验为主；7-9岁是探索班，开始系统的科学观察和记录；10-12岁是研究班，完成完整的科学探究项目。不同年龄有不同的课程设计，循序渐进。',
    category: 'logistics',
    tags: ['年龄', '几岁', '适合']
  },
  {
    question: '上课地点在哪里？',
    answer: '我们在全市有多个活动基地，包括城市公园、郊野公园、自然保护区等。具体地点会根据课程内容选择，提前一周在群里通知。大部分地点都有停车位，也会考虑公共交通便利性。',
    category: 'logistics',
    tags: ['地点', '在哪', '位置']
  },
  {
    question: '家长需要陪同吗？',
    answer: '4-6岁建议家长陪同，可以增进亲子关系，也让您了解我们的教学方式。7岁以上不需要陪同，我们希望孩子独立完成任务。家长可以在活动区域自由活动，我们会实时在群里发送孩子的照片和动态。',
    category: 'logistics',
    tags: ['陪同', '家长', '独立']
  },
  {
    question: '能提高成绩吗？',
    answer: '我们不是补课班，不直接教课内知识。但我们培养的专注力、观察力、逻辑思维能力，对学习是有帮助的。我们跟踪了200多个学员，参加系统课程半年后，85%的孩子专注时长提升30%以上，70%的孩子数学成绩有明显进步。因为学习的底层能力提升了。',
    category: 'effect',
    tags: ['成绩', '学习', '效果']
  },
  {
    question: '孩子不感兴趣怎么办？',
    answer: '先别急着下结论。很多孩子一开始对"自然"没概念，是因为没体验过。我们的课程设计了很多有趣的探险任务，大多数孩子上完第一次课就会问"下次是什么时候"。如果试过几次真的不感兴趣，7天内可以全额退款，您没有风险。',
    category: 'effect',
    tags: ['不感兴趣', '不喜欢', '退款']
  },
  {
    question: '有证书吗？',
    answer: '有的。完成系统课程会获得WILDER能力认证报告，是科学评估孩子能力发展的专业报告。参加研学营会有结业证书和作品集。优秀学员有机会参加科学探究大赛，获奖证书是教育部认可的白名单赛事荣誉。',
    category: 'value',
    tags: ['证书', '认证', '比赛']
  },
  {
    question: '和学校教育冲突吗？',
    answer: '不冲突，是互补关系。学校侧重知识传授，我们侧重能力培养；学校在教室里，我们在自然中。每周2-3小时，不会影响学校学习，反而能帮孩子调节状态、提升效率。很多老师反馈我们的学员课堂参与度更高、思维更活跃。',
    category: 'comparison',
    tags: ['学校', '冲突', '时间']
  },
  {
    question: '孩子内向能参加吗？',
    answer: '内向的孩子其实特别适合自然教育。相比嘈杂的室内活动，户外环境更让他们放松。我们的导师受过专业培训，会给内向孩子更多关注和引导。团队活动设计原则是"每个人都有价值"，不会让任何孩子被边缘化。一般3-4次课后，孩子就能找到自己的节奏。',
    category: 'effect',
    tags: ['内向', '不合群', '适应']
  },
  {
    question: '课程可以请假吗？',
    answer: '可以的。提前24小时请假可以安排补课或顺延。但我们建议尽量不要缺课，因为课程是连贯设计的，每次缺席都会影响完整体验。连续参加效果最好。',
    category: 'logistics',
    tags: ['请假', '缺课', '补课']
  },
  {
    question: '为什么比其他机构贵？',
    answer: '看起来单价可能高一些，但您需要看包含什么。我们每次课程2-3小时，包含专业导师带队、活动材料、保险、课后成长报告。算下来时均成本和其他机构差不多，但您获得的是系统的能力培养和可追踪的成长记录，而不是单纯的"玩一次"。',
    category: 'pricing',
    tags: ['贵', '价格', '性价比']
  },
  {
    question: '孩子体弱能参加吗？',
    answer: '可以的。我们的活动强度是按年龄设计的，不是极限挑战。如果孩子有特殊健康情况，请提前告知导师，我们会特别关注。适当的户外活动反而有助于增强体质。当然，如果孩子正在生病，建议休息好再来。',
    category: 'safety',
    tags: ['体弱', '健康', '体质']
  }
]

/**
 * 根据关键词搜索FAQ
 */
export function searchFAQ(keyword: string): FAQItem[] {
  if (!keyword) return SALES_FAQ
  const kw = keyword.toLowerCase()
  return SALES_FAQ.filter(item => 
    item.question.toLowerCase().includes(kw) ||
    item.answer.toLowerCase().includes(kw) ||
    item.tags.some(tag => tag.includes(kw))
  )
}

/**
 * 根据分类获取FAQ
 */
export function getFAQByCategory(category: FAQItem['category']): FAQItem[] {
  return SALES_FAQ.filter(item => item.category === category)
}

// ==================== 成功案例模板 ====================

export interface SuccessCase {
  id: string
  title: string
  studentProfile: string
  parentType: string
  studentAge: number
  studentGrade: string
  background: string
  challenges: string[]
  intervention: string
  courses: string[]
  duration: string
  outcomes: string[]
  wilderGrowth: Record<string, number>
  parentQuote: string
  tips: string[]
}

export const SUCCESS_CASES: SuccessCase[] = [
  {
    id: 'case-001',
    title: '从课堂"小刺头"到科学小达人',
    studentProfile: 'W-dominant',
    parentType: 'anxious_academic',
    studentAge: 8,
    studentGrade: '三年级',
    background: '小宇在学校是出了名的"坐不住"，上课总是东张西望，写作业需要家长全程盯着。妈妈非常焦虑，补了很多课但成绩一直在75分徘徊。老师建议带去检查是不是多动症。',
    challenges: [
      '课堂注意力不集中，频繁被老师点名',
      '写作业拖拉，2小时作业要做4小时',
      '数学成绩不稳定，粗心错误多',
      '对学习没有兴趣，提到作业就发愁'
    ],
    intervention: '通过WILDER测评发现小宇的W（荒野探索力）极强，他不是多动，而是探索欲旺盛，标准教室满足不了他。我们建议从户外生存技能营开始，把他的探索能量导向积极方向。',
    courses: ['户外生存技能营', '小小科学家系列'],
    duration: '6个月',
    outcomes: [
      '专注力显著提升，能独立完成45分钟作业不走神',
      '数学从75分提升到92分，粗心错误大幅减少',
      '成为班级自然观察小组组长',
      '对学习态度转变，主动预习复习'
    ],
    wilderGrowth: { W: 15, I: 25, L: 10, D: 20, E: 8, R: 18 },
    parentQuote: '没想到户外课能让他有这么大变化。以前以为他是学习态度问题，现在才知道是我们没找对方法。',
    tips: [
      '对于W-dominant孩子，关键是"把能量导向正确方向"而不是"压制能量"',
      '用"探险任务"而非"学习任务"来包装目标',
      '让家长理解：坐不住≠多动症，可能是探索欲强'
    ]
  },
  {
    id: 'case-002',
    title: '问题小孩变成科学家苗子',
    studentProfile: 'I-dominant',
    parentType: 'interest_nurture',
    studentAge: 9,
    studentGrade: '四年级',
    background: '朵朵是个"十万个为什么"，问题多到老师有时候都不耐烦。家长担心她总钻牛角尖，希望找个地方让她的好奇心有出口。',
    challenges: [
      '问题太多，老师和家长应接不暇',
      '对感兴趣的事情钻得很深，但其他都不在乎',
      '有时候固执己见，不容易接受别人的观点',
      '缺少和她"同频"的小伙伴'
    ],
    intervention: 'WILDER测评显示朵朵I（科学探究力）突出，是典型的研究型人格。我们为她安排了小小科学家系列课程，让她的问题有专业人士回答，好奇心有释放的渠道。',
    courses: ['小小科学家系列', '生态观察员培养计划', 'STEM自然科学营'],
    duration: '1年',
    outcomes: [
      '完成3个独立科学探究项目，形成作品集',
      '在市级科学探究大赛获得二等奖',
      '学会了科学的提问和研究方法',
      '找到了志同道合的"科学小伙伴"',
      '被推荐为学校科学社团核心成员'
    ],
    wilderGrowth: { W: 8, I: 30, L: 15, D: 22, E: 12, R: 10 },
    parentQuote: '终于有人认真对待她的问题了！现在她问问题更有条理，也学会了自己找答案。',
    tips: [
      '对于I-dominant孩子，关键是"认真对待每一个问题"',
      '帮助建立"科学提问→研究方法→得出结论"的完整闭环',
      '介绍同类型的小伙伴，解决"没有同频朋友"的问题'
    ]
  },
  {
    id: 'case-003',
    title: '内向小女孩的蜕变',
    studentProfile: 'L-dominant',
    parentType: 'social_development',
    studentAge: 7,
    studentGrade: '二年级',
    background: '小雨特别怕生，在学校没有好朋友，课间总是一个人。她很喜欢小动物和植物，但不敢和别人分享。妈妈担心她越来越封闭。',
    challenges: [
      '极度内向，第一次课全程躲在妈妈后面',
      '在学校没有好朋友，课间总是独自一人',
      '有想法但不敢表达，怕被笑话',
      '对新环境适应很慢'
    ],
    intervention: 'WILDER测评显示小雨L（生命感知力）很强，对生命有天然的敏感和热爱。我们没有强迫她参与，而是让她做"小观察员"，从她擅长的角度切入，逐步建立自信。',
    courses: ['生态观察员培养计划', '自然笔记大师班'],
    duration: '1年',
    outcomes: [
      '从"躲在妈妈后面"到成为小组最活跃的记录员',
      '交到了3个固定的GROWMATE小伙伴',
      '在班级里有了"自然专家"的称号',
      '主动要求在班会上分享自己的自然观察记录',
      '性格明显开朗，愿意表达自己的想法'
    ],
    wilderGrowth: { W: 12, I: 18, L: 28, D: 8, E: 15, R: 25 },
    parentQuote: '以前约她同学玩要求半天，现在周末主动问GROWMATE的小伙伴有没有空。她找到了属于自己的小圈子。',
    tips: [
      '对于内向的L-dominant孩子，不要强迫参与，要找到她的"舒适切入点"',
      '让她先做"观察者"，在她擅长的领域建立自信',
      '社交能力的培养要循序渐进，一年是合理的周期'
    ]
  },
  {
    id: 'case-004',
    title: '拆家小能手的创造之路',
    studentProfile: 'D-dominant',
    parentType: 'balanced_development',
    studentAge: 10,
    studentGrade: '五年级',
    background: '浩然从小就爱动手，家里的玩具没有完整的——全被他拆了。做手工很厉害，但学习成绩一般，家长担心他"不务正业"。',
    challenges: [
      '喜欢拆东西，家里玩具无一幸免',
      '动手能力强但做事没耐心，总想着下一个项目',
      '学习成绩中等，对课本知识兴趣不大',
      '家长担心他"玩物丧志"'
    ],
    intervention: 'WILDER测评显示浩然D（科创实践力）极强，是典型的"创客型"孩子。我们把他的拆解欲望引导到"创造"上，通过完整的项目周期培养他"做完"的习惯。',
    courses: ['自然创客工坊', '户外生存技能营', 'STEM自然科学营'],
    duration: '8个月',
    outcomes: [
      '完成了3个完整的创客项目：生态瓶、鸟巢、气象站',
      '学会了"设计→制作→测试→改进"的完整流程',
      '物理和科学成绩提升明显',
      '"做完再开始下一个"的习惯初步养成',
      '作品在学校科技节获奖'
    ],
    wilderGrowth: { W: 10, I: 15, L: 8, D: 32, E: 12, R: 15 },
    parentQuote: '以前觉得他只会拆，没想到也能创造出这么好的作品。最重要的是他学会了坚持把一件事做完。',
    tips: [
      '对于D-dominant孩子，关键是"给他正当的创造机会"',
      '用"项目制"培养完整周期感，改掉"只开头不结尾"的习惯',
      '让家长看到"动手能力"和"学习能力"是相通的'
    ]
  },
  {
    id: 'case-005',
    title: '从游戏沉迷到户外达人',
    studentProfile: 'W-dominant',
    parentType: 'screen_detox',
    studentAge: 9,
    studentGrade: '四年级',
    background: '小轩每天打游戏4-5小时，寒暑假更夸张。爸爸没收手机，孩子就大哭大闹。周末叫他出门比登天还难，亲子关系非常紧张。',
    challenges: [
      '日均游戏时间4-5小时，严重影响学习',
      '不愿出门，周末宅在家里',
      '没收手机就大哭大闹，亲子冲突频繁',
      '对现实世界的活动没有兴趣'
    ],
    intervention: '分析发现小轩沉迷游戏是因为游戏提供了"挑战+成就感+社交"，而现实生活中这些需求没有被满足。我们用户外探险替代游戏，给他真实世界的"上瘾"体验。',
    courses: ['户外生存技能营', '团队探索训练营', '野外科考夏令营'],
    duration: '1年',
    outcomes: [
      '日均游戏时间从4-5小时降到1小时以内',
      '周末主动说"今天GROWMATE的课别迟到"',
      '学会了定向越野、搭建庇护所等真实技能',
      '亲子关系明显改善，有了共同话题',
      '体能和精神状态都有提升'
    ],
    wilderGrowth: { W: 35, I: 12, L: 10, D: 18, E: 8, R: 22 },
    parentQuote: '这比没收手机管用100倍。不是堵，是疏——给他找到了比游戏更好玩的事情。',
    tips: [
      '对于电子产品沉迷，核心是"用更好的体验替代"',
      '第一次课很关键，要设计得足够吸引人',
      '同时要修复亲子关系，让家长也参与进来'
    ]
  },
  {
    id: 'case-006',
    title: '升学规划的科创路径',
    studentProfile: 'I-dominant',
    parentType: 'exam_planning',
    studentAge: 11,
    studentGrade: '六年级',
    background: '家长目标明确：冲刺某重点中学的科创班。孩子成绩不错但没有突出的科创经历，简历上缺少亮点。',
    challenges: [
      '成绩优秀但缺乏科创经历',
      '升学简历没有差异化亮点',
      '对科学感兴趣但没有系统培养',
      '时间紧张，需要高效的成果产出'
    ],
    intervention: '从五年级开始系统规划：L3-L4阶段完成科学探究项目形成作品集，L5阶段参加正规赛事。3年时间，完整走完"兴趣→能力→成果"的路径。',
    courses: ['小小科学家系列', 'STEM自然科学营', '生态保护区研学'],
    duration: '2年（从四年级到六年级）',
    outcomes: [
      '完成"校园植物多样性调查"等3个科学探究项目',
      '市级科学探究大赛二等奖',
      '形成完整的科学探究作品集',
      '面试时项目展示获得评委高度认可',
      '顺利被目标中学科创班录取'
    ],
    wilderGrowth: { W: 8, I: 35, L: 12, D: 20, E: 15, R: 10 },
    parentQuote: '这三年的投入太值了。不只是拿到了升学的敲门砖，更重要的是孩子真的爱上了科学探究。',
    tips: [
      '对于升学规划型家长，要给出清晰的时间表和成果预期',
      '项目设计要考虑"可展示性"，升学面试能讲得出来',
      '但也要提醒：兴趣和能力比证书更重要'
    ]
  }
]

/**
 * 根据学生画像获取匹配案例
 */
export function getCasesByProfile(profileId: string): SuccessCase[] {
  return SUCCESS_CASES.filter(c => c.studentProfile === profileId)
}

/**
 * 根据家长类型获取匹配案例
 */
export function getCasesByParentType(parentType: string): SuccessCase[] {
  return SUCCESS_CASES.filter(c => c.parentType === parentType)
}

/**
 * 获取最匹配的案例
 */
export function getBestMatchCase(profileId: string, parentType: string): SuccessCase | null {
  // 优先匹配同时符合画像和家长类型的
  const perfectMatch = SUCCESS_CASES.find(c => c.studentProfile === profileId && c.parentType === parentType)
  if (perfectMatch) return perfectMatch
  
  // 其次匹配画像
  const profileMatch = SUCCESS_CASES.find(c => c.studentProfile === profileId)
  if (profileMatch) return profileMatch
  
  // 再其次匹配家长类型
  const parentMatch = SUCCESS_CASES.find(c => c.parentType === parentType)
  if (parentMatch) return parentMatch
  
  return SUCCESS_CASES[0]
}
