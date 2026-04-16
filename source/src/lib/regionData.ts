// ===================================================================
// 中国行政区划数据 — 省市区三级联动
// 数据来源：国家统计局行政区划代码
// ===================================================================

export interface RegionItem {
  code: string       // 6位行政区划代码
  name: string       // 显示名称
  pinyin: string     // 全拼（用于搜索）
  initial: string    // 拼音首字母（用于快速导航）
}

export interface RegionValue {
  province?: string
  city?: string
  district?: string
}

// ============================================================
// 省级行政区（34个）
// ============================================================

export const PROVINCES: RegionItem[] = [
  { code: '110000', name: '北京市', pinyin: 'beijing', initial: 'B' },
  { code: '120000', name: '天津市', pinyin: 'tianjin', initial: 'T' },
  { code: '130000', name: '河北省', pinyin: 'hebei', initial: 'H' },
  { code: '140000', name: '山西省', pinyin: 'shanxi', initial: 'S' },
  { code: '150000', name: '内蒙古自治区', pinyin: 'neimenggu', initial: 'N' },
  { code: '210000', name: '辽宁省', pinyin: 'liaoning', initial: 'L' },
  { code: '220000', name: '吉林省', pinyin: 'jilin', initial: 'J' },
  { code: '230000', name: '黑龙江省', pinyin: 'heilongjiang', initial: 'H' },
  { code: '310000', name: '上海市', pinyin: 'shanghai', initial: 'S' },
  { code: '320000', name: '江苏省', pinyin: 'jiangsu', initial: 'J' },
  { code: '330000', name: '浙江省', pinyin: 'zhejiang', initial: 'Z' },
  { code: '340000', name: '安徽省', pinyin: 'anhui', initial: 'A' },
  { code: '350000', name: '福建省', pinyin: 'fujian', initial: 'F' },
  { code: '360000', name: '江西省', pinyin: 'jiangxi', initial: 'J' },
  { code: '370000', name: '山东省', pinyin: 'shandong', initial: 'S' },
  { code: '410000', name: '河南省', pinyin: 'henan', initial: 'H' },
  { code: '420000', name: '湖北省', pinyin: 'hubei', initial: 'H' },
  { code: '430000', name: '湖南省', pinyin: 'hunan', initial: 'H' },
  { code: '440000', name: '广东省', pinyin: 'guangdong', initial: 'G' },
  { code: '450000', name: '广西壮族自治区', pinyin: 'guangxi', initial: 'G' },
  { code: '460000', name: '海南省', pinyin: 'hainan', initial: 'H' },
  { code: '500000', name: '重庆市', pinyin: 'chongqing', initial: 'C' },
  { code: '510000', name: '四川省', pinyin: 'sichuan', initial: 'S' },
  { code: '520000', name: '贵州省', pinyin: 'guizhou', initial: 'G' },
  { code: '530000', name: '云南省', pinyin: 'yunnan', initial: 'Y' },
  { code: '540000', name: '西藏自治区', pinyin: 'xizang', initial: 'X' },
  { code: '610000', name: '陕西省', pinyin: 'shaanxi', initial: 'S' },
  { code: '620000', name: '甘肃省', pinyin: 'gansu', initial: 'G' },
  { code: '630000', name: '青海省', pinyin: 'qinghai', initial: 'Q' },
  { code: '640000', name: '宁夏回族自治区', pinyin: 'ningxia', initial: 'N' },
  { code: '650000', name: '新疆维吾尔自治区', pinyin: 'xinjiang', initial: 'X' },
  { code: '710000', name: '台湾省', pinyin: 'taiwan', initial: 'T' },
  { code: '810000', name: '香港特别行政区', pinyin: 'xianggang', initial: 'X' },
  { code: '820000', name: '澳门特别行政区', pinyin: 'aomen', initial: 'A' },
]

// ============================================================
// 市级行政区（主要城市，按省份分组）
// ============================================================

