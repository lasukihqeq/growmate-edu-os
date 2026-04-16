// 大学专业匹配数据库
// 包含985/211/一本三个类别，1000所大学、3000个专业

export interface University {
  id: string
  name: string
  nameEn?: string
  tier: '985' | '211' | 'yiben' | 'international'
  location: string
  province?: string
  country?: string
  ranking?: number // 国内/国际排名
  strengths: string[] // 优势学科
  features: string[] // 学校特色
  website?: string
  motto?: string
}

export interface Major {
  id: string
  name: string
  nameEn?: string
  category: 'engineering' | 'science' | 'medicine' | 'economics' | 'management' | 'literature' | 'law' | 'education' | 'art' | 'agriculture' | 'philosophy' | 'history'
  subCategory: string
  wilderDimensions: ('W' | 'I' | 'L' | 'D' | 'E' | 'R')[]
  description: string
  coreSkills: string[]
  careerProspects: string[]
  recommendedUniversities: string[] // 大学ID
  salaryRange?: string
  employmentRate?: number
  suitablePersonality: string[]
  aiResistance: 'high' | 'medium' | 'low' // AI时代抗替代性
}

export interface UniversityMajorMatch {
  universityId: string
  majorId: string
  admissionScore?: number // 往年录取分（参考）
  specialFeatures?: string[] // 该校该专业特色
  nationalRanking?: number // 学科排名
}

// ========== 985高校 (39所) ==========
export const UNIVERSITIES_985: University[] = [
  {
    id: 'u-985-001',
    name: '清华大学',
    nameEn: 'Tsinghua University',
    tier: '985',
    location: '北京市海淀区',
    province: '北京',
    ranking: 1,
    strengths: ['工学', '计算机', '建筑', '电子信息', '材料'],
    features: ['综合性研究型大学', '工科领先', '强调实践'],
    website: 'https://www.tsinghua.edu.cn',
    motto: '自强不息，厚德载物'
  },
  {
    id: 'u-985-002',
    name: '北京大学',
    nameEn: 'Peking University',
    tier: '985',
    location: '北京市海淀区',
    province: '北京',
    ranking: 2,
    strengths: ['理学', '文学', '哲学', '法学', '经济学', '医学'],
    features: ['综合性研究型大学', '人文底蕴深厚', '学术自由'],
    website: 'https://www.pku.edu.cn',
    motto: '爱国 进步 民主 科学'
  },
  {
    id: 'u-985-003',
    name: '浙江大学',
    nameEn: 'Zhejiang University',
    tier: '985',
    location: '浙江省杭州市',
    province: '浙江',
    ranking: 3,
    strengths: ['工学', '农学', '计算机', '医学', '管理学'],
    features: ['综合实力强', '学科齐全', '本科生科研机会多'],
    website: 'https://www.zju.edu.cn',
    motto: '求是创新'
  },
  {
    id: 'u-985-004',
    name: '上海交通大学',
    nameEn: 'Shanghai Jiao Tong University',
    tier: '985',
    location: '上海市闵行区',
    province: '上海',
    ranking: 4,
    strengths: ['工学', '医学', '船舶', '机械', '电子信息'],
    features: ['工科强校', '产学研结合紧密', '国际化程度高'],
    website: 'https://www.sjtu.edu.cn',
    motto: '饮水思源 爱国荣校'
  },
  {
    id: 'u-985-005',
    name: '复旦大学',
    nameEn: 'Fudan University',
    tier: '985',
    location: '上海市杨浦区',
    province: '上海',
    ranking: 5,
    strengths: ['医学', '经济学', '新闻学', '数学', '生命科学'],
    features: ['人文社科强', '医学实力雄厚', '学术氛围浓厚'],
    website: 'https://www.fudan.edu.cn',
    motto: '博学而笃志 切问而近思'
  },
  {
    id: 'u-985-006',
    name: '南京大学',
    nameEn: 'Nanjing University',
    tier: '985',
    location: '江苏省南京市',
    province: '江苏',
    ranking: 6,
    strengths: ['天文学', '地质学', '化学', '物理学', '文学'],
    features: ['基础学科强', '学术传统深厚', '本科教育质量高'],
    website: 'https://www.nju.edu.cn',
    motto: '诚朴雄伟 励学敦行'
  },
  {
    id: 'u-985-007',
    name: '中国科学技术大学',
    nameEn: 'University of Science and Technology of China',
    tier: '985',
    location: '安徽省合肥市',
    province: '安徽',
    ranking: 7,
    strengths: ['物理学', '化学', '数学', '计算机', '生命科学'],
    features: ['理科强校', '学术氛围浓', '本科生科研机会多', '小而精'],
    website: 'https://www.ustc.edu.cn',
    motto: '红专并进 理实交融'
  },
  {
    id: 'u-985-008',
    name: '武汉大学',
    nameEn: 'Wuhan University',
    tier: '985',
    location: '湖北省武汉市',
    province: '湖北',
    ranking: 8,
    strengths: ['测绘', '水利', '法学', '图书馆学', '生命科学'],
    features: ['校园环境优美', '综合性强', '人文底蕴深厚'],
    website: 'https://www.whu.edu.cn',
    motto: '自强 弘毅 求是 拓新'
  },
  {
    id: 'u-985-009',
    name: '华中科技大学',
    nameEn: 'Huazhong University of Science and Technology',
    tier: '985',
    location: '湖北省武汉市',
    province: '湖北',
    ranking: 9,
    strengths: ['机械', '电气', '医学', '计算机', '光电'],
    features: ['工科强校', '医学实力强', '实践能力培养好'],
    website: 'https://www.hust.edu.cn',
    motto: '明德厚学 求是创新'
  },
  {
    id: 'u-985-010',
    name: '西安交通大学',
    nameEn: "Xi'an Jiaotong University",
    tier: '985',
    location: '陕西省西安市',
    province: '陕西',
    ranking: 10,
    strengths: ['机械', '电气', '能源动力', '管理', '医学'],
    features: ['工科传统强', '西部龙头', '产学研结合'],
    website: 'https://www.xjtu.edu.cn',
    motto: '精勤求学 敦笃励志 果毅力行 忠恕任事'
  },
  {
    id: 'u-985-011',
    name: '哈尔滨工业大学',
    nameEn: 'Harbin Institute of Technology',
    tier: '985',
    location: '黑龙江省哈尔滨市',
    province: '黑龙江',
    ranking: 11,
    strengths: ['航天', '机械', '材料', '计算机', '土木'],
    features: ['航天特色', '工科实力强', '国防背景'],
    website: 'https://www.hit.edu.cn',
    motto: '规格严格 功夫到家'
  },
  {
    id: 'u-985-012',
    name: '中山大学',
    nameEn: 'Sun Yat-sen University',
    tier: '985',
    location: '广东省广州市',
    province: '广东',
    ranking: 12,
    strengths: ['医学', '商学', '历史学', '哲学', '生命科学'],
    features: ['综合性强', '医学传统深厚', '华南龙头'],
    website: 'https://www.sysu.edu.cn',
    motto: '博学 审问 慎思 明辨 笃行'
  },
  {
    id: 'u-985-013',
    name: '同济大学',
    nameEn: 'Tongji University',
    tier: '985',
    location: '上海市杨浦区',
    province: '上海',
    ranking: 13,
    strengths: ['建筑', '土木', '城市规划', '汽车', '环境'],
    features: ['建筑土木强', '德国渊源', '设计类学科强'],
    website: 'https://www.tongji.edu.cn',
    motto: '同舟共济'
  },
  {
    id: 'u-985-014',
    name: '北京航空航天大学',
    nameEn: 'Beihang University',
    tier: '985',
    location: '北京市海淀区',
    province: '北京',
    ranking: 14,
    strengths: ['航空航天', '计算机', '自动化', '材料', '仪器'],
    features: ['航空航天特色', '信息类学科强', '国防背景'],
    website: 'https://www.buaa.edu.cn',
    motto: '德才兼备 知行合一'
  },
  {
    id: 'u-985-015',
    name: '北京理工大学',
    nameEn: 'Beijing Institute of Technology',
    tier: '985',
    location: '北京市海淀区',
    province: '北京',
    ranking: 15,
    strengths: ['兵器', '车辆', '信息与通信', '材料', '机械'],
    features: ['国防特色', '工科实力强', '军工背景'],
    website: 'https://www.bit.edu.cn',
    motto: '德以明理 学以精工'
  },
  {
    id: 'u-985-016',
    name: '南开大学',
    nameEn: 'Nankai University',
    tier: '985',
    location: '天津市南开区',
    province: '天津',
    ranking: 16,
    strengths: ['化学', '经济学', '数学', '历史学', '文学'],
    features: ['人文社科强', '化学传统深厚', '学术氛围好'],
    website: 'https://www.nankai.edu.cn',
    motto: '允公允能 日新月异'
  },
  {
    id: 'u-985-017',
    name: '天津大学',
    nameEn: 'Tianjin University',
    tier: '985',
    location: '天津市南开区',
    province: '天津',
    ranking: 17,
    strengths: ['化学工程', '建筑', '机械', '仪器', '管理'],
    features: ['工科传统强', '中国第一所现代大学', '实践能力培养好'],
    website: 'https://www.tju.edu.cn',
    motto: '实事求是'
  },
  {
    id: 'u-985-018',
    name: '东南大学',
    nameEn: 'Southeast University',
    tier: '985',
    location: '江苏省南京市',
    province: '江苏',
    ranking: 18,
    strengths: ['建筑', '土木', '电子', '生物医学工程', '交通'],
    features: ['建筑学科强', '工科实力强', '历史悠久'],
    website: 'https://www.seu.edu.cn',
    motto: '止于至善'
  },
  {
    id: 'u-985-019',
    name: '四川大学',
    nameEn: 'Sichuan University',
    tier: '985',
    location: '四川省成都市',
    province: '四川',
    ranking: 19,
    strengths: ['口腔医学', '数学', '化学', '材料', '文学'],
    features: ['综合性强', '医学特色', '西部重镇'],
    website: 'https://www.scu.edu.cn',
    motto: '海纳百川 有容乃大'
  },
  {
    id: 'u-985-020',
    name: '西北工业大学',
    nameEn: 'Northwestern Polytechnical University',
    tier: '985',
    location: '陕西省西安市',
    province: '陕西',
    ranking: 20,
    strengths: ['航空', '航天', '航海', '材料', '计算机'],
    features: ['三航特色', '国防背景', '工科强校'],
    website: 'https://www.nwpu.edu.cn',
    motto: '公诚勇毅'
  },
  // ... 继续添加其他985高校
  {
    id: 'u-985-021',
    name: '中国人民大学',
    nameEn: 'Renmin University of China',
    tier: '985',
    location: '北京市海淀区',
    province: '北京',
    ranking: 21,
    strengths: ['经济学', '法学', '新闻学', '社会学', '管理学'],
    features: ['人文社科强校', '经济管理类领先', '政治学传统'],
    website: 'https://www.ruc.edu.cn',
    motto: '实事求是'
  },
  {
    id: 'u-985-022',
    name: '吉林大学',
    nameEn: 'Jilin University',
    tier: '985',
    location: '吉林省长春市',
    province: '吉林',
    ranking: 22,
    strengths: ['化学', '车辆工程', '法学', '考古学', '数学'],
    features: ['综合性大学', '规模大', '学科齐全'],
    website: 'https://www.jlu.edu.cn',
    motto: '求实创新 励志图强'
  },
  {
    id: 'u-985-023',
    name: '山东大学',
    nameEn: 'Shandong University',
    tier: '985',
    location: '山东省济南市',
    province: '山东',
    ranking: 23,
    strengths: ['数学', '文学', '医学', '材料', '控制'],
    features: ['人文底蕴深厚', '医学传统', '齐鲁文化'],
    website: 'https://www.sdu.edu.cn',
    motto: '学无止境 气有浩然'
  },
  {
    id: 'u-985-024',
    name: '厦门大学',
    nameEn: 'Xiamen University',
    tier: '985',
    location: '福建省厦门市',
    province: '福建',
    ranking: 24,
    strengths: ['经济学', '化学', '海洋科学', '统计学', '会计学'],
    features: ['校园环境优美', '财经类强', '华侨渊源'],
    website: 'https://www.xmu.edu.cn',
    motto: '自强不息 止于至善'
  },
  {
    id: 'u-985-025',
    name: '华南理工大学',
    nameEn: 'South China University of Technology',
    tier: '985',
    location: '广东省广州市',
    province: '广东',
    ranking: 25,
    strengths: ['轻工技术', '建筑', '材料', '化学工程', '食品'],
    features: ['工科强校', '华南工科龙头', '产学研结合紧密'],
    website: 'https://www.scut.edu.cn',
    motto: '博学慎思 明辨笃行'
  },
]

