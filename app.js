const airportNames = {
  TPE: "桃園", TSA: "松山", KHH: "高雄", HKG: "香港", NRT: "東京成田", HND: "東京羽田", KIX: "大阪關西", ICN: "首爾仁川", SIN: "新加坡", BKK: "曼谷", LAX: "洛杉磯", SFO: "舊金山", SEA: "西雅圖", JFK: "紐約甘迺迪", YVR: "溫哥華", YYZ: "多倫多", LHR: "倫敦希斯洛", CDG: "巴黎戴高樂", FRA: "法蘭克福", AMS: "阿姆斯特丹", SYD: "雪梨", MEL: "墨爾本", DXB: "杜拜", DOH: "杜哈"
};

const programs = [
  { id: "aeroplan", name: "Aeroplan", airline: "Air Canada", alliance: "Star Alliance", mark: "AC" },
  { id: "united", name: "MileagePlus", airline: "United Airlines", alliance: "Star Alliance", mark: "UA" },
  { id: "lifemiles", name: "LifeMiles", airline: "Avianca", alliance: "Star Alliance", mark: "AV" },
  { id: "miles-more", name: "Miles & More", airline: "Lufthansa Group", alliance: "Star Alliance", mark: "MM" },
  { id: "krisflyer", name: "KrisFlyer", airline: "Singapore Airlines", alliance: "Star Alliance", mark: "SQ" },
  { id: "ana", name: "Mileage Club", airline: "ANA", alliance: "Star Alliance", mark: "NH" },
  { id: "turkish", name: "Miles&Smiles", airline: "Turkish Airlines", alliance: "Star Alliance", mark: "TK" },
  { id: "eva", name: "Infinity MileageLands", airline: "EVA Air", alliance: "Star Alliance", mark: "BR" },
  { id: "singapore", name: "KrisFlyer", airline: "Singapore Airlines", alliance: "Star Alliance", mark: "SQ" },
  { id: "aa", name: "AAdvantage", airline: "American Airlines", alliance: "oneworld", mark: "AA" },
  { id: "alaska", name: "Atmos Rewards", airline: "Alaska Airlines", alliance: "oneworld", mark: "AS" },
  { id: "british", name: "The British Airways Club", airline: "British Airways", alliance: "oneworld", mark: "BA" },
  { id: "iberia", name: "Iberia Club", airline: "Iberia", alliance: "oneworld", mark: "IB" },
  { id: "cathay", name: "Asia Miles", airline: "Cathay Pacific", alliance: "oneworld", mark: "CX" },
  { id: "jal", name: "JAL Mileage Bank", airline: "Japan Airlines", alliance: "oneworld", mark: "JL" },
  { id: "qantas", name: "Qantas Frequent Flyer", airline: "Qantas", alliance: "oneworld", mark: "QF" },
  { id: "qatar", name: "Privilege Club", airline: "Qatar Airways", alliance: "oneworld", mark: "QR" },
  { id: "finnair", name: "Finnair Plus", airline: "Finnair", alliance: "oneworld", mark: "AY" },
  { id: "flying-blue", name: "Flying Blue", airline: "Air France-KLM", alliance: "SkyTeam", mark: "AF" },
  { id: "delta", name: "SkyMiles", airline: "Delta Air Lines", alliance: "SkyTeam", mark: "DL" },
  { id: "virgin", name: "Flying Club", airline: "Virgin Atlantic", alliance: "Partner", mark: "VS" },
  { id: "emirates", name: "Skywards", airline: "Emirates", alliance: "Partner", mark: "EK" },
  { id: "etihad", name: "Etihad Guest", airline: "Etihad Airways", alliance: "Partner", mark: "EY" },
  { id: "asia-miles", name: "Asia Miles", airline: "Cathay Pacific", alliance: "oneworld", mark: "CX" }
];

