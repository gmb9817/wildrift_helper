(function () {
if (!window.WildriftData) {
  throw new Error("WildriftData failed to load. Check data.js script order.");
}

const {
  champions,
  laneLabels,
  roleLabels,
  difficultyLabels,
  itemMap,
  tagLabels,
} = window.WildriftData;

const state = {
  search: "",
  lane: "all",
  role: "all",
  damage: "all",
  difficulty: "all",
  sort: "name",
  selected: "Ahri",
};

const gridEl = document.getElementById("champion-grid");
const detailEl = document.getElementById("champion-detail");
const resultsMetaEl = document.getElementById("champion-results-meta");

document.getElementById("champion-search").addEventListener("input", (event) => {
  state.search = event.target.value.trim().toLowerCase();
  render();
});

document.getElementById("champion-sort").addEventListener("change", (event) => {
  state.sort = event.target.value;
  render();
});

document.getElementById("champion-reset-filters").addEventListener("click", () => {
  state.search = "";
  state.lane = "all";
  state.role = "all";
  state.damage = "all";
  state.difficulty = "all";
  state.sort = "name";
  document.getElementById("champion-search").value = "";
  document.getElementById("champion-sort").value = "name";
  syncFilterState("champion-lane-filters", "all");
  syncFilterState("champion-role-filters", "all");
  syncFilterState("champion-difficulty-filters", "all");
  syncFilterState("champion-damage-filters", "all");
  render();
});

renderFilterGroup("champion-lane-filters", [{ id: "all", label: "전체" }, ...Object.entries(laneLabels).map(([id, label]) => ({ id, label }))], "lane");
renderFilterGroup("champion-role-filters", [{ id: "all", label: "전체" }, ...Object.entries(roleLabels).map(([id, label]) => ({ id, label }))], "role");
renderFilterGroup("champion-difficulty-filters", [{ id: "all", label: "전체" }, ...Object.entries(difficultyLabels).map(([id, label]) => ({ id, label }))], "difficulty");
renderFilterGroup("champion-damage-filters", [
  { id: "all", label: "전체" },
  { id: "AD", label: "AD" },
  { id: "AP", label: "AP" },
  { id: "Mixed", label: "혼합" },
], "damage");

render();

function renderFilterGroup(containerId, items, type) {
  const container = document.getElementById(containerId);
  items.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `lane-chip${index === 0 ? " active" : ""}`;
    button.textContent = item.label;
    button.dataset.value = item.id;
    button.addEventListener("click", () => {
      container.querySelectorAll(".lane-chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
      state[type] = item.id;
      render();
    });
    container.appendChild(button);
  });
}

function render() {
  const filtered = champions.filter((champion) => {
    const searchMatch = matchesChampionSearch(champion, state.search);
    const laneMatch = state.lane === "all" || champion.lanes.includes(state.lane);
    const roleMatch = state.role === "all" || champion.roles.includes(state.role);
    const damageMatch = state.damage === "all" || champion.damageType === state.damage;
    const difficultyMatch = state.difficulty === "all" || champion.difficulty === state.difficulty;
    return searchMatch && laneMatch && roleMatch && damageMatch && difficultyMatch;
  }).sort((a, b) => compareChampions(a, b, state.sort));

  if (!filtered.find((champion) => champion.displayName === state.selected) && filtered[0]) {
    state.selected = filtered[0].displayName;
  }

  resultsMetaEl.innerHTML = `
    <strong>${filtered.length}명 표시 중</strong>
    <p>${buildFilterSummary(filtered.length)}</p>
  `;

  gridEl.innerHTML = filtered.length ? filtered.map((champion) => `
    <button type="button" class="champion-card${champion.displayName === state.selected ? " active" : ""}" data-champion="${escapeAttr(champion.displayName)}">
      <img src="${champion.image}" alt="${champion.displayName}">
      <div class="champion-card-copy">
        <strong>${champion.displayName}</strong>
        <span class="champion-meta-line">${champion.profileLabel}</span>
        <div class="pill-row">
          <span class="meta-pill">${laneLabels[champion.lanes[0]]}</span>
          <span class="meta-pill">${difficultyLabels[champion.difficulty]}</span>
        </div>
      </div>
    </button>
  `).join("") : `
    <article class="empty-state">
      <strong>조건에 맞는 챔피언이 없습니다.</strong>
      <p>검색어를 줄이거나 라인/역할군/피해 타입 필터를 일부 해제해 보세요.</p>
    </article>
  `;

  gridEl.querySelectorAll("[data-champion]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selected = button.dataset.champion;
      render();
    });
  });

  const champion = filtered.find((item) => item.displayName === state.selected) || filtered[0];
  renderDetail(champion);
}

