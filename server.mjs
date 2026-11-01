import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);
const seatsApiKey = process.env.SEATS_AERO_API_KEY;
const seatsMode = process.env.SEATS_AERO_MODE === "live" ? "live" : "cached";
const seatsEndpoint = "https://seats.aero/partnerapi";
const supportedSources = ["aeroplan", "united", "lifemiles", "lufthansa", "singapore", "turkish", "american", "alaska", "qantas", "qatar", "finnair", "flyingblue", "delta", "virginatlantic", "emirates", "etihad", "eurobonus", "aeromexico", "velocity", "connectmiles", "smiles", "ethiopian", "saudia", "jetblue"];
const sourceMap = {
  aeroplan: { program: "aeroplan", name: "Aeroplan", airline: "Air Canada" }, united: { program: "united", name: "MileagePlus", airline: "United Airlines" }, lifemiles: { program: "lifemiles", name: "LifeMiles", airline: "Avianca" }, lufthansa: { program: "miles-more", name: "Miles & More", airline: "Lufthansa Group" }, singapore: { program: "krisflyer", name: "KrisFlyer", airline: "Singapore Airlines" }, turkish: { program: "turkish", name: "Miles&Smiles", airline: "Turkish Airlines" }, american: { program: "aa", name: "AAdvantage", airline: "American Airlines" }, alaska: { program: "alaska", name: "Atmos Rewards", airline: "Alaska Airlines" }, qantas: { program: "qantas", name: "Qantas Frequent Flyer", airline: "Qantas" }, qatar: { program: "qatar", name: "Privilege Club", airline: "Qatar Airways" }, finnair: { program: "finnair", name: "Finnair Plus", airline: "Finnair" }, flyingblue: { program: "flying-blue", name: "Flying Blue", airline: "Air France-KLM" }, delta: { program: "delta", name: "SkyMiles", airline: "Delta Air Lines" }, virginatlantic: { program: "virgin", name: "Flying Club", airline: "Virgin Atlantic" }, emirates: { program: "emirates", name: "Skywards", airline: "Emirates" }, etihad: { program: "etihad", name: "Etihad Guest", airline: "Etihad Airways" }
};
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}

function dateShift(value, days) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function readJsonBody(request) {
  let body = "";
  for await (const chunk of request) body += chunk;
  if (body.length > 20_000) throw new Error("request_too_large");
  return body ? JSON.parse(body) : {};
}

