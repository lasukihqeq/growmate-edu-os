/**
 * 学校数据模块
 * 提供代表性学校列表 + 拼音映射，支持自动补全搜索
 */

// ========== 类型 ==========

export type SchoolCategory = '小学' | '初中' | '高中' | '九年一贯制' | '完全中学'

export interface SchoolItem {
  id: string
  name: string
  pinyin: string
  initial: string       // 拼音首字母
  category: SchoolCategory[]
  province: string      // 省份 code
  city: string          // 城市 code
  district?: string     // 区县 code
}

export interface SchoolSearchResult {
  school: SchoolItem
  matchType: 'name' | 'pinyin' | 'initial'
  highlight: string
}

// ========== 常见学校数据 ==========

export const SCHOOLS: SchoolItem[] = [
  // 北京
  { id: 'bj001', name: '北京市海淀区中关村第一小学', pinyin: 'zhongguancunyixiao', initial: 'Z', category: ['小学'], province: '110000', city: '110100', district: '110108' },
  { id: 'bj002', name: '北京市海淀区中关村第三小学', pinyin: 'zhongguancunsanxiao', initial: 'Z', category: ['小学'], province: '110000', city: '110100', district: '110108' },
  { id: 'bj003', name: '北京市海淀区中关村第二小学', pinyin: 'zhongguancunerxiao', initial: 'Z', category: ['小学'], province: '110000', city: '110100', district: '110108' },
  { id: 'bj004', name: '北京市海淀区五一小学', pinyin: 'wuyixiaoxue', initial: 'W', category: ['小学'], province: '110000', city: '110100', district: '110108' },
  { id: 'bj005', name: '北京市海淀区万泉小学', pinyin: 'wanquanxiaoxue', initial: 'W', category: ['小学'], province: '110000', city: '110100', district: '110108' },
  { id: 'bj006', name: '北京小学', pinyin: 'beijingxiaoxue', initial: 'B', category: ['小学'], province: '110000', city: '110100' },
  { id: 'bj007', name: '北京市第四中学', pinyin: 'beisizhong', initial: 'B', category: ['高中', '初中'], province: '110000', city: '110100', district: '110102' },
  { id: 'bj008', name: '北京市第八中学', pinyin: 'beibazhong', initial: 'B', category: ['高中', '初中'], province: '110000', city: '110100', district: '110102' },
  { id: 'bj009', name: '中国人民大学附属中学', pinyin: 'rendafuzhong', initial: 'R', category: ['高中', '初中'], province: '110000', city: '110100', district: '110108' },
  { id: 'bj010', name: '清华大学附属中学', pinyin: 'qinghuafuzhong', initial: 'Q', category: ['高中', '初中'], province: '110000', city: '110100', district: '110108' },
  { id: 'bj011', name: '北京大学附属中学', pinyin: 'beidafuzhong', initial: 'B', category: ['高中', '初中'], province: '110000', city: '110100', district: '110108' },
  { id: 'bj012', name: '北京师范大学附属实验中学', pinyin: 'shidafushiyang', initial: 'S', category: ['高中', '初中'], province: '110000', city: '110100', district: '110102' },
  { id: 'bj013', name: '北京市十一学校', pinyin: 'shiyixuexiao', initial: 'S', category: ['高中', '初中'], province: '110000', city: '110100', district: '110108' },
  { id: 'bj014', name: '北京市朝阳区芳草地小学', pinyin: 'fangcaodixiaoxue', initial: 'F', category: ['小学'], province: '110000', city: '110100', district: '110105' },
  { id: 'bj015', name: '北京市西城区实验二小', pinyin: 'shiyangerxiao', initial: 'S', category: ['小学'], province: '110000', city: '110100', district: '110102' },

  // 上海
  { id: 'sh001', name: '上海市世界外国语小学', pinyin: 'shijiewaiyu_xiaoxue', initial: 'S', category: ['小学'], province: '310000', city: '310100', district: '310104' },
  { id: 'sh002', name: '上海市静安区第一中心小学', pinyin: 'jinganyizhongxin', initial: 'J', category: ['小学'], province: '310000', city: '310100', district: '310106' },
  { id: 'sh003', name: '上海市黄浦区卢湾一中心小学', pinyin: 'luwanyizhongxin', initial: 'L', category: ['小学'], province: '310000', city: '310100', district: '310101' },
  { id: 'sh004', name: '上海中学', pinyin: 'shanghaizhongxue', initial: 'S', category: ['高中'], province: '310000', city: '310100', district: '310104' },
  { id: 'sh005', name: '华东师范大学第二附属中学', pinyin: 'huadongershifuzhong', initial: 'H', category: ['高中'], province: '310000', city: '310100', district: '310115' },
  { id: 'sh006', name: '复旦大学附属中学', pinyin: 'fudandaxuefuzhong', initial: 'F', category: ['高中'], province: '310000', city: '310100', district: '310110' },
  { id: 'sh007', name: '上海市延安中学', pinyin: 'yananzhongxue', initial: 'Y', category: ['高中', '初中'], province: '310000', city: '310100', district: '310105' },
  { id: 'sh008', name: '上海交通大学附属中学', pinyin: 'shangjiaodafuzhong', initial: 'S', category: ['高中'], province: '310000', city: '310100', district: '310110' },
  { id: 'sh009', name: '上海市徐汇区爱菊小学', pinyin: 'aijuxiaoxue', initial: 'A', category: ['小学'], province: '310000', city: '310100', district: '310104' },
  { id: 'sh010', name: '上海市浦东新区明珠小学', pinyin: 'mingzhuxiaoxue', initial: 'M', category: ['小学'], province: '310000', city: '310100', district: '310115' },

  // 广州
  { id: 'gz001', name: '华南师范大学附属小学', pinyin: 'huananshifufushuxiaoxue', initial: 'H', category: ['小学'], province: '440000', city: '440100', district: '440106' },
  { id: 'gz002', name: '广州市越秀区东风东路小学', pinyin: 'dongfengdongluxiaoxue', initial: 'D', category: ['小学'], province: '440000', city: '440100', district: '440104' },
  { id: 'gz003', name: '广州市越秀区朝天小学', pinyin: 'chaotianxiaoxue', initial: 'C', category: ['小学'], province: '440000', city: '440100', district: '440104' },
  { id: 'gz004', name: '华南师范大学附属中学', pinyin: 'huananshifufuzhong', initial: 'H', category: ['高中', '初中'], province: '440000', city: '440100', district: '440106' },
  { id: 'gz005', name: '广东省实验中学', pinyin: 'shengshiyangzhongxue', initial: 'S', category: ['高中', '初中'], province: '440000', city: '440100', district: '440104' },
  { id: 'gz006', name: '广州市执信中学', pinyin: 'zhixinzhongxue', initial: 'Z', category: ['高中', '初中'], province: '440000', city: '440100', district: '440104' },
  { id: 'gz007', name: '广州市第二中学', pinyin: 'guangzhoudierzhongxue', initial: 'G', category: ['高中', '初中'], province: '440000', city: '440100', district: '440104' },

  // 深圳
  { id: 'sz001', name: '深圳实验学校小学部', pinyin: 'shiyandaxuexiaoxuebu', initial: 'S', category: ['小学'], province: '440000', city: '440300', district: '440304' },
  { id: 'sz002', name: '深圳市福田区荔园小学', pinyin: 'liyuanxiaoxue', initial: 'L', category: ['小学'], province: '440000', city: '440300', district: '440304' },
  { id: 'sz003', name: '深圳市深圳小学', pinyin: 'shenzhenxiaoxue', initial: 'S', category: ['小学'], province: '440000', city: '440300', district: '440304' },
  { id: 'sz004', name: '深圳中学', pinyin: 'shenzhenzhongxue', initial: 'S', category: ['高中', '初中'], province: '440000', city: '440300', district: '440303' },
  { id: 'sz005', name: '深圳实验学校', pinyin: 'shiyanshixiao', initial: 'S', category: ['高中', '初中'], province: '440000', city: '440300', district: '440304' },
  { id: 'sz006', name: '深圳市外国语学校', pinyin: 'waiyu_xuexiao', initial: 'W', category: ['高中', '初中'], province: '440000', city: '440300', district: '440304' },

  // 成都
  { id: 'cd001', name: '成都市实验小学', pinyin: 'chengdushiyangxiaoxue', initial: 'C', category: ['小学'], province: '510000', city: '510100', district: '510104' },
  { id: 'cd002', name: '成都市泡桐树小学', pinyin: 'paotongshuxiaoxue', initial: 'P', category: ['小学'], province: '510000', city: '510100', district: '510104' },
  { id: 'cd003', name: '成都市盐道街小学', pinyin: 'yandaojiexiaoxue', initial: 'Y', category: ['小学'], province: '510000', city: '510100', district: '510104' },
  { id: 'cd004', name: '成都市第七中学', pinyin: 'chengdudiqizhongxue', initial: 'C', category: ['高中'], province: '510000', city: '510100', district: '510104' },
  { id: 'cd005', name: '成都市树德中学', pinyin: 'shudezhongxue', initial: 'S', category: ['高中', '初中'], province: '510000', city: '510100', district: '510104' },
  { id: 'cd006', name: '成都市石室中学', pinyin: 'shishizhongxue', initial: 'S', category: ['高中', '初中'], province: '510000', city: '510100', district: '510104' },

  // 杭州
  { id: 'hz001', name: '杭州市学军小学', pinyin: 'xuejunxiaoxue', initial: 'X', category: ['小学'], province: '330000', city: '330100', district: '330106' },
  { id: 'hz002', name: '杭州市天长小学', pinyin: 'tianchangxiaoxue', initial: 'T', category: ['小学'], province: '330000', city: '330100', district: '330102' },
  { id: 'hz003', name: '杭州市胜利小学', pinyin: 'shenglixiaoxue', initial: 'S', category: ['小学'], province: '330000', city: '330100', district: '330102' },
  { id: 'hz004', name: '杭州市第二中学', pinyin: 'hangzhoudierzhongxue', initial: 'H', category: ['高中'], province: '330000', city: '330100', district: '330106' },
  { id: 'hz005', name: '杭州学军中学', pinyin: 'xuejunzhongxue', initial: 'X', category: ['高中', '初中'], province: '330000', city: '330100', district: '330106' },
  { id: 'hz006', name: '杭州市外国语学校', pinyin: 'hangzhouwaiyu_xuexiao', initial: 'H', category: ['高中', '初中'], province: '330000', city: '330100' },

  // 南京
  { id: 'nj001', name: '南京市拉萨路小学', pinyin: 'lasaluxiaoxue', initial: 'L', category: ['小学'], province: '320000', city: '320100', district: '320106' },
  { id: 'nj002', name: '南京市力学小学', pinyin: 'lixuexiaoxue', initial: 'L', category: ['小学'], province: '320000', city: '320100', district: '320106' },
  { id: 'nj003', name: '南京市琅琊路小学', pinyin: 'langyaluxiaoxue', initial: 'L', category: ['小学'], province: '320000', city: '320100', district: '320106' },
  { id: 'nj004', name: '南京外国语学校', pinyin: 'nanjingwaiyu_xuexiao', initial: 'N', category: ['高中', '初中'], province: '320000', city: '320100', district: '320104' },
  { id: 'nj005', name: '南京市第一中学', pinyin: 'nanjingdiyizhongxue', initial: 'N', category: ['高中', '初中'], province: '320000', city: '320100', district: '320104' },
  { id: 'nj006', name: '南京师范大学附属中学', pinyin: 'nanjingshidafuzhong', initial: 'N', category: ['高中', '初中'], province: '320000', city: '320100', district: '320106' },

  // 武汉
  { id: 'wh001', name: '武汉市武昌区水果湖第一小学', pinyin: 'shuiguohudiyixiaoxue', initial: 'S', category: ['小学'], province: '420000', city: '420100', district: '420106' },
  { id: 'wh002', name: '武汉市实验小学', pinyin: 'wuhanshiyangxiaoxue', initial: 'W', category: ['小学'], province: '420000', city: '420100', district: '420102' },
  { id: 'wh003', name: '华中师范大学第一附属中学', pinyin: 'huazhongyifuzhong', initial: 'H', category: ['高中'], province: '420000', city: '420100', district: '420106' },
  { id: 'wh004', name: '武汉市第二中学', pinyin: 'wuhandierzhongxue', initial: 'W', category: ['高中', '初中'], province: '420000', city: '420100', district: '420102' },

  // 重庆
  { id: 'cq001', name: '重庆市人民小学', pinyin: 'renminxiaoxue', initial: 'R', category: ['小学'], province: '500000', city: '500100', district: '500103' },
  { id: 'cq002', name: '重庆市巴蜀小学', pinyin: 'bashuxiaoxue', initial: 'B', category: ['小学'], province: '500000', city: '500100', district: '500103' },
  { id: 'cq003', name: '重庆市南开中学', pinyin: 'nankaizhongxue', initial: 'N', category: ['高中', '初中'], province: '500000', city: '500100', district: '500106' },
  { id: 'cq004', name: '重庆市巴蜀中学', pinyin: 'bashuzhongxue', initial: 'B', category: ['高中', '初中'], province: '500000', city: '500100', district: '500103' },
  { id: 'cq005', name: '重庆市第八中学', pinyin: 'chongqingdibazhongxue', initial: 'C', category: ['高中', '初中'], province: '500000', city: '500100', district: '500106' },

  // 西安
  { id: 'xa001', name: '西安交通大学附属小学', pinyin: 'xianjiaodafushuxiaoxue', initial: 'X', category: ['小学'], province: '610000', city: '610100', district: '610104' },
  { id: 'xa002', name: '西安市高新第一小学', pinyin: 'gaoxindiyixiaoxue', initial: 'G', category: ['小学'], province: '610000', city: '610100' },
  { id: 'xa003', name: '西北工业大学附属中学', pinyin: 'xibeigongdafuzhong', initial: 'X', category: ['高中', '初中'], province: '610000', city: '610100', district: '610104' },
  { id: 'xa004', name: '西安高新第一中学', pinyin: 'gaoxindiyizhongxue', initial: 'G', category: ['高中', '初中'], province: '610000', city: '610100' },

  // 长沙
  { id: 'cs001', name: '湖南师范大学附属小学', pinyin: 'hunanshidafushuxiaoxue', initial: 'H', category: ['小学'], province: '430000', city: '430100', district: '430104' },
  { id: 'cs002', name: '长沙市芙蓉区育英小学', pinyin: 'yuyingxiaoxue', initial: 'Y', category: ['小学'], province: '430000', city: '430100', district: '430102' },
  { id: 'cs003', name: '湖南师范大学附属中学', pinyin: 'hunanshidafuzhong', initial: 'H', category: ['高中', '初中'], province: '430000', city: '430100', district: '430104' },
  { id: 'cs004', name: '长沙市长郡中学', pinyin: 'changjunzhongxue', initial: 'C', category: ['高中', '初中'], province: '430000', city: '430100', district: '430103' },
  { id: 'cs005', name: '长沙市雅礼中学', pinyin: 'yalizhongxue', initial: 'Y', category: ['高中', '初中'], province: '430000', city: '430100', district: '430104' },

  // 合肥
  { id: 'hf001', name: '合肥市屯溪路小学', pinyin: 'tunxiluxiaoxue', initial: 'T', category: ['小学'], province: '340000', city: '340100', district: '340102' },
  { id: 'hf002', name: '合肥市第四十六中学', pinyin: 'hefeidisishiliuzhongxue', initial: 'H', category: ['初中'], province: '340000', city: '340100', district: '340102' },
  { id: 'hf003', name: '合肥市第一中学', pinyin: 'hefeidiyizhongxue', initial: 'H', category: ['高中'], province: '340000', city: '340100', district: '340102' },

  // 其他城市代表校
  { id: 'tz001', name: '天津市实验小学', pinyin: 'tianjinshiyangxiaoxue', initial: 'T', category: ['小学'], province: '120000', city: '120100' },
  { id: 'tz002', name: '天津市南开中学', pinyin: 'tianjinnankaizhongxue', initial: 'T', category: ['高中', '初中'], province: '120000', city: '120100' },
  { id: 'sy001', name: '沈阳市实验小学', pinyin: 'shenyangshiyangxiaoxue', initial: 'S', category: ['小学'], province: '210000', city: '210100' },
  { id: 'sy002', name: '东北育才学校', pinyin: 'dongbeiyucaixuexiao', initial: 'D', category: ['高中', '初中'], province: '210000', city: '210100' },
  { id: 'dl001', name: '大连市实验小学', pinyin: 'dalianshiyangxiaoxue', initial: 'D', category: ['小学'], province: '210000', city: '210200' },
  { id: 'jn001', name: '济南市胜利大街小学', pinyin: 'shenglidajiexiaoxue', initial: 'S', category: ['小学'], province: '370000', city: '370100' },
  { id: 'jn002', name: '山东省实验中学', pinyin: 'shandongshengshiyangzhongxue', initial: 'S', category: ['高中', '初中'], province: '370000', city: '370100' },
  { id: 'qd001', name: '青岛市实验小学', pinyin: 'qingdaoshiyangxiaoxue', initial: 'Q', category: ['小学'], province: '370000', city: '370200' },
  { id: 'qd002', name: '青岛市第二中学', pinyin: 'qingdaodierzhongxue', initial: 'Q', category: ['高中'], province: '370000', city: '370200' },
  { id: 'km001', name: '昆明市春城小学', pinyin: 'chunchengxiaoxue', initial: 'C', category: ['小学'], province: '530000', city: '530100' },
  { id: 'nc001', name: '南昌市师范附属实验小学', pinyin: 'shifanfushushiyangxiaoxue', initial: 'S', category: ['小学'], province: '360000', city: '360100' },
  { id: 'fz001', name: '福州市实验小学', pinyin: 'fuzhoushiyangxiaoxue', initial: 'F', category: ['小学'], province: '350000', city: '350100' },
  { id: 'xm001', name: '厦门市实验小学', pinyin: 'shimenshiyangxiaoxue', initial: 'S', category: ['小学'], province: '350000', city: '350200' },
  { id: 'zz001', name: '郑州市中原区伊河路小学', pinyin: 'yiheluxiaoxue', initial: 'Y', category: ['小学'], province: '410000', city: '410100' },
  { id: 'zz002', name: '河南省实验中学', pinyin: 'henanshengshiyangzhongxue', initial: 'H', category: ['高中', '初中'], province: '410000', city: '410100' },
]

