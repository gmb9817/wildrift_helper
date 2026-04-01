(function () {
if (!window.WildriftData) {
  throw new Error("WildriftData failed to load. Check data.js script order.");
}

const {
  champions,
  championMap,
  itemMap,
  laneLabels,
  recommendationRules,
  getLoadoutForChampion,
} = window.WildriftData;

const lanes = ["Baron", "Jungle", "Mid", "Dragon", "Support"];

function createEmptyAllySlots() {
  return lanes.map((lane) => ({ lane, champion: null, items: [] }));
}

function createEmptyEnemySlots() {
  return Array.from({ length: 5 }, () => ({ champion: null, items: [] }));
}

const state = {
  activeTeam: "ally",
  activeIndex: 0,
  pickerLane: "all",
  search: "",
  allySlots: createEmptyAllySlots(),
  enemySlots: createEmptyEnemySlots(),
  countdown: null,
  countdownLeft: 0,
  focusChampionName: "",
  profileChampionName: "",
};

const STORAGE_KEY = "wildrift-desk-game-assistant";

const allyBoardEl = document.getElementById("ally-board");
const enemyBoardEl = document.getElementById("enemy-board");
const pickerGridEl = document.getElementById("draft-picker-grid");
const pickerContextEl = document.getElementById("picker-context");
const draftInsightsEl = document.getElementById("draft-insights");
const draftRecommendationsEl = document.getElementById("draft-recommendations");
const draftStatusGridEl = document.getElementById("draft-status-grid");
const draftPriorityStripEl = document.getElementById("draft-priority-strip");
const draftReadyBannerEl = document.getElementById("draft-ready-banner");
const manualLiveEnterEl = document.getElementById("manual-live-enter");
const liveStageEl = document.getElementById("live-stage");
const allyLiveGridEl = document.getElementById("ally-live-grid");
const enemyLiveGridEl = document.getElementById("enemy-live-grid");
const nextItemListEl = document.getElementById("next-item-list");
const dangerListEl = document.getElementById("danger-list");
const advantageListEl = document.getElementById("advantage-list");
const counterBuildListEl = document.getElementById("counter-build-list");
const focusChampionSelectEl = document.getElementById("focus-champion-select");
const focusProfileEl = document.getElementById("focus-profile");
const liveOverviewEl = document.getElementById("live-overview");

document.getElementById("draft-search").addEventListener("input", (event) => {
  state.search = event.target.value.trim().toLowerCase();
  renderDraftPicker();
});

document.getElementById("clear-current-slot").addEventListener("click", () => {
  setCurrentSlotChampion(null);
  renderAll();
});

document.querySelectorAll("[data-clear]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.clear === "ally") {
      state.allySlots = createEmptyAllySlots();
    } else {
      state.enemySlots = createEmptyEnemySlots();
    }
    stopCountdown();
    renderAll();
  });
});

focusChampionSelectEl.addEventListener("change", (event) => {
  state.focusChampionName = event.target.value;
  state.profileChampionName = event.target.value;
  renderLiveGuide();
});

manualLiveEnterEl.addEventListener("click", () => {
  stopCountdown();
  liveStageEl.classList.remove("hidden");
  draftReadyBannerEl.classList.add("hidden");
  manualLiveEnterEl.classList.add("hidden");
  liveStageEl.scrollIntoView({ behavior: "smooth", block: "start" });
});

renderLaneFilters();
loadState();
syncLaneChipState();
renderAll();

function renderAll() {
  renderDraftBoards();
  renderDraftPicker();
  renderDraftInsights();
  renderDraftRecommendations();
  renderDraftStatus();
  renderDraftPriorityStrip();
  syncCountdown();
  renderLiveBoards();
  renderFocusChampionSelect();
  renderLiveGuide();
  saveState();
}

function renderLaneFilters() {
  const container = document.getElementById("draft-lane-filters");
  const chipItems = [{ id: "all", label: "전체" }, ...lanes.map((lane) => ({ id: lane, label: laneLabels[lane] }))];
  chipItems.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `lane-chip${index === 0 ? " active" : ""}`;
    button.textContent = item.label;
    button.addEventListener("click", () => {
      container.querySelectorAll(".lane-chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
      state.pickerLane = item.id;
      saveState();
      renderDraftPicker();
    });
    container.appendChild(button);
  });
}

function syncLaneChipState() {
  document.querySelectorAll("#draft-lane-filters .lane-chip").forEach((chip, index) => {
    const chipValue = index === 0 ? "all" : lanes[index - 1];
    chip.classList.toggle("active", chipValue === state.pickerLane);
  });
}

function renderDraftBoards() {
  renderAllyBoard();
  renderEnemyBoard();
  pickerContextEl.textContent = state.activeTeam === "ally"
    ? `우리 팀 ${state.activeIndex + 1}번 슬롯을 편집 중입니다. 라인은 해당 슬롯에서 직접 지정합니다.`
    : `상대 팀 ${state.activeIndex + 1}번 슬롯을 편집 중입니다. 상대는 챔피언만 입력합니다.`;
}

function renderAllyBoard() {
  allyBoardEl.innerHTML = "";
  state.allySlots.forEach((slot, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "ally-slot";

    const laneSelect = document.createElement("select");
    laneSelect.className = "lane-select";
    lanes.forEach((lane) => {
      const option = document.createElement("option");
      option.value = lane;
      option.textContent = laneLabels[lane];
      option.selected = slot.lane === lane;
      laneSelect.appendChild(option);
    });
    laneSelect.addEventListener("change", (event) => {
      state.allySlots[index].lane = event.target.value;
      renderAll();
    });

    const button = document.createElement("button");
    button.type = "button";
    button.className = `slot-button${state.activeTeam === "ally" && state.activeIndex === index ? " active" : ""}`;
    button.innerHTML = buildSlotButton(slot.champion, slot.lane, "우리 팀");
    button.addEventListener("click", () => {
      state.activeTeam = "ally";
      state.activeIndex = index;
      renderDraftBoards();
      renderDraftPicker();
    });

    wrapper.append(laneSelect, button);
    allyBoardEl.appendChild(wrapper);
  });
}

function renderEnemyBoard() {
  enemyBoardEl.innerHTML = "";
  state.enemySlots.forEach((slot, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `slot-button${state.activeTeam === "enemy" && state.activeIndex === index ? " active" : ""}`;
    button.innerHTML = buildSlotButton(slot.champion, null, "상대 팀");
    button.addEventListener("click", () => {
      state.activeTeam = "enemy";
      state.activeIndex = index;
      renderDraftBoards();
      renderDraftPicker();
    });
    enemyBoardEl.appendChild(button);
  });
}