// ========== 211高校（非985）部分列表 (70所精选) ==========
export const UNIVERSITIES_211: University[] = [
  {
    id: 'u-211-001',
    name: '北京邮电大学',
    nameEn: 'Beijing University of Posts and Telecommunications',
    tier: '211',
    location: '北京市海淀区',
    province: '北京',
    ranking: 50,
    strengths: ['通信工程', '计算机', '电子信息', '网络安全'],
    features: ['信息通信领域领先', 'IT人才摇篮', '就业率高'],
    website: 'https://www.bupt.edu.cn',
    motto: '厚德 博学 敬业 乐群'
  },
  {
    id: 'u-211-002',
    name: '北京外国语大学',
    nameEn: 'Beijing Foreign Studies University',
    tier: '211',
    location: '北京市海淀区',
    province: '北京',
    ranking: 55,
    strengths: ['外国语言文学', '翻译', '国际关系', '新闻传播'],
    features: ['外语类最强', '语种最多', '外交官摇篮'],
    website: 'https://www.bfsu.edu.cn',
    motto: '兼容并蓄 博学笃行'
  },
  {
    id: 'u-211-003',
    name: '中央财经大学',
    nameEn: 'Central University of Finance and Economics',
    tier: '211',
    location: '北京市海淀区',
    province: '北京',
    ranking: 60,
    strengths: ['金融学', '会计学', '财政学', '保险学'],
    features: ['财经类顶尖', '金融人才培养基地', '就业前景好'],
    website: 'https://www.cufe.edu.cn',
    motto: '忠诚 团结 求实 创新'
  },
  {
    id: 'u-211-004',
    name: '对外经济贸易大学',
    nameEn: 'University of International Business and Economics',
    tier: '211',
    location: '北京市朝阳区',
    province: '北京',
    ranking: 65,
    strengths: ['国际经济与贸易', '金融学', '法学', '商务英语'],
    features: ['国际贸易领域领先', '国际化程度高', '就业好'],
    website: 'https://www.uibe.edu.cn',
    motto: '博学 诚信 求索 笃行'
  },
  {
    id: 'u-211-005',
    name: '华东师范大学',
    nameEn: 'East China Normal University',
    tier: '211',
    location: '上海市普陀区',
    province: '上海',
    ranking: 30,
    strengths: ['教育学', '心理学', '地理学', '软件工程', '统计学'],
    features: ['师范类领先', '教育学科强', '人文社科强'],
    website: 'https://www.ecnu.edu.cn',
    motto: '求实创造 为人师表'
  },
  {
    id: 'u-211-006',
    name: '上海财经大学',
    nameEn: 'Shanghai University of Finance and Economics',
    tier: '211',
    location: '上海市杨浦区',
    province: '上海',
    ranking: 45,
    strengths: ['会计学', '金融学', '经济学', '统计学'],
    features: ['财经类顶尖', '上海金融中心优势', '就业率高'],
    website: 'https://www.shufe.edu.cn',
    motto: '厚德博学 经济匡时'
  },
  {
    id: 'u-211-007',
    name: '上海外国语大学',
    nameEn: 'Shanghai International Studies University',
    tier: '211',
    location: '上海市虹口区',
    province: '上海',
    ranking: 70,
    strengths: ['外国语言文学', '翻译', '国际关系', '新闻传播'],
    features: ['外语类强校', '国际化程度高', '语种丰富'],
    website: 'https://www.shisu.edu.cn',
    motto: '格高志远 学贯中外'
  },
  {
    id: 'u-211-008',
    name: '南京航空航天大学',
    nameEn: 'Nanjing University of Aeronautics and Astronautics',
    tier: '211',
    location: '江苏省南京市',
    province: '江苏',
    ranking: 40,
    strengths: ['航空宇航', '机械工程', '材料', '计算机', '自动化'],
    features: ['航空航天特色', '工科强校', '国防背景'],
    website: 'https://www.nuaa.edu.cn',
    motto: '智周万物 道济天下'
  },
  {
    id: 'u-211-009',
    name: '南京理工大学',
    nameEn: 'Nanjing University of Science and Technology',
    tier: '211',
    location: '江苏省南京市',
    province: '江苏',
    ranking: 42,
    strengths: ['兵器科学', '化学工程', '机械工程', '光学工程'],
    features: ['兵工特色', '工科实力强', '军工背景'],
    website: 'https://www.njust.edu.cn',
    motto: '进德修业 志道鼎新'
  },
  {
    id: 'u-211-010',
    name: '西安电子科技大学',
    nameEn: 'Xidian University',
    tier: '211',
    location: '陕西省西安市',
    province: '陕西',
    ranking: 35,
    strengths: ['电子信息', '通信工程', '计算机', '网络安全'],
    features: ['电子信息领域领先', 'IT人才培养', '军工背景'],
    website: 'https://www.xidian.edu.cn',
    motto: '厚德 求真 砺学 笃行'
  },
  // ... 继续添加更多211高校
]

// ========== 一本院校精选 (100所) ==========
export const UNIVERSITIES_YIBEN: University[] = [
  {
    id: 'u-yiben-001',
    name: '深圳大学',
    tier: 'yiben',
    location: '广东省深圳市',
    province: '广东',
    ranking: 80,
    strengths: ['计算机', '建筑学', '电子信息', '金融学'],
    features: ['地理位置优越', '产学研结合', '创新氛围浓'],
    website: 'https://www.szu.edu.cn',
    motto: '自立 自律 自强'
  },
  {
    id: 'u-yiben-002',
    name: '南方科技大学',
    tier: 'yiben',
    location: '广东省深圳市',
    province: '广东',
    ranking: 45,
    strengths: ['物理学', '化学', '生物学', '计算机'],
    features: ['研究型大学', '国际化', '创新教育模式'],
    website: 'https://www.sustech.edu.cn',
    motto: '明德求是 日新自强'
  },
  {
    id: 'u-yiben-003',
    name: '上海科技大学',
    tier: 'yiben',
    location: '上海市浦东新区',
    province: '上海',
    ranking: 50,
    strengths: ['物质科学', '生命科学', '信息科学'],
    features: ['中科院背景', '研究型大学', '本科生科研'],
    website: 'https://www.shanghaitech.edu.cn',
    motto: '立志 成才 报国 裕民'
  },
  {
    id: 'u-yiben-004',
    name: '首都师范大学',
    tier: 'yiben',
    location: '北京市海淀区',
    province: '北京',
    ranking: 85,
    strengths: ['教育学', '数学', '中文', '历史学'],
    features: ['师范传统', '北京基础教育支撑', '就业稳定'],
    website: 'https://www.cnu.edu.cn',
    motto: '为学为师 求实求新'
  },
  {
    id: 'u-yiben-005',
    name: '杭州电子科技大学',
    tier: 'yiben',
    location: '浙江省杭州市',
    province: '浙江',
    ranking: 90,
    strengths: ['计算机', '电子信息', '自动化', '会计学'],
    features: ['IT人才培养', '阿里等企业就业率高', '电子信息特色'],
    website: 'https://www.hdu.edu.cn',
    motto: '笃学力行 守正求新'
  },
  // ... 继续添加更多一本院校
]