// ========== 搜索函数 ==========

/** 根据关键词搜索学校（支持中文名、拼音、首字母） */
export function searchSchools(query: string, limit = 20): SchoolSearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results: SchoolSearchResult[] = []

  for (const school of SCHOOLS) {
    // 精确名称匹配
    if (school.name.toLowerCase().includes(q)) {
      results.push({ school, matchType: 'name', highlight: school.name })
      continue
    }

    // 拼音匹配
    if (school.pinyin.includes(q)) {
      results.push({ school, matchType: 'pinyin', highlight: school.name })
      continue
    }

    // 首字母匹配（仅当输入为纯字母且长度 <= 6）
    if (/^[a-zA-Z]{1,6}$/.test(q) && school.initial === q[0].toUpperCase()) {
      const initials = school.pinyin
        .split(/(?=[aeiou])/) // 简化拆分
        .filter(Boolean)
        .map(s => s[0])
        .join('')
      if (initials.startsWith(q)) {
        results.push({ school, matchType: 'initial', highlight: school.name })
        continue
      }
    }
  }

  // 排序：名称匹配 > 拼音匹配 > 首字母匹配
  const priority = { name: 0, pinyin: 1, initial: 2 } as const
  results.sort((a, b) => priority[a.matchType] - priority[b.matchType])

  return results.slice(0, limit)
}

/** 根据地区过滤学校 */
export function filterSchoolsByRegion(province?: string, city?: string): SchoolItem[] {
  return SCHOOLS.filter(s => {
    if (province && s.province !== province) return false
    if (city && s.city !== city) return false
    return true
  })
}

/** 根据分类过滤学校 */
export function filterSchoolsByCategory(category?: SchoolCategory): SchoolItem[] {
  if (!category) return SCHOOLS
  return SCHOOLS.filter(s => s.category.includes(category))
}

/** 获取学校分类标签列表 */
export function getSchoolCategories(): { value: SchoolCategory; label: string }[] {
  return [
    { value: '小学', label: '小学' },
    { value: '初中', label: '初中' },
    { value: '高中', label: '高中' },
    { value: '九年一贯制', label: '九年一贯制' },
    { value: '完全中学', label: '完全中学' },
  ]
}