function buildSlotButton(champion, lane, fallbackLabel) {
  return `
    <img class="slot-avatar" src="${champion ? champion.image : placeholderSvg(fallbackLabel)}" alt="${champion ? champion.displayName : ""}">
    <div>
      <span class="slot-title">${champion ? champion.displayName : "챔피언 선택"}</span>
      <span class="slot-subtitle">${champion ? [lane ? laneLabels[lane] : null, champion.profileLabel].filter(Boolean).join(" / ") : fallbackLabel}</span>
    </div>
  `;
}

function renderDraftPicker() {
  const selected = new Set([
    ...state.allySlots.map((slot) => slot.champion?.displayName).filter(Boolean),
    ...state.enemySlots.map((slot) => slot.champion?.displayName).filter(Boolean),
  ]);
  const current = getCurrentSlot().champion?.displayName;
  const filtered = champions.filter((champion) => {
    const laneMatch = state.pickerLane === "all" || champion.lanes.includes(state.pickerLane);
    const searchMatch = matchesChampionSearch(champion, state.search);
    const available = !selected.has(champion.displayName) || current === champion.displayName;
    return laneMatch && searchMatch && available;
  });

  pickerGridEl.innerHTML = filtered.length ? filtered.map((champion) => `
    <button type="button" class="champion-tile" data-champion="${escapeAttr(champion.displayName)}">
      <img class="tile-avatar" src="${champion.image}" alt="${champion.displayName}">
      <div class="tile-copy">
        <strong>${champion.displayName}</strong>
        <div class="pill-row">
          <span class="meta-pill">${laneLabels[champion.lanes[0]]}</span>
          <span class="meta-pill">${champion.profileLabel}</span>
        </div>
      </div>
    </button>
  `).join("") : `
    <article class="empty-state">
      <strong>표시할 챔피언이 없습니다.</strong>
      <p>검색어를 줄이거나 라인 필터를 바꿔 보세요.</p>
    </article>
  `;

  pickerGridEl.querySelectorAll("[data-champion]").forEach((button) => {
    button.addEventListener("click", () => {
      setCurrentSlotChampion(championMap[button.dataset.champion]);
      renderAll();
    });
  });
}

function setCurrentSlotChampion(champion) {
  if (state.activeTeam === "ally") {
    state.allySlots[state.activeIndex].champion = champion;
  } else {
    state.enemySlots[state.activeIndex].champion = champion;
  }
}

function renderDraftInsights() {
  const allies = state.allySlots.map((slot) => slot.champion).filter(Boolean);
  const enemies = state.enemySlots.map((slot) => slot.champion).filter(Boolean);
  const allyStats = summarizeTeam(allies);
  const enemyStats = summarizeTeam(enemies);
  const targetLane = getTargetRecommendationLane();
  const insights = [
    ["우리 팀 상태", describeAllyDraftState(allies.length, allyStats)],
    ["상대 조합 해석", describeEnemyDraftState(enemies.length, enemyStats)],
    ["지금 픽 우선순위", describeDraftPriority(allyStats, enemyStats, targetLane)],
    ["데미지 밸런스", describeDamageBalance(allyStats)],
  ];

  draftInsightsEl.innerHTML = insights.map(([title, body]) => `<article class="stack-row"><strong>${title}</strong><p>${body}</p></article>`).join("");
}

function renderDraftStatus() {
  const allyCount = state.allySlots.filter((slot) => slot.champion).length;
  const enemyCount = state.enemySlots.filter((slot) => slot.champion).length;
  const activeLane = state.activeTeam === "ally" ? laneLabels[state.allySlots[state.activeIndex].lane] : "상대 슬롯";
  const targetLane = getTargetRecommendationLane();
  const allyStats = summarizeTeam(state.allySlots.map((slot) => slot.champion).filter(Boolean));
  const enemyStats = summarizeTeam(state.enemySlots.map((slot) => slot.champion).filter(Boolean));
  draftStatusGridEl.innerHTML = `
    <article class="stack-row">
      <strong>픽 진행도</strong>
      <p>우리 팀 ${allyCount}/5, 상대 팀 ${enemyCount}/5 입력됨</p>
    </article>
    <article class="stack-row">
      <strong>현재 편집 위치</strong>
      <p>${state.activeTeam === "ally" ? `우리 팀 ${state.activeIndex + 1}번 / ${activeLane}` : `상대 팀 ${state.activeIndex + 1}번`}</p>
    </article>
    <article class="stack-row">
      <strong>추천 기준 라인</strong>
      <p>${targetLane ? `${laneLabels[targetLane]} 기준으로 추천을 강화하고 있습니다.` : "비어 있는 우리 팀 슬롯 기준으로 추천합니다."}</p>
    </article>
    <article class="stack-row">
      <strong>현재 조합 템포</strong>
      <p>우리 팀은 ${describeCompStyle(allyStats, allyCount)} 상대는 ${describeCompStyle(enemyStats, enemyCount)}</p>
    </article>
  `;
}

function renderDraftPriorityStrip() {
  const allyStats = summarizeTeam(state.allySlots.map((slot) => slot.champion).filter(Boolean));
  const enemyStats = summarizeTeam(state.enemySlots.map((slot) => slot.champion).filter(Boolean));
  const targetLane = getTargetRecommendationLane();
  const chips = [];

  if (targetLane) chips.push({ tone: "neutral", text: `현재 우선 라인: ${laneLabels[targetLane]}` });
  if (allyStats.frontline === 0) chips.push({ tone: "danger", text: "앞라인 필요" });
  if (allyStats.engage === 0) chips.push({ tone: "danger", text: "이니시 보강 필요" });
  if (allyStats.peel === 0 && allyStats.scaling > 0) chips.push({ tone: "neutral", text: "후반 캐리 보호 필요" });
  if (!allyStats.hasMagic) chips.push({ tone: "neutral", text: "AP 소스 부족" });
  if (!allyStats.hasPhysical) chips.push({ tone: "neutral", text: "AD 소스 부족" });
  if (enemyStats.poke >= 2) chips.push({ tone: "info", text: "상대 포킹 강함" });
  if (enemyStats.engage >= 2) chips.push({ tone: "info", text: "상대 강제 이니시 주의" });
  if (enemyStats.frontline >= 2) chips.push({ tone: "info", text: "상대 전열 두꺼움" });
  if (enemyStats.scaling >= 2) chips.push({ tone: "info", text: "상대 후반 가치 높음" });

  draftPriorityStripEl.innerHTML = chips.length
    ? chips.map((chip) => `<span class="priority-chip ${chip.tone}">${chip.text}</span>`).join("")
    : `<span class="priority-chip neutral">픽이 채워지면 조합 우선순위를 여기서 바로 읽어 줍니다.</span>`;
}

