(function () {
  const data = window.BAXIAN_DATA;
  const app = document.getElementById("app");
  const state = { screen: "home", index: 0, answers: [], scores: {} };

  const dimensions = {
    courage: { label: "勇敢", note: "面对不确定时，愿意先迈出一步。" },
    freedom: { label: "洒脱", note: "不被单一标准束缚，保留自己的选择。" },
    resilience: { label: "坚韧", note: "遇到难题时，仍能把注意力放回行动。" },
    empathy: { label: "共情", note: "能感知他人的情绪，也愿意温柔回应。" },
    insight: { label: "洞察", note: "习惯观察表象之外的规律和可能性。" },
    order: { label: "守序", note: "重视承诺、边界和让事情可靠运转。" }
  };

  const profileDimensions = {
    "吕洞宾": { courage: 95, freedom: 58, resilience: 78, empathy: 68, insight: 70, order: 72 },
    "钟离权": { courage: 72, freedom: 66, resilience: 70, empathy: 88, insight: 58, order: 60 },
    "铁拐李": { courage: 80, freedom: 54, resilience: 98, empathy: 56, insight: 64, order: 65 },
    "何仙姑": { courage: 55, freedom: 48, resilience: 72, empathy: 98, insight: 90, order: 76 },
    "韩湘子": { courage: 60, freedom: 96, resilience: 62, empathy: 76, insight: 78, order: 42 },
    "曹国舅": { courage: 64, freedom: 38, resilience: 84, empathy: 66, insight: 76, order: 98 },
    "蓝采和": { courage: 68, freedom: 98, resilience: 66, empathy: 78, insight: 52, order: 30 },
    "张果老": { courage: 50, freedom: 72, resilience: 68, empathy: 62, insight: 98, order: 58 }
  };

  // 每道题的四个选项分别对应一个观察维度，用来解释结果，不改变原有八仙计分。
  const dimensionSignals = [
    ["courage", "freedom", "insight", "empathy"],
    ["insight", "courage", "empathy", "freedom"],
    ["courage", "insight", "empathy", "order"],
    ["courage", "empathy", "insight", "freedom"],
    ["empathy", "courage", "insight", "freedom"],
    ["freedom", "insight", "empathy", "insight"],
    ["courage", "freedom", "resilience", "insight"],
    ["courage", "insight", "empathy", "order"],
    ["order", "freedom", "insight", "courage"],
    ["insight", "order", "freedom", "empathy"],
    ["insight", "freedom", "courage", "empathy"],
    ["order", "insight", "freedom", "courage"],
    ["empathy", "courage", "order", "freedom"],
    ["courage", "freedom", "empathy", "insight"],
    ["order", "freedom", "courage", "empathy"]
  ];

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[char]));
  }

  function scoreAnswer(questionIndex, optionIndex) {
    const entries = data.scoreMap[questionIndex][optionIndex];
    entries.forEach(([name, points]) => {
      state.scores[name] = (state.scores[name] || 0) + points;
    });
  }

  function renderHome() {
    app.innerHTML = `
      <section class="page home-page">
        <div class="home-orb orb-one"></div><div class="home-orb orb-two"></div>
        <div class="topline"><span>八仙 · PERSONALITY MATRIX</span><span>01 — 15</span></div>
        <div class="home-layout">
          <div>
            <p class="eyebrow">一场关于选择的东方思想实验</p>
            <h1>如果你也是八仙，<br /><em>你会是哪一位？</em></h1>
            <p class="subtitle">15 道奇遇题，拆解你的勇敢、洒脱与内在底色。</p>
            <div class="intro-card card">
              <div class="card-kicker">HOW IT WORKS / 测试方式</div>
              <p>人生是一条漫漫长路，沿途总会遇见岔路、同行者和没有标准答案的时刻。就像八仙各自走出不同的修行路，你也会在一次次取舍里，决定向哪里出发、为谁停留、坚持什么，又愿意放下什么。接下来，请凭直觉做出你的选择，看看这段旅程最终会把你带向哪一位八仙。</p>
              <div class="intro-meta"><span>情境选择</span><span>六维百分比</span><span>散点坐标</span></div>
            </div>
            <button class="primary-button" data-action="start">开启思想实验 <span>↗</span></button>
            <p class="hint">预计用时 3 分钟 · 结果仅供自我探索，不构成心理诊断</p>
          </div>
          <div class="seal-card" aria-label="八仙性格矩阵">
            <div class="seal-ring"></div><div class="seal-mark">八<br />仙</div>
            <p>THE<br />EIGHT<br />IMMORTALS</p>
            <span>性格矩阵 · 2026</span>
          </div>
        </div>
      </section>`;
  }

  function renderQuiz() {
    const question = data.questions[state.index];
    const progress = Math.round(((state.index + 1) / data.questions.length) * 100);
    app.innerHTML = `
      <section class="page quiz-page">
        <div class="topline"><span>八仙 · PERSONALITY MATRIX</span><span>${String(state.index + 1).padStart(2, "0")} / ${String(data.questions.length).padStart(2, "0")}</span></div>
        <div class="progress-wrap"><div class="progress"><span style="width:${progress}%"></span></div><b>${progress}%</b></div>
        <div class="question-layout">
          <aside class="question-aside"><span>奇遇 ${String(state.index + 1).padStart(2, "0")}</span><i></i><p>凭第一直觉。<br />没有标准答案。</p></aside>
          <div class="question-main">
            <p class="eyebrow">${escapeHtml(question.title)}</p>
            <h2>${escapeHtml(question.scene)}</h2>
            <p class="hint">选择最接近你真实反应的那一项。</p>
            <div class="options">
              ${question.options.map((option, index) => `
                <button class="option" data-option="${index}">
                  <span class="option-number">${String.fromCharCode(65 + index)}</span>
                  <span>${escapeHtml(option)}</span><span class="option-arrow">→</span>
                </button>`).join("")}
            </div>
          </div>
        </div>
      </section>`;
  }

  function getRanking() {
    return Object.keys(data.profiles).sort((a, b) => {
      const scoreDiff = (state.scores[b] || 0) - (state.scores[a] || 0);
      return scoreDiff || a.localeCompare(b, "zh-CN");
    });
  }

  function getDimensionScores(winner) {
    const base = profileDimensions[winner];
    const counts = Object.fromEntries(Object.keys(dimensions).map((key) => [key, 0]));
    state.answers.forEach((option, index) => {
      const key = dimensionSignals[index]?.[option];
      if (key) counts[key] += 1;
    });
    const total = Math.max(1, state.answers.length);
    return Object.fromEntries(Object.keys(dimensions).map((key) => [
      key,
      Math.round(base[key] * 0.68 + (counts[key] / total) * 100 * 0.32)
    ]));
  }

  function getEvidence(dimensionScores) {
    return Object.keys(dimensions).sort((a, b) => dimensionScores[b] - dimensionScores[a]).slice(0, 3).map((key) => {
      const questionIndex = state.answers.findIndex((option, index) => dimensionSignals[index]?.[option] === key);
      const question = data.questions[questionIndex >= 0 ? questionIndex : 0];
      const option = state.answers[questionIndex >= 0 ? questionIndex : 0] || 0;
      return { key, title: question.title, answer: question.options[option] };
    });
  }

  function renderDimensionBars(dimensionScores) {
    return Object.keys(dimensions).map((key) => `
      <div class="dimension-row">
        <div class="dimension-name"><span>${dimensions[key].label}</span><small>${dimensions[key].note}</small></div>
        <div class="dimension-track"><i style="width:${dimensionScores[key]}%"></i></div><b>${dimensionScores[key]}%</b>
      </div>`).join("");
  }

  function renderDiamond(dimensionScores) {
    const keys = Object.keys(dimensions);
    const plot = { cx: 235, cy: 122, radius: 86 };
    const angles = keys.map((_, index) => -Math.PI / 2 + (index * Math.PI * 2) / keys.length);
    const point = (value, index, radius = plot.radius) => {
      const angle = angles[index];
      const length = radius * (value / 100);
      return `${plot.cx + Math.cos(angle) * length},${plot.cy + Math.sin(angle) * length}`;
    };
    const grid = [25, 50, 75, 100].map((level) => `<polygon points="${keys.map((_, index) => point(level, index)).join(" ")}"></polygon>`).join("");
    const axes = keys.map((_, index) => {
      const [x, y] = point(100, index).split(",");
      return `<line x1="${plot.cx}" y1="${plot.cy}" x2="${x}" y2="${y}"></line>`;
    }).join("");
    const area = keys.map((key, index) => point(dimensionScores[key], index)).join(" ");
    const dots = keys.map((key, index) => {
      const [x, y] = point(dimensionScores[key], index).split(",");
      return `<circle cx="${x}" cy="${y}" r="4"></circle>`;
    }).join("");
    const labels = keys.map((key, index) => {
      const [x, y] = point(100, index, plot.radius + 27).split(",");
      return `<text x="${x}" y="${y}" text-anchor="middle">${dimensions[key].label}</text>`;
    }).join("");
    return `<div class="diamond-wrap">
      <svg class="diamond" viewBox="0 0 470 255" role="img" aria-label="六维性格钻石图">
        <g class="diamond-grid">${grid}</g>
        <g class="diamond-axes">${axes}</g>
        <polygon class="diamond-area" points="${area}"></polygon>
        <g class="diamond-points">${dots}</g>
        <g class="diamond-labels">${labels}</g>
      </svg>
    </div>`;
  }

  function renderResult() {
    const ranking = getRanking();
    const winner = ranking[0];
    const profile = data.profiles[winner];
    const dimensionScores = getDimensionScores(winner);
    const evidence = getEvidence(dimensionScores);
    app.innerHTML = `
      <section class="page result-page">
        <div class="topline"><span>八仙 · PERSONALITY MATRIX</span><span>REPORT / COMPLETE</span></div>
        <div class="result-heading"><p class="eyebrow">YOUR RESULT · 你的主人格</p><h1>${escapeHtml(winner)}</h1><p class="result-title">${escapeHtml(profile.title)}</p><p class="result-lead">你的选择指向一种${escapeHtml(profile.keywords.split(" · ")[0])}的内在底色。下面是这份结论的组成证据。</p></div>
        <div class="proof-card card"><div><span class="card-kicker">WHY THIS RESULT / 结论怎么来的</span><h2>你的选择，<br /><em>汇成一个人格。</em></h2></div><p>15 道情境选择 → 六维倾向 → 八仙画像，最终生成你的主人格。</p><div class="evidence-list">${evidence.map((item) => `<div class="evidence-item"><b>${dimensions[item.key].label}</b><span>${escapeHtml(item.title)}：${escapeHtml(item.answer)}</span></div>`).join("")}</div></div>
        <div class="result-grid">
          <div class="card dimension-card"><div class="card-kicker">SIX DIMENSIONS / 六维百分比</div><h2>你的性格构成</h2><p class="section-note">百分比代表本次选择中呈现出的相对倾向，不是能力高低。</p>${renderDimensionBars(dimensionScores)}</div>
          <div class="card diamond-card"><div class="card-kicker">PERSONALITY DIAMOND / 性格钻石图</div><h2>你的性格构成</h2><p class="section-note">六个维度的相对倾向。</p>${renderDiamond(dimensionScores)}</div>
        </div>
        <div class="card profile-card"><div class="profile-top"><div><div class="card-kicker">THE CORE / 主人格画像</div><h2>${escapeHtml(winner)} · ${escapeHtml(profile.title)}</h2><p class="keywords">${escapeHtml(profile.keywords)}</p></div><div class="score-stamp">主人格<br /><strong>${Math.max(...Object.values(dimensionScores))}%</strong></div></div><div class="profile-copy"><div><h3>你身上的光</h3><p>${escapeHtml(profile.strength)}</p></div><div><h3>留给自己的提醒</h3><p>${escapeHtml(profile.lesson)}</p></div></div><blockquote>“${escapeHtml(profile.quote)}”</blockquote></div>
        <div class="actions"><button class="primary-button" data-action="share">复制分享链接 <span>↗</span></button><button class="secondary-button" data-action="restart">重新进入旅程</button></div><p class="hint" id="share-message">链接已准备好，复制后可以发给朋友。</p>
      </section>`;
  }

  function render() {
    if (state.screen === "home") renderHome();
    else if (state.screen === "quiz") renderQuiz();
    else renderResult();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function share() {
    const url = window.location.href;
    const message = document.getElementById("share-message");
    try {
      if (navigator.share) await navigator.share({ title: "八仙性格测试", url });
      else await navigator.clipboard.writeText(url);
      if (message) message.textContent = "链接已复制，可以发给朋友了。";
    } catch (error) {
      if (message) message.textContent = "复制未完成，请手动复制浏览器地址栏链接。";
    }
  }

  app.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    const option = event.target.closest("[data-option]")?.dataset.option;
    if (action === "start") {
      state.screen = "quiz"; state.index = 0; state.answers = []; state.scores = {}; render();
    } else if (option !== undefined && state.screen === "quiz") {
      const selected = Number(option); state.answers.push(selected); scoreAnswer(state.index, selected);
      state.index += 1; state.screen = state.index >= data.questions.length ? "result" : "quiz"; render();
    } else if (action === "restart") {
      state.screen = "home"; state.index = 0; state.answers = []; state.scores = {}; render();
    } else if (action === "share") share();
  });

  render();
})();
