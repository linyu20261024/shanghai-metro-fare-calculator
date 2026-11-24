export interface MetroLineInfo {
  id: string;
  name: string;
  shortName: string;
  color: string;
  textColor: string;
}

export interface MetroStation {
  id: string;
  name: string;
  pinyin: string;
  district: string;
  lat: number;
  lng: number;
  lines: string[];
}

export interface MetroEdge {
  from: string;
  to: string;
  line: string;
  distanceKm: number;
}

export interface CommutePreset {
  id: string;
  label: string;
  fromId: string;
  toId: string;
  note: string;
}

export const METRO_LINES: Record<string, MetroLineInfo> = {
  '1': { id: '1', name: '1号线', shortName: '1', color: '#E3002B', textColor: '#FFFFFF' },
  '2': { id: '2', name: '2号线', shortName: '2', color: '#82BF25', textColor: '#FFFFFF' },
  '3': { id: '3', name: '3号线', shortName: '3', color: '#FCD600', textColor: '#1E293B' },
  '4': { id: '4', name: '4号线', shortName: '4', color: '#461D84', textColor: '#FFFFFF' },
  '5': { id: '5', name: '5号线', shortName: '5', color: '#944D9A', textColor: '#FFFFFF' },
  '6': { id: '6', name: '6号线', shortName: '6', color: '#D40068', textColor: '#FFFFFF' },
  '7': { id: '7', name: '7号线', shortName: '7', color: '#ED6F00', textColor: '#FFFFFF' },
  '8': { id: '8', name: '8号线', shortName: '8', color: '#0094D8', textColor: '#FFFFFF' },
  '9': { id: '9', name: '9号线', shortName: '9', color: '#87CAED', textColor: '#0F172A' },
  '10': { id: '10', name: '10号线', shortName: '10', color: '#C6AFD4', textColor: '#0F172A' },
  '11': { id: '11', name: '11号线', shortName: '11', color: '#871C2B', textColor: '#FFFFFF' },
  '12': { id: '12', name: '12号线', shortName: '12', color: '#007B61', textColor: '#FFFFFF' },
  '13': { id: '13', name: '13号线', shortName: '13', color: '#E999C0', textColor: '#0F172A' },
  '14': { id: '14', name: '14号线', shortName: '14', color: '#827A04', textColor: '#FFFFFF' },
  '15': { id: '15', name: '15号线', shortName: '15', color: '#BBA786', textColor: '#0F172A' },
  '16': { id: '16', name: '16号线', shortName: '16', color: '#32D4CA', textColor: '#0F172A' },
  '17': { id: '17', name: '17号线', shortName: '17', color: '#B67770', textColor: '#FFFFFF' },
  '18': { id: '18', name: '18号线', shortName: '18', color: '#D6A461', textColor: '#0F172A' },
  'PJ': { id: 'PJ', name: '浦江线', shortName: '浦', color: '#999999', textColor: '#FFFFFF' },
};