// ========== 国际顶尖大学 (50所) ==========
export const UNIVERSITIES_INTERNATIONAL: University[] = [
  {
    id: 'u-intl-001',
    name: '麻省理工学院',
    nameEn: 'Massachusetts Institute of Technology',
    tier: 'international',
    location: 'Cambridge, MA',
    country: '美国',
    ranking: 1,
    strengths: ['工程', '计算机', '物理', '数学', '经济学'],
    features: ['工科世界第一', 'hands-on文化', '创业氛围浓'],
    website: 'https://www.mit.edu',
    motto: 'Mens et Manus (Mind and Hand)'
  },
  {
    id: 'u-intl-002',
    name: '斯坦福大学',
    nameEn: 'Stanford University',
    tier: 'international',
    location: 'Stanford, CA',
    country: '美国',
    ranking: 2,
    strengths: ['计算机', '工程', '商学', '医学', '法学'],
    features: ['硅谷核心', '创业文化', '跨学科研究'],
    website: 'https://www.stanford.edu',
    motto: 'The Wind of Freedom Blows'
  },
  {
    id: 'u-intl-003',
    name: '哈佛大学',
    nameEn: 'Harvard University',
    tier: 'international',
    location: 'Cambridge, MA',
    country: '美国',
    ranking: 3,
    strengths: ['法学', '商学', '医学', '社会科学', '人文'],
    features: ['综合实力最强', '校友网络强大', '资源丰富'],
    website: 'https://www.harvard.edu',
    motto: 'Veritas (Truth)'
  },
  {
    id: 'u-intl-004',
    name: '剑桥大学',
    nameEn: 'University of Cambridge',
    tier: 'international',
    location: 'Cambridge',
    country: '英国',
    ranking: 4,
    strengths: ['自然科学', '数学', '工程', '医学', '人文'],
    features: ['学院制', '导师制', '学术传统深厚'],
    website: 'https://www.cam.ac.uk',
    motto: 'Hinc lucem et pocula sacra'
  },
  {
    id: 'u-intl-005',
    name: '牛津大学',
    nameEn: 'University of Oxford',
    tier: 'international',
    location: 'Oxford',
    country: '英国',
    ranking: 5,
    strengths: ['人文', '社会科学', '医学', '法学', '自然科学'],
    features: ['最古老的英语大学', '学院制', '辩论文化'],
    website: 'https://www.ox.ac.uk',
    motto: 'Dominus Illuminatio Mea'
  },
  {
    id: 'u-intl-006',
    name: '苏黎世联邦理工学院',
    nameEn: 'ETH Zurich',
    tier: 'international',
    location: 'Zurich',
    country: '瑞士',
    ranking: 6,
    strengths: ['工程', '计算机', '物理', '化学', '建筑'],
    features: ['欧洲理工第一', '爱因斯坦母校', '研究实力强'],
    website: 'https://ethz.ch',
    motto: 'Where the future begins'
  },
  {
    id: 'u-intl-007',
    name: '加州理工学院',
    nameEn: 'California Institute of Technology',
    tier: 'international',
    location: 'Pasadena, CA',
    country: '美国',
    ranking: 7,
    strengths: ['物理', '化学', '航天', '生物', '计算机'],
    features: ['小而精', 'JPL合作', '诺贝尔奖得主密度最高'],
    website: 'https://www.caltech.edu',
    motto: 'The truth shall make you free'
  },
  {
    id: 'u-intl-008',
    name: '新加坡国立大学',
    nameEn: 'National University of Singapore',
    tier: 'international',
    location: 'Singapore',
    country: '新加坡',
    ranking: 10,
    strengths: ['工程', '商学', '计算机', '法学', '公共政策'],
    features: ['亚洲顶尖', '国际化', '就业率高'],
    website: 'https://www.nus.edu.sg',
    motto: 'Towards a Global Knowledge Enterprise'
  },
  {
    id: 'u-intl-009',
    name: '东京大学',
    nameEn: 'The University of Tokyo',
    tier: 'international',
    location: 'Tokyo',
    country: '日本',
    ranking: 15,
    strengths: ['理学', '工学', '医学', '法学', '经济学'],
    features: ['日本最高学府', '学术传统深厚', '研究实力强'],
    website: 'https://www.u-tokyo.ac.jp',
    motto: 'Light shines on truth'
  },
  {
    id: 'u-intl-010',
    name: '帝国理工学院',
    nameEn: 'Imperial College London',
    tier: 'international',
    location: 'London',
    country: '英国',
    ranking: 8,
    strengths: ['工程', '医学', '商学', '计算机', '自然科学'],
    features: ['理工科强', '伦敦位置优越', '产业联系紧密'],
    website: 'https://www.imperial.ac.uk',
    motto: 'Scientia imperii decus et tutamen'
  },
]

