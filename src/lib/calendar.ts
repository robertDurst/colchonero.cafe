// Calendar logic — parse the events CSV and shape it into month grids.
// Data lives in src/data/calendario.csv (date,time,title,location,type).

export interface CalEvent {
  date: string; // YYYY-MM-DD
  time: string;
  title: string;
  location: string;
  type: string;
}

// A single day inside a rendered month grid.
export interface DayCell {
  day: number | null; // null = padding cell before/after the month
  iso: string; // "" for padding cells
  events: CalEvent[];
}

export interface MonthGrid {
  year: number;
  month: number; // 1-12
  label: string; // "agosto 2026"
  weeks: DayCell[][]; // rows of 7, Monday-first
  events: CalEvent[]; // this month's events, sorted
}

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// Monday-first weekday headers.
export const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

// Maps a free-text event type to a stable css-class key for colour-coding.
// Unknown types fall back to "otro".
export function typeKey(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("mundial") || t.includes("world cup") || t.includes("copa del mundo")) return "mundial";
  if (t.includes("champions") || t.includes("uefa") || t.includes("europa")) return "champions";
  if (t.includes("liga")) return "liga";
  if (t.includes("copa")) return "copa";
  if (t.includes("amistoso") || t.includes("pretemporada")) return "amistoso";
  return "otro";
}

// Splits one CSV line into fields, honouring double-quoted values that
// may contain commas. Doubled quotes ("") become a literal quote.
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      out.push(field);
      field = "";
    } else field += c;
  }
  out.push(field);
  return out.map((f) => f.trim());
}

// Parses the CSV text into events. Skips blank lines, "#" comments, and the
// header row. Rows without a valid YYYY-MM-DD date are dropped.
export function parseEvents(csv: string): CalEvent[] {
  const events: CalEvent[] = [];
  for (const raw of csv.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const [date = "", time = "", title = "", location = "", type = ""] = splitCsvLine(raw);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue; // also skips the header row
    events.push({ date, time, title, location, type });
  }
  return events.sort((a, b) =>
    a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date),
  );
}

const pad2 = (n: number) => String(n).padStart(2, "0");

// Builds a Monday-first grid for EVERY month from the first event month to the
// last, inclusive — empty in-between months are included so navigation steps
// through them instead of jumping over the gaps.
export function buildMonths(events: CalEvent[]): MonthGrid[] {
  if (events.length === 0) return [];

  const byMonth = new Map<string, CalEvent[]>();
  for (const ev of events) {
    const key = ev.date.slice(0, 7); // "YYYY-MM"
    (byMonth.get(key) ?? byMonth.set(key, []).get(key)!).push(ev);
  }

  const keys = [...byMonth.keys()].sort();
  const [firstYear, firstMonth] = keys[0].split("-").map(Number);
  const [lastYear, lastMonth] = keys[keys.length - 1].split("-").map(Number);

  const grids: MonthGrid[] = [];
  let year = firstYear;
  let month = firstMonth;
  while (year < lastYear || (year === lastYear && month <= lastMonth)) {
    const monthEvents = byMonth.get(`${year}-${pad2(month)}`) ?? [];
    const dayEvents = new Map<number, CalEvent[]>();
    for (const ev of monthEvents) {
      const d = Number(ev.date.slice(8, 10));
      (dayEvents.get(d) ?? dayEvents.set(d, []).get(d)!).push(ev);
    }

    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    // Monday-first offset for the 1st of the month (Sun=0 -> 6, Mon=1 -> 0).
    const lead = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;

    const cells: DayCell[] = [];
    for (let i = 0; i < lead; i++) cells.push({ day: null, iso: "", events: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        iso: `${year}-${pad2(month)}-${pad2(d)}`,
        events: dayEvents.get(d) ?? [],
      });
    }
    while (cells.length % 7 !== 0) cells.push({ day: null, iso: "", events: [] });

    const weeks: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    grids.push({
      year,
      month,
      label: `${MONTHS[month - 1]} ${year}`,
      weeks,
      events: monthEvents,
    });

    month++;
    if (month > 12) { month = 1; year++; }
  }
  return grids;
}

// "2026-08-16" -> "sáb 16 ago"
const DOW = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MONTHS_SHORT = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];
export function fmtEventDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const [, y, mo, d] = m.map(Number);
  const dow = DOW[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()];
  return `${dow} ${d} ${MONTHS_SHORT[mo - 1]}`;
}