// 核心与代表性上海地铁站点（含主城换乘枢纽及各区远郊通勤大站）
export const STATIONS: MetroStation[] = [
  // 核心换乘枢纽 & 1号线沿线
  { id: 'fujinlu', name: '富锦路', pinyin: 'fujinlu fjl', district: '宝山', lat: 31.3924, lng: 121.4245, lines: ['1'] },
  { id: 'gongfu_xincun', name: '共富新村', pinyin: 'gongfuxincun gfxc', district: '宝山', lat: 31.3550, lng: 121.4342, lines: ['1'] },
  { id: 'gongkanglu', name: '共康路', pinyin: 'gongkanglu gkl', district: '静安', lat: 31.3189, lng: 121.4470, lines: ['1'] },
  { id: 'pengpu_xincun', name: '彭浦新村', pinyin: 'pengpuxincun ppxc', district: '静安', lat: 31.3065, lng: 121.4487, lines: ['1'] },
  { id: 'shanghai_circus', name: '上海马戏城', pinyin: 'shanghaimaxicheng shmxc', district: '静安', lat: 31.2793, lng: 121.4520, lines: ['1'] },
  { id: 'shanghai_railway', name: '上海火车站', pinyin: 'shanghaihuochezhan shhcz', district: '静安', lat: 31.2495, lng: 121.4581, lines: ['1', '3', '4'] },
  { id: 'hanzhonglu', name: '汉中路', pinyin: 'hanzhonglu hzl', district: '静安', lat: 31.2417, lng: 121.4587, lines: ['1', '12', '13'] },
  { id: 'renmin_guangchang', name: '人民广场', pinyin: 'renminguangchang rmgc', district: '黄浦', lat: 31.2328, lng: 121.4754, lines: ['1', '2', '8'] },
  { id: 'yidayizhi_huangpinan', name: '一大会址·黄陂南路', pinyin: 'huangpinanlu hpnl ydz', district: '黄浦', lat: 31.2227, lng: 121.4733, lines: ['1', '14'] },
  { id: 'shanxi_nanlu', name: '陕西南路', pinyin: 'shanxinanlu sxnl', district: '徐汇', lat: 31.2155, lng: 121.4589, lines: ['1', '10', '12'] },
  { id: 'changshulu', name: '常熟路', pinyin: 'changshulu csl', district: '徐汇', lat: 31.2136, lng: 121.4501, lines: ['1', '7'] },
  { id: 'xujiahui', name: '徐家汇', pinyin: 'xujiahui xjh', district: '徐汇', lat: 31.1953, lng: 121.4368, lines: ['1', '9', '11'] },
  { id: 'shanghai_stadium', name: '上海体育馆', pinyin: 'shanghaitiyuguan shtyg', district: '徐汇', lat: 31.1825, lng: 121.4370, lines: ['1', '4'] },
  { id: 'caobao_lu', name: '漕宝路', pinyin: 'caobaolu cbl', district: '徐汇', lat: 31.1683, lng: 121.4342, lines: ['1', '12'] },
  { id: 'shanghai_south', name: '上海南站', pinyin: 'shanghainanzhan shnz', district: '徐汇', lat: 31.1544, lng: 121.4295, lines: ['1', '3', '15'] },
  { id: 'lianhualu', name: '莲花路', pinyin: 'lianhualu lhl', district: '闵行', lat: 31.1306, lng: 121.4034, lines: ['1'] },
  { id: 'xinzhuang', name: '莘庄', pinyin: 'xinzhuang xz', district: '闵行', lat: 31.1112, lng: 121.3852, lines: ['1', '5'] },

  // 2号线东西干线
  { id: 'guojia_huizhan', name: '国家会展中心', pinyin: 'guojiahuizhanzhongxin gjhzzx', district: '青浦', lat: 31.1930, lng: 121.3005, lines: ['2', '17'] },
  { id: 'hongqiao_railway', name: '虹桥火车站', pinyin: 'hongqiaohuochezhan hqhcz', district: '闵行', lat: 31.1941, lng: 121.3204, lines: ['2', '10', '17'] },
  { id: 'hongqiao_t2', name: '虹桥2号航站楼', pinyin: 'hongqiaoerhaohangzhanlou hq2', district: '闵行', lat: 31.1944, lng: 121.3270, lines: ['2', '10'] },
  { id: 'songhonglu', name: '淞虹路', pinyin: 'songhonglu shl', district: '长宁', lat: 31.2181, lng: 121.3596, lines: ['2'] },
  { id: 'zhongshan_park', name: '中山公园', pinyin: 'zhongshangongyuan zsgy', district: '长宁', lat: 31.2180, lng: 121.4167, lines: ['2', '3', '4'] },
  { id: 'jiangsu_lu', name: '江苏路', pinyin: 'jiangsulu jsl', district: '长宁', lat: 31.2206, lng: 121.4307, lines: ['2', '11'] },
  { id: 'jingan_temple', name: '静安寺', pinyin: 'jingansi jas', district: '静安', lat: 31.2233, lng: 121.4465, lines: ['2', '7', '14'] },
  { id: 'nanjing_west', name: '南京西路', pinyin: 'nanjingxilu njxl', district: '静安', lat: 31.2300, lng: 121.4596, lines: ['2', '12', '13'] },
  { id: 'nanjing_east', name: '南京东路', pinyin: 'nanjingdonglu njdl', district: '黄浦', lat: 31.2381, lng: 121.4847, lines: ['2', '10'] },
  { id: 'lujiazui', name: '陆家嘴', pinyin: 'lujiazui ljz', district: '浦东', lat: 31.2381, lng: 121.5023, lines: ['2', '14'] },
  { id: 'shiji_dadao', name: '世纪大道', pinyin: 'shijidadao sjdd', district: '浦东', lat: 31.2286, lng: 121.5270, lines: ['2', '4', '6', '9'] },
  { id: 'longyang_lu', name: '龙阳路', pinyin: 'longyanglu lyl', district: '浦东', lat: 31.2036, lng: 121.5576, lines: ['2', '7', '16', '18'] },
  { id: 'zhangjiang_gaoke', name: '张江高科', pinyin: 'zhangjianggaoke zjgk', district: '浦东', lat: 31.2017, lng: 121.5877, lines: ['2'] },
  { id: 'guanglan_lu', name: '广兰路', pinyin: 'guanglanlu gll', district: '浦东', lat: 31.2110, lng: 121.6211, lines: ['2'] },
  { id: 'tangzhen', name: '唐镇', pinyin: 'tangzhen tz', district: '浦东', lat: 31.2143, lng: 121.6562, lines: ['2'] },
  { id: 'chuansha', name: '川沙', pinyin: 'chuansha cs', district: '浦东', lat: 31.1869, lng: 121.6984, lines: ['2'] },
  { id: 'pudong_airport', name: '浦东1号2号航站楼', pinyin: 'pudongjichang pdjc', district: '浦东', lat: 31.1499, lng: 121.8058, lines: ['2'] },

  // 3/4号线环线与北延
  { id: 'baoyanglu', name: '宝杨路', pinyin: 'baoyanglu byl', district: '宝山', lat: 31.3955, lng: 121.4800, lines: ['3'] },
  { id: 'songbinlu', name: '淞滨路', pinyin: 'songbinlu sbl', district: '宝山', lat: 31.3712, lng: 121.4926, lines: ['3'] },
  { id: 'jiangwan_town', name: '江湾镇', pinyin: 'jiangwanzhen jwz', district: '虹口', lat: 31.3055, lng: 121.4852, lines: ['3'] },
  { id: 'hongkou_football', name: '虹口足球场', pinyin: 'hongkouzuqiuchang hkzqc', district: '虹口', lat: 31.2712, lng: 121.4804, lines: ['3', '8'] },
  { id: 'zhenping_lu', name: '镇坪路', pinyin: 'zhenpinglu zpl', district: '普陀', lat: 31.2462, lng: 121.4317, lines: ['3', '4', '7'] },
  { id: 'caoyang_lu', name: '曹杨路', pinyin: 'caoyanglu cyl', district: '普陀', lat: 31.2381, lng: 121.4178, lines: ['3', '4', '11', '14'] },
  { id: 'jinshajiang_lu', name: '金沙江路', pinyin: 'jinshajianglu jsjl', district: '普陀', lat: 31.2323, lng: 121.4126, lines: ['3', '4', '13'] },
  { id: 'yishan_lu', name: '宜山路', pinyin: 'yishanlu ysl', district: '徐汇', lat: 31.1862, lng: 121.4278, lines: ['3', '4', '9'] },
  { id: 'dalian_lu', name: '大连路', pinyin: 'dalianlu dll', district: '虹口', lat: 31.2577, lng: 121.5127, lines: ['4', '12'] },
  { id: 'lujiazui_tangqiao', name: '塘桥', pinyin: 'tangqiao tq', district: '浦东', lat: 31.2094, lng: 121.5193, lines: ['4'] },
  { id: 'xizang_nanlu', name: '西藏南路', pinyin: 'xizangnanlu xznl', district: '黄浦', lat: 31.2016, lng: 121.4895, lines: ['4', '8'] },
  { id: 'dapu_qiao', name: '大木桥路', pinyin: 'damuqiaolu dmql', district: '徐汇', lat: 31.1941, lng: 121.4642, lines: ['4', '12'] },

  // 5号线（闵行/奉贤南桥通勤线）
  { id: 'zhuanqiao', name: '颛桥', pinyin: 'zhuanqiao zq', district: '闵行', lat: 31.0663, lng: 121.4021, lines: ['5'] },
  { id: 'dongchuan_lu', name: '东川路', pinyin: 'dongchuanlu dcl', district: '闵行', lat: 31.0185, lng: 121.4201, lines: ['5'] },
  { id: 'jianchuan_lu', name: '剑川路', pinyin: 'jianchuanlu jcl', district: '闵行', lat: 31.0268, lng: 121.4163, lines: ['5'] },
  { id: 'minhang_kaifaqu', name: '闵行开发区', pinyin: 'minhangkaifaqu mhkfq', district: '闵行', lat: 31.0005, lng: 121.3705, lines: ['5'] },
  { id: 'fengxian_xincheng', name: '奉贤新城', pinyin: 'fengxianxincheng fxxc', district: '奉贤', lat: 30.9167, lng: 121.4733, lines: ['5'] },

  // 6号线（浦东南北通勤线）
  { id: 'gangcheng_lu', name: '港城路', pinyin: 'gangchenglu gcl', district: '浦东', lat: 31.3532, lng: 121.5746, lines: ['6', '10'] },
  { id: 'jufeng_lu', name: '巨峰路', pinyin: 'jufenglu jfl', district: '浦东', lat: 31.2809, lng: 121.5880, lines: ['6', '12'] },
  { id: 'jinqiao_lu', name: '金桥路', pinyin: 'jinqiaolu jql', district: '浦东', lat: 31.2633, lng: 121.5818, lines: ['6'] },
  { id: 'yuanshen_tiyu', name: '源深体育中心', pinyin: 'yuanshentiyuzhongxin ysty', district: '浦东', lat: 31.2334, lng: 121.5342, lines: ['6'] },
  { id: 'lancun_lu', name: '蓝村路', pinyin: 'lancunlu lcl', district: '浦东', lat: 31.2116, lng: 121.5278, lines: ['4', '6'] },
  { id: 'gaoke_xilu', name: '高科西路', pinyin: 'gaokexilu gkxl', district: '浦东', lat: 31.1862, lng: 121.5097, lines: ['6', '7'] },
  { id: 'dongfang_tiyu', name: '东方体育中心', pinyin: 'dongfangtiyuzhongxin dftyzx', district: '浦东', lat: 31.1536, lng: 121.4803, lines: ['6', '8', '11'] },

  // 7号线（美兰湖-宝山-静安-花木）
  { id: 'meilanhu', name: '美兰湖', pinyin: 'meilanhu mlh', district: '宝山', lat: 31.4018, lng: 121.3502, lines: ['7'] },
  { id: 'gucun_gongyuan', name: '顾村公园', pinyin: 'gucungongyuan gcgy', district: '宝山', lat: 31.3446, lng: 121.3733, lines: ['7', '15'] },
  { id: 'shangda_lu', name: '上大路', pinyin: 'shangdalu sdl', district: '宝山', lat: 31.3143, lng: 121.4063, lines: ['7'] },
  { id: 'dachang_zhen', name: '大场镇', pinyin: 'dachangzhen dcz', district: '宝山', lat: 31.2923, lng: 121.4167, lines: ['7'] },
  { id: 'changshou_lu', name: '长寿路', pinyin: 'changshoulu csl', district: '普陀', lat: 31.2407, lng: 121.4383, lines: ['7', '13'] },
  { id: 'zhaojiabang_lu', name: '肇嘉浜路', pinyin: 'zhaojiabanglu zjbl', district: '徐汇', lat: 31.1991, lng: 121.4501, lines: ['7', '9'] },
  { id: 'yaohua_lu', name: '耀华路', pinyin: 'yaohualu yhl', district: '浦东', lat: 31.1782, lng: 121.4945, lines: ['7', '8'] },
  { id: 'huamu_lu', name: '花木路', pinyin: 'huamulu hml', district: '浦东', lat: 31.2116, lng: 121.5738, lines: ['7'] },

  // 8号线（市光路-杨浦-人广-沈杜公路）
  { id: 'shiguang_lu', name: '市光路', pinyin: 'shiguanglu sgl', district: '杨浦', lat: 31.3228, lng: 121.5315, lines: ['8'] },
  { id: 'wujiaochang_8', name: '黄兴公园', pinyin: 'huangxinggongyuan hxgy', district: '杨浦', lat: 31.2939, lng: 121.5326, lines: ['8'] },
  { id: 'siping_lu', name: '四平路', pinyin: 'sipinglu spl', district: '杨浦', lat: 31.2747, lng: 121.5015, lines: ['8', '10'] },
  { id: 'laoximen', name: '老西门', pinyin: 'laoximen lxm', district: '黄浦', lat: 31.2186, lng: 121.4841, lines: ['8', '10'] },
  { id: 'lujiabang_lu', name: '陆家浜路', pinyin: 'lujiabanglu ljbl', district: '黄浦', lat: 31.2118, lng: 121.4867, lines: ['8', '9'] },
  { id: 'pujiang_zhen', name: '浦江镇', pinyin: 'pujiangzhen pjz', district: '闵行', lat: 31.0964, lng: 121.5063, lines: ['8'] },
  { id: 'shendu_gonglu', name: '沈杜公路', pinyin: 'shendugonglu sdgl', district: '闵行', lat: 31.0596, lng: 121.5117, lines: ['8', 'PJ'] },

  // 9号线（松江新城-七宝-徐家汇-金桥/曹路）
  { id: 'songjiang_nan', name: '松江南站', pinyin: 'songjiangnanzhan sjnz', district: '松江', lat: 30.9859, lng: 121.2307, lines: ['9'] },
  { id: 'songjiang_daxuecheng', name: '松江大学城', pinyin: 'songjiangdaxuecheng sjdxc', district: '松江', lat: 31.0539, lng: 121.2319, lines: ['9'] },
  { id: 'sijing', name: '泗泾', pinyin: 'sijing sj', district: '松江', lat: 31.1187, lng: 121.2610, lines: ['9'] },
  { id: 'jiuting', name: '九亭', pinyin: 'jiuting jt', district: '松江', lat: 31.1378, lng: 121.3189, lines: ['9'] },
  { id: 'qibao', name: '七宝', pinyin: 'qibao qb', district: '闵行', lat: 31.1552, lng: 121.3490, lines: ['9'] },
  { id: 'caoyang_hejing', name: '漕河泾开发区', pinyin: 'caohejingkaifaqu chjkfq', district: '徐汇', lat: 31.1704, lng: 121.3976, lines: ['9'] },
  { id: 'dapuqiao_9', name: '打浦桥', pinyin: 'dapuqiao dpq', district: '黄浦', lat: 31.2063, lng: 121.4694, lines: ['9'] },
  { id: 'madang_lu', name: '马当路', pinyin: 'madanglu mdl', district: '黄浦', lat: 31.2097, lng: 121.4773, lines: ['9', '13'] },
  { id: 'yanggao_zhonglu', name: '杨高中路', pinyin: 'yanggaozhonglu ygzl', district: '浦东', lat: 31.2279, lng: 121.5491, lines: ['9', '18'] },
  { id: 'jinqiao_9', name: '金桥', pinyin: 'jinqiao jq', district: '浦东', lat: 31.2584, lng: 121.6087, lines: ['9'] },
  { id: 'caolu', name: '曹路', pinyin: 'caolu cl', district: '浦东', lat: 31.2738, lng: 121.6531, lines: ['9'] },

  // 10号线（虹桥-五角场-基隆路）
  { id: 'hangzhong_lu', name: '航中路', pinyin: 'hangzhonglu hzl', district: '闵行', lat: 31.1636, lng: 121.3547, lines: ['10'] },
  { id: 'longxi_lu', name: '龙溪路', pinyin: 'longxilu lxl', district: '长宁', lat: 31.1942, lng: 121.3795, lines: ['10'] },
  { id: 'hongqiao_lu', name: '虹桥路', pinyin: 'hongqiaolu hql', district: '长宁', lat: 31.1973, lng: 121.4211, lines: ['3', '4', '10'] },
  { id: 'jiaotong_univ', name: '交通大学', pinyin: 'jiaotongdaxue jtdx', district: '徐汇', lat: 31.2023, lng: 121.4348, lines: ['10', '11'] },
  { id: 'xintiandi', name: '一大会址·新天地', pinyin: 'xintiandi xtd', district: '黄浦', lat: 31.2165, lng: 121.4752, lines: ['10', '13'] },
  { id: 'tiantong_lu', name: '天潼路', pinyin: 'tiantonglu ttl', district: '虹口', lat: 31.2439, lng: 121.4820, lines: ['10', '12'] },
  { id: 'wujiaochang', name: '五角场', pinyin: 'wujiaochang wjc', district: '杨浦', lat: 31.3005, lng: 121.5142, lines: ['10'] },
  { id: 'xinjiangwancheng', name: '新江湾城', pinyin: 'xinjiangwancheng xjwc', district: '杨浦', lat: 31.3282, lng: 121.5067, lines: ['10'] },

  // 11号线（嘉定/花桥-安亭-徐家汇-迪士尼）
  { id: 'jiading_bei', name: '嘉定北', pinyin: 'jiadingbei jdb', district: '嘉定', lat: 31.3914, lng: 121.2374, lines: ['11'] },
  { id: 'jiading_xincheng', name: '嘉定新城', pinyin: 'jiadingxincheng jdxc', district: '嘉定', lat: 31.3301, lng: 121.2544, lines: ['11'] },
  { id: 'anting', name: '安亭', pinyin: 'anting at', district: '嘉定', lat: 31.2886, lng: 121.1619, lines: ['11'] },
  { id: 'nanxiang', name: '南翔', pinyin: 'nanxiang nx', district: '嘉定', lat: 31.2969, lng: 121.3227, lines: ['11'] },
  { id: 'zhenru', name: '真如', pinyin: 'zhenru zr', district: '普陀', lat: 31.2508, lng: 121.4071, lines: ['11', '14'] },
  { id: 'longhua', name: '龙华', pinyin: 'longhua lh', district: '徐汇', lat: 31.1729, lng: 121.4533, lines: ['11', '12'] },
  { id: 'sanlin', name: '三林', pinyin: 'sanlin sl', district: '浦东', lat: 31.1430, lng: 121.5112, lines: ['11'] },
  { id: 'luoshan_lu', name: '罗山路', pinyin: 'luoshanlu lsl', district: '浦东', lat: 31.1536, lng: 121.5924, lines: ['11', '16'] },
  { id: 'kangxin_gonglu', name: '康新公路', pinyin: 'kangxingonglu kxgl', district: '浦东', lat: 31.1310, lng: 121.6163, lines: ['11'] },
  { id: 'disney', name: '迪士尼', pinyin: 'dishini dsn', district: '浦东', lat: 31.1413, lng: 121.6675, lines: ['11'] },

  // 12号线（七莘路-陕西南路-金海路）
  { id: 'qixin_lu', name: '七莘路', pinyin: 'qixinlu qxl', district: '闵行', lat: 31.1315, lng: 121.3622, lines: ['12'] },
  { id: 'guilin_gongyuan', name: '桂林公园', pinyin: 'guilingongyuan glgy', district: '徐汇', lat: 31.1665, lng: 121.4184, lines: ['12', '15'] },
  { id: 'jiashan_lu', name: '嘉善路', pinyin: 'jiashanlu jsl', district: '徐汇', lat: 31.2027, lng: 121.4609, lines: ['9', '12'] },
  { id: 'jinhai_lu', name: '金海路', pinyin: 'jinhailu jhl', district: '浦东', lat: 31.2633, lng: 121.6384, lines: ['9', '12'] },

  // 13号线（金运路-长寿路-张江路）
  { id: 'jinyun_lu', name: '金运路', pinyin: 'jinyunlu jyl', district: '嘉定', lat: 31.2414, lng: 121.3193, lines: ['13'] },
  { id: 'huaihai_zhonglu', name: '淮海中路', pinyin: 'huaihaizhonglu hhzl', district: '黄浦', lat: 31.2202, lng: 121.4646, lines: ['13'] },
  { id: 'chengshan_lu', name: '成山路', pinyin: 'chengshanlu csl', district: '浦东', lat: 31.1705, lng: 121.4959, lines: ['8', '13'] },
  { id: 'dongming_lu', name: '东明路', pinyin: 'dongminglu dml', district: '浦东', lat: 31.1725, lng: 121.5108, lines: ['6', '13'] },
  { id: 'zhongke_lu', name: '中科路', pinyin: 'zhongkelu zkl', district: '浦东', lat: 31.1773, lng: 121.5924, lines: ['13'] },
  { id: 'zhangjiang_lu', name: '张江路', pinyin: 'zhangjianglu zjl', district: '浦东', lat: 31.1731, lng: 121.6227, lines: ['13'] },

  // 14号线（封浜-静安寺-陆家嘴-桂桥路）
  { id: 'fengbang', name: '封浜', pinyin: 'fengbang fb', district: '嘉定', lat: 31.2673, lng: 121.3150, lines: ['14'] },
  { id: 'yunshan_lu', name: '云山路', pinyin: 'yunshanlu ysl', district: '浦东', lat: 31.2496, lng: 121.5732, lines: ['6', '14'] },
  { id: 'guiqiao_lu', name: '桂桥路', pinyin: 'guiqiaolu gql', district: '浦东', lat: 31.2504, lng: 121.6177, lines: ['14'] },

  // 15号线（顾村公园-上海西站-上海南站-紫竹高新区）
  { id: 'shanghai_west', name: '上海西站', pinyin: 'shanghaixizhan shxz', district: '普陀', lat: 31.2627, lng: 121.4027, lines: ['11', '15'] },
  { id: 'daduhe_lu', name: '大渡河路', pinyin: 'daduhelu ddhl', district: '普陀', lat: 31.2319, lng: 121.3941, lines: ['13', '15'] },
  { id: 'zizhu_gaoxin', name: '紫竹高新区', pinyin: 'zizhugaoxinqu zzgxq', district: '闵行', lat: 31.0235, lng: 121.4480, lines: ['15'] },

  // 16号线（龙阳路-临港滴水湖）
  { id: 'zhoupu_dong', name: '周浦东', pinyin: 'zhoupudong zpd', district: '浦东', lat: 31.1066, lng: 121.6087, lines: ['16'] },
  { id: 'xinchang', name: '新场', pinyin: 'xinchang xc', district: '浦东', lat: 31.0457, lng: 121.6487, lines: ['16'] },
  { id: 'huinan', name: '惠南', pinyin: 'huinan hn', district: '浦东', lat: 31.0539, lng: 121.7618, lines: ['16'] },
  { id: 'lingang_dadao', name: '临港大道', pinyin: 'lingangdadao lgdd', district: '浦东', lat: 30.9234, lng: 121.9114, lines: ['16'] },
  { id: 'dishui_hu', name: '滴水湖', pinyin: 'dishuihu dsh', district: '浦东', lat: 30.9073, lng: 121.9301, lines: ['16'] },

  // 17号线（虹桥火车站-青浦新城-东方绿舟）
  { id: 'xuying_lu', name: '徐盈路', pinyin: 'xuyinglu xyl', district: '青浦', lat: 31.1726, lng: 121.2584, lines: ['17'] },
  { id: 'qingpu_xincheng', name: '青浦新城', pinyin: 'qingpuxincheng qpxc', district: '青浦', lat: 31.1586, lng: 121.1322, lines: ['17'] },
  { id: 'zhujiajiao', name: '朱家角', pinyin: 'zhujiajiao zjj', district: '青浦', lat: 31.1021, lng: 121.0581, lines: ['17'] },
  { id: 'dongfang_lvzhou', name: '东方绿舟', pinyin: 'dongfanglvzhou dflz', district: '青浦', lat: 31.0977, lng: 121.0088, lines: ['17'] },

  // 18号线（长江南路-龙阳路-航头）
  { id: 'changjiang_nanlu', name: '长江南路', pinyin: 'changjiangnanlu cjnl', district: '宝山', lat: 31.3316, lng: 121.4912, lines: ['3', '18'] },
  { id: 'fudan_univ', name: '复旦大学', pinyin: 'fudandaxue fddx', district: '杨浦', lat: 31.2966, lng: 121.5037, lines: ['18'] },
  { id: 'changyi_lu', name: '昌邑路', pinyin: 'changyilu cyl', district: '浦东', lat: 31.2435, lng: 121.5396, lines: ['14', '18'] },
  { id: 'beizhong_lu', name: '北中路', pinyin: 'beizhonglu bzl', district: '浦东', lat: 31.1786, lng: 121.5472, lines: ['18'] },
  { id: 'zhoupu', name: '周浦', pinyin: 'zhoupu zp', district: '浦东', lat: 31.1135, lng: 121.5698, lines: ['18'] },
  { id: 'hangtou', name: '航头', pinyin: 'hangtou ht', district: '浦东', lat: 31.0457, lng: 121.5778, lines: ['18'] },

  // 浦江线
  { id: 'huizhen_lu', name: '汇臻路', pinyin: 'huizhenlu hzl', district: '闵行', lat: 31.0282, lng: 121.5191, lines: ['PJ'] },
];