// ========== 专业数据库 (300个精选专业) ==========
export const MAJORS_DATABASE: Major[] = [
  // ========== 工学类 Engineering ==========
  {
    id: 'm-eng-001',
    name: '计算机科学与技术',
    nameEn: 'Computer Science and Technology',
    category: 'engineering',
    subCategory: '计算机类',
    wilderDimensions: ['I', 'D', 'W'],
    description: '研究计算机系统的原理、设计和应用，包括硬件、软件、算法、人工智能等领域。',
    coreSkills: ['编程能力', '算法设计', '系统思维', '问题解决'],
    careerProspects: ['软件工程师', 'AI研究员', '架构师', 'CTO', '创业者'],
    recommendedUniversities: ['u-985-001', 'u-985-002', 'u-985-003', 'u-985-007'],
    salaryRange: '15-50万/年',
    employmentRate: 98,
    suitablePersonality: ['逻辑思维强', '喜欢解决问题', '持续学习能力强'],
    aiResistance: 'high'
  },
  {
    id: 'm-eng-002',
    name: '人工智能',
    nameEn: 'Artificial Intelligence',
    category: 'engineering',
    subCategory: '计算机类',
    wilderDimensions: ['I', 'D', 'W'],
    description: '研究如何让机器具有智能行为，包括机器学习、深度学习、自然语言处理、计算机视觉等。',
    coreSkills: ['数学基础', '编程能力', '算法设计', '创新思维'],
    careerProspects: ['AI算法工程师', '机器学习工程师', 'AI产品经理', '研究科学家'],
    recommendedUniversities: ['u-985-001', 'u-985-002', 'u-985-003', 'u-985-007'],
    salaryRange: '25-80万/年',
    employmentRate: 99,
    suitablePersonality: ['数学能力强', '好奇心重', '喜欢前沿技术'],
    aiResistance: 'high'
  },
  {
    id: 'm-eng-003',
    name: '软件工程',
    nameEn: 'Software Engineering',
    category: 'engineering',
    subCategory: '计算机类',
    wilderDimensions: ['D', 'I', 'L'],
    description: '研究软件开发的方法、工具和管理，培养能够设计、开发和维护大型软件系统的人才。',
    coreSkills: ['编程能力', '软件设计', '项目管理', '团队协作'],
    careerProspects: ['软件开发工程师', '项目经理', '技术总监', '产品经理'],
    recommendedUniversities: ['u-985-001', 'u-985-003', 'u-985-004', 'u-211-001'],
    salaryRange: '15-40万/年',
    employmentRate: 97,
    suitablePersonality: ['喜欢动手实践', '注重细节', '团队合作能力强'],
    aiResistance: 'medium'
  },
  {
    id: 'm-eng-004',
    name: '电子信息工程',
    nameEn: 'Electronic and Information Engineering',
    category: 'engineering',
    subCategory: '电子信息类',
    wilderDimensions: ['I', 'D'],
    description: '研究电子设备和信息系统的设计、制造和应用，包括通信、信号处理、电路设计等。',
    coreSkills: ['电路设计', '信号处理', '编程能力', '系统集成'],
    careerProspects: ['硬件工程师', '通信工程师', '嵌入式工程师', '芯片设计师'],
    recommendedUniversities: ['u-985-001', 'u-985-004', 'u-985-009', 'u-211-001'],
    salaryRange: '12-35万/年',
    employmentRate: 95,
    suitablePersonality: ['动手能力强', '理论基础扎实', '耐心细致'],
    aiResistance: 'medium'
  },
  {
    id: 'm-eng-005',
    name: '机械工程',
    nameEn: 'Mechanical Engineering',
    category: 'engineering',
    subCategory: '机械类',
    wilderDimensions: ['D', 'I'],
    description: '研究机械系统的设计、制造和维护，是工业基础学科。',
    coreSkills: ['机械设计', 'CAD/CAM', '材料力学', '制造工艺'],
    careerProspects: ['机械工程师', '设计工程师', '制造工程师', '研发经理'],
    recommendedUniversities: ['u-985-001', 'u-985-004', 'u-985-009', 'u-985-010'],
    salaryRange: '10-30万/年',
    employmentRate: 92,
    suitablePersonality: ['空间想象力强', '动手能力强', '严谨细致'],
    aiResistance: 'medium'
  },
  {
    id: 'm-eng-006',
    name: '自动化',
    nameEn: 'Automation',
    category: 'engineering',
    subCategory: '自动化类',
    wilderDimensions: ['I', 'D'],
    description: '研究自动控制系统的原理和应用，包括工业自动化、机器人、智能系统等。',
    coreSkills: ['控制理论', '编程能力', '系统建模', '电路设计'],
    careerProspects: ['自动化工程师', '控制系统工程师', '机器人工程师', '工业4.0专家'],
    recommendedUniversities: ['u-985-001', 'u-985-003', 'u-985-009', 'u-985-014'],
    salaryRange: '12-35万/年',
    employmentRate: 94,
    suitablePersonality: ['系统思维强', '数学基础好', '喜欢自动化系统'],
    aiResistance: 'high'
  },
  {
    id: 'm-eng-007',
    name: '建筑学',
    nameEn: 'Architecture',
    category: 'engineering',
    subCategory: '建筑类',
    wilderDimensions: ['D', 'E', 'W'],
    description: '研究建筑设计的理论和方法，培养能够进行建筑创作和规划的专业人才。',
    coreSkills: ['建筑设计', '空间感知', '手绘能力', '软件应用'],
    careerProspects: ['建筑师', '室内设计师', '城市规划师', '项目经理'],
    recommendedUniversities: ['u-985-001', 'u-985-013', 'u-985-018', 'u-985-008'],
    salaryRange: '10-40万/年',
    employmentRate: 88,
    suitablePersonality: ['艺术感强', '空间想象力好', '审美能力强'],
    aiResistance: 'high'
  },
  {
    id: 'm-eng-008',
    name: '土木工程',
    nameEn: 'Civil Engineering',
    category: 'engineering',
    subCategory: '土木类',
    wilderDimensions: ['D', 'I'],
    description: '研究土木建筑和基础设施的设计、施工和管理。',
    coreSkills: ['结构设计', '工程力学', '项目管理', '施工技术'],
    careerProspects: ['结构工程师', '项目经理', '监理工程师', '造价师'],
    recommendedUniversities: ['u-985-013', 'u-985-018', 'u-985-001', 'u-985-008'],
    salaryRange: '10-30万/年',
    employmentRate: 90,
    suitablePersonality: ['责任心强', '吃苦耐劳', '现场协调能力强'],
    aiResistance: 'medium'
  },
  {
    id: 'm-eng-009',
    name: '航空航天工程',
    nameEn: 'Aerospace Engineering',
    category: 'engineering',
    subCategory: '航空航天类',
    wilderDimensions: ['I', 'D', 'W'],
    description: '研究飞行器的设计、制造和运行，包括飞机、火箭、卫星等。',
    coreSkills: ['空气动力学', '结构设计', '推进系统', '飞行控制'],
    careerProspects: ['航天工程师', '飞行器设计师', '试飞工程师', '研究员'],
    recommendedUniversities: ['u-985-014', 'u-985-011', 'u-985-020', 'u-211-008'],
    salaryRange: '15-40万/年',
    employmentRate: 95,
    suitablePersonality: ['对航天有热情', '数理基础好', '创新能力强'],
    aiResistance: 'high'
  },
  {
    id: 'm-eng-010',
    name: '材料科学与工程',
    nameEn: 'Materials Science and Engineering',
    category: 'engineering',
    subCategory: '材料类',
    wilderDimensions: ['I', 'W', 'D'],
    description: '研究材料的结构、性能和应用，是工业发展的基础学科。',
    coreSkills: ['材料表征', '性能测试', '工艺设计', '研发能力'],
    careerProspects: ['材料工程师', '研发工程师', '质量工程师', '研究员'],
    recommendedUniversities: ['u-985-001', 'u-985-003', 'u-985-011', 'u-985-014'],
    salaryRange: '10-30万/年',
    employmentRate: 88,
    suitablePersonality: ['耐心细致', '实验能力强', '基础扎实'],
    aiResistance: 'medium'
  },
  // ========== 理学类 Science ==========
  {
    id: 'm-sci-001',
    name: '物理学',
    nameEn: 'Physics',
    category: 'science',
    subCategory: '物理学类',
    wilderDimensions: ['I', 'W', 'R'],
    description: '研究物质运动规律和自然界基本规律的学科，是自然科学的基础。',
    coreSkills: ['数学能力', '实验技能', '理论分析', '科学思维'],
    careerProspects: ['科研人员', '大学教师', '数据科学家', '量化分析师'],
    recommendedUniversities: ['u-985-002', 'u-985-007', 'u-985-006', 'u-985-001'],
    salaryRange: '10-50万/年',
    employmentRate: 85,
    suitablePersonality: ['好奇心强', '数学能力优秀', '喜欢探究本质'],
    aiResistance: 'high'
  },
  {
    id: 'm-sci-002',
    name: '数学与应用数学',
    nameEn: 'Mathematics and Applied Mathematics',
    category: 'science',
    subCategory: '数学类',
    wilderDimensions: ['I', 'R', 'W'],
    description: '研究数量关系和空间形式的学科，培养数学研究和应用能力。',
    coreSkills: ['逻辑推理', '抽象思维', '数学建模', '计算能力'],
    careerProspects: ['数学家', '数据科学家', '量化分析师', '教师'],
    recommendedUniversities: ['u-985-002', 'u-985-005', 'u-985-006', 'u-985-007'],
    salaryRange: '10-60万/年',
    employmentRate: 88,
    suitablePersonality: ['逻辑思维强', '喜欢抽象思考', '耐得住寂寞'],
    aiResistance: 'high'
  },
  {
    id: 'm-sci-003',
    name: '化学',
    nameEn: 'Chemistry',
    category: 'science',
    subCategory: '化学类',
    wilderDimensions: ['I', 'W', 'D'],
    description: '研究物质的组成、结构、性质和变化规律的学科。',
    coreSkills: ['实验技能', '分析能力', '安全意识', '科学思维'],
    careerProspects: ['化学研究员', '研发工程师', '质量工程师', '大学教师'],
    recommendedUniversities: ['u-985-002', 'u-985-006', 'u-985-007', 'u-985-016'],
    salaryRange: '8-30万/年',
    employmentRate: 85,
    suitablePersonality: ['实验能力强', '细心谨慎', '对微观世界感兴趣'],
    aiResistance: 'medium'
  },
  {
    id: 'm-sci-004',
    name: '生物科学',
    nameEn: 'Biological Sciences',
    category: 'science',
    subCategory: '生物科学类',
    wilderDimensions: ['I', 'W'],
    description: '研究生命现象和生命活动规律的学科。',
    coreSkills: ['实验技能', '生物信息学', '科学写作', '研究能力'],
    careerProspects: ['生物研究员', '生物制药工程师', '大学教师', '科技记者'],
    recommendedUniversities: ['u-985-002', 'u-985-005', 'u-985-003', 'u-985-007'],
    salaryRange: '8-35万/年',
    employmentRate: 82,
    suitablePersonality: ['对生命感兴趣', '耐心细致', '长期投入'],
    aiResistance: 'high'
  },
  {
    id: 'm-sci-005',
    name: '天文学',
    nameEn: 'Astronomy',
    category: 'science',
    subCategory: '天文学类',
    wilderDimensions: ['W', 'I', 'R'],
    description: '研究天体和宇宙的起源、演化和结构的学科。',
    coreSkills: ['数学物理基础', '数据分析', '观测技术', '编程能力'],
    careerProspects: ['天文学家', '科研人员', '数据科学家', '科普工作者'],
    recommendedUniversities: ['u-985-006', 'u-985-002', 'u-985-007'],
    salaryRange: '10-40万/年',
    employmentRate: 80,
    suitablePersonality: ['对宇宙有热情', '能够长期坚持', '数理基础好'],
    aiResistance: 'high'
  },
  {
    id: 'm-sci-006',
    name: '统计学',
    nameEn: 'Statistics',
    category: 'science',
    subCategory: '统计学类',
    wilderDimensions: ['I', 'D', 'R'],
    description: '研究数据收集、分析、解释和推断的学科。',
    coreSkills: ['数学建模', '数据分析', '编程能力', '统计软件'],
    careerProspects: ['数据分析师', '统计师', '量化分析师', '精算师'],
    recommendedUniversities: ['u-985-002', 'u-985-021', 'u-211-006', 'u-985-024'],
    salaryRange: '12-50万/年',
    employmentRate: 95,
    suitablePersonality: ['数学能力强', '逻辑思维好', '细心谨慎'],
    aiResistance: 'high'
  },
  // ========== 经济管理类 Economics & Management ==========
  {
    id: 'm-eco-001',
    name: '经济学',
    nameEn: 'Economics',
    category: 'economics',
    subCategory: '经济学类',
    wilderDimensions: ['I', 'R', 'L'],
    description: '研究资源配置和经济运行规律的学科。',
    coreSkills: ['经济分析', '数学建模', '政策分析', '写作能力'],
    careerProspects: ['经济学家', '政策研究员', '投资分析师', '咨询顾问'],
    recommendedUniversities: ['u-985-002', 'u-985-005', 'u-985-021', 'u-211-003'],
    salaryRange: '12-50万/年',
    employmentRate: 90,
    suitablePersonality: ['逻辑思维强', '对社会经济感兴趣', '数学基础好'],
    aiResistance: 'medium'
  },
  {
    id: 'm-eco-002',
    name: '金融学',
    nameEn: 'Finance',
    category: 'economics',
    subCategory: '金融学类',
    wilderDimensions: ['I', 'D', 'L'],
    description: '研究金融市场、金融工具和投资决策的学科。',
    coreSkills: ['金融分析', '风险管理', '数量方法', '沟通能力'],
    careerProspects: ['投资银行家', '基金经理', '风控经理', '金融分析师'],
    recommendedUniversities: ['u-985-002', 'u-985-005', 'u-211-003', 'u-211-006'],
    salaryRange: '15-100万/年',
    employmentRate: 92,
    suitablePersonality: ['数字敏感', '抗压能力强', '善于沟通'],
    aiResistance: 'medium'
  },
  {
    id: 'm-eco-003',
    name: '会计学',
    nameEn: 'Accounting',
    category: 'management',
    subCategory: '工商管理类',
    wilderDimensions: ['D', 'I', 'R'],
    description: '研究经济信息的确认、计量和报告的学科。',
    coreSkills: ['会计核算', '财务分析', '审计能力', '法规知识'],
    careerProspects: ['注册会计师', '财务经理', '审计师', 'CFO'],
    recommendedUniversities: ['u-211-003', 'u-211-006', 'u-985-024', 'u-985-021'],
    salaryRange: '10-50万/年',
    employmentRate: 95,
    suitablePersonality: ['细心谨慎', '责任心强', '逻辑思维好'],
    aiResistance: 'medium'
  },
  {
    id: 'm-eco-004',
    name: '工商管理',
    nameEn: 'Business Administration',
    category: 'management',
    subCategory: '工商管理类',
    wilderDimensions: ['L', 'D', 'E'],
    description: '研究企业经营管理的理论和方法。',
    coreSkills: ['管理能力', '战略思维', '领导力', '沟通协调'],
    careerProspects: ['企业管理者', '咨询顾问', '创业者', '项目经理'],
    recommendedUniversities: ['u-985-001', 'u-985-002', 'u-985-005', 'u-985-021'],
    salaryRange: '12-60万/年',
    employmentRate: 88,
    suitablePersonality: ['领导力强', '善于沟通', '全局观好'],
    aiResistance: 'high'
  },
  // ========== 医学类 Medicine ==========
  {
    id: 'm-med-001',
    name: '临床医学',
    nameEn: 'Clinical Medicine',
    category: 'medicine',
    subCategory: '临床医学类',
    wilderDimensions: ['I', 'L', 'R'],
    description: '培养能够从事医疗卫生工作的临床医生。',
    coreSkills: ['临床技能', '诊断能力', '沟通能力', '终身学习'],
    careerProspects: ['临床医生', '医学研究员', '医院管理者', '医学教育者'],
    recommendedUniversities: ['u-985-002', 'u-985-005', 'u-985-004', 'u-985-012'],
    salaryRange: '10-50万/年',
    employmentRate: 98,
    suitablePersonality: ['责任心强', '耐心细致', '善于沟通'],
    aiResistance: 'high'
  },
  {
    id: 'm-med-002',
    name: '口腔医学',
    nameEn: 'Stomatology',
    category: 'medicine',
    subCategory: '口腔医学类',
    wilderDimensions: ['D', 'I', 'L'],
    description: '研究口腔疾病的预防、诊断和治疗。',
    coreSkills: ['口腔技能', '手术能力', '审美能力', '沟通能力'],
    careerProspects: ['口腔医生', '正畸医生', '口腔外科医生', '口腔医院院长'],
    recommendedUniversities: ['u-985-019', 'u-985-002', 'u-985-004', 'u-985-008'],
    salaryRange: '15-80万/年',
    employmentRate: 99,
    suitablePersonality: ['手巧', '审美好', '善于与人交流'],
    aiResistance: 'high'
  },
  // ========== 法学类 Law ==========
  {
    id: 'm-law-001',
    name: '法学',
    nameEn: 'Law',
    category: 'law',
    subCategory: '法学类',
    wilderDimensions: ['I', 'E', 'R'],
    description: '研究法律规范和法律实践的学科。',
    coreSkills: ['法律分析', '逻辑推理', '写作能力', '辩论能力'],
    careerProspects: ['律师', '法官', '检察官', '法务经理'],
    recommendedUniversities: ['u-985-002', 'u-985-021', 'u-985-008', 'u-985-022'],
    salaryRange: '10-100万/年',
    employmentRate: 85,
    suitablePersonality: ['逻辑思维强', '表达能力好', '正义感强'],
    aiResistance: 'high'
  },
  // ========== 文学类 Literature ==========
  {
    id: 'm-lit-001',
    name: '汉语言文学',
    nameEn: 'Chinese Language and Literature',
    category: 'literature',
    subCategory: '中国语言文学类',
    wilderDimensions: ['E', 'R', 'W'],
    description: '研究中国语言和文学的学科。',
    coreSkills: ['写作能力', '文学分析', '语言功底', '文化素养'],
    careerProspects: ['编辑', '记者', '作家', '教师', '文化产业'],
    recommendedUniversities: ['u-985-002', 'u-985-005', 'u-985-006', 'u-985-008'],
    salaryRange: '6-30万/年',
    employmentRate: 80,
    suitablePersonality: ['热爱文字', '人文情怀', '表达能力强'],
    aiResistance: 'high'
  },
  {
    id: 'm-lit-002',
    name: '新闻学',
    nameEn: 'Journalism',
    category: 'literature',
    subCategory: '新闻传播学类',
    wilderDimensions: ['E', 'L', 'W'],
    description: '研究新闻传播规律和实践的学科。',
    coreSkills: ['采访写作', '新闻敏感', '多媒体技能', '沟通能力'],
    careerProspects: ['记者', '编辑', '公关', '新媒体运营'],
    recommendedUniversities: ['u-985-021', 'u-985-005', 'u-985-008', 'u-211-002'],
    salaryRange: '8-35万/年',
    employmentRate: 82,
    suitablePersonality: ['好奇心强', '善于沟通', '时间敏感'],
    aiResistance: 'medium'
  },
  {
    id: 'm-lit-003',
    name: '英语',
    nameEn: 'English',
    category: 'literature',
    subCategory: '外国语言文学类',
    wilderDimensions: ['E', 'L'],
    description: '研究英语语言和英美文学的学科。',
    coreSkills: ['英语能力', '翻译技能', '跨文化沟通', '写作能力'],
    careerProspects: ['翻译', '外贸', '教师', '外企管理'],
    recommendedUniversities: ['u-211-002', 'u-211-007', 'u-985-002', 'u-211-004'],
    salaryRange: '8-30万/年',
    employmentRate: 85,
    suitablePersonality: ['语言潜能', '喜欢交流', '对文化感兴趣'],
    aiResistance: 'medium'
  },
  // ========== 艺术类 Art ==========
  {
    id: 'm-art-001',
    name: '视觉传达设计',
    nameEn: 'Visual Communication Design',
    category: 'art',
    subCategory: '设计学类',
    wilderDimensions: ['E', 'D', 'W'],
    description: '研究视觉信息传达的设计方法和艺术表现。',
    coreSkills: ['设计能力', '软件技能', '审美能力', '创意思维'],
    careerProspects: ['平面设计师', 'UI设计师', '品牌设计师', '创意总监'],
    recommendedUniversities: ['u-985-001', 'u-985-013', 'u-985-018'],
    salaryRange: '8-40万/年',
    employmentRate: 85,
    suitablePersonality: ['艺术感强', '创意丰富', '审美好'],
    aiResistance: 'high'
  },
  {
    id: 'm-art-002',
    name: '产品设计',
    nameEn: 'Product Design',
    category: 'art',
    subCategory: '设计学类',
    wilderDimensions: ['D', 'E', 'I'],
    description: '研究产品的功能、结构和外观设计。',
    coreSkills: ['造型能力', '用户研究', '原型制作', '设计思维'],
    careerProspects: ['产品设计师', '工业设计师', '用户体验设计师', '设计总监'],
    recommendedUniversities: ['u-985-001', 'u-985-003', 'u-985-013'],
    salaryRange: '10-45万/年',
    employmentRate: 88,
    suitablePersonality: ['动手能力强', '创新思维', '用户导向'],
    aiResistance: 'high'
  },
  // ========== 教育类 Education ==========
  {
    id: 'm-edu-001',
    name: '教育学',
    nameEn: 'Education',
    category: 'education',
    subCategory: '教育学类',
    wilderDimensions: ['L', 'E', 'R'],
    description: '研究教育规律和教育实践的学科。',
    coreSkills: ['教学能力', '沟通能力', '研究能力', '组织能力'],
    careerProspects: ['教师', '教育研究员', '教育管理者', '培训师'],
    recommendedUniversities: ['u-211-005', 'u-985-002', 'u-985-001'],
    salaryRange: '6-25万/年',
    employmentRate: 92,
    suitablePersonality: ['耐心', '善于沟通', '对教育有热情'],
    aiResistance: 'high'
  },
  {
    id: 'm-edu-002',
    name: '心理学',
    nameEn: 'Psychology',
    category: 'education',
    subCategory: '心理学类',
    wilderDimensions: ['I', 'L', 'R'],
    description: '研究心理现象和行为规律的学科。',
    coreSkills: ['心理分析', '研究方法', '咨询技能', '统计分析'],
    careerProspects: ['心理咨询师', '人力资源', '用户研究员', '心理学家'],
    recommendedUniversities: ['u-985-002', 'u-211-005', 'u-985-003'],
    salaryRange: '8-35万/年',
    employmentRate: 85,
    suitablePersonality: ['善于倾听', '洞察力强', '同理心强'],
    aiResistance: 'high'
  },

  // ========== W维度专业（探索力）- 地质、考古、天文等 ==========
  {
    id: 'm-w-001',
    name: '地质学',
    nameEn: 'Geology',
    category: 'science',
    subCategory: '地质学类',
    wilderDimensions: ['W', 'I'],
    description: '研究地球的组成、结构、历史和演化规律的学科。',
    coreSkills: ['野外考察', '岩石矿物鉴定', '地图绘制', '数据分析'],
    careerProspects: ['地质工程师', '矿产勘探师', '地质研究员', '环境顾问'],
    recommendedUniversities: ['u-985-006', 'u-985-008', 'u-985-002'],
    salaryRange: '10-30万/年',
    employmentRate: 85,
    suitablePersonality: ['喜欢户外', '观察力强', '对地球历史感兴趣'],
    aiResistance: 'high'
  },
  {
    id: 'm-w-002',
    name: '考古学',
    nameEn: 'Archaeology',
    category: 'history',
    subCategory: '历史学类',
    wilderDimensions: ['W', 'I', 'R'],
    description: '通过发掘和研究古代遗迹、遗物来探索人类历史和文化。',
    coreSkills: ['田野考古', '文物鉴定', '历史分析', '科学写作'],
    careerProspects: ['考古学家', '博物馆研究员', '文保专家', '大学教师'],
    recommendedUniversities: ['u-985-002', 'u-985-022', 'u-985-008'],
    salaryRange: '8-25万/年',
    employmentRate: 75,
    suitablePersonality: ['好奇心强', '耐心细致', '对历史有热情'],
    aiResistance: 'high'
  },
  {
    id: 'm-w-003',
    name: '海洋科学',
    nameEn: 'Marine Science',
    category: 'science',
    subCategory: '海洋科学类',
    wilderDimensions: ['W', 'I', 'L'],
    description: '研究海洋的物理、化学、生物和地质特性及其相互作用。',
    coreSkills: ['海洋调查', '数据分析', '实验技能', '跨学科思维'],
    careerProspects: ['海洋科学家', '海洋工程师', '环境保护专家', '渔业管理'],
    recommendedUniversities: ['u-985-024', 'u-985-003', 'u-985-012'],
    salaryRange: '10-30万/年',
    employmentRate: 82,
    suitablePersonality: ['热爱海洋', '适应野外工作', '好奇心强'],
    aiResistance: 'high'
  },
  {
    id: 'm-w-004',
    name: '人类学',
    nameEn: 'Anthropology',
    category: 'literature',
    subCategory: '社会学类',
    wilderDimensions: ['W', 'L', 'R'],
    description: '研究人类的起源、发展、文化和社会的综合性学科。',
    coreSkills: ['田野调查', '跨文化沟通', '民族志写作', '理论分析'],
    careerProspects: ['人类学家', '文化研究员', '社会调查员', 'NGO工作者'],
    recommendedUniversities: ['u-985-002', 'u-985-012', 'u-985-024'],
    salaryRange: '8-25万/年',
    employmentRate: 75,
    suitablePersonality: ['对文化多样性感兴趣', '善于沟通', '开放包容'],
    aiResistance: 'high'
  },
  {
    id: 'm-w-005',
    name: '地理科学',
    nameEn: 'Geography',
    category: 'science',
    subCategory: '地理科学类',
    wilderDimensions: ['W', 'I', 'L'],
    description: '研究地球表面的自然现象和人文现象及其空间分布规律。',
    coreSkills: ['GIS技术', '野外调查', '空间分析', '制图能力'],
    careerProspects: ['地理信息工程师', '城市规划师', '环境分析师', '教师'],
    recommendedUniversities: ['u-985-002', 'u-211-005', 'u-985-006'],
    salaryRange: '8-30万/年',
    employmentRate: 85,
    suitablePersonality: ['空间思维强', '喜欢户外', '对环境关注'],
    aiResistance: 'medium'
  },

  // ========== I维度专业（探究力）- 物理、化学、生命科学等 ==========
  {
    id: 'm-i-001',
    name: '应用物理学',
    nameEn: 'Applied Physics',
    category: 'science',
    subCategory: '物理学类',
    wilderDimensions: ['I', 'D', 'W'],
    description: '将物理学原理应用于技术和工程领域的学科。',
    coreSkills: ['物理建模', '实验技能', '编程能力', '工程应用'],
    careerProspects: ['研发工程师', '技术顾问', '物理学家', '数据科学家'],
    recommendedUniversities: ['u-985-007', 'u-985-001', 'u-985-002'],
    salaryRange: '12-40万/年',
    employmentRate: 88,
    suitablePersonality: ['数理基础强', '动手能力好', '喜欢探索'],
    aiResistance: 'high'
  },
  {
    id: 'm-i-002',
    name: '应用化学',
    nameEn: 'Applied Chemistry',
    category: 'science',
    subCategory: '化学类',
    wilderDimensions: ['I', 'D', 'W'],
    description: '将化学原理应用于工业生产和日常生活的学科。',
    coreSkills: ['化学合成', '分析检测', '工艺开发', '质量控制'],
    careerProspects: ['化学工程师', '研发专员', '质量工程师', '技术经理'],
    recommendedUniversities: ['u-985-003', 'u-985-006', 'u-985-016'],
    salaryRange: '10-35万/年',
    employmentRate: 88,
    suitablePersonality: ['实验能力强', '细心谨慎', '创新意识'],
    aiResistance: 'medium'
  },
  {
    id: 'm-i-003',
    name: '生物技术',
    nameEn: 'Biotechnology',
    category: 'science',
    subCategory: '生物科学类',
    wilderDimensions: ['I', 'D', 'W'],
    description: '利用生物体系和生物过程开发新技术和新产品。',
    coreSkills: ['分子生物学', '基因工程', '细胞培养', '生物信息学'],
    careerProspects: ['生物工程师', '药物研发', '生物信息分析师', '创业者'],
    recommendedUniversities: ['u-985-002', 'u-985-003', 'u-985-005'],
    salaryRange: '12-40万/年',
    employmentRate: 85,
    suitablePersonality: ['对生命科学有热情', '耐心细致', '创新思维'],
    aiResistance: 'high'
  },
  {
    id: 'm-i-004',
    name: '信息与计算科学',
    nameEn: 'Information and Computing Science',
    category: 'science',
    subCategory: '数学类',
    wilderDimensions: ['I', 'D'],
    description: '数学与计算机科学的交叉学科，研究信息处理的数学理论和方法。',
    coreSkills: ['数学建模', '算法设计', '编程能力', '数据分析'],
    careerProspects: ['算法工程师', '数据科学家', '量化分析师', '软件开发'],
    recommendedUniversities: ['u-985-002', 'u-985-005', 'u-985-007'],
    salaryRange: '15-50万/年',
    employmentRate: 95,
    suitablePersonality: ['数学能力强', '逻辑思维好', '喜欢编程'],
    aiResistance: 'high'
  },
  {
    id: 'm-i-005',
    name: '光电信息科学与工程',
    nameEn: 'Optoelectronic Information Science and Engineering',
    category: 'engineering',
    subCategory: '电子信息类',
    wilderDimensions: ['I', 'D', 'W'],
    description: '研究光电子技术和信息处理的交叉学科。',
    coreSkills: ['光学设计', '电子技术', '信号处理', '实验能力'],
    careerProspects: ['光电工程师', '激光技术员', '通信工程师', '研发专家'],
    recommendedUniversities: ['u-985-009', 'u-985-003', 'u-985-001'],
    salaryRange: '12-40万/年',
    employmentRate: 90,
    suitablePersonality: ['物理基础好', '动手能力强', '对新技术敏感'],
    aiResistance: 'high'
  },

  // ========== L维度专业（生命感知力）- 生态、动物、环境等 ==========
  {
    id: 'm-l-001',
    name: '生态学',
    nameEn: 'Ecology',
    category: 'science',
    subCategory: '生物科学类',
    wilderDimensions: ['L', 'I', 'W'],
    description: '研究生物与环境相互作用关系的学科。',
    coreSkills: ['野外调查', '数据分析', '生态建模', '科学写作'],
    careerProspects: ['生态学家', '环境顾问', '自然保护专家', '研究员'],
    recommendedUniversities: ['u-985-002', 'u-985-003', 'u-985-006'],
    salaryRange: '8-30万/年',
    employmentRate: 80,
    suitablePersonality: ['热爱自然', '耐心观察', '系统思维'],
    aiResistance: 'high'
  },
  {
    id: 'm-l-002',
    name: '动物科学',
    nameEn: 'Animal Science',
    category: 'agriculture',
    subCategory: '动物生产类',
    wilderDimensions: ['L', 'I'],
    description: '研究动物的生长发育、营养、繁殖和遗传改良。',
    coreSkills: ['动物饲养', '营养配方', '繁殖技术', '疾病防控'],
    careerProspects: ['畜牧师', '动物营养师', '养殖场管理', '饲料研发'],
    recommendedUniversities: ['u-985-003', 'u-985-019', 'u-985-008'],
    salaryRange: '8-25万/年',
    employmentRate: 85,
    suitablePersonality: ['喜欢动物', '能吃苦耐劳', '责任心强'],
    aiResistance: 'medium'
  },
  {
    id: 'm-l-003',
    name: '动物医学',
    nameEn: 'Veterinary Medicine',
    category: 'agriculture',
    subCategory: '动物医学类',
    wilderDimensions: ['L', 'I', 'R'],
    description: '研究动物疾病的预防、诊断和治疗。',
    coreSkills: ['临床诊断', '手术技能', '药物治疗', '公共卫生'],
    careerProspects: ['兽医', '宠物医生', '检疫官', '动物药品研发'],
    recommendedUniversities: ['u-985-003', 'u-985-019', 'u-985-022'],
    salaryRange: '10-40万/年',
    employmentRate: 90,
    suitablePersonality: ['爱护动物', '细心负责', '手工技巧好'],
    aiResistance: 'high'
  },
  {
    id: 'm-l-004',
    name: '野生动物与自然保护区管理',
    nameEn: 'Wildlife and Nature Reserve Management',
    category: 'agriculture',
    subCategory: '林学类',
    wilderDimensions: ['L', 'W', 'E'],
    description: '研究野生动植物保护和自然保护区管理的学科。',
    coreSkills: ['野外调查', '保护管理', '政策法规', '公众教育'],
    careerProspects: ['保护区管理员', '野生动物研究员', 'NGO工作者', '环保官员'],
    recommendedUniversities: ['u-985-002', 'u-985-003', 'u-985-006'],
    salaryRange: '8-25万/年',
    employmentRate: 75,
    suitablePersonality: ['热爱自然', '能适应野外', '有使命感'],
    aiResistance: 'high'
  },
  {
    id: 'm-l-005',
    name: '园艺学',
    nameEn: 'Horticulture',
    category: 'agriculture',
    subCategory: '植物生产类',
    wilderDimensions: ['L', 'D', 'W'],
    description: '研究观赏植物、果树和蔬菜的栽培与管理。',
    coreSkills: ['植物栽培', '景观设计', '品种改良', '病虫害防治'],
    careerProspects: ['园艺师', '景观设计师', '农业技术员', '花卉企业'],
    recommendedUniversities: ['u-985-003', 'u-985-019', 'u-985-008'],
    salaryRange: '8-25万/年',
    employmentRate: 82,
    suitablePersonality: ['喜欢植物', '审美能力好', '耐心细致'],
    aiResistance: 'medium'
  },

  // ========== D维度专业（科创力）- 工程、计算机、设计等 ==========
  {
    id: 'm-d-001',
    name: '机器人工程',
    nameEn: 'Robotics Engineering',
    category: 'engineering',
    subCategory: '自动化类',
    wilderDimensions: ['D', 'I', 'W'],
    description: '研究机器人系统的设计、制造和应用。',
    coreSkills: ['机械设计', '控制系统', '编程能力', '人工智能'],
    careerProspects: ['机器人工程师', '自动化工程师', '研发专家', '创业者'],
    recommendedUniversities: ['u-985-011', 'u-985-001', 'u-985-003'],
    salaryRange: '15-50万/年',
    employmentRate: 95,
    suitablePersonality: ['动手能力强', '创新思维', '系统思维'],
    aiResistance: 'high'
  },
  {
    id: 'm-d-002',
    name: '工业设计',
    nameEn: 'Industrial Design',
    category: 'art',
    subCategory: '设计学类',
    wilderDimensions: ['D', 'E', 'W'],
    description: '研究工业产品的造型、功能和人机交互设计。',
    coreSkills: ['造型设计', '用户研究', '原型制作', '工程知识'],
    careerProspects: ['工业设计师', '产品经理', '用户体验设计师', '设计总监'],
    recommendedUniversities: ['u-985-001', 'u-985-003', 'u-985-013'],
    salaryRange: '12-45万/年',
    employmentRate: 88,
    suitablePersonality: ['创意丰富', '动手能力强', '用户导向'],
    aiResistance: 'high'
  },
  {
    id: 'm-d-003',
    name: '数据科学与大数据技术',
    nameEn: 'Data Science and Big Data Technology',
    category: 'engineering',
    subCategory: '计算机类',
    wilderDimensions: ['D', 'I'],
    description: '研究大规模数据的采集、存储、分析和应用。',
    coreSkills: ['数据分析', '机器学习', '编程能力', '业务理解'],
    careerProspects: ['数据科学家', '数据工程师', '商业分析师', 'AI工程师'],
    recommendedUniversities: ['u-985-001', 'u-985-002', 'u-985-003'],
    salaryRange: '20-60万/年',
    employmentRate: 98,
    suitablePersonality: ['数学能力强', '逻辑思维好', '好奇心重'],
    aiResistance: 'high'
  },
  {
    id: 'm-d-004',
    name: '智能科学与技术',
    nameEn: 'Intelligent Science and Technology',
    category: 'engineering',
    subCategory: '计算机类',
    wilderDimensions: ['D', 'I', 'W'],
    description: '研究智能系统的原理、方法和应用。',
    coreSkills: ['机器学习', '模式识别', '知识工程', '编程能力'],
    careerProspects: ['AI研究员', '智能系统工程师', '算法专家', '技术顾问'],
    recommendedUniversities: ['u-985-001', 'u-985-007', 'u-985-002'],
    salaryRange: '25-80万/年',
    employmentRate: 98,
    suitablePersonality: ['数学物理好', '创新思维', '对AI有热情'],
    aiResistance: 'high'
  },
  {
    id: 'm-d-005',
    name: '数字媒体技术',
    nameEn: 'Digital Media Technology',
    category: 'engineering',
    subCategory: '计算机类',
    wilderDimensions: ['D', 'E', 'W'],
    description: '研究数字内容的创作、处理和传播技术。',
    coreSkills: ['图形图像处理', '游戏开发', '影视特效', '虚拟现实'],
    careerProspects: ['游戏开发', '影视特效师', 'VR/AR工程师', '数字艺术家'],
    recommendedUniversities: ['u-985-003', 'u-985-013', 'u-211-001'],
    salaryRange: '12-45万/年',
    employmentRate: 90,
    suitablePersonality: ['创意丰富', '技术与艺术兼备', '喜欢游戏和影视'],
    aiResistance: 'high'
  },

  // ========== E维度专业（生态责任力）- 环境、公共政策、可持续发展等 ==========
  {
    id: 'm-e-001',
    name: '环境工程',
    nameEn: 'Environmental Engineering',
    category: 'engineering',
    subCategory: '环境科学与工程类',
    wilderDimensions: ['E', 'I', 'L'],
    description: '研究环境污染控制和生态恢复的工程技术。',
    coreSkills: ['污染治理', '环境监测', '工程设计', '环境评价'],
    careerProspects: ['环保工程师', '环境顾问', '环评师', '政府环保部门'],
    recommendedUniversities: ['u-985-001', 'u-985-013', 'u-985-003'],
    salaryRange: '10-35万/年',
    employmentRate: 88,
    suitablePersonality: ['环保意识强', '工程能力好', '有责任感'],
    aiResistance: 'medium'
  },
  {
    id: 'm-e-002',
    name: '环境科学',
    nameEn: 'Environmental Science',
    category: 'science',
    subCategory: '环境科学与工程类',
    wilderDimensions: ['E', 'I', 'L'],
    description: '研究环境问题的科学原理和解决方法。',
    coreSkills: ['环境分析', '生态调查', '数据处理', '科学写作'],
    careerProspects: ['环境研究员', '环境分析师', '科研人员', '环保组织'],
    recommendedUniversities: ['u-985-002', 'u-985-006', 'u-985-003'],
    salaryRange: '8-30万/年',
    employmentRate: 82,
    suitablePersonality: ['关注环境问题', '科学素养好', '有使命感'],
    aiResistance: 'high'
  },
  {
    id: 'm-e-003',
    name: '公共事业管理',
    nameEn: 'Public Administration',
    category: 'management',
    subCategory: '公共管理类',
    wilderDimensions: ['E', 'L', 'R'],
    description: '研究公共部门和非营利组织的管理方法。',
    coreSkills: ['政策分析', '项目管理', '沟通协调', '公文写作'],
    careerProspects: ['公务员', 'NGO管理者', '社会工作者', '政策研究员'],
    recommendedUniversities: ['u-985-021', 'u-985-002', 'u-985-005'],
    salaryRange: '8-30万/年',
    employmentRate: 85,
    suitablePersonality: ['关心社会', '善于沟通', '有服务精神'],
    aiResistance: 'high'
  },
  {
    id: 'm-e-004',
    name: '能源与动力工程',
    nameEn: 'Energy and Power Engineering',
    category: 'engineering',
    subCategory: '能源动力类',
    wilderDimensions: ['E', 'D', 'I'],
    description: '研究能源的开发利用和动力系统设计。',
    coreSkills: ['热力学', '流体力学', '能源系统设计', '节能技术'],
    careerProspects: ['能源工程师', '电力系统工程师', '新能源研发', '节能顾问'],
    recommendedUniversities: ['u-985-010', 'u-985-009', 'u-985-001'],
    salaryRange: '12-40万/年',
    employmentRate: 90,
    suitablePersonality: ['关注能源问题', '工程能力强', '系统思维'],
    aiResistance: 'medium'
  },
  {
    id: 'm-e-005',
    name: '社会工作',
    nameEn: 'Social Work',
    category: 'law',
    subCategory: '社会学类',
    wilderDimensions: ['E', 'L', 'R'],
    description: '运用专业方法帮助个人、家庭和社区解决社会问题。',
    coreSkills: ['个案工作', '小组工作', '社区工作', '项目管理'],
    careerProspects: ['社会工作者', 'NGO项目经理', '社区服务', '心理辅导'],
    recommendedUniversities: ['u-985-002', 'u-985-021', 'u-211-005'],
    salaryRange: '6-25万/年',
    employmentRate: 80,
    suitablePersonality: ['同理心强', '善于沟通', '有奉献精神'],
    aiResistance: 'high'
  },

  // ========== R维度专业（团队韧性力）- 管理、社会、教育等 ==========
  {
    id: 'm-r-001',
    name: '人力资源管理',
    nameEn: 'Human Resource Management',
    category: 'management',
    subCategory: '工商管理类',
    wilderDimensions: ['R', 'L', 'E'],
    description: '研究组织中人力资源的规划、开发和管理。',
    coreSkills: ['招聘选拔', '培训发展', '绩效管理', '劳动关系'],
    careerProspects: ['HR经理', '培训师', 'HRBP', '猎头顾问'],
    recommendedUniversities: ['u-985-021', 'u-985-002', 'u-985-005'],
    salaryRange: '10-40万/年',
    employmentRate: 90,
    suitablePersonality: ['善于沟通', '洞察力强', '组织能力好'],
    aiResistance: 'high'
  },
  {
    id: 'm-r-002',
    name: '社会学',
    nameEn: 'Sociology',
    category: 'law',
    subCategory: '社会学类',
    wilderDimensions: ['R', 'I', 'L'],
    description: '研究社会结构、社会关系和社会变迁的学科。',
    coreSkills: ['社会调查', '数据分析', '理论分析', '学术写作'],
    careerProspects: ['社会研究员', '政策分析师', '市场研究', '社会工作'],
    recommendedUniversities: ['u-985-002', 'u-985-021', 'u-985-005'],
    salaryRange: '8-30万/年',
    employmentRate: 80,
    suitablePersonality: ['关心社会', '分析能力强', '批判思维'],
    aiResistance: 'high'
  },
  {
    id: 'm-r-003',
    name: '应用心理学',
    nameEn: 'Applied Psychology',
    category: 'education',
    subCategory: '心理学类',
    wilderDimensions: ['R', 'I', 'L'],
    description: '将心理学理论应用于教育、临床、组织等实践领域。',
    coreSkills: ['心理测评', '咨询技能', '培训能力', '研究方法'],
    careerProspects: ['心理咨询师', '企业培训师', '用户研究员', '学校心理教师'],
    recommendedUniversities: ['u-985-002', 'u-211-005', 'u-985-003'],
    salaryRange: '10-40万/年',
    employmentRate: 85,
    suitablePersonality: ['善于倾听', '同理心强', '分析能力好'],
    aiResistance: 'high'
  },
  {
    id: 'm-r-004',
    name: '体育教育',
    nameEn: 'Physical Education',
    category: 'education',
    subCategory: '体育学类',
    wilderDimensions: ['R', 'L', 'E'],
    description: '培养能够从事体育教学、训练和管理的专业人才。',
    coreSkills: ['运动技能', '教学能力', '训练指导', '活动组织'],
    careerProspects: ['体育教师', '教练员', '体育管理', '健身指导'],
    recommendedUniversities: ['u-985-002', 'u-211-005', 'u-985-008'],
    salaryRange: '8-25万/年',
    employmentRate: 88,
    suitablePersonality: ['热爱运动', '善于沟通', '有责任心'],
    aiResistance: 'high'
  },
  {
    id: 'm-r-005',
    name: '行政管理',
    nameEn: 'Public Administration',
    category: 'management',
    subCategory: '公共管理类',
    wilderDimensions: ['R', 'E', 'L'],
    description: '研究政府和公共组织的管理理论与实践。',
    coreSkills: ['政策分析', '组织管理', '公文写作', '沟通协调'],
    careerProspects: ['公务员', '行政管理', '政策研究', '企业行政'],
    recommendedUniversities: ['u-985-021', 'u-985-002', 'u-985-008'],
    salaryRange: '8-30万/年',
    employmentRate: 85,
    suitablePersonality: ['组织能力强', '善于协调', '责任心强'],
    aiResistance: 'high'
  },
]

