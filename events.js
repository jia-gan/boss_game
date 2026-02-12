// ==========================================
// BOSS大冒险 - 事件池
// 基于《原则》达利欧管理思想设计评分标准
// ==========================================

const EMPLOYEES = [
  {
    id: 'qian', name: '钱多多', title: '财务总监', emoji: '💰',
    personality: '抠门保守型', loyalty: 70, ability: 75,
    style: '能省则省，花钱就是犯罪', color: '#FFD700'
  },
  {
    id: 'zhang', name: '张大炮', title: '市场总监', emoji: '📢',
    personality: '激进冒险型', loyalty: 65, ability: 70,
    style: '搞大新闻才是王道', color: '#FF6B6B'
  },
  {
    id: 'lin', name: '林小默', title: '技术总监', emoji: '💻',
    personality: '社恐天才型', loyalty: 80, ability: 90,
    style: '那个...代码不会说谎...', color: '#6BCB77'
  },
  {
    id: 'wang', name: '王美丽', title: 'HR总监', emoji: '💅',
    personality: '八面玲珑型', loyalty: 60, ability: 65,
    style: '我听说了一些事情...', color: '#FF69B4'
  },
  {
    id: 'zhao', name: '赵铁柱', title: '运营总监', emoji: '🔧',
    personality: '老实执行型', loyalty: 85, ability: 60,
    style: '老板你说怎么办就怎么办', color: '#4ECDC4'
  },
  {
    id: 'chen', name: '陈画饼', title: '战略总监', emoji: '🎨',
    personality: 'PPT大师型', loyalty: 55, ability: 50,
    style: '这恰恰是我们弯道超车的机会！', color: '#A78BFA'
  }
];

// 达利欧六维原则：
// transparency - 极度透明    talent - 人才匹配
// machine      - 系统思维    meritocracy - 创意择优
// pain         - 拥抱痛苦    legacy - 传承进化