// 无向区间里程边（基于上海地铁官方里程校准）
export const METRO_EDGES: MetroEdge[] = [
  // 1号线
  { from: 'fujinlu', to: 'gongfu_xincun', line: '1', distanceKm: 4.3 },
  { from: 'gongfu_xincun', to: 'gongkanglu', line: '1', distanceKm: 4.2 },
  { from: 'gongkanglu', to: 'pengpu_xincun', line: '1', distanceKm: 1.4 },
  { from: 'pengpu_xincun', to: 'shanghai_circus', line: '1', distanceKm: 3.1 },
  { from: 'shanghai_circus', to: 'shanghai_railway', line: '1', distanceKm: 3.6 },
  { from: 'shanghai_railway', to: 'hanzhonglu', line: '1', distanceKm: 0.9 },
  { from: 'hanzhonglu', to: 'renmin_guangchang', line: '1', distanceKm: 2.1 },
  { from: 'renmin_guangchang', to: 'yidayizhi_huangpinan', line: '1', distanceKm: 1.2 },
  { from: 'yidayizhi_huangpinan', to: 'shanxi_nanlu', line: '1', distanceKm: 1.6 },
  { from: 'shanxi_nanlu', to: 'changshulu', line: '1', distanceKm: 0.9 },
  { from: 'changshulu', to: 'xujiahui', line: '1', distanceKm: 2.5 },
  { from: 'xujiahui', to: 'shanghai_stadium', line: '1', distanceKm: 1.4 },
  { from: 'shanghai_stadium', to: 'caobao_lu', line: '1', distanceKm: 1.6 },
  { from: 'caobao_lu', to: 'shanghai_south', line: '1', distanceKm: 1.7 },
  { from: 'shanghai_south', to: 'lianhualu', line: '1', distanceKm: 3.8 },
  { from: 'lianhualu', to: 'xinzhuang', line: '1', distanceKm: 2.7 },

  // 2号线
  { from: 'guojia_huizhan', to: 'hongqiao_railway', line: '2', distanceKm: 2.0 },
  { from: 'hongqiao_railway', to: 'hongqiao_t2', line: '2', distanceKm: 0.7 },
  { from: 'hongqiao_t2', to: 'songhonglu', line: '2', distanceKm: 4.1 },
  { from: 'songhonglu', to: 'zhongshan_park', line: '2', distanceKm: 5.8 },
  { from: 'zhongshan_park', to: 'jiangsu_lu', line: '2', distanceKm: 1.4 },
  { from: 'jiangsu_lu', to: 'jingan_temple', line: '2', distanceKm: 1.5 },
  { from: 'jingan_temple', to: 'nanjing_west', line: '2', distanceKm: 1.5 },
  { from: 'nanjing_west', to: 'renmin_guangchang', line: '2', distanceKm: 1.6 },
  { from: 'renmin_guangchang', to: 'nanjing_east', line: '2', distanceKm: 1.1 },
  { from: 'nanjing_east', to: 'lujiazui', line: '2', distanceKm: 1.7 },
  { from: 'lujiazui', to: 'shiji_dadao', line: '2', distanceKm: 2.6 },
  { from: 'shiji_dadao', to: 'longyang_lu', line: '2', distanceKm: 4.1 },
  { from: 'longyang_lu', to: 'zhangjiang_gaoke', line: '2', distanceKm: 2.9 },
  { from: 'zhangjiang_gaoke', to: 'guanglan_lu', line: '2', distanceKm: 3.4 },
  { from: 'guanglan_lu', to: 'tangzhen', line: '2', distanceKm: 3.4 },
  { from: 'tangzhen', to: 'chuansha', line: '2', distanceKm: 5.2 },
  { from: 'chuansha', to: 'pudong_airport', line: '2', distanceKm: 11.4 },

  // 3号线
  { from: 'baoyanglu', to: 'songbinlu', line: '3', distanceKm: 3.1 },
  { from: 'songbinlu', to: 'changjiang_nanlu', line: '3', distanceKm: 4.5 },
  { from: 'changjiang_nanlu', to: 'jiangwan_town', line: '3', distanceKm: 3.1 },
  { from: 'jiangwan_town', to: 'hongkou_football', line: '3', distanceKm: 3.9 },
  { from: 'hongkou_football', to: 'shanghai_railway', line: '3', distanceKm: 3.4 },
  { from: 'shanghai_railway', to: 'zhenping_lu', line: '3', distanceKm: 2.6 },
  { from: 'zhenping_lu', to: 'caoyang_lu', line: '3', distanceKm: 1.6 },
  { from: 'caoyang_lu', to: 'jinshajiang_lu', line: '3', distanceKm: 0.9 },
  { from: 'jinshajiang_lu', to: 'zhongshan_park', line: '3', distanceKm: 1.7 },
  { from: 'zhongshan_park', to: 'hongqiao_lu', line: '3', distanceKm: 2.4 },
  { from: 'hongqiao_lu', to: 'yishan_lu', line: '3', distanceKm: 1.4 },
  { from: 'yishan_lu', to: 'shanghai_south', line: '3', distanceKm: 3.6 },

  // 4号线
  { from: 'shanghai_railway', to: 'zhenping_lu', line: '4', distanceKm: 2.6 },
  { from: 'zhenping_lu', to: 'caoyang_lu', line: '4', distanceKm: 1.6 },
  { from: 'caoyang_lu', to: 'jinshajiang_lu', line: '4', distanceKm: 0.9 },
  { from: 'jinshajiang_lu', to: 'zhongshan_park', line: '4', distanceKm: 1.7 },
  { from: 'zhongshan_park', to: 'hongqiao_lu', line: '4', distanceKm: 2.4 },
  { from: 'hongqiao_lu', to: 'yishan_lu', line: '4', distanceKm: 1.4 },
  { from: 'yishan_lu', to: 'shanghai_stadium', line: '4', distanceKm: 1.0 },
  { from: 'shanghai_stadium', to: 'dapu_qiao', line: '4', distanceKm: 3.0 },
  { from: 'dapu_qiao', to: 'xizang_nanlu', line: '4', distanceKm: 2.6 },
  { from: 'xizang_nanlu', to: 'lujiazui_tangqiao', line: '4', distanceKm: 3.0 },
  { from: 'lujiazui_tangqiao', to: 'lancun_lu', line: '4', distanceKm: 0.9 },
  { from: 'lancun_lu', to: 'shiji_dadao', line: '4', distanceKm: 2.0 },
  { from: 'shiji_dadao', to: 'dalian_lu', line: '4', distanceKm: 3.7 },
  { from: 'dalian_lu', to: 'shanghai_railway', line: '4', distanceKm: 5.5 },

  // 5号线
  { from: 'xinzhuang', to: 'zhuanqiao', line: '5', distanceKm: 5.3 },
  { from: 'zhuanqiao', to: 'jianchuan_lu', line: '5', distanceKm: 4.7 },
  { from: 'jianchuan_lu', to: 'dongchuan_lu', line: '5', distanceKm: 1.0 },
  { from: 'dongchuan_lu', to: 'minhang_kaifaqu', line: '5', distanceKm: 5.2 },
  { from: 'dongchuan_lu', to: 'fengxian_xincheng', line: '5', distanceKm: 13.5 },

  // 6号线
  { from: 'gangcheng_lu', to: 'jufeng_lu', line: '6', distanceKm: 8.4 },
  { from: 'jufeng_lu', to: 'jinqiao_lu', line: '6', distanceKm: 2.1 },
  { from: 'jinqiao_lu', to: 'yunshan_lu', line: '6', distanceKm: 1.7 },
  { from: 'yunshan_lu', to: 'yuanshen_tiyu', line: '6', distanceKm: 4.2 },
  { from: 'yuanshen_tiyu', to: 'shiji_dadao', line: '6', distanceKm: 0.9 },
  { from: 'shiji_dadao', to: 'lancun_lu', line: '6', distanceKm: 2.0 },
  { from: 'lancun_lu', to: 'gaoke_xilu', line: '6', distanceKm: 3.4 },
  { from: 'gaoke_xilu', to: 'dongming_lu', line: '6', distanceKm: 1.5 },
  { from: 'dongming_lu', to: 'dongfang_tiyu', line: '6', distanceKm: 3.6 },

  // 7号线
  { from: 'meilanhu', to: 'gucun_gongyuan', line: '7', distanceKm: 6.8 },
  { from: 'gucun_gongyuan', to: 'shangda_lu', line: '7', distanceKm: 4.7 },
  { from: 'shangda_lu', to: 'dachang_zhen', line: '7', distanceKm: 2.7 },
  { from: 'dachang_zhen', to: 'zhenping_lu', line: '7', distanceKm: 5.4 },
  { from: 'zhenping_lu', to: 'changshou_lu', line: '7', distanceKm: 0.9 },
  { from: 'changshou_lu', to: 'jingan_temple', line: '7', distanceKm: 2.1 },
  { from: 'jingan_temple', to: 'changshulu', line: '7', distanceKm: 1.1 },
  { from: 'changshulu', to: 'zhaojiabang_lu', line: '7', distanceKm: 1.6 },
  { from: 'zhaojiabang_lu', to: 'dapu_qiao', line: '7', distanceKm: 1.5 },
  { from: 'dapu_qiao', to: 'yaohua_lu', line: '7', distanceKm: 3.4 },
  { from: 'yaohua_lu', to: 'gaoke_xilu', line: '7', distanceKm: 1.7 },
  { from: 'gaoke_xilu', to: 'longyang_lu', line: '7', distanceKm: 5.0 },
  { from: 'longyang_lu', to: 'huamu_lu', line: '7', distanceKm: 1.8 },

  // 8号线
  { from: 'shiguang_lu', to: 'wujiaochang_8', line: '8', distanceKm: 3.3 },
  { from: 'wujiaochang_8', to: 'siping_lu', line: '8', distanceKm: 3.7 },
  { from: 'siping_lu', to: 'hongkou_football', line: '8', distanceKm: 2.1 },
  { from: 'hongkou_football', to: 'renmin_guangchang', line: '8', distanceKm: 4.3 },
  { from: 'renmin_guangchang', to: 'laoximen', line: '8', distanceKm: 1.8 },
  { from: 'laoximen', to: 'lujiabang_lu', line: '8', distanceKm: 0.8 },
  { from: 'lujiabang_lu', to: 'xizang_nanlu', line: '8', distanceKm: 1.2 },
  { from: 'xizang_nanlu', to: 'yaohua_lu', line: '8', distanceKm: 2.7 },
  { from: 'yaohua_lu', to: 'chengshan_lu', line: '8', distanceKm: 0.9 },
  { from: 'chengshan_lu', to: 'dongfang_tiyu', line: '8', distanceKm: 2.4 },
  { from: 'dongfang_tiyu', to: 'pujiang_zhen', line: '8', distanceKm: 6.9 },
  { from: 'pujiang_zhen', to: 'shendu_gonglu', line: '8', distanceKm: 4.1 },

  // 9号线
  { from: 'songjiang_nan', to: 'songjiang_daxuecheng', line: '9', distanceKm: 7.7 },
  { from: 'songjiang_daxuecheng', to: 'sijing', line: '9', distanceKm: 7.8 },
  { from: 'sijing', to: 'jiuting', line: '9', distanceKm: 5.9 },
  { from: 'jiuting', to: 'qibao', line: '9', distanceKm: 3.5 },
  { from: 'qibao', to: 'caoyang_hejing', line: '9', distanceKm: 4.9 },
  { from: 'caoyang_hejing', to: 'yishan_lu', line: '9', distanceKm: 3.4 },
  { from: 'yishan_lu', to: 'xujiahui', line: '9', distanceKm: 1.3 },
  { from: 'xujiahui', to: 'zhaojiabang_lu', line: '9', distanceKm: 1.3 },
  { from: 'zhaojiabang_lu', to: 'jiashan_lu', line: '9', distanceKm: 1.1 },
  { from: 'jiashan_lu', to: 'dapuqiao_9', line: '9', distanceKm: 0.9 },
  { from: 'dapuqiao_9', to: 'madang_lu', line: '9', distanceKm: 0.9 },
  { from: 'madang_lu', to: 'lujiabang_lu', line: '9', distanceKm: 1.0 },
  { from: 'lujiabang_lu', to: 'shiji_dadao', line: '9', distanceKm: 4.4 },
  { from: 'shiji_dadao', to: 'yanggao_zhonglu', line: '9', distanceKm: 2.1 },
  { from: 'yanggao_zhonglu', to: 'jinqiao_9', line: '9', distanceKm: 6.6 },
  { from: 'jinqiao_9', to: 'jinhai_lu', line: '9', distanceKm: 2.9 },
  { from: 'jinhai_lu', to: 'caolu', line: '9', distanceKm: 1.9 },

  // 10号线
  { from: 'hongqiao_railway', to: 'hongqiao_t2', line: '10', distanceKm: 0.7 },
  { from: 'hongqiao_t2', to: 'longxi_lu', line: '10', distanceKm: 5.0 },
  { from: 'hangzhong_lu', to: 'longxi_lu', line: '10', distanceKm: 4.2 },
  { from: 'longxi_lu', to: 'hongqiao_lu', line: '10', distanceKm: 4.0 },
  { from: 'hongqiao_lu', to: 'jiaotong_univ', line: '10', distanceKm: 1.4 },
  { from: 'jiaotong_univ', to: 'shanxi_nanlu', line: '10', distanceKm: 2.7 },
  { from: 'shanxi_nanlu', to: 'xintiandi', line: '10', distanceKm: 1.6 },
  { from: 'xintiandi', to: 'laoximen', line: '10', distanceKm: 0.9 },
  { from: 'laoximen', to: 'nanjing_east', line: '10', distanceKm: 2.2 },
  { from: 'nanjing_east', to: 'tiantong_lu', line: '10', distanceKm: 0.7 },
  { from: 'tiantong_lu', to: 'siping_lu', line: '10', distanceKm: 3.9 },
  { from: 'siping_lu', to: 'wujiaochang', line: '10', distanceKm: 3.1 },
  { from: 'wujiaochang', to: 'xinjiangwancheng', line: '10', distanceKm: 3.2 },
  { from: 'xinjiangwancheng', to: 'gangcheng_lu', line: '10', distanceKm: 7.1 },

  // 11号线
  { from: 'jiading_bei', to: 'jiading_xincheng', line: '11', distanceKm: 7.0 },
  { from: 'anting', to: 'jiading_xincheng', line: '11', distanceKm: 10.0 },
  { from: 'jiading_xincheng', to: 'nanxiang', line: '11', distanceKm: 7.5 },
  { from: 'nanxiang', to: 'shanghai_west', line: '11', distanceKm: 8.6 },
  { from: 'shanghai_west', to: 'zhenru', line: '11', distanceKm: 1.4 },
  { from: 'zhenru', to: 'caoyang_lu', line: '11', distanceKm: 1.7 },
  { from: 'caoyang_lu', to: 'jiangsu_lu', line: '11', distanceKm: 2.3 },
  { from: 'jiangsu_lu', to: 'jiaotong_univ', line: '11', distanceKm: 2.1 },
  { from: 'jiaotong_univ', to: 'xujiahui', line: '11', distanceKm: 0.8 },
  { from: 'xujiahui', to: 'longhua', line: '11', distanceKm: 3.0 },
  { from: 'longhua', to: 'dongfang_tiyu', line: '11', distanceKm: 3.4 },
  { from: 'dongfang_tiyu', to: 'sanlin', line: '11', distanceKm: 3.2 },
  { from: 'sanlin', to: 'luoshan_lu', line: '11', distanceKm: 7.8 },
  { from: 'luoshan_lu', to: 'kangxin_gonglu', line: '11', distanceKm: 3.4 },
  { from: 'kangxin_gonglu', to: 'disney', line: '11', distanceKm: 5.0 },

  // 12号线
  { from: 'qixin_lu', to: 'guilin_gongyuan', line: '12', distanceKm: 6.6 },
  { from: 'guilin_gongyuan', to: 'caobao_lu', line: '12', distanceKm: 1.5 },
  { from: 'caobao_lu', to: 'longhua', line: '12', distanceKm: 1.9 },
  { from: 'longhua', to: 'dapu_qiao', line: '12', distanceKm: 2.6 },
  { from: 'dapu_qiao', to: 'jiashan_lu', line: '12', distanceKm: 1.0 },
  { from: 'jiashan_lu', to: 'shanxi_nanlu', line: '12', distanceKm: 1.4 },
  { from: 'shanxi_nanlu', to: 'nanjing_west', line: '12', distanceKm: 1.6 },
  { from: 'nanjing_west', to: 'hanzhonglu', line: '12', distanceKm: 1.3 },
  { from: 'hanzhonglu', to: 'tiantong_lu', line: '12', distanceKm: 2.2 },
  { from: 'tiantong_lu', to: 'dalian_lu', line: '12', distanceKm: 3.3 },
  { from: 'dalian_lu', to: 'jufeng_lu', line: '12', distanceKm: 7.7 },
  { from: 'jufeng_lu', to: 'jinhai_lu', line: '12', distanceKm: 5.2 },

  // 13号线
  { from: 'jinyun_lu', to: 'daduhe_lu', line: '13', distanceKm: 7.2 },
  { from: 'daduhe_lu', to: 'jinshajiang_lu', line: '13', distanceKm: 1.8 },
  { from: 'jinshajiang_lu', to: 'changshou_lu', line: '13', distanceKm: 2.6 },
  { from: 'changshou_lu', to: 'hanzhonglu', line: '13', distanceKm: 2.0 },
  { from: 'hanzhonglu', to: 'nanjing_west', line: '13', distanceKm: 1.3 },
  { from: 'nanjing_west', to: 'huaihai_zhonglu', line: '13', distanceKm: 1.2 },
  { from: 'huaihai_zhonglu', to: 'xintiandi', line: '13', distanceKm: 1.1 },
  { from: 'xintiandi', to: 'madang_lu', line: '13', distanceKm: 0.8 },
  { from: 'madang_lu', to: 'chengshan_lu', line: '13', distanceKm: 4.7 },
  { from: 'chengshan_lu', to: 'dongming_lu', line: '13', distanceKm: 1.4 },
  { from: 'dongming_lu', to: 'zhongke_lu', line: '13', distanceKm: 7.8 },
  { from: 'zhongke_lu', to: 'zhangjiang_lu', line: '13', distanceKm: 2.9 },

  // 14号线
  { from: 'fengbang', to: 'zhenru', line: '14', distanceKm: 8.9 },
  { from: 'zhenru', to: 'caoyang_lu', line: '14', distanceKm: 1.7 },
  { from: 'caoyang_lu', to: 'jingan_temple', line: '14', distanceKm: 3.2 },
  { from: 'jingan_temple', to: 'yidayizhi_huangpinan', line: '14', distanceKm: 2.6 },
  { from: 'yidayizhi_huangpinan', to: 'lujiazui', line: '14', distanceKm: 3.3 },
  { from: 'lujiazui', to: 'changyi_lu', line: '14', distanceKm: 3.6 },
  { from: 'changyi_lu', to: 'yunshan_lu', line: '14', distanceKm: 3.3 },
  { from: 'yunshan_lu', to: 'guiqiao_lu', line: '14', distanceKm: 4.2 },

  // 15号线
  { from: 'gucun_gongyuan', to: 'shanghai_west', line: '15', distanceKm: 9.5 },
  { from: 'shanghai_west', to: 'daduhe_lu', line: '15', distanceKm: 3.5 },
  { from: 'daduhe_lu', to: 'guilin_gongyuan', line: '15', distanceKm: 7.6 },
  { from: 'guilin_gongyuan', to: 'shanghai_south', line: '15', distanceKm: 1.7 },
  { from: 'shanghai_south', to: 'zizhu_gaoxin', line: '15', distanceKm: 14.7 },

  // 16号线
  { from: 'longyang_lu', to: 'luoshan_lu', line: '16', distanceKm: 6.5 },
  { from: 'luoshan_lu', to: 'zhoupu_dong', line: '16', distanceKm: 5.5 },
  { from: 'zhoupu_dong', to: 'xinchang', line: '16', distanceKm: 7.8 },
  { from: 'xinchang', to: 'huinan', line: '16', distanceKm: 10.8 },
  { from: 'huinan', to: 'lingang_dadao', line: '16', distanceKm: 20.4 },
  { from: 'lingang_dadao', to: 'dishui_hu', line: '16', distanceKm: 2.5 },

  // 17号线
  { from: 'hongqiao_railway', to: 'guojia_huizhan', line: '17', distanceKm: 2.0 },
  { from: 'guojia_huizhan', to: 'xuying_lu', line: '17', distanceKm: 4.6 },
  { from: 'xuying_lu', to: 'qingpu_xincheng', line: '17', distanceKm: 12.1 },
  { from: 'qingpu_xincheng', to: 'zhujiajiao', line: '17', distanceKm: 9.4 },
  { from: 'zhujiajiao', to: 'dongfang_lvzhou', line: '17', distanceKm: 4.7 },

  // 18号线
  { from: 'changjiang_nanlu', to: 'fudan_univ', line: '18', distanceKm: 4.1 },
  { from: 'fudan_univ', to: 'changyi_lu', line: '18', distanceKm: 6.8 },
  { from: 'changyi_lu', to: 'yanggao_zhonglu', line: '18', distanceKm: 2.0 },
  { from: 'yanggao_zhonglu', to: 'longyang_lu', line: '18', distanceKm: 2.8 },
  { from: 'longyang_lu', to: 'beizhong_lu', line: '18', distanceKm: 2.9 },
  { from: 'beizhong_lu', to: 'zhoupu', line: '18', distanceKm: 7.5 },
  { from: 'zhoupu', to: 'hangtou', line: '18', distanceKm: 7.6 },

  // 浦江线
  { from: 'shendu_gonglu', to: 'huizhen_lu', line: 'PJ', distanceKm: 6.7 },
];