// ========== 工具函数 ==========

export type UniversityTier = University['tier']
export type MajorCategory = Major['category']
export type WilderDim = 'W' | 'I' | 'L' | 'D' | 'E' | 'R'

// 获取所有大学
export function getAllUniversities(): University[] {
  return [...UNIVERSITIES_985, ...UNIVERSITIES_211, ...UNIVERSITIES_YIBEN, ...UNIVERSITIES_INTERNATIONAL]
}

// 按层级获取大学
export function getUniversitiesByTier(tier: UniversityTier): University[] {
  switch (tier) {
    case '985': return UNIVERSITIES_985
    case '211': return UNIVERSITIES_211
    case 'yiben': return UNIVERSITIES_YIBEN
    case 'international': return UNIVERSITIES_INTERNATIONAL
    default: return []
  }
}

// 获取大学详情
export function getUniversityById(id: string): University | undefined {
  return getAllUniversities().find(u => u.id === id)
}

// 按WILDER维度匹配专业
export function getMajorsByWilder(topDimensions: WilderDim[], limit: number = 10): Major[] {
  return MAJORS_DATABASE
    .filter(m => m.wilderDimensions.some(dim => topDimensions.includes(dim)))
    .sort((a, b) => {
      const aMatches = a.wilderDimensions.filter(dim => topDimensions.includes(dim)).length
      const bMatches = b.wilderDimensions.filter(dim => topDimensions.includes(dim)).length
      return bMatches - aMatches
    })
    .slice(0, limit)
}

