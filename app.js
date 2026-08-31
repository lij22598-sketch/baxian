(function () {
  const data = window.BAXIAN_DATA;
  const app = document.getElementById("app");
  const state = { screen: "home", index: 0, answers: [] };

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

  const artifacts = [
    { name: "吕洞宾", item: "捆仙索", mark: "索", note: "果断与担当" },
    { name: "钟离权", item: "芭蕉扇", mark: "扇", note: "乐观与调和" },
    { name: "铁拐李", item: "紫金葫芦", mark: "葫", note: "坚韧与承受" },
    { name: "何仙姑", item: "金蛟剪", mark: "剪", note: "敏锐与守护" },
    { name: "韩湘子", item: "笛子", mark: "笛", note: "自由与表达" },
    { name: "曹国舅", item: "阴阳板", mark: "板", note: "原则与秩序" },
    { name: "蓝采和", item: "花篮", mark: "篮", note: "洒脱与灵动" },
    { name: "张果老", item: "渔鼓", mark: "鼓", note: "洞察与节奏" }
  ];

  // 15 道题覆盖六个维度的全部两两组合；每个维度恰好被测量 5 次。
  // 每个选项只在本题的两个焦点维度上计分，0-2 分代表该选择呈现出的倾向强度。
  const dimensionItems = [
    { pair: ["courage", "freedom"], options: [{ courage: 2, freedom: 1 }, { courage: 1, freedom: 2 }, { courage: 0, freedom: 2 }, { courage: 1, freedom: 0 }] },
    { pair: ["courage", "resilience"], options: [{ courage: 0, resilience: 2 }, { courage: 2, resilience: 1 }, { courage: 1, resilience: 1 }, { courage: 1, resilience: 0 }] },
    { pair: ["courage", "empathy"], options: [{ courage: 2, empathy: 0 }, { courage: 1, empathy: 1 }, { courage: 0, empathy: 2 }, { courage: 1, empathy: 1 }] },
    { pair: ["courage", "insight"], options: [{ courage: 2, insight: 0 }, { courage: 1, insight: 1 }, { courage: 0, insight: 2 }, { courage: 1, insight: 0 }] },
    { pair: ["resilience", "empathy"], options: [{ resilience: 0, empathy: 2 }, { resilience: 2, empathy: 1 }, { resilience: 2, empathy: 0 }, { resilience: 0, empathy: 1 }] },
    { pair: ["freedom", "empathy"], options: [{ freedom: 2, empathy: 1 }, { freedom: 0, empathy: 1 }, { freedom: 1, empathy: 2 }, { freedom: 2, empathy: 0 }] },
    { pair: ["freedom", "insight"], options: [{ freedom: 1, insight: 0 }, { freedom: 2, insight: 0 }, { freedom: 0, insight: 2 }, { freedom: 2, insight: 1 }] },
    { pair: ["courage", "order"], options: [{ courage: 2, order: 0 }, { courage: 1, order: 1 }, { courage: 1, order: 2 }, { courage: 0, order: 1 }] },
    { pair: ["freedom", "order"], options: [{ freedom: 0, order: 2 }, { freedom: 2, order: 0 }, { freedom: 0, order: 2 }, { freedom: 2, order: 0 }] },
    { pair: ["resilience", "insight"], options: [{ resilience: 1, insight: 1 }, { resilience: 1, insight: 2 }, { resilience: 0, insight: 2 }, { resilience: 2, insight: 0 }] },
    { pair: ["freedom", "resilience"], options: [{ freedom: 0, resilience: 1 }, { freedom: 2, resilience: 1 }, { freedom: 1, resilience: 2 }, { freedom: 2, resilience: 0 }] },
    { pair: ["insight", "order"], options: [{ insight: 0, order: 2 }, { insight: 2, order: 1 }, { insight: 1, order: 0 }, { insight: 2, order: 2 }] },
    { pair: ["empathy", "insight"], options: [{ empathy: 1, insight: 2 }, { empathy: 0, insight: 1 }, { empathy: 2, insight: 1 }, { empathy: 1, insight: 2 }] },
    { pair: ["empathy", "order"], options: [{ empathy: 0, order: 1 }, { empathy: 1, order: 0 }, { empathy: 2, order: 2 }, { empathy: 1, order: 0 }] },
    { pair: ["resilience", "order"], options: [{ resilience: 0, order: 2 }, { resilience: 1, order: 0 }, { resilience: 1, order: 1 }, { resilience: 2, order: 1 }] }
  ];

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[char]));
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
              <p>接下来，我们会一起走过 15 个岔路口。你将面对未知、做出取舍、选择同行者，也会在每一次决定里，逐渐看见真正的自己。没有标准答案，凭第一直觉出发，看看走到最后，哪一位八仙与你最像。</p>
              <div class="intro-meta"><span>情境选择</span><span>性格钻石图</span><span>八仙法器图鉴</span></div>
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

  function getDimensionScores() {
    const totals = Object.fromEntries(Object.keys(dimensions).map((key) => [key, 0]));
    const counts = Object.fromEntries(Object.keys(dimensions).map((key) => [key, 0]));
    state.answers.forEach((option, index) => {
      const item = dimensionItems[index];
      if (!item) return;
      item.pair.forEach((key) => {
        totals[key] += item.options[option]?.[key] || 0;
        counts[key] += 1;
      });
    });
    return Object.fromEntries(Object.keys(dimensions).map((key) => {
      const maximum = Math.max(1, counts[key] * 2);
      return [key, Math.round((totals[key] / maximum) * 100)];
    }));
  }

  function getProfileDistance(userScores, profileScores) {
    return Math.sqrt(Object.keys(dimensions).reduce((sum, key) => {
      const difference = (userScores[key] || 0) - profileScores[key];
      return sum + difference * difference;
    }, 0));
  }

  function getProfileSimilarity(userScores, profileScores) {
    const meanDifference = Object.keys(dimensions).reduce((sum, key) => {
      return sum + Math.abs((userScores[key] || 0) - profileScores[key]);
    }, 0) / Object.keys(dimensions).length;
    return Math.max(0, Math.round(100 - meanDifference));
  }

  function getRanking(dimensionScores = getDimensionScores()) {
    return Object.keys(data.profiles).sort((a, b) => {
      const distanceDiff = getProfileDistance(dimensionScores, profileDimensions[a]) - getProfileDistance(dimensionScores, profileDimensions[b]);
      return distanceDiff || a.localeCompare(b, "zh-CN");
    });
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

  function renderArtifacts(winner) {
    return `<div class="artifact-gallery-frame"><img class="artifact-gallery" src="assets/baxian-artifacts-gallery.png" alt="八仙法器原创插画图鉴" /></div>
      <div class="artifact-captions">${artifacts.map((artifact, index) => `
        <div class="artifact-caption${artifact.name === winner ? " is-current" : ""}">
          <span>${String(index + 1).padStart(2, "0")}</span><div><strong>${escapeHtml(artifact.item)}</strong><small>${escapeHtml(artifact.name)} · ${escapeHtml(artifact.note)}</small></div>
        </div>`).join("")}</div>`;
  }

  function renderResult() {
    const dimensionScores = getDimensionScores();
    const ranking = getRanking(dimensionScores);
    const winner = ranking[0];
    const profile = data.profiles[winner];
    const similarity = getProfileSimilarity(dimensionScores, profileDimensions[winner]);
    app.innerHTML = `
      <section class="page result-page">
        <div class="topline"><span>八仙 · PERSONALITY MATRIX</span><span>REPORT / COMPLETE</span></div>
        <div class="result-heading"><p class="eyebrow">YOUR RESULT · 你的主人格</p><h1>${escapeHtml(winner)}</h1><p class="result-title">${escapeHtml(profile.title)}</p><p class="result-lead">你已经走过十五个岔路口。一路上，你如何面对未知、选择同行者、守住信念，也决定了你会成为怎样的人。现在，答案落在了一位八仙身上——看看这一次，命运把你带到了谁的身边。</p></div>
        <div class="result-grid">
          <div class="card diamond-card"><div class="card-kicker">PERSONALITY DIAMOND / 性格钻石图</div><h2>你的性格轮廓</h2><p class="section-note">六个维度共同勾勒你的性格轮廓，再与八仙画像进行整体比较。</p>${renderDiamond(dimensionScores)}</div>
          <div class="card artifact-card"><div class="card-kicker">EIGHT ARTIFACTS / 八仙法器</div><h2>每一位，都有自己的法器</h2><p class="section-note">电影《八仙！》公开设定中的八件法器，也像八种不同的选择方式。</p>${renderArtifacts(winner)}</div>
        </div>
        <div class="card profile-card"><div class="profile-top"><div><div class="card-kicker">THE CORE / 主人格画像</div><h2>${escapeHtml(winner)} · ${escapeHtml(profile.title)}</h2><p class="keywords">${escapeHtml(profile.keywords)}</p></div><div class="score-stamp">画像相似度<br /><strong>${similarity}%</strong></div></div><div class="profile-copy"><div><h3>你身上的光</h3><p>${escapeHtml(profile.strength)}</p></div><div><h3>留给自己的提醒</h3><p>${escapeHtml(profile.lesson)}</p></div></div><blockquote>“${escapeHtml(profile.quote)}”</blockquote></div>
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
      state.screen = "quiz"; state.index = 0; state.answers = []; render();
    } else if (option !== undefined && state.screen === "quiz") {
      const selected = Number(option); state.answers.push(selected);
      state.index += 1; state.screen = state.index >= data.questions.length ? "result" : "quiz"; render();
    } else if (action === "restart") {
      state.screen = "home"; state.index = 0; state.answers = []; render();
    } else if (action === "share") share();
  });

  render();
})();
