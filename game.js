// ==========================================
// BOSS大冒险 - 游戏引擎
// ==========================================

class BossGame {
  constructor() {
    this.state = null;
    this.ui = null;
  }

  init(companyName, ui) {
    this.ui = ui;
    this.state = {
      companyName: companyName,
      week: 1,
      stats: { funds: 50, morale: 50, reputation: 50, tech: 50, connections: 50 },
      employees: JSON.parse(JSON.stringify(EMPLOYEES)),
      dalio: { transparency: 0, talent: 0, machine: 0, meritocracy: 0, pain: 0, legacy: 0 },
      history: [],
      chainQueue: [],
      seriesState: {},
      usedEvents: new Set(),
      usedSeries: new Set(),
      gameOver: false,
      ending: null,
      totalDecisions: 0,
      emergencyUsed: false
    };
    this.save();
  }

  // ====== 核心游戏循环 ======
  startWeek() {
    if (this.state.gameOver) return;

    // 检查连锁事件（连续剧的下一章）
    const chainEvent = this.getChainEvent();
    if (chainEvent) {
      this.ui.showEvent(chainEvent, true);
      return;
    }

    // 每个月触发一个连续剧事件
    const event = this.pickMonthlySeriesEvent();
    if (event) {
      this.ui.showEvent(event, false);
    } else {
      // 如果没有连续剧了，检查游戏状态
      this.checkGameState();
    }
  }

  // ====== 月度连续剧事件选择（动态阶段制）======
  pickMonthlySeriesEvent() {
    const currentWeek = this.state.week;
    if (currentWeek > 12) return null;

    // 兼容旧存档
    if (!this.state.usedSeries) this.state.usedSeries = new Set();
    if (Array.isArray(this.state.usedSeries)) this.state.usedSeries = new Set(this.state.usedSeries);

    // 三阶段事件池（模拟公司从初创到成熟的经营节奏）
    // 早期：团队建设、内部管理（根基期）
    const earlyPool = ['S001', 'S004', 'S006', 'S008', 'S009', 'S013', 'S016', 'S020'];
    // 中期：市场竞争、外部挑战（成长期）
    const midPool = ['S002', 'S003', 'S005', 'S014', 'S017', 'S018'];
    // 后期：战略抉择、生死存亡（关键期）
    const latePool = ['S007', 'S010', 'S011', 'S012', 'S015', 'S019'];

    // 根据当前阶段选择事件池
    let pool;
    if (currentWeek <= 4) pool = earlyPool;
    else if (currentWeek <= 8) pool = midPool;
    else pool = latePool;

    // 过滤已使用的系列
    let available = pool.filter(id => !this.state.usedSeries.has(id));

    // 如果当前阶段的池子空了，从其他阶段补充
    if (available.length === 0) {
      available = [...earlyPool, ...midPool, ...latePool]
        .filter(id => !this.state.usedSeries.has(id));
    }

    if (available.length === 0) return null;

    // 随机选择一个系列
    const seriesId = available[Math.floor(Math.random() * available.length)];
    this.state.usedSeries.add(seriesId);

    return EVENTS.find(e => e.seriesId === seriesId && e.chapter === 1) || null;
  }

  getChainEvent() {
    const idx = this.state.chainQueue.findIndex(c => c.triggerWeek <= this.state.week);
    if (idx === -1) return null;

    const chain = this.state.chainQueue.splice(idx, 1)[0];
    const event = EVENTS.find(e => e.id === chain.eventId);

    // === 新增：为连续剧事件注入运行时状态 ===
    if (event && event.isSeries && chain.seriesState) {
      event._runtimeState = chain.seriesState;  // 临时注入，用于dynamicDescription
    }

    return event || null;
  }