export const CITIES_BY_PROVINCE: Record<string, RegionItem[]> = {
  '110000': [
    { code: '110100', name: '北京市', pinyin: 'beijing', initial: 'B' },
  ],
  '120000': [
    { code: '120100', name: '天津市', pinyin: 'tianjin', initial: 'T' },
  ],
  '130000': [
    { code: '130100', name: '石家庄市', pinyin: 'shijiazhuang', initial: 'S' },
    { code: '130200', name: '唐山市', pinyin: 'tangshan', initial: 'T' },
    { code: '130300', name: '秦皇岛市', pinyin: 'qinhuangdao', initial: 'Q' },
    { code: '130400', name: '邯郸市', pinyin: 'handan', initial: 'H' },
    { code: '130500', name: '邢台市', pinyin: 'xingtai', initial: 'X' },
    { code: '130600', name: '保定市', pinyin: 'baoding', initial: 'B' },
    { code: '130700', name: '张家口市', pinyin: 'zhangjiakou', initial: 'Z' },
    { code: '130800', name: '承德市', pinyin: 'chengde', initial: 'C' },
    { code: '130900', name: '沧州市', pinyin: 'cangzhou', initial: 'C' },
    { code: '131000', name: '廊坊市', pinyin: 'langfang', initial: 'L' },
    { code: '131100', name: '衡水市', pinyin: 'hengshui', initial: 'H' },
  ],
  '140000': [
    { code: '140100', name: '太原市', pinyin: 'taiyuan', initial: 'T' },
    { code: '140200', name: '大同市', pinyin: 'datong', initial: 'D' },
    { code: '140300', name: '阳泉市', pinyin: 'yangquan', initial: 'Y' },
    { code: '140400', name: '长治市', pinyin: 'changzhi', initial: 'C' },
    { code: '140500', name: '晋城市', pinyin: 'jincheng', initial: 'J' },
    { code: '140600', name: '朔州市', pinyin: 'shuozhou', initial: 'S' },
    { code: '140700', name: '晋中市', pinyin: 'jinzhong', initial: 'J' },
    { code: '140800', name: '运城市', pinyin: 'yuncheng', initial: 'Y' },
    { code: '140900', name: '忻州市', pinyin: 'xinzhou', initial: 'X' },
    { code: '141000', name: '临汾市', pinyin: 'linfen', initial: 'L' },
    { code: '141100', name: '吕梁市', pinyin: 'lvliang', initial: 'L' },
  ],
  '150000': [
    { code: '150100', name: '呼和浩特市', pinyin: 'huhehaote', initial: 'H' },
    { code: '150200', name: '包头市', pinyin: 'baotou', initial: 'B' },
    { code: '150300', name: '乌海市', pinyin: 'wuhai', initial: 'W' },
    { code: '150400', name: '赤峰市', pinyin: 'chifeng', initial: 'C' },
    { code: '150500', name: '通辽市', pinyin: 'tongliao', initial: 'T' },
    { code: '150600', name: '鄂尔多斯市', pinyin: 'eerduosi', initial: 'E' },
    { code: '150700', name: '呼伦贝尔市', pinyin: 'hulunbeier', initial: 'H' },
    { code: '150800', name: '巴彦淖尔市', pinyin: 'bayannaoer', initial: 'B' },
    { code: '150900', name: '乌兰察布市', pinyin: 'wulanchabu', initial: 'W' },
  ],
  '210000': [
    { code: '210100', name: '沈阳市', pinyin: 'shenyang', initial: 'S' },
    { code: '210200', name: '大连市', pinyin: 'dalian', initial: 'D' },
    { code: '210300', name: '鞍山市', pinyin: 'anshan', initial: 'A' },
    { code: '210400', name: '抚顺市', pinyin: 'fushun', initial: 'F' },
    { code: '210500', name: '本溪市', pinyin: 'benxi', initial: 'B' },
    { code: '210600', name: '丹东市', pinyin: 'dandong', initial: 'D' },
    { code: '210700', name: '锦州市', pinyin: 'jinzhou', initial: 'J' },
    { code: '210800', name: '营口市', pinyin: 'yingkou', initial: 'Y' },
    { code: '210900', name: '阜新市', pinyin: 'fuxin', initial: 'F' },
    { code: '211000', name: '辽阳市', pinyin: 'liaoyang', initial: 'L' },
    { code: '211100', name: '盘锦市', pinyin: 'panjin', initial: 'P' },
    { code: '211200', name: '铁岭市', pinyin: 'tieling', initial: 'T' },
    { code: '211300', name: '朝阳市', pinyin: 'chaoyang', initial: 'C' },
    { code: '211400', name: '葫芦岛市', pinyin: 'huludao', initial: 'H' },
  ],
  '220000': [
    { code: '220100', name: '长春市', pinyin: 'changchun', initial: 'C' },
    { code: '220200', name: '吉林市', pinyin: 'jilin', initial: 'J' },
    { code: '220300', name: '四平市', pinyin: 'siping', initial: 'S' },
    { code: '220400', name: '辽源市', pinyin: 'liaoyuan', initial: 'L' },
    { code: '220500', name: '通化市', pinyin: 'tonghua', initial: 'T' },
    { code: '220600', name: '白山市', pinyin: 'baishan', initial: 'B' },
    { code: '220700', name: '松原市', pinyin: 'songyuan', initial: 'S' },
    { code: '220800', name: '白城市', pinyin: 'baicheng', initial: 'B' },
    { code: '222400', name: '延边朝鲜族自治州', pinyin: 'yanbian', initial: 'Y' },
  ],
  '230000': [
    { code: '230100', name: '哈尔滨市', pinyin: 'haerbin', initial: 'H' },
    { code: '230200', name: '齐齐哈尔市', pinyin: 'qiqihaer', initial: 'Q' },
    { code: '230300', name: '鸡西市', pinyin: 'jixi', initial: 'J' },
    { code: '230400', name: '鹤岗市', pinyin: 'hegang', initial: 'H' },
    { code: '230500', name: '双鸭山市', pinyin: 'shuangyashan', initial: 'S' },
    { code: '230600', name: '大庆市', pinyin: 'daqing', initial: 'D' },
    { code: '230700', name: '伊春市', pinyin: 'yichun', initial: 'Y' },
    { code: '230800', name: '佳木斯市', pinyin: 'jiamusi', initial: 'J' },
    { code: '230900', name: '七台河市', pinyin: 'qitaihe', initial: 'Q' },
    { code: '231000', name: '牡丹江市', pinyin: 'mudanjiang', initial: 'M' },
    { code: '231100', name: '黑河市', pinyin: 'heihe', initial: 'H' },
    { code: '231200', name: '绥化市', pinyin: 'suihua', initial: 'S' },
  ],
  '310000': [
    { code: '310100', name: '上海市', pinyin: 'shanghai', initial: 'S' },
  ],
  '320000': [
    { code: '320100', name: '南京市', pinyin: 'nanjing', initial: 'N' },
    { code: '320200', name: '无锡市', pinyin: 'wuxi', initial: 'W' },
    { code: '320300', name: '徐州市', pinyin: 'xuzhou', initial: 'X' },
    { code: '320400', name: '常州市', pinyin: 'changzhou', initial: 'C' },
    { code: '320500', name: '苏州市', pinyin: 'suzhou', initial: 'S' },
    { code: '320600', name: '南通市', pinyin: 'nantong', initial: 'N' },
    { code: '320700', name: '连云港市', pinyin: 'lianyungang', initial: 'L' },
    { code: '320800', name: '淮安市', pinyin: 'huaian', initial: 'H' },
    { code: '320900', name: '盐城市', pinyin: 'yancheng', initial: 'Y' },
    { code: '321000', name: '扬州市', pinyin: 'yangzhou', initial: 'Y' },
    { code: '321100', name: '镇江市', pinyin: 'zhenjiang', initial: 'Z' },
    { code: '321200', name: '泰州市', pinyin: 'taizhou', initial: 'T' },
    { code: '321300', name: '宿迁市', pinyin: 'suqian', initial: 'S' },
  ],
  '330000': [
    { code: '330100', name: '杭州市', pinyin: 'hangzhou', initial: 'H' },
    { code: '330200', name: '宁波市', pinyin: 'ningbo', initial: 'N' },
    { code: '330300', name: '温州市', pinyin: 'wenzhou', initial: 'W' },
    { code: '330400', name: '嘉兴市', pinyin: 'jiaxing', initial: 'J' },
    { code: '330500', name: '湖州市', pinyin: 'huzhou', initial: 'H' },
    { code: '330600', name: '绍兴市', pinyin: 'shaoxing', initial: 'S' },
    { code: '330700', name: '金华市', pinyin: 'jinhua', initial: 'J' },
    { code: '330800', name: '衢州市', pinyin: 'quzhou', initial: 'Q' },
    { code: '330900', name: '舟山市', pinyin: 'zhoushan', initial: 'Z' },
    { code: '331000', name: '台州市', pinyin: 'taizhou', initial: 'T' },
    { code: '331100', name: '丽水市', pinyin: 'lishui', initial: 'L' },
  ],
  '340000': [
    { code: '340100', name: '合肥市', pinyin: 'hefei', initial: 'H' },
    { code: '340200', name: '芜湖市', pinyin: 'wuhu', initial: 'W' },
    { code: '340300', name: '蚌埠市', pinyin: 'bengbu', initial: 'B' },
    { code: '340400', name: '淮南市', pinyin: 'huainan', initial: 'H' },
    { code: '340500', name: '马鞍山市', pinyin: 'maanshan', initial: 'M' },
    { code: '340600', name: '淮北市', pinyin: 'huaibei', initial: 'H' },
    { code: '340700', name: '铜陵市', pinyin: 'tongling', initial: 'T' },
    { code: '340800', name: '安庆市', pinyin: 'anqing', initial: 'A' },
    { code: '341000', name: '黄山市', pinyin: 'huangshan', initial: 'H' },
    { code: '341100', name: '滁州市', pinyin: 'chuzhou', initial: 'C' },
    { code: '341200', name: '阜阳市', pinyin: 'fuyang', initial: 'F' },
    { code: '341300', name: '宿州市', pinyin: 'suzhou', initial: 'S' },
    { code: '341500', name: '六安市', pinyin: 'liuan', initial: 'L' },
    { code: '341600', name: '亳州市', pinyin: 'bozhou', initial: 'B' },
    { code: '341700', name: '池州市', pinyin: 'chizhou', initial: 'C' },
    { code: '341800', name: '宣城市', pinyin: 'xuancheng', initial: 'X' },
  ],
  '350000': [
    { code: '350100', name: '福州市', pinyin: 'fuzhou', initial: 'F' },
    { code: '350200', name: '厦门市', pinyin: 'xiamen', initial: 'X' },
    { code: '350300', name: '莆田市', pinyin: 'putian', initial: 'P' },
    { code: '350400', name: '三明市', pinyin: 'sanming', initial: 'S' },
    { code: '350500', name: '泉州市', pinyin: 'quanzhou', initial: 'Q' },
    { code: '350600', name: '漳州市', pinyin: 'zhangzhou', initial: 'Z' },
    { code: '350700', name: '南平市', pinyin: 'nanping', initial: 'N' },
    { code: '350800', name: '龙岩市', pinyin: 'longyan', initial: 'L' },
    { code: '350900', name: '宁德市', pinyin: 'ningde', initial: 'N' },
  ],
  '360000': [
    { code: '360100', name: '南昌市', pinyin: 'nanchang', initial: 'N' },
    { code: '360200', name: '景德镇市', pinyin: 'jingdezhen', initial: 'J' },
    { code: '360300', name: '萍乡市', pinyin: 'pingxiang', initial: 'P' },
    { code: '360400', name: '九江市', pinyin: 'jiujiang', initial: 'J' },
    { code: '360500', name: '新余市', pinyin: 'xinyu', initial: 'X' },
    { code: '360600', name: '鹰潭市', pinyin: 'yingtan', initial: 'Y' },
    { code: '360700', name: '赣州市', pinyin: 'ganzhou', initial: 'G' },
    { code: '360800', name: '吉安市', pinyin: 'jian', initial: 'J' },
    { code: '360900', name: '宜春市', pinyin: 'yichun', initial: 'Y' },
    { code: '361000', name: '抚州市', pinyin: 'fuzhou', initial: 'F' },
    { code: '361100', name: '上饶市', pinyin: 'shangrao', initial: 'S' },
  ],
  '370000': [
    { code: '370100', name: '济南市', pinyin: 'jinan', initial: 'J' },
    { code: '370200', name: '青岛市', pinyin: 'qingdao', initial: 'Q' },
    { code: '370300', name: '淄博市', pinyin: 'zibo', initial: 'Z' },
    { code: '370400', name: '枣庄市', pinyin: 'zaozhuang', initial: 'Z' },
    { code: '370500', name: '东营市', pinyin: 'dongying', initial: 'D' },
    { code: '370600', name: '烟台市', pinyin: 'yantai', initial: 'Y' },
    { code: '370700', name: '潍坊市', pinyin: 'weifang', initial: 'W' },
    { code: '370800', name: '济宁市', pinyin: 'jining', initial: 'J' },
    { code: '370900', name: '泰安市', pinyin: 'taian', initial: 'T' },
    { code: '371000', name: '威海市', pinyin: 'weihai', initial: 'W' },
    { code: '371100', name: '日照市', pinyin: 'rizhao', initial: 'R' },
    { code: '371300', name: '临沂市', pinyin: 'linyi', initial: 'L' },
    { code: '371400', name: '德州市', pinyin: 'dezhou', initial: 'D' },
    { code: '371500', name: '聊城市', pinyin: 'liaocheng', initial: 'L' },
    { code: '371600', name: '滨州市', pinyin: 'binzhou', initial: 'B' },
    { code: '371700', name: '菏泽市', pinyin: 'heze', initial: 'H' },
  ],
  '410000': [
    { code: '410100', name: '郑州市', pinyin: 'zhengzhou', initial: 'Z' },
    { code: '410200', name: '开封市', pinyin: 'kaifeng', initial: 'K' },
    { code: '410300', name: '洛阳市', pinyin: 'luoyang', initial: 'L' },
    { code: '410400', name: '平顶山市', pinyin: 'pingdingshan', initial: 'P' },
    { code: '410500', name: '安阳市', pinyin: 'anyang', initial: 'A' },
    { code: '410600', name: '鹤壁市', pinyin: 'hebi', initial: 'H' },
    { code: '410700', name: '新乡市', pinyin: 'xinxiang', initial: 'X' },
    { code: '410800', name: '焦作市', pinyin: 'jiaozuo', initial: 'J' },
    { code: '410900', name: '濮阳市', pinyin: 'puyang', initial: 'P' },
    { code: '411000', name: '许昌市', pinyin: 'xuchang', initial: 'X' },
    { code: '411100', name: '漯河市', pinyin: 'luohe', initial: 'L' },
    { code: '411200', name: '三门峡市', pinyin: 'sanmenxia', initial: 'S' },
    { code: '411300', name: '南阳市', pinyin: 'nanyang', initial: 'N' },
    { code: '411400', name: '商丘市', pinyin: 'shangqiu', initial: 'S' },
    { code: '411500', name: '信阳市', pinyin: 'xinyang', initial: 'X' },
    { code: '411600', name: '周口市', pinyin: 'zhoukou', initial: 'Z' },
    { code: '411700', name: '驻马店市', pinyin: 'zhumadian', initial: 'Z' },
  ],
  '420000': [
    { code: '420100', name: '武汉市', pinyin: 'wuhan', initial: 'W' },
    { code: '420200', name: '黄石市', pinyin: 'huangshi', initial: 'H' },
    { code: '420300', name: '十堰市', pinyin: 'shiyan', initial: 'S' },
    { code: '420500', name: '宜昌市', pinyin: 'yichang', initial: 'Y' },
    { code: '420600', name: '襄阳市', pinyin: 'xiangyang', initial: 'X' },
    { code: '420700', name: '鄂州市', pinyin: 'ezhou', initial: 'E' },
    { code: '420800', name: '荆门市', pinyin: 'jingmen', initial: 'J' },
    { code: '420900', name: '孝感市', pinyin: 'xiaogan', initial: 'X' },
    { code: '421000', name: '荆州市', pinyin: 'jingzhou', initial: 'J' },
    { code: '421100', name: '黄冈市', pinyin: 'huanggang', initial: 'H' },
    { code: '421200', name: '咸宁市', pinyin: 'xianning', initial: 'X' },
    { code: '421300', name: '随州市', pinyin: 'suizhou', initial: 'S' },
  ],
  '430000': [
    { code: '430100', name: '长沙市', pinyin: 'changsha', initial: 'C' },
    { code: '430200', name: '株洲市', pinyin: 'zhuzhou', initial: 'Z' },
    { code: '430300', name: '湘潭市', pinyin: 'xiangtan', initial: 'X' },
    { code: '430400', name: '衡阳市', pinyin: 'hengyang', initial: 'H' },
    { code: '430500', name: '邵阳市', pinyin: 'shaoyang', initial: 'S' },
    { code: '430600', name: '岳阳市', pinyin: 'yueyang', initial: 'Y' },
    { code: '430700', name: '常德市', pinyin: 'changde', initial: 'C' },
    { code: '430800', name: '张家界市', pinyin: 'zhangjiajie', initial: 'Z' },
    { code: '430900', name: '益阳市', pinyin: 'yiyang', initial: 'Y' },
    { code: '431000', name: '郴州市', pinyin: 'chenzhou', initial: 'C' },
    { code: '431100', name: '永州市', pinyin: 'yongzhou', initial: 'Y' },
    { code: '431200', name: '怀化市', pinyin: 'huaihua', initial: 'H' },
    { code: '431300', name: '娄底市', pinyin: 'loudi', initial: 'L' },
  ],
  '440000': [
    { code: '440100', name: '广州市', pinyin: 'guangzhou', initial: 'G' },
    { code: '440200', name: '韶关市', pinyin: 'shaoguan', initial: 'S' },
    { code: '440300', name: '深圳市', pinyin: 'shenzhen', initial: 'S' },
    { code: '440400', name: '珠海市', pinyin: 'zhuhai', initial: 'Z' },
    { code: '440500', name: '汕头市', pinyin: 'shantou', initial: 'S' },
    { code: '440600', name: '佛山市', pinyin: 'foshan', initial: 'F' },
    { code: '440700', name: '江门市', pinyin: 'jiangmen', initial: 'J' },
    { code: '440800', name: '湛江市', pinyin: 'zhanjiang', initial: 'Z' },
    { code: '440900', name: '茂名市', pinyin: 'maoming', initial: 'M' },
    { code: '441200', name: '肇庆市', pinyin: 'zhaoqing', initial: 'Z' },
    { code: '441300', name: '惠州市', pinyin: 'huizhou', initial: 'H' },
    { code: '441400', name: '梅州市', pinyin: 'meizhou', initial: 'M' },
    { code: '441500', name: '汕尾市', pinyin: 'shanwei', initial: 'S' },
    { code: '441600', name: '河源市', pinyin: 'heyuan', initial: 'H' },
    { code: '441700', name: '阳江市', pinyin: 'yangjiang', initial: 'Y' },
    { code: '441800', name: '清远市', pinyin: 'qingyuan', initial: 'Q' },
    { code: '441900', name: '东莞市', pinyin: 'dongguan', initial: 'D' },
    { code: '442000', name: '中山市', pinyin: 'zhongshan', initial: 'Z' },
  ],
  '450000': [
    { code: '450100', name: '南宁市', pinyin: 'nanning', initial: 'N' },
    { code: '450200', name: '柳州市', pinyin: 'liuzhou', initial: 'L' },
    { code: '450300', name: '桂林市', pinyin: 'guilin', initial: 'G' },
    { code: '450400', name: '梧州市', pinyin: 'wuzhou', initial: 'W' },
    { code: '450500', name: '北海市', pinyin: 'beihai', initial: 'B' },
    { code: '450600', name: '防城港市', pinyin: 'fangchenggang', initial: 'F' },
    { code: '450700', name: '钦州市', pinyin: 'qinzhou', initial: 'Q' },
    { code: '450800', name: '贵港市', pinyin: 'guigang', initial: 'G' },
    { code: '450900', name: '玉林市', pinyin: 'yulin', initial: 'Y' },
  ],
  '460000': [
    { code: '460100', name: '海口市', pinyin: 'haikou', initial: 'H' },
    { code: '460200', name: '三亚市', pinyin: 'sanya', initial: 'S' },
    { code: '460300', name: '三沙市', pinyin: 'sansha', initial: 'S' },
    { code: '460400', name: '儋州市', pinyin: 'danzhou', initial: 'D' },
  ],
  '500000': [
    { code: '500100', name: '重庆市', pinyin: 'chongqing', initial: 'C' },
  ],
  '510000': [
    { code: '510100', name: '成都市', pinyin: 'chengdu', initial: 'C' },
    { code: '510300', name: '自贡市', pinyin: 'zigong', initial: 'Z' },
    { code: '510400', name: '攀枝花市', pinyin: 'panzhihua', initial: 'P' },
    { code: '510500', name: '泸州市', pinyin: 'luzhou', initial: 'L' },
    { code: '510600', name: '德阳市', pinyin: 'deyang', initial: 'D' },
    { code: '510700', name: '绵阳市', pinyin: 'mianyang', initial: 'M' },
    { code: '510800', name: '广元市', pinyin: 'guangyuan', initial: 'G' },
    { code: '510900', name: '遂宁市', pinyin: 'suining', initial: 'S' },
    { code: '511000', name: '内江市', pinyin: 'neijiang', initial: 'N' },
    { code: '511100', name: '乐山市', pinyin: 'leshan', initial: 'L' },
    { code: '511300', name: '南充市', pinyin: 'nanchong', initial: 'N' },
    { code: '511400', name: '眉山市', pinyin: 'meishan', initial: 'M' },
    { code: '511500', name: '宜宾市', pinyin: 'yibin', initial: 'Y' },
  ],
  '520000': [
    { code: '520100', name: '贵阳市', pinyin: 'guiyang', initial: 'G' },
    { code: '520200', name: '六盘水市', pinyin: 'liupanshui', initial: 'L' },
    { code: '520300', name: '遵义市', pinyin: 'zunyi', initial: 'Z' },
    { code: '520400', name: '安顺市', pinyin: 'anshun', initial: 'A' },
    { code: '520500', name: '毕节市', pinyin: 'bijie', initial: 'B' },
    { code: '520600', name: '铜仁市', pinyin: 'tongren', initial: 'T' },
  ],
  '530000': [
    { code: '530100', name: '昆明市', pinyin: 'kunming', initial: 'K' },
    { code: '530300', name: '曲靖市', pinyin: 'qujing', initial: 'Q' },
    { code: '530400', name: '玉溪市', pinyin: 'yuxi', initial: 'Y' },
    { code: '530500', name: '保山市', pinyin: 'baoshan', initial: 'B' },
    { code: '530600', name: '昭通市', pinyin: 'zhaotong', initial: 'Z' },
    { code: '530700', name: '丽江市', pinyin: 'lijiang', initial: 'L' },
    { code: '530800', name: '普洱市', pinyin: 'puer', initial: 'P' },
    { code: '530900', name: '临沧市', pinyin: 'lincang', initial: 'L' },
    { code: '532500', name: '红河哈尼族彝族自治州', pinyin: 'honghe', initial: 'H' },
    { code: '532300', name: '楚雄彝族自治州', pinyin: 'chuxiong', initial: 'C' },
    { code: '532800', name: '西双版纳傣族自治州', pinyin: 'xishuangbanna', initial: 'X' },
    { code: '532900', name: '大理白族自治州', pinyin: 'dali', initial: 'D' },
  ],
  '540000': [
    { code: '540100', name: '拉萨市', pinyin: 'lasa', initial: 'L' },
    { code: '540200', name: '日喀则市', pinyin: 'rikaze', initial: 'R' },
    { code: '540300', name: '昌都市', pinyin: 'changdu', initial: 'C' },
    { code: '540400', name: '林芝市', pinyin: 'linzhi', initial: 'L' },
  ],
  '610000': [
    { code: '610100', name: '西安市', pinyin: 'xian', initial: 'X' },
    { code: '610200', name: '铜川市', pinyin: 'tongchuan', initial: 'T' },
    { code: '610300', name: '宝鸡市', pinyin: 'baoji', initial: 'B' },
    { code: '610400', name: '咸阳市', pinyin: 'xianyang', initial: 'X' },
    { code: '610500', name: '渭南市', pinyin: 'weinan', initial: 'W' },
    { code: '610600', name: '延安市', pinyin: 'yanan', initial: 'Y' },
    { code: '610700', name: '汉中市', pinyin: 'hanzhong', initial: 'H' },
    { code: '610800', name: '榆林市', pinyin: 'yulin', initial: 'Y' },
    { code: '610900', name: '安康市', pinyin: 'ankang', initial: 'A' },
    { code: '611000', name: '商洛市', pinyin: 'shangluo', initial: 'S' },
  ],
  '620000': [
    { code: '620100', name: '兰州市', pinyin: 'lanzhou', initial: 'L' },
    { code: '620200', name: '嘉峪关市', pinyin: 'jiayuguan', initial: 'J' },
    { code: '620300', name: '金昌市', pinyin: 'jinchang', initial: 'J' },
    { code: '620400', name: '白银市', pinyin: 'baiyin', initial: 'B' },
    { code: '620500', name: '天水市', pinyin: 'tianshui', initial: 'T' },
    { code: '620600', name: '武威市', pinyin: 'wuwei', initial: 'W' },
    { code: '620700', name: '张掖市', pinyin: 'zhangye', initial: 'Z' },
    { code: '620800', name: '平凉市', pinyin: 'pingliang', initial: 'P' },
    { code: '620900', name: '酒泉市', pinyin: 'jiuquan', initial: 'J' },
    { code: '621000', name: '庆阳市', pinyin: 'qingyang', initial: 'Q' },
    { code: '621100', name: '定西市', pinyin: 'dingxi', initial: 'D' },
    { code: '621200', name: '陇南市', pinyin: 'longnan', initial: 'L' },
  ],
  '630000': [
    { code: '630100', name: '西宁市', pinyin: 'xining', initial: 'X' },
    { code: '630200', name: '海东市', pinyin: 'haidong', initial: 'H' },
  ],
  '640000': [
    { code: '640100', name: '银川市', pinyin: 'yinchuan', initial: 'Y' },
    { code: '640200', name: '石嘴山市', pinyin: 'shizuishan', initial: 'S' },
    { code: '640300', name: '吴忠市', pinyin: 'wuzhong', initial: 'W' },
    { code: '640400', name: '固原市', pinyin: 'guyuan', initial: 'G' },
    { code: '640500', name: '中卫市', pinyin: 'zhongwei', initial: 'Z' },
  ],
  '650000': [
    { code: '650100', name: '乌鲁木齐市', pinyin: 'wulumuqi', initial: 'W' },
    { code: '650200', name: '克拉玛依市', pinyin: 'kelamayi', initial: 'K' },
    { code: '650400', name: '吐鲁番市', pinyin: 'tulufan', initial: 'T' },
    { code: '650500', name: '哈密市', pinyin: 'hami', initial: 'H' },
    { code: '652300', name: '昌吉回族自治州', pinyin: 'changji', initial: 'C' },
    { code: '652800', name: '巴音郭楞蒙古自治州', pinyin: 'bayinguoleng', initial: 'B' },
    { code: '653000', name: '克孜勒苏柯尔克孜自治州', pinyin: 'kezilesu', initial: 'K' },
    { code: '653100', name: '喀什地区', pinyin: 'kashgar', initial: 'K' },
    { code: '653200', name: '和田地区', pinyin: 'hetian', initial: 'H' },
    { code: '654000', name: '伊犁哈萨克自治州', pinyin: 'yili', initial: 'Y' },
    { code: '654200', name: '塔城地区', pinyin: 'tacheng', initial: 'T' },
    { code: '654300', name: '阿勒泰地区', pinyin: 'aletai', initial: 'A' },
  ],
  '710000': [
    { code: '710100', name: '台北市', pinyin: 'taibei', initial: 'T' },
    { code: '710200', name: '高雄市', pinyin: 'gaoxiong', initial: 'G' },
    { code: '710300', name: '台中市', pinyin: 'taizhong', initial: 'T' },
  ],
  '810000': [
    { code: '810100', name: '香港岛', pinyin: 'xianggangdao', initial: 'X' },
    { code: '810200', name: '九龙', pinyin: 'jiulong', initial: 'J' },
    { code: '810300', name: '新界', pinyin: 'xinjie', initial: 'X' },
  ],
  '820000': [
    { code: '820100', name: '澳门半岛', pinyin: 'aomenbandao', initial: 'A' },
    { code: '820200', name: '离岛', pinyin: 'lidao', initial: 'L' },
  ],
}