const EVENTS = [
  // ============ 危机事件 (12个) ============
  {
    id: 'E001', type: 'crisis',
    title: 'CTO深夜开源了核心代码',
    description: '林小默凌晨3点把公司核心算法推到了GitHub公开仓库，还发了条推特："代码应该属于全人类。"现在已经有200个star了。',
    reporter: 'lin',
    choices: [
      {
        text: '立刻删库，发律师函警告',
        effects: { funds: -5, morale: -10, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: -2, talent: -1, machine: 0, meritocracy: -1, pain: 0, legacy: 0 },
        message: '代码是删了，但林小默在工位上沉默了三天。GitHub社区骂你是"开源公敌"。'
      },
      {
        text: '将计就计，宣布拥抱开源战略',
        effects: { funds: -10, morale: +10, reputation: +15, tech: +5, connections: +10 },
        principles: { transparency: +2, talent: +1, machine: +1, meritocracy: +1, pain: +1, legacy: +1 },
        message: '你召开全员大会宣布开源战略。林小默热泪盈眶，外部开发者蜂拥而至。虽然短期亏了，但口碑炸了。'
      },
      {
        text: '找林小默谈话，了解真实原因',
        effects: { funds: 0, morale: +5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: +2, machine: +1, meritocracy: +1, pain: +2, legacy: 0 },
        message: '林小默说他觉得公司技术方向有问题，但每次提意见都被忽视。你意识到这是沟通机制的问题。',
        chain: { eventId: 'E001_CHAIN', delay: 3 }
      }
    ]
  },
  {
    id: 'E001_CHAIN', type: 'crisis', isChain: true,
    title: '开源事件的后续风波',
    description: '上次林小默开源代码的事在技术圈传开了。现在有两家竞争对手fork了你们的代码，但同时也有三个顶级开发者想加入你们。',
    reporter: 'wang',
    choices: [
      {
        text: '趁机招揽人才，扩充技术团队',
        effects: { funds: -15, morale: +5, reputation: +5, tech: +15, connections: +5 },
        principles: { transparency: +1, talent: +2, machine: 0, meritocracy: +1, pain: 0, legacy: +1 },
        message: '三位大佬入职。虽然工资开得不低，但技术实力直接翻倍。'
      },
      {
        text: '起诉竞争对手，同时婉拒外部开发者',
        effects: { funds: -10, morale: -5, reputation: -10, tech: 0, connections: -10 },
        principles: { transparency: -2, talent: -1, machine: -1, meritocracy: -1, pain: -1, legacy: -1 },
        message: '官司打了半年没结果。那三个开发者去了竞对，还在网上说你格局小。'
      }
    ]
  },
  {
    id: 'E002', type: 'crisis',
    title: '竞争对手挖走了整个前端团队',
    description: '张大炮冲进你办公室：\'老板！对面那家公司用1.5倍工资把我们8个前端全挖走了！现在只剩一个试用期的实习生！\'',
    reporter: 'zhang',
    choices: [
      {
        text: '加价反挖！开2倍工资抢回来',
        effects: { funds: -25, morale: +5, reputation: 0, tech: +5, connections: -5 },
        principles: { transparency: 0, talent: -1, machine: -1, meritocracy: 0, pain: -1, legacy: 0 },
        message: '抢回来4个人，但工资开了天价。其他部门开始眼红，钱多多气得直拍桌子。',
        chain: { eventId: 'E002_CHAIN', delay: 2 }
      },
      {
        text: '不挽留，重新招一批更好的',
        effects: { funds: -10, morale: -10, reputation: 0, tech: -10, connections: 0 },
        principles: { transparency: +1, talent: +2, machine: +1, meritocracy: +1, pain: +2, legacy: +1 },
        message: '短期阵痛，但你趁机重新定义了前端团队的能力标准。新招的人虽然到位慢，但个个是精英。'
      },
      {
        text: '让实习生当前端负责人，赌一把',
        effects: { funds: +1, morale: -5, reputation: 0, tech: -15, connections: 0 },
        principles: { transparency: 0, talent: -2, machine: -1, meritocracy: -1, pain: 0, legacy: 0 },
        message: '实习生小王压力山大，连续加班一个月。产品质量断崖式下跌，用户开始投诉。'
      }
    ]
  },
  {
    id: 'E002_CHAIN', type: 'crisis', isChain: true,
    title: '其他部门要求同等加薪',
    description: '钱多多拿着一叠加薪申请冲进来：\'老板，前端加薪的消息传开了，现在后端、设计、测试全都要求同等待遇。公司扛不住！\'',
    reporter: 'qian',
    choices: [
      {
        text: '全员普调10%，一碗水端平',
        effects: { funds: -20, morale: +15, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: -1, machine: -1, meritocracy: -2, pain: -1, legacy: 0 },
        message: '大家暂时满意了，但钱多多说按这个烧钱速度，公司还能撑8个月。而且真正的人才觉得没有被区分对待。'
      },
      {
        text: '建立透明的绩效评估体系，按能力调薪',
        effects: { funds: -10, morale: -5, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: +2, machine: +2, meritocracy: +2, pain: +1, legacy: +2 },
        message: '短期有人不满，但长期建立了公平的薪资体系。优秀的人加薪更多，摸鱼的人开始紧张。'
      }
    ]
  },
  {
    id: 'E003', type: 'crisis',
    title: '食堂阿姨辞职引发程序员暴动',
    description: '赵铁柱低着头汇报：\'老板，刘阿姨辞职了。就是那个会做红烧肉的刘阿姨。15个程序员联名签署了请愿书，说没有红烧肉就罢工。\'',
    reporter: 'zhao',
    choices: [
      {
        text: '三倍工资把刘阿姨请回来',
        effects: { funds: -5, morale: +15, reputation: 0, tech: +5, connections: 0 },
        principles: { transparency: 0, talent: +1, machine: -1, meritocracy: 0, pain: -1, legacy: 0 },
        message: '刘阿姨回来了！程序员欢呼雀跃，当天代码提交量翻倍。但你开始思考，公司的命运居然系于一碗红烧肉...'
      },
      {
        text: '取消食堂，改发餐补',
        effects: { funds: +1, morale: -15, reputation: 0, tech: -10, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: 0, meritocracy: 0, pain: 0, legacy: 0 },
        message: '程序员们点了一周外卖后集体拉肚子，病假率暴增300%。原来刘阿姨的红烧肉是生产力之源。'
      },
      {
        text: '了解刘阿姨辞职原因，解决根本问题',
        effects: { funds: -3, morale: +10, reputation: +5, tech: +5, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +2, meritocracy: +1, pain: +1, legacy: +1 },
        message: '原来刘阿姨是因为设备太旧、经费不足才走的。你更新了后勤预算体系，刘阿姨感动回归，还多开发了三个新菜。'
      }
    ]
  },
  {
    id: 'E004', type: 'crisis',
    title: '投资人突击视察，产品Demo还是PPT',
    description: '陈画饼满头大汗跑来：\'老板，投资人爸爸说明天要来看产品Demo！但是...我们的产品目前...还停留在PPT阶段...那个PPT倒是很精美。\'',
    reporter: 'chen',
    choices: [
      {
        text: '连夜赶工做个能跑的原型',
        effects: { funds: -5, morale: -10, reputation: 0, tech: +10, connections: +5 },
        principles: { transparency: 0, talent: +1, machine: +1, meritocracy: 0, pain: +2, legacy: 0 },
        message: '技术团队通宵达旦，搞出了一个勉强能演示的原型。投资人看了觉得"有潜力"。但林小默连续加班后请了三天病假。'
      },
      {
        text: '坦诚告诉投资人实际进度',
        effects: { funds: 0, morale: +5, reputation: +10, tech: 0, connections: -5 },
        principles: { transparency: +3, talent: 0, machine: +1, meritocracy: +1, pain: +2, legacy: +1 },
        message: '投资人愣了一下，然后说："至少你很诚实。"他没有追加投资，但说会持续关注。你在圈子里赢得了"实在人"的口碑。'
      },
      {
        text: '让陈画饼准备一场惊天大饼式演讲',
        effects: { funds: +7, morale: 0, reputation: -5, tech: -5, connections: +10 },
        principles: { transparency: -3, talent: -1, machine: -1, meritocracy: -1, pain: -2, legacy: -1 },
        message: '陈画饼不愧是PPT大师，投资人被忽悠得当场追加了投资。但三个月后要交付的东西...你心里发虚。',
        chain: { eventId: 'E004_CHAIN', delay: 4 }
      }
    ]
  },
  {
    id: 'E004_CHAIN', type: 'boss', isChain: true,
    title: '投资人发现被骗了',
    description: '投资人打来电话，声音冰冷：\'我们投的钱呢？说好的产品呢？三个月了，我只看到了更精美的PPT。给你一周时间，要么交货，要么退钱。\'',
    reporter: 'qian',
    choices: [
      {
        text: '全力冲刺交付，哪怕只是最小可用版本',
        effects: { funds: -10, morale: -15, reputation: 0, tech: +10, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: +1, meritocracy: 0, pain: +2, legacy: 0 },
        message: '全公司加班一周，交付了一个简陋但能用的版本。投资人勉强接受，但警告这是最后一次。'
      },
      {
        text: '坦诚道歉，提出详细的补救计划',
        effects: { funds: -5, morale: +5, reputation: +5, tech: 0, connections: -10 },
        principles: { transparency: +3, talent: 0, machine: +2, meritocracy: +1, pain: +3, legacy: +1 },
        message: '你当面道歉并展示了详细的里程碑计划。投资人虽然不满，但被你的诚意和计划打动。给了你两个月宽限期。'
      },
      {
        text: '找新投资人接盘，把老投资人的钱退了',
        effects: { funds: -20, morale: 0, reputation: -15, tech: 0, connections: -15 },
        principles: { transparency: -2, talent: 0, machine: -2, meritocracy: 0, pain: -2, legacy: -2 },
        message: '投资圈就这么大，消息传开了。你被打上了"不靠谱"的标签，后续融资难度指数级上升。'
      }
    ]
  },
  {
    id: 'E005', type: 'crisis',
    title: '有员工在厕所挖矿',
    description: '钱多多拿着电费账单浑身颤抖：\'老板！这个月电费暴涨300%！我查了监控，有人在厕所隔间里藏了6台矿机！而且...那个厕所现在热得像桑拿房。\'',
    reporter: 'qian',
    choices: [
      {
        text: '查出是谁，立即开除',
        effects: { funds: +1, morale: -10, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: +1, machine: +1, meritocracy: 0, pain: +1, legacy: 0 },
        message: '查出来是运维小刘。开除当天，其他偷偷挖矿的同事默默关掉了自己的设备。但有人觉得处罚太重，气氛有点微妙。'
      },
      {
        text: '不追究个人，但制定公司设备使用规范',
        effects: { funds: -3, morale: +5, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: +2, meritocracy: +1, pain: +1, legacy: +2 },
        message: '你发布了设备使用规范并公开了制定过程。矿机被没收，但没有人被开除。团队觉得你"讲道理"。'
      },
      {
        text: '公司入股，一起挖矿分红',
        effects: { funds: +7, morale: +10, reputation: -20, tech: -5, connections: -10 },
        principles: { transparency: -1, talent: -1, machine: -2, meritocracy: -1, pain: -2, legacy: -2 },
        message: '全公司挖矿狂欢了两周，直到被物业发现断了电，还上了本地新闻。投资人打来电话质问你在干什么。'
      }
    ]
  },
  {
    id: 'E006', type: 'crisis',
    title: '实习生把测试数据库推到了生产环境',
    description: '林小默用颤抖的声音说：\'那个...实习生小王...他执行了一条命令...生产数据库...被测试数据覆盖了...10万用户数据...没了。\'',
    reporter: 'lin',
    choices: [
      {
        text: '开除实习生，紧急恢复数据',
        effects: { funds: -10, morale: -15, reputation: -10, tech: -5, connections: 0 },
        principles: { transparency: -1, talent: -1, machine: -2, meritocracy: -1, pain: -1, legacy: -1 },
        message: '数据恢复了80%，但实习生小王是院长儿子。这下得罪人了。而且真正的问题是——为什么实习生能碰生产环境？'
      },
      {
        text: '先恢复数据，再复盘是流程问题还是人的问题',
        effects: { funds: -5, morale: +5, reputation: -5, tech: +10, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +3, meritocracy: +1, pain: +2, legacy: +2 },
        message: '你主持了公开复盘会。发现是权限管理有严重漏洞——不应该让实习生有生产环境权限。修复后系统安全性大幅提升。'
      },
      {
        text: '悄悄处理，对外宣称"系统升级维护"',
        effects: { funds: -5, morale: 0, reputation: +5, tech: -5, connections: 0 },
        principles: { transparency: -3, talent: 0, machine: -1, meritocracy: 0, pain: -2, legacy: -1 },
        message: '暂时糊弄过去了，但由于没有复盘根因，三个月后又发生了类似事故。这次是正式员工干的。'
      }
    ]
  },
  {
    id: 'E007', type: 'crisis',
    title: '核心客户威胁终止合同',
    description: '张大炮气急败坏：\'最大的客户——占我们收入40%的那个——说我们的交付质量太差，要终止合同！他们已经在和竞对谈了！\'',
    reporter: 'zhang',
    choices: [
      {
        text: '亲自飞过去道歉，承诺全面整改',
        effects: { funds: -10, morale: -5, reputation: +5, tech: 0, connections: +10 },
        principles: { transparency: +2, talent: 0, machine: +1, meritocracy: 0, pain: +2, legacy: 0 },
        message: '你的诚意打动了客户高层，合同续了。但他们要求季度审查，压力山大。'
      },
      {
        text: '降价30%挽留客户',
        effects: { funds: -20, morale: -5, reputation: -5, tech: 0, connections: +5 },
        principles: { transparency: 0, talent: 0, machine: -1, meritocracy: 0, pain: -1, legacy: -1 },
        message: '客户留下了，但利润率被压到了极限。钱多多说再这样下去，发工资都成问题。而且你的行业定价被拉低了。'
      },
      {
        text: '果断放弃，分散客户风险',
        effects: { funds: -15, morale: -10, reputation: 0, tech: 0, connections: -5 },
        principles: { transparency: +1, talent: 0, machine: +2, meritocracy: +1, pain: +3, legacy: +1 },
        message: '短期收入暴跌，全公司人心惶惶。但你用三个月开拓了5个新客户，再也没有单一客户超过15%的占比。'
      }
    ]
  },
  {
    id: 'E008', type: 'crisis',
    title: '公司被列入"最差雇主"榜单',
    description: '王美丽颤抖着递过手机：\'老板...脉脉上有个帖子"互联网最差雇主TOP10"...我们排第三...评论区已经2000多条了...全是前员工在吐槽。\'',
    reporter: 'wang',
    choices: [
      {
        text: '公开回应，承认问题并公布改进计划',
        effects: { funds: -5, morale: +10, reputation: +10, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: +1, machine: +1, meritocracy: +1, pain: +2, legacy: +1 },
        message: '你发了一篇长文《我们确实做得不够好》，列出具体改进措施。舆论反转，大家说"至少这个老板有态度"。'
      },
      {
        text: '找公关公司压热度，买水军控评',
        effects: { funds: -15, morale: -5, reputation: -10, tech: 0, connections: -5 },
        principles: { transparency: -3, talent: 0, machine: -2, meritocracy: -1, pain: -2, legacy: -2 },
        message: '水军痕迹被扒出来了，二次翻车。这次排名升到了"最差雇主"第一名。'
      },
      {
        text: '无视它，做好自己的事',
        effects: { funds: 0, morale: -10, reputation: -15, tech: 0, connections: -5 },
        principles: { transparency: -1, talent: 0, machine: -1, meritocracy: 0, pain: -1, legacy: 0 },
        message: '帖子持续发酵了一个月。候选人面试时第一句话就是"我看到了那个榜单..."。招聘难度直线上升。'
      }
    ]
  },
  {
    id: 'E009', type: 'crisis',
    title: 'HR总监和财务总监在会议室打起来了',
    description: '赵铁柱慌慌张张跑来：\'老板！王美丽和钱多多在会议室吵起来了！好像是因为年终奖方案！钱多多说没钱，王美丽说不发年终奖她没法跟员工交代！现在...他们开始扔文件了！\'',
    reporter: 'zhao',
    choices: [
      {
        text: '把两人叫到办公室，分别了解诉求',
        effects: { funds: 0, morale: +5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +1, meritocracy: +2, pain: +1, legacy: +1 },
        message: '你分别听取了双方意见，发现核心矛盾是信息不透明——王美丽不知道公司真实财务状况。你决定向管理层公开财务数据。'
      },
      {
        text: '各打五十大板，罚款警告',
        effects: { funds: +1, morale: -10, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: -1, talent: -1, machine: -1, meritocracy: -2, pain: -1, legacy: -1 },
        message: '两个人表面认了罚，但背地里都觉得委屈。王美丽开始消极怠工，钱多多变得更加独断。问题没解决，只是被压下去了。'
      },
      {
        text: '直接站钱多多那边，公司没钱就是没钱',
        effects: { funds: +1, morale: -15, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: -1, machine: 0, meritocracy: -2, pain: 0, legacy: -1 },
        message: '王美丽觉得自己被架空了，开始考虑跳槽。更糟的是，年终奖的事没人管了，员工怨声载道。'
      }
    ]
  },
  {
    id: 'E010', type: 'crisis',
    title: '年终奖方案泄露到了脉脉',
    description: '王美丽脸色发白：\'老板，年终奖方案被人截图发到脉脉了...员工们发现管理层年终奖是普通员工的20倍...评论区炸了。\'',
    reporter: 'wang',
    choices: [
      {
        text: '紧急召开全员大会，公开解释薪酬逻辑',
        effects: { funds: 0, morale: +5, reputation: +10, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: +1, machine: +1, meritocracy: +2, pain: +2, legacy: +1 },
        message: '你在大会上公开了薪酬结构设计的完整逻辑，包括管理层承担的风险和对赌协议。大部分员工表示理解，虽然不太开心。'
      },
      {
        text: '追查泄密者，杀鸡儆猴',
        effects: { funds: -5, morale: -20, reputation: -10, tech: 0, connections: -5 },
        principles: { transparency: -3, talent: -1, machine: -2, meritocracy: -2, pain: -2, legacy: -2 },
        message: '你让IT查聊天记录，搞得人人自危。三个人当月提了离职。脉脉上多了一条："这公司不允许说真话"。'
      },
      {
        text: '调整方案，缩小管理层和员工的差距',
        effects: { funds: -10, morale: +15, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: +1, meritocracy: +1, pain: +1, legacy: +1 },
        message: '管理层有人不满，但基层士气大涨。长期来看，薪酬公平性增强了公司凝聚力。'
      }
    ]
  },
  {
    id: 'E011', type: 'crisis',
    title: '核心技术人员被发现简历造假',
    description: '王美丽神秘地关上门：\'老板，我做背调发现了一件事——我们的高级架构师刘工，简历上说的清华硕士...是假的。他其实是专科毕业。但他确实是全公司技术最好的人。\'',
    reporter: 'wang',
    choices: [
      {
        text: '学历造假零容忍，立即开除',
        effects: { funds: 0, morale: -5, reputation: +5, tech: -20, connections: 0 },
        principles: { transparency: +1, talent: -1, machine: +1, meritocracy: -2, pain: +1, legacy: 0 },
        message: '刘工走后，三个项目同时陷入困境。但你向全公司传递了一个信号：诚信是底线。'
      },
      {
        text: '私下谈话，给他机会但降级观察',
        effects: { funds: 0, morale: 0, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: -1, talent: +1, machine: +1, meritocracy: +1, pain: +1, legacy: 0 },
        message: '刘工感激涕零，工作更加卖力。但你也建立了新规矩：以后看能力和成果，不看简历光环。'
      },
      {
        text: '公开此事，让团队讨论如何处理',
        effects: { funds: 0, morale: +5, reputation: +5, tech: -5, connections: 0 },
        principles: { transparency: +3, talent: +1, machine: +1, meritocracy: +3, pain: +2, legacy: +2 },
        message: '团队投票结果：8成人选择留下刘工但取消学历门槛。这次事件反而促成了"唯能力论"的文化转型。刘工主动道歉并决定自考本科。'
      }
    ]
  },
  // ============ 机遇事件 (4个) ============
  {
    id: 'E012', type: 'opportunity',
    title: '知名VC主动找上门',
    description: '陈画饼两眼放光冲进来：\'老板！有家顶级VC的人主动联系我们了！说要投2000万，但条件是...我们要在半年内用户量翻10倍。\'',
    reporter: 'chen',
    choices: [
      {
        text: '接受投资，全力冲增长',
        effects: { funds: +16, morale: +10, reputation: +10, tech: -5, connections: +15 },
        principles: { transparency: 0, talent: 0, machine: -1, meritocracy: 0, pain: -1, legacy: -1 },
        message: '钱到账了！全公司振奋。但10倍增长的KPI像一把悬在头顶的剑，大家开始为了数据不择手段。'
      },
      {
        text: '谈判修改条件，争取更合理的对赌',
        effects: { funds: +7, morale: +5, reputation: +5, tech: 0, connections: +10 },
        principles: { transparency: +2, talent: 0, machine: +2, meritocracy: +1, pain: +1, legacy: +1 },
        message: '经过三轮谈判，对赌改为用户量翻3倍。金额少了但条件合理多了。VC说"这个创始人有脑子"。'
      },
      {
        text: '感谢但拒绝，坚持自己的节奏',
        effects: { funds: 0, morale: 0, reputation: +5, tech: +5, connections: -5 },
        principles: { transparency: +1, talent: 0, machine: +1, meritocracy: +1, pain: +2, legacy: +2 },
        message: '团队有人失望，但你避免了资本绑架。你说"我们按自己的节奏来"。陈画饼哭了。'
      }
    ]
  },
  {
    id: 'E013', type: 'opportunity',
    title: '竞对核心技术人员想跳槽过来',
    description: '王美丽兴奋地说：\'老板！对面公司的技术VP想跳槽来我们这！他手里有对面公司下半年全部产品规划！但他开价很高，而且...带着竞业协议。\'',
    reporter: 'wang',
    choices: [
      {
        text: '高薪录用，竞业的事他自己搞定',
        effects: { funds: -15, morale: -5, reputation: -15, tech: +15, connections: -10 },
        principles: { transparency: -2, talent: -1, machine: -1, meritocracy: -1, pain: -1, legacy: -2 },
        message: '短期技术飞跃，但对方公司发了律师函。行业里都在说你"不讲武德"。'
      },
      {
        text: '等竞业期满再录用，先保持联系',
        effects: { funds: 0, morale: 0, reputation: +10, tech: +5, connections: +5 },
        principles: { transparency: +2, talent: +2, machine: +1, meritocracy: +1, pain: +1, legacy: +1 },
        message: '半年后竞业到期，他如约加入。虽然慢了半拍，但这份尊重让他死心塌地。行业里也说你"有底线"。'
      },
      {
        text: '拒绝，自己培养人才',
        effects: { funds: +1, morale: +10, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: +1, machine: +1, meritocracy: +2, pain: +1, legacy: +2 },
        message: '你在全员会上说"我们不靠挖人，靠自己成长"。林小默深受触动，开始着手建立内部培训体系。'
      }
    ]
  },
  {
    id: 'E014', type: 'opportunity',
    title: '政府数字化项目招标',
    description: '张大炮激动地拍桌子：\'老板！市政府数字化转型大项目招标！预算8000万！但需要我们三周内提交方案，而且...听说有人打招呼了。\'',
    reporter: 'zhang',
    choices: [
      {
        text: '全力以赴写标书，凭实力竞标',
        effects: { funds: -5, morale: +5, reputation: +10, tech: +5, connections: +5 },
        principles: { transparency: +2, talent: +1, machine: +1, meritocracy: +2, pain: +1, legacy: +1 },
        message: '标书写得很漂亮，虽然最后没中标，但你们的方案被评委单独表扬了。一个评委私下说下次有项目会优先考虑你们。'
      },
      {
        text: '找关系走后门，确保中标',
        effects: { funds: -20, morale: -5, reputation: -10, tech: 0, connections: +10 },
        principles: { transparency: -3, talent: 0, machine: -2, meritocracy: -3, pain: -2, legacy: -2 },
        message: '中标了！但花了大量"公关费"。项目利润被吃掉大半，而且你心里清楚这事有风险。'
      },
      {
        text: '评估后放弃，项目太大我们吃不下',
        effects: { funds: 0, morale: -5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: +2, meritocracy: 0, pain: +1, legacy: 0 },
        message: '张大炮很失望，但你冷静分析后发现以现有人力确实做不了。省下的精力做好了手头项目，客户满意度提升了。'
      }
    ]
  },
  {
    id: 'E015', type: 'opportunity',
    title: '有公司想收购你们',
    description: '钱多多表情复杂地说：\'老板，有家上市公司想收购我们，开价是当前估值的3倍。条件是你留任CEO两年，团队不变。\'',
    reporter: 'qian',
    choices: [
      {
        text: '接受收购，让团队都财务自由',
        effects: { funds: +13, morale: +10, reputation: 0, tech: -5, connections: +10 },
        principles: { transparency: +1, talent: 0, machine: 0, meritocracy: 0, pain: -1, legacy: +2 },
        message: '收购完成。早期员工都拿到了不错的回报。但你突然发现自己变成了"职业经理人"，上面还有个爹。'
      },
      {
        text: '拒绝收购，坚持独立发展',
        effects: { funds: 0, morale: +5, reputation: +10, tech: +5, connections: -5 },
        principles: { transparency: +1, talent: 0, machine: +1, meritocracy: +1, pain: +2, legacy: +1 },
        message: '部分员工失望（他们已经在看房了），但核心团队更加团结。你们在下一轮融资中拿到了更高估值。'
      },
      {
        text: '谈判提高价格到5倍',
        effects: { funds: 0, morale: 0, reputation: 0, tech: 0, connections: -10 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: 0 },
        message: '对方觉得你狮子大开口，直接撤回了offer。陈画饼安慰你说"我们值10倍"，但现实是市场环境在变差。'
      }
    ]
  },
  // ============ 日常事件 (3个) ============
  {
    id: 'E016', type: 'daily',
    title: '前台的仙人掌死了',
    description: '赵铁柱一脸凝重：\'老板，前台那盆仙人掌...死了。大家都说这是不祥之兆。有人在群里说"连仙人掌都养不活的公司..."\'',
    reporter: 'zhao',
    choices: [
      {
        text: '买一棵新的，再买一批绿植改善环境',
        effects: { funds: -3, morale: +10, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: 0 },
        message: '新绿植到位后办公室焕然一新。有人说"老板终于关心我们的工作环境了"。前台小姐姐主动承担了浇水任务。'
      },
      {
        text: '仙人掌都能死？调查一下办公环境',
        effects: { funds: -5, morale: +5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: +2, meritocracy: 0, pain: +1, legacy: 0 },
        message: '调查发现空调出风口正对仙人掌，顺便发现了甲醛超标的问题。你紧急安排了除甲醛处理，避免了更大隐患。'
      },
      {
        text: '不就是棵仙人掌嘛，别小题大做',
        effects: { funds: 0, morale: -5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: -1, meritocracy: 0, pain: -1, legacy: 0 },
        message: '大家嘴上不说什么，但朋友圈里多了一条"连仙人掌都保护不了的男人"的转发。小事不管，人心渐远。'
      }
    ]
  },
  {
    id: 'E017', type: 'daily',
    title: '员工请假理由：猫抑郁了',
    description: '王美丽无奈地递过一张请假单：\'老板，产品经理小李请假三天，理由是——他家猫抑郁了，需要陪伴。这是他这个月第二次以宠物为由请假了。\'',
    reporter: 'wang',
    choices: [
      {
        text: '批准，但找他聊聊真实情况',
        effects: { funds: 0, morale: +5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +1, meritocracy: +1, pain: +1, legacy: 0 },
        message: '聊完发现小李其实是自己有轻度抑郁。你安排了EAP心理咨询服务。小李感激不已，之后工作状态明显好转。'
      },
      {
        text: '不批准，公司不是宠物托管所',
        effects: { funds: 0, morale: -10, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: -1, machine: 0, meritocracy: 0, pain: -1, legacy: 0 },
        message: '小李来上班了，但整个人魂不守舍。一周后他提了离职，说"这公司没有人情味"。消息传到了求职论坛。'
      },
      {
        text: '制定明确的请假制度，统一标准',
        effects: { funds: 0, morale: 0, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: +2, meritocracy: +1, pain: 0, legacy: +2 },
        message: '你推出了弹性请假制度：每月3天自由假，不问理由。既保证了规范性，又给了员工空间。'
      }
    ]
  },
  {
    id: 'E018', type: 'daily',
    title: '有人用公司信用卡点了一个月外卖',
    description: '钱多多怒气冲冲：\'老板！有人用公司信用卡点了一个月的外卖，总共4268元！全是夜宵！烤串奶茶炸鸡一样不落！查了消费记录，嫌疑人锁定在技术部！\'',
    reporter: 'qian',
    choices: [
      {
        text: '查出是谁，让他全额偿还',
        effects: { funds: +1, morale: -5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: +1, meritocracy: 0, pain: +1, legacy: 0 },
        message: '查出是加班最多的后端工程师老张。他说"我天天加班到12点，公司连顿夜宵都不管？"你陷入了沉思。'
      },
      {
        text: '不追究了，但建立加班餐补制度',
        effects: { funds: -5, morale: +15, reputation: +5, tech: +5, connections: 0 },
        principles: { transparency: +1, talent: +1, machine: +2, meritocracy: +1, pain: +1, legacy: +2 },
        message: '你发布了"加班到9点以上公司报销晚餐"的政策。技术部的人眼眶红了，说"终于有人看到我们加班了"。'
      },
      {
        text: '取消所有公司信用卡权限',
        effects: { funds: +1, morale: -15, reputation: -5, tech: -5, connections: 0 },
        principles: { transparency: -1, talent: -1, machine: -1, meritocracy: -1, pain: -1, legacy: -1 },
        message: '一刀切的政策让所有人不满。正常的业务报销也变得无比麻烦。张大炮说请客户吃饭都要自己垫钱了。'
      }
    ]
  },
  // ============ BOSS级事件 (2个) ============
  {
    id: 'E019', type: 'boss',
    title: '经济寒冬来了',
    description: '陈画饼罕见地没有在画饼：\'老板，行业进入寒冬了。三家同行这个月倒闭了。我们的现金流还能撑6个月，但订单在急剧减少。所有人都在等你的决定。\'',
    reporter: 'chen',
    choices: [
      {
        text: '全员降薪30%，共渡难关',
        effects: { funds: +7, morale: -20, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: -1, machine: 0, meritocracy: 0, pain: +2, legacy: +1 },
        message: '你率先宣布自己降薪50%。大部分人接受了，但三个核心骨干选择了离职。寒冬中的忠诚，是最贵的奢侈品。'
      },
      {
        text: '精准裁员30%，保住核心团队',
        effects: { funds: +13, morale: -15, reputation: -10, tech: -5, connections: -5 },
        principles: { transparency: +1, talent: +1, machine: +1, meritocracy: +1, pain: +2, legacy: 0 },
        message: '裁员名单是你亲自定的，按能力和贡献排序。走的人骂你无情，留下的人惶恐但专注。公司变轻了，但战斗力反而提升了。'
      },
      {
        text: '逆势扩张！别人恐惧我贪婪',
        effects: { funds: -25, morale: +10, reputation: +10, tech: +10, connections: +10 },
        principles: { transparency: 0, talent: +1, machine: -1, meritocracy: 0, pain: +1, legacy: +1 },
        message: '你趁寒冬低价挖人、抢市场。团队士气高涨，但钱多多每天晚上失眠。这是一场豪赌——如果寒冬太长，你会第一个倒下。'
      },
      {
        text: '召开全员会议，公开数据让大家一起想办法',
        effects: { funds: 0, morale: +5, reputation: +5, tech: +5, connections: +5 },
        principles: { transparency: +3, talent: +1, machine: +2, meritocracy: +3, pain: +2, legacy: +2 },
        message: '你把真实财务数据投在了大屏幕上。沉默之后，各部门纷纷提出了节流方案。有人主动放弃了年终奖，有人找到了新的业务线。这是第一次，公司像一个真正的团队。'
      }
    ]
  },
  {
    id: 'E020', type: 'boss',
    title: '你被董事会要求下台',
    description: '会议室里鸦雀无声。投资人代表开口了：\'公司业绩连续两个季度下滑，董事会决定...要求你辞去CEO职务。你有一周时间移交。\'你看向在座的每一个人。',
    reporter: 'qian',
    choices: [
      {
        text: '接受决定，优雅退出，确保交接顺利',
        effects: { funds: 0, morale: -10, reputation: +15, tech: 0, connections: +10 },
        principles: { transparency: +2, talent: +1, machine: +1, meritocracy: +2, pain: +3, legacy: +3 },
        message: '你写了一封全员信，感谢每一个人。交接那天，全公司自发排队跟你握手。你失去了位置，但赢得了所有人的尊重。三个月后，你接到了三个更好的offer。'
      },
      {
        text: '据理力争，用数据证明战略是对的',
        effects: { funds: -5, morale: +10, reputation: +5, tech: 0, connections: -10 },
        principles: { transparency: +2, talent: 0, machine: +2, meritocracy: +2, pain: +2, legacy: +1 },
        message: '你做了一份详尽的数据分析，证明下滑是行业周期而非战略失误。董事会勉强给了你一个季度的宽限期。但你知道，这是最后的机会了。'
      },
      {
        text: '联合管理层发动"政变"，驱逐投资人代表',
        effects: { funds: -15, morale: -5, reputation: -20, tech: 0, connections: -20 },
        principles: { transparency: -3, talent: -2, machine: -2, meritocracy: -3, pain: -2, legacy: -3 },
        message: '短暂的胜利后，投资人启动了法律程序。公司陷入了漫长的控制权争夺战，什么正事都干不了了。'
      },
      {
        text: '提出转型计划：降薪留任，对赌下一季度业绩',
        effects: { funds: +1, morale: +5, reputation: +5, tech: +5, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +2, meritocracy: +1, pain: +3, legacy: +2 },
        message: '你主动降薪80%并签了对赌协议。董事会被你的决心打动，同意再给一个机会。所有人都在看着你。破釜沉舟，背水一战。'
      }
    ]
  },
  // ============ 新增危机事件 ============
  {
    id: 'E021', type: 'crisis',
    title: '产品经理和程序员在厕所约架',
    description: '林小默满头大汗：\'那个...产品经理说程序员改需求态度不好...程序员说产品经理天天改需求...现在他们约在停车场"谈判"...已经卷袖子了...\'',
    reporter: 'lin',
    choices: [
      {
        text: '立刻冲到现场制止，两边各打五十大板',
        effects: { funds: 0, morale: -10, reputation: 0, tech: -5, connections: 0 },
        principles: { transparency: -1, talent: -1, machine: -1, meritocracy: -1, pain: 0, legacy: 0 },
        message: '架是没打起来，但两个人都觉得委屈。产品经理和程序员从此不说话，需求全靠猜。'
      },
      {
        text: '让他们各自陈述，再建立需求变更流程',
        effects: { funds: -3, morale: +10, reputation: +5, tech: +10, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +3, meritocracy: +2, pain: +2, legacy: +2 },
        message: '你主持了一场"吐槽大会"，发现症结是缺乏需求文档和变更流程。建立新流程后，两人握手言和。'
      },
      {
        text: '不管他们，让他们自己解决',
        effects: { funds: 0, morale: -5, reputation: -5, tech: -10, connections: 0 },
        principles: { transparency: 0, talent: -1, machine: -2, meritocracy: 0, pain: -1, legacy: -1 },
        message: '他们"谈"完了。产品经理鼻青脸肿，程序员手臂有抓痕。从此产品迭代陷入僵局。'
      }
    ]
  },
  {
    id: 'E022', type: 'crisis',
    title: '办公室发现了老鼠',
    description: '赵铁柱慌张报告：\'老板！办公室发现老鼠了！而且...不止一只！有员工拍到了老鼠在工位上吃零食的视频，已经传到短视频平台了，播放量50万！\'',
    reporter: 'zhao',
    choices: [
      {
        text: '紧急请专业灭鼠公司，全面消杀',
        effects: { funds: -8, morale: +10, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: +2, meritocracy: 0, pain: +1, legacy: +1 },
        message: '灭鼠公司工作了三天。老鼠没了，但发现了更大的问题——办公楼下水道有裂缝。你顺便推动了楼宇维修。'
      },
      {
        text: '自己买粘鼠板，让员工自救',
        effects: { funds: -1, morale: -15, reputation: -10, tech: -5, connections: 0 },
        principles: { transparency: 0, talent: -1, machine: -1, meritocracy: -1, pain: -1, legacy: 0 },
        message: '粘鼠板抓到了三只老鼠，场面血腥。有女员工被吓哭了，还有人威胁说要投诉到劳动局。'
      },
      {
        text: '趁机搬到新办公室',
        effects: { funds: -15, morale: +20, reputation: +10, tech: +5, connections: +5 },
        principles: { transparency: +1, talent: +1, machine: +1, meritocracy: 0, pain: +2, legacy: +1 },
        message: '老鼠事件成了搬家的契机。新办公室环境好太多，员工士气大增。短视频反而成了"老板有担当"的证明。'
      }
    ]
  },
  {
    id: 'E023', type: 'crisis',
    title: '公司被恶意差评攻击',
    description: '张大炮暴怒：\'老板！我们产品突然出现500条一星差评，全是水军！内容都一模一样！肯定是竞对搞的鬼！我们排名从第5掉到第47了！\'',
    reporter: 'zhang',
    choices: [
      {
        text: '花钱买五星好评刷回去',
        effects: { funds: -10, morale: 0, reputation: -10, tech: 0, connections: -5 },
        principles: { transparency: -3, talent: 0, machine: -2, meritocracy: -2, pain: -2, legacy: -2 },
        message: '你找了水军公司刷好评。短期排名回来了，但平台查出异常，封了你的运营账号。更惨了。'
      },
      {
        text: '联系平台申诉，提供恶意攻击证据',
        effects: { funds: -3, morale: +5, reputation: +5, tech: 0, connections: +5 },
        principles: { transparency: +2, talent: 0, machine: +1, meritocracy: +1, pain: +2, legacy: +1 },
        message: '你整理了详细的证据，包括IP分析、时间戳等。平台核实后删除了恶意评论，还给你开了"遭受攻击"的专属标识。'
      },
      {
        text: '公开回应每一条差评，用真诚打动用户',
        effects: { funds: -5, morale: +10, reputation: +15, tech: 0, connections: +10 },
        principles: { transparency: +3, talent: +1, machine: +1, meritocracy: +1, pain: +2, legacy: +1 },
        message: '你亲自回复了所有差评，态度真诚。真实用户被打动了，自发帮你说话。舆论反转，你成了"被欺负的好老板"。'
      }
    ]
  },
  {
    id: 'E024', type: 'crisis',
    title: '核心员工要求远程办公',
    description: '王美丽为难地说：\'老板，技术骨干小李说他老家有事，要回老家远程办公半年。但其他人看到了也都想...现在有15个人申请远程。\'',
    reporter: 'wang',
    choices: [
      {
        text: '一律不准，必须到岗',
        effects: { funds: 0, morale: -20, reputation: -10, tech: -15, connections: 0 },
        principles: { transparency: 0, talent: -2, machine: -2, meritocracy: -1, pain: -1, legacy: -1 },
        message: '小李当天提了离职，带走了三个技术骨干。其他人怨声载道，工作效率暴跌。'
      },
      {
        text: '全部批准，试行混合办公',
        effects: { funds: -5, morale: +15, reputation: +10, tech: +5, connections: 0 },
        principles: { transparency: +1, talent: +1, machine: +1, meritocracy: +1, pain: +1, legacy: +1 },
        message: '你制定了混合办公制度。有人效率更高了，有人摸鱼了。但整体来说团队满意度大幅提升。'
      },
      {
        text: '建立远程办公考核机制，按成果定',
        effects: { funds: -3, morale: +10, reputation: +10, tech: +10, connections: 0 },
        principles: { transparency: +2, talent: +2, machine: +3, meritocracy: +3, pain: +1, legacy: +2 },
        message: '你说："在哪工作不重要，重要的是产出。"建立了OKR考核体系。能远程高效的人远程，不行的回办公室。'
      }
    ]
  },
  {
    id: 'E025', type: 'crisis',
    title: '合伙人想退出',
    description: '钱多多沉重地说：\'老板，创始合伙人老刘找我谈了...他想退出。他占股15%，要求按当前估值回购。他说...他觉得公司没前途了。\'',
    reporter: 'qian',
    choices: [
      {
        text: '按估值全额回购股份',
        effects: { funds: -30, morale: -5, reputation: 0, tech: 0, connections: -10 },
        principles: { transparency: +1, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: 0 },
        message: '钱付了，股份收回来了。但账户见底，三个月工资都成问题。老刘离开时没有说再见。'
      },
      {
        text: '跟他深谈，了解真实原因',
        effects: { funds: 0, morale: +5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: +1, machine: +1, meritocracy: +2, pain: +2, legacy: +1 },
        message: '谈了三个小时。你发现老刘不是对公司失望，而是家里有难处。你调整了他的角色和分红方式，他决定留下。'
      },
      {
        text: '拒绝回购，按合同走法律程序',
        effects: { funds: -10, morale: -10, reputation: -15, tech: 0, connections: -15 },
        principles: { transparency: -2, talent: -1, machine: -1, meritocracy: -1, pain: -1, legacy: -2 },
        message: '官司打了一年，最后调解收场。老刘逢人就说你翻脸不认人。圈子里的口碑臭了。'
      }
    ]
  },
  {
    id: 'E026', type: 'crisis',
    title: '产品出现严重安全漏洞',
    description: '林小默脸色惨白：\'那个...有白帽黑客发邮件给我们...说发现了一个严重SQL注入漏洞...10分钟就能拿到所有用户数据...他说...给我们7天时间修复，否则公开。\'',
    reporter: 'lin',
    choices: [
      {
        text: '立即修复漏洞，但不公开此事',
        effects: { funds: -5, morale: -5, reputation: 0, tech: +5, connections: 0 },
        principles: { transparency: -2, talent: 0, machine: +2, meritocracy: 0, pain: +1, legacy: 0 },
        message: '漏洞修了，但你瞒着用户。三个月后黑客在推特上公开了这件事，用户炸了："居然瞒了我们三个月！"'
      },
      {
        text: '紧急修复，同时发公告感谢白帽并致歉',
        effects: { funds: -8, morale: +5, reputation: +15, tech: +10, connections: +10 },
        principles: { transparency: +3, talent: +1, machine: +2, meritocracy: +1, pain: +2, legacy: +2 },
        message: '你发布了致歉公告，公开了漏洞细节和修复方案，还设立了安全奖励计划。虽然有用户不满，但大部分人认可你的透明态度。'
      },
      {
        text: '威胁黑客，报警处理',
        effects: { funds: -15, morale: -10, reputation: -20, tech: -10, connections: -15 },
        principles: { transparency: -3, talent: -2, machine: -2, meritocracy: -2, pain: -2, legacy: -3 },
        message: '黑客直接在第二天公开了漏洞。更糟的是，你的"威胁"邮件也被公开了。全网骂你"技术烂还嚣张"。'
      }
    ]
  },
  {
    id: 'E027', type: 'crisis',
    title: '供应商突然断供',
    description: '赵铁柱慌张跑来：\'老板！云服务供应商说我们欠费三个月了，马上要断服务器！但钱多多说账上明明有钱，是财务流程卡住了！\'',
    reporter: 'zhao',
    choices: [
      {
        text: '紧急打款，追究财务流程问题',
        effects: { funds: -5, morale: 0, reputation: 0, tech: +5, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: +2, meritocracy: +1, pain: +1, legacy: +1 },
        message: '服务器保住了。追查发现是审批流程太复杂，一个付款要6个人签字。你简化了流程，把审批权下放。'
      },
      {
        text: '谈判延期，同时寻找备用供应商',
        effects: { funds: -8, morale: -5, reputation: -5, tech: +10, connections: +5 },
        principles: { transparency: +1, talent: 0, machine: +3, meritocracy: +1, pain: +2, legacy: +2 },
        message: '你跟供应商谈到了一周宽限期，同时紧急部署了多云架构。虽然成本高了，但不再被单一供应商卡脖子。'
      },
      {
        text: '责怪财务部门，让他们自己解决',
        effects: { funds: 0, morale: -15, reputation: -10, tech: -20, connections: -10 },
        principles: { transparency: -2, talent: -1, machine: -2, meritocracy: -2, pain: -1, legacy: -1 },
        message: '财务部门觉得很委屈，钱多多当众跟你吵了起来。服务器第三天还是断了，产品宕机12小时，损失惨重。'
      }
    ]
  },
  // ============ 新增机遇事件 ============
  {
    id: 'E028', type: 'opportunity',
    title: '被知名科技媒体报道',
    description: '张大炮兴奋地冲进来：\'老板！有家科技媒体想做一篇专访报道我们！说我们是行业黑马！但记者说想要真实的故事，不要官方话术。\'',
    reporter: 'zhang',
    choices: [
      {
        text: '接受采访，讲真实的公司故事',
        effects: { funds: 0, morale: +10, reputation: +20, tech: 0, connections: +15 },
        principles: { transparency: +3, talent: +1, machine: 0, meritocracy: +1, pain: +1, legacy: +2 },
        message: '你讲了真实的困难和决策过程。文章火了，阅读量100万+。很多老板说"这才是真实的公司经营"。'
      },
      {
        text: '让陈画饼准备官方稿，包装一下',
        effects: { funds: 0, morale: 0, reputation: +5, tech: 0, connections: +5 },
        principles: { transparency: -2, talent: 0, machine: 0, meritocracy: 0, pain: -1, legacy: 0 },
        message: '文章发了，但读者评论说"又是一篇广告软文"。没什么水花，记者说下次不会再找你们了。'
      },
      {
        text: '拒绝采访，低调发展',
        effects: { funds: 0, morale: 0, reputation: 0, tech: 0, connections: -5 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: 0 },
        message: '你婉拒了采访。张大炮失望了一整天。错过了一次免费宣传的机会。'
      }
    ]
  },
  {
    id: 'E029', type: 'opportunity',
    title: '大客户主动上门',
    description: '张大炮激动得语无伦次：\'老板！世界500强的采购总监来了！说想试用我们的产品！如果满意的话，他们全球分公司都用！这单至少8位数！\'',
    reporter: 'zhang',
    choices: [
      {
        text: '全力配合，调集所有资源服务大客户',
        effects: { funds: -10, morale: -10, reputation: +10, tech: +5, connections: +20 },
        principles: { transparency: 0, talent: 0, machine: -1, meritocracy: 0, pain: +1, legacy: 0 },
        message: '你把80%的资源投入大客户。他们很满意，签约了！但其他客户被冷落，有三家中小客户流失了。'
      },
      {
        text: '接下单子，但不改变现有服务节奏',
        effects: { funds: 0, morale: +5, reputation: +5, tech: 0, connections: +10 },
        principles: { transparency: +1, talent: 0, machine: +2, meritocracy: +1, pain: +1, legacy: +1 },
        message: '你说"大客户不代表特权，我们公平对待所有客户"。大客户惊了，但反而觉得你有原则。最后还是签了，但金额打了折。'
      },
      {
        text: '先做尽调，评估自己能否接得住',
        effects: { funds: -5, morale: 0, reputation: +10, tech: +5, connections: +15 },
        principles: { transparency: +2, talent: +1, machine: +3, meritocracy: +1, pain: +2, legacy: +2 },
        message: '你做了完整的能力评估，发现有三个技术点搞不定。你坦诚告诉客户，并建议了一个改进方案。客户说"这是我见过最专业的团队"。'
      }
    ]
  },
  {
    id: 'E030', type: 'opportunity',
    title: '被邀请参加行业峰会演讲',
    description: '陈画饼眉飞色舞：\'老板！下个月的行业峰会邀请你做主题演讲！台下有5000人！全是行业大佬和投资人！这可是绝佳曝光机会！\'',
    reporter: 'chen',
    choices: [
      {
        text: '认真准备演讲，分享真实经验',
        effects: { funds: -3, morale: +10, reputation: +15, tech: 0, connections: +20 },
        principles: { transparency: +2, talent: +1, machine: +1, meritocracy: +1, pain: +1, legacy: +2 },
        message: '你讲了做公司中的坑和教训。演讲结束后掌声雷动，三个投资人当场要了你的联系方式。'
      },
      {
        text: '让陈画饼准备PPT，画个大饼',
        effects: { funds: 0, morale: 0, reputation: -5, tech: 0, connections: +5 },
        principles: { transparency: -2, talent: 0, machine: 0, meritocracy: -1, pain: -1, legacy: -1 },
        message: '陈画饼做了一个炫酷的PPT。台下打瞌睡的人不少。会后有人说"又是一个只会吹的老板"。'
      },
      {
        text: '推掉演讲，把时间用在产品上',
        effects: { funds: 0, morale: 0, reputation: 0, tech: +10, connections: -5 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: +1 },
        message: '你觉得产品比演讲重要。陈画饼很失落。你省下的时间做了一个重要功能，用户好评。'
      }
    ]
  },
  {
    id: 'E031', type: 'opportunity',
    title: '技术大佬想加入团队',
    description: '林小默激动到结巴：\'那个...那个...大神李工...BAT干了10年的架构师...他说想加入我们...他说...他看好我们的技术方向...\'',
    reporter: 'lin',
    choices: [
      {
        text: '高薪聘请，给期权和技术决策权',
        effects: { funds: -15, morale: +10, reputation: +10, tech: +25, connections: +10 },
        principles: { transparency: +1, talent: +3, machine: +2, meritocracy: +2, pain: 0, legacy: +2 },
        message: '李工入职第一周就重构了核心架构。技术债减少了50%，林小默说"这才是真正的高手"。'
      },
      {
        text: '担心他太贵，婉拒并说以后再合作',
        effects: { funds: 0, morale: -10, reputation: 0, tech: 0, connections: -5 },
        principles: { transparency: 0, talent: -2, machine: -1, meritocracy: -1, pain: -1, legacy: -1 },
        message: '李工去了你的竞对。三个月后竞对产品技术上全面超越了你。林小默叹气："我们错过了一个时代。"'
      },
      {
        text: '给合理薪资，但让他证明自己的价值',
        effects: { funds: -8, morale: +5, reputation: +5, tech: +15, connections: +5 },
        principles: { transparency: +1, talent: +2, machine: +2, meritocracy: +3, pain: +1, legacy: +1 },
        message: '你说"大厂经验不代表一切，我们看实际贡献"。李工说"这才是小公司该有的态度"。试用期他拿出了成果，转正后主动要求期权而非高薪。'
      }
    ]
  },
  // ============ 新增日常事件 ============
  {
    id: 'E032', type: 'daily',
    title: '员工组团玩剧本杀没叫你',
    description: '王美丽欲言又止：\'老板...周末员工组织剧本杀团建，20个人都去了...但是...没有人叫你...我听到他们说"千万别让老板知道"...\'',
    reporter: 'wang',
    choices: [
      {
        text: '假装不知道，随他们去',
        effects: { funds: 0, morale: +5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: 0, meritocracy: 0, pain: +1, legacy: 0 },
        message: '你装作什么都不知道。周一看到他们开心地讨论剧情，你心里有点酸，但也挺欣慰——至少团队氛围好。'
      },
      {
        text: '主动说要参加下次的活动',
        effects: { funds: -3, morale: +10, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: 0, meritocracy: 0, pain: +1, legacy: +1 },
        message: '你主动说"下次叫上我"。员工先是尴尬，后来发现老板玩剧本杀还挺放得开的。关系拉近了不少。'
      },
      {
        text: '质问他们为什么不叫你',
        effects: { funds: 0, morale: -15, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: -1, talent: -1, machine: 0, meritocracy: -1, pain: -1, legacy: -1 },
        message: '气氛凝固了。有人小声说"老板在的话我们不自在啊..."。从此员工活动转入地下，你成了"不能说的禁忌"。'
      }
    ]
  },
  {
    id: 'E033', type: 'daily',
    title: '楼下奶茶店倒闭了',
    description: '赵铁柱悲伤地汇报：\'老板...楼下那家奶茶店倒闭了...就是那家员工每天下午都去的那家...大家都很难过...有人说是不是公司福利不好，奶茶店生意也不好...\'',
    reporter: 'zhao',
    choices: [
      {
        text: '设立每月奶茶基金，让大家换店喝',
        effects: { funds: -5, morale: +15, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: +1, machine: 0, meritocracy: 0, pain: 0, legacy: +1 },
        message: '每人每月200元奶茶额度。员工狂喜，当天下午公司走廊全是奶茶香。有人说"这是我收到过最甜的福利"。'
      },
      {
        text: '奶茶店倒闭关公司什么事？',
        effects: { funds: 0, morale: -10, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: 0, meritocracy: 0, pain: -1, legacy: 0 },
        message: '员工觉得你不近人情。下午茶时间大家都蔫蔫的。有人在脉脉吐槽"老板连奶茶都要管"。'
      },
      {
        text: '调查发现奶茶店老板想开分店，投资他',
        effects: { funds: -10, morale: +10, reputation: +10, tech: 0, connections: +10 },
        principles: { transparency: +1, talent: +1, machine: +1, meritocracy: +1, pain: +1, legacy: +1 },
        message: '奶茶店老板其实想做小程序外卖。你投了他，他做起来了还给了你们公司内部折扣。员工觉得老板有格局。'
      }
    ]
  },
  {
    id: 'E034', type: 'daily',
    title: '公司群里有人发了奇怪的消息',
    description: '王美丽截图给你看：全员群里，运营小王发了一条："活着真没意思。"然后就不回消息了。群里炸了锅，所有人都在@他。',
    reporter: 'wang',
    choices: [
      {
        text: '立即打电话确认他的安全',
        effects: { funds: 0, morale: +15, reputation: +10, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: +2, machine: 0, meritocracy: 0, pain: +2, legacy: +1 },
        message: '你打了20个电话，最后联系上了他。原来是失恋了，酒后发的。你陪他聊到深夜。他说："我不是一个人在战斗。"'
      },
      {
        text: '让HR和他的同事去看看',
        effects: { funds: 0, morale: +5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: +1, machine: 0, meritocracy: 0, pain: +1, legacy: 0 },
        message: '王美丽和他的同事去了。小王没事，但觉得很感动。后来他成了公司最努力的人之一。'
      },
      {
        text: '群里警告不要发负能量',
        effects: { funds: 0, morale: -20, reputation: -15, tech: 0, connections: -5 },
        principles: { transparency: -2, talent: -2, machine: -1, meritocracy: -1, pain: -2, legacy: -2 },
        message: '你的警告让全公司寒心。三天后小王提了离职。离职信只有一句话："这家公司没有温度。"'
      }
    ]
  },
  {
    id: 'E035', type: 'daily',
    title: '员工带宠物来上班',
    description: '赵铁柱哭笑不得：\'老板，设计师小美带了她的柯基来公司...说家里没人照顾...现在狗子在办公室跑来跑去...有人觉得可爱，有人说影响工作...\'',
    reporter: 'zhao',
    choices: [
      {
        text: '允许带宠物，制定宠物友好政策',
        effects: { funds: -3, morale: +20, reputation: +15, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: +1, machine: +1, meritocracy: 0, pain: 0, legacy: +1 },
        message: '你设立了宠物区，制定了宠物行为规范。公司成了"宠物友好公司"，招聘广告上多了一个吸引点。'
      },
      {
        text: '不允许，这是办公场所',
        effects: { funds: 0, morale: -10, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: -1, machine: 0, meritocracy: 0, pain: 0, legacy: 0 },
        message: '小美很失望，把狗送回了家。但下午她心不在焉，交付的设计质量明显下降。'
      },
      {
        text: '先试行一周看效果',
        effects: { funds: 0, morale: +10, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +1, meritocracy: +1, pain: +1, legacy: +1 },
        message: '一周后发现宠物确实让气氛更好了，但需要规范。你建立了试点制度，效果不错。'
      }
    ]
  },
  {
    id: 'E036', type: 'daily',
    title: '有员工穿着睡衣来上班',
    description: '王美丽皱眉：\'老板，程序员小陈穿着睡衣来上班...还是那种卡通图案的...说反正也不见客户，舒服就行...其他人有点意见...\'',
    reporter: 'wang',
    choices: [
      {
        text: '制定着装规范，维护职业形象',
        effects: { funds: 0, morale: -5, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: 0 },
        message: '你发布了着装规范：商务休闲。小陈不太高兴，但照做了。办公室确实整洁了一些。'
      },
      {
        text: '不管他，能干活就行',
        effects: { funds: 0, morale: +10, reputation: -5, tech: +5, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: 0, meritocracy: +1, pain: 0, legacy: 0 },
        message: '你说"只要代码写得好，穿什么都行"。技术部欢呼，第二周来了三个穿睡衣的。市场部觉得很尴尬。'
      },
      {
        text: '跟他聊聊，了解为什么这么穿',
        effects: { funds: 0, morale: +5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: 0, meritocracy: +1, pain: +1, legacy: 0 },
        message: '小陈说他凌晨才下班，早上起不来，来不及换衣服。你意识到这是加班过度的信号，调整了排期。'
      }
    ]
  },
  {
    id: 'E037', type: 'daily',
    title: '员工午休时间炒股亏了大哭',
    description: '赵铁柱不知所措：\'老板，财务部小张炒股亏了10万，在工位上哭...其他人不知道怎么办...有人说要不要凑钱帮他...\'',
    reporter: 'zhao',
    choices: [
      {
        text: '禁止上班时间炒股，这是教训',
        effects: { funds: 0, morale: -10, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: 0 },
        message: '你发布了禁令。小张觉得雪上加霜，消极怠工了一个月。其他人也觉得公司管得太宽。'
      },
      {
        text: '安慰他并提供心理咨询资源',
        effects: { funds: -2, morale: +10, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: +2, machine: 0, meritocracy: 0, pain: +1, legacy: +1 },
        message: '你找他聊了聊，还安排了EAP咨询。小张慢慢走出来了，说"老板比我爸还关心我"。'
      },
      {
        text: '给他涨薪，让他不要再炒股',
        effects: { funds: -5, morale: +5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: 0, meritocracy: -1, pain: 0, legacy: 0 },
        message: '小张很感动，但三个月后他又亏了。你意识到钱解决不了心理问题。其他人也觉得不公平——为什么亏钱还涨薪？'
      }
    ]
  },
  // ============ 新增BOSS级事件 ============
  {
    id: 'E038', type: 'boss',
    title: '核心产品被巨头抄袭',
    description: '林小默拿着手机，声音都在抖：\'那个...BAT其中一家...推出了跟我们一模一样的产品...连UI都像素级复刻...他们有资源、有用户、有品牌...我们...还有机会吗？\'',
    reporter: 'lin',
    choices: [
      {
        text: '起诉抄袭，打持久法律战',
        effects: { funds: -25, morale: -10, reputation: +10, tech: 0, connections: -15 },
        principles: { transparency: +1, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: 0 },
        message: '官司打了两年，输了。巨头有最好的律师团队。你错过了最佳发展时期，团队也疲惫不堪。'
      },
      {
        text: '转型做差异化，避开正面竞争',
        effects: { funds: -10, morale: +5, reputation: +5, tech: +15, connections: +5 },
        principles: { transparency: +1, talent: +1, machine: +2, meritocracy: +1, pain: +3, legacy: +2 },
        message: '你说"巨头擅长大而全，我们做小而美"。转型垂直领域，一年后在细分市场做到了第一。林小默说："这才是正确的道路。"'
      },
      {
        text: '主动找巨头谈收购或合作',
        effects: { funds: +7, morale: -5, reputation: -10, tech: -5, connections: +10 },
        principles: { transparency: +1, talent: 0, machine: 0, meritocracy: 0, pain: +1, legacy: -1 },
        message: '巨头很爽快地收购了你们。价格还不错，但你成了打工人。有人说你"卖了团队的梦想"。'
      },
      {
        text: '拼了！加速迭代，比巨头跑得更快',
        effects: { funds: -20, morale: +15, reputation: +15, tech: +20, connections: +5 },
        principles: { transparency: +2, talent: +2, machine: +2, meritocracy: +2, pain: +3, legacy: +3 },
        message: '你召开全员大会："小公司的优势就是快！"六个月推了15个新功能。巨头的产品还在开会，你已经占领了用户心智。'
      }
    ]
  },
  {
    id: 'E039', type: 'boss',
    title: '公司账上只剩两个月工资',
    description: '钱多多把财务报表放在你桌上，手在发抖：\'老板...账上只够发两个月工资了...新一轮融资还没着落...订单也在下滑...我们...要不要启动紧急预案？\'',
    reporter: 'qian',
    choices: [
      {
        text: '降薪+裁员，保证活下去',
        effects: { funds: +16, morale: -25, reputation: -15, tech: -15, connections: -10 },
        principles: { transparency: +1, talent: 0, machine: 0, meritocracy: +1, pain: +2, legacy: 0 },
        message: '你裁了40%的人。离开的人骂你无情，留下的人惶恐。公司活下来了，但元气大伤。'
      },
      {
        text: '全员开诚布公，一起想办法',
        effects: { funds: +7, morale: +10, reputation: +15, tech: +10, connections: +10 },
        principles: { transparency: +3, talent: +2, machine: +2, meritocracy: +3, pain: +3, legacy: +3 },
        message: '你公开了财务数据。团队自发组成了"救火小组"：市场部门找到了三个新客户，技术部门加班做了可商业化的功能，有人主动降薪...两个月后，公司转危为安。'
      },
      {
        text: '卖资产、抵押房子，CEO个人借钱',
        effects: { funds: +13, morale: +15, reputation: +10, tech: 0, connections: +5 },
        principles: { transparency: +2, talent: +1, machine: 0, meritocracy: +1, pain: +3, legacy: +1 },
        message: '你抵押了自己的房子，给公司注入了现金。团队知道后红了眼眶："老板都这样了，我们还有什么理由不拼？"'
      },
      {
        text: '宣布破产，体面地结束',
        effects: { funds: 0, morale: -15, reputation: +5, tech: 0, connections: +5 },
        principles: { transparency: +3, talent: 0, machine: 0, meritocracy: 0, pain: +3, legacy: +2 },
        message: '你结清了所有员工工资和遣散费。虽然公司关了，但所有人都说你"有担当"。一年后，三个员工找你说想跟你再干一票。'
      }
    ]
  },
  // ============ 连续剧事件系列 ============
  // S001: 开源危机三部曲
  {
    id: 'E040', type: 'crisis',
    isSeries: true, seriesId: 'S001', chapter: 1, totalChapters: 3,
    title: '开源危机·第一章：深夜推送',
    description: '凌晨3点，林小默把公司核心算法推到了GitHub公开仓库，还发了条推特："代码应该属于全人类。"现在已经有200个star了。王美丽慌张地打来电话，GitHub上已经有人开始fork了。',
    reporter: 'lin',
    choices: [
      {
        text: '立刻删库，发律师函警告',
        effects: { funds: -5, morale: -10, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: -2, talent: -1, machine: 0, meritocracy: -1, pain: 0, legacy: 0 },
        message: '代码是删了，但林小默在工位上沉默了三天。GitHub社区开始骂你是"开源公敌"。',
        nextChapter: {
          eventId: 'E041', delay: 0,
          stateFlags: { approach: 'legal', lin_mood: 'hostile' }
        }
      },
      {
        text: '将计就计，宣布拥抱开源战略',
        effects: { funds: -10, morale: +10, reputation: +15, tech: +5, connections: +10 },
        principles: { transparency: +2, talent: +1, machine: +1, meritocracy: +1, pain: +1, legacy: +1 },
        message: '你召开全员大会宣布开源战略。林小默热泪盈眶，外部开发者蜂拥而至。虽然短期亏了，但口碑炸了。',
        nextChapter: {
          eventId: 'E041', delay: 0,
          stateFlags: { approach: 'embrace', lin_mood: 'grateful' }
        }
      },
      {
        text: '找林小默谈话，了解真实原因',
        effects: { funds: 0, morale: +5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: +2, machine: +1, meritocracy: +1, pain: +2, legacy: 0 },
        message: '林小默说他觉得公司技术方向有问题，每次提意见都被忽视。你意识到这是沟通机制的问题。',
        nextChapter: {
          eventId: 'E041', delay: 0,
          stateFlags: { approach: 'talk', lin_mood: 'hopeful' }
        }
      }
    ]
  },
  {
    id: 'E041', type: 'crisis',
    isSeries: true, seriesId: 'S001', chapter: 2, totalChapters: 3,
    title: '开源危机·第二章：社区反应',
    description: '开源事件在社区引发了轩然大波。各种声音都有，现在需要决定如何应对。',
    dynamicDescription: (state) => {
      if (!state) return '开源事件在社区引发了轩然大波。各种声音都有，现在需要决定如何应对。';
      if (state.approach === 'legal') return '律师函发出后，开源社区炸锅了。黑客论坛上有人发起了"抵制运动"，你的公司网站被DDoS攻击了整整一天。';
      if (state.approach === 'embrace') return '开源战略发布后，三个顶级开发者想加入你们。但两家竞对fork了代码，还改了名字上线了产品。';
      if (state.approach === 'talk') return '和林小默谈完后，他在内部论坛发了一篇长文《为什么我要开源》。团队分成了两派：支持派和反对派。';
      return '开源事件在社区引发了轩然大波。各种声音都有，现在需要决定如何应对。';
    },
    reporter: 'wang',
    choices: [
      {
        text: '趁机招揽开源社区的人才',
        effects: { funds: -15, morale: +5, reputation: +5, tech: +15, connections: +5 },
        principles: { transparency: +1, talent: +2, machine: 0, meritocracy: +1, pain: 0, legacy: +1 },
        message: '三位大佬入职。虽然工资开得不低，但技术实力直接翻倍。',
        nextChapter: { eventId: 'E042', delay: 0, stateFlags: { hired_talents: true } }
      },
      {
        text: '起诉竞对，同时婉拒外部开发者',
        effects: { funds: -10, morale: -5, reputation: -10, tech: 0, connections: -10 },
        principles: { transparency: -2, talent: -1, machine: -1, meritocracy: -1, pain: -1, legacy: -1 },
        message: '官司打了半年没结果。那三个开发者去了竞对，还在网上说你格局小。',
        nextChapter: { eventId: 'E042', delay: 0, stateFlags: { lawsuit: true } }
      },
      {
        text: '建立技术委员会，让技术人员参与决策',
        effects: { funds: -5, morale: +10, reputation: +5, tech: +10, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +2, meritocracy: +3, pain: +1, legacy: +2 },
        message: '技术委员会成立。林小默当选主席，提出了三个重要改进方案。',
        nextChapter: { eventId: 'E042', delay: 0, stateFlags: { tech_committee: true } }
      }
    ]
  },
  {
    id: 'E042', type: 'opportunity',
    isSeries: true, seriesId: 'S001', chapter: 3, totalChapters: 3,
    title: '开源危机·终章：一个月后',
    description: '一个月过去了，开源事件的影响逐渐显现。',
    dynamicDescription: (state) => {
      if (!state) return '一个月过去了，开源事件的影响逐渐显现。';
      let base = '一个月过去了。';
      if (state.tech_committee) return base + '技术委员会推动的三个改进方案都上线了，产品质量显著提升。科技媒体发文报道了你们的"工程师文化"。';
      if (state.hired_talents) return base + '新招的三位大佬重构了架构，性能提升5倍。但老员工有点不适应他们的"大厂作风"。';
      if (state.lawsuit) return base + '官司还在打，公司资源都耗在了法务上，产品迭代停滞了。投资人打来电话质问。';
      return base + '开源事件的影响逐渐平息。';
    },
    reporter: 'lin',
    choices: [
      {
        text: '总结经验，建立开源策略和技术决策流程',
        effects: { funds: -5, morale: +10, reputation: +10, tech: +15, connections: +10 },
        principles: { transparency: +3, talent: +1, machine: +3, meritocracy: +2, pain: +2, legacy: +3 },
        message: '你写了一份《开源策略白皮书》，建立了技术决策委员会。林小默成为首席架构师。这次危机变成了公司进化的转折点。'
      },
      {
        text: '收紧权限，防止类似事件再次发生',
        effects: { funds: -3, morale: -10, reputation: 0, tech: -5, connections: 0 },
        principles: { transparency: -2, talent: -2, machine: -1, meritocracy: -1, pain: -1, legacy: -1 },
        message: '你实施了严格的代码审查和权限管理。安全了，但技术团队觉得被当贼防，三个骨干提了离职。'
      },
      {
        text: '什么都不做，让时间冲淡一切',
        effects: { funds: 0, morale: -5, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: -1, meritocracy: 0, pain: -2, legacy: -2 },
        message: '你选择了遗忘。但类似的问题会在某一天以更大的代价回来。'
      }
    ]
  },

  // S002: 融资谈判四部曲
  {
    id: 'E043', type: 'opportunity',
    isSeries: true, seriesId: 'S002', chapter: 1, totalChapters: 4,
    title: '融资谈判·第一章：VC上门',
    description: '钱多多兴奋地跑进来："老板！有家头部VC的合伙人想见你！他们看了我们的数据，说增长曲线很漂亮！" 约在明天下午3点，对方要求带上财务报表、用户数据和商业计划。',
    reporter: 'qian',
    choices: [
      {
        text: '连夜美化数据，把曲线做得更漂亮',
        effects: { funds: 0, morale: -5, reputation: 0, tech: 0, connections: +5 },
        principles: { transparency: -3, talent: 0, machine: 0, meritocracy: 0, pain: -2, legacy: -1 },
        message: '你和钱多多加班到凌晨4点，把留存率从42%改成了68%。王美丽看到后说了句："这...能过尽调吗？"',
        nextChapter: {
          eventId: 'E044', delay: 0,
          stateFlags: { data_honest: false, vc_impression: 'suspicious' }
        }
      },
      {
        text: '如实准备，数据是多少就是多少',
        effects: { funds: 0, morale: +5, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: 0, machine: +1, meritocracy: 0, pain: +2, legacy: +1 },
        message: '你打印了真实的数据。留存率42%，月活1.2万。虽然不亮眼，但每一个数字都经得起推敲。林小默说："至少咱们睡得踏实。"',
        nextChapter: {
          eventId: 'E044', delay: 0,
          stateFlags: { data_honest: true, vc_impression: 'neutral' }
        }
      },
      {
        text: '重点准备团队介绍，讲好故事',
        effects: { funds: 0, morale: +8, reputation: +3, tech: 0, connections: +3 },
        principles: { transparency: +1, talent: +2, machine: 0, meritocracy: +1, pain: 0, legacy: +2 },
        message: '你花了一晚上打磨团队故事：林小默的名校背景，王美丽的大厂经验。数据平平，但故事动人。陈画饼说："这我熟啊！"',
        nextChapter: {
          eventId: 'E044', delay: 0,
          stateFlags: { data_honest: true, vc_impression: 'interested' }
        }
      }
    ]
  },
  {
    id: 'E044', type: 'crisis',
    isSeries: true, seriesId: 'S002', chapter: 2, totalChapters: 4,
    title: '融资谈判·第二章：尽调周',
    dynamicDescription: (state) => {
      if (state.data_honest === false) {
        return 'VC派了两个分析师来做尽职调查。第二天，分析师拿着Excel对你说："你们的留存数据和后台日志对不上。能解释一下吗？" 会议室里的空气凝固了。';
      } else if (state.vc_impression === 'interested') {
        return 'VC派了两个分析师来做尽职调查。他们看了一圈数据后说："数字中规中矩，但你们团队确实有亮点。合伙人想深入了解你们的技术壁垒。"';
      } else {
        return 'VC派了两个分析师来做尽职调查。他们翻了三天账本、代码和合同。第四天，分析师说："基本没什么大问题，就是数据有点保守。"';
      }
    },
    reporter: 'wang',
    choices: [
      {
        text: '承认美化了数据，请求谅解',
        effects: { funds: 0, morale: -3, reputation: -10, tech: 0, connections: -15 },
        principles: { transparency: +2, talent: 0, machine: 0, meritocracy: 0, pain: +3, legacy: 0 },
        message: '你当场承认了。VC合伙人脸色铁青："我们最讨厌不诚实的人。"尽调结束，再无消息。但你保住了名声。',
        nextChapter: {
          eventId: 'E045', delay: 0,
          stateFlags: { vc_result: 'rejected', reason: 'dishonest' }
        }
      },
      {
        text: '强调技术优势，转移话题重点',
        effects: { funds: 0, morale: 0, reputation: 0, tech: +5, connections: 0 },
        principles: { transparency: 0, talent: +1, machine: +1, meritocracy: +1, pain: 0, legacy: +1 },
        message: '你让林小默做了三个小时的技术深度讲解。VC被算法创新震住了，数据问题被淡化。王美丽偷偷竖起大拇指。',
        nextChapter: {
          eventId: 'E045', delay: 0,
          stateFlags: { vc_result: 'interested', leverage: 'tech' }
        }
      },
      {
        text: '展示真实增长轨迹和清晰规划',
        effects: { funds: 0, morale: +5, reputation: +8, tech: 0, connections: +8 },
        principles: { transparency: +3, talent: 0, machine: +2, meritocracy: 0, pain: +1, legacy: +2 },
        message: '你展示了过去6个月的真实增长曲线和未来12个月的路线图。VC说："虽然现在小，但你们知道自己在做什么。"',
        nextChapter: {
          eventId: 'E045', delay: 0,
          stateFlags: { vc_result: 'interested', leverage: 'vision' }
        }
      }
    ]
  },
  {
    id: 'E045', type: 'opportunity',
    isSeries: true, seriesId: 'S002', chapter: 3, totalChapters: 4,
    title: '融资谈判·第三章：Term Sheet',
    dynamicDescription: (state) => {
      if (state.vc_result === 'rejected') {
        return 'VC的拒绝在圈子里传开了。但一周后，钱多多说："老板，有个新基金愿意见我们，条件是估值打7折。" 你现在需要钱，但不想被占太多股份。';
      } else if (state.leverage === 'tech') {
        return 'VC发来了Term Sheet：500万美金，估值2500万，占股20%。条款里有一条：要求林小默签3年竞业协议。林小默脸色不太好。';
      } else {
        return 'VC发来了Term Sheet：500万美金，估值3000万，占股16.7%。条款很标准，但有一条：董事会要有一票否决权。这意味着重大决策你不能单独拍板了。';
      }
    },
    reporter: 'qian',
    choices: [
      {
        text: '接受所有条款，尽快拿钱',
        effects: { funds: +13, morale: -5, reputation: 0, tech: 0, connections: +5 },
        principles: { transparency: 0, talent: -1, machine: 0, meritocracy: 0, pain: -1, legacy: -2 },
        message: '钱到账了！但林小默签竞业时叹了口气，你也交出了一部分控制权。钱多多说："先活下来再说吧。"',
        nextChapter: {
          eventId: 'E046', delay: 0,
          stateFlags: { deal: 'accepted', team_morale: 'low' }
        }
      },
      {
        text: '谈判核心条款，保护团队和控制权',
        effects: { funds: +16, morale: +8, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: +2, machine: +1, meritocracy: +1, pain: +2, legacy: +2 },
        message: '你花了两周谈判，去掉了竞业条款，把一票否决改成了重大事项需2/3票。VC说："你是我们见过最难搞的老板，但我们欣赏。"',
        nextChapter: {
          eventId: 'E046', delay: 0,
          stateFlags: { deal: 'negotiated', team_morale: 'high' }
        }
      },
      {
        text: '拒绝，继续寻找更好的条件',
        effects: { funds: 0, morale: +3, reputation: +8, tech: 0, connections: -5 },
        principles: { transparency: +1, talent: +1, machine: 0, meritocracy: +1, pain: +3, legacy: +1 },
        message: '你婉拒了VC。圈子里有人说你"不识抬举"，但也有人说你"有骨气"。账上的钱还能撑2个月。',
        nextChapter: {
          eventId: 'E046', delay: 0,
          stateFlags: { deal: 'rejected', team_morale: 'nervous' }
        }
      }
    ]
  },
  {
    id: 'E046', type: 'boss',
    isSeries: true, seriesId: 'S002', chapter: 4, totalChapters: 4,
    title: '融资谈判·第四章：签约日',
    dynamicDescription: (state) => {
      if (state.deal === 'accepted') {
        return '签约仪式在VC办公室举行。VC合伙人握着你的手说："欢迎加入VC系！" 闪光灯啪啪响。回到公司，林小默说："老板，我有点担心未来3年的竞业..."';
      } else if (state.deal === 'negotiated') {
        return '签约仪式很低调，但合同的每一条你都满意。VC合伙人说："你很tough，但我们喜欢有主见的老板。" 全员大会上，你宣布融资成功，团队欢呼。';
      } else {
        return '拒绝VC后的第45天，账上只剩18万。陈画饼说："老板，我朋友有个土豪想投，但要占30%..."就在这时，王美丽跑进来："有家大厂看到我们了！"';
      }
    },
    reporter: 'wang',
    choices: [
      {
        text: '全员大会宣布，分享喜悦',
        effects: { funds: 0, morale: +15, reputation: +10, tech: 0, connections: +5 },
        principles: { transparency: +3, talent: +1, machine: 0, meritocracy: 0, pain: 0, legacy: +2 },
        message: '你在大会上展示了Term Sheet，解释了每一条款。团队明白了钱是怎么来的,股份是怎么分的。信任感爆棚。'
      },
      {
        text: '低调处理，专注业务目标',
        effects: { funds: 0, morale: +5, reputation: +3, tech: +5, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: +2, meritocracy: 0, pain: 0, legacy: +1 },
        message: '你只在内部邮件里简单宣布了融资。第二天，林小默已经在规划新版本。钱多多说："咱们老板还是务实。"'
      },
      {
        text: '感谢团队，发放融资红包',
        effects: { funds: -5, morale: +12, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: +2, machine: 0, meritocracy: +1, pain: 0, legacy: +1 },
        message: '你给每人发了一个月工资的红包。刘阿姨哭了："从没见过这样的老板。" 士气到达巅峰。'
      }
    ]
  },

  // S003: 大客户危机三部曲
  {
    id: 'E047', type: 'crisis',
    isSeries: true, seriesId: 'S003', chapter: 1, totalChapters: 3,
    title: '大客户危机·第一章：反水',
    description: '王美丽脸色惨白地走进来："老板，出事了。咱们最大的客户（占营收40%）说要停止续约，原因是...他们说我们的产品「不够稳定」。" 上个月刚出过一次线上事故，持续了2小时。',
    reporter: 'wang',
    choices: [
      {
        text: '立刻登门道歉，承诺补偿',
        effects: { funds: -10, morale: 0, reputation: +3, tech: 0, connections: +5 },
        principles: { transparency: +2, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: 0 },
        message: '你带着林小默连夜飞到客户公司，90度鞠躬道歉，承诺免费服务3个月。客户CTO松了口："给你们一周时间证明。"',
        nextChapter: { eventId: 'E048', delay: 0, stateFlags: { approach: 'apologize', client_mood: 'skeptical' }}
      },
      {
        text: '强硬回应：我们产品没问题',
        effects: { funds: 0, morale: +5, reputation: -10, tech: 0, connections: -15 },
        principles: { transparency: -2, talent: 0, machine: 0, meritocracy: 0, pain: -2, legacy: -1 },
        message: '你回邮件："上次事故是AWS的问题，不是我们的锅。" 客户直接拉黑了你的微信。王美丽说："老板...咱们真的没错吗？"',
        nextChapter: { eventId: 'E048', delay: 0, stateFlags: { approach: 'deny', client_mood: 'hostile' }}
      },
      {
        text: '彻查问题根源，给出技术方案',
        effects: { funds: 0, morale: +3, reputation: +5, tech: +10, connections: +3 },
        principles: { transparency: +2, talent: 0, machine: +3, meritocracy: 0, pain: +2, legacy: +2 },
        message: '你让林小默写了一份30页的技术复盘报告，从架构到监控全面梳理。客户技术总监看完说："这才是我想要的。"',
        nextChapter: { eventId: 'E048', delay: 0, stateFlags: { approach: 'technical', client_mood: 'impressed' }}
      }
    ]
  },
  {
    id: 'E048', type: 'crisis',
    isSeries: true, seriesId: 'S003', chapter: 2, totalChapters: 3,
    title: '大客户危机·第二章：考验',
    dynamicDescription: (state) => {
      if (state.client_mood === 'hostile') {
        return '客户没有回应你的邮件。三天后，你在朋友圈看到他们在招标，竞对的销售已经上门了。陈画饼说："老板，要不我去疏通一下关系？"';
      } else if (state.client_mood === 'impressed') {
        return '客户说："技术方案不错，但我们需要看到实际行动。两周内，你们能否实现99.9%的SLA承诺？" 这意味着要重构监控系统，林小默说至少需要一个月。';
      } else {
        return '客户给了一周时间。林小默连续三天没睡，做了一个临时稳定性补丁。第五天，系统又出现了小故障，持续5分钟。客户打来电话："我们需要重新考虑。"';
      }
    },
    reporter: 'lin',
    choices: [
      {
        text: '答应所有要求，加班赶工',
        effects: { funds: -5, morale: -10, reputation: 0, tech: +5, connections: 0 },
        principles: { transparency: 0, talent: -1, machine: 0, meritocracy: 0, pain: -2, legacy: 0 },
        message: '团队连续一周007。林小默累到住院，王美丽哭着说不想干了。但你完成了承诺，客户说："继续合作，但这次要降价20%。"',
        nextChapter: { eventId: 'E049', delay: 0, stateFlags: { result: 'kept_client', cost: 'high' }}
      },
      {
        text: '诚实告知需要时间，拒绝画饼',
        effects: { funds: -15, morale: +5, reputation: +10, tech: 0, connections: -10 },
        principles: { transparency: +3, talent: +1, machine: +1, meritocracy: 0, pain: +3, legacy: +1 },
        message: '你说："我不能为了留住你们就撒谎。两周做不到，我需要一个月。" 客户走了。但三个月后，他们又回来了："你是唯一不骗我们的。"',
        nextChapter: { eventId: 'E049', delay: 0, stateFlags: { result: 'lost_then_won', cost: 'medium' }}
      },
      {
        text: '放弃大客户，转向中小客户',
        effects: { funds: -10, morale: 0, reputation: 0, tech: 0, connections: -5 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: +2, legacy: +1 },
        message: '你决定不再伺候大客户。钱多多开发了标准化产品，签了20个小客户。虽然单价低，但总营收更稳定了。',
        nextChapter: { eventId: 'E049', delay: 0, stateFlags: { result: 'pivoted', cost: 'low' }}
      }
    ]
  },
  {
    id: 'E049', type: 'opportunity',
    isSeries: true, seriesId: 'S003', chapter: 3, totalChapters: 3,
    title: '大客户危机·第三章：复盘',
    dynamicDescription: (state) => {
      if (state.result === 'kept_client') {
        return '客户保住了，但代价是团队透支和利润下降。林小默出院后第一句话："老板，我们不能再这样了。" 你召开全员大会，需要总结这次危机。';
      } else if (state.result === 'lost_then_won') {
        return '失去再重新赢回客户，这个过程让你明白了什么叫"长期主义"。客户说："其实我们一直在观察你们，诚实的公司太少了。" 你需要建立新机制避免下次再出问题。';
      } else {
        return '转向小客户后，公司营收结构更健康了。虽然少了40%的大客户，但20个小客户分散了风险。钱多多说："这才是可持续的商业模式。"';
      }
    },
    reporter: 'wang',
    choices: [
      {
        text: '建立SLA保障制度和技术委员会',
        effects: { funds: -3, morale: +8, reputation: +8, tech: +10, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +3, meritocracy: +1, pain: 0, legacy: +3 },
        message: '你成立了技术委员会，制定了严格的SLA标准和事故响应流程。林小默成为技术负责人，有权叫停任何不稳定的上线。'
      },
      {
        text: '只追究责任人，扣绩效警告',
        effects: { funds: 0, morale: -15, reputation: 0, tech: -5, connections: 0 },
        principles: { transparency: -2, talent: -2, machine: -2, meritocracy: -2, pain: -2, legacy: -2 },
        message: '你扣了林小默的绩效，警告了运维团队。三个月后，林小默提了离职。王美丽说："老板，这不是个人的问题，是系统的问题。"'
      },
      {
        text: '什么都不改，继续前进',
        effects: { funds: 0, morale: -5, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: -2, meritocracy: 0, pain: -3, legacy: -2 },
        message: '你觉得这只是偶然事件。但六个月后，类似的问题又来了，这次失去的客户再也没回来。'
      }
    ]
  },

  // S004: 竞对挖人两部曲
  {
    id: 'E050', type: 'crisis',
    isSeries: true, seriesId: 'S004', chapter: 1, totalChapters: 2,
    title: '竞对挖人·第一章：挖角风波',
    description: '赵铁柱低声告诉你："老板，这两周竞对的HR来了三次，请咱们的人吃饭。听说开出了2倍工资。" 你观察了一下，技术骨干林小默和HR王美丽最近都在偷偷接电话。',
    reporter: 'zhao',
    choices: [
      {
        text: '主动加薪，先发制人',
        effects: { funds: -15, morale: +10, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: +1, machine: 0, meritocracy: 0, pain: 0, legacy: 0 },
        message: '你给核心员工集体涨薪30%。林小默很惊讶，王美丽红着眼说："老板，你怎么知道？" 竞对HR气得摔了电话。',
        nextChapter: { eventId: 'E051', delay: 0, stateFlags: { action: 'raise', team_loyalty: 'high' }}
      },
      {
        text: '召开透明大会，公开谈挖角',
        effects: { funds: 0, morale: +8, reputation: +10, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: +2, machine: 0, meritocracy: +1, pain: +2, legacy: +2 },
        message: '你召集全员："我知道竞对在挖人。每个人都有选择的自由，但我想说我们在做什么，以及为什么值得留下。" 会后，没人离职。',
        nextChapter: { eventId: 'E051', delay: 0, stateFlags: { action: 'transparent', team_loyalty: 'very_high' }}
      },
      {
        text: '装作不知道，观察谁会叛变',
        effects: { funds: 0, morale: -10, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: -3, talent: -1, machine: 0, meritocracy: 0, pain: -2, legacy: -1 },
        message: '你假装不知道，暗中观察。这种不信任的氛围让团队人心惶惶。两周后，王美丽递了辞职信："老板，我觉得你不信任我。"',
        nextChapter: { eventId: 'E051', delay: 0, stateFlags: { action: 'suspicious', team_loyalty: 'low' }}
      }
    ]
  },
  {
    id: 'E051', type: 'opportunity',
    isSeries: true, seriesId: 'S004', chapter: 2, totalChapters: 2,
    title: '竞对挖人·第二章：人才保卫战',
    dynamicDescription: (state) => {
      if (state.team_loyalty === 'very_high') {
        return '公开大会后，团队凝聚力空前。林小默甚至主动给竞对HR回了邮件："谢谢，但我老板值得我留下。" 一个月后，竞对有人想跳槽来你们公司。';
      } else if (state.team_loyalty === 'high') {
        return '加薪后，挖角风波暂时平息。但钱多多提醒你："老板，光靠钱留人不是长久之计，我们需要更深层的东西。" 你开始思考公司文化建设。';
      } else {
        return '王美丽离职后，带走了三个核心员工。林小默也在骑驴找马。陈画饼说:"老板，团队人心散了，得想办法重建信任。" 现在你需要亡羊补牢。';
      }
    },
    reporter: 'qian',
    choices: [
      {
        text: '建立股权激励计划，绑定长期利益',
        effects: { funds: 0, morale: +12, reputation: +8, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: +2, machine: +1, meritocracy: +2, pain: 0, legacy: +3 },
        message: '你推出了员工持股计划，核心员工都有期权。林小默算了算："四年后这可能值一套房。" 团队开始像老板一样思考。'
      },
      {
        text: '签竞业协议，法律约束',
        effects: { funds: 0, morale: -10, reputation: -5, tech: 0, connections: -5 },
        principles: { transparency: -2, talent: -2, machine: 0, meritocracy: 0, pain: -1, legacy: -2 },
        message: '你让所有人签竞业协议。林小默看着合同说："老板，你是信不过我们吗？" 办公室气氛降到冰点。'
      },
      {
        text: '打造学习型组织，用成长留人',
        effects: { funds: -5, morale: +10, reputation: +10, tech: +8, connections: +5 },
        principles: { transparency: +1, talent: +3, machine: +2, meritocracy: +2, pain: 0, legacy: +3 },
        message: '你设立了培训基金，每月技术分享，鼓励员工学习。林小默说："在这能学到东西，比高薪重要。" 公司成了人才孵化器。'
      }
    ]
  },

  // S005: 产品抄袭三部曲
  {
    id: 'E052', type: 'crisis',
    isSeries: true, seriesId: 'S005', chapter: 1, totalChapters: 3,
    title: '产品抄袭·第一章：山寨来袭',
    description: '林小默冲进办公室："老板！你看这个！" 他展示了一个竞品，UI和你们90%相似，连按钮颜色都一样。更可怕的是，他们免费，而你们收费。用户群里已经有人在问："为什么不用免费的那个？"',
    reporter: 'lin',
    choices: [
      {
        text: '也改成免费，用补贴抢用户',
        effects: { funds: -20, morale: 0, reputation: +5, tech: 0, connections: +5 },
        principles: { transparency: 0, talent: 0, machine: 0, meritocracy: 0, pain: -2, legacy: -1 },
        message: '你宣布免费策略。用户回来了，但收入没了。钱多多看着账本说："咱们还能撑4个月。" 烧钱大战开始了。',
        nextChapter: { eventId: 'E053', delay: 0, stateFlags: { strategy: 'free', cashburn: 'high' }}
      },
      {
        text: '差异化竞争，推出独特功能',
        effects: { funds: -10, morale: +5, reputation: 0, tech: +10, connections: 0 },
        principles: { transparency: 0, talent: +1, machine: +2, meritocracy: +1, pain: +1, legacy: +2 },
        message: '林小默带团队连续一个月开发新功能。你们推出了AI推荐和数据分析，这是山寨做不到的。部分用户回流："还是正版专业。"',
        nextChapter: { eventId: 'E053', delay: 0, stateFlags: { strategy: 'differentiate', innovation: 'high' }}
      },
      {
        text: '发公开信，揭露抄袭行为',
        effects: { funds: 0, morale: +3, reputation: +15, tech: 0, connections: +5 },
        principles: { transparency: +3, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: +1 },
        message: '你写了一篇《致抄袭者的公开信》，在论坛获赞10万。媒体报道了这件事，舆论站在你这边。但山寨还在继续运营。',
        nextChapter: { eventId: 'E053', delay: 0, stateFlags: { strategy: 'expose', public_support: 'high' }}
      }
    ]
  },
  {
    id: 'E053', type: 'crisis',
    isSeries: true, seriesId: 'S005', chapter: 2, totalChapters: 3,
    title: '产品抄袭·第二章：白热化',
    dynamicDescription: (state) => {
      if (state.strategy === 'free') {
        return '免费大战打了两个月，你的用户是涨了，但山寨也在涨。更糟的是，账上只剩50万了。投资人打来电话："你们的商业模式是什么？" 钱多多说："再这样下去就完了。"';
      } else if (state.strategy === 'differentiate') {
        return '新功能上线后，30%的用户回流了。但山寨也开始抄新功能，速度比你们还快。林小默抓狂："他们就是看我们代码抄的！" 你意识到需要建立更深的护城河。';
      } else {
        return '公开信火了，你成了"反抄袭斗士"。但现实是，山寨继续运营，你的用户还在流失。王美丽说："老板，道德制高点不能当饭吃，我们需要实际行动。"';
      }
    },
    reporter: 'wang',
    choices: [
      {
        text: '起诉抄袭，用法律武器',
        effects: { funds: -15, morale: -5, reputation: +10, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: 0, meritocracy: 0, pain: +3, legacy: +1 },
        message: '你请了律师，打了6个月官司。最终判你胜诉，但山寨公司直接关闭重开了个新马甲。钱花了，问题没解决。',
        nextChapter: { eventId: 'E054', delay: 0, stateFlags: { outcome: 'legal', result: 'pyrrhic' }}
      },
      {
        text: 'all-in 技术壁垒，重构核心算法',
        effects: { funds: -10, morale: +8, reputation: 0, tech: +15, connections: 0 },
        principles: { transparency: 0, talent: +2, machine: +3, meritocracy: +1, pain: +2, legacy: +3 },
        message: '你让林小默重构核心算法，改用深度学习模型。这是山寨抄不走的。三个月后，你们的推荐准确率甩开对手20%。',
        nextChapter: { eventId: 'E054', delay: 0, stateFlags: { outcome: 'tech', result: 'moat' }}
      },
      {
        text: '转向B端，放弃C端市场',
        effects: { funds: -5, morale: 0, reputation: -5, tech: 0, connections: +10 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: +2, legacy: +1 },
        message: '你决定放弃C端红海，转型做企业服务。B端客户更看重稳定性，不在乎是不是免费。钱多多签了三个大企业。',
        nextChapter: { eventId: 'E054', delay: 0, stateFlags: { outcome: 'pivot', result: 'survive' }}
      }
    ]
  },
  {
    id: 'E054', type: 'opportunity',
    isSeries: true, seriesId: 'S005', chapter: 3, totalChapters: 3,
    title: '产品抄袭·第三章：护城河',
    dynamicDescription: (state) => {
      if (state.result === 'moat') {
        return '技术壁垒建立后，山寨再也追不上了。更神奇的是，竞对开始来找你谈收购："我们抄不了你们的算法，不如合作？" 你手里有了筹码。';
      } else if (state.result === 'survive') {
        return '转型B端后，公司进入了新赛道。虽然市场小了，但利润更高。王美丽说："幸好当时没死磕，否则早就倒了。" 你学会了取舍的智慧。';
      } else {
        return '官司赢了，但时间和金钱都浪费了。你意识到竞争的本质不是消灭对手，而是让自己更强。林小默说："下次我们直接做技术创新吧。"';
      }
    },
    reporter: 'lin',
    choices: [
      {
        text: '开源核心技术，建立生态',
        effects: { funds: 0, morale: +10, reputation: +20, tech: +5, connections: +15 },
        principles: { transparency: +3, talent: +1, machine: +1, meritocracy: +1, pain: +1, legacy: +3 },
        message: '你把核心算法开源了。行业震惊，开发者蜂拥而至。六个月后，你们成了行业标准，山寨反而成了笑话。'
      },
      {
        text: '申请专利，建立技术壁垒',
        effects: { funds: -8, morale: 0, reputation: +5, tech: +8, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: +2, meritocracy: 0, pain: 0, legacy: +2 },
        message: '你申请了15项技术专利。以后谁再抄，直接法务警告。林小默说："这才是保护创新的正确方式。"'
      },
      {
        text: '专注用户体验，建立品牌忠诚',
        effects: { funds: -5, morale: +8, reputation: +15, tech: 0, connections: +10 },
        principles: { transparency: +1, talent: +1, machine: +1, meritocracy: +1, pain: 0, legacy: +2 },
        message: '你意识到真正的护城河是用户的心智。你们做了100个细节优化，客服响应速度提升10倍。用户说："山寨永远学不会你们的服务。"'
      }
    ]
  },

  // S006: 办公室政治两部曲
  {
    id: 'E055', type: 'daily',
    isSeries: true, seriesId: 'S006', chapter: 1, totalChapters: 2,
    title: '办公室政治·第一章：站队',
    description: '王美丽焦虑地找到你："老板，公司分成了两派。林小默和张大炮最近总是意见相左，技术和市场的矛盾越来越大。上周会上，张大炮说「技术总是延期」，林小默直接摔门走了。"',
    reporter: 'wang',
    choices: [
      {
        text: '召开协调会，公开讨论矛盾',
        effects: { funds: 0, morale: +5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: +1, machine: +1, meritocracy: +2, pain: +2, legacy: +1 },
        message: '你召集两人开了三小时会议。林小默说技术需要时间打磨，张大炮说客户等不了。你让他们理解彼此的压力。气氛缓和了。',
        nextChapter: { eventId: 'E056', delay: 0, stateFlags: { method: 'mediate', harmony: 'improved' }}
      },
      {
        text: '支持技术，让市场配合研发节奏',
        effects: { funds: 0, morale: +5, reputation: 0, tech: +10, connections: -5 },
        principles: { transparency: 0, talent: +1, machine: +2, meritocracy: 0, pain: 0, legacy: +1 },
        message: '你说："产品质量第一，市场要理解技术。" 林小默很满意，但张大炮觉得被孤立了。他开始考虑跳槽。',
        nextChapter: { eventId: 'E056', delay: 0, stateFlags: { method: 'favor_tech', harmony: 'imbalanced' }}
      },
      {
        text: '支持市场，要求技术提速',
        effects: { funds: +1, morale: 0, reputation: 0, tech: -10, connections: +5 },
        principles: { transparency: 0, talent: 0, machine: -2, meritocracy: 0, pain: 0, legacy: -1 },
        message: '你说："客户是上帝，技术要加班完成。" 张大炮很开心，但林小默加班一周后病倒了。技术团队士气低落。',
        nextChapter: { eventId: 'E056', delay: 0, stateFlags: { method: 'favor_sales', harmony: 'imbalanced' }}
      }
    ]
  },
  {
    id: 'E056', type: 'opportunity',
    isSeries: true, seriesId: 'S006', chapter: 2, totalChapters: 2,
    title: '办公室政治·第二章：机制',
    dynamicDescription: (state) => {
      if (state.harmony === 'improved') {
        return '协调会后，你意识到这不是人的问题，是流程的问题。市场承诺的功能，技术从没参与评估。你需要建立一个机制，让两个部门更好地协作。';
      } else {
        return '偏袒一方后，另一方的怨气更大了。刘阿姨说："老板，公司现在有两个小团体了，午饭都不坐一起。" 你意识到必须从根本上解决问题。';
      }
    },
    reporter: 'chen',
    choices: [
      {
        text: '建立产品委员会，市场技术共同决策',
        effects: { funds: 0, morale: +12, reputation: +5, tech: +8, connections: +5 },
        principles: { transparency: +3, talent: +2, machine: +3, meritocracy: +2, pain: 0, legacy: +3 },
        message: '你成立了产品委员会，任何功能承诺必须经过技术评审。市场和技术开始对话，而不是对抗。半年后，这成了公司最好的制度。'
      },
      {
        text: '强制团建，增进感情',
        effects: { funds: -3, morale: +3, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: 0, meritocracy: 0, pain: -1, legacy: 0 },
        message: '你组织了一次团建。大家表面和气，但根本矛盾没解决。三个月后，冲突又爆发了。陈画饼说："团建只能治标不治本。"'
      },
      {
        text: '设立KPI考核，用数据说话',
        effects: { funds: 0, morale: -5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: +1, meritocracy: +1, pain: 0, legacy: 0 },
        message: '你制定了严格的KPI。市场看业绩，技术看上线率。但这让两个部门更对立了，都在想办法让对方背锅。张大炮说："这不是解决问题，是制造问题。"'
      }
    ]
  },

  // S007: 市场危机三部曲
  {
    id: 'E057', type: 'crisis',
    isSeries: true, seriesId: 'S007', chapter: 1, totalChapters: 3,
    title: '市场危机·第一章：突然降温',
    description: '钱多多拿着最新数据报告冲进来："老板，出大事了！这个月新增用户环比下降60%，获客成本翻倍。更可怕的是，行业里三个竞对宣布倒闭。投资人开始撤资，整个赛道在崩盘。"',
    reporter: 'qian',
    choices: [
      {
        text: '大幅削减成本，活下来最重要',
        effects: { funds: +7, morale: -15, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: 0 },
        message: '你裁掉了30%的员工，砍掉了所有非核心业务，取消了办公室零食。公司活下来了，但士气跌到谷底。',
        nextChapter: { eventId: 'E058', delay: 0, stateFlags: { strategy: 'cut_cost', morale: 'low' }}
      },
      {
        text: '逆势加大投入，抢占市场份额',
        effects: { funds: -25, morale: +5, reputation: +10, tech: 0, connections: +10 },
        principles: { transparency: +1, talent: 0, machine: +1, meritocracy: 0, pain: +3, legacy: +1 },
        message: '你反其道而行之，加大市场投放，降价抢客户。钱烧得很快，但市场份额在增长。投资人说你"疯了"，但也有人说你"有魄力"。',
        nextChapter: { eventId: 'E058', delay: 0, stateFlags: { strategy: 'aggressive', cashburn: 'very_high' }}
      },
      {
        text: '转换赛道，寻找新市场',
        effects: { funds: -10, morale: 0, reputation: 0, tech: +5, connections: +5 },
        principles: { transparency: +2, talent: +1, machine: +2, meritocracy: +1, pain: +2, legacy: +1 },
        message: '你召集团队讨论："这个赛道不行了，我们去哪？" 林小默提议做企业服务，王美丽说可以试试海外市场。大家开始探索新方向。',
        nextChapter: { eventId: 'E058', delay: 0, stateFlags: { strategy: 'pivot', exploration: 'new_markets' }}
      }
    ]
  },
  {
    id: 'E058', type: 'crisis',
    isSeries: true, seriesId: 'S007', chapter: 2, totalChapters: 3,
    title: '市场危机·第二章：寒冬',
    dynamicDescription: (state) => {
      if (state.strategy === 'cut_cost') {
        return '裁员后的三个月，公司很安静。剩下的人都在默默工作，但没人笑了。更糟的是，两个核心员工也递了辞职信："老板，我们看不到希望。" 你开始怀疑自己的决策。';
      } else if (state.strategy === 'aggressive') {
        return '钱烧了三个月，市场份额确实涨了15%。但账上只剩40万了。投资人拒绝追投，说"市场环境太差"。钱多多说："再烧两个月就弹尽粮绝了。"';
      } else {
        return '你们试了三个新方向：企业服务、海外市场、AI工具。企业服务签了两个小单，海外没什么起色，AI工具倒是有点意思。但时间不多了，必须allin一个方向。';
      }
    },
    reporter: 'wang',
    choices: [
      {
        text: '极度透明，全员共度难关',
        effects: { funds: 0, morale: +10, reputation: +10, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: +2, machine: 0, meritocracy: +1, pain: +2, legacy: +2 },
        message: '你召开全员大会，公开了财务状况："账上还能撑4个月。我不会骗大家，但我不会放弃。" 全员投票决定降薪20%共渡难关。没人离职。',
        nextChapter: { eventId: 'E059', delay: 0, stateFlags: { approach: 'transparent', team_united: true }}
      },
      {
        text: '寻求被收购，给团队一个出路',
        effects: { funds: +13, morale: -10, reputation: -5, tech: 0, connections: +5 },
        principles: { transparency: +1, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: -1 },
        message: '你找了三家大公司谈收购。最终有家巨头愿意收购，团队能保留但你要当打工人。林小默说："至少大家有出路了。" 但你心里五味杂陈。',
        nextChapter: { eventId: 'E059', delay: 0, stateFlags: { approach: 'acquisition', independent: false }}
      },
      {
        text: '孤注一掷，押注单一方向',
        effects: { funds: -15, morale: +5, reputation: 0, tech: +10, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: +2, meritocracy: 0, pain: +3, legacy: +1 },
        message: '你决定all-in AI工具方向，其他业务全部砍掉。林小默带队三个月闭关开发。这是背水一战，要么成功，要么死亡。',
        nextChapter: { eventId: 'E059', delay: 0, stateFlags: { approach: 'all_in', risk: 'extreme' }}
      }
    ]
  },
  {
    id: 'E059', type: 'boss',
    isSeries: true, seriesId: 'S007', chapter: 3, totalChapters: 3,
    title: '市场危机·第三章：曙光或黄昏',
    dynamicDescription: (state) => {
      if (state.approach === 'transparent') {
        return '降薪共渡难关的第三个月，奇迹发生了。一个客户看到你们的故事，主动来谈合作："我们要的就是你们这种不放弃的团队。" 这笔订单让你们活了下来。';
      } else if (state.approach === 'acquisition') {
        return '收购完成了。你成了大厂的总监，团队保住了工作，工资还涨了。但你每天看着新工牌，想起那个差点改变世界的梦。王美丽说："至少我们努力过。"';
      } else {
        return 'All-in三个月后，产品上线了。第一周只有200个用户，你绝望了。但第二周，用户暴涨到5000。有个大V转发了你们："这才是真正的AI工具。" 你活过来了。';
      }
    },
    reporter: 'lin',
    choices: [
      {
        text: '总结经验，建立危机应对机制',
        effects: { funds: 0, morale: +10, reputation: +10, tech: +5, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +3, meritocracy: +1, pain: +3, legacy: +3 },
        message: '你复盘了整个过程，写了一份30页的《危机管理手册》。下次遇到黑天鹅，至少知道怎么应对。团队说："这次真的成长了。"'
      },
      {
        text: '庆祝胜利，给团队发奖金',
        effects: { funds: -8, morale: +15, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: +2, machine: 0, meritocracy: +1, pain: 0, legacy: +1 },
        message: '你给每个人发了一个月工资的奖金。团队聚餐时，刘阿姨哭了："跟着你，值了。" 士气空前高涨。'
      },
      {
        text: '继续保守，建立现金储备',
        effects: { funds: +7, morale: 0, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: +2, legacy: +1 },
        message: '经历过一次差点死亡，你变得极度保守。每一分钱都要算三遍，不敢冒险。林小默说："老板，你是不是有点过了？"'
      }
    ]
  },

  // S008: 技术债务两部曲
  {
    id: 'E060', type: 'crisis',
    isSeries: true, seriesId: 'S008', chapter: 1, totalChapters: 2,
    title: '技术债务·第一章：代码腐化',
    description: '林小默把你拉到一边："老板，我们必须谈谈技术债了。现在的代码是一年前为了赶进度堆出来的，每次加功能都像拆炸弹。上周那个bug修了三天，就是因为代码太乱了。再不重构，早晚出大事。"',
    reporter: 'lin',
    choices: [
      {
        text: '停止新功能，全力重构一个月',
        effects: { funds: -10, morale: +10, reputation: -5, tech: +15, connections: -5 },
        principles: { transparency: +2, talent: +1, machine: +3, meritocracy: 0, pain: +3, legacy: +3 },
        message: '你宣布技术停更一个月，全员重构。王美丽急了："客户在等新功能！" 但一个月后，系统焕然一新，开发速度提升50%。',
        nextChapter: { eventId: 'E061', delay: 0, stateFlags: { decision: 'refactor', quality: 'high' }}
      },
      {
        text: '边做新功能边重构，温水煮青蛙',
        effects: { funds: 0, morale: -5, reputation: 0, tech: +5, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: +1 },
        message: '你说："慢慢改吧，别影响业务。" 三个月过去了，代码还是那么烂。林小默说："这样永远改不完，技术债只会越欠越多。"',
        nextChapter: { eventId: 'E061', delay: 0, stateFlags: { decision: 'delay', quality: 'medium' }}
      },
      {
        text: '继续硬扛，先把业务做起来',
        effects: { funds: +1, morale: -10, reputation: 0, tech: -10, connections: +5 },
        principles: { transparency: 0, talent: -1, machine: -2, meritocracy: 0, pain: -2, legacy: -2 },
        message: '你说："技术债以后再说，先赚钱。" 林小默沉默了。两个月后，系统崩溃了三次，两个技术骨干离职了。',
        nextChapter: { eventId: 'E061', delay: 0, stateFlags: { decision: 'ignore', quality: 'low' }}
      }
    ]
  },
  {
    id: 'E061', type: 'opportunity',
    isSeries: true, seriesId: 'S008', chapter: 2, totalChapters: 2,
    title: '技术债务·第二章：长期主义',
    dynamicDescription: (state) => {
      if (state.quality === 'high') {
        return '重构后的三个月，开发效率明显提升。林小默说："现在加个功能只要半天，以前要三天。" 王美丽也承认："虽然当时急，但现在看是对的。" 你学到了什么叫长期主义。';
      } else if (state.quality === 'medium') {
        return '温水煮青蛙三个月后，技术债还在。更糟的是，新人看不懂代码，老人不想改。林小默说："要么现在下决心，要么以后代价更大。"';
      } else {
        return '系统连续崩溃后，客户开始投诉。技术团队剩下的人每天加班救火，但治标不治本。林小默递了辞职信："老板，我已经尽力了。" 你意识到技术债是还不掉了。';
      }
    },
    reporter: 'wang',
    choices: [
      {
        text: '建立代码质量规范和Review制度',
        effects: { funds: 0, morale: +8, reputation: 0, tech: +12, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +3, meritocracy: +1, pain: 0, legacy: +3 },
        message: '你成立了技术委员会，制定了代码规范。所有代码必须经过Review，不达标不能合并。林小默说："这才是工程师文化。"'
      },
      {
        text: '招更多人，用人力抵消技术债',
        effects: { funds: -15, morale: -5, reputation: 0, tech: -5, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: -2, meritocracy: 0, pain: -1, legacy: -2 },
        message: '你招了5个人。但烂代码加更多人只会更烂。三个月后，新人全离职了，说"这代码没法维护"。你烧了钱，问题更大了。'
      },
      {
        text: '重写，推倒重来',
        effects: { funds: -20, morale: 0, reputation: -10, tech: +20, connections: -10 },
        principles: { transparency: +1, talent: 0, machine: +3, meritocracy: 0, pain: +3, legacy: +2 },
        message: '你做了最激进的决定：整个系统推倒重写。花了三个月，客户流失了30%，但新系统是艺术品。林小默说："这是我写过最好的代码。"'
      }
    ]
  },

  // S009: 团队矛盾三部曲
  {
    id: 'E062', type: 'daily',
    isSeries: true, seriesId: 'S009', chapter: 1, totalChapters: 3,
    title: '团队矛盾·第一章：裂痕',
    description: '赵铁柱焦虑地找到你："老板，王美丽和陈画饼吵起来了！王美丽说陈画饼只会吹牛不干活，陈画饼说王美丽管太多超出HR的职责。两人在会议室摔了门，全公司都听见了。"',
    reporter: 'zhao',
    choices: [
      {
        text: '立刻介入，分别谈话',
        effects: { funds: 0, morale: +3, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: +2, machine: 0, meritocracy: +1, pain: +2, legacy: 0 },
        message: '你分别和两人谈了两小时。王美丽说陈画饼入职三个月连一个落地的方案都没有，陈画饼说王美丽不理解战略规划需要时间。你发现是职责不清导致的矛盾。',
        nextChapter: { eventId: 'E063', delay: 0, stateFlags: { approach: 'mediate', root_cause: 'unclear_roles' }}
      },
      {
        text: '让他们自己解决，别什么都找我',
        effects: { funds: 0, morale: -10, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: -2, talent: -2, machine: 0, meritocracy: 0, pain: -2, legacy: -1 },
        message: '你说："你们都是成年人，自己解决。" 但矛盾越来越大，办公室分成了两派。三周后，王美丽递了辞职信。',
        nextChapter: { eventId: 'E063', delay: 0, stateFlags: { approach: 'ignore', root_cause: 'escalated' }}
      },
      {
        text: '开全员大会，公开讨论问题',
        effects: { funds: 0, morale: +5, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: +1, machine: +1, meritocracy: +2, pain: +2, legacy: +2 },
        message: '你召集全员："我们不回避问题。王美丽和陈画饼的矛盾，其实是公司发展中的问题。大家一起讨论怎么解决。" 两小时后，达成了共识。',
        nextChapter: { eventId: 'E063', delay: 0, stateFlags: { approach: 'transparent', root_cause: 'systemic' }}
      }
    ]
  },
  {
    id: 'E063', type: 'crisis',
    isSeries: true, seriesId: 'S009', chapter: 2, totalChapters: 3,
    title: '团队矛盾·第二章：根源',
    dynamicDescription: (state) => {
      if (state.root_cause === 'unclear_roles') {
        return '谈话后你发现，王美丽认为陈画饼的战略规划完全脱离实际，招人计划都没法配合。陈画饼认为王美丽只管人事不该干涉业务决策。职位边界从来没明确过，两人都觉得对方越权了。你意识到这是组织架构的问题。';
      } else if (state.root_cause === 'escalated') {
        return '王美丽离职后，你失去了最擅长协调团队的人。陈画饼的战略没人帮他落地，三个月后全是空中楼阁。你意识到当初应该介入，但现在已经晚了。';
      } else {
        return '全员大会后，大家指出了更深层的问题：公司没有明确的分工，没有清晰的KPI，每个人都不知道自己该干什么。林小默说："这不是两个人的问题，是整个公司的问题。"';
      }
    },
    reporter: 'lin',
    choices: [
      {
        text: '重新梳理组织架构和岗位职责',
        effects: { funds: 0, morale: +10, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: +2, machine: +3, meritocracy: +2, pain: +1, legacy: +3 },
        message: '你花了两周时间，重新定义了每个人的职责和权限。王美丽负责人事和团队管理，陈画饼负责战略规划和对外合作。权责清晰后，矛盾消失了。',
        nextChapter: { eventId: 'E064', delay: 0, stateFlags: { solution: 'structure', effectiveness: 'high' }}
      },
      {
        text: '开除一个，杀鸡儆猴',
        effects: { funds: 0, morale: -15, reputation: -10, tech: 0, connections: -10 },
        principles: { transparency: -2, talent: -2, machine: 0, meritocracy: -2, pain: -1, legacy: -2 },
        message: '你开除了陈画饼。表面上矛盾解决了，但所有人都在想："下一个会是我吗？" 办公室气氛降到冰点，没人再敢提意见。',
        nextChapter: { eventId: 'E064', delay: 0, stateFlags: { solution: 'fire', effectiveness: 'negative' }}
      },
      {
        text: '引入外部顾问，建立沟通机制',
        effects: { funds: -8, morale: +8, reputation: +8, tech: 0, connections: +5 },
        principles: { transparency: +2, talent: +1, machine: +2, meritocracy: +1, pain: +1, legacy: +2 },
        message: '你请了组织发展顾问，建立了定期1on1、周会、OKR等机制。三个月后，团队沟通顺畅多了。顾问说："你们缺的不是人，是机制。"',
        nextChapter: { eventId: 'E064', delay: 0, stateFlags: { solution: 'mechanism', effectiveness: 'medium' }}
      }
    ]
  },
  {
    id: 'E064', type: 'opportunity',
    isSeries: true, seriesId: 'S009', chapter: 3, totalChapters: 3,
    title: '团队矛盾·第三章：文化',
    dynamicDescription: (state) => {
      if (state.effectiveness === 'high') {
        return '组织架构调整后，团队效率明显提升。更重要的是，大家知道了自己该干什么，不该干什么。钱多多说："这才像一个公司。" 你意识到文化需要制度支撑。';
      } else if (state.effectiveness === 'negative') {
        return '开除陈画饼后，业绩确实下滑了。更可怕的是，团队失去了信任。林小默私下说："老板，你这样处理问题，我们都害怕。" 你意识到自己错了，但覆水难收。';
      } else {
        return '引入机制后，沟通确实改善了。但你发现机制只是工具，真正重要的是公司文化：我们如何对待冲突？如何处理分歧？如何共同成长？';
      }
    },
    reporter: 'wang',
    choices: [
      {
        text: '写下公司价值观，让文化可见',
        effects: { funds: 0, morale: +10, reputation: +10, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: +2, machine: +1, meritocracy: +2, pain: 0, legacy: +3 },
        message: '你和核心团队一起定义了公司价值观：极度透明、创意择优、拥抱冲突、共同成长。这四条成了公司文化的基石。'
      },
      {
        text: '建立激励制度，用钱解决问题',
        effects: { funds: -10, morale: +5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: 0, meritocracy: 0, pain: 0, legacy: 0 },
        message: '你给每个人涨了薪，设立了奖金制度。表面和气了，但根本的信任问题没解决。钱多多说："钱能买到配合，买不到真心。"'
      },
      {
        text: '顺其自然，时间会解决一切',
        effects: { funds: 0, morale: 0, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: 0, meritocracy: 0, pain: -2, legacy: -1 },
        message: '你觉得别想太多。但六个月后，类似的矛盾又出现了。林小默说："老板，有些问题不主动解决，会一直存在。"'
      }
    ]
  },

  // S010: 资金链断裂四部曲
  {
    id: 'E065', type: 'boss',
    isSeries: true, seriesId: 'S010', chapter: 1, totalChapters: 4,
    title: '资金链断裂·第一章：警报',
    description: '钱多多拿着财务报表，脸色惨白："老板，大事不好。账上只剩35万了，按现在的烧钱速度，最多撑6周。上个季度承诺的融资还没到账，两个大客户押款拖了两个月。我们...可能要断粮了。"',
    reporter: 'qian',
    choices: [
      {
        text: '立刻裁员30%，断臂求生',
        effects: { funds: +7, morale: -20, reputation: -10, tech: -10, connections: -5 },
        principles: { transparency: 0, talent: 0, machine: 0, meritocracy: 0, pain: +3, legacy: 0 },
        message: '你连夜拟定了裁员名单。第二天宣布时，办公室一片死寂。被裁的人哭了，留下的人也哭了。钱是省了，但心散了。',
        nextChapter: { eventId: 'E066', delay: 0, stateFlags: { action: 'layoff', team_damage: 'severe' }}
      },
      {
        text: '全员降薪，共度难关',
        effects: { funds: +1, morale: -5, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: +1, machine: 0, meritocracy: +1, pain: +2, legacy: +2 },
        message: '你召开全员大会，公开财务状况："我们可以再撑8周，需要大家降薪30%。不想留的，我给双倍补偿。" 没人走，所有人选择留下。',
        nextChapter: { eventId: 'E066', delay: 0, stateFlags: { action: 'cut_salary', team_united: true }}
      },
      {
        text: '抵押个人资产，给公司续命',
        effects: { funds: +16, morale: +10, reputation: +10, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: 0, machine: 0, meritocracy: 0, pain: +3, legacy: +1 },
        message: '你抵押了自己的房子和车，往公司账户打了50万。团队知道后沉默了，王美丽哽咽："老板都这样了，我们还有什么理由不拼？"',
        nextChapter: { eventId: 'E066', delay: 0, stateFlags: { action: 'personal_investment', loyalty: 'extreme' }}
      }
    ]
  },
  {
    id: 'E066', type: 'crisis',
    isSeries: true, seriesId: 'S010', chapter: 2, totalChapters: 4,
    title: '资金链断裂·第二章：绝境',
    dynamicDescription: (state) => {
      if (state.action === 'layoff') {
        return '裁员后的两周，剩下的人心惶惶。林小默说："老板，核心团队走了三个，项目推不动了。" 更糟的是，裁员的消息传出去，客户开始担心你们会倒闭。';
      } else if (state.action === 'cut_salary') {
        return '降薪后的一个月，团队还在坚持。但账上又快见底了，承诺的融资还是没到账。刘阿姨偷偷告诉你："有人在找工作了，不是不想留，是怕公司撑不住。"';
      } else {
        return '你的个人投资让公司多撑了一个月，团队拼了命工作。但一个月过去了，钱又快没了，而你已经没有可抵押的资产了。这次是真的绝境了。';
      }
    },
    reporter: 'wang',
    choices: [
      {
        text: '疯狂接单，不管能不能做',
        effects: { funds: +7, morale: -10, reputation: -15, tech: -10, connections: -10 },
        principles: { transparency: -2, talent: 0, machine: -2, meritocracy: 0, pain: -2, legacy: -2 },
        message: '你让市场部见客户就签，不管需求合不合理。接了十几个单子，都是坑。三个月后，全部延期交付，客户集体投诉，品牌彻底毁了。',
        nextChapter: { eventId: 'E067', delay: 0, stateFlags: { strategy: 'desperate', reputation_loss: 'catastrophic' }}
      },
      {
        text: '找老客户借钱，承诺未来折扣',
        effects: { funds: +7, morale: 0, reputation: +5, tech: 0, connections: +10 },
        principles: { transparency: +3, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: +1 },
        message: '你硬着头皮给老客户打电话："我们遇到了资金问题，能不能预付款？我承诺未来给你们8折。" 三个客户答应了，借了40万。',
        nextChapter: { eventId: 'E067', delay: 0, stateFlags: { strategy: 'borrow', debt_owed: true }}
      },
      {
        text: '卖掉核心资产，换取现金',
        effects: { funds: +13, morale: -5, reputation: 0, tech: -15, connections: +5 },
        principles: { transparency: +1, talent: 0, machine: -2, meritocracy: 0, pain: +3, legacy: -2 },
        message: '你把公司最有价值的技术专利卖给了竞对，换了60万现金。林小默痛心："那是我们三年的心血..." 但至少活下来了。',
        nextChapter: { eventId: 'E067', delay: 0, stateFlags: { strategy: 'sell_assets', future_compromised: true }}
      }
    ]
  },
  {
    id: 'E067', type: 'boss',
    isSeries: true, seriesId: 'S010', chapter: 3, totalChapters: 4,
    title: '资金链断裂·第三章：转机',
    dynamicDescription: (state) => {
      if (state.strategy === 'desperate') {
        return '疯狂接单的后果来了。所有客户都在投诉，三家公司威胁起诉。王美丽说："老板，我们的名声彻底臭了，再也没人敢跟我们合作了。" 这可能是最后一章了。';
      } else if (state.strategy === 'borrow') {
        return '老客户的预付款让你撑过了最艰难的时刻。更神奇的是，其中一个客户说："看你们这么拼，我们公司想战略投资你们。" 绝处逢生的机会来了。';
      } else {
        return '卖掉专利后，你用这笔钱重新聚焦核心业务。虽然失去了技术优势，但至少活下来了。钱多多说："老板，有家产业基金想见你，说对我们的模式感兴趣。"';
      }
    },
    reporter: 'qian',
    choices: [
      {
        text: '接受战略投资，让渡部分控制权',
        effects: { funds: +13, morale: +10, reputation: +10, tech: 0, connections: +15 },
        principles: { transparency: +2, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: +1 },
        message: '你接受了客户公司300万的战略投资，代价是让出25%股权和一个董事会席位。不再是100%的老板，但公司活了。',
        nextChapter: { eventId: 'E068', delay: 0, stateFlags: { outcome: 'investment', control_diluted: true }}
      },
      {
        text: '申请银行贷款，保持独立',
        effects: { funds: +13, morale: 0, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: +1 },
        message: '你用公司资产和个人担保，从银行贷了40万。每月要还利息，压力很大，但至少公司还是你的。',
        nextChapter: { eventId: 'E068', delay: 0, stateFlags: { outcome: 'loan', debt_pressure: 'high' }}
      },
      {
        text: '接受收购要约，给团队出路',
        effects: { funds: +16, morale: -15, reputation: 0, tech: 0, connections: +10 },
        principles: { transparency: +2, talent: +1, machine: 0, meritocracy: 0, pain: +3, legacy: -1 },
        message: '你接受了竞对的收购要约。团队保留，但公司没了。签约那天，林小默说："至少我们努力过。" 你的BOSS梦，暂时结束了。',
        nextChapter: { eventId: 'E068', delay: 0, stateFlags: { outcome: 'acquired', independence_lost: true }}
      }
    ]
  },
  {
    id: 'E068', type: 'opportunity',
    isSeries: true, seriesId: 'S010', chapter: 4, totalChapters: 4,
    title: '资金链断裂·第四章：重生',
    dynamicDescription: (state) => {
      if (state.outcome === 'investment') {
        return '战略投资到账后，公司终于喘过气来。投资方还带来了资源和客户。虽然稀释了股权，但公司价值在增长。钱多多算了算："如果公司估值涨10倍，你25%的股也比之前100%值钱。"';
      } else if (state.outcome === 'loan') {
        return '银行贷款让你保持了独立，但每月还款压力巨大。你变得极度节省，每一分钱都要算三遍。半年后，公司扭亏为盈，贷款还清了。你保住了公司，也保住了控制权。';
      } else {
        return '被收购三个月后，你成了大公司的事业部总经理。工资涨了，但你每天看着这个曾经是你的公司，心里五味杂陈。王美丽说："老板，要不咱们攒够钱，再干一次？"';
      }
    },
    reporter: 'lin',
    choices: [
      {
        text: '建立财务预警机制，不再重蹈覆辙',
        effects: { funds: 0, morale: +10, reputation: +10, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: 0, machine: +3, meritocracy: 0, pain: +3, legacy: +3 },
        message: '你设立了现金流预警线，每周财务会议，每月应急预案演练。钱多多说："这次真的学到了。" 公司建立了真正的风险管理体系。'
      },
      {
        text: '感恩团队，发放特别奖金',
        effects: { funds: -10, morale: +15, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +1, talent: +2, machine: 0, meritocracy: +1, pain: 0, legacy: +2 },
        message: '你给每个坚持到最后的员工发了三个月工资的奖金。刘阿姨哭了："老板，能跟着你，是我这辈子最对的选择。" 团队凝聚力达到顶峰。'
      },
      {
        text: '扩张，把失去的都夺回来',
        effects: { funds: -15, morale: +5, reputation: 0, tech: 0, connections: +10 },
        principles: { transparency: 0, talent: 0, machine: 0, meritocracy: 0, pain: -1, legacy: 0 },
        message: '你决定激进扩张，补偿之前的损失。招人、开分公司、抢市场。王美丽担心："老板，我们刚缓过来，会不会又..."'
      }
    ]
  },

  // S011: 转型抉择三部曲
  {
    id: 'E069', type: 'opportunity',
    isSeries: true, seriesId: 'S011', chapter: 1, totalChapters: 3,
    title: '转型抉择·第一章：十字路口',
    description: '林小默拿着行业报告走进来："老板，我们的赛道在萎缩。去年增长30%，今年只有5%，明年可能负增长。但我研究了三个方向：AI、出海、B端转型。每个都有机会，但我们只能选一个。"',
    reporter: 'lin',
    choices: [
      {
        text: 'All-in AI，押注大模型应用',
        effects: { funds: -20, morale: +5, reputation: +10, tech: +15, connections: +5 },
        principles: { transparency: +1, talent: +1, machine: +3, meritocracy: 0, pain: +2, legacy: +2 },
        message: '你决定转型AI。林小默兴奋地组建了AI团队，三个月后发布了第一个大模型应用。市场反应不错，但烧钱速度也很快。',
        nextChapter: { eventId: 'E070', delay: 0, stateFlags: { direction: 'ai', risk: 'high', potential: 'huge' }}
      },
      {
        text: '出海东南亚，寻找增量市场',
        effects: { funds: -15, morale: 0, reputation: 0, tech: 0, connections: +15 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: +2, legacy: +1 },
        message: '你决定出海。王美丽带团队去了越南、泰国考察，三个月后在新加坡设立了办公室。文化差异很大，但市场空间确实大。',
        nextChapter: { eventId: 'E070', delay: 0, stateFlags: { direction: 'overseas', risk: 'medium', potential: 'medium' }}
      },
      {
        text: 'C端转B端，做企业服务',
        effects: { funds: -10, morale: -5, reputation: +5, tech: 0, connections: +10 },
        principles: { transparency: +1, talent: 0, machine: +2, meritocracy: 0, pain: +1, legacy: +2 },
        message: '你决定转型B端。钱多多带队拜访了十几家企业，签了第一个百万级大单。虽然销售周期长，但利润率是C端的5倍。',
        nextChapter: { eventId: 'E070', delay: 0, stateFlags: { direction: 'b2b', risk: 'low', potential: 'stable' }}
      }
    ]
  },
  {
    id: 'E070', type: 'crisis',
    isSeries: true, seriesId: 'S011', chapter: 2, totalChapters: 3,
    title: '转型抉择·第二章：阵痛',
    dynamicDescription: (state) => {
      if (state.direction === 'ai') {
        return '转型AI三个月后，你发现竞争比想象中激烈。大厂都在做，你们的产品被淹没了。更糟的是，GPU成本是预算的3倍。林小默说："要么加大投入碾压对手，要么找差异化方向。"';
      } else if (state.direction === 'overseas') {
        return '出海半年后，文化冲突爆发了。新加坡团队和国内团队理念不同，王美丽说当地员工"不能加班"，当地员工说王美丽"不尊重work-life balance"。两边都在抱怨。';
      } else {
        return '转型B端后，你发现企业客户太难伺候了。需求改了十几版，合同谈了三个月，还要开发票报税。林小默说："做C端一个月能上线三个功能，现在三个月才搞定一个客户。"';
      }
    },
    reporter: 'wang',
    choices: [
      {
        text: '坚持到底，转型没有回头路',
        effects: { funds: -15, morale: +5, reputation: +5, tech: +5, connections: +5 },
        principles: { transparency: +2, talent: 0, machine: +1, meritocracy: 0, pain: +3, legacy: +2 },
        message: '你咬牙坚持。虽然困难重重，但团队看到了你的决心。半年后，转型初见成效。王美丽说："还好老板当时没动摇。"',
        nextChapter: { eventId: 'E071', delay: 0, stateFlags: { commitment: 'full', success_chance: 'high' }}
      },
      {
        text: '调整策略，找差异化切入点',
        effects: { funds: -8, morale: +3, reputation: +3, tech: +8, connections: +3 },
        principles: { transparency: +1, talent: +1, machine: +2, meritocracy: +1, pain: +1, legacy: +2 },
        message: '你没有硬碰硬，而是找了细分领域。AI做垂直行业应用，出海专注小语种市场，B端聚焦中小企业。差异化策略见效了。',
        nextChapter: { eventId: 'E071', delay: 0, stateFlags: { commitment: 'adjusted', success_chance: 'medium' }}
      },
      {
        text: '两条腿走路，新老业务并行',
        effects: { funds: -5, morale: -10, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: -1, meritocracy: 0, pain: -2, legacy: -1 },
        message: '你决定新老业务都做。但资源分散了，团队不知道重点在哪。半年后，两边都没做好。林小默说："鱼和熊掌不可兼得。"',
        nextChapter: { eventId: 'E071', delay: 0, stateFlags: { commitment: 'split', success_chance: 'low' }}
      }
    ]
  },
  {
    id: 'E071', type: 'opportunity',
    isSeries: true, seriesId: 'S011', chapter: 3, totalChapters: 3,
    title: '转型抉择·第三章：新生',
    dynamicDescription: (state) => {
      if (state.success_chance === 'high') {
        return '坚持一年后，转型成功了。新业务营收占比从0%涨到60%，公司估值翻了三倍。投资人说："你是我见过最坚定的老板。" 你证明了战略定力的价值。';
      } else if (state.success_chance === 'medium') {
        return '差异化策略奏效了。虽然没有爆发式增长，但新业务稳定盈利。你找到了适合自己的路，不再跟大厂正面竞争。钱多多说："小而美，也挺好。"';
      } else {
        return '两条腿走路的结果是，两边都摔了。新业务没起来，老业务也丢了。你意识到战略摇摆是最大的敌人。林小默说："老板，我们需要重新聚焦了。"';
      }
    },
    reporter: 'lin',
    choices: [
      {
        text: '总结转型经验，形成方法论',
        effects: { funds: 0, morale: +10, reputation: +15, tech: +5, connections: +10 },
        principles: { transparency: +3, talent: +1, machine: +2, meritocracy: +1, pain: +2, legacy: +3 },
        message: '你写了一篇《小公司如何成功转型》，在科技媒体发表后阅读量百万。三家公司找你做顾问。你把痛苦变成了资产。'
      },
      {
        text: '继续探索，寻找下一个机会',
        effects: { funds: -10, morale: +5, reputation: 0, tech: +5, connections: +5 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: +1, legacy: +1 },
        message: '转型成功后，你又开始研究新方向。林小默说："老板，你是不是停不下来？" 你笑了："老板就是要永远保持好奇。"'
      },
      {
        text: '稳定发展，珍惜当下成果',
        effects: { funds: +7, morale: +5, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: +2 },
        message: '你决定不再折腾，专注把新业务做好。钱多多说："这才是成熟的老板。" 公司进入了稳定增长期。'
      }
    ]
  },

  // S012: 最终决战四部曲
  {
    id: 'E072', type: 'boss',
    isSeries: true, seriesId: 'S012', chapter: 1, totalChapters: 4,
    title: '最终决战·第一章：大考',
    description: '这是第12个月了。钱多多拿着年度报告走进来："老板，一年了。我们经历了开源危机、融资波折、客户流失、资金断裂...但我们还活着。现在，行业龙头想收购我们，开价3000万。接还是不接？"',
    reporter: 'qian',
    choices: [
      {
        text: '接受收购，套现离场',
        effects: { funds: +12, morale: -15, reputation: +5, tech: 0, connections: +10 },
        principles: { transparency: +1, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: -2 },
        message: '你接受了收购。签约那天，林小默问："老板，你真的甘心吗？" 你说："至少我们证明了自己的价值。" 一年当老板的路，暂时画上句号。',
        nextChapter: { eventId: 'E073', delay: 0, stateFlags: { choice: 'sell', journey: 'ended' }}
      },
      {
        text: '拒绝收购，继续独立发展',
        effects: { funds: 0, morale: +15, reputation: +10, tech: +5, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +1, meritocracy: +1, pain: +2, legacy: +3 },
        message: '你拒绝了收购："我们的故事才刚开始。" 团队欢呼。王美丽说："跟着这样的老板，值！" 你选择了更难但更有意义的路。',
        nextChapter: { eventId: 'E073', delay: 0, stateFlags: { choice: 'independent', journey: 'continues' }}
      },
      {
        text: '反向收购对方，成为整合者',
        effects: { funds: -30, morale: +10, reputation: +15, tech: +10, connections: +15 },
        principles: { transparency: +1, talent: +1, machine: +2, meritocracy: +1, pain: +3, legacy: +3 },
        message: '你大胆提出："不如我们合并，我来当CEO。" 对方愣住了，但最终接受了。你从被收购者变成了整合者。这是最大胆的一步棋。',
        nextChapter: { eventId: 'E073', delay: 0, stateFlags: { choice: 'merge', journey: 'expanded' }}
      }
    ]
  },
  {
    id: 'E073', type: 'boss',
    isSeries: true, seriesId: 'S012', chapter: 2, totalChapters: 4,
    title: '最终决战·第二章：回顾',
    dynamicDescription: (state) => {
      if (state.choice === 'sell') {
        return '收购完成后，你拿到了800万（扣除投资人和员工分成）。林小默、王美丽、钱多多、张大炮、赵铁柱、陈画饼都分到了钱。你请大家吃散伙饭，每个人都哭了。';
      } else if (state.choice === 'independent') {
        return '拒绝收购后，你们开了庆功会。林小默说："这一年，像做了一场梦。" 你回顾了所有经历的事件，每一个决策都历历在目。团队更团结了。';
      } else {
        return '合并后，公司规模扩大了3倍。你成了80人公司的CEO，林小默是CTO，王美丽是COO。从6个人的小团队到现在，你感慨万千。但新的挑战才刚开始。';
      }
    },
    reporter: 'chen',
    choices: [
      {
        text: '感谢团队，给每人写一封信',
        effects: { funds: 0, morale: +20, reputation: +10, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: +3, machine: 0, meritocracy: +2, pain: 0, legacy: +3 },
        message: '你给每个人写了一封手写信，回顾了这一年他们的贡献和成长。刘阿姨哭着说："老板，这是我收到过最好的礼物。" 这些信，他们会珍藏一辈子。'
      },
      {
        text: '开香槟庆祝，今夜不醉不归',
        effects: { funds: -3, morale: +15, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: +1, machine: 0, meritocracy: 0, pain: 0, legacy: +1 },
        message: '你们去了最贵的餐厅，点了最贵的香槟。陈画饼喝多了，抱着你说："老板，跟着你，不后悔！" 这一夜，大家笑着哭，哭着笑。'
      },
      {
        text: '低调处理，专注下一阶段',
        effects: { funds: 0, morale: +5, reputation: +5, tech: +5, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: +2, meritocracy: 0, pain: 0, legacy: +2 },
        message: '你没有大肆庆祝，只是发了一封简短的邮件："谢谢大家。明天，我们继续。" 林小默说："老板还是那么务实。"'
      }
    ]
  },
  {
    id: 'E074', type: 'boss',
    isSeries: true, seriesId: 'S012', chapter: 3, totalChapters: 4,
    title: '最终决战·第三章：传承',
    dynamicDescription: (state) => {
      if (state.choice === 'sell') {
        return '卖掉公司三个月后，你开始反思这一年学到的东西。达利欧的《原则》你又读了一遍。你决定把这一年的经验写下来，传承给更多BOSS。';
      } else if (state.choice === 'independent') {
        return '独立发展一年后，公司估值涨到了1.5亿。你开始思考：如何让公司在没有自己的情况下也能运转？如何建立可持续的文化和机制？';
      } else {
        return '合并后的第一年，你整合了两家公司的文化。你意识到，管理80人和管理6人完全不同。你需要建立更完善的制度，培养更多的管理者。';
      }
    },
    reporter: 'lin',
    choices: [
      {
        text: '写一本书《BOSS的原则》',
        effects: { funds: 0, morale: +10, reputation: +20, tech: 0, connections: +15 },
        principles: { transparency: +3, talent: +2, machine: +1, meritocracy: +2, pain: +2, legacy: +3 },
        message: '你花了三个月写了一本书，记录了这一年的所有决策和思考。出版后成了畅销书，无数老板从中受益。你的经验，成了他人的财富。'
      },
      {
        text: '建立管理团队，培养接班人',
        effects: { funds: -10, morale: +15, reputation: +10, tech: +10, connections: +5 },
        principles: { transparency: +2, talent: +3, machine: +3, meritocracy: +2, pain: +1, legacy: +3 },
        message: '你开始培养林小默、王美丽、钱多多。让他们轮流当"代理CEO"，学习决策。一年后，你发现没有你，公司也能运转得很好。这才是真正的成功。'
      },
      {
        text: '投资孵化新团队，扩大版图',
        effects: { funds: -20, morale: +5, reputation: +15, tech: +5, connections: +20 },
        principles: { transparency: +1, talent: +2, machine: +1, meritocracy: +1, pain: +1, legacy: +2 },
        message: '你用赚到的钱投资了三个团队，把自己的经验和资源分享给他们。你从老板变成了投资人，开始建立自己的生态。'
      }
    ]
  },
  {
    id: 'E075', type: 'boss',
    isSeries: true, seriesId: 'S012', chapter: 4, totalChapters: 4,
    title: '最终决战·第四章：传奇',
    dynamicDescription: (state) => {
      return '12个月过去了。你回顾这一年：从6个人到现在，从濒临破产到现在的规模，从迷茫不安到现在的从容。你学会了达利欧的原则，也创造了自己的原则。最重要的是，你和团队一起，度过了最艰难但也最精彩的一年。';
    },
    reporter: 'wang',
    choices: [
      {
        text: '重新出发，开启下一个十年',
        effects: { funds: 0, morale: +20, reputation: +20, tech: +10, connections: +15 },
        principles: { transparency: +3, talent: +3, machine: +2, meritocracy: +3, pain: +3, legacy: +3 },
        message: '你召集团队："这一年只是开始。未来十年，我们要成为行业第一。" 团队眼中有光。BOSS的故事，永远未完待续。'
      },
      {
        text: '珍惜当下，享受这一刻',
        effects: { funds: 0, morale: +15, reputation: +10, tech: 0, connections: +5 },
        principles: { transparency: +2, talent: +2, machine: 0, meritocracy: +1, pain: +2, legacy: +2 },
        message: '你没有规划宏伟蓝图，只是和团队一起，坐在办公室的天台上，看着这座城市。刘阿姨说："老板，谢谢你让我的生活有了意义。" 这一刻，已经足够美好。'
      },
      {
        text: '致敬所有当过老板的人',
        effects: { funds: 0, morale: +18, reputation: +15, tech: 0, connections: +10 },
        principles: { transparency: +3, talent: +2, machine: +1, meritocracy: +2, pain: +3, legacy: +3 },
        message: '你在朋友圈写道："致所有当老板路上的BOSS：我们都是在黑暗中摸索的人，但只要不放弃，总会看到光。" 这条朋友圈被转发了10万次。你的故事，激励了无数人。'
      }
    ]
  },

  // S013: 黑客攻击两部曲
  {
    id: 'E076', type: 'crisis',
    isSeries: true, seriesId: 'S013', chapter: 1, totalChapters: 2,
    title: '黑客攻击·第一章：数据失窃',
    description: '凌晨2点，林小默打来电话，声音颤抖："老板，服务器被攻击了，数据库全被加密。黑客留言：想要解密，打10个比特币到这个地址。" 你一算，10个比特币约等于300万。',
    reporter: 'lin',
    choices: [
      {
        text: '报警，绝不向黑客妥协',
        effects: { funds: -10, morale: -5, reputation: +8, tech: -5, connections: +5 },
        principles: { transparency: +3, talent: 0, machine: 0, meritocracy: 0, pain: +3, legacy: +2 },
        message: '你报警了。警方立案，但说破案周期可能很长。数据暂时找不回来，三个大客户威胁终止合同。但媒体报道你"有骨气"。',
        nextChapter: { eventId: 'E077', delay: 0, stateFlags: { action: 'police', data_lost: true }}
      },
      {
        text: '付赎金，先拿回数据再说',
        effects: { funds: -20, morale: 0, reputation: -8, tech: 0, connections: 0 },
        principles: { transparency: -2, talent: 0, machine: 0, meritocracy: 0, pain: -2, legacy: -1 },
        message: '你凑了300万打了过去。24小时后，数据真的恢复了。但消息泄露出去，圈内人说你"软弱"，更多黑客盯上了你。',
        nextChapter: { eventId: 'E077', delay: 0, stateFlags: { action: 'ransom', data_recovered: true }}
      },
      {
        text: '紧急启动备份，重建系统',
        effects: { funds: -8, morale: +5, reputation: 0, tech: +10, connections: 0 },
        principles: { transparency: +1, talent: +1, machine: +3, meritocracy: 0, pain: +2, legacy: +3 },
        message: '林小默说："幸好我偷偷做了异地备份。" 你们连续48小时不眠不休，系统重建完成，数据损失不到5%。这次教训让你们建立了完善的安全体系。',
        nextChapter: { eventId: 'E077', delay: 0, stateFlags: { action: 'backup', system_upgraded: true }}
      }
    ]
  },
  {
    id: 'E077', type: 'opportunity',
    isSeries: true, seriesId: 'S013', chapter: 2, totalChapters: 2,
    title: '黑客攻击·第二章：安全升级',
    dynamicDescription: (state) => {
      if (state.action === 'police') {
        return '报警一个月后，警方抓到了黑客。你们配合作证，成了"反勒索典型"。但数据永久丢失，你需要决定如何重建。';
      } else if (state.action === 'ransom') {
        return '付了赎金两周后，又有黑客来敲诈。这次要50万。你意识到妥协只会带来更多威胁。必须从根本上解决安全问题。';
      } else {
        return '备份救了公司一命，但林小默发现了更严重的问题："老板，我们的代码有17个安全漏洞，随时可能再被攻击。"  必须投入资源修复。';
      }
    },
    reporter: 'wang',
    choices: [
      {
        text: '招聘专业安全团队，投入重金',
        effects: { funds: -13, morale: +5, reputation: +8, tech: +13, connections: 0 },
        principles: { transparency: +1, talent: +2, machine: +3, meritocracy: 0, pain: +2, legacy: +3 },
        message: '你招了两个白帽黑客，月薪各5万。三个月后，系统安全等级达到银行级别。林小默说："这才是正规军。"'
      },
      {
        text: '买安全保险，转嫁风险',
        effects: { funds: -5, morale: 0, reputation: 0, tech: 0, connections: +5 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: +1 },
        message: '你买了网络安全保险，每年20万保费，最高赔付500万。虽然没解决根本问题，但至少有了兜底。钱多多："这叫风险对冲。"'
      },
      {
        text: '让林小默自学安全，省钱',
        effects: { funds: 0, morale: -10, reputation: 0, tech: +3, connections: 0 },
        principles: { transparency: 0, talent: -2, machine: 0, meritocracy: 0, pain: -1, legacy: -1 },
        message: '林小默买了十几本安全书籍，每天学到半夜。一个月后他说："老板，安全不是一个人能搞定的。" 他开始考虑离职。'
      }
    ]
  },

  // S014: 媒体危机三部曲
  {
    id: 'E078', type: 'crisis',
    isSeries: true, seriesId: 'S014', chapter: 1, totalChapters: 3,
    title: '媒体危机·第一章：负面报道',
    description: '早上打开手机，科技媒体头条：《XX公司涉嫌数据造假，多位员工匿名爆料》。文章里有大量"内部人士"的爆料，说你虚报用户数、拖欠工资、加班文化严重。虽然大部分是假的，但已经10万+了。',
    reporter: 'wang',
    choices: [
      {
        text: '立即发律师函，要求删稿道歉',
        effects: { funds: -5, morale: 0, reputation: -5, tech: 0, connections: -5 },
        principles: { transparency: -1, talent: 0, machine: 0, meritocracy: 0, pain: 0, legacy: 0 },
        message: '律师函发出后，媒体又发了篇《XX公司用律师函压制舆论》。事情闹更大了，微博热搜第三。王美丽："老板，这是火上浇油。"',
        nextChapter: { eventId: 'E079', delay: 0, stateFlags: { response: 'legal', situation: 'worse' }}
      },
      {
        text: '召开发布会，公开所有数据',
        effects: { funds: -3, morale: +10, reputation: +13, tech: 0, connections: +8 },
        principles: { transparency: +3, talent: 0, machine: 0, meritocracy: 0, pain: +3, legacy: +2 },
        message: '你当天就开了发布会，公开了财务报表、真实数据、员工工资明细。虽然数据确实不太好看，但你的坦诚赢得了尊重。网友热议："这才是负责任的老板。"',
        nextChapter: { eventId: 'E079', delay: 0, stateFlags: { response: 'transparent', situation: 'better' }}
      },
      {
        text: '找关系，希望媒体删稿',
        effects: { funds: -10, morale: 0, reputation: -10, tech: 0, connections: -8 },
        principles: { transparency: -3, talent: 0, machine: 0, meritocracy: 0, pain: -2, legacy: -2 },
        message: '你托关系花了10万，文章是删了，但截图已经满天飞。更糟的是，媒体曝光了你"花钱删稿"的行为。声誉彻底崩盘。',
        nextChapter: { eventId: 'E079', delay: 0, stateFlags: { response: 'bribe', situation: 'catastrophic' }}
      }
    ]
  },
  {
    id: 'E079', type: 'crisis',
    isSeries: true, seriesId: 'S014', chapter: 2, totalChapters: 3,
    title: '媒体危机·第二章：幕后黑手',
    dynamicDescription: (state) => {
      if (state.situation === 'catastrophic') {
        return '危机发酵三天后，你的竞对CEO在朋友圈转发了那篇文章，评论："做公司要诚信。" 你突然意识到，这可能是有人策划的舆论战。';
      } else if (state.situation === 'better') {
        return '发布会后，舆论反转。有记者私下联系你："我查到了，这篇报道的背后金主是你的竞对。他们花了30万买通了三个前员工。" 你需要决定如何应对。';
      } else {
        return '事态持续发酵。你调查后发现，爆料的"匿名员工"其实是竞对派来的卧底。这是一场精心策划的舆论战。你需要反击。';
      }
    },
    reporter: 'chen',
    choices: [
      {
        text: '公开竞对的阴谋，打舆论战',
        effects: { funds: 0, morale: +5, reputation: +10, tech: 0, connections: -5 },
        principles: { transparency: +3, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: +1 },
        message: '你在微博公开了证据链：卧底的聊天记录、转账记录、竞对的策划文档。舆论炸了，竞对被骂上热搜。虽然撕破脸了，但你赢了这场战争。',
        nextChapter: { eventId: 'E080', delay: 0, stateFlags: { action: 'expose', outcome: 'win' }}
      },
      {
        text: '私下谈判，达成和解',
        effects: { funds: +7, morale: 0, reputation: 0, tech: 0, connections: +5 },
        principles: { transparency: -1, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: 0 },
        message: '你约竞对CEO喝咖啡。他赔了20万，承诺不再恶意竞争。你们甚至谈了合作可能。但团队觉得你"太软"。',
        nextChapter: { eventId: 'E080', delay: 0, stateFlags: { action: 'negotiate', outcome: 'peace' }}
      },
      {
        text: '忍气吞声，专注做产品',
        effects: { funds: 0, morale: -8, reputation: -8, tech: +5, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: +1, meritocracy: 0, pain: +2, legacy: 0 },
        message: '你选择不回应。三个月后，用产品说话：用户增长50%，竞对反而掉了30%。但团队憋屈："我们明明没错，为什么不反击？"',
        nextChapter: { eventId: 'E080', delay: 0, stateFlags: { action: 'ignore', outcome: 'mixed' }}
      }
    ]
  },
  {
    id: 'E080', type: 'opportunity',
    isSeries: true, seriesId: 'S014', chapter: 3, totalChapters: 3,
    title: '媒体危机·第三章：危机公关',
    dynamicDescription: (state) => {
      if (state.outcome === 'win') {
        return '这场舆论战让你成了"敢说真话的老板"。五家媒体想采访你，三家投资机构主动联系。你需要决定如何利用这波热度。';
      } else if (state.outcome === 'peace') {
        return '和解后，表面风平浪静，但你意识到危机公关能力是公司的短板。你需要建立专业的PR团队，下次才不会这么被动。';
      } else {
        return '虽然最后产品赢了，但过程中流失了很多用户。王美丽说："老板，我们需要学会主动发声，不能总是被动挨打。"';
      }
    },
    reporter: 'wang',
    choices: [
      {
        text: '招聘专业PR总监，建立媒体关系',
        effects: { funds: -10, morale: +5, reputation: +10, tech: 0, connections: +13 },
        principles: { transparency: +1, talent: +2, machine: +1, meritocracy: 0, pain: 0, legacy: +2 },
        message: '你挖来了前大厂的PR总监，年薪80万。她三个月建立了100+媒体资源，公司每次发声都能上头条。这钱花得值。'
      },
      {
        text: '自己学习公关技巧，省钱',
        effects: { funds: 0, morale: 0, reputation: +3, tech: 0, connections: +3 },
        principles: { transparency: +1, talent: 0, machine: 0, meritocracy: 0, pain: +1, legacy: +1 },
        message: '你买了十几本公关书，参加了三个培训班。虽然不够专业，但基本套路学会了。下次再遇到危机，至少不会手忙脚乱。'
      },
      {
        text: '继续埋头做产品，不搞这些虚的',
        effects: { funds: 0, morale: -3, reputation: 0, tech: +8, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: +2, meritocracy: 0, pain: 0, legacy: +1 },
        message: '你觉得产品才是硬道理。但半年后又被黑了一次，这次损失更大。林小默说："老板，在这个时代，酒香也怕巷子深。"'
      }
    ]
  },

  // S015: 员工叛变三部曲
  {
    id: 'E081', type: 'crisis',
    isSeries: true, seriesId: 'S015', chapter: 1, totalChapters: 3,
    title: '员工叛变·第一章:小道消息',
    description: '赵铁柱偷偷告诉你："老板，我听说林小默和王美丽最近经常下班后一起出去，还约了外面的人见面。我怕他们......" 你心里一沉，这两个可是技术和HR的核心。',
    reporter: 'zhao',
    choices: [
      {
        text: '直接摊牌，问他们在搞什么',
        effects: { funds: 0, morale: -10, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: 0 },
        message: '你把两人叫到办公室："我听说你们最近有小动作？" 两人脸色一变。林小默说："老板，你连信任都没有了吗？" 气氛僵住了。',
        nextChapter: { eventId: 'E082', delay: 0, stateFlags: { approach: 'confront', trust_broken: true }}
      },
      {
        text: '暗中调查，掌握证据再说',
        effects: { funds: -3, morale: 0, reputation: 0, tech: 0, connections: -5 },
        principles: { transparency: -3, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: 0 },
        message: '你花钱请私家侦探跟踪。一周后拿到证据：他们确实在见投资人，准备自己出去干。但林小默也发现被跟踪了，感觉被羞辱。',
        nextChapter: { eventId: 'E082', delay: 0, stateFlags: { approach: 'investigate', evidence_found: true }}
      },
      {
        text: '主动谈心，了解他们真实想法',
        effects: { funds: 0, morale: +5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: +2, machine: 0, meritocracy: 0, pain: +1, legacy: +1 },
        message: '你约两人吃饭："最近工作压力大吗？有什么想法可以跟我说。" 王美丽叹气："老板，我们确实在考虑一些事，但还没想好..." 至少他们愿意沟通了。',
        nextChapter: { eventId: 'E082', delay: 0, stateFlags: { approach: 'talk', door_open: true }}
      }
    ]
  },
  {
    id: 'E082', type: 'crisis',
    isSeries: true, seriesId: 'S015', chapter: 2, totalChapters: 3,
    title: '员工叛变·第二章：摊牌',
    dynamicDescription: (state) => {
      if (state.approach === 'confront') {
        return '第二天，林小默和王美丽联名递交辞职信："老板，既然你不信任我们，那我们走。我们确实在准备出去单干，但原本想等项目稳定再说的。现在不用等了。"';
      } else if (state.approach === 'investigate') {
        return '你拿出调查证据："我都知道了，你们准备做什么？抄袭我们的产品？" 林小默愤怒："老板，你派人跟踪我们？就算我们想单干，也不会抄袭。你太过分了！"';
      } else {
        return '饭局后一周，两人主动找你："老板，我们摊牌吧。我们确实想自己出去干，但方向和公司不冲突。我们希望体面地离开，甚至可以保持合作。" 你怎么回应？';
      }
    },
    reporter: 'lin',
    choices: [
      {
        text: '提出加薪和股权，竭力挽留',
        effects: { funds: -13, morale: +10, reputation: 0, tech: +8, connections: 0 },
        principles: { transparency: +1, talent: +3, machine: 0, meritocracy: +2, pain: 0, legacy: +2 },
        message: '你开出诱人条件：薪资翻倍，5%股权，CTO和VP头衔。林小默犹豫了："老板...我们考虑一下。" 王美丽说："你终于看到我们的价值了。"',
        nextChapter: { eventId: 'E083', delay: 0, stateFlags: { result: 'retained', cost_high: true }}
      },
      {
        text: '祝福他们，提出战略合作',
        effects: { funds: 0, morale: 0, reputation: +10, tech: -10, connections: +10 },
        principles: { transparency: +3, talent: +2, machine: 0, meritocracy: +1, pain: +3, legacy: +3 },
        message: '你说："我尊重你们的选择。如果可以，我愿意天使投资你们的项目，未来也可以业务合作。" 两人眼眶红了："老板，谢谢你。我们不会让你失望。"',
        nextChapter: { eventId: 'E083', delay: 0, stateFlags: { result: 'blessed', relationship_good: true }}
      },
      {
        text: '翻脸，启动竞业禁止条款',
        effects: { funds: -5, morale: -15, reputation: -10, tech: -13, connections: -10 },
        principles: { transparency: -2, talent: -3, machine: 0, meritocracy: -2, pain: -2, legacy: -2 },
        message: '你拿出合同："你们签过竞业协议，两年内不能做相关领域。" 林小默笑了："老板，你觉得这纸合同拦得住人心吗？" 他们当天就走了，团队士气崩盘。',
        nextChapter: { eventId: 'E083', delay: 0, stateFlags: { result: 'lawsuit', relationship_destroyed: true }}
      }
    ]
  },
  {
    id: 'E083', type: 'opportunity',
    isSeries: true, seriesId: 'S015', chapter: 3, totalChapters: 3,
    title: '员工叛变·第三章：半年后',
    dynamicDescription: (state) => {
      if (state.result === 'retained') {
        return '你用高价留住了两人。半年过去，他们确实更卖力了，但你发现他们开始招自己的人，形成小团体。陈画饼私下说："老板，你是花钱买了定时炸弹。"';
      } else if (state.result === 'blessed') {
        return '半年后，林小默的项目拿到了A轮融资，估值5000万。他们主动找你合作，成了你的技术服务商。王美丽在朋友圈发："永远感激前老板的成全。" 你的声誉在圈内炸了。';
      } else {
        return '半年后，林小默的新公司推出了和你极其相似的产品，还挖走了三个你的客户。行业里传开了："XX公司的老板翻脸不认人，员工都跑了。" 招聘困难重重。';
      }
    },
    reporter: 'chen',
    choices: [
      {
        text: '建立完善的股权激励机制',
        effects: { funds: -7, morale: +13, reputation: +5, tech: +5, connections: 0 },
        principles: { transparency: +2, talent: +3, machine: +3, meritocracy: +2, pain: +1, legacy: +3 },
        message: '你聘请律师设计了期权池，核心员工都能分享公司成长。陈画饼说："早该这样了，人心比钱更值钱。" 离职率降到了10%以下。'
      },
      {
        text: '复盘反思，改善团队文化',
        effects: { funds: 0, morale: +8, reputation: +8, tech: 0, connections: +5 },
        principles: { transparency: +3, talent: +2, machine: +1, meritocracy: +1, pain: +3, legacy: +2 },
        message: '你组织了全员复盘会："这次事件让我明白，我还有很多不足。" 你改变了很多：每周1对1，透明分享公司数据，鼓励内部孵化。刘阿姨说："老板你终于长大了。"'
      },
      {
        text: '加强管控，签更严格的合同',
        effects: { funds: 0, morale: -10, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: -2, talent: -2, machine: +1, meritocracy: -1, pain: 0, legacy: -1 },
        message: '你让所有员工签署更严格的保密和竞业协议。钱多多说："老板，这像监狱，不像公司。" 三个月内又走了五个人，都说"文化变了"。'
      }
    ]
  },

  // S016: 政府监管两部曲
  {
    id: 'E084', type: 'crisis',
    isSeries: true, seriesId: 'S016', chapter: 1, totalChapters: 2,
    title: '政府监管·第一章：突击检查',
    description: '周五下午，市场监管局、消防、税务三个部门同时上门："例行检查。" 你心里一紧。三小时后，检查组列出了十几条"问题"：消防通道堆杂物、发票不规范、劳动合同缺条款...',
    reporter: 'qian',
    choices: [
      {
        text: '找关系，希望大事化小',
        effects: { funds: -13, morale: 0, reputation: -10, tech: 0, connections: +5 },
        principles: { transparency: -3, talent: 0, machine: 0, meritocracy: 0, pain: -2, legacy: -2 },
        message: '你托人情花了20万"摆平"。问题是解决了，但你知道这是个无底洞。钱多多说："老板，下次他们还会来的。" 果然，三个月后又来了。',
        nextChapter: { eventId: 'E085', delay: 0, stateFlags: { approach: 'bribe', vicious_cycle: true }}
      },
      {
        text: '认真整改，合规经营',
        effects: { funds: -8, morale: -3, reputation: +10, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: 0, machine: +2, meritocracy: 0, pain: +3, legacy: +3 },
        message: '你花了两周时间全面整改：请专业团队做消防改造、聘请财务顾问规范账目、重签所有劳动合同。虽然折腾，但验收一次性通过，拿到了"合规示范企业"的牌子。',
        nextChapter: { eventId: 'E085', delay: 0, stateFlags: { approach: 'comply', foundation_solid: true }}
      },
      {
        text: '据理力争，投诉过度执法',
        effects: { funds: -3, morale: 0, reputation: -5, tech: 0, connections: -10 },
        principles: { transparency: +1, talent: 0, machine: 0, meritocracy: +1, pain: +2, legacy: 0 },
        message: '你查了法条，发现有几条根本站不住脚，写了投诉信。上级部门确实撤销了两条，但你得罪了基层执法者。半年后各种检查频繁，你后悔了。',
        nextChapter: { eventId: 'E085', delay: 0, stateFlags: { approach: 'fight', relations_bad: true }}
      }
    ]
  },
  {
    id: 'E085', type: 'opportunity',
    isSeries: true, seriesId: 'S016', chapter: 2, totalChapters: 2,
    title: '政府监管·第二章：政策红利',
    dynamicDescription: (state) => {
      if (state.approach === 'bribe') {
        return '区政府推出"高新企业扶持计划"，最高补贴50万。但申报条件第一条就是："近两年无违规记录"。你的"黑历史"让你失去了资格。';
      } else if (state.approach === 'comply') {
        return '区政府推出"合规示范企业奖励"，你因为之前的整改被列入首批名单：50万现金奖励，三年税收优惠，还有政府背书。投资人看到新闻，主动联系你。';
      } else {
        return '区政府准备评选"创新企业100强"，你的产品很符合条件。但评委会里有你投诉过的那位执法者，你需要决定如何应对。';
      }
    },
    reporter: 'wang',
    choices: [
      {
        text: '积极申报政府项目，拿补贴',
        effects: { funds: +20, morale: +5, reputation: +13, tech: 0, connections: +13 },
        principles: { transparency: +2, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: +2 },
        message: '你研究了所有政策，申报了三个项目，拿到了补贴和税收减免。更重要的是，进入了政府的"重点扶持企业名单"，很多事都有绿色通道了。'
      },
      {
        text: '低调经营，不惹事不申报',
        effects: { funds: 0, morale: 0, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: 0, talent: 0, machine: 0, meritocracy: 0, pain: 0, legacy: 0 },
        message: '你觉得和政府打交道太复杂，还是专心做产品。但你发现竞对因为拿了政府订单，营收超过你了。陈画饼："老板，时代变了，政商关系也是核心竞争力。"'
      },
      {
        text: '主动修复关系，登门道歉',
        effects: { funds: -3, morale: 0, reputation: +5, tech: 0, connections: +10 },
        principles: { transparency: +2, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: +1 },
        message: '你约那位执法者喝茶："当时年轻气盛，得罪了。" 对方笑了："能认错就好，做企业不容易，我理解。" 关系缓和了，后来他还帮你对接了几个政府项目。'
      }
    ]
  },

  // S017: 产品发布灾难三部曲
  {
    id: 'E086', type: 'crisis',
    isSeries: true, seriesId: 'S017', chapter: 1, totalChapters: 3,
    title: '产品发布·第一章：上线翻车',
    description: '新版本终于上线了！你开了香槟庆祝。两小时后，林小默冲进来："老板，服务器崩了！用户量超预期10倍，系统撑不住了！" 与此同时，客服说：已经收到300条投诉，都在骂"垃圾产品"。',
    reporter: 'lin',
    choices: [
      {
        text: '紧急回滚旧版本，稳定优先',
        effects: { funds: 0, morale: -5, reputation: -10, tech: 0, connections: -5 },
        principles: { transparency: +1, talent: 0, machine: +1, meritocracy: 0, pain: +2, legacy: 0 },
        message: '你下令回滚。用户数据丢失了两小时的记录，骂声更大了。但至少系统稳定了。林小默说："老板，我们没做好压力测试，是我的锅。"',
        nextChapter: { eventId: 'E087', delay: 0, stateFlags: { action: 'rollback', reputation_damaged: true }}
      },
      {
        text: '加钱扩容，硬刚到底',
        effects: { funds: -13, morale: +5, reputation: +5, tech: +8, connections: 0 },
        principles: { transparency: +1, talent: +1, machine: +2, meritocracy: 0, pain: +3, legacy: +1 },
        message: '你打电话给云服务商："不管多少钱，给我10倍服务器，一小时内！" 烧了30万，系统终于稳了。虽然亏钱，但用户说："这公司有魄力。"',
        nextChapter: { eventId: 'E087', delay: 0, stateFlags: { action: 'expand', cost_high: true }}
      },
      {
        text: '发公告致歉，承诺补偿用户',
        effects: { funds: -7, morale: 0, reputation: +8, tech: 0, connections: +5 },
        principles: { transparency: +3, talent: 0, machine: 0, meritocracy: 0, pain: +2, legacy: +1 },
        message: '你连夜写了道歉信，承诺给所有用户补偿VIP会员。虽然系统还崩着，但用户看到了诚意。第二天上了热搜："这届老板还挺真诚。"',
        nextChapter: { eventId: 'E087', delay: 0, stateFlags: { action: 'apologize', trust_building: true }}
      }
    ]
  },
  {
    id: 'E087', type: 'crisis',
    isSeries: true, seriesId: 'S017', chapter: 2, totalChapters: 3,
    title: '产品发布·第二章：Bug危机',
    dynamicDescription: (state) => {
      if (state.action === 'rollback') {
        return '回滚后第三天，又发现了新Bug：支付功能失效，已经有50个用户付了钱但没收到服务。他们在微博集体维权，@了消费者协会。这次真要出大事了。';
      } else if (state.action === 'expand') {
        return '系统稳定了，但用户发现了致命Bug：隐私设置失效，所有人的个人信息都公开了。一个大V发微博："XX公司在裸奔，用户数据全泄露！" 转发10万+。';
      } else {
        return '致歉获得了好评，但技术团队发现Bug根源：核心代码有逻辑错误，必须重写。林小默说："这需要两周，但线上还有50万用户在用着有问题的版本..."';
      }
    },
    reporter: 'wang',
    choices: [
      {
        text: '全员加班修Bug，不眠不休',
        effects: { funds: -5, morale: -13, reputation: 0, tech: +10, connections: 0 },
        principles: { transparency: 0, talent: -1, machine: +2, meritocracy: 0, pain: -2, legacy: 0 },
        message: '技术团队连续72小时没回家。Bug修好了，但林小默进了医院，王美丽辞职了，刘阿姨哭着说："老板，命比钱重要。" 你赢了战役，却在输掉战争。',
        nextChapter: { eventId: 'E088', delay: 0, stateFlags: { method: 'crunch', team_burned: true }}
      },
      {
        text: '暂停服务，彻底修复再上线',
        effects: { funds: -10, morale: 0, reputation: -8, tech: +13, connections: -5 },
        principles: { transparency: +3, talent: +1, machine: +3, meritocracy: 0, pain: +3, legacy: +3 },
        message: '你发公告："我们下线两周，彻底解决问题。" 用户骂疯了，竞对趁机抢客户。但两周后重新上线，系统稳如狗，好评如潮。长痛不如短痛。',
        nextChapter: { eventId: 'E088', delay: 0, stateFlags: { method: 'pause', foundation_rebuilt: true }}
      },
      {
        text: '外包给专业团队，花钱买时间',
        effects: { funds: -20, morale: +3, reputation: 0, tech: +5, connections: +5 },
        principles: { transparency: 0, talent: +2, machine: +1, meritocracy: +1, pain: 0, legacy: +1 },
        message: '你找了行业最好的外包团队，一周搞定，花了50万。贵是贵，但团队没垮，产品也稳了。林小默说："老板，有时候花钱能买来团队的命。"',
        nextChapter: { eventId: 'E088', delay: 0, stateFlags: { method: 'outsource', money_solved: true }}
      }
    ]
  },
  {
    id: 'E088', type: 'opportunity',
    isSeries: true, seriesId: 'S017', chapter: 3, totalChapters: 3,
    title: '产品发布·第三章：绝地反击',
    dynamicDescription: (state) => {
      if (state.method === 'crunch') {
        return '危机过去了，但团队元气大伤。三个核心员工离职，招聘又招不到人（行业传你"压榨员工"）。产品虽然能用，但没人维护了。你需要重建团队。';
      } else if (state.method === 'pause') {
        return '两周停服后重新上线，用户发现产品脱胎换骨。日活从5万涨到20万，科技媒体主动采访："这是我见过最负责任的产品迭代。" 你抓住了第二次机会。';
      } else {
        return '外包团队修好了Bug，但没解决根本问题：你的技术团队能力不足。林小默坦白："老板，我们水平确实有限，要么招人，要么培训，否则下次还会翻车。"';
      }
    },
    reporter: 'lin',
    choices: [
      {
        text: '高薪挖角，组建明星团队',
        effects: { funds: -20, morale: +8, reputation: +10, tech: +15, connections: +5 },
        principles: { transparency: +1, talent: +3, machine: +1, meritocracy: +2, pain: 0, legacy: +2 },
        message: '你从BAT挖了三个P8，组建了"梦之队"。虽然烧钱，但产品质量飞跃。半年后拿到了A轮融资，投资人说："终于看到专业团队了。"'
      },
      {
        text: '建立完善的测试和发布流程',
        effects: { funds: -5, morale: +5, reputation: +5, tech: +10, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +3, meritocracy: 0, pain: +2, legacy: +3 },
        message: '你聘请了质量管理顾问，建立了严格的测试、灰度、发布流程。林小默说："虽然慢了，但再也不会翻车了。" 后来这套流程成了行业标准。'
      },
      {
        text: '转型做简单产品，降低技术门槛',
        effects: { funds: 0, morale: -5, reputation: -5, tech: -5, connections: 0 },
        principles: { transparency: 0, talent: -1, machine: 0, meritocracy: 0, pain: -1, legacy: -1 },
        message: '你砍掉了所有复杂功能，做最简单的版本。确实不翻车了，但用户说"平庸"。林小默辞职了："老板，我想做有挑战的事。" 你陷入了平庸陷阱。'
      }
    ]
  },

  // S018: 合作伙伴背叛两部曲
  {
    id: 'E089', type: 'crisis',
    isSeries: true, seriesId: 'S018', chapter: 1, totalChapters: 2,
    title: '合作背叛·第一章：撕毁协议',
    description: '周一早上，收到合作伙伴的律师函："由于贵司违反合同第X条（实际上你没违反），我司单方面终止合作，并保留追责权利。" 这个合作伙伴占你30%营收，一旦终止，现金流立刻断裂。',
    reporter: 'qian',
    choices: [
      {
        text: '立即起诉，维护合法权益',
        effects: { funds: -10, morale: 0, reputation: +5, tech: 0, connections: -10 },
        principles: { transparency: +2, talent: 0, machine: 0, meritocracy: +1, pain: +2, legacy: +1 },
        message: '你聘请了最好的律师，证据充分。官司打了半年，你赢了，拿到了赔偿。但行业传开了："XX公司爱打官司"，其他合作方都谨慎了。',
        nextChapter: { eventId: 'E090', delay: 0, stateFlags: { action: 'lawsuit', reputation_mixed: true }}
      },
      {
        text: '谈判妥协，降价续约',
        effects: { funds: -5, morale: -5, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: -1, talent: 0, machine: 0, meritocracy: 0, pain: -1, legacy: 0 },
        message: '你主动让步：降价20%，增加服务。对方答应续约了，但团队觉得你"软弱"。更糟的是，对方一年后又来敲诈，因为他们知道你会妥协。',
        nextChapter: { eventId: 'E090', delay: 0, stateFlags: { action: 'compromise', weakness_exposed: true }}
      },
      {
        text: '紧急开发新客户，分散风险',
        effects: { funds: -8, morale: +5, reputation: 0, tech: 0, connections: +13 },
        principles: { transparency: +1, talent: +1, machine: +2, meritocracy: 0, pain: +3, legacy: +2 },
        message: '你发动全员BD，两个月签下5个新客户。虽然辛苦，但营收结构更健康了。钱多多："老板，这次教训让我们学会了不把鸡蛋放一个篮子。"',
        nextChapter: { eventId: 'E090', delay: 0, stateFlags: { action: 'diversify', risk_reduced: true }}
      }
    ]
  },
  {
    id: 'E090', type: 'opportunity',
    isSeries: true, seriesId: 'S018', chapter: 2, totalChapters: 2,
    title: '合作背叛·第二章：行业洗牌',
    dynamicDescription: (state) => {
      if (state.action === 'lawsuit') {
        return '半年后，那个背叛你的合作伙伴因为经营不善倒闭了。多家媒体采访你："当初为什么坚持起诉？" 你成了"守护契约精神"的典范，新客户主动找上门。';
      } else if (state.action === 'compromise') {
        return '一年后，那个合作伙伴又来要求降价，威胁否则终止。你发现自己陷入了恶性循环：越妥协越被欺负。你需要做出改变。';
      } else {
        return '因为提前分散了风险，你安然度过了那次危机。更意外的是，有三个新客户看中了你的"抗压能力"和"风险意识"，主动提出长期战略合作。';
      }
    },
    reporter: 'chen',
    choices: [
      {
        text: '建立客户分级制度，优化合作结构',
        effects: { funds: 0, morale: +5, reputation: +8, tech: 0, connections: +10 },
        principles: { transparency: +2, talent: +1, machine: +3, meritocracy: +1, pain: +1, legacy: +3 },
        message: '你建立了客户评级系统：S级战略客户、A级优质客户、B级普通客户。S级客户给最好的服务和价格，但需要双向绑定。这套系统后来成了公司的护城河。'
      },
      {
        text: '开发自有产品，减少对客户依赖',
        effects: { funds: -13, morale: +8, reputation: +5, tech: +13, connections: 0 },
        principles: { transparency: +1, talent: +2, machine: +2, meritocracy: 0, pain: +2, legacy: +3 },
        message: '你决定不再做"乙方"，而是做自己的产品。虽然转型艰难，但一年后推出了SaaS产品，订阅用户5000+。钱多多："老板，这才是可持续的商业模式。"'
      },
      {
        text: '加入行业协会，建立同盟',
        effects: { funds: -3, morale: 0, reputation: +10, tech: 0, connections: +15 },
        principles: { transparency: +2, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: +2 },
        message: '你加入了行业协会，和20家同行建立了"互助联盟"：共享黑名单、联合议价、互相推荐客户。一年后，联盟成员的平均利润率提升了15%。'
      }
    ]
  },

  // S019: 国际扩张三部曲
  {
    id: 'E091', type: 'opportunity',
    isSeries: true, seriesId: 'S019', chapter: 1, totalChapters: 3,
    title: '国际扩张·第一章：出海诱惑',
    description: '一家新加坡投资机构找到你："你们的产品在国内做得不错，有没有兴趣出海东南亚？我们可以提供资金和本地资源。" 陈画饼兴奋："老板，这是国际化的机会！" 但林小默担心："我们国内还没站稳..."',
    reporter: 'chen',
    choices: [
      {
        text: '全力出海，抓住机会',
        effects: { funds: -13, morale: +8, reputation: +13, tech: 0, connections: +13 },
        principles: { transparency: +1, talent: +1, machine: +1, meritocracy: 0, pain: +2, legacy: +2 },
        message: '你抽调了三个核心员工组建海外团队，租了新加坡办公室。虽然烧钱，但三个月后在东南亚市场打开了局面。陈画饼："老板，我们是国际公司了！"',
        nextChapter: { eventId: 'E092', delay: 0, stateFlags: { strategy: 'aggressive', resources_stretched: true }}
      },
      {
        text: '小范围试点，谨慎推进',
        effects: { funds: -5, morale: +3, reputation: +5, tech: 0, connections: +5 },
        principles: { transparency: +1, talent: +1, machine: +2, meritocracy: 0, pain: +1, legacy: +1 },
        message: '你只派了一个人去新加坡，先做市场调研。三个月后他回来说："文化差异比想象的大，需要做本地化。" 你避免了盲目扩张的坑。',
        nextChapter: { eventId: 'E092', delay: 0, stateFlags: { strategy: 'cautious', foundation_solid: true }}
      },
      {
        text: '拒绝出海，专注国内市场',
        effects: { funds: 0, morale: -5, reputation: 0, tech: +5, connections: 0 },
        principles: { transparency: +1, talent: 0, machine: +1, meritocracy: 0, pain: 0, legacy: 0 },
        message: '你说："国内市场还没做透，不折腾。" 三个月后，你的竞对拿了新加坡投资出海了，估值翻倍。陈画饼说："老板，我们错过了风口。"',
        nextChapter: { eventId: 'E092', delay: 0, stateFlags: { strategy: 'reject', opportunity_missed: true }}
      }
    ]
  },
  {
    id: 'E092', type: 'crisis',
    isSeries: true, seriesId: 'S019', chapter: 2, totalChapters: 3,
    title: '国际扩张·第二章：水土不服',
    dynamicDescription: (state) => {
      if (state.strategy === 'aggressive') {
        return '新加坡办公室运营半年，问题爆发：本地员工和国内员工文化冲突，产品功能不符合当地习惯，烧了80万只拿到500个用户。海外负责人说："老板，我们太激进了。"';
      } else if (state.strategy === 'cautious') {
        return '试点三个月后，你决定正式进入东南亚市场。但发现竞对已经占领了市场，且他们有本地化优势。你需要决定如何差异化竞争。';
      } else {
        return '半年后，你看着竞对的东南亚业绩报告：用户100万，营收过亿。团队士气低落："我们是不是太保守了？" 你需要重新思考战略。';
      }
    },
    reporter: 'lin',
    choices: [
      {
        text: '大力本地化，深耕市场',
        effects: { funds: -15, morale: +5, reputation: +10, tech: +8, connections: +10 },
        principles: { transparency: +2, talent: +2, machine: +2, meritocracy: +1, pain: +3, legacy: +2 },
        message: '你招了新加坡本地团队，重新设计产品，调整定价策略。虽然烧钱，但一年后成了东南亚第二大玩家。林小默："这才是正确的出海姿势。"'
      },
      {
        text: '收缩战线，回归国内',
        effects: { funds: +7, morale: -8, reputation: -10, tech: 0, connections: -10 },
        principles: { transparency: +2, talent: 0, machine: +1, meritocracy: 0, pain: +2, legacy: -1 },
        message: '你关闭了海外业务，专注国内。虽然止损了，但行业说你"出海失败"。海外团队三人全部离职，说："老板，你太容易放弃了。"'
      },
      {
        text: '寻找海外合作伙伴，借船出海',
        effects: { funds: -5, morale: +3, reputation: +5, tech: 0, connections: +13 },
        principles: { transparency: +1, talent: +1, machine: +1, meritocracy: +1, pain: +1, legacy: +2 },
        message: '你找到了当地的分销商，授权他们运营，你提供产品和技术支持。轻资产模式让你避免了水土不服，一年后东南亚营收占总收入的20%。'
      }
    ]
  },
  {
    id: 'E093', type: 'opportunity',
    isSeries: true, seriesId: 'S019', chapter: 3, totalChapters: 3,
    title: '国际扩张·第三章：全球视野',
    dynamicDescription: (state) => {
      return '出海一年后，你对国际市场有了新的理解。陈画饼带来消息："硅谷有个孵化器想投资我们，条件是你去美国待半年，学习他们的运作模式。" 你需要决定是否接受。';
    },
    reporter: 'chen',
    choices: [
      {
        text: '接受邀请，开拓美国市场',
        effects: { funds: -10, morale: +10, reputation: +15, tech: +10, connections: +20 },
        principles: { transparency: +2, talent: +2, machine: +2, meritocracy: +1, pain: +3, legacy: +3 },
        message: '你去了硅谷半年，见识了最前沿的商业模式和技术。回来后推动了公司全面升级，还拿到了美国VC的B轮投资。你成了真正的国际化企业家。'
      },
      {
        text: '坚守本土，深耕中国市场',
        effects: { funds: 0, morale: +5, reputation: +8, tech: +5, connections: +5 },
        principles: { transparency: +1, talent: +1, machine: +1, meritocracy: 0, pain: +1, legacy: +2 },
        message: '你谢绝了邀请："中国市场足够大，我要先做到国内第一。" 三年后你确实成了国内龙头，但错过了国际化的最佳窗口期。'
      },
      {
        text: '建立全球化团队，远程协作',
        effects: { funds: -8, morale: +8, reputation: +10, tech: +8, connections: +13 },
        principles: { transparency: +2, talent: +2, machine: +3, meritocracy: +1, pain: +2, legacy: +3 },
        message: '你招了来自五个国家的远程员工，建立了24小时协作机制。虽然管理复杂，但这支国际化团队让你的产品真正实现了全球化。'
      }
    ]
  },

  // S020: 内部腐败两部曲
  {
    id: 'E094', type: 'crisis',
    isSeries: true, seriesId: 'S020', chapter: 1, totalChapters: 2,
    title: '内部腐败·第一章：举报信',
    description: '你收到一封匿名举报邮件："行政部采购存在腐败，采购主管收回扣，市场价3万的东西报价5万。附件是三张转账截图。" 你查了，采购主管是刘阿姨推荐来的她外甥，入职半年。',
    reporter: 'qian',
    choices: [
      {
        text: '立即开除，杀一儆百',
        effects: { funds: +3, morale: -5, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: 0, machine: 0, meritocracy: +1, pain: +2, legacy: +1 },
        message: '你当天就开了他。刘阿姨哭着求情："老板，他还年轻，给个机会吧。" 你说："公司原则不能破。" 刘阿姨从此和你疏远了，但其他员工说："老板有魄力。"',
        nextChapter: { eventId: 'E095', delay: 0, stateFlags: { action: 'fire', principle_established: true }}
      },
      {
        text: '内部处理，给改过机会',
        effects: { funds: 0, morale: 0, reputation: -3, tech: 0, connections: 0 },
        principles: { transparency: -1, talent: 0, machine: 0, meritocracy: -1, pain: -1, legacy: 0 },
        message: '你让他退回扣款，写检讨，降职留用。刘阿姨感激涕零。但三个月后，财务发现他又做了手脚。团队说："老板你太心软了。"',
        nextChapter: { eventId: 'E095', delay: 0, stateFlags: { action: 'retain', problem_recurring: true }}
      },
      {
        text: '调查清楚，看是否系统问题',
        effects: { funds: -5, morale: 0, reputation: 0, tech: 0, connections: 0 },
        principles: { transparency: +3, talent: 0, machine: +3, meritocracy: 0, pain: +2, legacy: +3 },
        message: '你请了专业审计。结果发现：采购流程缺失，审批漏洞，三个部门都有类似问题。你开除了腐败者，但更重要的是建立了完善的采购制度。',
        nextChapter: { eventId: 'E095', delay: 0, stateFlags: { action: 'systematic', root_solved: true }}
      }
    ]
  },
  {
    id: 'E095', type: 'opportunity',
    isSeries: true, seriesId: 'S020', chapter: 2, totalChapters: 2,
    title: '内部腐败·第二章：制度建设',
    dynamicDescription: (state) => {
      if (state.action === 'fire') {
        return '开除事件后，公司人心惶惶。钱多多说："老板，虽然你做得对，但我们需要建立制度，不能每次都靠你的魄力。" 你意识到需要长效机制。';
      } else if (state.action === 'retain') {
        return '那个采购主管再次被抓现行，这次贪了10万。你不得不报警。但损失已经造成了，更糟的是，其他人也学会了钻漏洞。你需要亡羊补牢。';
      } else {
        return '系统性审计后，你发现公司在财务、采购、市场三个环节都缺乏监管。钱多多提议："要么花钱请专业团队建制度,要么自己摸索，但一定要做。"';
      }
    },
    reporter: 'qian',
    choices: [
      {
        text: '请专业咨询公司，建立内控体系',
        effects: { funds: -13, morale: +5, reputation: +10, tech: 0, connections: +5 },
        principles: { transparency: +3, talent: +1, machine: +3, meritocracy: +1, pain: +1, legacy: +3 },
        message: '你花30万请了专业事务所建内控体系：采购三级审批、财务定期审计、举报奖励机制。虽然流程变慢了，但腐败问题再没出现过。这成了公司的护城河。'
      },
      {
        text: '设立审计部门，内部监督',
        effects: { funds: -5, morale: -3, reputation: +5, tech: 0, connections: 0 },
        principles: { transparency: +2, talent: +1, machine: +2, meritocracy: +1, pain: +1, legacy: +2 },
        message: '你招了两个审计专员，定期抽查。虽然有效，但员工抱怨："感觉被监视了。" 你说："这是对守规矩的人的保护。" 一年后，大家习惯了。'
      },
      {
        text: '继续摸索，暂不系统化',
        effects: { funds: 0, morale: -5, reputation: -5, tech: 0, connections: 0 },
        principles: { transparency: -1, talent: 0, machine: -1, meritocracy: 0, pain: -1, legacy: -1 },
        message: '你觉得小公司不需要太复杂的制度。但半年后，又出现了报销作假的问题。钱多多辞职了："老板，你不建制度,我没法干。" 你后悔莫及。'
      }
    ]
  }
];