  // ====== 决策处理 ======
  makeChoice(event, choiceIndex) {
    const choice = event.choices[choiceIndex];
    const prevStats = { ...this.state.stats };

    // 应用属性变化
    const changes = {};
    for (const [key, val] of Object.entries(choice.effects)) {
      if (val !== 0) {
        this.state.stats[key] = Math.max(0, Math.min(100, this.state.stats[key] + val));
        changes[key] = val;
      }
    }

    // 应用达利欧原则评分
    if (choice.principles) {
      for (const [key, val] of Object.entries(choice.principles)) {
        if (val !== 0) {
          this.state.dalio[key] = (this.state.dalio[key] || 0) + val;
        }
      }
    }

    // === 新增：处理连续剧事件 ===
    if (event.isSeries && choice.nextChapter) {
      // 初始化或获取连续剧状态
      if (!this.state.seriesState[event.seriesId]) {
        this.state.seriesState[event.seriesId] = {
          currentChapter: event.chapter,
          flags: {},
          choiceHistory: []
        };
      }

      const seriesState = this.state.seriesState[event.seriesId];
      seriesState.currentChapter = event.chapter + 1;
      seriesState.choiceHistory.push(choiceIndex);

      // 合并新的状态标记
      Object.assign(seriesState.flags, choice.nextChapter.stateFlags || {});

      // 添加到chain队列（复用现有机制）
      this.state.chainQueue.push({
        eventId: choice.nextChapter.eventId,
        triggerWeek: this.state.week + choice.nextChapter.delay,
        seriesState: { ...seriesState.flags }  // 传递状态
      });
    }

    // 处理原有的连锁事件（保持向后兼容）
    if (choice.chain && !event.isSeries) {
      this.state.chainQueue.push({
        eventId: choice.chain.eventId,
        triggerWeek: this.state.week + choice.chain.delay
      });
    }

    // 影响员工忠诚度
    this.updateEmployeeLoyalty(event, choice);

    // 计算决策评分
    const totalEffect = Object.values(changes).reduce((a, b) => a + b, 0);
    const principleScore = choice.principles ? Object.values(choice.principles).reduce((a, b) => a + b, 0) : 0;
    const finalScore = totalEffect + principleScore * 2; // 原则分权重更高

    // 评级系统
    let rating, ratingEmoji;
    if (finalScore >= 15) { rating = 'S'; ratingEmoji = '🌟'; }
    else if (finalScore >= 8) { rating = 'A'; ratingEmoji = '✨'; }
    else if (finalScore >= 3) { rating = 'B'; ratingEmoji = '👍'; }
    else if (finalScore >= -2) { rating = 'C'; ratingEmoji = '😐'; }
    else if (finalScore >= -8) { rating = 'D'; ratingEmoji = '😰'; }
    else { rating = 'F'; ratingEmoji = '💀'; }

    // 记录历史
    this.state.usedEvents.add(event.id);
    this.state.totalDecisions++;
    this.state.history.push({
      week: this.state.week,
      event: event.title,
      choice: choice.text,
      changes: changes,
      rating: rating,
      ratingEmoji: ratingEmoji,
      score: finalScore
    });

    // 显示结果
    this.ui.showResult(choice.message, changes, prevStats, choice.principles);

    this.save();
  }

  afterResult() {
    // 检查员工离职
    const quitter = this.checkEmployeeQuit();
    if (quitter) {
      this.ui.showEmployeeQuit(quitter, () => {
        this.checkGameState();
      });
      return;
    }
    this.checkGameState();
  }

  checkGameState() {
    // 立即检查游戏结束（在任何操作后都应该检查）
    const deadStat = this.checkGameOver();
    if (deadStat) {
      this.state.gameOver = true;
      // 使用新的破产结局系统
      const bankruptcyEnding = this.calculateBankruptcyEnding();
      this.state.ending = {
        ...bankruptcyEnding,
        subtitle: `因${deadStat === 'funds' ? '资金' : deadStat === 'morale' ? '士气' : deadStat === 'reputation' ? '声誉' : deadStat === 'tech' ? '技术' : '人脉'}归零`,
        tier: 'fail'
      };
      this.save();
      this.ui.showEnding(this.state.ending, this.getReport());
      return;
    }

    // 检查胜利（12个月完成且所有连锁事件结束）
    if (this.state.week > 12 && this.state.chainQueue.length === 0) {
      this.state.gameOver = true;
      this.state.ending = this.getWinEnding();
      this.save();
      this.ui.showEnding(this.state.ending, this.getReport());
      return;
    }

    // 下一周
    this.advanceWeek();
  }

  advanceWeek() {
    this.state.week++;

    // 月度运营消耗（仅前12月，终章不扣）
    if (this.state.week <= 12) {
      // 固定运营成本：房租+工资+运营开支
      this.state.stats.funds = Math.max(0, this.state.stats.funds - 5);
    }

    this.save();
    this.ui.updateDashboard(this.state);

    // 立即检查是否破产
    const deadStat = this.checkGameOver();
    if (deadStat) {
      this.state.gameOver = true;
      const bankruptcyEnding = this.calculateBankruptcyEnding();
      this.state.ending = {
        ...bankruptcyEnding,
        subtitle: `因${deadStat === 'funds' ? '资金' : deadStat === 'morale' ? '士气' : deadStat === 'reputation' ? '声誉' : deadStat === 'tech' ? '技术' : '人脉'}归零`,
        tier: 'fail'
      };
      this.ui.showEnding(this.state.ending, this.getReport());
      return;
    }

    this.startWeek();
  }