function sourceConfig(source) { return sourceMap[source] || { program: source, name: source, airline: source }; }
function value(item, ...keys) { return keys.map((key) => item[key]).find((entry) => entry !== undefined && entry !== null && entry !== ""); }
function pad(number) { return String(number).padStart(2, "0"); }
function timeText(valueToFormat) {
  if (!valueToFormat) return "—";
  const date = new Date(valueToFormat);
  return Number.isNaN(date.valueOf()) ? "—" : `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function durationText(minutes) {
  const total = Number(minutes);
  if (!Number.isFinite(total)) return "—";
  return `${Math.floor(total / 60)}h ${pad(Math.round(total % 60))}m`;
}
function cabinLetter(cabin) { return { economy: "Y", premium: "W", business: "J", first: "F" }[cabin] || "J"; }

function flattenAvailability(payload) {
  const entries = Array.isArray(payload) ? payload : (payload.data || payload.results || payload.availability || []);
  return entries.flatMap((entry) => {
    const trips = value(entry, "Trips", "trips");
    return Array.isArray(trips) && trips.length ? trips : [entry];
  });
}

function normalizeResult(item, requestedCabin) {
  const source = String(value(item, "Source", "source") || "unknown").toLowerCase();
  const config = sourceConfig(source);
  const cabin = String(value(item, "Cabin", "cabin") || requestedCabin || "economy").toLowerCase();
  const letter = cabinLetter(cabin);
  const segments = value(item, "AvailabilitySegments", "availabilitySegments", "segments") || [];
  const firstSegment = segments[0] || {};
  const lastSegment = segments[segments.length - 1] || firstSegment;
  const origin = value(item, "OriginAirport", "originAirport") || value(firstSegment, "OriginAirport", "originAirport") || "—";
  const destination = value(item, "DestinationAirport", "destinationAirport") || value(lastSegment, "DestinationAirport", "destinationAirport") || "—";
  const departure = value(item, "DepartsAt", "departsAt") || value(firstSegment, "DepartsAt", "departsAt") || value(item, "Date", "date");
  const arrival = value(item, "ArrivesAt", "arrivesAt") || value(lastSegment, "ArrivesAt", "arrivesAt") || departure;
  const flightNumbers = value(item, "FlightNumbers", "flightNumbers") || segments.map((segment) => value(segment, "FlightNumber", "flightNumber")).filter(Boolean).join(", ");
  const carriers = value(item, "Carriers", "carriers", "Airlines", "airlines") || config.airline;
  const mileage = Number(value(item, "MileageCost", "mileageCost", `${letter}MileageCost`, `${letter}mileageCost`) || 0);
  const taxes = Number(value(item, "TotalTaxes", "totalTaxes") || 0);
  const stops = Number(value(item, "Stops", "stops") ?? 0);
  const seats = Number(value(item, "RemainingSeats", "remainingSeats", `${letter}RemainingSeats`, `${letter}remainingSeats`) || 0);
  return { program: config.program, programName: config.name, airline: carriers, flight: flightNumbers || "Award itinerary", cabin, cabinLabel: { economy: "經濟艙", premium: "豪華經濟艙", business: "商務艙", first: "頭等艙" }[cabin] || cabin, depart: timeText(departure), arrive: timeText(arrival), duration: durationText(value(item, "TotalDuration", "totalDuration")), stops: stops === 0 ? "直飛" : `${stops} 次轉機`, points: mileage, taxes, currency: value(item, "TaxesCurrency", "taxesCurrency") || "USD", seats, route: `${origin} → ${destination}`, source: seatsMode === "live" ? "Seats.aero live" : "Seats.aero cached", fetchedAt: new Date().toISOString(), available: true };
}

async function seatsRequest(path, options = {}) {
  const response = await fetch(`${seatsEndpoint}${path}`, { ...options, headers: { accept: "application/json", "Partner-Authorization": seatsApiKey, ...(options.headers || {}) } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || `Seats.aero API error (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function querySeats(payload) {
  if (!seatsApiKey) {
    const error = new Error("尚未設定 SEATS_AERO_API_KEY。請在伺服器環境變數加入 Seats.aero Partner API key。");
    error.status = 503;
    throw error;
  }
  const origin = String(payload.origin || "").toUpperCase();
  const destination = String(payload.destination || "").toUpperCase();
  const departure = String(payload.departure || "");
  if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination) || !/^\d{4}-\d{2}-\d{2}$/.test(departure)) {
    const error = new Error("請輸入正確的三碼機場代碼與出發日期。");
    error.status = 400;
    throw error;
  }
  const cabin = payload.cabin === "all" ? undefined : payload.cabin;
  const sources = payload.allPrograms === false ? ["aeroplan"] : supportedSources;
  let items = [];
  if (seatsMode === "live") {
    const responses = await Promise.allSettled(sources.map(async (source) => {
      const body = { origin_airport: origin, destination_airport: destination, departure_date: departure, source, seat_count: Math.min(Math.max(Number(payload.passengers) || 1, 1), 9), smart_cache: true };
      const result = await seatsRequest("/live", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      return flattenAvailability(result).map((item) => ({ ...item, Source: value(item, "Source", "source") || source }));
    }));
    items = responses.flatMap((result) => result.status === "fulfilled" ? result.value : []);
    if (!items.length && responses.every((result) => result.status === "rejected")) throw new Error("Live search 沒有可用結果；請確認 API key 具備 live search 商業授權，或改用 cached 模式。");
  } else {
    const params = new URLSearchParams({ origin_airport: origin, destination_airport: destination, start_date: payload.flexibleDates ? dateShift(departure, -3) : departure, end_date: payload.flexibleDates ? dateShift(departure, 3) : departure, take: "1000", include_trips: "true", order_by: "lowest_mileage" });
    if (cabin) params.set("cabins", cabin);
    if (!payload.allPrograms) params.set("sources", "aeroplan");
    const result = await seatsRequest(`/search?${params}`);
    items = flattenAvailability(result);
  }
  const results = items.map((item) => normalizeResult(item, cabin)).filter((item) => item.points > 0 && (!cabin || item.cabin === cabin));
  return { mode: seatsMode, fetchedAt: new Date().toISOString(), results };
}

const server = createServer(async (request, response) => {
  if (request.method === "POST" && request.url?.split("?")[0] === "/api/search") {
    try {
      const payload = await readJsonBody(request);
      json(response, 200, await querySeats(payload));
    } catch (error) {
      json(response, error.status || 502, { error: error.message?.startsWith("尚未設定") ? "missing_api_key" : "award_search_failed", message: error.message || "即時資料服務暫時無法使用" });
    }
    return;
  }
  const requestPath = request.url?.split("?")[0] || "/";
  const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const filePath = normalize(join(root, relativePath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, { "Content-Type": mime[extname(filePath)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Award Flight Search running at http://localhost:${port}`);
});