// ============================================================
// 区县级行政区（按城市分组，选取主要区县）
// ============================================================

export const DISTRICTS_BY_CITY: Record<string, RegionItem[]> = {
  // 北京
  '110100': [
    { code: '110101', name: '东城区', pinyin: 'dongcheng', initial: 'D' },
    { code: '110102', name: '西城区', pinyin: 'xicheng', initial: 'X' },
    { code: '110105', name: '朝阳区', pinyin: 'chaoyang', initial: 'C' },
    { code: '110106', name: '丰台区', pinyin: 'fengtai', initial: 'F' },
    { code: '110107', name: '石景山区', pinyin: 'shijingshan', initial: 'S' },
    { code: '110108', name: '海淀区', pinyin: 'haidian', initial: 'H' },
    { code: '110109', name: '门头沟区', pinyin: 'mentougou', initial: 'M' },
    { code: '110111', name: '房山区', pinyin: 'fangshan', initial: 'F' },
    { code: '110112', name: '通州区', pinyin: 'tongzhou', initial: 'T' },
    { code: '110113', name: '顺义区', pinyin: 'shunyi', initial: 'S' },
    { code: '110114', name: '昌平区', pinyin: 'changping', initial: 'C' },
    { code: '110115', name: '大兴区', pinyin: 'daxing', initial: 'D' },
    { code: '110116', name: '怀柔区', pinyin: 'huairou', initial: 'H' },
    { code: '110117', name: '平谷区', pinyin: 'pinggu', initial: 'P' },
    { code: '110118', name: '密云区', pinyin: 'miyun', initial: 'M' },
    { code: '110119', name: '延庆区', pinyin: 'yanqing', initial: 'Y' },
  ],
  // 上海
  '310100': [
    { code: '310101', name: '黄浦区', pinyin: 'huangpu', initial: 'H' },
    { code: '310104', name: '徐汇区', pinyin: 'xuhui', initial: 'X' },
    { code: '310105', name: '长宁区', pinyin: 'changning', initial: 'C' },
    { code: '310106', name: '静安区', pinyin: 'jingan', initial: 'J' },
    { code: '310107', name: '普陀区', pinyin: 'putuo', initial: 'P' },
    { code: '310109', name: '虹口区', pinyin: 'hongkou', initial: 'H' },
    { code: '310110', name: '杨浦区', pinyin: 'yangpu', initial: 'Y' },
    { code: '310112', name: '闵行区', pinyin: 'minhang', initial: 'M' },
    { code: '310113', name: '宝山区', pinyin: 'baoshan', initial: 'B' },
    { code: '310114', name: '嘉定区', pinyin: 'jiading', initial: 'J' },
    { code: '310115', name: '浦东新区', pinyin: 'pudong', initial: 'P' },
    { code: '310116', name: '金山区', pinyin: 'jinshan', initial: 'J' },
    { code: '310117', name: '松江区', pinyin: 'songjiang', initial: 'S' },
    { code: '310118', name: '青浦区', pinyin: 'qingpu', initial: 'Q' },
    { code: '310120', name: '奉贤区', pinyin: 'fengxian', initial: 'F' },
    { code: '310151', name: '崇明区', pinyin: 'chongming', initial: 'C' },
  ],
  // 广州
  '440100': [
    { code: '440103', name: '荔湾区', pinyin: 'liwan', initial: 'L' },
    { code: '440104', name: '越秀区', pinyin: 'yuexiu', initial: 'Y' },
    { code: '440105', name: '海珠区', pinyin: 'haizhu', initial: 'H' },
    { code: '440106', name: '天河区', pinyin: 'tianhe', initial: 'T' },
    { code: '440111', name: '白云区', pinyin: 'baiyun', initial: 'B' },
    { code: '440112', name: '黄埔区', pinyin: 'huangpu', initial: 'H' },
    { code: '440113', name: '番禺区', pinyin: 'panyu', initial: 'P' },
    { code: '440114', name: '花都区', pinyin: 'huadu', initial: 'H' },
    { code: '440115', name: '南沙区', pinyin: 'nansha', initial: 'N' },
    { code: '440117', name: '从化区', pinyin: 'conghua', initial: 'C' },
    { code: '440118', name: '增城区', pinyin: 'zengcheng', initial: 'Z' },
  ],
  // 深圳
  '440300': [
    { code: '440303', name: '罗湖区', pinyin: 'luohu', initial: 'L' },
    { code: '440304', name: '福田区', pinyin: 'futian', initial: 'F' },
    { code: '440305', name: '南山区', pinyin: 'nanshan', initial: 'N' },
    { code: '440306', name: '宝安区', pinyin: 'baoan', initial: 'B' },
    { code: '440307', name: '龙岗区', pinyin: 'longgang', initial: 'L' },
    { code: '440308', name: '盐田区', pinyin: 'yantian', initial: 'Y' },
    { code: '440309', name: '龙华区', pinyin: 'longhua', initial: 'L' },
    { code: '440310', name: '坪山区', pinyin: 'pingshan', initial: 'P' },
    { code: '440311', name: '光明区', pinyin: 'guangming', initial: 'G' },
  ],
  // 成都
  '510100': [
    { code: '510104', name: '锦江区', pinyin: 'jinjiang', initial: 'J' },
    { code: '510105', name: '青羊区', pinyin: 'qingyang', initial: 'Q' },
    { code: '510106', name: '金牛区', pinyin: 'jinniu', initial: 'J' },
    { code: '510107', name: '武侯区', pinyin: 'wuhou', initial: 'W' },
    { code: '510108', name: '成华区', pinyin: 'chenghua', initial: 'C' },
    { code: '510112', name: '龙泉驿区', pinyin: 'longquanyi', initial: 'L' },
    { code: '510113', name: '青白江区', pinyin: 'qingbaijiang', initial: 'Q' },
    { code: '510114', name: '新都区', pinyin: 'xindu', initial: 'X' },
    { code: '510115', name: '温江区', pinyin: 'wenjiang', initial: 'W' },
    { code: '510116', name: '双流区', pinyin: 'shuangliu', initial: 'S' },
    { code: '510117', name: '郫都区', pinyin: 'pidu', initial: 'P' },
    { code: '510118', name: '新津区', pinyin: 'xinjin', initial: 'X' },
  ],
  // 杭州
  '330100': [
    { code: '330102', name: '上城区', pinyin: 'shangcheng', initial: 'S' },
    { code: '330105', name: '拱墅区', pinyin: 'gongshu', initial: 'G' },
    { code: '330106', name: '西湖区', pinyin: 'xihu', initial: 'X' },
    { code: '330108', name: '滨江区', pinyin: 'binjiang', initial: 'B' },
    { code: '330109', name: '萧山区', pinyin: 'xiaoshan', initial: 'X' },
    { code: '330110', name: '余杭区', pinyin: 'yuhang', initial: 'Y' },
    { code: '330111', name: '富阳区', pinyin: 'fuyang', initial: 'F' },
    { code: '330112', name: '临安区', pinyin: 'linan', initial: 'L' },
    { code: '330113', name: '临平区', pinyin: 'linping', initial: 'L' },
    { code: '330114', name: '钱塘区', pinyin: 'qiantang', initial: 'Q' },
  ],
  // 南京
  '320100': [
    { code: '320102', name: '玄武区', pinyin: 'xuanwu', initial: 'X' },
    { code: '320104', name: '秦淮区', pinyin: 'qinhuai', initial: 'Q' },
    { code: '320105', name: '建邺区', pinyin: 'jianye', initial: 'J' },
    { code: '320106', name: '鼓楼区', pinyin: 'gulou', initial: 'G' },
    { code: '320111', name: '浦口区', pinyin: 'pukou', initial: 'P' },
    { code: '320113', name: '栖霞区', pinyin: 'qixia', initial: 'Q' },
    { code: '320114', name: '雨花台区', pinyin: 'yuhuatai', initial: 'Y' },
    { code: '320115', name: '江宁区', pinyin: 'jiangning', initial: 'J' },
    { code: '320116', name: '六合区', pinyin: 'liuhe', initial: 'L' },
    { code: '320117', name: '溧水区', pinyin: 'lishui', initial: 'L' },
    { code: '320118', name: '高淳区', pinyin: 'gaochun', initial: 'G' },
  ],
  // 武汉
  '420100': [
    { code: '420102', name: '江岸区', pinyin: 'jiangan', initial: 'J' },
    { code: '420103', name: '江汉区', pinyin: 'jianghan', initial: 'J' },
    { code: '420104', name: '硚口区', pinyin: 'qiaokou', initial: 'Q' },
    { code: '420105', name: '汉阳区', pinyin: 'hanyang', initial: 'H' },
    { code: '420106', name: '武昌区', pinyin: 'wuchang', initial: 'W' },
    { code: '420107', name: '青山区', pinyin: 'qingshan', initial: 'Q' },
    { code: '420111', name: '洪山区', pinyin: 'hongshan', initial: 'H' },
    { code: '420112', name: '东西湖区', pinyin: 'dongxihu', initial: 'D' },
    { code: '420113', name: '汉南区', pinyin: 'hannan', initial: 'H' },
    { code: '420114', name: '蔡甸区', pinyin: 'caidian', initial: 'C' },
    { code: '420115', name: '江夏区', pinyin: 'jiangxia', initial: 'J' },
    { code: '420116', name: '黄陂区', pinyin: 'huangpi', initial: 'H' },
    { code: '420117', name: '新洲区', pinyin: 'xinzhou', initial: 'X' },
  ],
  // 天津
  '120100': [
    { code: '120101', name: '和平区', pinyin: 'heping', initial: 'H' },
    { code: '120102', name: '河东区', pinyin: 'hedong', initial: 'H' },
    { code: '120103', name: '河西区', pinyin: 'hexi', initial: 'H' },
    { code: '120104', name: '南开区', pinyin: 'nankai', initial: 'N' },
    { code: '120105', name: '河北区', pinyin: 'hebei', initial: 'H' },
    { code: '120106', name: '红桥区', pinyin: 'hongqiao', initial: 'H' },
    { code: '120110', name: '东丽区', pinyin: 'dongli', initial: 'D' },
    { code: '120111', name: '西青区', pinyin: 'xiqing', initial: 'X' },
    { code: '120112', name: '津南区', pinyin: 'jinnan', initial: 'J' },
    { code: '120113', name: '北辰区', pinyin: 'beichen', initial: 'B' },
    { code: '120114', name: '武清区', pinyin: 'wuqing', initial: 'W' },
    { code: '120115', name: '宝坻区', pinyin: 'baodi', initial: 'B' },
    { code: '120116', name: '滨海新区', pinyin: 'binhaixinqu', initial: 'B' },
  ],
  // 重庆
  '500100': [
    { code: '500101', name: '万州区', pinyin: 'wanzhou', initial: 'W' },
    { code: '500102', name: '涪陵区', pinyin: 'fuling', initial: 'F' },
    { code: '500103', name: '渝中区', pinyin: 'yuzhong', initial: 'Y' },
    { code: '500104', name: '大渡口区', pinyin: 'dadukou', initial: 'D' },
    { code: '500105', name: '江北区', pinyin: 'jiangbei', initial: 'J' },
    { code: '500106', name: '沙坪坝区', pinyin: 'shapingba', initial: 'S' },
    { code: '500107', name: '九龙坡区', pinyin: 'jiulongpo', initial: 'J' },
    { code: '500108', name: '南岸区', pinyin: 'nanan', initial: 'N' },
    { code: '500109', name: '北碚区', pinyin: 'beibei', initial: 'B' },
    { code: '500110', name: '綦江区', pinyin: 'qijiang', initial: 'Q' },
    { code: '500111', name: '大足区', pinyin: 'dazu', initial: 'D' },
    { code: '500112', name: '渝北区', pinyin: 'yubei', initial: 'Y' },
    { code: '500113', name: '巴南区', pinyin: 'banan', initial: 'B' },
  ],
  // 西安
  '610100': [
    { code: '610102', name: '新城区', pinyin: 'xincheng', initial: 'X' },
    { code: '610103', name: '碑林区', pinyin: 'beilin', initial: 'B' },
    { code: '610104', name: '莲湖区', pinyin: 'lianhu', initial: 'L' },
    { code: '610111', name: '灞桥区', pinyin: 'baqiao', initial: 'B' },
    { code: '610112', name: '未央区', pinyin: 'weiyang', initial: 'W' },
    { code: '610113', name: '雁塔区', pinyin: 'yanta', initial: 'Y' },
    { code: '610114', name: '阎良区', pinyin: 'yanliang', initial: 'Y' },
    { code: '610115', name: '临潼区', pinyin: 'lintong', initial: 'L' },
    { code: '610116', name: '长安区', pinyin: 'changan', initial: 'C' },
    { code: '610117', name: '高陵区', pinyin: 'gaoling', initial: 'G' },
    { code: '610118', name: '鄠邑区', pinyin: 'huyi', initial: 'H' },
  ],
  // 合肥
  '340100': [
    { code: '340102', name: '瑶海区', pinyin: 'yaohai', initial: 'Y' },
    { code: '340103', name: '庐阳区', pinyin: 'luyang', initial: 'L' },
    { code: '340104', name: '蜀山区', pinyin: 'shushan', initial: 'S' },
    { code: '340111', name: '包河区', pinyin: 'baohe', initial: 'B' },
    { code: '340121', name: '长丰县', pinyin: 'changfeng', initial: 'C' },
    { code: '340122', name: '肥东县', pinyin: 'feidong', initial: 'F' },
    { code: '340123', name: '肥西县', pinyin: 'feixi', initial: 'F' },
    { code: '340181', name: '巢湖市', pinyin: 'chaohu', initial: 'C' },
    { code: '340182', name: '庐江县', pinyin: 'lujiang', initial: 'L' },
  ],
  // 长沙
  '430100': [
    { code: '430102', name: '芙蓉区', pinyin: 'furong', initial: 'F' },
    { code: '430103', name: '天心区', pinyin: 'tianxin', initial: 'T' },
    { code: '430104', name: '岳麓区', pinyin: 'yuelu', initial: 'Y' },
    { code: '430105', name: '开福区', pinyin: 'kaifu', initial: 'K' },
    { code: '430111', name: '雨花区', pinyin: 'yuhua', initial: 'Y' },
    { code: '430112', name: '望城区', pinyin: 'wangcheng', initial: 'W' },
    { code: '430121', name: '长沙县', pinyin: 'changshaxian', initial: 'C' },
    { code: '430181', name: '浏阳市', pinyin: 'liuyang', initial: 'L' },
    { code: '430182', name: '宁乡市', pinyin: 'ningxiang', initial: 'N' },
  ],
  // 郑州
  '410100': [
    { code: '410102', name: '中原区', pinyin: 'zhongyuan', initial: 'Z' },
    { code: '410103', name: '二七区', pinyin: 'erqi', initial: 'E' },
    { code: '410104', name: '管城回族区', pinyin: 'guancheng', initial: 'G' },
    { code: '410105', name: '金水区', pinyin: 'jinshui', initial: 'J' },
    { code: '410106', name: '上街区', pinyin: 'shangjie', initial: 'S' },
    { code: '410108', name: '惠济区', pinyin: 'huiji', initial: 'H' },
    { code: '410122', name: '中牟县', pinyin: 'zhongmu', initial: 'Z' },
    { code: '410181', name: '巩义市', pinyin: 'gongyi', initial: 'G' },
    { code: '410182', name: '荥阳市', pinyin: 'xingyang', initial: 'X' },
    { code: '410183', name: '新密市', pinyin: 'xinmi', initial: 'X' },
    { code: '410184', name: '新郑市', pinyin: 'xinzheng', initial: 'X' },
    { code: '410185', name: '登封市', pinyin: 'dengfeng', initial: 'D' },
  ],
  // 济南
  '370100': [
    { code: '370102', name: '历下区', pinyin: 'lixia', initial: 'L' },
    { code: '370103', name: '市中区', pinyin: 'shizhongqu', initial: 'S' },
    { code: '370104', name: '槐荫区', pinyin: 'huaiyin', initial: 'H' },
    { code: '370105', name: '天桥区', pinyin: 'tianqiao', initial: 'T' },
    { code: '370112', name: '历城区', pinyin: 'licheng', initial: 'L' },
    { code: '370113', name: '长清区', pinyin: 'changqing', initial: 'C' },
    { code: '370114', name: '章丘区', pinyin: 'zhangqiu', initial: 'Z' },
    { code: '370115', name: '济阳区', pinyin: 'jiyang', initial: 'J' },
    { code: '370116', name: '莱芜区', pinyin: 'laiwu', initial: 'L' },
    { code: '370117', name: '钢城区', pinyin: 'gangcheng', initial: 'G' },
  ],
  // 青岛
  '370200': [
    { code: '370202', name: '市南区', pinyin: 'shinan', initial: 'S' },
    { code: '370203', name: '市北区', pinyin: 'shibei', initial: 'S' },
    { code: '370211', name: '黄岛区', pinyin: 'huangdao', initial: 'H' },
    { code: '370212', name: '崂山区', pinyin: 'laoshan', initial: 'L' },
    { code: '370213', name: '李沧区', pinyin: 'licang', initial: 'L' },
    { code: '370214', name: '城阳区', pinyin: 'chengyang', initial: 'C' },
    { code: '370215', name: '即墨区', pinyin: 'jimo', initial: 'J' },
  ],
  // 昆明
  '530100': [
    { code: '530102', name: '五华区', pinyin: 'wuhua', initial: 'W' },
    { code: '530103', name: '盘龙区', pinyin: 'panlong', initial: 'P' },
    { code: '530111', name: '官渡区', pinyin: 'guandu', initial: 'G' },
    { code: '530112', name: '西山区', pinyin: 'xishan', initial: 'X' },
    { code: '530113', name: '东川区', pinyin: 'dongchuan', initial: 'D' },
    { code: '530114', name: '呈贡区', pinyin: 'chenggong', initial: 'C' },
    { code: '530115', name: '晋宁区', pinyin: 'jinning', initial: 'J' },
    { code: '530124', name: '富民县', pinyin: 'fumin', initial: 'F' },
    { code: '530125', name: '宜良县', pinyin: 'yiliang', initial: 'Y' },
    { code: '530181', name: '安宁市', pinyin: 'anning', initial: 'A' },
  ],
  // 福州
  '350100': [
    { code: '350102', name: '鼓楼区', pinyin: 'gulou', initial: 'G' },
    { code: '350103', name: '台江区', pinyin: 'taijiang', initial: 'T' },
    { code: '350104', name: '仓山区', pinyin: 'cangshan', initial: 'C' },
    { code: '350105', name: '马尾区', pinyin: 'mawei', initial: 'M' },
    { code: '350111', name: '晋安区', pinyin: 'jinan', initial: 'J' },
    { code: '350112', name: '长乐区', pinyin: 'changle', initial: 'C' },
  ],
  // 厦门
  '350200': [
    { code: '350203', name: '思明区', pinyin: 'siming', initial: 'S' },
    { code: '350205', name: '海沧区', pinyin: 'haicang', initial: 'H' },
    { code: '350206', name: '湖里区', pinyin: 'huli', initial: 'H' },
    { code: '350211', name: '集美区', pinyin: 'jimei', initial: 'J' },
    { code: '350212', name: '同安区', pinyin: 'tongan', initial: 'T' },
    { code: '350213', name: '翔安区', pinyin: 'xiangan', initial: 'X' },
  ],
  // 苏州
  '320500': [
    { code: '320505', name: '虎丘区', pinyin: 'huqiu', initial: 'H' },
    { code: '320506', name: '吴中区', pinyin: 'wuzhong', initial: 'W' },
    { code: '320507', name: '相城区', pinyin: 'xiangcheng', initial: 'X' },
    { code: '320508', name: '姑苏区', pinyin: 'gusu', initial: 'G' },
    { code: '320509', name: '吴江区', pinyin: 'wujiang', initial: 'W' },
    { code: '320571', name: '苏州工业园区', pinyin: 'gongyeyuanqu', initial: 'G' },
    { code: '320581', name: '常熟市', pinyin: 'changshu', initial: 'C' },
    { code: '320582', name: '张家港市', pinyin: 'zhangjiagang', initial: 'Z' },
    { code: '320583', name: '昆山市', pinyin: 'kunshan', initial: 'K' },
    { code: '320585', name: '太仓市', pinyin: 'taicang', initial: 'T' },
  ],
  // 东莞（地级市无下辖区，直辖镇/街道）
  '441900': [
    { code: '441900', name: '东莞市（直辖）', pinyin: 'dongguan', initial: 'D' },
  ],
  // 中山
  '442000': [
    { code: '442000', name: '中山市（直辖）', pinyin: 'zhongshan', initial: 'Z' },
  ],
}

