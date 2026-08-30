(function () {
  const data = window.BAXIAN_DATA;
  const app = document.getElementById("app");
  const state = { screen: "home", index: 0, answers: [], scores: {} };

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
        <div class="glow glow-one"></div><div class="glow glow-two"></div>
        <p class="eyebrow">PERSONALITY JOURNEY · 八仙性格测试</p>
        <h1>如果你也是八仙，<br />你会是哪一位？</h1>
        <p class="subtitle">15 道奇遇题，测出与你性格最相似的八仙。</p>
        <div class="card intro-card">
          <div class="accent-line"></div>
          <p>传说八仙各有不同。有人执剑而行，有人醉看人间；有人追求自由，也有人守护心中的秩序。</p>
          <p>接下来，你将经历 15 场奇遇。没有正确答案，请凭第一直觉选择。</p>
        </div>
        <button class="primary-button" data-action="start">开始旅程</button>
        <p class="hint">预计用时 3 分钟 · 结果仅供娱乐与自我探索</p>
      </section>`;
  }

  function renderQuiz() {
    const question = data.questions[state.index];
    const progress = Math.round((state.index / data.questions.length) * 100);
    app.innerHTML = `
      <section class="page quiz-page">
        <div class="quiz-top"><span>八仙性格测试</span><span>${state.index + 1} / ${data.questions.length}</span></div>
        <div class="progress"><span style="width:${progress}%"></span></div>
        <p class="eyebrow">${escapeHtml(question.title)}</p>
        <h2>${escapeHtml(question.scene)}</h2>
        <p class="hint">凭第一直觉选择，没有标准答案。</p>
        <div class="options">
          ${question.options.map((option, index) => `
            <button class="option" data-option="${index}">
              <span class="option-number">${String.fromCharCode(65 + index)}</span>
              <span>${escapeHtml(option)}</span>
            </button>`).join("")}
        </div>
      </section>`;
  }

  function getResult() {
    return Object.keys(data.profiles).sort((a, b) => {
      const scoreDiff = (state.scores[b] || 0) - (state.scores[a] || 0);
      return scoreDiff || a.localeCompare(b, "zh-CN");
    });
  }

  function profileCard(role, name, profile, extraClass) {
    return `<div class="card result-card ${extraClass}">
      <div class="role-badge">${role}</div>
      <h2 class="profile-name">${escapeHtml(name)}</h2>
      <p class="result-title">${escapeHtml(profile.title)}</p>
      <p class="keywords">${escapeHtml(profile.keywords)}</p>
      <h3>核心特质</h3><p>${escapeHtml(profile.strength)}</p>
      <h3>成长提醒</h3><p>${escapeHtml(profile.lesson)}</p>
      <blockquote>“${escapeHtml(profile.quote)}”</blockquote>
    </div>`;
  }

  function renderResult() {
    const ranking = getResult();
    const winner = ranking[0];
    const profile = data.profiles[winner];
    const totalScore = ranking.reduce((total, name) => total + (state.scores[name] || 0), 0);
    app.innerHTML = `
      <section class="page result-page">
        <p class="eyebrow">YOUR RESULT · 你的八仙人格</p>
        <p class="result-label">你的主人格是</p>
        <h1>${escapeHtml(winner)}</h1>
        <p class="result-title">${escapeHtml(profile.title)}</p>
        ${profileCard("主人格 · 你的核心驱动力", winner, profile, "primary-card")}
        <div class="card ranking-card">
          <h3>八仙性格倾向百分比</h3>
          <p class="ranking-hint">百分比越高，代表越接近你的主人格倾向。</p>
          ${ranking.map((name) => {
            const percentage = totalScore ? Math.round(((state.scores[name] || 0) / totalScore) * 100) : 0;
            return `<div class="rank-row"><span>${escapeHtml(name)}</span><span class="bar"><i style="width:${percentage}%"></i></span><b>${percentage}%</b></div>`;
          }).join("")}
        </div>
        <div class="actions"><button class="primary-button" data-action="share">复制分享链接</button><button class="secondary-button" data-action="restart">再测一次</button></div>
        <p class="hint" id="share-message">把这个网页部署后，复制的链接就可以发给朋友。</p>
      </section>`;
  }

  function render() {
    if (state.screen === "home") renderHome();
    else if (state.screen === "quiz") renderQuiz();
    else renderResult();
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

