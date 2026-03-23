if (!window.WildriftData) {
  throw new Error("WildriftData failed to load. Check data.js script order.");
}

const {
  champions,
  laneLabels,
  roleLabels,
  difficultyLabels,
  itemMap,
} = window.WildriftData;

const state = {
  search: "",
  lane: "all",
  role: "all",
  difficulty: "all",
  selected: "Ahri",
};

const gridEl = document.getElementById("champion-grid");
const detailEl = document.getElementById("champion-detail");

document.getElementById("champion-search").addEventListener("input", (event) => {
  state.search = event.target.value.trim().toLowerCase();
  render();
});

renderFilterGroup("champion-lane-filters", [{ id: "all", label: "전체" }, ...Object.entries(laneLabels).map(([id, label]) => ({ id, label }))], "lane");
renderFilterGroup("champion-role-filters", [{ id: "all", label: "전체" }, ...Object.entries(roleLabels).map(([id, label]) => ({ id, label }))], "role");
renderFilterGroup("champion-difficulty-filters", [{ id: "all", label: "전체" }, ...Object.entries(difficultyLabels).map(([id, label]) => ({ id, label }))], "difficulty");

render();

function renderFilterGroup(containerId, items, type) {
  const container = document.getElementById(containerId);
  items.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `lane-chip${index === 0 ? " active" : ""}`;
    button.textContent = item.label;
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
    const searchMatch = champion.displayName.toLowerCase().includes(state.search);
    const laneMatch = state.lane === "all" || champion.lanes.includes(state.lane);
    const roleMatch = state.role === "all" || champion.roles.includes(state.role);
    const difficultyMatch = state.difficulty === "all" || champion.difficulty === state.difficulty;
    return searchMatch && laneMatch && roleMatch && difficultyMatch;
  });

  if (!filtered.find((champion) => champion.displayName === state.selected) && filtered[0]) {
    state.selected = filtered[0].displayName;
  }

  gridEl.innerHTML = filtered.map((champion) => `
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
  `).join("");

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
        <ul>${easyList.map((name) => `<li>${name}</li>`).join("")}</ul>
      </article>
      <article class="profile-block">
        <h4>상대하기 까다로운 챔피언</h4>
        <ul>${hardList.map((name) => `<li>${name}</li>`).join("")}</ul>
      </article>
      <article class="profile-block">
        <h4>추천 빌드 방향</h4>
        <ul>${recommendedItems.map((item) => `<li>${item.displayName}: ${item.summary}</li>`).join("")}</ul>
      </article>
      <article class="profile-block">
        <h4>라인전 팁</h4>
        <p>${champion.laneTip}</p>
      </article>
      <article class="profile-block">
        <h4>한타 / 운영 팁</h4>
        <p>${champion.teamfightTip}</p>
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
    .map((item) => ({ name: item.displayName, score: matchupScore(champion, item) }))
    .sort((a, b) => favorable ? b.score - a.score : a.score - b.score)
    .slice(0, 3)
    .map((item) => item.name);
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

function escapeAttr(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}