function renderDraftRecommendations() {
  const recommendations = getDraftRecommendations();
  const canApplyRecommendation = state.activeTeam === "ally";
  draftRecommendationsEl.innerHTML = recommendations.length ? recommendations.map((entry) => `
    <button type="button" class="recommend-card" data-recommend-pick="${escapeAttr(entry.champion.displayName)}" ${canApplyRecommendation ? "" : "disabled"}>
      <img class="recommend-image" src="${entry.champion.image}" alt="${entry.champion.displayName}">
      <div class="recommend-copy">
        <div class="recommend-head">
          <div>
            <strong>${entry.champion.displayName}</strong>
            <span class="champion-meta-line">${entry.champion.profileLabel}</span>
          </div>
          <span class="score-badge">${entry.score}</span>
        </div>
        <div class="pill-row">${entry.reasons.map((reason) => `<span class="meta-pill">${reason}</span>`).join("")}</div>
        <div class="pill-row">
          <span class="meta-pill">기준 라인: ${laneLabels[entry.lane]}</span>
          <span class="meta-pill">코어: ${entry.champion.coreItems.slice(0, 2).join(" / ")}</span>
          <span class="meta-pill">전성기: ${summarizePowerSpike(entry.champion.powerSpike)}</span>
        </div>
        <div class="stack-row">
          <strong>지금 좋은 이유</strong>
          <p>${entry.pitch}</p>
        </div>
        <div class="stack-row">
          <strong>운영 핵심</strong>
          <p>${entry.plan}</p>
        </div>
        <div class="stack-row">
          <strong>권장 룬 / 스펠</strong>
          <p>${entry.runes.join(" · ")}</p>
          <p>${entry.spells.join(" + ")}</p>
        </div>
        ${canApplyRecommendation ? `<span class="meta-pill">클릭해서 현재 우리 팀 슬롯에 적용</span>` : `<span class="meta-pill">적 팀 슬롯 편집 중일 때는 추천을 바로 적용하지 않습니다.</span>`}
      </div>
    </button>
  `).join("") : `
    <article class="empty-state">
      <strong>추천 완료</strong>
      <p>현재 기준으로 남은 추천 후보가 없습니다. 이미 전원이 선택되었거나, 현재 슬롯이 채워져 있습니다.</p>
    </article>
  `;

  if (!canApplyRecommendation) return;

  draftRecommendationsEl.querySelectorAll("[data-recommend-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      setCurrentSlotChampion(championMap[button.dataset.recommendPick]);
      renderAll();
    });
  });
}