const demoFlights = [
  { program: "aeroplan", airline: "Air Canada", flight: "AC 018", cabin: "business", cabinLabel: "商務艙", depart: "18:40", arrive: "14:15", duration: "13h 35m", stops: "1 次轉機", points: 75000, taxes: 485, currency: "TWD", value: 2.8, route: "TPE → YVR → LAX", source: "Demo provider" },
  { program: "krisflyer", airline: "Singapore Airlines", flight: "SQ 878", cabin: "business", cabinLabel: "商務艙", depart: "16:10", arrive: "18:55", duration: "16h 45m", stops: "1 次轉機", points: 85000, taxes: 1780, currency: "TWD", value: 2.5, route: "TPE → SIN → LAX", source: "Demo provider" },
  { program: "aa", airline: "American Airlines", flight: "AA 170", cabin: "business", cabinLabel: "商務艙", depart: "10:25", arrive: "08:10", duration: "15h 45m", stops: "直飛", points: 70000, taxes: 1240, currency: "TWD", value: 3.1, route: "TPE → LAX", source: "Demo provider" },
  { program: "united", airline: "United Airlines", flight: "UA 872", cabin: "economy", cabinLabel: "經濟艙", depart: "09:50", arrive: "06:35", duration: "12h 45m", stops: "直飛", points: 44000, taxes: 1310, currency: "TWD", value: 2.2, route: "TPE → SFO → LAX", source: "Demo provider" },
  { program: "qatar", airline: "Qatar Airways", flight: "QR 893", cabin: "business", cabinLabel: "商務艙", depart: "18:35", arrive: "16:40", duration: "24h 05m", stops: "1 次轉機", points: 90000, taxes: 2980, currency: "TWD", value: 2.1, route: "TPE → DOH → LAX", source: "Demo provider" },
  { program: "flying-blue", airline: "Air France", flight: "AF 557", cabin: "premium", cabinLabel: "豪華經濟艙", depart: "23:55", arrive: "18:20", duration: "23h 25m", stops: "1 次轉機", points: 68000, taxes: 4120, currency: "TWD", value: 1.9, route: "TPE → CDG → LAX", source: "Demo provider" },
  { program: "lifemiles", airline: "Avianca", flight: "AV 071", cabin: "economy", cabinLabel: "經濟艙", depart: "13:20", arrive: "11:50", duration: "19h 30m", stops: "1 次轉機", points: 38000, taxes: 890, currency: "TWD", value: 2.4, route: "TPE → SFO → LAX", source: "Demo provider" },
  { program: "cathay", airline: "Cathay Pacific", flight: "CX 880", cabin: "business", cabinLabel: "商務艙", depart: "00:05", arrive: "20:45", duration: "17h 40m", stops: "1 次轉機", points: 84000, taxes: 2390, currency: "TWD", value: 2.6, route: "TPE → HKG → LAX", source: "Demo provider" },
  { program: "delta", airline: "Delta Air Lines", flight: "DL 178", cabin: "economy", cabinLabel: "經濟艙", depart: "11:40", arrive: "08:25", duration: "16h 45m", stops: "1 次轉機", points: 52000, taxes: 1670, currency: "TWD", value: 1.8, route: "TPE → SEA → LAX", source: "Demo provider" }
];