  // ====== 员工系统 ======
  updateEmployeeLoyalty(event, choice) {
    const reporter = this.state.employees.find(e => e.id === event.reporter);
    if (!reporter) return;

    // 如果选择让汇报人满意（正面效果多），忠诚度上升
    const totalEffect = Object.values(choice.effects).reduce((a, b) => a + b, 0);
    const loyaltyChange = totalEffect > 10 ? 5 : totalEffect > 0 ? 2 : totalEffect > -10 ? -3 : -8;
    reporter.loyalty = Math.max(0, Math.min(100, reporter.loyalty + loyaltyChange));

    // 士气影响所有员工
    if (choice.effects.morale) {
      this.state.employees.forEach(emp => {
        if (emp.id !== reporter.id) {
          emp.loyalty = Math.max(0, Math.min(100, emp.loyalty + Math.floor(choice.effects.morale / 5)));
        }
      });
    }
  }

  checkEmployeeQuit() {
    for (const emp of this.state.employees) {
      if (emp.loyalty <= 15 && !emp.quit) {
        return emp;
      }
    }
    return null;
  }

  handleEmployeeQuit(employee, tryRetain) {
    if (tryRetain) {
      // 挽留需要花钱
      this.state.stats.funds = Math.max(0, this.state.stats.funds - 8);
      if (Math.random() > 0.4) {
        employee.loyalty = 40;
        return { success: true, message: `${employee.name}被你的诚意感动，决定再给公司一次机会。` };
      } else {
        employee.quit = true;
        this.state.stats.morale = Math.max(0, this.state.stats.morale - 5);
        return { success: false, message: `${employee.name}说"谢谢老板好意，但我真的累了"。` };
      }
    } else {
      employee.quit = true;
      this.state.stats.morale = Math.max(0, this.state.stats.morale - 5);
      return { success: false, message: `${employee.name}收拾了工位，留下一句"后会有期"。` };
    }
  }

  // ====== 季度考核 ======
  doQuarterlyReview(quarterIndex) {
    const review = QUARTERLY_REVIEWS[quarterIndex];
    const totalStats = Object.values(this.state.stats).reduce((a, b) => a + b, 0);

    let result = review.thresholds[review.thresholds.length - 1]; // 默认最低档
    for (const t of review.thresholds) {
      if (totalStats >= t.min) {
        result = t;
        break;
      }
    }

    // 应用效果（上限100）
    for (const [key, val] of Object.entries(result.effects)) {
      if (val !== 0) {
        this.state.stats[key] = Math.max(0, Math.min(100, this.state.stats[key] + val));
      }
    }

    this.ui.showQuarterlyReview(review.title, result.message, totalStats, () => {
      this.state.week++;
      this.save();
      this.ui.updateDashboard(this.state);
      this.startWeek();
    });
  }

  // ====== 游戏结束判定 ======
  checkGameOver() {
    for (const [key, val] of Object.entries(this.state.stats)) {
      if (val <= 0) return key;
    }
    return null;
  }