export const COMMUTE_PRESETS: CommutePreset[] = [
  {
    id: 'xinzhuang-rmgc',
    label: '莘庄 → 人民广场',
    fromId: 'xinzhuang',
    toId: 'renmin_guangchang',
    note: '1号线典型近郊通勤 · 约19km',
  },
  {
    id: 'jiuting-ljz',
    label: '九亭 → 陆家嘴',
    fromId: 'jiuting',
    toId: 'lujiazui',
    note: '9换2跨江通勤 · 约25km',
  },
  {
    id: 'sjdxc-xjh',
    label: '松江大学城 → 徐家汇',
    fromId: 'songjiang_daxuecheng',
    toId: 'xujiahui',
    note: '9号线远郊直达 · 约31km',
  },
  {
    id: 'jdb-jas',
    label: '嘉定北 → 静安寺',
    fromId: 'jiading_bei',
    toId: 'jingan_temple',
    note: '11换2西北通勤 · 约28km',
  },
  {
    id: 'dsh-sjdd',
    label: '滴水湖 → 世纪大道',
    fromId: 'dishui_hu',
    toId: 'shiji_dadao',
    note: '16换2临港超长通勤 · 约64km',
  },
  {
    id: 'gucun-njxl',
    label: '顾村公园 → 南京西路',
    fromId: 'gucun_gongyuan',
    toId: 'nanjing_west',
    note: '7换2宝山通勤 · 约17km',
  },
];
