if (!window.WildriftData) {
  throw new Error("WildriftData failed to load. Check data.js script order.");
}

const {
  champions,
  championMap,
  itemMap,
  laneLabels,
  recommendationRules,
} = window.WildriftData;

const lanes = ["Baron", "Jungle", "Mid", "Dragon", "Support"];

const state = {
  activeTeam: "ally",
  activeIndex: 0,
  pickerLane: "all",
  search: "",
  allySlots: lanes.map((lane) => ({ lane, champion: null, items: [] })),
  enemySlots: Array.from({ length: 5 }, () => ({ champion: null, items: [] })),
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
const draftReadyBannerEl = document.getElementById("draft-ready-banner");
const manualLiveEnterEl = document.getElementById("manual-live-enter");
const liveStageEl = document.getElementById("live-stage");
const allyLiveGridEl = document.getElementById("ally-live-grid");
const enemyLiveGridEl = document.getElementById("enemy-live-grid");
const nextItemListEl = document.getElementById("next-item-list");
const dangerListEl = document.getElementById("danger-list");
const advantageListEl = document.getElementById("advantage-list");
const focusChampionSelectEl = document.getElementById("focus-champion-select");
const focusProfileEl = document.getElementById("focus-profile");

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
      state.allySlots = lanes.map((lane) => ({ lane, champion: null, items: [] }));
    } else {
      state.enemySlots = Array.from({ length: 5 }, () => ({ champion: null, items: [] }));
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
    const searchMatch = champion.displayName.toLowerCase().includes(state.search);
    const available = !selected.has(champion.displayName) || current === champion.displayName;
    return laneMatch && searchMatch && available;
  });

  pickerGridEl.innerHTML = filtered.map((champion) => `
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
  `).join("");

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
  const insights = [];

  if (allyStats.frontline === 0) insights.push(["우리 팀 결핍", "앞라인이 비어 있어 먼저 받아낼 챔피언이 필요합니다."]);
  else insights.push(["우리 팀 결핍", "기본 전열은 갖춰졌고, 남은 픽은 상성 대응이나 화력 보완에 써도 됩니다."]);

  if (enemyStats.engage >= 2 || enemyStats.burst >= 2) insights.push(["상대 핵심 포인트", "상대는 빠르게 들어와 한 번에 전투를 여는 조합입니다."]);
  else if (enemyStats.poke >= 2) insights.push(["상대 핵심 포인트", "상대는 오브젝트 전 체력을 빼는 포킹 구도가 강합니다."]);
  else insights.push(["상대 핵심 포인트", "아직 상대 조합 정보가 적어 범용성이 높은 대응이 우선입니다."]);

  if (enemyStats.frontline >= 2) insights.push(["추천 방향", "다음 픽은 전열 압박이 가능하거나 지속 화력이 좋은 챔피언이 잘 맞습니다."]);
  else insights.push(["추천 방향", "이니시와 보호 중 비어 있는 축을 메우는 쪽이 픽 효율이 높습니다."]);

  draftInsightsEl.innerHTML = insights.map(([title, body]) => `<article class="stack-row"><strong>${title}</strong><p>${body}</p></article>`).join("");
}