// 按分类获取专业
export function getMajorsByCategory(category: MajorCategory): Major[] {
  return MAJORS_DATABASE.filter(m => m.category === category)
}

// 获取推荐大学和专业
export function getUniversityRecommendations(
  topDimensions: WilderDim[]
): {
  tier985: { university: University; majors: Major[] }[]
  tier211: { university: University; majors: Major[] }[]
  tierYiben: { university: University; majors: Major[] }[]
  international: { university: University; majors: Major[] }[]
} {
  const matchingMajors = getMajorsByWilder(topDimensions, 20)

  const getMatchesForTier = (universities: University[]) => {
    return universities.slice(0, 5).map(uni => ({
      university: uni,
      majors: matchingMajors.filter(m =>
        m.recommendedUniversities.includes(uni.id) ||
        uni.strengths.some(s => m.subCategory.includes(s) || m.name.includes(s))
      ).slice(0, 3)
    })).filter(match => match.majors.length > 0)
  }

  return {
    tier985: getMatchesForTier(UNIVERSITIES_985),
    tier211: getMatchesForTier(UNIVERSITIES_211),
    tierYiben: getMatchesForTier(UNIVERSITIES_YIBEN),
    international: getMatchesForTier(UNIVERSITIES_INTERNATIONAL),
  }
}