  // ====== 破产结局计算（新增）======
  calculateBankruptcyEnding() {
    const stats = this.state.stats;
    const principles = this.state.dalio;
    const history = this.state.history;
    const week = this.state.week;

    // 计算辅助变量
    const totalPrinciplesScore = Object.values(principles).reduce((a, b) => a + b, 0);
    const isHighReputation = stats.reputation > 75;
    const isHighTech = stats.tech > 75;
    const isHighMorale = stats.morale > 60;
    const isHighConnections = stats.connections > 75;
    const isLowFunds = stats.funds <= 0;
    const earlyDeath = week <= 4;
    const midDeath = week > 4 && week <= 8;
    const lateDeath = week > 8;

    // === 25个破产结局（按优先级和条件检查）===

    // 1. 东山再起（高原则分，最佳结局）
    if (totalPrinciplesScore > 150) {
      return {
        id: 'comeback',
        title: '东山再起',
        emoji: '🔥',
        description: `三个月后，你用从失败中学到的原则重新出发。这次你不再冲动，不再画饼，不再回避痛苦。天使投资人看完BP说："这次我信你。" 你笑了："这次我也信我自己。"\n\n【解锁：Hard模式，初始资金减半，但员工忠诚度+20】`,
        unlockHardMode: true
      };
    }

    // 2. 回家继承家业（随机彩蛋，5%概率）
    if (Math.random() < 0.05) {
      return {
        id: 'rich_kid',
        title: '回家继承家业',
        emoji: '🏰',
        description: `你爸打来电话："儿子，别玩了，回来继承家里的上市公司吧。" 你这才想起来，你家是做房地产的。林小默沉默了："所以...你一直在体验生活？" 投资人哭了："我的2000万..."`
      };
    }

    // 3. 中彩票（随机彩蛋，3%概率）
    if (Math.random() < 0.03) {
      return {
        id: 'lottery',
        title: '天降横财',
        emoji: '🎰',
        description: `公司倒闭那天晚上，你随手买了张彩票。第二天，你中了500万。林小默说："老板，你的运气都用在这了。" 你说："也许当老板就是为了等这一刻。" 钱多多："所以...我们重新开始？"`
      };
    }

    // 4. 商业导师（高声誉）
    if (isHighReputation && !earlyDeath) {
      return {
        id: 'mentor',
        title: '商业导师',
        emoji: '📚',
        description: `公司倒了，但你的故事火了。三家商学院邀请你去当"公司倒闭学"讲师。年薪50万，还不用加班。钱多多酸溜溜地说："早知道一开始就故意倒闭。"`
      };
    }

    // 5. 被收购打工人（高技术）
    if (isHighTech && lateDeath) {
      return {
        id: 'acquired',
        title: '被收购打工人',
        emoji: '💼',
        description: `你的竞对看中了你的技术团队，一口气全员收购。你变成了CTO，工资还涨了。第一天上班，新老板拍你肩膀："感谢你帮我培养了这么好的团队。" 你笑了笑，内心MMP。`
      };
    }

    // 6. 咖啡馆老板（高士气但破产）
    if (isHighMorale && isLowFunds) {
      return {
        id: 'cafe',
        title: '咖啡馆老板',
        emoji: '☕',
        description: `你用最后的钱在公司楼下开了家咖啡馆，取名"BOSS的第二春"。六个老员工全来了，说"咱们这次不开公司，就好好做咖啡"。刘阿姨回来做蛋糕，林小默兼职修电脑。日子过得竟然还挺滋润。`
      };
    }

    // 7. 论坛大V（高透明度）
    if (principles.transparency > 20) {
      return {
        id: 'zhihu',
        title: '论坛大V',
        emoji: '✍️',
        description: `你在论坛回答了"公司倒了是什么体验"，获赞10万。出版社找你出书《商业败局：一个BOSS的自我修养》，卖了5万册。印税够你还债的。王美丽说："老板，你的失败比别人的成功还值钱。"`
      };
    }

    // 8. 直播带货（高声誉但破产）
    if (isHighReputation && isLowFunds && !earlyDeath) {
      return {
        id: 'live_streamer',
        title: '直播带货一哥',
        emoji: '📱',
        description: `你在短视频平台开了直播间，第一句话："老铁们，我公司倒了，现在带货还债。" 粉丝暴涨到100万，都来看你翻车。一个月后，带货收入20万。陈画饼说："老板，你终于把PPT用对地方了。"`
      };
    }

    // 9. 职业老赖（负债严重+低声誉）
    if (isLowFunds && stats.reputation < 20) {
      return {
        id: 'runner',
        title: '职业老赖',
        emoji: '🏃',
        description: `你欠了一屁股债，手机号换了三个。某天在地铁上遇到投资人，他追了你两站地。你跑得飞快，边跑边想："当年800米体测就该这么拼。" 钱多多发微信："老板，我在泰国，勿念。"`
      };
    }

    // 10. 网红UP主（低士气低声誉）
    if (stats.morale < 20 && stats.reputation < 30) {
      return {
        id: 'uploader',
        title: '网红UP主',
        emoji: '🎬',
        description: `你在视频平台开了个账号叫"当老板翻车实录"，粉丝200万。第一期视频《我是如何三个月亏掉800万的》播放量破千万。广告收入比开公司赚得还多。林小默说："老板你终于找到了自己的赛道。"`
      };
    }

    // 11. 外卖骑手（高技术但破产，反差大）
    if (isHighTech && earlyDeath && isLowFunds) {
      return {
        id: 'delivery',
        title: '外卖骑手',
        emoji: '🛵',
        description: `你穿上外卖骑手服，接到第一单时林小默打来电话："老板，我找到工作了。" 你说："巧了，我也找到工作了。" 三个月后你成了"单王"，月入过万。平台邀请你分享："名校毕业生的送餐心得。"`
      };
    }

    // 12. 滴滴司机（有人脉但破产）
    if (isHighConnections && isLowFunds) {
      return {
        id: 'driver',
        title: '五星司机',
        emoji: '🚗',
        description: `你开起了滴滴。第一个乘客上车，你一看："诶？王总？" 对方也愣了："你不是...那个当老板的？" 一路沉默。但你的服务评分5.0，很多老客户点名要你。钱多多："老板，你还是适合做服务业。"`
      };
    }

    // 13. 传销讲师（低创意择优分）
    if (principles.meritocracy < -10) {
      return {
        id: 'mlm',
        title: '传销讲师',
        emoji: '🎪',
        description: `陈画饼介绍你去了一家"成功学培训公司"。你的PPT技术让老板眼前一亮，当场升你为首席讲师。课程标题：《如何用一张嘴融到500万》。学员好评如潮，都说"讲得太好了，就是不知道怎么落地。"`
      };
    }

    // 14. 出家修行（压力爆表）
    if (principles.pain < -10) {
      return {
        id: 'monk',
        title: '出家修行',
        emoji: '🙏',
        description: `在连续经历融资失败、员工跳槽、产品被抄、大客户跑路后，你顿悟了。少林寺的师傅收留了你，法号"释破产"。在寺庙里你负责维护网站，用上了林小默教的代码。网友评论："这庙的网站怎么这么丝滑？"`
      };
    }

    // 15. 摆地摊（低资金但高士气）
    if (isLowFunds && stats.morale > 30 && earlyDeath) {
      return {
        id: 'street_vendor',
        title: '地摊经济',
        emoji: '🛒',
        description: `你在夜市摆起了地摊，卖的是"破产纪念T恤"，上面印着"我TM当老板了"。没想到爆火，月入三万。城管大哥都成了你的客户："小伙子有想法，比那些假装高大上的强。"`
      };
    }

    // 16. 房产中介（高人脉）
    if (isHighConnections && midDeath) {
      return {
        id: 'realtor',
        title: '金牌中介',
        emoji: '🏢',
        description: `你去房产中介当了经纪人。第一个月，你用之前积累的人脉成交了三套房，提成12万。店长说："我干了十年都没你一个月业绩高。" 你说："我这叫降维打击。"`
      };
    }

    // 17. 考公上岸（早期破产，追求稳定）
    if (earlyDeath && stats.tech < 40) {
      return {
        id: 'civil_servant',
        title: '公务员上岸',
        emoji: '📋',
        description: `公司倒了之后，你备考了三个月，成功考上了公务员。父母高兴坏了："早说让你考公，非要当老板。" 同事问你为什么来，你说："体验过山车人生，现在只想要平稳。"`
      };
    }

    // 18. 健身教练（高士气）
    if (stats.morale > 50 && isLowFunds) {
      return {
        id: 'fitness_coach',
        title: '健身教练',
        emoji: '💪',
        description: `工作压力让你天天去健身房发泄，没想到练出了一身肌肉。健身房老板看中了你："来当教练吧，月薪2万。" 学员问你为什么这么拼，你说："想到还债就有力气了。"`
      };
    }

    // 19. 炒股翻车（想翻本但失败）
    if (isLowFunds && principles.pain < 0 && Math.random() < 0.4) {
      return {
        id: 'stock_gambler',
        title: '股民',
        emoji: '📉',
        description: `你把最后5万投进股市，想着翻本。三个月后，5万变成了8000。你盯着K线图说："这不科学。" 林小默说："老板，开公司亏钱还不够，还要炒股亏？" 你："这叫双倍快乐。"`
      };
    }

    // 20. 游戏主播（高技术+早期破产）
    if (isHighTech && earlyDeath) {
      return {
        id: 'gamer',
        title: '游戏主播',
        emoji: '🎮',
        description: `你开始在直播平台打游戏，技术好，还会讲段子。三个月后粉丝50万，月收入15万。弹幕刷屏："这是我见过最有文化的游戏主播。" 你说："公司倒了，游戏成功。"`
      };
    }

    // 21. 宠物咖啡馆（高士气+中期破产）
    if (isHighMorale && midDeath && stats.reputation > 40) {
      return {
        id: 'pet_cafe',
        title: '猫咖店主',
        emoji: '🐱',
        description: `你开了家猫咖，取名"BOSS和他的猫"。刘阿姨成了店长，钱多多兼职做账。六只猫都是以前的员工名字。社交平台爆火："最治愈的老板转型故事。" 你说："这次终于不用融资了。"`
      };
    }

    // 22. 婚恋顾问（高人脉+高透明度）
    if (isHighConnections && principles.transparency > 10) {
      return {
        id: 'matchmaker',
        title: '婚恋顾问',
        emoji: '💘',
        description: `你去了婚介所工作。用当老板时积累的沟通技巧和人脉，成功率高达80%。客户说："你比算命的还准。" 你说："我只是把达利欧的原则用在了相亲上。"`
      };
    }

    // 23. 夜市小吃摊（低资金+低技术）
    if (isLowFunds && stats.tech < 30 && stats.morale > 20) {
      return {
        id: 'food_stall',
        title: '煎饼果子西施',
        emoji: '🥞',
        description: `你在地铁站卖煎饼果子。手艺是跟刘阿姨学的，每天凌晨4点起床。有前员工路过，默默多加一个蛋。三个月后，你的煎饼果子成了网红，日入2000。钱多多："老板，这才是真正的产品经理。"`
      };
    }

    // 24. 风水大师（低机器思维，玄学转型）
    if (principles.machine < -5 && stats.connections > 40) {
      return {
        id: 'feng_shui',
        title: '风水大师',
        emoji: '🧿',
        description: `你开始给人看风水。第一个客户是投资人，他说："你当年给我看过BP，现在给我看看风水吧。" 没想到你还挺准。三个月后，你成了圈内红人。陈画饼："老板，你终于找到了更高级的画饼方式。"`
      };
    }

    // 25. 自媒体鸡汤写手（中后期破产）
    if (lateDeath && stats.reputation > 30) {
      return {
        id: 'content_creator',
        title: '自媒体大V',
        emoji: '📝',
        description: `你开了个公众号叫"BOSS的商战手札"，记录失败的全过程。没想到10万+频出，广告商找上门。你写道："失败不可怕，可怕的是不敢复盘。" 粉丝留言："终于有人说人话了。"`
      };
    }

    // 26. 快递小哥（低声誉+低技术）
    if (stats.reputation < 30 && stats.tech < 40 && isLowFunds) {
      return {
        id: 'courier',
        title: '快递小哥',
        emoji: '📦',
        description: `你去快递公司当了快递员。第一天送件时，收件人是你的前客户。他愣了："你...怎么？" 你说："公司倒了，重新做人。" 三个月后你成了片区劳模："从CEO到快递员的降维打击。"`
      };
    }

    // 27. 回前公司上班（中期破产+高技术）
    if (midDeath && isHighTech) {
      return {
        id: 'back_to_job',
        title: '重返职场',
        emoji: '👔',
        description: `前东家HR打来电话："要不要回来？给你总监职位，年薪80万。" 你答应了。第一天上班，前同事问："当老板感觉如何？" 你说："像做了一场梦。醒来发现，还是上班踏实。"`
      };
    }

    // 默认结局：普通破产
    return {
      id: 'default',
      title: '出师未捷',
      emoji: '💔',
      description: `公司关了，但这只是一次尝试。你学到了很多，经历了很多。有人说："失败是成功之母。" 你说："那我这次算是生了个孩子。" \n\n当老板不易，江湖再见！`
    };
  }