// ============================================================
// 辅助查询函数
// ============================================================

/** 根据省份代码获取城市列表 */
export function getCitiesByProvince(provinceCode: string): RegionItem[] {
  return CITIES_BY_PROVINCE[provinceCode] || []
}

/** 根据城市代码获取区县列表 */
export function getDistrictsByCity(cityCode: string): RegionItem[] {
  return DISTRICTS_BY_CITY[cityCode] || []
}

/** 根据拼音首字母获取省份列表 */
export function getProvincesByInitial(initial: string): RegionItem[] {
  return PROVINCES.filter(p => p.initial === initial.toUpperCase())
}

/** 获取所有可用的拼音首字母（去重排序） */
export function getAvailableInitials(): string[] {
  const initials = new Set(PROVINCES.map(p => p.initial))
  return [...initials].sort()
}

/** 搜索省份（按名称或拼音） */
export function searchProvinces(query: string): RegionItem[] {
  const q = query.toLowerCase().trim()
  if (!q) return PROVINCES
  return PROVINCES.filter(p =>
    p.name.includes(q) || p.pinyin.startsWith(q) || p.initial.toLowerCase() === q
  )
}

/** 搜索城市（按名称或拼音，可限定省份） */
export function searchCities(query: string, provinceCode?: string): RegionItem[] {
  const q = query.toLowerCase().trim()
  const cities = provinceCode ? getCitiesByProvince(provinceCode) : Object.values(CITIES_BY_PROVINCE).flat()
  if (!q) return cities
  return cities.filter(c =>
    c.name.includes(q) || c.pinyin.startsWith(q) || c.initial.toLowerCase() === q
  )
}