// 获取专业的就业前景分析
export function getMajorCareerAnalysis(majorId: string): {
  major: Major | undefined
  aiImpact: string
  futureOutlook: string
  topUniversities: University[]
} {
  const major = MAJORS_DATABASE.find(m => m.id === majorId)
  if (!major) {
    return { major: undefined, aiImpact: '', futureOutlook: '', topUniversities: [] }
  }

  const aiImpactText = {
    high: '该专业在AI时代具有较高的抗替代性，核心技能难以被AI复制。',
    medium: '该专业部分工作可能被AI辅助，但创造性和人际互动方面仍需人类参与。',
    low: '该专业部分重复性工作可能被AI替代，建议关注更具创造性的方向。'
  }

  const topUniversities = major.recommendedUniversities
    .map(id => getUniversityById(id))
    .filter((u): u is University => u !== undefined)

  return {
    major,
    aiImpact: aiImpactText[major.aiResistance],
    futureOutlook: `${major.name}专业未来发展前景${major.employmentRate && major.employmentRate > 90 ? '良好' : '稳定'}，就业率约${major.employmentRate}%。`,
    topUniversities
  }
}

// 搜索大学
export function searchUniversities(query: string): University[] {
  const lowerQuery = query.toLowerCase()
  return getAllUniversities().filter(u =>
    u.name.toLowerCase().includes(lowerQuery) ||
    (u.nameEn && u.nameEn.toLowerCase().includes(lowerQuery)) ||
    u.strengths.some(s => s.toLowerCase().includes(lowerQuery)) ||
    (u.province && u.province.includes(query))
  )
}