  getFailEnding(stat) {
    const endings = {
      funds: {
        title: '破产清算',
        subtitle: '资金链断裂',
        description: '公司破产了。你在地铁站卖煎饼果子，偶尔有前员工路过，默默多加一个蛋。',
        emoji: '💸'
      },
      morale: {
        title: '全员出走',
        subtitle: '人心散了',
        description: '全员离职。办公室只剩你和前台的仙人掌——等等，仙人掌也死了。你一个人坐在空荡荡的工位上，电脑屏保是全员合影。',
        emoji: '🚪'
      },
      reputation: {
        title: '社会性死亡',
        subtitle: '声名狼藉',
        description: '公司喜提热搜，但不是好的那种。你的名字变成了行业反面教材，圈子里的"如何不做CEO"讲座第一课。',
        emoji: '📱'
      },
      tech: {
        title: '技术崩盘',
        subtitle: '回到石器时代',
        description: '系统全面崩溃，数据全丢。你被迫回到手写Excel的时代。客户打来电话时，你在用算盘对账。',
        emoji: '🔧'
      },
      connections: {
        title: '众叛亲离',
        subtitle: '无人接听',
        description: '所有合作伙伴拉黑了你，投资人不回消息，连外卖小哥都绕着公司走。你打开手机通讯录，发现除了10086，没有一个能打的电话。',
        emoji: '📵'
      }
    };
    return endings[stat] || endings.funds;
  }