function renderDraftStatus() {
  const allyCount = state.allySlots.filter((slot) => slot.champion).length;
  const enemyCount = state.enemySlots.filter((slot) => slot.champion).length;
  const activeLane = state.activeTeam === "ally" ? laneLabels[state.allySlots[state.activeIndex].lane] : "상대 슬롯";
  const targetLane = getTargetRecommendationLane();
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
  `;
}

function renderDraftRecommendations() {
  const recommendations = getDraftRecommendations();
  draftRecommendationsEl.innerHTML = recommendations.map((entry) => `
    <article class="recommend-card">
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
        <div class="stack-row">
          <strong>룬</strong>
          <p>${entry.champion.runes.join(" · ")}</p>
        </div>
        <div class="stack-row">
          <strong>스펠</strong>
          <p>${entry.champion.spells.join(" + ")}</p>
        </div>
      </div>
    </article>
  `).join("");
}

function getDraftRecommendations() {
  const allies = state.allySlots.map((slot) => slot.champion).filter(Boolean);
  const enemies = state.enemySlots.map((slot) => slot.champion).filter(Boolean);
  const selected = new Set([...allies, ...enemies].map((champion) => champion.displayName));
  const allyStats = summarizeTeam(allies);
  const enemyStats = summarizeTeam(enemies);
  const occupiedLanes = new Set(state.allySlots.filter((slot) => slot.champion).map((slot) => slot.lane));
  const missingLane = lanes.find((lane) => !occupiedLanes.has(lane));
  const targetLane = getTargetRecommendationLane();

  return champions
    .filter((champion) => !selected.has(champion.displayName))
    .map((champion) => {
      let score = 50;
      const reasons = [];
      recommendationRules.forEach((rule) => {
        if (champion.tags.includes(rule.candidate) && enemyStats.tagCounts[rule.enemy] > 0) {
          score += rule.score;
          reasons.push(rule.text);
        }
      });
      if (targetLane && champion.lanes.includes(targetLane)) {
        score += 16;
        reasons.push(`${laneLabels[targetLane]} 기준 픽`);
      }
      if (allyStats.frontline === 0 && champion.tags.includes("frontline")) { score += 14; reasons.push("앞라인 보강"); }
      if (allyStats.engage === 0 && champion.tags.includes("engage")) { score += 12; reasons.push("이니시 보강"); }
      if (allyStats.peel === 0 && champion.tags.includes("peel")) { score += 10; reasons.push("캐리 보호 가능"); }
      if (!allyStats.hasMagic && champion.damageType !== "AD") { score += 8; reasons.push("AP 밸런스 보완"); }
      if (missingLane && champion.lanes.includes(missingLane)) { score += 10; reasons.push(`${laneLabels[missingLane]} 라인 소화 가능`); }
      if (!reasons.length) reasons.push("범용성 높은 픽");
      return { champion, score, reasons: uniqueTake(reasons, 3) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
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
      if (select.value) {
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
  focusChampionSelectEl.value = state.focusChampionName;
}

function renderLiveGuide() {
  const focus = championMap[state.focusChampionName];
  const profileChampion = championMap[state.profileChampionName] || focus;
  if (!focus) {
    nextItemListEl.innerHTML = "";
    dangerListEl.innerHTML = "";
    advantageListEl.innerHTML = "";
    focusProfileEl.innerHTML = "";
    return;
  }
  const nextItems = getNextItemsFor(focus);
  nextItemListEl.innerHTML = nextItems.map((item) => `
    <article class="stack-row">
      <strong>${item.displayName}</strong>
      <p>${item.summary}</p>
    </article>
  `).join("");

  const enemies = state.enemySlots.map((slot) => slot.champion).filter(Boolean);
  dangerListEl.innerHTML = getThreatList(focus, enemies, false).map((entry) => `<article class="stack-row"><strong>${entry.name}</strong><p>${entry.reason}</p></article>`).join("");
  advantageListEl.innerHTML = getThreatList(focus, enemies, true).map((entry) => `<article class="stack-row"><strong>${entry.name}</strong><p>${entry.reason}</p></article>`).join("");
  focusProfileEl.innerHTML = buildProfileMarkup(profileChampion);
}

function getNextItemsFor(focus) {
  const profileItems = [...focus.coreItems, ...focus.situationalItems];
  const owned = new Set(state.allySlots.find((slot) => slot.champion?.displayName === focus.displayName)?.items || []);
  return uniqueTake(profileItems.filter((name) => !owned.has(name)), 3).map((name) => itemMap[name]).filter(Boolean);
}

function getThreatList(focus, enemies, favorable) {
  return enemies.map((enemy) => ({ enemy, score: matchupScore(focus, enemy) }))
    .sort((a, b) => favorable ? b.score - a.score : a.score - b.score)
    .slice(0, 3)
    .map((entry) => ({
      name: entry.enemy.displayName,
      reason: favorable
        ? "현 시점에서는 거리 관리나 진입 타이밍을 잘 잡으면 압박하기 쉬운 상대로 보입니다."
        : "이 챔피언은 지금 교전 구도에서 먼저 스킬을 맞거나 시야를 내주면 위험도가 큽니다.",
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
        <h4>운영 포인트</h4>
        <p>${champion.laneTip}</p>
        <p>${champion.teamfightTip}</p>
      </article>
      <article class="profile-block">
        <h4>스킬/데미지 데이터</h4>
        <p>현재 저장소에는 챔피언별 스킬 원문과 수치 데이터가 없어서, 이 영역은 운영 포인트 중심으로 우선 연결했습니다.</p>
      </article>
      <article class="profile-block">
        <h4>TMI</h4>
        <p>${champion.tmi}</p>
      </article>
    </div>
  `;
}

function summarizeTeam(team) {
  const summary = { frontline: 0, engage: 0, peel: 0, poke: 0, burst: 0, dps: 0, sustain: 0, scaling: 0, hasMagic: false, hasPhysical: false, tagCounts: {} };
  team.forEach((champion) => {
    champion.tags.forEach((tag) => { summary.tagCounts[tag] = (summary.tagCounts[tag] || 0) + 1; });
    ["frontline", "engage", "peel", "poke", "burst", "dps", "sustain", "scaling"].forEach((tag) => {
      if (champion.tags.includes(tag)) summary[tag] += 1;
    });
    if (champion.damageType !== "AD") summary.hasMagic = true;
    if (champion.damageType !== "AP") summary.hasPhysical = true;
  });
  return summary;
}

function matchupScore(a, b) {
  let score = 0;
  if (a.tags.includes("peel") && (b.tags.includes("engage") || b.tags.includes("burst"))) score += 10;
  if (a.tags.includes("antiTank") && b.tags.includes("frontline")) score += 10;
  if (a.tags.includes("engage") && b.tags.includes("poke")) score += 7;
  if (b.tags.includes("poke") && !a.tags.includes("mobility")) score -= 8;
  if (b.tags.includes("frontline") && !a.tags.includes("antiTank")) score -= 6;
  return score;
}

function getCurrentSlot() {
  return state.activeTeam === "ally" ? state.allySlots[state.activeIndex] : state.enemySlots[state.activeIndex];
}

function getTargetRecommendationLane() {
  if (state.activeTeam === "ally") return state.allySlots[state.activeIndex].lane;
  const emptySlot = state.allySlots.find((slot) => !slot.champion);
  return emptySlot ? emptySlot.lane : null;
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
    state.activeIndex = parsed.activeIndex || 0;
    state.pickerLane = parsed.pickerLane || "all";
    state.search = parsed.search || "";
    state.allySlots = (parsed.allySlots || state.allySlots).map((slot, index) => ({
      lane: slot.lane || lanes[index],
      champion: slot.champion ? championMap[slot.champion] || null : null,
      items: slot.items || [],
    }));
    state.enemySlots = (parsed.enemySlots || state.enemySlots).map((slot) => ({
      champion: slot.champion ? championMap[slot.champion] || null : null,
      items: slot.items || [],
    }));
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
