// Café logic — a faithful port of generate.py's drink sizing + date helpers.
// Word count -> coffee drink; the bigger the read, the bigger the cup.

export interface Drink {
  key: string;
  label: string;
  read: string; // human read-time, e.g. "~30 s" / "~2 min"
  cupPx: number;
}

const WPM = 200;

// Matches Python's len(re.findall(r"\w+", body)): unicode letters/digits/_,
// so "0.02" counts as two tokens and accented words count as one.
export function wordCount(markdown: string): number {
  return (markdown.match(/[\p{L}\p{N}_]+/gu) ?? []).length;
}

// (max_words, key, label, fixed-read-label-or-null, cup_px) — same table as generate.py.
export function classify(words: number): Drink {
  const mins = Math.max(1, Math.round(words / WPM));
  if (words < 120) return { key: "espresso", label: "espresso", read: "~30 s", cupPx: 22 };
  if (words < 400) return { key: "cortado", label: "cortado", read: `~${mins} min`, cupPx: 28 };
  if (words < 900) return { key: "cappuccino", label: "cappuccino", read: `~${mins} min`, cupPx: 34 };
  return { key: "con-leche", label: "café con leche", read: `~${mins} min`, cupPx: 42 };
}

const MONTHS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

// "2026-06-15" -> "15 jun 2026"
export function fmtDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${parseInt(m[3], 10)} ${MONTHS[parseInt(m[2], 10) - 1]} ${m[1]}`;
}

// Title prefaced with its date, e.g. "15 jun 2026 · Hola y bienvenido".
export function displayTitle(title: string, date: string): string {
  return date ? `${fmtDate(date)} · ${title}` : title;
}