  getWinEnding() {
    const stats = this.state.stats;
    const principles = this.state.dalio;
    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    const totalPrinciples = Object.values(principles).reduce((a, b) => a + b, 0);

    const allAbove80 = Object.values(stats).every(v => v > 80);
    const allAbove70 = Object.values(stats).every(v => v > 70);
    const allAbove50 = Object.values(stats).every(v => v > 50);
    const allAbove30 = Object.values(stats).every(v => v > 30);
    const allAbove20 = Object.values(stats).every(v => v > 20);
    const allAbove60 = Object.values(stats).every(v => v > 60);

    // 计算特殊属性
    const isRichAF = stats.funds > 90;
    const isLovelyBoss = stats.morale > 85;
    const isFamous = stats.reputation > 85;
    const isTechGod = stats.tech > 85;
    const isWellConnected = stats.connections > 85;
    const isHighPrinciples = totalPrinciples > 100;
    const isBalanced = Math.max(...Object.values(stats)) - Math.min(...Object.values(stats)) < 20;

    // === 10个不同的胜利结局 ===

    // 1. 完美传奇（全属性>80，最高成就）
    if (allAbove80 && isHighPrinciples) {
      return {
        title: '达利欧的继承人',
        subtitle: '完美通关 · 传奇',
        description: '12个月，你不仅让公司活下来，还创造了奇迹。所有指标爆表，团队上下一心，达利欧本人打来电话："你比我年轻时做得更好。" 各路资本抢着投资，估值直奔独角兽。\n\n这不是结局，是传奇的开始。',
        emoji: '🌟',
        tier: 'perfect'
      };
    }

    // 2. 完美CEO（全属性>80）
    if (allAbove80) {
      return {
        title: '年度最佳CEO',
        subtitle: '完美通关',
        description: '一年时间，你把公司带到了巅峰。资金充足、士气高涨、口碑爆棚、技术领先、人脉广泛。《财富》杂志要给你做封面，标题是："新一代老板典范"。\n\n员工说："跟着你，值了。"',
        emoji: '👑',
        tier: 'perfect'
      };
    }

    // 3. 人民的好老板（士气>85）
    if (isLovelyBoss && allAbove70) {
      return {
        id: 'beloved_boss',
        title: '最受爱戴的老板',
        subtitle: '优秀通关 · 人心',
        description: '你可能不是最有钱的老板，但绝对是员工最爱的老板。年会上，林小默哭着说："这辈子能遇到这样的老板，是我的幸运。" 全员鼓掌，刘阿姨也哭了。\n\n《人物》杂志专访："他把员工当家人。"',
        emoji: '❤️',
        tier: 'good'
      };
    }

    // 4. 技术大神（技术>85）
    if (isTechGod && allAbove70) {
      return {
        id: 'tech_legend',
        title: '技术驱动的胜利',
        subtitle: '优秀通关 · 创新',
        description: '你用技术碾压了所有竞争对手。产品被称为"行业标杆"，开源项目10万star。三家头部公司想收购技术团队，你全拒了。\n\n业内大佬评价："Impressive work."',
        emoji: '🚀',
        tier: 'good'
      };
    }

    // 5. 业界传奇（声誉>85）
    if (isFamous && allAbove70) {
      return {
        id: 'reputation_king',
        title: '业界口碑王',
        subtitle: '优秀通关 · 声誉',
        description: '你的名字成了行业的金字招牌。演讲邀约接到手软，年度人物，百万粉丝。客户说："只要是你们公司的产品，闭眼入。"\n\n声誉就是最好的护城河。',
        emoji: '📣',
        tier: 'good'
      };
    }

    // 6. 资本高手（资金>90）
    if (isRichAF && allAbove70) {
      return {
        id: 'cash_king',
        title: '现金流之王',
        subtitle: '优秀通关 · 财务',
        description: '账上趴着几百万现金，每个月都在盈利。CFO钱多多说："老板，我们的现金流健康到可以写教科书了。" 投资人说："你是我见过最会算账的老板。"\n\n稳健才是王道。',
        emoji: '💰',
        tier: 'good'
      };
    }

    // 7. 人脉大师（人脉>85+平衡发展）
    if (isWellConnected && isBalanced && allAbove60) {
      return {
        id: 'network_master',
        title: '人脉通天',
        subtitle: '优秀通关 · 资源',
        description: '你的通讯录成了最值钱的资产。投资人、客户、供应商、媒体、政府...各方资源应有尽有。有人说："他一个电话，能搞定别人搞不定的事。"\n\n资源整合才是最高级的能力。',
        emoji: '🤝',
        tier: 'good'
      };
    }

    // 8. 达利欧信徒（高原则分+稳健通关）
    if (isHighPrinciples && allAbove50) {
      return {
        id: 'principle_master',
        title: '原则践行者',
        subtitle: '稳健通关 · 智慧',
        description: '你可能不是最成功的，但绝对是最有原则的。极度透明、创意择优、拥抱痛苦...达利欧的每一条你都实践了。公司文化成了行业标杆。\n\n《原则》续集想采访你当案例。',
        emoji: '📚',
        tier: 'good'
      };
    }

    // 9. 平衡大师（所有属性差距<20，全面发展）
    if (isBalanced && allAbove50) {
      return {
        id: 'balanced',
        title: '全面发展',
        subtitle: '稳健通关 · 平衡',
        description: '你没有明显的短板，也没有特别突出的长板，但这恰恰是最难的。资金、士气、声誉、技术、人脉样样不落。这才是真正的企业家。\n\n平衡就是最高级的艺术。',
        emoji: '⚖️',
        tier: 'good'
      };
    }

    // 10. 幸存者（勉强通关，所有属性>20）
    if (allAbove20) {
      return {
        title: '劫后余生',
        subtitle: '勉强通关',
        description: '你活下来了。虽然公司摇摇欲坠，各项指标都在及格线边缘，但至少还活着。圈子里有个词叫"僵尸企业"，但僵尸也是有生命的。\n\n能活着，就有希望。',
        emoji: '🧟',
        tier: 'survive'
      };
    }

    // 默认兜底结局（极限生存）
    return {
      title: '极限生存',
      subtitle: '惊险通关',
      description: '你几乎是爬着冲过终点线的。至少有一项指标濒临崩溃，公司随时可能倒闭，但你硬是咬牙撑到了第12个月。\n\n这不是成功，这是求生欲。但在这条路上，活下来本身就是奇迹。',
      emoji: '🔥',
      tier: 'survive'
    };
  }

