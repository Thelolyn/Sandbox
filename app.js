let tripData = {};
let currentTab = "hotels";

const cardContainer = document.getElementById("card-container");
const statusFilter = document.getElementById("status-filter");
const tabs = document.querySelectorAll(".tab");

// Fetch data and initialize
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    tripData = data;
    renderCards();
    updateFilterOptions();
  })
  .catch(() => {
    cardContainer.innerHTML =
      '<p class="empty-state">Could not load trip data. Make sure data.json exists.</p>';
  });

// Tab switching
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentTab = tab.dataset.tab;
    statusFilter.value = "all";
    updateFilterOptions();
    renderCards();
  });
});

// Status filter
statusFilter.addEventListener("change", renderCards);

function updateFilterOptions() {
  const items = tripData[currentTab] || [];
  const statuses = [...new Set(items.map((item) => item.status))];

  statusFilter.innerHTML = '<option value="all">All</option>';
  statuses.forEach((s) => {
    const option = document.createElement("option");
    option.value = s;
    option.textContent = s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ");
    statusFilter.appendChild(option);
  });
}

function renderCards() {
  const filter = statusFilter.value;
  let items = tripData[currentTab] || [];

  if (filter !== "all") {
    items = items.filter((item) => item.status === filter);
  }

  if (items.length === 0) {
    cardContainer.innerHTML = '<p class="empty-state">No items to show.</p>';
    return;
  }

  cardContainer.innerHTML = items.map((item) => buildCard(item)).join("");
}

function buildCard(item) {
  const meta = buildMeta(item);
  const details = buildDetails(item);

  return `
    <div class="card">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">
      <div class="card-body">
        <div class="card-header">
          <h3>${escapeHtml(item.name)}</h3>
          <span class="status status--${escapeHtml(item.status)}">${escapeHtml(item.status.replace("-", " "))}</span>
        </div>
        <div class="card-meta">
          <span class="rating">\u2605 ${item.rating}</span>
          ${meta}
        </div>
        ${details}
        <p class="notes">${escapeHtml(item.notes)}</p>
        <a href="${escapeHtml(item.link)}" target="_blank" rel="noopener">More info \u2192</a>
      </div>
    </div>
  `;
}

function buildMeta(item) {
  if (item.pricePerNight) return `<span>${escapeHtml(item.pricePerNight)}/night</span>`;
  if (item.price) return `<span>${escapeHtml(item.price)}</span>`;
  if (item.priceRange) return `<span>${escapeHtml(item.priceRange)}</span>`;
  return "";
}

function buildDetails(item) {
  const parts = [];
  if (item.location) parts.push(`<p class="card-detail">\uD83D\uDCCD ${escapeHtml(item.location)}</p>`);
  if (item.duration) parts.push(`<p class="card-detail">\u23F1 ${escapeHtml(item.duration)}</p>`);
  if (item.cuisine) parts.push(`<p class="card-detail">\uD83C\uDF7D\uFE0F ${escapeHtml(item.cuisine)}</p>`);
  return parts.join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}