function renderDetail(champion) {
  if (!champion) {
    detailEl.innerHTML = `<div class="stack-row"><strong>결과 없음</strong><p>조건에 맞는 챔피언이 없습니다.</p></div>`;
    return;
  }

  const recommendedItems = champion.coreItems.slice(0, 3).map((name) => itemMap[name]).filter(Boolean);
  const easyList = getMatchupList(champion, true);
  const hardList = getMatchupList(champion, false);
  const keyTags = champion.tags.filter((tag) => tagLabels[tag]).slice(0, 4);

  detailEl.innerHTML = `
    <div class="champion-detail-header">
      <img src="${champion.image}" alt="${champion.displayName}">
      <div>
        <p class="eyebrow">DETAIL</p>
        <h2>${champion.displayName}</h2>
        <p class="subtle-copy">${champion.flavor}</p>
        <div class="pill-row">
          <span class="meta-pill">${champion.profileLabel}</span>
          <span class="meta-pill">${champion.lanes.map((lane) => laneLabels[lane]).join(" / ")}</span>
          <span class="meta-pill">${champion.damageType}</span>
          <span class="meta-pill">${difficultyLabels[champion.difficulty]}</span>
          ${keyTags.map((tag) => `<span class="meta-pill">${tagLabels[tag]}</span>`).join("")}
        </div>
      </div>
    </div>
    <div class="detail-grid">
      <article class="profile-block">
        <h4>핵심 강점</h4>
        <ul>${champion.strengths.map((text) => `<li>${text}</li>`).join("")}</ul>
      </article>
      <article class="profile-block">
        <h4>핵심 약점</h4>
        <ul>${champion.weaknesses.map((text) => `<li>${text}</li>`).join("")}</ul>
      </article>
      <article class="profile-block">
        <h4>상대하기 쉬운 챔피언</h4>
        <ul>${easyList.map((entry) => `<li><strong>${entry.name}</strong>: ${entry.reason}</li>`).join("")}</ul>
      </article>
      <article class="profile-block">
        <h4>상대하기 까다로운 챔피언</h4>
        <ul>${hardList.map((entry) => `<li><strong>${entry.name}</strong>: ${entry.reason}</li>`).join("")}</ul>
      </article>
      <article class="profile-block">
        <h4>추천 빌드 방향</h4>
        <p>${champion.buildSummary}</p>
        <ul>${recommendedItems.map((item, index) => `<li><strong>${item.displayName}</strong>: ${describeItemFit(champion, item, index)}</li>`).join("")}</ul>
      </article>
      <article class="profile-block">
        <h4>추천 상황 / 피해야 할 상황</h4>
        <p>${champion.whenToPick}</p>
        <p>${champion.avoidPick}</p>
      </article>
      <article class="profile-block">
        <h4>파워 스파이크 / 승리 플랜</h4>
        <p>${champion.powerSpike}</p>
        <p>${champion.winCondition}</p>
      </article>
      <article class="profile-block">
        <h4>라인전 팁</h4>
        <p>${champion.laneTip}</p>
      </article>
      <article class="profile-block">
        <h4>한타 / 운영 팁</h4>
        <p>${champion.teamfightTip}</p>
        <p>${champion.objectivePlan}</p>
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

function getMatchupList(champion, favorable) {
  return champions
    .filter((item) => item.displayName !== champion.displayName)
    .map((item) => ({ name: item.displayName, champion: item, score: matchupScore(champion, item) }))
    .sort((a, b) => favorable ? b.score - a.score : a.score - b.score)
    .slice(0, 3)
    .map((item) => ({
      name: item.name,
      reason: favorable ? describeFavorableMatchup(champion, item.champion) : describeHardMatchup(champion, item.champion),
    }));
}

function matchupScore(a, b) {
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
  return score;
}

function describeItemFit(champion, item, index) {
  if (index === 0) return `초반 핵심 코어로 ${champion.profileLabel} 역할을 가장 안정적으로 열어 줍니다.`;
  if ((item.tags || []).includes("antiTank")) return "탱커 비중이 높아질수록 체감 가치가 커지는 선택지입니다.";
  if ((item.tags || []).includes("antiHeal")) return "회복 조합을 상대할 때 우선순위가 빠르게 올라갑니다.";
  if ((item.tags || []).includes("survival")) return "상대 첫 진입을 한 번 버틴 뒤 다시 딜할 시간을 벌어 줍니다.";
  return item.summary || `${champion.displayName}의 기본 빌드 흐름에 자주 들어가는 아이템입니다.`;
}

function describeFavorableMatchup(a, b) {
  if (a.tags.includes("antiTank") && b.tags.includes("frontline")) return "정면 전투가 길어질수록 전열 압박 효율을 내기 좋습니다.";
  if (a.tags.includes("engage") && b.tags.includes("poke")) return "대치전을 오래 끌기 전에 강제로 교전을 열 수 있습니다.";
  if (a.tags.includes("antiDash") && b.tags.includes("mobility")) return "상대 기동력을 제어하며 교전 각을 제한하기 쉽습니다.";
  if (a.tags.includes("burst") && !b.tags.includes("frontline")) return "빈 순간을 잡으면 빠르게 체력 우위를 만들기 좋습니다.";
  return "스킬 템포와 포지션 관리만 맞으면 먼저 주도권을 잡기 쉬운 상성입니다.";
}

function describeHardMatchup(a, b) {
  if (b.tags.includes("engage") && !a.tags.includes("peel") && !a.tags.includes("frontline")) return "상대가 먼저 교전을 강제하면 받아내는 축이 부족해 까다롭습니다.";
  if (b.tags.includes("poke") && !a.tags.includes("mobility")) return "사거리 차이로 전투 전 체력이 빠지기 쉬워 라인과 대치전이 불편합니다.";
  if (b.tags.includes("burst") && (a.roles.includes("Marksman") || a.tags.includes("scaling"))) return "성장 구간이나 얇은 포지션을 노리는 폭딜 압박을 계속 의식해야 합니다.";
  if (b.tags.includes("frontline") && !a.tags.includes("antiTank")) return "정면으로 오래 싸우면 전열을 뚫는 속도가 부족할 수 있습니다.";
  return "교전 각과 시야를 조금만 잘못 줘도 상성 열세가 크게 체감되는 편입니다.";
}

function matchesChampionSearch(champion, query) {
  if (!query) return true;
  const normalized = query.toLowerCase();
  const compact = normalized.replace(/[^a-z0-9가-힣]/g, "");
  return champion.searchText.includes(normalized) || champion.searchText.includes(compact);
}

function compareChampions(a, b, sort) {
  if (sort === "difficulty") return a.difficultyRank - b.difficultyRank || a.displayName.localeCompare(b.displayName);
  if (sort === "versatile") return b.versatilityScore - a.versatilityScore || a.displayName.localeCompare(b.displayName);
  if (sort === "late") return Number(b.tags.includes("scaling")) - Number(a.tags.includes("scaling")) || Number(b.tags.includes("dps")) - Number(a.tags.includes("dps")) || a.displayName.localeCompare(b.displayName);
  return a.displayName.localeCompare(b.displayName);
}

function buildFilterSummary(count) {
  const damageLabels = { AD: "AD", AP: "AP", Mixed: "혼합" };
  const parts = [];
  if (state.lane !== "all") parts.push(laneLabels[state.lane]);
  if (state.role !== "all") parts.push(roleLabels[state.role]);
  if (state.damage !== "all") parts.push(damageLabels[state.damage] || state.damage);
  if (state.difficulty !== "all") parts.push(difficultyLabels[state.difficulty]);
  return parts.length ? `${parts.join(" / ")} 조건으로 ${count}명을 보고 있습니다.` : "전체 챔피언 풀에서 탐색 중입니다.";
}

function syncFilterState(containerId, activeValue) {
  const container = document.getElementById(containerId);
  Array.from(container.querySelectorAll(".lane-chip")).forEach((button) => {
    button.classList.toggle("active", button.dataset.value === activeValue);
  });
}

function escapeAttr(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}
})();