// 季度考核事件（第8、16、24周自动触发）
const QUARTERLY_REVIEWS = [
  {
    id: 'Q1', title: '第一季度董事会考核',
    thresholds: [
      { min: 300, message: '董事会非常满意！追加了10%预算。', effects: { funds: +7, reputation: +5 } },
      { min: 200, message: '董事会说"还行"。维持现状。', effects: {} },
      { min: 150, message: '董事会皱了皱眉："下个季度要看到改善。"', effects: { connections: -5 } },
      { min: 0, message: '董事会拍桌子了："再这样下去，换人！"', effects: { morale: -10, connections: -10 } }
    ]
  },
  {
    id: 'Q2', title: '半年度述职报告',
    thresholds: [
      { min: 300, message: '投资人主动提出追加投资！', effects: { funds: +7, connections: +10 } },
      { min: 200, message: '投资人点头微笑："继续保持。"', effects: { funds: +1 } },
      { min: 150, message: '投资人开始翻手机了，不太专注...', effects: { connections: -10 } },
      { min: 0, message: '投资人说要"重新评估投资策略"。翻译：准备撤资。', effects: { funds: -15, morale: -10, connections: -15 } }
    ]
  },
  {
    id: 'Q3', title: '第三季度战略复盘',
    thresholds: [
      { min: 300, message: '全公司信心爆棚！有猎头开始挖你了（好消息）。', effects: { morale: +10, reputation: +10 } },
      { min: 200, message: '一切平稳进行，没有惊喜也没有惊吓。', effects: { morale: +5 } },
      { min: 150, message: '团队开始出现倦怠感，有人偷偷投简历了。', effects: { morale: -10, tech: -5 } },
      { min: 0, message: '公司弥漫着"沉船"的气氛。优秀的人开始跳船了。', effects: { morale: -15, tech: -10, reputation: -10 } }
    ]
  }
];

