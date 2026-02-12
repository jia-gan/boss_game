// ==========================================
// BOSS大冒险 - UI 渲染引擎
// ==========================================

class GameUI {
  constructor(game) {
    this.game = game;
    this.currentEvent = null;
    this.animating = false;
  }

  // ====== 开始画面 ======
  showStartScreen() {
    const saved = BossGame.load();
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('ending-screen').classList.add('hidden');

    const continueBtn = document.getElementById('continue-btn');
    if (saved && !saved.gameOver) {
      continueBtn.classList.remove('hidden');
      continueBtn.onclick = () => {
        this.game.resumeFrom(saved);
        this.game.ui = this;
        this.enterGame();
        this.game.startWeek();
      };
    } else {
      continueBtn.classList.add('hidden');
    }

    document.getElementById('start-btn').onclick = () => {
      const name = document.getElementById('company-name').value.trim() || '摸鱼科技';
      BossGame.clearSave();
      this.game.init(name, this);
      this.enterGame();
      this.game.startWeek();
    };
  }

  enterGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    this.updateDashboard(this.game.state);
    this.renderEmployees(this.game.state.employees);
  }

  // ====== 仪表盘 ======
  updateDashboard(state) {
    document.getElementById('company-title').textContent = state.companyName;
    const weekText = state.week > 12 ? '终章' : `第 ${state.week} / 12 月`;
    document.getElementById('week-display').textContent = weekText;
    document.getElementById('week-progress').style.width = `${Math.min(100, (state.week / 12) * 100)}%`;

    const statMeta = {
      funds: { label: '资金', icon: '💰', color: '#FFD700' },
      morale: { label: '士气', icon: '😊', color: '#6BCB77' },
      reputation: { label: '声誉', icon: '📣', color: '#4ECDC4' },
      tech: { label: '技术', icon: '🔧', color: '#45B7D1' },
      connections: { label: '人脉', icon: '🤝', color: '#A78BFA' }
    };

    const container = document.getElementById('stats-bars');
    container.innerHTML = '';

    for (const [key, meta] of Object.entries(statMeta)) {
      const val = state.stats[key];
      const bar = document.createElement('div');
      bar.className = 'stat-row';
      bar.innerHTML = `
        <div class="stat-label">${meta.icon} ${meta.label}</div>
        <div class="stat-bar-track">
          <div class="stat-bar-fill ${val <= 20 ? 'danger' : val <= 40 ? 'warning' : ''}"
               style="width:${val}%; background:${val <= 20 ? '#ff4444' : val <= 40 ? '#ffaa00' : meta.color}"
               data-stat="${key}"></div>
        </div>
        <div class="stat-value">${val}</div>
      `;
      container.appendChild(bar);
    }

    this.renderEmployees(state.employees);
  }

  // ====== 员工面板 ======
  renderEmployees(employees) {
    const container = document.getElementById('employee-list');
    container.innerHTML = '';
    employees.forEach(emp => {
      const el = document.createElement('div');
      el.className = `employee-card ${emp.quit ? 'quit' : ''} ${emp.loyalty <= 30 ? 'unhappy' : ''}`;
      const loyaltyColor = emp.loyalty > 60 ? '#6BCB77' : emp.loyalty > 30 ? '#ffaa00' : '#ff4444';
      el.innerHTML = `
        <div class="emp-avatar" style="background:${emp.color}20; border-color:${emp.color}">${emp.emoji}</div>
        <div class="emp-info">
          <div class="emp-name">${emp.name}${emp.quit ? ' (已离职)' : ''}</div>
          <div class="emp-title">${emp.title}</div>
        </div>
        <div class="emp-loyalty" title="忠诚度 ${emp.loyalty}">
          <div class="loyalty-bar" style="width:${emp.loyalty}%;background:${loyaltyColor}"></div>
        </div>
      `;
      container.appendChild(el);
    });
  }

  // ====== 上帝视角 ======
  toggleGodMode() {
    const screen = document.getElementById('game-screen');
    screen.classList.toggle('god-mode');
    const btn = document.getElementById('god-mode-btn');
    btn.classList.toggle('active');
    btn.title = btn.classList.contains('active') ? '上帝视角：已开启（点击关闭）' : '上帝视角：显示选项的数值效果';
  }

  // ====== 提示框切换 ======
  toggleTooltip() {
    const overlay = document.getElementById('tooltip-overlay');
    const content = document.getElementById('tooltip-content');
    overlay.classList.toggle('show');
    content.classList.toggle('show');
  }

  getEffectTags(effects) {
    const icons = { funds: '💰', morale: '😊', reputation: '📣', tech: '🔧', connections: '🤝' };
    return Object.entries(effects)
      .filter(([_, val]) => val !== 0)
      .map(([key, val]) => {
        const cls = val > 0 ? 'positive' : 'negative';
        return `<span class="effect-tag ${cls}">${icons[key]}${val > 0 ? '+' : ''}${val}</span>`;
      })
      .join('');
  }

  // ====== 原则标签生成 ======
  getPrincipleTags(principles) {
    const labels = {
      transparency: '极度透明', talent: '人才匹配', machine: '系统思维',
      meritocracy: '创意择优', pain: '拥抱痛苦', legacy: '传承进化'
    };
    return Object.entries(principles)
      .filter(([_, val]) => val !== 0)
      .map(([key, val]) => {
        // 去掉颜色提示，统一使用中性样式
        return `<span class="principle-tag neutral">${labels[key] || key}</span>`;
      })
      .join('');
  }

  // ====== 事件显示 ======
  showEvent(event, isChain) {
    this.currentEvent = event;
    const reporter = this.game.state.employees.find(e => e.id === event.reporter) || EMPLOYEES.find(e => e.id === event.reporter) || { name: '???', title: '未知', emoji: '❓', color: '#888', style: '...' };
    const panel = document.getElementById('event-panel');
    const typeLabels = { crisis: '危机', opportunity: '机遇', daily: '日常', boss: 'BOSS级' };
    const typeColors = { crisis: '#ff4444', opportunity: '#6BCB77', daily: '#4ECDC4', boss: '#A78BFA' };
    const advice = typeof DALIO_ADVICE !== 'undefined' ? DALIO_ADVICE[event.id] : '';

    // === 新增：连续剧进度显示 ===
    let seriesProgress = '';
    if (event.isSeries) {
      seriesProgress = `
        <div class="series-progress">
          <span class="series-badge">📺 连续剧</span>
          <span class="series-chapter">第 ${event.chapter} / ${event.totalChapters} 章</span>
        </div>
      `;
    }

    // === 新增：支持动态描述 ===
    let description = event.description;
    if (event._runtimeState && typeof event.dynamicDescription === 'function') {
      description = event.dynamicDescription(event._runtimeState);
    }

    panel.innerHTML = `
      <div class="event-card ${isChain ? 'chain-event' : ''} ${event.isSeries ? 'series-event' : ''}" style="animation: cardSlideIn 0.5s ease-out">
        ${seriesProgress}
        <div class="event-header">
          <span class="event-type" style="background:${typeColors[event.type]}">${isChain ? '连锁' : typeLabels[event.type]}</span>
          <span class="event-week">${this.game.state.week > 12 ? '终章' : '第' + this.game.state.week + '月'}</span>
        </div>
        <h2 class="event-title">${event.title}</h2>
        <div class="event-reporter">
          <span class="reporter-avatar" style="background:${reporter.color}20;border-color:${reporter.color}">${reporter.emoji}</span>
          <div class="reporter-info">
            <span class="reporter-name">${reporter.name} · ${reporter.title}</span>
            <span class="reporter-style">"${reporter.style}"</span>
          </div>
        </div>
        <div class="event-description">${description}</div>
        ${advice ? `<div class="dalio-advice"><span class="dalio-advice-icon">📖</span><span class="dalio-advice-text">${advice}</span></div>` : ''}
        <div class="event-choices">
          ${event.choices.map((c, i) => `
            <button class="choice-btn" onclick="gameUI.onChoice(${i})" style="animation: fadeInUp ${0.3 + i * 0.1}s ease-out">
              <span class="choice-icon">${['A', 'B', 'C', 'D'][i]}</span>
              <div class="choice-content">
                <span class="choice-text">${c.text}</span>
                ${c.principles ? `<div class="choice-principles">${this.getPrincipleTags(c.principles)}</div>` : ''}
                ${c.effects ? `<div class="choice-effects">${this.getEffectTags(c.effects)}</div>` : ''}
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  onChoice(index) {
    if (this.animating) return;
    this.animating = true;

    // 禁用所有按钮
    document.querySelectorAll('.choice-btn').forEach((btn, i) => {
      btn.disabled = true;
      if (i === index) btn.classList.add('selected');
    });

    setTimeout(() => {
      this.game.makeChoice(this.currentEvent, index);
    }, 300);
  }

  // ====== 结果显示 ======
  showResult(message, changes, prevStats, principles) {
    const panel = document.getElementById('event-panel');
    const changeItems = Object.entries(changes).map(([key, val]) => {
      const labels = { funds: '💰资金', morale: '😊士气', reputation: '📣声誉', tech: '🔧技术', connections: '🤝人脉' };
      const cls = val > 0 ? 'positive' : 'negative';
      return `<div class="change-item ${cls}">${labels[key]} ${val > 0 ? '+' : ''}${val}</div>`;
    }).join('');

    const principleItems = principles ? this.getPrincipleTags(principles) : '';

    panel.innerHTML = `
      <div class="result-card" style="animation: cardSlideIn 0.4s ease-out">
        <h3 class="result-title">决策结果</h3>
        <div class="result-message">${message}</div>
        ${changeItems ? `<div class="result-changes">${changeItems}</div>` : ''}
        ${principleItems ? `<div class="result-principles"><div class="result-principles-title">📖 达利欧原则影响</div><div class="result-principles-tags">${principleItems}</div></div>` : ''}
        <button class="next-btn" onclick="gameUI.onNextWeek()">继续 →</button>
      </div>
    `;

    // 动画更新属性条
    this.animateStatChanges(changes, prevStats);
    this.addToNewsTicker(message);
    this.animating = false;
  }

  animateStatChanges(changes, prevStats) {
    for (const [key, val] of Object.entries(changes)) {
      const bar = document.querySelector(`[data-stat="${key}"]`);
      if (bar) {
        bar.classList.add('flash');
        setTimeout(() => {
          bar.style.width = `${this.game.state.stats[key]}%`;
          bar.classList.remove('flash');
        }, 100);
      }
    }
    // 更新数值显示
    setTimeout(() => this.updateDashboard(this.game.state), 500);
  }

  addToNewsTicker(message) {
    const ticker = document.getElementById('news-ticker');
    const item = document.createElement('span');
    item.className = 'ticker-item';
    item.textContent = `【第${this.game.state.week}月】${message.substring(0, 40)}...`;
    ticker.appendChild(item);
    // 保持最近10条
    while (ticker.children.length > 10) ticker.removeChild(ticker.firstChild);
    ticker.scrollLeft = ticker.scrollWidth;
  }

  onNextWeek() {
    this.game.afterResult();
  }

  // ====== 员工离职弹窗 ======
  showEmployeeQuit(employee, callback) {
    const panel = document.getElementById('event-panel');
    panel.innerHTML = `
      <div class="result-card quit-card" style="animation: cardSlideIn 0.4s ease-out">
        <div class="quit-avatar" style="background:${employee.color}20;border-color:${employee.color}">${employee.emoji}</div>
        <h3 class="result-title" style="color:#ff4444">员工提出离职</h3>
        <div class="result-message">${employee.name}（${employee.title}）把辞职信拍在了你桌上："老板，我真的干不下去了。"</div>
        <div class="quit-choices">
          <button class="choice-btn retain-btn" onclick="gameUI.onRetainChoice(true, '${employee.id}')">
            <span class="choice-icon">A</span>
            <span class="choice-text">挽留（消耗资金）</span>
          </button>
          <button class="choice-btn release-btn" onclick="gameUI.onRetainChoice(false, '${employee.id}')">
            <span class="choice-icon">B</span>
            <span class="choice-text">放手，祝好</span>
          </button>
        </div>
      </div>
    `;
    this._quitCallback = callback;
  }

  onRetainChoice(retain, empId) {
    const emp = this.game.state.employees.find(e => e.id === empId);
    const result = this.game.handleEmployeeQuit(emp, retain);
    const panel = document.getElementById('event-panel');

    panel.innerHTML = `
      <div class="result-card" style="animation: cardSlideIn 0.4s ease-out">
        <h3 class="result-title">${result.success ? '挽留成功' : '离别'}</h3>
        <div class="result-message">${result.message}</div>
        <button class="next-btn" onclick="gameUI.afterQuit()">继续 →</button>
      </div>
    `;

    this.updateDashboard(this.game.state);
  }

  afterQuit() {
    if (this._quitCallback) {
      this._quitCallback();
      this._quitCallback = null;
    }
  }

  // ====== 季度考核 ======
  showQuarterlyReview(title, message, totalStats, callback) {
    const panel = document.getElementById('event-panel');
    panel.innerHTML = `
      <div class="result-card review-card" style="animation: cardSlideIn 0.4s ease-out">
        <div class="review-icon">📊</div>
        <h3 class="result-title">${title}</h3>
        <div class="review-score">综合健康度: ${totalStats}/500</div>
        <div class="result-message">${message}</div>
        <button class="next-btn" onclick="gameUI.onReviewDone()">继续 →</button>
      </div>
    `;
    this._reviewCallback = callback;
    this.updateDashboard(this.game.state);
  }

  onReviewDone() {
    if (this._reviewCallback) {
      this._reviewCallback();
      this._reviewCallback = null;
    }
  }

  // ====== 结局画面 ======
  showEnding(ending, report) {
    document.getElementById('game-screen').classList.add('hidden');
    const screen = document.getElementById('ending-screen');
    screen.classList.remove('hidden');
    screen.className = `ending-screen ${ending.tier || 'fail'}`;

    // 结局主信息
    document.getElementById('ending-emoji').textContent = ending.emoji;
    document.getElementById('ending-title').textContent = ending.title;
    document.getElementById('ending-subtitle').textContent = ending.subtitle;
    document.getElementById('ending-description').textContent = ending.description;
    document.getElementById('ending-week').textContent = `坚持了 ${report.weeksPlayed} 月 / 做了 ${report.totalDecisions} 个决策`;

    // 达利欧报告
    const bossType = document.getElementById('boss-type');
    bossType.innerHTML = `
      <div class="boss-type-emoji">${report.bossType.emoji}</div>
      <div class="boss-type-name">${report.bossType.name}</div>
      <div class="boss-type-desc">${report.bossType.desc}</div>
    `;

    // 六维雷达（用条形图代替）
    const radarEl = document.getElementById('dalio-radar');
    radarEl.innerHTML = report.dimensions.map(dim => {
      const pct = dim.maxPossible > 0 ? Math.min(100, Math.max(0, ((dim.score + dim.maxPossible) / (dim.maxPossible * 2)) * 100)) : 50;
      const color = dim.score > 0 ? '#6BCB77' : dim.score < 0 ? '#ff4444' : '#888';
      return `
        <div class="dalio-dim">
          <div class="dalio-dim-label">${dim.label}</div>
          <div class="dalio-dim-bar-track">
            <div class="dalio-dim-bar" style="width:${pct}%;background:${color}"></div>
            <div class="dalio-dim-mid"></div>
          </div>
          <div class="dalio-dim-score" style="color:${color}">${dim.score > 0 ? '+' : ''}${dim.score}</div>
        </div>
        <div class="dalio-dim-desc">${dim.description}</div>
      `;
    }).join('');

    // 历史回顾
    const historyEl = document.getElementById('decision-history');
    historyEl.innerHTML = report.history.map(h => `
      <div class="history-item">
        <span class="history-week">M${h.week}</span>
        <span class="history-rating" title="评分: ${h.score}">${h.ratingEmoji} ${h.rating}</span>
        <span class="history-event">${h.event}</span>
        <span class="history-choice">${h.choice}</span>
      </div>
    `).join('');

    // 重新开始按钮
    document.getElementById('restart-btn').onclick = () => {
      BossGame.clearSave();
      screen.classList.add('hidden');
      this.showStartScreen();
    };
  }
}

// 全局实例
let game, gameUI;

window.addEventListener('DOMContentLoaded', () => {
  game = new BossGame();
  gameUI = new GameUI(game);
  gameUI.showStartScreen();
});