/** 搜索区县（按名称或拼音，可限定城市） */
export function searchDistricts(query: string, cityCode?: string): RegionItem[] {
  const q = query.toLowerCase().trim()
  const districts = cityCode ? getDistrictsByCity(cityCode) : Object.values(DISTRICTS_BY_CITY).flat()
  if (!q) return districts
  return districts.filter(d =>
    d.name.includes(q) || d.pinyin.startsWith(q)
  )
}

/** 根据 code 获取 RegionItem */
export function getProvinceByCode(code: string): RegionItem | undefined {
  return PROVINCES.find(p => p.code === code)
}

/** 根据 code 获取城市 RegionItem */
export function getCityByCode(code: string): RegionItem | undefined {
  for (const cities of Object.values(CITIES_BY_PROVINCE)) {
    const found = cities.find(c => c.code === code)
    if (found) return found
  }
  return undefined
}

/** 根据 code 获取区县 RegionItem */
export function getDistrictByCode(code: string): RegionItem | undefined {
  for (const districts of Object.values(DISTRICTS_BY_CITY)) {
    const found = districts.find(d => d.code === code)
    if (found) return found
  }
  return undefined
}

/** 获取完整的地区显示名称 */
export function getRegionDisplayName(region: RegionValue): string {
  const parts: string[] = []
  if (region.province) {
    const p = getProvinceByCode(region.province)
    if (p) parts.push(p.name)
  }
  if (region.city) {
    const c = getCityByCode(region.city)
    if (c && c.name !== parts[0]) parts.push(c.name)
  }
  if (region.district) {
    const d = getDistrictByCode(region.district)
    if (d) parts.push(d.name)
  }
  return parts.join(' · ')
}