// 达利欧建议 —— 每个事件对应的《原则》管理箴言
const DALIO_ADVICE = {
  'E001': '达利欧说："极度透明和极度真实是有意义工作的基础。面对问题时，了解真实原因比立刻惩罚更重要。"',
  'E001_CHAIN': '达利欧说："对人才要保持开放态度。好的人才会被好的文化和透明度吸引。"',
  'E002': '达利欧说："不要为留住人而不计成本。建立正确的人才标准，比留住错误的人更重要。"',
  'E002_CHAIN': '达利欧说："创意择优不是平均主义。按能力和贡献付薪，才是真正的公平。"',
  'E003': '达利欧说："找到问题的根本原因，而不是只处理表面症状。系统性思维要求你追问「为什么」。"',
  'E004': '达利欧说："不要害怕展示弱点，虚假的繁荣终会崩塌。极度真实是长期信任的基础。"',
  'E004_CHAIN': '达利欧说："拥抱痛苦，直面错误。逃避只会让问题变得更大、代价更高。"',
  'E005': '达利欧说："不要只惩罚个人，要思考是什么制度漏洞允许了这种行为发生。"',
  'E006': '达利欧说："每个错误都是改进系统的机会。与其追究个人责任，不如改进流程和机制。"',
  'E007': '达利欧说："不要因为害怕短期痛苦而做出不明智的妥协。长期健康比眼前安慰更重要。"',
  'E008': '达利欧说："面对批评时，极度透明的回应比掩盖更有效。承认错误是进步的第一步。"',
  'E009': '达利欧说："冲突的根源往往是信息不对称。创意择优要求开放讨论，而非强制压制。"',
  'E010': '达利欧说："薪酬体系应该有清晰的逻辑，并且经得起公开检验。透明才能建立信任。"',
  'E011': '达利欧说："看能力和成果，而非光环和头衔。创意择优要求我们评估真实贡献。"',
  'E012': '达利欧说："不要被外部资源蒙蔽判断。系统性地评估每个决策对长期发展的影响。"',
  'E013': '达利欧说："获取人才要走正道。违背原则获得的短期优势终会反噬。"',
  'E014': '达利欧说："凭实力竞争才是可持续之道。走捷径可能赢一时，但会输一世。"',
  'E015': '达利欧说："做决策时想清楚你到底要什么——是短期利益还是长期愿景？"',
  'E016': '达利欧说："小问题往往是大问题的信号。系统性思维要求你关注每一个异常现象。"',
  'E017': '达利欧说："理解员工的真实需求比执行冰冷的规则更重要。好的人才需要被真正关心。"',
  'E018': '达利欧说："看到问题背后的系统原因。员工的「越轨」行为往往是制度缺失的映射。"',
  'E019': '达利欧说："危机时刻，极度透明和集体智慧比独断更有力量。让痛苦成为进化的催化剂。"',
  'E020': '达利欧说："面对最艰难的局面，你的选择定义了你是谁。拥抱痛苦，才能获得真正的成长。"',
  'E021': '达利欧说："冲突不是坏事，是发现系统问题的机会。建立机制比压制冲突更重要。"',
  'E022': '达利欧说："环境影响生产力。关注员工的工作条件，就是关注公司的未来。"',
  'E023': '达利欧说："真诚比聪明的公关更有力量。面对攻击时，展现你的原则和真实。"',
  'E024': '达利欧说："信任员工并建立成果导向的评估体系，比控制他们的位置更重要。"',
  'E025': '达利欧说："理解人，才能解决问题。每一次冲突背后都有未被倾听的声音。"',
  'E026': '达利欧说："透明度在危机中尤为重要。承认错误并展示改进，才能赢回信任。"',
  'E027': '达利欧说："追究责任不如优化系统。好的流程能避免90%的人为错误。"',
  'E028': '达利欧说："真实的故事比精心包装的广告更动人。人们会为真诚买单。"',
  'E029': '达利欧说："评估自己的能力边界，比盲目接单更重要。诚实是长期合作的基础。"',
  'E030': '达利欧说："分享真实经验比展示虚假成功更有价值。脆弱就是力量。"',
  'E031': '达利欧说："人才匹配不只看简历，更要看价值观契合。创意择优需要双向选择。"',
  'E032': '达利欧说："好的领导者知道何时参与，何时退后。给员工空间也是一种管理智慧。"',
  'E033': '达利欧说："小的关怀能带来大的凝聚力。员工幸福感是隐形的生产力。"',
  'E034': '达利欧说："真正关心员工不是制度，而是人与人之间的连接。温度创造忠诚。"',
  'E035': '达利欧说："试行新政策比一刀切更明智。用数据和反馈优化决策。"',
  'E036': '达利欧说："透过现象看本质。员工行为的异常往往反映了更深层次的问题。"',
  'E037': '达利欧说："员工的困境就是公司的困境。提供支持系统，而非简单的规则。"',
  'E038': '达利欧说："面对强大对手，差异化比正面对抗更明智。小公司的优势在于灵活。"',
  'E039': '达利欧说："最大的危机往往孕育最强的团队。极度透明能激发集体智慧和责任感。"',
  'E040': '达利欧说："极度透明和极度真实是有意义工作的基础。当员工做出出格的事，先了解背后的原因。"',
  'E041': '达利欧说："对人才要保持开放态度。好的人才会被好的文化和透明度吸引，而不是被官司吓跑。"',
  'E042': '达利欧说："危机是机制进化的催化剂。不要浪费一场好危机，要从中建立更好的系统。"',
  'E043': '达利欧说："在融资中，极度真实比短期的数字好看更重要。投资人最终会看穿谎言，诚实是最好的策略。"',
  'E044': '达利欧说："尽调是双向的。不仅是VC在调查你，你也在调查VC。选择能长期合作的伙伴比拿到钱更重要。"',
  'E045': '达利欧说："不要为了融资牺牲核心原则。保护团队和控制权，才能确保公司按你的愿景发展。"',
  'E046': '达利欧说："成功融资不是终点，而是新的起点。如何使用这笔钱，比拿到多少钱更关键。"',
  'E047': '达利欧说："客户问题往往反映了产品或服务的系统性缺陷。不要只看表面的抱怨，要找根本原因。"',
  'E048': '达利欧说："面对危机时的选择，会定义你是谁。诚实和长期主义永远比短期应付更有价值。"',
  'E049': '达利欧说："每次危机都是进化的机会。建立机制，让同样的错误不再发生，这才是真正的成长。"',
  'E050': '达利欧说："好的人才需要的不只是高薪，更需要透明的文化、成长的机会和被尊重的感觉。"',
  'E051': '达利欧说："用法律和金钱留住人才是下策，用文化和愿景吸引人才是上策。"',
  'E052': '达利欧说："被抄袭是对你产品的肯定。但真正的护城河不是保密，而是持续创新的能力。"',
  'E053': '达利欧说："竞争的本质不是消灭对手，而是让自己变得不可替代。专注于建立真正的壁垒。"',
  'E054': '达利欧说："开放和分享有时比封闭更有力量。生态的力量远大于单点的防守。"',
  'E055': '达利欧说："组织内的冲突往往源于职责不清和信息不对称。透明的机制比压制冲突更重要。"',
  'E056': '达利欧说："好的组织架构让对的人在对的位置做对的事。机制大于人治。"',
  'E057': '达利欧说："市场危机是进化的机会。活下来的公司会变得更强，死掉的只是不适应环境的。"',
  'E058': '达利欧说："透明度在危机中尤为重要。团队需要知道真相，才能共同面对。"',
  'E059': '达利欧说："从痛苦中学习，建立系统性的应对机制。危机管理能力是公司的核心竞争力。"',
  'E060': '达利欧说："技术债务就像信用卡债务，早还比晚还代价小。短期的痛苦换取长期的健康。"',
  'E061': '达利欧说："建立正确的工程师文化和代码规范，预防永远比治疗重要。"',
  'E062': '达利欧说："冲突不可怕，可怕的是回避冲突。极度真实地面对问题，才能真正解决。"',
  'E063': '达利欧说："多数组织问题的根源是机制问题，不是人的问题。优化系统比更换人更有效。"',
  'E064': '达利欧说："文化需要明确化、可衡量化。写下来的价值观才能真正指导行为。"',
  'E065': '达利欧说："现金流是公司的生命线。建立预警机制，永远不要让自己陷入绝境。"',
  'E066': '达利欧说："危机时刻的选择，最能体现领导者的原则和价值观。"',
  'E067': '达利欧说："绝处逢生的机会往往来自于你之前建立的信任和透明度。"',
  'E068': '达利欧说："从危机中学到的教训，要转化为系统性的机制，这才是真正的进化。"',
  'E069': '达利欧说："战略选择没有对错，只有适合与不适合。关键是做出选择后全力以赴。"',
  'E070': '达利欧说："转型的阵痛是必然的。拥抱这种痛苦，在痛苦中找到进化的方向。"',
  'E071': '达利欧说："战略定力比战术灵活更重要。频繁摇摆是失败的主要原因。"',
  'E072': '达利欧说："每一个重大决策都在定义你是谁、你想要什么、你的公司代表什么。"',
  'E073': '达利欧说："成功不是终点，而是新的起点。持续进化才是唯一不变的真理。"',
  'E074': '达利欧说："真正的传承不是留下财富，而是留下原则、机制和文化。"',
  'E075': '达利欧说："当老板是一场修行。你在这个过程中成长的自己，比公司本身更重要。"',

  // S013: 黑客攻击系列
  'E076': '达利欧说："面对勒索时，原则比金钱更重要。短期妥协会带来长期被动。建立安全机制才是根本。"',
  'E077': '达利欧说："投资安全不是成本，是保护。系统性思维要求你建立可持续的防护体系，而非头痛医头。"',

  // S014: 媒体危机系列
  'E078': '达利欧说："面对舆论危机，极度透明是最好的武器。真相永远比公关技巧更有力量。"',
  'E079': '达利欧说："商业竞争要有底线。暴露对手的阴谋虽然能赢一时，但建立正向机制才能赢长远。"',
  'E080': '达利欧说："危机公关能力是企业的必修课。建立专业的PR体系，让公司在舆论场有发声权。"',

  // S015: 员工叛变系列
  'E081': '达利欧说："信任员工不是盲目相信，而是建立透明的机制。真诚的沟通永远比猜疑和监控更有效。"',
  'E082': '达利欧说："人才流失的根本原因往往不是金钱，而是看不到未来。给予股权、信任和成长空间。"',
  'E083': '达利欧说："建立系统性的激励机制，让核心员工分享公司成长。人心比钱更值钱，留住人心才能留住人才。"',

  // S016: 政府监管系列
  'E084': '达利欧说："合规经营虽然短期有成本，但长期看是最大的护城河。走正道才能走得远。"',
  'E085': '达利欧说："与政府建立良性关系是企业的基本功。政策红利不是投机，而是对合规者的奖励。"',

  // S017: 产品发布系列
  'E086': '达利欧说："产品失败时，承认错误比掩盖更重要。用户会原谅诚实的失败，但不会原谅欺骗。"',
  'E087': '达利欧说："技术债务终会爆发。短期的加班文化会透支团队，建立可持续的工程文化才是正道。"',
  'E088': '达利欧说："人才是核心竞争力。投资优秀的团队，建立完善的流程，产品质量自然会提升。"',

  // S018: 合作伙伴背叛系列
  'E089': '达利欧说："不要把命运交给单一客户。分散风险、建立多元化的收入结构是企业生存的基本原则。"',
  'E090': '达利欧说："从依赖客户到拥有自己的产品，是企业进化的必经之路。建立真正属于自己的护城河。"',

  // S019: 国际扩张系列
  'E091': '达利欧说："国际化不是盲目扩张。先在本地市场建立壁垒，再谨慎出海。机会永远给有准备的人。"',
  'E092': '达利欧说："本地化是出海成功的关键。尊重当地文化和商业规则，不要用国内思维硬套。"',
  'E093': '达利欧说："全球化视野不是地理扩张，而是思维方式。学习最先进的理念和实践，才能真正国际化。"',

  // S020: 内部腐败系列
  'E094': '达利欧说："腐败的根源是制度漏洞，不只是个人品德问题。建立透明的机制，让腐败无处藏身。"',
  'E095': '达利欧说："完善的内控体系是企业长久发展的基石。投资制度建设，预防永远比事后处理更有效。"'
};

// 导出
if (typeof module !== 'undefined') {
  module.exports = { EMPLOYEES, EVENTS, QUARTERLY_REVIEWS, DALIO_ADVICE };
}