const state = { results: [...demoFlights], filter: "all", sort: "points", saved: JSON.parse(localStorage.getItem("award-saved") || "[]") };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function getDate(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function formatNumber(value) { return new Intl.NumberFormat("zh-TW").format(value); }
function programFor(id) { return programs.find((program) => program.id === id) || programs[0]; }
function updateAirportName(field) {
  const value = $(field).value.trim().toUpperCase();
  $(`#${field.replace("#", "")}-name`).textContent = airportNames[value] || "自訂機場";
}

function renderPrograms() {
  $("#program-count").textContent = `${programs.length} 個計畫`;
  $("#program-grid").innerHTML = programs.map((program) => `<article class="program-card"><strong>${program.name}</strong><span>${program.airline} · ${program.alliance}</span></article>`).join("");
}

function visibleResults() {
  let items = [...state.results];
  if (state.filter === "saved") items = items.filter((item) => state.saved.includes(itemKey(item)));
  if (["business", "economy"].includes(state.filter)) items = items.filter((item) => item.cabin === state.filter);
  if (state.filter === "nonstop") items = items.filter((item) => item.stops === "直飛");
  if (state.filter === "lowtax") items = items.filter((item) => item.taxes < 1500);
  const sorters = { points: (a, b) => a.points - b.points, taxes: (a, b) => a.taxes - b.taxes, duration: (a, b) => parseDuration(a.duration) - parseDuration(b.duration), value: (a, b) => b.value - a.value };
  return items.sort(sorters[state.sort]);
}

function parseDuration(duration) { const [hours, minutes] = duration.match(/(\d+)h\s*(\d+)m/).slice(1).map(Number); return hours * 60 + minutes; }
function itemKey(item) { return `${item.program}-${item.flight}-${item.points}`; }

function renderResults() {
  const items = visibleResults();
  $("#result-count").textContent = items.length;
  $("#saved-count").textContent = state.saved.length;
  if (!items.length) {
    $("#results").innerHTML = `<div class="empty-state"><strong>沒有符合目前篩選的結果</strong><span>試試看放寬艙等、取消直飛，或切換其他快速篩選。</span></div>`;
    return;
  }
  $("#results").innerHTML = items.map((item) => {
    const program = programFor(item.program);
    const saved = state.saved.includes(itemKey(item));
    return `<article class="result-card"><div class="airline-meta"><div class="airline-main"><span class="airline-logo">${program.mark}</span><span>${item.airline}</span></div><div class="subline">${item.flight} · ${item.cabinLabel}</div></div><div class="flight-meta"><div class="flight-time">${item.depart}<span class="arrow">→</span>${item.arrive}</div><div class="flight-route">${item.route} · ${item.stops}</div></div><div class="price-meta"><div class="price-main">${formatNumber(item.points)} <small>點</small></div><div class="taxes">+ ${formatNumber(item.taxes)} ${item.currency} 稅費</div></div><div class="source-meta"><span class="availability">可兌換</span><div class="source">${program.name} · ${item.source}</div></div><button class="save-button ${saved ? "saved" : ""}" data-save="${itemKey(item)}" aria-label="${saved ? "取消收藏" : "收藏"}">${saved ? "♥" : "♡"}</button></article>`;
  }).join("");
}

function runSearch(event) {
  event?.preventDefault();
  const origin = $("#origin").value.trim().toUpperCase() || "TPE";
  const destination = $("#destination").value.trim().toUpperCase() || "LAX";
  const cabin = $("#cabin").value;
  const allPrograms = $("#all-programs").checked;
  const departure = $("#departure").value;
  const seed = (origin + destination + departure).split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
  state.results = demoFlights.map((flight, index) => ({ ...flight, route: flight.route.replace("TPE", origin).replace("LAX", destination), points: flight.points + ((seed + index * 13) % 5) * 1000 })).filter((flight) => (allPrograms || flight.program === "aeroplan") && (cabin === "all" || flight.cabin === cabin));
  state.filter = "all";
  $$(".filter-pill").forEach((button) => button.classList.toggle("active", button.dataset.filter === "all"));
  $("#updated-at").textContent = new Intl.DateTimeFormat("zh-TW", { hour: "2-digit", minute: "2-digit" }).format(new Date());
  renderResults();
  $("#results-section").scrollIntoView({ behavior: "smooth", block: "start" });
}

$("#departure").value = getDate(21);
$("#return").value = getDate(28);
$("#updated-at").textContent = new Intl.DateTimeFormat("zh-TW", { hour: "2-digit", minute: "2-digit" }).format(new Date());
renderPrograms();
renderResults();

$("#search-form").addEventListener("submit", runSearch);
$("#origin").addEventListener("input", () => updateAirportName("#origin"));
$("#destination").addEventListener("input", () => updateAirportName("#destination"));
$("#swap-route").addEventListener("click", () => { const origin = $("#origin").value; $("#origin").value = $("#destination").value; $("#destination").value = origin; updateAirportName("#origin"); updateAirportName("#destination"); });
$("#sort-by").addEventListener("change", (event) => { state.sort = event.target.value; renderResults(); });
$("#saved-nav").addEventListener("click", () => { state.filter = "saved"; $$(".filter-pill").forEach((button) => button.classList.toggle("active", button.dataset.filter === "saved")); renderResults(); $("#results-section").scrollIntoView({ behavior: "smooth" }); });
$("#results").addEventListener("click", (event) => { const button = event.target.closest("[data-save]"); if (!button) return; const key = button.dataset.save; state.saved = state.saved.includes(key) ? state.saved.filter((item) => item !== key) : [...state.saved, key]; localStorage.setItem("award-saved", JSON.stringify(state.saved)); renderResults(); });
$(".quick-filters").addEventListener("click", (event) => { const button = event.target.closest("[data-filter]"); if (!button) return; state.filter = button.dataset.filter; $$(".filter-pill").forEach((item) => item.classList.toggle("active", item === button)); renderResults(); });
$(".trip-type").addEventListener("click", (event) => { const button = event.target.closest("[data-trip-type]"); if (!button) return; $$(".trip-tab").forEach((tab) => tab.classList.toggle("active", tab === button)); $("#return").disabled = button.dataset.tripType === "oneway"; });