  // ====== 达利欧评估报告 ======
  getReport() {
    const d = this.state.dalio;
    const labels = {
      transparency: '极度透明',
      talent: '人才匹配',
      machine: '系统思维',
      meritocracy: '创意择优',
      pain: '拥抱痛苦',
      legacy: '传承进化'
    };

    const descriptions = {
      transparency: { high: '你像达利欧一样信奉透明——让真相说话', low: '你喜欢暗箱操作——信息就是权力嘛' },
      talent: { high: '你善于识人用人——把对的人放在对的位置', low: '你随意安排人事——反正都是干活的' },
      machine: { high: '你把组织当机器来优化——每个齿轮都很重要', low: '你头痛医头脚痛医脚——消防队长式管理' },
      meritocracy: { high: '你让最好的想法获胜——不看职级看道理', low: '你说了算——毕竟你是老板嘛' },
      pain: { high: '你从痛苦中学习成长——每次摔倒都爬得更高', low: '你逃避问题——眼不见心不烦' },
      legacy: { high: '你在建造可持续的体系——超越个人的伟大', low: '你走一步看一步——谁管明天呢' }
    };

    // 计算总分和老板类型
    const total = Object.values(d).reduce((a, b) => a + b, 0);
    const bossType = this.getBossType(d);

    const dimensions = Object.entries(d).map(([key, val]) => ({
      key,
      label: labels[key],
      score: val,
      maxPossible: this.state.totalDecisions * 3,
      description: val >= 0 ? descriptions[key].high : descriptions[key].low
    }));

    return {
      totalDalioScore: total,
      dimensions,
      bossType,
      totalDecisions: this.state.totalDecisions,
      weeksPlayed: this.state.week,
      history: this.state.history
    };
  }