function getDraftRecommendations() {
  const allies = state.allySlots.map((slot) => slot.champion).filter(Boolean);
  const enemies = state.enemySlots.map((slot) => slot.champion).filter(Boolean);
  const selected = new Set([...allies, ...enemies].map((champion) => champion.displayName));
  const allyStats = summarizeTeam(allies);
  const enemyStats = summarizeTeam(enemies);
  const targetLane = getTargetRecommendationLane();

  return champions
    .filter((champion) => !selected.has(champion.displayName))
    .filter((champion) => !targetLane || champion.lanes.includes(targetLane))
    .map((champion) => {
      const loadoutLane = targetLane || champion.lanes[0];
      const loadout = getLoadoutForChampion(champion, loadoutLane);
      let score = 50;
      const reasons = [];

      recommendationRules.forEach((rule) => {
        if (champion.tags.includes(rule.candidate) && enemyStats.tagCounts[rule.enemy] > 0) {
          score += rule.score;
          reasons.push(rule.text);
        }
      });
      if (targetLane) { score += 12; reasons.push(`${laneLabels[targetLane]} 기준 픽`); }
      if (allyStats.frontline === 0 && champion.tags.includes("frontline")) { score += 14; reasons.push("앞라인 보강"); }
      if (allyStats.engage === 0 && champion.tags.includes("engage")) { score += 12; reasons.push("이니시 보강"); }
      if (allyStats.peel === 0 && champion.tags.includes("peel")) { score += 10; reasons.push("캐리 보호 가능"); }
      if (!allyStats.hasMagic && champion.damageType !== "AD") { score += 8; reasons.push("AP 밸런스 보완"); }
      if (!allyStats.hasPhysical && champion.damageType !== "AP") { score += 6; reasons.push("AD 밸런스 보완"); }
      if (enemyStats.frontline >= 2 && (champion.tags.includes("antiTank") || champion.tags.includes("dps"))) { score += 10; reasons.push("전열 압박 가능"); }
      if (enemyStats.poke >= 2 && (champion.tags.includes("engage") || champion.tags.includes("sustain"))) { score += 8; reasons.push("포킹 조합 대응"); }
      if (enemyStats.engage >= 2 && (champion.tags.includes("peel") || champion.tags.includes("frontline"))) { score += 9; reasons.push("돌진 상대로 안정적"); }
      if (enemyStats.scaling >= 2 && (champion.tags.includes("burst") || champion.tags.includes("pick") || champion.tags.includes("laneBully"))) { score += 7; reasons.push("성장 조합 압박"); }
      if ((enemyStats.tagCounts.mobility || 0) >= 2 && champion.tags.includes("antiDash")) { score += 10; reasons.push("대시 제어 가능"); }
      if (allyStats.frontline > 0 && champion.tags.includes("scaling")) { score += 4; reasons.push("후반 캐리 각"); }
      if (allyStats.engage > 0 && champion.tags.includes("burst")) { score += 5; reasons.push("후속 폭딜 연계"); }
      if (!reasons.length) reasons.push("범용성 높은 픽");

      return {
        champion,
        lane: loadoutLane,
        score,
        reasons: uniqueTake(reasons, 4),
        pitch: explainDraftPick(champion, allyStats, enemyStats, targetLane),
        plan: `${laneLabels[loadoutLane]} 기준으로 ${champion.winCondition} ${champion.allySynergy}`,
        runes: loadout.runes,
        spells: loadout.spells,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function describeAllyDraftState(allyCount, allyStats) {
  if (!allyCount) return "아직 우리 팀 구성이 비어 있어, 라인 소화와 범용성이 좋은 픽을 먼저 보는 편이 안전합니다.";
  if (allyStats.frontline === 0) return "앞라인이 없어 정면 전투를 오래 끌기 어렵습니다. 받아줄 전열이나 진입 억제 수단이 먼저 필요합니다.";
  if (allyStats.engage === 0) return "교전 개시 수단이 약해 상대가 먼저 각을 잡기 쉽습니다. 이니시나 픽 메이킹을 보강해야 합니다.";
  if (allyStats.peel === 0 && allyStats.scaling > 0) return "후반 캐리 축은 보이지만 보호 수단이 부족합니다. 서포트형 전열이나 보호형 픽이 잘 맞습니다.";
  return "기본 축은 갖춰졌습니다. 남은 픽은 상성 대응과 데미지 밸런스 보완에 써도 됩니다.";
}

function describeEnemyDraftState(enemyCount, enemyStats) {
  if (!enemyCount) return "상대 정보가 거의 없어 범용성이 높은 대응과 라인 안정성이 우선입니다.";
  if (enemyStats.engage >= 2 || enemyStats.burst >= 2) return "빠르게 들어와 한 번에 전투를 여는 조합입니다. 첫 진입을 버티거나 받아칠 수단이 중요합니다.";
  if (enemyStats.poke >= 2) return "오브젝트 전 체력을 빼는 포킹 대치전이 강합니다. 강제 진입이나 회복 수단이 유효합니다.";
  if (enemyStats.scaling >= 2) return "시간을 벌수록 강해지는 성장 축이 보입니다. 중반 픽 메이킹이나 스노우볼 압박이 좋습니다.";
  return "조합 방향은 아직 중립적이지만, 핵심 딜러를 지켜 주는 전열이 점점 갖춰지는 중입니다.";
}

function describeDraftPriority(allyStats, enemyStats, targetLane) {
  const laneText = targetLane ? `${laneLabels[targetLane]} 기준으로` : "빈 슬롯 기준으로";
  if (enemyStats.frontline >= 2) return `${laneText} 탱커 대응력이나 지속 화력이 좋은 픽을 우선하는 편이 좋습니다.`;
  if (enemyStats.poke >= 2) return `${laneText} 먼저 들어갈 수 있거나 포킹을 복구할 수 있는 픽이 효율적입니다.`;
  if (enemyStats.engage >= 2) return `${laneText} 보호, 역이니시, 받아치기 도구가 있는 픽이 안정적입니다.`;
  if (allyStats.frontline === 0 || allyStats.engage === 0) return `${laneText} 우리 조합의 비는 축을 먼저 메우는 것이 픽 기대값이 높습니다.`;
  return `${laneText} 상대 핵심 딜러를 압박할 수 있는 상성 픽을 보는 구간입니다.`;
}

function describeDamageBalance(stats) {
  if (!stats.hasMagic && !stats.hasPhysical) return "아직 아군 데미지 타입 정보가 충분하지 않습니다.";
  if (!stats.hasMagic) return "현재 우리 팀은 AD 비중이 높습니다. AP 소스를 한 장 넣으면 아이템 대응을 강요하기 좋습니다.";
  if (!stats.hasPhysical) return "현재 우리 팀은 AP 비중이 높습니다. 지속 물리 딜러가 있으면 조합이 더 깔끔해집니다.";
  return "AD/AP 축은 크게 무너지지 않았습니다. 이제는 역할 중복과 상성 대응을 더 중시해도 됩니다.";
}

function describeCompStyle(stats, count) {
  if (!count) return "아직 방향이 안 보입니다.";
  if (stats.engage >= 2 && stats.frontline >= 2) return "정면 이니시 중심 조합입니다.";
  if (stats.poke >= 2) return "대치전과 체력 우위 설계형입니다.";
  if (stats.scaling >= 2) return "후반 성장 중심 조합입니다.";
  if (stats.burst >= 2 || stats.pick >= 2) return "픽 메이킹과 순간 폭딜 비중이 높습니다.";
  return "균형형 조합에 가깝습니다.";
}

function explainDraftPick(champion, allyStats, enemyStats, targetLane) {
  const parts = [];
  if (targetLane && champion.lanes.includes(targetLane)) parts.push(`${laneLabels[targetLane]} 라인을 무리 없이 소화할 수 있습니다.`);
  if (allyStats.frontline === 0 && champion.tags.includes("frontline")) parts.push("우리 팀에 부족한 전열을 바로 채워 줄 수 있습니다.");
  if (allyStats.peel === 0 && champion.tags.includes("peel")) parts.push("아군 캐리 보호 축을 보강할 수 있습니다.");
  if (enemyStats.frontline >= 2 && champion.tags.includes("antiTank")) parts.push("상대 전열이 두꺼워도 딜 효율을 유지하기 좋습니다.");
  if (enemyStats.poke >= 2 && champion.tags.includes("engage")) parts.push("포킹 대치전을 오래 끌지 않고 전투를 강제로 열 수 있습니다.");
  if (enemyStats.engage >= 2 && champion.tags.includes("peel")) parts.push("상대 첫 진입을 끊고 받아치기 좋은 챔피언입니다.");
  if ((enemyStats.tagCounts.mobility || 0) >= 2 && champion.tags.includes("antiDash")) parts.push("기동성 높은 적의 각을 좁히는 데 특히 유효합니다.");
  if (!parts.length) parts.push(`${champion.draftValue} 현재 조합에서 역할 중복이 심하지 않습니다.`);
  return parts.join(" ");
}

function syncCountdown() {
  const ready = state.allySlots.every((slot) => slot.champion) && state.enemySlots.every((slot) => slot.champion);
  if (!ready) {
    stopCountdown();
    draftReadyBannerEl.classList.add("hidden");
    manualLiveEnterEl.classList.add("hidden");
    liveStageEl.classList.add("hidden");
    return;
  }
  if (!liveStageEl.classList.contains("hidden")) return;
  if (state.countdown) return;
  state.countdownLeft = 5;
  draftReadyBannerEl.classList.remove("hidden");
  manualLiveEnterEl.classList.remove("hidden");
  draftReadyBannerEl.textContent = `전원 선택 완료. ${state.countdownLeft}초 뒤 인게임 도우미로 전환합니다.`;
  state.countdown = window.setInterval(() => {
    state.countdownLeft -= 1;
    if (state.countdownLeft <= 0) {
      stopCountdown();
      liveStageEl.classList.remove("hidden");
      liveStageEl.scrollIntoView({ behavior: "smooth", block: "start" });
      draftReadyBannerEl.classList.add("hidden");
      manualLiveEnterEl.classList.add("hidden");
      if (!state.profileChampionName) state.profileChampionName = state.focusChampionName;
      return;
    }
    draftReadyBannerEl.textContent = `전원 선택 완료. ${state.countdownLeft}초 뒤 인게임 도우미로 전환합니다.`;
  }, 1000);
}

function stopCountdown() {
  if (state.countdown) {
    window.clearInterval(state.countdown);
    state.countdown = null;
  }
}

function renderLiveBoards() {
  renderLiveTeamGrid(state.allySlots, allyLiveGridEl, true);
  renderLiveTeamGrid(state.enemySlots, enemyLiveGridEl, false);
}

function renderLiveTeamGrid(slots, container, isAlly) {
  container.innerHTML = "";
  slots.forEach((slot, index) => {
    const champion = slot.champion;
    if (!champion) return;
    const wrapper = document.createElement("article");
    wrapper.className = "live-card";
    wrapper.innerHTML = `
      <button type="button" class="slot-button" data-focus="${escapeAttr(champion.displayName)}">
        <img class="slot-avatar" src="${champion.image}" alt="${champion.displayName}">
        <div>
          <span class="slot-title">${champion.displayName}</span>
          <span class="slot-subtitle">${isAlly ? laneLabels[state.allySlots[index].lane] : "상대 픽"} / ${champion.profileLabel}</span>
        </div>
      </button>
      <div class="item-chip-row" id="${isAlly ? "ally" : "enemy"}-items-${index}"></div>
      <label class="field-block">
        <span>아이템 추가</span>
        <select id="${isAlly ? "ally" : "enemy"}-select-${index}"></select>
      </label>
      <button type="button" class="ghost-button" id="${isAlly ? "ally" : "enemy"}-add-${index}">아이템 추가</button>
    `;
    container.appendChild(wrapper);

    const chips = wrapper.querySelector(`#${isAlly ? "ally" : "enemy"}-items-${index}`);
    chips.innerHTML = slot.items.length
      ? slot.items.map((itemName, itemIndex) => `<button type="button" class="item-chip" data-remove="${isAlly ? "ally" : "enemy"}-${index}-${itemIndex}">${itemName}</button>`).join("")
      : `<span class="meta-pill">아이템 미입력</span>`;

    wrapper.querySelectorAll("[data-remove]").forEach((chip) => {
      chip.addEventListener("click", () => {
        slot.items.splice(Number(chip.dataset.remove.split("-")[2]), 1);
        renderAll();
      });
    });

    const select = wrapper.querySelector(`#${isAlly ? "ally" : "enemy"}-select-${index}`);
    select.innerHTML = `<option value="">선택하세요</option>${Object.keys(itemMap).sort().map((name) => `<option value="${name}">${name}</option>`).join("")}`;
    wrapper.querySelector(`#${isAlly ? "ally" : "enemy"}-add-${index}`).addEventListener("click", () => {
      if (select.value && !slot.items.includes(select.value) && slot.items.length < 6) {
        slot.items.push(select.value);
        renderAll();
      }
    });

    wrapper.querySelector("[data-focus]").addEventListener("click", () => {
      if (isAlly) state.focusChampionName = champion.displayName;
      state.profileChampionName = champion.displayName;
      renderFocusChampionSelect();
      renderLiveGuide();
    });
  });
}

function renderFocusChampionSelect() {
  const allyChampions = state.allySlots.map((slot) => slot.champion).filter(Boolean);
  if (!state.focusChampionName && allyChampions[0]) state.focusChampionName = allyChampions[0].displayName;
  if (!state.profileChampionName && allyChampions[0]) state.profileChampionName = allyChampions[0].displayName;
  focusChampionSelectEl.innerHTML = allyChampions.map((champion) => `<option value="${champion.displayName}">${champion.displayName}</option>`).join("");
  if (state.focusChampionName) focusChampionSelectEl.value = state.focusChampionName;
}

function renderLiveGuide() {
  const focus = championMap[state.focusChampionName];
  const profileChampion = championMap[state.profileChampionName] || focus;
  if (!focus) {
    liveOverviewEl.innerHTML = "";
    nextItemListEl.innerHTML = "";
    dangerListEl.innerHTML = "";
    advantageListEl.innerHTML = "";
    counterBuildListEl.innerHTML = "";
    focusProfileEl.innerHTML = "";
    return;
  }

  const nextItems = getNextItemsFor(focus);
  renderLiveOverview(focus);
  nextItemListEl.innerHTML = nextItems.length
    ? nextItems.map((item) => `
      <article class="stack-row action-card">
        <strong>${item.displayName}</strong>
        <p>${item.why}</p>
        <button type="button" class="ghost-button inline-action" data-add-focus-item="${escapeAttr(item.displayName)}">현재 챔피언에 추가</button>
      </article>
    `).join("")
    : `<article class="stack-row"><strong>기본 빌드 점검</strong><p>핵심 코어가 거의 갖춰졌습니다. 이제는 상대 아이템과 바론/장로 타이밍을 기준으로 방어형 분기를 보세요.</p></article>`;

  const enemySlots = state.enemySlots.filter((slot) => slot.champion);
  const threats = getThreatList(focus, enemySlots, false);
  const advantages = getThreatList(focus, enemySlots, true);
  dangerListEl.innerHTML = threats.length
    ? threats.map((entry) => `<article class="stack-row"><strong>${entry.name}</strong><p>${entry.reason}</p></article>`).join("")
    : `<article class="stack-row"><strong>상대 정보 부족</strong><p>상대 챔피언이 더 입력되면 위험 포인트를 더 구체적으로 읽어 줄 수 있습니다.</p></article>`;
  advantageListEl.innerHTML = advantages.length
    ? advantages.map((entry) => `<article class="stack-row"><strong>${entry.name}</strong><p>${entry.reason}</p></article>`).join("")
    : `<article class="stack-row"><strong>압박 타이밍 대기</strong><p>지금은 뚜렷한 상성 우위를 단정하기 어렵습니다. 아이템과 시야 정보가 더 쌓이면 판단이 더 정확해집니다.</p></article>`;
  counterBuildListEl.innerHTML = buildCounterChecklist(focus, enemySlots)
    .map((entry) => `<article class="stack-row"><strong>${entry.title}</strong><p>${entry.body}</p></article>`)
    .join("");
  focusProfileEl.innerHTML = buildProfileMarkup(profileChampion);

  nextItemListEl.querySelectorAll("[data-add-focus-item]").forEach((button) => {
    button.addEventListener("click", () => {
      addItemToFocusChampion(button.dataset.addFocusItem);
    });
  });
}

function getNextItemsFor(focus) {
  const slot = state.allySlots.find((entry) => entry.champion?.displayName === focus.displayName);
  const owned = new Set(slot?.items || []);
  const enemySlots = state.enemySlots.filter((entry) => entry.champion);
  const enemyStats = summarizeTeam(enemySlots.map((entry) => entry.champion));
  const enemySignals = collectItemSignals(enemySlots);
  const suggestions = [];

  const pushItem = (name, why) => {
    if (!name || owned.has(name) || !itemMap[name] || suggestions.find((entry) => entry.displayName === name)) return;
    suggestions.push({ displayName: name, summary: itemMap[name].summary, why });
  };

  if (enemyStats.sustain >= 2 || enemySignals.antiHealTarget) {
    pushItem(getAntiHealItem(focus), "상대 회복 비중이 높아 치감 타이밍이 빨라질수록 교전 기대값이 좋아집니다.");
  }

  if (enemyStats.frontline >= 2) {
    pushItem(getAntiTankItem(focus), "상대 전열이 두꺼워 정면 전투가 길어질 가능성이 높습니다. 전열 대응 옵션을 빨리 준비하는 편이 좋습니다.");
  }

  if (enemyStats.burst >= 2 || enemyStats.engage >= 2) {
    pushItem(getDefensiveResponseItem(focus, enemyStats), "상대가 먼저 물었을 때 한 번 버틸 수단이 있어야 포지션을 유지하며 딜을 이어 갈 수 있습니다.");
  }

  if ((enemyStats.tagCounts.cc || 0) >= 2 || enemySignals.cleanseNeed) {
    pushItem(getCleanseResponseItem(focus), "하드 CC 연계가 길어 보여, 핵심 순간을 버티는 해제 수단 가치가 높습니다.");
  }

  pushItem(getAdaptiveBoots(focus, enemyStats), "이번 판의 데미지 구성을 기준으로 신발 효율을 먼저 챙기면 한타 안정성이 좋아집니다.");

  [...focus.coreItems, ...focus.situationalItems, ...focus.enchants].forEach((name) => {
    pushItem(name, getDefaultItemReason(name, focus));
  });

  return suggestions.slice(0, 3);
}

function renderLiveOverview(focus) {
  const allyStats = summarizeTeam(state.allySlots.map((slot) => slot.champion).filter(Boolean));
  const enemySlots = state.enemySlots.filter((slot) => slot.champion);
  const enemyStats = summarizeTeam(enemySlots.map((slot) => slot.champion));
  const ownedCount = state.allySlots.find((slot) => slot.champion?.displayName === focus.displayName)?.items.length || 0;

  liveOverviewEl.innerHTML = `
    <article class="overview-card">
      <span class="panel-kicker">FOCUS</span>
      <strong>${focus.displayName}</strong>
      <p>${focus.profileLabel} / ${focus.damageType} / 현재 아이템 ${ownedCount}개</p>
    </article>
    <article class="overview-card">
      <span class="panel-kicker">ALLY PLAN</span>
      <strong>${describeCompStyle(allyStats, state.allySlots.filter((slot) => slot.champion).length)}</strong>
      <p>${focus.winCondition}</p>
    </article>
    <article class="overview-card">
      <span class="panel-kicker">ENEMY READ</span>
      <strong>${describeCompStyle(enemyStats, enemySlots.length)}</strong>
      <p>${describeEnemyDraftState(enemySlots.length, enemyStats)}</p>
    </article>
    <article class="overview-card">
      <span class="panel-kicker">POWER WINDOW</span>
      <strong>${summarizePowerSpike(focus.powerSpike)}</strong>
      <p>${focus.powerSpike}</p>
    </article>
  `;
}

function getThreatList(focus, enemySlots, favorable) {
  return enemySlots
    .map((slot) => ({ enemy: slot.champion, items: slot.items, score: matchupScore(focus, slot.champion, slot.items) }))
    .sort((a, b) => favorable ? b.score - a.score : a.score - b.score)
    .slice(0, 3)
    .map((entry) => ({
      name: entry.enemy.displayName,
      reason: favorable
        ? describeFavorableReason(focus, entry.enemy, entry.items)
        : describeThreatReason(focus, entry.enemy, entry.items),
    }));
}

function buildProfileMarkup(champion) {
  return `
    <div class="profile-header">
      <img src="${champion.image}" alt="${champion.displayName}">
      <div>
        <h2>${champion.displayName}</h2>
        <p class="subtle-copy">${champion.flavor}</p>
        <div class="pill-row">
          <span class="meta-pill">${champion.profileLabel}</span>
          <span class="meta-pill">${champion.lanes.map((lane) => laneLabels[lane]).join(" / ")}</span>
          <span class="meta-pill">${champion.damageType}</span>
        </div>
      </div>
    </div>
    <div class="profile-columns">
      <article class="profile-block">
        <h4>핵심 강점</h4>
        <ul>${champion.strengths.map((text) => `<li>${text}</li>`).join("")}</ul>
      </article>
      <article class="profile-block">
        <h4>핵심 약점</h4>
        <ul>${champion.weaknesses.map((text) => `<li>${text}</li>`).join("")}</ul>
      </article>
      <article class="profile-block">
        <h4>룬 / 스펠</h4>
        <p>${champion.runes.join(" · ")}</p>
        <p>${champion.spells.join(" + ")}</p>
      </article>
      <article class="profile-block">
        <h4>파워 스파이크</h4>
        <p>${champion.powerSpike}</p>
        <p>${champion.buildSummary}</p>
      </article>
      <article class="profile-block">
        <h4>승리 플랜</h4>
        <p>${champion.winCondition}</p>
        <p>${champion.objectivePlan}</p>
      </article>
      <article class="profile-block">
        <h4>운영 포인트</h4>
        <p>${champion.laneTip}</p>
        <p>${champion.teamfightTip}</p>
      </article>
      <article class="profile-block">
        <h4>초반 / 중반 / 후반 플랜</h4>
        <p>${champion.earlyGamePlan}</p>
        <p>${champion.midGamePlan}</p>
        <p>${champion.lateGamePlan}</p>
      </article>
      <article class="profile-block">
        <h4>시너지 / 주의 포인트</h4>
        <p>${champion.allySynergy}</p>
        <p>${champion.enemyWarning}</p>
      </article>
      <article class="profile-block">
        <h4>TMI</h4>
        <p>${champion.tmi}</p>
      </article>
    </div>
  `;
}

function buildCounterChecklist(focus, enemySlots) {
  const enemyStats = summarizeTeam(enemySlots.map((slot) => slot.champion));
  const signals = collectItemSignals(enemySlots);
  const items = [];

  if (enemyStats.frontline >= 2) {
    items.push({
      title: "전열 대응 우선",
      body: `${getAntiTankItem(focus) || "탱커 대응 아이템"} 쪽을 빨리 보면 정면 전투가 훨씬 편해집니다.`,
    });
  }
  if (enemyStats.sustain >= 2 || signals.antiHealTarget) {
    items.push({
      title: "치감 타이밍 체크",
      body: `${getAntiHealItem(focus) || "치감 아이템"} 가치가 높은 판입니다. 드래곤/바론 전부터 준비하는 편이 좋습니다.`,
    });
  }
  if (enemyStats.engage >= 2 || enemyStats.burst >= 2) {
    items.push({
      title: "생존 버튼 확보",
      body: `${getDefensiveResponseItem(focus, enemyStats) || "생존형 인챈트"}를 우선해 첫 진입을 버틸 수 있게 준비하세요.`,
    });
  }
  if ((enemyStats.tagCounts.cc || 0) >= 2 || signals.cleanseNeed) {
    items.push({
      title: "CC 대응 필요",
      body: `${getCleanseResponseItem(focus) || "CC 해제 수단"}이 있으면 한 번의 실수를 크게 줄일 수 있습니다.`,
    });
  }
  if (!items.length) {
    items.push({
      title: "기본 코어 유지",
      body: "상대 조합이 한쪽으로 크게 치우치지 않았습니다. 지금은 기본 코어 템포를 유지해도 됩니다.",
    });
  }
  return items.slice(0, 4);
}

function addItemToFocusChampion(itemName) {
  const slot = state.allySlots.find((entry) => entry.champion?.displayName === state.focusChampionName);
  if (!slot || !itemMap[itemName] || slot.items.includes(itemName) || slot.items.length >= 6) return;
  slot.items.push(itemName);
  renderAll();
}

function collectItemSignals(enemySlots) {
  const signals = { antiHealTarget: false, cleanseNeed: false };
  enemySlots.forEach((slot) => {
    slot.items.forEach((name) => {
      const item = itemMap[name];
      if (!item) return;
      if ((item.tags || []).includes("heal") || name === "Bloodthirster") signals.antiHealTarget = true;
      if ((item.tags || []).includes("spellShield")) signals.cleanseNeed = true;
    });
  });
  return signals;
}

function getAntiHealItem(focus) {
  if (focus.damageType === "AP") return itemMap["Morellonomicon"] ? "Morellonomicon" : null;
  return itemMap["Mortal Reminder"] ? "Mortal Reminder" : null;
}

function getAntiTankItem(focus) {
  if (focus.situationalItems.includes("Mortal Reminder")) return "Mortal Reminder";
  if (focus.situationalItems.includes("Black Cleaver")) return "Black Cleaver";
  if (focus.situationalItems.includes("Liandry's Torment")) return "Liandry's Torment";
  if (focus.coreItems.includes("Blade of the Ruined King")) return "Blade of the Ruined King";
  return focus.situationalItems.find((name) => itemMap[name]) || null;
}

function getDefensiveResponseItem(focus, enemyStats) {
  if (focus.roles.includes("Marksman") || focus.tags.includes("burst")) return itemMap.Stasis ? "Stasis" : null;
  if (enemyStats.hasMagic && itemMap["Maw of Malmortius"] && focus.damageType !== "AP") return "Maw of Malmortius";
  if (focus.roles.includes("Tank")) return focus.boots.includes("Mercury's Treads") ? "Mercury's Treads" : focus.boots[0];
  return focus.enchants.find((name) => name === "Stasis" || name === "Locket") || null;
}

function getCleanseResponseItem(focus) {
  if (focus.enchants.includes("Quicksilver")) return "Quicksilver";
  if (focus.boots.includes("Mercury's Treads")) return "Mercury's Treads";
  return null;
}

function getAdaptiveBoots(focus, enemyStats) {
  if (focus.boots.includes("Mercury's Treads") && ((enemyStats.tagCounts.cc || 0) >= 2 || enemyStats.hasMagic && enemyStats.burst >= 1)) return "Mercury's Treads";
  if (focus.boots.includes("Plated Steelcaps") && enemyStats.hasPhysical && !enemyStats.hasMagic) return "Plated Steelcaps";
  return focus.boots.find((name) => itemMap[name]) || null;
}

function getDefaultItemReason(name, focus) {
  if (focus.coreItems.includes(name)) return `기본 코어 흐름을 유지해 ${focus.profileLabel} 역할을 가장 안정적으로 수행할 수 있습니다.`;
  if (focus.enchants.includes(name)) return "이번 판 교전 구조를 기준으로 인챈트 가치가 높습니다.";
  const tags = itemMap[name]?.tags || [];
  if (tags.includes("antiTank")) return "상대 전열이 길게 버티는 판에서 효율이 좋습니다.";
  if (tags.includes("antiHeal")) return "회복량이 체감되는 구간을 빠르게 끊어 줄 수 있습니다.";
  if (tags.includes("survival")) return "상대 첫 진입을 버틴 뒤 다시 딜할 시간을 벌어 줍니다.";
  return `${focus.displayName}의 기본 빌드 흐름에서 자주 쓰이는 안정적인 선택지입니다.`;
}

function describeThreatReason(focus, enemy, enemyItems) {
  const itemNames = enemyItems.length ? ` 현재 ${enemyItems.slice(0, 2).join(" / ")}까지 보여 교전 기대값이 더 높습니다.` : "";
  if (enemy.tags.includes("engage") && !focus.tags.includes("peel") && !focus.tags.includes("frontline")) return `${enemy.displayName}는 먼저 들어와 교전을 강제하기 좋아, 포지션이 얕으면 바로 물릴 수 있습니다.${itemNames}`;
  if (enemy.tags.includes("burst") && (focus.roles.includes("Marksman") || focus.tags.includes("scaling"))) return `${enemy.displayName}는 짧은 폭딜로 성장형 딜러를 노리기 좋습니다. 생존기와 시야 관리가 특히 중요합니다.${itemNames}`;
  if (enemy.tags.includes("poke") && !focus.tags.includes("mobility")) return `${enemy.displayName}는 거리 차이를 이용해 전투 전에 체력을 깎기 좋습니다. 라인과 오브젝트 대치에서 사거리 관리가 필요합니다.${itemNames}`;
  if (enemy.tags.includes("frontline") && !focus.tags.includes("antiTank")) return `${enemy.displayName}가 앞라인을 맡으면 정면 전투가 길어집니다. 지금 빌드만으로는 전열 압박이 버거울 수 있습니다.${itemNames}`;
  return `${enemy.displayName}는 현재 교전 구도에서 먼저 스킬을 맞거나 시야를 내주면 위험도가 커지는 상대입니다.${itemNames}`;
}

function describeFavorableReason(focus, enemy, enemyItems) {
  const itemNames = enemyItems.length ? ` 다만 ${enemyItems.slice(0, 2).join(" / ")}를 이미 갖췄다면 지나친 과신은 금물입니다.` : "";
  if (focus.tags.includes("antiTank") && enemy.tags.includes("frontline")) return `${focus.displayName}는 ${enemy.displayName}처럼 오래 버티는 전열 상대로 딜 효율을 내기 좋습니다.${itemNames}`;
  if (focus.tags.includes("engage") && enemy.tags.includes("poke")) return `${enemy.displayName}가 대치전을 길게 끌고 싶어 하는 만큼, 타이밍만 맞으면 강제로 전투를 열기 좋습니다.${itemNames}`;
  if (focus.tags.includes("antiDash") && enemy.tags.includes("mobility")) return `${enemy.displayName}의 기동력을 제어할 수 있어 교전 각을 좁히기 좋습니다.${itemNames}`;
  if (focus.tags.includes("burst") && !enemy.tags.includes("frontline")) return `${enemy.displayName}는 순간적으로 비었을 때 빠르게 마무리하기 좋은 유형입니다.${itemNames}`;
  return `${enemy.displayName}는 현재 시점에서 거리 관리와 스킬 타이밍만 잘 잡으면 압박하기 쉬운 상대로 보입니다.${itemNames}`;
}

function summarizeTeam(team) {
  const summary = { frontline: 0, engage: 0, peel: 0, poke: 0, burst: 0, dps: 0, sustain: 0, scaling: 0, pick: 0, hasMagic: false, hasPhysical: false, tagCounts: {} };
  team.forEach((champion) => {
    champion.tags.forEach((tag) => { summary.tagCounts[tag] = (summary.tagCounts[tag] || 0) + 1; });
    ["frontline", "engage", "peel", "poke", "burst", "dps", "sustain", "scaling", "pick"].forEach((tag) => {
      if (champion.tags.includes(tag)) summary[tag] += 1;
    });
    if (champion.damageType !== "AD") summary.hasMagic = true;
    if (champion.damageType !== "AP") summary.hasPhysical = true;
  });
  return summary;
}

function matchupScore(a, b, enemyItems = []) {
  let score = 0;
  if (a.tags.includes("peel") && (b.tags.includes("engage") || b.tags.includes("burst"))) score += 10;
  if (a.tags.includes("antiTank") && b.tags.includes("frontline")) score += 10;
  if (a.tags.includes("engage") && b.tags.includes("poke")) score += 7;
  if (a.tags.includes("antiDash") && b.tags.includes("mobility")) score += 8;
  if (a.tags.includes("burst") && !b.tags.includes("frontline")) score += 4;
  if (b.tags.includes("engage") && !a.tags.includes("peel") && !a.tags.includes("frontline")) score -= 7;
  if (b.tags.includes("burst") && (a.roles.includes("Marksman") || a.tags.includes("scaling"))) score -= 6;
  if (b.tags.includes("poke") && !a.tags.includes("mobility")) score -= 8;
  if (b.tags.includes("frontline") && !a.tags.includes("antiTank")) score -= 6;
  if (enemyItems.includes("Guardian Angel")) score -= 2;
  return score;
}

function getCurrentSlot() {
  return state.activeTeam === "ally"
    ? state.allySlots[state.activeIndex] || state.allySlots[0]
    : state.enemySlots[state.activeIndex] || state.enemySlots[0];
}

function getTargetRecommendationLane() {
  if (state.activeTeam === "ally") return (state.allySlots[state.activeIndex] || state.allySlots[0]).lane;
  const emptySlot = state.allySlots.find((slot) => !slot.champion);
  return emptySlot ? emptySlot.lane : null;
}

function matchesChampionSearch(champion, query) {
  if (!query) return true;
  const normalized = query.toLowerCase();
  const compact = normalized.replace(/[^a-z0-9가-힣]/g, "");
  return champion.searchText.includes(normalized) || champion.searchText.includes(compact);
}

function summarizePowerSpike(text) {
  if (text.includes("2코어")) return "2코어 이후";
  if (text.includes("3코어")) return "3코어 전후";
  if (text.includes("궁극기")) return "궁극기 이후";
  if (text.includes("초반")) return "초반 주도권";
  return "첫 코어 전후";
}

function uniqueTake(items, limit) {
  return Array.from(new Set(items)).slice(0, limit);
}

function saveState() {
  if (!window.localStorage) return;
  const payload = {
    activeTeam: state.activeTeam,
    activeIndex: state.activeIndex,
    pickerLane: state.pickerLane,
    search: state.search,
    allySlots: state.allySlots.map((slot) => ({ lane: slot.lane, champion: slot.champion?.displayName || null, items: slot.items })),
    enemySlots: state.enemySlots.map((slot) => ({ champion: slot.champion?.displayName || null, items: slot.items })),
    focusChampionName: state.focusChampionName,
    profileChampionName: state.profileChampionName,
    liveVisible: !liveStageEl.classList.contains("hidden"),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadState() {
  if (!window.localStorage) return;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    state.activeTeam = parsed.activeTeam || "ally";
    state.activeIndex = Math.min(Math.max(Number(parsed.activeIndex) || 0, 0), 4);
    state.pickerLane = parsed.pickerLane || "all";
    state.search = parsed.search || "";
    const parsedAllySlots = Array.isArray(parsed.allySlots) ? parsed.allySlots : [];
    const parsedEnemySlots = Array.isArray(parsed.enemySlots) ? parsed.enemySlots : [];
    state.allySlots = createEmptyAllySlots().map((fallbackSlot, index) => {
      const slot = parsedAllySlots[index] || {};
      return {
        lane: lanes.includes(slot.lane) ? slot.lane : fallbackSlot.lane,
        champion: slot.champion ? championMap[slot.champion] || null : null,
        items: Array.isArray(slot.items) ? slot.items.filter((name) => itemMap[name]) : [],
      };
    });
    state.enemySlots = createEmptyEnemySlots().map((fallbackSlot, index) => {
      const slot = parsedEnemySlots[index] || {};
      return {
        champion: slot.champion ? championMap[slot.champion] || null : null,
        items: Array.isArray(slot.items) ? slot.items.filter((name) => itemMap[name]) : fallbackSlot.items,
      };
    });
    state.activeIndex = Math.min(state.activeIndex, 4);
    state.focusChampionName = parsed.focusChampionName || "";
    state.profileChampionName = parsed.profileChampionName || "";
    if (parsed.liveVisible) liveStageEl.classList.remove("hidden");
    document.getElementById("draft-search").value = state.search;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function placeholderSvg(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="#1b2735"/><text x="60" y="54" text-anchor="middle" font-size="18" fill="#f7f3eb" font-family="Segoe UI, sans-serif">${label}</text><text x="60" y="82" text-anchor="middle" font-size="12" fill="#9da8b7" font-family="Segoe UI, sans-serif">Pick</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeAttr(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}
})();