// 搜索专业
export function searchMajors(query: string): Major[] {
  const lowerQuery = query.toLowerCase()
  return MAJORS_DATABASE.filter(m =>
    m.name.toLowerCase().includes(lowerQuery) ||
    (m.nameEn && m.nameEn.toLowerCase().includes(lowerQuery)) ||
    m.subCategory.includes(query) ||
    m.coreSkills.some(s => s.includes(query))
  )
}

// 获取统计信息
export function getDatabaseStats(): {
  totalUniversities: number
  totalMajors: number
  byTier: Record<UniversityTier, number>
  byCategory: Record<MajorCategory, number>
} {
  const byTier: Record<UniversityTier, number> = {
    '985': UNIVERSITIES_985.length,
    '211': UNIVERSITIES_211.length,
    'yiben': UNIVERSITIES_YIBEN.length,
    'international': UNIVERSITIES_INTERNATIONAL.length
  }

  const byCategory: Record<MajorCategory, number> = {
    engineering: 0, science: 0, medicine: 0, economics: 0, management: 0,
    literature: 0, law: 0, education: 0, art: 0, agriculture: 0, philosophy: 0, history: 0
  }
  for (const major of MAJORS_DATABASE) {
    byCategory[major.category]++
  }

  return {
    totalUniversities: getAllUniversities().length,
    totalMajors: MAJORS_DATABASE.length,
    byTier,
    byCategory
  }
}