  getBossType(d) {
    const total = Object.values(d).reduce((a, b) => a + b, 0);
    const max = Math.max(...Object.values(d));
    const min = Math.min(...Object.values(d));
    const maxKey = Object.entries(d).find(([k, v]) => v === max)?.[0];

    if (total > 50) return { name: '达利欧的好学生', emoji: '📚', desc: '你完美践行了《原则》，达利欧看了都直呼内行。' };
    if (total > 25) return { name: '开明管理者', emoji: '🌟', desc: '你大部分时候做出了明智的决策，是个值得追随的老板。' };
    if (total > 0) return { name: '及格线老板', emoji: '😐', desc: '不好不坏，中规中矩。你的员工觉得"还行吧"。' };

    if (d.transparency < -10) return { name: '信息黑洞', emoji: '🕳️', desc: '你把信息当权力，团队在黑暗中摸索。达利欧要气哭了。' };
    if (d.meritocracy < -10) return { name: '独裁暴君', emoji: '👹', desc: '你的决策逻辑：我是老板，我说了算。创意择优？不存在的。' };
    if (d.pain < -10) return { name: '鸵鸟老板', emoji: '🙈', desc: '你拒绝面对痛苦和现实，把头埋在沙子里。问题？什么问题？' };
    if (d.machine < -10) return { name: '消防队长', emoji: '🚒', desc: '你永远在救火，从不思考为什么总着火。系统思维为零。' };

    return { name: '混世魔王', emoji: '😈', desc: '你几乎违反了达利欧的每一条原则。但嘿，至少你活着（或者没有）。' };
  }

  // ====== 存档系统 ======
  save() {
    try {
      const saveData = {
        ...this.state,
        usedEvents: Array.from(this.state.usedEvents),
        usedSeries: Array.from(this.state.usedSeries || [])
      };
      localStorage.setItem('boss_game_save', JSON.stringify(saveData));
    } catch (e) { /* 静默失败 */ }
  }

  static load() {
    try {
      const data = localStorage.getItem('boss_game_save');
      if (!data) return null;
      const parsed = JSON.parse(data);
      parsed.usedEvents = new Set(parsed.usedEvents);
      parsed.usedSeries = new Set(parsed.usedSeries || []);
      return parsed;
    } catch (e) { return null; }
  }

  static clearSave() {
    localStorage.removeItem('boss_game_save');
  }

  resumeFrom(savedState) {
    this.state = savedState;
  }
}
